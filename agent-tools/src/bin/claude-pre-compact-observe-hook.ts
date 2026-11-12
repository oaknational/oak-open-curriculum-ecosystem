#!/usr/bin/env node
/**
 * Claude Code `PreCompact` observer hook: record what the harness sends at a
 * compaction, and answer without ever blocking it.
 *
 * @remarks
 * The thin impure entry. It reads stdin, binds the measurements to `node:fs`
 * (`claude/pre-compact-observe/node-io.ts`), and hands them to
 * `observePreCompact` (`claude/pre-compact-observe/observe.ts`), which
 * appends the observation and chooses the answer. It then writes that answer,
 * one JSON line, to stdout, once.
 *
 * Every path it controls answers `continue: true` and exits 0; it never exits
 * 2, the one code on which the harness blocks a compaction. A thrown Error is
 * answered fail-open with its reason. Throws are narrowed through
 * `failureAsError` (owner ruling, 2026-07-20). A non-Error narrowed at an
 * inner boundary (the stdin read, the append's file-system edge) reaches the
 * entry as a TypeError and is answered fail-open. One that reaches the
 * entry's catch un-narrowed crashes the hook with exit 1, which the wrapper
 * logs. No path exits 2. A module that cannot load, or a missing build, also
 * exits 1, before any of this runs; the harness treats exit 1 as a
 * non-blocking error (ADR-167).
 *
 * It sets `process.exitCode` and never calls `process.exit`, so a write to a
 * pipe still pending when the script ends is flushed before the process
 * exits.
 *
 * @packageDocumentation
 */

import { randomUUID } from 'node:crypto';

import { failOpenAnswer } from '../claude/pre-compact-observe/answers.js';
import { thrownReason } from '../claude/pre-compact-observe/capped-read.js';
import {
  listDirectory,
  measureTranscriptBytes,
  readCappedStdin,
} from '../claude/pre-compact-observe/node-io.js';
import { observePreCompact } from '../claude/pre-compact-observe/observe.js';
import { failureAsError } from '../core/failure-as-error.js';
import { nodeOwnerOnlyAppendFs } from '../core/owner-only-append-fs.js';
import { tolerateEpipeOnStdout } from './stdout-epipe.js';

// Computed first and written after, so the answer reaches stdout exactly once.
const answer = observeOrFailOpen();
// `process.stdout` is first touched here, after stdin has been read to its
// end. Creating that stream can set its descriptor non-blocking, and where the
// harness gives the hook one socket for stdin and stdout, fd 0 would turn
// non-blocking with it and the read would give `EAGAIN` instead of the payload.
tolerateEpipeOnStdout(process.stdout);
process.stdout.write(answer);
process.exitCode = 0;

/** Observe the compaction, or answer fail-open with the reason for any throw. */
function observeOrFailOpen(): string {
  try {
    const stdin = readCappedStdin();
    return observePreCompact(
      {
        time: new Date().toISOString(),
        uuid: randomUUID(),
        stdin,
        environment: process.env,
        cwd: process.cwd(),
        argv: process.argv,
        measureTranscriptBytes,
        listDirectory,
      },
      nodeOwnerOnlyAppendFs,
    );
  } catch (error) {
    return failOpenAnswer(thrownReason(failureAsError(error, 'pre-compact-observe hook')));
  }
}
