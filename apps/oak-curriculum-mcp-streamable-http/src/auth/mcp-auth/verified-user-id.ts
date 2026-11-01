/**
 * Canonical derivation of the verified actor's userId from validated auth
 * context (the `consolidate-at-second-consumer` cut for the auth-identity
 * shape).
 *
 * @remarks
 * Empty string collapses to `undefined`, agreeing with the product-analytics
 * sink's non-empty requirement — an empty-string principal is treated as
 * absent everywhere this helper is consumed. Two older inline copies of this
 * derivation remain (`check-mcp-client-auth.ts`, `mcp-handler.ts`); their
 * migration onto this helper is MCP-363, and note the
 * `check-mcp-client-auth` copy currently counts an empty string as user
 * context — adopting this helper there is a deliberate semantic correction.
 */

import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';

import { authInfoExtraSchema } from './auth-info-schema.js';

/**
 * Derives the verified userId from an optional MCP SDK `AuthInfo`.
 *
 * @param authInfo - The validated auth context set by the mcp-auth
 * middleware, or `undefined` on unauthenticated paths.
 * @returns The non-empty verified userId, or `undefined` when the context is
 * absent, carries no `userId`, or carries an empty string.
 */
export function verifiedUserIdFrom(authInfo: AuthInfo | undefined): string | undefined {
  const parsed = authInfoExtraSchema.safeParse(authInfo?.extra);
  const userId = parsed.success ? parsed.data.userId : undefined;
  return userId || undefined;
}
