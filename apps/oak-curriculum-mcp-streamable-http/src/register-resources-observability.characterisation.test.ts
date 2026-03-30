/**
 * Characterisation Test: Resource and prompt observability threading
 *
 * Verifies that `registerAllResources` and `registerPrompts` receive and
 * thread the `observability` parameter through to resource/prompt handlers.
 *
 * Safety net for merge — these functions gain new parameters and patterns
 * from main's consolidated registration; the observability threading must
 * survive.
 *
 * Uses DI and simple fakes — no `vi.mock`, no global state.
 */

import { describe, it, expect, vi } from 'vitest';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerAllResources, registerPrompts } from './register-resources.js';
import { createFakeHttpObservability } from './test-helpers/fakes.js';

/**
 * Minimal recording fake for `ResourceRegistrar` / `McpServer`.
 * Records all `registerResource` and `registerPrompt` calls.
 */
function createRecordingServer(): {
  readonly server: McpServer;
  readonly resourceCalls: readonly { readonly name: string }[];
  readonly promptCalls: readonly { readonly name: string }[];
} {
  const resourceCalls: { readonly name: string }[] = [];
  const promptCalls: { readonly name: string }[] = [];

  const server = {
    registerResource: vi.fn((name: string) => {
      resourceCalls.push({ name });
    }),
    registerPrompt: vi.fn((name: string) => {
      promptCalls.push({ name });
    }),
    registerTool: vi.fn(),
  };

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- McpServer has many members; minimal recording fake for characterisation tests
  return { server: server as unknown as McpServer, resourceCalls, promptCalls };
}

describe('registerAllResources — observability characterisation', () => {
  it('registers resources when observability is provided', () => {
    const observability = createFakeHttpObservability();
    const { server, resourceCalls } = createRecordingServer();

    registerAllResources(server, { observability });

    // At minimum, the widget and documentation resources should be registered.
    expect(resourceCalls.length).toBeGreaterThanOrEqual(2);
  });

  it('calls createMcpObservationOptions via the observability parameter', () => {
    const observability = createFakeHttpObservability();
    const createMcpSpy = vi.fn(observability.createMcpObservationOptions.bind(observability));
    const scopedObservability = { ...observability, createMcpObservationOptions: createMcpSpy };

    const { server } = createRecordingServer();

    registerAllResources(server, { observability: scopedObservability });

    // The resource helpers use maybeWrapResourceHandler which calls
    // createMcpObservationOptions when observability is present.
    expect(createMcpSpy).toHaveBeenCalled();
  });
});

describe('registerPrompts — observability characterisation', () => {
  it('registers prompts when observability is provided', () => {
    const observability = createFakeHttpObservability();
    const { server, promptCalls } = createRecordingServer();

    registerPrompts(server, observability);

    expect(promptCalls.length).toBeGreaterThanOrEqual(1);
  });

  it('calls createMcpObservationOptions for prompt wrapping', () => {
    const observability = createFakeHttpObservability();
    const createMcpSpy = vi.fn(observability.createMcpObservationOptions.bind(observability));
    const scopedObservability = { ...observability, createMcpObservationOptions: createMcpSpy };

    const { server } = createRecordingServer();

    registerPrompts(server, scopedObservability);

    expect(createMcpSpy).toHaveBeenCalledOnce();
  });
});
