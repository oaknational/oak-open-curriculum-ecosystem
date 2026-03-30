---
name: "PR #73 CodeQL and Deferred Finding Remediation"
overview: >
  Triage and resolution plan for all known issues surfaced after PR #73
  was opened (feat/full-sentry-otel-support): 4 CodeQL findings plus 2
  carried specialist reviewer findings (F10, F18). Extends the specialist
  reviewer remediation plan with post-PR findings.
status: active
last_updated: 2026-03-30
parent_plan: ./sentry-otel-remediation.plan.md
execution_plan: ./sentry-otel-integration.execution.plan.md
---

# Remediation Plan: PR #73 CodeQL and Deferred Findings

## Context

PR #73 (`feat/full-sentry-otel-support`) received 4 automated CodeQL findings
from `github-advanced-security[bot]` after opening. This plan extends the
specialist reviewer remediation plan
([sentry-otel-remediation.plan.md](./sentry-otel-remediation.plan.md)) with
these post-PR findings plus the two carried deferred items (F10, F18). The
execution plan
([sentry-otel-integration.execution.plan.md](./sentry-otel-integration.execution.plan.md))
is the authoritative parent for the overall work; this plan and its sibling
remediation plan are subordinate to it.

No human reviewer comments. All quality gates pass (81/81).

## Issue Inventory

| ID | Source | File | Finding | Severity |
|----|--------|------|---------|----------|
| C1 | CodeQL | `agent-tools/src/core/codex-project-agent-registry.ts:7` | Inefficient regex (exponential backtracking) | Low |
| C2 | CodeQL | `scripts/validate-subagents-helpers.mjs:7` | Inefficient regex (same pattern) | Low |
| C3 | CodeQL | `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts:114` | Missing rate limiting (POST /mcp) | Medium |
| C4 | CodeQL | `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts:116` | Missing rate limiting (GET /mcp) | Medium |
| F10 | test-reviewer | `apps/oak-curriculum-mcp-streamable-http/src/check-mcp-client-auth.unit.test.ts` | `vi.mock()` usage — ADR-078 violation | Important |
| F18 | architecture-reviewer-fred | `packages/core/observability` + app | Span helper DRY opportunity | Low |

## Triage Decisions

### Fix on this branch (C1, C2)

The regex backtracking findings are cheap to fix, introduced by this branch,
and will clear the CodeQL annotations on the PR. Both files use the same
pattern: `/^([a-z_]+)\s*=\s*"((?:\\.|[^"])*)"$/u`. The `(?:\\.|[^"])*`
alternation can cause exponential backtracking with adversarial input. Fix by
restructuring with the standard unrolled-loop technique.

### Defer — out of scope (C3, C4, F10, F18)

- **C3/C4** (rate limiting): Pre-existing concern. The `/mcp` routes existed
  before this branch; this PR only added the `observability` parameter. Rate
  limiting is an infrastructure concern (edge/CDN layer or separate middleware).
  Track as a separate work item.
- **F10** (`vi.mock` in auth test): Auth DI refactor, not observability. Already
  explicitly excluded from the remediation plan. Track separately.
- **F18** (span helper DRY): Different concerns between core and app span
  helpers. Deferred per YAGNI. Track separately.

## Step 1: Fix C1 — Regex in `codex-project-agent-registry.ts`

**File**: `agent-tools/src/core/codex-project-agent-registry.ts:7`

**Current**:

```typescript
const TOML_BASIC_STRING_PATTERN = /^([a-z_]+)\s*=\s*"((?:\\.|[^"])*)"$/u;
```

**Problem**: The alternation `(?:\\.|[^"])` inside `*` can cause exponential
backtracking because after matching `\\.`, the engine can re-try matching the
same characters via `[^"]`.

**Fix**: Replace with the standard unrolled-loop technique that matches runs of
non-special characters in one step, then optionally an escape sequence,
repeating. This prevents the engine from re-partitioning the same characters:

```typescript
const TOML_BASIC_STRING_PATTERN = /^([a-z_]+)\s*=\s*"([^"\\]*(?:\\.[^"\\]*)*)"$/u;
```

The unrolled loop matches:

1. `[^"\\]*` — run of non-quote, non-backslash characters
2. `(?:\\.[^"\\]*)` — an escape sequence followed by another run
3. `*` — repeat as needed

**Verification**: Existing tests in
`agent-tools/src/core/codex-project-agent-registry.unit.test.ts` must still
pass. Run `pnpm --filter @oaknational/agent-tools test`.

## Step 2: Fix C2 — Regex in `validate-subagents-helpers.mjs`

**File**: `scripts/validate-subagents-helpers.mjs:7`

**Current**:

```javascript
const TOML_BASIC_STRING_REGEX = /^([a-z_]+)\s*=\s*"((?:\\.|[^"])*)"$/u;
```

**Fix**: Same unrolled-loop pattern:

```javascript
const TOML_BASIC_STRING_REGEX = /^([a-z_]+)\s*=\s*"([^"\\]*(?:\\.[^"\\]*)*)"$/u;
```

**Verification**: Run `pnpm test:root-scripts` (repo-level script tests that
cover the subagent validation helpers).

## Step 3: Run quality gates

After both fixes:

1. `pnpm --filter @oaknational/agent-tools test` — agent-tools unit tests
2. `pnpm test:root-scripts` — repo-level script tests
3. `pnpm type-check` — ensure no type regressions
4. `pnpm lint:fix` — ensure no lint regressions

If all pass, commit and push.

## Step 4: Commit and push

Commit message:

```text
fix: replace backtracking-prone TOML regex with unrolled-loop pattern

CodeQL flagged the `(?:\\.|[^"])*` alternation in the TOML basic-string
regex as potentially exponential. Replace with the standard unrolled-loop
technique `[^"\\]*(?:\\.[^"\\]*)*` which matches the same language without
backtracking.

Fixes code-scanning alerts #67 and #68.
```

Push to the branch so the PR annotations clear.

## Deferred Items (track separately)

| ID | Description | Suggested tracking |
|----|-------------|-------------------|
| C3/C4 | Rate limiting on `/mcp` routes | Infrastructure/security work item |
| F10 | `vi.mock()` in `check-mcp-client-auth.unit.test.ts` | Auth DI refactor |
| F18 | Span helper DRY between core and app | Post-merge improvement |

## Verification

- CodeQL regex alerts cleared on PR
- `pnpm --filter @oaknational/agent-tools test` passes
- `pnpm test:root-scripts` passes
- `pnpm type-check` passes
- `pnpm lint:fix` clean
