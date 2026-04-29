/**
 * Pure functions supporting the OAuth proxy passthrough layer.
 *
 * These functions handle URL derivation, metadata rewriting, and error
 * formatting. None perform I/O. They exist to support the transparent
 * proxy — not to add validation or security logic of their own.
 *
 * @see docs/architecture/architectural-decisions/115-proxy-oauth-as-for-cursor.md
 */

import { generateClerkProtectedResourceMetadata } from '@clerk/mcp-tools/server';
import { z } from 'zod';

/**
 * Zod schema for RFC 8414 Authorization Server metadata as served by Clerk.
 *
 * Used at the system boundary when fetching metadata from upstream Clerk.
 * The four endpoint fields are rewritten by {@link rewriteAuthServerMetadata}
 * to point to the local proxy origin. Capability fields are passed through
 * unchanged from the upstream AS.
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
});

export type UpstreamAuthServerMetadata = z.infer<typeof upstreamAuthServerMetadataSchema>;

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
 * Rewrites upstream AS metadata endpoint URLs to point to the local proxy.
 *
 * Replaces `issuer`, `authorization_endpoint`, `token_endpoint`, and
 * `registration_endpoint` with proxy URLs on the local origin. All
 * capability fields including `scopes_supported` are passed through
 * unchanged from the upstream AS.
 *
 * @param upstreamMetadata - The original AS metadata from Clerk
 * @param localOrigin - The proxy's origin, e.g. `http://localhost:3333`
 * @returns Rewritten metadata with proxy endpoint URLs
 */
export function rewriteAuthServerMetadata(
  upstreamMetadata: UpstreamAuthServerMetadata,
  localOrigin: string,
): UpstreamAuthServerMetadata {
  return {
    ...upstreamMetadata,
    issuer: localOrigin,
    authorization_endpoint: `${localOrigin}/oauth/authorize`,
    token_endpoint: `${localOrigin}/oauth/token`,
    registration_endpoint: `${localOrigin}/oauth/register`,
  };
}
