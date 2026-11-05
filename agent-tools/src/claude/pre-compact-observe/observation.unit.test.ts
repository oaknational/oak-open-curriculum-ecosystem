import { describe, expect, it } from 'vitest';

import {
  buildPreCompactObservation,
  type PreCompactObservation,
  type PreCompactRawMeasurements,
} from './observation.js';
import type { SiblingEntry } from './siblings.js';

/** Raw measurements as the entry takes them, with the transcript left unmeasured. */
const MEASURED: PreCompactRawMeasurements = {
  time: '2026-09-16T10:11:12.345Z',
  uuid: '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d',
  stdin: { kind: 'read', text: '{"session_id":"session-1"}' },
  environment: { CLAUDE_CODE_SESSION_ID: 'session-1' },
  cwd: '/work/project',
  argv: ['node', 'claude-pre-compact-observe-hook.ts'],
  transcriptBytes: undefined,
  siblingListing: [{ name: 'session-1.jsonl', kind: 'file', size: 2048 }],
};

/** The record built from {@link MEASURED}. */
const RECORD: PreCompactObservation = {
  time: '2026-09-16T10:11:12.345Z',
  marker: '2026-09-16T10-11-12-345Z-1a2b3c4d',
  eventName: 'PreCompact',
  payload: {
    status: 'ok',
    topLevelKeys: ['session_id'],
    fields: { session_id: 'session-1' },
    mismatchedFields: [],
  },
  stdin: { bytes: 26, raw: '{"session_id":"session-1"}' },
  cwd: '/work/project',
  argv: ['node', 'claude-pre-compact-observe-hook.ts'],
  environment: { recorded: { CLAUDE_CODE_SESSION_ID: 'session-1' }, withheld: [] },
  siblings: { entries: [{ name: 'session-1.jsonl', kind: 'file', size: 2048 }], count: 1 },
};

function fileEntry(index: number): SiblingEntry {
  return { name: `sibling-${String(index)}.jsonl`, kind: 'file', size: 1 };
}

describe('buildPreCompactObservation', () => {
  it('builds the whole record from the raw measurements', () => {
    const observation = buildPreCompactObservation({ ...MEASURED, transcriptBytes: 2048 });

    expect(observation).toStrictEqual({ ...RECORD, transcriptBytes: 2048 });
  });

  it('leaves an unmeasured transcript absent, not zero', () => {
    expect(buildPreCompactObservation(MEASURED)).toStrictEqual(RECORD);
  });

  it('keeps a transcript measured at zero bytes as 0', () => {
    const observation = buildPreCompactObservation({ ...MEASURED, transcriptBytes: 0 });

    expect(observation).toStrictEqual({ ...RECORD, transcriptBytes: 0 });
  });

  it('builds the marker from the time and the UUID', () => {
    const observation = buildPreCompactObservation({
      ...MEASURED,
      time: '2027-01-02T03:04:05.678Z',
      uuid: 'ffeeddcc-bbaa-4988-8776-655443322110',
    });

    expect(observation.marker).toBe('2027-01-02T03-04-05-678Z-ffeeddcc');
  });

  it('counts the payload in UTF-8 bytes, not characters', () => {
    const observation = buildPreCompactObservation({
      ...MEASURED,
      stdin: { kind: 'read', text: '{"a":"é"}' },
    });

    expect(observation.stdin).toStrictEqual({ bytes: 10, raw: '{"a":"é"}' });
  });

  it('records a stdin read failure with its reason, and no payload measurement', () => {
    const reason = 'EISDIR: illegal operation on a directory, read';

    const observation = buildPreCompactObservation({
      ...MEASURED,
      stdin: { kind: 'unreadable', reason },
    });

    expect(observation.stdin).toStrictEqual({ readError: reason });
  });

  it('records a payload read but empty with zero bytes and no read error', () => {
    const observation = buildPreCompactObservation({
      ...MEASURED,
      stdin: { kind: 'read', text: '' },
    });

    expect(observation.stdin).toStrictEqual({ bytes: 0, raw: '' });
  });

  it('records the bytes dropped past the stdin cap beside the kept text', () => {
    const observation = buildPreCompactObservation({
      ...MEASURED,
      stdin: { kind: 'read', text: '{"session_id":"sess', droppedBytes: 4096 },
    });

    expect(observation.stdin).toStrictEqual({
      bytes: 19,
      raw: '{"session_id":"sess',
      droppedBytes: 4096,
    });
  });

  it('records the full count of a sibling listing it caps', () => {
    const observation = buildPreCompactObservation({
      ...MEASURED,
      siblingListing: [...Array.from({ length: 30 }).keys()].map(fileEntry),
    });

    expect(observation.siblings.count).toBe(30);
  });

  it('records a directory it could not list as no entries and no count, not zero', () => {
    const observation = buildPreCompactObservation({ ...MEASURED, siblingListing: undefined });

    expect(observation).toStrictEqual({ ...RECORD, siblings: { entries: [] } });
  });
});
