/**
 * Verify Clerk OAuth token and extract authentication information.
 *
 * This function verifies a Clerk OAuth token and returns authentication information
 * in the format expected by the MCP SDK. It's a pure function with no side effects,
 * making it ideal for unit testing.
 *
 */

import type { MachineAuthObject } from '@clerk/backend';
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';

/**
 * Verifies a Clerk OAuth token and returns AuthInfo for the MCP SDK.
 *
 * This is a pure function that extracts authentication information from a Clerk
 * MachineAuthObject and formats it for the MCP SDK.
 *
 * Returns `undefined` for invalid or missing tokens (expected authentication failures).
 * Throws an error for programmer errors (e.g., wrong tokenType configuration).
 *
 * @param auth - The Clerk authentication object from `getAuth(req, { acceptsToken: 'oauth_token' })`
 * @param token - The OAuth token to verify
 * @returns AuthInfo if the token is valid, undefined if invalid or missing required fields
 * @throws Error if tokenType is not 'oauth_token' (programmer error)
 *
 * @example
 * ```typescript
 * const auth = await getAuth(req, { acceptsToken: 'oauth_token' });
 * const authInfo = verifyClerkToken(auth, token);
 * if (authInfo) {
 *   // Token is valid, use authInfo
 * } else {
 *   // Token is invalid, return 401
 * }
 * ```
 */
export function verifyClerkToken(
  auth: MachineAuthObject<'oauth_token'>,
  token: string | undefined,
): AuthInfo | undefined {
  // Token is required
  if (!token) {
    return undefined;
  }

  // Authentication must be successful
  if (!auth.isAuthenticated) {
    return undefined;
  }

  // Verify that getAuth was called with the correct tokenType
  // This is a programmer error, not an authentication failure

  if (auth.tokenType !== 'oauth_token') {
    throw new Error("the auth() function must be called with acceptsToken: 'oauth_token'");
  }

  // All required fields must be present
  // Clerk should always provide these when isAuthenticated is true,
  // but we check defensively

  if (!auth.clientId) {
    return undefined;
  }

  if (!auth.scopes) {
    return undefined;
  }

  if (!auth.userId) {
    return undefined;
  }

  // Return AuthInfo in the format expected by the MCP SDK
  return {
    token,
    scopes: auth.scopes,
    clientId: auth.clientId,
    extra: { userId: auth.userId },
  };
}
