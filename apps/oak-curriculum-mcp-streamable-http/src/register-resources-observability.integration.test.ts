/**
 * Characterisation Test: Resource and prompt registration completeness
 *
 * Verifies that `registerAllResources` and `registerPrompts` register
 * the expected number of handlers with the server.
 *
 * Native Sentry (`wrapMcpServerWithSentry`) handles handler error capture
 * and transport tracing — individual handler wrapping is no longer needed.
 *
 * Uses DI and simple fakes — no `vi.mock`, no global state.
 */

import { describe, it, expect, vi } from 'vitest';
import { DOCUMENTATION_RESOURCES } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { registerAllResources, registerPrompts } from './register-resources.js';

const TEST_WIDGET_HTML = '<!doctype html><html><body>Oak Curriculum App</body></html>';

/**
 * Total resource count: documentation resources + 5 supplementary resources
 * (curriculum model, prior knowledge graph, thread progressions, misconception graph, widget).
 */
const EXPECTED_RESOURCE_COUNT = DOCUMENTATION_RESOURCES.length + 5;

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

describe('registerAllResources — registration completeness', () => {
  it('registers the expected number of resources', () => {
    const server = createRecordingServer();

    registerAllResources(server, { getWidgetHtml: () => TEST_WIDGET_HTML });

    expect(server.registerResource).toHaveBeenCalledTimes(EXPECTED_RESOURCE_COUNT);
  });
});

describe('registerPrompts — registration completeness', () => {
  it('registers at least one prompt', () => {
    const server = createRecordingServer();

    registerPrompts(server);

    expect(server.registerPrompt).toHaveBeenCalled();
  });
});
