# Semantic Search — Navigation

**Last Updated**: 2026-03-06

---

## Quick Start

**Start here**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

**Research index**: [research-index.md](research-index.md)

---

## Current Work: Post-Merge Execution

MCP search integration (Phase 3a) is complete — three tools
wired, old REST search replaced. SDK workspace separation (3e) is
**complete** — archived [sdk-workspace-separation.md](archive/completed/sdk-workspace-separation.md).

Search results quality is **COMPLETE** — documented in
[ADR-120](../../../docs/architecture/architectural-decisions/120-per-scope-search-tuning.md).

Widget stabilisation (3h) is **COMPLETE** (all phases 0-5).

**Roadmap**: [roadmap.md](roadmap.md)
**Completed plans**: [completed-plans.md](../completed-plans.md)

Search dispatch type safety (3g) is complete and archived:
[search-dispatch-type-safety.md](archive/completed/search-dispatch-type-safety.md).

Milestone 2 blocker execution is now queued in
[current/m2-public-alpha-auth-rate-limits.execution.plan.md](current/m2-public-alpha-auth-rate-limits.execution.plan.md).

That blocker is a separate public-release-readiness stream. It does **not**
prevent Boundary 03 bulk metadata work from progressing.

Active boundary-local execution now includes:

- [Bulk Metadata Quick Wins](active/bulk-metadata-quick-wins.execution.plan.md)

Prepared next-up queue behind the active quick-win stream:

- [Keyword Definition Assets](current/keyword-definition-assets.execution.plan.md)
- [Thread and Sequence Semantic Surfaces](current/thread-sequence-semantic-surfaces.execution.plan.md)

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
3. MCP Integration + Merge Preparation           ✅ COMPLETE
   3a MCP search integration                     ✅ COMPLETE (archived)
   3d OAuth spec compliance                      ✅ COMPLETE
   3f Proxy OAuth AS for Cursor                  ✅ COMPLETE
   3g Search dispatch type safety                ✅ COMPLETE (archived)
   3h Widget stabilisation (Tracks 1a + 1b)      ✅ COMPLETE
   3e SDK workspace separation                   ✅ COMPLETE (archived)
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

- [MCP Result Pattern Unification (Execution)](active/mcp-result-pattern-unification.execution.plan.md) — converge MCP execution to `Result<T, E>` across SDK + MCP consumers
- [Extract search-args layer into Search SDK](active/search-sdk-args-extraction.plan.md) — move param builders, scope validation, error formatting from MCP layer/CLI into the search SDK
- [Bulk Metadata Quick Wins](active/bulk-metadata-quick-wins.execution.plan.md) — widen bulk lesson/unit metadata and preserve structured fields for follow-on asset work

---

## Folder Structure

| Folder | Purpose | Status |
|--------|---------|--------|
| `active/` | In-progress plans | 🟢 result unification + search-args extraction + bulk metadata quick wins |
| `current/` | Next-up queued plans | 📋 Ready (P0 blocker + P1/P2 follow-ons) |
| `future/` | Deferred/later strategic backlog organised by true domain boundaries | 📋 Planned |
| `archive/completed/` | Historical execution records (including SDK extraction completion) | ✅ Reference |
| `archive/` | Historical work | ✅ Reference only |

---

## Research Model

Semantic-search research now lives in **boundary-local** `*.research.md`
documents inside `future/`. These files are evidence and analysis for the
backlog boundaries; they are not execution plans.

Use:

- [research-index.md](research-index.md) for navigation
- [curriculum-asset-opportunity-map.research.md](curriculum-asset-opportunity-map.research.md) for the cross-cutting synthesis

---

## Future Boundaries

Future work is organised by **domain boundaries** in `future/`:

| Boundary | Focus |
|--------|--------|
| [01-strategic-lifecycle-backlog](future/01-strategic-lifecycle-backlog/) | Backlog lifecycle and promotion discipline |
| [02-schema-authority-and-codegen](future/02-schema-authority-and-codegen/) | Build-time schema and codegen authority |
| [03-vocabulary-and-semantic-assets](future/03-vocabulary-and-semantic-assets/) | Semantic artefact mining and classification |
| [04-retrieval-quality-engine](future/04-retrieval-quality-engine/) | Retrieval quality evolution (Levels 2-4) |
| [05-query-policy-and-sdk-contracts](future/05-query-policy-and-sdk-contracts/) | Query decision policy and API/filter contracts |
| [06-mcp-consumer-integration](future/06-mcp-consumer-integration/) | MCP consumer integration and result contracts |
| [07-runtime-governance-and-operations](future/07-runtime-governance-and-operations/) | Runtime budgets, rollouts, ownership, safety |
| [08-experience-surfaces-and-extensions](future/08-experience-surfaces-and-extensions/) | Experience surfaces and extension capabilities |
| [09-evaluation-and-evidence](future/09-evaluation-and-evidence/) | Ground-truth and evidence expansion planning |

Transferred files in `future/` are currently verbatim copies with link targets normalised
to the boundary structure.

---

## Documents

| Document | Purpose |
|----------|---------|
| [Prompt](../../prompts/semantic-search/semantic-search.prompt.md) | Session entry point |
| [Research Index](research-index.md) | Navigation for boundary-local research companions |
| [Curriculum Asset Opportunity Map](curriculum-asset-opportunity-map.research.md) | Cross-cutting synthesis of bulk-signal, vocabulary, and graph opportunities |
| [Roadmap](roadmap.md) | **THE** authoritative plan sequence |
| [SDK Workspace Separation](archive/completed/sdk-workspace-separation.md) | ✅ Complete — archived |
| [SDK Separation Pre-Phase-1 Decisions](archive/completed/sdk-separation-pre-phase1-decisions.md) | ✅ Archived — D1-D5 decision rationale (all integrated into canonical plan) |
| [Search Results Quality](archive/completed/search-results-quality.md) | ✅ Complete — ADR-120 |
| [Search Dispatch Type Safety](archive/completed/search-dispatch-type-safety.md) | ✅ Complete — B1 type-safe dispatch + W1 rename |
| [Widget Search Rendering](archive/completed/widget-search-rendering.md) | ✅ Complete — Phases 0-5, archived |
| [Result Pattern Unification](active/mcp-result-pattern-unification.execution.plan.md) | 🟢 In progress — `Result<T, E>` migration |
| [M2 Public Alpha Blockers](current/m2-public-alpha-auth-rate-limits.execution.plan.md) | 📋 Next-up execution for production Clerk + OAuth edge rate limiting |
| [Search Acceptance Criteria](search-acceptance-criteria.md) | Level definitions |
| [Ground Truth Protocol](../../../apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md) | Baseline metrics and process |
| [MCP Extensions Roadmap](../sdk-and-mcp-enhancements/roadmap.md) | 📋 Post-merge SDK/MCP enhancements governance |
| [Widget Renderer Reactivation](future/08-experience-surfaces-and-extensions/widget-renderer-reactivation.md) | ⏸️ Post-merge — wire renderers back after MCP extensions + Apps SDK work |
| [Future Boundary Hub](future/README.md) | Canonical LATER backlog structure |
| [Post-SDK Transfer Manifest](future/TRANSFER-MANIFEST.md) | Source-to-target parity verification |
| [Information Retention Check](future/INFORMATION-RETENTION-CHECK.md) | Pre-removal structural retention audit |
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

1. [principles.md](../../directives/principles.md)
2. [testing-strategy.md](../../directives/testing-strategy.md)
3. [schema-first-execution.md](../../directives/schema-first-execution.md)
