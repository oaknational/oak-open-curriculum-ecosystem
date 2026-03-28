import type express from 'express';
import { unwrap } from '@oaknational/result';
import { createApp } from '../../src/application.js';
import { createHttpObservabilityOrThrow } from '../../src/observability/http-observability.js';
import { loadRuntimeConfig } from '../../src/runtime-config.js';

export const STUB_ACCEPT_HEADER = 'application/json, text/event-stream';
// No longer using bearer tokens - using auth bypass instead
export const STUB_DEV_BEARER_TOKEN = ''; // Deprecated, kept for backward compatibility
const STUB_API_KEY = 'stub-api-key';

export interface StubbedHttpApp {
  readonly app: express.Express;
}

export async function createStubbedHttpApp(
  envOverrides: Partial<NodeJS.ProcessEnv> = {},
): Promise<StubbedHttpApp> {
  const testEnv: NodeJS.ProcessEnv = {
    NODE_ENV: 'test',
    OAK_CURRICULUM_MCP_USE_STUB_TOOLS: 'true',
    OAK_API_KEY: STUB_API_KEY,
    DANGEROUSLY_DISABLE_AUTH: 'true',
    ALLOWED_HOSTS: 'localhost,127.0.0.1,::1',
    ELASTICSEARCH_URL: 'http://fake-es:9200',
    ELASTICSEARCH_API_KEY: 'fake-api-key-for-stub-tests',
    ...envOverrides,
  };

  const result = loadRuntimeConfig({
    processEnv: testEnv,
    startDir: process.cwd(),
  });
  const runtimeConfig = unwrap(result);
  const observability = createHttpObservabilityOrThrow(runtimeConfig);
  const app = await createApp({ runtimeConfig, observability });

  return { app };
}
