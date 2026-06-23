import { describe, expect, it } from 'vitest';

import { err, ok, type Result } from '@oaknational/result';

import { executeArchiveMove } from '../../../src/collaboration-state/archive/archive-move-execute';
import type {
  ArchiveMoveExecuteIo,
  ArchiveMovePlanRequest,
  LedgerEntry,
} from '../../../src/collaboration-state/archive/archive-move-types';
import type {
  ClassifiableEvent,
  RetentionWindows,
} from '../../../src/collaboration-state/archive/event-classification';
import type {
  ProvenanceCheckReport,
  ProvenanceScanError,
} from '../../../src/collaboration-state/provenance/provenance-scan';

const HOUR_MS = 60 * 60 * 1000;
const WINDOWS: RetentionWindows = { heartbeatMs: 48 * HOUR_MS, coordinationMs: 7 * 24 * HOUR_MS };
const NOW_MS = Date.parse('2026-06-14T12:00:00Z');
const COMMS_DIR = '.agent/state/collaboration/comms';
const ARCHIVE_DIR = '.agent/state/collaboration/comms-archive';

function pastCoordinationEvent(eventId: string): ClassifiableEvent {
  return {
    eventId,
    kind: 'narrative',
    createdAt: '2026-06-01T00:00:00Z',
    tags: [],
    titleOrSubject: 'WS status',
    bodyLength: 100,
  };
}

interface FakeOpts {
  readonly seedManifestIds?: readonly string[];
  readonly seedArchiveCount?: number;
  readonly failAppendFor?: string;
  readonly failMoveFor?: string;
  readonly dropOnMove?: boolean;
}

interface FakeState {
  readonly comms: Map<string, ClassifiableEvent>;
  readonly archive: Set<string>;
  readonly manifestLines: string[];
}

/** Stateful in-memory execute seam: tracks comms/archive membership + the manifest. */
function fakeExecuteIo(
  events: ClassifiableEvent[],
  opts: FakeOpts = {},
): { io: ArchiveMoveExecuteIo; state: FakeState } {
  const comms = new Map(events.map((e) => [`${e.eventId}.json`, e]));
  const archive = new Set<string>();
  const manifestIds = new Set(opts.seedManifestIds ?? []);
  const manifestLines: string[] = [];
  const seedArchive = opts.seedArchiveCount ?? 0;

  const io: ArchiveMoveExecuteIo = {
    listEventFilenames: () => ok([...comms.keys()]),
    readEvent: (path) => {
      const event = comms.get(path.slice(COMMS_DIR.length + 1));
      return event ? ok(event) : err(`no such event: ${path}`);
    },
    countEventFiles: (dir) => (dir === COMMS_DIR ? ok(comms.size) : ok(seedArchive + archive.size)),
    readManifestEventIds: () => ok(new Set(manifestIds)),
    appendManifestRow: (_path, line) => {
      // The event id is embedded in the JSONL row; a substring check avoids
      // parsing (and the banned `as`) — sufficient for the fake's failure switch.
      if (opts.failAppendFor !== undefined && line.includes(opts.failAppendFor)) {
        return err('disk full');
      }
      manifestLines.push(line);
      return ok(undefined);
    },
    moveEventFile: (from) => {
      const filename = from.slice(COMMS_DIR.length + 1);
      if (opts.failMoveFor === filename.replace('.json', '')) {
        return err('EACCES');
      }
      comms.delete(filename);
      if (!opts.dropOnMove) {
        archive.add(filename);
      }
      return ok(undefined);
    },
  };
  return { io, state: { comms, archive, manifestLines } };
}

const passProvenance = (
  candidates: readonly string[],
): Result<ProvenanceCheckReport, ProvenanceScanError> =>
  ok({
    knownCount: candidates.length,
    citedEventIds: [],
    coveredEventIds: [],
    candidateCount: candidates.length,
    violations: [],
  });

function request(ledgerIds: string[]): ArchiveMovePlanRequest {
  const ledger = new Map<string, LedgerEntry>(
    ledgerIds.map((id) => [id, { disposition: 'routine', bodyReadConfirmed: false }]),
  );
  return {
    commsDir: COMMS_DIR,
    archiveDir: ARCHIVE_DIR,
    nowMs: NOW_MS,
    windows: WINDOWS,
    routineBodyLengthThreshold: 500,
    heartbeatAggregateExtracted: true,
    ledger,
  };
}

describe('executeArchiveMove — happy path', () => {
  it('moves every eligible event, appends one manifest row each, and balances byte-preservation', () => {
    const events = [pastCoordinationEvent('aaaaaaaa'), pastCoordinationEvent('bbbbbbbb')];
    const { io, state } = fakeExecuteIo(events, { seedArchiveCount: 10 });
    const result = executeArchiveMove(request(['aaaaaaaa', 'bbbbbbbb']), io, passProvenance);

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.moved).toBe(2);
    expect(result.value.manifestRowsAppended).toBe(2);
    expect(result.value.skippedAlreadyRecorded).toBe(0);
    expect(result.value.bytePreservation).toEqual({
      preMoveTotal: 12,
      commsAfter: 0,
      archiveAfter: 12,
      balanced: true,
    });
    expect(state.comms.size).toBe(0);
    expect(state.archive).toEqual(new Set(['aaaaaaaa.json', 'bbbbbbbb.json']));
    expect(state.manifestLines).toHaveLength(2);
  });
});

describe('executeArchiveMove — idempotency + crash-resume', () => {
  it('is a no-op on re-run once the events have already moved out of comms/', () => {
    const events = [pastCoordinationEvent('aaaaaaaa')];
    const { io } = fakeExecuteIo(events);
    expect(executeArchiveMove(request(['aaaaaaaa']), io, passProvenance).ok).toBe(true);

    const second = executeArchiveMove(request(['aaaaaaaa']), io, passProvenance);
    expect(second.ok).toBe(true);
    if (!second.ok) {
      return;
    }
    expect(second.value.moved).toBe(0);
  });

  it('skips the manifest append for an event already recorded (crash between append and move)', () => {
    // The event is still in comms/ (move did not complete) AND already in the
    // manifest (append did) — a re-run must move it without duplicating the row.
    const events = [pastCoordinationEvent('aaaaaaaa')];
    const { io, state } = fakeExecuteIo(events, { seedManifestIds: ['aaaaaaaa'] });
    const result = executeArchiveMove(request(['aaaaaaaa']), io, passProvenance);

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.moved).toBe(1);
    expect(result.value.manifestRowsAppended).toBe(0);
    expect(result.value.skippedAlreadyRecorded).toBe(1);
    expect(state.manifestLines).toHaveLength(0); // no duplicate row written
  });
});

describe('executeArchiveMove — fail-closed', () => {
  it('does not move an event the provenance gate re-blocks', () => {
    const events = [pastCoordinationEvent('aaaaaaaa')];
    const { io, state } = fakeExecuteIo(events);
    const flag = (candidates: readonly string[]) =>
      ok({
        knownCount: candidates.length,
        citedEventIds: ['aaaaaaaa'],
        coveredEventIds: [],
        candidateCount: candidates.length,
        violations: ['aaaaaaaa'],
      });
    const result = executeArchiveMove(request(['aaaaaaaa']), io, flag);

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.moved).toBe(0);
    expect(state.comms.size).toBe(1); // stayed live
  });

  it('returns manifest-append-failed and stops when a row cannot be appended', () => {
    const events = [pastCoordinationEvent('aaaaaaaa')];
    const { io } = fakeExecuteIo(events, { failAppendFor: 'aaaaaaaa' });
    const result = executeArchiveMove(request(['aaaaaaaa']), io, passProvenance);
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('manifest-append-failed');
  });

  it('returns move-failed when a file cannot be relocated', () => {
    const events = [pastCoordinationEvent('aaaaaaaa')];
    const { io } = fakeExecuteIo(events, { failMoveFor: 'aaaaaaaa' });
    const result = executeArchiveMove(request(['aaaaaaaa']), io, passProvenance);
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('move-failed');
  });

  it('returns byte-preservation-violation when a moved file is lost', () => {
    const events = [pastCoordinationEvent('aaaaaaaa')];
    const { io } = fakeExecuteIo(events, { dropOnMove: true });
    const result = executeArchiveMove(request(['aaaaaaaa']), io, passProvenance);
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('byte-preservation-violation');
  });
});
