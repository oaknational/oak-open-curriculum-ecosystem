---
name: "CI Consolidation, Gate Parity, and eslint-disable Remediation"
overview: "Remediate all eslint-disable comments, add automated ESLint enforcement, delete dead widget tests, then consolidate CI into a single Turbo invocation with reporting."
todos:
  - id: phase-0-foundation
    content: "Phase 0: Verify foundation assumptions — catalogue eslint-disable instances, confirm widget deletion scope, verify Turbo graph."
    status: done
  - id: phase-1-eslint-enforcement
    content: "Phase 1: Add ESLint rule to detect and ban all eslint-disable comments."
    status: done
  - id: phase-2-widget-deletion
    content: "Phase 2: Delete dead widget Playwright tests and supporting infrastructure."
    status: done
  - id: phase-3-eslint-remediation
    content: "Phase 3: Remediate all existing eslint-disable comments across the repo (~101 instances)."
    status: pending
  - id: phase-4-reporter-script
    content: "Phase 4: Create CI reporter script (TDD) — parses Turbo --summarize JSON, emits GitHub Step Summary and annotations."
    status: pending
  - id: phase-5-ci-consolidation
    content: "Phase 5: Consolidate CI workflow — single Turbo invocation, add missing gates, wire reporter."
    status: pending
  - id: phase-6-documentation
    content: "Phase 6: Documentation and validation — update ADR-065, build-system.md, quality gate surface table, testing strategy."
    status: pending
---

# CI Consolidation, Gate Parity, and eslint-disable Remediation

**Last Updated**: 2026-03-29
**Status**: 🟢 IN PROGRESS — Phases 0-2 complete, Phase 3 (remediation) is next
**Scope**: Three interconnected problems solved together: (1) remediate 111 eslint-disable comments and add automated enforcement, (2) delete dead widget tests, (3) consolidate CI into a single Turbo invocation with full gate parity.

---

## Context

### Issue 1: eslint-disable Comments Are Banned but Unenforced

The repo has **111 `eslint-disable` directives** and **1 `@ts-expect-error`**. The rule in `principles.md` says "NEVER disable checks" but there is zero automated enforcement — ESLint does not report on its own disable comments by default.

This is not a documentation problem. It's a **tooling gap**. The `eslint-disable` ban is a rule enforced by honour system, and it has failed: 111 instances exist, some masking stale code (the `window.openai` widget references that persisted after OpenAI logic was removed).

**Evidence**: The Playwright widget tests use `eslint-disable` for `@typescript-eslint/no-explicit-any` to cast `window.openai`. When OpenAI-specific logic was removed from product code, these masked references survived undetected — the type checker was silenced at exactly the points where it would have flagged stale code.

**Root Cause**: No ESLint rule detects or reports `eslint-disable` comments. The pre-commit hook runs `pnpm lint`, but lint passes silently when checks are disabled inline.

### Issue 2: Dead Widget Tests

16 Playwright widget tests (`widget-rendering.spec.ts`, `widget-accessibility.spec.ts`) test a ChatGPT widget that is being utterly replaced as part of MCP App work. These tests:

- Are coupled to `window.openai.*` APIs being removed
- Contain banned `eslint-disable` comments
- Mostly assert the same empty "neutral shell" state (renderers are parked)
- Test no durable product behaviour

4 landing page tests (`landing-page.spec.ts`) are valuable and should be kept.

### Issue 3: CI Runs Fewer Gates and Uses 4 Separate Turbo Invocations

(Unchanged from original analysis — see earlier context in this conversation.)

---

## eslint-disable Inventory (111 instances)

### By category

| Category | Count | Correct fix |
|----------|-------|------------|
| `max-lines` on **generated** data files | ~10 | Refactor generators to produce split output files |
| `max-lines` on **generator** code | ~12 | Refactor generators into smaller modules |
| `max-lines-per-function` on generators | ~7 | Extract functions |
| `max-lines` / `max-lines-per-function` on authored code | ~8 | Refactor into smaller functions/modules |
| `@typescript-eslint/no-restricted-types` (logger) | ~12 | `WeakSet<object>` and error normalisation — needs investigation |
| `@typescript-eslint/consistent-type-assertions` (test fakes) | ~10 | Narrow fake interfaces, use DI |
| `@typescript-eslint/consistent-type-assertions` (type-helpers) | 7 | **User-approved exceptions** (type-helpers package) |
| `@typescript-eslint/no-explicit-any` (widget tests) | 5 | **Delete** (widget tests are dead) |
| `no-restricted-syntax` / `no-restricted-properties` | ~10 | Refactor to use typed alternatives |
| `complexity` / `max-statements` | ~8 | Extract smaller functions |
| Code generators **emitting** eslint-disable | ~13 | Refactor generator output + generators |
| `-- JC:` approved by user | varies | **Keep** — user-approved exceptions |

### User-approved exceptions (not to be remediated)

- `packages/core/type-helpers/src/index.ts` — 7 instances of `consistent-type-assertions`, already approved
- Any comment containing `-- JC:` — user-approved, only the user can make this choice

---

## Quality Gate Strategy

**Critical**: Run ALL quality gates across ALL workspaces after EACH sub-task.

### After Each Task

```bash
pnpm type-check
pnpm lint
pnpm test
```

### After Each Phase

```bash
pnpm build
pnpm type-check
pnpm lint
pnpm test
pnpm test:e2e
```

---

## Non-Goals (YAGNI)

- We are NOT creating eslint config overrides to move suppression from inline to config (that is still disabling checks)
- We are NOT preserving widget test infrastructure for the replacement (new tests will be TDD from scratch)
- We are NOT relocating fixture builders — the entire widget system (renderers, renderer integration tests, fixture builders, test harness) is being replaced
- We are NOT changing `type-helpers` — those are user-approved exceptions
- We are NOT remediating comments marked `-- JC:` — only the user can approve these

---

## Foundation Document Commitment

Before beginning work and at the start of each phase:

1. **Re-read** `.agent/directives/principles.md` — "NEVER disable checks"
2. **Re-read** `.agent/directives/testing-strategy.md` — tests must prove useful product behaviour
3. **Ask**: "Could it be simpler without compromising quality?"
4. **Verify**: No compatibility layers, no type shortcuts, no disabled checks

---

## Resolution Plan

### Phase 0: Verify Foundation Assumptions (15 min)

#### Task 0.1: Catalogue eslint-disable Instances

Confirm the 111-instance inventory. Identify which are user-approved (`-- JC:` suffix or type-helpers).

**Acceptance Criteria**:

1. Full inventory confirmed with file paths and line numbers
2. User-approved exceptions identified and excluded from remediation scope
3. Remediation count established

**Deterministic Validation**:

```bash
# Count all eslint-disable directives (excluding node_modules, dist, .turbo)
grep -r "eslint-disable" --include="*.ts" --include="*.mjs" --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.turbo . | grep -v "node_modules" | wc -l

# Count user-approved exceptions
grep -r "eslint-disable" --include="*.ts" . | grep -v node_modules | grep -i "jc:" | wc -l
```

#### Task 0.2: Confirm Widget Deletion Scope

List all files in the widget test and renderer system that will be deleted.

**Acceptance Criteria**:

1. Complete file list for widget Playwright tests + infrastructure
2. Confirmation that landing page tests are independent and will survive

#### Task 0.3: Verify Turbo Batched Task Count

Dry-run the consolidated CI command.

**Acceptance Criteria**:

1. `turbo run build type-check lint test test:e2e test:ui smoke:dev:stub --dry` succeeds
2. Task count documented

---

### Phase 1: Add ESLint Enforcement Rule (TDD) (30 min)

**Foundation Check-In**: Re-read principles.md — "NEVER disable checks."

**Key Principle**: The ban must be enforced by tooling, not honour system. ESLint is the correct tool for validating code patterns.

#### Task 1.1: Write Failing Test for eslint-disable Detection

Add a test that verifies ESLint reports an error for any `eslint-disable` comment.

**Approach**: Use the `@eslint-community/eslint-plugin-eslint-comments` plugin's `no-use` rule (bans all eslint-disable directives), or ESLint's built-in `noInlineConfig` option. Research which is the correct tool.

**Acceptance Criteria**:

1. ESLint configuration added that detects `eslint-disable` comments
2. Running `pnpm lint` on a file with `eslint-disable` produces an error
3. User-approved exceptions (`-- JC:` suffix, type-helpers) are handled via the appropriate mechanism

**Note**: This phase will intentionally cause lint to fail across the repo until Phase 3 remediates the existing instances. The enforcement rule should be added but the remediation happens in Phase 3. Consider adding the rule with `warn` severity initially, then promoting to `error` after remediation.

#### Task 1.2: Verify Detection Works

**Deterministic Validation**:

```bash
# Lint should now report eslint-disable usage
pnpm lint 2>&1 | grep -c "eslint-disable"
# Expected: > 0 (detects existing violations)
```

---

### Phase 2: Delete Dead Widget Tests (15 min)

**Foundation Check-In**: Re-read testing-strategy.md — "tests must prove something useful about product code."

**Key Principle**: Tests for dead code are liabilities, not assets.

#### Task 2.1: Delete Widget Playwright Tests and Infrastructure

Delete the following files:

- `apps/oak-curriculum-mcp-streamable-http/tests/widget/widget-rendering.spec.ts`
- `apps/oak-curriculum-mcp-streamable-http/tests/widget/widget-accessibility.spec.ts`
- `apps/oak-curriculum-mcp-streamable-http/tests/widget/widget-test-server.ts`
- `apps/oak-curriculum-mcp-streamable-http/tests/widget/fixtures.ts`
- `apps/oak-curriculum-mcp-streamable-http/tests/widget/fixture-builder.ts`
- `apps/oak-curriculum-mcp-streamable-http/tests/widget/fixture-builder-browse-explore.ts`
- `apps/oak-curriculum-mcp-streamable-http/tests/widget/renderer-test-harness.ts`

Update `playwright.config.ts`:

- Remove the `widget` project
- Fix the `eslint-disable-next-line no-restricted-syntax` — use the env lib for `process.env` access
- Consider renaming `landing-page.spec.ts` to follow the repo's `.e2e.test.ts` convention (needs investigation: does Playwright require `.spec.ts`?)

**Acceptance Criteria**:

1. `tests/widget/` directory is empty or deleted
2. `playwright.config.ts` has only the `visual` project
3. No `eslint-disable` in `playwright.config.ts`
4. `pnpm test:ui` runs only the 4 landing page tests
5. Quality gates pass

**Deterministic Validation**:

```bash
# Widget tests gone
ls apps/oak-curriculum-mcp-streamable-http/tests/widget/ 2>/dev/null
# Expected: directory not found or empty

# Only 4 tests remain
pnpm test:ui 2>&1 | grep -E "passed|failed"
# Expected: 4 passed

# No eslint-disable in playwright config
grep "eslint-disable" apps/oak-curriculum-mcp-streamable-http/playwright.config.ts
# Expected: no matches

pnpm type-check && pnpm lint && pnpm test
```

---

### Phase 3: Remediate Existing eslint-disable Comments (large — break into sub-tasks)

**Foundation Check-In**: Re-read principles.md — "NEVER disable checks. Fix the root cause."

**Key Principle**: Every `eslint-disable` is a root cause that needs fixing, not moving. The code must change, not the check.

This phase is the largest. Break into sub-tasks by workspace/package. Each sub-task: remove the `eslint-disable`, fix the underlying code, run quality gates.

#### Sub-task categories (to be expanded during execution):

1. **Generated data files (`max-lines`)** — refactor generators to produce split output
2. **Generator code (`max-lines`, `max-lines-per-function`, `complexity`)** — refactor into smaller modules/functions
3. **Logger (`no-restricted-types`)** — investigate `WeakSet<object>` pattern; find typed alternative
4. **Test fakes (`consistent-type-assertions`)** — narrow fake interfaces, improve DI
5. **Authored code (`max-lines-per-function`, `complexity`)** — extract functions
6. **`no-restricted-properties` / `no-restricted-syntax`** — use typed alternatives (`typeSafeKeys` etc.)
7. **Code generators emitting eslint-disable** — fix generator templates to not emit suppression

**Acceptance Criteria**:

1. Zero `eslint-disable` comments remain (excluding user-approved `-- JC:` and type-helpers)
2. Zero `@ts-expect-error` or `@ts-ignore` comments remain
3. All quality gates pass
4. ESLint enforcement rule promoted from `warn` to `error`

**Deterministic Validation**:

```bash
# Count remaining eslint-disable (excluding approved)
grep -r "eslint-disable" --include="*.ts" --include="*.mjs" --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.turbo . | grep -v node_modules | grep -v "jc:" | grep -v "type-helpers/src/index.ts" | wc -l
# Expected: 0

pnpm build && pnpm type-check && pnpm lint && pnpm test
```

---

### Phase 4: Create CI Reporter Script (TDD) (45 min)

(Unchanged from original plan — create `scripts/ci-turbo-report.mjs` using TDD.)

---

### Phase 5: Consolidate CI Workflow (30 min)

Update `.github/workflows/ci.yml`:

1. Non-Turbo checks as separate steps (secrets, format-check, markdownlint-check, subagents:check, portability:check, test:root-scripts)
2. Playwright browser installation: `npx playwright install --with-deps chromium`
3. Single Turbo invocation: `turbo run build type-check lint test test:e2e test:ui smoke:dev:stub --summarize --log-order=grouped --continue`
4. Reporter step with `if: always()`

---

### Phase 6: Documentation and Validation (20 min)

1. Update `docs/engineering/build-system.md` quality gate surface table
2. Update ADR-065 with CI consolidation rationale
3. Update `.agent/directives/testing-strategy.md`:
   - Add guidance on Playwright naming convention
   - Add guidance on when to delete tests (dead code, replaced systems)
   - Strengthen "tests must prove useful product behaviour" with deletion criteria
4. Update `.agent/directives/principles.md` or create ADR:
   - Document ESLint enforcement mechanism for the eslint-disable ban
   - Document `-- JC:` convention (user-approved exceptions, agents MUST NOT use)
5. Update test-reviewer template:
   - Add eslint-disable detection to review checklist
   - Add product-value assessment ("is the code being tested still alive?")
   - Add file naming convention check
6. Foundation compliance checklist

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Phase 3 scope is very large (111 instances) | Certain | High time investment | Break into sub-tasks by workspace; use parallel agents for independent packages |
| Generator refactoring is complex | Medium | Could take significant time | Start with the simplest cases; some generators may need architectural review |
| Logger `WeakSet<object>` may have no typed alternative | Low | Blocks remediation | Investigate first; escalate to user if no clean solution exists |
| Playwright `test:ui` may fail in CI without browser install | Certain | Blocks CI | `npx playwright install --with-deps chromium` is the proven solution |

---

## Success Criteria

### Overall

- Zero `eslint-disable` comments (excluding user-approved)
- ESLint automatically detects and reports any new `eslint-disable` comments
- Dead widget tests deleted
- CI consolidated to single Turbo invocation with full gate parity
- `$GITHUB_STEP_SUMMARY` reporting for per-task visibility
- Documentation updated across all affected surfaces

---

## References

- `.github/workflows/ci.yml` — current CI workflow
- `turbo.json` — Turbo task configuration
- `docs/engineering/build-system.md` — build system documentation
- `docs/architecture/architectural-decisions/065-turbo-task-dependencies.md` — Turbo dependency rationale
- `.agent/directives/principles.md` — "NEVER disable checks"
- `.agent/directives/testing-strategy.md` — test value criteria
- `.agent/sub-agents/templates/test-reviewer.md` — test reviewer specification

---

## Known Issues from Code Review (2026-03-29)

Items identified by code-reviewer that need addressing:

### Phase 3 scope additions

- Add `@ts-nocheck` to the `TS_DIRECTIVE_PATTERN` in `no-eslint-disable.ts` (currently only catches `@ts-ignore` and `@ts-expect-error`)
- Add test case: `@ts-ignore` with user-approval marker should still be `invalid` (TypeScript suppressions have no exceptions)
- Remove the `defaultOptions: []` from the rule (YAGNI)
- Prefer named import over default export in test file

### Phase 3 remediation includes

- `eslint.config.ts` type assertion override for `auth-error-test-helpers.ts` and `verify-clerk-token.unit.test.ts` — investigate type-safe alternatives (escalate to type-reviewer)

### Test coverage

- `scripts/check-blocked-content.mjs` needs unit tests (follow `check-blocked-patterns.unit.test.ts` pattern) — TDD is mandatory
- Renderer files (`browse-renderer.ts`, `search-renderer.ts`, `explore-renderer.ts`) lost all test coverage when widget tests were deleted — new tests will be written when the replacement widget ships

### Documentation

- Add TSDoc comment on the inline `@oaknational` plugin registration in `recommended.ts` noting that consumers should NOT separately register the plugin

## Future Enhancements (Out of Scope)

All quality gate enhancements consolidated in: `.agent/plans/architecture-and-infrastructure/future/quality-gate-hardening.plan.md`

- Promote `no-eslint-disable` from warn to error
- Enable knip, dependency-cruiser, max-files-per-dir as blocking QGs
- Remove `consistent-type-assertions` warn exception in test rules
- Enable Stryker mutation testing across all workspaces
- Allow forbidden-comment patterns in test files testing their detection
- Subject oak-eslint workspace to its own rules
- New Playwright widget tests for the replacement widget (TDD when replacement ships)
- Add Firefox/WebKit Playwright projects if cross-browser testing becomes a requirement
