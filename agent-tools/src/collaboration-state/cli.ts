import { parseOptions, type Options } from './cli-options.js';
import { specs, type CommandSpec } from './cli-specs.js';
import { type CollaborationStateEnvironment } from './types.js';

interface CollaborationStateCliInput {
  readonly argv: readonly string[];
  readonly env: CollaborationStateEnvironment;
}

interface CollaborationStateCliResult {
  readonly exitCode: 0 | 2;
  readonly stdout: string;
  readonly stderr: string;
}

/**
 * Execute the collaboration-state CLI.
 */
export async function runCollaborationStateCli(
  input: CollaborationStateCliInput,
): Promise<CollaborationStateCliResult> {
  try {
    return success(await dispatch(parseOptions(input.argv), input.env));
  } catch (error) {
    return failure(error instanceof Error ? error.message : String(error));
  }
}

async function dispatch(options: Options, env: CollaborationStateEnvironment): Promise<string> {
  if (isTopLevelHelp(options)) {
    return `${usage()}\n`;
  }
  if (options.topic === 'help') {
    return `${topicUsage(options.command)}\n`;
  }

  return dispatchCommand(options, env, commandSpecForOptions(options));
}

async function dispatchCommand(
  options: Options,
  env: CollaborationStateEnvironment,
  spec: CommandSpec,
): Promise<string> {
  if (options.values.has('help')) {
    return `${spec.help}\n`;
  }

  validateKnownOptions(options, spec);

  try {
    return await spec.handler(options, env);
  } catch (error) {
    throw new Error(commandError(spec, error instanceof Error ? error.message : String(error)), {
      cause: error,
    });
  }
}

function commandSpecForOptions(options: Options): CommandSpec {
  const spec = specs[`${options.command ?? ''}:${options.topic ?? ''}`];
  if (spec === undefined) {
    throw new Error(usage());
  }

  return spec;
}

function success(stdout: string): CollaborationStateCliResult {
  return { exitCode: 0, stdout, stderr: '' };
}

function failure(message: string): CollaborationStateCliResult {
  return { exitCode: 2, stdout: '', stderr: `${message}\n` };
}

function usage(): string {
  return [
    'Usage: collaboration-state <identity|comms|claims|conversation|escalation|check> <action> [options]',
    '',
    'Topics:',
    '  identity       preflight, audit',
    '  comms          append, send, render, inbox, direct, reply',
    '  claims         open, heartbeat, close, archive-stale, list, mine, show, status',
    '  conversation   append',
    '  escalation     open, close',
    '  check',
    '',
    'Run collaboration-state <topic> help or <topic> <action> --help for details.',
  ].join('\n');
}

function isTopLevelHelp(options: Options): boolean {
  return (
    options.command === undefined ||
    options.command === 'help' ||
    options.command === '--help' ||
    (options.topic === undefined && options.values.has('help'))
  );
}

function topicUsage(topic: string | undefined): string {
  if (topic === undefined) {
    return usage();
  }
  const topicSpecs: string[] = [];
  for (const key in specs) {
    if (key.startsWith(`${topic}:`)) {
      topicSpecs.push(`  ${specs[key]?.help ?? ''}`);
    }
  }
  if (topicSpecs.length === 0) {
    throw new Error(usage());
  }

  return [
    `Usage: collaboration-state ${topic} <action> [options]`,
    '',
    'Actions:',
    ...topicSpecs,
  ].join('\n');
}

function validateKnownOptions(options: Options, spec: CommandSpec): void {
  for (const key of options.values.keys()) {
    if (isUnknownValueOption(key, spec)) {
      throw new Error(
        commandError(
          spec,
          `unknown option for ${options.command ?? ''} ${options.topic ?? ''}: --${key}`,
        ),
      );
    }
  }

  const unknownRepeatableOption = firstUnknownRepeatableOption(options, spec);
  if (unknownRepeatableOption !== undefined) {
    throw new Error(
      commandError(
        spec,
        `unknown option for ${options.command ?? ''} ${options.topic ?? ''}: --${unknownRepeatableOption}`,
      ),
    );
  }
}

function isUnknownValueOption(key: string, spec: CommandSpec): boolean {
  return key !== 'help' && !spec.options.has(key);
}

function firstUnknownRepeatableOption(options: Options, spec: CommandSpec): string | undefined {
  if (options.files.length > 0 && spec.allowsFiles !== true && !spec.options.has('file')) {
    return 'file';
  }
  if (options.areaPatterns.length > 0 && !spec.options.has('area-pattern')) {
    return 'area-pattern';
  }

  return undefined;
}

function commandError(spec: CommandSpec, message: string): string {
  return `${spec.help}\n\nError: ${message}`;
}
