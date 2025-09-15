import { z } from 'zod';
import type { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';

export function registerOpenApiPaths(
  registry: OpenAPIRegistry,
  deps: {
    StructuredQuerySchema: z.ZodType;
    StructuredResponseLessons: z.ZodType;
    StructuredResponseUnits: z.ZodType;
    ErrorSchema: z.ZodType;
    NaturalLanguageBody: z.ZodType;
    NaturalLanguageResponse: z.ZodType;
    SdkSearchLessonsBody: z.ZodType;
    SdkSearchTranscriptsBody: z.ZodType;
    SdkArrayAny: z.ZodType;
  },
): void {
  registerStructuredSearch(registry, deps);
  registerNaturalLanguageSearch(registry, deps);
  registerSdkLessons(registry, deps);
  registerSdkTranscripts(registry, deps);
}

function registerStructuredSearch(
  registry: OpenAPIRegistry,
  {
    StructuredQuerySchema,
    StructuredResponseLessons,
    StructuredResponseUnits,
    ErrorSchema,
  }: {
    StructuredQuerySchema: z.ZodType;
    StructuredResponseLessons: z.ZodType;
    StructuredResponseUnits: z.ZodType;
    ErrorSchema: z.ZodType;
  },
): void {
  registry.registerPath({
    method: 'post',
    path: '/api/search',
    summary: 'Structured hybrid search',
    description: 'Hybrid (BM25 + semantic_text) with RRF using a structured body.',
    tags: ['search'],
    request: { body: { content: { 'application/json': { schema: StructuredQuerySchema } } } },
    responses: {
      200: {
        description: 'OK',
        content: {
          'application/json': {
            schema: z.union([StructuredResponseLessons, StructuredResponseUnits]),
          },
        },
      },
      400: {
        description: 'Validation error',
        content: { 'application/json': { schema: ErrorSchema } },
      },
    },
  } satisfies RouteConfig);
}

function registerNaturalLanguageSearch(
  registry: OpenAPIRegistry,
  {
    NaturalLanguageBody,
    NaturalLanguageResponse,
    ErrorSchema,
  }: {
    NaturalLanguageBody: z.ZodType;
    NaturalLanguageResponse: z.ZodType;
    ErrorSchema: z.ZodType;
  },
): void {
  registry.registerPath({
    method: 'post',
    path: '/api/search/nl',
    summary: 'Natural-language search (LLM optional)',
    description: 'Parses a question into a structured query, then runs hybrid search.',
    tags: ['search'],
    request: { body: { content: { 'application/json': { schema: NaturalLanguageBody } } } },
    responses: {
      200: {
        description: 'OK',
        content: { 'application/json': { schema: NaturalLanguageResponse } },
      },
      400: {
        description: 'Validation error',
        content: { 'application/json': { schema: ErrorSchema } },
      },
      501: {
        description: 'LLM disabled',
        content: { 'application/json': { schema: ErrorSchema } },
      },
    },
  } satisfies RouteConfig);
}

function registerSdkLessons(
  registry: OpenAPIRegistry,
  {
    SdkSearchLessonsBody,
    SdkArrayAny,
    ErrorSchema,
  }: {
    SdkSearchLessonsBody: z.ZodType;
    SdkArrayAny: z.ZodType;
    ErrorSchema: z.ZodType;
  },
): void {
  registry.registerPath({
    method: 'post',
    path: '/api/sdk/search-lessons',
    summary: 'SDK passthrough: title similarity.',
    description: 'Direct passthrough to Oak SDK GET /search/lessons.',
    tags: ['sdk'],
    request: { body: { content: { 'application/json': { schema: SdkSearchLessonsBody } } } },
    responses: {
      200: {
        description: 'OK (opaque array)',
        content: { 'application/json': { schema: SdkArrayAny } },
      },
      400: {
        description: 'Validation error',
        content: { 'application/json': { schema: ErrorSchema } },
      },
    },
  } satisfies RouteConfig);
}

function registerSdkTranscripts(
  registry: OpenAPIRegistry,
  {
    SdkSearchTranscriptsBody,
    SdkArrayAny,
    ErrorSchema,
  }: {
    SdkSearchTranscriptsBody: z.ZodType;
    SdkArrayAny: z.ZodType;
    ErrorSchema: z.ZodType;
  },
): void {
  registry.registerPath({
    method: 'post',
    path: '/api/sdk/search-transcripts',
    summary: 'SDK passthrough: transcript similarity.',
    description: 'Direct passthrough to Oak SDK GET /search/transcripts.',
    tags: ['sdk'],
    request: { body: { content: { 'application/json': { schema: SdkSearchTranscriptsBody } } } },
    responses: {
      200: {
        description: 'OK (opaque array)',
        content: { 'application/json': { schema: SdkArrayAny } },
      },
      400: {
        description: 'Validation error',
        content: { 'application/json': { schema: ErrorSchema } },
      },
    },
  } satisfies RouteConfig);
}
