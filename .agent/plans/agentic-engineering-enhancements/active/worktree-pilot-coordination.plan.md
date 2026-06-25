---
name: "Worktree Pilot — Director Coordination"
status: active
overview: >
  Coordination plan for a 3-agent, multi-session effort: a long-lived Director
  (minimum-action, primary checkout, cross-session continuity carrier) presiding
  over two ephemeral Implementers, each isolated in its own git worktree on a
  feature branch off a shared coordination branch. Delivers two workstreams
  (WS-A Vitest instability-workaround removal; WS-B explain-lens as an MCP
  resource) while serving as the first real exercise — and evidence capture —
  for the worktree-per-agent transition and the Director/minimum-action model.
lineage:
  serves_thread: agentic-engineering-enhancements
  serves_stream: agent operating substrate / developer-and-agent experience
  strategic_choice: >
    multi-developer transition (one-dev-many-agents -> many-checkouts,
    variable agent density, author-agnostic substrate)
  derives_from: >
    worktree-per-agent-transition.plan.md (future); the Director/minimum-action
    operating model (owner-framed 2026-06-24); F-83 shared-checkout coupling
---

# Worktree Pilot — Director Coordination

> Owner-framed 2026-06-24 (session "Snowdrop calls Topsoil - director: worktree
> pilot"). This plan is the Director's externalised continuity thread: the seed
> a successor Director session rehydrates from. It is owned by the Director seat,
> not by either Implementer.

## SUCCESSOR HANDOFF — Borealis binds Lightyear (PDR-064 Moment 1, 2026-06-25)

> Nightjar weaves Moonbeam (5f31e4, Director) is preparing handoff (context-deep
> after a long multi-part session). **Borealis binds Lightyear is the named
> successor Director.** PDR-064 pre-positioning (information transfer only);
> authority transfers when Borealis broadcasts an active-acknowledgement (Moment 2).
> Rehydrate from THIS plan + the live comms Director continuity snapshot
> (event `dd536b3d`, 2026-06-25T07:52Z) + the napkin's 2026-06-25 entries + PDR-117
>
> - `feedback_director_pure_direction_only`. On takeover, open your own Director
> claim (replace `c6b76ae3`), Moment-2 ack, re-arm the watcher (note: it recurs on
> a drain-timeout — foreground-sweep fallback), and STOP Nightjar's heartbeat loop
> if still emitting (false-liveness risk).

### CURRENT STATE — 2026-06-25 morning (Nightjar → Borealis)

**Live team (n=3 + Director):** Thyme lifts Compost → #222 Proto-dispatch fix
(`Object.hasOwn` guard + proto-key test), THEN resumes Sonar S8707 sites 2-3
(paused claim `ff3da671`; warm worktree `oak-sonar-p1`, site-1 committed
`1329d787a`); also holds DATA-SOURCES.md post-#222. Callisto turns Gloom → WS-B D2
drift-check gate-wiring (the one pre-merge follow-on; F-84 prove-fail-first).
Retired clean — route NOTHING to them: Ferret (pr-watch → handed to Thyme),
Lapwing (Sonar site-1), Whirlwind (WS-E), Snowdrop/Lagoon (prior Directors).

**Open verdicts the Director owns (inherit these):**

- **WS-B D2** (`4adea4aca` on `pilot/ws-b-explain-resource`): ACCEPTED-IN-SUBSTANCE
  (Option A curated body + drift-guards, both reviewers approved, body inspected).
  Pre-merge condition: Callisto's drift-check gate-wiring lands → then **non-ff**
  merge to coordination (it is 7 ahead, coordination moved under it via WS-E).
- **#222** (pr-watch, direct-to-main): 3/4 findings clear; Thyme finishing the
  Proto fix. Then **verify the PR's INLINE review comments first-hand** (not just
  `gh pr checks` — that blind spot hid the Proto finding) before relaying merge-ready.
- **Sonar S8707 sites 2-3** (direct-to-main): Thyme, post-#222; one PR.

**PR #221 and the pilot-bundle decision (owner's call):** PR #221 carries
WS-A/C/D/E plus templating; green, mergeable, all bot findings dispositioned
(verified first-hand 2026-06-25). WS-B D2 and Comet's WS-D experience file
(`44484d478`, one ahead of coordination, unfolded) are still coordination-bound.
So the OWNER chooses: merge PR #221 now (WS-A/C/D/E) with WS-B D2 following in a
second coordination→main merge, OR hold PR #221 for the complete pilot bundle
(after WS-B D2 and the fold). The main-merge gate is @jimCresswell code-owner
review; no `--admin`.

**Owner-gated (waiting on owner):** PR #221 review (ready) plus the pilot-bundle
choice; PR #222 review (after the Proto fix); DATA-SOURCES suitability/removal
CRITERIA ratification (governance policy, ADR-157 deliberately lacks them).

**Deferred (Director-owned, for the dedicated consolidation pass — NOT done this
handoff):** napkin rotation (over its 300-line limit); the PDR candidates
(owner-away keep-going-until-complete-then-pause primitive; route-nothing-to-a-
closing-out-agent; the missing claims adopt/set-handoff CLI primitive;
curate-don't-mechanically-slice-prose 2nd instance; routing-lags-fast-implementers
so verify the target's current state and route lanes not pickups; stop the
Director heartbeat at stand-down to avoid false liveness); fold Comet's
`44484d478`; the pilot's worktree/Director-model evidence into the
worktree-per-agent plan. Full session lessons live in the napkin's 2026-06-25
entries (uncommitted-on-disk; the napkin rotation + commit is the due dedicated
consolidation pass).

---

**(2026-06-24 baseline below — superseded by CURRENT STATE above for live status;
the standing instructions and on-takeover steps remain live.)**

**On takeover:** open your own Director claim (the retained claim
`8e754f9a-ec11-4444-a03a-550368d7ca18` is held for you — replace it), broadcast
your active-acknowledgement (Moment 2), and re-arm the awareness surfaces: comms
watcher; the PR-#221 monitor (`scratchpad/pr221-monitor.sh loop`); heartbeat once a
consuming peer is present. My monitors die with my session.

**Standing owner instructions absorbed this session (carry these):**

- Lens-resolve Implementer questions before escalating; asking the owner is always
  legitimate — the lenses refocus, they do not gate (PDR-117 §routing-contract).
- Don't obsess over machine/swap state; the real signal is load-vs-cores
  (`feedback_dont_obsess_over_machine_swap_state`).
- When you create tooling, ask if it should become a permanent agent-tools command
  (`feedback_ask_whether_tooling_should_be_permanent`).
- Masking an empty/absent test suite is no-warning-toleration — remove the mask AND
  fill the suite (`feedback_no_masking_of_empty_or_absent_tests`).

**Team state:** the two pilot implementers (Whippoorwill wakes Dreamscape, WS-C;
Comet seeks Equinox, WS-D) retired clean — all work merged, nothing stranded; both
ran owner-directed deep adversarial sweeps and routed durable residue to the
continuity carrier (on the comms stream; see the deferred consolidation pass
below). Lapwing weaves Downdraft is live on the SEPARATE
`main-sonar-ai-profile-to-zero` thread (PRs direct to main, not the pilot) and is
checkpointing its Sonar Phase-1 between cycles.

**PR #221 (coordination → main) — OPEN, awaiting owner code-owner review, NOT
merge-ready yet.** 6 commits ahead of main; CI green (run-quality-gates, CodeQL,
SonarCloud all SUCCESS); Vercel preview Ready. Two valid bot findings must land
before merge, both fixed by WS-E: (1) Cursor Bugbot — `vitest.e2e.config.base.ts`
still sets `passWithNoTests: true`, which the workspace e2e configs INHERIT, so the
per-workspace removals are no-ops/regressions while the base stays lenient (the
base override is the real masking target); (2) Copilot — machine-local `/Users/...`
paths in three plan files violate `no-machine-local-paths`. Do NOT merge #221 until
WS-E corrects both on the coordination branch.

**Workstreams:**

- **WS-A** (vitest forks→threads): MERGED to coordination (`6d80d119e`).
- **WS-B** (explain as an MCP surface): D1 committed (`pilot/ws-b-explain-resource`,
  gate-green, reviewed). D2-D5 pending a fresh implementer (the committed plan is
  the handoff; deep handoff `28adb2ac` + verified addendum `8492de46`). At D2:
  inspect the generated BODY first-hand + route a focused architecture pass on the
  drift-gate wiring (Director reservations); the curriculum-adjective soft-edge is
  for the owner's eye.
- **WS-C** (vitest standardisation): MERGED to coordination (`d84fb9619`).
- **WS-D** (PDR-117 + start-right-team §3 routing clause + AGENT.md pointer): MERGED
  to coordination (`95033a0a7`). Comet's additive experience file `44484d478` on
  `pilot/ws-d-roles-doctrine` is UNMERGED (additive, fold when convenient).
- Plan tracked at `20d61cb74`.

**Open lanes (all need an implementer SESSION the owner launches — you route, you
cannot dispatch them):**

1. **WS-E — PR #221 merge-readiness (recommended first; gates the open PR):**
   genuine e2e suites for `curriculum-sdk` + `search-cli` per testing-strategy.md's
   STRICT definition (a running system over its protocol channel, no FS/network IO,
   classification by behaviour-shape — never an imagined e2e; if a workspace
   genuinely has no running-system surface, surface that rather than fake-fill);
   remove the `vitest.e2e.config.base.ts` `passWithNoTests` override (atomic with
   the suites so the gate stays green); template the `/Users/...` paths in the 3
   plan files. One branch off coordination → merge → #221 merge-ready.
2. **pr-watch agent-tools command** (owner: build now): a parameterized TypeScript
   command under `agent-tools/src/` taking a PR number; covers review comments +
   issue comments + CI checks + terminal state (the napkin PR-monitor coverage
   lesson baked in); TDD; test-expert + config-expert in-lane. The scratchpad
   `pr221-monitor.sh` serves until it lands.
3. **Sonar Phase-1 continuation** (Lapwing's lane): the path-validator
   `assertPathWithinBase` is built + security-GO'd (held uncommitted in worktree
   `oak-sonar-p1`); 3 security-sensitive site refactors remain (containment bases:
   site-1 `.turbo/runs`, site-2 git-dir, site-3 `apps/oak-search-cli/diagnostics`)
   → security-expert re-review → one PR direct to main.
4. **WS-B D2-D5** (above); **DATA-SOURCES.md** (`docs/governance/`, owner-confirmed).

**Deferred consolidation pass (yours as continuity carrier, when the pilot thread
closes):** fold the implementers' deep-handoff residue from the comms stream into
durable homes — the trailing-echo false-green harness lesson (Whippoorwill, a strong
distilled candidate); host-recovery + worktree mechanics → plan §Research Capture;
the heartbeat-CLI + grep-glob frictions → frictions-register; the succession +
merges → repo-continuity §Active-threads. Durable on comms now; deferred to avoid
colliding with Lapwing on the shared napkin/main-sonar files.

## Problem and Intent

A multi-session, multi-agent effort needs continuity across the births and deaths
of the agents doing the work. Implementers must act intensively (touch source,
run gates, iterate) and so exhaust their context budget and retire young. If the
continuity-carrier acts the same way it dies the same way, and the cross-session
thread dies with it or is reconstructed expensively from lossy durable artefacts.

**Intent.** Separate the seat that must act (Implementer, ephemeral) from the
seat that must persist (Director, long-lived). The Director persists by **minimum
action** — it consumes compressed verdicts, not raw artefacts, so its context
metabolism is slow enough to span many Implementer generations. Worktrees give
each Implementer its own working tree and index so the doing is isolated; the
Director centralises the awareness. Architecture and operating principle are one
idea in two layers: **isolate the doing; centralise the awareness.**

## End Goal, Mechanism, and Means

- **End goal:** two workstreams delivered to a coordination branch and merged to
  `main` through owner code-owner review, with the Director session outlasting
  both Implementers and the worktree model exercised end-to-end.
- **Mechanism:** `resolveCoordinationHome` resolves every worktree's comms to the
  one primary home, so worktree-isolated agents stay mutually visible; the
  Director routes and synthesises rather than executes, keeping its context lean.
- **Means:** the operating contract, the two delegation briefs, the merge
  ordering, and the research-capture log below.

## Operating Contract

- **Director — long-lived, primary checkout (`Snowdrop calls Topsoil`, f07539).**
  Holds the map; routes; absorbs compressed verdicts only; writes only
  load-bearing continuity; runs no gates and edits no source. Decision rule for
  acting itself: *only if it changes my routing AND no cheaper agent can absorb
  it.*
- **WS-A Implementer — ephemeral, worktree `<repo-parent>/oak-pilot-ws-a-vitest`,
  branch `pilot/ws-a-vitest-stability`.**
- **WS-B Implementer — ephemeral, worktree `<repo-parent>/oak-pilot-ws-b-explain`,
  branch `pilot/ws-b-explain-resource`.**
- **Coordination plane (shared):** comms auto-resolve to the primary home;
  `active-claims.json` reached by explicit absolute `--active` (see Worktree
  Mechanics below).
- **Branch topology:** `coordination/worktree-pilot` off `main`; each Implementer
  on a feature branch off it, merging back; coordination branch reaches `main`
  only through owner code-owner review (never `--admin`).

## Worktree Mechanics (verified 2026-06-24, F-41/F-83 evidence)

- **Comms auto-resolve.** `comms send|watch|validate|inbox` resolve the
  coordination home to the primary checkout via `resolveCoordinationHome`
  (`git worktree list --porcelain`, first entry). Run normally from any worktree;
  comms land in the shared home and all seats see each other.
- **Claims need an explicit absolute `--active`.** `claims open|close|list|
  heartbeat` take a required `--active <path>` with no default and no
  `--repo-root`. From a worktree, a relative path writes a worktree-local file
  invisible to peers. Implementers MUST pass
  `--active <repo-parent>/oak-open-curriculum-ecosystem/.agent/state/collaboration/active-claims.json`.
  **Candidate structural cure (worktree-transition evidence):** wire
  `resolveCoordinationHome` into the claims `--active` default, mirroring comms.
- **No shared-index contention.** Each worktree has its own index, so the
  commit-queue ceremony (which exists for single-shared-index contention) is
  unneeded here; each Implementer commits to its own feature branch with the lean
  explicit-pathspec path. This is an F-83 benefit to record.

## Delegation Brief — WS-A: Vitest instability workaround

- **Goal:** Remove the Vitest instability workaround (the ci-and-test-efficiency
  thread's top item) and measure its effect on test performance and stability.
  Land the removal if evidence supports it, or produce an evidence-backed
  decision to retain with the root cause named.
- **Owned surface:** the Vitest config(s) carrying the workaround (confirm via
  `.agent/plans/developer-experience/future/ci-vitest-pool-threads-migration.plan.md`
  and the ci-and-test-efficiency thread; candidate is a forced pool/threads or
  `fileParallelism`/serialisation setting in `vitest.config.base.ts` or
  per-workspace), and CI timing. **Not** the MCP app, **not** `register-resources.ts`.
- **First acts:** `start-right-quick`; locate the thread + top item + the exact
  workaround; author the WS-A executable plan as its cycle-0.
- **Evidence (value by measurement, not one green run):** before/after wall-clock
  timings on a host-health-aware basis; stability via K repeated full-suite runs
  with a flake count.
- **Acceptance:** workaround removed with measured perf gain AND stability
  evidence; or a documented retain-decision with the underlying instability root
  cause named.
- **Stop/escalate:** if removal reintroduces flakiness with no quick root cause,
  stop and surface — do not re-paper with retries (`no-warning-toleration`).
- **Reintegration:** merge `pilot/ws-a-vitest-stability` -> `coordination/worktree-pilot`
  first (behavioural coupling, below); Director reviews verdict; owner reviews to `main`.

## Delegation Brief — WS-B: explain lens as an MCP resource

- **Goal:** Make the `explain` orientation lens discoverable and followable by
  general AI assistants via the Oak MCP connector — a high-priority resource
  aimed at agents, carrying a "when to fire" description, so a connected assistant
  given "tell me about <repo URL>" reads the resource and follows the explain
  process instead of improvising. Determine what is possible and design the
  content, routing, and metadata.
- **Owned surface:** `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts`
  - tests; the explain resource content **derived from / pointing to**
  `.agent/skills/explain/SKILL-CANONICAL.md` as the single source of truth — do
  not duplicate the lens (respect the family-across-portability-seam, PDR-112 /
  ADR-202). **Not** Vitest config, **not** WS-A's surface.
- **First acts:** `start-right-quick`; consult `mcp-expert` on resource
  annotations (`audience`, `priority`) and whether a resource can carry firing
  guidance; read `register-resources.ts`, the explain canonical, and the
  `documentation-resources` e2e tests; author the WS-B executable plan as cycle-0.
- **Discovery to resolve:** does MCP resource metadata support the
  audience/priority/firing-hint shape needed? Inline content vs pointer? How does
  one source of truth stay coherent with the skill canonical?
- **Evidence:** spec-grounded design; unit + integration + e2e (`resources/list`
  surfaces it, `resources/read` returns the process); a value-proxy showing an
  agent given an orientation trigger follows the explain routing.
- **Acceptance:** resource registered with correct metadata; e2e green;
  documented feasibility + content/routing/metadata design; value demonstrated by
  a real connected-assistant trial or close proxy.
- **Stop/escalate:** if the spec/SDK cannot support the firing-priority mechanism
  as envisaged, stop and surface the constraint with options — the feature shape
  is the owner's.
- **Reintegration:** merge `pilot/ws-b-explain-resource` -> `coordination/worktree-pilot`
  after WS-A; Director reviews verdict; owner reviews to `main`.

## Parallel Safety and Merge Ordering

- **File scopes are disjoint** — WS-A touches Vitest/CI config; WS-B touches the
  MCP app's `register-resources.ts`. No textual collision.
- **One behavioural coupling** — WS-A may change `vitest.config.base.ts`, which
  the MCP app's tests inherit. If WS-A destabilises tests, WS-B's gate runs feel
  it once WS-A lands on the coordination branch. **Cure: WS-A's measurement lands
  first**, so WS-B rebases onto a proven-stable base.

## Research Capture (this run is evidence for two models)

Appended by the Director as the run proceeds.

- **Worktree-per-agent transition** (success signals in
  `../future/worktree-per-agent-transition.plan.md`): record F-83
  incidents/non-incidents — mid-edit co-commits, shared-`dist` cleans,
  cross-agent gate-RED, lock contention (expected: zero, since indexes are
  per-worktree), and the claims-`--active` friction above.
- **Director / minimum-action model:** record whether the Director session
  outlasts both Implementers, whether minimum action held (actions taken vs
  routed), and any continuity loss at session boundaries.

### Log

- 2026-06-24 — Plane stood up: `coordination/worktree-pilot` off `main`
  (9e9844015); two worktrees created; comms watcher armed; Director claim opened.
  Worktree mechanics verified (comms auto-resolve; claims need explicit
  `--active`). No F-83 incident yet (setup phase).
- 2026-06-24 — Both Implementers live and isolated: Juno tracks Apogee
  (d58962) WS-A, Swordfish tracks Driftwood (4fe4cf) WS-B; clean created_at
  yield, claims open, heartbeating. Worktree frictions captured F-85..F-92.
- 2026-06-24 — **WS-B feature-shape OWNER DECISION: option C (tool + resource
  - prompt).** A resource that auto-fires/auto-follows on an orientation
  trigger is INFEASIBLE — MCP resources are client-controlled, no server-driven
  auto-read, ChatGPT surfaces ~0 resources to the model (mcp-expert, spec
  2025-11-25 + ADR-058). Only a model-controlled TOOL fires on an NL trigger
  (house pattern, ADR-058/ADR-123, like get-curriculum-model). **Content-home:
  APP-local** (architecture-expert betty) — SDK placement violates ADR-041
  (apps depend on sdks, never reverse) + cohesion + SDK self-containedness.
  Shape: app-local `scripts/` generation step reads
  `.agent/skills/explain/SKILL-CANONICAL.md` -> committed
  `src/generated/explain-content.ts` constant, imported by the tool handler,
  the `docs://oak/explain.md` resource, and the prompt (one body, no
  duplication; PDR-112/ADR-202 honoured). WS-B is fully app-local — no SDK
  extension, no cross-workspace claim.
- 2026-06-24 — **WS-A trial: `pool:threads` flake-free** (3/3 runs, 24/24
  workspaces, 0 fails). The `isolate:true`+`pool:forks` workaround is safely
  removable on correctness grounds — the no-global-state doctrine + ESLint
  removed its process.env-race precondition. Value reframing: the brief's
  "8-9 min CI lever" was the whole quality-gate; the test phase alone is
  ~20-25s, so the local gain is modest (~20%), larger on CI; host contention
  (load 33/14) makes magnitudes noisy. Juno verdict PROCEED (correctness-primary).
  Next: min-of-5 -> commit flip -> Director verdict review -> owner review to main.
- 2026-06-24 — Worktree/Director model evidence: no F-83 incident (no
  shared-tree collision, no `.git/index.lock` contention) — worktree isolation
  holding. Director session persisting across both lanes via minimum action
  (routing + verdicts + load-bearing continuity only; no implementation, no
  self-dispatched reviewers — Juno ran the trial, Swordfish dispatched betty).
- 2026-06-24 — **WS-A MERGED to coordination** (fast-forward to `6d80d119e`).
  Director verdict-review accepted first-hand: minimal correct diff (`forks` ->
  `threads`, `isolate:true` retained, misleading comment corrected), gate-green
  97/97, config-expert + test-expert both `commit`, perf honestly unclaimed
  (correctness-primary). `coordination/worktree-pilot` now carries the threads
  base. Juno closing out (lane complete). Awaiting owner code-owner review for
  `coordination -> main`. WS-B rebases onto this base when ready.
- 2026-06-24 — WS-B scope-fidelity steer issued (event `2e7d5148`): Swordfish's
  cycle-0 narrowed to "server/curriculum orientation, not whole-repo"; Director
  steer (carrying owner's repo/ecosystem-orientation intent) to pressure-test
  that the embedded/generated body can be as broad as the lens, and put
  projection-fidelity to assumptions-expert before D1 content. Open.
- 2026-06-24 — Both Implementers stood down clean. Juno (WS-A) closed earlier
  (claim closed, WS-A merged). Swordfish (WS-B) closed at the cycle-0 boundary:
  the cycle-0 PLAN is committed (`1d3938ec6` on `pilot/ws-b-explain-resource`,
  1 ahead of coordination, gate-green), D1-D5 NOT started (PDR-063 clean
  handoff; the committed READY plan is the handoff artefact). Claim `f9e6a413`
  closed. Team now n=1 (Director only).
- 2026-06-24 — **OWNER SEPARATION PRINCIPLE (supersedes part of the committed
  WS-B plan — successor MUST apply before D1):** content about the Oak
  CURRICULUM and content about the Oak EFFORT to deliver it (MCP, repo,
  Practice) must stay ABSOLUTELY SEPARATE; ~99.9% of teachers do not care about
  repo structure or the Practice. The committed WS-B cycle-0 plan routes the
  explain tool to CURRICULUM surfaces (`get-curriculum-model`, EEF) — this
  CONFLATES the two domains and is forbidden. **Corrected shape:** explain is
  EFFORT/ECOSYSTEM-domain — orient to how Oak delivers curriculum, sourced from
  STABLE effort docs (README/VISION, excluding the live progress report per the
  lens honesty invariants), as its OWN separated surface (separate namespace,
  audience = minority/assistants, LOW-salience for teachers), a tool description
  scoped to fire ONLY on effort-orientation triggers, NEVER on curriculum
  queries, NEVER routing into curriculum data. Steer sent to Swordfish
  (`11e5986d`) but it stood down ~the same time, so the correction is NOT yet in
  the plan. **Owner confirmation pending; the committed WS-B plan must be
  corrected before any successor builds D1.** The Director seat caught this
  across the Implementer's retirement — the pilot's own continuity thesis.

- 2026-06-24 — **Worktree isolation VERIFIED first-hand** (owner's direct
  question). Both feature branches are bound to their own worktrees (git
  enforces one-branch/one-worktree), so every commit on them was necessarily
  made from that worktree; both worktrees carry `node_modules` (install + gates
  ran there); both worktrees are clean (work committed); the primary checkout
  carries ZERO stray WS-A/WS-B source changes (no shared-tree leakage, no F-83
  collision). WS-B's branch correctly sits on the threads base `6d80d119e`
  (Swordfish rebased as instructed). Conclusion: source/gate/index isolation
  held perfectly; the captured frictions (F-85..F-93) are all bring-up /
  ergonomics, NOT isolation failures — a strong positive signal for the
  worktree-per-agent transition. One nuance (not a breach): the coordination CLI
  ran from the primary checkout because a fresh worktree ships no agent-tools
  dist (F-90), which is correct behaviour (the CLI writes the shared home
  regardless of cwd), not a source-isolation breach.

- 2026-06-24 — WS-B deep handoff received from Swordfish (comms event ~12:50,
  on disk). Pickup notes for the fresh WS-B implementer: SDK shapes pinned in
  the plan — `structuredContent` with NO `outputSchema`; reuse
  `formatToolResponse`; explain tool via a NEW app-local `registerTool` seam
  outside the generated-tools loop; single-object prompt content. Consolidation
  substance (pattern candidate: *projecting a live-routing / non-baking skill
  onto a remote MCP surface = bake the BEHAVIOUR shell, route CONTENT to MCP
  surfaces*) lives on the comms stream for pilot-consolidation folding into
  `patterns/`. **First act for the fresh WS-B implementer:** correct the plan to
  the effort-domain shape (owner separation principle; no curriculum-surface
  routing), re-run readiness reviewers, then D1.
- 2026-06-24 — HOST-HEALTH flag: swap 6.9G/8G, load peaked 81/14 during gate
  runs. Bears on launching two more heavy worktree sessions (each needs
  `pnpm install` + gate runs); surfaced to owner before the next pair launches.

- 2026-06-24 — WS-A deep handoff received from Juno (comms ~12:54, on disk).
  Open items folded: **(D1)** the `coordination -> main` review carries an
  honesty point — WS-A's original acceptance (removal with a MEASURED perf gain
  - stability) was UNSATISFIABLE as written (the 8-9 min premise was a
  whole-gate misread; test phase ~20s; forks/threads locally indistinguishable);
  WS-A landed on CORRECTNESS, **reframed not met-as-written** — surface to owner
  at the main review. **(D2)** CANDIDATE for the CI-efficiency prong:
  `apps/oak-search-cli` keeps `pool:forks` citing a logger module-state issue
  (`configureLogLevel`) and `test-isolation-architecture-fix.md` — but that doc
  now lives under `.agent/plans-old-archive/archive/completed/` (archived /
  completed), so the issue may be FIXED and search-cli's forks STALE / revertible
  to threads; the next CI implementer verifies and flips if so. **(D3)**
  `isolate:false` as a further lever is gated on the 15-file `vi.mock` backlog;
  LOW priority, flag-don't-chase. Note: ADR-078 is cited in the commit message,
  not the config comment. Consolidation candidates are on the comms stream for
  pilot-consolidation folding.

- 2026-06-24 — Second pair launched; both declared WS-B (singleton-lane
  collision). Resolved by first-broadcast: **Sturgeon rides Driftwood** (c5406c,
  14:38:32) OWNS WS-B; **Narwhal calls Buoy** (939428, 14:39:29) yielded cleanly
  (textbook dialogue-over-competition self-organisation by the implementers —
  worked instance). Director-routed Narwhal to the COMPLEMENTARY CI-efficiency
  prong (**WS-C**): worktree `<repo-parent>/oak-pilot-ws-c-ci`, branch
  `pilot/ws-c-ci-efficiency` (off threads base `6d80d119e`); ready first
  candidate = the search-cli `pool:forks` staleness (Juno's D2). Relayed the
  owner-confirmed WS-B effort-domain scope to Sturgeon (`61482d83`) to preempt
  redundant owner-asks (both were about to re-ask the owner a question I already
  had answered — the Director-as-carrier preventing owner double-prompting
  across sessions). HOST-HEALTH updated: swap ~9.97G/11G (up), CPU calm; WS-C
  needs a fresh install (F-90), gated on a host-health snapshot.

- 2026-06-24 — Narwhal (WS-C) NOT started: first-hand check shows no
  `node_modules` in `oak-pilot-ws-c-ci` (no install), no Narwhal claim in the
  registry, worktree clean at the branch point; silent ~22 min despite the WS-C
  redirect (`3d1ce69e`) and a light check-in (`caa691d5`). Narwhal had declared
  it was blocking on a named gate — the owner's platform-suitability answer —
  before proceeding; that gate is RESOLVED (Director verdict `b2df31b6`:
  Sturgeon stays WS-B, Narwhal takes WS-C). Open question: whether Narwhal has
  received that resolution. Surfaced to the owner (live in Narwhal's session) to
  confirm state, since the owner holds the session channel the Director lacks.
  Hypothesis (UNCONFIRMED — confirm before logging as a friction): an agent
  blocking on owner input in its session may not act on Director comms, a
  Director-unreachable idle state. WS-C (the CI prong) is therefore not yet
  progressing; WS-B (Sturgeon) is healthy.

- 2026-06-24 — WS-B corrected plan COMMITTED (`a5359c462`, gate green 97/97,
  effort-domain, READY). Reviewers re-folded no-backfill: assumptions-expert
  READY-WITH-CHANGES (3 genuine Critical catches — (1) the README itself carries
  point-in-time prose [Invite-Only Alpha, 37-tools, as-of-month], so the
  volatility firewall genericises ALL such claims, not only the progress report;
  (2) curriculum firewall reframed tool-name-negative -> DOMAIN-negative
  [describe the effort, never describe curriculum; naming curriculum as what the
  effort SERVES is allowed] — the sharpest expression of the owner separation
  principle; (3) `lastModified` pinned to newest source-file commit date, not
  wall-clock); mcp-expert CORRECT (SDK 1.29.0 shapes hold; `audience=['assistant']`,
  `priority 0.2` = low-salience-for-teachers). Director ratified against the
  owner principle. D1 starting (generated effort-orientation body, TDD); D1
  verdict routes to Director at the cycle boundary. Zero F-83 incidents; worktree
  index isolation clean.

- 2026-06-24 — Narwhal (WS-C) UNBLOCKED and accepted WS-C ("Owner + Director
  both confirmed"). Both lanes now active: WS-B (Sturgeon, D1) and WS-C (Narwhal:
  host-health snapshot -> ground ci-and-test-efficiency -> confirm the search-cli
  candidate -> claim -> build). The earlier blocked-on-owner-input hypothesis
  appears partly borne out — the owner's session nudge was the unblock; Director
  comms alone did not reach the idle agent. Consistent with
  `owner-action-is-not-a-cure`: a possible missing autonomy primitive (an agent
  blocking on owner input goes Director-unreachable until the owner responds).
  Flagged for pilot-consolidation examination; not yet logged as a confirmed
  friction (mechanism only partially confirmed).

- 2026-06-24 — TEAM ROUTING PROTOCOL fully specified by two complementary owner
  standing instructions: (i) to the Director — answer Implementer questions;
  lens-resolve ambiguous ones (`principles.md` §Decision Lenses); escalate to the
  owner only when all five lenses genuinely fail OR the decision is constitutively
  owner's; asking Implementers to self-review with the lenses is endorsed. (ii)
  to Implementers — surface questions/decisions to the DIRECTOR, not the owner;
  the Director is the single owner-interface and escalates as needed. Net:
  Director = single owner-interface; Implementers route to Director; Director
  lens-resolves and escalates only when warranted. ENCODING (Narwhal's question,
  **lens-resolved by the Director, NOT escalated** — a worked instance of
  instruction (i)): the implementer-routes-to-coordinator / single-owner-interface
  norm lives as a CLAUSE in `start-right-team` §3 (it refines the existing
  coordinator-routing model — complement to coordinator-delegates-sub-agent-launches;
  `new-rule-vs-pdr-clause` favours a clause over a standalone rule; adds no
  always-loaded surface). Authoring routed to Narwhal (bounded, non-blocking,
  after its WS-C cycle-0 plan); pilot-consolidation fallback. Captured in Director
  memory (`feedback_director_pure_direction_only` refinement). HOST: Narwhal's
  snapshot — high swap-used but 45% mem free + low pageouts = not thrashing;
  WS-C install proceeding.

- 2026-06-24 — Routing-protocol clause: BOTH implementers confirmed encoding (a)
  and independently adopted the route-questions-to-Director norm (Sturgeon got
  the same owner instruction in its own chat). Sturgeon's two refinements folded
  into the spec: (1) cross-ref **PDR-074 P2** (the Director's escalation half —
  owner-decision-elision via substrate-resolution) so the implementer-half and
  Director-half read as ONE contract; (2) the clause is Practice doctrine — land
  on the coordination branch or a dedicated doctrine change, NEVER a feature
  branch. Authoring DECISION revised: NOT routed to a feature-branch worktree
  (Narwhal cannot reach the coordination branch from its WS-C worktree — git
  one-branch/one-worktree). Fold at pilot-consolidation on the correct branch;
  full spec conserved here — option (a); PDR-074 P2 cross-ref;
  coordination/dedicated branch; clause text = implementer-routes-to-Director /
  Director-is-single-owner-interface / owner-only-if-the-Director-defers-up,
  the complement to coordinator-delegates-sub-agent-launches in `start-right-team`
  §3. Norm is live behaviourally regardless.

- 2026-06-24 — Owner CLARIFIED the Vitest goal: remove ALL non-standard config,
  use the v4.1.9 DEFAULTS wherever possible (supersedes the narrower "remove
  isolate:true + pool:forks"). DIRECTOR CORRECTION of own earlier framing:
  `isolate: true` IS the Vitest default, so "use defaults" = DELETE the redundant
  explicit `isolate:true` lines (behaviour UNCHANGED, isolation stays on) — NOT an
  isolate-OFF migration; the ~15-file `vi.mock` migration idea I floated was wrong
  and is DROPPED (that would only apply to `isolate:false`, which the owner did
  not ask for). WS-A reframe: its `forks`->`threads` flip swapped one explicit
  pool value for another; "use defaults" wants the explicit pool LINE deleted
  (use the default). The v4.1.9 default pool (forks vs threads) is the deciding
  fact — Narwhal to verify authoritatively, NOT assumed. WS-C goal now =
  standardise all Vitest config to defaults: delete every explicit `pool`/`isolate`
  matching the default; keep a deviation only with a proven current justification
  (verify search-cli + field-integrity module-state reasons — search-cli's tracker
  is archived); likely amend WS-A's base pool line. End state: minimal-to-zero
  explicit pool/isolate. Narwhal corrected (supersedes `7b67720f` via `3c5f27ed`);
  owner answered. (Also: WS-B D1.1 landed `69f9f4e9` gate-green, D1 verdict at the
  generated-body boundary; tentative worktree note — `format:root` may not reliably
  clean a worktree file second-pass, direct `prettier --write` did; undiagnosed.)

- 2026-06-24 — WS-B D1 shape decision (Sturgeon; lens-resolved by Director;
  root-finding surfaced to owner). Verbatim behaviour-shell extraction from the
  explain canonical FAILS on real content — it bakes the canonical's in-repo
  live-routing + fs-coupling into a remote surface (correctness failure; fixtures
  hid it). VERDICT: curate a PORTABLE behaviour projection (discernment / 3 modes
  / honesty / access-aware, NO live-routing) — Sturgeon's rec, ratified — anchored
  to the canonical with a DRIFT-GUARD test (single-sourcing as a tested
  relationship, preserving PDR-112/ADR-202; a hand-maintained constant alone would
  erode it). Effort-overview extraction stays (firewall holds). ROOT FINDING
  (flagged to owner, follow-on, NOT WS-B scope now): the explain canonical
  CONFLATES portable behaviour with in-repo routing; the LTAE fix is to decompose
  it so any surface extracts the portable part cleanly (no drift-guard needed) —
  but that refactors the owner's orientation lens (PDR-112/ADR-202), a separate
  scoped change. WS-B ships app-local now (ship-independent).
- 2026-06-24 — Owner directive: fully define Director + Implementer roles,
  discoverably, with this session's lessons, for future sessions. Director
  sourced the substantive draft (`director-implementer-roles.draft.md`, this
  collection) as continuity work; lived Implementer-role lessons solicited from
  Sturgeon + Narwhal (boundary-task, non-blocking, `a387e577`); graduation
  (PDR + start-right-team clause + graduate `feedback_director_pure_direction_only`
  - RULES_INDEX touch, gated, on coordination) routed to an implementer seat.

- 2026-06-24 — Vitest DEFAULT pool EMPIRICALLY confirmed = `forks` (+ `isolate`
  defaults true), triangulated 3 ways (v4.1.9 type-defs `@default 'forks'`; the v4
  resolver `pool ??= 'forks'`; a bare-config run; + pre-WS-A base/search-cli/
  field-integrity all forks). CONSEQUENCE: WS-A's `forks`->`threads` flip moved
  AWAY from the default; under use-defaults it REVERTS (delete the base
  `pool:threads` pin -> default forks). Owner directed the simplification directly
  to Narwhal: remove all custom (non-default) config + run `pnpm check` xN to
  verify. WS-C COLLAPSES to a verified revert-to-defaults: delete the non-default
  `pool`/`isolate` PINS (deleting `pool:forks`/`isolate:true` pins = no-ops;
  deleting WS-A's `pool:threads` reverts to forks), KEEP functional config
  (include/exclude/coverage/setupFiles/e2e-timeouts/manifest). search-cli logger
  question MOOT (forks is the default — keep it, drop the redundant pin); the
  logger-DI/file-sink reviewer folds fall away (no flip). SAFE (forks isolation ⊇
  threads -> `pnpm check` green); only cost is forks-slower-per-file (owner traded
  the unproven WS-A perf bet for standardisation). Narwhal executes the
  pin-removal in its WS-C worktree (gated, merges via the pilot flow — NOT editing
  the shared primary, which would re-create F-83); routes the result to the
  Director for verdict review, then owner to main.

- 2026-06-24 — WS-B "blocked" label was STALE (Director verified first-hand:
  Sturgeon had landed `00dd0cd71` + was building `generate-explain-content.ts`;
  its watcher received verdict `da051bfa`). The ping-before-escalate work-evidence
  check correctly avoided a needless ping. D1 verdict ACKed; drift-guard design
  concrete (fingerprint the canonical behaviour sections; fail on divergence ->
  re-curation = tested single-sourcing). NEW EXPLAIN AUDIENCES (owner-directed to
  Sturgeon; recorded as DEFERRED pre-ship requirements, not built): education
  experts (impact + sources), product experts (impacts, non-eng requirements,
  compliance), leadership/compliance/cross-functional (sources surfaced in MCP +
  semantic-search apps, adoption, suitability-review, last-reviewed, removal
  criteria) — all effort/governance-domain. CROSS-CUTTING follow-ons routed to
  Director: (a) audience-angles/content in the explain CANONICAL — coordination-
  branch doctrine; (b) **DATA-SOURCES.md** governance surface (owner-floated; no
  home today — ADR-157/152 lack review/removal) — placement docs/governance
  (lens-resolved); commit-to-maintain is owner-shaped (confirming); explain POINTS
  to it, firewall forbids baking review dates; (c) curriculum firewall refines —
  provenance-naming allowed, curriculum-content-description forbidden (Sturgeon
  building D1 extensible). **CANONICAL-REFINEMENTS follow-on bucket** now =
  {portable-vs-routing decomposition; new-audience angles} — coordination-branch
  doctrine, sequence as a WS-D or at pilot-consolidation.

- 2026-06-24 — WS-B D1 VERDICT (Director): ACCEPTED in shape (commit `56202f155`,
  gate-green, 7 files). Curated `EXPLAIN_BEHAVIOUR_SHELL` + effort-overview,
  verified on REAL sources (zero fs-coupling / volatility / curriculum leaks;
  verbatim leak gone); 12 firewall assertions green; DRIFT-GUARD = tested
  single-sourcing (fingerprint canonical behaviour → assert live==EXPECTED → fail
  loud; fingerprint `26466bf2`). Generated body DEFERRED to co-land with its D2
  consumer (knip / widget-html pattern). Director conditions: (1) confirm the D1
  implementation had a reviewer pass (test-expert / code-expert) before/at D2 — it
  is the foundation D2-D5 build on and encodes the owner separation principle;
  (2) Director inspects the actual committed body first-hand at the D2 review.
  Sturgeon's first-hand Implementer-role lessons folded into the role draft
  (verify-on-REAL-artefacts-not-fixtures = the sharpest). NEXT: D2 resource → D3
  tool → D4 prompt → D5 value-proxy. (Narwhal's role lessons pending at its boundary.)

- 2026-06-24 — WS-C verdict (Narwhal, RATIFIED by Director, doctrine-grounded).
  KEEP-SET: (1) pool/isolate pins STAY REMOVED (use-defaults; green x3 + full-removal
  green); (2) smoke/experiment `testTimeout`/`hookTimeout` + `maxWorkers:1`
  RESTORED — FUNCTIONAL, not cruft (smoke tests do live-ES IO, verified first-hand;
  testing-strategy §Smoke permits it; live-ES latency > 5s default; maxWorkers:1
  prevents ES contention); (3) `passWithNoTests:true` — posture to owner
  (Director recommends REMOVE = use-defaults [default false] + strict; currently a
  no-op; future empty-test workspaces would fail-loud). FALSE-GREEN finding: `pnpm
  check` does NOT run `test:smoke`/`test:experiment` (live-ES, deliberately outside
  the gate) — so the owner's full-removal looked green but would break smoke/
  experiment invisibly; the keep-set restores their functional config. So "remove
  all custom config" refines to "remove non-default PINS, KEEP functional config."
  GATING COORDINATION ISSUE: the owner edited the PRIMARY checkout by mistake
  (worktree slip) — 6 vitest files, 31 deletions, uncommitted in the primary's
  coordination working tree. They BLOCK the coordination merge (coordination is
  checked out in the primary). Owner-authorised UNWIND needed (their edits +
  destructive — owner discards, or authorises Director to restore to `6d80d119e`).
  Then Narwhal finalizes the keep-set on `pilot/ws-c-ci-efficiency`, Director
  merges to coordination, owner reviews to main. Surfaced to owner: false-green +
  passWithNoTests posture + the primary unwind.

- 2026-06-24 — WS-C keep-set PREPARED in `pilot/ws-c-ci-efficiency` (6 files, 17
  deletions: pins removed; smoke/experiment/e2e timeouts + `maxWorkers:1`
  RETAINED; `passWithNoTests` RETAINED conservatively). Worktree diff is
  BYTE-IDENTICAL to the pins-only state verified green x3 → no re-run needed on
  merge. Narwhal restored the functional lines via FORWARD-ONLY edits — the
  `never-use-git-to-remove-work` hook correctly blocked `git checkout --` as
  destructive (worked instance; the SAME constraint applies to the primary unwind:
  discard via editor or forward-only / `git show <ref>:<file> > <file>`, never
  `git checkout`). HOLDING for the two owner gates (passWithNoTests posture;
  primary unwind), both surfaced to owner. On clear: if REMOVE passWithNoTests,
  Narwhal applies the one-line deletion + a fresh green (a NEW change); if KEEP,
  ready as-is. Then Director merges `pilot/ws-c-ci-efficiency` → coordination
  (WS-A pattern) → owner review to main.

- 2026-06-24 — WS-B D1 reviewer gate SATISFIED + re-committed `1516e3cbb`.
  test-expert + code-expert (both APPROVE-WITH-CHANGES, folded; Sturgeon
  self-corrected that they should have run real-time during D1 — no-backfill).
  REAL LEAK closed: the curriculum firewall stripped only level-3 subsections, so
  a kept section's capability-TABLE preamble leaked structure vocab ("lessons,
  units, threads…") — fixtures missed it, the real README caught it; fixed with
  `stripTableRows`, REAL-README-verified, regression-tested. Audit-shaped test
  (asserted SHA-256 hex, not drift-guard behaviour) deleted. 12 tests green.
  Director call on the architecture pass: PRECEDENTED points accepted inline
  (module placement, tracked-body per widget-html, app-scripts-linted); a FOCUSED
  architecture-expert pass on the NOVEL surface (codegen-drift gate wiring +
  generated-body lifecycle) routed to Sturgeon for the D2 BOUNDARY (composes with
  the Director's first-hand body inspection there). → D2.

- 2026-06-24 — Sturgeon's retire-at-D1-boundary vs continue-to-D2 question:
  Director gave a PDR-063-budget-driven FRAMEWORK (default CONTINUE; retire only
  if its budget can't cover D2-D5 with margin) rather than deciding by fiat —
  because the deciding input (the implementer's remaining budget) is FIRST-HAND to
  the implementer, not visible to the Director ([[feedback_context_loss_probe_is_first_hand_only]]).
  Weighting given: the continuity thesis is already proven this session (Juno
  retired; Swordfish→Sturgeon was a fresh-pickup handoff), so rotation-for-testing
  is redundant; retiring would stall WS-B on an owner-launched fresh session while
  the owner has two pending WS-C gates. **Director-role lesson (for the role
  PDR):** when a routing decision turns on information first-hand to the
  implementer (budget, local state), the Director supplies the decision framework
  - cross-cutting weighting, not a fiat verdict.

- 2026-06-24 — Sturgeon RETIRED at the clean D1 boundary (its own PDR-063 budget
  call, made correctly per the Director framework — first-hand budget, its call;
  chose the clean boundary over a risked forced mid-cycle retirement later). WS-B
  D1 COMPLETE: 4 commits ahead on `pilot/ws-b-explain-resource`
  (`00dd0cd71`/`69f9f4e92`/`56202f155`/`1516e3cbb`); reviewed (test-expert +
  code-expert), gate-green, 12 tests; claim `a4c9785c` closed; worktree clean;
  nothing retained. The committed READY plan is the D2 handoff artefact (same
  shape as Swordfish→Sturgeon — third clean fresh-pickup handoff this session).
  Team now n=2 (Director + Narwhal) until a fresh D2 implementer joins. D2 awaits
  a Director+owner-routed fresh implementer (reuses the warm worktree). PRE-SHIP
  GATE (owner, recorded `00dd0cd71`): the new expert audiences + DATA-SOURCES.md
  must be worked into explain before this group ships, or descoped — Director-
  coordinated cross-cutting (SKILL-CANONICAL + DATA-SOURCES.md), joins the
  canonical-refinements bucket. OWNER PENDING (consolidated): (1) WS-C primary
  unwind; (2) WS-C passWithNoTests posture; (3) launch a fresh WS-B D2 implementer;
  (4) DATA-SOURCES.md commit decision.

- 2026-06-24 — Narwhal chose Option A: COMMITTED the WS-C keep-set (`88b69e8a8`)
  to `pilot/ws-c-ci-efficiency` + RETIRED (PDR-063 clean boundary). Keep-set now
  DURABLE on the branch (verified-green conservative version: pins removed,
  functional config retained, passWithNoTests retained). **Team now n=1 (Director
  only) — both implementers retired cleanly, all work committed, nothing
  stranded.** WS-C LANDING still gated on owner: (1) primary unwind (the 6
  mistaken edits in the primary block the merge); (2) passWithNoTests posture (if
  REMOVE → a fresh implementer adds the one-line + green, then merge; if KEEP →
  merge directly). WS-B D2 awaits a fresh implementer. **Director PERSISTS as the
  continuity carrier** — coordination pressure is DORMANT, not cleared (WS-B
  D2-D5, WS-C merge, role-PDR graduation, the pre-ship gate, the
  canonical-refinements bucket, and the two coordination→main merges all remain);
  re-routes when the owner re-engages. Heartbeat consumer-absent (both
  implementers retired); re-arms when a fresh implementer joins. OWNER PENDING:
  WS-C unwind + passWithNoTests; fresh WS-B D2 implementer; DATA-SOURCES.md commit.

- 2026-06-24 — **DIRECTOR SUCCESSION + WS-C/WS-D LANDED (Swordfish stirs Lagoon,
  8ed804).** PDR-064 two-moments handoff Snowdrop calls Topsoil → Swordfish stirs
  Lagoon ran clean (Moment-1 pre-positioning `2ae1bd33`; Moment-2 ack `02ac8e2d`;
  successor claim `8e754f9a` open, Snowdrop's `57cd50e2` closed) — zero map-loss
  rehydration from this plan + the (now-graduated) roles draft. Two fresh
  Implementers routed and landed: **Comet seeks Equinox (525501) → WS-D doctrine**
  (PDR-117 Director+Implementer roles + start-right-team §3 routing clause +
  AGENT.md pointer; RULES_INDEX deliberately untouched, reviewer-confirmed; both
  reviewers folded at authoring time, gate-green `6d6893a4e`); **Whippoorwill wakes
  Dreamscape (9ee6df) → WS-C finalisation** (disposition A: `passWithNoTests`
  removed from 6 files, e2e-base DEFERRED with a documented breadcrumb because its
  removal reds the gate on 2 pre-existing empty e2e suites — a lens-resolved
  finding; functional smoke/experiment timeouts retained; gate-green `d84fb9619`).
  **Owner-authorised primary-unwind executed (no-loss verified first-hand):** the
  owner's 11 over-aggressive uncommitted vitest edits forward-restored to base; the
  correct state comes back via WS-C (the owner's smoke-timeout + e2e-base
  over-removals correctly NOT replicated). **Both merged to coordination**:
  WS-C ff `d84fb9619`; WS-D merge `95033a0a7` (disjoint files); coordination now
  **5 ahead of main**. The roles draft RETIRED (PDR-117 subsumption first-hand
  confirmed, no-tombstones). Owner standing instruction captured: lens-resolve
  Implementer questions before escalating, asking-is-legitimate (now in PDR-117 §
  routing contract + `feedback_director_pure_direction_only`); "stop obsessing over
  machine/swap state" → new memory `feedback_dont_obsess_over_machine_swap_state`.
  **STILL OPEN:** coordination→main via owner code-owner review; WS-B D2-D5 (warm
  worktree `oak-pilot-ws-b-explain`, handoff inputs `28adb2ac`/`8492de46`); the
  **empty-e2e follow-on** (curriculum-sdk dead-config retirement = lens-resolved;
  search-cli empty `e2e-tests/` = gap-vs-vestige, owner-shaped if a real gap) which
  then completes the e2e-base `passWithNoTests` removal; DATA-SOURCES.md;
  per-user-memory slim-to-pointer for `feedback_director_pure_direction_only`.

## Non-Goals

- Not promoting the worktree-per-agent plan to `current/` — this run generates
  evidence toward its promotion trigger; promotion stays a separate owner-scoped step.
- Not changing the comms/claims coordination protocol.
- Not many-machine distribution.

## Acceptance Criteria

1. WS-A: acceptance met per its brief (removal with evidence, or evidence-backed retain).
2. WS-B: acceptance met per its brief (resource registered, e2e green, value demonstrated).
3. Coordination branch merged to `main` through owner code-owner review.
4. Research capture populated for both the worktree and Director models.

## Lifecycle Triggers

- **Refinement:** each F-83 incident or worktree-mechanics finding sharpens the
  worktree-per-agent plan and is logged above.
- **Completion:** when both workstreams meet acceptance and the coordination
  branch merges; run the consolidation workflow and fold worktree/Director
  evidence into the worktree-per-agent plan and doctrine.
- **Archival:** per ADR-117 after completion.

## Foundation Alignment

- `principles.md` Second Question ("would this be simpler if the system
  changed?") — the lens behind worktrees and the Director model.
- `start-right-team` SKILL; `comms-all-channels-watcher`, `liveness-heartbeat-cron`,
  `respect-active-agent-claims`, `no-machine-local-paths`, `no-warning-toleration`.
