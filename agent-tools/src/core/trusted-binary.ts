/**
 * The one resolver behind every trusted-binary lookup in agent tooling.
 *
 * @remarks
 * Resolving a command by name lets the OS search `PATH` (SonarCloud S4036,
 * "OS commands should not rely on PATH resolution"). The disposition policy
 * (`docs/governance/sonar-disposition-policy.md` §S4036) makes `PATH` the
 * trust root for a repository-required binary invoked by name, so this
 * resolver is not what the policy requires. It is what `trusted-git.ts`,
 * `trusted-shell.ts` and `trusted-gitleaks.ts` resolve through, each
 * declaring its allowlist and remedy as a {@link TrustedBinarySpec} (one home
 * at the second consumer). Its security property is the fixed absolute path
 * (resolution never consults `PATH`), not any guarantee that every listed
 * location is non-writable.
 *
 * The allowlist is partitioned by platform, and the partition is itself
 * load-bearing: on win32 a rooted POSIX path such as `/usr/bin/git` is
 * drive-relative (it resolves against the current drive into user-plantable
 * space), and on POSIX a literal `C:\...` is a legal relative filename that
 * `execvp` resolves by `PATH` search, the S4036 hole restated. Each family is
 * therefore only ever consulted on its own platform, and the Windows entries
 * are hard-coded literals: deriving them from `%ProgramFiles%` would turn a
 * fixed path into an environment-influenced one. A platform with no
 * administrator-protected location for a binary declares an empty family and
 * is refused loudly, never served from user-writable space.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';

import { type PathExists } from './path-exists.js';

/** A binary's fixed, complete candidate paths, one family per platform. */
interface TrustedBinaryPaths {
  /** Probed on every platform but win32, in order. */
  readonly posix: readonly string[];
  /** Probed on win32 only, in order; empty when the platform offers no protected location. */
  readonly win32: readonly string[];
}

/** What a trusted-binary resolver declares: the name, the allowlist and the remedy. */
export interface TrustedBinarySpec {
  /** The command's name, as the refusal says what is resolved (`git`, `gitleaks`, `sh`). */
  readonly name: string;
  /** The fixed candidate paths. */
  readonly paths: TrustedBinaryPaths;
  /** The platform-correct remedy appended to a refusal; advice differs by OS. */
  readonly remedyFor: (platform: NodeJS.Platform) => string;
}

/** The platform family's candidate list: win32 gets the Windows entries, every other platform the POSIX entries. */
function trustedBinaryCandidates(
  paths: TrustedBinaryPaths,
  platform: NodeJS.Platform,
): readonly string[] {
  return platform === 'win32' ? paths.win32 : paths.posix;
}

/**
 * Resolve the absolute path of a binary from its platform's fixed allowlist.
 *
 * @remarks
 * Each candidate is probed as-is, never via `PATH`. When none exists the
 * refusal names every searched path, says why resolution is absolute, and
 * carries the platform's remedy, so the failure reads as itself rather than
 * as a downstream `ENOENT` from the caller's spawn (ADR-088: a `Result`,
 * never a throw).
 *
 * @param spec - The binary's name, allowlist and remedy.
 * @param exists - Existence probe, injected so each platform branch is provable from any host.
 * @param platform - Platform selector, injected for the same reason.
 * @returns `ok` with the absolute path, or `err` naming every searched path.
 */
export function resolveTrustedBinary(
  spec: TrustedBinarySpec,
  exists: PathExists,
  platform: NodeJS.Platform,
): Result<string, Error> {
  const candidates = trustedBinaryCandidates(spec.paths, platform);
  for (const candidate of candidates) {
    if (exists(candidate)) {
      return ok(candidate);
    }
  }
  const searched =
    candidates.length === 0
      ? 'nothing (no trusted location on this platform)'
      : candidates.join(', ');
  return err(
    new Error(
      `No trusted ${spec.name} binary found. Searched: ${searched}. ` +
        `${spec.name} is resolved by a fixed absolute path from these well-known locations (never via PATH) ` +
        `to defeat PATH-search hijacking (SonarCloud S4036). ${spec.remedyFor(platform)}`,
    ),
  );
}
