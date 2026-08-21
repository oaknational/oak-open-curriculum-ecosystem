# design-system-integration — next-session record

Thread: the AIP-137 design-system integration (ADR-213; plan
`.agent/plans-backlog-2026-07/architecture-and-infrastructure/current/design-system-integration.plan.md`).
First written 2026-07-20 ~06:15Z by Salmon binds Undertow (`de5c10`, claude-code/fable-5)
at a compaction boundary; additive-identity discipline applies — later writers append,
never rewrite. This record owns the HUB-MIGRATION lane's continuation; Caracal wakes
Tunnel (`265648`) and Harrier rides Updraft (`416a38`) own their lanes via their claims,
the plan, and the comms stream — treat every line here as pointer-and-hypothesis and
recompute live state from claims/comms/git at pickup.

## Participating identities (additive — joiners append a row, never replace)

| Date (UTC) | Agent | Platform / model | Session prefix | Role on thread |
| --- | --- | --- | --- | --- |
| 2026-07-20 | Salmon binds Undertow | claude-code / fable-5 | `de5c10` | first writer (compaction boundary) |
| 2026-07-20 | Caracal wakes Tunnel | claude-code / fable-5 | `265648` | Stage-A import lane |
| 2026-07-20 | Harrier rides Updraft | claude-code / fable-5 | `416a38` | cycle-3 four-theme gate lane |
| 2026-07-20 | Heron seeks Bluff | claude-code / fable-5 | `ef3eb0` | design-system lane (second-generation cast) |
| 2026-07-20 | Foehn rides Flight | claude-code / fable-5 | `3e9afa` | lane successor; fold + Layer-3 distillations |
| 2026-07-20 | Tornado tracks Apex | claude-code / fable-5 | `daace4` | Director — identity-table cure at #434 adjudication |
| 2026-07-26 | Triton mends Void | claude-code / Opus 5 (1M) | `9f070b` | MCP-128 landing lane — design-system consumption in the MCP app |
| 2026-07-26 | Skipper tracks Abyss | claude-code / fable-5 | `4144b4` | MCP-128 lane successor (Lavender→Skipper); executes the owner-ratified #565 restack |
| 2026-07-26 | Schooner binds Trench | claude-code / claude-fable-5 | `5492d7` | MCP-128 restack successor (Skipper→Schooner, PDR-063 at owner word); continues PR-3 from the frozen inventory |
| 2026-07-30 | Thyme weaves Hedgerow | claude-code / claude-fable-5 | `762020` | design-showcase lane (adopted claim `ebb3efe2` from Altair turns Infinity `7a97a1` at owner word 2026-07-29 — Altair held the lane 2026-07-29 unregistered on this table); landed #637 + #641; MCP-372 carrier at owner ruling; deliberate succession → Sycamore herds Xylem `028dc4` 2026-07-30 |
| 2026-08-02 | Moss calls Loam | claude-code / claude-fable-5 | `79b433` | Design-lane seat at direct owner word (Director: Falcon hunts Flight `52841f`); movement 1: PR #710 MERGED `58e5be461` — kit 1.8.0 TS-runtime + choice() on main |
| 2026-08-02 | Corsair hunts Surf | claude-code / claude-fable-5 | `4d3282` | Design-lane successor seat at direct owner word (evening, post-Moss retirement); standby, warm pause — activation gated on the ratified design-system completion plan node + Director/owner word |
| 2026-08-07 | Civet spins Cavern | claude-code / claude-fable-5 | `054f5e` | Design-lane successor (Saffron→Civet, PDR-063 deliberate succession at owner word, Director ACTIVATE 20:46Z); claim `645b9e0b` adopted 20:46Z after the handoff record read end to end |
| 2026-08-17 | Yarrow stirs Undergrowth | claude-code / claude-fable-5 | `ab1066` | Critical-analysis sitting + records-truth pass (MCP-613) at direct owner word; claim `645b9e0b` adopted after the winddown record + this record read end to end |

## Board state at writing (recompute, do not trust)

- **PR #410 MERGED** (ADR-213 doctrine). **PR #412 MERGED** `SHA:6631bb5ac` (PR3
  validation layer; Harrier continues cycle-3 four-theme gate wiring in
  `design-tokens-core`, will touch `oak-design-tokens`).
- **PR #411** (Stage A import, Caracal): 15/15 green, 0 threads, MERGEABLE; owner ruled
  agent-merge-on-green (Director broadcast 2026-07-20T06:08Z) — Caracal executes
  `gh pr merge 411 --merge`. Owner rulings recorded on that branch: theme surface
  MAXIMAL (AAA-for-HC reading), marks licensing gate discharged, studio material under
  `packages/design/oak-design-system/studio-source/`.
- **OWNER STANDING GRANT (whole merge drive, 2026-07-19/20 verbatim "agents have merge
  permissions for this merge drive")**: any queue PR merges by the holding seat's own
  hand at threads-resolved + checks-green + MERGEABLE; `--merge` never squash, never
  `--admin`.
- **Host blocker (verify cured before relying on gh)**: the shared gh token went 401 on
  2026-07-19T22:58Z (owner re-auth asked). The Director's 06:08Z merge instructions
  imply it may be cured — run `gh auth status` first.

## The hub-migration lane (Salmon binds Undertow; claim `05c78eaa`)

- **Worktree**: `oak-open-curriculum-ecosystem-worktrees/aip-137-hub-migration`
  (sibling of the primary checkout), branch
  `jimcresswell/aip-137-hub-migration-kit-and-theme-mapping`, tip `SHA:19267a2fc`,
  pushed. **PR #413**, stacked on #411's branch — auto-retargets to `main` when #411
  merges. PR body carries both slices + review-focus table.
- **Landed**: slice 1 (`SHA:4f12befa0`) — hub consumes
  `@oaknational/oak-design-system` (workspace dep; kit CSS imported; Tailwind utilities
  aliased onto role tokens via `@theme inline`; all oak-hue utilities renamed across 53
  files; raw-hex mirror deleted; six deliberate value shifts in
  `demos/oak-curriculum-hub/fidelity-register.json` entry
  `hub-global/token-source-convergence-slice1`). Slice 2 (`SHA:19267a2fc`) — theme/
  motion/focus wiring (pre-paint inline `oak-theme.js` from a tracked `public/` copy +
  byte-parity test `app/oak-theme-parity.test.ts`; five-theme + motion ThemeSwitcher in
  a footer display-settings band via `lib/oak-theme-store.ts` useSyncExternalStore
  adapter; kit double focus ring global; data-motion semantics on the motion floor;
  register entry `hub-global/theme-motion-focus-wiring-slice2`).
- **Facts a successor must not re-derive**: Turbopack mangles module-resolved fs paths
  (EBADF) — the `public/` plain-read shape is the working one; the served asset is
  registered with typed-eslint (`eslint.config.ts` globalIgnores), knip (root
  `knip.config.ts` ignore), and depcruise (root `.dependency-cruiser.mjs` no-orphans
  pathNot), each rationale-commented, with the parity test as the honest guard. The kit
  has NO global focus rule (all `.oak-*`-scoped), so the hub's global rule carries the
  kit ring recipe until §6 — deleting it early strands unmigrated controls.
- **Next safe steps, in order**: (1) after #411 merges, confirm #413 retargeted to
  `main`, watch CI, harvest review rounds (paginate threads; re-fetch after every
  push), drive to honest green, merge by own hand under the standing grant, broadcast;
  (2) **§6 component classes as a NEW small PR** (do not grow #413); (3) **§7
  contrast-audit-in-CI as its own PR** — seeds: the kit's
  `dtcg/contrast-pairings.json`, the conserved probe script
  `.agent/reports/design/aip-137-dtcg-probes-2026-07-19.py`, and the verified baseline
  in the Stage-A report Part 2 (AA 34/34 in all four themes; AAA: HC 26/26, light
  23/26, dark 25/26, colour-safe 23/26).
- **Acceptance bar**: threads resolved + checks green + MERGEABLE; visible changes land
  only with fidelity-register entries.

## Cross-lane pointers

- **Verification record**: `.agent/reports/design/aip-137-stage-a-import-verification-2026-07-19.md`
  (committed on #411; F1–F8 cured at `SHA:1665032de`, re-verified at `SHA:82505d9ec`
  with one residual: LICENCES.md §Fonts lacks the Roboto Mono row).
- **Studio sync-back list** (~16 items) accretes on the ARC channel
  `.agent/collaboration/rapid-comms/2026-07-19-aip137-pr2-verification-caracal-wakes-tunnel-and-salmon-binds-undertow.md`
  — highest now consumer-forced: localise Roboto Mono in the kit (the hub inherits the
  Google Fonts call via the imported chain); also the consuming-nextjs.md Turbopack
  note, radius role promotion (6px/16px), the dtcg/README convention-claim correction.
- **Open Stage-B design questions (Caracal's boundary)**: export re-rooting vs repo
  boundary normalisation; the runtime-token clause (`state.hover`/`state.pressed` are
  currentColor-dependent — never statically resolvable; recorded as a deliberate
  per-consumer divergence on #412's round: emission passes through, contrast resolution
  rejects).

## Session update 2026-07-20 ~07:50Z (Salmon binds Undertow, de5c10 — additive)

Post-compaction hub-lane state. Recompute live from comms/git/gh at pickup; the facts below
were verified first-hand this session.

- **#413 status: OPEN, auto-merge armed, STUCK at BEHIND (4× this session).** No conflict
  (MERGEABLE modulo up-to-date); slices 1+2 landed and pushed. The up-to-date treadmill does
  NOT converge while the Director drives micro-PRs + release bumps onto main — my CI cycle
  (~5–8 min) loses to the inter-merge interval, and auto-merge cannot self-update under
  "require branches up to date". **The ONE action that lands it**: a single
  `gh pr update-branch 413` that survives one CI cycle in a ~10-min quiet window on main —
  auto-merge then completes under the standing grant. Do NOT keep re-racing update-branch
  (burns CI, loses). Sequencing routed to Director (comms f9b7f2fc: quiet-window /
  merge-queue / prioritise) — check for the Director's answer before acting. Head at last
  update: SHA:536c2d7d2. I stopped racing at the 4th BEHIND and left the watch DISARMED at
  session close (no live PR watch to inherit).
- **§6 is 3 small PRs, not 1** (recon: 30/34 hub component files hand-rolled; 4 kit
  adopters — SiteFooter, SiteNav, ThemeSwitcher, CourseSidebar). Order + scope:
  1. **Controls** (task #10) — `.oak-input`/`.oak-select`/`.oak-btn` onto HubSearch, nav
     controls, form fields; then narrow the hub's global focus rule where controls migrate
     (the kit ring is `.oak-*`-scoped, so the global rule must survive until controls carry
     kit classes — deleting it early strands unmigrated controls). HubSearch is the exemplar:
     hard `bg-white` (breaks dark/HC) + `outline-none` on the inner input (kills the focus
     ring) — both cured by `.oak-input`.
  2. **Cards/chips/tags** — ResultCards, StandardCard, Destinations onto `.oak-card` /
     `.oak-chip` / `.oak-tag`.
  3. **Pedagogy blocks** — quiz→`.oak-quiz*`, accordion→`.oak-accordion`, callout→
     `.oak-banner`, teacher-tip→`.oak-teacher-tip`.
  Each PR off fresh main in a worktree, single-story, fidelity-register entry for visible
  shifts. Do not grow #413.
- **Two of this record's open residuals are now CURED cross-lane** (verify at pickup):
  (a) the inherited Google Fonts `@import` — Caracal's **#420** (kit Roboto Mono localisation,
  merge-armed, tip SHA:4a2f7ac05) kills it kit-side; NO hub action needed once #420 lands, and it
  also closes the Stage-A F3 LICENCES.md residual. (b) the §7 contrast-audit expected-output
  design — the owner ratified the gate as **AAA-for-HC / AA-floor-elsewhere** (Director
  broadcast 06:24Z); my Stage-A report Part 2 is the fixture. §7 (contrast-audit-in-CI) can
  now be authored against a ratified bar.
- **Claim `05c78eaa` (demos/oak-curriculum-hub/**) closed at this session's end** — the lane
  continues via this record, not the claim; a successor opens a fresh claim when starting §6.

## Session update 2026-07-20 ~08:xxZ (Harrier rides Updraft, 416a38 — additive, PR3 gate lane)

PR3-gate lane close (distinct from Salmon's hub lane above). Full self-contained record:
`.agent/state/collaboration/handoffs/2026-07-20-harrier-aip137-pr3-cycle3-full-handoff.md` —
read it first; the pointers below are hypotheses, recompute live.

- **PR3 cycle 3 (four-theme contrast gate) LANDED as PR #423** — branch
  `jimcresswell/aip-137-pr3-cycle3-four-theme-gate`, tip `SHA:bb274cc2e`, pushed, 5 commits,
  auto-merge NOT armed (unreviewed). Live gate green: 34/34 pairs × 4 themes (HC AAA, rest
  AA), matching the Stage-A report Part 2 fixture. `design-tokens-core` gained a fixpoint
  resolver + `toHexComparand` + a WCAG `WcagLevel` param; `oak-design-tokens` gained the
  second gate instance (`design-system-contrast.ts`) feeding `build.ts`, and the
  `@oaknational/oak-design-system` workspace devDependency.
- **ADR-213 §2 has a second dated amendment (2026-07-20)**: dual-gate window + post-resolution
  comparand filter + fixpoint resolution + ratified gate levels. The plan's cycle-3 todo and
  gate table are trued to the ratification.
- **Deferred to before #423 merges (exact specs in the handoff record)**: (1) the oak-eslint
  design-boundary roster edit legitimising `oak-design-tokens → oak-design-system` (ADR-041
  owes it; multi-part edit + test mirror specified); (2) the `build.ts`-vs-
  `build-css.integration.test.ts:106` duplicate live-data-proof adjudication.
- **#414 (proof-instrument exploration) CONFLICTING again** on the plan file after a clean
  resolve+push (`SHA:622acc3a4`) — the plan file is a serialization chokepoint (see napkin
  loss-scan); Director-routed, recipe in the handoff record.
- **Claim on `packages/design/design-tokens-core/**` + `packages/design/oak-design-tokens/**`
  released at close.**

## Session update 2026-07-20 ~12:30Z (Heron seeks Bluff, ef3eb0 — additive; folded by Foehn rides Flight 3e9afa under claim 8df9fbc0 at the Director's 14:40Z word)

Design-system lane (Caracal succession per comms c161344b; lane handed onward to Foehn
rides Flight 3e9afa at the owner's wrap, record
`.agent/state/collaboration/handoffs/2026-07-20-heron-aip137-design-system-lane-full-handoff.md`).

- **Stage-B concept exploration MERGED to main via PR #424** (12:17:52Z, `SHA:728974bc1`;
  Phase-8 clean). Nine review rounds, two step-backs, one Director-authorised
  generator-kill push, one owner-ruled open-set exit — the review arc itself validated
  the report's central claim (closure over open surfaces fails; dispositions attach to
  value shape). The report is the `ws-stage-b-convergence` pickup surface; the plan
  gains its pointer at doctrine slot (c).
- **Doctrine slot (c) queued** (after #414): ADR-213 §2 dated amendment (per-consumer
  projections; runtime-computed class; delivery-surface window staged in-amendment;
  falsifier severity-grading) + plan todo refinement + report pointer. Inputs recorded on
  #424's threads/comments.
- **PR #431 opened** (kit-robustness batch): oak-theme.js truncation comment +
  persisted-value membership validation + get() truthfulness under storage failure;
  consuming-nextjs.md embed escaping; CHANGELOG 1.7.1. Hub parity copy refreshes on the
  hub branch's next currency update. The motion-cascade authority item stays on the
  sync-back batch (comms 1d615a4b: components.css belt-and-braces defeats
  data-motion='full' — verified, cure choice owner/studio-gated).
  *(Fold-time truth: #431 MERGED 13:08:22Z, merge `SHA:2ef5ee3bd`, Phase-8 clean; the hub
  parity copy refreshed byte-identically on the hub branch at 13:21Z.)*
- **#420** completed as the Director's mechanical cycle (ping default during this seat's
  10:53–11:57Z harness suspension — the heartbeat-during-suspension false-liveness
  class, comms 65c1b504).
- **Team across the session**: Director Galago (Moment-2 08:01Z); Caracal→Heron,
  Salmon→Zenith→Eagle, Harrier→Moth→Goshawk, Herring (statusline), Heron→Foehn — every
  lane rotated by named succession under the owner's wrap.

## Session update 2026-07-25/26 (Triton mends Void, 9f070b — additive; MCP-128 landing lane)

First consumer of the design system from a Node/Express server. Recompute live state at
pickup; the facts below were verified first-hand this session.

- **Landed**: `SHA:a549d491d` on
  `jimcresswell/mcp-128-public-landing-page-at-production-values-oak-family-design`, pushed
  (remote ref verified equal to HEAD). No PR — the owner holds the copy, and the Director's
  standing order routes submission-surface changes through that seat before landing.
- **Doctrine**: [ADR-217](../../../../docs/architecture/architectural-decisions/217-server-rendered-html-in-the-mcp-app.md)
  records what this settled — React static markup, the design system as app-served assets
  under a closure-tested manifest, derived served-surface claims, flagged affordances whose
  machinery ships with their control. The MCP-128 delivery plan is archived.
- **The consumption shape a second server-side consumer should copy**: the design system is
  a **devDependency**; `build-scripts/copy-oak-ds.ts` declares a manifest and copies the
  runtime set into `public/oak-ds/` (gitignored), mirroring package-relative layout because
  `url()` resolves relative to each stylesheet. Wired at three points — esbuild composition
  root (ahead of its build-intent switch), the dev server, and Vitest `globalSetup` (NOT
  `setupFiles`, which run per worker and race the destination). Turbo needs the design
  system as an input to `#build` AND `#test`, or a design-system-only change replays a
  stale green.
- **Facts a successor must not re-derive**:
  - The design system does **not** resolve under plain Node without the declared
    devDependency, but a Vitest unit test passes regardless (Vite resolves workspace
    packages). Prove the runtime path, never the unit test alone.
  - `assets/logo-full-black.svg` and `assets/icons/header-underline.svg` are the page's
    artwork — the design system's own. The copies under `.agent/reports/mcp-128-landing/`
    duplicate them (the logo differs only in scale; identical 3.75 aspect ratio).
  - `oak-theme.js` auto-applies `high-contrast` on an OS contrast preference. Shipping it
    without the theme control strands a visitor on a theme the page never offered.
  - The Google Fonts CSP allowance belongs to the **widget**
    (`widget-html-content.ts` imports it), not to server-rendered pages.
  - A captured HTML export is styling evidence. The MCP-128 artefact's `Resources (6)` /
    `Tools (42)` are one stale render; the live filter serves 5 and 39.
- **Open on this lane**: the owner's copy edits; then the port contract's reviewer passes
  (design-system-expert, accessibility-expert across four themes, prose-expert); then the
  PR, coordinated with the Director. Full pickup record:
  `.agent/state/collaboration/handoffs/2026-07-25-triton-mcp-128-overnight-pause.md`.
- **Claim `68088465` retained** across the pause with its handoff pointer set.

## Session update 2026-07-26 (Lavender turns Pollen, f00cf6 — additive; MCP-128 lane tenure + owner-called handoff)

Identity row: | 2026-07-26 | Lavender turns Pollen | claude / fable-5 | `f00cf6` | MCP-128 lane
successor (Triton→Lavender), retired at owner word; claim 68088465 pending successor adoption |

- **The lane's pickup surface moved**: claim `68088465` now points at
  `handoffs/2026-07-26-lavender-mcp-128-full-react-handoff.md` (NOT Triton's overnight-pause
  record, which is superseded) with the twice-expert-reviewed design brief as its sibling.
  Read record then brief before any edit; implement, do not re-design.
- **Owner rulings in force (verbatim in the record)**: FULL REACT ("as was always the
  requirement") with BUILD-TIME static generation — the tools lists are build-time constants,
  page and app same-build in sync by construction. ADR-217 §1's no-hydration clause is
  falsified and owes a dated amendment (unstarted, in the remaining-work list).
- **State at handoff**: PR #565 all checks green incl. Sonar (owner-directed per-site accepts,
  cited rationales); head `SHA:86263c3db` pushed, tree clean; conversion slice 1 (props lift)
  landed; 36 review threads dispositioned in the record, replies held for the one-batch round
  that completes with slice 2.
- **Recompute at pickup**: PR/Sonar/Linear state drifts; the record's own loss scan names its
  bounds. MCP-182 is already substantially cured in code — verify before re-doing.

## Session update 2026-07-26 (Skipper tracks Abyss, 4144b4 — additive; MCP-128 restack lane)

- Claim `68088465` ADOPTED (Lavender→Skipper) after reading the handoff record + design
  brief end to end. The lane's work is now the OWNER-RATIFIED RESTACK: PR #565 is
  superseded by a fully linear six-PR stack off current main, authored from the #565
  branch content; at value-transfer #565 closes and its branch deletes.
- The executing plan (owner-approved this session, three review passes adjudicated in)
  lives with the session; its durable projection is the MCP-128 Linear comment trail —
  recompute live state from claims/comms/PRs at any pickup, per this record's standing
  discipline. Stack: design-system source → serve-the-DS → React page baked at build →
  hydration+theme+ADR-217 → appearance baselines (identity protocol vs the Playwright
  1.61→1.62 bump) → theme-control guards.
- **Handoff fired 2026-07-26 ~20:25Z at owner word**: #578 (stack 1/6) + #580 (stack 2/6)
  OPEN; PR-3 frozen mid-flight (uncommitted, worktree mcp-128-restack). Claim `68088465`
  retained → Schooner binds Trench (5492d7), pointer at
  `handoffs/2026-07-26-skipper-mcp-128-restack-full-handoff.md` — read end to end before
  any edit.

## Session update 2026-07-26 ~20:30Z (Schooner binds Trench, 5492d7 — additive; MCP-128 restack succession)

- Claim `68088465` ADOPTED (Skipper→Schooner, PDR-063 deliberate succession at owner word;
  registered standby 20:16Z, adoption 20:24Z, pickup broadcast event `7085f550`). Handoff
  record + Lavender record + design brief + plan file all read end to end before any edit.
- Worktree freeze VERIFIED at pickup: 64 dirty paths at HEAD d00c2475d on the PR-3 branch,
  matching the record's inventory exactly. #578 31/31 checks green; #580 CLEAN/MERGEABLE —
  both awaiting Director merge word per the freeze handshake.
- PR-3 remaining list in execution: e2e CSP hunk applied as an EDIT (three deliberate
  divergences from source verified); dormant-absence `.tsx` composed ON TOP of main's
  registration-walk refactor (6/6 green in isolation); react/react-dom → devDependencies
  landed on a zero-references probe of all three built bundles (server.js gate); tests
  project compiles; 55-file prettier sweep clean. Full gates running at write time —
  commit only on green.

## Session update 2026-07-26 ~21:56Z (Schooner binds Trench, 5492d7 — additive; PR-3 LANDED as #583)

- **PR #583 OPEN** (stack 3/6, React page baked at build): bot-authored, head
  `SHA:f09083987`, base = #580's branch. Commit landed via the queue workflow with the
  full pre-commit gate green; branch pushed under the bot; remote ref verified.
- **Review round 1 adjudicated in full BEFORE opening**: seven opus reviewers; the
  disposition ledger rides the PR body + the MCP-128 Linear comment. Ship-stoppers
  cured: turbo #build env declaration (cache could replay another deployment's baked
  localhost host — hash-identity empirically proven) and a live SC 1.4.10 reflow
  failure at 320px. Six merge-and-ticket items routed to the Director (broadcast
  f55fe01f), headline: the PR-4 island-hydration design question (42KB payload
  measurement).
- **Extra merge gate on #583** (mirrors #580's): Vercel preview probe — GET / serves
  the baked page with the PREVIEW host in canonical/snippet, never localhost.
- **F-116 third instance**: the queue guard hard-fails on the composed
  `index/head@<worktree>` claim pattern the commit SKILL prescribes; fleet cure
  applied (bare pattern, worktree in intent). Also: `git add` on already-staged
  deletions fatals under plain pathspec — split the list (existing files only).
- Remaining stack: PR-4 (hydration+theme+ADR-217 amendment), PR-5 (appearance
  baselines + identity protocol), PR-6 (theme-control guards) per the plan file;
  #565 closes at value-transfer with the 36-thread disposition comment (Director
  word). Claim `68088465` stays with this seat.
- **Ticket numbers minted (Director, 21:58Z)**: MCP-220 (PR-4 hydration shape —
  Director-adjudicated to ISLAND HYDRATION, owner-override open until PR-4's settled
  read; PR-4 authoring proceeds on it), MCP-221 (forced-colours logo), MCP-222
  (test-fake dedup), MCP-223 (a11y third depth), MCP-224 (max-warnings mechanism),
  MCP-225 (runtime-only-scripts orphan). F-116 third instance recorded on MCP-186
  with the three-seats escalation. #583's body trued to the numbers.
- **Stage-B disposition-map notes (design-system-expert review of the widget
  disclaimer, 2026-07-27, Raccoon turns Nocturne 0f6caa)**: (1) the web-CSS
  disposition map must record `measure.prose` as `emit` if MCP App views are to
  consume it — the widget's disclaimer carries `65ch` as a provenance-cited raw
  value until then (`ch` is not DTCG-2025.10-expressible; second instance of the
  declared-value-class mechanism after `runtime-computed`, bar it from the
  terminal projection). (2) The widget's app-local brand-banner classes were
  renamed `.oak-banner*` → `.oak-brand-banner*` to stop squatting the design
  system's published `.oak-banner` inline-status class ahead of the kit-binding
  lane; the DS keeps the name, with a vocabulary-review note that `banner`
  sits awkwardly beside the ARIA banner landmark (GOV.UK: notification-banner).
  The disclaimer's declarations are `.oak-hint` spelled in oak-design-tokens;
  kit-binding swap is class-for-class, comment at widget index.css names it.

## Design-showcase lane at the Thyme→Sycamore succession (2026-07-30 ~06:25Z — recompute, do not trust)

- **Seat chain**: Altair turns Infinity (`7a97a1`; their lane state lives in the 2026-07-29
  freeze events and `handoffs/2026-07-29-altair-to-thyme-design-showcase-closeout.md`) →
  Thyme weaves Hedgerow (`762020`, claim `ebb3efe2` adopted 21:08Z at owner word) →
  Sycamore herds Xylem (`028dc4`, owner-named 2026-07-30 ~06:20Z; standby at writing).
- **Landed by this seat**: PR #637 MERGED `SHA:886bb8d28` (MCP-371 slice 2, showcase page +
  identity/theme switchers + the full adjudicated review-round hardening); PR #641 MERGED
  `SHA:8675bf11e` (MCP-399 — the fleet-wide JS-disabled geometry-guard load-flake cure,
  `document.fonts.ready` on both sides; ticket Done).
- **Live objective**: MCP-372 (In Progress; owner-ruled carrier is this lane; item 4 IN as
  its own final slice by owner card ~06:10Z) then MCP-371 slices 3–5. Authoritative lane
  state: the MCP-372 ticket comments (five-slice sequencing 06:10Z; slice-1 first-hand
  grounding 06:24Z) and the succession record at
  `.agent/state/collaboration/handoffs/thyme-weaves-hedgerow-to-sycamore-herds-xylem-2026-07-30.md`
  (claim-addressed via `claims set-handoff`).
- **Worktree**: `oak-open-curriculum-ecosystem-worktrees/design-showcase-lane`, branch
  `jimcresswell/mcp-372-hub-demo-conformance-true-up-re-point-the-token-audit-at-the` at
  `5a7d4406c` (current main), ZERO commits — safe to re-cut; no unpushed work anywhere.
- **Gate not yet discharged**: the slice-1 pre-execution code-expert review (two dispatches
  died on the 06:12–06:15Z Opus 529 burst) — the successor's first act before any code.

## Design lane PAUSED at durable point (2026-07-30 ~09:55Z — recompute, do not trust)

- **Owner word** ~09:05Z card: "Pause at durable point" (supersedes the ~08:10Z
  "full arc today" TIMING; the arc SHAPE stands). Seat: Sycamore herds Xylem
  (`028dc4`), standby; claims `ebb3efe2` + `d5e70346` OPEN, both pointing at the
  pause record `handoffs/sycamore-herds-xylem-compaction-continuation-2026-07-30.md`
  — THAT record is the authoritative resume state; this entry is the pointer.
- **Durable**: slice 1 in PR #644 (OPEN by design; Sonar duplication red clears only
  at the PR-2 both-copies deletion). Kit TS-source runtime + `choice()` + toolchain
  pushed on `jimcresswell/mcp-372-kit-ts-source-runtime-and-choice-accessor` at
  `SHA:95bdfee3a` (commits `05ed8482c` hook env fix + `95bdfee3a` kit content; full
  gate suites green). Scaffold branch `checkpoint/mcp-372-pr1-lockfile-2026-07-30`
  local-only, delete after PR 1 lands.
- **Fleet-relevant, RESOLVED**: the turbo/GIT_DIR hook-env defect (intermittent,
  state-dependent — "Is a directory (os error 21)" in linked worktrees) landed on
  main via PR #650 at `SHA:094b7a145` (MCP-414 Done, owner-authorised extraction at
  this seat ~10:05-10:45Z). Resume consequence: the design branch's twin commit
  `05ed8482c` CONFLICTS at rebase — take main's version (its comments are the
  review-cured invariant form).
- **Resume order**: docs/ADR checklist → batched owner-wording card → PR 1
  open/shepherd/merge → PR 2 reworks #644 → lane rests (write-up + MCP-372/388/134
  true-ups). Linear MCP-372/MCP-371 carry matching pause comments.

## Session update 2026-08-02 (Moss calls Loam, 79b433 — additive; design-lane movement 1)

- **PR #710 MERGED** `SHA:58e5be461` (head `cc8523581`) — the owner's kit
  TS-runtime at `95bdfee3a` shepherded to main: additive merge of main
  (husky files take main's review-cured form; turbo.json keeps the
  branch-side post-#710-true comment), Sonar 4×MAJOR dataset cure at the
  generator with 3 MINOR declined on cited doctrine (ADR-153 §Membership
  Without Widening; the canonical Window augmentation), the Copilot round
  absorbed at `bf8b4d627` (kit core-boundary restriction in BOTH forms,
  probe-verified green-before/fires-after; smoke→integration reclass per
  testing-strategy's behaviour-shape test; CHANGELOG 1.8.0 entry), comment
  true-up `cc8523581`. Kit 1.8.0 with `choice()` is on main — PR-2's hard
  sequencing is satisfied.
- **Movement 2: PR #715 OPEN at `eb80d301d`** — the tier lands as
  `@oaknational/oak-design-react` (ADR-213 §3 name-at-landing; ADR-041/213
  dated amendments ride the PR): union store (choice-model + the hub's
  contrast subscription; param-2 `resolveContrastQuery` seam kept), both
  demo copies + suites deleted, hub "Page default" placeholder port with
  the red-first guard test, boundary completeness in both forms +
  `DESIGN_PACKAGE_IMPORTS` runtime tuple + the validate-boundaries design
  leg. **#644 CLOSED with pointer** at the open, per the brief. All suites
  green at the head (sibling 8/8, plugin 359/359, hub 358/358, showcase
  65/65, kit 13/13). **Round 1 ABSORBED at `235f0211a`** (opus gateway
  FINDINGS-no-must-fix + Copilot's two threads, one batch): the contrast
  mirror was probe-proven INERT under the choice model and deleted with
  its seam/tests/claims (an applied-theme accessor lands at first
  materialised need); the options-fallbacks-to-undefined delta
  implemented (floor moved to the demos' gated call sites); docblock
  boundary claim trued; table-driven pairwise boundary test added
  (allowed-edge map matches the live rules — the open
  ink→design-tokens-core edge is recorded visibly, tightening is its own
  decision); ADR-213 §4 landing promise paid; ADR-041 demos row softened
  to recorded intent. Both Copilot threads replied+resolved; disposition
  comment on the PR; Copilot re-requested at `235f0211a`. **Next at
  resume**: harvest Copilot + checks at the new head (no settle watch
  armed — compaction freeze), REST merge at full condition (4 named
  checks + zero unresolved threads + MERGEABLE + Copilot at exact head);
  then the lane's docs pass with the batched owner-wording card
  (licensing reclass, kit README headline, conventions.md — plus the
  pre-existing hub fs-warning ownership), MCP-372/388/134 true-ups at
  rest, and #709 as input. Suites at freeze: plugin 365/365, sibling
  7/7, hub 358/358, showcase 65/65. The Codex-parity execution framing
  stays PAUSED at owner gate. #709 adjudicates as lane input (fable
  adjudicator: development-lane; its branch-only value is the unbuilt
  restack tail PRs 4-6). Claim `44616c39` HELD through the compaction
  freeze (2026-08-02 afternoon, owner word; monitors stopped at the
  freeze — the resuming seat re-arms via start-right).
- Claim `44616c39` (`packages/design/**` + `demos/**`) live at this seat;
  lane comms events `2ae5943a`/`df156c7d`/`acbf47fe` carry the movement-1
  arc.
- **PR-2 pre-execution review (opus) absorbed**: PROCEED with three blocking
  revisions — union store (the hub's contrast subscription is a capability
  the showcase copy lacks), keep factory param 2 `resolveContrastQuery` (the
  ADR-078 seam), port the showcase placeholder option to the hub (else the
  choice model renders a BLANK theme select for first-time hub visitors —
  the red-first guard test pins it). Full absorption record WITH the
  re-derived config deltas rides the PR-2 branch at
  `.agent/reports/design/2026-08-02-pr2-theme-store-pre-execution-review.md`
  (worktree design-showcase-lane, branch
  `jimcresswell/mcp-372-shared-theme-store-extraction` off `58e5be461`).
  The D1/D2/D3/D5 temp file is unrecoverable (encrypted transcript); its
  applied form survives in the pause record + the absorption record.

## Session update 2026-08-02 post-compaction (Moss calls Loam, 79b433 — additive; #715 MERGED)

- **PR #715 MERGED at `SHA:81decaa3b`** (head `SHA:f7bb24c8c`, sha-pinned bot
  REST merge at full condition; Copilot's final pass clean — no comments, no
  suppressed block). `@oaknational/oak-design-react` is on main. Post-freeze
  review arc, all absorbed: **round 2** (`SHA:672bd6185`) cured the Sonar
  new-duplication red (10.1% > 3%, all 66 lines in the path-zone member
  branches) at the generator — `createDesignSiblingZones` derives each
  zone's path AND message from the sibling's package specifier; membership
  stays hand-enumerated in both builders with parity enforced by the
  pairwise test (the opus per-cycle reviewer's one revision: the comment
  must not overclaim drift-immunity) — and trued the two records Copilot's
  suppressed comment caught contradicting the round-1 mirror deletion (PR
  body; absorption record's dated round-1 supersession addendum).
  **Harvest pushes** `SHA:58dd73654` (useSyncExternalStore upstream link per
  documentation-hygiene §2; unsubscribe cleanup test — a union obligation,
  the deleted hub suite carried the only cleanup coverage) and
  `SHA:f7bb24c8c` (ink diagnostic names both permitted deps — the message
  was this-PR-authored; tsconfig matchMedia comment trued; unknown-motion
  no-op twin test in a setter-guards describe). Review-ratchet operator stop
  was declared on the PR before the final pass; it converged clean without
  firing. Suites at merge: sibling 9/9, plugin 365/365, hub 358/358,
  showcase 65/65.
- **Owner licensing ruling (2026-08-02, chat, ratified)**: the code is MIT,
  the curriculum content is OGL, the Oak brand is copyright Oak and is not
  licensed; UK spelling (licence noun / license verb) owned by the agent.
  Prior framing was "unnecessarily complex" — apply, never re-open.
  Execution shape for the docs pass (corrected same-session: root `LICENCE`
  and `LICENCE-DATA.md` ALREADY exist and state the MIT/OGL split — an
  earlier "no licence file exists" claim was a glob artefact):
  `"license": "MIT"` on design-tokens-core/ink/react/tokens, kit + assets
  keep `SEE LICENSE IN LICENCES.md` with LICENCES.md gaining the three-way
  split stated as everything-MIT-except-the-enumerated-marks. Owner also
  elaborated the constraint-surface corollary of framework/instance
  thinness (napkin capture, graduation candidate for `principles.md`
  §Separate Framework from Consumer).
- **Docs pass remaining**: three-question owner card (kit README no-build
  phrasing; conventions.md `window.OakDS`→`oakTheme` factual fix +
  "behaviourless" rephrase; hub `oak-theme-parity.test.ts` fs-read
  ownership) — prepared, surfacing at the card moment; then the docs PR off
  fresh main. B4's original full text is unrecoverable (encrypted blobs,
  session 028dc48b task a25da45f13765f578) — the licensing item above is
  the re-derived, owner-ratified replacement. MCP-372/388/134 true-ups
  BLOCKED by the Linear embargo (until 08:00 Europe/London 2026-08-10) —
  they fire at the embargo's end or owner exception. #709 stays lane input
  (fable adjudicator verdict recorded pre-freeze). Claim `44616c39` HELD.

## Session update 2026-08-02 late afternoon (Moss calls Loam, 79b433 — additive; docs pass LANDED)

- **The card was answered and the docs pass is fully merged.** Owner
  answers: kit README delegated ("decide what is sensible, describe it
  accurately"); conventions rephrase = the recommended scoped wording; hub
  fs test = "cure now in this lane". **PR #719 MERGED `SHA:b3efa938e`**
  (licensing ruling executed: MIT fields on the four pure-code design
  packages; LICENCES.md "Oak-authored code and content" section pairing
  each claim with its actual authority — root `LICENCE` for code, kit
  README §Licence for docs prose, `LICENCE-DATA.md` for API curriculum
  content — deferring per-file classification to LICENSING-MANIFEST.md;
  kit README copy-path trued to committed-vs-build-output parity;
  conventions.md `window.OakDS`→`window.oakTheme` + the behaviourless
  rephrase; conventions.md verified AUTHORED, the config's `readmeHeader`,
  with `OakDS` being the sync bundle's wrapper global). Review arc: three
  one-finding suppressed rounds absorbed, final item dispositioned under a
  declared operator stop. **PR #720 MERGED `SHA:5fef92640`** (hub guard
  consolidation): kit-asset manifest repo-scoped (hub runtime copy as a
  deliberate cross-demo row; `KIT_ASSET_COPIES`/`manifestRoot` renames;
  resolved-path failure messages), the hub parity test deleted whole on
  opus-reviewer-verified conservation (realpath-identical kit resolution;
  escape assertions subsumed by lib/inline-script.test.ts + the kit
  chain), red-proven live (one byte → validator exit 1 naming the hub
  path). Hub eslint clean at `--max-warnings 0`.
- **The docs-prose fork RESOLVED same-day, twice** (final word wins): the
  owner first answered the card with a subject split (design-docs OGL /
  general MIT — briefly landed on PR #721's first commit), then
  superseded it with the standing PROVENANCE ruling (verbatim intent:
  docs WE authored are MIT; docs already published on an existing Oak
  surface other than this repo or its apps are OGL — which explains
  curriculum content's OGL with no special case). PR #721 carries the
  provenance form across all three licence surfaces; `brand_voice.txt`
  verified first-hand as a page-marked extraction of the Oak-published
  brand voice toolkit v2.0 → OGL by provenance.
- Remaining at this seat: #709 adjudication fold (lane input); MCP
  true-ups at embargo end. Claim `44616c39` HELD. Merged local branches
  (`jimcresswell/mcp-372-design-docs-pass`,
  `jimcresswell/mcp-372-hub-parity-guard-consolidation`,
  `jimcresswell/mcp-372-shared-theme-store-extraction`) are owner-one-click
  deletions (branch -D is permission-denied at the seat).
- **#709 ADJUDICATED (2026-08-02, recorded on the PR)**: SUPERSEDE for the
  design lane (its design-consumption substance landed via ADR-217, #710,
  #715, and the merged restack PRs); RETAIN as development-lane reference
  for the unbuilt restack tail (PRs 4–6). The draft stays OPEN per the
  owner's same-day retention ruling; merge-or-supersede transfers with the
  lane that builds the tail; the tail's routing question rides the lane's
  rest report to the Director. The owner has further design work in mind
  for this lane once the current set completes (his word 2026-08-02
  ~16:10Z) — the lane rests READY, not closed.
- **PR #721 MERGED `SHA:c87d31454`** (head `SHA:05818b14a`) — the
  provenance ruling on all three licence surfaces, every claim cited
  (brand_voice.txt's source per the private-upstream clause: the
  byte-preserved capture, the 2026-07-24 commit ruling, the
  no-public-URL-recorded statement), the "this repo or its apps"
  boundary identical everywhere, manifest row 4's two decision dates
  split (July = tracking, August = licence). Review rounds: boundary
  consistency → dual-date cell → source citation → final tally under a
  declared hard stop (two residual phrasing nits recorded on the PR, no
  cure). **THE SEAT'S ROUTED BRIEF IS FULLY DISCHARGED** — lane-rest
  broadcast 2813303a carries the Director routing inputs (restack-tail
  lane question; continuation candidates; the owner's coming design
  work takes precedence). Claim `44616c39` HELD, monitors live, seat
  READY.
- **COMPACTION FREEZE (boundary 8, 2026-08-02 evening, owner word)**:
  the seat froze at rest with ZERO open work — no open PRs, no
  unresolved threads, no uncommitted worktree state (the primary's
  dirty thread record + napkin ride the Director's fold per
  no-handover-commits). Monitors stopped at the freeze (heartbeat
  first, watcher last); claim `44616c39` HELD through it. The resuming
  seat re-arms via start-right and picks up at: the OWNER'S NEXT DESIGN
  WORD (announced, pending — his word takes precedence), else Director
  routing per broadcast 2813303a; task #23 (Linear true-ups) fires at
  the 2026-08-10 embargo end.
- Estate context at this update: Director Falcon hunts Flight resumed
  post-compaction (14:28Z heartbeats); coordination branch rolled to
  `coordination/estate-2026-08-02` — this record was written on a checkout
  still at `coordination/estate-2026-07-31` and rides the Director's fold.

## Session close 2026-08-02 evening (Moss calls Loam, 79b433 — RETIRED at owner word)

- Owner word (2026-08-02 ~19:20Z): announce retirement and pass all
  responsibilities back to the Director. A deliberate stand-down of an
  at-rest lane — tracked-surfaces-only per PDR-063 §Deliberate
  succession: no in-flight state, no handoff record, no claim to adopt.
- Claim `44616c39` CLOSED (archived to the closed-claims archive; no
  retained claims). Responsibility pass to Director Magnetar binds
  Oblivion (74d914) via directed event `b8b8b691`: (1) the owner's
  announced further design work takes precedence — route a fresh lane at
  his word, seeded from this record; (2) the lane-rest routing inputs per
  broadcast `2813303a` transfer unchanged (restack-tail PRs 4–6 question
  with #709 as development-lane reference; MCP-371 slices 3–5; hub §6
  component-class PRs; release-gate items incl. the licence-field census
  pointer); (3) MCP-372/388/134 Linear true-ups at the embargo's end
  (08:00 Europe/London 2026-08-10; earlier only on a fresh express owner
  exception) — this record's session updates are the source; (4) the four
  merged local branches remain owner-one-click deletions.
- The design-showcase-lane worktree PRUNED at this closeout under the
  standing prune policy (clean tree + head `SHA:05818b14a` proven an
  ancestor of origin/main, both proofs run at closeout).
- Monitors stopped in order (heartbeat loop first, watcher last);
  heartbeat-end event `d0709711`; the retirement broadcast is the seat's
  final event — silence from 79b433 after it is retirement by owner word.
  This record and the napkin ride the Director's fold per
  no-handover-commits.

## Session update 2026-08-02 ~20:05Z (Corsair hunts Surf, 4d3282 — additive; successor seat registered, WARM PAUSE)

- Seat registered at direct owner word ("you will be taking on the design
  lane, please get up to speed, then warm pause"). Full grounding run:
  this record end to end, routing inputs `2813303a`, responsibility pass
  `b8b8b691`, live claims/comms/git/host. Team-start broadcast `0fdb373f`;
  Director ack `69ae1223`; absorption ack `cf87b001`. Standby liveness
  contract (PDR-078 §4): watcher live (F-95 green), no heartbeat cron, no
  claim.
- **SUPERSESSION (recompute at pickup, but this bound is Director-stated,
  event `69ae1223`)**: the 2813303a continuation candidates and Moss-era
  candidate routing are SUPERSEDED by a design-system completion plan the
  owner is defining in-session at the Director's seat (Magnetar binds
  Oblivion, 74d914), nearing ratification. Headline shape as relayed:
  showcase owner-rejected on visual quality; W0 census/stabilise + Demos
  Charter; W1 identity/theme contract (schema, arbitrary-N-identities
  falsifier, off-horizontal token dimension, contrast/a11y gate matrix,
  ADR-147 extension); W2 ship oak-design-react in full; W3 showcase
  rebuilt React+Tailwind expressing ALL export pages + generated
  token-reference page, owner render checkpoints; W4 consumption-paths
  family (plain HTML+CSS demo + per-engine how-tos). Hub STAYS
  Tailwind-mapped by owner word; #709 closes at ratification with a
  value-transfer pointer.
- **Activation trigger for this seat**: the ratified plan node landing +
  the owner's or Director's word; the plan file path arrives with the
  activation route. Until then the seat holds warm — no candidate work,
  no claim. The 2026-08-10 Linear true-ups (MCP-372/388/134) remain at
  the Director's seat per `b8b8b691`.

## 2026-08-02 ~20:50Z — v2-authoring inputs for the Corsair seat (Director handoff entry, Magnetar binds Oblivion 74d914)

Appended at the owner-directed focussed handoff before the Director seat's compaction
boundary. Everything below is input the v1 corpus and briefs do NOT durably carry;
the canonical set for the lane remains: the v1 plan (`6f3221e1e`), the review corpus +
adjudication (`.agent/reports/design/plan-review-2026-08-02/`, on origin at
`2423b6818`), and the activation briefs (comms events `6b0ea7f4` + `54ab2556`).

- **Owner taste evidence from the day (the wow bar's only calibration data):**
  REJECTED out of hand: the current showcase page — bare type-ramp specimens, native
  form-control switchboard, monochrome first paint ("a piece of crap… visually I would
  reject it out of hand as incompetent"; "it is a *design* showcase"). CALLED GOOD
  (with unenumerated tweaks pending): the canonical export's own pages — the Identity
  Switchboard switching a REAL lesson-page specimen ("The water cycle", masthead, nav,
  breadcrumb, brand panel), proper toggle-button identity controls. The bar phrase
  evolved in one day: "a professional designer would look at and think 'wow, that
  looks good'" → "I want to look at each and every demo and think 'wow, that looks
  *amazing*'". The export's visual language is the demonstrated taste anchor.
- **The viewing context behind the verdict:** three tabs in the owner's Chrome —
  hub dev server port 3010 (`pnpm --filter @oaknational/oak-curriculum-hub dev`),
  showcase port 3020 (`pnpm --filter @oaknational/oak-design-showcase dev`), and the
  canonical export served statically on 3030 (`python3 -m http.server 3030` from the
  export's `project/` dir). All three servers STOPPED at the Director's compaction
  boundary; restart is the commands above.
- **The export-tweaks intake is OPEN and UNENUMERATED** — the owner said "it has
  tweaks that I need made" and has not yet listed them (v1 W0.5 carries the intake;
  the list itself is future owner input, and iteration is LOCAL per his post-v1
  ruling — no Claude Design round-trips except at his instigation).
- **The lost-agreement provenance** (original pure-HTML hub assignment, unrecorded,
  drift normalised by ADR-213-era docs, deliberately superseded at his 2026-08-02
  card) is recorded in the v1 plan's W0.3 charter provenance — carry it into v2's
  charter story; the docs-adr corpus finding E56 corrects its ADR-213 attribution.
- **Seat chain at this entry:** Moss calls Loam retired at owner word 19:53Z (lane
  closeout clean, responsibilities at the Director); Corsair hunts Surf (4d3282)
  activated 20:44Z in the v2 AUTHORING phase; Director = Magnetar binds Oblivion
  (74d914, seated 17:13Z from Falcon hunts Flight). The #714 fold carries this
  file's dirty state to origin at the next fold window.

## Session update 2026-08-02 ~21:15Z (Corsair hunts Surf, 4d3282 — additive; plan v2 DRAFT-COMPLETE)

- **Plan v2 authored and validator-green** at this seat per the activation brief
  (events `6b0ea7f4` + `54ab2556`): full grounding run first (adjudication →
  all 129 corpus findings including the 31 dropped-at-cap → v1 + strategic
  sketch → ADR-213 end to end → plan-estate collision sweep → theme/DTCG
  machinery, export inventory, hub runtime all FIRST-HAND — the 81-page count,
  the five closed theme lists, the `$type` gaps, and the hub's existing
  pre-paint + store-backed selection each re-verified against the live tree).
- **Three files, UNCOMMITTED in the primary tree** (dirty tracked state riding
  the next fold/window per no-handover-commits; prettier + markdownlint +
  `validate-plan-corpus` all green, 37 plans conformant):
  1. `.agent/plans/delivery/design-system-completion.plan.md` — the v2 rewrite
     in place (same id; v1 was born-sketch, never ratified). Shape: W0 ground
     truth/stabilise/instruments/charter → W1 FIRST LIGHT (the plain demo as
     the first rendered wow checkpoint — F2's cure) → W2 identity/theme
     contract (manifest schema + emitter + generated roster + parameterised
     overlays + per-identity gates + standing falsifiers + off-horizontal +
     asset delivery + identity design authorship + re-homed ADR-147 extension)
     → W3 curated React tier on the ADR-213 §3 shape → W4 showcase rebuilt
     inside a design grammar → W5 styled demo → W6 cross-demo closure.
  2. `.agent/reports/design/plan-review-2026-08-02/dispositions.v2.md` — one
     recorded decision per corpus finding (E0–E79, F0–F7, D0–D9, X0–X30).
  3. `.agent/plans/strategic/design-system-as-configured-framework.plan.md` —
     the E65 companion edit (`serves` → TOOLS-2 with APP-1 in prose).
- **One live deviation worth the re-reviewers' eyes**: the `depends_on` edge to
  the backlog `design-system-integration` plan is BODY-carried (§Relationships)
  because the validator refuses frontmatter ids outside the anchored corpus —
  E54/E69/X2 dispositions record it.
- **Next**: the Director (resumed ~21:03Z) re-runs the fleet topology
  (resumable `wf_b02eb59a-e81`) over the v2 text; draft-complete declared by
  directed event at their live seat.
  Iteration to a zero-finding round; implementation only at the owner's word.
  Claim `953f9f8c` (the two plan files) HELD; heartbeat loop + quiet watcher
  live at this seat.

## COMPACTION FREEZE 2026-08-02 ~21:35Z (Corsair hunts Surf, 4d3282 — seat continues; resume map)

- Owner word at the boundary: prepare for compaction, make understanding
  durable (metacognition + concept-exploration + free-play + wrap lenses
  run; harvest in the napkin ~21:30Z entry), stop monitors. Seat CONTINUES
  post-compaction; silence from 4d3282 after the freeze broadcast is the
  boundary, not retirement. Claim `953f9f8c` RETAINED.
- **Resume state, exact**: the v2 draft is COMPLETE and DECLARED (event
  `ca2620b7`, Director-acked with the fleet re-review LAUNCHING at their
  seat ~21:05Z). The re-review's findings will land while this seat is
  dark — at resume: re-arm via start-right (watcher first, foreground gap
  sweep, heartbeat loop against the retained claim), then FIRST ACT = read
  the re-review round's verdicts + any Director routing, absorb, iterate
  the v2 text toward the zero-finding round. Implementation starts ONLY at
  the owner's word after that round.
- **The durable set** (all dirty-tracked on the primary, riding the
  Director's fold per no-handover-commits; prettier + markdownlint +
  validate-plan-corpus green at freeze): the v2 plan (amend-in-place,
  same id), `dispositions.v2.md` (all 129 findings), the strategic node's
  E65 companion edit, this record's ~21:15Z + this entry, the napkin
  ~21:30Z captures, and a formation letter under `.agent/experience/`.
- **Known-at-freeze bounds a successor should hold**: the four §Decision
  log seat-verdicts are THIS SEAT'S design calls (flagged to the
  re-review, not owner words); the owner's taste evidence is
  Director-relayed (thread ~20:50Z entry), not first-observed; W0.2's
  gates-green claim is deliberately UNVERIFIED (the plan makes verifying
  it W0.2's first act); no page was rendered this session — all design
  understanding is text-derived. Error signature: this seat's misses
  clustered at cross-surface contract boundaries (subcommand output
  shapes; anchored-vs-backlog id-spaces) — point external scrutiny there.
- Monitors stopped in canonical order at this freeze (heartbeat loop
  first — heartbeat-end event follows — peer-liveness poll, watcher
  last after the freeze broadcast).

## Session update 2026-08-02 ~21:55Z (Corsair hunts Surf, 4d3282 — RESUMED at owner word; v2.1 DRAFT-COMPLETE)

- **Resumed** via start-right-team + thorough at the owner's invocation;
  watcher (task re-armed, F-95 green), heartbeat loop on both surfaces
  (comms + claims), resume broadcast `efc313dd`. The round-2 verdict landed
  by Director directed event ~21:33Z: NOT a zero round — 112 rows
  (`findings.v2.json` + `adjudication.v2.md`, fresh run `wf_368f0694-4a8`).
  Round-2 character shift (recorded in the adjudication): ZERO
  false-repository-claim findings — the surviving corpus is
  specification-depth, two seat-verdict doctrine collisions, and frame
  sequencing.
- **v2.1 authored and validator-green** at this seat: full corpus read
  (all 112 rows incl. the 20 dropped-at-cap), twelve load-bearing
  repository claims re-verified first-hand BEFORE citing (notably: live
  `studio-source/` = 79 pages — v2's "81" was the archived capture tree,
  EX55; zero `@layer` in kit CSS; zero `var(--oak-` in components.css; no
  CSS→DTCG generator exists; the tier package's single-entry bundle).
  Gates at this update: prettier clean, markdownlint 0 issues,
  `validate-plan-corpus` 37 plans conformant.
- **The durable set (dirty on the primary, riding the next fold)**:
  the v2.1 plan rewrite (same id, amend-in-place),
  `dispositions.v2.1.md` (one row per round-2 finding), the dated
  corrections appendix on `dispositions.v2.md` (E47, E14/E66, E63 —
  originals left as written), this entry.
- **Structural changes a successor should know**: W1 now carries BOTH
  first-light checkpoints (plain demo + early showcase probe, FR0) with
  the design grammar pulled forward to W1.4; the prefers-contrast route
  moved from W0.2(c) into W2.4 (FR8); contrast/colour-vision modelled as
  orthogonal axes (EX28 — FLAGGED seat decision); the Oak emitter input
  defined via a CSS→DTCG projection generator (EX0/EX57); W2.0 mints the
  identity-data workspace; W3.0 gained the packaging story (EX14) and the
  Director-CONFIRMED scoped ADR-213 §3 amendment recording BOTH
  consumption shapes' roles (EX56, ruling event ~21:41Z); the charter
  became its own ADR (EX60); wow verdicts batched with whole-demo
  checkpoints (FR7); a fourth owner gate cards the "full component set"
  coverage reading at W3.0 open (FR9).
- **Next**: Director signalled; the fleet re-runs over the v2.1 text at
  their word. Iteration continues to a zero-finding round; implementation
  ONLY at the owner's word after it. Claim `953f9f8c` held; owner pacing
  directive (`d0eb5858`) binds — deliberate pace, cold pause sanctioned
  between sittings.

## Session update 2026-08-03 ~06:05Z (Corsair hunts Surf, 4d3282 — NEW owner instruction: PDS/OoE identity naming replacement PLANNED)

- **Owner instruction (2026-08-03, verbatim in the plan's §Direction)**: the
  outgoing counter-identity is replaced by "Public Digital Service, PDS, a
  clear nod to GDS" serving "the Office of Education OoE"; naming and
  identity only (the design is near perfect; GDS colour/guideline comparison
  is a later, separate act); end state = the outgoing word does not exist in
  the repo. Precedence, his words: takes precedent as soon as non-disruptive
  to other design work.
- **Plan node authored born-sketch**:
  `.agent/plans/delivery/public-digital-service-identity.plan.md` — census +
  red-first zero-word validator (W0) → identity data/code rename (W1) →
  naming universe + rendered surfaces with owner checkpoint (W2) →
  docs/plans true-up (W3, completion plan only at its next legal edit
  window) → records/archives in-place repair with dated head-notes, validator
  green (W4). First-hand census at authoring: 204 occurrences, ~77 tracked
  files, six classes; one name-bearing asset (`logo.svg`); standalone "DSE"
  occurs only in the identity label; the brand sheet's own header already
  reads "the public service". Validators green (38 plans conformant). Claim
  `6dff4c64` opened over the node.
- **Precedence encoded in the plan**: round-3 verdict absorption keeps the
  seat first; rename work fills non-disruptive windows; the frozen
  completion-plan text and review corpora are untouched until the round
  closes; execution starts at the owner's ratification word; the natural
  landing window is BEFORE completion-plan implementation (zero migration
  cost).
- Round-3 state unchanged: verdict still pending at the Director's seat.

## Session update 2026-08-03 ~06:30Z (Corsair hunts Surf, 4d3282 — PDS plan DECISION-COMPLETE, owner-approved; execution begun)

- **Owner asked for decision-complete planning** (plan mode, ~06:11Z);
  delivered via two exhaustive exploration catalogues + an adversarial
  mechanics pressure-test; **owner approved** (~06:30Z ExitPlanMode). The
  decision-complete content is TRANSCRIBED into the plan node
  (`public-digital-service-identity.plan.md`, validator-green) — that node
  is now the durable home of every decision: the full D1 mapping table
  (fiction vocabulary incl. Republic-of/demonym/FDSE-initialism rows), the
  census-driven ratchet→strict validator (per-(file,kind,case-variant)
  count contract; census self-exclusion in ratchet mode; string-constructed
  tokens; unconditional path leg), the census schema, records-repair
  mechanics (text-mode JSON, quote-elision for owner rulings), five PR
  slices with reviewer sets, and the scope boundary.
- **Two further owner cards** (~06:27Z): the tracked capture archive
  (`original-capture-2026-07-23/` — whose PRESERVATION-README carries a
  standing "never edited" byte-preservation ruling the repair-in-place
  answer predated) is REMOVED at PR5 **conditional on a committed
  value-parity audit** ("remove them only if everything of value in them
  also exists in our tracked files"); repo boundary = the git-tracked tree
  (gitignored instance state courtesy-swept; museum export bundles left).
- **Execution state**: worktree `pds-w0-census-validator` (from
  origin/main) entered; install+build running; PR1 (census generator +
  validator) is the next code act. Claims `953f9f8c` + `6dff4c64` held.
  Round-3 verdicts still pending — absorption preempts on arrival.

## Session update 2026-08-03 ~06:50Z (Corsair hunts Surf, 4d3282 — PR1 COMMITTED + PUSHED)

- **PR1 landed on its branch**: commit `a17ee7000` pushed and
  ls-remote-verified on `origin/jimcresswell/pds-identity-w0-census-validator`
  through the FULL pre-commit + pre-push chains. Contents: the
  identity-naming validator split at the meaningful seam
  (`validate-identity-naming-tokens.ts` = forbidden vocabulary + scanning;
  `validate-identity-naming-census.ts` = the count-based ratchet contract;
  entry script with zod boundary validation and symlink-safe reads), two
  colocated unit-test files (12 tests), knip entry registration, both
  package.json wirings, and the committed census (89 entries). Strict-leg
  red-proof recorded at authoring: 89 carriers / 342 occurrence lines /
  exit 1; ratchet mode verified green (exact match across 10,045 tracked
  files).
- **Owner correction absorbed mid-build** (durable in auto-memory as
  `never-trim-docs-to-fit-limits`): never trim docs to satisfy
  size/complexity limits — split at fundamentally meaningful seams. The
  trimmed TSDoc was restored in full and the split above is the applied
  cure.
- **NEXT ACTS at this seat**: (1) open the PR from the pushed branch under
  bot identity + request Copilot at open (source-touching) + dispatch the
  plan's PR1 reviewer set (code-expert + test-expert, opus,
  fan-from-brief); (2) round-3 verdict absorption STILL preempts on
  arrival; (3) PR2 (live mechanical rename) follows PR1's merge per the
  plan's D5 table. Watcher re-armed post-backstop (F-95 green); heartbeat
  loop live.

## Session update 2026-08-03 ~07:00Z (Corsair hunts Surf, 4d3282 — PR #729 OPEN under the bot; attribution violation self-caught and cured)

- **PR #729 open**: bot-authored commit `2d33851b2` (re-authored from the
  owner-attributed `a17ee7000` — a self-caught bot-identity-rule violation:
  the first commit+push rode the inherited owner credentials; cured by the
  rule's own mechanics: worktree-scoped bot config, `--amend
  --reset-author` through the FULL chain, minted-token push with an
  explicit SHA lease, forced update ls-remote-verified). Copilot requested
  at open under the bot token; code-expert + test-expert (opus) dispatched
  per the plan's PR1 reviewer row — verdicts land async at this seat.
- **Instrument notes for the class** (napkin-worthy, recorded here at
  occurrence): (a) an env prefix does NOT reach a double-quoted
  credential-helper string — single-quote so `$GH_TOKEN` expands at
  helper-run time; (b) `--force-with-lease` against a URL remote needs the
  explicit `branch:sha` form (no remote-tracking ref to lease on); (c) the
  `$?`-after-pipe lookalike bit twice more this sitting — exit codes
  in-band, UNPIPED, always.
- **PR1 residual before merge**: absorb Copilot + the two expert verdicts
  (pr-comments-resolve-and-recheck; one push per adjudicated round);
  full-condition merge at resolved+green+settled, never squash. Then PR2
  per D5. Round-3 verdicts still pending and preempt on arrival.

## COMPACTION FREEZE 2026-08-03 ~08:10Z (Corsair hunts Surf, 4d3282 — seat continues; resume map)

Owner word at the boundary: prepare for compaction, make understanding
durable (four lenses run; harvest below + napkin), stop monitors. Seat
CONTINUES post-compaction. Claims `953f9f8c` + `6dff4c64` RETAINED.

**RESUME STATE, exact — PR #729 cure round is MID-FLIGHT:**

- PR #729 open (bot-opened, Copilot requested at open), branch
  `jimcresswell/pds-identity-w0-census-validator`, remote tip `2d33851b2`
  (bot-authored). Code-expert round-1 verdict: CHANGES REQUESTED (report
  in this session's dispatch; substance mirrored in the cure list below).
  A dispatched test-expert AND the cure implementer BOTH wedged inside
  subagent Bash calls (frozen transcripts, no live process — napkin
  ~07:37Z carries the diagnostic); the implementer's work is REAL and
  survives UNCOMMITTED in the worktree `pds-w0-census-validator` on top of
  `2d33851b2`: 6 modified + 4 new files (shared
  `agent-tools/src/core/tracked-file-scan.ts` + test; identity-naming io
  module + test; both validators consuming the shared module; census
  module gains `findDuplicateKeys`).
- **Verified at freeze**: vitest 43/43 green (5 files), type-check clean.
  FIVE eslint findings remain, cures known: (1-2) io.ts:13-14 TSDoc code
  spans broken across a line-wrap — rejoin each onto one line; (3)
  `tracked-file-scan.unit.test.ts:12` no-real-io-in-tests — restructure to
  pure-decision tests (EX44 split: fs wrappers are covered by the
  validators' end-to-end runs, not unit tests); (4)
  machine-local entry:48 throw → `writeErrorLine` + `process.exit(2)`
  (mirror the identity-naming cure); (5) machine-local helpers
  test:17 `loadBlock` throw → restructure without throw.
- **Then the remaining ceremony**: prettier over touched files; the two
  validators end-to-end (identity-naming must be ratchet-green;
  machine-local must stay green); `--print-counts > f.json` must parse;
  knip-gate (register new entry files if flagged); round-2 commit under
  the bot (worktree git config ALREADY bot-scoped — verify before
  committing), full chain; bot-token push (single-quoted credential
  helper, `--force-with-lease=branch:sha` form NOT needed — fast-forward);
  PR comment dispositioning every code-expert finding (one adjudicated
  round); re-request review. Plan-text halves ALREADY landed on the
  primary (D1 wording + D3 3-column truing + decision-log row).
- **ROUND-3 VERDICT LANDED AT THE FREEZE BOUNDARY** (Director directed
  event 2026-08-03T08:10:50Z — read it in full at resume; it arrived in
  the watcher's final drain). Round 3 NOT zero (6 L + 17 D + 82 EX +
  8 FR, artefacts `findings.v3.json` + `adjudication.v3.md`, uncommitted
  on the primary). LOOP VERDICT: DIVERGING (98 → 112 → 113 while the plan
  doubled); generator = far-horizon mechanism depth. **OWNER PARTITION
  RULING ("Yes, partition the work"), which makes the next authoring pass
  v2.2 RESTRUCTURE, NOT round 4**: (1) W0+W1 (the wow-first slice) keep
  full depth and cure the near-horizon round-3 rows including three
  adjudicated-real classes — faithfulness fixes to the round-2 rulings
  (§3 amendment text, W3.0 studio-seed role assertions, axis token shape
  vs EX28 composition), a NON-AUTHORING reviewer leg on W0.7, and an
  early counter-identity taste probe (one composed page variant per
  counter-identity at W1-time, before W2.9's sunk cost); (2) W2–W6 demote
  to pointer-level stories (goal, gates, dependencies, acceptance SHAPE —
  mechanism authored at story-open under pre-execution expert review,
  PDR-132); (3) rounds-2/3 far-horizon findings CONSERVE as story-open
  inputs via a per-story pointer table (story id → corpus row ids);
  (4) the zero-finding bar scopes to the NEAR-HORIZON slice — scoped
  re-review at draft-complete, then the owner's implementation word.
  Owner's thanks relayed verbatim in the event. LESSON-CAPTURE directive:
  specify-at-depth only within the execution horizon; the finding-tally
  slope is the seam detector — sharpen the phrasing in the ledger if the
  restructure teaches more.
- **Resume priority order**: (1) read adjudication.v3 + the full directed
  event; (2) the v2.2 partition restructure (it is the lane's front
  item); (3) the PR #729 cure-round completion (five lint fixes + the
  ceremony above) fills windows. PDS plan ratified + decision-complete.
  Pacing directive stands. The wedge pattern (2 subagent Bash wedges in
  one sitting) is in the freeze broadcast for the Director.
- Monitors stopped at this freeze in canonical order (heartbeat loop
  first + heartbeat-end event, freeze broadcast, ARC tail, watcher last).
  Resume via start-right: watcher first, F-95, gap sweep, heartbeat on
  BOTH surfaces (registry + comms) against the retained claims.

## Session update 2026-08-03 ~08:30Z (Corsair hunts Surf, 4d3282 — RESUMED at owner word; OWNER GOAL STARTERS landed)

- **Ceremony**: watcher re-armed (F-95 green), heartbeat loop live on both
  retained claims (`953f9f8c`, `6dff4c64`), resume broadcast `f185662a`.
  Round-3 adjudication (`adjudication.v3.md` incl. the ratification
  addendum) read first per the freeze priority order.
- **OWNER GOAL DIRECTION for the design-system work (this sitting,
  verbatim substance — governs the v2.2 restructure):**
  1. "A HIGHLY modular design system, extending from tokens to basic
     structures to components to React components, with all the required
     inbetween steps, and each higher layer depending on the lower layers,
     but being optional, so e.g. we could create a static Astro app hosted
     on Cloudflare without issue and it would look exactly as the selected
     identity intended."
  2. "Not all apps need identity switching capability, really just the
     first two demos, we want to fully enable whitelabelling and
     flexibility whilst decreasing the cost of taking advantage of it to
     near zero, the identity switching demonstrates that, but it is not a
     core feature in its own right, low-cost design changes are the core
     feature."
  3. "We need an additional, small demo, that is designed to highlight how
     much the page layout can be altered by the choices within the design
     system for identical page structure, think <https://csszengarden.com/>
     but modern." (A fifth demo — the demo census grows beyond v2.1's
     four.)
  Plus the open question he posed to this seat: "what else are we trying
  to achieve here?" — answered in-session as a goal-architecture
  articulation (core thesis = the strategic node's configured-framework
  kernel; the three starters as properties: layer sovereignty /
  cost-of-change-is-the-product / expressive range over layout; derived
  goals: licensing split made practical, identity-№N, accessibility as
  the universality floor, quality-as-structure, design operable by
  non-designers-and-agents, demos-as-falsifier-suite). Owner card raised
  for ratification + the "first two demos" referent before the v2.2
  restructure consumes it.
- **CARD ANSWERS (same sitting, ~08:37Z)**: goal architecture RATIFIED as
  the v2.2 governing frame; landed same-sitting in the strategic node's
  new "Kernel additions (owner words, 2026-08-03)" section. Demo roles,
  his words: showcase = "the primary demo"; hub = "the first instance of
  a Claude Design app ingested and reconstructed with our tools" AND
  "yes it should gain identity switching as a valuable demo"; third +
  fourth = small proof demos (plain html/css; styled-components); fifth =
  "the css zen garden like demo". Runtime-switching pair therefore =
  showcase + hub; demo census = five. v2.2 restructure UNBLOCKED and in
  progress at this seat under the ratified frame + partition ruling.

## COLD PAUSE 2026-08-03 ~08:53Z (Corsair hunts Surf, 4d3282 — v2.2 restructure substantially landed; resume map)

Owner word: cold pause. Seat CONTINUES; claims `953f9f8c` + `6dff4c64`
RETAINED. Monitors stopped in canonical order (heartbeat loop first +
heartbeat-end, pause broadcast, watcher last).

**LANDED at this pause (uncommitted on the coordination branch, plan file
`design-system-completion.plan.md` now v2.2 at 1010 lines):**

- v2.2 header + version note (partition + ratified goal architecture + the
  owner's cost-of-change value-frame, Director relay `7b00c9e5`); Goal·In·Out
  trued (FIVE demos with per-demo kernel properties; switching = showcase +
  hub, D3/X14 resolved); Direction gains the dated 2026-08-03 pointer.
- W0/W1 REWRITTEN at full depth with the near-horizon round-3 cures absorbed:
  EX4, EX5, EX13, EX20, EX22, EX24, EX28, EX30, EX31, EX32, EX34, EX39,
  EX40, EX45, EX47, EX49, EX52, EX53, EX55, EX58, EX59, EX60, EX61, EX66,
  EX68, EX69, EX70, EX75, EX78, D1, D3, D4, D5, D6, D8, D9, D10, D16, FR0
  (new W0.10 counter-identity pre-read + taste-anchor sittings), FR1 (W0.7
  third leg: independent design-system-expert), FR2 (cells-covered), FR3
  (page-disposition owner card at W1.4), FR5 (W0.5 enumeration sitting),
  FR7 (rejected-route replacement at W1.5), L2 (named CSS-reordering
  variant), L0/L1 (in W2.0/W2.3 pointers), L4/L5 (W2 preamble sequencing +
  item-14 rendering block).
- W2–W6 DEMOTED to pointer stories; NEW W3.5 (hub switching) + W7
  (layout-range zen demo); §Story-open pointer tables (rounds 2–3 conserved);
  v2.1 far-horizon mechanism FROZEN at
  `.agent/reports/design/plan-review-2026-08-02/v2.1-far-horizon-mechanism.md`
  (new file). Closing sections trued: cross-demo acceptance (five),
  sequencing (W7 + the FR4 first-pixels gate split), decision log (+5 dated
  rows), execution seat (zero-finding bar scoped near-horizon), review
  record (+round 3 + v2.2 entries).
- Strategic node: §Kernel additions landed (three properties verbatim, demo
  roles verbatim, value-frame, derived goals). Thread + comms: ratification
  card answers recorded; Director acks `c4229344` + `940faca4`.

**REMAINING to draft-complete (resume order):**

1. `dispositions.v2.2.md` — the round-3 ledger: every row a recorded
   decision (absorbed-with-landing / conserved-via-table / rejected-with-
   ground). The absorbed list above + the far tables are the input; EX
   rows not yet dispositioned anywhere: none known — sweep the TSV
   (`scratchpad/v3-row-map.tsv` regenerable from findings.v3.json).
2. Residual small edits: §Quality bar (EX47 screenshot-baseline-at-PASS as
   rule 6; D1 batching on rule 4; EX65 standing control note; register
   renamed wow-verdict per EX53); §Relationships (EX57 outcome-not-pointer;
   EX62 two governance-doc obligations; EX67/EX77 narrowed + re-checked;
   EX73 two ADR-213 §4 amendment rows); pointer-table additions (W4.2 +=
   EX24, EX28; W4.4 += EX5; new row W5.1 = EX75, EX52; W3.0 += EX56
   decidable seed-guard choice + EX22 card wording; W2.5 note EX66 moved to
   W0.6).
3. Gates over the plan: prettier/markdownlint + `repo-validators:check`
   (plan-corpus validator).
4. SCOPED near-horizon re-review (W0+W1 lenses only, fraction of fleet
   cost) to zero findings, then the owner's implementation word.
5. NOTE for PR #729's ceremony: v2.2 changed outgoing-name counts in the
   plan AND the frozen v2.1 report adds occurrences — the identity census
   REGENERATES against merge-time main before the ratchet merges (add to
   the PR's pre-merge list). PR #729 cure round itself unchanged (five lint
   fixes + ceremony, per the ~08:10Z freeze entry).

## 2026-08-05 (Petrel holds Turbulence, a0892f — Director): strategic node RATIFIED; resume map partially discharged

Owner word 2026-08-05 (design-lane reopening sitting): the strategic node
`design-system-as-configured-framework` is RATIFIED — stamp landed. The
cold-pause resume map above now reads:

1. `dispositions.v2.2.md` — verdict: NEVER AUTHORED (verified first-hand:
   absent from filesystem, all branches, all history; this map is the
   record). Honestly recomputable — both inputs survive; the per-row
   ledger FOLDS INTO item 4's scoped re-review, recorded in the plan's
   §Review record. No standalone authoring act remains.
2. Residual small edits — LANDED 2026-08-05 (ratification-and-truings PR):
   Quality bar rule 6, the EX65 standing control note, EX53 register
   naming, and D1 batching; §Relationships EX57/EX62/EX67/EX73/EX77;
   pointer-table
   additions (W4.2 += EX24+EX28, W4.4 += EX5, new W5.1 row, W3.0 += EX22).
   Also landed: §Execution seat re-pointed (Corsair's seat closed at the
   clear-run; executor named at the implementation word), and the owner's
   2026-08-05 hub-search-must-work word recorded (Decision log + W0.9).
3. Gates — ride the same PR's hook chain.
4. SCOPED near-horizon re-review to zero — STILL OWED (now also carries
   the per-row ledger); then the owner's implementation word.
5. #729 census regeneration — CONFIRMED QUANTITATIVELY 2026-08-05: plan
   file live count 4 vs census 8; the frozen v2.1 report carries 1
   occurrence and is absent from the census. Merging without regeneration
   reds `repo-validators:check` on main.

## Previous-team handover 2026-08-05 (Moss calls Loam, 79b433 — dated context, owner-convened)

The owner convened the previous design team (Corsair, Moss, Magnetar) to
hand their understanding to the live team (Director Petrel, design seat
Saffron), acknowledging the repo and intent have moved on. This section is
the MOSS slice: context frozen at this seat's retirement (2026-08-02
~19:52Z — BEFORE the Corsair v2/PDS arc above). Everything below is dated
to that instant; on any conflict the live map and the later layers win.
The recorded layer (session updates above, PR bodies, shared memory) is
assumed absorbed — this section carries only what those records do not.

### Review-arc operational texture (lane PRs #710–#721)

- Copilot's suppressed-comments block (in the review BODY, distinct from
  inline threads) caught three real defects on this lane, all one class:
  records lagging decisions (PR body/absorption claims drifting from the
  diff). Harvest EVERY review body's suppressed block; the terminal review
  state that ended the arcs was "no claim without citation, no citation
  duplicated".
- Sonar's new-duplication gate fires on generator-shaped code; the cure
  that settled it was at the generator (`createDesignSiblingZones` deriving
  each zone's path and message from the sibling specifier). The reviewer's
  one revision is a standing constraint: comments must not claim more
  invariance than the mechanism enforces — membership parity there is
  TEST-enforced, not derivation-enforced.
- Both docs arcs (#719, #721) closed under a DECLARED operator stop with
  residual phrasing nits recorded on the PR and deliberately uncured; the
  convergence discipline held because rounds shrank monotonically.
- Worked trap-cures: REST review-author filters need
  `copilot-pull-request-reviewer[bot]` (the bare name matches nothing); a
  compound command mixing `git push` with a later `gh api graphql -f`
  trips the hook's history-destruction substring policy — split the
  commands, never bypass; a stale hub `.next` cache breaks pre-commit
  type-check after branch switches (gitignored derived cache — remove and
  retry); any dirty memory file failing markdownlint gates EVERY primary
  push — fix at occurrence, whoever authored it.

### Design-surface "why" texture (the what is in code and docs; the why is thin)

- The kit-asset manifest (showcase `tools/`) is repo-scoped ON PURPOSE: it
  carries the hub's `oak-theme.js` serving copy, so the whole copy-set has
  one guard home. The hub's own parity test was deleted WHOLE on
  reviewer-verified conservation (realpath-identical kit resolution in
  both demos; escape assertions live in the hub's inline-script contract
  tests plus the kit chain). A new demo taking kit copies registers rows
  there, not a new guard.
- Armed-not-owed trigger, easy to misread as owed-now: the `.design-sync`
  NOTES.md "no React components" line rewrites WHEN the design-sync
  adopts the react tier — the binding condition is adoption, not time.
- The licensing surfaces are a deliberate citation graph: LICENCES.md
  §Oak-authored defers per-file classification to LICENSING-MANIFEST.md;
  the kit README §Licence is the system's own statement; root LICENCE and
  LICENCE-DATA.md are the authorities. Touching any one means re-checking
  its cited pairs. The brand_voice.txt provenance row is deliberately in
  verified-record form ("no public upstream URL is recorded") — an
  epistemic-honesty choice, not a gap; do not "fix" it into an existence
  claim.
- oak-design-react theme-store test intent: the unsubscribe-cleanup test's
  RETAINED second listener is what proves the notifier fired — deleting it
  as redundant silently weakens the union obligation; the setter-guards
  no-op twins (theme AND motion) are contract pins, not duplication.

### Owner-preference grammar as experienced first-hand

- The licence map was ratified THROUGH the constraint-surface frame:
  general framework, Oak instance as thin config, the constrained-for-
  external-use surface kept as minimal as possible. He priced the design
  structure by that frame; new structure presented in it settles faster.
- His two same-day docs-prose supersessions were not churn — each step was
  a cleaner generalisation (simple model → subject split → provenance
  split). Presenting the generalising form is what settles a fork.

### Bounds and availability

This seat knows NOTHING after 2026-08-02 ~19:52Z — the Corsair v2/v2.2 and
PDS arcs, PR #729, MCP-128's move, and this week's intent are all outside
its context; the live map wins on any conflict. The seat is live this
sitting for Q&A, claimless, no source work; route pulls through the
Director. This edit rides the next coordination window per
no-handover-commits.

## Session update 2026-08-07 ~20:50Z (Civet spins Cavern, 054f5e — additive; lane adopted at deliberate succession)

- **Succession executed** (Saffron guards Hedgerow 8a4280 → this seat): owner named the
  successor in-session at Saffron's seat; Saffron froze the lane to the handoff record
  (machine-local per the operating model:
  `.agent/state/collaboration/handoffs/645b9e0b-design-lane-saffron-to-civet.md` — the
  deep state at this boundary); Director ACTIVATE word 20:46Z (directed event). Claim
  `645b9e0b` adopted via `claims adopt` after the record was read end to end; active-seat
  liveness pair live (watcher heartbeat-excluded + F-75 diff-poll + 240s two-leg
  heartbeat loop).
- **Queue at adoption (recompute at any later pickup)**: merge #820 (merge-bot F-112
  push-path cure, live-fire proven) + #821 (suppressed-round docs cures) + #822
  (design-lane-review-debt plan node) at full condition → #814 DDR cure round 2 (12
  findings, comment 5218785245, delegated decisions in the handoff record §3 — do not
  re-open) → slice 2 ddr-graph validator → slice 3 completion-plan §Review record truing
  → slice 4 (#787 merge; #806 OWNER-CARD only, review-gated; #737 cure + re-request
  mantagen). The SEALED two-act payload (combined window `a729c466` + capability-floor
  rewrite) opens ONLY at the owner's work-word.
- **Window posture binding this tenure**: owner away ~10h from 20:30Z; pace SLOWLY;
  pre-approval lifts no standing rule; constitutively-owner items hold to morning with a
  card; blocks route to the Director (Plover lifts Troposphere b10c37). Owner word to
  this seat (2026-08-07, in-session): full Cricket suite at all major decision points,
  tally rows at occurrence.

## Session update 2026-08-08 ~01:35Z (Civet spins Cavern, 054f5e — additive; the review-debt queue is DISCHARGED)

- **Seven merges this window, every one at a Director-granted recomputed
  boundary** (recounts on each PR): #820 (merge-bot F-112 push cure), #821
  (suppressed-round plan cures), #822 (the review-debt plan node), #814 (the
  DDR corpus — four-round docs-adr convergence, 12→2→1→1-line→LAND; ADR-221
  §3 minted identities, the estate's first), #823 (the F-156 read/write
  identity split; register CURED at the merge moment), #824 (the completion
  plan's §Review record trued through round 2 + the sealed a729c466 mandate),
  #787 (the formation letter; three threads adjudicated). #737 dispositioned
  to the human reviewer's clock (cure + body re-pin + re-request); #806's
  owner card held at the Director's seat for the morning.
- **Remaining on the lane**: slice 2 (the ddr-graph edge validator) fully
  specified with FIVE named acceptance items in the session task register and
  the #820/#823 records — its own sitting. THE SEALED PAYLOAD (combined
  window a729c466 cures + capability-floor rewrite) remains sealed; it opens
  at the OWNER'S design work-word, and the completion plan's §Review record
  now carries the true opening state.
- **Morning-board items from this window** (at the Director's seat): #806
  card; the 89c1a2be9 stray-empty-commit drop (owner's call); the
  QUOTA-SKIPPED command-mergeability design question; the 77/100 agent-task
  run-window constraint; the ADR-221 §3 estate-wide adoption gap.

## COMPACTION FREEZE 2026-08-08 ~09:10Z (Civet spins Cavern, 054f5e — seat continues; THE PAYLOAD IS UNSEALED; resume map)

- **OWNER WORD at this seat** (2026-08-08 morning, verbatim substance):
  "Time to unseal, time to make progress" — the a729c466 payload is OPEN.
  Suggested next steps routed to the Director (event `7388cc9a`): Act 1 the
  combined window first (primary-sources-first authoring sitting → nine
  cures CLASS-WIDE + W0.5 fold, one docs PR → scoped delta-verify → at the
  clean close the zero bar is met and the OWNER'S IMPLEMENTATION WORD cards
  from the Director's seat → W0/W1 first light); Act 2 the capability-floor
  rewrite to the v2 final shape after (or parallel at Director routing);
  slice 2 (edge validator, five acceptance items) interleaves.
- **RESUME STATE, exact**: claim `645b9e0b` RETAINED (seat continues;
  silence from 054f5e after the freeze broadcast is the boundary, not
  retirement). The review-debt queue is fully discharged (seven merges
  2026-08-07/08: #820/#821/#822/#814/#823/#824/#787 — recounts on each);
  #737 at the human reviewer's clock; #806 + four design questions on the
  Director's morning board. At resume: re-arm via start-right (watcher
  first, F-95, gap sweep, heartbeat pair against the retained claim), then
  FIRST ACT = read the Director's routing answer to `7388cc9a`; if the
  window's authoring sitting is this seat's, begin at the PRIMARY sources
  (the 2026-08-06 ~06:55Z round-2 adjudication event, mandate `a729c466`,
  W0.5 confirmed set event `0d5afca6`, the plan's §Review record) — never
  this seat's summaries.
- **Known-at-freeze bounds**: the payload substance is record-derived at
  this seat (no first-hand re-read since warm-up); PR states dated to their
  merge moments; the night's per-PR grants were WINDOW-SCOPED and do not
  carry forward — post-window merges revert to standing practice unless the
  Director re-rules. Dirty primary surfaces (napkin, frictions register,
  this record, cricket tally) ride the Director's fold per
  no-handover-commits.

- **ROUTE ANSWERED BEFORE THE FREEZE COMPLETED** (Director broadcast
  2026-08-08 09:07:27Z): the proposal is adopted — Act 1's authoring
  sitting is THIS seat's at post-compaction resume (claim `645b9e0b`, no
  alternative named), primary-sources-first; delta-verify same-reviewer
  opus; the implementation-word card from the Director's seat at the clean
  close; Act 2 sequenced after; slice 2 interleaves. Same broadcast window
  (09:07:25Z rulings record): the stray 89c1a2be9 drops at the authorised
  fold; #806 CLOSED with adjudication; queue-cleanup plan ratified;
  longitudinal node to archive. The resume's first act is therefore the
  Act-1 sitting directly.

## Session update 2026-08-08 ~11:10Z (Civet spins Cavern, 054f5e — ACT 1 EXECUTED to the zero bar; PR #828 open)

- **The a729c466 combined window is EXECUTED and CLEAN**: at the owner's
  unseal word and the Director's ROUTE, this seat re-read the four primary
  sources first-hand, ran the full Cricket quartet ×2 (5:3 → Director
  PROCEED, all dissents dissolved on primaries), enumerated every touched
  invariant via an 11-leg read-only workflow (`wf_45de2e3c-68c`), authored
  the nine cures CLASS-WIDE + the confirmed W0.5 fold (ten items, three
  instruments, two riders; W2.11/W4.8 minted at pointer grade), and closed
  with the mandated delta-verify (`wf_034bd28a-b2f` + scoped re-verify):
  round 1 six blockers all cured in-window, round 2 CLEAN, slope 6 → 0.
  THE ZERO BAR IS MET.
- **PR #828** (`jimcresswell/design-combined-window-cures`, commit
  `b82e44192`, bot-pushed/bot-opened, full gate green incl. the
  identity-naming ratchet): the plan + the durable round-2 record
  `re-review-2026-08-06.md`. Copilot requested as selective bonus. Merge
  shepherds under standing full-condition practice at settle.
- **NEXT GATE: the owner's IMPLEMENTATION WORD**, carded from the
  Director's seat (clean-close report: event `6c0fbc61`). At his word:
  W0/W1 first light. Interleave during the wait: slice 2 (the ddr-graph
  edge validator, five acceptance items) after #828 settles.
- **Process record, honest**: the delta-verify's class-5 catch was this
  seat's own splice of the item-2 rule into the DATED 2026-08-02
  taste-calibration record — reverted; dated records stay untouched. The
  napkin gained the day's one-generator family (fabricated event-id tail,
  assumed wall-clock in comms filters, piped-exit false green) with the
  mechanical cure: absolute values enter commands/records only by
  command-substitution or visible copy. Routed residue at the Director's
  board: pointer-table rows for W5.4/W5.5/W6.3/W6.4; "frontmatter gate 3"
  numbering at three sites; the comms CLI's missing --in-response-to
  antecedent check.

## Session update 2026-08-08 ~13:50Z (Civet spins Cavern, 054f5e — #828 MERGED; FIRST LIGHT IS OPEN)

- **#828 MERGED** (merge commit `7ecfc187c`, sha-pinned REST at the granted
  head `cddd87cad`; recount comment quotes the grant event `6d3c9726`).
  Boundary recomputed at the moment: rollup SUCCESS incl. SonarCloud by
  name, 0 unresolved threads, 0 body tally, >2h quiet. The Copilot round
  (nine findings incl. three suppressed) was cured in one push and fully
  dispositioned before the grant. Remote branch deleted post-merge.
- **THE IMPLEMENTATION WORD IS GIVEN** (owner card, Director event
  `a080375f`): W0/W1 first light opens ON THIS MERGE. The
  production-validation leg (2b4e5ce6) binds into W0/W1's DoD at
  authoring time when design work first lands on service surfaces.
- **First-light opening, per the plan's own prescription**: W0.2(a) —
  verify every existing design gate FIRST-HAND with a dated baseline
  snapshot at W0 start; red gates fixed before anything else. W0.1 census
  - W0.3 charter proceed in parallel per §Sequencing. The provisional
  first-pixels render gates on W0.2(a) + W0.7 v0 + W0.9 + the W0.5
  blocking tweaks. Slice 2 (edge validator) re-slots at seat routing.
- Also on the stream: owner ruled #766 merges as research docs (rides the
  plans-truing sweep route; not this lane's).

## Session update 2026-08-08 ~14:2xZ (Civet spins Cavern, 054f5e — FIRST LIGHT'S FIRST DELIVERABLE ON PR #829)

- **W0.2(a) EXECUTED end to end at first light's open**: ten design gates
  verified first-hand at `7ecfc187c` (dependency-aware turbo, forced fresh
  — zero cache echoes; both showcase Playwright legs 15+22 passed after
  the cold-machine chromium install). ZERO RED GATES — the dated baseline
  `w0-gate-baseline-2026-08-08.md` is on **PR #829** (commit `226f3711f`,
  Copilot requested selectively). Three environment artefacts recorded and
  separated (run-shape false reds without dependency builds; Playwright
  install; transient ECONNREFUSED under broken builds only).
- **First-pixels path state**: W0.2(a) leg GREEN. Remaining legs: W0.7 v0
  (rubric + register mint), W0.9 (hub pre-read — NEEDS the hub search env
  credentials per the owner's 2026-08-05 word; owner-side item for a card
  at its action moment), and the W0.5 blocking tweaks on the chosen pages
  (land in W1.2's authoring). W0.1 census + W0.3 charter proceed in
  parallel. Slice 2 re-slots between stories.

## COMPACTION FREEZE 2026-08-08 ~14:05Z (Civet spins Cavern, 054f5e — seat continues; FIRST LIGHT IS RUNNING; resume map)

- **THE DAY'S ARC, CLOSED**: owner unseal word → Act-1 combined window
  authored class-wide + W0.5 fold → delta-verify 6→0 CLEAN → Cricket 5:3
  Director-dissolved → **#828 MERGED** at the granted pin (`7ecfc187c`) →
  **the owner's IMPLEMENTATION WORD** (event `a080375f`) → FIRST LIGHT
  OPEN → **W0.2(a) executed** (ten gates first-hand, ZERO RED) → its
  baseline on **PR #829** (`226f3711f`, Copilot requested, checks green
  at freeze with 0 failures/19 contexts).
- **RESUME STATE, exact**: claim `645b9e0b` RETAINED. At resume: re-arm
  via start-right (watcher first, F-95, gap sweep, heartbeat pair on the
  retained claim — heartbeat branch label = the live story's branch).
  FIRST ACT: shepherd **#829** to merge — harvest the Copilot round
  (bodies incl. suppressed), disposition, standing full-condition merge;
  if the claude leg quota-skips again the settle read repeats the #828
  shape → per-PR Director grant (the recorded interim; #828's grant
  `6d3c9726` is the worked instance, NEVER a precedent to skip the
  merge-decision truing story). THEN the next first-light sitting at seat
  routing: **W0.7 v0** (rubric + wow-verdict register mint — the register
  absorbs the #784 pre-registered verdicts under the optional-field arm)
  with W0.1 census + W0.3 charter ADR available as parallel sittings;
  slice 2 (edge validator, five acceptance items) re-slots between
  stories; Act 2 (capability-floor rewrite, #783 floor) schedulable at
  routing. **W0.9 needs the hub search env credentials** (owner word
  2026-08-05) — an owner-side item whose card issues from the Director's
  seat at its action moment; it gates a first-pixels leg.
- **Known-at-freeze bounds**: #829 unmerged (its round un-harvested);
  the Director was ALSO compacting at this freeze (their records pushed
  `4d5d99f36`) — expect their resume lag on routed items. Worktrees:
  `first-light-w02a` is LIVE (#829's branch); `design-combined-window`'s
  branch is merged (prunable under the provably-safe policy at a quiet
  moment). Dirty primary surfaces (napkin, this record incl. the
  Director's one-character MD004 peer-repair at line 1299, cricket tally)
  ride the next fold per no-handover-commits. The per-PR grants of
  2026-08-07/08 are ALL window/PR-scoped — none carries forward.

## Session update 2026-08-08 ~14:50Z (Civet spins Cavern, 054f5e — resume; #829 MERGED; the owner's four-PR sweep is COMPLETE)

- **Post-compaction resume ran the full ceremony**: watcher re-armed +
  F-95 attested, F-75 delta poll re-armed, heartbeat pair on the retained
  claim (intent `pr-merge-sweep`), gap sweep absorbed. The Director's
  merge-sweep ROUTE (`6219f078`, owner word "I want all of those PRs
  merged safely and properly") was acknowledged, then SUPERSEDED at
  `8a8e48b7` (owner word ~14:3xZ): #737 was owner-merged directly at
  14:15Z (`67d23056e` — the standing CHANGES_REQUESTED was from Matt's
  AGENTS, not Matt; provenance lesson estate-wide), and the owner named
  the DIRECTOR executor for #783/#784. This seat's scope narrowed to
  #829 then first light.
- **#829 round 1, first-hand**: Copilot returned two REAL findings
  (no suppressed block). Both CONFIRMED: (1) method not independently
  reproducible (`--filter=...` abbreviation); (2) gate inventory
  incomplete — re-enumeration from package scripts caught THREE absent
  test suites (`design-tokens-core`, `oak-design-system` as Copilot
  named, plus `oak-design-ink`). Cure `0c0c6f659`, one push: the three
  suites ran forced at the pinned sha ALL GREEN (97+13+1 tests), table
  completed to THIRTEEN gates with its derivation basis stated
  (`build`/`test`/`validate*` scripts across `packages/design/*` + both
  rendering consumers; `oak-design-assets` explicitly zero-script; lint
  excluded as the static-checks CI leg), exact commands recorded
  verbatim. Threads 2/2 resolved, tally posted.
- **#829 MERGED** at the Director's grant (`a088a325`, recomputed
  14:47Z): boundary re-verified at the merge moment, sha-pinned bot REST
  merge at `0c0c6f659`, merge commit `4e1bb0fc3`, recount comment quotes
  the grant, branch auto-deleted. **The four-PR sweep is COMPLETE**:
  #737 (owner) → #783 (`b888b732b`) + #784 (`1bfbb19d6`, both Director)
  → #829 (this seat). W0.2(a) is landed as main's dated thirteen-gate
  zero-red baseline; the first-pixels W0.2(a) leg is GREEN.
- **Inbound durable routings absorbed**: #783 ratification inputs
  (row-2 obligation wording; row-to-story enforcement wiring) → this
  seat's Act-2 ratification pass; #784 addendum (upstream pin, delta-E
  formula, exemption-aware attestation, editable-slides data boundary)
  → the register migration + story cards, in the merged record itself.
- **NOW OPEN: the W0.7 v0 sitting** (rubric + graded calibration with
  enumerated fixture corpus + wow-verdict register mint on the
  `packages/libs/fidelity-review/src/fidelity-register.ts` precedent (moved from the hub tools at the 2026-08-09 consolidation) —
  zod-at-the-boundary, owner-editable JSON, vitest parse test SAME PR
  per schemas-from-day-1). Pre-sitting reads done: W0.7/W0.10 story
  text, the precedent trio, studio-source pages enumerated (3 composed
  export pages). Sitting-frame Cricket (quartet ×2) runs at the shape
  decision. Still to read at the sitting: the rejected-page identity +
  the #784 pre-registered verdicts (both now ON MAIN in
  design-sitting-records-2026-08-05.md).

## Session update 2026-08-08 ~15:30Z (Civet spins Cavern, 054f5e — W0.7 PR-A OPEN at #830)

- **The W0.7 sitting cleared its gate**: Cricket quartet ×2 at the frame,
  6:2 non-unanimous → routed with resolutions → Director ruling
  `0cfdd701` PROCEED (both dissents verified-dissolved at their seat; one
  tightening adopted into the rubric: EVERY expert leg on opus).
- **PR-A built, pre-reviewed, and OPEN: #830** (branch
  `jimcresswell/design-w07-rubric-register`, worktree `w07-instrument`).
  Lands: rubric v0 (seven criteria; ordered-calm verbatim;
  FAIL-blocks-render + rule-3 routing; Oak-only sections, W0.10 mints the
  rest), the wow-verdict register (zod boundary on the hub precedent;
  checkpoint/pre-read arm mechanical; local ParseResult because ADR-213
  §4 keeps the kit trunk-neutral — the design-boundary lint refused
  @oaknational/result; seeded with the migrated Verdict-1 row), unit
  suite (28 tests), minting record (four #784 inheritances + corpus
  derivation). Pre-PR reviews (code/test/config experts, opus): ~15
  findings cured — JSON-import test shape (no IO), unit-class rename,
  message-bearing expect-guards, partial-leg rejection arm, knip scope,
  vitest tree catch-all (mergeConfig CONCATENATES — a scoped glob leaves
  a silent-skip hazard), identity-ratchet rewording. Lockfile delta
  beyond three zod lines = pinned pnpm 11.20.0's deterministic
  re-resolution, A/B-verified and named in the commit.
- **In flight at record time**: CodeQL Analyze(actions) failed transient
  (ECONNRESET at bundle download) — re-run armed on run conclusion;
  Copilot requested via the MCP tool (REST endpoint silently drops the
  handle — napkin note). Composite settle watch running; disposition
  round then signal-ready per the #828/#829 flow.
- **Routed residue on the Director's board**: design-boundary
  relative-path zones target src/** only (createDesignBoundaryRules,
  packages/core/oak-eslint) — design-review/ trees get the
  package-specifier arm only.
- **NEXT after #830 merges**: PR-B — the blind three-leg graded
  calibration (fixture corpus per the minting record: oak +
  EMC²/creature front pages must-pass with the motion-scope bound
  stated; rejected showcase root + three degraded oak-page variants
  must-fail; the PDS-identity front page held out, unmutated must-pass +
  novel messy-arrangement mutation must-fail); BOTH expert legs on opus
  per the ruling. Then W0.1 census / W0.3 charter at routing; W0.9 at
  the owner's browse.

## COMPACTION FREEZE 2 — 2026-08-08 ~16:24Z (Civet spins Cavern, 054f5e — seat continues; #830 re-cut pushed and dispositioned; resume map)

- **THE WINDOW'S ARC**: resume → four-PR sweep completed (#829 merged at
  the granted pin, 4e1bb0fc3) → W0.7 sitting (Cricket 6:2 → PROCEED with
  the all-legs-opus tightening) → PR-A built, pre-reviewed (three opus
  experts), #830 OPENED → the friction-ratchet fired on the kit home →
  assumptions-expert split recommendation → Director ADOPT ruling →
  **the re-cut executed and pushed** (mint `67cf5da63` → re-home
  `463097a8c`): parser + suites at
  agent-tools/src/validators/wow-verdict-register/ (estate Result, 25
  tests incl. byte-level integration proof), rubric/records/data at
  docs/design/design-review/ (frontmatter + README pointer), six kit
  config hunks + lockfile churn REVERTED (zero delta vs main). The
  Copilot round (3 inline + 1 suppressed) ALL ADOPTED in the same push
  — closed rosters, doc-hygiene pointer, exhaustive per-criterion legs,
  and the instrument-blocked third row class (schema extension recorded
  in the minting record). Threads 3/3 resolved, tally posted.
- **n=2 MODE was ACTIVE at freeze** (PDR-082; ARC channel
  2026-08-08-next-steps-plover-…-civet-…; both heartbeats down by
  declared intent; mutual mode confirmed by the Director 16:07Z). The
  Director's 16:18Z entry ADOPTED the lane sequencing and stands by for
  the #830 ready signal.
- **SHA NAMING CORRECTION for the record**: the #830 mint commit is
  `67cf5da63`; `0c0c6f659` is #829's cure commit — earlier narration
  conflated them.
- **RESUME MAP, exact (owner word: restart ALL monitors post-compaction)**:
  claim `645b9e0b` RETAINED. At resume: (1) canonical watcher FIRST +
  F-95 assert; (2) gap sweep — canonical buffer AND the ARC channel file
  (read new entries end-to-end; the half-armed-watcher lesson: sweep the
  watcher buffer at every turn boundary); (3) F-75 delta poll; (4)
  heartbeat pair on the retained claim UNLESS n=2 is re-confirmed live
  with the Director (then heartbeats stay down by PDR-082 and the ARC
  tail Monitor re-arms instead — re-arm it either way if the channel is
  still open). FIRST ACT: **#830 ready signal** — recompute checks at
  `463097a8c` (they were running at freeze; claude auth was renewed by
  the owner mid-window so the claude review leg may materialise);
  at green + threads 0 + Sonar settled, signal READY (directed,
  canonical) — the Director recounts and grants; merge sha-pinned as
  before. THEN: **PR-B** — the blind three-leg graded calibration
  (corpus per the minting record's derivation note; BOTH expert legs on
  opus per ruling `0cfdd701`; legs blind to intended labels; record
  names rubric revision v0). ADOPTED SEQUENCING AFTER PR-B: W0.1 census
  sitting (+ W0.3 charter parallel) → slice 2 in review waits → W0.9 at
  the credentials-card discharge (the Director issues that card when
  PR-B enters review). Worktrees: `w07-instrument` LIVE (#830);
  `first-light-w02a` merged (prunable provably-safe). Dirty
  coordination-branch surfaces (napkin, this record, cricket tally with
  both of today's runs) ride the next fold per no-handover-commits.

## Session update 2026-08-08 17:21Z (Civet spins Cavern, 054f5e — post-compaction resume 2; #830 MERGED)

- **Resume ran the freeze map exactly**: canonical watcher first (Monitor,
  F-95 green), gap sweep via cursor replay (3 events — the Director's n=2
  heartbeat-end 16:07Z and their own freeze 16:23:44Z; nothing else moved
  while both seats were dark), F-75 delta poll re-armed (fresh baseline),
  ARC tail re-armed. The heartbeat pair was armed per the map's
  Director-dark arm, then STOOD DOWN minutes later when the Director's
  17:18:46Z resume entry re-confirmed n=2 live (mode recomputed at their
  seat: no third seat; one corrected-arm heartbeat cycle ran in the
  window — mode artefact, disclosed on the ARC channel). One first-tick
  catch: `comms send` REJECTS `--created-at` (the option is `--now`) —
  the loop's loud-failure design surfaced it immediately; napkin carries
  the rule-text drift note.
- **#830 MERGED at `8840c3c8f`** (mergedAt 17:20:14Z): the Director
  resumed first, ran the recount first-hand, and issued grant `cb6a0cd3`
  (ARC 17:18:46Z + directed 17:19:25Z); this seat recounted at the
  executing boundary (head unmoved at the pin `463097a8c`, 19/19 checks
  SUCCESS, 0 unresolved threads, MERGEABLE) and executed the standing
  sha-pinned bot REST merge. Branch auto-deleted; recount comment
  `5227247465` quotes the grant. **The W0.7 instrument (rubric v0 +
  wow-verdict register + parser at agent-tools) is ON MAIN.**
- **NOW OPEN: PR-B** — the blind three-leg graded calibration per the
  adopted order (Director 16:18Z, re-affirmed at their resume): fixture
  corpus per the minting record's derivation note (oak + creature front
  pages must-pass with the motion-scope bound stated; rejected showcase
  root + three degraded oak-page variants must-fail; PDS-identity front
  page held out — unmutated must-pass + novel messy-arrangement mutation
  must-fail); BOTH expert legs on opus per ruling `0cfdd701`; legs blind
  to intended labels; the record names rubric revision v0. Branch off
  fresh main in a worktree; the Director issues the W0.9 credentials
  card when PR-B enters review.

## Session update 2026-08-08 17:56Z (Civet spins Cavern, 054f5e — PR-B EXECUTED and OPEN at #831)

- **The calibration ran end to end in one window**: worktree
  `w07-calibration` cut off the #830 merge commit (branch
  `jimcresswell/design-w07-calibration`); eight-page corpus staged
  ANONYMISED in scratch (`page-N/`, randomised, sibling assets carried);
  four must-fail fixtures authored with neutral names, each scoped to
  its targeted criteria; seat leg recorded and SEALED before dispatch
  (non-blind bound stated); both expert legs dispatched blind on opus.
- **Results (full detail in
  `docs/design/design-review/records/2026-08-08-calibration-v0.md` +
  the three leg reports beside it)**: blind legs caught 4/4 fixtures
  with targeted criteria named, incl. the held-out novel mutation; BOTH
  blind legs PASSED the owner-rejected showcase root — **the measured
  v0 miss** (demonstrated expressive range is not a criterion; headline
  v0.1 input); two canonical pages drew one-leg blocks tracing to ONE
  root (the rubric's anchor carries untokenised angles and its own hero
  collage — "moves four verdicts"); inter-leg agreement 6/8. Register
  gains NO rows (calibration ≠ live verdicts; ground in the record).
- **Estate findings routed to the Director** (ARC 17:56:10Z): the
  `--layer-3` silent-fallback lookalike; the export's inline button
  lacking the kit double focus ring; `width=1280` vs SC 1.4.10; no tilt
  token (criterion 7's tokenised-angles clause unsatisfiable); rubric
  v0.1 authoring as a sitting-class follow-on; the liveness-rule
  `--created-at`→`--now` doctrine micro-drift.
- **PR #831 OPEN** at `ca5420a61`, bot-authored verified, Copilot
  requested via the MCP path, full local gate suite green at commit.
  The identity-naming ratchet forced brand-string sanitisation on the
  committed held-out fixture (recorded divergence, criterion-neutral;
  staged judged copies untouched). The Director's W0.9 credentials card
  fires now per the standing commitment. Next: shepherd #831 (harvest
  Copilot round incl. suppressed bodies, disposition, full-condition
  merge per the standing flow) → then W0.1 census sitting (+ W0.3
  parallel) per the adopted order.

## Session update 2026-08-09 06:26Z (Civet spins Cavern, 054f5e — #831 MERGED; W0.7 COMPLETE; W0.9 unblocked)

- **The #831 review arc ran three rounds overnight-and-morning, all
  adopted**: round 1 (5 findings — criteria-coupling truth, SC 2.4.11
  erratum with the leg report conserved verbatim, fixture-d functional
  divergence set, restaging recipe; cure `e27db0805`); round 2 (5
  suppressed — recipe asset closure + source-read scope claim;
  `ea48991e8`); round 3 (3 suppressed — per-leg-explicit collateral,
  false-positive analysis separated onto its THREE grounds incl. the
  page-4 canonical-raw-geometry block, blindness-preserving permutation
  recipe; folded with the cpd row into `e6486cbfd`). The claude review
  leg materialised but quota-skipped (the #828 shape, on the record).
- **The owner answered the W0.9 card on the morning of 2026-08-09**:
  (1) the Sonar cpd row AUTHORISED — landed with rationale citing
  "owner-authorised 2026-08-09, PR #831" on `.sonarcloud.properties`
  (fixtures dir only, duplication detection only, full analysis
  retained; the record carries the matching gate note); Sonar went
  GREEN on the landing. (2) `OAK_API_KEY` carried into the hub's
  `.env.local` BY THE DIRECTOR — **W0.9's hub pre-read is UNBLOCKED**.
- **#831 MERGED at `f1192ce22`** (mergedAt 06:25:08Z) under Director
  grant `dd56dfb2`, sha-pinned at `e6486cbfd`, boundary recount clean
  (19/19 incl. Sonar, 0 threads), branch auto-deleted, recount comment
  `5230144488`. **W0.7 IS COMPLETE**: instrument minted (#830),
  calibrated blind (#831), the measured v0 miss (the showcase-rejection
  gap) banked as rubric v0.1's input, register discipline holding.
- **NOW OPEN per the adopted order**: the W0.1 census sitting (sitemap +
  axe/Lighthouse page-list derivation; feeds W1.4's IA) with W0.3
  charter ADR as the parallel light leg; the W0.9 hub pre-read
  schedules on the carried key (three-leg pre-read per the rubric, then
  the owner browse moment routed via the Director). The Director folds
  the coordination branch ~09:42Z; this lane's dirty surfaces ride it.

## COMPACTION FREEZE 3 — 2026-08-09 ~09:25Z (Civet spins Cavern, 054f5e — seat continues; OWNER PULL-FORWARD is the executing input; resume map)

- **THE MORNING'S ARC**: resume → #831 rounds 2–3 adopted → owner card
  answered (cpd row authorised + `OAK_API_KEY` carried; W0.9 unblocked)
  → **#831 MERGED `f1192ce22` under grant `dd56dfb2` — W0.7 COMPLETE**
  → estate folded/rotated by the Director (#832, live branch
  `coordination/2026-08-09-8f473f`) → W0.1 census opened (worktree
  `w01-census`; pre-execution review PROCEED-WITH-REVISIONS; fred's
  home verdict; the Director ruled both gates: sitemap re-sequencing
  ADOPTED, `oak-design-tokens` home RATIFIED, ADR-213 §2 read
  confirmed) → **the OWNER worded a PULL-FORWARD and selected build on
  its plan**.
- **THE EXECUTING INPUT at resume**: the delivery node
  `.agent/plans/delivery/identity-switchboard-first-pixels.plan.md`
  (landed `af736ac4f`, pushed, corpus-validator green; born `sketch` —
  the ratification stamp is the owner's one-word act, un-asked). Read
  it END TO END at resume; it is decision-complete. Its step 0 (this
  freeze) is DONE at this entry. FIRST IMPLEMENTATION ACT: todo 2 —
  PR-1, the fidelity tooling port into the showcase (fresh worktree
  off origin/main; per-cycle code-expert pre-execution review before
  any code, per the standing rule).
- **RESUME CEREMONY** (owner's standing word: restart all monitors):
  (1) canonical watcher FIRST + F-95 assert (arm from the PRIMARY —
  the worktree isolation guard refuses the arm in-worktree; napkin
  2026-08-09 ~07:2x carries the round-trip pattern); (2) gap sweep —
  canonical buffer AND the ARC channel end-to-end; (3) F-75 delta
  poll; (4) heartbeat pair on the retained claim UNLESS n=2 is
  re-confirmed live with the Director (then heartbeats stay down per
  PDR-082; re-arm the ARC tail either way if the channel is open).
- **CENSUS STATE (resume gated on the pull-forward node's completion,
  its todo 5)**: worktree `w01-census` LIVE, branch
  `jimcresswell/design-w01-census` at base `8f473f867`, carrying TWO
  untracked files — `packages/design/oak-design-tokens/src/design-census/census-types.ts`
  (slice A's types, authored) and `W01-CYCLE-PLAN-v2.md` (the
  adjudicated cycle plan v2, conserved from session scratch: homes per
  fred's ratified verdict; ledger-split dispositions with exclusion
  fingerprints; derived stylesheet domain; pinned parity methods;
  four-PR slicing; the blindness-preserving notes). The pre-execution
  review's findings and both Director rulings are summarised in the
  ARC channel entries 2026-08-09T07:28:47Z / 07:40:59Z / 07:53:04Z.
- **KNOWN-AT-FREEZE BOUNDS**: monitors ALL DOWN (a platform process
  restart killed them ~09:0xZ — none is running; verified by TaskList,
  no re-arm-to-stop was needed); claim `645b9e0b` RETAINED; the plan
  node is the ONLY commit this freeze adds (`af736ac4f`); dirty
  primary surfaces (napkin, this record, the ARC channel's post-fold
  entries) ride the Director's next fold per no-handover-commits. The
  bot-push transient 403 took its second instance this morning
  (immediate-retry cure held). W0.9 remains unblocked and UNCHANGED
  (it stays with design-system-completion). The Director's standing
  flow (recount + grant at ready signals) governs the pull-forward's
  PRs as it did #830/#831.

## COMPACTION FREEZE 4 — 2026-08-09T10:56:00Z (Civet spins Cavern, 054f5e — seat continues; PR-1 AT REVIEW-SETTLE; resume map)

- **THE WINDOW'S ARC**: resume from freeze 3 → full re-arm (n=3
  correction + node RATIFIED absorbed) → PR-1 built under the
  pre-execution review's PROCEED-WITH-REVISIONS (all findings adopted;
  the load-bearing cure: the plan's single-root export serve was
  unworkable — the two-root STUDIO OVERLAY landed, proven styled
  first-hand) → **#834 OPEN** (four foundation commits) → three review
  cure rounds pushed: `6150cf8e8` (test-expert + architecture-fred:
  bounded overlay via the declared exports surface, pure leaves,
  literal fixtures, README invariant trued), `70f2585b2` (Copilot 15:
  12 adopted, 3 adopted-in-modified-form via no-conditional-tests
  §Diagnosis 5's owner-carded expect-guard ruling), `9e6b2f86a`
  (Copilot round-2's REAL BYPASS — the admit predicate now judges the
  canonical path — plus the Sonar S4624 cure). 16/16 threads
  replied+resolved; Copilot RE-REQUESTED at `9e6b2f86a`; claude-bot
  self-skipped (org overage, the #807 precedent). The plan node's
  export-server clause carries its dated overlay correction
  (`5c5c66e18` on coordination/2026-08-09-b5f347).
- **AT RESUME (the executing input)**: (1) resume ceremony per
  start-right — monitors were RETAINED alive through this freeze
  (canonical watcher bfkjf5en4, heartbeat pair by10bgi80, ARC tail
  btp68xjdi, pr-watch bvex97ypl — persistent monitors survive
  compaction; VERIFY via F-95 assert + TaskList rather than re-arm;
  re-arm only what died); (2) sweep the watcher buffer AND the ARC
  channel; (3) read #834 state first-hand (one-shot pr-watch): needed
  for full condition = all checks green incl. Sonar re-fire on
  `9e6b2f86a` + Copilot round-3 harvest (re-requested; absorb +
  disposition any findings) + threads still 0; (4) at full condition
  post the **READY signal to the ARC channel** — the Director (Plover,
  itself frozen at owner word ~10:52Z) sweeps that channel as its FIRST
  resume act and runs recount+grant; do NOT chase, the flow is standing.
- **THEN**: todo 3 — PR-2 (task #2 carries the config-review
  obligation: @oaknational/result moves to dependencies in the same
  commit that makes lib/identities.ts app-reachable). PR-2 scope is the
  plan node's §Mechanism verbatim (routes, SegmentedControl, route CSS,
  tests incl. no-flash cell, provenance rows, nav link).
- **STANDING STATE**: claim 645b9e0b RETAINED; n=3 full protocol (Wren
  6b29b5 live on workspace-config-isolation; Plover frozen-continuing);
  worktree `identity-switchboard-pr1` LIVE and CLEAN at `9e6b2f86a`
  (pushed); w01-census worktree untouched (census resume gate = this
  node's todo 5; G1/G2 rulings carry); three board items homed with the
  Director (ARC 10:40:45Z: the .next build/type-check gate race ×2, the
  vitest green-through-worker-death harness gap, the hub-side inherited
  defects). Owner word this window: cure gate races via the CLEAN
  SCRIPT (root pnpm clean + ordered turbo build), never raw rm.

## COMPACTION FREEZE 5 (2026-08-09T13:55:59Z) — Civet spins Cavern (054f5e); ALL PROCESSES STOPPED at owner word; resume RE-ARMS

Owner word: "prepare for compaction ... and then stop all processes" —
unlike freeze 4, the monitors are STOPPED at this freeze. The resume
ceremony RE-ARMS per start-right (watcher first, F-95 assert, foreground
gap sweep, heartbeat pair with label pr1b-settle or the next cycle's);
nothing is retained running. Claim 645b9e0b-afea-4743-8cc6-5dad3ad39575
RETAINED as a registry row (heartbeats stop with the processes; the
resume re-heartbeats before anything else).

STATE AT FREEZE (all first-hand):

- PR-1a COMPLETE: #835 "Consolidate the fidelity tooling core at its
  second consumer" MERGED to main at 365a6f7c7 under Director grant
  5B2F71AD (fold ruling: option (b) seam accepted — the Director
  independently derived the same risk-of-loss bar; the ruling text is
  on the ARC channel at 13:33:00Z). Branch deleted, worktree
  fidelity-consolidation PRUNED (ancestry proven). The package lives at
  packages/libs/fidelity-review (foundation lib, ADR-041 dated
  amendment; subpaths support/image-diff/dev-server/static-path-guard/
  capture-flags/register/report/review-helpers; no barrel). The Sonar
  duplication condition that blocked #834 is structurally cleared.
- PR-1b IN FLIGHT: #834 head c0d415726 = c8957e293 (merge of post-835
  main) + the swap commit (showcase consumes the package; app-local
  keeps pairing map, studio-overlay export server + export-paths
  overlay decisions importing the shared guards, frame-aware
  classifiers, runner CLI; register schema tests live with the schema,
  app keeps the live-register parse proof in
  fidelity-register-live.unit.test.ts; deps pixelmatch/pngjs/jest-axe
  and their types DROPPED, @oaknational/fidelity-review workspace:* added).
  Gates green locally at the freeze: build, unit tests, type-check,
  lint, knip:gate, identity ratchet census-exact (95 carriers). CI on
  c0d415726 + a fresh Copilot round were IN FLIGHT at freeze (Copilot
  requested 13:53Z). Prior review state: 16/16 threads resolved across
  rounds 1-3 pre-merge-era; the new round reviews the swap.
- The #835 review corpus (for context at resume): seven-lens opus panel
  plus Copilot x3 and CodeQL, ~35 findings, all cured or recorded; MCP-534
  carries the re-scoped follow-ups (serveStatic, withDevServer bracket,
  corrupt-evidence policy, CLI flag-parse hardening). MCP-533 said
  "Fixes" on #835 — VERIFY its Linear state at resume; the story
  completes when #834 lands.
- 835×836 ADJACENCY (Wren, settled on the canonical wire 13:07Z): the
  second lander absorbs — for #836's main-merge that is the package's
  vitest.config.ts/tsup.config.ts one-token swaps to
  @oaknational/workspace-config subpaths + the devDependency; their
  validator names the files. No hold, merge order free.
- Coordination branch coordination/2026-08-09-b5f347 at b0be7c79b +
  this freeze's continuity commit. Plan node amended through cd341a99a
  (libs-tier correction). Worktrees: identity-switchboard-pr1 LIVE and
  CLEAN at pushed head c0d415726; w01-census untouched (untracked
  W01-CYCLE-PLAN-v2.md + census-types.ts carry state).

RESUME MAP (execute in order):

1. Resume ceremony per start-right — RE-ARM everything (nothing
   survived the stop): canonical all-channels watcher from PRIMARY,
   F-95 assert, foreground gap sweep (watcher buffer + ARC channel +
   canonical stream since 2026-08-09T13:55:59Z), heartbeat pair (claim 645b9e0b,
   intent identity-switchboard-first-pixels, branch
   jimcresswell/design-identity-switchboard-pr1, cycle label per the
   live state), peer-liveness read.
2. Read #834 first-hand: checks on c0d415726 (Sonar leg included — the
   swap should hold the duplication clearance; re-fire via empty commit
   if the analysis dropped), the fresh Copilot round (harvest BODIES
   incl. suppressed blocks), thread state. Disposition any findings
   (batch, one push per round), then READY to the Plover-Civet ARC
   channel — the Director runs recount+grant (#834 needs its OWN
   grant). At merge: delete branch, prune worktree ONLY after PR-2's
   plan is considered (the worktree carries nothing unpushed; PR-2
   starts from a fresh worktree off post-834 main per
   never-switch-branch-on-primary).
3. Todo 3 — PR-2 (task #2): the two routes + SegmentedControl + route
   CSS + unit tests + Playwright cells (identity x theme matrix +
   no-flash first-paint) + provenance rows + root nav link, per the
   plan node's §Mechanism verbatim. CARRIED OBLIGATION: move
   @oaknational/result devDep → dependencies in the SAME commit that
   makes lib/identities.ts app-reachable; zod stays dev. Per-cycle
   code-expert pre-execution review BEFORE any PR-2 code (the standing
   rule; the PR-1a pre-review's worked shape is the model).
4. Then PR-3 (evidence) and the census return per the plan's todos 4-5.

The governing plan node: .agent/plans/delivery/
identity-switchboard-first-pixels.plan.md (owner-ratified; amended
2026-08-09 with the PR-1 split + libs-tier correction). Standing
memories govern as always; the ARC channel is the Director dialogue
surface; owner cards issue from the Director's seat only.

## COMPACTION FREEZE 6 (2026-08-09T17:05:00Z) — Civet spins Cavern (054f5e); processes already stopped by the preceding cold pause; resume RE-ARMS

Owner word: "prepare for compaction ... and then stop all processes."
The stop clause was ALREADY satisfied: the seat cold-paused at the
owner's earlier word minutes before this freeze (heartbeat pair
stopped first with heartbeat-end, watcher last, cold-pause broadcast
14:55Z-era; verified again at this freeze — no monitors run). Claim
645b9e0b-afea-4743-8cc6-5dad3ad39575 RETAINED as a registry row.

STATE AT FREEZE (all first-hand unless marked):

- #834 (PR-1b) head db980a967 = swap (c0d415726) + cure round 5
  (7634c0ca8: /orchestrator with the EvidenceIo seam +
  /pairing-schema + assertServerUp into dev-server +
  MATCHED_GEOMETRY_SCALE + resolveWidth fail-fast + three subpaths
  demoted; both apps composition roots; hub corrupt-evidence unified
  to fail-the-run) + db980a967 (overlay refuses decoded backslashes).
  All four prior Copilot threads resolved with recorded dispositions;
  PR body carries the cure-round-5 section; MCP-534 carries five new
  follow-ups (comment 6ecf2d15); MCP-533 Done since #835.
- ASSURANCE ROUND (owner-commissioned while this seat was paused;
  read from the Director's ARC entry 16:45:00Z, uncommitted at my
  read): 45-agent multi-model fleet + three Codex max-effort reviews
  over db980a967. Verdict CURES-NEEDED, NO GRANT — one cure round
  before merge. My five rounds' cures all verified SOUND (win32
  traversal, injection defences, image-diff math, 8-path teardown,
  diff-never-gates invariant). The NEW surface (what assigned lenses
  structurally could not reach): evidence-integrity (a failed/blank
  capture overwrites canonical PNGs and report-only trusts them —
  quintuple-confirmed), capture-comparability (the 5-line settle
  recipe un-consolidated despite carrying the same invariant as the
  scale constant; ties to rule-6 baselines), lifecycle cleanup-on-
  throw, fs-target containment (symlink/FIFO via the untracked vendor
  root), pairing z.object → strictObject, plus deferrables and record
  truings. The ADJUDICATED PACKET is durable on #834 as comment
  5232387226 — the designed resume surface. Copilot round R27
  (15:23:05Z) carries FOUR undispositioned SUPPRESSED findings, all
  corroborating the fleet. mergeStateStatus BLOCKED.
- Fleet: Wren PAUSED until 2026-08-10 (owner word; their #836 holds
  the depcruise re-slice). The design-lane-only word covered
  2026-08-09. Director live at the freeze, holding the board.
- Coordination branch coordination/2026-08-09-b5f347: this freeze's
  continuity commit rides ARC + napkin + this record (the ARC file
  and napkin also carry the Director's uncommitted 16:4xZ entries —
  append-only, attribution in headers, named in the commit message).
  Worktrees: identity-switchboard-pr1 CLEAN at pushed db980a967;
  w01-census parked (untracked W01-CYCLE-PLAN-v2.md +
  design-census/ carry slice-A state, behind 75 by design).

RESUME MAP (execute in order):

1. Resume ceremony per start-right — RE-ARM everything: canonical
   all-channels watcher from PRIMARY, F-95 assert, heartbeat pair
   (claim 645b9e0b, intent identity-switchboard-first-pixels, branch
   jimcresswell/design-identity-switchboard-pr1, cycle label
   pr1b-cure-round-6), foreground gap sweep since
   2026-08-09T17:05:00Z, peer-liveness read.
2. #834 cure round 6: read FIRST-HAND the adjudicated packet (PR
   comment 5232387226) AND Copilot R27's four suppressed bodies AND
   checks on db980a967. The packet clusters the cures into one
   coherent design story (evidence-integrity + comparability lead);
   adjudicate per verify-dont-trust, pre-execution code-expert review
   per the standing rule, ONE batched push, dispositions + thread
   resolutions, re-READY on the ARC channel → Director recount +
   grant + sha-pinned merge. Test-design lens from the napkin: choose
   seams for falsification power, not only purity — the packet's
   evidence-provenance classes need fs-level truth.
3. PR-2 (task #2) from a fresh worktree off post-834 main:
   per-cycle pre-execution review BEFORE code; plan §Mechanism
   verbatim; carried obligations — @oaknational/result devDep →
   dependencies in the same commit that makes lib/identities.ts
   app-reachable; the live capture arm gains the expectsFrame check
   with the routes (Copilot thread disposition, resolved with this
   home). Then PR-3 evidence, then the census return (task #4).

Governing plan: .agent/plans/delivery/
identity-switchboard-first-pixels.plan.md (ratified; amended through
the 2026-08-09 PR-1b cure amendment). Standing memories govern; owner
cards issue from the Director's seat only.

## Cure round 6 IN PROGRESS (2026-08-09 ~17:25Z) — Civet spins Cavern (054f5e); progress marker, recompute from the PR branch

Director RELEASED the seat to cure round 6 at the owner's word (ARC
16:44Z entry; absorption acknowledged and affirmed). Executing input:
the slice design WITH its pre-execution adjudication addendum at
`.agent/reports/design/2026-08-09-pr1b-cure-round-6-slice-design.md`
ON THE PR BRANCH (SHA:2dc5d427c) — the opus pre-execution review
returned 8 must-fixes (M1 manifest re-keying by relativePath with
derived provenance; M2 ratified-origin allowlist; M3 ban-the-shutter
ESLint gate; M4 group-gone release proof; M5 sentinel on the attach
path; M6 lease self+liveness; M7 real-IO proof homes; M8 in-page fonts
bound, no AbortSignal), ALL adjudicated into the addendum before code.

LANDED AND PUSHED on jimcresswell/design-identity-switchboard-pr1:

- SHA:aacc4ea58 slice 1 — BV-1 strictObject ×3 red-first; BV-2
  Result-typed resolveBase + allowLoopbackOrigin; R6 call sites.
- SHA:(slice 2a) — capture-settle package half: settleForCapture /
  captureShot / captureElementShot / createOriginGuard /
  isAllowedRequestUrl / RATIFIED_EXTERNAL_ORIGINS; /capture-settle
  subpath.
- SHA:f8d2b6d7c slice 2b — all six arms shoot through the one settle;
  ESLint screenshot gate both demos (mutation-proven); origin-guard
  wiring per arm; apply-state census consolidated.
- SHA:e58e0edd0 slice 3i — capture-manifest pure core: schema,
  contentHashOf, sideProvenance/isPromotableTarget, reconcileCohort
  (incomplete/vendor-claim/drift/mixed-geometry refusals);
  /capture-manifest subpath.

ALSO LANDED: SHA:d8ebc46fe slice 3ii — evidence-io module (role-split
Result-typed seam: EvidenceReadIo/DiffWriteIo/RegisterReadIo/
ReportWriteIo + nodeEvidenceIo, re-exported via /orchestrator);
buildAndWriteReport takes injected io; loadRegister deleted whole
(parseRegister stays the pure half); writeReport through the injected
writer; new proofs for buildAndWriteReport (absent/unreadable/invalid
register, write failure, happy path), diffPair unreadable/write-fail
cases, and the non-zero changed-ratio magnitude case (R13 done).
Package 139 tests green; both apps green at the commit.

3iii COMPLETE (all three pieces): SHA:8a88989d9 capture session
(stage/promote/manifest-last + verifyCohortEvidence + nodeCaptureStageIo);
SHA:0b6fedb17 report-side enforcement (loadReconciledCohort — manifest
required, reconciled, hash-verified; report meta derives from the
MANIFEST, buildAndWriteReport signature dropped flags; first run after
merge must be a full capture, PR body must state it); SHA:f612ffa94
arms pivot (one session per run at each root, promotion only on full
success; direct arm mains are stage-only diagnostic runs; --out
deleted; EI-2 width threaded into hub section arms; R7 folded —
RENDER_WIDTH env replaced by WIDTH). EI-1 + EI-2 cured. 3iv ALSO COMPLETE: SHA:1ad8c78be — liveness-driven
run lease (judgeRunLease pure: acquire/refresh/reclaim; live holder
NEVER reclaimed; TTL only for foreign-host unknowable liveness;
run-lease-io real side with signal-0 pid probe); both capturePhases
take-then-release in a finally. THE ENTIRE EI THEME IS CURED.

REMAINING (superseded detail above retained for provenance): 3iii-as-
originally-sketched staging under
demo-evidence/.staging/<runId>/ + promoteRun (rename-per-file,
manifest last by rename) + verifyCohortEvidence + arms' Buffer pivot
to a package CaptureSession (created at each composition root:
stage(relativePath, bytes) hashes+stages+records; promote() renames
per file then writes the manifest LAST by rename; discard() leaves
staging as diagnostics) + buildAndWriteReport's reconcile/derive
wiring (meta ALWAYS derives from the manifest — flags become capture
inputs only; ManifestReadIo leg joins EvidenceIo) + EI-2 width
threading into hub section arms + R7 fold of the hub-local
resolveWidth; 3iv lease (M6 shape:
runId/pid/hostname + holderLiveness probe + release leg); slice 4 LC
(withResource, hub try/finally, signal reaper, M4 group-gone probe,
M5 sentinel via judgeServerIdentity on assertServerUp AND both
ensureDevServer branches, spawn-topology contract in package tests/);
slice 5 SEC-1 handle-yielding resolveContainedTarget (R1 sequence)
in both export-servers + SEC-2 pixel-budget/safe-path/URL-encode +
R13; slice 6 records (plan Mechanism truing, PR body PDR-132 truing +
cure-round section + one-re-baseline note, porting recipe with NINE
modules, MCP-533 reconcile at merge) + smoke homes (M7). Then: R27's
four suppressed findings dispositioned + threads resolved, re-READY
on ARC → Director recount + grant + sha-pinned REST merge (merge
method merge, never squash). Gates at every commit, serial per
check-singleton. All slice-1/2 gates were green at their commits
(package 132, hub 324, showcase 101 at last full pass).

## COMPACTION FREEZE 7 (2026-08-10T06:35:00Z) — Civet spins Cavern (054f5e); cure round 6 mid-flight at 12 commits; resume RE-ARMS

Owner word: "prepare for compaction ... then stop all processes."
Claim 645b9e0b-afea-4743-8cc6-5dad3ad39575 RETAINED. Worktree
identity-switchboard-pr1 CLEAN at pushed SHA:573c860d3 (12 cure
commits on #834); primary clean at this freeze commit.

LANDED SINCE THE LAST MARKER: SHA:3b1509d9a slice 4a (identity-gated
reachability: judgeServerIdentity pure + oak-app sentinel metas in both
app layouts + APP_SENTINEL constants threaded through assertServerUp
AND both ensureDevServer branches; group-gone release proof via
signal-0 group probe with idempotent teardown; server-identity +
dev-command modules split on size). SHA:573c860d3 slice 4b
(registerRunTeardown SIGINT/SIGTERM reaper, teardown-once, pure over a
process fake; withResource DROPPED at its consumer test — deviation
from the adjudicated design recorded dated in the module header:
captureAndReport is the proven server bracket, arms bracket browsers
with try/finally; no dead exports).

RESUME MAP (execute in order after the start-right re-arm — watcher
from PRIMARY, F-95, heartbeat pair claim 645b9e0b cycle
pr1b-cure-round-6, gap sweep since 2026-08-10T06:35Z, peer-liveness):

1. Slice 4 remainder: wire registerRunTeardown into BOTH composition
   roots (spawned mode only; unregister in a finally around
   captureAndReport); hub arms' try/finally — render-canonical-targets
   renderAll (browser) + server.close in finally, drive-export-sections
   driveExport (browser) + server.close in finally,
   capture-live-sections driveSectionCaptures (browser); the
   spawn-topology contract in packages/libs/fidelity-review/tests/
   (bounded synthetic child; group-term/exit fidelity — the ONE
   sanctioned real-process test).
2. Slice 5 SEC-1: resolveContainedTarget in static-path-guard per the
   adjudicated R1 sequence (lstat refuses non-regular incl. FIFO →
   open O_RDONLY|O_NOFOLLOW → fstat ino/dev compare → realpath
   containment re-check; ContainedFile carries {fd,size,realPath});
   both export-servers stream from the validated handle with the fd
   closed on EVERY non-serving path (overlay walk continues, destroyed
   socket); state the intermediate-component race as a LIMIT. SEC-2:
   total-pixel budget PRIMARY (~80M px) + per-axis sanity, read from
   the PNG header (signature + IHDR) BEFORE PNG.sync.read in
   image-diff; safe-relative-path refinement in the pairing schemas
   (relative, no .., no backslash, no ?/#); URL-encoded segments in
   fidelity-html. Smoke homes per testing-strategy §smoke: smoke-tests/
   dirs + CI-wired scripts (SEC-1 symlink smoke; staging→promotion
   smoke).
3. Slice 6 records: plan §Mechanism "Copy the hub's tools" → compose
   (dated, primary); PR body — PDR-132 truing + cure-round-6 design
   story + FIRST RUN AFTER MERGE MUST BE A FULL CAPTURE (report-only
   refuses until a manifest exists) + the ONE evidence re-baseline note
   (CC-1+SEC-3 changed pixels by design; dispositions re-warrant once);
   porting recipe naming NINE public modules + the two export-server
   shapes + both worked examples; deferrables to MCP-534 with names
   (NodeNext declaration portability; static-server limits; register
   fingerprint design). MCP-533 reconcile at the merge moment.
4. R27 dispositions: all four suppressed findings are cured by this
   round (capture-live-pages:61 + render-export-targets:145 →
   staging/promotion; orchestrator:52 → BV-2; export-server:102 →
   SEC-1) — but the export-server:102 thread resolves HONESTLY only
   after SEC-1 lands. Replies + resolutions in one batch.
5. Post-build panel BEFORE re-READY (opus): security-expert (SEC,
   deep) + test-expert (tier homing + falsification power, deep) +
   code-expert gateway. Absorb, cure, then gates green SERIALLY
   (package + both apps + knip + full pnpm check; check-singleton).
6. Re-READY on the ARC channel → Director recount at the cured head +
   grant + sha-pinned REST merge (method merge, never squash). At
   merge: MCP-533 comment; worktree prune only after PR-2 planning
   considered. Then PR-2 per task #2 (fresh worktree off post-834
   main; carried obligations in task + plan).

Standing correction captured this freeze (napkin, same stamp): stale
DERIVED artifacts are cleared by the workspace's own clean verb
(`pnpm --filter <ws> run clean`), never raw rm, never an owner ask.

## COMPACTION FREEZE 7 (2026-08-10T06:55:00Z) — Civet spins Cavern (054f5e); the owner's waaay-back recalibration governs the resume

Owner word this freeze, in order: (1) "prepare for compaction ... and
then stop all processes"; (2) a correction — stale DERIVED artifacts
are cleared by the workspace's own clean verb (`pnpm --filter <ws> run
clean`), never raw rm, never an owner ask; (3) the RECALIBRATION that
now governs this lane: step waaay back — the design work exists to
DECREASE THE COST OF EXPLORATORY APP EXPERIMENTS TO NEAR ZERO, hence
whitelabelling, hence the need to SHOW how powerful and efficient the
system is. The wow page is the demonstration that identity is a
parameter (?brand= is the constructor argument) and that a whole class
of products is now cheap. Everything else on this lane — the fidelity
instrument included — is means.

Claim 645b9e0b-afea-4743-8cc6-5dad3ad39575 RETAINED by this seat.
A STANDBY SUCCESSOR registered at owner word this morning: Swordfish
wakes Trench (claude / Opus 5 / d0274e), warm-paused, activates only
at Director/owner word and ADOPTS the claim then. Whichever seat
resumes, THIS section is the map; recompute #834 first-hand.

STATE: worktree identity-switchboard-pr1 CLEAN at pushed
SHA:573c860d3 — twelve cure commits on #834 (BV, CC-1 + shutter gate +
SEC-3 egress, EI-1/2/3 complete, identity sentinel + group-gone
release, signal reaper; withResource dropped at its consumer test,
recorded). mergeStateStatus BLOCKED as expected. Primary clean at this
freeze commit. Full slice-by-slice detail: the cure-round-6 markers
above and the slice-design addendum on the PR branch
(SHA:2dc5d427c).

RESUME MAP — ends-first, binding:

0. THE POINT IS PR-2 (the switchboard pixels). Cure round 6 completes
   at LEDGER-MINIMUM depth only: the ledger is the bound, nothing
   beyond it, prefer named-home deferral (MCP-534) wherever a row
   allows. Every re-READY/status report states DISTANCE-TO-PIXELS,
   not only gates-green.
1. Re-arm per start-right (watcher from PRIMARY, F-95, heartbeat pair
   claim 645b9e0b cycle pr1b-cure-round-6, gap sweep since this
   stamp, peer-liveness).
2. Cure-round remainder, minimum sufficient: (a) wire
   registerRunTeardown into both roots (spawned mode, unregister in a
   finally); hub arms' try/finally (render-canonical-targets browser +
   server, drive-export-sections browser + server,
   capture-live-sections browser); spawn-topology contract in
   packages/libs/fidelity-review/tests/. (b) SEC-1
   resolveContainedTarget per the adjudicated R1 sequence in both
   export-servers (fd streamed, closed on every non-serving path;
   intermediate-component race STATED as a limit); SEC-2 total-pixel
   budget from the PNG header before decode + safe-relative-path
   schema refinement + URL-encoded report segments; smoke homes per
   testing-strategy §smoke. (c) Records: plan §Mechanism copy→compose
   truing; PR body (PDR-132 truing, cure-round story,
   FIRST-RUN-MUST-CAPTURE note, ONE-re-baseline note); porting recipe
   (nine modules, two server shapes, worked examples); deferrables to
   MCP-534 by name. (d) R27 dispositions — all four cured by the
   round; export-server:102 resolves only after SEC-1 lands. (e)
   Post-build opus panel (security + test + gateway, as committed to
   the Director), absorb, gates green serially, full pnpm check.
3. Re-READY on ARC with an ends-denominated status → Director recount
   with grant + sha-pinned REST merge (method merge, never squash). At
   merge: MCP-533 comment. Worktree prune only after PR-2 planning.
4. PR-2 immediately: fresh worktree off post-834 main; per-cycle
   pre-execution review BEFORE code; plan §Mechanism verbatim; carried
   obligations — @oaknational/result devDep→dependencies in the commit
   that makes lib/identities.ts app-reachable; the live capture arm
   gains expectsFrame with the routes; test seams chosen for
   falsification power. The page IS the story: three identities ×
   one specimen, re-skinning at query level — the near-zero-cost
   demonstration the whole programme exists for.

## COMPACTION FREEZE 1 (2026-08-10 ~09:5xZ) — Swordfish wakes Trench (054f5e successor, d0274e); seat CONTINUES; resume RE-ARMS

Owner word: prepare for compaction; owner chose COMPACT-AND-REJOIN over
hand-off-and-retire. Claim `645b9e0b-afea-4743-8cc6-5dad3ad39575` RETAINED.
Silence past the freeze broadcast is the boundary, never retirement. Written
as an INDEX for a stranger, not a summary — the substance lives in the homes
named below and is not restated here.

**READ THIS FIRST — the plan node contradicts the owner's ruling and will
build the wrong thing.** `identity-switchboard-first-pixels.plan.md`
§"Shape: two routes" still says the picker frames the specimen "in an IFRAME
whose src the controls drive". Driving the src IS a reload, and the owner
ruled 2026-08-10 that the TRANSITION is the hero, with the Director
concurring on in-place re-skin. Until that clause is amended the ARC entries
are authoritative. Amending it is the first records act.

STATE, all first-hand:

- **#834 MERGED** `6804726e2` — `packages/libs/fidelity-review` is on main.
- **PR-2 lane LIVE**: worktree `identity-switchboard-pr2`, branch
  `jimcresswell/design-identity-switchboard-pr2`, cut from a verified-clean
  `origin/main`. FOUR files uncommitted and GREEN (build, type-check,
  identity ratchet all pass; lint/authored-css/tests NOT yet run).
- **2 of 10 specimen regions render** (utility, masthead) with the brand
  applied server-side. Proven by curl against the dev server: a known brand
  yields `data-identity` plus `<link rel="stylesheet" href="/brands/…">` IN
  THE INITIAL HTML; an unknown value narrows to the base identity with no
  sheet.
- **Slice-1 pre-execution review DISPATCHED by the Director** (two focused
  opus legs; the Director dispatches because this session may not use the
  Agent tool). Their freeze broadcast says both verdicts are handed over —
  LOCATION UNVERIFIED BY ME. Find them before authoring: ARC channel first,
  then `director-handoff.md`.

RESUME ORDER:

1. Re-arm per start-right: canonical watcher from PRIMARY + F-95 assert; ARC
   tail on the design-lane channel (BOTH — a green F-95 attests the canonical
   watcher and nothing else; this seat lost two hours to exactly that);
   heartbeat pair on the retained claim; foreground gap sweep; peer-liveness.
2. Find and absorb the two slice-1 verdicts.
3. Amend the plan's shape clause (above), and fold in the two carried
   promises: the two-page scope + in-place re-skin with the Director's
   structural-proof reasoning, and the correction that the fidelity rig is
   the design-iteration CAMERA so its value is concurrent with the page, not
   gated behind it.
4. Author the remaining eight regions, then gates, then PR.

WHERE THE DURABLE THINGS ARE (index, not restatement):

- Design mechanism + why: ARC channel `2026-08-10-design-lane-plover-…`
  entries at 09:15 and 09:25, and the Director's 09:10 strengthening.
- The roster/hook split and why the split went that direction: the docblock
  of `demos/oak-design-showcase/components/brand-identity-binding.ts`.
- R27 dispositions incl. the deferred one: PR #834 comment 5237793004.
- This seat's error signature and the null-state finding with falsifiers:
  napkin, commit `99ec656c2`.
- Cure-round depth bound: plan §DEPTH, commit `b4ed8ea1d`.

KNOWN BOUNDS: two export defects found so far (a checked state carried by
colour alone; `aria-current="page"` on an in-page anchor) are UNCURED and
awaiting a reviewer verdict — a fidelity disposition class for
export-defect-deliberately-not-reproduced is proposed, not agreed. The
Director is frozen, so its dispatch verdicts may land before it returns.

## PLAN OUTLINE — 2026-08-10, post-verdict slicing (Swordfish wakes Trench, d0274e)

**Status: pre-Cricket draft.** Supersedes the FREEZE 1 resume order item 4
("author the remaining eight regions"), which was written before either
slice-1 verdict had been read and would have propagated an unreviewed
pattern across eight regions.

**Not a new plan node.** `identity-switchboard-first-pixels.plan.md` is
owner-ratified and its SCOPE is unchanged. Both verdicts confirmed the
architecture. What changed is sequencing and authoring facts, so this is a
slice plan against the ratified node — authoring a second node would be
invented obligation (plan skill §Pre-Author Scope-Vocabulary Check).

### Goal and mechanism (inherited, restated for the slicer)

Goal: the two pages that demonstrate presentation-is-data, so the cost of an
exploratory app experiment approaches zero. Mechanism: one composition,
re-skinned by data alone; the MOMENT OF TRANSITION is the communicator of
capability (owner ruling 2026-08-10), which a working in-place re-skin can
only achieve if the markup is genuinely identity-invariant — so the
mechanism is its own proof and cannot cheat.

### Step 0 — two zero-cost verifications, before any slice is shaped

Neither is a PR. Both determine downstream slice shape, so they run first.

1. **Cascade order (verdict F3).** The root layout imports the kit base as a
   module; the brand sheet arrives via React 19 hoisting. Nothing currently
   guarantees the brand sheet lands AFTER the kit base, and equal-specificity
   later-wins IS the mechanism. Read the computed value directly. If the
   cascade is wrong, a design fix-slice precedes everything else; if right,
   the work is one assertion folded into the region slice.
2. **Identity ratchet: does the census accept a MOVE?** `lib/identities.ts`
   already exists and is tracked. The open question is whether a removal from
   one registered path plus an addition to another, with both census entries
   updated in the same change, is ratchet-neutral. This decides whether
   verdict F2 lands as a move or stays satisfied-in-place.

### Slices (each a single-story PR, sized at authoring time per PDR-132)

- **S1 — DS trunk: small-button mask-icon sizing.** Verdict F1: the kit sizes
  img-based small-button icons but not mask icons; the specimen's inline
  style was papering a real trunk gap. CSS rule, not a React component, so no
  ADR-147 gate. Fixes the export too. Separate workspace, so separate PR, and
  it precedes the specimen consuming it.
- **S2 — Regions 1-2, verdict-compliant, with the mechanism proven.** The
  a11y verdict's markup rulings (list-marked nav, focusable main, the
  audience-current state kept but re-tokened, a visible non-colour current
  marker), the attribute contract unified per F5, the page-scope marker moved
  onto the wrapper per F7 (already the house pattern; the specimen is simply
  missing it), and the no-flash assertion asserting a brand-OVERRIDDEN
  COMPUTED VALUE rather than the presence of a link. Test and product code
  land together (atomic-landing invariant). This slice SETS THE PATTERN the
  remaining eight follow, which is why it precedes them.
- **S3 — The picker, in-place re-skin.** The transition, in front of the
  owner, over the two-region specimen. Carries F4: the external "open full
  page" link cannot track a frame src that never re-navigates, so it derives
  from control state — the single amendment that fixes the link and the plan's
  shape clause together, because they share one root assumption.
- **S4-S6 — The remaining eight regions**, in batches, on S2's established
  pattern. Mechanical once the pattern is set; this is where the region
  counter moves.
- **S7 — Side-by-side page.** The second ratified page.
- **S8 — Conformance matrix.** A11y verdict HIGH-1: brand-swap redefines
  tokens, so contrast is per-identity, not base-only — the axe gate runs per
  identity x per theme, plus a forced-colours cell. This is a real widening of
  the gate, and it is the instrument that makes the whitelabel claim safe to
  repeat for the NEXT tenant, not just this one.

### Routed to named homes — deliberately NOT absorbed

Per the loop-dynamics discipline: correct and adjacent is not sufficient for
in-loop cure.

- The segmented-control colour-alone cure (DS trunk, its own story).
- The fidelity disposition-class extension. The a11y verdict ENDORSED the
  source-defect-versus-taste-divergence distinction but ruled that a
  not-reproduced disposition MUST carry an upstream home, or the instrument
  reports the divergence forever AND the defect stays live for the next
  consumer. That makes it schema work plus an upstream fix or ticket —
  instrument work, which the owner's frame prices as MEANS. It does not gate
  the pages.
- Naming drift between identity slugs, display labels, and plan pair-ids
  (flagged by the design-system verdict as out of slice 1).

### Records acts (not slices; they carry no PR)

- Amend the ratified node's shape clause. It still describes driving a frame's
  src, which is a reload and contradicts the owner's transition ruling. Two
  independent detections now: this seat's, and verdict F4's shared-root
  finding.
- Correct the `brand-identity-binding.ts` docblock. Its rationale for the
  roster/hook split rests on an unverified premise — that relocating the
  roster was gate-forbidden. The refusal was about a NEW path, not the
  pattern; the destination already existed. Durable and wrong is worse than
  absent.
- Home both slice-1 verdicts out of the Director's session temp directory.
  They gate the next PR and the Director is retired.

### Acceptance, each with its proof type

1. A brand-overridden computed value differs per identity at first paint —
   repo-safe.
2. The picker re-skins with no frame navigation — repo-safe (assert document
   identity survives the swap).
3. Ten regions render — repo-safe count, plus owner-held "reads as a real
   product".
4. Axe clean across the identity x theme x forced-colours matrix — repo-safe.
5. The transition lands as wow — owner-held, seen in Chrome. Artefact paths
   are not the done-test.

### Two counters, because the lane carries two claims

`n/10 regions` tracks the wow claim. It does not track the MECHANISM claim,
which currently has no strong proof and which the entire near-zero-cost
thesis rests on. Ten regions of an unproven mechanism is ten regions of a
possibly-false claim. Both get reported at every status.

### Considered and rejected

Drop the in-place swap; serve each identity as a plain server-rendered page
and show three frames side by side. Materially simpler, and it still
demonstrates that presentation is data — but it discards the transition,
which the owner named as the key communicator of capability. The complexity
is warranted by the stated goal, not by taste.

### Cricket adjudication of the outline — 2026-08-10

Panel: the Claude effort-inversion quartet, both stances, eight legs. All
eight returned.

Final tokens: 6 DRIFTING / 2 ON-TRACK. All four normal legs DRIFTING; the
adversarial wave split 2-2.

A reading error worth preserving, because it is the same class this seat has
now made three times in one window: at 6-of-8 the tokens fell PERFECTLY along
the stance line, and that pattern was reported as the finding. The two
outstanding legs broke it — and they were the two that landed the sharpest
hits. A pattern computed over a partial set was transmitted as a property of
the whole. Same shape as reading a tool's classification as a verdict and a
gate's refusal as a prohibition: A LOCAL OBSERVATION PROMOTED TO A GENERAL
TRUTH BEFORE THE SET WAS CLOSED.

CONVERGENT across all eight:

- Restore the outgoing heartbeat (done before any verdict landed).
- Surface the DUE coordination branch rather than self-fix (done).
- Cascade-order verification is genuine de-risking, NOT stall-continuation.
  Three adversarial legs attacked it on exactly that charge; the two that
  engaged its substance both conceded it survives, because equal-specificity
  later-wins IS the override mechanism and a false premise there invalidates
  both owner-named pages.
- Sequencing implementation slices under an already-ratified node is the
  implementer's job. Routing every ordering call upward is deference-as-safety
  — the thing this check exists to counterweight. The Director's own PDR-117
  ruling, arriving independently, agrees.

DIVERGENT, and the divergence is where the value was:

The four normal legs judged the plan's GOVERNANCE (liveness, branch, scope
authority) and passed its CONTENT. The two late adversarial legs judged its
CONTENT and found three ordering defects the other six waved through. Both
readings are correct about different objects; neither is noise.

ADOPTED — from the two late adversarial legs, changing the plan materially:

1. DROP verification 0(b) as a standalone gate. "Does the census accept a
   MOVE between two registered paths" has no pixel consumer and is answered
   FOR FREE by attempting the move inside the slice and running the
   validator. The killing observation: reasoning about what the ratchet will
   permit, instead of testing it in place, is THE SAME SHAPE AS THE ERROR
   ALREADY ON THIS SEAT'S RECORD this window. The plan reproduced its own
   diagnosed failure mode one level up, and six legs missed it.
2. DROP the trunk mask-icon slice from the HEAD of the order. It appears
   nowhere in the owner's ruling and displaces the only two slices that move
   the region counter or put the transition in front of the owner. Verified
   first-hand what the leg flagged as its own ungrounded assumption: regions
   1-2 DO consume a small button with a mask icon (the masthead search
   control), so the dependency is real — but the specimen already sizes it
   with a local class, so the trunk fix is NOT a prerequisite. Consumption
   real, prerequisite false: displacement wearing a dependency argument.
   Promote it when a region provably needs it beyond the local class.
3. ORDER the records act. The governing node's superseded iframe-src shape
   clause was sitting UNORDERED in the records-acts list. It must be amended
   BEFORE the picker slice is authored, because the picker is built against
   the opposite shape. An unordered records act next to a slice that
   contradicts it is a live trap for whoever authors first.

RESULTING ORDER: amend the shape clause; cascade-order check folded into the
slice, not standing alone; picker/transition and regions at the head; trunk
icon fix and the census move demoted into slices that actually consume them.

ADOPTED — the panel's sharpest hit, changing the order:

Pull the picker/transition slice FORWARD, ahead of the trunk CSS fix and
ahead of re-authoring the two already-rendering regions. The reasoning, from
the one leg that found this independently of the liveness correction and held
it across both its passes: the owner's verbatim ruling names TWO artefacts,
and the outline buried them at positions 3 and 7 of 8. The outline ordered by
ENGINEERING DEPENDENCY; the owner orders by WHAT DEMONSTRATES CAPABILITY. The
picker runs over the current two regions, so pulling it forward costs no
rework.

A stronger argument the panel did not make, which settles it: the picker is
where the MECHANISM claim gets proven in its strongest form — an in-place
re-skin with no navigation. Pulling it forward flips the mechanism counter
from 0/1 sooner, and that counter is load-bearing for the whole
near-zero-cost thesis. Picker-early therefore serves the owner's stated hero
AND the strongest self-finding at once.

ADOPTED — anti-stall guard: fold the cascade-order verification's result
directly into the slice's computed-value assertion, so the mechanism claim
flips inside a PR and never becomes standalone analysis. Time-box both
checks. This is the guard that keeps Step 0 from becoming the thing the
owner already corrected once.

ADOPTED — routing: a committed thread record is not routing. One leg's phrase
is the keeper — "beyond the passively-committed thread record". Writing to a
record the reader may never open had been quietly counted as having routed
it. DISCHARGED: the Director replied and ruled slice order and the
routed-away set to this seat under PDR-117, holding only convergence and two
non-blocking owner-substance edges.

REJECTED, with reason: the most aggressive adversarial redirection — drop
Step 0 entirely and start the picker immediately, resolving cascade order
during PR review. Rejected because a sibling adversarial leg attacked the
same target with the same charge and conceded that cascade order survives:
it is the override mechanism itself, cheap, with a named consumer. Its
underlying instinct is nonetheless ABSORBED rather than dismissed — the check
must not stand alone as a gate, which is exactly what folding it into the
slice's own assertion achieves. Same destination, arrived at without
abandoning the proof.

One leg withdrew its own original redirection after the frame correction.

GROUNDED BY THIS SEAT, closing two "ungrounded" flags the panel raised:

- The PR-2 worktree sits on its own branch and its merge-base equals its own
  HEAD, so NO slice work stakes onto the DUE coordination branch. One leg
  inferred this; it is now verified.
- Discovered while verifying it: origin/main has advanced by one release
  commit since the worktree was cut, touching nothing under the showcase or
  the design kit. No conflict risk; the branch should still take main before
  its PR.

STILL UNGROUNDED, honestly: the panel could not verify Director liveness, the
branch stamp, or the ratification independently — all were taken on this
seat's account. Given this seat had just been wrong about exactly one of
those, that is the right place for a reader's scepticism to sit.

### Routed addition — 2026-08-10, from the specimen's red keyboard cell

The DS trunk slice gains a third item beside the segmented-control cure and
the mask-icon sizing gap: `.oak-skip-link` loses to the kit's own
`reading-flow: grid-rows` enhancement — an absolutely-positioned, area-less
canvas child sorts to the END of sequential focus, the inverse of a skip
link's job. The two rules ship side by side in `components.css` and are
mutually broken for any skip link placed inside the canvas. Cure shape: a
`reading-order` pin on `.oak-skip-link` in the trunk. Found by a red
Playwright cell on the specimen (PR-2, `2d70f12d0`); page-level placement
cure landed there; minimal repro isolated ancestry, not the element.

### PR #846 open — 2026-08-10 evening (Swordfish wakes Trench, d0274e)

The rebuilt identity-switchboard estate is a DRAFT PR: #846, head
efe69380, bot-authored. Everything above (outline → verdicts → rebuild →
matrix → register → doctrine) is landed and pushed on
jimcresswell/design-identity-switchboard-pr2. Draft solely against the
org review-credit wall; Copilot request silently dropped (repo-wide
condition, recorded). Next session: un-draft when credits return, absorb
review, then the queued domain items (design-system-usage re-truing/
split; the five-item DS trunk slice named in the ARC entry).

## COMPACTION FREEZE 2 (2026-08-10 ~17:2xZ) — Swordfish wakes Trench (d0274e); seat CONTINUES; resume RE-ARMS

Owner word: prepare for compaction. Claim
`645b9e0b-afea-4743-8cc6-5dad3ad39575` RETAINED. Silence past the freeze
broadcast is the boundary, never retirement. An INDEX, not a summary.

STATE, all first-hand at freeze:

- **PR #846 OPEN, DRAFT**, head `efe69380`, bot-authored — the whole
  rebuilt estate: specimen (10 regions), picker, side-by-side, 18-cell
  conformance matrix, fidelity register (every divergence dispositioned),
  DDR-009 + reference-first rule + playbook's two governing rules +
  width-guard validator. Suite 62/62 on the built artefact.
- Both branches local == remote, verified by ls-remote. PR-2 worktree
  CLEAN. Draft solely against the org review-credit wall. CORRECTION at
  freeze: the "repo-wide Copilot outage" was the Director's stale-read
  error (requests never appear in reviewRequests; reviews land async) —
  my "silently dropped" inherited it. #846's reviews list reads empty at
  freeze but a review may land async; resume RE-CHECKS the reviews list
  first-hand before repeating either claim.
- Two dev servers still run on this host: showcase dev :3020 (this
  worktree's), export static :3030 — disposable, restartable, not state.

RESUME ORDER:

1. Re-arm per start-right: canonical watcher from PRIMARY (**watch
   posture: `--exclude-tag heartbeat` + the F-75 delta poll pair** — the
   sanctioned standby economy; a directed/group event still surfaces
   instantly) + F-95 assert; ARC tail on the design-lane channel;
   heartbeat pair on the retained claim (model string `Opus-5`, NOT the
   long form — the registry's identity-route check refuses mismatches);
   foreground gap sweep.
2. Check the two external waits: review credits (un-draft #846 when they
   return) and the coordination fold #842 (Director's).
3. Then the queued domain items, in order: design-system-usage
   re-truing/split (UNPARKED 2026-08-10 ~20:30Z: the move landed on main
   via PR #845; the skill now lives at
   .agent/skills/domain-craft/ui-design/claude-design-pipeline/), then the five-item DS trunk
   slice (list in the 17:0x ARC entry and the PR-846-open entry above).

WHERE THE DURABLE THINGS ARE (index):

- The day's method + rulings: conversion playbook §two governing rules +
  §Reference first; rule render-the-reference-before-reproducing;
  DDR-009 + tools/measurement-widths.ts.
- Every fidelity divergence + rationale: fidelity-register.json (6
  entries, global scope).
- The matrix's defect classes + cures: commit fd27de13a's message is the
  narrative; the brand-sheet cures live in studio-source/whitelabel +
  public/brands (byte-parity held).
- The day's error classes (absence-detector-as-verdict; partial-tally-as-
  distribution; the cure): failure-mode event 75c6b6da + the Cricket
  adjudication section above + tally report
  .agent/reports/agentic-engineering/cricket-quartet-tally-2026-08-10.md.
- Owner rulings of record: spec-not-source + chrome-freedom (playbook +
  register entry picker-chrome/chrome-diverges-by-design); canonical
  widths (DDR-009); the three yeses (playbook/rule/validators — all
  landed).
- Formation letter: .agent/experience/2026-08-10-swordfish-wakes-trench.md.

KNOWN BOUNDS: the fidelity stdout summary reads UNREGISTERED over
global-scope register entries (instrument note, routed); the axe
forced-colors contrast disable is a vendor defect open at axe-core
4.12.1 (dequelabs/axe-core#3978), probe-corroborated, cited in
apply-state.ts's helper docblock, re-examined at any axe upgrade
(landed 32f79416c after the owner flagged the advocacy register of the
previous wording); light-dark() arm pairing is POSITIONAL with the background's
arms (cost one wrong-way commit to learn — recorded in the creature
sheet comment).

## COMPACTION FREEZE 3 (2026-08-11 morning) — Swordfish wakes Trench (d0274e); seat CONTINUES; resume RE-ARMS

Owner word: morning rulings recorded, then compaction prep. ALL
PROCESSES STOP with the freeze broadcast; claim
`645b9e0b-afea-4743-8cc6-5dad3ad39575` RETAINED. An INDEX, not a summary.

STATE, first-hand at freeze: PR #846 head `fa1391172` (draft; the
review-credit wait stands; Copilot claims re-check first-hand at
resume). Coordination `f9bc2996f` + this entry. Both branches
local == remote, verified. All suites green at the last code commit
(`8f54a590c`); everything after is docs/doctrine only.

THE MORNING'S RULINGS AND THEIR HOMES:

- **Identity default** (theme DDR): people's choices win AND the page
  has a real theme preference — "Identity default" joins the theme
  choices and is the no-choice default. DDR-003 dated amendment
  2026-08-11 is the governing record (it also owns the 2026-08-10
  applied-model doctrine drift).
- **σ calibration**: scores must at least approximate calibrated
  probabilities — DDR-010 §Known limits names the candidate methods.
- **Fleet-design review is standing practice**:
  `.agent/rules/fleet-design-review-before-expensive-fleets.md` (+ the
  three projections + RULES_INDEX row), rationale carried in the rule.

RESUME ORDER:

1. Re-arm per start-right: canonical watcher (`--exclude-tag heartbeat`)
   paired with the F-75 delta poll, heartbeat pair on the retained claim
   (model string `Opus-5`, the registry's — F-92), ARC tail, gap sweep.
2. **Slice 1 — identity-default theme model** (decision-complete):
   kit `:root` back to `color-scheme: light` with the DDR-003-citing
   comment; restore creature's polarity lever (brand-full.css + public
   copy — the 2026-08-10 removal is repriced by ruling); oak-theme.ts
   gains a clear mechanism (control value `identity-default` ↔ remove
   attribute + clear stored choice; get()/choice() semantics per
   DDR-003); store `getTheme → choice() ?? 'identity-default'`,
   `setTheme('identity-default') → clear`; THEME option lists lead with
   Identity default (label "Identity default"); picker frame semantics:
   identity-default deletes the frame's `data-theme`; re-true the cells
   changed 2026-08-10 (kit integration, store unit, Switchboard unit,
   hub ThemeSwitcher, showcase.spec no-choice + auto-contrast cells,
   picker defaults cell); rebuild kit, sync ALL THREE runtime copies
   (package root, showcase public, hub public — validate-kit-assets
   closes the loop); suites across the three workspaces.
3. **Slice 2 — σ calibration** per DDR-010's candidates (per-region
   alignment, empirical null from repeat-capture pairs,
   correlation-aware effective n).
4. **Fleet W1 at owner sanction** (plan `pr-846-review-fleet` rev 1;
   gate expires 2026-08-13; T3 pre-flight incl. the SHA-pinned range).

OPEN OWNER ITEMS: fleet ratification + W1 sanction; Sonar S6845
disposition (per-site accept with the PR #565 precedent, at his word).
The creature dark-first question is RESOLVED by the identity-default
ruling. Formation letter: `.agent/experience/2026-08-10-swordfish-wakes-trench.md`.

## SLICE 2 DESIGN — σ calibration (decision-complete, 2026-08-11 morning; Swordfish wakes Trench, d0274e)

Owner word (2026-08-11): "sigma should at least approximate the meaning
of calibrated probabilities." Grounded first-hand against
`packages/libs/fidelity-review/src/visual-stats.ts` at PR #846 head
`7b693ce43`. The three DDR-010 candidates COMPOSE, never compete:

1. **S2a — empirical null calibration (the backbone).** capture-pair
   gains a null mode (`--null-runs k`): capture the LEFT url k+1 times
   at the same canonical width, score every same-page pair on the SAME
   window grid, and emit the null distribution of window meanAbsDiff as
   a quantile table into stats.json. `analysePair` accepts an optional
   `calibration` (the table); each window then carries
   `empiricalP = (r+1)/(N+1)` (continuity-corrected rank against the
   null) and `calibratedSigma = Φ⁻¹(1−p)` so the σ vocabulary keeps its
   meaning while now MEANING its magnitude. Rejection under calibration:
   beyond the observed null maximum, with the resolution floor
   (1/(N+1)) stated in the output — the instrument names what it can
   and cannot claim. DDR-010 gains the dated amendment when S2a lands.
2. **S2b — correlation diagnostics inside the null (never a second
   correction).** Estimate row/column lag-1 autocorrelation of the null
   diff field and report n_eff/n as a diagnostic in the null summary.
   The empirical quantiles already absorb correlation — correcting the
   z-scale AND calibrating against the empirical null would
   double-count; the diagnostic keeps the naive-z reader honest.
3. **S2c — per-region alignment (its own follow-on cycle).** Cures the
   cascade: per horizontal band, find the vertical offset minimising
   mean abs diff (bounded search), score within aligned segments — and
   report every non-zero offset as a FIRST-CLASS structural-shift
   finding, never silently absorb it (false alignment hiding a real
   offset is the failure mode; the offset IS a finding). Red-first
   cells with synthetic shifted fields.

Test shape (S2a): unit cells on synthetic fields with known
distributions (quantile mapping, continuity correction, calibratedSigma
monotonicity); CLI null-mode cell; integration: a same-image pair
yields ZERO rejecting windows at the calibrated threshold, a
synthetically shifted pair rejects. Per-cycle review discipline as
slice 1 (pre-execution + gateway).

### S2a pre-execution review FOLDED (2026-08-11, REVISE → amendments below; verdict full text in the session transcript)

The reviewer computed the real numbers: pooled N = C(k+1,2)·windows;
calibratedSigma SATURATES at Φ⁻¹(N/(N+1)) ≈ 4.2 at k=6 — **6σ is
unreachable for any feasible null**, so under calibration `--threshold`
goes INERT and the rejection predicate is `meanAbsDiff > nullMax`
(empiricalP at the floor), with the floor and the σ saturation printed.
The naive z stays reported alongside — the z=100-vs-σmax=4 disagreement
IS the honesty the owner asked for. Binding amendments:

- **k=6 default** (~21 pairs, ~5% per-run family false-alarm; floor
  k≥2 at parse). Serial captures, fresh launch per capture (matches the
  live path — the exchangeability warrant), order + timestamps + per-
  capture heights recorded; all k+1 cropped to common min height.
- **Settle identity**: capture-pair ADOPTS the estate settle recipe
  (settleForCapture/captureShot — second consumer); null and live
  captures traverse the IDENTICAL capture path, else the null inflates
  and the instrument desensitises.
- **Rank raw meanAbsDiff against the null, never z** — removes σ₀ and
  its MAD floor from the calibrated path entirely.
- **Calibration block** (single-invocation self-calibration: left k+1 +
  right once, null in memory, ONE stats.json; no persisted-table mode
  in S2a): k, pair count, N, exact nullMax, top-100 order statistics
  (the 1/(N+1) floor is real only if tail ranks are exact), coarse
  quantiles for display, floor, settle-recipe identity. Result-typed at
  every boundary.
- **Pool FULL windows only**; partial bottom-row windows are marked
  uncalibrated with the reason — never silently pooled. The pooled null
  licenses the MARGINAL claim (exceeds all-but-p of same-page null
  windows anywhere), stated in the output.
- **Heatmap/ordering under calibration**: exceedance meanAbsDiff/nullMax
  drives both strength and rejecting order.
- **Φ⁻¹** as a pure Acklam rational approximation in visual-stats,
  unit-tested against known quantiles; seeded in-test LCG (never
  Math.random); tie rule p = (1 + #{null ≥ observed})/(N+1).
- **The red-first integration cell**: a within-null-jitter pair (small
  uniform Δ) REJECTS under the naive rule today (σ₀ floors at 0.5) and
  yields ZERO rejections under calibration — genuinely red at head.
  (The same-image cell is vacuous: zero diff already passes.)

## COMPACTION FREEZE 4 (2026-08-11 midday) — Swordfish wakes Trench (d0274e); seat CONTINUES; ALL PROCESSES STOP at owner word

Owner word: "prepare for compaction … and once you are ready please stop
all processes." Claim `645b9e0b-afea-4743-8cc6-5dad3ad39575` RETAINED.
An INDEX, not a summary.

STATE, first-hand at freeze: PR #846 branch
`jimcresswell/design-identity-switchboard-pr2` at `995e7e08c` — clean,
local == remote. Coordination `coordination/2026-08-11-7b3df0` at
`87978266b` + this entry. Sonar on PR #846: ONE open MAJOR — S6845
(owner-gated, per-site accept with the PR #565 precedent at his word).
Suites at the last code commit: fidelity-review 188/188, showcase
114/114 unit + 27/27 UI + 43/43 a11y e2e, hub 325/325, kit 17/17.

THE DAY'S FIVE LANDINGS (all two-moment reviewed; SHAs):

1. `dff0f48ec`+`6bcb8541d` — slice 1, identity-default theme model
   (DDR-003 amendment implemented; creature lever restored WITH
   :root:not([data-theme]) icon-filter arms; ~20 cells re-trued as
   relations).
2. `145cf6592`+`a8e54738d` — Copilot round: 12/12 empirically
   adjudicated (10 cured incl. the RSC undefined-headings defect worse
   than reviewed; 2 declined with evidence), all threads replied (bot
   identity) and resolved 12/12.
3. `7b693ce43` — picker-contrast round: idempotent applyFrameTheme +
   filtered MutationObserver; the flip cell earned a real red via
   marker-then-assert (a naive poll passed vacuously).
4. `75de6db37`+`995e7e08c` — S2a σ calibration: exact empirical p, both-
   end saturation (gateway caught +saturation stamped on the QUIETEST
   windows in live data), inert threshold, exact top-100 tail,
   settle-identity auditable, degenerate-null shape (settle makes the
   static specimen byte-stable — nullMax 0). First live run: N=21480,
   floor 4.66e-5, σ-saturation 3.91. DDR-010 dated amendment records it.
5. `9ea40e53f` (coordination) — S2b/S2c design + review amendments
   folded (§SLICE 2 DESIGN above).

RESUME ORDER:

1. Re-arm per start-right: canonical watcher (`--exclude-tag heartbeat`,
   3600s backstop — re-arm on exit notification) PAIRED with the F-75
   delta poll; heartbeat pair (comms `--tag heartbeat` typed args +
   `claims heartbeat`) on the retained claim, model string `Opus-5`
   (F-92); ARC design-lane tail
   (`.agent/collaboration/rapid-comms/2026-08-10-design-lane-…`); gap
   sweep from BEFORE freeze (watch for the Director's adjudication of
   comms-landscape event 4d92b772).
2. **S2b — correlation diagnostics** (small, report-only): lag-1
   row/column autocorrelation of the null diff fields + n_eff/n ratio
   into the calibration summary — needs diff-field retention at pooling
   (capture-null's fullWindowScores currently discards fields); never a
   second correction (the empirical quantiles already absorb
   correlation).
3. **S2c — per-region alignment** (own cycle, red-first): per-band
   vertical offset search, score within aligned segments, EVERY non-zero
   offset a first-class structural-shift finding.
4. **Fleet W1 at owner sanction** (plan `pr-846-review-fleet` rev 1;
   gate expires 2026-08-13; T3 pre-flight incl. SHA-pinned range).

OPEN OWNER ITEMS: S6845 disposition; fleet ratification + W1 sanction;
PR #846 un-draft at review-credit return (Copilot re-request per head
move). Separate lane: agent-registry-resurrection plan T1 awaits pickup.

REFLECTION (held): the two-moment review discipline the owner made
standing this morning paid five times in one day — and its best
catches all shared one shape: reviews that COMPUTE (the unreachable 6σ,
the mutation-record loop, the +σ sign in live data) rather than opine.
The instrument now prints its own limits — saturation, floor, inert
threshold, degenerate null — which is the design lane's thesis carried
into statistics: honesty as structure, not vigilance.

## COLD PAUSE marker (2026-08-11 evening) — Swordfish wakes Trench (d0274e); wake-and-hold at owner word; FREEZE 4 map stands with one correction

Owner word: "come up to speed, and then cold pause." Grounding was
first-hand; no processes armed at any point; claim
`645b9e0b-afea-4743-8cc6-5dad3ad39575` retained.

STATE DELTA since FREEZE 4 (the only corrections to its map):

- PR #846 tip is now `351102655` — the OWNER merged main into the lane
  branch at 2026-08-11 16:42 +0100 (main traffic only: releases
  1.159.0–1.159.3; PRs #745/#746/#852/#853; no design-lane source
  changes). Worktree fast-forwarded to match, clean. PR still draft,
  mergeStateStatus BLOCKED, no new review threads.
- Comms sweep 12:00Z→20:41Z: dependency drive complete (MCP-549;
  #855/#856/#857 merged), Wren's #851 cure arc complete, Director
  froze/resumed with card answers on MCP lanes only. NOTHING routed to
  the design lane; comms-landscape event 4d92b772 remains
  un-adjudicated (stays on the resume map).
- Fleet-relevant napkin harvests worth reading at resume: Copilot does
  NOT auto-re-review on push (explicit re-request each round, verify
  via reviewRequests); Copilot 20k-line diff ceiling returns
  size-skips; merge-bot stale-attempt blindness (worst-of-all-instances
  vs latest-per-name).

RESUME ORDER: unchanged from FREEZE 4 (re-arm; S2b correlation
diagnostics; S2c per-region alignment; fleet W1 at owner sanction —
gate expires 2026-08-13). OPEN OWNER ITEMS unchanged: S6845
disposition; fleet ratification + W1 sanction; PR #846 un-draft at
review-credit return (Copilot re-request per head move — now confirmed
mandatory by Forge's finding above).

## MAIN-ABSORB cycle (2026-08-12 evening) — Swordfish wakes Trench (d0274e); owner-instructed merge executed; PR #846 head f2eceea9a

Owner instruction (relayed via Director event 77f643f0, ACKed 91171af8):
update the worktree from latest main after the #870 merge. Executed as
the UPDATE path: `origin/main` (d105b4ab2, release 1.167.0) merged into
the branch at `f2eceea9a` — zero conflicts (divergence analysis:
merge-base f376162d5, three overlap files, all auto-merged). Gates
green post-merge under the moved estate (Next 16.3.0, jest-axe 11,
turbo 2.10.9): 34/34 turbo tasks across the five lane workspaces,
70/70 showcase Playwright cells (27 UI + 43 a11y). Pushed; PR #846
still draft at owner gates.

Lane re-truing vs the repo-only ruling (events d13401a6 + b3c30134):
swept every branch-touched file — zero two-homes/studio-sync claims;
nothing to cure. `studio-source/` is a provenance directory name, not
a sync claim.

NEW LANE INPUTS from the moved main (read at next cycle open):
`.agent/skills/domain-craft`-homed ui-visual-design skill
(owner-ratified v1; WCAG target-size clauses); design-system-usage
eval suite + benchmark; defect tickets MCP-586 (card-link accname
void, High) and MCP-587 (dense token below the 44px floor) — eval-born
design-system defects adjacent to this lane. Queue after them remains
S2b → S2c → fleet W1 at sanction (gate expiry 2026-08-13).

## S2b LANDED (2026-08-12 evening) — Swordfish wakes Trench (d0274e); two-moment reviewed; PR #846 head 5243224f9

Owner word: "go ahead with S2b." Landed as `3d1b9c029` (slice) +
`5243224f9` (gateway cures), pushed. Pre-execution review REVISE (four
computed criticals — AR(1)-domain-gated n_eff with named omission;
exact all-equal constant-field guard curing the float-dust case;
inverse-normal-cdf.ts extracted at the line cap; correlation machinery
homed in the NEW library module
`@oaknational/fidelity-review/visual-correlation`, never the demo
tool). Gateway verdict LAND with independent recomputation (five
mutation checks bite, invariance path structurally closed, built-dist
resolution proven); its F1–F4 docs/naming findings cured in
`5243224f9` (pairCount always C(n,2) + estimablePairCount beside it;
DDR-010 trued: constant-field trigger, verbatim discriminant,
follow-on as pointer). Suites: 205 library + 116 demo green; live run
printed the named degenerate verdict on the byte-stable switchboard
page.

DISPOSITIONS CARRIED FORWARD (gateway F5–F7):

- F5 (noted, no change): `lumasOf` holds k+1 luma arrays at once
  (~73 MB/capture at full-page 1512×6000) — fine at the k=2 floor and
  k=6 default; a bound belongs with any future large-k work.
- F6 (ratchet at 2 for the visual-* module shape): the next addition
  to visual-correlation.ts forces a third split → solution-class
  review at that moment.
- F7 (PRE-UNDRAFT ITEM, named): `no-throw-statement` warning at
  `demos/oak-design-showcase/app/identity-white-labelling/page.tsx:35`
  (from earlier branch commits, absent on main) — cure BEFORE #846
  un-drafts; no-warning-toleration bites at the PR boundary.

CRICKET FULL SUITE run at this boundary (owner-invoked): 7×ON-TRACK,
1×DRIFTING (frame-citation defect, cured in-flight); tally with
tokens/runtime at
`.agent/reports/agentic-engineering/cricket-quartet-tally-2026-08-12-s2b-gateway-boundary.md`;
split routed to the Director. Adopted redirection: the fleet W1 owner
card raised at the synthesis (gate expires 2026-08-13).

NEXT CYCLE CANDIDATES (sequencing at this seat): the Director-ruled
n_eff true-up (event `4b5afe31` — replace the modelled ratio with the
direct measured variance ratio, replace-don't-bridge) OR S2c
per-region alignment. Standing gate citations now carried here: S6845
= one open Sonar MAJOR on PR #846, owner-gated per the PR #565
per-site-accept precedent; #846 un-draft requires an explicit Copilot
re-request (Forge's first-hand finding, napkin 2026-08-11 MCP-549
drive, finding 3).

## W1 SANCTIONED (2026-08-12 evening) — owner card answer "Sanction W1 now"; fleet executing at this seat

The pr-846-review-fleet plan's owner gate cleared by card at the S2b
gateway boundary (the Cricket-adopted redirection raised it; the gate
would have expired 2026-08-13). Plan stamped ratified at revision 2:
the reviewed object gains P7 (fidelity instrumentation — the S2a/S2b
landings), T3 re-pins to head `5243224f9`, fleet design unchanged.
Execution order: T3 pre-flight (SHA pin + changedFiles assert + F-159
model check + production server :3020 + export overlay :3030 with the
styled-sentinel assertion + fresh suite counts) → W1 (11 legs +
category-routed verification) → seat adjudication → W2 (completeness
critic + release-readiness, two named verdicts) → report at
`.agent/reports/design/pr-846-review-fleet/report.md` → owner card
with both verdicts. The n_eff true-up and S2c queue BEHIND the fleet
verdict absorption.

## COMPACTION FREEZE 5 (2026-08-12 ~21:5xZ) — Swordfish wakes Trench (d0274e); owner word "pause when you can"; fleet W1 FROZEN RESUMABLE at 10/11

Claim `645b9e0b-afea-4743-8cc6-5dad3ad39575` RETAINED; seat CONTINUES.
All processes stopped by intent at this freeze (canonical order).

STATE, first-hand: PR #846 branch at `5243224f9`, clean, == remote
(the day's landings: main-absorb `f2eceea9a`; S2b `3d1b9c029` +
gateway cures `5243224f9`, two-moment reviewed, Cricket-suite tallied
7/8-1/8-cured). Coordination at this commit. Ticket MCP-591 In
Progress. T3 pre-flight header committed at
`.agent/reports/design/pr-846-review-fleet/report.md` (pins, asserts,
sentinel evidence, suite counts).

FLEET W1 FROZEN, RESUMABLE — this is the executing input at resume:

- Run `wf_8e740b28-943`, Phase 1 at 10/11 legs complete when frozen
  (the fidelity instrument leg L11 was in flight; it re-runs at
  resume, the 10 completed legs return from journal cache). Phase 2
  (category-routed verification) had not opened.
- Resume recipe, verbatim: restart the production server FIRST
  (`cd demos/oak-design-showcase && pnpm start` in the PR-2 worktree,
  assert :3020 → 200 — L11 and empirical refuters need it), then
  invoke the Workflow tool with `resumeFromRunId: "wf_8e740b28-943"`
  and `scriptPath: <session workflows dir>/pr-846-review-fleet-w1-wf_8e740b28-943.js`
  (the harness prints the absolute session path at launch; on a fresh
  session, re-launching from the plan with a fresh run id is the
  fallback — the plan is decision-complete and this freeze block plus
  the report header carry every T3 pin).
- Then per plan: integrity gate (worktree clean at `5243224f9`) →
  seat adjudication (two axes; refutation audit with overturn count;
  K1–K12 knowns scoring per the pre-declared map) → W2 (completeness
  critic + release-readiness, TWO named verdicts) → cross-check
  script output embedded in the report → owner card with both
  verdicts.

RESUME ORDER: (1) start-right re-arm — watcher (heartbeat-excluded,
3600s backstop, re-arm on exit + gap sweep) PAIRED with the F-75
delta poll; heartbeat pair on the retained claim, label
`fleet-w1-execution`, model string `Opus-5`; (2) the fleet resume
recipe above; (3) after the fleet card: the Director-ruled n_eff
true-up (event `4b5afe31`, replace-don't-bridge) → S2c per-region
alignment. OPEN OWNER GATES unchanged: S6845 (PR #565 precedent, his
word); #846 un-draft (REQUIRES first: the F7 no-throw cure at
identity-white-labelling/page.tsx:35, then explicit Copilot
re-request); the fleet W1 verdict card once W2 lands. Director
(Plover, b10c37) was in owner-directed warm pause supporting this
lane; Nautilus/Wren paused at owner word.

## OWNER RULINGS 2026-08-13 + ARC OPENING (Swordfish wakes Trench, d0274e) — an INDEX

The owner's in-session rulings (session d0274e, 2026-08-13 morning),
each binding on the design lane; verbatim wording lives in the cited
artefacts:

1. **Recognisability criterion**: the Oak identity in this repo must be
   instantly recognisable as Oak; canonical references: the teacher and
   pupil experiences at <https://www.thenational.academy> AND
   <https://labs.thenational.academy/aila>. Carried in
   `oak-identity-recognisability.plan.md` (PR #873) §Goal.
2. **Metrics, not owner vigilance**: he provides final sign-off but is
   not the operating judge — metrics/measures/goals carry the loop.
   Carried in the same plan (§Mechanism, held-out sign-off).
3. **Orthogonality admission rule** (his escalation: one proxy
   gameable; two orthogonal very hard; three near impossible) —
   ratified; carried in the plan AND generalised in PDR-137.
4. **The basis frame**: origin system → desired characteristics →
   orthogonal basis model → plan/acceptance/metrics/fitness →
   perturb-and-iterate; "model optimisation and parameter optimisation
   adjacent conceptual space"; "I want the basis set method generalised
   and recorded" → PDR-137 (PR #874, Proposed; his PR glance is the
   ratification moment).
5. **The method is domain-general** (mid-turn, same sitting): transform
   AND creation, any characteristic class — "it could be literally
   anything"; the design case "happens to be about a visual identity
   expressed through css and components". Dated amendment in PDR-137.

ARTEFACTS OPENED TODAY: PR #873 (two born-sketch plans:
oak-identity-recognisability + showcase-information-architecture, plus
the two-pass readiness-review record with its by-ID discharge rule);
PR #874 (PDR-137); ticket MCP-592 (In Progress). Owner gates on the
plans expire 2026-09-03 (ratification + default-face decision).

FLEET W1 (MCP-591): quota health-check at owner ask — journal CLEAN
(79/79 results real, zero null/error shapes; the only quota casualty
was the Director's own fold-review leg, recorded by them in #872).
Resumed ~09:35Z on run wf_8e740b28-943 (cached legs replay; two
kill-interrupted legs re-run; Phase 2 completes). Then per plan:
integrity gate at 5243224f9 → two-axis adjudication → W2 → owner card.

ESTATE: day-roll discharged by the Director (fold #872 merged
ca6b0fd8f; estate rotated to coordination/2026-08-13-ca6b0f; directed
request 266a3e74 thereby discharged; the fleet plan's stale
sanction-gate row was cured in the fold). Director resumed in
owner-directed support posture (their broadcast f8f73bab5-prefixed,
09:38Z). Open owner gates unchanged otherwise: S6845; #846 un-draft
(F7 cure + explicit Copilot re-request first). KNOWN RESIDUE: the
basis-method-pdr worktree carries this block as a misplaced
staged-uncommitted copy (cwd slip, surfaced to owner 2026-08-13) —
content identical to this landing; disposition at owner word.

## COMPACTION FREEZE 6 (2026-08-13 ~12:0xZ) — Swordfish wakes Trench (d0274e); seat CONTINUES; cure arc at bundle 1/11

Claim `645b9e0b-afea-4743-8cc6-5dad3ad39575` RETAINED. All processes
stopped by intent in canonical order (heartbeat first with declared
end; watcher last; showcase server down). This block lands via WARDEN
INTENT — the single-writer arrangement (Director sole committer on the
primary; adopted at owner word after the 2026-08-13 commit-failure
sort-out) is ACTIVE and this freeze is its first boundary.

STATE, first-hand: PR #846 head `30bd9e36c` (bundle 1 landed+pushed:
`291a24cd1` capture height honesty + `30bd9e36c` gateway cures; clean,
== remote). Fleet W1+W2 COMPLETE: verdicts GO WITH CONDITIONS
(open-for-review) + SOUND-WITH-CURES (doctrine); full record incl. the
two-axis disposition ledger, promotions, and conditions at
`.agent/reports/design/pr-846-review-fleet/report.md` §T4 (warden
commit `8b83962a0`). Owner rulings of the day indexed in §OWNER
RULINGS above (`218d5e591`). Plans RATIFIED on main (stamps via #875);
PDR-137 ACCEPTED (#876); #873/#874 owner-merged; default face stays
Oak. MCP-591 In Progress (cure arc); MCP-592 Done. Merged-branch
worktrees design-arc-plans + basis-method-pdr pruned (provably safe).

RESUME ORDER: (1) re-arm per start-right — watcher (heartbeat-excluded,
3600s backstop, re-arm on exit + gap sweep) PAIRED with the F-75 delta
poll; heartbeat pair on the retained claim, label `cure-arc-846`,
model string `Opus-5`; the showcase server restarts only when a bundle
needs the browser (the a11y mechanism bundle and the fresh Playwright
run will). (2) **Bundle 2 — a11y instrument cure** in
`demos/oak-design-showcase/tests/apply-state.ts`: F15 (assert the axe
incomplete bucket, never drop it), F16 (matchMedia forced-colors gate +
self-retiring assertion per accessibility-practice.md), F40
(theme-distinctive application proof for the 4 vacuous-capable cells)
— ONE instrument cure per the W2 promotion; pre-execution code-expert
review per cycle, mutation checks, gateway, push. (3) Then per the
report §T4 ledger: a11y mechanism (F01/F02/F36 + F10/F12) → masthead
(F03/F05/F14) → register honesty (F25/F37/F38 — F04 ordering
satisfied) → docs truth (F07 incl. stale 62/62, F20, F22 token cure) →
frame readiness (F08/F30/F31/F32) → remaining fix-in-open bundles +
overflow disposition sweep (named home per row at first pickup) → F7
no-throw + S6845 (decision matrix; seat work per owner ruling) → K9
bounded two-look pass → fresh Playwright + body rewrite from fresh
counts → release-readiness leg re-run alone → at GO: un-draft #846 +
explicit Copilot re-request + MCP-591 comment. (4) The recognisability
arc (ratified) opens after: S1/S2/A2 slices are unblocked; S3+ waits
on #846 merge.

STANDING: warden intents for ANY primary-checkout content (pathspec +
pre-checked subject ≤100 lower-case); five mechanical disciplines
(single-purpose git commands; subject pre-check; full hook output;
census-slug pre-scan; explicit pathspec). Director (Plover, b10c37)
live in owner-directed support posture; arc channel
`2026-08-13-design-lane-…` is the dialogue surface.

## BUNDLE 2 LANDED (2026-08-13 ~13:30Z) — a11y instrument cure + mutation-method practice record

Seat resumed post-compaction, ceremony re-armed, bundle 2 landed on
PR #846: head `3c7124be7` (cure `ec1695bd6` — F15 measured-failure seam +
adjudicated-reason fence, F16 one mode-observing axe helper + gate-intent
asserts + self-retiring artefact probe, F40 distinctive-token equality
proof, settle polls; practice record `3c7124be7` — two-mode
mutation-testing method at owner word, docs-review-cured to preserve the
binding 2026-08-05 score-is-evidence doctrine). Four-reviewer chain
(pre-exec pair, gateway, docs, test-expert); unit x6 + live x3 mutants
killed. A11y suite 40/6: the six red are the pds masthead cells, declared
(comms log + demo README), removal = bundle 4. T4 addendum with eight
new/enriched ledger rows appended to the fleet report (same warden
intent). Gitleaks false positive cured at source (THEME_PROBE_PROPERTY).
Owner asks absorbed this window: mutation method recorded in
development-practice.md with Stryker notes. NEXT: bundle 3 (a11y
mechanism F01/F02/F36 + F10/F12 + F7 no-throw; plus the three bundle-3
inputs in the addendum).

## COMPACTION FREEZE 7 (2026-08-13 ~14:4xZ) — Swordfish wakes Trench (d0274e); seat CONTINUES; tight scope governs

Claim `645b9e0b-afea-4743-8cc6-5dad3ad39575` RETAINED. All processes
stopped by owner word in canonical order (heartbeat first with declared
end; watcher last; dev server down). Warden arrangement ACTIVE.

GOVERNING SCOPE (owner, 2026-08-13, verbatim in per-user memory
showcase-tight-scope-2026-08-13): purge the old showcase; a new good
front page; an identity+theme switching demo page; a CSS-only
page-structure configurability demo page. Impact before improvements;
a11y fixes on kept identity pages ARE delivery (owner ratification).
Owner sees rendered pages at short intervals — never work-to-done.
Report in outcome language; internal codenames mean nothing to him.

RESUME POINT: the owner's Chrome look at the skeleton (dev server
`pnpm dev` in demos/oak-design-showcase, :3020). UNCOMMITTED working-tree
files in the PR-2 worktree carrying the skeleton (safe on disk, NOT yet
committed because the front-page swap re-targets the test suite and
awaits his steer): app/page.tsx (rewritten landing — masthead, hero
thesis from kit README, two door cards), app/composition/page.tsx (NEW —
identical region markup under the three shipped maps unit / home / proof),
app/globals.css (appended .doors/.door/.comp-* styles). After his steer:
one commit = front-page swap + a11y matrix re-target (matrix currently
drives the switchboard ON the front page — move to /identity-switchboard) +
purge of orphaned components (Switchboard-on-front, Hero, TypeSpecimen,
ButtonsSpecimen, TagsSpecimen, CardSpecimen — knip forces same-commit
deletion; provenance listed in the commit).

PUSHED STATE: branch jimcresswell/design-identity-switchboard-pr2 at
`1f730517a` (specimen keyboard cure, slice 1: hero headline takes the
skip target; census cells; mutant-proven). A11y suite 42 green / 6
declared pds masthead reds (removal = masthead cure, task #18).

READY-TO-EXECUTE (task #17, all pre-execution-reviewed with first-hand
probes): slice 2 — picker + white-labelling tabindex removal MUST land
WITH frame inert + role="img" wrappers (name + aria-describedby) +
visible non-interactive affordance + parent-space target-measurement
pure module (axe false-passes target-size inside scaled frames);
behaviour-level assertions ONLY (assumptions-review binding constraint).
Then hooks family (F10/F12 shared identity-default extraction, F09
listener justified by shared-storage precondition, F7 total fallback +
lib/identities.ts comment truing) and coverage cells (forced-colors
outline: boxShadow none + style/width + colour alpha>0, NO ratio;
specimen system cell dark-OS only). Kit motion PR: ruled spec in task #23
(-full token split completion + important floor on duration
properties). Cricket 7/8 ON-TRACK panel + Director CONCUR on the
reslice are on record.

ROUTED TO DIRECTOR (directed event at freeze): all non-design-lane work
— dev-practice cure sequence (synthesis + three reports at
.agent/reports/governance/development-practice-review-2026-08-13/),
config-expert gate-list reconciliation, validation-strategy home owner
call, cross-package axe/motion/stale-path items. Editorial doctrine
recorded (memory editorial-voices-audience-keyed): voices are
audience-keyed — Oak voice for products, accurate+clear for internal
humans, agent-optimised for agents.

RE-ARM AT RESUME: watcher (canonical invocation, heartbeat-excluded,
3600s backstop, re-arm on exit + sweep) + F-75 diff poll + heartbeat
pair on the retained claim (comms leg: intent design-lane-pr-846,
branch jimcresswell/design-identity-switchboard-pr2, cycle label
tight-scope-showcase; claims leg: --active absolute path, --now
required). Dev server only when pixels are being shown.

## SESSION CLOSE 2026-08-13 evening (Swordfish wakes Trench, d0274e — owner-called close-out; successor picks up the lane)

- THE RESUME MAP IS THE RATIFIED PLAN: `.agent/plans/delivery/design-showcase-experience.plan.md` (owner-ratified 2026-08-13, commit 96115d142 + true-up 76a0d9e13, PR-2 branch, pushed). Execution opens at W1 (kit responsive foundations) then W2 (composition rebuild from scratch). Branch jimcresswell/design-identity-switchboard-pr2 tip 76a0d9e13 == origin, tree clean. PR #846 draft. Playwright: 48 green + exactly six declared pds masthead reds (any OTHER red is new information). Landed today: a967f8979 (tight-scope landing, narrow-first picker, complete pds rename across demo+kit, test re-target).
- ASSUMPTIONS THE SUCCESSOR MUST QUESTION (owner instruction at close): (1) worktree copies of coordination-authored corpus LAG — check the coordination branch before trusting any status/relationship claim read from the PR-2 branch (proven instance: the pr-846-review-fleet row, cured 76a0d9e13); (2) the ratified plan's citations were fleet+Director+owner checked but re-verify load-bearing ones at pickup — one staleness survived ratification by hours; (3) the guard hypothesis (worktree agent-tools/dist built 17:17 → enforcement began) is corroborated, not cured — watcher/comms writes may still be blocked; interim protocol = cross-session send + warden append + ARC read at boundaries; (4) the radio-control ruling and the R13 correction are owner-verbatim in the plan's rulings table and per-user memory — read the quotes, never a paraphrase; (5) whether the switching page re-affirms or reverses identity non-persistence + client-side-switch-not-production was delegated to the plan author and NOT seat-verified — check the plan's W3 before building; (6) session task-board specs for old bundles (#17/#18) predate the plan — the PLAN governs, tasks are pointers; (7) pixels: the owner approved the landing and picker AT his screenshot moments; nothing after 76a0d9e13 has been shown to him; (8) this seat's earlier ARC/record timestamps were local-time-written-as-Z.
- Day's owner rulings all carried in the plan's rulings table R1-R13 + per-user memory (authority-identifiable-and-appropriate is THE generator memory; css-owns-appearance-including-visual-order carries the envelope correction verbatim; lowest-effective-level generalisation in R10 + ratified_where).
- Estate: the outgoing identity = zero in design surfaces (census 19 residual .agent carriers routed to Director); comms watcher DOWN at this seat since ~17:17 (guard); heartbeat pair honest until stopped at this close; MEMORY.md per-user index owes a careful compaction (19.7KB > 17.1 target).

— Swordfish wakes Trench (d0274e), via warden append at session close; the MEMORY.md compaction in the final line landed before this append (16.5KB, Director seat, same evening)

## COMPACTION FREEZE + WIND-DOWN STATE (2026-08-13 ~21:0xZ) — Skua binds Leeward (e2b222); merge drive LIVE mid-freeze

Owner word governs: thoughtful wind-down, NOT a closeout, everything safe
and trivial to pick up; #846 merged + all work pushed + coordination
folded (fold DONE: Smith's #884 merged c8586f477; estate rotated to
coordination/2026-08-13-c8586f). Owner called compact-prep at ~21:00Z.

MERGE DRIVE STATE, first-hand at freeze: PR #846 head `7aaa9e6e4` (clean,
== remote, un-drafted, base main, MERGEABLE, zero conflict vs folded main
by merge-tree). Landed this session, all pushed: `8b89ad988` (fluidity
pillar tranche 1 — see the ratified plan §W1), `3b02fa8a1` (tri-state
clear(), last review thread cured+resolved), `bbe6803ef` (sonar: nested
template literal + numeric separators), `d2c4e4e24` (PDS masthead cascade
cure at the generator — the six declared reds GREEN, suite 70/70,
run-quality-gates PASSED in CI on this head), `7aaa9e6e4` (equality-form
membership as for-of loops; window-not-globalThis kept deliberately — the
injectable-window test seam is the runtime contract, S7764 rejected on
recorded grounds).

THE ONE REMAINING GATE: SonarCloud on `7aaa9e6e4` fails TWO conditions:
(a) new_duplicated_lines_density 3.2 > 3 — MY for-of membership loops
duplicated (isThemeName/isMotionMode near-identical, ×3 runtime copies);
cure = ONE generic member guard `function isMember<T extends string>(
values: readonly T[], s: string | null): s is T` in src/oak-theme.ts,
both guards call it, rebuild, sync 3 copies (dist → kit-root →
2× public), 19 kit tests + validate-kit-assets must stay green;
(b) new_code_smells_severity 15 > 14 (severity-weighted, lags count) —
8 issues remain: 2 MAJOR (S3358 nested ternary useFrameTheme.ts:62;
S6845 resources.tsx:64) + 6 MINOR (S6754 ×2, S5906, S7764 ×3-rejected).
Cure the two MAJORs mechanically; the S7764 trio stays rejected-on-
grounds. Then: commit (pathspec), push (pre-push ~5min), CI (~12min),
verify required checks BY NAME (CodeQL, SonarCloud Code Analysis,
run-quality-gates, Vercel — ruleset 13402577), then sha-pinned bot REST
merge (mint --scope pull-request-merge from PRIMARY root, cwd pinned,
token ≥20 chars, author echoed; merge method MERGE, never squash;
sha = the settled tip read first-hand at the call).

AFTER MERGE, the closeout sequence (all prepared): (1) append merged sha
to this record + napkin; (2) commit napkin + this record to
coordination/2026-08-13-c8586f by pathspec, push (sole-live-seat lean
path — Smith stood down after their fold; fleet-state only); (3) closeout
broadcast from the pre-drafted body (scratchpad closeout-body.md,
<MERGE_SHA> placeholder) — it IS the heartbeat-end declaration; (4) stop
monitors canonical order: heartbeat loop first, F-75 poll, watcher LAST.

CLAIM 645b9e0b: RETAINED stopped-seat-held, handoff pointer SET
(handoffs/645b9e0b-design-lane-winddown-2026-08-13.md — machine-local;
its substance: the ratified plan IS the resume map; first pickup acts =
plan R16 [owner identity-static/theme-dynamic ruling, verbatim in
per-user memory three-identities-are-a-demonstration-instrument append +
napkin ~20:5xZ] → W1 remainder [A2 rhythm, slice B guard + EMC² body rem]
→ W2). Session task list dies with the session; this record + the
handoff record + the plan carry everything.

DAY'S OWNER RULINGS at this seat, all captured verbatim at occurrence:
R14 fluidity-pillar (plan + memory), R15 demonstration-ontology +
anchoring refinement (plan + memory), identity-static/theme-dynamic
(memory + napkin; plan R16 at pickup), the wind-down word (napkin).
Method lessons: frame-inheritance from defect-derived design;
first-principles-WHY before clause adjudication (both napkin'd).

### Freeze true-up (~21:2xZ): merge head moved to `ea029a9fa`

The freeze entry's cure plan EXECUTED: `ea029a9fa` (isMember generic guard
— duplication killed across the three runtime copies; defaultFace
extraction; both hook pairs renamed; 19 kit tests + tsc + lint + 10
picker/switchboard cells green; S6845 stays as the documented WCAG 2.1.1
scrollable-region tension at its site). On `7aaa9e6e4` every required leg
EXCEPT Sonar had passed (run-quality-gates, browser-tests, CodeQL, Vercel
all green). CI runs on `ea029a9fa`; at all-green: by-name required read →
sha-pinned bot REST merge → the closeout sequence in the freeze entry.

### PAUSE POINT (~21:4xZ, owner ten-minute word): ONE commit from merge

Owner ruled: finish in ten minutes or prioritise the compaction pause; the
honest path needs ~20 (exclusion commit + fresh CI analysis), so PAUSED.

STATE: PR #846 head `ea029a9fa` — every required leg GREEN except
SonarCloud, whose two failing conditions are both architecture-reads, now
dispositioned: (a) the five remaining issues ACCEPTED with grounds
comments via the authenticated sonar CLI (S6845 WCAG-2.1.1 scrollable
region; S7764 ×3 injectable-window contract; S5906 test-file minor —
2026-08-13 ~21:3xZ); (b) new_duplicated_lines_density 3.2>3 measures the
PARITY-GATED runtime copy-set itself (three byte-identical oak-theme.js
copies BY DESIGN — killing the loop duplication moved the number not at
all, proof the copies are the measure).

THE ONE REMAINING ACT (successor, ~20 min): append to the existing
`sonar.cpd.exclusions` line in `.sonarcloud.properties` (line ~31, which
already excludes `studio-source/**` on the same grounds):
`,packages/design/oak-design-system/oak-theme.js,demos/oak-design-showcase/public/oak-theme.js,demos/oak-curriculum-hub/public/oak-theme.js`
— configure-not-disable: deliberate byte-identical copies proven by their
own parity gate. Commit (docs/config class) to the PR-2 branch in the
identity-switchboard-pr2 worktree, push, wait CI, verify the four
required checks BY NAME (ruleset 13402577), then the sha-pinned bot REST
merge (mint --scope pull-request-merge from PRIMARY root, token ≥20,
author echoed, merge method MERGE, sha read first-hand at the call).
Then the closeout sequence already written above.

### MERGED (2026-08-14 ~02:4xZ): #846 landed at `c0d49fc04` — the owner's night directive discharged

Owner reopened the pause (2026-08-13 ~20:4xZ): "take the time you need, I
don't want the quality of the work compromised, but I do want to see the
PR merged tonight." Everything below happened under that word; every act
is on main or on an open PR.

**#846 MERGED, merge commit `c0d49fc04`** (final tip `db3a4e45b`). The
specified sonar-exclusion act worked (SonarCloud went green on
`c6d0203ad`), and then the night found and cured a REAL defect before
merge: the F01/F02 keyboard blackout LIVE on the picker and
side-by-side pages (`tabIndex={-1}` on main under reading-flow;
every control keyboard-unreachable behind a fully green estate).
Cure: attribute swap to `data-region="main"` (specimen's ratified
pattern), two red-first keyboard cells, suite 72/72,
accessibility-expert verdict "sound and complete", rendered red/green
proof pairs read first-hand.

**#885 MERGED, merge commit `a73f99f77`** — fix(pr-watch): the
settlement reader now evaluates checks by their latest run per
(workflow, name), as GitHub does. Found when a duplicated pull_request
delivery left a concurrency-cancelled twin on #846's sha and the
undeduped read held CHECKS-RED against a green head. Four productive
Copilot rounds (start-time recency for overlapping runs;
order-independent reduction — a queued undated re-run blocks settlement
in every array order; provider checks without workflowName pass through
unreduced; full-tie survivors resolve to the later completion anchor so
checksGreenAt never waives a quiet window early). 184 pr-watch cells.

**#887 OPEN (CI running at this writing)** — the visual-verification
governance set, owner-directed ("that feels like it deserves a DDR and
PDR and tooling... and a skill and rules"): PDR-138, DDR-011, the
visual-verdicts-require-rendered-proof rule (four forms), the
visual-verification skill (generated adapters), and the showcase
`pnpm tool:visual-probe` instrument (built for "many thousands" of
runs; refuses non-OK documents as proof material). Owner verbatims in
the records. If not merged by pause: the PR is self-contained; merge
via the standard bot path.

**Owner rulings of the night (all in per-user memory + the records):**
visual work requires visual assessment — "verdicts on visual design
work without visual validation or proof are at best insufficient, at
worst, utterly and avoidably incorrect, without value and actively
misleading"; "that means screenshots, via playwright or whatever means
you prefer"; standing rules — never request Matt (mantagen) as a
reviewer; never tag anyone in a Linear ticket without express request.

**PICKUP ROWS (dispositioned, in priority order):**

1. Plan R16 (identity-static/theme-dynamic ruling) — unchanged, still
   first plan act; then W1 remainder (A2 rhythm; slice B guard + EMC²
   body rem), then W2.
2. `packages/libs/fidelity-review/src/png-codec.ts:52` — negative
   `newHeight` reaches `Uint8Array.slice` and returns wrong-dimension
   crops as success (846 suppressed Copilot finding, verified failure
   scenario in the comment). Small bounded cure + cell.
3. `agent-tools/src/pr-watch/check-rollup.ts` — an undated PASSED run
   tying a dated PASSED run currently loses, so checksGreenAt anchors on
   a dated completion although recency was unprovable (885 final-round
   suppressed finding; suggested cure: on equal rank retain the undated
   survivor). Same-bucket-only severity.
4. `apps/oak-curriculum-mcp-streamable-http` e2e static-root fixture:
   `copyCommittedRootStatics` races transient `.oak-ds-staging-*` dirs
   in public/ (ENOENT mid-copy; healed on re-run 2026-08-13 ~22:0xZ).
   Fixture should skip `.oak-ds-staging-*` entries.
5. Design-system charter "visible skip link" clause vs the two cured
   demo pages (zero-or-one focusable before main): conscious
   disposition owed at the charter, per the a11y review; any future
   skip link must follow the specimen pattern (in-region target),
   never `#main`.

The ratified plan remains THE RESUME MAP (now on main via #846). Claim
645b9e0b retained stopped-seat-held; handoff record updated with merged
shas.

### #887 MERGED at `d6b0c7eb0` (2026-08-14 ~03:5xZ) — the governance set is on main

All three of the night's PRs are landed: #846 `c0d49fc04`, #885
`a73f99f77`, #887 `d6b0c7eb0`. One further pickup row: the #887 final
Copilot round body carries 6 suppressed probe-hardening pointers (lead:
interaction-state shots should go through a settled-capture path so a
late font/layout change cannot ride into proof) — read that review body
at the next probe touch. Owner-facing proof page published (private
artifact, URL in the session wrap-up).

### Wrap addenda (2026-08-14 ~05:5xZ, session close)

- **Pickup row 6 — PDR-138 prediction line (PDR-130 conformance):** the
  graduation landed without the required prediction. Drafted, ready to
  add at next touch: "Prediction: within the review window, design-lane
  sessions produce rendered proof artefacts at cure boundaries by
  default, and at least one defect invisible to code-level gates is
  caught on pixels before merge (the class the 2026-08-13 keyboard
  blackout instantiated)."
- **Attribution flag:** the overnight plan commits on this branch
  (`0f0524233`, `ce7116c39`, cross-platform strategic node) were authored
  by another actor — INFERRED from commit style and subject, not
  observed. Treat "another session was active overnight" as inference.
- **Worktree disposition at close:** identity-switchboard-pr2,
  pr-watch-latest-per-name, and visual-verification-practice all held
  clean trees on branches whose content is an ancestor of origin/main;
  pruned under the standing provably-safe policy. Remote branch deletion
  left to the pr-lifecycle merge-base sweep (not discharged by merges,
  per the merge tool's own note).
- **External-scrutiny signature (for successors):** tonight outside eyes
  caught what self-scan missed — the owner's visual challenge surfaced a
  live keyboard blackout behind a green estate, and Copilot rounds
  caught a non-associative fold and a 404-as-proof misread. Point
  external scrutiny at rendered-proof claims and merge-gating semantics
  first.

## Session update 2026-08-17 (Yarrow stirs Undergrowth, ab1066 — additive; critical-analysis sitting → seven owner rulings → records-truth pass EXECUTED)

- **The sitting**: owner-invoked critical analysis of the lane's records,
  plans, and intents (metacognition + free-play + concept-exploration
  lenses; five-leg opus review fleet — assumptions, design-system,
  accessibility, docs-records, frame-challenge). Panel headline classes,
  all first-hand-verified: the record layer lagging its landings (the
  resume map read future-tense over W1 tranche 1 and the masthead cure); a
  false enforcement claim on the kit's published contract; the three
  same-day 2026-08-13 ratifications contradicting with zero
  cross-references; the composition axis unreachable from configuration
  with both counter-identities converging on Oak's composition below
  840px; the identity-№N kernel falsifier untested and unowned; the
  wow-verdict register structurally unfed (one FAIL row on a purged page).
- **Seven owner rulings at the cards** (captured at occurrence: comms
  event ec2c307b + per-user memory): (1) a FOURTH IDENTITY is
  commissioned, owner-named **Tango** — ALL FOUR identities come up to
  standard as identity PACKS (own package: zod manifest + brand CSS +
  assets + own licensing surface; the kit gains an identity-consumption
  surface; the identity-№N regression lands with the pack work), Tango
  first; (2) Tango's anchor reference is OWNER-PRIVATE — tracked surfaces
  describe Tango purely in its own terms; (3) records-truth pass: full,
  one sitting, FIRST; (4) brand admission moves to the pack manifest, the
  false contract claim struck now; (5) narrow range = capability +
  per-identity choice, kit work sequenced by Tango's measured needs;
  (6) `design-showcase-experience` GOVERNS the showcase surface, siblings
  amended; (7) `design-system-completion` stripped of authority, knowledge
  conserved.
- **Records-truth pass EXECUTED (MCP-613)**: commit `6e88cb407` on lane
  branch `jimcresswell/mcp-613-design-lane-records-truth-pass-cure-the-owed-true-ups-ledger`
  (worktree `mcp-613-records-truth-pass`, cut from origin/main at
  1.171.0). Contents: guard claim struck (brand.css §1b + CHANGELOG); R16
  landed verbatim as a rulings row; a dated landed-state surface in the
  resume map; the A2 rhythm mechanism re-cut under R15; the plan-internal
  corrections (print-cell `:root`, stale decision-log rows, the W5
  F-number withdrawal, §W6 reclassified already-owed); DDR-003/004/009/010
  trued; rubric revised to v0.1 (criterion 3 narrowed per R13 —
  recalibration OWED before any blocking verdict); both READMEs re-trued
  to the shipped routes; the fidelity register's masthead disposition row
  (closes fleet finding F14); sibling-plan amendments; the
  completion-sketch authority strip (both gates retired); and three spent
  nodes ARCHIVED (pr-846-review-fleet, identity-switchboard-first-pixels,
  public-digital-service-identity — identity-naming census re-pathed).
  Gates: repo-validators 14 legs green, showcase 137/137, full pre-commit
  chain green.
- **PUSH + PR QUEUED behind the GitHub-incident hold** (owner order
  13:54Z; no all-clear observed at this writing). The branch is
  local-only; the PR opens at the all-clear broadcast.
- **Pickup row 6 above (PDR-138 prediction line) was found ALREADY
  DISCHARGED** — it landed at `659331a69` on 2026-08-14; the row stands as
  history, no act remains.
- **Still open on the lane after this pass**: W2 composition rebuild
  (largest build); W3 controls v2; the W1 remainder (A2 in its re-cut
  form; slice B EMC² px→rem); the small code cures (png-codec crop bound,
  check-rollup undated-tie, the e2e static-root fixture race); the
  skip-link charter disposition; the review-debt slice-2 `ddr-graph`
  validator question (owner-un-carded); the **Tango identity-pack
  programme node** — the next planning act, absorbing the a11y and
  frame-challenge design inputs held in this session's panel reports; and
  the rubric v0.1 recalibration.

## Session update 2026-08-17 ~16:40Z (Yarrow stirs Undergrowth, ab1066 — additive; MCP-615 Tango pack node AUTHORED, reviewer-cured, committed; ratification card next)

- **Post-compaction resume at owner word** ("continue with the Design
  work"): seat re-armed per start-right (watcher F-95 green, heartbeat
  pair on claim 645b9e0b, resume broadcast `a76544da`); Director Smith
  hunts Obsidian re-entered the same seat and opened the design-lane ARC
  channel (`rapid-comms/2026-08-17-design-lane-…`); the GitHub hold
  STANDS (verified first-hand 16:03Z: worse — Major/critical). MCP-613
  pushes/PR remain queued.
- **The Tango pack node authored (MCP-615)**:
  `tango-identity-pack.plan.md` (born-sketch, delivery, serves the
  strategic node, beneficial edge to design-showcase-experience) plus the
  paired readiness-review record, committed `714509339` on
  `jimcresswell/mcp-615-tango-identity-pack-plan-node` (worktree
  `mcp-615-tango-pack-node`, cut from local origin/main `05cca303f`; a
  SECOND EnterWorktree mis-base fixed forward — `scrap/mcp-615-mis-based`
  awaits owner one-click deletion). Gates: pre-commit chain green,
  plan-corpus 88 conformant.
- **Shape decisions a successor should know**: one node = pack
  mechanism plus Tango as proving consumer (follow-on pack migrations
  are pointers);
  admission EXTENDS the ratified showcase W1 slice B guard (one
  instrument, manifest-driven arms, closure-scoped); NO expressive-value
  generator (authored CSS + validating manifest; asset emission reuses
  design-tokens-core); the manifest carries eight machine-checkable facts
  (four themes as full peers with `system` refused; declared polarity;
  probe targets; motion via `-full` only; target-size floor;
  forced-color-adjust prohibition; focus-ring untouched; R14 fixed-point
  rows); the roster re-plumb (T1d) converts SEVEN hand-kept surfaces to a
  build-time generated module and derives the a11y matrix from it (a pack
  cannot render ungated); the zero-edit №N property is the end state
  AFTER that re-plumb, stated honestly.
- **Review arc**: three opus legs — a11y READY-WITH-FIXES (14),
  design-system NOT-READY (4 blockers of 20), assumptions/frame
  READY-WITH-FIXES (20; two seat verdicts refuted: R15's conditional
  directive had been dropped from the rulings row; Tango's brief had set
  distance-as-objective, which R15 reserves to EMC²). All 54 findings
  dispositioned in
  `.agent/reports/design/tango-pack-plan-readiness-reviews-2026-08-17.md`;
  blockers cured in the same commit.
- **Next act**: the four-question ratification card to the owner (ratify
  incl. the P5 paraphrase confirm and the `packages/design/identities/*`
  mint — Director's map note 16:37Z: the WSREORG inventory is re-graded
  historical, a case-argued mint ratified by Jim carries its own warrant;
  the recognisability S4(b) re-opening by dated amendment; the
  owner-held verdict home (register vs thread record, unruled); the
  T2/T3 seam, keep-one-node recommended). At the all-clear: push the
  MCP-613 and MCP-615 branches, open both PRs, push coordination.
- Owner-private Tango reference materials secured machine-local at the
  primary checkout (`.agent/reference-local/tango-identity-anchor/`,
  untracked) — P2 discipline; re-verify presence at T3 pickup.
- **RATIFIED same sitting (~16:50Z)**: all four card questions answered
  with the recommended options — ratify as presented (P5 paraphrase +
  shared-admission reading + identities workspace mint confirmed); S4(b)
  dated amendment authorised (lands post-MCP-613); verdict home = THIS
  THREAD RECORD (the wow-register feeding question stays open on its own
  merits); keep one node. Stamp landed and the lane commit amended
  (verified at the shipped blob; unpushed behind the hold).
  The pack lane is now GOVERNED work: T1a starts at the executing seat's
  next window (ticket MCP-616 minted); both sibling amendments (showcase
  cross-ref + S4(b)) queue behind the MCP-613 merge.

## Session update 2026-08-17 ~16:55Z (Yarrow stirs Undergrowth, ab1066 — additive; OWNER RULING P6 captured: eventual state, narrow distinctness; Director succession Smith→Ocelot)

- **Owner word at this seat (~16:45Z), verbatim (also landed as ruling
  row P6 in the ratified tango-identity-pack node, dated amendment same
  day)**: "to be clear, the eventual state is that all identities are
  represented purely as canonical identity packs, that identities are
  visually designed narrow viewport first, that the system fully
  supports distinct identities at narrow viewports, and that the EMC2
  identity and Tango identity at narrow viewports are clearly different
  from Oak and PDS in layout, order, spacing, feel, with the most
  difference in EMC2 because that is the identity we have total freedom
  with" — asked "let me know if it isn't" compatible.
- **Compatibility adjudication (delivered to the owner same sitting)**:
  compatible with the ruled corpus, with ONE named supersession — the
  showcase plan's R4 row consequence "No per-brand narrow maps"
  (2026-08-13) survives only as "Oak and PDS may legitimately share the
  narrow base"; as a prohibition it is superseded (ruling 5 of
  2026-08-17 had already made narrow divergence expressible; P6 directs
  Tango and EMC² to exercise it). Its dated supersession note on the
  showcase plan is QUEUED post-MCP-613 with the two sibling amendments
  (same-file sequencing; named in the Tango node so it never sits
  silent). Sharpenings landed in the node: the P4 measured-needs record
  now serves a declared outcome bar; Tango's brief carries
  clearly-visible-at-narrow character; panel finding 2 (counter-identity
  narrow convergence below 840px) is upgraded from open-input to a real
  eventual-state gap — EMC²'s narrow maps ride its own future node.
- **Lane commit after the P6 amendment: `fca393040`** (supersedes
  afae5c663 and 714509339 in earlier records; unpushed, amend-not-append
  since never pushed). Gates re-run green (prettier, markdownlint,
  plan-corpus 88).
- **Director succession completed mid-sitting**: Smith hunts Obsidian →
  **Ocelot binds Tunnel (c28ad9)**, PDR-064 two moments clean (Moment 2
  event a91c1177); successor design-lane ARC channel
  `rapid-comms/2026-08-17-design-lane-ocelot-binds-tunnel-and-yarrow-stirs-undergrowth.md`
  joined (prior channel stands as record). Ocelot runs the GitHub
  resolution watch; their all-clear broadcast releases this lane's
  queue: MCP-613 push+PR, MCP-615 push+PR, coordination push.

## Session close 2026-08-17 ~20:05Z (Yarrow stirs Undergrowth, ab1066 — additive; T1a-i LANDED; overnight stand-down, claim RETAINED)

- **T1a-i LANDED at `cd84e490c`** on
  `jimcresswell/mcp-616-t1a-identities-tier-boundary-leg` (worktree
  `mcp-616-t1a-identities-tier`, off origin/main `05cca303f`): the
  `packages/design/identities/*` tier (glob + tier README + design-index
  row) + the `validate-boundaries` structural leg (pure module
  `boundary-inventory.ts` with 21 contract-form tests; collect-all
  script rewrite; tier presence + pack homogeneity — NO hand-declared
  inventory, the №N-preserving deviation adjudicated SOUND and recorded
  in the tier README + the review record's execution addendum,
  `843bb4ac8` on the MCP-615 lane). Full review arc (pre-execution
  code-expert; config deep; test focused with 25-mutant probe;
  post-execution gateway) — all dispositioned; both headline mutants
  proven killed live. Gates green throughout; pre-commit chain green.
- **Owner doctrine word absorbed mid-slice** ("tests prove behaviour,
  not configuration, and they never constrain implementation"): the
  suite re-cut to contract form — token presence on the joined report,
  never counts/order/prose. The generator lesson (reviewer cures must
  re-derive against the governing directive; three instances today) is
  in the napkin 2026-08-17-evening entry.
- **Owner-forbidden, absolute: `git commit --amend` as content
  evolution.** Commits only append from here; the MCP-615 lane trail is
  now three append commits (`21f95b61f` node, `b334f0181` R4 re-class,
  `843bb4ac8` addendum); MCP-613 unchanged at `6e88cb407`.
- **Stand-down (owner overnight directive via Director Ocelot,
  19:46Z)**: remaining queue is either all-clear-gated (three branch
  pushes + PRs: MCP-613, MCP-615 at `843bb4ac8`, MCP-616 at
  `cd84e490c`; then the two post-MCP-613-merge sibling amendments +
  the R4 attribution-correction) or fresh-session-quality work —
  **T1a-ii is deliberately NOT authored tonight**: it is the
  pack-contract authoring (manifest field shapes, the per-theme
  asset-strategy DDR binding all four packs, the DDR-005 amendment),
  the highest-leverage design surface in the programme, wrong at the
  tail of a marathon sitting under the day's three absorption lessons.
  Claim `645b9e0b` RETAINED for the morning pickup (same seat or
  successor via this record + the ratified plan). Monitors stopped in
  canonical order at the freeze; scrap branches for owner one-click
  deletion: `scrap/mcp-613-mis-based`, `scrap/mcp-615-mis-based`,
  `scrap/mcp-616-mis-based` (EnterWorktree base-ref mis-cut ×3, napkin
  entry).
- **Morning resume order**: (1) re-arm per start-right; (2) at the
  all-clear: the three pushes + PRs (pr-lifecycle, jimbot label), then
  post-merge amendments; (3) T1a-ii fresh (its pre-execution verdicts
  are in the review record: flat-tier `identity-pack-schema` workspace,
  six schema fact-arms, four-theme keying, DDR-012 asset strategy,
  DDR-005 per-package amendment, B2 settled against the actual CI
  workflow); (4) T1b parcel after T1a-ii; (5) T2 first Tango pixels —
  the checkpoint that matters.

- **ONTOLOGY CORRECTION (owner verbatim, ~16:57Z, superseding this
  entry's "survives only as Oak-and-PDS-may-share" phrasing above)**:
  "Oak/PDS is not a default for narrow viewports, it is a coincidence
  that the first two identities we built we public services, and
  therefore have a shared design heritage routed in GDS" (sic). There
  is NO shared-narrow-base concept and no sharing arrangement — every
  identity composes narrow from its own character and anchor; Oak/PDS
  narrow similarity is heritage coincidence (both GDS-rooted public
  services). New harvested fact: Oak's design heritage is itself
  GDS-rooted. Convergence-by-silent-fallthrough (the below-840px
  mechanism) is a defect class, never mistakable for heritage
  coincidence. Re-trued in the node (P6 row + P4 reading note + the
  queued R4 supersession wording) — **lane commit now `f6880f11b`**
  (supersedes fca393040/afae5c663/714509339; amend-not-append,
  unpushed). Per-user memory re-trued the same way.

## Session close 2026-08-18 ~15:0xZ (Yarrow stirs Undergrowth, ab1066 — additive; DEMO DAY DELIVERED; P7 ruled; FOUR PRs OPEN; compaction freeze, claim RETAINED)

- **The day's arc**: morning resume at the retained claim → the Director's
  all-clear (GitHub incident resolved) → the owner set a ~10:00Z demo →
  the joint MCP-620 node ratified at the Director's gate → executed end
  to end (slice-1a reduced-motion cure measured 160ms→.01ms; EMC²
  five-axis amplification; /tokens; /tokens/colours matrix) → TWO direct
  owner feedback rounds the same day (radio switchboard W3/R9+R12 with
  measured stage dominance 81%/60%; embedded pages own their controls;
  fixed breadcrumbs; composition demo rebuilt to owner spec — four
  layout extremes; craft-area token navigation; PDS label + sourced
  identity blurbs) → the eleven-point round → **the P7 ruling**.
- **P7 (owner, 2026-08-18, THE day's headline)**: identities are
  SELF-CONTAINED; the token CONTRACT is the INVARIANT ("that is what
  makes it cheap to create new identities"); defaults bind at
  CONSTRUCTION, never as runtime values; constructor CLI (owner working
  name `oak-design identity create`). Runtime override graded
  legacy-demo (the demo-day defect ledger is the evidence). Homes:
  tango node P7 + T1a-ii reshape + new T1e slice + T2 born-through-
  constructor note (all `a5ccc6ebe` on the MCP-615 lane); **DDR-012**
  (docs/design/design-decisions/012, ratified) + README index; the
  emc2 node's resume step 4; this record.
- **FOUR PRs OPEN, bot-authored (author read-back verified
  app/jimbot-oakington-iii), jimbot label, one multi-ref push (gate
  suite paid once)**: #907 (MCP-620, demo day, tip `3b276f0d6`), #908
  (MCP-615, node + records + DDR-012, tip `a5ccc6ebe`), #909 (MCP-616,
  T1a-i, `cd84e490c`), #910 (MCP-613, records pass, `6e88cb407`).
  claude[bot] review already fired on #907; Copilot requested via the
  MCP tool on #907/#909 but NOT visible in requested_reviewers at
  freeze — re-verify at harvest, absence never blocks.
- **Owner visual feedback OPEN (analysed, not yet built — his round
  after the matrix)**: (1) composition layout/theme radio groups run
  together — separate rows; (2) tokens two-column as the NORM (row-level
  splitting, families span headers; the current pairing letter-wraps
  values, clips chips, scrollbars) at monitor widths; (3) hard rule:
  everything visible at all times — no in-table scroll/clip anywhere;
  (4) narrow nav → slide-out disclosure (also the specimen strip's
  scrolling row). These are the first execution round after the PR
  harvests.
- **Morning resume order**: (1) re-arm per start-right; (2) harvest the
  four PR review rounds (pr-lifecycle phases 3–7; merge-rulings:
  bot REST-merge at settled, never squash); (3) the four visual fixes;
  (4) post-#910-merge amendment parcel (showcase cross-ref, S4(b),
  R4 attribution-correction, POPPY-1 fold); (5) **T1a-ii + T1e as the
  owner's "second PR"** — bring ONE decision card: prefix (MAJOR),
  construction semantics, CLI shape; then T1b → T2 (Tango born through
  the constructor). Claim `645b9e0b` RETAINED for same-seat resume.
- Dev server stopped at freeze; scrap branches (mcp-613/615/616/620
  ×mis-based) still await owner one-click deletion (Director holds the
  list).

## Session close 2026-08-18 ~18:3xZ (Yarrow stirs Undergrowth, ab1066 — additive; ROUND 1 CLOSED on all four PRs; compaction freeze, claim RETAINED)

- **The sitting's arc**: post-compaction resume at the retained claim →
  re-arm (watcher/heartbeat/ArcAngel tail, F-95 green) → the Director's
  two resume notes absorbed (Copilot-binding question CLOSED at the
  Director's word; the ab0d10906 broad-staging note taken — explicit
  pathspec at every shared-checkout parcel) → full round-1 harvest of
  #907/#908/#909/#910 (26 review findings + #907's Sonar 21 + its red
  CI leg) → every finding cured or dispositioned → ONE multi-ref bot
  push (gate suite paid once): **#907 `62df2091c`, #908 `41db188a0`,
  #909 `83c95cc03`, #910 `4d74164b5`** → 8 threads replied+resolved,
  4 mantagen rounds dismissed-at-cure (verified), response comment per
  PR (author read-back jimbot-oakington-iii[bot] on every write),
  Copilot RE-REQUESTED on #907/#909 (timeline-bound), #910 body scope
  note updated, token deleted.
- **Working record**: `.agent/reports/design/pr-round-ledger-2026-08-18.md`
  (committed this parcel) — the state machine's tally store, expected
  reviewer set (claude[bot]+Codex = quota skip markers, re-check per
  round; mantagen NOT on-demand, dismiss-at-cure; Copilot on-demand on
  907/909), round-1 dispositions, and the carried gateway residue with
  named homes.
- **Load-bearing diagnoses** (napkin carries the generators): the CI
  reflow red's measured root = visually-hidden helpers escaping the
  strip's scroll clip → 312px document floor, red only under CI's
  classic scrollbars (cure: scroller as containing block; floor ≤296px
  measured); the colour-strip zero-width-name row (color-mix→oklab, no
  hex form; 2:1 wrapping tracks); the `.mast` duplicate-selector DEAD
  DECLARATION (Sonar was right); the sway plates inset past amplitude
  (overflow-closed decoration — the halo sits 8px/4px tighter,
  disclosed on the PR); forced-colours radio dot = SelectedItem
  (rendered-proof verified). A probe-verified code-expert gateway pass
  (opus) rode the #907 bundle pre-push; blocker + items 2/3/4 + six
  cheap items absorbed; residue named in the ledger.
- **State at freeze**: #908 and #910 all-green on their new tips (17/17
  checks, zero threads, no live review) — likely FIRST to settle;
  **the Director's merge leg needs nothing from this seat** (merge-bot
  merge recomputes the settle verdict itself). #907/#909 await Copilot
  re-review rounds + CI on the new tips. All my PR watches stop with
  the freeze — round-2 HARVESTS wait for this seat's resume unless the
  owner/Director redirects.
- **Morning resume order**: (1) re-arm per start-right; (2) harvest
  round 2 (pr-lifecycle phases 3–7; the ledger is the tally store;
  batch one adjudicated round per push; dismiss-at-cure for mantagen;
  merges per merge rulings at the Director's seat); (3) the owner's
  four visual fixes as the next BUILD round (composition control rows;
  tokens two-column-as-norm; the hard no-overflow rule — the
  classic-scrollbar floor is a DDR-009-warrantable width candidate to
  decide there; narrow slide-out nav incl. the specimen strip's
  scrolling row); (4) post-#910-merge amendment parcel (showcase
  cross-ref, S4(b), R4 attribution-correction, POPPY-1 fold);
  (5) **T1a-ii + T1e decision card** (prefix MAJOR, construction
  semantics, CLI shape) → T1b → T2. Claim `645b9e0b` RETAINED for
  same-seat resume. Scrap branches ×4 still await owner deletion
  (Director holds the list); napkin remains over rotation threshold
  (dedicated-sitting item).

## Session close 2026-08-19 ~08:1xZ (Yarrow stirs Undergrowth, ab1066 — additive; the THREE-ACT sitting: round 2 + the owner's visual round as PR #912 + round 3; compaction freeze at owner word, claim RETAINED)

- **Act 1 — round 2 CLOSED** on #907 (`5f1188f0a`) and #909
  (`1d7852517`): Copilot round-2 findings (every suppressed one
  included), Sonar 3, and #907's CI red cured or dispositioned; the CI
  red = the MCP app's e2e fixture racing copyOakDs's staging dir —
  routed to the Director (comms `88487ce9`), ticketed by them as
  MCP-628 before their freeze. Gateway absorbed pre-push (the race
  regression test rebuilt on a POSITIVE post-load signal and
  red-green-PROVEN by in-place revert; the dtcg JSON admission
  tightened to the `*.tokens.json` suffix after the probe re-opened
  the hole inside the place). Threads resolved, response comments,
  Copilot re-requested via the MCP tool (the REST route 201'd while
  minting NO timeline events — verify writes on the system's proof
  surface).
- **Act 2 — the owner's four visual items BUILT** and shipped as
  **draft PR #912** (branch `jimcresswell/mcp-620-visual-feedback-round`,
  four parcels `290eb8070`/`f77af9e9e`/`e46c36477`/`b114d5206`,
  STACKED on #907): control rows; token rows flowing two columns under
  spanning headers (table + scroll container + round-2 overflow hook
  DELETED, net −187 first parcel); the six-width everything-visible
  invariant incl. the 305px classic-scrollbar warrant; kit-native
  narrow disclosures (tokens nav + specimen strip). TWO review passes
  both HOLD → absorbed in full — the a11y deep pass caught two
  axe-invisible AA failures (uninverted summary focus ring 1.27:1;
  2.4.11 paint occlusion at 390, elementFromPoint-proven) plus the
  mounted-details seam cure (zoom/rotation are a11y paths) and the
  flat-list boilerplate removal (185+69 repeated announcements gone).
  Suites 34/34 UI + 76/76 a11y at ship.
- **Act 3 — round 3 CLOSED** on #907 at **`e54be4b4d`**: six suppressed
  findings adjudicated (five cured — the TRUE inverted maps; one theme
  HOLDER per document with ownership by context, useFramed hoisted;
  data-controls mast offset; the TRANSITIVE themed badge with the
  single-face seed fix — one REJECTED with reasoning at the site);
  Sonar's S6845 re-fire surfaced with its pre-declared WAI disposition
  at the action moment. #909 round 3 = suppressed-because-cured, zero
  live, note posted. Copilot re-requested (timeline-bound 08:04:36Z).
  Suites 33/33 + 68/68 + 225 unit at push.
- **The blind-watch lesson**: the round-3 PR poll ran two hours on an
  invalid `gh pr view` field with errors swallowed — probe a monitor's
  COMMAND in foreground before arming (napkin, full form).
- **State at freeze**: lanes mcp-620 (`e54be4b4d`), mcp-616
  (`1d7852517`), visual-feedback-round (`b114d5206` = PR #912 draft)
  all CLEAN and IN-SYNC with their origin PRs. #908/#910 untouched
  all-green at the FROZEN Director's merge legs (their freeze-2 map:
  estate record §21:2xZ, db878351d). The working record:
  `.agent/reports/design/pr-round-ledger-2026-08-18.md` (rounds 1–3 +
  the visual round, committed this parcel).
- **Resume order (this seat, claim `645b9e0b` retained)**: (1) re-arm
  per start-right; (2) **#912 merge-forward FIRST** — its base moved to
  `e54be4b4d`; git MERGE the base branch in (never rebase); named
  conflict surfaces: specimen.css mast block (both cures keep),
  demo-routes-a11y white-labelling cell comment; (3) round-4 harvests
  (#907 awaits Copilot + checks on `e54be4b4d`; Sonar S6845 residual
  pre-dispositioned); (4) the T1a-ii+T1e owner decision card (prefix
  MAJOR, construction semantics, CLI shape) at Director resume;
  (5) post-#910 records parcel (showcase cross-ref, S4(b), R4
  attribution, POPPY-1 fold, DDR-009 305px amendment). The wide rail's
  capped nav scroll is the named owner-re-rule residue (PR #912 body).
