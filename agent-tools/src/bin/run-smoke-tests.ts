#!/usr/bin/env node
import { readdirSync } from 'node:fs';
import path from 'node:path';

import { resolveRepoRoot } from '../core/repo-root.js';
import { writeErrorLine, writeLine } from '../core/terminal-output.js';
import { spawnInheritedProcess } from '../repo-check/repo-check-runtime.js';
import { runSmokeSuite, smokeTestFiles } from '../smoke/smoke-suite.js';

/**
 * Run every smoke test in `agent-tools/smoke-tests/`, discovered from the
 * directory (`smoke/smoke-suite.ts` carries the reasoning). Each smoke runs as
 * `node --import tsx <file>`, as this bin's direct child, with the agent-tools
 * package root as its working directory, set explicitly so the run does not
 * depend on how this bin was invoked. It imports the tsx loader, never the
 * `tsx` CLI: the CLI's preflight turns a smoke's own SIGINT or SIGTERM death
 * into exit 128+n (so does `pnpm exec tsx`, which runs the CLI), while the
 * loader leaves the signal as the smoke's end. Every smoke runs even after a
 * failure, so one run reports the whole suite.
 *
 * The bin takes no arguments: `--help` prints usage and exits 0; anything
 * else is refused with usage on stderr, so a typo can never run the suite as
 * if it had been understood.
 *
 * @packageDocumentation
 */

const SMOKE_DIR = 'smoke-tests';
const USAGE =
  'Usage: node dist/src/bin/run-smoke-tests.js\n' +
  'Runs every agent-tools/smoke-tests/*.smoke.ts; takes no arguments (--help prints this).';

async function runSuite(): Promise<number> {
  // The suite is this checkout's: resolved from this file, never from
  // `CLAUDE_PROJECT_DIR`, which names the primary checkout even when the run
  // is a linked worktree's, and would gate another tree's smokes.
  const packageRoot = path.join(
    resolveRepoRoot(import.meta.url, { projectDir: undefined }),
    'agent-tools',
  );
  const smokeDir = path.join(packageRoot, SMOKE_DIR);
  const files = smokeTestFiles(readdirSync(smokeDir));

  const summary = await runSmokeSuite(files, (file) => {
    writeLine(`smoke run  ${file}`);
    return spawnInheritedProcess(process.execPath, ['--import', 'tsx', path.join(smokeDir, file)], {
      cwd: packageRoot,
    });
  });
  for (const line of summary.lines) {
    if (summary.ok) {
      writeLine(line);
    } else {
      writeErrorLine(line);
    }
  }
  return summary.ok ? 0 : 1;
}

async function main(argv: readonly string[]): Promise<number> {
  if (argv.length === 1 && (argv[0] === '--help' || argv[0] === '-h')) {
    writeLine(USAGE);
    return 0;
  }
  if (argv.length > 0) {
    writeErrorLine(`run-smoke-tests: unrecognised arguments: ${argv.join(' ')}\n${USAGE}`);
    return 1;
  }
  try {
    return await runSuite();
  } catch (error: unknown) {
    // A missing smoke directory or an unresolvable repository root: the suite
    // cannot be read, which is a failure, reported as one line, not a stack.
    writeErrorLine(
      `run-smoke-tests: the smoke suite could not be read: ${error instanceof Error ? error.message : String(error)}`,
    );
    return 1;
  }
}

process.exitCode = await main(process.argv.slice(2));
