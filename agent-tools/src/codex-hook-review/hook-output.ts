/** Fixed, content-free Claude hook output construction. @packageDocumentation */
import { type ReviewDecision } from './types.js';

/** The only two JSON shapes this hook may write to stdout. */
export interface CodexReviewHookOutput {
  readonly hookSpecificOutput?: {
    readonly hookEventName: 'PostToolBatch';
    readonly additionalContext: string;
  };
}

/** A payload change count accepted by the frozen review protocol. */
export type ReviewChangeCount = 1 | 2 | 3;

/** Format a validated review decision without source, path, or model prose. */
export function formatReviewOutput(decision: ReviewDecision): CodexReviewHookOutput {
  if (decision.verdict !== 'concern') {
    return {};
  }
  const context =
    `Codex advisory review: ${ordinal(decision.change_index)} change ` +
    `has a ${decision.kind} concern.`;
  return { hookSpecificOutput: { hookEventName: 'PostToolBatch', additionalContext: context } };
}

function ordinal(index: ReviewChangeCount): 'first' | 'second' | 'third' {
  if (index === 1) {
    return 'first';
  }
  return index === 2 ? 'second' : 'third';
}
