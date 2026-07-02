---
name: "Agent Spawn-Flow Tool — launch-in-worktree as the derived binding"
status: active
type: developer-experience
thread: agent-operability
lineage:
  serves_thread: agent-operability
  serves_stream: agentic-framework
  derives_from: >
    F-98 (frictions register) + PDR-118 OQ2 (supersession-by-launch-in-worktree) +
    the originating session 2026-06-28 (owner-decided scope; owner-confirmed cwd fact)
  supersedes_framing_of: ../future/agent-work-state-registry.plan.md
created: 2026-06-28
owner_approved: 2026-06-28 (ExitPlanMode)
---

# Agent Spawn-Flow Tool

> **For the next agent — start here.** This is owner-approved, ready to build, and was deliberately
> moved to a fresh session. Read this whole file plus the **Pitfalls** section (it is the point of the
> handoff — the originating session hit these traps and the owner had to correct them). Then read
> `../future/knowledge-distribution-substrate.plan.md` for *context only* (do **not** build it).

## The one fact everything rests on (owner-confirmed, 2026-06-28 — do not re-litigate)

**An agent's working directory is whatever directory it was started in.** The harness re-homes every
Bash command to `project_dir`, and `project_dir` is the launch directory. The reset target is the
**invocation directory — the primary checkout is not special**, it was just the historical launch
point (official Claude Code docs confirm `project_dir` = "Directory where Claude Code was launched";
`statusline-inputs-research.md:93-96`). So the binding `(identity → worktree → branch)` is **DERIVED**:
launch a session rooted in its worktree and its cwd *is* the worktree, for both the Bash tool and the
statusline payload. **Confirm this once, cheaply, at first build (`pwd` + `git rev-parse --show-toplevel`
across 3+ separate Bash calls in a worktree-launched session = the worktree). Do not turn it into an
open empirical investigation — it is settled.**

## Context

The friction cluster: **F-98** (a session can't show its true worktree), **F-87** (sessions start in
primary, manual `cd`), **F-90** (a fresh worktree is unbuilt), **F-91** (the Bash cwd re-homes after
every command). All four dissolve once agents are launched **in their worktree**. The visible symptom
is the statusline; the deeper cost is manual, error-prone worktree management for every agent.

**Scope (owner-decided): the spawn-flow tool, decoupled.** Build the full spawn flow as a standalone
ergonomic tool, **designed substrate-aligned** (invocation-derived binding, derive-not-author, no
primary-special anchor) so it becomes the knowledge-distribution substrate's first proving instance
later — **but with no substrate PDR / host ADR / 5-axis contract gating it.** The substrate stays
recorded-future.

**Intended outcome.** `agent spawn <lane>` from a primary-checkout coordinator creates a built,
draft-PR'd worktree and emits a copy-paste launch command; the launched session's statusline and Bash
tool both operate in its worktree natively; no agent hand-rolls `git worktree add` + build + `cd`.

## The fix is two layers

- **Layer 0 — zero code.** The F-98 statusline symptom is *already* cured by launching in the worktree:
  `agent-tools/src/claude/statusline-identity.ts:16` runs `gatherGitFacts` against the payload cwd, and
  `statusline-identity-input.ts` reads `workspace.current_dir`. A worktree-launched session renders its
  true worktree/branch with **no change**. The work is to codify the convention and confirm it once.
- **Layer 1 — the tool.** The spawn-flow CLI that makes launch-in-worktree ergonomic and complete,
  **sliced by friction** so each increment lands independently.

## The plan

### Phase 1 — `agent spawn` nucleation CLI (the core; friction-sliced, TDD per slice)

Extend `agent-tools/src/bin/claude-agent-ops.ts` (today it only lists/removes — **worktree creation is
absent**, verified first-hand: `core/agent-ops.ts` holds only `detectPhaseFromEvents`/`resolveDiffCwd`/
`isValidAgentId`). Each slice describes a system state; test + code land atomically; use the git DI seam.

- **1A · create worktree + branch + identity** (cures F-87). `git worktree add <path> -b <branch>
  <base>`; fresh PDR-027 identity via `deriveCollaborationIdentity`; loud-fail if branch exists / base
  bad. **Use an injectable git seam for testability** — the `GitRunner = (args, cwd) => string` shape in
  `collaboration-state/coordination-home.ts:6`, NOT `core/runtime.ts:130`'s non-injectable `spawnSync`
  `runGit` — so the creation logic unit-tests against a fake git. **Topology — decision, not a
  recommendation:** spawn **sibling `oak-<slug>`** (the prevailing convention, clean topology outside
  the primary tree) **AND extend the `claude-agent-ops cleanup` command to manage `oak-*` siblings** —
  today `cleanup` only sees `.claude/worktrees/agent-*`, which is exactly why this session had to
  hand-retire 17 cleanup-invisible worktrees through owner permission gates. Bundle the cleanup-coverage
  extension as a slice so spawned worktrees are tool-retirable from birth. **Branch naming:**
  `<type>/<slug>` from the lane (e.g. `feat/<slug>`); the spawn command takes type + slug.
- **1B · build-at-spawn** (cures F-90). Run the worktree's bootstrap/build before returning, so the
  spawned worktree is ready (statusline + tooling work natively).
- **1C · open the draft PR** (worktree-hygiene rule 1). `gh pr create --draft`; loud-fail if it can't
  open. Respects the code-owner gate; no `--admin`.
- **1D · emit the seat + brief.** Seat = `{worktree, branch, role, task, Director}` — the derived
  work-state binding the spawned agent reads; **no claim required**. **The seat is carried IN THE BRIEF
  itself, not a separate registry record** — it is derived from the worktree the agent is launched in
  plus the role text, so there is no new storage surface to build. The brief **invokes
  `/oak-start-right-team`** (references the skill, carries only per-seat specifics) — see Pitfall 5.
- **1E · emit the launch command.** `cd <worktree> && PRACTICE_AGENT_SESSION_ID='<id>' claude` — the
  human pastes it (a deliberate owner-attention seam). Test `cd && claude` vs native `--worktree`;
  standardise one.

### Phase 2 — Reconcile / retire (the binding's share)

- Retire the hand-maintained `cross-worktree-work-state.md` roster → a **derived view** over
  `git worktree list` + the **claims registry** (the seat itself stays derived / carried in the brief
  per 1D — the view *reads* claims, it does not introduce or depend on a stored "seat registry").
- **The F-98 heartbeat-age column** (the locked-scope deliverable that completes the derived view, and
  the binding lane's definition-of-done in the team-tooling session): extend the derived view with a
  `last-seen` column rendering **PDR-078 event-recency** from the comms/heartbeat event stream, labelled
  **input-to-verify** — NOT the claim's `freshness_status` (that is the F-44 decision-class trap). One
  friction-sliced TDD cycle; acceptance: the view shows each live agent's last-seen recency. It is the
  clean slip if Phase 1 overruns.
- **§B2: drop the binary-pin** (see Pitfall 4). Build-at-spawn dissolves it for spawn-created
  worktrees; manual worktrees gracefully soft-fail (existing shim behaviour). Spawn is the *paved* path.
- Shim consolidation (the two `.mjs` → thin bootstraps) is an optional DRY cleanup, **separate** from
  this plan's core.

### Phase 0 — Doc codifications FOLLOW the build (owner-gated; do not front-load)

After the first spawn E2E confirms the worktree-case empirically: (a) codify the launch-in-worktree
convention in the worktree-hygiene rule; (b) record the PDR-118 supersession — mark **OQ2 resolved**
and **clause 3 (assert-one-validated-anchor) superseded by launch-in-worktree**. **This is a PDR
amendment, which OQ2 itself requires (not an in-place edit) and PDR-118 is owner-ratified — so it is
owner-ratification-gated. Do not edit PDR-118 unilaterally; surface the amendment.** docs-adr-expert
reviews both.

## Dissolved — do NOT build (see Pitfall 3)

The assert-one-validated-anchor primitive · the `worktree_anchor` schema field · `projectWorkState()`
anchor-validation · the `anchor → stdin → cwd` resolution chain · the §B2 primary binary-pin. All were
machinery for the primary-launched shape the derived binding removes. The `future/
agent-work-state-registry.plan.md` brief carries the dead assert-primitive framing — **superseded by
this plan; do not promote it.**

## Pitfalls of the originating session (2026-06-28) — avoid these

The owner had to correct each of these. They are the real reason this was handed to a fresh session.

1. **Do not re-inflate this into the substrate build.** The fix is *launch agents in their worktree* —
   small and behavioural. The originating session repeatedly climbed to "we need a substrate + a PDR +
   a host ADR + an assert-primitive" before the owner pulled it down. The elegant substrate framing
   **arrives fluently — fluency is a warning, not a confirmation.** Build the standalone tool,
   friction-sliced. (Memory: `feedback_design_from_the_substrate_not_the_instance` cuts both ways —
   design from impact, and the impact here is modest.) **Trap-leak to know:** the substrate plan's own
   "path" section (`../future/knowledge-distribution-substrate.plan.md`) lists "substrate PDR" as step 1
   *before* the spawn flow — **ignore that ordering.** The owner explicitly decoupled them; this tool
   ships standalone with no substrate-PDR gate.
2. **Do not re-litigate the launch-in-worktree fact** (above). It is owner-confirmed and docs-confirmed.
   The originating session burned a multi-agent workflow "resolving a fork" the owner closed in one
   sentence. Confirm once, cheaply, then build. (Memory: `feedback_run_the_thing_dont_flag_the_gap`.)
3. **Do not build the dissolved machinery** (the "Dissolved" section). The assert-primitive path is
   gone; the old registry brief is superseded.
4. **§B2: do not pin the statusline adapter to the primary** — a *primary-is-special* cowpath the owner
   explicitly rejected ("the primary is not special"). Build-at-spawn + the existing soft-fail.
   (§B2 = the proposed statusline-operability fix to pin the statusline *binary/adapter* to the primary
   checkout root so an unbuilt linked worktree still finds the built adapter — defined at
   `.agent/memory/operational/threads/statusline-enhancements.next-session.md:69`. Build-at-spawn makes
   every spawned worktree built, so the pin is unneeded; manual worktrees soft-fail gracefully.)
   (Memory: `feedback_cowpath_anti_pattern`.)
5. **The spawn brief invokes `/oak-start-right-team`; it does not re-implement it.** Re-authoring the
   skill from first principles is a cowpath (the adversarial review caught this). Carry only per-seat
   specifics.
6. **Render verdicts, not menus.** The originating session twice passed analysis back to the owner
   ("keep or drop — your call") instead of doing the assessment. Read the artefact, decide, present the
   verdict. (Memory: `feedback_no_responsibility_passback`.)
7. **No detached shell loops for heartbeats/monitors.** A `while-true` heartbeat loop survived ~21
   hours (through every `TaskStop`), emitting stale state. Use the Monitor tool / proper mechanisms;
   kill strays by PID. (Rule: `liveness-heartbeat-cron`; the kill-all-watchers command is a forward-ask.)
8. **Tombstone discipline.** No in-place "(superseded)/(corrected)" markers in the design; the lesson
   lives in the commit + memory. (Rule: `no-tombstones-for-removed-ideas`.)
9. **Commit format.** commitlint `body-max-line-length` = 100; wrap commit body lines. (Memory:
   `feedback_commit_format_recurring_friction`.)
10. **Always clean up stale worktrees/branches** on completion (owner standing directive); destructive
    ops (`git branch -D`, `git worktree remove --force`) need an owner permission grant. (Rule:
    `worktree-hygiene`.)
11. **Do not re-derive the identity-injection fork — it was decided (2026-06-28, §4.A).** Spawn does
    NOT pre-determine the launched session's identity. The Claude `SessionStart` hook unconditionally
    derives identity from the harness `session_id` and writes `PRACTICE_AGENT_SESSION_ID_CLAUDE` to
    `$CLAUDE_ENV_FILE`, so a launch-injected seed is overridden (verified by run-the-thing; the
    minted-identity prediction was removed in #284). The alternative — changing the hook to honour an
    existing env value so spawn could pre-determine identity — was **considered and REJECTED**: it is
    a shared PDR-027 identity-contract change (portability + every platform hook), it fights
    derive-don't-author, and no concrete need exists. Do not reopen without one.

## Reuse layer (build on these, cited)

`deriveCollaborationIdentity()` (PDR-027 identity) · `resolveCoordinationHome()` (primary home per
machine) · the claims + comms CLIs (`agent-tools/src/collaboration-state/*`) · `claude-agent-ops.ts`
list/health/preflight + its `cleanup` (only manages `.claude/worktrees/agent-*`). The statusline already
derives the binding from cwd — **no statusline code change is needed for the binding.**

## Verification

- **First build step:** the confirmation smoke-test (`pwd`/`git` ground truth, not the statusline, in a
  worktree-launched session, on the current harness).
- **Per slice:** TDD (`pnpm --filter @oaknational/agent-tools test`); `agent spawn` end-to-end produces a
  built, draft-PR'd worktree + a launch command that starts a session rendering the true worktree.
- **Gates:** `type-expert`, `test-expert`, `config-expert` (if `.claude/`/`.cursor/` touched),
  `pnpm check` (note: root `test:smoke`/`test:experiment` are NOT in the aggregate gate — run them
  explicitly if your change touches them), `markdownlint:root`, `repo-validators:check`. Reviewers real-time every slice (code-expert gateway →
  architecture reviewer for the spawn boundary → assumptions-expert for scope proportionality).

## Homing & how to start (fresh session)

Work in your **own worktree** (dogfood launch-in-worktree; the tool you are building automates this):
`git worktree add ../oak-spawn-flow -b feat/agent-spawn-flow main`, build it, then `cd ../oak-spawn-flow
&& claude`. Read this plan + `../future/knowledge-distribution-substrate.plan.md` (context only) + the
memories named in Pitfalls. First step: the confirmation smoke-test, then Phase 1A. Commit by explicit
pathspec; code-owner merge gate; no `--no-verify`/`--admin`.
