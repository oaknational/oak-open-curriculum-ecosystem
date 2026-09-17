/*
 * The declared pairing map for the showcase fidelity review: which
 * canonical-export render pairs with which live-app capture, at what
 * comparison kind, plus the surfaces that HAVE no export target (recorded,
 * never silent). Engineering config — schema-validated at module load so a
 * drifted entry fails the import loudly (the hub's zod-at-module-init
 * pattern).
 *
 * NAMING: pair ids and every evidence basename are built from identity
 * FRAGMENTS (`picker-oak-*` / `picker-pds-*` / `picker-emc2-*`), mapped from
 * the imported slug list through lib/identities — `creature` names its
 * evidence `emc2`, so the fragment, not the slug, is what appears on disk.
 *
 * The register of JUDGMENTS about these pairs lives separately in
 * fidelity-register.json (owner-editable); this module only declares what
 * is comparable and how.
 */
import { buildPairingMapSchema } from '@oaknational/fidelity-review/pairing-schema';
import { z } from 'zod';

import { IDENTITIES } from '../components/useIdentity';
import { targetFragmentsFor } from '../lib/identities';

/**
 * How a pair is compared:
 * - `page-fullpage` / `page-abovefold` — full-route screenshots at matched
 *   geometry (1440 CSS px, 2x scale); fullpage heights legitimately differ,
 *   so the diff crops to the common intersection and carries a caveat.
 * - `reference-only` — unmatched-geometry references rendered side-by-side
 *   for judgment, never pixel-diffed.
 */
const PairKindSchema = z.enum(['page-fullpage', 'page-abovefold', 'reference-only']);

const PairSchema = z
  .strictObject({
    /** Stable pair identifier — the disposition register keys findings on it. */
    id: z.string().regex(/^[a-z0-9-]+$/),
    kind: PairKindSchema,
    /** Demo-dir-relative path of the canonical-export render PNG. */
    exportPng: z.string().min(1),
    /** Demo-dir-relative path of the live-app capture PNG. */
    livePng: z.string().min(1),
    /** The live route (with any query) that produces `livePng`. */
    liveRoute: z.string().min(1),
    /** False for pairs whose geometry makes a pixel diff meaningless. */
    diffEligible: z.boolean(),
    /** Per-pair triage caveat rendered in the report. */
    notes: z.string().optional(),
  })
  .refine((pair) => pair.kind !== 'reference-only' || !pair.diffEligible, {
    message: 'reference-only pairs must not be diff-eligible (unmatched geometry)',
  });

/** The shared map-level wrapper around this app's own pair schema —
 *  version literal, non-empty pairs, recorded exempt surfaces, unique
 *  pair ids (the fidelity-review package's pairing-schema module). */
export const PairingMapSchema = buildPairingMapSchema(PairSchema);

export type FidelityPair = z.infer<typeof PairSchema>;
export type PairingMap = z.infer<typeof PairingMapSchema>;

/** One export page load for the render arm: the URL (export-server-relative)
 *  and the PNG per pair to write from it, named by pair id. `expectsFrame`
 *  marks pages that host the specimen in an iframe — the render self-check
 *  must refuse a frameless render of such a page rather than passing on
 *  the chrome's own metrics. */
export interface ExportRenderTarget {
  readonly url: string;
  readonly expectsFrame: boolean;
  readonly shots: readonly { readonly pairId: string; readonly kind: 'fold' | 'full' }[];
}

/** The six diff-eligible ids the declared map must carry — static fragment
 *  names; the ShowcaseMapSchema refine below fails the module load when the
 *  mapping stops producing them, so no throw statement is needed here
 *  (ADR-088: zod's parse is the single module-init boundary). */
const DIFF_PAIR_IDS = [
  'picker-oak-fold',
  'picker-oak-full',
  'picker-pds-fold',
  'picker-pds-full',
  'picker-emc2-fold',
  'picker-emc2-full',
] as const;

const fragmentsResult = targetFragmentsFor(IDENTITIES);
const fragments: Readonly<Record<string, string>> = fragmentsResult.ok ? fragmentsResult.value : {};

/** demo-evidence path for one side of a pair — the single naming rule. */
function evidencePng(side: 'export' | 'live', pairId: string): string {
  return `demo-evidence/${side}-${pairId}.png`;
}

const specimenPairs: FidelityPair[] = IDENTITIES.flatMap((slug) => {
  const fragment = fragments[slug];
  if (fragment === undefined) {
    return []; // derivation failure — the ShowcaseMapSchema refine fails the load
  }
  const liveRoute = `/identity-switchboard/specimen?brand=${slug}`;
  return (['fold', 'full'] as const).map((crop) => {
    const id = `picker-${fragment}-${crop}`;
    return {
      id,
      kind: crop === 'fold' ? ('page-abovefold' as const) : ('page-fullpage' as const),
      exportPng: evidencePng('export', id),
      livePng: evidencePng('live', id),
      liveRoute,
      diffEligible: true,
      ...(crop === 'full'
        ? { notes: 'full-page heights differ; ratio reads over the common top region' }
        : {}),
    };
  });
});

const CHROME_PAIR_ID = 'picker-chrome';

/** The generic schema plus this map's own completeness invariant: every
 *  target-state specimen pair must be present, so an identity-derivation
 *  failure (see lib/identities.ts) fails the import loudly instead of
 *  shipping a silently thinner map. */
const EXPECTED_IDS = DIFF_PAIR_IDS.join(', ');
const DERIVATION_NOTE = fragmentsResult.ok ? '' : ` (${fragmentsResult.error})`;
const ShowcaseMapSchema = PairingMapSchema.refine(
  (map) => DIFF_PAIR_IDS.every((id) => map.pairs.some((pair) => pair.id === id)),
  {
    message: `the declared map must carry all six specimen pairs (${EXPECTED_IDS}) — identity derivation failed; see lib/identities.ts${DERIVATION_NOTE}`,
  },
);

export const FIDELITY_PAIRS: PairingMap = ShowcaseMapSchema.parse({
  version: 1,
  pairs: [
    ...specimenPairs,
    {
      id: CHROME_PAIR_ID,
      kind: 'reference-only',
      exportPng: evidencePng('export', CHROME_PAIR_ID),
      livePng: evidencePng('live', CHROME_PAIR_ID),
      liveRoute: '/identity-switchboard',
      diffEligible: false,
      notes:
        'picker chrome diverges by ruled design (responsive frame vs the export scale() fit; segmented theme control vs native select) — side-by-side judgment only',
    },
  ],
  exemptSurfaces: [
    {
      route: '/',
      reason:
        'owner-rejected as the switchboard surface — the root route is W1.5 scope (design-system-completion) and is judged by the W0.7 instrument, not export fidelity',
    },
  ],
});

/** The export page behind one pair. The specimen's own ?brand= guard treats
 *  an absent value as the Oak base, so the base identity loads the bare
 *  page rather than pointing at a brand directory the export never had;
 *  the reference-only pair targets the picker chrome itself. */
function exportUrlFor(pair: FidelityPair): string {
  if (pair.kind === 'reference-only') {
    return 'Identity Switchboard.html';
  }
  const query = pair.liveRoute.split('?').at(1) ?? '';
  const slug = new URLSearchParams(query).get('brand') ?? '';
  return pair.id.startsWith('picker-oak-')
    ? 'whitelabel/specimen.html'
    : `whitelabel/specimen.html?brand=${slug}`;
}

/** The render arm's targets, derived FROM the validated map — the schema
 *  parse above is the single failure point, so no second derivation path
 *  can run ahead of validation and emit orphan pair ids. Pairs sharing an
 *  export page collapse to one load with one shot per pair. */
export const EXPORT_RENDER_TARGETS: readonly ExportRenderTarget[] = (() => {
  const byUrl = new Map<string, { pairId: string; kind: 'fold' | 'full' }[]>();
  for (const pair of FIDELITY_PAIRS.pairs) {
    const url = exportUrlFor(pair);
    const shots = byUrl.get(url) ?? [];
    shots.push({ pairId: pair.id, kind: pair.kind === 'page-abovefold' ? 'fold' : 'full' });
    byUrl.set(url, shots);
  }
  return [...byUrl.entries()].map(([url, shots]) => ({
    url,
    // The picker chrome hosts the specimen in an iframe; the specimen
    // pages are unframed.
    expectsFrame: url === 'Identity Switchboard.html',
    shots,
  }));
})();
