---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-04-02
---

# Session Continuation

## Ground First

1. Read and internalise:
   - `.agent/directives/AGENT.md`
   - `.agent/directives/principles.md`
   - `.agent/directives/testing-strategy.md`
   - `.agent/directives/schema-first-execution.md`
2. Read `.agent/memory/distilled.md` and `.agent/memory/napkin.md`
3. Read the active plan for your workstream (see below)
4. Re-establish live branch state:

```bash
git status --short
git log --oneline --decorate -10
```

## This Prompt's Role

- Operational entry point only.
- Active plans are authoritative for scope, sequencing, acceptance criteria,
  and validation.
- If prompt text conflicts with active plans, active plans win.

## Active Workstreams (2026-04-02)

### 1. Frontend Practice Integration — AMENDMENTS APPLIED

**Plan**: `.agent/plans/agentic-engineering-enhancements/active/frontend-practice-integration-and-specialist-agents.plan.md`

**Status**: Decision-complete, amendments applied. oak-components is
reference-only for value extraction (no dependency). Phase 3 streamlined to
5 targeted reviewers. Provenance UUID proposal removed. Token delivery via
Vite bundling into MCP App HTML. Blocking gate: importable CSS with minimal
palette + semantic + light/dark themes, widget build bundles it.

**Next action**: Begin Phase 1 execution.

**Blocks**: WS3 Phases 4-5 (widget UI) — `@oaknational/oak-design-tokens`
must produce importable CSS and the widget build must bundle it.

### 2. Assumptions Reviewer — COMPLETE

**ADR**: `docs/architecture/architectural-decisions/146-assumptions-reviewer-meta-level-plan-assessment.md`

**Status**: Complete. ADR-146 accepted, triplet deployed (template + skill +
rule), platform adapters for Cursor, Claude Code, Codex, and Gemini CLI
created, invocation matrix updated. Invoke `assumptions-reviewer` when
plans are marked decision-complete, propose 3+ agents, or assert blocking
relationships.

### 3. WS3 Phase 3 Closure (mostly complete)

WS3 Phase 3 truth-repair is green. C8 auth closure is complete. The
broader Phase 3 plan carries one deferred item (non-UI host fallback
evidence). WS3 Phases 4-5 (widget UI) are blocked by the frontend
Practice integration plan (token infrastructure must exist first).

### 4. URL Naming Collision Remediation — COMPLETED

**Plan**: `.agent/plans/sdk-and-mcp-enhancements/archive/completed/url-naming-collision-remediation.plan.md`

Completed 2026-04-01. `canonicalUrl` → `oakUrl` rename, decorator fixes,
ADR updates, url-generation-cleanup, and snagging all executed.

## Core Invariant (WS3)

This workstream is a clean-break replacement:

- replace the out-of-date OpenAI-era app integration with a brand-new MCP App
- keep `search` as the model-facing, agent-facing search interface
- add `user-search` as a UI-first, user-first MCP App tool
- do not introduce custom tool-discovery, visibility, or presentation shims

## Durable Guidance

- Run `pnpm qg` as the canonical non-mutating readiness gate before each commit.
- Run `pnpm fix` to apply auto-fixes.
- Run `pnpm check` as the full scrub before push/merge.
- Keep this prompt concise and operational; do not duplicate plan authority.
