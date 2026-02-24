/**
 * National Curriculum statement extraction from bulk download unit data.
 *
 * @remarks
 * Extracts `nationalCurriculumContent` from unit records,
 * enabling NC coverage mapping.
 *
 * @see ADR-086 (`docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md`) for extraction methodology
 */
import type { Unit } from '../lib/index.js';

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
 * Extracts subject from sequence slug.
 */
function extractSubject(sequenceSlug: string): string {
  const parts = sequenceSlug.split('-');
  if (parts.length >= 2) {
    const phase = parts[parts.length - 1];
    if (phase === 'primary' || phase === 'secondary') {
      return parts.slice(0, -1).join('-');
    }
  }
  return sequenceSlug;
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
    const subject = extractSubject(sequenceSlug);

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
