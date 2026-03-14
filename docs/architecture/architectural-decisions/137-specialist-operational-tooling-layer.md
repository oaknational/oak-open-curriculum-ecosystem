# ADR-137: Specialist Operational Tooling Layer

**Status**: Accepted
**Date**: 2026-03-13
**Related**: [ADR-129 (Domain Specialist Capability Pattern)](129-domain-specialist-capability-pattern.md), [ADR-119 (Agentic Engineering Practice)](119-agentic-engineering-practice.md)

## Context

ADR-129 defines the domain specialist triplet (reviewer + skill + situational rule) as the standard shape for adding domain-specific expertise to the agent ecosystem. The Elasticsearch and Clerk specialists have been implemented following this pattern.

In practice, a gap has emerged: agents can **assess code** that interacts with a domain system (via the reviewer) and receive **guidance** during implementation (via the skill), but they cannot **inspect or interact with the live domain system itself**. The reviewer can tell you "this mapping doesn't follow current Elastic guidance" by reading code, but it cannot check what the actual deployed index mapping looks like. The skill can advise on Clerk configuration, but it cannot inspect the live Clerk app's social connections or allowlist settings.

This creates a workflow gap where agents must either:

1. Ask the human to check live system state and report back, or
2. Make assumptions about live state based on code, which may have drifted.

Both are inefficient and error-prone.

## Decision

Extend the domain specialist capability pattern with an optional fourth layer: **operational tooling** that provides agent-accessible CLI commands or MCP tools for inspecting and interacting with live domain systems.

### The Extended Pattern

| Layer                   | Purpose                                                | Location                                           | Required? |
| ----------------------- | ------------------------------------------------------ | -------------------------------------------------- | --------- |
| **Reviewer**            | Read-only assessment against authoritative sources     | `.agent/sub-agents/templates/<domain>-reviewer.md` | Yes       |
| **Skill**               | Active workflow for planning, research, implementation | `.agent/skills/<domain>-expert/SKILL.md`           | Yes       |
| **Situational rule**    | Trigger conditions for reviewer invocation             | `.agent/rules/invoke-<domain>-reviewer.md`         | Yes       |
| **Operational tooling** | Agent-accessible CLI/MCP for live system interaction   | Domain-specific (CLI app, MCP tools, or both)      | Optional  |

The first three layers remain as defined in ADR-129. The operational tooling layer is optional — not every domain has a live system to interact with, and some domains may be adequately served by code-level review alone.

### Operational Tooling Design Principles

1. **Structured output**: Commands must produce structured JSON for agent consumption, not just human-readable text.
2. **Read-safe by default**: Inspection commands should be safe to run without confirmation. Mutation commands require explicit confirmation or dry-run modes.
3. **Reviewer-compatible output**: Suggestion and audit commands should produce findings in a format compatible with the reviewer's output template (violations, gaps, opportunities, observations).
4. **Build or adopt**: For each domain, evaluate whether an official CLI exists (and covers the needed operations) before building custom tooling. Prefer adoption when coverage is sufficient; supplement with custom tooling where gaps exist.
5. **Discoverable**: Operational tooling should be referenced from the specialist's skill and reviewer templates so agents know it exists.

### Current Domain Applicability

**Elasticsearch**: The search CLI (`apps/oak-search-cli`) already provides `admin` commands (count, stage, promote). Extension opportunities include index inspection (mappings, analysers, field types), query explanation/profiling, settings audit, and suggestion generation.

**Clerk**: No CLI exists in-repo. The official Clerk CLI (`github.com/clerk/cli`) is in development. Options are to adopt it when ready, build custom tooling on `@clerk/backend`, or both. Needed capabilities include app settings inspection, environment variable audit, OAuth configuration review, and social connection/allowlist audit.

### Non-Goals

- This ADR does not mandate that every specialist must have operational tooling.
- This ADR does not prescribe a specific implementation technology (CLI vs MCP tools vs both).
- This ADR does not change the triplet requirements from ADR-129 — the first three layers remain as defined.

## Rationale

### Why a fourth layer, not just better skills

The skill provides guidance during implementation — it tells you _how_ to configure something. Operational tooling provides _evidence_ of current state — it tells you what _is_ configured. These are fundamentally different capabilities:

- A skill says: "Clerk allowlists should restrict to `thenational.academy` per ADR-053."
- Operational tooling says: "The live Clerk app currently has allowlist enabled with domains: `thenational.academy`."

The combination enables a complete feedback loop: inspect live state, assess against best practice, recommend changes, verify after implementation.

### Why optional

Not every domain specialist benefits from live system interaction. The architecture reviewers, test reviewer, and type reviewer work entirely at the code level. Forcing operational tooling on every specialist would add unnecessary complexity. The fourth layer applies specifically to domains with external systems that have live state (databases, identity providers, search engines, deployment platforms).

### Why structured output

Agents parse structured data far more reliably than human-readable text. JSON output enables agents to programmatically compare live state against expected state, generate reviewer-format findings, and compose multi-step audit workflows without fragile text parsing.

## Consequences

### Positive

- Agents can inspect live system state without human intermediation.
- The reviewer + operational tooling combination enables end-to-end audit workflows.
- The pattern is documented before multiple domains implement it independently, ensuring consistency.
- The "build or adopt" principle prevents unnecessary custom tooling when official CLIs exist.

### Trade-offs

- Each domain's operational tooling requires implementation effort and ongoing maintenance.
- CLI tools that interact with live systems need credential management and access control.
- The optional nature means some domains will have the fourth layer and others won't — agents must handle both cases.

## References

- [ADR-129: Domain Specialist Capability Pattern](129-domain-specialist-capability-pattern.md) — the triplet this extends
- `apps/oak-search-cli` — existing Elasticsearch operational tooling (partial)
- `https://github.com/clerk/cli` — official Clerk CLI (in development)
- `@clerk/backend` — Clerk Backend SDK for custom tooling
