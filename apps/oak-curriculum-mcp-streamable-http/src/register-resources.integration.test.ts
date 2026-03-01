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
import type { ResourceMetadata } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  registerWidgetResource,
  registerDocumentationResources,
  registerCurriculumModelResource,
  registerAllResources,
  type ResourceRegistrar,
} from './register-resources.js';

interface WidgetCSP {
  connect_domains?: readonly string[];
  resource_domains?: readonly string[];
}

interface WidgetContentMeta {
  'openai/widgetCSP'?: WidgetCSP;
  'openai/widgetPrefersBorder'?: boolean;
  'openai/widgetDescription'?: string;
  'openai/widgetDomain'?: string;
}

interface CapturedResourceContent {
  uri?: string;
  mimeType: string;
  text?: string;
  _meta?: WidgetContentMeta;
}

interface CapturedResource {
  name: string;
  uri: string;
  metadata: ResourceMetadata;
  contents: readonly CapturedResourceContent[];
}

/**
 * Creates a fake server and map to capture registered resources for assertions.
 *
 * MCP SDK's registerResource has overloaded signatures (URL templates, return
 * RegisteredResource). This mock captures only the (name, uri, metadata, handler)
 * overload and calls the handler synchronously. Using untyped vi.fn() so the
 * mock is assignable to the overloaded McpServer.registerResource without casts.
 */
function createMockServer(): {
  server: ResourceRegistrar;
  registeredResources: Map<string, CapturedResource>;
} {
  const registeredResources = new Map<string, CapturedResource>();
  const registerResource = vi.fn();
  registerResource.mockImplementation(
    (
      name: string,
      uri: string,
      metadata: ResourceMetadata,
      handler: () => { contents: readonly CapturedResourceContent[] },
    ) => {
      const result = handler();
      registeredResources.set(uri, { name, uri, metadata, contents: result.contents });
    },
  );
  const server: ResourceRegistrar = { registerResource };
  return { server, registeredResources };
}

function getWidgetUri(registeredResources: Map<string, CapturedResource>): string {
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
  let registeredResources: Map<string, CapturedResource>;

  beforeEach(() => {
    const mock = createMockServer();
    server = mock.server;
    registeredResources = mock.registeredResources;
  });

  it('includes text/html+skybridge MIME type', () => {
    registerWidgetResource(server);

    const widgetUri = getWidgetUri(registeredResources);
    const resource = registeredResources.get(widgetUri);
    expect(resource).toBeDefined();
    expect(resource?.contents[0]?.mimeType).toBe('text/html+skybridge');
  });

  describe('OpenAI Apps SDK _meta fields (production requirements)', () => {
    it('includes openai/widgetCSP in resource contents _meta', () => {
      registerWidgetResource(server);

      const widgetUri = getWidgetUri(registeredResources);
      const resource = registeredResources.get(widgetUri);
      expect(resource).toBeDefined();
      const meta = resource?.contents[0]?._meta;

      expect(meta).toBeDefined();
      expect(meta?.['openai/widgetCSP']).toBeDefined();
    });

    it('CSP allows Google Fonts domains for resource loading', () => {
      registerWidgetResource(server);

      const widgetUri = getWidgetUri(registeredResources);
      const resource = registeredResources.get(widgetUri);
      expect(resource).toBeDefined();
      const csp = resource?.contents[0]?._meta?.['openai/widgetCSP'];

      expect(csp?.resource_domains).toContain('https://fonts.googleapis.com');
      expect(csp?.resource_domains).toContain('https://fonts.gstatic.com');
    });

    it('CSP allows Oak domains for connections and resources', () => {
      registerWidgetResource(server);

      const widgetUri = getWidgetUri(registeredResources);
      const resource = registeredResources.get(widgetUri);
      expect(resource).toBeDefined();
      const csp = resource?.contents[0]?._meta?.['openai/widgetCSP'];

      expect(csp?.connect_domains).toContain('https://*.thenational.academy');
      expect(csp?.resource_domains).toContain('https://*.thenational.academy');
    });

    it('includes openai/widgetPrefersBorder: true', () => {
      registerWidgetResource(server);

      const widgetUri = getWidgetUri(registeredResources);
      const resource = registeredResources.get(widgetUri);
      expect(resource).toBeDefined();
      const meta = resource?.contents[0]?._meta;

      expect(meta?.['openai/widgetPrefersBorder']).toBe(true);
    });

    it('includes openai/widgetDescription', () => {
      registerWidgetResource(server);

      const widgetUri = getWidgetUri(registeredResources);
      const resource = registeredResources.get(widgetUri);
      expect(resource).toBeDefined();
      const meta = resource?.contents[0]?._meta;

      expect(meta?.['openai/widgetDescription']).toBeDefined();
      expect(typeof meta?.['openai/widgetDescription']).toBe('string');
    });

    it('widgetDescription is meaningful and not too long (≤200 chars)', () => {
      registerWidgetResource(server);

      const widgetUri = getWidgetUri(registeredResources);
      const resource = registeredResources.get(widgetUri);
      expect(resource).toBeDefined();
      const description = resource?.contents[0]?._meta?.['openai/widgetDescription'];

      expect(description).toBeDefined();
      expect(description?.length).toBeGreaterThan(20);
      expect(description?.length).toBeLessThanOrEqual(200);
      expect(description).toMatch(/oak|curriculum|lesson/i);
    });

    it('widgetDescription includes orientation guidance', () => {
      registerWidgetResource(server);

      const widgetUri = getWidgetUri(registeredResources);
      const resource = registeredResources.get(widgetUri);
      expect(resource).toBeDefined();
      const description = resource?.contents[0]?._meta?.['openai/widgetDescription'];

      expect(description).toBeDefined();
      expect(description).toMatch(/orientation|domain model/i);
    });

    it('includes openai/widgetDomain when widgetDomain option is provided', () => {
      registerWidgetResource(server, {
        widgetDomain: 'https://curriculum-mcp-alpha.oaknational.dev',
      });

      const widgetUri = getWidgetUri(registeredResources);
      const resource = registeredResources.get(widgetUri);
      expect(resource).toBeDefined();
      const meta = resource?.contents[0]?._meta;

      expect(meta?.['openai/widgetDomain']).toBe('https://curriculum-mcp-alpha.oaknational.dev');
    });

    it('omits openai/widgetDomain when widgetDomain option is not provided', () => {
      registerWidgetResource(server);

      const widgetUri = getWidgetUri(registeredResources);
      const resource = registeredResources.get(widgetUri);
      expect(resource).toBeDefined();
      const meta = resource?.contents[0]?._meta;

      expect(meta?.['openai/widgetDomain']).toBeUndefined();
    });
  });
});

describe('registerDocumentationResources', () => {
  let server: ResourceRegistrar;
  let registeredResources: Map<string, CapturedResource>;

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
      expect(resource.contents[0]?.mimeType).toBe('text/markdown');
    }
  });
});

describe('registerCurriculumModelResource forwards annotations', () => {
  let server: ResourceRegistrar;
  let registeredResources: Map<string, CapturedResource>;

  beforeEach(() => {
    const mock = createMockServer();
    server = mock.server;
    registeredResources = mock.registeredResources;
  });

  it('forwards annotations to server.registerResource', () => {
    registerCurriculumModelResource(server);

    const resource = registeredResources.get('curriculum://model');
    expect(resource).toBeDefined();
    expect(resource?.metadata.annotations).toBeDefined();
    expect(resource?.metadata.annotations?.priority).toBe(1.0);
    expect(resource?.metadata.annotations?.audience).toContain('assistant');
  });

  it('forwards title to server.registerResource', () => {
    registerCurriculumModelResource(server);

    const resource = registeredResources.get('curriculum://model');
    expect(resource).toBeDefined();
    expect(resource?.metadata.title).toBeDefined();
  });
});

describe('registerAllResources excludes ontology resource', () => {
  let server: ResourceRegistrar;
  let registeredResources: Map<string, CapturedResource>;

  beforeEach(() => {
    const mock = createMockServer();
    server = mock.server;
    registeredResources = mock.registeredResources;
  });

  it('does not register curriculum://ontology (replaced by curriculum://model)', () => {
    registerAllResources(server);

    const uris = Array.from(registeredResources.keys());
    expect(uris).not.toContain('curriculum://ontology');
  });

  it('registers curriculum://model', () => {
    registerAllResources(server);

    const uris = Array.from(registeredResources.keys());
    expect(uris).toContain('curriculum://model');
  });
});

describe('registerAllResources registers supplementary data resources', () => {
  let server: ResourceRegistrar;
  let registeredResources: Map<string, CapturedResource>;

  beforeEach(() => {
    const mock = createMockServer();
    server = mock.server;
    registeredResources = mock.registeredResources;
  });

  it('registers curriculum://prerequisite-graph', () => {
    registerAllResources(server);

    const uris = Array.from(registeredResources.keys());
    expect(uris).toContain('curriculum://prerequisite-graph');
  });

  it('registers curriculum://thread-progressions', () => {
    registerAllResources(server);

    const uris = Array.from(registeredResources.keys());
    expect(uris).toContain('curriculum://thread-progressions');
  });

  it('prerequisite graph has priority 0.5 annotations', () => {
    registerAllResources(server);

    const resource = registeredResources.get('curriculum://prerequisite-graph');
    expect(resource).toBeDefined();
    expect(resource?.metadata.annotations?.priority).toBe(0.5);
    expect(resource?.metadata.annotations?.audience).toContain('assistant');
  });

  it('thread progressions has priority 0.5 annotations', () => {
    registerAllResources(server);

    const resource = registeredResources.get('curriculum://thread-progressions');
    expect(resource).toBeDefined();
    expect(resource?.metadata.annotations?.priority).toBe(0.5);
    expect(resource?.metadata.annotations?.audience).toContain('assistant');
  });
});

describe('metadata forwarding — no cherry-picking', () => {
  let server: ResourceRegistrar;
  let registeredResources: Map<string, CapturedResource>;

  beforeEach(() => {
    const mock = createMockServer();
    server = mock.server;
    registeredResources = mock.registeredResources;
  });

  it('documentation resources forward title in metadata', () => {
    registerDocumentationResources(server);

    for (const [, resource] of registeredResources) {
      expect(resource.metadata.title).toBeDefined();
    }
  });

  it('curriculum model forwards annotations without manual field picking', () => {
    registerCurriculumModelResource(server);

    const resource = registeredResources.get('curriculum://model');
    expect(resource).toBeDefined();
    expect(resource?.metadata.annotations).toBeDefined();
    expect(resource?.metadata.annotations?.priority).toBe(1.0);
    expect(resource?.metadata.annotations?.audience).toContain('assistant');
    expect(resource?.metadata.title).toBeDefined();
  });
});
