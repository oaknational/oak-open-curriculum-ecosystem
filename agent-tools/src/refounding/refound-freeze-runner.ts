import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { err, isErr, ok, type Result } from '@oaknational/result';

import {
  classifyInventoryMode,
  countLines,
  renderJsonArtefact,
  sha256Hex,
  type Denominator,
  type FreezeIdentityEntry,
} from './refounding-artefacts.js';
import {
  buildDenominator,
  DENOMINATOR_BASENAME,
  IDENTITY_PROOF_SEGMENT,
  resolveCopySink,
  sortStatsByPath,
  type FrozenFileStat,
} from './refound-freeze-helpers.js';
import { prepareFreeze, type FreezePlan, type RunFreezeInput } from './refound-freeze-plan.js';
import { failWithCleanup, type FreezeWrites } from './refound-freeze-rollback.js';

/**
 * The copy/self-check/write phase of `refound-freeze` (F1 §5 row 1, §6
 * layer 1).
 *
 * @remarks
 * The freeze is the run's single conservation event: after the pre-copy
 * phase (`refound-freeze-plan.ts`) proves the run refusal-free, this module
 * copies every `in` file byte-verbatim under `archive/frozen-v1/`, re-runs
 * the secret scan over the FROZEN COPIES (closing the scan→copy TOCTOU
 * window), re-hashes every copy against its source (the self-check), and
 * writes the denominator plus the freeze-identity proof. Every stage failure
 * is a typed `Result` error — filesystem throws are translated at each stage
 * boundary — and any failure after copying begins triggers a rollback so no
 * ambiguous partial state remains; if the rollback itself fails, a
 * `frozen-v1.PARTIAL` marker is left so the next run's refusal chain names
 * the residue instead of mistaking it for a completed freeze.
 *
 * The secret scan is an injectable seam so unit tests never invoke the real
 * scanner; the production implementation (gitleaks in no-git `dir` mode)
 * lives in the entry point.
 *
 * @packageDocumentation
 */

/** What the freeze accomplished, for the entry's operator summary. */
export interface FreezeSummary {
  readonly fileCount: number;
  readonly totalBytes: number;
  readonly totalLines: number;
}

const asMessage = (cause: unknown): string =>
  cause instanceof Error ? cause.message : String(cause);

/**
 * Copy every source byte-verbatim to its frozen mirror, capturing each
 * file's identity (hash, LF-count, inventory mode) in the same pass.
 * Filesystem failures are returned, never thrown.
 */
async function copyInSet(
  input: RunFreezeInput,
  plan: FreezePlan,
  wrote: FreezeWrites,
): Promise<Result<readonly FrozenFileStat[], Error>> {
  const writeCopyFile =
    input.writeCopyFile ??
    ((absFilePath: string, bytes: Uint8Array) => writeFile(absFilePath, bytes));
  const stats: FrozenFileStat[] = [];
  try {
    for (const [sourcePath, frozenPath] of plan.pathMap) {
      const copySink = resolveCopySink(plan.frozenRootAbs, frozenPath);
      if (isErr(copySink)) {
        return copySink;
      }
      const sourceBytes = await readFile(path.join(input.repoRoot, sourcePath));
      wrote.frozenTree = true;
      await mkdir(path.dirname(copySink.value), { recursive: true });
      await writeCopyFile(copySink.value, sourceBytes);
      stats.push({
        path: frozenPath,
        bytes: sourceBytes.length,
        sha256: sha256Hex(sourceBytes),
        lines: countLines(sourceBytes),
        inventoryMode: classifyInventoryMode(frozenPath, sourceBytes),
      });
    }
  } catch (error: unknown) {
    return err(new Error(`freeze copy phase failed: ${asMessage(error)}`));
  }
  return ok(stats);
}

/**
 * The freeze-time self-check (F1 §5): re-hash every copy against its
 * source's hash, building the identity-proof entries; any mismatch or
 * unreadable copy refuses before any artefact JSON is written.
 */
async function buildIdentityProof(
  sortedStats: readonly FrozenFileStat[],
  frozenRootAbs: string,
): Promise<Result<readonly FreezeIdentityEntry[], Error>> {
  const entries: FreezeIdentityEntry[] = [];
  const mismatches: string[] = [];
  try {
    for (const stat of sortedStats) {
      const copyBytes = await readFile(path.join(frozenRootAbs, stat.path));
      const copySha256 = sha256Hex(copyBytes);
      entries.push({
        path: stat.path,
        source_sha256: stat.sha256,
        copy_sha256: copySha256,
        bytes: stat.bytes,
      });
      if (copySha256 !== stat.sha256) {
        mismatches.push(stat.path);
      }
    }
  } catch (error: unknown) {
    return err(new Error(`freeze self-check could not re-read a copy: ${asMessage(error)}`));
  }
  if (mismatches.length > 0) {
    return err(
      new Error(
        `freeze self-check failed; copy hash differs from source for: ${mismatches.join(', ')}`,
      ),
    );
  }
  return ok(entries);
}

/**
 * Write the denominator and identity-proof artefacts under the artefact
 * home. Directory creation is deferred to the run itself — the entry never
 * mkdirs, so a refused run leaves no trace of a fresh `--out` directory.
 */
async function writeArtefacts(
  input: {
    readonly outDirAbs: string;
    readonly denominator: Denominator;
    readonly identityEntries: readonly FreezeIdentityEntry[];
  },
  wrote: FreezeWrites,
): Promise<Result<void, Error>> {
  try {
    await mkdir(input.outDirAbs, { recursive: true });
    wrote.denominator = true;
    await writeFile(
      path.join(input.outDirAbs, DENOMINATOR_BASENAME),
      renderJsonArtefact(input.denominator),
      'utf8',
    );
    const proofAbsPath = path.join(input.outDirAbs, IDENTITY_PROOF_SEGMENT);
    await mkdir(path.dirname(proofAbsPath), { recursive: true });
    wrote.identityProof = true;
    await writeFile(proofAbsPath, renderJsonArtefact(input.identityEntries), 'utf8');
  } catch (error: unknown) {
    return err(new Error(`freeze artefact write failed: ${asMessage(error)}`));
  }
  return ok(undefined);
}

/**
 * Post-copy phase: re-scan the FROZEN COPIES (the TOCTOU cure — the sources
 * were scanned before copying; this proves the bytes that actually landed
 * are also clean), then self-check, then write the artefacts.
 */
async function finaliseFreeze(
  input: RunFreezeInput,
  plan: FreezePlan,
  sortedStats: readonly FrozenFileStat[],
  wrote: FreezeWrites,
): Promise<Result<FreezeSummary, Error>> {
  const frozenAbsPaths = sortedStats.map((stat) => path.join(plan.frozenRootAbs, stat.path));
  const rescanVerdict = await input.secretScan(frozenAbsPaths);
  if (isErr(rescanVerdict)) {
    return err(
      new Error(
        `refusing to finalise; post-copy scan of the frozen copies: ${rescanVerdict.error.message}`,
      ),
    );
  }
  const identityEntries = await buildIdentityProof(sortedStats, plan.frozenRootAbs);
  if (isErr(identityEntries)) {
    return identityEntries;
  }
  const denominator = buildDenominator({
    freezeRuleVersion: plan.freezeRuleVersion,
    ratifiedBy: plan.ratifiedBy,
    files: sortedStats,
  });
  const artefactsWritten = await writeArtefacts(
    {
      outDirAbs: input.outDirAbs,
      denominator,
      identityEntries: identityEntries.value,
    },
    wrote,
  );
  if (isErr(artefactsWritten)) {
    return artefactsWritten;
  }
  return ok({
    fileCount: denominator.totals.files,
    totalBytes: denominator.totals.bytes,
    totalLines: denominator.totals.lines,
  });
}

/**
 * Execute the freeze (F1 §5 row 1): refusals first — including the secret
 * scan over the FULL source set BEFORE any copy (F1 §8.3) — then
 * byte-verbatim copies, a second scan over the frozen copies, the self-check
 * re-hash, and the denominator plus identity-proof artefacts. Any failure
 * after copying begins rolls the partial freeze back.
 */
export async function runFreeze(input: RunFreezeInput): Promise<Result<FreezeSummary, Error>> {
  const plan = await prepareFreeze(input);
  if (isErr(plan)) {
    return plan;
  }
  const wrote: FreezeWrites = { frozenTree: false, denominator: false, identityProof: false };
  const stats = await copyInSet(input, plan.value, wrote);
  const outcome = isErr(stats)
    ? stats
    : await finaliseFreeze(input, plan.value, sortStatsByPath(stats.value), wrote);
  if (isErr(outcome)) {
    return failWithCleanup(input.outDirAbs, plan.value.frozenRootAbs, wrote, outcome.error);
  }
  return outcome;
}
