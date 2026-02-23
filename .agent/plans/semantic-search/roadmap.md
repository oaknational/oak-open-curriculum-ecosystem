# Semantic Search Roadmap

**Status**: 🔄 Milestone 0 — merge preparation in progress
**Last Updated**: 2026-02-23
**Session Entry**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

**Metrics authority**: [Ground Truth Protocol](../../../apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md)

---

## Purpose

This roadmap is the strategic milestone sequence for semantic search work.
Execution detail lives in active plans under `active/` and completed plans under
`archive/completed/`.

Authoritative active execution source:

1. [sdk-workspace-separation.md](active/sdk-workspace-separation.md)

Completed plans (archived):

- [widget-search-rendering.md](archive/completed/widget-search-rendering.md) — Widget Phases 0-5
- [search-snagging.md](archive/completed/search-snagging.md) — 5 SDK tool bugs, smoke-tested

---

## Milestone Context

This roadmap sits within the high-level milestone sequence:

```text
Milestone 0: Open Source Readiness               🔄 THIS ROADMAP
  → Complete merge gates, secrets sweep, make repo public

Milestone 1: Public Alpha                        📋 NEXT
  → Clerk production migration, mcp-ext-app UI architecture

Milestone 2: Post-Alpha Enhancements             📋 PLANNED
  → MCP extensions, architectural enforcement, search quality Phase 4
```

See [high-level-plan.md](../high-level-plan.md) for full milestone definitions.

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

## Milestone 0 — Merge Gates (Current)

The branch merge remains blocked until these complete:

1. **3e SDK workspace separation** (type-gen/runtime split)
2. **Secrets and PII sweep** — final scan before making repo public

Completed merge gates:

- 3h Widget stabilisation Phases 0-5 — all renderers and resilience
  hardening complete, quality gates pass.
- 3g dispatch safety — complete and archived.
- 3b and 3c are post-merge by design.

### Post-merge, pre-Milestone-1 work

These are not merge-blocking but should complete before public alpha:

- 3b Result pattern unification
- 3c STDIO-HTTP alignment

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
  3e-auth. OAuth validation/Cursor investigation     ✅ COMPLETE (archived)
  3f. Proxy OAuth AS for Cursor                     ✅ COMPLETE
  3g. Search dispatch type safety                   ✅ COMPLETE (archived)
  3e. SDK workspace separation                      🔄 MERGE-BLOCKING
  3h. Widget stabilisation (Tracks 1a + 1b)         ✅ COMPLETE
  ── Secrets/PII sweep ──                           📋 PRE-PUBLIC
  ── Merge + make repo public ──                    📋 MILESTONE 0 EXIT
  3b. Result pattern unification                    📋 POST-MERGE
  3c. STDIO-HTTP alignment                          📋 POST-MERGE
        ↓
Milestone 1: Public Alpha                           📋 PLANNED
  Clerk production migration                        📋 RESEARCH COMPLETE
  mcp-ext-app UI architecture                       📋 DECISION GATE
        ↓
Phase 4: Search Quality + Ecosystem                 📋 MILESTONE 2
Phase 5: Extensions                                 📋 MILESTONE 2
```

---

## Phase 3 Details

### 3e SDK Workspace Separation (Merge-Blocking)

- Active plan: [sdk-workspace-separation.md](active/sdk-workspace-separation.md)
- Strategic dependency: [ADR-108](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md)
- Task-graph dependency: [ADR-065](../../../docs/architecture/architectural-decisions/065-turbo-task-dependencies.md)
- Vocab pipeline dependency: [ADR-086](../../../docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md)

Goal:

- Split generation-time and runtime ownership into separate SDK workspaces,
  with strict one-way dependency (runtime -> generation).

### 3h Widget Stabilisation (Complete)

- Plan: [widget-search-rendering.md](archive/completed/widget-search-rendering.md)

All phases (0-5) complete:

- Track 1a: non-search widgets reduced to shell-only branding paths.
- Track 1b: search (4 scopes + suggest), browse, and explore renderers implemented with three-level TDD, Zod contract tests, and architecture reviews.
- Phase 5: critical resilience hardening — error containment, JSON.stringify for JS generation, fail-fast validation, delegated click handlers, four-way sync enforcement.

---

## Milestone 1: Public Alpha

Research and planning for public alpha:

1. **Clerk production migration** — research complete, decision
   pending.
   [auth/clerk-production-migration.md](../../research/auth/clerk-production-migration.md)
2. **MCP ext-app UI architecture** — decision gate before Milestone 1
   execution. Option X: migrate before alpha. Option Y: launch with
   current widgets, migrate in Milestone 2. See
   [mcp-extensions-research-and-planning.md](../sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md)
   (Domain A) and [high-level-plan.md](../high-level-plan.md) for
   decision criteria.

---

## Post-Merge Work (Milestone 0 Exit → Milestone 1)

### MCP Tool Snagging — IMPLEMENTED AND SMOKE-TESTED

- Plan: [search-snagging.md](archive/completed/search-snagging.md)
- 5 SDK tool bugs (response augmentation, suggest search, schema
  validation) found during 31-tool smoke test — **all fixed** with
  full TDD (2026-02-22), end-to-end smoke-tested against running
  HTTP MCP server (2026-02-23)
- **Architectural insight**: all five bugs stemmed from the same root
  cause — the response augmentation system was built outside the
  schema-first discipline. Path matching used substring heuristics
  instead of schema-derived maps; context extraction manually checked
  property names instead of validating against generated schemas;
  tests encoded the same wrong assumptions as the code.
- Three execution tracks completed: A (response augmentation —
  Snags 2/3/4), B (suggest search — Snag 1), C (schema validation
  — Snag 5)
- **Logger architectural bug** also fixed: two SDK logger instances
  updated from `console.log` sinks to `createNodeStdoutSink()` +
  `buildResourceAttributes(process.env, ...)`, middleware factory
  updated with DI for logger injection. 4 integration tests added.

### no-console ESLint Enforcement

- Plan: [no-console-enforcement.plan.md](../architecture/no-console-enforcement.plan.md)
- Add `no-console: 'error'` to shared ESLint config, eliminate all
  `console.*` usage (~110 files, largely mechanical)
- Origin: logger architectural bug found during snagging session

### 3b Result Pattern Unification

- Plan: [mcp-result-pattern-unification.md](post-sdk/mcp-integration/mcp-result-pattern-unification.md)

### 3c STDIO-HTTP Alignment

- Plan: [stdio-http-server-alignment.md](../architecture/stdio-http-server-alignment.md)

---

## Phase 4 Streams (Milestone 2)

Primary stream hubs (post-alpha):

- [post-sdk/search-quality/](post-sdk/search-quality/)
- [post-sdk/bulk-data-analysis/](post-sdk/bulk-data-analysis/)
- [post-sdk/sdk-api/](post-sdk/sdk-api/)
- [post-sdk/operations/](post-sdk/operations/)
- [post-sdk/extensions/](post-sdk/extensions/)

### Response Augmentation Schema Alignment (Phase 4)

Bring the response augmentation system into the schema-first
discipline. Origin: architectural root cause analysis from
[MCP tool snagging](archive/completed/search-snagging.md).

**Depends on**: MCP tool snagging fixes complete (Track A
establishes the schema-driven context extraction pattern that
Phase 4 extends to path mapping).

Work items:

- **4a Schema-driven path-to-content-type mapping**: generate a
  static path-to-content-type allowlist from OpenAPI path
  definitions at `pnpm type-gen` time, replacing the current
  hand-written `isSingleEntityEndpoint` regex heuristic.
- **4b Schema conformance tests**: add captured API response
  fixtures as part of type-gen quality gates to prevent schema
  drift.

**Acceptance criteria**: path-to-content-type mapping is generated
at `pnpm type-gen` time; no hand-written path heuristics remain
in response augmentation.

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

1. [high-level-plan.md](../high-level-plan.md) — milestone sequence
2. [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)
3. [semantic-search/README.md](README.md)
4. [completed-plans.md](../completed-plans.md)
5. [Ground Truth Protocol](../../../apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md)
6. [search-acceptance-criteria.md](search-acceptance-criteria.md)
7. [auth/clerk-production-migration.md](../../research/auth/clerk-production-migration.md) — Milestone 1 research
8. [mcp-extensions-research-and-planning.md](../sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md) — Milestone 1-2 plan
9. [architectural-enforcement-adoption.plan.md](../agentic-engineering-enhancements/architectural-enforcement-adoption.plan.md) — Milestone 2 plan
10. [cross-agent-standardisation.plan.md](../agentic-engineering-enhancements/cross-agent-standardisation.plan.md) — Milestone 2 plan

---

## Foundation Recommitment

Before each execution phase, re-read:

1. [rules.md](../../directives/rules.md)
2. [testing-strategy.md](../../directives/testing-strategy.md)
3. [schema-first-execution.md](../../directives/schema-first-execution.md)

First question at each decision point:

- Could it be simpler without compromising quality?
