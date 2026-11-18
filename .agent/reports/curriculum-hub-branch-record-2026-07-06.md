# Curriculum Hub branch record — what was done and why (feat/curriculum-hub-demo → main)

Authored 2026-07-06 by Director #10 (Nettle tracks Acorn) from a verified synthesis over the
branch (74 commits at draft time, 2026-06-30 → 2026-07-06, PR #295), the thread record
(`.agent/memory/operational/threads/curriculum-hub-demo.next-session.md`), the active plan
(`.agent/plans/curriculum-hub-demo/active/port-prototype-to-live-demo.md`), the ten director
handoff records under `.agent/state/collaboration/handoffs/`, and
`docs/engineering/claude-design-conversion-playbook.md`. Every SHA cited was verified against
`git log` first-hand. This is the owner-directed deep pre-merge record; the thread record's
§Lane identity is the compact companion.

## The goal

Reproduce the **entire Oak Curriculum Hub** from Heather W's Claude Design canonical export —
every page and every component, visual-matched, no stubs — as a live Next.js app at
`demos/oak-curriculum-hub/`, fed by **two searches** (live Oak Elasticsearch curriculum + local
search over the bundled export data), at **WCAG 2.2 AA** and full repo strictness. The owner
named the impact directly: prove the design→data→code pipeline is *repeatable* and *produces
excellence*, web-delivered — later sharpened (2026-07-02) into **three co-equal value streams**:
(1) Heather's work web-visible for user testing, (2) a reusable agent-driven Claude-Design
ingestion pipeline, (3) rapid web-app capability as part of the Oak Innovation Kit.

## Phase narrative

### Phase 1 — Initial port + live-data wiring (2026-06-30, 1 commit)

- **What landed:** `ffae123ed` — the search-slice demo wired to live Oak data:
  `lib/search-client.ts`, `lib/curriculum.ts` (`getLesson`), server-side env choke
  (`lib/env.ts`), Oak tokens in Tailwind v4 `@theme`, Lexend, the search/lesson pages. Full gate
  green (114/114).
- **Why:** the original ask was a search demo; mid-session the owner overrode the prototype
  README's scope ("training/standards out of scope") — include **all** aspects, make the demo
  *be* the prototype.
- **What it proved:** the live-ES + SDK seams work; and it set the seam contract (styling owns
  component prop shapes, data binds live data, ping before shared-shape change) that held for
  the whole branch. It also left a lesson: `ffae123ed`'s unpaired test landing was later
  recorded as TDD drift and cured by a fresh cycle (`f9f71c6a5`).

### Phase 2 — Full build from the canonical export (2026-07-01, 2 commits carrying a whole day's multi-agent build)

- **What landed:** `daa0fd312` (owner-run snapshot of the pre-Course-assembly demo) +
  `39a3aaf50` (merge of main PR #291 through the full pre-commit gate, 105 tasks — brought the
  codegen cached-schema-default fix). The snapshot contains the work of five director tenures
  and six implementer sessions: the canonical-matched hub landing (6 cards: 5 canonical + live
  "Oak curriculum"), the Standards page over the real 685 quality standards (§E signed off,
  contrast recomputed 7.93:1), Rubrics, the exhaustive 18-variant `BlockRenderer` spine (Tabs
  roving-focus AA-blocker fixed), the re-runnable Course extractor/generator (214 blocks /
  4 units / 11 modules / 64 sections, compile-time-validated against the Block union),
  `searchHub` local search, and the Learning Framework animation with its SC 2.2.2 Play/Pause
  cure.
- **Why:** Director Swordfish's tenure locked the governing ruling — **full reproduction, no
  stubs, no "honest-empty", no hedging; the canonical export is authoritative** (superseding the
  earlier decoded prototype and the "honest stub" model of Director Herring's tenure).
  `Oak Course.dc.html` was verified first-hand as the real course source over the stale 785KB
  file.
- **What it proved:** gates-green ≠ AA-complete (reviewer fan-out caught behavioural AA-blockers
  axe cannot see, twice); a union inferred from sampled data must be checked against the
  complete corpus (the `: Course` gate caught 5 schema gaps).

### Phase 3 — Course assembly, paginated player, E1–E3, and the DoD §A–I milestone (2026-07-02, ~30 build commits)

- **What landed:** the course-assembly spine `687b1c98a`; the **paginated course player** +
  export-exact sidebar `f5d58e4a9`, `780248557`; the **search-core DI seam TDD cycle**
  `f9f71c6a5` and its E3 widening `fb1852bfa`; the full 18-block styling pass `08c5e5c34`,
  `39497c03a`; the responsive header + demo-wide 320px reflow pass `0d7b2f42e` and the committed
  320 gate tool `50fb7ed81`; §D capture hardening + per-page evidence `ad4730ed2`, `40bd402d4`,
  `4a6e118a4`; verbatim copy alignment `251c8a58c`; **E1** (Oak-website link-out) + **E2**
  (live-results secondary) `e34234b40`; **E3** (curriculum semantic-search showcase with safe
  highlight rendering) `261ea92f3` and its URL-trust/decode/abort hardening `902866437`; the
  jest-axe §E backstop `e71d8f40e`; the co-equal-streams strategy record `e8b35669e`; and the
  **milestone marker `b6a8ab830`** ("dod a-i verified"), followed by security/deps hardening
  `b3f8bd2f1` (Next 16.2.9, three high advisories), `e08437ef4`, `c14ddbb7b`. The hygiene lane
  also landed the comms concept gate `09b576704` and the eslint react-pin centralisation
  `5fbacc489`.
- **Why:** four owner-ratified decisions (Director Birch's decision surface, 2026-07-01
  ~21:30Z) set the shape: §J post-merge owner-hosted, E1+E2+E3 **all pre-merge**, first-class
  demos tier, extraction post-merge; plus the Director-ruled decision 7 that /course is a
  **paginated player** (the export's own presentation). The Framework page was ruled SUPERSEDED
  (it is a course module, not a page).
- **What it proved:** the pipeline reaches DoD-grade completeness in gated incremental windows
  (~30 commits, every one through the full pre-commit hook, never `--no-verify`), reviewer-gated
  per slice.

### Phase 4 — The restructure + strict-everywhere ruling + PR review-response trains (2026-07-02, during PR #295 review)

- **What landed:** the restructure `10ef03994` ("the workspace is the demo" —
  `demos/curriculum-hub-hw/` dissolved into `demos/oak-curriculum-hub/`, export untracked vendor
  data, tools in TypeScript); the **content-is-data redesign** `532ac45de` (zod schemas as SSOT,
  JSON emission, validated loaders, both `.generated.ts` deleted, content-equality proven); tool
  decomposition `7508fb247`; **every demo gate exemption removed repo-wide** `a2ec23270`,
  `99162f4a7`; the **Claude-Design conversion playbook** `16b33fbe0`; the review-response
  trains — six Codex P2s + CodeQL `decodeHtml` fix in the restructure train, props read-only +
  disclosure-dismissal `5cf288dfd`, the last-13-Sonar-findings train `e993dbb1d`, and the
  repo-wide **development-condition removal** `2b950aaba` (74 condition removals / 22 packages;
  workspace imports resolve built dist; demo next.config collapses to absolutely-standard).
- **Why:** two owner rulings mid-review reversed earlier decisions: **decision 8** (only the app
  workspace belongs in the demo tier; export untracked — reversing "export stays committed") and
  **decision 9** (**strict everywhere, nothing deferred** — the demo tier is ordinary repo code
  under the strictest standards; exceptions are errors). Plus the standing owner rule that every
  PR comment is fixed in code or explicitly rejected, and resolved.
- **What it proved:** SonarCloud duplication dropped to 0.8% and the quality gate flipped to
  PASS on the merits; the export's byte-integrity discipline was proven the hard way (19/62
  files formatter-mutated once, restored byte-exact from history — now the playbook's worked
  example). Comet's tenure lesson became doctrine: when a gate and the code disagree, re-derive
  from the rule's intent — only one finding (S7744) survived as a build-proven false positive.

### Phase 5 — Merge run-in trains: docs, bootstrap, deps (2026-07-03, 5 commits)

- **What landed:** generated API docs disabled/removed with a strategy plan `0eb7653d5`; install
  bootstrap builds its workspace dep closure `857652094` (cures the Vercel/fresh-clone
  postinstall break the development-condition removal exposed); **every dependency to its latest
  admissible version** `21fdff136` (audit clean; prettier held at 3.8 for a reproduced 3.9
  idempotence bug); `.env.example` stale-entry fix `e4310a1b0` (answers both open Copilot
  threads); continuity `254ceafb2`.
- **Why:** clearing every non-source obstacle between the green PR and the merge —
  deployability, dep hygiene, reviewer threads.
- **What it proved:** the strictness rulings compose — a fresh clone deploys, the audit is
  clean, and the estate suite stays green through a full dep sweep.

### Phase 6 — The fidelity-review mechanism (2026-07-03/04, 10 commits)

- **What landed:** seven TDD cycles — fidelity pairing map `590831c19`, tracked disposition
  register `3522f3dae`, perceptual-diff core `ac8d2f34d`, report renderer `a487428a8`, test
  tightening `9f3ca2a34`, composable capture cores `36cb7fe09`, live-sections capture arm
  `98a7b9b1b`, one-command orchestrator `9c11d3804` — then the reusable **fidelity-review
  skill** `f3209f5ce` and Director #9's closeout `79e5fb9e3`. One command (`tool:fidelity`)
  serves the export and the dev server, captures both sides at 1440/dSF2, pixelmatch-triages 14
  declared pairs, renders a side-by-side report, and reads/writes the tracked
  `fidelity-register.json` (dispositions: fix / deliberate / investigate / matched /
  superseded). The diff never gates.
- **Why:** owner-directed and plan-approved 2026-07-03 — §D sign-off needed a mechanism, not a
  vibe, and stream 2 (the ingestion pipeline) needs a divergence register for agent-judged
  update integration (the seed of WS2 stage 2).
- **What it proved:** proven in both server modes with a real disposition-loop entry; the review
  fabric is now reusable beyond this demo.

### Phase 7 — The merge-window cures (2026-07-06, Director #10)

- **What landed:** `345497062` — the two fresh Sonar findings cured at root (bootstrap template
  nesting, S4624; dev-server PATH-searched spawn replaced with an npm_execpath-derived
  absolute-path resolver behind a tested pure seam, S4036); Sonar re-passed on PR #295 at this
  SHA. The two Copilot `.env.example` threads replied-to and resolved against the landed fix
  `e4310a1b0`. Six further Codex P2 threads (landed 2026-07-02 21:52Z, after the handoff map's
  evidence window) were discovered live, verified one-by-one, and all six fixed in code:
  `ba043b917` (five demo cures — no-link fallback for rejected hit URLs, id/code in standards
  text search, query-keyed search state through the debounce window, tablist preventDefault,
  strict SEARCH_INDEX_TARGET) and `c4f87710f` (the comms concept gate fails closed on a partial
  policy). All eight PR conversations resolved with fix SHAs; zero unresolved threads remain.
  The owed reviewer passes (the owner's unserviced "@claude please review", 2026-07-02) were
  then run over the final integrated diff: holistic code-expert = **APPROVED WITH SUGGESTIONS**
  (one consistency fix adopted pre-merge — safeUrl narrowing extended to the content-plane
  lesson URL; plus a playbook amendment naming the depcruise single-`@/*`-alias constraint for
  conversion #2); accessibility-expert = **PASS on all three changed surfaces, zero AA
  violations** (one best-practice cure adopted pre-merge — the ResultsHeader per-keystroke
  live-region churn, replaced by one persistent sr-only status region per the in-repo
  ShowcaseResults precedent). Both verdicts' full texts are in the session transcript; the
  adopted fixes landed as the final polish train.
- **Why:** the standing bar is green + all-conversations-resolved before merge; every finding
  fixed on the merits (never dismissed).

## Decisions that shaped the branch

The nine ratified decisions (active plan §Ratified decisions):

1. **§J deploy = post-merge, owner-hosted** — near-term bar is merge to main.
2. **E1+E2+E3 all pre-merge** — supersedes the post-completeness deferral.
3. **Topology = first-class `demos/` tier** — gate parity and renames post-merge (later
   superseded by 8/9).
4. **Extraction trigger = owner-brief items 8/9 as the named second consumer** — staged
   extraction post-merge.
5. **Block-view styling pass = pre-merge MUST** — Tailwind inline, keep `data-variant` hooks
   (extraction optionality).
6. **Export stays committed** (later reversed by 8).
7. **/course presents as a paginated player** — the export's own presentation, Director-ruled
   under the full-reproduction principle.
8. **Restructure executed pre-merge** — the workspace *is* the demo
   (`demos/oak-curriculum-hub/`); export untracked vendor data; supersedes 3's sequencing and 6.
9. **Strict everywhere, nothing deferred** — every demo exemption removed; content-is-data
   executed pre-merge; vendor data excluded via gitignore-awareness, never per-path exceptions.

Plus the owner's **three co-equal value streams** ruling (2026-07-02): user-testing visibility,
the reusable agent-driven ingestion pipeline (update integration agent-judged, "likely no
deterministic route"), and the Oak Innovation Kit capability — streams 2+3 are not riders on
the demo. Fourth-stream question remains open in `docs/strategy/README.md`.

## What the branch produced beyond the demo

- **The fidelity-review mechanism**: `tool:fidelity` orchestrator, tracked
  `fidelity-register.json` disposition ledger, the `fidelity-review` skill (`f3209f5ce`) —
  reusable review fabric for any Claude-Design conversion.
- **The Claude-Design conversion playbook**
  (`docs/engineering/claude-design-conversion-playbook.md`, `16b33fbe0`): the one governing
  rule, target structure, vendor-data handling, content-is-data, gate-integration checklist,
  verification tooling, fidelity review, accessibility bar, review discipline — the owner's
  "notes for demo #2".
- **Demo-tier gate parity** (`a2ec23270`, `99162f4a7`): demos are ordinary repo code under the
  strictest gates, repo-wide.
- **DI-seam doctrine**: the search-core extraction (`f9f71c6a5`) whose contract-test TDD ruling
  became house practice.
- **The development-condition removal** (`2b950aaba`): all 22 workspace packages resolve built
  dist everywhere; absolutely-standard Next config.
- **The comms concept gate** (`09b576704`): PDR-044 trip-lists enforced at the agent-comms
  write path.
- **Committed verification tools**: the two-state 320px reflow gate, §D capture tooling,
  jest-axe backstop pattern.
- **Estate hygiene with independent value**: install-bootstrap dep closure (`857652094`),
  all-deps-latest (`21fdff136`), eslint react-pin centralisation (`5fbacc489`), the
  read-nextjs-docs rule (`064197bc4`), the generated-API-docs strategy plan (`0eb7653d5`).

## The operating model story

This branch was also a live trial of the autonomous-team operating model: a rotating
**Director + Implementer cast** across ten director seats (Herring → Swordfish → Lantern →
Hawthorn → Sycamore → Panther → Birch → Comet → Hyena → Nettle, #10 active at record time) and
two long implementer chains (data: Titan→Frigate→Polaris→Eclipse→Cinder→Deneb→Junk→Limpet;
styling: Squall→Dolphin→Laurel→Kite→Linnet→Typhoon→Zinnia→Galago→Peregrine; plus Thyme on
hygiene), every transfer a clean **PDR-064** (director) or **PDR-063** (implementer) handoff
with a self-contained record. Doctrine hardened en route: peers implement / the Director routes
and dispatches read-only reviewers only; decide autonomously, surface only constitutively-owner
residue; commit trains through the full gate, never `--no-verify`; per-slice reviewer fan-out
(which caught AA-blockers the gates could not, repeatedly). From Comet's tenure the owner
collapsed the cast to **n=1** (Director-only to MERGE) for the endgame — the strictness trains,
merge run-in, and fidelity mechanism all landed single-seat.

## Known debts carried past merge

- **14 unregistered fidelity findings** (triage ratios 7–28%) await owner judgment into
  `fidelity-register.json` at visual sign-off.
- **§J web deploy** — owner-hosted from main; the units `highlight:true` value-proof rides the
  deploy smoke.
- **WS0+ productionisation** (`current/productionisation-and-reuse.plan.md`): staged extraction
  (tokens → block-kit → web-ui → standards), directory-rename blast radius, the stale
  `pnpm-workspace.yaml` comment.
- **WS2 activation**: lift the fidelity mechanism into the dedicated tooling workspace;
  re-ratify the WS2 stage naming and the "codification gated on demo #2" N=1 guard against
  stream 2's co-equality.
- **Open owner questions**: the fourth-stream strategy row; the WS6 SSO decision set.
- **Knowledge debt**: deep consolidation registered and being executed in the 2026-07-06
  pre-merge documentation arc (napkin over limit, 9 pending graduations); `thread_url` empty
  from the SDK (upstream gap).

## Traceability notes

- Commit count at draft: exactly 74 (1 on 06-30, 2 on 07-01, 55 on 07-02, 13 on 07-03, 2 on
  07-04, 1 on 07-06), including the `39a3aaf50` merge commit. Every SHA above verified against
  `git log` on 2026-07-06.
- Birch-tenure commits narrated as 07-01 evening in the handoff records carry 07-02 git dates
  (a tenure crossing midnight) — git dates used throughout this record.
- A first synthesis draft claimed the plan's MILESTONE VERIFICATION anchor `81e8effd4` did not
  exist on the branch; first-hand verification shows it does (the triple-implementer-closeout
  continuity commit, 2026-07-02). The claim was a subagent tooling error, caught by the
  critically-assess-all-subagent-results discipline before it could falsify this record.

_Record locations, 2026-09-06: of the thread records named above by their paths of the
time, those the 2026-09-06 consolidation paused moved under
`.agent/memory/operational/threads/paused/` (the threads README's lifecycle layout; the
paused index in `repo-continuity.md` names each); a record still active keeps its root path
under `.agent/memory/operational/threads/`; the paths here are the historical ones._
