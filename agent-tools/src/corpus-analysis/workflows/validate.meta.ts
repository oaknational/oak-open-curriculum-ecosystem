/**
 * Meta literal for the VALIDATE stage workflow. Pure literal, no value imports — the
 * harness emitter serialises it verbatim as the artefact's static `export const meta`.
 *
 * @packageDocumentation
 */

import type { WorkflowMeta } from './workflow-meta.js';

/** VALIDATE stage descriptor. */
export const meta = {
  name: 'napkin-corpus-analysis-validate',
  description:
    'Checkpoint-2: tiered adversary validation (Sonnet-5/high voters, mirror-free — the real adjudication state machine is bundled in) over the seeded candidates, at a concurrency cap with deterministic jitter. Candidate-granular resume via resolvedIds; the post-reduce cost re-gate refuses to dispatch any voter over the explicit token ceiling. Meta always runs as its own separate stage over the merged dispositions.',
  phases: [
    {
      title: 'validate',
      detail:
        'Sonnet-5/high voters — tiered adversary over seeded candidates, capped at 8 in flight',
    },
  ],
} as const satisfies WorkflowMeta;
