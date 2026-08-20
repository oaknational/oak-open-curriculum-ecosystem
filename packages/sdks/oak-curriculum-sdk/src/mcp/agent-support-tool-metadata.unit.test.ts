/**
 * Unit tests for agent support tool metadata.
 *
 * These tests verify the metadata structure and that the generated
 * server instructions include all agent support tools.
 */

import { describe, it, expect } from 'vitest';
import {
  AGENT_SUPPORT_TOOL_METADATA,
  AGENT_SUPPORT_TOOL_NAMES,
  generateServerInstructions,
  isAgentSupportTool,
  getAgentSupportToolMetadata,
  getSeeAlsoForTool,
  SERVER_INSTRUCTIONS_BUDGET,
} from './agent-support-tool-metadata.js';
import { toolGuidanceData } from './tool-guidance-data.js';
import { typeSafeKeys, typeSafeValues, typeSafeEntries } from '../types/helpers/type-helpers.js';

describe('AGENT_SUPPORT_TOOL_METADATA excludes replaced tools', () => {
  it('does not contain get-ontology (replaced by get-curriculum-model)', () => {
    const metadataToolNames = typeSafeKeys(AGENT_SUPPORT_TOOL_METADATA);
    expect(metadataToolNames).not.toContain('get-ontology');
  });

  it('does not contain get-help (replaced by get-curriculum-model)', () => {
    const metadataToolNames = typeSafeKeys(AGENT_SUPPORT_TOOL_METADATA);
    expect(metadataToolNames).not.toContain('get-help');
  });

  it('contains only get-curriculum-model as agent support tool', () => {
    const metadataToolNames = typeSafeKeys(AGENT_SUPPORT_TOOL_METADATA);
    expect(metadataToolNames).toContain('get-curriculum-model');
  });
});

describe('AGENT_SUPPORT_TOOL_METADATA', () => {
  it('has metadata for all tools in agentSupport category', () => {
    const expectedTools = toolGuidanceData.toolCategories.agentSupport.tools;
    const metadataToolNames = typeSafeKeys(AGENT_SUPPORT_TOOL_METADATA);

    for (const tool of expectedTools) {
      expect(metadataToolNames).toContain(tool);
    }
  });

  it('AGENT_SUPPORT_TOOL_NAMES matches toolCategories.agentSupport.tools', () => {
    const expectedTools = [...toolGuidanceData.toolCategories.agentSupport.tools].sort((a, b) =>
      a.localeCompare(b),
    );
    const actualTools = [...AGENT_SUPPORT_TOOL_NAMES].sort((a, b) => a.localeCompare(b));

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

  it('complementsTools reference known aggregated tools', () => {
    for (const metadata of typeSafeValues(AGENT_SUPPORT_TOOL_METADATA)) {
      for (const complementTool of metadata.complementsTools) {
        expect(typeof complementTool).toBe('string');
        expect(complementTool.length).toBeGreaterThan(0);
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

  it('includes tool purpose', () => {
    const instructions = generateServerInstructions();

    expect(instructions).toContain('understand');
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

  it('states the sequenced-curriculum grounding the graph tools deliver', () => {
    const instructions = generateServerInstructions();

    // The served guidance names the curriculum-connected value the graph
    // tools deliver (year-ordered progressions, prior-knowledge,
    // misconception, and keyword graphs), so connecting agents know plans
    // can build on what a class has already covered.
    expect(instructions).toContain('fully sequenced');
    expect(instructions).toContain('get-thread-progressions');
    expect(instructions).toContain('build on what a class has already covered');
  });

  it('lists tools in call order', () => {
    const instructions = generateServerInstructions();
    const toolPositions = AGENT_SUPPORT_TOOL_NAMES.map((name) => instructions.indexOf(name));

    // Verify tools appear in call order (sorted positions should match original)
    const sortedPositions = [...toolPositions].sort((a, b) => a - b);
    expect(toolPositions).toEqual(sortedPositions);
  });

  it('routes non-curriculum / mechanism / MCP-app / repo questions to the oak-under-the-hood tool', () => {
    const instructions = generateServerInstructions();

    // A connecting agent reads these instructions at conversation start, so this
    // discovery surface is where the orientation capability must be findable. For
    // questions that are NOT about curriculum content — the mechanisms delivering
    // the content, this MCP app and its services, or the repository itself — the
    // surface points at oak-under-the-hood. Without this the tool is invisible to a
    // first-session prior (the curriculum↔orientation separation taken too far).
    expect(instructions).toContain('oak-under-the-hood');
    expect(instructions).toContain('not about curriculum content');
  });

  it("names Oak's other two agent front doors so an arriving agent can reach them", () => {
    const instructions = generateServerInstructions();

    // MCP-421: Oak publishes three agent-facing front doors — the main site's
    // llms.txt, the Open API's machine-readable discovery documents, and this
    // MCP server. The definition of done is that an agent arriving at any one
    // of them can reach the other two by following a published link. This
    // surface is the MCP door's outbound half: the served landing page already
    // links the Open API's human documentation, but nothing the server serves
    // named llms.txt or the machine-readable catalogue, so a connected agent
    // could not discover either. Asserting the URLs (not prose) is what makes
    // the link followable — a reworded sentence still passes, a dropped or
    // altered URL does not.
    expect(instructions).toContain('https://www.thenational.academy/llms.txt');
    expect(instructions).toContain('https://open-api.thenational.academy/.well-known/api-catalog');
  });

  it('keeps the served instructions inside the client character budget', () => {
    const instructions = generateServerInstructions();

    // A host that injects `instructions` into the model's context may cap it,
    // and the cap observed in a real client is 2048 characters, taking the
    // TAIL. The string closes with the owner-signed brand-provenance
    // paragraph, so an overrun severs the non-endorsement clause at the
    // client — invisible to every other gate here, all of which measure the
    // generated string rather than the delivered one. This is the only guard
    // that fails when the string outgrows what a client will carry, so it
    // stands between a future paragraph and a silently truncated licence
    // statement. If it goes red, shorten the prose; do not raise the ceiling.
    expect(instructions.length).toBeLessThanOrEqual(SERVER_INSTRUCTIONS_BUDGET);
  });

  it('carries the Oak brand ownership and non-endorsement guidance (MCP-365)', () => {
    const instructions = generateServerInstructions();

    // Owner-directed (MCP-365): the served instructions close with the
    // owner-signed brand-provenance paragraph — the OGL v3.0 attribution
    // statement for reused curriculum content, no implied endorsement of
    // derived content. One ends-with assertion proves both the wiring and
    // the required closing position (a dropped interpolation, a truncated
    // paragraph, and a later-appended section all fail it); the owner-signed
    // wording is pinned by the audit registry (A011 plus the reviewed
    // semantic sha for this file), which fails the content validator with a
    // readable diff in rendered-wholes.md.
    expect(
      instructions.endsWith('it must never present itself as Oak-created or Oak-endorsed.'),
    ).toBe(true);
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
    const metadata = getAgentSupportToolMetadata('get-curriculum-model');
    expect(metadata.name).toBe('get-curriculum-model');
    expect(metadata.shortDescription).toBe('Complete curriculum orientation');
  });

  it('has get-curriculum-model entry', () => {
    expect(AGENT_SUPPORT_TOOL_METADATA).toHaveProperty('get-curriculum-model');
  });

  it('get-curriculum-model has callOrder 0', () => {
    const metadata = getAgentSupportToolMetadata('get-curriculum-model');
    expect(metadata.callOrder).toBe(0);
  });

  it('get-curriculum-model has callAtStart true', () => {
    const metadata = getAgentSupportToolMetadata('get-curriculum-model');
    expect(metadata.callAtStart).toBe(true);
  });
});

describe('getSeeAlsoForTool', () => {
  it('returns non-empty seeAlso for agent support tools', () => {
    const seeAlso = getSeeAlsoForTool('get-curriculum-model');
    expect(seeAlso).toBeDefined();
    expect(seeAlso?.length).toBeGreaterThan(0);
  });

  it('returns undefined for non-agent support tools', () => {
    expect(getSeeAlsoForTool('non-existent-tool')).toBeUndefined();
  });
});
