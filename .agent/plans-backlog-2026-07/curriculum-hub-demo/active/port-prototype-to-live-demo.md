---
title: Build the full Oak Curriculum Hub from the Claude Design canonical export (multi-session program)
status: EXECUTING — multi-session PROGRAM (owner-directed 2026-07-01). The team + Director successors build EVERYTHING from the canonical export (demos/oak-curriculum-hub/claude-design-canonical-export, untracked per ratified decision 8) — ALL pages + ALL components, visual-matched to the export render — plus a handful of curriculum-search integrations. Full reproduction, NO stubs, NO hedging ("honest-empty" language retired per owner). Standing owner principle: for any Claude Design project, always visual-match + reproduce all pages/components. Decisions matrix-resolved; only constitutively-owner residue escalates.
lane: active
lineage:
  serves_thread: curriculum-hub-demo
  serves_stream: null
  strategic_choice: null
  derives_from: .agent/state/collaboration/handoffs/2026-06-30-curriculum-hub-port-herring-holds-jetty.md
owners:
  - Panther calls Gloaming (ddfd10) — Director #6 (PAUSED for owner restart 2026-07-01; holds 35d9c8f2): routing, owner-interface
  - Typhoon turns Aether (8d5dc3) — Implementer, styling/UI (claim cf62bda9; PAUSED, retained w/ handoff pointer)
  - Deneb mends Perigee (6286a1) — Implementer, data plane / two-search / §D captures (claim fd0ee59e; PAUSED, retained w/ handoff pointer)
  - Director chain (all clean PDR-064/PDR-063) - Herring #1 → Swordfish #2 → Lantern #3 → Hawthorn #4 → Sycamore #5 → Panther #6; data Titan→Frigate→Polaris→Eclipse→Cinder→Deneb; styling Squall→Dolphin→Laurel→Kite→Linnet→Typhoon
branch: feat/curriculum-hub-demo  # not yet pushed (no owner constraint either way)
todos:
  # Re-cast 2026-07-01 (Director Lantern) to TRUE-PARITY scope + owner decisions. Prior "landing
  # feature-complete / honest-stub" cycles retired: owner declared FAR from parity on visual +
  # content + functionality. Inherited "verified" facts folded in are first-hand-reconfirmed
  # (Laurel/Lantern) per the owner "assume nothing correct" directive; items still to reconfirm
  # are tagged [re-verify].
  - id: c0-render-decode
    content: Render + decode the canonical export as the authoritative fidelity source (visual targets)
    status: completed
  - id: c1-design-kit
    content: Oak design kit local + committed (tokens, fonts, official logos, inline glyphs from export HTML)
    status: in_progress
  - id: block-renderer
    content: "ARCHITECTURAL SPINE — discriminated-union TYPED BLOCK RENDERER, one component per canonical block type (18 verified first-hand by Laurel: text/callout/heading/quiz/compare/tabs/summary/flip/accordion/stats/image/columns/video/videoimport/sortable/hotspot/download/coursemap). Pages = assembly of typed blocks. TDD on the renderer + block components."
    status: pending
    depends_on: [c1-design-kit]
  - id: content-modules
    content: "Typed content modules (data seat/Polaris): Oak Course (214 blocks / 76 distinct QS codes, from Oak Course.dc.html — NOT the 785KB stale file), Standards data-view (685 QS + #qs deep-links), Learning Framework. Feed the block renderer + local search. TDD."
    status: pending
  - id: two-search
    content: "Two-search: (1) live curriculum via ES (useCurriculumSearch, committed seam); (2) local search over bundled export content (course sections/quizzes/QS/framework). Unified hub search dispatches between them. TDD."
    status: pending
    depends_on: [content-modules]
  - id: page-hub
    content: "Hub landing — 6 destination cards (OWNER-CONFIRMED 2026-07-01: 5 canonical Courses/Standards/Rubrics/Exemplars/Wiki + a dedicated live 'Oak curriculum' search card, deliberate divergence from canonical's 5 for the live-SDK USP), unified hub search, hero. 5-card state built; 6th card + its glyph = rework (glyph absent from export → old-prototype layers glyph or best-fit, Director-routed)."
    status: in_progress
    depends_on: [block-renderer]
  - id: page-course
    content: "Oak Course — FULL block-rendered page from Oak Course.dc.html (4 units / 11 modules / 63 sections / 214 blocks / 25 QS-coded callouts cross-linking Standards). Visual targets: screenshots/coursemap.png + check.png (in-export, verified non-blank)."
    status: pending
    depends_on: [block-renderer, content-modules]
  - id: page-standards
    content: "Oak Standards — data-view over the 685 QS + #qs= deep-link targets (the Course QS-callout cross-link destination)."
    status: in_progress
    depends_on: [content-modules]
  - id: page-rubrics
    content: "Rubrics — REAL QS-facet view (filter 685 QS by rubric: 299/685; 3 rubric types — Pedagogical/Technical/Curriculum & Lesson Spec Annex B). Owner-confirmed faithful-to-canonical: real data, no fabrication, not a stub."
    status: pending
    depends_on: [content-modules]
  - id: page-framework
    content: "Learning Framework — reproduce embeds/LearningFramework.jsx (1192-line animated). Visual target: screenshots/framework-img.png (in-export, verified non-blank)."
    status: pending
    depends_on: [block-renderer]
  - id: dest-exemplars-wiki
    content: "Exemplars + Wiki — canonical-faithful DESTINATIONS (destination card + inline mention exactly as the export has them). Owner-confirmed: NO fabricated full page (export has no dedicated content); parity-with-the-export, not a stub."
    status: pending
  - id: page-lesson
    content: "Lesson view — Oak-faithful shell + additive pedagogy seam (lessonKeywords / keyLearningPoints on LessonContent)"
    status: pending
  - id: visual-target-render
    content: "GATING (route early): headless-render the canonical .dc pages that LACK an in-export screenshot (Standards, Hub-confirm, plus any without targets) → demo-evidence/. Course + Learning-Framework already have in-export targets (coursemap/check/framework-img)."
    status: pending
  - id: c6-verify
    content: "Verify — CI=true pnpm check green; owner visual review vs the canonical render; WCAG 2.2 AA (test suite RE-ACTIVATED — org mandate + owner strict-everywhere over the larger surface; ratify with accessibility-expert); no secret leakage."
    status: pending
    depends_on: [page-hub, page-course, page-standards, page-rubrics, page-framework, dest-exemplars-wiki, page-lesson, two-search, block-styling-pass, e1-e2-enhancements, e3-curriculum-showcase]
  - id: c7-licence-finalise
    content: "RESOLVED (owner-confirmed 2026-07-01): root LICENCE (MIT, code) + LICENCE-DATA.md (OGL v3.0, curriculum content incl. quality-standards.json) + official logos cover it; C7 uncommitted-gate DISSOLVED; push still held local. [re-verify] the licence files first-hand before any asset commit per owner 'assume nothing correct'."
    status: completed
  # Added 2026-07-01 ~21:45Z (Director Birch, per owner ratifications + assumptions-expert F3):
  - id: block-styling-pass
    content: "Block-view STYLING PASS (§D core; ratified decision 5): all 18 block views get their export-matched Oak visual treatment — Tailwind utilities inline, data-variant attributes RETAINED; render-ground each treatment against the full export render (render-canonical-targets.cjs), never inference; fold the tracked block a11y follow-ups into the same per-file pass. Callout done 2026-07-01 (tip verified; warning/quote variant colours INFERRED — export-verify before §D/§E sign-off)."
    status: in_progress
    depends_on: [block-renderer, page-course]
  - id: e1-e2-enhancements
    content: "E1 (SiteNav WWW link-out to thenational.academy) + E2 (live-curriculum results secondary/below local training+standards in HubResults) — owner-ratified PRE-merge; S-sized; styling lane; detail in future/curriculum-hub-enhancements.plan.md."
    status: pending
    depends_on: [block-styling-pass]
  - id: e3-curriculum-showcase
    content: "E3 — /curriculum semantic-search showcase page + 6th-card re-target — owner-ratified PRE-merge; M–L; JOINT (data lane: search-SDK exposure seam; styling lane: page UI); no canonical export target → design to tokens + design-system-expert review (no §D capture)."
    status: pending
    depends_on: [two-search, block-styling-pass]
---

# Port the Oak Curriculum Hub prototype to a live, full-fidelity demo

Promoted from the Herring→Squall handoff record (`../../../state/collaboration/handoffs/2026-06-30-curriculum-hub-port-herring-holds-jetty.md`)
and updated with owner decisions taken after it. **Co-equal, no lanes:** Titan weaves Ether
(data plane, render/decode) + Squall wakes Crag (styling/UI, adopting Herring's claim cf62bda9).

## End goal

Reproduce the **entire Oak Curriculum Hub** from the **Claude Design canonical export**
(`demos/oak-curriculum-hub/claude-design-canonical-export`): **every page and every component**,
visual-matched to the export render. Two search functions feed the unified hub search —
(1) **live curriculum** via the existing Elasticsearch connection (indexes from the bulk data),
and (2) **local search** over the bundled export data (quality-standards.json + training/course
content + the learning framework + page content). Full reproduction from the export's bundled
content — no stubs. A long-lived, **multi-session** build owned by a rotating Director + Implementer
team across successions, plus a handful of curriculum-search integrations.

## Impact — why this program exists (owner-stated 2026-07-01, Director Panther)

The End goal above is the *output*; this is the *impact* it is a vehicle for.
Owner-stated directly (via Director impact-reflection, 2026-07-01):

**Prove that the design→data→code pipeline is (a) REPEATABLE and (b) produces
EXCELLENCE — and get the demo onto the WEB so we can show people.**

- **Repeatable pipeline.** The demo is the worked *evidence* that a designer's
  Claude Design artefact (Heather W's Curriculum Hub) can be wired to LIVE Oak
  Open Curriculum data and shipped by Claude Code — and that this is a repeatable
  process (the already-decided canonical-export pull→diff→reconcile sync
  mechanism + the workflow story). Heavier reusable-skill codification stays
  gated on demo #2 (owner N=1 premature-generalisation guard); the workflow
  narrative + the decided sync mechanism are in-scope now.
- **Excellence.** The pipeline must demonstrably produce *excellent* output — so
  full-fidelity reproduction, WCAG 2.2 AA, strict-everywhere, and zero stubs are
  NOT a "credibility wrapper"; they are the direct evidence that the process
  yields excellence. The excellence bar IS the deliverable.
- **Live data.** The two-search (live ES curriculum + local) proves the pipeline
  reaches REAL Oak data, not mocks — a required pipeline stage.
- **Web-delivered to show people.** The finished demo is deployed to a shareable
  public URL (see DoD §J) — the audience is "people" the owner shows.

Priority note (Director, five-lens matrix; E3 clause SUPERSEDED 2026-07-01 ~21:30Z): the "live
ecosystem / SDK proof" reading two implementers independently converged on is a true
*sub-component*, not the primary frame. E3's placement was re-decided by the owner the same
evening: **E1+E2+E3 all land pre-merge** (see §Ratified decisions + §E-series enhancements).
Success measure: an excellent, faithful, LIVE, web-visible demo that stands as
repeatable-pipeline evidence.

**Impact sharpened + recalibrated (owner direction 2026-07-02, relayed via the hygiene lane —
PDR-117 downward-flow):** the work carries THREE CO-EQUAL value streams — (1) Heather's work
web-visible **for USER TESTING** (sharper than "show people"); (2) a reusable, skill/agent-tools
driven pipeline for ingesting Claude Design exports into standards-compliant web apps with no
loss of functionality or visual fidelity — covering new demos AND update-integration into
existing demos, where the owner names update integration as agent-judged ("likely no
deterministic route"); (3) rapid user-facing web-app capability — together the **"Oak Innovation
Kit"** (well-encapsulated, single-purpose workspaces at full repo standards). Streams 2+3 are
NOT riders on the demo. The pre-merge execution path is unchanged; the post-merge plan
(`../current/productionisation-and-reuse.plan.md`) carries the stream-2/3 build. Open owner
question (routed 2026-07-02): whether the Innovation Kit is a fourth strategy stream vs a
capabilities-tier entry.

## Mechanism

The **canonical export is the authoritative source** for page fidelity, content, and assets — it
supersedes the earlier `reference-prototype/` decode. Reproduce each page and component as idiomatic
React styled with the authentic Oak tokens; take real content, glyphs (inline in the export HTML),
official logos (`assets/logo-*-official.svg`), and bundled data straight from the export. Bind live
curriculum via the committed SDK seams; build the local search over the bundled data. Fidelity is by
construction (real export assets + tokens), not hand-translation. The reconcile mechanism is a
fresh-export diff: the export is the authority over older screenshots (e.g. the hub has 5 destination
cards, not the 6 in the old prototype capture — live curriculum lives inside the unified search).

## Build-approach directives (owner, 2026-07-01 — load-bearing)

- **Idiomatic, not slavish.** Where reworking the demo, apply React/Next best practice; do NOT
  mirror the prototype's templated DOM (its `sc-if`/`sc-for` scaffolding). Fidelity is **visual
  appearance**, not DOM structure — match how it *looks*, build it *well*.
- **Lexend, not serif.** The `visual-target/shot-prototype.png` headings render **serif** only
  because the Oak brand woff2 failed to load in the headless capture. Design intent is **Lexend**
  (the demo already loads it via `next/font`). Match Lexend; the serif is a capture artefact — do
  not reproduce it.
- **Already-matching (no rework):** SiteNav, SiteFooter, and ResultCards (lesson cards / unit rows
  / thread pills) already match the target. Biggest remaining visual gap = the **hero** (full-width
  lemon-subdued band, black underline, "SINGLE SOURCE OF TRUTH" eyebrow pill, large heading, intro,
  unified search box with black border + lemon shadow + dark Search button).
- **Section noted:** "Content that links to itself" — a two-column feature block (lavender panel +
  pastel-blue linked-quality-standard example) above the footer.

## Current state, verified ground truth & settled architecture (2026-07-01, Director Lantern)

**Parity baseline (owner, 2026-07-01):** the earlier extraction was naive; measured against the
canonical export the demo is **FAR from parity on all three axes — visual fidelity, content, and
functionality**. "Landing feature-complete" is retired as a completion claim. Definition of done is
full parity with the canonical export (see End goal), with the two owner-decided specifics below.

**Owner decisions (2026-07-01, via Director — authoritative):**

- **Page set = faithful-to-canonical.** Full block-rendered pages for the surfaces the export
  actually contains: **Hub, Oak Course, Oak Standards, Learning Framework**. **Rubrics = a real
  QS-facet view** (filter the 685 QS by `rubrics`: 299/685; 3 rubric types). **Exemplars + Wiki =
  faithful destinations** (card + inline mention, as the export has them) — NO fabricated full page.
  "No stubs / no hedging" and "never fabricate" converge: reproduce every surface the canonical has;
  represent facet/destination-only ones truthfully as what they are.
- **6 destination cards** = the 5 canonical (Courses/Standards/Rubrics/Exemplars/Wiki) + a dedicated
  live **"Oak curriculum" search** card — a deliberate divergence from the canonical's 5 to
  foreground the live-SDK USP. **Standing principle:** visual parity with the canonical is the
  default, but the live-search capability outranks pure parity where they conflict.

**Settled architecture — a TYPED BLOCK RENDERER (not a set of hand-built pages):** a discriminated-
union renderer, one presentational component per canonical block type (18 verified first-hand from
`Oak Course.dc.html`: text/heading/callout/quiz/compare/tabs/summary/flip/accordion/stats/image/
video/columns/videoimport/sortable/hotspot/download/coursemap). Pages = assembly of typed blocks.
Laurel owns the presentational block union (the seam contract); the data plane emits that union.

**Verified ground truth (first-hand — re-confirmed THIS generation per owner "assume nothing correct"):**

- Oak Course source = **`Oak Course.dc.html`** (4 units / 11 modules / 63 sections / 214 blocks /
  25 QS-coded callouts; 76 distinct QS codes), NOT the stale `Creating lessons at Oak.html` (110
  blocks, 0 QS codes). Discriminator = block-count + QS-code presence.
- Quality standards = **685** (keys id/text/type/areas/components/rubrics/code/state/subject); 299
  carry a rubric (3 types), 632 carry pedagogy-components. Standards page is data-driven over these
  - `#qs=<id>` deep-link targets the Course QS-callouts link to.
- Export screenshots: **3 of 5 are usable full-page targets** (coursemap/check/framework-img =
  Course + Learning-Framework); standalone/bundle-nav are blank. (Corrected — the earlier
  "all headless-blank" was a false n=1 generalisation.) The live-render need narrows to
  Standards / Hub-confirm.

**Retired framing (do NOT reintroduce):** the "honest-stub for training/exemplars/wiki/pedagogy/
Oak Course" synthesis is superseded — the canonical export provides the content (Course is the
LARGEST content surface, not a stub). The `wf_63fbe427` ultracode content-mapping workflow FAILED
(StructuredOutput retry-cap, ~898K tokens) and was correctly abandoned for first-hand gated
verification — kept as a Director-run-workflow lesson, not a live method.

**Cast + lanes (this generation):**

- **Director — Lantern binds Sulphur:** routing, owner-interface, plan continuity, standards bar,
  coordinated milestone commit; minimum-action.
- **Styling — Laurel tracks Nectar (cf62bda9):** typed block renderer + 18 block components (TDD),
  the 6-card landing (incl. re-adding the live-search card + its glyph), page assembly; owns the
  block-union seam; WCAG 2.2 AA + `prefers-reduced-motion` baked per component.
- **Data — Polaris mends Perigee (fd0ee59e):** sync-mechanism correction (LANDED), two-search
  (live ES + local bundled dispatch), typed content modules emitting Laurel's block union.

**Strategic proposal (still a live owner-scheduling item):** codify the demo-building process +
evolving design-kit (versioned kit SoT, an active "build an Oak Claude-Design demo" skill,
licence-first, kit-version + visual-regression). Default: author the light `future/` brief at
consolidation unless the owner gates it on demo-#2 (N=1 premature-generalisation guard). The
sync-mechanism correction already landed in `future/demo-maintenance-and-structure.md` +
`research/claude-design-integration.md`.

## Means — cycles

The operative cycle list is the **`todos` in the frontmatter** (re-cast 2026-07-01 to true-parity
scope + owner decisions). Sequencing spine:

1. **Block renderer + 18 block components** (Laurel, TDD) — the architectural spine; non-blocked.
2. **Typed content modules + two-search** (Polaris) — emit Laurel's block union; feed the pages.
   Live ES via the committed `useCurriculumSearch` seam (no contract reshape) + local bundled search.
3. **Pages = block assembly:** Oak Course (214 blocks), Standards (data-view over 685 QS + `#qs=`
   deep-links), Learning Framework embed, the 6-card Hub landing; Rubrics = QS-facet view;
   Exemplars/Wiki = faithful destinations.
4. **Visual-target render** (data seat): headless-render the canonical `.dc` pages that LACK an
   in-export screenshot (Standards / Hub-confirm) → `demo-evidence/`. Course + Framework already
   have in-export targets (coursemap/check/framework-img).
5. **Verify (C6):** `CI=true pnpm check` green + owner visual review vs the canonical render +
   **WCAG 2.2 AA** (test suite RE-ACTIVATED — org mandate + strict-everywhere) + no secret leakage
   (live `.env` stays gitignored; only `/api/*` + outbound thenational.academy in the network panel).

**Commit cadence:** uncommitted WIP until a coordinated **milestone commit** (explicit pathspec;
exclude the inherited `packages/sdks/oak-sdk-codegen/**` drift; `CI=true git commit`).

## Seam contract (Polaris [data] ⇄ Laurel [styling]) — ACCEPTED both sides

The typed content flows into the presentational block renderer, so it is a shared contract:

- **Laurel (styling)** owns the **discriminated-union block prop shapes** (the 18-type union) and
  publishes it as the contract.
- **Polaris (data)** owns the typed content modules that **emit that union** (Oak Course blocks +
  QS codes; Standards data-view over the 685 QS; Learning Framework), plus the two-search hook
  (live ES via `useCurriculumSearch` + local bundled dispatch) and the committed curriculum seams
  (`@/lib/search-types`, `@/lib/search-client`, `@/lib/curriculum`).
- **Both ping the Director + each other before any shared union/interface change.**

## Prerequisite classification

- C1 (design kit) is **blocking** for C2/C3 visual fidelity. Minimum shippable without the full
  icon set: build with the decoded tokens/fonts + the 2 brand SVGs. (DesignSync remnant retired
  2026-07-01: the ratified mechanism records DesignSync considered-and-rejected; glyphs come
  inline from the export HTML.)
- C0 is **beneficial** (done); pages 2–3 pixel-exact visuals are **beneficial** not blocking —
  content is in hand.

## Definition of Done (completion criteria — checkable; owner-mandated 2026-07-01)

**The program is COMPLETE when every box below is true and verified. Not a partial landing; the
team drives to ALL of these. "Done" is this list, nothing less.**

**A. Pages — all built, visual-matched to the canonical export render (idiomatic React, not DOM-mirror):**

- [x] **Hub landing** — 6 destination cards (5 canonical Courses/Standards/Rubrics/Exemplars/Wiki + the live "Oak curriculum" search card), hero, unified hub search wired to both search functions.
- [x] **Oak Course** — full page, block-rendered from `Oak Course.dc.html` (4 units / 11 modules / 63 sections / 214 blocks), QS-callouts deep-linking Standards (`#qs=<id>`), paginated-player presentation (ratified decision 7).
- [x] **Oak Standards** — filterable catalogue over the 685 QS (facets: type · rubric · area · subject) + `#qs=<id>` anchors that the Course callouts target.
- [x] **Learning Framework** — SUPERSEDED, not built (Director-ruled 2026-07-02, two-lane corroboration): the canonical hub has five destinations; framework exists in the export only as search-index rows deep-linking into course unit 2, which the demo delivers with search parity. The standalone-player artefacts are the superseded 2-unit era.
- [x] **Rubrics** — real QS-facet view (the 299 rubric-bearing QS; 3 rubric types).
- [x] **Exemplars + Wiki** — canonical-faithful destinations (card + inline mention as the export has them; NO fabricated page).
- [x] **Lesson view** — Oak-faithful shell + additive pedagogy seam.

**B. Components:**

- [x] All 18 block-type components + the exhaustive `BlockRenderer` (no-throw, closed union, compiler-proven complete).

**C. Search — both functions live, dispatched by the unified hub search:**

- [x] Live curriculum via Elasticsearch (`useCurriculumSearch`).
- [x] Local search over the bundled export content (course sections/quizzes/QS/framework).

**D. Fidelity:** each page visual-matched to the canonical render (in-export screenshots where present — coursemap/check/framework-img; live-rendered targets generated for Standards/Hub and any others lacking one). **Mechanism (landed 2026-07-04, Director #9):** `pnpm --filter @oaknational/oak-curriculum-hub tool:fidelity` serves both sides, captures at matched geometry, perceptually diffs every declared pair, renders `demo-evidence/fidelity-report/index.html`, and reads/writes the tracked `fidelity-register.json` divergence ledger (dispositions fix/deliberate/investigate/matched/superseded — the diff never gates; judgment does). The canonical workflow is the `claude-design-pipeline` skill; playbook §Fidelity review is the doctrine surface.

**E. Accessibility (org mandate):** WCAG 2.2 AA on all rendered UI, verified — axe clean + keyboard/ARIA/focus on every interactive block (quiz/tabs/accordion/flip/sortable/hotspot/coursemap); `prefers-reduced-motion` on the animated framework.

**F. Quality gates:** `CI=true pnpm check` green across the demo (type-check, full-strict lint, test, `next build`); real logic (searches, generator, data modules) is TDD-covered — the `demos/` exemption is knip/format/markdownlint/depcruise scope only (all four verified 2026-07-01; the depcruise omission is the root script's arg allowlist). The exemption ends post-merge per ratified decision 3 (the demos-tier gate-parity graduation, owned by `../current/productionisation-and-reuse.plan.md` WS0).

**G. Reviews cleared:** code-expert, type-expert, react-component-expert, design-system-expert, accessibility-expert passes on the built surface.

**H. Content integrity:** every surface sourced faithfully from the canonical export; ZERO fabrication; ZERO hedging/stub language. A seeming content-gap is a question to the Director, never a stub.

**I. Landed:** one coordinated milestone commit (explicit pathspec; exclude the inherited `packages/sdks/oak-sdk-codegen/**` drift; `CI=true git commit`).

**J. Web-deployed to show people (owner-directed 2026-07-01; RESEQUENCED post-merge, owner
2026-07-01 ~21:30Z):** the finished, excellent demo is deployed to a shareable **public web URL**
(Vercel) so the owner can show people. **The owner sets up hosting themself, tomorrow
(2026-07-02), from `main` post-merge — no Vercel work for the cast; local checks suffice
pre-merge.** The deploy-orchestration proposal is DONE and verified (comms, Junk 2026-07-01: turbo
`^build` builds the 4 SDK workspace deps before `next build`, dry-run verified; the
`development→src` defect is dev-only, not a deploy risk; Vercel settings + the 5 server-side env
vars enumerated). The live-ES path is PROVEN locally (real smoke vs real Oak ES, 2026-07-01).

- [ ] Deployed to a public URL; the app renders + both searches work against live Oak data.
- [ ] Live API keys / ES credentials run server-side only (no secret in the public bundle). OGL
  curriculum content + Oak brand assets are cleared for public hosting (§Owner-constitutive
  residue — confirm at deploy time).

**§J Vercel settings (conserved from the verified deploy proposal, Junk 2026-07-02 — the comms
tier is untracked, so the owner-facing detail lives here; Root Directory refreshed 2026-07-06
post-restructure — the original proposal predated ratified decision 8's rename):** Framework
preset **Next.js** · Root Directory `demos/oak-curriculum-hub` with **"Include files outside the
root directory" ENABLED** · Build Command explicit for determinism:
`turbo run build --filter=@oaknational/oak-curriculum-hub` (from repo root; turbo `^build` builds
the 4 workspace SDK deps first — dry-run verified; the `development→src` condition is dev-only,
NOT a deploy risk) · Install = default `pnpm install` · Output `.next` · Node runtime (the API
route pins `runtime='nodejs'` for the ES client; no edge). **Env vars (Production+Preview,
server-side, none `NEXT_PUBLIC_`):** `ELASTICSEARCH_URL` (required) · `ELASTICSEARCH_API_KEY`
(required, read key) · `SEARCH_INDEX_TARGET` (optional, defaults `primary`) ·
`SEARCH_INDEX_VERSION` (optional) · `OAK_API_KEY` (for the curriculum SDK seam). The live path is
already PROVEN locally against real Oak ES (2026-07-01/02 smokes); the deploy smoke also proves
the units-highlight change live (a recorded higher-scale test obligation).

**Near-term completion bar (owner, 2026-07-01 late): §A–I + E1–E3 green → milestone commit →
push → PR → MERGE TO MAIN.** §J follows from main. Owner sign-off is a visual review against the
canonical export — pre-merge against the local build, and again on the deployed URL.

**MILESTONE VERIFICATION (Director Comet, 2026-07-02, n=1 drive):** §A–I + E1–E3 VERIFIED
first-hand at `81e8effd4` — 272/272 tests (jest-axe §E backstop included), full-scope
`eslint .` clean, tsc clean, production build clean, and the two-state 320px reflow pass
(no-JS + hydrated, all 6 routes + the open-menu state) ALL CLEAN on the committed tree.
§I landed as gated incremental windows (~30 commits through the full pre-commit hook, never
`--no-verify`) rather than one bundle — every slice reviewer-gated at landing. The tracked
§E follow-ups are cured or superseded by reviewed alternate designs (recorded in the thread
record). Remaining before merge: the owner's visual sign-off against the canonical export.
The `oak-design-system/` reference is untracked/disk-only — its removal is local hygiene,
NOT a merge gate. §J remains post-merge, owner-hosted.

## Ratified decisions (owner, 2026-07-01 ~21:30Z — via Director Birch's four-question decision surface)

Recorded here because each supersedes or resolves text elsewhere in this plan; the post-merge
execution detail lives in
[`../current/productionisation-and-reuse.plan.md`](../current/productionisation-and-reuse.plan.md).

1. **§J deploy = post-merge, owner-hosted.** "I haven't set up hosting yet, I am happy to rely on
   local checks for now, and to get this work tested, checked, and merged into main, and I will
   set up hosting tomorrow." Near-term bar = merge to main; §J from main on 2026-07-02.
2. **E1+E2+E3 = ALL pre-merge** (supersedes the post-completeness deferral; §E-series below).
3. **Topology = first-class `demos/` tier ratified** (the previously owner-gated hold is
   RESOLVED): gate parity for demos (knip/prettier/markdownlint/depcruise exemptions removed), a
   one-way depcruise boundary (apps/packages never depend on demos), directory renames — all
   POST-merge, owned by the productionisation plan. No dir renames pre-merge (implementers are
   live in those paths; 5 literal-path config consumers verified).
4. **Extraction trigger = items 8/9 of the owner brief constitute the named second consumer** →
   staged extraction POST-merge (tokens → block-kit → web-ui → standards-after-data-inversion),
   each package at full estate conventions. Pre-merge only the zero-regret hygiene (ResultCards
   `Hit` type-import retarget to `search-types`).
5. **Block-view styling pass = pre-merge MUST** (§D core; discovered 2026-07-01 late: the course
   SHELL visual-matches the export but the 18 block views are structure-first/visually-minimal —
   a11y-complete with `data-variant` hooks, no visual treatment). Ruled approach: Tailwind
   utilities inline (app-consistent) + KEEP the `data-variant` attributes (preserves extraction
   optionality — extraction ships compiled CSS regardless). Styling lane owns it; fold the
   tracked block a11y follow-ups into the same per-file pass.
6. **Export disposition corrected** (§Pre-push below): the canonical export STAYS COMMITTED —
   the prior gitignore directive contradicted the ratified ingest mechanism.
7. **/course presents as a PAGINATED PLAYER (Director-ruled 2026-07-01 ~21:50Z under the owner's
   standing full-reproduction principle; owner may override).** The export's course page is a
   one-section-per-view player with sidebar navigation (render-grounded 2026-07-01); a
   single-scroll page does not visual-match it. Implementation shape: keep the server-rendered
   all-sections DOM (SSR/a11y/deep-links preserved) + a client active-section presentation layer
   (hash/state-driven, composing with the existing `#section=` focus handler); sidebar + prev/next
   navigate sections. §D captures are per-section at the player presentation.
8. **RESTRUCTURE + export disposition REVERSED — executed PRE-merge (owner, 2026-07-02
   ~afternoon, during the PR #295 review; supersedes decisions 3's "no dir renames pre-merge"
   and 6's "export STAYS COMMITTED").** The owner's ruling: the only legitimate folder in the
   demo tier is the app workspace itself. Executed the same day: `demos/curriculum-hub-hw/` is
   dissolved — the workspace is `demos/oak-curriculum-hub/`; the canonical export is an
   UNTRACKED vendor-reference folder inside the workspace (generated vendor output, brand
   assets not openly licensed, re-obtainable via the claude-design MCP);
   `reference-prototype/` and `oak-design-kit/` left tracking (git history retains them;
   `vendor-reference/oak-figma-tokens.css` recovered untracked for the token audit);
   `demo-evidence/` is an untracked regenerable output dir; `oak-design-system/` deleted;
   the tools are TypeScript inside the workspace (run via tsx package scripts) under the full
   strict gates. Consequence: the export-diff ingest baseline moves from "committed zip diffs"
   to the claude-design MCP pull (the WS2 crosswalk in the productionisation plan).
9. **STRICT EVERYWHERE, NOTHING DEFERRED (owner, 2026-07-02 evening — supersedes decision 3's
   post-merge gate-parity sequencing and every demo exemption everywhere).** The demo tier is
   ordinary repo code under the strictest repo standards; lint/gate exceptions are errors —
   withdrawn ratification included. Executed same-evening: all prettier/markdownlint/knip/
   depcruise demo exemptions removed; every demo ESLint rule-off deleted and the code fixed
   (webpack hook typed, tools decomposed at responsibility seams, generators Result-based);
   tsconfig extends base; the **content-is-data redesign executed pre-merge** (zod schemas as
   SSOT with types inferred, generators emit schema-validated JSON, loaders re-validate at
   load, both `.generated.ts` content modules deleted — content-equality proven); untracked
   vendor data excluded from checks by each tool's gitignore-awareness mechanism (owner-ratified),
   never per-path exceptions; `vendor-reference/` dissolved (the export's own token files are
   the audit authority); `.next/` excluded in depcruise as build output beside `dist`. The
   canonical-export byte-integrity discipline and the whole conversion method are recorded in
   `docs/engineering/claude-design-conversion-playbook.md` (the owner's notes-for-demo-#2 ask).
   Full gate suite green with zero exceptions: 286 tests, eslint max-warnings 0, knip/depcruise/
   format/markdownlint all exit 0.

## E-series enhancements — RESEQUENCED PRE-MERGE (owner-ratified 2026-07-01 late)

**Superseding re-decision (owner, 2026-07-01 ~21:30Z, via the Director's decision surface):**
E1, E2, AND E3 land **pre-merge** — "All three pre-merge" was the owner's explicit answer.
The prior post-completeness deferral above is superseded; the strategic detail remains in
[`../future/curriculum-hub-enhancements.plan.md`](../future/curriculum-hub-enhancements.plan.md)
(E1 nav "WWW" link-out; E2 live-curriculum results secondary/below in the hub search; E3 a new
`/curriculum` semantic-search / search-SDK showcase page, to which the 6th "Oak curriculum" card
re-targets). Sequencing within pre-merge: after the block-view styling pass and page completion
(they are polish/additions over completed surfaces); E1+E2 = S (styling lane); E3 = M–L (joint:
data lane owns the search-SDK exposure seam, styling lane owns the page UI; no canonical export
target exists for E3, so §D-style fidelity review does not apply — design to tokens + first-hand
design-system review instead).

## Pre-push directory organisation (owner-CONFIRMED 2026-07-01 — NOT an enhancement)

> **SUPERSEDED (marked 2026-07-06, Director #10):** ratified decision 8 (2026-07-02) executed a
> stricter restructure than this section planned — `demos/curriculum-hub-hw/` is dissolved, the
> workspace is `demos/oak-curriculum-hub/`, the export and `demo-evidence/` are untracked inside
> it, and the tidy items below either executed or dissolved with the rename. Kept for the
> dispositions' rationale (the licensing and never-use-git-to-remove-work reasoning still binds);
> the paths below are the pre-restructure layout and are NOT operative.

A pre-push must-do: make `demos/curriculum-hub-hw/` neat + understandable + correct-to-push.
**Sequencing:** executes **immediately before the milestone commit (§I)**, i.e. AFTER Linnet +
Cinder finish (their claims cover these paths — reorganising mid-build would collide); the
Director runs it as part of the commit workstream. **Re-verify each "unused" negative first-hand
right before deleting** (a delete needs a fresh capable search). Confirmed dispositions:

- **DELETE** `reference-prototype/` (tracked → reversible; superseded by the canonical export;
  unused — verified zero code refs repo-wide 2026-07-01; fix the dangling link at
  `oak-design-kit/PROVENANCE.md:19` in the same change) and `oak-design-system/` (**gitignored
  orphan, 0 tracked files → `rm` is permanently destructive and needs explicit owner
  authorisation at execution time** per never-use-git-to-remove-work; re-pullable per its own
  PROVENANCE.md; also tidy the stale `.gitignore` comment pointing at its non-existent README).
- **PRUNE** `oak-design-kit/` → keep only its provenance docs (`PROVENANCE.md`,
  `PROVENANCE-designsync.md`, `LIVE-DATA-CONTRACT.md`) in a clearly-named location; delete the
  redundant asset copies **after verifying `oak-curriculum-hub/public/` already holds them**.
- **EXPORT STAYS COMMITTED (corrected 2026-07-01 late, Director Birch — supersedes the prior
  GITIGNORE disposition):** the prior directive to gitignore `claude-design-canonical-export/`
  contradicted the owner-ratified change-ingest mechanism
  ([`../future/demo-maintenance-and-structure.md`](../future/demo-maintenance-and-structure.md)
  §Mechanism: "each export is committed as an immutable, versioned snapshot… a real, diffable
  artefact in git") — gitignoring would delete the diff baseline the pipeline depends on, and the
  export is NOT regenerable by the pipeline (the acquire step is the owner producing a fresh
  export). Ruling: the current 62-file snapshot stays tracked intact (its 35M `uploads/` cost is
  already sunk in history); **future snapshots exclude `uploads/`** (provenance-only, zero build
  consumers — the diff-bearing set is the page `.dc.html`/`.html` files + `_ds/` + `data/` +
  `assets/` + `embeds/` + `screenshots/`, ~4M), per the acquire runbook. Normalise the dir perms
  (700 → 755).
- **GITIGNORE `demo-evidence/`** (7.6M, re-renderable outputs) — needs `git rm --cached` (11 files
  currently tracked). **First move `token-fidelity-audit.mjs` to `tools/`** and keep/repoint its
  token-authority input (`oak-design-kit/from-prototype/oak-figma-tokens.css` — the audit dies
  with the design-kit prune otherwise).
- **CORRECTNESS — ensure TRACKED in the milestone commit:** the runtime-required generated data
  (`oak-curriculum-hub/lib/data/*.generated.ts` and any generated `.json` the app imports at
  runtime), or the pushed app is broken.
- **ADD** a `README.md` at `demos/curriculum-hub-hw/` mapping the structure (app / design SoT
  (export) / evidence / tools / provenance) so the tree is self-explaining.

## Non-goals

No data-plane **contract** change without a seam ping (extend, don't silently reshape).
(There is NO "branch stays local / no push" non-goal — a prior plan mis-attributed that to the
owner; corrected 2026-07-01, the owner confirmed they never said it. Pushing / deploy is a normal
execution decision.)

**RETIRED non-goals (superseded by the 2026-07-01 reframe — do not re-introduce):** the former
"no real data behind training/standards/rubrics/exemplars/wiki/pedagogy — static by design" is
GONE — the Claude Design **canonical export provides that content**; build every page and component
from it, no stubs, no "honest-empty". The former "no a11y **test suite** (owner-deferred)" is
superseded by strict-everywhere: WCAG 2.2 AA is a real acceptance bar and a11y coverage sits on the
Excellence agenda below.

## Scope-completeness + excellence agenda (Director Swordfish → Lantern, 2026-07-01)

Owner-directed thorough scope pass (principles.md: strict-everywhere + long-term architectural
excellence). The CORE scope is right (reproduce ALL pages + ALL components of the hub from the
canonical export, visual-matched; two search functions; curriculum-search integrations;
multi-session). These items were **under-scoped** and are now first-class:

1. **Supersede the stale body — DONE (Lantern, 2026-07-01).** The §"Current state" honest-stub
   synthesis and the §Means C0–C7 cycles were LANDING-era; reconciled to true-parity scope + the
   owner decisions + the typed-block-renderer architecture + the current cast, with the retired
   honest-stub framing explicitly marked do-not-reintroduce. Strategic-proposal: the sync-mechanism
   codification LANDED (Polaris) into `future/demo-maintenance-and-structure.md` + the research doc;
   the broader reusable-demo-process codification is tracked in the reframed `future/` plan.
2. **TDD / strict-everywhere on real logic.** The two-search functions, the local search over the
   bundled data, and the content/data modules are real logic — they get tests (unit/integration),
   not the "prototype-zone, own gates only" pass. The `demos/` gate exemption covers repo-wide
   knip/format/markdownlint scope only; it does not exempt real logic from TDD.
3. **Architectural placement (apps-thin / framework-vs-consumer).** Decide deliberately whether the
   local-search engine + two-search dispatch is demo-local or a reusable lib — it is reusable
   mechanism, not app-glue. Route to the architecture reviewers before it calcifies in the app.
4. **Visual-target dependency (partially resolved; narrowed).** CORRECTED 2026-07-01 (Lantern,
   first-hand): the export's `screenshots/` are NOT all headless-blank — **3 of 5 are usable
   full-page targets** (coursemap/check/framework-img = Oak Course + Learning Framework). So Course
   - Framework have in-export visual targets NOW. The live-render need NARROWS to the pages lacking a
   target (Standards / Hub-confirm): the **data seat (Polaris)** headless-renders those `.dc.html`
   pages → `demo-evidence/`. Reading templated `.dc.html` DOM instead of a render remains the
   appearance-match-not-DOM fluency trap for the un-targeted pages.
5. **Reviewer + WCAG-AA coverage.** The expanded build gets code-expert / type-expert /
   react-component-expert / design-system-expert / accessibility-expert passes; WCAG 2.2 AA is real
   (org mandate), verified, not deferred.
6. **Enumerate the curriculum-search integrations** ("a handful more things", owner) — currently
   named, not specified. Detail them with the owner as their own scope items.

## Owner-constitutive residue (the ONLY legitimate owner touchpoints)

Per `principles.md` §Decision Lenses, a decision reaches the owner **only** when all five
lenses genuinely fail to resolve it, or it is constitutively the owner's. There is **no
"owner-approval step."** Running the matrix over the items previously treated as owner-gated:

- **Build the plan (C2/C3/C4 app source)** — MATRIX-RESOLVED (lens 1 architectural-excellence +
  lens 5 user-value → the plan is the excellent path to the owner-set goal). NOT a gate; the
  earlier "await owner approval" was manufactured. Proceed.
- **Brand-asset & content licensing — RESOLVED (owner-confirmed 2026-07-01; Director Swordfish
  verified the licence files first-hand).** No separate licence is needed and the C7
  uncommitted-gate is **DISSOLVED**. The root `LICENCE` (MIT) covers demo code; `LICENCE-DATA.md`
  places Oak curriculum content — including `lib/data/quality-standards.json` — under the Open
  Government Licence v3.0 (attribution required); and Oak brand assets (fonts/logos/icons/
  DS-bundle) are covered by MIT not granting trademark rights in Oak's own repository. The
  redundant, over-assertive `oak-design-kit/LICENSE.md` has been removed; the `PROVENANCE.md` +
  `PROVENANCE-designsync.md` refs and a new demo-workspace README licence section point at the
  root licences + OGL attribution (British spelling throughout).
  - **Now committable** (the former C7 held-set): the whole
    `demos/curriculum-hub-hw/oak-design-kit/` tree, `oak-curriculum-hub/public/oak-logo*.svg`,
    `oak-curriculum-hub/lib/data/quality-standards.json`, and `demo-evidence/*.png`. Commit by
    explicit pathspec (app code commits normally); the OGL attribution shows in the site footer.
  - **Push / deploy — NOT owner-constrained (corrected 2026-07-01, Director Panther):** the prior
    "branch stays local / no push (owner direction)" attribution propagated through the plan but was
    **never an owner direction** (the owner confirmed they never said it). Pushing the branch and the
    §J deploy mechanism are normal execution decisions, not owner-gated.

## Quality gates

Per cycle: demo `type-check` + its own full-strict `eslint` + `next build`, all under `CI=true`.
Aggregate/final: `CI=true pnpm check` (the husky pre-commit hook is itself a turbo op — **commit
with `CI=true git commit`**, else codegen re-fetches the drifted live schema; memory
`ci-true-required-for-git-commit-codegen-hook`).

## Risks

- **Brand-asset licensing — RESOLVED (owner-confirmed 2026-07-01):** no separate exclusion needed.
  MIT covers source code only (per `LICENCE-DATA.md`) and does not grant trademark/brand rights;
  this is Oak's own repository. The redundant `oak-design-kit/LICENSE.md` was removed; assets are
  committable under the root `LICENCE` + `LICENCE-DATA.md` (OGL v3.0, attribution).
- **Scale/context:** multi-page, multi-asset → multi-session + parallelise; phase by page.
  (DesignSync serialisation risk retired 2026-07-01 — mechanism rejected; glyphs inline from the
  export.)
- **Cross-agent file sharing:** agents cannot read each other's scratchpads → shared assets live in
  the repo working tree (done for the decode).

## Foundation alignment

`principles.md` (simplicity-first; the kit makes fidelity by construction, not hand-drift),
`testing-strategy.md` (AA + gates), `schema-first-execution.md` (the SDK seams are the typed
boundary). Plan-body first-principles check: the "exactly like" claim is grounded in the decoded
tokens (vendor-literal), not assumed.

## Readiness reviewers (before DECISION-COMPLETE)

`assumptions-expert` (proportionality of "all aspects" vs static-stub scope),
`design-system-expert` + `accessibility-expert` (token fidelity + WCAG 2.2 AA),
`react-component-expert` (section componentisation). Invoke by substance during execution.

## Learning loop

On completion / milestone: run the consolidation workflow; graduate the two standing system
defects (eslint-plugin-react@10 crash; SDK `development→src` vs Turbopack dev) noted in the napkin.
