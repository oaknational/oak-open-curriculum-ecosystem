/**
 * Bootstrap failure reporter — the one path by which a configuration
 * failure that happens *before* observability exists still reaches
 * Sentry.
 *
 * @remarks
 * A composition root resolves its runtime configuration before it can
 * construct observability, because observability is built *from* that
 * configuration. A configuration failure therefore throws while no
 * Sentry client exists, and is unreportable by construction. This module
 * closes that gap under a deliberately bounded contract (MCP-480 /
 * `boot-failure-observability`):
 *
 * - it activates only from Sentry inputs that parse strictly under the
 *   shared `SentryEnvSchema` with live mode selected. `off` and
 *   `fixture` remain authoritative and make no network call, and on
 *   inputs the schema rejects the reporter stays silent — no
 *   activation, no network call, no new failure;
 * - it sanitises through the shared ADR-160 redaction barrier, with no
 *   bypass path: the pre-SDK normalisation runs
 *   {@link redactNormalizedError}, and the SDK options carry the same
 *   hook-set every other `init()` in this library uses;
 * - it makes ONE capture attempt and allows at most
 *   {@link BOOTSTRAP_REPORT_DEADLINE_MS} for flush. There is no retry;
 * - initialisation, capture, or flush failing, rejecting, or hanging
 *   never masks the original boundary error. This function never throws
 *   and never returns the error to the caller — the caller still
 *   rethrows exactly what it was going to rethrow, delayed only by the
 *   deadline above.
 *
 * Fail-fast is unchanged. This module makes a refusal legible; it never
 * makes it softer.
 *
 * @packageDocumentation
 */

import { buildNormalizedError } from '@oaknational/logger';
import {
  createBootstrapInitOptions,
  createBootstrapTags,
  resolveBootstrapActivation,
  type BootstrapReportSilentReason,
  type BootstrapSentryConfig,
} from './bootstrap-reporter-activation.js';
import { redactNormalizedError, toNativeError } from './runtime-error.js';
import { defaultSentryNodeSdk } from './runtime-sdk.js';
import type { SentryNodeSdk } from './types.js';

export type { BootstrapReportSilentReason } from './bootstrap-reporter-activation.js';

/**
 * Total budget the boot path may spend flushing the bootstrap report
 * before the boundary error is rethrown.
 *
 * @remarks 500 ms is the whole allowance, not a per-attempt one: the
 * refusal is a fail-fast privacy boundary and must not become slow. A
 * flush that has not settled by then is abandoned; the event may be
 * lost, and losing it is preferable to delaying the refusal.
 */
export const BOOTSTRAP_REPORT_DEADLINE_MS = 500;

/**
 * What the reporter did, reported back for tests and callers that log
 * the outcome. It is never an error and never affects control flow at
 * the boundary.
 */
export type BootstrapReportOutcome =
  | { readonly attempted: false; readonly reason: BootstrapReportSilentReason }
  /** SDK initialisation or the single capture threw; no flush was attempted. */
  | { readonly attempted: true; readonly captured: false }
  | {
      readonly attempted: true;
      readonly captured: true;
      /** `false` when the flush failed, rejected, or crossed the deadline. */
      readonly flushed: boolean;
    };

/** Inputs for one bootstrap report attempt. */
export interface BootstrapReportInput {
  /**
   * The raw, unvalidated deployment environment. Only the shared
   * `SentryEnvSchema` fields plus the Vercel environment identity are
   * read from it; nothing else is inspected, carried, or emitted.
   */
  readonly env: Readonly<Record<string, string | undefined>>;
  /** Service tag for the emitted event — the app's own service name. */
  readonly serviceName: string;
  /**
   * The error the boundary is about to rethrow.
   *
   * @remarks Reported, never replaced and never mutated. Its message
   * must already name the guard rather than the offending value; this
   * reporter redacts, but redaction is the barrier, not the policy.
   */
  readonly boundaryError: Error;
  /** SDK seam (ADR-078). Defaults to the shared Sentry Node adapter. */
  readonly sdk?: SentryNodeSdk;
  /**
   * Deadline seam (ADR-078). Resolves when the budget is spent. Defaults
   * to an unref'd timer, so a pending deadline never holds a process
   * open.
   */
  readonly waitForDeadline?: (timeoutMs: number) => Promise<void>;
}

/**
 * Normalise and redact the boundary error, then make the single capture
 * attempt.
 *
 * @remarks Mirrors the live runtime's `captureHandledError` shape so the
 * pre-SDK redaction pass is identical on both paths.
 */
function captureBootstrapEvent(
  sdk: SentryNodeSdk,
  config: BootstrapSentryConfig,
  serviceName: string,
  boundaryError: Error,
): void {
  const redacted = redactNormalizedError(
    buildNormalizedError({
      name: boundaryError.name,
      message: boundaryError.message,
      stack: boundaryError.stack,
    }),
  );

  sdk.captureException(toNativeError(redacted), {
    tags: createBootstrapTags(config, serviceName),
  });
}

function defaultWaitForDeadline(timeoutMs: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, timeoutMs).unref();
  });
}

/**
 * Race the single flush against the deadline.
 *
 * @remarks The SDK is given the deadline as its own timeout AND raced
 * against an independent one: an adapter that ignores its timeout, or a
 * promise that never settles, must not be able to extend the boot
 * refusal. A rejected flush is caught here so the abandoned promise
 * cannot surface later as an unhandled rejection.
 */
async function flushWithinDeadline(
  sdk: SentryNodeSdk,
  waitForDeadline: (timeoutMs: number) => Promise<void>,
): Promise<boolean> {
  try {
    return await Promise.race([
      sdk.flush(BOOTSTRAP_REPORT_DEADLINE_MS).catch(() => false),
      waitForDeadline(BOOTSTRAP_REPORT_DEADLINE_MS).then(() => false),
    ]);
  } catch {
    return false;
  }
}

/**
 * Report a pre-observability boot failure, then let the caller rethrow.
 *
 * @param input - Raw environment, service name, and the boundary error.
 * @returns What the reporter did. Never throws; never rejects.
 *
 * @remarks Callers rethrow the original `boundaryError` unconditionally
 * after awaiting this. The contract is stated on the module.
 *
 * Initialisation and capture are synchronous, so the deadline governs
 * flush only; a synchronous hang inside a vendor SDK is not boundable by
 * any asynchronous deadline and is out of scope.
 *
 * Calling this initialises a Sentry client in the current isolate. That
 * is safe on the boot-failure path because the boundary has already
 * refused: the environment cannot change without a redeploy, so a
 * retried load in the same isolate fails identically rather than racing
 * a healthy client.
 */
export async function reportBootstrapFailure(
  input: BootstrapReportInput,
): Promise<BootstrapReportOutcome> {
  let activation;

  try {
    activation = resolveBootstrapActivation(input.env);
  } catch {
    // Deliberately kept even though no test can redden it, unlike the
    // consumer-side catch this contract lets callers omit. The difference is
    // whose promise the no-throw property rests on: the caller's guard would
    // have restated THIS function's contract, which is proven; this one guards
    // third-party parse code (`safeParse`, `new URL`) whose contract is not
    // ours to prove. Clause 5 is a privacy boundary, so it is structural here
    // rather than inherited from a vendor. An input that makes the gate itself
    // throw is not an input that can be trusted to describe a destination.
    return { attempted: false, reason: 'sentry_env_rejected' };
  }

  if (!activation.activated) {
    return { attempted: false, reason: activation.reason };
  }

  const sdk = input.sdk ?? defaultSentryNodeSdk;

  try {
    sdk.init(createBootstrapInitOptions(activation.config, input.serviceName));
    captureBootstrapEvent(sdk, activation.config, input.serviceName, input.boundaryError);
  } catch {
    // A reporter that cannot start or capture is a lost diagnostic,
    // never a new failure at the boundary.
    return { attempted: true, captured: false };
  }

  const flushed = await flushWithinDeadline(sdk, input.waitForDeadline ?? defaultWaitForDeadline);

  return { attempted: true, captured: true, flushed };
}
