/*
 * The map-level pairing-schema wrapper, shared at its second consumer
 * (the Sonar duplication gate priced the twin copies on PR #834): the
 * version literal, the non-empty pairs array, the exempt-surfaces
 * declaration, and the unique-pair-ids refinement are one shape in both
 * demo apps. The PER-PAIR schemas stay app-local by design — kinds,
 * extra fields, and refinements genuinely differ per app (the hub
 * declares a section-element kind with a sectionId; the showcase does
 * not) — so this builder takes the app's own pair schema and wraps it.
 */
import { z } from 'zod';

/**
 * Build an app's pairing-map schema around its own pair schema. The
 * returned schema enforces the map-level invariants every app shares:
 * `version: 1`, at least one pair, `exemptSurfaces` entries each naming
 * a route and a reason (absence of a canonical target is a recorded
 * fact, never silence), unique pair ids (the disposition register
 * keys findings on them), and unknown-key rejection at the map and
 * exempt-entry levels — a misspelled field fails loudly instead of
 * silently stripping (strict-validation-at-boundary; the per-pair
 * strictness is each app schema's own obligation). App-specific map
 * invariants chain `.refine`
 * on the result — zod's refine clones, so chained schemas stay
 * distinct objects.
 */
export function buildPairingMapSchema<P extends z.ZodType<{ id: string }>>(
  pairSchema: P,
): z.ZodObject<
  {
    version: z.ZodLiteral<1>;
    pairs: z.ZodArray<P>;
    exemptSurfaces: z.ZodArray<
      z.ZodObject<{ route: z.ZodString; reason: z.ZodString }, z.core.$strict>
    >;
  },
  z.core.$strict
> {
  return z
    .strictObject({
      version: z.literal(1),
      pairs: z.array(pairSchema).min(1),
      /** Routes with no canonical target — absence is a recorded fact. */
      exemptSurfaces: z.array(
        z.strictObject({
          route: z.string().min(1),
          reason: z.string().min(1),
        }),
      ),
    })
    .refine((map) => new Set(map.pairs.map((pair) => pair.id)).size === map.pairs.length, {
      message: 'pair ids must be unique',
    });
}
