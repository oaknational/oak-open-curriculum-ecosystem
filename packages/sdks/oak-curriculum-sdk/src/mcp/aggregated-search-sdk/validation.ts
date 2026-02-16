/**
 * Validation logic for SDK-backed search tool arguments.
 *
 * Validates and normalises raw MCP input into strongly-typed SearchSdkArgs.
 * Uses Zod for structural validation and generated type guards for enum
 * narrowing (KeyStage, Subject, SearchSdkScope).
 */

import { z } from 'zod';
import {
  type KeyStage,
  isKeyStage,
  type Subject,
  isSubject,
} from '../../types/generated/api-schema/path-parameters.js';
import { type SearchSdkArgs, SEARCH_SDK_SCOPES, isSearchSdkScope } from './types.js';

/**
 * Zod schema for the search tool's object input.
 *
 * Validates structural shape only. Type narrowing for enums (scope,
 * keyStage, subject) happens after Zod validation using generated guards.
 */
const SearchSdkObjectSchema = z
  .object({
    text: z
      .string({ error: 'search requires a non-empty text field' })
      .trim()
      .min(1, { message: 'search requires a non-empty text field' }),
    scope: z.string({ error: 'scope is required' }),
    subject: z.string().optional(),
    keyStage: z.string().optional(),
    size: z.number().int().min(1).max(100).optional(),
    from: z.number().int().min(0).optional(),
    unitSlug: z.string().optional(),
    tier: z.string().optional(),
    examBoard: z.string().optional(),
    year: z.string().optional(),
    threadSlug: z.string().optional(),
    highlight: z.boolean().optional(),
    minLessons: z.number().int().min(1).optional(),
    phaseSlug: z.string().optional(),
    category: z.string().optional(),
    limit: z.number().int().min(1).max(50).optional(),
  })
  .strict();

/**
 * Validates and narrows a key stage string to the KeyStage type.
 *
 * @param value - Raw key stage string from input
 * @returns Result with narrowed KeyStage or error message
 */
function normaliseKeyStage(
  value: string | undefined,
): { ok: true; value?: KeyStage } | { ok: false; message: string } {
  if (value === undefined) {
    return { ok: true, value: undefined };
  }
  if (!isKeyStage(value)) {
    return { ok: false, message: 'keyStage must be one of ks1, ks2, ks3, ks4' };
  }
  return { ok: true, value };
}

/**
 * Validates and narrows a subject string to the Subject type.
 *
 * @param value - Raw subject string from input
 * @returns Result with narrowed Subject or error message
 */
function normaliseSubject(
  value: string | undefined,
): { ok: true; value?: Subject } | { ok: false; message: string } {
  if (value === undefined) {
    return { ok: true, value: undefined };
  }
  if (!isSubject(value)) {
    return { ok: false, message: 'subject must be a recognised subject slug' };
  }
  return { ok: true, value };
}

/**
 * Validates and normalises raw MCP input to strongly-typed SearchSdkArgs.
 *
 * Accepts an object with `text`, `scope`, and optional filter fields.
 * Validates structural shape with Zod, then narrows enums using generated
 * type guards.
 *
 * @param input - Raw input from MCP tool call (unknown type)
 * @returns Result with validated SearchSdkArgs or error message
 *
 * @example
 * ```typescript
 * const result = validateSearchSdkArgs({
 *   text: 'photosynthesis',
 *   scope: 'lessons',
 *   keyStage: 'ks3',
 *   subject: 'science',
 * });
 * if (result.ok) {
 *   // result.value is SearchSdkArgs with narrowed types
 * }
 * ```
 */
/**
 * Structurally validates and narrows scope, keyStage, and subject from parsed data.
 */
function narrowEnums(parsed: z.infer<typeof SearchSdkObjectSchema>):
  | {
      ok: true;
      value: SearchSdkArgs;
    }
  | { ok: false; message: string } {
  const { scope, keyStage, subject, ...rest } = parsed;

  if (!isSearchSdkScope(scope)) {
    return { ok: false, message: `scope must be one of: ${SEARCH_SDK_SCOPES.join(', ')}` };
  }

  const keyStageResult = normaliseKeyStage(keyStage);
  if (!keyStageResult.ok) {
    return keyStageResult;
  }

  const subjectResult = normaliseSubject(subject);
  if (!subjectResult.ok) {
    return subjectResult;
  }

  return {
    ok: true,
    value: { ...rest, scope, keyStage: keyStageResult.value, subject: subjectResult.value },
  };
}

export function validateSearchSdkArgs(
  input: unknown,
): { ok: true; value: SearchSdkArgs } | { ok: false; message: string } {
  if (typeof input !== 'object' || input === null) {
    return { ok: false, message: 'search expects an object input with text and scope fields' };
  }

  const parsed = SearchSdkObjectSchema.safeParse(input);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return { ok: false, message: firstIssue?.message ?? 'Invalid search input' };
  }

  return narrowEnums(parsed.data);
}
