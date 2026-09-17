# Design sitting records — 2026-08-05 (pre-register)

Durable recording of the owner's sitting verdicts and tweak enumeration from
the 2026-08-05 design-lane reopening sittings (W0.9 hub pre-read, W0.10
counter-identity pre-reads, W0.5 tweak enumeration), recorded at occurrence
by the design seat (Saffron guards Hedgerow, 8a4280) per the Director's
dispatch (comms event 2026-08-05T14:47:40Z). **Marked PRE-REGISTER**: the
wow-verdict register does not exist yet (the completion plan's W0.7 mints
it); every verdict row below migrates into that register at its minting, and
tweak entries feed W0.5's intake surface. Owner words are verbatim where
quoted; relay provenance is named per entry.

## Verdict 1 — showcase root: pre-read FAIL

- **Surface**: the design-showcase root page (served localhost:3020), browsed
  by the owner ~14:55Z.
- **Verdict**: FAIL (pre-read). Owner verbatim (Director relay, comms event
  14:56:30Z): "the showcase as is doesn't work, the 'oak' page has no
  relevant content and no styling, and I am pretty sure it doesn't use the
  design system we built."
- **Defects named**: no relevant content; no styling at render. Extends the
  standing 2026-08-02 rejection of the showcase page (recorded in the
  completion plan's taste calibration) with these two named defects.
- **Mechanism note** (Director first-hand, same event — a nuance on the
  consuming-suspicion, not a softening of the verdict): the root page markup
  DOES reference kit classes (`oak-canvas` / `oak-region` / `oak-container` /
  `oak-cluster` at `app/page.tsx:21-28`), so the defect surface is the CSS
  delivery/resolution path — or those structural classes lacking rules — not
  the markup's vocabulary. Diagnosis belongs to the lane at W1.5/W0.2; the
  verdict stands regardless of mechanism.
- **Sitting consequence**: the sitting moved to the Claude Design export
  (served statically at localhost:3030 from
  `packages/design/oak-design-system/studio-source/`), at the owner's
  instruction. Export-sitting verdicts follow below as they arrive.

## W0.5 enumeration sitting — the owner's export tweak ledger (nine items, owner-numbered 1–10 with no item 5, + 3 instruments)

Recorded from the Director's enumeration-ledger broadcast (comms event
2026-08-05T15:32:15Z; owner chat at the Director seat ~15:10–16:25Z,
screenshots read first-hand at that seat). Numbering is the owner's — his
message has no item 5. **Blocking words were recorded as DIRECTOR
PROPOSALS pending the owner's one-pass confirmation; on 2026-08-06 the
owner CONFIRMED the one-pass AS PROPOSED — all ten items and all three
instruments, no deltas (Director broadcast, comms event
2026-08-06T06:12:16Z). Every "Proposed:" word below now stands as an
owner word.** Owner words are verbatim where quoted.
**Count note (2026-08-08 comment-adjudication pass)**: "all ten items"
follows the owner's numbering (1–10 with no item 5); the ledger holds
NINE items — the numbering is the owner's, the item count is nine.
Process ruling (Director): these words arrived mid-re-review — plan
amendments adjudicate in ONE window with the re-review's close, so the
fleet's zero-target text never moves under it.

1. **Icons not loading** (three screenshots: Oak masthead search, front-page
   subject badges, worksheet logo). Root cause found and serve-fixed at
   occurrence: the export references the package-root `assets/` tree outside
   `studio-source/` — the sibling-layout class, twice today. CLASS:
   asset-closure — the rebuilt showcase carries a manifest-guarded asset
   closure (validate-kit-assets precedent). Proposed: BLOCKING (the class,
   for first light).
2. **No messy arrangements** — owner verbatim: "Oak design is to maximise
   readability for everyone, including those with non-typical neurological
   makeup, so it would never use messy arrangements like this" (front-page
   hero, overlapping rotated cards). Lands as an Oak taste-anchor rule
   (ordered, calm, no overlap/collage) + a W0.7 rubric criterion
   (readability/cognitive load, explicitly incl. neurodivergent users).
   Proposed: BLOCKING (any Oak-identity page in first light).
3. **Real-school check** — testimonial "James · Teacher, St Cuthbert Mayne
   School" (quote also names Aila, Oak's real product); the school is almost
   certainly real. Fix identical regardless: fabricated quotes must never
   attach to real institutions or read as Oak-endorsed. GENERALISED CLASS: a
   content-provenance manifest over the whole export/rebuild — every persona,
   institution, testimonial, statistic (the hero's "12,000+ free lessons /
   KS1–KS4 / 100%" are REAL Oak claims), and product name is either
   verified-real-and-appropriate or verified-fictional. Proposed: BLOCKING
   (safety class; the instance cures in the export soon, the manifest gates
   the rebuild).
4. **EMC² rotation** — owner: "could have some rotation as part of its
   design, but still consistent, not random, that would make it hard for
   some people to read." Lands as a W2.7 tilt-token constraint row:
   systematic tokenised fixed angles, never per-element random; composes
   with the 2026-08-03 delivered tilt values. Proposed: NON-BLOCKING for
   first light (binds W2.7/W2.9).
6. **Motion stances + honest reduced-motion** — owner words: plan a page
   demoing low-motion respect (an EMC² pair: ringing animations vs without);
   on pages like `whitelabel/creature/index.html` ACTUALLY respect the
   control ("the reduced motion version still has the button travel on
   hover, and the full motion version needs more motion in order for that to
   be visible"); "Oak and the gov-ish identity would never have motion
   anyway, they are too focussed on absolute accessibility." Lands as
   per-identity MOTION STANCE VALUES, owner-delivered today (Oak: none; PDS:
   none; EMC²: the motion identity, full/reduced genuinely distinct) — the
   motion analogue of the tilt card — plus a defect (creature reduced-motion
   not honoured) and a new demo cell (the EMC² motion pair). Proposed:
   defect BLOCKING wherever that page renders; demo pair NON-BLOCKING new
   scope (property: honest preference adaptation).
7. **All pages, all themes** — "the example worksheet is unreadable in some
   themes" (`Worksheet.dc.html?brand=creature`, body copy washed out).
   Evidence FOR the planned per-identity×theme gate matrix (W2.5) and census
   coverage of template pages. Derived: paper-destined artefacts in a
   dark-first identity need a DEFINED PRINT/PAPER POLARITY — per-identity
   print projections join the checked surface. Proposed: instance BLOCKING
   (the matrix must catch it); print-projection scope NON-BLOCKING (named
   story).
8. **Discoverability** — example lesson slides + example worksheet become
   first-class navigation entries, not footer asides. Lands in the W1.4
   page-set/IA authoring. Proposed: NON-BLOCKING for the probe, BLOCKING for
   the page-set finalisation.
9. **Editable slides** — text-editable demo slides with WORKING buttons
   (convert to PDF, print, save via localStorage implying a reset). NEW demo
   scope; kernel property: document-artefact workflows. Needs its story
   minted with per-story review; localStorage-only keeps privacy trivial.
   Proposed: NON-BLOCKING (post-first-light story).
10. **White-labelling footer copy** — "it's not proof, it's a demo of
    capability; it doesn't communicate the difference between the design
    system (call it 'our design system') and the identities." Owner draft
    wording: "our design system can support multiple identities, theme
    preferences and accessibility needs." CLASS: every export page's framing
    prose gets an owner-voice pass at rebuild (census records each page's
    prose state). Proposed: BLOCKING for the pages it appears on.

**Instruments (owner words, same sitting):**

- "the showcase has a comprehensive sitemap.xml" — Director strengthening:
  the sitemap GENERATES from the W0.1 page census; the axe/Lighthouse page
  lists DERIVE from the sitemap (method-independent parity).
- "every page in every theme is checked by axe in playwright as a minimum"
  — matches the planned W0.3 shipped-page axis statement; "as a minimum"
  preserved (the non-axe legs stay named beside it).
- "Lighthouse measurements against every showcase page, to prove it is
  performant" — Director strengthening: CI PERFORMANCE BUDGETS (per-page
  assertions), not one-off measurements. NOTE: performance gates are NEW to
  the plan — a genuine plan addition.

## Figma reference homing (Director routing, 2026-08-05)

The owner's 2026-07-29 design-queue handover points at the **Oak Design
Kit** Figma file, node id **2952-13167**. Recorded here deliberately
TOKEN-STRIPPED: the owner's pasted URL carries a Figma share token, and
this repository is public — the token never lands in-repo. Resolve the
node at time of use via the Figma tooling against the named file and
node id.

## Owner ruling — official Oak Design Kit is reference-only (approximation, never copy)

Ruled at the sitting (2026-08-05 ~15:45Z, Director relay with first-hand
Figma reconnaissance at the Director seat):

- **The ruling** (owner's words' substance): the official Oak Design Kit
  (Figma; Oak org project 50245843; kit file `YcWQMMhHPVVmc47cHHEEAl`;
  tokens node `2952-13167` — the 2026-07-29 design-queue handover node) is
  COPYRIGHT OAK and must never be verbatim-copied into this public repo,
  even with the licensing model in place. Intent: "our Oak identity and
  themes to be a GOOD approximation of the official design kit, just to
  demonstrate what is possible."
- **Protocol** for W2.9 Oak-identity authorship and any kit consultation:
  read-only via the Figma MCP (View seat, owner's account — re-verified
  this sitting); values RE-DERIVED by judgment, never exported or copied;
  provenance recorded in the content-provenance manifest ("approximated
  from the official Oak Design Kit, dated"); Figma share tokens never land
  in-repo (token-stripped pointers only).
- **Reconnaissance** (Director, first-hand): the kit's Style Tokens node
  carries the official taxonomy — Color / Font / Spacing (+ primitives) /
  Border / Drop Shadow / Opacity tokens, an A11y doc banner, and theme
  tokens for exactly TWO themes (oakDefaultTheme, oakDarkTheme). Lane
  note: the approximation target is the VISUAL LANGUAGE; on the theme axis
  our five-theme roster deliberately exceeds the reference.
- **Bounds already-landed work**: the export's Oak identity is itself an
  approximation of this class — blessed and bounded by the ruling. Sitting
  item 3's content-provenance manifest gains an identity-values column.
- Plan-touching deltas (W2.9 protocol note; the manifest column) ride the
  single amendment window with the tweak-ledger deltas, per the Director's
  process ruling.

## Owner ruling refined — "the cartographer's folly" (values examined exactly, used slightly off)

Refinement at the sitting (2026-08-05 ~15:50Z, Director relay; owner image
verbatim): "we can examine token values, but the values we use should be
slightly off, like a cartographer's folly." Supersedes the plain
approximate-by-eye reading of the reference-only ruling above. Protocol for
W2.9 Oak-identity authorship:

- EXAMINING exact official values is allowed (read-only Figma MCP).
- Every value USED deviates deliberately — the trap-street property: a
  verbatim match with the official kit is itself evidence of copying.
- Bounds: perturbation is SYSTEMATIC (harmony preserved — consistent
  hue/lightness shifts, never per-value noise) and ACCESSIBILITY-SAFE
  (contrast floors hold; perturb in the safe direction).
- The folly is procedural and provenance-attested, never a mechanical gate
  (a gate would need official values stored in this public repo, which the
  ruling forbids).

Reconnaissance addendum (Director, owner's own Figma view): the kit FILE's
page list carries Cover plus a "Design Documentation" page group (Oak
Component Standards / Oak Design Principles / A11y Documentation); the MCP
page enumeration returns Cover only, so deep nodes are reached by link,
not the page list. The three documentation pages are prime
approximation-reference material for the W0.7 rubric and the Oak anchor.

## The official-reference atlas — owner-assembled node map (token-stripped) and the fidelity gradient

Recorded from the Director's atlas relay (2026-08-05, ARC channel; names
verified first-hand at the Director seat where the Figma View-seat MCP
quota allowed; the final three names landed owner-named at the day's
close). Oak Design Kit file `YcWQMMhHPVVmc47cHHEEAl`, eight
owner-assembled deep nodes:

- `19798-1848` — Oak Component Standards: the kit's THREE-PROP API grammar
  (colorScheme / size / variant, with a Figma-matches-component-API
  alignment obligation). Direct W3 prop-API reference.
- `11442-11157` — Oak Design Principles (content instance marked WIP).
- `12381-529` — A11y Documentation: the official FIVE-STEP per-component
  accessibility documentation protocol (usage description; all states incl.
  device variants; focus order/behaviour with keyboard annotations and
  traps; known issues and considerations; content guidance). Maps nearly
  one-to-one onto our charter DoD + W0.7 rubric shape.
- `2952-16660` — the design tokens themselves, on the Style Tokens page
  (owner-named at day close).
- `8831-20262` — Brand Assets, with an INLINE OWNER RULING: "brand assets
  stay out of the repo entirely, we approximate the style of them only and
  then loosely."
- `21201-6385` — Buttons, the component-family page (owner-named at day
  close).
- `3459-11008` — Button, the component itself under Buttons (owner-named
  at day close). With `21201-6385` this is the direct W3
  Buttons-story reference pair.
- `8866-8323` — CheckBox: full component anatomy (spec, states,
  label/legend layouts, a11y block, do/don't guidance); Effect styles
  confirm lineage vocabulary (drop-shadow-lemon et al.).

**The fidelity gradient — three bands plus one free layer** (owner rulings
composed):

1. Token VALUES: examine exact, use slightly off (the cartographer's
   folly, bounds as recorded above).
2. Compositions / STYLE: good approximation.
3. Brand ASSETS: never in-repo; loose stylistic echo only.
4. PRINCIPLES AND PROTOCOLS (the five-step a11y discipline, the three-prop
   grammar): ideas transfer freely, restated in our own words with
   attribution — the folly binds values, not disciplines.

Kit page structure (owner's expanded sidebar): Cover; Design Documentation
(Component Standards / Design Principles / A11y); Design System (Style
Tokens / Brand Assets); Oak Components by family (Buttons ×5, Cookies,
Form elements, Layout/Grid, Messaging ×9, Navigation ×6,
Presentational/Carousel) with adoption-state check marks on Button /
LeftAlignedButton / IconButton / Toast — association only, one look at W3
story-open. Lane note: the Figma View seat is QUOTA-METERED on MCP calls —
budget kit consultations deliberately; batch reads at story-opens.

## The sitting's closing exchanges (owner words ~16:05–16:45Z, folded at the 2026-08-06 morning resume)

Provenance: every entry below was relayed by the Director on the
design-lane ARC channel on 2026-08-05 after this seat's compaction
freeze, and folded here at the next write window (2026-08-06 morning)
per the durability hierarchy. Where a later owner word supersedes an
earlier one, both moments are recorded in superseding order.

### Design-licensing resolution — two moments

**Moment 1 (~16:05–16:12Z, Director-verified first-hand).** The Figma
kit is UNLICENSED (copyright Oak), so the cartographer's folly binds its
values. Oak Components
([github.com/oaknational/oak-components](https://github.com/oaknational/oak-components))
is MIT and public. The owner's want, verbatim: the buttons "are probably pretty
close to the ones in Oak Components... in fact we would like them to be
identical, but we haven't figured out the best mechanical pipeline and
proof for that yet."

**Moment 2 — owner supersession (~16:20Z).**

- PURPOSE, the owner's words: the design restriction exists so nobody
  can easily "throw up sites that can pretend to be an Oak site or
  create assets claiming Oak backs or supports or condones them."
  Anti-impersonation is the test every design-licensing decision serves.
- The Moment-1 reading "identity via the MIT channel is licence-clean"
  is WITHDRAWN as an implementation route: NO CODE IMPORTS from Oak
  Components, despite MIT. Recorded ground: its styled-components
  consumption path conflicts with our layer model (CSS-first, framework
  adapters thin). Reference-reading the public repo stays legitimate;
  consuming its code does not happen.
- The parity instrument is reframed: the Oak identity is "visibly
  CORRECT" (as good as Oak, in many ways better) yet "distinct at the
  folly level" — so the W3 Buttons story-open pointer becomes a
  TWO-SIDED proof: a similarity bound (perceptually correct against the
  reference) AND a distinctness bound (the folly deviation present).
  Pointer-grade until story open; not co-designed here.

### Provenance disclosure and the trap-street audit (executed)

The owner supplied the palette's provenance: our Oak LIGHT theme derives
from sampling rendered `www.thenational.academy` pages, DARK was
believed derived from light, and the values were therefore
assumed-but-not-proven distinct from the official kit. The owner pulled
the trap-street audit forward from the story-open queue; the Director
executed it first-hand the same evening against Oak Components' MIT
source (`color.ts` / `dark.theme.ts` / `default.theme.ts` at main):

- PALETTE: our dtcg `palette.json` carries 83 literal hex values
  [scope correction 2026-08-08: the file carries 87 `$value` literals —
  the 83 hex values this audit covered plus four RGB alpha literals
  (`shadow-veil`, `shadow-veil-deep`, `veil-ink`, `veil-black`) outside
  the audited hex set, still needing a provenance disposition; that
  disposition rides the provenance-manifest work item]; Oak
  Components primitives 76; EXACT hex matches 68. The light families
  (greys, green `#287c34`, mint/aqua/lavender/pink/lemon/amber/red/
  navy...) are byte-identical copies.
- DARK, the owner's derived-from-light belief REFUTED at the primitive
  level: our palette contains Oak Components' dedicated designed dark
  primitives verbatim (dark-mint `#2e5338`, dark-lavender `#38488b`,
  the full dark-\* families). Our dark inherited OC's designed dark
  palette; the mapping vocabulary is also same-family.
- GENUINELY OURS (15 values): the hc-\* high-contrast family; the ci-\*
  colour-safe family (Okabe-Ito scientific palette — provenance safe,
  attributed); dark-red30/50 (we extended dark where OC lacks reds);
  amber110; lavender20; black-true.
- MEANING: legally clean (MIT source) — but "distinct at the folly
  level" is FALSE today for 68 values. The identity story gains a
  bounded work item: a SYSTEMATIC FOLLY PASS over the 68
  (harmony-preserving, family-consistent perturbation in the
  contrast-floor-safe direction), with the designed re-baselines riding
  it (the contrast-pairings manifest, the 810-value dtcg-CSS
  consistency gate, screenshot baselines where they exist).
- CAVEAT: the reference was Oak Components (the kit's implementation),
  not the Figma kit directly; one metered Figma spot-check at story
  open seals the kit-vs-OC hop.
- PROVENANCE-MANIFEST truth: our palette's honest provenance line is
  "Oak Components values via site derivation, exact" until the folly
  pass converts it to "approximated, folly-verified, dated".

### The folly mechanism sketch (owner-endorsed ~16:40Z)

The owner endorsed the mechanism shape ("genuinely excited"); scope is
the identity story, boundary calls bless at the story card:

- A deterministic SEEDED GENERATOR, not hand-nudging: per-FAMILY
  systematic transforms in OKLCH (hue ~+1.2deg, lightness ~+0.6%
  scale), harmony preserved by construction.
- Target band: above zero, below the just-noticeable-difference
  threshold (delta-E ~1–2) — invisible in use, decisive under hex
  inspection: the true trap-street property.
- Iteration target: OUR computational contrast machinery (the 42-pair
  contrast-pairings manifest [count corrected 2026-08-08: 42 pairs at
  the sitting and today; `EXPECTED_MANIFEST_PAIR_COUNT = 42`], the
  810-value dtcg-CSS consistency gate,
  the contrast report) — stricter than axe for token values; loop to a
  fixed point, nudges flip to the contrast-safe direction on any
  regression. Axe stays the rendered-page floor per the instrument
  ruling.
- TOKEN PAGES: the owner's iterable colour-token pages are the early
  face of the planned token-reference tier (W4.4) — before/after family
  panels for his eye, then graduation into the reference tier and the
  axe matrix.
- BOUNDARY CALLS to bless at the story card: the folly applies to
  EXPRESSIVE families only (greens/mints/aquas/lavenders/pinks/lemons/
  ambers/reds/navies + darks); pure white, true black, and the generic
  grey ramp are EXEMPT with recorded ground (common property, no Oak
  expression); Okabe-Ito ci-\* values stay EXACT and attributed
  (scientific provenance).
- OUTPUT: a folly attestation in the provenance manifest (count,
  delta-E band, date, seed; zero official values stored; the reference
  fetched at audit time from the MIT source).

### Reference-local export workflow (standing practice)

The owner exported kit pages via Figma's Export affordance into his
machine-local reference area under the repository's gitignored
local-reference convention, so the reference-only ruling is honoured
BY CONSTRUCTION (local reference, never repo). Standing practice:
export-to-local-reference beats Figma MCP grazing — quota-free
consultation on the exporting machine, with metered MCP reads reserved
for value-precise needs at story opens. [Path reference removed
2026-08-08: the local-reference convention forbids in-repo references
to its directory; exports are per-machine and never a repo dependency
— a consulting seat re-exports locally or uses metered MCP reads.]

### Reference texture notes

- The official kit carries a JAUNTY-ANGLE-LABEL component (Form
  elements) — upstream precedent for the off-horizontal concept. The
  owner stands cheerfully corrected on precedent with NO ruling change:
  the Oak-zero-tilt stance governs our Oak identity; the official
  jauntiness is reference texture for the EMC² lean and a someday owner
  call for Oak decoration.
- The "Cotent" typo in the kit's Design Principles frame metadata is
  real in the official kit — the owner's export is even named
  `Cotent.png`.

### Day-close boundary

Owner word ~16:45Z: all seats rest; the Director compacts after the
knowledge-safety pass; morning resume via the Director's day-close
broadcast on canonical comms. This fold executed at that resume
(2026-08-06 morning), completing the channel's conserve-at-close
obligation for the sitting.

## Adjudication addendum — PR-comment pass (2026-08-08, Director seat)

Adjudicated from PR #784's review comments (Codex and Copilot), each
verified first-hand before absorption; the counts above carry their
own dated corrections. Four findings bind FUTURE instruments, not this
record — recorded here so the register migration and the story cards
inherit them:

1. **Folly attestation pins its upstream**: the attestation records an
   immutable upstream reference (Oak Components commit sha or content
   digest) fetched at audit time. A sha stores no official values, so
   reproducibility is gained without storing what the ruling forbids.
2. **Delta-E names its formula**: "delta-E ~1–2" is not reproducible
   until the story card names the formula and threshold convention
   (CIE76, CIEDE2000 and OKLCH-native deltas differ materially). The
   choice belongs to the story card per the owner's boundary-calls
   ruling; the just-noticeable-difference claim binds once named.
3. **Attestation semantics under exemptions**: the zero-exact-match
   claim binds the NON-EXEMPT expressive families only; exempt values
   (pure white, true black, the generic grey ramp; ci-\* exact by
   scientific provenance) are enumerated in the attestation with their
   recorded grounds, so the attestation stays truthful.
4. **Editable-slides data boundary (ledger item 9)**: at story mint,
   the story defines the data boundary — localStorage persists across
   sessions and is readable by any script on the origin, so the story
   carries auto-clear or expiry, a reliable reset, and
   no-sensitive-input guidance. "Privacy trivial" was sitting
   shorthand, not a design conclusion.

These four route to the design seat's story cards (the folly/identity
story, the editable-slides mint); the register migration carries them
with the verdict rows.
