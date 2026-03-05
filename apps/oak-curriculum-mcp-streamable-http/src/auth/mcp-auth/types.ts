/**
 * Type definitions for MCP authentication with Clerk.
 *
 * This module provides TypeScript type definitions for the MCP authentication
 * middleware, including declaration merging for Express Request objects and
 * re-exports of external types from Clerk and the MCP SDK.
 *
 */

import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import type { AuthObject } from '@clerk/backend';
import type { PendingSessionOptions } from '@clerk/types';
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
 * Callable Clerk auth accessor attached to Express Request by clerkMiddleware().
 * Runtime contract: Clerk's getAuth() reads req.auth and invokes it.
 */
export type ClerkRequestAuth = (options?: PendingSessionOptions) => AuthObject;

/**
 * Function type for token verification.
 * Takes a token string and Express request, returns AuthInfo if valid or undefined if invalid.
 */
export type TokenVerifier = (token: string, req: Request) => Promise<AuthInfo | undefined>;

/**
 * Augment Express Request interface to include auth property from Clerk.
 * This declaration merging allows TypeScript to recognize req.auth throughout the application.
 * Clerk's clerkMiddleware() sets this to a callable auth accessor.
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- Required for Express Request augmentation
  namespace Express {
    interface Request {
      /**
       * Authentication context set by Clerk's clerkMiddleware().
       * getAuth(req) invokes this callable to resolve auth state.
       */
      auth?: ClerkRequestAuth;
    }
  }
}
