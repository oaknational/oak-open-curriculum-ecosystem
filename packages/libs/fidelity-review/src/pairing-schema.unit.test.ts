import { z } from 'zod';
import { describe, expect, it } from 'vitest';

import { buildPairingMapSchema } from './pairing-schema';

/* App-specific pair invariants (reference-only/diff-eligible coupling,
 * section-element/sectionId) are proven where their schemas live, in
 * each app's fidelity-pairs suite; this suite owns the map-level
 * invariants every app shares. */

const PairSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  kind: z.enum(['page-fullpage', 'reference-only']),
  diffEligible: z.boolean(),
});

const MapSchema = buildPairingMapSchema(PairSchema);

const pairOf = (id: string) => ({ id, kind: 'page-fullpage' as const, diffEligible: true });

const validMap = {
  version: 1 as const,
  pairs: [pairOf('picker-oak-fold'), pairOf('picker-oak-full')],
  exemptSurfaces: [{ route: '/', reason: 'owner-rejected as the switchboard surface' }],
};

describe('buildPairingMapSchema', () => {
  it("parses a valid map, preserving the app pair schema's own fields", () => {
    const parsed = MapSchema.parse(validMap);

    expect(parsed.pairs[0]?.kind).toBe('page-fullpage');
    expect(parsed.pairs[0]?.diffEligible).toBe(true);
  });

  it('refuses duplicate pair ids — the disposition register keys on them', () => {
    const outcome = MapSchema.safeParse({
      ...validMap,
      pairs: [pairOf('picker-oak-fold'), pairOf('picker-oak-fold')],
    });

    expect(outcome.success).toBe(false);
    expect(outcome.success ? undefined : outcome.error.issues[0]?.message).toBe(
      'pair ids must be unique',
    );
  });

  it('refuses an empty pairs array — a map that compares nothing is a drift, not a config', () => {
    expect(MapSchema.safeParse({ ...validMap, pairs: [] }).success).toBe(false);
  });

  it('refuses any version other than the literal 1', () => {
    expect(MapSchema.safeParse({ ...validMap, version: 2 }).success).toBe(false);
  });

  it('requires every exempt surface to record its reason — absence is a recorded fact', () => {
    const outcome = MapSchema.safeParse({
      ...validMap,
      exemptSurfaces: [{ route: '/', reason: '' }],
    });

    expect(outcome.success).toBe(false);
  });

  it('rejects an unknown map-level key — a misspelled field must fail, never silently strip', () => {
    const outcome = MapSchema.safeParse({ ...validMap, exemptSurface: [] });

    expect(outcome.success).toBe(false);
  });

  it('rejects an unknown key on an exempt-surface entry', () => {
    const outcome = MapSchema.safeParse({
      ...validMap,
      exemptSurfaces: [{ route: '/', reason: 'recorded', rational: 'typo of reason' }],
    });

    expect(outcome.success).toBe(false);
  });
});
