/**
 * Pure core of the WS7 pre-archive-move provenance check
 * (ADR-199 §"Provenance survivor" / PDR-094 Invariant 3).
 *
 * @remarks
 * Comms events cited by 8-hex id in permanent docs (ADRs / PDRs / patterns) must
 * stay resolvable after the events leave the git-tracked live stream (the Phase-2
 * archive-move and the Phase-3 `.agent/state/` untrack). The check refuses to move
 * any cited event whose provenance is not preserved — by an inline excerpt or a
 * fallback entry in the git-tracked digest `.agent/reference/comms-cited-events.md`
 * (outside `.agent/state/`).
 *
 * This module holds only the deterministic set algebra and token extraction, so it
 * is unit-testable with no IO. The scan over docs, the digest read, and the event
 * enumeration are assembled by the caller (the curator-pass rotation machinery).
 *
 * @packageDocumentation
 */

/**
 * Reduce any event id (a full UUID or an already-8-hex prefix) to its lowercased
 * 8-hex prefix — the canonical comparison key for citations, candidates, and
 * coverage entries alike.
 */
export function normaliseEventId(id: string): string {
  return id.slice(0, 8).toLowerCase();
}

const EVENT_ID_TOKEN = /\b[0-9a-f]{8}\b/gi;

/**
 * Extract the set of 8-hex event-id tokens cited in a block of prose.
 *
 * Only exactly-8-hex bounded tokens are returned (the event-id-prefix
 * convention); shorter runs and longer hex runs — including full-length git
 * SHAs — are excluded by construction. The caller intersects the result with the
 * known event set to drop any remaining coincidental 8-hex matches.
 */
export function extractEventIdTokens(text: string): Set<string> {
  const tokens = new Set<string>();
  for (const match of text.matchAll(EVENT_ID_TOKEN)) {
    tokens.add(match[0].toLowerCase());
  }
  return tokens;
}

/** Inputs to {@link findUncoveredCitedEvents}; each id may be a UUID or a prefix. */
export interface UncoveredCitedEventsInput {
  /** Event ids cited in permanent docs (ADRs / PDRs / patterns). */
  readonly citedEventIds: Iterable<string>;
  /** Event ids about to leave the tracked live stream (archive-move / untrack). */
  readonly candidateEventIds: Iterable<string>;
  /** Event ids whose provenance is preserved (digest entry or inline coverage). */
  readonly coveredEventIds: Iterable<string>;
}

/**
 * Return the sorted 8-hex prefixes of events that are cited in permanent docs AND
 * about to leave the tracked stream AND not covered — the set the check refuses to
 * move (PDR-094 Invariant 3). A cited event that stays live, or whose provenance
 * is covered, is not a violation.
 */
export function findUncoveredCitedEvents(input: UncoveredCitedEventsInput): string[] {
  const cited = new Set([...input.citedEventIds].map(normaliseEventId));
  const candidates = new Set([...input.candidateEventIds].map(normaliseEventId));
  const covered = new Set([...input.coveredEventIds].map(normaliseEventId));
  const violations: string[] = [];
  for (const id of cited) {
    if (candidates.has(id) && !covered.has(id)) {
      violations.push(id);
    }
  }
  return violations.sort((a, b) => a.localeCompare(b));
}
