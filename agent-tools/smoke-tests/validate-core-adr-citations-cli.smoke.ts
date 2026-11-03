import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * CLI smoke for the Core ADR-citation gate's entry point: the validator runs
 * end to end over the live tracked tree (the Core listed, read as text and
 * scanned) and reports its green line on stdout, exit 0.
 *
 * What this smoke does not prove, and where it is proven instead:
 * - what reads as a citation, and where each is placed: the `findAdrCitations`
 *   and `findCoreCitations` cells;
 * - the refusals (a listing git could not give, zero tracked Core files, a Core
 *   file that cannot be read, a Core file dropped as non-text): the `readCore`
 *   integration cells, over injected readers.
 *
 * Observed by hand, not proven by any cell: the entry's exit 1 with its report
 * on a citation, and the mapping of a refusal reason to exit 2 (the entry's
 * three-line `refuse`).
 */
const smokeDir = fileURLToPath(new URL('.', import.meta.url));
const packageDir = resolve(smokeDir, '..');
const entry = resolve(
  packageDir,
  'src/validators/core-adr-citations/validate-core-adr-citations.ts',
);
const GREEN = /^✓ no ADR citations in \d+ Core files$/mu;

function fail(message: string): never {
  process.stderr.write(`validate-core-adr-citations CLI smoke: ${message}\n`);
  process.exit(1);
}

const result = spawnSync(process.execPath, ['--import', 'tsx', entry], {
  cwd: packageDir,
  encoding: 'utf8',
});
if (result.status !== 0) {
  fail(
    `expected exit 0 on the tracked tree, got ${String(result.status)}:\n${result.stderr.slice(0, 600)}`,
  );
}
const green = GREEN.exec(result.stdout);
if (green === null) {
  fail(`expected the green line, got:\n${result.stdout.slice(0, 600)}`);
}
process.stdout.write(`validate-core-adr-citations CLI smoke OK: ${green[0].slice(2)}\n`);
