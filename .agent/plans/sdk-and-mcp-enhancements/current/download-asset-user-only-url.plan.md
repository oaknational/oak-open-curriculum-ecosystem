---
name: "Download Asset User-Only URL Boundary"
overview: "Keep download-asset URLs out of model-visible MCP result fields while preserving user downloads through MCP App _meta."
todos:
  - id: phase-0-foundation
    content: "Phase 0: Re-ground MCP Apps result-field semantics and local asset-download behaviour."
    status: pending
  - id: phase-1-response-boundary
    content: "Phase 1: Replace download-asset model-visible URL output with a user-only _meta payload."
    status: pending
  - id: phase-2-guidance-alignment
    content: "Phase 2: Align prompts, tool guidance, and adjacent plan expectations with the user-only URL boundary."
    status: pending
  - id: phase-3-documentation
    content: "Phase 3: Document the asset-content visibility constraint in an ADR and all relevant README/reference surfaces."
    status: pending
  - id: phase-4-gates-review
    content: "Phase 4: Run quality gates, reviewer checks, and consolidation."
    status: pending
---

# Download Asset User-Only URL Boundary

**Last Updated**: 2026-05-06
**Status**: NOT STARTED
**Scope**: Change `download-asset` so signed download URLs are delivered only
to the MCP App/user surface, never through model-visible `content` or
`structuredContent`.

---

## Context

The preview evaluation showed the important split:

1. Asset bytes are not returned by MCP tools. The generated tool pipeline skips
   `/lessons/{lesson}/assets/{type}`, and the HTTP asset proxy streams bytes
   only when a signed proxy URL is requested.
2. `download-asset` currently returns the signed proxy URL in model-visible
   fields. `runDownloadAssetTool` passes the URL to `formatToolResponse`, which
   places it in the human-readable `content` summary, the JSON `content` block,
   and `structuredContent`.
3. MCP Apps already gives us the right boundary: `_meta` is the App/widget data
   channel and is not intended to be added to model context. This plan still
   treats Oak-controlled `content` and `structuredContent` as the fields that
   must be URL-free.

The existing setup already avoids exposing downloadable asset content to the
model by default. The generated MCP tool surface returns lesson content and asset
metadata, while actual asset bytes stay behind the HTTP proxy. This plan is
therefore simple good practice: it hardens the remaining URL presentation
boundary, makes the rule testable, and documents the design constraint
durably.

The implementation preserves the existing server-side proxy and signed URL
factory, but changes the `download-asset` result contract so the URL moves to
`_meta` only. Text-only hosts will receive a clear status message and no URL.
App-capable hosts can render a user-facing download control from `_meta`.

The design constraint is stronger than URL placement: agents must never see the
content of downloadable assets. This rule is absolute for the current system.
If the rule changes in the future, that change must be made deliberately through
a new ADR or an explicit ADR amendment before implementation changes.

## Target Behaviour

`download-asset` must return:

- `content`: a short status message with no URL and this exact
  agent-facing sentence:
  "Any download URLs are strictly for users; agents must never open them."
- `structuredContent`: safe metadata only, such as `lesson`, `type`, `status`,
  and `summary`; no URL, signature, expiry timestamp, or proxy path.
- `_meta`: widget-only/user-only payload containing the signed `downloadUrl`
  and any rendering metadata needed by the MCP App.
- Tool metadata: `download-asset` must point at an MCP App resource through
  `_meta.ui.resourceUri`, and that App must consume `_meta.assetDownload` to
  render the user-facing control.

The initial target shape is:

```typescript
{
  content: [
    {
      type: "text",
      text:
        "A user-only download is ready in the MCP App. " +
        "Any download URLs are strictly for users; agents must never open them.",
    },
  ],
  structuredContent: {
    lesson,
    type,
    status: "ready",
    summary:
      "A user-only download is ready in the MCP App. " +
      "Any download URLs are strictly for users; agents must never open them.",
  },
  _meta: {
    toolName: "download-asset",
    "annotations/title": "Download Asset",
    assetDownload: {
      downloadUrl,
      lesson,
      type,
    },
  },
}
```

Keep the signed URL route and validation unchanged unless tests expose a direct
dependency on model-visible URL output.

## Non-Goals

- Do not fetch, inspect, parse, preview, or validate actual asset content.
- Do not change `get-lessons-assets` to hide asset metadata.
- Do not alter the asset proxy signing algorithm, TTL, or upstream fetch route.
- Do not add a generic hidden-data mode to `formatToolResponse` until a second
  consumer needs it.
- Do not introduce a host-specific fallback path. All UI delivery remains MCP
  Apps standard.

## Definition of Done

Implementation is not done until all of these are true:

1. `download-asset` keeps signed download URLs out of model-visible
   `content` and `structuredContent`.
2. No agent-facing tool, prompt, resource, README, test fixture, or diagnostic
   path exposes asset content to agents.
3. The ADR records that the existing default setup already keeps downloadable
   asset content out of model-visible MCP tool results; the implementation is a
   hardening and documentation pass for the remaining URL boundary.
4. A new ADR documents the design constraint: agents must never see the content
   of downloadable assets in the current system, and any future relaxation
   requires a later ADR or explicit ADR amendment.
5. All relevant README and reference surfaces document the boundary between
   model-visible lesson data, user-only download controls, and the HTTP asset
   proxy.
6. Tests prove URL absence from model-visible result fields and prove asset
   content is not fetched or surfaced during automated verification.
7. `docs-adr-expert`, `mcp-expert`, `security-expert`, `test-expert`,
   and `code-expert` have reviewed the landed change or their findings have
   explicit owner disposition.

## Foundation Alignment

Before implementation and at the start of each phase, read:

1. `.agent/directives/principles.md`
2. `.agent/directives/testing-strategy.md`
3. `.agent/directives/schema-first-execution.md`

Alignment points:

- Simpler shape: one dedicated `download-asset` response builder avoids changing
  the shared formatter used by every generated and aggregated tool.
- Test behaviour, not implementation: tests assert where the URL is visible and
  where it is absent.
- Schema-first discipline: no generated output is hand-edited; if generated
  descriptions need changing, update the generator template and run
  `pnpm sdk-codegen`.
- Replace, do not bridge: remove model-visible URL output rather than layering a
  second URL channel beside it.

## Lifecycle Trigger Commitment

This is a non-trivial MCP runtime contract change. Apply
`.agent/plans/templates/components/lifecycle-triggers.md` during execution:

1. Run start-right before product edits.
2. Register active areas for the SDK, MCP HTTP app, and plan/doc files.
3. Record any scope changes in the collaboration log.
4. Close claims and run the consolidation trigger check at handoff.

## Reviewer Scheduling

- Pre-execution: `mcp-expert` on the planned result-field contract.
- During implementation: `test-expert` for the red/green cycles and
  `security-expert` for signed URL exposure boundaries.
- If Phase 1.3 adds or materially changes an MCP App resource:
  `react-component-expert`, `accessibility-expert`, and any other
  frontend specialist required by ADR-149 for the touched UI surface.
- Post-implementation: `code-expert` gateway, `mcp-expert`,
  `docs-adr-expert`, and `release-readiness-expert`.

## Resolution Plan

### Phase 0: Verify Foundation Assumptions

**Goal**: Confirm the code still matches the preview finding before mutation.

#### Task 0.1: Re-check local contract surfaces

**Acceptance Criteria**:

1. `runDownloadAssetTool` is still the only path generating the signed URL for
   MCP tool output.
2. `formatToolResponse` still serialises `data` into model-visible fields.
3. The asset proxy route continues to be HTTP-only and already tested.
4. The official MCP Apps docs are re-checked for current `_meta` and tool-result
   field semantics.
5. `download-asset` either already has `_meta.ui.resourceUri` and a registered
   App resource, or Phase 1 includes the work to add that standard MCP App path.
6. No asset bytes are accessed during this verification.

**Deterministic Validation**:

```bash
rg "runDownloadAssetTool|downloadUrl|formatToolResponse" \
  packages/sdks/oak-curriculum-sdk/src/mcp \
  apps/oak-curriculum-mcp-streamable-http/src

pnpm --filter @oaknational/curriculum-sdk test -- \
  src/mcp/aggregated-asset-download/execution.unit.test.ts

pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test -- \
  src/asset-download/asset-download-route.integration.test.ts
```

**Task Complete When**: The current state is confirmed and no task touches asset
content.

### Phase 1: Response Boundary TDD Pair

**Goal**: Make the URL user-only through MCP App `_meta`.

#### Task 1.1: RED - assert URL absence from model-visible fields

Add failing tests in
`packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-asset-download/execution.unit.test.ts`.

**Acceptance Criteria**:

1. The test fails against current code because `content` includes the URL.
2. The test fails against current code because `structuredContent` includes
   `downloadUrl`.
3. The test asserts the exact agent-facing sentence:
   "Any download URLs are strictly for users; agents must never open them."
4. The test recursively checks every model-visible string field and fails if any
   one contains the signed URL, proxy path, `sig=`, or `exp=`.
5. The test asserts the generated URL exists only at
   `_meta.assetDownload.downloadUrl`.

**Deterministic Validation**:

```bash
pnpm --filter @oaknational/curriculum-sdk test -- \
  src/mcp/aggregated-asset-download/execution.unit.test.ts
```

Expected before GREEN: the new assertions fail for the current implementation.

#### Task 1.2: GREEN - implement a dedicated download response builder

Modify `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-asset-download/execution.ts`.

**Target changes**:

- Remove the `formatToolResponse` call from `runDownloadAssetTool`.
- Return a `CallToolResult` directly for this tool only.
- Put the signed URL under `_meta.assetDownload.downloadUrl`.
- Keep `toolName` and `annotations/title` in `_meta`.
- Keep `lesson`, `type`, `status`, and `summary` in `structuredContent`.
- Update comments/TSDoc so they no longer say the URL is returned to the model
  or presented by an LLM UI.

**Acceptance Criteria**:

1. No signed URL appears anywhere in `content`.
2. No signed URL appears anywhere in `structuredContent`.
3. `_meta.assetDownload.downloadUrl` contains the generated URL.
4. The exact agent-facing sentence is present in model-visible text.
5. No shared formatter behaviour changes for other tools.

**Deterministic Validation**:

```bash
pnpm --filter @oaknational/curriculum-sdk test -- \
  src/mcp/aggregated-asset-download/execution.unit.test.ts

pnpm --filter @oaknational/curriculum-sdk type-check
pnpm --filter @oaknational/curriculum-sdk lint
```

**Task Complete When**: The RED tests pass and SDK type/lint gates pass.

#### Task 1.3: RED/GREEN - prove the App can render the user control

Verify the UI path for `download-asset` rather than assuming `_meta` is enough.

**Target changes**:

- If `download-asset` already has `_meta.ui.resourceUri`, add tests for the
  existing App result handling.
- If it does not, wire `download-asset` to the existing MCP App resource or add a
  minimal MCP App resource that renders `_meta.assetDownload.downloadUrl` as a
  user-facing download control.
- Keep the implementation MCP Apps standard only: `registerAppTool`,
  `_meta.ui.resourceUri`, and registered `ui://` resource.

**Acceptance Criteria**:

1. `tools/list` exposes `download-asset` with `_meta.ui.resourceUri`.
2. The referenced `ui://` resource is registered.
3. The App renders a user-facing download control from `_meta.assetDownload`.
4. Model-visible tool output still contains no URL.
5. Text-only hosts have an explicit status-only trade-off: they can confirm a
   user-only download is ready, but cannot receive the URL through the model.

**Deterministic Validation**:

```bash
pnpm --filter @oaknational/curriculum-sdk test -- \
  src/mcp/universal-tools/aggregated-flat-zod-schema.integration.test.ts

pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:widget
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:widget:ui
```

**Task Complete When**: The App rendering path is tested and no URL appears in
model-visible fields.

### Phase 2: Guidance and Adjacent Contract Alignment

**Goal**: Remove wording that tells agents to produce clickable links.

#### Task 2.1: RED/GREEN - update prompt and guidance surfaces

Potential files:

- `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompt-messages.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-workflows.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-asset-download/definition.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/documentation-content.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/documentation-resources.ts`
- `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/tool-description.ts`

**Acceptance Criteria**:

1. Guidance says `download-asset` prepares a user-only App download control.
2. Guidance says agents must not open download URLs.
3. No guidance asks the model to present the URL as a clickable link.
4. Existing prompt/guidance tests are updated or extended to lock the new
   wording.
5. If the generator template changes, `pnpm sdk-codegen` is run and generated
   artefacts are reviewed.

**Deterministic Validation**:

```bash
pnpm --filter @oaknational/curriculum-sdk test -- \
  src/mcp/mcp-prompts.unit.test.ts \
  src/mcp/tool-guidance-data.unit.test.ts
```

**Review Validation**:

Read the changed prompt and guidance surfaces. Confirm they communicate the
user-only download boundary without asking the model to present or open the
download URL. Do not test exact prose.

#### Task 2.2: Align related executable plans

The current `output-schemas-for-mcp-tools.plan.md` names `downloadUrl` as
`download-asset` structured output. That expectation becomes wrong after this
plan.

**Acceptance Criteria**:

1. Either update that plan's `download-asset` expectation or record that this
   plan supersedes that part before output-schema work resumes.
2. The current plans index remains coherent.
3. No permanent doc is changed unless the behaviour is implemented.

**Review Validation**:

Read `output-schemas-for-mcp-tools.plan.md` and the current plans index. Confirm
their described `download-asset` contract is coherent with this plan before
output-schema work resumes. This is a planning/documentation consistency check,
not an exact-prose test.

### Phase 3: ADR and Documentation Propagation

**Goal**: Make the design constraint durable and discoverable.

#### Task 3.1: Write the ADR for asset-content visibility

Create a new ADR under `docs/architecture/architectural-decisions/`, using
`173-asset-content-visibility-boundary.md` unless that number is no longer
available when implementation starts.

**Acceptance Criteria**:

1. The ADR states the current rule plainly: agents must never see the content of
   downloadable assets.
2. The ADR distinguishes model-visible lesson data, user-only download controls,
   and the HTTP proxy that streams assets to users.
3. The ADR records that the rule is absolute for now, but may change only through
   a future ADR or explicit ADR amendment.
4. The ADR does not require agents or tests to fetch, inspect, preview, or parse
   actual asset content.
5. `docs/architecture/architectural-decisions/README.md` is updated with the new
   ADR entry.
6. `docs/architecture/architectural-decisions/126-asset-download-proxy.md` is
   updated with a bidirectional disposition note: its clickable-link narrative is
   superseded in part by the new asset-content visibility boundary.
7. The new ADR links to ADR-126 and ADR-141, and ADR-126 links back to the new
   ADR.

**Quality Validation**:

```bash
pnpm markdownlint:root \
  docs/architecture/architectural-decisions
```

**Review Validation**:

Ask `docs-adr-expert` to review the ADR and ADR-126 update against the
acceptance criteria above. The reviewer should assess the communicated decision,
cross-reference direction, and future-change mechanism, not exact wording.

#### Task 3.2: Update all relevant README and reference surfaces

Candidate surfaces include:

- `README.md`
- `apps/oak-curriculum-mcp-streamable-http/README.md`
- `apps/oak-curriculum-mcp-streamable-http/TESTING.md`
- `packages/sdks/oak-curriculum-sdk/README.md`, if it documents MCP tools
- tool/prompt guidance reference docs generated or maintained by the SDK
- MCP documentation resources exposed to hosts or agents
- any MCP App README or widget documentation that describes downloads

**Acceptance Criteria**:

1. README surfaces explain that agents can see lesson metadata, transcripts,
   quizzes, and asset metadata, but not downloadable asset content.
2. README surfaces explain that download URLs are user-only controls rendered
   through the MCP App path.
3. README surfaces link to the new ADR rather than duplicating the full decision.
4. Documentation names the text-only host trade-off: text-only hosts can receive
   status only, not download URLs.
5. Documentation remains free of the avoided vocabulary named by the owner for
   this boundary.

**Quality Validation**:

```bash
pnpm markdownlint:root \
  README.md \
  apps/oak-curriculum-mcp-streamable-http \
  packages/sdks/oak-curriculum-sdk \
  docs/architecture/architectural-decisions
```

**Review Validation**:

Ask `docs-adr-expert` to review the README/reference updates against the
acceptance criteria above. The reviewer should confirm the design boundary is
discoverable across the relevant surfaces without requiring a specific phrase in
any markdown file.

### Phase 4: Quality Gates, Reviews, and Consolidation

**Goal**: Prove the changed boundary across SDK, HTTP server, and MCP Apps
assumptions.

#### Task 4.1: Run gates

**Acceptance Criteria**:

1. SDK tests for `download-asset`, prompts, and guidance pass.
2. HTTP asset-download route tests still pass.
3. Full relevant package type/lint gates pass.
4. Repo-level gates are run or any pre-existing blocker is documented with
   exact failing output and ownership.

**Deterministic Validation**:

```bash
pnpm --filter @oaknational/curriculum-sdk test
pnpm --filter @oaknational/curriculum-sdk type-check
pnpm --filter @oaknational/curriculum-sdk lint

pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test -- \
  src/asset-download/asset-download-route.integration.test.ts \
  src/asset-download/asset-download-url-factory.unit.test.ts

pnpm type-check
pnpm lint
pnpm test
```

#### Task 4.2: Specialist review and closeout

**Acceptance Criteria**:

1. `test-expert`, `security-expert`, `mcp-expert`, and `code-expert`
   findings are resolved or explicitly accepted with owner direction.
2. `docs-adr-expert` confirms the ADR and documentation propagation are
   complete and do not drift from the implemented behaviour.
3. If an MCP App resource changes, the frontend specialist reviewers required
   by ADR-149 have reviewed the rendered user control.
4. `release-readiness-expert` confirms the deployment/user-facing contract is
   clear enough for preview promotion.
5. `/jc-consolidate-docs` is run after implementation and gates.
6. Plan todos and the current index reflect final status.

**Deterministic Validation**:

```bash
pnpm check
```

Expected: exit 0. If repo-wide checks fail because of unrelated existing
failures, capture the failing command and exact ownership before handoff.

## Testing Strategy

### Unit Tests

- `execution.unit.test.ts`: primary behavioural contract for model-visible URL
  absence and `_meta` URL presence.
- `mcp-prompts.unit.test.ts` and `tool-guidance-data.unit.test.ts`: guidance no
  longer instructs agents to surface clickable URLs.

### Integration Tests

- Existing HTTP asset route tests remain the proxy/signature confidence layer.
- No integration test should fetch real asset bytes.

### E2E Tests

- Host-level verification must confirm the MCP App can render the
  `_meta.assetDownload.downloadUrl` control.
- Any browser verification must stop at confirming the rendered control exists;
  do not open the asset URL.

## Success Criteria

- `download-asset` never exposes signed URLs through `content` or
  `structuredContent`.
- The ADR and README updates state that the existing default setup already keeps
  downloadable asset content out of model-visible MCP results; this work is
  hardening and documentation of the boundary.
- The exact agent-facing sentence appears in the content response:
  "Any download URLs are strictly for users; agents must never open them."
- MCP App/user-only `_meta` still contains the signed URL needed to render a
  download control.
- `download-asset` has a registered MCP App resource path that renders the
  control for users; text-only hosts receive status only.
- Prompt and tool guidance align with the user-only boundary.
- A new ADR records that agents must never see downloadable asset content in the
  current system, and any future relaxation requires an ADR update.
- All relevant README/reference surfaces link to the ADR and document the
  user-only download boundary.
- The signed proxy route and signature validation keep passing without asset
  content access.

## References

- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-asset-download/execution.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-asset-download/execution.unit.test.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tool-shared.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/asset-download/asset-download-route.integration.test.ts`
- `docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md`
- `docs/architecture/architectural-decisions/126-asset-download-proxy.md`
- `docs/architecture/architectural-decisions/141-mcp-apps-standard-primary.md`
- `https://modelcontextprotocol.io/extensions/apps/overview`

## Consolidation

After implementation, quality gates, and reviewer clearance, run
`/jc-consolidate-docs` to graduate any settled behaviour into durable docs and
archive the completed plan.
