---
name: "Sonarjs Activation and SonarCloud Backlog"
overview: "Activate eslint-plugin-sonarjs in the Oak ESLint recommended preset, fix the resulting local violations, and clear the SonarCloud remote backlog, with severity-ordered phases and explicit inter-phase gates so scope can be reduced at any phase boundary without abandoning the plan."
todos:
  - id: phase-0-baseline
    content: "Phase 0: baseline local sonarjs violations and SonarCloud remote issues; classify by category and severity; compute overlap; identify auto-fixable subset. Produces the tranche counts the rest of the plan depends on."
    status: pending
    priority: next
  - id: phase-1-autofix
    content: "Phase 1: run sonarjs auto-fixers across the repo; commit the fix pass; re-baseline residual count."
    status: pending
  - id: phase-2-bugs
    content: "Phase 2: fix correctness bugs (sonarjs/different-types-comparison, sonarjs/no-all-duplicated-branches, local bug category; SonarCloud Reliability-rated issues). Target: zero bugs locally; SonarCloud Reliability rating to A."
    status: pending
  - id: phase-3-security
    content: "Phase 3: fix the SonarCloud vulnerability (1) and triage / resolve security hotspots (169). Target: zero vulnerabilities; hotspots reviewed and either fixed or explicitly accepted with rationale."
    status: pending
  - id: phase-4-smells
    content: "Phase 4: fix remaining code smells — both sonarjs locals and SonarCloud maintainability issues — in size/complexity-first order."
    status: pending
  - id: phase-5-activation
    content: "Phase 5: flip the placeholder `{ plugins: { sonarjs } }` entry in packages/core/oak-eslint/src/configs/recommended.ts back to `sonarjs.configs.recommended`; re-run full gates; land the PR; archive the plan and mine permanent docs."
    status: pending
---

# Sonarjs Activation and SonarCloud Backlog

**Last Updated**: 2026-04-24
**Status**: 🔴 NOT STARTED
**Scope**: Activate `eslint-plugin-sonarjs` as a first-class local gate, and clear the SonarCloud remote backlog to raise the reliability and security ratings.

---

## Context

### Current State (2026-04-24 baseline)

**Local** — `eslint-plugin-sonarjs@4.0.2` is installed and declared as a dependency of `@oaknational/eslint-plugin-standards` (`packages/core/oak-eslint/package.json`). The plugin is *registered* in `configs/recommended.ts` via a placeholder `{ plugins: { sonarjs } }` entry but **no rules are activated**. When `sonarjs.configs.recommended` was briefly enabled on 2026-04-24 as a scoping experiment, `pnpm lint:fix` reported:

| Package | Errors |
|---|---|
| `@oaknational/sdk-codegen` | 142 |
| `@oaknational/search-cli` | 83 |
| `@oaknational/oak-curriculum-mcp-streamable-http` | 81 |
| `@oaknational/agent-tools` | 38 |
| `@oaknational/oak-search-sdk` | 32 |
| `@oaknational/curriculum-sdk` | 28 |
| `@oaknational/logger` | 24 |
| `@oaknational/observability` | 6 |
| `@oaknational/build-metadata` | 5 |
| `@oaknational/sentry-node` | 5 |
| `@oaknational/design-tokens-core` | 4 |
| `@oaknational/env-resolution` | *count suppressed by runner* |
| `@oaknational/search-contracts` | *count suppressed by runner* |

**Visible total**: 448+ errors across at least 11 packages; exact `env-resolution` and `search-contracts` counts to be recovered in Phase 0 by running them individually.

**Remote (SonarCloud)** — project `oaknational_oak-open-curriculum-ecosystem`, measured via `mcp__sonarqube__get_component_measures`:

| Metric | Value |
|---|---|
| Bugs | 67 |
| Vulnerabilities | 1 |
| Security Hotspots | 169 |
| Code Smells | 1,176 |
| Total Issues | 1,244 |
| Technical Debt | 5,937 minutes (~99h) |
| Reliability Rating | 4.0 (D — poor) |
| Security Rating | 5.0 (E — worst) |
| Maintainability Rating | 1.0 (A) |
| NCLOC | 162,935 |

**Root Cause**: `eslint-plugin-sonarjs` was installed (likely during a prior tooling sweep) but never wired into the preset. SonarCloud was integrated remotely (commit `69a87c44`, 2026-04-24) but the backlog from pre-integration code has never been cleared. The two surfaces (local ESLint and remote SonarCloud) must be reconciled in the same plan so the final gate is coherent: once local passes, the remote should not surface large classes of new issues.

**Existing Capabilities**:

- `@oaknational/eslint-plugin-standards` is the single source of truth for shared ESLint rules (consumed by every workspace's `eslint.config.ts`).
- SonarCloud is wired to the project via `sonar-project.properties` and the `@claude-plugins-official/sonarqube` MCP server.
- Pre-commit hooks invoke `pnpm lint:fix` so locally-activated rules gate all commits automatically — once the backlog is cleared, the gate is self-enforcing.

---

## Quality Gate Strategy

Run full quality gates across ALL workspaces after each phase, not per package. A sonarjs rule may be introduced in one package and surface a violation in another via shared code. The `pnpm lint:fix` run must also include `pnpm type-check` and `pnpm test` to catch regressions from fixes (e.g., a nested-ternary rewrite changing evaluation order).

### After Each Phase

```bash
pnpm sdk-codegen        # if any SDK code was touched
pnpm build              # rebuild shared packages
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint-check:root
pnpm test
```

---

## Phase-Boundary Gates (Stop Points)

**This plan intentionally supports scope reduction at every phase boundary.** The default target is a single PR that completes all six phases. The gate-out option exists because the backlog is large and severity-ordered — stopping after Phase 2 (bugs) or Phase 3 (security) still produces a defensible shippable invariant.

At each phase boundary the gate question is:

> Is the remaining effort proportional to the remaining value, given the other live work on this branch and the review burden already accrued?

If the answer is **no**, the gate-out action is:

1. Leave the placeholder `{ plugins: { sonarjs } }` entry in place (sonarjs remains registered but inactive).
2. Do **not** enable the rule set in `recommended.ts` — that's Phase 5's job and is the final act.
3. Update this plan: mark completed phases as `completed`, mark the cutoff phase's `Deferred — <reason>` with PDR-026 deferral-honesty discipline (named constraint + evidence + falsifiability).
4. Open a new `current/` plan for the deferred phases (likely in the same bucket).
5. Ship the PR with the partial scope; the sonarjs plugin stays off until a future plan completes the deferred phases and reaches Phase 5.

Gate-out is legitimate at boundaries 2→3, 3→4, 4→5. Earlier gate-out (before Phase 2 completes) should be rare and only when Phase 0 discovery itself reveals the problem shape was misunderstood.

---

## Problem Statement

### Current Architecture Issues

1. **Unused quality plugin**: `eslint-plugin-sonarjs` is a declared dependency, externalised in tsup, and listed in the knip ignore list — but never wired into any preset. Dead configuration mass.

2. **Latent correctness defects**: sonarjs rules like `different-types-comparison` flag `===` comparisons that are always false — these are real bugs, not style. Enabling the rule surfaces defects the team has shipped unknowingly.

3. **Unratcheted quality gate**: SonarCloud is integrated remotely but is not in the commit-time gate. Pre-existing issues do not block new commits; new issues matching pre-existing patterns also do not block because there is no local equivalent of the remote rules. The project has reliability D and security E with no in-repo signal of those ratings.

4. **Asymmetric surfaces**: SonarCloud engine covers rules the ESLint plugin does not (security hotspots especially, some cross-file complexity). Closing only the local side leaves an unclosable loop against the remote signal.

### Manifestation

- `apps/oak-search-cli/src/lib/indexing/readback-field-audit.integration.test.ts:95,183` — `===` comparisons that are always false (sonarjs/different-types-comparison) — latent test-quality defect.
- `apps/oak-search-cli/src/lib/search-quality/metrics.ts:66,114,129` — same pattern in product code.
- 169 security hotspots uncurated on SonarCloud — nobody has triaged them.
- Maintainability debt at 99h and growing with every commit.

---

## Solution Architecture

### Principle

From `principles.md`:

> Run quality gates frequently to catch issues early. If a change breaks something, you want to know immediately, not after 10 more changes.

From `testing-strategy.md`:

> Tests validate behaviour, not implementation.

### Key Insight

The gate itself is the lasting artefact. The fixes are a one-time cost. Activating sonarjs on day N prevents N+1 regressions; clearing the backlog on day N fixes existing ones. Both are needed — but the *order* (fix first, activate last) is the principle that makes this tractable without a long-lived broken state.

### Strategy

1. **Baseline first, tranche second** (Phase 0). Do not swing in the dark.
2. **Auto-fix before manual** (Phase 1). Let the plugin eat its own tail.
3. **Severity-ordered manual fixes** (Phases 2 → 3 → 4). Bugs before vulnerabilities before hotspots before smells.
4. **Activate last** (Phase 5). The gate flip is a single commit that turns the sonarjs rule set on for good.
5. **Gate-out by phase boundary** — always an option, never a default.

**Non-Goals (YAGNI)**:

- ❌ Introducing *additional* rule packs beyond the vendor-recommended sonarjs set.
- ❌ Re-engineering workspaces to make fixes "elegant" when a minimal fix suffices.
- ❌ Mass-disabling sonarjs rules to hide violations (a disabled rule is not a fixed rule).
- ✅ What we ARE doing: enabling vendor-recommended sonarjs, clearing the existing backlog, and closing the loop with SonarCloud.

---

## Reviewer Scheduling (phase-aligned)

- **Pre-execution (Phase 0 close)**: `assumptions-reviewer` on the Phase 0 baseline — challenges the tranche design before fixing begins. `code-reviewer` gateway.
- **Per-phase**: `code-reviewer` after each phase's commits. `test-reviewer` if any fix touches test code (many auto-fixes will). `type-reviewer` if any fix involves assertions or Record widening.
- **Phase 3 (security)**: `security-reviewer` on every commit that changes trust-boundary code or touches publicly-writable-directory patterns.
- **Post (Phase 5 close)**: `docs-adr-reviewer` on the final commit's ADR/readme updates; `release-readiness-reviewer` as the final go/no-go.
- **On gate-out**: `assumptions-reviewer` re-runs on the deferral rationale to catch convenience phrasing (PDR-026).

Scheduling every reviewer at close would be phase-misalignment. See `feature-workstream-template.md` §Reviewer Scheduling for rationale.

---

## Foundation Document Commitment

Before beginning each phase:

1. Re-read `.agent/directives/principles.md`
2. Re-read `.agent/directives/testing-strategy.md`
3. Re-read `.agent/directives/schema-first-execution.md`
4. Re-read `.agent/rules/no-warning-toleration.md` — sonarjs violations must be fixed, not warn-downgraded.
5. Re-read `.agent/rules/replace-dont-bridge.md` — fix shape, not wrap.

Ask: "Does enabling this rule deliver system-level value, or is the fix just cosmetic?" If cosmetic across a large class, consider Phase 4 triage instead of mass-rewrite.

---

## Documentation Propagation Commitment

Before marking Phase 5 complete:

1. Update `docs/governance/typescript-practice.md` with the sonarjs activation and the rule categories it covers.
2. Update `docs/engineering/build-system.md` if the gate sequence changed.
3. If a new architectural decision emerges (e.g., "sonarjs recommended is the permanent floor"), author an ADR.
4. Apply `/jc-consolidate-docs` — do not leave this plan as the primary source of the decision.

If no update is needed for a required surface, record an explicit no-change rationale.

---

## Resolution Plan

### Phase 0: Baseline and Tranche (≈2 hours)

**Foundation Check-In**: principles.md "Run quality gates frequently" — the plan cannot be severity-ordered until severity is measured.

**Key Principle**: do not start fixing until every violation has been counted and classified.

#### Task 0.1: Local baseline — capture full violation list

Re-enable `sonarjs.configs.recommended` temporarily in `recommended.ts` (in a local throwaway commit or on a scratch branch), run `pnpm --filter <each-workspace> lint` individually (not `pnpm lint:fix` — we want raw counts pre-fix), capture the complete violation list to `.agent/plans/architecture-and-infrastructure/current/sonarjs-activation-baseline.md`.

**Acceptance Criteria**:

1. ✅ Every workspace's violation count captured, including the previously-suppressed `env-resolution` and `search-contracts` counts.
2. ✅ Violations grouped by rule (so the tranches in Phases 1–4 can be targeted).
3. ✅ Baseline file committed alongside the plan.
4. ✅ Temporary `recommended.ts` activation reverted — the placeholder entry is restored for everyday work on the branch.

**Deterministic Validation**:

```bash
# capture raw counts per rule across the whole repo
pnpm lint 2>&1 | grep -E "sonarjs/[a-z-]+" | \
  sed -E 's/.*sonarjs\/([a-z-]+).*/\1/' | sort | uniq -c | sort -rn
# Expected: a ranked list of rule names with counts

# count per package
pnpm lint 2>&1 | grep -E "✖ [0-9]+ problems" | \
  awk -F':' '{print $1, $NF}'
# Expected: per-package totals
```

#### Task 0.2: Remote baseline — capture SonarCloud issue list

Pull the full issue list from SonarCloud via the MCP tool into `.agent/plans/architecture-and-infrastructure/current/sonarcloud-baseline.md`, tagged by type (BUG/VULNERABILITY/CODE_SMELL/SECURITY_HOTSPOT) and by severity.

**Acceptance Criteria**:

1. ✅ Every BUG and VULNERABILITY captured with file path and rule key.
2. ✅ Every SECURITY_HOTSPOT captured.
3. ✅ Code smells captured in aggregate by rule key (the full 1,176 list does not need per-issue detail yet; the rule histogram does).
4. ✅ Baseline file committed alongside the plan.

#### Task 0.3: Overlap analysis

For each sonarjs local rule, identify whether it has a direct SonarCloud rule equivalent. Many do (`sonarjs/different-types-comparison` ↔ `javascript:S3403`, etc.).

**Acceptance Criteria**:

1. ✅ Overlap matrix produced — each local rule either has a remote equivalent or doesn't.
2. ✅ Delta set identified — SonarCloud issues with no local rule (these are the fixes that won't be gate-prevented locally going forward).
3. ✅ Recommendation section appended to the baseline: either accept the delta as intentional, or open a follow-up plan for custom rules.

**Phase 0 Complete Validation**:

```bash
# baseline files exist
ls .agent/plans/architecture-and-infrastructure/current/sonarjs-activation-baseline.md
ls .agent/plans/architecture-and-infrastructure/current/sonarcloud-baseline.md

# per-phase tranche counts are legible in the plan body
grep -E "Phase [1-4] targets" .agent/plans/architecture-and-infrastructure/current/sonarjs-activation-and-sonarcloud-backlog.plan.md
```

**Gate after Phase 0** (`assumptions-reviewer` run required): do the tranche counts match the severity-ordered phase shape, or does the data suggest a different order? Reviewer may recommend reordering or re-tranching before Phase 1.

---

### Phase 1: Auto-fixable Pass (≈1 hour runtime; ≈2 hours review)

**Foundation Check-In**: testing-strategy.md — fixes to test files must preserve test intent.

**Key Principle**: the plugin's autofixer is the lowest-risk channel. Run it, review the diff, ship.

#### Task 1.1: Enable sonarjs.configs.recommended, run lint:fix, commit

Temporarily re-enable full sonarjs rules; run `pnpm lint:fix`; commit the auto-fixed changes as one commit per workspace (to keep review reviewable).

**Acceptance Criteria**:

1. ✅ `pnpm lint:fix` completes with all auto-fixable rules applied.
2. ✅ `pnpm type-check` exits 0 (autofixes did not break typing).
3. ✅ `pnpm test` exits 0 (autofixes did not break behaviour).
4. ✅ Residual violation count (non-autofixable) recorded — this is the manual budget for Phases 2–4.
5. ✅ Residual count committed into the baseline file.

**Risk**: some autofixes for rules like `prefer-regex-literals` or `no-nested-template-literals` change code structure. `test-reviewer` must spot-check autofixed test files; `code-reviewer` gateway confirms no behaviour regression in autofixed product code.

**Deterministic Validation**:

```bash
pnpm type-check  # exit 0
pnpm test        # exit 0
pnpm lint 2>&1 | grep -cE "sonarjs/"  # residual count
```

**Gate after Phase 1**: if residual count > 300, scope risk is high — reviewer check-in before continuing. If < 100, proceed aggressively.

---

### Phase 2: Correctness Bugs

**Foundation Check-In**: principles.md "No type shortcuts" — a `===` that is always false is a type mismatch leaking through assertion gaps.

**Key Principle**: bugs first. These are the highest-value fixes in this plan.

#### Tasks (tranche-driven; exact task list produced by Phase 0)

Each sonarjs rule in the *bug* category (notable examples: `different-types-comparison`, `no-all-duplicated-branches`, `no-identical-expressions`, `no-redundant-boolean`) gets one task per rule. Each task:

- fixes every violation of that rule across the repo in one commit
- commits with message `fix(<workspace>): resolve sonarjs/<rule> violations — <brief summary>`
- adds or updates a unit test covering the fixed path if the bug was in product code and no coverage existed

Concurrent: SonarCloud BUG-severity issues without a local sonarjs equivalent are tracked as distinct tasks and resolved inline.

**Acceptance Criteria (phase-level)**:

1. ✅ All sonarjs bug-category rules show zero violations in `pnpm lint`.
2. ✅ SonarCloud `bugs` metric = 0 after next analysis.
3. ✅ SonarCloud `reliability_rating` = 1.0 (A).
4. ✅ `pnpm test` exits 0.
5. ✅ Every bug fix in product code has a regression test (TDD compliance per `.agent/directives/testing-strategy.md`).

**Reviewer**: `test-reviewer` on every commit that touches a test file (ADR-078 compliance); `code-reviewer` gateway on every commit.

**Gate after Phase 2**: correctness floor reached. If Phase 3's security work is expected to exceed 20h and the current branch has drifted significantly from main, legitimate gate-out point — open a follow-up plan for Phases 3–5 and ship Phase 2 as a standalone PR.

---

### Phase 3: Vulnerability and Security Hotspots

**Foundation Check-In**: `.agent/rules/strict-validation-at-boundary.md` — every security hotspot is a trust-boundary audit point.

**Key Principle**: every hotspot is reviewed; fix if real, formally accept (with rationale) if false-positive. Unreviewed hotspots are not allowed to remain.

#### Task 3.1: Resolve the single vulnerability

The one `vulnerabilities` entry from SonarCloud is identified in Phase 0, audited, fixed in a single commit, and re-analysed to confirm resolution.

**Acceptance Criteria**:

1. ✅ `vulnerabilities` metric = 0.
2. ✅ `security_rating` improves from 5.0 (E) — target 1.0 (A).
3. ✅ `security-reviewer` sub-agent reviewed the fix before commit.

#### Task 3.2: Triage and resolve the 169 security hotspots

Walk the hotspot list from Phase 0. For each:

- **Fix** if the hotspot is a real risk (e.g., real publicly-writable-directory use outside tests).
- **Accept** (via SonarCloud `change_security_hotspot_status` MCP call) if confirmed safe, with written rationale that matches PDR-026 deferral-honesty shape.
- **Convert to FALSE_POSITIVE** if the rule is firing on a pattern that is demonstrably not the risk it describes (e.g., `sonarjs/publicly-writable-directories` hitting Playwright fixture tmp dirs).

**Acceptance Criteria**:

1. ✅ Every hotspot is in one of states: FIXED (code changed), ACCEPTED (rationale recorded), FALSE_POSITIVE (rationale recorded). No hotspot left in `TO_REVIEW`.
2. ✅ Each accepted/false-positive rationale satisfies PDR-026 deferral-honesty shape (named constraint OR named trade-off + evidence + falsifiability).
3. ✅ `security-reviewer` sub-agent reviewed the triage results.

**Gate after Phase 3**: security floor reached. Second legitimate gate-out point. Phase 4 (smells) is pure maintainability; deferring it to a follow-up plan ships the correctness+security win while deferring the style tail.

---

### Phase 4: Code Smells

**Foundation Check-In**: principles.md "Could it be simpler?" — some smells resolve via simplification; some require inline suppression with explicit rationale if the alternative is contortion.

**Key Principle**: smells are a long tail. Fix in size/impact order; avoid rewrites that destabilise the code for cosmetic wins.

#### Tasks (tranche-driven from Phase 0)

Per rule in the smell category:

- If autofixer exists — should have run in Phase 1; anything remaining means the autofixer declined (often due to unsafe context). Manual fix or inline suppression with rationale.
- If no autofixer — manual fix or inline suppression with rationale.

Inline suppression must cite the specific reason inline; bulk-disabling a rule across a file or workspace is not permitted.

**Acceptance Criteria (phase-level)**:

1. ✅ All sonarjs smell-category rules show zero violations in `pnpm lint`, OR have documented inline suppression with rationale.
2. ✅ SonarCloud `code_smells` metric ≤ 100 (a 90%+ reduction is acceptable; zero is aspirational for a 1,176-item baseline).
3. ✅ SonarCloud `sqale_index` (tech debt) reduced by ≥ 80% from the 5,937-minute baseline.
4. ✅ `pnpm test` exits 0.

**Gate after Phase 4**: third legitimate gate-out point. Remaining work is purely the Phase 5 activation commit.

---

### Phase 5: Activation, Gate-On, Archive

**Foundation Check-In**: re-read all three foundation documents. This is the commit that closes the loop.

**Key Principle**: activation is a single, reversible commit. The rest of the plan is the reason it's safe to make.

#### Task 5.1: Flip the placeholder entry to active

In `packages/core/oak-eslint/src/configs/recommended.ts`, replace the placeholder entry with the active rule set:

```ts
// Before:
{ plugins: { sonarjs } },

// After:
sonarjs.configs.recommended,
```

Remove the "pending activation" comment block. Rebuild `@oaknational/eslint-plugin-standards`.

**Acceptance Criteria**:

1. ✅ `pnpm --filter @oaknational/eslint-plugin-standards build` succeeds.
2. ✅ `pnpm lint:fix` exits 0 across the whole repo.
3. ✅ `pnpm type-check` exits 0.
4. ✅ `pnpm test` exits 0.
5. ✅ `pnpm test:e2e` exits 0 (where applicable).
6. ✅ Next SonarCloud analysis (post-merge) shows reliability A, security A, bugs 0, vulnerabilities 0, hotspots reviewed.

#### Task 5.2: Documentation propagation

1. Update `docs/governance/typescript-practice.md` with a "Static analysis" section describing sonarjs as the permanent floor.
2. Update `docs/engineering/build-system.md` if the gate sequence changed.
3. Author an ADR if "sonarjs recommended is the permanent floor" is a decision worth durable recording.
4. Run `/jc-consolidate-docs` to home settled content.

#### Task 5.3: Plan archive

1. Mark all phase todos `completed`.
2. Move this plan to `.agent/plans/architecture-and-infrastructure/archive/completed/`.
3. Add an entry to `completed-plans.md`.
4. Update cross-references to point to the archive location.
5. Delete the baseline files (`sonarjs-activation-baseline.md`, `sonarcloud-baseline.md`) — they are ephemeral working artefacts, not permanent documentation.

**Task Complete When**: all acceptance criteria checked AND SonarCloud next-analysis shows the target ratings AND plan archived.

---

## Testing Strategy

### Unit Tests

Autofixes that change test code (void-use removal, ternary extraction) must be spot-checked by `test-reviewer`. No new unit tests are inherently required by sonarjs rule fixes, but bug fixes in product code during Phase 2 must have regression coverage.

### Integration Tests

`pnpm test` runs integration tests repo-wide; those gate every phase.

### E2E Tests

`pnpm test:e2e` runs only at Phase 5. Sonarjs rule fixes should not change E2E behaviour; if they do, the fix is suspect.

---

## Success Criteria

### Phase 0

- ✅ Local baseline captured with per-rule and per-workspace counts.
- ✅ Remote baseline captured with per-type and per-severity counts.
- ✅ Overlap matrix identifies delta between local and remote coverage.

### Phase 1

- ✅ All sonarjs auto-fixable rules resolved.
- ✅ `pnpm type-check` and `pnpm test` exit 0.

### Phase 2

- ✅ SonarCloud `bugs` = 0, `reliability_rating` = 1.0 (A).
- ✅ Every bug fix in product code has a regression test.

### Phase 3

- ✅ SonarCloud `vulnerabilities` = 0, `security_rating` = 1.0 (A).
- ✅ All 169 security hotspots in FIXED / ACCEPTED / FALSE_POSITIVE state.

### Phase 4

- ✅ SonarCloud `code_smells` reduced by 90%+.
- ✅ SonarCloud `sqale_index` reduced by 80%+.

### Phase 5

- ✅ `sonarjs.configs.recommended` active in `recommended.ts`.
- ✅ Full repo lint / type-check / test / e2e gates exit 0.
- ✅ Plan archived.

### Overall

- ✅ Reliability rating A, Security rating A.
- ✅ sonarjs rule set is the permanent floor for local quality.
- ✅ The loop between local and remote gates is closed.

---

## Dependencies

**Blocking**: none. The plan is self-contained.

**Related Plans**:

- [`quality-gate-hardening.plan.md`](./quality-gate-hardening.plan.md) — sibling; the "promote static analysis tools" todo in that plan is what this plan operationalises. When this plan completes, mark that todo `completed` in the sibling.
- [`security-dependency-triage.plan.md`](./security-dependency-triage.plan.md) — sibling; may share overlapping security concerns on the vulnerabilities / hotspots front.

**Prerequisites**:

- ✅ `eslint-plugin-sonarjs@^4.0.2` is installed (`packages/core/oak-eslint/package.json`).
- ✅ SonarCloud is integrated (`sonar-project.properties`, commit `69a87c44`).
- ✅ The placeholder `{ plugins: { sonarjs } }` entry in `recommended.ts` is in place (commit 2026-04-24).

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Autofix changes test behaviour silently | Medium | High | `test-reviewer` spot-checks autofixed test files; `pnpm test` gates every commit in Phase 1. |
| A bug fix in Phase 2 breaks a passing (but incorrect) test | Medium | High | TDD compliance — rewrite the test first, then the product code; `test-reviewer` enforces. |
| Security hotspot triage misses a real risk via over-aggressive FALSE_POSITIVE | Low | Very High | `security-reviewer` sub-agent reviews every ACCEPTED / FALSE_POSITIVE rationale. |
| Phase 4 code-smell fixes destabilise large files via cognitive-complexity rewrites | Medium | Medium | Prefer inline suppression with rationale over contorted rewrites; the rule is secondary to the code's readability. |
| Plan stalls mid-flight | High | Medium | Explicit gate-out points at phase boundaries; each gate-out produces a defensible shippable invariant (correctness floor, security floor) and opens a follow-up plan. |
| SonarCloud analysis drifts from local during the long Phase 4 | Medium | Low | Don't merge to main mid-flight; run local gates against the baseline; check SonarCloud after final merge only. |

---

## Build-vs-Buy Attestation

**Decision**: adopt `eslint-plugin-sonarjs` (SonarSource vendor-first-party port of SonarCloud rules) rather than authoring equivalent Oak rules.

**Vendor evaluated**: SonarSource — the first-party producer of both SonarCloud and `eslint-plugin-sonarjs`. The plugin ports the subset of SonarSource rules that are ESLint-expressible; the remainder stay in SonarCloud's engine.

**First-party options surveyed**:

- `@oaknational/eslint-plugin-standards` already hosts the repo's custom rules. Authoring sonarjs-equivalents there would duplicate SonarSource's work and drift from upstream.
- SonarCloud-only (no local plugin) was rejected because it does not gate at commit time — issues slip through until remote analysis runs.

**Why vendor**: same engine, same rule IDs, single source of truth. Local ESLint catches issues at commit time; SonarCloud catches the superset at analysis time. The delta is by design, not accident.

**Sunk-cost check**: this repo has no prior bespoke implementation to preserve. No sunk cost in play.

`assumptions-reviewer` validates this attestation at Phase 0 close.

---

## Notes

### Why This Matters

**Immediate Value**:

- **Bug reduction**: 67 known bugs currently shipped in product code are fixed.
- **Security posture**: reliability rating moves from D to A; security rating from E to A.
- **Gate institutionalisation**: sonarjs becomes the permanent local floor; SonarCloud becomes the loop-closing remote signal.

**System-Level Impact**:

- **Regression prevention**: every future PR is gated against the sonarjs rule set locally; the reliability and security ratings cannot silently degrade.
- **Practice coherence**: Sonar is now *used*, not installed-and-ignored. The agentic practice treats quality tools as live artefacts.
- **Review velocity**: reviewers stop catching issues sonarjs would have caught; their attention lands on judgement-requiring concerns.

**Risk of Not Doing**:

- SonarCloud ratings stay D/E; the SonarCloud badge in the README misrepresents the project's state.
- Existing bugs stay shipped; regressions against the same patterns continue accruing.
- `eslint-plugin-sonarjs` remains a dead dependency; future maintainers inherit the same "why is this installed?" question.

### Alignment with foundation documents

**From `principles.md`**:

> Run quality gates frequently to catch issues early.

**From `testing-strategy.md`**:

> Tests validate behaviour, not implementation.

**From `.agent/rules/no-warning-toleration.md`**:

> Every lint warning is a defect the gate has not yet caught.

**From `.agent/rules/replace-dont-bridge.md`**:

> Fix shape, not wrap.

This plan:

- ✅ Gate-first ordering — fixes precede activation so the gate is stable when flipped.
- ✅ Severity-ordered tranches — bugs before smells.
- ✅ TDD compliance on bug fixes — regression tests added for product-code bug fixes.
- ✅ No suppression-as-default — inline suppression only with rationale; no mass-disable.

---

## References

- `packages/core/oak-eslint/src/configs/recommended.ts` — placeholder entry at the line `// sonarjs plugin is registered but no rules are currently activated.`
- `packages/core/oak-eslint/package.json` — dependency declaration
- `knip.config.ts` — packages/core/oak-eslint ignoreDependencies list (sonarjs removed 2026-04-24)
- `sonar-project.properties` — remote project key `oaknational_oak-open-curriculum-ecosystem`
- Foundation documents:
  - `.agent/directives/principles.md`
  - `.agent/directives/testing-strategy.md`
  - `.agent/directives/schema-first-execution.md`

---

## Consolidation

After all phases complete (or after the final ship if scope reduced), run `/jc-consolidate-docs` to:

- graduate settled content (e.g., "sonarjs recommended is the permanent floor" → ADR or governance doc)
- extract reusable patterns (e.g., gate-off-fix-gate-on is a pattern)
- rotate the napkin
- manage fitness
- update the practice exchange

---

## Future Enhancements (Out of Scope)

- **Custom Oak sonarjs-style rules**: the delta between `eslint-plugin-sonarjs` and SonarCloud covers rule classes ESLint cannot express (e.g., cross-file cognitive complexity). Bridging the delta with repo-local custom rules is a separate plan if the delta proves problematic.
- **SonarCloud new-code quality gate tightening**: the default new-code gate may be stricter than the baseline gate. Tightening comes after this plan clears the baseline.
- **Stryker mutation testing integration with sonarjs signals**: mutation testing would pair well with sonarjs bug detection. Sibling work, not in scope here.
- **Sonarjs `strict` or `all` configs**: this plan targets `recommended` only. Upgrading to `strict` is a follow-up plan once `recommended` is stable.
