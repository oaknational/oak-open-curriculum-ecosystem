import { join } from 'node:path';

import {
  isCommitQueuePhase,
  isCommitQueueEntryStatus,
  type CommitQueueCliOptions,
  type CommitQueueEntryStatus,
  type CommitQueuePhase,
  type MutableCommitQueueCliOptions,
} from './types.js';
import { requireIsoDateTime } from './time.js';

const DEFAULT_REGISTRY_PATH = '.agent/state/collaboration/active-claims.json';

/**
 * Parse command-line arguments for the commit-queue CLI.
 */
export function parseCommitQueueArgs(argv: readonly string[]): {
  readonly command: string | undefined;
  readonly options: CommitQueueCliOptions;
} {
  const effectiveArgv = argv[0] === '--' ? argv.slice(1) : argv;
  const [command, ...tokens] = effectiveArgv;
  const options: MutableCommitQueueCliOptions = { file: [] };

  for (let index = 0; index < tokens.length; ) {
    const token = tokens[index];
    if (!token.startsWith('--')) {
      throw new Error(`unexpected positional argument: ${token}`);
    }
    if (token === '--help' || token === '-h') {
      options.help = 'true';
      index += 1;
      continue;
    }
    parseOptionToken({ tokens, index, options });
    index += 2;
  }

  return { command, options };
}

/**
 * Help text printed when the commit-queue CLI receives an unknown command.
 */
export function usage(): string {
  return [
    'Usage: pnpm agent-tools:commit-queue -- <command> [options]',
    '',
    'Commands:',
    '  enqueue --claim-id <uuid> --agent-name <name> --platform <platform>',
    '          --model <model> --session-id-prefix <prefix>',
    '          --commit-subject <subject> --file <path> [--file <path>...]',
    '  phase --intent-id <uuid> --phase <queued|staging|pre_commit|abandoned>',
    '  guard --agent-name <name> --platform <platform> --model <model>',
    '        --session-id-prefix <prefix> --file <path> [--file <path>...]',
    '  record-staged --intent-id <uuid>',
    '  verify-staged --intent-id <uuid> --commit-subject <subject>',
    '  complete --intent-id <uuid>',
    '  status [--registry <path>] [--now <iso>]',
    '  list [--registry <path>] [--now <iso>] [--prefix <intent-prefix>]',
    '       [--phase <queued|staging|pre_commit|abandoned>]',
    '       [--agent-name <agent-name-prefix>] [--queue-status <active|expired|abandoned>]',
    '  show --intent-id <uuid> [--registry <path>] [--now <iso>]',
  ].join('\n');
}

export function requireOption(options: CommitQueueCliOptions, key: string): string {
  const value = options[key];
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`missing required --${key}`);
  }

  return value;
}

export function requirePhase(options: CommitQueueCliOptions): CommitQueuePhase {
  const phase = requireOption(options, 'phase');
  if (!isCommitQueuePhase(phase)) {
    throw new Error(`invalid phase: ${phase}`);
  }
  return phase;
}

export function optionalPhase(options: CommitQueueCliOptions): CommitQueuePhase | undefined {
  const phase = optionString(options, 'phase');
  if (phase === undefined) {
    return undefined;
  }
  if (!isCommitQueuePhase(phase)) {
    throw new Error(`invalid phase: ${phase}`);
  }
  return phase;
}

export function optionalQueueStatus(
  options: CommitQueueCliOptions,
): CommitQueueEntryStatus | undefined {
  const queueStatus = optionString(options, 'queue-status');
  if (queueStatus === undefined) {
    return undefined;
  }
  if (!isCommitQueueEntryStatus(queueStatus)) {
    throw new Error(`invalid queue-status: ${queueStatus}`);
  }
  return queueStatus;
}

export function optionString(options: CommitQueueCliOptions, key: string): string | undefined {
  const value = options[key];
  return typeof value === 'string' ? value : undefined;
}

export function resolveRegistryPath(repoRoot: string, options: CommitQueueCliOptions): string {
  const registry = options.registry;
  return join(repoRoot, typeof registry === 'string' ? registry : DEFAULT_REGISTRY_PATH);
}

export function nowIso(options: CommitQueueCliOptions): string {
  const value = options.now;
  return typeof value === 'string' ? requireIsoDateTime(value, '--now') : new Date().toISOString();
}

function parseOptionToken(input: {
  readonly tokens: readonly string[];
  readonly index: number;
  readonly options: MutableCommitQueueCliOptions;
}): void {
  const token = input.tokens[input.index] ?? '';
  const key = token.slice(2);
  const value = input.tokens[input.index + 1];
  if (value == null || value.startsWith('--')) {
    throw new Error(`missing value for --${key}`);
  }

  if (key === 'file') {
    input.options.file.push(value);
  } else {
    input.options[key] = value;
  }
}
