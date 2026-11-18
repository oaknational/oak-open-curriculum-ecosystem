import { unwrapOrThrow } from '@oaknational/result';

import { nowIso, optionString, resolveRegistryPath, usage } from './args.js';
import { runCommitCommand } from './commit-command.js';
import { validateCommandOptions } from './options.js';
import { isCommitQueueReadCommand, runCommitQueueReadCommand } from './read-commands.js';
import { readRegistry } from './registry.js';
import { type CommitQueueCliInput, type CommitQueueCliOptions } from './types.js';
import {
  readRegistryForCli,
  runCompleteCommand,
  runEnqueueCommand,
  runPhaseCommand,
  runRecordStagedCommand,
  runVerifyStagedCommand,
} from './write-commands.js';

/**
 * Run a commit-queue CLI command against the current repository.
 */
export async function runCommitQueueCli(input: CommitQueueCliInput): Promise<number> {
  if (isHelpCommand(input.command, input.options)) {
    writeStdout(input, `${usage()}\n`);
    return 0;
  }

  validateCommandOptions(input.command, input.options);
  const registryPath = resolveRegistryPath(input.repoRoot, input.options);
  const now = nowIso(input.options);

  const writeResult = await dispatchWriteCommand({ input, registryPath, now });
  if (writeResult !== undefined) {
    return writeResult;
  }

  if (isCommitQueueReadCommand(input.command)) {
    return runCommitQueueReadCommand({
      command: input.command,
      // The CLI dispatch is the sanctioned exception boundary: the topic
      // wrapper converts the thrown message into exit 2 + stderr.
      registry: unwrapOrThrow(await readRegistryForCli(input, registryPath, now)),
      options: input.options,
      now,
      stdout: input.stdout,
    });
  }

  throw new Error(usage());
}

async function dispatchWriteCommand(args: {
  readonly input: CommitQueueCliInput;
  readonly registryPath: string;
  readonly now: string;
}): Promise<number | undefined> {
  const { input, registryPath, now } = args;
  if (input.command === 'enqueue') {
    return runEnqueueCommand({ registryPath, options: input.options, now, input });
  }
  if (input.command === 'phase') {
    return runPhaseCommand({ registryPath, options: input.options, now });
  }
  if (input.command === 'record-staged') {
    return runRecordStagedCommand({ registryPath, options: input.options, now, input });
  }
  if (input.command === 'verify-staged') {
    return runVerifyStagedCommand({
      registry: unwrapOrThrow(await readRegistry(registryPath, { nowIso: now })),
      options: input.options,
      now,
      gitRoot: input.resolveGitRoot(),
    });
  }
  if (input.command === 'complete') {
    return runCompleteCommand({ registryPath, options: input.options, now });
  }
  if (input.command === 'commit') {
    return runCommitCommand({ registryPath, options: input.options, input });
  }
  return undefined;
}

function isHelpCommand(command: string | undefined, options: CommitQueueCliOptions): boolean {
  return (
    command === undefined ||
    command === 'help' ||
    command === '--help' ||
    command === '-h' ||
    optionString(options, 'help') === 'true'
  );
}

function writeStdout(input: CommitQueueCliInput, chunk: string): void {
  (input.stdout ?? process.stdout).write(chunk);
}
