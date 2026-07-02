/**
 * Meta literal for the REDUCE stage workflow. Pure literal, no value imports — the
 * harness emitter serialises it verbatim as the artefact's static `export const meta`.
 *
 * @packageDocumentation
 */

import type { WorkflowMeta } from './workflow-meta.js';

/** REDUCE stage descriptor. */
export const meta = {
  name: 'napkin-corpus-analysis-reduce',
  description:
    'Checkpoint-1b: reduce ONLY (Opus/high) over the seeded committed leaves — cluster into mechanism-grained and longitudinal candidates. A reduce failure re-runs from the SAME leaves checkpoint; map is never re-spent.',
  phases: [{ title: 'reduce', detail: 'Opus/high — cluster committed leaves into candidates' }],
} as const satisfies WorkflowMeta;
