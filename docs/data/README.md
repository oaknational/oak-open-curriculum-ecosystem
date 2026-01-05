# Curriculum Data Documentation

This directory contains documentation about the Oak curriculum data structure, variances, and characteristics.

## Contents

| Document                               | Purpose                                                                    |
| -------------------------------------- | -------------------------------------------------------------------------- |
| [DATA-VARIANCES.md](DATA-VARIANCES.md) | **Essential**: Comprehensive reference for all curriculum data differences |

## Key Insights

### 13 Sections Covering

1. Transcript availability by subject
2. Category availability (English, Science, RE only)
3. Structural patterns (7 types) for API traversal
4. KS4-specific metadata (tiers, exam boards, unit options)
5. Key stage coverage gaps
6. API vs Bulk Download differences
7. Bulk download data integrity issues
8. RSHE-PSHE availability (missing from bulk)
9. API pagination bug
10. Entity relationships
11. Search quality by data shape
12. **Type consistency issues** — year format, null handling, duplicates
13. API schema insights

### Transcript Availability

| Category       | Coverage                | Subjects                                                          |
| -------------- | ----------------------- | ----------------------------------------------------------------- |
| Full (96-100%) | Rich semantic search    | Most subjects (Maths, English, Science, History, Geography, etc.) |
| Partial (~29%) | Limited semantic search | **PE Secondary**                                                  |
| None (<1%)     | Structure-only search   | **French, Spanish, German, PE Primary**                           |

### Bulk Download Issues

| Issue                     | Impact                                                  |
| ------------------------- | ------------------------------------------------------- |
| **513 duplicate lessons** | 2025-12-30: Maths, English, Geography, History, Science |
| **Missing tier metadata** | Maths KS4 only                                          |
| **RSHE-PSHE missing**     | Entire subject unavailable                              |
| **Null title fields**     | Despite slug being populated                            |

### Type Consistency Issues

| Issue                      | Example                           | Impact                   |
| -------------------------- | --------------------------------- | ------------------------ |
| **Year as 3 types**        | `3` vs `"3"` vs `"year-3"`        | SDK must normalize       |
| **Null as 4 semantics**    | `null` vs `"NULL"` vs `[]` vs ∅   | Complex type guards      |
| **Inconsistent API types** | year is `number` or `string` enum | Schema generation issues |

### KS4 Complexity

KS4 has additional metadata not present in KS1-3:

- **Tiers**: Foundation/Higher (Maths, Science only)
- **Exam boards**: AQA, OCR, Edexcel, Eduqas, etc.
- **Pathways**: Core/GCSE
- **Exam subjects**: Biology, Chemistry, Physics (Science only)
- **Unit options**: Set texts, specialisms, topics

### Categories

Only 3 subjects have categories:

- **English**: Grammar, Handwriting, Reading/writing/oracy
- **Science**: Biology, Chemistry, Physics
- **Religious Education**: Theology, Philosophy, Social science

## Related Documentation

### In SDK

- [ontology-data.ts](../../packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts) — Domain model, structural patterns
- [knowledge-graph-data.ts](../../packages/sdks/oak-curriculum-sdk/src/mcp/knowledge-graph-data.ts) — Entity relationships

### In Agent Plans

- [Semantic Search Plans](../../.agent/plans/semantic-search/) — Roadmap, acceptance criteria
- [Filter Testing](../../.agent/plans/semantic-search/pre-sdk-extraction/comprehensive-filter-testing.md) — Filter matrix
- [MFL Limitations](../../.agent/plans/semantic-search/post-sdk-extraction/mfl-multilingual-embeddings.md) — MFL search issues
