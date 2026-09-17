---
id: emc2-amplification-and-token-reference
node_type: delivery
name: "EMC² amplification + token reference — the dynamic identity axis, demo-first"
overview: >-
  Amplify the EMC² identity along the owner's five verbatim axes (motion
  responsive to user preference, glows, animations, interaction movement,
  greater layout/order/flow change — zero markup), curing the live
  reduced-motion defect first, and build a /tokens reference page whose
  live-applied values prove the identity switch at data level. Demo-first
  from the local dev server; review-then-land after; the design lane then
  resumes its queued programme.
status: ratified
ratified_by: "Jim Cresswell (owner)"
ratified_date: 2026-08-18
ratified_where: >-
  Owner approval of the joint Director×Design plan at the Director seat's
  plan gate (session c28ad9, Ocelot binds Tunnel), 2026-08-18 ~08:3xZ;
  jointly authored with the design lane (Yarrow stirs Undergrowth,
  ab1066), whose per-axis verdicts and three-delta concurrence are on the
  2026-08-17 design-lane ARC channel and in the s2s exchange cited there.
serves: design-system-as-configured-framework
impact_areas:
  - design-system
tickets:
  - MCP-620
depends_on:
  - plan: design-showcase-experience
    kind: beneficial
owner_gates: []
last_updated: 2026-08-18
---

# EMC² amplification + token reference — the dynamic identity axis, demo-first

## Why this node exists

The owner wants to show off, this morning (deadline soft): the identity-switching
page and a standard, nice-looking page of token values, both with the identity
switch — three identities (Oak, PDS, EMC²), no Tango today (Option A at the
morning card; no Tango visual pack exists yet — only the pack-tier machinery,
MCP-616 `cd84e490c`). Folded in: the owner's EMC² amplification wishlist
(verbatim axes: "more movement (responsive to the movement preference of the
user, normal motion, low-motion), more glows in more colours, more animations,
more movement on interactions, and a greater change to the visual layout,
order, flow, without changing any markup"), and his note that narrow-viewport
convergence on the Oak structure is the design lane's queued cure "in due
course" — narrow re-composition is therefore explicitly out of this node's
scope (it belongs to P6 doctrine + the composition tranche, cited from the
tango-identity-pack node at `843bb4ac8`, never duplicated here).

## Grounded facts that shape the work

- Identity switching: the specimen server path renders the per-identity
  stylesheet link from `?brand=`; the client path is a hook-owned
  load-then-swap link (`components/brand-identity-binding.ts`). Roster
  `oak / pds / creature` (EMC²).
- EMC² today (`public/brands/creature/brand.css`): layout/order rides the
  existing custom-property maps (`--main-areas`, `--flow-*`); zero
  `@keyframes`; one transition family.
- Live defect (critical-analysis finding 4): EMC² sets `--motion-quick/base`
  on bare `:root`; the identity sheet loads last, so these defeat the kit's
  `prefers-reduced-motion` collapse — EMC² motion ignores the user's OS
  preference today. The future pack-admission rule (tango node fact 4)
  refuses exactly this recipe.
- The kit's motion tokens are tiered: `--motion-*-full` faces collapse to
  `--motion-instant` under `prefers-reduced-motion` and
  `[data-motion='reduced']`; `public/oak-theme.js` already exposes a runtime
  motion switch (`oakTheme.motion.set`), so the demo flips motion live with
  zero new code.
- Parity gate: `public/brands/creature/*.css` are byte-parity-gated copies of
  `packages/design/oak-design-system/studio-source/whitelabel/creature/*`
  (`validate-kit-assets`); every EMC² edit lands in the studio source AND
  re-copies byte-identically.
- Token surface: the DTCG trees (~486 tokens, seven files) are exported via
  the kit's `"./dtcg/*"` export map; the two identity sheets declare 108/99
  custom properties (intersection 87) — the per-identity delta is computable
  at build time.

## Workstream 1 — EMC² amplification (design lane; studio source + byte-copy)

Authoring shape: base styles are the low-motion face;
`@media (prefers-reduced-motion: no-preference)` adds the full arcade — that
pair is the owner's normal/low-motion ask, and low-motion remains a designed
face, not a stripped one. All durations/easings reference motion tokens.

| Slice | Content |
| --- | --- |
| 1a defect cure FIRST | re-author EMC² motion on the `-full` token faces (delete the bare `:root --motion-*` overrides) so the kit's collapse governs; re-true the sheet comment that currently claims the collapse works; if the sitting has room, land the small kit-level reduced-motion floor (showcase plan W6 item 3) as belt-and-braces |
| 1b motion + animations | keyframes (glow pulses, float/bob) on garnish only — audited text pairings stay flat; all gated behind the no-preference arm |
| 1c glows in more colours | new hues enter as tokens (ad-hoc hex fails `validate-authored-css`); per-theme contrast pairings incl. high-contrast AAA; forced-colours without `forced-color-adjust: none` |
| 1d interaction movement | transforms/transitions on existing `.oak-btn` hover/active/focus arms; fence: the identity/theme switch itself stays instantaneous (W3 vestibular ruling; F3 flash risk); 44px targets untouched |
| 1e layout/order/flow, wide | one striking wide-viewport reorder by amending the existing `--main-areas`/`--flow-*` maps; narrow re-composition stays with the queued P6/composition-tranche work |

Content is authored pack-portable (tokens + the existing selector contract) so
the future EMC² pack-migration node carries it wholesale. Specimen-surface
divergences from the canonical export mint fidelity-register rows
(dispositioned `deliberate`) in the same change.

## Workstream 2 — `/tokens` page (builder under the design lane's seat, parallel)

- Catalogue at build time: parse the DTCG JSON via the kit's `"./dtcg/*"`
  exports in a server component; flatten path to `--name` (the documented
  round-trip). Exclude icon-URL props (`--i-*`/`--ic-*`) with a stated
  exclusion; mark tier-1/private per the sheet contract.
- Values live by application: each swatch IS a styled element using
  `var(--x)` — the cascade updates it on identity/theme switch with zero JS;
  the displayed value string comes from a computed-style read; functional
  values (`color-mix`/`calc`) render applied with their expression text.
- "Changes with this identity" badge at build time from parsing the two
  tracked identity sheets (87-property intersection).
- Switch UI and skeleton: reuse `LabelledSelect` + no-arg `useIdentity()`
  (re-skins the page itself) + the theme options; server path copies the
  specimen's `?brand=` conditional link render for first-paint correctness;
  switchboard landmarks/skip-link/`aria-live` conventions; page chrome
  tokens-only; axe pass with the in-repo tooling. No fidelity-pair
  obligation (new page, not a reproduction).

## Demo runbook

1. Verify switchboard + white-labelling run clean on the dev server (3020).
2. Both workstreams in the working tree; rendered proof in Chrome at wide +
   narrow, all three identities, normal + reduced motion (the reduced flip
   uses the existing `oakTheme.motion` runtime).
3. Demo serves from the local dev server — nothing unreviewed leaves the
   machine.
4. Show: switchboard flip Oak → PDS → EMC² (motion/glows/interactions), the
   motion-preference flip (including the cured leak — EMC² actually stills
   now), then `/tokens` with the switch changing live values — the token
   contract proven at data level.

## Acceptance

- Zero markup diff from Workstream 1 (CSS/token/plan/register files only).
- `validate-kit-assets` green (studio source and public copies byte-identical).
- Reduced-motion truth: under `prefers-reduced-motion` emulation AND
  `data-motion='reduced'`, EMC² transitions/animations measurably still.
- Axe suite green per identity × theme; 320px reflow; 44px targets;
  forced-colours; contrast pairings incl. high-contrast AAA.
- Rendered proof witnessed in Chrome before the demo.
- Full pre-commit/pre-push suite green at land; fidelity-register rows
  dispositioned.

## Resume plan (owner-required; agreed by both seats)

Demo code lands through the normal arc — lane branch (`MCP-620`), compressed
review, PR — before T1a-ii opens. Then the design lane resumes:

1. Three-push queue — MCP-613 (`6e88cb407`; behind origin/main by 3, refresh
   at PR), MCP-615 (`843bb4ac8`), MCP-616 (`cd84e490c`) — push + PR each via
   pr-lifecycle, jimbot label. Supersedes the earlier queue-first word at the
   design seat.
2. Post-MCP-613-merge amendment parcel (four rows incl. the R4
   attribution-correction fold).
3. This node's review + land (incl. fidelity-register rows and parity copies).
4. T1a-ii pack-contract authoring, fresh sitting — carrying this node's
   conceptual yield: motion is a first-class identity axis; the manifest's
   motion stance (fact 4, the `-full` surface) is exercised for real by
   slice 1a. *(Dated 2026-08-18: T1a-ii now also carries the P7 ruling
   this node's demo day produced — identities self-contained, the
   contract the invariant, defaults at construction, the T1e
   constructor; doctrine in DDR-012 on the tango node's lane.)*
5. T1b admission-guard arms → T2 first Tango pixels (the checkpoint that
   matters) → T3/T4 per the tango node.

The Director's parallel estate legs (MCP-612 push/PR/merge, #899, the
coordination push, #889 at the repo-architecture seat) run from the
estate-coordination thread record's map; they are not this node's scope.

## Constraints held (cited, not re-derived)

- CSS owns appearance including visual order — zero-markup is constitutive.
- P6 (tango node, `843bb4ac8`): every identity composes narrow from its own
  character; this node's layout slice is wide-viewport only.
- Identities, never "brands" (owner vocabulary ruling; "brand" survives only
  in the kit's literal contract surfaces such as `brand.css`).
- Colours/glows enter as tokens; demo-grade never means unreviewed-shipped —
  local dev server for the show, review before merge.
