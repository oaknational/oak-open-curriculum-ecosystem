import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createApp } from './application.js';

/**
 * Integration tests for OAuth metadata route registration code paths.
 *
 * These tests verify that the route registration code executes without errors.
 * They test code integration (whether registration code runs), not running systems.
 *
 * Note: Express lazily initializes its internal router, so we cannot inspect
 * registered routes without triggering HTTP requests (which would be IO).
 * Instead, we verify the code path executes successfully.
 *
 * The actual HTTP behavior of these routes is tested in E2E tests.
 */

describe('OAuth Metadata Endpoints - Code Integration', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Set minimum required env for app to start
    process.env.OAK_API_KEY = 'test-key';
    process.env.CLERK_PUBLISHABLE_KEY = 'pk_test_bmF0aXZlLWhpcHBvLTE1LmNsZXJrLmFjY291bnRzLmRldiQ';
    process.env.CLERK_SECRET_KEY = 'sk_test_' + 'x'.repeat(40);
    process.env.BASE_URL = 'http://localhost:3333';
    process.env.MCP_CANONICAL_URI = 'http://localhost:3333/mcp';
    delete process.env.DANGEROUSLY_DISABLE_AUTH;
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('successfully creates app with OAuth metadata routes when auth is enabled', () => {
    // This tests that the setupAuthRoutes code path executes without throwing
    // when auth is enabled, which includes registering OAuth metadata endpoints
    expect(() => createApp()).not.toThrow();

    const app = createApp();
    expect(app).toBeDefined();
  });

  it('successfully creates app without OAuth metadata routes when auth is disabled', () => {
    process.env.DANGEROUSLY_DISABLE_AUTH = 'true';

    // This tests that the auth-disabled code path executes without throwing
    // and does not attempt to register OAuth metadata endpoints
    expect(() => createApp()).not.toThrow();

    const app = createApp();
    expect(app).toBeDefined();
  });

  it('oauth metadata registration code integrates with auth setup without conflicts', () => {
    // Tests that setupGlobalAuthContext() and setupAuthRoutes() work together
    // This verifies the integration between:
    // 1. Global clerkMiddleware registration (setupGlobalAuthContext)
    // 2. OAuth metadata endpoint registration (registerOAuthMetadataEndpoints)
    // 3. MCP route protection (registerAuthenticatedRoutes)

    expect(() => {
      const app = createApp();
      // If there were conflicts in registration order or middleware wrapping,
      // this would throw during app creation
      return app;
    }).not.toThrow();
  });
});
