/**
 * The Claude block a declaration carries, and the coherence its boundary refuses. Every
 * field is optional and absent means the estate's default (`adapter-defaults.ts`), with two
 * forms that change the adapter's shape rather than one of its lines:
 *
 * - `tools: none` is the zero-tool adapter. It renders as the null-value `tools:` field, the
 *   one Claude spelling that grants no tools: `tools: []` and an absent field both fall back
 *   to every tool (probed live through the Workflow path on 2026-07-02, the record in the
 *   `corpus-voter` template). `inherit` is the other word: the adapter carries no tools line.
 * - `body: system-prompt` makes the adapter's body the template's System prompt block,
 *   verbatim, in place of the pointer to the template, for a role that cannot or must not
 *   spend turns reading its template (a zero-tool role cannot read at all). Such an adapter
 *   is the role's own prompt, not the reviewer pointer the defaults belong to, so it renders
 *   exactly what it declares, the template's capability envelope in full, and no default is
 *   filled. The reader (`read-subagent-declaration.ts`) takes the block from the template; a
 *   fan-out's variants carry the pointer to their shared template and never declare it, so
 *   no variant is zero-tool.
 *
 * `maxTurns` is Claude's own turn bound, written as the number declared.
 *
 * @packageDocumentation
 */

import { z } from 'zod';

import { line, prose } from './declaration-scalars.js';

/** The `tools` word for the zero-tool adapter. */
export const ZERO_TOOLS = 'none';

const claudeBlock = z
  .object({
    /** A comma-joined tool list, `inherit` for no tools line, or `none` for no tools at all. */
    tools: line.optional(),
    disallowedTools: line.optional(),
    permissionMode: line.optional(),
    color: line.optional(),
    model: line.optional(),
    effort: line.optional(),
    maxTurns: z.number().int().positive().optional(),
    /** The adapter body's source when it is not the pointer: the template's System prompt block. */
    body: z.literal('system-prompt').optional(),
    ...prose,
  })
  .strict();

type ClaudeBlock = z.infer<typeof claudeBlock>;

/** The names a tools line lists, trimmed; none when the line is absent. */
function toolNames(tools: string | undefined): readonly string[] {
  return tools === undefined ? [] : tools.split(',').map((name) => name.trim());
}

const INLINE = 'an adapter whose body is the System prompt block';

/** One shape a Claude block cannot take, keyed by the field that breaks it. */
interface Incoherence {
  readonly key: keyof ClaudeBlock;
  readonly breaks: (block: ClaudeBlock) => boolean;
  readonly message: string;
}

/** The shapes a zero-tool block cannot take, a role's or a variant's. */
const ZERO_TOOL_RULES: readonly Incoherence[] = [
  {
    key: 'tools',
    breaks: (block) => toolNames(block.tools).includes(ZERO_TOOLS) && block.tools !== ZERO_TOOLS,
    message: `${ZERO_TOOLS} stands alone, written exactly: a zero-tool adapter lists no tool`,
  },
  {
    key: 'disallowedTools',
    breaks: (block) => block.tools === ZERO_TOOLS && block.disallowedTools !== undefined,
    message: 'a zero-tool adapter grants nothing to deny',
  },
];

/** A variant's own: its body is the pointer to its fan-out's template, which it must read. */
const VARIANT_RULES: readonly Incoherence[] = [
  {
    key: 'tools',
    breaks: (block) => block.tools === ZERO_TOOLS,
    message: `a variant points to its fan-out's template, which a zero-tool agent cannot read`,
  },
  ...ZERO_TOOL_RULES,
];

/** A role's, in refusal order: the zero-tool shapes, then the System prompt body's. */
const ROLE_RULES: readonly Incoherence[] = [
  ...ZERO_TOOL_RULES,
  {
    key: 'body',
    breaks: (block) => block.tools === ZERO_TOOLS && block.body === undefined,
    message:
      "a zero-tool adapter cannot read the template a pointer names, so its body is the template's System prompt block (body: system-prompt)",
  },
  {
    key: 'tools',
    breaks: (block) => block.body !== undefined && block.tools === undefined,
    message: `${INLINE} fills no default, so it declares its tools (none, inherit or a list)`,
  },
  {
    key: 'pointerTail',
    breaks: (block) => block.body !== undefined && block.pointerTail !== undefined,
    message: `${INLINE} carries no pointer`,
  },
  {
    key: 'note',
    breaks: (block) => block.body !== undefined && block.note !== undefined,
    message: `${INLINE} closes with the generated provenance comment`,
  },
];

/** The refinement that adds one issue per rule the block breaks, at the rule's key. */
function refusing(rules: readonly Incoherence[]) {
  return (block: ClaudeBlock, context: z.RefinementCtx): void => {
    for (const rule of rules.filter((entry) => entry.breaks(block))) {
      context.addIssue({ code: 'custom', path: [rule.key], message: rule.message });
    }
  };
}

/** A role's Claude block: every field, its System prompt body included. */
export const roleClaudeFields = claudeBlock.superRefine(refusing(ROLE_RULES));

/**
 * A variant's Claude block: a variant points to its fan-out's template, so it declares no
 * body and cannot be zero-tool.
 */
export const variantClaudeFields = claudeBlock
  .omit({ body: true })
  .superRefine(refusing(VARIANT_RULES));

export type ClaudeFields = z.infer<typeof roleClaudeFields>;
