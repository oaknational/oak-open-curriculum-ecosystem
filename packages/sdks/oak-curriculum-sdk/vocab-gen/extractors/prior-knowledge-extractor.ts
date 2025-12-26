/**
 * Prior knowledge extraction from bulk download unit data.
 *
 * @remarks
 * Extracts `priorKnowledgeRequirements` from unit records,
 * enabling prerequisite graph construction.
 *
 * @see {@link https://github.com/oaknationalacademy/oak-notion-mcp/blob/main/docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md | ADR-086} for extraction methodology
 */
import type { Unit } from '../lib/index.js';

/**
 * Extracted prior knowledge requirement with unit context.
 */
export interface ExtractedPriorKnowledge {
  /** The prior knowledge statement */
  readonly requirement: string;
  /** Unit that requires this knowledge */
  readonly unitSlug: string;
  /** Unit title for context */
  readonly unitTitle: string;
  /** Subject of the unit */
  readonly subject: string;
  /** Key stage of the unit */
  readonly keyStage: string;
  /** Year group */
  readonly year: number | undefined;
}

/**
 * Extracts year from unit, handling "All years" case.
 */
function extractYear(unit: Unit): number | undefined {
  if (unit.year === 'All years') {
    return undefined;
  }
  return unit.year;
}

/**
 * Extracts subject from sequence slug (format: "subject-phase").
 *
 * @remarks
 * Sequence slug format is typically "subject-phase" e.g., "maths-primary".
 * We extract the subject portion by removing the phase suffix.
 */
function extractSubject(sequenceSlug: string): string {
  // Sequence slug format is typically "subject-phase" e.g., "maths-primary"
  const parts = sequenceSlug.split('-');
  // Remove 'primary' or 'secondary' suffix to get subject
  if (parts.length >= 2) {
    const phase = parts[parts.length - 1];
    if (phase === 'primary' || phase === 'secondary') {
      return parts.slice(0, -1).join('-');
    }
  }
  return sequenceSlug;
}

/**
 * Extracts all prior knowledge requirements from unit data.
 *
 * @param units - Array of units with their sequence slug
 * @returns All prior knowledge requirements with context
 */
export function extractPriorKnowledge(
  units: readonly { unit: Unit; sequenceSlug: string }[],
): readonly ExtractedPriorKnowledge[] {
  const results: ExtractedPriorKnowledge[] = [];

  for (const { unit, sequenceSlug } of units) {
    const subject = extractSubject(sequenceSlug);

    for (const requirement of unit.priorKnowledgeRequirements) {
      // Skip empty requirements
      if (!requirement.trim()) {
        continue;
      }

      results.push({
        requirement,
        unitSlug: unit.unitSlug,
        unitTitle: unit.unitTitle,
        subject,
        keyStage: unit.keyStageSlug,
        year: extractYear(unit),
      });
    }
  }

  return results;
}
