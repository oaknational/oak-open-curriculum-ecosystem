/**
 * Integration tests for subjects operations
 * Tests the integration between curriculum organ and SDK
 * Following TDD - test written before implementation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Logger } from '@oaknational/mcp-moria';
import type { OakApiClient } from '@oaknational/oak-curriculum-sdk';
import { listSubjects } from './subjects';
import { createMockSdkSuccessResponse, createMockSdkErrorResponse } from '../test-utils';

describe('listSubjects', () => {
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

  it('should list subjects using SDK and return results', async () => {
    // Given: Mock SDK returns subjects
    const mockSubjects = [
      { subjectSlug: 'maths', subjectTitle: 'Mathematics' },
      { subjectSlug: 'english', subjectTitle: 'English' },
      { subjectSlug: 'science', subjectTitle: 'Science' },
      { subjectSlug: 'history', subjectTitle: 'History' },
    ];

    mockSdkGet.mockResolvedValue(createMockSdkSuccessResponse(mockSubjects));

    // When: List subjects
    const result = await listSubjects(mockSdk, mockLogger);

    // Then: SDK is called with correct endpoint
    expect(mockSdk.GET).toHaveBeenCalledWith('/subjects');

    // And: Results are returned
    expect(result).toEqual(mockSubjects);

    // And: Logger logs the operation
    expect(mockLoggerInfo).toHaveBeenCalledWith('Listing subjects');
    expect(mockLoggerDebug).toHaveBeenCalledWith('Found 4 subjects');
  });

  it('should handle SDK errors gracefully', async () => {
    // Given: SDK returns an error
    mockSdkGet.mockResolvedValue(
      createMockSdkErrorResponse({ status: 500, message: 'Internal server error' }),
    );

    // When: List subjects
    // Then: Error is thrown with context
    await expect(listSubjects(mockSdk, mockLogger)).rejects.toThrow(
      'Curriculum listSubjects failed',
    );

    // And: Error is logged
    expect(mockLoggerError).toHaveBeenCalled();
  });
});
