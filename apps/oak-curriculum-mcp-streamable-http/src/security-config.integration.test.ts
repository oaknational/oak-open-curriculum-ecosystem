import express from 'express';
import { describe, it, expect } from 'vitest';

import { request } from './test-helpers/loopback-request.js';
import { createFakeLogger } from './test-helpers/fakes.js';
import { createMockRuntimeConfig } from './test-helpers/auth-error-test-helpers.js';
import { createSecurityConfig } from './security-config.js';
import { dnsRebindingProtection } from './security.js';

/**
 * MCP-634, at the scale the outage would have shown.
 *
 * The unit tests describe what `resolveAllowedHosts` returns. This file
 * describes what the guard then DOES with it: the whole point of the change is
 * that a host named in `ALLOWED_HOSTS` and a host the platform supplies are
 * both admitted by the same running allow-list, and that a host in neither is
 * still refused.
 */

/** The host production is actually served on, supplied by the platform. */
const PLATFORM_HOST = 'curriculum-mcp-alpha.oaknational.dev';
/** The new custom domain, named in ALLOWED_HOSTS. */
const CONFIGURED_HOST = 'mcp.thenational.academy';

function createGuardedApp(): ReturnType<typeof express> {
  const runtimeConfig = createMockRuntimeConfig({
    env: { ALLOWED_HOSTS: CONFIGURED_HOST },
    vercelHostnames: [PLATFORM_HOST],
  });
  const { allowedHosts } = createSecurityConfig(runtimeConfig);

  const app = express();
  app.use(dnsRebindingProtection(createFakeLogger(), allowedHosts));
  app.get('/', (_req, res) => {
    res.status(200).send('served');
  });
  return app;
}

describe('dnsRebindingProtection with an additive ALLOWED_HOSTS', () => {
  it('admits the host named in ALLOWED_HOSTS', async () => {
    const response = await request(createGuardedApp()).get('/').set('Host', CONFIGURED_HOST);

    expect(response.status).toBe(200);
  });

  /**
   * The assertion that would have been red before the change. Naming the new
   * custom domain used to REPLACE the platform-derived list, so this host —
   * the one production actually answers on — would have started returning 403
   * on the next deployment.
   */
  it('still admits the platform-derived host that was already serving', async () => {
    const response = await request(createGuardedApp()).get('/').set('Host', PLATFORM_HOST);

    expect(response.status).toBe(200);
  });

  it('still admits the loopback address the local harnesses use', async () => {
    const response = await request(createGuardedApp()).get('/').set('Host', 'localhost');

    expect(response.status).toBe(200);
  });

  /** The control: widening the list must not stop the guard discriminating. */
  it('still refuses a host in neither the configured nor the derived set', async () => {
    const response = await request(createGuardedApp()).get('/').set('Host', 'evil.example');

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: 'Forbidden: host not allowed: evil.example' });
  });
});
