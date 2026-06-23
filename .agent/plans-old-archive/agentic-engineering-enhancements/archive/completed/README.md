# Agentic-Engineering-Enhancements — Completed-Archive Supersession Mappings

This README records supersession mappings for plans archived from
`.agent/plans/agentic-engineering-enhancements/current/` to
`.agent/plans/agentic-engineering-enhancements/archive/completed/`.

Per the
[`consolidate-docs` plan-supersession discipline](../../../skills/consolidate-docs/SKILL-CANONICAL.md#plan-supersession-discipline):
the same change set that performs a supersession MUST also land a
supersession mapping. The mapping records, for every dropped scope
item: the item moved, the new owner plan, the acceptance lane, and the
rationale for the move.

## 2026-05-25 — Multi-agent hardening arc closeout

The 2026-05-20 → 2026-05-25 practice-infrastructure hardening arc
landed substantial permanent doctrine (PDR-076a/b/077/078/079,
ADR-185/186/187, 22 rule amendments, 8 directive updates). Two
operational plans served as the execution wrappers for that arc and
are archived here once their workstreams either landed or re-homed.

### `post-m1-attestation-tidy-up.plan.md`

**Origin**: linear 17-cycle execution sequence closing the M1
attestation carry-forward items.

**Status at archive**: all cycles landed or reconciled. Cycles 10 + 11
(comms-watch storage redesign WS2 + WS3) superseded to a dedicated
new plan; Cycle 15 (branch fitness drain) removed as misunderstanding
per owner direction.

Supersession mappings:

| Item moved | New owner plan | Acceptance lane | Rationale |
|---|---|---|---|
| `cycle-10-comms-watch-ws2` (storage redesign) | `agent-tooling/current/comms-watch-storage-redesign.plan.md` | `ws2-storage-redesign` | The comms-watch trilogy (WS1 / WS2 / WS3) is collaboration-infrastructure work whose canonical home per the agentic-engineering-enhancements/README.md cross-collection boundary is the agent-tooling collection. A focused executable plan is the right shape; the tidy plan was an execution wrapper, not a permanent home. |
| `cycle-11-comms-watch-ws3` (cleanup + doc updates) | `agent-tooling/current/comms-watch-storage-redesign.plan.md` | `ws3-cleanup` | Same as above; WS3 depends on WS2 and follows naturally in the same focused plan. |
| `cycle-15-branch-fitness-drain` | (removed; no new owner) | (n/a) | Owner-directed 2026-05-25: this cycle was a misunderstanding. The work it framed (markdownlint sweep + napkin rotation + pending-graduations drain) is not a single-cycle shape; it is ongoing curator/consolidation discipline absorbed by the `consolidate-docs` SKILL and the per-write-rule learning-preservation doctrine (PDR-046). No follow-on plan needed. |

### `practice-infrastructure-hardening-program.plan.md`

**Origin**: owner-initiated roll-up plan tracking the 2026-05-23 PM
team's practice-infrastructure hardening work. Source of truth for
vision, workstream roll-up, safe-pause criteria, and completion
criteria.

**Status at archive**: M1 (Safe Pause) ACHIEVED 2026-05-24T20:09:10Z
via Director attestation broadcast `2849b623`. M2 (Completion)
ACHIEVED 2026-05-25 — all M2-criteria workstreams landed via the
post-m1-attestation-tidy-up.plan.md cycles; status reconciliation in
commit `4e333441`. Two workstreams superseded out rather than landed:

| Item moved | New owner plan | Acceptance lane | Rationale |
|---|---|---|---|
| `ws-10-heartbeat-cron-mechanism` | (deferred — no immediate new owner) | (n/a) | The doctrine layer (PDR-078 + ADR-186) is landed; the operational mechanism (schema field + CLI wrapper + claim auto-rebalance protocol substrate) remains unbuilt. Interim mechanism (`narrative` comms-event with `tags: ['heartbeat']`) is workable. Deferred-honesty: no immediate executable plan re-home; substance captured here for a future agent to pick up under explicit owner direction or as a follow-on to `comms-watch-storage-redesign.plan.md` (the two are agent-tools-CLI sibling concerns). Constraint: owner pivoted to graph work mid-consolidation (2026-05-25). Falsifiability: a future agent reading the heartbeat doctrine PDR-078 + ADR-186 plus the interim mechanism note can implement the durable mechanism without needing additional context beyond what those documents already carry. |
| `§P5.W1 — Comms-watch seen-state redesign` (program-level strategic substance) | `agent-tooling/current/comms-watch-storage-redesign.plan.md` | `ws2-storage-redesign` + `ws3-cleanup` | The four-dimension problem statement and three-workstream cure structure are preserved verbatim in the new plan's Problem section. WS1 landed at `75e47923`; WS2 + WS3 await execution in the new plan. |

All other workstreams (WS-1 through WS-12 except WS-10) landed
substantively during the arc; see the archived plan body for per-WS
SHA evidence. M1 + M2 milestone gates flipped to `completed` at
status reconciliation.

## How to add a new supersession mapping

When archiving a plan from
`.agent/plans/agentic-engineering-enhancements/current/`:

1. Add a section under this README dated to today.
2. Name the plan being archived + its origin / status at archive.
3. For each item with a new owner: name the item id (frontmatter
   `id:` or section heading), the new owner plan path, the acceptance
   lane in the new owner, and a one-sentence rationale.
4. For each item with NO new owner (deferred or removed): name the
   item id, write `(removed)` or `(deferred — no immediate new owner)`
   in the new-owner column, and provide deferral-honesty in the
   rationale (named constraint + evidence + falsifiability per
   PDR-026).
5. Land the README update + the `git mv` + any back-pointer updates
   in the receiving plans in a single commit.
