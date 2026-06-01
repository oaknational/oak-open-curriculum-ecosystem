import { z } from 'zod';

/** Claude PreToolUse event name for deny responses. */
export const PRE_TOOL_USE_EVENT_NAME = 'PreToolUse';

/**
 * A path-scoped doctrine block in the canonical hook policy. Carries a
 * citation that surfaces in the deny payload so the agent learns *why*
 * the pattern is forbidden, not only *that* it is.
 */
export interface ScopedContentBlock {
  readonly pattern: string;
  readonly kind?: 'literal' | 'regex';
  readonly include_paths: readonly string[];
  readonly exclude_paths?: readonly string[];
  readonly excludes_inline_code?: boolean;
  readonly excludes_lines_with?: readonly string[];
  readonly citation: string;
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
  readonly scopedBlocks?: readonly ScopedContentBlock[];
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
 * Zod schema for `ScopedContentBlock`. Used at the policy-load trust
 * boundary to parse `.agent/hooks/policy.json` entries into typed,
 * validated blocks. The schema's `.superRefine` also verifies that
 * `kind: 'regex'` patterns are syntactically valid RegExp source — the
 * validation that used to live inside the hand-written type guard.
 */
export const ScopedContentBlockSchema = z
  .object({
    pattern: z.string(),
    kind: z.enum(['literal', 'regex']).optional(),
    include_paths: z.array(z.string()).min(1),
    exclude_paths: z.array(z.string()).optional(),
    excludes_inline_code: z.boolean().optional(),
    excludes_lines_with: z.array(z.string()).optional(),
    citation: z.string(),
  })
  .superRefine((entry, ctx) => {
    if (entry.kind !== 'regex') {
      return;
    }
    try {
      new RegExp(entry.pattern, 'u');
    } catch {
      ctx.addIssue({
        code: 'custom',
        message: `scoped_block kind 'regex' has invalid pattern: ${entry.pattern}`,
        path: ['pattern'],
      });
    }
  });
