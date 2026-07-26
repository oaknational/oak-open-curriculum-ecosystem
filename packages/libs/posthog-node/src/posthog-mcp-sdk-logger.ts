import { reportSafely } from './event-policy-helpers.js';
import type { PostHogOperationalErrorKind } from './product-analytics-runtime-contract.js';

export type PostHogMcpSdkLogger = (message: string) => void;

/**
 * Converts the vendor's swallowed capture warnings into Oak's fixed signal.
 *
 * @remarks
 * `@posthog/mcp` reports both its successful capture and every suppressed
 * pipeline warning through one package-level logger. The exclusive vendor
 * import rule and this adapter's one-runtime-per-process contract make that
 * global seam single-owned. Successful capture is the sole informational
 * message; every other SDK message is therefore a failed analytics operation.
 * The vendor text never crosses the adapter boundary.
 */
export function createPostHogMcpSdkLogger(
  reportOperationalError: (kind: PostHogOperationalErrorKind) => void,
): PostHogMcpSdkLogger {
  return (message) => {
    if (message.startsWith('Captured PostHog event ')) {
      return;
    }
    reportSafely(reportOperationalError, 'posthog_event_policy_failed');
  };
}
