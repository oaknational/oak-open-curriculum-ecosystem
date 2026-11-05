/**
 * Shared dual-spy registration walk for integration tests.
 *
 * Registers the full handler surface once under the canonical served-surface
 * definition, spying both `registerTool` and `registerResource`, and returns
 * what was registered: tool configs by name (config is `call[1]`, carrying
 * `_meta` per the SDK registration shape) and registered resource URIs
 * (URI is `call[1]` for resources).
 *
 * Homed here so the register-and-spy harness is written once: the
 * served-surface registration, dormant-absence, and widget-URI-parity
 * suites all consume this walk.
 */

import { vi } from 'vitest';
import { McpServer, type ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerHandlers } from '../handlers.js';
import type { ServedSurfaceDefinition } from '../served-surface/served-surface.js';
import {
  createFakeSearchRetrieval,
  createFakeLogger,
  createFakeHttpObservability,
} from './fakes.js';
import { createMockRuntimeConfig } from './auth-error-test-helpers.js';

/** What one registration walk registered. */
export interface RegistrationWalk {
  readonly toolConfigs: ReadonlyMap<string, unknown>;
  readonly resourceUris: ReadonlySet<string>;
  /** Registration names (`call[0]`) — the labels MCP-241 closes events to. */
  readonly resourceNames: ReadonlySet<string>;
  /**
   * Registration names in call order, multiplicity preserved — the
   * per-unit parity pins compare against this so a duplicate or swapped
   * name/registrar pairing cannot hide inside set semantics.
   */
  readonly resourceNameList: readonly string[];
}

/**
 * The URI a `registerResource` call registered. Every runtime registration
 * passes a string; the spy's tuple type also admits the SDK's
 * `ResourceTemplate` overload, which is rendered to its pattern so that a
 * template registration fails a membership assertion loudly instead of
 * passing as `[object Object]`.
 */
function registeredResourceUri(uriOrTemplate: string | ResourceTemplate): string {
  return typeof uriOrTemplate === 'string' ? uriOrTemplate : uriOrTemplate.uriTemplate.toString();
}

/**
 * Registers the full handler surface once and captures both registration
 * spies. Walks the canonical served-surface definition by default; pass a
 * variant definition to exercise dormant/live rows (the sanctioned test
 * seam — production always uses the module-level constant).
 */
export function walkCanonicalRegistration(
  servedSurface?: ServedSurfaceDefinition,
): RegistrationWalk {
  const server = new McpServer({ name: 'test-server', version: '0.0.0' });
  const registerToolSpy = vi.spyOn(server, 'registerTool');
  const registerResourceSpy = vi.spyOn(server, 'registerResource');
  registerHandlers(server, {
    runtimeConfig: createMockRuntimeConfig(),
    logger: createFakeLogger(),
    observability: createFakeHttpObservability(),
    searchRetrieval: createFakeSearchRetrieval(),
    resourceUrl: 'https://probe.test/mcp',
    getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
    ...(servedSurface ? { servedSurface } : {}),
  });
  return {
    toolConfigs: new Map<string, unknown>(
      registerToolSpy.mock.calls.map((call) => [String(call[0]), call[1]]),
    ),
    resourceUris: new Set(
      registerResourceSpy.mock.calls.map((call) => registeredResourceUri(call[1])),
    ),
    resourceNames: new Set(registerResourceSpy.mock.calls.map((call) => String(call[0]))),
    resourceNameList: registerResourceSpy.mock.calls.map((call) => String(call[0])),
  };
}
