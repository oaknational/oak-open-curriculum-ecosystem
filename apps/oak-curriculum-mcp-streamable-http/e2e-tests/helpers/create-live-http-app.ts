import type express from 'express';
import { unwrap } from '@oaknational/result';
import { createApp } from '../../src/application.js';
import { createHttpObservabilityOrThrow } from '../../src/observability/http-observability.js';
import { loadRuntimeConfig } from '../../src/runtime-config.js';
import { skipWidgetHtmlValidation } from '../../src/test-helpers/widget-html-validation.js';
import type { ToolHandlerOverrides } from '../../src/handlers.js';

export interface LiveHttpApp {
  readonly app: express.Express;
}

export interface CreateLiveHttpAppOptions {
  readonly overrides?: ToolHandlerOverrides;
  readonly envOverrides?: Partial<NodeJS.ProcessEnv>;
}

export async function createLiveHttpApp(options?: CreateLiveHttpAppOptions): Promise<LiveHttpApp> {
  const testEnv: NodeJS.ProcessEnv = {
    NODE_ENV: 'test',
    OAK_API_KEY: process.env.OAK_API_KEY ?? 'live-mode-api-key',
    DANGEROUSLY_DISABLE_AUTH: 'true',
    ALLOWED_HOSTS: 'localhost,127.0.0.1,::1',
    ELASTICSEARCH_URL: 'http://fake-es:9200',
    ELASTICSEARCH_API_KEY: 'fake-api-key-for-e2e',
    ...options?.envOverrides,
  };

  const result = loadRuntimeConfig({
    processEnv: testEnv,
    startDir: process.cwd(),
  });
  const runtimeConfig = unwrap(result);
  const observability = createHttpObservabilityOrThrow(runtimeConfig);
  const app = await createApp({
    runtimeConfig,
    observability,
    validateWidgetHtml: skipWidgetHtmlValidation,
    toolHandlerOverrides: options?.overrides,
  });

  return { app };
}
