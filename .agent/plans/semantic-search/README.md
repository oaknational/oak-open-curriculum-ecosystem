# Semantic Search — Navigation

**Last Updated**: 2026-02-24

---

## Quick Start

**Start here**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

---

## Current Work: Merge Prep

MCP search integration (Phase 3a) is complete — three tools
wired, old REST search replaced. One merge blocker remains:

1. **SDK workspace separation** (3e) — split curriculum-sdk into
   generation and runtime workspaces

Search results quality is **COMPLETE** — documented in
[ADR-120](../../../docs/architecture/architectural-decisions/120-per-scope-search-tuning.md).

Widget stabilisation (3h) is **COMPLETE** (all phases 0-5).

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
   3h Widget stabilisation (Tracks 1a + 1b)      ✅ COMPLETE
   3e SDK workspace separation                   🔄 MERGE-BLOCKING
   3i Search results quality                     ✅ COMPLETE (ADR-120)
         ↓
4. Search Quality + Ecosystem (parallel streams)
   GT expansion, Levels 2-4, bulk data, SDK API,
   subject domain model, operations
         ↓
5. Extensions
   RAG, knowledge graph, advanced features
```

---

## Active Plans

| Plan | Status | Priority |
|------|--------|----------|
| [SDK workspace separation](active/sdk-workspace-separation.md) | 🔄 Merge-blocking | **P0** — split curriculum-sdk |

---

## Folder Structure

| Folder | Purpose | Status |
|--------|---------|--------|
| `active/` | Merge-prep plans (`3e`) | 🔄 Active |
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
| [SDK Workspace Separation](active/sdk-workspace-separation.md) | 🔄 Merge-blocking — split curriculum-sdk (self-sufficient, all decisions resolved) |
| [SDK Separation Pre-Phase-1 Decisions](archive/completed/sdk-separation-pre-phase1-decisions.md) | ✅ Archived — D1-D5 decision rationale (all integrated into canonical plan) |
| [Search Results Quality](archive/completed/search-results-quality.md) | ✅ Complete — ADR-120 |
| [Search Dispatch Type Safety](archive/completed/search-dispatch-type-safety.md) | ✅ Complete — B1 type-safe dispatch + W1 rename |
| [Widget Search Rendering](archive/completed/widget-search-rendering.md) | ✅ Complete — Phases 0-5, archived |
| [Result Pattern Unification](post-sdk/mcp-integration/mcp-result-pattern-unification.md) | 📋 Post-merge — `Result<T, E>` migration |
| [Search Acceptance Criteria](search-acceptance-criteria.md) | Level definitions |
| [Ground Truth Protocol](../../../apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md) | Baseline metrics and process |
| [MCP Extensions Future Work](../sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md) | 📋 Post-merge SDK/MCP enhancements governance |
| [Widget Renderer Reactivation](post-sdk/extensions/widget-renderer-reactivation.md) | ⏸️ Post-merge — wire renderers back after MCP extensions + Apps SDK work |
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
