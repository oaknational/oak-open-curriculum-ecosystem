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

> ### ▶ SITTING DIRECTOR: Falcon hunts Flight (`52841f`), seated 2026-07-30 06:17:02Z (Moment-2 `2ced78e4`, succeeding Bora binds Thermal per its Moment-1 `b3c75eea`, owner-named full handoff); claim `a2286c53` adopted in place, role director
>
> **SEATED-BLOCK NOTES 2026-07-30 ~12:05Z (SECOND compaction prep this seat — seat PAUSED at owner word BEFORE this boundary, monitors already dark; the seat CONTINUES post-compaction, resume at OWNER WORD ONLY; continuation record claim-addressed under handoffs/ refreshed for this boundary). Durable half only; recompute every derivable. Morning block below (~08:55Z) and rulings 1–28 REMAIN BINDING.**
>
> - **OWNER RULINGS, AFTERNOON HALF, carry verbatim:** (29) the isitagentready checker results all TICKETED (MCP-422..427, First Major Release "for now, likely will need to move later"; per-surface honesty framing preserved — open-api's OAuth absence is deliberate, its auth.md says so); "once the mcp is live on the <www.thenational.academy/mcp> url, it would be great to advertise that". (30) FRONT-DOOR CROSS-LINKING (llms.txt ↔ open-api discovery ↔ MCP listing) = "the first post-submission priority" ("100% yes... 1000%") — MCP-421 Urgent, John Roberts tagged (verified Linear identity john.roberts; the Matt-doc's "John Robeds" was the typo). (31) PLOVER SECOND OPINIONS fleet-standing ("where appropriate") + Director sounding board — first live use caught a real single-family blind spot (the in_reply_to alias, ADR-220 cures) and reviewed the MCP-420 plan. (32) #638/MCP-373 → PLOVER owner-named executor to COMPLETION (no-edit boundary lifted per-lane; self-merges at full condition; route event a7aada9a). (33) MCP-339 re-homed to the OKR project ("external to the engineering effort"); gate intact via MCP-309 Blocked-by; M0 trued. (34) MCP-244 closed superseded-by-live-evidence (card answer); MCP-63 stays Done; MCP-354 closed Done (gate discharged on its own thread record; residue re-homed MCP-418). (35) MATT GREGORY holds the delegation (doc f0e5cef166d2 — release-mechanics section from the owner's notes + "So You've Decided to Adopt a Practice" section added at his word; MCP-415 Clerk + MCP-416 Cloudflare delivery parents minted, BOTH assigned Matt, Urgent). (36) MCP-420 override contingency: decision-complete plan authored+committed (.agent/plans/delivery/upstream-api-override-contingency.plan.md, ARMED-NOT-EXECUTING, trigger owner/Matt-held at form-fill; pin-and-fail-build mechanism). (37) PAUSE at owner word ~11:45Z ("when sensible and safe, please pause") — monitors dark by declaration; the reflection ("what is it all about") answered and owner-agreed: trust transferred without loss; the app makes institutional knowledge trustworthy to machines, the Practice makes machine work trustworthy to institutions. (38) POST-PAUSE ADDENDUM (~12:20Z): MCP Apps carousel screenshots VERIFIED required on the live submission page (3–5 PNG ≥1000px, cropped to the response, PAIRED PROMPT TEXT per image — new vs the 28-July inventory; Figma template linked from the page); NO marketplace file is needed for the plugin submission (verified live: public GitHub link + `claude plugin validate`; the bare-root stray was untracked, misplaced, and is gone — truing comment on MCP-302); the deeper plugin-distribution question set (channel decision, subdirectory acceptance, update-model reconciliation vs the frozen-at-ingest understanding, stray-file guard) is TICKETED MCP-432 with the repo note `.agent/reports/plugin-distribution-question-set-2026-07-30.md` as substance, post-compaction post-submission.
> - **STATE AT SECOND FREEZE (~12:05Z — recompute at resume):** MERGED this half: #649 (MCP-411 removal, ADR-219 supersedes ADR-158), #650 (MCP-414 hook env hygiene), #651 (MCP-393 closing build + ADR-220 + directed threading parity), #653 (rotation). Branch: coordination/estate-2026-07-30-b LIVE (second same-day cut, -b suffix keeps the date stamp honest). BOARD: all seats stood down clean (Brazier 11:01, Glowworm 11:02, Sycamore 11:06 — each with full handback absorbed at this seat) EXCEPT Plover ACTIVE on #638→completion and Possum compaction-residue (MCP-393 evidence comment + dual-dist read-back). PAUSED DESIGN LANE custorial at this seat: pickup = Sycamore's continuation record (resume traps: hook-twin 05ed8482c conflicts vs merged #650 — take main's; scaffold branch deletes after PR 1; #644 inert red-by-design unwatched). EVENING RUNNER-SEAT sequence homed here (Brazier's 5555cb93, four steps, evidence-follows). THE INCIDENT (~11:34Z): first in_response_to directed event vs stale pre-#651 dists — strict Zod refused, drain poison-pilled, presented as PEER silence; two-seat parallel cure in ~3 min; tickets MCP-428 (ADR-220 amendment, High) / MCP-429 (drain quarantine-or-fail-loud, High) / MCP-430 (old-reader×new-event compat cell) / MCP-431 (claims recompute+reconcile, carries the stale Moon director-claim + 137 abandoned queue rows). WORKTREES: 9 pruned on proof; surfaced awaiting owner word: mcp-63 worktree's FOUR UNPUSHED commits (superseded early analytics impl — keep or delete), mcp-128-pre-ratification untracked reports dir, mcp-297 stray test edit, mcp-103-base-refresh detached merge head. OWNER-HELD: submission legs (Clerk MCP-143/415, Cloud-Config#551/MCP-416 now Matt's, Aakesh's four 2/4 live-confirmed broken, listing copy, MCP-268 STILL zero motion), MCP-414 branch delete one-click, security_events:write standing question (bot cannot dismiss CodeQL; owner one-clicked this time). MCP-417 commit-queue guard minted (enqueue-list false-green class). Agent-readiness review verdict: 57/Level-4 under-prices the estate; checker punishes honest absences.
> - **SEAT MECHANICS THIS BOUNDARY:** PAUSED then compacting — RESUME ONLY AT OWNER WORD: re-arm all three monitors (watcher canonical invocation heartbeat-excluded + F-95 assert + foreground gap sweep from BEFORE the 11:45Z pause; F-75 delta poll; 240s dual-surface heartbeat claim a2286c53 branch label coordination/estate-2026-07-30-b), recompute board (claims active-agents, gh pr list, comms since the pause), resume broadcast. Watchers/pollers MUST load the post-#651 dist (the incident's lesson): any comms-parsing process predating a schema-touching merge is stale by construction.
> - **RESUMED 2026-07-30 12:18Z at owner word — the above EXECUTED, results:** dist rebuilt FIRST (build green, exit in-band) then all three monitors armed; F-95 assert GREEN; gap sweep from 11:40Z = 10 non-heartbeat events, zero missed; resume broadcast `8909b097` (verified on disk). BOARD: Plover ACTIVE (claim 0b526256 fresh, #638 cure round in an isolated worktree at exact head ef982b6438, self-merges at the full gate); Possum FULLY DARK by owner word (formation letter absorbed and committed at this seat; its two notices — pnpm check GREEN at 4e3868ff8, and the attribution that my staged freeze bundle rode its wrap commit, owner-carded — both verified first-hand, nothing owed); Moon's stale director-claim remains the MCP-431 residue; `Quoll mends Lair` registered with no claim. OPEN PRs = exactly two: #638 (Plover's, in flight) and #644 (MCP-372 hub, non-draft, Sonar red by design, gate = the owner's word resuming the paused design lane; custodial at this seat until then). OWNER LEGS ALL UNMOVED since the freeze — MCP-143 Todo, MCP-415/416 Backlog (Matt), MCP-292 In Progress, MCP-306 Backlog, MCP-268 still zero motion, Aakesh's four still Backlog. **Instrument note:** the comms concept gate REFUSED this seat's first resume broadcast — my own prose about #644 carried indefinite-deferral vocabulary instead of naming its gate; the same policy then refused the file write that quoted the catch. Both refusals were correct. Structure catching the Director, unprompted, is the mechanism working.
> - **RULING 41 + THIRD FREEZE (2026-07-30 ~16:50Z, compaction prep; the seat CONTINUES WORKING through this boundary — no pause, monitors STAY ARMED):** owner verbatim: "we are going to land Inferno's last few fixes so that Matt has an easy a time as possible, help Plover finish, they will just keep going, Volcano is just about finished. We may revive the design lane, but just for fun, not for submission, that is in Matt's hands now." POST-COMPACTION MANDATE, in priority order: (1) support Inferno's MCP-437 family to merged — #656/MCP-438 DONE (5dffee370); MCP-439 (generated tool table) in flight; 440/441 remain; 442 closable on the 34f24834d evidence; (2) support Plover to #654 completion — they self-merge at the full gate, suppressed findings vetted by reproduction per the owner calibration (relay 8c7571ad, adopted); (3) Volcano nearly done — draft awaits owner review on the final child ticket; (4) design lane MAY revive AT OWNER WORD, framed FUN-not-submission (Sycamore's continuation record still the pickup vehicle; #644 gate unchanged). SUBMISSION IS MATT'S (ruling 40). STATE AT THIRD FREEZE: #655 MERGED at da7a3e7f1124 (MCP-434 banner fix — this seat shepherded the salvaged lane end-to-end: two Copilot doc findings cured c4c6441c4, full-condition recount by ruleset names, sha-pinned bot merge; owner's live-render re-check post-deploy is the DoD tail and opens gate-7 carousel screenshots); #654 one Copilot body from Plover's self-merge; doctor run executed at owner word (3 declutter disables applied: find-skills skill off, sonar-documentation + sentry-ooc-search-cli MCP servers off for this project — all reversible); SPEND LIMIT: monthly cap HIT — sub-agent dispatches die on it (the banner implementer did; salvage complete, nothing lost); owner knows, /usage-credits is the lever. INSTRUMENT LESSONS THIS FREEZE (napkin-bound): invented-sha 409 at the merge pin (derive identifiers from the store, NEVER extend a truncated display — the pin caught it); settle-watch misread in-progress CheckRuns as failures (CheckRun carries status, StatusContext carries state — read both). Coordination branch pushed through 9f0fa6296; worktree agent-a6f3e757512c33e96 (the merged #655 branch) is prunable at next hygiene pass on clean+merged proof.
> - **MANDATE DISCHARGED (2026-07-30 ~17:35Z, post-compaction — the working boundary held; all monitors survived or re-armed on cycle):** ruling 41's legs closed in under an hour. (1) Inferno's family: #658 MERGED 848e61e23 at full condition (MCP-440 licence field, Copilot APPROVED 0 comments; ticket Done via GitHub auto-transition) — MCP-442 ALONE remains, ancestry-gated on this branch's roll-up to main (34f24834d); Inferno's truing commit c6646f914 carried the plan true-up plus all pending napkin entries (theirs, Volcano's, this seat's false-absence lesson). (2) #654 MERGED 0ae070701 17:26:16Z — Plover self-merged at the full gate (exact-head 17/17, Copilot 0 ordinary + 0 suppressed, zero threads, expert APPROVEs) under the owner's 17:15Z drive-to-merge word; rationale ON RECORD: Matt uses Codex heavily, Codex Practice support is handover-relevant; the Codex connector permitted the self-merge, the pre-cleared Director-proxy bridge went unused; MCP-433 Done via auto-transition 17:26:18Z, Director evidence comment on the ticket; Plover's Linear-write refusal (no in-session authorisation) was CORRECT and left no gap. (3) Volcano closed out clean 17:16:22Z at owner word — all four private-team tickets Done, official external document updated at the owner's quoted instruction, no claims retained. (4) design lane unchanged, owner-held, fun-not-submission. NEXT AT THIS SEAT: roll-up PR (this branch → main) at this boundary discharges MCP-442's ancestry gate; then the board is #644 (gated) alone and the estate Matt inherits is quiet.
> - **FOURTH FREEZE (2026-07-31 ~11:10Z; the seat CONTINUES WORKING through this boundary — working compaction #4, all monitors are Monitor-tool tasks and survive): THE KNOWLEDGE-ESTATE DAY.** The whole arc owner-driven in-session, morning to now: (1) plan-directories survey → estate lineage mapped (ADR-200 → refounding → pivot). (2) Owner directed the knowledge-estate programme (scope ALL repo knowledge; his verbatim kernel ratified and homed in the strategic node; external-system connections in the graph; NO Linear for this subtree). (3) The DOCTRINE TRIO authored: PDR-134 (strata/carriers/concept layer + unifying monotone-flow schema + immutability-by-epistemic-kind + grounding-is-evidence), ADR-221 (estate graph: quads-not-triplestore, per-home recomputability red line, named-graph seam + clone test, asserted-only, PROV/SKOS/DC, concept layer with link-as-annotation, validator seeds, math grounding, ADR-200 reconciliation, obligations 1–5), strategic node planning-and-intent-estate (serves FRAME-1). Dual-Opus review: 41 findings adjudicated (strata-vocabulary collision, ADR-173/041 topology collisions cured via framework/consumer split — SDK + agent-graphs/practice-graph activation); decision-lens run recorded in ADR §Alternatives (lens 4 dissolved the delivery-ticket gate: execution anchors are operator policy). MERGED to main via #663 (109a59c43). (4) RATIFICATION SITTING held in-session by cards: trio ACCEPTED, curator stewards the concept scheme; ratification commit 0619fc2f5 (stamps + obligations 1–5 + schema dated amendment) riding PR #664 (SETTLING at freeze — merge at green is FIRST ACT if pending at resume; sha-pin from store). (5) The consolidation-ledger design (stock→flow, monotone-union distribution, transient-local-homes for comms events, signal-as-noticer, induction-as-one-action) + the agent-estate frame (agents as knowledge nodes; dispatch tallies = computed confidence) — recorded as FOUR sketch delivery plans (consolidation-ledger/-signal/-induction, agent-estate-alignment; corpus 25/25 conformant) — AUTHORED, UNCOMMITTED at freeze (held so #664's checks don't reset; commit+push after its merge, announce-window first). FLEET: Badger guards Lair (88e358, owner-named, ARC channel 2026-07-31-validator-lane-*) building the gate-expiry validator in own worktree (brief = channel first entry; second story refineRatifiedDeliveryTickets unblocked at #664); Ingot mid-run (P2 reduce → meta fleet; 327 candidates); dual-active convention with both: ANNOUNCE-BEFORE-STAGING + pathspec commits (two swept-bundle near-misses cured it). MCP-434 fully closed (owner live-render confirm carded). Banner/board: #644 alone (gated, owner-held). Instrument notes: zsh drops word-splitting on unquoted vars (ENAMETOOLONG class); commitlint rejects upper-case subjects; sitting-by-cards WORKED (pattern seed in napkin).
> - **RULING 42 + PERMANENCE PASS (2026-07-30 ~20:40Z, owner verbatim): "You are not the only agent. I will start a dedicated consolidation seat soon. Please commit, push and merge the coordination branch… this is not a session end, this is making the gathered understanding safe and permanent."** Executed: wrap-grade loss scan with the seat LIVE (no closeout broadcasts, no claim change; formation letter stays owed at actual seat end), this records commit, roll-up #2 to main, branch rotation to coordination/estate-2026-07-30-c for the incoming consolidation seat. EVENTS SINCE THE 17:35Z DISCHARGE BLOCK: roll-up #659 MERGED 81fd98053 (34f24834d main-ancestry verified) → Inferno closed MCP-442 (Done 17:47:31Z, verified) and MCP-437 (parent, 17:52Z) — the family is fully closed; their end-of-lane cricket quartet ran 8/8 (legacy Cricket seat names ran template-less — defect window CLOSED by #654's vendor-neutral roles, 4/4 clean on the adversarial wave); Director routing verdict at their freed-seat request (event e1e745d7 → reply): NO new lane — the remaining release gates (guidance artefact, MCPJam suites, one-click install) are Matt's conn under ruling 40; the owner-activated reviewer anchor closed at their boundary per the verdict (owner's reply did not override). BOTH peers closed clean with formation letters in `.agent/experience/` (Inferno's committed a3783dc14; Plover's committed by THIS records commit); registry at 20:40Z = this seat alone. INSTRUMENT NOTES: the harness swept `run_in_background` Bash tasks twice (~18:35Z, ~19:12Z; owner confirmed not-his — harness-side cause is INFERENCE, unproven) — watcher + F-75 re-armed via the Monitor tool per `use-monitor-for-event-driven-wake` and survived; the freeze-block "spend limit HIT, dispatches die" is STALE — Inferno's quartet succeeded ~17:50Z (cap-cleared is INFERENCE — verify before relying); Plover's routed loss 35bd4690 (per-user Cricket memory calling the delivered Sol/Terra/Luna trio future work) verified CURED in the memory file (19:17Z stamp) + index line trued; the #659 branch auto-delete race resolved via peer re-push, converged 72f8ecb2e with zero loss. (2026-07-30 ~15:45Z, owner verbatim, SUPERSEDES the Thursday-evening submission timing in rulings 14/25 and the morning freeze):** "Submission deadline has moved to Thursday 6th August. Matt has the conn. He may choose to submit earlier. Please make sure his handover document is fully up to date, and transfer ownership of all key tickets to him." EXECUTED same hour: handover doc f0e5cef166d2 fully refreshed (~15:50Z stamp — conn-active header, 6-Aug timing, gates 7 carousel-screenshots + 8 privacy-policy-truth added from the day's verified findings, John Roberts typo fixed, MCP-432 update-process pointer added); key tickets assigned Matthew Gregory: MCP-309/302/306/292/268/420/143/298/437 (415/416/443 already his); M0 target re-dated. Consequences for the seat: submission-day standby pressure RELAXES to a week; the evening runner-seat sequence (Brazier's 5555cb93) re-anchors to Matt's chosen window; MCP-420 trigger now explicitly Matt-or-Jim; MCP-421 "first post-submission priority" clock starts at ACTUAL submission. "I expect the core Cricket variants to be renamed appropriately as well .agent/sub-agents/templates/cricket-haiku.md" — extends the Cricket follow-on the owner gave Plover directly (vendor-neutral Codex Cricket triad, easy invocation, when-to-call guidance; Plover keeps it OUT of #638). The quartet's names bake model names in (cricket-fable 9 refs / cricket-opus 8 / cricket-haiku 49 incl. generated wrappers); "appropriately" reads against the vendor-neutral thrust but the naming proposal belongs to the ticket. Routed to Plover as ticket scope (relay 87669086, threaded); Plover mints the MCP- ticket carrying both owner asks verbatim (ticket-first nudge 413ab39b owner-ratified "yes, thank you"); this seat mints from their notes only if they hand it back. ALSO: seat cadence SLOWED at owner word (~12:35Z, "slow your cadence... nothing to do but watch and occasionally support") — heartbeat 480s relabelled quiet-supportive-watch, F-75 poll 300s, watcher unchanged; declared on-stream (0d21b38e).
>
> **MORNING BLOCK (~08:55Z) — rulings 21–28 and the morning freeze below REMAIN BINDING:**
>
> - **OWNER RULINGS THIS SEAT, carry verbatim:** (21) MILESTONE DOCTRINE — "milestones should be simple and completable, and they should reflect externally visible changes... we have labels for that" (two theme-milestones retired with banners; M0 trued to his Thursday-evening word; TOOL LIMIT: Linear save_issue can SET but not CLEAR a milestone — retired-members + M6 residues need his UI one-clicks). (22) NO CHANGE FREEZES — "we don't do change freezes, we do absolutely world class observability and the ability to respond quickly and safely to issues" (never propose a freeze; post-submission-deferral of a safe simplification is the same instinct in disguise — caught twice at this seat). (23) STRUCTURE OVER VIGILANCE — "constant attention should not be part of the toolkit in good engineering". (24) FALSIFIABLE STRUCTURE AT THE SURFACE proven valuable (owner word; verdicts carry falsifier-invitations — a verdict wrong on both destinations converged in ~4 min because of its structure). (25) THE SUBMISSION-DAY CUT (~07:52Z cards): fail-set all human-held; in-flight PRs finish at full condition; everything else RESTS; seats to submission-support standby at their merge; EVIDENCE-FOLLOWS (MCPJam suites against www promptly POST-Clerk-switch, never a form gate); apps-leg auth = owner's attended `mcpjam oauth login` AT the switch window. (26) RATE LIMITER REMOVED NOW (MCP-411 Urgent): never-asked-for (April CodeQL obedience, ADR-158 rationalised it), CodeQL false-positive for this architecture (owner's own ruling), upstream key EXEMPT (internal service — the ADR's threat was a half-truth), Fluid Compute precludes in-process counting; "keep useful improvements, remove the non-functional complexity" — adjudicated extraction; routed to Glowworm queued behind #647; MCP-288 Done / MCP-90+274 Cancelled into it. (27) CRICKET DUOS for complex sub-agents ADOPTED (MCP-405: Fable-low normal + Sonnet-high adversarial, unnamed, phase boundaries only, splits route to the dispatcher; activation via reviewed PR). (28) TS high-bar sharpening (at Sycamore's seat ~07:56Z): exceptions are "a high, high bar", never a licence for existing js. ALSO STANDING: ALL cricket legs dispatch UNNAMED (round-13 conclusion; MCP-386 ledger); MCP-406 (rules corpus unloadable on non-loader platforms — triage/organise, post-submission, High); MCP-404 (blocked-on-owner signal; the bell trued to zero and its mechanism's redesign homed there).
> - **STATE AT FREEZE (~08:55Z — recompute at pickup):** finish-set #646 MERGED (`4ead4d07657`, MCPJam instrument restored), #645 MERGED (`b5378268a`, absorption-ack rule + PDR-133 declarations live), #647 settling at Glowworm (MCP-411 queued behind its merge), Sycamore's kit-move pair building (TS-source-runtime + ADR-213 sibling, owner-ruled at their seat; #644 reworks after PR A; then the design lane RESTS with a write-up). Seats: Possum (standby; MCP-393 slice B falsifier-gated), Brazier (standby; evening runner-seat sequencing held), Glowworm (#647→MCP-411), Sycamore (arc→rest). OWNER LEGS = the critical path: Clerk window (MCP-143), Cloud-Config#551 (NUMBER COLLISION: this repo's #551 is an unrelated merged deps PR — always carry the repo qualifier), Aakesh's four, MCP-339, listing copy, MCP-268 comms sign-off (STILL the one gate with no visible motion). Matt-doc state-at-a-glance refreshed ~08:45Z (six gates).
> - **THE EXPLORATION (owner-directed subject: "the succession itself"):** Movement-1 capture DURABLE at `.agent/reports/agentic-engineering/succession-and-conscience-concept-exploration-capture-2026-07-30.md` — six clean successions, the frame-blindness triple (bell / flip-lags / limiter: instruments verify premises downward, never a premise's right to exist), the three owner principles, four candidate proposals with falsifiers. Movements 2–4 run post-compaction FROM that record.
> - **SEAT MECHANICS AT THE BOUNDARY:** all three monitors (watcher, F-75 poll, 240s dual-surface heartbeat) STOPPED BY OWNER WORD at compaction readiness ("it stops the compaction message being lost in a stream of comms acknowledgements") — post-compaction FIRST ACTS: re-arm watcher (same seen-file + F-95 assert + foreground gap sweep), re-arm F-75 pair, re-arm heartbeat with claim `a2286c53` (stays open through the boundary); heartbeat silence is DECLARED on-stream pre-boundary, never retirement.
>
> **HISTORY — Bora's Moment-1 pre-positioning + tenure close-out below (binding where marked; roster/lane state historical).**
>
> ### ▶ prior: SUCCESSOR PRE-POSITIONED (PDR-064 Moment 1), 2026-07-30 ~06:15Z at owner word ("Falcon hunts Flight (52841f) is your eventual successor, please do a full handoff"): Falcon hunts Flight (`52841f`), registered standby 06:08Z, foundation complete. AUTHORITY REMAINS BORA'S until Falcon's Moment-2 (readiness gate + pasted mechanical check first). Handoff record refreshed at the claim-addressed path; wrap-grade ceremony run (ruling 19).
>
> **TENURE CLOSE-OUT NOTES (Bora, 2026-07-30 ~06:15Z — durable half only; recompute every derivable):**
>
> - **SEVEN MERGES, ZERO DISMISSALS**: #639/#635/#637/#640/#641/#642(rotation)/#643(brand batch complete) — each at a lane's sha-pinned recount re-verified at the seat. The #635 fix-first arc is the tenure's doctrine moment: five CodeQL alerts CURED not dismissed, vindicated by a measured super-linear-backtracking find the dismissal would have preserved. "False positive" reframed as an ANALYSABILITY defect; positional alert identity makes dismissal a recurring tax (#83-86→#226-229).
> - **OWNER RULINGS THIS MORNING (~06:05Z card)**: #643 key granted (merged 5a7d4406c); THYME CARRIES MCP-372 + MCP-371 slices 3-5 (owner-named executor, overrides the fresh-seat rec); cricket cadence EVENT-DRIVEN between owner sessions (the standing 2026-07-23 cadence question CLOSED by owner answer).
> - **GUARDED MINT IS MANDATORY** (the #642 incident: unguarded `GH_TOKEN=$(mint)` fell back to OWNER auth when the rebuilt CLI required `--scope`; on-PR authorship correction; failure-mode dd22ca84): `token=$(mint --scope <scope>) || exit 1`, always.
> - **Rotation executed on the rule's own text** (branch DUE at UTC-date rollover — the "morning trigger" was this seat's invented paraphrase, caught by three cricket legs; read the rule, never a paraphrase). `estate-2026-07-30` live; 24h clock restarted at the cut.
> - **Standing instrument notes minted this tenure**: alert reads are REF-SCOPED (`?ref=refs/pull/N/merge`; per-number GETs return null off-default-branch); lane state derives from PR/merge truth never heartbeat labels; the retrieval-first reviewer ladder ran n=10 at 100% on one ask; seat-D quartet darkness is SEAT-LOCAL (Thyme's D delivered; round-12 inline-arm result in the quartet tally); MCP-359 sinks toggle friction UNCURED (toggle→push→restore-verified every push).
> - **Routed at close**: MCP-393 → Possum weaves Midnight (d5848b, the fresh seat its record names); MCP-372+slices → Thyme (owner word); MCP-395 + axe-core + MCP-398 remain owner/Director-held; napkin OVER rotation threshold (dedicated pass pending, never a closeout side-effect).
>
> ### ▶ prior: SITTING DIRECTOR Bora binds Thermal (`258cbb`), seated 2026-07-29 20:57:36Z (Moment-2 `b57bc16f`, succeeding Lynx guards Whisper per its Moment-1 `a7de0e7b`, owner-named full handoff); standing down at Falcon's Moment-2; claim `a2286c53` hands over by adoption
>
> **SEATED-BLOCK NOTES 2026-07-29 ~21:15Z — durable half only; recompute every derivable (Squall's command block below stays canonical). Rulings 1–20 in Lynx's block below REMAIN BINDING, carried by reference.**
>
> - **NIGHT-SHIFT ROTATION (owner-executed ~20:55–21:08Z), all three deep-context seats succeeded in one window:** Lynx→Bora (Director, this block); Schooner→Tarsier (PDR-063 deliberate succession — record + 3 claims adopted, MCP-143 closed at-rest, heartbeat-end by intent 20:59:35Z); Altair→Thyme (owner word "adopt now" after the Altair session BROKE MID-HANDOFF — NO handoff record exists; the lane's handoff substance is Altair's tenth-boundary freeze event `353f687f`, and Thyme's 21:08Z pickup broadcast is the pickup record). Standbys registered before each flip — the standby contract (watcher + registration, no heartbeat, no claim) worked as designed three times in one hour.
> - **LANDED AT THIS BOUNDARY:** PR #639 MERGED (`SHA:55d6cc8a3`, key-turn at Tarsier's 21:03Z recount re-verified at this seat; MCP-385 auto-flipped Done by the Linear-GitHub integration — no manual flip needed when the PR link is attached). **Fleet consequence: `merge-bot mint-token` requires an explicit named `--scope` AFTER a checkout rebuilds agent-tools** (pre-merge builds keep the old shape; MCP-360 source-bound-gate pattern). Coordination branch merged main and PUSHED (`4647b3f0b`→`79a8531d6`, ls-remote-verified).
> - **MCP-359 FRICTION SURVIVES CURRENT MAIN — the prior note below ("both frictions disappear once the branch carries current main") is FALSIFIED on its sinks half.** The coordination push still required the `.env.local` sinks toggle (`["sentry"]` for the gate, restored `["sentry","posthog"]` after — steady state verified). The :3020 port half IS cured by #636. Structural cure family: harness adapts (owner-ruled, the port-3020 precedent); the UI-test webServer env shape is the remaining un-adapted surface.
> - **Owner word ~21:05Z, discharged same boundary:** "Altair is stuck mid-handoff, Thyme is trying to pick up their lane, Osprey needs you to unblock them, Tarsier is doing PR 635." Thyme confirmed (`d52aeb69`); Osprey directed-unblocked (`ac509d4e` — their 21:04Z heartbeat label still read "blocked on Director key-turn" for a PR merged 20:47Z: NOTIFY-dark, THIRD observed instance on that seat; hourly gap sweep remains their only proven wake); Tarsier proceeding on the #635 structural cures (dismissals stay withdrawn, owner-driven).
> - **Instrument note:** two of this seat's first probes failed silently from a cwd left in the app workspace by an earlier `cd` — empty peer-liveness read + empty event glob, both from the wrong tree. The empty-read-is-transport-failure discipline caught it; probes now use absolute paths or per-command `cd`.
>
> **SUPERSEDED — Lynx's sitting block below (its 20 rulings and instrument calibration remain binding; roster and lane state are historical).**
>
> ### ▶ prior: SITTING DIRECTOR Lynx guards Whisper (`9e8a61`), seated 2026-07-29 07:56Z (Moment-2 `b573d009`, succeeding Moon rides Penumbra per its Moment-1 `f38cc2a5`); stood down 2026-07-29 20:57:36Z at Bora's Moment-2; claim `a2286c53` handed over by adoption
>
> **MID-TENURE DURABLE-HALF REFRESH 2026-07-29 ~09:45Z — rulings and records only; recompute everything derivable (the commands in Squall's block below are canonical).**
>
> **OWNER RULINGS TODAY, CARRY VERBATIM:** (1) supertest classifies by BOUNDARY (encoded on main via #622/MCP-338); (2) Copilot STANDING at PR-open for source-touching PRs; (3) MCP-309 submission gates on ALL FOUR upstream API defects (Aakesh's; owner target THURSDAY EVENING); (4) MCP-scoped work INCLUDING llms.txt lives in the MCP project; MCP work requiring infrastructure carries LINKED tickets across the two projects (Infrastructure Platform/INFP backlog is live); (5) none of the PR-551-extracted items are assumed submission blockers; (6) OAuth namespace: prefer collapsing the canonical edge scope to `/mcp*` + path-scoped well-knowns, GATED on client-compat evidence — general plus Claude and ChatGPT by name (record: MCP-344); (7) multi-host self-description preferred (alpha AND www), www wins if unsound; NOTHING hardcoded — every URL/host derives from the deployed instance, both repos (records: MCP-307 design + gate, MCP-351 app sweep, INFP-8 route locals); (8) "avoid skip rules unless we have to" (JR, owner-quoted; INFP-4); (9) **PostHog scope narrowing NEVER owner-agreed** — "we need visibility of analytics events from day 0"; MCP-117/242/243/354 block MCP-309 (record: MCP-63 comment + register); (10) goal-holding MECHANISM commissioned — "hold the project goals, not just what happens to be happening right now" (MCP-355; interim: owner-facing state answers walk the goal structure FIRST, activity second); (11) DoD-in-every-ticket + strict change ceremony commissioned (MCP-356; effective at this seat immediately: minted tickets carry DoDs, DoD changes route to the owner); (12) the MCPJam credentials expiry is a SOFT bound — "reminting credentials is the work of seconds" — never day-shaping pressure; (13) the production CAPABILITY BASELINE (2026-07-29 ~11:45Z): "Sentry, Posthog, Elasticsearch and all third party integrations need to keep working in the production instance" — additions never silently subtract standing capabilities, omissions bear the burden of proof; Sentry rides the sinks alongside posthog in EVERY environment ("non-negotiable"; validator slice MCP-361); the fair explicit form is SLOs for key systems (his own proposal — pointer MCP-362; interim discipline: diff every config proposal against the capability baseline before presenting it); (14) the Thursday submission is EXTERNAL and FIXED on the www endpoint — "Thursday is www, this has been made clear, it is not open for questioning, we cannot simply move an external deadline because it is inconvenient"; a fixed thing at risk gets a MOBILISATION VERDICT, never the decision re-offered as options; (15) the Clerk switch IS the PUBLIC-BETA moment — "as soon as we switch the MCP server is in public beta"; no app-layer invite gate exists or is planned this phase; listings-absent interim accepted (M4 text re-trued); (16) the REVIEW-RATCHET discipline (from #628's ten rounds): two-axis thread dispositions (correct AND proportionate), reasoned decline-with-falsifier is first-class, tally-then-step-back at ~4 settled rounds, Copilot re-request under the standing grant is AT-OPEN + substance-triggered NEVER per-push (memories: review-ratchet-convergence-discipline, copilot-standing-for-source-prs); (17) cards, the SEVENTH escalation — "Always, ALWAYS express blocking user input requests as cards" — any "holding for your word" line on any surface without a live card is the failure; a question already asked in prose is still uncarded. ALSO STANDING: the MG submission-handover document (Linear doc f0e5cef166d2, owner-commissioned + owner-retitled) — the Director refreshes its State-at-a-glance at each significant landing; day-0 analytics DISCHARGED entirely 2026-07-29 (MCP-117/242/243/354 all Done; production emitting, owner-confirmed).
>
> **RULING 18 (2026-07-29 ~14:50Z, at the Thursday-gate status card):** "No one is chasing anyone, we respect each other. He will be in tomorrow, he will take care of it" — colleagues' committed lanes run on TRUST, never pursuit: do not propose chasing or nagging a human colleague; a first-hand status read is legitimate Director work, the follow-through is theirs. Enacted: Aakesh lands MCP-327..330 from Wednesday on his own clock; MCP-339's curriculum-expert sign-off is owner-confirmed IN HAND (no name given — never invent one on the ticket). Both Thursday ticket-gate clusters are human-held-and-moving; the seat stands down re-surfacing until the tickets move or Thursday morning, whichever first. The MG doc's "chase directly" phrasing re-trued the same hour.
>
> **RULING 19 (2026-07-29 ~15:40Z, relayed via Osprey at the lane swap):** "a full handover probably needs almost a full /oak-wrap" — wrap-grade ceremony is the bar for DELIBERATE lane handovers: safety evidence, a resume map or four-section record, and a ratification ledger; the receiving seat reads the record end-to-end before any source action. Worked both ways in the Osprey<->Europa temporary swap (owner-directed, executed and reverted same afternoon).
>
> **RULING 20 (2026-07-29 ~15:45Z, owner verbatim + ratified scope):** "everywhere we use a value it should come from the design system, no hardcoded values" — binds CONSUMER surfaces; kit-internal literals are the definitions; infrastructure values are not design values; retained consumer literals need his named word with a recorded disposition (replace-with-role default). Minted as the rule `design-values-come-from-the-system` (trigger-loaded) the same day.
>
> **RECORDS OF EVENT (pointers):** Cloud-Config PR #551 review fully extracted — MCP-344…MCP-351 + the MCP-172 coverage comment; INFP-1…INFP-8 cross-linked at the seams; decisions-register projections appended to `first-major-release.plan.md` §Dated notes (2026-07-29 entries). The Kayak/Starling incident: ONE Codex seat whose context-clear rotated its identity (019fa9→019fac) was read as two colliding seats; owner stopped it; artefact inventory ZERO (nothing lost, hygiene complete); its plan recovered from Codex platform history and posted on MCP-305 as a ⚠️ QUARANTINED record at owner word — "do not assume the plan is correct or useful". MCP-305 has since been DECLINED at honest capacity checks by BOTH Raccoon and Schooner — it needs a FRESH owner-launched seat (spec = the ticket + Moon's routing event 736f6435; the quarantine binds).
>
> **INSTRUMENT CALIBRATION (fleet-relevant):** the PDR-078 "active <4m" window against the fleet's 240s heartbeat cadence is a knife-edge — healthy seats flicker "offline" at poll boundaries by construction. Read active→offline flickers as noise; only ≥10m (retired) with a failed ping and a clean host-sleep/boot check is signal. This seat's F-75 poll emits retired-only transitions accordingly.
>
> **SUPERSEDED — Moon's blocks below (its 07:45Z durable half remains binding history; roster and lane state are historical).**
>
> ### ▶ prior: SITTING DIRECTOR Moon rides Penumbra (`7e34ff`), seated 2026-07-28 21:14Z (Moment-2 `fffc722e`); stood down 2026-07-29 07:56Z at Lynx's Moment-2; claim `5d1d04db`
>
> ### ▶ SUCCESSOR PRE-POSITIONED (PDR-064 Moment 1), 2026-07-29 ~07:45Z at owner word: Lynx guards Whisper (`9e8a61`), registered standby 07:41:41Z, foundation complete. AUTHORITY IS STILL MOON'S until Lynx's Moment-2 (readiness gate + pasted mechanical check first).
>
> **HANDOFF REFRESH 2026-07-29 ~07:45Z — the durable half only; recompute everything derivable (`claims active-agents` with UTC now, `gh pr list`, the comms stream since ~07:00Z).**
>
> **OWNER RULINGS THIS MORNING — carry verbatim, all broadcast on-stream (event `45f8523f` + successors):**
>
> 1. **The submission gates on ALL FOUR upstream defects** (MCP-327/328/329/330, Aakesh's) — encoded mechanically: MCP-309 `blockedBy` all four. Chasing Aakesh is Thursday's longest pole; the owner's target moved to THURSDAY EVENING (tickets still say Fri 31 Jul — a day behind his word).
> 2. **Supertest classifies by BOUNDARY, not tool** (verbatim in `45f8523f`): black-box-over-network = E2E; imported-code-in-process = integration. Doctrine amendment riding PR #622 (MCP-338); Starling's reverse sweep unblocks at its merge.
> 3. **Copilot request is STANDING at PR-open for source-touching PRs**; docs-only stays selective per the 26 July doctrine. Memory: `copilot-standing-for-source-prs`.
> 4. Also ruled: plugin content APPROVED (merged, #620 `SHA:31c958349`; curriculum-expert sign-off = MCP-339, a SUBMISSION gate, human, not-agent-resolvable); #619 plan node RATIFIED (merged `SHA:76f5afeca`; output-schema work stays fenced on the MCP-303 captures); **MCP-293 CANCELLED, no tombstone** — no screenshot/carousel input exists in either submission flow (form-inventory report §6 is the evidence; the owner corrected this seat's hedge twice — see WHAT I GOT WRONG); per-deployment served-surface is FINE (no build-profiles work); MCP-342 minted (plugin skills build step, conditional construction — his ask verbatim in the ticket).
>
> **LIVE LANES at pre-positioning (verify freshness before routing):** Raccoon — #622 (MCP-338 doctrine, settling; gates Starling); Schooner — MCP-340 (plugin tool-reference re-true, gates MCP-309; scope sharpened on-ticket incl. the distractor-telemetry overclaim); Starling — MCP-305 (response sizes from the existing outbound metric; feeds the form + MCP-298); Altair — MCP-303 armed, owner-ATTENDED, **credentials expire ~16:33 TODAY**, go-moment pending the owner's word (he said "later this morning").
>
> **OWNER-HELD remainder:** MCP-303 attendance (clocked today); Clerk production + Cloudflare chase (his "later today"); the Aakesh chase (per ruling 1); MCP-339 expert sign-off; listing name/copy (MCP-292/306, human copy team); MCP-307 decision; Starling's Linear payload approval for the E2E sibling ticket (low urgency while that lane holds); MCP-334 routes to the next fresh seat the owner opens.
>
> **WHAT I GOT WRONG — inherit the corrections, never the confidence:** (1) carried MCP-293's debunked premise PAST its own debunk report (which the handoff I inherited cited but I never read) into owner-facing advice — the ticket-shaped `description-is-not-a-check`; cure: read the evidence artefact, not the summary line that points at it. (2) Hedged a forced answer twice — asked permission to close a disproven ticket AND left it a revival clause; the owner corrected with "no tombstones"; principles §Strict-and-Complete + §Architectural-Excellence's "deferential opt-out clause" passage are the exact authority. (3) Filled free seats with surfaced hygiene work without re-deriving each route against the Thursday frame — busyness reads as alignment; an idle seat would have raised the priority question sooner. The owner's cricket directive (two A/B pairs, one normal one adversarial — event `25a14cfa`, memory `cricket-two-ab-pairs`) caught pieces of this; supply provenance-rich frames and the haiku legs stop false-firing (Altair's 4/4 run proved it).
>
> **STANDING MECHANICS:** the 24h branch clock — `coordination/estate-2026-07-28` was cut 22:34Z on the 28th; convergence is DUE at session-open once overdue (the rule's own trigger). The rotation debt on THIS file (Squall's note below) now carries two more superseded blocks — still a curation pass for a successor with budget, never a trim. Watcher hourly exit-124 re-arms + the F-75 pairing are by-design cadence.
>
> **SUPERSEDED — Moon's overnight block below (its owner directives and morning card stand as history; lane state is stale).**
>
> **OVERNIGHT REFRESH 2026-07-28 ~23:00Z — the durable half only; recompute everything derivable (`claims active-agents`, `gh pr list`, the comms stream since ~21:00Z).**
>
> **DELIVERED OVERNIGHT (owner asleep ~21:55Z→~08:00Z, his word: "keep going while you can" + "I would love to see PR 569 safely and usefully merged by the morning"):** the full owner-instructed sequence landed at ruled full conditions — #582 (`SHA:c4419a6bb`), #614 (`SHA:e05be2688`), #569 (`SHA:60dd04cc1`); the coordination branch ROTATED to `coordination/estate-2026-07-28` (cut tree-preservingly at the merged main tip; primary sits on it); the owner-instructed 24h-lifetime rule is LIVE (`.agent/rules/coordination-branch-24h-lifetime.md`, routed through new-rule-vs-pdr-clause); the MCP-302 plugin was BUILT to validated draft PR #620 (held at DRAFT by ruling for the owner's morning glance — its description is public copy); MCP-332's plan node landed as draft PR #619 (sketch, ratification-gated); MCP-333 Done; MCP-334/335/336/337 minted. LATE ADDITION: #621 MERGED 23:11Z (`SHA:62ad075e7`, full condition, ground-truth verified) — **MCP-241 complete end-to-end and Done**; Raccoon's lane closed clean, successor pointers homed on the ticket (MCP-242 consumes the sink; MCP-243 wires close(); MCP-117 gates live traffic). At 23:12Z the board reached the owner-away COMPLETION state: every team-doable item is landed or holding at its NAMED gate; nothing waits on anything but the owner.
>
> **OWNER DIRECTIVES ISSUED TONIGHT, CARRY VERBATIM:** (1) "Always run Cricket in A/B pairs, and I recommend two pairs, one normal, one adversarial" (per-user memory + broadcast `25a14cfa`); (2) worktrees where reasonable — work products start in worktrees, the coordination branch stays rotatable; (3) the #569 sequence + 24h rule instruction (executed, above).
>
> **DELIBERATE STATE ON THE PRIMARY — do not "fix":** the napkin working copy (fleet appends) and Starling's ABANDONED-IN-PLACE edit to the June output-schemas backlog plan (superseded by PR #619's delivery node; its clearance is an owner-run restore on the morning card). This refresh block itself may ride uncommitted — warden-class hygiene commits it with the next batch.
>
> **THE MORNING CARD (assembled overnight, surface at owner return):** #619 plan-node ratification; #620 glance → merge at full condition (plugin licence call — validate passes with NO license field, nothing guessed; ratified subset 4 skills/4 workflows/4 agents; four submission gates named in the PR body); the stale-draft restore; MCP-303 pack run attendance BEFORE credentials expire ~16:33Z 2026-07-29; Clerk production (the listing blocker); the Cloudflare/`CANONICAL_HOST` chase (MCP-172); the upstream-defects gating call for Thursday; MCP-334 fresh-seat routing (Schooner declined on an honest capacity read; mechanism fully externalised on the ticket); the supertest-classification doctrine question (Raccoon's 22:51Z broadcast is the capture); the Copilot standing-step question (owner-held; interim shape broadcast `d8970d02`: full-condition Copilot leg applies to important/risky PRs only, selective doctrine governs the rest).
>
> **SUPERSEDED — Squall's 21:10Z handover refresh below (its durable half — owner rulings, corrections, the instrument-state family — remains binding; its roster and lane state are historical).**
>
> ### ▶ prior: SITTING DIRECTOR Squall wakes Apex (`459fd1`), seated 2026-07-26 (Moment-2 `f1d9a6f2`); stood down 2026-07-28 21:14Z at Moon's Moment-2; claim `56fdd977` closed
>
> **HANDOVER REFRESH 2026-07-28 ~21:10Z — supersedes every block below.**
>
> **READ THIS PART FIRST: most of what follows the next two sections is already
> wrong, and that is structural, not sloppiness.** I wrote a carefully-grounded
> state capture at 17:30Z. By 21:00Z — three and a half hours — it was false in
> six places: #582 had gone from `dirty/uncarried` to mergeable-and-carried;
> MCP-319 had merged (#616, #617); two more of Raccoon's PRs had merged (#615,
> #618); "20 behind main" was 39; "three lanes" was six seats; and the item I
> had flagged as **the** urgent owner-gated one-way door had been ruled by the
> owner to be not ours at all. Every one of those was grounded when written.
>
> The lesson for the seat, and the reason the owner keeps saying _do not accept
> inherited positions_: **a Director handoff has two kinds of content, and only
> one of them may be inherited.** Owner rulings, deliberate-looking oddities and
> recorded mistakes are durable and must be carried verbatim. Lane state, PR
> numbers, branch positions and "next steps" are derivable, decay in tens of
> minutes, and must be RECOMPUTED — never read off this file. Where a fact below
> is derivable I give the command instead of the value. Where I give a value, it
> is because no command yields it.
>
> **RECOMPUTE, DO NOT INHERIT** — run these before any routing decision:
>
> ```bash
> pnpm agent-tools:collaboration-state -- claims active-agents \
>   --active .agent/state/collaboration/active-claims.json \
>   --now "$(date -u +%Y-%m-%dT%H:%M:%SZ)"        # who is live, freshness by name
> gh pr list --state open --json number,isDraft,mergeStateStatus,title
> git fetch origin && git rev-list --count HEAD..origin/main   # coordination drift
> ```
>
> Unresolved review threads are NOT in `gh pr checks` and never have been — the
> GraphQL `reviewThreads(first:100){nodes{isResolved}}` read is the only honest
> source. At 21:05Z it gave #614=1 (now cured and resolved), #582=0, #569=13.
>
> **OWNER RULINGS — NOT DERIVABLE FROM ANY SURFACE. CARRY THESE VERBATIM.**
>
> 1. **NO AGENT SUBMITS the connector or the plugin** (2026-07-28 ~18:0xZ):
>    _"For now we call it Oak National Academy, but other people will review
>    that. DO NOT submit the connector or the plugin, that will be done
>    manually, by a human, later."_ This is a prohibition on the action, not an
>    ask-first. Every lane ends at ready-and-verified and stops. No amount of
>    green licenses it. The listing name is **provisional** — mark it so.
>    This REPLACED my earlier reading that the connector name was an urgent
>    one-way door; the door exists, it is simply not ours to walk through.
> 2. **Tests never test config, only behaviour.**
> 3. **Copilot review grant (standing, general):** any seat may request a
>    Copilot review using the owner's credentials. The discriminator is the
>    REQUESTING CREDENTIAL, never the PR author. Scope is Copilot review
>    requests ONLY — every other third-party write stays bot identity. Request
>    against the current head, and **re-check the commit id at merge**: a review
>    that arrived is not a review of what you are about to merge.
> 4. **All upstream API examples and descriptions must be accurate and
>    functional.** Defects go to Aakesh, never fixed by us: MCP-325/326 parents,
>    MCP-327/328/329/330 children.
>
> **LIVE RULINGS I ISSUED TONIGHT — each carries its own expiry.**
>
> - **#582 has right of way; merge window 21:05Z–22:30Z.** No seat merges
>   anything into main inside it, including my #614. It **auto-lapses at
>   22:30Z** — nobody needs my word to resume. If #582 lands early the window
>   ends there. Reason: CI validates #582's test-merge tree against current
>   main, so every fleet merge re-reds it ~25 min after it goes green; twice
>   tonight already. A lane cannot escape that from the inside.
> - **Scoped `sonar.cpd.exclusions` ratified** for #582's compliance tables,
>   four conditions (exact files not directories; CPD only; config comment
>   naming the reason and PR; glob + resolved file list posted before merge).
> - **`@vercel/functions` approved** as an app runtime dependency for MCP-241's
>   `waitUntil`, five conditions. Raccoon's off-Vercel probe came back OBSERVED
>   (not documented): no throw, silent no-op registration, promise still
>   settles — so no local fallback, unconditional injection at the composition
>   root, import in exactly one file.
> - **Schooner holds the stranded-credentials lane.** `origin/main`'s
>   `.gitignore` has **no credential pattern**; the hardening exists only on
>   the coordination branch. I verified the exposure is **latent, not live** —
>   the one live token file sits on the primary, which is on the coordination
>   branch, and `git check-ignore` resolves it. The hazard is the next
>   credentials file in any main-based worktree. Standalone PR prepared now,
>   **merges FIRST when the window clears**, ahead of #614.
>
> **WHAT I GOT WRONG TODAY — inherit the corrections, not the confidence.**
>
> - I filed MCP-324 proposing to remove a deliberate security property, because
>   I criticised a module without reading its governing ADR. Before calling a
>   deliberate-looking behaviour a defect, find out whether it is deliberate.
> - I wrote a TSDoc claiming this module is the only place `OAK_API_KEY` touches
>   an asset request. False — the route derives the signing secret from it.
>   Copilot caught it; cured at `a5d1140c2`. My own confident prose about a
>   security boundary was wrong about the code three files away.
> - I read 15 dirty paths as a peer's in-flight work and broadcast it. All 15
>   were byte-identical to `origin/main`. Probe with
>   `git show origin/main:<path> | diff - <path>` before concluding anything
>   from `git status`.
> - I told a seat #570 had no Copilot reviews that day, from an unpaginated
>   30-row page, and _corrected them_ from that partial view. Always
>   `--paginate`, always filter on `commit_id`.
> - I over-extended the owner's plugin name onto the connector listing when
>   carding him, and carded a decision he then removed from our hands entirely.
>
> **THE FAILURE FAMILY THIS ESTATE KEEPS HITTING** — six instances in one day,
> napkin-homed: a reading about the INSTRUMENT'S STATE mistaken for a reading
> about the target. The always-succeeding control; the page read as the whole
> list; the unauthenticated inspector; the stale-head review; the vacuous
> zero-match filter (`pnpm --filter` on a wrong package name exits 0 silently);
> and Schooner's find tonight — a config comment describing 326 files as
> "untracked, machine-local" while they sit tracked in the index. **Cure: name
> the instrument's state in the same sentence as its result.** A reproduction
> that matches symptoms is not proof of cause. Conformance is not correctness:
> four MCPJam suites passed clean while driving the tools found a signing bug,
> four lying schemas and two dead examples.
>
> **DELIBERATE STATE — DO NOT "FIX" IT.** Three files are dirty on the primary
> (`asset-download-route.ts`, `asset-proxy.ts`, `126-asset-download-proxy.md`)
> plus the napkin. They are the ADR-126 rationale work living safely in **#614**.
> Do not clear them with git — `checkout`/`stash` are hook-blocked and are the
> wrong move regardless. They resolve with an ordinary `git add` once #614
> merges. NOTE: `asset-proxy.ts` on the primary is now one commit behind the
> #614 head after tonight's cure — re-probe before assuming identity.
>
> **OWNER-HELD — do not chase, surface at action moments.** The #569 design
> bundle (326 files, +55,143 lines, owner's raw studio export, removal-class —
> he routed Schooner directly); the CODEOWNERS repo-wide rider on #569 (my
> position: wrong shape, belongs in its own PR whatever the substance); Clerk
> production instance changes; MCP-304 CIMD walk-through; MCP-281 privacy
> consultation; MCP-292 listing wording (human copy team, notably Aakesh —
> agents add sourced suggestions only).
>
> **CREDENTIALS CLOCK.** `.agent/state/mcpjam-credentials.json` holds live
> access + refresh tokens, gitignored at `a713dbee3`, **expires ~16:33 on
> 2026-07-29**. Never commit or transmit. MCP-303's owner-attended pack run and
> MCP-293's screenshots both depend on it.
>
> **ROTATION DEBT ON THIS FILE — routed, not done.** `CURRENT HANDOFF STATE` is
> ~860 lines against this file's own 320-line hard limit, and it is append-only
> stacked blocks each saying "supersedes every block below; verify each line
> live" — an admission the content cannot be trusted, bolted onto content that
> keeps growing. That structure is the drift mechanism the owner keeps catching.
> I did NOT trim it tonight, deliberately:
> [`knowledge-preservation-over-fitness-warnings`](../../rules/knowledge-preservation-over-fitness-warnings.md)
> forbids shrinking a memory surface to satisfy a line count, and forbids
> archiving unprocessed content — every block needs a disposition first. **The
> rotation is a real curation pass for a successor with budget**: read each
> superseded block, confirm its substance is homed (tickets in Linear, merges in
> git, findings on the napkin, reports under `.agent/reports/`), record the
> disposition, then archive. Not a delete.
>
> **SUPERSEDED — 17:10Z block below.**
>
> **EVENING REFRESH 2026-07-28 ~17:10Z — superseded by the block above;
> verify each line live. All three seats compaction-prepped at owner word and
> CONTINUE; this seat did the same.**
>
> **THE COPILOT GRANT — STANDING, and the model was wrong twice before it was
> right.** Owner's word: _"agents can request copilot reviews with my
> credentials, we are just waiting for proof that it works."_ Proof landed
> 16:11Z (reviews delivered on #607 and #610). **The discriminator is the
> REQUESTING CREDENTIAL, never the PR's author** — an installation token
> returns 201 and writes nothing, on any PR; an owner-credentialed request
> works everywhere. Four disciplines attach, all mine, none narrowing his
> grant: scope is **Copilot review requests ONLY** (every other third-party
> write stays bot-identity); **name the firing seat and the head in comms**
> (the GitHub actor reads as him and there is no body to mark — two seats
> misread my requests as his hand within minutes); request against the current
> head and **re-check the commit id at merge**; and **a request is not a
> review** (~4 min apart, and on #570 one never arrived).
>
> **MERGED TODAY**: #597, #601, #602, #603, #604, #605, #607, #609, #610,
> #611, #612, #613. Every one after ~16:00Z landed under the full condition —
> settled by name across both endpoints AND a Copilot review **of the merged
> head** adjudicated. **Copilot found real defects on every PR it ran on**,
> including a `:where()` specificity bug four Opus reviewers missed.
>
> **OPEN PRs**: **#614** (mine — ADR-126 identity-asymmetry rationale + TSDoc,
> bot-authored, docs only), **#615** (MCP-240, in CI under the full-condition
> watch), **#582** (carrier-less since 26 July, ten Copilot reviews, needs the
> owner's carded disposition), **#569** (coordination draft).
>
> **UPSTREAM API DEFECTS — two parents, four children, ALL ASSIGNED TO
> AAKESH.** Owner ruling: _all examples and descriptions coming from the
> upstream API MUST be accurate and functional._ **MCP-325** (metadata) →
> MCP-327 (`get-sequences` example `english-secondary` invalid — the API's own
> test at `subjects-helpers.test.ts:34` asserts it), MCP-328 (assets example
> points at copyright-restricted content, four source sites), MCP-329
> ("Use the this type" typo, served to every assistant). **MCP-326**
> (behaviour) → MCP-330 (`get-keywords` declares all params optional, rejects
> `{}`). API repo: `oaknational/oak-openapi` (checked out beside this one). **Coverage stated
> honestly on the parent: 20 of 24 generated request schemas carry an example;
> only those the live drive reached were checked.**
>
> **OURS, not upstream**: MCP-319 (schema+example truthfulness, Schooner,
> frozen review-absorbed with 9 uncommitted files in
> `.claude/worktrees/mcp-319-schema-truth`), MCP-323, MCP-324 (**corrected and
> downgraded** — I filed it proposing 404s where ADR-126 deliberately maps all
> upstream errors to 502; acting on it would have opened an existence oracle).
>
> **OWNER RULINGS THIS AFTERNOON**: tests never test config, only behaviour
> (a test pinned the dead slug's value — reshape to presence + round-trip, do
> not just update the value); upstream examples/descriptions must be accurate;
> MCP-292's listing wording belongs to the **human copy team, notably
> Aakesh** — agents add sourced suggestions to the ticket only.
>
> **LIVE CREDENTIALS** at `.agent/state/mcpjam-credentials.json` (gitignored at
> `a713dbee3` — it was NOT ignored and this repo is public) expire **~16:33 on
> 2026-07-29**. Four suites run clean against the deployed alpha: OAuth
> conformance 15/15, protocol 10/15 with 0 failed, Apps 7/7, compat 0 blocked
> across 16 hosts. **Conformance is not correctness** — the same afternoon,
> driving the tools found four lying schemas, two undriveable tools, a signing
> bug and two dead examples.
>
> **FIVE INSTANCES OF THE INSTRUMENT-STATE FAMILY**, napkin-homed: the
> always-succeeding control (`download-asset` used as existence proof), the
> page read as the list (`/pulls/{n}/reviews` pages oldest-first, default 30),
> the unauthenticated inspector, the stale-head review, and the vacuous
> zero-match filter. Cure: **name the instrument's state in the same sentence
> as its result**, and remember a reproduction matching symptoms is not proof
> of cause.
>
> **COORDINATION MERGE DEFERRED, deliberately, with the reason.** At the
> boundary this branch is **20 behind `origin/main`** and the merge REFUSES,
> because main now carries #612's asset-download changes while three files on
> the primary checkout are dirty on the same paths:
> `asset-download-route.ts`, `asset-proxy.ts`, `126-asset-download-proxy.md`.
>
> **Those three are NOT at risk** — they are the ADR-126 rationale work and
> they live in **PR #614**, pushed and ref-verified at `907b9e5c2`. The
> primary's copies are duplicates of that branch.
>
> **Do not clear them with git.** When #614 merges to main, they become
> identical to main and the merge proceeds cleanly by ordinary `git add` — the
> pattern already worked twice today. Until then, leaving the branch behind is
> the correct state, not a lapse. Merge main immediately after #614 lands.
>
> **SUPERSEDED — 14:20Z block below.**
>
> **AFTERNOON REFRESH 2026-07-28 ~14:20Z — supersedes every block below;
> verify each line live.**
>
> **15:18Z ADDENDUM — the tool-schema sweep, and Altair frozen mid-lane.**
>
> **OWNER'S THREE ASKS (2026-07-28 ~15:14Z) and their answers:**
>
> 1. **Graph tools get a strictness boost** — his reasoning: we derive them
>    from bulk data, so we control how they are built and hold all the source
>    data; "strict, all the time, everywhere" is a core repo value. Proper
>    input AND output schemas, realistic examples from the data, partially
>    driven from the bulk data schema. **SCOPE FENCE, his words: "I don't want
>    to replace the hand authored checks just yet."** Ticketed **MCP-319**.
> 2. **Do generated tools have full input and output schemas?** Input yes;
>    **output NO — nothing declares `outputSchema`, anywhere.** Verified at
>    the registration path (`handlers.ts:224-229` passes title, description,
>    inputSchema, annotations only), not by grep. Meanwhile we return
>    `structuredContent` extensively, so we emit structured output no client
>    has a contract for. ADR-058 records a deliberate no-outputSchema
>    decision for one tool, so estate-wide adoption is a real question, not
>    an obvious yes — recorded on MCP-319 rather than speculatively ticketed.
> 3. **Does every tool have a realistic working example?** **Altair proved
>    40/40 tools DERIVABLE live, post-cure.** Distinguish carefully:
>    _derivable_ means a valid call can be constructed from the advertised
>    schema. _Realistic_ — returns real curriculum rather than a
>    syntactically valid placeholder — still needs the live authenticated
>    run, which gates on the owner-attended `mcpjam oauth login`.
>
> **MY SURVEY, superseded by Altair's live instrument but useful for shape:**
> generated 29 files, 22 with examples, the other 7 take no arguments at all
> so need none — that path is complete. Hand-authored: 7 `aggregated-*.ts`
> modules, 6 with no examples. **My required-property regex was unreliable —
> it reported zero required props on the very tools proven to have them.
> Never cite my hand-authored counts as a census.**
>
> **THIRD PARITY GAP TODAY** between the generated and hand-authored tool
> paths: titles (MCP-300), then the two undriveable graph tools, then
> examples generally. The pattern is on MCP-300: the two paths have no
> contract, so every property either acquires is a coin flip on the other.
>
> **ALTAIR FROZEN for compaction at owner word (~15:15Z); the SEAT CONTINUES.**
> mcp-303-reviewer-pack worktree (claim `32541c0c`): 6 modified + 8 untracked,
> all its own, coherent, NOTHING pushed, lint mid-cure with the remaining
> errors enumerated in its freeze event. mcp-300-pr-two worktree (claim
> `137f25c0`): CLEAN at `4e3ba6964` = **#607, settled since 14:30Z, HELD**.
> Landed from that seat today: #605, #570.
>
> **COPILOT VINDICATED THE OWNER'S DIRECTIVE.** On #608 a Copilot review
> caught a real defect four Opus expert reviews missed: a chrome-colour
> scope selector tied the design system's `.oak-link` state selectors on
> specificity and won on sheet order, silently suppressing hover/visited/
> focus feedback — the exact affordance its own test claimed. Cured with
> `:where()`. **`.breadcrumbs .oak-link` on main has the same latent shape,
> pre-existing — routed to me, unticketed.** Also filed: MCP-318 (flaky
> correlation-id generator).
>
> **THE SUBMISSION NOW HAS ONE PARENT: MCP-309** ("Submitting Oak to Claude:
> the connector and the plugin, end to end"), fourteen children, duplicates
> closed (MCP-294→MCP-303, MCP-266→MCP-302), MCP-16 and MCP-296 Done. At the
> owner's instruction the parent and every copy/instruction ticket are
> written for a HUMAN audience per `.agent/directives/editorial-tone.md` —
> MCP-292, MCP-293, MCP-298, MCP-301, MCP-302, MCP-303, MCP-306, MCP-308.
> The engineering tickets (MCP-300, MCP-305, MCP-307) stay in plain
> technical English, deliberately: the directive keeps the editorial voice
> OUT of copy read to build precisely.
>
> **OWNER DECISIONS TODAY**: plugin named **Oak Open Curriculum**; plugin
> scope **trims the creation set** for now; **#576 closed without merging**
> (done, 14:01Z); the J-O app-wiring stack **pulled forward to start now**
> (MCP-239 on Raccoon; MCP-240 onward is the Director's to route).
>
> **STILL OWNER-HELD**: the connector listing NAME (drives the permanent
> slug — the one-way door, currently deriving as
> `oak-curriculum-app-internal-preview`); whether the Copilot request
> becomes a standing step at PR-open.
>
> **COPILOT REVIEW IS GONE FROM EVERY PR WE OPEN — MCP-313.** All four cells
> tested. Automatic review requires a HUMAN PR author; manually requesting
> Copilot requires a HUMAN requester. The App can request any other reviewer
> (it requests the codeowner fine) but cannot add Copilot, on anyone's PR —
> four attempts, three PRs, `201` every time and no timeline event. Twenty
> PRs since 26 July have had no Copilot review. **Doing the bot-identity rule
> correctly is exactly what costs us the review.** Untested and promising: a
> user-to-server token, which carries the owner's entitlement — his call,
> because it is the App acting as him.
>
> **CLERK CORE 3 — MCP-315, sequenced AFTER the submission.** Our surface is
> one app, five source files, server-side only. `verifyToken()`→`verify()`
> does NOT touch us (our four `verifyToken` hits are our own injected
> `TokenVerifier`, not Clerk's). Express `req.auth`→`getAuth(req)` is
> already how we do it. Open question that could change the sequencing:
> whether CIMD (MCP-304) needs Core 3 — nobody has checked.
>
> **MERGES SINCE MIDDAY**: #603 (MCP-297), #604 (MCP-299), #602 (MCP-238,
> completing the M0 PostHog boundary), #605 (MCP-300 PR one), #606
> (MCP-279). Coordination branch merged main and is level.
>
> **FLEET**: Altair (MCP-300 PR two → MCP-303 → #570), Raccoon (MCP-239),
> Schooner (MCP-281, paused awaiting the owner-side privacy consultation).
> Juniper closed out clean.
>
> **THREE INSTANCES OF ONE TRANSMISSION FAILURE TODAY, two of them mine** —
> napkin `43c03362a` + `a08f0ad54`, PDR-098 recurrence signal met. Stale
> observation transmitted as current (my dirty-paths call); a write claimed
> before its result was read (Juniper's push); and an inference fused to a
> true owner quotation, inheriting its authority (the merge-path relay).
> Cure pair for the graduation candidate: at transmission, ask **when did I
> last read this state** AND **whose sentence is this**.
>
> **SUPERSEDED — 12:35Z block below.**
>
> **SUBMISSION-RESEARCH REFRESH 2026-07-28 ~12:35Z — superseded by the block
> above.**
>
> **THE DAY'S WORK: the two Claude directory submissions, mapped from the
> owner's own screenshots and cross-referenced against Anthropic's published
> sources.** Everything durable; nothing lives only in chat.
>
> **PERMANENT RECORDS**: `.agent/reports/claude-directory-submission-form-inventory-2026-07-28.md`
> (all 20 screenshots read; both forms field-by-field; official-source
> cross-reference). Linear: **MCP-296** (form walkthrough), **MCP-298**
> (Anthropic briefing + a corrections comment answering six owner questions).
>
> **TICKETS MINTED TODAY**: MCP-300 (tool metadata — titles + remove
> duplicated prerequisite text + make title a REQUIRED type field),
> MCP-301 (public documentation, homed in Aakesh's MCP OKR project — a
> mirror in First Major Release is still OWED), MCP-302 (build the plugin),
> MCP-303 (reviewer access pack), MCP-304 (CIMD walk-through, owner-led),
> MCP-305 (per-tool response sizes), MCP-306 (listing content + slug).
> Earlier: MCP-292/293/294/295(Done)/296.
>
> **FIVE FINDINGS THAT CHANGED THE PLAN**:
>
> 1. **The slug is a ONE-WAY DOOR** and prefills
>    `oak-curriculum-app-internal-preview` from the name. Everything else on
>    the listing is editable after submission; the slug is not.
> 2. **Tool titles**: NOT 40 missing. The codegen path emits
>    `annotations.title`; the HAND-AUTHORED path
>    (`packages/sdks/oak-curriculum-sdk/src/mcp/**`) does not. Two paths, no
>    parity enforcement. Owner ruling: make title a required field.
> 3. **The `instructions` field IS already set** (`core-endpoints.ts:92-95`,
>    generated by `generateServerInstructions()`), and already says "For
>    optimal results, call these agent support tools at conversation start".
>    The `PREREQUISITE: You MUST…` text in tool DESCRIPTIONS is a duplicate.
>    Owner ruling: remove from descriptions, keep in instructions.
> 4. **Response sizes are ALREADY MEASURED** — `handlers.ts:215-221` logs
>    `'MCP tool result size'` per tool via `measureCallToolResult`. Query,
>    don't estimate.
> 5. **THE PLUGIN DOES NOT EXIST** — no `.claude-plugin`, no manifest, no
>    workspace. Its submission is blocked on the artefact, not paperwork.
>    Source is the PRIVATE `oaknational/oak-skills` (already carries
>    `.claude-plugin/marketplace.json` naming `oak-curriculum-toolkit`);
>    copying a subset into THIS public monorepo is what satisfies
>    "plugins must link a public GitHub repo".
>
> **CLERK / CIMD (verified first-hand, read-only, all three instances)**:
> Clerk HAS CIMD with default-deny admission controls, disabled everywhere.
> `oauth_jwt_access_tokens: false` everywhere (so the ADR-115 facade
> re-points with an env swap). Owner: **no Anthropic-held credentials**;
> CIMD is the option to pursue because nothing of ours is held externally.
> Open question only Anthropic can answer: does Claude-as-client publish a
> CIMD metadata document?
>
> **OWNER RULINGS TODAY**: submission is Friday 31 July; PostHog M0 boundary
> is MCP-237+MCP-238 ("events flowing safely, and @posthog/mcp in place");
> Clerk staged **dev-first**, owner performs all Clerk writes himself;
> **we will NOT list while invite-gated — production Clerk is the blocker**;
> comms is NOT our remit; **self-limits are gated on ASKING, never silent**;
> the monitoring-cost constraint was SITUATIONAL and is LIFTED.
>
> **FLEET**: Juniper holds Tendril (3dfd3b) live — PR #603 (dev guide),
> MCP-299 routed as follow-on. Raccoon/Schooner/Altair cold-paused with
> self-contained resume blocks on the stream. #602 (MCP-238) awaits a
> six-line deletion then merges, completing the M0 PostHog stack; #576
> closes without merging at that moment.
>
> **NOTHING OWED BY ME.** The MCP-301 mirror is **DISCHARGED**: **MCP-308**
> (public documentation, release-gate mirror) now sits in _MCP App: First
> Major Release_, related to MCP-301, and both descriptions cross-link.
> **MCP-301 is canonical for scope** — the mirror explicitly defers to it,
> so the pair cannot silently diverge.
>
> **ALSO MINTED / DONE AFTER 12:35Z, not in the ticket list above**:
>
> - **MCP-307** — canonical-host self-description. Investigation first:
>   `security-config.ts` already holds the two roles APART —
>   `ALLOWED_HOSTS` (CSV) + Vercel hostnames feed `allowedHosts` (accept-list,
>   DNS-rebinding + RFC 8707 validation), while `CANONICAL_HOST` (singular)
>   feeds `canonicalOrigin` (self-description only). **Both domains already
>   serve with no code change.** The genuine open question — self-description
>   is single-valued, so a client on alpha is told its resource is the www
>   address — is ticketed with three weighed options, NOT patched.
> - **CODEOWNERS**: `@mantagen` (Matt G) added alongside `@jimCresswell` on
>   both the default rule and the CODEOWNERS-protection rule — commit
>   `8aa5be06b`, pushed.
> - **Cloud-ops blocker** recorded as a comment on **MCP-172**, with the
>   ordering chain: Cloudflare route (`oaknational/Cloud-Config#551`) → then
>   `CANONICAL_HOST` on production Vercel → then conformance re-run.
>
> **PEER STATE at 13:01Z (captured off the ephemeral stream)**:
>
> - **Raccoon turns Nocturne — LIVE AGAIN as of 13:35Z**, executing the #602
>   six-line cure itself (claim `398ddef9`, intent `mcp-238-602-cure`). The
>   earlier line here — compacting, cure unstarted — is superseded; it was
>   true at 12:58Z and stopped being true at 13:35Z. Resume block
>   `a39bb998b` governs the lane.
>
>   **THE TRIGGER I HOLD**: when #602 merges, the M0 PostHog stack is
>   complete and **#576 closes without merging**. Verified live at 13:36Z:
>   #576 is OPEN and still a **draft** (untouched since 2026-07-26), #602
>   OPEN and ready. Trigger real, unfired. Closing #576 is an **owner-carded
>   check**, not an autonomous act — per the open-PRs ruling, drafts count
>   and each close is his call.
> - **Altair turns Infinity** amended its freeze record: **#570 gains one
>   resume step** — `types.ts` lines 237 + 242 still document the child exit
>   code as "never a verdict input", stale against the applied
>   operational-exit fix; re-true both TSDoc sites **in the same commit as
>   the fixes**. Worktree at wrap: ahead 112, 8 files modified, nothing
>   pushed. Its wrap record is in the napkin and a formation letter in
>   `.agent/experience/` — both **uncommitted on the primary**, explicitly
>   handed to my capture sweep.
> - **Juniper holds Tendril** live.
>
> **MERGE-WINDOW BLOCKER (Juniper, 12:45Z — capture from the ephemeral
> stream).** MCP-297 landed (PR #603, merge `5404a4aa2`, owner-merged), so
> main has moved and the coordination-branch merge window is open. Three
> items, all scope-fenced out of Juniper's lane and now MINE:
>
> 1. ~~The PRIMARY checkout holds an UNTRACKED
>    `docs/engineering/working-with-this-repo-for-devs.md`.~~ **RESOLVED —
>    and the record was STALE for hours.** The owner (13:20Z): "I think the
>    engineering doc should be deleted already." It was: the file did not
>    exist on disk. Nobody had probed it since the capture.
>
>    **THE MERGE IS DONE.** `f36fe2ade` (tree alignment) then `9d306273d`
>    (merge of `origin/main` at `4bcbdba15`), pushed under bot transport.
>    Coordination is level with main; working tree CLEAN.
>
>    **The second stale reading, worth more than the first.** The fifteen
>    "dirty" paths were carried in this record and broadcast to peers as
>    _peers' in-flight edits_ — Raccoon's held widget claim. Probed file by
>    file against `origin/main`: **all fifteen byte-identical.** They were
>    not work-in-progress at all; they were LANDED content (#597, #601,
>    #603) sitting in the working tree while this branch's HEAD lagged.
>    `git status` reporting "modified" is a statement about HEAD, never
>    about main — read as "someone is editing this" it manufactured a
>    peer-collision that did not exist, and it deterred the merge for hours.
>    Resolution was the ordinary one git names: commit them (zero new
>    content, verified), then merge.
> 2. **Latent lint drift on main's tip** — `pnpm fix` consolidates imports in
>    `apps/oak-curriculum-mcp-streamable-http/src/auth/public-resources.unit.test.ts`,
>    and the `lint:fix` output is itself prettier-non-compliant. Surfaced in
>    #603's description, deliberately not committed.
> 3. **Worktree `oak-open-curriculum-ecosystem-worktrees/mcp-297-devs-doc`**
>    carries one dirty regenerable file — NOT provably-clean, so it is left
>    for an authorised prune, not the standing provably-safe rule.
>
> **SUPERSEDED — 2026-07-27 blocks below retain merge/ruling detail.**
>
> **LATE-EVENING REFRESH 2026-07-27 ~20:00Z — superseded by the block above.**
>
> **TWENTY-ONE merges today.** Added since 19:00Z: #598 (MCP-234), #599
> (MCP-235), #600 (MCP-236) — three PostHog slices in ~60 minutes, all
> green on first CI run. Main at `b0a2f832a428`. MCP-63 stack now
> **230–236 landed; 237 next at NARROWED scope** (sink + integration test
> only), 238–244 unbuilt. #576 stays open (close condition still false).
>
> **FLEET: ONE live seat (mine).** Swallow stood down cleanly at ~19:53Z
> after SIX merges — claims closed, nothing uncommitted, two permanent
> records landed, letter at
> `.agent/experience/2026-07-27-swallow-guards-tailwind-what-the-map-does-not-know.md`.
> Raccoon last seen on PR #597 (MCP-290 widget disclaimer, settled by name,
> merge is THEIRS by executor-class — owner was mid render-review).
> Schooner silent since 17:13Z; MCP-281 and #570 carrier-less.
>
> **CUSTODY CATCH worth carrying**: Swallow reported both permanent records
> committed; both were UNTRACKED on disk. I took custody at `03eb9d9ef`
> minutes before they stood down. Same class as the orphan review's
> ADR-217 finding — custody is a state you CHECK, not a feeling.
>
> **THREE INSTANCES IN ONE SESSION of one failure class** (napkin, flagged
> as rule-graduation candidate): a tool artefact read as a fact about the
> world — my `head -12` becoming a coverage denominator, my wrap-blind grep
> manufacturing a content-loss finding, Swallow's non-matching grep reading
> as send-failure (duplicate closeout), plus the piped `$?` reporting
> tail's status. **Cure: verify against STATE, never against a filter's
> output.**
>
> **ESTATE STANDARD, new today**: settle reads derive required contexts
> from `/rules/branches/main` and check each BY NAME across BOTH
> `/commits/{sha}/check-runs` AND `/commits/{sha}/status` — Vercel is a
> required STATUS and publishes no check-run at all.
>
> **NEXT DIRECTOR ACTS**: (1) #582 base refresh is STALE (prepared at
> `7994cd782`, main has moved twice) — redo, C341 registry entry still the
> one red; (2) MCP-237 needs a seat; (3) #570 and MCP-281 need carriers;
> (4) MCP-16 and MCP-289 (ADR-217) remain seatless.
>
> **SUPERSEDED — 19:00Z evening block below; detail still useful.**
>
> **EVENING REFRESH 2026-07-27 ~19:00Z — superseded by the block above.**
>
> **OWNER AWAY** since ~17:07Z ("I will be away for a few hours, please
> continue"). Standing merge mandate in force; keep going until all
> team-doable work is complete, then pause.
>
> **THE DAY: SEVENTEEN merges.** Added since the 14:50Z block: #593, #574,
> #583, #594, #595 (MCP-254, `4d5219d17`), #596 (MCP-269, `a2317b3d2`).
> Main at `be2dd9ae6` (1.98.0). Production landing page LIVE and probed
> (three legs 200). Coordination branch merged main at `bcc425ac7` —
> the watcher old-flag dist trap is UNFLIPPED after rebuild; the sole
> conflict (the watcher rule) resolved to main's side after verifying
> wrap-insensitively that it retains every coordination-side lesson.
>
> **ORPHAN-RISK REVIEW COMPLETE** (owner-commissioned) — report committed
> at `.agent/reports/orphan-risk-review-2026-07-27.md`. Three findings
> that matter: (1) NO uncommitted work is stranded anywhere — all 24
> worktrees inspected, every retired-seat one clean, Smelter's feared
> phase-(b) work absorbed into #582's head; (2) seven seatless
> In-Progress lanes dispositioned — MCP-150/154/155/156 and MCP-159 moved
> to Backlog with restart conditions (every attached PR verified merged);
> (3) **ADR-217 never landed** — authored on the superseded landing branch,
> homed in unbuilt PR-4, MCP-128 closed Done, so the decision behind a live
> public surface exists only on an unmerged branch. Minted MCP-289;
> branch marked do-not-delete.
>
> **M0 IS NOW MECHANICALLY GATED**: MCP-106 `blockedBy` = MCP-172 +
> MCP-269(done) + MCP-143 + MCP-270 + MCP-63 + MCP-117. Submission moved
> to **Friday 31 July** at owner word; domain DECIDED
> `www.thenational.academy/mcp`; new M0 gate MCP-268 (comms sign-off).
>
> **CLERK: the estate's biggest open decision is now a button.** MCP-270
> (adopt Oak prod instance) + MCP-271 (DCR risk register) minted and
> written up; verified via `clerk` CLI that Oak prod needs exactly TWO
> additive changes (DCR on, own secret key) and that
> `oauth_jwt_access_tokens: false` on all three instances means the
> ADR-115 facade re-points with an env swap and no code change. The
> toggle is the owner's.
>
> **FLEET at 19:00Z**: Swallow (805902) LANE GO on MCP-234 — the next
> MCP-63 slice, the only M0 blocker with no seat, spec = Cutter's
> committed successor record. Raccoon (0f6caa) and Schooner (5492d7)
> BOTH WENT STALE ~18:46–18:50Z; liveness pings sent (ping-before-escalate,
> work-evidence cross-checked first, nothing lost either way). If they do
> not answer: #582's remainder (base refresh PREPARED at `7994cd782` in
> `.claude/worktrees/mcp-103-base-refresh`; one red — the C341 registry
> entry its own validator wants) and MCP-281 + #570 need carriers.
>
> **OWNER-RETURN CARD**: (1) MCP-63 scoping — does M0's "initial PostHog"
> mean the whole MCP-234–244 stack or a narrower deliverable? (carded on
> the ticket; material to Friday). (2) The Clerk DCR toggle + key mint.
> (3) `CANONICAL_HOST` on production Vercel — deliberately NOT set;
> correct order is apply Cloud-Config#551 → verify it serves → set the
> var → re-run conformance. (4) Seats: three lanes need carriers if the
> two stale seats are gone. (5) The eleven unattributed uncommitted
> widget/registry files on the primary — Swallow eliminated itself; if
> they are yours, they hold the pre-push format gate hostage (I pushed
> from a clean detached worktree rather than touch them).
>
> **SUPERSEDED BLOCK — 14:50Z compaction refresh, retained for detail
> still in force (rulings, platform facts); verify against live state.**
>
> **THE DAY'S SHAPE**: morning untangling → afternoon MERGE DRIVE.
> **FOURTEEN merges to main**: #578 #580 #584 #585 #586 #587 #588 #589
> #590 #592 #593 #574 #583 #594. React page train COMPLETE (#583 merge
> `d2f0ce477`, boot-throw cured by Schooner, serve-probe run
> independently pre-merge). Fleet gitleaks cure LANDED (#594,
> `98435630d`, 832→0) — seats pull main to clear local scan reds.
> Swallow's restricted-filter index PROMOTED at owner word (restricted
> findable 0/2,641, rollback intact).
>
> **THE MERGE DOCTRINE (owner, three same-day escalations, verbatim in
> memory `merge-drive-orchestration`)**: work has ZERO value until merged
> to main; PRs that can be safely merged MUST be; green+clean needs NO
> owner approval, and any failure it admits becomes IMMEDIATE
> cannot-recur work. Operational form practised 6× today: settled → bot
> REST merge sha-pinned + in-merge thread re-check; bot UN-DRAFTS
> green+clean drafts (pin makes it safe). Reliable token shape:
> mint + auth-probe(/installation/repositories) + act in ONE shell.
>
> **FLEET at 14:50Z**: Swallow (805902, MCP-153 legs; go-moment for live
> index routes through Director), Schooner (5492d7, MCP-254 lane-go,
> NEAR-COMPACTION — self-declared), Raccoon turns Nocturne (0f6caa,
> joined today, 3 merges already; NOW: #582 lane — assess Smelter's
> uncommitted 6-file worktree work against its evidence list, triage 2
> threads UCVfY/UCVf0, base-refresh via Director). RETIRED today:
> Peony (Copilot; exemplary handoff on the ARC channel file; work merged
> posthumously #593), Cutter+Smelter (codex credits; custody events
> f46a8a06/cc41b786 and 80757b82; farewell letters in
> .agent/experience/, committed this wrap), Dynamo (morning).
>
> **LIVE TASKS at compaction**: watcher arm 14 (b0z846hpt, OLD-flag dist
> — TRAP: coordination branch predates #587, so local dist speaks
> --max-events; after any main-merge + rebuild it flips to
> --max-events-per-drain — re-arm from `comms watch --help`, never
> memory). PRODUCTION PROBE WATCH (bwgjhc3cx) still pending the page
> deploy report — CHECK ITS OUTPUT FIRST post-compaction; the owner is
> waiting on production 200s.
>
> **OPEN PRs**: #582 (Raccoon: custody cure PUSHED at e18b6ec94,
> gate-green, BOTH threads resolved; NEXT ACT IS THE DIRECTOR'S —
> base-refresh call, .gitleaks.toml resolves by adopting MAIN wholesale,
> then settled-by-name → merge; Raccoon also compaction-prepping,
> claim 1aaae3e6 live through their boundary), #570
> (POOL: 7 adjudicated fixes, event 92af6f15, needs FRESH-context
> carrier), #576 (stays open per Cutter closeout until MCP-239..244
> successor set completes — those application successors are UNBUILT),
> #569 (coordination; merge main into coordination at next quiet
> window — also unflips the dist trap above).
>
> **OWNER-SIDE (Wednesday critical path, unchanged)**: MCP-172 execution
> legs (Cloudflare route, Clerk MCP-143, conformance re-run), MCP-117
> PostHog keys, MCP-202 operator probe.
>
> **TICKETS minted today**: 246(post-submit, blockedBy 106), 247, 248
> group (249/250/251/264 — Copilot parity, post-submit), 254(→Schooner),
> 255(High, heartbeat-claim coupling), 261, 262(High, serve-probe as
> required check — the #583 class killer), 267 (pathspec matcher).
> MCP-245 cancelled dup of 246. 227/188/232/233/128-train all Done.
>
> **The morning that reshaped the estate**: the owner ran an UNTANGLING
> session (~08:00–10:00Z) fixing the fuckups threatening Wednesday's
> submission. Landed as doctrine (commits a1c7e2081, 04b299d44,
> 6813798ab): the REVIEW-TRIAGE rule (pr-lifecycle §Phase 4, owner
> verbatim, seat-level: reject incorrect / address
> correct+relevant+proportionate / else ticket+tell-Director+CLOSE);
> §Loop Dynamics in concept-exploration (state-vs-dynamics, bidirectional
> doctrine-vs-mechanism class — SIX instances found 2026-07-27);
> proportionality skill (Dynamo-authored); ticket-management skill (the
> graph is authored, not endured); confident-seats-proceed-and-report
> rule (in-lane proceeds on recorded confidence; freeze-bound + merge
> execution still gate); design-work-for-small-prs rule (PERMANENT,
> owner bands: ~5 files normal / 10 acceptable / 20 a problem, decompose
> at DESIGN time); trigger-first amendments to bot-identity (fires at
> EVERY third-party write), never-use-git-to-remove-work (tree-state +
> command), worktree-hygiene (claim-open + first source edit); the
> principles evidence-rule scope now covers RULES and SKILLS.
>
> **Fleet at 10:20Z**: Dynamo CLOSED at owner word (mistake pattern:
> mechanism claims raced ahead of source; honest assumption LEDGER at
> closeout — verified/read-not-run/inferred/inherited/stale in the ARC
> channel rapid-comms/2026-07-27-doctrine-landing-…md; claims 5681b4f1
> (#570) + 385cf282 (#574) RETAINED for Director ROUTING, carriers
> needed — #570 has SEVEN read-not-run fixes adjudicated-unpushed at
> event 92af6f15, #574 has 2 unadjudicated threads). Schooner: LANE GO
> MCP-229 (comms-watch hardening: per-pass max-events, WATCHER EXIT
> lines, rule truing incl. x-stop-invisibility; claim 1784770c, single
> PR, merge on word). Smelter: ACTIVE on MCP-103 (c)/(d) per DIRECT
> owner rulings (one context-rich workspace; latest-main; small-story
> PRs; #582 rebases onto main + lineage repair; their watcher/heartbeat
> DELIBERATELY stopped at owner request — no peer-check fires).
> Swallow: MCP-226 (13-field gate bridge) → MCP-153 per owner
> re-sequenced chain; MCP-203 post-submission. Cutter: #576 draft by
> declared scope (transport proof + ADR-218 outstanding). Design lane
> SEATLESS (claim 68088465 retained, PR-4 pickup record
> handoffs/2026-07-27-schooner-mcp-128-pr4-pickup.md; PR-4 proceeds on
> ISLAND HYDRATION per MCP-220 adjudication, owner-override open).
>
> **THE REACT-PAGE TRAIN (owner priority, IN MOTION on the Director's
> arm)**: #578 MERGED 27e672209 (~10:10Z, bot REST, in-merge re-check;
> note the SHA-fabrication capture in napkin — carry FULL oids, never
> reconstruct). NEXT: #580 retargets to main automatically, full checks
> re-run, then the VERCEL PREVIEW PROBE gate (/, /oak-ds/styles.css,
> logo — all 200, posted as PR evidence) BEFORE its settled read → word
> → merge; then #583 retargets, FULL by-name suite fires first time →
> settled → word → merge → production deploy serves the page at
> curriculum-mcp-alpha.oaknational.dev (boot-throw makes green
> deploy = page-serves proof). PR-4..6 NOT needed for live.
>
> **Watcher truth (morning investigation, CLOSED)**: five death classes;
> budget exits are silent BY DESIGN (--max-events = lifetime EMITTED
> budget, no CLI default); owner x-stops are INVISIBLE in-session
> (calibrated — verify liveness after owner-active windows, vanished
> task = probably-owner); the contention wedge is cured (#579, drains
> ~1s at full corpus); MCP-229 carries the fixes. RE-ARM CEREMONY: check
> the MANDATORY PAIR (F-75 peer-liveness poll) — Dynamo's closing
> capture; this seat's 12 re-arms all violated it (napkin).
>
> **OWNER-SIDE QUEUE at 10:20Z**: (1) MCP-172 EXECUTION legs — domain
> SETTLED at `www.thenational.academy/mcp` (owner word ~09:15Z, verbatim
> on ticket): Cloudflare route/Worker, Clerk config intersection
> (MCP-143), conformance re-run against the new origin pre-submission.
> (2) MCP-117 PostHog key ceremony. (3) MCP-202 operator probe.
> (4) DISCHARGED 10:51Z: MCP-192 secrets-environment finding MINTED as
> MCP-245 at owner word ("Mint ticket now") — owner threat-model
> decision now lives on that ticket. (5) Carriers: owner answered
> "open 1–2 seats now"; recommended routing seat 1 → #583 boot-throw
> (NEW, owner-priority: page has NEVER served — both preview deploys
> 500 FUNCTION_INVOCATION_FAILED, zero runtime logs; Vercel checks are
> deploy-proof only, probe gate caught it), seat 2 → MCP-227 (now
> fully sharpened via Director ticket comment: block/permit table +
> fail-open hazard pin) then MCP-228; #570/#574 + orphans
> MCP-199/200/216/217/218 route as capacity frees. (6) DISCHARGED:
> bidirectional principles edit APPLIED at owner word 10:51Z.
> MCPJam creds tmp copy DELETED at wrap (custody discharged).
> (7) LIVE at compaction: fleet-wide LOCAL secrets:scan red — 807 false
> positives (token-anchor digests in Smelter's current-source-anchors.json,
> three #582 commits, cross-branch sweep); classified by Swallow 10:13Z,
> cure ROUTED to Smelter 10:15Z (allowlist-with-rationale or anchor
> re-encoding, their call); other seats' pushes may gate until cured —
> check Smelter's pickup ack on the stream at rehydrate.
> (8) DIRECTOR RULING TO RATIFY (10:35Z, event 3bbbb51f): Smelter's F-95
> live-watcher precondition vs the owner watcher-stop order collided at
> MCP-103's commit claim. Ruled: one-shot watcher pass scoped exactly to
> the claim window (open→commit→close, pass exits, no re-arm) — the stop
> order's substance holds (nothing persistent restarts) and F-95's purpose
> (claim-holder reachability) is met. Falsifier: if the stop order covers
> even bounded one-shot passes, the mechanism is dead and Smelter's
> commit windows wait for owner word.
>
> Older 2026-07-26 blocks below retain merge/bridge/ruling detail still
> in force (Codex connector bridge, settled definition, freeze list,
> platform facts). Verify against live state — sections decay.
>
> **The work directed**: the V1 release drive toward the initial submission
> (the M0 window; ALL dates and vendor timing live in Linear ONLY). Today's
> arc: the MCP-63 plan LANDED on main (PR #568, merge `ccd1c410f`);
> implementation is mid-pipeline and MID-SUCCESSION; the owner-reported
> widget bug (MCP-187) and the DCR redirect gap (MCP-188) are in flight;
> the MCPJam evidence trail (MCP-184) has its first attended runs banked.
>
> **Fleet at refresh (verify live via the mechanical check)**: TWO live
> seats. Dynamo spins Naphtha (claude-code, 2f5519) — lands PR #570 (MCP-189
> wrapper; round 1's 16 threads resolved in one adjudicated batch, checks
> re-running) and PR #572 (MCP-192 mint-scope, settled-shaped: 17/17 green,
> zero threads, security verdict in Aurora's 12:39Z handoff event, codex
> review triggered), then MCP-188 (owner word). Cutter hunts Lagoon (codex,
> 019f9e) — holds all seven MCP-63 claims after the completed owner-directed
> succession (13:27Z, cross-verified by the outgoing seat); the inherited
> final-wire blocker is CURED (test drives the real production composition;
> test-expert + code-expert both PASS; 130/130; slice accepted-uncommitted);
> lands slice-per-PR under the owner's small-PRs word; wake-path limitation
> self-cured via 10-minute polling. Swallow guards Tailwind (805902,
> claude-code/claude-fable-5) — owner-directed ~14:10Z on MCP-152/153
> (upstream API spec alignment + bulk data checks), team-start 14:23:23Z,
> directed pickup notice 14:23:45Z; ran the owner-priced exploration
> fleet under the 14:33Z exploratory-only direction. EXPLORATION COMPLETE
> 15:28Z: report at
> `.agent/reports/upstream-and-bulk-alignment-concept-exploration-2026-07-26.md`
> (commit 27aae5406). Headlines: MCP-152 is SHAPE-NOVELTY (first
> POST/requestBody/map-response, unmodelled by the generator; naive
> refresh mints an uncallable tool with readOnlyHint:true and an EXISTING
> green test would defend the defect — anti-guard class; five operations
> silently moved limit defaults/maxima); MCP-153's premise INVERTS (the
> committed bulk schema.json is read by no code and was never true of its
> own payload — required fields at 0/12,864 on the real 635MB corpus; a
> WS3-as-written check would reject 100% of real data); the
> restricted/rights concept is inexpressible in indexed documents
> (product call). Five owner-calls (P1–P5, incl. the doctrine re-point of
> verify-data-supports-shape-before-building, which currently directs
> sessions at the false artefact) are being presented to the owner
> DIRECTLY in-session by Swallow (owner present, invited); execution
> shape P6–P16 proposed (throwaway regen probe with three-bucket failure
> classification before any landing; anti-guard re-referent first).
> Phase 2 remains OWNER-GATED. RETIRED cleanly
> today: Skua weaves
> Wingspan (~13:45Z after landing #571 at owner word; MCP-183 re-routes via
> the Director, carrier = first implementer seat that frees), Kite seeks
> Crosswind (~13:28Z post-succession), Aurora turns Gravity (~12:44Z; its
> delegations are VOID — recurrences route to the Director). Seatless PRs
> land via the Director at settled (no monitor seat exists).
>
> **Board (5 open; #571 MERGED e928d5ebc, #568 MERGED ccd1c410f today)**:
> #565 RESTACK RATIFIED (owner card answer ~14:35Z 2026-07-26): the
> full-React conversion lands as a fresh stack of small focused PRs off
> current main, superseding #565; growing it in-lane is dead. Execution
> waits on the design-lane successor seat (owner-held); that seat's first
> task is authoring the fresh stack FROM the #565 branch content, and at
> value-transfer (fresh stack open and carrying the work) #565 closes and
> its branch deletes per the branch ruling — the branch stays until then
> ONLY as the source material for the restack, not as a frozen reference.
> #567 do-not-merge; discharges via the
> MCP-183 harvest then CLOSE + DELETE BRANCH (owner branch ruling). #569
> (coordination, mine, draft-by-design): CodeQL red DIAGNOSED 14:40Z,
> attribution REFINED 15:35Z (Cutter): the CodeQL workflow is GREEN; the
> red is the Advanced Security AGGREGATE — all 34 aggregate annotations
> (21 high) are design-capture alerts tracing to estate commit
> 6146669bd; the 2 research-script alerts are open separately, not on
> the aggregate; zero in product code either way; evidence comments on
> the PR (the 15:40Z one supersedes the 32+2 split). Sonar red ALSO
> diagnosed (Cutter readback 15:59Z, post-recovery): 1,668 unresolved PR
> issues, sampled page entirely under the same design-capture tree, all
> created 2026-07-25T19:50:39Z = the capture commit 6146669bd; nothing
> touches the MCP-63 report or agent docs. BOTH reds now share one
> source and the landing-gate card's evidence is COMPLETE; disposition (path-exclusion
> config vs per-alert dismissal vs prune-from-merge) is OWNER-CARDED AT
> THE LANDING GATE, not before. SonarCloud red: re-verify after the
> maintenance window clears. #570/#572 as
> per fleet above. Every open PR carries a live discharge path.
>
> **Director duties armed on triggers**: (1) AC-4b DISCHARGED 14:25Z
> 2026-07-26 — production deployed release tip 835b30465 (cut on top of
> merge e928d5ebc, which is why the predicted 68824ccd was superseded);
> served suffix abeec8bc = `sha256(deployed full SHA)[0..8]` recomputed
> locally and matching; resources/read returns the full widget HTML;
> MCPJam apps conformance 7/7 (baseline 3/7); MCP-187 closed Done with
> evidence comment. (1b) SONAR MAINTENANCE LIVE at the same boundary:
> SonarQube Cloud EU+US scheduled maintenance 12:00–16:00 UTC 2026-07-26,
> Automatic Analysis down; last project analysis 13:47:26Z; #570/#572
> settled-shaped and refused ONLY on the missing Sonar status; Dynamo
> directed (event fdf87187) to stop empty-commit re-fires and hold; a
> 5-min status-page recovery watch is armed — on SONAR-RECOVERED
> broadcast (which NAMES Cutter's PR1 alongside #570/#572 — three
> analyses expected in the recovery drain), Dynamo waits ~10 min for
> queued webhooks, then ONE re-fire per PR if needed, then merges at
> settled; overrun past ~16:30Z reassesses to the owner. Cricket run
> ~15:20Z (three perspective pairs, owner-directed): release-clock
> ON-TRACK convergent; teacher + practice lenses convergent on ONE
> drift — the watcher-failure loop absorbed by re-arms instead of a fix.
> The wedge is now DIAGNOSED (Dynamo, 15:41Z, measured): the drain is
> O(total-files) sequential reads amplified by fleet I/O contention
> (31x under a light four-job load; deadline needs ~700x from idle) —
> NOT new-event volume; three seats misread the denominator. Queue
> re-shaped cure-before-mitigation: recovery merges → Director word on
> #574 → INCREMENTAL-DRAIN cure ticket (Dynamo minting with full
> evidence trail) → MCP-185 after, as honest mitigation on independent
> merits (never recorded as wedge-cure); A/B instances + the
> wrong-denominator lesson captured in napkin; (2) MCPJam OAuth credentials file — now ALSO
> copied to `tmp/mcpjam-oauth-credentials.json` at the primary checkout
> root (0600, gitignored) as a Dynamo grant for the attended oauth leg,
> comms event 557ec43d with binding handling constraints; the Director
> DELETES that copy at expiry (original in session scratchpad, 0600)
> expires ~10:41Z 2026-07-27 — authed re-runs after that need a fresh
> owner-attended `oauth login`; (3) at MCP-183's landing, close #567 and
> delete its branch; MCP-183 itself awaits its first-freed carrier via the
> Director; (4) Copilot review is SELECTIVE, never ceremony (owner
> word 2026-07-26): request it only on a PR judged important or risky where
> the service did not run by itself; its absence is never a Director-side
> blocker (falsifier on record: #571 merged with the latest review on a
> prior tip). If a deliberate request is warranted: the generic reviewers
> endpoint silently no-ops for Copilot (200, unchanged set) — the dedicated
> request endpoint on the Director's MCP surface is the working path, and
> Bot reviewers are visible only via the GraphQL Bot fragment, not REST
> requested_reviewers.
>
> **MORNING QUEUE FOR THE OWNER (re-trued ~20:15Z 2026-07-26; both
> decision cards DISCHARGED same-evening)**: MCP-201 posture card
> ANSWERED ~19:07Z direct (Proceed Wednesday + MCP-204 urgent
> fast-follow; MCP-201 Done, contract fully discharged). MCP-103
> topology card ANSWERED ~20:12Z via Director card (ONE workspace with
> generated views; approval relayed to Smelter event d88392b0, phases
> (c)/(d) OPEN, M11 start-unblocked). REMAINING: (1) MCP-172 zone-owner
> engagement (external latency, gates submission — the time-sensitive
> one). (2) MCP-117 PostHog key ceremony (Cutter's live-proof
> approaches). (3) MCP-202 operator-run probe at M0-set confirmation.
> Also standing: MCP-190/191
> M1 homes; MCP-214/215 milestone home (Swallow proposed first post-M0,
> prose only); owner gh CLI re-auth; FYI ruled-with-rationale items —
> Skipper's 56b91576f grandfather ruling (override open until the #578
> word fires); the three-seat identity failure-mode captures with the
> trigger-first doctrine-touch candidate; MCP-220's island-hydration
> adjudication (measured: 42KB props = +70% document for one toggle;
> island recommended and PROCEEDING as PR-4's working shape — override
> open until PR-4's settled read).
>
> **NIGHT LEDGER (owner-away window, ~19:00–22:00Z)**: #581 MERGED
> 79bfe9dcc (MCP-152 Done — upstream 0.7.0 adopted, usage-licence family
> deferred behind ticketed tripwires; merge word + in-merge guards);
> MCP-203 routed to Swallow (holds its whole evidence base). MCP-103:
> phases (c)/(d) five-story sequence ACKed with three riders
> (served-bytes-unchanged as per-PR merge gate; architecture pass
> pre-open on PR2's ADR-041 amendment; bridge mechanics); PR1 open as
> #582, two review rounds adjudicated (projection-not-second-registry,
> authority/custody axes split), settling. Design stack: #583 open
> (PR-3, seven-Opus round, turbo env-declaration cache defect + 320px
> reflow cured pre-open); MCP-220..225 minted from its merge-and-ticket
> dispositions; F-116 third instance recorded on MCP-186 with
> folk-practice escalation. #576 draft stands by Cutter's explicit
> scope-incomplete declaration (transport proof + ADR-218 outstanding).
> Review-owed framing corrected at Smelter's seat before it set.
>
> **Platform fact + standing bridge (2026-07-26 16:44Z)**: the Codex
> GitHub connector refuses merge actions without DIRECT in-session owner
> authorisation — a comms-recovered Director grant does not satisfy its
> safety boundary (first instance: #575, Cutter, 16:40Z). Standing
> bridge: a Codex-seat lane at genuinely-settled routes the mechanical
> merge key-turn to the Director (bot REST path, exact-head pinned);
> settled-judgment and lane credit stay with the seat. Also: the
> Director's gh CLI token went invalid ~16:34Z — owner re-auth suggested;
> unauthenticated public-API reads bridge board monitoring; the bot
> mint-token path is unaffected (it authored the #575 merge).
>
> **Live rulings in force**: browser sessions for PostHog EU project 221775
> and the Vercel project poc-oak-open-curriculum-mcp are owner-provisioned
> for the DIRECTOR SEAT ONLY — no other agent, no other project on either
> platform (live services elsewhere); branch work is NOT preserved — merged
> work is (valuable → merge it, else delete; frozen-reference is not a
> disposition); submission-surface freeze (served surface / auth path /
> landing page land through the Director); executor class rule (a PR with a
> live implementer seat lands by that seat; freeze-bound surfaces take
> Director word whoever executes); settled = ruleset-grounded (checks green
> plus code-scanning/quality, every thread resolved; NO approving review —
> required_approving_review_count is 0 everywhere and bot reviewers only
> COMMENT; the copilot_code_review leg is satisfied by review-present state
> and is NOT per-tip — the server adjudicates it, never the Director);
> sensitivity split (no dates/vendor timing in
> repo); dependency versions FLEXIBLE, Oak behavioural/privacy contracts
> FIXED; milestones propose-and-agree, work never dangles; PRs stay SMALL
> and focused (owner word 2026-07-26: convergence to zero feedback is the
> outcome smallness buys; the #571 arc proved per-tip re-review makes size
> anti-convergent); review comments are ASSESSED, never chased (owner word
> 2026-07-26: correctness AND relevance; fix / reject / merge-and-ticket —
> merge-and-ticket is a completion for correct-but-wrong-context findings;
> a reply is optional, the assessment is not).
>
> **Owner-held at refresh**: MCP-172 canonical-domain zone-owner
> engagement (URGENT, unstarted, EXTERNAL LATENCY, gates the submission —
> the listing carries the endpoint; surfaced to the owner at the 15:0xZ
> survey; was MISSING from this list before that survey — inherited blind
> spot, now cured). The design-lane seat SUCCEEDED cleanly 20:22–20:24Z:
> Skipper tracks Abyss retired at owner word (four-section record at
> handoffs/2026-07-26-skipper-mcp-128-restack-full-handoff.md; stack
> PRs #578 + #580 open and green, #580 carrying the preview-probe merge
> gate; PR-3 ~80% frozen uncommitted-by-design, gates-before-commit);
> Schooner binds Trench (5492d7, claude/claude-fable-5) ADOPTED claim
> 68088465 in place from registered standby, record read end-to-end, own
> monitors armed on the drain-cure dist, continuing PR-3 from the
> record's REMAINING list. Original seating 18:19Z: Skipper
> (4144b4, claude/claude-fable-5), claim 68088465 adopted from Lavender,
> owner-approved six-PR linear restack plan (three review passes, 45
> findings adjudicated): PR-1 DS source → PR-2 serve-DS (copy-before-boot
> exit criterion) → PR-3 React page baked at build (CSP font cure) →
> PR-4 hydration+ThemeControl+ADR-217 → PR-5 appearance baselines
> (Playwright identity protocol) → PR-6 theme-control guards; freeze
> handshake confirmed two-way (event 9bcd3e65); #565 closes with the
> full 36-thread disposition table at value-transfer on Director word;
> thread-34 ticket home routes to Director with that round report.
> Smelter rides Temper (Codex) — owner-named ~18:55Z 2026-07-26 onto the
> MCP-103 lane (model-behaviour content workspace, M7, release blocker;
> brief delivered via owner: phase (b) workspace-shape proposal first,
> carded to owner via Director; ask-the-Director wiring explicit).
> Awaiting team-start. PLATFORM NOTE: Codex seat — the connector
> merge-block applies (first instance #575); at genuinely-settled their
> lane's merge key-turns route through the Director-proxy bridge, with
> settled-judgment and lane credit staying at the seat;
> a seat for MCP-143 stage 1 (production sign-in guard cycles — Urgent,
> M4, seatless, gate-independent, start-immediately; carded to the owner
> at the survey); the M2 guidance-pipeline date tension (target 30 Jul,
> 0%, MCP-102 unassigned — re-date or seat, propose-and-agree);
> the MCP-117 PostHog key ceremony (needed only for the MCP-63 live-proof
> acceptance; env contract documented in the app's .env.example); the
> workflows App grant enactment landed as PR #572 (in flight); milestone
> homes for MCP-190/191 (propose-and-agree); the MCP-195 settings half
> (Actions environments). The codegen-refresh seat is FILLED by owner word
> ~14:10Z 2026-07-26: Swallow guards Tailwind (805902) on MCP-152/153,
> registered 14:23Z with first-hand grounding (spec delta ADDITIVE only:
> two check-restricted endpoints + one description change); two decision
> moments pre-flagged to route to the Director — MCP-152 check-restricted
> discoverability (product call, will arrive carded with evidence) and the
> MCP-153 index-regen go-moment. Eventual-successor naming on record:
> Cutter for Kite (active now).
>
> **Standing duties that transfer**: persistent all-channels watcher
> (Monitor, --exclude-tag heartbeat, --step-timeout-ms 120000; re-arm on
> fail-loud death, sweep the gap via a seen-file COPY, peer-liveness via
> the claims freshness check); dual-surface heartbeat loop (240s); daily
> release-burndown vs Linear; comms sends --body-file always; absolute
> paths; exit codes in-band with output captured to a file (never piped,
> never muted — both failure modes hit this seat today); owner-channel
> answer-first; prose with ticket numbers for the owner; referent-narrowing
> discipline (patterns/referent-narrowing.md): name what each signal
> reports on, one independent witness per load-bearing claim.
>
> **Succession**: PDR-063/064 unchanged (two moments; the readiness gate
> above with the pasted mechanical liveness check). This section is
> refreshed by the sitting Director at every handoff or continuity boundary.
>
> - **PRIORITY FRAME (owner word, 2026-07-31 ~13:20Z, standing until owner revision):** P1 dedicated consolidation (Ingot's run to main — directly useful to Matt's submission work); P2 Codex tooling (Plover Sol Ultra + Dolphin Luna Max; Dolphin's platform declaration is the starting corpus); P3 plan/graph DEFERRED to finish-in-flight only (Badger's story 2 to merge, then re-route; four sketch plans + story-3 candidates HOLD as sketches, no ratification ask). DESIGN LANE opens at P1+P2 finish. Importance and contention precedence, never speed.
> - **Dolphin calibration (owner word, 2026-07-31 ~13:30Z):** Dolphin weaves Marsh is a Luna instance — value is SPEED over accuracy; errors are expected, not exceptional. Every Dolphin claim gets the verify leg before absorption or transmission (the first-bounce commit-stat claim was verified first-hand and held; keep that standard). The Director holds the standing eye; the fleet-wide critical-assessment contract already broadcast is the operational protection.
> - **SEVEN SEEDS from Ingot's P3 machine-local sweep (2026-07-31 ~13:47Z; #1 discharged, six HELD):** (1) DISCHARGED — public-docs-by-publish-date is owned: MCP-309 gates section + MCP-301/MCP-308, verified first-hand on Linear. (2) Deadline/default machinery for non-retirement processing gaps — doctrine seed, next doctrine window. (3) §7(b) composed-pairs gate small-PR obligation (hub rendered-pairs) — DESIGN-LANE OPENING CHECKLIST. (4) Declarative-state grammar (phase model/seat states/allowlist live-dormant), thrice-parked — concept-layer input at ledger pickup. (5) Bonfire's five-item doctrine-fold list — in their closeout record, pointer held. (6) PRESERVATION-README exact held-out staging path — DESIGN-LANE OPENING CHECKLIST (design lane knows the path). (7) Pause-word semantics (session-local pause builds an unrecorded permission wall) — doctrine seed for the pause vocabulary.
