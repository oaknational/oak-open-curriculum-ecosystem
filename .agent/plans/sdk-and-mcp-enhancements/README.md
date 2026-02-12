# SDK and MCP Enhancements

This directory contains plans for enhancing the Oak Curriculum SDK and MCP (Model Context Protocol) infrastructure.

**Last Updated**: 2026-02-12

## Workspace Architecture

The SDK is being decomposed into 4 workspaces per
[ADR-108](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md):
Generic Pipeline (WS1), Oak Type-Gen (WS2), Generic
Runtime (WS3), Oak Runtime (WS4). Plans in this directory
primarily affect WS2 (type-gen) and WS4 (runtime). See
also [pipeline-enhancements/](../pipeline-enhancements/)
for plans affecting WS1 and the overall decomposition.

---

## Technical Debt

### Incompatible `structuredContent` Shapes

`formatDataWithContext` (used by generated tools in `executor.ts`) and `formatOptimizedResult` (used by aggregated tools) produce incompatible `structuredContent` shapes:

- **`formatDataWithContext`**: `{ status, data: {...}, oakContextHint }` — data wrapped in `data` property
- **`formatOptimizedResult`**: `{ ...fullData, summary, oakContextHint, status }` — data spread at root level

Additionally, `formatOptimizedResult` includes `_meta` with widget metadata (`toolName`, `annotationsTitle`, `query`, `timestamp`) while `formatDataWithContext` does not.

Both tool types have the same OpenAI Apps SDK requirements. These should be unified to produce consistent output that widgets and consumers can rely on.

---

## Plan Index

| Plan | File | Status | Duration | Focus |
|------|------|--------|----------|-------|
| **01** | [Tool Metadata Enhancement](./01-mcp-tool-metadata-enhancement-plan.md) | 🟡 PARTIAL | ~4-5 days | Tool annotations, `_meta`, examples |
| **02** | [Curriculum Ontology Resource](./02-curriculum-ontology-resource-plan.md) | 📋 PLANNED | ~4 weeks | MCP resource for domain model |
| **03** | [Infrastructure & Advanced Tools](./03-mcp-infrastructure-advanced-tools-plan.md) | 📋 PLANNED | ~12-14 weeks | Architecture evolution |
| **04a** | [MCP Prompts Enhancement](./04-mcp-prompts-and-agent-guidance-plan.md) | ⏸️ DEFERRED | Enhancement | Move prompts to type-gen |
| **04b** | [Widget and Tooling Improvements](./04-widget-and-tooling-improvements.md) | 📋 PLANNED | ~2-3 days | Widget fixes, search links |
| **06** | [UX Improvements & Research](./06-ux-improvements-and-research-plan.md) | 🟡 PHASE A/B ✅ | ~6-8 hours | Quick wins, research |
| **08b** | [OpenAI Apps SDK Part 2](./08b-openai-apps-sdk-part-2-deferred.md) | ⏸️ DEFERRED | ~8-12 hours | Golden prompts, compliance |
| **10** | [Quick Wins from AILA Research](./10-quick-wins-from-aila-research.md) | ✅ READY | ~1 day | Ontology/docs enhancement |
| **11** | [Widget Universal Renderers](./11-widget-universal-renderers-plan.md) | 📋 PLANNED | ~6-8 hours | Tool-name-routed rendering |
| **15a** | [Public Resource Auth Bypass](./15a-public-resource-auth-bypass.md) | ✅ READY | ~2-3 hours | Skip auth for public resources |
| **15b** | [Static Widget Shell Optimization](./15b-static-widget-shell-optimization.md) | ⏸️ DEFERRED | ~4-6 hours | CDN caching for widget |
| **16** | [Context Grounding Optimization](./16-context-grounding-optimization.md) | 📋 DRAFT | TBD | Improve AI agent context |
| **17** | [Synonym Enrichment from OWA/OALA](./17-synonym-enrichment-from-owa-oala.md) | 🟡 READY | ~4-6 hours | Import alias data |
| **18** | [Schema-Driven SDK Adapter](./18-schema-driven-sdk-adapter-generation-plan.md) | 🔴 NOT STARTED | ~3-4 days | Generate Result-returning client |

### Status Legend

- ✅ READY / COMPLETE - Ready to implement or done
- 🟡 PARTIAL / ACTIVE - In progress
- 📋 PLANNED / DRAFT - Designed but not started
- ⏸️ DEFERRED - Postponed
- 🔴 NOT STARTED - Not yet begun

---

## Plan Summaries

### 01: MCP Tool Metadata Enhancement

**Status**: 🟡 PARTIALLY COMPLETE

Enhances MCP tool metadata to improve ChatGPT/OpenAI Apps SDK integration:

- ✅ **Phase 0**: Tool annotations (COMPLETE)
- ✅ **Phase 1**: Invocation status strings in `_meta` (COMPLETE)
- ✅ **Phase 2**: Security schemes in `_meta` (COMPLETE)
- ✅ **Phase 3**: Parameter examples from OpenAPI (COMPLETE)
- ❌ **Phase 4**: Enhanced error messages (NOT STARTED)
- ⏸️ **Phase 5**: Output schema evaluation (DEFERRED)
- ✅ **Phase 6**: Aggregated tools alignment (COMPLETE)

**Remaining Work**: Phase 4 (~1 day)

**Key benefit**: Better UX in ChatGPT, clearer parameter formats for AI agents.

---

### 02: Curriculum Ontology Resource

**Status**: 📋 PLANNED

Implements a schema-derived curriculum ontology exposed as an MCP resource:

- **Phase 1**: Type-gen schema extractor
- **Phase 2**: Manual guidance JSON layer
- **Phase 3**: MCP resource exposure
- **Phase 4**: Testing
- **Phase 5**: Documentation

**POC Available**: `ontology-poc-content.json` contains pre-authored content for validation.

**Key benefit**: AI agents understand the Oak Curriculum domain model, entity relationships, and tool composition patterns.

---

### 03: MCP Infrastructure & Advanced Tools

**Status**: 📋 PLANNED

Covers architecture evolution and advanced MCP capabilities:

- **Phase 0**: Aggregated tools type-gen refactor (FOUNDATION)
- **Phase 1**: Infrastructure hardening (rate limiting, type guards)
- **Phase 2**: Tool taxonomy and categorization
- **Phase 3**: Playbooks and commands registry
- **Phase 4**: Advanced tools (bulk ops, filtering, comparison, export)

**Key benefit**: Schema-first architecture, improved maintainability, powerful composite tools.

---

### 04a: MCP Prompts Type-Gen Enhancement

**Status**: ⏸️ DEFERRED (Enhancement)

Move MCP prompt definitions to type-gen for architectural consistency. **Prompts currently work correctly** - all E2E tests pass. This is a nice-to-have enhancement.

**Key insight**: Prompts are not derived from the OpenAPI schema, so the Cardinal Rule doesn't strictly apply.

---

### 04b: Widget and Tooling Improvements

**Status**: 📋 PLANNED

Addresses widget rendering and data flow issues:

- Agent context tool category metadata
- Missing search result canonicalUrl links
- Search result section titles
- Full results data for all tool types

---

### 06: UX Improvements & Research

**Status**: 🟡 PHASE A/B ✅ COMPLETE

Quick wins and foundation work for prompt enhancements:

- **Phase A**: Quick wins ✅ COMPLETE
  - Renamed `year` → `yearGroup` parameter
  - Enhanced landing page with tools/resources/prompts
- **Phase B**: Research ✅ COMPLETE (via Plan 07 research)
- **Phase C**: Foundation work (pending)

---

### 08b: OpenAI Apps SDK Part 2 (Deferred)

**Status**: ⏸️ DEFERRED

Deferred items from OpenAI Apps SDK adoption:

- Golden prompt test suite and walkthrough documentation
- Private tool support
- Follow-up messages
- Production readiness and compliance

---

### 10: Quick Wins from AILA Research

**Status**: ✅ READY TO IMPLEMENT

Quick wins from AILA domain extraction research:

- **QW-01**: Timing constraints for ontology
- **QW-02**: Pedagogical patterns in help content
- **QW-03**: Quiz purpose descriptions
- **QW-04**: Educational vocabulary in tool descriptions

All quick wins follow schema-first principles and TDD methodology.

---

### 11: Widget Universal Renderers

**Status**: 📋 PLANNED

Enhance the Oak JSON Viewer widget with rich rendering for all 26 tool outputs:

- Tool name routing (deterministic, no duck typing)
- Generic renderers (~7 new) that handle multiple tools
- Rich rendering for all curriculum entities
- Graceful JSON fallback for unknown tools

---

### 15a: Public Resource Auth Bypass

**Status**: ✅ READY TO IMPLEMENT

Skip authentication for public resources to reduce latency:

- Widget HTML shell (static, no user data)
- Documentation resources (static markdown)
- **Data-fetching tools still require authentication**

**Problem**: ~60 `resources/read` calls with ~170ms Clerk overhead = ~10s latency

---

### 15b: Static Widget Shell Optimization

**Status**: ⏸️ DEFERRED (after 15a)

Optimize widget HTML with CDN caching:

- Tiny HTML shell + bundled assets from Vercel CDN
- Only implement if latency still >2s after 15a

---

### 16: Context Grounding Optimization

**Status**: 📋 DRAFT

Ensure AI agents call `get-ontology` and `get-help` before using curriculum tools:

- Move context guidance from `_meta` (model never sees) to `structuredContent`
- Optimize widget descriptions
- Add prerequisite tool hints

---

### 17: Synonym Enrichment from OWA/OALA

**Status**: 🟡 READY TO IMPLEMENT

Import alias data from Oak Web Application and OALA:

- Subject aliases (24 subjects)
- Key stage aliases and parsing (gcse → ks4, year_7 → ks3)
- Year number aliases (y1, year1 variants)
- Exam board aliases

**Impact**: Directly improves hard query MRR.

---

### 18: Schema-Driven SDK Adapter Generation

**Status**: 🔴 NOT STARTED

Generate Result-returning SDK client at type-gen time:

- **Problem**: Manual adapter layer in search app wraps SDK with type guards and Result pattern
- **Solution**: Generate `OakResultClient` from OpenAPI schema
- **Phases**: Design (~1d) → Generator (~1.5d) → Migration (~1d) → Docs (~0.5d)

**Key benefit**: Eliminates ~200 lines of manual adapter code; all SDK client methods flow from schema.

**Related**: ADR-088 (Result Pattern), ADR-030 (SDK as Single Source of Truth)

---

## Dependencies

```text
Plan 15a (Auth Bypass)           ← READY, no dependencies
         ↓
Plan 15b (Widget Shell)          ← Only if latency still >2s

Plan 10 (AILA Quick Wins)        ← READY, no dependencies
Plan 17 (Synonym Enrichment)     ← READY, high impact on MRR

Plan 01 (Metadata)               ← Phase 4 remaining
         ↓
Plan 11 (Widget Renderers)       ← Benefits from tool metadata

Plan 02 (Ontology) + Plan 03 Phase 0
         ↓
Plan 03 Phases 1-4 (Advanced Tools)

Plan 16 (Context Grounding)      ← Benefits from Plans 01, 02, 10

Plan 18 (SDK Adapter Gen)        ← Architectural improvement, medium priority
```

### Recommended Priority Order

1. **Plan 15a** - Quick latency win, ready to implement
2. **Plan 17** - High MRR impact, ready to implement
3. **Plan 10** - Quick ontology/docs wins
4. **Plan 01 Phase 4** - Complete metadata work
5. **Plan 11** - Better widget rendering

---

## Archived Plans

See `archive/` for historical plan versions and consolidated plans.

---

## Related Documentation

- `.agent/directives/rules.md` - Cardinal Rule, TDD, type safety
- `.agent/directives/schema-first-execution.md` - Generator-first architecture
- `.agent/directives/testing-strategy.md` - Unit → integration → E2E
- `docs/architecture/curriculum-ontology.md` - Domain model reference
