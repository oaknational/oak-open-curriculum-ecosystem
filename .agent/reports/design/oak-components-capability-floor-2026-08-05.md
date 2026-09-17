# The Oak Components capability-and-value floor (DRAFT for owner shaping)

**Status**: DRAFT — authored 2026-08-05 at the owner's word by the
Director seat (Petrel holds Turbulence, a0892f); awaiting owner shaping
and ratification. **Owner framing, verbatim intent**: extract from the
Oak Components research "a floor for capability and value that our
design system must meet or enable in more appropriate layers, not a
goal, an absolute minimum we cannot fall below, and not even a complete
minimum, there will be other areas where a high floor is simply
required."

**Source**: the source-backed study
[Oak Components — anatomy, intent and evolution](../../research/innovation-kit/web-app-deconstruction/docs/current-state/oak-components-anatomy-intent-and-evolution.md);
research snapshot 2026-08-03, package v3.4.0; landed on `main` via
PR #737, merge commit `67d23056e` — the pinned source revision for
this extraction) — covering the Oak
Components library and its counterpart consuming code in OWA. The
study's evidence classes (Observation / Inference / Hypothesis) were
respected in the extraction: floor rows rest on Observed capability
wherever possible.

**Owner shaping (2026-08-05, verbatim, folded at the design seat
before PR-open)**: the floor derived from these systems "is a
necessary but not sufficient or complete floor, we have many
requirements beyond those systems, and where we do overlap, many of
our floors are deliberately higher than theirs." Two consequences
carried through this document: incompleteness is CONSTITUTIVE — this
extraction can never be completed from this source, only joined by
other areas' own floors (reading rule 3); and the rows named in
§Above-floor rows are the OC-evidenced instances of exceeding, never
a census of where our floors sit deliberately higher.

**Reading rules**:

1. Each row is an **absolute minimum** — falling below any row is a
   defect in our system, not a trade.
2. "Meet or enable in more appropriate layers": the floor binds the
   VALUE, never Oak Components' shape. Where OC delivers a value
   through a shape our architecture rejects, the row names the value
   and our layer.
3. This floor is **deliberately incomplete**: it is only what OC's
   evidence supports. Curriculum-content fidelity, print/deck targets,
   internationalisation, and other areas carry their own floors from
   their own sources.
4. **Excluded by design** (OC weaknesses the research names — the floor
   takes the value, never the defect): the single flat export doorway
   as a shape; private-internals gravity pulling product code inward;
   "shared = two consumers" as a value theory; release automation
   without compatibility judgement; episodic socially-enumerated
   consumer assurance; framework/service peers imposed on token-only
   consumers; folder taxonomy doubling as ownership protocol.

## The floor

| # | Floor (absolute minimum) | Oak Components evidence | Our more-appropriate layer |
| --- | --- | --- | --- |
| 1 | A semantic token vocabulary that expresses **intent, not implementation** — colour roles, spacing scale, typography styles, border/radius/shadow/motion/z-index — rich enough that themes share component code | 92 UI roles over 79 primitives; 28 spacings; 29 composite type styles; "`bg-primary` expresses intent, while `white` expresses an implementation" | The DTCG token tier — lower and more portable than OC's TypeScript objects |
| 2 | **Every semantic role resolves in every theme** — no partially-themed component, ever | OC's dark theme shipped with the warning that not every component supported themes; the research calls theming a "partial success" — the anti-floor | The identity emitter + the per-identity gate matrix (completion plan W2.2/W2.5) |
| 3 | **Typed styling access**: token lexicon, a which-token-kind-where grammar, responsive syntax — checked at authoring time | The `$`-prop styling DSL; "TypeScript rejects many invalid combinations" | CSS custom properties + kit recipe classes at the CSS layer; typed props at the React tier |
| 4 | **Layout and typography primitives** sufficient to compose full pages with zero raw values | OakBox/OakFlex/OakGrid + seven typography families | Kit composition classes; thin React wrappers above |
| 5 | **Interaction capital, implemented once**: modal (focus trap/return, escape/backdrop, scroll), disclosure, dropdown (keyboard nav, outside-click), feedback (toast/tooltip/banner), navigation patterns — APG-conformant, reduced-motion aware, announced where stateful; fixes propagate to every variant | The research's core value claim: the "interaction kernel" and the internal-mechanism "assurance membrane" | A shared mechanism layer (kit + React tier), never per-demo |
| 6 | **Reduced rediscovery as the value test**: no consumer re-derives focus order, theme semantics, spacing rhythm, loading behaviour, announcements, or visual policy | The study's master framing of OC's delivered value | Every layer — the acceptance question for any new surface |
| 7 | **Entry at any altitude**: theme-only, tokens-only, primitives, controls, interaction patterns, full recipes — all supported consumption modes | OC's six modes of reuse (study §8.5: theme/global styles; tokens/style helpers; layout/typography primitives; branded controls; complex interaction patterns; product-level recipes); AILA consuming tokens + layout under a different stack (the strongest portability evidence) | Layer sovereignty (kernel property) — met by construction; must not regress |
| 8 | **Stable local extension** without forking | AILA's styled wrappers as healthy extension; "stable extension points" named as the most portable layer | A named extension mechanism per layer |
| 9 | **Import stability under internal reorganisation**, plus versioned, provenance-signed releases with rollback checkpoints | The single-doorway lesson: 353-file and 999-file reorganisations were non-breaking; 434 versions in 30 months with SemVer + npm provenance | Per-layer export contracts, each stating its own stability promise — the layered restatement of OC's flat doorway (a Director proposal, not the study's) |
| 10 | **Inspectable specimens**: every public pattern viewable in named states by non-engineers | Storybook as the organisational boundary object across design/eng/QA/product | The showcase + reference tier |
| 11 | **Consumer assurance support**: exported test helpers; candidate changes provable against real consumers **continuously** | OC's yalc workflows + exported mock observers — but episodic ("care is episodic and socially enumerated") | Demos as in-repo consumers under `pnpm check` — continuous by construction, deliberately above OC's floor |
| 12 | **Host setup reduction** — fonts, global styles, provider wiring done once — **without cross-layer coupling costs** | The integration-adapter role; the Cloudinary/Next peers on token-only consumers are the named anti-pattern | Kit global CSS + thin per-framework adapters |
| 13 | **Decisions inspectable later**: why a pattern is shaped as it is survives its authors | OC's "unusually descriptive PR corpus" as institutional memory | The plan/ADR/register estate — already ours |

## Above-floor rows (OC-evidenced instances, not a census)

Rows 2, 10 and 11 set our floor **above** OC's demonstrated capability,
on purpose. Partial theming (row 2) and episodic assurance (row 11) are
the two weaknesses the research names most sharply; complete Storybook
discoverability (row 10) sits in the study's own "what remains partial"
synthesis, with open issue #248's incomplete prop visibility for a core
button as the direct evidence. Our architecture already commits to the
stronger form in each case. They are floor rows here because falling
back to OC's level would be a regression against our own kernel, not
because OC demonstrates them. Per the owner's 2026-08-05 shaping note
above, these are only the instances THIS source evidences: across the overlap,
many of our floors sit deliberately higher than OC's, and the areas
beyond OC's scope carry their own floors from their own sources.

## Consumption

At ratification this floor becomes a story-open input to the
completion plan's W0.1 (feature census — floor rows join the census's
coverage questions) and W3.0 (React-tier mapping coverage — floor row 5
names the minimum interaction-capital classes a mapping decision must
cover). The wiring edit to the plan's §Story-open pointer tables rides
the ratification, not this draft.
