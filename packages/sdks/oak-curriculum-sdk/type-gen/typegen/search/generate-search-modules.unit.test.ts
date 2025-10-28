import { describe, expect, it } from 'vitest';
import type { OpenAPIObject } from 'openapi3-ts/oas31';

import { generateSearchRequestModules } from './generate-search-requests.js';
import { generateSearchResponseModules } from './generate-search-responses.js';
import { generateSearchResponseDocsModules } from './generate-search-response-docs.js';
import { generateSearchSuggestionModules } from './generate-search-suggestions.js';
import { generateSearchScopeModules } from './generate-search-scopes.js';
import { generateSearchFixtureModules } from './generate-search-fixtures.js';
import { generateSearchIndexModule } from './generate-search-index.js';
import { generateSearchIndexDocumentModules } from './generate-search-index-docs.js';

const MINIMAL_SCHEMA: OpenAPIObject = {
  openapi: '3.0.0',
  info: { title: 'Test', version: '1.0.0' },
  paths: {},
};

describe('search request module generation', () => {
  it('emits structured, natural, and parsed query request modules', () => {
    const files = generateSearchRequestModules(MINIMAL_SCHEMA);
    expect(Object.keys(files).sort()).toEqual(
      [
        '../search/natural-requests.ts',
        '../search/parsed-query.ts',
        '../search/requests.ts',
      ].sort(),
    );
    expect(files['../search/requests.ts']).toContain('SearchStructuredRequestSchema');
    expect(files['../search/natural-requests.ts']).toContain('SearchNaturalLanguageRequestSchema');
    expect(files['../search/parsed-query.ts']).toContain('SearchParsedQuerySchema');
  });
});

describe('search suggestion module generation', () => {
  it('emits request/response schemas with cache defaults', () => {
    const files = generateSearchSuggestionModules(MINIMAL_SCHEMA);
    expect(Object.keys(files)).toEqual(['../search/suggestions.ts']);
    const content = files['../search/suggestions.ts'];
    expect(content).toContain('DEFAULT_SUGGESTION_CACHE');
    expect(content).toContain('SearchSuggestionRequestSchema');
    expect(content).toContain('SearchSuggestionResponseSchema');
  });
});

describe('search scope module generation', () => {
  it('emits scope unions and guards', () => {
    const files = generateSearchScopeModules(MINIMAL_SCHEMA);
    expect(Object.keys(files)).toEqual(['../search/scopes.ts']);
    const content = files['../search/scopes.ts'];
    expect(content).toContain('SEARCH_SCOPES_WITH_ALL');
    expect(content).toContain('function isSearchScope(value: unknown)');
  });
});

describe('search response module generation', () => {
  it('emits per-scope and multi-scope response schemas', () => {
    const files = generateSearchResponseModules(MINIMAL_SCHEMA);
    expect(Object.keys(files).sort()).toEqual(
      [
        '../search/responses.lessons.ts',
        '../search/responses.multi.ts',
        '../search/responses.sequences.ts',
        '../search/responses.units.ts',
      ].sort(),
    );
    expect(files['../search/responses.lessons.ts']).toContain('SearchLessonsResponseSchema');
    expect(files['../search/responses.units.ts']).toContain('SearchUnitsResponseSchema');
    expect(files['../search/responses.sequences.ts']).toContain('SearchSequencesResponseSchema');
    expect(files['../search/responses.multi.ts']).toContain('SearchMultiScopeResponseSchema');
  });
});

describe('search response documentation module generation', () => {
  it('emits doc-friendly re-exports for search response schemas', () => {
    const files = generateSearchResponseDocsModules(MINIMAL_SCHEMA);
    expect(Object.keys(files)).toEqual([
      '../../../../docs/_typedoc_src/types/search-response-schemas.ts',
    ]);
    expect(files['../../../../docs/_typedoc_src/types/search-response-schemas.ts']).toContain(
      'lesson search result entry',
    );
  });
});

describe('search fixture module generation', () => {
  it('emits builders that validate via generated schemas', () => {
    const files = generateSearchFixtureModules(MINIMAL_SCHEMA);
    expect(Object.keys(files)).toEqual(['../search/fixtures.ts']);
    const content = files['../search/fixtures.ts'];
    expect(content).toContain('createSearchLessonsResponse');
    expect(content).toContain('createSearchMultiScopeResponse');
    expect(content).toContain('assertValid');
  });
});

describe('search index module generation', () => {
  it('re-exports the generated surface area', () => {
    const files = generateSearchIndexModule(MINIMAL_SCHEMA);
    expect(Object.keys(files)).toEqual(['../search/index.ts']);
    const content = files['../search/index.ts'];
    expect(content).toContain('export {\n  DEFAULT_INCLUDE_FACETS');
    expect(content).toContain('export type { SearchStructuredRequest');
    expect(content).toContain('export {\n  DEFAULT_SUGGESTION_CACHE');
    expect(content).toContain('export type {\n  SearchSuggestionItem');
    expect(content).toContain('export { SearchLessonsResponseSchema }');
    expect(content).toContain('export {\n  createSearchLessonsResponse');
    expect(content).toContain('SearchLessonsIndexDocSchema');
  });
});

describe('search index document module generation', () => {
  it('emits index document schemas, guards, and doc re-exports', () => {
    const files = generateSearchIndexDocumentModules(MINIMAL_SCHEMA);
    expect(Object.keys(files).sort()).toEqual(
      [
        '../search/index-documents.ts',
        '../../../../docs/_typedoc_src/types/search-index.ts',
      ].sort(),
    );
    const runtimeModule = files['../search/index-documents.ts'];
    expect(runtimeModule).toContain('SearchLessonsIndexDocSchema');
    expect(runtimeModule).toContain('isSearchSequenceIndexDoc');
    const docsModule = files['../../../../docs/_typedoc_src/types/search-index.ts'];
    expect(docsModule).toContain('SearchCompletionSuggestPayloadSchema');
    expect(docsModule).toContain("from '../../../src/types/generated/search/index-documents.js'");
  });
});
