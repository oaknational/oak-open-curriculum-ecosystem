import { existsSync } from 'node:fs';
import { mkdtemp, mkdir, readdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { err, ok } from '@oaknational/result';
import { afterEach, describe, expect, it } from 'vitest';

import {
  compareByCodeUnit,
  parseDenominator,
  parseFreezeIdentityProof,
} from './refounding-artefacts.js';
import { probeGitleaksVersion, resolveTrustedGitleaks } from './refound-gitleaks.js';
import { type SecretScan } from './refound-freeze-helpers.js';
import { partialMarkerPath } from './refound-freeze-plan.js';
import { runFreeze } from './refound-freeze-runner.js';

/**
 * Integration behaviours of the freeze run over real temporary trees: the
 * refusal chain writes nothing, the copies are byte-verbatim, the artefacts
 * are deterministic, the secret scan runs before any copy AND again over the
 * frozen copies, and every post-copy failure rolls the partial freeze back.
 */

const tempRoots: string[] = [];

afterEach(async () => {
  await Promise.all(tempRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

const cleanScan: SecretScan = () => Promise.resolve(ok(undefined));

/** Write a tree of files (string or bytes) under `root`, creating parents. */
async function writeTree(root: string, files: Record<string, string | Buffer>): Promise<void> {
  for (const [relPath, content] of Object.entries(files)) {
    const absPath = path.join(root, relPath);
    await mkdir(path.dirname(absPath), { recursive: true });
    await writeFile(absPath, content);
  }
}

interface Fixture {
  readonly repoRoot: string;
  readonly ruleAbsPath: string;
  readonly outDirAbs: string;
  readonly frozenRoot: string;
}

/** A six-file source estate plus a ratified (or unratified) rule document. */
async function makeFixture(options: { ratifiedBy?: string | null } = {}): Promise<Fixture> {
  const repoRoot = await mkdtemp(path.join(tmpdir(), 'refound-freeze-'));
  tempRoots.push(repoRoot);
  const ratifiedBy = 'ratifiedBy' in options ? options.ratifiedBy : '.agent/decisions/g1.md';
  const rule = {
    version: 1,
    ratifiedBy,
    classes: [
      { id: 'plans', globs: ['.agent/plans/**'], verdict: 'in', reason: 'estate' },
      { id: 'milestones', globs: ['.agent/milestones/**'], verdict: 'in', reason: 'adjacent' },
      { id: 'proposals', globs: ['.agent/proposals/**'], verdict: 'in', reason: 'triage' },
      { id: 'reports', globs: ['.agent/reports/**'], verdict: 'out', reason: 'assessment input' },
    ],
  };
  await writeTree(repoRoot, {
    '.agent/plans/a.md': '# A\n\nbody line\n',
    '.agent/plans/sub/b.md': 'crlf line one\r\nline two\r\n',
    '.agent/plans/data.tsv': 'x\ty\n1\t2\n',
    '.agent/plans/blob.bin': Buffer.from([0x00, 0x01, 0x02, 0xff]),
    '.agent/milestones/m1.md': '# M1\n',
    '.agent/proposals/p1.md': '# P1\n',
    '.agent/reports/excluded.md': '# not frozen\n',
    '.agent/plans-refounding/freeze-rule.json': `${JSON.stringify(rule, null, 2)}\n`,
  });
  const outDirAbs = path.join(repoRoot, '.agent/plans-refounding');
  return {
    repoRoot,
    ruleAbsPath: path.join(outDirAbs, 'freeze-rule.json'),
    outDirAbs,
    frozenRoot: path.join(outDirAbs, 'archive/frozen-v1'),
  };
}

/** Assert that a refusal left no artefacts behind. */
function expectNothingWritten(fixture: Fixture): void {
  expect(existsSync(fixture.frozenRoot)).toBe(false);
  expect(existsSync(path.join(fixture.outDirAbs, 'denominator.v1.json'))).toBe(false);
  expect(existsSync(path.join(fixture.outDirAbs, 'proofs/freeze-identity.v1.json'))).toBe(false);
}

/** Run a happy-path freeze over a fresh fixture, asserting it succeeds. */
async function freezeHappyFixture(): Promise<Fixture> {
  const fixture = await makeFixture();
  const result = await runFreeze({ ...fixture, secretScan: cleanScan });
  expect(result.ok).toBe(true);
  if (result.ok) {
    expect(result.value.fileCount).toBe(6);
  }
  return fixture;
}

describe('runFreeze — happy path', () => {
  it('copies the in-set byte-verbatim and never touches out classes', async () => {
    const fixture = await freezeHappyFixture();
    const binCopy = await readFile(path.join(fixture.frozenRoot, 'plans/blob.bin'));
    expect(binCopy.equals(Buffer.from([0x00, 0x01, 0x02, 0xff]))).toBe(true);
    const crlfCopy = await readFile(path.join(fixture.frozenRoot, 'plans/sub/b.md'));
    expect(crlfCopy.equals(Buffer.from('crlf line one\r\nline two\r\n'))).toBe(true);
    expect(existsSync(path.join(fixture.frozenRoot, 'reports/excluded.md'))).toBe(false);
  });

  it('derives a parseable denominator: sorted paths, per-file modes, summed totals', async () => {
    const fixture = await freezeHappyFixture();
    const denominatorRaw: unknown = JSON.parse(
      await readFile(path.join(fixture.outDirAbs, 'denominator.v1.json'), 'utf8'),
    );
    const denominator = parseDenominator(denominatorRaw);
    expect(denominator.ok).toBe(true);
    if (denominator.ok) {
      const byPath = new Map(denominator.value.files.map((f) => [f.path, f]));
      expect(byPath.get('plans/a.md')?.inventory_mode).toBe('lines');
      expect(byPath.get('plans/data.tsv')?.inventory_mode).toBe('whole-file');
      expect(byPath.get('plans/blob.bin')?.inventory_mode).toBe('opaque');
      expect(denominator.value.totals.files).toBe(6);
      const paths = denominator.value.files.map((f) => f.path);
      expect(paths).toEqual([...paths].sort(compareByCodeUnit));
    }
  });

  it('writes an identity proof with copy hashes equal to source hashes', async () => {
    const fixture = await freezeHappyFixture();
    const proofRaw: unknown = JSON.parse(
      await readFile(path.join(fixture.outDirAbs, 'proofs/freeze-identity.v1.json'), 'utf8'),
    );
    const proof = parseFreezeIdentityProof(proofRaw);
    expect(proof.ok).toBe(true);
    if (proof.ok) {
      expect(proof.value).toHaveLength(6);
      for (const entry of proof.value) {
        expect(entry.copy_sha256).toBe(entry.source_sha256);
      }
    }
  });

  it('produces a byte-identical denominator for identical source trees (determinism)', async () => {
    const first = await makeFixture();
    const second = await makeFixture();
    const firstRun = await runFreeze({ ...first, secretScan: cleanScan });
    const secondRun = await runFreeze({ ...second, secretScan: cleanScan });
    expect(firstRun.ok).toBe(true);
    expect(secondRun.ok).toBe(true);
    const firstBytes = await readFile(path.join(first.outDirAbs, 'denominator.v1.json'));
    const secondBytes = await readFile(path.join(second.outDirAbs, 'denominator.v1.json'));
    expect(firstBytes.equals(secondBytes)).toBe(true);
  });

  it('never enumerates its own artefact homes, even under a covering glob', async () => {
    const repoRoot = await mkdtemp(path.join(tmpdir(), 'refound-freeze-'));
    tempRoots.push(repoRoot);
    const rule = {
      version: 1,
      ratifiedBy: '.agent/decisions/g1.md',
      classes: [{ id: 'all', globs: ['.agent/**'], verdict: 'in', reason: 'covering glob' }],
    };
    await writeTree(repoRoot, {
      '.agent/plans/keep.md': 'kept\n',
      '.agent/plans-refounding/freeze-rule.json': `${JSON.stringify(rule, null, 2)}\n`,
      '.agent/plans-refounding/stray-artefact.json': '{}\n',
      'agent-tools/src/refounding/instrument.ts': 'export {};\n',
    });
    const outDirAbs = path.join(repoRoot, '.agent/plans-refounding');
    const result = await runFreeze({
      repoRoot,
      ruleAbsPath: path.join(outDirAbs, 'freeze-rule.json'),
      outDirAbs,
      secretScan: cleanScan,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.fileCount).toBe(1);
    }
    const frozenRoot = path.join(outDirAbs, 'archive/frozen-v1');
    expect(existsSync(path.join(frozenRoot, 'plans/keep.md'))).toBe(true);
    expect(existsSync(path.join(frozenRoot, 'plans-refounding'))).toBe(false);
  });

  it('subtracts an out class overlapping an in glob (G3.3: operational registers stay unfrozen)', async () => {
    const repoRoot = await mkdtemp(path.join(tmpdir(), 'refound-freeze-'));
    tempRoots.push(repoRoot);
    const rule = {
      version: 1,
      ratifiedBy: '.agent/decisions/g1.md',
      classes: [
        { id: 'plans', globs: ['.agent/plans/**'], verdict: 'in', reason: 'estate' },
        {
          id: 'operational-registers',
          globs: ['.agent/plans/frictions-register.md'],
          verdict: 'out',
          reason: 'operational surface, not a plan (owner ruling G3.3)',
        },
      ],
    };
    await writeTree(repoRoot, {
      '.agent/plans/a.md': '# A\n',
      '.agent/plans/frictions-register.md': '# register — churns through any work\n',
      '.agent/plans-refounding/freeze-rule.json': `${JSON.stringify(rule, null, 2)}\n`,
    });
    const outDirAbs = path.join(repoRoot, '.agent/plans-refounding');
    const result = await runFreeze({
      repoRoot,
      ruleAbsPath: path.join(outDirAbs, 'freeze-rule.json'),
      outDirAbs,
      secretScan: cleanScan,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.fileCount).toBe(1);
    }
    const frozenRoot = path.join(outDirAbs, 'archive/frozen-v1');
    expect(existsSync(path.join(frozenRoot, 'plans/a.md'))).toBe(true);
    expect(existsSync(path.join(frozenRoot, 'plans/frictions-register.md'))).toBe(false);
    const denominatorRaw: unknown = JSON.parse(
      await readFile(path.join(outDirAbs, 'denominator.v1.json'), 'utf8'),
    );
    const denominator = parseDenominator(denominatorRaw);
    expect(denominator.ok).toBe(true);
    if (denominator.ok) {
      expect(denominator.value.files.map((f) => f.path)).toEqual(['plans/a.md']);
    }
  });

  it('refuses (nothing written) when out classes subtract the entire in set, naming subtraction', async () => {
    const repoRoot = await mkdtemp(path.join(tmpdir(), 'refound-freeze-'));
    tempRoots.push(repoRoot);
    const rule = {
      version: 1,
      ratifiedBy: '.agent/decisions/g1.md',
      classes: [
        { id: 'plans', globs: ['.agent/plans/**'], verdict: 'in', reason: 'estate' },
        { id: 'everything-out', globs: ['.agent/plans/**'], verdict: 'out', reason: 'mis-rule' },
      ],
    };
    await writeTree(repoRoot, {
      '.agent/plans/a.md': '# A\n',
      '.agent/plans-refounding/freeze-rule.json': `${JSON.stringify(rule, null, 2)}\n`,
    });
    const outDirAbs = path.join(repoRoot, '.agent/plans-refounding');
    const result = await runFreeze({
      repoRoot,
      ruleAbsPath: path.join(outDirAbs, 'freeze-rule.json'),
      outDirAbs,
      secretScan: cleanScan,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("after subtracting 'out' classes");
    }
    expect(existsSync(path.join(outDirAbs, 'archive/frozen-v1'))).toBe(false);
    expect(existsSync(path.join(outDirAbs, 'denominator.v1.json'))).toBe(false);
  });
});

describe('runFreeze — refusal chain (nothing written)', () => {
  it('refuses an unratified rule and writes nothing', async () => {
    const fixture = await makeFixture({ ratifiedBy: null });
    const result = await runFreeze({ ...fixture, secretScan: cleanScan });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('unratified');
    }
    expectNothingWritten(fixture);
  });

  it('does not create a fresh --out directory when the run refuses', async () => {
    const fixture = await makeFixture({ ratifiedBy: null });
    const freshOutDir = path.join(fixture.repoRoot, '.agent/refound-out-fresh');
    const result = await runFreeze({
      repoRoot: fixture.repoRoot,
      ruleAbsPath: fixture.ruleAbsPath,
      outDirAbs: freshOutDir,
      secretScan: cleanScan,
    });
    expect(result.ok).toBe(false);
    expect(existsSync(freshOutDir)).toBe(false);
  });

  it('refuses when a non-empty frozen tree already exists, writing no artefacts', async () => {
    const fixture = await makeFixture();
    await writeTree(fixture.outDirAbs, { 'archive/frozen-v1/plans/old.md': 'old freeze\n' });
    const result = await runFreeze({ ...fixture, secretScan: cleanScan });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('denominator amendment');
    }
    expect(existsSync(path.join(fixture.outDirAbs, 'denominator.v1.json'))).toBe(false);
    expect(existsSync(path.join(fixture.outDirAbs, 'proofs/freeze-identity.v1.json'))).toBe(false);
  });

  it('names failed-run residue distinctly when a .PARTIAL marker is present', async () => {
    const fixture = await makeFixture();
    await mkdir(path.dirname(partialMarkerPath(fixture.frozenRoot)), { recursive: true });
    await writeFile(partialMarkerPath(fixture.frozenRoot), 'residue\n', 'utf8');
    const result = await runFreeze({ ...fixture, secretScan: cleanScan });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('partial freeze detected');
      expect(result.error.message).toContain('never second-scanned');
      expect(result.error.message).not.toContain('denominator amendment');
    }
  });

  it('refuses when artefacts pre-exist without a frozen tree, touching nothing', async () => {
    const fixture = await makeFixture();
    const denominatorPath = path.join(fixture.outDirAbs, 'denominator.v1.json');
    const sentinel = '{"sentinel": "prior state, not ours to delete"}\n';
    await writeFile(denominatorPath, sentinel, 'utf8');
    const result = await runFreeze({ ...fixture, secretScan: cleanScan });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('inconsistent prior state');
    }
    expect(await readFile(denominatorPath, 'utf8')).toBe(sentinel);
    expect(existsSync(fixture.frozenRoot)).toBe(false);
  });

  it('refuses a symlinked frozen-tree path, leaving the link target untouched', async () => {
    const fixture = await makeFixture();
    const elsewhere = path.join(fixture.repoRoot, 'elsewhere');
    await mkdir(elsewhere, { recursive: true });
    await writeFile(path.join(elsewhere, 'sentinel.txt'), 'untouched\n', 'utf8');
    await mkdir(path.join(fixture.outDirAbs, 'archive'), { recursive: true });
    // 'junction' so the fixture is creatable without privilege on Windows
    // (plain directory symlinks need admin or Developer Mode there); ignored
    // on POSIX, and lstat classifies a junction as a symlink on win32, so the
    // refusal under test is identical everywhere.
    await symlink(elsewhere, fixture.frozenRoot, 'junction');
    const result = await runFreeze({ ...fixture, secretScan: cleanScan });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('real directory chain');
    }
    expect(await readdir(elsewhere)).toEqual(['sentinel.txt']);
  });

  it('refuses rule globs that reach outside the repository, writing nothing', async () => {
    const scratchRoot = await mkdtemp(path.join(tmpdir(), 'refound-escape-'));
    tempRoots.push(scratchRoot);
    const repoRoot = path.join(scratchRoot, 'repo');
    const rule = {
      version: 1,
      ratifiedBy: '.agent/decisions/g1.md',
      classes: [
        { id: 'plans', globs: ['.agent/plans/**'], verdict: 'in', reason: 'estate' },
        { id: 'escape', globs: ['../escape/**'], verdict: 'in', reason: 'escape fixture' },
      ],
    };
    await writeTree(repoRoot, {
      '.agent/plans/in.md': 'inside\n',
      '.agent/plans-refounding/freeze-rule.json': `${JSON.stringify(rule, null, 2)}\n`,
    });
    await writeTree(scratchRoot, { 'escape/leak.md': 'outside the repo\n' });
    const outDirAbs = path.join(repoRoot, '.agent/plans-refounding');
    const result = await runFreeze({
      repoRoot,
      ruleAbsPath: path.join(outDirAbs, 'freeze-rule.json'),
      outDirAbs,
      secretScan: cleanScan,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('out-of-repo reach');
    }
    expect(existsSync(path.join(outDirAbs, 'archive/frozen-v1'))).toBe(false);
    expect(existsSync(path.join(outDirAbs, 'denominator.v1.json'))).toBe(false);
  });

  it('refuses an in-set that matches no files, writing nothing', async () => {
    const fixture = await makeFixture();
    await rm(path.join(fixture.repoRoot, '.agent/plans'), { recursive: true });
    await rm(path.join(fixture.repoRoot, '.agent/milestones'), { recursive: true });
    await rm(path.join(fixture.repoRoot, '.agent/proposals'), { recursive: true });
    const result = await runFreeze({ ...fixture, secretScan: cleanScan });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('no files');
    }
    expectNothingWritten(fixture);
  });

  it('refuses a source set whose paths collide onto one frozen path', async () => {
    const repoRoot = await mkdtemp(path.join(tmpdir(), 'refound-freeze-'));
    tempRoots.push(repoRoot);
    const rule = {
      version: 1,
      ratifiedBy: '.agent/decisions/g1.md',
      classes: [
        { id: 'plans', globs: ['.agent/plans/**'], verdict: 'in', reason: 'estate' },
        { id: 'root-plans', globs: ['plans/**'], verdict: 'in', reason: 'collision fixture' },
      ],
    };
    await writeTree(repoRoot, {
      '.agent/plans/x.md': 'agent copy\n',
      'plans/x.md': 'root copy\n',
      '.agent/plans-refounding/freeze-rule.json': `${JSON.stringify(rule, null, 2)}\n`,
    });
    const outDirAbs = path.join(repoRoot, '.agent/plans-refounding');
    const result = await runFreeze({
      repoRoot,
      ruleAbsPath: path.join(outDirAbs, 'freeze-rule.json'),
      outDirAbs,
      secretScan: cleanScan,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('collide');
    }
    expect(existsSync(path.join(outDirAbs, 'archive/frozen-v1'))).toBe(false);
  });
});

describe('runFreeze — secret-scan ordering and rollback', () => {
  it('scans the full source set before any copy, then the frozen copies before finalising', async () => {
    const fixture = await makeFixture();
    const calls: { paths: string[]; frozenTreeExisted: boolean }[] = [];
    const recordingScan: SecretScan = (absFilePaths) => {
      calls.push({
        paths: [...absFilePaths],
        frozenTreeExisted: existsSync(fixture.frozenRoot),
      });
      return Promise.resolve(ok(undefined));
    };
    const result = await runFreeze({ ...fixture, secretScan: recordingScan });
    expect(result.ok).toBe(true);
    expect(calls).toHaveLength(2);
    expect(calls[0].frozenTreeExisted).toBe(false);
    expect(calls[0].paths).toHaveLength(6);
    expect(calls[0].paths.every((p) => p.startsWith(path.join(fixture.repoRoot, '.agent')))).toBe(
      true,
    );
    expect(calls[1].frozenTreeExisted).toBe(true);
    expect(calls[1].paths).toHaveLength(6);
    expect(calls[1].paths.every((p) => p.startsWith(fixture.frozenRoot))).toBe(true);
  });

  it('refuses on a pre-copy scan hit with nothing written', async () => {
    const fixture = await makeFixture();
    const refusingScan: SecretScan = () =>
      Promise.resolve(err(new Error('secret scan found 1 leak')));
    const result = await runFreeze({ ...fixture, secretScan: refusingScan });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('secret');
    }
    expectNothingWritten(fixture);
  });

  it('rolls the freeze back when the post-copy scan of the frozen copies hits', async () => {
    const fixture = await makeFixture();
    let callCount = 0;
    const secondScanHit: SecretScan = () => {
      callCount += 1;
      if (callCount === 1) {
        return Promise.resolve(ok(undefined));
      }
      return Promise.resolve(err(new Error('leak surfaced in a frozen copy')));
    };
    const result = await runFreeze({ ...fixture, secretScan: secondScanHit });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('post-copy');
      expect(result.error.message).toContain('rolled back');
    }
    expectNothingWritten(fixture);
  });

  it('rolls back only what this run wrote when a copy write fails mid-run', async () => {
    const fixture = await makeFixture();
    const decoyPath = path.join(fixture.outDirAbs, 'decoy.txt');
    await writeFile(decoyPath, 'pre-existing operator file\n', 'utf8');
    let writes = 0;
    const failingWriter = (absFilePath: string, bytes: Uint8Array): Promise<void> => {
      writes += 1;
      if (writes === 3) {
        return Promise.reject(new Error('disk full (injected)'));
      }
      return writeFile(absFilePath, bytes);
    };
    const result = await runFreeze({
      ...fixture,
      secretScan: cleanScan,
      writeCopyFile: failingWriter,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('copy phase failed');
      expect(result.error.message).toContain('rolled back');
    }
    expectNothingWritten(fixture);
    // The rollback removes ONLY this run's writes: pre-existing operator
    // files in the artefact home survive.
    expect(await readFile(decoyPath, 'utf8')).toBe('pre-existing operator file\n');
    expect(existsSync(fixture.ruleAbsPath)).toBe(true);
  });
});

describe('gitleaks resolution (the pinned-binary attestation seam)', () => {
  it('resolves gitleaks from the fixed trusted-path allowlist, never via PATH', () => {
    const resolved = resolveTrustedGitleaks(
      (candidate) => candidate === '/usr/local/bin/gitleaks',
      'linux',
    );
    expect(resolved.ok).toBe(true);
    if (resolved.ok) {
      expect(resolved.value).toBe('/usr/local/bin/gitleaks');
    }
  });

  it('refuses with the symlink remedy when no trusted path holds gitleaks', () => {
    const resolved = resolveTrustedGitleaks(() => false, 'linux');
    expect(resolved.ok).toBe(false);
    if (!resolved.ok) {
      expect(resolved.error.message).toContain('No trusted gitleaks binary found');
      expect(resolved.error.message).toContain('symlink');
    }
  });

  it('refuses unconditionally on win32, naming the missing admin-protected location', () => {
    // Even a gitleaks that "exists" everywhere is refused: no Windows install
    // location is administrator-protected, so none can be a fixed trusted path.
    const resolved = resolveTrustedGitleaks(() => true, 'win32');
    expect(resolved.ok).toBe(false);
    if (!resolved.ok) {
      expect(resolved.error.message).toContain('No trusted gitleaks binary is possible on Windows');
      expect(resolved.error.message).toContain('POSIX host');
    }
  });

  it('reports the trimmed version line from a clean probe', () => {
    const version = probeGitleaksVersion('/usr/local/bin/gitleaks', () => ({
      status: 0,
      stdout: 'fake-gitleaks 0.0.0-test\n',
      stderr: '',
    }));
    expect(version.ok).toBe(true);
    if (version.ok) {
      expect(version.value).toBe('fake-gitleaks 0.0.0-test');
    }
  });

  it('refuses when the probe cannot launch the binary at all', () => {
    const version = probeGitleaksVersion('/usr/local/bin/absent', () => ({
      error: new Error('spawn ENOENT'),
      status: null,
      stdout: '',
      stderr: '',
    }));
    expect(version.ok).toBe(false);
    if (!version.ok) {
      expect(version.error.message).toContain('cannot probe gitleaks version');
    }
  });

  it('refuses a non-zero probe exit, carrying the stderr tail', () => {
    const version = probeGitleaksVersion('/usr/local/bin/gitleaks', () => ({
      status: 3,
      stdout: '',
      stderr: 'corrupt install\n',
    }));
    expect(version.ok).toBe(false);
    if (!version.ok) {
      expect(version.error.message).toContain('exit 3');
      expect(version.error.message).toContain('corrupt install');
    }
  });

  it('refuses an empty version report even on exit 0', () => {
    const version = probeGitleaksVersion('/usr/local/bin/gitleaks', () => ({
      status: 0,
      stdout: '',
      stderr: '',
    }));
    expect(version.ok).toBe(false);
  });
});
