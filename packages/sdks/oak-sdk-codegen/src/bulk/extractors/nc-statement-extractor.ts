/**
 * National Curriculum statement extraction from bulk download unit data.
 *
 * @remarks
 * Extracts `nationalCurriculumContent` from unit records,
 * enabling NC coverage mapping.
 *
 * @see ADR-086 (`docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md`) for extraction methodology
 */
import type { Unit } from '../../types/generated/bulk/index.js';
import { sequenceSubject } from '../reader-utils.js';

/**
 * Extracted NC statement with unit context.
 */
export interface ExtractedNCStatement {
  /** The National Curriculum statement text */
  readonly statement: string;
  /** Unit that covers this statement */
  readonly unitSlug: string;
  /** Unit title for context */
  readonly unitTitle: string;
  /** Subject of the unit */
  readonly subject: string;
  /** Key stage of the unit */
  readonly keyStage: string;
}

/**
 * Extracts all NC statements from unit data.
 *
 * @param units - Array of units with their sequence slug
 * @returns All NC statements with context
 */
export function extractNCStatements(
  units: readonly { unit: Unit; sequenceSlug: string }[],
): readonly ExtractedNCStatement[] {
  const results: ExtractedNCStatement[] = [];

  for (const { unit, sequenceSlug } of units) {
    const subject = sequenceSubject(sequenceSlug);

    for (const statement of unit.nationalCurriculumContent) {
      // Skip empty statements
      if (!statement.trim()) {
        continue;
      }

      results.push({
        statement,
        unitSlug: unit.unitSlug,
        unitTitle: unit.unitTitle,
        subject,
        keyStage: unit.keyStageSlug,
      });
    }
  }

  return results;
}
