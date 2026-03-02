/**
 * Validation logic for explore-topic tool arguments.
 *
 * Validates required text field and optional subject/keyStage filters.
 */

import { z } from 'zod';
import {
  type KeyStage,
  isKeyStage,
  type Subject,
  isSubject,
} from '@oaknational/sdk-codegen/api-schema';
import type { ExploreArgs } from './types.js';

const ExploreObjectSchema = z
  .object({
    text: z
      .string({ error: 'explore-topic requires a non-empty text field' })
      .trim()
      .min(1, { message: 'explore-topic requires a non-empty text field' }),
    subject: z.string().optional(),
    keyStage: z.string().optional(),
  })
  .strict();

type NarrowResult<T> = { ok: true; value?: T } | { ok: false; message: string };

function narrowKeyStage(value: string | undefined): NarrowResult<KeyStage> {
  if (value === undefined) {
    return { ok: true };
  }
  if (!isKeyStage(value)) {
    return { ok: false, message: 'keyStage must be one of ks1, ks2, ks3, ks4' };
  }
  return { ok: true, value };
}

function narrowSubject(value: string | undefined): NarrowResult<Subject> {
  if (value === undefined) {
    return { ok: true };
  }
  if (!isSubject(value)) {
    return { ok: false, message: 'subject must be a recognised subject slug' };
  }
  return { ok: true, value };
}

/**
 * Validates and normalises raw MCP input to strongly-typed ExploreArgs.
 *
 * @param input - Raw input from MCP tool call (unknown type)
 * @returns Result with validated ExploreArgs or error message
 */
export function validateExploreArgs(
  input: unknown,
): { ok: true; value: ExploreArgs } | { ok: false; message: string } {
  if (typeof input !== 'object' || input === null) {
    return { ok: false, message: 'explore-topic expects an object input with a text field' };
  }

  const parsed = ExploreObjectSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Invalid explore input' };
  }

  const ks = narrowKeyStage(parsed.data.keyStage);
  if (!ks.ok) {
    return ks;
  }
  const sub = narrowSubject(parsed.data.subject);
  if (!sub.ok) {
    return sub;
  }

  return { ok: true, value: { text: parsed.data.text, subject: sub.value, keyStage: ks.value } };
}
