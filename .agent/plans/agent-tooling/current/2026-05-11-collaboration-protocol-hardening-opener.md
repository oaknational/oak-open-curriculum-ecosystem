---
name: "Collaboration Protocol and Tooling Hardening — Session Opener"
overview: "Dedicated session opener for reviewing and hardening the multi-agent collaboration protocols and the agent-tooling CLI surfaces that operationalise them. The MVP arc and beyond are bounded by collaboration-protocol maturity, not by their own plan structure. This session reviews observed friction, audits the protocol against the documented contract, and lands the changes that raise the safe N-agent ceiling."
type: session-opener
status: current
thread: agentic-engineering-enhancements
parent_plan: ".agent/plans/agent-tooling/current/primary-agent-tooling-enhancements.plan.md"
sibling_plans:
  - ".agent/plans/agent-tooling/current/multi-agent-collaboration-protocol.plan.md"
  - ".agent/plans/agent-tooling/current/multi-agent-collaboration-sidebar-and-escalation.plan.md"
  - ".agent/plans/agent-tooling/current/multi-agent-collaboration-protocol-concept-home-refinement.plan.md"
  - ".agent/plans/agent-tooling/current/collaboration-state-write-safety.plan.md"
  - ".agent/plans/agent-tooling/current/multi-checkout-merge-handling-for-fitness-files.plan.md"
last_updated: 2026-05-11
isProject: false
specialist_reviewers:
  - assumptions-expert
  - architecture-expert-betty
  - architecture-expert-wilma
  - code-expert
  - test-expert
  - docs-adr-expert
foundation_alignment:
  - .agent/directives/principles.md
  - .agent/directives/agent-collaboration.md
  - .agent/directives/testing-strategy.md
todos:
  - id: phase-0-ground-state
    content: "Read agent-collaboration directive + every plan in sibling_plans; compile the canonical contract picture (what the protocol promises) versus the observed behaviour (what has actually happened in shared-comms-log + closed-claims + comms-events)."
    status: pending
  - id: phase-1-friction-audit
    content: "Audit every collaboration friction observed in the last 30 days of shared-comms-log + closed-claims (foreign-stage incidents, claim overlaps, comms send failures, fitness-gate-not-staged-set-aware, identity drift). Categorise each by the layer where the remediation must land: protocol contract gap, CLI bug, missing tooling affordance, missing rule, owner-direction-needed."
    status: pending
    depends_on: [phase-0-ground-state]
  - id: phase-2-remediation-design
    content: "For each friction category, design the architecturally-excellent remediation. Where the remediation is implementation, dispatch test-first TDD work via primary-agent-tooling-enhancements Workstreams 2–5 + B-01. Where it is a protocol contract amendment, propose ADR amendment or PDR graduation. Where it is owner-direction-needed, surface to owner before continuing."
    status: pending
    depends_on: [phase-1-friction-audit]
  - id: phase-3-land
    content: "Land the remediations, test-first for code, doctrine-first for protocol amendments. Each remediation is one atomic landing with its own reviewer dispatch and gate evidence."
    status: pending
    depends_on: [phase-2-remediation-design]
  - id: phase-4-validate-at-scale
    content: "Synthetic multi-agent validation across a four-probe matrix that exercises the load shapes where friction actually occurred: (a) file-scope-overlap probe (two agents on overlapping workspace files, format-loop exposure); (b) commit-discipline violation probe (deliberate bare `git commit` against a populated index to verify the foreign-stage cure holds); (c) injected red-gate probe (peer file deliberately RED to verify staged-set-aware behaviour at pre-commit); (d) session-end-mid-flight probe (one agent ends session leaving pre-staged files; next agent's commit window). Success criterion: no foreign-stage incidents, no claim conflicts, no comms render breakage, no identity drift, no fitness-gate-blocks-on-peer-files surprises across the matrix. The earlier 3-agent disjoint-scope dry-run is a smoke-test prelude, not the validation itself."
    status: pending
    depends_on: [phase-3-land]
  - id: phase-5-closeout
    content: "Update friction register; update collaboration-protocol plan statuses; mine doctrine into permanent surfaces (rules, ADRs, PDRs); refresh thread next-session record; consolidation pass."
    status: pending
    depends_on: [phase-4-validate-at-scale]
---

# Collaboration Protocol and Tooling Hardening — Session Opener

**Last updated**: 2026-05-11
**Status**: opener for a dedicated collaboration-protocol session
**Thread**: `agentic-engineering-enhancements`

## Why this session exists

The 2026-05-11 graph MVP arc reshape session surfaced an honest
finding: **the MVP arc's parallelism *ramp* — from 1–2 to 4–5
concurrent agents post-Inc.1 — is bounded by the maturity of the
substrate that operationalises the multi-agent collaboration
protocol.** Cross-slice parallel work, intra-slice 2-agent execution,
and combinatorial-arc activation all depend on that substrate. Slice
1 at N=1–2 agents is **not** blocked by this session and may proceed
in parallel with phases 0–3 here, with the standard rule discipline
(stage-by-explicit-pathspec, commit-by-explicit-pathspec, register
active areas at session open) carried in.

That substrate is **four distinct sub-systems**, conflated in earlier
framing as "the collaboration protocol":

1. **Protocol-contract genuine gaps** — session-close enforcement,
   generated-log discoverability, coordinator-role formalisation (Gaps
   E1, E5, E6 in `/tmp/phase-0-ground-state.md`).
2. **Commit-discipline enforcement** — stage-by-pathspec rule names
   the cure but pathspec-at-commit enforcement is absent; foreign-stage
   absorption is the recurring instance (Gaps E7, E8).
3. **Gate/build-coupling model** — whole-tree pre-commit hooks block
   on peer files; not addressed by claims or comms (Gap E2).
4. **CLI implementation maturity** — `agent-tools` surfaces:
   `collaboration-state`, claims, comms, commit-queue, identity. B-01
   (`comms send --now` does not populate `created_at`), shell-escape
   handling, identity-cache absence (Gap E4, Incidents B6/B7/B10).

Different sub-systems take different remediation shape (rule
amendment, hook enforcement, ADR/PDR graduation, CLI test-first fix).
Phase 2 remediation design names the layer for each friction.

Observed friction at 1–2 concurrent agents already includes:

- **Foreign-stage incidents** — multiple agents staging into the same
  index window, one absorbed under another's commit subject. Recorded
  in `Dawnlit Transiting Galaxy` notes (PDR-054 / ADR-177 territory).
- **Claim overlaps** — `Shaded Rustling Pollen` 2026-05-10 detected
  overlap with `Sylvan Fruiting Glade` on `pending-graduations.md`
  - `CHANGELOG.md`; resolved by revert and comms-event handoff.
- **Fitness-gate orchestrator not staged-set-aware** — multiple agents
  (Lacustrine, Dawnlit) blocked at `pre-commit` on fitness violations
  in peer files outside their staged set.
- **`comms send` CLI bug B-01** — `--now <iso>` does not populate
  `created_at`; CLI fails the validation it should have satisfied.
  Recorded 2026-05-11 in
  [`primary-agent-tooling-enhancements.plan.md § Bugs`](primary-agent-tooling-enhancements.plan.md).
- **Identity drift signals** — name-vs-prefix routing mismatches and
  Codex `agent_name: "Codex"` defaults observed; identity-as-pair
  feedback memory captures the discipline.

Scaling from 1–2 to 4–5 concurrent agents — the post-Inc.1 MVP arc
ramp — multiplies the **subset of incidents that scale super-linearly
with concurrency** (file-scope overlap / format-drift, foreign-stage
absorption on shared index, claim overlap on shared files,
fitness-gate cross-blocking on peer files). The remaining incidents
(CLI bugs, identity wordlist drift, shell-escape handling) are
agent-count-independent and are addressed on their own merits. This
session does both: hardens the super-linear surface so the ramp is
structurally safe, and fixes the agent-count-independent items
because they are bugs.

## Scope

In scope:

- **Protocol contract review** — read every relevant plan + directive
  (`agent-collaboration.md`, ADR-117, ADR-125, ADR-150, ADR-177,
  PDR-046 / PDR-054 / PDR-057 / PDR-058, the collaboration-protocol
  plan family) and compile the canonical contract picture.
- **Friction audit** — surface every observed collaboration friction
  from the last 30 days of shared-comms-log, closed-claims archive,
  comms-events JSON files, and any escalations. Categorise by
  remediation layer.
- **CLI hardening** — Workstreams 2–5 of
  [`primary-agent-tooling-enhancements.plan.md`](primary-agent-tooling-enhancements.plan.md)
  (collaboration read APIs, comms render resilience, commit-queue
  safety, identity/build isolation), plus B-01 and any further bugs
  surfaced by the friction audit.
- **Protocol amendments** — where the remediation is a contract change
  rather than an implementation, propose ADR amendment or PDR
  graduation; route through `architecture-expert-betty` +
  `assumptions-expert` + owner-direction before landing.
- **Validation at scale** — four-probe synthetic-multi-agent matrix
  exercising the load shapes where friction actually occurred:
  (a) file-scope-overlap, (b) commit-discipline violation,
  (c) injected red-gate, (d) session-end-mid-flight. A 3-agent
  disjoint-scope dry-run is a smoke-test prelude; the matrix is the
  validation gate. See Phase 4 in the workflow.

Out of scope:

- **MVP arc post-Inc.1 ramp.** This session must complete before the
  MVP arc ramps from 1–2 to 4–5 concurrent agents. Slice 1 at N=1–2
  agents is **not blocked** and may proceed in parallel with phases
  0–3 here. The session blocks the *ramp*, not the *start*.
- **Combinatorial arc.** Not in this session's scope.
- **Practice Core graduations.** Doctrine-level PDR work outside the
  observed collaboration-friction surface is not in this session.
- **New skill or sub-agent authoring** unrelated to collaboration
  hardening.
- **Non-collaboration agent-tooling work** (e.g. `agent-identity`,
  `tdd-pair-helper`, other agent-tools CLIs not touching collaboration
  state) — those follow their own plans.

## Foundation reading

Before doing anything substantive:

1. [`AGENT.md`](../../../directives/AGENT.md) — operational entry point.
2. [`principles.md`](../../../directives/principles.md) — TDD as
   design, fail loud, strict + complete, no warning toleration,
   architectural excellence over expediency.
3. [`agent-collaboration.md`](../../../directives/agent-collaboration.md)
   — collaboration practice, five communication channels, identity vs
   liveness, bootstrap fast-path.
4. [`testing-strategy.md`](../../../directives/testing-strategy.md) —
   the test-and-product-code-land-together invariant that applies to
   every implementation remediation in this session.
5. [`multi-agent-collaboration-protocol.plan.md`](multi-agent-collaboration-protocol.plan.md)
   — current canonical protocol plan.
6. ADR-150 (collaboration state primitives), ADR-177 (commit-queue),
   PDR-054 (foreign-stage doctrine), and any newer related ADRs/PDRs.

## Success criteria

1. **Friction audit complete** — every observed friction in the
   30-day window is categorised and either has a designed remediation
   landed in this session, a designed remediation queued with a named
   plan/next-step, or an explicit owner-direction-needed flag.
2. **B-01 fixed test-first** — failing test + product-code fix land
   in one atomic commit; bug table updated to fixed with the SHA.
3. **Workstreams 2–5 landed** (or explicitly partially landed with
   the remaining workstreams queued).
4. **Four-probe validation matrix passes** — file-scope-overlap,
   commit-discipline violation, injected red-gate, and
   session-end-mid-flight probes each complete without foreign-stage,
   claim conflict, comms render breakage, identity drift, or
   fitness-gate-blocks-on-peer-files surprise. The 3-agent
   disjoint-scope dry-run is a smoke-test prelude, run first.
5. **No regression in fitness gates** — informational fitness shows
   no new critical or hard violations attributable to this session's
   changes.
6. **Doctrine mining complete** — recurring patterns from the
   friction audit graduate to rules, ADRs, or PDRs as appropriate;
   the friction register reflects the session's outcomes.

## Discipline carried into this session

- **Architectural excellence is absolute.** We only ever choose
  long-term architectural excellence; we never compromise for the sake
  of expediency. Applies upstream of any option presentation: an
  "almost-right" remediation whose only justification is speed is
  excluded from consideration. See
  [`principles.md` § Architectural Excellence Over Expediency](../../../directives/principles.md),
  [`start-right-quick`](../../../skills/start-right-quick/SKILL-CANONICAL.md),
  and ADR-172.
- **Test-first for every CLI / helper fix.** No audit-shaped tests.
  See B-01 entry in the parent plan.
- **No --no-verify.** Per
  [`no-verify-requires-fresh-authorisation`](../../../rules/no-verify-requires-fresh-authorisation.md);
  fresh owner authorisation per commit, only on completed
  understanding never accumulated friction.
- **Stage by explicit pathspec.** Per
  [`stage-by-explicit-pathspec`](../../../rules/stage-by-explicit-pathspec.md);
  no `git add -A` or `git add .`.
- **No speed pressure.** Per
  [`no-speed-pressure`](../../../rules/no-speed-pressure.md). This
  session is doctrine-shaped work; the urge to skip the substrate is
  the diagnostic.
- **Architectural-excellence shapes only.** Per
  [`principles.md`](../../../directives/principles.md). Remediations
  surfaced for design or owner direction must be
  architecturally-excellent options; expediency shapes are excluded
  from consideration upstream of any option presentation.

## Specialist reviewer dispatch

| Reviewer | When | Purpose |
|---|---|---|
| `assumptions-expert` | Phase 1 + Phase 2 + each remediation | Validate the protocol-vs-observed framing; validate proposed remediations against the directive contract |
| `architecture-expert-betty` | Phase 2 (remediation design) + Phase 4 (dry-run) | Cohesion/coupling of protocol surfaces; long-term change-cost of remediations |
| `architecture-expert-wilma` | Phase 4 (four-probe matrix) | Adversarial probing across the four load shapes where friction occurred: overlap, commit-discipline, red-gate, session-end-mid-flight |
| `code-expert` | Every implementation commit | Gateway; routes type-expert / security-expert as warranted |
| `test-expert` | Every implementation commit | TDD pair audit; no audit-shaped tests; no skipped tests |
| `docs-adr-expert` | Phase 5 closeout | Permanent-doc updates; ADR / PDR amendments coherent |

## Cross-references

- [`primary-agent-tooling-enhancements.plan.md`](primary-agent-tooling-enhancements.plan.md) —
  parent plan; carries Workstreams 2–5 and the B-01 bug entry.
- [`multi-agent-collaboration-protocol.plan.md`](multi-agent-collaboration-protocol.plan.md) —
  current canonical protocol plan.
- [`../../graph-mvp-arc.plan.md`](../../graph-mvp-arc.plan.md) §
  Team-of-Agents Execution — the demand-side justification for this
  session; MVP arc parallelism is bounded by this session's outcome.
- [`../../connecting-oak-resources/knowledge-graph-integration/current/2026-05-11-graph-execution-prep-opener.md`](../../connecting-oak-resources/knowledge-graph-integration/current/2026-05-11-graph-execution-prep-opener.md) —
  graph side of the same arc; step 4 routes here.
- [`../../../state/collaboration/shared-comms-log.md`](../../../state/collaboration/shared-comms-log.md) —
  primary friction-evidence source.
- [`../../../state/collaboration/closed-claims.archive.json`](../../../state/collaboration/closed-claims.archive.json) —
  secondary friction-evidence source.
