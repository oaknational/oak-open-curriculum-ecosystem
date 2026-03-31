---
name: MCP Apps Standard Migration Plan
overview: "Strategic planning anchor for the remaining Oak MCP Apps work. Defines the canonical target architecture, the live execution stack, and the remaining dependency order."
lastValidatedDate: 2026-03-30
todos:
  - id: canonical-research
    content: "Maintain the canonical MCP Apps research summary and keep it aligned with the live executable plans."
    status: completed
  - id: adr-141
    content: "ADR-141 remains the binding architecture source of truth for the MCP Apps primary surface."
    status: completed
  - id: domain-c-execution
    content: "Execute the remaining MCP Apps work through the umbrella migration plan and the active WS3 child plan."
    status: pending
  - id: c8-auth-metadata-invariant-hardening
    content: "Implement auth metadata invariant hardening."
    status: pending
  - id: domain-d-feature-backlog
    content: "Define additive feature work only after the remaining canonical MCP Apps execution work lands."
    status: pending
isProject: false
---

# MCP Apps Standard Migration Plan

**Status**: ACTIVE
**Last Updated**: 2026-03-31

---

## Purpose

This roadmap is the strategic planning anchor for Oak's remaining MCP Apps
work. It defines the canonical target, records the live execution stack, and
keeps the remaining dependency order explicit.

This document is intentionally present-tense only. It does not preserve the
story of the superseded widget system.

Status token definitions are standardised in
[README.md](README.md#status-legend).

## Source of Truth

The MCP Apps workstream is governed by:

1. ADR-141
2. `.agent/directives/principles.md`
3. `.agent/directives/testing-strategy.md`
4. `.agent/directives/schema-first-execution.md`
5. The active executable plans

Accepted ADRs remain the architectural source of truth. Active and current
plans remain the execution source of truth.

## Strategic Invariants

This roadmap does not restate directive-level constraints. The authoritative
constraints live in the active plans and referenced directives.

Workstream-level invariants:

1. Complete replacement of the OpenAI-era widget infrastructure with a new MCP
   App built on `@modelcontextprotocol/ext-apps`
2. `search` remains model-facing and agent-facing
3. `user-search` is delivered as the new UI-first, user-first search surface
4. `apps/oak-curriculum-mcp-stdio` remains out of scope

## Live Plan Stack

Read the live workstream in this order:

1. [roadmap.md](roadmap.md)
2. [active/mcp-app-extension-migration.plan.md](active/mcp-app-extension-migration.plan.md)
3. [active/ws3-widget-clean-break-rebuild.plan.md](active/ws3-widget-clean-break-rebuild.plan.md)
4. [current/README.md](current/README.md)

When touching runtime contract, metadata visibility, resource auth, or tool
registration, also read:

5. [current/auth-safety-correction.plan.md](current/auth-safety-correction.plan.md)
6. [current/auth-boundary-type-safety.plan.md](current/auth-boundary-type-safety.plan.md)

Completed dependency work is archived at:

- [archive/completed/ws2-app-runtime-migration.plan.md](archive/completed/ws2-app-runtime-migration.plan.md)
- [archive/completed/mcp-runtime-boundary-simplification.plan.md](archive/completed/mcp-runtime-boundary-simplification.plan.md)

## Execution Order

```text
WS1: ADR + metadata contract                ✓ complete
WS2: runtime migration                      ✓ complete
Runtime boundary simplification             ✓ complete
WS3: fresh React MCP App rebuild            ▶ active
WS4: search UI delivery                     ▶ executed inside WS3
C8: auth metadata invariant hardening       ⏳ pending
Output schemas follow-up                    ⏳ current
Future additive feature backlog             ⏳ blocked on remaining canonical work
```

## Active Work

### WS3 and WS4

The remaining UI work is carried by:

- [active/mcp-app-extension-migration.plan.md](active/mcp-app-extension-migration.plan.md)
- [active/ws3-widget-clean-break-rebuild.plan.md](active/ws3-widget-clean-break-rebuild.plan.md)

Detailed WS3/WS4 execution scope, sequencing, and enforcement live in the
active umbrella and child plans. This roadmap intentionally avoids duplicating
that operational detail.

### C8 auth metadata invariant hardening

This is a blocking correctness item for WS3 contract hardening. It must not be
treated as optional cleanup.

The execution plans for this work are:

- [current/auth-safety-correction.plan.md](current/auth-safety-correction.plan.md)
- [current/auth-boundary-type-safety.plan.md](current/auth-boundary-type-safety.plan.md)

### Output schema follow-up

[current/output-schemas-for-mcp-tools.plan.md](current/output-schemas-for-mcp-tools.plan.md)
remains valid follow-on work. It can advance independently where transport
exposure does not depend on unfinished MCP Apps execution.

## Validation

Canonical readiness and validation commands for this workstream:

```bash
pnpm qg
```

Full scrub before push/merge:

```bash
pnpm check
```

Canonical runtime contamination check is defined in the WS3 child plan and is a
required guardrail for active-path legacy residue. It is not, by itself, the
single source of truth for workstream completion.

Normative documentation drift is validated through executable-plan acceptance
criteria and reviewer checks, not by searching plan prose for banned strings.

## Completion Criteria

This roadmap can be treated as complete when:

1. The active WS3 child plan is complete
2. The umbrella migration plan can close WS3 and WS4 together
3. C8 is complete or explicitly superseded by accepted architecture
4. Active product/runtime code is clean under the canonical WS3 contamination
   check
5. Quality gates pass

## Related Documents

- [active/README.md](active/README.md) — active executable plans
- [current/README.md](current/README.md) — queued and resumable execution plans
- [mcp-apps-support.research.md](mcp-apps-support.research.md) — canonical MCP
  Apps research summary for Oak
- [future/README.md](future/README.md) — later work beyond the active migration
- [../agentic-engineering-enhancements/archive/completed/mcp-specialist-upgrade.plan.md](../agentic-engineering-enhancements/archive/completed/mcp-specialist-upgrade.plan.md) —
  parallel reviewer-capability upgrade tracked in the agentic-engineering
  collection (complete; separate from product delivery scope)
