import { describe, it, expect } from 'vitest';
import { buildZodType, buildZodFields } from './build-zod-type.js';
import type { ParamMetadata } from './param-metadata.js';

/**
 * MCP-487 — flat numeric params are wrapped so a string-encoded number from a
 * real MCP client is accepted, without relaxing the bound inside.
 */
const FLAT_NUMERIC_GUARD = String.raw`z.preprocess((val) => typeof val === 'string' && /^-?\d+(\.\d+)?$/.test(val) ? Number(val) : val, `;

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
      expect(buildZodType(meta)).toBe(
        String.raw`z.string().describe("Key stage slug, e.g. \"ks2\"")`,
      );
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
    it('normalises numeric year parameter with preprocess in flat context', () => {
      const meta: ParamMetadata = {
        typePrimitive: 'number',
        valueConstraint: false,
        required: true,
      };

      expect(buildZodType(meta, 'year', 'flat')).toBe(
        'z.preprocess((val) => typeof val === \'number\' && Number.isInteger(val) && val >= 1 && val <= 11 ? String(val) : val, z.enum(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "all-years"] as const))',
      );
    });

    it('normalises string-enum year parameter with preprocess in flat context', () => {
      const meta: ParamMetadata = {
        typePrimitive: 'string',
        valueConstraint: true,
        required: true,
        allowedValues: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', 'all-years'],
      };

      expect(buildZodType(meta, 'year', 'flat')).toBe(
        'z.preprocess((val) => typeof val === \'number\' && Number.isInteger(val) && val >= 1 && val <= 11 ? String(val) : val, z.enum(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "all-years"] as const))',
      );
    });

    it('does not normalise non-year string-enum in flat context', () => {
      const meta: ParamMetadata = {
        typePrimitive: 'string',
        valueConstraint: true,
        required: true,
        allowedValues: ['ks1', 'ks2', 'ks3', 'ks4'],
      };

      expect(buildZodType(meta, 'keyStage', 'flat')).toBe(
        'z.enum(["ks1", "ks2", "ks3", "ks4"] as const)',
      );
    });

    it('does not normalise string-enum year in nested context', () => {
      const meta: ParamMetadata = {
        typePrimitive: 'string',
        valueConstraint: true,
        required: true,
        allowedValues: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', 'all-years'],
      };

      expect(buildZodType(meta, 'year', 'nested')).toBe(
        'z.enum(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "all-years"] as const)',
      );
    });

    it('normalises year parameter and preserves description', () => {
      const meta: ParamMetadata = {
        typePrimitive: 'number',
        valueConstraint: false,
        required: true,
        description: 'Year group filter',
      };

      const result = buildZodType(meta, 'year', 'flat');

      expect(result).toContain('z.preprocess(');
      expect(result).toContain('.describe("Year group filter")');
    });

    it('does not alter non-year numeric parameters', () => {
      const meta: ParamMetadata = {
        typePrimitive: 'number',
        valueConstraint: false,
        required: true,
      };

      expect(buildZodType(meta, 'size', 'flat')).toBe(`${FLAT_NUMERIC_GUARD}z.number())`);
    });
  });

  describe('.meta() examples emission', () => {
    it('emits .meta({ examples }) for string example in flat context', () => {
      const meta: ParamMetadata = {
        typePrimitive: 'string',
        valueConstraint: true,
        required: true,
        allowedValues: ['ks1', 'ks2', 'ks3', 'ks4'],
        description: 'Key stage slug',
        example: 'ks1',
      };
      expect(buildZodType(meta, 'keyStage', 'flat')).toBe(
        'z.enum(["ks1", "ks2", "ks3", "ks4"] as const).describe("Key stage slug").meta({ examples: ["ks1"] })',
      );
    });

    it('emits .meta({ examples }) for number example in flat context', () => {
      const meta: ParamMetadata = {
        typePrimitive: 'number',
        valueConstraint: false,
        required: false,
        description: 'Offset for pagination',
        example: 50,
      };
      expect(buildZodType(meta, 'offset', 'flat')).toBe(
        `${FLAT_NUMERIC_GUARD}z.number()).describe("Offset for pagination").meta({ examples: [50] })`,
      );
    });

    it('does not emit .meta() in nested context', () => {
      const meta: ParamMetadata = {
        typePrimitive: 'string',
        valueConstraint: false,
        required: true,
        description: 'Some param',
        example: 'val',
      };
      expect(buildZodType(meta, 'param', 'nested')).toBe('z.string().describe("Some param")');
    });

    it('does not emit .meta() when example is undefined', () => {
      const meta: ParamMetadata = {
        typePrimitive: 'string',
        valueConstraint: false,
        required: true,
        description: 'No example here',
      };
      expect(buildZodType(meta, 'param', 'flat')).toBe('z.string().describe("No example here")');
    });

    it('does not emit .meta() for z.preprocess year params even if example exists', () => {
      const meta: ParamMetadata = {
        typePrimitive: 'number',
        valueConstraint: false,
        required: true,
        example: 5,
      };
      const result = buildZodType(meta, 'year', 'flat');
      expect(result).toContain('z.preprocess(');
      expect(result).not.toContain('.meta(');
    });

    it('emits .meta() even without description in flat context', () => {
      const meta: ParamMetadata = {
        typePrimitive: 'string',
        valueConstraint: false,
        required: true,
        example: 'val',
      };
      expect(buildZodType(meta, 'param', 'flat')).toBe('z.string().meta({ examples: ["val"] })');
    });
  });

  describe('numeric range constraints', () => {
    it('emits .lte() for a maximum', () => {
      const meta: ParamMetadata = {
        typePrimitive: 'number',
        valueConstraint: false,
        required: false,
        maximum: 300,
      };
      expect(buildZodType(meta, 'limit', 'flat')).toBe(`${FLAT_NUMERIC_GUARD}z.number().lte(300))`);
    });

    it('emits .gte() for a minimum', () => {
      const meta: ParamMetadata = {
        typePrimitive: 'number',
        valueConstraint: false,
        required: false,
        minimum: 1,
      };
      expect(buildZodType(meta, 'limit', 'flat')).toBe(`${FLAT_NUMERIC_GUARD}z.number().gte(1))`);
    });

    it('emits .gte() before .lte() when both bounds are present', () => {
      const meta: ParamMetadata = {
        typePrimitive: 'number',
        valueConstraint: false,
        required: false,
        minimum: 1,
        maximum: 300,
      };
      expect(buildZodType(meta, 'limit', 'flat')).toBe(
        `${FLAT_NUMERIC_GUARD}z.number().gte(1).lte(300))`,
      );
    });

    it('chains bounds before .describe() and .meta()', () => {
      const meta: ParamMetadata = {
        typePrimitive: 'number',
        valueConstraint: false,
        required: false,
        description: 'Limit the number of keywords',
        example: 20,
        maximum: 300,
      };
      expect(buildZodType(meta, 'limit', 'flat')).toBe(
        `${FLAT_NUMERIC_GUARD}z.number().lte(300)).describe("Limit the number of keywords").meta({ examples: [20] })`,
      );
    });

    it('emits bounds in nested context too, so SDK invoke validation matches', () => {
      const meta: ParamMetadata = {
        typePrimitive: 'number',
        valueConstraint: false,
        required: false,
        maximum: 300,
      };
      expect(buildZodType(meta, 'limit', 'nested')).toBe('z.number().lte(300)');
    });

    it('does not emit bounds on a non-numeric base', () => {
      const meta: ParamMetadata = {
        typePrimitive: 'string',
        valueConstraint: false,
        required: false,
        maximum: 300,
      };
      expect(buildZodType(meta, 'slug', 'flat')).toBe('z.string()');
    });

    it('does not emit bounds on an enum base', () => {
      const meta: ParamMetadata = {
        typePrimitive: 'number',
        valueConstraint: true,
        required: false,
        allowedValues: [1, 2, 3],
        maximum: 300,
      };
      expect(buildZodType(meta, 'tier', 'flat')).toBe('z.enum([1, 2, 3] as const)');
    });

    it('does not emit bounds on the year preprocess wrapper', () => {
      const meta: ParamMetadata = {
        typePrimitive: 'number',
        valueConstraint: false,
        required: false,
        maximum: 11,
      };
      const result = buildZodType(meta, 'year', 'flat');
      expect(result).toContain('z.preprocess(');
      expect(result).not.toContain('.lte(');
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
      'year: z.preprocess((val) => typeof val === \'number\' && Number.isInteger(val) && val >= 1 && val <= 11 ? String(val) : val, z.enum(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "all-years"] as const)).optional()',
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

  it('chains .meta() before .optional() in flat context', () => {
    const entries: [string, ParamMetadata][] = [
      [
        'unit',
        {
          typePrimitive: 'string',
          valueConstraint: false,
          required: false,
          description: 'Unit filter',
          example: 'word-class',
        },
      ],
    ];
    expect(buildZodFields(entries, 'flat')).toEqual([
      'unit: z.string().describe("Unit filter").meta({ examples: ["word-class"] }).optional()',
    ]);
  });
});

/**
 * MCP-487 — numeric arguments arrive as strings from real clients.
 *
 * Claude Code's MCP bridge encodes numeric tool arguments as JSON strings.
 * Verified against live production 2026-08-04: an independent client sending
 * `limit: 25` as a number succeeds, while `limit: "25"` is refused with
 * "expected number, received string". The server is correct and the client is
 * not, but the MCP surface has to work on every major host, so the flat input
 * schema normalises the REPRESENTATION without ever relaxing the CONSTRAINT.
 *
 * `z.coerce.number()` is deliberately not used: it is `Number(value)`
 * underneath, so `""`, `null` and `[]` become `0` and `true` becomes `1` —
 * masking exactly the errors that must keep failing.
 *
 * Flat context only. The nested SDK schema is called from typed code, where a
 * string genuinely is a defect and should fail loudly.
 */
describe('buildZodType — numeric input sanitising for MCP clients (MCP-487)', () => {
  const NUMERIC_STRING_GUARD = FLAT_NUMERIC_GUARD;

  it('wraps a plain numeric flat parameter so a string-encoded number is accepted', () => {
    const meta: ParamMetadata = {
      typePrimitive: 'number',
      valueConstraint: false,
      required: false,
    };
    expect(buildZodType(meta, 'offset', 'flat')).toBe(`${NUMERIC_STRING_GUARD}z.number())`);
  });

  it('keeps the bound INSIDE the wrapper, so a coerced value is still range-checked', () => {
    const meta: ParamMetadata = {
      typePrimitive: 'number',
      valueConstraint: false,
      required: false,
      maximum: 300,
    };
    expect(buildZodType(meta, 'limit', 'flat')).toBe(`${NUMERIC_STRING_GUARD}z.number().lte(300))`);
  });

  it('chains .describe() and .meta() outside the wrapper', () => {
    const meta: ParamMetadata = {
      typePrimitive: 'number',
      valueConstraint: false,
      required: false,
      description: 'Limit the number of keywords',
      example: 20,
      maximum: 300,
    };
    expect(buildZodType(meta, 'limit', 'flat')).toBe(
      `${NUMERIC_STRING_GUARD}z.number().lte(300)).describe("Limit the number of keywords").meta({ examples: [20] })`,
    );
  });

  it('leaves the nested SDK schema strict — a string there is a real defect', () => {
    const meta: ParamMetadata = {
      typePrimitive: 'number',
      valueConstraint: false,
      required: false,
      maximum: 300,
    };
    expect(buildZodType(meta, 'limit', 'nested')).toBe('z.number().lte(300)');
  });

  it('does not wrap an enum base, whose accepted set is already fixed', () => {
    const meta: ParamMetadata = {
      typePrimitive: 'number',
      valueConstraint: true,
      required: false,
      allowedValues: [1, 2, 3],
    };
    expect(buildZodType(meta, 'tier', 'flat')).toBe('z.enum([1, 2, 3] as const)');
  });

  it('does not double-wrap the year parameter, which has its own preprocess', () => {
    const meta: ParamMetadata = {
      typePrimitive: 'number',
      valueConstraint: false,
      required: false,
    };
    const result = buildZodType(meta, 'year', 'flat');
    expect(result).toContain('String(val)');
    expect(result).not.toContain('Number(val)');
  });

  it('does not wrap non-numeric flat parameters', () => {
    const meta: ParamMetadata = {
      typePrimitive: 'string',
      valueConstraint: false,
      required: false,
    };
    expect(buildZodType(meta, 'unit', 'flat')).toBe('z.string()');
  });
});
