# design-system-integration — next-session record

Thread: the AIP-137 design-system integration (ADR-213; plan
`.agent/plans/architecture-and-infrastructure/current/design-system-integration.plan.md`).
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
