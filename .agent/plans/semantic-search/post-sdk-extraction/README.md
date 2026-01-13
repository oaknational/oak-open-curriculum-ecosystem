# Post-SDK Extraction Work

**Purpose**: Work that REQUIRES the Search SDK to exist before it can begin.

**Dependency**: SDK extraction must be complete (see [../sdk-extraction/](../sdk-extraction/))

---

## Plans in This Folder

| Plan | Prerequisites | Priority | Description |
|------|---------------|----------|-------------|
| **[mfl-multilingual-embeddings.md](mfl-multilingual-embeddings.md)** | SDK extraction | **HIGH** | Fix 0.19-0.29 MRR for French/Spanish/German |
| [mcp-search-tool.md](mcp-search-tool.md) | SDK extraction | HIGH | Expose search via MCP for AI agents |
| [tier-4-ai-enhancement.md](tier-4-ai-enhancement.md) | Tiers 1-3 exhausted | MEDIUM | LLM pre-processing, intent classification |
| [advanced-features.md](advanced-features.md) | SDK stable | LOW | RAG, knowledge graph, multi-vector fields |

### MFL Search Performance

**[mfl-multilingual-embeddings.md](mfl-multilingual-embeddings.md)** is HIGH PRIORITY because:

- MFL subjects have the worst search performance (French: 0.190, German: 0.194)
- MFL lessons have almost no transcripts (0.2% coverage vs 100% for Maths)
- Teachers of French/Spanish/German deserve working search

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

