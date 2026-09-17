/*
 * The declared pairing map for the fidelity review: which canonical-export
 * evidence pairs with which live-app capture, at what comparison kind, plus
 * the surfaces that HAVE no export target (recorded, never silent). This is
 * engineering config — schema-validated at module load so a drifted entry
 * fails the import loudly (the token audit's MAPPING is the precedent; the
 * zod-at-module-init pattern follows the content-is-data loaders).
 *
 * The register of JUDGMENTS about these pairs lives separately in
 * fidelity-register.json (owner-editable); this module only declares what is
 * comparable and how.
 */
import { buildPairingMapSchema } from '@oaknational/fidelity-review/pairing-schema';
import { z } from 'zod';

/**
 * How a pair is compared:
 * - `page-fullpage` / `page-abovefold` — full-route screenshots at matched
 *   geometry (1440 CSS px, 2x scale); fullpage heights legitimately differ,
 *   so the diff crops to the common intersection and carries a caveat.
 * - `section-element` — the export's `#main` element shot vs the live
 *   course-content region for one representative section per interactive
 *   block type.
 * - `reference-only` — in-export authoring screenshots with unmatched
 *   geometry: rendered side-by-side for judgment, never pixel-diffed.
 */
const PairKindSchema = z.enum([
  'page-fullpage',
  'page-abovefold',
  'section-element',
  'reference-only',
]);

const PairSchema = z
  .strictObject({
    /** Stable pair identifier — the disposition register keys findings on it. */
    id: z.string().regex(/^[a-z0-9-]+$/),
    kind: PairKindSchema,
    /** Demo-dir-relative path of the canonical-export evidence PNG. */
    exportPng: z.string().min(1),
    /** Demo-dir-relative path of the live-app capture PNG. */
    livePng: z.string().min(1),
    /** The live route (with any deep-link hash) that produces `livePng`. */
    liveRoute: z.string().min(1),
    /** False for pairs whose geometry makes a pixel diff meaningless. */
    diffEligible: z.boolean(),
    /** Course section id for `section-element` pairs (`/course#section=<id>`). */
    sectionId: z.string().optional(),
    /** Per-pair triage caveat rendered in the report. */
    notes: z.string().optional(),
  })
  .refine((pair) => pair.kind !== 'reference-only' || !pair.diffEligible, {
    message: 'reference-only pairs must not be diff-eligible (unmatched geometry)',
  })
  .refine((pair) => pair.kind !== 'section-element' || pair.sectionId !== undefined, {
    message: 'section-element pairs need the sectionId their deep link drives',
  });

/** The shared map-level wrapper around this app's own pair schema —
 *  version literal, non-empty pairs, recorded exempt surfaces, unique
 *  pair ids (the fidelity-review package's pairing-schema module). */
export const PairingMapSchema = buildPairingMapSchema(PairSchema);

export type FidelityPair = z.infer<typeof PairSchema>;
export type PairingMap = z.infer<typeof PairingMapSchema>;

/** One representative section per interactive block type (mirrors the
 *  drive-export-sections TARGETS; ids verified against lib/course/oak-course.json). */
const SECTION_SLUGS: readonly { sectionId: string; block: string }[] = [
  { sectionId: 'u1m1s1', block: 'flip-stats' },
  { sectionId: 'u1m1s2', block: 'accordion' },
  { sectionId: 'u1m1s4', block: 'tabs' },
  { sectionId: 'u1m1s5', block: 'quiz' },
  { sectionId: 'u1m3s2', block: 'compare' },
  { sectionId: 'u3m1s1', block: 'columns' },
  { sectionId: 'm1s2', block: 'videoimport' },
  { sectionId: 'm1s3check', block: 'sortable' },
  { sectionId: 'm1s4', block: 'hotspot' },
];

const sectionPairs: FidelityPair[] = SECTION_SLUGS.map(({ sectionId, block }) => ({
  id: `${sectionId}-${block}`,
  kind: 'section-element' as const,
  exportPng: `demo-evidence/export-sections/export-${sectionId}-${block}.png`,
  livePng: `demo-evidence/live-sections/live-${sectionId}-${block}.png`,
  liveRoute: `/course#section=${sectionId}`,
  diffEligible: true,
  sectionId,
  notes: 'export #main element vs live course-content region; widths differ, crop-to-common',
}));

export const FIDELITY_PAIRS: PairingMap = PairingMapSchema.parse({
  version: 1,
  pairs: [
    {
      id: 'hub-home-fold',
      kind: 'page-abovefold',
      exportPng: 'demo-evidence/hub-canonical-render-abovefold.png',
      livePng: 'demo-evidence/home-live-abovefold.png',
      liveRoute: '/',
      diffEligible: true,
    },
    {
      id: 'hub-home-full',
      kind: 'page-fullpage',
      exportPng: 'demo-evidence/hub-canonical-render.png',
      livePng: 'demo-evidence/home-live.png',
      liveRoute: '/',
      diffEligible: true,
      notes: 'full-page heights differ; ratio reads over the common top region',
    },
    {
      id: 'standards-fold',
      kind: 'page-abovefold',
      exportPng: 'demo-evidence/standards-canonical-render-abovefold.png',
      livePng: 'demo-evidence/standards-live-abovefold.png',
      liveRoute: '/standards',
      diffEligible: true,
    },
    {
      id: 'standards-full',
      kind: 'page-fullpage',
      exportPng: 'demo-evidence/standards-canonical-render.png',
      livePng: 'demo-evidence/standards-live.png',
      liveRoute: '/standards',
      diffEligible: true,
      notes: 'full-page heights differ; ratio reads over the common top region',
    },
    ...sectionPairs,
    {
      id: 'bottom-controls',
      kind: 'section-element',
      exportPng: 'demo-evidence/export-sections/export-bottom-controls.png',
      livePng: 'demo-evidence/live-sections/live-bottom-controls.png',
      liveRoute: '/course#section=u1m1s1',
      diffEligible: true,
      sectionId: 'u1m1s1',
      notes: 'the player prev/next controls region at the first section',
    },
    {
      id: 'ref-coursemap',
      kind: 'reference-only',
      exportPng: 'claude-design-canonical-export/screenshots/coursemap.png',
      livePng: 'demo-evidence/course-live.png',
      liveRoute: '/course',
      diffEligible: false,
      notes: 'authoring-time screenshot, unmatched geometry — side-by-side judgment only',
    },
    {
      id: 'ref-check',
      kind: 'reference-only',
      exportPng: 'claude-design-canonical-export/screenshots/check.png',
      livePng: 'demo-evidence/live-sections/live-u1m1s5-quiz.png',
      liveRoute: '/course#section=u1m1s5',
      diffEligible: false,
      notes: 'authoring-time knowledge-check screenshot — side-by-side judgment only',
    },
    {
      id: 'ref-framework',
      kind: 'reference-only',
      exportPng: 'claude-design-canonical-export/screenshots/framework-img.png',
      livePng: 'demo-evidence/curriculum-live.png',
      liveRoute: '/curriculum',
      diffEligible: false,
      notes: 'framework illustration — the demo surface is the E3 showcase, not a port',
    },
  ],
  exemptSurfaces: [
    {
      route: '/curriculum',
      reason:
        'no canonical export target (ratified E3 exemption) — designed to tokens with design-system-expert review',
    },
    { route: '/rubrics', reason: 'export ships no target for this destination' },
    { route: '/exemplars', reason: 'export ships no target for this destination' },
    { route: '/wiki', reason: 'export ships no target for this destination' },
    {
      route: '/lesson/[slug]',
      reason: 'live-data surface; export ships no lesson-view target',
    },
  ],
});
