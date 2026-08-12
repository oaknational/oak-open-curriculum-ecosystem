import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { type PathExists } from '../core/path-exists.js';
import {
  buildGitleaksDirArgs,
  GITLEAKS_LEAK_EXIT_CODE,
  type SecretScan,
} from './refound-freeze-helpers.js';

/**
 * The pinned-gitleaks scanner seam for `refound-freeze` (F1 §8.3): resolve
 * the binary from a fixed allowlist of complete binary paths exactly once
 * — NEVER via `PATH` (the repository's established S4036 hardening; see
 * `core/trusted-git.ts` and `core/trusted-gh.ts`, whose reasoning this
 * third sibling mirrors) — probe its version for the run's attestation
 * line, and build the per-file scan closure over the resolved ABSOLUTE
 * path. The invocation shape itself stays in `refound-freeze-helpers.ts`
 * (`buildGitleaksDirArgs`).
 *
 * @packageDocumentation
 */

/**
 * Fixed, complete POSIX paths that may hold `gitleaks` (each probed as-is,
 * never via `PATH`). There is deliberately NO Windows list: gitleaks has no
 * administrator-protected install location on Windows — the Chocolatey and
 * winget directories are both writable without administrator rights — and a
 * trusted entry in user-writable space would defeat the control it exists
 * to be.
 */
const TRUSTED_GITLEAKS_PATHS = [
  '/opt/homebrew/bin/gitleaks',
  '/usr/local/bin/gitleaks',
  '/usr/bin/gitleaks',
  '/bin/gitleaks',
] as const;

/**
 * Resolve the absolute path to `gitleaks` from the fixed allowlist
 * {@link TRUSTED_GITLEAKS_PATHS} — the repository's established S4036 fix in
 * code (a caller-influenced `PATH` is the hijacking hole itself, so
 * resolution never consults it; the security property is the fixed
 * absolute path, not any guarantee every location is non-writable). A
 * gitleaks living only elsewhere (asdf/mise shims, the Nix store, a custom
 * prefix) is a loud refusal naming the remedy, never an unverified path.
 * On win32 the refusal is unconditional and explains why: unlike its `git`
 * and `gh` siblings, gitleaks has no admin-protected Windows location to
 * partition to, so the honest outcome is a refusal, not a Windows list.
 * `platform` is injected (defaulting to `process.platform`) so both branches
 * are provable from any host. Exported for the discrimination proof.
 *
 * @param exists - Existence probe; defaults to `node:fs` `existsSync`.
 * @param platform - Platform selector; defaults to `process.platform`.
 */
export function resolveTrustedGitleaks(
  exists: PathExists = existsSync,
  platform: NodeJS.Platform = process.platform,
): Result<string, Error> {
  if (platform === 'win32') {
    return err(
      new Error(
        'No trusted gitleaks binary is possible on Windows: gitleaks has no ' +
          'administrator-protected install location there (the Chocolatey and winget ' +
          'directories are writable without administrator rights), and a fixed trusted path ' +
          'in user-writable space would defeat the PATH-hijack control itself (SonarCloud ' +
          'S4036). Run refounding workflows from a POSIX host.',
      ),
    );
  }
  for (const candidate of TRUSTED_GITLEAKS_PATHS) {
    if (exists(candidate)) {
      return ok(candidate);
    }
  }
  return err(
    new Error(
      `No trusted gitleaks binary found. Searched: ${TRUSTED_GITLEAKS_PATHS.join(', ')}. ` +
        'gitleaks is resolved by a fixed absolute path from these well-known locations ' +
        '(never via PATH) to defeat PATH-search hijacking (SonarCloud S4036). If gitleaks is ' +
        'installed elsewhere (asdf/mise, Nix, a custom prefix), symlink it at one of those ' +
        'paths.',
    ),
  );
}

/** The slice of a spawn result the version probe interprets. */
interface VersionProbeOutcome {
  readonly error?: Error;
  readonly status: number | null;
  readonly stdout: string;
  readonly stderr: string;
}

/** Runs the version command against the pinned binary and reports the raw outcome. */
export type VersionProbeRunner = (binAbsPath: string) => VersionProbeOutcome;

/** The real probe edge: `<bin> version`, streams captured, nothing inherited. */
const spawnVersionProbe: VersionProbeRunner = (binAbsPath) =>
  spawnSync(binAbsPath, ['version'], {
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
  });

/**
 * Probe the resolved binary's self-reported version for the run's operator
 * attestation line. A binary that cannot print its version will not scan
 * either, so a failed probe is a refusal. The spawn edge is injected
 * (defaulting to the real `spawnSync` probe) so the interpretation logic is
 * provable without executing a binary — a shell-script fake is not even
 * executable on Windows. Exported for the proof.
 */
export function probeGitleaksVersion(
  binAbsPath: string,
  runProbe: VersionProbeRunner = spawnVersionProbe,
): Result<string, Error> {
  const probe = runProbe(binAbsPath);
  if (probe.error !== undefined) {
    return err(new Error(`cannot probe gitleaks version: ${probe.error.message}`));
  }
  if (probe.status !== 0 || probe.stdout.trim() === '') {
    return err(
      new Error(
        `gitleaks version probe failed (exit ${String(probe.status)})` +
          (probe.stderr.trim() === '' ? '' : `: ${probe.stderr.trim()}`),
      ),
    );
  }
  return ok(probe.stdout.trim());
}

/**
 * Production secret scan over a PINNED gitleaks binary: no-git `dir` mode,
 * one process per file with the repo root as cwd (see
 * {@link buildGitleaksDirArgs} for the empirically verified invocation shape
 * and its foot-guns). Refuses when the repo's `.gitleaks.toml` is absent
 * rather than silently scanning with a different rule set. Reports leaking
 * FILES only — never finding contents.
 */
export const makeGitleaksSecretScan =
  (repoRoot: string, binAbsPath: string): SecretScan =>
  (absFilePaths) => {
    if (!existsSync(path.join(repoRoot, '.gitleaks.toml'))) {
      return Promise.resolve(
        err(new Error('secret scan cannot run: .gitleaks.toml not found at the repo root')),
      );
    }
    const leakingFiles: string[] = [];
    for (const absFilePath of absFilePaths) {
      const relPath = path.relative(repoRoot, absFilePath);
      // stderr is captured for failure diagnostics only; gitleaks runs with
      // --redact=100 and --log-level error, so it never carries finding bytes.
      const scan = spawnSync(binAbsPath, [...buildGitleaksDirArgs(relPath)], {
        cwd: repoRoot,
        stdio: ['ignore', 'ignore', 'pipe'],
        encoding: 'utf8',
      });
      if (scan.error !== undefined) {
        return Promise.resolve(
          err(new Error(`secret scan failed to run gitleaks: ${scan.error.message}`)),
        );
      }
      if (scan.status === GITLEAKS_LEAK_EXIT_CODE) {
        leakingFiles.push(relPath);
      } else if (scan.status !== 0) {
        const stderrTail = scan.stderr.trim();
        return Promise.resolve(
          err(
            new Error(
              `secret scan failed on '${relPath}' (gitleaks exit ${String(scan.status)})` +
                (stderrTail === '' ? '' : `: ${stderrTail}`),
            ),
          ),
        );
      }
    }
    if (leakingFiles.length > 0) {
      return Promise.resolve(
        err(
          new Error(
            `secret scan found potential leaks in ${String(leakingFiles.length)} file(s): ` +
              `${leakingFiles.join(', ')} — owner escalation required, never a skip`,
          ),
        ),
      );
    }
    return Promise.resolve(ok(undefined));
  };
