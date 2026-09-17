---
boundary: B2-Architecture
doc_role: instrument
authority: design-review
status: active
last_reviewed: 2026-08-08
---

# The design-review rubric — v0

Minted by the completion plan's W0.7 (the design-review instrument), revision
**v0**, 2026-08-08. This rubric is a LIVING instrument: every revision
triggers recalibration, and each graded calibration record under
[`records/`](./records/) names the revision it calibrated. The wow-verdict
register beside this file ([`wow-verdict-register.json`](./wow-verdict-register.json),
schema-validated by `agent-tools/src/validators/wow-verdict-register/`)
records every verdict the instrument and the owner produce, so the
instrument's miss-rate against the owner's actual verdicts is measurable —
its blocking authority is earned, never assumed.

## The instrument

Three legs judge every checkpoint render BEFORE it reaches the owner:

1. the authoring seat's own pass (recorded before reading the other legs);
2. a paired accessibility-expert leg; and
3. an INDEPENDENT fresh-context design-system-expert leg (per
   `invoke-design-system-expert`; never the authoring seat).

BOTH expert legs dispatch on opus (the standing reviewer-dispatch word,
affirmed in the 2026-08-08 Director ruling at this rubric's minting);
fallback goes UP in capability at lower effort, never down.

Each leg judges against the criteria below AND free-form, returning
PASS / FAIL / ITERATE per page WITH a verdict for every one of the seven
criteria (a note is required on any non-PASS criterion — per-criterion
evidence is what calibrates the instrument; the register schema refuses
a partial evaluation). Legs are dispatched blind: no leg sees another
leg's verdict, an intended label, or the owner's prior words about the
page. Every leg's verdicts land in the wow-verdict register's
instrument-leg results (required at checkpoint-class rows; a render a
leg blocks is recorded as an `instrument-blocked` row carrying the
Director disposition, never an invented owner verdict).

**Fail semantics**: any leg's FAIL blocks the render from reaching the
owner. A blocking FAIL routes to the Director in the Quality-bar rule-3
shape (findings, screenshot, blocker assessment) for a named disposition —
the instrument's false-positive rate is unmeasured at v0, and wow-first
sequencing must not wait silently on an unearned block.

## Criteria

Judged per page, per identity × theme cell. Every criterion derives from
the export's own demonstrated design language (sources at the end).

### 1. Type scale usage

Text renders through the system's composite type styles — the
`oak-heading-*` / `oak-body-*` class families and their dtcg type-style
sources — with one style per textual role and hierarchy expressed through
the scale, never through ad-hoc sizing.
**Fail**: raw font sizing outside the scale; the same textual role carrying
different styles within a page; hierarchy conveyed by manual size tweaks.

### 2. Spatial rhythm

Spacing comes from the token scale and holds a consistent vertical rhythm:
sibling sections separate by consistent steps, component-internal padding
follows the kit's classes, and density changes are deliberate, not drift.
**Fail**: raw pixel spacing outside the scale; visibly inconsistent rhythm
between sibling sections without a recorded reason.

### 3. Hierarchy

Each view has one primary focus; heading structure descends without skips;
visual prominence tracks semantic importance; reading order matches visual
order.
**Fail**: competing primary emphases; skipped or misordered heading levels;
prominence inverted against meaning.

### 4. Colour discipline

Colour arrives only through semantic roles (custom properties and
kit-class-carried colour) — zero raw literals (the authored-CSS walker is
the mechanical arm; this criterion judges the rendered effect, including
markup-injected style). Roles are used for their meaning, and contrast
floors hold in the exact cell judged.
**Fail**: any raw colour value; a role used against its meaning (text roles
as decorative fills and the like); contrast below the floor in the judged
cell.

### 5. Composition grammar

Pages compose the export's region model: named regions in a deliberate
order (the front-page instance: masthead → hero with trust band → featured
→ content → context → cta → footer), built from the kit's layout classes
(`oak-canvas` / `oak-region` / `oak-container` and the composition
classes). Components sit inside regions; nothing free-floats.
**Fail**: structure outside the grammar without a recorded reason; regions
improvised where a kit pattern exists.

### 6. Cross-page cohesion

The checkpoint's page set reads as ONE system: shared masthead/footer
grammar, consistent control faces for the same control roles, consistent
rhythm and type usage across pages of the same identity. This criterion is
judged across pages, not per page in isolation.
**Fail**: same-role elements diverging across pages; a page whose grammar
would surprise a reader arriving from its siblings.

### 7. Ordered-calm readability

The owner's rule, verbatim (W0.5 item 2, 2026-08-05): "Oak design is to
maximise readability for everyone, including those with non-typical
neurological makeup, so it would never use messy arrangements like this."
No overlapping or collaged arrangements on Oak. Rotation appears only as
systematic, tokenised angles where the identity carries them — never
per-element noise. Motion follows the identity's motion stance.
**Fail**: any overlap/collage arrangement on an Oak-identity page;
unsystematic rotation anywhere; motion on an identity whose stance is
none.

## Per-identity language sections

- **Oak (v0)**: the anchor is the export's demonstrated language plus the
  ordered-calm rule — zero tilt (the official kit's jaunty-label precedent
  is reference texture, not an Oak licence), no motion (the owner's stance:
  Oak is "too focussed on absolute accessibility" for motion), calm ordered
  composition per criterion 7.
- **EMC² and PDS**: their language sections are minted at the W0.10
  taste-anchor sittings and DO NOT EXIST at v0. Until then, pages in those
  identities are judged under criteria 1–6 and criterion 7's systematic
  bounds (systematic rotation, honest motion stance) — never against an
  identity language this rubric does not yet carry.

## Scope bounds at v0

- Reduced-motion HONOURING (preference adaptation behaving correctly) is
  the charter/a11y-suite's territory; criterion 7 judges motion PRESENCE
  against the identity's stance. The known creature reduced-motion defect
  (ledger item 6) is that class, not this rubric's.
- Mechanisation of any criterion is a later, separately sliced story; v0
  is a manual instrument.

## Derivation sources (attributed)

- The export's composed pages (`packages/design/oak-design-system/`
  `studio-source/`: `ui_kits/oak/` and the two `whitelabel/` identity
  directories — EMC²'s `creature/`, and the PDS identity's directory,
  which bears its pre-rename name) — the region model and composition
  grammar.
- The system's own token estate — the dtcg sources (`dtcg/`) and the
  class vocabulary of `colors_and_type.css` / `components.css`.
- The owner's sitting words of 2026-08-05
  (`.agent/reports/design/design-sitting-records-2026-08-05.md`):
  item 2 (ordered-calm), item 4 (systematic rotation), item 6 (motion
  stances), the taste-anchor definition at the plan's W0.10.
- The official Oak Design Kit's five-step per-component accessibility
  documentation protocol (kit file `YcWQMMhHPVVmc47cHHEEAl`, A11y
  Documentation node `12381-529` — a token-stripped pointer per the
  estate convention; resolve via the Figma tooling at time of use). The
  kit documents five steps PER COMPONENT (usage description; all states
  incl. device variants; focus order and keyboard behaviour; known
  issues; content guidance); our restatement adapts the protocol IDEA to
  a per-PAGE three-leg review with per-criterion recording — the unit of
  application differs, the discipline transfers. Restated in our own
  words with attribution per the fidelity gradient (band 4: principles
  and protocols transfer freely; the folly binds values, not
  disciplines).
