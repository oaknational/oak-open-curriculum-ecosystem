import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import type { Express } from 'express';

import { createApp } from './application.js';
import { createFakeHttpObservability } from './test-helpers/observability-fakes.js';
import { createFakeRateLimiterFactory } from './test-helpers/rate-limiter-fakes.js';
import { createMockRuntimeConfig } from './test-helpers/auth-error-test-helpers.js';

/**
 * The design system reaches the browser as ordinary static assets.
 *
 * The copy itself is proven in `build-scripts/copy-oak-ds.unit.test.ts`;
 * this suite proves the other half — that the copied tree is actually
 * reachable over HTTP from the running app, through the static mount that
 * already exists. Without this, a correct copy into a directory the server
 * does not serve would look identical to success.
 */
describe('Oak design system static serving', () => {
  let app: Express;

  beforeEach(async () => {
    app = await createApp({
      runtimeConfig: createMockRuntimeConfig({
        dangerouslyDisableAuth: true,
        env: { ALLOWED_HOSTS: 'localhost,127.0.0.1,::1' },
      }),
      observability: createFakeHttpObservability(),
      getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
      rateLimiterFactory: createFakeRateLimiterFactory().factory,
    });
  });

  it('serves the root stylesheet as CSS', async () => {
    const res = await request(app).get('/oak-ds/styles.css').set('Host', 'localhost');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/css');
  });

  it('serves the stylesheets the root sheet imports', async () => {
    for (const sheet of ['colors_and_type.css', 'oak-icons.css', 'components.css', 'print.css']) {
      const res = await request(app).get(`/oak-ds/${sheet}`).set('Host', 'localhost');

      expect(res.status, `${sheet} is not reachable`).toBe(200);
    }
  });

  it('serves a font face and its licence notice', async () => {
    const font = await request(app)
      .get('/oak-ds/fonts/Lexend-VariableFont_wght.ttf')
      .set('Host', 'localhost');
    const licence = await request(app).get('/oak-ds/fonts/Lexend-OFL.txt').set('Host', 'localhost');

    expect(font.status).toBe(200);
    expect(licence.status).toBe(200);
  });

  it('serves a mask icon', async () => {
    const res = await request(app)
      .get('/oak-ds/assets/icons/chevron-down.svg')
      .set('Host', 'localhost');

    expect(res.status).toBe(200);
  });
});
