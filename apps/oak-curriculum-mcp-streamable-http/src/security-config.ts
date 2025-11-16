import { parseCsv } from './env.js';
import type { RuntimeConfig } from './runtime-config.js';

const BASE_HOSTS = ['localhost', '127.0.0.1', '::1'] as const;

function resolveAllowedHosts(
  configured: readonly string[] | undefined,
  vercelHost: string | undefined,
): readonly string[] {
  if (configured && configured.length > 0) {
    return configured;
  }
  if (vercelHost) {
    return Array.from(new Set([vercelHost, ...BASE_HOSTS]));
  }
  return BASE_HOSTS;
}

/**
 * Resolves the allowed origins for CORS configuration.
 *
 * Priority order:
 * 1. Explicit configuration (ALLOWED_ORIGINS env var) - highest priority
 * 2. Vercel deployment (VERCEL_URL env var) - production security
 * 3. Undefined - local development, enables allow-all CORS for good DX
 *
 * @param configured - Explicitly configured allowed origins from env
 * @param vercelHost - Vercel deployment hostname (from VERCEL_URL)
 * @returns Array of allowed origins, or undefined to enable allow-all mode
 */
export function resolveAllowedOrigins(
  configured: readonly string[] | undefined,
  vercelHost: string | undefined,
): readonly string[] | undefined {
  if (configured && configured.length > 0) {
    return configured;
  }
  if (vercelHost && vercelHost.length > 0) {
    return [`https://${vercelHost}`];
  }
  return undefined;
}

export function createSecurityConfig(config: RuntimeConfig): {
  mode: 'stateless' | 'session';
  allowedHosts: readonly string[];
  allowedOrigins: readonly string[] | undefined;
} {
  const mode = config.env.REMOTE_MCP_MODE === 'session' ? 'session' : 'stateless';
  const configuredHosts = parseCsv(config.env.ALLOWED_HOSTS);
  const configuredOrigins = parseCsv(config.env.ALLOWED_ORIGINS);
  const vercelHost = config.vercelHostname;
  const allowedHosts = resolveAllowedHosts(configuredHosts, vercelHost);
  const allowedOrigins = resolveAllowedOrigins(configuredOrigins, vercelHost);
  return { mode, allowedHosts, allowedOrigins };
}
