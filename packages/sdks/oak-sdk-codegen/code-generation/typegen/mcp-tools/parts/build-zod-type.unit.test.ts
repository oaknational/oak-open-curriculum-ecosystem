import { describe, it, expect } from 'vitest';
import { buildZodType, buildZodFields } from './build-zod-type.js';
import type { ParamMetadata } from './param-metadata.js';

/**
 * Unit tests for buildZodType and buildZodFields functions.
 *
 * These tests verify that Zod type strings are generated correctly from
 * parameter metadata, including description support via .describe().
 */
describe('buildZodType', () => {
  describe('basic types without description', () => {
    it('generates z.string() for string type', () => {
      const meta: ParamMetadata = {
        typePrimitive: 'string',
        valueConstraint: false,
        required: true,
      };
      expect(buildZodType(meta)).toBe('z.string()');
    });

    it('generates z.number() for number type', () => {
      const meta: ParamMetadata = {
        typePrimitive: 'number',
        valueConstraint: false,
        required: true,
      };
      expect(buildZodType(meta)).toBe('z.number()');
    });

    it('generates z.boolean() for boolean type', () => {
      const meta: ParamMetadata = {
        typePrimitive: 'boolean',
        valueConstraint: false,
        required: true,
      };
      expect(buildZodType(meta)).toBe('z.boolean()');
    });

    it('generates z.array(z.string()) for string[] type', () => {
      const meta: ParamMetadata = {
        typePrimitive: 'string[]',
        valueConstraint: false,
        required: true,
      };
      expect(buildZodType(meta)).toBe('z.array(z.string())');
    });
  });

  describe('with description', () => {
    it('adds .describe() when description is provided', () => {
      const meta: ParamMetadata = {
        typePrimitive: 'string',
        valueConstraint: false,
        required: true,
        description: 'User name',
      };
      expect(buildZodType(meta)).toBe('z.string().describe("User name")');
    });

    it('omits .describe() when no description', () => {
      const meta: ParamMetadata = {
        typePrimitive: 'string',
        valueConstraint: false,
        required: true,
      };
      expect(buildZodType(meta)).toBe('z.string()');
    });

    it('escapes quotes in description', () => {
      const meta: ParamMetadata = {
        typePrimitive: 'string',
        valueConstraint: false,
        required: true,
        description: 'Key stage slug, e.g. "ks2"',
      };
      expect(buildZodType(meta)).toBe('z.string().describe("Key stage slug, e.g. \\"ks2\\"")');
    });
  });

  describe('with allowed values (enums)', () => {
    it('uses z.enum() for string allowed values', () => {
      const meta: ParamMetadata = {
        typePrimitive: 'string',
        valueConstraint: true,
        required: true,
        allowedValues: ['ks1', 'ks2', 'ks3', 'ks4'],
      };
      expect(buildZodType(meta)).toBe('z.enum(["ks1", "ks2", "ks3", "ks4"] as const)');
    });

    it('uses z.enum() with description', () => {
      const meta: ParamMetadata = {
        typePrimitive: 'string',
        valueConstraint: true,
        required: true,
        allowedValues: ['ks1', 'ks2'],
        description: 'Key stage',
      };
      expect(buildZodType(meta)).toBe('z.enum(["ks1", "ks2"] as const).describe("Key stage")');
    });
  });

  describe('year parameter normalisation', () => {
    it('normalises numeric year parameter to string enum union', () => {
      const meta: ParamMetadata = {
        typePrimitive: 'number',
        valueConstraint: false,
        required: true,
      };

      expect(buildZodType(meta, 'year', 'flat')).toBe(
        'z.union([z.enum(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "all-years"] as const), z.number().int().min(1).max(11).transform(String)])',
      );
    });

    it('keeps string-enum year parameter unchanged', () => {
      const meta: ParamMetadata = {
        typePrimitive: 'string',
        valueConstraint: true,
        required: true,
        allowedValues: ['1', '2', 'all-years'],
      };

      expect(buildZodType(meta, 'year', 'flat')).toBe('z.enum(["1", "2", "all-years"] as const)');
    });

    it('does not alter non-year numeric parameters', () => {
      const meta: ParamMetadata = {
        typePrimitive: 'number',
        valueConstraint: false,
        required: true,
      };

      expect(buildZodType(meta, 'size', 'flat')).toBe('z.number()');
    });
  });
});

describe('buildZodFields', () => {
  it('builds field with required parameter', () => {
    const entries: [string, ParamMetadata][] = [
      [
        'name',
        {
          typePrimitive: 'string',
          valueConstraint: false,
          required: true,
        },
      ],
    ];
    expect(buildZodFields(entries)).toEqual(['name: z.string()']);
  });

  it('builds field with optional parameter', () => {
    const entries: [string, ParamMetadata][] = [
      [
        'name',
        {
          typePrimitive: 'string',
          valueConstraint: false,
          required: false,
        },
      ],
    ];
    expect(buildZodFields(entries)).toEqual(['name: z.string().optional()']);
  });

  it('builds field with description', () => {
    const entries: [string, ParamMetadata][] = [
      [
        'keyStage',
        {
          typePrimitive: 'string',
          valueConstraint: true,
          required: true,
          allowedValues: ['ks1', 'ks2'],
          description: 'Key stage slug',
        },
      ],
    ];
    expect(buildZodFields(entries)).toEqual([
      'keyStage: z.enum(["ks1", "ks2"] as const).describe("Key stage slug")',
    ]);
  });

  it('builds optional field with description', () => {
    const entries: [string, ParamMetadata][] = [
      [
        'unit',
        {
          typePrimitive: 'string',
          valueConstraint: false,
          required: false,
          description: 'Optional unit filter',
        },
      ],
    ];
    expect(buildZodFields(entries)).toEqual([
      'unit: z.string().describe("Optional unit filter").optional()',
    ]);
  });

  it('uses year normalisation in flat context', () => {
    const entries: [string, ParamMetadata][] = [
      [
        'year',
        {
          typePrimitive: 'number',
          valueConstraint: false,
          required: false,
        },
      ],
    ];

    expect(buildZodFields(entries, 'flat')).toEqual([
      'year: z.union([z.enum(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "all-years"] as const), z.number().int().min(1).max(11).transform(String)]).optional()',
    ]);
  });

  it('does not use year normalisation in nested context', () => {
    const entries: [string, ParamMetadata][] = [
      [
        'year',
        {
          typePrimitive: 'number',
          valueConstraint: false,
          required: false,
        },
      ],
    ];

    expect(buildZodFields(entries, 'nested')).toEqual(['year: z.number().optional()']);
  });
});
