/**
 * Unit tests for the canonical SDK descriptor projection functions.
 *
 * These tests prove that `toRegistrationConfig` and `toProtocolEntry`
 * correctly transform `UniversalToolListEntry` into the two shapes
 * MCP consumers need:
 *
 * 1. A **registration projection** that `registerAppTool()` / `registerTool()`
 *    can consume directly — so the app never hand-maps tool fields.
 * 2. A **protocol projection** for `tools/list` that preserves JSON Schema
 *    `inputSchema` with examples — so the app never re-serialises tool metadata.
 *
 * @see .agent/plans/sdk-and-mcp-enhancements/archive/completed/mcp-runtime-boundary-simplification.plan.md — Phase 3
 */

import { describe, it, expect } from 'vitest';
import { WIDGET_URI, WIDGET_TOOL_NAMES } from '@oaknational/sdk-codegen/widget-constants';
import type { ToolName } from '@oaknational/sdk-codegen/mcp-tools';
import { listUniversalTools } from './list-tools.js';
import type { GeneratedToolRegistry, ToolRegistryDescriptor } from './types.js';
import { toRegistrationConfig, toProtocolEntry } from './projections.js';

// WIDGET_TOOL_NAMES imported from canonical source above.

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

describe('canonical descriptor projections', () => {
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

    it('widget tools get _meta.ui.resourceUri in registration config, non-widget tools do not', () => {
      const tools = listUniversalTools(registry);

      for (const tool of tools) {
        const config = toRegistrationConfig(tool);
        if (WIDGET_TOOL_NAMES.has(tool.name)) {
          expect(config._meta?.ui?.resourceUri).toBe(WIDGET_URI);
        } else {
          expect(config._meta?.ui).toBeUndefined();
        }
      }
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

    it('widget tools get _meta.ui.resourceUri in protocol entry, non-widget tools do not', () => {
      const tools = listUniversalTools(registry);

      for (const tool of tools) {
        const entry = toProtocolEntry(tool);
        if (WIDGET_TOOL_NAMES.has(tool.name)) {
          expect(entry._meta?.ui?.resourceUri).toBe(WIDGET_URI);
        } else {
          expect(entry._meta?.ui).toBeUndefined();
        }
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

    it('description falls back to tool name when undefined', () => {
      const noDescDescriptor: ToolRegistryDescriptor = {
        ...sampleDescriptor,
        description: undefined,
      };
      const noDescRegistry: GeneratedToolRegistry = {
        toolNames: [sampleMcpToolName],
        getToolFromToolName: () => noDescDescriptor,
        isToolName: (value: unknown): value is ToolName =>
          typeof value === 'string' && value === sampleMcpToolName,
      };
      const tools = listUniversalTools(noDescRegistry);
      const generatedTool = tools.find((t) => t.name === sampleMcpToolName);
      expect(generatedTool).toBeDefined();
      if (!generatedTool) {
        throw new Error(`${sampleMcpToolName} not found in tool list`);
      }
      expect(generatedTool.description).toBeUndefined();
      const regConfig = toRegistrationConfig(generatedTool);
      const protoEntry = toProtocolEntry(generatedTool);
      expect(regConfig.description).toBe(sampleMcpToolName);
      expect(protoEntry.description).toBe(sampleMcpToolName);
      expect(regConfig.description).toBe(protoEntry.description);
    });
  });
});
