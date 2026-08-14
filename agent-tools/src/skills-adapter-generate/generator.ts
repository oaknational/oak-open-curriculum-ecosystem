/**
 * Skills adapter generator.
 *
 * Discovers canonical skills under `.agent/skills/` (flat individuals,
 * concern-tier members, and domain-tier members — see `discovery.ts`) and
 * emits two adapter surfaces per skill:
 *
 *   - `.claude/skills/<prefix><id>/SKILL.md`  — Claude Code adapter
 *   - `.agents/skills/<prefix><id>/SKILL.md`  — cross-tool stub (Codex, Cursor, Gemini)
 *
 * Adapters are stub pointers: their body links back to the canonical, which
 * remains the single source of truth for workflow content. Supporting
 * directories (`scripts/`, `references/`, `assets/` — never `evals/`) are
 * carried beside each adapter as byte-stable copies, and carried copies
 * whose canonical source is gone are pruned — see `carriage.ts`.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import { isRoundTrippableCanonicalRef } from './adapter-stub.js';
import { realCarriageWriteFs, syncCarriage } from './carriage.js';
import { clearGeneratedAdapters, type ClearResult } from './clear.js';
import { emissionRefusalsBeforeClear, nonRoundTrippableRefusal } from './emission-refusals.js';
import { classifyEmissionTarget, foreignTargetRefusal } from './emission-target.js';
import { adapterTargetPath, renderAdapter, type AdapterSurface } from './adapter-render.js';
import { discoverCanonicals, type ParsedCanonical } from './discovery.js';
import { isDiscoveryComplete, sweepStaleProjections } from './projection-roots.js';

export { discoverCanonicals, parseFrontmatter, type DiscoveryFs } from './discovery.js';
export {
  adapterTargetPath,
  buildAdapterFrontmatter,
  renderAdapter,
  type AdapterSurface,
} from './adapter-render.js';

export interface GeneratorOptions {
  readonly repoRoot: string;
  readonly prefix: string;
  /** Remove every existing Practice projection before regenerating. The clear
   * runs ONLY after discovery is proven complete AND every canonical is proven
   * emittable (see `generateAdapters`), so a run that could not fully discover
   * its canonicals never strands the surfaces empty, and a canonical that would
   * refuse at emit never loses its projection to the clear. */
  readonly clearFirst?: boolean;
}

export interface GenerateOutcome {
  readonly written: readonly string[];
  readonly skipped: readonly string[];
  readonly duplicates: readonly string[];
  /** Carried copies removed because their canonical source is gone. A cure
   * the run applied, reported for observability — never a failure state. */
  readonly pruned: readonly string[];
  /** Refusals — canonical-side symlinks and seam read failures. A refused
   * skill emits NOTHING (no adapter, no carriage, no pruning): destructive
   * reconciliation over a partially observed tree is how valid copies get
   * deleted. A refusal fails the run. */
  readonly refused: readonly string[];
  /** Whole stale projection-root entries the sweep removed (directories,
   * root-level links) — reported separately from `pruned` so the operator
   * never reads a swept directory as an orphaned carried file. */
  readonly sweptStale: readonly string[];
  /** Practice-projection directories removed by a `clearFirst` pass BEFORE
   * regeneration — empty unless clearing was requested. The clear runs only
   * after discovery is proven complete, so this is never a partial teardown
   * of a tree the run then failed to rebuild. */
  readonly cleared: readonly string[];
}

export type ParsedCanonicalSkill = ParsedCanonical;

/** The no-emission outcome: every stream empty except the discovery streams the
 * caller already computed. Spread with per-gate overrides at each early return. */
function emptyOutcome(skipped: readonly string[], duplicates: readonly string[]): GenerateOutcome {
  return { written: [], pruned: [], refused: [], sweptStale: [], cleared: [], skipped, duplicates };
}

/**
 * Discover, parse, and emit adapters for every canonical skill under
 * `.agent/skills/`, carrying each skill's supporting directories beside the
 * adapter and pruning orphaned carried copies. Idempotent — re-running
 * yields byte-identical projection files when the canonicals are unchanged.
 * Duplicate leaf ids refuse the whole emission: the adapter namespace is
 * flat, and writing either claimant would silently shadow the other.
 */
export async function generateAdapters(options: GeneratorOptions): Promise<GenerateOutcome> {
  const discovery = await discoverCanonicals(options.repoRoot);
  const empty = emptyOutcome(discovery.skipped, discovery.duplicates);

  if (discovery.duplicates.length > 0) {
    return empty;
  }
  // NOTHING runs over an incomplete discovery — not clear, sweep, or emission.
  // A skipped or empty canonical set leaves the projection set and per-skill
  // write targets unverified, and a half-applied cure over an unobserved tree
  // is how valid copies get deleted (round-4 write-through-a-symlinked-root).
  if (!isDiscoveryComplete(discovery)) {
    return empty;
  }
  // Preflight BEFORE the destructive clear: a canonical that would refuse at
  // emit must abort the run before a single removal, or --clear loses the
  // projection the emit then refuses to rebuild (defect 1; emission-refusals.ts).
  const preflightRefusals =
    options.clearFirst === true
      ? await emissionRefusalsBeforeClear(options.repoRoot, options.prefix, discovery.canonicals)
      : [];
  if (preflightRefusals.length > 0) {
    return { ...empty, refused: [...preflightRefusals] };
  }
  // Clear runs ONLY here — behind the discovery gate AND the preflight — and a
  // clear failure refuses the run (surfacing any partial teardown on `cleared`).
  const clearOutcome = await clearIfRequested(options);
  if (clearOutcome.kind === 'error') {
    return { ...empty, cleared: clearOutcome.removed ?? [], refused: [clearOutcome.message] };
  }
  const cleared = clearOutcome.removed;
  // Sweep BEFORE emission: stale Practice projections (canonical deleted or
  // renamed) leave the surfaces first, so no adapter is written into an entry
  // the sweep is about to adjudicate. A sweep read failure refuses the run.
  const sweepOutcome = await sweepStaleProjections({
    repoRoot: options.repoRoot,
    projections: discovery.canonicals.map((parsed) => ({
      canonicalRef: `${parsed.relativeDir}/${parsed.canonicalFilename}`,
      expectedName: `${options.prefix}${parsed.id}`,
    })),
    discoveryComplete: true,
  });
  if (sweepOutcome.refusedRun.length > 0) {
    return { ...empty, cleared, refused: [...sweepOutcome.refusedRun] };
  }
  const emitted = await emitAllAdapters(options, discovery.canonicals);
  return { ...empty, ...emitted, cleared, sweptStale: [...sweepOutcome.pruned] };
}

/**
 * Clear every existing Practice projection when `clearFirst` is set. The
 * destructive act is reached ONLY from `generateAdapters`, AFTER its
 * discovery-completeness gate, so a run from the wrong directory (zero
 * canonicals) or over a half-authored corpus never tears the surfaces down
 * (review 2026-08-12, defect 1). No clear requested is an empty `ok`.
 */
async function clearIfRequested(options: GeneratorOptions): Promise<ClearResult> {
  return options.clearFirst === true
    ? clearGeneratedAdapters(options.repoRoot)
    : { kind: 'ok', removed: [] };
}

async function emitAllAdapters(
  options: GeneratorOptions,
  canonicals: readonly ParsedCanonical[],
): Promise<Pick<GenerateOutcome, 'written' | 'pruned' | 'refused'>> {
  const written: string[] = [];
  const pruned: string[] = [];
  const refused: string[] = [];
  for (const parsed of canonicals) {
    const canonicalRef = `${parsed.relativeDir}/${parsed.canonicalFilename}`;
    // Refuse a canonical whose ref cannot round-trip as a class marker (a
    // pathological directory name carrying a backtick or newline): writing its
    // stub would land content every later check then rejects as foreign —
    // first-write-then-refuse (review 2026-08-12). Refuse per skill so the run
    // fails loud and reports it, rather than emitting an unrecognisable stub.
    if (!isRoundTrippableCanonicalRef(canonicalRef)) {
      refused.push(nonRoundTrippableRefusal(canonicalRef));
      continue;
    }
    for (const surface of ['claude', 'agents'] as const) {
      const emitted = await emitAdapter(options, parsed, surface);
      written.push(...emitted.written);
      pruned.push(...emitted.pruned);
      refused.push(...emitted.refused);
    }
  }
  return { written, pruned, refused };
}

interface EmitAdapterOutcome {
  readonly written: readonly string[];
  readonly pruned: readonly string[];
  readonly refused: readonly string[];
}

async function emitAdapter(
  options: GeneratorOptions,
  parsed: ParsedCanonical,
  surface: AdapterSurface,
): Promise<EmitAdapterOutcome> {
  const target = adapterTargetPath(options.repoRoot, options.prefix, parsed.id, surface);
  // Target guard FIRST: emission is name-addressed, so before any write the
  // occupant of the name must be absent or provably ours — a symlink or
  // foreign content at the name refuses the skill (emission-target.ts).
  const targetState = await classifyEmissionTarget(dirname(target), realCarriageWriteFs);
  if (targetState.kind === 'failure') {
    return { written: [], pruned: [], refused: [targetState.message] };
  }
  if (targetState.value === 'foreign') {
    return { written: [], pruned: [], refused: [foreignTargetRefusal(dirname(target))] };
  }
  // Carriage next: a refused sync (canonical symlink, seam read failure)
  // refuses the whole skill on this surface — not even the adapter stub is
  // written over a state the run could not fully observe.
  const carriage = await syncCarriage(
    dirname(parsed.canonicalPath),
    dirname(target),
    realCarriageWriteFs,
  );
  if (carriage.refused.length > 0) {
    return { written: [], pruned: [], refused: carriage.refused };
  }
  const fileContent = renderAdapter(parsed, options.prefix, surface);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, fileContent, 'utf8');
  return { written: [target, ...carriage.carried], pruned: carriage.pruned, refused: [] };
}

/**
 * A skipped directory means a canonical the generator could not read —
 * content sitting in the corpus that no harness can summon. A duplicate
 * leaf id means two canonicals contending for one flat adapter name. A
 * refusal means a canonical symlink or a read failure stopped a skill's
 * emission. All three states must fail loudly rather than ride a warning
 * line to a zero exit (which is how an unsummonable corpus stays silently
 * green).
 */
export function generateExitCode(outcome: GenerateOutcome): number {
  return outcome.skipped.length > 0 || outcome.duplicates.length > 0 || outcome.refused.length > 0
    ? 1
    : 0;
}
