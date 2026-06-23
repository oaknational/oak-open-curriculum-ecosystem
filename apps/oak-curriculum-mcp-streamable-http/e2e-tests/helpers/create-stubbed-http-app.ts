import type express from 'express';
import { createApp } from '../../src/application.js';
import {
  createMockObservability,
  createMockRuntimeConfig,
  createNoOpRateLimiterFactory,
} from './test-config.js';

export const STUB_ACCEPT_HEADER = 'application/json, text/event-stream';
const STUB_API_KEY = 'stub-api-key';

export interface StubbedHttpApp {
  readonly app: express.Express;
}

export async function createStubbedHttpApp(
  envOverrides: Partial<NodeJS.ProcessEnv> = {},
  options: { readonly userSearchEnabled?: boolean } = {},
): Promise<StubbedHttpApp> {
  const runtimeConfig = createMockRuntimeConfig({
    dangerouslyDisableAuth: true,
    useStubTools: true,
    // Only override the fixture default (OFF) when a test opts in to the
    // user-search surface; omitting it keeps the production-honest default.
    ...(options.userSearchEnabled === undefined
      ? {}
      : { userSearchEnabled: options.userSearchEnabled }),
    env: {
      OAK_API_KEY: STUB_API_KEY,
      ALLOWED_HOSTS: 'localhost,127.0.0.1,::1',
      ...envOverrides,
    },
  });
  const observability = createMockObservability(runtimeConfig);
  const app = await createApp({
    runtimeConfig,
    observability,
    getWidgetHtml: () => '<!doctype html><html><body>stub-widget</body></html>',
    rateLimiterFactory: createNoOpRateLimiterFactory(),
  });

  return { app };
}
