# Graph Implementation Team — Session Opener

> When working with other agents, all responses, work, claims and sources
> must be critically assessed before being accepted.

**Type**: handover (team session entry point; owner-ratified shape 2026-06-10)
**Plan authority**:
[`graph-tools-value-redesign.plan.md`](../../plans/connecting-oak-resources/knowledge-graph-integration/current/graph-tools-value-redesign.plan.md)
(🟢 DECISION-COMPLETE; frontmatter todos + §Cycles and proof contract are the execution
authority). Evidence:
[`graph-tools-readiness-seam-analysis-2026-06-09.md`](../../reports/graph-tools-readiness-seam-analysis-2026-06-09.md).
**Entry ritual**: every seat runs
[`start-right-team`](../../skills/start-right-team/SKILL-CANONICAL.md) (Director) or
[`start-right-quick`](../../skills/start-right-quick/shared/start-right.md) (implementers),
registers its PDR-027 identity on the `eef` thread, and reads this brief end to end. A seat
continuing another session's lane ALSO reads its seat's latest handoff record under
`.agent/state/collaboration/handoffs/` end to end before any source edit — natural-boundary
closeouts leave no claim carrying `handoff_record_path`, so the record is reached from here, the
Director's pickup brief, and the thread record, not from the claims registry.

## Team shape (owner-ratified)

One **Director** (Fable 5) + two **Opus 4.8 implementers**, each session in its **own git
worktree**. A third implementer seat is optional and only fills if the owner wants the keywords
lane (U1 grounding + G4 Gate-1 parity determination) moving in parallel. The Director is an
opt-in coordinator per
[`agent-collaboration.md` §Coordinator Role](../../directives/agent-collaboration.md): bounded
authority (dispatch, pause-with-deadline, merge sequencing), a commitment to coordinate among
reasoning peers — not a veto-holder. Per owner doctrine the Director does **pure direction
only**: no implementer-level work, no fact-finding; context is reserved for holistic team
awareness.

## Why worktrees (and the one critical convention)

Per-session worktrees structurally dissolve the recorded shared-tree failure modes: index/HEAD
races and foreign-lock collisions (each worktree has its own index + HEAD), full-tree pre-commit
gate coupling across agents (each tree gates only its own state — the `pnpm check` singleton
rule applies per worktree, not across the team), within-one-file sweep risk, and HEAD moving
under an in-flight session.

**The coordination-home convention (critical).** Coordination state is repo-file-based, so three
worktrees would mean three diverging copies of `.agent/state/`. Exactly ONE checkout — the
Director's — is the coordination home. The collaboration CLIs are fully path-parameterised
(`--comms-dir`, `--active`, `--repo-root`), so implementers point every comms/claims invocation
at the Director's checkout by absolute path (resolve it at session open; never write a
machine-local path into a versioned file). Consequences, by construction:

- Implementer PRs are **pure diffs** — no collaboration-registry or continuity files ever ride a
  feature branch (this trials the `pending-graduations` candidate "commit-ceremony registry
  state should not ride feature-PR diffs"; the cross-PR registry conflicts of 2026-06-10 are the
  motivating instance).
- The Director owns ALL `.agent/state`, `.agent/memory`, and continuity writes, and lands them
  from the coordination home as `docs(continuity)` commits.

## Worktree setup (operator or Director, once per seat)

From the initial primary checkout, on a current `main`, every agent creates a new worktree for
itself — or, when continuing a seat after a session rotation, adopts the seat's existing worktree
in the state the handoff record describes (pull `main`, cut the next branch; never re-create over
a worktree holding recorded state).

Director worktrees should be clearly identified as such.

Guidance:

```bash
git worktree add <worktrees-root>/wt-seat-a -b feat/<first-deliverable-a> origin/main
git worktree add <worktrees-root>/wt-seat-b -b feat/<first-deliverable-b> origin/main
# per worktree, once (required for gates):
cd <worktrees-root>/wt-seat-a && pnpm install && pnpm build
```

If a deliverable runs vocab-gen: `apps/oak-search-cli/bulk-downloads` is gitignored and
machine-local — symlink the data files from the primary checkout into the worktree's
skeleton dir (git-invisible; proven in the PR-180 cycle). Know the generator-task mapping
before assuming a regen ran: `data.json` is written by vocab-gen, and a FULL-TURBO replay
on sdk-codegen can mask that vocab-gen never re-emitted.

Each seat opens its Claude Code session in its own worktree directory. Branches rotate inside a
worktree per deliverable (one small PR per deliverable, always based on `origin/main` — flat,
never stacked). After a seat's PR merges, the seat pulls `main` and cuts the next branch.

## Branching strategy (owner-ratified 2026-06-11; resolves Q-008)

Three branch classes, three lifecycles:

- **Implementer feature branches**: one per deliverable, cut from current `origin/main` in the
  seat's worktree, landed as one small pure-diff PR, deleted at merge. Never stacked; never carry
  coordination state.
- **The coordination home**: ONE long-lived `docs/<team>-<date>` branch on the primary checkout,
  Director-owned, sole writer. It accumulates coordination state and continuity as
  `docs(continuity)` commits and is pushed at waypoints — it is never PR'd mid-arc and never
  rebased.
- **Coordination home ⇇ main merges**: the Director merges `origin/main` INTO the coordination
  home (forward-only, merge commit, never rebase) whenever (a) the Director seat's tooling needs
  source that has landed on main (e.g. an `agent-tools` rebuild), or (b) generated-file drift
  against `origin/main` accumulates — the branch-lag class that once produced a false
  schema-bump diagnosis. Run a divergence analysis first; resolve conflicts main-authoritative
  for source and generated files, branch-authoritative for coordination state. Drift baselines
  are always `origin/main`, never branch HEAD.

## Seat briefs

| Seat | Lane | Owned surfaces | Must not touch |
| --- | --- | --- | --- |
| Director (Fable 5) | Dispatch; comms + PR + CI monitoring; merge sequencing; reviewer dispatches (per `invoke-code-experts`); S3-c0 owner design gate; all state/continuity/memory writes | `.agent/state/`, `.agent/memory/`, prompts/plans status lines | Product code and tests (pure direction only) |
| Implementer A (Opus) | **S1 → S2 → U1**, three small PRs in plan order | S1: `documentation-resources.ts`, `all-resources.ts`, drift-guard test. S2: `mcp-prompts.ts`, `mcp-prompt-messages.ts` (+ owner sign-off on renames at the PR). U1: new doc in the upstream-feature-requests lane | `.agent/state/`, `.agent/memory/`; anything in Seat B's owned surfaces |
| Implementer B (Opus) | **G1a → G1b** (split-permitted into two PRs at size) | G1a: `oak-sdk-codegen` vocab-gen emission + `./graph-corpus` subpath + ADR-086 amendment; `graph-corpus-sdk` curriculum adapter. G1b: `aggregated-prior-knowledge-graph.ts`, its resource removal, prompt-clause rewrites | `.agent/state/`, `.agent/memory/`; S1/S2 files until the G1b gate below clears |
| Implementer C (optional, Opus) | U1 upstream grounding + G4 Gate-1 parity determination (read-only analysis; the recorded verdict lands via the Director) | Analysis only | Everything else |

**Hard sequencing gate**: G1b's surface edits overlap S1 (`all-resources.ts`) and S2
(`mcp-prompt-messages.ts`). **G1b starts only after S1 and S2 are merged.** G1a is disjoint from
everything and starts immediately. If Seat C is unfilled, Seat A absorbs U1.

Every deliverable executes its cycles exactly per the plan's §Cycles and proof contract
(describing surfaces, atomic test+code landings, full gate chain green at every commit), and
**re-verifies the plan's pinned data facts against the tree at execution start** (bulk manifest
date, corpus counts, the five dangling endpoints).

## Coordination cadence

- **Heartbeats**: implementers post a comms heartbeat (the CLI's `--tag heartbeat` mode) at
  every cycle boundary or ~45 minutes, whichever first.
- **Asks**: bounded-deadline + default-action format on directed comms events; post, poll
  briefly, act on the default if silent (route through the lowest-authority resolver — the
  Director escalates to the owner only for owner-owned decisions).
- **Director monitoring**: background watchers on every open PR (checks AND review comments AND
  merge state) plus a comms poll loop. When rewriting any watcher, diff the EXIT CONDITIONS
  old-vs-new — a 2026-06-10 rewrite silently dropped comment detection. Every loop carries an
  explicit exit criterion.
- **Reviews**: every bot/reviewer comment is adjudicated first-hand (refute with source
  grounding or apply — never relay, never dismiss); replies on the PR record the verdicts.
- **Merges**: Director-serialised, so semantic-release cuts clean and rebase points stay
  deterministic. Gate state and reviewer-comment state are independent evidence loops — both
  settle before merge.
- **Closeout**: the Director is the team closeout owner (`session-handoff` §Team Closeout
  Owner); implementers leave boundary-scoped closeout notes and close their own claims.

## Known costs and cautions

- Per-worktree `pnpm install && pnpm build` is real minutes, paid once per seat.
- Subagent `isolation: "worktree"` (within any seat's own fan-outs) carries no known live issue
  (owner 2026-06-10; an earlier base-drift caution was retired as stale).
- The innate-immunity hook fires per-session in every worktree; false positives are a design
  property — read the reappraisal, don't reword around the wall.
