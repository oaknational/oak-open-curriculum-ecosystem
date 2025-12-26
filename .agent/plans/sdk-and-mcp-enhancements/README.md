# SDK and MCP Enhancements

This directory contains plans for enhancing the Oak Curriculum SDK and MCP (Model Context Protocol) infrastructure.

---

## Technical Debt

### Potential Improvements

Potential Improvements (Noted for Future Work, Out of Scope)
Based on the OpenAI Apps SDK documentation exploration:
Widget TOOL_RENDERER_MAP could be generated at type-gen time - Currently hardcoded in widget-preview.html
The distinction between tool descriptor \_meta and result \_meta isn't clearly documented - These serve different purposes
Local reference docs could be expanded - Add the Reference page findings about window.openai API, CSP, and tool result structure

### Incompatible `structuredContent` Shapes

`formatDataWithContext` (used by generated tools in `executor.ts`) and `formatOptimizedResult` (used by aggregated tools) produce incompatible `structuredContent` shapes:

- **`formatDataWithContext`**: `{ status, data: {...}, oakContextHint }` — data wrapped in `data` property
- **`formatOptimizedResult`**: `{ ...fullData, summary, oakContextHint, status }` — data spread at root level

Additionally, `formatOptimizedResult` includes `_meta` with widget metadata (`toolName`, `annotationsTitle`, `query`, `timestamp`) while `formatDataWithContext` does not.

Both tool types have the same OpenAI Apps SDK requirements. These should be unified to produce consistent output that widgets and consumers can rely on.

---

## Plan Index

| Plan                                                                                  | Status         | Duration     | Focus                                               |
| ------------------------------------------------------------------------------------- | -------------- | ------------ | --------------------------------------------------- |
| [00: Ontology POC](./00-ontology-poc-static-tool.md)                                  | PLANNED        | ~1 hour      | Quick static tool to validate ontology value        |
| [01: Tool Metadata Enhancement](./01-mcp-tool-metadata-enhancement-plan.md)           | Phase 0 ✅     | ~4-5 days    | Enriching tool metadata for AI agents               |
| [02: Curriculum Ontology Resource](./02-curriculum-ontology-resource-plan.md)         | PLANNED        | ~4 weeks     | Exposing domain model as MCP resource               |
| [03: Infrastructure & Advanced Tools](./03-mcp-infrastructure-advanced-tools-plan.md) | PLANNED        | ~12-14 weeks | Architecture evolution and advanced capabilities    |
| [04: MCP Prompts & Agent Guidance](./04-mcp-prompts-and-agent-guidance-plan.md)       | 🔴 NOT STARTED | ~1.5 hours   | Fix prompt arg passing, establish agent guidance    |
| [05: Zod v4 Export Implementation](./05-zod-v4-export-implementation-plan.md)         | 🟡 ACTIVE      | ~2-3 days    | Export Zod v4 schemas from SDK; fix TS2589          |
| [06: UX Improvements & Research](./06-ux-improvements-and-research-plan.md)           | 🟡 PHASE A ✅  | ~6-8 hours   | Quick wins, prompt foundations (research → Plan 07) |
| [07: Oak AI Domain Extraction](./07-oak-ai-domain-extraction-research-plan.md)        | 🔴 NOT STARTED | ~16-24 hours | Comprehensive research into Oak AI domain knowledge |
| [08: OpenAI Apps SDK Feature Adoption](./08-openai-apps-sdk-feature-adoption-plan.md) | 🔴 NOT STARTED | ~4-6 days    | Production-ready OpenAI Apps SDK integration        |
| [09: SDK Build Architecture](./09-sdk-build-architecture-plan.md)                      | 🔴 NOT STARTED | ~2-3 days    | Barrel-only exports + build verification            |

---

## Plan Summaries

### 00: Ontology POC (Static Tool)

A quick ~1-hour spike to validate whether ChatGPT uses ontology information effectively:

- Pre-authored JSON content available (`ontology-poc-content.json`)
- `get-ontology` aggregated tool with **full metadata treatment**:
  - MCP annotations (`readOnlyHint`, `idempotentHint`, `title`)
  - OpenAI `_meta` fields (invocation status text)
  - Optimized description ("Use when…" / "Do NOT use for…")
- No type-gen, no schema extraction
- **Purpose**: Prove value before investing in full solution

**Includes**: Threads, programme/sequence distinction, KS4 complexity, all 8 lesson components, tool workflows, UK education context, canonical URLs.

**Design Decision**: Tool (not resource) because we want ChatGPT to decide when to request ontology context (model-controlled).

**Key benefit**: Validates the ontology concept with minimal investment. If successful, proceed to Plan 02.

---

### 01: MCP Tool Metadata Enhancement

Enhances MCP tool metadata to improve ChatGPT/OpenAI Apps SDK integration:

- ⚡ **Quick Win**: STDIO tool description bug fix (~5 mins)
- ✅ **Phase 0**: Tool annotations (COMPLETE)
- **Phase 1**: Invocation status strings (`_meta`)
- **Phase 2**: Security schemes in `_meta`
- **Phase 3**: Parameter examples from OpenAPI
- **Phase 4**: Enhanced error messages
- **Phase 5**: Output schema evaluation
- **Phase 6**: Aggregated tools alignment

**Key benefit**: Better UX in ChatGPT, clearer parameter formats for AI agents.

---

### 02: Curriculum Ontology Resource

Implements a schema-derived curriculum ontology exposed as an MCP resource:

- **Phase 1**: Type-gen schema extractor
- **Phase 2**: Manual guidance JSON layer
- **Phase 3**: MCP resource exposure
- **Phase 4**: Testing
- **Phase 5**: Documentation

**Key benefit**: AI agents understand the Oak Curriculum domain model, entity relationships, and tool composition patterns.

---

### 03: MCP Infrastructure & Advanced Tools

Covers architecture evolution and advanced MCP capabilities:

- **Phase 0**: Aggregated tools type-gen refactor (FOUNDATION)
- **Phase 1**: Infrastructure hardening (rate limiting, type guards)
- **Phase 2**: Tool taxonomy and categorization
- **Phase 3**: Playbooks and commands registry
- **Phase 4**: Advanced tools (bulk ops, filtering, comparison, export)

**Key benefit**: Schema-first architecture, improved maintainability, powerful composite tools.

---

### 04: MCP Prompts & Agent Guidance

Fixes broken prompt argument passing and establishes proper agent guidance architecture:

- **Phase 0**: Validate MCP SDK `registerPrompt` with Zod v4 works correctly
- **Phase 1**: Fix prompt registration using TDD (remove workaround, use SDK correctly)
- **Phase 2**: Fix remaining lint errors and add documentation
- **Phase 3**: Full validation and compliance check

**Key Insight**: The MCP SDK already has Zod v3/v4 compatibility built in. The workaround was unnecessary.

**Key benefit**: Prompts correctly receive arguments; agents can use workflow templates effectively.

**Related ADR**: [ADR-055: Zod Version Boundaries](../../../docs/architecture/architectural-decisions/055-zod-version-boundaries.md)

---

### 05: Zod v4 Export Implementation

Fixes the Zod version boundary issue and resolves the TS2589 type complexity error:

- **Phase 1**: Update SDK type-gen to export Zod v4 schemas (using `zod/v4` from Zod 3.25+)
- **Phase 2**: Resolve TS2589 "Type instantiation excessively deep" error

**Key Insight**: Zod 3.25+ includes `zod/v4` which provides the Zod v4 API. The SDK can generate Zod v3 schemas via `openapi-zod-client` internally, then export Zod v4 equivalents to consumers.

**Key benefit**: Apps receive Zod v4 schemas directly from SDK (schema-first), compatible with MCP SDK, no type assertions needed.

**Related ADR**: [ADR-055: Zod Version Boundaries (Revised)](../../../docs/architecture/architectural-decisions/055-zod-version-boundaries.md)

---

### 06: UX Improvements & Research

Quick wins and foundation work for prompt enhancements:

- **Phase A**: Quick wins (~3 hours) ✅ MOSTLY COMPLETE
  - A.1: Rename `year` → `yearGroup` parameter ✅
  - A.2: Enhance landing page with tools/resources/prompts ✅
  - A.3: Hero text and Playwright tests (pending)
- **Phase B**: Research & discovery → **DELEGATED TO PLAN 07**
- **Phase C**: Foundation work (~4-6 hours) - pending Plan 07 completion
  - C.1: Design `keyStageOrYear` union parameter
  - C.2: Design `quiz-customisation` prompt
  - C.3: Research `adapt-materials` possibilities

**Key benefit**: Foundation for advanced prompts, informed by Plan 07 research.

---

### 07: Oak AI Domain Extraction Research

**⚠️ SCOPE: Research and report ONLY. No code modifications.**

Comprehensive research plan to extract domain knowledge from the Oak AI Lesson Assistant codebase:

- **Strategic Goal**: Extract valuable pedagogical expertise and educational patterns, document thoroughly, then (in future work) rebuild to our standards
- **7 Research Areas**:
  1. Prompt Architecture and Composition
  2. Educational Domain Model
  3. Quiz Generation Expertise
  4. Content Moderation and Safety
  5. Lesson Planning Workflow
  6. Language and Voice
  7. Teaching Materials Generation
- **Duration**: 16-24 hours of focused research
- **Output**: Comprehensive documentation in `.agent/research/aila-modular-extraction/`

**Key benefit**: Preserves years of pedagogical refinement while ensuring longevity through proper software engineering practices.

**This is not a code migration.** This is knowledge archaeology - understanding what domain expertise is encoded in the implementation. Implementation is a separate, subsequent effort.

---

### 08: OpenAI Apps SDK Feature Adoption

Comprehensive adoption of OpenAI Apps SDK features for production readiness:

- **Phase 1**: Widget Resource Metadata (CRITICAL)
  - `openai/widgetCSP` - Content Security Policy (required for production)
  - `openai/widgetPrefersBorder` - Bordered card rendering
  - `openai/widgetDescription` - Reduce assistant narration
- **Phase 2**: Interactive Widget Capabilities
  - `openai/widgetAccessible` - Enable widget→tool calls
  - `window.openai.callTool()` - Pagination, refresh
  - `window.openai.setWidgetState()` - UI state persistence
- **Phase 3**: Token Optimization
  - Tool result `_meta` - Data for widget only (hidden from model)
  - `structuredContent` separation - Minimal data to model
- **Phase 4**: Tool Visibility & Localization
  - `openai/visibility: private` - Hidden admin tools
  - Locale support for UK curriculum terminology
- **Phase 5**: Enhanced Widget Runtime
  - `sendFollowUpMessage()` - Conversational continuity
  - `requestDisplayMode()` - Fullscreen/PiP modes
  - `openExternal()` - Oak website links

**Key benefit**: Production-ready OpenAI Apps SDK integration with token optimization and interactive widgets.

**Reference**: [OpenAI Apps SDK Documentation](../../reference-docs/openai-apps-sdk-reference.md)

---

### 09: SDK Build Architecture

**Background**: The SDK's `tsup.config.ts` entry points must be manually synchronised with exports in `package.json`, `src/index.ts`, and `src/public/*.ts`. This is fragile—when new files are added and exported, they must also be added to tsup.config.ts or the build produces `.d.ts` files without corresponding `.js` files, breaking module resolution.

**Root Cause**: TypeScript (`tsc --emitDeclarationOnly`) generates declarations for ALL source files, but tsup only generates JavaScript for explicitly listed entry points. The mismatch causes "module not found" errors in consumers.

**Proposed Solution** (Barrel-Only Exports + Build Verification):

- **Phase 1**: Restructure exports so barrel files (`index.ts`) are the only tsup entry points
  - All public API flows through explicit barrel re-exports
  - Clear boundaries: barrel files define what's public
  - Aligns with Cardinal Rule (schema-first, generator-driven)

- **Phase 2**: Add post-build verification step
  - Verify every `package.json` export has a corresponding `.js` file
  - Verify every re-export in barrel files resolves to a `.js` file
  - Fail fast when exports diverge from entry points

- **Phase 3**: Consider generator-driven entry points
  - Type-gen could emit the entry points list based on what it generates
  - True schema-first approach for build configuration

**Key benefit**: Eliminates fragile manual synchronisation, fails fast on divergence, aligns with architectural principles.

**Status**: 🔴 NOT STARTED - Quick fix applied (add missing entries); this plan is the long-term solution.

---

## Dependencies

```
Plan 06 Phase A (Quick Wins)     ← START HERE (no dependencies) ✅ MOSTLY DONE
         ↓
     Plan 07 (Oak AI Research)   ← Comprehensive domain extraction (16-24 hours)
         ↓
Plan 06 Phase C (Foundations)    ← Designs informed by Plan 07
         ↓
    Plan 04 (MCP Prompts)        ← Enhanced with Plan 06/07 findings

Plan 05 Phase 1 (Zod v4 Exports)
         ↓
Plan 05 Phase 2 (TS2589 Fix)
         ↓
Plan 04 (MCP Prompts)  ←  unblocked by Plan 05

Plan 00 (POC)  →  Plan 02 (Full Ontology)  →  Upstream API /ontology
    ↓                    ↓
  Validates          Replaces POC

Plan 01 (Metadata)     Plan 02 (Ontology)
       ↘                 ↙
    Plan 03 Phase 0
    (Aggregated Tools Refactor)
              ↓
    Plan 03 Phases 1-4
    (Infrastructure + Advanced)

Plan 08 (OpenAI Apps SDK)  ← Can start immediately (Phase 1 is CRITICAL)
    Phase 1 (CSP)          ← REQUIRED for production deployment
         ↓
    Phase 2 (Interactive)  ← Depends on Plan 01 for tool metadata
         ↓
    Phase 3 (Token Opt)    ← Can run parallel to Phase 2
         ↓
    Phase 4 (Visibility)   ← Depends on Phase 2
         ↓
    Phase 5 (Enhanced UX)  ← Depends on Phase 2

Plan 09 (SDK Build Architecture)  ← Low priority, addresses technical debt
    Phase 1 (Barrel-only)         ← Restructure exports
         ↓
    Phase 2 (Build verification)  ← Fail fast on divergence
         ↓
    Phase 3 (Generator-driven)    ← True schema-first build config
```

- **Plan 08 Phase 1** is **CRITICAL** for production deployment - should start immediately
- **Plan 06 Phase A** has **no dependencies** - quick wins mostly complete ✅
- **Plan 07** is the detailed research plan (formerly Plan 06 Phase B) - 16-24 hours of knowledge extraction
- **Plan 06 Phase C** produces specifications informed by Plan 07 research
- **Plan 05** is the **immediate priority** - fixes Zod versioning foundation for all SDK consumers
- **Plan 04** is unblocked by Plan 05 (prompts use Zod schemas for MCP registration)
- **Plan 00** is a quick POC that validates ontology value (~1 hour, content pre-authored)
- **Plan 02** replaces Plan 00 when POC proves value
- Plans 01 and 02 can run **in parallel** after Plan 03 Phase 0 completes
- Plan 03 Phase 0 is the **foundation** for all advanced work
- Plan 02 is a **prerequisite** for Plan 03 Phase 4 (advanced tools use ontology)
- **Plan 08 Phases 2-5** depend on Phase 1 and benefit from Plan 01 metadata work
- **Upstream API** `/ontology` endpoint is the ideal long-term solution (external dependency)

---

## Archived Plans

The following plans were consolidated into the three plans above:

| Archived                                      | Merged Into          |
| --------------------------------------------- | -------------------- |
| `tool-metadata-alignment-plan.md`             | Plan 01 (Phase 0 ✅) |
| `mcp-tool-metadata-enhancement-plan.md`       | Plan 01              |
| `parameter-examples-metadata-plan.md`         | Plan 01              |
| `curriculum-ontology-resource-plan.md`        | Plan 02              |
| `comprehensive-mcp-enhancement-plan.md`       | Plan 03              |
| `curriculum-tools-guidance-playbooks-plan.md` | Plans 02 & 03        |

See `.agent/plans/archive/` for historical versions.

---

## Related Documentation

- `.agent/directives-and-memory/rules.md` - Cardinal Rule, TDD, type safety
- `.agent/directives-and-memory/schema-first-execution.md` - Generator-first architecture
- `.agent/directives-and-memory/testing-strategy.md` - Unit → integration → E2E
- `docs/architecture/curriculum-ontology.md` - Domain model reference
