import { describe, expect, it } from 'vitest';

// TDD: Writing test FIRST before implementation exists
import type { OpenAPI3 } from '../../src/types/openapi';

// This function doesn't exist yet - will implement after test is written
import { transformSchemaToZod } from '../../scripts/typegen-core';

describe('Zod Schema Generation Pure Functions', () => {
  describe('transformSchemaToZod', () => {
    it('transforms a simple object schema to Zod validator', () => {
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

      // When: Transform to Zod schemas
      const result = transformSchemaToZod(schema);

      // Then: Verify Zod output
      expect(result).toContain("import { z } from 'zod';");
      expect(result).toContain('export const LessonSchema = z.object({');
      expect(result).toContain('id: z.string()');
      expect(result).toContain('title: z.string()');
      expect(result).toContain('subject_name: z.string().optional()');
      expect(result).toContain('key_stage_slug: z.string().optional()');
      expect(result).toContain('export type Lesson = z.infer<typeof LessonSchema>;');
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
                  required: ['name'],
                },
              },
              required: ['id'],
            },
          },
        },
      };

      // When: Transform
      const result = transformSchemaToZod(schema);

      // Then: Verify nested Zod structure
      expect(result).toContain('export const ProgrammeSchema = z.object({');
      expect(result).toContain('id: z.string()');
      expect(result).toContain('subject: z.object({');
      expect(result).toContain('name: z.string()');
      expect(result).toContain('slug: z.string().optional()');
      expect(result).toContain('}).optional()');
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
                      title: { type: 'string' },
                    },
                  },
                },
                total: { type: 'integer' },
              },
            },
          },
        },
      };

      // When: Transform
      const result = transformSchemaToZod(schema);

      // Then: Verify array Zod type
      expect(result).toContain('export const SearchResultsSchema = z.object({');
      expect(result).toContain('lessons: z.array(z.object({');
      expect(result).toContain('id: z.string().optional()');
      expect(result).toContain('title: z.string().optional()');
      expect(result).toContain('})).optional()');
      expect(result).toContain('total: z.number().int().optional()');
    });

    it('handles enum types', () => {
      // Given: Schema with enum
      const schema: OpenAPI3 = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
        components: {
          schemas: {
            KeyStage: {
              type: 'string',
              enum: ['ks1', 'ks2', 'ks3', 'ks4'],
            },
          },
        },
      };

      // When: Transform
      const result = transformSchemaToZod(schema);

      // Then: Verify enum Zod type
      expect(result).toContain('export const KeyStageSchema = z.enum([');
      expect(result).toContain("'ks1'");
      expect(result).toContain("'ks2'");
      expect(result).toContain("'ks3'");
      expect(result).toContain("'ks4'");
    });

    it('handles nullable types', () => {
      // Given: Schema with nullable field
      const schema: OpenAPI3 = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
        components: {
          schemas: {
            Asset: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                url: { type: 'string', nullable: true },
              },
            },
          },
        },
      };

      // When: Transform
      const result = transformSchemaToZod(schema);

      // Then: Verify nullable handling
      expect(result).toContain('export const AssetSchema = z.object({');
      expect(result).toContain('url: z.string().nullable().optional()');
    });
  });
});
