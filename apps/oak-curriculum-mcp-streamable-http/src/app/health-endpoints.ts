import type { Express } from 'express';
import type { Logger } from '@oaknational/logger';

import { HEALTH_PATHS } from './health-paths.js';

const HEALTH_RESPONSE = JSON.stringify({
  status: 'ok',
  mode: 'streamable-http',
  auth: 'required-for-post',
});

/**
 * A cached health response is the one failure mode that makes a liveness probe
 * lie — it reports a process that answered minutes ago, and it reports it most
 * confidently at the moment the process goes down.
 *
 * @remarks
 * Load-bearing since MCP-580 rather than hardening. Root `/healthz` had no
 * intermediary in front of it; the routed path is reached through the canonical
 * host's Cloudflare route, so a cache is now in the path by construction. The
 * `/mcp` HTML leg pins the same directive for the same reason
 * (`mcp-middleware.ts`), as does the root landing page (`static-content.ts`).
 */
const HEALTH_CACHE_CONTROL = 'no-store';

/**
 * Registers the health check on every path it answers on.
 *
 * @remarks
 * Registration ORDER is load-bearing for the routed path, not incidental.
 * This runs inside `initializeCoreEndpoints`, which the composition root calls
 * BEFORE it mounts `createEnsureMcpAcceptHeader` and the landing-page
 * negotiation at `/mcp` (see `application.ts`). Both of those match the whole
 * `/mcp` subtree, so a health route registered after them would answer 406 for
 * want of an SSE `Accept` header — which is what production returned on
 * `/mcp/healthz` — or hand a browser-shaped probe the landing page. Both
 * reorderings are caught by sibling control probes in
 * `health-endpoints.integration.test.ts`.
 *
 * The response stays dependency-free by design: it reports that this process is
 * answering, and nothing else. A health check that fails when a downstream
 * dependency is slow is a worse signal than none, because it turns every
 * upstream wobble into a page for a server that is up.
 */
export function addHealthEndpoints(app: Express, log: Logger): void {
  app.head([...HEALTH_PATHS], (req, res) => {
    log.debug('healthz.head', { path: req.path, method: req.method });
    res
      .setHeader('Content-Type', 'application/json')
      .setHeader('Cache-Control', HEALTH_CACHE_CONTROL)
      .status(200)
      .end();
  });
  app.get([...HEALTH_PATHS], (req, res) => {
    log.debug('healthz.get', { path: req.path, method: req.method });
    res.type('application/json').set('Cache-Control', HEALTH_CACHE_CONTROL).send(HEALTH_RESPONSE);
  });
}
