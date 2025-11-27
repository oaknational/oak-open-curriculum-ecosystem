# SDK and MCP Enhancements

This directory contains plans for enhancing the Oak Curriculum SDK and MCP (Model Context Protocol) infrastructure.

---

## Plan Index

| Plan                                                                                  | Status     | Duration     | Focus                                            |
| ------------------------------------------------------------------------------------- | ---------- | ------------ | ------------------------------------------------ |
| [01: Tool Metadata Enhancement](./01-mcp-tool-metadata-enhancement-plan.md)           | Phase 0 ✅ | ~4-5 days    | Enriching tool metadata for AI agents            |
| [02: Curriculum Ontology Resource](./02-curriculum-ontology-resource-plan.md)         | PLANNED    | ~4 weeks     | Exposing domain model as MCP resource            |
| [03: Infrastructure & Advanced Tools](./03-mcp-infrastructure-advanced-tools-plan.md) | PLANNED    | ~12-14 weeks | Architecture evolution and advanced capabilities |

---

## Plan Summaries

### 01: MCP Tool Metadata Enhancement

Enhances MCP tool metadata to improve ChatGPT/OpenAI Apps SDK integration:

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
Plan 01 (Metadata)     Plan 02 (Ontology)
       ↘                 ↙
    Plan 03 Phase 0
    (Aggregated Tools Refactor)
              ↓
    Plan 03 Phases 1-4
    (Infrastructure + Advanced)
```

- Plans 01 and 02 can run **in parallel** after Plan 03 Phase 0 completes
- Plan 03 Phase 0 is the **foundation** for all advanced work
- Plan 02 is a **prerequisite** for Plan 03 Phase 4 (advanced tools use ontology)

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
