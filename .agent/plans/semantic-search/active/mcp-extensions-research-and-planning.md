---
name: MCP Extensions Expert Specialist Plan (Advisor + Reviewer)
overview: Establish an MCP-first planning and sequencing path for MCP Extensions work, with optional adapters for OpenAI features and a staged widget rollout.
todos:
  - id: gather-official-extension-governance
    content: "Read official extension governance and lifecycle docs first — especially the extension model, identifiers, and lifecycle (extension vs experimental), then extract non-negotiables and terminology."
    status: completed
  - id: gather-mcp-apps-foundation
    content: "Read MCP Apps overview and build docs end-to-end and produce a capability matrix (tool metadata, UI resource binding, transport implications, testing options, host support)."
    status: completed
  - id: gather-sdk-and-api-details
    content: "Review ext-apps repository docs and API docs for server, view, and host-facing modules; capture exact helper APIs, security metadata surfaces, and compatibility caveats."
    status: completed
  - id: map-oak-fit
    content: "Map existing Oak MCP server patterns to MCP Apps primitives: where to declare tools/resources, capability negotiation points, and where boundaries and fallbacks should be enforced."
    status: completed
  - id: define-expert-specialist
    content: "Define a single MCP Extensions expert specialist profile covering advisor + reviewer responsibilities, evidence requirements, and escalation criteria."
    status: completed
  - id: define-review-gates
    content: "Define explicit research and execution gates: completion criteria, risk register, dependency checks, and no-regression rules."
    status: completed
  - id: final-plan-and-estimate
    content: "Produce a sequenced implementation plan: proof-of-concept MCP App, security hardening, compatibility validation, and rollout sequencing across MCP servers."
    status: completed
  - id: compare-openai-and-mcp-extensions
    content: "Compare OpenAI Apps SDK patterns with MCP Apps standards, define MCP standard-first strategy with optional OpenAI adapter boundaries, and document fallback rules."
    status: completed
  - id: mcp-first-adapter-plan
    content: "Confirm adapter architecture, metadata conversion boundary, and optional OpenAI metadata overlays."
    status: completed
  - id: findings-integration-and-risks
    content: "Integrate code and docs findings, with risks and proposed mitigations for auth safety, parity, and migration control."
    status: completed
  - id: widget-prerequisite-step
    content: "Define and execute widget simplification: Oak branding only, no data payload, and limited initial tool attachment."
    status: completed
  - id: shared-context-parity
    content: "Define shared build + type-gen + runtime contract and parity checks in one fixed context."
    status: completed
  - id: search-ui-reintroduction-plan
    content: "Define staged reintroduction of search UI that uses the new search backend and human search capabilities fully."
    status: completed
isProject: false
---

# MCP Extensions Expert Specialist Plan (Advisor + Reviewer)

## Purpose

Establish a complete planning path for MCP Extensions work that is MCP-first by default and adapter-compatible for OpenAI where required. The plan now includes a staged rollout, parity gates, and a safer migration path for search UI.

Primary outcomes:

- Confirmed source-grounded strategy based on MCP extension governance.
- A practical MCP Apps implementation approach that fits Oak’s existing MCP architecture.
- A reusable specialist profile for both advisory and review work.
- A phased implementation plan ready for downstream execution.

## Core principle choices now locked

- MCP-first with optional adapters is the required architecture.
- Correctness is assumed unless checked at explicit verification gates.
- Build, type generation, and runtime are treated as one fixed shared context.
- Widgets are reduced before any broad reintroduction, with Oak branding only and no data.

## Sources to include (mandatory)

- https://modelcontextprotocol.io/extensions/overview
- https://modelcontextprotocol.io/extensions/apps/overview
- https://modelcontextprotocol.io/extensions/apps/build
- https://github.com/modelcontextprotocol/ext-apps
- https://modelcontextprotocol.github.io/ext-apps/api/
- https://developers.openai.com/apps-sdk
- https://developers.openai.com/apps-sdk/mcp-apps-in-chatgpt
- https://developers.openai.com/apps-sdk/quickstart
- https://developers.openai.com/apps-sdk/build/mcp-server
- https://developers.openai.com/apps-sdk/build/chatgpt-ui
- https://modelcontextprotocol.github.io/ext-apps/api/documents/Migrate_OpenAI_App.html

## Additional high-value sources to reference

- https://modelcontextprotocol.io/extensions
- https://modelcontextprotocol.io/docs/extensions/apps
- https://modelcontextprotocol.github.io/ext-apps/api/documents/Quickstart.html
- https://modelcontextprotocol.github.io/ext-apps/api/documents/Overview.html
- https://modelcontextprotocol.github.io/ext-apps/api/functions/server-helpers.registerAppTool.html
- https://modelcontextprotocol.github.io/ext-apps/api/functions/server-helpers.registerAppResource.html
- https://github.com/modelcontextprotocol/ext-apps/tree/main/examples
- https://modelcontextprotocol.io/community/seps/2133-extensions
- https://github.com/modelcontextprotocol/modelcontextprotocol/pull/1865
- https://modelcontextprotocol.github.io/ext-apps/api/modules/_modelcontextprotocol_ext-apps_app-bridge.html
- https://modelcontextprotocol.github.io/ext-apps/api/modules/_modelcontextprotocol_ext-apps_server.html
- https://modelcontextprotocol.github.io/ext-apps/api/functions/server-helpers.setToolContext.html
- https://modelcontextprotocol.github.io/ext-apps/api/interfaces/server_helpers.AppToolMetadata.html
- https://modelcontextprotocol.github.io/ext-apps/api/interfaces/server_helpers.AppResourceMetadata.html

## Working Principles

- Prefer official docs and primary sources over secondary interpretation.
- Preserve existing MCP transport and security posture while introducing explicit fallback rules.
- Keep UI useful when host-specific affordances are unavailable.
- Keep one core execution path as MCP standard, with optional adapters isolated by boundary.
- Assume findings are mostly correct, but place explicit verification checks at each major gate.
- Start broad on MCP extension patterns, then narrow to Oak-specific implementation constraints.
- Preserve existing MCP transport and security posture; do not expand scope without explicit gates.
- Ensure all new UI features remain useful with and without host UI support (progressive enhancement).
- Build a single execution path that prefers MCP standard capabilities first, then adds optional OpenAI-specific extensions behind feature flags.
- Treat extension logic as additive glue around shared primitives to keep implementations DRY and avoid duplicated metadata/tool wiring.

## Review Notes (Current context)

- `modelcontextprotocol.github.io/ext-apps/api/documents/Migrate_OpenAI_App.html`: maps OpenAI Apps SDK metadata and lifecycle to MCP Apps equivalents and explicitly positions MCP Apps keys/host bridge as default with `window.openai` as optional extension where MCP lacks parity.
- `developers.openai.com/apps-sdk`: positions Apps SDK as ChatGPT delivery path while documenting MCP Apps compatibility and the newer `ui/*` host bridge (`postMessage` + `tools/call`) pattern for interoperability.
- `developers.openai.com/apps-sdk/build/mcp-server` and `/build/chatgpt-ui`: reinforce dual-side implementation shape (server descriptor/tool/resource registration + host UI handling), including local testing with MCP Inspector and host-capability-aware UI messaging.

## Findings integrated from deep dive

- `tool-auth-checker` should handle missing `securitySchemes` defensively instead of assuming presence.
- Shared constants and runtime URIs are vulnerable to context drift if build/type-gen/runtime are not aligned.
- Tool metadata and response shaping currently show OpenAI coupling in non-optional areas and need adapter-only isolation.
- Widget rollout is currently broad; it must be staged to avoid accidental data leakage or UX complexity.
- Search UI should be intentionally deferred and reintroduced only after baseline and migration gates pass.

## Phase A — Evidence and constraint capture

1. Complete review of mandatory and high-value sources, with capability matrix and risk register.
2. Keep an assumptions log with open questions and confidence ratings.
3. Publish evidence snapshot that identifies MCP-first defaults and optional adapter areas.
4. Gate: required links reviewed and mapped to explicit design decisions.

## Phase B — Oak design mapping and safety

1. Map Oak MCP server boundaries to MCP Apps primitives in a single architectural decision note.
2. Define the initial tool candidates for UI binding and classify by read/write risk.
3. Define fallback and hard-stop policies: MCP standard required, adapter features optional.
4. Define auth and metadata safety checks around tool/resource handling.
5. Gate: capability map and fallback matrix approved by MCP specialist.

## Phase C — MCP-first core with adapter boundary

1. Define canonical MCP metadata contract used by core registration and tool/resource descriptors.
2. Add one compatibility adapter boundary for `_meta.openai*` and any host-specific behaviour.
3. Ensure MCP core can function without any OpenAI-specific metadata.
4. Gate: no required path depends on `window.openai` or OpenAI-only assumptions.

## Phase C-1 — Widget simplification prerequisite (must run before search widget return)

1. Replace existing app widgets with minimal Oak-branded shells.
2. Remove all tool/result data fields from widget payload.
3. Enable widgets only on a small initial tool subset: search-adjacent helper tools, browse helper, and documentation tool.
4. Explicitly defer search widget enablement.
5. Gate: manual check confirms widgets are static-brand-only and no additional data fields are rendered.

## Phase D — Shared context and parity lock

1. Define the fixed shared context for build, type generation, and runtime registration.
2. Lock generated constants to runtime expectations through an explicit contract check.
3. Gate: mismatch between generated outputs and runtime registration blocks release.

## Phase E — Specialist profile and governance

1. Keep one specialist profile:
   - `mcp-extensions-expert` as advisor and reviewer with evidence requirements.
2. Define review checklist: security, compatibility, metadata parity, widget safety, fallback correctness.
3. Gate: specialist sign-off recorded before execution begins.

## Phase F — Phased rollout and execution plan

1. Prepare reference MCP Apps integration flow and minimal metadata adapter.
2. Add parity and regression checks for auth metadata, tool list shaping, and adapter conversion.
3. Stage rollout: proof-of-concept, security hardening, pilot, and cleanup.
4. Gate: each stage has explicit stop/go and rollback criteria.

## Phase G — Search UI reintroduction

1. Reintroduce search widget only after Phase C-1 and Phase D are complete.
2. Build the first public search UI around the new search capability set.
3. Include full human search interface for semantic and keyword query styles, filters, ranking, and result controls.
4. Remove legacy search references from the active path.
5. Gate: search UI review confirms new search capability parity and no dependency on old search UI assumptions.

## Exit Criteria

- Mandatory and additional sources are reviewed and cited.
- MCP-first standard is the required execution path.
- Adapter boundaries are explicit, minimal, and validated.
- Widget simplification is completed before any broad or search widget reintroduction.
- Shared context parity is locked and validated.
- `securitySchemes` handling and metadata safety are validated in checks.
- A complete sequenced plan, review gates, and specialist responsibilities are ready for execution in active `.agent` plan space.

## Preserved granular details from the original draft

Phase A — Research and Constraint Capture

1. Read and summarise extension governance and lifecycle: extension identification, repository model, versioning strategy, and compatibility assumptions. Mandatory references for boundary and review handling.
2. Read MCP Apps overview and build docs: inspect `ui://` resource pattern, identify host capability negotiation and graceful degradation expectations, capture transport and testing guidance.
3. Read ext-apps repository and API docs: server helpers (`registerAppTool`, `registerAppResource`, `RESOURCE_MIME_TYPE`), app API surface (`App`, `callServerTool`, tool-result handling), and host embedding points (`app-bridge`) and interoperability notes.
4. Publish a research snapshot with risks, known unknowns, assumptions, and follow-up evidence gaps.

Phase B — Oak-Specific Design Notes

1. Map current Oak MCP tooling and transport: identify candidate tools for initial UI augmentation, safe read-only and write-like operations, and confirm first-iteration auth/control-flow constraints.
2. Define extension boundary approach: where extension support is advertised, where fallback behaviour is explicitly defined, and where capability checks hard-fail versus degrade gracefully.
3. Produce a design decision note for execution covering minimal MVP feature set, security baseline, and test strategy (at least one local host path and one external-client path). Maintain explicit MCP-first default and optional OpenAI extension notes.

Phase C — Dual-Mode Protocol Strategy (MCP-first, OpenAI optional)

1. Establish standard-first baseline: use MCP Apps standard keys and host bridge by default (`_meta.ui.*`, `ui/*` `postMessage` lifecycle, `tools/call`), with shared helper-driven tool/resource registration.
2. Add optional OpenAI extension adapter layer: add `window.openai`-only capabilities only where MCP standard lacks equivalent behaviour, with capability checks and adapter boundaries.
3. Centralise metadata shape through one compatibility adapter (`meta.ui` + `meta.openai` overlay) generated from tool/resource definitions, minimising per-tool conditionals.
4. Keep user journey stable across hosts: baseline MCP output remains intact when host-only features are unavailable.
5. Review checkpoints: no OpenAI-only assumptions in required MCP path, optional extensions gated behind detection, and clear rollback plans.

Phase D — Single Expert Specialist Profile

1. Define specialist `mcp-extensions-expert` with advisor and reviewer responsibilities.
2. Scope includes MCP extension governance interpretation, MCP Apps implementation/API use, security and protocol review, and architecture boundary review where extension touches existing server composition.
3. Evidence checks before sign-off include reviewed sources, updated capability matrix, test plan (advisory + review outcomes), and logged unresolved risks.

Phase E — Plan and Sequencing Outputs

1. Convert findings into implementation-ready roadmap: phase 0 research spike, phase 1 reference integration, phase 2 security + capability hardening, phase 3 pilot + validation, phase 4 rollout + cleanup.
2. Add acceptance gates and rollback boundaries.
3. Final handoff includes research memo, recommended MVP scope, external dependencies, and specialist checklist.
