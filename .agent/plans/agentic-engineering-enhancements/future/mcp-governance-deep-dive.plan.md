# MCP Governance Deep Dive

**Status**: PLANNED (future)
**Domain**: Agentic Engineering Enhancements
**Created**: 2026-04-20

## Promotion Trigger

Promote to `current/` when **any** of these conditions is met:

1. MCP server upgrade to `2025-11-25` SDK revision enters the planning
   surface (the revision changes the substrate the MCP server stands on)
2. A second MCP governance signal surfaces that requires architectural
   response (the first is already documented in the analysis baseline)
3. MCP `tasks` utility or durable-execution interop becomes relevant to
   a concrete MCP server feature request

## Problem and Intent

MCP `2025-11-25` is the highest-signal substrate change for this
repository's MCP server. The revision formalises governance (working
groups, interest groups, SDK tiering), adds experimental `tasks`
utility for durable execution, aligns OAuth with RFC 9728, and adopts
JSON Schema 2020-12 as the default schema dialect. These changes
collectively affect the MCP server's identity perimeter, protocol
compliance surface, and future capability envelope.

This plan scopes a dedicated deep dive to absorb the governance,
identity, and capability signals from MCP `2025-11-25` into the
repo's planning and doctrine surfaces — without premature adoption.

## Scope (When Promoted)

1. **MCP governance model mapping** — map MCP's formalised working
   groups, interest groups, and SDK tiering to the repo's own
   governance surfaces (ADR-119, Practice Core, reviewer routing)
2. **OAuth/RFC 9728 alignment audit** — verify the MCP server's
   Protected Resource Metadata endpoint against RFC 9728; coordinate
   with the RFC 9728 PRM audit scoped in
   [`reviewer-gateway-upgrade.plan.md`](../current/reviewer-gateway-upgrade.plan.md)
3. **Durable-task applicability assessment** — determine whether the
   experimental `tasks` utility is applicable to the MCP server's
   current or planned tool surface
4. **SDK tiering implications** — assess whether MCP SDK tiering
   affects the repo's SDK dependency strategy
5. **JSON Schema 2020-12 migration scope** — assess whether the MCP
   server's tool schemas need updating for the new default dialect

## Evidence Sources

- [practice-aligned-direction-and-gap-baseline.md](../../../analysis/practice-aligned-direction-and-gap-baseline.md) —
  MCP signals in the direction-of-travel matrix
- [governance-plane-direction-of-travel.md](../../../research/agentic-engineering/governance-planes-and-supervision/governance-plane-direction-of-travel.md) —
  Slice A trajectory analysis (MCP is highest-signal project)
- [cross-lane-direction-survey.md](../../../research/agentic-engineering/cross-lane-direction-survey.md) —
  Slice C governance-planes lane routing

## Non-Goals

- No MCP server code changes in this plan (deep dive only)
- No adoption of MCP `tasks` without concrete applicability evidence
- No ADR amendment without owner approval
- No promotion of findings to doctrine without a follow-up plan

## Prerequisites

- Analysis baseline and cross-lane survey already landed (2026-04-20)
- MCP `2025-11-25` release notes and governance documentation
  accessible via web fetch
