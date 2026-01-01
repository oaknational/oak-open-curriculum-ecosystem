/**
 * Why-This-Why-Now extractor for bulk download data.
 *
 * @remarks
 * Extracts curriculum sequencing rationale from units. These explanations
 * describe where a unit sits within the sequence and why it has been
 * placed there - valuable for understanding pedagogical intent.
 *
 * @module bulk/extractors/why-this-why-now-extractor
 */

import type { Unit } from '../../types/generated/bulk/index.js';

/**
 * Extracted why-this-why-now with unit context.
 */
export interface ExtractedWhyThisWhyNow {
  /** The curriculum sequencing rationale text */
  readonly whyThisWhyNow: string;
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
 * Extracts why-this-why-now rationale from an array of units.
 *
 * @param units - Array of units from bulk download
 * @returns Array of extracted rationales with context
 *
 * @example
 * ```ts
 * const rationales = extractWhyThisWhyNow(bulkData.sequence);
 * rationales.forEach(r => console.log(`${r.unitTitle}: ${r.whyThisWhyNow}`));
 * ```
 */
export function extractWhyThisWhyNow(units: readonly Unit[]): readonly ExtractedWhyThisWhyNow[] {
  const results: ExtractedWhyThisWhyNow[] = [];

  for (const unit of units) {
    // Skip units without why-this-why-now
    if (!unit.whyThisWhyNow) {
      continue;
    }

    const whyThisWhyNow = unit.whyThisWhyNow.trim();
    if (whyThisWhyNow.length === 0) {
      continue;
    }

    results.push({
      whyThisWhyNow,
      unitSlug: unit.unitSlug,
      unitTitle: unit.unitTitle,
      year: unit.year,
      yearSlug: unit.yearSlug,
      keyStageSlug: deriveKeyStageFromYear(unit.year),
    });
  }

  return results;
}
