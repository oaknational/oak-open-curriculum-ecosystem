import type express from 'express';
import { createApp } from '../../src/application.js';
import type { ToolHandlerOverrides } from '../../src/handlers.js';
import { createMockObservability, createMockRuntimeConfig } from './test-config.js';

export interface LiveHttpApp {
  readonly app: express.Express;
}

export interface CreateLiveHttpAppOptions {
  readonly overrides?: ToolHandlerOverrides;
  readonly envOverrides?: Partial<NodeJS.ProcessEnv>;
}

export async function createLiveHttpApp(options?: CreateLiveHttpAppOptions): Promise<LiveHttpApp> {
  const runtimeConfig = createMockRuntimeConfig({
    dangerouslyDisableAuth: true,
    env: {
      OAK_API_KEY: 'live-mode-api-key',
      ALLOWED_HOSTS: 'localhost,127.0.0.1,::1',
      ...options?.envOverrides,
    },
  });
  const observability = createMockObservability(runtimeConfig);
  const app = await createApp({
    runtimeConfig,
    observability,
    getWidgetHtml: () => '<!doctype html><html><body>live-widget</body></html>',
    toolHandlerOverrides: options?.overrides,
  });

  return { app };
}
