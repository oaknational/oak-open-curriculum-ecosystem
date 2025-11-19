import { describe, it, expect } from 'vitest';
import { buildFlatMcpZodObject } from './emit-input-schema.js';
import type { ParamMetadataMap } from './param-metadata.js';

describe('buildFlatMcpZodObject', () => {
  describe('flattening path and query parameters', () => {
    it('should flatten query parameters to top level', () => {
      // Arrange
      const pathParams: ParamMetadataMap = {};
      const queryParams: ParamMetadataMap = {
        q: {
          typePrimitive: 'string',
          required: true,
          valueConstraint: false,
          description: 'Search query',
        },
        limit: {
          typePrimitive: 'number',
          required: false,
          valueConstraint: false,
        },
      };

      // Act
      const result = buildFlatMcpZodObject(pathParams, queryParams);

      // Assert: Should generate flat Zod object string
      expect(result).toContain('z.object({');
      expect(result).toContain('q: z.string()');
      expect(result).toContain('limit: z.number().optional()');
      expect(result).not.toContain('params');
      expect(result).not.toContain('query');
    });

    it('should flatten path parameters to top level', () => {
      const pathParams: ParamMetadataMap = {
        keyStage: {
          typePrimitive: 'string',
          required: true,
          allowedValues: ['ks1', 'ks2', 'ks3', 'ks4'],
          valueConstraint: true,
        },
      };
      const queryParams: ParamMetadataMap = {};

      const result = buildFlatMcpZodObject(pathParams, queryParams);

      expect(result).toContain('keyStage: z.union([');
      expect(result).toContain('z.literal("ks1")');
      expect(result).not.toContain('params');
      expect(result).not.toContain('path');
    });

    it('should merge path and query parameters in flat structure', () => {
      const pathParams: ParamMetadataMap = {
        keyStage: {
          typePrimitive: 'string',
          required: true,
          allowedValues: ['ks1', 'ks2'],
          valueConstraint: true,
        },
      };
      const queryParams: ParamMetadataMap = {
        subject: {
          typePrimitive: 'string',
          required: false,
          valueConstraint: false,
        },
      };

      const result = buildFlatMcpZodObject(pathParams, queryParams);

      // Both parameters at top level
      expect(result).toContain('keyStage: z.union([');
      expect(result).toContain('subject: z.string().optional()');
      expect(result).not.toContain('params');
    });

    it('should handle zero parameters (empty object)', () => {
      const pathParams: ParamMetadataMap = {};
      const queryParams: ParamMetadataMap = {};

      const result = buildFlatMcpZodObject(pathParams, queryParams);

      expect(result).toBe('z.object({})');
    });
  });

  describe('preserving parameter metadata', () => {
    it('should preserve enum values', () => {
      const queryParams: ParamMetadataMap = {
        status: {
          typePrimitive: 'string',
          required: true,
          allowedValues: ['active', 'inactive'],
          valueConstraint: true,
        },
      };

      const result = buildFlatMcpZodObject({}, queryParams);

      expect(result).toContain('z.literal("active")');
      expect(result).toContain('z.literal("inactive")');
    });

    it('should preserve optional/required distinction', () => {
      const queryParams: ParamMetadataMap = {
        required: {
          typePrimitive: 'string',
          required: true,
          valueConstraint: false,
        },
        optional: {
          typePrimitive: 'string',
          required: false,
          valueConstraint: false,
        },
      };

      const result = buildFlatMcpZodObject({}, queryParams);

      expect(result).toContain('required: z.string()');
      expect(result).toContain('optional: z.string().optional()');
    });

    it('should handle array types', () => {
      const queryParams: ParamMetadataMap = {
        tags: {
          typePrimitive: 'string[]',
          required: false,
          valueConstraint: false,
        },
      };

      const result = buildFlatMcpZodObject({}, queryParams);

      expect(result).toContain('tags: z.array(z.string()).optional()');
    });
  });
});
