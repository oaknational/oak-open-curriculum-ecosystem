/**
 * Public API for the static "Quality standards" content. Demo by Heather W.
 *
 * The shape — a zod schema, the single source of truth — and the closed-set guards live in
 * `./quality-standards-types`; the concrete data is the committed JSON snapshot
 * (`./data/quality-standards.json`, 685 rows), schema-validated twice: by
 * `scripts/generate-quality-standards.ts` before it is (re-)written and by
 * `./data/load-quality-standards` at module initialisation. This module re-exports the shape +
 * data and adds the search helper; it is the static complement to the live curriculum group
 * (`useCurriculumSearch`) in the unified hub search.
 *
 * Licensing: this is Oak quality-standards content, placed under the OGL by `LICENCE-DATA.md`.
 */

export {
  QUALITY_STANDARD_TYPES,
  QUALITY_STANDARD_STATES,
  isQualityStandardType,
  isQualityStandardState,
  type QualityStandard,
  type QualityStandardType,
} from './quality-standards-types';

import type { QualityStandard } from './quality-standards-types';
import { qualityStandards } from './data/load-quality-standards';

/**
 * Filter quality standards by a free-text query (case-insensitive across text, subject, areas,
 * components, and rubrics). An empty query returns no results — parity with the live curriculum
 * group's idle state. Results are capped at `limit` for the results UI.
 *
 * @param query - the live search string (shared with the hero, like `useCurriculumSearch`)
 * @param limit - maximum results to return (default 24)
 */
export function searchQualityStandards(query: string, limit = 24): QualityStandard[] {
  const q = query.trim().toLowerCase();
  if (q === '') {
    return [];
  }
  const matches = (s: QualityStandard): boolean =>
    s.text.toLowerCase().includes(q) ||
    s.subject.toLowerCase().includes(q) ||
    s.areas.some((a) => a.toLowerCase().includes(q)) ||
    s.components.some((c) => c.toLowerCase().includes(q)) ||
    s.rubrics.some((r) => r.toLowerCase().includes(q));
  return qualityStandards.filter(matches).slice(0, limit);
}

export { qualityStandards } from './data/load-quality-standards';
