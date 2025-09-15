import { z } from 'zod';
import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
  OpenApiGeneratorV31,
} from '@asteasolutions/zod-to-openapi';
import { registerOpenApiPaths } from './openapi.register';

extendZodWithOpenApi(z);

// OpenAPI schemas mirroring the route validators

const Subject = z.string().openapi({ description: "Subject slug, e.g. 'geography'" });
const KeyStage = z.string().openapi({ description: 'Key stage code (ks1|ks2|ks3|ks4)' });

const LessonDoc = z
  .object({
    lesson_id: z.string(),
    lesson_slug: z.string(),
    lesson_title: z.string(),
    subject_slug: z.string(),
    key_stage: z.string(),
    unit_ids: z.array(z.string()).default([]),
    unit_titles: z.array(z.string()).default([]),
    transcript_text: z.string(),
  })
  .openapi('LessonDoc');

const UnitDoc = z
  .object({
    unit_id: z.string(),
    unit_slug: z.string(),
    unit_title: z.string(),
    subject_slug: z.string(),
    key_stage: z.string(),
    lesson_ids: z.array(z.string()).default([]),
    lesson_count: z.number().int(),
    unit_topics: z.string().optional(),
  })
  .openapi('UnitDoc');

const StructuredQuerySchema = z
  .object({
    scope: z.enum(['units', 'lessons']),
    text: z.string().min(1),
    subject: Subject.optional(),
    keyStage: KeyStage.optional(),
    minLessons: z.number().int().min(0).optional(),
    size: z.number().int().min(1).max(100).optional(),
    from: z.number().int().min(0).optional(),
    highlight: z.boolean().optional(),
  })
  .openapi('StructuredQuery');

const LessonResult = z
  .object({
    id: z.string(),
    rankScore: z.number(),
    lesson: LessonDoc,
    highlights: z.array(z.string()).default([]),
  })
  .openapi('LessonResult');

const UnitResult = z
  .object({
    id: z.string(),
    rankScore: z.number(),
    unit: UnitDoc.nullable(),
    highlights: z.array(z.string()).default([]),
  })
  .openapi('UnitResult');

const StructuredResponseLessons = z
  .object({ results: z.array(LessonResult) })
  .openapi('StructuredResponseLessons');
const StructuredResponseUnits = z
  .object({ results: z.array(UnitResult) })
  .openapi('StructuredResponseUnits');

const ErrorSchema = z
  .object({
    error: z.unknown(),
    message: z.string().optional(),
  })
  .openapi('Error');

const NaturalLanguageBody = z
  .object({
    q: z.string().min(1),
    scope: z.enum(['units', 'lessons']).optional(),
    size: z.number().int().min(1).max(100).optional(),
  })
  .openapi('NaturalLanguageBody');

const NaturalLanguageResponse = z
  .object({
    derived: StructuredQuerySchema,
    results: z.array(z.union([LessonResult, UnitResult])),
  })
  .openapi('NaturalLanguageResponse');

const SdkSearchLessonsBody = z
  .object({
    q: z.string().min(1),
    keyStage: KeyStage.optional(),
    subject: Subject.optional(),
    unit: z.string().optional(),
    limit: z.number().int().min(1).max(100).optional(),
    offset: z.number().int().min(0).optional(),
  })
  .openapi('SdkSearchLessonsBody');

const SdkSearchTranscriptsBody = z
  .object({
    q: z.string().min(1),
    keyStage: KeyStage.optional(),
    subject: Subject.optional(),
  })
  .openapi('SdkSearchTranscriptsBody');

const SdkArrayAny = z.array(z.any()).openapi('SdkArrayAny');

// Intentionally keep the return type broad to avoid unsafe assertions
export type OpenAPIDocument = unknown;

export function buildOpenAPIDocument(origin?: string): OpenAPIDocument {
  const registry = new OpenAPIRegistry();

  registry.register('Error', ErrorSchema);
  registry.register('LessonDoc', LessonDoc);
  registry.register('UnitDoc', UnitDoc);
  registry.register('StructuredQuery', StructuredQuerySchema);

  // Register paths
  registerOpenApiPaths(registry, {
    StructuredQuerySchema,
    StructuredResponseLessons,
    StructuredResponseUnits,
    ErrorSchema,
    NaturalLanguageBody,
    NaturalLanguageResponse,
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
