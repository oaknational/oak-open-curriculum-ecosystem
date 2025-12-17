/**
 * Unit tests for tool guidance data content quality.
 *
 * These tests validate the content requirements of the tool guidance data,
 * not the structure (TypeScript handles type correctness).
 */

import { describe, it, expect } from 'vitest';
import { toolGuidanceData } from './tool-guidance-data.js';

describe('toolGuidanceData content quality', () => {
  it('agentSupport category includes get-help and get-ontology tools', () => {
    expect(toolGuidanceData.toolCategories.agentSupport.tools).toContain('get-help');
    expect(toolGuidanceData.toolCategories.agentSupport.tools).toContain('get-ontology');
  });

  it('agentSupport category has isAgentSupport flag set to true', () => {
    expect(toolGuidanceData.toolCategories.agentSupport.isAgentSupport).toBe(true);
  });

  it('discovery category includes search tool', () => {
    expect(toolGuidanceData.toolCategories.discovery.tools).toContain('search');
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

  it('tips include "understand Oak" guidance', () => {
    const hasUnderstandOakTip = toolGuidanceData.tips.some((tip) => /understand oak/i.test(tip));
    expect(hasUnderstandOakTip).toBe(true);
  });
});
