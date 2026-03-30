---
name: "MCP App Extension Migration"
overview: "Umbrella plan for completing Oak's MCP Apps migration. WS1 and WS2 are complete; the active remaining work is a total clean-break rebuild of the UI surface as one fresh React MCP App."
source_research:
  - "../roadmap.md"
  - "../mcp-apps-support.research.md"
specialist_reviewer: "mcp-reviewer"
skills:
  - "mcp-migrate-oai"
  - "mcp-create-app"
  - "mcp-add-ui"
  - "mcp-convert-web"
supersedes:
  - "replace-openai-app-with-mcp-app-infrastructure.execution.plan.md"
todos:
  - id: ws1-adr-codegen
    content: "WS1: Write ADR-141 and migrate canonical tool metadata from legacy aliases to MCP Apps `_meta.ui.resourceUri`."
    status: completed
  - id: ws2-runtime-migration
    content: "WS2: Migrate runtime resource registration, MIME usage, and delete obvious host-specific artefacts."
    status: completed
  - id: ws3-widget-clean-break
    content: "WS3: Delete the dead widget framework and build one fresh React MCP App on the MCP Apps standard."
    status: pending
  - id: ws4-search-ui
    content: "WS4: Deliver the human-facing search UI as part of the WS3 clean-break MCP App rebuild."
    status: pending
---

# MCP App Extension Migration

**Status**: ACTIVE  
**Last Updated**: 2026-03-30  
**Scope**: Complete Oak’s MCP Apps migration and finish the fresh React MCP App
rebuild.

---

## Context

Oak’s MCP HTTP server is moving to a fully MCP Apps-native UI surface.

The remaining UI work is a **total clean break**:

- delete the dead widget framework
- remove banned legacy runtime assumptions from active guidance
- build one fresh React MCP App on the MCP Apps standard

The old widget system is not a compatibility target.

The intended search split is also non-negotiable:

1. `search` remains the model-facing, agent-facing search interface
2. `user-search` is the UI-first, user-first MCP App search interface
3. `user-search-query` remains app-only helper functionality when justified by
   the WS3 child plan

## Governing Constraints

This umbrella plan is governed by:

- `.agent/directives/principles.md`
- `.agent/directives/testing-strategy.md`
- `.agent/directives/schema-first-execution.md`
- ADR-141

Binding consequences:

1. No compatibility layers, shims, or bridge code
2. Schema-first and generator-first remain non-negotiable
3. Apps stay thin; canonical contracts stay in SDK/codegen
4. Active implementation uses the MCP Apps standard and
   `@modelcontextprotocol/ext-apps`, not host-specific legacy surfaces

## Completed Foundations

### WS1 — ADR and metadata contract

Complete.

Outcomes:

- ADR-141 accepted
- canonical tool metadata moved to `_meta.ui.resourceUri`
- legacy metadata aliases removed from the canonical SDK contract path

### WS2 — Runtime resource migration

Complete and archived at:

- `../archive/completed/ws2-app-runtime-migration.plan.md`

Outcomes:

- runtime resource registration moved onto MCP Apps helpers
- `RESOURCE_MIME_TYPE` adopted in the active runtime
- obvious host-specific artefacts deleted

### Runtime boundary simplification

Complete and archived at:

- `../archive/completed/mcp-runtime-boundary-simplification.plan.md`

Outcomes:

- canonical transport-neutral descriptor surface established
- explicit ingress/auth boundary established
- the WS3 child plan no longer depends on unfinished runtime simplification work

## Active Workstream

### WS3 + WS4 now execute together

The remaining UI work is carried by one child plan:

- [ws3-widget-clean-break-rebuild.plan.md](ws3-widget-clean-break-rebuild.plan.md)

This child plan covers:

1. deletion of the dead widget framework
2. fresh React MCP App infrastructure
3. curriculum-model UI
4. user-search UI as a first-class user-first tool in the aggregated tool
   surface
5. app-only helper-tool visibility and runtime contract work needed to support
   the new UI properly

`ws4-search-ui` remains a distinct umbrella todo for milestone tracking, but
its execution lives inside the WS3 child plan.

### Cross-plan dependency note

WS3 delivery and closure must stay aligned with:

1. `../current/auth-safety-correction.plan.md` for deny-by-default auth
   invariants when tool metadata is absent/empty/malformed
2. `../current/auth-boundary-type-safety.plan.md` for auth boundary typing and
   fail-fast validation at runtime boundaries

These follow-on plans are not part of WS3 implementation scope, but they are
blocking closure gates for auth-risk closure across the migration workstream.

Explicit rule:

- WS3/WS4 implementation phases may proceed.
- WS3/WS4 migration closure must not be marked complete until both plans are
  complete (or explicitly superseded by accepted architecture).

### Specialist-capability dependency (separate collection)

`mcp-reviewer` upgrade work is intentionally tracked
outside this product migration collection at:

- `.agent/plans/agentic-engineering-enhancements/archive/completed/mcp-specialist-upgrade.plan.md`

Reason: this is reviewer-capability infrastructure (ADR-129 triplet hardening),
not product/runtime delivery scope. It is a non-blocking parallel dependency for
review quality; WS3/WS4 closure is governed by the product/runtime exit criteria
in this plan.

## Execution Order

```text
WS1: ADR + metadata contract                ✓ complete
WS2: runtime migration                      ✓ complete
Runtime boundary simplification             ✓ complete
WS3 child plan: fresh React MCP App rebuild ▶ active
  Phase 0: baseline + RED specs
  Phase 1: delete legacy widget framework
  Phase 2: scaffold fresh MCP App infra
  Phase 3: canonical contracts + runtime integration
  Phase 4: curriculum-model view
  Phase 5: user-search view
  Phase 6: docs + review + commit
C8 closure gates: auth metadata hardening   ⏳ required for migration closure
```

## Exit Criteria

This umbrella plan is complete when:

1. The WS3 child plan is complete
2. `ws3-widget-clean-break` can be marked completed
3. `ws4-search-ui` can be marked completed
4. C8 auth hardening closure gates are complete (or explicitly superseded by
   accepted architecture):
   - `../current/auth-safety-correction.plan.md`
   - `../current/auth-boundary-type-safety.plan.md`
5. No active product path depends on banned legacy widget code or guidance
6. All quality gates pass

## Related Documents

- [../roadmap.md](../roadmap.md) — strategic migration roadmap
- [ws3-widget-clean-break-rebuild.plan.md](ws3-widget-clean-break-rebuild.plan.md) —
  active implementation plan
- [../archive/completed/ws2-app-runtime-migration.plan.md](../archive/completed/ws2-app-runtime-migration.plan.md) —
  completed runtime migration
- [../archive/completed/mcp-runtime-boundary-simplification.plan.md](../archive/completed/mcp-runtime-boundary-simplification.plan.md) —
  completed runtime simplification
- [../mcp-apps-support.research.md](../mcp-apps-support.research.md) —
  canonical MCP Apps research summary for this collection
