import { z } from 'zod';

/**
 * Closed runtime schemas for supported Claude content-hook wire contracts.
 *
 * @packageDocumentation
 */

/** Claude Edit tool arguments. */
const ClaudeEditInputSchema = z
  .object({
    new_string: z.string(),
    old_string: z.string().optional(),
    file_path: z.string().optional(),
    replace_all: z.boolean().optional(),
  })
  .strict();

/** Claude Write tool arguments. */
const ClaudeWriteInputSchema = z
  .object({
    content: z.string(),
    file_path: z.string().optional(),
  })
  .strict();

/** The two Claude content-tool argument contracts. */
export const ClaudeContentInputSchema = z.union([ClaudeEditInputSchema, ClaudeWriteInputSchema]);

/** Metadata accepted on the snake-case PreToolUse envelope. */
const ClaudeCommonEnvelopeShape = {
  session_id: z.string().optional(),
  transcript_path: z.string().optional(),
  cwd: z.string().optional(),
  permission_mode: z
    .enum(['default', 'plan', 'acceptEdits', 'auto', 'dontAsk', 'bypassPermissions'])
    .optional(),
  effort: z
    .object({
      level: z.enum(['low', 'medium', 'high', 'xhigh', 'max']),
    })
    .strict()
    .optional(),
  hook_event_name: z.literal('PreToolUse').optional(),
  tool_use_id: z.string().optional(),
  agent_id: z.string().optional(),
  agent_type: z.string().optional(),
} as const;

/** Claude snake-case Edit envelope. */
const ClaudeSnakeEditEnvelopeSchema = z
  .object({
    ...ClaudeCommonEnvelopeShape,
    tool_name: z.literal('Edit').optional(),
    tool_input: ClaudeEditInputSchema,
  })
  .strict();

/** Claude snake-case Write envelope. */
const ClaudeSnakeWriteEnvelopeSchema = z
  .object({
    ...ClaudeCommonEnvelopeShape,
    tool_name: z.literal('Write').optional(),
    tool_input: ClaudeWriteInputSchema,
  })
  .strict();

/** Supported Claude snake-case content envelopes. */
export const ClaudeSnakeEnvelopeSchema = z.union([
  ClaudeSnakeEditEnvelopeSchema,
  ClaudeSnakeWriteEnvelopeSchema,
]);

/** Metadata accepted on Claude's camel-case compatibility envelope. */
const ClaudeCamelCommonEnvelopeShape = {
  sessionId: z.string().optional(),
  timestamp: z.number().optional(),
  cwd: z.string().optional(),
} as const;

/** Claude camel-case Edit envelope. */
const ClaudeCamelEditEnvelopeSchema = z
  .object({
    ...ClaudeCamelCommonEnvelopeShape,
    toolName: z.literal('Edit').optional(),
    toolInput: ClaudeEditInputSchema,
  })
  .strict();

/** Claude camel-case Write envelope. */
const ClaudeCamelWriteEnvelopeSchema = z
  .object({
    ...ClaudeCamelCommonEnvelopeShape,
    toolName: z.literal('Write').optional(),
    toolInput: ClaudeWriteInputSchema,
  })
  .strict();

/** Supported Claude camel-case content envelopes. */
export const ClaudeCamelEnvelopeSchema = z.union([
  ClaudeCamelEditEnvelopeSchema,
  ClaudeCamelWriteEnvelopeSchema,
]);
