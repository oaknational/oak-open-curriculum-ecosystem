import { z } from 'zod';
import type { OpenAPIRegistry, RouteConfig } from '@asteasolutions/zod-to-openapi';

export function registerOpenApiPaths(
  registry: OpenAPIRegistry,
  deps: {
    StructuredQuerySchema: z.ZodType;
    HybridResponseLessons: z.ZodType;
    HybridResponseUnits: z.ZodType;
    HybridResponseSequences: z.ZodType;
    HybridResponse: z.ZodType;
    ErrorSchema: z.ZodType;
    NaturalLanguageBody: z.ZodType;
    SuggestionRequestSchema: z.ZodType;
    SuggestionResponseSchema: z.ZodType;
    SdkSearchLessonsBody: z.ZodType;
    SdkSearchTranscriptsBody: z.ZodType;
    SdkArrayAny: z.ZodType;
  },
): void {
  registerStructuredSearch(registry, deps);
  registerNaturalLanguageSearch(registry, deps);
  registerSuggestionSearch(registry, deps);
  registerSdkLessons(registry, deps);
  registerSdkTranscripts(registry, deps);
}

function registerStructuredSearch(
  registry: OpenAPIRegistry,
  {
    StructuredQuerySchema,
    HybridResponseLessons,
    HybridResponseUnits,
    HybridResponseSequences,
    ErrorSchema,
  }: {
    StructuredQuerySchema: z.ZodType;
    HybridResponseLessons: z.ZodType;
    HybridResponseUnits: z.ZodType;
    HybridResponseSequences: z.ZodType;
    ErrorSchema: z.ZodType;
  },
): void {
  registry.registerPath({
    method: 'post',
    path: '/api/search',
    summary: 'Structured hybrid search',
    description:
      'Hybrid (BM25 + semantic_text) search across lessons, units, or sequences using a structured body.',
    tags: ['search'],
    request: { body: { content: { 'application/json': { schema: StructuredQuerySchema } } } },
    responses: {
      200: {
        description: 'OK',
        content: {
          'application/json': {
            schema: z.union([HybridResponseLessons, HybridResponseUnits, HybridResponseSequences]),
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
    HybridResponse,
    ErrorSchema,
  }: {
    NaturalLanguageBody: z.ZodType;
    HybridResponse: z.ZodType;
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
        content: { 'application/json': { schema: HybridResponse } },
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

function registerSuggestionSearch(
  registry: OpenAPIRegistry,
  {
    SuggestionRequestSchema,
    SuggestionResponseSchema,
    ErrorSchema,
  }: {
    SuggestionRequestSchema: z.ZodType;
    SuggestionResponseSchema: z.ZodType;
    ErrorSchema: z.ZodType;
  },
): void {
  registry.registerPath({
    method: 'post',
    path: '/api/search/suggest',
    summary: 'Type-ahead suggestions',
    description:
      'Returns lesson, unit, or sequence suggestions using completion contexts and search-as-you-type fallback.',
    tags: ['search'],
    request: {
      body: { content: { 'application/json': { schema: SuggestionRequestSchema } } },
    },
    responses: {
      200: {
        description: 'OK',
        content: { 'application/json': { schema: SuggestionResponseSchema } },
      },
      400: {
        description: 'Validation error',
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
