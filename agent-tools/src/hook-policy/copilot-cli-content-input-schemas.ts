import { isErr } from '@oaknational/result';
import { z } from 'zod';

import { parseApplyPatchContent } from './apply-patch-content.js';

/**
 * Closed runtime schemas for supported Copilot CLI content-hook wire contracts.
 *
 * @packageDocumentation
 */

/** Copilot CLI `create` arguments, confirmed by the installed tool schema. */
export const CopilotCreateArgsSchema = z
  .object({
    path: z.string().min(1),
    file_text: z.string(),
  })
  .strict();

/** Copilot CLI `edit` arguments, confirmed by the installed tool schema. */
export const CopilotEditArgsSchema = z
  .object({
    path: z.string().min(1),
    old_str: z.string(),
    new_str: z.string().optional(),
  })
  .strict();

/**
 * Parse Copilot's freeform `apply_patch` document during schema validation.
 *
 * Unlike function tools, Copilot's custom `apply_patch` tool places its raw
 * document directly in a batch call's `args` string.
 */
const CopilotApplyPatchDocumentSchema = z.string().transform((patch, ctx) => {
  const result = parseApplyPatchContent(patch);
  if (isErr(result)) {
    ctx.addIssue({ code: 'custom', message: result.error.message });
    return z.NEVER;
  }
  return { changes: result.value };
});

/** Copilot CLI `apply_patch` object arguments normalised during validation. */
const CopilotApplyPatchArgsSchema = z
  .object({
    patch: CopilotApplyPatchDocumentSchema,
  })
  .strict()
  .transform((input) => input.patch);

/** Validate and parse a JSON-string field against its tool-argument schema. */
function serialisedJsonSchema<T>(schema: z.ZodType<T>, label: string): z.ZodType<T> {
  return z.string().transform((text, ctx) => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      ctx.addIssue({ code: 'custom', message: `${label} was not valid JSON.` });
      return z.NEVER;
    }

    const result = schema.safeParse(parsed);
    if (!result.success) {
      ctx.addIssue({ code: 'custom', message: `${label} did not match its tool schema.` });
      return z.NEVER;
    }
    return result.data;
  });
}

/** GitHub's documented native camel-case Copilot content envelope. */
export const CopilotNativeCamelEnvelopeSchema = z.discriminatedUnion('toolName', [
  z
    .object({
      sessionId: z.string().min(1),
      timestamp: z.number(),
      cwd: z.string().min(1),
      toolName: z.literal('create'),
      toolArgs: serialisedJsonSchema(CopilotCreateArgsSchema, 'Copilot create toolArgs'),
    })
    .strict(),
  z
    .object({
      sessionId: z.string().min(1),
      timestamp: z.number(),
      cwd: z.string().min(1),
      toolName: z.literal('edit'),
      toolArgs: serialisedJsonSchema(CopilotEditArgsSchema, 'Copilot edit toolArgs'),
    })
    .strict(),
  z
    .object({
      sessionId: z.string().min(1),
      timestamp: z.number(),
      cwd: z.string().min(1),
      toolName: z.literal('apply_patch'),
      toolArgs: serialisedJsonSchema(CopilotApplyPatchArgsSchema, 'Copilot apply_patch toolArgs'),
    })
    .strict(),
]);

/** GitHub's documented PascalCase Copilot content envelope. */
export const CopilotNativePascalEnvelopeSchema = z.union([
  z
    .object({
      hook_event_name: z.literal('PreToolUse'),
      session_id: z.string().min(1),
      timestamp: z.string().min(1),
      cwd: z.string().min(1),
      tool_name: z.literal('Write'),
      tool_input: CopilotCreateArgsSchema,
    })
    .strict(),
  z
    .object({
      hook_event_name: z.literal('PreToolUse'),
      session_id: z.string().min(1),
      timestamp: z.string().min(1),
      cwd: z.string().min(1),
      tool_name: z.literal('Edit'),
      tool_input: CopilotEditArgsSchema,
    })
    .strict(),
  z
    .object({
      hook_event_name: z.literal('PreToolUse'),
      session_id: z.string().min(1),
      timestamp: z.string().min(1),
      cwd: z.string().min(1),
      tool_name: z.literal('Edit'),
      tool_input: CopilotApplyPatchArgsSchema,
    })
    .strict(),
  z
    .object({
      hook_event_name: z.literal('PreToolUse'),
      session_id: z.string().min(1),
      timestamp: z.string().min(1),
      cwd: z.string().min(1),
      tool_name: z.literal('Edit'),
      tool_input: CopilotApplyPatchDocumentSchema,
    })
    .strict(),
]);
