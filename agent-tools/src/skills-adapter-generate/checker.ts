/**
 * Skills adapter drift checker.
 *
 * Generates adapter content in memory and compares it bytewise against the
 * on-disk adapters, and compares every carried supporting file (`scripts/`,
 * `references/`, `assets/` — see `carriage.ts`) bytewise (plus executable
 * bit) against its canonical source. Read-only. Used by
 * `skills-adapter-generate --check` to gate CI / pre-merge runs against
 * drift between canonical sources and their generated projections.
 *
 * Discovery is shared with the generator ({@link discoverCanonicals}) so the
 * checker walks exactly the corpus the generator would emit — flat
 * individuals, concern-tier members, and domain-tier members alike. I/O is
 * injected through the {@link CheckerFs} seam so unit tests can pass a
 * deterministic in-memory map without touching the real filesystem.
 */
import { readFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import {
  checkCarriage,
  countCarriedFiles,
  realCarriageReadFs,
  type CarriageReadFs,
} from './carriage.js';
import { classifyEmissionTarget, foreignTargetRefusal } from './emission-target.js';
import { allSurfaceRootFailures } from './surface-roots.js';
import {
  adapterTargetPath,
  discoverCanonicals,
  renderAdapter,
  type AdapterSurface,
  type DiscoveryFs,
  type GeneratorOptions,
  type ParsedCanonicalSkill,
} from './generator.js';
import { findStaleProjectionEntries, isDiscoveryComplete } from './projection-roots.js';

const SURFACES: readonly AdapterSurface[] = ['claude', 'agents'];

export interface CheckOutcome {
  readonly drifted: readonly string[];
  readonly missing: readonly string[];
  /** Projection files whose canonical source is gone — a failing state: a
   * copy without a source serves content nobody authors any more. The
   * generator run prunes these; the checker only reports them. */
  readonly orphaned: readonly string[];
  /** Leaf ids contending for one flat adapter name — a failing state: the
   * on-disk adapter can only match one claimant, silently shadowing the
   * other. Mirrors the generator's emission refusal. */
  readonly duplicates: readonly string[];
  /** Directories discovery walked past without producing a canonical — a
   * failing state in check mode exactly as in generate mode: a skipped
   * directory is content no harness can summon, and a checker that stays
   * green over it certifies an incomplete corpus (worked instance: nine
   * canonicals sat unsummonable on main behind a green `--check`). */
  readonly skipped: readonly string[];
  /** Refusals — canonical-side symlinks and seam read failures. A failing
   * state that also means the other streams are not a complete verdict:
   * the checker refuses to certify what it could not fully observe. */
  readonly refused: readonly string[];
  /** Practice projections (recognised by their class marker) whose
   * recorded canonical is gone or renamed, or whose directory name is no
   * longer the canonical's projection name — a failing state: the stale
   * copy would otherwise outlive its source with both surfaces reporting
   * success. A generator run removes these. Entries without the marker
   * are not ours and are never enumerated (see `projection-roots.ts`). */
  readonly stale: readonly string[];
  /** How many canonicals discovery produced. Zero is never a healthy estate
   * state — it means a missing or unreadable `.agent/skills` root (the
   * injected fs collapses read errors to empty lists), and check mode must
   * refuse rather than certify an empty corpus as up to date. */
  readonly canonicalCount: number;
  /** How many carried supporting files the canonical corpus declares (per
   * skill, before the ×2 surface fan-out). Reported so a run over the live
   * estate proves the whole carried set was compared — a silent subset
   * would show up as a wrong count, not a green lie. */
  readonly carriedFileCount: number;
}

export type CheckerFs = CarriageReadFs & Pick<DiscoveryFs, 'readFileOrUndefined'>;

/** The real-filesystem checker binding — exported so integration tests can
 * wrap it, overriding a single facet while every other read stays real. */
export const defaultCheckerFs: CheckerFs = {
  ...realCarriageReadFs,
  async readFileOrUndefined(path) {
    try {
      return await readFile(path, 'utf8');
    } catch {
      return undefined;
    }
  },
};

/**
 * Bridge the checker's seam onto discovery's, which keeps its own
 * documented collapse-to-empty error semantic (an unreadable skills root
 * reads as zero canonicals, and the zero-canonical refusal downstream is
 * the loud stop for that state).
 */
function asDiscoveryFs(fs: CheckerFs): DiscoveryFs {
  return {
    readFileOrUndefined: (path) => fs.readFileOrUndefined(path),
    async listSubdirectoryNames(path) {
      const listed = await fs.listSubdirectoryNames(path);
      return listed.kind === 'ok' ? listed.value : [];
    },
  };
}

interface CheckStreams {
  readonly drifted: string[];
  readonly missing: string[];
  readonly orphaned: string[];
  readonly refused: string[];
}

export async function checkAdapters(
  options: GeneratorOptions,
  fs: CheckerFs = defaultCheckerFs,
): Promise<CheckOutcome> {
  const streams: CheckStreams = { drifted: [], missing: [], orphaned: [], refused: [] };
  let carriedFileCount = 0;
  const discovery = await discoverCanonicals(options.repoRoot, asDiscoveryFs(fs));

  // Surface-root guard FIRST — before any per-canonical read: a symlinked
  // root or ancestor would otherwise let the name-addressed target reads
  // below resolve (and byte-compare) files outside the repository, leaking
  // external structure into the verdict streams. Generate short-circuits
  // emission on the same failure via the sweep; check makes the guard
  // structural rather than incidental-to-ordering.
  const rootFailures = await allSurfaceRootFailures(options.repoRoot, (p) => fs.resolveRealPath(p));
  if (rootFailures.length > 0) {
    return refusedOutcome(discovery, rootFailures);
  }

  for (const parsed of discovery.canonicals) {
    await checkOneCanonical(parsed, options, fs, streams);
    // Counted once per skill: the carried set is per-canonical; the surface
    // fan-out above compared its ×2 projection.
    carriedFileCount += await countCarriedFiles(dirname(parsed.canonicalPath), fs);
  }

  const stale = await computeStale(discovery, options, fs, streams);

  return {
    ...streams,
    duplicates: discovery.duplicates,
    skipped: discovery.skipped,
    stale,
    canonicalCount: discovery.canonicals.length,
    carriedFileCount,
  };
}

/**
 * Staleness is judged ONLY against a COMPLETE discovery: a skipped
 * directory means the expected-projection set is not fully known (an
 * unreadable canonical reads as absent there), so a skipped skill's
 * projection must never be reported stale. The skipped stream itself
 * already fails the check. Sweep failures ride `streams.refused`.
 */
async function computeStale(
  discovery: Awaited<ReturnType<typeof discoverCanonicals>>,
  options: GeneratorOptions,
  fs: CheckerFs,
  streams: CheckStreams,
): Promise<readonly string[]> {
  if (!isDiscoveryComplete(discovery)) {
    return [];
  }
  const sweep = await findStaleProjectionEntries({
    repoRoot: options.repoRoot,
    projections: discovery.canonicals.map((parsed) => ({
      canonicalRef: `${parsed.relativeDir}/${parsed.canonicalFilename}`,
      expectedName: `${options.prefix}${parsed.id}`,
    })),
    fs,
  });
  streams.refused.push(...sweep.failures);
  return sweep.stale;
}

/** The check outcome when the surface-root guard refuses: nothing was
 * read, so every content stream is empty and the failures ride
 * `refused`. */
function refusedOutcome(
  discovery: Awaited<ReturnType<typeof discoverCanonicals>>,
  rootFailures: readonly string[],
): CheckOutcome {
  return {
    drifted: [],
    missing: [],
    orphaned: [],
    refused: rootFailures,
    duplicates: discovery.duplicates,
    skipped: discovery.skipped,
    stale: [],
    canonicalCount: discovery.canonicals.length,
    carriedFileCount: 0,
  };
}

async function checkOneCanonical(
  parsed: ParsedCanonicalSkill,
  options: GeneratorOptions,
  fs: CheckerFs,
  streams: CheckStreams,
): Promise<void> {
  const canonicalDir = dirname(parsed.canonicalPath);
  for (const surface of SURFACES) {
    const target = adapterTargetPath(options.repoRoot, options.prefix, parsed.id, surface);
    // Target guard mirrors the generator's: a name-addressed check must
    // not adjudicate a foreign occupant of the expected name (its content
    // would read as "drifted"/"orphaned", inviting an overwrite) nor read
    // byte comparisons through a symlink. Foreign occupant → refusal.
    const targetState = await classifyEmissionTarget(dirname(target), fs);
    if (targetState.kind === 'failure') {
      streams.refused.push(targetState.message);
      continue;
    }
    if (targetState.value === 'foreign') {
      streams.refused.push(foreignTargetRefusal(dirname(target)));
      continue;
    }
    const expected = renderAdapter(parsed, options.prefix, surface);
    const actual = await fs.readFileOrUndefined(target);
    if (actual === undefined) {
      streams.missing.push(target);
    } else if (actual !== expected) {
      streams.drifted.push(target);
    }

    const carriage = await checkCarriage(canonicalDir, dirname(target), fs);
    streams.missing.push(...carriage.missing);
    streams.drifted.push(...carriage.drifted);
    streams.orphaned.push(...carriage.orphaned);
    streams.refused.push(...carriage.refused);
  }
}
