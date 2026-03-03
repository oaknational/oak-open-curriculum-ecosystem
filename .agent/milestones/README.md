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
| M0 | [Open private alpha](m0-open-private-alpha.md) | ✅ Make the repo public so external teams can start building |
| M1 | [Invite-only alpha](m1-invite-only-alpha.md) | 🔄 Oak staff and invited users access MCP server via dev Clerk allowlist |
| M2 | [Open public alpha](m2-extension-surfaces.md) | Production Clerk, social providers, public sign-up |
| M3 | [Public beta](m3-tech-debt-and-hardening.md) | Operational hardening, extension surfaces, observability, tech debt |

Current state: **invite-only alpha** (M1 active — repo public,
server live at `curriculum-mcp-alpha.oaknational.dev`, access via
Oak emails + explicit Clerk invitations).

---

## State Progression

| State | Repo | HTTP Server | Auth | Key requirement |
|---|---|---|---|---|
| Closed private alpha | Private | Private alpha | Test Clerk | — |
| Open private alpha (M0) | **Public** | Private alpha | Test Clerk | ✅ Complete |
| Invite-only alpha (M1) | Public | **Invite-only alpha** | Dev Clerk + allowlist | 🔄 Active |
| Open public alpha (M2) | Public | **Open public alpha** | **Prod Clerk** | Clerk prod migration |
| Public beta (M3) | Public | **Public beta** | Prod Clerk | Operational hardening |

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

### Release Plans

- Milestone 1: [release-plan-m1.plan.md](../plans/archive/completed/release-plan-m1.plan.md) (archived)
- No active release plan at present.

Release control model, snagging protocol, and go/no-go templates:
[docs/engineering/milestone-release-runbook.md](../../docs/engineering/milestone-release-runbook.md).
