/**
 * Per-platform subagent frontmatter schemas — the enforced single source of
 * truth for valid Claude and Cursor wrapper frontmatter.
 *
 * Field sets and value enums were verified first-hand against current official
 * documentation (2026-06-28); see {@link FRONTMATTER_SOURCES}. Codex adapter
 * (`.toml`) validation lives in the `validate-subagents-codex-*` helpers; this
 * module covers the Markdown-frontmatter platforms (Claude, Cursor), which
 * previously had no field-set or value validation — the gap through which an
 * invalid `color: amber` reached a wrapper unnoticed.
 *
 * Reconcile: the platform specs change (nine Claude fields were added after the
 * architect template was written). On a platform-release signal, re-run the
 * meta-agent currency-check workflow and update the field sets, the enums, and
 * the `lastVerified` dates below.
 *
 * Policy note — `model` is OPTIONAL on every platform (the inherit policy): a
 * wrapper that omits `model` inherits the invoking agent's model, which a
 * per-invocation override still beats. Wrappers should omit `model` rather than
 * pin one.
 */

import { z } from 'zod';

/** Official-doc provenance for each platform schema (the reconcile anchor). */
export const FRONTMATTER_SOURCES = {
  claude: { url: 'https://code.claude.com/docs/en/sub-agents', lastVerified: '2026-06-28' },
  cursor: { url: 'https://cursor.com/docs/subagents', lastVerified: '2026-06-28' },
} as const;

const CLAUDE_COLORS = [
  'red',
  'blue',
  'green',
  'yellow',
  'purple',
  'orange',
  'pink',
  'cyan',
] as const;
const CLAUDE_MODEL_ALIASES = ['sonnet', 'opus', 'haiku', 'fable', 'inherit'] as const;
const CLAUDE_PERMISSION_MODES = [
  'default',
  'acceptEdits',
  'auto',
  'dontAsk',
  'bypassPermissions',
  'plan',
] as const;
const CLAUDE_MEMORY_SCOPES = ['user', 'project', 'local'] as const;
const CLAUDE_EFFORT_LEVELS = ['low', 'medium', 'high', 'xhigh', 'max'] as const;

/**
 * A comma-separated string (the common form) or a non-empty explicit YAML
 * array. An empty array is rejected: on Claude, `tools: []` falls back to
 * inherit-all (probed 2026-07-02), so it reads as a restriction while
 * granting everything — a misleading shape with no valid use.
 */
const toolList = z.union([z.string().min(1), z.array(z.string().min(1)).min(1)]);

/**
 * Claude `tools`: a tool list, or NULL — the probe-verified zero-tools shape
 * (2026-07-02): the field present with an empty YAML value grants no tools,
 * while `[]` and omitting the field both fall back to inherit-all. Null is
 * therefore the only zero-tools spelling and must validate; see the
 * corpus-voter / corpus-reducer wrappers and their canonical templates for
 * the probe record. Null has no meaning on `disallowedTools` (zero granted
 * leaves nothing to subtract), so this shape is `tools`-only.
 */
const claudeTools = toolList.nullable();

/** Claude model: an alias / `inherit`, or a full `claude-…` model id. */
const claudeModel = z.union([
  z.enum(CLAUDE_MODEL_ALIASES),
  z
    .string()
    .regex(/^claude-[a-z0-9.-]+$/u, 'must be a Claude alias, `inherit`, or a `claude-…` model id'),
]);

/**
 * Claude wrapper frontmatter (`.claude/agents/*.md`). A closed object: unknown
 * fields are rejected so typos and stale conventions fail the gate. `name` and
 * `description` are required (platform + repo); every other field is optional.
 */
const claudeFrontmatterSchema = z.strictObject({
  name: z.string().min(1),
  description: z.string().min(1),
  tools: claudeTools.optional(),
  disallowedTools: toolList.optional(),
  model: claudeModel.optional(),
  permissionMode: z.enum(CLAUDE_PERMISSION_MODES).optional(),
  color: z.enum(CLAUDE_COLORS).optional(),
  maxTurns: z.number().int().positive().optional(),
  skills: z.union([z.string().min(1), z.array(z.string().min(1))]).optional(),
  mcpServers: z.unknown().optional(),
  hooks: z.unknown().optional(),
  memory: z.enum(CLAUDE_MEMORY_SCOPES).optional(),
  background: z.boolean().optional(),
  effort: z.enum(CLAUDE_EFFORT_LEVELS).optional(),
  isolation: z.literal('worktree').optional(),
  initialPrompt: z.string().min(1).optional(),
});

/** Cursor model: `inherit` or a specific model id — never `auto`/`fast`. */
const cursorModel = z
  .string()
  .min(1)
  .refine((value) => value !== 'auto' && value !== 'fast', {
    message: 'Cursor `model` must be `inherit` or a specific model id (not `auto`/`fast`)',
  });

/**
 * Cursor wrapper frontmatter (`.cursor/agents/*.md`). A closed object. Cursor
 * subagents have no `tools` or `color` field (tools are inherited; restrict via
 * `readonly`). `name`/`description` are required as a repo stricture (the
 * platform makes them optional); `model` is optional (inherit policy).
 */
const cursorFrontmatterSchema = z.strictObject({
  name: z.string().min(1),
  description: z.string().min(1),
  model: cursorModel.optional(),
  readonly: z.boolean().optional(),
  is_background: z.boolean().optional(),
});

export type SubagentPlatform = 'claude' | 'cursor';

const SCHEMAS: Record<SubagentPlatform, z.ZodType> = {
  claude: claudeFrontmatterSchema,
  cursor: cursorFrontmatterSchema,
};

/**
 * Validates a parsed frontmatter object for a Claude or Cursor wrapper against
 * its platform schema.
 *
 * Returns one issue string per violation (an empty array means valid), matching
 * the `string[]` issue convention used across the subagent validators. Unknown
 * fields are reported with their names so typos are obvious.
 *
 * @param platform - `'claude'` or `'cursor'`.
 * @param file - Repository-relative wrapper path (used in messages).
 * @param frontmatter - The parsed YAML frontmatter object.
 * @returns Array of issue strings; empty when the frontmatter is valid.
 */
export function validateFrontmatter(
  platform: SubagentPlatform,
  file: string,
  frontmatter: unknown,
): string[] {
  const result = SCHEMAS[platform].safeParse(frontmatter);
  if (result.success) {
    return [];
  }
  return result.error.issues.map((issue) => {
    if (issue.code === 'unrecognized_keys') {
      return `${file}: unrecognised frontmatter field(s): ${issue.keys.join(', ')}`;
    }
    const location = issue.path.length > 0 ? issue.path.join('.') : 'frontmatter';
    return `${file}: ${location} — ${issue.message}`;
  });
}

/** Minimal schema to read just the `name` field for the filename-match check. */
const nameOnlySchema = z.object({ name: z.string().min(1) });

/**
 * Reads the `name` field from a parsed frontmatter object, returning null when
 * it is absent or not a string. Kept separate from {@link validateFrontmatter}
 * so schema validation stays a pure field/value check, and so the
 * name-matches-filename check needs no unsafe object cast.
 *
 * @param frontmatter - The parsed YAML frontmatter object.
 * @returns The declared `name`, or null when absent/non-string.
 */
export function frontmatterName(frontmatter: unknown): string | null {
  const result = nameOnlySchema.safeParse(frontmatter);
  return result.success ? result.data.name : null;
}
