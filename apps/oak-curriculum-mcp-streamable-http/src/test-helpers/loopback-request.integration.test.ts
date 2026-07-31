/**
 * System-state tests for the loopback request helper (MCP-403).
 *
 * The states described:
 *
 * 1. The harness server is owned on the exact address test clients dial:
 *    it binds `127.0.0.1` explicitly, so a foreign process can never
 *    silently share its port (a host-less listen binds `::`, which
 *    coexists with foreign v4-specific binds — the observed failure was
 *    requests landing on a resident Java listener under load).
 * 2. A request arriving before any `request(app)` call fails loudly with
 *    a named harness error, never a hang or an anonymous crash.
 * 3. The helper refuses to swap to a DIFFERENT app while requests are in
 *    flight — the shared server dispatches to the current app at
 *    request-arrival time, so a silent swap could misroute an in-flight
 *    exchange. Swapping to the SAME app stays allowed (concurrent
 *    requests against one app are a legitimate pattern).
 */
import { describe, it, expect, onTestFinished, vi } from 'vitest';
import http from 'node:http';
import net from 'node:net';
import type { Express } from 'express';
import express from 'express';
import { dispatch, request, harnessAddress } from './loopback-request.js';

function markerApp(marker: string): Express {
  const app = express();
  app.get('/marker', (_req, res) => {
    res.send(marker);
  });
  return app;
}

describe('loopback request helper (MCP-403)', () => {
  it('serves from a server bound to the exact v4 loopback address clients dial', async () => {
    const res = await request(markerApp('owned')).get('/marker');
    expect(res.status).toBe(200);
    expect(res.text).toBe('owned');
    expect(harnessAddress().address).toBe('127.0.0.1');
  });

  it('terminates a no-app exchange with the named harness 500, never a hang', () => {
    // The dispatch seam makes the no-app state describable
    // deterministically, independent of test order within the file: real
    // Node request/response objects (no network — the socket never
    // connects), the null app the seam guards against, and the response
    // observed through its own output surface.
    const req = new http.IncomingMessage(new net.Socket());
    const res = new http.ServerResponse(req);
    const endSpy = vi.spyOn(res, 'end');

    dispatch(null, req, res);

    expect(res.statusCode).toBe(500);
    expect(res.writableEnded).toBe(true);
    expect(endSpy).toHaveBeenCalledWith(expect.stringContaining('MCP-403'));
  });

  it('refuses to swap apps while a different app has requests in flight', async () => {
    let releaseHandler: () => void = () => undefined;
    let handlerEntered: () => void = () => undefined;
    const entered = new Promise<void>((resolve) => {
      handlerEntered = resolve;
    });
    const gate = new Promise<void>((resolve) => {
      releaseHandler = resolve;
    });
    // A failed expectation below must not leave the gated response open:
    // an unreleased handler wedges afterAll on the live connection and
    // masks the real failure behind a hook timeout.
    onTestFinished(() => {
      releaseHandler();
    });

    const slowApp = express();
    slowApp.get('/slow', (_req, res) => {
      handlerEntered();
      void gate.then(() => {
        res.send('released');
      });
    });

    const inFlightRequest = request(slowApp).get('/slow');
    // Start the exchange without awaiting completion; supertest fires on
    // then().
    const settled = inFlightRequest.then((res) => res);
    await entered;

    // The refusal names the pending exchange, so a reader of the error
    // can see WHICH request held the swap open.
    expect(() => request(markerApp('other'))).toThrow(/in flight \(\/slow\)/);
    // Same-app swap stays allowed while in flight.
    expect(() => request(slowApp)).not.toThrow();

    releaseHandler();
    const res = await settled;
    expect(res.text).toBe('released');

    // After the exchange completes, the in-flight guard releases: a
    // different-app swap is allowed again.
    expect(() => request(markerApp('other'))).not.toThrow();
  });
});
