---
id: agent-tools-watch-commands
node_type: delivery
name: "Agent-tools watch commands: the recurring watch patterns as front-door CLI"
overview: "Give every seat the recurring watch patterns — heartbeat loop, release/deploy watch, settled-green merge — as single front-door agent-tools commands, retiring per-session tmp-script reinvention."
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-08-06
ratified_where: "Owner card answers at the Director seat 2026-08-06 ('Early ticket mint — stamp now' + 'merge-bot merge first'), relayed to the executing seat as directed comms event 28e101ba-9e38-49e1-a91a-c4d87c39d783; PR #789"
serves: agent-platform-citizenship
impact_areas:
  - practice-and-estate
tickets:
  - MCP-508
depends_on: []
owner_gates: []
last_updated: 2026-08-09
---

# Agent-tools watch commands: the recurring watch patterns as front-door CLI

## Goal

Any seat, on any platform, arms the estate's recurring watch patterns as
single-argv agent-tools commands — the same front-door class as `comms
watch` and `pr-watch` — so no session ever re-derives them as ad-hoc
shell loops or tmp-script wrappers again. The owner's ruling
(2026-08-06, verbatim substance): recurring watch patterns — PR watches,
release watches, deploy watches, heartbeat loops — belong IN
agent-tools, "they are things we do over and over"; the worktree
isolation guard is a forcing function — "it will force us to only use
the tools we built, and so finally make them work well and for us."
Single-argv commands satisfy the guard's plain-command requirement by
construction.

## Problem

The gap: three watch patterns every active seat runs have no CLI home,
so each session re-implements them as shell loops. Who it harms: every
seat (re-derivation cost, drift between implementations, the guard now
refuses the compound forms outright), and the owner (review burden over
repeated bespoke shells). Mechanism of harm, observed first-hand
2026-08-06 at the extraction-pilot seat: the heartbeat loop and a PR
settle-watch each needed a /tmp script wrapper to pass the isolation
guard; the wrapper class is retired by the same ruling that
commissions this plan. Success: the patterns exist once, tested, with
the conventions the estate already ratified (supervisor-pid guard,
timeout backstop, one-timestamp-per-tick, relabel-at-transition,
terminal-state coverage) built in.

## Decisions already made

- **Owner ruling** (2026-08-06, at the Director seat, canonical event
  9457a815): the backlog is release/deploy watch + heartbeat-loop
  commands; `pr-watch` already exists as the pattern exemplar; in-repo
  plans only until the Linear embargo lifts 2026-08-10.
- **Named tooling gap** (flagged the same hour, event 7ba78908;
  DISCHARGED by slice 1 — `merge-bot merge` landed via PR #790):
  `merge-bot` had `mint-token` only — the settled-green REST merge
  needed a `gh` wrapper each time. The `merge-bot merge` subcommand
  subsumes the PR settle-watch (poll to settled, then merge) — one
  command, not two.
- **Build-vs-buy**: the vendor surface is GitHub's REST API, already
  consumed via the estate's own minted-token discipline. GitHub's
  first-party merge automation IS available in bot identity (the
  bot-merge path is documented in `docs/engineering/merge-bot.md`,
  and PDR-131 permits arming auto-merge at settled-READY under a
  Director grant) — it is rejected on capability, not identity:
  GitHub enforces only checks and review threads, never the estate's
  round-owed and body-tally settlement legs, so auto-merge cannot
  encode the settlement verdict, and the pr-watch state model types
  `ARMED-BEHIND-RED` as "progresses nothing, alerts nobody".
  Actions-based watchers cannot anchor the claims/comms substrate the
  heartbeat loop writes. The in-house CLI shape `pr-watch` already
  chose is the standing answer, extended not re-decided.

## Mechanism

Three commands, each mirroring the established `pr-watch` topic shape
(`agent-tools/src/pr-watch/` — topic table in
`agent-tools/src/bin/agent-tools-cli.ts` with handlers in
`agent-tools/src/bin/agent-tools-cli-topics.ts`, its own module
directory, unit tests over pure decision logic, integration tests over
injected ports; the `collaboration-state` topic is bespoke-wired in
the CLI rather than uniform-handled, and its new subcommand inherits
that wiring). Polling is the sanctioned wake shape here because none
of these sources emits a stream a session can consume without a
server (the same justification `pr-watch` records):

1. **`collaboration-state heartbeat-loop`** — the PDR-078 loop as one
   command: per tick, one derived timestamp drives `comms send --tag
   heartbeat` AND `claims heartbeat` (the F-92 both-surfaces
   discipline); required `--claim-id`, typed state args
   (`--intent-id`, `--branch`, `--current-cycle-label`); cadence
   defaulting to 240s; `--supervisor-pid` self-exit and the
   loud-failure line convention carried over from `comms watch`.
   Relabelling stays a restart (stop, re-arm with new args) — the
   loop stays a dumb emitter by design.
2. **`release-watch` / `deploy-watch`** — poll a named surface until
   a terminal state, emitting one line per state transition and one
   terminal line. The two surfaces are concrete in this repo today:
   `release-watch` polls Actions workflow runs for the
   semantic-release workflow (terminal conclusions: success, failure,
   cancelled, timed_out, skipped); `deploy-watch` polls GitHub
   Deployments and their `deployment_status` events as Vercel emits
   them (terminal states: success, failure, error, inactive). EVERY
   terminal state emits per the silence-is-never-liveness discipline;
   bounded by poll-count and the timeout backstop, exit code carried
   in-band.
3. **`merge-bot merge --pr <n>`** — the settled-green merge as one
   act: mint scoped token, COMPOSE the existing `pr state` settlement
   verdict (`pr-watch/settlement.ts` — no third polling
   implementation) until it reads settled, refusing loudly on any
   failing leg; verify the repo's allowed merge methods still include
   merge commits before merging (the `allow_merge_commit` setting has
   silently reverted before); REST-merge with merge-commit method
   (never squash); print the merge sha. The recorded `pr watch` (D2)
   intent in `pr-watch/state-cli.ts` stays with the pr-watch lane —
   this command consumes the state reading, it does not absorb D2.

Why this produces the goal: single-argv commands pass the isolation
guard by construction; one tested implementation replaces N session
copies (the same consolidate-at-second-consumer economics as the
extraction pilot, applied to operational tooling); and the conventions
live in code where the estate's gates prove them instead of in rule
prose each session must re-read.

## Acceptance criteria (each with a proof)

- Each command exists, registered in the CLI topic table, with unit
  tests over its decision logic (tick composition, terminal-state
  classification, settled derivation) and integration tests over
  injected process/HTTP ports — `repo-safe`: suites green in the
  agent-tools workspace; the whole-tree gates green at landing.
- A worktree-resident seat arms each command as a single plain
  command with no wrapper — `repo-safe`: the isolation guard accepts
  the documented invocation verbatim (the documented form IS the
  tested form); `owner-held`: the next live fleet window runs them in
  anger and the owner sees no tmp-script forms minted.
- The heartbeat loop writes both liveness surfaces per tick with one
  timestamp — `repo-safe`: integration test asserts the paired writes
  and the shared timestamp.
- `merge-bot merge` refuses a non-settled or failing PR loudly and
  merges a settled-green one with the merge-commit method —
  `repo-safe`: integration tests over an injected GitHub port pin
  refusal messages and the merge call shape; never-squash is a
  test-pinned invariant.
- `liveness-heartbeat-cron` §Canonical invocation is re-pointed at
  the `heartbeat-loop` command in the same landing as slice 2 —
  `repo-safe`: no rule text left prescribing a shell loop the command
  now owns (misleading-docs are blocking).
- The owner-held criterion above records its verification in the
  node's completion note (the archival disposition) citing the fleet
  window's comms events — the named recording surface the proof
  contract requires.

## Out of scope

- Rebuilding `comms watch` or `pr-watch` — they exist; this plan only
  adds siblings and re-points prose.
- Any scheduling daemon, cron substrate, or background-task manager —
  the platform's Monitor/background primitive stays the supervisor;
  these commands are what it runs.
- New vendor integrations — GitHub REST via the existing minted-token
  discipline only.
- Linear tickets before the embargo lifts (2026-08-10) — the `tickets`
  field is backfilled at the lift (same pattern as the
  shared-construct-extraction-pilot node).
- The `comms-all-channels-watcher` arm ceremony — it composes `comms
  watch`, which is out of scope above; its shell block remains until a
  watch-arm command exists (a follow-on the rule's own text can
  commission when this plan's pattern is proven).
- The F-75 peer-liveness delta poll (`liveness-heartbeat-cron`
  §Surfacing peer heartbeat-silence) — the emission side ships in
  slice 2; the detector side stays with the rule's own recorded
  follow-on (`comms watch --alert-stale-peers`).

## Todos (each slice a single-story PR; PDR-132 budgets bind at authoring)

1. **`merge-bot merge`** — LANDED (PR #790 merged 2026-08-06; the
   recorded tooling gap discharged — truing 2026-08-09 at reconcile):
   the settled-green merge as one front-door command, eleven atomic
   landings, a three-expert Opus review round fully adjudicated (the
   critical SETTLED-NO-REVIEW settlement cure landed estate-wide) and
   an owner-called 8-0 Cricket suite at the review boundary.
2. **`merge-bot push`** (slice 1.5; owner word 2026-08-06) — the
   bot-identity push as one command, consuming slice 1's token
   machinery: mint plus credential injection OVER the git binary,
   pass-through per the owner's 2026-08-06 principle (build value only
   where the binary provides none). Replaces the per-session
   credential-helper script recipe. LANDED with PR #790 as its
   delimited rider, merged 2026-08-06 (owner call: with both
   automatic reviewers constrained, review rounds are the scarce
   resource — one shared-context round beats two summons).
3. **`heartbeat-loop` + `watch-arm`** (slice 2 — reshaped;
   **RATIFIED at the owner card 2026-08-09** (Director seat): the
   bootstrap pair replaces the original slice-2/3 ordering and the
   2026-08-06 frontmatter gate cleared at that word) — the pair from the
   2026-08-06 deferral-tripwire re-assessment: the claim-anchored
   heartbeat loop and the standard watcher arm ceremony (with the
   F-75 fold), landing with the rule re-point in
   `liveness-heartbeat-cron`. Replaces the original slice-2/3
   ordering below.
4. **`release-watch` / `deploy-watch`** — one slice sharing one
   polling core (unchanged).
5. **Decision-lens ledger** (owner-commissioned; Director design
   brief) — executes as a slice of this node per the panel-reviewed
   brief v2 at
   `.agent/reports/agentic-engineering/decision-lens-ledger-design-2026-08-06.md`
   (coordination branch, commit 58ddadd5e; three-expert Opus panel,
   ~30 findings dispositioned there). The brief is the design
   authority — this todo is a pointer, not a spec. The full Cricket
   suite is owner-mandated at four junctures: schema freeze,
   validator landing, CLI landing, node-amendment close.

Sequence: 1 and 1.5 (landed, PR #790) → slice 2 (ratified
2026-08-09) → release/deploy-watch → onward, with 5
scheduling at the tooling seat's next free cycle — held BEHIND the
codebase pattern survey per the owner's 2026-08-06 proportionality
word (the survey resumes ahead of further tooling beyond slice 1.5).
The original ordering was surfaced on the ratification card
(`merge-bot merge` cures the gap flagged the same hour, event
7ba78908) and the owner confirmed it at the stamp: "merge-bot merge
first"; the 2026-08-06 owner word "finish 1, 2, 3; create
discoverable plans for 4 and 5" produced this amendment.

## Review path

Authored at the implementer seat per the plan skill; the
plan-body-first-principles-check fires on this body's shape
(mechanism-only, no vendor literals beyond the named API class, no
invented phase vocabulary — the three todos are the owner-ruled
backlog verbatim plus the same hour's flagged gap).
`assumptions-expert` review precedes the ratification ask;
ratification is the owner's act, routed as a card via the Director.
