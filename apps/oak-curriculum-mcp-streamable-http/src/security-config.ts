import { parseCsv } from './env.js';
import { resolveCanonicalOrigin } from './canonical-origin.js';
import type { RuntimeConfig } from './runtime-config.js';

const BASE_HOSTS = ['localhost', '127.0.0.1', '::1'] as const;

/**
 * Resolves the list of allowed hostnames for DNS rebinding protection.
 *
 * `ALLOWED_HOSTS` is **additive**: configured hosts are unioned with the
 * platform-derived hosts, never substituted for them. The variable can name a
 * host; it cannot take one away. Setting it therefore stays safe as the
 * platform's own hostnames change — `VERCEL_URL` is the *generated deployment*
 * URL and is a different value on every deployment, so a hand-written list
 * that replaced the derived set would be correct when written and wrong at the
 * next deploy.
 *
 * The result always contains `BASE_HOSTS`, so it is never empty — which
 * matters because `dnsRebindingProtection` reads an empty allow-list as "allow
 * every host". That guard is mounted on no route since 2026-08-20 (MCP-650),
 * so the property is currently exercised only by the guard's own suite; it
 * binds again as soon as MCP-650 gives the guard a home.
 *
 * This list also gates `deriveSelfOrigin`, so it bounds which Host a request
 * may be self-described from. Narrowing self-description is `CANONICAL_HOST`'s
 * job, never this variable's: `deriveSelfOrigin` returns the canonical origin
 * before it ever consults the allow-list.
 *
 * @param configured - Additional allowed hosts from the ALLOWED_HOSTS env var
 * @param vercelHosts - Array of all Vercel deployment URLs (VERCEL_URL, VERCEL_BRANCH_URL, VERCEL_PROJECT_PRODUCTION_URL)
 * @returns Deduplicated array of allowed hostnames, bounding self-origin
 *   derivation and the DNS-rebinding guard
 * @see https://vercel.com/docs/environment-variables/system-environment-variables
 */
export function resolveAllowedHosts(
  configured: readonly string[] | undefined,
  vercelHosts: readonly string[],
): readonly string[] {
  return Array.from(new Set([...(configured ?? []), ...vercelHosts, ...BASE_HOSTS]));
}

/**
 * Security configuration for DNS rebinding protection and transport mode.
 *
 * CORS is unconditionally permissive — all origins are allowed. This is the
 * correct posture for an OAuth-protected MCP server: security is enforced by
 * Bearer token authentication, not by origin restrictions. Browser-based MCP
 * clients and MCP Apps hosts need cross-origin access.
 *
 * @param config - Runtime configuration with env vars and Vercel hostnames
 * @returns Security configuration with allowed hosts and transport mode
 */
export function createSecurityConfig(config: RuntimeConfig): {
  mode: 'stateless' | 'session';
  allowedHosts: readonly string[];
  canonicalOrigin?: string;
} {
  const mode = config.env.REMOTE_MCP_MODE === 'session' ? 'session' : 'stateless';
  const configuredHosts = parseCsv(config.env.ALLOWED_HOSTS);
  const vercelHosts = config.vercelHostnames;
  const allowedHosts = resolveAllowedHosts(configuredHosts, vercelHosts);
  const canonicalOrigin = resolveCanonicalOrigin(config.env.CANONICAL_HOST);
  return { mode, allowedHosts, ...(canonicalOrigin ? { canonicalOrigin } : {}) };
}
