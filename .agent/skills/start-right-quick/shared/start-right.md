---
prompt_id: start-right-quick
title: 'Start Right (Quick)'
type: workflow
status: active
last_updated: 2026-07-29
---

# Start Right (Quick)

Ground yourself before beginning work. Read in the order below; each
step leads to the surfaces the next step assumes.

## Ground First (reading order)

### 1. Durable directives

Read and internalise. **This foundation-directive reading is the
necessary precondition for Family-A Class A.1 (per PDR-029
§Decision; A.1 is single-layer post-2026-04-21 Session 5
reclassification — foundation-directive grounding is background
grounding, not an installed tripwire layer; the installed layer
is the plan-body first-principles-check rule).**

1. @.agent/directives/AGENT.md — operational entry point and index
2. @RULES_INDEX.md — canonical list of always-applied `.agent/rules/*.md`
   files
3. @.agent/directives/principles.md — authoritative engineering principles
4. @.agent/directives/tdd-as-design.md — foundational TDD definition: a test
   describes a system state, product code is the path that guides the system
   into it
5. @.agent/directives/testing-strategy.md — test-type taxonomy and shape rules
6. @.agent/directives/schema-first-execution.md — types flow from schema
7. @.agent/directives/orientation.md — layering contract and authority order

For Codex, Gemini, or any other platform that does not auto-load canonical
rules, read every canonical `.agent/rules/*.md` file listed in
`RULES_INDEX.md` before substantive work. Treat `RULES_INDEX.md` as the live
inventory rather than copying the rule list here.

### 2. Start-here ADRs

Scan the [Start Here: 5 ADRs in 15 Minutes](../../../../docs/architecture/architectural-decisions/README.md#start-here-5-adrs-in-15-minutes)
block in the ADR index. Open any ADR whose slug matches your current
workstream from the [full ADR index](../../../../docs/architecture/architectural-decisions/README.md).

### 3. Learning-loop surfaces (active memory)

- @.agent/memory/active/distilled.md — refined cross-session lessons
- @.agent/memory/active/napkin.md — current session observations
- @.agent/memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md —
  constraint at tripwire-design time (passive guidance needs an active
  layer to fire under context pressure)
- Your own platform's per-user memory and session logs. Scan the
  surface for the platform you are running on:
  - Claude Code: `~/.claude/projects/<project>/memory/`
  - Cursor: `~/.cursor/chats/`, `~/.cursor/prompt_history.json`; Composer may inject deterministic identity from `.cursor/hooks/oak-session-identity.mjs` (`sessionStart`; see `agent-tools/docs/agent-identity.md` and [Cursor Hooks](https://cursor.com/docs/hooks))
  - Codex: `~/.codex/memories/`, `~/.codex/history.jsonl`

  Read only the surface that matches your current platform at
  session open. Cross-platform ingestion (reading another
  platform's surface for insight) is a consolidation-time
  activity, not a session-open one — see `consolidate-docs`
  step 3.

### 3a. Operator profile (machine-local; absence is normal)

Read the operator profile if this machine has one. It carries facts about the
human you are working with that cannot be tracked: which credential identity
performs which action class on third-party systems, their tone-of-voice and
communication preferences, and personal operating preferences. The contract,
including what must never be stored there, is
[`.agent/operator-local/README.md`](../../../operator-local/README.md).

It is machine-local, so it does not travel through git and a linked worktree
holds no copy. Resolve it in the **primary checkout**:

```bash
PRIMARY="$(git worktree list --porcelain | head -1 | sed 's/^worktree //')"
[ -f "$PRIMARY/.agent/operator-local/profile.md" ] \
  && cat "$PRIMARY/.agent/operator-local/profile.md"
```

**A missing profile is the expected condition, not a defect** (`principles.md`
§Any User, Any Machine): proceed on tracked defaults and say nothing. Never
block, warn, or treat its absence as a gap to fill, and never make a
correctness property depend on it.

This is a **durable** home, unlike the per-user memory buffer above
(`per-user-memory-is-a-buffer`) — so when a session learns a stable preference
that keeps being re-derived, graduating it into the profile is the cure. The
reverse also holds: a profile entry that turns out to matter to more than one
person is doctrine, and belongs in a tracked surface instead.

### 4. Live state (operational memory) — authority order

Read in order; stop at whichever answers your next-step question:

1. @.agent/memory/operational/repo-continuity.md — canonical continuity contract
2. @.agent/memory/operational/threads/README.md — thread convention + identity discipline (PDR-027)
3. `.agent/memory/operational/threads/<slug>.next-session.md` — the thread record for any thread the session will touch (carries identity, next-session landing, _and lane state_)
4. `.agent/state/collaboration/active-claims.json` — active-claims
   registry and ordered advisory `commit_queue`
5. `.agent/state/collaboration/shared-comms-log.md` — generated recent
   free-form collaboration context
6. `.agent/state/collaboration/conversations/*.json` — open decision
   threads, sidebars, joint decisions, unresolved decision requests, and
   evidence obligations for the touched thread or area
7. `.agent/state/collaboration/escalations/*.json` — active owner-facing
   escalation cases for the touched thread or area

When reading `active-claims.json`, surface any fresh `commit_queue` entries
alongside active claims: `intent_id`, `agent_id`, `files`, `commit_subject`,
`phase`, and `expires_at`. Queue entries are discovery and ordering signals,
not mechanical refusals.

If a dirty slice has no matching active claim or recent comms event, do not
classify it as orphaned until `repo-continuity.md` Next Safe Steps, the touched
thread record, and any active plan have been checked for owner-direction
landing notes or explicit hold-state. Some legitimate slices become visible
there before a claim or comms event exists.

Apply the
[`register-active-areas-at-session-open`](../../../rules/register-active-areas-at-session-open.md)
rule before any edit: enumerate the areas you intend to touch, register
your own active claim through the collaboration-state helper when available,
and leave an artefact proving the registry was
consulted. When the session is playing a named coordination role
(director, peer, marshal, curator, implementer, ...), pass it via
`--role <role>` on `claims open` so peers and glance surfaces (such as
the statusline session-shape indicators) can resolve the team shape from
the registry; the vocabulary is open and honest-by-convention. If no
entries other than your own exist, log "no other agents
present" through an immutable comms event and proceed (bootstrap fast-path).
On overlap, consult the shared communication log and any
open decision-thread and escalation files before deciding whether to
proceed, ping, append a decision thread, request a sidebar, record a
joint decision, open or close an escalation, or ask the owner.

When registering your PDR-027 identity row, use an existing owner-assigned
`agent_name` if one matches. Otherwise derive a session display name with
`pnpm agent-tools:agent-identity --format display`. The CLI reads (in order)
`PRACTICE_AGENT_SESSION_ID_CLAUDE`, `PRACTICE_AGENT_SESSION_ID_CURSOR`,
`PRACTICE_AGENT_SESSION_ID_CODEX`, then the harness-native `CODEX_THREAD_ID`.
Platform hooks set the platform-suffixed Practice variable: the Claude Code
`SessionStart` hook (`.claude/hooks/practice-session-identity.mjs`) appends
`PRACTICE_AGENT_SESSION_ID_CLAUDE` to `$CLAUDE_ENV_FILE`, and the Cursor
`sessionStart` hook (`.cursor/hooks/oak-session-identity.mjs`) injects
`PRACTICE_AGENT_SESSION_ID_CURSOR`. If none of these is set in your shell
(e.g. the hook artefact has not been built yet), pass
`--seed "<stable-session-seed>"` explicitly. Do not use personal-email
fallback.

Before any Codex thread registration or shared collaboration-state write,
run the PDR-027 identity preflight with the current platform and model values.
For this repo's Codex GPT-5 sessions the command is:

```bash
pnpm agent-tools:collaboration-state -- identity preflight --platform codex --model GPT-5
```

Codex sessions with `CODEX_THREAD_ID` available must not write new thread rows
or collaboration state as `Codex` / `unknown`; use the derived `agent_name` and
`session_id_prefix`. Codex `SessionStart` hooks may inject the same block as
developer context, but the preflight command remains the correctness check.

Before staging or committing, use the always-active commit skill. It
checks for fresh `commit_queue` entries and `git:index/head` commit-window
claims, enqueues your intended bundle before staging, verifies the staged
bundle exactly before `git commit`, and clears the queue entry after success.

### 5. Active plans

Read the active plan(s) named in the thread's next-session record.
Plans are authoritative for scope, sequencing, acceptance, and
validation.

### 6. Live branch state

```bash
git status --short
git log --oneline --decorate -5
```

### 6a. Collaborating human (resolve, don't assume)

Nothing in a session may assume who the human collaborator is — the
estate serves any user on any machine (`principles.md` §Any User, Any
Machine). Resolve the collaborating human at session open,
derive-first per
[`read-before-asking`](../../../rules/read-before-asking.md):

```bash
git config user.name && git config user.email
```

1. **Local git identity is the default answer** — zero interaction
   cost and present in every checkout. It resolves nothing when it
   names a bot or shared credential (see
   [`identify-as-agent-under-shared-credentials`](../../../rules/identify-as-agent-under-shared-credentials.md));
   and it is config, not authentication, so treat it as a default,
   never proof.
2. **A per-user-authenticated service is the authoritative
   cross-check** where one is connected — e.g. the Linear MCP viewer
   (`get_user("me")`): it is real auth, resolved on this machine, for
   this user.
3. **Ask the human only as the residue**: both sources absent,
   bot-shaped, or disagreeing with each other.

Carry the resolution into every human-facing surface the session
renders (owner-attention cards, per-user register renders, handoff
records) instead of a remembered name. Memory and collaboration state
name people historically — they are records of who acted, never
resolution sources for who is here now.

**Temporary — a clear run for Matt (owner-directed, 2026-08-03; remove
when the owner declares the first-submission window closed — that
declaration is the removal trigger, no other signal).** The easiest
reliable signal that the collaborating human is Matt is his GitHub
handle: `gh api user --jq .login` returning `mantagen` (owner-named
detection route); the resolution order above applies where that signal
is absent or bot-shaped. When — and only when — Matt is the identified
user:

- Open with a warm welcome that reflects the fleet's CURRENT quiet
  state, derived from the live surfaces this workflow already loads
  (open pull requests and their draft flags, active claims) — the
  standing owner intent is that agent lanes stay parked in draft pull
  requests so nothing churns under his work, with only the upstream
  spec-update lane allowed near his surfaces and always tagged to him.
  Say what is true at session open, never a remembered snapshot.
- Treat his work as the repository's first priority for the session:
  support what he is doing ahead of any agent-side backlog, keep
  answers plain and practical, and route around his lane, never
  through it.
- Pass on the team's encouragement, plainly and warmly: Jim and the
  whole fleet cleared this run for him on purpose, everyone is glad he
  is making it, and he should ask any session for whatever he needs —
  that is exactly what the agents are here for.

### 7. Host health

```bash
uptime                                      # load averages…
sysctl -n hw.ncpu 2>/dev/null || nproc      # …vs this core count
sysctl vm.swapusage 2>/dev/null || free -m 2>/dev/null || true  # swap
# macOS-correct signals (the load-avg/swap above over-read there — see below):
top -l1 2>/dev/null | grep -E "CPU usage|PhysMem"; memory_pressure 2>/dev/null | tail -1 || true
```

A load average well above the core count, or heavy swap, is a
stop-and-surface signal before work starts — a starved host corrupts
gate timings, watcher deadlines, and experiment results, and the cause
may be leaked processes from an earlier session (see
[`no-unbounded-host-load`](../../../rules/no-unbounded-host-load.md)).

**Read the signal correctly for your platform.** The load-avg-vs-cores +
swap-used reading above is Linux-shaped and **over-reads on macOS** (a healthy
Mac sits above core count with a large swap-"used"). On macOS the saturation
signal is a **low CPU idle %** (`top -l1`) and a **yellow/red memory-pressure
colour** (`memory_pressure`), not load-avg or swap; and in a busy multi-agent
window, watcher drain-step deaths are comms-volume cost, not host starvation.
Owner-evidenced 2026-06-28; the reasoning is in
[`no-unbounded-host-load`](../../../rules/no-unbounded-host-load.md) §4.

### 8. Worktree / fresh-checkout build

Every fresh git worktree or clone must install **and build** before any gate or
substantial work — not only the primary checkout:

```bash
pnpm install
pnpm build
```

`type-check` and `vitest` pass on install alone, so the gap stays silent until
`lint` runs: ESLint's flat config imports the internal
`@oaknational/eslint-plugin-standards`, whose package `exports` resolve to
`dist/`. Unbuilt, bare `eslint` exits 2 (`No exports main defined`). The primary
checkout is usually already built, which masks this in the main tree only — so a
worktree-based lane must run the build itself before trusting any gate.

It also matters beyond gates: a worktree session shows **no statusline** unless the
worktree was built **before the session started** (a known primary-checkout
statusline-resolution bug). Building mid-session does not restore the current
session's statusline. So build every new worktree **before** opening the session,
not after.

`pnpm install` also does NOT fetch Playwright browser binaries, so a fresh
worktree's pre-push `test:ui`/`test:e2e` legs die with "Executable doesn't
exist at …chrome-headless-shell" until you run
`pnpm --filter <app> exec playwright install chromium-headless-shell` once in
the worktree. Read the log before assuming a known flake — this failure is
not the oauth-proxy concurrency flake. Full fresh-worktree setup is install,
build, AND the Playwright browser install before the browser-test gates run.

The collaboration substrate is also unseeded on a fresh checkout: the
instance-tier state files are untracked-by-design (ADR-199 / PDR-094). The
pieces differ in who creates them: `active-claims.json`,
`closed-claims.archive.json` require EXPLICIT seeding — the first claims read
fails loud with seeding instructions rather than creating them. The
canonical omit-path `comms watch` resolves the PRIMARY coordination home,
then creates both `comms/` and the exact-display-name seen-file's
`comms-seen/` parent. Event writers also create `comms/`. An explicit
`--comms-dir` / `--seen-file` pair is preserved verbatim and can therefore
still manufacture a wrongly homed decoy (the F-41 class); use it only for a
deliberate alternate target. Seed the registry files — guarded, so existing
state is never overwritten — before the first collaboration-state move. The
block below
roots every path at THIS repository's PRIMARY checkout (the first worktree
in `git worktree list --porcelain`, the same home `resolveCoordinationHome`
derives), so it is safe to run from a linked worktree too. Never seed
cwd-relative from a linked worktree: a worktree-local substrate is a decoy
invisible to peers — the F-41 class. Scope: the block seeds only this
repository's own canonical home. In a session whose declared coordination
home is FOREIGN (an inter-Practice window per the join-ceremony skill),
seed the declared home instead — running this block there would seed a
local decoy while the foreign home stays unseeded.

```bash
COORD_HOME="$(git worktree list --porcelain | head -1 | sed 's/^worktree //')"
# Refuse an underivable home: if git fails or emits nothing, COORD_HOME is
# empty and the paths below would target the filesystem root — a decoy.
if [ ! -d "$COORD_HOME/.git" ] && [ ! -f "$COORD_HOME/.git" ]; then
  echo "STOP: coordination home not derived (git worktree list failed?) — do not seed"
else
  # Exclusive create (noclobber): concurrent identically-prompted sessions
  # can both reach this step, and a check-then-write would let the loser
  # truncate the winner's live registry. With `set -C` the race loser fails
  # the write and keeps the winner's file; already-exists counts as success,
  # any other failure (permissions, a path occupied by a directory) still
  # surfaces. The steps are &&-chained so an earlier failure fails the
  # whole block loudly instead of being masked by a later success.
  # Seed shapes: the canonical source is
  # agent-tools/src/collaboration-state/state-file-seeds.ts (and the
  # readers' own error messages, which embed it). This block cannot import
  # that file (it must run on a fresh checkout before any build), so the
  # lockstep is PINNED: state-file-seeds.integration.test.ts reddens when
  # these literals drift from the constants — fix both in the same change.
  mkdir -p "$COORD_HOME/.agent/state/collaboration" \
  && { ( set -C; printf '%s\n' '{ "schema_version": "1.3.0", "claims": [], "commit_queue": [] }' \
    > "$COORD_HOME/.agent/state/collaboration/active-claims.json" ) 2>/dev/null \
    || [ -f "$COORD_HOME/.agent/state/collaboration/active-claims.json" ]; } \
  && { ( set -C; printf '%s\n' '{ "schema_version": "1.3.0", "claims": [] }' \
    > "$COORD_HOME/.agent/state/collaboration/closed-claims.archive.json" ) 2>/dev/null \
    || [ -f "$COORD_HOME/.agent/state/collaboration/closed-claims.archive.json" ]; } \
  || echo "SEEDING FAILED: inspect the failed step above — do not proceed on a half-seeded substrate"
fi
```

## Practice Box

Check `.agent/practice-core/incoming/` for practice-core files. If
present, alert the user — incoming material may carry learnings from
another repo. Full integration happens during `/oak-consolidate-docs`.

## Per-Session Landing Commitment

State your landing target at session open. See
[PDR-026: Per-Session Landing Commitment](../../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md)
for the doctrine; the ritual is:

> Target: `<lane-id or artefact>` — `<specific outcome>`.

A landing is a specific invariant achieved in code — a rule enabled,
a test added, a file authored, a commit made, a deployment registered
— not a plan edit or a "lane opened."

If no landing is appropriate:

> No-landing session — reason: `<reason>`.

Bounded exceptions: deep-consolidation, Core-trinity refinement, and
root-cause investigation sessions. Any other no-landing session is
drift.

The deep-consolidation and Core-trinity shapes are owner-named, never
menu items: when offering landing options at session open, list only
lanes that land code or settle an architectural question. Describe
consolidation pressure as state ("napkin over threshold") or, when it
genuinely blocks forward motion, as a blocker — never as an alternative
lane. The owner names those sessions when they want them; root-cause
investigation is incident-driven rather than menu-driven.

## Session Title — `/rename` Suggestion

As soon as the session intent is clear and BEFORE any significant
implementation (no source edits, no scaffolding, no claim opening
beyond pure-reading work), suggest the user run:

> `/rename <session-name> - <intent>`

where `<session-name>` is your PDR-027 display name and `<intent>` is
the cycle, plan, or boundary you have committed to landing.

The suggestion is surfaced **once**, at the moment intent first clears:

- Solo sessions: typically after the Per-Session Landing Commitment
  above is declared.
- Team sessions: after rendezvous resolves and cycle / boundary
  assignment is settled. See
  [`start-right-team` First Moves §4](../../start-right-team/SKILL-CANONICAL.md)
  for the team-shaped invocation point.

Never surface `/rename` in closeout summaries — by then the title
either matches the work (no-op) or no longer matches because the work
shifted (in which case the rename is too late to inform the title's
audience). This section is the standing rule's doctrine home.

## Work Shape and Simple Plan

Before the first non-planning edit, leave a small observable plan
artefact whose size matches the work:

- **Trivial work**: the landing target or no-landing reason is enough.
- **Bounded non-trivial work**: record a simple plan in chat or the
  touched thread record naming goal, scope, validation, and lifecycle
  touch points.
- **Multi-session, architectural, Practice, cross-workspace, or high-risk
  work**: use an executable repo plan in `current/` or `active/`.

This is a work-shape declaration, not a repo plan file for every edit.
It operationalises PDR-026 without turning small fixes into plan theatre.

For observability work specifically: if the landing moves a matrix
cell in
[`what-the-system-emits-today.md`](../../../plans-backlog-2026-07/observability/what-the-system-emits-today.md)
from empty to populated, update the artefact in the same commit.

## Session Priority

Apply session priority ordering:

1. **Bugs first** — fix known defects before anything else
2. **Unfinished planned work second** — complete in-progress items
3. **New work last** — only start new items when the above are clear

Research holds a **protected floor** under this ordering (owner standing
guidance, 2026-07-25, "with some flex"): the full order is bugs >
features > speculative research, but practice/meta research — the
improve-how-we-improve loop — keeps a protected minimum share of
attention, because a pure strict ordering starves the meta-level
permanently (there is always another feature) and the estate's
compounding value comes precisely from that loop. The floor is
protection against starvation, never an escape from the ordering:
research never jumps the queue past a live bug or a committed feature —
it just never goes to zero. When every seat has been on bugs/features
for a sustained stretch, deliberately seat or timebox a research slice
rather than letting "one more feature" defer it forever. "Some flex"
means judgment on the boundaries, not suspension of the shape.

## Guiding Questions

Before diving in, pause and ask:

1. **Are we solving the right problem, at the right layer?**
2. **What value are we delivering, through what impact, for which users?**
3. **Could it be simpler without compromising quality?**
4. **What assumptions am I making? Are they valid?**
5. **What is the goal, and what is the full set of surfaces relevantly in scope for
   it — not just what I was pointed at?** Emit a proportionate `Goal · In · Out`
   artefact before approach, and again before declaring done, per
   [`scope-from-goal-before-approach`](../../../rules/scope-from-goal-before-approach.md).

These questions are **not** session-open-only: re-ask them at every task/pointer
arrival and before declaring done, not just here.

For analysis-, planning-, or decision-heavy work, [`reason`](../../cognition/reason/SKILL-CANONICAL.md)
structures the thinking outward (the pair to `metacognition`'s inward reflection), and the
[grammar of thinking](../../../reference/grammar-of-thinking.md) is the yardstick for complex
rewrites and high-stakes planning.

## Commit

**Commit** to excellence in systems architecture, software engineering,
and developer experience. Choose architectural correctness over
short-term expediency. This requires critical and _long-term_
thinking.

## Schema-First Nuance

Schema-first is absolute for SDK code calling the upstream API or
extracting from the OpenAPI spec. It is acceptable to add additional
metadata (e.g., MCP tool descriptions) at sdk-codegen time.

When analysing generated files, always analyse the generator code that
produced them — the generator is the source of truth.

## Sub-agent Reviews

Invoke sub-agent reviewers per the `invoke-code-experts` rule after
making changes. The full invocation matrix, timing tiers, quick-triage
checklist, worked examples, and copy/paste-ready platform-specific
invocation examples live in executive memory:
[`.agent/memory/executive/invoke-code-experts.md`](../../../memory/executive/invoke-code-experts.md).

## Process

**Do not assume you know the initial step.** Discuss with the user
first.

## Quality Gates

Run after making changes. Note: some gates trigger earlier ones;
caching prevents duplicate work. See @docs/engineering/build-system.md
and ADR-065 for caching details.

```bash
# From repo root, one at a time
pnpm sdk-codegen        # Makes changes
pnpm build              # Makes changes
pnpm type-check
pnpm lint:fix           # Makes changes
pnpm format:root        # Makes changes
pnpm markdownlint:root  # Makes changes
pnpm subagents:check    # After sub-agent definition changes
pnpm portability:check  # After platform surface or hook changes
pnpm repo-validators:check  # Workspace-owned repo validators
pnpm test
pnpm test:widget
pnpm test:e2e
pnpm test:ui
pnpm test:a11y
pnpm test:widget:ui
pnpm test:widget:a11y

# Practice health — three-zone model, ADR-144
pnpm practice:fitness:informational  # Four-zone report (always exit 0)
# Consolidation-closure signal (run via oak-consolidate-docs):
#   pnpm practice:fitness:strict-hard
# Vocabulary consistency (ADR-144 §Key Principles #1):
#   pnpm practice:vocabulary
```
