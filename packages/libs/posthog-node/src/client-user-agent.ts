/**
 * The one client string Oak emits: a `$mcp_client_user_agent` rebuilt from
 * closed pieces so PostHog's built-in harness column resolves (MCP-687).
 *
 * @remarks PostHog resolves that column at query time, in this precedence: the
 * `$mcp_vendor_client` header; then a `$mcp_client_user_agent` whose product is
 * `claude-code`, or one starting `grok`; then `$mcp_client_name`; then any other
 * `$mcp_client_user_agent`. Oak never emits a vendor header or a client name, so
 * for Oak's events the user agent is what resolves. The rule is open source:
 * https://github.com/PostHog/posthog/blob/b6c6a333056473cc7f20513256b62daeb5c05669/products/mcp_analytics/backend/mcp_harness.py
 * (its `_RAW_TOKEN` chain and `_label_multi_if`), with input-to-label examples
 * in the test beside it. It reads the user agent as the product token before
 * the first `/` plus the first bracketed segment, so `claude-code/2 (cli)`
 * labels as "Claude Code", `(sdk-ts)` as "Claude Agent SDK", `(claude-vscode)`
 * and `(claude-desktop)` as their own labels, `Claude-User` as "Claude.ai" and
 * `codex-mcp-client/0` as "OpenAI Codex". Oak emits none of the vendor's raw
 * values, which ADR-218 §3 excludes as client-controlled strings; it emits the
 * property REBUILT from the product spelling observed in live traffic, an
 * optional major version of at most two digits, and an optional build surface
 * from the vendor's closed list. A header that names no product omits the
 * property, so the column resolves to "other" exactly as it did before
 * MCP-687. The raw header value never leaves this process (ADR-218,
 * 2026-09-07 amendment).
 *
 * The product is chosen by the same bounded selection that derives
 * `oak_client_product`, so the two properties describe the same client by
 * construction. Version and surface are then read from the first header value
 * naming that product which carries a version (the User-Agent, when a bare
 * vendor header was the one that named the product), or from the selected
 * value itself when none does.
 *
 * The version is the only place client-supplied bytes reach the value, and it
 * is bounded to at most a hundred distinct values by construction: a longer
 * digit run (a numeric installation id, say) omits the version rather than
 * truncating it, so the slot cannot carry a stable per-installation identifier.
 */

import {
  findLeadingProductRule,
  normaliseClientHeaderValue,
  readClientMajorVersion,
  readFirstBracketedSegment,
  selectLeadingProduct,
  type ClientProductRule,
} from './client-product-selection.js';
import type { ClientIdentityHeaders } from './event-policy-contract.js';

// The vendor's own surface vocabulary, PER PRODUCT, taken from the labelling
// rule above rather than observed in Oak's traffic (only `(cli)` has been): a
// stated exception to the evidence-backed-token constraint, acceptable because
// every member is a fixed string re-emitted from this list and never a
// forwarded byte. Products absent here get no surface at all: PostHog labels
// them by an exact token match, so `Claude-User/1 (cli)` would fall to "Other"
// where `Claude-User/1` labels "Claude.ai".
const SURFACE_BEARING_PRODUCTS = ['claude-code', 'openai-mcp'] as const;
type SurfaceBearingProduct = (typeof SURFACE_BEARING_PRODUCTS)[number];
const CLIENT_BUILD_SURFACES: Readonly<Record<SurfaceBearingProduct, readonly string[]>> = {
  'claude-code': ['cli', 'sdk-ts', 'claude-vscode', 'claude-desktop'],
  'openai-mcp': ['chatgpt', 'codex', 'agent builder', 'responses api'],
};
function readClientBuildSurface(token: string, normalised: string): string | undefined {
  const product = SURFACE_BEARING_PRODUCTS.find((candidate) => candidate === token);
  if (product === undefined) {
    return undefined;
  }
  const segment = readFirstBracketedSegment(normalised);
  return CLIENT_BUILD_SURFACES[product].find((candidate) => candidate === segment);
}

/** Rebuilds the value from the selected rule and the normalised header it matched. */
function rebuildClientUserAgent(rule: ClientProductRule, normalised: string): string {
  const [token, , spelling] = rule;
  const version = readClientMajorVersion(normalised.slice(token.length));
  // PostHog reads the product as everything before the first `/`, so without a
  // version a bracketed surface would be swallowed into the product token and
  // the surface-specific labels could never resolve. A value without a version
  // therefore carries no surface either; it still labels by product prefix.
  const surface = version === undefined ? undefined : readClientBuildSurface(token, normalised);
  const versionPart = version === undefined ? '' : `/${version}`;
  const surfacePart = surface === undefined ? '' : ` (${surface})`;
  return `${spelling}${versionPart}${surfacePart}`;
}

function readClientUserAgent(value: string): string | undefined {
  const normalised = normaliseClientHeaderValue(value);
  const rule = findLeadingProductRule(normalised);
  return rule === undefined ? undefined : rebuildClientUserAgent(rule, normalised);
}

/**
 * Rebuilds the user-agent value PostHog's harness column reads, from closed
 * pieces only, for the same product `normaliseOakClientProduct` selects.
 *
 * @remarks The vendor header can name the product bare, as in
 * `x-anthropic-client: claude-code`, while the User-Agent carries the version
 * and surface. Among
 * the header values naming the SELECTED product, the first that carries a
 * version is the one rebuilt from, so the surface survives; the product itself
 * never changes, so the category and this string still describe the same
 * client.
 *
 * @returns The rebuilt value, or `undefined` when no value names a known
 * product, in which case the property is omitted and the column reads "other".
 */
export function normaliseOakClientUserAgent(headers: ClientIdentityHeaders): string | undefined {
  if (!headers.readable) {
    return undefined;
  }
  const selected = selectLeadingProduct(headers);
  if (selected === undefined) {
    return undefined;
  }
  const [token] = selected.rule;
  const versioned = headers.values
    .filter((value): value is string => typeof value === 'string')
    .map((value) => normaliseClientHeaderValue(value))
    .find(
      (normalised) =>
        findLeadingProductRule(normalised)?.[0] === token &&
        readClientMajorVersion(normalised.slice(token.length)) !== undefined,
    );
  return rebuildClientUserAgent(selected.rule, versioned ?? selected.normalised);
}

/**
 * Whether a value is one the rebuild can produce: it is admitted iff
 * re-parsing it reproduces it byte for byte. The validator therefore IS the
 * derivation, so the grammar has one home and a new table row cannot drift
 * from the barrier the way a hand-copied regex would.
 */
export function isOakClientUserAgent(value: unknown): value is string {
  return typeof value === 'string' && readClientUserAgent(value) === value;
}
