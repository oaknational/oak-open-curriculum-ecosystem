/**
 * Search operations for the Oak Curriculum API
 * Uses dependency injection for HTTP adapter
 */

import type { OakClientDependencies } from '../adapters/types';
import type { ApiSearchResponse } from './api-types';
import type { SearchParams, SearchResults } from './types';
import { buildSearchUrl, transformSearchResults } from './transform';

/**
 * Search for lessons using the Oak API
 * @param deps - Injected dependencies (HTTP adapter and config)
 * @param params - Search parameters
 * @returns Transformed search results
 */
export async function searchLessons(
  deps: OakClientDependencies,
  params: SearchParams,
): Promise<SearchResults> {
  // Build the search URL
  const url = buildSearchUrl(deps.config.baseUrl, params);

  // Prepare headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add API key if provided
  if (deps.config.apiKey) {
    headers.Authorization = `Bearer ${deps.config.apiKey}`;
  }

  // Make the HTTP request using injected adapter
  const response = await deps.http.request(url, {
    method: 'GET',
    headers,
  });

  // Check for errors
  if (response.status !== 200) {
    throw new Error(`API request failed with status ${String(response.status)}`);
  }

  // Parse and transform the response
  const apiResponse = JSON.parse(response.body) as ApiSearchResponse;
  return transformSearchResults(apiResponse);
}
