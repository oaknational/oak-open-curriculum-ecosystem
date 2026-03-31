import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import net from 'node:net';
import { describeExistingListeners } from './process-info.js';

const LOOPBACK_HOST = '127.0.0.1';
const PORT_CHECK_TIMEOUT_MS = 250;
const EPHEMERAL_PORT = 0;

/**
 * Starts the streamable HTTP app on the requested port for smoke tests.
 */
async function createSmokeApp() {
  const { createApp } = await import('../src/application.js');
  const { loadRuntimeConfig } = await import('../src/runtime-config.js');
  const { createHttpObservability, describeHttpObservabilityError } =
    await import('../src/observability/http-observability.js');
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
  return createApp({ runtimeConfig: configResult.value, observability: observabilityResult.value });
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
        reject(buildPortInUseError(port));
        return;
      }
      reject(error);
    });
  });
}

export function getServerPort(server: Server): number {
  const address = server.address();
  if (!isAddressInfo(address)) {
    if (!address) {
      throw new Error('Smoke server is listening but has no address information');
    }
    throw new Error(`Smoke server returned an unexpected string address: ${address}`);
  }
  return address.port;
}

/**
 * Closes a previously started smoke server.
 *
 * Handles the case where the server may have already been closed or
 * has open connections preventing immediate shutdown.
 */
export async function closeSmokeServer(server: Server): Promise<void> {
  // First, force close all existing connections to allow server to shut down
  // This is necessary because HTTP keep-alive connections may keep the server open
  if (server.listening && typeof server.closeAllConnections === 'function') {
    // Force close any open connections
    console.log('[TRACE] closeSmokeServer: forcing close of all open connections');
    try {
      server.closeAllConnections();
    } catch (error) {
      if (!isServerNotRunningError(error)) {
        throw error;
      }
    }
  }

  await new Promise<void>((resolve, reject) => {
    server.close((err) => {
      if (err) {
        if (isServerNotRunningError(err)) {
          console.warn('[TRACE] closeSmokeServer: server already stopped');
          resolve();
          return;
        }
        reject(err);
        return;
      }
      resolve();
    });
  });
}

async function assertPortAvailable(port: number): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const socket = net.createConnection({ port, host: LOOPBACK_HOST });
    let settled = false;

    const finish = (error?: Error) => {
      if (settled) {
        return;
      }
      settled = true;
      socket.removeAllListeners();
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    };

    socket.once('connect', () => {
      socket.end();
      finish(buildPortInUseError(port));
    });

    socket.once('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOENT') {
        finish();
        return;
      }
      finish(error);
    });

    socket.setTimeout(PORT_CHECK_TIMEOUT_MS, () => {
      socket.destroy();
      finish(buildPortCheckTimeoutError(port));
    });
  });
}

function isValidAddress(
  address: string | AddressInfo | null,
  expectedPort: number,
): address is AddressInfo {
  if (!isAddressInfo(address)) {
    return false;
  }
  if (expectedPort === EPHEMERAL_PORT) {
    return address.port > 0;
  }
  return address.port === expectedPort;
}

function isAddressInfo(address: string | AddressInfo | null): address is AddressInfo {
  if (!address) {
    return false;
  }
  if (typeof address === 'string') {
    return false;
  }
  if (typeof address.address !== 'string') {
    return false;
  }
  if (typeof address.port !== 'number') {
    return false;
  }
  return true;
}

function buildInvalidAddressMessage(port: number, address: string | AddressInfo | null): string {
  const serialised = typeof address === 'string' ? address : JSON.stringify(address);
  if (port === EPHEMERAL_PORT) {
    return `Smoke server failed to confirm binding to an ephemeral port. Reported address: ${serialised}.`;
  }
  return `Smoke server failed to confirm binding to port ${String(
    port,
  )}. Reported address: ${serialised}.`;
}

function buildPortInUseError(port: number): Error {
  const processInfo = describeExistingListeners(port);
  const header = `PORT CONFLICT: Port ${String(port)} is already in use`;

  if (!processInfo) {
    return new Error(
      `${header}.\n\nCannot determine which process is using the port.\nStop the conflicting process or run with: --port <different-port>`,
    );
  }

  const { summary, fullOutput } = processInfo;
  return new Error(
    `${header}\n\n${summary}\n\nFull lsof output:\n${fullOutput}\n\nTo resolve:\n  1. Stop the process: kill ${processInfo.pid ?? '<pid>'}\n  2. Or use a different port: --port <different-port>`,
  );
}

function buildPortCheckTimeoutError(port: number): Error {
  return new Error(
    `Timed out while checking availability of ${LOOPBACK_HOST}:${String(
      port,
    )}. Verify no other process is bound to this port and try again.`,
  );
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

function isServerNotRunningError(error: unknown): error is NodeJS.ErrnoException {
  return Boolean(
    error &&
    typeof error === 'object' &&
    'code' in error &&
    error.code === 'ERR_SERVER_NOT_RUNNING',
  );
}
