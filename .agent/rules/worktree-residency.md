# Worktree Residency

**Owner directive (2026-07-31, verbatim substance):** when an agent is
working on a worktree, they must change their cwd to that worktree, and
it must be stable until the agent changes it — never bouncing back to
the principal checkout at the harness's discretion.

An agent working a worktree lane RESIDES in that worktree: its working
directory, its doctrine load, and the arm-time context of everything it
starts all point at the worktree. Residency is established by a
session-level mechanism, never by shell `cd` — on this platform a bare
`cd` between checkouts is not residency and does not survive.

## Trigger

Taking up a worktree lane (at claim-open, before the first lane
action); any observed `Shell cwd was reset` line; launching or
re-arming background tasks from a lane session.

## Action

**This rule is the standing project instruction that directs worktree
use** (the `EnterWorktree` tool acts on explicit instruction from the
user or from project instructions — this rule is that instruction): an
agent taking up a worktree lane is explicitly instructed to establish
residency with `EnterWorktree` before its first lane action.

1. **Primary mechanism — `EnterWorktree` from the principal.** The
   typical estate workflow (owner word, 2026-07-31) launches sessions
   in the principal checkout; the session then decides to take a lane.
   The residency sequence: create the worktree per `worktree-hygiene`
   conventions (`git worktree add`, branch freshly cut from
   `origin/main`, sibling `-worktrees/` directory), then
   `EnterWorktree` with `path` — the session-level switch. Verified
   first-hand 2026-07-31 (Claude Code 2.1.220): path entry reaches a
   sibling-directory worktree on first entry from the launch
   directory, the session cwd IS the worktree and holds stable across
   separate tool calls with no reset, and `ExitWorktree` restores the
   principal cleanly. Fresh-cut-from-main matters doubly under
   residency: the worktree becomes the session's working context, so a
   stale branch means stale doctrine. **Never let `EnterWorktree`
   fresh mode CREATE the lane worktree**: fresh mode documents
   branching from `origin/main`, but observed behaviour (2026-07-31,
   Claude Code 2.1.220, twice at one seat) bases the new branch on the
   PRIMARY's checked-out HEAD — on this estate a coordination-branch
   tip — so lane PRs ship with coordination commits riding under the
   story (PR #673 lost a close-and-succeed cycle to exactly this; #674
   is its clean successor). Create with the explicit start point —
   `git fetch origin && git worktree add <path> -b <branch>
   origin/main` — then enter by path. A lane found mis-cut (three
   instances in one day, 2026-08-17, all from coordination-lineage tips)
   is fixed forward: rename the mis-based branch `scrap/<name>-mis-based`,
   `git switch -c <ticket-branch> origin/main`, verify with
   `git merge-base --is-ancestor`; scrap branches await the owner's
   deletion.
2. **Secondary — residency at launch**, when a session is started FOR
   a known lane: launch in the worktree (`cd <worktree> && claude`,
   or `claude --worktree <name>` for `.claude/worktrees/` worktrees).
   Useful to know; not the typical estate flow.
3. **`Shell cwd was reset` is a residency-violation signal, never
   noise.** Bash cwd persists only inside the project directory and
   additional working directories; a `cd` into a sibling-directory
   worktree is reset to the project directory by design (documented
   behaviour; reproduced first-hand 2026-07-31 on Claude Code 2.1.220).
   On seeing the line, stop and establish residency properly rather
   than routing around it with repeated `cd` or `-C` improvisation.
4. **Arm background tasks only after residency is established.**
   Background tasks and monitors capture their working directory at
   arm time and keep it for life (documented). Keep the explicit
   `cd <repo-root> || exit 1` first line on every arm as
   belt-and-braces (the watcher rule's existing discipline).

   **Platform-isolation refinement (owner-worded fleet cure,
   2026-08-06):** Claude Code v2.1.223 landed worktree isolation
   mid-fleet-day — worktree-RESIDENT seats refused Monitor arms and
   principal-checkout git while primary-resident monitors passed the
   whole time. Residency determines the guard, not the command. The
   fleet order under isolation-affected versions: **launch at the
   principal, arm monitors THERE, then enter lanes** — a monitor a
   lane needs armed from inside the worktree may be refused outright.
   The CLI is the front door; recurring watches belong in agent-tools
   (the watch-commands backlog).

   **A residency switch can kill a primary-armed monitor (observed
   2026-09-01, Claude Code 2.1.25x):** `EnterWorktree` killed a comms
   watcher Monitor armed at the primary — the re-armed watcher exited
   124 within ~30 s of the switch while the first had lived its full
   3600 s backstop — so the arm-time-capture sentence above did not
   hold that day. After ANY residency switch, verify each monitor
   first-hand (heartbeat mtime, the exit notification) and re-arm what
   died; an n=1 seat covers the gap with `comms list --since <boundary>`
   sweeps at boundaries. A session RESTORE is the harsher sibling: it
   resets cwd to the primary and removes every background task (watcher,
   pr-watch alike), so re-arm before reading the stream (2026-09-02).
5. **Residency never re-homes coordination surfaces.** Comms, claims,
   and the commit queue stay resolved to the PRIMARY coordination home
   with explicit absolute paths, per `worktree-hygiene` clause 8 and
   ADR-197. A resident agent reads and writes the shared stream, not a
   worktree-local decoy.
6. **The Director/principal seat resides in the principal checkout.**
   Residency binds lane implementers (PDR-117): isolate the doing in
   worktrees, centralise the awareness in the principal. A principal
   seat reaching into a worktree for a read uses `git -C <worktree>`
   and absolute paths — reads may roam; residency is declared.
7. **Subagents of a resident session start at the worktree** (a
   subagent's Bash starts at the session's project directory, which
   for a resident session is the worktree). `isolation: worktree`
   pins a subagent to its OWN fresh worktree — a deliberate, different
   choice; verify a spawned worktree's HEAD before trusting it (the
   parallel-dispatch anti-pattern).
8. **Pre-PR contamination check.** Before opening any lane PR:
   `git log --oneline origin/main..HEAD` must list exactly the
   story's own commits. Anything else is a contaminated base — re-cut
   (`git switch -c <branch>-v2 origin/main`, cherry-pick the story
   commits across; history rewrite is hook-blocked on this estate),
   close the contaminated PR with a pointer, and open its successor.

## Platform mechanics (version-pinned)

Verified against Claude Code 2.1.220 and its tools reference,
worktrees, and sub-agents documentation, 2026-07-31: cwd persistence
boundary and reset line; background-task arm-time capture; subagent
project-directory start; `EnterWorktree`/`ExitWorktree` session-level
switch semantics and the `.claude/worktrees/` restriction; the
`--worktree` launch flag; `worktree.baseRef` setting. Re-verify from
the platform's current documentation when the CLI major-versions or
this rule's mechanics disagree with observation
(`capability-questions-from-original-sources`).

Three considered-and-rejected mechanics, recorded so they are not
re-proposed: adding the sibling `-worktrees/` directory to
`additionalDirectories` (it would make a bare `cd` silently persist,
hiding exactly the residency violations this rule exists to surface);
relocating the lane convention into `.claude/worktrees/` (that
directory is NESTED inside the principal checkout, and nested
worktrees give false-clean dependency runs — Node resolution walks up
into the parent's `node_modules`, the proven leak `worktree-hygiene`
clause 8 records — while `EnterWorktree` reaches sibling worktrees
fine); and pre-approving `EnterWorktree` in `permissions.allow`
(the 2026-07-31 probe observed no approval friction for sibling-path
entry — re-open only if a lane observes a prompt in practice).
`worktree.baseRef` is a candidate configuration cure for fresh-mode's
base (unverified — verify from current platform documentation before
relying on it; the explicit-start-point sequence in Action clause 1
needs no configuration).

The worktree-isolation guard (Claude Code 2.1.25x, observed 2026-09-01
and 2026-09-02) refuses compound commands, `$(…)`, heredocs carrying
runtime values, `env VAR=… cmd`, `--dir`, and multi-line arms as "too
complex", and refuses primary-path Write/Edit from a worktree-resident
session. The working shapes: one plain command per call; a scratch shell
wrapper, run as one plain command, for env-prefixed commands; and the
Edit tool for edits — a Bash-hook workaround must never generalise into
scripted file editing (owner correction 2026-09-02, verbatim: "why are
you writing python to edit files?").

## Why a rule, not a PDR clause

A discrete operational invariant with one trigger (taking up a lane)
and one action (establish and hold residency), platform mechanics
attached; `worktree-hygiene` owns the lane lifecycle and points here
from its operate-from-a-worktree clause.

## Related surfaces

- [`worktree-hygiene`](worktree-hygiene.md) — lane lifecycle; clause 8
  operating mechanics.
- [PDR-117](../practice-core/decision-records/PDR-117-director-and-implementer-roles.md)
  — the Director/Implementer split residency binds to.
- [ADR-197](../../docs/architecture/architectural-decisions/197-coordination-home-owns-registry-state.md)
  — the coordination home residency never re-homes.
- `.agent/memory/active/patterns/parallel-worktree-dispatch-unreliable.md`
  — the spawned-worktree HEAD verification discipline.

## Why residency also protects the commit path

The primary checkout's pre-commit and pre-push hooks gate the WHOLE working
tree, so any seat's dirty or failing file blocks every seat's commits and
pushes from the primary — a resident lane commits and pushes from its own
worktree instead, and the contention class disappears. Operational note for
worktree pushes: give the push a 600s timeout — the 120s default kills the
hook suite mid-run and produces an ambiguous write.

## Enforcement

Behavioural, with a mechanical tell and an observable surface: the
harness's own `Shell cwd was reset` line marks every violation of
clause 3 at the moment it happens, and the statusline renders the
session's residency live (owner-observed 2026-07-31: during the
residency probe it displayed both the entered worktree and the
principal's coordination branch — where a session lives is glanceable,
per `agent-state-observable`). Lane team-start broadcasts name the
residency (worktree path) alongside the claim. A future hardening
candidate, pointer-grade: a non-blocking PostToolUse alert on the
reset line, in the drift-alert taste.
