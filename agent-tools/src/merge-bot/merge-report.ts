import type { Result } from '@oaknational/result';

import type { MergeArgs } from './merge-args.js';
import type { MergeOutcome } from './merge.js';

/**
 * What `merge-bot merge` SAYS: progress lines, the verdict evidence, and the
 * terminal exit map (0 merged, 1 operational failure, 3 typed refusal). Split
 * from `merge-cli.ts` at the seam that file already records for `merge-args`
 * — the loop decides, this file speaks — so both stay inside the size gates.
 *
 * Under `--json`, stdout carries EXACTLY the outcome object a machine parses;
 * progress and grounds are diagnostics and go to stderr.
 */

/** The two sinks the reporter writes to; `MergeActionInput` satisfies it structurally. */
export interface MergeStreams {
  readonly stdout: Pick<NodeJS.WriteStream, 'write'>;
  readonly stderr: Pick<NodeJS.WriteStream, 'write'>;
}

export function writeProgress(
  parsed: MergeArgs,
  poll: number,
  verdictState: string,
  streams: MergeStreams,
): void {
  const progress = parsed.json ? streams.stderr : streams.stdout;
  progress.write(
    `poll ${poll}/${parsed.maxPolls}: ${verdictState} — retrying in ${parsed.intervalSeconds}s\n`,
  );
}

/** The verdict evidence, printed line-per-ground (security H3: never silent). */
function writeEvidence(evidence: readonly string[], streams: MergeStreams): void {
  for (const line of evidence) {
    streams.stderr.write(`  grounds: ${line}\n`);
  }
}

function writeMerged(
  outcome: Extract<MergeOutcome, { kind: 'merged' }>,
  json: boolean,
  streams: MergeStreams,
): void {
  if (json) {
    streams.stdout.write(`${JSON.stringify(outcome)}\n`);
    return;
  }
  streams.stdout.write(`merged: merge commit ${outcome.sha}\n`);
  writeEvidence(outcome.evidence, streams);
}

function writeRefusal(
  outcome: Extract<MergeOutcome, { kind: 'refused' }>,
  json: boolean,
  streams: MergeStreams,
): void {
  if (json) {
    streams.stdout.write(`${JSON.stringify(outcome)}\n`);
  }
  streams.stderr.write(`merge-bot merge: refused: ${outcome.reason}\n`);
  writeEvidence(outcome.evidence, streams);
}

/** Report a TERMINAL poll outcome and answer with its exit code. */
export function reportOutcome(
  outcome: Result<MergeOutcome, Error>,
  parsed: MergeArgs,
  streams: MergeStreams,
): number {
  if (!outcome.ok) {
    streams.stderr.write(`merge-bot merge: ${outcome.error.message}\n`);
    return 1;
  }
  if (outcome.value.kind === 'merged') {
    writeMerged(outcome.value, parsed.json, streams);
    return 0;
  }
  writeRefusal(outcome.value, parsed.json, streams);
  return 3;
}
