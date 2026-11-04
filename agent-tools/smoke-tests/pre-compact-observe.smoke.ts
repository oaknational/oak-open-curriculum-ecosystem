import assert from 'node:assert/strict';
import {
  chmodSync,
  closeSync,
  lstatSync,
  mkdirSync,
  openSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';

import {
  assertObservedRun,
  compactPayload,
  OBSERVATION_DIRECTORY,
  OBSERVATION_LOG,
  type LoggedObservation,
} from './pre-compact-observe-fixture.js';
import {
  inThrowawayProject,
  proveUnquotedPathSplits,
  registeredHookCommand,
  runRegisteredCommand,
} from './registered-hook-command-fixture.js';

/**
 * Production-shaped smoke for the `PreCompact` observer hook. Each case runs
 * the command `.claude/settings.json` registers for `PreCompact` through
 * the trusted shell's `-c`, as the harness does, in a throwaway project whose name holds
 * a space. The first case removes the command's quotes and proves the path
 * splits there and exits 127; every other case runs through the
 * committed wrapper, its exec bit and the built `dist`
 * (`registered-hook-command-fixture.ts` builds the project and the run;
 * `pre-compact-observe-fixture.ts` holds the payload and the assertions).
 *
 * It asserts only what a real descriptor decides: the exit code, the one
 * stdout line, the one log line, its mode and shared marker, and what only
 * plain Node measures through the Node bindings (`statSync`, `readdirSync`,
 * `lstatSync` and a `readSync` loop, each with its catch). Vitest and tsx both
 * map a `.js` specifier onto its `.ts` file, so plain Node is the only check
 * of the entry's module graph. Feature behaviour belongs to the unit and
 * integration tests beside the observer's source.
 *
 * Not reliably proven here: `spawnSync` hands the child a socket that already
 * holds a small payload, so a `process.stdin` reference in the entry's import
 * graph is not reliably caught (case C's large payload, still being written
 * while the child reads, may catch it on some runs). A harness that writes the
 * payload late would expose it as `EAGAIN`. There is no timing test for it.
 * Nor is the entry's order proven: stdin and stdout are separate sockets here,
 * so touching `process.stdout` before the read would pass.
 */

/**
 * The listed entry with the given name.
 *
 * @param observation - The asserted fields of a log line.
 * @param name - The entry's name beside the transcript.
 * @returns The entry, or `undefined` when none has that name.
 */
function siblingNamed(
  observation: LoggedObservation,
  name: string,
): LoggedObservation['siblings']['entries'][number] | undefined {
  return observation.siblings.entries.find((entry) => entry.name === name);
}

const TRANSCRIPT_NAME = 'session.jsonl';
const LINK_NAME = 'session-link.jsonl';

/** About 200 KB of custom instructions: several 64 KiB reads, far under the 1 MiB cap. */
const LONG_INSTRUCTIONS = 'keep the observer evidence '.repeat(7_500);

/**
 * Case A: the payload a bare `/compact` sends, over a world-readable empty
 * log that already exists, with a real transcript and a symlink beside it.
 */
async function proveBareCompactPayload(command: string): Promise<void> {
  await inThrowawayProject((project) => {
    mkdirSync(join(project, OBSERVATION_DIRECTORY), { recursive: true });
    writeFileSync(join(project, OBSERVATION_LOG), '');
    chmodSync(join(project, OBSERVATION_LOG), 0o644);
    const transcriptPath = join(project, 'transcripts', TRANSCRIPT_NAME);
    mkdirSync(dirname(transcriptPath));
    writeFileSync(transcriptPath, `${JSON.stringify({ type: 'user', text: 'smoke' })}\n`);
    symlinkSync(TRANSCRIPT_NAME, join(dirname(transcriptPath), LINK_NAME));
    const transcriptBytes = statSync(transcriptPath).size;
    const payload = compactPayload(project, transcriptPath, null);
    const observation = assertObservedRun(
      runRegisteredCommand(command, project, { input: payload, stdio: 'pipe' }),
      project,
    );
    assert.equal(observation.payload.status, 'ok');
    assert.equal(observation.transcriptBytes, transcriptBytes);
    assert.deepEqual(siblingNamed(observation, LINK_NAME), { name: LINK_NAME, kind: 'symlink' });
    assert.deepEqual(siblingNamed(observation, TRANSCRIPT_NAME), {
      name: TRANSCRIPT_NAME,
      kind: 'file',
      size: transcriptBytes,
    });
  });
}

/**
 * Case B: a directory opened as fd 0, in a project with no `.claude/logs`. The
 * wrapper's `mkdir -p` runs under the umask, so only the observer's directory
 * is held to 0o700.
 */
async function proveUnreadableStdin(command: string): Promise<void> {
  await inThrowawayProject((project) => {
    const directoryFd = openSync(project, 'r');
    try {
      const observation = assertObservedRun(
        runRegisteredCommand(command, project, { stdio: [directoryFd, 'pipe', 'pipe'] }),
        project,
      );
      assert.equal(observation.payload.status, 'stdin-unreadable');
      assert.equal(observation.stdin.readError, 'EISDIR');
      const observationDirectory = lstatSync(join(project, OBSERVATION_DIRECTORY));
      assert.ok(observationDirectory.isDirectory(), 'no observation directory');
      assert.equal(
        observationDirectory.mode & 0o777,
        0o700,
        'the observation directory is not at 0o700',
      );
    } finally {
      closeSync(directoryFd);
    }
  });
}

/**
 * Case C: a payload longer than one read, whose transcript path names a
 * directory. Only a read loop keeps it parseable, and a directory is not a
 * transcript, so no transcript size is recorded.
 */
async function proveLongPayloadOverDirectoryTranscript(command: string): Promise<void> {
  await inThrowawayProject((project) => {
    const transcriptPath = join(project, 'transcript-directory');
    mkdirSync(transcriptPath);
    const payload = compactPayload(project, transcriptPath, LONG_INSTRUCTIONS);
    const observation = assertObservedRun(
      runRegisteredCommand(command, project, { input: payload, stdio: 'pipe' }),
      project,
    );
    assert.equal(observation.payload.status, 'ok');
    assert.equal(observation.transcriptBytes, undefined);
  });
}

/**
 * Case D: a transcript path under a directory that does not exist. Both
 * measurements fail inside their bindings, so the observation is still
 * recorded, with no transcript size and no sibling count.
 */
async function proveTranscriptUnderMissingDirectory(command: string): Promise<void> {
  await inThrowawayProject((project) => {
    const payload = compactPayload(project, join(project, 'absent', TRANSCRIPT_NAME), null);
    const observation = assertObservedRun(
      runRegisteredCommand(command, project, { input: payload, stdio: 'pipe' }),
      project,
    );
    assert.equal(observation.payload.status, 'ok');
    assert.equal(observation.transcriptBytes, undefined);
    assert.equal(observation.siblings.count, undefined);
  });
}

const preCompactCommand = registeredHookCommand('PreCompact');
await proveUnquotedPathSplits(preCompactCommand);
await proveBareCompactPayload(preCompactCommand);
await proveUnreadableStdin(preCompactCommand);
await proveLongPayloadOverDirectoryTranscript(preCompactCommand);
await proveTranscriptUnderMissingDirectory(preCompactCommand);
process.stdout.write('pre-compact-observe smoke: 5/5 cases passed\n');
