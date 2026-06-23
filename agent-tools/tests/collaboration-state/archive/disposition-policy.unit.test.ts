import { describe, expect, it } from 'vitest';

import { buildTierPolicyLedger } from '../../../src/collaboration-state/archive/disposition-policy';
import type { ClassifiableEvent } from '../../../src/collaboration-state/archive/event-classification';

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

describe('buildTierPolicyLedger', () => {
  it('auto-dispositions a heartbeat event as routine with body-read unconfirmed', () => {
    const ledger = buildTierPolicyLedger([ev({ eventId: 'aaaaaaaa', tags: ['heartbeat'] })]);
    expect(ledger.get('aaaaaaaa')).toEqual({ disposition: 'routine', bodyReadConfirmed: false });
  });

  it('omits a coordination event so it surfaces as awaiting-disposition', () => {
    const ledger = buildTierPolicyLedger([
      ev({ eventId: 'bbbbbbbb', titleOrSubject: 'WS7 handoff' }),
    ]);
    expect(ledger.has('bbbbbbbb')).toBe(false);
  });

  it('omits a research-precious event (never bulk auto-disposed)', () => {
    const ledger = buildTierPolicyLedger([ev({ eventId: 'cccccccc', tags: ['failure-mode'] })]);
    expect(ledger.has('cccccccc')).toBe(false);
  });

  it('omits an event tagged both heartbeat and failure-mode (research-precious wins)', () => {
    // Mirrors the classifyTier precedence: a both-tagged event is research-precious,
    // so the bulk heartbeat policy must NOT auto-dispose it.
    const ledger = buildTierPolicyLedger([
      ev({ eventId: 'dddddddd', tags: ['heartbeat', 'failure-mode'] }),
    ]);
    expect(ledger.has('dddddddd')).toBe(false);
  });

  it('builds entries only for the heartbeat events in a mixed batch', () => {
    const ledger = buildTierPolicyLedger([
      ev({ eventId: 'aaaaaaaa', tags: ['heartbeat'] }),
      ev({ eventId: 'bbbbbbbb', titleOrSubject: 'team start' }),
      ev({ eventId: 'cccccccc', titleOrSubject: 'Heartbeat-end: agent — session-end' }),
    ]);
    expect([...ledger.keys()].sort((a, b) => a.localeCompare(b))).toEqual(['aaaaaaaa', 'cccccccc']);
  });
});
