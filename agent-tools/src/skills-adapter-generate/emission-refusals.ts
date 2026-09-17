/**
 * Emission refusals: the shared refusal-message form, and the pre-clear
 * preflight that computes which canonicals would refuse at emit.
 *
 * A `--clear` tears every existing Practice projection down before regeneration
 * rebuilds them, so a canonical that would refuse at emit must be caught BEFORE
 * the destructive clear — or the clear removes a skill's projection and the emit
 * then refuses to rebuild it (a lost projection, no attacker required; review
 * 2026-08-12). The preflight reuses emission's OWN primitives
 * (`isRoundTrippableCanonicalRef`, `collectCarriedFiles`, and
 * `classifyEmissionTarget`) so it can never diverge from the emit it guards, and
 * it covers every deterministic refusal that SURVIVES the clear:
 *   - the canonical source — a non-round-trippable ref, or a canonical-side
 *     carriage refusal (a symlinked carried root, a seam read failure); the
 *     clear never touches `.agent/skills/`, so this is stable across it;
 *   - a FOREIGN occupant at a target name — the clear removes only OURS, so a
 *     prefix change or a squatter can leave a foreign entry that emit refuses
 *     while the skill's old-prefix projection is stripped (review round 4).
 * A projection the clear DOES empty classifies `absent` afterwards (no refusal),
 * so no false refusal is raised for a name the clear is about to free. Transient
 * post-clear I/O faults at the target or the sweep still fail loud but pre-date
 * this cure — they are not the silent projection-loss this preflight closes.
 */
import { dirname } from 'node:path';

import { adapterTargetPath, type AdapterSurface } from './adapter-render.js';
import { isRoundTrippableCanonicalRef } from './adapter-stub.js';
import { collectCarriedFiles, realCarriageReadFs } from './carriage.js';
import type { ParsedCanonical } from './discovery.js';
import { classifyEmissionTarget, foreignTargetRefusal } from './emission-target.js';

const PROJECTION_SURFACES = ['claude', 'agents'] as const satisfies readonly AdapterSurface[];

/** The refusal for a canonical whose ref cannot round-trip as a class marker
 * (a backtick or newline in the directory name). Single-sourced so the
 * pre-clear preflight and the emit path report it identically. */
export function nonRoundTrippableRefusal(canonicalRef: string): string {
  return `${canonicalRef}: canonical path is not round-trippable as a class marker; refusing emission`;
}

/**
 * The refusals emission would raise that a clear cannot undo. For each canonical:
 * a non-round-trippable class marker, its canonical-side carriage refusals, and —
 * on each projection surface — a foreign occupant at the target name (which the
 * clear leaves in place and emit then refuses). Each reuses emission's own
 * primitive, so the preflight cannot diverge from the emit it guards.
 */
export async function emissionRefusalsBeforeClear(
  repoRoot: string,
  prefix: string,
  canonicals: readonly ParsedCanonical[],
): Promise<readonly string[]> {
  const refusals: string[] = [];
  for (const parsed of canonicals) {
    const canonicalRef = `${parsed.relativeDir}/${parsed.canonicalFilename}`;
    if (!isRoundTrippableCanonicalRef(canonicalRef)) {
      refusals.push(nonRoundTrippableRefusal(canonicalRef));
      continue;
    }
    const carried = await collectCarriedFiles(dirname(parsed.canonicalPath), realCarriageReadFs);
    refusals.push(...carried.refused);
    for (const surface of PROJECTION_SURFACES) {
      refusals.push(...(await foreignTargetRefusals(repoRoot, prefix, parsed.id, surface)));
    }
  }
  return refusals;
}

/** The emit-time target guard, run one step early: a foreign occupant (a
 * symlink, a foreign entry, an unrecognisable stub) at a target name is NOT
 * removed by the clear, so it must abort the run before the clear strips the
 * skill's old projection. The same classifier `emitAdapter` applies. */
async function foreignTargetRefusals(
  repoRoot: string,
  prefix: string,
  id: string,
  surface: AdapterSurface,
): Promise<readonly string[]> {
  const targetDir = dirname(adapterTargetPath(repoRoot, prefix, id, surface));
  const state = await classifyEmissionTarget(targetDir, realCarriageReadFs);
  if (state.kind === 'failure') {
    return [state.message];
  }
  return state.value === 'foreign' ? [foreignTargetRefusal(targetDir)] : [];
}
