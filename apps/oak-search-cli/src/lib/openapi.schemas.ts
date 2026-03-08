import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { SEARCH_SCOPES } from '../types/oak';

extendZodWithOpenApi(z);

const NARROW_SCOPE_TUPLE = SEARCH_SCOPES;
const [LESSONS_SCOPE, UNITS_SCOPE, SEQUENCES_SCOPE] = SEARCH_SCOPES;

export const Subject = z.string().openapi({ description: "Subject slug, e.g. 'geography'" });
export const KeyStage = z.string().openapi({ description: 'Key stage code (ks1|ks2|ks3|ks4)' });

export const LessonDoc = z
  .object({
    lesson_id: z.string(),
    lesson_slug: z.string(),
    lesson_title: z.string(),
    subject_slug: z.string(),
    key_stage: z.string(),
    lesson_url: z.string(),
    unit_urls: z.array(z.string()).default([]),
    /** Full transcript content for BM25 search (renamed from transcript_text in Phase 3). */
    lesson_content: z.string(),
  })
  .openapi('LessonDoc');

export const UnitDoc = z
  .object({
    unit_id: z.string(),
    unit_slug: z.string(),
    unit_title: z.string(),
    subject_slug: z.string(),
    key_stage: z.string(),
    unit_url: z.string(),
    subject_programmes_url: z.string().optional(),
    lesson_count: z.number().int(),
    sequence_ids: z.array(z.string()).default([]),
  })
  .openapi('UnitDoc');

export const SequenceDoc = z
  .object({
    sequence_id: z.string(),
    sequence_slug: z.string(),
    sequence_title: z.string(),
    subject_slug: z.string(),
    phase_slug: z.string().optional(),
    sequence_url: z.string(),
  })
  .openapi('SequenceDoc');

export const StructuredQuerySchema = z
  .object({
    scope: z.enum(NARROW_SCOPE_TUPLE),
    query: z.string().min(1),
    subject: Subject.optional(),
    keyStage: KeyStage.optional(),
    phaseSlug: z.string().optional(),
    /** Filter lessons to a specific unit by unit slug. */
    unitSlug: z.string().optional(),
    minLessons: z.number().int().min(0).optional(),
    size: z.number().int().min(1).max(100).optional(),
    from: z.number().int().min(0).optional(),
    highlight: z.boolean().optional(),
    includeFacets: z.boolean().optional(),
  })
  .openapi('StructuredQuery');

export const LessonResult = z
  .object({
    id: z.string(),
    rankScore: z.number(),
    lesson: LessonDoc,
    highlights: z.array(z.string()).default([]),
  })
  .openapi('LessonResult');

export const UnitResult = z
  .object({
    id: z.string(),
    rankScore: z.number(),
    unit: UnitDoc.nullable(),
    highlights: z.array(z.string()).default([]),
  })
  .openapi('UnitResult');

export const SequenceResult = z
  .object({
    id: z.string(),
    rankScore: z.number(),
    sequence: SequenceDoc,
  })
  .openapi('SequenceResult');

export const SequenceFacet = z
  .object({
    subjectSlug: z.string(),
    sequenceSlug: z.string(),
    keyStage: z.string(),
    keyStageTitle: z.string().optional(),
    phaseSlug: z.string(),
    phaseTitle: z.string(),
    years: z.array(z.string()).default([]),
    units: z
      .array(
        z.object({
          unitSlug: z.string(),
          unitTitle: z.string(),
        }),
      )
      .default([]),
    unitCount: z.number().int(),
    lessonCount: z.number().int(),
    hasKs4Options: z.boolean(),
    sequenceUrl: z.string().optional(),
  })
  .openapi('SequenceFacet');

export const SearchFacets = z
  .object({
    sequences: z.array(SequenceFacet).default([]),
  })
  .openapi('SearchFacets');

export const HybridMeta = z
  .object({
    scope: z.enum(NARROW_SCOPE_TUPLE),
    total: z.number().int().nonnegative(),
    took: z.number().int().nonnegative(),
    timedOut: z.boolean(),
    aggregations: z.record(z.string(), z.unknown()).optional(),
    facets: SearchFacets.optional(),
  })
  .openapi('HybridMeta');

export const HybridResponseLessons = HybridMeta.extend({
  scope: z.literal(LESSONS_SCOPE),
  results: z.array(LessonResult),
}).openapi('HybridResponseLessons');

export const HybridResponseUnits = HybridMeta.extend({
  scope: z.literal(UNITS_SCOPE),
  results: z.array(UnitResult),
}).openapi('HybridResponseUnits');

export const HybridResponseSequences = HybridMeta.extend({
  scope: z.literal(SEQUENCES_SCOPE),
  results: z.array(SequenceResult),
}).openapi('HybridResponseSequences');

export const HybridResponse = z
  .union([HybridResponseLessons, HybridResponseUnits, HybridResponseSequences])
  .openapi('HybridResponse');

export const ErrorSchema = z
  .object({
    error: z.unknown(),
    message: z.string().optional(),
  })
  .openapi('Error');

export const NaturalLanguageBody = z
  .object({
    q: z.string().min(1),
    scope: z.enum(NARROW_SCOPE_TUPLE).optional(),
    size: z.number().int().min(1).max(100).optional(),
    includeFacets: z.boolean().optional(),
    phaseSlug: z.string().optional(),
  })
  .openapi('NaturalLanguageBody');

export const SdkSearchLessonsBody = z
  .object({
    q: z.string().min(1),
    keyStage: KeyStage.optional(),
    subject: Subject.optional(),
    unit: z.string().optional(),
    limit: z.number().int().min(1).max(100).optional(),
    offset: z.number().int().min(0).optional(),
  })
  .openapi('SdkSearchLessonsBody');

export const SdkSearchTranscriptsBody = z
  .object({
    q: z.string().min(1),
    keyStage: KeyStage.optional(),
    subject: Subject.optional(),
  })
  .openapi('SdkSearchTranscriptsBody');

export const SdkArrayAny = z.array(z.any()).openapi('SdkArrayAny');

export const SuggestionRequestSchema = z
  .object({
    prefix: z.string().min(1),
    scope: z.enum(NARROW_SCOPE_TUPLE),
    subject: Subject.optional(),
    keyStage: KeyStage.optional(),
    phaseSlug: z.string().optional(),
    limit: z.number().int().min(1).max(20).optional(),
  })
  .openapi('SuggestionRequest');

export const SuggestionContext = z
  .object({
    sequenceId: z.string().optional(),
    phaseSlug: z.string().optional(),
  })
  .openapi('SuggestionContext');

export const SuggestionItem = z
  .object({
    label: z.string(),
    scope: z.enum(NARROW_SCOPE_TUPLE),
    url: z.string(),
    subject: Subject.optional(),
    keyStage: KeyStage.optional(),
    contexts: SuggestionContext,
  })
  .openapi('SuggestionItem');

export const SuggestionResponseSchema = z
  .object({
    suggestions: z.array(SuggestionItem),
    cache: z.object({ version: z.string(), ttlSeconds: z.number().int().nonnegative() }),
  })
  .openapi('SuggestionResponse');
