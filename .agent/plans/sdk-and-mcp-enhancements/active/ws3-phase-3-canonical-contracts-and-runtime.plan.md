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
  - id: b3-hybrid-retention
    content: "Adapt tools-list-override.ts (B3 Hybrid) to coexist with registerAppTool — confirmed required because registerAppTool does not handle schema enrichment."
    status: pending
  - id: aggregated-security-schemes
    content: "Ensure new aggregated tools (user-search, user-search-query) have correct securitySchemes at top level, consistent with existing aggregated tool pattern."
    status: pending
  - id: fallback-policy
    content: "Make non-UI host fallback policy explicit and testable."
    status: pending
---

# WS3 Phase 3: Canonical Contracts and Runtime

## Reviewer-Validated Findings (2026-03-30)

The following findings were confirmed by specialist reviewers and are binding
constraints for this phase:

1. **B3 Hybrid must be retained**: `registerAppTool` from
   `@modelcontextprotocol/ext-apps@1.3.2` is a thin wrapper that normalises
   `_meta.ui.resourceUri` <-> `_meta["ui/resourceUri"]` bidirectionally, then
   delegates to `server.registerTool()`. It performs zero schema enrichment.
   The `tools-list-override.ts` file remains the only mechanism for injecting
   JSON Schema `examples` into `tools/list` responses. (Source: MCP reviewer,
   confirmed from installed SDK source.)

2. **B3 Hybrid adaptation must precede `registerAppTool` adoption**: If both
   the override handler and any `ext-apps`-installed handler are on the same
   server, handler priority confusion occurs silently. Resolve the B3 Hybrid
   adaptation before introducing `registerAppTool` calls. (Source: Fred, Betty,
   Wilma — independent convergence.)

3. **C8 auth hardening is a merge prerequisite for task 9**: New aggregated
   tools with `securitySchemes` must not be merged while `toolRequiresAuth`
   lacks deny-by-default protection. `auth-safety-correction.plan.md` must be
   complete (or have an accepted supersession) before task 9 merges. (Source:
   Betty, Wilma.)

4. **`_meta.ui.visibility` is an array**: Valid values are `["model"]`,
   `["app"]`, or `["model", "app"]` (default when omitted). For the
   `user-search-query` app-only helper, set `visibility: ["app"]`. (Source: MCP
   reviewer, confirmed from `McpUiToolVisibility` in ext-apps spec types.)

5. **Aggregated tool pattern is an accepted exception to the cardinal rule**:
   `AGGREGATED_TOOL_DEFS` contains hand-authored tools that do not flow from
   the OpenAPI schema. This follows the established precedent (8 existing tools).
   The `definitions.ts` TSDoc acknowledges they "will eventually move to
   sdk-codegen time". Adding `user-search` and `user-search-query` follows
   this pattern. A `satisfies` structural guard should be added to catch drift
   between hand-authored and generated tool shapes. (Source: Fred.)

6. **`ontoolinputpartial`** should be documented as a lifecycle handler in the
   canonical client pattern. It enables streaming partial tool arguments for
   responsive UI during model generation. (Source: MCP reviewer.)

## Task Sequencing

Tasks in this phase have ordering constraints from reviewer findings:

```text
Task 8 (B3 Hybrid adaptation)  ──must precede──>  Task 5 (registerAppTool adoption)
C8 auth-safety-correction      ──must precede──>  Task 9 (new tool securitySchemes)
Task 1 (visibility contract)   ──must precede──>  Task 2 (new tool descriptors)
Task 3 (slug selection)        ──must precede──>  Task 4 (slug rename)
```

## Tasks

1. Extend canonical metadata contract to support `_meta.ui.visibility`
   (array of `"model"` | `"app"`, default `["model", "app"]` when omitted)
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
8. Adapt `tools-list-override.ts` (B3 Hybrid) for `registerAppTool` coexistence:
   - **confirmed**: `registerAppTool` does NOT handle schema enrichment — the
     B3 Hybrid is retained as a bounded workaround (removal trigger: upstream
     MCP SDK adds native JSON Schema examples support)
   - adapt the override so it does not conflict with `ext-apps` handler
     installation order on the same server instance
   - **this task must be completed before any `registerAppTool` call is
     introduced in the registration path** (see Task Sequencing above)
   - add an automated test that detects if both the override and an
     `ext-apps`-installed handler coexist on the same server
   - label the override explicitly in TSDoc as a bounded workaround per the
     no-shims principle, with the removal condition documented
9. Ensure new aggregated tools (`user-search`, `user-search-query`) define
   `securitySchemes` at the top level of their `AGGREGATED_TOOL_DEFS` entries,
   consistent with the existing aggregated tool pattern
   - **prerequisite**: C8 `auth-safety-correction.plan.md` must be complete (or
     have an accepted supersession) before this task merges — new tools must not
     enter the auth path while `toolRequiresAuth` lacks deny-by-default
   - add a `satisfies` structural constraint proving the new entries conform to
     the same shape as existing aggregated tools (compile-time drift guard)
   - record the `_meta.securitySchemes` asymmetry resolution: the
     `isAggregatedToolName` branch in `tool-auth-checker.ts` is the canonical
     resolution point for the asymmetry (not a migration target)

## Acceptance Evidence

1. UI tools advertise the new resource identity via canonical constants
2. Replacement resource slug is recorded in plan evidence and used consistently
   across codegen/runtime/auth/tests/docs
3. App-only helper visibility (`["app"]`) is metadata-driven and test-covered;
   E2E test validates `_meta.ui.visibility` on `user-search-query`
4. B3 Hybrid (`tools-list-override.ts`) is adapted for `registerAppTool`
   coexistence, labelled as bounded workaround with documented removal trigger,
   and covered by a coexistence test
5. JSON Schema `examples` are preserved in `tools/list` responses (E2E test)
6. Auth semantics and docs match MCP auth target semantics, or carry explicit
   compatibility waiver status where applicable
7. UI-bearing tools still provide usable text fallback when `_meta.ui` is ignored
8. New aggregated tool entries use `satisfies` constraint for structural
   consistency with existing aggregated tools
9. C8 auth-safety-correction is complete before new tool securitySchemes merge
10. Resource slug rename is validated end-to-end: tool `_meta.ui.resourceUri`
    matches registered resource, and `resources/read` for that URI succeeds
