/**
 * Loopback-pinned supertest entry point (MCP-403).
 *
 * ## Why this exists
 *
 * Bare `supertest(app)` boots one ephemeral server per request with a
 * host-less `listen(0)`, which binds the IPv6 any-address (`::`) — while
 * supertest's client dials `127.0.0.1`. A foreign process holding a
 * v4-specific bind on the same port coexists silently with a `::` bind,
 * so under a concurrent test graph the kernel can hand a test server a
 * port whose v4 side belongs to a foreign local service, and the request
 * lands there — observed live as the client parse error
 * `HPE_INVALID_CONSTANT` from a non-HTTP Java listener, and as foreign
 * 400s from an HTTP one.
 * A host-ful listen cannot fix this transparently: supertest reads
 * `address().port` in the same tick as its listen, and Node binds any
 * host-ful listen asynchronously — even for IP literals.
 *
 * ## What it does instead
 *
 * ONE server per test file, bound `127.0.0.1:0` with an awaited listen in
 * a `beforeAll` this module registers at import. The bind either owns the
 * exact (address, port) pair test clients dial or fails loudly with
 * `EADDRINUSE` — foreign coexistence is structurally impossible. The
 * exported {@link request} swaps the app the shared server dispatches to
 * and hands supertest the already-listening server, preserving the exact
 * `request(app).verb(path)` call shape (the migration is import-line
 * only; a lint guard keeps new tests off bare supertest).
 *
 * ## Constraints
 *
 * - Requires per-file worker isolation (the estate's vitest default).
 *   Under a shared-module-cache mode (`--no-isolate`, vmThreads) the
 *   hooks would not re-run for later files; {@link request} detects the
 *   dead server and throws a named error rather than misbehaving.
 * - The shared server dispatches to the CURRENT app at request-arrival
 *   time, so swapping to a DIFFERENT app while requests are in flight is
 *   refused loudly. Swapping to the same app stays allowed — concurrent
 *   requests against one app are a legitimate pattern.
 * - Supertest requests dial lazily (on `await`/`.then()`/`.end()`), so
 *   the in-flight guard cannot see a constructed-but-unstarted request:
 *   a `Test` held un-awaited across a `request(differentApp)` call
 *   dispatches to whichever app is current when it finally dials.
 *   Construct-then-await immediately (every current consumer does).
 *   Per-request app binding that removes this constraint is MCP-410.
 */

import http from 'node:http';
import type { AddressInfo } from 'node:net';
import { once } from 'node:events';
import supertest from 'supertest';
import { afterAll, beforeAll } from 'vitest';

/**
 * Re-exported so consumers keep their response typing through the helper
 * (bare supertest exposed this as the `request.Response` namespace type).
 */
export type { Response } from 'supertest';

/** The call shape every consumer uses: an Express app is (req, res). */
type AppHandler = (req: http.IncomingMessage, res: http.ServerResponse) => void;

let sharedServer: http.Server | null = null;
let currentApp: AppHandler | null = null;
let inFlightCount = 0;
const inFlightUrls = new Map<string, number>();

function trackRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
  const url = req.url ?? '<no-url>';
  inFlightCount += 1;
  inFlightUrls.set(url, (inFlightUrls.get(url) ?? 0) + 1);
  let settled = false;
  const done = (): void => {
    if (settled) {
      return;
    }
    settled = true;
    inFlightCount -= 1;
    const remaining = (inFlightUrls.get(url) ?? 1) - 1;
    if (remaining <= 0) {
      inFlightUrls.delete(url);
    } else {
      inFlightUrls.set(url, remaining);
    }
  };
  // Both events: 'finish' for completed responses, 'close' for aborted or
  // errored ones — a wedged counter would turn later swaps into false
  // guard trips.
  res.on('finish', done);
  res.on('close', done);
}

/**
 * Routes one incoming exchange to the current app, or terminates it with
 * the named harness 500 when no app has been swapped in yet. Exported as
 * a seam so the no-app state is describable deterministically, without
 * a raw dial whose outcome depends on test order within the file.
 */
export function dispatch(
  app: AppHandler | null,
  req: http.IncomingMessage,
  res: http.ServerResponse,
): void {
  if (app === null) {
    res.statusCode = 500;
    res.setHeader('content-type', 'text/plain');
    res.end(
      'loopback-request harness error (MCP-403): a request arrived before any request(app) call in this file.',
    );
    return;
  }
  app(req, res);
}

beforeAll(async () => {
  const server = http.createServer((req, res) => {
    trackRequest(req, res);
    dispatch(currentApp, req, res);
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  sharedServer = server;
});

afterAll(async () => {
  const server = sharedServer;
  sharedServer = null;
  currentApp = null;
  if (server !== null) {
    server.close();
    await once(server, 'close');
  }
});

/** The shared harness server's bound address; throws when not live. */
export function harnessAddress(): AddressInfo {
  if (sharedServer === null || !sharedServer.listening) {
    throw new Error(
      'loopback-request harness error (MCP-403): shared server is not live for this file.',
    );
  }
  const address = sharedServer.address();
  if (address === null || typeof address === 'string') {
    throw new Error('loopback-request harness error (MCP-403): shared server has no TCP address.');
  }
  return address;
}

/**
 * Drop-in replacement for bare `supertest(app)`: swaps the shared
 * loopback-pinned server's app and returns supertest bound to it, so
 * every chained `.get/.post/...` call works unchanged.
 */
export function request(app: AppHandler): ReturnType<typeof supertest> {
  if (sharedServer === null || !sharedServer.listening) {
    throw new Error(
      'loopback-request harness error (MCP-403): shared server is not live for this file. ' +
        'The helper requires per-file worker isolation (the vitest default); do not run with ' +
        '--no-isolate or a shared-module-cache pool.',
    );
  }
  if (currentApp !== null && currentApp !== app && inFlightCount > 0) {
    const pending = [...inFlightUrls.entries()]
      .map(([url, count]) => (count > 1 ? `${url} x${String(count)}` : url))
      .join(', ');
    throw new Error(
      `loopback-request harness error (MCP-403): refusing to swap to a different app while ` +
        `${String(inFlightCount)} request(s) are in flight (${pending}). Likeliest benign cause: ` +
        `a previous test hit its timeout with a response still streaming.`,
    );
  }
  currentApp = app;
  return supertest(sharedServer);
}
