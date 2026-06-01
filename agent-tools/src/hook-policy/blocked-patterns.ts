import { isJsonObject } from '../collaboration-state/json.js';

import {
  PRE_TOOL_USE_EVENT_NAME,
  type BlockedPatternEntry,
  type PreToolUseDenyResponse,
  type RawBlockedPattern,
} from './types.js';

/**
 * Extract the Bash command from a Claude PreToolUse payload, tolerating the
 * payload shapes different runners produce (`tool_input`, `toolInput`, a
 * flattened top level, or `parameters`).
 */
export function extractBashCommand(hookInput: unknown): string {
  if (isJsonObject(hookInput)) {
    // Precedence preserved from the original guard: nested tool_input, then the
    // camelCase variant, then a flattened top level, then a `parameters` wrapper.
    const containers = [hookInput.tool_input, hookInput.toolInput, hookInput, hookInput.parameters];
    for (const container of containers) {
      if (isJsonObject(container) && typeof container.command === 'string') {
        return container.command;
      }
    }
  }

  throw new Error('Claude PreToolUse hook input did not include a Bash command.');
}

/**
 * Split a shell command into simple whitespace-delimited tokens.
 *
 * Intentionally conservative: the blocked patterns in `policy.json` are plain
 * token sequences, so a lightweight tokenizer is sufficient.
 */
export function tokenizeCommand(command: string): string[] {
  return command.trim().split(/\s+/u).filter(Boolean);
}

/** Normalise a raw policy entry (bare string or object) into a typed entry. */
function normaliseEntry(entry: RawBlockedPattern): BlockedPatternEntry {
  return typeof entry === 'string' ? { pattern: entry } : entry;
}

/**
 * Match a blocked pattern against a command by token subsequence.
 *
 * This catches reordered Git arguments such as `git push origin HEAD --force`
 * for the policy pattern `git push --force`. Each entry may be a bare pattern
 * string or an object carrying a doctrinal citation; the citation is surfaced
 * in the deny payload so the agent learns *why* the pattern is forbidden, not
 * only *that* it is.
 */
export function findBlockedPattern(
  command: string,
  blockedPatterns: readonly RawBlockedPattern[],
): BlockedPatternEntry | null {
  const commandTokens = tokenizeCommand(command);

  for (const blockedPattern of blockedPatterns) {
    const entry = normaliseEntry(blockedPattern);
    const patternTokens = tokenizeCommand(entry.pattern);
    let patternIndex = 0;

    for (const commandToken of commandTokens) {
      if (commandToken === patternTokens[patternIndex]) {
        patternIndex += 1;
      }

      if (patternIndex === patternTokens.length) {
        return entry;
      }
    }
  }

  return null;
}

/**
 * Build the structured deny payload Claude expects for `PreToolUse`.
 *
 * When the entry carries a citation, it is appended to the reason so the
 * doctrinal anchor travels to the agent at the moment of denial.
 */
export function buildPreToolUseDenyResponse(entry: BlockedPatternEntry): PreToolUseDenyResponse {
  const baseReason = `Blocked by repo hook policy: matched dangerous pattern "${entry.pattern}".`;
  const reason =
    entry.citation === undefined ? baseReason : `${baseReason} Citation: ${entry.citation}.`;
  return {
    hookSpecificOutput: {
      hookEventName: PRE_TOOL_USE_EVENT_NAME,
      permissionDecision: 'deny',
      permissionDecisionReason: reason,
    },
  };
}
