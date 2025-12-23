# Evaluation

This directory contains all tools for measuring and analyzing search quality, including both post-hoc analysis scripts and hypothesis-testing experiments.

## Purpose

Evaluation code is held to the same standards as `src/` but is allowed to use `console.log` for human-readable output.

## Directory Structure

```text
evaluation/
├── analysis/           # Post-hoc measurement and reporting
│   ├── analyze-diagnostic-queries.ts
│   ├── analyze-per-category.ts
│   └── README.md
├── experiments/        # Hypothesis-testing experiments
│   ├── current/        # Active/accepted experiments
│   ├── historical/     # Rejected/superseded experiments
│   └── README.md
└── README.md          # This file
```

## Quick Start

**Analysis scripts** (run via npm):

```bash
pnpm eval:diagnostic      # Analyze 18 diagnostic queries by pattern
pnpm eval:per-category    # Analyze hard query baseline by category
```

**Experiments** (run via vitest):

```bash
pnpm vitest run -c vitest.experiment.config.ts
```

## When to Use Each

### Use `analysis/` when:

- You have a known set of queries and want to measure performance
- You're generating a report or baseline
- You want human-readable console output
- Examples: baseline measurements, diagnostic analysis, per-category breakdowns

### Use `experiments/` when:

- You're testing a hypothesis about search improvements
- You need repeatable, automated test framework
- You want pass/fail assertions with vitest
- Examples: hybrid vs single retrieval, A/B comparisons, new algorithm testing

## Code Quality Standards

- **TypeScript**: Strict mode, all types must be explicit
- **Complexity**: Max 8 cyclomatic complexity
- **Function length**: Max 50 lines
- **File length**: Max 250 lines
- **Console.log**: ✅ Allowed (unlike `src/`)

## Adding New Evaluation Scripts

1. Create a new `.ts` file in this directory
2. Follow the same patterns as existing scripts:
   - Load environment variables with `dotenv`
   - Import types and functions from `src/`
   - Use `processQueryResult` and `calculateCategoryMrr` for metrics
   - Output human-readable reports to console
3. Run `pnpm lint:fix` to ensure code quality
4. Add a section to this README documenting the new script

## Related Documentation

- [DIAGNOSTIC-QUERIES.md](../docs/DIAGNOSTIC-QUERIES.md) - Documentation for the diagnostic query suite
- [hard-query-baseline.md](../../../.agent/evaluations/baselines/hard-query-baseline.md) - Baseline performance data
- [EXPERIMENT-LOG.md](../../../.agent/evaluations/EXPERIMENT-LOG.md) - Historical experiment results
