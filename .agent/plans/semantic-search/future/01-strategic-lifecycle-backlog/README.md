# Post-SDK Work — Streams

**Role**: Strategic backlog hub (not an active execution lane)  
**Status**: 📋 Backlog maintained — promote items to collection `active/` when work starts  
**Parent**: [../../roadmap.md](../../roadmap.md)

This folder captures post-SDK strategic backlog streams. It is the
**next/later planning surface** for semantic-search work, not the
in-progress execution source of truth.

When a backlog item starts, mine the strategic intent from here into an
executable plan in the collection lifecycle lanes (`current/` then
`active/`), and archive once complete.

---

## Backlog Horizons

```text
NOW (in progress): semantic-search/active/
NEXT (queued): post-merge integration cleanup
LATER (deferred): milestone 2 search quality/ecosystem streams
```

Immediate next-up backlog item from this hub:

1. `../06-mcp-consumer-integration/mcp-result-pattern-unification.md`

---

## Standalone Backlog Items

Plans that span multiple streams or address SDK architecture.

| Plan | Intent | Prerequisite |
|------|--------|--------------|
| [subject-domain-model.md](../02-schema-authority-and-codegen/move-search-domain-knowledge-to-codegen-time.md) | Oak API SDK sdk-codegen: subject hierarchy, KS4 patterns, curriculum config | SDK extraction complete ✅ |
| [bulk-schema-driven-code-generation.md](../02-schema-authority-and-codegen/bulk-schema-driven-code-generation.md) | Replace template-based bulk sdk-codegen with schema-driven generator | SDK extraction complete ✅ |
| [mcp-result-pattern-unification.md](../06-mcp-consumer-integration/mcp-result-pattern-unification.md) | Migrate MCP `ToolExecutionResult` to `Result<T, E>` — post-merge work | Phase 3a complete ✅ |

---

## Streams (LATER)

Each stream is a coherent domain of work with its own README explaining intent and impact.

| Stream | Intent | First Plan |
|--------|--------|------------|
| [mcp-consumer-integration/](../06-mcp-consumer-integration/) | Post-merge MCP integration follow-up | [mcp-result-pattern-unification.md](../06-mcp-consumer-integration/mcp-result-pattern-unification.md) |
| [retrieval-quality-engine/](../04-retrieval-quality-engine/) | Improve search result relevance | Levels 2 → 3 → 4 (sequential); reranking investigation at Level 3 |
| [vocabulary-and-semantic-assets/](../03-vocabulary-and-semantic-assets/) | Mine vocabulary from curriculum data | vocabulary-mining.md |
| [query-policy-and-sdk-contracts/](../05-query-policy-and-sdk-contracts/) | Understand and stabilise SDK API surface | filter-testing.md |
| [runtime-governance-and-operations/](../07-runtime-governance-and-operations/) | Run the system safely and reliably | governance.md |
| [experience-surfaces-and-extensions/](../08-experience-surfaces-and-extensions/) | Add capabilities beyond core search | advanced-features.md |

---

## Stream Principles

1. **Each plan belongs to exactly one stream**
2. **Stream READMEs** explain domain, intent, desired impact, and any sequencing
3. **Plans within a stream** may be sequential or parallel depending on dependencies
4. **When a plan mixes concerns**, examine whether it should be split by stream
5. **Completed outcomes are mined into permanent documentation before archival**

---

## Prerequisites

| Prerequisite | Status | Location |
|--------------|--------|----------|
| Ground truth foundation | ✅ Complete | [../../archive/completed/](../../archive/completed/) |
| SDK extraction | ✅ Complete | [../../sdk-extraction/](../../sdk-extraction/) |
