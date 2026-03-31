---
name: "WS3 Phase 3: Canonical Contracts and Runtime"
overview: "Make canonical descriptor metadata and runtime registration sufficient for MCP App tools without app-layer shims."
parent_plan: "ws3-widget-clean-break-rebuild.plan.md"
isProject: false
todos:
  - id: metadata-contract
    content: "Extend canonical metadata projection for UI visibility and app-only helper behaviour."
    status: completed
  - id: resource-identity-rename
    content: "Rename resource identity atomically across codegen/runtime/auth/tests/docs."
    status: completed
  - id: auth-policy-alignment
    content: "Align auth wording and runtime behaviour to ADR-113 policy."
    status: completed
  - id: b3-hybrid-retention
    content: "Adapt preserve-schema-examples.ts (B3 Hybrid) to coexist with registerAppTool — confirmed required because registerAppTool does not handle schema enrichment."
    status: completed
  - id: aggregated-security-schemes
    content: "Ensure new aggregated tools (user-search, user-search-query) have correct securitySchemes at top level, consistent with existing aggregated tool pattern."
    status: completed
  - id: fallback-policy
    content: "Make non-UI host fallback policy explicit and testable."
    status: pending
---

# WS3 Phase 3: Canonical Contracts and Runtime

**Status**: IN PROGRESS — Canonical/runtime closure is green and reviewed; only the deferred non-UI host fallback evidence remains open in this parent phase
**Last Updated**: 2026-03-31

## Required Inputs

1. `ws3-widget-clean-break-rebuild.plan.md` — Phase 3 section, Canonical
   Compliance Checklist, and target architecture sections 5-6
2. `mcp-apps-support.research.md` — canonical server model and registration
   rules
3. `current/auth-safety-correction.plan.md` — C8 status (merge prerequisite
   for task 9)

## Current Closure State (2026-03-31)

- C8 auth closure is complete. Task 9 is no longer blocked by the auth plans.
- The widget-resource integration failure is closed by injecting widget HTML
  through `ResourceRegistrationOptions` rather than depending on
  `dist/mcp-app.html` inside the test fake.
- The separate lesson-summary schema fallout tracked in
  `ws3-phase-3-schema-fallout-closure.plan.md` is complete.
- `pnpm check` and `pnpm qg` are both green on the current tree.
- Reviewer closure is complete for this batch: `type-reviewer`,
  `test-reviewer`, and `code-reviewer` findings were addressed;
  `security-reviewer` and `architecture-reviewer-fred` returned no findings;
  `mcp-reviewer` hung twice and produced no findings.
- The explicit non-UI host fallback test remains pending and is intentionally
  deferred to later host-facing UI delivery work.

### Key File Paths

These are the primary files this phase modifies. Read before starting:

| Responsibility | Path |
|---|---|
| Widget URI constant (source) | `packages/sdks/oak-sdk-codegen/code-generation/typegen/cross-domain-constants.ts` |
| Widget constant generator | `packages/sdks/oak-sdk-codegen/code-generation/typegen/generate-widget-constants.ts` |
| Tool metadata emission | `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/emit-index.ts` |
| Tool descriptor contract | `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/contract/tool-descriptor.contract.ts` |
| Aggregated tool definitions | `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts` |
| Tool projections | `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/projections.ts` |
| Tool registration (app) | `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts` |
| Resource registration | `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts` |
| B3 Hybrid override | `apps/oak-curriculum-mcp-streamable-http/src/preserve-schema-examples.ts` |
| Auth checker | `apps/oak-curriculum-mcp-streamable-http/src/tool-auth-checker.ts` |
| Public resource auth | `apps/oak-curriculum-mcp-streamable-http/src/auth/public-resources.ts` |

## Reviewer-Validated Findings (2026-03-30)

The following findings were confirmed by specialist reviewers and are binding
constraints for this phase:

1. **B3 Hybrid must be retained**: `registerAppTool` from
   `@modelcontextprotocol/ext-apps@1.3.2` is a thin wrapper that normalises
   `_meta.ui.resourceUri` <-> `_meta["ui/resourceUri"]` bidirectionally, then
   delegates to `server.registerTool()`. It performs zero schema enrichment.
   The `preserve-schema-examples.ts` file remains the only mechanism for injecting
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
8. Adapt `preserve-schema-examples.ts` (B3 Hybrid) for `registerAppTool` coexistence:
   - **pre-investigation (do first)**: Zod 4 introduces `.meta()` which attaches
     arbitrary metadata (including `examples`) that `z.toJSONSchema()` preserves
     in the JSON Schema output. Before adapting the override, investigate whether
     the B3 Hybrid can be **eliminated entirely** by:
     (a) checking which Zod version the MCP SDK uses internally for `tools/list`
         conversion — if Zod 4 with `z.toJSONSchema()`, `.meta()` fields flow through
     (b) checking whether sdk-codegen can emit `.meta({ examples: [...] })` on
         generated Zod schemas during the OpenAPI → Zod generation step
     (c) if both are favourable, the override becomes dead code — examples flow
         through the native pipeline: OpenAPI → Zod with `.meta({ examples })` →
         `z.toJSONSchema()` → JSON Schema with examples preserved
     If the MCP SDK does NOT honour `.meta()` (e.g. uses its own pre-Zod-4
     converter), document the finding and proceed with adaptation as below.
   - **confirmed**: `registerAppTool` does NOT handle schema enrichment — the
     B3 Hybrid is retained as a bounded workaround unless the investigation
     above finds a native path
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
4. B3 Hybrid (`preserve-schema-examples.ts`) is either eliminated (if Zod 4
   `.meta()` investigation finds a native path) or adapted for `registerAppTool`
   coexistence, labelled as bounded workaround with documented removal trigger,
   and covered by a coexistence test
5. JSON Schema `examples` are preserved in `tools/list` responses (E2E test),
   whether via native `.meta()` flow or via the B3 Hybrid override
6. Auth semantics and docs match MCP auth target semantics, or carry explicit
   compatibility waiver status where applicable
7. UI-bearing tools still provide usable text fallback when `_meta.ui` is ignored
8. New aggregated tool entries use `satisfies` constraint for structural
   consistency with existing aggregated tools
9. C8 auth-safety-correction is complete before new tool securitySchemes merge
10. Resource slug rename is validated end-to-end: tool `_meta.ui.resourceUri`
    matches registered resource, and `resources/read` for that URI succeeds
