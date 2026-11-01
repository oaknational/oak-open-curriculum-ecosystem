/**
 * Shared in-memory MCP client harness for registration-proof surfaces.
 *
 * Runs the real HTTP composition root over an in-memory MCP transport so
 * proof and artefact generators observe the served surface itself, never a
 * re-derivation of it. No host-delivery claim is made.
 */

import express from 'express';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { type Logger } from '@oaknational/logger';
import { initializeCoreEndpoints } from '../app/core-endpoints.js';
import { createHttpObservability } from '../observability/http-observability.js';
import { resolveServedMcpUrl } from '../served-origin.js';
import type { RuntimeConfig } from '../runtime-config.js';

const runtimeConfig: RuntimeConfig = {
  env: {
    OAK_API_KEY: 'current-source-validator-key',
    ELASTICSEARCH_URL: 'https://current-source-validator.invalid',
    ELASTICSEARCH_API_KEY: 'current-source-validator-key',
    SENTRY_MODE: 'off',
  },
  dangerouslyDisableAuth: true,
  useStubTools: true,
  version: '0.0.0-current-source-validator',
  versionSource: 'APP_VERSION_OVERRIDE',
  vercelHostnames: [],
};

function createLogger(): Logger {
  const logger: Logger = {
    trace: () => undefined,
    debug: () => undefined,
    info: () => undefined,
    warn: () => undefined,
    error: () => undefined,
    fatal: () => undefined,
    isLevelEnabled: () => false,
    child: () => logger,
  };
  return logger;
}

export interface ConnectedClientOptions {
  /**
   * Override the widget document the composition root serves. The default
   * stub keeps registration-proof consumers independent of the built bundle;
   * the host-compatibility test injects the real generated
   * `WIDGET_HTML_CONTENT` so the engine scans the same bytes a host receives
   * over the wire (production wires that exact constant).
   */
  readonly getWidgetHtml?: () => string;
}

/** Connects an in-memory MCP client to the real composition root. */
// observability-emission-exempt: validation harness — the proof and artefact
// generators run the composition root with a deliberately inert logger so
// validation runs emit nothing into production observability.
export async function createConnectedClient(options?: ConnectedClientOptions): Promise<Client> {
  const observabilityResult = createHttpObservability(runtimeConfig);
  if (!observabilityResult.ok) {
    throw new Error('Could not create inert HTTP observability for registration proof');
  }
  const app = express();
  const { mcpFactory } = initializeCoreEndpoints(
    app,
    {
      runtimeConfig,
      observability: observabilityResult.value,
      resourceUrl: resolveServedMcpUrl({}),
      getWidgetHtml: options?.getWidgetHtml ?? (() => '<html>current-source-validator</html>'),
    },
    createLogger(),
  );
  const { server } = mcpFactory();
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: 'current-source-validator', version: '0.0.0' });
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  return client;
}
