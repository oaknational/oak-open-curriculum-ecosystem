import {
  deriveIdentity,
  type DeriveIdentityOptions,
  type IdentityResult,
} from '../core/agent-identity/index.js';
import { resolveCollaborationSeed } from '../collaboration-state/collaboration-seed.js';
import {
  gatedClaudeSeedsPresent,
  gatedSeedsSentence,
} from '../collaboration-state/platform-gate.js';
import {
  parseAgentIdentityArgs,
  type AgentIdentityFormat,
  type SeedResult,
} from './agent-identity-cli-parser.js';

export type { AgentIdentityFormat } from './agent-identity-cli-parser.js';

/**
 * Environment values consumed by the agent-identity CLI.
 *
 * @remarks
 * `PRACTICE_AGENT_SESSION_ID_*` are the Practice-namespaced surface set by
 * platform hooks (Claude `SessionStart` writes `_CLAUDE`; Cursor `sessionStart`
 * writes `_CURSOR`; Antigravity/Gemini writes `_GEMINI`; Codex writes `_CODEX`).
 * `CODEX_THREAD_ID` is the Codex harness-native variable kept as a fallback
 * for environments without a Practice Codex wrapper.
 */
export interface AgentIdentityCliEnvironment {
  /** Claude Code session id, written by the Practice Claude `SessionStart` hook. */
  readonly PRACTICE_AGENT_SESSION_ID_CLAUDE?: string;
  /** Cloud-seat platform session id (`cse_`-tagged); untagged payload is the PDR-027 seed there. */
  readonly CLAUDE_CODE_REMOTE_SESSION_ID?: string;
  /** Claude Code CLI session id, exported into every Bash tool shell; equals the SessionStart seed. */
  readonly CLAUDE_CODE_SESSION_ID?: string;
  /** Cursor composer session id, written by the Practice Cursor `sessionStart` hook. */
  readonly PRACTICE_AGENT_SESSION_ID_CURSOR?: string;
  /** Antigravity/Gemini conversation id surfaced through the Practice seed convention. */
  readonly PRACTICE_AGENT_SESSION_ID_GEMINI?: string;
  /** Codex thread id surfaced via the Practice naming convention. */
  readonly PRACTICE_AGENT_SESSION_ID_CODEX?: string;
  /** Codex harness-native thread id; fallback when no Practice var is set. */
  readonly CODEX_THREAD_ID?: string;
  /** Antigravity native per-conversation id; fallback when no Practice var is set. */
  readonly conversationId?: string;
  /** Antigravity per-tool-call metadata JSON; `conversationId` is stable. */
  readonly ANTIGRAVITY_SOURCE_METADATA?: string;
  /** Operator-provided display-name override. */
  readonly PRACTICE_AGENT_IDENTITY_OVERRIDE?: string;
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
export const HELP_TEXT = `Usage: agent-identity [--seed <seed>] [--platform <label>] [--format <kebab|display|json>] [--help]

  --seed <seed>       Stable seed. If omitted, uses (in order)
                      $PRACTICE_AGENT_SESSION_ID_CLAUDE,
                      $PRACTICE_AGENT_SESSION_ID_CURSOR,
                      $PRACTICE_AGENT_SESSION_ID_GEMINI,
                      $PRACTICE_AGENT_SESSION_ID_CODEX,
                      $CLAUDE_CODE_REMOTE_SESSION_ID (cloud seats; type tag stripped),
                      $CLAUDE_CODE_SESSION_ID (Claude Code CLI shells),
                      then platform-native stable fallbacks:
                      $CODEX_THREAD_ID (Codex) and Antigravity conversationId.
  --platform <label>  Seat platform (claude-code, cursor, codex, gemini). Required
                      unless --seed is given: the three Claude seeds
                      ($PRACTICE_AGENT_SESSION_ID_CLAUDE, $CLAUDE_CODE_REMOTE_SESSION_ID,
                      $CLAUDE_CODE_SESSION_ID) count only on a Claude platform.
  --format <fmt>      Output format. kebab (default) | display | json.
  --help              Print help and exit 0.

Override: $PRACTICE_AGENT_IDENTITY_OVERRIDE bypasses wordlist derivation.`;

/**
 * The bad-usage message when neither `--seed` nor `--platform` is given.
 */
export const MISSING_PLATFORM_MESSAGE =
  "missing --platform; without --seed the CLI must know the seat's platform (claude-code, cursor, codex or gemini), since the three Claude seeds count only on a Claude platform: pass --platform <label> or --seed <seed>";

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

  const seed = resolveSeed(parsed.value.seed, input.env, parsed.value.platform);
  if (seed.kind === 'error') {
    return errorResult(seed.message);
  }

  try {
    const override = nonEmptyEnvironmentValue(input.env.PRACTICE_AGENT_IDENTITY_OVERRIDE);

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

function resolveSeed(
  seed: string | undefined,
  env: AgentIdentityCliEnvironment,
  platform: string | undefined,
): SeedResult {
  const explicit = nonEmptyEnvironmentValue(seed);
  if (explicit !== undefined) {
    return { kind: 'ok', value: explicit };
  }
  // The platform gate: the three Claude seeds count only on a Claude platform.
  // Without --seed the CLI must be told the seat's platform; it never infers
  // one from the ambient environment, which is the leak the gate closes. The
  // precedence itself is the collaboration seed's, read once for both CLIs.
  if (platform === undefined) {
    return { kind: 'error', message: MISSING_PLATFORM_MESSAGE };
  }
  const resolved = resolveCollaborationSeed(env, platform);
  if (resolved === undefined) {
    return { kind: 'error', message: missingSeedMessage(env, platform) };
  }
  return { kind: 'ok', value: resolved.value };
}

function missingSeedMessage(env: AgentIdentityCliEnvironment, platform: string): string {
  return (
    'missing seed; pass --seed or set PRACTICE_AGENT_SESSION_ID_CLAUDE, PRACTICE_AGENT_SESSION_ID_CURSOR, PRACTICE_AGENT_SESSION_ID_GEMINI, PRACTICE_AGENT_SESSION_ID_CODEX, CODEX_THREAD_ID, or Antigravity conversationId' +
    gatedSeedsSentence(gatedClaudeSeedsPresent(env, platform), platform)
  );
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
