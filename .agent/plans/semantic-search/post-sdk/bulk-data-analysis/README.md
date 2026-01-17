# Bulk Data Analysis

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

This work feeds into multiple streams, so it lives in its own stream.

---

## Plans

| Plan | Description | Status |
|------|-------------|--------|
| [vocabulary-mining.md](vocabulary-mining.md) | Synonym classification, science expansion, definition mining | 📋 Pending |

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
- [ ] Artifacts usable by search-quality stream and other consumers
