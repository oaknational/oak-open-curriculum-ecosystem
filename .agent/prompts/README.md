# Prompts

Handover prompts are **stateful session entry points**. Use them when a task
needs carried-forward execution context, domain-specific sequencing, or a
plan-tied playbook. Use commands and skills for generic workflows; use prompts
when the session needs a focused operational brief.

## Active Prompt Index

| Prompt | Type | Purpose | Primary plan/reference |
|---|---|---|---|
| [GO.md](GO.md) | workflow | Complementary execution cadence for plan-driven work: structure TODOs, interleave review/grounding, and keep reviewer checkpoints frequent | Current plan collection `README.md` plus its `current/README.md` or `active/README.md` |
| [gt-review.md](gt-review.md) | handover | Ground-truth evaluation session prompt for exhaustive review against both MCP tools and bulk data | [ground-truth-review-checklist.md](../plans/semantic-search/archive/completed/ground-truth-review-checklist.md), [ground-truth-session-template.md](../plans/semantic-search/templates/ground-truth-session-template.md) |
| [semantic-search/semantic-search.prompt.md](semantic-search/semantic-search.prompt.md) | handover | Primary semantic-search session entry point — single active plan: prod search assessment after PR merge | [prod-search-assessment.execution.plan.md](../plans/semantic-search/active/prod-search-assessment.execution.plan.md) |
| [semantic-search/approaches-to-knowledge.prompt.md](semantic-search/approaches-to-knowledge.prompt.md) | handover | Research prompt exploring MCP, hybrid search, knowledge graphs, and atomic concepts as a unified quality system | Research-phase exploration; no single canonical execution plan |

## Retained Completed Prompts

These prompts are no longer the active entry point, but remain as durable
handover records for specific completed remediations.

| Prompt | Status | Purpose | Primary plan/reference |
|---|---|---|---|
| [codegen-error-response-adaptation.prompt.md](codegen-error-response-adaptation.prompt.md) | complete | Investigation and phased TDD execution brief for codegen error-response adaptation | [codegen-schema-error-response-adaptation.plan.md](../plans/semantic-search/current/codegen-schema-error-response-adaptation.plan.md) |
| [codegen-error-response-implementation.prompt.md](codegen-error-response-implementation.prompt.md) | complete | Implementation-session companion for the same codegen remediation, with explicit bug order and verification steps | [codegen-schema-error-response-adaptation.plan.md](../plans/semantic-search/current/codegen-schema-error-response-adaptation.plan.md) |
| [semantic-search/pr-67-snagging-triage.prompt.md](semantic-search/pr-67-snagging-triage.prompt.md) | completed | Item-by-item PR snagging and triage workflow for semantic-search PR `#67` | [short-term-pr-snagging.plan.md](../plans/semantic-search/archive/completed/short-term-pr-snagging.plan.md) |

## Archives

Historical prompts that are no longer active live in:

- [`archive/`](archive/)
- [`semantic-search/archive/`](semantic-search/archive/)
