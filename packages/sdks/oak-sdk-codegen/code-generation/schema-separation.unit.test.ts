/**
 * Unit tests for schema separation functionality
 * Following TDD approach - tests written before implementation
 */

import { describe, it, expect } from 'vitest';
import type { OpenAPIObject, SchemaObject } from 'openapi3-ts/oas31';

import { createOpenCurriculumSchema } from './schema-separation-core.js';
import { schemaWithNestedResponses } from './test-fixtures.js';

function buildTranscriptSchema(): OpenAPIObject {
  return {
    openapi: '3.0.3',
    info: { title: 'Oak OpenAPI', version: '1.0.0' },
    paths: {
      '/lessons/{lesson}/transcript': {
        get: {
          operationId: 'getLessonTranscript',
          responses: {
            '200': {
              description: 'Successful response',
            },
          },
        },
      },
    },
    components: {
      schemas: {
        TranscriptResponseSchema: {
          type: 'object',
          properties: {
            transcript: { type: 'string' },
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

/**
 * createOpenCurriculumSchema unconditionally removes the owner-deferred paths from the
 * sdk document and throws when they are absent, so every fixture must carry them.
 * Local to this file by design: the coupling is deleted together with
 * excluded-paths.ts when the last deferral entry retires (MCP-214 for the
 * check-restricted family, MCP-630 for the dead changelog pair).
 */
const DEFERRED_PATH_STUBS: NonNullable<OpenAPIObject['paths']> = {
  '/key-stages/{keyStage}/subject/{subject}/check-restricted': {
    get: {
      operationId: 'stub-check-restricted-get',
      responses: { '200': { description: 'OK' } },
    },
  },
  '/lessons/check-restricted': {
    post: {
      operationId: 'stub-check-restricted-post',
      responses: { '200': { description: 'OK' } },
    },
  },
  '/changelog': {
    get: {
      operationId: 'stub-changelog-get',
      responses: { '200': { description: 'OK' } },
    },
  },
  '/changelog/latest': {
    get: {
      operationId: 'stub-changelog-latest-get',
      responses: { '200': { description: 'OK' } },
    },
  },
};

function withDeferredPathStubs(schema: OpenAPIObject): OpenAPIObject {
  return { ...schema, paths: { ...schema.paths, ...DEFERRED_PATH_STUBS } };
}

describe('schema separation', () => {
  describe('createOpenCurriculumSchema', () => {
    it('returns original clone and decorated SDK schema without mutating the input', () => {
      const validatedSchema = withDeferredPathStubs(buildTranscriptSchema());
      validatedSchema.components = {
        ...validatedSchema.components,
        schemas: {
          ...(validatedSchema.components?.schemas ?? {}),
          LessonResponse: {
            type: 'object',
            properties: {
              title: { type: 'string' },
            },
          },
        },
      };

      const { original, sdk } = createOpenCurriculumSchema(validatedSchema);

      expect(original).toEqual(validatedSchema);
      expect(original).not.toBe(validatedSchema);

      const lessonResponse = sdk.components?.schemas?.LessonResponse;
      if (!lessonResponse || !isSchemaObject(lessonResponse) || !lessonResponse.properties) {
        throw new Error('LessonResponse schema or properties missing');
      }
      expect(lessonResponse.properties).toHaveProperty('oakUrl');
      expect(lessonResponse.properties.oakUrl).toHaveProperty('type', 'string');

      const originalLesson = original.components?.schemas?.LessonResponse;
      if (!originalLesson || !isSchemaObject(originalLesson) || !originalLesson.properties) {
        throw new Error('Original LessonResponse schema or properties missing');
      }
      expect(originalLesson.properties).not.toHaveProperty('oakUrl');
    });

    it('preserves all original schema fields while adding oakUrl', () => {
      const validatedSchema = withDeferredPathStubs(buildTranscriptSchema());
      validatedSchema.components = {
        ...validatedSchema.components,
        schemas: {
          ...(validatedSchema.components?.schemas ?? {}),
          LessonResponse: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              description: { type: 'string' },
            },
          },
        },
      };

      const { original, sdk } = createOpenCurriculumSchema(validatedSchema);

      const lessonResponse = sdk.components?.schemas?.LessonResponse;
      if (!lessonResponse || !isSchemaObject(lessonResponse) || !lessonResponse.properties) {
        throw new Error('LessonResponse schema or properties missing');
      }
      expect(lessonResponse.properties.title).toEqual({ type: 'string' });
      expect(lessonResponse.properties.description).toEqual({ type: 'string' });
      expect(lessonResponse.properties.oakUrl).toEqual({
        type: 'string',
        format: 'uri',
        description:
          'The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.',
        example: 'https://www.thenational.academy/teachers/lessons/example-lesson',
      });

      const originalLesson = original.components?.schemas?.LessonResponse;
      if (!originalLesson || !isSchemaObject(originalLesson) || !originalLesson.properties) {
        throw new Error('Original LessonResponse schema or properties missing');
      }
      expect(originalLesson.properties).not.toHaveProperty('oakUrl');
    });

    it('should add oakUrl to nested response schemas without mutating input', () => {
      const { original, sdk } = createOpenCurriculumSchema(
        withDeferredPathStubs(schemaWithNestedResponses),
      );

      const originalLesson = original.components?.schemas?.LessonResponse;
      const sdkLesson = sdk.components?.schemas?.LessonResponse;

      if (!originalLesson || !sdkLesson || !('properties' in sdkLesson)) {
        throw new Error('LessonResponse schema not present');
      }

      if (!isSchemaObject(originalLesson) || !isSchemaObject(sdkLesson)) {
        throw new Error('Expected SchemaObject for LessonResponse');
      }
      expect(originalLesson.properties?.oakUrl).toBeUndefined();
      expect(sdkLesson.properties?.oakUrl).toEqual({
        type: 'string',
        format: 'uri',
        description:
          'The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.',
        example: 'https://www.thenational.academy/teachers/lessons/example-lesson',
      });

      const searchResponse = sdk.components?.schemas?.SearchResponse;
      if (!searchResponse || !isSchemaObject(searchResponse) || !searchResponse.properties) {
        throw new Error('SearchResponse schema or properties missing');
      }
      const summarySchema = searchResponse.properties.summary;
      if (!summarySchema || !isSchemaObject(summarySchema) || !Array.isArray(summarySchema.anyOf)) {
        throw new Error('SearchResponse.summary.anyOf missing');
      }
      expect(summarySchema.anyOf).toHaveLength(2);
    });

    it('omits the deferred endpoints from the sdk document while original stays verbatim', () => {
      const input = withDeferredPathStubs(buildTranscriptSchema());

      const { original, sdk } = createOpenCurriculumSchema(input);

      const sdkPaths = Object.keys(sdk.paths ?? {});
      expect(sdkPaths).not.toContain('/key-stages/{keyStage}/subject/{subject}/check-restricted');
      expect(sdkPaths).not.toContain('/lessons/check-restricted');
      expect(sdkPaths).toContain('/lessons/{lesson}/transcript');

      const originalPaths = Object.keys(original.paths ?? {});
      expect(originalPaths).toContain('/key-stages/{keyStage}/subject/{subject}/check-restricted');
      expect(originalPaths).toContain('/lessons/check-restricted');
    });
  });
});
