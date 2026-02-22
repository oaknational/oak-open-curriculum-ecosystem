# Semantic Search — Navigation

**Last Updated**: 2026-02-22

---

## Quick Start

**Start here**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

---

## Current Work: Merge Prep

MCP search integration (Phase 3a) is complete — three tools
wired, old REST search replaced. Two merge blockers remain:

1. **SDK workspace separation** (3e) — split curriculum-sdk into
   type-gen and runtime workspaces
2. **Widget stabilisation** (3h) — Track 1a shell-only non-search
   widgets and Track 1b search/suggest rendering fixes

**Roadmap**: [roadmap.md](roadmap.md)
**Completed plans**: [completed-plans.md](../completed-plans.md)

Search dispatch type safety (3g) is complete and archived:
[search-dispatch-type-safety.md](archive/completed/search-dispatch-type-safety.md).

---

## Execution Order

```text
1. Ground Truth Foundation                       ✅ COMPLETE
   30 lesson GTs + multi-index GTs
         ↓
2. SDK Extraction + CLI Wiring                   ✅ COMPLETE
   Checkpoints A–E2 (extraction, Result pattern, TSDoc)
         ↓
2e. SDK Validation against Real ES               ✅ COMPLETE
    Baselines confirmed, thread search validated
         ↓
2f. Public Release Readiness                     ✅ COMPLETE
2g. Developer Onboarding                         ✅ COMPLETE
2h. Code Quality Remediation                     ✅ COMPLETE
         ↓
3. MCP Integration + Merge Preparation           🔄 IN PROGRESS
   3a MCP search integration                     ✅ COMPLETE (archived)
   3d OAuth spec compliance                      ✅ COMPLETE
   3f Proxy OAuth AS for Cursor                  ✅ COMPLETE
   3g Search dispatch type safety                ✅ COMPLETE (archived)
   3e SDK workspace separation                   🔄 MERGE-BLOCKING
   3h Widget stabilisation (Tracks 1a + 1b)      🔄 MERGE-BLOCKING
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
| `active/` | Merge-prep plans (`3e` and `3h`) | 🔄 Active |
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
| [Search Dispatch Type Safety](archive/completed/search-dispatch-type-safety.md) | ✅ Complete — B1 type-safe dispatch + W1 rename |
| [SDK Workspace Separation](active/sdk-workspace-separation.md) | 🔄 Merge-blocking — split curriculum-sdk |
| [Widget Search Rendering](active/widget-search-rendering.md) | 🔄 Merge-blocking — pre-merge Tracks 1a + 1b |
| [Result Pattern Unification](post-sdk/mcp-integration/mcp-result-pattern-unification.md) | 📋 Post-merge — `Result<T, E>` migration |
| [Search Acceptance Criteria](search-acceptance-criteria.md) | Level definitions |
| [Ground Truth Protocol](../../../apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md) | Baseline metrics and process |
| [MCP Extensions Future Work](../sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md) | 📋 Post-merge SDK/MCP enhancements governance |
| [Completed Plans](../completed-plans.md) | Index of all archived plans |

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
