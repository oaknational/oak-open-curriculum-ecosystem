import type { KeyStage } from '../../types/oak';

export interface LessonUnitReference {
  readonly unitSlug: string;
  readonly unitTitle: string;
  readonly canonicalUrl: string;
}

/** Extracts unit arrays from unit info list. */
export function extractUnitArrays(units: readonly LessonUnitReference[]): {
  unitIds: string[];
  unitTitles: string[];
  unitUrls: string[];
} {
  return {
    unitIds: units.map((unit) => unit.unitSlug),
    unitTitles: units.map((unit) => unit.unitTitle),
    unitUrls: units.map((unit) => unit.canonicalUrl),
  };
}

/**
 * Derives phase slug from key stage.
 *
 * Phases are the fundamental curriculum division:
 * - `primary`: Years 1-6 (KS1 + KS2)
 * - `secondary`: Years 7-11 (KS3 + KS4)
 */
export function derivePhaseFromKeyStage(keyStage: KeyStage): 'primary' | 'secondary' {
  return keyStage === 'ks1' || keyStage === 'ks2' ? 'primary' : 'secondary';
}

/** Copies an array if defined, otherwise returns undefined. */
export function copyArrayOrUndefined<T>(values: readonly T[] | undefined): T[] | undefined {
  return values ? [...values] : undefined;
}
