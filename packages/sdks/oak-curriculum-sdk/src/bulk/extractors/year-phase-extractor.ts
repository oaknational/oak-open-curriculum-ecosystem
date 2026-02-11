/**
 * Year and phase extractor for bulk download data.
 *
 * @remarks
 * Extracts year group and phase information from units. This enables
 * filtering and faceted navigation by year and educational phase
 * (primary/secondary).

 */

import type { Unit } from '../../types/generated/bulk/index.js';

/**
 * Year group information with derived metadata.
 */
export interface ExtractedYearInfo {
  /** Year number or identifier */
  readonly year: number | string;
  /** Year slug for URLs */
  readonly yearSlug: string;
  /** Derived key stage (ks1, ks2, ks3, ks4) */
  readonly keyStage: string;
  /** Derived phase (primary, secondary) */
  readonly phase: string;
  /** Number of units in this year */
  readonly unitCount: number;
  /** Unit slugs in this year */
  readonly unitSlugs: readonly string[];
}

/**
 * Derives key stage slug from year number.
 */
function deriveKeyStage(year: number | string): string {
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
 * Derives phase from year number.
 */
function derivePhase(year: number | string): string {
  const yearNum = typeof year === 'string' ? parseInt(year, 10) : year;

  if (isNaN(yearNum)) {
    return 'unknown';
  }

  if (yearNum <= 6) {
    return 'primary';
  }
  return 'secondary';
}

/**
 * Extracts and aggregates year/phase information from units.
 *
 * @param units - Array of units from bulk download
 * @returns Array of year information with unit counts
 *
 * @example
 * ```ts
 * const years = extractYearPhaseInfo(bulkData.sequence);
 * const primaryYears = years.filter(y => y.phase === 'primary');
 * console.log(`Primary years: ${primaryYears.map(y => y.year).join(', ')}`);
 * ```
 */
export function extractYearPhaseInfo(units: readonly Unit[]): readonly ExtractedYearInfo[] {
  // Group units by year
  const yearMap = new Map<
    string,
    { year: number | string; yearSlug: string; unitSlugs: string[] }
  >();

  for (const unit of units) {
    const key = unit.yearSlug;

    if (!yearMap.has(key)) {
      yearMap.set(key, {
        year: unit.year,
        yearSlug: unit.yearSlug,
        unitSlugs: [],
      });
    }

    const entry = yearMap.get(key);
    if (entry) {
      entry.unitSlugs.push(unit.unitSlug);
    }
  }

  // Convert to result format
  const results: ExtractedYearInfo[] = [];

  for (const entry of yearMap.values()) {
    results.push({
      year: entry.year,
      yearSlug: entry.yearSlug,
      keyStage: deriveKeyStage(entry.year),
      phase: derivePhase(entry.year),
      unitCount: entry.unitSlugs.length,
      unitSlugs: entry.unitSlugs,
    });
  }

  // Sort by year number
  results.sort((a, b) => {
    const aNum = typeof a.year === 'string' ? parseInt(a.year, 10) : a.year;
    const bNum = typeof b.year === 'string' ? parseInt(b.year, 10) : b.year;
    return aNum - bNum;
  });

  return results;
}

/**
 * Gets summary statistics for year/phase distribution.
 */
export interface YearPhaseSummary {
  /** Total number of years represented */
  readonly totalYears: number;
  /** Total number of units */
  readonly totalUnits: number;
  /** Count of units by phase */
  readonly unitsByPhase: Readonly<Record<string, number>>;
  /** Count of units by key stage */
  readonly unitsByKeyStage: Readonly<Record<string, number>>;
}

/**
 * Generates summary statistics for year/phase distribution.
 *
 * @param yearInfo - Array of extracted year information
 * @returns Summary statistics
 */
export function summarizeYearPhaseInfo(yearInfo: readonly ExtractedYearInfo[]): YearPhaseSummary {
  const unitsByPhase: Record<string, number> = {};
  const unitsByKeyStage: Record<string, number> = {};
  let totalUnits = 0;

  for (const year of yearInfo) {
    totalUnits += year.unitCount;

    unitsByPhase[year.phase] = (unitsByPhase[year.phase] ?? 0) + year.unitCount;
    unitsByKeyStage[year.keyStage] = (unitsByKeyStage[year.keyStage] ?? 0) + year.unitCount;
  }

  return {
    totalYears: yearInfo.length,
    totalUnits,
    unitsByPhase,
    unitsByKeyStage,
  };
}
