import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/** ADR-176 §3 fixes this text; a change to it is meant to break the smoke. */
const ADVISORY_BANNER = '[ADVISORY ONLY — NOT A COMMIT GATE]';

/**
 * The advisory script `commit-queue commit` runs by name, as a fixture stub
 * for a scratch repository. The stub fails on purpose, so a smoke can prove
 * that a failing advisory never gates the commit (PDR-053 / ADR-176
 * advisory polarity), and that its output is replayed to the command's own
 * stderr rather than to the process's.
 */
const ADVISORY_SCRIPT = 'agent-tools:check-commit-skill-advisories';
const ADVISORY_STUB = 'advisory-stub.mjs';
const ADVISORY_STUB_EXIT = 3;

/**
 * The stub writes stdout, then stderr, then stdout again, as the real
 * orchestrator writes both streams. Node writes to a file synchronously, so
 * the order in the capture is fixed, and a replay that drops one stream,
 * sends it elsewhere or reorders the two shows up as a missing or
 * misplaced line.
 */
const ADVISORY_STUB_LINES = [
  { stream: 'stdout', text: 'fixture advisory: first line, on stdout' },
  { stream: 'stderr', text: 'fixture advisory: deliberate failure, on stderr' },
  { stream: 'stdout', text: 'fixture advisory: last line, on stdout' },
] as const;

/**
 * Write the stub's `package.json` and script into `dir`.
 *
 * The stub is a file because pnpm appends the workflow's `-F <file>`
 * arguments, which `node -e` would read as its own options.
 *
 * @returns the repository-relative paths to commit with the fixture's seed.
 */
export async function writeAdvisoryStub(dir: string): Promise<readonly string[]> {
  const scripts = { [ADVISORY_SCRIPT]: `node ${ADVISORY_STUB}` };
  await writeFile(join(dir, 'package.json'), `${JSON.stringify({ private: true, scripts })}\n`);
  const writes = ADVISORY_STUB_LINES.map(
    ({ stream, text }) => `process.${stream}.write(${JSON.stringify(`${text}\n`)});\n`,
  );
  await writeFile(
    join(dir, ADVISORY_STUB),
    `${writes.join('')}process.exit(${String(ADVISORY_STUB_EXIT)});\n`,
  );
  return ['package.json', ADVISORY_STUB];
}

/**
 * Assert the command's captured stderr reads in the run's order: the
 * advisory banner, the stub's three lines, the inner commit's transcript
 * (marked by its subject), then the notice naming the stub's exit code.
 */
export function assertAdvisoryReplayed(stderr: string, commitSubject: string): void {
  const expectedInOrder = [
    ADVISORY_BANNER,
    ...ADVISORY_STUB_LINES.map(({ text }) => text),
    commitSubject,
    `advisory orchestrator exit ${String(ADVISORY_STUB_EXIT)}`,
  ];
  let from = 0;
  for (const expected of expectedInOrder) {
    const at = stderr.indexOf(expected, from);
    assert.ok(at >= 0, `expected "${expected}" after offset ${String(from)} in stderr:\n${stderr}`);
    from = at + expected.length;
  }
}
