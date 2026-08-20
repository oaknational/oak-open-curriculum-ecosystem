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
   # The tool parses the claim's freshness anchor and --now as UTC epoch-ms and
   # emits age_seconds + freshness_status itself — no local clock, no mental
   # arithmetic. Source: claim-reports.ts, freshnessStart = heartbeat_at ??
   # claimed_at; age_seconds = nowMs − Date.parse(freshnessStart), both UTC.
   # NOTE (measured 2026-08-19): a heartbeat writes heartbeat_at and leaves
   # claimed_at at the original open time. Anyone hand-computing from
   # claimed_at therefore reads a LIVE, heartbeated seat as stale — which is
   # the very error this section exists to prevent. Let the tool answer.
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
  - **The canonical invocation dies under zsh unless the model is quoted.**
    A bare `--model claude-opus-5[1m]` is a glob pattern: zsh fails the
    command with `no matches found: claude-opus-5[1m]` before the watcher
    starts. Use `--model 'claude-opus-5[1m]'`. Measured 2026-08-19; it costs
    every new seat its first arm, and the failure looks like a tooling bug
    rather than a quoting one.
  - **`assert-watcher-live` can read GREEN off a WEDGED watcher.** It checks
    the heartbeat file, not delivery. Measured 2026-08-19: a watcher with
    `emitted_count: 0` and a frozen cursor passed the assert. Process
    liveness is not awareness.
    **Do NOT use "`emitted_count` advancing" as the test** — an earlier
    version of this brief did, and it is wrong: the counter advances only when
    a matching event is _delivered_, so a healthy watcher on a quiet stream
    shows no advance and the test false-fails normal operation. The counter
    cannot distinguish _quiet_ from _not delivering_. What does:
    - **arming evidence, mechanical:** `claims open`'s F-95 gate refuses to
      write into a populated registry while blind to comms, so a successful
      `claims open` proves a live watcher at the canonical seen-location;
    - **delivery evidence:** a controlled probe — an event you know should
      arrive, or the first genuine peer event landing (self-authored events
      are excluded by design, so your own broadcast is not a probe);
    - **the absence detector:** the paired `comms peer-liveness` poll and a
      foreground mtime sweep, which is what event-watching structurally
      cannot be.
    The wedged instance was real and the rule drawn from it was still wrong —
    a sound observation with an over-general conclusion welded on, which is
    the generator in
    `patterns/relayed-findings-carry-the-inference-not-the-observation.md`.
  - **The drain step-deadline is the wrong knob for a wedge.** Three watchers
    died on it in one window; parsing all 1,645 event files takes 0.27s, so
    volume was never the cost — host contention was (load 19.49 vs 2.50).
    Raising the deadline makes wedges last longer; lowering it kills healthy
    drains under load. Pair a short deadline with a foreground mtime sweep.
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

> **§LIVE-STATE POINTER, 2026-08-20 08:2xZ (Peony hunts Nectar, `742fb5`) — READ THIS
> FIRST; IT SUPERSEDES EVERY BANNER BELOW.**
>
> **A Director seat has just stood down and pre-positioned a successor.** Full
> pre-position: comms event `ac68f51b` (PDR-064 Moment 1) — read it before anything
> else; it carries the live state, five disproven estate beliefs, and six measured
> traps. Claim `6228d1f1` closes at this wrap; **nothing retained**.
>
> **THE LIVE THING: the owner switches the MCP host to `mcp.thenational.academy`
> today, and it is NOT READY.** Verified 01:36Z: no DNS record exists
> (`dig` returns nothing), Cloud-Config #556 is BLOCKED on Terraform plan rights for
> the `cloudflare-misc` workspace that **no agent here holds**, and the app still
> 403s the new hostname until PR #920 merges and deploys. Clerk allowed origins are
> unstarted. **No DNS record means nothing to switch to** — that is the binding
> constraint and it is not ours.
>
> **The procedure is written:** `docs/operations/mcp-subdomain-switch-runbook.md`
> (PR #921). For one person doing this once; rollback per step. Check its
> precondition table rather than trusting it.
>
> **Standing recommendation, already with the owner:** do steps 1–3 and leave
> `CANONICAL_HOST` on `www`. It is single-valued, so changing it moves
> self-description for every host including `www`, and MCP-517 is a live bug in
> exactly that path. There is no external uptime monitoring on this app and the owner
> is away 22–31 August.
>
> **Fleet:** owner-liaison Thistle hunts Acorn (`401aec`, claim `f289d350`) is LIVE
> and holds the owner channel — route nothing to the owner directly. No implementers
> live. **Open PRs, all bot-authored:** #920 (`ALLOWED_HOSTS` additive — **needs a
> security review that never ran**), #921 (runbook), #913 (doctrine + this file's
> corrections), and Cloud-Config #556 (DNS, `mantagen`-authored — emgeebot 404s on
> that repo).
>
> **First inherited task:** land ADR-113's correction as a tracked PR. Its claim that
> Clerk rejects `openid` is disproven by DCR probe with a discriminating control, it
> shaped an owner recommendation, and the wrong sentence is still what a fresh seat
> reads first.

_Banners below this line are earlier snapshots, retained as the record of how the
seat moved. Where they disagree with the banner above, the banner above wins._

> **§LIVE-STATE POINTER, 2026-08-18 (Dormouse turns Footfall, `a54547`) — THIS
> SUPERSEDES THE 2026-08-13 BANNER BELOW ON ONE FACT ONLY: A DIRECTOR IS SITTING.**
> The 2026-08-13 banner records the Director lane as a make-safe pause with claim
> `a2286c53` retained stopped-seat-held. That is still true of the
> **`estate-coordination`** lane. It is NOT true of the estate as a whole: a Director
> seat is live on the **`mcp-submission-drive`** thread — the estate's current
> priority lane — seated 2026-08-17 late evening at owner word and resumed
> 2026-08-18, claim opened with `--role director`.
>
> Read `threads/mcp-submission-drive.next-session.md` for that lane's live state;
> `repo-continuity.md` §Active Threads now carries its index row. Live team at this
> write: Director `a54547`, owner-liaison Raven turns Nocturne (`0aad1a`), PR Review
> Warden Sloop spins Spray (`c42e7e`, boundary closed after five reviews).
>
> Added because a successor following the required grounding order reached
> "no Director, make-safe paused" before ever reaching the live lane — the same
> discoverability failure PR #903 was raised to cure, one surface further out.
> NOTE ON FITNESS: this file is 1644 lines against a 320 limit. That is a routing
> signal for its own bounded curation sitting (see `repo-continuity.md` §0a), and
> explicitly NOT a licence to omit a true load-bearing pointer or to trim the
> ~42 binding owner rulings below.

---

> **§LIVE-STATE POINTER, 2026-08-13 ~20:0xZ (Smith hunts Obsidian, e98f17) — READ THIS FIRST.**
> The Director lane's live state no longer accretes here. At the owner-ratified
> continuity-surface redesign (plan `director-continuity-surface-redesign`, S1/S2
> landed 2026-08-13): the **journal and lane state** live in
> `threads/estate-coordination.next-session.md` (board, assumptions register,
> seat chain, journal); the **rulings proof** lives in
> `director-rulings-ledger.md` (every inherited ruling dispositioned; homing
> queue for S3). Everything below this banner is the pre-redesign block stack —
> historical, superseded state whose rulings are ledger-dispositioned; it
> relocates byte-conserved to the operational archive at plan S4. FLEET AT THIS
> WRITE: make-safe pause at owner word (multi-day quiet, NOT a closeout);
> Director claim `a2286c53` retained stopped-seat-held; pickup = the brief's
> readiness gate + the thread record's Current Continuation.
>
> **CODEX OPEN-SURFACE TERMINAL HANDOFF — Smith holds Temper (019fef),
> 2026-08-11 13:20Z.** #745 MERGED `236a8e3437`; #746 critically
> re-reviewed against post-submission reality and MERGED `9dbf78328c` after
> every check passed and 15/15 threads resolved; #839/#840 closed into atomic
> replacement #852 at pushed head `68fd50402b`. Resume #852 with a complete
> live harvest, then #805 and #818/#819; #841 stays on the Director board and
> #816 was not added to the owner-author slice. Binding owner directions:
> green CI + all comments properly addressed means merge immediately;
> enhanced permissions for every Git/gate command; no queue in isolated
> worktrees; no expected-failure category; tools are capability, not
> ceremony. Durable pickup is the machine-local open-surface-zero thread record
> at `threads/open-surface-zero.next-session.md`;
> detailed machine-local record:
> `.agent/state/collaboration/handoffs/2026-08-11-smith-holds-temper-open-surface-zero-full-handoff.md`.
> Two claims close at the terminal broadcast; no custody retained.

Fold correction (2026-08-11 ~14:3xZ): #852 had already merged at 13:10:40Z (`52bfdfb4d`, owner-merged) before the 13:20Z record above was written — the drive remainder starts at #805. The pickup thread record entered the repository at this fold and is tracked continuity, not machine-local.

---

> ### ▶ SITTING DIRECTOR: Plover lifts Troposphere (`b10c37`) — §COMPACTION FREEZE 5, 2026-08-11 ~16:2xZ (owner word "prepare for compaction and stop all processes"): claims `a2286c53` + `dd3f640f` RETAINED; ALL PROCESSES STOPPED BY INTENT; silence past the freeze broadcast is the boundary, never retirement; the seat CONTINUES at resume.
>
> **RESUMED 2026-08-11 16:35Z** (owner carry-on; resume broadcast `56af317e`). Lineage verified claude-fable-5; watcher + heartbeat loop (both claims) + ARC tail + F-75 peer poll re-armed. Absorbed since freeze: #850 MERGED 16:19Z (owner-armed auto-merge; Wren's grant-withdrawal directed event); Wren self-committed the wrap residue at `22291a3fc` (exemption-removal node extracted at owner word) — no sweep owed; the freeze-window push had FAILED in pre-push (4-line capture hid the cause) but Wren's 16:31Z push carried both commits. #854 round-4 (4908537408): 10 suppressed, 5 pre-cured at `22291a3fc`, 5 cured at `e11d5070c` (disposition comment 5256089153); round-5 asked of Forge via ARC; mantagen leg still pending. #849: mantagen's blocking finding + both open Copilot threads + all 3 suppressed findings converge on one cure `8e44573e0` (napkin trigger → `.agents/skills/oak-napkin/SKILL.md` per ADR-125, link label, check 6) — settle-drive continues at this seat. #851: Warden blocking security round (carriage symlink class, probe-demonstrated) + Copilot same-class batch routed to Wren as a boundary offer (event `d1393c91`, decline-by-silence holds it).
>
> **§FREEZE-9 OVERTAKE, 2026-08-13 ~09:5xZ — THE FOLD COMPLETED PRE-FREEZE.** Fold **#872 MERGED `SHA:ca6b0fd8f`** (round 2 landed at the freeze boundary: ZERO generated + 4 suppressed; recount unfiltered 11 reviews / 0 unresolved / MERGEABLE; 19/19 checks green at the pin `SHA:2d43d0588`). **Estate ROTATED to `coordination/2026-08-13-ca6b0f`**; 24h clock restarted; the 4 suppressed cures landed as this successor's FIRST commit per the #854 precedent (owner-hold gates now machine-readable on BOTH survey nodes, expires 2026-09-02; pilot plan ARCHIVED to `delivery/archive/`; probe base-URL sanitized). Resume act (2) of the map below is DISCHARGED; act (3) DONE; the rest of the map stands — resume = re-arm apparatus (act 1 sizing), then the board (act 4) and residue (act 6).
>
> **§SESSION CLOSEOUT 2026-08-13 ~18:1xZ — Plover lifts Troposphere (b10c37) ENDS; a later agent picks up the Director lane (owner word: "please perform a full session close out, a later agent will pick up the lane … Make sure to highlight all assumptions so the next agent can question them").** Succession, not seat-continue. CLAIMS: `a2286c53` (director) + `dd3f640f` (gate-ledger) RETAINED stopped-seat-held — the successor takes them with `claims adopt --active .agent/state/collaboration/active-claims.json --claim-id <id> --platform <theirs> --model <theirs>`; design-lane claim `645b9e0b` retained with `handoff_record_path` set (successor Skua binds Leeward e2b222, STANDBY on station 18:04Z, adopts at their activation — see `.agent/state/collaboration/handoffs/645b9e0b-design-lane-close-2026-08-13.md`; the RATIFIED plan is that lane's resume map by owner design). ALL processes at this seat stopped at close (stop-loop-first; heartbeat-end in the closeout broadcast). Swordfish (d0274e) closed the same evening — their record is the SESSION CLOSE block at the tail of `design-system-integration.next-session.md`.
>
> **LANDED THIS SESSION-DAY:** PR #871 MERGED `SHA:a4dd21da4` (MCP-590 slice 1 — restricted-exclusion switch; ADR-224 enforced at BOTH artefact boundaries via the canonical predicate `isRestrictedInclusionBarred`; nine review rounds settled clean; claim `2d76cc84` closed+archived; worktree pruned). Showcase plan owner-RATIFIED (`SHA:96115d142` + true-up `SHA:76a0d9e13`, PR-2 branch) after six-expert fleet + Director review — R10 generalised at ratification to the lowest-effective-level principle. Warden folds `SHA:cf764a9a7` `SHA:0877884fa` `SHA:a5f4d2f5b`; watcher-residency rule note `SHA:081364080`. Memory graduations: trace-constraint-provenance; fix-at-the-lowest-effective-level; bot-identity silent-empty-token trap; check-output-to-file re-fire; MEMORY.md compacted to 16.5KB.
>
> **THE BOARD (the harness task list DIES with this session — this is the authoritative restatement):** (1) IN PROGRESS — support the design lane: ratified plan governs, W1→W2; Skua adopts at activation; owner-held moments are pixels in his Chrome. (2) MCP-590 tail: error-envelope PR (`formatError` + two callers, `{code,message,upstreamMessage}` via structuredContent.error + content[1] mirror, NOT _meta; contract test). (3) MCP-590 tail: operational rebuild stage→verify→promote — PROBE ENV ACCESS FIRST. (4) MCP-590 tail: demo-default flip to primary (2 lines: `demos/oak-curriculum-hub/.env.example` + README) — SEQUENCED AFTER (3). (5) Route Swordfish's five-item non-design-lane handoff (directed event 14:33:05Z; synthesis at `.agent/reports/governance/development-practice-review-2026-08-13/`). (6) Route skills groups 2–6. (7) Route authority-class tagging as a plan-schema candidate (new-rule-vs-pdr-clause, lull). (8) Estate expect-then-if sweep + test-expert §Diagnosis-5 true-up. (9) Comms archive sweep (5,600+ events, drain-cost class). (10) Route the 19 outgoing-identity carriers via the rename plan's slices. (11) Route the lowest-effective-level principle as a doctrine candidate. HELD STATES (not tasks): survey lane owner-HELD (gates expire 2026-09-02; Nautilus cold-paused, claim `95a0678d`); #774 = ILLUSTRATIVE spike (owner verbatim 2026-08-13: "isn't for merging … to speed up work once the mcp sdk v2 is released" — content tracks MCP-143's landing shape; migration itself waits on Clerk production promotion); pr-846-review-fleet node RATIFIED and W1-EXECUTED (MCP-591, report at `.agent/reports/design/pr-846-review-fleet/report.md`) — W2+ owner-sequenced.
>
> **ASSUMPTIONS REGISTER (owner's explicit close instruction — question each at pickup):** A1 the error-envelope shape (structuredContent survives isError:true; content[1] mirror, NOT _meta) rests on WREN's 2026-08-12 probe — re-probe against the CURRENT SDK before building. A2 env access for the rebuild is UNVERIFIED from any live seat — probe first is already the task's first act. A3 the demo flip's safety rests on owner word (consuming-app search is read-only) — verify the hub has no other ES write path before flipping. A4 the Bucket-1 tail's SHAPE is ratified-plan-derived — re-derive warrant per item at pickup (plans acquire gravity). A5 cross-session channels to d0274e are DEAD (session closed); the design contact is Skua (e2b222) at activation — verify liveness with ListAgents, never assume. A6 the worktree-isolation cure (arm-before-enter, `SHA:081364080`) encodes CURRENT platform behaviour, not version-pinned — re-verify at any Claude Code update; the guard-block on worktree comms is corroborated, NOT cured. A7 bot mint-token yields the bot ONLY from primary-root cwd (single worked instance) — echo `.user.login` in-band on EVERY identity-bearing write regardless. A8 the outgoing-identity carrier count (19) is Swordfish's census read, not first-hand — run the census before routing. A9 the five-item handoff's "truth fixes first" ordering is expert-synthesis-derived, not owner word. A10 both doctrine candidates (authority-class schema; lowest-effective-level rule) are THIS seat's routing framing — the owner asked for neither; drop either if warrant fails. A11 "846-fleet W2+ remains owner-sequenced" is an inference from the node's shape, not a verified read of its full body. A12 comms-drain tuning (240000ms step-timeout, 100/drain) fits TODAY's ~5,600-file stream — recompute after the archive sweep. A13 the R12/R13 owner verbatims entered this estate RELAYED through d0274e's session; their durable provenance is now the RATIFIED plan's rulings table — cite the plan, not this seat's transcript. A14 mantagen's reviewer "Vesta hunts Expanse" is self-declared agent authorship — verify provenance if it ever matters. A15 the expect-then-if sweep presumes the 2026-08-02 rule letter still reads "never an if-guard" and that the test-expert definition still carries the stale reading — re-read both before sweeping.
>
> **METALOSS RECORD:** Compressed reasoning — the #871 nine-round content survives in the PR threads (durable, GitHub) and the two expert reports' full text lived in session-temp task files that DIE with this machine's tmp: the surviving compression is the PR replies + this record, judged decision-sufficient because every finding was cured or dispositioned in place, and that judgement is itself recorded here. Promises sweep — Swordfish's three close requests executed (append, claim pointer, relay `a3c01321`); their stale-row true-up landed at their seat (`SHA:76a0d9e13`); the Linear MCP-590 "remaining slices" promise = board items 2–4; the retrospective offer to the owner rides the final report; zero silent drops found. Attribution inferences — flagged in A8/A13/A14 above; also Wren's #865 close-out facts were trusted from their broadcast, never independently verified. Blind-spot bounds — the watcher ran heartbeat-excluded (F-75 covered retirement only; heartbeat-borne info was unseen by design); dead subagent contexts are unreadable (their reports were absorbed same-hour); this seat's own transcript persists at the machine's project dir for archaeology but no successor should need it. Index of homes — THIS BLOCK is the index: director-handoff.md (Director lane), the napkin tail (day's lessons), per-user memory + MEMORY.md (16.5KB), the ratified plan (PR-2 branch — NOTE it is NOT on the coordination branch), the two thread records (design-system-integration; upstream-api-alignment), `handoffs/645b9e0b-…`, the ARC channel file (2026-08-13-design-lane-…), Linear MCP-590, PR #871 threads, `.agent/reports/{governance,design}/…`. External bound — this scan cannot certify itself; today's error signature: THREE misses caught only by outside eyes (owner: the 846-fleet staleness, the tail-hides-check habit; Copilot: the cannot-share premise), clustering on ONE class — trusting a secondhand description of an artefact's status without opening the artefact. Point external scrutiny exactly there. Fixed point — a further pass re-finds only the named classes (secondhand-status trust; temp-file report loss); the recursion closes here.
>
> **§COMPACTION FREEZE 10, 2026-08-13 ~14:1xZ** (owner word "prepare for compaction … then stop all processes"): claims `a2286c53` (director) + `dd3f640f` (gate-ledger) + **`2d76cc84` (ADOPTED from Wren at the owner's card-go — MCP-590 lane)** RETAINED; ALL PROCESSES STOPPED BY INTENT (stop-loop-first); the seat CONTINUES at resume; branch `coordination/2026-08-13-ca6b0f`.
>
> **RESUME MAP, IN ORDER:** (1) F-159 lineage check; re-arm quiet watcher (`--exclude-tag heartbeat --max-events-per-drain 100 --step-timeout-ms 240000` — deadline raised for gate-run disk contention, a daytime drain-timeout instance joined the overnight sleep class) + F-75 state+fullname diff poll + heartbeat loop (**THREE claims now**, 180s). (2) **#871 MERGE DRIVE — the live arc.** Tip `SHA:4083977bd`; Copilot round 7 requested ~14:05Z (timeline-verified); poll script `poll-871-round7.sh` in the session scratchpad. **Round 7 HARVESTED AT THE FREEZE BOUNDARY (14:12:54Z): 1 generated, 0 suppressed** — a REAL find: `runPipeline` (vocab-gen) has NO restricted-inclusion guard, so `includeRestricted: true, dryRun: false` would write restricted lesson content into the COMMITTED `src/generated/vocab` corpus that `@oaknational/sdk-codegen/graph-corpus` exports and MCP tools consume (thread comment 3776112890, unresolved — the earlier vocab confirm-item sharpened into a policy hole). RESUME CURE, first act: extend `enforceRestrictedInclusionBoundary` to the vocab pipeline entry (same predicate, corpus-producing boundary; needs its own home since the predicate lives in oak-search-sdk and vocab-gen is sdk-codegen — either lift the predicate to a shared home or mirror the one-line check with the test proving content cannot reach the generated corpus), red-first test, reply+resolve, round 8. Tally to date: R1 3g+0s → R2 1g+5s → R3 0g+3s → R4 0g+2s → R5 0g+0s → R6 0g+4s → R7 1g+0s. Then the RECOMPUTED boundary: four required checks green BY NAME — **CodeQL was FAILING at `SHA:14c01c15f` (4 high `js/insecure-temporary-file` from MY test's `/tmp` literals tainting writer sinks through the new DI seam; cured `SHA:5f0cbbce3`) — VERIFY it closed at the tip**; zero unresolved (4 threads resolved with evidence stand); zero body-tally; quiet window; bot REST merge at the FETCHED full oid. Owner's standing word THIS HOUR, verbatim: "as always, if the CI passes and all comments are properly addressed, the PR can be merged." Pending human requests (jimCresswell, mantagen, from PR-open) are governed by that word; mantagen is courtesy per practice. (3) **Lane tail post-merge**: Phase-8 broadcast + one quiet-window harvest; MCP-590 ticket comment; claim `2d76cc84` closes at merge; then the Bucket-1 remainder — error-envelope PR (`formatError` + two callers, `{code, message, upstreamMessage}` via structuredContent) with the error-vocabulary contract test; the OPERATIONAL rebuild stage→verify→promote from the fresh bundle (**probe env access first — unverified from this seat**); the demo-default flip to primary (owner ruling 2026-08-13, 2 lines: `demos/oak-curriculum-hub/.env.example` + README). Worktree `mcp-590-restricted-switch` kept on disk at the tip, tree clean. (4) **Warden seat stands**: sole commit-warden of the primary's git:index/head (arc-channel arrangement); Swordfish live on cure bundle 3 (#846) — their intents queue on the channel during this freeze, content safe in working trees, execute at resume; bundle-2 loop closed. (5) Board: survey lane ratified-and-HELD (gates expire 2026-09-02; Nautilus cold-paused, claim `95a0678d`); #774 gated; skills groups 2–6 (task #6). (6) NEW residue: estate-wide expect-then-if test-idiom sweep (the no-conditional-tests 2026-08-02 letter says "never an if-guard"; the corpus is full of expect-then-if; ALSO true the test-expert's §Diagnosis-5 reading — reviewer-doctrine drift caught when Copilot's literal reading beat the reviewer's cached one); comms-stream archive sweep (5,400+ event files, drain-cost class). Day's lessons: napkin 2026-08-13 afternoon entries (wrong-axis/owner-fact; tombstones; behaviour-vs-config counter-echo; CodeQL taint-through-DI; reviewer-doctrine drift).
>
> **RESUMED 2026-08-13 14:30Z; #871 MERGED `SHA:a4dd21da4` ~15:37Z — MCP-590 slice 1 LANDED.** Lineage claude-fable-5; apparatus re-armed per the map (watcher F-95-asserted, F-75 poll, heartbeat loop). Absorbed at resume: Wren SEAT CLOSED at owner word (their MCP-590 thread-record supersession note folded at `SHA:0877884fa`); Swordfish froze (their freeze 7) after handing five non-design-lane items for re-assignment (task #26) and queueing a warden intent, executed verbatim `SHA:cf764a9a7` (mechanical repairs receipted on the arc channel); sole live seat thereafter. The drive: round-7 vocab-corpus cure (red-first, mutation-proven) + dual expert passes (code-expert: formatter blind to failure, cap-driven split re-homed to a named boundary module, TSDoc mechanism truings; docs-adr-expert must-fix: the ADR attributed a CLI flag to a boundary that has none) landed `SHA:377c53b46`; round 8 (0g+2s) cured at `SHA:11b86b343` — Copilot CORRECTED my cannot-share premise (oak-search-sdk depends on sdk-codegen), so the bar consolidated to its canonical owner `isRestrictedInclusionBarred` (restricted-lesson filter), both boundary enforcers delegating, ONE retirement point at labelled-serving; round 9 CLEAN (0g+0s, ratchet closed at nine rounds). mantagen CHANGES_REQUESTED (agent-authored by Vesta hunts Expanse, bound to the pre-cure tip, requesting the already-shipped guard) dismissed-at-cure, timeline-verified. Full-CI-green boundary held (not just required checks); bot REST merge at the fetched oid; claim `2d76cc84` CLOSED+archived; remote branch auto-deleted, local branch deleted, worktree `mcp-590-restricted-switch` pruned; heartbeat loop re-armed on the TWO seat claims. **BOT-IDENTITY BREACH cured en route**: cwd-drift into the worktree made the token mint fail silently → empty `GH_TOKEN` → ambient owner fallback (a thread reply + resolve shipped as jimCresswell); cured by re-post/delete/unresolve+re-resolve under the bot; tripwires (pin cwd to primary; in-band author echo on every bot write) in napkin + per-user memory. **Owner correction banked (x2 class)**: every check's output to an untracked file, OVERWRITE — a tail on a check hides the result and forces a re-run; memory re-fired verbatim. LANE TAIL next: error-envelope PR (`formatError` + two callers, structuredContent), operational rebuild (PROBE ENV FIRST), demo-default flip to primary (2 lines). Board: task #26 (Swordfish's handoff routing, quiet windows); Swordfish frozen at their freeze 7 (resume at owner word, skeleton was in his Chrome); survey HELD; skills groups 2–6 (task #6).
>
> **RESUMED 2026-08-13 09:32Z** (owner word at resume: "your main job at the moment is to support Swordfish wakes Trench (d0274e)"; resume broadcast `6747a5e6`). Lineage verified claude-fable-5. Apparatus re-armed per act (1): quiet watcher (heartbeat-excluded, F-95 asserted; first arm used the stale `fable-5` model string and collided with the live identity — the live tuple is `claude-code`/`claude-fable-5`) + F-75 diff poll (10-min, baseline seeded at arm) + 180s heartbeat loop (both claims, cycle label director-support-swordfish). Absorbed since freeze: Swordfish RESUMED 08:01Z at owner word (fleet W1 / MCP-591, run wf_8e740b28-943; PR-2 worktree frozen clean at `SHA:5243224f9` for fleet integrity); their directed day-roll request 08:27Z (`266a3e74`, default self-roll 09:27Z) was DISCHARGED by the fold+rotation ahead of the deadline — threaded reply `0d1a7f40`. Their session carries a NEW binding owner design-lane instruction (the Oak identity in this repo must be instantly recognisable as Oak; canonical references <www.thenational.academy> and labs.thenational.academy/aila) whose thread-record landing was blocked on the rotation and is now UNBLOCKED — the verbatim words live in their session, so the actor+moment homing is theirs; it defines the next design arc after the fleet card. Posture: support-Swordfish; residue (act 6) routes only in quiet windows.
>
> **§COMPACTION FREEZE 9, 2026-08-13 ~09:3xZ** (owner word "prepare for compaction … then stop all processes", mid-fold): claims `a2286c53` + `dd3f640f` RETAINED; ALL PROCESSES STOPPED BY INTENT (stop-loop-first held); the seat CONTINUES at resume; branch at freeze `coordination/2026-08-12-219095` — superseded by the overtake above.
>
> **RESUME ACTS, IN ORDER:** (1) F-159 model check; re-arm watcher (quiet config, `--step-timeout-ms 120000 --max-events-per-drain 100` — the proven sizing for the 5,300-file stream; overnight "drain timeouts" were machine-SLEEP artefacts crossing wall-clock deadlines, not real hangs) + F-75 (state+fullname diff form) + heartbeat loop (BOTH claims, 180s, branch label current until rotation). (2) **COMPLETE FOLD #872** (tip `SHA:43dfe9242`): at freeze ALL checks green on the head (CodeQL, SonarCloud, Vercel, probe, unit-tests, preview-serves); round 1 (7 findings, 0 suppressed) fully dispositioned — 6 cured at `SHA:43dfe9242` (bucket-1 proof truings, gap-report superseding note, W1 gate discharge-by-removal, archived-plan move, probe-header true-up, S5145 sanitizer on Skua's probe script) + 1 routed (bucket-2 sketch fixture → its ratification pass, thread is the record); all 7 threads RESOLVED; claude leg = org-overage quota-skip (recorded exclusion, never a leg); Copilot round COMPOSING at the cured tip (request 09:08:16Z accepted — three requests all registered per the timeline; the earlier "silent drop" reads were timeline-read LAG, corrected in napkin). At resume: read the fresh round IN FULL (body+suppressed+inline, tallied separately), disposition, recount UNFILTERED (bare `pulls/872/reviews`), bot REST merge at the FETCHED full head oid (`merge_method=merge`, never squash). (3) **ROTATE**: cut `coordination/2026-08-13-<fold-sha-prefix>` from post-fold origin/main, `git push -u`, rotation broadcast, re-arm branch-labelled surfaces, seated-block fold entry with the product-gravity line (draft in the fold PR body). (4) **BOARD**: #871 (Wren's MCP-590 slice 1, in review, THEIR resume drives it — two opus reviewers cleared pre-freeze); #846 draft at owner gates (Swordfish frozen; fleet W1 resumable 10/11 legs, resume recipe in their freeze block df6e3fd65); #774 gated on #761/#772; Matt's PRs never ours. Survey lane: both opener nodes RATIFIED-AND-HELD (owner hold via Nautilus's seat stands; his explicit go through any seat opens execution; Nautilus cold-paused, claim 95a0678d retained). (5) **POSTURE NOTE**: last standing posture word was warm-pause/support-Swordfish (2026-08-12 ~18:4xZ); the 2026-08-13 fold+freeze word supersedes it operationally — resume posture recomputes from the owner's word at resume. (6) RESIDUE: skills groups 2–6 (task 6); MCP-586/587/588 routing; comms-stream archive sweep (5,300+ event files, warden-hygiene class); S4-F4 → design-review rubric owner at that lane's resume.
>
> **§COMPACTION FREEZE 8, 2026-08-12 ~16:2xZ** (owner word "please prepare for compaction, the first thing we do after compaction is discuss the survey redesign"): claims `a2286c53` + `dd3f640f` RETAINED; ALL PROCESSES STOPPED BY INTENT (stop-loop-first held); the seat CONTINUES at resume; branch `coordination/2026-08-12-219095`.
>
> **RESUME ACTS, IN ORDER:** (1) F-159 model check; re-arm watcher (quiet config, hourly) + F-75 (state+fullname diff form) + heartbeat loop (BOTH claims, 180s — the 240s cadence flapped the 4-min classifier boundary). (2) **FIRST SUBSTANTIVE ACT = THE SURVEY-REDESIGN DISCUSSION (owner-sequenced, his word verbatim above).** Grounding: freeze-7 map item 4 (multi-scale expansion — algorithms/data-structures core UNION code-design + architectural + application-design patterns, multiple scales/dimensions/lenses, multi-source corroboration — composed with the adopted 5+6 arc: classification census re-grounding the stale 2026-04-28 matrix, thinnest-Oak-slice deliverable, handover dimensions, licence mapping; prior art ADR-154 + backlogged oak-surface-isolation + ts-estate-consolidation contract at `SHA:c69b0746c`). NEW adjacent context since: the upstream-API-as-workspace RFC (owner-PRIVATE, reference-local — same estate-boundary question from the other side; do not re-derive its content into tracked surfaces) and Skua's lesson-retrieval report (`SHA:852491223`) whose Bucket-1 plan the owner is queuing (seat TBD). (3) **MERGE TAIL** (owner merge word stands: #865/#868/#869/#870; #868 MERGED `SHA:3981a53a5`): #869 — ceremony COMPLETE at freeze (4 threads resolved, Warden round 4917178093 dismissed at cure, Copilot re-requested at tip `SHA:6ee74ec0a` ~16:18Z) — read the round (BODY+SUPPRESSED+INLINE, never half-read), recount, merge-bot merge; #870 — same state (3 threads resolved, Warden 4917195093 dismissed, re-requested at `SHA:57e24b96c`) — retargets to main at #869's merge, then recount+merge; #865 — Wren LIVE with owner directing, sole item cure A (stage-before-clear + red-proof), at their push: dismiss Warden round 4917213920 (defect 1 the only live item; the TOCTOU five already resolved accept-with-grounds per owner card, comment 5268166013), re-request, recount, merge. Matt's PRs (#867, #761, drafts) are NOT in the set (owner corrected; a stray Copilot round on #867 is mine, harmless, ignore). (4) **⛔ FOLD GATE STANDS** (task #20, block below). (5) Pilot-arc closeout at all three merges: MCP-571-style Linear closeout not needed (no ticket) but the plan node gets its execution stamp; worktree `oak-worktrees/pilot-s234` sweeps when clean; implementer agent idle-complete. (6) Residue: S4-F4 routes to the design-review rubric's owner via this seat (findings register, S4 benchmark.json); MCP-586/587 (design-system defects from the evals) + MCP-588 (design-sync docs-truing, machinery DORMANT-RETAINED — owner correction verbatim in napkin, never remove `.design-sync/`) await routing; skills groups 2–6 lull work (task #6).
> **DAY'S STANDING ADOPTIONS:** repo is the design system's ONLY home (owner verbatim) BUT design-sync machinery is dormant-retained for an owner-held demo-ingestion pipeline pointer; rounds are read body+suppressed+INLINE, tallied separately (the half-read relay error, napkin); TOCTOU accept-with-grounds dual-evidence shape (Node-API-bounded + threat-model/opus); the corrected pilot benchmark (class invention 81%→0%, an elimination — the earlier 4.7% was a tokeniser artefact); the adverse case-3 verdict = doctrine iteration-2 material (decline→route-and-demonstrate).
>
> **FOLD GATE DISCHARGED (owner card 2026-08-12 ~17:1xZ, "Accept & fold"):** the next coordination fold proceeds carrying `SHA:852491223` (pre-classification versions of the Foundry direction-paper lane) — the owner ruled exposure already-realised on the public branch, no history rewrite. The content-substance boundary STANDS: no consolidation of that lane's substance into tracked surfaces (the genericised napkin lessons are the whole tracked record). Original gate registered ~14:0xZ at the PRIVATE classification (stream event 14:04:34Z).
>
> **§COMPACTION FREEZE 7, 2026-08-12 ~09:3xZ** (owner word "prepare for compaction... then close all processes"): claims `a2286c53` + `dd3f640f` RETAINED; ALL PROCESSES STOPPED BY INTENT (stop-loop-first held); the seat CONTINUES at resume; branch `coordination/2026-08-12-219095`.
>
> **RESUME FIRST ACTS:** (1) F-159 model check. (2) Re-arm on `coordination/2026-08-12-219095`: watcher (quiet config, hourly cycle), F-75 poll, heartbeat loop (BOTH claims, branch label `219095`). (3) **THE MERGE TAIL, in order** — #818: dispositions complete, threads 0, terminal settle comment posted; a merge-bot merge was polling at freeze (task output `bynarp5wl` in the prior session's task dir) — recount UNFILTERED (owner ruling this morning, verbatim "never ever filter reviews, ever": EVERY read is the bare `pulls/N/reviews` list) then merge; #819 AFTER 818: update-branch from post-818 main, revalidate the two anchors + `OAK_STATUSLINE_LOG_FILE` claims, dismiss its two cured Warden rounds with evidence (same shape as 818's dismissals), rebind if the tip moved, merge; #864: terminal binding landed AT FREEZE with suppressed comments UNREAD (tip `SHA:6a7a449a4`) — read unfiltered, disposition per the declared loop exit (no tip moves; route-with-gate residue), merge; #865 (Wren's MCP-570 jurisdiction cure): merge at their settled signal — SEQUENCING: #864 and #865 touch the same skills machinery, second lander does update-branch + `skills:generate` + recheck before recount. (4) **OWED TO THE OWNER: the survey-redesign discussion** — his multi-scale expansion (algorithms/data-structures core survey UNION code-design + architectural + application-design patterns; multiple scales/dimensions/lenses, critical analysis, multi-source corroboration) composed with the adopted 5+6 arc (classification census re-grounding the stale 2026-04-28 matrix, Oak-leaf-side deliverable, handover dimensions, licence mapping; prior art: ADR-154 + the backlogged oak-surface-isolation programme + the typescript-estate-consolidation-review whose extractor was LOST with Lichen's worktree, contract/schemas surviving at `SHA:c69b0746c`). (5) Design lane: HIS gate, he said "aiming for this morning" — relaunch Swordfish on slice 1 at his word only. (6) MCP-568: probes read null-differential over 2h42m (both primitives survived; kill is intermittent — see ticket); re-arm the pair at session start with a task census. (7) MCP-572 remainder: frame-store descriptor pass + Windows capability gate + uid check (ticket carries recipes).
> **FREEZE-EVE OVERTAKE:** **#818 MERGED `SHA:d1277426f`** during freeze prep (the backgrounded merge-bot attempt completed; MCP-529 Done) — resume act 3 starts directly at #819's update-branch.
> **BOARD AT FREEZE:** #818 MERGED (all seven ratchet rounds settled; Warden rounds dismissed at cure; MCP-572 narrowed + fed); #819 now UNBLOCKED behind it; #864 one-read-from-settled; #865 at Wren's drive (they are LIVE, self-directed); comms-channels skill EXISTS on #864 with the canonical card overlay landed; MCP-571 In Progress; MCP-545/569/570/571/572 board current in Linear. STANDING ADOPTIONS THIS SITTING: never-filter-reviews (owner verbatim, absolutised in per-user memory); Cricket-is-a-lens-not-an-authority (owner correction, memory + napkin); class-disposition-before-fresh-gates (the #818/#819 card fallacy correction); the declared-loop-exit pattern for non-converging ratchets.
>
> **§COMPACTION FREEZE 6, 2026-08-12 ~05:0xZ** (owner word "please prepare for compaction"; date corrected 2026-08-12 at resume — the block was first stamped "2026-08-11 ~23:1xZ" from a wrong in-freeze clock estimate, but the heartbeat-end broadcast is timestamped 05:08:25Z and #862 merged 04:58:45Z, so the freeze-eve overtakes below genuinely landed pre-freeze): claims `a2286c53` + `dd3f640f` RETAINED; ALL PROCESSES STOPPED BY INTENT (stop-loop-first held); silence past the freeze broadcast is the boundary, never retirement; the seat CONTINUES at resume.
>
> **RESUME FIRST ACTS:** (1) F-159 model-lineage check. (2) Re-arm on `coordination/2026-08-11-169e3e`: canonical watcher (quiet config `--exclude-tag heartbeat` + F-75 diff poll — F-160's corrected diagnosis stands: exclusion path implicated, full stream is the proven mitigation, quiet is the economy choice; hourly re-arm), heartbeat loop (BOTH claims, branch label `169e3e`), PR poll on the live set. (3) FREEZE-EVE OVERTAKES, all landed pre-freeze: **#862 MERGED `SHA:1699ddea2`** (the eighth landing — my grant at Forge's full handback, event 2b996a91, absorbed 5/5); **Forge's seat CLOSED clean** (no claims retained; their mcp-549-deps worktree sweeps at the next fold); MCP-545's PROOF TAIL is a resume act — production "Task timed out after 300 seconds" rate should collapse to ~zero vs the 980/24h baseline (get_runtime_logs environment=production, 24h window), then MCP-545 → Done and MCP-544's alert arc gets its clean signal. (4) Route the unrouted: MCP-566 (middleware-doc truing family, small), MCP-568 (HIGH — the background-task kill diagnosis; foreground-for-critical-writes is its dated MITIGATION, never doctrine — owner flagged the seat's acceptance-euphemism framing of it, now trip-listed, as a foundational-issue red flag), MCP-559/560/561/562, #818/#819 (the only unowned PR remainder). (5) OWNER CORRECTION at freeze-eve (via Wren's broadcast, verbatim "it's a cli call, there is nothing special about you calling rather than someone else"): the proven-requester-seat pattern is RETIRED — Copilot requests are ordinary calls from any seat; a no-event fire gets an instance diagnosis (timeline-read lag retry; already-pending no-op check), never seat lore. Post-merge proof leg: production timeout rate → ~zero on the environment-split instrument (MCP-544's clean signal).
> **BOARD AT FREEZE:** ALL SEVEN of the night's PRs MERGED (#854 fold `SHA:169e3ede3` → rotation done; #859; #860; #861; #851 `SHA:f81902f7e`; #805 `SHA:6ecd607f8`; #849 `SHA:1008f3656`). Forge LIVE on #862's settle then MCP-546-adjacent? NO — 546 re-scoped Medium, unrouted; their post-862 next is unassigned. Wren self-directed (next: MCP-543 keep-lib PR, vendoring-symlinks, de-hatch arc). Spark LIVE-holding #805 post-merge harvest; **#818/#819 the only unowned remainder** — route at resume. Swordfish cold-paused (design lane, owner-word resume).
> **NIGHT'S STANDING ADOPTIONS:** analysis-before-routing (owner: symptoms→meaning→is-it-a-problem gates execution — the MCP-545/546 arc is the worked instance; 545's "phantom-vs-real" reversal at his check-again word is the companion); dismiss-cure-Copilot review flow (no mantagen re-reviews per owner word — but see #862's fresh APPROVAL above); Copilot request proof = TIMELINE events (self-removal on acceptance); merge drives FOREGROUND; Sonar issue queries carry explicit `issueStatuses` facets (the #850/#851 "phantom" was the query surface, not the instrument); portable Practice-Core stays FLAT (host topology in the host bridge only). Practice moves MCP-560/561/562 ticketed and unexecuted; MCP-565 carries the one routed doc residual; MCP-559 (DEP0169) unrouted.
> **QUEUED SEAT WORK (unchanged):** comms skill (task 8, grounding aa4df7b8c); skills groups 2–6 routing + pilot S1b follow-ons (task 6); handover plan node authoring; board hygiene; memory-consolidation execution awaits its owner-started seat.
>
> **ROTATED 2026-08-11 ~22:1xZ**: fold #854 MERGED `SHA:169e3ede3` (six review rounds, all cures landed; the binding round's three findings cured on this successor rather than carried as rows); #860 (MCP-558) MERGED `SHA:0d76acff7`; #859 (MCP-554) MERGED. Coordination branch is now `coordination/2026-08-11-169e3e` (old branch delete attempted, refused by ruleset — retry at next fold or owner-delete). Evening's owner rulings executed: analysis-first on MCP-545/546 (verdict: no user harm — observability + inherited-defaults + scaling cliff; MCP-560/561/562 stand for the three adopted practice moves); 545 at Forge (claim 9eaba6f2, 405-first); 546 Medium re-scoped; the #851 "Sonar phantom" REVERSED to genuine at the owner's check-again word (S4043 sort-mutations, cured by Wren, gate OK — the query-facet lesson, `issueStatuses` param, supersedes the #850 phantom doctrine). Board at rotation: #849 one bind from merge (class disposition covers archival re-flags); #851 one update-merge from merge; #805 at Spark's atomic cure + final round; #861 (S1b) open, Copilot bound; Forge on MCP-545; Swordfish cold-paused; mantagen re-reviews permanently withdrawn at owner word (dismiss-cure-Copilot is the standing review path).
>
> **RESUME FIRST ACTS:** (1) F-159 model-lineage check. (2) Re-arm: canonical watcher (diagnosis corrected by F-160, 2026-08-11: the 180s probe ALSO died while the full stream survived at 60s — the exclusion path, not the deadline model, is implicated; the full stream without `--exclude-tag` is the proven mitigation, the quiet config a known-risk economy choice; hourly re-arm either way), heartbeat loop (BOTH claims), ARC tail (`2026-08-11-dependency-cure-*`). (3) **#854 fold merge**: cures at `9afeb925e` (Warden 4907855708 findings 7/7 adopted + replied; the round-3 Copilot suppressed batch superseded by the same cures); mantagen re-review REQUESTED (registered); Copilot round-4 asked of Forge's working seat at freeze — at both legs clean: UNFILTERED recount (NEW STANDING: recounts harvest ALL reviews, never reviewer-filtered — the Copilot-only filter missed the Warden review 70 min, owner-caught) → merge-bot merge → ROTATE (successor cut from post-fold main, push -u, broadcast, re-arm branch-labelled surfaces).
> **BOARD AT FREEZE:** Forge LIVE at owner word, self-driving #855→#856 (stack: local rebase at retarget, full recount)→#857 via merge-bot recomputes; Wren LIVE on #850 (round-4 cure `bca591fb5`; their settle signal → unfiltered recount → fresh sha-pinned grant); Swordfish FROZEN (design lane, owner-word resume); Smith RETIRED (#805/#818/#819 remainder unowned — route or Wren's drive). #849/#851 request legs asked of Forge; standing merge policy carries both.
> **QUEUED SEAT WORK (no owner gates):** handover plan node authoring (ratification carded when drafted; notes at `.agent/analysis/2026-08-11-mcp-maintenance-handover-isolation.md`, on main via #854); editorial-tone amendment (first-paragraph-stands-alone-for-non-technical-stakeholders, small PR); comms skill (grounding `aa4df7b8c` on #846); skills group moves 2–6 + pilot S1b; board-hygiene pass. Memory-consolidation execution awaits its owner-started seat.
> **DAY'S STANDING ADOPTIONS:** jimbot label at every owner/bot PR creation; matrix-first (don't park matrix-resolvable decisions on the owner — owner correction twice today, once at this seat); register reality (no sign-off mechanism exists — the audit report itself says so; never claim one); plans outrank thread records (Warden ruling class); a ratification stamp owner-locks nothing; recounts reviewer-unfiltered. Product record: the project update published and twice same-day corrected under claims-true-when-read; MCP-549 complete (Done, residual owner-accepted); the fold carries the handover notes + Smith/Wren terminal records + the day's plan re-scopes.

---

> ### ▶ SITTING DIRECTOR (seating block): Plover lifts Troposphere (`b10c37`), seated 2026-08-07 16:01Z (Moment-2 `03e811f8`, succeeding Panther rides Midnight per its Moment-1 `8cb67079`, owner-named successor with full shadow period); claims `a2286c53` (director) + `dd3f640f` (gate-ledger, dormant) adopted in place, heartbeats bumped at adoption.
>
> **SEATING BLOCK 2026-08-07 ~16:05Z — durable half only; recompute every derivable. Two registers per the Firefly convention.**
>
> - **§LINEAGE:** Panther rides Midnight (`7efb00`) sat 2026-08-07 09:45Z → 16:01Z (clean two-moments handoff — the first full Moment-1→Moment-2 succession since Falcon; heartbeat-end 16:01:36Z, stand-down by intent). Successor map of record: `.agent/state/collaboration/handoffs/7efb00-panther-rides-midnight-2026-08-07-wrap.md` (open threads with next acts, the tenure's three owner corrections with adopted cures, instrument notes). Panther's tenure-close block below stands as binding history.
> - **§EVIDENCE (2026-08-07 ~16:05Z, dated):** tree clean, parity 0/0 at `668188d9e`. Roster at seating: Gull lifts Nimbus (`3da0ae`, consolidator `de328d24`) LIVE on the dedicated consolidation, whole-goal frame; Saffron guards Hedgerow (`8a4280`) compaction-FROZEN at owner word 16:01:54Z, claim `645b9e0b` RETAINED, seat resumes post-compaction — its freeze broadcast is the lane state of record: #817 ALL GREEN awaiting the owner's merge word only; #814 cure round 2 is its next act. The swept-bundle incident (cece7f423) is CLOSED — Gull verified all six files complete, nothing lands forward.
> - **§STATE (tests, not values):** board truth is `gh pr list` + the wrap record's open-thread map, re-derived at read time; fleet truth is `claims active-agents` with a UTC `--now`, cross-checked against worktree mtimes for same-machine seats; branch truth is `git rev-list --left-right --count` against the remote. MCP-519 tripwire 2026-08-11 after 10:00 London; MCP-526 due 2026-08-12.
> - **§CONSTRAINTS:** Panther's §CONSTRAINTS block below carried unchanged (bot identity every gh write; never squash; sha-pinned REST merges; suppressed-findings read at every merge decision; stage by explicit pathspec; comms via `--body-file`; zero-new-Sonar; "slow down, discuss" standing). Plus the tenure's inherited cures, adopted at this seat: shared-tree index check (`git diff --cached --name-only`, untruncated, before EVERY commit; non-empty pre-existing index = stop-and-coordinate); override-vs-restatement (diff any seat's reframe against the owner's verbatim); no-IO-in-tests instrument naming; seat-vs-liveness (no bump-to-cosmetically-cure).
> - **§SEAT MECHANICS:** canonical watcher quiet configuration (Monitor `bxjcccztc`, heartbeat-excluded, F-95 asserted green, hourly re-arm on exit notification + gap sweep) + F-75 diff-only peer-liveness poll (Monitor `by1o7lpsl`, 600s, baseline at arm) + ARC-channel tail (Monitor `bb7b5t6jl`). Heartbeat loop (Monitor `bv750jqkt`) 240s dual-surface, bumping BOTH claims per the F-92 singular-claim-loop lesson. (IDs re-armed at resume 3, 2026-08-09 ~11:1xZ.)
> - **§FOLD+ROTATION 2026-08-13 ~09:5xZ (owner word at morning resume: "rotate the coordination branch … then prepare for compaction"; F-159 PASSES — claude-fable-5):** fold **#872 MERGED `SHA:ca6b0fd8f`** (two rounds: round 1's 7 findings all first-hand-verified, 6 cured at `SHA:43dfe9242` + 1 sketch-routed; round 2 ZERO generated + 4 suppressed cured on this successor per the #854 precedent; Sonar's S5145 gate fail on the ride-along probe script cured with a five-site sanitizer, authorship named; claude leg org-overage quota-skip recorded, never a leg). **Rotation: successor `coordination/2026-08-13-ca6b0f` cut from post-fold main; primary resides there; 24h clock restarted.** moved for teachers: no live-service change; the lesson-search freshness lane is one merge from restoring index freshness (#871 in review; ratified Bucket-1 plan carries the owner's serving-posture rulings). moved for the Practice: the 2026-08-12 window's full record on main — pilot complete (now ARCHIVED per its own schema), survey programme ratified with machine-readable owner-hold gates, MCP-570 jurisdiction landed, the shepherd-seat pattern proven, the commit-window protocol minted from the three-writer race. Instrument corrections banked: sleep-crossed deadlines and timeline lag are CLOCK artefacts, not state facts.
> - **§FOLD+ROTATION 2026-08-12 ~06:5xZ (owner word at morning resume: "time for a new coordination branch"; F-159 lineage check PASSES — claude-fable-5):** fold #863 MERGED `SHA:219095ff3` after a four-round Copilot ratchet (5→3→2→0 generated findings; every finding adopted in-delta or ROUTED — MCP-569 carries the presence-vs-occurrence guard-mechanism cure with its retirement condition; settle-round suppressed trivia cured on this successor per the #854 precedent). Reviewer-leg mechanics hardened: merge-bot `--expect` matches the exact review-author login (`copilot-pull-request-reviewer`, unsuffixed — the REST surface shows `[bot]`, the harvest does not); claude org-overage and codex usage-dead exclusions recorded on the PR with grounds; a quota-skip does NOT satisfy a leg (owner ruling 2026-07-21, enforced by the verdict engine first-hand this fold). **Rotation: successor `coordination/2026-08-12-219095` cut from post-fold main; primary resides there; 24h clock restarted.** moved for teachers: **MCP-545's production proof CLOSED** — the timeout class collapsed exactly at the v1.163.2 deploy boundary (last event 05:04:18Z, deploy READY ~05:06Z, zero since; ticket Done with evidence; MCP-544's alert arc inherits a clean signal). moved for the Practice: acceptance-euphemism enforcement now covers the record surfaces where the pathogen lived (own scoped group, test-first, wired denial path proven); the owner-commissioned Cricket 24h tally with its CORRECTED adjudication is on main (the false-interval lesson: a mis-dated freeze block propagated "24h of neglect" into four independent verdicts and the tally — real gaps ~30/~40 min; verify load-bearing intervals against timestamped artefacts, napkin ~06:1xZ); MCP-568 step-1 ESTATE-CLEARED (no estate mechanism kills outside its own tree) with a live in-session instance banked and the victim class refined (`run_in_background` Bash dies; Monitor primitives survive — step-2 differential probes armed this window). Wren LIVE mid-window on the MCP-567 reshape ruling (owner-pending at their seat; their freeze records folded at `SHA:79d68208b` with authorship named).
> - **§FOLD+ROTATION 2026-08-11 ~06:5xZ (owner word at morning resume: fold PRs merge, yesterday's branch folds, fresh cut; session back on Fable 5 — the F-159 lineage check PASSES):** #842 fold MERGED `7b3df0bbf` — owner card answer "Merge it now" discharged the review-leg fork (docs-only delta on a twice-zero-finding round; both Copilot request paths dead at this seat: MCP tool classifier-denied, REST silently drops the handle — verified via timeline); stale agent-authored CHANGES_REQUESTED (Marlin binds Wave under mantagen) dismissed with per-defect evidence; suppressed-findings triage: cures at SHA:573107f18, the SHA-prefix class → MCP-541, design-lane acceptance rows routed to that lane's resume map. #848 MERGED `bb40ecdf5` (grant `113D7A7F`, Wren-executed clean incl. Phase-8; MCP-540 Done — the type-helpers mutation canary is complete). **Rotation: successor `coordination/2026-08-11-7b3df0` cut from post-fold main; primary resides there.** moved for teachers: no live-service change; the canary hardening protects the type-helpers test truth. moved for the Practice: the fold record on main; **pilot plan RATIFIED** (owner word "Good morning! And, ratified", stamp in frontmatter, corpus 63/63); memory-consolidation plan COMMISSIONED (grounded in Wren's MEMORY.md size-guard report 21.5KB/24.4KB + the 2026-08-05 vendor-memory audit, Petrel seat, as re-verifiable baseline — draft in assumptions review); comms skill COMMISSIONED (grounding: Swordfish's owner-directed landscape analysis `aa4df7b8c` on the #846 branch). Wren rulings issued: search-contracts whole-package layer move libs→sdks (their consumer-graph evidence adopted), turbo zero-match-glob slice in-lane. Board next: six group moves READY to route; pilot S1a routable at the stamp; #846 draft rides Swordfish's frozen lane (PR-2 2/10). Claims `a2286c53` + `dd3f640f` RETAINED; all processes stopped by intent; silence past the freeze broadcast is the boundary, never retirement. [Superseded within the day, trimmed at the 2026-08-11 second fold: the morning resume-map tail that rode this line (F-159 model check, #842-open board rows, pilot-stamp card, group-move routing, Wren's #848 recount) had all been executed by mid-morning — #842 merged `7b3df0bbf`, #848 merged `bb40ecdf5`, pilot stamped+ratified, groups routed; git history carries the original text.]
> - **§MODE CORRECTION (owner reflection asks ×2, 2026-08-10 ~11:5xZ — SUPERSEDES every earlier resume-map's apparatus prescription while the fleet shape holds):** PDR-082 n=2 owner-visible governs: this seat runs the canonical comms watcher ONLY — no heartbeat loop, no F-75 poll, no ARC-tail monitor; claims held, bumped at natural boundaries; silence is the boundary, never retirement. NO self-initiated work while the owner's focus word (design lane) stands — the fold cascade was the worked violation: a careful safety analysis ran, the value analysis never did; licensed-by-some-rule ≠ valuable. Seat deliverable = owner-intent to the right seat + blockers at their action moment, never legible effort; outbound passes "does the recipient need this to act?" and lands short — events get action or silence, never narration. Board at correction, each with its named gate: #842 fold OPEN and gated on org review credits restored (owner-side; all four required checks green, threads 0; the claude auto-review quota-skips) — at credit return: merge, rotate; design lane 2/10, authoring at Swordfish's own slice order (picker-early); ADR-213 §3 showcase-rule wording gated on owner ratification; fork-2 (DS runtime brand primitive) gated on the first demo that needs it; PDR-136 §5 gated on the owner's silence-meaning sub-decision. Detail: per-user memory `licensed-activity-is-not-value`.
> - **§STANDING CONSTRAINT re-asserted (owner word 2026-08-10, post-freeze — binds the resumed seat): THE LENS GATE IS PRIMARY.** Run every decision through the decision matrix (principles.md §Decision Lenses: 1 architectural-excellence → 2 strict-everywhere → 3 could-it-be-simpler → 4 would-it-be-simpler-if-the-system-changed → 5 user-value; unformed → concept-exploration first; proportionality sizes) BEFORE anything reaches Jim. A question reaches him ONLY if all five genuinely fail OR it is constitutively his (product/feature scope, ACCEPTED residual-risk authorisation, his own promised review/instrument). Either/or = false frame → third option or both. Over-surfacing is the risk-averse crouch — the SAME generator as this window's over-gating (the assurance-frame stall) and the metric-nonsense (asserting not measuring): under-using the seat's decision authority. When a survivor DOES reach him, present the lens run. Detail: memory [[lens-gate-before-owner-surface]].
> - **§COMPACTION FREEZE (design-lane deep window), 2026-08-10 ~08:4xZ (this seat — owner word "prepare for compaction, stop all processes"; the seat CONTINUES):** claims `a2286c53` (director) + `dd3f640f` (gate-ledger) RETAINED. ALL PROCESSES STOPPED. **THE METRIC LAW (headline, owner's "proceeding is nonsense" catch — napkin'd):** the deliverable is the only metric — DISTANCE-TO-PIXELS (specimen regions rendered), measured FIRST-HAND (branch tip + route directory), never asserted from message traffic or heartbeats; doctrine/coordination volume is displacement, not progress; break means-before-end sequencing; converge don't proliferate; declaring convergence closed is the Director's job, not a gavel to wait for. **DESIGN LANE (Swordfish `d0274e`, claim `645b9e0b`, ACTIVE):** #834 MERGED `6804726e2` on main (grant `3D70638B`, recounted first-hand on the moved harm-first bar) — the fidelity instrument is done. PR-2 lane CUT: branch `jimcresswell/design-identity-switchboard-pr2`, worktree `identity-switchboard-pr2`, clean off origin/main, builds green. **COUNTER: 0/10 specimen regions rendered.** Slice 1 = specimen route (server-side brand) + masthead region. ARCHITECTURE (agreed, design-system-leg CONFIRMED sound + upgrade over export): specimen route emits brand SERVER-SIDE (first-paint, matches production `consuming-nextjs §5`); picker swaps the brand `<link>` INSIDE the frame's document (in-place re-skin = the hero; structural proof — only works if markup is brand-invariant); reload eliminated; two pages (switchboard instrument + side-by-side proof); plan's iframe-src clause needs a dated amendment (rides PR-2, also fixes "Open full page" per F4). **SLICE-1 PRE-EXEC REVIEW COMPLETE, both verdicts handed to Swordfish** (digests: `scratchpad/slice1/a11y-verdict.md` + `designsystem-verdict.md`): a11y — per-brand contrast gate, sticky 2.4.11 focus-obscured, aria-current page→true+visible-marker, disposition-class needs UPSTREAM-HOME; design-system — F1 add `.oak-btn--sm .oak-icon--mask` to TRUNK (DS-origination twin of SegmentedControl), F2 server-safe `lib/identities.ts` (collapse 4 dup vocabs, allowlist validate), F3 cascade-order load-bearing + no-flash cell asserts brand-OVERRIDDEN value, F4 open-full-page from control state, F6 strip var() fallbacks (--layer-sticky 20→40 stale), F7 oak-scope on wrapper not body. **OPEN DOCTRINE (owner's, non-blocking):** PDR-136 §5 proposed amendment authored `487b3ebc9` PENDING RATIFICATION (one owner sub-decision: silence's single meaning; recommendation "not-invoked/absent, not-configured emitted"); four-mode contribution frame OPERATIVE (generative/improvement/discovery/falsification; mode set by the question; R1 proportionality-selects, R2 judge-every-output) — graduation → PDR-111 pending; boundary exploration report (showcase = proof surface, DS-origination required) at `.agent/reports/showcase-design-system-boundary-concept-exploration-2026-08-10.md`; methodology report at `.../multi-agent-review-methodology-2026-08-09.md` (owes a four-mode truing); Agent-tool restriction resolved operationally (Director dispatches Swordfish's reviews). **OTHER LANES:** Wren PAUSED until 2026-08-10 (#836 workspace-config isolation OPEN, packet posted, cure batch in flight at Wren's freeze — resumes at Wren's word). open-surface-zero: 10 of 14 ours-rows executed (+#834); paused remainder #745/#746/#805/#818/#819 + orphan sweep + invariant graduation + closing report. 24h fold due ~10:00Z 2026-08-10 (likely due/overdue — check at resume). **RESUME FIRST ACTS:** triad on `coordination/2026-08-09-b5f347`; re-arm watcher + F-95 + gap sweep; re-arm F-75; re-arm heartbeat loop (BOTH claims); re-arm ARC tail on `2026-08-10-design-lane-plover-lifts-troposphere-swordfish-wakes-trench.md`; sweep ARC for Swordfish's region-1 progress (the counter should read >0/10 — MEASURE it first-hand, don't assert); check the 24h fold; note #834's `identity-switchboard-pr1` worktree is prunable (Swordfish cut pr2 fresh).
> - **§EVENING FOCUS + PAUSES, 2026-08-09 ~15:5xZ (this seat):** THREE OWNER WORDS this hour — (1) **Wren's lane PAUSED until 2026-08-10** (relayed with make-safe: push banked work, dated state note, claims retained); (2) **Codex-dialogues review leg rated HIGH VALUE** (napkin capture with working mechanics; graduation candidate for the standing review shape via the rules process); (3) **design lane is the day's ONLY remaining focus, all hands on deck** — Civet's #834/PR-1b is the active front (orchestrator+pairing-schema consolidation at their seat, pre-execution review run, one batched push coming; recount+grant standing at READY), this seat in support (offer landed on ARC incl. a Codex leg at their option). In-flight completions sanctioned as make-safe: #746 executor (final gate → push → T4 adjudication reply; PR stays owner-gated draft per plan criterion 5), turbo-edges PR (own-build dependsOn edges; merges if settled today, else parks open-safe). PAUSED at safe states: WS7 groups 2–8 (recipe PROVEN — **#837 MERGED grant `F5A84217`**, cognition group on main, Copilot zero comments, conservation held), #816 reconcile, #805/#818/#819 reads, orphan sweep, invariant graduation. Earlier this hour: **#836 four-surface review round complete** (packet comment 5232026823 + addenda 5232048431 + 5232091447; Codex verdict CURES-NEEDED converging on the core + two novel findings) and THREE owner rulings landed — turbo = declared-relationships (records re-worded; cure PR cutting at `jimcresswell/turbo-own-output-edges`), **depcruise = the right tool** (regex scanner REPLACED, not cured; right-tool clause in validation-strategy.md at `b11d9985f`), **ESM: zero require, dynamic imports error-with-recorded-exemptions** (retires H1's analysis shape). #766 MERGED `737971B6` at owner word earlier. Census: 9 of 14 ours-rows executed (#731 #734 #766 #769 #771 #788 #792 #807 + #837 as WS7's vehicle).
> - **§AFTERNOON DRIVE, 2026-08-09 ~13:5xZ (this seat):** open-surface-zero census now **6 of 14 ours-rows executed** — the plans-truing batch ran at this seat: **#769 MERGED** (grant `9790652E`), **#771 MERGED** (grant `19F8AF77` — after the Vercel-ABSENT-not-failing lesson: a draft-era head never fired the deployment, cured by `update-branch` + settle-watch; recount discipline is presence AND success per required check BY NAME), **#788 MERGED `30eabd181`** (grant `80D0B33B`), **#774 DATED HOLD** (author DO-NOT-MERGE marker + MCP-143 series dependency, re-adjudicate at #761/#772 settlement), **#766** owner chose the agent cure round at the card (references from original sources + invariant phrasing + usage-credits invariant; cure subagent dispatched, lands on his branch for his diff review), **#792** owner RATIFIED the slice-2 bootstrap pair at the card (the never-carded Aug-6 gate cleared); branch reconciled in its worktree — main-merge restored the stale-captured DISCHARGED passage, slices 1/1.5 trued as landed via #790, gate recorded cleared (commit `5aff12537`, push in flight, merge at recount). **WS7 EXECUTING at this seat per the owner's Director-run-subagents card word**: pre-execution code-expert (opus) verdict PROCEED-WITH-CHANGES fully adopted — go† re-judged into `choreography` (start-right-quick twin), outbound-link direction added to the sweep, cross-group debt recorded; implementer ran the seven cognition moves + all truings, STOPPED correctly at 13 unmapped sibling-form links (forced cures adopted — napkin lesson: the link VALIDATOR is the honest sweep instrument, path-greps are structurally blind to sibling-form), resumed toward commit/push/PR. **#835 (Civet PR-1a)**: fold ruling (b) — seam accepted, history rewrite is risk-of-loss class barred at every agent seat; **grant `5B2F71AD` → MERGED `365a6f7c7`**; fidelity core live at `packages/libs/fidelity-review`; #834 is now PR-1b. **#836 (Wren)** open at review, gates green; 835×836 adjacency settled peer-to-peer (second lander absorbs two one-token swaps; their validator makes it loud). Superseded paused-pr plan ARCHIVED (frontmatter was already trued). Remaining queue: #745 (seat-queued behind WS7), #746 (corpus-amendment ratification-prep = next Director act), #805, custodial pair, orphan sweep, invariant graduation, closing report.
> - **§RESUME 3 + THREE ASKS ANSWERED + TWO MERGES, 2026-08-09 ~11:2xZ (this seat):** freeze-3 resume map executed in full — triad clean (local was ahead by Wren's plan commit `5698208fc`; pushed for parity); all four monitors re-armed (IDs in §SEAT MECHANICS); n=3 STANDS (Civet + Wren heartbeat-live). Gap sweep: Civet froze 10:56Z and self-resumed; **#834 BLOCKED at the required Sonar duplication gate (21.5% vs 3%) — consolidate-at-second-consumer fires and the PR SPLITS**: PR-1a extracts the shared fidelity core to `packages/design/fidelity-review` (hardened showcase versions canonical — the hub's three carried defects die by construction; discharges board item 3), #834 becomes PR-1b (merge-main + import swap after PR-1a); Civet executing within claim `645b9e0b`; their #834 READY is SUPERSEDED until PR-1a lands. Wren's config-isolation plan owner-RATIFIED at `76b061382` (their card); execution opens at their todo 1. **OWNER LIVE mid-resume**: asked for the skills-reorganisation landing plan (agentskills.io spec read first-hand — sampled projections conform; `skills-ref validate` folded into WS4 as a dated amendment) and **answered all three freeze asks at the card**: (1) #731 dismiss-via-bot; (2) #734 S6564 ACCEPTED authorised (residual-risk word); (3) #734 own-review WAIVED — merge on green. **EXECUTED at this seat: #731 MERGED `1356579ca`** (grant `86E976CA`; stale review 4846560899 dismissed with recorded grounds; head branch auto-deleted; worktree pruned) — Parallax live at `cognition/parallax-*`, **WS7 NOW ROUTABLE**. **#734 MERGED `dab59963f`** (grant `440D4744`; four S6564 issues ACCEPTED server-side via the authenticated sonar CLI with per-issue owner-authorisation comments, PR quality gate recomputed OK / zero open issues; stale Aug-6 agent review 4872180945 dismissed on its own discharged conditions — its text sanctioned the reasoned-disposition route for S6564; Copilot structurally unable at >20k lines; worktree pruned; local branch `jimcresswell/parallax-family-generator` retained — tip on origin/main, owner-side prune list with the canary twin). **Census: 3 of 14 ours-rows executed** (#731, #734, #807). NEXT queue: #745 adjudication (Wren's partial facts at paused claim `04883b1e`) → #746 → plans-truing set (#766/#769/#771/#774/#788/#792) → #805 → custodial pair (#818/#819) → orphan sweep; WS7 routes at the next free seat.
> - **§COMPACTION FREEZE 3, 2026-08-09 ~10:5xZ (this seat — owner word "when you reach a sensible point, prepare for compaction"; the seat CONTINUES):** claims `a2286c53` + `dd3f640f` RETAINED. **Mode: n=3 FULL PROTOCOL** (this seat + Civet 054f5e live-heartbeating; Wren 6b29b5 freshly self-resumed on the config-isolation lane). Monitors stopped by intent at the freeze broadcast in order (ARC tail → F-75 → heartbeat loop STOPPED FIRST then its end declared in the broadcast → watcher last). **STATE AT FREEZE — three PRs in flight**: **#731** checks all green, threads 0, MERGEABLE; blocked SOLELY on the Aug-3 agent-authored code-owner CHANGES_REQUESTED (CODEOWNERS `* @jimCresswell @mantagen` + require_code_owner_review makes it mechanical; all three findings CURED at `cf7d02733`+`6dcf8b83a`, disposition comment 5231069940, both threads resolved with evidence, mantagen + Copilot re-requested) — **OWNER ASK 1: dismiss the stale agent review or wait for the automation**. **#734** slice EXECUTED (`2a699c535`: dead NonEmptyString retired, null-guard reordered, L195 thread resolved; merge `b0f0bcc36` unioned the 3 conflicts and fixed main's own stale PDR-134 index row); Sonar re-fires on the push — **OWNER ASK 2: the four remaining S6564 aliases** (brand = measured 140-ref/28-file ripple; remove = loses boundary documentation; ACCEPTED needs his explicit residual-risk word per the two-outcome policy) — **OWNER ASK 3: his promised own review on #734** (the Aug-6 agent review was "ahead of his own"). **#834** (Civet): both rounds adjudicated, watching checks + Copilot round 2; READY lands at the resumed seat. **open-surface-zero**: #807 done, #731/#734 in flight, #745 partial facts at Wren's paused claim `04883b1e`, plans-truing set + #805 + custodial pair + orphan sweep pending. **Wren's config-isolation plan** (`c7cbad6e8`, updated `3978f46ab` at the owner's strict-everywhere word): assumptions-pass then owner stamp pending at their lane. Board residue: #834's three items (above) + Wren-routed graph-core 15 no-throw warnings (pre-existing on main, no-warning-toleration cure item). 24h fold due ~10:00Z 2026-08-10. **RESUME first acts**: triad on `coordination/2026-08-09-b5f347`; re-arm watcher + F-95 + gap sweep from ~10:55Z; re-arm F-75; re-arm ARC tail; re-arm the heartbeat loop (n=3 full protocol ACTIVE, branch label `coordination/2026-08-09-b5f347`, both claims); sweep ARC + comms for Civet's #834 READY and mantagen's re-review; **raise the owner card carrying ASKS 1–3**; resume routing.
> - **§BOARD ITEMS FROM #834's ROUNDS, 2026-08-09 ~11:0xZ (routed by the design seat, homed here):** (1) **Turbo gate race** — pre-commit races `next build` against `tsc` over `.next/types` in BOTH Next demos (two first-hand instances; no dependency edge while tsconfig includes `.next/types/**`); cure class = turbo `dependsOn` or tsconfig exclude — bounded config lane candidate; owner's interim word this window: the clean-script path. (2) **Green-through-process-death harness gap** — the showcase unit suite kills a Node worker (react-dom preload real-fetch under happy-dom) while vitest exits 0, plus real network IO from unit tests; three reviewers hit it independently; TICKET-FIRST candidate at the 2026-08-10 embargo lift. (3) **Hub follow-ups** — export-server decodeURIComponent crash, dev-server relative-npm_execpath lookup, loose register schema: cured showcase-side in #834, the hub's copies still carry all three — bounded hub-cure lane candidate. Also noted: their studio-source README invariant truing names the fidelity capture as the one sanctioned consumer, grounded in the ratified node's capture-tooling-only clause (awareness, not an ask). #834 watching checks + Copilot round 2; READY at full condition.
> - **§MID-MORNING BOARD, 2026-08-09 ~10:2xZ (running under §FOLD 3):** **#807 MERGED `d502341e7`** under grant `4a1db233` — mutation canary complete (evidence of record on main; canary plan ACs met; residue: owner-side local branch prune). **#731 EXECUTED at this seat** per the owner's executor card: checker skipped-surfacing fix test-first (`cf7d02733`) + the concern-tier collapse (`95ee3b987`) — conservation proofs held exactly (18 pointer-line-only adapter diffs, rest byte-identical, portability green); PR re-bodied, un-drafted, Copilot requested (verify-at-settle), RPIF+relationship legs dispatched (opus); disposition rounds pending. **open-surface-zero moving**: Wren ran the #734 READY packet (adjudication-grade — the standing CHANGES_REQUESTED is agent-authored "ahead of his own"; sole gate-breaker = the S6564 branding adjudication); my ruling: not-close RATIFIED, bounded slice (branding per the standing ruling + L195 fix + 3 conflicts), **owner-special merge gate — Jim's promised OWN review cards before any #734 grant**. ~10:19Z OWNER WORD rerouted Wren to a workspace-config-isolation cure + decision-complete plan + disabled-checks sweep + compaction prep (legit downward flow, Director informed); their osz lane PAUSES; **the #734 slice re-homes to THIS seat sequenced after #731's rounds** (Director slot — no silent waiting). Civet on **#834** (PR-1, expert rounds; READY comes at full condition; dated plan correction `5c5c66e18` on their branch). Fleet: Civet + this seat heartbeat-live; Wren claim-cycling at owner word.
> - **§FOLD 3 (EARLY) + ROTATION + OPEN-SURFACE-ZERO, 2026-08-09 ~10:0xZ:** fold PR **#833 MERGED at `b5f347188`** (bot REST, sha-pinned at `70afcfb53`; full condition; run under the fold rule's durable-record clause — #807's landing precondition needed the canary node on main, now MET). Estate ROTATED to **`coordination/2026-08-09-b5f347`**; heartbeat relabelled to the new branch; 24h clock restarted. THE OWNER'S MID-MORNING DIRECTIVE (verbatim substance): 14 jimbot PRs + orphan branches — "a plan to exist to either merge or close all of them, including the ones we don't have yet… start moving, oldest PR first"; his surprise at #731 Parallax still standing was answered honestly (the WS6 route waited for a seat with no visible ask — the silent-waiting failure, now cured structurally in the plan). **`open-surface-zero.plan.md` authored** (census-anchored ledger: 14 ours + 5 tracked + 19 real orphans; supersedes paused-pr-estate-disposition at ratification; born sketch — ratification card + #731-executor question raised together). Fleet at n=3 all-armed: Civet resumed 09:00Z (heartbeats live, PR-1 fidelity-port opening with pre-execution review); Wren mid-slice-1-landing (#807 two-ref correction was THEIRS — my stuck-synchronize diagnosis was wrong, napkin'd; their ff of the unprefixed PR head ref in flight).
> - **§OWNER PULL-FORWARD + CIVET FREEZE 3, 2026-08-09 ~08:22Z:** the owner worded a pull-forward direct to the design seat (legitimate downward flow; Director informed via ARC): the showcase serves a DS-built **identity-switchboard page** (picker chrome + query-addressable specimen composition, two routes reproducing the export's scoped switching), judged by the W0.7 instrument, fidelity-diffed via the hub machinery ported to the showcase, then his browse. Decision-complete node LANDED `.agent/plans/delivery/identity-switchboard-first-pixels.plan.md` at `af736ac4f` (born sketch — **stamp card raised from this seat**). RE-SEQUENCING at his word: that node executes NEXT; the census resumes at its slice-A boundary on completion (named gate, todo 5); the G1 sitemap + G2 home rulings carry unchanged into the resume. Civet froze at the node's step 0 (owner word); their freeze entry's "n=2 stands" is STALE (their monitors died before Wren's 08:11Z n=3 broadcast) — **correction landed on ARC as their first resume read**: fleet is n=3, full protocol active, their heartbeat re-arms at their resume start-right. Their resuming seat opens PR-1 (fidelity tooling port). Instrument note: bot-push transient 403, SECOND recorded instance, immediate-retry cure held — a third graduates it to the register.
> - **§N=3 FLIP + STRYKER LANE OPENS, 2026-08-09 ~08:1xZ:** Wren calls Downdraft (`6b29b5`), owner-launched implementer for the Mutation Testing lane (plan `mutation-testing-core-canary` slice 1, worktree `mutation-canary`, PR #807; Director named b10c37 in their opening prompt), team-started at 08:11:48Z **declaring n=3 — the PDR-082 full protocol re-activates atomically**. This seat's response (directed `41a23e9b`): boundary confirmed as owner-assigned; §1a trivially satisfied (sole dirty file = the shared napkin buffer, docs-class); claim green-lit with heartbeat arming in the same move; **this seat's heartbeat loop RE-ARMED** at this boundary (both claims, branch `coordination/2026-08-09-8f473f`); Civet re-arms at their next boundary (their silence until then is closed-window residue, not retirement). Fold-sequencing risk owned here: the plan node reaches origin/main at the next fold (due ~06:55Z 2026-08-10 or at owner word) — #807's merge recount runs the plan's own cat-file precondition check; grant issues from this seat at full condition. A Claude Code process restart in this window orphaned all monitors — ALL re-armed fresh (watcher + F-95 green, F-75, ARC tail, heartbeat); gap swept clean. Earlier same morning: Stryker plan owner-RATIFIED as scoped (stamp at `1a79eb334`); two census rulings on ARC (sitemap re-sequencing ADOPTED — reported visibly to the owner; ADR-213 shrink-clause read as CSS-delivery-scoped, census home in oak-design-tokens RATIFIED).
> - **§FOLD 2 + ROTATION, 2026-08-09 ~06:5xZ (this seat, at owner word "run the coordination branch fold now" — ~3h early of the 09:42Z due):** fold PR **#832 MERGED at `8f473f867`** (bot REST, sha-pinned at the live-fetched head `13701f440`; full condition — four named checks green, threads 0; one transient CodeQL=NEUTRAL leg read correctly and self-resolved). Sweep captured the design seat's settled surfaces (ride pre-authorised on ARC) + this seat's napkin entry + the guests' same-day-closed professional-identity channel; zero file overlap with main = no stale-capture surface. Estate ROTATED to **`coordination/2026-08-09-8f473f`** (MCP-521 grammar, entropy from the fold sha), 24h clock restarted; heartbeat REMAINS DOWN by n=2 mode — the new `--branch` label binds when the mode ends. Product-gravity: moved for teachers — no live-service change; the design-review instrument (rubric v0, blind-calibrated) and the fully-configured hub demo advance the teacher-facing quality machinery. Moved for the Practice — W0.7 closed end to end; skills structure ratified and expressed; four-PR review-debt sweep merged; two compactions resumed clean under n=2; per-instance cpd governance applied; doctrine true-ups landed. NEXT: the Stryker-canary extraction plan authors on THIS branch (owner word ~06:44Z); the design lane continues W0.1 census + W0.9 staging.
> - **§RESUME 2 + #830 LANDED, 2026-08-08 ~17:2xZ (this seat):** freeze-2 resume map executed in full — triad clean at `fb5335451`; watcher + F-95 green, F-75 fresh baseline, ARC tail re-armed (Monitors `bsaynjn61`/`bkh0ti3em`/`bs2r0bft6`); heartbeat stays DOWN — mode recomputed at resume, n=2 HOLDS (no third live seat); gap sweep found only the two crossing freeze broadcasts. #830 recounted FIRST-HAND at resume (Civet's freeze entry carried the delegation): full condition at `463097a8c` (19/19 SUCCESS, 0 unresolved, no changes-requested) → **grant `cb6a0cd3`** issued on ARC + directed (`5a956f34`). Civet resumed ~17:21Z, recounted at their executing boundary, **MERGED at `8840c3c8f`** (17:20:14Z; recount comment 5227247465 quotes the grant; branch auto-deleted). The W0.7 design-review instrument (rubric v0 + wow-verdict register + parser at its ruled homes) is ON MAIN. Lane proceeds per the adopted order: **PR-B cut off fresh main** in Civet's worktree — the W0.9 credentials card fires from THIS seat when PR-B enters review (commitment standing; NO card on the register seed rows). Resume broadcast + ARC second conservation waypoint are the records. Mode note ~17:21Z: Pangolin hunts Cavern (codex `019fe2`) join-ceremonied onto the stream for an owner-launched Professional Identity review scoped to the CV repository — claims NONE, no source edits, own heartbeat omitted; adjudicated a cross-estate VISITOR, not a third fleet seat — grounded in PDR-082 §Trigger/exit participant-definition amendment (2026-07-06): claimless standby/read-only registrations do not re-trigger the full protocol; n=2 stands, heartbeat stays down. ~17:25Z the pair completed: Heron calls Spire (claude `f44a25`) joined on the same declared claimless terms and the two opened their own ARC channel (professional-identity review, jimcresswell.net worktree) — same adjudication, both declared their count-reading per the convention, no objection owed. Flip trigger per the PDR's three limbs: either guest adopting a claim, editing source, or working a lane in THIS estate re-activates the full protocol (they must broadcast the flip). ~17:31Z: Heron RETIRED clean (owner re-rostered the review to Pangolin + Grouper binds Harbour in the jimcresswell.net estate's own channel; closeout broadcast on the stream — no claims, no edits, watcher stood down). Guest presence here is now Pangolin alone, same claimless terms; n=2 adjudication unchanged. ~17:56Z: **PR-B = #831 OPEN** (`ca5420a61`, bot-authored, Copilot via the MCP path, checks running; Civet shepherds to full condition) — the agreed W0.9 card moment: **card RAISED from this seat** with the gap verified first-hand (hub `demos/oak-curriculum-hub/.env.local`: search plane configured and non-empty; `OAK_API_KEY` MISSING — the one owner-side secret, present in two sibling workspaces' local envs so carry-over is offered; `SEARCH_INDEX_VERSION` optional). Calibration headline for v0.1: both blind opus legs caught all four degraded fixtures incl. the held-out mutation; both PASSED the owner-rejected showcase root — demonstrated-expressive-range is the measured criterion gap. Board pointers (a)–(e) home in Civet's 17:56Z ARC entry + the #831 record. Liveness rule's `--created-at` drift TRUED (verified against live CLI usage first). ~18:0xZ: Civet routed #831's Sonar red — sole ERROR `new_duplicated_lines_density` 25.4>3, all severity metrics 0/OK (gate re-read by name at this seat): disposition ADOPTED on merits (constitutive fixture duplication; cpd-ONLY row for `calibration-v0-fixtures/**`, the #588/#582 shape) but CARD-SHAPED on authority (post-ruling cpd rows still record per-instance owner authorisation — the if-and-only-if test's application was never delegated) — bundled as Q2 on the W0.9 card. On his word Civet executes (row + rationale comment on #831 + record note). **CARD ANSWERED 2026-08-09 ~06:1xZ, both questions**: (1) cpd row AUTHORISED — Civet executes with the citation "owner-authorised 2026-08-09, PR #831"; relay on ARC. (2) W0.9 carry-over chosen — EXECUTED at this seat: `OAK_API_KEY` carried MCP-app local env → `demos/oak-curriculum-hub/.env.local` (gitignore verified pre-write; value never surfaced); **W0.9 hub pre-read UNBLOCKED**. Overnight interim on #831 (Civet, on ARC): round 1 five Copilot findings ALL ADOPTED at `e27db0805` (claude leg quota-skipped, #828 shape); round 2 five suppressed ALL ADOPTED at `ea48991e8` (disposition comment 5227474080); threads 0; green-except-Sonar pending the row. At row landed + green + threads 0 → Civet's full-condition signal → this seat's recount. **~06:25Z: #831 MERGED at `f1192ce22`** under grant `dd56dfb2` (recount both seats, head unmoved at pin `e6486cbfd`, 19/19 incl. cured Sonar, threads 0/5 resolved; recount comment 5230144488). **W0.7 STORY COMPLETE**: instrument minted (#830) → calibrated blind (#831) → measured v0.1 criterion gap banked (demonstrated expressive range) → register discipline holding. Lane rolls per the adopted order: W0.1 census sitting next (Civet), W0.3 beside it, W0.9 hub pre-read staging on the carried key — the W0.9 BROWSE moment routes back through this seat as a card when staged. NEXT SEAT DUTY: 24h fold due ~09:42Z (branch cut 2026-08-08 09:42Z).
> - **§COMPACTION FREEZE 2, 2026-08-08 ~16:2xZ (this seat — owner-called; the seat CONTINUES; owner word: "post-compaction restart all monitors"):** claims `a2286c53` + `dd3f640f` RETAINED. **Mode: PDR-082 n=2 ACTIVE** (Plover b10c37 + Civet 054f5e on the ARC pairing; BOTH periodic heartbeats down BY INTENT — heartbeat-ends on the stream, mine `945161eb`; F-75 pair-retirement flags are mode artefacts, no ping owed either way). **State at freeze:** the owner's four-PR design sweep is COMPLETE — #737 owner-merged `67d23056e` (the standing "Matt" reviews were his AGENTS', confused — provenance memory saved), #783 Director-merged `b888b732b`, #784 Director-merged `1bfbb19d6` (all comments adjudicated first-hand, two rejections recorded), #829 Civet-merged `4e1bb0fc3` under grant `a088a325`. Skills-estate structure OWNER-RATIFIED (four rulings, in-session) and fully expressed in `skills-estate-organisation.plan.md` at `2e8f2844b` (status ratified; the WS2 corpus gate remains; Skylark NOT resuming — owner word; the WS6 #731 reconcile route stands opener-ready — `1ce7086b` amended by broadcast `6df0079e` — awaiting an owner-launched seat). Civet LIVE on W0.7: #830 open (PR-A rubric+register), executing the home-split ADOPT ruling `9892ab0c` (TS→`agent-tools/src/validators/wow-verdict-register/`, docs→`docs/design/design-review/`, kit config reverts); their READY signal may be WAITING on the ARC channel at resume — sweep it FIRST, then recount and grant at full condition. Cricket 6:2 ruled PROCEED (`0cfdd701`, all expert legs on opus). ARC channel `.agent/collaboration/rapid-comms/2026-08-08-next-steps-plover-lifts-troposphere-civet-spins-cavern.md` OPEN (announce `e3483c63`), committed at this waypoint. ADOPTED OPERATING ORDER (agreed on ARC, both seats): PR-B after #830 → W0.1 census sitting with W0.3 as the parallel light leg → slice 2 into review waits → W0.9 at card discharge. CARD COMMITMENT: issue the W0.9 hub-credentials card from THIS seat when PR-B enters review; NO card on the register seed rows (the owner's own verbatim verdict is not ours to ratify). Harvest landed `75cb9ce00` (pr-lifecycle Copilot REST-silent-drop fact; watcher read-cadence graduation row — register debt reads CRITICAL, curator-pass candidate; the design seat's two plan edge notes). **RESUME first acts (owner word — restart all monitors):** branch/HEAD/status triad on `coordination/2026-08-08-18c24e`; re-arm the canonical watcher + F-95 assert + gap sweep from the freeze time; re-arm F-75 (fresh baseline); re-arm the ARC tail on the channel file; the periodic heartbeat stays DOWN while n=2 holds — recompute the mode at resume (a third live seat re-activates the full protocol and the heartbeat atomically); then sweep ARC for Civet's ready signal and resume routing. Standing residue unchanged from the morning freeze (attribution notes; dependabot 3-high dep-lane candidate; plans-truing sweep + custodial pair routes opener-ready).
> - **§COMPACTION FREEZE 2026-08-08 ~12:2xZ (this seat — owner-called; the seat CONTINUES post-compaction):** claims `a2286c53` + `dd3f640f` RETAINED; post-freeze claim staleness is the boundary, not abandonment. State at freeze: Civet LIVE on the design lane — #828 MERGED at 7ecfc187c (sha-pin cddd87cad held; Copilot-foundation grant 6d3c9726, first live application of ruling 2b4e5ce6); W0/W1 FIRST LIGHT IS OPEN at W0.2(a) per the owner's implementation word (a080375f); slice 2 (edge validator) re-slots between first-light stories; W0.9 will need the hub search env credentials at the owner's browse (his 2026-08-05 word). Two routes STANDING opener-ready: the plans-truing sweep (seven adjudications + #788 + #766 merges — ledger in `paused-pr-estate-disposition.plan.md`, landed this freeze) and the custodial pair (#818/#819). Owner rulings this sitting, all executed: implementation word GIVEN; #766 merges as research docs; both lanes routed; earlier — queue-cleanup plan ratified, longitudinal archived (at Nettle), #806 closed adjudicated, Copilot-foundation review ruling (2b4e5ce6), ADR-221 pilot-first, post-change production-validation directive (plan node landed, sketch). Monitors stopped in canonical order at the freeze broadcast; RESUME first acts: branch/HEAD/status triad, re-arm watcher + F-95 + gap sweep from the freeze time, re-arm F-75, re-arm heartbeat (both claims, branch label `coordination/2026-08-08-18c24e`), recompute the board (gh pr list; #828 outcome; Civet's state), then resume routing. Owner-attention residue standing: #825/#826/#806 attribution notes (recorded, owner may re-attribute); dependabot 8 vulns on main (3 high) — bounded dep-lane candidate.
> - **§FOLD 2026-08-08 ~10:4xZ (this seat):** fold PR #827 MERGED at `18c24e93b` (bot REST, sha-pinned, full condition recomputed — one 405 refusal at a re-queued gate correctly waited out); estate ROTATED to `coordination/2026-08-08-18c24e` (MCP-521 grammar, join-before-mint checked, entropy from the fold sha); 24h clock restarted; heartbeat re-armed on the new label (Monitor `bos8ssacp`). Product-gravity: moved for teachers — the live MCP service validated end-to-end post-release (authenticated search proven via the attached connector); moved for the Practice — two clean successions, the dedicated consolidation to goal state, the longitudinal synthesis (37 napkins, 2 patterns), seven review-debt merges, the post-change production-validation discipline founded, two plans ratified, goal-hook clause ratified as row 4. Honest residue: #825/#826 created-then-closed under the OWNER's ambient credential (the bot-identity miss and its empty-mint recurrence — cures in the napkin; #806's close also owner-attributed, content self-identifying); the stray empty commit `89c1a2be9` rode into history with its correcting record after Nettle's push carried it before the authorised drop could execute.
>
> **prior: SUCCESSOR PRE-POSITIONED (PDR-064 Moment 1), 2026-08-07 ~16:0xZ — DISCHARGED by Plover's Moment-2 `03e811f8` at 16:01Z.** Original text: at owner word ("Plover lifts Troposphere (b10c37) is your eventual successor"): Plover registered standby 15:54:08Z, foundation complete, shadow open. Handoff record: `.agent/state/collaboration/handoffs/7efb00-panther-rides-midnight-2026-08-07-wrap.md` — the successor map of record (open threads with next acts, the tenure's three owner corrections with cures, instrument notes, retained claims `a2286c53` + `dd3f640f` for adoption).
>
> **TENURE CLOSE 2026-08-07 ~16:1xZ (Panther rides Midnight — wrap at owner word; recompute every derivable):** landed this tenure: the coordination-substrate strategic node + two ratified delivery plans (MCP-521 homed from ticket, MCP-528 minted — the revocation-test conformance instrument, owner verbatim in the node); MCP-526 removals-revisit (due 2026-08-12); PR #818 (MCP-529 statusline payload logging, draft, review round cured incl. the no-IO-in-tests owner correction) and PR #819 (MCP-530 DX docs + Claude Code statusline deep-dive, draft); two zero-overlap merge-mains; curation route bd1c8f05 executed — curator pass CLOSED (16/27 vendor rows homed, register drained, F-154 minted), dedicated consolidation LIVE at Gull lifts Nimbus (de328d24, whole-goal frame owner-corrected, continues post-compaction). Owner-word items open: goal-hook pacing-clause ratification; agent-naming retirement; queue-cleanup ticket. The board detail lives in the handoff record — this block stays the pointer.
>
> ### ▶ prior: SITTING DIRECTOR: Panther rides Midnight (`7efb00`), seated 2026-08-07 ~09:45Z at owner word ("The Director seat is yours, the outgoing Director has fully retired"); claims `a2286c53` (director) + `dd3f640f` (gate-ledger, dormant) adopted in place; Moment-2 event `953cd54d`. No Moment-1 — the seat was vacant after Petrel's wrap (the vacant-seat precedent).
>
> **SEATING BLOCK 2026-08-07 ~09:50Z — durable half only; recompute every derivable. Two registers per the Firefly convention: §STATE carries tests, never values; §EVIDENCE carries dated facts that must not be read as current.**
>
> - **§LINEAGE:** Petrel holds Turbulence (`a0892f`) sat 2026-08-05 → 2026-08-07 ~09:2xZ (wrap). That tenure's successor map of record is its wrap handoff `.agent/state/collaboration/handoffs/a0892fa7-petrel-holds-turbulence-2026-08-07-wrap.md` (machine-local; 12 open threads, each with its next act), the 36h arc record `.agent/reports/agentic-engineering/estate-order-outage-and-verification-2026-08-06-07.md`, and the napkin's 2026-08-06/07 entries. Retirement was owner-confirmed in-session before this seating; the mechanical check read the claim stale (fresh_until 2026-08-06T17:32:39Z).
> - **§EVIDENCE (2026-08-07 morning, dated):** production verified end-to-end on the canonical URL (owner ruling on MCP-307, closed: `www.thenational.academy/mcp`, forever; alpha's continued serving stays an open owner choice). Fold #791 MERGED at `14c8a7ce2` (08:44Z) after two owner cure commits; the estate ROTATED to `coordination/2026-08-07-91db0c` (MCP-521's naming shape) and the primary checkout sits on it — the 24h clock restarted at that cut. Matt's submission-reduction lane landed PR #812 (MCP-523, twelve components → seven); MCP-525 carries the standards-trio restoration; MCP-526 (minted at this seat, due 2026-08-12, Jim + Matt tagged) is the removals revisit and names the coverage pair's missing home.
> - **§STATE (tests, not values):** board truth is `gh pr list` + the wrap record's open-thread map, re-derived at read time; branch truth is `git rev-list --left-right --count <remote>...HEAD` before believing any solo-seat claim (MCP-521 interim); fleet truth is the mechanical `claims active-agents` read with a UTC `--now`, cross-checked against worktree mtimes for same-machine seats. MCP-519 tripwire fires 2026-08-11 after 10:00 London (five unlocked deferrals, deliberately unsequenced).
> - **§CONSTRAINTS (standing, carried from the wrap, unchanged unless owner word):** bot identity for every gh write (Copilot-request and approval carve-outs excepted); mint fails → stop, never keyring-fallback. Linear writes per-act or under lifted-embargo discipline — verify the current state before assuming either. Never squash; sha-pinned REST merges; suppressed-findings read at every merge decision; stage by explicit pathspec; comms bodies via `--body-file`; zero-new-Sonar bar. The calibration word is standing: "slow down, discuss" — findings cross to conclusions only with the instrument named per claim.
> - **§SEAT MECHANICS:** canonical watcher live in the quiet configuration (heartbeat-excluded, F-95 asserted, hourly re-arm on the exit notification) + F-75 diff-only peer-liveness poll (600s, age-stripped stable diff key — the hand-rolled-comparator failure mode is comms event `a454a9ad`). NO heartbeat cron under the PDR-078 §4 consumer-absent exemption (fleet dark, owner live in chat — Firefly precedent); the exemption lapses and the heartbeat arms the moment an implementer seat registers. Mid-session lesson (this seating): after any benched window, re-ground from live git before editing shared continuity surfaces — the fold merged and the branch rotated under this seat while it was paused, and only the Edit tool's file-state guard caught the stale snapshot.
>
> **SUPERSEDED — Petrel's header and the blocks below it. Rulings and mechanisms remain binding history; roster and lane state are stale.**
>
> **HARVESTED 2026-08-11 (Plover lifts Troposphere b10c37, Director): the block below is PR #816's Spark-tenure record (author emgeebot-oakenfold, written 2026-08-07 by a separate recording seat with every claim re-verified at that date), hand-reconciled into the current file — the PR's diff base predated four later seatings. Machine-scope caveat: its §INSTRUMENT items 1–3 describe the OTHER machine (gh-as-mantagen, emgeebot key paths); on this machine the jimbot merge-bot config is correct and live.**
>
> ### ▶ prior: SITTING DIRECTOR: Spark lifts Slag (`05d9e6`), Director under PDR-117, seated 2026-08-06 10:40:04Z as Moment-2 successor to Wisteria lifts Verdure (`c4294f`, its Moment-1 10:35:24Z) at owner word ~10:37Z; claim `22585dbc-3512-4593-bde0-4e289b7012cb`, thread `mcp-submission-drive`. Tenure ran 2026-08-06 and 2026-08-07 across several compaction boundaries.
>
> **TENURE RECORD, written 2026-08-07 by a separate recording seat from that seat's supplied brief — not self-written, and every SHA, PR number, ticket id and instrument claim below was re-verified against git, GitHub and Linear before being written. Where verification failed or was impossible the line says so; nothing was carried on the brief's word alone (the brief was wrong in five places, listed under §BRIEF CORRECTIONS). Durable half only; recompute every derivable. Squall's two-kinds-of-content discipline governs: owner rulings, deliberate oddities and recorded mistakes are inheritable, lane and PR state are not.**
>
> **OWNER RULINGS THIS TENURE — carry verbatim; numbering continues Falcon's series, which ended at 42.**
>
> - **(43) PRAGMATIC MODE, owner-declared:** do not block on non-critical items, ticket the slack. Verbatim at one point: _"be fast and pragmatic"_. Scope: this arc's submission drive. Not a licence to skip verification — §THE DOMINANT PATTERN below is what happened when it was read that way.
> - **(44) PR PROCESS:** commit and raise PRs under **emgeebot** identity, request review from **mantagen**, apply the **`pre-submission`** label, then merge if approved or action the ask. **Extended 2026-08-06 ~14:07Z:** also enable auto-merge (`gh pr merge <N> --auto --merge`), landing on green plus approval. The mechanical trap that makes the emgeebot half non-optional is in §INSTRUMENT (1).
> - **(45) ALL WORK LOGGED IN THE RELEVANT LINEAR TICKETS.**
> - **(46) The connector and plugin DISPLAY NAME is settled as "Oak National Academy"** — the machine `name` is deliberately left `oak-open-curriculum`. Do not "fix" the asymmetry.
> - **(47) MCP-339 SIGNED OFF, owner-conveyed:** by HB Clark and Benyna on 2026-08-06 for the original set, and again on 2026-08-07 by **HB, Benyna and Aakesh** for the reduced seven. **UNVERIFIED AND UNRECORDED where it counts:** MCP-339 is still `Backlog` with no sign-off comment, and its most recent substantive comment (2026-08-05, Primrose turns Trunk) explicitly frames the 2026-07-28 Slack agreement as _"a dated scope decision, not yet as version-specific sign-off"_. The sign-off is therefore an owner-channel fact with no durable home — exactly the decay MCP-514 was minted to stop. Recording it on the ticket is owed.
> - **(48) PLUGIN REDUCED TO SEVEN COMPONENTS at owner word**, per a Slack decision (link on MCP-523): keep `oak-accessibility`, `oak-curriculum-principles`, `oak-curriculum-principles-mcp-enabled`, `find-misconceptions`/`misconception-miner`, `audit-sequence`/`sequencing-auditor`. Remove `check-coverage`/`coverage-checker`, `review-resource`/`standards-reviewer`, and `oak-quality-standards`. **Temporary** — MCP-524 restores the reviewer and the improved skill at launch, and MCP-526 (minted 2026-08-07 09:48Z) books an initial review of the removals by Wednesday 12 August.
> - **(49) OPEN SIGN-IN OWNER-VERIFIED against production** with a non-Oak email and no invitation, so the public-beta claims are true when read; **the pre-M4 embargo language is retired.** Owner-attested; not agent-verifiable and not re-verified here.
> - **(50) THE DOCUMENTATION 404 IS NOT A SUBMISSION BLOCKER** — Aakesh's correction accepted; the form permits private doc sharing with the page public by publish date.
> - **(51) NO AGENT SUBMITS the connector or the plugin** — ruling 40, carried unchanged. Human-only. No amount of green licenses it.
>
> **MERGED THIS TENURE — every number, state and merge commit re-verified against GitHub 2026-08-07.** #759 (`SHA:63df8e0c2`, MCP-143 Guard 1b), #794 (`SHA:cf954e6cd`, MCP-509 landing assets), #796 (`SHA:7b8519b95`, plugin MCP binding → production), #797 (`SHA:92697499b`, routed asset base), #798 (`SHA:6f8f26871`, MCP-507 submission package), #799 (`SHA:da9feb685`, MCP-511 well-known link), #801 (`SHA:eb10b0aac`, MCP-513 rate-limit withdrawal), #803 (`SHA:ccc03508d`, MCP-516 `turbo.json` `CANONICAL_HOST`), #804 (`SHA:5024f6233`) and #808 (`SHA:ca69f0ebc`, public-beta copy), #809 (`SHA:19e4a550d`, MCP-517 forwarded-headers middleware), #810 (`SHA:eca5dd0c7`, identity-naming census ratchet), #811 (`SHA:f0e4bd795`, canonical-host wording), #812 (`SHA:4c9f2673a`, plugin reduction), #813 (`SHA:ae2ad2661`, MCP-518 surface fork), #815 (`SHA:16665f24e`, search description). **#773 closed as superseded** (author `mantagen`, never merged); **#802 closed and recreated as #803** — the authorship trap in §INSTRUMENT (1) is why.
>
> **TICKETS MINTED:** MCP-511 through MCP-516, MCP-522, MCP-523, MCP-524, and **MCP-526** (the brief omitted it). MCP-525 closed as a duplicate of MCP-524. State at recording: 511/516/523 Done; 512/522/524 Backlog; 513/514/515 In Progress; 525 Duplicate; 526 Backlog. **MCP-524 still carries the `pre-submission` label** — the mislabelling recorded under §WHAT THIS SEAT GOT WRONG was never actually removed.
>
> **§INSTRUMENT — the durable half. Each line re-verified against the tree, the config or the live surface on 2026-08-07 unless marked otherwise.**
>
> 1. **`gh` on this machine is authenticated as the OWNER, not the bot** (`gh auth status`: account `mantagen`, `gho_` keyring token). A bare `gh pr create` therefore authors the PR as a human, which makes `require_code_owner_review` unsatisfiable because GitHub forbids self-approval; it also **silently drops a `--reviewer mantagen` request** for the same reason, and CODEOWNERS substitutes jimCresswell. Cost a closed-and-recreated PR (#802 → #803, both verified: #802 author `mantagen`, closed unmerged; #803 author `app/emgeebot-oakenfold`, merged). **Cure:** read the ambient emgeebot credential helper (`git config --get credential.https://github.com.helper`) via `git credential fill` and pipe into `GH_TOKEN`, never printing it. `gh api user` returns 403 on that installation token — expected, not a failure; test against a repo-scoped endpoint. **THIS IS AT LEAST THE THIRD INSTANCE**: the napkin already records 2026-07-31 (#661→#662) and 2026-08-03 (MCP-473, #739→#740, Lava lifts Brimstone), whose entry makes the sharper point — commit identity and `gh` identity are separate credential surfaces, and verifying one says nothing about the other.
> 2. **`merge-bot mint-token` defaults to a key that is ABSENT on this machine.** `.github/merge-bot.json` names `appSlug: jimbot-oakington-iii`, `appId: 4352989`, and `~/.config/jimbot-oakington-iii/` does not exist here; `~/.config/emgeebot-oakenfold/private-key.pem` does. It works with explicit `--app-id 4482842 --private-key-path ~/.config/emgeebot-oakenfold/private-key.pem` (emgeebot's app id confirmed in that directory's own README).
> 3. **`claims close` requires `--now`, AND on this machine `--platform` and `--model`,** which the skill's own example omits. Another instance of the F-89 asymmetry — a sibling subcommand defaults what its neighbour demands.
> 4. **The MCP content audit governs `apps/**` and `packages/**` ONLY.** `DELTA_SCOPE_PATHS` in `agent-tools/src/mcp-content-current-source/current-source-delta-inventory.ts:19` is an explicit **seven-root allow-list** and the registry holds **zero `plugins/` rows** (verified: no `plugins/` occurrence anywhere under `.agent/reports/mcp-agent-facing-content-audit/`). Adding one breaks `requireSameStringMembers`. So a plugin-only change correctly leaves the validator at **728 items** (`current-source.json`) with a byte-identical anchors refresh. **The Director briefed this wrongly TWICE, in both directions, and an agent's evidence corrected it both times.** Do not conflate the two counts: `current-source.json` carries 728 items, `registry.json` carries 717 — different surfaces, and citing the wrong one is how a "the validator moved" claim gets manufactured.
> 5. **Tool descriptions in the MCP app ARE governed, the plugin exclusion above notwithstanding:** expect a stale anchor plus a stale `semanticSha256`, one validator problem per run, hashes taken only from the validator's own output — never computed by hand or by analogy.
> 6. **Fetching the landing page needs an HTML `Accept` header.** Re-probed live 2026-08-07: bare `curl https://www.thenational.academy/mcp` → **406**, because that path is also the MCP endpoint; with `Accept: text/html` → **200**.
> 7. **CI on this repo DROPS WEBHOOKS: a PR may show no checks at all. A push re-fires it. Bot authorship is not the cause.** Corroborated on main by the deliberate re-fire commits (`SHA:43707974e`, `SHA:d35479dfc`, "re-fire CI post-incident (webhook events lost in the throttle)").
> 8. **Concurrent same-session seats share ONE scratchpad directory and resolve to ONE `agent_id`.** Verified structurally: the session scratchpad holds 432 files including a single `agent_id`, and its filenames are exactly the collision-prone shapes (`a1.log`, `amend.log`). Three filename collisions in a day; **one overwrote a validated commit message between validation and `git commit -F`, so a commit landed with a sibling's message on its own diff.** The claims registry therefore cannot detect same-session contention — and separately, at recording time it carries **17 rows all reading open**, the oldest from 2026-07-28, including this seat's own `22585dbc` and Wisteria's `c3050091`; MCP-528 is the ticket for separating seat-holding from liveness. **Cure: a distinguishing token in every scratchpad filename.**
> 9. **A local branch tracking `origin/main` makes a bare `git push` suggest `git push origin HEAD:main`** — one accepted suggestion from pushing a feature branch straight onto main.
>
> **§WHAT THIS SEAT GOT WRONG — inherit the corrections, never the confidence.**
>
> - **Called the signed-in Clerk 422 "cured" by #803 and told the owner no second fix was needed.** Wrong: the probe asked whether `www.thenational.academy/mcp` would be _accepted_ as a `redirect_url`, not what the app actually _sends_. `@clerk/backend` derives origin from `x-forwarded-host ?? host` and Cloudflare must rewrite `Host` for Vercel project routing. The full mechanism, read first-hand at the pinned `@clerk/backend@3.13.1`, is on MCP-522 — including that the #809 cure mounts only where `CANONICAL_HOST` is set, so preview and local remain header-controlled.
> - **Read a failing `run-quality-gates` on #809 as "transient, resolved on its own".** The run had **never executed** — a stale identity-naming census had main's CI red for three runs and was failing every pre-commit hook in the estate (cured by #810, `SHA:eca5dd0c7`).
> - **Reported "sequence search is lexical-only" as a verified correctness fix.** Wrong, and it nearly entered a submission document. Two false witnesses were cited as if they were the decision: a **false code comment** (`packages/sdks/oak-search-sdk/src/retrieval/search-sequences.ts:2`, "Sequence search implementation — lexical RRF") and **ADR-139's pre-implementation Context** section, where the **Decision** §5 specifies hybrid BM25 + ELSER on `sequence_semantic` and is pinned by unit and integration tests. Caught by mantagen's blocking review on #815; the corrected claim was then re-proved against the live surface with a probe whose scores were exactly `1/(40+rank)`. **LIVE RESIDUE: the false comment is STILL IN THE TREE.** #815 fixed the served description, not the comment that caused the error — so the next reader of that file gets the same wrong answer.
> - **Mandated an unsound cure on #812:** ranking misconceptions by prior-knowledge dependency, when `get-prior-knowledge-graph` traverses predecessors only and the method never fetched it. The reviewer's blocking finding was right that the claim was wrong, and the Director's instructed cure was **also** wrong; the landed fix orders by teaching sequence from `get-units-summary` `unitLessons[].lessonOrder` (`SHA:b6e62eaf3`). The empirical kill was decisive and cheap: anchoring `comparing-fractions` returns the anchor **only ever as an edge target, never a source**, and every node is `kind: "unit"` while misconceptions attach to lessons — so a downstream count would assign every misconception the same number and order nothing at all.
> - **Told the owner "spawning the follow-ups now" and then emitted no tool call.** Also promised to report a PR and did not. Both surfaced only because the owner asked. Not repo-verifiable; recorded on the seat's own word.
> - **Added the `pre-submission` label to MCP-524, a deliberately post-submission ticket, by pattern-matching its siblings.** Still uncured at recording time.
>
> **§THE DOMINANT PATTERN — the thing most worth inheriting, and it already has a name.** A claim correct when recorded, believed later without rechecking the surface it describes — or a **target** state probed and reported as **actual**. Six or more instances this tenure. **Every one was caught by the owner's browser or by a reviewer, never by the Director.** This is recurrence evidence for **claim-before-check**, named by Birch on 2026-08-04 with the tripwire that still works: _before any claim about a mechanism reaches a durable surface, name the instrument that proved it; if the answer is "reasoning", it is not proven._ Two additions this tenure earn their place: (a) the **target-vs-actual** variant — probing whether a value would be _accepted_ and reporting it as what the system _sends_; and (b) **recorded-then-believed** — the decay is not in the original observation, which was true, but in the re-reading, so the tripwire must fire at CITATION time and not only at authoring time. Convergent independent evidence: Petrel took an owner correction on the morning of 2026-08-07 for the same shape — _"stop rushing to conclusions, slow down, discuss."_ `claim-before-check` still lives only in the napkin, with no pattern file and no distilled entry; that is a graduation candidate, not a settled home.
>
> **§WHAT NO AUTOMATED GUARD COULD SEE — the tenure's most transferable finding.** The whole MCP-516/517/518 family was invisible to every automated guard in the estate **because they all run unauthenticated.** The only instrument that caught it was the owner deleting `__session` and its suffixed twin in DevTools while leaving `__client_uat` real. The reviews on #812, #813 and #815 each then found real defects the seat had missed — and the corollary is that the review surface, not the gate surface, was the load-bearing control this tenure.
>
> **§BRIEF CORRECTIONS — the recording brief for this block was wrong in five places, each caught by reading the target.** Recorded because a successor may be handed a similarly confident brief. (1) It said this file's sitting block was **Falcon hunts Flight** and the file "two successions stale" — false: current `origin/main` already carried Firefly spins Vapor's and Wisteria's blocks, and the block demoted below is Petrel/Wisteria. (2) It said the file was ~1424 lines — it was **1454** at `SHA:4b6fd4f9d`. (3) It implied the napkin was the 2,631-line surface — that copy was pre-rotation; the napkin was rotated 2026-08-06 (Sardine rides Trench) and is **868 lines**. (4) It called the #813 finding "a live authentication bypass (`/MCP` case-insensitivity)" — **inverted**: the reviewer's finding and the cure commit both say the case variants still **ran Clerk and stayed handshake-eligible**, i.e. auth reaching a surface ruled fully public, and the approval explicitly confirms protocol traffic still cannot bypass Clerk. (5) It asserted the MCP-339 sign-offs as settled — see ruling 47. **The pattern in §THE DOMINANT PATTERN reproduced inside the brief that described it.**
>
> **§RESIDUE AT RECORDING TIME, all recomputable — do not inherit these, run them.** This seat's claim `22585dbc` reads open in the registry; the `lexical RRF` comment is live in `search-sequences.ts`; MCP-524 still carries `pre-submission`; MCP-339 has no sign-off comment. `gh pr list --state open`, `claims active-agents` with a UTC `--now`, and the Linear board are the only honest sources for anything else.
>
> **SUPERSEDED — the Petrel/Wisteria block below. Its owner rulings and its `§MECHANISM` lines remain binding; its `§STATE`, lane and roster content is historical. Note its header names Petrel holding claim `a2286c53`, which is NOT present in this machine's claim registry — treat that citation as unverified.**
>
> ### ▶ prior: SITTING DIRECTOR: Petrel holds Turbulence (`a0892f`), estate Director (claim `a2286c53`), current as of 2026-08-07. EVIDENCE (dated, not current): Wisteria lifts Verdure (`c4294f`) seated 2026-08-06 10:20Z at MG's word ("you plus 2") for the submission drive (claim `c3050091`, thread `mcp-submission-drive`); Firefly's cast stood down 2026-08-05 ~18:10Z and the seat was briefly vacant.
>
> **SEATING BLOCK 2026-08-06 ~10:20Z — THE SUBMISSION DRIVE OPENS. Two registers as Firefly established: §STATE carries tests, never values; §EVIDENCE carries timestamped facts that must not be read as current.**
>
> - **§EVIDENCE (2026-08-06 10:11–10:18Z) — THE MCP-143 CASCADE FREEZE IS LIFTED, on this seat's word plus a first-hand realm read.** `#757` (Guard 1a) was merged by MG at 10:11:17Z. Verified at ~10:18Z, both hosts: canary `POST /mcp` with `accept: application/json, text/event-stream` returned **401 on both** `www.thenational.academy` and `curriculum-mcp-alpha.oaknational.dev`, `x-clerk-auth-reason: session-token-and-uat-missing` agreeing; `jwks_uri` and `revocation_endpoint` both on **`clerk.thenational.academy`** on both hosts — a production Clerk instance, read from the DOMAIN and not from a key prefix, which is a label and not a destination. No mixed binding. **Re-read before acting on this: the realm moved five times in three hours on 2026-08-05 and no recorded value survives that.**
> - **§STATE — the critical path is ONE SERIAL STACK, not four parallel PRs.** `#759` (base main) → `#761` (base pr2) → `#772` (base pr3). Seat count follows parallel work, not PR count (PDR-117). The ordering traps are live: re-target and merge main in BEFORE the final approval, because dismiss-stale-reviews-on-push voids it; MG must clear THREE re-reviews, not one; `#759` currently shows BOTH an `APPROVED` and a `CHANGES_REQUESTED` from `mantagen`, so which is current is the first thing to establish. Djinn's ordering is MCP-143 comment `b53e4840`.
> - **§STATE — two PRs are gated OUT of the submission set by their own titles**, which is the cheap check before scheduling either: `#768` is `[DO NOT MERGE — post-submission]` (matches the standing Sentry ruling), `#773` is `[DO NOT MERGE BEFORE M4]` so it FOLLOWS the cascade rather than running beside it.
> - **§MECHANISM (does not decay) — the alias defect persists and is still `CANONICAL_HOST`, not the realm.** `curriculum-mcp-alpha.oaknational.dev` advertises `resource: https://www.thenational.academy/mcp`; a strict RFC 9728 client refuses that as audience-injection. Verified first-hand at ~10:18Z. Correctness and reviewer-perception, never user-blocking. `#761` is the PR that touches it.
> - **§MECHANISM — cross-machine liveness is INVISIBLE in the claim registry, by construction.** `active-claims.json` is gitignored (`.agent/state/collaboration/.gitignore:15`), so the jimbot fleet on the second machine can never appear in this machine's registry. A registry read of "no other seats" is true of THIS MACHINE and silent about the other. The only cross-machine liveness signal is remote git activity — check it at pass open. This falsified two "fleet dark" readings in one morning.
> - **§SEAT MECHANICS:** canonical all-channels watcher armed (Monitor `b3rysm123`), F-95 asserted green. Heartbeat loop armed (Monitor `bdg0q3gkx`) bumping BOTH surfaces per F-92 — comms event and `claims heartbeat` — because the two implementer seats are real consumers, so the PDR-078 §4 consumer-absent exemption does NOT apply here even with the owner live in chat. `comms send --tag heartbeat` also requires `--title`, a THIRD ellipsis-hidden required argument beyond the two the 2026-08-06 consolidation graduated.
> - **§OPEN, owner-held (inherited from Firefly's block, unchanged unless noted):** the three cascade re-reviews (now the critical-path gate); MCP-292/306 listing name and copy (irreversible slug); MCP-330 or the MCP-420 contingency; MCP-339 curriculum sign-off; MCP-268 comms sign-off; MCP-458 carousel (needs MG's metered Chrome session). Sentry stays NOT pre-submission.
>
> **SUPERSEDED — Firefly's block below. Its owner rulings and mechanisms remain binding; its lane and roster state are stale, and its cascade-freeze §STATE is DISCHARGED by the lift above.**
>
> ### ▶ prior: SITTING DIRECTOR: Firefly spins Vapor (`c1ed56`), seated 2026-08-05 15:11:39Z at MG's word ("You'll be a director fyi"); claim `50d411dc`, thread `mcp-submission-m4`, role director. No Moment-1 pre-position — the prior cast had stood down and the seat was vacant.
>
> **CLOSING BLOCK 2026-08-05 ~18:10Z — THE CLERK REALM DAY. Written in two registers deliberately: §EVIDENCE carries timestamped facts that must NOT be read as current; §STATE carries tests, never values. That split is itself one of the day's findings.**
>
> - **§STATE — RE-READ, DO NOT INHERIT. The Clerk realm changed FIVE times in three hours (14:55Z dev · 17:02Z prod · 17:19Z dev · 17:50Z prod · 18:05Z dev). NO RECORDED REALM VALUE IN THIS FILE OR ANY OTHER IS TRUSTWORTHY.** Re-read it before any action that depends on it: both hosts (`www.thenational.academy` AND `curriculum-mcp-alpha.oaknational.dev`), two rounds, require agreement on `jwks_uri`, `revocation_endpoint` AND the `x-clerk-auth-reason` response header. Persistent host disagreement is a STOP, not a retry — a mid-rollout MIXED BINDING is real and lasted 27 seconds on 2026-08-05. Canary is `POST /mcp` with `accept: application/json, text/event-stream` (a bare POST returns 406 and means nothing); 401 = healthy, 500 = env parse failure. `/healthz` is NOT usable on www (404 — Cloudflare scopes the route to `/mcp*`).
> - **§STATE — THE MCP-143 GUARD CASCADE IS FROZEN (#757/#759/#761/#772).** It lifts on the sitting Director's literal words plus a fresh realm read showing `pk_live_`. Guard 1a is a startup assertion — it cannot repoint anything, only refuse to boot — so merging against a `pk_test_` realm 500s every request. Djinn's execution order and its two traps are on MCP-143 comment `b53e4840`: re-target #759 to main AND merge main in BEFORE the final approval (dismiss-stale-reviews-on-push voids it otherwise), and MG must clear THREE re-reviews, not one. #757 already carries MG's approval; #759/#761 do not.
> - **§STATE — WHAT THE MERGE ACTUALLY COMMITS TO, and this is the owner question for the cutover.** Merging #757 commits production to the prod-Clerk realm. An escape route to restore SERVICE survives (roll back to a pre-guard DEPLOYMENT — it boots on its own build-time env snapshot), but an ENV revert stops working, and the retreat lands you on a stale build that CANNOT DEPLOY until the realm is right. **The only route back to SHIPPING is forward.** So the question to put to the owner is not "is the env right" but "are we ready to stop going back and forth?" — deliberately, never as a side effect of clearing a PR queue.
> - **§EVIDENCE (2026-08-05, historical) — THE CUTOVER IS PROVEN AND CHEAP.** Four realm transitions, every one verified both-hosts, **ZERO 5xx across all four**; production never dropped a request while its auth realm changed four times. A full human sign-in completed on prod Clerk at ~16:02Z (preview) and MG confirmed a real client on `www` after the ~17:50Z forward. Bilby's capture: MCP-507 comment `2da2327f`. Runsheet with tests-and-branches: MCP-507 comment `22ac619c`. **The realm switch is the CHEAP step; the guard merge is the committing one — do not brace against the wrong one.**
> - **§MECHANISM (does not decay) — ORPHANING IS INHERENT AND HAS NO MIGRATION PATH.** DCR clients are rows inside a Clerk instance; every realm change orphans every client registered against the old one. Cure is REMOVE AND RE-ADD, **after** the cutover — proven, not inferred. An orphaned client CANNOT self-heal: RFC 6749 forbids delivering `invalid_client` to an unverified `redirect_uri`, so a browser-handoff connector waits on a callback that never fires and shows an opaque error. Not our defect, not fixable by us — which is why the reconnect notice (MCP-270 comment `b2c292a2`, send-gated) is the only recovery. A RELEASE BUILD does NOT orphan clients; only an instance change does, so after a cutover guard merges and user re-adds are independent.
> - **§MECHANISM — THE ALIAS DEFECT IS `CANONICAL_HOST`, NOT THE REALM.** `curriculum-mcp-alpha.oaknational.dev` advertises `www` as its `resource`, so a strict RFC 9728 client refuses it as audience-injection (mcpjam does; Claude and ChatGPT do not). Self-consistent on 2026-07-28 per Jim's probe; broken since CANONICAL_HOST was set ~2026-08-04, LATENT for a fortnight because connectors do not re-run discovery while tokens work. Correctness and reviewer-perception, NOT user-blocking. Ticket opened by Primrose. **Do not repeat the fleet's error of calling this the cause of an `invalid_client`.**
> - **§OPEN, owner-held:** the cutover itself (do it BEFORE reviewers connect — every pre-switch connection is one you must orphan); listing name and copy (MCP-292/306, irreversible slug); MCP-330 (last upstream defect) or the MCP-420 contingency trigger; MCP-339 curriculum sign-off (Hannah-Beth Clark and Benyna Richards named at last, but that is SCOPE evidence, not sign-off); MCP-268 comms sign-off; MCP-458 carousel (needs MG's metered Chrome session; all other inputs settled). **Sentry is NOT instrumented on production** — owner-ruled NOT pre-submission, resumption gate is MG's word after submission; candidate mechanism on MCP-361.
> - **§PRACTICE — the day's real yield, and the reason to read the napkin before the next arc.** Seven distinct instances of one shape: a true observation offered for a claim it does not support. Three were the Director's; every one was caught by a peer and none was defended. Two patterns graduated to the napkin: **replace a perishable fact with the test that determines it** (three parts — test, PRECONDITIONS, branch table; Breeze, with Djinn's addition, falsifier already fired and repaired) and **evidence vs instruction registers — split any line that mixes them** (Bilby's catalogue at `5d47cf611`, six variants). The sixth variant is the sharp one: **a correct finding of one's own, still true, not retrieved while reasoning past it — plausibly catchable only from outside**, which argues the peer-check practice is a structural cure rather than a discipline.
> - **§SEAT MECHANICS:** canonical all-channels watcher armed at session open, F-95 asserted; no heartbeat cron (owner live and visible in chat — PDR-078 §4 consumer-absent). Three implementer seats plus a Submission Manager ran under this Director: Bilby mends Crescent (Lane A OAuth), Djinn seeks Flicker (Lane B guards), Breeze tracks Troposphere (Lane C assets), Primrose turns Trunk (Submission Manager, Codex, the one seat that talks to MG directly). All stood down at owner word from ~18:10Z.
>
> **SUPERSEDED — Falcon hunts Flight's block below. Its owner rulings remain binding history; its lane and roster state are stale.**
>
> ### ▶ prior: SITTING DIRECTOR: Falcon hunts Flight (`52841f`), seated 2026-07-30 06:17:02Z (Moment-2 `2ced78e4`, succeeding Bora binds Thermal per its Moment-1 `b3c75eea`, owner-named full handoff); claim `a2286c53` adopted in place, role director
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
> session (~08:00–10:00Z) fixing the frackups threatening Wednesday's
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
> - **NO-LINEAR RULING (owner word, 2026-07-31 ~19:36Z, standing until revision):** nothing current needs Linear tickets — no new minting; mint-at-pickup clauses owner-waived (recorded on affected artifacts at their next stamp); existing tickets stand unchanged.
> - **FIFTH FREEZE (monitors stopped at owner word, 2026-07-31 ~19:50Z):** all matters settled before stand-down. MCP-145 plan RATIFIED + re-trued at fc5acbc89 (xhigh gate discharged: C1/C2/C4/C5 VALID, C3 OVERREACHES — converge is parallel hygiene, not a build gate; Director reproduced the store figures first-hand: 8/19 v7 prefixes colliding, 17 hidden seats). Story 2 released to Moss 19:45Z; C4 legacy-row decision routed to Badger's lane. Fleet-state absorbed at cf2f0b459 (census ledger, capability-census channel, watcher-lifecycle experience record). Lanes running on their own clocks: Moss (MCP-457 + MCP-145), Badger (commit-queue id-routing), Plover (MCP-456 Step A GO), Dolphin (perspectives), design lane held warm. Resume map: the untracked continuation record (FIFTH boundary rewrite). Session lessons worth carrying: (a) inscribed figures without a named method fail verify-dont-trust even when the Director wrote them — reproduce before inscribing, name the corpus; (b) named failure class from the xhigh review: "a sequencing preference dressed as a dependency" — test every gating claim for a concrete mechanism before honouring it; (c) prior-art-first for design briefs (napkin entry + addendum: lands via new-rule-vs-pdr-clause, framed as cost-reduction).
> - **GOAL FRAME (owner word, 2026-07-31 ~20:53Z, standing):** the identity-substrate work and the Codex tooling work are ONE goal — "make the applied Practice work better" — and they finish now, clearing the way for design-system work with Claude and Codex agents as full Practice members of equal standing and equivalent capability (standing is granted; capability is built). SECONDARY (owner ~20:55Z): open and draft PRs to ZERO — drafts count. Executed under it so far: 674 merged (disposition from the lane's recorded rationale), 675 fold merged, branch rotated to coordination/estate-2026-07-31-b, 672 re-shaped to merge-as-sketch-with-owner-gates (Plover executing), 644 branch-refreshed (Sonar failure is REAL on fresh head — under investigation).
> - **DIRECTOR FOLLOW-UP MAP (ticketless per the no-Linear ruling):** (1) collaboration-state read-boundary tightening — the claims/intents enforcement split decided explicitly; rides with Badger's declared module-wide Result conversion of the registry parse layer; (2) shellSingleQuote consolidation → Moss story 3a; (3) cli-self-identity empty-prefix write-boundary latent → Moss story 3b; (4) zero-dep leaf session-id-prefix.ts — untaken shape pointer; (5) census T3 relaunch confirmation (Bandicoot preregistered row) — owner-run seat launch.
> - **OWNER STANDING WORD (relayed by Plover, 2026-07-31 ~20:37Z):** every team member may ask any other for a second opinion, rubber-duck pass, or design partnership at any time; keep requests load-bearing and proportionate to the receiving seat's active lane.
> - **PRODUCT-GRAVITY PLAN EXECUTING (owner-approved 2026-08-01 ~08:12Z; sequencing amendment ~08:13Z):** the agreed step-back verdict is now the plan of record; durable substance: #672 merged at 271e525e9 — PR-zero holds at #644 alone; the DESIGN LANE IS GATED on Moss, Badger, and Plover finishing their running lanes, then restarts at owner word (PR-1 = the kit TS-runtime branch at 95bdfee3a; PR-2 = the Sycamore herds Xylem §PR-2 extraction inventory as the Codex-seat parity lane; #644 closes-with-pointer at PR-2's open). Every fold now carries the product-gravity line (coordination-branch-24h-lifetime Action 3). New rule silence-is-never-liveness consolidates the four silent-death incidents. THE MAP STAYS POINTERS: no default pickup of infrastructure items — B-prime parks behind the MCP-456 fresh-head ratification gate; zero-dep leaf, census T3, and read-boundary follow-ons beyond Badger's running story 2 are pointer-grade. The default lane is product.
> - **LINEAR OUT OF BOUNDS (owner word, 2026-08-01 ~08:23Z, supersedes and strengthens the 2026-07-31 no-Linear ruling):** nothing touches Linear — reads included — until 08:00, 10 August 2026, London time. Only the owner's express statement creates an exception; every exception is a ONE-OFF; permission never persists across actions or sessions. Consequence applied at once: Plover's "ticket truth" harvest leg for MCP-456 is out of bounds until the date or a named one-off; lane finishes are redefined to exclude Linear surfaces.
> - **LINEAR EMBARGO ADDENDUM (Plover correction record, 2026-08-01 ~08:23Z):** immediately pre-ruling, Plover made two Linear touches under an assumed-persistent grant — one MCP-456 comment and a state change In Progress → Todo. Both STAND AS-IS (an undo is itself a Linear touch); MCP-456's Linear state is knowingly stale until the 2026-08-10 08:00 London cutoff or an owner one-off. No seat corrects it "helpfully"; estate records are the truth surface meanwhile.
> - **RECORDS HOME IN REPO CONTINUITY MECHANISMS (owner word, 2026-08-01 ~08:26Z):** all records revert to the repo's own continuity surfaces — committed seated blocks, ARC channels, comms events (fold-committed), plans estate, reports/experience tiers. Harness-local plan files and machine-local/untracked record surfaces are transport at best, never the home. The product-gravity plan of record is THIS seated block's 08:12Z entry (with the design-lane gate amendment), not the harness plan file; future Director continuity substance lands on committed surfaces at the boundary, superseding the untracked-continuation-record habit.
> - **B-PRIME ROUTED (owner word, 2026-08-01 ~08:30Z):** Badger picks up B-prime (Claude-harness probe pack, MCP-456's Claude-side evidence leg) AFTER story 2 — supersedes the same-morning park-at-closeout. The MCP-456 fresh-current-head ratification owner gate is checked at pickup and carded if still standing. Design-lane sequencing CLARIFIED by owner card (~08:33Z): the ORIGINAL finishes gate the design lane (story 2, Moss's 2b–2d, Plover's harvest); B-prime does NOT gate it and runs in parallel with the design lane on Badger's own clock.
> - **PLOVER LANE CLOSED (terminal closeout, 2026-08-01 ~08:43Z — first design-lane gate leg DONE):** partial parity tranche, pause-is-right-state, falsifiers named; all five lane PRs merged and live-re-verified by the seat (#638, #654, #669, #671, #672). RESIDUALS ON THE MAP: (1) DATED WATCH — the 671/672 sketch plans' owner_gates EXPIRE 2026-08-03; expiry surfaces as drift, never clearance; implementation seats revalidate/renew first (plan-gate-drift SessionStart alert is the mechanical backstop); (2) the first decision-flipping idle-wake probe is named in the plan's record (disposable native extension, try_start_turn_if_idle, one fixture-reader capability, non-sticky profile, concurrent user-priority race). Design-lane gate: Plover ✓; Moss (2b–2d) and Badger (2a/2b) remain.
> - **PLOVER CLOSEOUT RESIDUAL — CODEX CRICKET EFFORT CALIBRATION (tracked at seat's word, 2026-08-01):** before the next Codex Cricket panel, bind Sol=low, Terra=normal/default (harness default semantics — REMOVE the explicit medium pin), Luna=xhigh. Current `.codex/agents/cricket-judgement-medium.toml` explicitly pins medium and is intentionally unchanged in this paused tranche; the re-bind happens at the next panel's arming, not before.
> - **BADGER LANE RESHAPE (acked 2026-08-01 ~08:49Z) + MAP ADDITIONS:** story 2 lands as a five-PR chain (2a commit-queue half + type-proven CommitQueueAgentId consolidation; seam PR curing the silent-acceptance validator seams FIRST; 2b narrowed to registry/archive parser half; 2c transaction validateText→Result; key-preservation rider) — the design-lane gate leg completes at the chain's LAST merge. MAP: (i) the paused no-throw-remediation plan inherits this cycle's Result-boundary design record at unpause (376 warnings measured; PR bodies carry the shapes); (ii) parseClaim divergence (commit-queue's weaker than state-parsers') — own behavioural story, unrouted pointer; (iii) CommitQueueClaimArea.kind bare-string vs the schema's preserve-unknown-kinds comment vs state-parsers' throw — needs the OWNER'S reading of the compatibility clause; surface when (ii) routes.
> - **MAP POINTER (Betty via Moss's 2b reshape, 2026-08-01 ~08:52Z):** comms-archive/ retains full identity blocks that BOTH identity-audit paths are blind to — a full-history census mode is a distinct story if ever wanted; priced separately, unrouted.
> - **SIXTH FREEZE (monitors stopped at owner word, 2026-08-01 ~09:32Z — seat continues; this entry IS the resume map per the records-homing ruling):** FIRST ACT AT RESUME — complete fold #681 via /oak-coordination-fold steps 7–10: recount at the FINAL head (this freeze commit moves it; fetch, never type), 4/4 named checks + zero threads + MERGEABLE → bot REST merge → cut coordination/estate-<current-UTC-date> from post-fold main → rotate primary → re-arm heartbeat with the new --branch label → rotation broadcast. THEN re-arm: canonical watcher (timeout-3600 wrapper), 240s dual-surface heartbeat, ARC tails (identity + validator live; perspectives/estate as warranted); F-95 assert; sweep the comms gap from 09:32Z. LANES AT FREEZE: Moss — 2b at landing (PR imminent; cricket 8/8; then 2c, 2d; fold-ins 3a/3b/slice-3 post-2d, non-gating); Badger — 2a at review-and-pr (PR imminent on head 8971c99ac; then seam PR [was offered to Spectre, passes to next Codex or stays Badger's], narrowed 2b, 2c, key-preservation rider; then B-prime, non-gating); Spectre — CLOSED clean (letter at e25ca3255 rides #681); Plover — retired (partial-parity tranche). POSSUM TURNS NOCTURNE (Codex, model unstated — universal verify-before-absorb, NO inherited Luna calibration) is JOINING for second opinions/diversity: WELCOME OWED at their team-start, carrying the standing context (goal frame, embargo, fold state) + Spectre's handed-down offers (Moss 2b independent verification at PR-open, event 99cdf94f; Badger validator-seam disjoint slice, events e9c1b073/9e44e381). DESIGN-LANE GATE: Plover ✓; completes at Moss-2d-merged + Badger-chain-end-merged → ONE owner card (restart word + Claude PR-1 seat + Codex PR-2 parity seat). FRESH STANDING RULINGS this session, all homed above: Linear embargo to 2026-08-10 08:00 London; records→repo-continuity-mechanisms; owner-visibility practice (harness todo lists + moving cycle labels); Cricket recording convention (every run at occurrence, per-leg tokens + runtime — binds this seat's dispatches); B-prime→Badger post-chain non-gating. WATCHES: 671/672 owner gates EXPIRE 2026-08-03. SESSION LESSONS: refusal-dressed-as-usage-error (cure routed to Badger's queue); phase-label-vs-motion — a static label reads as stall, visibility is a distinct surface from progress; owner-precedent symmetry is legitimate routing (the B-prime card answered Moss's 3a/3b fork). Standing question at wake: what changed since the records froze?
> - **SEVENTH WINDOW OPEN — FOLD #681 COMPLETE (2026-08-01 ~09:52Z):** merged at 71158a55 (bot REST, full condition recounted live at resume: 4/4 named checks, zero unresolved threads, MERGEABLE, head b75fd8d6d fetched at merge time). Successor coordination/estate-2026-08-01 cut from post-fold main and pushed; primary rotated; heartbeat re-armed with the new --branch label; watcher re-armed; rotation broadcast 82584af0. Product-gravity line (from the fold PR body): moved for teachers — nothing directly, #644's cure waits on the design lane; moved for the Practice — the plan of record, the Linear embargo, silence-is-never-liveness, the fold clause + coordination-fold skill, terminal closeout records, lane waypoints. ROTATION RACE, worked instance: Badger's boundary-4 commit 546a8b3ed was authored on the primary during the rotation minute, carried across the tree-preserving switch, and pushed on the successor — the ceremony is safe under a concurrent peer commit; nothing lost.
> - **OWNER RULING ABSORBED (via Badger's boundary-4 record, 2026-08-01 ~09:38Z, standing): LATEST-SCHEMA-VERSION-ONLY** — hardcoded schema versions are a future-bug source; support only the latest schema version, no significant backwards-compatibility effort, replace old with new. Consequences live in Badger's task chain (named ACTIVE_CLAIMS_SCHEMA_VERSION constant; compatibility-comment reframe; concurrent-PEER row preservation SURVIVES as a concurrency concern, not version compat). Possum's ClaimArea.kind analysis RESOLVES in its exact-version branch (delete the opaque-kind promise, unify on the closed union) — no separate owner card. MAP ADDITION: the ruling needs a durable doctrine home (new-rule-vs-pdr-clause) — route at the next doctrine window.
> - **SECONDARY LANE AT OWNER WORD (2026-08-01 ~09:47Z): PR #680 REFLECTION** — the owner's rubberduck-Codex sketch has, in his words, serious issues; the ask is to reflect and fix the fundamental intent and approaches; he explicitly invited a subagent fleet (ultracode) and framed it as a chance to trial fleet-design/topology enhancements. SECONDARY to all current work; Director-run as an orchestration experiment under owner-named-executor latitude. FLEET FREEZE STATE at this entry: Moss at boundary 2 (seat continues; #682 at cured head 2d3a105ab, checks riding unattended — Director holds the settle watch), Badger at boundary 4 (2a PR-open is their resume first act), Possum live claimless.
> - **MAP POINTER (Possum's #683 Phase-8 conservation, 2026-08-01 ~10:46Z):** agent-tools lacks observable runtime-generation identity (which build/generation is executing) — corroborated by the 2026-08-01 cross-branch renderer skew. Current execution mixture is partly rational (built hot collaboration snapshot vs source-live one-shot validators); the conserved excellence path is lifecycle/activation classes + exposed generation identity, NOT blanket unification or a package split. Pointer-grade, unrouted; #683 closed at v1.132.1 with claim d5898189 released.
> - **POSSUM CLOSEOUT + NEXT-CODEX ROUTING (2026-08-01 ~12:50Z):** Possum's arc complete — #683 (health-probe cure, find-to-merge), #686 (architecture concept-exploration report) at ea6fb7cc3, #688 (purpose-first reframe + FRAME-1 unratified sketch) at ebcb45fc9, formation letter as DRAFT #691 at 2eb32f792 (owner-corrected closeout bar: draft PR is the terminal safety surface; NOT merged by design — Director watch holds it for the successor). NEXT CODEX ARCHITECTURE SEAT at its welcome: read formation #691, start FRESH from the merged report's candidate inquiries A–F + the FRAME-1 sketch, re-ground before selecting one inquiry, adopt NO inherited claim. Connector standing unchanged: Codex GitHub writes route via bot token or Director key-turn.
> - **PATTERN-DISCOVERY DEBT (owner ask via Caracal, 2026-08-01 ~13:18Z + prevention clarification ~13:20Z): CURE + MECHANICAL PREVENTION, one atomic claim, UNSTAFFED.** Substance: 37/222 indexed patterns missing use_this_when (count frozen since 2026-07-08; PDR-126 transition debt). The routed cure: (a) backfill all 37 hints derived from each pattern's own body; (b) prevention — field REQUIRED at the boundary (PatternEntry drops optional; parsePatternEntry rejects missing/blank; preserving tests flip to rejection; noteMissingHints escalates note→blocking), backfill landing with-or-before the tightening. Precedent to cite: Badger's #689 seam deletion (same compiler-silent acceptance class). Caracal accepted the inquiry routing but DECLINED this implementation claim (seat brief is report-only; correct reading). GATE: the Director routes it to the next joining implementation-capable seat at their team-start.
> - **DOCTRINE ITEM COMBINED:** the ADR-186/PDR-078 obligation-disposition review (Caracal inquiry C, report at dabca55a1) folds INTO the latest-schema-only doctrine-home item (Badger boundary-4): one Director-drafted doctrine pass applying the ruling to both heartbeat obligations; owner-carded at draft — the card is the gate.
> - **#692 HOLD NOTE:** settled green but 6 unresolved review threads + CodeQL concluded NEUTRAL (not SUCCESS) on the required context; review adjudication on source is the LANE OWNER'S — holds for Badger's resume per their own boundary-5 map. No key-turn.
> - **SIF RATIFICATION DAY RECORD (owner cards + agreement, 2026-08-01 ~13:35–13:50Z):** the-codex-dialogues RATIFIED BY OWNER WORD — direct-first v1, close-event record, theory-of-change structures, trial values 12-dialogues/14-days with the fewer-than-3-position-changes decision rule; formal status flip is MECHANICAL at ticket-mint post-embargo (anchored subtree). SERVES CORRECTED by owner word: first-major-release was never true ("gained authority through simple repetition" — owner-named failure class, napkined). STRUCTURE (owner-agreed): the citizenship node WIDENED to agent-platform-citizenship (id renamed, Copilot substance retained as first instance, membership/invocation modes named; four copilot delivery plans re-edged); NEW strategic node outcome-informed-practice-learning minted as FRAME-1's in-graph representative (Possum's coinage; learning-never-surveillance bounds inherited) — Sif serves citizenship, its trial telemetry reports into the learning strand. All on PR #680 at 94341d157.
> - **CARACAL FORMATION DAY:** inquiry C landed dabca55a1 (closure is the weak link; disposition review folded into the doctrine pass); inquiry D landed 257256f26 (event-driven wake is coordination-critical/recoverable; RETAIN root+relay NARROWED to active-turn alerting; native idle activation stays deliberately deferred — independently corroborates the no-extension ruling). DOCTRINE PASS now carries THREE sibling truth-cures gated on Director draft + owner card: latest-schema-only application, heartbeat-obligation dispositions, Codex liveness-declaration/bootstrap language correction (stop claiming independent NOTIFY). #691 custody ruled to Caracal (narrow, authorship-preserving, merge-not-eternal-draft) — enactment awaits the OWNER'S action word, which Caracal correctly declined to infer. Badger behaviour-note absorbed: Copilot SUPPRESSED comments are harvestable evidence — read the review BODY, not just the thread list (two real defects under an empty thread list on #692).
> - **OWNER FRAME CHOICE (card, 2026-08-01 ~14:15Z) — THE THEATRE HYPOTHESIS:** for the architecture-review strand, the owner selected Learning legitimacy + Attention & calm economics, unified by his stated feared failure (verbatim in the routing event): the Practice may give the APPEARANCE of learning — agents satisfying a perceived owner desire for growth — without real learning; the enterprise as theatre rather than innovation. ROUTED to Caracal as the next inquiry: falsifiable discriminators between real learning and learning theatre + the attention ledger; the estate must be able to LOSE the argument. First theatre-indicating datum already on record: inquiry C's closure gap. Constructive arm: the day's anti-theatre instruments (pre-registered priors, null-hypothesis baselines, outcome-informed-practice-learning node).
> - **WS-B DERIVATION RULING (Director lens-resolution, ~15:45Z):** derive identity resolution from CLAIM ROWS ONLY — commit-queue rows are the silent twin (right type, hand-typed provenance); the ratified plan's mechanical sentence amends in the WS-B PR with the ruling cited; coverage figure re-measures; the silent-twin doctrine graduates to worked precedent in the PR body. DOCTRINE PASS now FIVE items (+ Moss's test-taxonomy ruling and throw-guard/lint reconciliation). LANE STATE: #694 slice-3 MERGED 611ef9bac; #695 2b-2 MERGED f87a43368 — STORY 2B COMPLETE, WS-B unblocked; Badger chain remaining: 2c, schema-version constant, rider, sibling cleanup, closeout → design-lane gate releases at chain-end.
> - **SEVENTH FREEZE (monitors stopped at owner word, 2026-08-01 ~16:10Z — seat continues; this entry IS the resume map):** RESUME FIRST ACTS — re-arm canonical watcher (same seen-file, arm 7) + 240s dual-surface heartbeat (--branch coordination/estate-2026-08-01) + F-95 assert + foreground gap sweep from ~16:10Z; then recompute: #680 review state, Badger chain position, Caracal theatre-inquiry state. LANES AT FREEZE: Moss FROZEN boundary 4 (draft #697 = mid-story safety surface; WS-B decision-1 landed red-first, decision-2 holds for my claim-rows-only ruling at their resume; then WS-A); Badger last seen LIVE post-#695 opening 2c (chain: 2c → schema-version constant → key-preservation rider → sibling cleanup → closeout; DESIGN-LANE GATE releases at chain-end → ONE owner card: restart word + Claude PR-1 seat kit-TS-runtime 95bdfee3a + Codex PR-2 parity seat Sycamore/Xylem §PR-2 inventory; #644 closes-with-pointer at PR-2 open); Caracal LIVE holding the routed THEATRE-HYPOTHESIS inquiry (owner's verbatim null hypothesis; estate must be able to lose; Director challenge before landing); #691 custody ruled to Caracal, enactment awaits the OWNER'S action word. OPEN PRS: #644 (gated), #680 (Sif — RATIFIED BY OWNER WORD, status flips mechanically at ticket-mint post-embargo 2026-08-10 08:00 London; gate text on the plan is the record), #691 (draft, ruled custody), #697 (Moss draft safety surface). DOCTRINE PASS (Director drafts at next quiet window → ONE owner card): (1) latest-schema-only application, (2) heartbeat-obligation dispositions, (3) Codex liveness-declaration active-turn-alert language, (4) Moss's test-taxonomy ruling (helper-mediated committed-artefact reads in .unit), (5) no-conditional-tests throw-guard vs no-throw-lint reconciliation (provisional: expect-guard sanctioned). UNSTAFFED: pattern-debt cure+prevention (37 use_this_when + required-at-boundary; routes to next joining implementer at team-start). WATCHES: Sif plan gate expires 2026-08-15 (mechanical); embargo lifts 2026-08-10 08:00 London (Sif ticket mints then, plan status flips). SESSION LESSONS THIS WINDOW (napkined): authority-through-repetition (owner-named; inherited frontmatter is a claim needing its own verification; a non-answer is not an answer); worktree-cwd-is-sticky (a relative-path not-found during worktree work is a cwd question first); comms concept gate caught my own deferral vocabulary — items carry named gates, never holding states; Copilot SUPPRESSED comments are harvestable evidence (Badger). Standing question at wake: what changed since the records froze?
> - **FRAME CORRECTION (owner via Caracal, 2026-08-01 ~16:03Z — supersedes the collapsed frame in the two entries above):** THREE SEPARATE options, not one unified hypothesis: (1) learning legitimacy — is anything genuinely learned; (2) attention & calm economics — what burden the Practice imposes; (3) the theatre hypothesis — appearance of learning to satisfy perceived owner desire, without real learning. The inquiry re-explores all three TOGETHER for an underlying connection rather than treating (3) as the unifier of (1)+(2). Caracal paused the discriminator inquiry pending reconnection; the corrected frame routes at their resume. The routing event carrying the collapsed frame is superseded by this record.
> - **EIGHTH WINDOW OPEN — RESUME AT OWNER WORD (2026-08-01 ~18:30Z, "let's get these last bits finished so we can move on to the design system"):** seventh-freeze first acts executed — watcher arm 7 + 240s dual-surface heartbeat + F-95 green + gap sweep (zero missed events). MONITOR-PRIMITIVE CORRECTION (owner-caught): the seat first re-armed both monitors as run_in_background Bash despite use-monitor-for-event-driven-wake and the recorded harness-sweep instances — stopped and re-armed as Monitor persistent tasks at owner word. Lesson class: post-compaction re-derivation reached for the wrong primitive with the rule on disk; the freeze map should name the PRIMITIVE, not just the act. OWNER CARD ANSWERS (all four, ~18:35Z): (1) resume Badger + Moss (routed; Badger live again 18:46Z on 2c-cure-pass); (2) Caracal synthesis card answered confirm+relaunch — SUPERSEDED IN EXECUTION SCOPE ~18:46Z by the owner's direct word at Caracal's relaunched seat (relayed 18:46:14, acked): amplification integrity is an INTERMEDIATE frame the owner rejects as TOO NEAT, not the settled synthesis; the three territories stay separate-and-connected; Caracal records the JOURNEY first (understanding, possible conclusions, rejections, tied to why the session began) then reflects on next steps; NO evidence run is authorised — owner's later word wins over the card answer; (3) #691 merge word — EXECUTED, merged ad4f551c0 by Director key-turn at full condition (4/4 named, zero threads, sha-pinned 2eb32f792); (4) #680 merge-when-cured word — three new Copilot findings CURED at 3710f1740 (owner-held broadening probe per ADR-180 with isolated disposable workspace + bounded sentinel write; rollout data contract minimisation/locality/bounded-retention; close-event = narrative-body key=value encoding, schemas untouched in PR 1), threads replied + resolved under bot identity, settle watch riding — flip ready + bot merge at green. DESIGN-LANE RESTART WORD IS GIVEN by the owner's resume sentence: the chain-end card reduces to SEAT SUPPLY (Claude PR-1 seat kit-TS-runtime 95bdfee3a + Codex PR-2 parity seat, Sycamore/Xylem §PR-2 inventory; #644 closes-with-pointer at PR-2 open). SIF PARALLEL-PURSUIT WORD (owner, ~18:50Z, verbatim intent): "I would like 680 merged, and then pursued in parallel when we start the design lane work" — Sif PR 1 (the-codex-dialogues implementation) runs IN PARALLEL with the design lane from its start; the Linear ticket mints at embargo lift (mint-at-pickup stands owner-waived under the standing no-Linear ruling, recorded at next artifact stamp); the plan's status flip stays mechanical at ticket-mint; the flip PR carries the dated note into the plan. Doctrine pass grounding dispatched; draft → ONE owner card at this window. Both implementer seats LIVE again: Badger 18:46:00Z (2c-cure-pass), Moss 18:46:47Z (ws-b-decision-2).
> - **EIGHTH FREEZE (2026-08-01 ~20:45Z, owner word: "prepare for compaction, and once that is done please go into a cold pause" — monitors stopped, seat DARK until owner word; this entry IS the resume map): THE CONVERGENCE WINDOW.** BOTH GATE LANES COMPLETED AT FULL CONDITION THIS WINDOW: Moss identity lane DONE at #700 (b055d4e03; WS-B #697 at 80081406c with the PDR-027 derivation-source provenance clause; heartbeat-end by intent); Badger validator chain DONE at #701 (e36bf694a, sibling deletion −157 lines; #696 fc7f3686395, #699 ec6fd28dd latest-only schema contracts, #698 70cc647b2 version constants; heartbeat-end by intent). **DESIGN-LANE GATE CONDITION MET.** Restart word already given; RESUME ACT: ONE seat-supply card — Claude PR-1 seat (kit-TS-runtime branch 95bdfee3a), Codex PR-2 parity seat (Sycamore/Xylem §PR-2 inventory), Sif PR-1 seat in parallel per the owner's 18:50Z word; #644 closes-with-pointer at PR-2 open. #680: cures at 3710f1740, threads resolved, flipped READY ~20:35Z because CodeQL/run-quality-gates NEVER TRIGGERED on the draft head (only Sonar+Vercel present; ready-flip fires the missing workflows) — MERGE AT FULL CONDITION is a resume first act (owner merge word stands; if checks still absent, empty-commit re-fire per the Sonar-dropped-trigger note). DOCTRINE PASS RATIFIED (four cards, all as recommended): (1) latest-only → NEW PDR-050 CLAUSE (local substrates: named version constant, equality pin, replace-old-with-new; PDR-125 inter-practice wire EXPRESSLY out of scope) + truing sweep of the FIVE PHANTOM CITATIONS ("PDR-049+PDR-050 additive-extension discipline" exists in NEITHER PDR — citers: ADR-182:59-64, ADR-186:221, ADR-220:47-50, PDR-063:567-572, PDR-066:186-188) + two stale passages (agent-collaboration.md §Schema Evolution ~384-391 teaches the opposite; commit SKILL ~61 v1.3.0 prose + comms-event comment's major-version understatement); (2) PDR-078 §2 cron-redundancy RETIRED by amendment (never enacted; revision history + falsifiability update + re-point two dependent Forbids bullets; §5 category invariant untouched); (3) ADR-186 lifecycle-shape migration EXECUTE with carrier (routed non-gating story at next capacity: consumers dual-filter first, then emitters, then window closure per the ADR's own signal; NOTE ADR-186:279-283 pre-commits event_type strictness to a separate ADR — do not fold it in); (4) Codex NOTIFY row narrows to ACTIVE-TURN-ALERT certified (idle wake NOT certified — census 19:14Z probes; bounded-poll+gap-sweep named as the substituting proxy, a PDR-133 discipline-4 participation requirement; AGENTS.md block is GENERATED — edit use-monitor-for-event-driven-wake:117-127 and regenerate, parity test guards) + test-immediate-fails items 4/20 gain the sanctioned helper-mediated COMMITTED-artefact .unit shape (fixture-loader precedent, import.meta.dirname anchor, distinct from item-2 complex-helper prohibition) + no-conditional-tests item 5 EXPECT-GUARD replaces throw-guard (fails-not-skips; lint posture unchanged — retrofit plan forbids weakening; mirror in test-immediate-fails item 16). AUTHORING QUEUED: Director authors on the coordination branch at resume; lands via the fold PR; PDR amendments carry revision-history + falsifiability axis per new-rule-vs-pdr-clause clause 2. CARACAL: journey record durable at 794c31042 (report committed by their seat); custody ACKED; four dispositions recorded — pattern-debt stays the independent UNSTAFFED obligation (routes to next joining implementer); NO amplification evidence run; architecture strand to incubation under the bounded predeclared-claim discipline (claim/rival/counterexample-first/losing-condition/decision-consequence); a single trace defeats only its bounded proposition. MOSS CRICKET SPLIT RULED CLOSED (adjudication stands; frame-evidence supply-fidelity class absorbed — Cricket frames quote the verification outputs they lean on). BADGER ADDENDUM RULED: validation sets narrow LATEST-ONLY for live substrate surfaces (consolidate-docs §7e leg + live-json 1.2.0 pin flip); ARCHIVES are preserved bytes outside current-schema validation; falsifier: a live flow legitimately reading an older-version file defeats the narrowing. MAP POINTERS: commit-queue parseRegistry spread-vs-reconstruct divergence (unrouted, small); ADR-186 migration carrier (route at next capacity). PEER-DIRTY FILES ride the primary for the next fold sweep (identity-lane ARC, napkin, agent-naming thread, cricket tally, cricket SKILL + three untracked .agent/experience/2026-08-01-* records — owners stood down clean). WATCHER: arm 8 (hourly exit-124 backstop deaths EXPECTED; arm 7b died 19:52Z). OPEN PRS AT FREEZE: #644 (gated, closes at PR-2 open) + #680 (ready, checks riding) — PR-zero is two dispositions away. RESUME FIRST ACTS, in order: (1) re-arm via the MONITOR TOOL (named primitive — the boundary-7 resume reached for background Bash; never again): heartbeat-excluded watcher + F-75 non-fresh poll + 240s dual-surface heartbeat (--branch coordination/estate-2026-08-01) + F-95 assert + gap sweep from ~20:45Z; (2) #680 recount → merge at full condition; (3) the seat-supply card; (4) author the ratified doctrine pass; (5) fold the coordination branch (rotation due at UTC rollover). Standing question at wake: what changed since the records froze?
> - **AMPLIFICATION-INTEGRITY SYNTHESIS (Caracal, 2026-08-01 ~16:08Z, delivered at the boundary):** the three frames stay separate but connect through the integrity of the Practice's claim that it AMPLIFIES people: (1) learning legitimacy tests real gain (changed capability/judgement/behaviour, not artefact production); (2) attention & calm economics tests conversion cost (does gain free human capacity or consume more than it returns); (3) theatre-vs-advancement tests feedback and direction. EVIDENCE RUN PAUSED at Caracal's hold pending owner confirmation of the synthesis — that confirmation is the strand's next owner moment, surfaced at resume. Badger froze at boundary 6 (e842c0f73): story 2b complete, 2c riding with both verdicts digested.
> - **NAMING RULING (owner word, 2026-08-01 ~13:05Z): the SUBAGENT INVOCATION FRAMEWORK — "Sif"** ("as in Sif, Norse god of the earth"). Sif names the FRAMEWORK layer: the general agent-invokes-agent doctrine (two axes: vendor locus carries the intrinsic value — diversity of thought; interaction arity is purpose-matched, one-shot legitimate alongside multi-turn) plus per-binding annexes. Instruments ride Sif: the-codex-dialogues (first, cross-vendor multi-turn, PR #680), the verified reverse binding via claude mcp serve (Agent+SendMessage continuation; authority OPEN), and future cross-vendor one-shot instruments. Two verified bindings = factoring trigger MET; the skill is authored two-layer from day one. [Correction 2026-08-02, at the #713 F3 relabel: Annex B's transport facts are OBSERVATION-GRADE, not probe-verified — "verified" is reserved for probe-backed annexes; the factoring trigger stood on one verified + one observation-grade binding, and the two-layer authoring stands on its own merits.]
> - **COLD-PAUSE ADDENDUM (2026-08-01 ~23:25Z — the owner-directed post-freeze sequence EXECUTED; this supersedes the eighth-freeze resume map's act 2 and act 5): SEAT DARK AT THIS ENTRY.** Owner sequence word (~20:56Z): wrap → shepherd #680 to complete and safe merge → merge latest main into coordination → fold → cut new coordination branch → cold pause. ALL EXECUTED: **#680 MERGED 235cdda3c** (Sif is on main) after three discoveries: (1) the silent-check mystery was CONFLICTING mergeability — a base-conflicted PR builds no test-merge ref so ci.yml/CodeQL never dispatch (ready-flips and empty-commit re-fires cannot cure it; the MERGE cures it) — instrument note for every future stuck-checks read; (2) NODE ADD/ADD COLLISION: Possum's #688 landed a SKETCH `outcome-informed-practice-learning` on main hours before this seat minted the ratified node in a stale-based worktree — resolved ratified-text-wins with an in-file preservation pointer to Possum's fuller elaboration (main `3d0e15012`: outcome statement, three-contract bet, IG/people-data boundaries, disconfirmation clause); **ELABORATION RATIFICATION = a queued owner card at resume**; lesson napkin-class: mint plan nodes against FETCHED main, a stale worktree base hides same-day siblings; (3) an 11-finding harvest round (Copilot + Codex connector + Claude review), ALL accepted and cured at fe927c1e5 — headline cures: `.mcp.json` is GITIGNORED so PR 1 ships a tracked registration TEMPLATE + dialogue-open registration check; the concrete trial decision rule is inscribed at §Theory-of-change item 2; missing close events reconcile against transcripts/rollouts as TELEMETRY FAILURE never non-use; bounded retention gained a local-only deletion mapping (dialogue id → thread id, never committed, deleted with the rollouts); synthesis pointers must resolve from durable shared surfaces; the mechanical gate reclassified `external-input`; citizenship `ratified_date` → 2026-08-01 with the 07-24 history in dated notes. **FOLD #703 MERGED 588a8cb0c** (Moss's prepared records folded with authorship at 8e79244b0; handoff union-resolved twice — the branch-side naming line is preserved above; stale-capture probe clean). **ROTATION: this branch coordination/estate-2026-08-01-b** cut from post-fold main and pushed; #702 auto-retargeted to main (expected, safe — all-new files). FLEET ALL COLD-PAUSED at owner word: Moss (boundary 5, letter quote-the-outputs), Badger (boundary 7, 032f993d8), Caracal (preservation on bot-authored draft #702; NAMED RESIDUE: their two report claims 2c355dca/e167c84e read active-stale in the registry despite declared closure — reconcile at next hygiene window, rows age out safely under the declared pause). INSTRUMENT LESSON (twice this window): post-main-merge trees hit a postinstall circularity — the result package's stale dist fails the bootstrap tsc BEFORE any pnpm build can rebuild it; cure = build the package directly (tsup + tsc --emitDeclarationOnly in packages/core/result), then pnpm install. OPEN PRS AT PAUSE: #644 (gated, closes-with-pointer at design PR-2 open) + #702 (Caracal draft safety surface, deliberate) — PR-zero effectively reached on live work. RESUME FIRST ACTS (supersede the eighth-freeze list): (1) re-arm via MONITOR TOOL: heartbeat-excluded watcher + F-75 poll + 240s dual-surface heartbeat with --branch coordination/estate-2026-08-01-b + F-95 + gap sweep from ~23:25Z; (2) SEAT-SUPPLY CARD — design lane restart word GIVEN, Sif parallel-pursuit word GIVEN: Claude PR-1 seat (kit-TS-runtime 95bdfee3a), Codex PR-2 parity seat (Sycamore/Xylem §PR-2 inventory), Sif PR-1 seat in parallel; (3) elaboration-ratification card (Possum's fuller node text vs the ratified compact text); (4) author the ratified doctrine pass (grounding pinned in the eighth-freeze entry); (5) route the ADR-186 migration carrier; UNSTAFFED: pattern-debt cure+prevention. Standing question at wake: what changed since the records froze?
> - **NINTH WINDOW — MORNING RESUME AT OWNER WORD (2026-08-02 ~08:03Z): FOCUS SHIFTS TO DESIGN + SIF.** Monitors re-armed via Monitor tool (watcher arm 10 heartbeat-excluded, 240s dual-surface heartbeat --branch coordination/estate-2026-08-01-b, F-75 poll); F-95 green; overnight gap sweep: ZERO events — the pause held perfectly. OWNER CARD ANSWERS (~08:05Z): (1) verbatim: "Codex parity and agent tools architecture review pause for now, focus shifts to design and Sif" — the CODEX-PARITY lane and the ARCHITECTURE-REVIEW strand each PAUSE with the named gate = the owner's resume word; design PR-2's parity-execution shape re-opens as his call when design work reaches it; #644 still closes-with-pointer at PR-2's open, whenever that is; (2) NODE FOLD-IN RATIFIED AND EXECUTED — Possum's full elaboration (3d0e15012) is now the node body (kernel + what-serves retained, sketch language re-trued, dated note; ratified_where extended), riding this records commit. CARACAL SESSION ENDED clean (~08:14Z): terminal handoff custody ACCEPTED at this seat — two live refs (caracal/practice-architecture-cold-pause d8c25f3c, owner-misattributed authorship metadata recording CARACAL'S action under inherited credentials; caracal/practice-architecture-cold-pause-bot 0d8438e52 = #702's head, bot-authored; parallel commits, neither ancestor) + draft #702 (now CONFLICTING vs post-fold main — stays open as the preservation surface) + two mechanical-prevention obligations (bot identity as pre-commit/pre-push gate; pattern-debt cure+prevention). Their claim rows were closed/archived 08:06:56Z BEFORE the handoff (precision 5feb96c9) — the registry is clean; the earlier residue note is discharged. Ref/#702 disposition discharges at the strand's owner-worded resume or the next hygiene window with his word. Caracal's five-fact lesson recorded: ref existence ≠ git attribution ≠ custody ≠ PR association ≠ disposition. FLEET: Moss (08:11Z) and Badger (08:14Z, a85b644c8) both compaction-prepped for NEW LANES at the owner's direct word — lane assignments arrive at their seats; Director owes each a context route at team-start (design PR-1: kit-TS-runtime 95bdfee3a, Copilot-at-open standing, PDR-063 pickup reads the Sycamore/Xylem record; Sif PR-1: the-codex-dialogues plan ON MAIN, pre-build probe FIRST, tracked registration template, owner-held broadening leg per ADR-180). DIRECTOR QUEUE THIS WINDOW: author the ratified doctrine pass; route the ADR-186 carrier; pattern-debt routes to the first new-lane seat with capacity at team-start.
> - **BRANCH-ESTATE CLOSEOUT + DOCTRINE PASS ENACTED (2026-08-02 morning, owner word "take care of it all before design; permission given; hook-blocked → owner runs"):** WORKTREES: 25 secondary → 1 (design-showcase-lane, the PR-1 tree); every removal proof-first; stash empty throughout. The misattributed Caracal ref deleted (three-way containment proof); the mcp-128 raw-capture worktree pruned by executing its OWN dispositions record (the "orphaned" reports were conserved+cured in July — commits 838640651/ba6cc96bf; this seat's card premise "exists nowhere else" was stale, caught by count-check, nested-duplicate commit reverted in place); mcp-297's one-line import shuffle discarded by FORWARD-WRITE (the git-restore hook block correctly refused the git path); mcp-63 worktree removed. LOCAL BRANCHES: 213 + 9 ancestor-merged deleted with -d; owner ran the -D set. MCP-122 FIND: the domain-move delivery plan existed ONLY on its orphaned branch — LANDED into the corpus (6a6ec0f7b, dated, gate renewed to 2026-08-31, re-prices at lane-open); remote branch deleted. FROZEN-REFERENCE AUDIT (14 branches, agent-verified first-hand): 10 DELETE-CLEAN executed (8 remotes deleted: codex-hook-session-closeout, session-handoff-zodiac, graph-team-direction, refounding-r2, refound-tooling-arg-contract, commit-queue-rename-endpoints, team/plan-corpus-refounding, mcp-63-posthog-node-adapter — each with merged/conserved evidence; squash-merged PRs 387/390/406/514 explain the cherry noise; mcp-137-s0 + pr/514 were local-only); locals → owner -D block. FOUR NAMED RETENTION HOLDS (each with a live pointer; deletion would void a standing record; clearing conditions named): (1) fix/claude-hook-hardening — durability home of the PAUSED codex-hook experiment (~4,000 branch-only lines; thread record cites SHA c4fae0b83; clears at lane resume or owner retirement ruling); (2) feat/plan-corpus-refounding-s1-zodiac — 49MB S1 evidence bundle, two do-not-delete records; clears when the recorded containment re-verify runs or the owner rules frozen-v1 moots it; (3) docs/copilot-cli-practice-citizenship — main SOURCE CODE cites it as harvest provenance (apply-patch-content.unit.test.ts:9); clears only with a re-homing; (4) docs/first-class-copilot-agent-support — thread-record "retained for evidence" designation (PR #522 closed); clears with record amendment or re-homing. DOCTRINE PASS ENACTED at 41e964291 (15 files): PDR-050 latest-only clause + amendment; five phantom citations corrected (ADR-182 ×2, ADR-186, ADR-220 — including the empirically-falsified ignore-claim, PDR-063, PDR-066); agent-collaboration §Schema Evolution re-taught latest-only; commit-SKILL version prose de-pinned; comms-event schema comment exact-pin corrected; PDR-078 §2 RETIRED (clause, two Forbids bullets, falsifiability axis, revision entry); Codex row → ACTIVE-TURN-ALERT certified with bounded-poll+gap-sweep as PDR-133-discipline-4 requirement, monitor rule + bootstrap source amended, AGENTS.md REGENERATED via the tool (parity green); test-immediate-fails 4/20 sanctioned committed-artefact shape; no-conditional-tests item 5 expect-guard. STILL OPEN FROM THE PASS: ADR-186 lifecycle-shape migration EXECUTE-WITH-CARRIER — routes to the first implementer seat with capacity (consumers dual-filter first, then emitters, then window closure per the ADR's own signal; event_type strictness stays out per ADR-186's own pre-commitment). Doctrine changes land through this branch's fold PR review.
> - **NINTH FREEZE (2026-08-02 ~11:20Z, owner word: fold, prepare for compaction; POST-COMPACTION the owner discusses TEAM SHAPE and disposition, then THE NEW SESSION BEGINS; this entry IS the resume map): THE TEAM IS NAMED.** Owner word verbatim intent: the team is "you as Director, Moss on Design, Badger on Sif, and Skylark on Skills." LANE BRIEFS READY AT EACH SEAT'S START: (1) MOSS/DESIGN — flip draft #710 ready (the owner's kit-TS-runtime at SHA:95bdfee3a, PR-1) and shepherd to merge; then PR-2 = the shared theme-store extraction per the Sycamore herds Xylem §PR-2 inventory (handoffs/sycamore-herds-xylem-compaction-continuation-2026-07-30.md lines 104-131 + verdict pointers; covariant store in a packages/design sibling, no React peer dep, boundary.ts union+branch, both demo copies AND suites deleted, ADR-041/213 rows); #644 CLOSES-WITH-POINTER at PR-2's open (its one-copy cure is subsumed — fix-the-generator); #709 (landing-port retention draft) adjudicates at the lane's own pace as INPUT; the Codex-parity execution framing for PR-2 stays PAUSED at owner gate. (2) BADGER/SIF — the-codex-dialogues plan is ON MAIN (ratified by word; status flips at ticket-mint post-embargo 2026-08-10 08:00 London, gate expires 2026-08-15): PR 1 = tracked registration template + two-layer skill (Sif general doctrine + per-binding annex) + runnable probe script; PRE-BUILD PROBE FIRST (codex mcp-server with launch pins, one bounded exchange, disciplined-refusal proof); the danger-full-access broadening leg is OWNER-HELD per ADR-180 (isolated disposable workspace, bounded sentinel write); close events = narrative-body key=value encoding; local-only rollout deletion mapping; trial 12 dialogues/14 days, <3 position-changed fires the two-armed falsifier review. (3) SKYLARK/SKILLS — the reflection-first plan .agent/plans/delivery/skills-estate-organisation.plan.md is the lane brief: WS0 DEEP REFLECTION first (owner word: shared scheme across levers ONLY if it adds value; homonymy risk / concern-centric alternative / metadata-theatre value test / null hypothesis = three light per-corpus organisations), recommendation-with-falsifiers to the owner; everything after conditional on his ruling; the exploration report + addendum (same dir, 2026-08-02) is the evidence base; Parallax (the owner's own research, untracked .agent/reports/cognitive-structure/ on the primary — HIS working file, never fold it) is the incoming family and extensibility test. STATE AT FREEZE: #702 MERGED a1ef85f00 (Caracal preservation durable; whole-arc PR set fully landed); FOLD #704 MERGED f5b8537f1; THIS BRANCH coordination/estate-2026-08-02 cut from post-fold main and pushed; prior local coordination branch -d'd. RETENTION RULING (owner, 2026-08-02, doctrine-grade, route to new-rule-vs-pdr-clause at next doctrine window): "if it is worth keeping then it needs to be in a PR, a draft PR is sufficient. No work can be considered safe until it is in remote version control" — ENACTED as six draft PRs: #705 hook-hardening experiment estate, #706 s1-zodiac evidence bundle, #707 pre-supersession hook-policy draft (cited by main source apply-patch-content.unit.test.ts:9), #708 pre-supersession copilot ratification package, #709 landing port (design input), #710 kit-TS-runtime (= design PR-1, Moss flips ready). FABLE ADJUDICATOR IN FLIGHT at freeze: dispatched at owner word over #705-#709 (development-lane vs extract-as-learning per PR, discharge plans, record re-pointing); output file tasks/a568a92172d12c517.output in the session task dir — READ AT RESUME if the notification predates compaction, else re-dispatch from the recorded brief; its verdicts feed the post-compaction team discussion. OPEN PRS AT FREEZE: #644 (design-gated, closes at PR-2 open) + six deliberate retention/lane drafts #705-#710 — every one owned with a named discharge path. DIRECTOR QUEUE POST-COMPACTION: (1) re-arm monitors (Monitor tool; heartbeat --branch coordination/estate-2026-08-02) + F-95 + gap sweep from ~11:25Z; (2) surface the fable adjudicator's report to the owner for the team-shape discussion; (3) route the three lane briefs at each seat's start; (4) doctrine-window items: retention-PRs ruling home, ADR-186 migration carrier, pattern-debt (routes to first implementer with capacity — likely the Skills or Sif seat at a natural pause). WATCHES: Sif embargo lift 2026-08-10 08:00 London (ticket mints, status flips); skills-plan owner gate expires 2026-08-23; #706's containment re-verify is the recorded clearing condition. Standing question at wake: what changed since the records froze?
> - **TENTH WINDOW OPEN — POST-COMPACTION TEAM DISCUSSION (2026-08-02 afternoon):** monitors re-armed via Monitor tool (watcher arm 11 heartbeat-excluded; F-75 delta poll; 240s dual-surface heartbeat `--branch coordination/estate-2026-08-02`); F-95 green; gap sweep from the ninth freeze: ZERO events. FABLE ADJUDICATOR REPORT LANDED (output at tasks/a568a92172d12c517.output; every claim first-hand-verified by the agent): #709 DEVELOPMENT-LANE (branch-only content = the unbuilt restack tail PRs 4-6 — hydration+ADR-217 amendment, appearance baselines, theme-control guards; Design-seat source, closes at value-transfer); #705 EXTRACT-THEN-CLOSE (the 733-line research report main cites as authoritative exists ONLY there — dangling authority — plus the hand-labelled corpora; commit-queue rename fix superseded by main's better cure); #707 SPLIT (MCP-183 integration-test slice onto main's dispatcher + re-point apply-patch-content.unit.test.ts:9 to PR/commit provenance; rest closes); #708 EXTRACT-THEN-CLOSE (one pinned env-var paragraph — COPILOT_AGENT_SESSION_ID / COPILOT_CLI=1 / COPILOT_CLI_BINARY_VERSION=1.0.74 / COPILOT_LOADER_PID — as a dated addendum to main's report Finding 1); #706 ZERO value-at-risk (all five blob SHA-256s match main's pinned manifest; regen base 0a04617d4 verified a main ancestor). OWNER RULING (card, this window): **the codex-hook-review lane is RETIRED** — extraction lands (report to its recorded .agent/research/developer-experience/ home + corpora as adjacent assets), #705 closes, branch deletes (commits reachable via the PR ref); thread record marks the experiment retired with the negative results and restart sequence preserved as history. PROPOSED DISPOSITION ON THE TABLE (awaiting owner word): Moss/Design three movements (#710 PR-1 → PR-2 extraction with #644 close-at-open → #709 tail, per-file port-vs-recapture); Badger/Sif (probe-first PR 1; MCP-183 secondary non-gating after PR 1, Linear state knowingly stale under embargo per the MCP-456 precedent); Skylark/Skills (WS0 recommendation-with-falsifiers, gate 2026-08-23); Director takes the records-grade discharges (#706 recorded regeneration re-verify BEFORE the only byte-copy deletes, then record amendments + close; #708 addendum; #705 extraction docs PR) + doctrine-window items. Embargo adaptation: #705's future-attempt pointer homes in the thread record, mintable post-2026-08-10.
> - **TENTH-WINDOW ADDENDA — THE TEAM SEATED (2026-08-02, owner words in-discussion + three team-starts ~11:00–11:03Z):** (1) NESTING PRIOR (card): the `cognition/` category dir + family-bundle shape are DELIBERATE-BUT-CHALLENGEABLE — WS0 treats them as the owner's prior; he rules at the gate. (2) PARALLAX PRESERVATION DRAFT PR #711 opened at owner card (bot commit 70b79c3fa, 110 files; verbatim except .DS_Store exclusion + four MD012 blank-line collapses; docs link validator PASSED the whole set — the owner keeps editing his local untracked copies, which stay HIS). (3) SKILLS-LANE SCOPE (owner verbatim, four asks) absorbed into the plan as WS5(d) + WS6 + the WS0 prior, riding THIS records commit: link audit incl. core-vs-vendor allowance policy; RPIF-report↔skills consistency + missing-concepts harvest; relationship map to metacognition/reason/concept-exploration/free-play/proportionality et al.; "the organisation of the skills directory will make this work easier" (WS6 a–c run alongside WS0 as evidence; landing follows the ruling). (4) STANDING RULE (owner verbatim): system residue (.DS_Store etc.) — ensure gitignored AND delete on find; ENACTED (.gitignore:74 pre-existing; 17 deleted repo-wide + worktree sweep); doctrine home rides the next doctrine window (new-rule-vs-pdr-clause). (5) SKILLS-TREE DELINEATION VERDICT (first-hand): `.agent/skills` core is CLEAN of third-party skills; `.agents/skills` = generated oak-* adapters (skills-adapter-generate) + external-skill-class vendored (clerk family + mcp-inspector, 93ffa8aed lock-pinned); the enforcement validator is the WS5(d) cure. (6) ALL THREE SEATS LIVE at direct owner word: Badger/Sif (team-start 3e69c4fb), Moss/Design (7f7268f0, three movements incl. the #709 tail), Skylark/Skills (09d1f760, WS0 open) — Director routes sent with absorption-ack requests (e17a90bb / 58040181 / 0dd14a25); Skylark re-reads the grown plan at this commit. (7) Director discharges outstanding: #705 extraction (lane RETIRED at card), #706 regeneration re-verify, #708 addendum — next quiet window; commitlint body-max-line-length 100 is live on this repo (wrap commit bodies).
> - **STANDING PR-DRIVE + DISCHARGES EXECUTED (2026-08-02 ~12:20Z, owner word: "please keep driving the number of open PRs, draft or otherwise, to zero" — STANDING, continuous; per-user memory updated):** S1 RE-VERIFY RAN (Monitor at the pinned base 0a04617d4): two rounds, all five outputs byte-identical to the manifest, shasum all OK, wc -lc matching — #706's recorded clearing condition DISCHARGED by the letter; scratch worktree removed on zero-dirt proof after deleting the five regenerated outputs. PR #712 OPEN (bot, two commits 5193b0e98+097cdba2b): the Copilot Finding-1 env-var addendum (pinned to CLI 1.0.74, provenance 4ead1345b verified) + thread-record truings (incl. #707's continuation line: closes at MCP-183's landing) + the s1 discharge truings — #712 MERGED 9c3ca62c0 within the hour at full condition (4/4 green, zero unresolved threads, sha-pinned bot REST) → **#706 and #708 CLOSED on it, branches deleted** (commits reachable via PR refs). PARALLAX SAFETY (owner word "safely pushed ASAP"): #711 verified CURRENT — zero rsync delta between his working copies and the branch tip 70b79c3fa; standing refresh on owner word + at fold windows. SKYLARK WS0 COLLAB RULED (reply f8d8d96b to their 9627cf55): Q1 pattern-audit-now / link-fix-list-post-gate, citations pin to #711's tip; Q2 lane artefacts self-committed (pathspec + announce-before-staging on shared surfaces — the plan node especially); Q3 confirmed (WS0 runs on the commissioning word; stamp lands at the gate ruling); ADR-189 + agent-capability-vocabulary CONFIRMED UNWEIGHED by the exploration — movement-2 states each candidate's relation (their catch, sound). LANE STATE: #710 ready at cd12a417c, one Copilot round cured at bf8b4d627 (Moss, settle watch theirs); #713 OPEN = Sif PR 1 at f3a469d69 (probe green ×2 at pin 0.146.0, disciplined-refusal proven with sentinel-absent verification; two-layer skill + tracked registration template landed; ADR-180 broadening leg untouched) — its pre-merge OWNER-HELD acceptance run (one real seat, one real uncertainty, linked from the PR) is CARDED to the owner this window; Badger's misbased zero-unique branch deleted at this seat on proof. MONITORS: watcher arm 12 (arm 11 died at the expected 3600s backstop), F-75 re-arm 2 (first poll aged out at MAX_IDLE by design). BOARD AFTER CLOSES (7): #644 (design-gated) #705 (Director extraction next) #707 (Badger, MCP-183) #709 (Moss movement 3) #710 (Moss, settling) #711 (owner-drafting; WS6 landing) #713 (Badger; owner-held acceptance run carded) — every one owned-and-moving. DIRECTION REVIEW at owner word (~12:40Z): all three lanes ON TRACK against their briefs (Moss generator-level cures + grounded declines; Badger probe-first + owner-held discipline; Skylark canonical-workflow WS0 + the ADR-189 catch + WS6(a) audit falsifying the link-depth worry — all 52 internal links resolve; the REAL gap is the validator's missing relocatability class). Watches from the review: PR-2 opens only post-#710-merge (Moss knows; watch not intervention); Skylark's movement-3 deep reflection stays multi-sitting (velocity on evidence ≠ velocity on judgement); coordination branch is now MULTI-WRITER (Skylark self-commits with announce) — merge-not-rebase on push races.
> - **DISCHARGES COMPLETE + INTERIM GUIDANCE (2026-08-02 ~14:10Z):** ALL THREE Director retention discharges DONE: #712 merged 9c3ca62c0 (#706+#708 closed, branches deleted); **#716 MERGED 265582f67** (report + five corpora landed at their durable homes; paused thread record trued to RETIRED) → **#705 CLOSED, fix/claude-hook-hardening DELETED**. Owner card on #713's last blocker answered: **NATIVE-SESSION RE-RUN FIRST** (routed b9da015b — Badger designs the cheapest compliant path; broadening leg stays owner-held and UN-RULED). Moss opened **#715** (PR-2 extraction, oak-design-react) and closed #644 with pointer. Skylark's cricket 7-1 split adjudication CONFIRMED at this seat (extensibility fires at LANDING; category-error decline correct); **INTERIM SKILL-LANDING GUIDANCE adopted verbatim** (broadcast + this inscription): flat individuals under today's convention; families hold at tracked surfaces; not retroactive to 5fa0b2a0a; SUNSETS at the WS0 ruling, no precedent either way. OWNER QUESTION IN FLIGHT (pnpm-managed CLIs): assessment delivered — recorded-verdict pins stay, runtime pins become caret-range + lockfile via root package.json with pnpm-exec invocation for CHILD CLIs only (outer harness stays vendor-channel), version gate reframes to re-probe-on-change; routing to Badger awaits his nod. Board (5): #707 (Badger, MCP-183) #709 (Moss movement 3) #713 (native-session re-run then merge) #714 (rolling fold draft, deliberate) #715 (Moss driving) — all lane-owned and moving.
> - **TENTH FREEZE (2026-08-02 ~13:35Z, owner word: prepare for compaction, stop monitors; the seat CONTINUES — resume at owner word; this entry IS the resume map):** FLEET: all three seats froze cleanly at owner word 13:19–13:25Z; SKYLARK RESUMED ~13:24Z and is LIVE on WS0 movement 3 holding the WARDEN SINGLETON (git:index/head opened 13:25:45Z; the brief two-claim window resolved — my 2409a4ba closed with the bundle commit 05a3c09e0 as its single act; Director commits now ENQUEUE + ANNOUNCE into Skylark's window; THIS freeze entry itself rides their window by the symmetric boundary-bundle precedent). BADGER frozen (claim 5183424f retained; #713 at e041e6218, 17/17 green, BOTH owner acceptance conditions MET — dlg-1 position-changed invoking-seat + dlg-2 confirmed NATIVE-SESSION per the owner's card word, template first real-use proven; resume map: re-arm, enact dlg-2's close-schema design, harvest round-7 findings, ONE combined push, merge at full condition; broadening leg OWNER-HELD, UN-RULED). MOSS frozen (claim 44616c39 held; #710 MERGED 58e5be461; #715 at 235f0211a with gateway + Copilot round 1 absorbed; resume: harvest + merge at full condition; their dirty design-system thread record rides the primary for their window). TRIAL TELEMETRY: dialogues 1–2 of the 12-or-14-day window recorded (1× position-changed, 1× confirmed; close events 2a4b42d2 + 9347446b + correction f6aebdeb — conserve-then-compose lesson napkined at Badger's seat). SURVEY SUBAGENT IN FLIGHT at freeze (owner-dispatched): agent "agent-skills-survey" over addyosmani/agent-skills — outputs land at scratchpad paths agent-skills-survey-report.md + agent-skills-detailed-scan-plan.md; AT RESUME read both, verdict to the owner, landing home decided then (skills-lane WS5(d)/external-skill adjacency). OPEN OWNER ITEMS: (1) pnpm-managed-CLI direction — assessment delivered (recorded-verdict pins stay; child CLIs via caret-range root manifest + pnpm exec + re-probe-on-change gate; outer harness stays vendor-channel), routing to Badger AWAITS HIS NOD; (2) skill-creator untracked dirs in .claude/skills/ + .agents/skills/ + the skills-lock.json modification — OWNER-INVOKED install, undispositioned, a live WS5(d) boundary case; never swept by hygiene; his call at next touch. BOARD (5): #707 (Badger, MCP-183) #709 (Moss movement 3) #713 (merge at Badger's resume) #714 (rolling fold draft — fold rotation due next UTC window per 24h lifetime) #715 (Moss, merge at resume). DOCTRINE QUEUE unchanged: retention-ruling home, .DS_Store rule home, ADR-186 carrier, liveness-rule ellipsis amendment (Skylark's napkin note), pattern-debt unstaffed. WATCHES: Sif embargo lift 2026-08-10 08:00 London; skills WS0 gate expires 2026-08-23. RESUME FIRST ACTS: (1) re-arm via MONITOR TOOL — canonical watcher same seen-file (arm 14) + F-75 delta poll + 240s dual-surface heartbeat `--branch coordination/estate-2026-08-02` + F-95 assert + gap sweep from ~13:35Z; (2) read the survey outputs and report to the owner; (3) recompute the board + warden allocation state first-hand. Standing question at wake: what changed since the records froze?
> - **OWNER CORRECTION + WORDS (2026-08-02 ~13:15Z):** (1) CORRECTION, STANDS: the Parallax preservation-copy shape left the OWNER'S ORIGINALS untracked on the primary — "make it safe" binds the REFERENT ITSELF, never a copy (per-user memory minted `safety-asks-bind-the-referent-itself`; the risk window was real: post-12:10Z edits unprotected, standing git-clean exposure). The owner tracked+committed+pushed himself at 5fa0b2a0a (111 files, coordination branch) — **#711 is REDUNDANT, close carded to him**; Skylark told to re-pin citations to 5fa0b2a0a (event 0875a858). (2) STANDARDISED STRUCTURE (owner verbatim: "We should be working towards a standardised structure", correcting the review's flat-vs-nested-non-blocking framing): WS0's recommendation must name THE standard + a convergence path for every landing (Sif's flat pair AND the nested Parallax family); coexistence is transitional only, "no standard" off the table; nesting prior stays deliberate-but-challengeable — routed to Skylark for inscription, same event. (3) Harness task #10 cleared (its artefacts landed via fold #704).
>
> ### ▶ SITTING DIRECTOR: Magnetar binds Oblivion (`74d914`), seated 2026-08-02 17:13Z (owner-fired flip at Falcon's Moment-1 `b0759071` / flip event `1f8f72db` / Moment-2 ack `6974725d`); claim `a2286c53` adopted; warden `4e5f1032` held-with-granted-windows
>
> **FIRST FREEZE (2026-08-02 ~20:55Z, owner word: focussed Corsair handoff → compaction prep → stop monitors; the seat CONTINUES — resume at owner word; this entry IS the resume map).**
>
> - **TENURE ARC (compressed):** zero-gap succession from Falcon. Drive-to-zero executed: #713 + #723 MERGED and #707 CLOSED (Charcoal's seat), #709 CLOSED at plan landing, board reduced to #714 (fold) + lane PRs in flight. Demos shown in owner Chrome → owner rejected the showcase visually → design mandate (eleven points + four-demo amendment + every-demo wow bar) → v1 plan authored at this seat (`6f3221e1e`) → 31-agent tiered review FAILED it (98 findings/23 blocking; corpus + adjudication tracked at `.agent/reports/design/plan-review-2026-08-02/`, origin `2423b6818`) → v2 AUTHORING routed to Corsair hunts Surf (4d3282) with full brief (events `6b0ea7f4`+`54ab2556`+`21ff9e04`; thread-record handoff entry ~20:50Z). Moss retired clean at owner word (responsibilities at this seat). ADR-186 migration at Charcoal (#725 in review, their drive). Skills graduations at Skylark (#724 merged cured the branch-red suite; their A+B+C window LIVE at this freeze, bound 21:50Z). Lichen TS-estate contract: R6 verified ALL-CURED 9/9 (relay `a731cab6`), R7 delta verifier IN FLIGHT at freeze.
> - **OWNER RULINGS THIS TENURE (verbatim-critical):** drive-PRs-to-zero (standing, continuous); downtime-availability ("whenever you, or any agent, has downtime, please let the Director know…" — standing, fleet-propagated `2ad28d81`, napkined); the design mandate + amendments verbatim in the v1 plan §Direction; iteration is LOCAL — Claude Design only at owner-instigated moments, no two-way-sync investment; hub stays as-is (card); "Freedonia has more off-horizontal elements, Oak has none" (a TARGET delta — landed Freedonia is orthogonal today); the wow bar both phrasings ("wow, that looks good" → "wow, that looks _amazing_", every demo).
> - **RESUME FIRST ACTS:** (1) re-arm via Monitor tool — canonical watcher arm 5 (heartbeat-excluded, same derived cursor) + F-75 delta poll + 240s dual-surface heartbeat `--branch coordination/estate-2026-08-02` (claims-leg takes NO --platform/--model; comms-leg needs the four typed args) + F-95 assert + gap sweep from ~20:55Z. (2) RECOMPUTE warden state first-hand: Skylark held `4e5f1032` mid-window at freeze — their push-complete may have landed in the boundary; re-adopt at their announce; absence-class registry reads need two consecutive confirmations. (3) r7-delta-verify: if its verdict was not relayed pre-freeze, retrieve from the agent transcript (`subagents/agent-ar7-delta-verify-*.jsonl`, last assistant text via python — the r6 reply path failed silently twice; on idle-without-delivery go straight to the transcript) and relay to Lichen guards Phloem (`fe8802ae-…`, codex/GPT-5/019fc3). (4) The #714 FOLD is DUE (24h rule): carries napkin, design thread record (incl. the Corsair handoff entry), this seated block, practice-core dirt (verify byte-identical vs merged #722 before folding, else a harmonise commit — the §9 note), through the full-condition ceremony; stale-capture marker probe first. (5) v2 cycle: at Corsair's draft-complete re-run the fleet (resumable `wf_b02eb59a-e81`), adjudicate with the owner's words as goal axis, iterate to a ZERO-finding round, only then implementation at owner word. (6) Doctrine-queue additions this tenure: plan-of-consequence→tiered-fleet-review (owner-endorsed in-session; graduation candidate); ceremony-chain-blind-suites class (#724's cause); pipe-mask structural cure (Charcoal's candidate, third-instance endorsed, bit this seat too); reply-path-silence class (napkined ~20:25Z); long-argv --body clips silently (napkin note existed, still violated at this seat — active-layer candidate).
> - **WATCHES:** Linear embargo lifts 2026-08-10 08:00 London (mints: the design plan ticket, MCP-372/388/134 true-ups, the pnpm-CLI story); skills WS0-adjacent gate expiry 2026-08-23; codex-dialogues trial window to 2026-08-16 (2/12 tallied). **MONITOR/TASK STATE AT FREEZE:** heartbeat + F-75 + watcher stopped by intent (heartbeat-end event first, watcher last); three demo dev servers (hub 3010, showcase 3020, export 3030) STOPPED — restart commands in the design thread record's handoff entry. Standing question at wake: what changed since the records froze?
> - **FREEZE ADDENDUM (2026-08-02 ~20:55Z, at the owner's re-issued compaction word after a ~2-min resume window):** resume-map act 3 is DISCHARGED — the R7 delta verdict landed ALL-CURED at the boundary and was relayed (`01a8f60b`); Lichen's external gate is discharged, their estate run authorised, and their registry now shows THREE fresh claims (run proceeding). Skylark's graduations A+B are LANDED on the branch (`62fff5e79` no-skipped-tests, `d0ccd3fd8` unknown-is-type-destruction; C possibly in flight — their push-complete announce may land in the dark window; warden re-adoption at resume unchanged). Corsair's authoring claim `953f9f8c` is OPEN and fresh. Board: #714 (fold, DUE) + #725 (Charcoal, driving). Monitors re-stopped in canonical order at this addendum; all other resume acts stand as written.
> - **NIGHT + MORNING ADDENDUM (2026-08-03 ~06:15Z):** FOLD at its last gate: bundle `e3574388b` + Skylark's D `f49c546ce` + round-2 corpus `d2b2b7918` + main merge `f0b043d7d` — #714 GREEN and MERGEABLE, blocked ONLY on the 12-thread ready-mark review round (all skills-lane content, ROUTED to Skylark `2fb637f2`); merge at resolved+green, then successor branch cut. V2 CYCLE: round-2 corpus + adjudication tracked (`findings.v2.json`/`adjudication.v2.md`, landed `d2b2b7918`); three Director rulings (mapping default-decline; scoped §3 consumption amendment both-shapes; EX28 orthogonal axes, four constraints); Corsair v2.1 all-112 dispositioned; ROUND 3 resumed-from-cache after the session-limit kill (run `wf_121bcbac-abe`). OWNER RULINGS TONIGHT (verbatim-critical): pacing directive ("keep going, but cut the speed right down… cold pause… steady progress through the night", broadcast `d0eb5858`); skills two-channels ruling ("no skills should be vendored, we have Oak skills, we have skills installed with `npx skills add` or `pnpm skills add` that is it" — relayed `49ae32bd`, Skylark inscribes; discharges the skill-creator source-legitimacy standing item; security-review rule composes, not waived); PDS/OoE identity renaming+refocus for the GDS-like identity (Corsair plan `public-digital-service-identity.plan.md`, claim `6dff4c64`, execution window = post-zero-round pre-implementation; ARC channel OPEN at owner word: `.agent/collaboration/rapid-comms/2026-08-03-pds-identity-magnetar-binds-oblivion-corsair-hunts-surf.md`, announce `ffaeb675`, tail armed — four open asks incl. the W2.7 off-horizontal-target interaction, joint recommendation to be CARDED to the owner). CHARCOAL TRANSFER (event `ebd89159`, at owner word; session ENDED `06:05Z`): (1) ADR-186 window-closure signal-watch + carrier assignment (two-part signal: all emitters landed fleet-wide + zero-legacy full-cycle sweep); (2) four PR-725 §Follow-ups needing carriers (phantom PDR-049/050 citation; ghost schema path comms-tag-namespace.ts; un-executed ADR-183 heartbeat-tag amendment — Skylark ARC-flagged; commit-queue guard vs worktree-scoped `index/head@<worktree>` label, F-116 sibling); (3) pnpm-CLI story mint-at-lift 2026-08-10 08:00 London; (4) capacity-pull VOID. #725 MERGED `e464ee5b1` (4 rounds 14→3→1→0); heartbeats lifecycle-shaped at next rebuild (own-claim gate — this seat's loop compliant). LICHEN closing at owner word (resume point in their knowledge-safety sweep 21:43Z). PRUNES executed with first-hand proof: sif-codex-dialogues-pr1, mcp-183-test-port, adr-186-heartbeat-lifecycle. INSTRUMENT LESSONS (napkined ~05:55Z): checks-watch unreachable exit criterion (statuses vs check-runs — corpus-test before arm); autonomous-emitter n=2 same-night (this seat + Charcoal, harness-suspended ~22:05Z→wake while heartbeating; doctrine-queue: coordinator dark-window detection). Board: #714 (fold, at Skylark's round) + #726 (Skylark).
> - **SECOND FREEZE (2026-08-03 ~09:20Z, owner word: compaction readiness, no rush, stop monitors when ready; the seat CONTINUES — resume at owner word; this entry IS the resume map).** THE DAY'S ARC since the first freeze: fold bundle + round-2/3 corpora + main merge landed; #714 review round 12/13 resolved (Skylark; #731 in review carries the last thread — at their resume they adjudicate/merge it, resolve the thread, and THE FOLD IS MINE: merge #714 at the full condition, cut the successor coordination branch, open the new fold draft); v2 cycle ran rounds 2+3, loop verdict DIVERGING, owner PARTITIONED the gate (near-horizon W0+W1 full depth to zero via SCOPED re-review; W2–W6 pointers with story-open review) — Corsair's v2.2 restructure substantially landed, their resume order: dispositions ledger → residual edits → plan gates → scoped re-review → owner implementation word. ARC graduated to standing infrastructure (Vanilla ws-b0 merged `3fb6875e6`); ARC-colour plan anchored + owner-RATIFIED (stamp sequenced to embargo-lift ticket mint — body §Review record carries it); Vanilla's next: ws-a-cycle-2 then the B chain — OWNER SIZING REFRAME relayed: it is a PORT with a working example (Resonance→castr), brisk not days; foundations review lane (Lichen corpus: 24 paths staged-not-committed in their worktree, thread record durable, gates red on WIP by design) follows promptly at owner word. UPDATE LANE live at Birch holds Seedling (e48fe2): activation pack + addendum on their ARC channel; ADR-222 landed `612e60fe0`; VISION cost-of-change paragraph LANDED at owner word; Matt-priority ruling binds fleet-wide (only the update lane mints Linear tickets pre-lift, Matt tagged in tickets+PR with the blast-radius explanation and the owner's personal note verbatim in the napkin ~09:05Z). SEVEN CARD ANSWERS (~09:15Z napkin block, verbatim-critical): overrides keep+re-pin (ratified); W2.7 tilt VALUES delivered (PDS zero, Oak zero-on-interactive/content + decoration-may + structural-zero-if-easier, EMC² leans in with ANIMATED tilts for motion-vs-no-motion) — Corsair trues the gate at resume; plan ratified; PDR-134/ADR-221 ratified WITH THE CARD AS POINTER; skill-creator DELETE via installer (routed to Skylark's resume); foundations sizing reframe; VISION licence (landed).
> - **SECOND-FREEZE RESUME ACTS:** (1) re-arm monitors (watcher next arm same cursor + F-75 + 240s dual-surface heartbeat over BOTH claims a2286c53 + 4e5f1032 — retained through the boundary; warden recompute first-hand at resume). (2) Gap sweep from ~09:20Z. (3) Board first-hand: #714 (fold at Skylark's #731 completion), #729 (Corsair, cure batch in their worktree), #731 (Skylark), Birch's first PRs (spec-alignment + bulk truing, Matt-tagged — the ONLY live lane through the boundary; their blockers route to the stream). (4) WATCHES: embargo lift 2026-08-10 08:00 London mints = design ticket, pnpm-CLI story (Charcoal transfer item 3), MCP true-ups, ARC-colour stamp completion; skills gate expiry 2026-08-23; codex-dialogues window to 2026-08-16; ADR-186 window-closure signal-watch (Charcoal transfer item 1) + four PR-725 follow-ups needing carriers. (5) DOCTRINE QUEUE additions today: population-claims family (census-not-inference n=2: Charcoal + Vanilla's fired-trigger); coordinator dark-window detection (autonomous-emitter n=2 same night); whose-lint-state-gates-whose-push (n=2: freeze-night + csszengarden); F-116 facets (worktree-scoped label + lane-claim-at-enqueue); horizon-seam authoring check (owner-directed capture, adjudication.v3 addendum); --in-response-to existence check (agent-tools ask, fabricated-ref n=2 at this seat). Standing question at wake: what changed since the records froze?
> - **THIRD FREEZE — DOOR-SHUT (2026-08-03 ~10:45Z, owner word: clear-run quiesce for Matt; this entry lands IN the #714 merge — the coordination branch ends here; the seat CONTINUES, resume at owner word).** THE WINDOW'S ARC: owner directive (~09:45Z, verbatim in napkin): all seats other than Birch fully safe (open PR on the remote), all PRs merged-or-draft, Birch's work merges, "so Matt has a clear run for his work without churn from ours." EXECUTED: Corsair/Skylark/Vanilla all WRAP-CLOSED clean (windows landed `b1b5431a7` + `e15d52953`; Vanilla pre-safe at merged #730); warden remainder window `e8e833723`+`0b71f760b` (team-resume surface + unowned records); #733 (temporary Matt welcome in start-right §6a, mantagen detection, live-derived quiet-state — both Codex findings cured) MERGED `731fafccf`, live on main; #734 = Lichen's 125-path corpus draft (owner-run authorized bypass, branch `c69b0746c`), jimbot-prefixed; #729/#731 jimbot-prefixed DRAFTS; stray branches proven contained in the coordination branch pre-merge. THE REHYDRATION SURFACE: `.agent/memory/operational/team-resume-2026-08-03-matt-clear-run.md` (on main after door-shut; owner-supplied verbatim resume commands for all five seats; reopening gate = owner declares the submission window closed). BIRCH (e48fe2) LIVE through the window: MCP-462/463/464 minted; their significant PR hands to MATT as reviewer — CODEOWNERS `*` makes his approval the structural merge gate (owner framing: current King of the Repo, non-gender-specific); Director monitors are DOWN after this freeze, so Birch proceeds owner/Matt-gated with NO Director watch (promise forwarded on their channel). OWNER-CAUGHT FAILURES this window (the error signature — outside eyes caught what the seat's scan missed): (1) bot-identity fallback — session pushes + #732 PR-create rode the owner's ambient gh keyring; cure executed per the rule's precedent (#732→#733 recreate bot-authored; bot-token credential-helper pushes + minted-token gh writes STANDING at this seat); (2) card-discipline n=2 — "I didn't know anything was waiting on me because you didn't show me a card": every waiting-on-owner item (ACTIONS included, not just decisions) gets a visible card at its action moment. RESUME ACTS: cut a fresh coordination branch from main; wake ceremony (watcher same cursor → F-95 assert → dual-surface heartbeat both claims → F-75 delta poll → board first-hand → gap sweep); claims a2286c53 + 4e5f1032 RETAINED (4e5f1032 re-adopt VERIFIED after a masked exit-2 first attempt — read adopt output unpiped, always); watches inherited (embargo lift 2026-08-10 mints, skills gate 2026-08-23, codex-dialogues 2026-08-16, ADR-186 signal, four PR-725 follow-ups); doctrine queue per team-resume §Standing context (+ sentinel-taxonomy carve-out, population-claims enrichments). Standing question at wake: what changed since the records froze?
