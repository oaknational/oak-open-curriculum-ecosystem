import {
  SearchLessonsResponseSchema,
  SearchSequencesResponseSchema,
  SearchUnitsResponseSchema,
  type SearchLessonResult,
  type SearchScope,
  type SearchSequenceResult,
  type SearchUnitResult,
} from '@oaknational/oak-curriculum-sdk/public/search.js';

export const LessonResultsSchema = SearchLessonsResponseSchema.shape.results;
export const UnitResultsSchema = SearchUnitsResponseSchema.shape.results;
export const SequenceResultsSchema = SearchSequencesResponseSchema.shape.results;

export type SearchResultItem = SearchLessonResult | SearchUnitResult | SearchSequenceResult;

export type SearchResultArray = SearchLessonResult[] | SearchUnitResult[] | SearchSequenceResult[];

function safeParseResults<T extends SearchResultArray>(
  schema: { safeParse: (input: unknown) => { success: true; data: T } | { success: false } },
  value: unknown,
): T | null {
  const parsed = schema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export function parseResultsForScope(
  scope: SearchScope | undefined,
  results: unknown,
): SearchResultArray | null {
  if (scope === 'lessons') {
    return safeParseResults(LessonResultsSchema, results);
  }
  if (scope === 'units') {
    return safeParseResults(UnitResultsSchema, results);
  }
  if (scope === 'sequences') {
    return safeParseResults(SequenceResultsSchema, results);
  }

  return (
    safeParseResults(LessonResultsSchema, results) ??
    safeParseResults(UnitResultsSchema, results) ??
    safeParseResults(SequenceResultsSchema, results)
  );
}
