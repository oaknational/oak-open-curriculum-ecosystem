/**
 * Unit tests for agent support tool metadata.
 *
 * These tests verify the metadata structure and that the generated
 * instructions/hints include all agent support tools.
 */

import { describe, it, expect } from 'vitest';
import {
  AGENT_SUPPORT_TOOL_METADATA,
  AGENT_SUPPORT_TOOL_NAMES,
  generateServerInstructions,
  generateContextHint,
  isAgentSupportTool,
  getAgentSupportToolMetadata,
  getSeeAlsoForTool,
} from './agent-support-tool-metadata.js';
import { toolGuidanceData } from './tool-guidance-data.js';
import { typeSafeKeys, typeSafeValues, typeSafeEntries } from '../types/helpers/type-helpers.js';

describe('AGENT_SUPPORT_TOOL_METADATA', () => {
  it('has metadata for all tools in agentSupport category', () => {
    const expectedTools = toolGuidanceData.toolCategories.agentSupport.tools;
    const metadataToolNames = typeSafeKeys(AGENT_SUPPORT_TOOL_METADATA);

    for (const tool of expectedTools) {
      expect(metadataToolNames).toContain(tool);
    }
  });

  it('AGENT_SUPPORT_TOOL_NAMES matches toolCategories.agentSupport.tools', () => {
    const expectedTools = [...toolGuidanceData.toolCategories.agentSupport.tools].sort();
    const actualTools = [...AGENT_SUPPORT_TOOL_NAMES].sort();

    expect(actualTools).toEqual(expectedTools);
  });

  it('each tool has required metadata fields', () => {
    for (const [name, metadata] of typeSafeEntries(AGENT_SUPPORT_TOOL_METADATA)) {
      expect(metadata.name).toBe(name);
      expect(metadata.shortDescription).toBeDefined();
      expect(metadata.provides.length).toBeGreaterThan(0);
      expect(metadata.purpose).toBeDefined();
      expect(typeof metadata.callOrder).toBe('number');
      expect(metadata.complementsTools.length).toBeGreaterThan(0);
      expect(metadata.seeAlso).toBeDefined();
      expect(typeof metadata.callAtStart).toBe('boolean');
    }
  });

  it('complementsTools only reference other agent support tools', () => {
    const validToolNames = typeSafeKeys(AGENT_SUPPORT_TOOL_METADATA);

    for (const metadata of typeSafeValues(AGENT_SUPPORT_TOOL_METADATA)) {
      for (const complementTool of metadata.complementsTools) {
        expect(validToolNames).toContain(complementTool);
      }
    }
  });

  it('no tool complements itself', () => {
    for (const [name, metadata] of typeSafeEntries(AGENT_SUPPORT_TOOL_METADATA)) {
      expect(metadata.complementsTools).not.toContain(name);
    }
  });

  it('call orders are unique', () => {
    const callOrders = typeSafeValues(AGENT_SUPPORT_TOOL_METADATA).map((t) => t.callOrder);
    const uniqueCallOrders = new Set(callOrders);
    expect(uniqueCallOrders.size).toBe(callOrders.length);
  });
});

describe('generateServerInstructions', () => {
  it('includes all agent support tools', () => {
    const instructions = generateServerInstructions();

    for (const toolName of AGENT_SUPPORT_TOOL_NAMES) {
      expect(instructions).toContain(toolName);
    }
  });

  it('includes tool purposes (HOW/WHAT/WHICH)', () => {
    const instructions = generateServerInstructions();

    expect(instructions).toContain('understand WHAT');
    expect(instructions).toContain('understand HOW');
    expect(instructions).toContain('understand WHICH');
  });

  it('includes relationship information', () => {
    const instructions = generateServerInstructions();

    expect(instructions).toContain('See also:');
    expect(instructions).toContain('complement');
  });

  it('mentions tools are read-only and idempotent', () => {
    const instructions = generateServerInstructions();

    expect(instructions).toContain('read-only');
    expect(instructions).toContain('idempotent');
  });

  it('lists tools in call order', () => {
    const instructions = generateServerInstructions();
    const toolPositions = AGENT_SUPPORT_TOOL_NAMES.map((name) => instructions.indexOf(name));

    // Verify tools appear in call order (sorted positions should match original)
    const sortedPositions = [...toolPositions].sort((a, b) => a - b);
    expect(toolPositions).toEqual(sortedPositions);
  });
});

describe('generateContextHint', () => {
  it('includes all agent support tools', () => {
    const hint = generateContextHint();

    for (const toolName of AGENT_SUPPORT_TOOL_NAMES) {
      expect(hint).toContain(toolName);
    }
  });

  it('is reasonably short (for embedding in responses)', () => {
    const hint = generateContextHint();
    // Should be under 300 characters for a context hint
    expect(hint.length).toBeLessThan(300);
  });
});

describe('isAgentSupportTool', () => {
  it('returns true for agent support tools', () => {
    for (const toolName of AGENT_SUPPORT_TOOL_NAMES) {
      expect(isAgentSupportTool(toolName)).toBe(true);
    }
  });

  it('returns false for non-agent support tools', () => {
    expect(isAgentSupportTool('search')).toBe(false);
    expect(isAgentSupportTool('fetch')).toBe(false);
    expect(isAgentSupportTool('non-existent-tool')).toBe(false);
  });
});

describe('getAgentSupportToolMetadata', () => {
  it('returns metadata for valid tools', () => {
    const metadata = getAgentSupportToolMetadata('get-ontology');
    expect(metadata.name).toBe('get-ontology');
    expect(metadata.shortDescription).toBe('Domain model definitions');
  });
});

describe('getSeeAlsoForTool', () => {
  it('returns seeAlso for agent support tools', () => {
    const seeAlso = getSeeAlsoForTool('get-ontology');
    expect(seeAlso).toBeDefined();
    expect(seeAlso).toContain('get-knowledge-graph');
  });

  it('returns undefined for non-agent support tools', () => {
    expect(getSeeAlsoForTool('search')).toBeUndefined();
    expect(getSeeAlsoForTool('fetch')).toBeUndefined();
  });
});
