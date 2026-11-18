import assert from 'node:assert/strict';
import type { SpawnSyncReturns } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  inThrowawayProject,
  proveUnquotedPathSplits,
  registeredHookCommand,
  runRegisteredCommand,
} from './registered-hook-command-fixture.js';

/**
 * Production-shaped smoke for the secrets-scan entries that `.claude/settings.json`
 * registers through the hook-error wrapper (`.claude/hooks/_lib/log-hook-errors.sh`):
 * the `PreToolUse` `Read` entry and the `UserPromptSubmit` entry. Each scan case
 * runs the registered command through the trusted shell's `-c`, as the harness
 * does, in a throwaway project whose name holds a space, fed a harness-shaped
 * payload, with a stub `sonar` first on `PATH`.
 *
 * Why: an unquoted `${CLAUDE_PROJECT_DIR}` path splits at the space, so the
 * shell exits 127 before the wrapper starts. The wrapper cannot log its own
 * failure to start, so nothing reaches `.claude/logs/hook-errors.log` and the
 * secrets scan silently stops running. `.agent/reference/shell-and-tooling-gotchas.md`
 * records one observed `sonar auth login` run, on the CLI's login and
 * integrate path, that rewrote these two command lines in place and dropped
 * the wrapper; this smoke fails on such a rewrite too.
 *
 * The stub exits 0 (no secret) or 51 (the code both scripts read as a secret
 * found), so each real script runs its scan path. Each scan case asserts exit
 * 0, nothing on stderr, exactly the decision the script owes on stdout (none,
 * the `Read` deny or the prompt block), and a hook-error log that exists and
 * is empty. The wrapper creates that log on every run, so its presence proves
 * the command ran through the wrapper, and its emptiness proves the wrapper
 * logged no failure. Each entry's control case runs the same command with its
 * quotes removed and asserts the shell's 127, naming the project path cut at
 * its first space, so the scan cases cannot pass for the wrong reason.
 *
 * Not proven here: the real scanner, and a harness that pastes the project
 * path into the command text before the shell runs (the trusted shell's `-c` here
 * expands the variable).
 */

/** The wrapper's failure log, under the project directory. */
const HOOK_ERROR_LOG = '.claude/logs/hook-errors.log';

/** The stub `sonar`'s exit code for a clean scan. */
const NO_SECRET = 0;

/** The exit code both secrets scripts read as a secret found. */
const SECRET_FOUND = 51;

/**
 * A stub `sonar` for the scratch `bin/`, exiting with the given scan result.
 *
 * @param exitCode - The code the stub exits with.
 * @returns The scratch `bin/` entry.
 */
function stubSonar(exitCode: number): Record<string, string> {
  return { sonar: `#!/usr/bin/env bash\nexit ${exitCode}\n` };
}

/**
 * The fields every harness payload carries.
 *
 * @param project - The throwaway project, as `cwd`.
 * @returns The shared payload fields.
 */
function commonPayloadFields(project: string): Record<string, string> {
  return {
    session_id: 'hook-wrapper-quoting-smoke',
    transcript_path: join(project, 'transcript.jsonl'),
    cwd: project,
    permission_mode: 'default',
  };
}

/**
 * A decision as a secrets script's `echo` writes it.
 *
 * @param decision - The decision, in the shape the script writes.
 * @returns Its JSON and a newline.
 */
function decisionLine<Decision>(decision: Decision): string {
  return `${JSON.stringify(decision)}\n`;
}

/**
 * The deny line `pretool-secrets.sh` prints when the scan finds a secret.
 *
 * @param filePath - The file the `Read` names.
 * @returns The decision's line.
 */
function readDenyLine(filePath: string): string {
  return decisionLine({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: `Sonar detected secrets in file: ${filePath}`,
    },
  });
}

/** The block line `prompt-secrets.sh` prints when the scan finds a secret. */
const PROMPT_BLOCK_LINE = decisionLine({
  decision: 'block',
  reason: 'Sonar detected secrets in prompt',
});

/**
 * Read the wrapper's failure log.
 *
 * @param project - The throwaway project the run used.
 * @returns The log's text; the smoke fails when there is no log.
 */
function readWrapperLog(project: string): string {
  try {
    return readFileSync(join(project, HOOK_ERROR_LOG), 'utf8');
  } catch (error) {
    return assert.fail(
      `no ${HOOK_ERROR_LOG}; the command did not run the wrapper (${String(error)})`,
    );
  }
}

/**
 * Assert what every run of a wrapped secrets-scan entry must show.
 *
 * @param result - The finished run.
 * @param project - The throwaway project the run used.
 * @param expectedStdout - The decision line the script owes, or `''` for none.
 */
function assertWrappedRun(
  result: SpawnSyncReturns<string>,
  project: string,
  expectedStdout: string,
): void {
  assert.equal(result.error, undefined, `the run failed: ${String(result.error)}`);
  assert.equal(
    result.status,
    0,
    `exit ${String(result.status)} (${String(result.signal)}): ${result.stderr}`,
  );
  assert.equal(result.stderr, '', 'expected nothing on stderr');
  assert.equal(result.stdout, expectedStdout, 'unexpected decision on stdout');
  const log = readWrapperLog(project);
  assert.equal(log, '', `the wrapper logged a failure:\n${log}`);
}

/**
 * The `PreToolUse` `Read` entry, reading a file in the project.
 *
 * @param sonarExitCode - The stub `sonar`'s scan result.
 * @param expectedStdout - The decision line owed for the file read, or `''`.
 */
async function proveReadEntry(
  sonarExitCode: number,
  expectedStdout: (filePath: string) => string,
): Promise<void> {
  const command = registeredHookCommand('PreToolUse', 'Read');
  await inThrowawayProject((project) => {
    const filePath = join(project, 'notes.txt');
    writeFileSync(filePath, 'notes\n');
    const payload = JSON.stringify({
      ...commonPayloadFields(project),
      hook_event_name: 'PreToolUse',
      tool_name: 'Read',
      tool_input: { file_path: filePath },
      tool_use_id: 'hook-wrapper-quoting-smoke-read',
    });
    const result = runRegisteredCommand(command, project, { input: payload, stdio: 'pipe' });
    assertWrappedRun(result, project, expectedStdout(filePath));
  }, stubSonar(sonarExitCode));
}

/**
 * The `UserPromptSubmit` entry, submitting a prompt.
 *
 * @param sonarExitCode - The stub `sonar`'s scan result.
 * @param expectedStdout - The decision line owed for the prompt, or `''`.
 */
async function provePromptEntry(sonarExitCode: number, expectedStdout: string): Promise<void> {
  const command = registeredHookCommand('UserPromptSubmit');
  await inThrowawayProject((project) => {
    const payload = JSON.stringify({
      ...commonPayloadFields(project),
      hook_event_name: 'UserPromptSubmit',
      prompt: 'summarise the notes',
    });
    const result = runRegisteredCommand(command, project, { input: payload, stdio: 'pipe' });
    assertWrappedRun(result, project, expectedStdout);
  }, stubSonar(sonarExitCode));
}

/** Each case's label and run; every case runs, so a red run reports them all. */
const cases: readonly (readonly [string, () => Promise<void>])[] = [
  ['PreToolUse Read, no secret', () => proveReadEntry(NO_SECRET, () => '')],
  ['PreToolUse Read, secret found', () => proveReadEntry(SECRET_FOUND, readDenyLine)],
  ['UserPromptSubmit, no secret', () => provePromptEntry(NO_SECRET, '')],
  ['UserPromptSubmit, secret found', () => provePromptEntry(SECRET_FOUND, PROMPT_BLOCK_LINE)],
  [
    'PreToolUse Read, quotes removed: the path splits',
    () => proveUnquotedPathSplits(registeredHookCommand('PreToolUse', 'Read')),
  ],
  [
    'UserPromptSubmit, quotes removed: the path splits',
    () => proveUnquotedPathSplits(registeredHookCommand('UserPromptSubmit')),
  ],
];

const failures: string[] = [];
for (const [label, prove] of cases) {
  try {
    await prove();
  } catch (error) {
    failures.push(`${label}: ${String(error)}`);
  }
}
if (failures.length > 0) {
  const summary = `${failures.length}/${cases.length} cases failed`;
  process.stderr.write(`hook-wrapper-quoting smoke: ${summary}\n${failures.join('\n')}\n`);
  process.exitCode = 1;
} else {
  const summary = `${cases.length}/${cases.length} cases passed`;
  process.stdout.write(`hook-wrapper-quoting smoke: ${summary}\n`);
}
