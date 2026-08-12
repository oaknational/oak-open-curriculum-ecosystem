/**
 * Shared hardening for invoking the `git` binary from agent tooling.
 *
 * @remarks
 * Resolving `git` by name — letting the OS search `PATH` — is SonarCloud S4036
 * ("OS commands should not rely on PATH resolution"): a user-writable `PATH`
 * entry can shadow `git` with a malicious binary. The rule's documented
 * compliant fix is to execute git by its ABSOLUTE path. {@link resolveTrustedGit}
 * returns that absolute path from a fixed, platform-partitioned allowlist of
 * complete binary paths — this is the FIX in code, not a Sonar disposition, and
 * the only pattern agent tooling uses to locate `git`. The security property is
 * the *fixed absolute path* (resolution never consults `PATH`), not any
 * guarantee that every listed location is non-writable — some POSIX entries
 * (e.g. Homebrew's `/opt/homebrew/bin` or `/usr/local/bin`) are commonly
 * user-owned. (Pinning `PATH` to a trusted directory does NOT clear S4036: the
 * analyser flags the by-name call regardless of any `env.PATH` override, so
 * that approach was replaced outright.)
 *
 * The allowlist is partitioned by platform, and partitioning — not path-shape
 * filtering — is itself load-bearing: on win32, Node treats a rooted POSIX path
 * like `/usr/bin/git` as *drive-relative* (`path.isAbsolute` returns true, yet
 * it resolves against the process's current drive to e.g. `C:\usr\bin\git`,
 * user-plantable space on a default Windows ACL); on POSIX, a literal
 * `C:\...\git.exe` is a legal relative FILENAME plantable in a writable cwd.
 * Each family is therefore only ever consulted on its own platform. The
 * Windows entries are hard-coded literals deliberately: deriving them from
 * `%ProgramFiles%` would turn a fixed path into an environment-influenced one —
 * the S4036 hole restated. Per-user Git installs and GitHub Desktop's bundled
 * git are excluded for the same reason: they live in user-writable space.
 *
 * Only this fixed allowlist is searched; an arbitrary or non-standard git
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
 * Fixed, complete paths that may hold the `git` binary, partitioned by
 * platform (each probed as-is, never via `PATH`).
 *
 * @remarks
 * Windows ordering: `cmd\git.exe` first (the installer's documented, stable
 * entry point), then `mingw64\bin\git.exe` (the real binary — defends a layout
 * without `cmd\`), then the 32-bit-on-64-bit install. All live under
 * `Program Files`, whose ACL grants non-administrators read-execute only.
 */
const TRUSTED_GIT_PATHS = {
  posix: ['/usr/bin/git', '/bin/git', '/opt/homebrew/bin/git', '/usr/local/bin/git'],
  win32: [
    String.raw`C:\Program Files\Git\cmd\git.exe`,
    String.raw`C:\Program Files\Git\mingw64\bin\git.exe`,
    String.raw`C:\Program Files (x86)\Git\cmd\git.exe`,
  ],
} as const;

/** The platform family's candidate list — win32 gets the Windows entries, every other platform the POSIX entries. */
function trustedGitCandidates(platform: NodeJS.Platform): readonly string[] {
  return platform === 'win32' ? TRUSTED_GIT_PATHS.win32 : TRUSTED_GIT_PATHS.posix;
}

/** The platform-correct remedy for a refusal — actionable advice differs by OS. */
function remedyFor(platform: NodeJS.Platform): string {
  return platform === 'win32'
    ? `If git is installed per-user or portably, install Git for Windows system-wide instead ` +
        `(winget install Git.Git): per-user locations are writable without administrator ` +
        `rights, so they cannot be trusted here.`
    : `If git is installed elsewhere (asdf/mise, Nix, a custom prefix), symlink it at one of ` +
        `those paths.`;
}

/**
 * Resolve the absolute path to `git` from the platform's fixed allowlist of
 * complete binary paths ({@link TRUSTED_GIT_PATHS}).
 *
 * @remarks
 * Executing git by absolute path — not by name via `PATH` — defeats
 * PATH-hijacking (SonarCloud S4036, the compliant fix). When no trusted git is
 * found this **throws** a clear, actionable error naming the searched paths
 * and the platform's remedy: it never returns an unverified path (a silent
 * failure that would surface downstream as an opaque `ENOENT` from the
 * caller's `execFileSync`, in the commit-msg hook blocking every commit).
 * Callers run inside their own error handling, so the loud throw replaces a
 * cryptic downstream crash with a diagnosable one. (Its `gh` sibling
 * {@link resolveTrustedGh} returns a `Result`; this throwing resolver has
 * many call sites across the estate and migrates to `Result` with the
 * no-throw backlog, not piecemeal.)
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
  const candidates = trustedGitCandidates(platform);
  for (const candidate of candidates) {
    if (exists(candidate)) {
      return candidate;
    }
  }
  throw new TrustedGitResolutionError(
    `No trusted git binary found. Searched: ${candidates.join(', ')}. ` +
      `git is resolved by a fixed absolute path from these well-known locations (never via PATH) ` +
      `to defeat PATH-search hijacking (SonarCloud S4036). ${remedyFor(platform)}`,
  );
}
