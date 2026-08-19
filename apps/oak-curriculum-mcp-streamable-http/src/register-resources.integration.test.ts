/**
 * Integration tests for MCP resource registration.
 *
 * These tests verify that documentation, curriculum model, thread
 * progressions, and widget resources are registered with the correct
 * metadata and content — and that the removed whole-corpus graph resources
 * (prior knowledge, misconception) stay unregistered.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { createFakeReadResourceExtra } from './test-helpers/fakes-product-analytics.js';
import { SERVED_SURFACE, type ServedSurfaceDefinition } from './served-surface/served-surface.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { RESOURCE_MIME_TYPE } from '@modelcontextprotocol/ext-apps/server';
import type {
  ResourceTemplate,
  ResourceMetadata,
  ReadResourceCallback,
  ReadResourceTemplateCallback,
  RegisteredResource,
  RegisteredResourceTemplate,
} from '@modelcontextprotocol/sdk/server/mcp.js';
import type { McpUiReadResourceResult } from '@modelcontextprotocol/ext-apps/server';
import {
  DOCUMENTATION_RESOURCES,
  WIDGET_URI,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import {
  registerDocumentationResources,
  registerCurriculumModelResource,
  registerAllResources,
  type ResourceRegistrationOptions,
} from './register-resources.js';

const TEST_WIDGET_HTML = '<!doctype html><html><body>Oak Curriculum App</body></html>';

interface RegisteredResourceCapture {
  name: string;
  uri: string;
  metadata: ResourceMetadata;
}

interface ReadResourceCapture extends RegisteredResourceCapture {
  contents: McpUiReadResourceResult['contents'];
}

type RegisteredResourceMap = Map<string, RegisteredResourceCapture>;

/**
 * Creates a fake server and map to capture registered resources for assertions.
 *
 * The fake delegates to a backing `McpServer` so the overloaded SDK signature
 * stays intact while tests capture the registration inputs as plain data and
 * invoke static reads explicitly.
 *
 * Supports both sync and async resource handlers (observability wrapping makes
 * handlers async). Use `readResource()` to execute a specific static resource
 * read, mirroring the runtime `resources/read` lifecycle.
 */
function createMockServer(): {
  server: Pick<McpServer, 'registerResource'>;
  registeredResources: RegisteredResourceMap;
  registrationCalls: RegisteredResourceCapture[];
  readResource: (uri: string) => Promise<ReadResourceCapture>;
  flush: () => Promise<void>;
} {
  const registeredResources: RegisteredResourceMap = new Map();
  const registrationCalls: RegisteredResourceCapture[] = [];
  const staticResourceCallbacks = new Map<
    string,
    {
      registration: RegisteredResourceCapture;
      readCallback: ReadResourceCallback;
    }
  >();
  const backingServer = new McpServer({ name: 'test-server', version: '1.0.0' });
  const originalRegisterResource = backingServer.registerResource.bind(backingServer);
  const handlerExtra: Parameters<ReadResourceCallback>[1] = createFakeReadResourceExtra();

  function readStaticResourceResult(
    registration: RegisteredResourceCapture,
    result: unknown,
  ): ReadResourceCapture {
    if (!hasResourceContents(result)) {
      throw new Error('Expected resource callback to return a contents array');
    }

    return {
      ...registration,
      contents: result.contents,
    };
  }

  function registerResource(
    name: string,
    uriOrTemplate: string,
    metadata: ResourceMetadata,
    readCallback: ReadResourceCallback,
  ): RegisteredResource;
  function registerResource(
    name: string,
    uriOrTemplate: ResourceTemplate,
    metadata: ResourceMetadata,
    readCallback: ReadResourceTemplateCallback,
  ): RegisteredResourceTemplate;
  function registerResource(
    ...args:
      | [
          name: string,
          uriOrTemplate: string,
          metadata: ResourceMetadata,
          readCallback: ReadResourceCallback,
        ]
      | [
          name: string,
          uriOrTemplate: ResourceTemplate,
          metadata: ResourceMetadata,
          readCallback: ReadResourceTemplateCallback,
        ]
  ): RegisteredResource | RegisteredResourceTemplate {
    if (isStaticResourceRegistration(args)) {
      const registration = { name: args[0], uri: args[1], metadata: args[2] };
      registrationCalls.push(registration);
      registeredResources.set(args[1], registration);
      staticResourceCallbacks.set(args[1], {
        registration,
        readCallback: args[3],
      });

      return originalRegisterResource(args[0], args[1], args[2], args[3]);
    }

    return originalRegisterResource(args[0], args[1], args[2], args[3]);
  }

  const server = { registerResource };

  return {
    server,
    registeredResources,
    registrationCalls,
    async readResource(uri) {
      const registration = staticResourceCallbacks.get(uri);
      if (!registration) {
        throw new Error(`Expected a registered static resource for URI ${uri}`);
      }

      const rawResult = registration.readCallback(new URL(uri), handlerExtra);
      const resolved = rawResult instanceof Promise ? await rawResult : rawResult;
      return readStaticResourceResult(registration.registration, resolved);
    },
    async flush() {
      await Promise.resolve();
    },
  };
}

function hasResourceContents(value: unknown): value is {
  contents: McpUiReadResourceResult['contents'];
} {
  return (
    typeof value === 'object' &&
    value !== null &&
    'contents' in value &&
    Array.isArray(value.contents)
  );
}

function isStaticResourceRegistration(
  args:
    | [
        name: string,
        uriOrTemplate: string,
        metadata: ResourceMetadata,
        readCallback: ReadResourceCallback,
      ]
    | [
        name: string,
        uriOrTemplate: ResourceTemplate,
        metadata: ResourceMetadata,
        readCallback: ReadResourceTemplateCallback,
      ],
): args is [
  name: string,
  uriOrTemplate: string,
  metadata: ResourceMetadata,
  readCallback: ReadResourceCallback,
] {
  return typeof args[1] === 'string';
}

function getTextContent(content: McpUiReadResourceResult['contents'][number] | undefined): string {
  if (!content || !('text' in content) || typeof content.text !== 'string') {
    throw new Error('Expected text resource content');
  }

  return content.text;
}

function expectAllDocumentationResourcesRegistered(
  registeredResources: RegisteredResourceMap,
  registrationCalls: readonly RegisteredResourceCapture[],
): void {
  expect(DOCUMENTATION_RESOURCES.length).toBeGreaterThan(0);
  expect(registrationCalls).toHaveLength(DOCUMENTATION_RESOURCES.length);

  const expectedUris = DOCUMENTATION_RESOURCES.map((resource) => resource.uri).sort((a, b) =>
    a.localeCompare(b),
  );
  const registeredUris = Array.from(registeredResources.keys()).sort((a, b) => a.localeCompare(b));
  const calledUris = registrationCalls.map((call) => call.uri).sort((a, b) => a.localeCompare(b));
  expect(registeredUris).toStrictEqual(expectedUris);
  expect(calledUris).toStrictEqual(expectedUris);
}

function expectJsonContent(content: McpUiReadResourceResult['contents'][number] | undefined): void {
  expect(content).toBeDefined();
  if (!content) {
    throw new Error('Expected resource content to be defined');
  }

  expect(content.mimeType).toBe('application/json');
  const jsonText = getTextContent(content);

  expect(jsonText.trim().length).toBeGreaterThan(0);
  expect(() => {
    JSON.parse(jsonText);
  }).not.toThrow();
}

/** Shared options for all registration tests (the canonical served surface). */
function createTestOptions(
  getWidgetHtml: ResourceRegistrationOptions['getWidgetHtml'] = () => TEST_WIDGET_HTML,
  servedSurface: ServedSurfaceDefinition = SERVED_SURFACE,
): ResourceRegistrationOptions {
  return { getWidgetHtml, servedSurface };
}

describe('registerDocumentationResources', () => {
  let server: Pick<McpServer, 'registerResource'>;
  let registeredResources: RegisteredResourceMap;
  let registrationCalls: RegisteredResourceCapture[];
  let readResource: (uri: string) => Promise<ReadResourceCapture>;
  let flush: () => Promise<void>;

  beforeEach(() => {
    const mock = createMockServer();
    server = mock.server;
    registeredResources = mock.registeredResources;
    registrationCalls = mock.registrationCalls;
    readResource = mock.readResource;
    flush = mock.flush;
  });

  it('all documentation resources have text/markdown MIME type', async () => {
    registerDocumentationResources(server);
    await flush();
    expectAllDocumentationResourcesRegistered(registeredResources, registrationCalls);

    for (const { uri } of registeredResources.values()) {
      const resource = await readResource(uri);
      expect(resource.contents[0]?.mimeType).toBe('text/markdown');
    }
  });

  it('all documentation resources forward title in metadata', async () => {
    registerDocumentationResources(server);
    await flush();
    expectAllDocumentationResourcesRegistered(registeredResources, registrationCalls);

    for (const [, resource] of registeredResources) {
      expect(resource.metadata.title).toBeDefined();
    }
  });

  it('forwards the expected title for each documentation resource URI', async () => {
    registerDocumentationResources(server);
    await flush();
    expectAllDocumentationResourcesRegistered(registeredResources, registrationCalls);

    for (const documentationResource of DOCUMENTATION_RESOURCES) {
      const resource = registeredResources.get(documentationResource.uri);
      expect(resource).toBeDefined();
      expect(resource?.metadata.title).toBe(documentationResource.title);
    }
  });

  it('provides generated content for each documentation resource URI', async () => {
    registerDocumentationResources(server);
    await flush();
    expectAllDocumentationResourcesRegistered(registeredResources, registrationCalls);

    for (const documentationResource of DOCUMENTATION_RESOURCES) {
      const resource = await readResource(documentationResource.uri);
      expect(resource).toBeDefined();

      const contentText = getTextContent(resource?.contents[0]);
      expect(contentText).toBeDefined();
      expect(contentText?.trim().length).toBeGreaterThan(0);
      expect(contentText).not.toContain('Content not found');
    }
  });
});

describe('registerCurriculumModelResource forwards annotations', () => {
  let server: Pick<McpServer, 'registerResource'>;
  let registeredResources: RegisteredResourceMap;
  let readResource: (uri: string) => Promise<ReadResourceCapture>;
  let flush: () => Promise<void>;

  beforeEach(() => {
    const mock = createMockServer();
    server = mock.server;
    registeredResources = mock.registeredResources;
    readResource = mock.readResource;
    flush = mock.flush;
  });

  it('forwards annotations to server.registerResource', async () => {
    registerCurriculumModelResource(server);
    await flush();

    const resource = registeredResources.get('curriculum://model');
    expect(resource).toBeDefined();
    expect(resource?.metadata.annotations).toBeDefined();
    expect(resource?.metadata.annotations?.priority).toBe(1.0);
    expect(resource?.metadata.annotations?.audience).toContain('assistant');
  });

  it('forwards title to server.registerResource', async () => {
    registerCurriculumModelResource(server);
    await flush();

    const resource = registeredResources.get('curriculum://model');
    expect(resource).toBeDefined();
    const title = resource?.metadata.title;
    expect(title).toBeDefined();
    expect(title?.trim().length).toBeGreaterThan(0);
  });

  it('registers parseable JSON content', async () => {
    registerCurriculumModelResource(server);
    await flush();

    const resource = await readResource('curriculum://model');
    expect(resource).toBeDefined();
    expectJsonContent(resource?.contents[0]);
  });
});

describe('registerAllResources registers model and documentation resources', () => {
  let server: Pick<McpServer, 'registerResource'>;
  let registeredResources: RegisteredResourceMap;
  let flush: () => Promise<void>;
  let options: ResourceRegistrationOptions;

  beforeEach(() => {
    const mock = createMockServer();
    server = mock.server;
    registeredResources = mock.registeredResources;
    flush = mock.flush;
    options = createTestOptions();
  });

  it('does not register curriculum://ontology (replaced by curriculum://model)', async () => {
    registerAllResources(server, options);
    await flush();

    const uris = Array.from(registeredResources.keys());
    expect(uris.length).toBeGreaterThan(0);
    expect(uris).not.toContain('curriculum://ontology');
  });

  it('registers curriculum://model', async () => {
    registerAllResources(server, options);
    await flush();

    const uris = Array.from(registeredResources.keys());
    expect(uris).toContain('curriculum://model');
  });

  it('registers all documentation resource URIs', async () => {
    registerAllResources(server, options);
    await flush();

    expect(DOCUMENTATION_RESOURCES.length).toBeGreaterThan(0);
    const uris = Array.from(registeredResources.keys());
    for (const documentationResource of DOCUMENTATION_RESOURCES) {
      expect(uris).toContain(documentationResource.uri);
    }
  });
});

describe('registerAllResources registers supplementary data resources', () => {
  let server: Pick<McpServer, 'registerResource'>;
  let registeredResources: RegisteredResourceMap;
  let flush: () => Promise<void>;
  let options: ResourceRegistrationOptions;

  beforeEach(() => {
    const mock = createMockServer();
    server = mock.server;
    registeredResources = mock.registeredResources;
    flush = mock.flush;
    options = createTestOptions();
  });

  it('does not register the removed curriculum://prior-knowledge-graph (served by the anchored tool)', async () => {
    registerAllResources(server, options);
    await flush();

    const uris = Array.from(registeredResources.keys());
    expect(uris).not.toContain('curriculum://prior-knowledge-graph');
  });

  it('does not register the removed curriculum://misconception-graph (served by the anchored tool)', async () => {
    registerAllResources(server, options);
    await flush();

    const uris = Array.from(registeredResources.keys());
    expect(uris).not.toContain('curriculum://misconception-graph');
  });

  it('does not register the removed curriculum://thread-progressions (served by the anchored tool)', async () => {
    registerAllResources(server, options);
    await flush();

    const uris = Array.from(registeredResources.keys());
    expect(uris).not.toContain('curriculum://thread-progressions');
  });
});

describe('registerAllResources registers the widget resource', () => {
  let server: Pick<McpServer, 'registerResource'>;
  let registeredResources: RegisteredResourceMap;
  let registrationCalls: RegisteredResourceCapture[];
  let readResource: (uri: string) => Promise<ReadResourceCapture>;
  let flush: () => Promise<void>;
  let options: ResourceRegistrationOptions;
  let widgetHtmlReadCount: number;

  beforeEach(() => {
    const mock = createMockServer();
    server = mock.server;
    registeredResources = mock.registeredResources;
    registrationCalls = mock.registrationCalls;
    readResource = mock.readResource;
    flush = mock.flush;
    widgetHtmlReadCount = 0;
    options = createTestOptions(() => {
      widgetHtmlReadCount += 1;
      return TEST_WIDGET_HTML;
    });
  });

  it('registers the canonical widget resource URI', async () => {
    registerAllResources(server, options);
    await flush();

    const uris = Array.from(registeredResources.keys());
    expect(uris).toContain(WIDGET_URI);
  });

  it('advertises widget discovery metadata without reading HTML during registration', async () => {
    registerAllResources(server, options);
    await flush();

    const resource = registeredResources.get(WIDGET_URI);
    expect(resource).toBeDefined();
    expect(resource?.name).toBe('Oak Curriculum App');
    expect(resource?.metadata.mimeType).toBe(RESOURCE_MIME_TYPE);
    expect(resource?.metadata.description).toContain('Oak curriculum MCP App');
    expect(widgetHtmlReadCount).toBe(0);
    expect(registrationCalls.some((call) => call.uri === WIDGET_URI)).toBe(true);
  });

  it('serves widget HTML from the injected provider', async () => {
    registerAllResources(server, options);
    await flush();

    const resource = await readResource(WIDGET_URI);
    expect(resource).toBeDefined();
    expect(resource?.contents[0]?.mimeType).toBe(RESOURCE_MIME_TYPE);
    expect(getTextContent(resource?.contents[0])).toBe(TEST_WIDGET_HTML);
    expect(widgetHtmlReadCount).toBe(1);
  });
});

describe('registerAllResources matches the served-surface definition (drift guard)', () => {
  let server: Pick<McpServer, 'registerResource'>;
  let registeredResources: RegisteredResourceMap;
  let flush: () => Promise<void>;

  beforeEach(() => {
    const mock = createMockServer();
    server = mock.server;
    registeredResources = mock.registeredResources;
    flush = mock.flush;
  });

  it("registers exactly the definition's live resource rows (recomputed, not recorded)", async () => {
    registerAllResources(server, createTestOptions());
    await flush();

    const registeredUris = Array.from(registeredResources.keys()).sort((a, b) =>
      a.localeCompare(b),
    );
    const liveUris = Object.entries(SERVED_SURFACE.resources)
      .filter(([, state]) => state === 'live')
      .map(([uri]) => uri)
      .sort((a, b) => a.localeCompare(b));

    expect(registeredUris).toStrictEqual(liveUris);
    // The creation-oriented guidance documents are dormant: retained in the
    // catalogue, structurally absent from registration (D11 ratified live-set).
    expect(registeredUris).not.toContain('docs://oak/guidance/lesson-planning.md');
  });

  it('a dormant row removes its resource — the definition governs, not any flag', async () => {
    // Targets a canonically-LIVE row so this is a live->dormant flip
    // demonstration: the definition alone removes the resource.
    const withModelDormant = {
      ...SERVED_SURFACE,
      resources: { ...SERVED_SURFACE.resources, 'curriculum://model': 'dormant' as const },
    };
    registerAllResources(server, createTestOptions(undefined, withModelDormant));
    await flush();

    const uris = Array.from(registeredResources.keys());
    expect(uris).not.toContain('curriculum://model');
  });
});
