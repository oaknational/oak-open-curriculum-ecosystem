# Prompts

Handover prompts are **stateful session entry points**. Use them when a task
needs carried-forward execution context, domain-specific sequencing, or a
plan-tied playbook. Use commands and skills for generic workflows; use prompts
when the session needs a focused operational brief.

## Active Prompt Index

| Prompt | Type | Purpose | Primary plan/reference |
|---|---|---|---|
| [session-continuation.prompt.md](session-continuation.prompt.md) | workflow | MCP Apps migration session entry point — grounding, contamination inventory, and fresh React MCP App execution path | [roadmap.md](../plans/sdk-and-mcp-enhancements/roadmap.md), [mcp-app-extension-migration.plan.md](../plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md), [ws3-widget-clean-break-rebuild.plan.md](../plans/sdk-and-mcp-enhancements/active/ws3-widget-clean-break-rebuild.plan.md), [current/README.md](../plans/sdk-and-mcp-enhancements/current/README.md) |
| [GO.md](GO.md) | workflow | Complementary execution cadence for plan-driven work: structure TODOs, interleave review/grounding, and keep reviewer checkpoints frequent | Current plan collection `README.md` plus its `current/README.md` or `active/README.md` |
| [gt-review.md](gt-review.md) | handover | Ground-truth evaluation session prompt for exhaustive review against both MCP tools and bulk data | [ground-truth-review-checklist.md](../plans/semantic-search/archive/completed/ground-truth-review-checklist.md), [ground-truth-session-template.md](../plans/semantic-search/templates/ground-truth-session-template.md) |
| [semantic-search/semantic-search.prompt.md](semantic-search/semantic-search.prompt.md) | handover | Primary semantic-search session entry point — dormant, all plans archived | [active/README.md](../plans/semantic-search/active/README.md) |
| [semantic-search/approaches-to-knowledge.prompt.md](semantic-search/approaches-to-knowledge.prompt.md) | handover | Research prompt exploring MCP, hybrid search, knowledge graphs, and atomic concepts as a unified quality system | Research-phase exploration; no single canonical execution plan |
| [architecture-and-infrastructure/sentry-otel-foundation.prompt.md](architecture-and-infrastructure/sentry-otel-foundation.prompt.md) | handover | Sentry + OTel observability foundation session entry point | [sentry-otel-integration.execution.plan.md](../plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md) |

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
