# ADR-075: Dense Vector Code Removal

**Status**: Implemented ✅  
**Date**: 2025-12-12  
**Implemented**: 2025-12-15  
**Decision Makers**: Development Team  
**Supersedes**: [ADR-071](071-elastic-native-dense-vector-strategy.md), [ADR-072](072-three-way-hybrid-search-architecture.md), [ADR-073](073-dense-vector-field-configuration.md)

## Context

Phase 2 of the semantic search project evaluated three-way hybrid search (BM25 + ELSER + E5 dense vectors) as documented in ADR-071, ADR-072, and ADR-073. The hypothesis was that dense vectors would provide measurable improvements over two-way hybrid (BM25 + ELSER).

**Experimental Results (Phase 2)**:

| Metric      | Two-Way (BM25 + ELSER) | Three-Way (+ E5) | Delta  |
| ----------- | ---------------------- | ---------------- | ------ |
| **MRR**     | 0.900                  | 0.897            | -0.003 |
| **NDCG@10** | 0.710                  | 0.708            | -0.002 |
| **Latency** | 180ms p95              | 240ms p95        | +33%   |

**Conclusion**: E5 dense vectors provided **no measurable benefit** for curriculum search while adding latency and complexity.

## Problem Statement

Dense vector code remains in the codebase despite providing no benefit. This dead code:

1. Increases complexity and maintenance burden
2. Slows down ingestion (unnecessary embedding generation)
3. Increases ES storage costs (384-dim vectors per document)
4. Confuses future maintainers about the search architecture

## Decision

**Remove all dense vector generation, storage, and query code from the codebase.**

### Scope of Removal

1. **Document Transforms** (`document-transforms.ts`):
   - Remove `generateDenseVector()` calls
   - Remove `lesson_dense_vector`, `title_dense_vector`, `unit_dense_vector`, `rollup_dense_vector` field assignments

2. **Dense Vector Module** (`dense-vector-generation.ts`):
   - Delete the entire module

3. **Query Builders** (`rrf-query-builders.ts`):
   - Remove any kNN retriever code (none should exist after Phase 2 cleanup)

4. **ES Index Mappings** (field definitions):
   - Remove dense_vector field definitions from SDK
   - Run `pnpm type-gen` to regenerate mappings

5. **Tests**:
   - Remove tests for dense vector functionality

### Code Removed (Implementation Complete 2025-12-15)

All dense vector code has been removed:

| Component                                  | Status               |
| ------------------------------------------ | -------------------- |
| Three-way RRF query construction           | ✅ Removed (Phase 2) |
| kNN retriever in hybrid search             | ✅ Removed (Phase 2) |
| `generateDenseVector()` function           | ✅ Removed           |
| `dense-vector-generation.ts` module        | ✅ Deleted           |
| Dense vector fields in document transforms | ✅ Removed           |
| Dense vector field definitions in SDK      | ✅ Removed           |
| Rerank experiment dense vector logic       | ✅ Removed           |
| Unit tests for dense vectors               | ✅ Deleted           |

**Verification complete**: `grep -r "dense_vector\|generateDenseVector" apps/oak-search-cli/src` returns no matches.

## Consequences

### Positive

1. **Simpler codebase**: Removes ~300 lines of unused code
2. **Faster ingestion**: No E5 API calls (~50ms per document saved)
3. **Lower storage**: No dense vector fields in ES (~3KB per document saved)
4. **Clearer architecture**: Two-way hybrid (BM25 + ELSER) is the definitive approach
5. **Reduced confusion**: No dead code paths for maintainers to understand

### Negative

1. **Future flexibility**: If dense vectors become useful, code must be rewritten
2. **Lost experiment code**: Phase 2 experiment code will be in git history only

### Mitigations

- Git history preserves all dense vector code for reference
- ADRs 071-073 document the original design and rationale
- If dense vectors are needed in future, lessons learned are documented

## Validation Criteria

This decision is successful when:

1. `grep -r "dense_vector" apps/oak-search-cli` returns no matches
2. `grep -r "generateDenseVector" apps/oak-search-cli` returns no matches
3. All quality gates pass
4. Ingestion completes without E5 inference calls

## Why Two-Way Hybrid is Sufficient

For curriculum search, two-way hybrid (BM25 + ELSER) provides:

- **MRR 0.908** (lessons), **MRR 0.915** (units) - exceeds 0.70 target
- **Zero-hit rate 0%** - all queries return relevant results
- **Lower latency** than three-way (180ms vs 240ms p95)

ELSER's learned sparse representations capture semantic relationships sufficiently well for curriculum terminology. Dense vectors add redundancy without improving recall.

See: <https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search-elser.html>

## Related Documents

- [ADR-071](071-elastic-native-dense-vector-strategy.md) - Original E5 decision (SUPERSEDED)
- [ADR-072](072-three-way-hybrid-search-architecture.md) - Three-way RRF (SUPERSEDED)
- [ADR-073](073-dense-vector-field-configuration.md) - Dense vector config (SUPERSEDED)
- [ADR-074](074-elastic-native-first-philosophy.md) - Elastic-native philosophy (still valid)
- [ADR-076](076-elser-only-embedding-strategy.md) - ELSER-only strategy (replaces this area)

## References

- Phase 2 experiment results: `.agent/plans/semantic-search/archive/phase-2-dense-vectors-COMPLETE.md`
- ELSER documentation: <https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search-elser.html>
