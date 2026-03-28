/**
 * Shared Zod schema for the MCP SDK's AuthInfo type.
 *
 * Validates auth data at the Express/MCP boundary. Used by both
 * `handlers.ts` (ingress validation) and referenced by
 * `check-mcp-client-auth.ts` (which has its own `authInfoExtraSchema`
 * for safely accessing `AuthInfo.extra.userId`).
 *
 * Uses `.strict()` to reject unknown fields — if a future SDK version
 * adds fields, the Zod parse fails fast, prompting an intentional
 * schema update rather than silently accepting drift.
 *
 * @see handlers.ts — ingress boundary where this schema is applied
 * @see check-mcp-client-auth.ts — tool-level auth checking
 */

import { z } from 'zod';

/**
 * Zod schema for the MCP SDK's AuthInfo type.
 *
 * Validates auth data read from `res.locals.authInfo` at the Express/MCP
 * boundary. Replaces a bare type assertion with runtime validation so that
 * malformed auth data is caught immediately rather than propagated silently.
 *
 * The `resource` field validates `URL` instances per the SDK interface.
 * Note: `z.instanceof(URL)` is serialisation-hostile — if `authInfo` is
 * ever deserialised from JSON, URL instances become plain objects and
 * `instanceof` will fail. This is acceptable because `authInfo` is always
 * passed in-process via `res.locals`, never serialised.
 *
 * Verified: `@clerk/mcp-tools@0.3.1` `verifyClerkToken` never sets
 * `resource` (returns only token, clientId, scopes, extra). The field is
 * included for completeness and forward compatibility.
 */
export const authInfoSchema = z
  .object({
    token: z.string(),
    clientId: z.string(),
    scopes: z.array(z.string()),
    expiresAt: z.number().optional(),
    resource: z.instanceof(URL).optional(),
    extra: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();
