/**
 * E2E tests for the Oak JSON viewer widget resource.
 *
 * These tests verify that the widget resource:
 * - Appears in resources/list with correct URI and MIME type
 * - Returns HTML content with Oak branding when read
 * - Includes required elements for ChatGPT widget integration
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
    }),
  ),
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
 * Helper to retrieve widget HTML from the MCP server.
 * Uses two fresh app instances because StreamableHTTPServerTransport
 * serves one client per instance.
 */
async function getWidgetHtml(): Promise<string> {
  // Get widget URI from resources/list
  const { app: listApp } = createStubbedHttpApp();
  const listResponse = await request(listApp)
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

  // Read widget HTML from resources/read (fresh app)
  const { app: readApp } = createStubbedHttpApp();
  const response = await request(readApp)
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
  return parsed.data?.contents[0]?.text ?? '';
}

describe('oak-json-viewer widget resource E2E', () => {
  describe('resources/list', () => {
    it('includes oak-json-viewer widget with correct URI', async () => {
      const { app } = createStubbedHttpApp();

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
      expect(widgetResource?.mimeType).toBe('text/html+skybridge');
    });
  });

  describe('resources/read', () => {
    it('returns HTML content with text/html+skybridge MIME type', async () => {
      // Get widget URI from resources/list
      const { app: listApp } = createStubbedHttpApp();
      const listResponse = await request(listApp)
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

      // Read the widget resource (fresh app — transport is one-client)
      const { app: readApp } = createStubbedHttpApp();
      const response = await request(readApp)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/read',
          params: { uri: widgetUri },
        });

      expect(response.status).toBe(200);

      const envelope = parseSseEnvelope(response.text);
      // Parse envelope.result directly for resource responses
      const parsed = ResourcesReadResultSchema.safeParse(envelope.result);
      expect(parsed.success).toBe(true);

      const contents = parsed.data?.contents ?? [];
      expect(contents).toHaveLength(1);
      expect(contents[0]?.mimeType).toBe('text/html+skybridge');
      // Verify URI matches local dev or production hashed format
      expect(contents[0]?.uri).toMatch(
        /^ui:\/\/widget\/oak-json-viewer-(local|[a-f0-9]{8})\.html$/,
      );
    });

    it('widget HTML includes Lexend font', async () => {
      const html = await getWidgetHtml();

      expect(html).toContain('Lexend');
      expect(html).toContain('fonts.googleapis.com');
    });

    it('widget HTML includes Oak brand colors', async () => {
      const html = await getWidgetHtml();

      // Light mode: soft green background
      expect(html).toContain('#bef2bd');
      // Dark mode: dark forest background
      expect(html).toContain('#1b3d1c');
      // Dark mode: off-white text
      expect(html).toContain('#f0f7f0');
    });

    it('widget HTML includes window.openai integration', async () => {
      const html = await getWidgetHtml();

      // Widget reads tool output from ChatGPT's window.openai API
      expect(html).toContain('window.openai');
      expect(html).toContain('toolOutput');
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
