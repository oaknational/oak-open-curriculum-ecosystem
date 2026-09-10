/**
 * The one bounded parser that picks a client product out of the identity
 * headers. Both the `oak_client_product` category and the rebuilt
 * `$mcp_client_user_agent` derive from its single selection, so the two
 * properties describe the same header value by construction (MCP-687).
 *
 * @remarks Product tokens must stay evidence-backed. Three rows were verified
 * first-hand in Oak's own inbound traffic over the 7 days to 2026-08-13:
 * `Claude-User` (10,045 requests), `claude-code/2.1.x (cli)` (~3,100) and
 * `codex-mcp-client/0.14x (…)` (~230). The `openai-mcp` row is the one stated
 * exception: it was added ahead of Oak's OpenAI launch (week of 2026-09-07,
 * Luke Arnold's direction) from PostHog's published resolver and its fixtures
 * (`openai-mcp/1.0.0`, with `(ChatGPT)`, `(Codex)`, `(Agent Builder)` and
 * `(Responses API)` surfaces), which record that client's shape from PostHog's
 * own traffic. Its check is the first live OpenAI user agent Oak observes
 * after launch, which confirms or corrects the row. The correction path for a
 * new client is a token row plus its derivation-table test row — never a
 * widening of the match rule, and never forwarding the raw header value.
 *
 * The residual is deliberately unclaimed rather than guessed: `curl` (291),
 * `node` (249), `python-httpx` (87), browser `Mozilla/*` (74), `Bun` (39) and
 * `directory-admin-dashboard-inspection` (11) are Oak's own probes, smoke
 * tests and the browser widget, not named MCP client products. They belong in
 * 'other', which therefore means genuinely unidentifiable, not merely unread.
 */

import type { ClientIdentityHeaders, OakClientProduct } from './event-policy-contract.js';

/** Folds only [A-Z], so it is length-preserving and never shifts an index. */
export function asciiLower(value: string): string {
  return value.replaceAll(/[A-Z]/gu, (character) => character.toLowerCase());
}

// Bounds every read of a header value, trimming included, so the cost is
// independent of an attacker-controlled header length. Matching is anchored at
// index 0, so nothing beyond the window can change the outcome.
const MAX_CLIENT_HEADER_SCAN_LENGTH = 256;

/** `[token, category, spelling]`: the spelling is the only form ever re-emitted. */
export type ClientProductRule = readonly [string, OakClientProduct, string];

export const CLIENT_PRODUCT_TOKEN_RULES: readonly ClientProductRule[] = [
  ['claude-user', 'claude_ai', 'Claude-User'],
  ['claude-code', 'claude_code', 'claude-code'],
  ['codex-mcp-client', 'codex', 'codex-mcp-client'],
  // The category here is the vendor-level fallback; `normaliseOakClientProduct`
  // refines it to `chatgpt` or `codex` from the bracketed surface.
  ['openai-mcp', 'openai', 'openai-mcp'],
];

// The FIRST bracketed segment, running to the first comma, close bracket or
// the end of the value, exactly as PostHog's own extractor (`[(]([^,)]+)`)
// reads it: `(sdk-ts, agent-sdk/0.3)` yields `sdk-ts`, and so does a truncated
// `(sdk-ts` with no close bracket. First-only means list order carries no
// meaning anywhere a segment is matched, and a header cannot reach a later
// bracket by prepending one.
const FIRST_BRACKETED_SEGMENT_PATTERN = /\(([^,)]+)/u;

/** The first bracketed segment of a normalised value, if any. */
export function readFirstBracketedSegment(normalised: string): string | undefined {
  return FIRST_BRACKETED_SEGMENT_PATTERN.exec(normalised)?.[1];
}

// At most two ASCII digits with no leading zero, and the run must END there, so
// the slot holds exactly the hundred values 0–99: `/2.1.226` yields `2`,
// `/01.2` and `/8123456789012345` yield nothing.
const CLIENT_MAJOR_VERSION_PATTERN = /^(?:0|[1-9]\d?)(?!\d)/u;

/**
 * The major version following the product token, from the normalised value's
 * remainder after that token. Shared by the rebuilt user agent and the
 * category refinement so both gate on the same parse.
 */
export function readClientMajorVersion(afterToken: string): string | undefined {
  if (!afterToken.startsWith('/')) {
    return undefined;
  }
  const match = CLIENT_MAJOR_VERSION_PATTERN.exec(afterToken.slice(1));
  return match === null ? undefined : match[0];
}

/**
 * Matches a product token only as the header's *leading* token.
 *
 * @remarks Deliberately stricter than the segment matcher the surface axis
 * uses. A User-Agent names its product first (`claude-code/2.1.226 (cli)`),
 * and a client-controlled string that merely *contains* a product name
 * somewhere is not that product self-declaring — it may be an unrelated
 * client, or a deliberate impersonation. Substring matching also makes the
 * outcome depend on rule order for a value carrying two product names;
 * anchoring removes that ambiguity, so the table's row order carries no
 * meaning.
 *
 * The boundary set omits `-`, which the family prefix allows: at product
 * granularity `claude-user` must not claim a hypothetical
 * `claude-user-agent/1.0`, whereas at family granularity `claude` legitimately
 * claims both. `/` and ` ` are the only real delimiters after a UA product
 * token.
 */
function hasLeadingProductToken(value: string, token: string): boolean {
  if (!value.startsWith(token)) {
    return false;
  }

  const boundary = value.at(token.length);
  return boundary === undefined || boundary === ' ' || boundary === '/';
}

/**
 * The shared normalisation of one header value: sliced to the window FIRST,
 * so no read scales with the raw length, then trimmed and case-folded.
 */
export function normaliseClientHeaderValue(value: string): string {
  return asciiLower(value.slice(0, MAX_CLIENT_HEADER_SCAN_LENGTH).trim());
}

/** The table row whose token leads the normalised value, if any. */
export function findLeadingProductRule(normalised: string): ClientProductRule | undefined {
  return CLIENT_PRODUCT_TOKEN_RULES.find(([token]) => hasLeadingProductToken(normalised, token));
}

export interface SelectedClientProduct {
  readonly rule: ClientProductRule;
  /** The normalised header value the rule was found in; version and surface are read from it. */
  readonly normalised: string;
}

/**
 * Selects the first header value that names a known product. A value that
 * names none does not participate, so an unrecognised vendor header falls
 * through to the User-Agent rather than forcing a verdict.
 *
 * @returns The rule and the normalised value it matched, or `undefined` when
 * the container is unreadable or no value names a product.
 */
export function selectLeadingProduct(
  headers: ClientIdentityHeaders,
): SelectedClientProduct | undefined {
  if (!headers.readable) {
    return undefined;
  }
  for (const value of headers.values) {
    // A type check only: an emptiness test would trim the whole untrusted value
    // and defeat the scan bound, and an all-space value names no product anyway.
    if (typeof value !== 'string') {
      continue;
    }
    const normalised = normaliseClientHeaderValue(value);
    const rule = findLeadingProductRule(normalised);
    if (rule !== undefined) {
      return { rule, normalised };
    }
  }
  return undefined;
}
