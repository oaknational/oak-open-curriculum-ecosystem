# Scripts Directory (Deprecated)

**⚠️ This directory structure has been reorganized (2025-12-23)**

## New Structure

Scripts have been organized into domain-specific directories with proper documentation:

### `operations/` - Production and Development Tooling

**Code Standards**: Same as `src/` - MUST use proper logger, NO console.log

- **`operations/ingestion/`** - Data loading and validation
  - `ingest-all-combinations.ts`, `verify-ingestion.ts`, `check-progress.ts`, etc.
  - Run via: `pnpm ingest:all`, `pnpm ingest:verify`, `pnpm ingest:progress`

- **`operations/observability/`** - Monitoring and maintenance
  - `delete-zero-hit-events.ts`
  - Run via: `pnpm zero-hit:purge`

- **`operations/sandbox/`** - Development and testing
  - `ingest.ts` - Fixture data ingestion
  - Run via: `pnpm sandbox:ingest`

- **`operations/infrastructure/`** - System management
  - `alias-swap.sh` - Blue/green ES index deployment
  - Run via: `pnpm elastic:alias-swap`

- **`operations/utilities/`** - Simple helper scripts
  - `generate-synonyms.ts`, `run-typedoc.ts`
  - Allow console.log for output

### `evaluation/` - Search Quality Analysis

**Code Standards**: Same as `src/` but console.log allowed for human-readable output

- **`evaluation/`** - Analysis and measurement scripts
  - `analyze-diagnostic-queries.ts`, `analyze-per-category.ts`
  - Run via: `pnpm eval:diagnostic`, `pnpm eval:per-category`

- **`evaluation/experiments/`** - Historical experiments
  - `semantic-reranking/` - B.2 rejected experiment (-16.8% regression)

## Why This Change?

**Problems with old structure**:

- ❌ No clear separation of concerns
- ❌ Mixed operational and analysis tooling
- ❌ No domain organization
- ❌ Inconsistent code standards
- ❌ Poor discoverability

**Benefits of new structure**:

- ✅ Clear domain boundaries (operations vs evaluation)
- ✅ Comprehensive documentation per domain
- ✅ Enforced code quality standards
- ✅ Operations code MUST use proper logger
- ✅ Easy to find and understand tools

## Finding What You Need

**For ingestion tasks**: Look in `operations/ingestion/`  
**For monitoring/cleanup**: Look in `operations/observability/`  
**For dev/testing**: Look in `operations/sandbox/`  
**For infrastructure**: Look in `operations/infrastructure/`  
**For search analysis**: Look in `evaluation/analysis/`  
**For search experiments**: Look in `evaluation/experiments/current/`  
**For historical experiments**: Look in `evaluation/experiments/historical/`

## Migration Guide

| Old Location                                      | New Location                                            | Command                   |
| ------------------------------------------------- | ------------------------------------------------------- | ------------------------- |
| `scripts/ingest-all-combinations.ts`              | `operations/ingestion/`                                 | `pnpm ingest:all`         |
| `scripts/check-progress.ts`                       | `operations/ingestion/`                                 | `pnpm ingest:progress`    |
| `scripts/verify-ingestion.ts`                     | `operations/ingestion/`                                 | `pnpm ingest:verify`      |
| `scripts/observability/delete-zero-hit-events.ts` | `operations/observability/`                             | `pnpm zero-hit:purge`     |
| `scripts/sandbox/ingest.ts`                       | `operations/sandbox/`                                   | `pnpm sandbox:ingest`     |
| `scripts/alias-swap.sh`                           | `operations/infrastructure/`                            | `pnpm elastic:alias-swap` |
| `scripts/analyze-diagnostic-queries.ts`           | `evaluation/analysis/`                                  | `pnpm eval:diagnostic`    |
| `scripts/analyze-per-category.ts`                 | `evaluation/analysis/`                                  | `pnpm eval:per-category`  |
| `scripts/rerank-experiment/`                      | `evaluation/experiments/historical/semantic-reranking/` | (historical)              |
| `experiments/hybrid-superiority.experiment.ts`    | `evaluation/experiments/current/`                       | vitest                    |
| `experiments/mcp-comparison.experiment.ts`        | `evaluation/experiments/current/`                       | vitest                    |

## Next Steps

1. Use the new directory structure going forward
2. Read the comprehensive READMEs in each subdirectory
3. Follow the code quality standards enforced by eslint
4. Add new scripts to the appropriate domain-specific directory
