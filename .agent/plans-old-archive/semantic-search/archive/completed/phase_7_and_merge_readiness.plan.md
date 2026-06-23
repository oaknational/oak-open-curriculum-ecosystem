---
name: Phase 7 and Merge Readiness
overview: Consolidate uncommitted session work, execute Phase 7 (the final merge blocker), and prepare for branch merge. Phase 7 covers the full quality gate chain, determinism verification, and final specialist reviews. NOTE: F16 drift check was implemented then removed — redundant with pnpm check clean+build flow.
todos:
  - id: consolidation-check
    content: Run consolidation check per /jc-consolidate-docs — verify no documentation trapped in plans, check experience files for matured patterns
    status: completed
  - id: commit-prior-work
    content: Commit ~40 uncommitted files from previous sessions in 2-3 logical commits (future plans reorg, doc updates, generated files)
    status: completed
  - id: quality-gate-chain
    content: Run full 12-gate quality chain from clean, capturing evidence of each gate passing
    status: completed
  - id: determinism-verification
    content: Re-run pnpm sdk-codegen and verify zero diff in generated directories
    status: completed
  - id: ci-drift-check
    content: "Implement F16: create scripts/check-generated-drift.sh — implemented then removed (redundant with pnpm check)"
    status: completed
  - id: specialist-reviews
    content: Invoke 8 specialist reviewers (code, 4x architecture, config, test, release-readiness) for final sign-off
    status: completed
  - id: address-findings
    content: Fix any blocking findings from specialist reviews
    status: completed
  - id: archive-plan
    content: Archive canonical plan, update prompt and roadmap, extract remaining permanent knowledge
    status: completed
isProject: false
---

# Phase 7 Execution and Merge Readiness

## Current State

- **Branch**: `feat/semantic_search_deployment`
- **Merge blocker**: SDK workspace separation Phase 7 (Phases 0-6 complete)
- **Uncommitted work**: ~40 files from previous sessions (future plans reorg, user-experience stubs, documentation updates, generated file changes)

## Step 1: Consolidate and Commit Previous Session Work

There are ~40 uncommitted changes from prior sessions. These should be committed before Phase 7 to establish a clean baseline.

### 1a. Consolidation check (per `/jc-consolidate-docs`)

- Verify the plan at [sdk-workspace-separation.md](sdk-workspace-separation.md) has no documentation trapped in it that belongs in permanent locations (ADRs, READMEs). The Phase 6.7 documentation alignment step already handled this — confirm completeness.
- Verify [semantic-search.prompt.md](/.agent/prompts/semantic-search/semantic-search.prompt.md) status lines are accurate (Phases 0-6 complete, Phase 7 next).
- Check the 6 experience files from 2026-02-22 to 2026-02-24 for matured patterns that should move to `distilled.md` or permanent docs.
- Napkin is ~158 lines (no distillation needed). Distilled.md is ~363 lines (remaining content is high-signal; no aggressive pruning needed).

### 1b. Commit organisational changes

Group into 2-3 logical commits:

1. **Future plans boundary reorganisation** — the 28 modified files in `.agent/plans/semantic-search/future/` plus the new `09-evaluation-and-evidence/README.md` and `05-query-policy-and-sdk-contracts/paraphrase-policy-and-application.md`. Also includes the archived `typegen-vs-codegen-semantic-split.md`.
2. **Documentation and planning updates** — napkin, roadmap, high-level plan, prompt, ADR-117, codegen README, jc-plan command, user-experience stubs, deleted Cursor plan file.
3. **Generated file updates** — any codegen-generated changes in `packages/sdks/oak-sdk-codegen/src/` from Phase 6 renames.

### 1c. Review the `docs-deep-review-2026-02-25/` directory

New untracked directory at `.agent/plans/developer-experience/governance/docs-deep-review-2026-02-25/`. Determine whether this is temporary analysis (add to `.gitignore`) or should be committed.

---

## Step 2: Phase 7 — Quality Gates, Evidence, CI Hardening

This is the final execution phase of the merge-blocking plan.

### 2a. Full quality gate chain (evidence capture)

Run all 12 gates sequentially from repo root, capturing pass/fail evidence:

```bash
pnpm clean
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm format:root
pnpm markdownlint:root
pnpm subagents:check
pnpm lint:fix
pnpm test
pnpm test:e2e
pnpm test:ui
pnpm smoke:dev:stub
```

If any gate fails, fix the issue before proceeding. All gates must pass.

### 2b. Determinism verification

Re-run `pnpm sdk-codegen` without input changes and verify zero diff:

```bash
pnpm sdk-codegen
git diff --exit-code packages/sdks/oak-sdk-codegen/src/types/generated/
git diff --exit-code packages/sdks/oak-sdk-codegen/src/generated/
```

This proves generated output is deterministic.

### 2c. CI drift check (F16)

Add a generated-file drift check to CI. Two changes needed:

**New script** — `scripts/check-generated-drift.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail
pnpm sdk-codegen
if ! git diff --exit-code \
  packages/sdks/oak-sdk-codegen/src/types/generated/ \
  packages/sdks/oak-sdk-codegen/src/generated/; then
  echo "Generated files have drifted from committed versions."
  echo "Run 'pnpm sdk-codegen' locally and commit the changes."
  exit 1
fi
echo "Generated files are in sync."
```

**CI integration** — Add to [.github/workflows/ci.yml](/.github/workflows/ci.yml) as a new step or job. The existing CI runs `pnpm build` (which depends on `sdk-codegen` via Turbo), so the drift check should run after install but as a separate validation step. Per ADR-043, CI validates committed generated artefacts — this check ensures they match what the generator would produce.

**Root script** — Optionally add `"check:generated-drift"` to root `package.json` for local use.

### 2d. Final specialist reviews

Per the `invoke-code-reviewers` rule, invoke all relevant specialists for final sign-off:

- `code-reviewer` (gateway — recommend follow-on specialists)
- `architecture-reviewer-barney` (structural compliance of the complete split)
- `architecture-reviewer-fred` (ADR compliance, boundary discipline)
- `architecture-reviewer-betty` (cohesion, coupling, long-term cost)
- `architecture-reviewer-wilma` (resilience, failure modes, drift risk)
- `config-reviewer` (CI check configuration)
- `test-reviewer` (determinism verification)
- `release-readiness-reviewer` (merge go/no-go assessment)

Run in parallel batches of 4 (tool limit).

### 2e. Address any blocking findings

All reviewer findings are blocking. Fix before proceeding.

---

## Step 3: Final Consolidation and Merge Preparation

### 3a. Archive the canonical plan

- Move sdk-workspace-separation.md to archive/completed/ (done)
- Move the baseline JSON alongside it
- Update [semantic-search.prompt.md](/.agent/prompts/semantic-search/semantic-search.prompt.md) — mark SDK workspace separation complete, update "Next Execution Targets" to the next milestone item
- Update [roadmap.md](/.agent/plans/semantic-search/roadmap.md) — mark 3e as complete

### 3b. Extract any remaining permanent knowledge

Scan the archived plan for content that belongs in permanent locations. The plan was designed to be self-sufficient but may still contain implementation details worth preserving:

- The subpath export architecture table (plan section 8.2a) — verify it's captured in the codegen SDK README
- The reviewer findings registry (plan section 13) — historical record, fine to archive
- The reverse-dependency inventory (plan section 5) — historical, fine to archive

### 3c. Post-merge roadmap items

After the SDK workspace separation merge, the roadmap shows:

- **Secrets/PII sweep** — pre-public gate (check with user whether this is in scope now)
- **Merge branch** to main
- **Make repo public** — Milestone 0 completion

These are outside Phase 7 scope but worth confirming next priorities.

---

## Risk Assessment

- **Quality gate failures**: Generated files from Phase 6 renames may need a clean regeneration. Run `pnpm clean && pnpm sdk-codegen` first to ensure a fresh baseline.
- **CI drift check scope**: Must cover both `src/types/generated/` (API pipeline) and `src/generated/vocab/` (bulk pipeline) directories.
- **Reviewer bandwidth**: 8 specialist reviews may surface findings that require additional work. Budget time for remediation.
- **Uncommitted generated files**: The git status shows many modified generated files in `oak-sdk-codegen/` — these should be committed as part of Step 1 to avoid confusion during Phase 7's determinism check.
