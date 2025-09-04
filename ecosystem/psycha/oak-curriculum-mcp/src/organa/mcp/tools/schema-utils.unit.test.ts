import { describe, it, expect } from 'vitest';
import { buildInputObjectSchema, toJsonSchemaProperty } from './schema-utils.js';

describe('schema-utils', () => {
  it('normalises number enums and marks required fields', () => {
    const schema = buildInputObjectSchema(
      [
        [
          'id',
          {
            typePrimitive: 'number',
            valueConstraint: true,
            required: true,
            allowedValues: [1, 2, 3],
          },
        ],
      ],
      [],
    );

    expect(schema.type).toBe('object');
    expect(schema.required).toEqual(['id']);
    expect(schema.properties?.id).toEqual({
      type: 'number',
      enum: [1, 2, 3],
      description: 'One of: 1, 2, 3',
    });
  });

  it('defaults to string type and omits description when no constraint', () => {
    const prop = toJsonSchemaProperty({
      typePrimitive: 'string',
      valueConstraint: false,
      required: false,
      allowedValues: ['a', 'b'],
    });
    expect(prop.type).toBe('string');
    expect(prop.enum).toEqual(['a', 'b']);
    expect(prop.description).toBeUndefined();
  });
});
