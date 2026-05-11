import { optionalPhase, optionalQueueStatus, optionString, requireOption } from './args.js';
import { writeCommitQueueList, writeCommitQueueShow, writeCommitQueueStatus } from './status.js';
import { type CommitQueueCliOptions, type CommitQueueRegistry } from './types.js';

type CommitQueueReadCommand = 'list' | 'show' | 'status';

interface ReadCommandInput {
  readonly command: CommitQueueReadCommand;
  readonly registry: CommitQueueRegistry;
  readonly options: CommitQueueCliOptions;
  readonly now: string;
  readonly stdout?: {
    write(chunk: string): void;
  };
}

/**
 * Identify commit-queue commands that only inspect registry state.
 */
export function isCommitQueueReadCommand(
  command: string | undefined,
): command is CommitQueueReadCommand {
  return command === 'status' || command === 'list' || command === 'show';
}

/**
 * Run read-only commit-queue inspection commands.
 */
export function runCommitQueueReadCommand(input: ReadCommandInput): number {
  if (input.command === 'status') {
    return writeCommitQueueStatus(input.registry, input.now, input.stdout);
  }
  if (input.command === 'list') {
    return writeCommitQueueList(
      input.registry,
      input.now,
      {
        prefix: optionString(input.options, 'prefix'),
        phase: optionalPhase(input.options),
        agentName: optionString(input.options, 'agent-name'),
        queueStatus: optionalQueueStatus(input.options),
      },
      input.stdout,
    );
  }

  return writeCommitQueueShow(
    input.registry,
    input.now,
    requireOption(input.options, 'intent-id'),
    input.stdout,
  );
}
