/**
 * Unit tests for the `decorateOakUrls` decorator.
 *
 * Validates conditional decoration: the decorator must preserve
 * upstream-defined `oakUrl` fields (with `format: "uri"`) and only
 * inject the SDK's `oakUrl` field when the upstream does not provide
 * one. The upstream's `canonicalUrl` is a separate, unrelated field
 * and must pass through untouched.
 */

import { describe, it, expect } from 'vitest';
import type { OpenAPIObject, SchemaObject } from 'openapi3-ts/oas31';

import { decorateOakUrls } from './schema-separation-decorators.js';

function buildSchemaWithUpstreamOakUrl(): OpenAPIObject {
  return {
    openapi: '3.1.0',
    info: { title: 'Test', version: '1.0.0' },
    paths: {},
    components: {
      schemas: {
        LessonAssetsResponseSchema: {
          type: 'object',
          properties: {
            lessonTitle: { type: 'string' },
            oakUrl: {
              type: 'string',
              format: 'uri',
              description: 'The Oak URL for this lesson',
            },
          },
          required: ['lessonTitle', 'oakUrl'],
        },
      },
    },
  };
}

function buildSchemaWithUpstreamCanonicalUrlAndOakUrl(): OpenAPIObject {
  return {
    openapi: '3.1.0',
    info: { title: 'Test', version: '1.0.0' },
    paths: {},
    components: {
      schemas: {
        LessonSummaryResponseSchema: {
          type: 'object',
          properties: {
            lessonTitle: { type: 'string' },
            canonicalUrl: {
              type: 'string',
              format: 'uri',
              description: 'The canonical curriculum URL',
            },
            oakUrl: {
              type: 'string',
              format: 'uri',
              description: 'The Oak URL for this lesson',
            },
          },
          required: ['lessonTitle', 'canonicalUrl', 'oakUrl'],
        },
      },
    },
  };
}

function buildSchemaWithoutOakUrl(): OpenAPIObject {
  return {
    openapi: '3.1.0',
    info: { title: 'Test', version: '1.0.0' },
    paths: {},
    components: {
      schemas: {
        UnitSummaryResponseSchema: {
          type: 'object',
          properties: {
            unitTitle: { type: 'string' },
          },
        },
      },
    },
  };
}

function buildThreadSchemaWithUpstreamOakUrl(): OpenAPIObject {
  return {
    openapi: '3.1.0',
    info: { title: 'Test', version: '1.0.0' },
    paths: {},
    components: {
      schemas: {
        AllThreadsResponseSchema: {
          type: 'object',
          properties: {
            threadTitle: { type: 'string' },
            oakUrl: {
              type: 'string',
              format: 'uri',
              description: 'Upstream thread URL',
            },
          },
        },
      },
    },
  };
}

function buildThreadSchemaWithoutOakUrl(): OpenAPIObject {
  return {
    openapi: '3.1.0',
    info: { title: 'Test', version: '1.0.0' },
    paths: {},
    components: {
      schemas: {
        AllThreadsResponseSchema: {
          type: 'object',
          properties: {
            threadTitle: { type: 'string' },
          },
        },
      },
    },
  };
}

function isSchemaObject(value: unknown): value is SchemaObject {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  return !('$ref' in value);
}

function getSchemaProperties(
  result: OpenAPIObject,
  schemaName: string,
): Record<string, SchemaObject> {
  const schema = result.components?.schemas?.[schemaName];
  if (!schema || !isSchemaObject(schema) || !schema.properties) {
    throw new Error(`Schema ${schemaName} not found or has no properties`);
  }

  const properties: Record<string, SchemaObject> = {};
  for (const [propertyName, propertySchema] of Object.entries(schema.properties)) {
    if (!isSchemaObject(propertySchema)) {
      throw new Error(`Schema ${schemaName} contains a non-schema property: ${propertyName}`);
    }
    properties[propertyName] = propertySchema;
  }

  return properties;
}

describe('decorateOakUrls', () => {
  describe('when upstream defines oakUrl', () => {
    it('preserves the upstream oakUrl definition unchanged', () => {
      const input = buildSchemaWithUpstreamOakUrl();
      const result = decorateOakUrls(input);
      const props = getSchemaProperties(result, 'LessonAssetsResponseSchema');

      expect(props.oakUrl).toStrictEqual({
        type: 'string',
        format: 'uri',
        description: 'The Oak URL for this lesson',
      });
    });

    it('does not replace format: "uri" with plain string', () => {
      const input = buildSchemaWithUpstreamOakUrl();
      const result = decorateOakUrls(input);
      const props = getSchemaProperties(result, 'LessonAssetsResponseSchema');

      expect(props.oakUrl).toHaveProperty('format', 'uri');
    });
  });

  describe('when upstream defines both canonicalUrl and oakUrl', () => {
    it('preserves both upstream fields unchanged', () => {
      const input = buildSchemaWithUpstreamCanonicalUrlAndOakUrl();
      const result = decorateOakUrls(input);
      const props = getSchemaProperties(result, 'LessonSummaryResponseSchema');

      expect(props.canonicalUrl).toStrictEqual({
        type: 'string',
        format: 'uri',
        description: 'The canonical curriculum URL',
      });
      expect(props.oakUrl).toStrictEqual({
        type: 'string',
        format: 'uri',
        description: 'The Oak URL for this lesson',
      });
    });
  });

  describe('when upstream does not define oakUrl', () => {
    it('adds the SDK oakUrl field with format: "uri"', () => {
      const input = buildSchemaWithoutOakUrl();
      const result = decorateOakUrls(input);
      const props = getSchemaProperties(result, 'UnitSummaryResponseSchema');

      expect(props.oakUrl).toBeDefined();
      expect(props.oakUrl).toHaveProperty('type', 'string');
      expect(props.oakUrl).toHaveProperty('format', 'uri');
    });

    it('preserves existing properties', () => {
      const input = buildSchemaWithoutOakUrl();
      const result = decorateOakUrls(input);
      const props = getSchemaProperties(result, 'UnitSummaryResponseSchema');

      expect(props.unitTitle).toStrictEqual({ type: 'string' });
    });
  });

  describe('thread schemas', () => {
    it('preserves upstream oakUrl on thread schemas (does not replace with null)', () => {
      const input = buildThreadSchemaWithUpstreamOakUrl();
      const result = decorateOakUrls(input);
      const props = getSchemaProperties(result, 'AllThreadsResponseSchema');

      expect(props.oakUrl).toStrictEqual({
        type: 'string',
        format: 'uri',
        description: 'Upstream thread URL',
      });
    });

    it('adds null-typed oakUrl when upstream does not define it', () => {
      const input = buildThreadSchemaWithoutOakUrl();
      const result = decorateOakUrls(input);
      const props = getSchemaProperties(result, 'AllThreadsResponseSchema');

      expect(props.oakUrl).toHaveProperty('type', 'null');
    });
  });

  describe('when schema uses allOf composite (no top-level properties)', () => {
    function buildSchemaWithAllOfComposite(): OpenAPIObject {
      return {
        openapi: '3.1.0',
        info: { title: 'Test', version: '1.0.0' },
        paths: {},
        components: {
          schemas: {
            CompositeResponseSchema: {
              allOf: [
                {
                  type: 'object',
                  properties: {
                    itemTitle: { type: 'string' },
                  },
                },
                {
                  type: 'object',
                  properties: {
                    itemSlug: { type: 'string' },
                  },
                },
              ],
            },
          },
        },
      };
    }

    it('handles schemas without a top-level properties key gracefully', () => {
      const input = buildSchemaWithAllOfComposite();
      expect(() => decorateOakUrls(input)).not.toThrow();
    });

    it('decorates allOf member schemas that have properties', () => {
      const input = buildSchemaWithAllOfComposite();
      const result = decorateOakUrls(input);
      const schema = result.components?.schemas?.CompositeResponseSchema;

      if (!schema || '$ref' in schema || !schema.allOf) {
        throw new Error('Expected allOf composite schema');
      }

      for (const member of schema.allOf) {
        if ('$ref' in member || !member.properties) {
          continue;
        }
        expect(member.properties).toHaveProperty('oakUrl');
      }
    });
  });

  it('does not mutate the input schema', () => {
    const input = buildSchemaWithUpstreamOakUrl();
    const inputCopy = structuredClone(input);
    decorateOakUrls(input);
    expect(input).toStrictEqual(inputCopy);
  });
});
