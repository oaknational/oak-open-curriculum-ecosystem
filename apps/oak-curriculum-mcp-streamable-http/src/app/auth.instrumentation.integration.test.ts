import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { createApp } from '../application.js';
import { loadRuntimeConfig, type RuntimeConfig } from '../runtime-config.js';
import { createTestLogger } from './test-helpers/create-test-logger.js';

type StepName =
  | 'auth.disabled.register'
  | 'clerkMiddleware.create'
  | 'clerkMiddleware.install'
  | 'oauth.metadata.register'
  | 'mcp.auth.register';

function createRuntimeConfig(overrides: NodeJS.ProcessEnv = {}): RuntimeConfig {
  const baseEnv: NodeJS.ProcessEnv = {
    OAK_API_KEY: 'test-key',
    CLERK_PUBLISHABLE_KEY: 'pk_test_value',
    CLERK_SECRET_KEY: 'sk_test_value',
    BASE_URL: 'http://localhost:3333',
    MCP_CANONICAL_URI: 'http://localhost:3333/mcp',
  };
  return loadRuntimeConfig({ ...baseEnv, ...overrides });
}

function contextMatchesStep(context: unknown, step: StepName): boolean {
  if (typeof context !== 'object' || context === null || Array.isArray(context)) {
    return false;
  }
  return Reflect.get(context, 'step') === step;
}

describe('auth instrumentation', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.OAK_API_KEY = 'test-key';
    process.env.CLERK_PUBLISHABLE_KEY = 'pk_test_value';
    process.env.CLERK_SECRET_KEY = 'sk_test_value';
    process.env.BASE_URL = 'http://localhost:3333';
    process.env.MCP_CANONICAL_URI = 'http://localhost:3333/mcp';
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('logs instrumentation when auth is disabled', () => {
    const { logger, entries } = createTestLogger();
    const runtimeConfig = createRuntimeConfig({ DANGEROUSLY_DISABLE_AUTH: 'true' });

    createApp({ runtimeConfig, logger });

    const startEntry = entries.find(
      (entry) =>
        entry.message === 'auth.bootstrap.step.start' &&
        contextMatchesStep(entry.context, 'auth.disabled.register'),
    );
    expect(startEntry).toBeDefined();

    const finishEntry = entries.find(
      (entry) =>
        entry.message === 'auth.bootstrap.step.finish' &&
        contextMatchesStep(entry.context, 'auth.disabled.register'),
    );
    expect(finishEntry).toBeDefined();

    const errorEntry = entries.find((entry) => entry.message === 'auth.bootstrap.step.error');
    expect(errorEntry).toBeUndefined();
  });

  it('logs instrumentation for Clerk-enabled auth setup', () => {
    const { logger, entries } = createTestLogger();
    const runtimeConfig = createRuntimeConfig({ DANGEROUSLY_DISABLE_AUTH: 'false' });

    createApp({ runtimeConfig, logger });

    const expectedSteps: StepName[] = [
      'clerkMiddleware.create',
      'clerkMiddleware.install',
      'oauth.metadata.register',
      'mcp.auth.register',
    ];

    for (const step of expectedSteps) {
      const startEntry = entries.find(
        (entry) =>
          entry.message === 'auth.bootstrap.step.start' && contextMatchesStep(entry.context, step),
      );
      expect(startEntry).toBeDefined();
      const finishEntry = entries.find(
        (entry) =>
          entry.message === 'auth.bootstrap.step.finish' && contextMatchesStep(entry.context, step),
      );
      expect(finishEntry).toBeDefined();
    }

    const errorEntry = entries.find((entry) => entry.message === 'auth.bootstrap.step.error');
    expect(errorEntry).toBeUndefined();
  });
});
