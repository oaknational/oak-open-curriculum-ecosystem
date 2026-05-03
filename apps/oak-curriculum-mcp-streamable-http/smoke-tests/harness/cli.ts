/**
 * Smoke-harness CLI entrypoint.
 *
 * @remarks
 * Invoked by the workspace's `smoke:dev:*` package scripts via
 * `pnpm exec tsx smoke-tests/harness/cli.ts <mode-name>`. Reads the
 * mode-name from `argv`, resolves it through the registry, and runs
 * the harness end-to-end with the production DI seams. Exits with the
 * harness's structured exit code: `0` on full smoke success, non-zero
 * on any boot or test failure.
 *
 * This file is the smoke harness's single permitted process-level
 * composition root. It MAY read `process.env` (per `testing-strategy.md`
 * §"Smoke composition roots may read ambient env"); the rest of the
 * harness module is pure / DI-driven.
 *
 * @packageDocumentation
 */

import { fileURLToPath } from 'node:url';
import { resolve as resolvePath } from 'node:path';
import { createInProcessBootServer } from './boot-server.js';
import { listSmokeModes, resolveSmokeMode } from './modes.js';
import { runSmokeMode } from './run-smoke.js';
import { createChildProcessVitestSpawner } from './spawn-vitest.js';

const VITEST_SMOKE_CONFIG_PATH = 'vitest.smoke.config.ts';

async function main(argv: readonly string[]): Promise<number> {
  const modeName = argv[2];
  if (modeName === undefined || modeName.length === 0) {
    process.stderr.write(formatUsageError(undefined));
    return 1;
  }

  let mode;
  try {
    mode = resolveSmokeMode(modeName);
  } catch (error) {
    process.stderr.write(formatUsageError(error));
    return 1;
  }

  const result = await runSmokeMode(mode, {
    bootServer: createInProcessBootServer({ clock: () => Date.now() }),
    spawnVitest: createChildProcessVitestSpawner({
      clock: () => Date.now(),
      processEnv: process.env,
    }),
    clock: () => Date.now(),
    vitestConfigPath: VITEST_SMOKE_CONFIG_PATH,
  });

  process.stdout.write(
    `[smoke-harness] mode=${mode.name} bootOutcome=${result.bootOutcome} ` +
      `bootMs=${String(result.bootDurationMs)} testMs=${String(result.testDurationMs)} ` +
      `exitCode=${String(result.exitCode)}\n`,
  );

  return result.exitCode;
}

function formatUsageError(error: unknown): string {
  const available = listSmokeModes();
  const detail = available.length === 0 ? '(none registered yet)' : available.join(', ');
  const cause = error instanceof Error ? `${error.message}\n` : '';
  return `${cause}Usage: tsx smoke-tests/harness/cli.ts <mode-name>\nAvailable modes: ${detail}\n`;
}

const isMainModule =
  process.argv[1] !== undefined && resolvePath(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMainModule) {
  void main(process.argv).then((exitCode) => {
    process.exit(exitCode);
  });
}

export { main };
