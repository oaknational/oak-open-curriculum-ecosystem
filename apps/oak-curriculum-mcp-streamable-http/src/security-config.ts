import { parseCsv } from './env.js';
import type { RuntimeConfig } from './runtime-config.js';

const BASE_HOSTS = ['localhost', '127.0.0.1', '::1'] as const;

/**
 * Resolves the list of allowed hostnames for DNS rebinding protection.
 *
 * Priority:
 * 1. Explicitly configured hosts (if provided, use only these)
 * 2. All Vercel deployment URLs + BASE_HOSTS (when deployed on Vercel)
 * 3. BASE_HOSTS only (local development)
 *
 * @param configured - Explicitly configured allowed hosts from ALLOWED_HOSTS env var
 * @param vercelHosts - Array of all Vercel deployment URLs (VERCEL_URL, VERCEL_BRANCH_URL, VERCEL_PROJECT_PRODUCTION_URL)
 * @returns Array of allowed hostnames for DNS rebinding protection
 * @see https://vercel.com/docs/environment-variables/system-environment-variables
 */
export function resolveAllowedHosts(
  configured: readonly string[] | undefined,
  vercelHosts: readonly string[],
): readonly string[] {
  if (configured && configured.length > 0) {
    return configured;
  }
  if (vercelHosts.length > 0) {
    return Array.from(new Set([...vercelHosts, ...BASE_HOSTS]));
  }
  return BASE_HOSTS;
}

/**
 * Security configuration for DNS rebinding protection and transport mode.
 *
 * CORS is unconditionally permissive — all origins are allowed. This is the
 * correct posture for an OAuth-protected MCP server: security is enforced by
 * Bearer token authentication, not by origin restrictions. Browser-based MCP
 * clients (e.g. ChatGPT web) and future MCP Apps need cross-origin access.
 *
 * @param config - Runtime configuration with env vars and Vercel hostnames
 * @returns Security configuration with allowed hosts and transport mode
 */
export function createSecurityConfig(config: RuntimeConfig): {
  mode: 'stateless' | 'session';
  allowedHosts: readonly string[];
} {
  const mode = config.env.REMOTE_MCP_MODE === 'session' ? 'session' : 'stateless';
  const configuredHosts = parseCsv(config.env.ALLOWED_HOSTS);
  const vercelHosts = config.vercelHostnames;
  const allowedHosts = resolveAllowedHosts(configuredHosts, vercelHosts);
  return { mode, allowedHosts };
}
