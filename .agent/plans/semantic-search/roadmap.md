# Semantic Search Roadmap

**Status**: ✅ Milestones 0 and 1 complete. Recovery lane plans are archived; active execution is now narrowed to open production validation findings while pending follow-ons are queued in `current/`.
**Last Updated**: 2026-03-21
**Session Entry**: [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)
**Metrics Authority**: [Ground Truth Protocol](../../../apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md)

---

## Purpose

Provide the strategic sequence for semantic search delivery while keeping
execution detail in plan lanes:

- `active/` — now
- `current/` — next
- `future/` — later
- `archive/completed/` — historical evidence

Lane indexes:

1. [active/README.md](active/README.md)
2. [current/README.md](current/README.md)
3. [future/README.md](future/README.md)

---

## Milestone Context

```text
Milestone 0: Open Private Alpha      ✅ COMPLETE
Milestone 1: Invite-Only Alpha       ✅ COMPLETE
Milestone 2: Open Public Alpha       🔄 NEXT
Milestone 3: Public Beta             📋 PLANNED
```

For full milestone definitions: [high-level-plan.md](../high-level-plan.md).

---

## Current State (Compact)

- Active plan:
  - [f2-closure-and-p0-ingestion.execution.plan.md](active/f2-closure-and-p0-ingestion.execution.plan.md)
  - Supporting: [search-tool-prod-validation-findings-2026-03-15.md](active/search-tool-prod-validation-findings-2026-03-15.md)
- Completed authorities archived:
  - [semantic-search-recovery-and-guardrails.execution.plan.md](archive/completed/semantic-search-recovery-and-guardrails.execution.plan.md)
  - [semantic-search-ingest-runbook.md](archive/completed/semantic-search-ingest-runbook.md)
- Pending/not-started semantic-search lanes are queued in
  [current/README.md](current/README.md), including:
  `unified-versioned-ingestion`, `sequence-retrieval-architecture-followup`,
  `scheduled-refresh` (deferred), `search-sdk-args-extraction`,
  `bulk-metadata-quick-wins`, `kg-alignment-audit`, and
  `category-integration-remediation`.
- Supporting incident history is archived in
  [archive/completed/cli-robustness.plan.md](archive/completed/cli-robustness.plan.md).
- Migration boundary doctrine evidence remains in
  [archive/completed/search-cli-sdk-boundary-migration.execution.plan.md](archive/completed/search-cli-sdk-boundary-migration.execution.plan.md).

Ground-truth baseline snapshot:

| Index | GTs | MRR | NDCG@10 | Status |
|---|---:|---:|---:|---|
| `oak_lessons` (per-subject) | 30 | 0.983 | 0.944 | ✅ Established |
| `oak_lessons` (cross-subject) | 3 | 0.750 | 0.814 | ✅ Established |
| `oak_unit_rollup` | 2 | 1.000 | 0.923 | ✅ Established |
| `oak_threads` | 8 | 0.938 | 0.902 | ✅ Established |
| `oak_sequences` | 1 | 1.000 | 1.000 | ✅ Mechanism check |

Search quality tuning is resolved and anchored in
[ADR-120](../../../docs/architecture/architectural-decisions/120-per-scope-search-tuning.md).

---

## Execution Order

```text
Phase 1/2 foundation and extraction                 ✅ COMPLETE
Phase 3 MCP + merge-prep streams                    ✅ COMPLETE (historical)
Milestone 1 invite-only alpha                       ✅ COMPLETE
Milestone 2 open public alpha                        🔄 NEXT
Milestone 3 public beta                              📋 PLANNED
```

Detailed historical phase notes remain in archived plans and ADRs.

---

## Phase 4 Streams (Queued/Future)

Primary hubs:

- [future/04-retrieval-quality-engine/](future/04-retrieval-quality-engine/)
- [future/03-vocabulary-and-semantic-assets/](future/03-vocabulary-and-semantic-assets/)
- [future/05-query-policy-and-sdk-contracts/](future/05-query-policy-and-sdk-contracts/)
- [future/07-runtime-governance-and-operations/](future/07-runtime-governance-and-operations/)
- [future/08-experience-surfaces-and-extensions/](future/08-experience-surfaces-and-extensions/)

Cross-stream queued references:

- [current/bulk-metadata-quick-wins.execution.plan.md](current/bulk-metadata-quick-wins.execution.plan.md)
- [current/kg-alignment-audit.execution.plan.md](current/kg-alignment-audit.execution.plan.md)
- [current/kg-integration-quick-wins.plan.md](current/kg-integration-quick-wins.plan.md)
- [current/sequence-retrieval-architecture-followup.plan.md](current/sequence-retrieval-architecture-followup.plan.md)

---

## Quality Gates

Run from repo root, in this order:

```bash
pnpm secrets:scan:all
pnpm clean
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm doc-gen
pnpm format:root
pnpm markdownlint:root
pnpm subagents:check
pnpm portability:check
pnpm lint:fix
pnpm test
pnpm test:e2e
pnpm test:ui
pnpm smoke:dev:stub
```

---

## Related Documents

1. [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)
2. [README.md](README.md)
3. [completed-plans.md](../completed-plans.md)
4. [search-acceptance-criteria.md](search-acceptance-criteria.md)
5. [../sdk-and-mcp-enhancements/roadmap.md](../sdk-and-mcp-enhancements/roadmap.md)

---

## Foundation Recommitment

Before each execution phase, re-read:

1. [principles.md](../../directives/principles.md)
2. [testing-strategy.md](../../directives/testing-strategy.md)
3. [schema-first-execution.md](../../directives/schema-first-execution.md)
