# Evaluation Analysis

Post-hoc measurement scripts that analyze search quality against known query sets.

## Purpose

Analysis scripts measure system performance, generate reports, and provide human-readable output for understanding search behavior.

## Scripts

### `analyze-diagnostic-queries.ts`

Analyzes 18 diagnostic queries (9 synonym, 9 multi-concept) with detailed per-pattern breakdown.

**Usage**:

```bash
pnpm eval:diagnostic
```

**What it measures**:

- Per-pattern MRR for synonym queries (single-word, phrase at start/end/middle, etc.)
- Per-pattern MRR for multi-concept queries (concept+method, explicit AND, etc.)
- Success rates (% of queries in top 3)
- Failure analysis (top 3 results for failing queries)

**Output**: Console report with pattern-by-pattern analysis.

**Created**: 2025-12-23 (B.4a diagnostic analysis)

---

### `analyze-per-category.ts`

Analyzes full hard query baseline (15 queries) with per-category MRR breakdown.

**Usage**:

```bash
pnpm eval:per-category
```

**What it measures**:

- MRR by category (naturalistic, misspelling, synonym, multi-concept, colloquial, intent-based)
- Per-query ranks and MRR values
- Aggregate MRR (with warning that it hides category variation)

**Output**: Console report with category-by-category analysis.

**Created**: 2025-12-23 (to emphasize per-category over aggregate MRR)

---

## Adding New Analysis Scripts

When adding new analysis scripts:

1. **Use structured output**: Clear headers, tables, summaries
2. **Allow console.log**: Analysis scripts should be human-readable
3. **Document the query set**: What queries are being analyzed?
4. **Explain the metrics**: What do the numbers mean?
5. **Add npm script** to `package.json` with `eval:*` prefix
6. **Update this README** with usage and output description

## Code Quality Standards

- **TypeScript**: Strict mode, all types explicit
- **Complexity**: Max 8 cyclomatic complexity
- **Function length**: Max 50 lines
- **File length**: Max 250 lines
- **Console.log**: ✅ Allowed for output
- **Logging**: Use proper logger for errors/debugging

## Related Documentation

- [DIAGNOSTIC-QUERIES.md](../../docs/DIAGNOSTIC-QUERIES.md) - Diagnostic query suite documentation
- [hard-query-baseline.md](../../../.agent/evaluations/baselines/hard-query-baseline.md) - Baseline performance data
- [EXPERIMENT-LOG.md](../../../.agent/evaluations/EXPERIMENT-LOG.md) - Historical experiment results
- [current-state.md](../../../.agent/plans/semantic-search/current-state.md) - Current system metrics
