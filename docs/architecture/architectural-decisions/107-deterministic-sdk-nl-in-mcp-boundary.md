# ADR-107: Deterministic SDK / NL-in-MCP Boundary

## Status

Accepted (2026-02-10)

## Context

The semantic search capability is being extracted from
its current workspace (`apps/oak-search-cli/`,
to be renamed `apps/oak-search-cli/`) into a dedicated SDK
(`packages/sdks/oak-search-sdk/`). The current workspace stays
in place and becomes the CLI; the SDK library code is
extracted out. Multiple consumers will call the SDK: the
CLI for operator workflows, an Express-based MCP server
for AI agent access, and potentially future layers.

The question is: **where does natural language understanding live?**

### Previous Architecture (Next.js App)

In the Next.js app, [ADR-044](044-nl-delegates-to-structured-search-and-caching-ownership.md) established that the NL route (`POST /api/search/nl`) was a thin adapter that deterministically transformed free-text into a validated structured payload, then delegated to the structured route (`POST /api/search`). Caching was owned by the structured route.

This worked within a single application, but the extraction creates a new boundary: the SDK is a library consumed by multiple applications, each with different NL requirements.

### Forces

1. **AI agents need NL interpretation** — MCP tool calls include natural language descriptions of what the teacher wants. These must be mapped to structured SDK parameters.
2. **The CLI does not need NL** — Operators type explicit flags (`--subject maths --key-stage ks3`), not prose.
3. **Future consumers vary** — A REST API might accept NL; a programmatic integration will not.
4. **Testability** — Pure functions with deterministic inputs are straightforward to test. NL parsing introduces non-determinism (LLM calls, prompt sensitivity).
5. **Separation of concerns** — Search retrieval logic (query building, RRF fusion, score normalisation) is a different domain from intent extraction (understanding what a user means).

## Decision

**The Search SDK remains deterministic. All natural language parsing, intent extraction, and query reformulation live in the consuming application — currently the MCP server.**

### SDK Contract

The SDK accepts structured, validated parameters:

```typescript
// SDK: deterministic, no NL interpretation
sdk.retrieval.searchLessons({
  text: 'expanding brackets',
  subject: 'maths',
  keyStage: 'ks3',
  size: 10,
});
```

### MCP Server Responsibility

The MCP server owns the mapping from agent intent to SDK calls:

```typescript
// MCP: owns NL understanding via tool examples and descriptions
// Agent says: "Find KS3 maths lessons about expanding brackets in algebra"
// MCP maps to:
sdk.retrieval.searchLessons({
  text: 'expanding brackets',
  subject: 'maths',
  keyStage: 'ks3',
});
```

The MCP layer achieves this through comprehensive tool descriptions and examples in the MCP tool definitions, which guide the LLM to produce correctly structured tool calls. If future needs require explicit NL parsing (e.g. LLM-based query reformulation), that logic lives in the MCP server, not the SDK.

### Boundary Rule

No SDK function may:

- Call an LLM or inference endpoint
- Parse free-text intent
- Reformulate queries based on inferred meaning
- Accept unstructured natural language as a primary input

The SDK's query processing (noise phrase removal, curriculum phrase detection) operates on the structured `text` parameter using deterministic rules, not NL understanding. These are lexical transformations, not intent extraction.

## Consequences

### Positive

1. **SDK is testable with pure inputs** — No LLM mocking, no prompt sensitivity in SDK tests
2. **Multiple consumers, one SDK** — CLI, MCP, future API all call the same deterministic interface
3. **Clear ownership** — NL bugs are in the MCP layer; retrieval bugs are in the SDK
4. **No vendor lock-in in the SDK** — The SDK has no dependency on any AI/LLM provider
5. **Aligns with ADR-078** — Configuration and dependencies injected, not hard-coded
6. **Preserves ADR-044 principle** — NL remains a thin adapter over deterministic search, now at a system level rather than within a single application

### Negative

1. **Duplicated NL mapping** — If multiple consumers need NL, each must implement its own mapping
2. **MCP complexity** — The MCP server carries more responsibility (tool descriptions must be comprehensive)
3. **No shared NL improvements** — SDK improvements help all consumers; NL improvements help only one

### Mitigations

- **Comprehensive MCP tool examples** cover the mapping from teacher intent to SDK calls
- **If NL mapping becomes shared logic**, it can be extracted into a separate `search-nl` library consumed by MCP and other NL-aware consumers — still separate from the deterministic SDK
- **The MCP layer is the primary NL consumer** for the foreseeable future; duplication risk is low

## Alternatives Considered

### NL Parsing in the SDK

Accept raw natural language in the SDK and parse it internally.

**Rejected**: Introduces LLM dependencies, non-determinism, and vendor coupling into a library that should be a predictable building block. Violates separation of concerns — retrieval and intent extraction are different domains.

### Shared NL Layer Inside the SDK

Provide an optional `sdk.nl.parse(text)` method alongside the structured API.

**Deferred**: Premature. Currently only the MCP server needs NL. If multiple consumers need shared NL logic, a separate `search-nl` package is the correct boundary — keeping the core SDK deterministic.

## Related Decisions

- [ADR-044](044-nl-delegates-to-structured-search-and-caching-ownership.md) — Predecessor: NL delegates to structured search within the Next.js app
- [ADR-078](078-dependency-injection-for-testability.md) — SDK pattern: config and clients injected by consumer
- [ADR-074](074-elastic-native-first-philosophy.md) — Elastic-native-first: no external AI services in the search layer

## References

- [Search SDK + CLI Extraction Plan](/.agent/plans/semantic-search/active/search-sdk-cli.plan.md) — Implementation plan
- [Semantic Search Prompt](/.agent/prompts/semantic-search/semantic-search.prompt.md) — Session entry point
