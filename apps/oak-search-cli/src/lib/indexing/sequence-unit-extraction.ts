/**
 * Utilities for extracting units from sequence API responses.
 *
 * This module handles the extraction of units from complex sequence
 * response structures (tiers, exam subjects, etc.) for pattern-aware ingestion.
 */

import type { SequenceUnitsResponse } from '@oaknational/curriculum-sdk/public/search.js';
import type { KeyStage } from '../../types/oak';

/**
 * Unit data extracted from a sequence.
 */
interface ExtractedUnit {
  readonly unitSlug: string;
  readonly unitTitle: string;
}

/**
 * Year-to-KeyStage mapping.
 */
const YEAR_TO_KEYSTAGE: Readonly<Record<string, KeyStage>> = {
  '1': 'ks1',
  '2': 'ks1',
  '3': 'ks2',
  '4': 'ks2',
  '5': 'ks2',
  '6': 'ks2',
  '7': 'ks3',
  '8': 'ks3',
  '9': 'ks3',
  '10': 'ks4',
  '11': 'ks4',
};

/**
 * Get key stage for a year group.
 */
function getKeystageForYear(year: number): KeyStage | undefined {
  return YEAR_TO_KEYSTAGE[String(year)];
}

/**
 * Extract units from a validated sequence response for a specific key stage.
 */
export function extractUnitsForKeyStage(
  response: SequenceUnitsResponse,
  keyStage: KeyStage,
): ExtractedUnit[] {
  const units: ExtractedUnit[] = [];

  for (const yearEntry of response) {
    if (!shouldProcessYear(yearEntry, keyStage)) {
      continue;
    }
    extractFromYearEntry(yearEntry, units);
  }

  return units;
}

/**
 * Check if a year entry should be processed for the target key stage.
 */
function shouldProcessYear(yearEntry: SequenceUnitsResponse[number], keyStage: KeyStage): boolean {
  if (!('year' in yearEntry)) {
    return false;
  }
  // Year can be number | 'all-years' | undefined - Zod generates a complex union

  const yearProp = yearEntry.year;
  if (typeof yearProp !== 'number') {
    return false;
  }
  return getKeystageForYear(yearProp) === keyStage;
}

/**
 * Extract all units from a year entry into the provided array.
 */
function extractFromYearEntry(
  yearEntry: SequenceUnitsResponse[number],
  units: ExtractedUnit[],
): void {
  extractDirectUnitsInto(yearEntry, units);
  extractTierUnitsInto(yearEntry, units);
  extractExamSubjectUnitsInto(yearEntry, units);
}

/**
 * Extract units directly on the year entry.
 */
function extractDirectUnitsInto(
  yearEntry: SequenceUnitsResponse[number],
  units: ExtractedUnit[],
): void {
  if (!('units' in yearEntry) || !Array.isArray(yearEntry.units)) {
    return;
  }
  for (const unit of yearEntry.units) {
    if (isValidUnit(unit)) {
      units.push({ unitSlug: unit.unitSlug, unitTitle: unit.unitTitle });
    }
  }
}

/**
 * Extract units from tiers on the year entry.
 */
function extractTierUnitsInto(
  yearEntry: SequenceUnitsResponse[number],
  units: ExtractedUnit[],
): void {
  if (!('tiers' in yearEntry) || !Array.isArray(yearEntry.tiers)) {
    return;
  }
  for (const tier of yearEntry.tiers) {
    extractUnitsFromTier(tier, units);
  }
}

/**
 * Extract units from a single tier object.
 */
function extractUnitsFromTier(tier: unknown, units: ExtractedUnit[]): void {
  if (!isObjectWithUnitsArray(tier)) {
    return;
  }
  for (const unit of tier.units) {
    if (isValidUnit(unit)) {
      units.push({ unitSlug: unit.unitSlug, unitTitle: unit.unitTitle });
    }
  }
}

/**
 * Extract units from exam subjects on the year entry.
 */
function extractExamSubjectUnitsInto(
  yearEntry: SequenceUnitsResponse[number],
  units: ExtractedUnit[],
): void {
  if (!('examSubjects' in yearEntry) || !Array.isArray(yearEntry.examSubjects)) {
    return;
  }
  for (const examSubject of yearEntry.examSubjects) {
    extractUnitsFromExamSubject(examSubject, units);
  }
}

/**
 * Extract units from an exam subject object (may have direct units or tiers).
 */
function extractUnitsFromExamSubject(examSubject: unknown, units: ExtractedUnit[]): void {
  if (typeof examSubject !== 'object' || examSubject === null) {
    return;
  }
  extractDirectUnitsFromUnknown(examSubject, units);
  extractTiersFromUnknown(examSubject, units);
}

/**
 * Extract direct units from an unknown object that may have a units property.
 */
function extractDirectUnitsFromUnknown(obj: unknown, units: ExtractedUnit[]): void {
  if (!isObjectWithUnitsArray(obj)) {
    return;
  }
  for (const unit of obj.units) {
    if (isValidUnit(unit)) {
      units.push({ unitSlug: unit.unitSlug, unitTitle: unit.unitTitle });
    }
  }
}

/**
 * Extract units from tiers on an unknown object that may have a tiers property.
 */
function extractTiersFromUnknown(obj: unknown, units: ExtractedUnit[]): void {
  if (!isObjectWithTiersArray(obj)) {
    return;
  }
  for (const tier of obj.tiers) {
    extractUnitsFromTier(tier, units);
  }
}

/**
 * Type guard for objects with unitSlug and unitTitle properties.
 */
function isValidUnit(value: unknown): value is { unitSlug: string; unitTitle: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'unitSlug' in value &&
    typeof value.unitSlug === 'string' &&
    'unitTitle' in value &&
    typeof value.unitTitle === 'string'
  );
}

/**
 * Type guard for objects with a units array property.
 */
function isObjectWithUnitsArray(value: unknown): value is { units: unknown[] } {
  return (
    typeof value === 'object' && value !== null && 'units' in value && Array.isArray(value.units)
  );
}

/**
 * Type guard for objects with a tiers array property.
 */
function isObjectWithTiersArray(value: unknown): value is { tiers: unknown[] } {
  return (
    typeof value === 'object' && value !== null && 'tiers' in value && Array.isArray(value.tiers)
  );
}
