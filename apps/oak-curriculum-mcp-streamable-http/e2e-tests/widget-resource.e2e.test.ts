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
      const widgetResource = resources.find((r) => r.uri === 'ui://widget/oak-json-viewer.html');

      expect(widgetResource).toBeDefined();
      expect(widgetResource?.mimeType).toBe('text/html+skybridge');
    });
  });

  describe('resources/read', () => {
    it('returns HTML content with text/html+skybridge MIME type', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/read',
          params: { uri: 'ui://widget/oak-json-viewer.html' },
        });

      expect(response.status).toBe(200);

      const envelope = parseSseEnvelope(response.text);
      // Parse envelope.result directly for resource responses
      const parsed = ResourcesReadResultSchema.safeParse(envelope.result);
      expect(parsed.success).toBe(true);

      const contents = parsed.data?.contents ?? [];
      expect(contents).toHaveLength(1);
      expect(contents[0]?.mimeType).toBe('text/html+skybridge');
      expect(contents[0]?.uri).toBe('ui://widget/oak-json-viewer.html');
    });

    it('widget HTML includes Lexend font', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/read',
          params: { uri: 'ui://widget/oak-json-viewer.html' },
        });

      const envelope = parseSseEnvelope(response.text);
      const parsed = ResourcesReadResultSchema.safeParse(envelope.result);
      const html = parsed.data?.contents[0]?.text ?? '';

      expect(html).toContain('Lexend');
      expect(html).toContain('fonts.googleapis.com');
    });

    it('widget HTML includes Oak brand colors', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/read',
          params: { uri: 'ui://widget/oak-json-viewer.html' },
        });

      const envelope = parseSseEnvelope(response.text);
      const parsed = ResourcesReadResultSchema.safeParse(envelope.result);
      const html = parsed.data?.contents[0]?.text ?? '';

      // Light mode: soft green background
      expect(html).toContain('#bef2bd');
      // Dark mode: dark forest background
      expect(html).toContain('#1b3d1c');
      // Dark mode: off-white text
      expect(html).toContain('#f0f7f0');
    });

    it('widget HTML includes window.openai integration', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/read',
          params: { uri: 'ui://widget/oak-json-viewer.html' },
        });

      const envelope = parseSseEnvelope(response.text);
      const parsed = ResourcesReadResultSchema.safeParse(envelope.result);
      const html = parsed.data?.contents[0]?.text ?? '';

      // Widget reads tool output from ChatGPT's window.openai API
      expect(html).toContain('window.openai');
      expect(html).toContain('toolOutput');
    });

    it('widget HTML includes Oak National Academy logo', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/read',
          params: { uri: 'ui://widget/oak-json-viewer.html' },
        });

      const envelope = parseSseEnvelope(response.text);
      const parsed = ResourcesReadResultSchema.safeParse(envelope.result);
      const html = parsed.data?.contents[0]?.text ?? '';

      // Test behavior: Logo branding is present
      expect(html).toContain('Oak National Academy');

      // Test behavior: Logo container exists in header
      expect(html).toContain('class="logo"');

      // Test behavior: Logo is present (accept SVG or PNG - both prove logo exists)
      const hasLogo = html.includes('<svg') || html.includes('data:image/');
      expect(hasLogo).toBe(true);
    });
  });
});
