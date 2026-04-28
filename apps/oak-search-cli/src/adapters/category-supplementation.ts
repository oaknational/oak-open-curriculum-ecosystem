/**
 * Category supplementation for bulk data enrichment.
 *
 * @remarks
 * Categories (unit topics) are not included in bulk download data but are
 * available via the sequences/units API endpoint. This module provides
 * functions to fetch and map categories to units during ingestion.
 *
 * Categories are primarily used for:
 * - Faceted search (filter by topic)
 * - Context enrichment (show topic in search results)
 *
 * @example
 * ```typescript
 * // During bulk ingestion
 * const client = await createOakClient();
 * const categoryMap = await fetchCategoriesForSequence(client, 'english-primary');
 *
 * // When transforming a unit
 * const categories = getCategoriesForUnit(categoryMap, 'five-sentence-types');
 * // => [{ title: 'Grammar', slug: 'grammar' }]
 * ```
 *
 */

import { ok, err, type Result } from '@oaknational/result';
import type { SdkFetchError } from '@oaknational/curriculum-sdk';
import type { SequenceUnitsResponse } from '../types/oak';
import { ingestLogger } from '../lib/logger';

/**
 * Category information for a unit.
 */
export interface CategoryInfo {
  /** Category display title (e.g., 'Grammar') */
  readonly title: string;
  /** Category slug identifier (e.g., 'grammar') */
  readonly slug: string;
}

// ============================================================================
// Schema-derived types (Cardinal Rule: types flow from the OpenAPI schema)
// ============================================================================

/** Year entry variant from SequenceUnitsResponse that contains direct units. */
type YearEntryWithUnits = Extract<SequenceUnitsResponse[number], { units: unknown }>;

/** Schema-derived unit type — discriminated union: either has unitSlug or unitOptions, never both. */
type SequenceUnit = YearEntryWithUnits['units'][number];

/** Schema-derived category type from the unit's categories array. */
type SequenceUnitCategory = NonNullable<SequenceUnit['categories']>[number];

/**
 * Map of unit slugs to their categories.
 */
export type CategoryMap = ReadonlyMap<string, readonly CategoryInfo[]>;

/**
 * Transforms a schema-derived category to CategoryInfo.
 */
function toCategory(category: SequenceUnitCategory): CategoryInfo {
  return {
    title: category.categoryTitle,
    slug: category.categorySlug ?? category.categoryTitle.toLowerCase().replace(/\s+/g, '-'),
  };
}

/**
 * Extracts categories from a unit, returning undefined if none.
 */
function extractCategories(unit: SequenceUnit): readonly CategoryInfo[] | undefined {
  if (!unit.categories || unit.categories.length === 0) {
    return undefined;
  }
  return unit.categories.map(toCategory);
}

/**
 * Adds a unit and its options to the category map.
 * Uses `'unitSlug' in unit` to discriminate the schema union variants.
 */
function addUnitCategories(
  map: Map<string, readonly CategoryInfo[]>,
  unit: SequenceUnit,
  categories: readonly CategoryInfo[],
): void {
  if ('unitSlug' in unit) {
    map.set(unit.unitSlug, categories);
  }

  if ('unitOptions' in unit) {
    for (const option of unit.unitOptions) {
      map.set(option.unitSlug, categories);
    }
  }
}

/**
 * Processes a list of units and adds their categories to the map.
 */
function processYearUnits(
  map: Map<string, readonly CategoryInfo[]>,
  units: readonly SequenceUnit[],
): void {
  for (const unit of units) {
    const categories = extractCategories(unit);
    if (categories) {
      addUnitCategories(map, unit, categories);
    }
  }
}

/**
 * Builds a map of unit slugs to their categories from sequence data.
 *
 * This function processes the sequences/units API response to create a lookup
 * map that can be used during bulk transformation to enrich unit documents.
 *
 * @param sequenceData - Sequence units data from API
 * @returns Map of unit slugs to categories
 *
 * @example
 * ```typescript
 * const response = await client.getSequenceUnits('english-primary');
 * const categoryMap = buildCategoryMap(response);
 * const grammar = categoryMap.get('five-sentence-types');
 * // => [{ title: 'Grammar', slug: 'grammar' }]
 * ```
 */
export function buildCategoryMap(sequenceData: SequenceUnitsResponse): CategoryMap {
  const map = new Map<string, readonly CategoryInfo[]>();

  for (const yearData of sequenceData) {
    if ('units' in yearData) {
      processYearUnits(map, yearData.units);
    }
  }

  return map;
}

/**
 * Gets categories for a unit from the category map.
 *
 * @param categoryMap - Map built by `buildCategoryMap()`
 * @param unitSlug - Unit slug to look up
 * @returns Categories if found, undefined otherwise
 *
 * @example
 * ```typescript
 * const categories = getCategoriesForUnit(categoryMap, 'five-sentence-types');
 * if (categories) {
 *   doc.unit_topics = categories.map(c => c.title);
 * }
 * ```
 */
export function getCategoriesForUnit(
  categoryMap: CategoryMap,
  unitSlug: string,
): readonly CategoryInfo[] | undefined {
  return categoryMap.get(unitSlug);
}

/**
 * Extracts category titles for use in unit_topics field.
 *
 * @param categories - Categories from getCategoriesForUnit
 * @returns Array of category titles, or undefined if no categories
 *
 * @example
 * ```typescript
 * const categories = getCategoriesForUnit(categoryMap, 'unit-slug');
 * const unitTopics = extractCategoryTitles(categories);
 * // => ['Grammar', 'Spelling']
 * ```
 */
export function extractCategoryTitles(
  categories: readonly CategoryInfo[] | undefined,
): readonly string[] | undefined {
  if (!categories || categories.length === 0) {
    return undefined;
  }
  return categories.map((c) => c.title);
}

/**
 * Dependency surface for category fetching, enabling testability via injection.
 *
 * @see ADR-078 Dependency Injection for Testability
 * @see ADR-088 Result Pattern for Error Handling
 */
export interface CategoryFetchDeps {
  readonly getSequenceUnits: (
    slug: string,
  ) => Promise<Result<SequenceUnitsResponse, SdkFetchError>>;
}

/**
 * Fetches category data from the API for all sequences and merges into a
 * single CategoryMap. Fails fast on the first error — categories are required
 * for correct search filtering, not optional enrichment. Uses plain `Error`
 * (sole caller treats all failures identically; introduce a typed union if
 * callers later need to distinguish failure modes).
 *
 * @param deps - Dependency surface with `getSequenceUnits` method
 * @param sequenceSlugs - Sequence slugs to fetch categories for
 * @returns `Result.ok` with merged CategoryMap, or `Result.err` on first failure
 */
export async function fetchCategoryMapForSequences(
  deps: CategoryFetchDeps,
  sequenceSlugs: readonly string[],
): Promise<Result<CategoryMap, Error>> {
  ingestLogger.debug('Fetching category maps for sequences', {
    sequenceCount: sequenceSlugs.length,
  });
  const merged = new Map<string, readonly CategoryInfo[]>();

  for (const slug of sequenceSlugs) {
    const result = await deps.getSequenceUnits(slug);
    if (!result.ok) {
      return err(
        new Error(`Category fetch failed for sequence '${slug}': ${String(result.error)}`),
      );
    }
    const sequenceMap = buildCategoryMap(result.value);
    for (const [unitSlug, categories] of sequenceMap) {
      merged.set(unitSlug, categories);
    }
  }

  return ok(merged);
}
