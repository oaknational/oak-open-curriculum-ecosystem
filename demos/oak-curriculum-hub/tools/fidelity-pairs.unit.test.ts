import { describe, expect, it } from 'vitest';

import { GLOBAL_PAIR_ID } from '@oaknational/fidelity-review/register';

import { FIDELITY_PAIRS, PairingMapSchema } from './fidelity-pairs';

describe('PairingMapSchema invariants', () => {
  const minimalPair = {
    id: 'hub-home-fold',
    kind: 'page-abovefold',
    exportPng: 'demo-evidence/hub-canonical-render-abovefold.png',
    livePng: 'demo-evidence/home-live-abovefold.png',
    liveRoute: '/',
    diffEligible: true,
  };

  /* The map-level invariants (unique ids, version literal, exempt
   * surfaces) are proven with their schema in
   * @oaknational/fidelity-review/pairing-schema; this suite owns only
   * the pair-level refinements this app declares. */

  it('rejects a reference-only pair marked diff-eligible', () => {
    const parsed = PairingMapSchema.safeParse({
      version: 1,
      pairs: [{ ...minimalPair, kind: 'reference-only', diffEligible: true }],
      exemptSurfaces: [],
    });

    expect(parsed.success).toBe(false);
  });

  it('rejects a section-element pair without a sectionId', () => {
    const parsed = PairingMapSchema.safeParse({
      version: 1,
      pairs: [{ ...minimalPair, kind: 'section-element' }],
      exemptSurfaces: [],
    });

    expect(parsed.success).toBe(false);
  });

  it('rejects an unknown key on a pair — a misspelled field must fail, never silently strip', () => {
    const parsed = PairingMapSchema.safeParse({
      version: 1,
      pairs: [{ ...minimalPair, note: 'typo of notes' }],
      exemptSurfaces: [],
    });

    expect(parsed.success).toBe(false);
  });
});

describe('the declared pairing map', () => {
  it('parses against its own schema at module load', () => {
    // The map's CONTENT is configuration — verified by reading it, not by
    // asserting it here (testing-strategy: tests prove behaviour). This
    // test pins only the load-time validation behaviour: a drifted map
    // fails the import, so consumers never see an unvalidated map.
    expect(FIDELITY_PAIRS.version).toBe(1);
    expect(FIDELITY_PAIRS.pairs.length).toBeGreaterThan(0);
  });
});

describe('the reserved global register scope', () => {
  it('collides with no declared pair id', () => {
    expect(FIDELITY_PAIRS.pairs.some((pair) => pair.id === GLOBAL_PAIR_ID)).toBe(false);
  });
});
