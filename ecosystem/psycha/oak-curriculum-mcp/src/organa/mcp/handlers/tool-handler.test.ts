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

  // Store mock functions for easier access
  let mockSearchLessons: ReturnType<typeof vi.fn>;
  let mockGetLesson: ReturnType<typeof vi.fn>;
  let mockListKeyStages: ReturnType<typeof vi.fn>;
  let mockListSubjects: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Create mock functions
    mockSearchLessons = vi.fn();
    mockGetLesson = vi.fn();
    mockListKeyStages = vi.fn();
    mockListSubjects = vi.fn();

    // Create mock curriculum organ
    mockCurriculumOrgan = {
      searchLessons: mockSearchLessons,
      getLesson: mockGetLesson,
      listKeyStages: mockListKeyStages,
      listSubjects: mockListSubjects,
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
          similarity: 0.95,
          units: [
            {
              unitSlug: 'fractions-unit-1',
              unitTitle: 'Fractions Unit 1',
              examBoardTitle: null,
              keyStageSlug: 'ks2',
              subjectSlug: 'maths',
            },
          ],
        },
      ];
      mockSearchLessons.mockResolvedValue(mockResults);

      // When: Execute tool
      const result = await toolHandler('oak-search-lessons', {
        query: 'fractions',
        keyStage: 'ks2',
        subject: 'maths',
      });

      // Then: Curriculum organ is called correctly
      expect(mockSearchLessons).toHaveBeenCalledWith({
        q: 'fractions',
        keyStage: 'ks2',
        subject: 'maths',
      });

      // And: Results are returned
      expect(result).toEqual(mockResults);
    });

    it('should handle missing optional parameters', async () => {
      // Given: Only required parameter
      mockSearchLessons.mockResolvedValue([]);

      // When: Execute tool with minimal params
      const result = await toolHandler('oak-search-lessons', {
        query: 'algebra',
      });

      // Then: Curriculum organ is called with only query
      expect(mockSearchLessons).toHaveBeenCalledWith({
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
        unitSlug: 'fractions-unit-1',
        unitTitle: 'Fractions Unit 1',
        subjectSlug: 'maths',
        subjectTitle: 'Mathematics',
        keyStageSlug: 'ks2',
        keyStageTitle: 'Key Stage 2',
        lessonKeywords: [{ keyword: 'fractions', description: 'Parts of a whole' }],
        keyLearningPoints: [{ keyLearningPoint: 'Understand what fractions represent' }],
        misconceptionsAndCommonMistakes: [],
        pupilLessonOutcome: 'Students will understand basic fractions',
        teacherTips: [{ teacherTip: 'Use visual aids to help explain fractions' }],
        contentGuidance: null,
        supervisionLevel: null,
        downloadsAvailable: true,
      };
      mockGetLesson.mockResolvedValue(mockLesson);

      // When: Execute tool
      const result = await toolHandler('oak-get-lesson', {
        lessonSlug: 'intro-fractions',
      });

      // Then: Curriculum organ is called correctly
      expect(mockGetLesson).toHaveBeenCalledWith('intro-fractions');

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
      mockListKeyStages.mockResolvedValue(mockKeyStages);

      // When: Execute tool (no parameters needed)
      const result = await toolHandler('oak-list-key-stages', {});

      // Then: Curriculum organ is called
      expect(mockListKeyStages).toHaveBeenCalled();

      // And: Key stages are returned
      expect(result).toEqual(mockKeyStages);
    });
  });

  describe('oak-list-subjects tool', () => {
    it('should list all subjects', async () => {
      // Given: Mock curriculum organ returns subjects
      const mockSubjects = [
        {
          subjectSlug: 'english',
          subjectTitle: 'English',
          sequenceSlugs: [
            {
              sequenceSlug: 'english-primary',
              years: [1, 2, 3, 4, 5, 6],
              keyStages: [
                { keyStageSlug: 'ks1', keyStageTitle: 'Key Stage 1' },
                { keyStageSlug: 'ks2', keyStageTitle: 'Key Stage 2' },
              ],
              phaseSlug: 'primary',
              phaseTitle: 'Primary',
              ks4Options: null,
            },
          ],
          years: [1, 2, 3, 4, 5, 6],
          keyStages: [
            { keyStageSlug: 'ks1', keyStageTitle: 'Key Stage 1' },
            { keyStageSlug: 'ks2', keyStageTitle: 'Key Stage 2' },
          ],
        },
        {
          subjectSlug: 'maths',
          subjectTitle: 'Mathematics',
          sequenceSlugs: [
            {
              sequenceSlug: 'maths-primary',
              years: [1, 2, 3, 4, 5, 6],
              keyStages: [
                { keyStageSlug: 'ks1', keyStageTitle: 'Key Stage 1' },
                { keyStageSlug: 'ks2', keyStageTitle: 'Key Stage 2' },
              ],
              phaseSlug: 'primary',
              phaseTitle: 'Primary',
              ks4Options: null,
            },
          ],
          years: [1, 2, 3, 4, 5, 6],
          keyStages: [
            { keyStageSlug: 'ks1', keyStageTitle: 'Key Stage 1' },
            { keyStageSlug: 'ks2', keyStageTitle: 'Key Stage 2' },
          ],
        },
      ];
      mockListSubjects.mockResolvedValue(mockSubjects);

      // When: Execute tool (no parameters needed)
      const result = await toolHandler('oak-list-subjects', {});

      // Then: Curriculum organ is called
      expect(mockListSubjects).toHaveBeenCalled();

      // And: Subjects are returned
      expect(result).toEqual(mockSubjects);
    });
  });

  describe('error handling', () => {
    it('should throw error for unknown tool', async () => {
      // When/Then: Unknown tool throws McpOperationError
      // @ts-expect-error Testing invalid tool name
      await expect(toolHandler('unknown-tool', {})).rejects.toThrow('MCP tool unknown-tool failed');
    });

    it('should wrap curriculum organ errors', async () => {
      // Given: Curriculum organ throws error
      const originalError = new Error('API unavailable');
      mockSearchLessons.mockRejectedValue(originalError);

      // When: Call the tool
      let caughtError: unknown;
      try {
        await toolHandler('oak-search-lessons', { query: 'test' });
      } catch (error) {
        caughtError = error;
      }

      // Then: Error is wrapped in McpOperationError
      expect(caughtError).toBeInstanceOf(McpOperationError);
      if (caughtError instanceof McpOperationError) {
        expect(caughtError.message).toBe('MCP tool oak-search-lessons failed');
        expect(caughtError.operation).toBe('oak-search-lessons');
        expect(caughtError.cause).toBe(originalError);
      }
    });
  });
});
