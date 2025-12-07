/**
 * Programme factor extraction utilities for Maths KS4 vertical slice.
 *
 * Extracts tier, exam board, and pathway information from lesson/unit programme factors.
 * These fields enable precision filtering in hybrid search queries.
 *
 * @module programme-factor-extractors
 */

/**
 * Extracts tier from lesson or unit data programme factors.
 *
 * KS4 Maths has Foundation and Higher tiers with different content difficulty.
 *
 * @param data - Lesson or unit data containing programmeFactors
 * @returns Tier value or undefined
 *
 * @example
 * ```typescript
 * const tier = extractTier(lessonData);
 * // 'foundation' | 'higher' | undefined
 * ```
 */
export function extractTier(data: {
  programmeFactors?: { tier?: string };
}): 'foundation' | 'higher' | undefined {
  const tier = data.programmeFactors?.tier;
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
 * @param data - Lesson or unit data containing programmeFactors
 * @returns Exam board string or undefined
 *
 * @example
 * ```typescript
 * const examBoard = extractExamBoard(lessonData);
 * // 'aqa' | 'edexcel' | 'ocr' | undefined
 * ```
 */
export function extractExamBoard(data: {
  programmeFactors?: { examBoard?: string };
}): string | undefined {
  const examBoard = data.programmeFactors?.examBoard;
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
 * @param data - Lesson or unit data containing programmeFactors
 * @returns Pathway string or undefined
 *
 * @example
 * ```typescript
 * const pathway = extractPathway(lessonData);
 * // 'core' | 'gcse' | 'functional-skills' | undefined
 * ```
 */
export function extractPathway(data: {
  programmeFactors?: { pathway?: string };
}): string | undefined {
  const pathway = data.programmeFactors?.pathway;
  if (typeof pathway === 'string' && pathway.length > 0) {
    return pathway;
  }
  return undefined;
}
