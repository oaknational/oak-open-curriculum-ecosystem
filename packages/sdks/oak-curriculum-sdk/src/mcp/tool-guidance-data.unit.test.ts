/**
 * Unit tests for tool guidance data content quality.
 *
 * These tests validate the content requirements of the tool guidance data,
 * not the structure (TypeScript handles type correctness).
 */

import { describe, it, expect } from 'vitest';
import { toolGuidanceData } from './tool-guidance-data.js';
import { AGENT_SUPPORT_TOOL_NAMES } from './agent-support-tool-metadata.js';

describe('toolGuidanceData content quality', () => {
  it('agentSupport category includes all agent support tools', () => {
    for (const name of AGENT_SUPPORT_TOOL_NAMES) {
      expect(toolGuidanceData.toolCategories.agentSupport.tools).toContain(name);
    }
  });

  it('agentSupport category has isAgentSupport flag set to true', () => {
    expect(toolGuidanceData.toolCategories.agentSupport.isAgentSupport).toBe(true);
  });

  it('discovery category includes semantic search tools', () => {
    expect(toolGuidanceData.toolCategories.discovery.tools).toContain('search');
    expect(toolGuidanceData.toolCategories.discovery.tools).toContain('explore-topic');
    expect(toolGuidanceData.toolCategories.discovery.tools).toContain('browse-curriculum');
  });

  it('fetching category includes fetch tool', () => {
    expect(toolGuidanceData.toolCategories.fetching.tools).toContain('fetch');
  });

  it('progression category includes get-threads', () => {
    expect(toolGuidanceData.toolCategories.progression.tools).toContain('get-threads');
  });

  it('findLessons workflow starts with search', () => {
    const firstStep = toolGuidanceData.workflows.findLessons.steps[0];
    expect(firstStep.tool).toBe('search');
  });

  it('tips include guidance about fetch tool ID formats', () => {
    const hasFetchTip = toolGuidanceData.tips.some(
      (tip) => tip.includes('fetch') || tip.includes('prefix'),
    );
    expect(hasFetchTip).toBe(true);
  });

  it('tips include orientation guidance referencing get-curriculum-model', () => {
    const hasOrientationTip = toolGuidanceData.tips.some((tip) =>
      tip.includes('get-curriculum-model'),
    );
    expect(hasOrientationTip).toBe(true);
  });
});
