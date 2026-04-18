import type express from 'express';
import { createApp } from '../../src/application.js';
import { createMockObservability, createMockRuntimeConfig } from './test-config.js';

export const STUB_ACCEPT_HEADER = 'application/json, text/event-stream';
const STUB_API_KEY = 'stub-api-key';

export interface StubbedHttpApp {
  readonly app: express.Express;
}

export async function createStubbedHttpApp(
  envOverrides: Partial<NodeJS.ProcessEnv> = {},
): Promise<StubbedHttpApp> {
  const runtimeConfig = createMockRuntimeConfig({
    dangerouslyDisableAuth: true,
    useStubTools: true,
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
  });

  return { app };
}
