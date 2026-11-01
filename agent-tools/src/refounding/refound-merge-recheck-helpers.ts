import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { err, isErr, ok, type Result } from '@oaknational/result';
import { assertPathWithinBase } from '@oaknational/safe-path';
import { glob } from 'tinyglobby';

import { sanctionedWriterClasses, type FreezeRule } from './freeze-rule-schema.js';
import { renderJsonArtefact, sha256Hex, type DenominatorFile } from './refounding-artefacts.js';
import {
  findEscapingMatches,
  INSTRUMENT_EXCLUDE_GLOBS,
  mapSourcesToFrozen,
} from './refound-freeze-helpers.js';
import { readRule } from './refound-freeze-plan.js';
import { enumerateInSet } from './refound-in-set.js';
import {
  ARRIVALS_BASENAME,
  buildArrivalsReport,
  hasUnsanctionedArrivals,
  type ArrivalsReport,
  type LiveFileIdentity,
} from './refound-merge-recheck-model.js';
import { readEffectiveDenominator } from './refound-verify-freeze-helpers.js';

/**
 * The IO orchestration of `refound-merge-recheck` (F1 D4, §5, §7): recompute
 * the live source set per the ratified freeze rule (the IDENTICAL
 * enumeration the freeze used — instrument homes excluded by construction,
 * escaping globs refused), forward-map every live path into frozen
 * coordinates, hash the live bytes, classify deltas against the EFFECTIVE
 * denominator (`v1 + all amendments`), and write
 * `arrivals.v1.report.json`.
 *
 * Refusals — typed `Err`, nothing written: an unratified rule, a missing or
 * invalid denominator, any amendment lacking its identity proof, globs or
 * symlinks escaping the repository (every live file is re-anchored through
 * `assertPathWithinBase`, so a symlinked source pointing outside the repo is
 * a refusal, never a hash of foreign bytes), a frozen-path collision, and an
 * empty live in-set (a mis-run, not a mass deletion).
 *
 * The tool never routes anything: arrivals are the G3 table's queue, and a
 * sanctioned delta is reported, never auto-frozen (P2).
 *
 * @packageDocumentation
 */

/** What the recheck classified, for the entry's operator summary. */
export interface MergeRecheckSummary {
  readonly liveFiles: number;
  readonly added: number;
  readonly modified: number;
  readonly deleted: number;
  readonly sanctioned: number;
  readonly red: boolean;
}

/**
 * Hash every live in-set file, re-anchoring each path inside the repository
 * first — the freeze's glob-escape/symlink defences recur here (F1 §8.4).
 */
async function readLiveIdentities(input: {
  readonly repoRoot: string;
  readonly sourcePaths: readonly string[];
}): Promise<Result<readonly LiveFileIdentity[], Error>> {
  const pathMap = mapSourcesToFrozen(input.sourcePaths);
  if (isErr(pathMap)) {
    return pathMap;
  }
  const identities: LiveFileIdentity[] = [];
  for (const [sourcePath, frozenPath] of pathMap.value) {
    let liveAbsPath: string;
    try {
      liveAbsPath = assertPathWithinBase(path.join(input.repoRoot, sourcePath), input.repoRoot);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return err(new Error(`live in-set path '${sourcePath}' escapes the repository: ${message}`));
    }
    let bytes: Buffer;
    try {
      bytes = await readFile(liveAbsPath);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return err(new Error(`cannot read live in-set file '${sourcePath}': ${message}`));
    }
    identities.push({ sourcePath, frozenPath, sha256: sha256Hex(bytes) });
  }
  return ok(identities);
}

/**
 * Resolve which live source paths the rule's sanctioned-writer classes cover
 * (v2 rules; a v1 rule sanctions nothing): first matching class wins, in
 * rule order. Enumerated from the live tree with the same escape refusal and
 * instrument exclusions as every other net.
 */
async function mapSanctionedSources(
  rule: FreezeRule,
  repoRoot: string,
): Promise<Result<ReadonlyMap<string, string>, Error>> {
  const sanctionedBySource = new Map<string, string>();
  for (const writerClass of sanctionedWriterClasses(rule)) {
    const matches = await glob([...writerClass.globs], {
      cwd: repoRoot,
      dot: true,
      ignore: [...INSTRUMENT_EXCLUDE_GLOBS],
    });
    const escaping = findEscapingMatches(matches);
    if (escaping.length > 0) {
      return err(
        new Error(
          `sanctioned-writer class '${writerClass.id}' matched paths outside the repository ` +
            `(absolute or containing '..'): ${escaping.slice(0, 5).join(', ')}`,
        ),
      );
    }
    for (const match of matches) {
      if (!sanctionedBySource.has(match)) {
        sanctionedBySource.set(match, writerClass.id);
      }
    }
  }
  return ok(sanctionedBySource);
}

/** Everything the classification needs, proven refusal-free. */
interface RecheckInputs {
  readonly denominatorFiles: readonly DenominatorFile[];
  readonly liveFiles: readonly LiveFileIdentity[];
  readonly sanctionedClassBySource: ReadonlyMap<string, string>;
}

const UNRATIFIED_RULE_REFUSAL =
  'freeze rule is unratified (ratifiedBy is null — initial ratification or a pending ' +
  'amendment awaiting confirmation): the recheck recomputes the RATIFIED source rule, ' +
  'and a draft-rule comparison would misclassify arrivals';

/**
 * The read phase: ratified rule, effective denominator, live in-set
 * identities, and the sanctioned source map — every refusal happens here,
 * BEFORE anything is written.
 */
async function prepareRecheck(input: {
  readonly repoRoot: string;
  readonly ruleAbsPath: string;
  readonly outDirAbs: string;
}): Promise<Result<RecheckInputs, Error>> {
  const rule = await readRule(input.ruleAbsPath);
  if (isErr(rule)) {
    return rule;
  }
  if (rule.value.ratifiedBy === null) {
    return err(new Error(UNRATIFIED_RULE_REFUSAL));
  }
  const denominator = await readEffectiveDenominator(input.outDirAbs);
  if (isErr(denominator)) {
    return denominator;
  }
  const sourcePaths = await enumerateInSet(rule.value, input.repoRoot);
  if (isErr(sourcePaths)) {
    return sourcePaths;
  }
  if (sourcePaths.value.length === 0) {
    return err(
      new Error(
        'empty live in-set — mis-run, refusing: the ratified in-classes matched no live file; a ' +
          'mass deletion is still a non-empty in-set (nothing classified, nothing written)',
      ),
    );
  }
  const liveFiles = await readLiveIdentities({
    repoRoot: input.repoRoot,
    sourcePaths: sourcePaths.value,
  });
  if (isErr(liveFiles)) {
    return liveFiles;
  }
  const sanctionedClassBySource = await mapSanctionedSources(rule.value, input.repoRoot);
  if (isErr(sanctionedClassBySource)) {
    return sanctionedClassBySource;
  }
  return ok({
    denominatorFiles: denominator.value.files,
    liveFiles: liveFiles.value,
    sanctionedClassBySource: sanctionedClassBySource.value,
  });
}

/**
 * Execute the merge recheck: ratified rule + effective denominator in,
 * `arrivals.v1.report.json` out, every refusal BEFORE the write. Arrivals
 * are a RED summary, not an `Err` — the report is the routing queue and the
 * entry owns the exit code.
 */
export async function runMergeRecheck(input: {
  readonly repoRoot: string;
  readonly ruleAbsPath: string;
  readonly outDirAbs: string;
}): Promise<Result<MergeRecheckSummary, Error>> {
  const inputs = await prepareRecheck(input);
  if (isErr(inputs)) {
    return inputs;
  }
  const report = buildArrivalsReport(inputs.value);
  const written = await writeArrivalsReport(input.outDirAbs, report);
  if (isErr(written)) {
    return written;
  }
  return ok({
    liveFiles: report.totals.liveFiles,
    added: report.totals.added,
    modified: report.totals.modified,
    deleted: report.totals.deleted,
    sanctioned: report.totals.sanctioned,
    red: hasUnsanctionedArrivals(report),
  });
}

/** Write the report artefact; failures return as typed errors. */
async function writeArrivalsReport(
  outDirAbs: string,
  report: ArrivalsReport,
): Promise<Result<void, Error>> {
  try {
    await writeFile(path.join(outDirAbs, ARRIVALS_BASENAME), renderJsonArtefact(report), 'utf8');
    return ok(undefined);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return err(new Error(`arrivals report write failed: ${message}`));
  }
}
