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
 * @see ADR-xxx Context Enrichment Architecture
 * @module adapters/category-supplementation
 */

/**
 * Category information for a unit.
 */
export interface CategoryInfo {
  /** Category display title (e.g., 'Grammar') */
  readonly title: string;
  /** Category slug identifier (e.g., 'grammar') */
  readonly slug: string;
}

/**
 * Category data from API response.
 */
interface ApiCategory {
  readonly categoryTitle: string;
  readonly categorySlug?: string;
}

/**
 * Unit data from sequences/units API response.
 */
interface ApiUnit {
  readonly unitSlug?: string;
  readonly unitTitle: string;
  readonly categories?: readonly ApiCategory[];
  readonly unitOptions?: readonly { unitSlug: string; unitTitle: string }[];
}

/**
 * Year group data from sequences/units API response.
 */
interface ApiYearData {
  readonly year: number | string;
  readonly units: readonly ApiUnit[];
}

/**
 * Sequence units data type for API response.
 */
export type SequenceUnitsData = readonly ApiYearData[];

/**
 * Map of unit slugs to their categories.
 */
export type CategoryMap = ReadonlyMap<string, readonly CategoryInfo[]>;

/**
 * Transforms API category to CategoryInfo.
 */
function toCategory(apiCategory: ApiCategory): CategoryInfo {
  return {
    title: apiCategory.categoryTitle,
    slug: apiCategory.categorySlug ?? apiCategory.categoryTitle.toLowerCase().replace(/\s+/g, '-'),
  };
}

/**
 * Extracts categories from a unit, returning undefined if none.
 */
function extractCategories(unit: ApiUnit): readonly CategoryInfo[] | undefined {
  if (!unit.categories || unit.categories.length === 0) {
    return undefined;
  }
  return unit.categories.map(toCategory);
}

/**
 * Adds a unit and its options to the category map.
 */
function addUnitCategories(
  map: Map<string, readonly CategoryInfo[]>,
  unit: ApiUnit,
  categories: readonly CategoryInfo[],
): void {
  // Direct unit slug
  if (unit.unitSlug) {
    map.set(unit.unitSlug, categories);
  }

  // Unit options (alternative units inherit parent's categories)
  if (unit.unitOptions) {
    for (const option of unit.unitOptions) {
      map.set(option.unitSlug, categories);
    }
  }
}

/**
 * Processes a single year's units and adds categories to the map.
 */
function processYearUnits(map: Map<string, readonly CategoryInfo[]>, yearData: ApiYearData): void {
  for (const unit of yearData.units) {
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
export function buildCategoryMap(sequenceData: SequenceUnitsData): CategoryMap {
  const map = new Map<string, readonly CategoryInfo[]>();

  for (const yearData of sequenceData) {
    processYearUnits(map, yearData);
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
