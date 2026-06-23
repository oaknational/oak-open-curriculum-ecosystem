---
name: "Cursor Plans Consolidation Ledger"
status: completed
completed_on: 2026-03-14
scope: ".cursor/plans decommission and canonical target mapping"
---

# Cursor Plans Consolidation Ledger (2026-03-14)

This ledger captures where actionable content from `.cursor/plans/*.plan.md`
now lives before deleting all Cursor plan artifacts.

## Canonical Mapping

| Cursor plan | Canonical destination |
|---|---|
| `semantic-recovery-rebaseline_c4899bb6.plan.md` | `active/semantic-search-recovery-and-guardrails.execution.plan.md`, `active/semantic-search-ingest-runbook.md`, `../../prompts/semantic-search/semantic-search.prompt.md` |
| `semantic-recovery-closeout_3468d34d.plan.md` | `active/semantic-search-recovery-and-guardrails.execution.plan.md` |
| `semantic-search-recovery-plan_1564b226.plan.md` | `active/semantic-search-recovery-and-guardrails.execution.plan.md` |
| `semantic_recovery_next_steps_f23abbbe.plan.md` | `active/semantic-search-recovery-and-guardrails.execution.plan.md` |
| `semantic-search-ingest-runbook_2d613a28.plan.md` | `active/semantic-search-ingest-runbook.md` |
| `search_cli-sdk_boundary_diagnosis_833a74ec.plan.md` | `archive/completed/search-cli-sdk-boundary-migration.execution.plan.md`, ADR-134 |
| `cli-robustness-full-refresh_11ca291c.plan.md` | `archive/completed/cli-robustness.plan.md`, `active/semantic-search-recovery-and-guardrails.execution.plan.md` |
| `graph-data-snagging-plan_b6355aa6.plan.md` | `../current/kg-integration-quick-wins.plan.md`, `../current/kg-alignment-audit.execution.plan.md` |
| `fix_snags_and_bug_report_057dbade.plan.md` | `archive/completed/search-snagging.md`, `archive/completed/short-term-pr-snagging.plan.md` |
| `elasticsearch_specialist_capability_18b8e030.plan.md` | `.agent/plans/agentic-engineering-enhancements/current/elasticsearch-specialist-capability.plan.md` |
| `download-asset_cross-references_25aad224.plan.md` | `../current/bulk_data_for_semantic_search.feature_request.md` |
| `unified_sequenceslug_derivation_a32036ee.plan.md` | `../current/bulk-metadata-quick-wins.execution.plan.md` |
| `canonical_url_fixes_59203435.plan.md` | `archive/completed/widget-search-rendering.md`, ADR-120 references |
| `sdk_fixes_and_batch_2_4806a584.plan.md` | `archive/completed/search-sdk-cli.plan.md`, `archive/completed/thread-search-sdk-integration.plan.md` |
| `batch_1_security_deps_7bf26033.plan.md` | `archive/completed/public-release-readiness.plan.md`, dependency updates in repo history |
| `pre-merge_broad_review_rerun_b96fd210.plan.md` | folded into reviewer closeout evidence in active recovery plan |

## Result

- `.cursor/plans/` is now a non-authoritative location and should remain empty.
- New and updated semantic-search planning authority lives exclusively in:
  - `.agent/prompts/semantic-search/semantic-search.prompt.md`
  - `.agent/plans/semantic-search/active/`
  - `.agent/plans/semantic-search/current/`
  - `.agent/plans/semantic-search/archive/completed/`
