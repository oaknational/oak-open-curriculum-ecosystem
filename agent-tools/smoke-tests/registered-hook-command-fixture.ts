/**
 * Shared fixtures for the smokes that run a hook command as the harness does:
 * the command `.claude/settings.json` registers, the throwaway project it runs
 * in, the harness-shaped run, and the negative control that proves the run
 * hands the command text unchanged to a shell that splits the project path.
 */
import assert from 'node:assert/strict';
import {
  spawnSync,
  type SpawnSyncOptionsWithStringEncoding,
  type SpawnSyncReturns,
} from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { typeSafeEntries } from '@oaknational/type-helpers';
import { z } from 'zod';

import { trustedShell, trustedShellPath } from './trusted-shell-directories.js';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));

/** The throwaway project's scratch `bin/`: `node` and `bash` symlinks and any case scripts. */
const SCRATCH_BIN = 'bin';

/**
 * The first `tool` on `searchPath`, the one the harness would resolve.
 *
 * @throws When no directory on the path holds it: the hook smokes need it.
 */
function findOnPath(tool: string, searchPath: string): string {
  const found = searchPath
    .split(delimiter)
    .map((directory) => join(directory, tool))
    .find((candidate) => existsSync(candidate));
  if (found === undefined) {
    throw new Error(`${tool} is not on PATH, and the hook smokes need it`);
  }
  return found;
}

/** Mechanics, not an assertion: long enough never to cut a healthy run short. */
const RUN_TIMEOUT_MS = 60_000;

/** The shell's status for a command it cannot find, as the split project path produces. */
const COMMAND_NOT_FOUND = 127;

/** The `hooks` table of `.claude/settings.json`; its other keys are dropped. */
const settingsSchema = z.object({ hooks: z.record(z.string(), z.unknown()) });

/** One event's registrations, each a matcher group of command hooks. */
const eventGroupsSchema = z.array(
  z.object({
    matcher: z.string().optional(),
    hooks: z.array(z.object({ type: z.literal('command'), command: z.string() })),
  }),
);

/**
 * The one command `.claude/settings.json` registers for the event and matcher.
 *
 * @param event - The hook event, such as `PreCompact` or `UserPromptSubmit`.
 * @param matcher - The matcher group's `matcher`, such as `Read`; when it is
 *   omitted, every group registered for the event counts.
 * @returns The command text; the smoke fails when none or several are registered.
 */
export function registeredHookCommand(event: string, matcher?: string): string {
  const text = readFileSync(join(repoRoot, '.claude', 'settings.json'), 'utf8');
  const parsed: unknown = JSON.parse(text);
  const groups = eventGroupsSchema.parse(settingsSchema.parse(parsed).hooks[event] ?? []);
  const commands = groups
    .filter((group) => matcher === undefined || group.matcher === matcher)
    .flatMap((group) => group.hooks.map((hook) => hook.command));
  if (commands.length !== 1) {
    const selection = matcher === undefined ? event : `${event} ${matcher}`;
    assert.fail(`expected exactly one ${selection} command, found ${commands.length}`);
  }
  return commands[0];
}

/**
 * Run the work in a fresh throwaway project, then remove it.
 *
 * @remarks
 * The project's name holds a space, so an unquoted path to it splits. Its
 * real `.claude/` holds one symlink, `hooks`, to the repository's
 * `.claude/hooks`; `agent-tools` links to the repository's `agent-tools`; and
 * `bin/` holds a `node` symlink to the running Node, a `bash` symlink to the
 * first `bash` on the ambient `PATH` (the one the harness would resolve; the
 * hooks' bash 5.2 floor rules out the older bash a trusted directory can hold,
 * such as macOS's `/bin/bash`), and the case's own scripts. It is removed
 * with `fs.rm`, which unlinks each symlink and never
 * follows it. Never walk this tree by hand: following the links would delete
 * the real workspace.
 *
 * @param run - The case, given the project's path.
 * @param scratchScripts - Executables to add to `bin/`, as name to script
 *   text, such as a stub `sonar`; none by default.
 */
export async function inThrowawayProject(
  run: (project: string) => void,
  scratchScripts: Readonly<Record<string, string>> = {},
): Promise<void> {
  const project = mkdtempSync(join(tmpdir(), 'claude-hook smoke '));
  try {
    mkdirSync(join(project, '.claude'));
    symlinkSync(join(repoRoot, '.claude', 'hooks'), join(project, '.claude', 'hooks'));
    symlinkSync(join(repoRoot, 'agent-tools'), join(project, 'agent-tools'));
    mkdirSync(join(project, SCRATCH_BIN));
    symlinkSync(process.execPath, join(project, SCRATCH_BIN, 'node'));
    symlinkSync(findOnPath('bash', process.env.PATH ?? ''), join(project, SCRATCH_BIN, 'bash'));
    for (const [name, script] of typeSafeEntries(scratchScripts)) {
      writeFileSync(join(project, SCRATCH_BIN, name), script, { mode: 0o755 });
    }
    run(project);
  } finally {
    await rm(project, { recursive: true, force: true });
  }
}

/**
 * Run the registered command through the trusted shell's `-c`, as the harness does.
 *
 * @remarks
 * The environment holds only `CLAUDE_PROJECT_DIR` and `PATH`. `PATH` is the
 * scratch `bin/`, which can supply nothing but `node`, `bash` and the case's
 * own scripts, then the trusted shell directories, so nothing beside them can
 * shadow the wrapper's `mktemp` or `sed`, no system `node` can stand in for
 * the running Node, and no older trusted `bash` can stand in for the host's.
 *
 * @param command - The registered command text.
 * @param project - The throwaway project, the run's working directory.
 * @param stdin - A string for a pipe, or a descriptor, as the child's stdin.
 * @returns The finished run.
 */
export function runRegisteredCommand(
  command: string,
  project: string,
  stdin: Pick<SpawnSyncOptionsWithStringEncoding, 'input' | 'stdio'>,
): SpawnSyncReturns<string> {
  return spawnSync(trustedShell(), ['-c', command], {
    ...stdin,
    cwd: project,
    env: {
      CLAUDE_PROJECT_DIR: project,
      PATH: [join(project, SCRATCH_BIN), trustedShellPath()].join(delimiter),
    },
    encoding: 'utf8',
    timeout: RUN_TIMEOUT_MS,
  });
}

/**
 * Prove the run reaches the registered text unchanged from a project whose path
 * holds a space: the same command with its double quotes removed must end with
 * the shell's command-not-found status, naming the project path cut at its
 * first space. A fixture that rewrote the command, or ran from a path without a
 * space, would let the unquoted command run, and every positive case would
 * pass for the wrong reason.
 *
 * @remarks
 * The command's first word must be a `${CLAUDE_PROJECT_DIR}` path, as the
 * wrapper-first form `"${CLAUDE_PROJECT_DIR}/.claude/hooks/_lib/log-hook-errors.sh" …`
 * is: then the unquoted path splits into a word the shell cannot find. A command
 * that starts with a bare program, such as `node "${CLAUDE_PROJECT_DIR}/…"`,
 * reaches that program instead and ends otherwise. The run's stdin is empty
 * and closed, so a regressed control that does start the hook cannot wait on it.
 *
 * @param command - The registered command, quoted.
 */
export async function proveUnquotedPathSplits(command: string): Promise<void> {
  await inThrowawayProject((project) => {
    const result = runRegisteredCommand(command.replaceAll('"', ''), project, {
      input: '',
      stdio: 'pipe',
    });
    assert.equal(
      result.status,
      COMMAND_NOT_FOUND,
      `the command with its quotes removed ended ${String(result.status ?? result.signal)}` +
        `${result.error === undefined ? '' : ` (${result.error.message})`}: ${result.stderr}`,
    );
    const splitAt = project.slice(0, project.indexOf(' '));
    assert.ok(
      result.stderr.includes(`${splitAt}:`),
      `the shell did not name the project path cut at its first space (${splitAt}): ${result.stderr}`,
    );
  });
}
