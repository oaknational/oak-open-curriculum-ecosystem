/**
 * `pre-push` secret-scan CLI: scans only the commits being pushed.
 *
 * The `.husky/pre-push` hook captures git's ref lines into a temp file and calls
 * this with `--remote <name> --refs-file <path>`. This is the thin IO adapter
 * around the pure {@link computePushScanRanges}: it resolves the ranges to scan,
 * runs gitleaks over each, and exits non-zero if any range reports a leak. The
 * full `--branches --tags` history scan stays in CI (`pnpm secrets:scan`).
 *
 * A file path (rather than a multi-line `--refs` value) is used so the ref text
 * survives pnpm's shell-command argument handling as a single clean token.
 */
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { resolveTrustedGit } from '../core/trusted-git.js';
import {
  computePushScanRanges,
  degradedScanWarning,
  type ComputePushScanRangesInput,
} from './compute-push-scan-ranges.js';

export type PushSecretScanArgs = ComputePushScanRangesInput;

/**
 * Ask git which remotes are configured. Whether the push destination can
 * scope the scan is git's fact, not a guess from the destination's spelling —
 * git hands the hook a remote NAME or the destination verbatim, and only
 * membership here tells the two apart. Output is a short list git controls,
 * so capturing it is a fact about the call rather than an unexamined buffer.
 */
function readConfiguredRemotes(): string[] {
  const result = spawnSync(resolveTrustedGit(), ['remote'], { encoding: 'utf8' });
  if (result.error !== undefined || result.status !== 0) {
    // No list means nothing can be treated as scopable — the safe direction:
    // the scan widens and says so, rather than building a glob that matches
    // nothing while reporting success.
    return [];
  }
  return result.stdout
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/**
 * Parse the hook-supplied argv: `--remote <name>` and either `--refs <text>`
 * (used directly) or `--refs-file <path>` (read via the injected `readFile`,
 * keeping this function testable without touching the filesystem).
 */
export function parseArgs(
  argv: readonly string[],
  readFile: (path: string) => string,
  configuredRemotes: readonly string[],
): PushSecretScanArgs {
  let remoteName = '';
  let refsText = '';
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index + 1] ?? '';
    switch (argv[index]) {
      case '--remote':
        remoteName = value;
        index += 1;
        break;
      case '--refs':
        refsText = value;
        index += 1;
        break;
      case '--refs-file':
        refsText = value ? readFile(value) : '';
        index += 1;
        break;
      default:
        break;
    }
  }
  return { remoteName, refsText, configuredRemotes };
}

/**
 * Run `scanRange` over each computed range. `scanRange` returns true when a
 * range is clean, false when gitleaks reports a leak or fails to run. Pure
 * orchestration over an injected scanner and an injected warning sink.
 *
 * A scan that has lost its incremental range is announced through `warn`
 * BEFORE the first range runs (R6) — after the walk, an operator has already
 * spent the minutes the warning exists to explain.
 *
 * @returns the process exit code: 0 when every range is clean, 1 otherwise.
 */
export function runPushSecretScan(
  args: PushSecretScanArgs,
  scanRange: (range: string) => boolean,
  warn: (message: string) => void,
): number {
  const ranges = computePushScanRanges(args);
  const degraded = degradedScanWarning(ranges, args);
  if (degraded !== undefined) {
    warn(degraded);
  }
  let allClean = true;
  for (const range of ranges) {
    if (!scanRange(range)) {
      allClean = false;
    }
  }
  return allClean ? 0 : 1;
}

/** Scan one range with gitleaks; its own output is inherited to the terminal. */
function scanRangeWithGitleaks(range: string): boolean {
  const result = spawnSync(
    'gitleaks',
    ['detect', '--redact=100', '--source', '.', `--log-opts=${range}`],
    {
      stdio: ['ignore', 'inherit', 'inherit'],
      env: {
        ...process.env,
        GIT_CONFIG_COUNT: '1',
        GIT_CONFIG_KEY_0: 'diff.renameLimit',
        GIT_CONFIG_VALUE_0: '3000',
      },
    },
  );
  if (result.error !== undefined) {
    process.stderr.write(`gitleaks failed to run: ${result.error.message}\n`);
    return false;
  }
  return result.status === 0;
}

const currentFilePath = fileURLToPath(import.meta.url);
if (process.argv[1] === currentFilePath) {
  const args = parseArgs(
    process.argv.slice(2),
    (path) => readFileSync(path, 'utf8'),
    readConfiguredRemotes(),
  );
  process.exit(
    runPushSecretScan(args, scanRangeWithGitleaks, (message) => process.stderr.write(message)),
  );
}
