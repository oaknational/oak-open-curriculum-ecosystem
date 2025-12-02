import { describe, it, expect } from 'vitest';
import { isDiscoveryMethod } from './mcp-method-classifier.js';
import { testShouldSkipClerkMiddleware } from './conditional-clerk-middleware.js';

/**
 * Synchronization tests for discovery methods across middleware layers.
 *
 * ## Why This Test Exists
 *
 * The MCP server has TWO places that need to agree on which methods skip auth:
 *
 * 1. **conditional-clerk-middleware.ts** - Skips Clerk context setup for discovery methods
 * 2. **mcp-method-classifier.ts** - Used by MCP router to skip auth enforcement
 *
 * If these get out of sync, the failure mode is:
 * - Clerk middleware skipped → `getAuth()` not available
 * - MCP router doesn't recognize method as discovery → falls through to auth
 * - Auth middleware calls `getAuth()` → CRASH: "clerkMiddleware should be registered"
 *
 * This is exactly the bug that occurred with `notifications/initialized`:
 * - conditional-clerk-middleware.ts had it in CLERK_SKIP_METHODS
 * - mcp-method-classifier.ts did NOT have it in DISCOVERY_METHODS
 * - Result: Unhandled Rejection in production
 *
 * ## Test Strategy
 *
 * These tests verify that any method that skips Clerk is also recognized
 * as a discovery method by the MCP router. The two lists MUST stay in sync.
 *
 * @see ADR-056 - Conditional Clerk Middleware for Discovery
 */

/**
 * MCP methods that should skip auth at both layers.
 * This list must match both:
 * - CLERK_SKIP_METHODS in conditional-clerk-middleware.ts
 * - DISCOVERY_METHODS in mcp-method-classifier.ts
 */
const EXPECTED_DISCOVERY_METHODS = [
  'initialize',
  'tools/list',
  'resources/list',
  'prompts/list',
  'resources/templates/list',
  'notifications/initialized',
] as const;

describe('Discovery Methods Synchronization', () => {
  describe('conditional-clerk-middleware and mcp-method-classifier must agree', () => {
    EXPECTED_DISCOVERY_METHODS.forEach((method) => {
      it(`${method}: Clerk skip and isDiscoveryMethod should both return true`, () => {
        // Create a mock request for the /mcp path with this method
        const mockRequest = { path: '/mcp', body: { method } };

        const clerkSkips = testShouldSkipClerkMiddleware(mockRequest);
        const isDiscovery = isDiscoveryMethod(method);

        // Both must agree - if Clerk is skipped, router must also skip auth
        expect(clerkSkips).toBe(true);
        expect(isDiscovery).toBe(true);

        // Explicit synchronization check
        expect(
          clerkSkips === isDiscovery,
          `Synchronization error for "${method}": ` +
            `clerkSkips=${String(clerkSkips)}, isDiscovery=${String(isDiscovery)}. ` +
            `If Clerk skips but router requires auth, getAuth() will throw.`,
        ).toBe(true);
      });
    });
  });

  describe('execution methods should require auth at both layers', () => {
    const executionMethods = ['tools/call', 'resources/read', 'prompts/get', 'unknown/method'];

    executionMethods.forEach((method) => {
      it(`${method}: should NOT be skipped by Clerk (requires auth)`, () => {
        const mockRequest = { path: '/mcp', body: { method } };

        const clerkSkips = testShouldSkipClerkMiddleware(mockRequest);
        const isDiscovery = isDiscoveryMethod(method);

        // Both should require auth (not skip)
        expect(clerkSkips).toBe(false);
        expect(isDiscovery).toBe(false);
      });
    });
  });

  describe('critical synchronization invariant', () => {
    it('if Clerk is skipped for /mcp, isDiscoveryMethod must return true', () => {
      // This test explicitly checks the invariant that caused the production bug.
      // For any method where Clerk middleware is skipped on /mcp,
      // the MCP router MUST also recognize it as discovery.

      // Test with all discovery methods
      EXPECTED_DISCOVERY_METHODS.forEach((method) => {
        const mockRequest = { path: '/mcp', body: { method } };
        const clerkSkips = testShouldSkipClerkMiddleware(mockRequest);

        if (clerkSkips) {
          expect(
            isDiscoveryMethod(method),
            `CRITICAL: Clerk skips "${method}" but MCP router does not recognize it as discovery. ` +
              `This will cause getAuth() to throw in production!`,
          ).toBe(true);
        }
      });
    });
  });
});
