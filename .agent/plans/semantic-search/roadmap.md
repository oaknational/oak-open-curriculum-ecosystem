# Semantic Search Roadmap

**Status**: ✅ Milestones 0 and 1 complete — active post-merge execution running, four plans active in `active/`, Milestone 2 blockers queued in `current/`, with semantic-search and graph follow-ons queued behind the active streams
**Last Updated**: 2026-03-07
**Session Entry**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)

**Metrics authority**: [Ground Truth Protocol](../../../apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md)

---

## Purpose

This roadmap is the strategic milestone sequence for semantic search work.
Execution detail lives in lifecycle lanes:

- `active/` (now, in progress)
- `current/` (next, queued)
- `future/` (later, deferred)
- `archive/completed/` (done, read-only)

Merge-blocking plan (complete): [sdk-workspace-separation.md](archive/completed/sdk-workspace-separation.md)

Execution lane indexes:

1. [current/README.md](current/README.md)
2. [active/README.md](active/README.md)
3. [future/README.md](future/README.md)

Completed plans (archived):

- [sdk-workspace-separation.md](archive/completed/sdk-workspace-separation.md) — generation/runtime split, 11 subpath exports, boundary rules, 4 renames, Phase 7 complete ([ADR-108](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md))
- [search-results-quality.md](archive/completed/search-results-quality.md) — fuzziness + score filtering ([ADR-120](../../../docs/architecture/architectural-decisions/120-per-scope-search-tuning.md))
- [widget-search-rendering.md](archive/completed/widget-search-rendering.md) — Widget Phases 0-5
- [search-snagging.md](archive/completed/search-snagging.md) — 5 SDK tool bugs, smoke-tested
- [typegen-vs-codegen-semantic-split.md](archive/completed/typegen-vs-codegen-semantic-split.md) — typegen/codegen naming (part of SDK workspace separation)

---

## Milestone Context

This roadmap sits within the high-level milestone sequence:

```text
Milestone 0: Open Private Alpha                  ✅ COMPLETE
  → Branch merged, repo ready to go public

Milestone 1: Invite-Only Alpha                   ✅ COMPLETE
  → Invite-only alpha baseline complete and released

Milestone 2: Open Public Alpha                   🔄 NEXT
  → Production Clerk, social providers, public sign-up
  → Edge rate limiting on OAuth proxy endpoints

Milestone 3: Public Beta                         📋 PLANNED
  → Search quality Phase 4, architectural enforcement, observability
```

See [high-level-plan.md](../high-level-plan.md) for full milestone definitions.

---

## Current State

Cross-collection sequencing note:

- [high-level-plan.md](../high-level-plan.md) currently sequences:
  `oak-preview` snagging/deploy, then post-deploy bulk-data re-download and
  Elasticsearch reindex validation, then MCP Apps infrastructure migration,
  then graph follow-on work from the active alignment audit.
- Semantic-search currently has four active plans in `active/`:
  `unified-versioned-ingestion`, `search-sdk-args-extraction`,
  `bulk-metadata-quick-wins`, and `kg-alignment-audit`.
- The graph lane now has its first evidence-first slice promoted into
  [kg-alignment-audit.execution.plan.md](active/kg-alignment-audit.execution.plan.md),
  though its phases remain pending, while
  [kg-integration-quick-wins.plan.md](current/kg-integration-quick-wins.plan.md)
  remains the parent queued plan for the remaining quick wins.

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
| `oak_lessons` (per-subject) | 30 | 0.983 | 0.944 | ✅ Established |
| `oak_lessons` (cross-subject) | 3 | 0.750 | 0.814 | ✅ Established |
| `oak_unit_rollup` | 2 | 1.000 | 0.923 | ✅ Established |
| `oak_threads` | 8 | 0.938 | 0.902 | ✅ Established |
| `oak_sequences` | 1 | 1.000 | 1.000 | ✅ Mechanism check |

### Search quality — RESOLVED (2026-02-23)

Fuzziness aligned to `AUTO:6,9`, score filtering at `DEFAULT_MIN_SCORE = 0.02`,
total semantics unified as `results.length`. All four architecture reviewers
invoked; feedback applied. Decisions documented in
[ADR-120](../../../docs/architecture/architectural-decisions/120-per-scope-search-tuning.md).

Archived plan: [search-results-quality.md](archive/completed/search-results-quality.md)

---

## Milestone 0 — Merge Gates (Historical, complete)

Milestone 0 merge gates were completed before the 2026-03-03 public release:

1. ~~**3i Search results quality**~~ — ✅ COMPLETE ([ADR-120](../../../docs/architecture/architectural-decisions/120-per-scope-search-tuning.md))
2. ~~**3e SDK workspace separation**~~ — ✅ COMPLETE — all phases 0-7, 12 gates pass
3. **Secrets and PII sweep** — completed as final pre-public check

Completed merge gates:

- 3h Widget stabilisation Phases 0-5 — all renderers and resilience
  hardening complete, quality gates pass.
- 3g dispatch safety — complete and archived.
- 3b and 3c are post-merge by design.

### 3i Search Results Quality — ✅ COMPLETE

- Archived plan: [search-results-quality.md](archive/completed/search-results-quality.md)
- ADR: [ADR-120](../../../docs/architecture/architectural-decisions/120-per-scope-search-tuning.md)

### Post-merge work now active in Milestone 2+ sequencing

These are no longer merge-blocking and remain in the execution backlog:

- 3b Result pattern unification
- 3c STDIO-HTTP alignment
- Milestone 2 auth/rate-limit blockers: [m2-public-alpha-auth-rate-limits.execution.plan.md](current/m2-public-alpha-auth-rate-limits.execution.plan.md)
- Independent semantic-search stream already active:
  [bulk-metadata-quick-wins.execution.plan.md](active/bulk-metadata-quick-wins.execution.plan.md)
- Remaining follow-on queue: see [Phase 4 Streams](#phase-4-streams-independent-search-quality-streams-alongside-milestone-2).

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
Phase 3: MCP Integration + Merge Preparation        ✅ COMPLETE (historical)
  3a. MCP search integration                        ✅ COMPLETE (archived)
  3d. OAuth spec compliance                         ✅ COMPLETE
  3e-auth. OAuth validation/Cursor investigation     ✅ COMPLETE (archived)
  3f. Proxy OAuth AS for Cursor                     ✅ COMPLETE
  3g. Search dispatch type safety                   ✅ COMPLETE (archived)
  3h. Widget stabilisation (Tracks 1a + 1b)         ✅ COMPLETE
  3i. Search results quality                        ✅ COMPLETE (ADR-120)
  3e. SDK workspace separation                      ✅ COMPLETE (archived)
  ── Secrets/PII sweep ──                           ✅ COMPLETE
  ── Merge + make repo public ──                    ✅ COMPLETE (Milestone 0 exit)
  3b. Result pattern unification                    🟢 ACTIVE
  3c. STDIO-HTTP alignment                          📋 POST-MERGE
        ↓
Milestone 1: Invite-Only Alpha                      ✅ COMPLETE
  Baseline delivered and in production
        ↓
Milestone 2: Open Public Alpha                      🔄 NEXT
  Clerk production migration + edge rate limiting
  Canonical blocker plan: current/m2-public-alpha-auth-rate-limits.execution.plan.md
        ↓
Milestone 3: Public Beta                            📋 PLANNED
  Phase 4: Search Quality + Ecosystem
  Phase 5: Extensions
```

---

## Phase 3 Details

### 3e SDK Workspace Separation (Merge-Blocking)

- Archived plan: [sdk-workspace-separation.md](archive/completed/sdk-workspace-separation.md)
- Strategic dependency: [ADR-108](../../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md)
- Task-graph dependency: [ADR-065](../../../docs/architecture/architectural-decisions/065-turbo-task-dependencies.md)
- Vocab pipeline dependency: [ADR-086](../../../docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md)

Goal:

- Split generation-time and runtime ownership into separate SDK workspaces,
  with strict one-way dependency (runtime -> generation).

Progress (25 Feb 2026):

- Phases 0–6 complete. Codegen workspace `packages/sdks/oak-sdk-codegen/`
  (`@oaknational/sdk-codegen`) with sdk-codegen pipeline, generated types,
  11 subpath exports, and boundary rules. ~70 runtime files rewired.
  Vocab-gen/bulk moved, search CLI rewired. DI refactoring for universal
  tools (GeneratedToolRegistry). All Phase 5 reviewer findings (F1–F10,
  F18) resolved. Architecture remediation N1–N6 complete.
- Phase 6 (25 Feb 2026): four renames executed — `@oaknational/sdk-codegen`
  (was `curriculum-sdk-generation`), `@oaknational/logger` (was
  `mcp-logger`), `@oaknational/env` (was `mcp-env`), repo internal refs
  to `oak-open-curriculum-ecosystem` (was `oak-open-curriculum-ecosystem`). Plus Phase 5
  reviewer suggestions (S1–S3), provenance banners (F11), evaluation
  decisions (F12–F14), documentation alignment.
- Phase 7 complete. Full quality gate chain, determinism verification,
  8 specialist reviews. Merge-ready.

### 3h Widget Stabilisation (Complete)

- Plan: [widget-search-rendering.md](archive/completed/widget-search-rendering.md)

All phases (0-5) complete:

- Track 1a: non-search widgets reduced to shell-only branding paths.
- Track 1b: search (4 scopes + suggest), browse, and explore renderers implemented with three-level TDD, Zod contract tests, and architecture reviews.
- Phase 5: critical resilience hardening — error containment, JSON.stringify for JS generation, fail-fast validation, delegated click handlers, four-way sync enforcement.

---

## Milestone 1: Invite-Only Alpha

Milestone 1 is complete. Remaining auth/public access work was reclassified
to Milestone 2 blockers.

Canonical next plan:

- [m2-public-alpha-auth-rate-limits.execution.plan.md](current/m2-public-alpha-auth-rate-limits.execution.plan.md)

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

- Canonical plan (folded scope):
  [devx-strictness-convergence.plan.md](../developer-experience/active/devx-strictness-convergence.plan.md)
- Add `no-console: 'error'` to shared ESLint config and converge
  `console.*` usage/allowlists under the canonical strictness track
- Origin: logger architectural bug found during snagging session

### 3b Result Pattern Unification — ✅ COMPLETE

- Archived plan: [mcp-result-pattern-unification.execution.plan.md](archive/completed/mcp-result-pattern-unification.execution.plan.md)

### 3c STDIO-HTTP Alignment

- Plan: [stdio-http-server-alignment.md](../architecture-and-infrastructure/stdio-http-server-alignment.md)

---

## Phase 4 Streams (Independent search-quality streams alongside Milestone 2)

Primary boundary hubs (post-alpha):

- [future/04-retrieval-quality-engine/](future/04-retrieval-quality-engine/) — includes future reranking investigation (Level 3)
- [future/03-vocabulary-and-semantic-assets/](future/03-vocabulary-and-semantic-assets/)
- [future/05-query-policy-and-sdk-contracts/](future/05-query-policy-and-sdk-contracts/)
- [future/07-runtime-governance-and-operations/](future/07-runtime-governance-and-operations/)
- [future/08-experience-surfaces-and-extensions/](future/08-experience-surfaces-and-extensions/)

Standalone backlog items across streams:

- [move-search-domain-knowledge-to-codegen-time.md](future/02-schema-authority-and-codegen/move-search-domain-knowledge-to-codegen-time.md)
- [bulk-schema-driven-code-generation.md](future/02-schema-authority-and-codegen/bulk-schema-driven-code-generation.md)

These plans are part of the Milestone 3 search-quality stream, but the Boundary
03 quick-win work can progress before the Milestone 2 public-release blocker is
closed.

Current active and queued execution plans:

- [mcp-result-pattern-unification.execution.plan.md](archive/completed/mcp-result-pattern-unification.execution.plan.md) — ✅ complete
- [unified-versioned-ingestion.md](active/unified-versioned-ingestion.md) — unify bulk ingestion, fix layer boundaries, enable blue/green lifecycle (ADR-130)
- [blue-green-reindex.execution.plan.md](archive/completed/blue-green-reindex.execution.plan.md) — ✅ superseded (archived)
- [search-sdk-args-extraction.plan.md](active/search-sdk-args-extraction.plan.md) — cross-cutting active Search SDK extraction work
- [bulk-metadata-quick-wins.execution.plan.md](active/bulk-metadata-quick-wins.execution.plan.md) — Boundary 03 — active widening of schema-aligned bulk outputs using existing extractors and structured fields
- [kg-alignment-audit.execution.plan.md](active/kg-alignment-audit.execution.plan.md) — graph-enablement — active overlap audit to drive the next ontology-backed quick win
- [keyword-definition-assets.execution.plan.md](current/keyword-definition-assets.execution.plan.md) — Boundary 03 — promote lesson keyword definitions into reusable curriculum assets
- [thread-sequence-semantic-surfaces.execution.plan.md](current/thread-sequence-semantic-surfaces.execution.plan.md) — Boundary 04 — enrich thread/sequence search targets from existing lesson and unit data
- [kg-integration-quick-wins.plan.md](current/kg-integration-quick-wins.plan.md) — parent queued graph quick-win plan for separate Neo4j provisioning, Elasticsearch projections, and bounded graph augmentation after the active audit

### Reranking (Future — Level 3)

With fuzziness tuning and score filtering complete
([ADR-120](../../../docs/architecture/architectural-decisions/120-per-scope-search-tuning.md)),
result sets are now focused and relevant. The next ranking
improvement opportunity is reranking — using cross-encoder
models, Elastic's semantic reranker, or LLM-based reranking to
improve within-result ordering. This is particularly relevant
for polysemous queries (e.g. "tree" returning both science
trees and maths tree diagrams). Investigate as part of search
quality Level 3, after Level 2 (document relationships) is
exhausted.

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
  definitions at `pnpm sdk-codegen` time, replacing the current
  hand-written `isSingleEntityEndpoint` regex heuristic.
- **4b Schema conformance tests**: add captured API response
  fixtures as part of sdk-codegen quality gates to prevent schema
  drift.

**Acceptance criteria**: path-to-content-type mapping is generated
at `pnpm sdk-codegen` time; no hand-written path heuristics remain
in response augmentation.

---

## Quality Gates

Run from repo root, in order:

```bash
pnpm clean
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm format:root
pnpm markdownlint:root
pnpm subagents:check
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
7. [auth/clerk-production-migration.md](../../research/auth/clerk-production-migration.md) — Milestone 2 blocker research
8. [../sdk-and-mcp-enhancements/roadmap.md](../sdk-and-mcp-enhancements/roadmap.md) — Milestone 1-2 roadmap
9. [architectural-enforcement-adoption.plan.md](../agentic-engineering-enhancements/architectural-enforcement-adoption.plan.md) — Milestone 3 / Public Beta plan
10. [cross-agent-standardisation.plan.md](../agentic-engineering-enhancements/cross-agent-standardisation.plan.md) — Milestone 3 / Public Beta plan

---

## Foundation Recommitment

Before each execution phase, re-read:

1. [principles.md](../../directives/principles.md)
2. [testing-strategy.md](../../directives/testing-strategy.md)
3. [schema-first-execution.md](../../directives/schema-first-execution.md)

First question at each decision point:

- Could it be simpler without compromising quality?
