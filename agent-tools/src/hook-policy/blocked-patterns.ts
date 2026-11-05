import { isJsonObject } from '../core/json.js';

import { matchesArgvPatternInSegments } from './argument-matcher.js';
import { segmentCommand, type ShellWord } from '../shell/shell-words.js';
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
function tokenizeCommand(command: string): string[] {
  return command.trim().split(/\s+/u).filter(Boolean);
}

/** Normalise a raw policy entry (bare string or object) into a typed entry. */
function normaliseEntry(entry: RawBlockedPattern): BlockedPatternEntry {
  return typeof entry === 'string' ? { pattern: entry } : entry;
}

/**
 * Compile a regex-mode pattern fail-open: an invalid pattern yields `null`
 * (no match) rather than an exception, because a throwing guard bricks the
 * worktree on a stale-dist/new-policy mismatch — the same posture as the
 * optional doctrine fields. The canonical-policy integration test enforces
 * compilability at commit-time, so this branch is a safety net, not the
 * intended path.
 */
function compileRegexPattern(pattern: string): RegExp | null {
  try {
    return new RegExp(pattern, 'iu');
  } catch {
    return null;
  }
}

/**
 * Match a blocked pattern against a command — by token subsequence by
 * default, by case-insensitive substring for entries with
 * `match: 'substring'`, by case-insensitive regex over the raw command for
 * entries with `match: 'regex'`, or by the invocation's parsed options for
 * entries with `match: 'argv'`.
 *
 * Token subsequence catches reordered Git arguments such as
 * `git push origin HEAD --force` for the policy pattern `git push --force`;
 * substring mode catches shapes hidden inside one quoted token; regex mode
 * exists for fingerprints that must anchor on a token boundary — a
 * whitespace-stripped substring for a command-plus-flag shape collides with
 * unrelated tokens (the PR #304 Bugbot instance: a needle of `rg` + `-r`
 * matching inside `xorg -restart`). Each entry may be a bare pattern
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
  const strippedCommand = command.toLowerCase().replaceAll(/\s+/gu, '');
  // Argv mode segments the command once, on first use, however many argv
  // entries the policy carries.
  let segments: readonly (readonly ShellWord[])[] | null = null;
  const segmentsOf = (): readonly (readonly ShellWord[])[] => {
    segments ??= segmentCommand(command);
    return segments;
  };

  for (const blockedPattern of blockedPatterns) {
    const entry = normaliseEntry(blockedPattern);

    if (entryMatchesCommand(entry, command, strippedCommand, commandTokens, segmentsOf)) {
      return entry;
    }
  }

  return null;
}

/** Dispatch one entry to its match strategy. */
function entryMatchesCommand(
  entry: BlockedPatternEntry,
  command: string,
  strippedCommand: string,
  commandTokens: readonly string[],
  segmentsOf: () => readonly (readonly ShellWord[])[],
): boolean {
  // Substring mode exists because token equality cannot see inside quoted
  // arguments: the 2026-06-11 founding DOS command carried its busy-loop as
  // one quoted token, sailing past a token-sequence trip for the same shape.
  if (entry.match === 'substring') {
    return strippedCommand.includes(entry.pattern.toLowerCase().replaceAll(/\s+/gu, ''));
  }

  // Regex mode probes the RAW command: whitespace is load-bearing for
  // boundary-anchored fingerprints, so no stripping here.
  if (entry.match === 'regex') {
    return compileRegexPattern(entry.pattern)?.test(command) === true;
  }

  // Argv mode reads the invocation the way the command's own parser does
  // and matches on the resolved options, so one entry names a destructive
  // MODE rather than one spelling of it (PR #100's rounds: `--h`, `-Rf`,
  // `-r --force`, the flag after the operand). A pattern the tables cannot
  // parse matches nothing (fail-open, like an invalid regex); the
  // canonical-policy integration test makes that a commit-time failure.
  if (entry.match === 'argv') {
    return matchesArgvPatternInSegments(entry.pattern, segmentsOf());
  }

  return matchesTokenSubsequence(entry.pattern, commandTokens);
}

/** Token-subsequence match: pattern tokens appear in order among command tokens. */
function matchesTokenSubsequence(pattern: string, commandTokens: readonly string[]): boolean {
  const patternTokens = tokenizeCommand(pattern);
  let patternIndex = 0;

  for (const commandToken of commandTokens) {
    if (commandToken === patternTokens[patternIndex]) {
      patternIndex += 1;
    }

    if (patternIndex === patternTokens.length) {
      return true;
    }
  }

  return false;
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
