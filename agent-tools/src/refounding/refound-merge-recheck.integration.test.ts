import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { ok } from '@oaknational/result';
import { afterEach, describe, expect, it } from 'vitest';

import { countLines, renderJsonArtefact, sha256Hex } from './refounding-artefacts.js';
import { type DenominatorAmendment } from './refound-amendments.js';
import { type SecretScan } from './refound-freeze-helpers.js';
import { runFreeze } from './refound-freeze-runner.js';
import { runMergeRecheck } from './refound-merge-recheck-helpers.js';
import { ARRIVALS_BASENAME, parseArrivalsReport } from './refound-merge-recheck-model.js';

/**
 * The D8 discrimination proofs for `refound-merge-recheck` (F1 §5 row
 * merge-recheck, D4, §7): every detector class fires against a genuine
 * freeze on a temporary tree before any green from the tool is trusted, and
 * every refusal is proven to write nothing.
 */

const tempRoots: string[] = [];

afterEach(async () => {
  await Promise.all(tempRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

const cleanScan: SecretScan = () => Promise.resolve(ok(undefined));

interface RecheckFixture {
  readonly repoRoot: string;
  readonly outDirAbs: string;
  readonly frozenRoot: string;
  readonly ruleAbsPath: string;
  readonly arrivalsAbsPath: string;
}

const RULE_V1 = {
  version: 1,
  ratifiedBy: '.agent/decisions/g1.md',
  classes: [{ id: 'plans', globs: ['.agent/plans/**'], verdict: 'in', reason: 'estate' }],
};

/** A v2 rule: same in-set plus one path-scoped sanctioned-writer class. */
const RULE_V2 = {
  ...RULE_V1,
  version: 2,
  sanctionedWriters: [
    {
      id: 'new-lane-directories',
      globs: ['.agent/plans/lanes/**'],
      reason: 'Destination plans authored by the refounding under ratified lane roots.',
    },
  ],
};

/** Build a real freeze to drift from — proofs must fire against genuine artefacts. */
async function makeRecheckFixture(rule: Record<string, unknown>): Promise<RecheckFixture> {
  const repoRoot = await mkdtemp(path.join(tmpdir(), 'refound-recheck-'));
  tempRoots.push(repoRoot);
  const files: Record<string, string> = {
    '.agent/plans/a.md': '# A\n\nbody line\n',
    '.agent/plans/sub/b.md': 'line one\nline two\n',
    '.agent/plans-refounding/freeze-rule.json': `${JSON.stringify(rule, null, 2)}\n`,
  };
  for (const [relPath, content] of Object.entries(files)) {
    const absPath = path.join(repoRoot, relPath);
    await mkdir(path.dirname(absPath), { recursive: true });
    await writeFile(absPath, content);
  }
  const outDirAbs = path.join(repoRoot, '.agent/plans-refounding');
  const ruleAbsPath = path.join(outDirAbs, 'freeze-rule.json');
  const frozen = await runFreeze({ repoRoot, ruleAbsPath, outDirAbs, secretScan: cleanScan });
  expect(frozen.ok).toBe(true);
  return {
    repoRoot,
    outDirAbs,
    frozenRoot: path.join(outDirAbs, 'archive/frozen-v1'),
    ruleAbsPath,
    arrivalsAbsPath: path.join(outDirAbs, ARRIVALS_BASENAME),
  };
}

const recheck = (fixture: RecheckFixture) =>
  runMergeRecheck({
    repoRoot: fixture.repoRoot,
    ruleAbsPath: fixture.ruleAbsPath,
    outDirAbs: fixture.outDirAbs,
  });

async function readReport(fixture: RecheckFixture): Promise<unknown> {
  const raw: unknown = JSON.parse(await readFile(fixture.arrivalsAbsPath, 'utf8'));
  return raw;
}

describe('runMergeRecheck — discrimination proofs (D8, F1 §7)', () => {
  it('is green over an undrifted live tree and writes an all-zero report', async () => {
    const fixture = await makeRecheckFixture(RULE_V1);
    const summary = await recheck(fixture);
    expect(summary.ok).toBe(true);
    if (summary.ok) {
      expect(summary.value.red).toBe(false);
      expect(summary.value.added).toBe(0);
      expect(summary.value.modified).toBe(0);
      expect(summary.value.deleted).toBe(0);
      expect(summary.value.sanctioned).toBe(0);
    }
    const parsed = parseArrivalsReport(await readReport(fixture));
    expect(parsed.ok).toBe(true);
  });

  it('fires on a planted arrival: a new file on an in surface classifies added and goes RED', async () => {
    const fixture = await makeRecheckFixture(RULE_V1);
    await writeFile(path.join(fixture.repoRoot, '.agent/plans/new.md'), '# New arrival\n');

    const summary = await recheck(fixture);
    expect(summary.ok).toBe(true);
    if (summary.ok) {
      expect(summary.value.red).toBe(true);
      expect(summary.value.added).toBe(1);
    }
    const parsed = parseArrivalsReport(await readReport(fixture));
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.value.added).toHaveLength(1);
      expect(parsed.value.added[0]?.source).toBe('.agent/plans/new.md');
      expect(parsed.value.added[0]?.frozenPath).toBe('plans/new.md');
    }
  });

  it('fires on a planted byte flip: strict byte identity classifies modified', async () => {
    const fixture = await makeRecheckFixture(RULE_V1);
    const liveAbsPath = path.join(fixture.repoRoot, '.agent/plans/a.md');
    const bytes = await readFile(liveAbsPath);
    bytes[0] = bytes[0] ^ 0xff;
    await writeFile(liveAbsPath, bytes);

    const summary = await recheck(fixture);
    expect(summary.ok).toBe(true);
    if (summary.ok) {
      expect(summary.value.red).toBe(true);
      expect(summary.value.modified).toBe(1);
    }
  });

  it('classifies ANY live edit as modified — a banner-shaped appended line is no exemption', async () => {
    const fixture = await makeRecheckFixture(RULE_V1);
    const liveAbsPath = path.join(fixture.repoRoot, '.agent/plans/a.md');
    const original = await readFile(liveAbsPath, 'utf8');
    await writeFile(
      liveAbsPath,
      `${original}\n> NOTE: this plan is frozen for refounding; see the frozen archive.\n`,
    );

    const summary = await recheck(fixture);
    expect(summary.ok).toBe(true);
    if (summary.ok) {
      expect(summary.value.red).toBe(true);
      expect(summary.value.modified).toBe(1);
    }
  });

  it('reports a deletion in frozen coordinates, report-only — no RED, no amendment pressure', async () => {
    const fixture = await makeRecheckFixture(RULE_V1);
    await rm(path.join(fixture.repoRoot, '.agent/plans/sub/b.md'));

    const summary = await recheck(fixture);
    expect(summary.ok).toBe(true);
    if (summary.ok) {
      expect(summary.value.red).toBe(false);
      expect(summary.value.deleted).toBe(1);
    }
    const parsed = parseArrivalsReport(await readReport(fixture));
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.value.deleted).toEqual([
        expect.objectContaining({ frozenPath: 'plans/sub/b.md' }),
      ]);
    }
  });

  it('classifies a write under a sanctioned-writer glob as sanctioned — reported, never RED', async () => {
    const fixture = await makeRecheckFixture(RULE_V2);
    const laneAbsPath = path.join(fixture.repoRoot, '.agent/plans/lanes/alpha.plan.md');
    await mkdir(path.dirname(laneAbsPath), { recursive: true });
    await writeFile(laneAbsPath, '# Lane alpha\n');

    const summary = await recheck(fixture);
    expect(summary.ok).toBe(true);
    if (summary.ok) {
      expect(summary.value.red).toBe(false);
      expect(summary.value.sanctioned).toBe(1);
      expect(summary.value.added).toBe(0);
    }
    const parsed = parseArrivalsReport(await readReport(fixture));
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.value.sanctioned[0]?.classId).toBe('new-lane-directories');
      expect(parsed.value.sanctioned[0]?.change).toBe('added');
    }
  });

  it('does NOT sanction the same write outside the sanctioned globs', async () => {
    const fixture = await makeRecheckFixture(RULE_V2);
    await writeFile(path.join(fixture.repoRoot, '.agent/plans/alpha.plan.md'), '# Lane alpha\n');

    const summary = await recheck(fixture);
    expect(summary.ok).toBe(true);
    if (summary.ok) {
      expect(summary.value.red).toBe(true);
      expect(summary.value.sanctioned).toBe(0);
      expect(summary.value.added).toBe(1);
    }
  });

  /** Route one arrival: frozen copy + amendment-1.json (row + identity proof). */
  async function routeArrivalByAmendment(
    fixture: RecheckFixture,
    frozenPath: string,
    content: string,
  ): Promise<void> {
    const bytes = Buffer.from(content, 'utf8');
    const copyAbsPath = path.join(fixture.frozenRoot, frozenPath);
    await mkdir(path.dirname(copyAbsPath), { recursive: true });
    await writeFile(copyAbsPath, bytes);
    const amendment: DenominatorAmendment = {
      version: 1,
      files: [
        {
          path: frozenPath,
          bytes: bytes.length,
          sha256: sha256Hex(bytes),
          lines: countLines(bytes),
          inventory_mode: 'lines',
        },
      ],
      identityProof: [
        {
          path: frozenPath,
          source_sha256: sha256Hex(bytes),
          copy_sha256: sha256Hex(bytes),
          bytes: bytes.length,
        },
      ],
    };
    const amendmentAbsPath = path.join(fixture.outDirAbs, 'amendments', 'amendment-1.json');
    await mkdir(path.dirname(amendmentAbsPath), { recursive: true });
    await writeFile(amendmentAbsPath, renderJsonArtefact(amendment), 'utf8');
  }

  it('stops flagging a routed arrival once its amendment lands (effective denominator)', async () => {
    const fixture = await makeRecheckFixture(RULE_V1);
    const content = '# New arrival\n\nrouted after detection\n';
    await writeFile(path.join(fixture.repoRoot, '.agent/plans/new.md'), content);
    const before = await recheck(fixture);
    expect(before.ok).toBe(true);
    if (before.ok) {
      expect(before.value.red).toBe(true);
    }

    await routeArrivalByAmendment(fixture, 'plans/new.md', content);

    const after = await recheck(fixture);
    expect(after.ok).toBe(true);
    if (after.ok) {
      expect(after.value.red).toBe(false);
      expect(after.value.added).toBe(0);
    }
  });

  it('writes a byte-identical report on a double run (determinism contract)', async () => {
    const fixture = await makeRecheckFixture(RULE_V2);
    await writeFile(path.join(fixture.repoRoot, '.agent/plans/new.md'), '# New arrival\n');
    await rm(path.join(fixture.repoRoot, '.agent/plans/sub/b.md'));

    const first = await recheck(fixture);
    expect(first.ok).toBe(true);
    const firstBytes = await readFile(fixture.arrivalsAbsPath);
    const second = await recheck(fixture);
    expect(second.ok).toBe(true);
    const secondBytes = await readFile(fixture.arrivalsAbsPath);
    expect(firstBytes.equals(secondBytes)).toBe(true);
  });
});

describe('runMergeRecheck — refusals (nothing written)', () => {
  async function expectRefusalWithoutReport(
    fixture: RecheckFixture,
    messageFragment: string,
  ): Promise<void> {
    await rm(fixture.arrivalsAbsPath, { force: true });
    const summary = await recheck(fixture);
    expect(summary.ok).toBe(false);
    if (!summary.ok) {
      expect(summary.error.message).toContain(messageFragment);
    }
    await expect(readFile(fixture.arrivalsAbsPath)).rejects.toThrow();
  }

  it('refuses an unratified rule, writing nothing', async () => {
    const fixture = await makeRecheckFixture(RULE_V1);
    await writeFile(
      fixture.ruleAbsPath,
      `${JSON.stringify({ ...RULE_V1, ratifiedBy: null }, null, 2)}\n`,
    );
    await expectRefusalWithoutReport(fixture, 'unratified');
  });

  it('refuses a missing denominator, writing nothing', async () => {
    const fixture = await makeRecheckFixture(RULE_V1);
    await rm(path.join(fixture.outDirAbs, 'denominator.v1.json'));
    await expectRefusalWithoutReport(fixture, 'denominator');
  });

  it('refuses an amendment lacking its identity proof, writing nothing', async () => {
    const fixture = await makeRecheckFixture(RULE_V1);
    const amendment: DenominatorAmendment = {
      version: 1,
      files: [
        {
          path: 'plans/new.md',
          bytes: 5,
          sha256: 'a'.repeat(64),
          lines: 1,
          inventory_mode: 'lines',
        },
      ],
      identityProof: [
        {
          path: 'plans/other.md',
          source_sha256: 'a'.repeat(64),
          copy_sha256: 'a'.repeat(64),
          bytes: 5,
        },
      ],
    };
    const amendmentAbsPath = path.join(fixture.outDirAbs, 'amendments', 'amendment-1.json');
    await mkdir(path.dirname(amendmentAbsPath), { recursive: true });
    await writeFile(amendmentAbsPath, renderJsonArtefact(amendment), 'utf8');
    await expectRefusalWithoutReport(fixture, 'identity proof');
  });

  it('refuses an empty live in-set (mis-run, not a mass deletion), writing nothing', async () => {
    const fixture = await makeRecheckFixture(RULE_V1);
    // Empty the live source tree while the freeze (denominator + frozen copies)
    // stays intact: the in-set is now empty, which is a mis-run — refused before
    // any classification would turn every frozen row into a phantom deletion.
    await rm(path.join(fixture.repoRoot, '.agent/plans'), { recursive: true, force: true });
    await expectRefusalWithoutReport(fixture, 'mis-run');
  });

  it('refuses a live in-set symlink escaping the repository, writing nothing', async () => {
    const fixture = await makeRecheckFixture(RULE_V1);
    const outsideRoot = await mkdtemp(path.join(tmpdir(), 'refound-outside-'));
    tempRoots.push(outsideRoot);
    // A symlinked DIRECTORY smuggling outside content, created as a
    // 'junction' so the fixture needs no privilege on Windows (plain
    // symlinks need admin or Developer Mode there); ignored on POSIX. The
    // refusal under test is the same: an in-set path whose real location
    // escapes the repository is refused before anything is written.
    await writeFile(path.join(outsideRoot, 'payload.md'), '# outside the repository\n');
    await symlink(outsideRoot, path.join(fixture.repoRoot, '.agent/plans/smuggled'), 'junction');
    await expectRefusalWithoutReport(fixture, 'smuggled');
  });
});
