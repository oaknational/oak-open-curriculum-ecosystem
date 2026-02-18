import type express from 'express';
import { createApp } from '../../src/application.js';
import { loadRuntimeConfig } from '../../src/runtime-config.js';
import type { ToolHandlerOverrides } from '../../src/handlers.js';

export interface LiveHttpApp {
  readonly app: express.Express;
}

export interface CreateLiveHttpAppOptions {
  readonly overrides?: ToolHandlerOverrides;
  readonly envOverrides?: Partial<NodeJS.ProcessEnv>;
}

export function createLiveHttpApp(options?: CreateLiveHttpAppOptions): LiveHttpApp {
  // Create isolated env with live credentials
  const testEnv: NodeJS.ProcessEnv = {
    NODE_ENV: 'test',
    // Use real API key from environment or fallback
    OAK_API_KEY: process.env.OAK_API_KEY ?? 'live-mode-api-key',
    // Disable auth – live-mode E2E tests assert Oak API integration, not Clerk enforcement.
    // Auth coverage lives in auth-enforcement.e2e.test.ts and smoke-dev-auth.
    DANGEROUSLY_DISABLE_AUTH: 'true',
    // Clerk keys not needed when auth disabled, but set for completeness
    CLERK_PUBLISHABLE_KEY: 'pk_test_123',
    CLERK_SECRET_KEY: 'sk_test_123',
    ALLOWED_HOSTS: 'localhost,127.0.0.1,::1',
    ELASTICSEARCH_URL: 'http://fake-es:9200',
    ELASTICSEARCH_API_KEY: 'fake-api-key-for-e2e',
    ...options?.envOverrides,
  };

  const runtimeConfig = loadRuntimeConfig(testEnv);
  const app = createApp({ runtimeConfig, toolHandlerOverrides: options?.overrides });

  return { app };
}
