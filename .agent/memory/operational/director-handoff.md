---
fitness_line_target: 200
fitness_line_limit: 320
fitness_char_limit: 20000
fitness_line_length: 115
fitness_line_length_rationale: >-
  Raised 100 → 115 (owner-authorised 2026-06-29) for this append-heavy
  narrative/continuity surface. Marginal prose-width drift on appended prose is
  chronic-cosmetic (99% of breaches were ≤120; median 104) and manual reflow is a
  transient non-cure on a file that grows by append each session; 115 clears the
  noise while still flagging genuine over-runs.
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

**The durable role doctrine has graduated to
[PDR-117](../../practice-core/decision-records/PDR-117-director-and-implementer-roles.md)
§The Director role** — minimum-action / context-economy (stay silent on routine
signals), routing craft (verify-state-before-routing, durable-lanes-not-pickups,
never route to a closing-out agent), and takeover verification (registry-freshness
≠ comms-liveness; the highest verification bar for authority actions). Read PDR-117
for those; the lessons below are the **operational craft** of running the seat in
this repo that PDR-117 does not carry.

- **Arm the comms watcher as move 1, before any coordination** — it is
  constitutive team-visibility, not discretionary infrastructure; an
  un-armed watcher went blind to a simultaneous identical-branch claim. n=2
  retains it; only the heartbeat is in the drop-set.
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
- **Ground in the homed plan before designing — most "design" is crosswalk +
  activation, not greenfield.** Read the plan estate first; launching a design
  workflow over an already-homed plan risks forking an SSOT.
- **Director-run workflows (ultracode): flat output schemas** (a nested matrix
  schema hit the StructuredOutput retry-cap and failed silently), **never seed a
  contested call as "settled" in a brief** (the agents reflect it and the
  adversarial verifier cannot catch what you marked settled), and **critically
  assess every result AND its cited sources first-hand** (a cited SHA was not in
  main; an "unmeasured 10:1" was a measured 1.59:1).
- **Reject either/or — climb to the third option / the both.** A binary handed to
  the Director is the signal to climb (filter-vs-derive dissolved into one object
  that was both relief and structural cure). Run the five decision lenses before
  surfacing ANY question; surface only the constitutively-owner one.
- **Closeout is serial mutation, verified first-hand at the instant.** Re-verify a
  worktree clean immediately before `git worktree remove` (never `--force`);
  archive-not-delete (move, count-conserved); patch-id-verify a squash-merged branch
  before pruning (branch-existence is not preservation); never line-merge
  memory/state files.
- **A reserve/standby seat burns the very freshness it exists to preserve** if it
  cannot filter the heartbeat firehose — reserve-seat watcher filtering (the Lane-C
  `--exclude-tag heartbeat` work) is load-bearing economics, not a nicety; standby
  burn shortens the Director tenure the bench exists to extend.
- **The auto-update-branch babysitter** (reusable release-churn cure): a Monitor
  that `gh pr update-branch`es any OPEN+BEHIND auto-merge-enabled PR and emits only
  on a conflict. Safe because `--auto` enforces every merge gate server-side, so it
  only lets a genuinely-ready PR win the release-churn race — removing per-round
  babysitting from the Director's context.

The experiential source for the last several lessons is the Trawler-tenure how-to
brief ([`director-howto-and-pdr117-gaps-2026-06-29.md`](../../reports/agentic-engineering/director-howto-and-pdr117-gaps-2026-06-29.md)).
Its **Part B (PDR-117 missing axes)** is a queued doctrine-design task — context-budget
economy as a first-class axis, takeover-verification doctrine, owner-interaction modes,
Director-as-orchestrator, arc-closeout-as-responsibility, the loss-scan axis — to be
authored on fresh context (owner-directed), with PDR-117 as the surface to amend.

## Known friction (route to tooling, not to the brief or the plan)

These are tooling gaps, not doctrine gaps — they belong in the agent-tooling
backlog (`.agent/plans/agent-tooling/frictions-register.md`), named here only so a
successor recognises them rather than rediscovers them. Register state below is
first-hand as of 2026-06-25.

- **FIXED (PR #225, `e95fb9594`) — `claims adopt` + `claims set-handoff` (F-94) and the
  watcher-presence fail-fast gate (F-95, move-1 `comms assert-watcher-live` + `claims open`
  blind-write backstop, solo-exempt) now exist.** The PDR-063 handoff primitives and the mechanical
  backing for "arm the watcher as move 1" are available — use them; no workaround needed.
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

> ### ▶ TEAM-TOOLING ARC CLOSED — NO LIVE DIRECTOR (seat vacant since 2026-06-29)
>
> **No Director is live.** Falcon wakes Stratus (`adb1f3`, 6th Director; chain Firefly → Merlin →
> Triton → Kraken → Trawler → Falcon) **stood down 2026-06-29** — heartbeat stopped, Director claim
> `4180e263` relinquished, no retained claim (owner-directed session-end, not a stall). A successor
> takes the seat via the readiness gate below; there is no live Director to take it over.
>
> **THE TEAM-TOOLING ARC IS CLOSED.** All PRs #269–#286 + #282 merged to main; the arc-end
> coordination PR **#268 MERGED** (`1b5ce326`, Falcon — 6 review threads resolved: 2 doc fixes,
> 4 not-defects). All worktrees removed; arc branches pruned; comms archived (count-conserved).
> The deep consolidation of the arc's captures **MERGED** (PR #290).
>
> **NEXT WORK — the SYNTHESIS PHASE (owner-directed, fresh-context; not yet started, inputs conserved):**
>
> 1. **Worktree-per-agent / PDR-117 MODEL VERDICT** — the comms/liveness substrate cure is homed
>    in `collaboration-substrate-coordination-rightsizing` (M1–M4) + `comms-watch-storage-redesign`
>    WS2 (mtime-watermark) + `comms-watch-liveness-floor`; the live **F-44 freshness≠liveness SAFETY
>    defect** (`active-agents.ts` reads claim freshness as liveness) is the do-first item.
> 2. **PDR-117 expansion** — the missing axes seeded in
>    [`director-howto-and-pdr117-gaps-2026-06-29.md`](../../reports/agentic-engineering/director-howto-and-pdr117-gaps-2026-06-29.md)
>    Part B (context-budget economy, takeover-verification, owner-interaction modes,
>    Director-as-orchestrator, arc-closeout responsibility, the loss-scan axis). PDR-117 is the
>    surface to amend.
> 3. **do-first efficiency matrix** (2/3 produced; workflow `w5xlcz6iu`) and **rightsizing-plan
>    M1→M2 activation** (owner decision; the 2026-05-25 archival hold is already lifted).
> 4. **NEXT TEAM (owner-set):** two co-equal lanes — architecture-efficiency (rightsizing) AND
>    intent-graph (opens with a broad shallow plan-estate scan); interim = owner deep-consolidation
>    sessions.
>
> **OWNER STANDING DIRECTIONS (apply going forward):** green + all-conversations-resolved ⇒ the
> Director merges directly, no `--admin`; reject every either/or ⇒ third-option / both; run the five
> decision lenses before surfacing any question (surface only the constitutively-owner one); UTC
> canonical for every internal timestamp (label zones, convert BST explicitly); archive-not-delete;
> critically assess ALL subagent results AND their sources.
>
> **OWNER-ACTION QUEUE (genuinely the owner's):** overage limit — the automated `claude` PR-reviewer
> is OFF org-wide (claude.ai/admin-settings); orientation-MCP lane provisioning
> (`mcp-tool-taxonomy-and-orientation.plan.md` — no lane owns it); O4/OQ5 composed-liveness decision;
> the rightsizing M1→M2 activation.
>
> **READINESS GATE for the next Director:** answer the five questions + paste the mechanical liveness
> check (UTC-to-UTC) before Moment-2; then open your Director claim (Falcon's `4180e263` is already
> relinquished — there is no live claim to take over). Prior-rotation detail (the
> Firefly→…→Trawler tenures, the 2026-06-25 worktree-pilot
> mandate, the worktree orphan map) is conserved in git history, the handoff records under
> `.agent/state/collaboration/handoffs/`, and `repo-continuity.md`.

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
