/**
 * Generic HTTP server lifecycle helpers for smoke tests.
 *
 * Port probing, address validation, graceful shutdown, and diagnostic
 * error builders. These utilities operate on `http.Server` and
 * `net.AddressInfo` only — no app-specific knowledge.
 *
 * @see local-server.ts — App-specific smoke server that composes these helpers
 * @see process-info.ts — OS-level process diagnostics for port conflicts
 */

import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import net from 'node:net';
import { describeExistingListeners } from './process-info.js';

/** IPv4 loopback address used for all smoke server bindings. */
export const LOOPBACK_HOST = '127.0.0.1';

/** Port `0` — the OS assigns an available ephemeral port on `listen()`. */
export const EPHEMERAL_PORT = 0;

const PORT_CHECK_TIMEOUT_MS = 250;

/**
 * Extracts the numeric port from a listening server.
 *
 * @throws If the server has no address or returns an unexpected format.
 */
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
 * Gracefully closes a smoke server, forcing open connections shut first.
 *
 * Tolerates the server already being stopped (`ERR_SERVER_NOT_RUNNING`).
 */
export async function closeSmokeServer(server: Server): Promise<void> {
  if (server.listening && typeof server.closeAllConnections === 'function') {
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

/**
 * Asserts a TCP port is not already in use before binding.
 *
 * Attempts a short-lived connection to the port. If something is listening,
 * the error includes `lsof`-derived process diagnostics (macOS/Linux only).
 */
export async function assertPortAvailable(port: number): Promise<void> {
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

/**
 * Validates a server address after `listen()` resolves.
 *
 * For ephemeral ports, any positive port number is valid.
 * For explicit ports, the address must match the requested port.
 */
export function isValidAddress(
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

/** Builds a human-readable message when the server address is unexpected. */
export function buildInvalidAddressMessage(
  port: number,
  address: string | AddressInfo | null,
): string {
  const serialised = typeof address === 'string' ? address : JSON.stringify(address);
  if (port === EPHEMERAL_PORT) {
    return `Smoke server failed to confirm binding to an ephemeral port. Reported address: ${serialised}.`;
  }
  return `Smoke server failed to confirm binding to port ${String(port)}. Reported address: ${serialised}.`;
}

function isAddressInfo(address: string | AddressInfo | null): address is AddressInfo {
  return Boolean(
    address && typeof address !== 'string' && typeof address.address === 'string' && typeof address.port === 'number',
  );
}

function isServerNotRunningError(error: unknown): error is NodeJS.ErrnoException {
  return Boolean(error && typeof error === 'object' && 'code' in error && error.code === 'ERR_SERVER_NOT_RUNNING');
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
    `Timed out while checking availability of ${LOOPBACK_HOST}:${String(port)}. Verify no other process is bound to this port and try again.`,
  );
}
