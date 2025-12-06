/**
 * @module index-doc-exports
 * @description Generates the documentation re-exports module for search index documents.
 */

const DOC_HEADER = `/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Documentation-friendly re-exports for search index documents.
 */

`;

/**
 * Creates the documentation re-exports module content.
 */
export function createIndexDocumentsDocsModule(): string {
  return (
    DOC_HEADER +
    `export {
  SearchLessonsCompletionContextsSchema,
  SearchUnitsCompletionContextsSchema,
  SearchUnitRollupCompletionContextsSchema,
  SearchSequenceCompletionContextsSchema,
  SearchThreadCompletionContextsSchema,
  SearchLessonsCompletionPayloadSchema,
  SearchUnitsCompletionPayloadSchema,
  SearchUnitRollupCompletionPayloadSchema,
  SearchSequenceCompletionPayloadSchema,
  SearchThreadCompletionPayloadSchema,
  SearchThreadIndexDocSchema,
  SearchLessonsIndexDocSchema,
  SearchUnitsIndexDocSchema,
  SearchUnitRollupDocSchema,
  SearchSequenceIndexDocSchema,
  IndexMetaDocSchema,
  ZeroHitDocSchema,
  isSearchThreadIndexDoc,
  isSearchLessonsIndexDoc,
  isSearchUnitsIndexDoc,
  isSearchUnitRollupDoc,
  isSearchSequenceIndexDoc,
  isIndexMetaDoc,
  isZeroHitDoc,
} from '../../../src/types/generated/search/index-documents.js';
export type {
  SearchLessonsCompletionContexts,
  SearchUnitsCompletionContexts,
  SearchUnitRollupCompletionContexts,
  SearchSequenceCompletionContexts,
  SearchThreadCompletionContexts,
  SearchLessonsCompletionPayload,
  SearchUnitsCompletionPayload,
  SearchUnitRollupCompletionPayload,
  SearchSequenceCompletionPayload,
  SearchThreadCompletionPayload,
  SearchThreadIndexDoc,
  SearchLessonsIndexDoc,
  SearchUnitsIndexDoc,
  SearchUnitRollupDoc,
  SearchSequenceIndexDoc,
  IndexMetaDoc,
  ZeroHitDoc,
  SearchSubjectSlug,
} from '../../../src/types/generated/search/index-documents.js';
`
  );
}
