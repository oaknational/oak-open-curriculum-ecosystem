# @oaknational/oak-search-sdk

TypeScript SDK for Oak semantic search — retrieval, admin, and observability services backed by Elasticsearch.

## Usage

```typescript
import { createSearchSdk } from '@oaknational/oak-search-sdk';
import { Client } from '@elastic/elasticsearch';

const sdk = createSearchSdk({
  deps: {
    esClient: new Client({ node: esUrl, auth: { apiKey } }),
  },
  config: {
    indexTarget: 'primary',
    indexVersion: '1',
  },
});

// Search lessons
const results = await sdk.retrieval.searchLessons({
  text: 'expanding brackets',
  subject: 'maths',
  keyStage: 'ks3',
});

// Admin operations
await sdk.admin.setup();
const status = await sdk.admin.verifyConnection();

// Observability
sdk.observability.recordZeroHit({ scope: 'lessons', text: 'xyz' });
```

## Architecture

The SDK exposes three services via a single factory:

```text
createSearchSdk({ deps, config })
  → { retrieval, admin, observability }
```

| Service                  | Purpose                                                                     |
| ------------------------ | --------------------------------------------------------------------------- |
| **RetrievalService**     | Hybrid BM25 + ELSER search (lessons, units, sequences), suggestions, facets |
| **AdminService**         | ES setup, connection, synonyms, index metadata, bulk ingestion              |
| **ObservabilityService** | Zero-hit event recording, ES persistence, telemetry queries                 |

### Design Principles

- **Dependency injection**: The consuming application supplies the Elasticsearch client, optional logger, and configuration. The SDK never reads `process.env`.
- **Schema-first types**: Search request/response/index document types flow from `@oaknational/oak-curriculum-sdk` generated artefacts. No manual type definitions.
- **Deterministic**: NL parsing and intent extraction are the responsibility of the MCP layer, not the SDK. See [ADR-107](../../docs/architecture/architectural-decisions/107-deterministic-sdk-nl-in-mcp-boundary.md).

## Consumers

| Consumer       | Location                 | How it uses the SDK                                  |
| -------------- | ------------------------ | ---------------------------------------------------- |
| **Search CLI** | `apps/oak-search-cli/`   | `createCliSdk()` maps env → ES client → SDK instance |
| **MCP Server** | (Checkpoint F — planned) | Will call SDK services from MCP tools                |

## Development

```bash
pnpm build        # Build with tsup + dts
pnpm type-check   # Type check
pnpm lint:fix     # Lint
pnpm test         # Run tests (34 integration + unit)
```

## Related

- [Search CLI README](../../apps/oak-search-cli/README.md)
- [Search CLI Architecture](../../apps/oak-search-cli/docs/ARCHITECTURE.md)
- [SDK + CLI Plan](../../.agent/plans/semantic-search/active/search-sdk-cli.plan.md)
