import { describe, expect, it } from 'vitest';
import type { ReferenceObject, SchemaObject } from 'openapi3-ts/oas31';

import { sampleSchemaObject } from './schema-sample-core.js';

describe('schema-sample-core', () => {
  it('produces deterministic values for object schemas with references', () => {
    const childSchema: SchemaObject = {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: 'child-id',
        },
      },
      required: ['id'],
    };

    const rootSchema: SchemaObject = {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'Example Title',
        },
        count: {
          type: 'integer',
        },
        child: {
          $ref: '#/components/schemas/Child',
        } as ReferenceObject,
      },
      required: ['title', 'count', 'child'],
    };

    const sample = sampleSchemaObject(rootSchema, (ref) => {
      if (ref === '#/components/schemas/Child') {
        return childSchema;
      }
      throw new Error(`Unexpected reference: ${ref}`);
    });

    expect(sample).toEqual({
      title: 'Example Title',
      count: 0,
      child: { id: 'child-id' },
    });
  });

  it('includes optional properties defined via allOf compositions', () => {
    const schema: SchemaObject = {
      allOf: [
        {
          type: 'object',
          properties: {
            title: { type: 'string' },
          },
          required: ['title'],
        },
        {
          type: 'object',
          properties: {
            canonicalUrl: {
              type: 'string',
            },
          },
        },
      ],
    };

    const sample = sampleSchemaObject(schema, () => {
      throw new Error('No references expected');
    });

    expect(sample).toEqual({
      title: 'string',
      canonicalUrl: 'string',
    });
  });
});
