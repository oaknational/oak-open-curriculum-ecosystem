import { z } from 'zod';

/** Claude PreToolUse event name for deny responses. */
export const PRE_TOOL_USE_EVENT_NAME = 'PreToolUse';

/**
 * Zod schema for a path-scoped doctrine block *group* in the canonical hook
 * policy. This schema is the single source of truth for the group shape:
 * {@link ScopedContentBlockGroup} is derived from it via `z.infer`, so a field
 * can only be added in one place and the type and the runtime validator can
 * never drift.
 *
 * One group gathers every surface pattern that signals the same underlying
 * concept, so the citation and the reappraisal direction are authored once per
 * concept rather than once per pattern. The deny payload surfaces three things
 * so a firing teaches the agent what to do, not only that a word is forbidden:
 * - `citation` — the doctrinal anchor (the rule, principle, ADR, or PDR that
 *   names the pathogen);
 * - `reappraisal` — the positive direction the firing signals (step back and
 *   re-assess the concept), so the agent reappraises rather than rewording to
 *   route around the block;
 * - `concept` — the name of the pattern family, so the message frames a concept
 *   to reappraise, not a word to rephrase.
 *
 * `kind` and the `excludes_*` options are group-level: every pattern in a group
 * shares them.
 *
 * Used at the policy-load trust boundary to parse `.agent/hooks/policy.json`
 * entries into typed, validated groups. `reappraisal` is optional here so a
 * missing value never throws at load time (which would fail the guard closed
 * and brick the worktree); presence is enforced at commit-time by the
 * `validate-policy-reappraisal` repo validator, and the deny builder defaults a
 * generic reappraisal if it is ever absent. The `.superRefine` verifies that
 * every pattern in a `kind: 'regex'` group is syntactically valid RegExp
 * source. `.readonly()` (on the object and on every array field) freezes parsed
 * groups and derives the readonly contract the consumers rely on.
 */
export const ScopedContentBlockGroupSchema = z
  .object({
    concept: z.string(),
    patterns: z.array(z.string()).min(1).readonly(),
    kind: z.enum(['literal', 'regex']).optional(),
    include_paths: z.array(z.string()).min(1).readonly(),
    exclude_paths: z.array(z.string()).readonly().optional(),
    excludes_inline_code: z.boolean().optional(),
    excludes_lines_with: z.array(z.string()).readonly().optional(),
    citation: z.string(),
    reappraisal: z.string().optional(),
  })
  .superRefine((entry, ctx) => {
    if (entry.kind !== 'regex') {
      return;
    }
    for (const pattern of entry.patterns) {
      try {
        new RegExp(pattern, 'u');
      } catch {
        ctx.addIssue({
          code: 'custom',
          message: `scoped_block group '${entry.concept}' kind 'regex' has invalid pattern: ${pattern}`,
          path: ['patterns'],
        });
      }
    }
  })
  .readonly();

/**
 * A path-scoped doctrine block *group* in the canonical hook policy. Derived
 * from {@link ScopedContentBlockGroupSchema} — see that schema for the full
 * field semantics. The schema is the source of truth; this type is its
 * compile-time projection.
 */
export type ScopedContentBlockGroup = z.infer<typeof ScopedContentBlockGroupSchema>;

/** Resolved content-change shape extracted from a Claude Edit/Write payload. */
export interface ContentChange {
  readonly newContent: string;
  readonly priorContent: string;
  readonly filePath?: string;
  readonly priorFilePath?: string;
}

/**
 * Zod schema for the structured deny payload Claude expects for the PreToolUse
 * hook. Single source of truth for the payload shape:
 * {@link PreToolUseDenyResponse} is derived from it via `z.infer`. Provides
 * schema-driven runtime validation (and type narrowing without assertions) for
 * test surfaces that capture the guard's stdout and need to assert against the
 * payload shape. Production code paths build the payload via
 * `buildPreToolUseDenyResponse` and do not parse it back. `.readonly()` derives
 * the readonly contract on the outer object and the nested `hookSpecificOutput`.
 */
export const PreToolUseDenyResponseSchema = z
  .object({
    hookSpecificOutput: z
      .object({
        hookEventName: z.string(),
        permissionDecision: z.string(),
        permissionDecisionReason: z.string(),
      })
      .readonly(),
  })
  .readonly();

/**
 * Structured deny payload Claude expects for the PreToolUse hook. Derived from
 * {@link PreToolUseDenyResponseSchema}.
 */
export type PreToolUseDenyResponse = z.infer<typeof PreToolUseDenyResponseSchema>;

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

/**
 * Zod schema for the object arm of a blocked Bash-command policy entry: a
 * token-sequence `pattern` plus an optional doctrinal `citation` surfaced in
 * the deny payload. Module-internal composition helper (not part of the public
 * surface): {@link BlockedPatternEntry} is derived from it via `z.infer`, and
 * the exported {@link RawBlockedPatternSchema} union composes it with the
 * bare-string arm. `.readonly()` derives the readonly contract on the entry.
 */
const BlockedPatternEntrySchema = z
  .object({ pattern: z.string(), citation: z.string().optional() })
  .readonly();

/**
 * A normalised blocked Bash-command pattern: a token-sequence pattern plus an
 * optional doctrinal citation surfaced in the deny payload. Derived from the
 * internal `BlockedPatternEntrySchema`.
 */
export type BlockedPatternEntry = z.infer<typeof BlockedPatternEntrySchema>;

/**
 * Zod schema for a raw blocked-pattern policy entry, used at the
 * `.agent/hooks/policy.json` trust boundary. A raw entry may be a bare pattern
 * string (legacy) or an object carrying a required `pattern` and optional
 * `citation`. Validates the shape without transforming it, so the parsed array
 * preserves the policy file's original entry forms; entries are normalised to
 * {@link BlockedPatternEntry} only at match time. {@link RawBlockedPattern} is
 * derived from this schema via `z.infer`.
 */
export const RawBlockedPatternSchema = z.union([z.string(), BlockedPatternEntrySchema]);

/**
 * A raw blocked-pattern policy entry. Derived from
 * {@link RawBlockedPatternSchema}: a bare pattern string (legacy) or an object
 * carrying a required `pattern` and optional `citation`.
 */
export type RawBlockedPattern = z.infer<typeof RawBlockedPatternSchema>;

/** Injectable seams for the PreToolUse Bash blocked-pattern guard. */
export interface RunPreToolUseBlockedPatternGuardOptions {
  readonly stdin?: AsyncIterable<string | Buffer>;
  readonly stdout?: { write(text: string): void };
  readonly stderr?: { write(text: string): void };
  readonly policyUrl?: URL;
  readonly blockedPatterns?: readonly RawBlockedPattern[];
}
