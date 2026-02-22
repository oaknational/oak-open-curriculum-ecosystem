# Semantic Search Roadmap

**Status**: 🔄 Phase 3 merge preparation in progress  
**Last Updated**: 2026-02-22  
**Session Entry**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

**Metrics authority**: [Ground Truth Protocol](../../../apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md)

---

## Purpose

This roadmap is the strategic milestone sequence for semantic search work.
Execution detail lives in active plans under `active/` and completed plans under
`archive/completed/`.

Authoritative active execution sources:

1. [sdk-workspace-separation.md](active/sdk-workspace-separation.md)
2. [widget-search-rendering.md](active/widget-search-rendering.md)

---

## Current State

Phase 3a MCP search integration is complete and archived:

- [phase-3a-mcp-search-integration.md](archive/completed/phase-3a-mcp-search-integration.md)

Search dispatch type safety (3g) is complete and archived:

- [search-dispatch-type-safety.md](archive/completed/search-dispatch-type-safety.md)

OAuth compliance and Cursor compatibility are complete:

- [ADR-113](../../../docs/architecture/architectural-decisions/113-mcp-spec-compliant-auth-for-all-methods.md)
- [ADR-115](../../../docs/architecture/architectural-decisions/115-proxy-oauth-as-for-cursor.md)

Ground-truth baselines currently tracked:

| Index | GTs | MRR | NDCG@10 | Status |
|-------|-----|-----|---------|--------|
| `oak_lessons` | 30 | 0.983 | 0.944 | ✅ Established |
| `oak_unit_rollup` | 2 | 1.000 | 0.923 | ✅ Established |
| `oak_threads` | 8 | 0.938 | 0.902 | ✅ Established |
| `oak_sequences` | 1 | 1.000 | 1.000 | ✅ Mechanism check |

---

## Merge Gates (Current)

The branch merge remains blocked until both of these complete:

1. **3e SDK workspace separation** (type-gen/runtime split)
2. **3h Widget stabilisation** (Tracks 1a + 1b in one pre-merge plan)

Notes:

- 3g dispatch safety is complete and archived.
- 3b and 3c are post-merge by design.

---

## Execution Order

```text
Phase 1: Ground Truth Foundation                    ✅ COMPLETE
Phase 2: SDK Extraction + CLI Wiring                ✅ COMPLETE
Phase 2e: SDK Validation against Real ES            ✅ COMPLETE
Phase 2f: Public Release Readiness                  ✅ COMPLETE
Phase 2g: Developer Onboarding                      ✅ COMPLETE
Phase 2h: Code Quality Remediation                  ✅ COMPLETE
        ↓
Phase 3: MCP Integration + Merge Preparation        🔄 IN PROGRESS
  3a. MCP search integration                        ✅ COMPLETE (archived)
  3d. OAuth spec compliance                         ✅ COMPLETE
  3e'. OAuth validation/Cursor investigation        ✅ COMPLETE (archived)
  3f. Proxy OAuth AS for Cursor                     ✅ COMPLETE
  3g. Search dispatch type safety                   ✅ COMPLETE (archived)
  3e. SDK workspace separation                      🔄 MERGE-BLOCKING
  3h. Widget stabilisation (Tracks 1a + 1b)         🔄 MERGE-BLOCKING
  3b. Result pattern unification                    📋 POST-MERGE
  3c. STDIO-HTTP alignment                          📋 POST-MERGE
        ↓
Phase 4: Search Quality + Ecosystem                📋 PLANNED
Phase 5: Extensions                                ⏸️ BLOCKED BY PHASE 4
```

---

## Phase 3 Details

### 3e SDK Workspace Separation (Merge-Blocking)

- Active plan: [sdk-workspace-separation.md](active/sdk-workspace-separation.md)
- Findings/meta plan: [sdk-workspace-separation-meta-plan.md](active/sdk-workspace-separation-meta-plan.md)
- Strategic dependency: [ADR-108](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md)

Goal:

- Split generation-time and runtime ownership into separate SDK workspaces,
  with strict one-way dependency (runtime -> generation).

### 3h Widget Stabilisation (Merge-Blocking)

- Active plan: [widget-search-rendering.md](active/widget-search-rendering.md)

Goal:

- Track 1a: non-search widgets reduced to shell-only branding paths.
- Track 1b: search and suggest rendering correctness with drift-protection tests.

---

## Post-Merge Work (Planned)

### 3b Result Pattern Unification

- Plan: [mcp-result-pattern-unification.md](post-sdk/mcp-integration/mcp-result-pattern-unification.md)

### 3c STDIO-HTTP Alignment

- Plan: [stdio-http-server-alignment.md](../architecture/stdio-http-server-alignment.md)

---

## Phase 4 Streams

Primary stream hubs (post-merge):

- [post-sdk/search-quality/](post-sdk/search-quality/)
- [post-sdk/bulk-data-analysis/](post-sdk/bulk-data-analysis/)
- [post-sdk/sdk-api/](post-sdk/sdk-api/)
- [post-sdk/operations/](post-sdk/operations/)
- [post-sdk/extensions/](post-sdk/extensions/)

---

## Quality Gates

Run from repo root, in order:

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

## Related Documents

1. [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)
2. [semantic-search/README.md](README.md)
3. [completed-plans.md](../completed-plans.md)
4. [Ground Truth Protocol](../../../apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md)
5. [search-acceptance-criteria.md](search-acceptance-criteria.md)

---

## Foundation Recommitment

Before each execution phase, re-read:

1. [rules.md](../../directives/rules.md)
2. [testing-strategy.md](../../directives/testing-strategy.md)
3. [schema-first-execution.md](../../directives/schema-first-execution.md)

First question at each decision point:

- Could it be simpler without compromising quality?
