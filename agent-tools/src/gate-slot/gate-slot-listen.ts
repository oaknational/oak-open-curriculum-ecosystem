import net from 'node:net';

/**
 * Loopback listeners as exclusive, kernel-released resources: binding one,
 * closing it, and refusing a connection. The gate slot's mutex, its slots and
 * its probes are all listeners of this kind.
 *
 * @packageDocumentation
 */

/** A listener never has more than this many connections at once; readers connect one at a time. */
const MAX_CONNECTIONS = 8;

/** How a bind attempt ended. */
export type Listened =
  | { readonly kind: 'listening'; readonly server: net.Server }
  | { readonly kind: 'in-use' }
  | { readonly kind: 'failed'; readonly message: string };

/**
 * Bind `host:port` exclusively. EADDRINUSE reads as in use; any other error
 * as a failure with its message.
 */
export function listen(
  host: string,
  port: number,
  onConnection: (socket: net.Socket) => void,
): Promise<Listened> {
  return new Promise((resolve) => {
    const server = net.createServer(onConnection);
    server.maxConnections = MAX_CONNECTIONS;
    server.once('error', (error: NodeJS.ErrnoException) => {
      resolve(
        error.code === 'EADDRINUSE'
          ? { kind: 'in-use' }
          : { kind: 'failed', message: `listen ${host}:${port}: ${error.message}` },
      );
    });
    server.listen({ host, port, exclusive: true }, () => {
      // A listening server's later errors (a failed accept) must not crash
      // the wrapper: that would free the slot while its gate runs on.
      server.on('error', () => undefined);
      resolve({ kind: 'listening', server });
    });
  });
}

/** Drop a connection at once. */
export function refuse(socket: net.Socket): void {
  socket.destroy();
}

/** Close a listener; resolves once its connections have ended. */
export function close(server: net.Server): Promise<void> {
  return new Promise((resolve) => {
    server.close(() => {
      resolve();
    });
  });
}

/** Close every listener given, skipping the absent ones. */
export async function closeAll(servers: readonly (net.Server | undefined)[]): Promise<void> {
  await Promise.all(servers.flatMap((server) => (server === undefined ? [] : [close(server)])));
}
