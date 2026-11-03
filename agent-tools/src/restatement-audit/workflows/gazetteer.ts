/**
 * Sandbox-safe gazetteer helpers — canonical subject ids inlined into every finder
 * dispatch.
 *
 * @remarks
 * This module is bundled INTO the sandbox artefact (imported for value by
 * `prompts.ts`), so it must stay zod-free — `Gazetteer` is imported as a TYPE ONLY from
 * `gazetteer-schema.ts` (erased at bundle time; the zod schema value never follows).
 * Shape matches `.agent/reports/restatement-audit/gazetteer.v1.json` (Director-compiled,
 * verified against a pinned tree): subjects grouped by category (gates, lanes, artefacts,
 * tools, …) are join keys, not exhaustive vocabulary — a finder that cannot match a
 * subject records it as free text (`subjectFromGazetteer: false`) rather than forcing a
 * gazetteer id.
 *
 * @packageDocumentation
 */

import { typeSafeValues } from '@oaknational/type-helpers';

import type { Gazetteer } from './gazetteer-schema.js';

/** Every canonical subject id across every category, deduplicated, in category order. */
export function flattenGazetteerSubjects(gazetteer: Gazetteer): string[] {
  const seen = new Set<string>();
  const flattened: string[] = [];
  for (const ids of typeSafeValues(gazetteer.subjects)) {
    for (const id of ids) {
      if (!seen.has(id)) {
        seen.add(id);
        flattened.push(id);
      }
    }
  }
  return flattened;
}

export type { Gazetteer } from './gazetteer-schema.js';
