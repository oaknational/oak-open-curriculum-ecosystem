---
name: "WS3 Phase 3 Execution: Canonical Contracts and Runtime"
overview: "Step-by-step execution plan for turning 3 RED specs GREEN by extending metadata contracts, adding new aggregated tools, and renaming the resource slug."
parent_plan: "ws3-phase-3-canonical-contracts-and-runtime.plan.md"
isProject: false
todos:
  - id: visibility-contract
    content: "Extend _meta.ui.visibility in contract generator template"
    status: completed
  - id: slug-rename
    content: "Rename resource slug from oak-json-viewer to oak-curriculum-app"
    status: completed
  - id: new-aggregated-tools
    content: "Create user-search and user-search-query aggregated tools"
    status: completed
  - id: widget-tool-names
    content: "Populate WIDGET_TOOL_NAMES and re-enable _meta on existing tools"
    status: completed
  - id: resource-registration
    content: "Register widget resource and update public resource auth"
    status: completed
  - id: codegen-verify
    content: "Run codegen, verify RED → GREEN"
    status: completed
  - id: b3-hybrid-tsdoc
    content: "Update B3 Hybrid TSDoc as bounded workaround"
    status: completed
  - id: widget-html-provider-seam
    content: "Close the widget resource test failure by injecting widget HTML through ResourceRegistrationOptions."
    status: completed
  - id: policy-fallback
    content: "Auth policy alignment and non-UI host fallback test"
    status: completed
  - id: final-gates-reviewers
    content: "Final quality gates and reviewer invocations"
    status: completed
---

# WS3 Phase 3 Execution Plan: Canonical Contracts and Runtime

**Status**: COMPLETE — Stage 1, Stage 2, and the fallback-policy proof are complete
**Last Updated**: 2026-04-02
**Parent**: ws3-phase-3-canonical-contracts-and-runtime.plan.md

## Context

Branch `feat/mcp_app_ui`, uncommitted Phase 3 changes on top of 15 prior
commits. Three former RED specs are GREEN. The widget-resource integration test
failure is closed by injecting widget HTML through
`ResourceRegistrationOptions`, and the separate lesson-summary schema fallout is
also closed in `ws3-phase-3-schema-fallout-closure.plan.md`. The earlier
Stage 1/2 closure already carried full `pnpm check` evidence, and the
2026-04-02 follow-up added targeted green validation for shared redaction,
auth-success logging, HTTP observability, and the fallback-proof E2E slice. B3
Hybrid remains retained (no structural change), and `registerAppTool` is still
not adopted in this phase.

## Execution Record (2026-03-31, evening session)

| Step | Status | Evidence |
|------|--------|----------|
| 1. Visibility contract | DONE | `_meta.ui.visibility` added to generator template, codegen regenerated, `ToolMeta` auto-propagated |
| 2. Slug rename | DONE | `oak-json-viewer` → `oak-curriculum-app` in constants, generator TSDoc, test data |
| 3. New aggregated tools | DONE | `aggregated-user-search/` module created (5 files), `definitions.ts` + `executor.ts` wired, `satisfies` guard added |
| 4. WIDGET_TOOL_NAMES | DONE | Populated with 4 tools, `_meta.ui` re-enabled on search + curriculum-model defs |
| 5. Resource registration | DONE | `registerWidgetResource()` added, `WIDGET_URI` added to public resources with waiver TSDoc |
| 6. RED → GREEN | DONE | 155/155 E2E tests pass (was 152/155 with 3 RED). 571/571 HTTP app unit tests pass. |
| 7. B3 Hybrid TSDoc | DONE | Labelled as bounded workaround, coexistence note, Zod 4 investigation result documented |
| 8. Widget HTML provider seam | DONE | `ResourceRegistrationOptions.getWidgetHtml` added; tests inject deterministic HTML; resource tests green again |
| 9. Auth policy + fallback | DONE | Explicit fallback proof added via `ws3-fallback-proof.e2e.test.ts` for `get-curriculum-model` and `user-search` |
| 10. Final closure | DONE | Schema fallout closed; reviewer pass completed; earlier Stage 1/2 closure had `pnpm check` green, and the 2026-04-02 follow-up added targeted green validation |

### Separate Closure Track

The separate lesson-summary schema fallout is now closed:

- `response-validators.unit.test.ts` fixtures now satisfy the generated
  `canonicalUrl` / `oakUrl` requirement
- `oak-search-cli` lesson-summary helpers, direct fixtures, and sandbox JSON are
  aligned with `SearchLessonSummary`
- active closure record:
  `ws3-phase-3-schema-fallout-closure.plan.md`

## RED Specs → GREEN Mapping

| RED Spec | Current failure | GREEN condition | Key steps |
|----------|----------------|-----------------|-----------|
| "at least one tool has `_meta.ui.resourceUri`" | `WIDGET_TOOL_NAMES` empty → no tools get `_meta.ui` | Populate allowlist + re-enable `_meta` on aggregated tools | Steps 4, 5 |
| "`user-search-query` has visibility `['app']`" | Tool does not exist | Create tool with `_meta.ui.visibility: ['app']` | Steps 1, 3 |
| "widget resource slug does not contain `oak-json-viewer`" | URI uses `oak-json-viewer` + no widget resource registered | Rename slug + register widget resource | Steps 2, 5 |

## Dependency Constraints

```text
Step 1 (visibility contract)  ──must precede──>  Step 3 (new tool descriptors)
Step 2 (slug rename)          ──must precede──>  Step 5 (resource registration)
Step 3 (new tools)            ──must precede──>  Step 4 (WIDGET_TOOL_NAMES)
Step 7 (B3 Hybrid TSDoc)      ──must precede──>  any future registerAppTool adoption
```

## Slug Decision

**Replace `oak-json-viewer` with `oak-curriculum-app`.**

## Execution Steps

### Step 1: Extend `_meta.ui.visibility` in Contract Type

Generator template (source of truth):
`packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/generate-tool-descriptor-file.ts`

Add `visibility?: readonly ('model' | 'app')[]` to `_meta.ui`.
Auto-propagates to `ToolMeta` via `types.ts:107`.

**Gate**: `pnpm check`. **Reviewer**: type-reviewer.

### Step 2: Rename Resource Slug

`packages/sdks/oak-sdk-codegen/code-generation/typegen/cross-domain-constants.ts:35`
`packages/sdks/oak-sdk-codegen/code-generation/typegen/generate-widget-constants.ts`
`packages/sdks/oak-sdk-codegen/code-generation/typegen/generate-widget-constants.unit.test.ts`

Sweep for remaining `oak-json-viewer` references.

**Gate**: `pnpm check`. **Reviewer**: architecture-reviewer-fred.

### Step 3: Create `user-search` and `user-search-query`

New module: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-user-search/`

Register in `definitions.ts`, add handlers in `executor.ts`, add `satisfies`
structural constraint.

**Gate**: `pnpm check`. **Reviewers**: mcp-reviewer, security-reviewer.

### Step 4: Populate `WIDGET_TOOL_NAMES` + Re-enable `_meta`

`cross-domain-constants.ts:53` — populate set.
`aggregated-search/tool-definition.ts:82` — uncomment `_meta`.
`aggregated-curriculum-model/definition.ts:63` — uncomment `_meta`.

**Gate**: `pnpm check`.

### Step 5: Register Widget Resource + Public Resources

`apps/.../src/register-resources.ts` — add `registerWidgetResource()`.
`apps/.../src/auth/public-resources.ts` — add `WIDGET_URI` with waiver TSDoc.

**Gate**: `pnpm check`. **Reviewer**: security-reviewer.

### Step 6: Codegen + Verify RED → GREEN

`pnpm sdk-codegen` → `pnpm check` → confirm 3 RED specs GREEN.

### Step 7: B3 Hybrid TSDoc

Label as bounded workaround. Document coexistence note and removal condition.

### Step 8: Widget HTML Provider Seam

`apps/.../src/register-resource-helpers.ts` — extend
`ResourceRegistrationOptions` with `getWidgetHtml`.
`apps/.../src/register-resources.ts` — consume the injected provider rather
than hard-wiring a filesystem read into the registration path.
`apps/.../src/handlers.ts` — wire the production provider.
`apps/.../src/register-resources.integration.test.ts` — pass deterministic test
HTML and assert the widget resource reads it.

### Step 9: Auth Policy + Fallback

Fallback test: verify UI-bearing tool results include text content.

Completed on 2026-04-02. The new boundary proof exercises
`get-curriculum-model` and `user-search` end-to-end and confirms each tool
returns:

- meaningful text summary in `content[0]`
- parseable JSON payload text in `content[1]`
- existing `structuredContent`

No new runtime branching was added; the proof closes the policy item against
the existing shared formatter.

### Step 10: Final Gates + Reviewers

Completed on the current tree:

- `pnpm check` passed
- `type-reviewer`, `test-reviewer`, and `code-reviewer` findings were addressed
- `security-reviewer` and `architecture-reviewer-fred` reported no findings
- `mcp-reviewer` hung twice and produced no findings

## Verification Checklist

1. `pnpm sdk-codegen` regenerates contract with `visibility` field
2. `pnpm build` succeeds (server + widget)
3. `pnpm type-check` clean
4. `pnpm test` — all unit/integration tests pass
5. `pnpm test:ui` — widget DOM tests pass
6. `pnpm test:e2e` — all 3 RED specs GREEN, remaining tests pass
7. `pnpm check` — full scrub passes
8. Contamination check: zero active-path `oak-json-viewer` hits
9. All reviewers invoked and findings addressed
