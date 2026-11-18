import { spawnSync } from 'node:child_process';
import { closeSync, mkdtempSync, openSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { writeErrorLine, writeLine } from '../src/core/terminal-output.js';
import { readDocument } from '../src/validators/operator-profile/operator-profile-read.js';

/**
 * Smoke for the operator-profile reader against a real fifo under the OS temp
 * dir: a document path that is a fifo is refused at once, never waited on.
 * Only a real fifo shows it. An open without `O_NONBLOCK` holds until a
 * writer comes, and the held open pins a threadpool thread, so the process
 * cannot even exit. The read races a two-second timer. If the timer wins,
 * the smoke opens the fifo for writing, which releases the held open, and
 * fails, so a regression fails the smoke instead of hanging it. POSIX only:
 * native Windows has no fifos.
 */

const LIMIT_MS = 2000;
const MKFIFO = '/usr/bin/mkfifo';

type ReadOutcome = Awaited<ReturnType<typeof readDocument>>;

/** The read's outcome, or `held` once the timer wins, the held open then released by a writer. */
async function readRacingTimer(fifo: string): Promise<ReadOutcome | 'held'> {
  const timer = new Promise<'held'>((resolve) => {
    setTimeout(() => resolve('held'), LIMIT_MS).unref();
  });
  const outcome = await Promise.race([readDocument(fifo), timer]);
  if (outcome === 'held') {
    closeSync(openSync(fifo, 'w'));
  }
  return outcome;
}

/** What went wrong, or undefined when the fifo was refused at once as not a regular file. */
function failureOf(outcome: ReadOutcome | 'held'): string | undefined {
  if (outcome === 'held') {
    return `the read of a fifo was still waiting after ${String(LIMIT_MS)} ms`;
  }
  if (outcome.ok || !outcome.error.includes('not a regular file')) {
    return `expected the fifo refused as not a regular file, got ${JSON.stringify(outcome)}`;
  }
  return undefined;
}

async function main(): Promise<number> {
  if (process.platform === 'win32') {
    writeLine('operator-profile read-fifo smoke skipped: native Windows has no fifos');
    return 0;
  }
  const base = mkdtempSync(join(tmpdir(), 'operator-profile-read-fifo-smoke-'));
  try {
    const fifo = join(base, 'index.md');
    const made = spawnSync(MKFIFO, [fifo], { encoding: 'utf8' });
    if (made.status !== 0) {
      writeErrorLine(`operator-profile read-fifo smoke: mkfifo failed: ${made.stderr}`);
      return 1;
    }
    const failure = failureOf(await readRacingTimer(fifo));
    if (failure !== undefined) {
      writeErrorLine(`operator-profile read-fifo smoke: ${failure}`);
      return 1;
    }
    writeLine(
      'operator-profile read-fifo smoke OK: a fifo at a document path was refused at once, never waited on',
    );
    return 0;
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
}

process.exitCode = await main();
