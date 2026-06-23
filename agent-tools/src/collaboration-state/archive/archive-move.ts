/**
 * Plan orchestrator for the WS7 class-tiered archive-move (ADR-199 §Decision;
 * PDR-094): composes the pure {@link decideDisposition} core with the filesystem
 * and the fail-closed provenance gate to produce a **plan** — the events that
 * leave `comms/`, their `manifest.jsonl` rows, the events awaiting a disposition,
 * and the byte-preservation prediction.
 *
 * @remarks
 * Mirrors `provenance-scan.ts`: IO-free over the injectable {@link ArchiveMoveIo}
 * seam, returns the repository {@link Result} type (ADR-088), never throws, and
 * fails closed (a typed {@link ArchiveMoveError}, never a partial plan). The
 * provenance gate is composed **inside** the plan path as the single fail-closed
 * precondition for any move. Planning only — execution lives in the bin. The
 * public type contract lives in `archive-move-types.ts`.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';

import { normaliseEventId } from '../provenance/cited-event-provenance.js';
import type { ProvenanceCheckReport, ProvenanceScanError } from '../provenance/provenance-scan.js';
import type {
  ArchiveMoveError,
  ArchiveMoveIo,
  ArchiveMovePlan,
  ArchiveMovePlanRequest,
  ManifestRow,
  PlannedMove,
} from './archive-move-types.js';
import {
  decideDisposition,
  type ClassifiableEvent,
  type DispositionDecision,
  type DispositionReason,
  type RecordedDisposition,
} from './event-classification.js';

const EVENT_FILE_SUFFIX = '.json';
const TMP_NAME_FRAGMENT = '.tmp-';
const EIGHT_HEX_ID = /^[0-9a-f]{8}$/;

interface ReadEvent {
  readonly filename: string;
  readonly event: ClassifiableEvent;
}

interface Preliminary {
  readonly re: ReadEvent;
  readonly decision: DispositionDecision;
}

/**
 * A `.json` whose stem normalises to an 8-hex id; skips `active-claims.json` and
 * temp writes. Exported so the node IO counts the same event-file set for the
 * byte-preservation invariant (never `manifest.jsonl` / `.gitkeep`).
 */
export function isEventFile(name: string): boolean {
  if (!name.endsWith(EVENT_FILE_SUFFIX) || name.includes(TMP_NAME_FRAGMENT)) {
    return false;
  }
  return EIGHT_HEX_ID.test(normaliseEventId(name.slice(0, -EVENT_FILE_SUFFIX.length)));
}

/** Read every event file in the comms dir, failing closed on the first unreadable file. */
function readAllEvents(
  request: ArchiveMovePlanRequest,
  io: ArchiveMoveIo,
): Result<ReadEvent[], ArchiveMoveError> {
  const listed = io.listEventFilenames(request.commsDir);
  if (!listed.ok) {
    return err({ kind: 'comms-unreadable', dir: request.commsDir, cause: listed.error });
  }
  const events: ReadEvent[] = [];
  for (const filename of listed.value) {
    if (!isEventFile(filename)) {
      continue;
    }
    const path = `${request.commsDir}/${filename}`;
    const event = io.readEvent(path);
    if (!event.ok) {
      return err({ kind: 'event-unreadable', path, cause: event.error });
    }
    events.push({ filename, event: event.value });
  }
  return ok(events);
}

/** Decide one event, threading its ledger entry (if any) into the gate inputs. */
function decideForEvent(
  read: ReadEvent,
  request: ArchiveMovePlanRequest,
  provenanceViolation: boolean,
): DispositionDecision {
  const entry = request.ledger.get(read.event.eventId);
  return decideDisposition({
    event: read.event,
    nowMs: request.nowMs,
    windows: request.windows,
    routineBodyLengthThreshold: request.routineBodyLengthThreshold,
    recordedDisposition: entry?.disposition ?? null,
    heartbeatAggregateExtracted: request.heartbeatAggregateExtracted,
    bodyReadConfirmed: entry?.bodyReadConfirmed ?? false,
    provenanceViolation,
  });
}

/** The manifest row for a planned move; the disposition is supplied (never fabricated). */
function manifestRowFor(
  read: ReadEvent,
  disposition: RecordedDisposition,
  nowMs: number,
): ManifestRow {
  return {
    event_id: read.event.eventId,
    created_at: read.event.createdAt,
    kind: read.event.kind,
    tags: read.event.tags,
    archived_at: new Date(nowMs).toISOString(),
    disposition,
  };
}

interface Partition {
  readonly decisions: DispositionDecision[];
  readonly toMove: PlannedMove[];
  readonly awaitingDisposition: string[];
  readonly blocked: { eventId: string; reason: DispositionReason }[];
}

/** The recorded disposition for an event, or a fail-closed error if a move lacks one. */
function moveDisposition(
  re: ReadEvent,
  request: ArchiveMovePlanRequest,
): Result<RecordedDisposition, ArchiveMoveError> {
  const entry = request.ledger.get(re.event.eventId);
  return entry
    ? ok(entry.disposition)
    : err({ kind: 'move-without-disposition', eventId: re.event.eventId });
}

/** Re-block any cited-uncovered violator, then sort each event into its outcome bucket. */
function partition(
  preliminary: readonly Preliminary[],
  request: ArchiveMovePlanRequest,
  violations: ReadonlySet<string>,
): Result<Partition, ArchiveMoveError> {
  const out: Partition = { decisions: [], toMove: [], awaitingDisposition: [], blocked: [] };
  for (const { re, decision: prelim } of preliminary) {
    const decision = violations.has(normaliseEventId(re.event.eventId))
      ? decideForEvent(re, request, true)
      : prelim;
    out.decisions.push(decision);
    if (decision.action === 'archive-move') {
      const disposition = moveDisposition(re, request);
      if (!disposition.ok) {
        return disposition;
      }
      const row = manifestRowFor(re, disposition.value, request.nowMs);
      out.toMove.push({ eventId: re.event.eventId, filename: re.filename, row });
    } else if (decision.reason === 'awaiting-disposition') {
      out.awaitingDisposition.push(re.event.eventId);
    } else if (decision.action === 'blocked') {
      out.blocked.push({ eventId: re.event.eventId, reason: decision.reason });
    }
  }
  return ok(out);
}

/**
 * Assemble the archive-move plan: read every live event, classify each, run the
 * fail-closed provenance gate over the move candidates (re-blocking any cited
 * event the digest does not cover), and partition into moves / awaiting / blocked
 * with the manifest rows and byte-preservation prediction.
 */
export function planArchiveMove(
  request: ArchiveMovePlanRequest,
  io: ArchiveMoveIo,
  checkProvenance: (
    candidateEventIds: readonly string[],
  ) => Result<ProvenanceCheckReport, ProvenanceScanError>,
): Result<ArchiveMovePlan, ArchiveMoveError> {
  const read = readAllEvents(request, io);
  if (!read.ok) {
    return read;
  }
  const preliminary: Preliminary[] = read.value.map((re) => ({
    re,
    decision: decideForEvent(re, request, false),
  }));
  const candidates = preliminary
    .filter((p) => p.decision.action === 'archive-move')
    .map((p) => p.re.event.eventId);

  const provenance = checkProvenance(candidates);
  if (!provenance.ok) {
    return err({ kind: 'provenance-scan-failed', error: provenance.error });
  }
  const archiveCount = io.countEventFiles(request.archiveDir);
  if (!archiveCount.ok) {
    return err({ kind: 'count-unreadable', dir: request.archiveDir, cause: archiveCount.error });
  }

  const partitioned = partition(preliminary, request, new Set(provenance.value.violations));
  if (!partitioned.ok) {
    return partitioned;
  }
  const part = partitioned.value;
  const commsAfter = read.value.length - part.toMove.length;
  const archiveAfter = archiveCount.value + part.toMove.length;
  const preMoveTotal = read.value.length + archiveCount.value;
  return ok({
    ...part,
    provenance: provenance.value,
    bytePreservation: {
      preMoveTotal,
      commsAfter,
      archiveAfter,
      balanced: commsAfter + archiveAfter === preMoveTotal,
    },
  });
}
