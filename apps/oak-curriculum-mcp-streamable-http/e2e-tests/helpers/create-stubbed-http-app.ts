import type express from 'express';
import { createApp } from '../../src/application.js';
import {
  SERVED_SURFACE,
  type ServedSurfaceDefinition,
} from '../../src/served-surface/served-surface.js';
import { createMockObservability, createMockRuntimeConfig } from './test-config.js';
import { getScratchStaticRoot } from '../../src/test-helpers/static-root-fixture.js';

export const STUB_ACCEPT_HEADER = 'application/json, text/event-stream';
const STUB_API_KEY = 'stub-api-key';

/**
 * Served-surface variant with the user-search MCP App pair live — the
 * sanctioned e2e activation seam for suites exercising the dormant tools.
 * Production never uses this: the canonical `SERVED_SURFACE` keeps the
 * pair dormant until the MCP App experience ships.
 */
export const SERVED_SURFACE_WITH_USER_SEARCH_LIVE: ServedSurfaceDefinition = {
  universalTools: {
    ...SERVED_SURFACE.universalTools,
    'user-search': 'live',
    'user-search-query': 'live',
  },
  appLocalTools: SERVED_SURFACE.appLocalTools,
  resources: SERVED_SURFACE.resources,
};

export interface StubbedHttpApp {
  readonly app: express.Express;
}

export async function createStubbedHttpApp(
  envOverrides: Partial<NodeJS.ProcessEnv> = {},
  options: { readonly servedSurface?: ServedSurfaceDefinition } = {},
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
    staticRoot: await getScratchStaticRoot(),
    runtimeConfig,
    observability,
    getWidgetHtml: () => '<!doctype html><html><body>stub-widget</body></html>',
    // Only override the canonical definition when a suite opts into a
    // variant (e.g. the user-search activation seam); omitting it keeps
    // the production-honest served surface.
    ...(options.servedSurface ? { servedSurface: options.servedSurface } : {}),
  });

  return { app };
}
