/**
 * Widget test server for Playwright tests.
 *
 * Serves the Oak JSON viewer widget HTML at /widget endpoint.
 * Used by Playwright tests to exercise widget rendering with mock data.
 *
 * @see ../../src/aggregated-tool-widget.ts - Widget HTML source
 * @see ./widget-rendering.spec.ts - Tests that use this server
 */

import type { Application, Response } from 'express';
import express from 'express';

import { AGGREGATED_TOOL_WIDGET_HTML } from '../../src/aggregated-tool-widget.js';

/**
 * Creates an Express app that serves the widget HTML for testing.
 *
 * The server is minimal - it only serves the widget HTML at /widget.
 * Tests use page.addInitScript() to inject mock window.openai data
 * before navigating to this endpoint.
 *
 * @returns Express application serving widget at /widget
 *
 * @example
 * ```typescript
 * const app = createWidgetTestServer();
 * const server = app.listen(0); // Random available port
 * const address = server.address() as AddressInfo;
 * const serverUrl = `http://localhost:${String(address.port)}`;
 * ```
 */
export function createWidgetTestServer(): Application {
  const app = express();

  app.get('/widget', (_, res: Response) => {
    res.type('text/html').send(AGGREGATED_TOOL_WIDGET_HTML);
  });

  return app;
}
