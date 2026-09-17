import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  workspaceDepDistIsStale,
  type WorkspaceDepDirEntry,
  type WorkspaceDepFsIo,
} from './bootstrap-helpers.js';

/**
 * Describes the bootstrap's rebuild decision. `buildWorkspaceDep` must rebuild a
 * leaf dep whenever its source has changed since the last build — not merely
 * when `dist` is absent. A warm checkout that pulls new leaf-package source over
 * an existing `dist` keeps the stale `dist`, agent-tools' own `tsc` then fails
 * against the out-of-date `.d.ts`, and the fail-open PreToolUse Bash guard that
 * imports `agent-tools/dist` is bricked (MCP-472; the "freshness != liveness"
 * class).
 *
 * The filesystem seam is faked with an in-memory directory tree so the decision
 * and its recursive `src` walk are described as pure functions over mtimes
 * (ADR-078) rather than raced against real write timing.
 */

const DEP_DIR = '/repo/packages/core/result';
const SRC_DIR = path.join(DEP_DIR, 'src');
const NESTED_DIR = path.join(SRC_DIR, 'nested');
const LEAF_ARTIFACTS = ['index.js', 'index.d.ts'] as const;
const DIST_JS = path.join(DEP_DIR, 'dist', 'index.js');
const DIST_DTS = path.join(DEP_DIR, 'dist', 'index.d.ts');
const SRC_INDEX = path.join(SRC_DIR, 'index.ts');
const SRC_NESTED = path.join(NESTED_DIR, 'unwrapping.ts');

const file = (name: string): WorkspaceDepDirEntry => ({ name, isDirectory: false });
const dir = (name: string): WorkspaceDepDirEntry => ({ name, isDirectory: true });

interface FakeTree {
  /** Path → mtime (ms). A path absent from the map reads `'missing'`. */
  readonly fileMtimes: Readonly<Record<string, number>>;
  /** Directory path → its immediate entries. A path absent from the map does not exist. */
  readonly dirEntries: Readonly<Record<string, readonly WorkspaceDepDirEntry[]>>;
}

/** A fake filesystem seam over an in-memory tree. */
function fakeIo(tree: FakeTree): WorkspaceDepFsIo {
  return {
    statMtimeMs: (filePath) =>
      filePath in tree.fileMtimes ? tree.fileMtimes[filePath] : 'missing',
    dirExists: (dirPath) => dirPath in tree.dirEntries,
    readDirEntries: (dirPath) => tree.dirEntries[dirPath] ?? [],
  };
}

/** A flat dep tree: both dist artifacts and one top-level `src/index.ts`, at the given mtimes. */
function flatTree(distJsMs: number, distDtsMs: number, srcMs: number): FakeTree {
  return {
    fileMtimes: { [DIST_JS]: distJsMs, [DIST_DTS]: distDtsMs, [SRC_INDEX]: srcMs },
    dirEntries: { [SRC_DIR]: [file('index.ts')] },
  };
}

describe('workspaceDepDistIsStale', () => {
  it('is stale when a dist artifact is missing, so a fresh checkout builds', () => {
    const io = fakeIo({
      fileMtimes: { [SRC_INDEX]: 50 },
      dirEntries: { [SRC_DIR]: [file('index.ts')] },
    });

    expect(workspaceDepDistIsStale(DEP_DIR, LEAF_ARTIFACTS, io)).toBe(true);
  });

  it('is not stale when both dist artifacts are newer than every source, so a warm checkout skips', () => {
    expect(workspaceDepDistIsStale(DEP_DIR, LEAF_ARTIFACTS, fakeIo(flatTree(200, 200, 100)))).toBe(
      false,
    );
  });

  it('is stale when a source file is newer than the built dist (the MCP-472 warm-pull bug)', () => {
    expect(workspaceDepDistIsStale(DEP_DIR, LEAF_ARTIFACTS, fakeIo(flatTree(100, 100, 200)))).toBe(
      true,
    );
  });

  it('treats an equal mtime as current, so an untouched warm checkout skips', () => {
    expect(workspaceDepDistIsStale(DEP_DIR, LEAF_ARTIFACTS, fakeIo(flatTree(150, 150, 150)))).toBe(
      false,
    );
  });

  it('rebuilds when any one dist artifact is older than source, even if another is newer', () => {
    expect(workspaceDepDistIsStale(DEP_DIR, LEAF_ARTIFACTS, fakeIo(flatTree(300, 100, 150)))).toBe(
      true,
    );
  });

  it('recurses into nested src subdirectories to find the newest source', () => {
    const io = fakeIo({
      fileMtimes: { [DIST_JS]: 100, [DIST_DTS]: 100, [SRC_INDEX]: 50, [SRC_NESTED]: 200 },
      dirEntries: {
        [SRC_DIR]: [file('index.ts'), dir('nested')],
        [NESTED_DIR]: [file('unwrapping.ts')],
      },
    });

    expect(workspaceDepDistIsStale(DEP_DIR, LEAF_ARTIFACTS, io)).toBe(true);
  });

  it('is not stale when src has no files even though dist is present', () => {
    const io = fakeIo({
      fileMtimes: { [DIST_JS]: 150, [DIST_DTS]: 150 },
      dirEntries: { [SRC_DIR]: [] },
    });

    expect(workspaceDepDistIsStale(DEP_DIR, LEAF_ARTIFACTS, io)).toBe(false);
  });

  it('is not stale when the src directory is absent entirely', () => {
    const io = fakeIo({ fileMtimes: { [DIST_JS]: 150, [DIST_DTS]: 150 }, dirEntries: {} });

    expect(workspaceDepDistIsStale(DEP_DIR, LEAF_ARTIFACTS, io)).toBe(false);
  });

  it('ignores a listed source file that has since vanished rather than treating it as newest', () => {
    // vanished.ts is listed by the directory walk but absent from the mtime map
    // (a list/stat race); it must be skipped, leaving only the older index.ts.
    const io = fakeIo({
      fileMtimes: { [DIST_JS]: 200, [DIST_DTS]: 200, [SRC_INDEX]: 100 },
      dirEntries: { [SRC_DIR]: [file('index.ts'), file('vanished.ts')] },
    });

    expect(workspaceDepDistIsStale(DEP_DIR, LEAF_ARTIFACTS, io)).toBe(false);
  });

  it('is stale when only a build-config input changed (the warm-pull build-config case)', () => {
    const io = fakeIo({
      fileMtimes: {
        [DIST_JS]: 150,
        [DIST_DTS]: 150,
        [SRC_INDEX]: 100,
        [path.join(DEP_DIR, 'tsup.config.ts')]: 200,
      },
      dirEntries: { [SRC_DIR]: [file('index.ts')] },
    });

    expect(workspaceDepDistIsStale(DEP_DIR, LEAF_ARTIFACTS, io)).toBe(true);
  });

  it('skips when the build-config inputs are older than the built dist', () => {
    const io = fakeIo({
      fileMtimes: {
        [DIST_JS]: 150,
        [DIST_DTS]: 150,
        [SRC_INDEX]: 100,
        [path.join(DEP_DIR, 'tsup.config.ts')]: 90,
        [path.join(DEP_DIR, 'tsconfig.build.json')]: 80,
      },
      dirEntries: { [SRC_DIR]: [file('index.ts')] },
    });

    expect(workspaceDepDistIsStale(DEP_DIR, LEAF_ARTIFACTS, io)).toBe(false);
  });

  it('witnesses the dep’s own artifact names, so a no-barrel config package skips when warm', () => {
    // A dep with named entries and no dist/index.js (the workspace-config shape):
    // judged against its own witness pair it reads current, where the leaf pair
    // would misread it as permanently stale and rebuild on every warm install.
    const configDepDir = '/repo/packages/core/workspace-config';
    const configArtifacts = ['tsup.config.base.js', 'tsup.config.base.d.ts'] as const;
    const configSrcDir = path.join(configDepDir, 'src');
    const io = fakeIo({
      fileMtimes: {
        [path.join(configDepDir, 'dist', 'tsup.config.base.js')]: 200,
        [path.join(configDepDir, 'dist', 'tsup.config.base.d.ts')]: 200,
        [path.join(configSrcDir, 'tsup.config.base.ts')]: 100,
      },
      dirEntries: { [configSrcDir]: [file('tsup.config.base.ts')] },
    });

    expect(workspaceDepDistIsStale(configDepDir, configArtifacts, io)).toBe(false);
    expect(workspaceDepDistIsStale(configDepDir, LEAF_ARTIFACTS, io)).toBe(true);
  });
});
