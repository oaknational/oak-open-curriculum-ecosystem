import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import net from 'node:net';
import { spawnSync } from 'node:child_process';

const LOOPBACK_HOST = '127.0.0.1';
const PORT_CHECK_TIMEOUT_MS = 250;

/**
 * Starts the streamable HTTP app on the requested port for smoke tests.
 */
export async function startSmokeServer(port: number): Promise<Server> {
  await assertPortAvailable(port);
  console.log(`[TRACE] startSmokeServer: importing createApp`);
  const { createApp } = await import('../src/application.js');
  console.log(`[TRACE] startSmokeServer: calling createApp()`);
  const app = createApp();
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
  return Boolean(
    address &&
    typeof address !== 'string' &&
    typeof address.address === 'string' &&
    address.port === expectedPort,
  );
}

function buildInvalidAddressMessage(port: number, address: string | AddressInfo | null): string {
  const serialised = typeof address === 'string' ? address : JSON.stringify(address);
  return `Smoke server failed to confirm binding to port ${String(
    port,
  )}. Reported address: ${serialised}.`;
}

function buildPortInUseError(port: number): Error {
  const existing = describeExistingListeners(port);
  const hint = existing ? `\nExisting listeners:\n${existing}` : '';
  return new Error(
    `Smoke test server could not bind to ${LOOPBACK_HOST}:${String(
      port,
    )} because the port is already in use.${hint}\nStop the other process or run the smoke suite with a different --port.`,
  );
}

function buildPortCheckTimeoutError(port: number): Error {
  return new Error(
    `Timed out while checking availability of ${LOOPBACK_HOST}:${String(
      port,
    )}. Verify no other process is bound to this port and try again.`,
  );
}

function describeExistingListeners(port: number): string | undefined {
  const result = spawnSync('lsof', ['-nP', '-i', `TCP:${String(port)}`, '-sTCP:LISTEN'], {
    encoding: 'utf8',
  });
  if (result.status === 0) {
    const trimmed = result.stdout.trim();
    if (trimmed.length > 0) {
      return trimmed;
    }
  }
  return undefined;
}

function isServerNotRunningError(error: unknown): error is NodeJS.ErrnoException {
  return Boolean(
    error &&
    typeof error === 'object' &&
    'code' in error &&
    error.code === 'ERR_SERVER_NOT_RUNNING',
  );
}
