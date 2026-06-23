import { describe, expect, it } from 'vitest';

import { ok, err, type Result } from '@oaknational/result';

import {
  isEventFile,
  planArchiveMove,
} from '../../../src/collaboration-state/archive/archive-move';
import type {
  ArchiveMoveIo,
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
const DAY_MS = 24 * HOUR_MS;
const WINDOWS: RetentionWindows = { heartbeatMs: 48 * HOUR_MS, coordinationMs: 7 * DAY_MS };
const NOW_MS = Date.parse('2026-06-14T12:00:00Z');
const COMMS_DIR = '.agent/state/collaboration/comms';
const ARCHIVE_DIR = '.agent/state/collaboration/comms-archive';

function ev(overrides: Partial<ClassifiableEvent> & { eventId: string }): ClassifiableEvent {
  return {
    kind: 'narrative',
    createdAt: '2026-06-01T00:00:00Z',
    tags: [],
    titleOrSubject: 'WS status',
    bodyLength: 100,
    ...overrides,
  };
}

/** In-memory IO seam: a fixed set of live events keyed by filename, plus an archive count. */
function memoryIo(events: ClassifiableEvent[], archiveCount = 0): ArchiveMoveIo {
  const byFilename = new Map(events.map((e) => [`${e.eventId}.json`, e]));
  return {
    listEventFilenames: () => ok([...byFilename.keys(), 'active-claims.json', 'x.tmp-123.json']),
    readEvent: (path) => {
      const filename = path.slice(COMMS_DIR.length + 1);
      const event = byFilename.get(filename);
      return event ? ok(event) : err(`no such event: ${path}`);
    },
    countEventFiles: () => ok(archiveCount),
  };
}

const cleanReport = (candidates: readonly string[]): ProvenanceCheckReport => ({
  knownCount: candidates.length,
  citedEventIds: [],
  coveredEventIds: [],
  candidateCount: candidates.length,
  violations: [],
});

const passProvenance = (
  candidates: readonly string[],
): Result<ProvenanceCheckReport, ProvenanceScanError> => ok(cleanReport(candidates));

function request(overrides: Partial<ArchiveMovePlanRequest> = {}): ArchiveMovePlanRequest {
  return {
    commsDir: COMMS_DIR,
    archiveDir: ARCHIVE_DIR,
    nowMs: NOW_MS,
    windows: WINDOWS,
    routineBodyLengthThreshold: 500,
    heartbeatAggregateExtracted: true,
    ledger: new Map<string, LedgerEntry>(),
    ...overrides,
  };
}

describe('isEventFile (byte-preservation count covers event files only)', () => {
  it('accepts a .json whose stem normalises to an 8-hex event id', () => {
    expect(isEventFile('aaaaaaaa.json')).toBe(true);
    expect(isEventFile('bfc2bea5-8ee2-494d-a80c-c21adb3086bc.json')).toBe(true);
  });

  it('rejects manifest.jsonl, .gitkeep, and active-claims.json', () => {
    // Galleon fix 3: counting these would double-count and falsely report a
    // balanced move while the real move gains a file.
    expect(isEventFile('manifest.jsonl')).toBe(false);
    expect(isEventFile('.gitkeep')).toBe(false);
    expect(isEventFile('active-claims.json')).toBe(false);
  });

  it('rejects atomic-write temp artefacts', () => {
    expect(isEventFile('aaaaaaaa.tmp-123.json')).toBe(false);
  });
});

describe('planArchiveMove — partitioning', () => {
  it('moves a past-window coordination event with a recorded routine disposition', () => {
    const events = [ev({ eventId: 'aaaaaaaa', createdAt: '2026-06-01T00:00:00Z' })];
    const ledger = new Map<string, LedgerEntry>([
      ['aaaaaaaa', { disposition: 'routine', bodyReadConfirmed: false }],
    ]);
    const result = planArchiveMove(request({ ledger }), memoryIo(events), passProvenance);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.toMove.map((m) => m.eventId)).toEqual(['aaaaaaaa']);
    expect(result.value.toMove[0]?.filename).toBe('aaaaaaaa.json');
  });

  it('keeps a past-window event with no ledger entry on the awaiting-disposition work-list', () => {
    const events = [ev({ eventId: 'bbbbbbbb', createdAt: '2026-06-01T00:00:00Z' })];
    const result = planArchiveMove(request(), memoryIo(events), passProvenance);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.toMove).toEqual([]);
    expect(result.value.awaitingDisposition).toEqual(['bbbbbbbb']);
  });

  it('ignores non-event and temp-write files in the comms directory', () => {
    // memoryIo always lists active-claims.json and an x.tmp-*.json alongside events.
    const events = [ev({ eventId: 'cccccccc', createdAt: '2026-06-13T18:00:00Z' })];
    const result = planArchiveMove(request(), memoryIo(events), passProvenance);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.decisions.map((d) => d.eventId)).toEqual(['cccccccc']);
  });
});

describe('planArchiveMove — provenance gate (fail-closed, re-blocks violators)', () => {
  it('re-blocks a move candidate that the provenance check flags as a cited-uncovered violation', () => {
    const events = [ev({ eventId: 'dddddddd', createdAt: '2026-06-01T00:00:00Z' })];
    const ledger = new Map<string, LedgerEntry>([
      ['dddddddd', { disposition: 'routine', bodyReadConfirmed: false }],
    ]);
    const flagViolation = (candidates: readonly string[]) =>
      ok({ ...cleanReport(candidates), violations: ['dddddddd'] });
    const result = planArchiveMove(request({ ledger }), memoryIo(events), flagViolation);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.toMove).toEqual([]);
    expect(result.value.blocked).toEqual([{ eventId: 'dddddddd', reason: 'provenance-violation' }]);
  });

  it('moves the non-violator and blocks only the violator when several candidates compete', () => {
    const events = [
      ev({ eventId: 'aa000000', createdAt: '2026-06-01T00:00:00Z' }),
      ev({ eventId: 'bb000000', createdAt: '2026-06-01T00:00:00Z' }),
    ];
    const ledger = new Map<string, LedgerEntry>([
      ['aa000000', { disposition: 'routine', bodyReadConfirmed: false }],
      ['bb000000', { disposition: 'routine', bodyReadConfirmed: false }],
    ]);
    const flagOne = (candidates: readonly string[]) =>
      ok({ ...cleanReport(candidates), violations: ['bb000000'] });
    const result = planArchiveMove(request({ ledger }), memoryIo(events), flagOne);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.toMove.map((m) => m.eventId)).toEqual(['aa000000']);
    expect(result.value.blocked).toEqual([{ eventId: 'bb000000', reason: 'provenance-violation' }]);
  });

  it('fails closed when the provenance scan itself errors', () => {
    const events = [ev({ eventId: 'eeeeeeee', createdAt: '2026-06-01T00:00:00Z' })];
    const scanError = (): Result<ProvenanceCheckReport, ProvenanceScanError> =>
      err({ kind: 'digest-unreadable', path: 'digest.md', cause: 'EACCES' });
    const result = planArchiveMove(request(), memoryIo(events), scanError);
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('provenance-scan-failed');
  });
});

describe('planArchiveMove — manifest rows (ADR-199 §3 verbatim fields)', () => {
  it('builds a manifest row carrying event_id, created_at, kind, tags, archived_at, disposition', () => {
    const events = [
      ev({
        eventId: 'ffffffff',
        kind: 'directed',
        createdAt: '2026-06-01T09:30:00Z',
        tags: ['behaviour-note'],
        titleOrSubject: 'reply',
      }),
    ];
    const ledger = new Map<string, LedgerEntry>([
      ['ffffffff', { disposition: 'absorbed', bodyReadConfirmed: true }],
    ]);
    const result = planArchiveMove(request({ ledger }), memoryIo(events), passProvenance);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.toMove[0]?.row).toEqual({
      event_id: 'ffffffff',
      created_at: '2026-06-01T09:30:00Z',
      kind: 'directed',
      tags: ['behaviour-note'],
      archived_at: '2026-06-14T12:00:00.000Z',
      disposition: 'absorbed',
    });
  });
});

describe('planArchiveMove — byte-preservation prediction', () => {
  it('predicts count(comms) + count(comms-archive) is conserved across the move', () => {
    const events = [
      ev({ eventId: 'a0000000', createdAt: '2026-06-01T00:00:00Z' }),
      ev({ eventId: 'a1111111', createdAt: '2026-06-13T18:00:00Z' }), // within window → stays
    ];
    const ledger = new Map<string, LedgerEntry>([
      ['a0000000', { disposition: 'routine', bodyReadConfirmed: false }],
    ]);
    const result = planArchiveMove(request({ ledger }), memoryIo(events, 10), passProvenance);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.bytePreservation).toEqual({
      preMoveTotal: 12, // 2 comms + 10 archive
      commsAfter: 1, // one moved out
      archiveAfter: 11, // one moved in
      balanced: true,
    });
  });
});

describe('planArchiveMove — fail-closed IO', () => {
  it('returns comms-unreadable when the comms directory cannot be listed', () => {
    const io: ArchiveMoveIo = {
      listEventFilenames: () => err('ENOENT'),
      readEvent: () => err('unused'),
      countEventFiles: () => ok(0),
    };
    const result = planArchiveMove(request(), io, passProvenance);
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('comms-unreadable');
  });

  it('returns count-unreadable when the archive directory cannot be counted', () => {
    const events = [ev({ eventId: 'b0000000' })];
    const io: ArchiveMoveIo = {
      ...memoryIo(events),
      countEventFiles: () => err('EACCES'),
    };
    const result = planArchiveMove(request(), io, passProvenance);
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('count-unreadable');
  });
});
