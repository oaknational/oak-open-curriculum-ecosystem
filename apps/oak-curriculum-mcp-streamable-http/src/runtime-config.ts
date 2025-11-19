import { readEnv, type Env } from './env.js';

/**
 * Runtime configuration for the MCP HTTP server.
 *
 * This configuration is derived from environment variables and includes
 * deployment-specific settings from Vercel's system environment variables.
 */
export interface RuntimeConfig {
  /** Validated environment variables from env.ts */
  readonly env: Env;
  /** Whether to bypass authentication (local development only) */
  readonly dangerouslyDisableAuth: boolean;
  /** Whether to use stub tools instead of real API calls */
  readonly useStubTools: boolean;
  /** Application version from package.json */
  readonly version: string;
  /**
   * Collection of all Vercel deployment URLs.
   *
   * Includes all present URLs from:
   * - VERCEL_URL: Unique deployment URL (e.g., myapp-abc123.vercel.app)
   * - VERCEL_BRANCH_URL: Branch-specific URL (e.g., myapp-git-feat.vercel.app)
   * - VERCEL_PROJECT_PRODUCTION_URL: Production URL (e.g., myapp.vercel.app)
   *
   * All URLs are lowercased for consistent hostname matching.
   * Empty when not running on Vercel.
   *
   * @see https://vercel.com/docs/environment-variables/system-environment-variables
   */
  readonly vercelHostnames: readonly string[];
}

function toBooleanFlag(value: string | undefined): boolean {
  return value === 'true';
}

/**
 * Loads runtime configuration from environment variables.
 *
 * Collects all Vercel deployment URLs from system environment variables:
 * - VERCEL_URL: Unique deployment URL (e.g., myapp-abc123.vercel.app)
 * - VERCEL_BRANCH_URL: Branch-specific URL (e.g., myapp-git-feat.vercel.app)
 * - VERCEL_PROJECT_PRODUCTION_URL: Production URL (e.g., myapp.vercel.app)
 *
 * All URLs are lowercased for consistent hostname matching. Empty/undefined URLs
 * are filtered out. When not running on Vercel, vercelHostnames will be empty.
 *
 * @param source - Environment variables object, defaults to process.env.
 * @returns Runtime configuration with validated env and derived settings
 * @see https://vercel.com/docs/environment-variables/system-environment-variables
 */
/* eslint-disable-next-line no-restricted-syntax -- process.env is needed here to enable building the runtime config */
export function loadRuntimeConfig(source: NodeJS.ProcessEnv = process.env): RuntimeConfig {
  const env = readEnv(source);

  // Collect all Vercel deployment URLs
  const vercelHostnames = [
    source.VERCEL_URL,
    source.VERCEL_BRANCH_URL,
    source.VERCEL_PROJECT_PRODUCTION_URL,
  ]
    .filter((url): url is string => Boolean(url))
    .map((url) => url.toLowerCase());

  return {
    env,
    dangerouslyDisableAuth: toBooleanFlag(source.DANGEROUSLY_DISABLE_AUTH),
    useStubTools: toBooleanFlag(source.OAK_CURRICULUM_MCP_USE_STUB_TOOLS),
    version: source.npm_package_version ?? '0.0.0',
    vercelHostnames,
  };
}
