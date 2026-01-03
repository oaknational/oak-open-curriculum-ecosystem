# Post-SDK Extraction Work

**Purpose**: Work that REQUIRES the Search SDK to exist before it can begin.

**Dependency**: SDK extraction must be complete (see [../sdk-extraction/](../sdk-extraction/))

---

## Plans in This Folder

| Plan | Prerequisites | Description |
|------|---------------|-------------|
| [mcp-search-tool.md](mcp-search-tool.md) | SDK extraction | Expose search via MCP for AI agents |
| [tier-4-ai-enhancement.md](tier-4-ai-enhancement.md) | Tiers 1-3 exhausted | LLM pre-processing, intent classification |
| [advanced-features.md](advanced-features.md) | SDK stable | RAG, knowledge graph, multi-vector fields |

---

## Why These Require the SDK

1. **MCP Search Tool** — Needs to call SDK services, not Next.js internals
2. **Tier 4 AI Enhancement** — LLM integration patterns require clean SDK interfaces
3. **Advanced Features** — RAG and knowledge graph work builds on SDK abstractions

---

## Tier 4 Entry Criteria

Per [ADR-082: Fundamentals-First Strategy](../../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md):

**Only consider Tier 4 if:**
1. Tiers 1-3 are exhausted (all checklists complete)
2. Aggregate MRR plateau demonstrated (≤5% improvement × 3 experiments)
3. Specific category gaps remain that cannot be addressed by traditional means
4. Cost/benefit analysis completed

---

## Related Documents

- [../sdk-extraction/](../sdk-extraction/) — Prerequisites for this work
- [../search-acceptance-criteria.md](../search-acceptance-criteria.md) — Tier definitions
- [../roadmap.md](../roadmap.md) — Authoritative milestone sequence

