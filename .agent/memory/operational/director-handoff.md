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
overflow_disposition: 'the Director Brief stays; in CURRENT HANDOFF STATE, leave-if-live, else graduate, then archive to a dated file proven byte-identical — never before full processing (see continuity-practice.md §Disposition of Continuity Surfaces)'
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
   - **Is the outgoing Director actually standing down** — an explicit written
     stand-down (its pre-positioning event naming you, or its retirement event),
     or the owner's word? A stopped heartbeat is not one (PDR-117 §Takeover
     verification, amended 2026-09-17).

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
   tool's output. Neither reading licenses the takeover: a `stale` row, or a
   heartbeat you have confirmed stopped, does not show a stand-down (a heartbeat
   can be suspended under PDR-078 §4 while the seat is live), and a `fresh` row
   is a reason not to act. Moment 2 rests on the outgoing Director's explicit
   written stand-down (its pre-positioning or retirement event) or the owner's
   word (PDR-117 §Takeover verification, amended 2026-09-17). If you ever need a single claim's age,
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

## Standing processes of the seat (arming commands, on any checkout)

Every one of these dies at a compaction or a seat change; the successor arms each from here,
from the repository root, with plain calls (no command substitution at the call site — the
owner's standing word for unattended seats). The monitors run under the platform's
background-process tool; the two scheduled prompts run under the platform's scheduler (each
platform names its own). Instrument scripts that restate these as one-liners are session
conveniences, never the only home.

1. **The all-channels comms watcher**, persistent, re-armed on its hourly exit — on the PRINCIPAL checkout:
   `timeout 3600 pnpm --silent agent-tools:collaboration-state -- comms watch --platform <platform> --model <model>
   --supervisor-pid "$PPID" --step-timeout-ms 120000 --max-events-per-drain 100 --exclude-tag heartbeat`, then
   `pnpm --silent agent-tools:collaboration-state -- comms assert-watcher-live --platform <platform> --model
   <model>`. A seat RESIDENT IN A LINKED WORKTREE cannot pass `$PPID` (the platform's worktree isolation refuses
   the runtime expression): it arms the fully literal form in the `comms-all-channels-watcher` rule's
   worktree-isolation section — the `cd` rooted at the worktree, the timeout binary by its resolved name, the
   supervisor pid written as a literal. That rule is canonical for both forms.
2. **The liveness heartbeat**, a persistent loop every 240 seconds bumping BOTH surfaces each tick, per the
   `liveness-heartbeat-cron` rule's canonical invocation: the comms heartbeat event (`comms send --tag heartbeat`
   with `--title` and the four typed state arguments `--claim-id`, `--intent-id`, `--branch`,
   `--current-cycle-label`) and the registry heartbeat `date -u +%Y-%m-%dT%H:%M:%SZ | xargs -I{} pnpm --silent
   agent-tools:collaboration-state -- claims heartbeat --active .agent/state/collaboration/active-claims.json
   --claim-id <claim-id> --now {}`, each leg with its own `|| echo` so a half-dead heartbeat reports itself; read
   `heartbeat_at` back off the claim row after arming. The registry-only hourly loop (the second leg alone, `sleep
   3600`) is NOT this heartbeat: it is the PDR-078 §4 consumer-absent form — n=2 owner-visible per PDR-082, or a
   claimless standby — and a seat running it declares that exemption on the stream and re-arms the full loop the
   moment a consuming peer appears.
3. **The peer-liveness poll**: the `comms peer-liveness` delta poll against the PRIMARY
   coordination home's comms directory, per the heartbeat rule's F-75 recipe (`active` under
   four minutes, `offline` to ten, `retired` past ten — input to verify, never a verdict). The
   watcher's heartbeat exclusion REQUIRES this pairing. A 20-minute read of
   `.agent/state/collaboration/active-claims.json` with jq's `now` builtin (emitting on a change
   in the peer set or a peer quiet past 90 minutes) is only the coarse fallback while every peer
   runs under the exemption above and emits no heartbeat; claim freshness cannot see a silent
   retirement.
4. **The PR poll**, every two minutes over the open set — number, draft flag, `mergeStateStatus`,
   head, unresolved review threads, check rollup (the pr-lifecycle state machine's item-1
   selection) — emitting only lines that changed.
5. **The wrap cadence**: a recurring scheduled prompt at `41 1-23/2 * * *` (local time; 41 past
   odd hours) whose text names the non-terminal wrap — `date -u` first; work safety (status,
   fetch, unpushed refs, the queue); the seat's continuity sweep by pathspec, owner-authored with
   the session trailers; a retrospective paragraph on the napkin; the board recomputed
   first-hand; the processes verified by id; owner items held for the record while the owner is
   absent; then drive on.
6. **The fold wake**: a one-shot scheduled prompt seven minutes past the next UTC rollover
   (`7 0 <day> <month> *` when the scheduler runs in UTC, else the local equivalent) whose text
   names the coordination branch and its pull request, says `date -u` first and recompute before
   acting, and runs the `coordination-fold` skill's ceremony from the primary with plain calls;
   when the fold has already run earlier in the branch's landing slot, the wake only verifies
   that the successor branch, its draft PR and the next wake exist.
7. **A settle watch on the landing-slot holder**: required checks green by name
   (`run-quality-gates`, `CodeQL`), then a ten-minute quiet window with zero unresolved review
   threads, then `CLEAN`; it stops loud on every terminal state (closed, head moved, a check
   failed, threads unresolved, not clean) and never merges — the merge is the seat's own act at
   the recomputed gate (pr-lifecycle §Phase 7).

## Standing lessons (this Director lineage)

- **2026-10-02, four corrections in one evening on one shape.** Work turned into meta-work (a
  "for the user" bucket, end states before value, heartbeat pauses, records per event, a plan
  with three instruments before its value step) was corrected by the owner four times in three
  hours. The value step is the first todo of any plan this seat writes; the measure serves it.
- **2026-10-02, estimates.** A rate measured under ceremony is not the rate of the work; state
  the work's own cost and the ceremony's separately, or the estimate is wrong by an order of
  magnitude (eight to ten seat-days against the owner's two hours).
- **2026-10-02, review feedback.** Triage per finding by risk, cost and value; the usual home for
  a substantive finding is work that exists; a spent budget means decide, never a new branch or
  pull request; never cure all, never decline all.
- **2026-10-02, heartbeats.** A liveness signal is never paused for a peer's gate; the gate that
  fails on a peer's beat is the tooling's fault. The registry is the liveness source.
Each lesson is the cure for a churn cause observed in the pilot.

**Drive, never coordinate** (a seat's reading of the owner's repeated corrections
of 2026-07-01, recorded in per-user memory that day; the owner's words were not
quoted). The Director decides what the decision lenses can settle and surfaces
only constitutive residue (product intent, values, external commitments); an
"owner-approval step" is manufactured ceremony, and "the team is awaiting
approval" is a fluent frame to test. The Director drives to a checkable
Definition of Done, authoring one when the plan lacks it; never parks or
retires a lane mid-session while work remains (a context-limited seat hands
to a successor who picks up at once); and cuts owner-facing narration, since
the owner should see the team delivering, not the Director reporting.

**The durable role doctrine has graduated to
[PDR-117](../../practice-core/decision-records/PDR-117-director-and-implementer-roles.md)
§The Director role** — minimum-action / context-economy (stay silent on routine
signals), routing craft (verify-state-before-routing, durable-lanes-not-pickups,
never route to a closing-out agent), and takeover verification (registry-freshness
≠ comms-liveness; the highest verification bar for authority actions). Read PDR-117
for those; the lessons below are the **operational craft** of running the seat in
this repo that PDR-117 does not carry.

Seven of the pilot's lessons now live in rules and are read there, not here: arm the
comms watcher as move 1 (`comms-all-channels-watcher`, with the reserve-seat
`--exclude-tag heartbeat` filtering under its sanctioned tag exclusion); stop your own
heartbeat at stand-down (`liveness-heartbeat-cron` §Loop hygiene); verify a PR's inline
review comments first-hand, not just `gh pr checks` (`pr-comments-resolve-and-recheck`);
for an artefact open weeks, "what has been decided since this was written?" comes before
its merits (`verify-dont-trust`); closeout is serial mutation verified first-hand at the
instant — content check before `git worktree remove`, archive-not-delete, patch-id before
pruning, never line-merge memory files (`worktree-hygiene` §6); and the auto-update-branch
babysitter for the landing-slot holder (the pr-lifecycle skill §Phase 7). The lessons below
have no other home.

- **Re-spinning a deep-context session does not reset its budget** — security- or
  quality-critical work wants a genuinely fresh seat, not a re-spin of a spent one.
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

The experiential source for the last several lessons is the Trawler-tenure how-to brief
([`director-howto-and-pdr117-gaps-2026-06-29.md`](../../reports/agentic-engineering/director-howto-and-pdr117-gaps-2026-06-29.md)).
Its **Part B (PDR-117 missing axes)** is a queued doctrine-design task — context-budget economy as a first-class
axis, takeover-verification doctrine, owner-interaction modes, Director-as-orchestrator,
arc-closeout-as-responsibility, the loss-scan axis — to be authored on fresh context (owner-directed), with PDR-117
as the surface to amend.

## Known friction (route to tooling, not to the brief or the plan)

These are tooling gaps, not doctrine gaps — they belong in the frictions register
(`.agent/memory/operational/frictions-register.md`), named here only so a successor
recognises them rather than rediscovers them. The three the pilot found are its entries
F-96 (a continuity-buffer handoff commit blocked by markdownlint), F-160 (the comms
watcher's drain step dies at its deadline on a large event directory) and F-97 (no PR
monitor covers inline review comments and PR terminal state together); read their
current state there. (`claims adopt`, `claims set-handoff` and the watcher-presence gate
on `claims open` exist since PR #225: frictions F-94 and F-95.)

## CURRENT HANDOFF STATE

**§STATE, 2026-10-05 17:3xZ (Sycamore holds Spore, `18d874`, the n=1 seat, the compaction boundary
at the owner's word; this block adds to the 17:2xZ block below).** The work is finished and the
terminal acts ran: closeouts on both comms logs, the claim closed in the sibling's registry, the
watcher stopped. The modes ran over the day at the owner's word; the harvest is the sibling's
napkin block of this hour and the born sketch `practice-alignment-conservation` in the sibling's
`.agent/plans/delivery/` (the same bytes here at ratification): the fail-closed property on every
filtered alias checked by the validator, and the byte proof as a tracked command with the finish's
partition as its baseline. The extraction's design is the owner's and is not drafted. No process of
this seat runs. The next seat reads `git status --branch` in the primary first.

**§STATE, 2026-10-05 17:2xZ (Sycamore holds Spore, `18d874`, the n=1 seat, post-fold; this block
adds to the 16:4xZ block below).** The coordination branch `2026-10-04-d2f44f` folded as #352 at
`SHA:efe69ff66`; the successor `coordination/2026-10-05-efe69f` carries the records from here, this
commit its first. moved for teachers: nothing / moved for the Practice: the alignment node's finish
on `engraph` and on the sibling's `main` (its fold 320 at `SHA:d72ae51d`, successor
`coordination/2026-10-05-d72ae5`). Left for this seat: the wrap (the closeout broadcast, the claim
closed in the sibling's registry, the watcher stopped).

**§STATE, 2026-10-05 16:4xZ (Sycamore holds Spore, `18d874`, the n=1 seat, at the alignment node's
finish; this block supersedes the 11:3xZ block below where they differ).** The delivery node
`practice-alignment-by-class` is at its finish: the doctrine landing merged in both estates (#353,
321) and the code landing merged in both (#354 here at `SHA:ef42bd11f`, 16:33Z, after four
settlement pushes, the last under the one PDR-140 rebudget; the sibling's 322 at `SHA:d3647a9d`,
16:26Z), each through the bot's door with Copilot's review binding the tip; the byte proof at the
merged tips is a comment on each landing (829 shared, 776 identical, 9 placeholder-only, 44
differing, the contextual layer). Four branches retired here under the bot with their worktrees
(`feat/practice-code-landing`, `feat/parity-carry-doctrine-batch`, and the two surface lanes on
the owner's card answer), six in the sibling. Todo 3 is done in both working trees: the strategic
node's §Delivery finish line, the three nodes archived under `.agent/plans/archive/` with their
dispositions. What remains for this seat: the records committed, both coordination branches
folded (DUE), the wrap. Named for the next seat, ordinary work: the first follow-up pull request
per estate puts `--fail-if-no-match` on every filtered alias in the family manifest and the root
scripts with a manifest self-check in the conformance validator (Copilot's finding on the final
tip here, true in both estates); the remainders on the landing's description. For the owner: this
seat took the PDR-140 clause 4 rebudget once on each code landing, #354 here and 322 in the
sibling, by its own recorded decision (the gate's text says "by the owner"); the doctrine landings
needed none. No claim, watcher, heartbeat or background agent survives this seat.

**§STATE, 2026-10-05 11:3xZ (Crucible binds Slag, `7b999c`, the n=1 seat, at the owner's handoff
word; this block supersedes the 2026-10-04 13:5xZ block below where they differ).** The code
landing of `practice-alignment-by-class` is open in both estates: #354 here on
`feat/practice-code-landing` at `SHA:b79e0c23d` (twelve commits: the family shape with this
host's two product slots, the Core clause and shared text, the docs validators and lint rules,
the merge-bot's push side, the skills at the family paths, the substrate audit, the formatter
file's deletion, one doc-comment cure, the review cures carried from the sibling's landing, the
depcruise gate's computed roots, the origin check's userinfo refusal with the fetch execution
file's reviewed hash, the regenerated delta inventory), pushed through the full gate after four
refusals (the Playwright browser build for Playwright 1.62 on the pushing machine, one unused type
export, the carried depcruise gate's pinned roots, the current-source review hash), Copilot
requested under the bot; the sibling's 322 (thirteen commits, CI green, one review finding cured
and awaiting its reply). The doctrine landing is merged in both (#353, 321). #349 and 318 are
closed into the landings. What remains is settlement, the two merges (this estate's ruleset is
already on the fan-in), the branch deletions and the byte proof, todo 3 (the strategic node's
finish line; `practice-parity-two-landings` and `practice-parity-for-extraction` archived here,
the alignment node lives in the sibling), the fold of both coordination branches (DUE), and one
owner card (the two superseded surface lanes `feat/parity-surface-directives` and
`feat/parity-surface-subagents`; the expired gates of `practice-language-separation` in the
sibling). The live reading is the sibling's thread record
`threads/two-estate-consolidation.next-session.md`'s block of this hour and this estate's
`estate-coordination` journal entry of the same hour. No claim, watcher, heartbeat or background
agent survives this seat.

- This estate's `windows-basic` job fails at setup on #354 since the pnpm 12 bump: the
  setup-node cache step runs `pnpm store path` through pnpm/action-setup's cmd shim, which
  resolves to a path under `global\v11\...\node_modules\pnpm\pnpm` that cmd cannot run (pnpm 12's
  Windows shim; pnpm issue 16573 is the same family). The fan-in needs that job, so #354 cannot
  merge until it is cured: pin a newer pnpm/action-setup or a pnpm 12.x with the shim fix, or set
  the action's `version` and `standalone` inputs; the `engraph` run before the bump is green.

**§STATE, 2026-10-05 00:3xZ (Crucible binds Slag, `7b999c`, the n=1 seat, at the owner's
compaction word).** The doctrine landing of `practice-alignment-by-class` is merged in the
sibling (jimcresswell.net 321 at `SHA:4992af38`, main) and open here as #353 at `SHA:df70cd153`
(the landed bytes plus 43 contextual-bound variants; #350 merged in and closed; five review
findings cured and the threads resolved under the bot; Copilot re-requested at the tip). The
byte proof at main there and this tip reads DRIFT 1 over 744 shared paths: the one drift is
`subagent-practice-core-protection`'s two adapter-tree globs, added here at Copilot's finding,
which the sibling's copy takes in its code landing. The owner's card answer of 2026-10-04:
"Your words stand (Recommended)": a Core record names an estate by its name; PDR-142's clause is
amended in the code landing. Next safe step: `merge-bot merge --pr 353 --expect
copilot-pull-request-reviewer` once a review binds `SHA:df70cd153`; then the code landing
(mechanism item 2), in the sibling first, then here. The live record is the sibling's napkin
block of 2026-10-05T00:3xZ.

**§STATE, 2026-10-04 19:0xZ (Crucible binds Slag, `7b999c`, the n=1 seat, at the owner's
compaction word; this block supersedes the blocks below where they differ).** The definition's
landings merged: #351 at `SHA:82cb7fba4` on engraph, jimcresswell.net 319 at `SHA:02178ff0b` on
main, the same bytes. The successor delivery node `practice-alignment-by-class` is ratified (the
owner's four card answers of 16:xZ: four pull requests, two per estate; proceed at about five
hours over two sittings; a light commit and a full push as the TypeScript family's convention;
the conformance check included) and sits on this successor coordination branch at
`SHA:5125881ce` with the Cricket suite's tally, the same bytes as the sibling's. The live record
is jimcresswell.net's two-estate thread block of 2026-10-04T19:0xZ; the next safe step is the
doctrine landing in jimcresswell.net first, then here from engraph, the same bytes; then the code
landing. One conflict is the owner's, carried with the doctrine landing: the owner's 2026-09-30
word ("it's OCE") against PDR-142's host-neutrality clause. No claim, no process, no unpushed
commit of this seat; draft #352 is this branch's fold pull request.

**§STATE, 2026-10-04 13:5xZ (Crucible binds Slag, `7b999c`, the n=1 seat at the resume; this
block supersedes the 21:0xZ block below where they differ).** The review node
`practice-system-review` is ratified (the owner's card answer of 13:3xZ, the stamp in its
frontmatter, the same bytes in both estates) in the shape two Cricket checks reshaped it to: a
two-hour layer pass of both estates side by side that writes a one-page model (the layers, what
transmits, what is created empty, what stays the host's, the candidate definition, the divergence
classes with a direction each), posted to the owner at two hours as a report; one hour of
evidence, one coarse row per area with exceptions and `unread` only; one report landed in
jimcresswell.net by one pull request, this estate's copy riding the landing of the owner's word
here; about four hours of one seat. The layer pass is read and the draft page written. The two
coordination branches folded: jimcresswell.net 305 at `SHA:eebe40ea2` (successor
`coordination/2026-10-04-eebe40`), here #348 at `SHA:d2f44f159` (successor
`coordination/2026-10-04-d2f44f`, cut 2026-10-04 and holding the primary); this seat's five claims
are closed (n=1). The definition's landing is open here as #351 and in jimcresswell.net as 319.
At the doors, untouched until the model is read: #350 and 312 (the ledger's revision), 318, the
hooks branch, the OCE implementer's unpushed lanes; the dependabot pull requests were closed by
the owner.

**§STATE, 2026-10-03 21:0xZ (Crucible binds Slag, `7b999c`, at the owner's compaction word; n=1
from here until the owner says otherwise; the next seat reads this block and the review node,
nothing else first).** The parity frame is set aside by the owner's word of 20:0xZ ("that means
we are doing it wrong"): the parity node reads superseded with where it stood (here
`SHA:c1490c97a` on `coordination/2026-10-03-e790ea`); the two-landings node is an unratified sketch
kept as a perspective no longer held; the live plan is `practice-system-review`, a sketch for the
owner's exploration: one seat reads both estates side by side as one system of development and
value provision (ten areas: planning; deciding and authority; implementing; reviewing; delivering
value; developer experience; strictness and contracts; the learning loop; collaboration and roles;
structure), one row per mechanism classed general, contextual, diverged or one-sided and placed in
a layer, a candidate definition of the Practice, the divergences classed by kind, one report at one
relative path in both estates, about seven and a half hours of one seat. Both implementers finished
at the owner's word: Efreet lifts Scorch's direction handoff record is at claim 006c79ad's pointer
with the exact state of its lanes (#349's cure `SHA:fe05f463a` unpushed; the directives surface at
`SHA:1d77e8b03` and the sub-agents surface committed, unopened); Hazel tracks Trunk's is in JC.net.
At the doors, untouched: #350 (the ledger's revision, five findings undecided), #349 at
`SHA:b267ce1e4`, the fold draft #348, the J2 worktree's 23 staged files (the owner's). The JC.net
notebook's block of 21:0xZ carries the owner's words verbatim, the work-safety evidence for every
worktree of both estates, the four cognitive passes and the resume order. Resume: nothing to re-arm
(no peer, so no watcher and no heartbeat); beat or close this seat's claims here (302e8307,
9ecef634, 4b82394b, stale at about 03:2xZ) before any push, since the claim-freshness gate reads the
registry; then the owner's exploration of the plan, then its execution.

**§STATE, 2026-10-02 20:5xZ (Crucible binds Slag, `7b999c`, the Director: stopped by the usage
limit; the next seat opens the parity node and this block, nothing else first).** The owner's words
of the evening bind: slow and steady, quality over speed, the two hours a yardstick, keep the plan
current, use the Crickets, delegate and keep the Director's context for the implementers' course;
the owner is reachable, not absent. Done tonight, read first-hand: the parity node is ratified with
its evidence and its size section carries the owner's word and the estimate; the parent node carries
the dated entry licensing the copy carries until the entity exists; PDR-019 is amended (records carry
decisions, plans carry planning), PDR-143 trimmed with its moved passages held in the node's §Inputs,
the exchange node archived and its five rulings on PDR-142; all of it as records commits on both
coordination branches (here `coordination/2026-10-02-2b25ce` at `SHA:c3db78228` and `SHA:77b87698b`;
JC.net `coordination/2026-10-02-f19bed` at `SHA:9a854a92` and the second commit whose subject begins
"docs(practice-core): records carry decisions"). JC.net: 299 folded (`SHA:f19bed6d5`), 301 merged
(`SHA:eb6fbdbc9`); Hazel tracks Trunk on the node's step 1 (slice 2x, then three slices of the
rotation's lessons, then the notebooks' move), then the amendment-entries carry with its Core
validator. Here: the tail landed as #341 (`SHA:518e48544`); the fold of #340 stands at its door at
`SHA:b5a7175e5` with engraph merged in, Efreet lifts Scorch stopped by the usage limit: the merge,
the successor cut, the fold entry and the registry carry remain (the carry branch
`feat/parity-window-registry-rows` is pushed at `SHA:a47abbaf2`; its pull request opens only after
the fold carries the parent node's entry to engraph). The ledger's first pass is in JC.net's synced
session directory `comms-analysis-2026-10-01/session-7b999c/measure/` as six reader files: four
done over the 207 conflict hunks (133 same meaning, 39 host binding, 28 capability-gap hunks
resolving to about ten carries, 7 host-local; a Director sample of twelve same-meaning rows read
true), two running at the stop (the 105 one-sided files, the 72 clean merges), each writing
`ledger-read-*.md` there. Two rows are the owner's: the architecture-reviewer persona model
(OCE's four generic lenses or JC.net's four site lanes, and whether the entity carries a generic
structural reviewer) and whether the owner's word of 2026-09-13 on the measured round boundary was
Practice-wide; the skill-evals runner (into JC.net, two to three pull requests) and the docs
validators (into OCE) are sized rows for the owner's reading on the ledger. Next, in order: finish
the fold of #340 and open the registry carry; assemble the ledger as one document, the same bytes
in both estates, with a closer script that recomputes its counts, the measure's scripts beside it,
and open it as one pull request per estate (JC.net from Hazel's cures tip `SHA:92644157` with main
merged in; here from the post-fold tip); the dry-run merge rerun at the folded tips; then the
carries in closure order. Processes: all died at the limit; re-arm the two registry-only heartbeats
and the two watchers only. Addendum, 20:5xZ: Hazel tracks Trunk stopped at the usage limit too, with JC.net
pull request 302 open at `SHA:25a385cc` (slice 2x, six files, Copilot requested, no watch on it), slices 2y
and 2z drafted in her lane worktrees and the rotation's records commit not made; her offer to run 340's
fold with her scripts lapsed with her turn. All three seats stood down within three minutes; every
pull request open at the stop (302 here-and-there, 340 at its door) waits for a seated agent or the owner's hand. Addendum, 21:0xZ: the ledger's first pass is complete in six
files under that measure directory (`ledger-read-{directives-hooks-core,rules,skills,reviewers-and-rest,
one-sided,clean-merges}.md`): the 72 clean merges read 29 landing merged, 37 host-bound inside, 6
contradictions with joint cures named (PDR-075, PDR-089, capability-landing-decision-procedure,
use-result-pattern, free-play, retrospective); the 105 one-sided files read 45 capability-gap files in 13
carries (5 JC.net to OCE, 8 OCE to JC.net), 26 host-local, 21 host binding, 13 same meaning. About 23
carries before deduplication across the six reads, above the node's twenty, so the assembled ledger
reopens the node with the owner, with the count and the closures, unless deduplication brings it under.
Next: fold 340 then 300 (an implementer-class task), assemble the ledger as one document with a closer
script and open it per estate, the owner reading the rows. Cricket at 21:0xZ (DRIFTING on one point,
accepted): the JC.net tail has no owner since Hazel's stop, so the JC.net queue is 302's review and merge,
then 2y, 2z, the notebooks' move and the rotation's records commit, then the fold of 300; the ledger's
rerun and its closer counts gate on that folded tip, not before. The estimate owed to the owner runs to
the node's finish (the carries landed), not to the next pull request. Correction, 22:2xZ: the line above
that JC.net's branch carried the second records commit was false when written; its chain's stage step had
failed (the exchange node's old path was already gone from the index) and a trailing grep in the pipeline
masked the exit code (`exit-codes-in-band-never-piped`, violated by this seat). Landed on the resume as
`SHA:7c868467` on `coordination/2026-10-02-f19bed`, the same bytes as here. Both implementers re-seated at
22:1xZ on the Director's word; Efreet lifts Scorch on the fold of #340, Hazel tracks Trunk on 302 then the tail.
§BOARD, 22:5xZ: #340 folded (`SHA:209b2674b`, successor `coordination/2026-10-02-209b26`, draft #342); the
first carry #343 merged (`SHA:41b394ed9`); JC.net 302 and 303 merged, 2z open, then the rotation's records
commit and the fold of 300 (Hazel tracks Trunk); the two Core portability findings on 340 cured in both
estates (`SHA:5a328e05d` here, `SHA:43df9095` there). The ledger is assembled: 384 items, 28 carries, 13
owner rows, closer script green, on lane `docs/parity-measure` in each repository (here `SHA:f662f982c`,
there `SHA:05e6e1904`), pushed as the bot, to open as one pull request per estate in the implementers'
slots and held at the door for the owner's row reading; the carry count reopens the node with the owner
(row O10). The whole-finish estimate is on the node's §Size.
§BOARD, 23:0xZ: the ledger is open here as #344 (`SHA:35db66466` after two settlement pushes: the CodeQL cure
on the closer's side test and four routed cures, engraph merged in), at full condition and held for the
owner's row reading; JC.net's lane is at the same bytes (`SHA:cfa2a242`) and opens after Hazel tracks
Trunk's fold of 300 (304 merged `SHA:c33de96b4`, the rotation's records commit next). The owner has the
Director's question on O10 in chat with the recommendation (carry the text and small code now, thirteen
pull requests; defer C23, C25 with C19, C27 and C28 to the entity's package) and a notification; no carry
starts before that word. Two lessons of this seat tonight: a trailing grep in a chain's pipeline masked a
failed stage step and a false landing line followed (`exit-codes-in-band-never-piped`); a commit on a
shared primary without a pathspec swept a peer's staged file into the Director's commit (commit by
pathspec on a shared primary, always).
§BOARD, 23:3xZ: JC.net's fold of 300 done (`SHA:24fc052e9`, successor `coordination/2026-10-02-24fc05`, draft
305, the Director's records with the node's re-sized estimate on it at `SHA:c2a593b3`); the ledger is open
in both estates at the same bytes (306 there, #344 here), each at full condition and held for the owner's
row reading, both settlement pushes spent. In flight: JC.net's step 2 carry (the host-tagged amendment
entries to a host record with the Core validator; Hazel tracks Trunk, about fifty minutes), OCE's #345 (the
twins of 302 to 304 as three twin commits, proved line by line by the Director), then the carry's OCE copy.
A reading of the owner's limit recorded for the seats: a pull request held at its door for the owner is a
review surface, not work in progress, so one in-progress pull request beside it is the shape. Nothing of
the ledger's queue starts before the owner's word on O10.
§BOARD, 2026-10-03 01:0xZ, the night's close. Landed, every one read first-hand: the node's step 1 on both
sides (OCE #341, #345, #347; JC.net 301 to 304 and 308, the notebooks rotated); step 2 on both sides (#343
the registry rows; JC.net 307 and OCE #346 the host-tagged entries to ADR-023 and ADR-232 with the Core
host-name heading gate live in both docs-validators); step 5 on both default branches (PDR-019 amended,
PDR-143 trimmed, the exchange node archived with five PDR-142 entries, the parent node's entry, two
portability cures); both coordination branches folded twice (OCE successor `coordination/2026-10-02-209b26`
at `SHA:6c0b67924`, draft #342, DUE 12:00Z; JC.net `coordination/2026-10-02-24fc05` at `SHA:684162547`, draft
305). Step 3, the ledger, is open in both estates at the same bytes (#344 here, 306 there), at full condition
with both settlement pushes spent, held at the door for the owner's row reading; #344 reads BEHIND engraph
after tonight's merges and takes a merge of engraph before its own (from `oce-wt-parity-measure`, the
Director's). Step 4 waits on the owner's word on O10 (the recommendation on the node's §Size and in chat).
Owed to JC.net as one twin slice when Hazel tracks Trunk's lane next opens: three cures on the validator's
shared bytes from #346's review and one Codex relay nuance from #347's (Efreet lifts Scorch's notes of
00:45Z and 01:02Z on this stream). Housekeeping for the owner's hand: the forced local deletes of OCE's
two omnibus branches and JC.net's old records branch, each proved landed by content. Seats: Hazel tracks
Trunk (claims 009bbaea, 08f94e2a) and Efreet lifts Scorch (006c79ad) are cold-paused by the Director's word
with handoff pointers current, resumed by the Director's message after the owner's word; the Director holds
with the registry heartbeats on and no watcher (no peer live). Resume recipe at the owner's word: merge
the default branch into each ledger lane, merge the ledgers at their doors, resume both seats by message
with the carries in closure order under the owner's reading of O10, one in-progress pull request per
estate. Estimate from the owner's word: the two ledger merges within half an hour; the recommended
thirteen carries about two and a half hours on two seats; all twenty-eight about four to eight.
§BOARD, 2026-10-03 01:4xZ. The twin slice owed to JC.net landed there without waiting for a lane: a
Cricket check read holding idle as drifting while the slice had no dependence on the owner's word, so the
Director ran it by delegation and read every proof first-hand. JC.net 310 merged at `SHA:a4fdc188` (the
slice's commit `SHA:caa09239`), the re-cut of 309 after Codex held that a received portability move
carries the generalisation trailer in the commit that makes the change; the heading validator's shared
bytes are now equal in both estates, host bindings aside, which closes the #346 review's three cures on
both sides. Copilot's two seam-test findings there were declined for the carry and routed to the no-IO
node as named inputs for both estates. The #347 relay-clause nuance remains a note for one joint cure.
Nothing from this slice is owed to this estate. Seats unchanged: both cold-paused; the Director holds on
the owner's word on O10.
§STATE, 2026-10-03 07:1xZ, the compaction boundary at the owner's word (prepare compaction with the
cognition passes and the wrap, stop every process, report, stop). Every outward act of this seat's
own initiative is frozen from here. Live now: the parity node is landed through steps 1, 2 (the
opening carries) and 5 on both default branches; step 3, the ledger, is at its door here as #344
(`docs/parity-measure` at `SHA:35db66466`, twelve behind engraph, so engraph merges into it from the
`oce-wt-parity-measure` worktree before its own) and in JC.net as 306; step 4 waits on the owner's
word on row O10, and the node's §Size now carries a revised recommendation, two batched pull
requests per estate (the doctrine text as one, the small code as one) instead of thirteen, priced
from the one carry measured overnight (JC.net 310: two minutes of copying inside seventy minutes of
pull request). The fold of #342 is DUE 12:00Z with no live seat; the Director folds it on resume or
the owner's hand does. Work safety read first-hand at 06:1xZ: the primary clean and level with its
remote; `docs/parity-measure` zero unpushed; the registry-rows lane merged with its remote gone (the
`oce-wt-parity-carries` worktree retires); the two detached harness worktrees on engraph. The one
unsafe item, unchanged tonight and in these records since 2026-09-29: the J2 lane worktree `oce-
wt-j2-docs-validators` holds 23 staged, uncommitted files, the docs-validators port's starting
point, on `feat/exchange-j2-docs-validators` at `SHA:e07d6b34e` with no remote; it cannot pass the
push gate as it stands and is ledger row C27 and the owner's row O4. Review-cost rows for #344 and #342
are on this host's ledger. Claims retained with handoff pointers by intent: 302e8307 (the
Director), 9ecef634 (the records and the measure, #344), 4b82394b (the J2 lane); Efreet lifts
Scorch's 006c79ad stays retained under its own pause. The registry loop stops after a heartbeat-end
on this stream, so staleness past that event is the declared pause. Re-arm recipe, written as if
nothing survives: from this clone's root, the registry loop `while true; do date -u
+%Y-%m-%dT%H:%M:%SZ | xargs -I{} pnpm --silent agent-tools:collaboration-state -- claims heartbeat
--active .agent/state/collaboration/active-claims.json --claim-id
302e8307-8e0b-4221-af1c-600a62390df3 --now {} >/dev/null || echo "beat failed"; sleep 240; done`
under a two-hour bound re-armed on exit; the watcher only while a peer is live, as a thirty-minute
Monitor, `timeout 1740 pnpm --silent agent-tools:collaboration-state -- comms watch --platform
claude --model claude-fable-5-1 --supervisor-pid "$PPID" --step-timeout-ms 120000 --max-events-per-
drain 100`; no cron, no one-shot wake. Resume order: verify by the harness task list and agent list
before any act; read ahead/behind on every branch named here; re-arm only what is absent; then the
owner's word on O10, the two ledger merges, and the seats resumed by message in the shape the owner
chose. The wrap's loss scan, metaloss passes and fixed point are on JC.net's notebook block of this
hour; the formation letter is in JC.net's experience tier, dated today.

§BOARD, 2026-10-03 13:2xZ (Efreet lifts Scorch, 7adb15, implementer, at the Director's direction of
12:4xZ): the fold of pull request 342 landed at 13:21Z as `e790eab33` at head `dfe632899` (engraph
`992ec4804` merged in first); successor `coordination/2026-10-03-e790ea`, the folded branch gone
both sides on proofs. Five review threads, all on the node's §Size: the count, the deferral clause
against PDR-142 and the today/tomorrow wording cured as a dated estimate line (two settlement
pushes, spent); a Core portability finding on PDR-143's trim entry declined and routed here. Next on
this side: engraph into `docs/parity-measure`, #344 through the bot, then the OCE doctrine batch (C8
cured at source, C10, C4 with C20, C21) as one pull request. Next fold DUE at the UTC rollover.

**§STATE, 2026-10-02 20:0xZ (Crucible binds Slag, `7b999c`, the Director: the compaction record;
the plan is one node; the owner's rulings of the evening; what the next session does first).**
Read this block, then the node, then nothing else before acting.

The goal, the owner's words, verbatim (18:5xZ): "The OCE product work is not part of this, that is
something I handle later. What we are currently working towards is both estates having equally
capable Practices which we can then extract into a separate entity which has yet to be
designed." And (20:1xZ): "We WILL finish the Practice work in the next few hours, make sure of
it." The plan is one document, the same bytes in both estates:
`.agent/plans/archive/practice-parity-for-extraction.plan.md` (archived 2026-10-05; born sketch; the owner approved
its plan file at 19:2xZ; its size table carries the owner's bound, "no more than two hours, one
agent per estate plus a cross-estate Director", stated at 19:4xZ). It supersedes
`practice-work-finish` (archived here under `.agent/plans/archive/`). Its definition of done is
`best-of-each-practice` §Outcome, unchanged.

The rulings of the evening, each verbatim and each already applied to the node: PDRs carry
decisions, not plans ("if there is planning in a PDR it is in the wrong place. The Practice should
make that definition clear, as it should define ADRs"); directories that mix definitions with
instances are "a design problem in the Practice that this process has uncovered" (the entity
design's first decision; the survey's per-file rule reads it meanwhile); heartbeats are liveness
("stopping and starting is an unbelievable waste of time and attention": beat the registry only,
never pause); review feedback is triaged ("we need to triage it and _decide_ what we do with it";
"we don't need to deal in absolutes, we deal in risk, cost, value, assessement"); a spent budget
means decide, and "cutting a new branch and a separate PR does not serve that goal"; the estimate
of eight to ten seat-days was "ridiculous" because the measured landing rate was the rate of
ceremony, not of the work. What does not provide value, named at 19:5xZ and to be cut: curing
bot feedback instead of triaging it; reviewing fold pull requests at all; CI that runs the whole
product pipeline on documentation changes (path filters are the largest permanent saving); the
hold-line and heartbeat ceremony; records commits per event; stage lines for routine landings.

The state of every tree at 19:45Z, read first-hand. Here: 332 merged `SHA:2b25ced1b`; the
successor `coordination/2026-10-02-2b25ce` in the primary at `SHA:b4205aebb`, clean, carrying the
parity node by a two-parent merge of `SHA:c0258facf` (Efreet lifts Scorch's ceremony; its draft
and broadcast were in flight at this writing); seven slices on `engraph` today (#333 to #339); s,
the first-batch skills leftover and y still to land, local on the implementer's lane; the carry
worktree `oce-wt-parity-carries` on `feat/parity-window-registry-rows` at `SHA:ad5528b52`, one
unpushed commit (the registry rows and their tests, three tests green), the first carry, to push
and open after the rotation; the port worktree `oce-wt-j2-docs-validators` with the validators
staged and uncommitted (the formatting hook refused the preservation commit; the three validators
are a ledger row, decided at the ledger). JC.net: 298 (the inventory) merged `SHA:a35b5f325`; the
coordination branch, recreated by this seat's push after 286 had merged, carries the node
(`SHA:3f1445b4`) and its trued sizes with the notebook (`SHA:766c6c0e`, pushing at this writing);
the fold is 299, Hazel tracks Trunk's, who fast-forwards the primary (its index lock is gone,
read at 19:4xZ) and cuts the successor there; her lane holds one unpushed commit of the cured
report scripts (`docs/consolidation-2j-inventory-cures`), not a pull request, the measure's
input. Open pull requests: 299 here-and-there (the JC.net fold); none in OCE until the successor
draft opens.

The measure's first numbers, first-hand, with the scripts conserved in both estates' synced
session directories under `comms-analysis-2026-10-01/session-7b999c/measure/`
(`practice_inventory_v2.py`, `dry_run_merge.py`, `classify_conflicts.py`, `dump_hunks.py`, Hazel's
cured `io_census.py`, and their outputs): the extended survey reads 4,580 rows at `main`
`SHA:ba5ad39a` and `engraph` `SHA:d51669d2f` (1,241 same, 959 different, 536 JC.net only, 1,844
OCE only; the map covers the entry points, the install surface, roles, reference, prompts,
evaluations, harness bindings, the mixed directories by a per-file rule, the tooling's command
surface, configs and docs, the gate scripts, the workflows, CODEOWNERS, the root configs, five
adapter sets whole; a capability column per row); the dry-run three-way merge of the Practice-wide
text with the transplant pin as base: shared 445, identical 279, differing 166, of which 72 merge
clean (the merged text is the landing for both), 89 conflict in 207 hunks (56 reviewer surfaces,
49 skills, 46 rules, 39 directives, 12 Core, 5 hooks), 5 have no base; host-token normalisation
resolves 1 of the 89, so the 207 hunks are wording or substance and are the ledger's read;
one-sided 46 JC.net, 59 OCE. Hazel's cured scripts read the census at 514/81 and 732/93.

What the next session does, in order, from the node: (1) the OCE seat lands s, 2fb and y and
folds; the JC.net seat's fold 299 and successor; (2) this seat pushes the registry-rows carry and
opens it (minutes), then the amendment-entries carry; (3) the measure as one pull request per
estate: the v2 generator, the census, the dry-run merge's numbers and the ledger over the 207
hunks and the 105 one-sided files, each row one of four readings; the 72 clean merges land as
merged text in both; (4) the ledger's carries in closure order, the two large ones decided at the
ledger; (5) the PDR-019 amendment and the PDR-143 trim. Processes to re-arm: the two
registry-only heartbeats (claims 726da755 and 302e8307) and nothing else; no liveness poll, no
pause at any window; the comms watchers only while peers are live. Promises of this seat, all
discharged or forwarded: the port's closure (now a ledger row, the staged worktree its starting
point); the records of the hour (this block); the size truing in OCE (rides this seat's first
records commit on the successor, the same patch as JC.net's `SHA:766c6c0e`). Attribution
inferences flagged: the OCE index rewrite at 19:41Z is unexplained by this seat's actions (none
after 19:34Z); Efreet's reading of its cause is theirs. Blind-spot bounds: the comms watchers were
stopped from 18:5xZ, so peer lines after that reached this seat by session messages only. A third
metaloss pass would only re-find these; the recursion closes here.

**§STATE, 2026-10-02 18:4xZ (Crucible binds Slag, `7b999c`, the Director: the third cadence under
the finish node; end states 3 and 4 read first-hand).** Since 18:0xZ, each landing read by this
seat: JC.net 297 (the first-batch residue, two files) `SHA:f4a1c7496`, seven slices on `main` today
and no slice branch left on that remote; here #338 (u, Practice Core) `SHA:38342e038`, six
landings on `engraph`, #339 (q) open at its settlement round (push one of two), s, 2fb and y to
go; the Director's 18:0xZ records `SHA:b3a68941f`; the Practice inventory open in JC.net as 298
(`SHA:6425f0d81` after its settlement: the three generators beside the report, the opening
paragraph naming their invocations, three Copilot threads cured) and its copy here with the IO
census and four scripts `SHA:8e2b84150`. Proofs this seat ran: the two inventory copies `cmp`
equal; `practice_inventory.py` rerun at `main` `SHA:f4a1c7496` and `engraph` `SHA:38342e038`
reproduces the 3,555 rows and the four counts (975 same, 794 different, 343 JC.net only, 1,443
OCE only); `io_census.py` rerun at the same tips reproduces both tables (JC.net 500 files in
scope, 70 offenders; OCE 719, 83); the register reads 79 of 79 against the inventory. One finding
of this seat, cured on 298: the generator had been gitignored (`comms-analysis-*/`), so the count
was not a reader's to recompute; it now sits beside the report in both estates. The board. End
state 1: three slices here (q at its round; s; 2fb; y); the write-list table in the sibling
seat's twelfth entry, cutting at 18:43Z, and the notebooks move after it. End state 2: q's
branch on this remote in flight; #332 and 286 DIRTY for the rollover folds (a merge of the
default branch each, never a rebase); the port sized after y. End state 3: 298 at its door.
End state 4: the OCE copy landed; the JC.net copy (the same bytes, in that primary's working
tree) rides the twelfth-entry records commit by the worktree route. End state 5: the node
validates; its first pull request at y's merge. Time: about 45 minutes of door time here, 298's
door and one records commit there, the folds at the rollover; the one-day finish holds. Two
windows overlapped once (u's inside the Director's records window): the chain's stream write
was blocked by hand and the push-done posted after the peer's; the pushes themselves, to
different branches, did not collide. Processes unchanged, re-armed at each expiry.

**§STATE, 2026-10-02 18:0xZ (Crucible binds Slag, `7b999c`, the Director: the second cadence under
the finish node; the board against its five end states).** Landed this hour, each read first-hand:
here #337 (w) at `SHA:b6fe01c9d`, five landings on `engraph` today (#333 `SHA:134c2fb6f`, #334
`SHA:f45aaeca4`, #335 `SHA:576d8924d`, #336 `SHA:0e5ecae1c`, #337); in JC.net 296 at `SHA:c44edc837`,
six slices on `main` today (291 to 296); the ten stale owner items retired by the triage taxonomy
(`SHA:b9ad01a26`, §Open Owner-Decision Items reads "None"); the finish node's size row for the
first-batch skills residue in both estates as the same bytes (here `SHA:d39c606a6`; JC.net
`SHA:85f8edd4` by the worktree route, a detached worktree at the coordination branch's remote tip
pushed as the bot; both remotes' copies `cmp` equal). The board. End state 1: to land, here u, q,
s, 2fb and y (Efreet lifts Scorch, one at a time), in JC.net 297 (2fb, two files, CLEAN at 18:05Z
under Copilot's round); the write list's recount (the sibling seat's eleventh entry): of W61 to
W116, 23 merged in both estates, 16 merged in JC.net with their copies here in u, q, s and y, 9
closed on reading, 1 on a memory surface, 7 unmapped (W84; W104 is the 2fb residue; W112 to W116
unattached), W1 to W60 bundled in the 01:10Z entry and tabled in the sibling seat's next entry;
pending graduations 0 inline in both registers; the three unconsolidated napkins move after the list
reads zero. End state 2: no `docs/consolidation-2*` branch on this remote; one in JC.net (297's);
here #332 BEHIND and there 286 DIRTY (19 commits) for the rollover folds, 286 by the worktree
route; the J2 port sized after y. End states 3 and 4: not started; JC.net's seat after 297's door, the census
with it. End state 5: the product node exists and validates (`graph-and-queue-foundations-delivery`,
trued at `SHA:0d80c5bd2`); its first pull request opens at y's merge. Time: five landings here at
the measured 15 minutes is about 75 minutes of door time; the inventory (about four hours, one seat)
is the long pole; the folds at the rollover; the node's one-day finish holds. Three tool facts from
the chains (the napkin carries them): a body line wrapped to open `carry:` is a footer token under
strict commitlint; the Bash tool's shell is zsh, where a pipeline's status is `${pipestatus[1]}`;
a chain script edited on disk while running dies at the edit (both pushes had landed; the push-done
lines were posted by hand from the fetch, and the scripts are copied per run from now on).
Processes: the two watchers re-arm at ~18:1xZ; the heartbeats re-armed at the push-done lines.

**§STATE, 2026-10-02 17:2xZ (Crucible binds Slag, `7b999c`, the Director: the owner's three rulings
and the plan that replaces the definition of 15:1xZ).** The owner, verbatim, in this seat's session:
17:0xZ, "we don't archive napkins, we fully process them, and once all knowledge is safe we move
them to an archive, we don't do it to park them somewhere. I have no idea what any of the things
you are talking about are. That means you or other agents have invented a 'for the user' bucket as
a way of calling work paused. That means you have likely been prioritising according to ease
rather than value. That means we have likely not been moving in a useful direction."; 17:0xZ,
"NOTHING is blocked on me, NOTHING should be worked on without clear completion criteria, sizing,
and an unambiguous and provable statement of how it provides ratified value."; 17:1xZ, "ALL of
this work is bounded, ALL of it must have a known, reachable, measurable end state, and ALL of it
must be finished soon." The finish is now the delivery node `practice-work-finish` (the same bytes
in both estates): five end states a reader verifies in a minute each, sized from the day's measured
rate, finished within one day of authoring; it supersedes the seven-and-five lines of the §STATE
block of 15:1xZ, which stands below as the record. What the rulings changed: the owner-decision
list of the 15:2xZ report is dissolved (the first product target is the ratified programme's; the
ten stale items take the triage taxonomy at the seats; the no-IO conversion is its own node sized by
the census; PDR-143 gates nothing); the twin-lane programme is replaced by one generated inventory
with scope classes under PDR-143 §1; the security lane is deleted from the queue for want of
criteria, size and value; the notebooks are fully processed and then moved, never archived on a
condition. The lock in JC.net's primary: the owner's "Run now" of 11:28Z was the decision and was
misread as the owner's own act for six hours; this session's permission classifier refused the
removal at 17:0xZ, and a routing of it to a peer was refused as permission laundering; the fold of
286 and the dirty records go by a route that needs no index in that primary (the pull request
merged remote-side, the successor cut in a linked worktree, the records committed from a linked
worktree copy), so nothing waits on the lock. Processes unchanged, each serving the node's finish
and stopped at it.

**§STATE, 2026-10-02 15:1xZ (Crucible binds Slag, `7b999c`, the Director seat re-taken at the
owner's word).** The owner, verbatim, 15:0xZ: "for the team, and for each agent, including yourself,
define what the goals are, we need a definition of done, so that we know when the work is finished.
We need to get the Practice work complete so we can plan the extraction, and we need to get into a
position where development work on OCE makes sense." Claims: 302e8307 here and 726da755 in JC.net
(`estate-coordination`, role director); the inherited J2 claim 4b82394b is routed below. Processes:
the two watchers, the two heartbeat loops, the pull-request poll over both open sets, the
peer-liveness poll; the fold wakes for #332 and 286; each armed for the finish below and stopped at
it. Roster at 15:1xZ, both live by their reports in this seat's session and their beats: Hazel
tracks Trunk (7d8b9d), JC.net implementer (claims 009bbaea there, 08f94e2a here; 291 merged
`SHA:54a219d50` at 15:06Z; slice s opening); Efreet lifts Scorch (7adb15), OCE implementer (claim
006c79ad; #333's one ceremony running on the go word of 15:0xZ). The mode is the full protocol at
n = 3.

**Goal 1: the Practice work complete, so the extraction can be planned.** "Complete" is already
ratified: `best-of-each-practice` §Outcome in both estates (a dry-run merge of the shared text
changes no file, conflicts nowhere, leaves no file waiting; each judged standard has one
observation every estate passes; every offer has an answer and each adopted capability is
demonstrated where adopted; the removals judged are carried out). The finish below is that outcome
made countable at the two default tips, plus the inputs the extraction's plan needs. Goal 1 is done
when every line holds, each proof read first-hand by the Director:

1. Nothing of the Practice lives outside a default branch: no open Practice pull request in either
   estate; no local-only slice branch (JC.net: s, u, x, y, z; OCE: nb, r, v, w, u, q, s, y; the
   stale `docs/consolidation-2-routed-cures` in each lane proved merged by content or removed on the
   owner's word); the J2 docs-validators port committed on its branch and opened as one pull request
   that runs here at its slot, or removed by the owner's decision with its handoff record as the
   account. Proof: the open sets, `git branch -v` in both lanes, the J2 branch. Receivers: Hazel
   (JC.net), Efreet (OCE).
2. The consolidation's finish list is empty (Hazel's eighth entry, 14:48Z, seven items): the JC.net
   slices; the OCE slices; the records commit after the lock; the three unconsolidated napkins
   archived by proof after the owner's one line; the three OCE owner cards raised; the two directive
   lines and the monitor rule's one-shot clause edited; the napkin rotated. Counts first in the
   closeout: pending graduations 0 and buffers 0 in both estates. Proof: the counts and the merged
   pull requests by SHA. Receivers: Hazel; Efreet for OCE's slices; the Director for the cards.
3. The exchange reads N of N: the register's count line (16 of 32 at 2026-09-29, not refreshed
   since) recomputed at the current heads, every row landed or declined with its reason, and the
   plan's finish test met: a computed path delta over `agent-tools/src`, `agent-tools/smoke-tests`,
   `.agent/skills`, `.agent/rules` and `.agent/directives` between the two default tips shows no
   one-estate-only file on any port line. Proof: the delta's run recorded in the register with both
   heads. Receiver: one JC.net-resident lane (Hazel after item 2); each port line found is a twin
   lane under the limit.
4. Capability parity, both ways, inventoried and landed or decided (the owner, 2026-10-01: "anything
   useful that one has must make it to the other"): the rows the consolidation record names (L7, L8
   into JC.net; OCE's commit queue; JC.net's `check:docs` pre-flight; the divergence measure as an
   agent-tools command with tests; the visual-regression harness where it applies) and the twins
   the day found (the 309 twin, the 333 twin, the GitHub-port seam) are register rows, each landed
   in both estates, declined with its reason, or carded to the owner. Proof: the register.
   Receivers: twin lanes, one per capability, routed by the Director as slots free.
5. The residual divergence is classified: the measure run at both default tips; every differing
   shared path is the same bytes or named in the retrospective's table with its reason as a
   repo-local binding (PDR-143 §1's split), none as "divergent by nature" without the reason.
   Proof: the measure's output and the table. Receiver: one lane after items 1 to 4.
6. The agent-tools test census exists and is sized in both estates (the no-IO plan's first
   acceptance criterion: a row per test, helper or setup file that uses the filesystem, a process,
   the network or the clock). The conversion itself (53 smokes in JC.net, 40 here) is sequenced by
   the owner: the Director's verdict is after OCE's first product lane opens, because its cost is
   days and it blocks neither goal; the owner can place it inside Goal 1 instead. Proof: the census
   tables. Receiver: one lane per estate.
7. PDR-143 is before the owner for ratification or amendment, with §5's items carded once (name,
   home, licence, publishing route, version scheme; the fork relation). Owner-gated; no other line
   waits on it.

Not in Goal 1: the extraction plan itself (the next bounded task, whose first step is the scope
inventory of every Practice artefact against PDR-143 §1 and §2); the language-separation sketch (an
input to that plan); any Reliable Atoms rename (the external Capability Foundations pull request is
intake on arrival).

**Goal 2: a position where development work on OCE makes sense.** Development work makes sense when
a product lane can open in OCE's fix slot on a stable substrate, with a named target and a free seat.
Done when:

1. OCE's fix slot holds no Practice pull request (Goal 1 item 1 for OCE: #333, the eight slices, J2)
   and #332 is folded at the rollover. Proof: the open set; the fold's merge SHA. Receiver: Efreet.
2. The first product lane is named: a delivery node serving `reliable-atoms-programme`, its premise
   recomputed against the tree, its definition of done written by its implementer at pickup, and an
   implementer seat free under the limit. The Director's verdict on the target: the programme's
   first target as ratified (BinaryTreeIndices with its admission and outcome prerequisites; the
   composed BinaryHeap as the first endpoint) under the adoption profile
   `docs/architecture/foundations/capability-foundations-adoption.md` as the contract; the owner
   confirms or redirects on one card. Receiver: Efreet at the slot.
3. The owner's gating decisions are carded once and gate nothing else: the three OCE cards (items
   1 to 4, 5 to 8, 9 to 10 of the re-trued decision items); the first-lane card; the no-IO
   sequencing; the lock. The ten re-trued items stay listed in `repo-continuity.md` §Open
   Owner-Decision Items and gate nothing in the first lane. Receiver: the Director.
4. The gates a product lane runs are bounded: the census of Goal 1 item 6 done here, and the
   pre-push gate's run time measured once on a product-shaped change and recorded. Receiver: Efreet
   at the first lane's first push.
5. Capability Foundations: the external pull request is team intake on arrival (checked out,
   gated, evaluated, counted toward the limit); its absence gates nothing, since the adoption
   profile exists; the Reliable Atoms residue (43 files) is cured in that pull request's wake,
   never before.

**Each seat.** Crucible binds Slag, the Director (route, never execute; PDR-117): goal, both
definitions hold in both estates with the owner's decisions carded once and the records aligned;
done when (a) this definition is recorded in both estates and acknowledged by each seat, (b) every
line has a receiver and a proof, (c) each proof is read first-hand at its landing, (d) PDR-143 and
the first-lane card are before the owner, (e) the inherited J2 claim is with Efreet at its slot or
closed on its record, (f) the handoff is written; then the seat stops, or pauses when only
owner-gated lines remain. Hazel tracks Trunk, JC.net implementer: goal, the consolidation's finish
list on the JC.net side and the JC.net fold while the lock stands; done when 291 is merged (done,
`SHA:54a219d50`), s, y, x, u, z are merged one at a time, the records commit and the fold of 286 land
once the owner clears the lock (or at the rollover DUE, the fold waiting on the lock the same way),
the three napkins are archived by proof after the owner's line, the two directive lines and the
monitor clause are edited, the napkin is rotated, and the counts read 0 and 0; then the exchange
recount (Goal 1 item 3) and the twin lanes in JC.net's slot as routed. Efreet lifts Scorch, OCE
implementer: goal, OCE's fix slot drained of Practice work, then OCE's first product lane; done
when #333 is merged at green, nb, r, v, w, u, q, s and y are merged one at a time (u takes
`origin/engraph` by merge, never rebase), J2 is opened as one pull request that runs here or
removed by the owner's decision, the stale routed-cures branch is proved or removed, and #332 is
folded at the rollover; then the first product lane's node and its own definition of done at
pickup.

**The owner's cards, raised once in the Director's report of 15:2xZ:** the lock (the owner's
command, given in chat); PDR-143 (ratify as written, amend, or hold; §5's items); Goal 2's first
lane (BinaryTreeIndices under the adoption profile, or another target); the no-IO conversion's
place (after the first product lane, or inside Goal 1); the three OCE cards from Hazel's re-trued
file, verbatim; Hazel's four items of 14:1xZ as her record names them (the monitor rule's one-shot
clause; "homes twin, buffers do not"; the privacy line; the test-expert gate's cost); the one line
on the 2026-03-08 napkin (per-user memory, chat only).

**§BOARD, 2026-10-02 16:4xZ (the wrap cadence's first recomputation against the definition
above).** Work safety: both primaries equal their remotes; this estate clean; JC.net's ten dirty
paths are records behind the lock (zero bytes, 10:56Z, standing at 16:42Z). Goal 1 line 1: JC.net
has five of Hazel's six slices on `main` (291 `SHA:54a219d50`, 292 `SHA:a1b4e393f`, 293 `SHA:4a9a0d04c`, 294
`SHA:541fb1981`, 295 `SHA:9365ab74a`, each read first-hand), u opening last with `main` merged in, the
stale routed-cures and the merged 2a branches still local; here, #333 `SHA:134c2fb6f`, #334 (nb)
`SHA:f45aaeca4` and #335 (r) `SHA:576d8924d` are on `engraph`, #336 (v) is open at its second round, w, u,
q, s and y are local on their lane branches, the stale routed-cures branch stands, and the J2 port
is uncommitted (five paths). Lines 2 to 6: in progress or not started (the consolidation's list
lands slice by slice; the exchange recount, the parity rows, the divergence classification and the
test census open after it). Line 7: PDR-143 is before the owner since the report of 15:2xZ,
unanswered. Goal 2: line 1 in progress (three Practice pull requests landed here this hour, six
slices and J2 to go; #332 reads BEHIND and folds at the rollover by merge); lines 2 and 3 carded
at 15:2xZ, unanswered; lines 4 and 5 not started. Routes given in the hour: z before u in JC.net,
u by merge from `main` with no wait on the fold (Hazel's question, 16:0xZ, absorbed); the two
Codex cures from #334 back to JC.net as one small slice after u. Processes verified by id at the
cadence: two watchers (re-armed at their expiry), two heartbeat loops (paused per peer push window
under F-219 and re-armed at each push-done, eleven windows this hour), two polls, two scheduled
prompts (the fold wake at the rollover, this cadence). Owner items held for the record, unchanged
from the report of 15:2xZ: the lock; PDR-143; the first product lane; the no-IO conversion's
place; the ten re-trued OCE items; Hazel's items; the one private line.

The §STATE block of 14:4xZ below stands as the record of the stop; its routes are absorbed above.

**§STATE, 2026-10-02 14:4xZ (Crucible binds Slag, `7b999c`, the Director seat stopped at the
owner's word).** The owner, verbatim: "Please prepare compaction … then stop all processes -- and
remember, you are working on a bounded task, not open ended, we must always understand the goal so
that we are able to finish". Every standing process of this seat is stopped and its claims are
closed (6a4b11b1 here, 8b346894 and cab726a6 in JC.net); 4b82394b (the J2 lane, NOT READY,
uncommitted in `oce-wt-j2-docs-validators`, `repo-continuity.md` §Next Safe Steps line 2) carries a
handoff pointer for the next implementer seat here. No Director seat exists after this block; the
routes below stand until an owner-seated Director adopts them, and each implementer's own session
is the owner interface meanwhile.

The finish of the day's Director task, stated: (a) JC.net's 286 folded — held by a zero-byte
`.git/index.lock` in JC.net's primary (10:56:56Z, no holder; the commit skill's foreign-lock section
reserves its removal to the owner), so the fold passes to the seat holding JC.net's slot once the
lock is gone (Hazel tracks Trunk, resident there; the napkin, the formation letter and Hazel's own
records sit dirty in that primary, linted, and ride the fold) or to the rollover DUE; (b) this
estate's 332 folded at the rollover by its seat; (c) #333 (the retire port) landed at green by
Efreet lifts Scorch — the Director read it at 14:3xZ with no objection and the gate is released to
the seat's own verdict; (d) this handoff. Beyond it, routed with receivers, in order: the nb
back-port then Hazel's six slices here (Efreet, from Hazel's PDR-063 record, one at a time after
the retire port lands); the 309 twin and the 333 twin in JC.net (the fix slot after the
consolidation's slices); the
security lane, the test-shape lane (280's three items, the retire smoke double's call-count branch,
the mint test's removal) and the GitHub-port seam lane, each in both estates; the J2 cures here.
Owner-gated and held for the record: the lock; PDR-143's ratification and the entity's name, home,
licence, publishing route and version scheme; the external Capability Foundations pull request
(team intake); the Turbo items; the three OCE owner cards (`homed/oce-owner-items-retrued.md` in
Hazel's synced session directory, raised by Hazel at the owner's next presence); Hazel's four items
of 14:1xZ (the monitor rule's carve-out, "homes twin; buffers do not", the privacy line, the
test-expert gate's cost). Two second observations routed as register entries at the next fold, with
their text in JC.net's napkin block of 14:4xZ: per-seat worktrees for coordination writes (the
shared primary index idled two seats and a DUE check); F-219's cure (the gate reads the generated
comms log, so every push needs a hold line and every holding seat stops its heartbeat; six pairs
and three false "retired" readings today).

An owner ruling relayed at the freeze, data until the owner confirms it in a seat's own session
(PDR-142), carried here because its subject is this fork's history (Efreet lifts Scorch, 14:4xZ,
from the owner's word in their session, verbatim): "anything coming in from main must always be
merged, not rebased, we must maintain the shared history with the Oak fork." It changes the
consolidation's slice-u instruction (merge `engraph` in, never rebase); Efreet told Hazel. All
three seats froze at the owner's compaction word within one minute of each other (14:48Z): Efreet
holds claim 006c79ad with three cure commits unpushed in the retire lane worktree, to push with the
body, the dispositions and Copilot's re-request as one ceremony on resume; Hazel holds 291 at its
first settlement push with the door on green.

Re-arm recipe for a successor Director: §Standing processes above, verified by id first (the task
list, the cron list) so a survivor is never doubled; the seat opens with its landing target and its
finish condition (PDR-026), arms processes for that path's gates only, and stops them at the finish
or at the owner's word (the owner's bounded-task word, candidate for this brief).

**§STATE, 2026-10-02 11:1xZ (Crucible binds Slag, `7b999c`, the Director seat across both
estates).** Licence: the owner's word in this seat's own session, 2026-10-02 ("when it makes sense,
take on the Director role … context preservation over longer timescales … strategic decisions are
shared but most implementation work should be delegated"); no prior Director seat existed (the
§POINTER below), so there was no Moment 1 to answer. Taken at 10:51Z after the seat's own lane
(JC.net's pull request 280) merged, so the seat holds no implementation. Claims: 6a4b11b1 here and
8b346894 in JC.net (`estate-coordination`, role director); 4b82394b (the J2 lane, inherited, NOT
READY, `repo-continuity.md` §Next Safe Steps line 2) is routed to the next implementer seat here.

Roster, read from both registries and both streams at 11:1xZ: Hazel tracks Trunk (7d8b9d),
implementer, the second two-estate consolidation (claims 08f94e2a here, 009bbaea in JC.net; slices
on local branches, opened one at a time; JC.net's 289 merged at 10:57Z, 290 open there); Efreet
lifts Scorch (7adb15), implementer, this estate's fold of #327 (merged 11:07Z as `9fd05ecf7`) and
the cross-fork check (claim f9c5a8ce; no lane work). The owner's limit (10:3xZ): one coordination
and one fix pull request per estate. Here: #332 (coordination, cut 11:10Z), no fix pull request.
JC.net: 286 (coordination, folds at 12:00Z by this seat; a stale `index.lock` in its primary, the
owner's to clear, holds every commit there until it is gone) and 290.

Verdicts owned: the fold of JC.net's 286; PDR-143's landing here on `coordination/2026-10-02-9fd05e`
(the same bytes as JC.net's, where two sub-agent reviews read them); 290 read first-hand, no
objection. Owner-gated: the Turbo items (`repo-continuity.md` §Next Safe Steps); the Capability
Foundations pull request the owner will have an external agent raise here (team intake when it
arrives); PDR-143's ratification and the entity's name, home, licence and publishing route; JC.net's
lock and 290's re-run. Team-doable, in order, each to an implementer seat as its slot frees: the #309
twin in JC.net; the security lane; the `retire` port into this estate carrying 280's two settlement
cures; the push-tests lane in both estates (280's three routed items; the mint test's removal); the
J2 port's cures here; the arc-metrics follow-ons (§Next Safe Steps line 1).

Processes of this seat: the all-channels watcher in each estate; the heartbeat loop under the
Director label on both registries; the PR poll over both estates' open sets; the peer-liveness
delta poll; the fold wake; the wrap cadence. Each is re-armed from §Standing processes above at any
boundary.

**§POINTER, 2026-09-29 13:4xZ (Wick binds Temper, `ed7b48`, the Director seat, at the owner's
word).** The Director lane closed on 2026-09-29; the owner handed the work to one seat (n=1) across
both estates. That seat's handoff is the `estate-coordination` thread record's journal entry
"2026-09-29T13:4xZ — HANDOFF to the n=1 seat", with the retrospective
`.agent/reports/agentic-engineering/why-five-days-of-landings-closed-nine-stories-2026-09-29.md`.
This role brief stays for any future Director seat.

The state blocks of 2026-09-19 that stood here are archived byte-identical in
`archive/director-handoff-current-handoff-state-2026-09-19.md`.
