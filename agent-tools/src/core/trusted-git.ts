/**
 * Shared hardening for invoking the `git` binary from agent tooling.
 *
 * @remarks
 * Resolving `git` by name — letting the OS search `PATH` — is SonarCloud S4036
 * ("OS commands should not rely on PATH resolution"): a user-writable `PATH`
 * entry can shadow `git` with a malicious binary. {@link resolveTrustedGit}
 * returns the absolute path from a fixed, platform-partitioned allowlist of
 * complete binary paths through the one resolver in `trusted-binary.ts`,
 * which carries the full rationale (the partition, the hard-coded Windows
 * literals, the per-user installs excluded). This is the FIX in code, not a
 * Sonar disposition, and the only pattern agent tooling uses to locate `git`.
 * (Pinning `PATH` to a trusted directory does NOT clear S4036: the analyser
 * flags the by-name call regardless of any `env.PATH` override.)
 *
 * Only the fixed allowlist is searched; an arbitrary or non-standard git
 * location (asdf/mise shims, the Nix store, a custom prefix, a per-user
 * installer scope) is not — accepting a caller-influenced path is the S4036
 * hole itself. When git lives only in such a location,
 * {@link resolveTrustedGit} fails loud with the platform's remedy rather than
 * silently returning an unverified path.
 *
 * @packageDocumentation
 */

import { existsSync } from 'node:fs';

import { type PathExists } from './path-exists.js';
import { resolveTrustedBinary, type TrustedBinarySpec } from './trusted-binary.js';

/**
 * The resolver's own refusal, typed so callers that wrap git EXECUTION
 * failures (e.g. "not inside a git working tree" translations) can let a
 * resolution failure pass through as itself. Twice in this repository's
 * history a resolver refusal was rebranded by a caller into a different
 * diagnosis ("formatting issues found", "not inside a git working tree") and
 * sent readers hunting a problem that did not exist — the type is the
 * discrimination those call sites need.
 */
export class TrustedGitResolutionError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'TrustedGitResolutionError';
  }
}

/**
 * The `git` allowlist and remedy.
 *
 * @remarks
 * Windows ordering: `cmd\git.exe` first (the installer's documented, stable
 * entry point), then `mingw64\bin\git.exe` (the real binary — defends a layout
 * without `cmd\`), then the 32-bit-on-64-bit install. All live under
 * `Program Files`, whose ACL grants non-administrators read-execute only.
 */
const TRUSTED_GIT: TrustedBinarySpec = {
  name: 'git',
  paths: {
    posix: ['/usr/bin/git', '/bin/git', '/opt/homebrew/bin/git', '/usr/local/bin/git'],
    win32: [
      String.raw`C:\Program Files\Git\cmd\git.exe`,
      String.raw`C:\Program Files\Git\mingw64\bin\git.exe`,
      String.raw`C:\Program Files (x86)\Git\cmd\git.exe`,
    ],
  },
  remedyFor: (platform) =>
    platform === 'win32'
      ? `If git is installed per-user or portably, install Git for Windows system-wide instead ` +
        `(winget install Git.Git): per-user locations are writable without administrator ` +
        `rights, so they cannot be trusted here.`
      : `If git is installed elsewhere (asdf/mise, Nix, a custom prefix), symlink it at one of ` +
        `those paths.`,
};

/**
 * Resolve the absolute path to `git` from the platform's fixed allowlist of
 * complete binary paths ({@link TRUSTED_GIT}).
 *
 * @remarks
 * When no trusted git is found this **throws** a clear, actionable error
 * naming the searched paths and the platform's remedy: it never returns an
 * unverified path (a silent failure that would surface downstream as an
 * opaque `ENOENT` from the caller's `execFileSync`, in the commit-msg hook
 * blocking every commit). Callers run inside their own error handling, so
 * the loud throw replaces a cryptic downstream crash with a diagnosable one.
 * (Its siblings return a `Result`; this throwing resolver has many call
 * sites across the estate and migrates to `Result` with the no-throw
 * backlog, not piecemeal.)
 *
 * `platform` is injected (defaulting to `process.platform`) so each platform
 * branch is provable from any host — the POSIX-only predecessor of this
 * resolver shipped unverified precisely because nothing off-POSIX could
 * exercise it.
 *
 * @param exists - Existence probe; defaults to `node:fs` `existsSync`.
 * @param platform - Platform selector; defaults to `process.platform`.
 * @returns The absolute path to a trusted `git` binary.
 * @throws when no `git` exists at any trusted path for the platform.
 */
export function resolveTrustedGit(
  exists: PathExists = existsSync,
  platform: NodeJS.Platform = process.platform,
): string {
  const found = resolveTrustedBinary(TRUSTED_GIT, exists, platform);
  if (found.ok) {
    return found.value;
  }
  throw new TrustedGitResolutionError(found.error.message);
}
