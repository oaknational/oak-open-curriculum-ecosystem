/**
 * Integration tests for key stages operations
 * Tests the integration between curriculum organ and SDK
 * Following TDD - test written before implementation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Logger } from '@oaknational/mcp-moria';
import type { OakApiClient } from '@oaknational/oak-curriculum-sdk';
import { listKeyStages } from './key-stages';
import { createMockSdkSuccessResponse, createMockSdkErrorResponse } from '../test-utils';

describe('listKeyStages', () => {
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

  it('should list key stages using SDK and return results', async () => {
    // Given: Mock SDK returns key stages
    const mockKeyStages = [
      { slug: 'ks1', title: 'Key Stage 1' },
      { slug: 'ks2', title: 'Key Stage 2' },
      { slug: 'ks3', title: 'Key Stage 3' },
      { slug: 'ks4', title: 'Key Stage 4' },
    ];

    mockSdkGet.mockResolvedValue(createMockSdkSuccessResponse(mockKeyStages));

    // When: List key stages
    const result = await listKeyStages(mockSdk, mockLogger);

    // Then: SDK is called with correct endpoint
    expect(mockSdkGet).toHaveBeenCalledWith('/key-stages');

    // And: Results are returned
    expect(result).toEqual(mockKeyStages);

    // And: Logger logs the operation
    expect(mockLoggerInfo).toHaveBeenCalledWith('Listing key stages');
    expect(mockLoggerDebug).toHaveBeenCalledWith('Found 4 key stages');
  });

  it('should handle empty key stages list', async () => {
    // Given: SDK returns empty array
    mockSdkGet.mockResolvedValue(createMockSdkSuccessResponse([]));

    // When: List key stages
    const result = await listKeyStages(mockSdk, mockLogger);

    // Then: Empty array is returned
    expect(result).toEqual([]);

    // And: Logger indicates no results
    expect(mockLoggerDebug).toHaveBeenCalledWith('Found 0 key stages');
  });

  it('should handle SDK errors gracefully', async () => {
    // Given: SDK returns an error
    mockSdkGet.mockResolvedValue(
      createMockSdkErrorResponse({ status: 500, message: 'Internal server error' }),
    );

    // When: List key stages
    // Then: Error is thrown with context
    await expect(listKeyStages(mockSdk, mockLogger)).rejects.toThrow(
      'Curriculum listKeyStages failed',
    );

    // And: Error is logged
    expect(mockLoggerError).toHaveBeenCalled();
  });
});
