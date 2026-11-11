/**
 * What `merge-bot push` reports: the outcome object a machine reads under
 * `--json` on stdout, and the operator's lines. Only a push and a typed
 * refusal print an outcome; an operational failure reports on stderr alone.
 */

/** The outcome a machine reads under --json. */
type PushOutcome =
  | { readonly kind: 'pushed'; readonly branch: string; readonly remote: string }
  | { readonly kind: 'refused'; readonly reason: string };

/** The two streams the push reports on. */
interface PushStreams {
  readonly stdout: Pick<NodeJS.WriteStream, 'write'>;
  readonly stderr: Pick<NodeJS.WriteStream, 'write'>;
}

/** Report a typed refusal: the outcome under --json, and the reason on stderr either way. */
export function writeRefusal(reason: string, json: boolean, streams: PushStreams): void {
  if (json) {
    streams.stdout.write(`${JSON.stringify({ kind: 'refused', reason } satisfies PushOutcome)}\n`);
  }
  streams.stderr.write(`merge-bot push: refused: ${reason}\n`);
}

/** Report a landed push: the outcome under --json, a line otherwise. */
export function writePushed(
  outcome: Extract<PushOutcome, { kind: 'pushed' }>,
  json: boolean,
  streams: PushStreams,
): void {
  if (json) {
    streams.stdout.write(`${JSON.stringify(outcome)}\n`);
    return;
  }
  streams.stdout.write(`pushed: ${outcome.branch} to ${outcome.remote}\n`);
}
