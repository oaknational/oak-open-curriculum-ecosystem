---
prompt_id: session-continuation
title: "ESLint OOM Fix → Merge"
type: handover
status: active
last_updated: 2026-03-02
---

# ESLint OOM Fix → Merge

Session entry point. Two small tasks to unblock CI, then gates and merge.

## Plan

[release-plan-m1.plan.md](../plans/release-plan-m1.plan.md) — §ESLint OOM Fix

## Primary task: ESLint OOM fix (2 tasks)

CI is blocked by ESLint OOM in `sdk-codegen` — ~688K lines of generated
graph data (including duplicated copies) are being parsed.

**Task 1**: Remove `NODE_OPTIONS=--max-old-space-size=4096` from
`packages/sdks/oak-sdk-codegen/package.json` lint scripts (lines 78-79).

**Task 2**: Add the large generated data files at their current locations
to ESLint `ignores` in `packages/sdks/oak-sdk-codegen/eslint.config.ts`.
These are serialised data structures (5K-122K lines each), not code. All
other generated code (types, Zod schemas, barrels) remains fully linted.

See the release plan for the full file list and validation commands.

## After the fix

1. Secrets sweep (`pnpm secrets:scan:all`)
2. Manual sensitive-information review (human)
3. Merge `feat/semantic_search_deployment` → `main`

## Deferred architectural work

The broader codegen architecture issues (generator duplication, naming,
two-source separation of concerns, workspace decomposition) are captured
in a separate strategic plan:
[codegen architecture plans](../plans/architecture-and-infrastructure/codegen/).

## Non-blocking follow-ups

See [post-merge-tidy-up.plan.md](../plans/sdk-and-mcp-enhancements/future/post-merge-tidy-up.plan.md).

## Session provenance

- [WS1 implementation](439ca3cf-a4e8-4dcd-b9b9-140e853a1d34)
- [Plan review and hardening](eee143e8-dfde-41f7-b3e7-246013bd7418)
- [400 investigation and resource pattern](7a65b4b1-1b59-46df-9aee-430c4030c019)
- [Upstream error handling fix](7e822a76-e479-4943-90f1-ddb496e63e57)
- [MCP prompts rationalisation](c227c7a7-7c6d-48ee-8eab-0e5e766fc78e)
- [Onboarding fixes and cast elimination](bcd25bbf-0255-42f0-81d8-c7d00320ad99)
- [MCP validation and graphs redesign](fa8f4abf-9c53-4823-9d01-8b61b0cb2e38)
- [Architecture analysis and plan creation](5f65d714-5b8c-4319-aee1-a493352d8127)
