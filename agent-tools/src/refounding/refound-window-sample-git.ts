import { spawnSync } from 'node:child_process';

import { err, flatMap, isErr, ok, type Result } from '@oaknational/result';

import { type PathExists } from '../core/path-exists.js';
import { resolveTrustedGit } from '../core/trusted-git.js';
import { parseTreeEntry, type ByteSource } from './refound-window-sample-universe.js';

/**
 * The git-backed {@link ByteSource} for `refound-window-sample`: paths at
 * base via `git -C <repoRoot> ls-tree -r -z <base>` and bytes at base via
 * `git -C <repoRoot> show <base>:<path>` — the thin IO seam the pure
 * computation never sees.
 *
 * @remarks
 * Hardening posture (security-expert, s1-reader-sample-b1 gateway):
 *
 * - **Pinned binary** — git resolves from the fixed trusted-directory
 *   allowlist (`core/trusted-git.ts`, the established S4036 posture), never
 *   via `PATH` lookup.
 * - **Scrubbed environment** — the spawn passes an explicit minimal `env`
 *   ({@link buildScrubbedGitEnv}: only `PATH`, `HOME`, `LANG`, and `LC_*`
 *   survive), so every `GIT_*` variable is dropped by construction and the
 *   repository git reads is fully determined by `-C <repoRoot>` — `GIT_DIR`
 *   / `GIT_OBJECT_DIRECTORY` / `GIT_ALTERNATE_OBJECT_DIRECTORIES` /
 *   `GIT_CONFIG_COUNT`-`KEY`-`VALUE` injection cannot redirect it.
 * - **Replacement refs disabled** — every invocation passes the global
 *   `--no-replace-objects`: the env scrub cannot reach repository-local
 *   `refs/replace/*`, which git honours even for full object ids, so
 *   without the flag `ls-tree`/`show` could read a replacement commit or
 *   tree while the manifest records the original `baseSha`.
 * - **NUL-delimited listing** — `-z` keeps special-character paths intact
 *   (no C-quoting), `parseTreeEntry` refuses every non-regular-file mode,
 *   and the decoded listing must round-trip as UTF-8 or the run halts
 *   rather than windowing undecodable paths.
 *
 * Both seams are injectable for in-process tests (ADR-078): the
 * {@link GitSpawner} follows the `branch-touched-files/git.ts`
 * `GitCommandExecutor` precedent, and the existence probe follows
 * `resolveTrustedGit`'s own injected `exists`.
 *
 * @packageDocumentation
 */

/** One spawned git invocation's observable outcome (spawnSync-shaped). */
export interface GitSpawnResult {
  /** The spawn-level failure, when the process could not run at all. */
  readonly error?: Error;
  /** The exit status; `null` when the process was killed by a signal. */
  readonly status: number | null;
  readonly stdout: Buffer;
  readonly stderr: Buffer;
}

/** The spawn seam {@link makeGitByteSource} runs the pinned git through. */
export type GitSpawner = (gitBinAbsPath: string, args: readonly string[]) => GitSpawnResult;

/**
 * Ceiling for one captured git stdout (the full base-commit listing or one
 * file's bytes). Far above any plausible sweep-surface file, so the seam
 * never truncates silently — past it spawnSync fails loud with `ENOBUFS`.
 */
const GIT_MAX_BUFFER_BYTES = 256 * 1024 * 1024;

/**
 * The minimal environment a spawned git receives: ONLY `PATH`, `HOME`,
 * `LANG`, and `LC_*` survive; everything else — including every `GIT_*`
 * variable — is dropped by construction (see the module remarks).
 */
export function buildScrubbedGitEnv(env: NodeJS.ProcessEnv): Record<string, string> {
  const scrubbed: Record<string, string> = {};
  for (const key in env) {
    const value = env[key];
    if (value === undefined) {
      continue;
    }
    if (key === 'PATH' || key === 'HOME' || key === 'LANG' || key.startsWith('LC_')) {
      scrubbed[key] = value;
    }
  }
  return scrubbed;
}

/** Production spawner: capped stdout, scrubbed env, no shell. */
const spawnGit: GitSpawner = (gitBinAbsPath, args) =>
  spawnSync(gitBinAbsPath, [...args], {
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: GIT_MAX_BUFFER_BYTES,
    env: buildScrubbedGitEnv(process.env),
  });

/** {@link resolveTrustedGit} as a `Result` (it throws; library code must not). */
function resolveGitBinary(exists: PathExists | undefined): Result<string, Error> {
  try {
    return ok(resolveTrustedGit(exists));
  } catch (error: unknown) {
    return err(new Error(error instanceof Error ? error.message : String(error)));
  }
}

/**
 * Parse one NUL-delimited `ls-tree -r -z` listing into repo-relative paths:
 * the decoded text must round-trip as UTF-8 (refusing undecodable paths
 * loudly instead of windowing replacement characters) and every entry must
 * be a regular-file blob ({@link parseTreeEntry}).
 */
function parseNulDelimitedListing(listing: Buffer): Result<readonly string[], Error> {
  const decoded = listing.toString('utf8');
  if (!Buffer.from(decoded, 'utf8').equals(listing)) {
    return err(
      new Error(
        'base-commit listing does not round-trip as UTF-8 — refusing to window ' +
          'undecodable tree paths; halting with nothing written',
      ),
    );
  }
  const paths: string[] = [];
  for (const entry of decoded.split('\0')) {
    if (entry === '') {
      continue;
    }
    const parsed = parseTreeEntry(entry);
    if (isErr(parsed)) {
      return parsed;
    }
    paths.push(parsed.value);
  }
  return ok(paths);
}

/** Injectable seams for {@link makeGitByteSource} (testing + composition, ADR-078). */
export interface GitByteSourceOptions {
  /** The spawn seam; defaults to the scrubbed-env production spawner. */
  readonly spawn?: GitSpawner;
  /** Existence probe for the trusted-git resolution; defaults to `node:fs`. */
  readonly exists?: PathExists;
}

/**
 * Build the git-backed {@link ByteSource} at one base commit. The git
 * binary resolves from the trusted allowlist exactly once, up front; every
 * invocation then goes through the (injectable) spawner with the scrubbed
 * environment.
 */
export function makeGitByteSource(
  repoRoot: string,
  baseSha: string,
  options: GitByteSourceOptions = {},
): Result<ByteSource, Error> {
  const gitBin = resolveGitBinary(options.exists);
  if (isErr(gitBin)) {
    return gitBin;
  }
  const spawn = options.spawn ?? spawnGit;
  const runGit = (gitArgs: readonly string[]): Result<Buffer, Error> => {
    const run = spawn(gitBin.value, ['--no-replace-objects', '-C', repoRoot, ...gitArgs]);
    if (run.error !== undefined) {
      return err(new Error(`cannot run git ${gitArgs.join(' ')}: ${run.error.message}`));
    }
    if (run.status !== 0) {
      const stderrTail = run.stderr.toString('utf8').trim();
      return err(
        new Error(
          `git ${gitArgs.join(' ')} exited ${String(run.status)}` +
            (stderrTail === '' ? '' : `: ${stderrTail}`),
        ),
      );
    }
    return ok(run.stdout);
  };
  return ok({
    listPaths: (): Result<readonly string[], Error> =>
      flatMap(runGit(['ls-tree', '-r', '-z', baseSha]), parseNulDelimitedListing),
    readBytes: (relPath: string): Result<Uint8Array, Error> =>
      runGit(['show', `${baseSha}:${relPath}`]),
  });
}
