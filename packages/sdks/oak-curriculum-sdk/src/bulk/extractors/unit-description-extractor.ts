/**
 * Unit description extractor for bulk download data.
 *
 * @remarks
 * Extracts unit descriptions from the sequence data. These provide
 * short summaries of what each unit covers, useful for search
 * and curriculum overview features.
 *
 * @module bulk/extractors/unit-description-extractor
 */

import type { Unit } from '../../types/generated/bulk/index.js';

/**
 * Extracted unit description with context.
 */
export interface ExtractedUnitDescription {
  /** The unit description text */
  readonly description: string;
  /** Unit slug for reference */
  readonly unitSlug: string;
  /** Unit title for context */
  readonly unitTitle: string;
  /** Year group */
  readonly year: number | string;
  /** Year slug for filtering */
  readonly yearSlug: string;
  /** Key stage slug (derived from year) */
  readonly keyStageSlug: string;
}

/**
 * Derives key stage slug from year number.
 */
function deriveKeyStageFromYear(year: number | string): string {
  const yearNum = typeof year === 'string' ? parseInt(year, 10) : year;

  if (isNaN(yearNum)) {
    return 'unknown';
  }

  if (yearNum <= 2) {
    return 'ks1';
  }
  if (yearNum <= 6) {
    return 'ks2';
  }
  if (yearNum <= 9) {
    return 'ks3';
  }
  return 'ks4';
}

/**
 * Extracts unit descriptions from an array of units.
 *
 * @param units - Array of units from bulk download
 * @returns Array of extracted descriptions with context
 *
 * @example
 * ```ts
 * const descriptions = extractUnitDescriptions(bulkData.sequence);
 * descriptions.forEach(d => console.log(`${d.unitTitle}: ${d.description}`));
 * ```
 */
export function extractUnitDescriptions(
  units: readonly Unit[],
): readonly ExtractedUnitDescription[] {
  const results: ExtractedUnitDescription[] = [];

  for (const unit of units) {
    // Skip units without descriptions
    if (!unit.description) {
      continue;
    }

    const description = unit.description.trim();
    if (description.length === 0) {
      continue;
    }

    results.push({
      description,
      unitSlug: unit.unitSlug,
      unitTitle: unit.unitTitle,
      year: unit.year,
      yearSlug: unit.yearSlug,
      keyStageSlug: deriveKeyStageFromYear(unit.year),
    });
  }

  return results;
}

