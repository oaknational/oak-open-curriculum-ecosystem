/**
 * Local Live with Auth Enforcement Mode
 *
 * Configuration: dev + live + auth (production-equivalent)
 * This mode tests the server with auth enforcement enabled, mirroring production.
 */

import type { PrepareEnvironmentOptions, PreparedEnvironment, LoadedEnvResult } from '../types.js';
import { getServerPort, startSmokeServer } from '../local-server.js';

/**
 * Validates Oak API key is present
 */
function validateApiKey(envLoad: LoadedEnvResult): void {
  const apiKey = process.env.OAK_API_KEY;
  if (!apiKey || apiKey.trim().length === 0) {
    const sourceHint =
      envLoad.loaded && envLoad.path
        ? `loadRootEnv loaded ${envLoad.path}`
        : 'loadRootEnv did not load a .env file';
    throw new Error(
      `OAK_API_KEY is required for live smoke tests. ${sourceHint}. Repository root: ${envLoad.repoRoot}`,
    );
  }
}

/**
 * Validates Clerk publishable key is present
 */
function validateClerkPublicKey(): void {
  const clerkPubKey = process.env.CLERK_PUBLISHABLE_KEY;
  if (!clerkPubKey || clerkPubKey.trim().length === 0) {
    throw new Error('CLERK_PUBLISHABLE_KEY is required for auth enforcement smoke tests');
  }
}

/**
 * Validates Clerk secret key is present
 */
function validateClerkSecretKey(): void {
  const clerkSecretKey = process.env.CLERK_SECRET_KEY;
  if (!clerkSecretKey || clerkSecretKey.trim().length === 0) {
    throw new Error('CLERK_SECRET_KEY is required for auth enforcement smoke tests');
  }
}

/**
 * Validates required environment variables for auth enforcement mode
 */
function validateRequiredEnvVars(envLoad: LoadedEnvResult): void {
  validateApiKey(envLoad);
  validateClerkPublicKey();
  validateClerkSecretKey();
}

export async function prepareLocalLiveAuthEnvironment(
  options: PrepareEnvironmentOptions,
  envLoad: LoadedEnvResult,
): Promise<PreparedEnvironment> {
  // Configure for production-equivalent auth
  delete process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS;
  delete process.env.DANGEROUSLY_DISABLE_AUTH; // Auth ENABLED (this is the test!)
  process.env.PORT = String(options.port);
  process.env.LOG_LEVEL = 'debug'; // Enable debug logging to diagnose auth issues

  // Verify required environment variables
  validateRequiredEnvVars(envLoad);

  // Log configuration for debugging
  console.log('[local-live-auth] Environment configuration:', {
    DANGEROUSLY_DISABLE_AUTH: process.env.DANGEROUSLY_DISABLE_AUTH,
    CLERK_PUBLISHABLE_KEY_SET: !!process.env.CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY_SET: !!process.env.CLERK_SECRET_KEY,
  });

  const server = await startSmokeServer(options.port);
  const port = getServerPort(server);

  return {
    baseUrl: `http://localhost:${String(port)}`,
    devToken: undefined, // No bypass token - auth is enforced
    envLoad,
    server,
    devTokenSource: 'not-required', // Auth enforcement mode
  };
}
