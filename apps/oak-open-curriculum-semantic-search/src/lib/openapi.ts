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
