import { describe, expect, it } from 'vitest';

import { type ContentLeg } from './content-binding.js';
import { syntheticPatchId } from './content-fixture.js';
import type { DeclaredStandIn } from './declared-unavailable.js';
import { COPILOT, LATE_NOW, OLD_TIP, settledReading, TIP } from './state-reading-fixture.js';
import { computePrVerdict } from './states.js';

/**
 * The verdict over a declared stand-in: the leg reads it as the vendor's
 * review of the head it names, bound exactly or by content across a pure
 * sync, and the quiet window runs from the declaration. A stand-in whose head
 * does not bind the tip, like a refused declaration, decides the verdict at
 * once, before the checks ladder.
 */

const URL = 'https://github.com/acme/widgets/pull/999#issuecomment-1';
const COPILOT_ERROR =
  'Copilot encountered an error and was unable to review this pull request. You can try again by re-requesting a review.';

function standIn(commitOid: string): DeclaredStandIn {
  return {
    id: 'IC_1',
    url: URL,
    author: COPILOT,
    state: 'COMMENTED',
    body: `**${COPILOT} leg unavailable on head SHA:${commitOid}.**`,
    commitOid,
    submittedAt: '2026-07-21T12:10:00Z',
    transport: 'declared-stand-in',
    proof: { kind: 'error-review', at: '2026-07-21T12:05:00Z' },
  };
}

const errored = {
  author: COPILOT,
  state: 'COMMENTED',
  body: COPILOT_ERROR,
  commitOid: TIP,
  submittedAt: '2026-07-21T12:05:00Z',
};

function declared(commitOid: string, content?: ContentLeg) {
  return settledReading({
    reviews: [errored],
    declaredUnavailable: { standIns: [standIn(commitOid)], refused: [] },
    ...(content === undefined ? {} : { content }),
  });
}

const PATCH = syntheticPatchId('c');
const SYNCED: ContentLeg = {
  kind: 'read',
  head: PATCH,
  reviewed: [{ oid: OLD_TIP, content: { kind: 'id', id: PATCH } }],
};

describe('computePrVerdict over a declared stand-in', () => {
  it('settles on the stand-in for the tip, and the evidence names the declaration and its proof', () => {
    const verdict = computePrVerdict(declared(TIP), LATE_NOW);

    expect(verdict.state).toBe('SETTLE-READY');
    expect(verdict.evidence).toContain(
      `${COPILOT}: declared unavailable at 2026-07-21T12:10:00Z by ${URL} (proof: error-review at 2026-07-21T12:05:00Z) read as a review of the tip (transport: declared-stand-in)`,
    );
  });

  it('holds the quiet window from the declaration', () => {
    expect(computePrVerdict(declared(TIP), '2026-07-21T12:15:00Z').state).toBe(
      'SETTLING-QUIET-WINDOW',
    );
  });

  it('binds a stand-in for the commit before a pure sync by content, and says so', () => {
    const verdict = computePrVerdict(declared(OLD_TIP, SYNCED), LATE_NOW);

    expect(verdict.state).toBe('SETTLE-READY');
    expect(
      verdict.evidence.filter((line) => line.includes('transport: declared-stand-in')),
    ).toStrictEqual([
      `${COPILOT}: declared unavailable at 2026-07-21T12:10:00Z by ${URL} (proof: error-review at 2026-07-21T12:05:00Z) read as a review of the tip; bound by content (patch-id ${PATCH.slice(0, 10)}, reviewed at ${OLD_TIP.slice(0, 10)}, head ${TIP.slice(0, 10)}) (transport: declared-stand-in)`,
    ]);
  });

  it('refuses a stand-in whose named head does not bind the tip', () => {
    expect(computePrVerdict(declared(OLD_TIP), LATE_NOW)).toStrictEqual({
      state: 'UNCLASSIFIED-EVIDENCE',
      evidence: [
        `${COPILOT}: unavailability declaration ${URL} refused — names head SHA:${OLD_TIP.slice(0, 10)}, which does not bind the current tip`,
      ],
    });
  });

  it('refuses a refused declaration at once, while checks still run', () => {
    const reading = settledReading({
      checks: { total: 3, passed: 2, failed: 0, pending: 1 },
      declaredUnavailable: {
        standIns: [],
        refused: [{ login: COPILOT, url: URL, refusal: 'names no comment on this pull request' }],
      },
    });

    expect(computePrVerdict(reading, LATE_NOW)).toStrictEqual({
      state: 'UNCLASSIFIED-EVIDENCE',
      evidence: [
        `${COPILOT}: unavailability declaration ${URL} refused — names no comment on this pull request`,
      ],
    });
  });
});
