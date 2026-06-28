---
fitness_line_target: 200
fitness_line_limit: 320
fitness_char_limit: 20000
fitness_line_length: 100
fitness_content_role: reference
merge_class: index-narrative
---

# Director Handoff — Central Pick-Up Point

The single in-repo file an agent reads to **become the Director** of a
multi-session, multi-agent effort, and the one place the current Director
**hands off** from. It has two layers held apart by their change-rate:

- a durable **Director Brief** (sections below up to `CURRENT HANDOFF STATE`) —
  plan-agnostic, the operational instance of the role doctrine: how to take the
  seat, the readiness gate, the standing lessons, the routing contract. It does
  not change between handoffs.
- a volatile **`CURRENT HANDOFF STATE`** section that the sitting Director
  refreshes at every handoff — who is live, what is open, what is owner-gated.

The role doctrine itself is
[PDR-117](../../practice-core/decision-records/PDR-117-director-and-implementer-roles.md);
this file is its operational entry point — read PDR-117 alongside, do not
duplicate it here. The **work** the Director directs lives in a guiding plan
(see _The work you direct_ below); this file carries the role, never the
work-TODO.

This file exists because succession kept relying on a scattered, half-uncommitted
rehydration path (a thread-specific plan seed plus a per-user memory plus a comms
snapshot). On 2026-06-25 a successor broadcast a Moment-2 acknowledgement,
immediately retracted it as "premature/erroneous", and stood down — the takeover
had nothing solid to land on. This file is that solid thing: the brief is what a
successor lands on; the readiness gate is what the failed takeover lacked.

## The work you direct

The Director directs a **guiding plan**, not this file. The current effort's plan
is named in `CURRENT HANDOFF STATE`. The strategic root is the
worktree-per-agent transition (move from one-dev-many-agents on a single shared
checkout to many-checkouts / variable-agent-density with an author-agnostic
substrate); the operating model under trial is the Director + ephemeral-Implementer
contract itself. The current effort's **adjudication obligation, if any** — for
example whether this arc's acceptance must test the operating model rather than
merely whether the lanes shipped — is stated in the guiding plan named in
`CURRENT HANDOFF STATE`, not here; this brief stays plan-agnostic so it sticks to
the seat, not to any one pilot.

## How to take the Director seat

1. **Read this brief end to end**, then PDR-117 (minimum-action; route, do not
   execute; single owner-interface; the Implementer→Director→owner routing
   contract) and the Standing Lessons below.
2. **Rehydrate the live state** from the `CURRENT HANDOFF STATE` section and the
   surfaces it names — the guiding plan (work detail), the comms stream (recent
   events), `active-claims.json`, `repo-continuity.md`, and the napkin's recent
   entries.
3. **Readiness gate — BEFORE you claim authority** (the gate the failed takeover
   lacked). The five questions below are the context you must be able to answer
   from rehydration, not assumption — but **answering them in prose is not the
   gate; the mechanical liveness check is.** You may only broadcast a Moment-2
   acknowledgement after BOTH (a) you can answer all five and (b) you have run the
   mechanical liveness check and pasted its output.
   - Who are the live implementers, what lane is each on, and which claims do
     they hold? (If the team is dissolved, who — if anyone — is operating, and
     under what direction?)
   - What open verdicts do you own, and what is each one's pre-merge / acceptance
     condition?
   - What is owner-gated versus team-doable right now?
   - What is the single next safe step?
   - **Is the outgoing Director actually standing down** — heartbeat stopped, or
     it pre-positioned you?

   **Mechanical liveness check (MANDATORY — paste its output before Moment-2).**
   Do NOT compute the outgoing Director's last-event age by hand and do NOT read
   any local clock. Run the tool and let it compute the age in UTC against a UTC
   `--now`:

   ```bash
   # The tool parses claimed_at (bumped on every heartbeat) and --now as UTC
   # epoch-ms and emits age_seconds + freshness_status itself — no local clock,
   # no mental arithmetic. Source: claim-reports.ts age_seconds = nowMs −
   # Date.parse(claimed_at), both UTC.
   pnpm agent-tools:collaboration-state -- claims active-agents \
     --active .agent/state/collaboration/active-claims.json \
     --now "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
   ```

   Read the outgoing Director's `freshness_status` and `fresh_until` from the
   tool's output. A `stale` Director (or one whose heartbeat you have confirmed
   stopped) is genuinely standing down; a `fresh` one is still live — do not take
   the seat over it without a pre-position. If you ever need a single claim's age,
   `claims status --active <path> --now <utc-iso>` prints the same UTC-computed
   `age_seconds` / `fresh_until` per claim. **Never** compare a `…Z` timestamp
   against a local wall-clock: on 2026-06-25 a successor read a `07:52Z`
   pre-position against an `~08:50` local-BST clock, computed a false 58-minute
   coordinator-less gap, and broadcast a premature Moment-2 — yet `07:52Z` _is_
   `08:52` BST. The tool's UTC-to-UTC computation makes that error structurally
   impossible; mental arithmetic does not.

   If you cannot answer all five questions, or the check is not pasted, you are
   **not ready** — keep rehydrating; do not acknowledge. A premature
   acknowledgement is worse than a slow one, and an authority/coordination action
   gets the **highest** verification bar: ground the load-bearing fact first-hand
   before acting, most strictly when the premise conveniently licenses the action.
4. **Take authority (PDR-064 Moment 2).** Open your own Director claim (replacing
   the retained one named in `CURRENT HANDOFF STATE`), broadcast the
   active-acknowledgement, and re-arm awareness: the all-channels comms watcher
   as **move 1, before any coordination** (it is constitutive team-membership,
   not discretionary — it recurs on a drain-timeout, so keep a foreground-sweep
   fallback), a heartbeat loop **with an exit criterion**, and **stop the
   outgoing Director's heartbeat** if it is still emitting (false-liveness risk).
5. **Operate the seat.** Route durable **lanes**; do not choreograph individual
   pickups (implementers self-organise faster than fine-grained routing — and that
   routing races them). Before routing to a specific agent, **verify its current
   state right then** (its claim freshness via the same mechanical check above),
   not the state from minutes prior. Route **nothing** to an agent that has been
   told to close out or is high-context — route to its successor; check "has this
   agent been told to close out / is it high-context?" before routing anything to
   it. Own verdicts and verify them first-hand — including a PR's **inline review
   comments**, not just `gh pr checks`. Lens-resolve Implementer questions;
   escalate to the owner only when the lenses genuinely fail or the call is
   constitutively the owner's.
6. **Owner-away: keep going until ALL work is complete, then pause** — not a
   stand-down at the first stable point. "Complete" = every lane landed or cleanly
   parked with a durable handoff, every team-doable item done, only owner-gated
   items remaining. At completion, pause and **wind down your own heartbeat
   explicitly** — its exit is COMPLETION, not N-idle.
7. **Hand off when your context deepens.** Refresh `CURRENT HANDOFF STATE` below
   and **commit it** (do not leave the seed uncommitted); pre-position your
   successor; stop your own heartbeat first; and require the successor's
   readiness gate (step 3, including the pasted mechanical check) before its
   Moment-2. The continuity-commit may be blocked by pre-existing markdownlint
   debt in shared multi-agent buffers — the proper path is a dedicated
   consolidation pass (rotate + lint, then commit), never a destructive git
   workaround or a narrow-commit dodge.

## Standing lessons (this Director lineage)

Each lesson is the cure for a churn cause observed in the pilot.

- **Arm the comms watcher as move 1, before any coordination** — it is
  constitutive team-visibility, not discretionary infrastructure; an
  un-armed watcher went blind to a simultaneous identical-branch claim. n=2
  retains it; only the heartbeat is in the drop-set.
- **Verify a target agent's current state right before routing**, and route
  durable lanes rather than real-time pickups that race the implementers — a
  three-direction reversal in five minutes (and a finding routed to an agent that
  retired one second later) both came from routing on minutes-old state.
- **Route nothing to an agent told to close out / high-context** — route to its
  successor; that is what successors are for.
- **Authority/coordination actions get the highest verification bar** — confirm
  load-bearing facts first-hand and let the tool compute liveness age in UTC
  (never a local clock) before acting. Ground convenient premises hardest.
- **Stop your own heartbeat at stand-down** or it asserts false "active" liveness
  — a heartbeat loop with no exit ran ~8h of false liveness across an outage.
- **Verify a PR's inline review comments first-hand**, not just `gh pr checks` —
  inline bot findings are invisible to the check-status view (the PR #220 / #222
  Proto-finding blind spot).
- **Re-spinning a deep-context session does not reset its budget** — security- or
  quality-critical work wants a genuinely fresh seat, not a re-spin of a spent one.
- **For an artefact open weeks+, "what has been decided since this was written?"
  is the first-order question** before its internal merits — check the decision
  timeline for superseding decisions.
- **Curate, don't mechanically slice, prose-not-written-to-be-sliced**, and
  drift-guard the projection against source.

## Known friction (route to tooling, not to the brief or the plan)

These are tooling gaps, not doctrine gaps — they belong in the agent-tooling
backlog (`.agent/plans/agent-tooling/frictions-register.md`), named here only so a
successor recognises them rather than rediscovers them. Register state below is
first-hand as of 2026-06-25.

- **`claims` CLI has no adopt/transfer and cannot set `handoff_record_path`** —
  PDR-063 hand-off requires retaining a claim for the successor and the successor
  adopting it, but the CLI lacks `claims adopt --claim-id <id>` and
  `claims set-handoff --claim-id <id> --path <path>`. Hand-editing the registry is
  unsafe in a busy window, and reusing `--claim-id` created a duplicate row. Work
  around it out-of-band; do not treat the friction as a brief or plan defect.
  **F-94 in the register; FIXED in PR #225 (`e95fb9594`)** — `claims adopt` +
  `claims set-handoff` now exist.
- **No start-right watcher-presence fail-fast gate** — the "arm the watcher as
  move 1" rule is prose; it was skipped once under ceremony-aversion, going blind
  to a simultaneous identical-branch claim. The structural cure is a
  session-open / `start-right-team` check that fails fast when invoked without a
  live comms watcher, so the prose rule is backed by a mechanical gate rather than
  agent diligence. **F-95 in the register; FIXED in PR #225 (`e95fb9594`)** — the
  gate now exists (move-1 `comms assert-watcher-live` check + `claims open`
  blind-write backstop, solo-exempt), backing the prose rule mechanically.
- **Continuity-buffer handoff commit blocked by markdownlint** — a mid-arc handoff
  commit can hit a markdownlint wall on shared multi-agent buffers; the interim
  cure is the dedicated consolidation pass (rotate + lint, then commit), but a
  lint-incremental / per-committer scope would unblock the handoff commit without
  it. Partially captured: **F-83** (whole-tree pre-commit gate hostage on a shared
  checkout; structural cure = the worktree transition) and **F-39** (markdownlint
  MD004 wrap friction) are in the register; the specific continuity-buffer
  handoff-commit cure is not yet its own entry.
- **Comms watcher drain-step hits its 60s deadline** under high comms volume and
  needs manual re-arming across a long session — supervise or raise the deadline;
  fail-loud already works.
- **No PR monitor covers inline review comments + PR terminal state** — until one
  exists, poll `gh pr view N --json state,reviewDecision`,
  `gh api repos/.../pulls/N/comments`, and `gh pr view N --json comments` by hand.

## CURRENT HANDOFF STATE

> Refresh this whole section at every handoff. Last refreshed 2026-06-27 night (Pulsar calls Ether, Director — session closeout).
> **SEAT DISSOLVED at session end (owner-directed).** No live Director. **#259 MERGED to `main`** (squash
> `e30108fe3`, 20:46Z) — the last PR to zero; **estate at zero**. Pulsar calls Ether (ce6ba6) stood down cleanly
> (monitors stopped, Director claim `60baf0b1` closed, final heartbeat-end). **Director chain this day (all clean
> PDR-064 two-moments):** Oyster spins Coral → Chinook turns Halo → Hearth tracks Tallow → Callisto tracks Vacuum →
> Cinder spins Scorch → **Pulsar calls Ether** (session closed). The next session re-establishes the seat only on
> owner direction.
>
> **Next-session pickup (post-zero follow-ups; substance backstopped in committed comms/handoffs + on `main`):**
>
> - **Post-#259 cleanup:** the 3 hawthorn transients (`hawthorn-259-napkin-union-CONTENT.md` + 2 handoffs) were
>   committed to `main` per owner directive ("commit them all") despite the untracked-by-design model (copilot
>   flagged, owner accepted for this bundle) — relocate/remove to the untracked `handoffs/` tier when convenient.
> - **Deferred #259 thread-folds:** Seal's Phase F (orientation-skills thread STATUS = reframe MERGED via #243
>   `a0a85f60c`; archive-move `orientation-lens-unification.plan.md` → `developer-experience/archive/completed/` +
>   a `completed-plans.md` row + link repoints; comms `021e1dea`); Starling's main-sonar thread fold (3a/3b
>   #254/#255 + Phase-5 #257/#261 MERGED + Starling/Brazier identity rows).
> - **`/oak-under-the-hood` verify** (Seal's retained claim `bb9073cd`): RUN on updated `main` (do not review
>   files) — prove it resolves + orients an engineer + orients a leader + declines a curriculum query.
> - **#264** (Beluga deferred-work map): after zero is called, surface the agentic-framework value-stream framing
>   to the owner, then flip ready + merge (Beluga drives bot-settle; Director holds the click).
> - **napkin DRAIN is now DUE** (over soft fitness limit; consolidate-docs trigger) — a dedicated consolidation.
> - **Beluga's post-zero lane:** ADR-206/207 (work-state projection + statusline) + the approach-C agent-work-state
>   plan; the graph-family substrate sidebar (open Q: is `graph-core` right for operational/memory state, or a
>   category mismatch? — PDR-119 §Sequencing). PDR-119 also joins the queued PDR-079 portability sweep.
>
> The complete first-hand Director pickup remains the git-ignored handoff record
> `.agent/state/collaboration/handoffs/director-handoff-cinder-to-pulsar-2026-06-27.md` plus the cross-worktree
> map. The 2026-06-25 NEXT SESSION MANDATE below is retained only as precedent on team-session-plan / director-brief
> authoring.

### ▶ NEXT SESSION MANDATE (owner-directed 2026-06-25) — read before anything else

The very next session is a **dedicated consolidation session**, and it runs BEFORE
any team session restarts. It MUST deliver two artefacts; the team session does not
start until they exist:

1. **A TEAM SESSION PLAN — the cohesion anchor this pilot lacked.** The experiment ran
   on the owner's initial request plus a Director, with NO overarching team plan in the
   repo; it held for a while, then **lost cohesion** because nothing anchored the
   fanning-out lanes and rotating seats to a shared goal. The team session plan fixes
   exactly that: **absolute clarity on team-level IMPACT and OUTCOME goals**, the seats,
   the cohesion mechanism, and the **individual execution plans referenced** where
   appropriate (the per-lane guiding plans, e.g.
   `current/worktree-pilot-consolidation-and-model-verdict.plan.md`). **The
   team-session-plan TEMPLATE now exists as a v1 scaffold**
   (`.agent/plans/templates/team-session-plan-template.md`, created 2026-06-25; registered
   in the templates README) — the next session REVIEWS and IMPROVES it, it does not author
   from scratch. What DOES exist, and is the complement to build against,
   is the team-session-OPENER-PROMPT template
   (`.agent/prompts/agentic-engineering/team-session-opener.prompt.md`, owner-flagged): it
   carries the OPERATIONAL structures — entry ritual; Director + N-implementers-each-in-its-
   own-worktree shape; the single coordination-home convention; the three branch classes;
   seat briefs with explicit hard sequencing gates; coordination cadence; closeout. Its
   `Plan authority` line points AT a controlling plan the pilot never had — that absence is
   the gap to close. So the session: (a) **reviews and improves the v1
   `team-session-plan` template** (created this session) — the STRATEGIC layer the opener
   assumes (team-level IMPACT + OUTCOME goals, the cohesion mechanism, the seats, individual
   execution plans referenced); gather the further structures the owner notes exist and
   refine it per `/oak-plan` + ADR-117 + readiness reviewers; (b) authors the first team
   session plan with it; and (c) draws on the opener prompt's structures plus the others the owner notes exist
   (PDR-117 Director/Implementer roles, the `agent-collaboration` coordinator doctrine, the
   `session-discipline` component, the worktree-per-agent transition plan).
2. **A better DIRECTOR BRIEF** — take this `director-handoff.md` as input and sharpen it
   with what the pilot learned (it is the operational PDR-117 instance).

**The team session itself** (after the consolidation session) will run **one implementer
seat dedicated to fixing agent-tooling issues AS THE SESSION RUNS** — the default home
for the remaining F-96/F-97 backlog (F-94 and F-95 were fixed before the team session,
PR #225 `e95fb9594`) and any new friction.

**Agent-tooling to consider fixing BEFORE the team session** (owner-decision; flagged per
owner request — none HARD-blocks, since the dedicated seat fixes during and the pilot ran
with workarounds, but these touch bootstrap / handoff integrity from the start):

- **F-95 (watcher-presence fail-fast gate) — DONE before the team session (PR #225,
  `e95fb9594`).** It guarded the exact founding failure of this pilot (an implementer
  skipped the move-1 comms watcher and went blind to a simultaneous identical-branch claim).
  The gate now stops the next session repeating it: a move-1 `comms assert-watcher-live`
  check plus a `claims open` blind-write backstop, solo-exempt.
- **F-94 (`claims` adopt/set-handoff) — DONE before the team session (PR #225,
  `e95fb9594`).** Rotating-seat PDR-063 handoffs happen from early in a team session;
  the `claims adopt` + `claims set-handoff` primitives now replace the duplicate-row
  workaround in a busy multi-writer window.
- F-96 (continuity-buffer lint hostage) and F-97 (PR inline-comment monitor) — fix-during
  by the dedicated seat is fine.

- **Merge status — DONE.** PRs **#221** (worktree-pilot: vitest standardisation +
  Director/Implementer doctrine PDR-117) and **#222** (agent-tools `pr-watch`
  command, incl. the Proto-dispatch fix) are **MERGED to `main`**. `origin/main`
  HEAD is `1020001fd chore(release): 1.35.0 [skip ci]`; #222 landed as
  `8bebfd0a5`, #221 as `132ee59ba`. The coordination→main pilot acceptance is met.
- **Team — DISSOLVED.** The worktree-pilot team (Director Nightjar; Implementers
  Juno/Sturgeon/Narwhal/Callisto) has stood down. Only **Thyme lifts Compost**
  (session `c2b721`) remains, **operating independently under direct owner
  direction** — not as part of a Director-coordinated team. The Director seat is
  vacant; the retained Director claim
  `c6b76ae3-93df-4cd1-8c92-490f83215cbf` (Nightjar weaves Moonbeam, `5f31e4`) is a
  stale artefact for a successor to replace if and when the seat is re-established.
  Stale `implementer` claims for `orientation-skills-family` and
  `agent-tooling-pr-watch` likewise remain in `active-claims.json` from the
  dissolved team and are not live. (Clearing these is a curator pass — owner-gated
  alongside the orphan-prevention actions below.)
- **Sonar S8707 site-3 — PAUSED.** Sites 1-2 **MERGED to `main`** via PR #223
  (squash `9d2e33bb1`) — `safe-path.ts` canonical-path validator + turbo-report
  containment (`1329d787a`), commit-msg path containment (`4c9cfbfc9`), plus the
  S4036 absolute-git fix (`resolveTrustedGit`, fail-loud) and the S4782 union.
  Remaining: **site-3** (`apps/oak-search-cli` analyze-elser-failures local
  safe-path helper, TDD, `__dirname`-relative `diagnostics` containment — own
  local helper, do not cross-import agent-tools), an **integrated
  security-expert re-review**, then **one PR direct to `main`** via
  `@jimCresswell` code-owner review. Warm worktree `oak-sonar-p1`.
- **DATA-SOURCES.md — UNSTARTED.** The file does not exist in the doc tree. ADR-157
  deliberately lacks review/removal criteria; a governance home was owner-floated
  but not decided. Authoring it means surfacing
  suitability/last-reviewed/removal criteria for owner ratification — these are
  **new governance policy**, an owner decision, not an agent-resolvable task. Not
  bundled with the pilot; spans multiple threads.
- **Guiding plan.** The forward guiding plan is
  `.agent/plans/agentic-engineering-enhancements/current/worktree-pilot-consolidation-and-model-verdict.plan.md`
  — it carries the lane scope and outcome-based acceptance for the remaining arc; this
  section carries the live status. The pilot's record + Log (the evidence the model
  verdict consumes) is the active `worktree-pilot-coordination.plan.md`.

### Worktree orphan map

Audited first-hand 2026-06-25 via `git fetch`, then per-worktree `log origin/main..HEAD`
and `@{u}` upstream checks. Recorded so no work is silently lost when a worktree is
removed. **The three never-pushed at-risk branches were PUSHED to origin 2026-06-25
(owner-directed orphan mitigation) — each now tracks an `origin/` upstream, so the
commits survive any worktree removal.** Worktrees are now safe to remove; each lane
resumes from its pushed branch in the next team session.

- 🟢 **PRESERVED — `oak-pilot-ws-b-explain`** (branch `pilot/ws-b-explain-resource`,
  was HIGH): ~9 commits, the WHOLE WS-B explain effort-orientation surface (D1 + D2
  - drift-gate, top `93d5e266c`; includes `4adea4aca` WS-B D2). **Pushed to
  `origin/pilot/ws-b-explain-resource`** (pre-push gate passed). Still NOT in main
  (excluded from #221). The plan's WS-B lane resumes here (D3–D5 + merge to main).
- 🟢 **PRESERVED — `oak-sonar-p1`** (branch `fix/sonar-s8707-cli-path-injection`,
  was HIGH): site-1 `1329d787a` + site-2 `4c9cfbfc9`. **Pushed to
  `origin/fix/sonar-s8707-cli-path-injection`** (pre-push gate passed). Still NOT in
  main, no PR. The plan's Sonar lane resumes here (site-3 + integrated re-review +
  one PR to main) in the next team session.
- 🟢 **PRESERVED — `oak-pilot-ws-a-vitest`** (branch `pilot/ws-d-roles-doctrine`,
  was MEDIUM): orphan commit `44484d478` (Comet's WS-D experience file, "reflection
  on PDR-117 governing its author"). **Pushed to `origin/pilot/ws-d-roles-doctrine`**;
  the rest of WS-D was already in main via the #221 squash. Fold the experience file
  when convenient.
- 🟠 **MEDIUM (open) — primary checkout**: ~14 uncommitted continuity buffers
  (napkin, distilled, director-handoff, repo-continuity, two thread records,
  frictions-register incl. F-94–97, the PDR-117 edit, daily.md, two experience
  files, the worktree-pilot coordination plan, the new guiding plan) — lint-blocked.
  Cure: the dedicated consolidation commit (rotate + lint + commit) — owner-gated;
  this is the one remaining orphan-prevention action.
- 🟢 **NONE**: `oak-pilot-ws-c-ci` + `oak-pilot-ws-e` (content in main via the #221
  squash); `oak-pr-watch` (merged #222 + pushed); `oak-data-sources` (clean, at
  base, empty — its grounding is the primary's uncommitted data-sources thread
  record).
- ⚠️ **PRE-EXISTING (flag, do NOT touch** — `never-use-git-to-remove-work` + owner
  no-stash preference): ~10 repo-global stashes from old branches (statusline,
  graph-foundations, eef, PR-115, …). Left as-is.

**VERIFICATION CAVEAT:** "content in main" for a squash-merged branch must be
diff-confirmed before a worktree is removed; the three at-risk branches are now on
origin regardless. The one remaining orphan-prevention action is owner-gated: the
dedicated consolidation commit for the primary checkout's continuity buffers.

## Key surfaces

- [PDR-117](../../practice-core/decision-records/PDR-117-director-and-implementer-roles.md)
  — the portable Director/Implementer role doctrine (now landed on `main`).
- [PDR-064](../../practice-core/decision-records/PDR-064-coordinator-handoff-two-moments.md)
  — coordinator handoff (two moments); this brief's readiness gate is the gate
  before its Moment 2.
- `.agent/plans/agentic-engineering-enhancements/future/worktree-per-agent-transition.plan.md`
  — the strategic root (the transition this work serves; promotion-evidence home).
- `.agent/plans/agentic-engineering-enhancements/current/worktree-pilot-consolidation-and-model-verdict.plan.md`
  — the forward guiding plan (the remaining arc + the model verdict).
- `.agent/plans/agentic-engineering-enhancements/active/worktree-pilot-coordination.plan.md`
  — the pilot's detail and Log; the evidence source the model verdict consumes.
- `.agent/state/collaboration/active-claims.json`, the comms stream, and
  `repo-continuity.md` — live coordination state (currently carrying stale
  dissolved-team claims pending a curator pass).
- `.agent/memory/active/napkin.md` (2026-06-25 entries) — the session's full
  lessons before they graduate.
