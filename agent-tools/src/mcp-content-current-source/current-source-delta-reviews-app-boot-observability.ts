/**
 * Reviewed post-baseline semantic deltas — the boot-path and observability
 * governed sources (MCP-480).
 *
 * Every entry is a compliance review act: the semantic hash pins the exact
 * reviewed state; item ids cite the audit rows the file carries, or one
 * explicit exclusion reason says why the change adds no governed content.
 *
 * A family of its own rather than six more rows in
 * `current-source-delta-reviews-app.ts`, which sits at its `max-lines` ceiling.
 * The split is also the honest one: everything here is composition-root and
 * operator-diagnostic surface — what the server does when it REFUSES to start,
 * and where that refusal is reported. None of it reaches an MCP consumer
 * through a tool, resource, prompt, or page, and the served surface is
 * unchanged (item count held at 728 across this change).
 */
import {
  excluded,
  IMPLEMENTATION_ONLY,
  type CurrentSourceDeltaReview,
} from './current-source-delta-review-helpers.js';

export const APP_BOOT_OBSERVABILITY_DELTA_REVIEWS: Readonly<
  Record<string, CurrentSourceDeltaReview>
> = {
  // MCP-480: the deploy boundary now reports a pre-observability configuration
  // refusal through the shared bootstrap reporter before rethrowing it. The
  // refusal is unchanged — same message, same throw, same fail-fast.
  'apps/oak-curriculum-mcp-streamable-http/src/server.ts': excluded(
    'd80474715220e9af26b1c6db726704cffa4d613f5a234032940f1b2cb1dac712',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/boot-failure-report.ts': excluded(
    'f68f257bcc4058032e24fa1f2d2e998309beae06e88558dccbb7230f8c4ebf9f',
    IMPLEMENTATION_ONLY,
  ),
  // The service tag is exported so a boot-failure event and a runtime event
  // cannot drift onto two different service names.
  'apps/oak-curriculum-mcp-streamable-http/src/observability/http-observability.ts': excluded(
    '79b4e0c9615ec639367d2ee690b80116a8d4d8f8558b9e1289d8eaca030fd0cb',
    IMPLEMENTATION_ONLY,
  ),
  // MCP-480: the keyring guards moved to their own modules and now name which
  // check refused, with safe shape facts only. Operator-facing boot
  // diagnostics; no value is emitted and nothing here reaches a consumer.
  'apps/oak-curriculum-mcp-streamable-http/src/product-analytics-config.ts': excluded(
    '8e60c18d1b1bf2a05d283275835864948374600ec0a341fdc924e198c8d30780',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/product-analytics-keyring.ts': excluded(
    '47c46f53771bf564e96909e9ba673e138f144d1857583f114e8fa3b057854d7c',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/product-analytics-keyring-diagnostics.ts': excluded(
    '22205de405dd2a7f497ba9caf6f75b41bcc9d4d03dea5658a48ce9aaf4942b6a',
    IMPLEMENTATION_ONLY,
  ),
};
