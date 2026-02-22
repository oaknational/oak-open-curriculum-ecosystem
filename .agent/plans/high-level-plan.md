# High-Level Plan

**Last Updated**: 2026-02-22  
**Status**: 🔄 Active strategic index  
**Scope**: Strategic cross-collection overview for the Oak MCP ecosystem.

This file is a strategic index. Execution detail belongs in collection roadmaps
and active plans.

---

## Current Priorities

### Priority 1: Semantic Search Merge Preparation

Merge is currently gated by two active plans:

1. [sdk-workspace-separation.md](semantic-search/active/sdk-workspace-separation.md)
2. [widget-search-rendering.md](semantic-search/active/widget-search-rendering.md)

Supporting strategic view:

- [semantic-search/roadmap.md](semantic-search/roadmap.md)

Already complete for this phase:

- [phase-3a-mcp-search-integration.md](semantic-search/archive/completed/phase-3a-mcp-search-integration.md)
- [search-dispatch-type-safety.md](semantic-search/archive/completed/search-dispatch-type-safety.md)
- [ADR-113](../../docs/architecture/architectural-decisions/113-mcp-spec-compliant-auth-for-all-methods.md)
- [ADR-115](../../docs/architecture/architectural-decisions/115-proxy-oauth-as-for-cursor.md)

### Priority 2: Post-Merge MCP and SDK Enhancements

Governed by current SDK/MCP enhancement anchors:

1. [mcp-extensions-research-and-planning.md](sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md)
2. [concept-preservation-and-supersession-map.md](sdk-and-mcp-enhancements/concept-preservation-and-supersession-map.md)
3. [folder-disposition-ledger.md](sdk-and-mcp-enhancements/folder-disposition-ledger.md)

Lifecycle note:

- Legacy numbered plans are archived under
  `sdk-and-mcp-enhancements/archive/legacy-numbered/`.
- Folder modernisation plan is archived under
  `sdk-and-mcp-enhancements/archive/completed/`.

### Priority 3: SDK Decomposition Trajectory (ADR-108)

Strategic architecture remains anchored in:

- [ADR-108](../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md)
- [semantic-search/active/sdk-workspace-separation.md](semantic-search/active/sdk-workspace-separation.md)
- [semantic-search/active/sdk-workspace-separation-meta-plan.md](semantic-search/active/sdk-workspace-separation-meta-plan.md)
- [pipeline-enhancements/sdk-workspace-separation-plan.md](pipeline-enhancements/sdk-workspace-separation-plan.md)

---

## Collection Status

| Collection | Strategic Role | Current Status | Primary Entry |
|------------|----------------|----------------|---------------|
| `semantic-search/` | Merge-prep execution and search roadmap | 🔄 Active | [semantic-search/roadmap.md](semantic-search/roadmap.md) |
| `sdk-and-mcp-enhancements/` | Post-merge MCP/extensions governance and concept preservation | 🔄 Active | [sdk-and-mcp-enhancements/README.md](sdk-and-mcp-enhancements/README.md) |
| `pipeline-enhancements/` | Architecture decomposition and reusable pipeline trajectory | 📋 Planned | [pipeline-enhancements/sdk-workspace-separation-plan.md](pipeline-enhancements/sdk-workspace-separation-plan.md) |
| `architecture/` | Cross-cutting architecture and alignment backlog | 📋 Planned | [architecture/stdio-http-server-alignment.md](architecture/stdio-http-server-alignment.md) |
| `quality-and-maintainability/` | Quality/system-hardening backlog | 📋 Planned | [global-state-elimination-and-testing-discipline-plan.md](quality-and-maintainability/global-state-elimination-and-testing-discipline-plan.md) |
| `dev-tooling-and-dev-ai-support/` | Tooling and contract-testing enablement | 📋 Planned | [contract-testing-schema-evolution-plan.md](dev-tooling-and-dev-ai-support/contract-testing-schema-evolution-plan.md) |
| `external/` | Upstream and external dependency requirements | 📋 Reference | [ooc-api-wishlist/index.md](external/ooc-api-wishlist/index.md) |
| `archive/` | Historical completed/superseded plans | ✅ Reference | [archive/](archive/) |

---

## Near-Term Post-Merge Sequence

Planned next sequence once merge gates close:

1. Result pattern unification in MCP integration:
   - [mcp-result-pattern-unification.md](semantic-search/post-sdk/mcp-integration/mcp-result-pattern-unification.md)
2. STDIO/HTTP alignment:
   - [stdio-http-server-alignment.md](architecture/stdio-http-server-alignment.md)
3. Search quality stream progression via semantic-search roadmap.
4. MCP extensions execution via SDK/MCP enhancement governance files.

---

## Recent Completions

Canonical completion index:

- [completed-plans.md](completed-plans.md)

Recent semantic-search completions include:

1. Phase 3a MCP integration
2. Search dispatch type safety
3. OAuth specification compliance
4. Proxy OAuth AS for Cursor

---

## Quality Gates

From repo root, in order:

```bash
pnpm clean
pnpm type-gen
pnpm build
pnpm type-check
pnpm format:root
pnpm markdownlint:root
pnpm lint:fix
pnpm test
pnpm test:ui
pnpm test:e2e
pnpm smoke:dev:stub
```

---

## Foundation Recommitment

Before starting any plan execution phase:

1. [rules.md](../directives/rules.md)
2. [testing-strategy.md](../directives/testing-strategy.md)
3. [schema-first-execution.md](../directives/schema-first-execution.md)

First question:

- Could it be simpler without compromising quality?
