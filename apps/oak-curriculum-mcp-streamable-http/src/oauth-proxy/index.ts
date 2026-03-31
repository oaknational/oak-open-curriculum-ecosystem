/**
 * OAuth proxy passthrough layer.
 *
 * Proxies OAuth operations to Clerk so that the MCP resource server and
 * authorization server appear on the same origin, working around a Cursor
 * client bug. This is NOT a service — it is a transparent passthrough that
 * must not alter, filter, or lose information in either direction.
 *
 * @see docs/architecture/architectural-decisions/115-proxy-oauth-as-for-cursor.md
 */

export {
  createOAuthProxyRoutes,
  type OAuthProxyConfig,
  type CreateOAuthProxyRoutesOptions,
} from './oauth-proxy-routes.js';
export {
  deriveUpstreamOAuthBaseUrl,
  rewriteAuthServerMetadata,
  isUpstreamAuthServerMetadata,
  type UpstreamAuthServerMetadata,
  type OAuthErrorResponse,
} from './oauth-proxy-upstream.js';
