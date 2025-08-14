/**
 * Integration tests for MCP tool handler
 * Tests the integration between MCP tools and SDK client
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Logger } from '@oaknational/mcp-moria';
import type { OakApiClient } from '@oaknational/oak-curriculum-sdk';
import { createToolHandler, McpOperationError } from './tool-handler.js';

describe('createToolHandler', () => {
  let mockSdkClient: OakApiClient;
  let mockLogger: Logger;
  let toolHandler: ReturnType<typeof createToolHandler>;

  beforeEach(() => {
    // Create mock SDK client with GET method
    mockSdkClient = {
      GET: vi.fn(),
    } as unknown as OakApiClient;

    // Create mock logger
    mockLogger = {
      info: vi.fn(),
      debug: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      child: vi.fn(() => mockLogger),
    } as unknown as Logger;

    // Create tool handler
    toolHandler = createToolHandler(mockSdkClient, mockLogger);
  });

  describe('oak-search-lessons tool', () => {
    it('should search lessons with valid parameters', async () => {
      // Given: Mock SDK returns results
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

      vi.mocked(mockSdkClient.GET).mockResolvedValue({
        data: mockResults,
        response: {} as Response,
      });

      // When: Execute tool
      const result = await toolHandler('oak-search-lessons', {
        q: 'fractions',
        keyStage: 'ks2',
        subject: 'maths',
      });

      // Then: SDK is called correctly with the enriched tool path
      expect(mockSdkClient.GET).toHaveBeenCalledWith('/search/lessons', {
        params: {
          query: {
            q: 'fractions',
            keyStage: 'ks2',
            subject: 'maths',
          },
          path: {},
        },
      });

      // And: Results are returned
      expect(result).toEqual(mockResults);
    });

    it('should handle missing optional parameters', async () => {
      // Given: Only required parameter
      vi.mocked(mockSdkClient.GET).mockResolvedValue({
        data: [],
        response: {} as Response,
      });

      // When: Execute tool with minimal params
      const result = await toolHandler('oak-search-lessons', {
        q: 'algebra',
      });

      // Then: SDK is called with only query parameter
      expect(mockSdkClient.GET).toHaveBeenCalledWith('/search/lessons', {
        params: {
          query: {
            q: 'algebra',
          },
          path: {},
        },
      });

      expect(result).toEqual([]);
    });
  });

  describe('oak-get-lessons-summary tool', () => {
    it('should get lesson summary by slug', async () => {
      // Given: Mock SDK returns lesson summary
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

      vi.mocked(mockSdkClient.GET).mockResolvedValue({
        data: mockLesson,
        response: {} as Response,
      });

      // When: Execute tool
      const result = await toolHandler('oak-get-lessons-summary', {
        lesson: 'intro-fractions',
      });

      // Then: SDK is called correctly with path parameters
      expect(mockSdkClient.GET).toHaveBeenCalledWith('/lessons/{lesson}/summary', {
        params: {
          query: {},
          path: {
            lesson: 'intro-fractions',
          },
        },
      });

      // And: Lesson is returned
      expect(result).toEqual(mockLesson);
    });
  });

  describe('oak-get-key-stages tool', () => {
    it('should list all key stages', async () => {
      // Given: Mock SDK returns key stages
      const mockKeyStages = [
        { slug: 'ks1', title: 'Key Stage 1' },
        { slug: 'ks2', title: 'Key Stage 2' },
      ];

      vi.mocked(mockSdkClient.GET).mockResolvedValue({
        data: mockKeyStages,
        response: {} as Response,
      });

      // When: Execute tool (no parameters needed)
      const result = await toolHandler('oak-get-key-stages', {});

      // Then: SDK is called with empty options object
      expect(mockSdkClient.GET).toHaveBeenCalledWith('/key-stages', {});

      // And: Key stages are returned
      expect(result).toEqual(mockKeyStages);
    });
  });

  describe('oak-get-subjects tool', () => {
    it('should list all subjects', async () => {
      // Given: Mock SDK returns subjects
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

      vi.mocked(mockSdkClient.GET).mockResolvedValue({
        data: mockSubjects,
        response: {} as Response,
      });

      // When: Execute tool (no parameters needed)
      const result = await toolHandler('oak-get-subjects', {});

      // Then: SDK is called with empty options object
      expect(mockSdkClient.GET).toHaveBeenCalledWith('/subjects', {});

      // And: Subjects are returned
      expect(result).toEqual(mockSubjects);
    });
  });

  describe('error handling', () => {
    it('should throw error for unknown tool', async () => {
      // When/Then: Unknown tool throws McpOperationError
      await expect(toolHandler('unknown-tool', {})).rejects.toThrow('MCP tool unknown-tool failed');
    });

    it('should wrap SDK errors', async () => {
      // Given: SDK throws error
      const originalError = new Error('API unavailable');
      vi.mocked(mockSdkClient.GET).mockRejectedValue(originalError);

      // When: Call the tool
      let caughtError: unknown;
      try {
        await toolHandler('oak-search-lessons', { q: 'test' });
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

    it('should handle API error responses', async () => {
      // Given: SDK returns error response
      // TEST MOCK ASSERTION RATIONALE:
      // In tests, we need to mock complex runtime types from external libraries.
      // The actual error type depends on the API's OpenAPI schema which is runtime-determined.
      // Using type assertion in test mocks is acceptable as we're not disabling the type system
      // in production code, just creating test fixtures.
      const apiError = {
        statusCode: 400,
        message: 'Bad Request',
      };

      // Mock the SDK's response shape - this matches openapi-fetch's error response structure
      const errorResponse = {
        error: apiError,
        response: {} as Response,
        data: undefined,
      };

      vi.mocked(mockSdkClient.GET).mockResolvedValue(
        errorResponse as Awaited<ReturnType<typeof mockSdkClient.GET>>,
      );

      // When: Call the tool
      let caughtError: unknown;
      try {
        await toolHandler('oak-get-subjects', {});
      } catch (error) {
        caughtError = error;
      }

      // Then: Error is wrapped in McpOperationError
      expect(caughtError).toBeInstanceOf(McpOperationError);
      if (caughtError instanceof McpOperationError) {
        expect(caughtError.message).toContain('API call failed');
        expect(caughtError.operation).toBe('oak-get-subjects');
        expect(caughtError.cause).toEqual(apiError);
      }
    });
  });
});
