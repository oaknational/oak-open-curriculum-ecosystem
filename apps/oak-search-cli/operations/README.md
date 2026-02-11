# Operations

This directory contains operational tooling for the semantic search system. All code here must meet the same quality standards as `src/`.

## Purpose

Operations scripts are production and development tools that:

- Manage data ingestion and validation
- Monitor and maintain system health
- Provide infrastructure management utilities
- Support development workflows

## Directory Structure

```text
operations/
├── ingestion/         # Data loading and validation
├── observability/     # Monitoring and maintenance
├── sandbox/           # Development and testing utilities
├── infrastructure/    # System management (ES index operations)
└── utilities/         # Simple helper scripts
```

## Code Quality Standards

**Operations code follows the SAME standards as `src/`**:

- **TypeScript**: Strict mode, all types explicit
- **Complexity**: Max 8 cyclomatic complexity
- **Function length**: Max 50 lines
- **File length**: Max 250 lines
- **Logging**: MUST use `@oaknational/mcp-logger`, NO `console.log` (except in utilities/)
- **Error handling**: Proper error handling with structured logging
- **Testing**: Unit tests for complex logic

### Exception: `utilities/`

Simple utility scripts in `utilities/` are allowed to:

- Use `console.log` for output
- Have simpler structure (max 100 lines)
- Minimal complexity (max 8)

## Running Operations Scripts

Use the npm scripts defined in `package.json`:

```bash
# Ingestion
pnpm es:ingest-live -- --all     # Ingest all subjects/keystages
pnpm es:ingest-live -- --all -i  # Resume (skip existing documents)
pnpm ingest:verify               # Validate ingested data
pnpm es:status                   # Check index counts

# Observability
pnpm zero-hit:purge              # Clean up zero-hit analytics events

# Infrastructure
pnpm elastic:alias-swap          # Swap ES index aliases (blue/green deployment)

# Development
pnpm sandbox:ingest              # Ingest fixture data for testing
```

## Adding New Operations Scripts

1. Choose the appropriate subdirectory based on purpose
2. Follow TDD approach where appropriate
3. Use the proper logger from `@oaknational/mcp-logger`
4. Add comprehensive JSDoc comments
5. Update the subdirectory README
6. Add npm script to `package.json` if it's a user-facing command
7. Run `pnpm lint:fix` to ensure code quality

## Related Directories

- `evaluation/` - Analysis and measurement scripts (allow console.log)
- `src/` - Core application code
- `smoke-tests/` - Out-of-process system validation tests

## Archival Note

The old `scripts/` directory has been reorganized into:

- `operations/` - Production and dev tooling (this directory)
- `evaluation/` - Search quality analysis tools

Historical scaffolding scripts remain in `scripts/archive/` for reference only.
