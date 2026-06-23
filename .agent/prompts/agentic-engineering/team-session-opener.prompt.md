# Team Session Opener — Generalised Template

> When working with other agents, all responses, work, claims and sources
> must be critically assessed before being accepted.

**Type**: template (generalised 2026-06-11 from the graph-implementation-team opener, the first
worked instance of this shape). To instantiate: copy this file's structure into a
`<team>-<date>.prompt.md` instance, fill every `<placeholder>`, delete sections that do not
apply, and keep the blockquote above verbatim.

**Plan authority**: `<the controlling plan(s), one per lane — plans are authoritative for scope,
sequencing, acceptance, and validation>`

## Entry ritual (every seat, before any other move)

1. Run [`start-right-team`](../../skills/start-right-team/SKILL-CANONICAL.md) (Director seat) or
   [`start-right-quick`](../../skills/start-right-quick/shared/start-right.md) (implementer
   seats), end to end — First Moves order is non-negotiable (watcher, heartbeat, team-start
   broadcast, coordination, claims).
2. **Single-identity check.** Run the PDR-027 identity preflight and confirm your identity
   renders exactly ONE name on every surface (hook injection, CLI derivation, claims registry,
   comms events, owner-facing roster). Carry the full tuple — name, platform, model,
   session-id prefix, AND UUID — on every event you emit. If any surface renders a second name
   for your seed, that is a P1 coordination defect: report it in your team-start broadcast and
   open no claim until the Director rules on the canonical tuple. One agent, one identity.
3. Register your identity row on the lane's thread record and read this brief end to end.
4. **Handoff pickup contract.** A seat continuing another session's lane reads that lane's
   latest handoff record under `.agent/state/collaboration/handoffs/` end to end BEFORE any
   source edit (PDR-063). Mid-cycle retirements leave the record pointer on the claim's
   `handoff_record_path`; natural-boundary closeouts leave no claim, so the record is reached
   from this brief, the Director's pickup routing, and the thread record. Re-verify the
   record's pinned facts first-hand at pickup (branch, HEAD, push state, gate state) — the
   record is a pointer and hypothesis, not the source of volatile truth.

## Team shape

One **Director** (`<model>`) + `<N>` **implementers** (`<models>`), each session in its **own
git worktree**. The Director is an opt-in coordinator per
[`agent-collaboration.md` §Coordinator Role](../../directives/agent-collaboration.md): bounded
authority (dispatch, pause-with-deadline, merge sequencing), a commitment to coordinate among
reasoning peers — not a veto-holder. Per owner doctrine the Director does **pure direction
only**: no implementer-level work, no fact-finding; context is reserved for holistic team
awareness. Sub-agent launches are implementer-class work and are routed to a team member.

## Worktrees and the coordination home (critical convention)

Per-session worktrees structurally dissolve the recorded shared-tree failure modes: index/HEAD
races and foreign-lock collisions, full-tree pre-commit gate coupling across agents, within-one-
file sweep risk, and HEAD moving under an in-flight session.

Coordination state is repo-file-based, so N worktrees would mean N diverging copies of
`.agent/state/`. Exactly ONE checkout — the Director's — is the coordination home. The
collaboration CLIs are fully path-parameterised (`--comms-dir`, `--active`, `--repo-root`), so
implementers point every comms/claims invocation at the coordination home by absolute path
(resolve it at session open; never write a machine-local path into a versioned file).
Consequences, by construction:

- Implementer PRs are **pure diffs** — no collaboration-registry or continuity files ever ride
  a feature branch.
- The Director owns ALL `.agent/state`, `.agent/memory`, and continuity writes, and lands them
  from the coordination home as `docs(continuity)` commits.

### Worktree setup (operator or Director, once per seat)

From the primary checkout, on a current `main`, every implementer creates a worktree — or, when
continuing a seat after a session rotation, adopts the seat's existing worktree in the state the
handoff record describes (never re-create over a worktree holding recorded state):

```bash
git worktree add <worktrees-root>/wt-<seat> -b feat/<first-deliverable> origin/main
# per worktree, once (required for gates):
cd <worktrees-root>/wt-<seat> && pnpm install && pnpm build
```

Branches rotate inside a worktree per deliverable (one small PR per deliverable, always based on
`origin/main` — flat, never stacked). After a seat's PR merges, the seat pulls `main` and cuts
the next branch.

## Branching strategy (three classes, three lifecycles)

- **Implementer feature branches**: one per deliverable, cut from current `origin/main` in the
  seat's worktree, landed as one small pure-diff PR, deleted at merge.
- **The coordination home**: ONE long-lived `coordination/<team>-<date>` branch on the primary
  checkout, Director-owned, sole writer; pushed at waypoints; never PR'd mid-arc, never
  rebased; PR'd and merged at arc end after a divergence analysis against `origin/main`. The
  `coordination/` prefix names the branch class so tooling and reviewers can distinguish
  coordination-state branches from feature and docs work (owner-adopted 2026-06-12).
- **Coordination home ⇇ main merges**: Director merges `origin/main` INTO the coordination home
  (forward-only, merge commit, never rebase) when Director tooling needs landed source or
  generated-file drift accumulates. Divergence analysis first; main-authoritative for source,
  branch-authoritative for coordination state; drift baselines are always `origin/main`.

## Seat briefs

| Seat | Lane | Owned surfaces | Must not touch |
| --- | --- | --- | --- |
| Director | Dispatch; comms + PR + CI monitoring; merge sequencing; reviewer-dispatch routing; state/continuity/memory writes | `.agent/state/`, `.agent/memory/`, prompt/plan status lines | Product code and tests |
| `<seat>` | `<deliverables in order>` | `<owned files/surfaces>` | `<exclusions + sequencing gates>` |

Name every **hard sequencing gate** (surface overlaps between seats) explicitly: the dependent
deliverable starts only after the blocking PR is MERGED. Every deliverable executes its cycles
per the controlling plan's proof contract and re-verifies the plan's pinned data facts against
the tree at execution start.

## Coordination cadence

- **Heartbeats**: the canonical contract is the
  [`liveness-heartbeat-cron`](../../rules/liveness-heartbeat-cron.md) rule (≤4-minute cadence,
  10-minute retirement threshold). The owner may ratify a looser cadence for a specific team in
  the instance brief; absent that, the rule's cadence applies.
- **Asks**: bounded-deadline + default-action format on directed comms events; post, watch for
  the reply, act on the default if silent. Route through the lowest-authority resolver; the
  Director escalates to the owner only for owner-owned decisions.
- **Director monitoring**: persistent watchers on the comms stream and every open PR (checks
  AND review comments AND merge state). When rewriting any watcher, diff the EXIT CONDITIONS
  old-vs-new. Every loop carries an explicit exit criterion.
- **Reviews**: every bot/reviewer comment is adjudicated first-hand (refute with source
  grounding or apply — never relay, never dismiss); replies on the PR record the verdicts.
- **Merges**: Director-serialised. Gate state and reviewer-comment state are independent
  evidence loops — both settle before merge.
- **Retirement**: mid-cycle retirement follows PDR-063 (freeze record → claim pointer →
  directed `mid-cycle-handoff` event → heartbeat-end + retirement broadcast). Successors follow
  the pickup contract in the entry ritual.
- **Closeout**: the Director is the team closeout owner; implementers leave boundary-scoped
  closeout notes and close their own claims. **At every Director closeout the Director runs
  the FULL `session-handoff` workflow AND `consolidate-docs` (owner-standing, 2026-06-12),
  and runs them BEFORE merging the final coordination-branch PR** so the handoff and
  consolidation writes ride that PR instead of forcing a further one. The Director session
  is not closed until the final coordination PR is merged.

## Known costs and cautions

- Per-worktree `pnpm install && pnpm build` is real minutes, paid once per seat.
- The innate-immunity hook fires per-session in every worktree; false positives are a design
  property — read the reappraisal, don't reword around the wall.
- `<instance-specific cautions: gitignored data symlinks, generator-task mappings, live snags>`
