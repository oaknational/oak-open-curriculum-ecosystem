/**
 * Fixed-location pnpm resolution — never a `PATH` lookup. The S4036
 * reasoning this module applies (a writable PATH entry must not choose
 * which binary runs) is shared with, and explained at length in,
 * `../core/trusted-git.ts`.
 *
 * @packageDocumentation
 */

import { existsSync } from 'node:fs';
import { isAbsolute } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { fullyQualifiedWin32 } from '../core/fully-qualified-path.js';
import { type PathExists } from '../core/path-exists.js';
import { trimTrailingSeparators } from '../core/path-separators.js';

import { pnpmSpawnEnvironment } from './pnpm-env.js';

/**
 * How to launch the resolved pnpm: an executable `file` plus the
 * `leadingArgs` that precede the caller's own pnpm arguments. POSIX pnpm and
 * the Windows standalone `pnpm.exe` launch directly (`leadingArgs` empty); a
 * JS entry point (corepack's launcher, the npm-global module) launches via
 * the running Node binary (`process.execPath` — trusted by definition: it IS
 * the current process), because Windows `.cmd` shims cannot be executed by
 * `execFileSync`/`spawn` at all (Node rejects them since the CVE-2024-27980
 * hardening) and a `.js` file is not directly executable.
 */
export interface PnpmInvocation {
  readonly file: string;
  readonly leadingArgs: readonly string[];
  /**
   * The environment this invocation must be spawned with — the caller's own
   * environment, scrubbed by {@link pnpmSpawnEnvironment}.
   *
   * It rides in the contract rather than being left to each call site because
   * both launch modes need it and five of six callers had omitted it: the
   * corepack launcher (the win32 first candidate) obeys every `COREPACK_*`
   * variable — several of which redirect which package-manager build
   * executes, or where it is downloaded from — and the standalone binary
   * refuses to self-switch to the repository's pin when `COREPACK_ROOT` is
   * inherited. A resolver that hands back a file but not
   * the environment it must run in is a shape that invites the omission.
   */
  readonly env: NodeJS.ProcessEnv;
}

/** A probe-able pnpm location: the artefact to `exists`-check and how to launch it. */
interface PnpmCandidate {
  readonly path: string;
  readonly launch: 'direct' | 'via-node';
}

/**
 * Corepack's pnpm launcher as installed by the official Node.js Windows
 * installer — a fixed literal under `Program Files` (admin-protected ACL),
 * present on every standard Node-for-Windows install since corepack began
 * shipping with Node. Hard-coded deliberately: deriving it from
 * `%ProgramFiles%` would turn a fixed path into an environment-influenced
 * one (the S4036 hole restated).
 */
const WIN32_COREPACK_PNPM = String.raw`C:\Program Files\nodejs\node_modules\corepack\dist\pnpm.js`;

/** A trimmed env value, or undefined when unset or blank. */
function envValue(env: NodeJS.ProcessEnv, name: string): string | undefined {
  const value = env[name]?.trim();
  return value !== undefined && value.length > 0 ? value : undefined;
}

/**
 * An env-derived win32 root, with any trailing separator trimmed so
 * candidate composition never produces a doubled separator (`D:\pnpm-home\`
 * + `\pnpm.exe` would otherwise probe `D:\pnpm-home\\pnpm.exe`).
 *
 * The TRIMMED root itself must be fully qualified, not just the composed
 * candidate: a bare `C:` (or a `C:\` that trims to it) is drive-relative
 * space, yet composing `C:` + `\pnpm.exe` yields `C:\pnpm.exe`, which the
 * later per-candidate filter accepts — quietly turning a caller-influenced
 * root into an accepted drive-root probe. Refusing the root here keeps the
 * stated invariant: env-derived locations are honoured only when the value
 * already names a fixed, drive-qualified directory.
 */
function win32Root(env: NodeJS.ProcessEnv, name: string): string | undefined {
  const value = envValue(env, name);
  if (value === undefined) {
    return undefined;
  }
  const trimmed = trimTrailingSeparators(value);

  return fullyQualifiedWin32(trimmed) ? trimmed : undefined;
}

function win32Candidates(env: NodeJS.ProcessEnv): readonly PnpmCandidate[] {
  const candidates: PnpmCandidate[] = [{ path: WIN32_COREPACK_PNPM, launch: 'via-node' }];
  const pnpmHome = win32Root(env, 'PNPM_HOME');
  if (pnpmHome !== undefined) {
    candidates.push(
      { path: String.raw`${pnpmHome}\pnpm.exe`, launch: 'direct' },
      { path: String.raw`${pnpmHome}\bin\pnpm.exe`, launch: 'direct' },
    );
  }
  const localAppData = win32Root(env, 'LOCALAPPDATA');
  if (localAppData !== undefined) {
    candidates.push({ path: String.raw`${localAppData}\pnpm\pnpm.exe`, launch: 'direct' });
  }
  const appData = win32Root(env, 'APPDATA');
  if (appData !== undefined) {
    candidates.push({
      path: String.raw`${appData}\npm\node_modules\pnpm\bin\pnpm.cjs`,
      launch: 'via-node',
    });
  }
  // Enforce the fixed-path invariant: a drive-relative or UNC candidate
  // (a rooted-but-unqualified PNPM_HOME, a network share) is
  // caller-influenced space, never a fixed install location.
  return candidates.filter((candidate) => fullyQualifiedWin32(candidate.path));
}

function posixCandidates(env: NodeJS.ProcessEnv): readonly PnpmCandidate[] {
  const candidates: string[] = [];
  const pnpmHome = envValue(env, 'PNPM_HOME');
  if (pnpmHome !== undefined) {
    candidates.push(`${pnpmHome}/pnpm`, `${pnpmHome}/bin/pnpm`);
  }
  const home = envValue(env, 'HOME');
  if (home !== undefined) {
    candidates.push(
      `${home}/Library/pnpm/pnpm`,
      `${home}/Library/pnpm/bin/pnpm`,
      `${home}/.local/share/pnpm/pnpm`,
      `${home}/.local/share/pnpm/bin/pnpm`,
    );
  }
  candidates.push('/opt/homebrew/bin/pnpm', '/usr/local/bin/pnpm', '/usr/bin/pnpm');
  // Enforce the absolute-only invariant: a relative PNPM_HOME (or HOME) would pass an
  // existsSync probe against the process cwd yet resolve against the worktree cwd under
  // execFileSync — running the wrong binary or none. Only absolute candidates are trusted.
  return candidates
    .filter((candidate) => isAbsolute(candidate))
    .map((candidate) => ({ path: candidate, launch: 'direct' as const }));
}

/**
 * Ordered candidate locations for the pnpm binary. POSIX: `$PNPM_HOME` (and
 * its `bin/` subdirectory), the per-user standalone install locations (macOS
 * and Linux), then the common system directories. Windows: corepack's fixed
 * launcher first (the only admin-protected location pnpm reliably has on
 * Windows), then the env-derived standalone and npm-global layouts. Bare
 * `pnpm` is never a candidate — resolution must never fall back to a PATH
 * lookup.
 *
 * The `bin/` sub-layout is probed on BOTH platforms — `$PNPM_HOME/bin/pnpm`
 * on POSIX, `%PNPM_HOME%\bin\pnpm.exe` on Windows — because pnpm's own
 * installer treats `PNPM_HOME` as the *global bin directory* while some
 * installations place the launcher one level down. Observed 2026-08-04: on a
 * contributor machine whose `PNPM_HOME` held the launcher under a `bin/`
 * subdirectory, none of the previous candidates existed, so every commit
 * failed — and the pre-commit hook surfaced the resolver's error as
 * "formatting issues found", which sent two separate agents hunting a
 * formatting problem that did not exist.
 */
function pnpmCandidates(
  env: NodeJS.ProcessEnv,
  platform: NodeJS.Platform,
): readonly PnpmCandidate[] {
  return platform === 'win32' ? win32Candidates(env) : posixCandidates(env);
}

/** The platform-correct remedy line for a failed resolution. */
function remedyFor(platform: NodeJS.Platform): string {
  return platform === 'win32'
    ? `Install Node.js system-wide (its corepack bundle provides pnpm), or set PNPM_HOME to a ` +
        `standalone pnpm install directory.`
    : `Set PNPM_HOME to pnpm's install directory.`;
}

/**
 * Resolve pnpm to a launchable invocation, never consulting `PATH` — so a
 * writable PATH entry cannot shadow it (the S4036 hardening, matching the
 * lane's `resolveTrustedGit` / `resolveTrustedGh` siblings).
 *
 * Probes the platform's candidate locations in order (see
 * {@link pnpmCandidates}). Returns `err` (never a throw) naming the searched
 * paths and the remedy when pnpm is found in none. `env` is an explicit
 * input, not read from a global, so the resolver is unit-testable without
 * touching `process.env`; `platform` is injected (defaulting to
 * `process.platform`) so each platform branch is provable from any host.
 *
 * @param env - Environment to derive per-user candidate locations from.
 * @param exists - Existence probe; defaults to `node:fs` `existsSync`.
 * @param platform - Platform selector; defaults to `process.platform`.
 * @returns `ok` with the {@link PnpmInvocation}, or `err` when no candidate
 *   exists.
 */
export function resolvePnpm(
  env: NodeJS.ProcessEnv,
  exists: PathExists = existsSync,
  platform: NodeJS.Platform = process.platform,
): Result<PnpmInvocation, Error> {
  const candidates = pnpmCandidates(env, platform);
  const found = candidates.find((candidate) => exists(candidate.path));
  if (found === undefined) {
    return err(
      new Error(
        `spawn: pnpm not found in any trusted location ` +
          `(${candidates.map((candidate) => candidate.path).join(', ')}). ${remedyFor(platform)}`,
      ),
    );
  }
  const spawnEnv = pnpmSpawnEnvironment(env, platform);

  return ok(
    found.launch === 'direct'
      ? { file: found.path, leadingArgs: [], env: spawnEnv }
      : { file: process.execPath, leadingArgs: [found.path], env: spawnEnv },
  );
}
