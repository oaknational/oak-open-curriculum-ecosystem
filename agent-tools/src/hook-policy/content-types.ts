import { z } from 'zod';

import type { ScopedContentBlockGroup } from './types.js';

/**
 * Canonical content change evaluated by the platform-independent write policy.
 *
 * Hook adapters normalise their schema-validated host payloads into this
 * internal contract. A whole-file write sets `priorFilePath` so the composition
 * root can read the current file; an edit or patch carries the relevant prior
 * content directly.
 */
export interface ContentChange {
  readonly newContent: string;
  readonly priorContent: string;
  readonly filePath?: string;
  readonly priorFilePath?: string;
}

/**
 * Structured deny payload GitHub Copilot CLI expects from `preToolUse`.
 */
export const CopilotPreToolUseDenyResponseSchema = z
  .object({
    permissionDecision: z.literal('deny'),
    permissionDecisionReason: z.string(),
  })
  .strict()
  .readonly();

/**
 * Copilot CLI denial derived from {@link CopilotPreToolUseDenyResponseSchema}.
 */
export type CopilotPreToolUseDenyResponse = z.infer<typeof CopilotPreToolUseDenyResponseSchema>;

/**
 * Discriminated input for the content guard's deny-message builder. The two
 * variants produce deliberately different framings:
 * - `owner-marker` — the path-agnostic owner-approval marker, which only the
 *   project owner may author; the message states that permission fact;
 * - `concept` — a path-scoped doctrine block group; the message names the
 *   concept and carries the citation plus the positive reappraisal direction,
 *   so it frames a concept to reappraise rather than a word to rephrase.
 *
 * The discriminant makes the branch total and type-checked: no string-sniffing
 * and no `unknown` are needed to decide which framing applies.
 *
 * Intentionally NOT schema-derived: this is an internal builder argument
 * composed in-process from already-validated policy data, not a value parsed
 * from a trust boundary, so it has no runtime-validation surface to flow from.
 */
export type ContentDenyInput =
  | { readonly kind: 'owner-marker'; readonly pattern: string }
  | {
      readonly kind: 'concept';
      readonly pattern: string;
      readonly concept: string;
      readonly citation: string;
      readonly reappraisal?: string;
    };

/** Injectable seams for the PreToolUse content guard (testing + composition). */
export interface RunPreToolUseContentGuardOptions {
  readonly stdin?: AsyncIterable<string | Buffer>;
  readonly stdout?: { write(text: string): void };
  readonly stderr?: { write(text: string): void };
  readonly policyUrl?: URL;
  readonly blockedPatterns?: readonly string[];
  readonly scopedBlocks?: readonly ScopedContentBlockGroup[];
  readonly readPriorContent?: (filePath: string) => string | null;
}
