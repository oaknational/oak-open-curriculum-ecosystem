import { z } from 'zod';

/** Claude PreToolUse event name for deny responses. */
export const PRE_TOOL_USE_EVENT_NAME = 'PreToolUse';

/**
 * A path-scoped doctrine block *group* in the canonical hook policy. One
 * group gathers every surface pattern that signals the same underlying
 * concept, so the citation and the reappraisal direction are authored once
 * per concept rather than once per pattern.
 *
 * The deny payload surfaces three things so a firing teaches the agent what
 * to do, not only that a word is forbidden:
 * - `citation` — the doctrinal anchor (the rule, principle, ADR, or PDR that
 *   names the pathogen);
 * - `reappraisal` — the positive direction the firing signals (step back and
 *   re-assess the concept), so the agent reappraises rather than rewording to
 *   route around the block;
 * - `concept` — the name of the pattern family, so the message frames a
 *   concept to reappraise, not a word to rephrase.
 *
 * `kind` and the `excludes_*` options are group-level: every pattern in a
 * group shares them.
 */
export interface ScopedContentBlockGroup {
  readonly concept: string;
  readonly patterns: readonly string[];
  readonly kind?: 'literal' | 'regex';
  readonly include_paths: readonly string[];
  readonly exclude_paths?: readonly string[];
  readonly excludes_inline_code?: boolean;
  readonly excludes_lines_with?: readonly string[];
  readonly citation: string;
  /**
   * The positive reappraisal direction surfaced when a pattern in this group
   * fires. Optional at the load-time trust boundary so a missing value never
   * throws and fails the guard closed (which would brick the worktree); the
   * `validate-policy-reappraisal` repo validator enforces presence at
   * commit-time, and the deny builder defaults a generic reappraisal if it is
   * ever absent.
   */
  readonly reappraisal?: string;
}

/** Resolved content-change shape extracted from a Claude Edit/Write payload. */
export interface ContentChange {
  readonly newContent: string;
  readonly priorContent: string;
  readonly filePath?: string;
  readonly priorFilePath?: string;
}

/** Structured deny payload Claude expects for the PreToolUse hook. */
export interface PreToolUseDenyResponse {
  readonly hookSpecificOutput: {
    readonly hookEventName: string;
    readonly permissionDecision: string;
    readonly permissionDecisionReason: string;
  };
}

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

/**
 * Zod schema for `PreToolUseDenyResponse`. Provides schema-driven runtime
 * validation (and type narrowing without assertions) for test surfaces
 * that capture the guard's stdout and need to assert against the payload
 * shape. Production code paths build the payload via
 * `buildPreToolUseDenyResponse` and do not parse it back.
 */
export const PreToolUseDenyResponseSchema = z.object({
  hookSpecificOutput: z.object({
    hookEventName: z.string(),
    permissionDecision: z.string(),
    permissionDecisionReason: z.string(),
  }),
});

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
 * A normalised blocked Bash-command pattern: a token-sequence pattern plus an
 * optional doctrinal citation surfaced in the deny payload.
 */
export interface BlockedPatternEntry {
  readonly pattern: string;
  readonly citation?: string;
}

/**
 * A raw blocked-pattern policy entry. May be a bare pattern string (legacy) or
 * an object carrying a required `pattern` and optional `citation`. Normalised
 * to {@link BlockedPatternEntry} at match time.
 */
export type RawBlockedPattern = string | BlockedPatternEntry;

/**
 * Zod schema for a raw blocked-pattern policy entry, used at the
 * `.agent/hooks/policy.json` trust boundary. Validates the bare-string or
 * `{ pattern, citation? }` shape without transforming it, so the parsed array
 * preserves the policy file's original entry forms.
 */
export const RawBlockedPatternSchema = z.union([
  z.string(),
  z.object({ pattern: z.string(), citation: z.string().optional() }),
]);

/** Injectable seams for the PreToolUse Bash blocked-pattern guard. */
export interface RunPreToolUseBlockedPatternGuardOptions {
  readonly stdin?: AsyncIterable<string | Buffer>;
  readonly stdout?: { write(text: string): void };
  readonly stderr?: { write(text: string): void };
  readonly policyUrl?: URL;
  readonly blockedPatterns?: readonly RawBlockedPattern[];
}

/**
 * Zod schema for `ScopedContentBlockGroup`. Used at the policy-load trust
 * boundary to parse `.agent/hooks/policy.json` entries into typed, validated
 * groups. `reappraisal` is optional here so a missing value never throws at
 * load time (which would fail the guard closed and brick the worktree);
 * presence is enforced at commit-time by the `validate-policy-reappraisal`
 * repo validator. The `.superRefine` verifies that every pattern in a
 * `kind: 'regex'` group is syntactically valid RegExp source.
 */
export const ScopedContentBlockGroupSchema = z
  .object({
    concept: z.string(),
    patterns: z.array(z.string()).min(1),
    kind: z.enum(['literal', 'regex']).optional(),
    include_paths: z.array(z.string()).min(1),
    exclude_paths: z.array(z.string()).optional(),
    excludes_inline_code: z.boolean().optional(),
    excludes_lines_with: z.array(z.string()).optional(),
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
  });
