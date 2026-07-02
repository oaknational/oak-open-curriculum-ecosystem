/**
 * REDUCE stage workflow: cluster the committed leaves into candidate patterns.
 *
 * @remarks
 * One Opus/high agent over the seeded leaves checkpoint. Candidates carry
 * representative `supportingLeafIds` and a true `groundingCount` but NO grounding
 * field — the validate stage reassembles voter grounding from the leaves checkpoint
 * (the strict candidate schema rejects over-carriage).
 *
 * @packageDocumentation
 */

import { AGENT_JSON_SCHEMAS } from './agent-schemas.js';
import type { CandidateStageOutput } from './agent-schemas.js';
import type { HarnessAgent, HarnessLog, HarnessPhase } from './harness-types.js';
import { reducePrompt } from './prompts.js';
import { RUN_DATA, RUN_DATA_STAGE } from './run-data.js';
import { isReduceRunData, unseededRunDataError } from './stage-guards.js';
import type { ReduceResult } from './stage-io.js';

declare const agent: HarnessAgent;
declare const phase: HarnessPhase;
declare const log: HarnessLog;

/** Run the reduce stage over the seeded leaves. */
export async function main(): Promise<ReduceResult> {
  phase('reduce');
  if (!isReduceRunData(RUN_DATA, RUN_DATA_STAGE)) {
    return { ok: false, error: unseededRunDataError('reduce') };
  }
  const leaves = RUN_DATA.leaves;
  log(`reduce-only: ${leaves.length} leaves`);

  const reduceResult = await agent<CandidateStageOutput>(reducePrompt(leaves), {
    label: 'reduce',
    phase: 'reduce',
    model: 'opus',
    effort: 'high',
    // No-tools agent type (minimal Read floor, capped turns): the reducer's
    // entire input is inlined in the prompt; it never needs the repo.
    agentType: 'corpus-reducer',
    schema: AGENT_JSON_SCHEMAS.candidateStage,
  });
  if (reduceResult === null) {
    return {
      ok: false,
      error: 'reduce agent died — re-run this stage from the same leaves checkpoint.',
    };
  }

  const candidates = reduceResult.candidates;
  const kindCounts = candidates.reduce<
    Partial<Record<(typeof candidates)[number]['kind'], number>>
  >((acc, candidate) => {
    acc[candidate.kind] = (acc[candidate.kind] ?? 0) + 1;
    return acc;
  }, {});
  const absenceCount = candidates.filter((candidate) => candidate.isAbsenceClaim).length;
  log(
    `reduce done: ${candidates.length} candidates (${absenceCount} absence); kinds=${JSON.stringify(kindCounts)}`,
  );

  return { ok: true, leafCount: leaves.length, candidates };
}
