import { describe, expect, it } from 'vitest';

// TDD: Writing test FIRST before implementation exists
import type { OpenAPI3 } from '../../src/types/openapi';

// These functions don't exist yet - will implement after tests are written
import { transformSchemaToTypeScript } from '../../scripts/typegen-core';

describe('Type Generation Pure Functions', () => {
  describe('transformSchemaToTypeScript', () => {
    it('transforms a simple object schema to TypeScript interface', () => {
      // Given: OpenAPI schema object (pure data, no fetching)
      const schema: OpenAPI3 = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
        components: {
          schemas: {
            Lesson: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                subject_name: { type: 'string' },
                key_stage_slug: { type: 'string' },
              },
              required: ['id', 'title'],
            },
          },
        },
      };

      // When: Transform to TypeScript
      const result = transformSchemaToTypeScript(schema);

      // Then: Verify TypeScript output contains expected interface
      expect(result).toContain('export interface Lesson {');
      expect(result).toContain('id: string;');
      expect(result).toContain('title: string;');
      expect(result).toContain('subject_name?: string;');
      expect(result).toContain('key_stage_slug?: string;');
    });

    it('handles nested object schemas', () => {
      // Given: Schema with nested objects
      const schema: OpenAPI3 = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
        components: {
          schemas: {
            Programme: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                subject: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    slug: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      };

      // When: Transform
      const result = transformSchemaToTypeScript(schema);

      // Then: Verify nested structure
      expect(result).toContain('export interface Programme {');
      expect(result).toContain('subject?: {');
      expect(result).toContain('name?: string;');
      expect(result).toContain('slug?: string;');
    });

    it('handles array types correctly', () => {
      // Given: Schema with array
      const schema: OpenAPI3 = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
        components: {
          schemas: {
            SearchResults: {
              type: 'object',
              properties: {
                lessons: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      };

      // When: Transform
      const result = transformSchemaToTypeScript(schema);

      // Then: Verify array type
      expect(result).toContain('lessons?: ({');
      expect(result).toContain('id?: string;');
      expect(result).toContain('})[]');
    });
  });
});
