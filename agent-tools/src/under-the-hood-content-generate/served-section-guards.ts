/**
 * Guards over the content of SERVED sections. The classification lists in
 * `sections.ts` decide WHICH sections ship; these guards fail generation when
 * a served section carries a shape that must not ship — a deeper-than-H3
 * heading (content that dodged the classification grain) or an absolute URL
 * outside the served-citation allowlist (the fetch-instruction shape
 * directory policy §2.F forbids). Excluded sections are exempt: their
 * content never ships.
 */
import { createFenceTracker, type CanonicalSection } from './canonical-parser.js';

/** The first served-section content defect, or undefined when all bodies are clean. */
export function servedSectionDefect(
  sections: readonly CanonicalSection[],
  served: readonly string[],
): string | undefined {
  return servedDeepHeadingDefect(sections, served) ?? servedUrlDefect(sections, served);
}

/**
 * A `####`-or-deeper heading inside a SERVED section would ship in the digest
 * with no classification decision; fail loudly and ask for promotion to the
 * H1–H3 classification grain.
 */
function servedDeepHeadingDefect(
  sections: readonly CanonicalSection[],
  served: readonly string[],
): string | undefined {
  for (const section of sections) {
    if (!served.includes(section.heading)) {
      continue;
    }
    const deep = deepHeadingsOutsideFences(section.lines);
    if (deep.length > 0) {
      return (
        `Heading(s) deeper than the H1–H3 classification grain inside the served section ` +
        `"${section.heading}" — promote each to its own classified H1–H3 section, or fold ` +
        `it into prose:\n${deep.join('\n')}`
      );
    }
  }
  return undefined;
}

/**
 * Fences are tracked per section body via the parser's shared
 * `createFenceTracker`; a fence opened in one section and closed in another
 * is malformed markdown this scan does not model (`splitSections` tracks
 * fences globally). Heading detection covers CommonMark's ATX forms (space,
 * tab, or end-of-line after the hashes), matching the section split.
 */
function deepHeadingsOutsideFences(lines: readonly string[]): readonly string[] {
  const found: string[] = [];
  const fenced = createFenceTracker();
  for (const line of lines) {
    if (!fenced(line) && /^#{4,6}(?:[ \t]|$)/.test(line)) {
      found.push(line);
    }
  }
  return found;
}

/**
 * The only absolute-URL prefixes a SERVED section may carry: Oak's own public
 * pages and this server's own address — the factual citations the owner ruling
 * retains. Everything else fails generation: this list cannot be bypassed by
 * enumerating new fetch HOSTS (raw-GitHub, the Contents API, gists, …) the way
 * a deny-list can (directory policy §2.F). Additions here are deliberate
 * compliance decisions, reviewed like the section classification itself — so
 * each entry states the reason it was admitted. That is the same
 * reason-per-entry discipline `EXCLUDED_SECTION_HEADINGS` keeps in
 * `sections.ts`, but not the same mechanism: there the reasons are Map values
 * a generation failure quotes back, here they are comments nothing consumes.
 *
 * That host-enumeration soundness is the only completeness this list claims.
 * It says nothing about the tokeniser that feeds it: `ABSOLUTE_URL` below only
 * matches well-formed explicit-scheme URLs on a single line, and its terminator
 * set is narrow enough that a disallowed URL glued directly onto an allowed one
 * arrives as a single match whose prefix is allowed. Read the two as one
 * mechanism — a sound allowlist behind a permissive tokeniser is only as strong
 * as the tokeniser.
 *
 * SPELLED OUT, never derived from configuration. Reading these prefixes from
 * `CANONICAL_HOST` or any other deployment input would let a configuration
 * change widen a compliance allowlist with nobody reviewing it — the review
 * this docstring requires would be bypassed by the very mechanism meant to
 * keep the list current. A host move is a reviewed edit here, and that cost is
 * what makes the list trustworthy.
 *
 * The trailing slash on every entry is load-bearing, not tidiness. The test is
 * a plain prefix match, so an entry written without it would admit
 * `https://mcp.thenational.academy.example.com/` — the slash is what makes the
 * comparison stop at the authority, and it is why a userinfo `@`, an added
 * port, and a percent-encoded or backslash separator all fail closed. The
 * rejection is pinned in `generator.unit.test.ts`. Its one cost: a citation of
 * a bare origin with no path (`https://mcp.thenational.academy`) fails
 * generation, and the error asks the author to widen the allowlist when adding
 * the slash is the real answer.
 *
 * Every entry is HOST-ONLY, and `isAllowedServedUrl` lower-cases the whole URL
 * rather than just the authority. That is equivalent today; a path-bearing
 * prefix would silently make the comparison case-insensitive over a
 * case-sensitive path, so admit one only with that matcher fixed.
 */
const ALLOWED_SERVED_URL_PREFIXES: readonly string[] = [
  // Oak's public website — the positioning and strategy citations the served
  // document map points at. The MCP host move withdrew `www/mcp` only; Oak's
  // public pages stayed, so this entry stayed with them.
  'https://www.thenational.academy/',
  // The canonical MCP host (MCP-651). Admitted because the `www` origin rule
  // was withdrawn and `www` no longer serves the protocol at all, leaving this
  // the address a client actually reaches — so the digest has to be able to
  // state it. The widening is bounded to this server's OWN origin rather than
  // absent: the entry admits every path here, present and future, so a fetch
  // instruction pointed at a document on this host would pass, and any endpoint
  // that later proxies, mirrors, or echoes caller-supplied content becomes
  // citable in served content with no further review. Re-review this entry when
  // the served surface gains a pass-through.
  'https://mcp.thenational.academy/',
];

/**
 * Absolute-URL matcher; whitespace, backticks, pipes, and a CLOSING paren end a
 * URL. An opening paren does not — it is inside the character class.
 */
const ABSOLUTE_URL = /https?:\/\/[^\s`)|]+/gi;

/**
 * Any absolute URL outside the served-citation allowlist inside a SERVED
 * section is treated as a potential fetch-instruction shape (directory
 * policy §2.F); fail loudly at the generation boundary. Excluded sections
 * legitimately carry fetch mechanics — `### Reaching the sources` is the
 * worked example. Cite repo-relative document paths instead; the tool
 * result's `repositoryUrl` carries the locator.
 */
function servedUrlDefect(
  sections: readonly CanonicalSection[],
  served: readonly string[],
): string | undefined {
  for (const section of sections) {
    if (!served.includes(section.heading)) {
      continue;
    }
    // The heading line ships too — scan it alongside the body.
    const disallowed = [section.heading, ...section.lines]
      .flatMap((line) => [...line.matchAll(ABSOLUTE_URL)].map((match) => match[0]))
      .filter((url) => !isAllowedServedUrl(url));
    if (disallowed.length > 0) {
      return (
        `Absolute URL(s) outside the served-citation allowlist in the served section ` +
        `"${section.heading}" — cite the repo-relative document path (the tool result's ` +
        `repositoryUrl carries the locator), or add a factual Oak citation prefix to the ` +
        `allowlist deliberately:\n${disallowed.join('\n')}`
      );
    }
  }
  return undefined;
}

/** Case-insensitive prefix test (URL hostnames are case-insensitive). */
function isAllowedServedUrl(url: string): boolean {
  const lowered = url.toLowerCase();
  return ALLOWED_SERVED_URL_PREFIXES.some((prefix) => lowered.startsWith(prefix));
}
