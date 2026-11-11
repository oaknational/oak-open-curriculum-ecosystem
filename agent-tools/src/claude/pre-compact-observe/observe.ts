/**
 * The PreCompact observer's orchestration: measure, build the observation,
 * append it, and choose the answer.
 *
 * @remarks
 * The entry reads stdin and binds the measurements to `node:fs`; this module
 * does the rest, and takes the file system as an `OwnerOnlyAppendFs`, so a
 * test proves the same composition production runs.
 *
 * The observation is appended, through `appendOwnerOnly`, to
 * `.claude/logs/pre-compact-observe/observations.jsonl` under
 * `CLAUDE_PROJECT_DIR`. Every path answers `continue: true`:
 *
 * - the observation appended: the probe answer, carrying its marker;
 * - `CLAUDE_PROJECT_DIR` unset or not absolute: the fail-open answer, and
 *   nothing written, because there is nowhere to write it;
 * - a platform without a uid, where the append would refuse: the fail-open
 *   answer naming that refusal once, with nothing measured and nothing
 *   written;
 * - the append failed: a three-line block naming the step and code is
 *   appended to `.claude/logs/hook-errors.log`, and the fail-open answer names
 *   the failure, and the hook-errors failure too when that append fails.
 *
 * The hook-errors block goes through `appendOwnerOnly` as well, so it
 * retightens that log, which the hook-error wrapper also writes, to 0o600,
 * keeping the wrapper's entries. That is harmless: the wrapper appends to it
 * as the same user, which 0o600 allows.
 *
 * Every failure it anticipates is a Result, and a measurement that cannot be
 * taken is `undefined`, so it does not throw. A throw is a defect: the
 * entry's catch narrows it through `failureAsError` and answers fail-open
 * with `thrownReason` (`capped-read.ts`). That path writes no hook-errors
 * block, so the reason reaches only the transcript. A thrown value that is
 * not an Error crashes the entry instead (exit 1, non-blocking, logged by
 * the hook-error wrapper).
 *
 * @packageDocumentation
 */

import { dirname, isAbsolute, posix } from 'node:path';

import {
  appendOwnerOnly,
  invokingUid,
  type OwnerOnlyFailure,
} from '../../core/owner-only-append.js';
import type { OwnerOnlyAppendFs } from '../../core/owner-only-append-fs.js';
import { failOpenAnswer, probeAnswer } from './answers.js';
import { buildPreCompactObservation, type PreCompactRawMeasurements } from './observation.js';
import { readPreCompactPayload, type StdinRead } from './payload.js';
import type { SiblingEntry } from './siblings.js';

/** The observation log, under the project directory. */
const OBSERVATION_LOG = '.claude/logs/pre-compact-observe/observations.jsonl';

/** The hook-error log the wrapper also writes, under the project directory (ADR-167). */
const HOOK_ERROR_LOG = '.claude/logs/hook-errors.log';

/** The raw measurements the entry takes itself: all but the transcript's. */
type EntryMeasurements = Omit<PreCompactRawMeasurements, 'transcriptBytes' | 'siblingListing'>;

/**
 * What the entry hands the observer for one compaction: every raw
 * measurement except the transcript's, which the observer takes itself
 * through the two functions, because only it knows whether the payload
 * names an absolute transcript path.
 *
 * @remarks
 * `time` is the one time the observation and any hook-errors block carry.
 * Each measurement function must never throw: it returns `undefined` when it
 * cannot measure, and the observation records that measurement as absent.
 */
export interface PreCompactObserveInput extends EntryMeasurements {
  /**
   * The size in bytes of the file at an absolute path. Never throws:
   * `undefined` when the file cannot be measured.
   */
  readonly measureTranscriptBytes: (path: string) => number | undefined;
  /**
   * Every entry in a directory. Never throws: `undefined` when the directory
   * cannot be listed.
   */
  readonly listDirectory: (directory: string) => readonly SiblingEntry[] | undefined;
}

/**
 * Observe one compaction: record it, and answer the harness.
 *
 * @remarks
 * Only an absolute `transcript_path` is measured; an empty or relative one
 * gives no size and no listing. Its directory is taken with the platform's
 * `dirname`, because the harness names a host path. Log paths are joined as
 * POSIX paths, which every platform's file calls accept. See the module
 * remarks for every outcome.
 *
 * @param input - The stdin read, the process's raw measurements, and the two
 *   transcript measurements.
 * @param fs - The file-system surface; pass `nodeOwnerOnlyAppendFs`
 *   (`core/owner-only-append-fs.ts`) outside tests.
 * @returns The stdout line: the probe answer when the observation was
 *   appended, else the fail-open answer with the reason.
 */
export function observePreCompact(input: PreCompactObserveInput, fs: OwnerOnlyAppendFs): string {
  const { measureTranscriptBytes, listDirectory, ...measured } = input;
  const projectDirectory = measured.environment.CLAUDE_PROJECT_DIR;
  if (projectDirectory === undefined) {
    return failOpenAnswer('CLAUDE_PROJECT_DIR is unset');
  }
  if (!isAbsolute(projectDirectory)) {
    return failOpenAnswer('CLAUDE_PROJECT_DIR is not an absolute path');
  }
  const owner = invokingUid(fs);
  if (!owner.ok) {
    return failOpenAnswer(describeFailure('observation log', owner.error));
  }
  const observation = buildPreCompactObservation({
    ...measured,
    ...measureTranscript(measured.stdin, measureTranscriptBytes, listDirectory),
  });
  const appended = appendOwnerOnly(
    posix.join(projectDirectory, OBSERVATION_LOG),
    `${JSON.stringify(observation)}\n`,
    fs,
  );
  if (appended.ok) {
    return probeAnswer(observation.marker);
  }
  return failOpenAnswer(reportAppendFailure(projectDirectory, measured.time, appended.error, fs));
}

/**
 * The transcript's size and the listing of its directory, when the payload
 * gives an absolute transcript path; neither otherwise.
 */
function measureTranscript(
  stdin: StdinRead,
  measureTranscriptBytes: PreCompactObserveInput['measureTranscriptBytes'],
  listDirectory: PreCompactObserveInput['listDirectory'],
): Pick<PreCompactRawMeasurements, 'transcriptBytes' | 'siblingListing'> {
  const transcriptPath = readPreCompactPayload(stdin).fields.transcript_path;
  if (transcriptPath === undefined || !isAbsolute(transcriptPath)) {
    return { transcriptBytes: undefined, siblingListing: undefined };
  }
  return {
    transcriptBytes: measureTranscriptBytes(transcriptPath),
    siblingListing: listDirectory(dirname(transcriptPath)),
  };
}

/**
 * Append the failure's block to the hook-error log, and describe the
 * failure; and the hook-error log's own failure too, when that append fails.
 */
function reportAppendFailure(
  projectDirectory: string,
  time: string,
  failure: OwnerOnlyFailure,
  fs: OwnerOnlyAppendFs,
): string {
  const observationFailure = describeFailure('observation log', failure);
  const logged = appendOwnerOnly(
    posix.join(projectDirectory, HOOK_ERROR_LOG),
    `[${time}] pre-compact-observe fail-open\n  step: ${failure.step}\n  code: ${failure.code}\n\n`,
    fs,
  );
  if (logged.ok) {
    return observationFailure;
  }
  return `${observationFailure}; ${describeFailure('hook-errors log', logged.error)}`;
}

/** One failed append, as the answer names it: the log, the step and the code. */
function describeFailure(log: string, failure: OwnerOnlyFailure): string {
  return `${log} append failed at ${failure.step}: ${failure.code}`;
}
