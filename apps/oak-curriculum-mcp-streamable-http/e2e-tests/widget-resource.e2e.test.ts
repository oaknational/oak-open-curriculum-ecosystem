/**
 * E2E tests for the Oak JSON viewer widget resource.
 *
 * These tests verify that the widget resource:
 * - Appears in resources/list with correct URI and MIME type
 * - Returns HTML content with Oak branding when read
 * - Includes required elements for the current widget runtime
 *
 * The tests exercise the full MCP protocol path from HTTP request to response.
 */

import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createStubbedHttpApp, STUB_ACCEPT_HEADER } from './helpers/create-stubbed-http-app.js';
import { parseSseEnvelope } from './helpers/sse.js';
import { z } from 'zod';

/**
 * Schema for validating resource list entries.
 */
const ResourceListEntrySchema = z.object({
  uri: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  mimeType: z.string().optional(),
});

/**
 * Schema for validating resources/list result.
 *
 * Note: We parse envelope.result directly (not via parseJsonRpcResult) because
 * resource responses have different fields than tool responses.
 */
const ResourcesListResultSchema = z.object({
  resources: z.array(ResourceListEntrySchema),
});

/**
 * Schema for validating resources/read result.
 */
const ResourcesReadResultSchema = z.object({
  contents: z.array(
    z.object({
      uri: z.string(),
      mimeType: z.string().optional(),
      text: z.string().optional(),
      _meta: z
        .object({
          ui: z
            .object({
              prefersBorder: z.boolean().optional(),
              domain: z.string().optional(),
              csp: z
                .object({
                  connectDomains: z.array(z.string()).optional(),
                  resourceDomains: z.array(z.string()).optional(),
                  frameDomains: z.array(z.string()).optional(),
                })
                .optional(),
            })
            .optional(),
        })
        .optional(),
    }),
  ),
});

const WidgetUiMetadataSchema = z.object({
  _meta: z.object({
    ui: z.object({
      prefersBorder: z.boolean().optional(),
      domain: z.string().optional(),
      csp: z.object({
        connectDomains: z.array(z.string()).optional(),
        resourceDomains: z.array(z.string()).optional(),
        frameDomains: z.array(z.string()).optional(),
      }),
    }),
  }),
});

/**
 * Retrieves the widget URI from a fresh stubbed app's resources/list.
 */
function getWidgetUri(listEnvelope: ReturnType<typeof parseSseEnvelope>): string {
  const listParsed = ResourcesListResultSchema.safeParse(listEnvelope.result);
  const resources = listParsed.data?.resources ?? [];
  // Match both local dev builds (local) and production builds (8-char hex)
  return (
    resources.find((r) => r.uri.match(/^ui:\/\/widget\/oak-json-viewer-(local|[a-f0-9]{8})\.html$/))
      ?.uri ?? ''
  );
}

/**
 * Reads the widget resource from the MCP server.
 *
 * Sends resources/list then resources/read to the same app instance.
 * Per-request transport creates a fresh McpServer + transport per request.
 */
async function readWidgetResource(): Promise<
  z.infer<typeof ResourcesReadResultSchema>['contents'][number] | undefined
> {
  const { app } = await createStubbedHttpApp();

  // Get widget URI from resources/list
  const listResponse = await request(app)
    .post('/mcp')
    .set('Host', 'localhost')
    .set('Accept', STUB_ACCEPT_HEADER)
    .send({
      jsonrpc: '2.0',
      id: 'list1',
      method: 'resources/list',
    });
  const listEnvelope = parseSseEnvelope(listResponse.text);
  const widgetUri = getWidgetUri(listEnvelope);

  // Read widget HTML from resources/read (same app, per-request transport)
  const response = await request(app)
    .post('/mcp')
    .set('Host', 'localhost')
    .set('Accept', STUB_ACCEPT_HEADER)
    .send({
      jsonrpc: '2.0',
      id: '1',
      method: 'resources/read',
      params: { uri: widgetUri },
    });

  const envelope = parseSseEnvelope(response.text);
  const parsed = ResourcesReadResultSchema.safeParse(envelope.result);
  return parsed.data?.contents[0];
}

/**
 * Helper to retrieve widget HTML from the MCP server.
 */
async function getWidgetHtml(): Promise<string> {
  const content = await readWidgetResource();
  return content?.text ?? '';
}

function parseWidgetUiMetadata(content: unknown) {
  const parsed = WidgetUiMetadataSchema.safeParse(content);
  if (!parsed.success) {
    throw new Error('Expected widget resource to include MCP Apps ui metadata');
  }

  return parsed.data._meta.ui;
}

describe('oak-json-viewer widget resource E2E', () => {
  describe('resources/list', () => {
    it('includes oak-json-viewer widget with correct URI', async () => {
      const { app } = await createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/list',
        });

      expect(response.status).toBe(200);

      const envelope = parseSseEnvelope(response.text);
      // Parse envelope.result directly for resource responses
      const parsed = ResourcesListResultSchema.safeParse(envelope.result);
      expect(parsed.success).toBe(true);

      const resources = parsed.data?.resources ?? [];
      // Match both local dev builds (local) and production builds (8-char hex)
      const widgetResource = resources.find((r) =>
        r.uri.match(/^ui:\/\/widget\/oak-json-viewer-(local|[a-f0-9]{8})\.html$/),
      );

      expect(widgetResource).toBeDefined();
      expect(widgetResource?.mimeType).toBe('text/html;profile=mcp-app');
    });
  });

  describe('resources/read', () => {
    it('returns HTML content with MCP Apps MIME type', async () => {
      const content = await readWidgetResource();
      expect(content).toBeDefined();
      expect(content?.mimeType).toBe('text/html;profile=mcp-app');
    });

    it('returns the hashed widget resource URI', async () => {
      const content = await readWidgetResource();
      expect(content).toBeDefined();
      expect(content?.uri).toMatch(/^ui:\/\/widget\/oak-json-viewer-(local|[a-f0-9]{8})\.html$/);
    });

    it('includes MCP Apps ui._meta fields on resources/read', async () => {
      const content = await readWidgetResource();
      const ui = parseWidgetUiMetadata(content);
      expect(ui.prefersBorder).toBe(true);
      expect(ui.domain).toBeUndefined();
      expect(ui.csp.connectDomains).toBeUndefined();
      expect(ui.csp.resourceDomains).toContain('https://fonts.googleapis.com');
      expect(ui.csp.resourceDomains).toContain('https://fonts.gstatic.com');
    });

    it('widget HTML includes Lexend font', async () => {
      const html = await getWidgetHtml();

      expect(html).toContain('Lexend');
      expect(html).toContain('fonts.googleapis.com');
    });

    it('widget HTML includes light and dark theme support', async () => {
      const html = await getWidgetHtml();

      expect(html).toContain('color-scheme: light dark');
      expect(html).toContain('prefers-color-scheme: dark');
      expect(html).toContain('--bg:');
    });

    it('widget HTML includes Oak National Academy logo', async () => {
      const html = await getWidgetHtml();

      // Test behavior: Logo branding is present
      expect(html).toContain('Oak National Academy');

      // Test behavior: Logo is visually present (SVG or base64 image)
      const hasVisualLogo = html.includes('<svg') || html.includes('data:image/');
      expect(hasVisualLogo).toBe(true);
    });
  });
});
