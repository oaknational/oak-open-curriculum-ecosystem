/**
 * Public type contract for the WS7 class-tiered archive-move
 * (ADR-199 §Decision; PDR-094) — the injectable IO seam, the plan request, the
 * manifest row, and the plan / error results consumed by `archive-move.ts` and
 * its node boundary. Kept separate from the orchestration logic so each module
 * stays cohesive and within the workspace size budget.
 *
 * @packageDocumentation
 */

import type { Result } from '@oaknational/result';

import type { ProvenanceCheckReport, ProvenanceScanError } from '../provenance/provenance-scan.js';
import type {
  ClassifiableEvent,
  DispositionDecision,
  DispositionReason,
  RecordedDisposition,
  RetentionWindows,
} from './event-classification.js';

/** A recorded disposition for one event (the absorption-gate ledger entry). */
export interface LedgerEntry {
  readonly disposition: RecordedDisposition;
  readonly bodyReadConfirmed: boolean;
}

/** Filesystem seam for the plan orchestrator; tests pass an in-memory implementation. */
export interface ArchiveMoveIo {
  readonly listEventFilenames: (commsDir: string) => Result<readonly string[], string>;
  readonly readEvent: (path: string) => Result<ClassifiableEvent, string>;
  readonly countEventFiles: (dir: string) => Result<number, string>;
}

/** Inputs to a single archive-move plan. */
export interface ArchiveMovePlanRequest {
  readonly commsDir: string;
  readonly archiveDir: string;
  /** Pass clock (ms since epoch); also stamped into each manifest `archived_at`. */
  readonly nowMs: number;
  readonly windows: RetentionWindows;
  readonly routineBodyLengthThreshold: number;
  readonly heartbeatAggregateExtracted: boolean;
  /** Recorded dispositions by event id; events absent from the map stay live. */
  readonly ledger: ReadonlyMap<string, LedgerEntry>;
}

/** One row of `comms-archive/manifest.jsonl` (ADR-199 §Decision item 3, verbatim fields). */
export interface ManifestRow {
  readonly event_id: string;
  readonly created_at: string;
  readonly kind: string;
  readonly tags: readonly string[];
  readonly archived_at: string;
  readonly disposition: RecordedDisposition;
}

/** An event selected to leave the live stream, with its file and manifest row. */
export interface PlannedMove {
  readonly eventId: string;
  readonly filename: string;
  readonly row: ManifestRow;
}

/** Predicted file-count balance for `count(comms) + count(comms-archive) == pre-move`. */
interface BytePreservationPrediction {
  readonly preMoveTotal: number;
  readonly commsAfter: number;
  readonly archiveAfter: number;
  readonly balanced: boolean;
}

/** The computed plan for one pass. */
export interface ArchiveMovePlan {
  readonly decisions: readonly DispositionDecision[];
  readonly toMove: readonly PlannedMove[];
  /** Event ids past their window with no recorded disposition — the curator's work-list. */
  readonly awaitingDisposition: readonly string[];
  readonly blocked: readonly { readonly eventId: string; readonly reason: DispositionReason }[];
  readonly provenance: ProvenanceCheckReport;
  readonly bytePreservation: BytePreservationPrediction;
}

/** Typed failure of plan assembly (fail-closed; never a partial plan). */
export type ArchiveMoveError =
  | { readonly kind: 'comms-unreadable'; readonly dir: string; readonly cause: string }
  | { readonly kind: 'event-unreadable'; readonly path: string; readonly cause: string }
  | { readonly kind: 'count-unreadable'; readonly dir: string; readonly cause: string }
  | { readonly kind: 'provenance-scan-failed'; readonly error: ProvenanceScanError }
  // An archive-move decision with no recorded disposition (an absorption-gate
  // invariant breach). The manifest is the Inv-1 ledger, so the plan fails closed
  // here rather than fabricating a disposition.
  | { readonly kind: 'move-without-disposition'; readonly eventId: string }
  // Execute-phase failures (slice 4): the manifest could not be read, a row could
  // not be appended, a file could not be moved, or the post-move byte-preservation
  // invariant diverged — each aborts the pass fail-closed.
  | { readonly kind: 'manifest-unreadable'; readonly path: string; readonly cause: string }
  | { readonly kind: 'manifest-append-failed'; readonly eventId: string; readonly cause: string }
  | { readonly kind: 'move-failed'; readonly eventId: string; readonly cause: string }
  | {
      readonly kind: 'byte-preservation-violation';
      readonly preMoveTotal: number;
      readonly commsAfter: number;
      readonly archiveAfter: number;
    };

/**
 * Execute-phase filesystem seam: the read-only {@link ArchiveMoveIo} plus the
 * three mutating operations the move needs. Planning takes the base interface;
 * only execution takes this wider one, so plan-only callers/tests are unaffected.
 */
export interface ArchiveMoveExecuteIo extends ArchiveMoveIo {
  /** Event ids already recorded in the manifest (empty set if the file is absent). */
  readonly readManifestEventIds: (manifestPath: string) => Result<ReadonlySet<string>, string>;
  /** Append one JSONL line to the manifest, creating it if absent. */
  readonly appendManifestRow: (manifestPath: string, jsonLine: string) => Result<void, string>;
  /** Move an event file from the live stream into the archive. */
  readonly moveEventFile: (fromPath: string, toPath: string) => Result<void, string>;
}

/** Actual post-move file-count balance (the byte-preservation assertion result). */
interface BytePreservationResult {
  readonly preMoveTotal: number;
  readonly commsAfter: number;
  readonly archiveAfter: number;
  readonly balanced: boolean;
}

/** Outcome of a successful execute pass. */
export interface ArchiveMoveExecuteReport {
  /** Files moved from `comms/` into the archive this pass. */
  readonly moved: number;
  /** Manifest rows appended this pass (excludes ids already recorded by a prior pass). */
  readonly manifestRowsAppended: number;
  /** Move candidates already recorded in the manifest (idempotent re-run / crash-resume). */
  readonly skippedAlreadyRecorded: number;
  readonly bytePreservation: BytePreservationResult;
}
