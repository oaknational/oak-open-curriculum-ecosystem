/**
 * Pure functions supporting the OAuth proxy passthrough layer.
 *
 * These functions handle URL derivation, metadata rewriting, and error
 * formatting. None perform I/O. For forwarded OAuth messages (register,
 * authorize, token) they support a transparent proxy and add no validation or
 * security logic of their own. The served AS metadata document is different:
 * it is the proxy's own self-description, and {@link rewriteAuthServerMetadata}
 * deliberately states Oak's advertised scopes in it (MCP-345) rather than
 * passing the upstream list through.
 *
 * @see docs/architecture/architectural-decisions/115-proxy-oauth-as-for-cursor.md
 */

import { generateClerkProtectedResourceMetadata } from '@clerk/mcp-tools/server';
import { z } from 'zod';
import { AUTH_MD_PATH } from '../auth-md.js';

/**
 * Zod schema for RFC 8414 Authorization Server metadata as served by Clerk.
 *
 * Used at the system boundary when fetching metadata from upstream Clerk.
 * The four endpoint fields are rewritten by {@link rewriteAuthServerMetadata}
 * to point to the local proxy origin, and `scopes_supported` is replaced by
 * the scopes this resource advertises (MCP-345). Every other capability field
 * is passed through unchanged from the upstream AS.
 */
const upstreamAuthServerMetadataSchema = z.object({
  issuer: z.string(),
  authorization_endpoint: z.string(),
  token_endpoint: z.string(),
  registration_endpoint: z.string(),
  token_endpoint_auth_methods_supported: z.array(z.string()).readonly(),
  scopes_supported: z.array(z.string()).readonly(),
  response_types_supported: z.array(z.string()).readonly(),
  grant_types_supported: z.array(z.string()).readonly(),
  code_challenge_methods_supported: z.array(z.string()).readonly(),
  revocation_endpoint: z.string().optional(),
  introspection_endpoint: z.string().optional(),
  userinfo_endpoint: z.string().optional(),
  jwks_uri: z.string().optional(),
  device_authorization_endpoint: z.string().optional(),
});

export type UpstreamAuthServerMetadata = z.infer<typeof upstreamAuthServerMetadataSchema>;

/**
 * The `agent_auth` block this server's AS metadata carries (MCP-759).
 *
 * Additive per RFC 8414 Section 2 ("Additional authorization server metadata
 * parameters MAY also be used"). Deliberately narrower than the shape
 * https://github.com/workos/auth.md describes: `identity_endpoint`,
 * `claim_endpoint`, `events_endpoint`, `identity_types_supported`, and
 * `identity_assertion` are omitted because this server implements none of
 * the identity/claim ceremony they describe — see `auth-md.ts` for the
 * full reasoning and the standard OAuth 2.1 flow this server offers
 * instead. `skill` is the one field every publisher of the shape is
 * expected to carry: a pointer to the human/agent-readable document.
 *
 * Deliberate override, not a merge (review finding, 2026-09-22): the object
 * spread in {@link rewriteAuthServerMetadata} places this key AFTER
 * `...upstreamMetadata`, so if Clerk ever published its own `agent_auth`
 * key, this server's value would replace it rather than merge with it —
 * the same disposition `scopes_supported` already carries on this same
 * spread (MCP-345, ADR-113 resolution 3), for the same reason: this
 * document is the proxy's OWN self-description, not a forwarded upstream
 * message, so ADR-115's transparent-passthrough rule does not reach it.
 * Clerk does not today publish `agent_auth` — `upstreamAuthServerMetadataSchema`
 * above has no such field — so this is a stated policy for a field that
 * does not yet collide, not a currently-observed overwrite.
 *
 * Not exported: nothing outside this module needs the type by name —
 * {@link rewriteAuthServerMetadata}'s callers consume the value
 * structurally, the same way they already do for
 * {@link UpstreamAuthServerMetadata}'s other fields.
 */
interface AgentAuthMetadata {
  /** Absolute URL of this server's `/auth.md` document, on `localOrigin`. */
  readonly skill: string;
}

/** {@link UpstreamAuthServerMetadata} plus this server's own `agent_auth` block. */
type RewrittenAuthServerMetadata = UpstreamAuthServerMetadata & {
  readonly agent_auth: AgentAuthMetadata;
};

/** OAuth 2.0 error response per RFC 6749 Section 5.2. */
interface OAuthErrorResponse {
  readonly error: string;
  readonly error_description: string;
}

/**
 * Derives the upstream Clerk FAPI base URL from a publishable key.
 *
 * Uses {@link generateClerkProtectedResourceMetadata} to extract the
 * `authorization_servers[0]` entry, which is the FAPI domain for the
 * Clerk instance. This is a deterministic derivation with no network call.
 *
 * @param publishableKey - Clerk publishable key (`pk_test_...` or `pk_live_...`)
 * @returns The upstream FAPI base URL, e.g. `https://native-hippo-15.clerk.accounts.dev`
 * @throws If the key cannot be parsed or no authorization server is found
 */
export function deriveUpstreamOAuthBaseUrl(publishableKey: string): string {
  if (!publishableKey) {
    throw new Error('publishableKey is required to derive upstream OAuth base URL');
  }
  const prm = generateClerkProtectedResourceMetadata({ publishableKey, resourceUrl: '' });
  const url = prm.authorization_servers[0];
  if (!url) {
    throw new Error(
      'Could not derive upstream OAuth base URL from publishable key: no authorization_servers entry',
    );
  }
  const parsed = new URL(url);
  if (!parsed.hostname || parsed.hostname.length === 0) {
    throw new Error(
      `Derived upstream OAuth base URL has no hostname: ${url} (check publishable key format)`,
    );
  }
  return url;
}

/**
 * Constructs a full redirect URL for the upstream authorize endpoint.
 *
 * Appends all provided query parameters to the upstream authorize URL.
 * Parameters are forwarded transparently — the proxy does not filter
 * or transform any values.
 *
 * @param upstreamAuthorizeUrl - The upstream authorize endpoint URL
 * @param queryParams - Query parameters from the client's authorize request
 * @returns The full redirect URL with all parameters appended
 */
export function buildAuthorizeRedirectUrl(
  upstreamAuthorizeUrl: string,
  queryParams: URLSearchParams,
): string {
  const paramString = queryParams.toString();
  if (paramString.length === 0) {
    return upstreamAuthorizeUrl;
  }
  return `${upstreamAuthorizeUrl}?${paramString}`;
}

/**
 * Type guard validating that unknown data conforms to {@link UpstreamAuthServerMetadata}.
 * Uses Zod schema validation at the system boundary when fetching metadata
 * from upstream Clerk.
 */
export function isUpstreamAuthServerMetadata(value: unknown): value is UpstreamAuthServerMetadata {
  return upstreamAuthServerMetadataSchema.safeParse(value).success;
}

/**
 * Creates an OAuth 2.0 error response per RFC 6749 Section 5.2.
 *
 * @param error - The error code (e.g. `temporarily_unavailable`, `invalid_request`)
 * @param errorDescription - Human-readable description of the error
 * @returns Formatted error response object
 */
export function formatProxyErrorResponse(
  error: string,
  errorDescription: string,
): OAuthErrorResponse {
  return { error, error_description: errorDescription };
}

/**
 * Rewrites upstream AS metadata into the proxy authorization server's own
 * self-description (RFC 8414); the protected resource's self-description is
 * the PRM, served separately.
 *
 * Replaces `issuer`, `authorization_endpoint`, `token_endpoint`, and
 * `registration_endpoint` with proxy URLs on the local origin, and states
 * `scopes_supported` as the scopes this resource advertises — the same set
 * the protected-resource metadata publishes — rather than the upstream AS's
 * full list. Every other capability field passes through unchanged.
 *
 * @remarks
 * The invariant this keeps (MCP-345): the two discovery documents this
 * resource serves advertise the same scopes, so a client that derives its
 * request from either asks only for what the resource requires. Clerk's own
 * list names scopes Oak's default client grant does not carry, `openid` among
 * them, and a client that requests one of those is refused at sign-in; which
 * clients derive scopes from this document, and the measurement behind it,
 * are recorded in ADR-113 (Troubleshooting, resolution 3), not here.
 * This document is the proxy's self-description, already rewritten field by
 * field; it is not a forwarded OAuth message, so ADR-115's transparent
 * passthrough rule does not reach it.
 *
 * Also adds `agent_auth` (MCP-759): an additive RFC 8414 Section 2 field,
 * never subtracting from or altering any field above. `agent_auth.skill`
 * points at this server's own `/auth.md` on `localOrigin` — never a
 * placeholder, and never the upstream's origin, since `/auth.md` is this
 * server's route, not Clerk's.
 *
 * @param upstreamMetadata - The original AS metadata from Clerk
 * @param localOrigin - The proxy's origin, e.g. `http://localhost:3333`
 * @param advertisedScopes - The scopes to advertise as `scopes_supported`; the
 *   route passes the PRM's set
 * @returns Rewritten metadata with proxy endpoint URLs, advertised scopes,
 *   and the additive `agent_auth` block
 */
export function rewriteAuthServerMetadata(
  upstreamMetadata: UpstreamAuthServerMetadata,
  localOrigin: string,
  advertisedScopes: readonly string[],
): RewrittenAuthServerMetadata {
  return {
    ...upstreamMetadata,
    issuer: localOrigin,
    authorization_endpoint: `${localOrigin}/oauth/authorize`,
    token_endpoint: `${localOrigin}/oauth/token`,
    registration_endpoint: `${localOrigin}/oauth/register`,
    scopes_supported: [...advertisedScopes],
    agent_auth: { skill: `${localOrigin}${AUTH_MD_PATH}` },
  };
}
