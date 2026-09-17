/**
 * Pure decision logic for the agent-tools install bootstrap.
 *
 * The runtime that resolves `tsc`, spawns it, and sets executable bits lives in
 * `bootstrap.ts`; this module isolates the part that must never get the
 * fail-open semantics wrong, so it can be unit-tested in isolation.
 *
 * @packageDocumentation
 */
import path from 'node:path';

import { z } from 'zod';

/** One directory entry: its name and whether it is itself a directory. */
export interface WorkspaceDepDirEntry {
  readonly name: string;
  readonly isDirectory: boolean;
}

/**
 * Minimal filesystem seam for the staleness decision, injected so both the
 * decision AND its recursive `src` walk stay pure functions testable with a
 * fake (ADR-078). The primitives are deliberately thin — a single mtime, a
 * directory existence check, and one non-recursive directory listing — so the
 * production binding in `bootstrap-helpers-io.ts` is only `node:fs` wiring with
 * no branching logic worth a real-IO test. Mirrors the `WatcherStalenessIo`
 * split.
 */
export interface WorkspaceDepFsIo {
  /** mtime (ms since the epoch) of a file, or the literal `'missing'` when it is absent. */
  readonly statMtimeMs: (filePath: string) => number | 'missing';
  /** Whether `dir` exists as a directory. */
  readonly dirExists: (dir: string) => boolean;
  /** The immediate entries of `dir` (not recursive); the caller recurses on directories. */
  readonly readDirEntries: (dir: string) => readonly WorkspaceDepDirEntry[];
}

/**
 * Newest file mtime (ms since the epoch) anywhere under `dir`, walked
 * recursively through the seam, or `undefined` when `dir` is absent or holds no
 * readable files. A listed entry that has since vanished (`statMtimeMs` reads
 * `'missing'`) is skipped rather than treated as newest.
 */
function newestFileMtimeMs(dir: string, io: WorkspaceDepFsIo): number | undefined {
  if (!io.dirExists(dir)) {
    return undefined;
  }
  let newest: number | undefined;
  for (const entry of io.readDirEntries(dir)) {
    const entryPath = path.join(dir, entry.name);
    let candidate: number | undefined;
    if (entry.isDirectory) {
      candidate = newestFileMtimeMs(entryPath, io);
    } else {
      const mtimeMs = io.statMtimeMs(entryPath);
      candidate = mtimeMs === 'missing' ? undefined : mtimeMs;
    }
    if (candidate !== undefined && (newest === undefined || candidate > newest)) {
      newest = candidate;
    }
  }
  return newest;
}

/** Build-config inputs whose change must rebuild a dep exactly as a src change does. */
const BUILD_CONFIG_INPUTS = ['tsup.config.ts', 'tsconfig.build.json'] as const;

/**
 * Decide whether a leaf workspace dep's built `dist` is stale relative to its
 * inputs — i.e. whether the install bootstrap must rebuild it.
 *
 * `buildWorkspaceDep` must rebuild whenever the source has changed since the
 * last build, not merely when `dist` is absent. A warm checkout that pulls new
 * leaf-package source (new exports) over an existing `dist` would otherwise keep
 * the stale `dist`; agent-tools' own `tsc` then fails to compile against the
 * out-of-date `.d.ts`, bricking the fail-open PreToolUse Bash guard that imports
 * `agent-tools/dist` (MCP-472; the "freshness != liveness" class). Fresh
 * checkouts escape the original bug because `dist` is absent and so build.
 *
 * Stale when any witness dist artifact is missing, or the newest input —
 * any file under `src/`, or a present build-config input
 * (`tsup.config.ts`, `tsconfig.build.json`) — is strictly newer than the
 * oldest present witness artifact. The
 * witnesses are per-dep: each dep names one bundler output and one declaration
 * output from its own `dist` (a leaf package's `index.js` + `index.d.ts`; a
 * no-barrel config package's named entries), so the decision proves both build
 * steps ran without assuming a barrel the package does not ship. The oldest
 * witness is the reference so that a single out-of-date artifact (e.g. a stale
 * `.d.ts`) still forces a rebuild; the strict comparison means a freshly built
 * `dist` (written after its sources) is never treated as stale, so a warm
 * checkout with unchanged source still skips.
 *
 * @param depDir - Absolute path to the workspace dep directory (holds `src/` and `dist/`).
 * @param distArtifacts - The dep's witness artifact names, relative to its `dist/`.
 * @param io - The filesystem seam supplying mtimes and the `src` directory walk.
 * @returns `true` when a rebuild is required, `false` when the built `dist` is current.
 */
export function workspaceDepDistIsStale(
  depDir: string,
  distArtifacts: readonly string[],
  io: WorkspaceDepFsIo,
): boolean {
  const distArtifactMtimesMs: number[] = [];
  for (const artifact of distArtifacts) {
    const mtimeMs = io.statMtimeMs(path.join(depDir, 'dist', artifact));
    if (mtimeMs === 'missing') {
      return true;
    }
    distArtifactMtimesMs.push(mtimeMs);
  }
  const oldestDistMtimeMs = Math.min(...distArtifactMtimesMs);
  // Build configuration shapes the outputs as much as source does: a warm
  // pull changing only tsup.config.ts or tsconfig.build.json must rebuild,
  // or the witness artifacts stay newer than every source and stale dist
  // ships (Copilot round, 2026-08-10 — the warm-pull sibling of MCP-472).
  const buildConfigMtimesMs = BUILD_CONFIG_INPUTS.map((name) =>
    io.statMtimeMs(path.join(depDir, name)),
  ).filter((mtimeMs): mtimeMs is number => mtimeMs !== 'missing');
  const newestSrcMtimeMs = newestFileMtimeMs(path.join(depDir, 'src'), io);
  const newestInputMtimeMs = Math.max(newestSrcMtimeMs ?? -Infinity, ...buildConfigMtimesMs);
  if (newestInputMtimeMs === -Infinity) {
    return false;
  }
  return newestInputMtimeMs > oldestDistMtimeMs;
}

/** The relevant fields of a `child_process.spawnSync` result for the tsc run. */
export interface TscSpawnOutcome {
  /** A spawn-level error (e.g. the binary could not be started). */
  readonly error: Error | undefined;
  /** The signal that terminated the process, or `null` if it exited normally. */
  readonly signal: NodeJS.Signals | null;
  /** The exit code, or `null` when the process was killed by a signal. */
  readonly status: number | null;
}

/** The verdict on whether the tsc build succeeded and the code to exit with. */
export interface TscOutcomeVerdict {
  /** True when the build did not complete cleanly. */
  readonly failed: boolean;
  /** The process exit code to use. Never `0` when `failed` is true. */
  readonly exitCode: number;
  /** A human-readable failure reason, or `undefined` on success. */
  readonly reason: string | undefined;
}

/**
 * Interpret a spawnSync outcome into a pass/fail verdict with a safe exit code.
 *
 * Critically, a signal kill returns `status === null`; this must map to a
 * non-zero exit code. Coercing a `null` status to `process.exit(null)` would
 * exit `0`, leaving `dist` unbuilt and the fail-open PreToolUse guards without
 * their artefact.
 *
 * @param label - The human-readable name of the spawned tool, used in reasons.
 * @param outcome - The spawnSync error/signal/status triple.
 * @returns The verdict; `exitCode` is always non-zero when `failed` is true.
 *
 * @example
 *
 * ```ts
 * interpretSpawnOutcome('tsup', { error: undefined, signal: 'SIGKILL', status: null });
 * // { failed: true, exitCode: 1, reason: 'tsup was killed by signal SIGKILL' }
 * ```
 */
export function interpretSpawnOutcome(label: string, outcome: TscSpawnOutcome): TscOutcomeVerdict {
  if (outcome.error !== undefined) {
    return {
      failed: true,
      exitCode: 1,
      reason: `failed to start ${label}: ${outcome.error.message}`,
    };
  }
  if (outcome.signal !== null) {
    return {
      failed: true,
      exitCode: outcome.status ?? 1,
      reason: `${label} was killed by signal ${outcome.signal}`,
    };
  }
  if (outcome.status !== 0) {
    return {
      failed: true,
      exitCode: outcome.status ?? 1,
      reason: `${label} exited with code ${outcome.status ?? 'null'}`,
    };
  }
  return { failed: false, exitCode: 0, reason: undefined };
}

/**
 * Interpret the agent-tools `tsc` build outcome.
 *
 * @param outcome - The spawnSync error/signal/status triple.
 * @returns The verdict from {@link interpretSpawnOutcome} with the `tsc` label.
 */
export function interpretTscOutcome(outcome: TscSpawnOutcome): TscOutcomeVerdict {
  return interpretSpawnOutcome('tsc', outcome);
}

/** The manifest fields this bootstrap consumes — the validated boundary shape. */
const binManifestSchema = z.object({
  bin: z.union([z.string(), z.record(z.string(), z.string())]).optional(),
});

/**
 * Resolve a package's JS bin entry from its parsed, untrusted manifest.
 *
 * Handles both manifest shapes (`"bin": "./x.js"` and
 * `"bin": { "name": "./x.js" }`) by validating the manifest at the boundary:
 * any shape that does not yield a non-empty string for the requested bin name
 * returns `undefined` so the caller can fail loudly with context.
 *
 * @param packageDir - Absolute directory containing the package's manifest.
 * @param manifest - The parsed manifest JSON, untrusted.
 * @param binName - The bin entry to resolve (the package's command name).
 * @returns The absolute path to the JS bin, or `undefined` if unresolvable.
 */
export function binPathFromManifest(
  packageDir: string,
  manifest: unknown,
  binName: string,
): string | undefined {
  const parsed = binManifestSchema.safeParse(manifest);
  if (!parsed.success) {
    return undefined;
  }
  const manifestBin = parsed.data.bin;
  if (typeof manifestBin === 'string' && manifestBin.length > 0) {
    return path.join(packageDir, manifestBin);
  }
  if (typeof manifestBin === 'object' && manifestBin !== undefined) {
    const entry = manifestBin[binName];
    if (typeof entry === 'string' && entry.length > 0) {
      return path.join(packageDir, entry);
    }
  }
  return undefined;
}
