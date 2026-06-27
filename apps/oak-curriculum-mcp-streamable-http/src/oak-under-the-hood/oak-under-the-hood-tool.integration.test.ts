/**
 * Integration tests for the oak-under-the-hood tool registration (pointer shape).
 *
 * Behaviour under test:
 * 1. `registerOakUnderTheHoodTool` registers the oak-under-the-hood tool on a real `McpServer`
 *    under its name, declaring an explicit empty CLOSED `inputSchema` (zero-arg,
 *    empty Zod raw shape) and no `outputSchema` (ADR-058 free-form
 *    `structuredContent`), with `openWorldHint: true` (the tool points OUT to a
 *    fetched external canonical).
 * 2. Via `registerHandlers`, the oak-under-the-hood tool COEXISTS with the SDK
 *    universal/generated tools in one `tools/list` — the additive registration
 *    does not disturb the universal-tools loop.
 *
 * Registration is observed with `vi.spyOn` on the injected server (DI per
 * ADR-078), never module replacement. The wire-level closed-schema form
 * (`additionalProperties: false`) is asserted end-to-end in the e2e test.
 */

import { describe, it, expect, vi } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  listUniversalTools,
  generatedToolRegistry,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import {
  registerOakUnderTheHoodTool,
  OAK_UNDER_THE_HOOD_TOOL_NAME,
} from './oak-under-the-hood-tool.js';
import { registerHandlers } from '../handlers.js';
import {
  createFakeSearchRetrieval,
  createFakeLogger,
  createFakeHttpObservability,
} from '../test-helpers/fakes.js';
import { createMockRuntimeConfig } from '../test-helpers/auth-error-test-helpers.js';

describe('Oak: Under the Hood tool registration (integration)', () => {
  it('registers the oak-under-the-hood tool with a closed empty inputSchema, no outputSchema, openWorldHint', () => {
    const server = new McpServer({ name: 'test-server', version: '0.0.0' });
    const spy = vi.spyOn(server, 'registerTool');

    registerOakUnderTheHoodTool(server);

    const call = spy.mock.calls.find((c) => c[0] === OAK_UNDER_THE_HOOD_TOOL_NAME);
    expect(call).toBeDefined();
    const config = call?.[1];
    expect(config).toHaveProperty('description');
    // Declares a closed empty inputSchema (z.object({}).strict()), not omitted; the
    // wire-level closed form (additionalProperties:false) is asserted in the e2e test.
    expect(config).toHaveProperty('inputSchema');
    // No outputSchema: the result body is a free-form pointer.
    expect(config).not.toHaveProperty('outputSchema');
    // Points OUT to a fetched external canonical, read-only.
    expect(config).toMatchObject({ annotations: { openWorldHint: true, readOnlyHint: true } });
  });

  it('coexists with the universal/generated tools in tools/list registration', () => {
    const server = new McpServer({ name: 'test-server', version: '0.0.0' });
    const spy = vi.spyOn(server, 'registerTool');

    registerHandlers(server, {
      runtimeConfig: createMockRuntimeConfig({ eefEnabled: true, userSearchEnabled: true }),
      logger: createFakeLogger(),
      observability: createFakeHttpObservability(),
      searchRetrieval: createFakeSearchRetrieval(),
      getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
    });

    const registeredNames = spy.mock.calls.map((c) => c[0]);
    // The oak-under-the-hood tool is present...
    expect(registeredNames).toContain(OAK_UNDER_THE_HOOD_TOOL_NAME);
    // ...and the universal tools are still all registered alongside it.
    for (const tool of listUniversalTools(generatedToolRegistry)) {
      expect(registeredNames).toContain(tool.name);
    }
  });
});
