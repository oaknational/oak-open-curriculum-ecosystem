import { describe, it, expect } from 'vitest';

// The pure function we will implement next in TDD:
// It builds a JSON Schema object for a tool from path/query param metadata.
// The emitter will then stringify/embed this at generation time.
import type { PrimitiveType } from './param-utils.js';
// This module will be created as part of implementing the plan.
import { buildInputSchemaObject } from './emit-input-schema.js';

interface ParamMetadataLike {
  readonly typePrimitive: PrimitiveType;
  readonly valueConstraint: boolean;
  readonly required: boolean;
  readonly allowedValues?: readonly unknown[];
  readonly description?: string;
  readonly default?: unknown;
}

type MetaRecord = Record<string, ParamMetadataLike>;

describe('buildInputSchemaObject (compile-time schema generator helper)', () => {
  it('emits required string property with additionalProperties: false', () => {
    const pathMeta: MetaRecord = {};
    const queryMeta: MetaRecord = {
      q: { typePrimitive: 'string', valueConstraint: false, required: true },
    };

    const schema = buildInputSchemaObject(pathMeta, queryMeta);

    expect(schema.type).toBe('object');
    expect(schema.additionalProperties).toBe(false);
    expect(schema.properties.q).toEqual({ type: 'string' });
    expect(Array.isArray(schema.required)).toBe(true);
    expect(schema.required?.includes('q')).toBe(true);
  });

  it('maps primitive types and array variants correctly', () => {
    const pathMeta: MetaRecord = {
      a: { typePrimitive: 'number', valueConstraint: false, required: true },
      b: { typePrimitive: 'boolean', valueConstraint: false, required: false },
    };
    const queryMeta: MetaRecord = {
      s: { typePrimitive: 'string[]', valueConstraint: false, required: false },
      n: { typePrimitive: 'number[]', valueConstraint: false, required: false },
      z: { typePrimitive: 'boolean[]', valueConstraint: false, required: false },
    };

    const schema = buildInputSchemaObject(pathMeta, queryMeta);

    expect(schema.properties.a).toEqual({ type: 'number' });
    expect(schema.properties.b).toEqual({ type: 'boolean' });
    expect(schema.properties.s).toEqual({ type: 'array', items: { type: 'string' } });
    expect(schema.properties.n).toEqual({ type: 'array', items: { type: 'number' } });
    expect(schema.properties.z).toEqual({ type: 'array', items: { type: 'boolean' } });
    expect(schema.required).toContain('a');
    expect(schema.required).not.toContain('b');
  });

  it('emits enum arrays when allowedValues are present', () => {
    const pathMeta: MetaRecord = {};
    const queryMeta: MetaRecord = {
      subject: {
        typePrimitive: 'string',
        valueConstraint: true,
        required: false,
        allowedValues: ['maths', 'english'] as const,
      },
    };

    const schema = buildInputSchemaObject(pathMeta, queryMeta);

    expect(schema.properties.subject).toEqual({ type: 'string', enum: ['maths', 'english'] });
  });

  it('propagates description and default when provided in metadata', () => {
    const pathMeta: MetaRecord = {
      sequence: {
        typePrimitive: 'string',
        valueConstraint: false,
        required: true,
        description: 'Sequence slug',
      },
    };
    const queryMeta: MetaRecord = {
      year: {
        typePrimitive: 'string',
        valueConstraint: true,
        required: false,
        allowedValues: ['1', '2', 'all-years'] as const,
        description: 'Optional year filter',
        default: 'all-years',
      },
    };

    const schema = buildInputSchemaObject(pathMeta, queryMeta);

    expect(schema.properties.sequence).toEqual({ type: 'string', description: 'Sequence slug' });
    expect(schema.properties.year).toEqual({
      type: 'string',
      enum: ['1', '2', 'all-years'],
      description: 'Optional year filter',
      default: 'all-years',
    });
    expect(schema.required).toContain('sequence');
  });
});
