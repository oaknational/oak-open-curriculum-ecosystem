/**
 * Authentication test fixtures for mocking Clerk behavior
 * These fixtures allow testing our auth handling without external Clerk service
 */

import type { Request } from 'express';

/**
 * Defines an authentication test scenario with setup and expected outcomes
 */
export interface AuthScenario {
  /**
   * Unique identifier for this scenario
   */
  name: string;
  /**
   * Human-readable description of what this scenario tests
   */
  description: string;
  /**
   * Function that configures the request for this scenario
   */
  setupRequest: (req: Partial<Request>) => void;
  /**
   * Expected HTTP status code
   */
  expectedStatus: 200 | 401;
  /**
   * Expected authentication state after middleware processing
   */
  expectedAuthState: 'authenticated' | 'unauthenticated';
}

/**
 * Predefined authentication test scenarios covering common cases
 */
export const AUTH_SCENARIOS: readonly AuthScenario[] = [
  {
    name: 'valid-bearer-token',
    description: 'Valid Bearer token in Authorization header',
    setupRequest: (req) => {
      req.headers = {
        ...req.headers,
        authorization: 'Bearer valid-test-token-12345',
      };
    },
    expectedStatus: 200,
    expectedAuthState: 'authenticated',
  },
  {
    name: 'missing-auth-header',
    description: 'No Authorization header present',
    setupRequest: (req) => {
      req.headers = { ...req.headers };
      delete req.headers.authorization;
    },
    expectedStatus: 401,
    expectedAuthState: 'unauthenticated',
  },
  {
    name: 'invalid-bearer-token',
    description: 'Invalid Bearer token',
    setupRequest: (req) => {
      req.headers = {
        ...req.headers,
        authorization: 'Bearer invalid-token-xyz',
      };
    },
    expectedStatus: 401,
    expectedAuthState: 'unauthenticated',
  },
  {
    name: 'malformed-auth-header',
    description: 'Authorization header not in Bearer format',
    setupRequest: (req) => {
      req.headers = {
        ...req.headers,
        authorization: 'NotBearer some-value',
      };
    },
    expectedStatus: 401,
    expectedAuthState: 'unauthenticated',
  },
  {
    name: 'expired-token',
    description: 'Bearer token that has expired',
    setupRequest: (req) => {
      req.headers = {
        ...req.headers,
        authorization: 'Bearer expired-token-12345',
      };
    },
    expectedStatus: 401,
    expectedAuthState: 'unauthenticated',
  },
] as const;
