# Milestones

Milestones are strategic delivery gates.
Execution detail belongs in plan documents under `.agent/plans/`.

## Milestone Sequence

1. Milestone 0: Make the repository public on GitHub.
2. Milestone 1: Move MCP services into public alpha safely.
3. Milestone 2: Post-alpha hardening and capability expansion.
4. Milestone 3: Public beta readiness and reliability gates.

## Milestone Release Plans (New Plan Type)

Milestone release plans are a dedicated plan type for the final stretch of a
milestone. They are not feature-delivery plans.

Their purpose is to:

1. run release-critical checks,
2. drive snagging and closure of release blockers,
3. coordinate go/no-go decisions,
4. execute release safely with rollback readiness.

Release plans should focus on getting work across the line safely, not opening
new streams of scope.

## Naming Convention

Use:

- `.agent/plans/release-plan-m{n}.plan.md`

Examples:

- `release-plan-m1.plan.md` for Milestone 1 public-alpha release execution.

## Standard Release-Plan Structure

Every milestone release plan should include:

1. release objective and scope boundary,
2. mandatory gate checks and evidence requirements,
3. snagging protocol with severity, ownership, and closure criteria,
4. go/no-go decision gate and decision log,
5. rollout sequence, verification window, and rollback protocol.

## Active Milestone Release Plans

- Milestone 1: [release-plan-m1.plan.md](../plans/release-plan-m1.plan.md)
