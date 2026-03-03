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
import { DOCUMENTATION_RESOURCES } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
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

interface CapturedRegistrationCall {
  name: string;
  uri: string;
  metadata: ResourceMetadata;
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
  registrationCalls: CapturedRegistrationCall[];
} {
  const registeredResources = new Map<string, CapturedResource>();
  const registrationCalls: CapturedRegistrationCall[] = [];
  const registerResource = vi.fn();
  registerResource.mockImplementation(
    (
      name: string,
      uri: string,
      metadata: ResourceMetadata,
      handler: () => { contents: readonly CapturedResourceContent[] },
    ) => {
      const result = handler();
      registrationCalls.push({ name, uri, metadata });
      registeredResources.set(uri, { name, uri, metadata, contents: result.contents });
    },
  );
  const server: ResourceRegistrar = { registerResource };
  return { server, registeredResources, registrationCalls };
}

function getWidgetUri(registeredResources: Map<string, CapturedResource>): string {
  const widgetEntry = Array.from(registeredResources.entries()).find(
    ([, resource]) => resource.name === 'oak-json-viewer',
  );
  if (!widgetEntry) {
    throw new Error('Widget resource not found in registered resources');
  }
  const [widgetUri] = widgetEntry;
  return widgetUri;
}

function expectAllDocumentationResourcesRegistered(
  registeredResources: Map<string, CapturedResource>,
  registrationCalls: readonly CapturedRegistrationCall[],
): void {
  expect(DOCUMENTATION_RESOURCES.length).toBeGreaterThan(0);
  expect(registrationCalls).toHaveLength(DOCUMENTATION_RESOURCES.length);

  const expectedUris = DOCUMENTATION_RESOURCES.map((resource) => resource.uri).sort();
  const registeredUris = Array.from(registeredResources.keys()).sort();
  const calledUris = registrationCalls.map((call) => call.uri).sort();
  expect(registeredUris).toStrictEqual(expectedUris);
  expect(calledUris).toStrictEqual(expectedUris);
}

function expectJsonContent(content: CapturedResourceContent | undefined): void {
  expect(content).toBeDefined();
  if (!content) {
    throw new Error('Expected resource content to be defined');
  }

  expect(content.mimeType).toBe('application/json');
  const jsonText = content.text;
  expect(jsonText).toBeDefined();
  if (!jsonText) {
    throw new Error('Expected JSON content text to be defined');
  }

  expect(jsonText.trim().length).toBeGreaterThan(0);
  expect(() => {
    JSON.parse(jsonText);
  }).not.toThrow();
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
      expect(description).toMatch(/get-curriculum-model/i);
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

      expect(meta).toBeDefined();
      expect(meta?.['openai/widgetDomain']).toBeUndefined();
    });
  });
});

describe('registerDocumentationResources', () => {
  let server: ResourceRegistrar;
  let registeredResources: Map<string, CapturedResource>;
  let registrationCalls: CapturedRegistrationCall[];

  beforeEach(() => {
    const mock = createMockServer();
    server = mock.server;
    registeredResources = mock.registeredResources;
    registrationCalls = mock.registrationCalls;
  });

  it('all documentation resources have text/markdown MIME type', () => {
    registerDocumentationResources(server);
    expectAllDocumentationResourcesRegistered(registeredResources, registrationCalls);

    for (const [, resource] of registeredResources) {
      expect(resource.contents[0]?.mimeType).toBe('text/markdown');
    }
  });

  it('all documentation resources forward title in metadata', () => {
    registerDocumentationResources(server);
    expectAllDocumentationResourcesRegistered(registeredResources, registrationCalls);

    for (const [, resource] of registeredResources) {
      expect(resource.metadata.title).toBeDefined();
    }
  });

  it('forwards the expected title for each documentation resource URI', () => {
    registerDocumentationResources(server);
    expectAllDocumentationResourcesRegistered(registeredResources, registrationCalls);

    for (const documentationResource of DOCUMENTATION_RESOURCES) {
      const resource = registeredResources.get(documentationResource.uri);
      expect(resource).toBeDefined();
      expect(resource?.metadata.title).toBe(documentationResource.title);
    }
  });

  it('provides generated content for each documentation resource URI', () => {
    registerDocumentationResources(server);
    expectAllDocumentationResourcesRegistered(registeredResources, registrationCalls);

    for (const documentationResource of DOCUMENTATION_RESOURCES) {
      const resource = registeredResources.get(documentationResource.uri);
      expect(resource).toBeDefined();

      const contentText = resource?.contents[0]?.text;
      expect(contentText).toBeDefined();
      expect(contentText?.trim().length).toBeGreaterThan(0);
      expect(contentText).not.toContain('Content not found');
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
    const title = resource?.metadata.title;
    expect(title).toBeDefined();
    expect(title?.trim().length).toBeGreaterThan(0);
  });

  it('registers parseable JSON content', () => {
    registerCurriculumModelResource(server);

    const resource = registeredResources.get('curriculum://model');
    expect(resource).toBeDefined();
    expectJsonContent(resource?.contents[0]);
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
    expect(uris.length).toBeGreaterThan(0);
    expect(uris).not.toContain('curriculum://ontology');
  });

  it('registers curriculum://model', () => {
    registerAllResources(server);

    const uris = Array.from(registeredResources.keys());
    expect(uris).toContain('curriculum://model');
  });

  it('registers all documentation resource URIs', () => {
    registerAllResources(server);

    expect(DOCUMENTATION_RESOURCES.length).toBeGreaterThan(0);
    const uris = Array.from(registeredResources.keys());
    for (const documentationResource of DOCUMENTATION_RESOURCES) {
      expect(uris).toContain(documentationResource.uri);
    }
  });

  it('registers widget resource', () => {
    registerAllResources(server);

    const widgetUri = getWidgetUri(registeredResources);
    const widgetResource = registeredResources.get(widgetUri);
    expect(widgetResource).toBeDefined();
  });

  it('forwards widget options to widget resource registration', () => {
    registerAllResources(server, {
      widgetDomain: 'https://curriculum-mcp-alpha.oaknational.dev',
    });

    const widgetUri = getWidgetUri(registeredResources);
    const widgetResource = registeredResources.get(widgetUri);
    expect(widgetResource).toBeDefined();
    const widgetMeta = widgetResource?.contents[0]?._meta;
    expect(widgetMeta).toBeDefined();
    expect(widgetMeta?.['openai/widgetDomain']).toBe(
      'https://curriculum-mcp-alpha.oaknational.dev',
    );
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
    expectJsonContent(resource?.contents[0]);
  });

  it('thread progressions has priority 0.5 annotations', () => {
    registerAllResources(server);

    const resource = registeredResources.get('curriculum://thread-progressions');
    expect(resource).toBeDefined();
    expect(resource?.metadata.annotations?.priority).toBe(0.5);
    expect(resource?.metadata.annotations?.audience).toContain('assistant');
    expectJsonContent(resource?.contents[0]);
  });
});
