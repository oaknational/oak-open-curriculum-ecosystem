import type { Result } from '@oaknational/result';

import { printable } from '../pr-watch/printable.js';

import type { MergeArgs } from './merge-args.js';
import type { MergeOutcome } from './merge.js';

/**
 * What `merge-bot merge` SAYS: progress lines, the verdict evidence, and the
 * terminal exit map (0 merged, 1 operational failure, 3 typed refusal). Split
 * from `merge-cli.ts` at the seam that file already records for `merge-args`
 * — the loop decides, this file speaks — so both stay inside the size gates.
 *
 * Under `--json`, stdout carries EXACTLY the outcome object a machine parses;
 * progress and grounds are diagnostics and go to stderr. A refusal raised
 * before the pull request is read has the same keys, with `verdictState`
 * null and no evidence.
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

/**
 * The verdict evidence, printed line-per-ground (security H3: never silent),
 * each line made printable at this boundary: the grounds quote external text
 * (check names, run titles, review headlines) and the terminal obeys what it
 * is given (printable.ts).
 */
function writeEvidence(evidence: readonly string[], streams: MergeStreams): void {
  for (const line of evidence) {
    streams.stderr.write(`  grounds: ${printable(line)}\n`);
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

/**
 * A refusal raised before the pull request is read: every key of the
 * command's refusal, and no verdict, because none was read.
 */
type RefusalBeforeReading = Omit<Extract<MergeOutcome, { kind: 'refused' }>, 'verdictState'> & {
  readonly verdictState: null;
};

/**
 * Report what stopped the run before the pull request was read, and answer
 * with its exit code: 1 for an operational failure, 3 for a refusal. Under
 * `--json` a refusal puts its object on stdout, as every refusal of the
 * command does.
 *
 * @param stop - The exit code and what to say.
 * @param json - Whether stdout carries the outcome object.
 * @param streams - The two sinks.
 */
export function reportStopBeforeReading(
  stop: { readonly exit: 1 | 3; readonly message: string },
  json: boolean,
  streams: MergeStreams,
): number {
  if (stop.exit === 1) {
    streams.stderr.write(`merge-bot merge: ${stop.message}\n`);
    return 1;
  }
  if (json) {
    const refusal: RefusalBeforeReading = {
      kind: 'refused',
      reason: stop.message,
      verdictState: null,
      awaitsSettlement: false,
      evidence: [],
    };
    streams.stdout.write(`${JSON.stringify(refusal)}\n`);
  }
  streams.stderr.write(`merge-bot merge: refused: ${stop.message}\n`);
  return 3;
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
