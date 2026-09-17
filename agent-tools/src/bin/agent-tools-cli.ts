import { err, unwrapOrThrow } from '@oaknational/result';

import { agentIdentityCliEnvironmentFromProcessEnv } from './agent-identity-cli-environment.js';
import { runAgentIdentityCli } from './agent-identity-cli.js';
import {
  OutputBuffer,
  runBranchTouchedFilesTopic,
  runCodexExecTopic,
  runCommitQueueTopic,
  runContextCostTopic,
  runCoordinationTopic,
  runMergeBotTopic,
  runPrTopic,
  runPrWatchTopic,
  runSessionMetadataTopic,
  runSpawnTopic,
} from './agent-tools-cli-topics.js';
import type {
  AgentToolsCliInput,
  AgentToolsCliResult,
  AgentToolsEnvironment,
} from './agent-tools-cli-types.js';
import { runCollaborationStateCli } from '../collaboration-state/cli.js';
import { productionCollaborationStateRuntime } from '../collaboration-state/cli-runtime.js';

export type {
  AgentToolsCliInput,
  AgentToolsCliResult,
  AgentToolsEnvironment,
} from './agent-tools-cli-types.js';

interface ParsedAgentToolsArgs {
  readonly topic: string | undefined;
  readonly topicArgs: readonly string[];
  readonly help: boolean;
  readonly logJson: boolean;
}

/**
 * Execute the unified `agent-tools` CLI.
 *
 * @remarks
 * Topic handlers own their domain behaviour; this layer owns global parsing,
 * process-level error formatting, stdout/stderr capture, and the lifecycle
 * logging hook.
 */
export async function runAgentToolsCli(input: AgentToolsCliInput): Promise<AgentToolsCliResult> {
  const parsed = parseAgentToolsArgs(input.argv);
  const stderr = new OutputBuffer();

  try {
    if (parsed.help) {
      return completeWithLog({
        parsed,
        result: { exitCode: 0, stdout: `${usage()}\n`, stderr: '' },
        stderr,
      });
    }

    logLifecycle(stderr, parsed, 'start');
    const result = await dispatchTopic({ input, parsed });

    return completeWithLog({ parsed, result, stderr });
  } catch (error) {
    const result = {
      exitCode: 2,
      stdout: '',
      stderr: `${usage()}\n\nError: ${error instanceof Error ? error.message : String(error)}\n`,
    };
    return completeWithLog({ parsed, result, stderr });
  }
}

export function agentToolsCliEnvironmentFromProcessEnv(
  env: NodeJS.ProcessEnv,
): AgentToolsEnvironment {
  return {
    ...agentIdentityCliEnvironmentFromProcessEnv(env),
    ...(env.HOME === undefined ? {} : { HOME: env.HOME }),
    ...(env.PRACTICE_COORDINATION_HOME === undefined
      ? {}
      : { PRACTICE_COORDINATION_HOME: env.PRACTICE_COORDINATION_HOME }),
  };
}

function parseAgentToolsArgs(argv: readonly string[]): ParsedAgentToolsArgs {
  const normalizedArgv = argv[0] === '--' ? argv.slice(1) : argv;
  const globalFlags = new Set<string>();
  let topicIndex = 0;

  while (topicIndex < normalizedArgv.length && isGlobalFlag(normalizedArgv[topicIndex] ?? '')) {
    globalFlags.add(normalizedArgv[topicIndex] ?? '');
    topicIndex += 1;
  }

  const topic = normalizedArgv[topicIndex];
  return {
    topic,
    topicArgs: topic === undefined ? [] : normalizedArgv.slice(topicIndex + 1),
    help: isHelpRequest(topic, globalFlags),
    logJson: isLogJsonRequest(globalFlags),
  };
}

function isGlobalFlag(value: string): boolean {
  return value === '--help' || value === '-h' || value === '--log-json';
}

function isHelpRequest(topic: string | undefined, globalFlags: ReadonlySet<string>): boolean {
  return topic === undefined || globalFlags.has('--help') || globalFlags.has('-h');
}

function isLogJsonRequest(globalFlags: ReadonlySet<string>): boolean {
  return globalFlags.has('--log-json');
}

// Topics with the uniform `(input, args) => result` shape are dispatched by
// table lookup; `agent-identity` and `collaboration-state` need bespoke wiring
// and stay as explicit cases.
type UniformTopicHandler = (
  input: AgentToolsCliInput,
  args: readonly string[],
) => AgentToolsCliResult | Promise<AgentToolsCliResult>;

const UNIFORM_TOPIC_HANDLERS: Readonly<Record<string, UniformTopicHandler>> = {
  'commit-queue': runCommitQueueTopic,
  'branch-touched-files': runBranchTouchedFilesTopic,
  'context-cost': runContextCostTopic,
  coordination: runCoordinationTopic,
  'session-metadata': runSessionMetadataTopic,
  'codex-exec': runCodexExecTopic,
  'merge-bot': runMergeBotTopic,
  pr: runPrTopic,
  'pr-watch': runPrWatchTopic,
  spawn: runSpawnTopic,
};

async function dispatchTopic(input: {
  readonly input: AgentToolsCliInput;
  readonly parsed: ParsedAgentToolsArgs;
}): Promise<AgentToolsCliResult> {
  const { topic } = input.parsed;

  if (topic === 'agent-identity') {
    return runAgentIdentityCli({
      argv: input.parsed.topicArgs,
      env: input.input.env,
    });
  }

  if (topic === 'collaboration-state') {
    const runtime = productionCollaborationStateRuntime({
      stdout: input.input.stdout,
      cwd: input.input.cwd,
      ...(input.input.env.PRACTICE_COORDINATION_HOME === undefined
        ? {}
        : { coordinationHomeEnv: input.input.env.PRACTICE_COORDINATION_HOME }),
    });
    return runCollaborationStateCli({
      argv: input.parsed.topicArgs,
      env: input.input.env,
      stdout: runtime.stdout,
      io: runtime.io,
      waitForCommsChange: runtime.waitForCommsChange,
      waitForCollaborationStateChange: runtime.waitForCollaborationStateChange,
      processIsAlive: runtime.processIsAlive,
      watcherStalenessIo: runtime.watcherStalenessIo,
      cwd: runtime.cwd,
      resolveCoordinationHome: runtime.resolveCoordinationHome,
    });
  }

  // Look up by OWN key only: a plain-object map resolves prototype keys
  // (`constructor`, `toString`, …) to inherited functions, which would be
  // mis-dispatched as handlers instead of reaching the unknown-topic path.
  const topicKey = topic ?? '';
  const handler = Object.hasOwn(UNIFORM_TOPIC_HANDLERS, topicKey)
    ? UNIFORM_TOPIC_HANDLERS[topicKey]
    : undefined;
  if (handler !== undefined) {
    return handler(input.input, input.parsed.topicArgs);
  }

  return unwrapOrThrow<never>(err(new Error(`unknown topic: ${topicKey}`)));
}

function completeWithLog(input: {
  readonly parsed: ParsedAgentToolsArgs;
  readonly result: AgentToolsCliResult;
  readonly stderr: OutputBuffer;
}): AgentToolsCliResult {
  logLifecycle(input.stderr, input.parsed, 'complete', input.result.exitCode);

  return {
    exitCode: input.result.exitCode,
    stdout: input.result.stdout,
    stderr: `${input.stderr.text()}${input.result.stderr}`,
  };
}

function logLifecycle(
  stderr: OutputBuffer,
  parsed: ParsedAgentToolsArgs,
  event: 'start' | 'complete',
  exitCode?: number,
): void {
  if (!parsed.logJson) {
    return;
  }

  stderr.write(
    `${JSON.stringify({
      surface: 'agent-tools',
      event,
      topic: parsed.topic ?? null,
      ...(exitCode === undefined ? {} : { exit_code: exitCode }),
    })}\n`,
  );
}

function usage(): string {
  return [
    'Usage: agent-tools <topic> [action] [options]',
    '',
    'Topics:',
    '  agent-identity',
    '  collaboration-state',
    '  commit-queue',
    '  branch-touched-files',
    '  context-cost',
    '  coordination',
    '  session-metadata',
    '  codex-exec',
    '  merge-bot',
    '  pr',
    '  pr-watch',
    '  spawn',
  ].join('\n');
}
