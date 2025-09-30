import type { OpenAPI3 } from 'openapi-typescript';
import type { FileMap } from '../extraction-types.js';

const DOC_HEADER = `/**\n * GENERATED FILE - DO NOT EDIT\n *\n * Documentation-friendly re-exports for search response schemas.\n */\n\n`;

function createResponseDocsModule(): string {
  return (
    DOC_HEADER +
    String.raw`import { curriculumSchemas } from '../../../src/types/generated/zod/curriculumZodSchemas.js';
import {
  LessonResultSchema as GeneratedLessonResultSchema,
  SearchLessonsResponseSchema as GeneratedSearchLessonsResponseSchema,
} from '../../../src/types/generated/search/responses.lessons.js';
import {
  UnitResultSchema as GeneratedUnitResultSchema,
  SearchUnitsResponseSchema as GeneratedSearchUnitsResponseSchema,
} from '../../../src/types/generated/search/responses.units.js';
import {
  SequenceResultSchema as GeneratedSequenceResultSchema,
  SearchSequencesResponseSchema as GeneratedSearchSequencesResponseSchema,
} from '../../../src/types/generated/search/responses.sequences.js';

/** Schema describing an individual lesson search result entry. */
export const LessonResultSchema = GeneratedLessonResultSchema;

/** Schema describing an individual unit search result entry. */
export const UnitResultSchema = GeneratedUnitResultSchema;

/** Schema describing an individual sequence search result entry. */
export const SequenceResultSchema = GeneratedSequenceResultSchema;

/** Schema describing the full lesson search response envelope. */
export const SearchLessonsResponseSchema = GeneratedSearchLessonsResponseSchema;

/** Schema describing the full unit search response envelope. */
export const SearchUnitsResponseSchema = GeneratedSearchUnitsResponseSchema;

/** Schema describing the full sequence search response envelope. */
export const SearchSequencesResponseSchema = GeneratedSearchSequencesResponseSchema;

/** Lesson summary schema generated from the Oak Curriculum OpenAPI specification. */
export const LessonSummaryResponseSchema = curriculumSchemas.LessonSummaryResponseSchema;

/** Unit summary schema generated from the Oak Curriculum OpenAPI specification. */
export const UnitSummaryResponseSchema = curriculumSchemas.UnitSummaryResponseSchema;

/** Subject sequences schema generated from the Oak Curriculum OpenAPI specification. */
export const SubjectSequenceResponseSchema = curriculumSchemas.SubjectSequenceResponseSchema;
`
  );
}

export function generateSearchResponseDocsModules(_schema: OpenAPI3): FileMap {
  void _schema;
  return {
    '../../../../docs/_typedoc_src/types/search-response-schemas.ts': createResponseDocsModule(),
  };
}
