import { spawnSync, type SpawnSyncReturns } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * CLI smoke for the five corpus and restatement-audit drivers that read their flags through
 * `parseArgs`: an unknown flag is a normal input error, so each driver's first stderr line is
 * `Invalid flags: …` (the shared `core/parse-flags.ts`; two add their usage block after it)
 * and it exits 1, never with an unhandled stack trace. Each runs from source under tsx, from this package's
 * directory, as their documented usage does.
 */

const AGENT_TOOLS_ROOT = fileURLToPath(new URL('..', import.meta.url));
const DRIVERS = [
  'src/corpus-analysis/post-run/post-run-driver.ts',
  'src/corpus-analysis/post-run/salvage-driver.ts',
  'src/corpus-analysis/workflows/build/build-run-artefact.ts',
  'src/restatement-audit/render-ledger-cli.ts',
  'src/restatement-audit/workflows/build/build-run-artefact.ts',
] as const;

function fail(message: string): never {
  process.stderr.write(`invalid-flags drivers smoke: ${message}\n`);
  process.exit(1);
}

function run(driver: (typeof DRIVERS)[number]): SpawnSyncReturns<string> {
  return spawnSync(
    process.execPath,
    ['--import', 'tsx', join(AGENT_TOOLS_ROOT, driver), '--no-such-flag'],
    { cwd: AGENT_TOOLS_ROOT, encoding: 'utf8' },
  );
}

for (const driver of DRIVERS) {
  const result = run(driver);
  const combined = `${result.stdout}${result.stderr}`;
  if (result.status !== 1) {
    fail(
      `${driver}: expected exit 1 on an unknown flag, got ${String(result.status)} (signal ${String(result.signal)}${result.error === undefined ? '' : `, ${result.error.message}`})`,
    );
  }
  if (!result.stderr.startsWith('Invalid flags: ')) {
    fail(`${driver}: expected the concise "Invalid flags: " line, got:\n${combined.slice(0, 600)}`);
  }
  if (combined.includes('    at ')) {
    fail(`${driver}: the flag error carried a stack trace`);
  }
}
process.stdout.write(
  `invalid-flags drivers smoke OK: ${String(DRIVERS.length)} drivers refuse an unknown flag with an Invalid flags first line, exit 1, no stack trace\n`,
);
