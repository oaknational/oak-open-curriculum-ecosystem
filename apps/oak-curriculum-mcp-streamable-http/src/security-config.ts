import { parseCsv } from './env.js';
import type { RuntimeConfig } from './runtime-config.js';

const BASE_HOSTS = ['localhost', '127.0.0.1', '::1'] as const;

/**
 * CORS mode determines how origin access control is applied.
 *
 * - 'allow_all': Permits all origins (useful for development/testing)
 * - 'explicit': Only allows origins from ALLOWED_ORIGINS env var
 * - 'automatic': Smart default (all origins in dev, self-only in Vercel)
 */
export type CorsMode = 'allow_all' | 'explicit' | 'automatic';

/**
 * Resolves the CORS mode from configuration, defaulting to 'automatic'.
 *
 * @param configuredMode - The CORS_MODE value from environment
 * @returns The resolved CORS mode
 */
export function resolveCorsMode(configuredMode: string | undefined): CorsMode {
  if (!configuredMode || configuredMode === '') {
    return 'automatic';
  }
  if (
    configuredMode === 'allow_all' ||
    configuredMode === 'explicit' ||
    configuredMode === 'automatic'
  ) {
    return configuredMode;
  }
  return 'automatic';
}

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
 * Resolves allowed origins for 'allow_all' mode.
 * Always returns undefined to permit all origins.
 *
 * @returns undefined (enables allow_all CORS)
 */
function resolveAllowAll(): undefined {
  return undefined;
}

/**
 * Resolves allowed origins for 'explicit' mode.
 * Returns configured origins, or empty array to block all if none provided.
 *
 * @param configured - Explicitly configured allowed origins from env
 * @returns Array of allowed origins, or empty array to block all
 */
function resolveExplicitOrigins(configured: readonly string[] | undefined): readonly string[] {
  if (configured && configured.length > 0) {
    return configured;
  }
  return []; // Block all origins
}

/**
 * Resolves allowed origins for 'automatic' mode.
 * Smart behavior: uses explicit config if provided, Vercel host in production,
 * or undefined in local dev (allows all).
 *
 * @param configured - Explicitly configured allowed origins from env
 * @param vercelHost - Vercel deployment hostname (from VERCEL_URL)
 * @returns Array of allowed origins, or undefined for local dev
 */
function resolveAutomaticOrigins(
  configured: readonly string[] | undefined,
  vercelHost: string | undefined,
): readonly string[] | undefined {
  if (configured && configured.length > 0) {
    return configured;
  }
  if (vercelHost && vercelHost.length > 0) {
    return [`https://${vercelHost}`];
  }
  return undefined; // Local dev - allow all
}

/**
 * Resolves the allowed origins for CORS configuration based on the mode.
 *
 * Three modes:
 * 1. 'allow_all' - Always returns undefined (permits all origins)
 * 2. 'explicit' - Returns configured origins, or empty array (blocks all) if none
 * 3. 'automatic' - Smart behavior:
 *    - Uses explicit config if provided
 *    - Uses Vercel host in production
 *    - Returns undefined in local dev (allows all)
 *
 * @param mode - The CORS mode determining behavior
 * @param configured - Explicitly configured allowed origins from env
 * @param vercelHost - Vercel deployment hostname (from VERCEL_URL)
 * @returns Array of allowed origins, or undefined to enable allow_all mode
 */
export function resolveAllowedOrigins(
  mode: CorsMode,
  configured: readonly string[] | undefined,
  vercelHost: string | undefined,
): readonly string[] | undefined {
  if (mode === 'allow_all') {
    resolveAllowAll();
    return undefined;
  }
  if (mode === 'explicit') {
    return resolveExplicitOrigins(configured);
  }
  return resolveAutomaticOrigins(configured, vercelHost);
}

export function createSecurityConfig(config: RuntimeConfig): {
  mode: 'stateless' | 'session';
  allowedHosts: readonly string[];
  allowedOrigins: readonly string[] | undefined;
  corsMode: CorsMode;
} {
  const mode = config.env.REMOTE_MCP_MODE === 'session' ? 'session' : 'stateless';
  const configuredHosts = parseCsv(config.env.ALLOWED_HOSTS);
  const configuredOrigins = parseCsv(config.env.ALLOWED_ORIGINS);
  const vercelHost = config.vercelHostname;
  const corsMode = resolveCorsMode(config.env.CORS_MODE);
  const allowedHosts = resolveAllowedHosts(configuredHosts, vercelHost);
  const allowedOrigins = resolveAllowedOrigins(corsMode, configuredOrigins, vercelHost);
  return { mode, allowedHosts, allowedOrigins, corsMode };
}
