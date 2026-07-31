---
thread: curriculum-hub-demo
status: active
---

# Thread: curriculum-hub-demo

> Reproduce the **entire** Oak Curriculum Hub from the Claude Design canonical export
> (`demos/curriculum-hub-hw/claude-design-canonical-export`) — all pages + all components,
> visual-matched — plus two-search (live ES + local) and 6 destination cards, to the plan's
> **Definition of Done (§A–J)** (§J = web-deployed to show people). Multi-session, rotating
> Director + Implementer cast on `feat/curriculum-hub-demo` (**PUSHED to origin 2026-07-01**).

## Lane identity (owner-directed clarity statement, 2026-07-06, Director #10)

- **What this lane IS:** branch `feat/curriculum-hub-demo` / PR #295 — the complete reproduction
  of Heather W's Claude-Design Curriculum Hub export as a live, WCAG 2.2 AA, two-search Next.js
  app at `demos/oak-curriculum-hub/`, PLUS everything the reproduction forced into existence:
  the fidelity-review mechanism (`tool:fidelity` + tracked `fidelity-register.json` + the
  `fidelity-review` skill), the strict-everywhere demo-tier gate parity, and the Claude-Design
  conversion playbook (`docs/engineering/claude-design-conversion-playbook.md`).
- **Why it exists (three co-equal value streams, owner-stated 2026-07-02):** (1) Heather's work
  web-visible **for user testing**; (2) a reusable **agent-driven Claude-Design ingestion
  pipeline** (new demos AND update-pulls; update integration agent-judged); (3) rapid
  user-facing web-app capability as part of the **Oak Innovation Kit**. Strategy record:
  `docs/strategy/README.md` §Building capabilities (fourth-stream question OPEN there).
- **Where it stands:** THE BUILD IS COMPLETE — DoD §A–I verified; PR #295 all-green
  (Sonar re-passed 2026-07-06 at `345497062`); §J (web deploy) is owner-hosted POST-merge.
- **Explicit next steps, in order:** (1) resolve the six live Codex P2 threads (in flight);
  (2) owed reviewer passes over the final diff; (3) deep pre-merge record + consolidation +
  loss/metaloss scan (owner-directed 2026-07-06); (4) LOCAL SEMANTIC main-merge
  (/oak-semantic-merge, knowledge/config surfaces, re-enumerated at merge time) — **only on
  owner release** (owner is landing work on main); (5) owner visual sign-off aided by the
  fidelity report (14 unregistered findings await judgment into the register); (6) MERGE
  (standing ruling: green + all-conversations-resolved ⇒ Director merges directly);
  (7) post-merge: continuation on a FRESH branch; productionisation plan WS0+ takes over
  (`current/productionisation-and-reuse.plan.md`).

## Participating agent identities (PDR-027, additive)

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| Herring holds Jetty | claude | claude-opus-4-8[1m] | a79071 | director #1 | 2026-06-30 | 2026-07-01 |
| Swordfish holds Shoal | claude | claude-opus-4-8[1m] | eb8ff4 | director #2 | 2026-07-01 | 2026-07-01 |
| Lantern binds Sulphur | claude | Opus 4.8 | 69f157 | director #3 | 2026-07-01 | 2026-07-01 |
| Hawthorn herds Loam | claude | Opus 4.8 | 8f770e | director #4 (RETIRED — handed to Sycamore via PDR-064 Moment-2 676403a6→Moment-2, 2026-07-01) | 2026-07-01 | 2026-07-01 |
| Kite holds Fogbank | claude | Opus 4.8 | 772114 | implementer — styling/UI (cf62bda9) — RETIRED-relayed PDR-063 → Linnet | 2026-07-01 | 2026-07-01 |
| Eclipse turns Singularity | claude | Opus 4.8 | 5f4c9f | implementer — data plane (fd0ee59e) — RETIRED-relayed PDR-063 → Cinder | 2026-07-01 | 2026-07-01 |
| Cinder rides Vapor | claude | claude-opus-4-8 | ee38ca | implementer — data plane (fd0ee59e) — RETIRED-relayed PDR-063 → Deneb | 2026-07-01 | 2026-07-01 |
| Linnet guards Ridge | claude | Opus 4.8 | 2700b3 | implementer — styling/UI (cf62bda9) — RETIRED-relayed PDR-063 → Typhoon | 2026-07-01 | 2026-07-01 |
| Sycamore spins Loam | claude | Opus 4.8 | 551fb6 | director #5 (RETIRED — handed to Panther via PDR-064 Moment-2 ee0b4037, 2026-07-01) | 2026-07-01 | 2026-07-01 |
| Typhoon turns Aether | claude | claude-opus-4-8[1m] | 8d5dc3 | implementer — styling/UI (cf62bda9, adopted from Linnet) — RETIRED (team-member closeout 19:12Z; 20:22Z event was a post-closeout supplement) — relayed PDR-063 → Zinnia | 2026-07-01 | 2026-07-01 |
| Deneb mends Perigee | claude | claude-opus-4-8 | 6286a1 | implementer — data plane (fd0ee59e, adopted from Cinder) — RETIRED (clean closeout 19:10Z, owner-directed pause) — relayed PDR-063 → Junk | 2026-07-01 | 2026-07-01 |
| Panther calls Gloaming | claude | Opus 4.8 | ddfd10 | director #6 (RETIRED — owner-directed handover; final stand-down broadcast 20:32Z; seat → Birch) | 2026-07-01 | 2026-07-01 |
| Junk turns Seabed | claude | claude-opus-4-8[1m] | a14194 | implementer — data plane (fd0ee59e, adopted from Deneb on the owner restart) — RETIRED-relayed PDR-063 21:19Z → owner-launched successor (handoff record `handoffs/2026-07-01-curriculum-hub-junk-data-plane.md`; fd0ee59e retained open) | 2026-07-01 | 2026-07-01 |
| Zinnia guards Spore | claude | claude-opus-4-8[1m] | e7c85d | implementer — styling/UI (cf62bda9, adopted from Typhoon) — HOLDING-WARM at a pristine handoff (record `handoffs/2026-07-01-curriculum-hub-styling-zinnia-guards-spore.md`); relays on styling-successor register | 2026-07-01 | 2026-07-01 |
| Birch mends Petal | claude | claude-opus-4-8[1m] | 5b5574 | director #7 (RETIRED — clean PDR-064 handover to Comet #8 at their Moment-2 2026-07-02 ~06:46Z; record `handoffs/2026-07-02-curriculum-hub-director-birch.md`) | 2026-07-01 | 2026-07-02 |
| Thyme guards Dewfall | claude | claude-fable-5 | d1572a | implementer — hygiene & repo-parity (16be897b RETAINED at the owner pause + session closeout; all executable items landed+pushed — READMEs, package.json conformance, WS5.1 pin, nextjs rule, app-README rewrite, comms concept gate `09b576704`, json.ts core move `eb7ca5c7a`; remaining = the sequence-locked set in the pause-freeze note below) | 2026-07-02 | 2026-07-02 |
| Comet hunts Lightyear | claude | claude-fable-5 | e7f728 | director #8 (RETIRED — session ended at the owner boundary after the strictness train landed+pushed to `5cf288dfd`; seat → Hyena via owner-directed PDR-064 Moment-2 `7488d0c9` 2026-07-02T21:14Z, no Moment-1 pre-position existed) | 2026-07-02 | 2026-07-02 |
| Hyena stirs Lamplight | claude | claude-fable-5 | d62788 | director #9 (CLOSED OUT fully 2026-07-04 on owner direction; 35d9c8f2 RETAINED, pickup record `handoffs/2026-07-04-curriculum-hub-director-hyena.md`; tenure landed the merge run-in trains + the fidelity-review mechanism; push remains owner-gated) | 2026-07-02 | 2026-07-04 |
| Galago turns Footfall | claude | claude-fable-5 | 685da6 | implementer — styling/UI (cf62bda9, adopted COLD from Zinnia's record; slices 1–3a committed `f5d58e4a9`+`780248557`, 3b WIP green) — RETIRED-relayed PDR-063 ~07:35Z (owner-brought-forward at 69% context) → Peregrine lifts Cirrus (registered standby fc1fc8; record `handoffs/2026-07-02-curriculum-hub-styling-galago-turns-footfall.md`; cf62bda9 retained open) | 2026-07-02 | 2026-07-02 |
| Peregrine lifts Cirrus | claude | claude-fable-5 | fc1fc8 | implementer — styling/UI (cf62bda9, standby→adopted at Galago's relay 07:34Z; drove windows #3–#9: the 3b block pass, item-8 header + demo-wide 320 reflow, item-10 callout fidelity + backlog, lesson nested-main polish, exemplars/wiki alignment, E1+E2, the E3 showcase + dangerouslySetInnerHTML cure, the jest-axe backstop frozen READY for window #10) — session CLOSED at the owner pause 2026-07-02; claim RETAINED, CURRENT pickup record `handoffs/2026-07-02-curriculum-hub-styling-peregrine-lifts-cirrus.md` | 2026-07-02 | 2026-07-02 |
| Limpet herds Marsh | claude | claude-fable-5 | 34e191 | implementer — data plane (fd0ee59e, adopted from Junk's retained relay; 11 cycles committed through window #9: the DI-seam extraction `f9f71c6a5` whose ruling became house doctrine, the E3 seam `fb1852bfa`, §D capture hardening + evidence `ad4730ed2`, measure-320 `50fb7ed81` + the two-state hardening in-tree, data batch #2 in `902866437`) — SESSION COMPLETE (owner-directed full closeout at the pause 2026-07-02; fd0ee59e RETAINED, CURRENT pickup record `handoffs/2026-07-02-curriculum-hub-limpet-data-plane.md`, pointer set via claims set-handoff) | 2026-07-02 | 2026-07-02 |
| Nettle tracks Acorn | claude | claude-fable-5 | dfddd4 | director #10 (CLOSED OUT fully 2026-07-06 on owner direction; 35d9c8f2 RETAINED, pickup record `handoffs/2026-07-06-curriculum-hub-director-nettle.md`; tenure: Sonar cures + all eight PR threads fixed-and-resolved + owed reviewer passes serviced + the deep documentation arc + append-only consolidation; a FRESH session continues) | 2026-07-06 | 2026-07-06 |
| Hyena spins Lamplight | claude-code | claude-fable-5 | 27cb6f | reviewer + merge-integrator (DISTINCT from director #9 "Hyena stirs Lamplight" d62788 — one verb apart, different session): ran the 39-agent adversarially-verified PR-295 review, the semantic main-merge run-in `1731d29e9` (12 unions per PDR-049, F-111→F-121 renumber), first green run-quality-gates attestation; owner merged `e7e1e1b84` (1.60.0). Session closed 2026-07-06, no claims retained | 2026-07-06 | 2026-07-06 |
| Thyme weaves Hedgerow | claude-code | claude-fable-5 | 762020 | MCP-372 hub-conformance carrier (grounding reads on `lib/oak-theme-store.ts` / `public/oak-theme.js` / `ThemeSwitcher.tsx` / `LearningFramework.tsx`; ticket In Progress with five-slice plan + slice-1 grounding homed as MCP-372 comments) — lane state lives on the `design-system-integration` thread record; deliberate succession → Sycamore herds Xylem `028dc4` at owner word | 2026-07-30 | 2026-07-30 |

Cast arc (full detail in the handoff records): data Titan→Frigate→Polaris→Eclipse→Cinder→Deneb→Junk→**Limpet herds Marsh (session complete at the pause; fd0ee59e retained, pickup record current)**; styling Squall→Dolphin→Laurel→Kite→Linnet→Typhoon→Zinnia→Galago→**Peregrine lifts Cirrus (adopted 07:34Z; session closed at the owner pause, claim retained for the restart)**. Director chain: Herring→Swordfish→Lantern→Hawthorn→Sycamore→Panther→Birch→Comet→**Hyena stirs Lamplight (#9 — ACTIVE, Moment-2 `7488d0c9` 2026-07-02T21:14Z)**. All transfers clean PDR-064/PDR-063; the whole team paused in formation (pause broadcast 42b25684).

## Lane state

- **TEAM PAUSE FREEZE (owner-directed 2026-07-02 ~11:03Z; Thyme closeout note — the tracked record of what the untracked comms stream assigned):** the whole cast paused BY INTENT at a clean point one window short of the milestone; all four claims RETAINED (Comet director `35d9c8f2` / Peregrine styling `cf62bda9` / Limpet data `fd0ee59e` / Thyme hygiene `16be897b`). **THE BUILD IS COMPLETE** (origin `1461e5cb4`: every page + component, both searches, six cards, E1–E3, the snippet/url security hardening). **Window #10 contents — uncommitted in-tree, all READY-verified on comms pre-pause:** Peregrine's jest-axe backstop (`components/a11y-axe.test.tsx` + two axe cures + the /course no-JS 320 reflow cure; 272/272 at their READY) · Thyme's jest-axe dep pair (demo `package.json` + root `pnpm-lock.yaml`) · Limpet's 14 evidence PNGs + capture-tool touches + the measure-320 two-state hardening. **After window #10:** final §D/§E passes → MILESTONE (Thyme's pre-push tidy; NOTE the tidy's "ADD a README at demos/curriculum-hub-hw" item is ALREADY satisfied by `e8b35669e`; the `oak-design-system/` removal still needs explicit owner authorisation; the demo-evidence gitignore step needs the Galago-condition ping, Director-owned; the design-kit prune must keep or repoint `oak-design-kit/from-prototype/oak-figma-tokens.css`, the token audit's input) → PR → MERGE → WS0 (Thyme; re-derive the rename blast radius at execution — known extras: the stale "Temporary demo" comment in `pnpm-workspace.yaml`; the knip/.prettierignore comments die with their entries).
- **OWNER DIRECTION (2026-07-02, direct to Thyme, relayed to Director — comms `f1453b3b` + conservation pass `12de7ed1`): the programme carries THREE CO-EQUAL value streams**, not a demo-first hierarchy: (1) Heather's work web-visible **for USER TESTING**; (2) a reusable **skill + agent-tools driven** pipeline ingesting Claude Design export zips into standards-compliant web apps with no fidelity/functionality loss — new demos AND update-pulls, where update integration is **agent-judged ("likely no deterministic route")**; (3) rapid user-facing web-app development as part of the **Oak Innovation Kit** (with MCP apps/APIs/SDKs) enabling product exploration through user-facing experimentation. Strategy-tier record: `docs/strategy/README.md` §Building capabilities + §Open decisions (fourth-stream question OPEN, graduation trigger named). Plan-tier amendments (active plan §Impact "user testing" sharpening; productionisation plan WS2 agent-integration stage) routed to Director Birch. The active plan's "codification gated on demo #2 (N=1 guard)" note is owner-residue to re-ratify against stream 2's co-equality.
- **Owning plan:** `.agent/plans/curriculum-hub-demo/active/port-prototype-to-live-demo.md` — **DoD §A–I is the completion bar.** Enablement: `future/demo-maintenance-and-structure.md` (canonical-export sync mechanism).
- **Current objective:** drive to DoD §A–J — every page + component from the export, visual-matched; both searches; 6 cards; WCAG 2.2 AA; `CI=true pnpm check` green; reviewer passes; **§J web-deployed (Vercel) to show people**. Commits land through the full pre-commit gate (NO `--no-verify`); branch is pushed. **IMPACT (owner-stated 2026-07-01):** prove the design→data→code pipeline is repeatable AND produces excellence, web-delivered — see the plan's §Impact.
- **Current state (VERIFIED green first-hand):** the block-render **spine** (exhaustive `BlockRenderer` + 18 block components; AA-blocking Tabs roving-focus bug FIXED; quiz radiogroup + always-present role=status; 52 tests) · **Standards data-view** (`lib/standards-view.ts`: standardsFacets / browseStandards / getStandard + #qs) · **training-course local search** (`lib/static-training-courses.ts`) — all type-check + full-strict-lint + vitest green. Reviews: react-component-expert minor (hardening applied); accessibility-expert AA-fix landed; type-expert (seam) minor/safe.
- **CURRENT STATE (2026-07-01 ~22:25Z, Director Birch #7 — the evening arc, supersedes the block below):**
  Owner set session priorities via an **11-point productionisation brief** (ultrathink/ultracode);
  a 17-agent read-only analysis workflow ran + was adversarially verified; the owner ratified
  **four decisions** via the Director's question surface (§Ratified decisions in the active plan):
  §J = owner-hosted post-merge (hosting set up 2026-07-02; near-term bar = MERGE TO MAIN) ·
  E1+E2+E3 = ALL pre-merge · topology = first-class demos/ tier (the owner-gated hold RESOLVED) ·
  extraction = items-8/9-as-named-second-consumer, staged post-merge. **Plans written:** the
  active plan amended (export STAYS COMMITTED — gitignore contradiction fixed; E-series
  resequenced; 3 new operative todos wired into c6-verify; ratified-decisions block incl. #7
  **/course = PAGINATED PLAYER presentation**) + NEW
  `current/productionisation-and-reuse.plan.md` (WS0–WS6, assumptions-expert READY-WITH-FIXES →
  all 6 fixes applied). **Landed this evening (uncommitted, folds into the milestone commit):**
  slice-2b CourseShell+Sidebar (reviewed: react BLOCKING nested-main FIXED + 7 should-fixes +
  type pairs) · slice-2c `/course` wired (214-block static render) + `#section=` deep-link FOCUS
  handler + Option-A embed dispatch (164/164 green) · CalloutBlockView styled (tip
  export-verified; warning/quote INFERRED — export-verify owed) · authoritative full-course
  export render captured (grounding: sidebar spec corrections; the export is a PAGINATED PLAYER)
  · live-ES spine PROVEN vs real Oak ES (q=photosynthesis; creds were local) · §J deploy proposal
  ACCEPTED (turbo ^build dissolves the monorepo unknown) · §F no-throw CLEARED (generator-first
  refactor — thread item below is stale) · committed §D capture tool
  (`tools/capture-live-demo.cjs`, untracked→must be git-added) · **test-expert BINDING ruling**:
  the search seam needs a fresh TDD cycle (DI extraction: `search-core` + `createSearchHandler` +
  3 contract-test files; spec in comms `08ef36f6`; `ffae123ed` unpaired-landing drift recorded in
  the napkin). **Both implementer lanes HOLDING-WARM on pristine handoffs awaiting OWNER
  successor launches** (the double-launch ask is with the owner).
- **PRIOR STATE (2026-07-01, Director Panther #6, superseded above, kept for the commit/merge facts):** the pre-Course-assembly demo is **COMMITTED** — snapshot `daa0fd312` (owner-run) + Typhoon's embed SC 2.2.2 Play/Pause AA-fix & docblock (TDD) + Deneb's lesson-page self-fetch fix (`getLesson`-direct, dead `/api/lesson` route + `isLessonContent` removed). **main PR #291 (upstream-api-alignment) MERGED** as `39a3aaf50` (2-parent) **through the FULL pre-commit gate** — 105 tasks green, verified by the hook (NOT `--no-verify`); brings the programmes-family endpoints + the codegen **cached-schema-default** fix (future codegen won't live-drift). The oak-sdk-codegen drift was RESET (cache→HEAD, `CI=true` codegen) before the snapshot, dissolved. napkin + repo-continuity conflicts were **semantically union-merged** (lossless). **Branch PUSHED to origin (owner, 2026-07-01).** **Course-assembly IN PROGRESS** — Typhoon building the single shared course-shell + `/course` 214-block render (TDD), on a verified-green post-merge baseline (tsc0 / 145 vitest / eslint 0-0). Claims RETAINED for restart: Director `35d9c8f2` (Panther), styling `cf62bda9` (Typhoon), data `fd0ee59e` (Deneb).
- **Reviewer status (Hawthorn dispatched, read-only, all landed surfaces 2026-07-01):** type-expert (Block union + view-model + generator type-flow) = SAFE; test-expert (generator TDD + census) = SOUND; config-expert (eslint zoning) = PASS; react-component-expert + accessibility-expert (Standards page) = fixes applied, re-verified. **Standards page §E SIGNED OFF** (all 4 AA-blockers cleared, contrast 7.93:1 confirmed by recompute).
- **TRACKED A11Y FOLLOW-UPS (LIVE — clear before FINAL DoD §E sign-off; travel with the block-renderer / Course-assembly work since #5–#7 recur on every page):** (5) `AccordionBlockView.tsx` img placeholder double-announce → decorative swatch + `<figcaption>`; (6) `FlipBlockView.tsx` add `aria-controls` + ADD the `@media (prefers-reduced-motion)` rule in `globals.css` (still absent — DoD §E names reduced-motion on animation); (7) `CalloutBlockView.tsx` drop `role="note"` on `<aside>` + `<cite>` is for a work-title not a person; (9) `StandardsBrowser.tsx` rail count SR name → add `sr-only " standards"`; (detail-1) `StandardExemplification.tsx` placeholder double-announce; (detail-2) `StandardDetail.tsx` heading hierarchy (no heading names the viewed standard — SC 2.4.6); (P3) `standards-view-builders.ts` `buildTypeChips`/`typeVariantOf` derive from `QUALITY_STANDARD_TYPES` SSOT. **Final automated §E backstop: wire jest-axe + run `tools/measure-320.cjs` (the 320px reflow gate — landed 2026-07-02, byte-identical evidence reproduction proven).** **(8) CURED 2026-07-02 (`0d7b2f42e`): the MobileHubNav disclosure + demo-wide 320px pass — every route + the open-menu state measured clean at 320 three consecutive hydration-proof runs; the fix also unmasked and cured four latent page-content reflow failures the 1440-only §E sign-offs never saw.** **(10) CURED 2026-07-02 (window #5): callout structural fidelity landed — black 2px frame + 8px accent + 34px icon chips per the export variant map (verified value-for-value by review), QS blue family + pill chips (export-exact) + the View-in-quality-standards multi-code CTA; render-verified against the export target. Reviewer follow-ons (warning sr-only prefix, CTA sr-only code suffixes, alt-chain divergence) ride the next styling slice.** **(11, ADDED 2026-07-02, §D-class, seam) Coursemap fidelity ceiling: the export's course map is unit-tabbed cards with per-module accent dots + outcomes; `CourseNavModule` carries only `{id,title,sectionCount}` — full fidelity needs a content-tree seam extension settled between the data and styling lanes via the Director before either edits the type.**
- **TRACKED DoD §F item — CLEARED 2026-07-01 (stale below, kept for the full-scope-verify lesson):** the file was rewritten generator-first (74→50 lines; runtime throw moved to a generate-time gate); full-scope `eslint . --max-warnings 0` = 0/0 verified twice (Zinnia §1a + the A-verdicts). Original entry: a FULL `eslint .` on the demo shows **2 `@oaknational/no-throw-statement` warnings** at `lib/static-quality-standards.ts:74,79` (`parseQualityStandard` boundary validator; Cinder found via full-scope re-verify — Eclipse's "0/0" was the narrow `scripts/ lib/course/` subset; Hawthorn had propagated that narrow scope too). No-warning-toleration is absolute; this is NOT zone-eligible (real lib code, not tooling/generated). Data lane (Cinder), after the visual-target render, before the commit: prefer converting to Result-at-boundary (ADR-088 + strict-validation-at-boundary), TDD'd; if fail-loud-on-vendored-drift is genuinely correct, route the case to the Director (no silent suppression). **Verify the FULL gate scope (`eslint .`, `pnpm check`), never a predecessor's narrow subset** — a scoped "0/0" can hide warnings elsewhere.
- **Blockers / low-confidence:** content-tree type ownership (data emits units→modules→sections via `lib/course/types.ts`; styling consumes at Course-assembly — settle the tree-TYPE interface via the Director before either commits) · visual-target render for pages lacking an in-export screenshot (Standards / Hub) — Cinder's next deliverable, GATING for those pages' §D fidelity, known headless-blank risk (timebox + fallback per Director d335f331).
- **Grounded knowledge (verified — do NOT re-derive):**
  - Oak Course source = `Oak Course.dc.html` (214 blocks / 18 types / 63 sections / 76 distinct QS codes), NOT the stale 785KB `Creating lessons at Oak.html` (110 blocks / 0 QS).
  - QS = 685 (356 Required standard / 328 Model Practice; rubrics facet 299/685, 3 types; **PE-SKEWED: 277/685 PE + ~half subject-blank** — facets must handle skew/blanks honestly, no fabrication).
  - QS `type`/`state` literal-union tightening is **LANDED** (Eclipse): `QualityStandardType`/`QualityStandardState` in `static-quality-standards.ts` (single source of truth), made sound by `parseQualityStandard` (boundary validator, fails loud on vendored-data drift — the module's old "compile-time import IS the validation" claim was overstated: TS widens JSON strings to `string`); guards `isQualityStandardType`/`isQualityStandardState` exported; `StandardsFilter.type` narrowed. Closes the silent-empty-filter typo trap.
  - Export `screenshots/`: 3 of 5 are rich full-page targets (coursemap/check/framework-img = Course + Learning-Framework); standalone/bundle-nav blank. The "all headless-blank" claim was a false n=1 generalisation — corrected.
  - `lib/blocks/types.ts` (the Block union) is the seam (styling owns, data emits). **EXTENDED 2026-07-01** (schema-first, ratified) after the full 214-block extraction proved it was built from a subset: `CalloutBlock.title` optional + `attrib?`; `FlipBlock.frontImage?`; `AccordionBlock.chip?` optional; `AccordionItem.badge?` optional + `img?`. Lesson: a union inferred from sampled data must be type-checked against the COMPLETE corpus (the Course generator's `: Course` gate is that check).
  - **Oak Course = DONE as validated data** (Eclipse): `scripts/course-extract.ts` + `generate-course.ts` (re-runnable AST literal-extractor, fail-loud) emit `lib/course/oak-course.generated.ts` — 214 blocks / 4 units / 11 modules / 64 sections, compile-time-validated against the Block union (`: Course` annotation). `AccordionItem.a` string→[string] normalised in the extractor. Content-TREE type = `lib/course/types.ts` (settle interface with styling via Director at Course-assembly). `searchHub` (`lib/hub-search.ts`) = local two-search half, ready for the Hub-landing wire.
  - **`searchHub` placement = DEMO-LOCAL (Director-ratified 2026-07-01, second-consumer rule).** It is pure mechanism with exactly ONE consumer (this demo) → `consolidate-at-second-consumer`; extracting to a reusable lib now is premature generalisation. Keeping it demo-local means it is NOT calcifying as a mis-placed reusable lib, so the plan item-3 "route to arch reviewers before it calcifies" concern is satisfied by NOT promoting it. **Extraction trigger = a real SECOND consumer** (then route to the architecture reviewers). Do not re-litigate demo-local-vs-lib before that trigger.
  - **Course-assembly exec-knowledge (react-component-expert forward-note, from a now-gone sub-agent — home it before it re-derives):** at Course-assembly, feed `CourseNavProvider` a **memoised/hoisted** module array (`useMemo(() => mapUnitsToModules(course), [course])` at the provider, or a module-level constant if static) — a freshly-constructed array literal per render re-renders all 214 block descendants that read the context. Also render the 214 blocks through a `.map` with **stable per-block keys (block id, not index)** so the memoised-provider win isn't undone by a churning list above it. The context shape (`CourseNavContext.ts` = `readonly CourseNavModule[]`) already supports this cleanly.
- **Commit / codegen note (UPDATED — drift class RESOLVED):** main #291's codegen **cached-schema-default** (merged in `39a3aaf50`) means `pnpm sdk-codegen` now uses the cached schema by default, so it no longer re-fetches live and re-pollutes. Keep `CI=true` on commits (belt-and-suspenders). Commits go through the FULL pre-commit gate (**no `--no-verify`** — the hook IS the gate; the reflex to bypass is the signal to stop and analyse). Branch is PUSHED to origin.
- **Next safe step (REFRESHED 2026-07-06 post-merge — Hyena spins Lamplight):** **PR #295 IS
  MERGED to main** (`e7e1e1b84`, release 1.60.0) after the semantic main-merge run-in landed as
  2-parent merge `1731d29e9` (12 concept-union conflict resolutions per PDR-049 + the
  semantic-merge skill; F-111 renumbered F-121 per PDR-049 §Sequential-identifier collisions;
  run-quality-gates GREEN — the branch's first full CI attestation since `f8902d5c4`).
  Remaining, in order: (1) **§J owner-hosted deploy from main** (Vercel settings + env vars
  enumerated in the active plan's §J); (2) **fidelity-register judgments** — 14 unregistered
  `tool:fidelity` findings await disposition into `fidelity-register.json`; (3) **post-merge
  follow-ups from the verified 2026-07-06 review** (none blocking): dangling references to the
  removed api-md docs (`.gitignore`, the oak-eslint shared config, `docs-pipeline.md`); an
  uncaught `URIError` on malformed percent-encoding in the export-server path decode
  (dev-only); the demos dependency boundary documented but not machine-enforced in
  dependency-cruiser; three test minors (lesson-page `vi.mock` call-inspection, the
  LearningFrameworkAnimation cancelAnimationFrame mechanism-audit pair, census tests coupled
  to bundled content whose cited verification sources are untracked — the verified cure
  shape: keep ONE extraction-completeness census guard per dataset, decouple the rest from
  exact content values); plus one coverage pointer: BlockRenderer exhaustiveness is
  compiler-proven but only 4 of 18 dispatch paths are exercised at the dispatch level;
  (4) **merge-boundary
  sweep of retained claims** (Peregrine `cf62bda9`, Limpet `fd0ee59e`, Thyme `16be897b`,
  director seat `35d9c8f2` — owner-gated dispositions now the branch is merged and deleted);
  (5) **local branch deletions** (owner-run: `feat/curriculum-hub-demo`,
  `docs/pdr-049-sequential-id-collision`, `docs/every-issue-earns-a-check-doctrine` — remote
  copies already deleted/merged); (6) the **dedicated consolidation drain** (napkin ~1370
  lines, repo-continuity 568, distilled 204, director-handoff 378, pending-graduations 11
  items — all conserved-not-trimmed at the merge, owner-acknowledged debt).
- **Prior next-safe-step (REFRESHED 2026-07-06 at Nettle #10's full closeout, superseded above):** the successor's map
  is §3 of `handoffs/2026-07-06-curriculum-hub-director-nettle.md` — in one line: **PR #295 is
  ALL-GREEN at `70f6d25df` with ZERO unresolved threads and reviewer passes DONE**; remaining =
  owner releases the LOCAL SEMANTIC main-merge (re-enumerate conflicts at merge time — the
  knowledge-file set has grown; owner conservation direction governs memory-file merges) →
  owner visual sign-off aided by a fresh `tool:fidelity` run (14 unregistered findings await
  judgment into the register) → MERGE (standing ruling) → FRESH branch continuation + WS0+ →
  the merge-boundary sweep of retained claims/stashes/branches (owner-gated dispositions).
  Two standing owner corrections travel with the lane: consolidation is append-only (sources
  conserved), and directive-tier files are never edited from inferred generalisations.
- **Prior next-safe-step (REFRESHED 2026-07-04 at Hyena #9's full closeout, superseded above):** the successor's map is
  §3 of `handoffs/2026-07-04-curriculum-hub-director-hyena.md` — in one line: owner releases the
  push (~14 local commits incl. the FIDELITY-REVIEW MECHANISM: `tool:fidelity`, the tracked
  `fidelity-register.json` divergence register, the `fidelity-review` skill, playbook §Fidelity
  review, WS2/maintenance-plan pointers) → verify Vercel (bootstrap fix `857652094` is the
  cure) and Sonar → resolve the two Copilot threads (fix `e4310a1b0`) + run the owed reviewer passes →
  SEMANTIC main-merge (7 knowledge-surface conflicts; /oak-semantic-merge + ultrathink,
  owner-directed; re-enumerate at merge time) → owner visual sign-off aided by the fidelity
  report (14 UNREGISTERED findings at 7–28% triage ratios await judgment into the register) →
  MERGE → §J owner-hosted from main.
- **Prior next-safe-step (2026-07-03 — Director Hyena #9, superseded above):** SonarCloud PASSES on PR #295
  (the last-13-findings train `e993dbb1d` + the development-condition removal `2b950aaba`, both
  pushed). Landed LOCALLY since, **push OWNER-GATED ("pause before push", 2026-07-03)**: generated
  API docs removed owner-directed (`0eb7653d5`, plan at
  `.agent/plans/sdk-and-mcp-enhancements/future/generated-api-docs-strategy.md`) · install
  bootstrap builds its workspace dep closure (`857652094` — cures the Vercel/fresh-clone
  postinstall break the removal exposed) · every dep to latest admissible (`21fdff136`; audit
  clean; prettier held at 3.8 for a reproduced 3.9 idempotence bug, ranges-only — NEVER a
  workspace override, openapi-zod-client needs its own prettier 2) · `.env.example` stale entry
  dropped (`e4310a1b0`, answers both open Copilot threads). **After the owner releases the push:**
  verify Vercel (the bootstrap fix is the cure) + Sonar re-scan → reply/resolve the two Copilot
  threads → the semantic main-merge (owner-directed: /oak-semantic-merge + ultrathink +
  /oak-metacognition; 7 conflicts enumerated, ALL knowledge/config surfaces — napkin, distilled,
  director-handoff, pending-graduations, repo-continuity, .claude/settings.json, RULES_INDEX.md;
  zero source conflicts; main is 73 commits ahead of the merge-base) → owner visual sign-off →
  MERGE. §J owner-hosted from main. **PR-surface facts (verified 2026-07-03):** Codex is at
  usage limits (no further Codex reviews will arrive); the owner's "@claude please review"
  (2026-07-02 17:02Z) was never serviced (org automated reviewer OFF) — reviewer passes over the
  final diff are OWED pre-merge; the Dependency Review bot comment is STALE (ran on `b6a8ab830`;
  `pnpm audit` clean as of `21fdff136`). **NEW LANE (owner-directed + plan-approved 2026-07-03):**
  the fidelity-review mechanism — serve export + dev server, perceptual-diff triage,
  side-by-side report, tracked `fidelity-register.json` disposition ledger
  (fix/deliberate/investigate/matched/superseded; the seed of WS2 stage 2's divergence
  register) plus the canonical skill and playbook section; builds on this branch pre-merge;
  A1–A7 dispositions recorded in the Comet handoff record's successor addendum.
- **Prior next-safe-step (2026-07-02 late evening — Director Comet #8, superseded above; ratified decision 9 EXECUTED):**
  The owner ruled STRICT EVERYWHERE, NOTHING DEFERRED mid-review: every demo gate exemption
  removed repo-wide (prettier/markdownlint/knip/depcruise/eslint — withdrawn ratification
  included), the content-is-data redesign executed pre-merge (zod SSOT, JSON emission, validated
  loaders, both `.generated.ts` deleted, content-equality proven), tools decomposed under the
  line cap, vendor-reference/ dissolved, the export excluded from checks via each tool's
  gitignore-awareness (owner-ratified), the export's byte-integrity restored after a formatter
  incident (all 62 files cmp-verified vs history) — full method in
  `docs/engineering/claude-design-conversion-playbook.md`. Full gate suite green with ZERO
  exceptions: 286 tests, eslint --max-warnings 0, knip/depcruise/format/markdownlint exit 0.
  **Remaining:** land the strictness train → push → PR #295 re-scan (Sonar duplication +
  smells should clear on the merits) → sweep + resolve any new review comments → owner visual
  sign-off → MERGE. §J owner-hosted from main.
- **Prior next-safe-step (2026-07-02 evening, superseded above):**
  PR #295 is OPEN to main; window #10 + the milestone marker landed and pushed. The owner ruled
  mid-review: (a) the `demos/curriculum-hub-hw/` layout was wrong — restructured same-day per the
  active plan's ratified decision 8 (workspace = `demos/oak-curriculum-hub/`; the canonical export
  - evidence untracked INSIDE the workspace; reference-prototype/oak-design-kit left tracking —
  git history retains them; tools converted to TypeScript under the workspace's strict gates, run
  via tsx package scripts); (b) every PR review comment is addressed — the six Codex P2s fixed in
  code (quiz non-nav-key answer bug + per-block tab ids, both TDD'd; degraded-scope zero-hit
  honesty; returned-count copy; comms-reply `--tag` allowlist; turbo search-env passthrough), the
  CodeQL `decodeHtml` double-unescape fixed with a RED-proven test, next bumped 16.2.4→16.2.9
  (three high advisories cleared; 16.2.10 rejected by the minimumReleaseAge guard).
  **Remaining to merge:** land the restructure+fix train through the full gates → CodeQL
  vendored-alert dismissals + Sonar per-issue dispositions (owner-gated surfaces; MobileHubNav
  S6848 = FALSE_POSITIVE owed server-side — container-level disclosure delegation, axe-clean) →
  re-scan (the vendored Sonar/CodeQL mass leaves with the untracked files) → owner visual
  sign-off → MERGE. §J owner-hosted from main.
- **Prior next-safe-step (~09:50Z snapshot — SUPERSEDED; kept for the Framework-supersession rationale and the milestone run-in shape):**
  All prior successor-pickup turnkeys are EXECUTED: the paginated player, export-grounded sidebar,
  SPA-drive grounding, ALL 18 block-view treatments, the search-core TDD cycle, section-d captures
  (per-page evidence set COMPLETE), items 8+10 cured, Exemplars/Wiki closed (verbatim alignment —
  the honest-empty pages were already canonical-faithful), Lesson polish landed (nested-main §E
  fix, CourseShell-class). **Framework page DROPPED as SUPERSEDED (Director-ruled 2026-07-02,
  two-lane corroboration):** the canonical hub has five destinations — framework exists only as
  search index rows deep-linking into course unit 2, which the demo already delivers with search
  parity; the "framework page" artefacts are the superseded 2-unit-era standalone player.
  **Remaining sequence:** E1 (WWW nav link-out) + E2 (live-results secondary in hub search) →
  joint E3-UI (styling owns page UI, data owns the search-SDK seam; coordinate via the Director)
  → jest-axe wiring + `tools/measure-320.cjs` as the final §E backstops → final §D/§E passes →
  pre-push tidy (export STAYS committed; `oak-design-system` delete needs explicit owner
  authorisation at that moment) → MILESTONE COMMIT → push → PR → MERGE. §J = owner-hosted from
  main. **Monitor-re-arm protocol at gate boundaries** stands (agent-tools/dist rebuilds
  TASK-reclaim Monitors; re-arm + catch-up after; watcher drain-timeouts under volume — re-arm
  with `--step-timeout-ms 120000`).
- **DoD §A–I snapshot (REFRESHED 2026-07-02 — the earlier PENDING list is fully landed):** §A–I + E1–E3 VERIFIED first-hand at the milestone marker `b6a8ab830` (see the active plan's §MILESTONE VERIFICATION): every page, all 18 block components, both searches wired, per-page §D fidelity, WCAG 2.2 AA with the jest-axe backstop + the two-state 320px gate, all tracked a11y follow-ups cured or superseded-by-reviewed-design. 276/276 tests after the PR-review fix train. Remaining = the merge run-in in §Next safe step.
- **Promotion watchlist:** `director-operating-model` → PDR-117 amendment (pending-graduations, `due`); block-renderer exhaustive-total-function (definite-assignment pattern = compiler-proven total function) → `patterns/` (pending-graduations); **NEW:** union-inferred-from-sampled-data-must-be-checked-against-complete-corpus (the `: Course` gate caught 5 gaps) → pattern candidate; comms-body backtick shell-quoting → always `--body-file` (this session's repeated failure) → napkin/discipline; gates-green≠DoD-complete (axe not in the gate caught 4 AA-blockers post-green) → distilled.

## Handoff records (rehydration)

- **Director:** `handoffs/2026-07-01-curriculum-hub-director-swordfish.md` (→Lantern) · `handoffs/2026-07-01-curriculum-hub-director-lantern.md` (→Hawthorn) · `handoffs/2026-07-01-curriculum-hub-director-hawthorn.md` (→Sycamore) · `handoffs/2026-07-01-curriculum-hub-director-sycamore.md` (→Panther; the 10 inherited verdicts) · `handoffs/2026-07-01-curriculum-hub-director-panther.md` (→Birch mends Petald, self-contained + the uncommitted-WIP loss-scan — **CURRENT Director pickup**).
- **Data:** `handoffs/2026-07-01-curriculum-hub-polaris-data-plane.md` (→Eclipse) · `…-eclipse-data-plane.md` (→Cinder) · `…-deneb-data-plane.md` (→Junk) · `…-junk-data-plane.md` (→Limpet, completed) · **`handoffs/2026-07-02-curriculum-hub-limpet-data-plane.md` (→restart successor — CURRENT data pickup: standing capture/gate duties, item-11 seam coordination, the settled do-not-relitigate set; claim pointer updated via claims set-handoff)**.
- **Styling:** `handoffs/2026-07-01-curriculum-hub-styling-laurel-tracks-nectar.md` (→Kite) · `…-kite-holds-fogbank.md` (→Linnet) · `…-typhoon-turns-aether.md` (→Zinnia) · `…-zinnia-guards-spore.md` (→Galago) · `…-galago-turns-footfall.md` (→Peregrine; superseded — pre-window-3 world) · **`handoffs/2026-07-02-curriculum-hub-styling-peregrine-lifts-cirrus.md` (→restart successor — CURRENT styling pickup: the frozen window-#10 set, the remaining §E ledger + next-slice items, the grounded E3 seam facts, the milestone run-in)**.
