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

import type { McpUiResourceMeta } from '@modelcontextprotocol/ext-apps';
import { registerAppResource, RESOURCE_MIME_TYPE } from '@modelcontextprotocol/ext-apps/server';
import { WIDGET_URI } from '@oaknational/curriculum-sdk/public/mcp-tools.js';

import { type ResourceRegistrar } from './register-resource-helpers.js';

/**
 * MCP App UI metadata for the widget resource.
 *
 * Served on both the `resources/list` entry, the static default a host can
 * review at connection time, and the `resources/read` content item, which
 * takes precedence per the MCP Apps specification, so either surface carries
 * the same settings. Google Fonts domains are declared so hosts with CSP
 * enforcement allow the Lexend `@import` request. `prefersBorder: false`
 * because the widget manages its own branded background.
 *
 * These settings are part of the widget's published contract: a published
 * plugin's snapshot records them, so any change here is an incompatible change
 * that takes a new widget address and a new plugin version (ADR-141, widget URI
 * identity amendment, MCP-489).
 */
const WIDGET_UI_META = {
  csp: {
    resourceDomains: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
  },
  prefersBorder: false,
} satisfies McpUiResourceMeta;

/**
 * Registration name of the MCP App widget resource — the single literal
 * shared by the registration call and the MCP-241 live-name derivation.
 */
export const WIDGET_RESOURCE_NAME = 'Oak Curriculum App';

/**
 * Registers the MCP App widget resource via `registerAppResource`.
 *
 * The widget HTML is a self-contained React app built by Vite and embedded
 * as a committed TypeScript constant at codegen time. It is served as a
 * `text/html;profile=mcp-app` resource per the MCP Apps standard.
 * `registerAppResource` defaults the MIME type to `RESOURCE_MIME_TYPE`.
 *
 * @param server - MCP server instance
 * @param getWidgetHtml - Sync function returning the built widget HTML (DI per ADR-078)
 */
export function registerWidgetResource(
  server: ResourceRegistrar,
  getWidgetHtml: () => string,
): void {
  registerAppResource(
    server,
    WIDGET_RESOURCE_NAME,
    WIDGET_URI,
    {
      description: 'Interactive Oak curriculum MCP App for search and curriculum exploration.',
      _meta: { ui: WIDGET_UI_META },
    },
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
  );
}
