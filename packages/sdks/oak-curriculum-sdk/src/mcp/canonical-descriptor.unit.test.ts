/**
 * Phase 2 (RED) tests for the canonical SDK descriptor surface.
 *
 * These tests prove that the SDK must own two derived projections from
 * the canonical tool descriptor:
 *
 * 1. A **registration projection** that `registerAppTool()` / `registerTool()`
 *    can consume directly — so the app never hand-maps tool fields.
 * 2. A **protocol projection** for `tools/list` that preserves JSON Schema
 *    `inputSchema` with examples — so the app never re-serialises tool metadata.
 *
 * Both projections are imported from `./universal-tools/projections.js`, which
 * does not yet exist. `pnpm type-check` failing on the missing module IS the
 * RED signal.
 *
 * @see .agent/plans/sdk-and-mcp-enhancements/current/mcp-runtime-boundary-simplification.plan.md — Phase 2
 */

import { describe, it, expect } from 'vitest';
import { WIDGET_URI } from '@oaknational/sdk-codegen/widget-constants';
import type { ToolName } from '@oaknational/sdk-codegen/mcp-tools';
import { listUniversalTools } from './universal-tools/list-tools.js';
import type { GeneratedToolRegistry, ToolRegistryDescriptor } from './universal-tools/types.js';

// RED: These imports do not exist yet — type-check and lint fail here.
// Phase 3 (GREEN) will create this module and make all checks pass.
import { toRegistrationConfig, toProtocolEntry } from './universal-tools/projections.js';

/** Tools that have no widget _meta.ui fields (no resourceUri). */
const NON_WIDGET_TOOLS = ['download-asset'] as const satisfies readonly string[];

const sampleMcpToolName = 'get-key-stages-subject-lessons' as const satisfies ToolName;

const sampleDescriptor: ToolRegistryDescriptor = {
  description: 'List lessons for a subject',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      params: {
        type: 'object',
        additionalProperties: false,
        properties: {
          path: {
            type: 'object',
            additionalProperties: false,
            properties: {
              keyStage: { type: 'string' },
              subject: { type: 'string' },
            },
          },
        },
      },
    },
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: 'Get Lessons',
  },
  securitySchemes: [],
  requiresDomainContext: false,
};

function createFakeRegistry(): GeneratedToolRegistry {
  return {
    toolNames: [sampleMcpToolName],
    getToolFromToolName: () => sampleDescriptor,
    isToolName: (value: unknown): value is ToolName =>
      typeof value === 'string' && value === sampleMcpToolName,
  };
}

const registry = createFakeRegistry();

describe('canonical descriptor projections (Phase 2 RED)', () => {
  describe('toRegistrationConfig — registration projection', () => {
    it('produces a registration config for each tool', () => {
      const tools = listUniversalTools(registry);
      for (const tool of tools) {
        const config = toRegistrationConfig(tool);
        expect(config).toHaveProperty('description');
        expect(config).toHaveProperty('inputSchema');
        expect(config).toHaveProperty('annotations');
      }
    });

    it('widget tool registration config includes _meta.ui.resourceUri', () => {
      const tools = listUniversalTools(registry);
      const widgetTools = tools.filter((t) => t._meta?.ui?.resourceUri !== undefined);
      expect(widgetTools.length).toBeGreaterThan(0);
      for (const tool of widgetTools) {
        const config = toRegistrationConfig(tool);
        expect(config._meta?.ui?.resourceUri).toBe(WIDGET_URI);
      }
    });

    it('non-widget tool registration config omits _meta.ui', () => {
      const tools = listUniversalTools(registry);
      const downloadAsset = tools.find((t) => t.name === 'download-asset');
      expect(downloadAsset).toBeDefined();
      if (!downloadAsset) {
        throw new Error('download-asset not found');
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Phase 2 RED: projections module does not exist yet
      const config = toRegistrationConfig(downloadAsset);
      expect(config._meta).toBeUndefined();
    });
  });

  describe('toProtocolEntry — tools/list protocol projection', () => {
    it('produces a tools/list entry with JSON Schema inputSchema', () => {
      const tools = listUniversalTools(registry);
      for (const tool of tools) {
        const entry = toProtocolEntry(tool);
        expect(entry).toHaveProperty('name');
        expect(entry).toHaveProperty('description');
        expect(entry).toHaveProperty('inputSchema');
        // JSON Schema (not Zod) — examples survive the tools/list response
        expect(entry.inputSchema).toEqual(tool.inputSchema);
      }
    });

    it('widget tool protocol entry includes _meta', () => {
      const tools = listUniversalTools(registry);
      const widgetTools = tools.filter((t) => t._meta?.ui?.resourceUri !== undefined);
      for (const tool of widgetTools) {
        const entry = toProtocolEntry(tool);
        expect(entry._meta?.ui?.resourceUri).toBe(WIDGET_URI);
      }
    });

    it('non-widget tool protocol entry omits _meta', () => {
      const tools = listUniversalTools(registry);
      const nonWidgetTools = tools.filter((t) => NON_WIDGET_TOOLS.includes(t.name));
      expect(nonWidgetTools.length).toBeGreaterThan(0);
      for (const tool of nonWidgetTools) {
        const entry = toProtocolEntry(tool);
        expect(entry._meta).toBeUndefined();
      }
    });
  });

  describe('canonical source consistency', () => {
    it('registration and protocol projections agree on description and annotations', () => {
      const tools = listUniversalTools(registry);
      for (const tool of tools) {
        const regConfig = toRegistrationConfig(tool);
        const protoEntry = toProtocolEntry(tool);
        expect(regConfig.description).toBe(protoEntry.description);
        expect(regConfig.annotations).toEqual(protoEntry.annotations);
      }
    });
  });
});
