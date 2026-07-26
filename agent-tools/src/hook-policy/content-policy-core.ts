import { findAddedBlockedContent, findAddedScopedBlock } from './matchers.js';
import type { ContentChange, ContentDenyInput } from './content-types.js';
import type { ScopedContentBlockGroup } from './types.js';

/**
 * Platform-independent content-policy evaluation.
 *
 * Vendor adapters normalise their hook payloads into {@link ContentChange}
 * values before calling this module. The core neither parses vendor envelopes
 * nor renders vendor responses.
 *
 * @packageDocumentation
 */

/** Canonical decision returned by content-policy evaluation. */
export type ContentPolicyDecision =
  | { readonly kind: 'allow' }
  | { readonly kind: 'deny'; readonly deny: ContentDenyInput };

/**
 * Evaluate canonical content changes against one policy snapshot.
 *
 * Flat owner-marker patterns run before path-scoped doctrine blocks, preserving
 * the existing first-match semantics across every supported vendor adapter.
 */
export function evaluateContentPolicy(
  changes: readonly ContentChange[],
  blockedPatterns: readonly string[],
  scopedBlocks: readonly ScopedContentBlockGroup[],
): ContentPolicyDecision {
  for (const change of changes) {
    const blockedPattern = findAddedBlockedContent(
      change.newContent,
      change.priorContent,
      blockedPatterns,
    );
    if (blockedPattern !== null) {
      return {
        kind: 'deny',
        deny: { kind: 'owner-marker', pattern: blockedPattern },
      };
    }
  }

  for (const change of changes) {
    const matched = findAddedScopedBlock(
      change.newContent,
      change.priorContent,
      change.filePath,
      scopedBlocks,
    );
    if (matched !== null) {
      return {
        kind: 'deny',
        deny: {
          kind: 'concept',
          pattern: matched.matchedText,
          concept: matched.group.concept,
          citation: matched.group.citation,
          reappraisal: matched.group.reappraisal,
        },
      };
    }
  }

  return { kind: 'allow' };
}
