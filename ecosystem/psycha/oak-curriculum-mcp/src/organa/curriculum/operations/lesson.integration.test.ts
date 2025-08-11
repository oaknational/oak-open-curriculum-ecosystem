/**
 * Unit tests for lesson operations
 * Following TDD - test written before implementation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Logger } from '@oaknational/mcp-moria';
import type { OakApiClient } from '@oaknational/oak-curriculum-sdk';
import { getLesson } from './lesson';

describe('getLesson', () => {
  let mockSdk: OakApiClient;
  let mockLogger: Logger;

  beforeEach(() => {
    // Create mock SDK client
    mockSdk = {
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
  });

  it('should get lesson summary using SDK', async () => {
    // Given: Mock SDK returns lesson summary
    const mockLessonSummary = {
      lessonTitle: 'Introduction to Fractions',
      lessonSlug: 'introduction-to-fractions-2h6t8',
      subjectTitle: 'Mathematics',
      subjectSlug: 'maths',
      keyStageTitle: 'Key Stage 2',
      keyStageSlug: 'ks2',
      yearTitle: 'Year 4',
      programmeSlug: 'maths-primary-ks2',
      unitTitle: 'Fractions',
      unitSlug: 'fractions-y4',
      keyLearningPoints: [
        'Understanding what a fraction represents',
        'Identifying fractions of shapes',
      ],
      pupilLessonOutcome: 'I can identify and compare simple fractions',
      lessonKeywords: ['fraction', 'numerator', 'denominator'],
    };

    vi.mocked(mockSdk.GET).mockResolvedValue({
      data: mockLessonSummary,
      error: undefined,
    });

    // When: Get lesson by slug
    const lessonSlug = 'introduction-to-fractions-2h6t8';
    const result = await getLesson(mockSdk, mockLogger, lessonSlug);

    // Then: SDK is called with correct path
    expect(mockSdk.GET).toHaveBeenCalledWith('/lessons/{lessonSlug}/summary', {
      params: {
        path: {
          lessonSlug: 'introduction-to-fractions-2h6t8',
        },
      },
    });

    // And: Result is returned
    expect(result).toEqual(mockLessonSummary);

    // And: Logger logs the operation
    expect(mockLogger.info).toHaveBeenCalledWith('Getting lesson', { lessonSlug });
    expect(mockLogger.debug).toHaveBeenCalledWith('Lesson retrieved', {
      lessonSlug,
      title: 'Introduction to Fractions',
    });
  });

  it('should handle lesson not found error', async () => {
    // Given: SDK returns 404 error
    vi.mocked(mockSdk.GET).mockResolvedValue({
      data: undefined,
      error: { status: 404, message: 'Lesson not found' },
    });

    // When: Get non-existent lesson
    const lessonSlug = 'non-existent-lesson';

    // Then: Error is thrown with context
    await expect(getLesson(mockSdk, mockLogger, lessonSlug)).rejects.toThrow(
      'Curriculum getLesson failed',
    );

    // And: Error is logged
    expect(mockLogger.error).toHaveBeenCalled();
  });

  it('should validate lesson slug is not empty', async () => {
    // When: Get lesson with empty slug
    const lessonSlug = '';

    // Then: Error is thrown immediately
    await expect(getLesson(mockSdk, mockLogger, lessonSlug)).rejects.toThrow(
      'Lesson slug is required',
    );

    // And: SDK is not called
    expect(mockSdk.GET).not.toHaveBeenCalled();
  });
});
