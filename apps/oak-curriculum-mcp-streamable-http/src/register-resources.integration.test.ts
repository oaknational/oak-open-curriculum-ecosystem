/**
 * Integration tests for MCP resource registration.
 *
 * These tests verify that documentation, curriculum model, prerequisite graph,
 * and thread progressions resources are registered with the correct metadata
 * and content.
 *
 * Widget resource tests were removed as part of WS3 Phase 1 (legacy widget
 * framework deletion). Phase 2-3 will re-introduce widget registration tests.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type {
  ResourceTemplate,
  ResourceMetadata,
  ReadResourceCallback,
  ReadResourceTemplateCallback,
  RegisteredResource,
  RegisteredResourceTemplate,
} from '@modelcontextprotocol/sdk/server/mcp.js';
import type { McpUiReadResourceResult } from '@modelcontextprotocol/ext-apps/server';
import { DOCUMENTATION_RESOURCES } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import {
  registerDocumentationResources,
  registerCurriculumModelResource,
  registerAllResources,
  type ResourceRegistrationOptions,
} from './register-resources.js';
import { createFakeHttpObservability } from './test-helpers/fakes.js';

/**
 * Creates a fake server and map to capture registered resources for assertions.
 *
 * The fake delegates to a backing `McpServer` so the overloaded SDK signature
 * stays intact while tests capture the registration inputs and read callback
 * output as plain data.
 *
 * Supports both sync and async resource handlers (observability wrapping
 * makes handlers async). Use `flush()` to resolve all pending async handlers.
 */
function createMockServer(): {
  server: Pick<McpServer, 'registerResource'>;
  registeredResources: Map<
    string,
    {
      name: string;
      uri: string;
      metadata: ResourceMetadata;
      contents: McpUiReadResourceResult['contents'];
    }
  >;
  registrationCalls: { name: string; uri: string; metadata: ResourceMetadata }[];
  flush: () => Promise<void>;
} {
  const registeredResources = new Map<
    string,
    {
      name: string;
      uri: string;
      metadata: ResourceMetadata;
      contents: McpUiReadResourceResult['contents'];
    }
  >();
  const registrationCalls: { name: string; uri: string; metadata: ResourceMetadata }[] = [];
  const pending: Promise<void>[] = [];
  const backingServer = new McpServer({ name: 'test-server', version: '1.0.0' });
  const originalRegisterResource = backingServer.registerResource.bind(backingServer);
  const handlerExtra: Parameters<ReadResourceCallback>[1] = {
    signal: AbortSignal.abort(),
    requestId: 'test-request',
    async sendNotification() {
      return undefined;
    },
    async sendRequest() {
      throw new Error('sendRequest is not supported in this test fake');
    },
  };

  function processResult(
    name: string,
    uri: string,
    metadata: ResourceMetadata,
    result: unknown,
  ): void {
    if (!hasResourceContents(result)) {
      throw new Error('Expected resource callback to return a contents array');
    }

    registrationCalls.push({ name, uri, metadata });
    registeredResources.set(uri, { name, uri, metadata, contents: result.contents });
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
      const rawResult = args[3](new URL(args[1]), handlerExtra);

      if (rawResult instanceof Promise) {
        pending.push(
          rawResult.then((resolved) => processResult(args[0], args[1], args[2], resolved)),
        );
      } else {
        processResult(args[0], args[1], args[2], rawResult);
      }

      return originalRegisterResource(args[0], args[1], args[2], args[3]);
    }

    return originalRegisterResource(args[0], args[1], args[2], args[3]);
  }

  const server = { registerResource };

  return {
    server,
    registeredResources,
    registrationCalls,
    async flush() {
      await Promise.all(pending);
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
  registeredResources: Map<
    string,
    {
      name: string;
      uri: string;
      metadata: ResourceMetadata;
      contents: McpUiReadResourceResult['contents'];
    }
  >,
  registrationCalls: readonly { name: string; uri: string; metadata: ResourceMetadata }[],
): void {
  expect(DOCUMENTATION_RESOURCES.length).toBeGreaterThan(0);
  expect(registrationCalls).toHaveLength(DOCUMENTATION_RESOURCES.length);

  const expectedUris = DOCUMENTATION_RESOURCES.map((resource) => resource.uri).sort();
  const registeredUris = Array.from(registeredResources.keys()).sort();
  const calledUris = registrationCalls.map((call) => call.uri).sort();
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

/** Shared observability options for all registration tests. */
function createTestOptions(): ResourceRegistrationOptions {
  return { observability: createFakeHttpObservability() };
}

describe('registerDocumentationResources', () => {
  let server: Pick<McpServer, 'registerResource'>;
  let registeredResources: Map<
    string,
    {
      name: string;
      uri: string;
      metadata: ResourceMetadata;
      contents: McpUiReadResourceResult['contents'];
    }
  >;
  let registrationCalls: { name: string; uri: string; metadata: ResourceMetadata }[];
  let flush: () => Promise<void>;
  let observability: ResourceRegistrationOptions['observability'];

  beforeEach(() => {
    const mock = createMockServer();
    server = mock.server;
    registeredResources = mock.registeredResources;
    registrationCalls = mock.registrationCalls;
    flush = mock.flush;
    observability = createFakeHttpObservability();
  });

  it('all documentation resources have text/markdown MIME type', async () => {
    registerDocumentationResources(server, observability);
    await flush();
    expectAllDocumentationResourcesRegistered(registeredResources, registrationCalls);

    for (const [, resource] of registeredResources) {
      expect(resource.contents[0]?.mimeType).toBe('text/markdown');
    }
  });

  it('all documentation resources forward title in metadata', async () => {
    registerDocumentationResources(server, observability);
    await flush();
    expectAllDocumentationResourcesRegistered(registeredResources, registrationCalls);

    for (const [, resource] of registeredResources) {
      expect(resource.metadata.title).toBeDefined();
    }
  });

  it('forwards the expected title for each documentation resource URI', async () => {
    registerDocumentationResources(server, observability);
    await flush();
    expectAllDocumentationResourcesRegistered(registeredResources, registrationCalls);

    for (const documentationResource of DOCUMENTATION_RESOURCES) {
      const resource = registeredResources.get(documentationResource.uri);
      expect(resource).toBeDefined();
      expect(resource?.metadata.title).toBe(documentationResource.title);
    }
  });

  it('provides generated content for each documentation resource URI', async () => {
    registerDocumentationResources(server, observability);
    await flush();
    expectAllDocumentationResourcesRegistered(registeredResources, registrationCalls);

    for (const documentationResource of DOCUMENTATION_RESOURCES) {
      const resource = registeredResources.get(documentationResource.uri);
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
  let registeredResources: Map<
    string,
    {
      name: string;
      uri: string;
      metadata: ResourceMetadata;
      contents: McpUiReadResourceResult['contents'];
    }
  >;
  let flush: () => Promise<void>;
  let observability: ResourceRegistrationOptions['observability'];

  beforeEach(() => {
    const mock = createMockServer();
    server = mock.server;
    registeredResources = mock.registeredResources;
    flush = mock.flush;
    observability = createFakeHttpObservability();
  });

  it('forwards annotations to server.registerResource', async () => {
    registerCurriculumModelResource(server, observability);
    await flush();

    const resource = registeredResources.get('curriculum://model');
    expect(resource).toBeDefined();
    expect(resource?.metadata.annotations).toBeDefined();
    expect(resource?.metadata.annotations?.priority).toBe(1.0);
    expect(resource?.metadata.annotations?.audience).toContain('assistant');
  });

  it('forwards title to server.registerResource', async () => {
    registerCurriculumModelResource(server, observability);
    await flush();

    const resource = registeredResources.get('curriculum://model');
    expect(resource).toBeDefined();
    const title = resource?.metadata.title;
    expect(title).toBeDefined();
    expect(title?.trim().length).toBeGreaterThan(0);
  });

  it('registers parseable JSON content', async () => {
    registerCurriculumModelResource(server, observability);
    await flush();

    const resource = registeredResources.get('curriculum://model');
    expect(resource).toBeDefined();
    expectJsonContent(resource?.contents[0]);
  });
});

describe('registerAllResources registers model and documentation resources', () => {
  let server: Pick<McpServer, 'registerResource'>;
  let registeredResources: Map<
    string,
    {
      name: string;
      uri: string;
      metadata: ResourceMetadata;
      contents: McpUiReadResourceResult['contents'];
    }
  >;
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
  let registeredResources: Map<
    string,
    {
      name: string;
      uri: string;
      metadata: ResourceMetadata;
      contents: McpUiReadResourceResult['contents'];
    }
  >;
  let flush: () => Promise<void>;
  let options: ResourceRegistrationOptions;

  beforeEach(() => {
    const mock = createMockServer();
    server = mock.server;
    registeredResources = mock.registeredResources;
    flush = mock.flush;
    options = createTestOptions();
  });

  it('registers curriculum://prerequisite-graph', async () => {
    registerAllResources(server, options);
    await flush();

    const uris = Array.from(registeredResources.keys());
    expect(uris).toContain('curriculum://prerequisite-graph');
  });

  it('registers curriculum://thread-progressions', async () => {
    registerAllResources(server, options);
    await flush();

    const uris = Array.from(registeredResources.keys());
    expect(uris).toContain('curriculum://thread-progressions');
  });

  it('prerequisite graph has priority 0.5 annotations', async () => {
    registerAllResources(server, options);
    await flush();

    const resource = registeredResources.get('curriculum://prerequisite-graph');
    expect(resource).toBeDefined();
    expect(resource?.metadata.annotations?.priority).toBe(0.5);
    expect(resource?.metadata.annotations?.audience).toContain('assistant');
    expectJsonContent(resource?.contents[0]);
  });

  it('thread progressions has priority 0.5 annotations', async () => {
    registerAllResources(server, options);
    await flush();

    const resource = registeredResources.get('curriculum://thread-progressions');
    expect(resource).toBeDefined();
    expect(resource?.metadata.annotations?.priority).toBe(0.5);
    expect(resource?.metadata.annotations?.audience).toContain('assistant');
    expectJsonContent(resource?.contents[0]);
  });
});
