/**
 * META stage workflow: recall calibration over the merged dispositioned candidates.
 *
 * @remarks
 * One Opus/high agent judging, per frozen baseline, whether the run re-found it — plus
 * per-candidate corroboration claims (the real-world-signal leg). The baselines are the
 * REAL `RECALL_BASELINES` fixture, projected to `{id, population, statement}` at the
 * call site; the full merged-set completeness contract (every candidate terminal, no
 * duplicates or gaps) is enforced by `build-run-artefact`'s zod validation before this
 * artefact is ever seeded — the old operator-discipline "pre-meta hard gate" is now
 * structural.
 *
 * @packageDocumentation
 */

import { AGENT_JSON_SCHEMAS } from './agent-schemas.js';
import type { HarnessAgent, HarnessLog, HarnessPhase } from './harness-types.js';
import { metaPrompt } from './prompts.js';
import { RUN_DATA, RUN_DATA_STAGE } from './run-data.js';
import { isMetaRunData, unseededRunDataError } from './stage-guards.js';
import type { MetaResult } from './stage-io.js';
import type { MetaOutput } from '../recall-schemas.js';
import { RECALL_BASELINES } from '../recall-baseline-fixture.js';

declare const agent: HarnessAgent;
declare const phase: HarnessPhase;
declare const log: HarnessLog;

/** Run the meta stage over the merged dispositioned candidates. */
export async function main(): Promise<MetaResult> {
  phase('meta');
  if (!isMetaRunData(RUN_DATA, RUN_DATA_STAGE)) {
    return { ok: false, error: unseededRunDataError('meta') };
  }
  const baselines = RECALL_BASELINES.map((baseline) => ({
    id: baseline.id,
    population: baseline.population,
    statement: baseline.statement,
  }));
  log(
    `meta: ${RUN_DATA.candidates.length} dispositioned candidates vs ${baselines.length} baselines`,
  );

  const metaOutput = await agent<MetaOutput>(metaPrompt(RUN_DATA.candidates, baselines), {
    label: 'meta',
    phase: 'meta',
    model: 'opus',
    effort: 'high',
    // Read-only-search agent type (Glob/Grep/Read, capped turns): corroboration
    // claims are verified against disk before naming, and nothing can mutate.
    agentType: 'corpus-meta',
    schema: AGENT_JSON_SCHEMAS.metaStage,
  });
  if (metaOutput === null) {
    return {
      ok: false,
      error: 'meta agent died — re-run this stage from the same merged dispositions.',
    };
  }
  log(
    `meta done: ${metaOutput.recallMatches.length} recall matches, ${metaOutput.corroborationClaims.length} corroboration claims`,
  );

  return { ok: true, meta: metaOutput };
}
