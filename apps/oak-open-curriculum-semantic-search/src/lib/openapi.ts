/**
 * This file takes custom Zod schemas and registers them for generation into an OpenAPI document.
 *
 * Most of the end points are pass-throughs to the SDK and therefore the Open Curriculum API
 * OpenAPI document. So we are doing two conversions:
 * 1. OpenAPI document to Zod schemas in the SDK type-gen
 * 2. Zod schemas to OpenAPI document in this workspace
 *
 * The more we push the type definitions into the SDK type-gen, the more we can reduce
 * the complexity of this file.
 *
 * Semantic search is a fundamental application of the Oak Open Curriculum API, just like
 * MCP, and so it belongs in the SDK type-gen.
 *
 */

import { OpenAPIRegistry, OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';
import { registerOpenApiPaths } from './openapi.register';
import {
  StructuredQuerySchema,
  HybridResponseLessons,
  HybridResponseUnits,
  HybridResponseSequences,
  HybridResponse,
  ErrorSchema,
  NaturalLanguageBody,
  SuggestionRequestSchema,
  SuggestionResponseSchema,
  SdkSearchLessonsBody,
  SdkSearchTranscriptsBody,
  SdkArrayAny,
  LessonDoc,
  UnitDoc,
  SequenceDoc,
  SequenceFacet,
  SearchFacets,
  SuggestionItem,
} from './openapi.schemas';

// Intentionally keep the return type broad to avoid unsafe assertions
export type OpenAPIDocument = unknown;

export function buildOpenAPIDocument(origin?: string): OpenAPIDocument {
  const registry = new OpenAPIRegistry();
  registerSchemas(registry);

  // Register paths
  registerOpenApiPaths(registry, {
    StructuredQuerySchema,
    HybridResponseLessons,
    HybridResponseUnits,
    HybridResponseSequences,
    HybridResponse,
    ErrorSchema,
    NaturalLanguageBody,
    SuggestionRequestSchema,
    SuggestionResponseSchema,
    SdkSearchLessonsBody,
    SdkSearchTranscriptsBody,
    SdkArrayAny,
  });

  const generator = new OpenApiGeneratorV31(registry.definitions);

  const doc = generator.generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'Oak Curriculum Search API',
      version: '1.0.0',
      description: 'Hybrid (lexical + semantic) search API for Oak Curriculum content.',
    },
    servers: origin ? [{ url: origin }] : undefined,
    tags: [
      { name: 'search', description: 'Hybrid search endpoints' },
      { name: 'sdk', description: 'SDK passthrough endpoints' },
    ],
  });

  return {
    ...doc,
    xTagGroups: [
      { name: 'Search', tags: ['search'] },
      { name: 'SDK', tags: ['sdk'] },
    ],
  };
}

function registerSchemas(registry: OpenAPIRegistry): void {
  registry.register('Error', ErrorSchema);
  registry.register('LessonDoc', LessonDoc);
  registry.register('UnitDoc', UnitDoc);
  registry.register('SequenceDoc', SequenceDoc);
  registry.register('SequenceFacet', SequenceFacet);
  registry.register('SearchFacets', SearchFacets);
  registry.register('SuggestionItem', SuggestionItem);
  registry.register('StructuredQuery', StructuredQuerySchema);
}
