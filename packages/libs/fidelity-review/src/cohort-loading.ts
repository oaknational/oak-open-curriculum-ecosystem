/*
 * Loading the capture manifest into a trusted cohort: read, parse,
 * reconcile against the declared pairs, and hash-verify the canonical
 * bytes — the reader half of the evidence-integrity keystone. The
 * orchestrator calls this before ANY report assembly; every refusal
 * names its cure. Io arrives structurally so tests stay fake-driven.
 */
import { err, type Result } from '@oaknational/result';

import {
  CaptureManifestSchema,
  reconcileCohort,
  verifyCohortEvidence,
  type CohortMeta,
  type ExpectedPair,
} from './capture-manifest';
import { describeThrown } from './support';

interface CohortIo {
  readonly readManifest: () => Result<string | undefined, string>;
  readonly exists: (demoRelativePath: string) => boolean;
  readonly read: (demoRelativePath: string) => Result<Buffer, string>;
}

/** Load, parse, reconcile, and verify the capture manifest against the
 *  declared pairs — the report's provenance comes from HERE, never from
 *  the current invocation's flags (a report-only run without the
 *  capture's width previously wrote current flags as truth). */
export function loadReconciledCohort(
  expected: readonly ExpectedPair[],
  io: CohortIo,
): Result<CohortMeta, string> {
  const raw = io.readManifest();
  if (!raw.ok) {
    return err(`fidelity: ${raw.error}`);
  }
  if (raw.value === undefined) {
    return err(
      'fidelity: no capture manifest — no completed capture has promoted evidence; run a full capture before report-only',
    );
  }
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw.value);
  } catch (error: unknown) {
    return err(`fidelity: capture manifest is not JSON — ${describeThrown(error)}`);
  }
  const parsed = CaptureManifestSchema.safeParse(parsedJson);
  if (!parsed.success) {
    return err(`fidelity: capture manifest invalid — ${parsed.error.message}`);
  }
  const cohort = reconcileCohort(parsed.data, expected);
  if (!cohort.ok) {
    return err(`fidelity: ${cohort.error}`);
  }
  const verified = verifyCohortEvidence(parsed.data, io);
  if (!verified.ok) {
    return err(`fidelity: ${verified.error}`);
  }
  return cohort;
}
