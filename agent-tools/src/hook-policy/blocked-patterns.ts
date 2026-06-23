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
 * Match a blocked pattern against a command — by token subsequence by
 * default, or by case-insensitive substring for entries with
 * `match: 'substring'`.
 *
 * Token subsequence catches reordered Git arguments such as
 * `git push origin HEAD --force` for the policy pattern `git push --force`;
 * substring mode catches shapes hidden inside one quoted token. Each entry may be a bare pattern
 * string or an object carrying a doctrinal citation; the citation is surfaced
 * in the deny payload so the agent learns *why* the pattern is forbidden, not
 * only *that* it is.
 */
export function findBlockedPattern(
  command: string,
  blockedPatterns: readonly RawBlockedPattern[],
): BlockedPatternEntry | null {
  const commandTokens = tokenizeCommand(command);
  // Substring probes are whitespace-stripped on BOTH sides so spacing cannot
  // smuggle a shape past the trip (`for (;;)` vs `for(;;)`).
  const strippedCommand = command.toLowerCase().replace(/\s+/gu, '');

  for (const blockedPattern of blockedPatterns) {
    const entry = normaliseEntry(blockedPattern);

    // Substring mode exists because token equality cannot see inside quoted
    // arguments: the 2026-06-11 founding DOS command carried its busy-loop as
    // one quoted token, sailing past a token-sequence trip for the same shape.
    if (entry.match === 'substring') {
      if (strippedCommand.includes(entry.pattern.toLowerCase().replace(/\s+/gu, ''))) {
        return entry;
      }
      continue;
    }

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
 * The default reappraisal direction surfaced when a concept-bearing entry has no
 * `reappraisal` of its own. The load-time schema leaves `reappraisal` optional
 * so a missing value never fails the guard closed; the
 * `validate-policy-reappraisal` repo validator enforces presence on object
 * entries at commit-time, so this default is a safety net, not the intended
 * path.
 */
const DEFAULT_BASH_REAPPRAISAL =
  'Step back and reappraise whether this operation is the right move before proceeding.';

/**
 * Build the deny reason for a matched Bash pattern.
 *
 * When the entry names the `concept` the command is a fingerprint of, the reason
 * TEACHES: it carries the positive `reappraisal` direction (defaulted if absent)
 * and steers the agent away from swapping in a sibling destructive command,
 * rather than only refusing. A concept-less entry (the legacy/bare form) falls
 * back to the plain matched-pattern reason, with the citation appended when
 * present.
 */
function buildBlockedPatternReason(entry: BlockedPatternEntry): string {
  if (entry.concept === undefined) {
    const baseReason = `Blocked by repo hook policy: matched dangerous pattern "${entry.pattern}".`;
    return entry.citation === undefined ? baseReason : `${baseReason} Citation: ${entry.citation}.`;
  }
  const reappraisal = entry.reappraisal ?? DEFAULT_BASH_REAPPRAISAL;
  const citation = entry.citation === undefined ? '' : ` Citation: ${entry.citation}.`;
  return (
    `Blocked by repo hook policy: "${entry.pattern}" is a ${entry.concept} operation. ` +
    `${reappraisal} The block signals a concept to reappraise, not a command to swap for a ` +
    `sibling — do not reach for an equivalent destructive command to bypass it.${citation}`
  );
}

/**
 * Build the structured deny payload Claude expects for `PreToolUse`.
 *
 * The reason teaches when the entry carries a concept (positive reappraisal
 * direction plus citation) and otherwise falls back to the plain matched-pattern
 * reason. The concept framing exists because a block that only says "no" leaves
 * the agent to reach for a sibling destructive command rather than reappraise
 * the operation (PDR-044 §Innate immunity, as amended).
 */
export function buildPreToolUseDenyResponse(entry: BlockedPatternEntry): PreToolUseDenyResponse {
  return {
    hookSpecificOutput: {
      hookEventName: PRE_TOOL_USE_EVENT_NAME,
      permissionDecision: 'deny',
      permissionDecisionReason: buildBlockedPatternReason(entry),
    },
  };
}
