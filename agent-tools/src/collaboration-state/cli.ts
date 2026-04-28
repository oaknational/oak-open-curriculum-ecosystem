import { archiveClaims, closeClaim, heartbeatClaim, openClaim } from './cli-claim-commands.js';
import { appendComms, renderComms } from './cli-comms-commands.js';
import { resolveIdentity } from './cli-identity.js';
import { auditIdentity } from './cli-identity-audit.js';
import { parseOptions, type Options } from './cli-options.js';
import { appendJsonEntry, checkState, writeJsonBody } from './cli-json-commands.js';
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

type CliHandler = (
  options: Options,
  env: CollaborationStateEnvironment,
) => Promise<string> | string;

const handlers: Readonly<Record<string, CliHandler>> = {
  'identity:preflight': (options, env) =>
    `${JSON.stringify(resolveIdentity(options, env), null, 2)}\n`,
  'identity:audit': (options) => auditIdentity(options),
  'comms:append': appendComms,
  'comms:render': (options) => renderComms(options),
  'claims:open': openClaim,
  'claims:heartbeat': (options) => heartbeatClaim(options),
  'claims:close': closeClaim,
  'claims:archive-stale': archiveClaims,
  'conversation:append': (options) => appendJsonEntry(options),
  'escalation:open': (options) => writeJsonBody(options),
  'escalation:close': (options) => writeJsonBody(options),
  'check:': (options) => checkState(options),
};

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
  const handler = handlers[`${options.command ?? ''}:${options.topic ?? ''}`];
  if (handler === undefined) {
    throw new Error(usage());
  }

  return handler(options, env);
}

function success(stdout: string): CollaborationStateCliResult {
  return { exitCode: 0, stdout, stderr: '' };
}

function failure(message: string): CollaborationStateCliResult {
  return { exitCode: 2, stdout: '', stderr: `${message}\n` };
}

function usage(): string {
  return 'Usage: collaboration-state <identity|comms|claims|conversation|escalation|check> <action> [options]';
}
