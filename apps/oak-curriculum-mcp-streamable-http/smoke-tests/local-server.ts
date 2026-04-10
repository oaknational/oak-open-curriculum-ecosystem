/**
 * App-specific smoke server for the Oak Curriculum MCP Streamable HTTP app.
 *
 * Composes the generic server lifecycle helpers from `server-lifecycle.ts`
 * with the app-specific `createApp` factory, runtime config, and widget
 * HTML constant.
 *
 * @see server-lifecycle.ts — Generic HTTP server helpers (port, close, address)
 */

import type { Server } from 'node:http';
import {
  LOOPBACK_HOST,
  EPHEMERAL_PORT,
  assertPortAvailable,
  getServerPort,
  closeSmokeServer,
  isValidAddress,
  buildInvalidAddressMessage,
} from './server-lifecycle.js';

export { getServerPort, closeSmokeServer } from './server-lifecycle.js';

async function createSmokeApp() {
  const { createApp } = await import('../src/application.js');
  const { loadRuntimeConfig } = await import('../src/runtime-config.js');
  const { createHttpObservability, describeHttpObservabilityError } =
    await import('../src/observability/http-observability.js');
  const { WIDGET_HTML_CONTENT } = await import('../src/generated/widget-html-content.js');
  const configResult = loadRuntimeConfig({ processEnv: process.env, startDir: process.cwd() });
  if (!configResult.ok) {
    throw new Error(`Failed to load runtime config: ${configResult.error.message}`);
  }
  const observabilityResult = createHttpObservability(configResult.value);
  if (!observabilityResult.ok) {
    throw new Error(
      `Failed to create observability: ${describeHttpObservabilityError(observabilityResult.error)}`,
    );
  }
  return createApp({
    runtimeConfig: configResult.value,
    observability: observabilityResult.value,
    getWidgetHtml: () => WIDGET_HTML_CONTENT,
  });
}

export async function startSmokeServer(port: number): Promise<Server> {
  if (port !== EPHEMERAL_PORT) {
    await assertPortAvailable(port);
  }
  console.log(`[TRACE] startSmokeServer: creating smoke app`);
  const app = await createSmokeApp();
  const appId = app.__appId;
  console.log(
    `[TRACE] startSmokeServer: got app #${String(appId)}, starting server on port ${String(port)}`,
  );
  return await new Promise<Server>((resolve, reject) => {
    const instance = app.listen(port, LOOPBACK_HOST, () => {
      const details = instance.address();
      if (!isValidAddress(details, port)) {
        const message = buildInvalidAddressMessage(port, details);
        instance.close(() => {
          reject(new Error(message));
        });
        return;
      }
      console.log(
        `[TRACE] startSmokeServer: server listening on ${details.address}:${String(details.port)} using app #${String(appId)}`,
      );
      resolve(instance);
    });
    instance.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        reject(new Error(`PORT CONFLICT: Port ${String(port)} is already in use`));
        return;
      }
      reject(error);
    });
  });
}

/**
 * Creates a fresh application instance, starts it on an ephemeral port,
 * runs a callback with the base URL, and tears down the server.
 *
 * Useful for testing scenarios that need an isolated server (e.g. auth
 * enforcement tests, custom configurations). For standard smoke assertions,
 * all MCP requests can share the main server since per-request transport
 * creates a fresh McpServer + transport per request.
 */
export async function withEphemeralServer<T>(fn: (baseUrl: string) => Promise<T>): Promise<T> {
  const app = await createSmokeApp();

  const server = await new Promise<Server>((resolve, reject) => {
    const instance = app.listen(EPHEMERAL_PORT, LOOPBACK_HOST, () => {
      resolve(instance);
    });
    instance.on('error', reject);
  });

  try {
    const port = getServerPort(server);
    return await fn(`http://${LOOPBACK_HOST}:${String(port)}`);
  } finally {
    await closeSmokeServer(server);
  }
}
