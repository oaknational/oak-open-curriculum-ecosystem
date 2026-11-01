import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { err, isErr, ok, type Result } from '@oaknational/result';
import { glob } from 'tinyglobby';

import { type FreezeRule } from './freeze-rule-schema.js';
import {
  classifyInventoryMode,
  compareByCodeUnit,
  renderJsonlArtefact,
} from './refounding-artefacts.js';
import { findEscapingMatches, INSTRUMENT_EXCLUDE_GLOBS } from './refound-freeze-helpers.js';
import { readRule } from './refound-freeze-plan.js';
import {
  buildSweepHits,
  sortSweepHits,
  SWEEP_HITS_SEGMENT,
  type SweepHit,
} from './refound-sweep-model.js';

/**
 * The IO orchestration of `refound-sweep` (F1 §5 row `refound-sweep`):
 * enumerate the ratified rule's `sweep`-verdict classes over the LIVE tree
 * (sweep surfaces are live, not frozen), run the marker net over every
 * non-binary matched file, and write `sweep/sweep-hits.v1.jsonl`.
 *
 * Refusals before anything is written: an unratified rule (acting on a
 * draft is the freeze's own posture), rule globs that escape the
 * repository, and a sweep set matching no files (a mis-run, not an empty
 * queue). The instrument's own homes are excluded from the scan BY
 * CONSTRUCTION (F1 §8.4) — even a covering glob never scans
 * `.agent/plans-refounding/**` or `agent-tools/src/refounding/**`.
 *
 * @packageDocumentation
 */

/** What the sweep scanned and found, for the entry's operator summary. */
export interface SweepSummary {
  readonly scannedFiles: number;
  readonly hits: number;
}

/**
 * Enumerate the rule's `sweep` classes from the live tree: sorted
 * repo-relative POSIX paths, instrument homes excluded by construction,
 * escaping matches refused.
 */
export async function enumerateSweepFiles(
  rule: FreezeRule,
  repoRoot: string,
): Promise<Result<readonly string[], Error>> {
  const patterns = rule.classes
    .filter((ruleClass) => ruleClass.verdict === 'sweep')
    .flatMap((ruleClass) => [...ruleClass.globs]);
  if (patterns.length === 0) {
    return err(new Error("the freeze rule declares no 'sweep' classes; refusing a mis-run"));
  }
  const matches = await glob(patterns, {
    cwd: repoRoot,
    dot: true,
    ignore: [...INSTRUMENT_EXCLUDE_GLOBS],
  });
  const escaping = findEscapingMatches(matches);
  if (escaping.length > 0) {
    return err(
      new Error(
        `sweep-class globs matched paths outside the repository (absolute or containing '..'): ` +
          `${escaping.slice(0, 5).join(', ')} — a ratified rule cannot grant out-of-repo reach`,
      ),
    );
  }
  if (matches.length === 0) {
    return err(new Error("no files matched the freeze rule's 'sweep' classes; refusing a mis-run"));
  }
  return ok([...matches].sort(compareByCodeUnit));
}

/**
 * Run the marker net over `relPaths` under `rootAbs`, skipping binary files
 * (null-byte sniff — matching markers inside opaque bytes would be noise,
 * and opaque files conserve by byte-identity anyway).
 */
export async function scanSweepFiles(input: {
  readonly rootAbs: string;
  readonly relPaths: readonly string[];
}): Promise<Result<{ readonly hits: readonly SweepHit[]; readonly scannedFiles: number }, Error>> {
  const hits: SweepHit[] = [];
  let scannedFiles = 0;
  for (const relPath of input.relPaths) {
    let bytes: Buffer;
    try {
      bytes = await readFile(path.join(input.rootAbs, relPath));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return err(new Error(`cannot read sweep surface '${relPath}': ${message}`));
    }
    if (classifyInventoryMode(relPath, bytes) === 'opaque') {
      continue;
    }
    scannedFiles += 1;
    hits.push(...buildSweepHits(relPath, bytes));
  }
  return ok({ hits: sortSweepHits(hits), scannedFiles });
}

/**
 * Execute the sweep: ratified rule in, `sweep/sweep-hits.v1.jsonl` out.
 * Hits are an adjudication queue — a hit-bearing run SUCCEEDS; only
 * infrastructure failures and refusals are errors.
 */
export async function runSweep(input: {
  readonly repoRoot: string;
  readonly ruleAbsPath: string;
  readonly outDirAbs: string;
}): Promise<Result<SweepSummary, Error>> {
  const rule = await readRule(input.ruleAbsPath);
  if (isErr(rule)) {
    return rule;
  }
  if (rule.value.ratifiedBy === null) {
    return err(
      new Error(
        'freeze rule is unratified; the sweep marker set freezes at G1 and a draft-rule ' +
          'queue would mislead adjudication',
      ),
    );
  }
  const relPaths = await enumerateSweepFiles(rule.value, input.repoRoot);
  if (isErr(relPaths)) {
    return relPaths;
  }
  const scan = await scanSweepFiles({ rootAbs: input.repoRoot, relPaths: relPaths.value });
  if (isErr(scan)) {
    return scan;
  }
  const hitsAbsPath = path.join(input.outDirAbs, SWEEP_HITS_SEGMENT);
  try {
    await mkdir(path.dirname(hitsAbsPath), { recursive: true });
    await writeFile(hitsAbsPath, renderJsonlArtefact(scan.value.hits), 'utf8');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return err(new Error(`sweep artefact write failed: ${message}`));
  }
  return ok({ scannedFiles: scan.value.scannedFiles, hits: scan.value.hits.length });
}
