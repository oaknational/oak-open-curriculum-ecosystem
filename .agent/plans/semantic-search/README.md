# Semantic Search — Navigation

**Last Updated**: 2026-02-12

---

## Quick Start

**Start here**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

---

## Current Work: SDK Validation

SDK extraction is complete (Checkpoints A–E2, Feb 2026).
The SDK was completely rewritten and re-architected during
extraction. The immediate priority is validating it against
real Elasticsearch to confirm it produces correct results.

**Roadmap**: [roadmap.md](roadmap.md)

---

## Execution Order

```text
1. Ground Truth Foundation                       ✅ COMPLETE
   30 lesson GTs + multi-index GTs
         ↓
2. SDK Extraction + CLI Wiring                   ✅ COMPLETE
   Checkpoints A–E2 (extraction, Result pattern, TSDoc)
         ↓
2e. SDK Validation against Real ES               ← CURRENT
    Run full evaluation suite, confirm baselines hold
         ↓
3. MCP Search Integration
   Wire hybrid search into MCP tools
         ↓
4. Search Quality + Ecosystem (parallel streams)
   GT expansion, Levels 2-4, bulk data, SDK API,
   subject domain model, operations
         ↓
5. Extensions
   RAG, knowledge graph, advanced features
```

---

## Folder Structure

| Folder | Purpose | Status |
|--------|---------|--------|
| `active/` | Active plans (SDK extraction reference + remediation) | 🔄 Active |
| `sdk-extraction/` | SDK extraction context | ✅ Complete |
| `post-sdk/` | Streams of post-extraction work | 📋 Ready |
| `archive/` | Historical work | ✅ Reference only |

---

## Post-SDK Streams

After SDK extraction, work is organized into **streams** — coherent domains with their own intent and impact.

| Stream | Intent |
|--------|--------|
| [mcp-integration/](post-sdk/mcp-integration/) | Wire hybrid search into MCP tools (after SDK validation) |
| [search-quality/](post-sdk/search-quality/) | Improve search result relevance (Levels 2-4) |
| [bulk-data-analysis/](post-sdk/bulk-data-analysis/) | Mine vocabulary from curriculum data |
| [sdk-api/](post-sdk/sdk-api/) | Understand and stabilise SDK API |
| [operations/](post-sdk/operations/) | Run the system safely |
| [extensions/](post-sdk/extensions/) | Add capabilities beyond core search |

Each stream has a README explaining domain, intent, desired impact, and any internal sequencing.

---

## Documents

| Document | Purpose |
|----------|---------|
| [Prompt](../../prompts/semantic-search/semantic-search.prompt.md) | Session entry point |
| [Roadmap](roadmap.md) | **THE** authoritative plan sequence |
| [451 + Test Remediation](archive/completed/transcript-451-test-doc-remediation.plan.md) | ✅ HTTP 451 handling, E2E test compliance, stale docs |
| [Public Release Readiness](active/public-release-readiness.plan.md) | Secrets, licence, package.json, docs, GitHub config, npm publish |
| [Search Acceptance Criteria](search-acceptance-criteria.md) | Level definitions |
| [Ground Truth Protocol](/apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md) | Baseline metrics and process |

---

## Archive

Historical work from previous phases. **Metrics and details are stale** — for reference only.

| Document | Purpose |
|----------|---------|
| [archive/completed-jan-2026.md](archive/completed-jan-2026.md) | Initial development phase milestones |
| [archive/completed/](archive/completed/) | Individual completed plans |

---

## Foundation Documents (MANDATORY)

1. [rules.md](../../directives/rules.md)
2. [testing-strategy.md](../../directives/testing-strategy.md)
3. [schema-first-execution.md](../../directives/schema-first-execution.md)
