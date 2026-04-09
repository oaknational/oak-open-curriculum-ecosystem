/**
 * Type definitions for MCP authentication.
 *
 * Defines the `TokenVerifier` function type used by the generic `mcpAuth`
 * middleware. Provider-specific implementations (e.g. Clerk) satisfy this
 * contract.
 */

import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types';
import type { Request } from 'express';

/**
 * Function type for token verification.
 * Takes a token string and Express request, returns AuthInfo if valid or undefined if invalid.
 */
export type TokenVerifier = (token: string, req: Request) => Promise<AuthInfo | undefined>;
