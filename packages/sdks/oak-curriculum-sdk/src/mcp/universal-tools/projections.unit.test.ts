/**
 * Unit tests for the canonical SDK descriptor projection functions.
 *
 * These tests prove that `toRegistrationConfig` and `toAppToolRegistrationConfig`
 * correctly transform `UniversalToolListEntry` into the shapes MCP consumers
 * need, and that `isAppToolEntry` correctly identifies UI-bearing tools.
 *
 * @see .agent/plans/sdk-and-mcp-enhancements/active/ws3-off-the-shelf-mcp-sdk-adoption.plan.md — Phase 3
 */

import { describe, it, expect } from 'vitest';
import { WIDGET_URI, WIDGET_TOOL_NAMES } from '@oaknational/sdk-codegen/widget-constants';
import type { ToolName } from '@oaknational/sdk-codegen/mcp-tools';
import { listUniversalTools } from './list-tools.js';
import type { GeneratedToolRegistry, ToolRegistryDescriptor } from './types.js';
import {
  toRegistrationConfig,
  toAppToolRegistrationConfig,
  isAppToolEntry,
} from './projections.js';

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
  _meta: { securitySchemes: [] },
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

  describe('isAppToolEntry — type guard for UI-bearing tools', () => {
    it('returns true for widget tools that have _meta.ui.resourceUri', () => {
      const tools = listUniversalTools(registry);
      const widgetTools = tools.filter((t) => WIDGET_TOOL_NAMES.has(t.name));
      expect(widgetTools.length).toBeGreaterThan(0);
      for (const tool of widgetTools) {
        expect(isAppToolEntry(tool)).toBe(true);
      }
    });

    it('returns false for non-widget tools without _meta.ui', () => {
      const tools = listUniversalTools(registry);
      const nonWidgetTools = tools.filter((t) => !WIDGET_TOOL_NAMES.has(t.name));
      expect(nonWidgetTools.length).toBeGreaterThan(0);
      for (const tool of nonWidgetTools) {
        expect(isAppToolEntry(tool)).toBe(false);
      }
    });

    it('returns false for tools with _meta but no ui (generated tools with securitySchemes)', () => {
      const tools = listUniversalTools(registry);
      const metaWithoutUiTools = tools.filter(
        (t) => !WIDGET_TOOL_NAMES.has(t.name) && t._meta !== undefined,
      );
      expect(metaWithoutUiTools.length).toBeGreaterThan(0);
      for (const tool of metaWithoutUiTools) {
        expect(tool._meta).toBeDefined();
        expect(isAppToolEntry(tool)).toBe(false);
      }
    });
  });

  describe('toAppToolRegistrationConfig — MCP App tool projection', () => {
    it('returns config with non-optional _meta.ui.resourceUri for widget tools', () => {
      const tools = listUniversalTools(registry);
      const appTools = tools.filter(isAppToolEntry);
      expect(appTools.length).toBeGreaterThan(0);
      for (const tool of appTools) {
        const config = toAppToolRegistrationConfig(tool);
        expect(config._meta).toBeDefined();
        expect(config).toHaveProperty('_meta.ui.resourceUri', WIDGET_URI);
      }
    });

    it('includes inputSchema, description, and annotations', () => {
      const tools = listUniversalTools(registry);
      const appTools = tools.filter(isAppToolEntry);
      expect(appTools.length).toBeGreaterThan(0);
      for (const tool of appTools) {
        const config = toAppToolRegistrationConfig(tool);
        expect(config).toHaveProperty('inputSchema');
        expect(config).toHaveProperty('description');
        expect(config).toHaveProperty('annotations');
      }
    });
  });

  describe('description fallback', () => {
    it('falls back to tool name when description is undefined', () => {
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
      expect(regConfig.description).toBe(sampleMcpToolName);
    });
  });
});
