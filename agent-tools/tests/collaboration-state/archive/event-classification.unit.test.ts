import { describe, expect, it } from 'vitest';

import {
  classifyTier,
  decideDisposition,
  eventAgeMs,
  requiresBodyRead,
  type ClassifiableEvent,
  type DispositionInput,
  type RecordedDisposition,
  type RetentionWindows,
} from '../../../src/collaboration-state/archive/event-classification';

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const WINDOWS: RetentionWindows = { heartbeatMs: 48 * HOUR_MS, coordinationMs: 7 * DAY_MS };
const NOW_MS = Date.parse('2026-06-14T12:00:00Z');

function event(overrides: Partial<ClassifiableEvent> = {}): ClassifiableEvent {
  return {
    eventId: 'deadbeef',
    kind: 'narrative',
    createdAt: '2026-06-14T11:59:00Z',
    tags: [],
    titleOrSubject: 'Team start: Some Agent',
    bodyLength: 120,
    ...overrides,
  };
}

function dispositionInput(overrides: Partial<DispositionInput> = {}): DispositionInput {
  return {
    event: event(),
    nowMs: NOW_MS,
    windows: WINDOWS,
    routineBodyLengthThreshold: 500,
    recordedDisposition: null,
    heartbeatAggregateExtracted: false,
    bodyReadConfirmed: false,
    provenanceViolation: false,
    ...overrides,
  };
}

describe('classifyTier', () => {
  it('classifies a heartbeat-tagged event as heartbeat', () => {
    expect(classifyTier(event({ tags: ['heartbeat'] }))).toBe('heartbeat');
  });

  it('classifies an untagged "Heartbeat:" title as heartbeat', () => {
    expect(classifyTier(event({ titleOrSubject: 'Heartbeat: Gull spins Stratus — ws7' }))).toBe(
      'heartbeat',
    );
  });

  it('classifies an untagged "Heartbeat-end:" title as heartbeat', () => {
    expect(
      classifyTier(event({ titleOrSubject: 'Heartbeat-end: Serval mends Murmur — session-end' })),
    ).toBe('heartbeat');
  });

  it('classifies a failure-mode-tagged event as research-precious', () => {
    expect(classifyTier(event({ tags: ['failure-mode'] }))).toBe('research-precious');
  });

  it('classifies a behaviour-note-tagged event as research-precious (over-protect by default)', () => {
    expect(classifyTier(event({ tags: ['behaviour-note'] }))).toBe('research-precious');
  });

  it('classifies an ordinary narrative event as coordination', () => {
    expect(classifyTier(event({ titleOrSubject: 'WS7 handoff: A -> B' }))).toBe('coordination');
  });

  it('classifies an event tagged BOTH heartbeat and failure-mode as research-precious (over-protect wins)', () => {
    // Research signal must be absorbed before the event can move, even when the
    // event is also a heartbeat — research-precious takes precedence over the
    // age-movable heartbeat tier.
    expect(classifyTier(event({ tags: ['heartbeat', 'failure-mode'] }))).toBe('research-precious');
  });

  it('never infers diagnostic-test-noise from a test-shaped title alone (the 3cc1fb93 falsifier)', () => {
    // Event 3cc1fb93 was titled "reproducer-test: long body…" but carried a live
    // session-split proposal. A title-genre sweep must NOT tier it as noise.
    expect(
      classifyTier(
        event({ titleOrSubject: 'reproducer-test: long body with shell-escaped apostrophes' }),
      ),
    ).toBe('coordination');
  });
});

describe('requiresBodyRead', () => {
  it('flags a body longer than the routine threshold', () => {
    expect(requiresBodyRead(event({ bodyLength: 501 }), 500)).toBe(true);
  });

  it('does not flag a body at or under the routine threshold', () => {
    expect(requiresBodyRead(event({ bodyLength: 500 }), 500)).toBe(false);
  });
});

describe('eventAgeMs', () => {
  it('returns the elapsed milliseconds since authoring', () => {
    expect(eventAgeMs('2026-06-14T11:00:00Z', NOW_MS)).toBe(HOUR_MS);
  });

  it('returns null for an unparseable timestamp', () => {
    expect(eventAgeMs('not-a-date', NOW_MS)).toBeNull();
  });
});

describe('decideDisposition — fail-closed gates', () => {
  it('blocks a cited-but-uncovered provenance violation regardless of age or tier', () => {
    const decision = decideDisposition(
      dispositionInput({
        event: event({ createdAt: '2026-06-01T00:00:00Z' }),
        provenanceViolation: true,
        recordedDisposition: 'routine',
      }),
    );
    expect(decision.action).toBe('blocked');
    expect(decision.reason).toBe('provenance-violation');
  });

  it('blocks an event whose created_at does not parse', () => {
    const decision = decideDisposition(
      dispositionInput({ event: event({ createdAt: 'garbage' }) }),
    );
    expect(decision.action).toBe('blocked');
    expect(decision.reason).toBe('unparseable-created-at');
  });
});

describe('decideDisposition — research-precious (until graduated, never age-triggered)', () => {
  it('keeps an unabsorbed research-precious event live no matter how old', () => {
    const decision = decideDisposition(
      dispositionInput({
        event: event({ tags: ['failure-mode'], createdAt: '2026-01-01T00:00:00Z' }),
        recordedDisposition: null,
      }),
    );
    expect(decision.action).toBe('keep-live');
    expect(decision.reason).toBe('research-precious-unabsorbed');
  });

  it('archive-moves a research-precious event once absorbed', () => {
    const decision = decideDisposition(
      dispositionInput({
        event: event({ tags: ['failure-mode'], createdAt: '2026-01-01T00:00:00Z' }),
        recordedDisposition: 'absorbed',
      }),
    );
    expect(decision.action).toBe('archive-move');
    expect(decision.reason).toBe('eligible-archive-move');
  });
});

describe('decideDisposition — heartbeat tier (48h, aggregate-gated)', () => {
  const heartbeat = (createdAt: string) =>
    event({ tags: ['heartbeat'], createdAt, bodyLength: 90 });

  it('keeps a within-window heartbeat live', () => {
    const decision = decideDisposition(
      dispositionInput({ event: heartbeat('2026-06-13T18:00:00Z') }),
    );
    expect(decision.action).toBe('keep-live');
    expect(decision.reason).toBe('within-window');
  });

  it('blocks a past-window heartbeat until the cadence aggregate is extracted', () => {
    const decision = decideDisposition(
      dispositionInput({
        event: heartbeat('2026-06-10T00:00:00Z'),
        heartbeatAggregateExtracted: false,
        recordedDisposition: 'routine',
      }),
    );
    expect(decision.action).toBe('blocked');
    expect(decision.reason).toBe('heartbeat-aggregate-pending');
  });

  it('keeps a past-window heartbeat live when the aggregate is extracted but no disposition is recorded', () => {
    const decision = decideDisposition(
      dispositionInput({
        event: heartbeat('2026-06-10T00:00:00Z'),
        heartbeatAggregateExtracted: true,
        recordedDisposition: null,
      }),
    );
    expect(decision.action).toBe('keep-live');
    expect(decision.reason).toBe('awaiting-disposition');
  });

  it('archive-moves a past-window heartbeat once the aggregate is extracted and a disposition is recorded', () => {
    const decision = decideDisposition(
      dispositionInput({
        event: heartbeat('2026-06-10T00:00:00Z'),
        heartbeatAggregateExtracted: true,
        recordedDisposition: 'routine',
      }),
    );
    expect(decision.action).toBe('archive-move');
    expect(decision.reason).toBe('eligible-archive-move');
  });
});

describe('decideDisposition — coordination tier (7d, absorption + body-read gated)', () => {
  const coordination = (createdAt: string, bodyLength = 120) =>
    event({ titleOrSubject: 'WS7 status', createdAt, bodyLength });

  it('keeps a within-window coordination event live', () => {
    const decision = decideDisposition(
      dispositionInput({ event: coordination('2026-06-10T00:00:00Z') }),
    );
    expect(decision.action).toBe('keep-live');
    expect(decision.reason).toBe('within-window');
  });

  it('keeps a past-window coordination event live while its disposition is unrecorded', () => {
    const decision = decideDisposition(
      dispositionInput({ event: coordination('2026-06-01T00:00:00Z'), recordedDisposition: null }),
    );
    expect(decision.action).toBe('keep-live');
    expect(decision.reason).toBe('awaiting-disposition');
  });

  it('blocks a routine disposition on a long body that was not read (the 3cc1fb93 falsifier)', () => {
    const decision = decideDisposition(
      dispositionInput({
        event: coordination('2026-06-01T00:00:00Z', 900),
        recordedDisposition: 'routine',
        bodyReadConfirmed: false,
      }),
    );
    expect(decision.action).toBe('blocked');
    expect(decision.reason).toBe('body-read-required');
    expect(decision.requiresBodyRead).toBe(true);
  });

  it('archive-moves a routine disposition on a long body once the body read is confirmed', () => {
    const decision = decideDisposition(
      dispositionInput({
        event: coordination('2026-06-01T00:00:00Z', 900),
        recordedDisposition: 'routine',
        bodyReadConfirmed: true,
      }),
    );
    expect(decision.action).toBe('archive-move');
    expect(decision.reason).toBe('eligible-archive-move');
  });

  it('archive-moves a past-window short-body coordination event on a routine disposition without a body-read flag', () => {
    const decision = decideDisposition(
      dispositionInput({
        event: coordination('2026-06-01T00:00:00Z', 120),
        recordedDisposition: 'routine',
        bodyReadConfirmed: false,
      }),
    );
    expect(decision.action).toBe('archive-move');
    expect(decision.reason).toBe('eligible-archive-move');
  });

  it('archive-moves a past-window coordination event with an absorbed disposition', () => {
    const decision = decideDisposition(
      dispositionInput({
        event: coordination('2026-06-01T00:00:00Z'),
        recordedDisposition: 'absorbed' satisfies RecordedDisposition,
      }),
    );
    expect(decision.action).toBe('archive-move');
    expect(decision.reason).toBe('eligible-archive-move');
  });

  it('archive-moves a past-window coordination event with a quarantined disposition', () => {
    // `quarantined` is an ADR-199 §"Absorption gate" recorded disposition that
    // satisfies the gate (the curator examined the event and set it aside as
    // suspect); like `absorbed` it permits the move and needs no body-read gate.
    const decision = decideDisposition(
      dispositionInput({
        event: coordination('2026-06-01T00:00:00Z'),
        recordedDisposition: 'quarantined' satisfies RecordedDisposition,
      }),
    );
    expect(decision.action).toBe('archive-move');
    expect(decision.reason).toBe('eligible-archive-move');
  });
});
