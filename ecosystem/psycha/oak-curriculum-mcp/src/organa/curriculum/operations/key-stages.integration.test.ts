/**
 * Unit tests for key stage operations
 * Following TDD - test written before implementation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Logger } from '@oaknational/mcp-moria';
import type { OakApiClient } from '@oaknational/oak-curriculum-sdk';
import { listKeyStages } from './key-stages';

describe('listKeyStages', () => {
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

  it('should list all key stages using SDK', async () => {
    // Given: Mock SDK returns key stages
    const mockKeyStages = [
      { slug: 'eyfs', title: 'Early Years Foundation Stage' },
      { slug: 'ks1', title: 'Key Stage 1' },
      { slug: 'ks2', title: 'Key Stage 2' },
      { slug: 'ks3', title: 'Key Stage 3' },
      { slug: 'ks4', title: 'Key Stage 4' },
    ];

    vi.mocked(mockSdk.GET).mockResolvedValue({
      data: mockKeyStages,
      error: undefined,
    });

    // When: List key stages
    const result = await listKeyStages(mockSdk, mockLogger);

    // Then: SDK is called with correct endpoint
    expect(mockSdk.GET).toHaveBeenCalledWith('/key-stages');

    // And: Results are returned
    expect(result).toEqual(mockKeyStages);

    // And: Logger logs the operation
    expect(mockLogger.info).toHaveBeenCalledWith('Listing key stages');
    expect(mockLogger.debug).toHaveBeenCalledWith('Found 5 key stages');
  });

  it('should handle empty key stages list', async () => {
    // Given: SDK returns empty array
    vi.mocked(mockSdk.GET).mockResolvedValue({
      data: [],
      error: undefined,
    });

    // When: List key stages
    const result = await listKeyStages(mockSdk, mockLogger);

    // Then: Empty array is returned
    expect(result).toEqual([]);

    // And: Logger indicates no results
    expect(mockLogger.debug).toHaveBeenCalledWith('Found 0 key stages');
  });

  it('should handle SDK errors gracefully', async () => {
    // Given: SDK returns an error
    vi.mocked(mockSdk.GET).mockResolvedValue({
      data: undefined,
      error: { status: 500, message: 'Internal server error' },
    });

    // When: List key stages
    // Then: Error is thrown with context
    await expect(listKeyStages(mockSdk, mockLogger)).rejects.toThrow(
      'Curriculum listKeyStages failed',
    );

    // And: Error is logged
    expect(mockLogger.error).toHaveBeenCalled();
  });
});
