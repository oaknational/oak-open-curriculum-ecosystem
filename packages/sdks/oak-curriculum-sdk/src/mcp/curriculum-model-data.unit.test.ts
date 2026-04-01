/**
 * Unit tests for curriculum model data composition.
 *
 * Tests the composeCurriculumModelData function that merges ontology data
 * and tool guidance into a single response for the get-curriculum-model tool.
 */

import { describe, it, expect } from 'vitest';
import { composeCurriculumModelData } from './curriculum-model-data.js';

describe('composeCurriculumModelData', () => {
  describe('without toolName', () => {
    it('returns object with domainModel and toolGuidance keys', () => {
      const result = composeCurriculumModelData();
      expect(result).toHaveProperty('domainModel');
      expect(result).toHaveProperty('toolGuidance');
    });

    it('domainModel contains curriculum structure', () => {
      const result = composeCurriculumModelData();
      expect(result.domainModel).toHaveProperty('curriculumStructure');
    });

    it('domainModel contains entity hierarchy', () => {
      const result = composeCurriculumModelData();
      expect(result.domainModel).toHaveProperty('entityHierarchy');
    });

    it('domainModel contains threads for learning progression context', () => {
      const result = composeCurriculumModelData();
      expect(result.domainModel).toHaveProperty('threads');
    });

    it('domainModel contains ukEducationContext for term disambiguation', () => {
      const result = composeCurriculumModelData();
      expect(result.domainModel).toHaveProperty('ukEducationContext');
    });

    it('domainModel contains oakUrls for linking to Oak website', () => {
      const result = composeCurriculumModelData();
      expect(result.domainModel).toHaveProperty('oakUrls');
    });

    it('domainModel does NOT contain synonyms', () => {
      const result = composeCurriculumModelData();
      expect(result.domainModel).not.toHaveProperty('synonyms');
    });

    it('toolGuidance contains tool categories', () => {
      const result = composeCurriculumModelData();
      expect(result.toolGuidance).toHaveProperty('toolCategories');
    });

    it('toolGuidance contains tips', () => {
      const result = composeCurriculumModelData();
      expect(result.toolGuidance).toHaveProperty('tips');
    });

    it('toolGuidance contains workflows', () => {
      const result = composeCurriculumModelData();
      expect(result.toolGuidance).toHaveProperty('workflows');
    });

    it('does NOT include toolSpecificHelp when toolName is omitted', () => {
      const result = composeCurriculumModelData();
      expect(result).not.toHaveProperty('toolSpecificHelp');
    });
  });

  describe('with toolName', () => {
    it('includes toolSpecificHelp when toolName is provided', () => {
      const result = composeCurriculumModelData({ toolName: 'search' });
      expect(result).toHaveProperty('toolSpecificHelp');
    });

    it('does NOT include toolSpecificHelp for unknown tool name', () => {
      const result = composeCurriculumModelData({ toolName: 'nonexistent-tool' });
      expect(result).not.toHaveProperty('toolSpecificHelp');
    });
  });

  describe('payload size', () => {
    it('response is within budget (under 90KB)', () => {
      const result = composeCurriculumModelData();
      const serialised = JSON.stringify(result);
      expect(serialised.length).toBeLessThan(90_000);
    });
  });
});
