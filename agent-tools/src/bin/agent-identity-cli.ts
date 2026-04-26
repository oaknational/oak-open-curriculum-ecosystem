import {
  deriveIdentity,
  type DeriveIdentityOptions,
  type IdentityResult,
} from '../core/agent-identity/index.js';
import {
  parseAgentIdentityArgs,
  type AgentIdentityFormat,
  type SeedResult,
} from './agent-identity-cli-parser.js';

export type { AgentIdentityFormat } from './agent-identity-cli-parser.js';

/**
 * Environment values consumed by the agent-identity CLI.
 */
export interface AgentIdentityCliEnvironment {
  /** Claude Code session id, when exposed by the harness. */
  readonly CLAUDE_SESSION_ID?: string;
  /** Cross-platform explicit agent seed override. */
  readonly OAK_AGENT_SEED?: string;
  /** Operator-provided display-name override. */
  readonly OAK_AGENT_IDENTITY_OVERRIDE?: string;
}

/**
 * Input for pure CLI execution planning.
 */
export interface AgentIdentityCliInput {
  /** Command-line arguments excluding `node` and the script path. */
  readonly argv: readonly string[];
  /** Injected environment values. */
  readonly env: AgentIdentityCliEnvironment;
}

/**
 * Rendered CLI result.
 */
export interface AgentIdentityCliResult {
  /** Process exit code the bin should use. */
  readonly exitCode: 0 | 2;
  /** Complete stdout text. */
  readonly stdout: string;
  /** Complete stderr text. */
  readonly stderr: string;
}

/**
 * Help text printed by `agent-identity --help`.
 */
export const HELP_TEXT = `Usage: agent-identity [--seed <seed>] [--format <kebab|display|json>] [--help]

  --seed <seed>       Stable seed. If omitted, uses $CLAUDE_SESSION_ID, then $OAK_AGENT_SEED.
  --format <fmt>      Output format. kebab (default) | display | json.
  --help              Print help and exit 0.

Override: $OAK_AGENT_IDENTITY_OVERRIDE bypasses wordlist derivation.`;

/**
 * Execute the CLI as a pure function.
 *
 * @param input - Injected argv and environment values.
 * @returns Rendered stdout/stderr and exit code.
 */
export function runAgentIdentityCli(input: AgentIdentityCliInput): AgentIdentityCliResult {
  const parsed = parseAgentIdentityArgs(input.argv);
  if (parsed.kind === 'error') {
    return errorResult(parsed.message);
  }
  if (parsed.value.helpRequested) {
    return successResult(`${HELP_TEXT}\n`);
  }

  const seed = resolveSeed(parsed.value.seed, input.env);
  if (seed.kind === 'error') {
    return errorResult(seed.message);
  }

  try {
    const override = nonEmptyEnvironmentValue(input.env.OAK_AGENT_IDENTITY_OVERRIDE);

    return successResult(
      renderIdentityResult(
        deriveIdentity(seed.value, deriveOptions(override)),
        parsed.value.format,
      ),
    );
  } catch (error) {
    return errorResult(error instanceof Error ? error.message : String(error));
  }
}

function deriveOptions(override: string | undefined): DeriveIdentityOptions {
  if (override === undefined) {
    return {};
  }

  return {
    override,
  };
}

function resolveSeed(seed: string | undefined, env: AgentIdentityCliEnvironment): SeedResult {
  const resolvedSeed =
    nonEmptyEnvironmentValue(seed) ??
    nonEmptyEnvironmentValue(env.CLAUDE_SESSION_ID) ??
    nonEmptyEnvironmentValue(env.OAK_AGENT_SEED);

  if (resolvedSeed === undefined) {
    return {
      kind: 'error',
      message: 'missing seed; pass --seed or set CLAUDE_SESSION_ID or OAK_AGENT_SEED',
    };
  }

  return {
    kind: 'ok',
    value: resolvedSeed,
  };
}

function renderIdentityResult(result: IdentityResult, format: AgentIdentityFormat): string {
  if (format === 'display') {
    return `${result.displayName}\n`;
  }
  if (format === 'json') {
    return `${JSON.stringify(result, null, 2)}\n`;
  }
  return `${result.slug}\n`;
}

function nonEmptyEnvironmentValue(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function successResult(stdout: string): AgentIdentityCliResult {
  return {
    exitCode: 0,
    stdout,
    stderr: '',
  };
}

function errorResult(message: string): AgentIdentityCliResult {
  return {
    exitCode: 2,
    stdout: '',
    stderr: `Error: ${message}\n`,
  };
}
