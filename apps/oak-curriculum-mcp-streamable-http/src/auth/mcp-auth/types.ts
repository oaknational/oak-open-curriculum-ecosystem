/**
 * Type definitions for MCP authentication with Clerk.
 *
 * This module provides TypeScript type definitions for the MCP authentication
 * middleware, including declaration merging for Express Request objects and
 * re-exports of external types from Clerk and the MCP SDK.
 *
 * @module auth/mcp-auth/types
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

/**
 * Augment Express Request interface to include auth property.
 * This declaration merging allows TypeScript to recognize req.auth throughout the application.
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- Required for Express Request augmentation
  namespace Express {
    interface Request {
      /**
       * Authentication information attached to the request after successful OAuth token verification.
       * Contains token, scopes, clientId, and optional extra data like userId.
       */
      auth?: AuthInfo;
    }
  }
}
