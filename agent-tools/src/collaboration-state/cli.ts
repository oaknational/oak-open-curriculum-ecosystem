import { parseOptions, type Options } from './cli-options.js';
import { type CliRuntime } from './cli-runtime.js';
import { type CommandSpec } from './cli-spec-factory.js';
import { specs } from './cli-specs.js';
import { type CollaborationStateEnvironment } from './types.js';

interface CollaborationStateCliInput {
  readonly argv: readonly string[];
  readonly env: CollaborationStateEnvironment;
  readonly stdout?: Pick<NodeJS.WritableStream, 'write'>;
  readonly io: CliRuntime['io'];
  readonly waitForCommsChange: CliRuntime['waitForCommsChange'];
  readonly waitForCollaborationStateChange: CliRuntime['waitForCollaborationStateChange'];
  readonly processIsAlive?: NonNullable<CliRuntime['processIsAlive']>;
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
    return success(
      await dispatch(parseOptions(input.argv), input.env, {
        stdout: input.stdout,
        io: input.io,
        waitForCommsChange: input.waitForCommsChange,
        waitForCollaborationStateChange: input.waitForCollaborationStateChange,
        processIsAlive: input.processIsAlive,
      }),
    );
  } catch (error) {
    return failure(error instanceof Error ? error.message : String(error));
  }
}

async function dispatch(
  options: Options,
  env: CollaborationStateEnvironment,
  runtime: CliRuntime,
): Promise<string> {
  if (isTopLevelHelp(options)) {
    return `${usage()}\n`;
  }
  if (options.topic === 'help') {
    return `${topicUsage(options.command)}\n`;
  }

  return dispatchCommand(options, env, runtime, commandSpecForOptions(options));
}

async function dispatchCommand(
  options: Options,
  env: CollaborationStateEnvironment,
  runtime: CliRuntime,
  spec: CommandSpec,
): Promise<string> {
  if (options.values.has('help')) {
    return `${spec.help}\n`;
  }

  const resolved = bindPositional(options, spec);
  validateKnownOptions(resolved, spec);

  try {
    return await spec.handler(resolved, env, runtime);
  } catch (error) {
    throw new Error(commandError(spec, error instanceof Error ? error.message : String(error)), {
      cause: error,
    });
  }
}

/**
 * Resolve any bare positional argument against the command spec. A command
 * with `spec.positional` binds a single positional to that option key (so the
 * handler reads it via the same key as the `--<key>` flag); a command without
 * it rejects any positional, preserving stray-token rejection for the whole
 * estate. At most one positional is accepted, and a positional may not be
 * combined with the equivalent flag.
 */
function bindPositional(options: Options, spec: CommandSpec): Options {
  if (options.positionals.length === 0) {
    return options;
  }
  if (spec.positional === undefined) {
    throw new Error(commandError(spec, `unexpected argument: ${options.positionals[0]}`));
  }
  if (options.positionals.length > 1) {
    throw new Error(
      commandError(spec, `too many positional arguments (expected at most one ${spec.positional})`),
    );
  }
  if (options.values.has(spec.positional)) {
    throw new Error(
      commandError(
        spec,
        `provide ${spec.positional} as a positional argument or --${spec.positional}, not both`,
      ),
    );
  }
  const [positional] = options.positionals;
  const values = new Map(options.values);
  values.set(spec.positional, positional);
  return { ...options, values };
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
    'Usage: collaboration-state <identity|comms|claims|tui|conversation|escalation|check> <action> [options]',
    '',
    'Topics:',
    '  identity       preflight, audit',
    '  comms          append, send, render, list, show, validate, inbox, watch, assert-watcher-live, direct, reply',
    '  claims         open, heartbeat, adopt, set-handoff, close, archive-stale, list, mine, show, status, active-agents',
    '  tui            terminal collaboration dashboard',
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

/**
 * The option keys present in `options` that the command `spec` does not
 * declare, in first-seen order (value options before the repeatable
 * `file` / `area-pattern` keys); empty when every option is accepted.
 *
 * Pure: this is the dispatch-time allowlist gate that
 * {@link validateKnownOptions} enforces, exposed so the gate can be proved
 * without driving the IO-bearing command handler. A `claims open --role`
 * invocation once failed here on a spec whose option set omitted `role`
 * (2026-06-12), so the gate's per-command coverage is load-bearing.
 */
export function unknownValueOptions(options: Options, spec: CommandSpec): readonly string[] {
  const unknownValues = [...options.values.keys()].filter((key) => isUnknownValueOption(key, spec));
  const unknownRepeatable = firstUnknownRepeatableOption(options, spec);
  return unknownRepeatable === undefined ? unknownValues : [...unknownValues, unknownRepeatable];
}

function validateKnownOptions(options: Options, spec: CommandSpec): void {
  const unknown = unknownValueOptions(options, spec);
  if (unknown.length > 0) {
    throw new Error(
      commandError(
        spec,
        `unknown option for ${options.command ?? ''} ${options.topic ?? ''}: --${unknown[0]}`,
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
