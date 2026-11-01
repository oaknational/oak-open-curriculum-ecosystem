import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { err, isErr, ok, type Result } from '@oaknational/result';

import { prepareBaseline } from './refound-plant-orphan-baseline.js';
import { proveKeywordPlant, provePreamblePlant } from './refound-plant-orphan-proofs.js';
import { proveSweepPlant } from './refound-plant-orphan-sweep-proof.js';
import {
  buildDiscriminationTranscript,
  DISCRIMINATION_PROOF_SEGMENT,
  type PlantOrphanOutcome,
} from './refound-plant-orphan-transcript.js';

/**
 * The orchestration of `refound-plant-orphan` (F1 §9's discrimination proof
 * plus the plan-mandated marker-free sweep plant): derive the baseline, run
 * the three proofs on staged scratch copies (the frozen tree and the live
 * sweep surfaces are read, never written), and only when EVERY detector
 * fired write the committed transcript to
 * `proofs/orphan-discrimination.v1.md`.
 *
 * A failed proof returns a typed error naming the plant and writes NO
 * transcript — a discrimination proof that did not discriminate must never
 * look committed. Scratch copies are removed on every path (F1 §9 step 3).
 *
 * @packageDocumentation
 */

/** Write the transcript artefact; failures return as typed errors. */
async function writeTranscript(
  outDirAbs: string,
  outcome: PlantOrphanOutcome,
): Promise<Result<void, Error>> {
  const transcriptAbs = path.join(outDirAbs, DISCRIMINATION_PROOF_SEGMENT);
  try {
    await mkdir(path.dirname(transcriptAbs), { recursive: true });
    await writeFile(transcriptAbs, buildDiscriminationTranscript(outcome), 'utf8');
    return ok(undefined);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return err(new Error(`transcript write failed: ${message}`));
  }
}

/**
 * Execute all three discrimination proofs on staged scratch copies and
 * commit the transcript. Scratch copies are always removed; the frozen tree
 * and live surfaces are never written.
 */
export async function runPlantOrphan(input: {
  readonly repoRoot: string;
  readonly ruleAbsPath: string;
  readonly outDirAbs: string;
}): Promise<Result<PlantOrphanOutcome, Error>> {
  const scratchRoots: string[] = [];
  try {
    const baseline = await prepareBaseline({ outDirAbs: input.outDirAbs });
    if (isErr(baseline)) {
      return baseline;
    }
    const preamble = await provePreamblePlant(baseline.value, scratchRoots);
    if (isErr(preamble)) {
      return preamble;
    }
    const keyword = await proveKeywordPlant(baseline.value, scratchRoots);
    if (isErr(keyword)) {
      return keyword;
    }
    const sweep = await proveSweepPlant(input, scratchRoots);
    if (isErr(sweep)) {
      return sweep;
    }
    const outcome: PlantOrphanOutcome = {
      preamble: preamble.value,
      keyword: keyword.value,
      sweep: sweep.value,
    };
    const written = await writeTranscript(input.outDirAbs, outcome);
    if (isErr(written)) {
      return written;
    }
    return ok(outcome);
  } finally {
    await Promise.all(
      scratchRoots.map((root) => rm(root, { recursive: true, force: true }).catch(() => undefined)),
    );
  }
}
