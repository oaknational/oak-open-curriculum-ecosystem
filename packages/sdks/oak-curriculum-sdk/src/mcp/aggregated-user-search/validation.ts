/**
 * Validation logic for user search tool arguments.
 *
 * Validates and normalises raw MCP input into strongly-typed UserSearchArgs.
 * Uses Zod for structural validation and generated type guards for enum
 * narrowing (KeyStage, Subject, UserSearchScope).
 */

import { z } from 'zod';
import {
  type KeyStage,
  isKeyStage,
  type Subject,
  isSubject,
} from '@oaknational/sdk-codegen/api-schema';
import { type UserSearchArgs, USER_SEARCH_SCOPES, isUserSearchScope } from './types.js';

/**
 * Zod schema for user search tool input.
 *
 * Validates structural shape. Type narrowing for enums (scope,
 * keyStage, subject) happens after Zod validation using generated guards.
 */
const UserSearchObjectSchema = z
  .object({
    query: z.string({ error: 'query is required' }).trim(),
    scope: z.string({ error: 'scope is required' }),
    subject: z.string().optional(),
    keyStage: z.string().optional(),
    size: z.number().int().min(1).max(50).optional(),
  })
  .strict();

/**
 * Validates and narrows a key stage string to the KeyStage type.
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
 * Structurally validates and narrows scope, keyStage, and subject from parsed data.
 */
function narrowEnums(
  parsed: z.infer<typeof UserSearchObjectSchema>,
): { ok: true; value: UserSearchArgs } | { ok: false; message: string } {
  const { scope, keyStage, subject, ...rest } = parsed;

  if (!isUserSearchScope(scope)) {
    return { ok: false, message: `scope must be one of: ${USER_SEARCH_SCOPES.join(', ')}` };
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

/**
 * Validates and normalises raw MCP input to strongly-typed UserSearchArgs.
 *
 * Shared by both `user-search` and `user-search-query` since they accept
 * the same parameters.
 *
 * @param input - Raw input from MCP tool call (unknown type)
 * @returns Result with validated UserSearchArgs or error message
 */
export function validateUserSearchArgs(
  input: unknown,
): { ok: true; value: UserSearchArgs } | { ok: false; message: string } {
  if (typeof input !== 'object' || input === null) {
    return { ok: false, message: 'user-search expects an object input with query and scope' };
  }

  const parsed = UserSearchObjectSchema.safeParse(input);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return { ok: false, message: firstIssue?.message ?? 'Invalid user search input' };
  }

  return narrowEnums(parsed.data);
}
