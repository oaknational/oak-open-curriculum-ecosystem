/**
 * Pagination echo: the structured, in-payload form of the upstream API's
 * `Link: rel="next"` pagination signal, and its derivation.
 *
 * Split from mcp-protocol-types.ts at that module's line cap; the contract
 * surface re-exports these names, so generated code and consumers keep a
 * single import home.
 */

/**
 * Structured echo of the upstream API's pagination signal.
 *
 * The upstream API signals further pages solely through an HTTP
 * `Link: <url>; rel="next"` response header, which MCP tool results
 * cannot carry. Paginated tools surface the signal here instead, so an
 * agent can tell from the payload alone whether more data exists.
 */
export type PaginationEcho =
  | { readonly hasMore: false }
  | { readonly hasMore: true; readonly nextOffset?: number; readonly nextLimit?: number };

/**
 * Parses one next-page query value as a non-negative integer: accepted only
 * when the string is digits-only and within the safe-integer range;
 * anything else (absent, signed, fractional, non-numeric, oversized)
 * yields `undefined` so the field is omitted rather than guessed.
 */
function parseNonNegativeInteger(value: string | null): number | undefined {
  if (value === null || !/^\d+$/.test(value)) {
    return undefined;
  }
  const parsed = Number(value);
  // A digit-only string can still exceed the safe-integer range, where
  // Number() silently loses precision — omit the field rather than echo a
  // wrong offset; hasMore stays true from the rel="next" presence.
  return Number.isSafeInteger(parsed) ? parsed : undefined;
}

/**
 * Matches the `rel` link-param of one Link value, in either RFC 8288 §3
 * form: a quoted string (`rel="next"`) or a bare token (`rel=next`),
 * case-insensitively and tolerating whitespace around `=`.
 *
 * @see https://www.rfc-editor.org/rfc/rfc8288#section-3 — the Link header
 * field: target, relation type (`rel`), and the quoted-string / token
 * parameter forms this module accepts. Adapted, not a full parser: the
 * module splits link-params on `;` without quoted-string awareness (a
 * `;` inside another quoted param value is not handled; tracked as
 * MCP-670), and resolves relative targets against a synthetic base
 * because only the query parameters are read.
 */
const REL_PARAM = /(?:^|;)\s*rel\s*=\s*(?:"([^"]*)"|([^;,\s]+))/i;

/**
 * Reports whether a Link value's parameter text declares the `next`
 * relation. `rel` carries a space-separated relation-type list, so
 * `rel="next last"` counts; scoping the match to the rel param keeps an
 * unrelated param (a `title` quoting the word) from matching.
 */
function declaresNextRelation(params: string): boolean {
  const match = REL_PARAM.exec(params);
  if (!match) {
    return false;
  }
  const relations = (match[1] ?? match[2] ?? '').toLowerCase().split(/\s+/);
  return relations.includes('next');
}

/**
 * Finds the `<target>` of the `next`-relation segment in a `Link` header,
 * by linear scan — each `<target>` is paired with the parameter text up to
 * the following `<` (or the header's end).
 */
function nextLinkTarget(linkHeader: string): string | undefined {
  let cursor = 0;
  for (;;) {
    const open = linkHeader.indexOf('<', cursor);
    if (open === -1) {
      return undefined;
    }
    const close = linkHeader.indexOf('>', open + 1);
    if (close === -1) {
      return undefined;
    }
    const paramsEnd = linkHeader.indexOf('<', close + 1);
    const params = linkHeader.slice(close + 1, paramsEnd === -1 ? linkHeader.length : paramsEnd);
    if (declaresNextRelation(params)) {
      return linkHeader.slice(open + 1, close);
    }
    cursor = close + 1;
  }
}

/**
 * Base for resolving a relative Link target. RFC 8288 permits relative
 * targets (`<?offset=40&limit=20>`), and `new URL` rejects them without a
 * base; only the query parameters are read, so the base's origin never
 * surfaces. Absolute targets ignore the base.
 */
const RELATIVE_TARGET_BASE = 'https://link.invalid/';

/**
 * Derives the {@link PaginationEcho} for a paginated operation from its
 * upstream `Link` response header.
 *
 * Presence of a `rel="next"` link means more pages exist; its URL's
 * `offset` and `limit` query parameters, when well-formed, name the next
 * page. A malformed next-link URL still reports `hasMore: true` — the
 * relation is the signal, the URL parameters are a convenience.
 */
export function derivePaginationFromLinkHeader(linkHeader: string | null): PaginationEcho {
  if (linkHeader === null) {
    return { hasMore: false };
  }
  const target = nextLinkTarget(linkHeader);
  if (target === undefined) {
    return { hasMore: false };
  }
  let nextUrl: URL;
  try {
    nextUrl = new URL(target, RELATIVE_TARGET_BASE);
  } catch {
    return { hasMore: true };
  }
  const nextOffset = parseNonNegativeInteger(nextUrl.searchParams.get('offset'));
  const nextLimit = parseNonNegativeInteger(nextUrl.searchParams.get('limit'));
  return {
    hasMore: true,
    ...(nextOffset === undefined ? {} : { nextOffset }),
    ...(nextLimit === undefined ? {} : { nextLimit }),
  };
}
