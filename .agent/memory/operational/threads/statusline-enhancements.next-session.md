---
fitness_line_target: 200
fitness_line_limit: 400
fitness_char_limit: 25000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else conserve-insight-and-delete — never archive/split/rotate/shard (see continuity-practice.md §Disposition of Continuity Surfaces)'
merge_class: index-narrative-tables
---

# Next-Session Record — `statusline-enhancements` thread

**Grounding reference for ALL statusline plans (owner direction 2026-06-15):**
every statusline plan MUST link
[`.agent/research/statusline-inputs-research.md`](../../../research/statusline-inputs-research.md)
— the source-cited contract for what a Claude Code statusline command receives.
Load-bearing constraint: the **terminal theme is not knowable** (no stdin field,
no env var; stdout is captured so no interactive OSC 11 query), and named ANSI
colours are theme-mapped (`BLACK`/`\x1b[0;30m` renders as aubergine under the
owner's theme), so a foreground cannot be matched to the background. Colour with
the theme's own contract (default foreground, optionally `DIM`), never a guessed
or background-matched colour. Linked in the two current plans; carry the link
into any future statusline plan.

**RESPONSIVE LAYOUT IS POSSIBLE — terminal width and height ARE knowable
(owner direction 2026-06-29).** The official page
(`https://code.claude.com/docs/en/statusline`) specifies that Claude Code sets
the **`COLUMNS` and `LINES` environment variables** to the current terminal
dimensions before running the statusline command (Claude Code **v2.1.153+**).
This is the supported way to read terminal size: stdout is captured, so
`tput cols` and language-level width detection do NOT work — `COLUMNS`/`LINES`
are the channel. This **enables responsive statusline layouts**: adapt segment
inclusion, truncation, reflow, and the logo column to the live terminal width
(e.g. drop or shorten low-priority segments on a narrow terminal, widen on a wide
one). A strong candidate for a future enhancement lane. Distinct from the theme
constraint above: the theme is NOT knowable, but the **dimensions ARE**.

The unified Claude Code statusline lane: the Oak-mark logo column plus the
session-shape indicators. Both render through the same `renderStatusline`, so
they are one lane, not two. The original lane (Oak mark + the narrow
solo/peer/directed + wing indicators) is **COMPLETE** on `feat/comms-research`
and its controlling plan is **already archived** (see below).

**The thread is LIVE, not closed — it has a successor.** A superseding plan,
[`session-and-team-state-statusline-icons.plan.md`](../../../plans/agent-tooling/current/session-and-team-state-statusline-icons.plan.md)
(current/, DRAFT, **re-grounded session-state-first 2026-06-15**), replaces the
narrow resolver. Re-grounding (owner 2026-06-15): collaboration state belongs to
the **SESSION** — solo is the floor (never `unknown` for one's own session), and
the agent holds an opinion on owner presence/engagement; **TEAM state** is the
non-trivial derivation of the collective published session states; the statusline
projects this session's slice. **Experimental discovery phase — NOT crystallised
to a PDR/ADR yet.** Its active-agent set unions the published session states
across claims ∪ comms ∪ ArcAngel ∪ sidebars, deduplicated by the (agent_name, id) identity tuple
(PDR-076a, which PDR-095 delegates to), so read-only collaborators count. An interim
improvement landed 2026-06-14 (Orbit stirs Spectrum) ahead of the register:
the resolver is now **session-relative** (team shape gated on a fresh own claim),
a new **`observing`** shape (dim eyes) covers non-member-with-others-active, and
the render module was split into `statusline-ansi.ts` / `statusline-indicators.ts`
/ `statusline-render.ts`.

## Thread scope — all the related surfaces are ONE thread

Owner question (2026-06-14): *are the statusline plans and the terminal Oak
logo/animation work part of the same thread?* **Yes — and this section makes
that explicit, because they were previously scattered with no cross-link.** This
one thread spans:

- **Session-shape indicators** (code): `renderStatusline` +
  `statusline-session-shape.ts` / `statusline-ansi.ts` / `statusline-indicators.ts` /
  `statusline-render.ts` + the successor register plan (below).
- **Oak-mark logo column** (code + research): the `OAK_STATUSLINE_LOGO` 4-row
  glyph column, derived from
  [`research/developer-experience/statusline-logos/statusline-logos.md`](../../../research/developer-experience/statusline-logos/statusline-logos.md)
  (SVG→glyph renderings; SVG is source of truth).
- **Terminal animation** (research, no plan yet): the redraw-free terminal
  animation toolkit at
  [`statusline-logos/terminal-animation-without-redraw/`](../../../research/developer-experience/statusline-logos/terminal-animation-without-redraw/)
  — a future lane of this same thread (animate the Oak mark / indicators), not a
  separate thread.
- **Statusline resolution / operability** (infrastructure, NEW member 2026-06-27): the
  [`comms-and-worktree-operability.plan.md`](../../../plans/agent-tooling/current/comms-and-worktree-operability.plan.md)
  §B1/B2 — pin the statusline *binary* to the primary checkout (so it renders from any
  worktree) and DRY the primary-resolver. WHERE the statusline resolves from, distinct from
  the icons/logo (WHAT it shows); intersects them at `statusline-identity.ts`. See the
  coordination section below.

**Cross-thread note:** statusline lane state is also referenced from the
[`agentic-engineering-enhancements`](agentic-engineering-enhancements.next-session.md)
thread record (§Statusline lane) and from `repo-continuity.md`. This record is
the canonical home for the thread; the agentic-engineering reference is a
historical pointer, not a second owner. Consolidate any future statusline lane
state here.

## Coordinating the three lane members (2026-06-27, Cedar lifts Canopy, Director)

The lane has THREE members through the shared `renderStatusline` / `statusline-identity.ts`
seam: two CONTENT members — session-shape icons and the Oak-logo column — and one
INFRASTRUCTURE member, statusline resolution/operability (the operability plan's §B1/B2; see
Thread scope). They are coordinated, not independent:

- **Sequencing:** the logo plan's WS4.1 lands the `renderStatusline` / `ResolvedLogo`
  signature FIRST (its disposition #8); the session-state plan rebases onto that settled
  signature; the operability §B1/B2 (shim + resolver + composition root) sequences WITH — not
  against — the logo plan's WS4.2 adapter change, because both edit `statusline-identity.ts`.
  Do not land §B2 and WS4.2 in parallel on that file.
- **Gate:** the operability plan is PROPOSED / deep-review-gated and self-flags its Claude Code
  statusline claims as "verify, do not trust" (its claude-code-guide pass erred on
  `--show-toplevel`; the primary is `git worktree list --porcelain | first`). §B1/B2 must
  clear that deep review (architecture-expert + config-expert + a critically-assessed
  claude-code-guide re-pass + an end-to-end test FROM a linked worktree) before it touches
  statusline code the content plans also edit.
- **Scope:** the operability plan as a whole is broader than this lane (it also covers
  comms/claims path anchoring); only §B1/B2 join the statusline lane. This hub is the
  coordination SSOT — record cross-member statusline state here.

## DELIVERED 2026-06-29 (Wyvern mends Draught) — location rows, rate-limit gauges, countdowns

Landed on `docs/consolidations`, commit `708cd57fc` (gate green: 1846 tests, type-check,
lint 0 errors; `dist` rebuilt; rendered live). Plan:
[`statusline-primary-worktree-rows.plan.md`](../../../plans/agent-tooling/current/statusline-primary-worktree-rows.plan.md)
(DELIVERED — ready to archive; recreated the lost `πρ`/`ἔργ` plan). Shipped:

- **Model + context share one row** (logo layout; already co-located in no-logo).
- **Labelled location rows.** Primary checkout: name above branch, no label. Linked
  worktree: primary name, its `coord:`-prefixed branch, then the worktree name and
  branch. Keyed on `coordinationBranch` presence (git's no-same-branch-in-two-worktrees
  rule makes that reliable) — no git-facts gatherer refactor. The `πρ:` label of the
  first design was dropped on owner iteration.
- **Rate-limit gauges + reset countdowns** on the top row after the collaboration icons:
  `s:NN%(2h)` (session/five-hour) and `w:NN%(3d)` (week/seven-day). Consumed-% colour
  ramp; DIM countdown (`formatCountdown`: coarsest of d/h/m, nearest, rollover-promoting,
  past→`0m`). New `statusline-countdown.ts` + `statusline-usage.ts` (the latter split out
  to keep `statusline-segments.ts` ≤250 lines). Parser reads `resets_at` (epoch seconds);
  adapter does the one clock read + `resets_at − now`, keeping formatting pure.

**Future enhancement lanes (owner: more enhancements to come):**

- **Responsive layout** via `COLUMNS`/`LINES` (see the prominent grounding note above) —
  strong candidate.
- **`statusLine.refreshInterval`** set to 10s by the owner (2026-06-29) — the countdown now
  ticks while idle as well as on render events. DONE.
- **Refresh `statusline-inputs-research.md`** with the current-page deltas
  (`footerLinksRegexes`, Windows config, "notifications share the status-line row", the
  `// empty` rate-limit absence idiom) and bump its verified-against version.
- **Statusline trace log (observability — deprioritized below spawn-flow).** Owner observed
  (2026-06-30) the rate-limit/usage percentages "not recalculating on every re-render". Diagnosed
  first-hand: the adapter is a **fresh process per render** with no cross-render cache (bar the
  on-disk logo-frame counter), and `statusline-identity-input.ts` re-parses
  `rate_limits.*.used_percentage` from the stdin payload every render — so the staleness is
  **upstream**: Claude Code refreshes its rate-limit snapshot on its own cadence, identical numbers
  arrive across renders, and the statusline faithfully reflects them (the gauge vanishes when
  `rate_limits` is absent; the reset countdown ticks every render via the clock read, which reads as
  the % being stuck). Because the root cause is upstream, **not a current priority**
  (spawn-flow is).
  The item: an **env-gated disk trace log** (off by default) capturing the raw `rate_limits` subtree
  plus the parsed values and a timestamp per render — to (a) confirm the source value is static
  across renders
  and (b) give this deliberately-silent soft surface the observability it structurally lacks
  (every
  soft-fallback — git-io, the registry read, the experiments listing, each field parse — swallows to
  absent with no trace; only real *throws* render the loud `⚠ statusline:` token today). Build
  test-first when prioritised. (Moved here from the now-ready-to-archive
  `statusline-primary-worktree-rows.plan.md` Follow-ons, 2026-06-30.)

## Current continuation

- **Controlling plan (narrow lane, now ARCHIVED)**:
  [`statusline-session-shape-indicators.plan.md`](../../../plans/agent-tooling/archive/completed/statusline-session-shape-indicators.plan.md)
  ("Statusline Enhancements — Oak Mark + Session-Shape Indicators") — in
  `archive/completed/`, not `current/` (the earlier link here was stale).
- **Successor plan (LIVE continuation)**:
  [`session-and-team-state-statusline-icons.plan.md`](../../../plans/agent-tooling/current/session-and-team-state-statusline-icons.plan.md)
  — session-state-first (re-grounded 2026-06-15): session-owned collaboration
  state (solo floor and owner-presence opinion) → derived team state → statusline
  projection. Supersedes the narrow resolver. Unassigned (Clipper rotated out).
  The 2026-06-14 READY-WITH-CONDITIONS verdict **predates the re-grounding** — a
  fresh readiness pass is required (Conditions B and C/D remain valid execution
  constraints). Experimental discovery phase: no PDR/ADR yet.
- **Sibling plan (same lane) — logo column / reuse**:
  [`statusline-logo-modularisation.plan.md`](../../../plans/agent-tooling/current/statusline-logo-modularisation.plan.md)
  — separates the Oak-mark logo mechanism + asset from the statusline setup for
  reuse, and hardens the soft-fail surface. Shares the `renderStatusline` seam;
  coordinated with the session-state plan, not dependent on it.
- **Landed (mark)**: the Oak acorn mark — a 4-row logo-column, default
  `braille-sharp` via `OAK_STATUSLINE_LOGO` (`braille` / `quad` / `sextant` /
  `none` alternatives). Commits `40ef58a06` + `5cc13977e` + `8efc58d83` on
  `feat/comms-research`, **pushed** (verified `@{u}..HEAD` level 2026-06-13 —
  the earlier "UNPUSHED" note was stale). **Default superseded 2026-06-16 — see
  the live logo swap below.**
- **Landed (live logo swap, 2026-06-16, Vole calls Hollow) — on
  `docs/planning-and-validation`, NOT `feat/comms-research`**: the default mark
  is now a **5×7 sharpened braille acorn** (`braille-sharp`); the prior 4×6 is
  retained as **`braille-sharp-compact`**; `braille` / `quad` / `sextant` /
  `none` unchanged. The logo separator rule is **on by default and width-matched**
  to the active logo (tiled to `[...logoRows[0]].length` code points; an empty
  `logoSeparator` suppresses it). Landed in `oak-logo.ts` + `statusline-render.ts`
  (+ tests); `dist` rebuilt; 1232 agent-tools tests green; rendered live via the
  shim. Owner-directed live swap *ahead of* the modularisation plan, which is
  reframed to **harden** it on execution (relocate data to neutral `oak-acorn.ts`,
  invert the renderer onto the `ResolvedLogo` contract). **Reconciliation
  COMPLETE (verified 2026-06-29):** the 5×7 default, width-matched separator, and
  per-render cycling all landed on `main` (under SHAs distinct from
  `b45a6aedf`/`cb1c6e256`); statusline source is byte-identical across `main` and
  the now-deleted `docs/planning-and-validation` / `feat/comms-research` local
  branches. Nothing is stranded; those two branches were deleted 2026-06-29 as
  fully-absorbed (their unique commits were practice/docs landed via PR).
- **Landed (per-render logo cycling + blink experiment, 2026-06-16, Andromeda holds
  Radiance) — on `docs/planning-and-validation`**: `braille-sharp` now cycles **four
  seeded frames**, one per render, kept per session (`session_id`-keyed counter through an
  injected store), `OAK_STATUSLINE_MOTION` pins frame 0. Frame 0 = the canonical mark; 1–3
  are generator-reproducible variants (seeds 1/2/4). The **blink-survival experiment** is
  recorded (the statusline strips `SGR 5` → blink animation NO-GO; event-driven cycling is
  the viable path, and the toolkit's terminal-only test was corrected). Terminal-animation
  docs deduped; the stale §1 "first line only" claim fixed (multi-line renders). The
  modularisation plan carries the cycle→three-layer reconciliation: the frames are Layer-C
  asset data (WS2.1 gains a frame dimension on the `LogoAsset` contract), `frameIndex` is the
  neutral Layer-B selector, and the renderer's interim `logoFrame` is removed at WS4.1 (the
  adapter resolves the frame and injects the chosen `ResolvedLogo.rows`).
- **Landed (indicators re-fit, 2026-06-13, Skylark wakes Summit)**: WS1 (claim
  `role` field), WS2 (pure session-shape resolver), WS3 (render) — originally
  committed on `feat/statusline-enhancements` against the OLD single-line layout
  (`ac2901fe1` / `1ac430378` / `4270ea49d`) — were brought onto
  `feat/comms-research` and **re-fit into the 4-row layout**: Director demark on
  the identity row, team-icon + ArcAngel wing trailing it; `logo:'none'`
  preserves the single line byte-compatibly. WS5 green (1081 agent-tools tests).
  The old "WS1 paused on an sdk-codegen blocker (`7ca3eba2`)" note was wrong —
  the role-field commit touches no sdk/keywords files; mis-attributed.
- **Landed (WS4 glyphs + unknown/solo, 2026-06-13, Skylark wakes Summit)**: WS4
  glyph terminal verification is **COMPLETE** — all five verified rendering in the
  owner's terminals: Director `🧭` U+1F9ED, directed-team `👪` U+1F46A, peer-team
  `🤝` U+1F91D (replaced `👥` U+1F465, which rendered nowhere), solo `🧍` U+1F9CD,
  ArcAngel wing `🪶` U+1FAB6. Plus a resolver **correctness** fix: an unreadable
  registry now resolves to `unknown` (no team icon — honest absence) instead of a
  false `solo`; a confident solo carries its own marker (`c456cda0d`). WS5 green
  (1081 agent-tools tests).

## Next safe step (the fresh session's first move)

**Owner direction (2026-06-29): the logo work is PAUSED.** The
[`statusline-logo-modularisation.plan.md`](../../../plans/agent-tooling/current/statusline-logo-modularisation.plan.md)
three-layer separation (and the cycling→frame-dimension reconciliation recorded
there) is not the directed focus for now. The live mark on `main` stands as-is.
When the logo work resumes, that plan's grounded-execution-knowledge block (the
`refreshInterval`/WCAG caveat, the `dist`-rebuild note, the variant seeds) is the
entry point. The directed focus is the session-state plan track (below).

The superseded prior direction (2026-06-16) had the next session take the
logo-modularisation plan; that is now paused.

The **narrow** lane is COMPLETE on `feat/comms-research` (all workstreams landed,
five glyphs verified, 1081 agent-tools tests green; commits this arc `a1fb8e9c4`
`5c01ee7ee` `221ee4a9f` test-IO, `c456cda0d` unknown/solo + glyphs). The live
next step is the **successor register plan** (queued, READY-WITH-CONDITIONS —
resolve Conditions A/B/C-D before DECISION-COMPLETE; earmarked for Clipper). The
interim 2026-06-14 resolver improvement (session-relative + `observing` + module
split) is on the working tree, pending commit on `feat/comms-research`.

Carried-over note: `statusline-identity.ts` `listExperiments` uses
`Dirent.parentPath` (Node ≥ 20.12 / 21.4); no engines floor is declared, runtime
is Node 24 — fine in practice, worth pinning a floor. (The earlier WS1
`cli-claim-role.integration.test.ts` real-IO item is RESOLVED — that test was
deleted and its dispatch-allowlist guard re-expressed IO-free; see
`agent-tools-test-io-compliance.plan.md` for the remaining pre-existing test-IO
elsewhere in agent-tools.)

Open hypothesis (routed from the comms-research napkin, 2026-06-14 dedicated
consolidation — UNVERIFIED): the ArcAngel **wing indicator went DARK while two
agents collaborated heavily on a channel** (owner read it as "not in a channel").
Hypothesis: the wing keys on channel **recency** and/or only re-evaluates on a
turn-render, so it goes stale-dark during idle "holding" gaps; it should reflect
channel **membership** (filename substring — both full names are in the channel
filename), static, not render-recency. Needs first-hand verification against
`resolveArcActive` **as it stands after the `da8cbd7d6` resolver/module split** (a
later resolver correctness fix may already have addressed it). Cure direction:
detect on membership independent of render-recency, or re-evaluate the wing on a
cadence. Also a research-relevant collaboration-visibility failure mode.

## Participating agent identities

| Platform | Model | Agent name | Role on this thread | last_session |
| --- | --- | --- | --- | --- |
| claude-code | Opus 4.8 (1M) | Tuna stirs Fathom | Moved the trace-log observability follow-on from the ready-to-archive plan into this record (§Future enhancement lanes) + the repo-continuity index; diagnosed the "% not recalculating" as **upstream** (fresh-process-per-render, no cross-render cache — the recompute is correct); no statusline code touched | 2026-07-01 |
| claude-code | Opus 4.8 (1M) | Wyvern mends Draught | Delivered primary/worktree location rows (name-above-branch; `coord:`+`wt:`), model+context on one row, and Claude.ai rate-limit gauges with reset countdowns (`s:`/`w:`, `formatCountdown`, `statusline-usage.ts`); recreated the lost `πρ`/`ἔργ` plan; deleted stale local branches (all on main); added the COLUMNS/LINES responsive-layout grounding note. Commit `708cd57fc` on `docs/consolidations`; gate green (1846 tests) | 2026-06-29 |
| claude-code | Opus 4.8 | Andromeda holds Radiance | Per-render `braille-sharp` frame cycling (four seeded frames, `session_id`-keyed counter via an injected store, `OAK_STATUSLINE_MOTION` off-switch); recorded the blink-survival experiment result (statusline strips `SGR 5` — animation NO-GO, truecolor survives); deduped the terminal-animation toolkit docs + fixed the stale §1 multi-line claim; updated the modularisation plan with the cycle→three-layer reconciliation. agent-tools green (1256 tests, build); verified live. On `docs/planning-and-validation` | 2026-06-17 |
| claude-code | Opus 4.8 | Vole calls Hollow | Owner-directed live logo swap ahead of the modularisation plan: 5×7 sharpened `braille-sharp` default, 4×6 retained as `braille-sharp-compact`, width-matched logo separator rule on by default; reframed the modularisation plan to harden the live swap on execution; updated the plan + this record. On `docs/planning-and-validation` (branch divergence flagged). Green (build, type-check, lint, 1232 tests) | 2026-06-16 |
| claude-code | Opus 4.8 | Hearth hunts Obsidian | Trailing separator row beneath the four-row logo block as a `logoSeparator?` option (`DEFAULT_LOGO_SEPARATOR`), tests decoupled from the glyph (inject-a-probe); separator now `${DIM}` (theme-robust default-fg — terminal theme is not knowable, design verdict). Fixed two ANSI bugs in the branch styling (a `0;`-prefixed `BLUE` cancelled `BOLD` → render colour-before-bold; removed dead/wrong `RESET_BOLD`+`BLACK`); branch tests made behavioural (content+placement, not bytes); `statusline-ansi.ts`+render test converted off literal-ESC to `\x1b` escapes. Linked the inputs research doc in both current statusline plans. Green (my slice); uncommitted — another agent commits/pushes (see napkin) | 2026-06-15 |
| claude-code | Opus 4.8 | Cutter spins Quay | Re-grounded the successor plan session-state-first (session owns collaboration state; solo is the floor; owner-presence opinion; team state derived); consolidated and cross-referenced the statusline lane; ran docs and four architecture reviewers and recorded validated dispositions; added the logo-modularisation plan | 2026-06-15 |
| claude-code | Opus 4.8 | Orbit stirs Spectrum | Interim session-relative resolver + `observing` shape + ansi/indicators/render module split; refined the successor register plan (claim-independent active-agent set) + readiness pass; seeded PDR-095 | 2026-06-14 |
| claude-code | Opus 4.8 | Skylark wakes Summit | Re-fit WS1–WS3 onto the 4-row layout; unknown-vs-solo resolver fix; WS4 glyphs verified; test-IO compliance; corrected this record + plan | 2026-06-13 |
| claude-code | Opus 4.8 | Bilby hunts Eventide | Oak mark landed; lane unified; thread opened | 2026-06-13 |

Prior, on the indicators half (pre-unification, `feat/statusline-enhancements`):
Monsoon guards Cirrus authored WS1–WS3 against the single-line layout, and the
2026-06-12 statusline redesign merged as PR #198.

## Landing target for the next session

**Landed 2026-06-15 (commit `ed563765d`):** the successor plan is re-grounded
session-state-first (collaboration state belongs to the session; solo is the
floor — never `unknown` for one's own session; the agent holds an owner-presence
opinion; team state is the derivation of the collective), renamed
`session-and-team-state-statusline-icons.plan.md`, held as experimental discovery
(no PDR/ADR). The statusline lane is consolidated and cross-referenced; the docs
and four architecture reviews (barney, betty, fred, wilma) are recorded as
validated dispositions in both plans. A sibling
`statusline-logo-modularisation.plan.md` was added.

**Next safe step:** a fresh readiness pass on the re-grounded plan (the 2026-06-14
verdict predates the re-grounding), then execute WS1 (the session-state model).
Both plans are `current/`, unassigned. **The logo lane is paused (owner
2026-06-29)** — the modularisation plan and any logo hardening are not the
directed focus for now. The earlier reconcile/`dist`-rebuild step is **DONE**: the
5×7 default, width-matched separator, and per-render cycling are all on `main`,
and the `docs/planning-and-validation` / `feat/comms-research` local branches were
deleted 2026-06-29 as fully-absorbed. **Do NOT archive
this record** — the thread is live. Unrelated follow-on: the pre-existing agent-tools test-IO
compliance tracked in
[`agent-tools-test-io-compliance.plan.md`](../../../plans/agent-tooling/current/agent-tools-test-io-compliance.plan.md).
