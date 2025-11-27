# SDK and MCP Enhancements

This directory contains plans for enhancing the Oak Curriculum SDK and MCP (Model Context Protocol) infrastructure.

---

## Plan Index

| Plan                                                                                  | Status     | Duration     | Focus                                            |
| ------------------------------------------------------------------------------------- | ---------- | ------------ | ------------------------------------------------ |
| [00: Ontology POC](./00-ontology-poc-static-tool.md)                                  | PLANNED    | ~1 hour      | Quick static tool to validate ontology value     |
| [01: Tool Metadata Enhancement](./01-mcp-tool-metadata-enhancement-plan.md)           | Phase 0 ✅ | ~4-5 days    | Enriching tool metadata for AI agents            |
| [02: Curriculum Ontology Resource](./02-curriculum-ontology-resource-plan.md)         | PLANNED    | ~4 weeks     | Exposing domain model as MCP resource            |
| [03: Infrastructure & Advanced Tools](./03-mcp-infrastructure-advanced-tools-plan.md) | PLANNED    | ~12-14 weeks | Architecture evolution and advanced capabilities |

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

## Dependencies

```
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
```

- **Plan 00** is a quick POC that validates ontology value (~1 hour, content pre-authored)
- **Plan 02** replaces Plan 00 when POC proves value
- Plans 01 and 02 can run **in parallel** after Plan 03 Phase 0 completes
- Plan 03 Phase 0 is the **foundation** for all advanced work
- Plan 02 is a **prerequisite** for Plan 03 Phase 4 (advanced tools use ontology)
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
