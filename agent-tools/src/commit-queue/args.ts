import { join } from 'node:path';

import {
  isCommitQueuePhase,
  type CommitQueueCliOptions,
  type CommitQueuePhase,
  type MutableCommitQueueCliOptions,
} from './types.js';

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

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (!token.startsWith('--')) {
      throw new Error(`unexpected positional argument: ${token}`);
    }
    index = parseOptionToken({ tokens, index, options });
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
    '  record-staged --intent-id <uuid>',
    '  verify-staged --intent-id <uuid> --commit-subject <subject>',
    '  complete --intent-id <uuid>',
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
  return typeof value === 'string' ? value : new Date().toISOString();
}

function parseOptionToken(input: {
  readonly tokens: readonly string[];
  readonly index: number;
  readonly options: MutableCommitQueueCliOptions;
}): number {
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

  return input.index + 1;
}
