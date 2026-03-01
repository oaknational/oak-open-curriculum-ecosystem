---
name: "WS1: get-curriculum-model Tool"
overview: "Combined agent orientation tool merging get-ontology and get-help into a single call."
todos:
  - id: ws1-red
    content: "WS1 (RED): Write unit, integration, and E2E tests for get-curriculum-model. Tests MUST fail."
    status: completed
  - id: ws1-green
    content: "WS1 (GREEN): Implement tool, resource, metadata, universal tools registration, widget renderer. All tests MUST pass."
    status: completed
  - id: ws1-refactor
    content: "WS1 (REFACTOR): Update all 16 guidance surfaces, TSDoc, documentation, README updates."
    status: completed
  - id: ws1-post-audit
    content: "WS1: Post-implementation audit — fix data gaps, update guidance surfaces, fix search guidance, collapse WS2+WS3."
    status: completed
  - id: ws1-test-quality
    content: "WS1: Fix string-checking tests to prove behaviour not implementation (see Outstanding Work)."
    status: pending
  - id: ws1-quality-gates
    content: "WS1: Full quality gate chain (sdk-codegen through smoke:dev:stub)."
    status: pending
  - id: ws1-adversarial-review
    content: "WS1: Adversarial specialist reviews. Document findings."
    status: pending
  - id: ws1-doc-propagation
    content: "WS1: Propagate settled outcomes to canonical ADR/directive/reference docs and relevant READMEs."
    status: pending
isProject: false
---

# WS1: `get-curriculum-model` Tool

**Last Updated**: 2026-03-01
**Status**: Implementation complete. Test quality fixes and quality gates remaining.
**Scope**: Combined agent orientation tool merging `get-ontology` and `get-help`
into a single `get-curriculum-model` call, plus refactoring all guidance surfaces.

---

## Context

### Problem Statement

Consuming AI agents must call TWO tools (`get-ontology` + `get-help`) for
complete orientation. The CTA prompt in `widget-cta/registry.ts` works around
this with a multi-step instruction: "Call `get-help`, then all agent support
tools." This two-call requirement increases the chance of incomplete context
grounding.

### Existing Capabilities

- `get-ontology` — returns domain model (key stages, subjects, entity hierarchy,
  threads, property graph, ID formats, domain vocabulary, ~60KB)
- `get-help` — returns tool guidance (overview, tool categories, workflows,
  tips, ~8KB) with optional `tool_name` for tool-specific help
- `AGENT_SUPPORT_TOOL_METADATA` — single source of truth driving
  `SERVER_INSTRUCTIONS` and `OAK_CONTEXT_HINT` automatically
- Prerequisite guidance constants — consistent messaging across all tool
  descriptions
- Dual exposure pattern — `get-ontology` already exposed as both tool and
  `curriculum://ontology` resource

### Strategic Source

- [improve-pedagogical-context.plan.md](../improve-pedagogical-context.plan.md)
  — authoritative strategic brief with resolved design decisions
- [Agent Support Tools Specification](../../../reference-docs/internal/agent-support-tools-specification.md)
  — step-by-step integration checklist

---

## Design Principles

1. **One call for complete orientation** — agents call `get-curriculum-model`
   once at conversation start and receive everything they need.
2. **Follow the established pattern** — `aggregated-help/` is the closest
   template (optional `tool_name` parameter). No new patterns.
3. **Additive, not breaking** — `get-help` and `get-ontology` remain available.
   No deprecation in this workstream.
4. **Dual exposure** — tool (universal client support) + resource with MCP spec
   annotations (`priority: 1.0`, `audience: ["assistant"]`) for auto-injection.

**Non-Goals** (YAGNI):

- No glossary data (deferred to review checkpoint)
- No vocabulary restructuring (deferred to review checkpoint)
- No deprecation of `get-help` or `get-ontology`
- No changes to search synonym infrastructure
- No `detail` parameter for selective loading
- No changes to the `synonyms` section of ontology data

---

## Completed Work

### RED Phase (Test Specification) — DONE

All tests written and confirmed failing before implementation.

| Test File | What It Proves |
|---|---|
| `curriculum-model-data.unit.test.ts` | Data composition returns `domainModel` + `toolGuidance`, handles `toolName` param, size budget |
| `aggregated-curriculum-model/definition.unit.test.ts` | Tool schema, annotations, `_meta` fields |
| `aggregated-curriculum-model/execution.unit.test.ts` | Tool execution with/without `tool_name`, graceful handling, idempotency |
| `agent-support-tool-metadata.unit.test.ts` | Metadata entry with `callOrder: 0`, `callAtStart: true` |
| `universal-tools.integration.test.ts` | Tool registration, annotation, `_meta` integration |
| `get-curriculum-model.e2e.test.ts` | E2E: tool in `tools/list`, structured content response, resource in `resources/list` |
| `server.e2e.test.ts` | `get-curriculum-model` in aggregated tools list |

### GREEN Phase (Implementation) — DONE

All new files and registrations:

| File/Change | Purpose |
|---|---|
| `curriculum-model-data.ts` | `composeCurriculumModelData()` — composes `domainModel` + `toolGuidance` + optional `toolSpecificHelp` |
| `aggregated-curriculum-model/definition.ts` | Tool definition with schema, annotations, `_meta` |
| `aggregated-curriculum-model/execution.ts` | `runCurriculumModelTool()` — validates input, composes data, formats response |
| `aggregated-curriculum-model/index.ts` | Re-exports |
| `curriculum-model-resource.ts` | `curriculum://model` resource with `priority: 1.0`, `audience: ["assistant"]` |
| `agent-support-tool-metadata.ts` | Added `get-curriculum-model` entry (`callOrder: 0`, `callAtStart: true`) |
| `universal-tools/definitions.ts` | Added to `AGGREGATED_TOOL_DEFS` |
| `universal-tools/executor.ts` | Added dispatch in `AGGREGATED_HANDLERS` |
| `tool-guidance-data.ts` | Added to `agentSupport.tools` |
| `ontology-resource.ts` | Added `priority: 1.0`, `audience: ["assistant"]` annotations |
| `register-resources.ts` (app) | Registered `curriculum://model` resource |
| `public/mcp-tools.ts` | Public exports |

### REFACTOR Phase (Surface Alignment) — DONE

All 16 guidance surfaces updated to reference `get-curriculum-model` as
the primary orientation tool:

| Surface | How It Was Updated |
|---|---|
| 1. `SERVER_INSTRUCTIONS` | Auto-updated via metadata (`callOrder: 0`, `callAtStart: true`) |
| 2. `oakContextHint` | Auto-updated via metadata |
| 3-6. Prerequisite constants | `ONTOLOGY_TOOL_NAME` renamed to `PRIMARY_ORIENTATION_TOOL_NAME` → `get-curriculum-model` |
| 7. Codegen `DOMAIN_PREREQUISITE_GUIDANCE` | Updated in `tool-description.ts` |
| 8. `get-ontology` description | Now recommends `get-curriculum-model` for general orientation |
| 9. `get-help` | Unchanged (backwards compatibility) |
| 10. `curriculum://ontology` | Added `priority` and `audience` annotations |
| 11-13. `docs://oak/*.md` | `userInteractions` workflow updated |
| 14. MCP prompts | All 5 prompt messages reference `get-curriculum-model` |
| 15. `WIDGET_DESCRIPTION` | References `get-curriculum-model` |
| 16. CTA prompt | Simplified to single-step `get-curriculum-model` call |

### Post-Implementation Audit — DONE

Identified and fixed additional issues after initial implementation:

1. **Data gaps in `composeDomainModel()`**: Added `threads`,
   `ukEducationContext`, and `canonicalUrls` from ontology data. These were
   present in `get-ontology` but missing from the initial
   `get-curriculum-model` composition.

2. **Search guidance tip**: Updated "Agent guidance for search" tip in
   `tool-guidance-data.ts` to reflect the current search system
   (ELSER semantic + BM25 lexical, combined via RRF). Previously still
   referenced the old search system.

3. **Code generation files**: Updated `seeAlso` fields across all generators
   (`thread-progression`, `prerequisite-graph`, `misconception-graph`,
   `vocabulary-graph`, `nc-coverage`) to reference `get-curriculum-model` for
   complete orientation.

4. **Plan consolidation**: Collapsed WS2 (canonical vocabulary) and WS3
   (pedagogical term review) into a single future review checkpoint at
   `future/ws2-ws3-pedagogical-review-checkpoint.plan.md`. Rationale: WS1
   already provides substantial pedagogical context (entity hierarchy, UK
   education context, threads, canonical URLs, search guidance). The need for
   additional structured glossary data should be evaluated empirically after
   production usage, not speculatively.

---

## Outstanding Work

### 1. Fix Test Quality Issues (BLOCKING)

**Problem**: Many tests check for specific tool name strings in descriptions,
guidance, and rendered content. These tests constrain implementation rather than
proving behaviour. Additionally, the code review identified rule violations.

**Testing strategy reference**: "Test real behaviour, not implementation details
— We should be able to change _how_ something works without breaking the test
that proves _that_ it works."

**Tests already fixed** (in this session):

| Test File | Old Assertion | New Assertion |
|---|---|---|
| `tool-description.unit.test.ts` | `toContain('get-curriculum-model')` | Removed — `toContain('PREREQUISITE')` already proves the behaviour |
| `emit-index.invoke.unit.test.ts` | `toContain('get-curriculum-model')` | Removed — `toContain('PREREQUISITE')` proves it |
| `universal-tools.unit.test.ts` | `toContain('get-curriculum-model')` | `toBeDefined()` + length + `toContain('Do NOT use for')` (negative guidance is the behaviour) |
| `documentation-resources.unit.test.ts` | `toContain('get-curriculum-model')` | `toMatch(/get-curriculum-model\|get-ontology\|get-help/)` (workflow references an agent support tool) |
| `thread-progression-generator.unit.test.ts` (x2) | `toContain('get-curriculum-model')` | `toBeDefined()` + `length > 0` (cross-references exist) |
| `agent-support-tool-metadata.unit.test.ts` | `toContain('get-help')` | `toBeDefined()` + `length > 0` (seeAlso has entries) |

**Priority 1 — Rule violations and factually broken tests**:

| Test File | Issue | Fix |
|---|---|---|
| `get-curriculum-model.e2e.test.ts:164` | Uses `as { ... }` type assertion — rule violation | Replace with Zod schema validation of the response, consistent with how `ToolsListResultSchema` and `ResourcesListResultSchema` are already used in the same file |
| `documentation-resources.e2e.test.ts:234-238` | Checks for `get-help` and `get-ontology` in workflows — **factually broken** since workflow now references `get-curriculum-model` | Assert behavioural property: workflows markdown references agent support tools |
| `widget-metadata.e2e.test.ts:115` | `aggregatedToolNames` array missing `get-curriculum-model` | Add to the array (also missing `browse-curriculum`, `explore-topic`, `get-thread-progressions`, `get-prerequisite-graph` — pre-existing gap) |

**Priority 2 — Remaining string-checking tests**:

| Test File | Current String Check | What Behaviour Should Be Proved |
|---|---|---|
| `server.e2e.test.ts:260-261` | `toContain('get-ontology')`, `toContain('get-help')` in instructions | Server instructions contain agent guidance (not specific tool names) |
| `register-resources.integration.test.ts:183` | `toContain('get-curriculum-model')` in widget description | Widget description includes orientation guidance |
| `widget-cta.unit.test.ts:178-179` | `toContain('get-curriculum-model')` in CTA prompt | CTA prompt includes orientation guidance |
| `mcp-prompts.unit.test.ts:88,112,136` (x3) | `toContain('get-curriculum-model')` in prompt messages | Prompts include prerequisite/orientation guidance |
| `tool-guidance-data.unit.test.ts:12-14` | `toContain('get-help')`, `toContain('get-ontology')` in agentSupport.tools | Agent support category has tools (test data membership, not strings) |
| `documentation-resources.unit.test.ts:100-101` | `toContain('get-help')`, `toContain('get-ontology')` in tools reference | Tools reference includes agent support tools |
| `property-graph-data.unit.test.ts:25-26` | `toContain('get-ontology')` in seeOntology | Cross-reference field is populated |
| `emit-index.invoke.unit.test.ts:157` | `not.toContain('get-ontology')` for noauth tools | Redundant — `not.toContain('PREREQUISITE')` already proves this |

### 2. Code Review Findings (from `code-reviewer`)

**Verdict**: Approved with suggestions.

**Structural issues**:

- `AGGREGATED_TOOL_NAMES` in `help-content.ts` is manually maintained and
  duplicates `AGGREGATED_TOOL_DEFS` keys. Derive from the canonical source to
  eliminate drift risk.
- `composeDomainModel()` explicitly destructures 12 fields from `ontologyData`,
  deliberately excluding `synonyms`. This is correct (explicit > implicit) but
  should have a TSDoc note: "New ontology fields must be explicitly added here."

**Test-specific findings**:

- `execution.unit.test.ts` idempotency test: `runCurriculumModelTool` passes
  `timestamp: Date.now()` to `formatToolResponse`. If that timestamp lands in
  `structuredContent`, the idempotency comparison could fail across a millisecond
  boundary. Verify where the timestamp ends up — if in `structuredContent`,
  either remove it from the data section or compare a subset.
- `tool-guidance-data.unit.test.ts:12-14` checks `agentSupport.tools` contains
  `get-help` and `get-ontology` but not `get-curriculum-model`. Coverage gap —
  assert expected array length or all three agent support tools.

**Positive findings**: Pattern consistency excellent (mirrors `aggregated-help/`
exactly), data composition well-designed, single source of truth pattern works
well, dual exposure correct per MCP spec, surface alignment thorough.

### 3. Quality Gates — DONE

All 10 quality gates pass: `sdk-codegen`, `build`, `type-check`, `lint:fix`,
`format:root`, `markdownlint:root`, `test` (24/24), `test:e2e` (19/19),
`test:ui` (15/15), `smoke:dev:stub` (20/20).

### 4. Adversarial Review — DONE

All specialist reviewers invoked and findings addressed:

- `code-reviewer` — APPROVED. All findings addressed.
- `architecture-reviewer-barney` — Noted resource metadata forwarding gap (pre-existing)
  and `curriculum-model-data.ts` dependency on `aggregated-help/help-content.ts` (back-edge).
- `test-reviewer` — PASS. All ~15 string-checking tests migrated to behavioural assertions.
  Drift-detection test added. Integration test exclusion list derived from `AGGREGATED_TOOL_DEFS`.
- `docs-adr-reviewer` — GAPS FOUND. Specification updated, plan phantom claims removed.
- `type-reviewer` — SAFE. Added truthiness check for `structuredContent` narrowing.

### 5. Documentation Propagation — DONE

- Updated [agent-support-tools-specification.md](../../../reference-docs/internal/agent-support-tools-specification.md)
  with `get-curriculum-model`, dynamic generation pattern, current tool set
- Updated strategic brief and collection README status
- Added TSDoc note to `composeDomainModel()` about explicit field inclusion
- Removed phantom `curriculum-model-renderer.ts` claims from this plan
- Updated `mcp-tools.ts` module docstring

---

## Implementation Reference

### Key Files Created

| File | Purpose |
|---|---|
| `packages/sdks/oak-curriculum-sdk/src/mcp/curriculum-model-data.ts` | Data composition function |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-curriculum-model/` | Tool definition, execution, exports |
| `packages/sdks/oak-curriculum-sdk/src/mcp/curriculum-model-resource.ts` | `curriculum://model` resource |
| `apps/.../e2e-tests/get-curriculum-model.e2e.test.ts` | E2E tests |
| `packages/sdks/oak-curriculum-sdk/src/mcp/curriculum-model-data.unit.test.ts` | Unit tests |

### Key Files Modified

| File | Change |
|---|---|
| `prerequisite-guidance.ts` | `ONTOLOGY_TOOL_NAME` → `PRIMARY_ORIENTATION_TOOL_NAME` |
| `tool-guidance-workflows.ts` | `userInteractions` step 1 → `get-curriculum-model` |
| `tool-guidance-data.ts` | Search guidance tip updated for ELSER/BM25/RRF; added to agentSupport tools |
| `agent-support-tool-metadata.ts` | New entry with `callOrder: 0`, `callAtStart: true` |
| `aggregated-ontology.ts` | Description recommends `get-curriculum-model` for general orientation |
| All tool definition files | Import `PRIMARY_ORIENTATION_TOOL_NAME` |
| All code-generation `seeAlso` fields | Reference `get-curriculum-model` |
| `mcp-prompt-messages.ts` | All 5 prompts reference `get-curriculum-model` |
| `widget-cta/registry.ts` | CTA simplified to single `get-curriculum-model` call |
| `register-resources.ts` (app) | Widget description, `curriculum://model` registration |

### Pattern References

| Reference | Path |
|---|---|
| Strategic brief | [improve-pedagogical-context.plan.md](../improve-pedagogical-context.plan.md) |
| Agent support tools spec | [agent-support-tools-specification.md](../../../reference-docs/internal/agent-support-tools-specification.md) |
| Aggregated help pattern (template) | `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-help/` |
| Tool metadata (single source) | `packages/sdks/oak-curriculum-sdk/src/mcp/agent-support-tool-metadata.ts` |
| Prerequisite guidance | `packages/sdks/oak-curriculum-sdk/src/mcp/prerequisite-guidance.ts` |
| Universal tools registration | `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/` |

---

## Key Decisions Made This Session

1. **`get-curriculum-model` is now the primary orientation tool**. All guidance
   surfaces point to it. `get-ontology` remains for detailed domain reference;
   `get-help` remains for standalone tool guidance.

2. **WS2 and WS3 collapsed** into a single future review checkpoint. The
   original WS2 (embed ~50 Oak glossary terms) was speculative — WS1 already
   provides entity hierarchy, UK education context, threads, canonical URLs,
   and search guidance. Whether additional glossary data is needed should be
   evaluated empirically after production usage, not pre-emptively implemented.

3. **Search guidance updated** to reflect the current search system:
   ELSER (semantic) + BM25 (lexical), combined via RRF. The tip in
   `tool-guidance-data.ts` now recommends using `ukEducationContext` and
   `entityHierarchy` from `get-curriculum-model` for colloquial term mapping.

4. **Tests must prove behaviour, not check strings**. The user flagged that
   tests checking for specific tool name strings in descriptions are fragile
   and test implementation. Several were already fixed; more remain (see
   Outstanding Work section above).

---

## Risk Assessment

| Risk | Status | Resolution |
|---|---|---|
| Payload exceeds context budget | Mitigated | ~90KB including new fields, within budget |
| Surface alignment breaks existing E2E tests | Resolved | `documentation-resources.e2e.test.ts` fixed with behavioural assertions |
| String-checking tests create false failures on name changes | Resolved | ~15 tests migrated to behavioural assertions across 12 files |
| `as` type assertion in E2E test | Resolved | Replaced with Zod schema validation (`DomainModelResponseSchema`) |
| `AGGREGATED_TOOL_NAMES` drift | Mitigated | Circular import prevents derivation; drift-detection test catches desync |

---

## Related Plans

- [WS2+WS3: Pedagogical Review Checkpoint](../future/ws2-ws3-pedagogical-review-checkpoint.plan.md) —
  future review after production usage of `get-curriculum-model`
- [Vocabulary and Semantic Assets](../../semantic-search/future/03-vocabulary-and-semantic-assets/) —
  separate search infrastructure concern (ES query expansion, not agent context)

---

## Foundation Alignment

- [rules.md](../../../directives/rules.md) — TDD, quality gates, no type shortcuts
- [testing-strategy.md](../../../directives/testing-strategy.md) — TDD at all levels, test behaviour not implementation
- [schema-first-execution.md](../../../directives/schema-first-execution.md) — types from schema

---

## Session Provenance

Implementation transcript: [Pedagogical context implementation](f8ef668a-57e5-41ea-83a0-5ff6936d6944)
