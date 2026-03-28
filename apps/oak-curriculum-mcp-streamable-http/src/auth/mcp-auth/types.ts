/**
 * Type definitions for MCP authentication with Clerk.
 *
 * Re-exports external types from Clerk and the MCP SDK for use across the
 * auth module.
 *
 * Note: This module previously included a global Express.Request augmentation
 * declaring `req.auth` as Clerk's callable accessor. That augmentation was
 * removed because it conflicted with the MCP SDK's own augmentation (which
 * types `req.auth` as `AuthInfo` data). Clerk does not actually declare a
 * global augmentation — it uses `ExpressRequestWithAuth` as a standalone
 * intersection type. Production code uses `getAuth(req)` from `@clerk/express`
 * which handles the callable accessor internally; no code directly calls
 * `req.auth()`.
 */

import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import type { Request } from 'express';

/**
 * Re-export AuthInfo type from MCP SDK.
 * Represents the authentication information stored on the request after successful authentication.
 */
export type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';

/**
 * Re-export MachineAuthObject type from Clerk backend.
 * Represents the authentication object returned by Clerk's getAuth() function.
 */
export type { MachineAuthObject } from '@clerk/backend';

/**
 * Function type for token verification.
 * Takes a token string and Express request, returns AuthInfo if valid or undefined if invalid.
 */
export type TokenVerifier = (token: string, req: Request) => Promise<AuthInfo | undefined>;
