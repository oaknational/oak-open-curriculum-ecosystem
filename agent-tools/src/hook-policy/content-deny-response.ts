import {
  PRE_TOOL_USE_EVENT_NAME,
  type ContentDenyInput,
  type PreToolUseDenyResponse,
} from './types.js';

/**
 * Deny-payload construction for the PreToolUse content guard.
 *
 * Kept separate from `check-blocked-content.ts` (the stdin/stdout/policy-load
 * orchestration) so message framing is a cohesive concern of its own. The Bash
 * guard has its own builder in `blocked-patterns.ts`; the two are deliberately
 * not unified — they have independent threat models and distinct reason strings.
 *
 * @packageDocumentation
 */

/**
 * The default reappraisal direction surfaced when a concept group has no
 * `reappraisal` of its own. The load-time schema leaves `reappraisal` optional
 * so a missing value never fails the guard closed; the
 * `validate-policy-reappraisal` repo validator enforces presence at
 * commit-time, so this default is a safety net, not the intended path.
 */
const DEFAULT_REAPPRAISAL =
  'Step back and reappraise the concept this fingerprint signals before proceeding.';

/**
 * Build the concept-frame deny reason: it names the concept the matched pattern
 * is a fingerprint of, carries the positive reappraisal direction, states that
 * the firing is information about the concept and not the wording, and ends
 * with the doctrinal citation.
 */
function buildConceptReason(input: {
  readonly pattern: string;
  readonly concept: string;
  readonly citation: string;
  readonly reappraisal?: string;
}): string {
  const reappraisal = input.reappraisal ?? DEFAULT_REAPPRAISAL;
  return (
    `Blocked by repo hook policy: "${input.pattern}" is a write-time fingerprint of ${input.concept}. ` +
    `${reappraisal} The block signals a concept to reappraise, not a word to rephrase — ` +
    `do not substitute a synonym to bypass it. Citation: ${input.citation}.`
  );
}

/**
 * Select the deny reason for the content guard by the input discriminant. An
 * exhaustive switch with a `never` guard makes adding a future `kind` a
 * compile-time error rather than a silent fall-through.
 */
function buildContentDenyReason(input: ContentDenyInput): string {
  switch (input.kind) {
    case 'owner-marker':
      return `Blocked by repo hook policy: content contains the owner-approval marker "${input.pattern}". Only the project owner may author this marker.`;
    case 'concept':
      return buildConceptReason(input);
    default: {
      const exhaustive: never = input;
      throw new Error(`Unhandled ContentDenyInput kind: ${JSON.stringify(exhaustive)}`);
    }
  }
}

/**
 * Build the structured deny payload Claude expects for `PreToolUse` content
 * blocks. The framing is selected by the discriminant so the agent receives the
 * response that matches the block: a permission fact for the owner-only marker,
 * or a concept to reappraise — with citation and positive direction — for a
 * doctrine block. The concept framing exists because a block that only says
 * "no" leaves the agent to find a synonym and route around it
 * (PDR-044 §Innate immunity, as amended).
 */
export function buildPreToolUseDenyResponse(input: ContentDenyInput): PreToolUseDenyResponse {
  return {
    hookSpecificOutput: {
      hookEventName: PRE_TOOL_USE_EVENT_NAME,
      permissionDecision: 'deny',
      permissionDecisionReason: buildContentDenyReason(input),
    },
  };
}
