/**
 * The composition-root seam that makes a pre-observability boot failure
 * visible.
 *
 * @remarks
 * `loadConfiguredApp` resolves the runtime configuration before it can
 * build observability, because observability is built *from* that
 * configuration. A configuration failure therefore throws while no
 * Sentry client exists — unreportable by construction, which is exactly
 * how a malformed `POSTHOG_PSEUDONYM_KEYRING` on preview produced a bare
 * `FUNCTION_INVOCATION_FAILED` and nothing in Sentry (MCP-480).
 *
 * This module sits at that seam and nowhere else. It does not soften the
 * refusal: fail-fast is the privacy boundary, and booting without valid
 * pseudonymisation configuration stays fatal. It only makes the refusal
 * legible before it happens.
 *
 * @packageDocumentation
 */

import {
  reportBootstrapFailure,
  type BootstrapReportOutcome,
  type SentryNodeSdk,
} from '@oaknational/sentry-node';
import type { Result } from '@oaknational/result';
import type { ConfigError } from './runtime-config-support.js';

/** Dependencies for one guarded load at the deploy boundary. */
export interface LoadOrReportDeps<TLoaded> {
  /** The configuration load being guarded. */
  readonly load: () => Result<TLoaded, ConfigError>;
  /**
   * The raw deployment environment. Read by the bootstrap reporter for
   * its own activation decision only — the load has already failed, so
   * no validated view of it exists.
   */
  readonly env: Readonly<Record<string, string | undefined>>;
  /** Service tag for the emitted event. */
  readonly serviceName: string;
  /**
   * Where the reporter's own outcome is announced.
   *
   * @remarks Defaults to stderr, which the hosting platform captures
   * alongside the refusal. Without this an operator staring at
   * `FUNCTION_INVOCATION_FAILED` with nothing in Sentry cannot tell
   * "the reporter declined to activate" from "the flush was abandoned"
   * from "this build predates the reporter" — three very different next
   * moves. It never carries the boundary error, only what the reporter
   * did about it.
   */
  readonly announce?: (line: string) => void;
  /** SDK seam (ADR-078) handed through to the bootstrap reporter. */
  readonly sentrySdk?: SentryNodeSdk;
  /** Deadline seam (ADR-078) handed through to the bootstrap reporter. */
  readonly waitForDeadline?: (timeoutMs: number) => Promise<void>;
}

/**
 * Loads the runtime, or reports the refusal and fails the boundary with
 * it. At most one report per instance, however many times it is called.
 */
export type BootFailureReportingLoader = <TLoaded>(
  deps: LoadOrReportDeps<TLoaded>,
) => Promise<TLoaded>;

/**
 * Render what the reporter did, for the platform log beside the refusal.
 *
 * @remarks Shape facts only — never the boundary error, which the
 * refusal itself already carries.
 */
function describeOutcome(outcome: BootstrapReportOutcome): string {
  if (!outcome.attempted) {
    return `boot-failure report: not sent (${outcome.reason})`;
  }

  if (!outcome.captured) {
    return 'boot-failure report: capture failed';
  }

  return `boot-failure report: captured, flush ${outcome.flushed ? 'completed' : 'abandoned'}`;
}

function defaultAnnounce(line: string): void {
  process.stderr.write(`${line}\n`);
}

/**
 * Create the guarded loader for one function isolate.
 *
 * @returns A loader that reports at most one boot failure, then always
 * fails the boundary with the configuration failure's own message.
 *
 * @remarks **The once-ness is the whole reason this is a factory.** The
 * deploy entry handler clears a failed load so the next request retries
 * (`deploy-entry-handler.ts`), and a misconfigured deployment fails
 * deterministically — so without a memo every inbound request would
 * re-initialise the SDK, capture again, and pay the flush deadline
 * again. Sentry volume would become a function of internet traffic to a
 * broken deployment, and repeated `init()` calls would accumulate
 * process-level handlers. The reporter's "one capture attempt" clause is
 * per call; this is what makes it per isolate. `server.ts` therefore
 * creates exactly one of these at module scope, beside `analyticsMemo`
 * and for the same reason.
 *
 * The flag is set BEFORE the await so concurrent first requests cannot
 * both pass it.
 *
 * There is deliberately no `try` around the report call. The reporter's
 * contract is that it never throws — proven at its own boundary across
 * initialisation failure, capture failure, flush rejection, flush
 * timeout, and a flush that never settles — so a catch here would be
 * unreachable code no mutation can redden, which is the decorative-guard
 * shape `testing-strategy.md` forbids. The never-masks invariant is
 * proven through this function instead: every one of those reporter arms
 * is driven end to end in `boot-failure-report.integration.test.ts` and
 * each one rethrows this error unchanged.
 */
export function createBootFailureReportingLoader(): BootFailureReportingLoader {
  let reported = false;

  return async function loadOrReportAndThrow<TLoaded>(
    deps: LoadOrReportDeps<TLoaded>,
  ): Promise<TLoaded> {
    const loaded = deps.load();

    if (loaded.ok) {
      return loaded.value;
    }

    const boundaryError = new Error(loaded.error.message);

    if (!reported) {
      reported = true;
      const outcome = await reportBootstrapFailure({
        env: deps.env,
        serviceName: deps.serviceName,
        boundaryError,
        ...(deps.sentrySdk ? { sdk: deps.sentrySdk } : {}),
        ...(deps.waitForDeadline ? { waitForDeadline: deps.waitForDeadline } : {}),
      });
      (deps.announce ?? defaultAnnounce)(describeOutcome(outcome));
    }

    throw boundaryError;
  };
}
