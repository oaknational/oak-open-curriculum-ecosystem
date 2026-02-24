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
});
