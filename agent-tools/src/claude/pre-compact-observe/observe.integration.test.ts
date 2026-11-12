import assert from 'node:assert/strict';

import { describe, expect, it } from 'vitest';

import { FAKE_OWNER_UID, type FakeEntry } from '../../core/test-helpers/in-memory-fs-state.js';
import {
  inMemoryFileSystem,
  type InMemoryFileSystem,
} from '../../core/test-helpers/in-memory-owner-only-append-fs.js';
import { failOpenAnswer, probeAnswer } from './answers.js';
import { buildPreCompactObservation, type PreCompactRawMeasurements } from './observation.js';
import { observePreCompact, type PreCompactObserveInput } from './observe.js';
import type { StdinRead } from './payload.js';
import type { SiblingEntry } from './siblings.js';

/**
 * The PreCompact observer's orchestration, proven against the in-memory file
 * system from `core/test-helpers/`: each test reads the answer and the
 * world's resulting entries, never the calls the fake received (ADR-078).
 * The fake keys its entries by POSIX path on every platform. The no-uid case
 * passes measurements that throw, so taking one would end the call in a throw
 * rather than the refusal.
 */

const PROJECT = '/work/project';
const LOG_DIRECTORY = `${PROJECT}/.claude/logs/pre-compact-observe`;
const OBSERVATIONS = `${LOG_DIRECTORY}/observations.jsonl`;
const HOOK_ERRORS = `${PROJECT}/.claude/logs/hook-errors.log`;
const THEIRS = '/work/elsewhere/theirs.log';
const THEIRS_TOO = '/work/elsewhere/theirs-too.log';

const TRANSCRIPT = '/work/transcripts/session-1.jsonl';
const TIME = '2026-09-25T10:11:12.345Z';
const LISTING: readonly SiblingEntry[] = [{ name: 'session-1.jsonl', kind: 'file', size: 2048 }];

/**
 * What the Node bindings measure, by path: a file's size, and a directory's
 * entries; `undefined` for a path they cannot measure. Only the transcript
 * and its directory can be measured here. The transcript's size is distinct
 * from every sibling's, so the record cannot confuse the two.
 */
const TRANSCRIPT_SIZES: ReadonlyMap<string, number> = new Map([[TRANSCRIPT, 3072]]);
const DIRECTORY_LISTINGS: ReadonlyMap<string, readonly SiblingEntry[]> = new Map([
  ['/work/transcripts', LISTING],
]);

const INPUT: PreCompactObserveInput = {
  time: TIME,
  uuid: '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d',
  stdin: {
    kind: 'read',
    text: JSON.stringify({ session_id: 'session-1', transcript_path: TRANSCRIPT }),
  },
  environment: { CLAUDE_PROJECT_DIR: PROJECT, CLAUDE_CODE_SESSION_ID: 'session-1' },
  cwd: PROJECT,
  argv: ['node', 'claude-pre-compact-observe-hook.ts'],
  measureTranscriptBytes: (path) => TRANSCRIPT_SIZES.get(path),
  listDirectory: (directory) => DIRECTORY_LISTINGS.get(directory),
};

/** What the observer should measure from {@link INPUT}. */
const MEASURED: PreCompactRawMeasurements = {
  time: TIME,
  uuid: INPUT.uuid,
  stdin: INPUT.stdin,
  environment: INPUT.environment,
  cwd: INPUT.cwd,
  argv: INPUT.argv,
  transcriptBytes: 3072,
  siblingListing: LISTING,
};

/** The log line for the observation built from these measurements. */
function recordLine(measured: PreCompactRawMeasurements): string {
  return `${JSON.stringify(buildPreCompactObservation(measured))}\n`;
}

/** The measurements for a stdin that gives no transcript path the observer measures. */
function measuredWithoutTranscript(stdin: StdinRead): PreCompactRawMeasurements {
  return { ...MEASURED, stdin, transcriptBytes: undefined, siblingListing: undefined };
}

/** The text the observation log holds, which must be a file. */
function observationLogText(world: InMemoryFileSystem): string {
  const entry = world.entries.get(OBSERVATIONS);
  assert(entry?.kind === 'file', 'the observation log is not a file');
  return entry.bytes.toString('utf8');
}

function file(mode: number, text: string): FakeEntry {
  return { kind: 'file', mode, uid: FAKE_OWNER_UID, bytes: Buffer.from(text, 'utf8') };
}

function directory(mode: number): FakeEntry {
  return { kind: 'directory', mode, uid: FAKE_OWNER_UID };
}

function symlinkTo(target: string): FakeEntry {
  return { kind: 'symlink', target };
}

/** A world where the hook-error wrapper has already written its log. */
const WRAPPER_LOGGED = { [HOOK_ERRORS]: file(0o644, 'a wrapper entry\n') };

describe('observePreCompact: recording the observation', () => {
  it('in a fresh project, writes one line at 0o600 in a directory made at 0o700, and answers with its marker', () => {
    const world = inMemoryFileSystem();

    const answer = observePreCompact(INPUT, world.fs);

    expect(answer).toBe(probeAnswer(buildPreCompactObservation(MEASURED).marker));
    expect(world.entries.get(OBSERVATIONS)).toEqual(file(0o600, recordLine(MEASURED)));
    expect(world.entries.get(LOG_DIRECTORY)).toEqual(directory(0o700));
    expect(world.entries.has(HOOK_ERRORS)).toBe(false);
  });

  it('appends to an existing 0o644 log, keeping its bytes and retightening it, and leaves its 0o755 directory as it was', () => {
    const world = inMemoryFileSystem({ [OBSERVATIONS]: file(0o644, 'earlier\n') });

    observePreCompact(INPUT, world.fs);

    expect(world.entries.get(OBSERVATIONS)).toEqual(
      file(0o600, `earlier\n${recordLine(MEASURED)}`),
    );
    expect(world.entries.get(LOG_DIRECTORY)).toEqual(directory(0o755));
  });

  it.each([
    { label: 'a relative', transcriptPath: 'transcripts/session-1.jsonl' },
    { label: 'an empty', transcriptPath: '' },
  ])('measures nothing for $label transcript path, and writes one line', ({ transcriptPath }) => {
    const world = inMemoryFileSystem();
    const stdin: StdinRead = {
      kind: 'read',
      text: JSON.stringify({ transcript_path: transcriptPath }),
    };
    // These fakes measure any path, so only the observer's refusal leaves the
    // transcript unmeasured.
    const measuresAnything = { measureTranscriptBytes: () => 4096, listDirectory: () => LISTING };

    observePreCompact({ ...INPUT, ...measuresAnything, stdin }, world.fs);

    expect(world.entries.get(OBSERVATIONS)).toEqual(
      file(0o600, recordLine(measuredWithoutTranscript(stdin))),
    );
  });

  it('keeps the raw text of a payload it cannot parse', () => {
    const world = inMemoryFileSystem();
    const stdin: StdinRead = { kind: 'read', text: '{"session_id":' };

    observePreCompact({ ...INPUT, stdin }, world.fs);

    const record: unknown = JSON.parse(observationLogText(world));
    expect(record).toHaveProperty('payload.status', 'unparseable-json');
    expect(record).toHaveProperty('stdin', { bytes: 14, raw: '{"session_id":' });
    expect(world.entries.get(OBSERVATIONS)).toEqual(
      file(0o600, recordLine(measuredWithoutTranscript(stdin))),
    );
  });

  it('records a stdin it could not read as unreadable, with the read error and no byte count', () => {
    const world = inMemoryFileSystem();
    const stdin: StdinRead = { kind: 'unreadable', reason: 'EISDIR' };

    observePreCompact({ ...INPUT, stdin }, world.fs);

    const record: unknown = JSON.parse(observationLogText(world));
    expect(record).toHaveProperty('payload.status', 'stdin-unreadable');
    expect(record).toHaveProperty('stdin', { readError: 'EISDIR' });
    expect(world.entries.get(OBSERVATIONS)).toEqual(
      file(0o600, recordLine(measuredWithoutTranscript(stdin))),
    );
  });
});

describe('observePreCompact: without an absolute project directory', () => {
  it.each([
    { label: 'unset', environment: {}, reason: 'CLAUDE_PROJECT_DIR is unset' },
    {
      label: 'empty',
      environment: { CLAUDE_PROJECT_DIR: '' },
      reason: 'CLAUDE_PROJECT_DIR is not an absolute path',
    },
    {
      label: 'relative',
      environment: { CLAUDE_PROJECT_DIR: 'work/project' },
      reason: 'CLAUDE_PROJECT_DIR is not an absolute path',
    },
  ])('answers fail-open and writes nothing when it is $label', ({ environment, reason }) => {
    const world = inMemoryFileSystem(WRAPPER_LOGGED);

    const answer = observePreCompact({ ...INPUT, environment }, world.fs);

    expect(answer).toBe(failOpenAnswer(reason));
    expect(world.entries).toEqual(inMemoryFileSystem(WRAPPER_LOGGED).entries);
  });
});

describe('observePreCompact: when the observation log cannot be written', () => {
  it('names the refused step and code, leaves the symlink target as it was, and appends the refusal after the wrapper entries, at 0o600', () => {
    const world = inMemoryFileSystem({
      ...WRAPPER_LOGGED,
      [OBSERVATIONS]: symlinkTo(THEIRS),
      [THEIRS]: file(0o644, 'theirs\n'),
    });

    const answer = observePreCompact(INPUT, world.fs);

    expect(answer).toBe(failOpenAnswer('observation log append failed at open: ELOOP'));
    expect(world.entries.get(THEIRS)).toEqual(file(0o644, 'theirs\n'));
    expect(world.entries.get(HOOK_ERRORS)).toEqual(
      file(
        0o600,
        `a wrapper entry\n[${TIME}] pre-compact-observe fail-open\n  step: open\n  code: ELOOP\n\n`,
      ),
    );
  });

  it('answers with both failures when hook-errors.log is a symlink too', () => {
    const world = inMemoryFileSystem({
      [OBSERVATIONS]: symlinkTo(THEIRS),
      [THEIRS]: file(0o644, 'theirs\n'),
      [HOOK_ERRORS]: symlinkTo(THEIRS_TOO),
      [THEIRS_TOO]: file(0o644, 'theirs too\n'),
    });

    const answer = observePreCompact(INPUT, world.fs);

    expect(answer).toBe(
      failOpenAnswer(
        'observation log append failed at open: ELOOP; ' +
          'hook-errors log append failed at open: ELOOP',
      ),
    );
    expect(world.entries.get(THEIRS)).toEqual(file(0o644, 'theirs\n'));
    expect(world.entries.get(THEIRS_TOO)).toEqual(file(0o644, 'theirs too\n'));
  });

  it('on a platform without a uid, refuses before measuring, names the refusal once, and changes nothing', () => {
    const world = inMemoryFileSystem(WRAPPER_LOGGED);
    // On Windows a UNC transcript path measured here would open an SMB
    // connection. Measurements that throw prove none is taken: a measurement
    // would end the call in a throw instead of the refusal.
    const measuringThrows = {
      measureTranscriptBytes: (): number => {
        throw new Error('measured on a platform without a uid');
      },
      listDirectory: (): readonly SiblingEntry[] => {
        throw new Error('listed on a platform without a uid');
      },
    };

    const answer = observePreCompact(
      { ...INPUT, ...measuringThrows },
      { ...world.fs, uid: undefined },
    );

    expect(answer).toBe(failOpenAnswer('observation log append failed at uid: NO_POSIX_OWNERSHIP'));
    expect(world.entries).toEqual(inMemoryFileSystem(WRAPPER_LOGGED).entries);
  });
});
