/**
 * Shared Zod schemas for the MCP SDK's AuthInfo type.
 *
 * Validates auth data at the Clerk/MCP boundary in `createMcpAuthClerk`.
 * `authInfoExtraSchema` is shared by `check-mcp-client-auth.ts` (tool-level
 * auth checking) and `mcp-handler.ts` (Sentry user enrichment).
 *
 * Uses `.strict()` on the full schema to reject unknown fields — if a future
 * SDK version adds fields, the Zod parse fails fast, prompting an intentional
 * schema update rather than silently accepting drift.
 *
 * @see mcp-auth-clerk.ts — validates verifyClerkToken output before setting req.auth
 * @see ../../check-mcp-client-auth.ts — tool-level auth checking
 * @see ../../mcp-handler.ts — Sentry user enrichment
 */

import { z } from 'zod';

/**
 * Zod schema for the MCP SDK's AuthInfo type.
 *
 * Validates auth data produced by `verifyClerkToken` in `createMcpAuthClerk`
 * before `mcpAuth` middleware sets it on `req.auth`. Replaces a bare type
 * assertion with runtime validation so that malformed auth data is caught
 * immediately rather than propagated silently.
 *
 * @remarks
 * The `resource` field uses `z.instanceof(URL)` per the SDK interface.
 * This is serialisation-hostile — if `authInfo` is ever deserialised from
 * JSON, URL instances become plain objects and `instanceof` will fail.
 * This is acceptable because `authInfo` is always passed in-process via
 * `req.auth`, never serialised.
 *
 * `@clerk/mcp-tools@0.3.1` `verifyClerkToken` never sets `resource`
 * (returns only token, clientId, scopes, extra). The field is included
 * for completeness and forward compatibility.
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

/**
 * Zod schema for safely accessing `AuthInfo.extra.userId`.
 *
 * @remarks Uses `.loose()` (Zod v4 equivalent of `.passthrough()`) to
 * preserve unknown properties from `AuthInfo.extra` without rejecting
 * them — the extra field is `Record<string, unknown>` by design, so
 * unknown keys are expected but should not be stripped.
 *
 * Shared by:
 * - `check-mcp-client-auth.ts` — tool-level auth checking
 * - `mcp-handler.ts` — Sentry user enrichment
 *
 * @see authInfoSchema — full AuthInfo boundary validation
 */
export const authInfoExtraSchema = z.object({ userId: z.string().optional() }).loose();
