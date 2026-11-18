/**
 * Section classification for the under-the-hood MCP content digest.
 *
 * The canonical skill (`.agent/skills/orientation/under-the-hood/SKILL-CANONICAL.md`) is
 * written for a local-checkout audience. The MCP server serves a DIGEST of it:
 * the audience-independent orientation method plus the factual-reference map,
 * with every checkout-bound or fetch-instructing section excluded (Anthropic
 * Software Directory policy §2.F, "Instructional Software must not direct
 * Claude to dynamically pull behavioral instructions from external sources
 * for Claude to execute" —
 * https://support.claude.com/en/articles/13145358-anthropic-software-directory-policy;
 * owner ruling 2026-07-29: the method is baked, factual public-document
 * references remain as citations).
 *
 * Classification is TOTAL and enforced at generation: every canonical H1–H3
 * heading must appear in exactly one of the two lists below. An unclassified
 * heading, a heading in both lists, a listed heading no longer in the
 * canonical (served or excluded), or a deeper-than-H3 heading inside a served
 * section all fail generation loudly — a deliberate decision forcing-function,
 * not an inconvenience.
 */

/** Headings whose sections are served in the MCP digest, in canonical order. */
export const SERVED_SECTION_HEADINGS: readonly string[] = [
  '# Oak: Under the Hood — the orientation lens',
  '## The Front Door (discernment contract)',
  '### What to discern',
  '## The Three Delivery Modes',
  '### Delivery grain — progressive disclosure, not walls of text (and not menus)',
  '### Specific answer',
  '### Area overview',
  '### Guided tour',
  '### Topic recipes (shared by tour and overview)',
  '## Router Principle',
  '### The document map (topic → source)',
  '## Headline Invariants (point to the single source — never restate them here)',
  '## Honesty Invariants',
];

/**
 * Headings whose sections are excluded from the MCP digest, each with the
 * reason the exclusion exists. The reasons are load-bearing review context
 * for the compliance audience, not commentary.
 */
export const EXCLUDED_SECTION_HEADINGS: ReadonlyMap<string, string> = new Map([
  [
    '## Setup (a distinct, go-ahead-gated capability — not an information mode)',
    'machine-state probes and guided command execution; not servable to remote MCP clients',
  ],
  [
    '### Reaching the sources',
    'read-local vs fetch-raw-GitHub reachability mechanics (the fetch-instruction shape §2.F ' +
      'forbids) plus the checkout-bound mismatch-flagging protocol; the factual document map ' +
      'beside it is served',
  ],
  ['## Access-Aware Fork (teammate vs external visitor)', 'teammate-checkout routing machinery'],
  [
    '## Re-entry and Personal State',
    'instructs local personal-state file writes; meaningless without a checkout',
  ],
  ['## The Primer Edge (PDR-112)', 'repo-skill routing across the portability seam'],
  ['## Completion', 'local session vocabulary (slash command, session bookends)'],
  [
    '## Failure Handling',
    'local-checkout doc-read failure protocol referencing an internal register path',
  ],
  ['## Platform Adapters', 'repo build machinery'],
]);
