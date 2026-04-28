# Invoke Elasticsearch Reviewer

Operationalises [ADR-129 (Domain Specialist Capability Pattern)](../../docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md) and [ADR-074 (Elastic-Native-First Philosophy)](../../docs/architecture/architectural-decisions/074-elastic-native-first-philosophy.md).

When changes touch Elasticsearch-specific concerns, invoke the `elasticsearch-reviewer` specialist in addition to the standard `code-reviewer` gateway.

## Trigger Conditions

Invoke `elasticsearch-reviewer` when the change involves:

- Elasticsearch index mappings or field definitions
- Analysers, tokenizers, or synonym configurations
- Query DSL, retrievers, or retriever composition
- ELSER model deployment, inference, or embedding configuration
- RRF, hybrid retrieval, or reranking logic
- Ingest pipelines or enrichment processors
- Search observability or evaluation approaches
- Elastic Serverless capability questions or constraints
- Bulk indexing operations or retry strategies

## Non-Goals

Do not invoke `elasticsearch-reviewer` for:

- Generic Node.js HTTP client issues (connection timeouts, proxy configuration)
- Non-Elasticsearch search concepts unrelated to Elastic implementation
- Oak product decisions that do not involve Elasticsearch platform capabilities
- Infrastructure or deployment questions unrelated to Elastic Serverless capabilities

## Overlap Boundaries

- **`code-reviewer`**: Always invoke as the gateway. `elasticsearch-reviewer` adds Elastic-specific depth.
- **`type-reviewer`**: Add when Elasticsearch mapping types affect SDK-generated TypeScript types.
- **`architecture-reviewer-wilma`**: Add when bulk operations or retry logic have resilience implications.
- **`mcp-reviewer`**: Add when search MCP tool definitions are involved.

## Invocation

See `.agent/memory/executive/invoke-code-reviewers.md` for the full reviewer catalogue and invocation policy. The `elasticsearch-reviewer` canonical template is at `.agent/sub-agents/templates/elasticsearch-reviewer.md`.
