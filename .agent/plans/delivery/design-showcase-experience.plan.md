---
id: design-showcase-experience
node_type: delivery
name: 'The showcase experience — a UX-first public face for the design system'
overview: 'Deliver the design system''s public face as an experience its visitors can use: a front page that lands its point in the first screenful of a 320px phone, a switching demo where the specimen dominates its controls, a composition demo where one page type is recomposed by identity with byte-identical markup, and the kit-level responsive foundations every page inherits — narrow first, wide follows, with wider viewports spent as freedom rather than fought as constraint.'
status: ratified
ratified_by: 'Jim Cresswell (owner)'
ratified_date: 2026-08-13
ratified_where: 'Owner word, design-lane session (Swordfish wakes Trench, d0274e), 2026-08-13: both ratification confirmables answered "yes" — the audience model, and R10 with the general form stated: "fix things at the lowest level where the fix works and produces the correct outcome"'
serves: design-system-as-configured-framework
impact_areas:
  - design-system
tickets: []
depends_on:
  - plan: design-system-completion
    kind: beneficial
owner_gates: []
# The R14/R15 re-cut gate CLEARED 2026-08-13 evening: owner word "ratified,
# please proceed" at the successor seat (Skua binds Leeward, e2b222), given
# against the compare view 76a0d9e13...8c23be9a0. The re-cut's former
# confirmable had already been answered by R15 from first principles.
# Three gates were drafted and then dissolved on 2026-08-13, each because the
# question turned out to be answered rather than open. Reading order: answered
# by the owner's own correction (R13). The brand type-slot: decomposition
# preserves the ramp affordance rather than revoking it and prices as a MINOR
# addition under the contract's own semver rule, so it is plain engineering.
# ADR-213 §3's binding fork: already exercised by the owner's tight scope,
# which commissions this composition page by name. Manufacturing a gate the
# owner must clear is its own failure mode. The one gate above is different in
# kind: it re-opens a RATIFIED kit clause the owner's R14 word now contradicts
# — precisely the class only he can settle.
last_updated: 2026-08-13
---

# The showcase experience — a UX-first public face for the design system

**Authoring note (2026-08-13).** This node owns the showcase surface and its
sequencing. It is a new node, not an addendum to `design-system-completion`, and
it states its relationship to that plan rather than silently contradicting it
(§Relationships). It was written at the owner's instruction: he asked which
document defines the current work, and none did — the day's governing rulings
(the tight scope, narrow-first, the pinned composition shape) lived across
session records, comms, and memory, while `design-system-completion` predates all
of them. Born `sketch`; the owner ratifies after review. Every decision below is
either owner-worded (quoted, dated) or a seat verdict marked as one.

**Review note (2026-08-13).** A six-expert fleet returned FIX-FIRST on every leg,
with 80 findings. The substantive cures are recorded in place. Four are worth the
owner's eye because they changed what this plan asks for: W1 collides with a
semver-protected clause of the kit's published brand contract (§W1); W2's
demonstration collides with a ratified kit invariant on reading order (§W2); two
of R1's four outcomes had already landed and the plan read as though none had
(§Mechanism); and W5 rested on review-finding numbers with no home in the repo,
now restated from first-hand evidence (§W5).

**Supersession note (2026-08-13 ~17:00).** The owner's later ruling on the
identity control — a native radio group whose arrow keys switch identity
instantly — supersedes the reconciliation this plan had reached from the
accessibility review (R12). W2 and W3 carry the ruling; the review's concerns are
recorded as considered-and-outweighed with their mitigations, not dropped.

**Re-true note (2026-08-13, the correction that matters most).** The owner read
this plan and found it enforcing a constraint nobody had ever set: "I don't care
about DOM order, why would I … the made up thing contradicts the ask because it
is made up. just question everything, go back, identify assumptions, trace their
origins, and do better." He was right, and the failure was structural rather than
careless. The "composition envelope" came from reviewer findings absorbed into an
**unratified** plan; this plan inherited it as governing, built acceptance
criteria around it, escalated the resulting tension to him as a decision, and had
that framing endorsed twice on the way through. Nobody in the chain asked where
the constraint came from.

Three changes followed. The envelope is deleted, and visual reordering is now the
demonstrated virtue R13 says it is. Three drafted owner gates dissolved once
traced (§Questions that turned out not to be his), leaving `owner_gates: []`.
And every binding constraint now carries an **authority class**, so the next
reader can see at a glance what governs and what is merely written down.

**Pillar re-cut note (2026-08-13 evening).** The owner re-framed W1 minutes
before implementation opened (R14): fluidity is the pillar the system is built
on, never a feature incrementally added. §W1 was re-derived under that word,
absorbing the day's two pre-execution reviews (both REVISE: the fluid curve
was under-determined by four parts, the floor rule failed its own purpose when
probed, and the `@deprecated` arm misstated the contract). The re-cut's owner gate
CLEARED 2026-08-13 evening — owner word "ratified, please proceed" at this
seat, against the compare view `76a0d9e13...8c23be9a0`; its single
confirmable had already been dissolved by R15. Tranche-1 execution opens
from that word.

## Goal

When this lands, a person who opens the showcase on the device in their hand
understands what the Oak Open Curriculum Design System is and sees it doing its
job — on a 320px phone as readily as on a 1920px display. Today they cannot:
every identity's display headline is a fixed size at every viewport width (56px
on the Oak base, 48px on PDS, 84px on EMC²), the composition demo shows grey
stubs instead of a page, and the switching demo's controls compete with the
specimen they control.

## The vision — the visitors come first

The showcase is the design system's public face, and its job is the visitor's
comprehension, not the system's self-description. That inverts the usual demo
instinct. A demo built to enumerate features produces a specimen sheet; a demo
built for a visitor produces a page that says one true thing well and then shows
it happening. The owner rejected the first out of hand ("visually I would reject
it out of hand as incompetent", 2026-08-02) and the tight scope is the second.

Three properties define the experience:

1. **Excellent at every width, starting narrow.** Not "responsive" in the sense
   of surviving small screens — excellent at 320px as the designed base, with
   every wider viewport spending its extra room on something the narrow layout
   could not afford. Constraint is never coped with; freedom is taken advantage
   of.
2. **The demonstration dominates its chrome.** On a demo page the thing being
   demonstrated is the subject and the controls are furniture. A viewer's eye
   should land on the specimen, and the controls should be findable when wanted
   rather than loud when not.
3. **Provenance is one step away from anywhere.** An evaluator who believes what
   they are seeing needs the source, the licence, and the docs without hunting.

UX before UI throughout: what the visitor is trying to do decides the layout,
and the layout decides which classes and tokens get typed — never the reverse.

## Who this is for (audience model — seat proposal, owner-correctable)

Proposed by the executing seat 2026-08-13 from the observable record of who has
been shown this surface. Not owner-ratified; the owner corrects it at
ratification and the user stories move with it.

| Audience | What they arrive wanting | What the showcase owes them |
| --- | --- | --- |
| **Evaluators and adopters** — engineers and designers deciding whether to adopt or borrow | Whether this system is real, current, and worth their time | A working demonstration inside thirty seconds, then a path to the code |
| **Oak stakeholders** — colleagues who need to see what has been built | A story they can retell in one sentence | A front page whose thesis survives being read once, on a phone, in a corridor |
| **Visitors with access needs** — keyboard-only, screen reader, reduced motion, forced colours, 400% zoom, small screens | The site to work the way their machine is already configured | OS preferences honoured on arrival, plus deliberate display settings that persist |
| **Source-seekers** — people who want the code, the licence, or the docs | A link, not a tour | Repository, licence boundaries, and documentation reachable from every page |

## User stories — the acceptance frame

Five stories, drafted 2026-08-13. **Every work item below traces to at least one
of them**; an item that traces to none is out of scope by construction.

- **S1 — first screenful on a phone.** As a visitor arriving on a 320–390px
  phone, the first screenful tells me what this is and what I can do here,
  without pinching, sideways scrolling, or a wall of text.
- **S2 — specimen and controls together.** As an evaluator on the switching
  demo, I can see the specimen page and the controls that change it at the same
  time, and the specimen is plainly the subject.
- **S3 — the thirty-second stakeholder.** As an Oak stakeholder with thirty
  seconds, I can go front page → one demo → back, and come away able to say what
  the system does.
- **S4 — my machine's settings, and mine.** As a visitor with access needs, the
  site honours my OS preferences (colour scheme, contrast, reduced motion) on
  arrival, and I can also set the display deliberately and have that choice
  persist.
- **S5 — the provenance path.** As a potential adopter, from any page I can
  reach the source repository, the licence position, and the system's
  documentation in one step.

## Authority classes

Every binding constraint in this plan carries one of four authority classes, and
the class is stated wherever the constraint is asserted. The discipline exists
because this plan already failed without it: an elaborate "composition envelope"
was treated as governing for two review rounds when its only source was reviewer
prose inside an unratified plan, and it contradicted the owner's actual ask.

| Class | What it means | How it is treated |
| --- | --- | --- |
| **[owner word, dated]** | The owner said it; quoted verbatim with a date | Governs. Later word supersedes earlier |
| **[owner-ratified doc]** | An accepted ADR/DDR, or the kit's published contract | Governs until amended; amendments are dated and cite their authority |
| **[external standard]** | WCAG 2.2, ARIA APG, DTCG, CSS specs | Governs on its own terms; no local ratification needed |
| **[engineering practice]** | A landed instrument, a shipped mechanism, a verified repo fact | Governs as fact. Cite the file, not a plan that describes it |

**Unratified plan prose is not an authority class.** `design-system-completion`
is `status: sketch`, `ratified_by: null` — its charter clauses, its workstream
shapes, and the reviewer findings absorbed into it bind nothing here. Where this
plan needed something that document contains, the constraint is re-derived from a
real authority or dropped (§Coherence check).

## Governing rulings

Dated and quoted. Owner words are verbatim; seat readings are marked as such and
carry their grounds.

| # | Ruling | Provenance |
| --- | --- | --- |
| R1 | **The tight scope.** "The old showcase purged because it was terrible. A new and good front page for the showcase, and two pages, one demonstrating the identity switching and theme switching, one demonstrating the page sutrcture being maximally configurable via css without the markup changing" … "other work done should be made safe, nothing should be thrown away unless it is at odds with our goals, but the above is the tight scope that allows us to deliver impact before working on improvments" | Owner, 2026-08-13 (verbatim, sic) |
| R2 | **A11y on the kept pages is delivery, not improvement.** "if you are fixing a11y issues on the identity page I think that is entirely consistent with delivery of the identity page" | Owner, 2026-08-13 (mid-turn ratification) |
| R3 | **Narrow first.** "if we make the narrow viewport work excellently, then at broader viewports we can use the extra space advantageously, if we start with designing for wide viewports first then the same work instead becomes a fight to constrain the design at narrow viewports. Narrow first, wide follows, always, everywhere." | Owner, 2026-08-13 |
| R4 | **No coping with constraint.** "get rid of the concept of coping with constraint, we design an excellent base that works at all widths including very narrow, and then we take advantage of the freedoms afforded to us at broader widths." Consequence, owner-stated in the same breath: identities sharing one excellent narrow base is CORRECT, not a gap. **No per-brand narrow maps.** | Owner, 2026-08-13 ~17:1x |
| R5 | **The demo dominates the controls.** On the switching demo the embedded demo page must dominate over the controls, especially at narrow viewports. | Owner, 2026-08-13 ~16:00 (skeleton review) |
| R6 | **The composition demo's bar is CSS Zen Garden** — "a page designed to optimise the degree and demonstration and communication of configurability of visual appearance with fixed markup". A stub or wireframe grid communicates the mechanism, not the power. The method comes from the repo's own prior research: the owner's paper, `docs/governance/one-html-many-css-compositions.md`. | Owner, 2026-08-13 ~16:00; source-gate discharged same day |
| R7 | **The composition shape, pinned.** "a given page type can be displayed very differently, with significantly changed layout, in different identities, but with the exact same markup" — one page type, recomposed BY IDENTITY via the ratified region-contract map tokens. A page-type comparison (unit vs home vs proof) is "not at all what I mean". | Owner, 2026-08-13 ~16:4x (supersedes the seat's earlier single-identity verdict) |
| R8 | **Arranged well at every width.** "what I want is that at a given width, natively or via the selector, the page is arranged well." Showing the frame scaled at the selected width is fine; full size is one click away. No auto-defaulting of the width control. | Owner, 2026-08-13 ~16:4x |
| R9 | **Radio identity selection; tighter narrow controls.** Identity presented as radio selections (only ever three); one row identity, one row theme + width; less space at narrow, with vertical separation and font size adapting to viewport. | Owner, 2026-08-13 ~16:39 ("at a convenient time") |
| R12 | **The arrow-key switch is the demonstration.** A NATIVE radio group, where arrowing across identities re-skins the page instantly: "being able to change the identity instantly with the arrow buttons is a very cool demonstration of the power of what we have achieved here." Settles R9's final form and supersedes the seat's buttons-plus-`aria-current` reconciliation. | Owner, 2026-08-13 ~17:00, relayed via the Director |
| R13 | **Visual order is part of what CSS must be able to change — and DOM order is not the point.** "I don't care about DOM order, why would I … I care that someone can author markup and then control the *appearance* that markup leads to with CSS and I care that our system is designed to maximally enable visual change, including visual order, via css … the made up thing contradicts the ask because it is made up. just question everything, go back, identify assumptions, trace their origins, and do better." **Deletes the composition envelope as a binding axis** and makes visual reordering a demonstrated virtue rather than a divergence to disposition. | Owner, 2026-08-13, relayed via the Director |
| R10 | **Responsive behaviour is a design-system-level obligation, not a per-page one.** *Seat reading*, derived from R3's "always, everywhere" and R4's "excellent base": a page-level responsive fix cures one page, while the same gap re-appears in every other consumer of the kit. Where the gap is in the kit, the cure is in the kit. Grounds: the kit's own accessibility charter already binds it to "usable at 400% zoom / 320px width without loss" (`packages/design/oak-design-system/CLAUDE.md`), which the current fixed type ramp does not deliver. **Owner-confirmed at ratification, with the general form stated: "fix things at the lowest level where the fix works and produces the correct outcome"** — the kit is that level for responsive foundations; the principle governs level-selection for every fix in this plan. | Seat verdict, 2026-08-13; confirmed and generalised by the owner at ratification, 2026-08-13 |
| R11 | **Demo copy is product voice, never internal doctrine.** The pages speak to their visitors about what the system does; they never quote the estate's own governing vocabulary at them. | Seat reading from the editorial-voice doctrine; consistent with the owner's rejection of specimen-sheet framing |
| R14 | **Fluidity is a pillar, not a feature.** "we shouldn't be incrementally adding fluidity to the design system, it should be the fundamental pillar it is built on." Re-frames W1 from retrofit to foundation: every visual-scale dimension is fluid by construction, and fixedness is a declared, reasoned exception in a named register — the exception set is drawn by principle, each entry carrying its reason and revisit condition. Incremental DELIVERY of the pillar (bounded tranches) stands; what the word rejects is fluidity designed as an added feature whose exception set is drawn by retrofit reach. | Owner, 2026-08-13 evening, direct at the successor seat (Skua binds Leeward, e2b222); captured verbatim at occurrence in seat memory and the napkin drift entry |
| R15 | **The three identities are a demonstration instrument, not system parts.** "the three identities are not at all parts of the design system, they are three parts of a tool to *demonstrate* the flexibility of the design system" — demonstrating "the extreme ability of the design system to handle very different designs without the need to alter the underlying page structure". Briefs: Oak is set by the origin examples via an orthogonal basis set of preserved aspects ("in setting those constraints we do absolutely affect the design system architecture"); PDS tracks GDS "as closely as we can manage"; EMC² "exists to form a point in the phase space of the design system possibilities *as far away from the other two as possible*" — "turn everything up to 11", including "profoundly altering page order and visual flow without any changes to markup"; "fundamental and *deep* rebranding can be achieved with a few config files". Conditional directive: "if the design system does not support that, then it needs to be changed to support that." Ambient invariants: "Responsive layouts and strict a11y are assumed and required at all times" — never tranche scope, always assumed. Method instruction, standing: questions about identity differences are answered from first principles (WHY the differences exist), never by adjudicating written clauses against each other. Anchoring refinement (same evening, verbatim): "the Oak identity is anchored by Oak design and the PDS identity is anchored by GDS Goverment Digital Services design, and EMC2 is an unanchored fever dream that exists to show the extremes of what the system can, and those extremes are considerable and profound" (sic) — two ANCHORED identities expressing existing systems, one UNANCHORED extremal probe; for the anchored pair, distance from Oak is a consequence of fidelity to their anchors, never the objective; only EMC² maximises distance as its brief. | Owner, 2026-08-13 evening, direct at the seat, answering the rhythm-affordance confirmable from first principles; verbatim in per-user memory (three-identities-are-a-demonstration-instrument) |

## Mechanism

Six workstreams, in delivery order. W1 is first because it is the layout-level
cure every other page inherits — doing it after the pages would mean
re-reviewing all of them. W2–W5 are the pages themselves. W6 is the true-up tail
that rides the changes rather than following them.

Each workstream states the verified problem, the decided mechanism, the stories
it serves, and its acceptance proof.

### Where R1's four outcomes stand today

**Two of the four have already landed.** Commit `a967f8979` (2026-08-13 17:13)
records it: "purged the old front-page switchboard and specimen sheet
(Switchboard, Hero, TypeSpecimen, ButtonsSpecimen, TagsSpecimen, CardSpecimen +
Switchboard.unit.test — owner-directed purge); the new landing is masthead + hero
thesis + two demo door cards (next/link) + footer. New /composition stub rides as
the current route pending its owner-specced rebuild."

| R1 outcome | State | Remaining here |
| --- | --- | --- |
| 1. Purge the old showcase | **Landed** `a967f8979` | Nothing. §"What the purge did not remove" is a standing boundary on future work, not an instruction to act |
| 2. A new, good front page | **Landed** `a967f8979` — `app/page.tsx` is that landing | No workstream builds it. W1's ramp cure re-verifies it at 320px in all three identities; an owner verdict row completes it |
| 3. The identity + theme switching demo | Partly landed (`a967f8979` narrow-first stage, owner-verified) | W3 controls, W5 masthead |
| 4. The composition demo | Stub only — the route exists, the demonstration does not | **W2**, the largest remaining build |

So this plan's remaining scope is one new page, the controls and masthead around
an existing one, the foundations all of them inherit, and the record true-ups
that ride those changes.

**One precondition governs all six.** ADR-213 §3 arms a hard gate on the **first
component export consumed from `@oaknational/oak-design-react`**: the ADR-147
gate extension — per-theme axe, a forced-colors render check, and `test:a11y`
promoted in CI — must land with it, and the 2026-08-02 amendment records that
gate as unchanged and still armed. **It does not fire today**, verified rather
than assumed: every showcase import from that package is a constant
(`IDENTITY_DEFAULT`) or a type (`OakThemeSnapshot`, `OakThemeName`), never a
component. No workstream here needs one. If W3 or W4 reaches for a compiled
component, the gate extension becomes a precondition of that workstream, not a
follow-up to it.

---

### W1 — The fluidity pillar, tranche 1: fluid display type

**Serves:** S1, S3 (and every page thereafter). **Ruling:** R14, R3, R4, R10.

**The pillar (R14) governs this workstream's shape**: fluid by construction on
the visual-scale axis, fixed only by declaration in the register below. The
axiom lands in the kit's own contract surfaces with this tranche — a dated
`DECISIONS.md` entry and the `brand.css` §1b restatement — because a pillar
recorded only in plan prose is plan-authority, which binds nothing.

**The verified problem.** The kit ships a fixed type ramp and fixed leading:
`--font-size-10: 3.5rem` through `--font-size-14: 6rem`, paired with fixed
leading tokens (`--leading-64: 4rem`), in
`packages/design/oak-design-system/colors_and_type.css`. `.oak-heading-1`
therefore resolves to 56px on a 1920px display and 56px on a 320px phone. Across
the kit's own authored CSS there are exactly three `clamp()` declarations —
`--band-pad`, `.oak-container`'s `padding-inline`, and `--main-gutter`. Nothing
else in the kit **scales** with viewport width; its only other width response is
the single 840px map switch. Every page built on the kit inherits that, which is
why narrow-viewport problems keep re-appearing per page.

The workaround already in the tree is the proof of R10. The showcase's
`app/globals.css` carries `.hero-inner h1 { overflow-wrap: anywhere; hyphens:
auto; }` with the comment "SC 1.4.10: 'Curriculum' is wider than a 320px line at
display sizes (Creature's 84px ramp especially) — hyphenate rather than
overflow." That is a page-level cure for a kit-level gap: it stops one word
overflowing on one page, and every other consumer of the ramp still breaks.
Cure the ramp with fit-derived floors and the workaround becomes unnecessary —
a claim the rendered fit cell must prove, never assume: the first derivation's
EMC² floor still overflowed at 320px when probed.

**The trap this workstream must not fall into.** The obvious cure — wrap the
`--font-size-*` primitives in `clamp()` — would cure the Oak base identity and
nothing else. Verified in the brand sheets: **both counter-identities re-point
the entire type slot with the `font` shorthand and literal sizes**, so they never
read the primitives at all.

| Slot | Oak base | PDS | EMC² (creature) |
| --- | --- | --- | --- |
| `--type-heading-1` | `var(--font-size-10)` = 56px, leading `4rem` | `700 3rem/1.05` | `800 84px/1.02` |
| `--type-body-3` | `var(--font-size-2)` = 14px | `400 0.875rem/1.43` | `400 16px/1.5` |

CSS cannot scale a size term inside a shorthand a brand wrote as a literal.
So the fluidity has to live at the layer brands actually write, or two thirds of
the showcase's surface stays fixed — on the very demo whose subject is the three
identities.

**The contract this collides with — the decision the owner must make.** The kit's
published white-label contract makes the whole-shorthand type slot the brand
surface *by decision*, and protects it by semver. `brand.css` §1b: "**THE RAMPS**
— the deepest re-brand level. Faces recolour a brand; RAMPS restructure it. Each
type slot is a whole font shorthand — re-point slots to reshape scale, hierarchy
and rhythm: `--type-heading-1…7`, `--type-body-1…4`, `--type-label`,
`--type-code-2…4`". Its stability clause: "everything named in this file is the
PUBLIC surface, protected by semver … Names are never silently renamed — a
deprecated name keeps working for ≥1 minor release, marked `@deprecated` at its
definition." The kit's DECISIONS records the reasoning: "true re-branding needs
the SHAPE of the scales on the surface".

**What the decomposition actually does to that contract, on inspection: it keeps
it.** The ratified intent is that the ramp level lives on the brand surface —
"true re-branding needs the SHAPE of the scales on the surface". Decomposition
does not take the ramp away; it makes the same control finer-grained. A brand
still shapes each slot's scale — bounds and leading — while weight and family
stay on the existing `--weight-display` / `--font-display` knobs, and it gains
a fluid range it could not express in a single shorthand. Nothing is revoked.

On inspection there is not even a naming change: nothing is renamed, removed,
or stops working — the slot names remain the public composite the classes
consume, and the parts arrive as new finer-grained surface. The CHANGELOG's own
semver rule prices that as a MINOR addition (new tokens/levers), with one
honest CHANGELOG sentence for the value change below saturation (headings
render smaller below 960px — a consumer pinning layout to fixed heading sizes
should read it before upgrading). The stability clause's `@deprecated` path is
for renames and is not engaged; marking the live, still-consumed slots
deprecated would misstate the contract and advertise a MAJOR removal nobody
intends. `brand.css` §1b and CHANGELOG are edited in the same change. Plain
engineering under a published rule.

An earlier draft escalated this to the owner as a MINOR-or-MAJOR decision; a
second draft prescribed an `@deprecated` cycle. Both were wrong readings of a
contract that answers the question itself — the second caught by the
2026-08-13 pre-execution design-system review.

**The decided mechanism** (re-derived 2026-08-13 at the R14 re-cut, absorbing
both pre-execution reviews — code-expert and design-system-expert, each
REVISE; the design-system review verified the load-bearing mechanics
first-hand in headless Chromium. Dispositions in the decision log).

1. **Two brand-authored numbers per fluid slot; the kit derives the curve.**
   Each fluid heading slot N gains two unitless bound parts —
   `--type-heading-N-min` and `--type-heading-N-max`, plain numbers of rem —
   and one unitless `--type-heading-N-leading` ratio. The kit assembles:
   `--type-heading-N: var(--weight-display) clamp(calc(var(--type-heading-N-min) * 1rem), calc(var(--type-heading-N-min) * 1rem + (var(--type-heading-N-max) - var(--type-heading-N-min)) * (100vw - 20rem) / 40), calc(var(--type-heading-N-max) * 1rem)) / var(--type-heading-N-leading) var(--font-display)`.
   The curve is wholly derived from the bounds: a brand expresses a fluid
   intent in two numbers and cannot author a stale interpolation. A kit-fixed
   middle term is correct for at most one brand per slot (the four-part shape's
   fatal flaw — CSS cannot derive a slope from bounds without length division,
   which ships only in current engines, is not `@supports`-detectable, and
   fails to inherited 16px silently). The ramp runs 320px→960px: bounds stay
   rem-true under text resize; slots sit at today's exact values from 960px up,
   so the estate's 1280/1440 comparison widths render unchanged, and the
   two-width resize cells pass at both 320px and 1920px — the earlier
   1920px-saturation derivation made the reach-maximum and resize cells
   jointly unsatisfiable (`rem` doubles under a root-font change; `vw` does
   not).
2. **No weight or family parts.** All three identities set `--weight-display`
   and `--font-display` once and never vary either by slot; the assembly
   consumes the existing knobs. Per-slot duplicates would strand the
   documented brand surface as dead code for headings.
3. **Fluid slots this tranche: heading-1..3** — the slots with measured 320px
   defects (56/48/84px display type). heading-4..7 are fixed by declaration in
   the register below, each with its reason and revisit condition. Nine new
   kit variables, nine DTCG leaves.
4. **Floors derive from the constraint they exist to satisfy** — the longest
   hero word fits a 320px line in each identity's own display face — and the
   proof is rendered, never arithmetic. The prior ramp-step rule was undefined
   for nine of fourteen counter-brand maxima (not ramp members), and where
   defined its EMC² floor still overflowed at 320px when probed: an
   arithmetic-against-itself acceptance that would green an overflowing page.
   The front page's hyphenation workaround (`app/globals.css`, "Creature's
   84px ramp especially") is removed in the same change only if the rendered
   fit cell proves it dead; its comment is re-trued either way.
5. **Leading follows size with zero rendered delta.** Each fluid slot's
   leading rides as its third part token (`--type-heading-N-leading`),
   carrying today's exact shipped ratio directly (1.1429, 1.1667, 1.2 for
   the Oak base) — every rendered value byte-identical at maximum width.
   Parts are definitionally literal unitless numbers (that IS the parts
   contract, bounds included), which is what point 3's nine-variable
   arithmetic already assumed; an earlier draft's separate
   ratio-primitives-tier line was vestigial from the pre-bounds shape and
   is corrected here (trued at implementation, 2026-08-13). A designed
   ratio ladder is a separate, owner-visible decision this tranche does not
   take.
6. **Brand sheets migrate to bounds; sheets and served copies together.** PDS
   and EMC² replace their whole-slot heading-1..3 shorthands with unitless
   bounds (maxima = today's exact rendered sizes; px-authored values convert
   on migration). EMC²'s px body slots convert to rem with the guard in
   slice B, per the contract's own "Slots stay in rem" clause. Studio-source
   and served copies move in the same change under the kit-asset-parity gate;
   the guard walks studio-source only — parity already proves the copies
   byte-identical.
7. **A whole-slot shorthand is a documented opt-out; nothing is deprecated.**
   The slot names stay, the classes keep consuming them, and a brand's
   whole-slot literal keeps winning by cascade — the declared-fixed choice the
   register recognises, recorded in `brand.css` §1b. The guard (slice B) is
   all-fatal with no warn arm: it rejects unit-bearing values in bound parts,
   and rejects a brand sheet declaring BOTH a slot's shorthand and its parts
   (the shorthand wins and the parts become silent dead code — the real
   authoring hazard). Its red-first fixture extends the kit's existing tracked
   negative control (`studio-source/whitelabel/failing-example.css`). No warn
   arm also means no collision with the no-warning-toleration rule. The guard
   lives in `agent-tools/src/validators/` beside the estate's other repo
   validators and joins the `repo-validators:check` chain; no existing
   brand-admission validator exists to copy — red-first is how it earns its
   place.
8. **A print arm at the maxima — on plain `:root`, deliberately.** Inside
   `@media print` the fluid slots re-declare at their maxima. Plain `:root`
   rather than the ink-safe flip's `html:root` (trued at implementation,
   2026-08-13): `print.css` loads after `colors_and_type.css`, so its
   `:root` wins the kit-internal tie for parts-driven brands — while a
   brand that opted OUT via a whole-slot shorthand (loaded after all kit
   css) rightly keeps its own fixed print size by cascade order. An
   `html:root` pin would override that opt-out with derived values the
   brand never chose. The print comparand sits outside the DTCG
   consistency walk (top-level `:root` rules only), so the arm carries no
   token obligation.
9. **DTCG: nine flat `number` leaves; no composite; the functional set
   restated.** The bound and leading parts land as flat sibling leaves
   (`type.heading-N-min` and kin — a child under the existing
   `type.heading-N` token would be an illegal token/group hybrid) with
   `$type: number`, the honest type for unitless values, in the tree set the
   consistency validator walks. The `typography` composite is ruled out now —
   the token walker accepts only scalar `$value`s, so a composite reddens CI —
   and belongs to separate `design-tokens-core` work. The changed
   `--type-heading-1..3` composite values carry `clamp()`:
   `dtcg/README.md`'s functional-value sentence widens from its
   `color-mix()`/`calc()` phrasing (15 tokens) to functional CSS expressions
   generally — 21 today, 24 after this change — and the regeneration route is
   recorded there (studio round-trip, or a stated exception; no in-repo
   regenerator exists).
10. **The composed-token rule, scoped correctly.** Custom-property
   substitution resolves against the cascaded winner on the SAME element, so
   brand `:root` parts reach the kit's `:root` assembly across separate
   stylesheets by load order (probe-verified). Brand sheets must NOT
   re-declare the composite — doing so opts out of the very fluidity the parts
   express. The kit's recorded re-declare rule bites on descendant-scope
   overrides only (its provenance is a band-scope shadow token), and the
   shipped motion tokens work by the same-element mechanism — not, as this
   plan earlier claimed, by re-declaring the composed verbs per scope; that
   citation is corrected by this re-cut.

**Rhythm is Oak-base-only in this scope, and that is stated rather than
discovered.** An earlier draft added a kit-owned `--density-viewport` multiplier
alongside the brand `--density` knob. Verified first-hand, that reaches the Oak
base alone: both counter-identities override the *derived* spacing tokens
directly — EMC² sets `--gap-m: 24px`, `--inset-m: 32px`, `--card-pad: 32px`; PDS
sets `--density: 0.9` **and** `--gap-s/m/l` and `--inset-s/m/l` in literals — and
brand CSS wins at equal specificity. The same fact makes `--band-pad`, one of the
kit's three `clamp()` sites, already inert on two thirds of the showcase. Direct
override is a ratified affordance, not an oversight ("direct overrides still win …
so existing brands didn't change behaviour"), so constraining it would need a
dated DECISIONS amendment. **Under R14 this is a register row, not a scope
note**: the affordance is the one ratified clause that actively fights the
pillar, and re-ruling or keeping it is the single owner confirmable riding
this re-cut's ratification glance (register, final row). Until his word, the
multiplier lands for the Oak base, the counter-identities keep fixed rhythm,
and the acceptance below measures which is which rather than letting the
difference pass unnoticed.

**The fixed-point register (R14).** Fixedness on the visual-scale axis is a
declared, reasoned exception — never an unnamed residue of retrofit reach.
Initial rows; each carries its reason and its revisit condition:

| Fixed dimension | Reason | Revisit condition |
| --- | --- | --- |
| Body slot sizes (`--type-body-1..4`) | Reader font-size sovereignty: the reader's browser preference is the sole controller of body text — an accessibility commitment, not a gap. Their UNITS convert to rem in slice B — the opposite concern | An owner ruling changes the sovereignty commitment |
| `--type-heading-4..7` | At or near body scale (32/24/20/16px maxima); no measured 320px defect; a derived floor would land at or below the kit's readability floors and compress four heading levels into an 8px band | A measured narrow-width defect on any of these slots, or tranche-2 pricing |
| The eleven primitive-composed classes (`.oak-heading-light-1..7`, `.oak-body-1..3-bold`, `.oak-code-2-bold`) | Compose from primitives directly, bypassing the slots; no showcase page uses any (grep-verified); folding them in doubles the tranche surface | Tranche 2, owner-priced. Latent kit inconsistency to price with it: below saturation `.oak-heading-light-N` and `.oak-heading-N` render at different sizes for N=1..3, where today they differ in weight only |
| `--space-*` primitives | Primitive tier; scaling them would move every derived value twice | The rhythm tranche (A2) operates at the derived tier, never here |
| Counter-brand rhythm literals (direct `--gap-*` / `--inset-*` overrides) | RESOLVED by R15 from first principles: the affordance exists so identities can be maximally DIFFERENT — but responsive is assumed at all times for every identity, so difference must be expressible in fluid-capable vocabulary. The literal-override shape is superseded in direction: brands express rhythm intent through fluid-capable parameters (the same intent-not-values shape as the type bounds), gaining equal-or-greater expressive range that cannot freeze against the viewport | Execution sequenced as the rhythm tranche (A2 grows into it); the dated DECISIONS amendment rides that tranche. Until it lands, the shipped literals stand as-built |

**Acceptance.** The harness fact governs placement: the kit workspace runs
`happy-dom` and carries no Playwright dependency, so it can resolve neither
`clamp()` against a viewport nor a media query. **These cells live in the
showcase's Playwright suite, run against the built kit CSS** — R10's "cure in
the kit" governs where the CSS lives, not where its proof runs. The resize
cells carry the `@a11y` title tag so `test:a11y` runs them; per-slot coverage
uses injected probe elements — no page renders every slot.

- `repo-safe` — computed-size cells, all three identities: heading-1..3
  computed `font-size` at 960, 1280, 1440 and 1920px equals today's value
  exactly (saturation from 960px; the estate's own comparison widths
  unchanged), and at 320px equals the identity's declared floor.
- `repo-safe` — the RENDERED floor-fit cell: at 320px, in each identity, the
  front-page hero headline produces no horizontal overflow, with the
  hyphenation workaround disabled for the measurement. This is the cell the
  floors answer to — never ramp arithmetic tested against itself.
- `repo-safe` — the SC 1.4.4 two-width resize proxy: at 320px and 1920px with
  the root font size doubled, each fluid slot's computed px at least doubles,
  all three identities. Recorded honestly as a two-width proxy (between the
  anchors the ratio dips below 2× by construction); the criterion's own bar —
  no loss at 200% — is carried by the rem-true bounds.
- `repo-safe` — computed `line-height` at 1920px equals today's value for
  every fluid slot (the minted ratio primitives keep leading byte-identical).
- `repo-safe` — a rhythm cell naming what moved and what did not: for the Oak
  base a named rhythm token's computed value differs between 320px and 1920px;
  for both counter-identities it is unchanged, matching the register above.
- `repo-safe` — a print cell: under emulated print media, in a dark-first
  identity, a fluid slot computes at its maximum (the `html:root` arm wins).
- `repo-safe` — the brand-admission guard is red-first on both fatal arms
  against the extended `failing-example.css` fixture: a unit-bearing bound
  part fails; a sheet declaring both a slot's shorthand and its parts fails.
- `repo-safe` — the DTCG consistency validator green with the nine new
  `number` leaves and the `dtcg/README.md` functional-set restatement
  (21 → 24) in the same commit.
- `owner-held` — the owner sees the front page and the specimen at 320px in
  Chrome, in all three identities, before W2 opens.

---

### W2 — The composition page, rebuilt from scratch

**Serves:** S1, S3, S5. **Ruling:** R6, R7, R4, R11, R12.

**The verified problem.** `demos/oak-design-showcase/app/composition/page.tsx`
renders ten grey labelled stubs three times, once per shipped `data-page` map —
a page-TYPE comparison. R7 rules that shape out: "not at all what I mean". It
also fails R6's bar, communicating the mechanism while demonstrating none of the
power.

**The decided shape.** One page type, rendered once, recomposed by identity. The
page type is **`unit`**, chosen because it is where the shipped identities
genuinely diverge — verified first-hand in the brand sheets:

| Identity | `[data-page='unit']` map **above** the 840px seam |
| --- | --- |
| Oak (base, kit default) | `facets` and `results` side by side, `detail` below, full-width `resources` |
| PDS | `results` and `facets` **swapped**, on different track widths (`630px` main, `200–300px` aside) |
| EMC² (creature) | `detail` spans two rows beside `results` then `facets` — a different reading shape entirely |

Same markup, same DOM order, three genuinely different pages. That is the
demonstration.

**The seam is inclusive, and the plan says so once.** `components.css:1339` is
`@media (max-width: 840px)`, so **at 840px and below the narrow maps apply** and
all three identities render the same stack; the wide maps apply **above** 840px.
Any cell pinned at 840 would test three identical narrow maps and go red against
the kit rather than the page.

**The decided mechanism** (all four points settled at the 2026-08-13
pre-execution reviews — code-expert, design-system-expert, and
accessibility-expert, independently and in agreement):

1. **No `?brand=` on this route.** The page opens at the Oak base and the client
   hook owns every sheet. A server-rendered sheet plus a client swap is a real
   defect, not a style preference: the two disagree about what is applied.
   `useIdentity()` is called **with no argument**, which is its own-document
   default (`components/brand-identity-binding.ts`: "Omitted, it is the host
   document"). An inline closure argument would change identity every render and
   churn the link element.
2. **Server page shell, one client island.** The region content lives in sibling
   files so no single file carries the whole page.
3. **The switcher lives in the hero, not the facets region.** Under the EMC²
   map, facets land bottom-right — a bad home for the page's primary control.
   The pattern is **W3's native radio group**, inherited whole so the estate has
   one control shape: one tab stop, arrows switch identity immediately, a named
   group, a `role="status"` announcement, and help text stating the behaviour.
   On this page the instant re-skin lands even harder than on the picker: arrowing
   across three identities recomposes the whole page layout in place, which is the
   demonstration W2 exists to make. **Still rejected:** `aria-pressed` (no set
   semantics), `<select>`, and `tablist`.
4. **Narrow is one shared excellent base — by ruling, not by omission.** No brand
   ships a `--main-areas-narrow` override for `unit`, so at 840px and below all three
   identities render the same single-column stack. Under R4 that is correct and
   the page says so in its own copy: identity expression at narrow rides type,
   colour, and bands; compositional divergence is a freedom of width. The
   earlier pre-execution finding that narrow maps were delivery is **superseded**
   by R4, which arrived after it.

**Three constraints the kit's own records impose, each the kind that fails
silently.**

- **One identity at a time.** A reviewer will reasonably ask why the three
  compositions are not shown side by side. Two reasons, both engineering: a
  switcher is what R12's arrow-key demonstration needs, and three identities
  rendered simultaneously would mean theming three subtrees of one document,
  which hits the kit's KNOWN-ISSUES #14 — `:root`-declared aliases freeze under
  subtree high-contrast and colour-safe theming. Not a gate; a limitation with a
  named record.
- **The map does nothing if the page forgets `data-page`, and nothing for a
  region that is not a direct child.** KNOWN-ISSUES #7: `grid-template-areas` is
  all-or-nothing, maps live under `[data-page]` and never `:root`, and the
  region→area assignments are direct-child selectors by design — a stray close
  tag silently reparents everything after it and the demo renders a plain stack
  while claiming to prove composition. The layout-distinctness assertion below is
  what catches that.

#### Visual reordering is the demonstration, not a divergence

An earlier draft of this plan built an elaborate "composition envelope" around
this page — per-variant declared reading sequences, a DOM-order admissibility
rule, a `reading-flow`-inert binding cell — and escalated the resulting tension
to the owner as a decision he had to make. **It was made up.** Traced: the
envelope originates in review-fleet findings absorbed into
`design-system-completion`, which is `status: sketch` with `ratified_by: null`.
No owner word ever established it. His correction (R13) deletes it:

> "I don't care about DOM order, why would I … I care that someone can author
> markup and then control the *appearance* that markup leads to with CSS and I
> care that our system is designed to maximally enable visual change, including
> visual order, via css."

So the three identities' visual reordering is not a cost to be dispositioned. It
is **the virtue on display**, and the page's own copy spotlights it. Verified in
the shipped maps, above the 840px seam:

| Identity | What its map does with the same markup |
| --- | --- |
| Oak | `facets` beside `results`, `detail` below, full-width `resources` |
| PDS | `results` and `facets` **swapped**, on a 630px main against a 200–300px aside — a document with its filter panel on the right |
| EMC² | `detail` hoisted to sit across two rows beside `results` then `facets`, and `support` after `cta` — a different reading shape entirely |

That is the exhibit: one author's markup, three genuinely different visual
arrangements, **including their order**, achieved in CSS alone.

**One kit record needs truing, and it is not a collision.** The kit's DECISIONS
register lists among its system invariants "visual order = DOM/reading order (no
CSS reordering — WCAG 1.3.2/2.4.3)". That clause was written for the `--flow-*`
levers, where reordering content inside a component genuinely would break a
reading narrative. Applied to the region contract it contradicts the contract's
whole purpose and the owner's standing ask. W2 lands a **dated narrowing** to the
`--flow-*` levers it was written for, on two authorities: the owner's own
composition paper ("this does **not** mean visual restructuring is illegitimate")
and his 2026-08-13 correction, quoted in the amendment.

**Accessibility is held by instruments that exist**, not by a manufactured rule:
the landed axe suite across identity × theme, focus-visible cells, target size,
and reflow at 320px. And `reading-flow: grid-rows`, which the kit already ships
under `@supports`, aligns sequential and assistive-tech order with the visual
arrangement where the browser supports it — so the system's answer to "does
visual reordering cost anything?" is a shipped CSS feature, not a constraint on
what the demo may show.

**Copy.** Product voice (R11): the page tells the visitor that the markup is
identical and invites them to check, rather than lecturing them about region
contracts. The claim itself is not new — the kit's own DECISIONS records it as
proven: "the byte-identical specimen now renders three genuinely different page
architectures (Oak conventional / PDS GDS document with right-hand filter panel /
EMC² quest-log shelf) from the same bytes". W2 puts that recorded proof on a page
a visitor can see.

**Acceptance.**

- `repo-safe` — `tests/composition.spec.ts` asserts **markup invariance**: the
  rendered DOM skeleton (element sequence, `data-region` values, text content) is
  byte-identical across all three identities. This is the claim the page makes;
  it is the claim the test proves.
- `repo-safe` — the same spec asserts **layout distinctness** at a pinned
  **1024px** (DDR-009's first canonical width above the seam): the three
  identities produce three different computed `grid-template-areas` on
  `.oak-main`.
- `repo-safe` — `tests/composition-a11y.spec.ts` with a route-scoped opener: the
  route joins the showcase's existing axis (identity × the full theme roster)
  through `expectNoAxeViolations`, whose three landed assertions are
  `incompleteOutsideContrast` empty, `measuredContrastFailures` empty, and
  `novelUnmeasuredContrast` against `ADJUDICATED_UNMEASURED_CONTRAST`. The route
  joins that instrument **unchanged** — it is stricter than the rule-and-target
  allowlist the demos-charter clause describes, and an earlier draft of this plan
  wrongly called the two equivalent.
- `repo-safe` — **visual-order distinctness is asserted, not merely tolerated.**
  Above the seam, the three identities place at least one shared region pair in a
  different visual sequence — PDS transposes `facets`/`results`, EMC² hoists
  `detail`. That is the claim R13 makes central, so it is gated: if a future map
  edit flattened the identities into the same order, this cell goes red.
- `repo-safe` — the cells the neighbouring routes already carry and this one must
  not ship without: a **forced-colors** render per identity, **reflow at 320px**
  per identity, **focus-visible** in both polarities, and the kit's **44px target
  floor** on the switcher. These are the landed accessibility instruments; they
  are what holds this page, and they need no new rule to do it.
- `repo-safe` — `reading-flow: grid-rows` applies where the browser supports it,
  proved once. The kit already ships it under `@supports`; on a reordering page it
  is what aligns sequential and assistive-tech order with the visual arrangement,
  so it is worth a cell rather than a comment.
- `repo-safe` — the `.comp-*` rules are removed from `app/globals.css` with the
  stub; route-local styling lives in `composition.css`.
- `repo-safe` — two dated record amendments land in the same change: ADR-213 §3
  naming this demo as the region contract's first named binding (the fork R1
  already exercised), and the kit DECISIONS narrowing of "no CSS reordering" to
  the `--flow-*` levers, carrying R13's quote.
- `owner-held` — the owner sees the three compositions in Chrome at 320px and at
  a wide width.

---

### W3 — Switching-demo controls v2

**Serves:** S2, S4. **Ruling:** R5, R8, R9, R12.

**The verified problem.** The narrow-first stage rework has landed
(`a967f8979`) and the owner verified the pixels ("this is looking good"). The
controls are still three `LabelledSelect` dropdowns in a grid
(`app/identity-switchboard/page.tsx`), which is not the shape R9 asks for and
takes more vertical room at narrow than the stage can spare.

**The decided mechanism.**

1. **Two rows.** Row one: identity. Row two: theme and width. **Only identity
   becomes a radio group** — R9 names identity as the radio axis ("only ever
   three"); theme and width stay `LabelledSelect`, because theme has six values
   after DDR-003's amendment and width has seven, and a seven-radio row is the
   opposite of the narrow tightening R9 asked for.
2. **A native radio group — and the arrow behaviour is the point.** Owner ruling
   (2026-08-13 ~17:00, relayed via the Director, and superseding this plan's
   earlier buttons-plus-`aria-current` shape): "being able to change the identity
   instantly with the arrow buttons is a very cool demonstration of the power of
   what we have achieved here." So the control is a genuine radio group —
   `fieldset` + `legend`, or `role="radiogroup"` with roving tabindex — following
   the **APG default variant where selection follows focus**. One tab stop;
   arrow keys move *and* select; each arrow press re-skins the page instantly.
3. **The keyboard model, named once here so W2 inherits it: one tab stop, arrows
   switch selection immediately.** That is what the charter's control-pattern cell
   asserts. It is also APG-conformant by construction, where the earlier
   buttons-plus-`aria-current` shape was an estate convention standing in for a
   pattern.

   **The accessibility concerns this outweighs, recorded rather than dropped.**
   The pre-execution a11y review rejected a radio group on exactly this
   behaviour: selection-following-focus means every arrow press recomposes the
   page, and option three cannot be reached without passing through option two.
   Under the owner's ruling that traversal *is* the demonstration, so the
   objection is considered and outweighed — but the cost is real and carries
   mitigations rather than dismissal: the `role="status"` line announces each
   identity change so a screen-reader user is told what happened; help text beside
   the group states that arrowing switches identity immediately, so the behaviour
   is expected rather than discovered; and the re-skin is instantaneous rather
   than animated, which is what keeps it clear of vestibular-load concerns under
   `prefers-reduced-motion`. An earlier draft of this plan asserted that APG made
   a radio group impossible. That was wrong on the ARIA and is withdrawn twice
   over — the pattern is APG's own, and the decision is the owner's.
4. **Narrow tightening within the target floor.** Vertical separation and control
   font size adapt to viewport — after W1 they inherit the kit's fluid rhythm
   rather than carrying route-local media queries. The kit's 44px target floor is
   contractual and stricter than WCAG; `--sm` (36px) is **not** admissible on this
   strip. Shrinking controls is the tempting way to make the stage dominate, and
   it is the way that breaks the floor.
5. **What R8 forbids, stated precisely.** The width control never re-derives
   itself from the actual viewport — a viewer picks a width, the page does not
   pick one for them. **The 1280px opening width is unchanged**: it is
   DDR-009-warranted picker-parity, shipped, and covered by a green test. If the
   owner meant that the opening width itself should go, W3 grows to carry a
   DDR-009 amendment retiring that warrant — flagged here because the bullet's
   earlier wording ("no auto-default") read as though it already had.

**Acceptance.**

- `repo-safe` — `tests/identity-picker.spec.ts` asserts clicking each option
  swaps the brand sheet inside the frame without re-navigating it.
- `repo-safe` — the **control-pattern cell** the demos charter requires of every
  theme or identity control in any demo, applied to this switcher and to W2's,
  since they are now one pattern:
  - group semantics with an accessible name;
  - single-select state exposure — native radio semantics, exactly one checked;
  - the keyboard model of mechanism point 3 — one tab stop, arrows switching
    selection immediately, and a cell proving the arrow press actually re-skins
    (that behaviour is the owner's demonstration, so it is gated, not assumed);
  - a rendered assertion of name, role and value;
  - a selected indicator that is not colour alone.

  The last is the one a radio-STYLED control is most likely to lose: the styling
  is what carries the selection.
- `repo-safe` — a **target-size cell at 320px and 390px**: every control on the
  strip meets the kit's 44px floor.
- `repo-safe` — a stage-dominance assertion at 390px: the specimen stage occupies
  the majority of the first screenful.
- `repo-safe` — the four test surfaces that address these controls as comboboxes
  are re-pointed in the same change:
  `tests/identity-picker.spec.ts`, `tests/identity-picker-contrast.spec.ts`,
  `tests/picker-stage.ts`, and `components/LabelledSelect.unit.test.tsx`. Only the
  identity control changes shape, so the theme and width assertions stand.
- `owner-held` — the owner sees the controls in Chrome and arrows across the
  identities himself. That keypress is the demonstration he ruled for, so his
  verdict is on the behaviour, not just the layout.

---

### W4 — The footer display-settings band

**Serves:** S4, S5. **Ruling:** R2, and the kit's standing obligation to honour
`prefers-color-scheme`, `prefers-contrast`, and `prefers-reduced-motion`.

**The verified problem.** The showcase's `SiteFooter`
(`demos/oak-design-showcase/components/SiteFooter.tsx`) carries attribution and
licence links only. A visitor whose OS preference is honoured on arrival has no
way to make a *deliberate* choice that persists — S4's second half. The switching
demo's theme control changes the framed specimen, not the site.

**The precedent, verified.** The curriculum hub already ships exactly this: a
display-settings band above the footer bar carrying theme and motion controls,
placed "on the default surface, so the kit-styled selects stay theme-aware"
(`demos/oak-curriculum-hub/components/SiteFooter.tsx`). The showcase adopts the
same shape rather than inventing a second one.

**The decided mechanism.** The band is **site furniture**, not a demo control:
it appears in the shared footer on every showcase route, sets the site's own
display state (not the framed specimen's), and persists the choice.

**The state model is DDR-003's, and this is the point W4 is easiest to get
wrong.** Observable state is the user's explicit choice, never the applied value.
Per DDR-003's 2026-08-11 owner-ruled amendment, the no-choice state is the
**identity default**: a real design intent — light for most, dark for a
dark-first identity like EMC². The control names it "Identity default" and offers
it as a selection; choosing it clears the stored choice. "Match my device" is one
of the explicit choices alongside light, dark, high-contrast and colour-safe, not
the fallback. With no stored choice an OS-level `prefers-contrast: more` still
applies high-contrast automatically, and that standing access commitment is
untouched here. S4's "honours my OS preferences on arrival" comes from that
automatic path plus the identity's own polarity.

The shared footer reaches every route in the same change. The switching demo
renders no footer today; the composition route renders a local one carrying only
a back-link. Both adopt `SiteFooter` — which is what makes S5's provenance path
true from every page rather than from the front page alone.

**S5's third leg needs a link that does not exist yet.** `SiteFooter` carries
attribution, the licence sentence, and one link to the source repository — no
documentation link. W4 adds it, pointing at the kit's own README, and the
acceptance below asserts all three legs. Without that, S5 is two-thirds
delivered and the plan would not have noticed.

**Two theme controls now sit on one page, and they must not be confusable.** On
`/identity-switchboard` the footer band sets the *site's* display state while the
picker's theme control sets the *framed specimen's*. Each carries a
scope-disclosing accessible name — "Display settings for this site" against
"Theme for the demo page" — and a cell asserts both are present and distinct on
that route. **`/identity-switchboard/specimen` does not adopt the band:** it
renders inside the frame and carries its own footer region, so putting site
controls there would nest them inside the specimen and disturb the fidelity
reference the specimen exists to be.

**The control offers six values, and that is conformant** — but only provably so
after a true-up. DDR-004 rules that the selectable set is the five themes and
that "a consumer control that lists a subset of themes is non-conformant"; the
band offers all five **plus** "Identity default" from DDR-003's later amendment.
Six is a superset, not a subset, so nothing is withheld — but DDR-004 has never
been amended to acknowledge the sixth value, so W4 carries a dated pointer from
DDR-004 to DDR-003's amendment (§Coherence check).

**Three ADR-213 §3 constraints bind the wiring**, and each is the kind that
passes review and fails in the browser: the pre-paint bootstrap is a raw inline
`<script>` rendered in `<head>` from the root layout, **not** `next/script` with
`beforeInteractive`; no component branches its JSX on the theme value during
initial render, because theming is CSS-variable-only keyed off the root
attribute; and theme wiring lands **with** a per-theme accessibility gate run,
not after one.

**What the kit supplies here, and what it does not.** DDR-002: the system's CSS
is behaviourless and the single shipped behaviour is the pre-paint theme
applier — "all interaction beyond that comes from headless primitives … composed
by consumers, never shipped as styled behaviour". So the band's control is the
demo's own code sitting on the kit's applier, and the same holds for W2's and
W3's switchers. Nobody should go looking for a kit component to drop in.

**Acceptance.**

- `repo-safe` — Playwright cells asserting DDR-003's model at the site level:
  with no stored choice the control reads "Identity default" and the identity's
  own polarity governs; an explicit choice survives a reload and wins; selecting
  "Identity default" clears the stored choice; and with no stored choice an
  emulated `prefers-contrast: more` still applies high-contrast.
- `repo-safe` — axe clean on the band in every theme, with the controls meeting
  the 44px target floor.
- `repo-safe` — on `/identity-switchboard`, the site band and the picker's theme
  control expose distinct, scope-disclosing accessible names.
- `repo-safe` — the footer carries all three S5 legs: source repository, licence
  position, and documentation.
- `owner-held` — the owner sees the band in Chrome.

---

### W5 — The masthead cure

**Serves:** S1, S3. **Ruling:** R2, R3, R8.

**The verified problem, stated from first-hand evidence.** An earlier draft
carried this workstream on three PR #846 review-fleet finding numbers (F03, F05,
F14). Those numbers have **no locatable home in this repo** — the only reference
anywhere is a pointer in the showcase README to "the review-fleet F05/F03 cascade
defect", which names no finding, and nothing mentions F14 at all. An executing
agent could not resolve what F14 even asserts. The problem is real; the citation
was not. Restated from what can be verified here:

1. **A measured contrast failure, six cells wide.** Every PDS-brand specimen
   cell — four explicit themes, identity-default, and the 320px reflow cell —
   fails on the measured-contrast seam at exactly 1:1, because the brand's
   masthead renders inverted ink on a non-inverted surface. Declared in the
   showcase README's §Tests as known-red, 2026-08-13.
2. **A cascade defect underneath it**: `specimen.css` wins over the PDS
   masthead's expression layer, which is why the brand's own colours never apply.
   Provable by computed style, which is how the cure is gated below.
3. **Poor narrow stacking**, from the owner's own screenshot evidence: nav links
   wrapping loosely, search and sign-in left-stacked with dead space, an orphaned
   bookmark button.

If the fleet's findings artefact is later landed under `.agent/reports/design/`,
the numbers can be cited alongside this description — but nothing here depends on
them, and the plan does not sanction the node that would produce them.

The instrument used to file this as an ignored `incomplete`, and the cells passed
falsely; the honesty cure landed first by design, which is why the reds are
visible now. **Those six cells are the cure's scoreboard**, and the README states
the discriminator that keeps it honest: any OTHER red is new information.

**The decided mechanism.** One coherent landing, because F03 and the narrow
stacking touch the same rules and curing them separately would mean reviewing the
masthead twice. Narrow first: the 320px and 390px arrangement is designed and
verified before any wider-width work, and the wide arrangement is then written as
`min-width` enhancement — never as a `max-width` patch on a wide-first design
(R3's mechanical consequence).

**Acceptance.**

- `repo-safe` — all six declared known-red cells go green, and no seventh red
  appears; the README's known-red block is deleted in the same change, because a
  cured red documented as known is a false record.
- `repo-safe` — a specificity assertion: the PDS masthead expression wins over
  `specimen.css`, proved by computed style rather than by reading the selectors.
- `repo-safe` — `demos/oak-design-showcase/fidelity-register.json` carries a
  dispositioned entry for the PDS masthead divergence. An earlier draft sent this
  to a "completeness register", which does not exist anywhere in the repo; the
  fidelity register is the real divergence-disposition surface, and its reader is
  the fidelity review that adjudicates against it.
- `owner-held` — the owner sees the specimen masthead at 320, 390, 768, 1024,
  1280, 1440 and 1920px, natively and through the picker's width control (R8).

---

### W6 — True-ups that ride the changes

**Serves:** S5 (documentation honesty), and the estate's standing
records-are-true obligation.

Three items, each landing **with** the change that makes it true rather than
after it:

1. **Record true-ups**, settled in §Coherence check rather than left to discover,
   and split by whether they are **already owed** or **ride a cause**.

   **Already owed** — the change that made them false has landed, so they go at
   the first touch of each file rather than waiting: `demos/README.md`'s
   one-page-showcase description, the showcase README's §The page (describing the
   purged page) and its stale "until the `/identity-switchboard` routes land"
   note, and DDR-003's spent "until it lands" hedge. Deferring these under
   "land the true-up with the change that makes it true" would be a category
   error — the causing change is `a967f8979`, already in.

   **Rides its cause:** DDR-009's warrant amendment (W5); ADR-213 §3's
   first-named-binding amendment (W2, recording the fork the tight scope already
   exercised); the kit DECISIONS narrowing of the no-CSS-reordering invariant to
   the `--flow-*` levers (W2, carrying R13's quote); DDR-004's dated pointer to
   DDR-003's sixth control value (W4); and the brand-contract edits `brand.css`
   §1b and CHANGELOG take with W1. DDR-010 needs no edit, and the reason is
   recorded so nobody runs a fidelity comparison against a page that has no
   reference.
2. **Kit flow-columns narrow seam.** The gap is real but an earlier draft
   mis-located it. Verified first-hand: the per-brand collapse patches **are** in
   this worktree's tracked kit source (`studio-source/whitelabel/pds/brand-full.css`
   and `creature/brand-full.css`) and in their served copies under
   `demos/oak-design-showcase/public/brands/`. What is true is the part that
   matters: **the kit's own `components.css` never collapses a multi-column
   `--flow-columns` at the narrow seam**, so any brand without its own patch
   renders a multi-column flow topology broken at narrow. Directly against R3/R4.
   **Cure at the generator:** collapse `--flow-columns` at the kit's narrow seam,
   then delete the per-brand patches — four files, two kit-source sheets and two
   served copies, held together by the kit-asset-parity gate. Also found
   comment-only: `components.css` documents a 500px short-viewport de-stick
   breakpoint that ships no rule.
3. **Kit reduced-motion floor — the floor only; the token split already ships.**
   Verified: `colors_and_type.css` already declares `--motion-quick-full: 120ms`,
   `--motion-base-full: 200ms`, `--motion-loop-full: 1200ms` with the consumed
   tokens referencing them, and both collapse arms are live. **Nobody should
   re-mint those.** What is genuinely absent is the `!important` floor: the
   reduced-motion block sets `transition-duration: var(--motion-instant)` with no
   `!important`, so a brand `:root` motion token still wins. Three things land
   here: the floor on the *property values* (`transition-duration`,
   `animation-duration`, `animation-iteration-count`) under
   `:root:not([data-motion='full'])` plus a matching `[data-motion='reduced']`
   arm; `brand.css`'s override comment re-pointed from the kit-internal names to
   the `-full` names; and the brand-admission guard rejecting the four
   kit-internal motion names in brand sheets. It lands here because W4 puts a
   motion control in front of visitors, and the floor is what makes that control
   honest.

**Acceptance.**

- `repo-safe` — a kit test proves the discriminator: under emulated
  `prefers-reduced-motion` a branded surface collapses to instant, while the same
  surface with `data-motion='full'` keeps the brand's own duration.
- `repo-safe` — a kit test asserts a multi-column `--flow-columns` collapses
  below the narrow seam with no per-brand patch present.
- `repo-safe` — `pnpm --filter @oaknational/agent-tools validate-plan-corpus`,
  `check:docs`, markdownlint and prettier green at every landing.

---

## Sequencing

W1 first, then W2, then W3, W4 and W5 in any order — they touch different
surfaces and do not block each other. W6's items land with their causes.

**W1 before W2 is a review-economy preference, not a dependency.** Doing the ramp
cure first means every later page is reviewed once against fluid type instead of
twice. But nothing in W2 requires it, and if the owner wants the composition demo
sooner he can re-order without breaking anything here — W2's own acceptance does
not read a single W1 output.

Three named tripwires rather than dates:

- W2's narrow copy is written only after **R4** is confirmed at ratification. If
  the owner reverses R4, per-brand narrow maps return and that copy changes.
- **If R10 is declined**, W1 stops being a kit workstream. The ramp cure then
  belongs to whichever pages need it, as page-level overrides, and W1's
  brand-contract question (§W1) dissolves with it — the plan loses its
  foundations arm and keeps everything else.
- W6's true-ups land with their causes, except the four already owed, which go at
  first touch.

## Where the owner-held verdicts are recorded

Every `owner-held` proof above ends in the same place: a row in the wow-verdict
register (`docs/design/design-review/wow-verdict-register.json`), which is the
estate's existing home for the owner's verdict on a rendered page. The register
today carries exactly one row — `/` at `FAIL`, the old showcase the owner
rejected on 2026-08-05. **That row is the baseline this plan moves.** Naming the
register here rather than inventing a second record keeps one reader and one
surface: the register's reader is the design-review instrument, whose blocking
authority is earned against the owner's actual verdicts.

## Acceptance criteria for this plan as a whole

1. `owner-held` — the owner can answer "which document defines the current
   work?" with this file's path, and the four outcomes of R1 are visible as
   rendered pages in his Chrome, each carrying its own register row.
2. `repo-safe` — every workstream's acceptance proofs above are green; the
   showcase's Playwright suites (`pnpm --filter @oaknational/oak-design-showcase
   test:ui` and `test:a11y`) pass against the built artefact.
3. `repo-safe` — `pnpm --filter @oaknational/agent-tools validate-plan-corpus`
   green with this node included.
4. `owner-held` — **the wow bar**, inherited from the strategic node this plan
   serves and recorded in the wow-verdict register: the owner looks at each
   delivered page and thinks "wow, that looks *amazing*". Every other criterion
   here can be green while this one fails, which is exactly what happened to the
   page this plan replaces.
5. `owner-held` — **the two open questions**, discharged at the ratification
   glance: the audience model (§Who this is for) and R10, with the user stories
   moving with any correction. Nothing else here needs his word, and three
   drafted gates were dissolved on inspection (§Questions that turned out not to
   be his).

## What the purge did not remove

The purge landed at `a967f8979`; this section records the boundary it respected
and binds any future removal to the same one. **The purge took pages, not
instruments.** `demos/oak-design-showcase/tools/` and `tests/` stand intact and
stay that way.

The reason is not caution, it is that four records outside the showcase name
those modules by path. `tools/measurement-widths.ts` is DDR-009's declared
"enforced source of truth" and is cited by
`.agent/rules/render-the-reference-before-reproducing.md` — a repo rule file —
and by `docs/engineering/claude-design-conversion-playbook.md`.
`tools/capture-pair.ts` is DDR-010's named instrument. Deleting the directory
would orphan two ratified decision records' enforcement seams and break a rule
file's cited mechanism, all as an invisible side effect of removing some pages.
If a later change does re-home them, DDR-009 and DDR-010 take dated amendments in
the same change.

Two things worth knowing about those instruments, since W2 and W3 sit beside
them. The statistics are safe wherever the driver goes: they live in
`packages/libs/fidelity-review`, outside the showcase. And `capture-pair` takes a
same-width pair, which is natively what "one page type recomposed by identity"
produces — so if anyone points it at the composition demo, a rejecting heatmap
means the demo is **working**. That is the instrument's fidelity reading turned
inside out, and it should be said out loud before someone files it as a defect.

## Questions that turned out not to be his

Three owner decisions were drafted into this plan and then dissolved when their
origins were traced. Recorded because manufacturing a gate is its own failure —
it spends the owner's attention on a question the record already answers, and it
makes the plan look more uncertain than it is.

| Drafted as his decision | What it actually was |
| --- | --- |
| **Reading order** — which record governs, the kit's no-CSS-reordering invariant or the composition paper | Answered by his own correction (R13). The invariant was written for the `--flow-*` levers; the envelope that made this look like a live conflict was reviewer prose in an unratified plan |
| **Brand type-slot contract** — compatible MINOR or hard-break MAJOR | Neither. Decomposition preserves the ramp affordance the ratified clause protects, and `brand.css` prescribes the deprecation path for the naming change. Plain engineering under a published rule |
| **ADR-213 §3 binding fork** — should the composition demo become the region contract's first named binding | Already exercised. R1's tight scope commissions this page by name; the amendment records that, rather than asking him to authorise what he asked for |

## Out of scope

Nothing below is discarded — R1: "nothing should be thrown away unless it is at
odds with our goals". Each row is outside **this** plan's scope and names the
condition that returns it to scope.

| Out of scope here | Why | Returns to scope when |
| --- | --- | --- |
| The generated token-reference page | It documents the system to people who have already adopted it; the tight scope is impact before improvements | The four R1 outcomes have landed and the owner sequences it |
| The side-by-side white-labelling page (`/identity-white-labelling`) beyond keeping it working | Its job is now done better by the switching demo and the composition demo together | The owner rules on its future once both demos are live; until then it stays working and reachable, and changes to it are keep-working cures only |
| Internal release-readiness machinery and PR-record hygiene rounds | Internal gates, not visitor-facing outcomes; measuring delivery at them is exactly the error R1 corrected | The four R1 outcomes have landed — the machinery then gates the release of something real |
| The completion plan's W2–W7 arc (React tier, packaging, hub identity switching, the further demos) | Outside the tight scope, and sequenced behind it — see §Relationships | The tight scope has landed and the owner re-sequences that node |
| Component PRs against the design-system hub §6 backlog | Component work is improvement; the four outcomes are impact | The owner sequences them after the four outcomes |
| The GDS colour and guideline comparison for the PDS identity | The owner's explicit "later" (2026-08-03) | The owner calls it |
| New identities beyond the three | The showcase retains exactly Oak, EMC² and PDS — the shipped state: exactly three brand surfaces exist (`public/brands/pds`, `public/brands/creature`, and the Oak base) | The owner adds one |

## Relationships

- **`design-system-completion`** — **`status: sketch`, `ratified_by: null`.
  Its prose binds nothing here.** That is the plainest and most load-bearing fact
  in this section, and getting it wrong cost this plan two review rounds: its
  W0.3 charter clauses were treated as governing, and one of them — the
  composition envelope — was a reviewer artefact that contradicted the owner's
  ask. Clauses this plan needs are re-derived from real authorities
  (§Coherence check); the rest are not inherited.

  This plan owns the showcase surface and its sequencing. That node's W-arc is
  sequenced behind the tight scope. The `depends_on` edge is `beneficial`, not
  `blocking`: nothing here waits on it. It carries a dated relationship note at
  its next legal edit window.
- **`design-system-as-configured-framework`** (strategic, ratified 2026-08-05,
  this node's `serves` edge) — unchanged by this plan, and more load-bearing on
  it than a `serves` edge usually is. Three of its ratified clauses bind
  directly.

  **Its falsifier-suite rule is the test this plan must pass:** "every demo
  exists to prove a named property of this kernel, and a demo with no property to
  prove is scope without warrant." Applied to the tight scope:

  | Surface | The kernel property it proves |
  | --- | --- |
  | Switching demo | **Cost-of-change is the product** — "low-cost design changes are the core feature", and switching is how that becomes visible |
  | Composition demo | **Expressive range spans structure** — the owner's own warrant for it, ratified 2026-08-05: "how much the page layout can be altered by the choices within the design system for identical page structure, think csszengarden.com but modern" |
  | Front page | None, and it needs none — it is the showcase's entrance, not a demo. The rule governs demos; a door that proves a property would be a third demo |

  **W2 pulls the fifth demo forward.** That composition warrant is the strategic
  node's own, and the completion plan sequenced it as W7, its last workstream.
  R1's tight scope makes it one of two demo pages delivered now. That is the
  single largest resequencing this plan performs, and it is the owner's, not the
  seat's.

  **Its visual bar is this plan's acceptance bar**, inherited rather than
  restated: "Professional-designer visual quality is the acceptance bar for every
  surface that presents the system" — his words, "a way that a professional
  designer would look at and think 'wow, that looks good'", strengthened to "I
  want to look at each and every demo and think 'wow, that looks *amazing*'".
- **`identity-switchboard-first-pixels`** (ratified 2026-08-09) — the node that
  built `/identity-switchboard` and its specimen route. Its **ends-before-means
  steer** (owner recalibration 2026-08-10: the end this lane serves is
  "near-zero-cost exploratory app experiments"; every signal states
  distance-to-pixels) is carried forward here unchanged and is the reason this
  plan measures delivery at rendered pages. Two of its decided states move under
  the owner's later rulings, and W3 carries the amendments: the picker's
  controls-strip shape (R9), and the frame's fixed `16/10` responsive treatment,
  which the landed width control and R8 have already replaced. **One distinction
  a reader must not miss:** that node's `?brand=` query addressing belongs to the
  *specimen* route and stays — W2's "no `?brand=`" ruling is about the
  *composition* route, which owns its whole document and has no frame.
- **`public-digital-service-identity`** — the PDS naming replacement whose
  landing arc supplies the identity vocabulary W2 and W5 use. Its demo and kit
  execution is in flight; the estate-prose tail continues independently. No edge
  is needed: W2 and W5 consume the renamed surface as it stands.
- **`design-lane-review-debt-closure`** (ratified 2026-08-07) — owns the DDR
  corpus's cure and its edge-schema validator. W6's DDR true-ups write into the
  corpus that node established; they do not re-open its schema work.
- **`pr-846-review-fleet`** (status `ratified` — owner card "Sanction W1 now",
  2026-08-12, coordination commit `3b1e5fcce`; its owner gate discharged by
  removal; W1 EXECUTED 2026-08-13 as MCP-591, its findings ledger at
  `.agent/reports/design/pr-846-review-fleet/report.md` and today's cure
  bundles drawn from it) — a multi-lens review fleet over PR #846. The
  readiness-vs-outcomes framing note stands as history: **R1 corrected the
  FINISH LINE** from PR readiness to the owner's four outcomes, and this plan
  defines the work while that node's executed W1 reviews one PR within it; any
  W2+ of that node remains the owner's to sequence. (This row was corrected
  2026-08-13 after first shipping stale: this branch's COPY of that node
  predates its ratification commit — a worked instance of the authority test
  needing source FRESHNESS alongside identity and appropriateness.)
- **`docs/governance/one-html-many-css-compositions.md`** — the owner's own
  paper, and the method W2 implements. Cited, never restated: the region contract
  W2 exercises is that paper's conclusion already absorbed into the kit's shipped
  map tokens.

## Coherence check (2026-08-13)

Every document below was read against this plan. A row is either reconciled or
an omission with the reason stated. **Reader:** the executing agent at each
workstream's open — reading a row decides whether a true-up edit ships with that
workstream's landing.

### Documents this plan must leave true

| Document | Finding | Disposition |
| --- | --- | --- |
| `demos/README.md` §Projects | Describes the showcase as "a one-page live showcase … one page of markup with a live switchboard driving identity × theme × motion". Stale under R1: it is now a front page plus two demo pages. | **True-up with W2**, when the second demo page makes the description plainly wrong |
| `demos/oak-design-showcase/README.md` §The page | Describes the purged page: "a utility bar carrying the switchboard, a masthead, a main with hero and specimen regions … under the shipped `home` composition map". That page no longer exists. | **True-up with W2** — rewritten to the three routes |
| `demos/oak-design-showcase/README.md` §Tests known-red block | Six declared PDS specimen reds, accurate today | **Deleted by W5** in the change that cures them (a cured red documented as known is a false record) |
| `demos/oak-design-showcase/README.md` §Fidelity review | "Until the `/identity-switchboard` routes land, a FULL run fails at the live-capture arm" — those routes have landed | **True-up with W3**, the next change to touch that route |
| `docs/design/design-review/wow-verdict-register.json` | Carries one row: `/` at `FAIL` (2026-08-05), the rejected old showcase | **The baseline this plan moves** — no edit until the owner gives a verdict on a rendered page (§Where the owner-held verdicts are recorded) |
| `docs/design/design-decisions/009-measurement-happens-at-canonical-widths.md` (DDR-009, accepted 2026-08-10) | The **set** is right and W5 uses all seven widths — the original six were 320/390/768/1024/1440/1920 and **1280** joined by the dated amendment (an earlier draft of this row credited 1920, which is wrong). Its **warrant is stale in two independent ways** — see the note below | **Dated amendment with W5**, three parts, below. The set does not change, so no width needs a new failure class |
| `packages/design/oak-design-system/brand.css` §1b + stability clause **[owner-ratified doc]** | **Never read at first drafting — the most serious miss in this plan's own coherence check.** §1b makes the whole-shorthand type slot the documented deepest re-brand surface, protected by semver with a ≥1-minor-release deprecation path. W1's original "guard rejects" would have broken it silently | **Follow the contract's own path with W1**: part names documented, whole-slot names `@deprecated` through one minor release, §1b + CHANGELOG edited in the same change. No decision to escalate — the contract prescribes this |
| `packages/design/oak-design-system/DECISIONS.md` §"Ramps are the deepest level" **[owner-ratified doc]** | Also never read at first drafting. Its intent is that the ramp level lives on the brand surface: "true re-branding needs the SHAPE of the scales on the surface" | **Preserved, not reversed.** Decomposition keeps ramp control on the surface and makes it finer-grained. A dated note with W1 records the finer shape and the body/label/code asymmetry |
| `packages/design/oak-design-system/DECISIONS.md` §"The brand-rule vs invariant register" **[owner-ratified doc, contradicted by later owner word]** | Lists among system invariants "visual order = DOM/reading order (no CSS reordering — WCAG 1.3.2/2.4.3)". Written for the `--flow-*` levers; applied to the region contract it contradicts both that contract's purpose and R13 | **Dated narrowing with W2** to the `--flow-*` levers, carrying R13's quote and the composition paper's "this does not mean visual restructuring is illegitimate" as its two authorities |
| **ADR-213 §3 "Page composition"** **[owner-ratified doc; fork already exercised]** | Verbatim: "The contract currently binds no shipped surface; its first named binding is the hub shell at the hub's convergence lane (until then it is recorded as future-surfaces doctrine — **owner fork if that binding should differ**)." Stale twice over: the specimen and front page already ship the region contract, and R1 commissions this composition page by name | **Dated §3 amendment with W2.** The fork is not open — the owner exercised it when his tight scope named a composition demo as one of four outcomes. The amendment records that provenance rather than asking him again |
| `docs/design/design-decisions/004-five-themes-access-themes-are-first-class.md` (DDR-004, accepted) | "The selectable theme set is **light, dark, system, high-contrast, colour-safe**"; "every surface that offers theme choice offers all five selections"; "A consumer control that lists a subset of themes is non-conformant." DDR-003's 2026-08-11 amendment adds a **sixth** control value, "Identity default", and DDR-004 was never amended to say so. **The debt is already owed, not W4-created** — the shipped switchboard control offers the sixth value today | **Dated pointer on DDR-004 with W4**, which is the change that discharges it. Additive, not a subset, so the control is conformant — but provably so only once DDR-004 points at DDR-003's amendment |
| DDR-003 lines 79–81 | Still says "Implementation of this amendment is the design lane's next slice … until it lands, the interim applied-model behaviour from 2026-08-10 is the live state", while its own Provenance records it implemented on PR #846 (2026-08-11). A spent hedge | **Struck with W4**, the next change to touch the theme model |

#### DDR-009's stale warrant, in detail

Two independent staleness findings, both verified against the kit rather than
against the record's own prose:

1. **Its first authority source describes a wide-first kit** — the shape R4
   abolishes. Verbatim: "**The kit's own seams.** The design system has exactly
   one width seam — `max-width: 840px` switches the canvas and main grids to
   their -narrow maps." That is accurate about today's kit
   (`components.css:1339` is literally `@media (max-width: 840px)`, and the
   `-narrow` maps are the *overrides*): the base map is the **wide** one, and
   narrow is what the page degrades into — "coping with constraint" encoded in
   token names. The record is true; it is the design it describes that R4 puts in
   question, which is why the amendment records the tension rather than pretending
   the seam has moved.
2. **Two of the seven cells derive their warrant from the reproduction lane the
   tight scope removes.** DDR-009 grounds itself in export reproduction, and
   1440 is warranted as "the export demo design canvas … the primary comparison
   cell" while 1280 is warranted purely as picker-parity against the export's own
   switchboard canvas. DDR-009's own amendment rule governs the disposition:
   naming which remaining cell covers a removed cell's failure class, never a
   silent drop.

**The doctrine is already on the owner's side.** The composition paper ADR-213
defers to gives its base arrangement unconditionally and adds columns at
`@media (width >= 64rem)` — narrow-first, written before the ruling. It is the
kit and DDR-009's description of it that are the stale pair.

**The amendment, three parts.** Note what it must *not* do: an earlier draft had
part 1 restating the seam as a `min-width`, which would have replaced an accurate
record with a false one — no workstream here changes the seam, and §Coherence
check explicitly leaves the token polarity alone. So:

1. Record that the seam is a `max-width` **by current design** and that
   narrow-first is the design intent the record now serves, naming the polarity
   inversion as an open question rather than a done deed.
2. Re-warrant 768 and 1024 in narrow-first terms: 768 proves the narrow maps at
   their upper edge and 1024 the wide maps at their lower edge, which stays true
   under either polarity — what changes is which one is called the base.
3. Record R8 as a **second, reference-free warrant** for the whole set: the page
   must be arranged well at each width whether or not anything is being compared.
   1280 and 1440 keep their export-comparison warrants while
   `/identity-white-labelling` stays reachable; if it ever goes, DDR-009's own
   name-which-cell-covers-the-class rule disposes of them then.

**What survives untouched** is the discipline: derived-never-invented, free-hand
capture widths refused, and DDR-009's own clause permitting "a seam added to the
kit … [to change] the module (and its cells) WITHOUT reopening this decision" —
which is precisely W1's case, so the values can move without re-opening the DDR.
Only the prose warrant naming a `max-width` seam cannot survive as written.

**Bigger than this plan, surfaced not absorbed:** inverting the kit's own token
polarity — `--main-areas` as the wide base with `--main-areas-narrow` as the
override — would carry the ruling all the way into the vocabulary. That is a
breaking change across every brand sheet and every consumer, well outside the
tight scope. Named here for the design-system expert and the owner; W1 does not
attempt it.

### Documents reconciled with no edit needed

| Document | Why it needs no change |
| --- | --- |
| `docs/governance/one-html-many-css-compositions.md` (owner-authored) | W2 implements its method; the paper is cited, never restated. Its §16.9 theme-contract invariants (content available, landmarks intact, focus path tested after recomposition) are exactly W2's acceptance shape |
| `docs/architecture/architectural-decisions/213-design-system-integration-and-component-architecture.md` (ADR-213, accepted) §1 and §4 | §1's integration contract binds W1, which complies rather than conflicts: repo-side kit edits are "legitimate first-class work", the CSS stays the token source with `dtcg/` regenerated from it, and the studio copy is synced rather than forked (W1 mechanism point 7). §4's built-CSS consumption rule is already how the showcase consumes the kit |
| `docs/design/design-decisions/003-theme-state-is-the-choice-never-the-applied-value.md` (DDR-003, accepted; amended 2026-08-11) | Binding on W4, and W4 was **corrected to match it**: observable state is the user's choice, the no-choice state is the identity default and is itself selectable, and the automatic `prefers-contrast: more` path stands. The DDR needs no edit; the plan needed one |
| `docs/design/design-decisions/010-comparison-is-visual-first.md` (DDR-010, accepted) | Governs judging a rebuild against a reference. The front page and the composition page are new designs with no reference, so the method has nothing to compare — recorded here so nobody runs a fidelity pair against a page that has no counterpart. The specimen keeps its reference and keeps the method |
| `packages/design/oak-design-system/KNOWN-ISSUES.md` #7, #8 | Live constraints W2 must satisfy (`data-page` scoping, direct-child region assignment, no inline-size containment on a region), now named in W2's mechanism. Transparency entries, not obligations to edit |
| `packages/design/oak-design-system/KNOWN-ISSUES.md` #14 (the subtree-alias issue) **[engineering practice]** | A real kit limitation: `:root`-declared aliases freeze under subtree high-contrast or colour-safe theming. **It does not bite any workstream here** — every theme application in this plan is at a document root (the site itself, or the framed specimen's own document), never a subtree. It is also why W2 ships a switcher rather than a triptych. The completion plan carries an owner gate about it, but that plan is unratified, so the constraint that applies here is the kit record, not the gate |
| `packages/design/oak-design-system/DECISIONS.md` §Density | "Floors stay out of reach: targets and type slots are not density-derived" — W1's separate `--density-viewport` multiplier keeps that true rather than routing type through the density knob |
| `demos/README.md` §Dependency boundary, §Licences | Unaffected: no workstream changes the demo tier's dependency arrow or licence position |
| `packages/design/oak-design-system/CLAUDE.md` | Its "usable at 400% zoom / 320px width without loss" clause is the ground for R10, not a conflict — W1 brings the kit into line with an obligation it already carries |
| `.agent/plans/delivery/design-lane-review-debt-closure.plan.md` | W6 writes into the DDR corpus that node established; it does not re-open its schema work |

### The Demos Charter (completion plan §W0.3) — re-derived, not inherited

The charter lives in a plan that is `status: sketch` with `ratified_by: null`.
**Its prose binds nothing here.** An earlier draft treated three of its clauses as
governing and built acceptance around them; one of those — the composition
envelope — turned out to be a reviewer artefact that contradicted the owner's ask
outright. So each clause is re-derived from a real authority or dropped:

| Clause | Re-derivation |
| --- | --- |
| **Control-pattern** — group semantics with an accessible name, single-select exposure, a named keyboard model, a rendered name/role/value assertion, a non-colour selected indicator | **Kept, re-sourced to external standards**: WCAG 2.2 SC 4.1.2 (name, role, value), SC 1.4.11 and 1.4.1 (the non-colour indicator), SC 2.5.8 with the kit's stricter 44px floor, and the ARIA APG radio pattern R12 selects. No charter needed — these are the standards the kit's own accessibility contract already binds |
| **Composition envelope** — DOM-order admissibility, declared reading sequences, `reading-flow`-inert cell | **DROPPED.** Reviewer-derived, never owner word, and R13 deletes it: "the made up thing contradicts the ask because it is made up" |
| **Shipped-page axis** — axe across identity × theme, both result arrays | **Kept, re-sourced to the landed instrument**: `expectNoAxeViolations` already runs it and is *stricter* than the charter's description (no rule-and-target allowlist outside contrast). The route joins what ships; the charter's weaker shape is not imported |
| **Three-identities reading** — simultaneous multi-identity surfaces fire item-14 | **Reduced to its real basis**: KNOWN-ISSUES #14 is a genuine kit limitation on subtree theming. That is an engineering constraint on a triptych, not a gate, and W2 ships a switcher for R12's reasons anyway |

### Deliberate omissions

| Omitted | Why on purpose |
| --- | --- |
| The completion plan's W2–W7 mechanism | Outside the tight scope and sequenced behind it; restating it here would create a second definition of work this plan does not own |
| Landing the Demos Charter ADR itself | It is W0.3's deliverable, not this plan's. Honouring its live clauses costs nothing; adopting its authorship would take work this plan's ruling did not ask for |
| The strategic node's goal architecture | This node delivers its demo properties; a delivery node restating a strategic node's kernel is drift, not coherence |
| Any amendment to `pr-846-review-fleet` | That node is ratified with its W1 executed (MCP-591); sequencing any W2+ of it is the owner's, surfaced in §Relationships rather than taken here |
| A ruling on KNOWN-ISSUES #14's open alias-breadth question | No workstream here renders a themed subtree, so the question never arises for this plan's surfaces |
| ADR-213's studio-source-vs-product-gate tension | The `studio-source/whitelabel/*` brand sheets are consumed through their served copies, which ADR-213 §1 would ordinarily move out from under the gate exemption. Pre-existing, unchanged by W1, and a structural question for the design-system expert rather than a showcase-experience decision |
| The eleven type classes that compose from primitives directly | `.oak-heading-light-1…7`, `.oak-body-1-bold…3-bold`, `.oak-code-2-bold` keep fixed sizes after W1. Folding them in means minting a `-light` weight variant of every heading slot, doubling the decomposition's surface. Named in W1 so the owner can price it rather than discover it |
| Constraining brands' direct `--gap-*` / `--inset-*` overrides | A ratified DECISIONS affordance ("direct overrides still win … so existing brands didn't change behaviour"). Changing it needs a dated amendment on that clause, which is a kit-architecture decision rather than a showcase-experience one |

## First-principles check (plan-body rule, clauses 4–6)

- **Optionality (clause 4).** Every §Out-of-scope row names the condition that
  returns it to scope, and §Sequencing replaces dates with two named tripwires,
  so no item rests in an unnamed holding state. Outcome optionality is closed by
  naming a single observable signal per acceptance criterion — rendered pages in
  the owner's Chrome for the owner-held ones, a named instrument for the
  repo-safe ones. The two genuinely open questions (the audience model, R10) are
  surfaced as owner confirmations at ratification rather than resolved by seat
  assertion.
- **Record-consumer (clause 5).** This plan adds one accounting surface: the
  §Coherence check table. Its reader is the executing agent at each workstream's
  open, and reading it changes whether a true-up edit ships with that workstream's
  landing. Everything else writes into an existing surface with an existing
  reader — the owner's verdicts to the wow-verdict register, W5's masthead
  divergence to the fidelity register. Two records an earlier draft would have
  minted are gone: a "completeness register" that does not exist anywhere, and
  W2's page-set artefact of declared reading sequences, which died with the
  envelope. The second is the more instructive — it was a ledger invented to
  serve a constraint that was itself invented.
- **Rules tier (clause 6).** Screened against the always-applied rules. The two
  that bite hardest: `replace-dont-bridge` — W2 rebuilds the composition page
  rather than adapting the stub, and W1 replaces the fixed ramp rather than
  layering page-level overrides on it; `no-stopgaps-every-landed-state-correct` —
  W6's items land with their causes, so no landed state documents behaviour the
  code does not have. `design-values-come-from-the-system` binds W1's floors and
  ceilings: every value is a kit token or derived from one, never invented.
- **Verified literals (clauses 1–3 applied to this body).** Read first-hand in
  this worktree on 2026-08-13: the fixed type ramp and leading tokens
  (`colors_and_type.css`); the three `clamp()` sites across the kit's CSS; the
  `--density` derivation of `--gap-*` and its brand-surface declaration; the
  `[data-page]` map tokens and the 840px narrow seam (`components.css`); the PDS
  and EMC² `[data-page='unit']` overrides and the absence of any brand
  `--main-areas-narrow` for `unit` (`studio-source/whitelabel/*/brand-full.css`);
  both counter-identities' whole-slot `--type-heading-*` / `--type-body-*`
  shorthand overrides with literal sizes (same files) — the finding that
  reshaped W1; `useIdentity`'s no-argument own-document default
  (`components/brand-identity-binding.ts`); the hub's display-settings band
  (`demos/oak-curriculum-hub/components/SiteFooter.tsx`); the showcase's script
  names (`demos/oak-design-showcase/package.json`); the six declared known-red
  PDS specimen cells and the stale route note in the showcase README; the single
  `/` `FAIL` row in the wow-verdict register; and the plan-corpus validator's
  green baseline at 73 conformant files. The coherence check was read first-hand
  in the same sitting: ADR-213, DDR-002, DDR-003, DDR-004, DDR-009, DDR-010, the
  kit's DECISIONS and KNOWN-ISSUES, both demo READMEs, and the completion plan's
  W0.3; `brand.css` and DECISIONS §Ramps were added at expert review, having been
  missed. **Three recorded failures in this plan's own authoring**, kept because
  they name reusable shapes. First: a pass concluded from a keyword grep that
  ADR-213 "says nothing about the showcase" — it says nothing containing those
  keywords, while §3's page-composition clause is squarely on point. Keyword
  absence is not subject absence. Second: the coherence check read the kit's
  DECISIONS, KNOWN-ISSUES, CLAUDE.md and both READMEs but never `brand.css`,
  where the kit's *contract with its consumers* lives — so W1 was drafted to break
  a semver-protected clause unnoticed. Reading a package's decisions is not
  reading its contract. Third, and the one the owner caught: **a constraint was
  enforced for two review rounds without anyone asking where it came from.** The
  composition envelope read as doctrine because it was written down in
  plan-shaped prose, in a plan that was never ratified. Six expert legs, a seat
  pass, and a Director pass all refined it; none traced it. Written-down is not
  ratified, and the check that catches this is asking *whose word is this?* before
  asking *is it satisfied?*

## Decision log

| Decision | Provenance |
| --- | --- |
| The tight scope is the delivery frame | Owner, 2026-08-13 (R1) |
| Narrow-first governs every page and the kit itself | Owner, 2026-08-13 (R3, R4) |
| Composition demo = one page type recomposed by identity | Owner, 2026-08-13 ~16:4x (R7) |
| Page type for W2 = `unit` | Seat verdict, 2026-08-13 — the only shipped type where all three identities diverge (verified in the brand sheets) |
| Narrow maps are NOT per-brand delivery | Owner, 2026-08-13 ~17:1x (R4) — supersedes the 2026-08-13 pre-execution finding that they were |
| One control pattern across the picker and the composition switcher | Seat verdict — two switchers doing the same job should not teach a visitor two interaction models. The pattern itself is now the owner's native radio group (R12) |
| No `?brand=` on the composition route; `useIdentity()` with no argument | Pre-execution reviews (code-expert + design-system-expert, agreeing), 2026-08-13 |
| Switcher in the hero, not facets | Accessibility-expert verdict, 2026-08-13 — facets land bottom-right under EMC² |
| W1 before the pages | Seat verdict — a kit-level gap cured per page re-appears in every other consumer (R10) |
| Fluid slots carry a `rem` term | Seat verdict — WCAG 2.2 SC 1.4.4; a `vw`-only clamp is immune to zoom |
| W1 decomposes `--type-heading-*` rather than clamping `--font-size-*` | Seat verdict, 2026-08-13 — verified in the brand sheets that both counter-identities re-point the whole slot with literal sizes, so clamping the primitives would cure the Oak base alone |
| The decomposition ships as a compatible MINOR under `brand.css`'s own deprecation path | The contract's stability clause governs (`brand.css` §1b — [owner-ratified doc]); the earlier MINOR-or-MAJOR owner escalation was withdrawn as manufactured ceremony (§Questions that turned out not to be his, row 2) |
| The brand-admission guard enforces `rem`-ness; the whole-slot arm warns | Seat verdict — the rem clause is already in the contract, so the guard enforces rather than revokes. The false "motion guard" precedent is withdrawn: no brand-admission validator exists to copy |
| EMC²'s px body slots are corrected inside W1 | Reversed at review, 2026-08-13 — an earlier draft routed this out as a separate finding. The kit contract already rules it ("Slots stay in rem"), and W1's guard is the instrument, so it belongs here |
| Rhythm fluidity is Oak-base-only in this scope | Seat verdict — both counter-identities override the derived spacing tokens with literals, and constraining that would contradict a ratified affordance. Stated with a cell that measures it rather than left to surprise |
| W1's proof cells run in the showcase's Playwright suite | Seat verdict — the kit workspace runs happy-dom with no Playwright dependency and cannot evaluate viewport-dependent CSS. The cure lives in the kit; the proof runs where a browser is |
| `--density-viewport` as a separate kit-owned multiplier | Seat verdict — `--density` is brand surface; a brand's fixed value would defeat fluidity written into it |
| Footer display-settings band follows the hub's shape | Seat verdict — an existing verified precedent in the estate beats a second invention |
| Audience model and R10 are owner confirmations, not seat facts | Seat verdict per never-invent-identities and the owner-facts doctrine |
| W4's theme model is DDR-003's, not the OS preference | Coherence check, 2026-08-13 — the plan's first draft defaulted the control to the OS; DDR-003's 2026-08-11 owner-ruled amendment makes the identity default the no-choice state, and the plan was corrected to it |
| DDR-009 takes a four-part warrant amendment | Coherence check, 2026-08-13 — its first authority source describes a wide-first kit (the shape R4 abolishes) and two of its seven cells are warranted by the reproduction lane the tight scope removes. The set of widths is unchanged |
| ADR-213 §3 takes a first-named-binding amendment with W2 | Coherence check, 2026-08-13 — the clause says the region contract "binds no shipped surface" and names the hub shell as its first binding; W2 makes the composition demo that binding, and the clause pre-authorises the fork |
| DDR-004 takes a dated pointer; DDR-003's spent hedge is struck | Coherence check, 2026-08-13 — W4's control offers six values against a DDR naming five (a superset, so conformant, but not provably so until DDR-004 points at DDR-003's amendment) |
| DDR-010 takes no edit | Coherence check, 2026-08-13 — it governs comparison against a reference, and the new pages have none |
| The purge removes pages, never `tools/` or `tests/` | Coherence check, 2026-08-13 — grounds at §"What the purge did not remove" |
| Inverting the kit's wide-base token polarity is surfaced, not attempted | Seat verdict — carrying R4 into `--main-areas` / `--main-areas-narrow` naming is a breaking change across every brand sheet and consumer, well outside the tight scope |
| The ADR-147 first-component-export gate does not fire | Verified 2026-08-13 — every showcase import from `oak-design-react` is a constant or a type, never a component; the gate becomes a precondition the moment one is imported |
| W2 ships a switcher, not a three-identity triptych | R12's arrow-key demonstration needs a switcher; and a triptych would theme three subtrees of one document, hitting the kit's KNOWN-ISSUES #14 alias-freeze. An engineering limitation with a named record, not a gate |
| The composition envelope is DELETED as a binding axis | **Owner correction (R13)**, 2026-08-13 — traced to reviewer prose in an unratified plan, never owner word: "the made up thing contradicts the ask because it is made up" |
| Visual reordering is the demonstration, spotlighted in the demo's own copy | Owner word (R13) — "maximally enable visual change, including visual order, via css" |
| The kit's no-CSS-reordering invariant narrows to the `--flow-*` levers | Owner's composition paper + R13, both quoted in the amendment. Executing standing owner word, not a seat adjudication |
| `owner_gates` returns to empty; three drafted gates dissolved | Traced 2026-08-13 — each question was already answered by the record (§Questions that turned out not to be his) |
| Every binding constraint carries an authority class | Seat verdict after the R13 correction — the failure was that unratified prose was indistinguishable from owner word at the point of reading |
| Identity is a NATIVE radio group; arrows switch identity instantly | **Owner ruling**, 2026-08-13 ~17:00, relayed via the Director: "being able to change the identity instantly with the arrow buttons is a very cool demonstration of the power of what we have achieved here." Supersedes this plan's earlier buttons-plus-`aria-current` shape |
| The pre-execution a11y rejection of a radio group is outweighed, not dropped | Owner ruling above; Director-endorsed treatment. The selection-follows-focus objection is recorded with its mitigations (status announcement, help text, instant rather than animated re-skin) |
| Theme and width stay selects | Seat verdict — R9 names identity as the radio axis ("only ever three"); six theme values and seven widths as radio rows would defeat the narrow tightening R9 asked for |
| The APG-impossibility grounds are withdrawn twice over | Corrected at review, 2026-08-13 — APG's own default radio variant is selection-follows-focus, so the pattern was never impossible; and the decision is the owner's, not an ARIA reading |
| W5 is restated without the F03/F05/F14 numbers | Corrected at review — the numbers have no home in the repo; the problem is stated from the six declared known-red cells and the measured 1:1 seam |
| The width control's 1280px opening stays | Seat verdict — DDR-009-warranted and shipped; R8 forbids the control re-deriving itself from the viewport, not the opening width. Flagged for owner correction if that reading is wrong |
| The Demos Charter's clauses are re-derived from real authorities, not inherited | Seat verdict after R13 — the charter sits in an unratified plan, and one of its clauses proved to be a reviewer artefact contradicting the owner's ask |
| Each demo names the kernel property it proves; the front page names none | The strategic node's ratified falsifier-suite rule — "a demo with no property to prove is scope without warrant". The rule governs demos; the front page is the entrance |
| The wow bar is an acceptance criterion of this plan | Inherited from the strategic node this plan serves (ratified 2026-08-05): professional-designer visual quality is the bar for every surface presenting the system |
| W1 re-derived under the fluidity pillar | **Owner word (R14)**, 2026-08-13 evening; mechanism re-derived absorbing both pre-execution reviews of the same day (code-expert REVISE, nine defects; design-system-expert REVISE, twelve findings, probe-grounded) |
| Two unitless bounds per slot; the kit derives the whole curve; saturation at 960px | Design-system review (a kit-fixed middle term is correct for at most one brand per slot; CSS length division not safely shippable) composed with code review D1 (1920px saturation made the reach-maximum and resize cells jointly unsatisfiable) — both cells now pass as written, and the 1280/1440 comparison widths render unchanged |
| No weight or family parts | Design-system review: all three identities set `--weight-display`/`--font-display` once and never vary them by slot; per-slot duplicates strand the documented brand surface |
| Fluid scope = heading-1..3; heading-4..7 to the fixed-point register | Code review (ramp-step floors compress four heading levels into an 8px band and breach the kit's readability-floor condition) + design-system review (no measured narrow defect below heading-3; nine leaves, not twenty-one) |
| Floors answer to a rendered fit cell, never ramp arithmetic | Design-system review, probe-grounded: the ramp-step rule was undefined for nine of fourteen counter-brand maxima, and its derived EMC² floor still overflowed at 320px — an arithmetic-against-itself acceptance |
| Nothing deprecated; whole-slot literal = documented opt-out; guard all-fatal | Design-system review (nothing renamed or removed; `@deprecated` would advertise a MAJOR removal for a MINOR addition) + code review D7 (the warn-arm collision with no-warning-toleration, dissolved by having no warn arm) |
| Leading: four exact ratio primitives minted; rendered values byte-identical | Code review D6 + design-system review: five of seven slots would have changed leading at every width under the two-named-ratios wording; the designed-ladder alternative is deferred as an owner-visible decision |
| The single-token-per-slot alternative priced and rejected | Design-system review finding 12: materially smaller, but returns curve-authoring to brands as hand-written `clamp()` — against R14's intent-shaped vocabulary and the kit's derivation-over-specification direction |
| The rhythm-affordance confirmable dissolved from first principles; direction = fluid-capable rhythm intent | **Owner word (R15)**, 2026-08-13: the affordance exists so identities can be maximally different (the demonstration instrument's need); responsive is assumed at all times for every identity — so difference is expressed through fluid-capable parameters, never frozen values. Neither keep nor remove: reshape, sequenced as the rhythm tranche |

## Execution seat and review

Authored by the design lane's executing seat, 2026-08-13, at the Director's
routing. Review order before ratification: the expert suite (assumptions,
design-system, accessibility, docs/ADR, prose, code) over this body; findings
absorbed and any FIX-FIRST re-reviewed clean; then the Director's verdict; then
the owner's ratification glance, which is what moves `status` from `sketch` to
`ratified`. Execution resumes under this node once ratified.
