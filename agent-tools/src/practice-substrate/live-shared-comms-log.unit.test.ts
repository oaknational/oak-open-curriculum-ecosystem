/**
 * Unit tests for the shared comms log render's decision, over literal
 * snapshots: the render's text or its absence, a fresh render of the events,
 * how many events it draws on, and the report's probe. Tests never use or
 * create IO (`testing-strategy.md` §Philosophy).
 */
import { err, ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { type InstanceTierProbe } from './instance-tier.js';
import { evaluateSharedCommsLogSnapshot } from './live-shared-comms-log.js';

const LOG = '.agent/state/collaboration/shared-comms-log.md';
/** Zero events still render a header, so an absent render never equals a fresh one. */
const HEADER_ONLY = '# Shared log\n\n';
const WITH_EVENT = '# Shared log\n\n## One event\n';

const IGNORED: InstanceTierProbe = ok(new Set([LOG]));
const NOT_IGNORED: InstanceTierProbe = ok(new Set());

describe('evaluateSharedCommsLogSnapshot', () => {
  it('reports the absent, ignored render as informational when there are no events to render', () => {
    expect(
      evaluateSharedCommsLogSnapshot({
        outputPath: LOG,
        committedText: undefined,
        regeneratedText: HEADER_ONLY,
        eventCount: 0,
        probe: IGNORED,
      }),
    ).toStrictEqual([
      expect.objectContaining({
        id: 'instance-tier-surface-absent',
        evidence: [LOG],
      }),
    ]);
  });

  it('reports an absent render the repository would track as a blocking missing surface', () => {
    expect(
      evaluateSharedCommsLogSnapshot({
        outputPath: LOG,
        committedText: undefined,
        regeneratedText: HEADER_ONLY,
        eventCount: 0,
        probe: NOT_IGNORED,
      }),
    ).toStrictEqual([expect.objectContaining({ id: 'missing-surface', evidence: [LOG] })]);
  });

  it('reports the absent, ignored render as drift when events exist to render', () => {
    expect(
      evaluateSharedCommsLogSnapshot({
        outputPath: LOG,
        committedText: undefined,
        regeneratedText: WITH_EVENT,
        eventCount: 1,
        probe: IGNORED,
      }),
    ).toStrictEqual([
      expect.objectContaining({
        id: 'generated-read-model-drift',
        evidence: [LOG],
      }),
    ]);
  });

  it('reports an absent render as a blocking reader failure when the probe cannot classify it', () => {
    expect(
      evaluateSharedCommsLogSnapshot({
        outputPath: LOG,
        committedText: undefined,
        regeneratedText: HEADER_ONLY,
        eventCount: 0,
        probe: err({ kind: 'git-failed', status: 128, stderr: 'fatal: not a git repository\n' }),
      }),
    ).toStrictEqual([expect.objectContaining({ id: 'live-reader-failure', evidence: [LOG] })]);
  });

  it('passes a render that matches its events', () => {
    expect(
      evaluateSharedCommsLogSnapshot({
        outputPath: LOG,
        committedText: WITH_EVENT,
        regeneratedText: WITH_EVENT,
        eventCount: 1,
        probe: IGNORED,
      }),
    ).toStrictEqual([]);
  });

  it('reports a render that no longer matches its events as blocking drift', () => {
    expect(
      evaluateSharedCommsLogSnapshot({
        outputPath: LOG,
        committedText: HEADER_ONLY,
        regeneratedText: WITH_EVENT,
        eventCount: 1,
        probe: IGNORED,
      }),
    ).toStrictEqual([
      expect.objectContaining({
        id: 'generated-read-model-drift',
        evidence: [LOG],
      }),
    ]);
  });
});
