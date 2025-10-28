import type { Server } from 'node:http';

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
 */
export async function closeSmokeServer(server: Server): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    server.close((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}
