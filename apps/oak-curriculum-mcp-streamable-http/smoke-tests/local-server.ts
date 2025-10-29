import type { Server } from 'node:http';

/**
 * Type guard to check if an error has a string 'code' property
 */
function hasErrorCode(error: unknown): error is { code: string } {
  return (
    typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string'
  );
}

/**
 * Starts the streamable HTTP app on the requested port for smoke tests.
 */
export async function startSmokeServer(port: number): Promise<Server> {
  const { createApp } = await import('../src/index.js');
  const app = createApp();
  return await new Promise<Server>((resolve, reject) => {
    const instance = app.listen(port, () => {
      resolve(instance);
    });
    instance.on('error', reject);
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
  if (server.listening) {
    // Force close any open connections
    server.closeAllConnections();
  }

  await new Promise<void>((resolve, reject) => {
    server.close((err) => {
      // Ignore ERR_SERVER_NOT_RUNNING - server is already closed, which is fine
      if (err && hasErrorCode(err) && err.code !== 'ERR_SERVER_NOT_RUNNING') {
        reject(err);
        return;
      }
      resolve();
    });
  });
}
