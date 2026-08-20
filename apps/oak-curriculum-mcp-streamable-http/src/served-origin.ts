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
   * Configured canonical origin (e.g. `https://www.thenational.academy`),
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
 * resolveServedOrigin({ canonicalOrigin: 'https://www.thenational.academy' });
 * // 'https://www.thenational.academy'
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
