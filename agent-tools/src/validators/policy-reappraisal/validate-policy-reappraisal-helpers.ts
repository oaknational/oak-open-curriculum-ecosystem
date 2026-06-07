import { isJsonObject } from '../../collaboration-state/json.js';

/**
 * Detect scoped-block groups in the canonical hook policy that lack a usable
 * positive `reappraisal` direction.
 *
 * The PreToolUse content guard's load-time schema leaves `reappraisal`
 * optional so a missing value never fails the guard closed and bricks the
 * worktree (PDR-044 §Innate immunity, as amended; see
 * `agent-tools/src/hook-policy/types.ts`). Presence is instead enforced HERE,
 * at commit-time, where blocking is safe: every doctrine block must pair its
 * citation with the positive reappraisal direction the firing signals, so a
 * block teaches the agent to step back and re-assess the concept rather than
 * to reword around the wall.
 *
 * The helper is pure; the runtime that reads `.agent/hooks/policy.json` lives
 * in `validate-policy-reappraisal.ts`.
 *
 * @packageDocumentation
 */

/** Why a scoped-block group failed the reappraisal-presence check. */
type MissingReappraisalReason = 'absent' | 'empty';

/** A scoped-block group missing a usable reappraisal, with the reason. */
export interface MissingReappraisalFinding {
  /** The group's `concept`, or a positional `#index` label when it is absent. */
  readonly concept: string;
  /** `absent` when the field is undefined; `empty` when blank or non-string. */
  readonly reason: MissingReappraisalReason;
}

/**
 * Return the scoped-block groups whose `reappraisal` is absent, blank, or a
 * non-string. Shape malformation other than the reappraisal field (missing
 * `patterns`, bad `kind`, etc.) is the loader/schema's concern, not this
 * validator's, so a non-array input yields no findings.
 *
 * @param scopedBlocks - The `preToolUseContent.scoped_blocks` value from the
 *   parsed policy (unknown-typed; this is a trust boundary).
 * @returns One finding per group lacking a non-empty reappraisal, in input
 *   order. Empty when every group carries one.
 *
 * @example
 *
 * ```ts
 * findGroupsMissingReappraisal([{ concept: 'menu-framing', patterns: ['x'] }]);
 * // [{ concept: 'menu-framing', reason: 'absent' }]
 * ```
 */
export function findGroupsMissingReappraisal(scopedBlocks: unknown): MissingReappraisalFinding[] {
  const blocks: readonly unknown[] = Array.isArray(scopedBlocks) ? scopedBlocks : [];
  const findings: MissingReappraisalFinding[] = [];

  for (const [index, group] of blocks.entries()) {
    if (!isJsonObject(group)) {
      continue;
    }
    const concept = typeof group.concept === 'string' ? group.concept : `#${index}`;
    const reappraisal = group.reappraisal;

    if (reappraisal === undefined) {
      findings.push({ concept, reason: 'absent' });
    } else if (typeof reappraisal !== 'string' || reappraisal.trim() === '') {
      findings.push({ concept, reason: 'empty' });
    }
  }

  return findings;
}

/** Why a Bash `blocked_patterns` entry fails the teaching-presence check. */
type BashEntryReappraisalReason =
  | 'not-an-object'
  | 'concept-absent'
  | 'concept-empty'
  | 'reappraisal-absent'
  | 'reappraisal-empty';

/** A Bash blocked-pattern entry that cannot teach a reappraisal, with the reason. */
export interface BashEntryMissingReappraisalFinding {
  /** The entry's `pattern`, or a positional `#index` label when unavailable. */
  readonly pattern: string;
  /** Which teaching field is missing or unusable. */
  readonly reason: BashEntryReappraisalReason;
}

/**
 * The defect in a doctrine field (`concept` or `reappraisal`) on a Bash entry,
 * or `null` when the field is a usable non-empty string. Lifting the
 * absent/empty branch out of the entry loop keeps
 * {@link findBashEntriesMissingReappraisal} under the complexity cap.
 */
function fieldDefect(
  value: unknown,
  absent: BashEntryReappraisalReason,
  empty: BashEntryReappraisalReason,
): BashEntryReappraisalReason | null {
  if (value === undefined) {
    return absent;
  }
  if (typeof value !== 'string' || value.trim() === '') {
    return empty;
  }
  return null;
}

/**
 * Return the `preToolUse.blocked_patterns` entries that cannot teach a positive
 * reappraisal at deny time.
 *
 * The Bash deny builder only surfaces the reappraisal on its teaching path,
 * which fires when the entry carries a non-empty `concept` AND a non-empty
 * `reappraisal` (see `agent-tools/src/hook-policy/blocked-patterns.ts`). A
 * bare-string entry has no field to carry either, and an object missing the
 * `concept` would fall back to the plain matched-pattern reason — leaving any
 * `reappraisal` dead. The runtime schema stays permissive (bare strings parse,
 * `concept`/`reappraisal` optional) for brick-safety; presence is enforced HERE,
 * at commit-time, where blocking is safe — so every Bash block teaches the
 * agent to step back and re-assess the operation rather than reach for a sibling
 * destructive command (PDR-044 §Innate immunity, as amended).
 *
 * Shape malformation other than the teaching fields (a missing `pattern` on an
 * object, a bad citation, etc.) is the loader/schema's concern, so a non-array
 * input yields no findings and a missing `pattern` only affects the label.
 *
 * @param blockedPatterns - The `preToolUse.blocked_patterns` value from the
 *   parsed policy (unknown-typed; this is a trust boundary).
 * @returns Findings in input order; empty when every entry is a teaching object.
 *
 * @example
 *
 * ```ts
 * findBashEntriesMissingReappraisal(['git reset --hard']);
 * // [{ pattern: 'git reset --hard', reason: 'not-an-object' }]
 * ```
 */
export function findBashEntriesMissingReappraisal(
  blockedPatterns: unknown,
): BashEntryMissingReappraisalFinding[] {
  const entries: readonly unknown[] = Array.isArray(blockedPatterns) ? blockedPatterns : [];
  const findings: BashEntryMissingReappraisalFinding[] = [];

  for (const [index, entry] of entries.entries()) {
    if (!isJsonObject(entry)) {
      findings.push({
        pattern: typeof entry === 'string' ? entry : `#${index}`,
        reason: 'not-an-object',
      });
      continue;
    }

    const pattern = typeof entry.pattern === 'string' ? entry.pattern : `#${index}`;
    const conceptDefect = fieldDefect(entry.concept, 'concept-absent', 'concept-empty');
    if (conceptDefect !== null) {
      findings.push({ pattern, reason: conceptDefect });
    }
    const reappraisalDefect = fieldDefect(
      entry.reappraisal,
      'reappraisal-absent',
      'reappraisal-empty',
    );
    if (reappraisalDefect !== null) {
      findings.push({ pattern, reason: reappraisalDefect });
    }
  }

  return findings;
}
