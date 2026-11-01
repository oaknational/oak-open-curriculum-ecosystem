import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

import { err, isErr, ok, type Result } from '@oaknational/result';

import {
  compareByCodeUnit,
  renderJsonArtefact,
  type DenominatorFile,
} from './refounding-artefacts.js';
import {
  RUN_STATE_BASENAME,
  type AreaStatus,
  type RunState,
  type Stage,
} from './refound-batch-status-model.js';
import {
  DENOMINATOR_BASENAME,
  FROZEN_TREE_SEGMENT,
  IDENTITY_PROOF_SEGMENT,
} from './refound-freeze-helpers.js';
import { INVENTORY_BASENAME } from './refound-inventory-model.js';
import {
  groupFilesByArea,
  LEDGER_DIR_SEGMENT,
  ledgerBasenameForArea,
} from './refound-ledger-row.js';
import { readInventoryRecords } from './refound-inventory-read.js';
import { runTile } from './refound-tile-helpers.js';
import { readEffectiveDenominator, verifyFreeze } from './refound-verify-freeze-helpers.js';

/**
 * The IO orchestration of `refound-batch-status` (R0a cycle 4): recompute
 * the whole protocol dashboard from the artefacts themselves — pure
 * IN-PROCESS composition of the landed verifiers (`verifyFreeze`,
 * `readInventoryRecords`, `runTile`), never a spawn — and OVERWRITE the
 * `run-state.v1.json` cache with the recomputed state.
 *
 * The lattice gates evaluation (each stage only under a green predecessor;
 * gated-off stages report `not-reached`, never a guess), existence probes
 * distinguish `not-reached` (ENOENT) from `invalid` (present but
 * unreadable) before any verifier runs, and areas are enumerated by the
 * denominator-path RULE (`groupFilesByArea`), never a frozen list. One
 * area's absent ledger cannot poison the dashboard: each area is tiled
 * independently, and the cross-area duplicate-id check runs as its own
 * stage once every area tiles green (and at least two exist).
 *
 * @packageDocumentation
 */

/** A gated-off stage, pointing at the predecessor that stopped evaluation. */
const notReached = (detail: string): Stage => ({ state: 'not-reached', detail });

/** Evaluate the effective-denominator root stage. */
async function denominatorStage(
  outDirAbs: string,
): Promise<{ stage: Stage; files: readonly DenominatorFile[] }> {
  if (!existsSync(path.join(outDirAbs, DENOMINATOR_BASENAME))) {
    return {
      stage: notReached(`no ${DENOMINATOR_BASENAME} on disk — the freeze has not run`),
      files: [],
    };
  }
  const denominator = await readEffectiveDenominator(outDirAbs);
  if (isErr(denominator)) {
    return { stage: { state: 'invalid', detail: denominator.error.message }, files: [] };
  }
  return {
    stage: { state: 'green', detail: `${String(denominator.value.files.length)} file(s)` },
    files: denominator.value.files,
  };
}

/** Evaluate the freeze stage (byte identity of every frozen copy). */
async function freezeStage(outDirAbs: string): Promise<Stage> {
  const frozenTreeAbs = path.join(outDirAbs, FROZEN_TREE_SEGMENT);
  const proofAbs = path.join(outDirAbs, IDENTITY_PROOF_SEGMENT);
  if (!existsSync(frozenTreeAbs) || !existsSync(proofAbs)) {
    return notReached('no frozen tree or identity proof on disk — the freeze has not run');
  }
  const report = await verifyFreeze({ outDirAbs });
  if (isErr(report)) {
    return { state: 'invalid', detail: report.error.message };
  }
  if (report.value.violations.length > 0) {
    return {
      state: 'red',
      detail:
        `${String(report.value.violations.length)} violation(s) across ` +
        `${String(report.value.checkedFiles)} checked file(s)`,
    };
  }
  return { state: 'green', detail: `${String(report.value.checkedFiles)} file(s) verified` };
}

/** Evaluate the inventory stage (artefact present and strictly parseable). */
async function inventoryStage(outDirAbs: string): Promise<Stage> {
  if (!existsSync(path.join(outDirAbs, INVENTORY_BASENAME))) {
    return notReached(`no ${INVENTORY_BASENAME} on disk — the inventory has not run`);
  }
  const records = await readInventoryRecords(outDirAbs);
  if (isErr(records)) {
    return { state: 'invalid', detail: records.error.message };
  }
  return { state: 'green', detail: `${String(records.value.length)} record(s)` };
}

/** Evaluate one area's tiling stage through the real tile verifier. */
async function areaStage(
  outDirAbs: string,
  area: string,
  files: readonly DenominatorFile[],
): Promise<AreaStatus> {
  const base = { area, files: files.length };
  const ledgerAbs = path.join(outDirAbs, LEDGER_DIR_SEGMENT, ledgerBasenameForArea(area));
  if (!existsSync(ledgerAbs)) {
    return { ...base, state: 'not-reached', detail: 'not yet tiled: no ledger on disk' };
  }
  const report = await runTile({ outDirAbs, area });
  if (isErr(report)) {
    return { ...base, state: 'invalid', detail: report.error.message };
  }
  if (report.value.violations.length > 0) {
    return {
      ...base,
      state: 'red',
      detail: `${String(report.value.violations.length)} violation(s) over ${String(report.value.rows)} row(s)`,
    };
  }
  return { ...base, state: 'green', detail: `${String(report.value.rows)} row(s)` };
}

/** The cross-area duplicate-id stage: a whole-denominator tile run. */
async function crossAreaStage(outDirAbs: string, areas: readonly AreaStatus[]): Promise<Stage> {
  const tiledGreen = areas.filter((area) => area.state === 'green');
  if (tiledGreen.length < 2) {
    return notReached('fewer than two areas tiled green');
  }
  if (tiledGreen.length < areas.length) {
    return notReached('every area must tile green before the cross-area check');
  }
  const report = await runTile({ outDirAbs });
  if (isErr(report)) {
    return { state: 'invalid', detail: report.error.message };
  }
  if (report.value.violations.length > 0) {
    return {
      state: 'red',
      detail: `${String(report.value.violations.length)} violation(s) in the whole-denominator run`,
    };
  }
  return {
    state: 'green',
    detail: `${String(tiledGreen.length)} tiled area(s), no duplicate ids`,
  };
}

/** Evaluate every area under a green inventory, sorted by area id. */
async function evaluateAreas(
  outDirAbs: string,
  files: readonly DenominatorFile[],
): Promise<Result<readonly AreaStatus[], Error>> {
  const byArea = groupFilesByArea(files);
  if (isErr(byArea)) {
    return byArea;
  }
  const areas: AreaStatus[] = [];
  for (const area of [...byArea.value.keys()].sort(compareByCodeUnit)) {
    areas.push(await areaStage(outDirAbs, area, byArea.value.get(area) ?? []));
  }
  return ok(areas);
}

/** The lattice stages downstream of the denominator root. */
interface LatticeStages {
  readonly freeze: Stage;
  readonly inventory: Stage;
  readonly crossArea: Stage;
  readonly areas: readonly AreaStatus[];
}

/** Every downstream stage gated off by one non-green predecessor. */
function gatedOff(detail: string): LatticeStages {
  return {
    freeze: notReached(detail),
    inventory: notReached(detail),
    crossArea: notReached(detail),
    areas: [],
  };
}

/** Evaluate the gated lattice under a green effective denominator. */
async function evaluateLattice(
  outDirAbs: string,
  files: readonly DenominatorFile[],
): Promise<Result<LatticeStages, Error>> {
  const freeze = await freezeStage(outDirAbs);
  if (freeze.state !== 'green') {
    return ok({ ...gatedOff('freeze stage not green'), freeze });
  }
  const inventory = await inventoryStage(outDirAbs);
  if (inventory.state !== 'green') {
    return ok({ ...gatedOff('inventory stage not green'), freeze, inventory });
  }
  const areas = await evaluateAreas(outDirAbs, files);
  if (isErr(areas)) {
    return areas;
  }
  const crossArea = await crossAreaStage(outDirAbs, areas.value);
  return ok({ freeze, inventory, crossArea, areas: areas.value });
}

/**
 * Recompute the full dashboard and OVERWRITE the run-state cache. The cache
 * is never read: a falsified `run-state.v1.json` has zero effect on this
 * recompute (P4 cache-tamper proof). Refusals (an unwritable cache, an
 * ambiguous area derivation) return `Err` with nothing written.
 */
export async function runBatchStatus(input: {
  readonly outDirAbs: string;
}): Promise<Result<RunState, Error>> {
  const denominator = await denominatorStage(input.outDirAbs);
  const lattice =
    denominator.stage.state === 'green'
      ? await evaluateLattice(input.outDirAbs, denominator.files)
      : ok(gatedOff('denominator stage not green'));
  if (isErr(lattice)) {
    return lattice;
  }
  const runState: RunState = {
    version: 1,
    denominator: denominator.stage,
    freeze: lattice.value.freeze,
    inventory: lattice.value.inventory,
    crossArea: lattice.value.crossArea,
    areas: [...lattice.value.areas],
  };
  try {
    await writeFile(
      path.join(input.outDirAbs, RUN_STATE_BASENAME),
      renderJsonArtefact(runState),
      'utf8',
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return err(new Error(`run-state cache write failed: ${message}`));
  }
  return ok(runState);
}
