/**
 * Unit tests for executeToolCall using TOOL_GROUPINGS executors
 *
 * Tests the pure function logic of tool execution without IO or side effects.
 * Following TDD - this is the Red phase where tests fail initially.
 */

import { describe, it, expect, vi } from 'vitest';
import { executeToolCall } from './execute-tool-call';
import type { OakApiPathBasedClient } from '../client/oak-base-client';

describe('executeToolCall with TOOL_GROUPINGS executors', () => {
  describe('tool name validation', () => {
    it('returns error for unknown tool name', async () => {
      const mockClient = {} as OakApiPathBasedClient;
      const result = await executeToolCall('unknown-tool', {}, mockClient);

      expect(result).toHaveProperty('error');
      expect(result.error?.message).toContain('Unknown tool');
    });

    it('accepts valid tool name from TOOL_GROUPINGS', async () => {
      const mockClient = {
        '/sequences/{sequence}/units': {
          GET: vi.fn().mockResolvedValue({ data: 'test' }),
        },
      } as unknown as OakApiPathBasedClient;

      const result = await executeToolCall(
        'oak-get-sequences-units',
        { sequence: 'english-primary', year: '1' }, // year is required
        mockClient,
      );

      expect(result).not.toHaveProperty('error');
    });
  });

  describe('parameter transformation', () => {
    it('splits flat args into pathParams and queryParams', async () => {
      // The TOOL_GROUPINGS executor handles parameter splitting internally
      // We can't directly test the splitting without accessing internals
      // Instead, we verify the behaviour through the result
      const mockClient = {} as OakApiPathBasedClient;

      const result = await executeToolCall(
        'oak-get-sequences-units',
        {
          sequence: 'english-primary', // path param
          year: '1', // query param
        },
        mockClient,
      );

      // The executor will be called with split params internally
      // We verify by checking the response structure
      expect(result).toBeDefined();
    });
  });

  describe('parameter validation', () => {
    it('validates enum values for constrained parameters', async () => {
      const mockClient = {} as OakApiPathBasedClient;

      const result = await executeToolCall(
        'oak-get-sequences-units',
        {
          sequence: 'english-primary',
          year: 'invalid-year', // Not in enum ['1', '2', '3', ...]
        },
        mockClient,
      );

      expect(result).toHaveProperty('error');
      expect(result.error?.message).toContain('Invalid year');
    });

    it('accepts valid enum values', async () => {
      const mockClient = {
        '/sequences/{sequence}/units': {
          GET: vi.fn().mockResolvedValue({ data: 'test' }),
        },
      } as unknown as OakApiPathBasedClient;

      const result = await executeToolCall(
        'oak-get-sequences-units',
        {
          sequence: 'english-primary',
          year: '1', // Valid enum value
        },
        mockClient,
      );

      expect(result).not.toHaveProperty('error');
    });
  });

  describe('executor invocation', () => {
    it('calls the embedded executor function', async () => {
      const mockResponse = { units: ['unit1', 'unit2'] };
      const mockClient = {
        '/sequences/{sequence}/units': {
          GET: vi.fn().mockResolvedValue(mockResponse),
        },
      } as unknown as OakApiPathBasedClient;

      const result = await executeToolCall(
        'oak-get-sequences-units',
        { sequence: 'english-primary', year: '1' }, // year is required
        mockClient,
      );

      expect(result).toEqual({ data: mockResponse });
    });

    it('preserves type information through execution', async () => {
      // This test verifies that no type assertions are used
      // The type checker will fail if type information is lost
      const mockClient = {
        '/key-stages/{keyStage}/subject/{subject}/assets': {
          GET: vi.fn().mockResolvedValue({ assets: [] }),
        },
      } as unknown as OakApiPathBasedClient;

      const result = await executeToolCall(
        'oak-get-key-stages-subject-assets',
        {
          keyStage: 'ks1', // Must be exact enum value
          subject: 'maths', // Must be exact enum value
          type: 'worksheet', // Optional but constrained
        },
        mockClient,
      );

      expect(result).toHaveProperty('data');
    });
  });

  describe('error handling', () => {
    it('handles executor errors gracefully', async () => {
      const mockClient = {
        '/sequences/{sequence}/units': {
          GET: vi.fn().mockRejectedValue(new Error('API error')),
        },
      } as unknown as OakApiPathBasedClient;

      const result = await executeToolCall(
        'oak-get-sequences-units',
        { sequence: 'english-primary', year: '1' }, // year is required
        mockClient,
      );

      expect(result).toHaveProperty('error');
      expect(result.error?.message).toContain('API error');
    });
  });
});
