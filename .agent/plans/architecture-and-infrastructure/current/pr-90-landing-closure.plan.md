---
name: "PR #90 Landing Closure"
overview: "Land PR #90 (fix/build_issues) — TS-invocation pattern consistency sweep and Sonar mechanical sweep, with owner-gated MCP manual validation as the merge precondition."
todos:
  - id: phase-0-audit
    content: "Phase 0: Audit all repo-wide TS-script invocation drift sites and confirm scope."
    status: completed
  - id: phase-1-ts-invocation
    content: "Phase 1: Convert ci.yml + docs/build-system.md + research example to canonical pnpm exec tsx pattern in one commit."
    status: completed
  - id: phase-2-sonar
    content: "Phase 2: Mechanical Sonar sweep — 12 OPEN/CONFIRMED issues across 4 scripts/validate-* files."
    status: completed
  - id: phase-3-verify
    content: "Phase 3: Verify CI test job + Sonar gate green; surface MCP manual validation as owner precondition."
    status: completed
  - id: phase-4-ts-invocation-gate
    content: "Phase 4: Implement local-detection gate for stale `node scripts/X.{mjs,ts,js}` invocations (TDD: helper + 10 unit + 1 integration test)."
    status: completed
  - id: phase-5-md024
    content: "Phase 5: Re-enable markdownlint MD024 with siblings_only:true and fix the 3 sibling-level duplicate-heading violations it surfaces."
    status: completed
---

# PR #90 Landing Closure

**Last Updated**: 2026-04-29
**Status**: 🟡 AGENT-WORK COMPLETE — AWAITING OWNER MCP MANUAL VALIDATION
**Scope**: Close out PR #90 quality-gate failures and merge preconditions without expanding architectural scope.

**Outcome**: All required CI gates green on PR #90:
test ✅, SonarCloud Code Analysis ✅ (0 OPEN/CONFIRMED, 50 FIXED),
CodeQL ✅, Cursor Bugbot ✅, Vercel ✅. Five commits landed:
`b8540657` (TS-invocation alignment, 5 surfaces), `78718b3b` (Sonar mechanical
sweep, 12 issues), `532b0871` (Cursor Bugbot napkin duplicate-heading fix +
MD024-disabled discovery), `bdcf21ae` (Phase 4 — local-detection gate for
`node scripts/X.{mjs,ts,js}` patterns: pure helper + 10 unit + 1 integration
test, +11 tests under `pnpm test:root-scripts`), and the Phase 5 commit
(MD024 enabled with `siblings_only: true`; 3 sibling-level duplicates
surfaced and fixed). Phase 0 audit caught 2 sibling drift sites the prior
session handoff had not named (research/claude-code-hook-activation.md and
apps/.../deployment-architecture.md). The owner-introduced external-detection
principle drove Phases 4 and 5 — both gaps caught externally on this PR are
now closed by local quality gates. Closure comment with local-detection
register posted at PR comment `4346625386`; follow-up with sharper MD024
finding at PR comment `4346657905`. Outstanding precondition: owner manual
MCP server validation, then squash-merge.

---

## Context

PR #90 (`fix/build_issues` → `main`) is the multi-session product of the TS6 migration, the workspace-script-ban architectural rule (ADR-168), the runtime-only-scripts directory exception, and the Vercel release-pipeline unblock. The product changes are landed, verified locally, and Vercel preview is green. Two merge-blocking gates remain failing on the PR.

### Issue 1: CI `test` job fails on `.mjs` references that no longer exist

`.github/workflows/ci.yml:90,94` invokes `node scripts/ci-turbo-report.mjs` and `node scripts/ci-schema-drift-check.mjs`. The TS6 migration in this PR renamed both scripts to `.ts`. Both CI steps now fail with `MODULE_NOT_FOUND`.

**Evidence**: GitHub Actions run 25107898664 (job 73573760747) shows two `Cannot find module` errors at the affected lines on Node 24.14.1.

**Root cause**: The TS6 migration converted scripts to `.ts` and standardised on `pnpm exec tsx scripts/<script>.ts` as the invocation pattern for source-executed TypeScript. The CI workflow file was not updated in lockstep. The same drift is visible in `docs/engineering/build-system.md:27` (Copilot inline review comment) and in `.agent/research/developer-experience/examples/validate-practice-fitness.example.ts:13` (Copilot inline review comment) — three call-sites of one architectural drift, not three independent paper cuts.

**Existing capabilities**: The repo already standardises on `pnpm exec tsx <entrypoint>` for source-executed TS. The convention is documented (imperfectly) in `docs/engineering/build-system.md` and in `.claude/settings.json` hook commands. The fix is alignment, not invention.

### Issue 2: Sonar quality gate fails with 12 OPEN/CONFIRMED issues

All 12 issues are in 4 files under `scripts/`:

- `scripts/validate-fitness-vocabulary.unit.test.ts` (1 issue)
- `scripts/validate-practice-fitness.ts` (8 issues)
- `scripts/validate-subagents-helpers.ts` (1 issue)
- `scripts/validate-portability-helpers.ts` (1 issue)

**Evidence** (from `sonar list issues -p oaknational_oak-open-curriculum-ecosystem --pull-request 90`):

| File | Line | Severity | Rule | Message |
|---|---|---|---|---|
| `scripts/validate-fitness-vocabulary.unit.test.ts` | 128 | CRITICAL | `typescript:S2871` | Provide a compare function that depends on `String.localeCompare` |
| `scripts/validate-subagents-helpers.ts` | 94 | CRITICAL | `typescript:S2871` | Provide a compare function to avoid sorting elements alphabetically |
| `scripts/validate-portability-helpers.ts` | 60 | MINOR | `typescript:S7780` | `String.raw` should be used to avoid escaping `\` |
| `scripts/validate-practice-fitness.ts` | 171 | MINOR | `typescript:S7781` | Prefer `String#replaceAll()` over `String#replace()` |
| `scripts/validate-practice-fitness.ts` | 171 | MINOR | `typescript:S7780` | `String.raw` should be used to avoid escaping `\` |
| `scripts/validate-practice-fitness.ts` | 172 | MINOR | `typescript:S7780` | `String.raw` should be used to avoid escaping `\` |
| `scripts/validate-practice-fitness.ts` | 215 | MAJOR | `typescript:S6557` | Use `String#startsWith` method instead |
| `scripts/validate-practice-fitness.ts` | 520 | MINOR | `typescript:S7735` | Unexpected negated condition |
| `scripts/validate-practice-fitness.ts` | 521 | MINOR | `typescript:S7735` | Unexpected negated condition |
| `scripts/validate-practice-fitness.ts` | 531 | MINOR | `typescript:S7778` | Do not call `Array#push()` multiple times |
| `scripts/validate-practice-fitness.ts` | 533 | MINOR | `typescript:S7735` | Unexpected negated condition |
| `scripts/validate-practice-fitness.ts` | 541 | MINOR | `typescript:S7735` | Unexpected negated condition |

**Root cause**: Mechanical lint signals from the TS6/sonarjs activation. Each fix is local and behaviour-preserving, except per-rule verification that the existing tests still pass.

**Existing capabilities**: All four files have unit-test coverage. The fixes are mechanical refactors verified against existing tests.

### Issue 3: Owner-gated MCP manual validation

The handoff explicitly identifies "owner manual MCP server validation" as a merge precondition. This is owner-only — the agent cannot validate it. The plan must surface it as a precondition without attempting to gate on it.

---

## Quality Gate Strategy

**Critical**: Run quality gates one at a time after each phase per `.agent/directives/AGENT.md`.

### After Each Phase

```bash
pnpm type-check
pnpm lint:fix
pnpm test
pnpm format:root
```

### Final Verification (before requesting MCP manual validation)

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint
pnpm test
pnpm test:e2e
pnpm test:root-scripts
pnpm practice:fitness:informational
```

CI verification is observed via `gh pr checks 90`; Sonar gate is observed via `sonar list issues -p oaknational_oak-open-curriculum-ecosystem --pull-request 90 --format json` filtered to `OPEN/CONFIRMED`.

---

## Solution Architecture

### Principle (from `principles.md`)

> "Architectural Excellence Over Expediency" — fix the boundary, not duplicate across it.
> "Consistent Naming" — one concept = one name. The TS-invocation pattern is one concept (`pnpm exec tsx <entrypoint>`); CI, docs, and examples must use the same name.
> "Fail FAST" — the local-vs-CI gap (CI invokes scripts that local `pnpm test` doesn't) is itself a fail-fast smell to surface.

### Key Insight

The handoff framed three independent paper cuts (ci.yml, two Copilot comments, 12 Sonar issues). The truer structure is **two coherent workstreams** + **one owner gate**:

1. **TS-invocation pattern consistency** — one architectural sweep that converts every `node scripts/*.mjs` callsite to `pnpm exec tsx scripts/*.ts`. CI, docs, examples are siblings of one drift.
2. **Sonar mechanical sweep** — one parallel commit fixing 12 lint signals that share no architectural depth.
3. **Owner MCP manual validation** — surfaces as a precondition; not an agent task.

This re-framing produces fewer commits with cleaner architectural signal and prevents the "fix the named instances and miss siblings" failure mode.

This exemplifies the first question from `principles.md`: **"Could it be simpler?"** — Answer: **YES**. The two-workstream framing is simpler than the three-paper-cut framing without compromising quality.

### Strategy

- One commit per workstream (Phase 1 → CI/docs alignment; Phase 2 → Sonar sweep).
- No new architectural rules in this PR (ADR-168 already landed; capture future refinements as napkin observations at session close, not as new ADRs in this PR).
- The Cursor Bugbot finding on `.agent/memory/active/napkin.md:174` is in another agent's claim territory (Squally Diving Anchor's continuity scope) and is left for them; routing already noted in comms event 853b358d.

**Non-Goals** (YAGNI):

- ❌ Add new architectural rules (vitest-config-base coupling, etc.) — these belong to a separate plan.
- ❌ Touch napkin.md or repo-continuity.md — Squally Diving Anchor's territory.
- ❌ Address all 50 Sonar issues — only the 12 OPEN/CONFIRMED affect the gate; the other 38 are already CLOSED.
- ❌ Refactor the validate-* scripts beyond what Sonar flags — out of scope for this PR.
- ✅ Keep PR #90 scope to: existing landed work + minimal closure for merge gates.

---

## Reviewer Scheduling (phase-aligned)

- **Pre-execution**: skipped — work is mechanical fixes against established patterns; no design-class question to challenge.
- **During Phase 1**: `code-reviewer` gateway after the TS-invocation commit.
- **During Phase 2**: `test-reviewer` if any test-file Sonar fix changes test behaviour; otherwise `code-reviewer` only.
- **Post**: `release-readiness-reviewer` once all gates green and MCP manual validation is owner-confirmed.

---

## Foundation Document Commitment

Re-read at start of each phase:

1. `.agent/directives/principles.md` — "Architectural Excellence Over Expediency"; "Consistent Naming"; "WE DON'T HEDGE"
2. `.agent/directives/testing-strategy.md` — Sonar fixes that touch test files must preserve behaviour-proving intent
3. `.agent/directives/schema-first-execution.md` — N/A for this plan (no SDK code touched)

---

## Lifecycle Trigger Commitment

Active claim 21943b5a-555f-429e-85af-20709ef9afea is open and covers `scripts/**`, `apps/**`, `packages/**`, `.github/workflows/**`, and the plan documents under `.agent/plans/architecture-and-infrastructure/current|active/`. Squally Diving Anchor's continuity claim (3b70b732) was disjoint at session open and has since closed. Comms event 853b358d-bb36-4774-9ce0-3bb9be612588 records the coordination handshake.

---

## Documentation Propagation Commitment

The TS-invocation pattern is mid-documentation. Phase 1 corrects the misleading sentence in `docs/engineering/build-system.md:27` and the misleading example in `.agent/research/developer-experience/examples/validate-practice-fitness.example.ts:11–13`. No ADR update required — ADR-168 already covers the architectural rule; this is doc-alignment, not new doctrine.

---

## Resolution Plan

### Phase 0: Audit TS-Script Invocation Drift Sites

**Foundation Check-In**: Re-read `principles.md §Consistent Naming` and `§Architectural Excellence Over Expediency`.

**Key Principle**: Find every drift site once; fix once. The handoff named three; the audit confirms scope before fixing.

#### Task 0.1: Repo-Wide Drift Audit

**Current Assumption**: `.github/workflows/ci.yml` (2 sites) + `docs/engineering/build-system.md:27` + `.agent/research/.../validate-practice-fitness.example.ts:13` are the drift sites in live (non-archived) surfaces.

**Validation Required**: Confirm no additional live drift exists outside archived plans.

**Acceptance Criteria**:

1. ✅ Grep across `.github/`, `docs/`, `.agent/research/`, `.agent/plans/*/current|active/`, `.claude/`, `scripts/`, `apps/`, `packages/`, plus root-level config produces no `node scripts/.*\.mjs` matches outside `archive/` directories beyond the three already-named sites.
2. ✅ Any newly-found drift site is added to Phase 1 scope before any commit lands.
3. ✅ If zero new drift found, proceed to Phase 1 with the three named sites.

**Deterministic Validation**:

```bash
# 1. Repo-wide audit (excludes archives, node_modules, build artefacts, collaboration state)
grep -rn "node scripts/.*\.mjs" \
  --include="*.yml" --include="*.yaml" --include="*.md" \
  --include="*.json" --include="*.toml" --include="*.sh" --include="*.ts" \
  | grep -v "node_modules\|\.next\|dist\|\.git/\|active-claims\|closed-claims\|shared-comms-log\|comms/events\|/archive/"
# Expected: only the three already-named sites (or any new site is incorporated into Phase 1).

# 2. Cross-check that target .ts scripts exist for each drift site
ls scripts/ci-turbo-report.ts scripts/ci-schema-drift-check.ts
# Expected: both files exist
```

**Task Complete When**: Audit grep produces only the three known drift sites OR any additional sites are added to Phase 1 scope.

---

### Phase 1: TS-Invocation Pattern Consistency Sweep

**Foundation Check-In**: Re-read `principles.md §Code Design and Architectural Principles → Consistent Naming` and `§Documentation`.

**Key Principle**: One concept = one name. The TS-script invocation pattern is `pnpm exec tsx scripts/<script>.ts`. Apply this name everywhere, in one commit.

#### Task 1.1: Fix `.github/workflows/ci.yml` script invocations

**Current Implementation** (lines 90, 94):

```yaml
- name: Report Turbo summary
  if: always()
  run: node scripts/ci-turbo-report.mjs >> "$GITHUB_STEP_SUMMARY"

- name: Check schema cache drift (advisory)
  if: always()
  run: node scripts/ci-schema-drift-check.mjs
```

**Target Implementation**:

```yaml
- name: Report Turbo summary
  if: always()
  run: pnpm exec tsx scripts/ci-turbo-report.ts >> "$GITHUB_STEP_SUMMARY"

- name: Check schema cache drift (advisory)
  if: always()
  run: pnpm exec tsx scripts/ci-schema-drift-check.ts
```

**Acceptance Criteria**:

1. ✅ Both lines invoke `pnpm exec tsx scripts/<script>.ts`
2. ✅ No `.mjs` reference remains in `.github/workflows/ci.yml`
3. ✅ `gh workflow view ci.yml` (or repo-local YAML lint via `pnpm lint`) does not error.

**Deterministic Validation**:

```bash
grep -n "\.mjs" .github/workflows/ci.yml
# Expected: no matches (exit 1)

grep -n "pnpm exec tsx scripts/" .github/workflows/ci.yml
# Expected: 2 matches (lines 90, 94)
```

#### Task 1.2: Fix `docs/engineering/build-system.md:27` misleading sentence

**Current Implementation** (line 27):

> `node scripts/<script>.ts via pnpm exec tsx <entrypoint>` (or the package-relative
> equivalent) so Node enables the workspace `development` export condition while
> loading `tsx`.

**Target Implementation** (rewrite the sentence to be a real instruction):

> Invoke source-executed TS scripts via `pnpm exec tsx scripts/<script>.ts` (or
> the package-relative equivalent). Running through `pnpm exec` enables the
> workspace `development` export condition while loading `tsx`, so packages
> participating in source execution must publish matching `development` export
> entries for their supported subpaths.

**Acceptance Criteria**:

1. ✅ Sentence reads as a real instruction with a runnable command form.
2. ✅ No `node scripts/` invocation pattern in the doc.
3. ✅ `pnpm markdownlint:root` passes for the file.

**Deterministic Validation**:

```bash
grep -n "node scripts/" docs/engineering/build-system.md
# Expected: no matches (exit 1)

grep -n "pnpm exec tsx scripts/" docs/engineering/build-system.md
# Expected: at least one match
```

#### Task 1.3: Fix `.agent/research/developer-experience/examples/validate-practice-fitness.example.ts:13` misleading "or adapt to plain Node" line

**Current Implementation** (lines 10–13 of the TSDoc header):

```text
Copy into `scripts/` and run from the repo root:
  tsx scripts/validate-practice-fitness.ts
Or adapt to plain Node:
  node scripts/validate-practice-fitness.ts
```

**Target Implementation** (remove the misleading "Or adapt to plain Node" alternative entirely; replace with the canonical pnpm-exec form):

```text
Copy into `scripts/` and run from the repo root:
  pnpm exec tsx scripts/validate-practice-fitness.ts
```

**Acceptance Criteria**:

1. ✅ The "Or adapt to plain Node" alternative is removed (it cannot run without a loader).
2. ✅ The remaining example is the canonical `pnpm exec tsx <path>` form.
3. ✅ `pnpm format:root` passes for the file.

**Deterministic Validation**:

```bash
grep -n "node scripts/validate-practice-fitness.ts" .agent/research/developer-experience/examples/validate-practice-fitness.example.ts
# Expected: no matches (exit 1)

grep -n "pnpm exec tsx scripts/validate-practice-fitness.ts" .agent/research/developer-experience/examples/validate-practice-fitness.example.ts
# Expected: at least one match
```

#### Phase 1 Single-Commit Validation

After Tasks 1.1–1.3 (any additional Task 1.N from Phase 0 audit) are complete, validate as one logical commit:

```bash
pnpm lint
pnpm test
pnpm markdownlint:root
pnpm format:root
```

Push the commit and verify CI:

```bash
gh pr checks 90 | grep -E "test|SonarCloud"
# Expected: test = pass; SonarCloud = still failing (Phase 2 outstanding)
```

**Phase 1 Complete When**: CI `test` job passes on the next run; the three (or N) drift sites use the canonical `pnpm exec tsx scripts/<script>.ts` form; `pnpm lint`, `pnpm test`, `pnpm markdownlint:root`, `pnpm format:root` exit 0 locally.

---

### Phase 2: Sonar Mechanical Sweep

**Foundation Check-In**: Re-read `principles.md §Code Quality → No warning toleration, anywhere` and `§Refactoring → TDD`.

**Key Principle**: Each fix is mechanical and behaviour-preserving. Existing tests must continue to pass after every change. If a Sonar fix would change behaviour, it is not mechanical and warrants a separate task.

#### Task 2.1: Fix `typescript:S2871` (sort callbacks) — 2 sites

**Files**:

- `scripts/validate-fitness-vocabulary.unit.test.ts:128`
- `scripts/validate-subagents-helpers.ts:94`

**Mechanical Fix Pattern**: Add `String.localeCompare` (or numeric comparator if numeric) compare function to `.sort()` call.

**Acceptance Criteria**:

1. ✅ Both `.sort()` calls have explicit compare functions.
2. ✅ Existing tests for both files pass unchanged.
3. ✅ Sonar issues `S2871` no longer appear in the OPEN/CONFIRMED set after Sonar reanalyses.

**Deterministic Validation**:

```bash
pnpm vitest run scripts/validate-fitness-vocabulary.unit.test.ts scripts/validate-subagents-helpers.unit.test.ts scripts/validate-subagents-helpers.integration.test.ts
# Expected: all green
```

#### Task 2.2: Fix `typescript:S7735` (negated conditions) — 4 sites

**File**: `scripts/validate-practice-fitness.ts` lines 520, 521, 533, 541

**Mechanical Fix Pattern**: Flip negated `if` conditions and swap branches; or use early return where it preserves clarity. Each fix is local and behaviour-preserving.

**Acceptance Criteria**:

1. ✅ All four negated conditions removed without changing logic.
2. ✅ Existing tests for `validate-practice-fitness.unit.test.ts` pass.
3. ✅ Sonar issues `S7735` no longer appear in the OPEN/CONFIRMED set.

**Deterministic Validation**:

```bash
pnpm vitest run scripts/validate-practice-fitness.unit.test.ts
# Expected: all green
```

#### Task 2.3: Fix `typescript:S7778` (`Array#push()` multiple times) — 1 site

**File**: `scripts/validate-practice-fitness.ts:531`

**Mechanical Fix Pattern**: Combine consecutive `arr.push(a); arr.push(b);` into `arr.push(a, b);`.

**Acceptance Criteria**:

1. ✅ Consecutive `push` calls combined into a single call with multiple args.
2. ✅ Behaviour unchanged; tests pass.

**Deterministic Validation**: same as Task 2.2.

#### Task 2.4: Fix `typescript:S7780` (`String.raw`) — 3 sites

**Files**:

- `scripts/validate-portability-helpers.ts:60`
- `scripts/validate-practice-fitness.ts:171,172`

**Mechanical Fix Pattern**: Replace `'\\'`-heavy regex source strings with `String.raw\`...\`` template literals where appropriate.

**Acceptance Criteria**:

1. ✅ All three sites use `String.raw` instead of escaped backslashes.
2. ✅ Regex behaviour unchanged.
3. ✅ Tests pass.

**Deterministic Validation**:

```bash
pnpm vitest run scripts/validate-portability-helpers.unit.test.ts scripts/validate-practice-fitness.unit.test.ts
# Expected: all green
```

#### Task 2.5: Fix `typescript:S7781` (`replaceAll` over `replace`) — 1 site

**File**: `scripts/validate-practice-fitness.ts:171`

**Mechanical Fix Pattern**: Replace `.replace(/x/g, y)` with `.replaceAll('x', y)` where the regex is a literal string.

**Acceptance Criteria**:

1. ✅ The `.replace` call uses `.replaceAll` if the regex is a literal-string equivalent.
2. ✅ Behaviour unchanged.

**Deterministic Validation**: same as Task 2.4.

#### Task 2.6: Fix `typescript:S6557` (`startsWith` over indexOf/charAt) — 1 site

**File**: `scripts/validate-practice-fitness.ts:215`

**Mechanical Fix Pattern**: Replace `str.indexOf('x') === 0` (or charAt-based prefix check) with `str.startsWith('x')`.

**Acceptance Criteria**:

1. ✅ The prefix check uses `String.prototype.startsWith`.
2. ✅ Behaviour unchanged.

**Deterministic Validation**: same as Task 2.4.

#### Phase 2 Single-Commit Validation

After Tasks 2.1–2.6 are complete, validate as one logical commit:

```bash
pnpm lint
pnpm test
pnpm test:root-scripts
pnpm format:root
```

Push the commit and verify Sonar gate:

```bash
sonar list issues -p oaknational_oak-open-curriculum-ecosystem --pull-request 90 --format json \
  | python3 -c "import json,sys; d=json.load(sys.stdin); o=[i for i in d['issues'] if i.get('issueStatus') in ('OPEN','CONFIRMED')]; print(f'OPEN/CONFIRMED: {len(o)}')"
# Expected: 0 (note: Sonar reanalysis may take a few minutes after push)
```

**Phase 2 Complete When**: All 12 mechanical Sonar issues resolved; all 4 affected files' tests still pass; `pnpm lint` and `pnpm test:root-scripts` exit 0 locally; Sonar reanalysis on PR #90 reports 0 OPEN/CONFIRMED issues.

---

### Phase 3: Verification + Owner Handoff

**Foundation Check-In**: Re-read `principles.md §Quality Gates`.

**Key Principle**: Verify all gates green; surface owner-only preconditions explicitly.

#### Task 3.1: Full Quality Gate Run

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint
pnpm test
pnpm test:e2e
pnpm test:root-scripts
pnpm markdownlint:root
pnpm format:root
pnpm practice:fitness:informational
```

**Acceptance Criteria**: every command exits 0.

#### Task 3.2: CI + Sonar Verification

```bash
gh pr checks 90
sonar list issues -p oaknational_oak-open-curriculum-ecosystem --pull-request 90 --format json \
  | python3 -c "import json,sys; d=json.load(sys.stdin); o=[i for i in d['issues'] if i.get('issueStatus') in ('OPEN','CONFIRMED')]; print(f'OPEN/CONFIRMED: {len(o)}')"
```

**Acceptance Criteria**:

1. ✅ `gh pr checks 90` shows `test` = pass, `SonarCloud Code Analysis` = pass, Vercel = pass, CodeQL = pass.
2. ✅ Sonar OPEN/CONFIRMED count is 0.
3. ✅ `Cursor Bugbot` finding on `.agent/memory/active/napkin.md:174` remains delegated to the agent owning the napkin (Squally Diving Anchor's continuity claim) — record the delegation in chat at session close, not in this plan.

#### Task 3.3: MCP Manual Validation Surfaced as Owner Precondition

**Action**: Post a comment on PR #90 stating:

- All gates green (link CI run + Sonar PR analysis).
- Outstanding precondition: owner manual MCP server validation, per the prior session handoff.
- Once owner confirms, the PR is ready for squash-merge.

**Acceptance Criteria**:

1. ✅ PR comment posted.
2. ✅ Comment names the precondition explicitly so the owner can act.
3. ✅ No agent action attempts to gate on or simulate MCP manual validation.

#### Task 3.4: Foundation Document Compliance Checklist

- [ ] `principles.md - Architectural Excellence Over Expediency`: Phase 1 fixed the boundary (TS-invocation pattern) instead of duplicating across it.
- [ ] `principles.md - Consistent Naming`: One concept (TS-script invocation) = one name (`pnpm exec tsx scripts/<script>.ts`) across CI, docs, examples.
- [ ] `principles.md - WE DON'T HEDGE`: No `void`, no underscore-prefix, no compatibility shims.
- [ ] `principles.md - No warning toleration`: All 12 Sonar lint signals resolved (not deferred).
- [ ] `principles.md - Quality Gates`: All gates run and pass before owner handoff.
- [ ] `testing-strategy.md - Test Behavior`: Sonar fixes preserved test behaviour; no test exempted from gates.
- [ ] `schema-first-execution.md - Generator First`: N/A (no SDK code touched).

**Task Complete When**: All checklist items verified; PR comment posted.

---

## Testing Strategy

### Unit Tests

Existing coverage in `scripts/validate-*.unit.test.ts` is sufficient for all Phase 2 fixes. No new unit tests required.

### Integration Tests

Existing coverage in `scripts/validate-*.integration.test.ts` is sufficient. No new integration tests required.

### E2E Tests

Not affected by this plan.

---

## Success Criteria

### Overall

- ✅ PR #90 `test` CI job passes.
- ✅ PR #90 SonarCloud gate passes (0 OPEN/CONFIRMED issues).
- ✅ TS-script invocation pattern is consistent across `.github/workflows/`, `docs/`, and `.agent/research/` examples.
- ✅ All 12 mechanical Sonar issues resolved without weakening any quality gate.
- ✅ Owner is informed of the MCP manual validation precondition with all evidence in place.
- ✅ No new architectural rules added; ADR-168 stands as authored.

---

## Dependencies

**Blocking**: None — both workstreams are self-contained.

**Related Plans**:

- `.agent/plans/architecture-and-infrastructure/archive/completed/typescript-6-migration-and-workspace-script-rules.plan.md` — the source TS6 migration that introduced the drift this plan closes.
- `.agent/plans/architecture-and-infrastructure/current/sonarjs-activation-and-sonarcloud-backlog.plan.md` — the Sonar backlog plan; the 12 issues fixed here are a subset relevant only to PR #90.

**Prerequisites**:

- ✅ Vercel preview is green on `fix/build_issues` (verified at session open).
- ✅ Active claim 21943b5a registered.
- ✅ Squally Diving Anchor's continuity claim is disjoint or closed.

---

## Notes

### Why This Matters (System-Level Thinking)

**Immediate value**:

- Unblocks merge of PR #90 — the Vercel release pipeline restoration becomes durable on `main`.
- Removes the local-vs-CI gap that caused this whole class of failure to be invisible to local validation.

**System-level impact**:

- Cements the canonical TS-script invocation pattern across the repo so future migrations don't re-learn this drift.
- Demonstrates the "audit-then-fix" pattern: when a handoff frames N independent paper cuts, look for the architectural drift they share before executing.

**Risk of not doing**:

- PR #90 stays unmergeable, blocking the architectural rules + Vercel pipeline fix from landing on `main`.
- Stale `.mjs` references propagate as references in archived plans get copied into new work.

### Alignment with `principles.md`

> "Architectural Excellence Over Expediency"

This plan deliberately reframes three named paper cuts as one architectural sweep + one mechanical sweep. The expedient action would be to fix only the named instances; the excellent action is the audit-then-fix that catches siblings.

> "Consistent Naming"

The TS-script invocation pattern is now one name (`pnpm exec tsx scripts/<script>.ts`) across CI, docs, and examples. The handoff's "delete-vs-redirect" framing implied two valid options; the plan answers "redirect, consistently."

---

## References

- PR: <https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/90>
- Failing CI run: <https://github.com/oaknational/oak-open-curriculum-ecosystem/actions/runs/25107898664>
- Sonar PR analysis: <https://sonarcloud.io/dashboard?id=oaknational_oak-open-curriculum-ecosystem&pullRequest=90>
- Foundation documents:
  - `.agent/directives/principles.md`
  - `.agent/directives/testing-strategy.md`
  - `.agent/directives/schema-first-execution.md`
- Source TS6 migration plan: `.agent/plans/architecture-and-infrastructure/archive/completed/typescript-6-migration-and-workspace-script-rules.plan.md`
- ADR-168: TS6 baseline + workspace-script rules

---

## Implementation Notes

### Key Insight

The handoff's punch list compression hid the architectural shape. Grounding the failure surface revealed that the named items decompose into two coherent workstreams + one owner gate. This re-framing is the actual win; the execution that follows is bounded and mechanical.

### Migration Path

1. **Phase 0**: One grep audit confirms scope.
2. **Phase 1**: One commit aligns CI + docs + examples on the canonical TS-invocation pattern.
3. **Phase 2**: One commit applies 12 mechanical Sonar fixes.
4. **Phase 3**: Verify gates; surface MCP manual validation precondition; hand off to owner.

### Minimal Risk

- All Phase 2 fixes are local lint signals against well-tested files.
- Phase 1 is a no-behaviour-change rename across config + docs.
- No new dependencies, no new runtime code, no new architectural rules.
- Squally Diving Anchor's continuity work is disjoint; comms event already records the handshake.

---

## Validation Checklist

```bash
# Full quality gate sequence
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint
pnpm test
pnpm test:e2e
pnpm test:root-scripts
pnpm practice:fitness:informational

# CI + Sonar
gh pr checks 90
sonar list issues -p oaknational_oak-open-curriculum-ecosystem --pull-request 90 --format json \
  | python3 -c "import json,sys; d=json.load(sys.stdin); o=[i for i in d['issues'] if i.get('issueStatus') in ('OPEN','CONFIRMED')]; print(f'OPEN/CONFIRMED: {len(o)}')"
```

**Expected Results**:

- ✅ All `pnpm` commands exit 0.
- ✅ `gh pr checks 90`: `test` = pass, `SonarCloud Code Analysis` = pass.
- ✅ Sonar OPEN/CONFIRMED count = 0.

---

## Code Quality Verification

```bash
# 1. No remaining .mjs script invocations in live surfaces
grep -rn "node scripts/.*\.mjs" \
  --include="*.yml" --include="*.yaml" --include="*.md" \
  --include="*.json" --include="*.toml" --include="*.sh" --include="*.ts" \
  | grep -v "node_modules\|\.next\|dist\|\.git/\|active-claims\|closed-claims\|shared-comms-log\|comms/events\|/archive/"
# Expected: no matches.

# 2. Canonical pnpm-exec form is present in CI
grep -c "pnpm exec tsx scripts/" .github/workflows/ci.yml
# Expected: 2 (or higher if Phase 0 audit found additional sites).
```

---

## Consolidation

After all work is complete, all gates green, and owner has confirmed MCP manual validation:

1. Run `/jc-consolidate-docs` to graduate the "audit-before-fixing" reframing as a candidate napkin entry, surface the local-vs-CI gap as a structural smell for separate plan triage, and rotate napkin if needed.
2. Archive this plan to `.agent/plans/architecture-and-infrastructure/archive/completed/`.
3. Close active claim 21943b5a.

---

## Future Enhancements (Out of Scope)

- **Local-vs-CI invocation gap**: CI invokes scripts (`ci-turbo-report.ts`, `ci-schema-drift-check.ts`) that are not run by `pnpm test`. This is a structural smell — a class of failure that escapes local validation. Belongs in a separate plan; not addressed here.
- **vitest-config-base coupling**: 19 workspaces import the root `vitest.config.base`. Same shape as the workspace-to-root-script ban but for configs. Out of scope for this PR; the prior session flagged it for owner direction.
- **Remaining 38 CLOSED Sonar issues**: already resolved; no action needed.
