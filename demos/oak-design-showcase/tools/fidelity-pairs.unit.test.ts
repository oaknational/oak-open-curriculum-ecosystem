import { describe, expect, it } from 'vitest';

import { GLOBAL_PAIR_ID } from '@oaknational/fidelity-review/register';
import { EXPORT_RENDER_TARGETS, FIDELITY_PAIRS, PairingMapSchema } from './fidelity-pairs';

describe('PairingMapSchema invariants', () => {
  const minimalPair = {
    id: 'picker-oak-fold',
    kind: 'page-abovefold',
    exportPng: 'demo-evidence/export-picker-oak-fold.png',
    livePng: 'demo-evidence/live-picker-oak-fold.png',
    liveRoute: '/identity-switchboard/specimen',
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
  it('declares six diff-eligible specimen pairs under target-state naming plus one reference-only chrome pair', () => {
    // A designed sentinel of the identity-naming decision, deliberately
    // restating the expected id set: it catches EXTRA or renamed ids the
    // product's own presence-refine cannot see. If this fails, do not edit
    // the list to match — re-adjudicate against the naming ratchet
    // (lib/identities.ts and the plan node's target-state naming clause).
    const diffable = FIDELITY_PAIRS.pairs.filter((pair) => pair.diffEligible).map((p) => p.id);
    const referenceOnly = FIDELITY_PAIRS.pairs
      .filter((pair) => !pair.diffEligible)
      .map((p) => p.id);

    expect(
      diffable.toSorted((a, b) => a.localeCompare(b)),
      'diff-eligible pair ids drifted from the ratified target-state set — re-adjudicate the naming-ratchet decision, never edit this list to match',
    ).toStrictEqual([
      'picker-emc2-fold',
      'picker-emc2-full',
      'picker-oak-fold',
      'picker-oak-full',
      'picker-pds-fold',
      'picker-pds-full',
    ]);
    expect(referenceOnly).toStrictEqual(['picker-chrome']);
  });

  it('derives every evidence basename from the pair id — the naming-ratchet-safe convention', () => {
    // Capture outputs are named by pair id (already target-state), never by
    // route: the live routes carry the pre-rename brand slug in their query,
    // and route-derived basenames would put that token into the tracked
    // register's evidence paths.
    for (const pair of FIDELITY_PAIRS.pairs) {
      expect(pair.exportPng).toBe(`demo-evidence/export-${pair.id}.png`);
      expect(pair.livePng).toBe(`demo-evidence/live-${pair.id}.png`);
    }
  });

  it('records the owner-rejected root route as exempt, with its reason', () => {
    // Sentinel of a ratified decision (the plan node's exemptSurfaces
    // clause): if this fails on a deliberate un-exemption of the root
    // route, that is a plan amendment — record it there, then update here.
    const root = FIDELITY_PAIRS.exemptSurfaces.find((surface) => surface.route === '/');

    expect(
      root,
      'the root route left the exempt set — a plan-level decision; amend the plan node before this list',
    ).toBeDefined();
    expect(root?.reason).toContain('owner-rejected');
  });
});

describe('the export render targets', () => {
  it('cover every declared pair exactly once, derived from the validated map', () => {
    const shotPairIds = EXPORT_RENDER_TARGETS.flatMap((target) =>
      target.shots.map((shot) => shot.pairId),
    );

    expect(shotPairIds.toSorted((a, b) => a.localeCompare(b))).toStrictEqual(
      FIDELITY_PAIRS.pairs.map((pair) => pair.id).toSorted((a, b) => a.localeCompare(b)),
    );
  });
});

describe('the reserved global register scope', () => {
  it('collides with no declared pair id', () => {
    expect(FIDELITY_PAIRS.pairs.some((pair) => pair.id === GLOBAL_PAIR_ID)).toBe(false);
  });
});
