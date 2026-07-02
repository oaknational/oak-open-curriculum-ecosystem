/**
 * MAP stage workflow: extract atomic leaf signals from every corpus window.
 *
 * @remarks
 * Thin composition root over tested logic: the seeded partition (run-data), the map
 * prompt, the derived leaf schema, and the shared throttle (`runCapped` at
 * `MAP_CONCURRENCY` with deterministic per-window jitter — the cure for the 15-way
 * dispatch burst that tripped the server rate limit on 2026-07-01). Positional
 * alignment `results[i] ↔ partition[i]` is load-bearing: a dead window maps to zero
 * leaves at its own position and is surfaced by the completeness verdict, never
 * silently absorbed.
 *
 * @packageDocumentation
 */

import { AGENT_JSON_SCHEMAS } from './agent-schemas.js';
import type { LeafStageOutput } from './agent-schemas.js';
import type { HarnessAgent, HarnessLog, HarnessParallel, HarnessPhase } from './harness-types.js';
import { mapPrompt } from './prompts.js';
import { RUN_DATA, RUN_DATA_STAGE } from './run-data.js';
import { isMapRunData, unseededRunDataError } from './stage-guards.js';
import type { MapResult, PartitionWindow } from './stage-io.js';
import { assessMapCompleteness, deterministicJitterMs, runCapped } from '../run-orchestration.js';

declare const agent: HarnessAgent;
declare const parallel: HarnessParallel;
declare const phase: HarnessPhase;
declare const log: HarnessLog;

/** Peak in-flight map agents (owner-decided 2026-07-01) — the load-bearing throttle. */
const MAP_CONCURRENCY = 4;
/** Max deterministic per-window dispatch delay (ms) to flatten the burst. */
const JITTER_MS = 250;

async function mapWindow(w: PartitionWindow): Promise<LeafStageOutput | null> {
  if (typeof setTimeout === 'function' && JITTER_MS > 0) {
    await new Promise((done) => setTimeout(done, deterministicJitterMs(w.window, JITTER_MS)));
  }
  return agent<LeafStageOutput>(mapPrompt(w), {
    label: `map:${w.window}`,
    phase: 'map',
    model: 'sonnet',
    effort: 'low',
    // Read-only agent type (Read allow-list, capped turns): the stage's whole
    // purpose is reading the window's named files; nothing else is granted.
    agentType: 'corpus-mapper',
    schema: AGENT_JSON_SCHEMAS.leafStage,
  });
}

/** Run the map stage over the seeded partition. */
export async function main(): Promise<MapResult> {
  phase('map');
  if (!isMapRunData(RUN_DATA, RUN_DATA_STAGE)) {
    return { ok: false, error: unseededRunDataError('map') };
  }
  const partition = RUN_DATA.windows;
  const fileCount = partition.reduce((sum, w) => sum + w.files.length, 0);
  log(
    `partition: ${partition.length} windows, ${fileCount} files; MAP_CONCURRENCY=${MAP_CONCURRENCY}, jitter<=${JITTER_MS}ms`,
  );

  const mapResults = await runCapped(partition, MAP_CONCURRENCY, mapWindow, parallel);
  const windowLeaves = partition.map((w, index) => ({
    window: w.window,
    leaves: mapResults[index]?.leaves ?? [],
  }));
  const coverage = windowLeaves.map((w) => ({ window: w.window, leafCount: w.leaves.length }));
  const completeness = assessMapCompleteness(coverage);
  if (!completeness.mapComplete) {
    log(
      `MAP INCOMPLETE — ${completeness.incompleteWindows.length}/${partition.length} windows produced 0 leaves: ${completeness.incompleteWindows.join(', ')} — do NOT commit this as full coverage.`,
    );
  }
  const allLeaves = windowLeaves.flatMap((w) => w.leaves);
  log(
    `map done: ${allLeaves.length} leaves; per-window=[${coverage.map((c) => c.leafCount).join(',')}]`,
  );

  return {
    ok: true,
    partition: partition.map((w) => ({ window: w.window, fileCount: w.files.length })),
    coverage,
    mapComplete: completeness.mapComplete,
    incompleteWindows: [...completeness.incompleteWindows],
    leafCount: allLeaves.length,
    leaves: allLeaves,
  };
}
