import { access, lstat, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import { err, isErr, ok, type Result } from '@oaknational/result';

import { parseFreezeRule, type FreezeRule } from './freeze-rule-schema.js';
import { parseJsonDocument } from './refounding-artefacts.js';
import {
  DENOMINATOR_BASENAME,
  FROZEN_TREE_SEGMENT,
  IDENTITY_PROOF_SEGMENT,
  mapSourcesToFrozen,
  type SecretScan,
} from './refound-freeze-helpers.js';
import { enumerateInSet } from './refound-in-set.js';

/**
 * The pre-copy phase of `refound-freeze` (F1 §5 row 1, §8.3): read and parse
 * the rule, apply the refusals, enumerate and map the `in` set, and run the
 * secret scan over the FULL source set — all BEFORE any copy is written. The
 * copy/self-check/write phase lives in the sibling
 * `refound-freeze-runner.ts`.
 *
 * @packageDocumentation
 */

/** Inputs for the freeze run; all paths absolute, resolved by the entry. */
export interface RunFreezeInput {
  readonly repoRoot: string;
  readonly ruleAbsPath: string;
  readonly outDirAbs: string;
  readonly secretScan: SecretScan;
  /**
   * Copy-write seam (defaults to `node:fs/promises` `writeFile`); tests
   * inject a failing writer to prove the rollback path leaves no partial
   * frozen state behind.
   */
  readonly writeCopyFile?: (absFilePath: string, bytes: Uint8Array) => Promise<void>;
}

/**
 * The marker a failed run leaves NEXT TO the frozen tree when rollback
 * itself failed — the refusal chain names it so a re-run cannot mistake
 * failed-run residue for a completed freeze.
 */
export function partialMarkerPath(frozenRootAbs: string): string {
  return `${frozenRootAbs}.PARTIAL`;
}

/** True when a path exists on disk (any kind). */
async function pathIsPresent(absPath: string): Promise<boolean> {
  try {
    await access(absPath);
    return true;
  } catch {
    return false;
  }
}

/** Everything the copy phase needs, proven refusal-free by {@link prepareFreeze}. */
export interface FreezePlan {
  readonly freezeRuleVersion: number;
  readonly ratifiedBy: string;
  readonly pathMap: ReadonlyMap<string, string>;
  readonly frozenRootAbs: string;
}

/**
 * Read and parse the rule document from disk as a `Result`. Shared with the
 * sweep and plant runners (`consolidate-at-second-consumer`) — every
 * consumer reads the rule through the same strict boundary.
 */
export async function readRule(ruleAbsPath: string): Promise<Result<FreezeRule, Error>> {
  let text: string;
  try {
    text = await readFile(ruleAbsPath, 'utf8');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return err(new Error(`cannot read freeze rule at '${ruleAbsPath}': ${message}`));
  }
  const json = parseJsonDocument('freeze rule', text);
  if (isErr(json)) {
    return json;
  }
  return parseFreezeRule(json.value);
}

/** True when the directory exists and contains at least one entry. */
async function isNonEmptyDir(absDir: string): Promise<boolean> {
  try {
    const entries = await readdir(absDir);
    return entries.length > 0;
  } catch {
    return false;
  }
}

/**
 * Refuse a symlink anywhere on the frozen-tree path below the artefact home
 * — copies must land through a real directory chain, never through a link
 * that could redirect them elsewhere.
 */
async function refuseSymlinkInChain(outDirAbs: string): Promise<Result<void, Error>> {
  let current = outDirAbs;
  for (const segment of FROZEN_TREE_SEGMENT.split('/')) {
    current = path.join(current, segment);
    let stats;
    try {
      stats = await lstat(current);
    } catch {
      continue;
    }
    if (stats.isSymbolicLink()) {
      return err(
        new Error(`'${current}' is a symlink; the frozen tree path must be a real directory chain`),
      );
    }
  }
  return ok(undefined);
}

/** True when artefact JSONs pre-exist but no frozen tree does (inconsistent state). */
async function hasArtefactsWithoutTree(outDirAbs: string, frozenRootAbs: string): Promise<boolean> {
  const artefactsPresent =
    (await pathIsPresent(path.join(outDirAbs, DENOMINATOR_BASENAME))) ||
    (await pathIsPresent(path.join(outDirAbs, IDENTITY_PROOF_SEGMENT)));
  if (!artefactsPresent) {
    return false;
  }
  return !(await isNonEmptyDir(frozenRootAbs));
}

/**
 * Apply the pre-copy refusals: unratified rule, failed-run residue, symlink
 * in the frozen-tree path, existing freeze, and artefacts stranded without a
 * tree (F1 D2, D3). The PARTIAL marker is checked before the non-empty check
 * so residue from a failed run is named as such, not mistaken for a
 * completed freeze.
 */
async function applyRefusals(
  rule: FreezeRule,
  outDirAbs: string,
  frozenRootAbs: string,
): Promise<Result<string, Error>> {
  if (rule.ratifiedBy === null) {
    return err(
      new Error(
        'freeze rule is unratified (ratifiedBy is null): initial ratification, or re-ratification of the pending amendment, must land first',
      ),
    );
  }
  if (await pathIsPresent(partialMarkerPath(frozenRootAbs))) {
    return err(
      new Error(
        'partial freeze detected (failed run residue); the residue was never second-scanned ' +
          'for secrets and must not be committed — remove the frozen tree and its .PARTIAL ' +
          'marker, then re-run',
      ),
    );
  }
  const symlinkVerdict = await refuseSymlinkInChain(outDirAbs);
  if (isErr(symlinkVerdict)) {
    return symlinkVerdict;
  }
  if (await isNonEmptyDir(frozenRootAbs)) {
    return err(new Error('a second freeze is a denominator amendment, not a re-freeze'));
  }
  if (await hasArtefactsWithoutTree(outDirAbs, frozenRootAbs)) {
    return err(
      new Error(
        'inconsistent prior state (artefacts without a frozen tree) — operator must ' +
          'reconcile; refusing to overwrite or delete',
      ),
    );
  }
  return ok(rule.ratifiedBy);
}

/**
 * Produce the {@link FreezePlan}, refusing (nothing written) on an
 * unratified rule, an existing freeze, an empty `in` set, a path collision,
 * or a secret-scan hit.
 */
export async function prepareFreeze(input: RunFreezeInput): Promise<Result<FreezePlan, Error>> {
  const rule = await readRule(input.ruleAbsPath);
  if (isErr(rule)) {
    return rule;
  }
  const frozenRootAbs = path.join(input.outDirAbs, FROZEN_TREE_SEGMENT);
  const ratifiedBy = await applyRefusals(rule.value, input.outDirAbs, frozenRootAbs);
  if (isErr(ratifiedBy)) {
    return ratifiedBy;
  }
  const sourcePaths = await enumerateInSet(rule.value, input.repoRoot);
  if (isErr(sourcePaths)) {
    return sourcePaths;
  }
  const pathMap = mapSourcesToFrozen(sourcePaths.value);
  if (isErr(pathMap)) {
    return pathMap;
  }
  const absSourcePaths = sourcePaths.value.map((relPath) => path.join(input.repoRoot, relPath));
  const scanVerdict = await input.secretScan(absSourcePaths);
  if (isErr(scanVerdict)) {
    return err(new Error(`refusing to freeze: ${scanVerdict.error.message}`));
  }
  return ok({
    freezeRuleVersion: rule.value.version,
    ratifiedBy: ratifiedBy.value,
    pathMap: pathMap.value,
    frozenRootAbs,
  });
}
