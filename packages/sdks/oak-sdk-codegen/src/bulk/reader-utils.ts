/**
 * Pure utility functions for bulk download filename parsing.
 *
 * @remarks
 * Separated from {@link reader} to avoid transitive dependency on generated
 * types. Functions here operate on strings only.
 */

/**
 * Subject and phase extracted from a bulk download filename.
 */
export interface SubjectPhase {
  /** Subject slug (e.g., 'maths', 'design-technology') */
  readonly subject: string;
  /** Phase (primary or secondary) */
  readonly phase: 'primary' | 'secondary';
}

/**
 * Extracts subject and phase from a bulk download filename.
 *
 * @param filename - The filename (e.g., 'maths-primary.json')
 * @returns Subject and phase, or undefined if filename doesn't match pattern
 *
 * @example
 * ```ts
 * extractSubjectPhase('maths-primary.json')
 * // Returns: { subject: 'maths', phase: 'primary' }
 *
 * extractSubjectPhase('design-technology-secondary.json')
 * // Returns: { subject: 'design-technology', phase: 'secondary' }
 * ```
 */
export function extractSubjectPhase(filename: string): SubjectPhase | undefined {
  const match = /^(.+)-(primary|secondary)\.json$/.exec(filename);
  if (!match) {
    return undefined;
  }
  const subject = match[1];
  const phase = match[2];
  if (phase !== 'primary' && phase !== 'secondary') {
    return undefined;
  }
  return { subject, phase };
}
