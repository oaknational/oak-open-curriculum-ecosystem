/**
 * Reviewed post-baseline semantic deltas — the resource-registration path
 * (registrars, the registration descriptor, and the registration proofs).
 *
 * Every entry is a compliance review act: the semantic hash pins the exact
 * reviewed state; item ids cite the audit rows the file carries, or one
 * explicit exclusion reason says why the change adds no governed content.
 * Split from `current-source-delta-reviews-app.ts` when the MCP-337 entries
 * took that map over the file-size gate.
 */
import {
  excluded,
  IMPLEMENTATION_ONLY,
  reviewed,
  type CurrentSourceDeltaReview,
  VALIDATION_ONLY,
} from './current-source-delta-review-helpers.js';

export const APP_REGISTRATION_DELTA_REVIEWS: Readonly<Record<string, CurrentSourceDeltaReview>> = {
  // MCP-242: resource-read observation decorator at the registration
  // boundary — analytics plumbing only; registers no content and rewrites
  // no served surface (public resources pass through unwrapped).
  'apps/oak-curriculum-mcp-streamable-http/src/observe-resource-reads.ts': excluded(
    '4b471edd5b7083591b78c83a0cd934671de69a225fd3215415da52a1aa93af30',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/register-resource-helpers.ts': excluded(
    '6656626f8c88298c26ed09d8c9e56474fe12c369c6f521dcd2667a255e94a135',
    IMPLEMENTATION_ONLY,
  ),
  // MCP-337: the registration descriptor — gating/derivation only; the
  // governed registration bodies (C336–C340) moved to
  // resource-registrations.ts and their review rides that entry.
  'apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts': excluded(
    '55e9e1200a4d5ec6b3450bb18123f5369d8a8a647a44d09b38ac848c999fbd9d',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/register-widget-resource.ts': reviewed(
    '0ddeaa2c8e1938d0be9951b51ccaedea6eb58e77bbb255dd949fb5a1852986c4',
    ['C690', 'C691', 'C692'],
  ),
  // MCP-439: the in-memory client harness extracted from the registration
  // proof so the served-tool-table generator observes the same composition
  // root instead of re-deriving the surface.
  'apps/oak-curriculum-mcp-streamable-http/src/registration-proof/connected-client.ts': excluded(
    '7a1c3acf157be1af771411db80e627b1dc5dda6a481b8b0693dca2c1a072832d',
    VALIDATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/registration-proof/current-source-guidance-registration-evidence.ts':
    excluded('49f654ce6379cab1f07621104b33c8407d7f3380c1c71a4dd31bd44423020469', VALIDATION_ONLY),
  'apps/oak-curriculum-mcp-streamable-http/src/registration-proof/current-source-registration-proof.ts':
    excluded('2008c3346c080581540e09c232e29d8049286ed3c162d25ce1d7ca6ab5c3c8a7', VALIDATION_ONLY),
  'apps/oak-curriculum-mcp-streamable-http/src/registration-proof/guidance-list-parity.ts':
    excluded('ebb75cfdf95db96e295c62b54fc8f63e349d0749e447dbefffedcb2355dc43df', VALIDATION_ONLY),
  'apps/oak-curriculum-mcp-streamable-http/src/registration-proof/guidance-read-parity.ts':
    excluded('6a8d90126daa6a0e6e786c4d71b9b79d1db8241d7db5dfec8425c8bad3fe8f67', VALIDATION_ONLY),
  'apps/oak-curriculum-mcp-streamable-http/src/registration-proof/require-mcp-error-code.ts':
    excluded('50edf574104e4412b9a573b347995eb6943e7ea5365f1762b26300b83c8da79f', VALIDATION_ONLY),
  // MCP-439: the reviewer-facing tool-table renderer — validation/artefact
  // tooling over the served surface, no served content of its own.
  'apps/oak-curriculum-mcp-streamable-http/src/registration-proof/served-tool-table.ts': excluded(
    '1dc27288d76137be66083a4d0ad364a59b0043ab58aab7439db35abdf392ff64',
    VALIDATION_ONLY,
  ),
  // MCP-337: the per-resource registration bodies extracted from
  // register-resources.ts; the audit rows moved with their content.
  // MCP-353: the under-the-hood pointer resource deleted (§2.F cure) — its
  // rows (C337–C340) retired via lineage; the fallback template remains.
  'apps/oak-curriculum-mcp-streamable-http/src/resource-registrations.ts': reviewed(
    '3206086b2860e4aa61ede4c44dfc3257a76532fa5e37231742ab5347664455c4',
    ['C336'],
  ),
};
