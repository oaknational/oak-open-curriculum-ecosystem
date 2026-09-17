---
boundary: B2-Architecture
doc_role: record
authority: design-review
status: active
last_reviewed: 2026-08-08
---

# Graded calibration of rubric v0 — 2026-08-08

The W0.7 calibration run (PR-B): the three-leg instrument judged an
eight-page corpus with known intended labels, and this record measures each
leg — and the rubric itself — against those labels. **Rubric revision
calibrated: v0** (the revision named by
[`../rubric.md`](../rubric.md) at its minting). Run by the design seat
(Civet spins Cavern, 054f5e) under the 2026-08-08 Director ruling on the
calibration frame: both expert legs dispatched on opus; legs blind to
intended labels.

## The corpus

Derived per the minting record's fixture-corpus derivation note
([`2026-08-08-register-minting.md`](./2026-08-08-register-minting.md)):
the export's own closed three-front-page set, the owner-rejected showcase
root, three seat-authored degraded variants of the Oak front page, and a
held-out pair on the PDS identity's front page (unmutated + one novel
mutation). Each degraded fixture was AUTHORED to violate only its targeted
criteria; the measured runs show that scoping is an authoring intent, not
an outcome guarantee — targeted mutations ripple (fixture-a's injected
promo drew hierarchy and cohesion FAILs from both blind legs beyond its
1/4 targets), and that coupling is itself calibration data (see Findings
§6). Fixture files in
[`calibration-v0-fixtures/`](./calibration-v0-fixtures/)
carry neutral names (`fixture-a` … `fixture-d`) so no filename could leak a
label into the blind staging; this record is the label key.

| staged id | source                                                                        | intended label | targeted criteria                                                                                                                                                                                                                  |
| --------- | ----------------------------------------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| page-1    | EMC² front page (`studio-source/whitelabel/creature/index.html`), unmutated   | MUST-PASS      | —                                                                                                                                                                                                                                  |
| page-2    | `fixture-c.html` (Oak front page, structural degradation)                     | MUST-FAIL      | 3, 5 (secondary: 2)                                                                                                                                                                                                                |
| page-3    | PDS front page (unmutated; held-out)                                          | MUST-PASS      | —                                                                                                                                                                                                                                  |
| page-4    | Oak front page (`studio-source/ui_kits/oak/index.html`), unmutated            | MUST-PASS      | —                                                                                                                                                                                                                                  |
| page-5    | `fixture-d.html` (PDS front page, novel messy-arrangement mutation; held-out) | MUST-FAIL      | 7 (secondary: 2, 3)                                                                                                                                                                                                                |
| page-6    | showcase root (`demos/oak-design-showcase/app/page.tsx` + components)         | MUST-FAIL      | (owner rejection 2026-08-05 — register Verdict 1)                                                                                                                                                                                  |
| page-7    | `fixture-a.html` (Oak front page, type/colour degradation)                    | MUST-FAIL      | 1, 4 (measured collateral: 3 and 6 FAIL at both blind legs; 2 FAIL at the accessibility leg / ITERATE at the design-system leg; 5 ITERATE at both; 7 FAIL at the accessibility leg only, under its canonical-collage judging line) |
| page-8    | `fixture-b.html` (Oak front page, collage/rotation degradation)               | MUST-FAIL      | 7 (secondary: 2, 3, 5)                                                                                                                                                                                                             |

Fixture construction notes:

- `fixture-a`: raw hex (`#1f9e4b`, `#e05c00`), off-scale sizes (27px / 19px
  / 23px), same-role headings styled divergently, a text role
  (`--text-primary`) as a decorative fill. Region grammar left intact.
- `fixture-b`: the featured region's grid replaced by an absolutely
  positioned collage of overlapping cards at arbitrary per-element angles
  (-7°, 4.5°, -2.8°, 9°, -5.2°). Tokens and type classes left clean.
- `fixture-c`: TrustBand and Newsletter free-floated outside any region, a
  hand-rolled raw-px grid where kit layout classes exist, an h1 → h4 skip,
  and a duplicated Hero as a competing primary focus. Colour and type left
  clean.
- `fixture-d` (the NOVEL held-out mutation): the PDS page's subject tags
  scattered absolutely at mixed arbitrary angles, overlapping the list
  beneath. Everything else derives from the source page, with the
  COMMITTED fixture's sanitisation recorded as a FUNCTIONAL divergence
  set, not merely textual (review round 1 corrected an earlier
  "brand-name text only" claim): the identity-naming ratchet's census
  contract rightly refuses any NEW tracked file carrying the pre-rename
  token, so the committed copy renames brand strings AND the icon class
  prefix — which detaches those spans from the source `icons.css`
  binding (the decorative, `aria-hidden` glyphs are inert in the
  committed form) — and its two template links carry a `brand` query
  value with no matching white-label directory. The staged corpus copy
  the legs judged carried the source page's original strings and
  bindings; a rerun stages per the restaging recipe below, which states
  these bounds where they apply.

Gate note: the fixtures' constitutive duplication (each fixture IS its
source page with a scoped mutation) fails SonarCloud's new-duplication
condition by construction — measured 25.4% > 3% on this PR with ZERO
issues of any kind. Duplication detection is excluded for the fixtures
directory alone via `sonar.cpd.exclusions` (full analysis still
applies), owner-authorised 2026-08-09 on this PR under the config
surface's standing test: non-production material, organised and kept
explicitly as calibration source in its own fenced directory.

## Method

- **Staging**: each page copied to a neutral `page-N/` directory in
  session scratch space with the sibling assets it references (oak
  composition sources, identity brand CSS, showcase components), order
  randomised, no labels. System stylesheets resolved at their canonical
  repo paths.
- **Legs**: (1) the seat's own pass; (2) accessibility-expert, opus;
  (3) design-system-expert, opus, fresh context. Expert legs received the
  rubric path, the corpus paths, the per-identity judging bounds, and the
  exhaustive per-criterion output contract — nothing else. Both legs
  instructed not to assume any corpus composition.
- **Blindness bound, stated**: the SEAT leg authored the corpus and is
  structurally non-blind for this calibration; its verdicts were recorded
  and sealed BEFORE either expert leg was dispatched, judged against the
  rubric text rather than the labels, and are scored with that bound
  named. The two expert legs carry the blind test.
- **Fail semantics**: any criterion FAIL fails the page (the rubric's
  blocking rule).

## Results

### Seat leg (non-blind; sealed before expert dispatch)

| page   | intended  | seat overall       | criteria non-PASS                                  |
| ------ | --------- | ------------------ | -------------------------------------------------- |
| page-1 | MUST-PASS | PASS               | —                                                  |
| page-2 | MUST-FAIL | FAIL               | 2 FAIL, 3 FAIL, 5 FAIL, 6 ITERATE                  |
| page-3 | MUST-PASS | PASS               | —                                                  |
| page-4 | MUST-PASS | PASS               | — (motion-scope bound stated below)                |
| page-5 | MUST-FAIL | FAIL               | 2 FAIL, 3 FAIL, 7 FAIL, 5/6 ITERATE                |
| page-6 | MUST-FAIL | **ITERATE (miss)** | 3, 5, 6 ITERATE — no hard FAIL under v0 as written |
| page-7 | MUST-FAIL | FAIL               | 1 FAIL, 4 FAIL                                     |
| page-8 | MUST-FAIL | FAIL               | 2 FAIL, 3 FAIL, 5 FAIL, 7 FAIL, 6 ITERATE          |

### Accessibility-expert leg (blind, opus)

The leg stated its judging lines up front (motion: kit-token-carried quiet
motion is the kit's own contract, the clause judged page-authored motion;
raw pixels: FAIL where they govern layout, ITERATE where fixed-art;
overall: any FAIL blocks, any ITERATE without FAIL → ITERATE) so its
verdicts are reproducible.

| page   | intended  | leg overall      | criteria non-PASS                                                                                                                                                                         |
| ------ | --------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| page-1 | MUST-PASS | **FAIL (block)** | 7 FAIL (two per-element angles with no angle token anywhere in the brand contract); 1, 2, 5 ITERATE                                                                                       |
| page-2 | MUST-FAIL | FAIL             | 2, 3, 5, 6, 7 FAIL; 1, 4 ITERATE                                                                                                                                                          |
| page-3 | MUST-PASS | ITERATE          | 1, 2 ITERATE (raw weight/tracking; off-scale literals)                                                                                                                                    |
| page-4 | MUST-PASS | **FAIL (block)** | 2, 7 FAIL — the shared hero's own absolutely-positioned card cluster (its source comment names it a marketing collage), which collides at the SC 1.4.10 reflow condition; 1, 4, 5 ITERATE |
| page-5 | MUST-FAIL | FAIL             | 2, 3, 5, 6, 7 FAIL; 1 ITERATE                                                                                                                                                             |
| page-6 | MUST-FAIL | **PASS (miss)**  | — called "the corpus's access benchmark" (zero authored raw values; role-correct link re-pointing; audit-clean focus ring strategy; layout-stable hydration)                              |
| page-7 | MUST-FAIL | FAIL             | 1, 2, 3, 4, 6, 7 FAIL (incl. a calculated 3.68:1 breach on the raw orange at 19px); 5 ITERATE                                                                                             |
| page-8 | MUST-FAIL | FAIL             | 2, 3, 5, 6, 7 FAIL (opaque cards occluding one another's text under overlap; the leg's SC 2.4.11 clause corrected by erratum — the cards hold nothing focusable); 1 ITERATE               |

Leg-reported cross-cutting findings (export composition, not any one page):
the four Oak-composed pages share an inline-styled button component rather
than `.oak-btn`, so the kit's double focus ring never applies to them; the
pinned `width=1280` viewport plus query-less grids leaves the composition
unreflowable (SC 1.4.10); a decorative subject icon duplicates its adjacent
label for screen readers; the newsletter input has no visible label.

### Design-system-expert leg (blind, opus)

| page   | intended  | leg overall     | criteria non-PASS                                                                                     |
| ------ | --------- | --------------- | ----------------------------------------------------------------------------------------------------- |
| page-1 | MUST-PASS | ITERATE         | 1, 2, 5, 7 ITERATE (raw literals where tokens exist; tilts are raw because no tilt token exists)      |
| page-2 | MUST-FAIL | FAIL            | 2, 3, 5, 6 FAIL; 1 ITERATE                                                                            |
| page-3 | MUST-PASS | ITERATE         | 1, 2, 5 ITERATE (raw literals; hand-rolled list rows)                                                 |
| page-4 | MUST-PASS | PASS            | —                                                                                                     |
| page-5 | MUST-FAIL | FAIL            | 2, 3, 5, 6, 7 FAIL; 1 ITERATE                                                                         |
| page-6 | MUST-FAIL | **PASS (miss)** | — (called its globals.css "the cleanest consumption surface in the corpus")                           |
| page-7 | MUST-FAIL | FAIL            | 1, 3, 4, 6 FAIL; 2, 5 ITERATE (incl. a measured ~3.68:1 contrast breach on the raw `#e05c00` at 19px) |
| page-8 | MUST-FAIL | FAIL            | 2, 3, 5, 6, 7 FAIL; 1 ITERATE                                                                         |

Leg-reported instrument findings (verbatim substance, condensed):

1. **The rubric's anchor contains the thing criterion 7 forbids**: the
   shared Oak `Hero` carries an absolutely-positioned decorative cluster
   its own source names a marketing collage (`sections.js:5`). The leg
   treated the canonical cluster as baseline and scored only
   page-INTRODUCED overlap/rotation — and flagged this as the sharpest v0
   ambiguity ("that one ruling moves four verdicts").
2. **Silent-lookalike token defect, export-wide**: `z-index:
var(--layer-3, 30)` on all three white-label toolbars — `--layer-3`
   exists nowhere in the estate, every toolbar runs on the raw `30`
   fallback while `--layer-sticky: 40` sits unused. An export-wide cure,
   not a page defect.
3. **No tilt token exists**: every decorative rotation in the corpus is a
   raw literal by necessity — criterion 7's "tokenised angles" clause is
   currently unsatisfiable, so identities that carry angles need a tilt
   scale before the clause can be met rather than merely failed.
4. **Motion self-reference**: `.oak-btn` carries a token-governed
   transition, so every Oak page including the reference "carries motion";
   the leg scored motion PRESENCE as page-introduced only and asked the
   instrument to say so explicitly.
5. **Does the token contract bind the export itself?** The leg returned
   ITERATE on the two unmutated white-label pages (raw literals where
   tokens exist) and asked for an explicit ruling: canonical-exports-PASS
   -by-construction, or the contract binds the export too (the leg's
   reading, and the one it applied).

## Scoring against intended labels

| page   | intended  | seat    | a11y (blind) | design-system (blind) | reading                                                                                                              |
| ------ | --------- | ------- | ------------ | --------------------- | -------------------------------------------------------------------------------------------------------------------- |
| page-1 | MUST-PASS | PASS    | FAIL         | ITERATE               | FALSE POSITIVE (one blind leg blocks); root: the tokenised-angles clause vs an identity-ruled but untokenisable tilt |
| page-2 | MUST-FAIL | FAIL    | FAIL         | FAIL                  | HIT ×3; targeted criteria (3, 5; secondary 2) named by every leg                                                     |
| page-3 | MUST-PASS | PASS    | ITERATE      | ITERATE               | pass-with-iterations, no block; raises the does-the-contract-bind-the-export question                                |
| page-4 | MUST-PASS | PASS    | FAIL         | PASS                  | FALSE POSITIVE (one blind leg blocks); root: the canonical hero collage self-reference                               |
| page-5 | MUST-FAIL | FAIL    | FAIL         | FAIL                  | HIT ×3 — the HELD-OUT NOVEL mutation caught by both blind legs                                                       |
| page-6 | MUST-FAIL | ITERATE | PASS         | PASS                  | **MISS ×3 — the measured v0 gap**                                                                                    |
| page-7 | MUST-FAIL | FAIL    | FAIL         | FAIL                  | HIT ×3; both targeted criteria (1, 4) named by every leg                                                             |
| page-8 | MUST-FAIL | FAIL    | FAIL         | FAIL                  | HIT ×3                                                                                                               |

Summary numbers:

- **Degradation detection (blind legs): 4/4 fixtures caught by BOTH legs**,
  every targeted criterion named in the notes, including the held-out
  novel mutation the corpus author never described to either leg.
- **The owner-rejection miss: 0/3 legs blocked the showcase root.** Both
  blind legs PASSED it; the accessibility leg praised it. The one page
  with a real owner FAIL (register Verdict 1) is invisible to rubric v0.
- **Specificity on must-pass pages (blind legs)**: the design-system leg
  blocked 0/3; the accessibility leg blocked 2/3. Both blocks belong to
  the canonical-anchor self-reference FAMILY (does the contract bind the
  export's own material?), but they rest on THREE distinct grounds, and
  no single ruling clears them all (round-3 precision, from the leg
  evidence): page-1 blocks on criterion 7's tokenised-angles clause
  against identity-ruled but untokenisable tilts; page-4 blocks on
  criterion 7 read literally against the canonical hero collage AND
  independently on criterion 2 against the canonical hero's raw
  positional geometry (`accessibility-leg.md` page-4 row) — ruling the
  collage baseline would still leave page-4 blocked on spatial rhythm.
  Under the any-leg-FAIL-blocks rule, v0 would have routed two canonical
  export pages to the Director — the false-positive rate the rubric
  declared unmeasured is now measured, and the rule-3 routing (a block
  is a Director disposition, never a silent gate) is demonstrated
  load-bearing.
- **Inter-leg overall agreement: 6/8.** Both divergences (pages 1 and 4)
  sit in the same self-reference family, on the three distinct grounds
  above; each leg stated the judging line it invented to cope, which is
  exactly the reproducibility evidence a revision needs.

Register note: this calibration writes NO rows into the wow-verdict
register. The register records the instrument's live verdicts on renders
headed for (or blocked from) the owner; a calibration run is the
instrument testing itself against known labels, and its verdicts are
homed here. The showcase root's owner verdict is already the register's
migrated Verdict-1 pre-read row.

## Findings and revision implications

1. **The measured miss (headline)**: rubric v0 cannot see the ground on
   which the owner rejected the showcase root. Its criteria audit token
   discipline, grammar, and calm — the showcase satisfies all three while
   demonstrating almost nothing, and "a design showcase must DEMONSTRATE
   the design language" (expressive range, composed content, first-paint
   impression) appears nowhere in the criteria. The v0.1 revision needs a
   criterion — or a distinct wow-bar gate — for demonstrated expressive
   range, and the register's miss-rate obligation has its first measured
   data point.
2. **The canonical-anchor self-reference must be ruled, once, in rubric
   text**: (a) whether the export's own pages score PASS-by-construction
   or the token contract binds them too (both legs asked; they chose
   opposite lines); (b) the Oak hero's own marketing-collage cluster —
   inside or outside criterion 7 (this single ruling moves four
   verdicts); (c) the motion boundary — kit-token-carried quiet
   transitions vs page-authored motion (a literal reading fails every
   page that uses a kit button); (d) criterion 2's line between
   layout-governing raw pixels and fixed-art dimensions.
3. **The tokenised-angles clause is currently unsatisfiable**: no tilt
   token exists anywhere in the estate, so EMC²'s identity-ruled angles
   can only be raw literals. Either the token estate mints a tilt scale
   (W2-class token work) or v0.1 rewords the clause to bind
   identity-ruled systematic angles pending tokenisation.
4. **Estate cure candidates surfaced by the legs** (routed to the
   Director's board as pointers; none belongs to this PR): the
   `--layer-3` silent-fallback lookalike on all three export toolbars
   (the token does not exist; `--layer-sticky` sits unused); the export
   composition's inline-styled button lacking the kit's double focus
   ring; the pinned `width=1280` viewport vs SC 1.4.10 reflow; kit raw
   dimension caps in the shared composition sources; the decorative
   subject icon's duplicated alt; the newsletter input's missing visible
   label.
5. **Follow-on**: the rubric is a living instrument — v0.1 authoring is
   its own sitting (this record is its input), and per the rubric's own
   contract every revision triggers recalibration; this corpus and its
   fixtures are reusable for that run via the restaging recipe below.
6. **Criteria couple — scoping is authorship, not outcome** (review
   round 1): fixture-a was authored against criteria 1/4 alone, yet both
   blind legs also FAILed it on hierarchy (3) and cohesion (6) — an
   injected off-system promo IS a hierarchy and cohesion event, not just
   a type/colour one. Per-criterion sharpness therefore comes from the
   authoring discipline plus the legs' named evidence, never from an
   assumption that one mutation touches one criterion; future corpus
   authors should predict the collateral set at authoring time and
   record it as part of the intended label.
7. **Leg erratum (review round 1)**: the accessibility leg's SC 2.4.11
   focus-obscuration clause on page-8 is inapplicable — the collage
   cards contain only headings and paragraphs, nothing focusable. The
   valid finding (DOM/visual-order divergence and opaque cards occluding
   one another's text) stands unchanged. The leg report carries a dated
   erratum annotation; its harvested text is otherwise conserved
   verbatim.

## Restaging recipe (deterministic corpus reassembly)

The committed fixtures are source-read pages, not a self-contained
render bundle (their `../../*.css` references resolve in their SOURCE
context). A rerun assembles the staged corpus from the live tree with
this recipe, run from the repo root into any scratch directory:

```bash
DS=packages/design/oak-design-system/studio-source
FX=docs/design/design-review/records/calibration-v0-fixtures
# The PDS identity's directory bears its pre-rename name; derive it,
# never write it (identity-naming ratchet):
PDS_DIR=$(find "$DS/whitelabel" -mindepth 1 -maxdepth 1 -type d ! -name creature)
OUT=${1:?target dir}
# BLINDNESS (round-3 cure): this record's label-key table discloses THIS
# run's page-N mapping, so a fixed mapping would leak every intended
# label to any future blind leg. The recipe therefore stages each SOURCE
# into src-K (K = the label-key table's row order), then assigns staged
# page ids by a FRESH random permutation, writing the run's key OUTSIDE
# the corpus directory — the key never enters an expert leg's context.
for k in 1 2 3 4 5 6 7 8; do mkdir -p "$OUT/src-$k"; done
cp "$DS/whitelabel/creature/index.html" "$OUT/src-1/index.html"
cp "$DS/whitelabel/creature/brand-full.css" "$DS/whitelabel/creature/brand-a.css" \
  "$DS/whitelabel/creature/icons.css" "$DS/whitelabel/creature/logo.svg" "$OUT/src-1/"
cp "$FX/fixture-c.html" "$OUT/src-2/index.html"
cp "$DS/ui_kits/oak/shared.js" "$DS/ui_kits/oak/sections.js" "$OUT/src-2/"
cp "$PDS_DIR/index.html" "$OUT/src-3/index.html"
cp "$PDS_DIR/brand-full.css" "$PDS_DIR/brand-a.css" "$PDS_DIR/icons.css" "$PDS_DIR/logo.svg" "$OUT/src-3/"
cp "$DS/ui_kits/oak/index.html" "$OUT/src-4/index.html"
cp "$DS/ui_kits/oak/shared.js" "$DS/ui_kits/oak/sections.js" "$OUT/src-4/"
cp "$FX/fixture-d.html" "$OUT/src-5/index.html"
cp "$PDS_DIR/brand-full.css" "$PDS_DIR/brand-a.css" "$PDS_DIR/icons.css" "$PDS_DIR/logo.svg" "$OUT/src-5/"
mkdir -p "$OUT/src-6/app" "$OUT/src-6/components" "$OUT/src-6/lib" "$OUT/src-6/public"
cp demos/oak-design-showcase/app/page.tsx demos/oak-design-showcase/app/layout.tsx \
  demos/oak-design-showcase/app/globals.css "$OUT/src-6/app/"
cp demos/oak-design-showcase/components/*.tsx demos/oak-design-showcase/components/useIdentity.ts \
  "$OUT/src-6/components/" 2>/dev/null || true
cp demos/oak-design-showcase/lib/inline-script.ts "$OUT/src-6/lib/"
cp demos/oak-design-showcase/public/oak-theme.js "$OUT/src-6/public/"
cp "$FX/fixture-a.html" "$OUT/src-7/index.html"
cp "$DS/ui_kits/oak/shared.js" "$DS/ui_kits/oak/sections.js" "$OUT/src-7/"
cp "$FX/fixture-b.html" "$OUT/src-8/index.html"
cp "$DS/ui_kits/oak/shared.js" "$DS/ui_kits/oak/sections.js" "$OUT/src-8/"
# Fresh permutation; the generated key lands BESIDE $OUT, never inside it.
k=1
printf '%s\n' 1 2 3 4 5 6 7 8 | sort -R | while read -r p; do
  mv "$OUT/src-$k" "$OUT/page-$p"
  printf 'page-%s = label-key row %s\n' "$p" "$k" >> "$OUT-label-key.txt"
  k=$((k + 1))
done
```

Scope claim, sharpened (review round 2, from the delta pass's suppressed
comments): this recipe reassembles the SOURCE-READ corpus — the material
a leg reads and judges, with the live repository tree beside it — never a
standalone render bundle. The staged pages' `../../*` references do not
resolve inside `$OUT`; legs are pointed at the canonical repo paths
(`packages/design/oak-design-system/{colors_and_type.css,components.css,print.css,oak-theme.js}`
and the export's `assets/` tree) as the stated resolution context,
exactly as this run was. Renderable-bundle assembly is out of scope for
the v0 manual instrument and becomes a real requirement only if a future
revision mechanises rendering.

Fidelity notes: the identity pages' local closures (`brand-a.css` via the
brand import, `logo.svg`) and the showcase's `lib`/`public` dependencies
are copied by the recipe above although THIS run's staging omitted them —
the legs resolved those through the live tree, so a rerun staged this way
is strictly closer to the judged totality; the divergence direction is
recorded here. Page-6 preserves the showcase's `app/`-relative directory
shape for the same reason (this run staged it flattened; the source read
was unaffected, the shape is now faithful). Remaining page-5 bounds: its
staged copy carries the committed fixture's sanitised strings (this run's
staged copy predated the sanitisation — the enumerated divergence set
above); its decorative `aria-hidden` icon glyphs are inert under the
renamed class. The `2>/dev/null || true` on the components copy tolerates
the showcase's unit-test siblings; the component list judged this run is
enumerated in the method section.

## The motion-scope bound (stated per the derivation note)

The unmutated Oak front page's composition sources carry hover transitions
via `var(--motion-quick)` (`shared.js:88`, `sections.js:355`). This
calibration reads the Oak no-motion stance as binding ANIMATION and
entrance motion; quiet affordance transitions inside the kit's 120/200ms
floor are within stance, and reduced-motion HONOURING is the
charter/a11y-suite's territory (the rubric's own scope bound). A future
rubric revision may tighten this reading; the bound is recorded so the
MUST-PASS label on the Oak page is honest about what it asserts.
