/**
 * Execute phase of the WS7 class-tiered archive-move (ADR-199 §Decision;
 * PDR-094) — the one place a planned move actually mutates the filesystem.
 *
 * @remarks
 * `executeArchiveMove` re-plans from the current corpus (so the fail-closed
 * provenance gate re-runs before any file leaves `comms/`, and idempotency /
 * crash-resume falls out for free: an already-moved event is gone from `comms/`
 * and absent from the fresh plan), then for each move records the manifest row
 * and relocates the file. The manifest is the Inv-1 disposition ledger, so the
 * row is recorded **before** the file moves and the append is deduped against
 * ids already in the manifest — a re-run after a crash between append and move
 * neither loses a ledger row nor writes a duplicate. After the moves it asserts
 * byte-preservation first-hand (`count(comms) + count(comms-archive) == pre-move`)
 * and fails closed on divergence. Result-native (ADR-088); nothing throws.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';

import { planArchiveMove } from './archive-move.js';
import type { ProvenanceCheckReport, ProvenanceScanError } from '../provenance/provenance-scan.js';
import type {
  ArchiveMoveError,
  ArchiveMoveExecuteIo,
  ArchiveMoveExecuteReport,
  ArchiveMovePlanRequest,
  PlannedMove,
} from './archive-move-types.js';

const MANIFEST_FILENAME = 'manifest.jsonl';

type CheckProvenance = (
  candidateEventIds: readonly string[],
) => Result<ProvenanceCheckReport, ProvenanceScanError>;

/** Mutable running tally of one execute pass. */
interface ExecuteTally {
  moved: number;
  appended: number;
  skipped: number;
}

/**
 * Record (dedup-safe) then move a single planned event. The manifest row is
 * appended before the file moves so the Inv-1 ledger never loses an entry; ids
 * already recorded are skipped so a re-run never duplicates a row.
 */
function recordAndMove(
  move: PlannedMove,
  request: ArchiveMovePlanRequest,
  io: ArchiveMoveExecuteIo,
  manifestPath: string,
  recorded: Set<string>,
  tally: ExecuteTally,
): Result<void, ArchiveMoveError> {
  if (recorded.has(move.eventId)) {
    tally.skipped += 1;
  } else {
    const appended = io.appendManifestRow(manifestPath, JSON.stringify(move.row));
    if (!appended.ok) {
      return err({ kind: 'manifest-append-failed', eventId: move.eventId, cause: appended.error });
    }
    recorded.add(move.eventId);
    tally.appended += 1;
  }
  const moved = io.moveEventFile(
    `${request.commsDir}/${move.filename}`,
    `${request.archiveDir}/${move.filename}`,
  );
  if (!moved.ok) {
    return err({ kind: 'move-failed', eventId: move.eventId, cause: moved.error });
  }
  tally.moved += 1;
  return ok(undefined);
}

/** Re-count `comms/` + `comms-archive/` and assert the byte-preservation invariant. */
function assertBytePreservation(
  request: ArchiveMovePlanRequest,
  io: ArchiveMoveExecuteIo,
  preMoveTotal: number,
): Result<ArchiveMoveExecuteReport['bytePreservation'], ArchiveMoveError> {
  const commsAfter = io.countEventFiles(request.commsDir);
  if (!commsAfter.ok) {
    return err({ kind: 'count-unreadable', dir: request.commsDir, cause: commsAfter.error });
  }
  const archiveAfter = io.countEventFiles(request.archiveDir);
  if (!archiveAfter.ok) {
    return err({ kind: 'count-unreadable', dir: request.archiveDir, cause: archiveAfter.error });
  }
  if (commsAfter.value + archiveAfter.value !== preMoveTotal) {
    return err({
      kind: 'byte-preservation-violation',
      preMoveTotal,
      commsAfter: commsAfter.value,
      archiveAfter: archiveAfter.value,
    });
  }
  return ok({
    preMoveTotal,
    commsAfter: commsAfter.value,
    archiveAfter: archiveAfter.value,
    balanced: true,
  });
}

/**
 * Execute a class-tiered archive-move pass: re-plan (fail-closed provenance gate),
 * record + move each eligible event, then assert byte-preservation. Returns a
 * typed {@link ArchiveMoveError} on any failure — never a partial-but-claimed-ok
 * pass.
 */
export function executeArchiveMove(
  request: ArchiveMovePlanRequest,
  io: ArchiveMoveExecuteIo,
  checkProvenance: CheckProvenance,
): Result<ArchiveMoveExecuteReport, ArchiveMoveError> {
  const plan = planArchiveMove(request, io, checkProvenance);
  if (!plan.ok) {
    return plan;
  }
  const manifestPath = `${request.archiveDir}/${MANIFEST_FILENAME}`;
  const existing = io.readManifestEventIds(manifestPath);
  if (!existing.ok) {
    return err({ kind: 'manifest-unreadable', path: manifestPath, cause: existing.error });
  }
  const recorded = new Set(existing.value);
  const tally: ExecuteTally = { moved: 0, appended: 0, skipped: 0 };
  for (const move of plan.value.toMove) {
    const stepped = recordAndMove(move, request, io, manifestPath, recorded, tally);
    if (!stepped.ok) {
      return stepped;
    }
  }
  const bytePreservation = assertBytePreservation(
    request,
    io,
    plan.value.bytePreservation.preMoveTotal,
  );
  if (!bytePreservation.ok) {
    return bytePreservation;
  }
  return ok({
    moved: tally.moved,
    manifestRowsAppended: tally.appended,
    skippedAlreadyRecorded: tally.skipped,
    bytePreservation: bytePreservation.value,
  });
}
