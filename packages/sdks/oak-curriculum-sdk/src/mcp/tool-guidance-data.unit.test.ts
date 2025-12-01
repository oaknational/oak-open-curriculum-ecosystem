/**
 * Unit tests for tool guidance data structure.
 *
 * These tests validate the structure of the tool guidance data which provides
 * server-level "how to use these tools" documentation, separate from the
 * curriculum ontology (domain model).
 */

import { describe, it, expect } from 'vitest';
import { toolGuidanceData } from './tool-guidance-data.js';
import { typeSafeValues } from '../types/helpers/type-helpers.js';

describe('toolGuidanceData structure', () => {
  describe('serverOverview', () => {
    it('has server name', () => {
      expect(toolGuidanceData.serverOverview.name).toBeDefined();
      expect(typeof toolGuidanceData.serverOverview.name).toBe('string');
    });

    it('has server description', () => {
      expect(toolGuidanceData.serverOverview.description).toBeDefined();
      expect(typeof toolGuidanceData.serverOverview.description).toBe('string');
    });

    it('has authentication information', () => {
      expect(toolGuidanceData.serverOverview.authentication).toBeDefined();
      expect(typeof toolGuidanceData.serverOverview.authentication).toBe('string');
    });

    it('has version', () => {
      expect(toolGuidanceData.serverOverview.version).toBeDefined();
      expect(typeof toolGuidanceData.serverOverview.version).toBe('string');
    });
  });

  describe('toolCategories', () => {
    it('has discovery category with tools array', () => {
      expect(toolGuidanceData.toolCategories.discovery).toBeDefined();
      expect(toolGuidanceData.toolCategories.discovery.tools).toBeInstanceOf(Array);
      expect(toolGuidanceData.toolCategories.discovery.tools.length).toBeGreaterThan(0);
    });

    it('has browsing category with tools array', () => {
      expect(toolGuidanceData.toolCategories.browsing).toBeDefined();
      expect(toolGuidanceData.toolCategories.browsing.tools).toBeInstanceOf(Array);
      expect(toolGuidanceData.toolCategories.browsing.tools.length).toBeGreaterThan(0);
    });

    it('has fetching category with tools array', () => {
      expect(toolGuidanceData.toolCategories.fetching).toBeDefined();
      expect(toolGuidanceData.toolCategories.fetching.tools).toBeInstanceOf(Array);
      expect(toolGuidanceData.toolCategories.fetching.tools.length).toBeGreaterThan(0);
    });

    it('has progression category with tools array', () => {
      expect(toolGuidanceData.toolCategories.progression).toBeDefined();
      expect(toolGuidanceData.toolCategories.progression.tools).toBeInstanceOf(Array);
      expect(toolGuidanceData.toolCategories.progression.tools.length).toBeGreaterThan(0);
    });

    it('has agentSupport category with get-help and get-ontology tools', () => {
      expect(toolGuidanceData.toolCategories.agentSupport).toBeDefined();
      expect(toolGuidanceData.toolCategories.agentSupport.tools).toBeInstanceOf(Array);
      expect(toolGuidanceData.toolCategories.agentSupport.tools).toContain('get-help');
      expect(toolGuidanceData.toolCategories.agentSupport.tools).toContain('get-ontology');
    });

    it('agentSupport category has isAgentSupport flag set to true', () => {
      expect(toolGuidanceData.toolCategories.agentSupport.isAgentSupport).toBe(true);
    });

    it('each category has whenToUse description', () => {
      const categories = typeSafeValues(toolGuidanceData.toolCategories);
      for (const category of categories) {
        expect(category.whenToUse).toBeDefined();
        expect(typeof category.whenToUse).toBe('string');
      }
    });

    it('each category has description', () => {
      const categories = typeSafeValues(toolGuidanceData.toolCategories);
      for (const category of categories) {
        expect(category.description).toBeDefined();
        expect(typeof category.description).toBe('string');
      }
    });
  });

  describe('workflows', () => {
    it('has findLessons workflow', () => {
      expect(toolGuidanceData.workflows.findLessons).toBeDefined();
      expect(toolGuidanceData.workflows.findLessons.title).toBeDefined();
      expect(toolGuidanceData.workflows.findLessons.steps).toBeInstanceOf(Array);
    });

    it('has lessonPlanning workflow', () => {
      expect(toolGuidanceData.workflows.lessonPlanning).toBeDefined();
      expect(toolGuidanceData.workflows.lessonPlanning.title).toBeDefined();
      expect(toolGuidanceData.workflows.lessonPlanning.steps).toBeInstanceOf(Array);
    });

    it('has browseSubject workflow', () => {
      expect(toolGuidanceData.workflows.browseSubject).toBeDefined();
      expect(toolGuidanceData.workflows.browseSubject.title).toBeDefined();
      expect(toolGuidanceData.workflows.browseSubject.steps).toBeInstanceOf(Array);
    });

    it('has trackProgression workflow', () => {
      expect(toolGuidanceData.workflows.trackProgression).toBeDefined();
      expect(toolGuidanceData.workflows.trackProgression.title).toBeDefined();
      expect(toolGuidanceData.workflows.trackProgression.steps).toBeInstanceOf(Array);
    });

    it('workflow steps have required fields', () => {
      const workflows = typeSafeValues(toolGuidanceData.workflows);
      for (const workflow of workflows) {
        for (const step of workflow.steps) {
          expect(step.step).toBeDefined();
          expect(typeof step.step).toBe('number');
          expect(step.action).toBeDefined();
          expect(typeof step.action).toBe('string');
        }
      }
    });
  });

  describe('tips', () => {
    it('has tips array', () => {
      expect(toolGuidanceData.tips).toBeInstanceOf(Array);
      expect(toolGuidanceData.tips.length).toBeGreaterThan(0);
    });

    it('tips are strings', () => {
      for (const tip of toolGuidanceData.tips) {
        expect(typeof tip).toBe('string');
      }
    });
  });

  describe('idFormats', () => {
    it('has description', () => {
      expect(toolGuidanceData.idFormats.description).toBeDefined();
      expect(typeof toolGuidanceData.idFormats.description).toBe('string');
    });

    it('has formats array with prefix and example', () => {
      expect(toolGuidanceData.idFormats.formats).toBeInstanceOf(Array);
      for (const format of toolGuidanceData.idFormats.formats) {
        expect(format.prefix).toBeDefined();
        expect(format.example).toBeDefined();
        expect(format.description).toBeDefined();
      }
    });
  });
});

describe('toolGuidanceData content quality', () => {
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
