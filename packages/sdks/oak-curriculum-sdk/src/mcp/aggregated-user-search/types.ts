/**
 * Type definitions for user-facing search tools.
 *
 * Both `user-search` and `user-search-query` share the same argument shape —
 * they accept a query string, scope, and optional filters.
 */

import type { KeyStage, Subject } from '@oaknational/sdk-codegen/api-schema';

/** Valid scope values for user search tools (subset of full search scopes). */
export const USER_SEARCH_SCOPES = ['lessons', 'units', 'threads', 'sequences'] as const;
export type UserSearchScope = (typeof USER_SEARCH_SCOPES)[number];

/**
 * Type guard for user search scope values.
 *
 * @param value - Value to check
 * @returns True if value is a valid UserSearchScope
 */
export function isUserSearchScope(value: string): value is UserSearchScope {
  const scopes: readonly string[] = USER_SEARCH_SCOPES;
  return scopes.includes(value);
}

/**
 * Validated arguments for user search tools.
 *
 * Used by both `user-search` and `user-search-query` since they share
 * the same parameter surface.
 */
export interface UserSearchArgs {
  readonly query: string;
  readonly scope: UserSearchScope;
  readonly subject?: Subject;
  readonly keyStage?: KeyStage;
  readonly size?: number;
}
