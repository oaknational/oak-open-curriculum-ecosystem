/**
 * Unit tests for subject operations
 * Following TDD - test written before implementation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Logger } from '@oaknational/mcp-moria';
import type { OakApiClient } from '@oaknational/oak-curriculum-sdk';
import { listSubjects } from './subjects';

describe('listSubjects', () => {
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

  it('should list all subjects using SDK', async () => {
    // Given: Mock SDK returns subjects
    const mockSubjects = [
      { subjectSlug: 'english', subjectTitle: 'English' },
      { subjectSlug: 'maths', subjectTitle: 'Mathematics' },
      { subjectSlug: 'science', subjectTitle: 'Science' },
      { subjectSlug: 'history', subjectTitle: 'History' },
    ];

    vi.mocked(mockSdk.GET).mockResolvedValue({
      data: mockSubjects,
      error: undefined,
    });

    // When: List subjects
    const result = await listSubjects(mockSdk, mockLogger);

    // Then: SDK is called with correct endpoint
    expect(mockSdk.GET).toHaveBeenCalledWith('/subjects');

    // And: Results are returned
    expect(result).toEqual(mockSubjects);

    // And: Logger logs the operation
    expect(mockLogger.info).toHaveBeenCalledWith('Listing subjects');
    expect(mockLogger.debug).toHaveBeenCalledWith('Found 4 subjects');
  });

  it('should handle SDK errors gracefully', async () => {
    // Given: SDK returns an error
    vi.mocked(mockSdk.GET).mockResolvedValue({
      data: undefined,
      error: { status: 503, message: 'Service unavailable' },
    });

    // When: List subjects
    // Then: Error is thrown with context
    await expect(listSubjects(mockSdk, mockLogger)).rejects.toThrow(
      'Curriculum listSubjects failed',
    );

    // And: Error is logged
    expect(mockLogger.error).toHaveBeenCalled();
  });
});
