import { describe, it, expect } from 'vitest';
import { buildFlatMcpZodObject, buildInputSchemaObject } from './emit-input-schema.js';
import type { ParamMetadataMap } from './param-metadata.js';
import { normaliseParamName } from './param-metadata.js';

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

      // Assert: Should generate flat Zod object string with .describe() for documented params
      expect(result).toContain('z.object({');
      expect(result).toContain('q: z.string().describe("Search query")');
      expect(result).toContain('limit: z.number().optional()');
      expect(result).not.toContain('params');
      // Note: 'query' appears in the description, so we check for nested structure indicator instead
      expect(result).not.toContain('query:');
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

      // Uses z.enum() for proper JSON Schema conversion via zodToJsonSchema
      expect(result).toContain('keyStage: z.enum(["ks1", "ks2", "ks3", "ks4"] as const)');
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

      // Both parameters at top level with z.enum() for allowed values
      expect(result).toContain('keyStage: z.enum(["ks1", "ks2"] as const)');
      expect(result).toContain('subject: z.string().optional()');
      expect(result).not.toContain('params');
    });

    it('should handle zero parameters (empty object)', () => {
      const pathParams: ParamMetadataMap = {};
      const queryParams: ParamMetadataMap = {};

      const result = buildFlatMcpZodObject(pathParams, queryParams);

      expect(result).toBe('z.object({})');
    });

    it('normalises Slug-suffixed path params in flat Zod schema', () => {
      const pathParams: ParamMetadataMap = {
        threadSlug: {
          typePrimitive: 'string',
          required: true,
          valueConstraint: false,
        },
      };

      const result = buildFlatMcpZodObject(pathParams, {});

      expect(result).toContain('thread: z.string()');
      expect(result).not.toContain('threadSlug');
    });
  });

  describe('preserving parameter metadata', () => {
    it('should preserve enum values using z.enum()', () => {
      const queryParams: ParamMetadataMap = {
        status: {
          typePrimitive: 'string',
          required: true,
          allowedValues: ['active', 'inactive'],
          valueConstraint: true,
        },
      };

      const result = buildFlatMcpZodObject({}, queryParams);

      // Uses z.enum() for proper JSON Schema conversion
      expect(result).toContain('z.enum(["active", "inactive"] as const)');
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

describe('buildInputSchemaObject', () => {
  it('uses anyOf schema for numeric year parameters in flat schema', () => {
    const queryParams: ParamMetadataMap = {
      year: {
        typePrimitive: 'number',
        required: false,
        valueConstraint: false,
        description: 'Year filter',
      },
    };

    const schema = buildInputSchemaObject({}, queryParams);
    const yearProperty = schema.properties.year;

    expect(yearProperty).toEqual({
      anyOf: [
        {
          type: 'string',
          enum: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', 'all-years'],
          description: 'Year filter',
        },
        { type: 'number', description: 'Year filter' },
      ],
    });
  });

  it('keeps constrained year parameters as primitive schema', () => {
    const queryParams: ParamMetadataMap = {
      year: {
        typePrimitive: 'number',
        required: false,
        valueConstraint: true,
        allowedValues: [1, 2, 3],
        description: 'Constrained year filter',
      },
    };

    const schema = buildInputSchemaObject({}, queryParams);
    const yearProperty = schema.properties.year;

    expect(yearProperty).toEqual({
      type: 'number',
      enum: [1, 2, 3],
      description: 'Constrained year filter',
    });
  });

  it('normalises Slug-suffixed path params in flat JSON Schema', () => {
    const pathParams: ParamMetadataMap = {
      threadSlug: {
        typePrimitive: 'string',
        required: true,
        valueConstraint: false,
      },
    };

    const schema = buildInputSchemaObject(pathParams, {});

    expect(schema.properties).toHaveProperty('thread');
    expect(schema.properties).not.toHaveProperty('threadSlug');
    expect(schema.required).toContain('thread');
    expect(schema.required).not.toContain('threadSlug');
  });
});

describe('normaliseParamName', () => {
  it('strips Slug suffix from parameter names', () => {
    expect(normaliseParamName('threadSlug')).toBe('thread');
  });

  it('leaves names without Slug suffix unchanged', () => {
    expect(normaliseParamName('lesson')).toBe('lesson');
    expect(normaliseParamName('subject')).toBe('subject');
    expect(normaliseParamName('keyStage')).toBe('keyStage');
  });

  it('is case-sensitive — does not strip lowercase slug', () => {
    expect(normaliseParamName('threadslug')).toBe('threadslug');
  });
});
