---
name: "WS3 Phase 3: Canonical Contracts and Runtime"
overview: "Make canonical descriptor metadata and runtime registration sufficient for MCP App tools without app-layer shims."
parent_plan: "ws3-widget-clean-break-rebuild.plan.md"
isProject: false
todos:
  - id: metadata-contract
    content: "Extend canonical metadata projection for UI visibility and app-only helper behaviour."
    status: pending
  - id: resource-identity-rename
    content: "Rename resource identity atomically across codegen/runtime/auth/tests/docs."
    status: pending
  - id: auth-policy-alignment
    content: "Align auth wording and runtime behaviour to ADR-113 policy."
    status: pending
  - id: fallback-policy
    content: "Make non-UI host fallback policy explicit and testable."
    status: pending
---

# WS3 Phase 3: Canonical Contracts and Runtime

## Tasks

1. Extend canonical metadata contract to support `_meta.ui.visibility`
2. Add canonical descriptors for `user-search` and `user-search-query`
3. Select and record the replacement resource slug before changing code:
   - must not contain legacy identity (`openai`, `viewer`, `oak-json-viewer`)
   - must be stable for canonical constant generation and auth allowlist wiring
4. Rename resource identity away from `oak-json-viewer` using one atomic checklist:
   - codegen constants and templates
   - runtime registration and metadata wiring
   - public resource auth allowlist
   - E2E assertions
   - active docs
5. Keep one registry-driven tool registration path with metadata-driven visibility
6. Align auth policy to ADR-113:
   - default target is auth on all MCP client-to-server requests
   - any retained public-resource bypass is explicit Oak compatibility waiver
     (owner, scope, host evidence, removal condition)
   - no retained bypass is labelled as canonical MCP compliance
7. Implement non-UI host policy from WS3 parent:
   - no host-specific server branching
   - meaningful text fallback for UI-bearing tools

## Acceptance Evidence

1. UI tools advertise the new resource identity via canonical constants
2. Replacement resource slug is recorded in plan evidence and used consistently
   across codegen/runtime/auth/tests/docs
3. App-only helper visibility is metadata-driven and test-covered
4. No bespoke tool-list override/discovery layer exists in HTTP app runtime
5. Auth semantics and docs match MCP auth target semantics, or carry explicit
   compatibility waiver status where applicable
6. UI-bearing tools still provide usable text fallback when `_meta.ui` is ignored
