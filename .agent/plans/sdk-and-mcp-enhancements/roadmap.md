---
name: MCP Apps Standard Migration Plan
overview: "Strategic planning anchor for the Oak MCP Apps standard migration series. Covers: reframing rationale, OpenAI coupling inventory, ADR compliance matrix, and domain dependency ordering. Executable plans for each domain are created separately when work begins. Includes a small fail-fast auth metadata invariant hardening task (C8)."
lastValidatedDate: 2026-03-05
todos:
  - id: premerge-tracks-consolidated-reference
    content: "Pre-merge prerequisite (Tracks 1a + 1b, Phases 0-5 including resilience hardening) completed 2026-02-22. Gate 3 passed."
    status: completed
  - id: adr-matrix-and-gap-mapping
    content: "ADR compliance matrix built and reviewed by architecture reviewers (Barney, Fred, Betty, Wilma). Includes ADR-024, ADR-108, ADR-123, ADR-042."
    status: completed
  - id: quality-gates-and-exit-criteria
    content: "Exit criteria, validation commands, stop/go gates, and rollback paths defined in plan."
    status: completed
  - id: auth-safety-extracted
    content: "Original standalone auth safety plan archived; C8 is now a small fail-fast metadata invariant hardening task in this roadmap."
    status: completed
  - id: c8-auth-metadata-invariant-hardening
    content: "Implement C8 auth metadata invariant hardening (build/test invariant + startup fail-fast guard with helpful errors + focused tests aligned with testing-strategy.md)."
    status: pending
  - id: chatgpt-mcp-acceptance-validation
    content: "Domain A primary task: create executable plan to validate ChatGPT acceptance of MCP-only tool metadata (_meta.ui.resourceUri) and MCP-only resource MIME (text/html;profile=mcp-app). Unblocks Domain C migration path decision."
    status: pending
  - id: domain-a-source-refresh
    content: "Domain A secondary task: refresh mandatory source list, replace broken URLs, add confidence log. Can run in parallel with acceptance validation."
    status: pending
  - id: domain-b-specialist-assessment
    content: "Gate 4: create and trial a dedicated mcp-extensions-expert profile (MCP + MCP Apps standard specialist). Treat as a low-cost experiment; keep only if it adds review signal."
    status: pending
  - id: domain-c-executable-plans
    content: "After Domain A completes: create separate executable plans for each Domain C item (host-neutral contract enforcement, widget migration, MIME migration, tool/resource metadata migration). Each plan gets TDD phases and per-task acceptance criteria."
    status: pending
  - id: domain-d-feature-backlog
    content: "After Domain C critical items complete: define additive feature backlog with explicit dependency ordering and stop/go gates."
    status: pending
isProject: false
---

# MCP Apps Standard Migration Plan

## Changelog

- **2026-03-05** (C8 invariant hardening consolidation): standalone auth safety plan archived to [archive/auth-safety-correction.plan.md](archive/auth-safety-correction.plan.md). Domain C item C8 is now a small fail-fast auth metadata invariant task in this roadmap (fail early, fail hard, with helpful remediation errors), aligned with [rules.md](../../directives/rules.md) and [testing-strategy.md](../../directives/testing-strategy.md).
- **2026-03-05** (owner direction applied): (1) Migration is now explicitly MCP-standard-only with no dual paths or fallback metadata/MIME behaviour. (2) Host-specific adaptation layer removed from Domain C/D strategy (no platform adapters, no host-mode toggles). (3) Gate 4 now requires creating and trialling `mcp-extensions-expert` as a low-cost specialist experiment. (4) ADR-115 added to the compliance matrix as a binding migration constraint.
- **2026-03-05** (all claude.feedback.md recommendations applied): (1) Strategic role formalised — this document is a planning anchor/roadmap; executable plans per domain are created separately. (2) Non-Goals section added. (3) Frontmatter todos made atomic and phase-aligned; completed todos marked. (4) Acceptance criteria deferred to per-domain executable plans (see domain-c-executable-plans todo). (5) Reframing section notes the potential ADR. (6) ADR matrix trimmed to rows with actual gaps or migration-specific actions. (7) Domain A primary vs secondary deliverables separated. (8) Domain B Gate 4 assessment note added — consider existing reviewers first. (9) C8 auth safety first draft was extracted, and is now archived/superseded by a smaller invariant task in this roadmap ([archive/auth-safety-correction.plan.md](archive/auth-safety-correction.plan.md)). (10) Evidence section condensed; coupling inventory table is authoritative.
- **2026-03-05**: Plan updated and activated. Applied all items from the [metaplan](archive/mcp-extensions-research-and-planning.metaplan.md): adapter pattern for host-specific behaviour, platform detection at startup, ChatGPT MCP Apps acceptance research task, and reframing of the plan from "OpenAI App + MCP" to "MCP Apps standard first, optional adapters". Separately: full inventory of OpenAI coupling confirmed — no separate "OpenAI App" is needed. Renamed from `mcp-extensions-research-and-planning.md`; moved to `active/`, then promoted to collection-root `roadmap.md`. Previous name: "MCP Extensions Expert Specialist Plan (Advisor + Reviewer)".

## Purpose and Value

This plan covers the migration of Oak's MCP HTTP server and SDK from OpenAI-specific coupling to the MCP Apps open standard. **One app, one open standard.** Oak builds an MCP server with MCP Apps widgets; ChatGPT and other MCP Apps hosts (Claude, Cursor, generic MCP clients) consume the same tools and resources.

Legacy concept ingestion for this plan is governed by:

- [concept-preservation-and-supersession-map.md](archive/concept-preservation-and-supersession-map.md)

Value delivered:

- Clear ownership and sequencing for SDK and HTTP MCP server teams.
- Explicit ADR compliance for MCP protocol, OAuth/security, and generator-first architecture.
- Reduced risk of stale planning assumptions through dated evidence and link-health checks.
- Host portability: a single MCP Apps standard implementation that any conforming host can render.

## Strategic Role

This document is the **planning anchor** for the MCP Apps standard migration series. It is not a task-level executable plan. Its responsibilities are:

1. Recording the reframing rationale (why MCP-standard-first; why no separate OpenAI App).
2. Providing the OpenAI coupling inventory (what needs to change and where).
3. Maintaining the ADR compliance matrix (binding constraints on all downstream plans).
4. Defining domain dependency ordering (A → B → C → D) and stop/go gates.
5. Tracking which executable plans have been created for each domain.

**Executable plans** for each domain are created separately (in `active/` or `current/`) when work on that domain begins. They own TDD phases, per-task acceptance criteria, and deterministic validation. Domain C item C8 is intentionally kept as a small roadmap task (not a standalone active plan); prior standalone draft retained for provenance in [archive/auth-safety-correction.plan.md](archive/auth-safety-correction.plan.md).

## Non-Goals

The following are explicitly out of scope for this document and the migration work it anchors:

1. **No separate "OpenAI App"**: Oak does not build a separate OpenAI App alongside the MCP server. ChatGPT is one host consuming the same MCP server.
2. **No server-side MCP SDK migration**: If `@modelcontextprotocol/sdk` already suffices for MCP transport, it is not replaced as part of this migration.
3. **No ChatGPT-only features in this migration**: Modals, file upload, Instant Checkout, and other `window.openai`-exclusive capabilities are out of scope.
4. **No host-specific adaptation layer**: No platform adapters, no dual metadata paths, no host-mode toggles, and no per-request host detection.
5. **No API schema changes**: No runtime API contract changes in this migration series.

## OpenAI App vs MCP App: The Reframing

Prior to this update the plan treated OpenAI-specific surface (metadata keys, MIME type, `window.openai.*` JS APIs) as primary. This framing was incorrect. The correct framing is:

- **MCP Apps standard is primary.** `_meta.ui.resourceUri`, `text/html;profile=mcp-app`, and the `ui/*` JSON-RPC bridge are the canonical interfaces.
- **ChatGPT is one host** that implements the MCP Apps standard. It also documents `openai/outputTemplate` as a *compatibility alias* for `_meta.ui.resourceUri` — this is ChatGPT's extension surface, not Oak's primary interface.
- **No separate "OpenAI App" concept.** Oak does not build a separate OpenAI App; it builds an MCP server with MCP Apps widgets.
- **No host-specific adaptation path.** Oak ships a single MCP-standard implementation; `window.openai.*` and OpenAI-specific metadata are removed from core surfaces as part of migration.

> **Potential ADR**: This reframing ("MCP Apps standard is primary; ChatGPT is one host; no separate OpenAI App concept; no host-specific adaptation layer") represents a binding architectural decision. Consider capturing it as a formal ADR before Domain C implementation begins.

## Foundation Recommitment

Before any phase starts, re-read and recommit to:

1. `.agent/directives/rules.md`
2. `.agent/directives/testing-strategy.md`
3. `.agent/directives/schema-first-execution.md`

First question at each decision point:

- Could it be simpler without compromising quality?

Non-negotiables for this plan:

- Generator-first/schema-first for SDK and MCP contracts.
- No compatibility-layer sprawl in core execution paths.
- No skipped quality gates.
- No runtime API contract changes in this document rewrite step.
- **MCP Apps standard is the primary and only migration target.**
- **Core code (tool handlers, resource registration, widget metadata emission) MUST remain host-neutral and MUST NOT branch on host type or storage implementation.**

## Current State Evidence (Dated)

Evidence date baseline: **5 March 2026** (updated from 23 February 2026).

**OpenAI coupling inventory** (as of 2026-03-05; authoritative — see Domain C for migration tasks):

| Layer | File | Coupling |
|-------|------|---------|
| Tool metadata (generated type) | `tool-descriptor.contract.ts` | 5 OpenAI-specific keys |
| Tool metadata (codegen emitter) | `emit-index.ts` | 5 OpenAI-specific keys emitted |
| Resource metadata | `register-resources.ts` | 4 OpenAI-specific keys |
| MIME type | `aggregated-tool-widget.ts` | `text/html+skybridge` (OpenAI convention) |
| Widget JS (tool data) | `widget-script.ts` | 5 `window.openai.*` usages |
| Widget JS (state) | `widget-script-state.ts` | 3 `window.openai.*` usages |

Additional findings (not covered by table above):

- **Widget partially simplified** (2026-02-23): CTA removed from output; `widget-cta/` source retained. Header reduced to logo/wordmark/tool-name on major tools.
- **Auth metadata invariant gap** (2026-02-23): `tool-auth-checker.ts` assumes `securitySchemes` exists — handled in Domain C item C8 as fail-fast invariant hardening (prior standalone draft archived at [archive/auth-safety-correction.plan.md](archive/auth-safety-correction.plan.md)).
- **Widget URI parity drift** (2026-02-23): local build emits `local` hash token instead of per-run hash; tracked in Domain C item C9.

## Plan Split (Agreed)

Execution split across related files:

1. Pre-merge Tracks 1a + 1b:
   - Archived:
     [widget-search-rendering.md](../semantic-search/archive/completed/widget-search-rendering.md).
   - **Status**: COMPLETE (Phases 0-5, including Phase 5
     resilience hardening — error containment, JSON.stringify
     for JS generation, delegated click handlers, four-way
     sync enforcement). Completed 2026-02-22.
2. Post-merge Track 2:
   - This file.
   - Covers research, specialist specification, refactoring backlog, and future feature backlog.

Entry condition for this file:

- Pre-merge prerequisite is satisfied (Gate 3 passed).

## Domain A - Further Research Backlog

Objective:

- Standards and host-compatibility research only, with explicit evidence and confidence scoring.

### Primary deliverable (blocking — determines Domain C migration path)

**ChatGPT MCP Apps acceptance validation** — create an executable plan (`domain-a-chatgpt-acceptance-validation.plan.md`) and deliver:

- (a) Does ChatGPT accept tool descriptors that use **only** `_meta.ui.resourceUri` (no `openai/outputTemplate`)?
- (b) Does ChatGPT accept widget resources served with **only** `text/html;profile=mcp-app` (no `text/html+skybridge`)?
- Document outcome with confidence level (High/Medium/Low) and source links.
- **If (a) and (b) confirmed**: proceed with MCP-standard-only migration (remove OpenAI-specific coupling entirely).
- **If either fails**: stop Domain C implementation and escalate to architecture review/ADR update. Do **not** introduce dual paths, fallback metadata keys, or host-specific adapters in this migration.

This validation unblocks the migration path decision. The secondary deliverables below can proceed in parallel but do not block Domain C.

### Secondary deliverables (parallel, non-blocking)

1. Capability matrix: MCP Apps standard primitives vs host-specific extensions.
2. Compatibility matrix: ChatGPT, Cursor, Inspector, and generic MCP clients.
3. Risk register: metadata portability, auth bootstrap behaviour, resource hosting assumptions.
4. Confidence log: each major claim tagged High/Medium/Low confidence with source links.

Mandatory sources:

- <https://modelcontextprotocol.io/extensions/overview>
- <https://modelcontextprotocol.io/extensions/apps/overview>
- <https://modelcontextprotocol.io/extensions/apps/build>
- <https://github.com/modelcontextprotocol/ext-apps>
- <https://modelcontextprotocol.github.io/ext-apps/api/>
- <https://developers.openai.com/apps-sdk>
- <https://developers.openai.com/apps-sdk/mcp-apps-in-chatgpt>
- <https://developers.openai.com/apps-sdk/quickstart>
- <https://developers.openai.com/apps-sdk/build/mcp-server>
- <https://developers.openai.com/apps-sdk/build/chatgpt-ui>
- <https://modelcontextprotocol.github.io/ext-apps/api/documents/Migrate_OpenAI_App.html>

Additional high-value sources:

- <https://modelcontextprotocol.io/extensions>
- <https://modelcontextprotocol.io/docs/extensions/apps>
- <https://modelcontextprotocol.github.io/ext-apps/api/documents/Quickstart.html>
- <https://modelcontextprotocol.github.io/ext-apps/api/documents/Overview.html>
- <https://modelcontextprotocol.github.io/ext-apps/api/functions/server-helpers.registerAppTool.html>
- <https://modelcontextprotocol.github.io/ext-apps/api/functions/server-helpers.registerAppResource.html>
- <https://github.com/modelcontextprotocol/ext-apps/tree/main/examples>
- <https://modelcontextprotocol.io/community/seps/2133-extensions>
- <https://github.com/modelcontextprotocol/modelcontextprotocol/pull/1865>
- <https://modelcontextprotocol.github.io/ext-apps/api/modules/app-bridge.html>
- <https://modelcontextprotocol.github.io/ext-apps/api/modules/server-helpers.html>
- <https://modelcontextprotocol.github.io/ext-apps/api/interfaces/server-helpers.McpUiAppToolConfig.html>
- <https://modelcontextprotocol.github.io/ext-apps/api/types/server-helpers.ResourceMetadata.html>

Note: handler context details are documented in server-helpers API pages, centred on `registerAppTool`.
Link health checked on 5 March 2026.

## Domain B - Expert Sub-Agent Specification

> **Gate 4 deliverable — create specialist profile**: Define and trial a dedicated `mcp-extensions-expert` reviewer focused on MCP + MCP Apps standard compliance, host-neutral architecture, and security invariants. Keep it if signal quality is strong; retire it if it adds no value.

Specialist identifier:

- `mcp-extensions-expert`

Role:

- Combined advisor and reviewer for MCP extensions architecture, host compatibility, and security boundary integrity.

Inputs:

1. Active plan document.
2. Relevant SDK and HTTP server source files.
3. ADR compliance matrix and gate outcomes.
4. Source evidence bundle from Domain A.

Outputs:

1. Advisory memo with recommended boundary decisions.
2. Review report with findings ranked by severity.
3. Gate recommendation: pass, pass-with-conditions, or block.

Escalation criteria:

1. Any conflict between accepted ADRs and implementation proposal.
2. Any proposal introducing host lock-in in the core MCP path.
3. Any auth or metadata behaviour that can break OAuth bootstrap.
4. Any generator/runtime parity drift with release impact.

Review checklist:

1. MCP-first portability.
2. Security and auth correctness.
3. Metadata contract clarity.
4. Widget safety and data-minimisation.
5. Testability and deterministic validation.

## Domain C - Future Refactoring Backlog

Objective:

- Architecture clean-up and safety corrections after Domain A and Domain B gates pass (except C8, which is already extracted and can run immediately).

### Deployment mode assumption

**This plan assumes one host-neutral MCP deployment model.** The same MCP-standard contract is served to all hosts. No host-mode environment toggle (for example `OAK_MCP_PLATFORM`) and no host detection logic are introduced in this migration.

### Host-neutral ownership

Keep migration implementation in existing workspace boundaries:

- SDK codegen emits canonical MCP-standard contracts.
- HTTP app consumes canonical contracts and serves canonical MCP Apps resources.
- No host-specific adapter package and no transport-edge host-specific projection layer is introduced.

### Internal dependency ordering within Domain C

Items MUST be implemented in this order:

1. **Infrastructure hardening** (items C1, C2): enforce host-neutral boundaries and remove compatibility toggles. Nothing else starts until these are in place.
2. **SDK contracts** (item C5): Codegen emitter update and tool descriptor contract. SDK stays single source of truth (ADR-030).
3. **App runtime** (items C4, C6): MIME migration and resource metadata migration.
4. **Client UI** (items C3, C10): Widget JS migration. This runs last because it depends on the correct MCP bridge being in place at the app layer. For now we are keeping that UI minimal with branding on key entry points.

Items C7 (metadata contract hardening), C8 (auth safety), and C9 (URI parity) can run independently of the migration sequence above but must complete before Domain D.

### Refactor backlog items

C1. **Host-neutral boundary enforcement**:

- Application code (tool handlers, resource registration, widget metadata emission) MUST NOT branch on host type and MUST emit canonical MCP-standard metadata through host-neutral helpers.
- No compatibility layer, host adapter, or dual metadata path in core execution.
- **Critical constraint**: no host string or host enum is passed into domain logic (`if (platform === 'chatgpt')` is forbidden in migration scope).
- Rationale: one canonical MCP contract, minimal moving parts, deterministic behaviour.
C2. **Platform toggle and detection removal**:
- Do not introduce `OAK_MCP_PLATFORM` for metadata or widget behaviour.
- Do not add request-driven or env-driven host branching for MCP Apps output.
- If any host toggle/projection code appears during migration, delete it rather than preserving it behind flags.
- Add regression checks to ensure host-neutral output remains canonical.
C3. **Widget client-side migration** (largest item, runs last in Domain C):
- Rewrite `window.openai.*` usage to the MCP Apps SDK `App` class pattern and JSON-RPC bridge (`ui/initialize`, `ui/notifications/tool-input`, `ui/notifications/tool-result`).
- Files: `apps/oak-curriculum-mcp-streamable-http/src/widget-script.ts` (5 usages), `apps/oak-curriculum-mcp-streamable-http/src/widget-script-state.ts` (3 usages).
- **Timing/sequencing**: MCP Apps SDK `connect()` is async. Widget render MUST NOT run before `connect()` resolves and tool data is delivered via `app.ontoolresult`. Explicit sequencing and tests are required.
- **`widgetState`/`setWidgetState` replacement**: `window.openai.widgetState` and `window.openai.setWidgetState` have no MCP Apps equivalent. Before migrating, design and validate an alternative mechanism. Prefer `sessionStorage` or in-memory state for UI-only data (e.g. scroll position). If `localStorage` is used, the following constraints apply: store minimal primitives only; namespace keys by app context; add TTL/expiry; schema-validate on read; NEVER store auth tokens, session data, tool result payloads, or any PII in browser storage. Sandbox isolation does not substitute for storage discipline. This must be specified and tested before the migration proceeds.
- End state: no `window.openai.*` usage remains in the runtime widget code path.
C4. **MIME type migration**:
- `AGGREGATED_TOOL_WIDGET_MIME_TYPE` in `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts`: migrate from `text/html+skybridge` to `text/html;profile=mcp-app`.
- Conditional on Domain A validation outcome.
- **Rollout strategy**: use a Vercel preview deployment (not a single all-or-nothing cutover). Validate ChatGPT accepts the new MIME in a pre-production environment before full rollout.
- **Rollback procedure**: rollback is deployment-level (revert to previous release artefact) if acceptance/regression checks fail. No dual MIME runtime path is retained.
- **Single-path MIME note**: each MCP resource URI has one MIME type; migration keeps one canonical MIME path.
C5. **Tool metadata key migration**:
- Codegen emitter (`packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/emit-index.ts`): migrate from five `openai/*` keys to `_meta.ui.resourceUri` (MCP standard).
- Tool descriptor contract (`packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/contract/tool-descriptor.contract.ts`): replace OpenAI-only keys with MCP standard keys; types and type-guards flow from SDK compile time per the cardinal rule.
- **Strict contract rule**: SDK emits MCP-standard metadata only. No runtime or generator projection of host-specific metadata aliases.
- **Security invariant**: `securitySchemes`, `annotations`, and tool input schemas are canonical SDK-generated fields and must remain untouched by migration.
C6. **Resource metadata key migration**:
- `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts`: migrate from four `openai/*` keys (`openai/widgetCSP`, `openai/widgetPrefersBorder`, `openai/widgetDescription`, `openai/widgetDomain`) to MCP Apps standard equivalents per the ext-apps spec.
- Include explicit CSP field mapping validation (e.g. `resource_domains` vs `resourceDomains` shape differences).
- **Absent-CSP security stance**: if MCP standard CSP fields are absent or invalid, the implementation MUST either fail the release gate or resolve to a restrictive-only default policy. A permissive fallback (allowing all origins) is not acceptable.
- Use one canonical MCP Apps CSP model; do not emit host-specific alias fields.
- Conditional on Domain A validation and MCP standard resource metadata spec review.
C7. **Metadata contract hardening**:
- Satisfied when C5 and C6 are complete and the core `ToolDescriptor` type contains only MCP standard keys.
C8. **Auth metadata invariant hardening** (small task; no standalone active plan).
- **Fail-fast invariant**: validate auth metadata at the earliest boundary (descriptor load/bootstrap), before tool handler registration.
  - `securitySchemes` must be present, array-shaped, and semantically valid for every generated and aggregated tool descriptor.
  - Any missing/empty/malformed `securitySchemes` or descriptor lookup failure MUST terminate startup immediately (no fallback path, no permissive continuation).
- **Fail fast, early and hard with helpful errors** (per [rules.md](../../directives/rules.md)):
  - Error must name the failing tool, the invalid field/value shape, and why startup was blocked.
  - Error must include remediation guidance (for example: run `pnpm sdk-codegen`; verify generated descriptor contract; fix aggregated definition source).
  - Logging-only behaviour is insufficient; invalid startup state must not continue.
- **Testing-strategy alignment** (per [testing-strategy.md](../../directives/testing-strategy.md)):
  - Unit tests: pure invariant evaluator for valid/invalid `securitySchemes` decision paths (no mocks).
  - Integration tests: startup/bootstrap path aborts on invalid descriptor fixtures using simple injected fakes (no `vi.mock`, no global-state mutation).
  - All tests follow RED → GREEN → REFACTOR and are named by level (`*.unit.test.ts`, `*.integration.test.ts`).
- Evidence of current gap: `tool-auth-checker.ts` calls `.securitySchemes.some(...)` without a null guard, so invariant violations currently fail too late and opaquely.
C9. **URI parity hardening**:
- Enforce generated/runtime widget URI parity checks.
C10. **Renderer stack simplification** (runs with C3):
  - CTA source code (`widget-cta/`) to be deleted when context-grounding resource is implemented.
  - Remaining renderer registry complexity to be assessed after Domain A research.

Public API/interface/type implications (plan-level, future tasks only):

1. Immediate rewrite step: no runtime API change.
2. Likely future interface changes:
   - `ToolDescriptor['_meta']` evolves from OpenAI-only keys to MCP Apps standard keys only.
   - Core contract removes mandatory OpenAI widget assumptions.
   - Auth metadata invariant is enforced at startup with fail-fast remediation errors for invalid `securitySchemes`.
3. These are future implementation tasks and are not performed in this rewrite.

Dependency order:

- Domain A complete -> Domain B complete -> Domain C starts (in the internal order: C1/C2 -> C5 -> C4/C6 -> C3/C10; C7/C8/C9 independent).

## Domain D - Future Feature-Creation Backlog

Objective:

- Additive feature work only after Domains A to C pass all required gates.

Feature backlog candidates:

1. Context-grounding resource (`curriculum://context-grounding`) as a single-request convenience for clients that want ontology + help content up front (CTA removal complete, ADR-061 superseded).
2. Pedagogical context improvements (`get-started` tool, canonical glossary, MCP agent vocabulary overhaul) — extracted to [improve-pedagogical-context.plan.md](archive/completed/improve-pedagogical-context.plan.md). Note: this is about the agent-facing vocabulary in the MCP response, not the search synonym infrastructure.
3. **Standard-first MCP Apps capability expansion**: any new capability must target MCP Apps standard primitives first and keep the core contract host-neutral.
4. Search UX reintroduction aligned with new search backend and hard safety controls.
5. Operational hardening and observability improvements for MCP-standard flows.

Feature readiness conditions:

1. Pre-merge Tracks 1a and 1b complete (satisfied 2026-02-22).
2. ADR matrix gaps owned and scheduled.
3. Refactor backlog critical items complete.
4. Security sign-off from specialist checklist.

## ADR Compliance Matrix

Policy:

- Accepted ADRs are binding.
- Superseded ADRs are context checks only.
- Proposed ADRs are context only.

Matrix includes only ADRs with actual gaps or migration-specific binding actions. ADRs with no confirmed gap and generic "preserve X" actions are omitted from this table; they remain binding but require no special tracking for this migration.

| ADR | Status | Binding Rule | Evidence | Gap | Planned Action | Gate |
| --- | --- | --- | --- | --- | --- | --- |
| ADR-005 | Accepted | Automatic PII scrubbing | `docs/architecture/architectural-decisions/005-automatic-pii-scrubbing.md` | Widget state migration to browser storage could introduce PII storage risk | Never store auth tokens, session data, or tool output in widget browser storage (Domain C item C3) | Gate 3 |
| ADR-024 | Accepted | Dependency Injection pattern for boundary wiring | `docs/architecture/architectural-decisions/024-dependency-injection-pattern.md` | Migration could reintroduce host-specific branching in core paths | Use DI for runtime dependencies only; no host adapters and no platform conditionals in domain logic | Gate 2 |
| ADR-026 | Accepted | Code generation remains OpenAPI-driven | `docs/architecture/architectural-decisions/026-openapi-code-generation-strategy.md` | Migration touches codegen emitter; must remain generator-first | All metadata evolution in generator templates; no out-of-band key additions | Gate 2 |
| ADR-029 | Accepted | No manual API data in MCP | `docs/architecture/architectural-decisions/029-no-manual-api-data.md` | Manual host-specific metadata injection could bypass canonical contract generation | Emit MCP-standard metadata from codegen only; no runtime host-key injection | Gate 2 |
| ADR-030 | Accepted | SDK is single source of truth | `docs/architecture/architectural-decisions/030-sdk-single-source-truth.md` | Migration touches tool descriptor contract | Codegen emitter migrates to MCP standard; no out-of-band contract authoring | Gate 2 |
| ADR-038 | Accepted | Compile-time embedded validation | `docs/architecture/architectural-decisions/038-compilation-time-revolution.md` | Runtime metadata projections could become a second contract-authoring path | All contract evolution happens in generator templates; no runtime metadata contract transformations | Gate 2 |
| ADR-042 | Accepted | `packages/runtime-adapters/` scope is runtime platform (Node/Workers) | `docs/architecture/architectural-decisions/042-runtime-adapters-folder.md` | Risk of scope drift by introducing host adapters into runtime-adapters | Keep MCP Apps migration host-neutral and do not introduce MCP host adapters in `packages/runtime-adapters/` | Gate 2 |
| ADR-043 | Accepted | CI/build determinism for generated artefacts | `docs/architecture/architectural-decisions/043-codegen-in-build-and-ci.md` | Potential parity drift in widget URI handling | Add explicit parity check backlog item (Domain C item C9) | Gate 6 |
| ADR-046 | Accepted | Single `/mcp` transport with universal tools | `docs/architecture/architectural-decisions/046-openai-connector-facades-in-streamable-http.md` | ADR-046 uses OpenAI-first framing; post-migration primary surface is MCP-standard — documentation debt | Preserve single-surface assumption; ADR-046 framing to be updated as a post-migration documentation task | Gate 2 |
| ADR-054 | Accepted | Tool-level auth error interception | `docs/architecture/architectural-decisions/054-tool-level-auth-error-interception.md` | Metadata/runtime refactor could accidentally bypass auth interception path | Preserve interception path during refactor; no migration step may bypass or shadow auth errors | Gate 3 |
| ADR-057 | Accepted | Selective auth for approved public resources | `docs/architecture/architectural-decisions/057-selective-auth-public-resources.md` | Widget URI and public resource list must stay aligned during MIME/metadata migration | Keep URI parity checks and public list tests during Domain C | Gate 3 |
| ADR-058 | Accepted | Model-visible context grounding design | `docs/architecture/architectural-decisions/058-context-grounding-for-ai-agents.md` | Widget JS migration could inadvertently remove model-facing hints | Keep model-facing hints outside widget payload; verify they are preserved in MCP Apps bridge migration | Gate 3 |
| ADR-071 | Accepted | Code-gen widget URI cache-busting | `docs/architecture/architectural-decisions/071-widget-uri-cache-busting-simplification.md` | Current local hash behaviour diverges from ADR wording | Add explicit local/prod parity decision in Domain D (Domain C item C9) | Gate 5 |
| ADR-108 | Accepted | SDK workspace decomposition; one-way dependency invariant | `docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md` | Migration crosses two workspaces: WS2 (`oak-sdk-codegen`) and WS4 (HTTP app); generation must not import from runtime | Codegen workspace generates canonical host-neutral artefacts only; runtime consumes generated output | Gate 2 |
| ADR-113 | Accepted | Auth for all MCP methods except defined public routes | `docs/architecture/architectural-decisions/113-mcp-spec-compliant-auth-for-all-methods.md` | Tool auth checker defensive gap — assumes `securitySchemes` exists | Implement Domain C item C8 fail-fast auth metadata invariant hardening in this roadmap (prior standalone draft archived for provenance) | Gate 3 |
| ADR-115 | Accepted | Proxy OAuth Authorisation Server remains required for Cursor and legacy platform compatibility | `docs/architecture/architectural-decisions/115-proxy-oauth-as-for-cursor.md` | MCP Apps migration could regress proxy OAuth routes/metadata behaviour | Preserve `/oauth/*` proxy behaviour and metadata rewriting; include regression checks in downstream implementation plans | Gate 3 |
| ADR-116 | Accepted | resolveEnv pipeline architecture | `docs/architecture/architectural-decisions/116-resolve-env-pipeline-architecture.md` | Host-mode toggles could be introduced ad hoc during migration | Keep runtime config in resolveEnv pipeline; do not add host-mode environment switches for metadata/widget behaviour | Gate 6 |
| ADR-123 | Accepted | MCP Server Primitives Strategy | `docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md` | Migration touches tool metadata (C5) and resource metadata (C6); primitive control model must be preserved | Metadata migration must not alter which primitives expose which capabilities or their control model | Gate 5 |

**Superseded ADRs** (context checks only — not rows): ADR-061 (widget CTA — do not reintroduce), ADR-056 (discovery auth bypass — anti-pattern reference only), ADR-037 (dynamic dispatch — use compile-time approach from ADR-038), ADR-016 (dotenv — use resolveEnv pipeline from ADR-116), ADR-017 (Consola logging — use OTel logging from ADR-051).

## Gates, Stop/Go, Rollback

Gate 0 - Foundation recommitment complete:

- Stop if foundation directives are not re-read and acknowledged.
- Go when recommitment and first-question checks are recorded.

Gate 1 - Source hygiene complete:

- Stop on any broken source URL.
- Go when all listed URLs return 200, 301, or 302.

Gate 2 - ADR matrix complete:

- Stop if any required ADR is missing or has no owner/action/gate.
- Go when all required ADR rows are present with evidence and planned action.

Gate 3 - Pre-merge prerequisite complete:

- Stop if Tracks 1a and 1b are not complete (including Phase 5 resilience hardening).
- Go when the consolidated pre-merge plan is explicitly marked ready (all phases complete).
- Rollback: return this file to blocked state if pre-merge scope reopens.
- **Current status**: PASSED — all phases (0-5) complete, 2026-02-22.

Gate 4 - Specialist profile complete:

- Stop if `mcp-extensions-expert` profile is missing scope, escalation criteria, or review checklist.
- Go when `mcp-extensions-expert` is created and a lightweight trial invocation has been completed and recorded.

Gate 5 - Backlog separation complete:

- Stop if refactor and feature work are mixed or unordered.
- Go when Domain C and Domain D are dependency-ordered and distinct.
- Rollback: return feature items to blocked status and reopen Domain C tasks.

Gate 6 - Quality and exit readiness complete:

- Stop if validation commands or exit criteria are incomplete.
- Go when quality section and exit criteria are fully checkable.

## Quality Gates and Validation Commands

Document integrity:

```bash
pnpm markdownlint:root
```

Link health check over all URLs in this plan (allow 200/301/302 only):

```bash
node - <<'NODE'
const fs = require('fs');
const cp = require('child_process');
const file = '.agent/plans/sdk-and-mcp-enhancements/roadmap.md';
const rawUrls = fs.readFileSync(file, 'utf8').match(/https?:\/\/[^\s)]+/g) || [];
const urls = [...new Set(rawUrls.map((url) => url.replace(/[>.,;]+$/g, '')))];
const bad = [];
for (const url of urls) {
  const code = cp.execSync(`curl -I -L -o /dev/null -s -w "%{http_code}" --connect-timeout 5 --max-time 15 ${JSON.stringify(url)}`)
    .toString()
    .trim();
  if (!['200', '301', '302'].includes(code)) bad.push({ url, code });
}
if (bad.length > 0) {
  console.error(JSON.stringify(bad, null, 2));
  process.exit(1);
}
console.log(`OK: ${urls.length} urls validated`);
NODE
```

ADR coverage checks:

```bash
rg -n "^\| ADR-" .agent/plans/sdk-and-mcp-enhancements/roadmap.md
```

Post-prerequisite quality checks (planned future-code readiness):

```bash
rg -n "securitySchemes" apps/oak-curriculum-mcp-streamable-http/src/tool-auth-checker.ts

rg -n "WIDGET_URI|BASE_WIDGET_URI|openai/outputTemplate|text/html\+skybridge|window\.openai" \
  packages/sdks/oak-sdk-codegen/src \
  packages/sdks/oak-sdk-codegen/code-generation \
  apps/oak-curriculum-mcp-streamable-http/src
```

Future-code readiness checks to preserve in downstream implementation plans:

1. Metadata contract tests for MCP-standard core only (no host projections).
2. Auth metadata invariant tests: invalid `securitySchemes` aborts startup immediately with helpful remediation errors.
3. URI parity tests for generated and runtime widget URI alignment.
4. Regression checks ensuring no host-mode env toggles or runtime host-specific metadata projections are introduced.
5. MCP-standard MIME and metadata acceptance tests against ChatGPT (manual or integration).

## Risks and Mitigations

| Risk | Impact | Mitigation | Owner |
| --- | --- | --- | --- |
| Scope bleed from pre-merge into post-merge plan | Delays and ownership confusion | Pre-merge scope complete and archived; gate satisfied | Plan owner |
| Reintroduction of broken references | Research drift and weak evidence | Keep dated link-health command in quality gates | Research owner |
| ADR omissions | Hidden architecture conflicts | Use explicit ADR matrix with required list and gate ownership | Architecture owner |
| Host lock-in in core path | Reduced portability | Keep MCP-standard-only baseline and host-neutral boundaries; Domain C items C1/C2 | Specialist reviewer |
| ChatGPT rejects MCP-only metadata or MIME | Migration blocked | Domain A mandatory validation task; if rejected, stop and escalate via ADR path (no dual runtime path) | Research owner |
| `window.openai.*` migration breaks ChatGPT rendering during transition | Live service disruption | Domain C item C3: staged rollout in preview, explicit acceptance checks, deployment rollback if needed | Widget owner |
| Auth behaviour regression | OAuth bootstrap failures | Preserve ADR-113 and ADR-115 constraints in refactor backlog; Domain C item 8 | Security owner |
| Generator/runtime drift | Release-time widget or metadata failures | Add parity checks and gate before feature rollout | SDK owner |
| Accidental reintroduction of host-mode toggles | Contract drift and hidden dual paths | Guardrails in Domain C item C2 + regression checks in quality gates | Bootstrap owner |
| `widgetState`/`setWidgetState` have no MCP Apps equivalent | Scroll persistence breaks on full migration | Design and validate alternative mechanism (e.g. localStorage) in ChatGPT sandbox before removing `window.openai` state calls; explicit task in Domain C item C3 | Widget owner |
| MIME migration single cutover | Production disruption if ChatGPT rejects `text/html;profile=mcp-app` | Phased rollout (staged deploy), deployment rollback if checks fail, pre-production validation before full cutover (Domain C item C4) | Plan owner |
| MCP Apps async `connect()` vs sync widget assumptions | Empty or incorrect initial render | Define and test handler registration sequencing and render timing before migrating (Domain C item C3) | Widget owner |
| Pressure to introduce dual metadata/MIME paths | Increased complexity and contract ambiguity | Explicitly prohibited by this roadmap; escalated architecture review required for any exception | Architecture owner |
| CSP field mapping shape differences (`resource_domains` vs `resourceDomains`) | Wrong CSP format breaks widget loading | Add explicit CSP field mapping validation and tests when migrating resource metadata (Domain C item C6) | Widget owner |

## Exit Criteria

1. Frontmatter todos reset to realistic states and include required ids.
2. `lastValidatedDate` is current.
3. Document structure follows required section order.
4. Domain A to D are explicitly separated with dependency ordering.
5. Source list refreshed with broken links replaced.
6. One-line dated link-health note included.
7. ADR matrix includes all required binding and context ADRs with evidence and gates.
8. Public API/interface implications are stated as future tasks only.
9. Quality gates and deterministic validation commands are present.
10. Stop/go and rollback logic is explicitly documented.
11. Pre-merge prerequisite (Tracks 1a + 1b) is complete and archived; this file stays post-merge only.
12. ChatGPT MCP Apps acceptance validation task is present in Domain A.
13. Domain C explicitly prohibits host-specific adapters, dual paths, and host-mode detection toggles.
14. Domain D item 3 keeps capability expansion MCP-standard-first and host-neutral.
15. OpenAI coupling inventory is present in Current State Evidence.
16. ADR-024, ADR-108, ADR-115, ADR-123, and ADR-042 are present in the compliance matrix.
17. Domain C deployment mode assumption (single host-neutral MCP path) is explicitly stated.
18. Domain C internal dependency ordering (C1/C2 -> C5 -> C4/C6 -> C3/C10) is explicitly stated.
19. Widget state replacement (`widgetState`/`setWidgetState`) and MIME rollout/rollback strategy are in Domain C.
20. MCP-only metadata contract (SDK generates canonical MCP metadata; no host-specific projection layer) is explicit in Domain C item C5.

## Assumptions and Defaults

1. Date baseline for this review is 5 March 2026.
2. MCP and security ADR review treats accepted ADRs as binding and superseded ADRs as context.
3. Widget prerequisite work (Tracks 1a and 1b) is complete and archived.
4. `/mcp` remains the single transport surface.
5. Public resource auth bypass remains constrained to ADR-057 and ADR-113 scope only.
6. Generator-first/schema-first remains non-negotiable for SDK and MCP contract work.
7. ChatGPT implements MCP Apps standard (confirmed via official docs, 2026-03-05). Exact acceptance of MCP-only metadata and MIME still requires validation (Domain A task).
8. No separate "OpenAI App" concept permitted. Oak builds one MCP server, to the open MCP-App Extension specification; hosts consume it.
9. ADR-115 proxy OAuth behaviour remains required and must stay operational throughout migration.
