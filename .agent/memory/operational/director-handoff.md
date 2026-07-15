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
   fallback), and a heartbeat loop **with an exit criterion**. The outgoing
   Director's heartbeat legitimately runs until this moment (PDR-064: the seat
   never goes dark between the two moments) and the outgoing Director stops it
   after transfer (step 7); stop it yourself only as a backstop if it is still
   emitting well after authority has transferred.
5. **Operate the seat.** Live routing is the seat's first duty: a monitor
   event carrying an implementer team-start, routing request, or decision is a
   **pre-emption signal, not background** — pause the current process-task and
   route (or at least acknowledge with a next step) before continuing.
   Continuity paperwork (seeds, task lists, consolidation) happens in the gaps
   between live coordination, never ahead of it; if you cannot keep up, that
   is the hand-off-to-a-fresh-Director signal, not a push-through. Route
   durable **lanes**; do not choreograph individual pickups (implementers
   self-organise faster than fine-grained routing — and that routing races
   them). Before routing to a specific agent, **verify its current
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
7. **Hand off when your context deepens — and hand off BEFORE your own
   closeout, never after** (owner direction 2026-06-28: optimise for team
   continuity and health, not any one session's tidiness — a sequencing and
   altitude instruction, not a speed one). When the PDR-063 80% /
   post-commit re-evaluation fires, the FIRST wind-down move is to start the
   handover: refresh `CURRENT HANDOFF STATE` below; pre-position your
   successor (PDR-064 Moment 1); require the successor's readiness gate
   (step 3, including the pasted mechanical check) before its Moment-2; and
   keep your own heartbeat running until the successor's Moment-2 lands —
   the seat never goes dark between the two moments (PDR-064; the liveness
   rule) — stopping it only once authority has transferred. **Handover
   artefacts on tracked surfaces (this brief's refresh, napkin entries,
   continuity rows) are written locally and land BATCHED into the next
   substantive or consolidation PR — NEVER a dedicated handover branch or
   PR (owner ruling 2026-07-15). The handoff record itself is instance-tier
   coordination state, untracked-by-design (ADR-199/PDR-094): it is
   preserved on the primary checkout's disk and never lands in git at
   all.** The handoff is complete when the record is written, the comms
   events are posted, and the successor acknowledges; the successor reads
   the record from the filesystem, not from a merge. (The comms stream
   carries the pointers, so nothing load-bearing rides on the landing
   latency.) Only AFTER the successor holds authority
   do you run your own team-member closeout; do not begin closeout
   housekeeping (consolidation, final summary) while still holding the live
   seat with no successor landed. At a genuine arc-end where the whole cast
   dissolves there is no successor — closeout is the terminal act.

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
backlog (`.agent/memory/operational/frictions-register.md`), named here only so a
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

> ### ▶ ACTIVE EFFORT: PLAN-CORPUS REFOUNDING — seat in transfer: Mussel rides Coral → Tuna holds Buoy (Moment-1 2026-07-15 ~16:33Z, owner compaction-prep protocol)
>
> **The live pickup surface is the handoff record**
> `.agent/state/collaboration/handoffs/2026-07-15-director-mussel-to-tuna-0f4be777.md`
> (claim `0f4be777` carries `handoff_record_path`; read end-to-end before anything).
> Team: 4 active + 4 standby on the owner's CIRCULAR-COMPRESSION ring (map broadcast
> `cd375f72`; protocol amendments `c57698dc` — standby dormancy, Director-only handovers,
> the compaction-prep template). First rotation proven (Hedgehog→Ceres, 16:28Z).
>
> <details><summary>Superseded: Mussel seat state at Moment-2 (conserved)</summary>
>
> ### ▶ Director: Mussel rides Coral (Moment-2 2026-07-15T14:26:36Z, event `0f7e4907`)
>
> **SESSION SHAPE:** Mussel rides Coral (`6f8857`) holds the seat — claim `0f4be777`
> adopted, dual heartbeat live (transfer from Schooner guards Whirlpool `82a9df`, Moment-1
> ~14:22Z, Moment-2 14:26:36Z after the readiness gate + pasted mechanical UTC check).
> **Successor pre-named by the owner (2026-07-15 ~16:07Z): Tuna holds Buoy (`9ac658`)** —
> PDR-064 two-moments + this brief's readiness gate govern the transfer when a PDR-063
> trigger fires or the owner calls it. Standing owner ruling in force: ALL owner direction
> routes through the sitting Director (event `cb140075`); no direct owner requests to any
> agent. Team at pre-naming: Hedgehog tracks Eventide (S1 reader batch; own pre-named
> successor Ceres guards Corona `0f6b60`, owner-verification pending), Acacia rides Bark
> (tooling runway), Aurora guards Penumbra (S2 divergence lane) — three ARC channels live.
> Hedgehog tracks Eventide (`82b36c`) is Fleet Captain, warm, running the signed
> `s1-reader-sample-b1` batch (claim `45befb32`). Zodiac turns Solstice (`019f65`) was
> owner-shut-down after their S1 closeout; forensic verdict: contained, nothing rogue
> reached origin, their deep-handoff fold rides PR #384.
>
> </details>
>
> <details><summary>Superseded: seat-in-transfer state as frozen by Schooner (conserved)</summary>
>
> **SESSION SHAPE at handoff:** outgoing Director Schooner guards Whirlpool (`82a9df`,
> owner-directed deep handoff then session end); incoming Director Mussel rides Coral
> (`6f8857`, registered 14:13:43Z, standby held correctly — Moment-2 pending); Zodiac turns
> Solstice (`019f65`) on a narrow continuity-curation claim `c4e56bb2` only (S1 lane closed
> clean); Hedgehog tracks Eventide (`82b36c`) owner-cold-paused, Fleet-Captain-in-waiting.
>
> </details>
>
> **The live pickup surface is the handoff record**
> `.agent/state/collaboration/handoffs/2026-07-15-director-schooner-to-mussel-0f4be777.md`
> (claim `0f4be777` carries `handoff_record_path`; untracked-by-design — read from the
> primary checkout's filesystem). §1 current state (S1 deterministic layer LANDED via
> PR #382 with the calibration blindness disclosure proving the fleet residual necessary;
> the decoy-comms finding; the primary's pull owner-gated by the loss-ruling — resolves
> only by an owner-run command), §2 in-flight reasoning (the arc-wide scripts-first
> discipline; today's owner rulings incl. no-handover-PRs, the loss-discipline absolute,
> "nothing is 'mine'"), §3 rulings, §4 work owed (PR #384 shepherd; the owner-gated S1
> fleet leg; S2 → divergence report → Walk-A).
>
> **Readiness gate before any Moment-2:** the brief's five questions + the pasted mechanical
> UTC liveness check; the outgoing seat's heartbeats stop at its closeout broadcast — the
> comms heartbeat-end/closeout events are the authoritative stand-down signals even while
> the registry reads fresh. Then `claims adopt 0f4be777`, watcher move 1, DUAL heartbeat
> (comms event AND `claims heartbeat` per tick — the F-92 gap bit two tenures running).
>
> <details><summary>Superseded: Director #3 (Schooner guards Whirlpool) state at Moment-2, 2026-07-15 (conserved)</summary>
>
> **SESSION SHAPE:** n=1 — Director only (**Schooner guards Whirlpool, `82a9df`**, claude-code /
> claude-fable-5), claim `0f4be777` ADOPTED from Barnacle calls Spray (`6d5d9c`, Director #2,
> retired on owner instruction after full closeout; before that Quasar mends Umbra `52b4de` —
> the claim has been continuously held, never closed, across three tenures). A Fleet Captain
> seat (Stoat holds Warren, `2a69a1`) was opened and RETIRED by owner instruction before any
> S1 script ran — a contained tool-contract mistake (a `--help` probe on a raw `refound-*`
> script executed it for real; see the napkin), not corrupted work-product.
>
> **The one-line state:** S0 CLOSED and merged (PR #379, `SHA:68d6d232`, release 1.69.1).
> Orphan-recovery PR #380 MERGED (`SHA:55a69ceca`, 2026-07-15T11:20:45Z) — its two proof-gated
> worktrees (`register-rehoming`, `orphan-recovery`) verified and removed at pickup. S1 is
> UNSTARTED: the remit (comms event 2026-07-15T11:35:42Z) stands verbatim — deterministic
> scripts first at zero LLM cost; the `refound-reader`/`refound-locator` fleet layer is a
> narrow calibration-gated residual, pre-declared against the cost ledger before any dispatch
> — and re-routes to a successor fleet seat when the owner launches one. The stray sweep
> artefact Stoat's misfire wrote was ABSENT repo-wide at 12:10Z (assumed owner-disposed;
> confirmation pending). Remaining after S1: S2 → divergence report as Walk-A input; the r1
> worktree is removed only after S1/S2 complete.
>
> **Owner rulings 2026-07-15:** (1) **no more handover branches or PRs** — handover artefacts
> land batched (see §How to take the Director seat step 7); (2) a residue **disposition sweep**
> over the primary's 4 stashes + ~50 local branches is commissioned — ledger with per-item
> proofs and recommendations, one owner ruling over the batch, then execution.
>
> **A successor rehydrates from:** the on-disk handoff records under
> `.agent/state/collaboration/handoffs/` (untracked-by-design per ADR-199/PDR-094 — read from
> the primary checkout's filesystem, not from git; 2026-07-15 Barnacle→Schooner — note its §1
> PR-#380 and S1-in-flight claims were superseded within minutes and corrected first-hand at
> pickup; 2026-07-14 Quasar→Barnacle), the napkin's 2026-07-15 entries, `repo-continuity.md`'s
> strategy row, and the thread record's 2026-07-15 section.
>
> <details><summary>Superseded: state at the Barnacle→Schooner handoff, 2026-07-15 (conserved)</summary>
>
> **SESSION SHAPE:** n=2 at handoff — Director (Barnacle calls Spray, `6d5d9c`, retiring),
> incoming Director standby (Schooner guards Whirlpool, `82a9df`, no claim). S1 UNSTARTED,
> returning to the incoming Director to re-route. Stray sweep artefact
> (`.agent/plans-refounding/sweep/sweep-hits.v1.jsonl`, 1.4MB, primary) verified present at
> the freeze, awaiting owner disposal. Claim `0f4be777` carried `handoff_record_path` to the
> 2026-07-15 record; at freeze time that record's §1 named PR #380 as OPEN/blocked (merged
> minutes later) and the S1 fleet lane as in flight (Stoat had retired).
>
> </details>
>
> <details><summary>Superseded: Director #2 (Barnacle calls Spray) state at seat-open, 2026-07-14 (conserved)</summary>
>
> **SESSION SHAPE:** n=1 — Director only (**Barnacle calls Spray, `6d5d9c`**, claude-code /
> claude-fable-5), claim `0f4be777` ADOPTED from Quasar mends Umbra (`52b4de`, Director #1,
> retired at natural boundary after full closeout). The transfer ran PDR-064 two-moments with
> the readiness gate + a 9-agent adversarial verification of the handoff record. The live
> pickup surface was the handoff record
> `.agent/state/collaboration/handoffs/2026-07-14-director-quasar-to-barnacle-0f4be777.md`
> (§2 the S0 execution order; §4 deferred work + owner-item register): at transfer, the S0
> hard freeze window was OPEN with S0 staged-not-started in the r1 worktree. Team protocol
> in force per **PDR-127** (team-branch coordination) and **PDR-128** (review conversations
> are first-class), both graduated at the 2026-07-14 dedicated consolidation.
>
> The owner-commissioned two-objective team
> (stakeholder-visibility proof slice; planning-estate review toward proven plans) ran ten seats
> on 2026-07-14; all nine teammates retired cleanly with custody handed to the Director
> (Tallow, Embers, Rosemary, Sardine, Weasel, Galleon, Cedar, Parsec, Foxglove). Successor
> pre-named by the owner: **Barnacle calls Spray (`6d5d9c`)**, cold standby — PDR-064
> two-moments plus this brief's readiness gate govern the transfer.
>
> **The one-line state:** both objectives reached day-one completion — objective 1's
> GitHub/Linear/Notion proof slice ratified complete (Sentry leg OPEN, routed to TAU Stage 5 or
> a small readout; Notion governance in force: subtree allowlist, hybrid ledger, editorial
> floor, behavioural-only); objective 2 at the S0 runway (G2+G3 ruled, six registers re-homed,
> `ratifiedBy: null` holds S0 mechanically, Walk-A structure priors recorded at
> `.agent/plans-refounding/walk-a-structure-priors.md`). Fourteen PRs merged 2026-07-14
> including the #376 omnibus (owner-merged, `ca3dac4ea`); its three raced Copilot findings are
> verified genuine and queued in the napkin's consolidation-readiness entry. The team branch
> `team/planning_and_visibility` is consolidation-READY: fast-forwarded to main and carrying
> only the knowledge tier (containment per-file verified; nothing discarded unverified).
>
> **The runway (owner-stated):** owner-run dedicated consolidation session ON the team branch →
> freeze-planning sitting (re-ratifies `freeze-rule.json`; the null `ratifiedBy` is the
> mechanical hold) → S0 per Cedar's gate order (exclusion-configs commit → clear stale freeze
> artefacts in the `plan-corpus-refounding-r1` worktree → hard hours-scale window) → S1 → S2 →
> divergence report as Walk-A input.
>
> **A successor rehydrates from** (detail lives there, not duplicated): the napkin's
> 2026-07-14 Director entries (including the compaction loss-scan and the consolidation-readiness
> entry with the owner-item register: stash drops ×4 authorisation-pending,
> remediate-main-*/graph-team-direction branch decisions, the unpushed spawn-flow/F-75 branches
> with an UNDIAGNOSED push-rule rejection, Sentry-leg execution, doctrine graduations) ·
> `repo-continuity.md` strategy row · the thread record's 2026-07-14 sections ·
> `.agent/plans-refounding/owner-gate-register.md`.
>
> **Readiness gate before any Moment-2:** this brief's five questions + the pasted mechanical
> UTC liveness check; then `claims adopt 0f4be777`, watcher move 1, heartbeat per PDR-078 §4.
>
> </details>
>
> </details>
>
> ---
>
> ### ▶ PARALLEL RETAINED EFFORT: CURRICULUM HUB PROGRAM — seat RETAINED at Nettle #10's full closeout (2026-07-06)
>
> **[2026-07-14 annotation, Quasar mends Umbra:** claim `35d9c8f2` is no longer present in
> `active-claims.json` NOR in `closed-claims.archive.json` (both verified first-hand,
> zero hits) — it vanished without an archived closure, most plausibly in one of the day's
> registry-hygiene sweeps. A pickup seat should OPEN A FRESH CLAIM rather than `claims adopt`;
> the pickup record path below remains valid and is the substance carrier.**]**
>
> **SESSION SHAPE:** n=1 — Director only — to MERGE (owner ruling, unchanged). Director #10
> (Nettle tracks Acorn, `dfddd4`) closed out fully on owner direction 2026-07-06; claim
> `35d9c8f2` RETAINED with pickup record
> `handoffs/2026-07-06-curriculum-hub-director-nettle.md` (state, the landed trains, the
> remaining map, owner gates, operating notes — incl. TWO standing owner corrections:
> append-only consolidation with sources conserved; no directive-tier edits from inferred
> generalisations). Chain: Herring → … → Comet → Hyena → Nettle. A FRESH session continues.
>
> **The one-line state:** PR #295 ALL-GREEN at `70f6d25df`, ZERO unresolved threads, reviewer
> passes DONE (verdicts + adopted fixes in the record); remaining = owner-released LOCAL
> semantic main-merge (re-enumerate; conservation direction governs memory-file merges) →
> owner visual sign-off via a fresh `tool:fidelity` run (14 unregistered findings to judge) →
> MERGE → fresh-branch continuation + WS0+ → the merge-boundary sweep (retained claims /
> stale stashes / gone-upstream branches — owner-gated dispositions, enumerated in the
> loss/metaloss scan report).
>
> **Readiness gate before any Moment-2:** unchanged — five questions + the pasted mechanical
> UTC liveness check; then `claims adopt 35d9c8f2`, watcher move 1, heartbeat per PDR-078 §4.
>
> ---
>
> ### ▶ PRIOR (superseded 2026-07-06): seat RETAINED at Hyena #9's full closeout (2026-07-04)
>
> **SESSION SHAPE:** n=1 — Director only — to MERGE (owner ruling, unchanged). Director #9
> (Hyena stirs Lamplight, `d62788`) closed out fully on owner direction 2026-07-04; claim
> `35d9c8f2` RETAINED for the restart successor. Chain: Herring → Swordfish → Lantern →
> Hawthorn → Sycamore → Panther → Birch → Comet → Hyena.
>
> **A successor rehydrates from** (detail lives there, not duplicated):
> `handoffs/2026-07-04-curriculum-hub-director-hyena.md` (CURRENT pickup — state, the landed
> trains, the remaining map, owner gates, operating notes) · the thread record
> `threads/curriculum-hub-demo.next-session.md` · the guiding plan
> `active/port-prototype-to-live-demo.md` (§Ratified decisions 1–9) · the post-merge plan
> `current/productionisation-and-reuse.plan.md`.
>
> **The one-line state:** PR #295 all-green (Sonar PASSES); ~14 commits LOCAL behind the
> standing owner push gate ("pause before push"); the fidelity-review mechanism is BUILT and
> proven (tool:fidelity + tracked fidelity-register.json + the fidelity-review skill +
> playbook §Fidelity review); remaining = push release → Copilot-thread resolution + reviewer
> passes → the SEMANTIC main-merge (7 knowledge-surface conflicts, /oak-semantic-merge +
> ultrathink, owner-directed) → owner visual sign-off (aided by the fidelity report; 14
> UNREGISTERED findings to judge) → MERGE → §J owner-hosted from main.
>
> **Owner-gated:** the push release · visual sign-off · WS6 SSO set · fourth-stream row ·
> WS2 stage-naming at activation · deep consolidation (napkin ~700/300, pending-graduations
> 9 items — a DEDICATED fresh-context pass, registered, not absorbed).
>
> **Readiness gate before any Moment-2:** unchanged — five questions + the pasted mechanical
> UTC liveness check; then `claims adopt 35d9c8f2`, arm the watcher (move 1), heartbeat per
> PDR-078 §4 value-contingency.
>
> ---
>
> ### ▶ TEAM-TOOLING ARC CLOSED (prior effort, conserved) — Director: Falcon wakes Stratus (2026-06-29)
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
