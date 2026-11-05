import {
  spawnSync,
  type SpawnSyncOptionsWithStringEncoding,
  type SpawnSyncReturns,
} from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import {
  buildGitleaksDirArgs,
  GITLEAKS_LEAK_EXIT_CODE,
  type SecretScan,
} from './refound-freeze-helpers.js';

/**
 * The gitleaks scanner seam for `refound-freeze` (F1 §8.3): probe the
 * scanner's version for the run's attestation line, and build the per-file
 * scan closure. Both run `gitleaks` by name. The invocation shape itself
 * stays in `refound-freeze-helpers.ts` (`buildGitleaksDirArgs`).
 *
 * @packageDocumentation
 */

/** A `spawnSync`-shaped runner: the version probe's injection seam, so tests supply a fake. */
export type GitleaksRunner = (
  file: string,
  args: readonly string[],
  options: SpawnSyncOptionsWithStringEncoding,
) => SpawnSyncReturns<string>;

/**
 * Probe gitleaks's self-reported version for the run's operator attestation
 * line. A gitleaks that cannot print its version will not scan either, so a
 * failed probe is a refusal. The probe runs from `repoRoot`, the cwd every
 * scan uses, so a cwd-sensitive lookup (a version manager's shim) attests the
 * same gitleaks the scans run. Exported for the proof.
 *
 * @param repoRoot - The repository root, the cwd for the probe.
 * @param run - Process runner; defaults to `node:child_process` `spawnSync`.
 */
export function probeGitleaksVersion(
  repoRoot: string,
  run: GitleaksRunner = spawnSync,
): Result<string, Error> {
  const probe = run('gitleaks', ['version'], {
    cwd: repoRoot,
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
  });
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
 * Production secret scan by gitleaks: no-git `dir` mode, one process per
 * file with the repo root as cwd (see {@link buildGitleaksDirArgs} for the
 * empirically verified invocation shape and its foot-guns). Refuses when the
 * repo's `.gitleaks.toml` is absent rather than silently scanning with a
 * different rule set. Reports leaking FILES only — never finding contents.
 */
export const makeGitleaksSecretScan =
  (repoRoot: string): SecretScan =>
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
      const scan = spawnSync('gitleaks', [...buildGitleaksDirArgs(relPath)], {
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
