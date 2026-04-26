import type { SentryErrorEvent } from './types.js';

/**
 * Error-class names that get an explicit hybrid Sentry fingerprint
 * when captured by this package's `applyFingerprint` step. Matching
 * is by exact `event.exception.values[0].type` string equality.
 *
 * @remarks Adding a family augments Sentry's default grouping with
 * an explicit class-name token (the hybrid form
 * `['{{ default }}', '<class-name>']`). Sentry's stack-aware
 * default grouping still discriminates within a family — two
 * `McpError` instances thrown from different call sites stay as two
 * issues — while the class-name token guards against silent
 * regressions from Sentry default-algorithm changes.
 *
 * Empirical baseline (2026-04-26 L-IMM Sub-item 1 — issues
 * `OAK-OPEN-CURRICULUM-MCP-7/8/9`): the three `TestError*` modes
 * already produced three distinct issues without explicit
 * fingerprinting. The hybrid form preserves that behaviour and adds
 * a future-proof anchor.
 *
 * @remarks `McpError` comes from `@modelcontextprotocol/sdk` (a
 * pre-1.0 package). A future rename (e.g. to `JsonRpcError`) would
 * silently fall through to Sentry's default grouping rather than the
 * augmented form. The fallthrough is non-fatal — capture continues
 * — but the explicit class-name discrimination is lost. Re-evaluate
 * this list whenever the MCP SDK ships a major-version bump.
 */
const KNOWN_ERROR_FAMILIES: ReadonlySet<string> = new Set([
  'TestErrorUnhandled',
  'TestErrorHandled',
  'TestErrorRejected',
  'McpError',
]);

/**
 * The Sentry fingerprint sentinel that interpolates the SDK's
 * default grouping algorithm output. Documented at
 * https://docs.sentry.io/platforms/javascript/guides/node/usage/sdk-fingerprinting/.
 */
export const SENTRY_DEFAULT_FINGERPRINT = '{{ default }}';

/**
 * Apply the Oak Sentry fingerprint policy to an outbound error event.
 *
 * @remarks
 * Composed into `createSentryHooks` `beforeSend` AFTER the redaction
 * barrier (`redactSentryEvent`) so PII can never leak into a
 * fingerprint key. The function is pure: it returns a new event when
 * a fingerprint is assigned and returns the input event unchanged
 * otherwise.
 *
 * **Match precedence**:
 * - Top exception's `type` is read from `event.exception.values[0]`.
 * - If `type` is in {@link KNOWN_ERROR_FAMILIES}, the returned event
 *   has `fingerprint: [SENTRY_DEFAULT_FINGERPRINT, type]`. The
 *   default sentinel preserves Sentry's stack-aware grouping while
 *   the class-name token augments it; this overrides any
 *   upstream-supplied fingerprint for matched events.
 * - Otherwise the input event is returned untouched, preserving any
 *   upstream-supplied fingerprint and Sentry's default grouping for
 *   non-matching events.
 *
 * **Why the input is not mutated**: Sentry's `beforeSend` contract
 * permits mutation of the input event, but the project's
 * `runtime-redaction` module returns fresh objects, and this step
 * mirrors that discipline so the chain stays referentially honest.
 */
export function applyFingerprint(event: SentryErrorEvent): SentryErrorEvent {
  const topException = event.exception?.values?.[0];
  const errorType = topException?.type;
  if (errorType !== undefined && KNOWN_ERROR_FAMILIES.has(errorType)) {
    return { ...event, fingerprint: [SENTRY_DEFAULT_FINGERPRINT, errorType] };
  }
  return event;
}
