/**
 * Validation logic for browse-curriculum tool arguments.
 *
 * Validates optional subject and keyStage filters using Zod for structure
 * and generated type guards for enum narrowing.
 */

import { z } from 'zod';
import {
  type KeyStage,
  isKeyStage,
  type Subject,
  isSubject,
} from '../../types/generated/api-schema/path-parameters.js';
import type { BrowseArgs } from './types.js';

const BrowseObjectSchema = z
  .object({
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

/** Narrows the parsed Zod output into BrowseArgs with valid KeyStage/Subject. */
function narrowBrowseFilters(
  data: z.infer<typeof BrowseObjectSchema>,
): { ok: true; value: BrowseArgs } | { ok: false; message: string } {
  const ks = narrowKeyStage(data.keyStage);
  if (!ks.ok) {
    return ks;
  }
  const sub = narrowSubject(data.subject);
  if (!sub.ok) {
    return sub;
  }
  return { ok: true, value: { subject: sub.value, keyStage: ks.value } };
}

/**
 * Validates and normalises raw MCP input to strongly-typed BrowseArgs.
 *
 * @param input - Raw input from MCP tool call (unknown type)
 * @returns Result with validated BrowseArgs or error message
 */
export function validateBrowseArgs(
  input: unknown,
): { ok: true; value: BrowseArgs } | { ok: false; message: string } {
  if (input === undefined || input === null) {
    return { ok: true, value: {} };
  }
  if (typeof input !== 'object') {
    return { ok: false, message: 'browse-curriculum expects an object input or no arguments' };
  }

  const parsed = BrowseObjectSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Invalid browse input' };
  }

  return narrowBrowseFilters(parsed.data);
}
