/**
 * The outcome of `merge-bot pull-request`, one shape per verb plus the typed
 * refusal, and how it is written. Pure. The outcome is a closed union with
 * no credential field anywhere in it, so no token can reach either stream
 * through the report. Only a write that landed and a typed refusal print an
 * outcome; an operational failure reports on stderr alone, as the push
 * action does.
 */

/** What a verb did, as the outcome object a machine reads under `--json`. */
export type PullRequestOutcome =
  | { readonly kind: 'opened'; readonly number: number; readonly url: string }
  | {
      readonly kind: 'commented';
      readonly pr: number;
      readonly commentId: number;
      readonly url: string;
    }
  | {
      readonly kind: 'replied';
      readonly pr: number;
      readonly commentId: number;
      readonly url: string;
    }
  | { readonly kind: 'resolved'; readonly pr: number; readonly thread: string }
  | { readonly kind: 'ready'; readonly pr: number }
  | { readonly kind: 'closed'; readonly pr: number; readonly commentId: number }
  | { readonly kind: 'dispatched'; readonly workflow: string; readonly ref: string }
  | { readonly kind: 'refused'; readonly reason: string };

/** The outcome as the two streams carry it. */
export interface RenderedOutcome {
  readonly stdout: string;
  readonly stderr: string;
}

/** The operator's line for a write that landed. */
function doneLine(outcome: Exclude<PullRequestOutcome, { kind: 'refused' }>): string {
  if (outcome.kind === 'opened') {
    return `opened: draft pull request #${String(outcome.number)} ${outcome.url}`;
  }
  if (outcome.kind === 'commented' || outcome.kind === 'replied') {
    return `${outcome.kind}: #${String(outcome.pr)} comment ${String(outcome.commentId)} ${outcome.url}`;
  }
  if (outcome.kind === 'resolved') {
    return `resolved: #${String(outcome.pr)} thread ${outcome.thread}`;
  }
  if (outcome.kind === 'ready') {
    return `ready: #${String(outcome.pr)} is ready for review`;
  }
  if (outcome.kind === 'dispatched') {
    return `dispatched: ${outcome.workflow} on ${outcome.ref}`;
  }
  return `closed: #${String(outcome.pr)}, reason posted as comment ${String(outcome.commentId)}`;
}

/** Render the outcome: exactly the object on stdout under `--json`; otherwise a done line to stdout, a refusal to stderr. */
export function renderPullRequestOutcome(
  outcome: PullRequestOutcome,
  json: boolean,
): RenderedOutcome {
  if (outcome.kind === 'refused') {
    return {
      stdout: json ? `${JSON.stringify(outcome)}\n` : '',
      stderr: `merge-bot pull-request: refused: ${outcome.reason}\n`,
    };
  }
  return {
    stdout: json ? `${JSON.stringify(outcome)}\n` : `${doneLine(outcome)}\n`,
    stderr: '',
  };
}

/** 0 for a write that landed, 3 for a typed refusal. */
export function exitCodeFor(outcome: PullRequestOutcome): number {
  return outcome.kind === 'refused' ? 3 : 0;
}

interface Sinks {
  readonly stdout: Pick<NodeJS.WriteStream, 'write'>;
  readonly stderr: Pick<NodeJS.WriteStream, 'write'>;
}

/** Write the rendered outcome to the two streams. */
export function writePullRequestOutcome(
  outcome: PullRequestOutcome,
  json: boolean,
  sinks: Sinks,
): void {
  const rendered = renderPullRequestOutcome(outcome, json);
  if (rendered.stdout !== '') {
    sinks.stdout.write(rendered.stdout);
  }
  if (rendered.stderr !== '') {
    sinks.stderr.write(rendered.stderr);
  }
}
