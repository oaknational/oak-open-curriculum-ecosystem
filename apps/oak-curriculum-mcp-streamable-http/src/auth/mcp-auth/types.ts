/**
 * Type definitions for MCP authentication with Clerk.
 *
 * Re-exports external types from Clerk and the MCP SDK for use across the
 * auth module. Includes a global augmentation for Express Request that mirrors
 * the one in @clerk/express/env.d.ts (which TypeScript cannot auto-load from
 * declaration files not matched by tsconfig include patterns).
 */

import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import type { AuthObject } from '@clerk/backend';
import type { PendingSessionOptions } from '@clerk/shared/types';
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

/**
 * Express Request augmentation for Clerk's req.auth callable accessor.
 *
 * Mirrors @clerk/express/env.d.ts line-for-line. TypeScript cannot load
 * Clerk's ambient declaration automatically because declaration files are not
 * resolved by tsconfig include glob patterns. This augmentation ensures
 * req.auth is correctly typed as Clerk's callable accessor throughout the
 * application.
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- Required by TypeScript for Express.Request augmentation
  namespace Express {
    interface Request {
      /** Callable auth accessor set by Clerk's `clerkMiddleware()`. */
      auth: (options?: PendingSessionOptions) => AuthObject;
    }
  }
}
