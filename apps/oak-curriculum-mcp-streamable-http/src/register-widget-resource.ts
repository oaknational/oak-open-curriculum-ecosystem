/**
 * MCP App Widget Resource Registration
 *
 * Registers the interactive React curriculum app as an MCP resource.
 * The widget HTML is a committed TypeScript constant generated at codegen
 * time, injected via DI (ADR-078), and served as
 * `text/html;profile=mcp-app` per the MCP Apps standard.
 *
 * @see src/generated/widget-html-content.ts — Generated constant
 * @see widget/vite.config.ts — Widget build configuration
 * @see scripts/embed-widget-html.js — Codegen embed script
 */

import { registerAppResource, RESOURCE_MIME_TYPE } from '@modelcontextprotocol/ext-apps/server';
import { WIDGET_URI } from '@oaknational/curriculum-sdk/public/mcp-tools.js';

import {
  wrapResourceHandler,
  type ResourceRegistrar,
  type ResourceRegistrationOptions,
} from './register-resource-helpers.js';

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
 * The widget HTML is a self-contained React app built by Vite and embedded
 * as a committed TypeScript constant at codegen time. It is served as a
 * `text/html;profile=mcp-app` resource per the MCP Apps standard.
 * `registerAppResource` defaults the MIME type to `RESOURCE_MIME_TYPE`.
 *
 * The callback is wrapped with `wrapResourceHandler` for Sentry
 * observability tracing, matching all other registered resources.
 *
 * @param server - MCP server instance
 * @param getWidgetHtml - Sync function returning the built widget HTML (DI per ADR-078)
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
      () => ({
        contents: [
          {
            uri: WIDGET_URI,
            mimeType: RESOURCE_MIME_TYPE,
            text: getWidgetHtml(),
            _meta: { ui: WIDGET_UI_META },
          },
        ],
      }),
      observability,
    ),
  );
}
