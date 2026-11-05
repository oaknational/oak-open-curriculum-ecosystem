import path from 'node:path';

import { isErr, type Result } from '@oaknational/result';

import { SWEEP_HITS_SEGMENT } from './refound-sweep-model.js';
import { makeGitByteSource } from './refound-window-sample-git.js';
import {
  readBoundRule,
  readEvidenceBindings,
  readSweepHits,
  writeManifest,
} from './refound-window-sample-io.js';
import { buildWindowSample } from './refound-window-sample-model.js';
import { type WindowSampleManifest } from './refound-window-sample-schema.js';
import { type ByteSource } from './refound-window-sample-universe.js';
import { canonicaliseOutDir } from './refound-window-sample-write-guard.js';

/**
 * The IO orchestration of `refound-window-sample`: read the ratified rule,
 * the S1 evidence, and the verified hits queue, drive the pure computation
 * over the composition root's {@link ByteSource}, and write the
 * `sweep/window-sample.v1.json` manifest. The leaf IO refusals live in
 * `refound-window-sample-io.ts`.
 *
 * @remarks
 * Refusals BEFORE anything is written: an unratified rule (acting on a
 * draft is the freeze's own posture), a live rule whose bytes differ from
 * the rule at the pinned base, an evidence file without the expected
 * machine-readable counts or digests, a `--base` disagreeing with the
 * evidence's `runBaseSha`, a hits queue whose bytes miss the recorded
 * SHA-256, a malformed hits row, every arithmetic halt inside the model,
 * and a symlinked write dir or manifest path. The write phase runs only
 * after every refusal has passed — nothing written on halt.
 *
 * The byte source arrives through the {@link ByteSourceFactory} seam so the
 * composition root (`refound-window-sample.ts` `main()`) owns the wiring:
 * the git-backed production source lives in `refound-window-sample-git.ts`;
 * integration tests inject in-memory sources and never spawn a process.
 *
 * @packageDocumentation
 */

/** Default S1 deterministic-evidence location (the expectations carrier). */
export const DEFAULT_EVIDENCE_PATH =
  '.agent/plans-refounding/proofs/s1-deterministic-evidence.v1.json';

/** Builds the bytes-at-base source for one run (the composition root's seam). */
export type ByteSourceFactory = (repoRoot: string, baseSha: string) => ByteSource;

/** Everything {@link runWindowSample} needs, resolved and repo-constrained. */
export interface RunWindowSampleInput {
  readonly repoRoot: string;
  readonly ruleAbsPath: string;
  readonly outDirAbs: string;
  readonly evidenceAbsPath: string;
  readonly baseSha: string;
  /**
   * Byte-source factory the run reads the base commit through; the
   * composition root wires the git-backed {@link makeGitByteSource}, which
   * is also the default when omitted.
   */
  readonly makeByteSource?: ByteSourceFactory;
}

/**
 * Execute the batch-open computation: ratified rule (byte-bound to the
 * pinned base), evidence expectations, and verified hits in;
 * `sweep/window-sample.v1.json` out. Returns the written manifest for the
 * entry's operator summary; every refusal returns `Err` with nothing
 * written.
 */
export async function runWindowSample(
  input: RunWindowSampleInput,
): Promise<Result<WindowSampleManifest, Error>> {
  // Canonicalise the out dir BEFORE the potentially long scan; the write
  // boundary re-canonicalises against this baseline to close the TOCTOU window.
  const target = canonicaliseOutDir(input.repoRoot, input.outDirAbs);
  if (isErr(target)) {
    return target;
  }
  const makeByteSource = input.makeByteSource ?? makeGitByteSource;
  const source = makeByteSource(input.repoRoot, input.baseSha);
  const rule = await readBoundRule(input.repoRoot, input.ruleAbsPath, source);
  if (isErr(rule)) {
    return rule;
  }
  const bindings = await readEvidenceBindings(input.evidenceAbsPath, input.baseSha);
  if (isErr(bindings)) {
    return bindings;
  }
  const hits = await readSweepHits(
    path.join(input.outDirAbs, SWEEP_HITS_SEGMENT),
    bindings.value.sweepHitsSha256,
  );
  if (isErr(hits)) {
    return hits;
  }
  const manifest = buildWindowSample({
    source,
    rule: rule.value,
    hits: hits.value,
    expectations: bindings.value.expectations,
    baseSha: input.baseSha,
  });
  if (isErr(manifest)) {
    return manifest;
  }
  return writeManifest(target.value, manifest.value);
}
