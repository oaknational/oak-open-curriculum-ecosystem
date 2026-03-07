# Vocabulary and Semantic Assets

**Legacy Working Name**: Bulk Data Analysis

**Domain**: Mining vocabulary and patterns from Oak's curriculum data  
**Intent**: Extract knowledge artifacts that are valuable across multiple use cases  
**Impact**: Better synonyms, definitions, entity relationships — usable by search, MCP, and future systems

---

## Why Separate?

Bulk data analysis produces artifacts valuable **beyond just search**:

- Synonym classifications → Search quality, MCP tool examples
- Definition extractions → Glossary features, RAG context
- Entity relationships → Knowledge graph, curriculum navigation
- Vocabulary patterns → Content generation, curriculum analysis

This work feeds into multiple boundaries, so it lives in its own boundary.

---

## Plans

Active and queued work promoted from this boundary is listed in
[Promoted Work](#promoted-work) below.

| Plan | Description | Status |
|------|-------------|--------|
| [vocabulary-mining.md](vocabulary-mining.md) | Synonym classification, science expansion, definition mining | 📋 Pending |
| [natural-language-paraphrases.md](natural-language-paraphrases.md) | Bucket B: Query-time weak expansions for natural language | 📋 Pending |
| [mfl-synonym-architecture.md](mfl-synonym-architecture.md) | MFL synonym data model quality and DRY refactoring | 📋 Pending |

---

## Research Companions

| Research | Purpose |
|----------|---------|
| [bulk-metadata-opportunities.research.md](bulk-metadata-opportunities.research.md) | Audits lesson/unit bulk signals, second-pass ingestion flow, and unused fields |
| [vocabulary-glossary-and-mining-surfaces.research.md](vocabulary-glossary-and-mining-surfaces.research.md) | Maps vocabulary, glossary, provenance, and richer mining surfaces |

## Promoted Work

| Execution Plan | Purpose |
|----------------|---------|
| [../../active/bulk-metadata-quick-wins.execution.plan.md](../../active/bulk-metadata-quick-wins.execution.plan.md) | Active widening of the bulk metadata surface and standalone session entry for this boundary |
| [../../current/keyword-definition-assets.execution.plan.md](../../current/keyword-definition-assets.execution.plan.md) | Follow-on queued promotion of keyword definitions into canonical assets |

---

## Future Direction

This analysis will eventually move **upstream** to the bulk-data *generation* pipeline. For now, it lives here as a one-time extraction that produces TypeScript artifacts consumed at build time.

---

## Dependencies

- SDK extraction complete (for types)
- Bulk data downloaded (~630MB, 30 files)

---

## Success Criteria

- [ ] Synonym bucket classification complete (~580 entries)
- [ ] Science secondary synonyms expanded (37 → ~200 entries)
- [ ] Definition-derived synonyms extracted
- [ ] Artifacts usable by the retrieval quality boundary and other consumers
