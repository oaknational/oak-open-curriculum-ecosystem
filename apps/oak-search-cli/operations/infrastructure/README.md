# Infrastructure Operations

System management and deployment utilities for Elasticsearch indices.

## Blue/Green Index Lifecycle (ADR-130)

Index lifecycle management is handled by the SDK's `IndexLifecycleService`, exposed through CLI commands registered in [`admin-lifecycle-commands.ts`](../../src/cli/admin/admin-lifecycle-commands.ts).

### CLI Commands

```bash
# Full blue/green ingest cycle: create versioned indexes, ingest, verify, swap aliases, clean up
oak-search admin versioned-ingest --bulk-dir <path> [--subject-filter <subjects...>] [--version <version>] [--min-doc-count <count>] [-v]

# Roll back to the previous index version recorded in metadata
oak-search admin rollback

# Check health of all curriculum aliases
oak-search admin validate-aliases
```

### Blue/Green Deployment Pattern

1. **Blue** (current): Active versioned indices serving live traffic via aliases
2. **Green** (new): New versioned indices created, populated, and verified offline
3. **Swap**: Atomic `POST /_aliases` update across all six curriculum indexes
4. **Cleanup**: Old generations beyond `MAX_GENERATIONS` are deleted

### Index Naming Convention

```text
oak_lessons_v2026-03-07-143022  # Timestamped versioned index
oak_lessons                      # Alias pointing to latest version
```

### Safety Features

- Pre-swap validation of document counts per index
- Atomic alias operations (no downtime window)
- Single-level rollback via `previous_version` metadata
- Metadata write as commit point — alias rolled back on metadata failure

## Adding New Infrastructure Tools

When adding new infrastructure scripts:

1. **Require explicit confirmation** for destructive operations
2. **Use structured logging** with proper logger
3. **Implement rollback mechanisms** where applicable
4. **Validate preconditions** before operations
5. **Provide clear success/failure messages**

## Related Documentation

- [ADR-130: Blue/Green Index Swapping](../../../../docs/architecture/architectural-decisions/130-blue-green-index-swapping.md)
- [Indexing Playbook](../../docs/INDEXING.md)
- [Elasticsearch Aliases](https://www.elastic.co/guide/en/elasticsearch/reference/current/aliases.html) — Official ES alias documentation
