/**
 * Meta literal for the META stage workflow. Pure literal, no value imports — the
 * harness emitter serialises it verbatim as the artefact's static `export const meta`.
 *
 * @packageDocumentation
 */

import type { WorkflowMeta } from './workflow-meta.js';

/** META stage descriptor. */
export const meta = {
  name: 'napkin-corpus-analysis-meta',
  description:
    'Recall calibration (Opus/high) over the seeded MERGED dispositioned candidates — per-baseline recall matches against the frozen fixture plus per-candidate corroboration claims. Runs as its own stage on every run (clean or resumed); its run data is rejected at build time unless every candidate carries a terminal disposition.',
  phases: [
    { title: 'meta', detail: 'Opus/high — per-baseline recall match + corroboration claims' },
  ],
} as const satisfies WorkflowMeta;
