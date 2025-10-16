import type { OpenAPIObject } from 'openapi3-ts/oas31';
import type { FileMap } from '../extraction-types.js';

const HEADER = `/**\n * GENERATED FILE - DO NOT EDIT\n *\n * Search index document schemas, types, and guards derived from the Open Curriculum schema.\n */\n\n`;

const KEY_STAGE_TUPLE =
  'KEY_STAGES as unknown as [typeof KEY_STAGES[number], ...typeof KEY_STAGES[number][]]';
const SUBJECT_TUPLE =
  'SUBJECTS as unknown as [typeof SUBJECTS[number], ...typeof SUBJECTS[number][]]';

function createIndexDocumentsModule(): string {
  return (
    HEADER +
    `import { z } from 'zod';\n` +
    `import { KEY_STAGES, SUBJECTS, type Subject } from '../api-schema/path-parameters.js';\n\n` +
    `/** Alias used by search index documents for subject slugs. */\n` +
    `export type SearchSubjectSlug = Subject;\n\n` +
    `/** Zod schema describing search completion suggest payloads embedded in documents. */\n` +
    `export const SearchCompletionSuggestPayloadSchema = z\n` +
    `  .object({\n` +
    `    input: z.array(z.string().min(1)).min(1),\n` +
    `    weight: z.number().int().nonnegative().optional(),\n` +
    `    contexts: z\n` +
    `      .object({\n` +
    `        subject: z.array(z.string().min(1)).optional(),\n` +
    `        key_stage: z.array(z.string().min(1)).optional(),\n` +
    `        sequence: z.array(z.string().min(1)).optional(),\n` +
    `        phase: z.array(z.string().min(1)).optional(),\n` +
    `      })\n` +
    `      .strict()\n` +
    `      .optional(),\n` +
    `  })\n` +
    `  .strict();\n\n` +
    `/** Completion suggestion payload embedded in search index documents. */\n` +
    `export type SearchCompletionSuggestPayload = z.infer<typeof SearchCompletionSuggestPayloadSchema>;\n\n` +
    `/** Guard validating search completion suggest payloads. */\n` +
    `export function isSearchCompletionSuggestPayload(\n` +
    `  value: unknown,\n` +
    `): value is SearchCompletionSuggestPayload {\n` +
    `  return SearchCompletionSuggestPayloadSchema.safeParse(value).success;\n` +
    `}\n\n` +
    `/** Zod schema capturing the lesson search document shape. */\n` +
    `export const SearchLessonsIndexDocSchema = z\n` +
    `  .object({\n` +
    `    lesson_id: z.string().min(1),\n` +
    `    lesson_slug: z.string().min(1),\n` +
    `    lesson_title: z.string().min(1),\n` +
    `    subject_slug: z.enum(${SUBJECT_TUPLE}),\n` +
    `    key_stage: z.enum(${KEY_STAGE_TUPLE}),\n` +
    `    years: z.array(z.string().min(1)).optional(),\n` +
    `    unit_ids: z.array(z.string().min(1)),\n` +
    `    unit_titles: z.array(z.string().min(1)),\n` +
    `    unit_count: z.number().int().nonnegative().optional(),\n` +
    `    lesson_keywords: z.array(z.string().min(1)).optional(),\n` +
    `    key_learning_points: z.array(z.string().min(1)).optional(),\n` +
    `    misconceptions_and_common_mistakes: z.array(z.string().min(1)).optional(),\n` +
    `    teacher_tips: z.array(z.string().min(1)).optional(),\n` +
    `    content_guidance: z.array(z.string().min(1)).optional(),\n` +
    `    transcript_text: z.string().min(1),\n` +
    `    lesson_semantic: z.string().min(1).optional(),\n` +
    `    lesson_url: z.string().min(1),\n` +
    `    unit_urls: z.array(z.string().min(1)),\n` +
    `    title_suggest: SearchCompletionSuggestPayloadSchema.optional(),\n` +
    `  })\n` +
    `  .strict();\n\n` +
    `/** Elasticsearch lesson document (hybrid search index shape). */\n` +
    `export type SearchLessonsIndexDoc = z.infer<typeof SearchLessonsIndexDocSchema>;\n\n` +
    `/** Guard validating lesson search index documents. */\n` +
    `export function isSearchLessonsIndexDoc(value: unknown): value is SearchLessonsIndexDoc {\n` +
    `  return SearchLessonsIndexDocSchema.safeParse(value).success;\n` +
    `}\n\n` +
    `/** Zod schema capturing the unit search document shape. */\n` +
    `export const SearchUnitsIndexDocSchema = z\n` +
    `  .object({\n` +
    `    unit_id: z.string().min(1),\n` +
    `    unit_slug: z.string().min(1),\n` +
    `    unit_title: z.string().min(1),\n` +
    `    subject_slug: z.enum(${SUBJECT_TUPLE}),\n` +
    `    key_stage: z.enum(${KEY_STAGE_TUPLE}),\n` +
    `    years: z.array(z.string().min(1)).optional(),\n` +
    `    lesson_ids: z.array(z.string().min(1)),\n` +
    `    lesson_count: z.number().int().nonnegative(),\n` +
    `    unit_topics: z.array(z.string().min(1)).optional(),\n` +
    `    unit_url: z.string().min(1),\n` +
    `    subject_programmes_url: z.string().min(1),\n` +
    `    sequence_ids: z.array(z.string().min(1)).optional(),\n` +
    `    title_suggest: SearchCompletionSuggestPayloadSchema.optional(),\n` +
    `  })\n` +
    `  .strict();\n\n` +
    `/** Elasticsearch unit document (hybrid search index shape). */\n` +
    `export type SearchUnitsIndexDoc = z.infer<typeof SearchUnitsIndexDocSchema>;\n\n` +
    `/** Guard validating unit search index documents. */\n` +
    `export function isSearchUnitsIndexDoc(value: unknown): value is SearchUnitsIndexDoc {\n` +
    `  return SearchUnitsIndexDocSchema.safeParse(value).success;\n` +
    `}\n\n` +
    `/** Zod schema capturing the unit roll-up document shape. */\n` +
    `export const SearchUnitRollupDocSchema = z\n` +
    `  .object({\n` +
    `    unit_id: z.string().min(1),\n` +
    `    unit_slug: z.string().min(1),\n` +
    `    unit_title: z.string().min(1),\n` +
    `    subject_slug: z.enum(${SUBJECT_TUPLE}),\n` +
    `    key_stage: z.enum(${KEY_STAGE_TUPLE}),\n` +
    `    years: z.array(z.string().min(1)).optional(),\n` +
    `    lesson_ids: z.array(z.string().min(1)),\n` +
    `    lesson_count: z.number().int().nonnegative(),\n` +
    `    unit_topics: z.array(z.string().min(1)).optional(),\n` +
    `    rollup_text: z.string().min(1),\n` +
    `    unit_semantic: z.string().min(1).optional(),\n` +
    `    unit_url: z.string().min(1),\n` +
    `    subject_programmes_url: z.string().min(1),\n` +
    `    sequence_ids: z.array(z.string().min(1)).optional(),\n` +
    `    title_suggest: SearchCompletionSuggestPayloadSchema.optional(),\n` +
    `  })\n` +
    `  .strict();\n\n` +
    `/** Elasticsearch unit roll-up document (hybrid search index shape). */\n` +
    `export type SearchUnitRollupDoc = z.infer<typeof SearchUnitRollupDocSchema>;\n\n` +
    `/** Guard validating unit roll-up documents. */\n` +
    `export function isSearchUnitRollupDoc(value: unknown): value is SearchUnitRollupDoc {\n` +
    `  return SearchUnitRollupDocSchema.safeParse(value).success;\n` +
    `}\n\n` +
    `/** Zod schema capturing the sequence search document shape. */\n` +
    `export const SearchSequenceIndexDocSchema = z\n` +
    `  .object({\n` +
    `    sequence_id: z.string().min(1),\n` +
    `    sequence_slug: z.string().min(1),\n` +
    `    sequence_title: z.string().min(1),\n` +
    `    subject_slug: z.enum(${SUBJECT_TUPLE}),\n` +
    `    subject_title: z.string().min(1).optional(),\n` +
    `    phase_slug: z.string().min(1).optional(),\n` +
    `    phase_title: z.string().min(1).optional(),\n` +
    `    category_titles: z.array(z.string().min(1)).optional(),\n` +
    `    key_stages: z.array(z.string().min(1)).optional(),\n` +
    `    years: z.array(z.string().min(1)).optional(),\n` +
    `    unit_slugs: z.array(z.string().min(1)).optional(),\n` +
    `    sequence_semantic: z.string().min(1).optional(),\n` +
    `    sequence_url: z.string().min(1),\n` +
    `    title_suggest: SearchCompletionSuggestPayloadSchema.optional(),\n` +
    `  })\n` +
    `  .strict();\n\n` +
    `/** Elasticsearch sequence document (hybrid search index shape). */\n` +
    `export type SearchSequenceIndexDoc = z.infer<typeof SearchSequenceIndexDocSchema>;\n\n` +
    `/** Guard validating sequence search index documents. */\n` +
    `export function isSearchSequenceIndexDoc(value: unknown): value is SearchSequenceIndexDoc {\n` +
    `  return SearchSequenceIndexDocSchema.safeParse(value).success;\n` +
    `}\n`
  );
}

const DOC_HEADER = `/**\n * GENERATED FILE - DO NOT EDIT\n *\n * Documentation-friendly re-exports for search index documents.\n */\n\n`;

function createIndexDocumentsDocsModule(): string {
  return (
    DOC_HEADER +
    `export {\n` +
    `  SearchCompletionSuggestPayloadSchema,\n` +
    `  SearchLessonsIndexDocSchema,\n` +
    `  SearchUnitsIndexDocSchema,\n` +
    `  SearchUnitRollupDocSchema,\n` +
    `  SearchSequenceIndexDocSchema,\n` +
    `  isSearchCompletionSuggestPayload,\n` +
    `  isSearchLessonsIndexDoc,\n` +
    `  isSearchUnitsIndexDoc,\n` +
    `  isSearchUnitRollupDoc,\n` +
    `  isSearchSequenceIndexDoc,\n` +
    `} from '../../../src/types/generated/search/index-documents.js';\nexport type {\n  SearchCompletionSuggestPayload,\n  SearchLessonsIndexDoc,\n  SearchUnitsIndexDoc,\n  SearchUnitRollupDoc,\n  SearchSequenceIndexDoc,\n  SearchSubjectSlug,\n} from '../../../src/types/generated/search/index-documents.js';\n`
  );
}

export function generateSearchIndexDocumentModules(_schema: OpenAPIObject): FileMap {
  void _schema;
  return {
    '../search/index-documents.ts': createIndexDocumentsModule(),
    '../../../../docs/_typedoc_src/types/search-index.ts': createIndexDocumentsDocsModule(),
  };
}
