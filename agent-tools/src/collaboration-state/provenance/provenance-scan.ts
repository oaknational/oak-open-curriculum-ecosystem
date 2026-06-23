/**
 * IO/scan layer of the WS7 pre-archive-move provenance check
 * (ADR-199 §"Provenance survivor" / PDR-094 Invariant 3).
 *
 * @remarks
 * The pure core in `cited-event-provenance.ts` holds the deterministic set
 * algebra; this module assembles the three sets it needs from the filesystem:
 *
 * - **known events** — 8-hex id prefixes of the files in `comms/` plus
 *   `comms-archive/` (so a re-run after a partial move still recognises events);
 * - **cited events** — 8-hex tokens in permanent records (ADRs / PDRs / patterns,
 *   the ADR-199 default scope) intersected with the known set, dropping
 *   coincidental tokens and full-length git SHAs;
 * - **covered events** — events whose provenance survives a clean checkout, read
 *   from the git-tracked digest `.agent/reference/comms-cited-events.md`.
 *
 * The check is **fail-closed**: an unreadable surface returns a typed
 * {@link ProvenanceScanError} rather than a report, so a pass can never silently
 * claim "no violations" over docs it could not read. Error handling follows the
 * repository {@link Result} pattern (ADR-088): nothing here throws. This module
 * is IO-free — the `node:fs`-backed {@link ProvenanceScanIo} lives in
 * `provenance-scan-node.ts`, the one place where a throwing library is
 * translated into the `Result` pattern.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';

import {
  extractEventIdTokens,
  findUncoveredCitedEvents,
  normaliseEventId,
} from './cited-event-provenance.js';

const EVENT_FILE_SUFFIX = '.json';
const EIGHT_HEX_ID = /^[0-9a-f]{8}$/;

/**
 * Reduce a directory of comms-event filenames to the set of 8-hex event-id
 * prefixes. Non-`.json` entries and `.json` files whose stem is not an
 * 8-hex-prefixed id (e.g. `active-claims.json`) are ignored.
 */
export function collectKnownEventIds(filenames: Iterable<string>): Set<string> {
  const ids = new Set<string>();
  for (const name of filenames) {
    if (!name.endsWith(EVENT_FILE_SUFFIX)) {
      continue;
    }
    const prefix = normaliseEventId(name.slice(0, -EVENT_FILE_SUFFIX.length));
    if (EIGHT_HEX_ID.test(prefix)) {
      ids.add(prefix);
    }
  }
  return ids;
}

/**
 * Return the 8-hex tokens in `text` that are known event ids — the citation
 * signal (over a permanent record) or coverage signal (over the digest).
 * Intersecting with `knownEventIds` drops coincidental 8-hex tokens; the pure
 * core's bounded extraction already excludes longer hex runs such as git SHAs.
 */
export function findKnownEventTokens(
  text: string,
  knownEventIds: ReadonlySet<string>,
): Set<string> {
  const found = new Set<string>();
  for (const token of extractEventIdTokens(text)) {
    if (knownEventIds.has(token)) {
      found.add(token);
    }
  }
  return found;
}

/**
 * Filesystem seam for {@link runProvenanceCheck}. Each fallible read returns a
 * {@link Result} so the orchestrator never throws; `exists` is total. Tests pass
 * an in-memory implementation; {@link createNodeProvenanceScanIo} provides the
 * `node:fs`-backed one.
 */
export interface ProvenanceScanIo {
  /** List the filenames directly inside a comms event directory. */
  readonly listEventFilenames: (eventDir: string) => Result<readonly string[], string>;
  /** List the Markdown file paths under a permanent-record root (recursively). */
  readonly listDocPaths: (docRoot: string) => Result<readonly string[], string>;
  /** Read a UTF-8 text file. */
  readonly readText: (path: string) => Result<string, string>;
  /** Whether a path exists. */
  readonly exists: (path: string) => boolean;
}

/** Inputs to a single provenance-check pass. */
export interface ProvenanceCheckRequest {
  /** Directories whose filenames define the known-event set (`comms/`, `comms-archive/`). */
  readonly eventDirs: readonly string[];
  /** Permanent-record roots scanned for citations (ADRs / PDRs / patterns by default). */
  readonly docRoots: readonly string[];
  /** Path to the git-tracked cited-events digest (the coverage ledger). */
  readonly digestPath: string;
  /** Event ids about to leave the tracked stream in this pass. */
  readonly candidateEventIds: Iterable<string>;
}

/** Outcome of a successful provenance-check pass. */
export interface ProvenanceCheckReport {
  /** Count of distinct known events across the scanned event directories. */
  readonly knownCount: number;
  /** Sorted 8-hex ids cited in the scanned permanent records. */
  readonly citedEventIds: readonly string[];
  /** Sorted 8-hex ids whose provenance the digest covers. */
  readonly coveredEventIds: readonly string[];
  /** Count of distinct candidate ids in this pass. */
  readonly candidateCount: number;
  /** Sorted 8-hex ids that are cited, in the candidate set, and uncovered — the move is refused. */
  readonly violations: readonly string[];
}

/** Typed failure of a provenance-check pass (fail-closed; never a silent pass). */
export type ProvenanceScanError =
  | { readonly kind: 'event-dir-unreadable'; readonly dir: string; readonly cause: string }
  | { readonly kind: 'doc-root-unreadable'; readonly root: string; readonly cause: string }
  | { readonly kind: 'doc-unreadable'; readonly path: string; readonly cause: string }
  | { readonly kind: 'digest-unreadable'; readonly path: string; readonly cause: string };

function sortedPrefixes(ids: Iterable<string>): string[] {
  return [...ids].sort((a, b) => a.localeCompare(b));
}

/** Union the known-event ids across every event directory (fail-closed). */
function collectKnownEventSet(
  eventDirs: readonly string[],
  io: ProvenanceScanIo,
): Result<Set<string>, ProvenanceScanError> {
  const known = new Set<string>();
  for (const dir of eventDirs) {
    const listed = io.listEventFilenames(dir);
    if (!listed.ok) {
      return err({ kind: 'event-dir-unreadable', dir, cause: listed.error });
    }
    for (const id of collectKnownEventIds(listed.value)) {
      known.add(id);
    }
  }
  return ok(known);
}

/** Union the cited known-event ids across every permanent-record doc (fail-closed). */
function collectCitedEventSet(
  docRoots: readonly string[],
  known: ReadonlySet<string>,
  io: ProvenanceScanIo,
): Result<Set<string>, ProvenanceScanError> {
  const cited = new Set<string>();
  for (const root of docRoots) {
    const paths = io.listDocPaths(root);
    if (!paths.ok) {
      return err({ kind: 'doc-root-unreadable', root, cause: paths.error });
    }
    for (const path of paths.value) {
      const text = io.readText(path);
      if (!text.ok) {
        return err({ kind: 'doc-unreadable', path, cause: text.error });
      }
      for (const token of findKnownEventTokens(text.value, known)) {
        cited.add(token);
      }
    }
  }
  return ok(cited);
}

/** Read the digest's covered known-event ids; an absent digest is zero coverage. */
function collectCoverageSet(
  digestPath: string,
  known: ReadonlySet<string>,
  io: ProvenanceScanIo,
): Result<Set<string>, ProvenanceScanError> {
  if (!io.exists(digestPath)) {
    return ok(new Set());
  }
  const digestText = io.readText(digestPath);
  if (!digestText.ok) {
    return err({ kind: 'digest-unreadable', path: digestPath, cause: digestText.error });
  }
  return ok(findKnownEventTokens(digestText.value, known));
}

/**
 * Run one fail-closed provenance-check pass. Returns the report (with any
 * {@link ProvenanceCheckReport.violations}) on success, or a typed
 * {@link ProvenanceScanError} if any required surface could not be read — in
 * which case the caller must treat the move as unsafe.
 */
export function runProvenanceCheck(
  request: ProvenanceCheckRequest,
  io: ProvenanceScanIo,
): Result<ProvenanceCheckReport, ProvenanceScanError> {
  const known = collectKnownEventSet(request.eventDirs, io);
  if (!known.ok) {
    return known;
  }
  const cited = collectCitedEventSet(request.docRoots, known.value, io);
  if (!cited.ok) {
    return cited;
  }
  const covered = collectCoverageSet(request.digestPath, known.value, io);
  if (!covered.ok) {
    return covered;
  }
  const candidates = new Set([...request.candidateEventIds].map(normaliseEventId));
  const violations = findUncoveredCitedEvents({
    citedEventIds: cited.value,
    candidateEventIds: candidates,
    coveredEventIds: covered.value,
  });
  return ok({
    knownCount: known.value.size,
    citedEventIds: sortedPrefixes(cited.value),
    coveredEventIds: sortedPrefixes(covered.value),
    candidateCount: candidates.size,
    violations,
  });
}
