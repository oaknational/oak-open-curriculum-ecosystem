/**
 * The bounded retry around the bot's push. GitHub refuses a push at the ref
 * advertisement, the first request git makes and before it runs the pre-push
 * hook, while the push's freshly minted installation token has not yet reached
 * every one of GitHub's edge caches. GitHub Support describes that replication
 * and advises retrying at increasing intervals, 3 s, then 10 s, then 30 s
 * (second-hand: GitHub Support as quoted in aws-amplify/amplify-hosting#4080).
 *
 * So a push whose whole transcript is that refusal is tried again with the
 * same token after each wait in turn. Any other failure is final at once:
 * trying a failure after the hook ran again would run the whole gate again,
 * and a gate's own failure is the operator's to read. GitHub's answer to each
 * attempt is the readiness proof, so a push that can go through never waits.
 *
 * @packageDocumentation
 */

/**
 * The waits before each further attempt, on GitHub's advised backoff; the
 * attempts are one more than the waits.
 */
export const PUSH_RETRY_WAITS_MS: readonly number[] = [3_000, 10_000, 30_000];

/**
 * The refusal's lines, in order, as git prints them: GitHub's reason, then
 * git's own failure. The repository and the bot are whatever the push named.
 */
const REFUSAL_LINES: readonly RegExp[] = [
  /^remote: Permission to \S+ denied to \S+\.$/u,
  /^fatal: unable to access '[^']+': The requested URL returned error: 403$/u,
];

/** git's exit status for a fatal error, the refusal's; the executor also reports a kill as 128, with the signal named. */
const GIT_FATAL = 128;

/**
 * The most of a push's transcript the refusal check keeps, counted as the
 * string's length (UTF-16 code units), so the copy holds at most three times
 * that many bytes of UTF-8. The refusal's two lines, newlines included, were
 * 224 characters, all ASCII, as GitHub printed them on 2026-09-28 for the
 * repository this bound was set in; the bound holds over eighteen times that,
 * for a longer repository or bot name, and a longer transcript cannot be the
 * refusal. The push's output is still written to stderr in full, once the
 * executor replays it when git ends, so the check keeps a bounded copy and
 * loses nothing (R1).
 */
export const REFUSAL_TRANSCRIPT_BOUND = 4096;

/**
 * The transcript the refusal check keeps, with the next chunk of the push's
 * output added: the text while it could still be the refusal, and null once
 * it is longer than the refusal can be, from then on.
 *
 * @param kept - What was kept so far, or null once the check stopped keeping.
 * @param chunk - The next output, from either stream.
 */
export function keptForRefusal(kept: string | null, chunk: string): string | null {
  return kept === null || kept.length + chunk.length > REFUSAL_TRANSCRIPT_BOUND
    ? null
    : kept + chunk;
}

/**
 * Whether a failed push is GitHub's refusal at the ref advertisement: git
 * exited 128 on its own, no signal ended it, and its whole transcript is the
 * refusal's two lines, so the pre-push hook never ran.
 *
 * @param status - The push's exit status.
 * @param signal - The signal that ended the push, or null when it exited.
 * @param transcript - What the push printed, both streams, as `keptForRefusal` kept it; null when it outgrew the bound.
 */
export function isAdvertisementRefusal(
  status: number,
  signal: NodeJS.Signals | null,
  transcript: string | null,
): boolean {
  if (transcript === null) {
    return false;
  }
  const lines = transcript
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => line !== '');
  return (
    status === GIT_FATAL &&
    signal === null &&
    lines.length === REFUSAL_LINES.length &&
    lines.every((line, index) => REFUSAL_LINES[index]?.test(line) === true)
  );
}

/** One attempt's end: GitHub's refusal before the hook ran, or the exit the push reports. */
export type PushAttempt =
  { readonly kind: 'refused' } | { readonly kind: 'ended'; readonly exit: number };

/** The exit of a push GitHub refused on every attempt: an operational failure. */
const REFUSED_EXIT = 1;

/** The retry's policy, and where it waits and reports. */
export interface PushRetry {
  /** The wait before each further attempt, in order; the attempts are one more than the waits. */
  readonly waitsMs: readonly number[];
  readonly sleep: (ms: number) => Promise<void>;
  readonly stderr: Pick<NodeJS.WriteStream, 'write'>;
}

/**
 * Run the attempt, and again after the next wait each time GitHub refused it
 * at the ref advertisement, until the waits run out.
 *
 * @param attempt - One transfer, with the token already minted. It is called
 *   with its attempt number, 1-based, and each call pushes once.
 * @param retry - The waits, the sleep, and the stream each retry and the last
 *   refusal are named on.
 * @returns The exit of the last attempt, or an operational failure when GitHub
 *   refused every attempt.
 */
export function pushWithRetry(
  attempt: (attemptNumber: number) => Promise<PushAttempt>,
  retry: PushRetry,
): Promise<number> {
  return attemptFrom(1, attempt, retry);
}

async function attemptFrom(
  attemptNumber: number,
  attempt: (attemptNumber: number) => Promise<PushAttempt>,
  retry: PushRetry,
): Promise<number> {
  const outcome = await attempt(attemptNumber);
  if (outcome.kind === 'ended') {
    return outcome.exit;
  }
  const attempts = retry.waitsMs.length + 1;
  const wait = retry.waitsMs[attemptNumber - 1];
  if (wait === undefined) {
    retry.stderr.write(
      `merge-bot push: GitHub refused the push ${String(attempts)} times before the pre-push hook ran, each refusal shown above; nothing was pushed\n`,
    );
    return REFUSED_EXIT;
  }
  retry.stderr.write(
    `merge-bot push: GitHub refused attempt ${String(attemptNumber)} of ${String(attempts)} before the pre-push hook ran; trying again with the same token in ${String(wait / 1000)} s\n`,
  );
  await retry.sleep(wait);
  return attemptFrom(attemptNumber + 1, attempt, retry);
}
