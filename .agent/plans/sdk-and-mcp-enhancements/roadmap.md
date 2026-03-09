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
  - id: chatgpt-mcp-acceptance-validation
    content: "Domain A primary validation: ChatGPT accepts _meta.ui.resourceUri (openai/outputTemplate is a legacy alias) and text/html;profile=mcp-app. Answered with high confidence by mcp-apps-support.research.md (2026-03-05)."
    status: completed
  - id: domain-a-source-refresh
    content: "Domain A source research: mcp-apps-support.research.md documents the MCP Apps standard, ChatGPT/Claude/Gemini compatibility matrix, CSP model, and SDK surfaces (dated 2026-03-05). Link health checked."
    status: completed
  - id: reframing-adr
    content: "Write ADR: MCP Apps standard is primary; ChatGPT is one host; no separate OpenAI App; no host-specific adaptation layer in core Oak code. Required before Domain C implementation begins (Gate 2)."
    status: pending
  - id: domain-b-specialist-assessment
    content: "Gate 4: adopted and trialled the existing mcp-reviewer as the MCP Apps migration specialist of record, with the four Oak MCP Apps skills explicitly linked from the reviewer and the plans. Trial completed 2026-03-07."
    status: completed
  - id: c8-auth-metadata-invariant-hardening
    content: "Implement C8 auth metadata invariant hardening (build/test invariant + startup fail-fast guard with helpful errors + focused tests aligned with testing-strategy.md)."
    status: pending
  - id: domain-c-executable-plans
    content: "After reframing ADR is written: create separate executable plans for each Domain C item (C1/C2 host-neutral enforcement, C5 tool metadata migration, C4/C6 MIME and resource metadata migration, C3/C10 widget migration). Each plan gets TDD phases and per-task acceptance criteria. Use ext-apps/server helpers (registerAppTool, registerAppResource) as the migration vehicle."
    status: pending
  - id: domain-d-feature-backlog
    content: "After Domain C critical items complete: define additive feature backlog with explicit dependency ordering and stop/go gates."
    status: pending
isProject: false
---

# MCP Apps Standard Migration Plan

**Status**: 🟢 Domain A complete · specialist alignment complete · ADR pending · Domain C not started
**Last Updated**: 2026-03-07

---

## Changelog

- **2026-03-07** (specialist and plan alignment):
  (1) Active execution plan created at [active/replace-openai-app-with-mcp-app-infrastructure.execution.plan.md](active/replace-openai-app-with-mcp-app-infrastructure.execution.plan.md) so the migration has a plainly named entry point.
  (2) Domain B reframed around the existing `mcp-reviewer`; no duplicate MCP specialist profile will be created.
  (3) The Oak MCP Apps skill chain is now explicit in the specialist-review and migration-planning docs: `mcp-migrate-oai`, `mcp-create-app`, `mcp-add-ui`, and `mcp-convert-web`.
  (4) Gate 4 passed by trialling `mcp-reviewer` on the specialist/plan alignment changes.
  (5) The oak-preview MCP snagging plan was promoted from `current/` to `active/`
      with Phase 1 complete, making it the active standalone entry point for the
      deploy-safe snagging workstream.
- **2026-03-05** (Claude reviewer takeover — all `claude.roadmap-review.md` recommendations applied):
  (1) Domain A marked complete — `mcp-apps-support.research.md` answers both validation questions with high confidence.
  (2) Reframing ADR added as the first pending executable todo (required before Domain C).
  (3) `@modelcontextprotocol/ext-apps` `^1.2.0` is declared across all relevant workspaces — `registerAppTool`/`registerAppResource`/`getUiCapability` are now the canonical migration path for C4/C5/C6.
  (4) `_meta.ui.domain` analysis: only needed if the widget makes direct cross-origin `fetch()` calls; if all data flows through the MCP bridge, the field is not required — noted in C6.
  (5) Status header, Execution Order, Phase Details, Documentation Synchronisation Requirement, Gate-to-Domain mapping, and Related Documents sections added (template compliance).
  (6) Source URL list removed — superseded by research artefact reference.
  (7) Exit criteria trimmed to six phase-level conditions.
  (8) Domain B note updated: low-cost experiment framing preserved.
- **2026-03-05** (C8 invariant hardening consolidation): standalone auth safety plan archived to [archive/auth-safety-correction.plan.md](archive/auth-safety-correction.plan.md). Domain C item C8 is now a small fail-fast auth metadata invariant task in this roadmap.
- **2026-03-05** (owner direction applied): Migration is explicitly MCP-standard-only with no dual paths or fallback metadata/MIME behaviour. No platform adapters, no host-mode toggles. Gate 4 initially moved toward a separate MCP Apps specialist experiment (superseded 2026-03-07 by adoption of the existing `mcp-reviewer`). ADR-115 added to compliance matrix.
- **2026-03-05** (all initial `claude.feedback.md` recommendations applied): Strategic role formalised; non-goals section added; frontmatter todos made atomic; ADR matrix trimmed; Domain A primary/secondary deliverables separated.
- **2026-03-05**: Plan activated and renamed from `mcp-extensions-research-and-planning.md`; moved to collection-root `roadmap.md`.

---

## Purpose and Value

Migration of Oak's MCP HTTP server and SDK from OpenAI-specific coupling to the MCP Apps open standard. **One app, one open standard.** Oak builds an MCP server with MCP Apps widgets; ChatGPT, Claude, and other MCP Apps hosts consume the same tools and resources.

Value delivered:

- Clear ownership and sequencing for SDK and HTTP MCP server teams.
- Explicit ADR compliance for MCP protocol, OAuth/security, and generator-first architecture.
- Host portability: a single MCP Apps standard implementation that any conforming host can render.

---

## Strategic Role

This document is the **planning anchor** for the MCP Apps standard migration series. Its responsibilities are:

1. Recording the reframing rationale (why MCP-standard-first; why no separate OpenAI App).
2. Providing the OpenAI coupling inventory (what needs to change and where).
3. Maintaining the ADR compliance matrix (binding constraints on all downstream plans).
4. Defining domain dependency ordering and stop/go gates.
5. Tracking which executable plans have been created for each domain,
   including the active umbrella entry point for the migration.

**Executable plans** for each domain are created separately (in `active/` or
`current/`) when work on that domain begins. The current migration entry point
is [active/replace-openai-app-with-mcp-app-infrastructure.execution.plan.md](active/replace-openai-app-with-mcp-app-infrastructure.execution.plan.md).
These plans own TDD phases, per-task acceptance criteria, and deterministic
validation. Domain C item C8 is intentionally kept as a small roadmap task (not
a standalone active plan); prior standalone draft retained for provenance in
[archive/auth-safety-correction.plan.md](archive/auth-safety-correction.plan.md).

---

## Non-Goals

1. **No separate "OpenAI App"**: ChatGPT is one host consuming the same MCP server.
2. **No server-side MCP SDK migration**: `@modelcontextprotocol/sdk` is not replaced.
3. **No ChatGPT-only features**: Modals, file upload, Instant Checkout, and other `window.openai`-exclusive capabilities are out of scope.
4. **No host-specific adaptation layer**: No platform adapters, no dual metadata paths, no host-mode toggles, no per-request host detection.
5. **No API schema changes**: No runtime API contract changes in this migration series.
6. **No stdio server changes**: This migration applies exclusively to `apps/oak-curriculum-mcp-streamable-http`. The stdio server (`apps/oak-curriculum-mcp-stdio`) has no MCP Apps surface and is not in scope.

---

## Documentation Synchronisation Requirement

No domain can be marked complete until documentation updates are handled for:

1. `docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
2. `.agent/practice-core/practice.md`
3. Any additionally impacted ADRs or `/docs/` pages

Record updates (or explicit no-change rationale) before closing each domain.
Run `/jc-consolidate-docs` before closing Domain C.

---

## OpenAI App vs MCP App: The Reframing

Prior to this update the plan treated OpenAI-specific surface (metadata keys, MIME type, `window.openai.*` JS APIs) as primary. The correct framing is:

- **MCP Apps standard is primary.** `_meta.ui.resourceUri`, `text/html;profile=mcp-app`, and the `ui/*` JSON-RPC bridge are the canonical interfaces.
- **ChatGPT is one host** that implements the MCP Apps standard. `openai/outputTemplate` is a *compatibility alias* for `_meta.ui.resourceUri` — ChatGPT's extension surface, not Oak's primary interface.
- **No separate "OpenAI App" concept.** Oak does not build a separate OpenAI App; it builds an MCP server with MCP Apps widgets.
- **No host-specific adaptation path.** `window.openai.*` and OpenAI-specific metadata are removed from core surfaces as part of migration.

> **ADR required** (todo: `reframing-adr`): this decision is binding and must be captured as a formal ADR before Domain C implementation begins. The decision is already made and reflected throughout this document; the ADR codifies it as the architectural source of truth.

---

## Foundation Recommitment

Before any domain starts, re-read and recommit to:

1. `.agent/directives/principles.md`
2. `.agent/directives/testing-strategy.md`
3. `.agent/directives/schema-first-execution.md`

First question at each decision point: **could it be simpler without compromising quality?**

Non-negotiables:

- Generator-first/schema-first for SDK and MCP contracts.
- No compatibility-layer sprawl in core execution paths.
- No skipped quality gates.
- **MCP Apps standard is the primary and only migration target.**
- **Core code MUST remain host-neutral and MUST NOT branch on host type.**

---

## Execution Order

```text
Domain A: Research                ✅ COMPLETE (mcp-apps-support.research.md)
Domain B: MCP specialist adoption ✅ COMPLETE (Gate 4 passed)
  reframing-adr                   ⏳ PENDING (required before C; Gate 2)
Domain C: Refactoring backlog     ⏳ BLOCKED on A complete + ADR written
  C8: Auth invariant hardening    ⏳ PENDING (independent; can run now)
Domain D: Feature backlog         ⏳ BLOCKED on C critical items
```

Parallel deploy-readiness snagging is tracked separately at
[active/oak-preview-mcp-snagging.execution.plan.md](active/oak-preview-mcp-snagging.execution.plan.md).
That plan runs independently of the Domain A-D migration sequence and must not
absorb the widget/App migration work owned by Domain C.

Parallel MCP contract work is also tracked separately at
[current/output-schemas-for-mcp-tools.plan.md](current/output-schemas-for-mcp-tools.plan.md).
That plan improves MCP `outputSchema` truthfulness across the tool surface and
can progress independently of the Domain A-D migration sequence.

---

## Phase Details

### Domain A — Research (COMPLETE)

- **Research artefact**: [mcp-apps-support.research.md](mcp-apps-support.research.md)
- **Done when**: ✅ Both validation questions answered with high confidence; source list health checked.
- **Outcome**: ChatGPT accepts `_meta.ui.resourceUri` as primary (openai/outputTemplate is a legacy alias). `text/html;profile=mcp-app` is the canonical MIME type. Migration path: MCP-standard-only, no dual paths.

### Domain B — MCP Specialist Alignment (COMPLETE)

- **Executable**: trial invocation of the existing `mcp-reviewer` on migration
  planning and/or implementation-review work.
- **Done when**: ✅ The reviewer and plans agree on `mcp-reviewer` as the
  specialist of record, the skill chain is explicit, and a trial invocation was
  recorded on 2026-03-07.
- **Dependencies**: none; can run in parallel with ADR writing.

### Reframing ADR (PENDING — blocks Domain C)

- **Done when**: ADR written, accepted, cross-referenced in roadmap and relevant implementation plans.
- **Dependencies**: Domain A ✅

### Domain C — Refactoring Backlog (BLOCKED)

- **Executable plans**: one per C-item group, promoted from the active umbrella
  plan [active/replace-openai-app-with-mcp-app-infrastructure.execution.plan.md](active/replace-openai-app-with-mcp-app-infrastructure.execution.plan.md)
  when ADR is accepted.
- **Done when**: all C-items complete, all quality gates pass, no OpenAI-specific surface remains in core paths.
- **Dependencies**: Domain A ✅, reframing ADR required.

### Domain D — Feature Backlog (BLOCKED)

- **Done when**: feature backlog defined, dependency-ordered, stop/go gates in place.
- **Dependencies**: Domain C critical items complete.

---

## Current State Evidence (Dated)

Evidence date baseline: **5 March 2026**.

**OpenAI coupling inventory** (as of 2026-03-05; authoritative — see Domain C for migration tasks):

| Layer | File | Coupling |
|-------|------|---------|
| Tool metadata (generated type) | `tool-descriptor.contract.ts` | 5 OpenAI-specific keys |
| Tool metadata (codegen emitter) | `emit-index.ts` | 5 OpenAI-specific keys emitted |
| Resource metadata | `register-resources.ts` | 4 OpenAI-specific keys |
| MIME type | `aggregated-tool-widget.ts` | `text/html+skybridge` (OpenAI convention) |
| Widget JS (tool data) | `widget-script.ts` | 5 `window.openai.*` usages |
| Widget JS (state) | `widget-script-state.ts` | 3 `window.openai.*` usages |

Additional findings:

- **Widget partially simplified** (2026-02-23): CTA removed from output; `widget-cta/` source retained. Header reduced to logo/wordmark/tool-name on major tools.
- **Auth metadata invariant gap** (2026-02-23): `tool-auth-checker.ts` assumes `securitySchemes` exists — handled in C8 as fail-fast invariant hardening.
- **Widget URI parity drift** (2026-02-23): local build emits `local` hash token instead of per-run hash; tracked in C9.

**Research finding** (2026-03-05; high confidence):
`@modelcontextprotocol/ext-apps` `^1.2.0` is declared across all relevant workspaces. The `ext-apps/server` submodule (`@modelcontextprotocol/ext-apps/server`) exports `registerAppTool`, `registerAppResource`, and `getUiCapability` — these are the canonical migration vehicle for C4, C5, and C6. `registerAppResource` defaults to `text/html;profile=mcp-app` automatically.

---

## Plan Split (Agreed)

1. Pre-merge Tracks 1a + 1b: **COMPLETE** (Phases 0-5 including Phase 5 resilience hardening, 2026-02-22). Archived: [widget-search-rendering.md](../semantic-search/archive/completed/widget-search-rendering.md).
2. Post-merge Track 2: this file. Entry condition satisfied (Gate 3 passed).

---

## Domain A — Research (COMPLETE)

Research is complete. See [mcp-apps-support.research.md](mcp-apps-support.research.md) for the full research artefact (dated 2026-03-05).

**Primary validation outcome** (both questions confirmed, high confidence):

- **(a)** ChatGPT accepts tool descriptors using **only** `_meta.ui.resourceUri`. `openai/outputTemplate` is a compatibility alias for backwards compatibility — it is not the primary key and should not be emitted by Oak.
- **(b)** ChatGPT and Claude both accept widget resources served with `text/html;profile=mcp-app`. The canonical MIME type from the MCP Apps spec. The `ext-apps/server` SDK exports this as `RESOURCE_MIME_TYPE` and uses it as the default in `registerAppResource`.

**Consequence**: Domain C items may target **MCP-standard-only** migration. No dual paths, no fallback metadata keys, no adapter layer.

**Secondary deliverables** (from research artefact):

1. Compatibility matrix: ChatGPT (supported), Claude (supported), Gemini (MCP Apps UI unspecified in primary sources).
2. CSP model: `_meta.ui.csp` with `connectDomains`, `resourceDomains`, `frameDomains`. Restrictive default when absent.
3. Host-specific notes: Claude derives sandbox domain as `{sha256(serverUrl)[:32]}.claudemcpcontent.com`. This is only relevant if Oak's widget makes direct cross-origin `fetch()` calls from the iframe; if all data flows through the MCP bridge (`tools/call`, `ui/notifications/*`), `_meta.ui.domain` is not required. This must be resolved in Domain C item C6.
4. Capability negotiation: use `getUiCapability` to check if the client advertises `io.modelcontextprotocol/ui` support before registering app tools; provide a text-only fallback for clients without MCP Apps support.

---

## Domain B — MCP Specialist Alignment

> **Gate 4 deliverable — specialist reviewer of record**: Use the existing
> `mcp-reviewer` as the MCP + MCP Apps standards specialist for this migration.
> Do not create a second overlapping MCP specialist unless the existing
> reviewer proves materially insufficient in trial use.

Specialist identifier: `mcp-reviewer`

Role: combined advisor and reviewer for MCP extensions architecture, host compatibility, and host-neutral metadata boundary integrity.

Rationale:

1. the repo already has a real MCP specialist reviewer template and wrappers
2. that reviewer already covers MCP Apps widgets, resources, capability
   negotiation, and spec alignment
3. duplicating the MCP specialist role would weaken delegation clarity
   and add maintenance burden without proven value

Oak MCP Apps skill chain for this migration:

1. [`.agent/skills/mcp-migrate-oai/SKILL.md`](../../skills/mcp-migrate-oai/SKILL.md) — primary migration workflow for replacing OpenAI App surfaces with MCP Apps standard surfaces
2. [`.agent/skills/mcp-create-app/SKILL.md`](../../skills/mcp-create-app/SKILL.md) — additive app creation after core migration work
3. [`.agent/skills/mcp-add-ui/SKILL.md`](../../skills/mcp-add-ui/SKILL.md) — adding UI to existing tools after the migration baseline is in place
4. [`.agent/skills/mcp-convert-web/SKILL.md`](../../skills/mcp-convert-web/SKILL.md) — converting existing web UI into MCP Apps resources

Escalation criteria:

1. Any conflict between accepted ADRs and implementation proposal.
2. Any proposal introducing host lock-in in the core MCP path.
3. Any auth or metadata behaviour that can break OAuth bootstrap.
4. Any generator/runtime parity drift with release impact.

Review checklist: MCP-first portability · MCP/auth metadata correctness · metadata contract clarity · widget safety and data-minimisation · testability and deterministic validation.

---

## Domain C — Future Refactoring Backlog

Objective: architecture clean-up and safety corrections after Domain A and Domain B gates pass (except C8, which can run independently now).

### Deployment mode assumption

**One host-neutral MCP deployment model.** The same MCP-standard contract is served to all hosts. No host-mode environment toggle (for example `OAK_MCP_PLATFORM`) and no host detection logic in migration scope.

**App scope**: `apps/oak-curriculum-mcp-streamable-http` only. The stdio server (`apps/oak-curriculum-mcp-stdio`) has no MCP Apps surface and is never touched by this migration.

### Migration vehicle

Use `@modelcontextprotocol/ext-apps/server` helpers for C4, C5, and C6:

- `registerAppTool`: normalises `_meta.ui.resourceUri` and handles legacy key compatibility automatically.
- `registerAppResource`: defaults MIME type to `text/html;profile=mcp-app` (exported as `RESOURCE_MIME_TYPE`).
- `getUiCapability`: capability negotiation — check for `io.modelcontextprotocol/ui` support in client capabilities; register text-only fallback tools when MCP Apps is not advertised.
- `RESOURCE_MIME_TYPE`: use this constant everywhere instead of hard-coding the MIME string.

### Internal dependency ordering

Items MUST be implemented in this order:

1. **Infrastructure hardening** (C1, C2): enforce host-neutral boundaries and remove compatibility toggles. Nothing else starts until these are in place.
2. **SDK contracts** (C5): codegen emitter update and tool descriptor contract. SDK stays single source of truth (ADR-030).
3. **App runtime** (C4, C6): MIME migration and resource metadata migration.
4. **Client UI** (C3, C10): widget JS migration. Runs last because it depends on the correct MCP bridge being in place at the app layer.

C7, C8, C9 can run independently of the migration sequence above but must complete before Domain D.

### Refactor backlog items

C1. **Host-neutral boundary enforcement**:

- Application code MUST NOT branch on host type and MUST emit canonical MCP-standard metadata through host-neutral helpers.
- No compatibility layer, host adapter, or dual metadata path in core execution.
- Critical constraint: no host string or host enum is passed into domain logic (`if (platform === 'chatgpt')` is forbidden in migration scope).

C2. **Platform toggle and detection removal**:

- Do not introduce `OAK_MCP_PLATFORM` for metadata or widget behaviour.
- Do not add request-driven or env-driven host branching for MCP Apps output.
- If any host toggle/projection code appears during migration, delete it rather than preserving it behind flags.

C3. **Widget client-side migration** (largest item, runs last):

- Rewrite `window.openai.*` usage to the MCP Apps SDK `App` class pattern and JSON-RPC bridge (`ui/initialize`, `ui/notifications/tool-input`, `ui/notifications/tool-result`).
- Files: `apps/oak-curriculum-mcp-streamable-http/src/widget-script.ts` (5 usages), `apps/oak-curriculum-mcp-streamable-http/src/widget-script-state.ts` (3 usages).
- **Timing/sequencing**: MCP Apps SDK `connect()` is async. Widget render MUST NOT run before `connect()` resolves and tool data is delivered via `app.ontoolresult`. Explicit sequencing and tests are required.
- **`widgetState`/`setWidgetState` replacement**: `window.openai.widgetState` and `window.openai.setWidgetState` have no MCP Apps equivalent. Design and validate an alternative mechanism before migrating. Prefer `sessionStorage` or in-memory state for UI-only data (for example scroll position). If `localStorage` is used: store minimal primitives only; namespace keys by app context; add TTL/expiry; schema-validate on read; NEVER store auth tokens, session data, tool result payloads, or any PII in browser storage.
- End state: no `window.openai.*` usage remains in the runtime widget code path.

C4. **MIME type migration**:

- Migrate `AGGREGATED_TOOL_WIDGET_MIME_TYPE` in `aggregated-tool-widget.ts` from `text/html+skybridge` to `RESOURCE_MIME_TYPE` from `@modelcontextprotocol/ext-apps/server`.
- Use `registerAppResource` as the registration vehicle — it defaults to `RESOURCE_MIME_TYPE` automatically.
- **Rollout strategy**: Vercel preview deployment before full rollout; validate ChatGPT and Claude accept the new MIME in pre-production before full cutover.
- **Rollback procedure**: deployment-level rollback (revert release artefact). No dual MIME runtime path retained.

C5. **Tool metadata key migration**:

- Codegen emitter (`emit-index.ts`): migrate from five `openai/*` keys to `_meta.ui.resourceUri` (MCP standard). Use `registerAppTool` as the registration vehicle — any legacy-key compatibility normalisation must stay inside the upstream helper boundary, not in Oak-authored runtime or generator code.
- Tool descriptor contract (`tool-descriptor.contract.ts`): replace OpenAI-only keys with MCP standard keys. Types and type-guards flow from SDK compile time per the cardinal rule.
- **Strict contract rule**: SDK emits MCP-standard metadata only. No runtime or generator projection of host-specific metadata aliases.
- **Security invariant**: `securitySchemes`, `annotations`, and tool input schemas must remain untouched by migration.

C6. **Resource metadata key migration**:

- `register-resources.ts`: migrate from four `openai/*` keys (`openai/widgetCSP`, `openai/widgetPrefersBorder`, `openai/widgetDescription`, `openai/widgetDomain`) to MCP Apps standard equivalents via `registerAppResource`.
- **CSP field mapping**: `openai/widgetCSP` → `_meta.ui.csp` with `connectDomains`/`resourceDomains`/`frameDomains` fields (note: OpenAI legacy used snake_case; MCP standard uses camelCase — validate mapping explicitly in the plan).
- **`_meta.ui.domain` decision**: this field is only required if the widget makes direct cross-origin `fetch()` calls from the iframe. If all data flows through the MCP bridge (`tools/call`, `ui/notifications/*`), omit the field. Determine this before migrating. If the field is needed, rely on `@modelcontextprotocol/ext-apps/server` or another host-neutral mechanism rather than computing host-specific values in Oak runtime code.
- **Absent-CSP security stance**: if MCP standard CSP fields are absent or invalid, resolve to a restrictive-only default. A permissive fallback is not acceptable.

C7. **Metadata contract hardening**:

- Satisfied when C5 and C6 are complete and `ToolDescriptor` contains only MCP standard keys.

C8. **Auth metadata invariant hardening** (small task; no standalone active plan):

- **Fail-fast invariant**: validate auth metadata at the earliest boundary (descriptor load/bootstrap), before tool handler registration.
  - `securitySchemes` must be present, array-shaped, and semantically valid for every generated and aggregated tool descriptor.
  - Any missing/empty/malformed `securitySchemes` or descriptor lookup failure MUST terminate startup immediately (no fallback path, no permissive continuation).
- **Fail fast, early and hard with helpful errors** (per [principles.md](../../directives/principles.md)):
  - Error must name the failing tool, the invalid field/value shape, and why startup was blocked.
  - Error must include remediation guidance (for example: run `pnpm sdk-codegen`; verify generated descriptor contract; fix aggregated definition source).
- **Testing-strategy alignment**:
  - Unit tests: pure invariant evaluator for valid/invalid `securitySchemes` decision paths (no mocks).
  - Integration tests: startup/bootstrap path aborts on invalid descriptor fixtures using simple injected fakes (no `vi.mock`, no global-state mutation).
  - All tests: RED → GREEN → REFACTOR; named by level (`*.unit.test.ts`, `*.integration.test.ts`).
- Evidence: `tool-auth-checker.ts` calls `.securitySchemes.some(...)` without a null guard — invariant violations fail too late and opaquely.

C9. **URI parity hardening**:

- Enforce generated/runtime widget URI parity checks.

C10. **Renderer stack simplification** (runs with C3):

- `widget-cta/` to be deleted when context-grounding resource is implemented.
- Remaining renderer registry complexity assessed after Domain A research.

---

## Domain D — Future Feature-Creation Backlog

Additive feature work only after Domains A to C pass all required gates.

Feature backlog candidates:

1. Context-grounding resource (`curriculum://context-grounding`) as a single-request convenience for clients that want ontology + help content up front (CTA removal complete, ADR-061 superseded).
2. Pedagogical context improvements — extracted to [archive/completed/improve-pedagogical-context.plan.md](archive/completed/improve-pedagogical-context.plan.md).
3. **Standard-first MCP Apps capability expansion**: any new capability must target MCP Apps standard primitives first and keep the core contract host-neutral.
4. Search UX reintroduction aligned with new search backend and hard safety controls.
5. Operational hardening and observability improvements for MCP-standard flows.

Feature readiness conditions: all Domain C critical items complete; ADR matrix gaps owned; security sign-off from specialist checklist.

---

## ADR Compliance Matrix

Policy: accepted ADRs are binding. Superseded ADRs are context checks only. Proposed ADRs are context only.

Matrix includes only ADRs with actual gaps or migration-specific binding actions.

| ADR | Status | Binding Rule | Evidence | Gap | Planned Action | Gate |
| --- | --- | --- | --- | --- | --- | --- |
| ADR-005 | Accepted | Automatic PII scrubbing | `docs/architecture/architectural-decisions/005-automatic-pii-scrubbing.md` | Widget state migration to browser storage could introduce PII storage risk | Never store auth tokens, session data, or tool output in widget browser storage (Domain C item C3) | Gate 3 |
| ADR-024 | Accepted | Dependency injection pattern for boundary wiring | `docs/architecture/architectural-decisions/024-dependency-injection-pattern.md` | Migration could reintroduce host-specific branching in core paths | Use DI for runtime dependencies only; no host adapters and no platform conditionals in domain logic | Gate 2 |
| ADR-026 | Accepted | Code generation remains OpenAPI-driven | `docs/architecture/architectural-decisions/026-openapi-code-generation-strategy.md` | Migration touches codegen emitter; must remain generator-first | All metadata evolution in generator templates; no out-of-band key additions | Gate 2 |
| ADR-029 | Accepted | No manual API data in MCP | `docs/architecture/architectural-decisions/029-no-manual-api-data.md` | Manual host-specific metadata injection could bypass canonical contract generation | Emit MCP-standard metadata from codegen only; no runtime host-key injection | Gate 2 |
| ADR-030 | Accepted | SDK is single source of truth | `docs/architecture/architectural-decisions/030-sdk-single-source-truth.md` | Migration touches tool descriptor contract | Codegen emitter migrates to MCP standard; no out-of-band contract authoring | Gate 2 |
| ADR-038 | Accepted | Compile-time embedded validation | `docs/architecture/architectural-decisions/038-compilation-time-revolution.md` | Runtime metadata projections could become a second contract-authoring path | All contract evolution happens in generator templates; no runtime metadata contract transformations | Gate 2 |
| ADR-042 | Accepted | `packages/runtime-adapters/` scope is runtime platform (Node/Workers) | `docs/architecture/architectural-decisions/042-runtime-adapters-folder.md` | Risk of scope drift by introducing host adapters into runtime-adapters | Keep MCP Apps migration host-neutral; do not introduce MCP host adapters in `packages/runtime-adapters/` | Gate 2 |
| ADR-043 | Accepted | CI/build determinism for generated artefacts | `docs/architecture/architectural-decisions/043-codegen-in-build-and-ci.md` | Potential parity drift in widget URI handling | Add explicit parity check backlog item (Domain C item C9) | Gate 6 |
| ADR-046 | Accepted | Single `/mcp` transport with universal tools | `docs/architecture/architectural-decisions/046-openai-connector-facades-in-streamable-http.md` | ADR-046 uses OpenAI-first framing; post-migration primary surface is MCP-standard — documentation debt | Preserve single-surface assumption; update ADR-046 framing as a post-Domain-C documentation task (todo: `adr-046-update` — to be added once Domain C starts) | Gate 2 |
| ADR-054 | Accepted | Tool-level auth error interception | `docs/architecture/architectural-decisions/054-tool-level-auth-error-interception.md` | Metadata/runtime refactor could accidentally bypass auth interception path | Preserve interception path during refactor; no migration step may bypass or shadow auth errors | Gate 3 |
| ADR-057 | Accepted | Selective auth for approved public resources | `docs/architecture/architectural-decisions/057-selective-auth-public-resources.md` | Widget URI and public resource list must stay aligned during MIME/metadata migration | Keep URI parity checks and public list tests during Domain C | Gate 3 |
| ADR-058 | Accepted | Model-visible context grounding design | `docs/architecture/architectural-decisions/058-context-grounding-for-ai-agents.md` | Widget JS migration could inadvertently remove model-facing hints | Keep model-facing hints outside widget payload; verify they are preserved in MCP Apps bridge migration | Gate 3 |
| ADR-071 | Accepted | Code-gen widget URI cache-busting | `docs/architecture/architectural-decisions/071-widget-uri-cache-busting-simplification.md` | Current local hash behaviour diverges from ADR wording | Add explicit local/prod parity decision in Domain D (Domain C item C9) | Gate 5 |
| ADR-108 | Accepted | SDK workspace decomposition; one-way dependency invariant | `docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md` | Migration crosses two workspaces: WS2 (`oak-sdk-codegen`) and WS4 (HTTP app); generation must not import from runtime | Codegen workspace generates canonical host-neutral artefacts only; runtime consumes generated output | Gate 2 |
| ADR-113 | Accepted | Auth for all MCP methods except defined public routes | `docs/architecture/architectural-decisions/113-mcp-spec-compliant-auth-for-all-methods.md` | Tool auth checker defensive gap — assumes `securitySchemes` exists | Implement Domain C item C8 fail-fast auth metadata invariant hardening | Gate 3 |
| ADR-115 | Accepted | Proxy OAuth Authorisation Server remains required for Cursor and legacy platform compatibility | `docs/architecture/architectural-decisions/115-proxy-oauth-as-for-cursor.md` | MCP Apps migration could regress proxy OAuth routes/metadata behaviour | Preserve `/oauth/*` proxy behaviour and metadata rewriting; include regression checks in downstream implementation plans | Gate 3 |
| ADR-116 | Accepted | resolveEnv pipeline architecture | `docs/architecture/architectural-decisions/116-resolve-env-pipeline-architecture.md` | Host-mode toggles could be introduced ad hoc during migration | Keep runtime config in resolveEnv pipeline; do not add host-mode environment switches for metadata/widget behaviour | Gate 6 |
| ADR-123 | Accepted | MCP Server Primitives Strategy | `docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md` | Migration touches tool metadata (C5) and resource metadata (C6); primitive control model must be preserved | Metadata migration must not alter which primitives expose which capabilities or their control model | Gate 5 |

**Superseded ADRs** (anti-pattern references only): ADR-061 (widget CTA — do not reintroduce), ADR-056 (discovery auth bypass), ADR-037 (dynamic dispatch — use compile-time approach from ADR-038), ADR-016 (dotenv — use resolveEnv pipeline from ADR-116), ADR-017 (Consola logging — use OTel logging from ADR-051).

---

## Gates, Stop/Go, Rollback

**Gate-to-Domain mapping**:

| Gate | Domain / purpose |
|------|-----------------|
| Gate 0 | Foundation recommitment — applies to all |
| Gate 1 | Domain A secondary (source hygiene) — ✅ passed |
| Gate 2 | ADR matrix complete; reframing ADR accepted |
| Gate 3 | Pre-merge prerequisite — ✅ passed (2026-02-22) |
| Gate 4 | Domain B specialist alignment — ✅ passed (2026-03-07) |
| Gate 5 | Domain C/D separation and dependency ordering complete |
| Gate 6 | Quality and exit readiness |

Gate 0 — Foundation recommitment complete:

- Stop if foundation directives are not re-read and acknowledged.
- Go when recommitment and first-question checks are recorded.

Gate 1 — Source hygiene complete:

- Stop on any broken source URL.
- Go when all listed URLs return 200, 301, or 302.
- **Current status**: ✅ PASSED — research artefact dated 2026-03-05; primary sources verified.

Gate 2 — ADR matrix complete:

- Stop if any required ADR is missing or has no owner/action/gate.
- Stop if reframing ADR is not accepted.
- Go when all required ADR rows are present with evidence and planned action, and reframing ADR is accepted.

Gate 3 — Pre-merge prerequisite complete:

- **Current status**: ✅ PASSED — all phases (0-5) complete, 2026-02-22.

Gate 4 — Specialist alignment complete:

- Stop if `mcp-reviewer` is not explicitly identified as the specialist reviewer
  of record, or if the skill chain and checklist are missing from the live
  guidance.
- Go when the reviewer/plan docs are aligned and a lightweight trial invocation
  has been completed and recorded.
- **Current status**: ✅ PASSED — reviewer/plan docs aligned and `mcp-reviewer`
  trialled on 2026-03-07.

Gate 5 — Backlog separation complete:

- Stop if refactor and feature work are mixed or unordered.
- Go when Domain C and Domain D are dependency-ordered and distinct.
- Rollback: return feature items to blocked status and reopen Domain C tasks.

Gate 6 — Quality and exit readiness complete:

- Stop if validation commands or exit criteria are incomplete.
- Go when quality section and exit criteria are fully checkable.

---

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

ADR coverage check:

```bash
rg -n "^\| ADR-" .agent/plans/sdk-and-mcp-enhancements/roadmap.md
```

OpenAI coupling regression check (run before and after each Domain C plan):

```bash
rg -n "WIDGET_URI|BASE_WIDGET_URI|openai/outputTemplate|text/html\+skybridge|window\.openai" \
  packages/sdks/oak-sdk-codegen/src \
  packages/sdks/oak-sdk-codegen/code-generation \
  apps/oak-curriculum-mcp-streamable-http/src
```

Auth metadata gap check:

```bash
rg -n "securitySchemes" apps/oak-curriculum-mcp-streamable-http/src/tool-auth-checker.ts
```

---

## Risks and Mitigations

| Risk | Impact | Mitigation | Owner |
| --- | --- | --- | --- |
| ADR not written before Domain C starts | Architectural drift; no binding decision record | `reframing-adr` todo required before Domain C; Gate 2 enforces this | Plan owner |
| Host lock-in in core path | Reduced portability | Keep MCP-standard-only baseline and host-neutral boundaries; Domain C items C1/C2 | Specialist reviewer |
| ChatGPT rejects MCP-only metadata or MIME | Migration blocked | Research confirms acceptance (high confidence); if production rejects, stop and escalate via ADR path — no dual runtime path | Research owner |
| `window.openai.*` migration breaks ChatGPT rendering during transition | Live service disruption | Domain C item C3: staged rollout in preview; explicit acceptance checks; deployment rollback if needed | Widget owner |
| Auth behaviour regression | OAuth bootstrap failures | Preserve ADR-113 and ADR-115 constraints; Domain C item C8 | Security owner |
| Generator/runtime drift | Release-time widget or metadata failures | Add parity checks and gate before feature rollout; Domain C item C9 | SDK owner |
| Accidental reintroduction of host-mode toggles | Contract drift and hidden dual paths | Domain C item C2 guardrails + regression checks in quality gates | Bootstrap owner |
| `widgetState`/`setWidgetState` have no MCP Apps equivalent | UI state breaks on migration | Design and validate alternative mechanism before removing `window.openai` state calls; explicit task in Domain C item C3 | Widget owner |
| MIME migration production disruption | ChatGPT rejects `text/html;profile=mcp-app` | Phased rollout (staged deploy); deployment rollback if checks fail; pre-production validation (Domain C item C4) | Plan owner |
| MCP Apps async `connect()` vs sync widget assumptions | Empty or incorrect initial render | Define and test handler registration sequencing before migrating; Domain C item C3 | Widget owner |
| `_meta.ui.domain` required but not computed | Widget fails CORS checks in Claude | Resolve in C6: determine if domain field is required; if yes, document computation | Widget owner |
| CSP field mapping shape differences | Wrong CSP format breaks widget loading | Add explicit CSP field mapping validation and tests (Domain C item C6) | Widget owner |

---

## Exit Criteria

1. ✅ Domain A research complete; both validation questions answered with high confidence.
2. Reframing ADR accepted and cross-referenced.
3. ✅ Domain B specialist alignment complete; `mcp-reviewer` adopted and trial
   invocation recorded.
4. All Domain C items complete; no OpenAI-specific surface remains in core paths; all quality gates pass.
5. Domain D feature backlog defined and dependency-ordered.
6. Documentation synchronisation complete (ADR-119, practice.md, impacted ADRs updated or no-change rationale recorded).

---

## Assumptions and Defaults

1. Date baseline for this review is 5 March 2026.
2. Accepted ADRs are binding; superseded ADRs are anti-pattern context.
3. Widget prerequisite work (Tracks 1a and 1b) is complete and archived.
4. `/mcp` remains the single transport surface.
5. Public resource auth bypass remains constrained to ADR-057 and ADR-113 scope only.
6. Generator-first/schema-first remains non-negotiable for SDK and MCP contract work.
7. ChatGPT and Claude implement MCP Apps standard (confirmed 2026-03-05). Oak targets MCP-standard-only — no fallback to `text/html+skybridge` or OpenAI-specific metadata.
8. `@modelcontextprotocol/ext-apps` `^1.2.0` is declared across all relevant workspaces. `registerAppTool`, `registerAppResource`, and `getUiCapability` are the migration vehicle.
9. ADR-115 proxy OAuth behaviour remains required and must stay operational throughout migration.

---

## Related Documents

- [mcp-apps-support.research.md](mcp-apps-support.research.md) — Domain A research artefact (ChatGPT/Claude/Gemini compatibility matrix, CSP model, SDK surfaces)
- [active/replace-openai-app-with-mcp-app-infrastructure.execution.plan.md](active/replace-openai-app-with-mcp-app-infrastructure.execution.plan.md) — Active execution entry point for the OpenAI App to MCP Apps replacement work
- [current/output-schemas-for-mcp-tools.plan.md](current/output-schemas-for-mcp-tools.plan.md) — Current MCP contract plan for truthful `outputSchema` exposure across generated and aggregated tools
- [active/oak-preview-mcp-snagging.execution.plan.md](active/oak-preview-mcp-snagging.execution.plan.md) — Active deploy-safe snagging plan for current oak-preview MCP issues outside the separate widget/App migration
- [archive/concept-preservation-and-supersession-map.md](archive/concept-preservation-and-supersession-map.md) — Legacy concept ingestion map
- [archive/auth-safety-correction.plan.md](archive/auth-safety-correction.plan.md) — Archived auth safety plan (superseded by C8; retained for provenance)
- [archive/mcp-extensions-research-and-planning.metaplan.md](archive/mcp-extensions-research-and-planning.metaplan.md) — Origin metaplan
- [active/README.md](active/README.md) — Active executable plans index
- [current/README.md](current/README.md) — Queued plans index
