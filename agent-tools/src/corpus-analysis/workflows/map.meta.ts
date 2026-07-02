/**
 * Meta literal for the MAP stage workflow. Pure literal, no value imports — the harness
 * emitter serialises it verbatim as the artefact's static `export const meta`.
 *
 * @packageDocumentation
 */

import type { WorkflowMeta } from './workflow-meta.js';

/** MAP stage descriptor. */
export const meta = {
  name: 'napkin-corpus-analysis-map',
  description:
    'Checkpoint-1a: map ONLY (Sonnet/low, concurrency-capped + jittered) over the seeded window partition — extract atomic actuator-grained LEAF signals. Returns a typed envelope with per-window coverage and an explicit completeness verdict; the operator commits the leaves checkpoint before running reduce, so a reduce failure never re-spends this map.',
  phases: [
    {
      title: 'map',
      detail: 'N windows, Sonnet/low, capped at 4 in flight — extract atomic leaf signals',
    },
  ],
} as const satisfies WorkflowMeta;
