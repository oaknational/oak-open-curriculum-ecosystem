---
prompt_id: start-right-quick
title: 'Start Right (Quick)'
type: workflow
status: active
last_updated: 2026-09-29
---

# Start Right (Quick)

Ground yourself before beginning work. Read in the order below; each
step leads to the surfaces the next step assumes.

## Environment Classification

Before any command in this workflow, use the tri-state classification in
`.agent/directives/cloud-environment-routing.md`. When it selects ChatGPT Work,
that non-execution profile governs every command-bearing step below: retain all
reading and static inspection, but skip package, build, test, hook, identity and
repo-owned collaboration-CLI execution. Platform-native coordination remains
available. Detector error is a stop, not a fall-through.

## Ground First (reading order)

Ground with the proper instruments. Dumping a corpus into context (whole
files, whole diffs) is unreadable at the altitude the work needs and forces
compaction; the instruments are the operations each platform provides for
them — a bounded read at an offset, a content search, a file-pattern match,
and a read-only explorer that returns a conclusion rather than the corpus —
with the plan visible before the first mutation (owner correction 2026-09-01,
verbatim: "Use the proper tools for finding content, and generally sort out
the discipline here, this is serious work. What is the plan?").
A second instance, 2026-09-06 (owner verbatim: "stick to using standard tools
rather than complex bash scripts which confuse the permissions agent"): the
file-editing instruments are the platform's native per-file editing operation
(each platform adapter names its own) and one plain command per shell call; the
compound heredoc that rewrote two files was the instrument the owner refused,
though the work inside it was right.

Regrounding has TWO legs, and the second is the one skipped. After a
compaction or a handoff, verifying mechanical state — PRs, claims, comms,
git, the board — is not being up to speed; the governing corpus (the plans
README, the strategic node, the live plans, recent closeout records) carries
the intent those states serve, and a proposal reasoned from a summary and
memory fragments re-opens decisions already made (owner, 2026-07-24, after a
"drain the plans backlog" recommendation that the corpus reset had
deliberately frozen: "I think you need to spend more time understanding the
history rather than trying to make sensible guesses about next steps").
Before any scope proposal or card, cite the governing document read THIS
session that grounds it; no citation, not ready to propose. And read
inherited letters and records critically — drift accumulates, so their
claims are checked against the artefacts, never assumed.

A command shape carried across a compaction is not the command. At a resume
after a compaction or a handoff: the rules that govern the tool boundary are
re-read before the first command (every Bash call compound against the
tool-boundary rule, found by reading an old handoff, 2026-10-02); a command's
help is read before its first attempt, since a shape carried in a summary is
not the command (a direct-message command refused twice on a shape carried in
a summary, 2026-10-03); and the context meter is read twice, a few calls
apart, before anything is priced on it (its first read after a compaction
described another moment, twice, 2026-10-02).

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
6. @.agent/directives/orientation.md — layering contract and authority order

For Codex, Gemini, or any other platform that does not auto-load canonical
rules, read every canonical `.agent/rules/*.md` file listed in
`RULES_INDEX.md` before substantive work. Treat `RULES_INDEX.md` as the live
inventory rather than copying the rule list here.

### 2. ADRs for the workstream

Open any ADR whose slug matches your current workstream from the
the host's ADR index (the decision-record directory under `docs/architecture/`); the
Cardinal Rule's records (ADR-020, ADR-021) apply to any work that touches a
rendered surface.

### 3. Learning-loop surfaces (active memory)

- @.agent/memory/active/distilled.md — refined cross-session lessons
- @.agent/memory/active/napkin.md — current session observations
- @.agent/memory/active/patterns/README.md — the pattern index (passive
  guidance needs an active layer to fire under context pressure; check it
  at tripwire-design time)
- Your own platform's per-user memory and session logs. Scan the
  surface for the platform you are running on:
  - Claude Code: `~/.claude/projects/<project>/memory/`
  - Cursor: `~/.cursor/chats/`, `~/.cursor/prompt_history.json`; Composer may inject deterministic identity from `.cursor/hooks/practice-session-identity.mjs` (`sessionStart`; see `agent-tools/docs/agent-identity.md` and [Cursor Hooks](https://cursor.com/docs/hooks))
  - Codex: `~/.codex/memories/`, `~/.codex/history.jsonl`

  Read only the surface that matches your current platform at
  session open. Cross-platform ingestion (reading another
  platform's surface for insight) is a consolidation-time
  activity, not a session-open one — see `consolidate-docs`
  step 3.

### 3a. Operator profile (home directory; absence is normal)

Read the operator profile if this machine has one. It carries facts about the
human you are working with that cannot be tracked: which credential identity
performs which action class on third-party systems, their tone-of-voice and
communication preferences, and personal operating preferences. The contract,
including what must never be stored there, is
[PDR-141](../../../practice-core/decision-records/PDR-141-operator-profile-in-the-home-directory.md).

It lives in the operator's home directory, shared by every Practice
repository, linked worktree and clone on the machine, and it may be a git
repository the operator syncs between machines. Pull the profile first,
then run the check — it exits 0 and says so when nothing is there, and it
refuses a document carrying a credential-shaped line before anything is
read into the session — asking it to emit the index, the current
repository's scope file (keyed by the root package.json name, `name` or
`scope--name` for a scoped name, never a remote or a path) and this machine's
file (keyed by the short host name); a named document that is absent
prints one line naming it, and no document prints unless all conformed.

The check and the sync need the host's tooling (agent-tools, installed and
built): on a cold clone run this step after the install and build below,
never before; the grounding never blocks on the profile.

```bash
# First the host's profile sync, pull side (PDR-141 decisions 13 to 16), as the
# Practice index names it: a no-op that says so unless the root is a repository
# with a remote. A refused pull (a conflict, no network) is surfaced and the
# grounding continues; the check below then reports the sync state.
pnpm profile:sync pull || echo "profile not pulled: read the line above — a conflict is the operator's to resolve by union (PDR-141 decision 15); the check still runs"
# The check prints the documents it validated from the same reads it checked
# (--emit), so nothing reopens a path after the check: a file replaced by a
# link between a check and a read would otherwise enter the session unread.
SCOPE="$(cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)" && node -p 'const n = (require("./package.json").name ?? "").trim(); const m = /^(?:@([^/]+)\/)?([^/@]+)$/.exec(n); const k = m ? [m[1], m[2]].filter(Boolean).join("--").toLowerCase() : ""; /^[a-z0-9][a-z0-9._-]*(?:--[a-z0-9][a-z0-9._-]*)?$/.test(k) ? k : ""' 2>/dev/null)"
MACHINE="$(hostname -s | tr '[:upper:]' '[:lower:]')"
pnpm profile:check --emit index.md ${SCOPE:+--emit repos/$SCOPE.md} --emit "machines/$MACHINE.md" \
  || echo "profile not read: the check refused it or the tooling is not built yet — fix, or return here after install and build"
```

A present profile that fails the check is fixed at once, never read around:
the contract is `.agent/practice-core/schemas/operator-profile.schema.json`. When a
session writes the profile on the operator's word, it runs the host's
profile sync, push side, in the same breath (PDR-141 decisions 13 to 16;
the Practice index names the command once the host binds one): the check
runs first, the commit is the operator's with a message naming the seat and
the fact, and no write sits unpushed across a session boundary. The sync is
a no-op on a profile that is not a repository, and both absence and a
non-repository profile stay first-class.

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
   registry (the advisory commit queue is machine-local per-intent
   state; read it with `pnpm agent-tools:commit-queue -- list`)
5. `.agent/state/collaboration/shared-comms-log.md` — generated recent
   free-form collaboration context
6. `.agent/state/collaboration/conversations/*.json` — open decision
   threads, sidebars, joint decisions, unresolved decision requests, and
   evidence obligations for the touched thread or area
7. `.agent/state/collaboration/escalations/*.json` — active owner-facing
   escalation cases for the touched thread or area

Alongside active claims, surface any fresh advisory commit-queue intents
(`pnpm agent-tools:commit-queue -- list`): `intent_id`, `agent_id`,
`files`, `commit_subject`, `phase`, and `expires_at`. Queue entries are
discovery and ordering signals, not mechanical refusals.

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
entries other than your own exist and the comms log shows no live peer,
the session is solo: record your claim and proceed without broadcasts
(`use-agent-comms-log` §Scale ceremony to the audience; bootstrap fast-path).
On overlap, consult the shared communication log and any
open decision-thread and escalation files before deciding whether to
proceed, ping, append a decision thread, request a sidebar, record a
joint decision, open or close an escalation, or ask the owner.

When registering your PDR-027 identity row, use an existing owner-assigned
`agent_name` if one matches. Otherwise derive a session display name with
`pnpm agent-tools:agent-identity --platform <label> --format display`, the label
your platform (`claude-code`, `cursor`, `codex` or `gemini`). The CLI reads (in
order) `PRACTICE_AGENT_SESSION_ID_CLAUDE`, `PRACTICE_AGENT_SESSION_ID_CURSOR`,
`PRACTICE_AGENT_SESSION_ID_GEMINI`, `PRACTICE_AGENT_SESSION_ID_CODEX`, the
cloud seat's `CLAUDE_CODE_REMOTE_SESSION_ID`, then the harness-native
`CLAUDE_CODE_SESSION_ID` (present in every Claude Code Bash tool shell) and
`CODEX_THREAD_ID`; the Claude seeds count only on a Claude platform, so a seat
opened from a Claude shell keeps its own identity. Platform hooks set the platform-suffixed Practice
variable: the Claude Code `SessionStart` hook
(`.claude/hooks/practice-session-identity.mjs`) appends
`PRACTICE_AGENT_SESSION_ID_CLAUDE` to `$CLAUDE_ENV_FILE` for shells created
after the write, and the Cursor `sessionStart` hook
(`.cursor/hooks/practice-session-identity.mjs`) injects
`PRACTICE_AGENT_SESSION_ID_CURSOR`. If none of these is set in your shell
(e.g. the hook artefact has not been built yet), pass
`--seed "<stable-session-seed>"` explicitly. Do not use personal-email
fallback.

Before any thread registration or shared collaboration-state write, run the
PDR-027 identity preflight with the current platform and model values, for
example:

```bash
pnpm agent-tools:collaboration-state -- identity preflight --platform claude --model <model-id>
```

Codex sessions with `CODEX_THREAD_ID` available must not write new thread rows
or collaboration state as `Codex` / `unknown`; use the derived `agent_name` and
`session_id_prefix`. Codex `SessionStart` hooks may inject the same block as
developer context, but the preflight command remains the correctness check.

Before staging or committing, use the always-active commit skill. On the
shared primary checkout it checks for fresh commit-queue intents and
`git:index/head` commit-window claims, enqueues your intended bundle before
staging, verifies the staged bundle exactly before `git commit`, and clears
the queue entry after success; in a linked worktree it commits by plain
pathspec with an audit line and no queue or window claim (owner ruling
2026-09-07; the skill's scope paragraph).

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
   cross-check** where one is connected — e.g. the GitHub CLI
   (`gh api user --jq .login`): it is real auth, resolved on this
   machine, for this user.
3. **Ask the human only as the residue**: both sources absent,
   bot-shaped, or disagreeing with each other.

Carry the resolution into every human-facing surface the session
renders (owner-attention cards, per-user register renders, handoff
records) instead of a remembered name. Memory and collaboration state
name people historically — they are records of who acted, never
resolution sources for who is here now.

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
.agent/setup/install-shellcheck.sh
```

`type-check` and `vitest` pass on install alone, and the install's bootstrap
builds every package agent-tools reaches that has built entry points, including
the internal ESLint standards plugin (the estate's `eslint-plugin-standards`
package) whose package `exports` resolve to `dist/`, so ESLint's flat config
loads on install alone too. What install does not write, the build does: the
generated outputs a gate reads (a site's route types its `type-check`
includes; a workspace's `dist/` that dependency-cruiser, knip and typed lint
read). The primary checkout is usually already built, which masks this in the
main tree only — so a worktree-based lane runs the build itself before
trusting any gate.

It also matters beyond gates: a worktree session shows **no statusline** unless the
worktree was built **before the session started** (a known primary-checkout
statusline-resolution bug). Building mid-session does not restore the current
session's statusline. So build every new worktree **before** opening the session,
not after.

`pnpm install` also does NOT fetch Playwright browser binaries, so a fresh
worktree's pre-push `test:ui`/`test:e2e` legs die with "Executable doesn't
exist at …chrome-headless-shell" until you run
`pnpm --filter <app> exec playwright install chromium-headless-shell` once in
the worktree. Read the log before assuming a known flake, and read the failing
job's own error lines before calling any check a defect or a flake: the fan-in
job goes red with any failed leg and names no cause of its own (a font-loader
flake read as the diff's fault, 2026-09-25).

The pinned shellcheck lives in the worktree's ignored `.tools/bin`, where the
shell lint gate looks before `PATH`; `.agent/setup/install-shellcheck.sh` puts
it there at a new clone or worktree's first setup (where the estate's
`pnpm install` runs the installer from its `postinstall`, by that; otherwise by
hand, the lane-setup skill's fourth line). Without it the gate falls back to
the shellcheck on `PATH`, which passes only while that one is the pinned
version, so every worktree without its own `.tools/bin` fails at once when the
`PATH` copy is upgraded.

Full fresh-worktree setup is install, build, the pinned shellcheck before the
first push, AND the Playwright browser install before the browser-test gates
run.

The collaboration substrate is also unseeded on a fresh checkout: the
instance-tier state files are untracked by design (`.agent/state/README.md`). The
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
  && { ( set -C; printf '%s\n' '{ "schema_version": "1.4.0", "claims": [] }' \
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
another repo. Full integration happens during the `consolidate-docs` skill.

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

## Generated Files

When analysing generated files, always analyse the generator code that
produced them — the generator is the source of truth. Here that means the
entity graph (`content/entities.json`) and the build that derives every
rendered surface from it (the Cardinal Rule in `principles.md`).

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

The hooks are the gates. The pre-commit hook runs the light gate (the staged
formatting and markdown checks, then the lint of the workspaces the commit
changes); the pre-push hook runs the full aggregate, `pnpm check`, under a
host gate slot, then the host's product legs; CI composes the same legs
(owner, 2026-10-04: light commit, full push, in both estates). So never run
these gates before, beside or after a commit or push (owner, 2026-09-14,
verbatim: "the commit triggers the gates, there is no point and a fair amount
of cost running the gates separately as well, never, ever do that"). Running
one test file while a change is red is development, not a gate run; the ban
is on running the suites the hooks run. The
[gates skill](../../change-custody/gates/SKILL-CANONICAL.md) unrolls `check`
one leg per line; the host's list below names the commands outside `check`,
for reading a failure and for curing one: a command marked "cure" mutates the
tree and is run only when a hook has refused and named it, never as a gate.
Shell lint runs inside `check` with the pinned shellcheck from the checkout's
`.tools/bin` (§8 says how it gets there); without it the gate falls back to
the `PATH` copy, which passes only while that one is the pinned version. A
cloud profile follows `cloud-environment-routing.md`. Some gates trigger
earlier ones and caching prevents duplicate work: see
@docs/engineering/build-system.md.

```bash
# OCE: the push hook runs the secret scan and the review-cost gate, then
# `pnpm check`; the commit hook runs the light gate. Never run them separately.
pnpm fix                      # cure: format, markdownlint and lint:fix together
pnpm lint:fix                 # cure: when the lint gate refuses
pnpm format:root              # cure: when the format gate refuses
pnpm markdownlint:root        # cure: when the markdown gate refuses
pnpm sdk-codegen              # inside check; regenerates the SDK (a cure when the schema-drift check refuses)
pnpm check:profile --dry-run  # outside the hooks: the gate profile a push would run, without running it
# The pull request's checks run CodeQL, Sonar, the Windows and browser jobs.

# Practice health — three-zone model, ADR-144
pnpm practice:fitness:informational  # four-zone report (always exit 0)
# Consolidation-closure signal (run via the consolidate-docs skill):
#   pnpm practice:fitness:strict-hard
# Vocabulary consistency:
#   pnpm practice:vocabulary
```
