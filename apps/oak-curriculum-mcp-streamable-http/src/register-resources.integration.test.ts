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
import {
  registerWidgetResource,
  registerDocumentationResources,
  type ResourceRegistrar,
} from './register-resources.js';

/**
 * Creates a fake server and map to capture registered resources for assertions.
 * Uses ResourceRegistrar so only registerResource is required.
 */
function createMockServer(): {
  server: ResourceRegistrar;
  registeredResources: Map<string, unknown>;
} {
  const registeredResources = new Map<string, unknown>();
  // MCP SDK registerResource has overloaded signature (ReadResourceCallback with URL param);
  // we only need to capture (name, uri, metadata, handler) and call handler(). Cast required.
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
  };
  return { server: server as unknown as ResourceRegistrar, registeredResources };
}

/**
 * Helper to find the dynamically-generated widget URI.
 */
function getWidgetUri(registeredResources: Map<string, unknown>): string {
  const widgetUri = Array.from(registeredResources.keys()).find((uri) =>
    uri.match(/^ui:\/\/widget\/oak-json-viewer-(?:[a-f0-9]{8}|local)\.html$/),
  );
  if (!widgetUri) {
    throw new Error('Widget URI not found in registered resources');
  }
  return widgetUri;
}

describe('registerWidgetResource', () => {
  let server: ResourceRegistrar;
  let registeredResources: Map<string, unknown>;

  beforeEach(() => {
    const mock = createMockServer();
    server = mock.server;
    registeredResources = mock.registeredResources;
  });

  it('includes text/html+skybridge MIME type', () => {
    registerWidgetResource(server);

    // Find the widget URI dynamically
    const widgetUri = getWidgetUri(registeredResources);
    const resource = registeredResources.get(widgetUri) as {
      contents: readonly { mimeType: string }[];
    };
    expect(resource.contents[0]?.mimeType).toBe('text/html+skybridge');
  });

  describe('OpenAI Apps SDK _meta fields (production requirements)', () => {
    it('includes openai/widgetCSP in resource contents _meta', () => {
      registerWidgetResource(server);

      const widgetUri = getWidgetUri(registeredResources);
      const resource = registeredResources.get(widgetUri) as {
        contents: readonly { _meta?: { 'openai/widgetCSP'?: unknown } }[];
      };
      const meta = resource.contents[0]?._meta;

      expect(meta).toBeDefined();
      expect(meta?.['openai/widgetCSP']).toBeDefined();
    });

    it('CSP allows Google Fonts domains for resource loading', () => {
      registerWidgetResource(server);

      const widgetUri = getWidgetUri(registeredResources);
      const resource = registeredResources.get(widgetUri) as {
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

      const widgetUri = getWidgetUri(registeredResources);
      const resource = registeredResources.get(widgetUri) as {
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

      const widgetUri = getWidgetUri(registeredResources);
      const resource = registeredResources.get(widgetUri) as {
        contents: readonly { _meta?: { 'openai/widgetPrefersBorder'?: boolean } }[];
      };
      const meta = resource.contents[0]?._meta;

      expect(meta?.['openai/widgetPrefersBorder']).toBe(true);
    });

    it('includes openai/widgetDescription', () => {
      registerWidgetResource(server);

      const widgetUri = getWidgetUri(registeredResources);
      const resource = registeredResources.get(widgetUri) as {
        contents: readonly { _meta?: { 'openai/widgetDescription'?: string } }[];
      };
      const meta = resource.contents[0]?._meta;

      expect(meta?.['openai/widgetDescription']).toBeDefined();
      expect(typeof meta?.['openai/widgetDescription']).toBe('string');
    });

    it('widgetDescription is meaningful and not too long (≤200 chars)', () => {
      registerWidgetResource(server);

      const widgetUri = getWidgetUri(registeredResources);
      const resource = registeredResources.get(widgetUri) as {
        contents: readonly { _meta?: { 'openai/widgetDescription'?: string } }[];
      };
      const description = resource.contents[0]?._meta?.['openai/widgetDescription'];

      expect(description).toBeDefined();
      expect(description?.length).toBeGreaterThan(20);
      expect(description?.length).toBeLessThanOrEqual(200);
      expect(description).toMatch(/oak|curriculum|lesson/i);
    });

    it('widgetDescription includes orientation guidance', () => {
      registerWidgetResource(server);

      const widgetUri = getWidgetUri(registeredResources);
      const resource = registeredResources.get(widgetUri) as {
        contents: readonly { _meta?: { 'openai/widgetDescription'?: string } }[];
      };
      const description = resource.contents[0]?._meta?.['openai/widgetDescription'];

      expect(description).toBeDefined();
      expect(description).toMatch(/orientation|domain model/i);
    });

    it('includes openai/widgetDomain when widgetDomain option is provided', () => {
      registerWidgetResource(server, {
        widgetDomain: 'https://curriculum-mcp-alpha.oaknational.dev',
      });

      const widgetUri = getWidgetUri(registeredResources);
      const resource = registeredResources.get(widgetUri) as {
        contents: readonly { _meta?: { 'openai/widgetDomain'?: string } }[];
      };
      const meta = resource.contents[0]?._meta;

      expect(meta?.['openai/widgetDomain']).toBe('https://curriculum-mcp-alpha.oaknational.dev');
    });

    it('omits openai/widgetDomain when widgetDomain option is not provided', () => {
      registerWidgetResource(server);

      const widgetUri = getWidgetUri(registeredResources);
      const resource = registeredResources.get(widgetUri) as {
        contents: readonly { _meta?: { 'openai/widgetDomain'?: string } }[];
      };
      const meta = resource.contents[0]?._meta;

      expect(meta?.['openai/widgetDomain']).toBeUndefined();
    });
  });
});

describe('registerDocumentationResources', () => {
  let server: ResourceRegistrar;
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
