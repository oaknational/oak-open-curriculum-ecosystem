/**
 * Integration tests for search operations
 * Tests the integration between curriculum organ and SDK
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Logger } from '@oaknational/mcp-moria';
import type { OakApiClient } from '@oaknational/oak-curriculum-sdk';
import { searchLessons } from './search';
import { createMockSdkSuccessResponse, createMockSdkErrorResponse } from '../test-utils';

describe('searchLessons', () => {
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

  it('should search for lessons using SDK and return results', async () => {
    // Given: Mock SDK returns search results
    const mockResults = [
      {
        lessonSlug: 'introduction-to-fractions-2h6t8',
        lessonTitle: 'Introduction to Fractions',
        subjectSlug: 'maths',
        subjectTitle: 'Mathematics',
        keyStageSlug: 'ks2',
        keyStageTitle: 'Key Stage 2',
      },
    ];

    mockSdkGet.mockResolvedValue(createMockSdkSuccessResponse(mockResults));

    // When: Search for lessons
    const params = {
      q: 'fractions',
      keyStage: 'ks2' as const,
      subject: 'maths' as const,
    };
    const results = await searchLessons(mockSdk, mockLogger, params);

    // Then: SDK is called with correct parameters
    expect(mockSdk.GET).toHaveBeenCalledWith('/search/lessons', {
      params: {
        query: {
          q: 'fractions',
          keyStage: 'ks2',
          subject: 'maths',
        },
      },
    });

    // And: Results are returned
    expect(results).toEqual(mockResults);

    // And: Logger logs the operation
    expect(mockLoggerInfo).toHaveBeenCalledWith('Searching lessons', params);
    expect(mockLoggerDebug).toHaveBeenCalledWith('Found 1 lesson');
  });

  it('should handle SDK errors gracefully', async () => {
    // Given: SDK returns an error
    mockSdkGet.mockResolvedValue(
      createMockSdkErrorResponse({ status: 500, message: 'Internal server error' }),
    );

    // When: Search for lessons
    const params = { q: 'fractions' };

    // Then: Error is thrown with context
    await expect(searchLessons(mockSdk, mockLogger, params)).rejects.toThrow(
      'Curriculum searchLessons failed',
    );

    // And: Error is logged
    expect(mockLoggerError).toHaveBeenCalled();
  });

  it('should handle empty search results', async () => {
    // Given: SDK returns empty results
    mockSdkGet.mockResolvedValue(createMockSdkSuccessResponse([]));

    // When: Search for lessons
    const params = { q: 'nonexistent' };
    const results = await searchLessons(mockSdk, mockLogger, params);

    // Then: Empty array is returned
    expect(results).toEqual([]);

    // And: Logger indicates no results
    expect(mockLoggerDebug).toHaveBeenCalledWith('No lessons found');
  });
});
