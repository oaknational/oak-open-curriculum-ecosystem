/**
 * Served-origin resolution — the one place that answers "what address is
 * this deployment serving at?" for self-description surfaces that are fixed
 * per deployment: the landing page's og:url and endpoint snippet (baked at
 * build time), the tool-level auth-error resource URL (derived at the
 * composition root), and the registration-proof composition.
 *
 * Precedence, most-authoritative first:
 * 1. The configured canonical origin (`CANONICAL_HOST` resolved by
 *    `resolveCanonicalOrigin`) — configuration, never a request header.
 * 2. The Vercel display hostname (`getDisplayHostname` in
 *    `@oaknational/build-metadata`: production deployments name
 *    `VERCEL_PROJECT_PRODUCTION_URL`, previews name their own `VERCEL_URL`)
 *    — preview-correct by construction.
 * 3. Local development: `http://localhost:<PORT|3333>`.
 *
 * Per-REQUEST self-description surfaces (RFC 9728 PRM, RFC 8414 AS
 * metadata, `WWW-Authenticate` challenges) derive via `deriveSelfOrigin`
 * instead, validating the arriving Host against the allowlist. Two
 * derivation families, one rule each; nothing else computes "where is this
 * deployed" — two places computing it is two places to disagree.
 */

/**
 * The MCP endpoint path. RFC 8707 audience values and the published PRM
 * `resource` bind to exactly this path — never `req.originalUrl`, which
 * carries query strings the advertised resource does not (RFC 8707 §2:
 * resource URIs SHOULD NOT include a query component).
 */
export const MCP_RESOURCE_PATH = '/mcp';

/**
 * The local-development listen port when `PORT` is unset or empty. Shared
 * with `resolvePort` in `server-runtime.ts` so the port the server listens
 * on and the port it self-describes as can never diverge — both treat an
 * empty `PORT` as absent.
 */
export const DEFAULT_LOCAL_PORT = '3333';

/**
 * Inputs for {@link resolveServedOrigin}. All optional: an empty object is
 * the local-development deployment.
 */
export interface ServedOriginInputs {
  /**
   * Configured canonical origin (e.g. `https://mcp.thenational.academy`),
   * or `undefined` when no canonical host is configured.
   */
  readonly canonicalOrigin?: string;
  /**
   * Vercel display hostname, scheme-free (e.g. `my-app.vercel.app`), or
   * `undefined` off Vercel.
   */
  readonly displayHostname?: string;
  /** Local-dev listen port (`env.PORT`); defaults to `3333`. */
  readonly portEnv?: string;
}

/**
 * Resolves the origin this deployment serves itself from, with no trailing
 * slash.
 *
 * @example
 * ```typescript
 * resolveServedOrigin({ canonicalOrigin: 'https://mcp.thenational.academy' });
 * // 'https://mcp.thenational.academy'
 * resolveServedOrigin({ displayHostname: 'my-app.vercel.app' });
 * // 'https://my-app.vercel.app'
 * resolveServedOrigin({ portEnv: '4000' }); // 'http://localhost:4000'
 * resolveServedOrigin({}); // 'http://localhost:3333'
 * ```
 */
export function resolveServedOrigin(inputs: ServedOriginInputs): string {
  if (inputs.canonicalOrigin && inputs.canonicalOrigin.length > 0) {
    return inputs.canonicalOrigin;
  }
  if (inputs.displayHostname && inputs.displayHostname.length > 0) {
    return `https://${inputs.displayHostname}`;
  }
  const port = inputs.portEnv && inputs.portEnv.length > 0 ? inputs.portEnv : DEFAULT_LOCAL_PORT;
  return `http://localhost:${port}`;
}

/**
 * Resolves the absolute URL of the served MCP endpoint —
 * {@link resolveServedOrigin} plus {@link MCP_RESOURCE_PATH}.
 */
export function resolveServedMcpUrl(inputs: ServedOriginInputs): string {
  return `${resolveServedOrigin(inputs)}${MCP_RESOURCE_PATH}`;
}

/** The well-known prefix protected-resource metadata is published beneath. */
export const PROTECTED_RESOURCE_METADATA_PREFIX = '/.well-known/oauth-protected-resource';

/**
 * Resolves the absolute URL of the served protected-resource metadata.
 *
 * @remarks
 * MCP-511. The **path-qualified** form, per RFC 9728 §3.1: the resource path
 * is appended to the well-known prefix, so a resource at `/mcp` publishes its
 * metadata at `/.well-known/oauth-protected-resource/mcp`.
 *
 * The app answers the unqualified path too (see `auth-routes.ts`) as a
 * compatibility alias: the same handler serves both, so the documents are
 * identical, and both routes serve on the canonical deployment (verified
 * 2026-09-01: the canonical host fronts this app at its root as well as under
 * `/mcp*`). The path-qualified form is the one RFC 9728 §3.1 derives for a
 * resource at `/mcp` and the one that survives a path-scoped edge, so anything
 * that hands a human or a client a metadata URL uses this one; the alias
 * answers clients that construct the unqualified path themselves.
 */
export function resolveServedPrmUrl(inputs: ServedOriginInputs): string {
  return `${resolveServedOrigin(inputs)}${PROTECTED_RESOURCE_METADATA_PREFIX}${MCP_RESOURCE_PATH}`;
}
