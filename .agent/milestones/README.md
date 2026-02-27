# Milestones

Milestones are strategic delivery gates.
Each milestone has a summary explaining why it matters, who it is for,
and what must be true to exit.

Execution detail belongs in plan documents under `.agent/plans/`.
Strategic context: [high-level-plan.md](../plans/high-level-plan.md).

---

## Milestone Sequence

| Milestone | Name | Summary |
|---|---|---|
| M0 | [Open private alpha](m0-open-private-alpha.md) | Make the repo public so external teams can start building |
| M1 | [Open public alpha](m1-open-public-alpha.md) | Let teachers use AI tools to access curriculum directly |
| M2 | [Post-alpha enhancements](m2-post-alpha-enhancements.md) | Richer interactions, more tools can connect |
| M3 | [Public beta](m3-public-beta.md) | Production-grade reliability for daily teacher use |

Current state: **closed private alpha** (repo private, HTTP server private
alpha).

---

## State Progression

| State | Repo | HTTP Server | Key requirement |
|---|---|---|---|
| Closed private alpha | Private | Private alpha | Current state |
| Open private alpha (M0) | **Public** | Private alpha | Docs remediation |
| Open public alpha (M1) | Public | **Public alpha** | Clerk, Sentry, rate limiting |
| Post-alpha (M2) | Public | Public alpha | MCP extensions, enforcement |
| Public beta (M3) | Public | **Public beta** | Mutation testing, observability |

---

## Per-Milestone File Convention

Each milestone file follows a consistent GDS-style structure:

1. **Why this milestone matters** — one paragraph, plain English
2. **Who it is for** — the primary audience
3. **What value it delivers** — concrete outcomes
4. **Progression gates** — what must be true to exit
5. **Current status** — where things stand

These files are designed to be readable by anyone — technical or
non-technical. They are not execution plans; they explain intent and value.

---

## Release Plans

Milestone release plans are a dedicated plan type for the final stretch
of a milestone. They are not feature-delivery plans.

Their purpose is to:

1. run release-critical checks,
2. drive snagging and closure of release blockers,
3. coordinate go/no-go decisions,
4. execute release safely with rollback readiness.

### Naming Convention

Use: `.agent/plans/release-plan-m{n}.plan.md`

### Active Release Plans

- Milestone 1: [release-plan-m1.plan.md](../plans/release-plan-m1.plan.md)
