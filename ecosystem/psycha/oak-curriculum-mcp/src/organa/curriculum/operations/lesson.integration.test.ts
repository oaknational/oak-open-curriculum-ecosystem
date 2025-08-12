/**
 * Integration tests for lesson operations
 * Tests the integration between curriculum organ and SDK
 * Following TDD - test written before implementation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Logger } from '@oaknational/mcp-moria';
import type { OakApiClient } from '@oaknational/oak-curriculum-sdk';
import { getLesson } from './lesson';
import { createMockSdkSuccessResponse, createMockSdkErrorResponse } from '../test-utils';

describe('getLesson', () => {
  let mockSdk: OakApiClient;
  let mockLogger: Logger;

  // Store mock functions for easier access
  let mockSdkGet: ReturnType<typeof vi.fn>;
  let mockLoggerInfo: ReturnType<typeof vi.fn>;
  let mockLoggerDebug: ReturnType<typeof vi.fn>;
  let mockLoggerError: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Create mock functions
    mockSdkGet = vi.fn();
    mockLoggerInfo = vi.fn();
    mockLoggerDebug = vi.fn();
    mockLoggerError = vi.fn();

    // Create mock SDK client
    mockSdk = {
      GET: mockSdkGet,
    } as unknown as OakApiClient;

    // Create mock logger
    mockLogger = {
      info: mockLoggerInfo,
      debug: mockLoggerDebug,
      error: mockLoggerError,
      warn: vi.fn(),
      child: vi.fn(() => mockLogger),
    } as unknown as Logger;
  });

  it('should get lesson using SDK and return result', async () => {
    // Given: Mock SDK returns lesson
    const mockLesson = {
      lessonTitle: 'Introduction to Fractions',
      lessonSlug: 'introduction-to-fractions',
      subjectTitle: 'Mathematics',
      subjectSlug: 'maths',
      keyStageTitle: 'Key Stage 2',
      keyStageSlug: 'ks2',
      yearTitle: 'Year 3',
      programmeSlug: 'maths-year-3',
      unitTitle: 'Fractions',
      unitSlug: 'fractions',
      keyLearningPoints: ['Understand what a fraction represents', 'Identify unit fractions'],
      pupilLessonOutcome: 'I can understand fractions',
      lessonKeywords: ['fraction', 'numerator', 'denominator'],
    };

    mockSdkGet.mockResolvedValue(createMockSdkSuccessResponse(mockLesson));

    // When: Get lesson
    const result = await getLesson(mockSdk, mockLogger, 'introduction-to-fractions');

    // Then: SDK is called with correct endpoint
    expect(mockSdk.GET).toHaveBeenCalledWith('/lessons/{lesson}/summary', {
      params: {
        path: {
          lesson: 'introduction-to-fractions',
        },
      },
    });

    // And: Result is returned
    expect(result).toEqual(mockLesson);

    // And: Logger logs the operation
    expect(mockLoggerInfo).toHaveBeenCalledWith('Getting lesson', {
      lessonSlug: 'introduction-to-fractions',
    });
    expect(mockLoggerDebug).toHaveBeenCalledWith('Lesson retrieved', {
      lessonSlug: 'introduction-to-fractions',
      title: 'Introduction to Fractions',
    });
  });

  it('should handle SDK errors gracefully', async () => {
    // Given: SDK returns an error
    mockSdkGet.mockResolvedValue(
      createMockSdkErrorResponse({ status: 404, message: 'Lesson not found' }),
    );

    // When: Get lesson
    const lessonSlug = 'non-existent-lesson';

    // Then: Error is thrown with context
    await expect(getLesson(mockSdk, mockLogger, lessonSlug)).rejects.toThrow(
      'Curriculum getLesson failed',
    );

    // And: Error is logged
    expect(mockLoggerError).toHaveBeenCalled();
  });
});
