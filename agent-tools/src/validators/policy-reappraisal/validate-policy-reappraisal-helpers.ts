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
