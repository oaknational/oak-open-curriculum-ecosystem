# Infrastructure Operations

System management and deployment utilities for Elasticsearch indices.

## Scripts

### `alias-swap.sh`

Performs blue/green deployment by swapping Elasticsearch index aliases.

**Usage**:

```bash
pnpm elastic:alias-swap
```

**Purpose**: Zero-downtime index updates by swapping aliases from old to new indices.

**What it does**:

- Creates new timestamped indices
- Reindexes data from current indices
- Atomically swaps aliases to point to new indices
- Cleans up old indices

**Blue/Green Deployment Pattern**:

1. **Blue** (current): Active indices serving live traffic
2. **Green** (new): New indices being prepared
3. **Swap**: Atomic alias update from Blue to Green
4. **Cleanup**: Old Blue indices can be safely deleted

**Index Naming Convention**:

```text
oak_lessons_v2025-12-23-154730  # Timestamped versioned index
oak_lessons                      # Alias pointing to latest version
```

**Safety Features**:

- Validation of new indices before swap
- Atomic alias operations (no downtime)
- Rollback capability (keep old indices temporarily)

## Adding New Infrastructure Tools

When adding new infrastructure scripts:

1. **Require explicit confirmation** for destructive operations
2. **Use structured logging** with proper logger
3. **Implement rollback mechanisms** where applicable
4. **Validate preconditions** before operations
5. **Provide clear success/failure messages**

## Future Infrastructure Tools

Potential additions:

- Index backup/restore utilities
- Index optimization scripts
- Mapping migration tools
- Index monitoring and alerting
- Performance tuning scripts

## Related Documentation

- [Elasticsearch Aliases](https://www.elastic.co/guide/en/elasticsearch/reference/current/aliases.html) - Official ES alias documentation
- [Blue/Green Deployments](https://docs.aws.amazon.com/wellarchitected/latest/management-and-governance-lens/blue-green-deployments.html) - Deployment pattern overview
