# Observability Operations

Monitoring, maintenance, and cleanup tools for the semantic search system.

## Scripts

### `delete-zero-hit-events.ts`

Purges persisted zero-hit search events from Elasticsearch.

**Usage**:

```bash
# Dry run (default)
pnpm zero-hit:purge

# Force delete events older than 30 days
tsx operations/observability/delete-zero-hit-events.ts --older-than-days 30 --force

# Specify target environment
tsx operations/observability/delete-zero-hit-events.ts --target production --older-than-days 30 --force
```

**Purpose**: Manage storage costs by removing old zero-hit analytics data.

**What it does**:

- Queries the zero-hit events index for events older than specified threshold
- Deletes matching documents (requires `--force` flag)
- Logs deletion count and provides summary
- Uses proper logger for structured logging

**Safety features**:

- Dry run by default (requires explicit `--force`)
- Confirmation message before deletion
- Structured logging of all operations

**CLI Flags**:

- `--target <env>` - Target environment (sandbox|development|production)
- `--older-than-days <n>` - Delete events older than N days
- `--force` - Actually perform deletion (dry run without this)

## Adding New Observability Tools

When adding new observability scripts:

1. **Use the proper logger**:

   ```typescript
   import { searchLogger } from '../../src/lib/logger';

   searchLogger.info('operation.start', { context });
   ```

2. **Implement dry-run mode**:
   - Default to dry run
   - Require explicit `--force` flag for destructive operations

3. **Provide clear output**:
   - Log operation start, progress, and completion
   - Include relevant metrics in logs

4. **Handle errors gracefully**:

   ```typescript
   try {
     // operation
   } catch (error) {
     searchLogger.error('operation.failed', error);
     process.exitCode = 1;
   }
   ```

5. **Add npm script** to `package.json` if user-facing

## Future Observability Tools

Potential additions:

- Index health check
- Query performance monitoring
- Cache hit rate analysis
- Ingestion error reporting
- Synonym usage statistics

## Related Documentation

- [searchLogger](../../src/lib/logger.ts) - Structured logging utilities
- [Elasticsearch Serverless Docs](https://www.elastic.co/docs/solutions/serverless) - Platform documentation
