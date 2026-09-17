/**
 * Derivation of the three closed client-category axes.
 *
 * @remarks Each axis answers a different question and none substitutes for
 * another: `OakClientFamily` names the vendor (handshake-only, so ADR-112's
 * per-request transport cannot carry it onto a later call), `OakClientSurface`
 * the form factor, and `OakClientProduct` the vendor product. All three are
 * derived here, inside the policy boundary, from a self-declaring client string
 * that never itself leaves the process — ADR-218 §3 excludes raw headers and
 * raw client strings from the event envelope.
 */

import {
  asciiLower,
  readClientMajorVersion,
  readFirstBracketedSegment,
  selectLeadingProduct,
} from './client-product-selection.js';
import type {
  ClientIdentityHeaders,
  OakClientFamily,
  OakClientProduct,
  OakClientSurface,
} from './event-policy-contract.js';

function hasClientFamilyPrefix(value: string, prefix: 'chatgpt' | 'claude'): boolean {
  if (!value.startsWith(prefix)) {
    return false;
  }

  const boundary = value.at(prefix.length);
  return boundary === undefined || boundary === ' ' || boundary === '/' || boundary === '-';
}

export function normaliseOakClientFamily(value: unknown): OakClientFamily {
  if (typeof value !== 'string') {
    return 'other';
  }

  const normalised = asciiLower(value.trim());
  if (hasClientFamilyPrefix(normalised, 'chatgpt')) {
    return 'chatgpt';
  }
  if (hasClientFamilyPrefix(normalised, 'claude')) {
    return 'claude';
  }
  return 'other';
}

// Tokens must stay evidence-backed: self-declaring client strings, or values
// verified first-hand in live traffic. Unmatched traffic lands in 'other';
// the correction path is a token row plus its derivation-table test row.
const CLIENT_SURFACE_TOKEN_RULES: readonly (readonly [string, OakClientSurface])[] = [
  ['sdk', 'sdk'],
  ['vscode', 'vscode'],
  ['claude-code', 'cli'],
  ['mozilla', 'web'],
];

function isAsciiAlphanumeric(character: string | undefined): boolean {
  return character !== undefined && /[a-z0-9]/u.test(character);
}

function hasTokenSegment(value: string, token: string): boolean {
  let index = value.indexOf(token);
  while (index !== -1) {
    const before = index === 0 ? undefined : value.at(index - 1);
    const after = value.at(index + token.length);
    if (!isAsciiAlphanumeric(before) && !isAsciiAlphanumeric(after)) {
      return true;
    }
    index = value.indexOf(token, index + 1);
  }
  return false;
}

function readClientSurfaceToken(value: unknown): OakClientSurface | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalised = asciiLower(value);
  for (const [token, surface] of CLIENT_SURFACE_TOKEN_RULES) {
    if (hasTokenSegment(normalised, token)) {
      return surface;
    }
  }
  return undefined;
}

export function normaliseOakClientSurface(headerValues: readonly unknown[]): OakClientSurface {
  for (const value of headerValues) {
    const surface = readClientSurfaceToken(value);
    if (surface !== undefined) {
      return surface;
    }
  }
  return 'other';
}

export function isOakClientSurface(value: unknown): value is OakClientSurface {
  return (
    value === 'cli' || value === 'sdk' || value === 'vscode' || value === 'web' || value === 'other'
  );
}

/**
 * Projects the client-identity headers onto the closed product category, via
 * the ONE bounded selection in `client-product-selection.ts` that the rebuilt
 * user agent also derives from, so the two properties always describe the
 * same header value. The evidence-backed token table and its constraints live
 * there.
 *
 * @remarks The two negative outcomes are DISTINCT values, and the line between
 * them is **container readability, never value presence**:
 *
 * - `other` — the container was readable and named no product we recognise,
 *   *including when it carried no client header at all*. Any client may choose
 *   that, so this is a measurement; its share is expected to be non-zero (Oak's
 *   own probes and the browser widget live here).
 * - `unavailable` — the container was missing or opaque to an own-property read,
 *   so this derivation could not run. Only a transport-shape change produces it:
 *   an SDK release that stops populating `requestInfo`, or a move to a
 *   Fetch-native adapter whose `Headers` instance the reader cannot see.
 *
 * Drawing the line at value presence instead — the shape this function had when
 * `unavailable` was introduced — let any client raise the value by omitting its
 * User-Agent. That made a documented transport alarm client-influenceable, which
 * is not an alarm: the same false-green that made `harness = other` unreadable,
 * one layer up. The readability decision therefore belongs at the reader
 * boundary, not here, because only the reader sees which container it was handed.
 *
 * With the line drawn there, a rising `unavailable` share is a genuine alarm on
 * this mechanism's own health, and no client can raise it.
 */
export function normaliseOakClientProduct(headers: ClientIdentityHeaders): OakClientProduct {
  if (!headers.readable) {
    return 'unavailable';
  }
  const selected = selectLeadingProduct(headers);
  if (selected === undefined) {
    return 'other';
  }
  // OpenAI's one client token serves several products and tells them apart in
  // its bracketed surface, exactly as PostHog's own rule splits them; any other
  // token names its product outright. The split is gated on the same version
  // parse the rebuilt user agent uses, so a value whose surface the user agent
  // would drop is not refined here either and the two never disagree.
  const [token] = selected.rule;
  if (
    token === 'openai-mcp' &&
    readClientMajorVersion(selected.normalised.slice(token.length)) !== undefined
  ) {
    const surface = readFirstBracketedSegment(selected.normalised);
    if (surface === 'chatgpt') {
      return 'chatgpt';
    }
    if (surface === 'codex') {
      return 'codex';
    }
  }
  return selected.rule[1];
}

export function isOakClientFamily(value: unknown): value is OakClientFamily {
  return value === 'chatgpt' || value === 'claude' || value === 'other';
}

export function isOakClientProduct(value: unknown): value is OakClientProduct {
  return (
    value === 'chatgpt' ||
    value === 'openai' ||
    value === 'claude_ai' ||
    value === 'claude_code' ||
    value === 'codex' ||
    value === 'other' ||
    value === 'unavailable'
  );
}
