/**
 * MCP App Widget Resource Registration
 *
 * Registers the interactive React curriculum app as an MCP resource.
 * The widget HTML is a self-contained bundle built by Vite, served
 * as `text/html;profile=mcp-app` per the MCP Apps standard.
 */

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { registerAppResource, RESOURCE_MIME_TYPE } from '@modelcontextprotocol/ext-apps/server';
import { WIDGET_URI } from '@oaknational/curriculum-sdk/public/mcp-tools.js';

import {
  wrapResourceHandler,
  type ResourceRegistrar,
  type ResourceRegistrationOptions,
} from './register-resource-helpers.js';

/**
 * Path to the built MCP App HTML bundle. In both dev (`src/`) and production
 * (`dist/`), `../dist/oak-banner.html` resolves to `<pkg>/dist/oak-banner.html`.
 *
 * Exported for startup validation in {@link validateWidgetHtmlExists}.
 */
export const WIDGET_HTML_PATH = resolve(import.meta.dirname, '../dist/oak-banner.html');

/**
 * Reads the built MCP App HTML bundle from disk for resource reads.
 *
 * @param widgetHtmlPath - Path to the widget HTML file (injected per ADR-078)
 */
export async function readBuiltWidgetHtml(
  widgetHtmlPath: string = WIDGET_HTML_PATH,
): Promise<string> {
  return readFile(widgetHtmlPath, 'utf-8');
}

/**
 * MCP App UI metadata for the widget resource.
 *
 * Placed on the `contents[]` item per the MCP Apps CSP/CORS specification
 * (content-item `_meta.ui` takes precedence over listing-level config).
 * Google Fonts domains are declared so hosts with CSP enforcement allow
 * the Lexend `@import` request. `prefersBorder: false` because the widget
 * manages its own branded background.
 */
const WIDGET_UI_META = {
  csp: {
    resourceDomains: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
  },
  prefersBorder: false,
} as const;

/**
 * Registers the MCP App widget resource via `registerAppResource`.
 *
 * The widget HTML is a self-contained React app built by Vite. It is served
 * as a `text/html;profile=mcp-app` resource per the MCP Apps standard.
 * `registerAppResource` defaults the MIME type to `RESOURCE_MIME_TYPE`.
 *
 * The async callback is wrapped with `wrapResourceHandler` for Sentry
 * observability tracing, matching all other registered resources.
 *
 * @param server - MCP server instance
 * @param getWidgetHtml - Async function returning the built widget HTML
 * @param observability - Observability for resource handler tracing
 */
export function registerWidgetResource(
  server: ResourceRegistrar,
  getWidgetHtml: ResourceRegistrationOptions['getWidgetHtml'],
  observability: ResourceRegistrationOptions['observability'],
): void {
  registerAppResource(
    server,
    'Oak Curriculum App',
    WIDGET_URI,
    {
      description: 'Interactive Oak curriculum MCP App for search and curriculum exploration.',
    },
    wrapResourceHandler(
      'widget-oak-curriculum-app',
      async () => ({
        contents: [
          {
            uri: WIDGET_URI,
            mimeType: RESOURCE_MIME_TYPE,
            text: await getWidgetHtml(),
            _meta: { ui: WIDGET_UI_META },
          },
        ],
      }),
      observability,
    ),
  );
}
