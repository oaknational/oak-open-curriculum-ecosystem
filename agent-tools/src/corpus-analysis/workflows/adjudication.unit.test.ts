import { describe, expect, it } from 'vitest';

import type { Candidate } from '../judgment-schemas.js';
import type { VoterJudgment } from './agent-schemas.js';
import {
  createCandidateAdjudicator,
  type AdjudicationDeps,
  type VoterAgent,
} from './adjudication.js';
import type { HarnessParallel } from './harness-types.js';

/**
 * The adjudication loop is the one orchestration surface between the deterministic
 * routing state machine and the harness: it must execute exactly the dispatches the
 * machine asks for, record dead voters as first-class unadjudicated outcomes, attach
 * the Tier-2 lens after the call, and resolve safety-cap exhaustion to a held state —
 * a wrong mapping here silently converts quota deaths into wrong dispositions on the
 * one-way run.
 */

const candidate: Candidate = {
  id: 'C01',
  pattern: 'a recurring mechanism',
  kind: 'recurrence',
  isAbsenceClaim: false,
  supportingWindows: ['w01'],
  supportingLeafIds: ['w01-L01'],
  groundingCount: 1,
};

const leafById = new Map([
  [
    'w01-L01',
    { id: 'w01-L01', window: 'w01', grounding: [{ napkinDate: '2026-05-06', quote: 'q' }] },
  ],
]);

const passingJudgment: VoterJudgment = {
  grounded: { pass: true, confidence: 'high' },
  baseRateHolds: { pass: true, confidence: 'high' },
  survivesNull: { pass: true, confidence: 'high' },
  notArtefact: { pass: true, confidence: 'high' },
  importance: 'med',
};

const failingJudgment: VoterJudgment = {
  ...passingJudgment,
  grounded: { pass: false, confidence: 'high' },
};

/** In-order concurrent fake matching the harness contract (null for a thrown thunk). */
const fakeParallel: HarnessParallel = async (thunks) =>
  Promise.all(
    thunks.map(async (thunk) => {
      try {
        return await thunk();
      } catch {
        return null;
      }
    }),
  );

interface AgentCall {
  readonly label: string;
  readonly prompt: string;
  readonly agentType: string | undefined;
}

function fakeAgent(script: readonly (VoterJudgment | null)[], calls: AgentCall[]): VoterAgent {
  let cursor = 0;
  return async (prompt, opts) => {
    calls.push({ label: opts.label, prompt, agentType: opts.agentType });
    const next = script[cursor] ?? null;
    cursor += 1;
    return next;
  };
}

function deps(agent: VoterAgent): AdjudicationDeps {
  return { agent, parallel: fakeParallel, jitterMs: 0, maxRounds: 8 };
}

describe('createCandidateAdjudicator', () => {
  it('keeps a candidate whose tier-0 and tier-1 voters both cleanly keep (two dispatches, no ensemble)', async () => {
    const calls: AgentCall[] = [];
    const adjudicator = createCandidateAdjudicator(
      deps(fakeAgent([passingJudgment, passingJudgment], calls)),
      leafById,
    );
    const outcome = await adjudicator(candidate);
    expect(outcome.disposition).toBe('keep');
    expect(outcome.outcomes).toHaveLength(2);
    expect(calls.map((call) => call.label)).toEqual([
      'vote:C01:tier-0:plain',
      'vote:C01:tier-1:plain',
    ]);
    expect(calls[0]?.prompt).toContain('[w01 2026-05-06] q');
    // Every voter dispatches as the no-tools corpus-voter agent type — the tool
    // restriction is harness-enforced, not prompt compliance.
    expect(calls.every((call) => call.agentType === 'corpus-voter')).toBe(true);
  });

  it('escalates a tier-0 kill to the full diverse-lens ensemble and attaches each lens to its verdict', async () => {
    const calls: AgentCall[] = [];
    const adjudicator = createCandidateAdjudicator(
      deps(fakeAgent([failingJudgment, failingJudgment, failingJudgment, failingJudgment], calls)),
      leafById,
    );
    const outcome = await adjudicator(candidate);
    expect(outcome.disposition).toBe('kill');
    expect(calls.map((call) => call.label)).toEqual([
      'vote:C01:tier-0:plain',
      'vote:C01:tier-2:correctness-grounding',
      'vote:C01:tier-2:base-rate',
      'vote:C01:tier-2:null-reproduction',
    ]);
    const tier2Lenses = outcome.outcomes
      .filter((entry) => entry.tier === 'tier-2' && entry.status === 'adjudicated')
      .map((entry) => (entry.status === 'adjudicated' ? entry.verdict.lens : undefined));
    expect(tier2Lenses).toEqual(['correctness-grounding', 'base-rate', 'null-reproduction']);
  });

  it('records a dead voter as a first-class unadjudicated retry-cap outcome, never a silent drop', async () => {
    const calls: AgentCall[] = [];
    // tier-0 dies; the machine then routes tier-1, then the ensemble — all dead → held.
    const adjudicator = createCandidateAdjudicator(
      deps(fakeAgent([null, null, null, null, null], calls)),
      leafById,
    );
    const outcome = await adjudicator(candidate);
    expect(outcome.disposition).toBe('held-for-review');
    expect(outcome.reason).toBe('retry-cap');
    expect(outcome.outcomes.every((entry) => entry.status === 'unadjudicated')).toBe(true);
    expect(outcome.outcomes.length).toBeGreaterThanOrEqual(5);
  });

  it('resolves safety-cap exhaustion to held-for-review rather than spinning', async () => {
    const calls: AgentCall[] = [];
    const zeroRounds: AdjudicationDeps = {
      ...deps(fakeAgent([passingJudgment], calls)),
      maxRounds: 0,
    };
    const outcome = await createCandidateAdjudicator(zeroRounds, leafById)(candidate);
    expect(outcome).toEqual({
      candidateId: 'C01',
      disposition: 'held-for-review',
      reason: 'retry-cap',
      outcomes: [],
    });
    expect(calls).toHaveLength(0);
  });
});
