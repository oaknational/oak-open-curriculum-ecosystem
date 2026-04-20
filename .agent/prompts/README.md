# Prompts

Handover prompts are **stateful session entry points**. Use them when a task
needs carried-forward execution context, domain-specific sequencing, or a
plan-tied playbook. Use commands and skills for generic workflows; use prompts
when the session needs a focused operational brief.

**General session orientation** is no longer prompt-hosted. What was
`session-continuation.prompt.md` has been dissolved (2026-04-20): its
doctrine moved to
[PDR-026 (Per-Session Landing Commitment)](../practice-core/decision-records/PDR-026-per-session-landing-commitment.md)
and
[`orientation.md`](../directives/orientation.md) (layering contract);
its ritual moved to
[`start-right-quick`](../skills/start-right-quick/shared/start-right.md)
(session open) and
[`session-handoff`](../commands/session-handoff.md) (session close).
Live state lives in
[`.agent/memory/operational/`](../memory/operational/). Remaining
prompts below are domain-specific handover briefs for focused work.

## Active Prompt Index

| Prompt | Type | Purpose | Primary plan/reference |
|---|---|---|---|
| [agentic-engineering/governance-planes-research-and-reporting.prompt.md](agentic-engineering/governance-planes-research-and-reporting.prompt.md) | handover | Session-entry prompt for turning the governance-planes seed note into deeper research, sharper local analysis, and promoted reporting | [governance-planes-and-supervision/README.md](../research/agentic-engineering/governance-planes-and-supervision/README.md), [governance-concepts-and-agentic-mechanism-integration.plan.md](../plans/agentic-engineering-enhancements/current/governance-concepts-and-agentic-mechanism-integration.plan.md), [governance-concepts-and-integration-report.md](../reports/agentic-engineering/deep-dive-syntheses/governance-concepts-and-integration-report.md) |
| [gt-review.md](gt-review.md) | handover | Ground-truth evaluation session prompt for exhaustive review against both MCP tools and bulk data | [ground-truth-review-checklist.md](../plans/semantic-search/archive/completed/ground-truth-review-checklist.md), [ground-truth-session-template.md](../plans/semantic-search/templates/ground-truth-session-template.md) |
| [semantic-search/semantic-search.prompt.md](semantic-search/semantic-search.prompt.md) | handover | Primary semantic-search session entry point — dormant, all plans archived | [active/README.md](../plans/semantic-search/active/README.md) |
| [semantic-search/approaches-to-knowledge.prompt.md](semantic-search/approaches-to-knowledge.prompt.md) | handover | Research prompt exploring MCP, hybrid search, knowledge graphs, and atomic concepts as a unified quality system | Research-phase exploration; no single canonical execution plan |
| [architecture-and-infrastructure/sentry-otel-foundation.prompt.md](architecture-and-infrastructure/sentry-otel-foundation.prompt.md) | handover | Sentry + OTel observability foundation session entry point | [sentry-otel-integration.execution.plan.md](../plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md) |

Complementary execution cadence: use
[`/jc-go`](../../.cursor/commands/jc-go.md), which reads
[`.agent/commands/go.md`](../commands/go.md) and the shared
[GO workflow](../skills/go/shared/go.md).

## Retained Completed Prompts

These prompts are no longer the active entry point, but remain as durable
handover records for specific completed remediations.

| Prompt | Status | Purpose | Primary plan/reference |
|---|---|---|---|
| [codegen-error-response-adaptation.prompt.md](codegen-error-response-adaptation.prompt.md) | complete | Investigation and phased TDD execution brief for codegen error-response adaptation | [codegen-schema-error-response-adaptation.plan.md](../plans/semantic-search/archive/completed/codegen-schema-error-response-adaptation.plan.md) |
| [codegen-error-response-implementation.prompt.md](codegen-error-response-implementation.prompt.md) | complete | Implementation-session companion for the same codegen remediation, with explicit bug order and verification steps | [codegen-schema-error-response-adaptation.plan.md](../plans/semantic-search/archive/completed/codegen-schema-error-response-adaptation.plan.md) |
| [semantic-search/pr-67-snagging-triage.prompt.md](semantic-search/pr-67-snagging-triage.prompt.md) | completed | Item-by-item PR snagging and triage workflow for semantic-search PR `#67` | [short-term-pr-snagging.plan.md](../plans/semantic-search/archive/completed/short-term-pr-snagging.plan.md) |

## Archives

Historical prompts that are no longer active live in:

- [`archive/`](archive/)
- [`semantic-search/archive/`](semantic-search/archive/)
