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
import { DOCUMENTATION_RESOURCES } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { registerAllResources, registerPrompts } from './register-resources.js';
import { createFakeHttpObservability } from './test-helpers/fakes.js';

const TEST_WIDGET_HTML = '<!doctype html><html><body>Oak Curriculum App</body></html>';

/**
 * Total resource count: documentation resources + 4 supplementary resources
 * (curriculum model, prerequisite graph, thread progressions, widget).
 */
const EXPECTED_RESOURCE_COUNT = DOCUMENTATION_RESOURCES.length + 4;

/**
 * Creates a minimal recording server using bare `vi.fn()` spies.
 *
 * Each spy satisfies the structural interface expected by `registerAllResources`
 * (`ResourceRegistrar`) and `registerPrompts` (`PromptRegistrar`) without
 * requiring the full `McpServer` type or type assertions.
 */
function createRecordingServer() {
  return {
    registerResource: vi.fn(),
    registerPrompt: vi.fn(),
  };
}

describe('registerAllResources — observability characterisation', () => {
  it('registers resources when observability is provided', () => {
    const observability = createFakeHttpObservability();
    const server = createRecordingServer();

    registerAllResources(server, { observability, getWidgetHtml: async () => TEST_WIDGET_HTML });

    // Exact count: every resource must be registered.
    expect(server.registerResource).toHaveBeenCalledTimes(EXPECTED_RESOURCE_COUNT);
  });

  it('calls createMcpObservationOptions via the observability parameter', () => {
    const observability = createFakeHttpObservability();
    const createMcpSpy = vi.fn(observability.createMcpObservationOptions.bind(observability));
    const scopedObservability = { ...observability, createMcpObservationOptions: createMcpSpy };

    const server = createRecordingServer();

    registerAllResources(server, {
      observability: scopedObservability,
      getWidgetHtml: async () => TEST_WIDGET_HTML,
    });

    // wrapResourceHandler calls createMcpObservationOptions once per
    // resource that uses the sentry wrapper. All resources including the
    // widget are now wrapped for observability.
    expect(createMcpSpy).toHaveBeenCalledTimes(EXPECTED_RESOURCE_COUNT);
  });
});

describe('registerPrompts — observability characterisation', () => {
  it('registers prompts when observability is provided', () => {
    const observability = createFakeHttpObservability();
    const server = createRecordingServer();

    registerPrompts(server, observability);

    expect(server.registerPrompt).toHaveBeenCalled();
  });

  it('calls createMcpObservationOptions for prompt wrapping', () => {
    const observability = createFakeHttpObservability();
    const createMcpSpy = vi.fn(observability.createMcpObservationOptions.bind(observability));
    const scopedObservability = { ...observability, createMcpObservationOptions: createMcpSpy };

    const server = createRecordingServer();

    registerPrompts(server, scopedObservability);

    expect(createMcpSpy).toHaveBeenCalledOnce();
  });
});
