import { existsSync } from 'node:fs';
import {
  lstat,
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rename,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { err, ok, unwrap, unwrapErr, type Result } from '@oaknational/result';

import { renderJsonlArtefact, sha256Hex } from './refounding-artefacts.js';
import { type SweepHit } from './refound-sweep-model.js';
import { parseWindowSampleArgs, resolveWindowSamplePaths } from './refound-window-sample.js';
import { runWindowSample, type ByteSourceFactory } from './refound-window-sample-helpers.js';
import { readBoundRule, writeManifest } from './refound-window-sample-io.js';
import { canonicaliseOutDir } from './refound-window-sample-write-guard.js';
import {
  parseWindowSampleManifest,
  WINDOW_SAMPLE_SEGMENT,
  type WindowSampleManifest,
} from './refound-window-sample-schema.js';
import { type ByteSource } from './refound-window-sample-universe.js';

/**
 * Integration behaviours of `refound-window-sample` over real temporary
 * artefact trees and an INJECTED byte source (no process is ever spawned —
 * the git seam has its own in-process proof in
 * `refound-window-sample-git.integration.test.ts`): the universe comes from
 * the injected base, live-tree files are invisible, the artefact is
 * byte-identical across runs, every refusal (expectation mismatch,
 * evidence/base disagreement, unratified rule, malformed hits row,
 * symlinked write dir) writes nothing, and the entry-level flag parsing and
 * path constraints hold.
 */

const BASE = 'ab'.repeat(20);

const tempRoots: string[] = [];

afterEach(async () => {
  await Promise.all(tempRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

/** In-memory {@link ByteSource} fake carrying the fixture's base content. */
function sourceOf(files: Record<string, string | Buffer>): ByteSource {
  const byPath = new Map<string, Uint8Array>(
    Object.entries(files).map(([relPath, content]) => [
      relPath,
      typeof content === 'string' ? Buffer.from(content, 'utf8') : content,
    ]),
  );
  return {
    listPaths: () => ok([...byPath.keys()]),
    readBytes: (relPath): Result<Uint8Array, Error> => {
      const bytes = byPath.get(relPath);
      return bytes === undefined ? err(new Error(`no bytes staged for '${relPath}'`)) : ok(bytes);
    },
  };
}

/** Write a tree of files (string or bytes) under `root`, creating parents. */
async function writeTree(root: string, files: Record<string, string | Buffer>): Promise<void> {
  for (const [relPath, content] of Object.entries(files)) {
    const absPath = path.join(root, relPath);
    await mkdir(path.dirname(absPath), { recursive: true });
    await writeFile(absPath, content);
  }
}

/** `n` LF-terminated lines with optional 1-indexed line overrides. */
function mdLines(n: number, overrides: Record<number, string> = {}): string {
  return Array.from(
    { length: n },
    (_, index) => overrides[index + 1] ?? `line ${String(index + 1)}`,
  )
    .map((line) => `${line}\n`)
    .join('');
}

function hitRow(file: string, line: number, text: string): SweepHit {
  return { file, line, markers: ['todo'], text, sha256: sha256Hex(Buffer.from(text)) };
}

interface Fixture {
  readonly repoRoot: string;
  readonly ruleAbsPath: string;
  readonly outDirAbs: string;
  readonly evidenceAbsPath: string;
  readonly baseSha: string;
  readonly makeByteSource: ByteSourceFactory;
}

/**
 * A real temporary artefact tree (rule + evidence + hits + any live-only
 * files) around an injected in-memory byte source carrying `baseFiles` —
 * only the injected source can appear in the universe, exactly as only the
 * base commit can in production.
 */
async function makeFixture(options: {
  readonly ratifiedBy?: string | null;
  readonly baseFiles: Record<string, string | Buffer>;
  readonly liveFiles?: Record<string, string | Buffer>;
  readonly hits?: readonly SweepHit[];
  readonly hitsJsonl?: string;
  readonly expected: { scannedFiles: number; hitFiles: number; hitLines: number };
  readonly evidenceBaseSha?: string;
  readonly sweepHitsSha256?: string;
  /** Rule bytes staged AT BASE; defaults to the live rule (bound). */
  readonly baseRuleJson?: string;
}): Promise<Fixture> {
  const repoRoot = await mkdtemp(path.join(tmpdir(), 'refound-window-sample-'));
  tempRoots.push(repoRoot);
  const rule = {
    version: 1,
    ratifiedBy: 'ratifiedBy' in options ? options.ratifiedBy : '.agent/decisions/g1.md',
    classes: [
      { id: 'plans', globs: ['.agent/plans/**'], verdict: 'in', reason: 'estate' },
      {
        id: 'sweep-surfaces',
        globs: ['.agent/prompts/**'],
        verdict: 'sweep',
        reason: 'live operational surface',
      },
    ],
  };
  const ruleJson = `${JSON.stringify(rule, null, 2)}\n`;
  const hitsJsonl = options.hitsJsonl ?? renderJsonlArtefact([...(options.hits ?? [])]);
  const evidence = {
    schemaVersion: 1,
    runBaseSha: options.evidenceBaseSha ?? BASE,
    artifacts: [
      {
        path: '.agent/plans-refounding/sweep/sweep-hits.v1.jsonl',
        bytes: Buffer.byteLength(hitsJsonl, 'utf8'),
        sha256: options.sweepHitsSha256 ?? sha256Hex(Buffer.from(hitsJsonl, 'utf8')),
      },
    ],
    sweep: {
      filesScanned: options.expected.scannedFiles,
      hits: options.expected.hitLines,
      filesWithHits: options.expected.hitFiles,
    },
  };
  const outDirAbs = path.join(repoRoot, '.agent/plans-refounding');
  await writeTree(repoRoot, {
    ...options.liveFiles,
    '.agent/plans-refounding/freeze-rule.json': ruleJson,
    '.agent/plans-refounding/proofs/evidence.v1.json': `${JSON.stringify(evidence, null, 2)}\n`,
    '.agent/plans-refounding/sweep/sweep-hits.v1.jsonl': hitsJsonl,
  });
  return {
    repoRoot,
    ruleAbsPath: path.join(outDirAbs, 'freeze-rule.json'),
    outDirAbs,
    evidenceAbsPath: path.join(outDirAbs, 'proofs/evidence.v1.json'),
    baseSha: BASE,
    makeByteSource: () =>
      ok(
        sourceOf({
          ...options.baseFiles,
          '.agent/plans-refounding/freeze-rule.json': options.baseRuleJson ?? ruleJson,
        }),
      ),
  };
}

async function readManifest(outDirAbs: string): Promise<WindowSampleManifest> {
  const raw = await readFile(path.join(outDirAbs, WINDOW_SAMPLE_SEGMENT), 'utf8');
  const json: unknown = JSON.parse(raw);
  return unwrap(parseWindowSampleManifest(json));
}

/** A minimal valid manifest for exercising the write boundary in isolation. */
function emptyManifest(): WindowSampleManifest {
  return {
    schema_version: '1',
    base: BASE,
    window_lines: 500,
    selection_rule: 'sorted-(file,window)-every-10th-from-0',
    universe: { files: 0, windows: 0, hit_windows: 0, non_hit_windows: 0 },
    expectations: { scanned_files: 0, hit_files: 0, hit_lines: 0 },
    sample: [],
  };
}

const HAPPY = {
  baseFiles: {
    '.agent/prompts/a.md': mdLines(600, { 2: 'todo: port the opener' }),
    '.agent/prompts/b.md': mdLines(3),
    '.agent/plans/in-class.md': mdLines(1),
  },
  hits: [hitRow('.agent/prompts/a.md', 2, 'todo: port the opener')],
  expected: { scannedFiles: 2, hitFiles: 1, hitLines: 1 },
};

describe('runWindowSample — the batch-open computation', () => {
  it('writes the every-10th non-hit window sample bound to the injected base', async () => {
    const fixture = await makeFixture(HAPPY);
    const run = unwrap(await runWindowSample(fixture));
    expect(run.base).toBe(BASE);
    const manifest = await readManifest(fixture.outDirAbs);
    expect(manifest.base).toBe(BASE);
    expect(manifest.universe).toEqual({
      files: 2,
      windows: 3,
      hit_windows: 1,
      non_hit_windows: 2,
    });
    expect(manifest.expectations).toEqual({ scanned_files: 2, hit_files: 1, hit_lines: 1 });
    expect(manifest.sample).toEqual([
      {
        file: '.agent/prompts/a.md',
        window_index: 1,
        start_line: 501,
        end_line: 600,
        line_count: 100,
      },
    ]);
  });

  it('enumerates the universe from the injected base: live-tree files are invisible', async () => {
    const fixture = await makeFixture({
      ...HAPPY,
      liveFiles: {
        '.agent/prompts/b.md': mdLines(900),
        '.agent/prompts/live-only.md': mdLines(5),
      },
    });
    const run = await runWindowSample(fixture);
    expect(run.ok).toBe(true);
    const manifest = await readManifest(fixture.outDirAbs);
    // live-only.md is not in the universe; b.md still counts its 3 base lines.
    expect(manifest.universe).toEqual({
      files: 2,
      windows: 3,
      hit_windows: 1,
      non_hit_windows: 2,
    });
  });

  it('writes a byte-identical artefact on a double run (determinism contract)', async () => {
    const fixture = await makeFixture(HAPPY);
    expect((await runWindowSample(fixture)).ok).toBe(true);
    const first = await readFile(path.join(fixture.outDirAbs, WINDOW_SAMPLE_SEGMENT));
    expect((await runWindowSample(fixture)).ok).toBe(true);
    const second = await readFile(path.join(fixture.outDirAbs, WINDOW_SAMPLE_SEGMENT));
    expect(first.equals(second)).toBe(true);
  });
});

describe('runWindowSample — refusal chain (nothing written)', () => {
  async function expectRefusal(fixture: Fixture, fragment: string): Promise<void> {
    const run = await runWindowSample(fixture);
    const error = unwrapErr(run);
    expect(error.message).toContain(fragment);
    expect(existsSync(path.join(fixture.outDirAbs, WINDOW_SAMPLE_SEGMENT))).toBe(false);
  }

  it('halts on a scanned-file expectation mismatch', async () => {
    const fixture = await makeFixture({
      ...HAPPY,
      expected: { ...HAPPY.expected, scannedFiles: 3 },
    });
    await expectRefusal(fixture, 'universe');
  });

  it("halts when --base disagrees with the evidence's runBaseSha", async () => {
    const fixture = await makeFixture({ ...HAPPY, evidenceBaseSha: 'ff'.repeat(20) });
    await expectRefusal(fixture, 'runBaseSha');
  });

  it('refuses an unratified rule', async () => {
    const fixture = await makeFixture({ ...HAPPY, ratifiedBy: null });
    await expectRefusal(fixture, 'unratified');
  });

  it('refuses a malformed hits row, naming the offending line', async () => {
    const fixture = await makeFixture({
      ...HAPPY,
      hitsJsonl: '{"file":"broken"\n',
    });
    await expectRefusal(fixture, 'sweep hit line 1');
  });

  it('refuses an interior blank hits row at its true line number (no silent drop)', async () => {
    const row = JSON.stringify(hitRow('.agent/prompts/a.md', 2, 'todo: port the opener'));
    // Valid row 1, a blank INTERIOR row 2, valid row 3: the blank must be a
    // strict parse error naming line 2, never filtered away (which would both
    // hide it and shift every later error's line number).
    const fixture = await makeFixture({ ...HAPPY, hitsJsonl: `${row}\n\n${row}\n` });
    await expectRefusal(fixture, 'sweep hit line 2');
  });

  // Directory links throughout these refusal fixtures are created as
  // 'junction' so they need no privilege on Windows (plain symlinks require
  // admin or Developer Mode there); the argument is ignored on POSIX, and
  // lstat classifies a junction as a symlink, so the refusal under test is
  // identical everywhere.
  it('refuses to write through a symlinked sweep directory', async () => {
    const fixture = await makeFixture(HAPPY);
    const sweepDirAbs = path.join(fixture.outDirAbs, 'sweep');
    const decoyDirAbs = path.join(fixture.repoRoot, 'decoy-sweep');
    await rename(sweepDirAbs, decoyDirAbs);
    await symlink(decoyDirAbs, sweepDirAbs, 'junction');
    const run = await runWindowSample(fixture);
    expect(unwrapErr(run).message).toContain('symlink');
    expect(existsSync(path.join(decoyDirAbs, 'window-sample.v1.json'))).toBe(false);
  });

  it('refuses to write through a symlink at the manifest path itself, leaving its target untouched', async () => {
    const fixture = await makeFixture(HAPPY);
    // A directory decoy behind the link: the refusal probes lstat at the
    // manifest PATH, which sees a symlink either way, and a directory target
    // lets the fixture stay junction-creatable without privilege.
    const decoyDirAbs = path.join(fixture.repoRoot, 'decoy-manifest-home');
    await mkdir(decoyDirAbs);
    await symlink(decoyDirAbs, path.join(fixture.outDirAbs, WINDOW_SAMPLE_SEGMENT), 'junction');
    const run = await runWindowSample(fixture);
    expect(unwrapErr(run).message).toContain('symlink');
    // "Leaving its target untouched" is falsifiable only if the link SURVIVED:
    // a refusal that unlinked-and-rewrote would also leave the decoy empty.
    expect(
      (await lstat(path.join(fixture.outDirAbs, WINDOW_SAMPLE_SEGMENT))).isSymbolicLink(),
    ).toBe(true);
    expect(await readdir(decoyDirAbs)).toEqual([]);
  });

  it('halts when the hits queue does not match the evidence-recorded sha256', async () => {
    const fixture = await makeFixture({ ...HAPPY, sweepHitsSha256: 'ff'.repeat(32) });
    await expectRefusal(fixture, 'evidence-recorded queue');
  });

  it('halts when the live rule differs from the rule at the pinned base (same-count swap)', async () => {
    const swappedRule = {
      version: 1,
      ratifiedBy: '.agent/decisions/g1.md',
      classes: [
        { id: 'plans', globs: ['.agent/other-plans/**'], verdict: 'in', reason: 'estate' },
        {
          id: 'sweep-surfaces',
          globs: ['.agent/prompts/**'],
          verdict: 'sweep',
          reason: 'live operational surface',
        },
      ],
    };
    const fixture = await makeFixture({
      ...HAPPY,
      baseRuleJson: `${JSON.stringify(swappedRule, null, 2)}\n`,
    });
    await expectRefusal(fixture, 'pinned base');
  });

  it('halts when the rule is unreadable at the pinned base', async () => {
    const fixture = await makeFixture(HAPPY);
    const bare = { ...fixture, makeByteSource: () => ok(sourceOf(HAPPY.baseFiles)) };
    await expectRefusal(bare, 'unreadable at the pinned base');
  });

  it('does not refuse at the write guard when the out dir does not yet exist', async () => {
    // A fresh `--out` must not be blocked by the guard (the contract allows an
    // absent out dir); the run instead halts later at the hits read, proving
    // the guard anchored on the nearest existing ancestor rather than throwing.
    const fixture = await makeFixture(HAPPY);
    const freshOutDirAbs = path.join(fixture.repoRoot, '.agent/plans-refounding-fresh');
    const run = await runWindowSample({ ...fixture, outDirAbs: freshOutDirAbs });
    const error = unwrapErr(run);
    expect(error.message).toContain('cannot read sweep hits');
    expect(error.message).not.toContain('canonicalise');
  });

  it('returns Err rather than throwing when the artefact write fails (injected seam)', async () => {
    const repoRoot = await mkdtemp(path.join(tmpdir(), 'refound-window-sample-io-'));
    tempRoots.push(repoRoot);
    const outDirAbs = path.join(repoRoot, '.agent/plans-refounding');
    await mkdir(outDirAbs, { recursive: true });
    const target = unwrap(canonicaliseOutDir(repoRoot, outDirAbs));
    // Hermetic write failure (no host permission semantics): the injected
    // writer rejects, and the error boundary must convert it to a typed Err.
    const failingWrite = (): Promise<void> => Promise.reject(new Error('injected write failure'));
    const written = await writeManifest(target, emptyManifest(), failingWrite);
    const error = unwrapErr(written);
    expect(error.message).toContain('write failed');
    expect(error.message).toContain('injected write failure');
    expect(existsSync(path.join(outDirAbs, WINDOW_SAMPLE_SEGMENT))).toBe(false);
  });
});

describe('writeManifest — TOCTOU re-canonicalisation guard (nothing written)', () => {
  it('writes when the re-canonicalised out dir is stable and within the repository', async () => {
    const repoRoot = await mkdtemp(path.join(tmpdir(), 'refound-window-sample-stable-'));
    tempRoots.push(repoRoot);
    const outDirAbs = path.join(repoRoot, '.agent/plans-refounding');
    await mkdir(outDirAbs, { recursive: true });
    const target = unwrap(canonicaliseOutDir(repoRoot, outDirAbs));
    const written = await writeManifest(target, emptyManifest());
    expect(written.ok).toBe(true);
    expect(existsSync(path.join(outDirAbs, WINDOW_SAMPLE_SEGMENT))).toBe(true);
  });

  it('writes when the out dir does not yet exist — the write phase creates it from the anchor', async () => {
    const repoRoot = await mkdtemp(path.join(tmpdir(), 'refound-window-sample-fresh-'));
    tempRoots.push(repoRoot);
    // The `.agent` anchor exists; `plans-refounding` is absent and must be
    // created by the write phase (the `--out need not exist` contract).
    await mkdir(path.join(repoRoot, '.agent'));
    const outDirAbs = path.join(repoRoot, '.agent/plans-refounding');
    const target = unwrap(canonicaliseOutDir(repoRoot, outDirAbs));
    const written = await writeManifest(target, emptyManifest());
    expect(written.ok).toBe(true);
    expect(existsSync(path.join(outDirAbs, WINDOW_SAMPLE_SEGMENT))).toBe(true);
  });

  it('refuses when the nearest existing ancestor of a fresh out dir is swapped for a symlink', async () => {
    const repoRoot = await mkdtemp(path.join(tmpdir(), 'refound-window-sample-anchorswap-'));
    tempRoots.push(repoRoot);
    // `.agent` exists (the nearest existing ancestor); the out dir leaf is absent.
    await mkdir(path.join(repoRoot, '.agent'));
    const outDirAbs = path.join(repoRoot, '.agent/plans-refounding');
    const target = unwrap(canonicaliseOutDir(repoRoot, outDirAbs));
    // Swap the nearest existing ancestor (`.agent`) for a symlink to a decoy.
    const decoyAgent = path.join(repoRoot, 'decoy-agent');
    await mkdir(decoyAgent);
    await rm(path.join(repoRoot, '.agent'), { recursive: true, force: true });
    await symlink(decoyAgent, path.join(repoRoot, '.agent'), 'junction');
    const written = await writeManifest(target, emptyManifest());
    expect(unwrapErr(written).message).toContain('an ancestor was swapped');
    expect(existsSync(path.join(decoyAgent, 'plans-refounding', WINDOW_SAMPLE_SEGMENT))).toBe(
      false,
    );
  });

  it('refuses a symlink planted at an absent segment during the scan, writing nothing outside', async () => {
    const repoRoot = await mkdtemp(path.join(tmpdir(), 'refound-window-sample-plant-'));
    tempRoots.push(repoRoot);
    const outsideRoot = await mkdtemp(path.join(tmpdir(), 'refound-window-sample-plant-out-'));
    tempRoots.push(outsideRoot);
    // `.agent` exists (the anchor); `plans-refounding` is an absent segment.
    await mkdir(path.join(repoRoot, '.agent'));
    const outDirAbs = path.join(repoRoot, '.agent/plans-refounding');
    const target = unwrap(canonicaliseOutDir(repoRoot, outDirAbs));
    // Scan-time attack: plant a symlink AT the first absent segment pointing
    // outside the repo. A recursive mkdir would follow it and escape.
    const plantedTarget = path.join(outsideRoot, 'planted');
    await mkdir(plantedTarget, { recursive: true });
    await symlink(plantedTarget, outDirAbs, 'junction');
    const written = await writeManifest(target, emptyManifest());
    expect(unwrapErr(written).message).toContain('not a real directory');
    expect(existsSync(path.join(plantedTarget, WINDOW_SAMPLE_SEGMENT))).toBe(false);
  });

  it('refuses when an ancestor of the out dir is swapped for a symlink after canonicalisation', async () => {
    const repoRoot = await mkdtemp(path.join(tmpdir(), 'refound-window-sample-swap-'));
    tempRoots.push(repoRoot);
    const outDirAbs = path.join(repoRoot, '.agent/plans-refounding');
    await mkdir(outDirAbs, { recursive: true });
    const target = unwrap(canonicaliseOutDir(repoRoot, outDirAbs));
    // Swap the `.agent` ancestor for a symlink to a decoy tree still in-repo:
    // the re-canonicalised path drifts from the pre-scan baseline.
    const decoyAgent = path.join(repoRoot, 'decoy-agent');
    await mkdir(path.join(decoyAgent, 'plans-refounding'), { recursive: true });
    await rm(path.join(repoRoot, '.agent'), { recursive: true, force: true });
    await symlink(decoyAgent, path.join(repoRoot, '.agent'), 'junction');
    const written = await writeManifest(target, emptyManifest());
    expect(unwrapErr(written).message).toContain('an ancestor was swapped');
    expect(existsSync(path.join(decoyAgent, 'plans-refounding', WINDOW_SAMPLE_SEGMENT))).toBe(
      false,
    );
  });

  it('refuses a pre-existing --out symlink escaping the repository at canonicalise time', async () => {
    const repoRoot = await mkdtemp(path.join(tmpdir(), 'refound-window-sample-escape-'));
    tempRoots.push(repoRoot);
    const outsideRoot = await mkdtemp(path.join(tmpdir(), 'refound-window-sample-outside-'));
    tempRoots.push(outsideRoot);
    const outsideOut = path.join(outsideRoot, 'plans-refounding');
    await mkdir(outsideOut, { recursive: true });
    // A pre-existing --out symlink pointing outside the repo is refused when the
    // chain is canonicalised — before any target is produced or byte written.
    const outDirAbs = path.join(repoRoot, 'linked-out');
    await symlink(outsideOut, outDirAbs, 'junction');
    expect(unwrapErr(canonicaliseOutDir(repoRoot, outDirAbs)).message).toContain('symlink');
    expect(existsSync(path.join(outsideOut, WINDOW_SAMPLE_SEGMENT))).toBe(false);
  });

  it('refuses when --out is itself a pre-existing in-repo symlink (write-through bypass)', async () => {
    const repoRoot = await mkdtemp(path.join(tmpdir(), 'refound-window-sample-inlink-'));
    tempRoots.push(repoRoot);
    const realTarget = path.join(repoRoot, 'real-target');
    await mkdir(realTarget, { recursive: true });
    await mkdir(path.join(repoRoot, '.agent'));
    const outDirAbs = path.join(repoRoot, '.agent/plans-refounding');
    await symlink(realTarget, outDirAbs, 'junction');
    expect(unwrapErr(canonicaliseOutDir(repoRoot, outDirAbs)).message).toContain('symlink');
    expect(existsSync(path.join(realTarget, WINDOW_SAMPLE_SEGMENT))).toBe(false);
  });

  it('refuses when an intermediate in-repo ancestor is a pre-existing symlink', async () => {
    const repoRoot = await mkdtemp(path.join(tmpdir(), 'refound-window-sample-midlink-'));
    tempRoots.push(repoRoot);
    const realAgent = path.join(repoRoot, 'real-agent');
    await mkdir(path.join(realAgent, 'plans-refounding'), { recursive: true });
    await symlink(realAgent, path.join(repoRoot, '.agent'), 'junction');
    const outDirAbs = path.join(repoRoot, '.agent/plans-refounding');
    expect(unwrapErr(canonicaliseOutDir(repoRoot, outDirAbs)).message).toContain('symlink');
  });

  it('accepts a plain nested real-directory --out chain', async () => {
    const repoRoot = await mkdtemp(path.join(tmpdir(), 'refound-window-sample-plainchain-'));
    tempRoots.push(repoRoot);
    const outDirAbs = path.join(repoRoot, '.agent/plans-refounding');
    await mkdir(outDirAbs, { recursive: true });
    expect(unwrap(canonicaliseOutDir(repoRoot, outDirAbs)).outDirAbs).toBe(outDirAbs);
  });
});

describe('readBoundRule — single-read binding (check-time == use-time)', () => {
  it('reads the rule file exactly once — parse input is the byte-compared buffer', async () => {
    const repoRoot = await mkdtemp(path.join(tmpdir(), 'refound-window-sample-bind-'));
    tempRoots.push(repoRoot);
    const ruleRelPath = '.agent/plans-refounding/freeze-rule.json';
    const ruleAbsPath = path.join(repoRoot, ruleRelPath);
    const ruleJson = `${JSON.stringify(
      {
        version: 1,
        ratifiedBy: '.agent/decisions/g1.md',
        classes: [{ id: 'plans', globs: ['.agent/plans/**'], verdict: 'in', reason: 'estate' }],
      },
      null,
      2,
    )}\n`;
    // Base source carries the SAME bytes, so the binding passes; a counting
    // reader proves a single read backs both the parse and the comparison.
    const source = sourceOf({ [ruleRelPath]: ruleJson });
    let reads = 0;
    const countingReader = async (readPath: string): Promise<Buffer> => {
      expect(readPath).toBe(ruleAbsPath);
      reads += 1;
      return Buffer.from(ruleJson, 'utf8');
    };
    const bound = await readBoundRule(repoRoot, ruleAbsPath, source, countingReader);
    expect(bound.ok).toBe(true);
    expect(reads).toBe(1);
  });
});

describe('parseWindowSampleArgs (shared entry contract)', () => {
  it('requires --base and rejects a non-40-hex value', () => {
    expect(parseWindowSampleArgs([]).ok).toBe(false);
    expect(parseWindowSampleArgs(['--base', 'abc123']).ok).toBe(false);
    expect(
      unwrap(parseWindowSampleArgs(['--base', 'ab'.repeat(20), '--out', 'custom'])),
    ).toMatchObject({ help: false, outDir: 'custom', baseSha: 'ab'.repeat(20) });
  });

  it('answers --help and -h as a run-nothing verdict, before the required-base check', () => {
    for (const argv of [['--help'], ['-h']]) {
      const parsed = unwrap(parseWindowSampleArgs(argv));
      expect(parsed.help).toBe(true);
    }
  });

  it('refuses the -- terminator instead of silently swallowing the flags after it', () => {
    const error = unwrapErr(
      parseWindowSampleArgs(['--base', 'ab'.repeat(20), '--', '--out', 'custom']),
    );
    expect(error.message).toContain('--');
  });
});

describe('resolveWindowSamplePaths (entry-level path constraints)', () => {
  it('accepts a not-yet-existing out dir alongside existing rule and evidence', async () => {
    const rootAbs = await mkdtemp(path.join(tmpdir(), 'refound-window-sample-resolve-'));
    tempRoots.push(rootAbs);
    await writeFile(path.join(rootAbs, 'freeze-rule.json'), '{}', 'utf8');
    await writeFile(path.join(rootAbs, 'evidence.json'), '{}', 'utf8');
    const resolved = resolveWindowSamplePaths(rootAbs, {
      rulePath: 'freeze-rule.json',
      evidencePath: 'evidence.json',
      outDir: 'artefacts/fresh-home',
    });
    expect(unwrap(resolved).outDirAbs).toBe(path.join(rootAbs, 'artefacts/fresh-home'));
    expect(existsSync(path.join(rootAbs, 'artefacts'))).toBe(false);
  });

  it('refuses a `..`-escaping out dir, a missing rule, and a missing evidence file', async () => {
    const rootAbs = await mkdtemp(path.join(tmpdir(), 'refound-window-sample-resolve-'));
    tempRoots.push(rootAbs);
    await writeFile(path.join(rootAbs, 'freeze-rule.json'), '{}', 'utf8');
    await writeFile(path.join(rootAbs, 'evidence.json'), '{}', 'utf8');
    const escaped = resolveWindowSamplePaths(rootAbs, {
      rulePath: 'freeze-rule.json',
      evidencePath: 'evidence.json',
      outDir: '../escaped-home',
    });
    expect(unwrapErr(escaped).message).toContain('resolves outside the repository');
    expect(
      resolveWindowSamplePaths(rootAbs, {
        rulePath: 'absent-rule.json',
        evidencePath: 'evidence.json',
        outDir: '.',
      }).ok,
    ).toBe(false);
    expect(
      resolveWindowSamplePaths(rootAbs, {
        rulePath: 'freeze-rule.json',
        evidencePath: 'absent-evidence.json',
        outDir: '.',
      }).ok,
    ).toBe(false);
  });
});
