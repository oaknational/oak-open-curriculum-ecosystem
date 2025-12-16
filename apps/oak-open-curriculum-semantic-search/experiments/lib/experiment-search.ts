/**
 * Search functions for hybrid superiority experiments.
 *
 */

import { esSearch } from '../../src/lib/elastic-http.js';
import {
  buildLessonRrfRequest,
  buildUnitRrfRequest,
} from '../../src/lib/hybrid-search/rrf-query-builders.js';
import {
  buildLessonBm25OnlyRequest,
  buildLessonElserOnlyRequest,
  buildUnitBm25OnlyRequest,
  buildUnitElserOnlyRequest,
} from '../../src/lib/hybrid-search/experiment-query-builders.js';
import type { SearchLessonsIndexDoc, SearchUnitRollupDoc } from '../../src/types/oak.js';
import type { RetrievalMode } from './experiment-types.js';

const BASE_PARAMS = {
  size: 10,
  subject: 'maths' as const,
  keyStage: 'ks4' as const,
};

/** Search lessons using a specific retrieval mode. */
export async function searchLessonsWithMode(
  query: string,
  mode: RetrievalMode,
): Promise<readonly string[]> {
  const params = { ...BASE_PARAMS, text: query };

  let request;
  switch (mode) {
    case 'bm25':
      request = buildLessonBm25OnlyRequest(params);
      break;
    case 'elser':
      request = buildLessonElserOnlyRequest(params);
      break;
    case 'hybrid':
      request = buildLessonRrfRequest(params);
      break;
  }

  const response = await esSearch<SearchLessonsIndexDoc>(request);
  return response.hits.hits.map((hit) => hit._source.lesson_slug);
}

/** Search units using a specific retrieval mode. */
export async function searchUnitsWithMode(
  query: string,
  mode: RetrievalMode,
): Promise<readonly string[]> {
  const params = { ...BASE_PARAMS, text: query };

  let request;
  switch (mode) {
    case 'bm25':
      request = buildUnitBm25OnlyRequest(params);
      break;
    case 'elser':
      request = buildUnitElserOnlyRequest(params);
      break;
    case 'hybrid':
      request = buildUnitRrfRequest(params);
      break;
  }

  const response = await esSearch<SearchUnitRollupDoc>(request);
  return response.hits.hits.map((hit) => hit._source.unit_slug);
}
