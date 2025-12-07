/**
 * Programme factor extraction utilities for Maths KS4 vertical slice.
 *
 * Extracts tier, exam board, and pathway information from lesson/unit programme factors.
 * These fields enable precision filtering in hybrid search queries.
 *
 * @module programme-factor-extractors
 */

/**
 * Type guard to check if a value is a non-null object.
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Safely extracts programmeFactors from an unknown data structure.
 */
function getProgrammeFactors(data: unknown): Record<string, unknown> | undefined {
  if (!isObject(data)) {
    return undefined;
  }
  const pf = data['programmeFactors'];
  if (!isObject(pf)) {
    return undefined;
  }
  return pf;
}

/**
 * Extracts tier from lesson or unit data programme factors.
 *
 * KS4 Maths has Foundation and Higher tiers with different content difficulty.
 *
 * @param data - Lesson or unit data containing programmeFactors (accepts unknown)
 * @returns Tier value or undefined
 *
 * @example
 * ```typescript
 * const tier = extractTier(lessonData);
 * // 'foundation' | 'higher' | undefined
 * ```
 */
export function extractTier(data: unknown): 'foundation' | 'higher' | undefined {
  const pf = getProgrammeFactors(data);
  if (!pf) {
    return undefined;
  }
  const tier = pf['tier'];
  if (tier === 'foundation' || tier === 'higher') {
    return tier;
  }
  return undefined;
}

/**
 * Extracts exam board from lesson or unit data programme factors.
 *
 * Identifies the exam board for GCSE/A-Level content (e.g., AQA, Edexcel, OCR).
 *
 * @param data - Lesson or unit data containing programmeFactors (accepts unknown)
 * @returns Exam board string or undefined
 *
 * @example
 * ```typescript
 * const examBoard = extractExamBoard(lessonData);
 * // 'aqa' | 'edexcel' | 'ocr' | undefined
 * ```
 */
export function extractExamBoard(data: unknown): string | undefined {
  const pf = getProgrammeFactors(data);
  if (!pf) {
    return undefined;
  }
  const examBoard = pf['examBoard'];
  if (typeof examBoard === 'string' && examBoard.length > 0) {
    return examBoard;
  }
  return undefined;
}

/**
 * Extracts pathway from lesson or unit data programme factors.
 *
 * Identifies the programme pathway (e.g., core, GCSE, functional skills).
 *
 * @param data - Lesson or unit data containing programmeFactors (accepts unknown)
 * @returns Pathway string or undefined
 *
 * @example
 * ```typescript
 * const pathway = extractPathway(lessonData);
 * // 'core' | 'gcse' | 'functional-skills' | undefined
 * ```
 */
export function extractPathway(data: unknown): string | undefined {
  const pf = getProgrammeFactors(data);
  if (!pf) {
    return undefined;
  }
  const pathway = pf['pathway'];
  if (typeof pathway === 'string' && pathway.length > 0) {
    return pathway;
  }
  return undefined;
}
