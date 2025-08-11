/**
 * Integration tests for MCP tool handler
 * Tests the integration between MCP tools and curriculum organ
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Logger } from '@oaknational/mcp-moria';
import type { CurriculumOrgan } from '../../curriculum';
import { createToolHandler, McpOperationError } from './tool-handler';

describe('createToolHandler', () => {
  let mockCurriculumOrgan: CurriculumOrgan;
  let mockLogger: Logger;
  let toolHandler: ReturnType<typeof createToolHandler>;

  beforeEach(() => {
    // Create mock curriculum organ
    mockCurriculumOrgan = {
      searchLessons: vi.fn(),
      getLesson: vi.fn(),
      listKeyStages: vi.fn(),
      listSubjects: vi.fn(),
    };

    // Create mock logger
    mockLogger = {
      info: vi.fn(),
      debug: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      child: vi.fn(() => mockLogger),
    } as unknown as Logger;

    // Create tool handler
    toolHandler = createToolHandler(mockCurriculumOrgan, mockLogger);
  });

  describe('oak-search-lessons tool', () => {
    it('should search lessons with valid parameters', async () => {
      // Given: Mock curriculum organ returns results
      const mockResults = [
        {
          lessonSlug: 'intro-fractions',
          lessonTitle: 'Introduction to Fractions',
          subjectSlug: 'maths',
          subjectTitle: 'Mathematics',
          keyStageSlug: 'ks2',
          keyStageTitle: 'Key Stage 2',
        },
      ];
      vi.mocked(mockCurriculumOrgan.searchLessons).mockResolvedValue(mockResults);

      // When: Execute tool
      const result = await toolHandler('oak-search-lessons', {
        query: 'fractions',
        keyStage: 'ks2',
        subject: 'maths',
      });

      // Then: Curriculum organ is called correctly
      expect(mockCurriculumOrgan.searchLessons).toHaveBeenCalledWith({
        q: 'fractions',
        keyStage: 'ks2',
        subject: 'maths',
      });

      // And: Results are returned
      expect(result).toEqual(mockResults);
    });

    it('should handle missing optional parameters', async () => {
      // Given: Only required parameter
      vi.mocked(mockCurriculumOrgan.searchLessons).mockResolvedValue([]);

      // When: Execute tool with minimal params
      const result = await toolHandler('oak-search-lessons', {
        query: 'algebra',
      });

      // Then: Curriculum organ is called with only query
      expect(mockCurriculumOrgan.searchLessons).toHaveBeenCalledWith({
        q: 'algebra',
      });

      expect(result).toEqual([]);
    });
  });

  describe('oak-get-lesson tool', () => {
    it('should get lesson by slug', async () => {
      // Given: Mock curriculum organ returns lesson
      const mockLesson = {
        lessonTitle: 'Introduction to Fractions',
        lessonSlug: 'intro-fractions',
        subjectTitle: 'Mathematics',
        subjectSlug: 'maths',
        keyStageTitle: 'Key Stage 2',
        keyStageSlug: 'ks2',
      };
      vi.mocked(mockCurriculumOrgan.getLesson).mockResolvedValue(mockLesson);

      // When: Execute tool
      const result = await toolHandler('oak-get-lesson', {
        lessonSlug: 'intro-fractions',
      });

      // Then: Curriculum organ is called correctly
      expect(mockCurriculumOrgan.getLesson).toHaveBeenCalledWith('intro-fractions');

      // And: Lesson is returned
      expect(result).toEqual(mockLesson);
    });
  });

  describe('oak-list-key-stages tool', () => {
    it('should list all key stages', async () => {
      // Given: Mock curriculum organ returns key stages
      const mockKeyStages = [
        { slug: 'ks1', title: 'Key Stage 1' },
        { slug: 'ks2', title: 'Key Stage 2' },
      ];
      vi.mocked(mockCurriculumOrgan.listKeyStages).mockResolvedValue(mockKeyStages);

      // When: Execute tool (no parameters needed)
      const result = await toolHandler('oak-list-key-stages', {});

      // Then: Curriculum organ is called
      expect(mockCurriculumOrgan.listKeyStages).toHaveBeenCalled();

      // And: Key stages are returned
      expect(result).toEqual(mockKeyStages);
    });
  });

  describe('oak-list-subjects tool', () => {
    it('should list all subjects', async () => {
      // Given: Mock curriculum organ returns subjects
      const mockSubjects = [
        { subjectSlug: 'english', subjectTitle: 'English' },
        { subjectSlug: 'maths', subjectTitle: 'Mathematics' },
      ];
      vi.mocked(mockCurriculumOrgan.listSubjects).mockResolvedValue(mockSubjects);

      // When: Execute tool (no parameters needed)
      const result = await toolHandler('oak-list-subjects', {});

      // Then: Curriculum organ is called
      expect(mockCurriculumOrgan.listSubjects).toHaveBeenCalled();

      // And: Subjects are returned
      expect(result).toEqual(mockSubjects);
    });
  });

  describe('error handling', () => {
    it('should throw error for unknown tool', async () => {
      // When/Then: Unknown tool throws McpOperationError
      await expect(toolHandler('unknown-tool', {})).rejects.toThrow('MCP tool unknown-tool failed');
    });

    it('should wrap curriculum organ errors', async () => {
      // Given: Curriculum organ throws error
      const originalError = new Error('API unavailable');
      vi.mocked(mockCurriculumOrgan.searchLessons).mockRejectedValue(originalError);

      // When: Call the tool
      let caughtError: any;
      try {
        await toolHandler('oak-search-lessons', { query: 'test' });
      } catch (error) {
        caughtError = error;
      }

      // Then: Error is wrapped in McpOperationError
      expect(caughtError).toBeInstanceOf(McpOperationError);
      expect(caughtError.message).toBe('MCP tool oak-search-lessons failed');
      expect(caughtError.operation).toBe('oak-search-lessons');
      expect(caughtError.cause).toBe(originalError);
    });
  });
});
