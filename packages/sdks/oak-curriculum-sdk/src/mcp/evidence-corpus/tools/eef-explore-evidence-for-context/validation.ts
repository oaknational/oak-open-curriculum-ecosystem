/**
 * Validation for `eef-explore-evidence-for-context` arguments.
 *
 * The teacher context arrives across a trust boundary (model-supplied tool
 * input). This is the strict-validation gate: required non-empty `subject`,
 * `key_stage`, and `topic`; an optional `focus` constrained to the closed
 * {@link EEF_EXPLORE_FOCUSES} enum. Unknown keys are rejected (`.strict()`)
 * so a malformed call fails here rather than reaching the corpus loader.
 */

import { z } from 'zod';

import { EEF_EXPLORE_FOCUSES, type EefExploreArgs } from './tool-definition.js';

const EefExploreObjectSchema = z
  .object({
    subject: z
      .string({ error: 'eef-explore-evidence-for-context requires a non-empty subject' })
      .trim()
      .min(1, { message: 'eef-explore-evidence-for-context requires a non-empty subject' }),
    key_stage: z
      .string({ error: 'eef-explore-evidence-for-context requires a non-empty key_stage' })
      .trim()
      .min(1, { message: 'eef-explore-evidence-for-context requires a non-empty key_stage' }),
    topic: z
      .string({ error: 'eef-explore-evidence-for-context requires a non-empty topic' })
      .trim()
      .min(1, { message: 'eef-explore-evidence-for-context requires a non-empty topic' }),
    focus: z.enum([...EEF_EXPLORE_FOCUSES]).optional(),
  })
  .strict();

/**
 * Validate and normalise raw MCP input to typed {@link EefExploreArgs}.
 *
 * @param input - Raw input from the MCP tool call (unknown type).
 * @returns A result carrying the validated args or a single error message.
 */
export function validateEefExploreArgs(
  input: unknown,
): { ok: true; value: EefExploreArgs } | { ok: false; message: string } {
  if (typeof input !== 'object' || input === null) {
    return {
      ok: false,
      message:
        'eef-explore-evidence-for-context expects an object input with subject, key_stage, and topic',
    };
  }

  const parsed = EefExploreObjectSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Invalid eef-explore input' };
  }

  return {
    ok: true,
    value: {
      subject: parsed.data.subject,
      keyStage: parsed.data.key_stage,
      topic: parsed.data.topic,
      focus: parsed.data.focus,
    },
  };
}
