import assert from 'node:assert';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { ok, unwrap } from '@oaknational/result';
import { glob } from 'tinyglobby';
import { afterEach, describe, expect, it } from 'vitest';

import {
  compareByCodeUnit,
  countLines,
  renderJsonArtefact,
  renderJsonlArtefact,
  sha256Hex,
} from './refounding-artefacts.js';
import { type DenominatorAmendment } from './refound-amendments.js';
import { runDefaultLedger } from './refound-default-ledger-helpers.js';
import { type SecretScan } from './refound-freeze-helpers.js';
import { runFreeze } from './refound-freeze-runner.js';
import { runInventory } from './refound-inventory-runner.js';
import { parseLedgerJsonl } from './refound-ledger-row.js';
import { runTile } from './refound-tile-helpers.js';

/**
 * The end-to-end proof for `refound-tile` (F1 §5 row `refound-tile`, D5,
 * D8): a realistic fixture corpus runs freeze → inventory → default-ledger
 * emitter → tile GREEN, then planted defects flip it RED with exact
 * coordinates. Tile is a VERIFIER ONLY — the nothing-written proof snapshots
 * the artefact home around both green and red runs.
 */

const tempRoots: string[] = [];

afterEach(async () => {
  // maxRetries: Windows briefly holds child handles (indexer, Defender)
  // after writes, so an immediate recursive rmdir can fail ENOTEMPTY —
  // Node's own retry knob exists for exactly this platform behaviour.
  await Promise.all(
    tempRoots
      .splice(0)
      .map((root) => rm(root, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })),
  );
});

const cleanScan: SecretScan = () => Promise.resolve(ok(undefined));

const RULE = {
  version: 1,
  ratifiedBy: '.agent/decisions/g1.md',
  classes: [
    { id: 'plans', globs: ['.agent/plans/**'], verdict: 'in', reason: 'estate' },
    { id: 'milestones', globs: ['.agent/milestones/**'], verdict: 'in', reason: 'adjacent' },
  ],
};

/** Anchor ratio ~42% (10 anchors / 24 md lines) — inside the H2 band. */
const CORPUS: Record<string, string> = {
  '.agent/plans/alpha/one.md': '# Alpha one\n\nProse line one.\n\n- first item\n\nProse tail.\n',
  '.agent/plans/alpha/two.md': '# Alpha two\n\n- a\n- b\n\nClosing prose.\n',
  '.agent/plans/alpha/data.tsv': 'x\ty\n',
  '.agent/plans/beta/three.md': '# Beta three\n\nBody text.\n\n- only item\n',
  '.agent/plans/beta/empty.md': '',
  '.agent/plans/root.md': '# Root navigation\n\nPointer prose.\n',
  '.agent/milestones/m.md': '# Milestone\n\n- first checkpoint\n',
};

interface TileFixture {
  readonly repoRoot: string;
  readonly outDirAbs: string;
  readonly frozenRoot: string;
  readonly ledgerDirAbs: string;
}

/** Freeze + inventory + default ledgers over the fixture corpus. */
async function makeTiledFixture(): Promise<TileFixture> {
  const repoRoot = await mkdtemp(path.join(tmpdir(), 'refound-tile-'));
  tempRoots.push(repoRoot);
  const files: Record<string, string> = {
    ...CORPUS,
    '.agent/plans-refounding/freeze-rule.json': `${JSON.stringify(RULE, null, 2)}\n`,
  };
  for (const [relPath, content] of Object.entries(files)) {
    const absPath = path.join(repoRoot, relPath);
    await mkdir(path.dirname(absPath), { recursive: true });
    await writeFile(absPath, content);
  }
  const outDirAbs = path.join(repoRoot, '.agent/plans-refounding');
  const frozen = await runFreeze({
    repoRoot,
    ruleAbsPath: path.join(outDirAbs, 'freeze-rule.json'),
    outDirAbs,
    secretScan: cleanScan,
  });
  expect(frozen.ok).toBe(true);
  const inventoried = await runInventory({ outDirAbs });
  expect(inventoried.ok).toBe(true);
  const emitted = await runDefaultLedger({ outDirAbs });
  expect(emitted.ok).toBe(true);
  return {
    repoRoot,
    outDirAbs,
    frozenRoot: path.join(outDirAbs, 'archive/frozen-v1'),
    ledgerDirAbs: path.join(outDirAbs, 'ledger'),
  };
}

/** Recursive content snapshot of the artefact home (nothing-written proof). */
async function snapshotHome(outDirAbs: string): Promise<ReadonlyMap<string, string>> {
  const relPaths = await glob(['**'], { cwd: outDirAbs, dot: true });
  const snapshot = new Map<string, string>();
  for (const relPath of [...relPaths].sort(compareByCodeUnit)) {
    snapshot.set(relPath, sha256Hex(await readFile(path.join(outDirAbs, relPath))));
  }
  return snapshot;
}

describe('runTile — emitter → tile end-to-end (D8)', () => {
  it('is GREEN over the emitted default ledgers, and writes NOTHING', async () => {
    const fixture = await makeTiledFixture();
    const before = await snapshotHome(fixture.outDirAbs);
    const report = await runTile({ outDirAbs: fixture.outDirAbs });
    expect(report.ok).toBe(true);
    if (report.ok) {
      expect(report.value.violations).toEqual([]);
      expect(report.value.areas).toBe(4);
    }
    expect(await snapshotHome(fixture.outDirAbs)).toEqual(before);
  });

  it('flips RED on a planted gap with the removed row exact coordinates, writing nothing', async () => {
    const fixture = await makeTiledFixture();
    const ledgerAbsPath = path.join(fixture.ledgerDirAbs, 'plans--alpha.ledger.jsonl');
    const rows = unwrap(
      parseLedgerJsonl('plans--alpha.ledger.jsonl', await readFile(ledgerAbsPath, 'utf8')),
    );
    const removed = rows.at(-1);
    assert(removed !== undefined, 'fixture invariant: the plans--alpha ledger must have a row');
    await writeFile(ledgerAbsPath, renderJsonlArtefact(rows.slice(0, -1)), 'utf8');

    const before = await snapshotHome(fixture.outDirAbs);
    const report = unwrap(await runTile({ outDirAbs: fixture.outDirAbs }));
    expect(report.violations).toEqual([
      {
        kind: 'gap',
        file: removed.file,
        lineStart: removed.line_start,
        lineEnd: removed.line_end,
      },
    ]);
    expect(await snapshotHome(fixture.outDirAbs)).toEqual(before);
  });

  it('flips RED on a planted overlap', async () => {
    const fixture = await makeTiledFixture();
    const ledgerAbsPath = path.join(fixture.ledgerDirAbs, 'plans--alpha.ledger.jsonl');
    const rows = unwrap(
      parseLedgerJsonl('plans--alpha.ledger.jsonl', await readFile(ledgerAbsPath, 'utf8')),
    );
    const target = rows.find((candidate) => candidate.file === 'plans/alpha/one.md');
    assert(target !== undefined, 'fixture invariant: plans/alpha/one.md must have a ledger row');
    const widened = { ...target, line_end: target.line_end + 1 };
    const others = rows.filter((candidate) => candidate !== target);
    await writeFile(ledgerAbsPath, renderJsonlArtefact([widened, ...others]), 'utf8');

    const report = unwrap(await runTile({ outDirAbs: fixture.outDirAbs }));
    expect(report.violations).toEqual([
      {
        kind: 'overlap',
        file: target.file,
        lineStart: target.line_end + 1,
        lineEnd: target.line_end + 1,
      },
    ]);
  });

  it('returns byte-equal reports across a double run (determinism)', async () => {
    const fixture = await makeTiledFixture();
    const first = await runTile({ outDirAbs: fixture.outDirAbs });
    const second = await runTile({ outDirAbs: fixture.outDirAbs });
    expect(first).toEqual(second);
  });
});

describe('runTile — --area slice semantics', () => {
  it('verifies ONLY the requested area, even while another area is not yet tiled', async () => {
    const fixture = await makeTiledFixture();
    await rm(path.join(fixture.ledgerDirAbs, 'plans--beta.ledger.jsonl'));
    const report = await runTile({ outDirAbs: fixture.outDirAbs, area: 'plans--alpha' });
    expect(report.ok).toBe(true);
    if (report.ok) {
      expect(report.value.violations).toEqual([]);
      expect(report.value.areas).toBe(1);
    }
  });

  it('flags a row citing another area file as a violation, never a skip', async () => {
    const fixture = await makeTiledFixture();
    const alphaPath = path.join(fixture.ledgerDirAbs, 'plans--alpha.ledger.jsonl');
    const betaPath = path.join(fixture.ledgerDirAbs, 'plans--beta.ledger.jsonl');
    const alphaRows = unwrap(
      parseLedgerJsonl('plans--alpha.ledger.jsonl', await readFile(alphaPath, 'utf8')),
    );
    const betaRows = unwrap(
      parseLedgerJsonl('plans--beta.ledger.jsonl', await readFile(betaPath, 'utf8')),
    );
    const foreign = betaRows[0];
    assert(foreign !== undefined, 'fixture invariant: the plans--beta ledger must have a row');
    await writeFile(alphaPath, renderJsonlArtefact([...alphaRows, foreign]), 'utf8');

    const report = unwrap(await runTile({ outDirAbs: fixture.outDirAbs, area: 'plans--alpha' }));
    expect(report.violations).toEqual([
      {
        kind: 'unknown-file',
        file: foreign.file,
        lineStart: foreign.line_start,
        blockId: foreign.block_id,
      },
    ]);
  });

  it('refuses an --area matching no denominator file', async () => {
    const fixture = await makeTiledFixture();
    const report = await runTile({ outDirAbs: fixture.outDirAbs, area: 'plans--nonexistent' });
    expect(report.ok).toBe(false);
    if (!report.ok) {
      expect(report.error.message).toContain('plans--nonexistent');
    }
  });
});

describe('runTile — refusals vs computed verdicts (never conflated)', () => {
  it('REFUSES a requested area whose ledger file is ABSENT (not yet tiled)', async () => {
    const fixture = await makeTiledFixture();
    await rm(path.join(fixture.ledgerDirAbs, 'plans--beta.ledger.jsonl'));
    const report = await runTile({ outDirAbs: fixture.outDirAbs, area: 'plans--beta' });
    expect(report.ok).toBe(false);
    if (!report.ok) {
      expect(report.error.message).toContain('not yet tiled');
    }
  });

  it('computes a RED total-gap verdict over an EMPTY ledger file', async () => {
    const fixture = await makeTiledFixture();
    await writeFile(path.join(fixture.ledgerDirAbs, 'plans--beta.ledger.jsonl'), '', 'utf8');
    const report = await runTile({ outDirAbs: fixture.outDirAbs, area: 'plans--beta' });
    expect(report.ok).toBe(true);
    if (report.ok) {
      expect(report.value.violations).toEqual([
        { kind: 'gap', file: 'plans/beta/three.md', lineStart: 1, lineEnd: 5 },
      ]);
    }
  });

  it('refuses a malformed ledger line, citing artefact file and line', async () => {
    const fixture = await makeTiledFixture();
    const ledgerAbsPath = path.join(fixture.ledgerDirAbs, 'plans--alpha.ledger.jsonl');
    const text = await readFile(ledgerAbsPath, 'utf8');
    await writeFile(ledgerAbsPath, `not json{\n${text}`, 'utf8');
    const report = await runTile({ outDirAbs: fixture.outDirAbs, area: 'plans--alpha' });
    expect(report.ok).toBe(false);
    if (!report.ok) {
      expect(report.error.message).toContain('plans--alpha.ledger.jsonl');
      expect(report.error.message).toContain('line 1');
    }
  });

  it('refuses a missing inventory', async () => {
    const fixture = await makeTiledFixture();
    await rm(path.join(fixture.outDirAbs, 'inventory.v1.jsonl'));
    const report = await runTile({ outDirAbs: fixture.outDirAbs });
    expect(report.ok).toBe(false);
    if (!report.ok) {
      expect(report.error.message).toContain('inventory');
    }
  });

  it('refuses a missing denominator', async () => {
    const fixture = await makeTiledFixture();
    await rm(path.join(fixture.outDirAbs, 'denominator.v1.json'));
    const report = await runTile({ outDirAbs: fixture.outDirAbs });
    expect(report.ok).toBe(false);
    if (!report.ok) {
      expect(report.error.message).toContain('denominator');
    }
  });
});

describe('runTile — amendment-extended file set (F1 §7)', () => {
  /** Land an arrival amendment: frozen copy + amendment-1.json. */
  async function landAmendment(
    fixture: TileFixture,
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

  it('divides by the EFFECTIVE denominator: an un-tiled amendment file is a gap, a tiled one is green', async () => {
    const fixture = await makeTiledFixture();
    const content = 'Arrived prose without any anchor.\nSecond line.\n';
    await landAmendment(fixture, 'plans/alpha/arrived.md', content);

    const red = await runTile({ outDirAbs: fixture.outDirAbs, area: 'plans--alpha' });
    expect(red.ok).toBe(true);
    if (red.ok) {
      expect(red.value.violations).toEqual([
        { kind: 'gap', file: 'plans/alpha/arrived.md', lineStart: 1, lineEnd: 2 },
      ]);
    }

    const ledgerAbsPath = path.join(fixture.ledgerDirAbs, 'plans--alpha.ledger.jsonl');
    const existing = await readFile(ledgerAbsPath, 'utf8');
    const preambleRow = {
      block_id: 'plans/alpha/arrived.md:1-2',
      file: 'plans/alpha/arrived.md',
      line_start: 1,
      line_end: 2,
      disposition: 'default-block',
      home: '',
      binding: '',
    };
    await writeFile(ledgerAbsPath, `${existing}${JSON.stringify(preambleRow)}\n`, 'utf8');

    const green = await runTile({ outDirAbs: fixture.outDirAbs, area: 'plans--alpha' });
    expect(green.ok).toBe(true);
    if (green.ok) {
      expect(green.value.violations).toEqual([]);
    }
  });

  it('REFUSES to run when an amendment lacks its identity proof (F1 §7 verbatim)', async () => {
    const fixture = await makeTiledFixture();
    const amendment = {
      version: 1,
      files: [
        {
          path: 'plans/alpha/arrived.md',
          bytes: 5,
          sha256: sha256Hex(Buffer.from('x\n')),
          lines: 1,
          inventory_mode: 'lines',
        },
      ],
      identityProof: [
        {
          path: 'plans/alpha/other.md',
          source_sha256: sha256Hex(Buffer.from('x\n')),
          copy_sha256: sha256Hex(Buffer.from('x\n')),
          bytes: 5,
        },
      ],
    };
    const amendmentAbsPath = path.join(fixture.outDirAbs, 'amendments', 'amendment-1.json');
    await mkdir(path.dirname(amendmentAbsPath), { recursive: true });
    await writeFile(amendmentAbsPath, renderJsonArtefact(amendment), 'utf8');

    const report = await runTile({ outDirAbs: fixture.outDirAbs });
    expect(report.ok).toBe(false);
    if (!report.ok) {
      expect(report.error.message).toContain('identity proof');
    }
  });
});
