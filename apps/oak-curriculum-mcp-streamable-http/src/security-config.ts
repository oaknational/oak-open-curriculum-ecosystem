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
 * Smart behavior: uses explicit config if provided, all Vercel hosts in production,
 * or undefined in local dev (allows all).
 *
 * @param configured - Explicitly configured allowed origins from env
 * @param vercelHosts - Array of all Vercel deployment URLs (VERCEL_URL, VERCEL_BRANCH_URL, VERCEL_PROJECT_PRODUCTION_URL)
 * @returns Array of allowed origins, or undefined for local dev
 */
function resolveAutomaticOrigins(
  configured: readonly string[] | undefined,
  vercelHosts: readonly string[],
): readonly string[] | undefined {
  if (configured && configured.length > 0) {
    return configured;
  }
  if (vercelHosts.length > 0) {
    return vercelHosts.map((host) => `https://${host}`);
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
 *    - Uses all Vercel hosts in production (converted to https:// origins)
 *    - Returns undefined in local dev (allows all)
 *
 * @param mode - The CORS mode determining behavior
 * @param configured - Explicitly configured allowed origins from env
 * @param vercelHosts - Array of all Vercel deployment URLs (VERCEL_URL, VERCEL_BRANCH_URL, VERCEL_PROJECT_PRODUCTION_URL)
 * @returns Array of allowed origins, or undefined to enable allow_all mode
 * @see https://vercel.com/docs/environment-variables/system-environment-variables
 */
export function resolveAllowedOrigins(
  mode: CorsMode,
  configured: readonly string[] | undefined,
  vercelHosts: readonly string[],
): readonly string[] | undefined {
  if (mode === 'allow_all') {
    resolveAllowAll();
    return undefined;
  }
  if (mode === 'explicit') {
    return resolveExplicitOrigins(configured);
  }
  return resolveAutomaticOrigins(configured, vercelHosts);
}

/**
 * Creates security configuration for DNS rebinding protection and CORS.
 *
 * Derives allowed hosts and origins from environment configuration and Vercel
 * system environment variables. All Vercel deployment URLs are automatically
 * allowed when no explicit configuration is provided.
 *
 * @param config - Runtime configuration with env vars and Vercel hostnames
 * @returns Security configuration with allowed hosts, origins, and CORS mode
 */
export function createSecurityConfig(config: RuntimeConfig): {
  mode: 'stateless' | 'session';
  allowedHosts: readonly string[];
  allowedOrigins: readonly string[] | undefined;
  corsMode: CorsMode;
} {
  const mode = config.env.REMOTE_MCP_MODE === 'session' ? 'session' : 'stateless';
  const configuredHosts = parseCsv(config.env.ALLOWED_HOSTS);
  const configuredOrigins = parseCsv(config.env.ALLOWED_ORIGINS);
  const vercelHosts = config.vercelHostnames;
  const corsMode = resolveCorsMode(config.env.CORS_MODE);
  const allowedHosts = resolveAllowedHosts(configuredHosts, vercelHosts);
  const allowedOrigins = resolveAllowedOrigins(corsMode, configuredOrigins, vercelHosts);
  return { mode, allowedHosts, allowedOrigins, corsMode };
}
