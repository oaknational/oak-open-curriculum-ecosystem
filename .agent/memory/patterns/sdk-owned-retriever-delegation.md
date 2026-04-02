---
name: "SDK-Owned Retriever Delegation"
use_this_when: "An app-layer module builds an Elasticsearch retriever shape that the SDK already owns as a shared capability."
category: architecture
proven_in: "apps/oak-search-cli/src/lib/hybrid-search/rrf-query-builders.ts"
proven_date: 2026-03-23
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Duplicate retriever shapes in app and SDK drift silently — field boosts, rank parameters, or semantic fields change in one place but not the other, causing inconsistent search quality across consumers."
  stable: true
---

## Pattern

When an SDK owns a retriever builder (the Elasticsearch query shape — fields, RRF parameters, semantic config), app-layer code should **import and delegate** rather than maintaining a local copy.

The app keeps:
- **Filter construction** — app-specific logic (e.g., which parameters map to which ES filter clauses)
- **Request assembly** — app-specific concerns (index resolution, pagination, source excludes)

The app delegates:
- **Retriever shape** — the RRF structure, field names, boost values, rank parameters, semantic field config

The adapter between them is typically one line:
```typescript
const filterClause = filters.length > 0 ? { bool: { filter: filters } } : undefined;
```
This converts app-layer filter arrays to the SDK's single `QueryContainer | undefined` parameter.

## Anti-pattern

Two implementations of the same retriever shape in different workspaces, differing only in filter parameter format. The shapes are byte-identical today but nothing prevents them diverging tomorrow.

```
WRONG:  CLI builds filters → CLI builds retriever (local copy) → CLI assembles request
RIGHT:  CLI builds filters → CLI wraps filters → SDK builds retriever → CLI assembles request
```

## Why this matters

- **Single source of truth**: The retriever shape is a domain contract (ADR-134, ADR-139). It should be defined once.
- **Drift prevention**: Retriever tuning (field boosts, rank constants, semantic fields) is a search quality decision. If two implementations exist, one will drift.
- **Boundary clarity**: The SDK is the capability layer; the CLI is the operational interface. Retriever construction is a capability, not an operation.

## Detection

Search for private retriever-building functions in app code that mirror SDK exports:
```bash
grep -r "function create.*Retriever" apps/ --include="*.ts"
```
Compare against SDK exports:
```bash
grep -r "export function build.*Retriever" packages/sdks/ --include="*.ts"
```
If both return the same RRF shape for the same index scope, the app version should be collapsed.
