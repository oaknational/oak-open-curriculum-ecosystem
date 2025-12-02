/**
 * Integration tests for MCP resource registration.
 *
 * These tests verify that widget and documentation resources are registered
 * with the correct metadata, including OpenAI Apps SDK _meta fields required
 * for production deployment.
 *
 * @see https://developers.openai.com/apps-sdk/reference
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerWidgetResource, registerDocumentationResources } from './register-resources.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * Creates a mock MCP server for testing resource registration.
 */
function createMockServer(): { server: McpServer; registeredResources: Map<string, unknown> } {
  const registeredResources = new Map<string, unknown>();

  const server = {
    registerResource: vi.fn(
      (
        name: string,
        uri: string,
        metadata: unknown,
        handler: () => { contents: readonly unknown[] },
      ) => {
        const result = handler();
        registeredResources.set(uri, {
          name,
          uri,
          metadata,
          contents: result.contents,
        });
      },
    ),
  } as unknown as McpServer;

  return { server, registeredResources };
}

describe('registerWidgetResource', () => {
  let server: McpServer;
  let registeredResources: Map<string, unknown>;

  beforeEach(() => {
    const mock = createMockServer();
    server = mock.server;
    registeredResources = mock.registeredResources;
  });

  it('registers the widget resource', () => {
    registerWidgetResource(server);

    expect(server.registerResource).toHaveBeenCalledTimes(1);
    expect(registeredResources.has('ui://widget/oak-json-viewer.html')).toBe(true);
  });

  it('includes text/html+skybridge MIME type', () => {
    registerWidgetResource(server);

    const resource = registeredResources.get('ui://widget/oak-json-viewer.html') as {
      contents: readonly { mimeType: string }[];
    };
    expect(resource.contents[0]?.mimeType).toBe('text/html+skybridge');
  });

  describe('OpenAI Apps SDK _meta fields (production requirements)', () => {
    it('includes openai/widgetCSP in resource contents _meta', () => {
      registerWidgetResource(server);

      const resource = registeredResources.get('ui://widget/oak-json-viewer.html') as {
        contents: readonly { _meta?: { 'openai/widgetCSP'?: unknown } }[];
      };
      const meta = resource.contents[0]?._meta;

      expect(meta).toBeDefined();
      expect(meta?.['openai/widgetCSP']).toBeDefined();
    });

    it('CSP allows Google Fonts domains for resource loading', () => {
      registerWidgetResource(server);

      const resource = registeredResources.get('ui://widget/oak-json-viewer.html') as {
        contents: readonly {
          _meta?: { 'openai/widgetCSP'?: { resource_domains?: readonly string[] } };
        }[];
      };
      const csp = resource.contents[0]?._meta?.['openai/widgetCSP'];

      expect(csp?.resource_domains).toContain('https://fonts.googleapis.com');
      expect(csp?.resource_domains).toContain('https://fonts.gstatic.com');
    });

    it('CSP allows Oak domains for connections and resources', () => {
      registerWidgetResource(server);

      const resource = registeredResources.get('ui://widget/oak-json-viewer.html') as {
        contents: readonly {
          _meta?: {
            'openai/widgetCSP'?: {
              connect_domains?: readonly string[];
              resource_domains?: readonly string[];
            };
          };
        }[];
      };
      const csp = resource.contents[0]?._meta?.['openai/widgetCSP'];

      expect(csp?.connect_domains).toContain('https://*.thenational.academy');
      expect(csp?.resource_domains).toContain('https://*.thenational.academy');
    });

    it('includes openai/widgetPrefersBorder: true', () => {
      registerWidgetResource(server);

      const resource = registeredResources.get('ui://widget/oak-json-viewer.html') as {
        contents: readonly { _meta?: { 'openai/widgetPrefersBorder'?: boolean } }[];
      };
      const meta = resource.contents[0]?._meta;

      expect(meta?.['openai/widgetPrefersBorder']).toBe(true);
    });

    it('includes openai/widgetDescription', () => {
      registerWidgetResource(server);

      const resource = registeredResources.get('ui://widget/oak-json-viewer.html') as {
        contents: readonly { _meta?: { 'openai/widgetDescription'?: string } }[];
      };
      const meta = resource.contents[0]?._meta;

      expect(meta?.['openai/widgetDescription']).toBeDefined();
      expect(typeof meta?.['openai/widgetDescription']).toBe('string');
    });

    it('widgetDescription is meaningful and not too long (≤200 chars)', () => {
      registerWidgetResource(server);

      const resource = registeredResources.get('ui://widget/oak-json-viewer.html') as {
        contents: readonly { _meta?: { 'openai/widgetDescription'?: string } }[];
      };
      const description = resource.contents[0]?._meta?.['openai/widgetDescription'];

      expect(description).toBeDefined();
      expect(description?.length).toBeGreaterThan(20);
      expect(description?.length).toBeLessThanOrEqual(200);
      expect(description).toMatch(/oak|curriculum|lesson/i);
    });
  });
});

describe('registerDocumentationResources', () => {
  let server: McpServer;
  let registeredResources: Map<string, unknown>;

  beforeEach(() => {
    const mock = createMockServer();
    server = mock.server;
    registeredResources = mock.registeredResources;
  });

  it('registers documentation resources', () => {
    registerDocumentationResources(server);

    expect(server.registerResource).toHaveBeenCalled();
    expect(registeredResources.size).toBeGreaterThan(0);
  });

  it('all documentation resources have text/markdown MIME type', () => {
    registerDocumentationResources(server);

    for (const [, resource] of registeredResources) {
      const r = resource as { contents: readonly { mimeType: string }[] };
      expect(r.contents[0]?.mimeType).toBe('text/markdown');
    }
  });
});
