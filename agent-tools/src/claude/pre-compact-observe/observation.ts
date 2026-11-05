/**
 * The observation build: the one record the PreCompact observer writes per
 * compaction.
 *
 * @remarks
 * The functional core of the observer. The entry only takes raw
 * measurements; everything derived from them is derived here: the payload
 * reading, the environment snapshot, the sibling selection and the marker. So
 * the reading can never disagree with the stdin it read, and the answer and
 * the log line share the record's one marker. The raw payload is kept
 * verbatim beside the reading, so a reading built on a wrong assumption can
 * still be checked against what the harness actually sent.
 *
 * @packageDocumentation
 */

import { snapshotEnvironment, type EnvironmentSnapshot } from './environment.js';
import { readPreCompactPayload, type PayloadRead, type StdinRead } from './payload.js';
import { selectSiblings, type SiblingEntry, type SiblingSelection } from './siblings.js';

/** The raw measurements the entry takes at one compaction. */
export interface PreCompactRawMeasurements {
  /** When the hook ran, as an ISO 8601 timestamp. */
  readonly time: string;
  /** A random UUID, to make the marker unique. */
  readonly uuid: string;
  /** What the entry read from stdin. */
  readonly stdin: StdinRead;
  /** The hook process's environment, unfiltered. */
  readonly environment: Readonly<Record<string, string | undefined>>;
  /** The hook process's working directory. */
  readonly cwd: string;
  /** The hook process's argument vector. */
  readonly argv: readonly string[];
  /**
   * The transcript's size in bytes, or `undefined` when there was no
   * transcript path or it could not be measured. Required, so a caller
   * always says which.
   */
  readonly transcriptBytes: number | undefined;
  /**
   * Every entry beside the transcript, or `undefined` when there was no
   * transcript path or its directory could not be listed.
   */
  readonly siblingListing: readonly SiblingEntry[] | undefined;
}

/**
 * The record of one compaction, as the observation log holds it.
 *
 * @remarks
 * A measurement that could not be taken is absent, never zero.
 */
export interface PreCompactObservation {
  /** When the hook ran, as an ISO 8601 timestamp. */
  readonly time: string;
  /** The marker pairing this record with the answer the harness receives. */
  readonly marker: string;
  /**
   * The event the observer is registered for. This is the registration's
   * constant, not the payload's own `hook_event_name`, which the payload
   * reading carries in its fields.
   */
  readonly eventName: 'PreCompact';
  /** The observer's reading of the payload. */
  readonly payload: PayloadRead;
  /**
   * The payload as kept, its size in UTF-8 bytes and any bytes dropped past
   * the stdin cap; or the stdin read error in their place. A payload cut at
   * the cap usually reads as `unparseable-json`: `droppedBytes` beside it
   * says the cut, not the harness, broke it.
   */
  readonly stdin:
    | { readonly bytes: number; readonly raw: string; readonly droppedBytes?: number }
    | { readonly readError: string };
  /** The hook process's working directory. */
  readonly cwd: string;
  /** The hook process's argument vector. */
  readonly argv: readonly string[];
  /** The environment snapshot. */
  readonly environment: EnvironmentSnapshot;
  /** The transcript's size in bytes; absent when it was not measured. */
  readonly transcriptBytes?: number;
  /** The entries beside the transcript, and their full count when they were listed. */
  readonly siblings: SiblingSelection;
}

/**
 * Build the record for one compaction from the raw measurements.
 *
 * @param measurements - Everything the entry measured, unprocessed.
 * @returns The record to append to the observation log; its `marker` is the
 *   one the probe answer must carry.
 */
export function buildPreCompactObservation(
  measurements: PreCompactRawMeasurements,
): PreCompactObservation {
  return {
    time: measurements.time,
    marker: observationMarker(measurements.time, measurements.uuid),
    eventName: 'PreCompact',
    payload: readPreCompactPayload(measurements.stdin),
    stdin: stdinEvidence(measurements.stdin),
    cwd: measurements.cwd,
    argv: measurements.argv,
    environment: snapshotEnvironment(measurements.environment),
    ...transcriptSize(measurements.transcriptBytes),
    siblings: selectSiblings(measurements.siblingListing),
  };
}

/**
 * The marker: the timestamp with `:` and `.` made `-`, a hyphen, then the
 * first eight characters of the UUID.
 */
function observationMarker(isoTimestamp: string, uuid: string): string {
  return `${isoTimestamp.replaceAll(/[:.]/g, '-')}-${uuid.slice(0, 8)}`;
}

/** The kept payload, its size and any dropped bytes; or the read error in their place. */
function stdinEvidence(stdin: StdinRead): PreCompactObservation['stdin'] {
  if (stdin.kind === 'unreadable') {
    return { readError: stdin.reason };
  }
  const kept = { bytes: Buffer.byteLength(stdin.text, 'utf8'), raw: stdin.text };
  return stdin.droppedBytes === undefined ? kept : { ...kept, droppedBytes: stdin.droppedBytes };
}

/** The transcript's size, or nothing when it was not measured: absent, never 0. */
function transcriptSize(bytes: number | undefined): Pick<PreCompactObservation, 'transcriptBytes'> {
  return bytes === undefined ? {} : { transcriptBytes: bytes };
}
