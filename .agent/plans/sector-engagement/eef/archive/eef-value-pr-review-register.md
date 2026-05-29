# EEF Value-PR — Review Findings Register

Owner-directed (2026-05-27): every issue identified by the pre-execution review
pass (code-expert, assumptions-expert, architecture-expert barney/betty/fred/wilma)
and the live comms+worktree observer must have a remediation plan and an owner.
Drafted by Starless (13c7d5); ownership of Galactic-routed items pending Galactic
confirmation on the sidebar.

**Value-PR commit sequence (owner-approved fold-in):** (1) type relocation ·
(2) EefStrandsGraphView adapter · (3) loader + freshness · (4) tool + wire-up + tests.

| # | Issue | Source | Sev | Remediation | Owner | Where | Status |
|---|-------|--------|-----|-------------|-------|-------|--------|
| A | WS4.5 `EefStrandsGraphView` adapter does not exist; plan §"What has LANDED" wrongly marks it landed | assumptions / code / wilma | 🔴 High | Build adapter (subgraph + manifest + 5 `NotImplementedYet` stubs) as value-PR commit 2; correct plan Phase 1 + reshape banner (3→4 commits) | Starless (adapter) · Galactic (plan doc) | commit 2 · plan | Open |
| B | Re-exporting 13 corpus types through `public/evidence-corpus.ts` is accidental complexity (no consumer; only-SDK-published, npmPublish:false elsewhere) | barney / betty (fred dissent, adjudicated) | Med | Narrow `public/evidence-corpus.ts` to telemetry re-export only; do NOT add `graph-corpus-sdk` dep yet | Starless | commit 1 | Open |
| C | Phase-union divergence: `RankOptions.context.phase`=`primary\|secondary` vs `ExploreSpanAttrs.phase` adds `early_years`; doc falsely claims they match; `early_years` is a real EEF phase the prompt uses | wilma / betty | Med | Decide canonical corpus phase set; reconcile unions (prefer structural derivation). NOT in commit 1 (pure relocation) — resolve at loader (commit 3) where the strand schema defines phases | Starless (needs phase-set decision) | commit 3 | Open |
| D | `eef-toolkit.json` snapshot lives under `.agent/plans/...`, not in SDK source; loader needs it co-located | assumptions | Med | Place canonical snapshot in `graph-corpus-sdk/src/eef-strands/` (ADR-173:50 loader-in-graph-corpus-sdk); freshness:check imports from there | Starless | commit 3 | Open |
| E | Three stale docstrings: `public/evidence-corpus.ts` @packageDocumentation; `eef-strands/index.ts` "ships empty"/placeholder; `telemetry.ts` prose pointer to `evidence-corpus/types.ts` | code / fred / wilma | Low | Update docstrings in commit 1 for files commit 1 edits; minimal `telemetry.ts` prose-pointer fix | Starless | commit 1 | Open |
| F | `EefStrand` skeleton (documented-for-deletion at t2) exported from the public subpath implies stability | fred | Low | Mark `@internal` in barrel where feasible (note: `ExplainOptions` references it concretely, so full hiding is constrained); skeleton replaced by `z.infer` at commit 3 | Starless | commit 1 barrel + commit 3 | Open |
| G | No ESLint rule structurally enforces one-way direction (prevents `graph-corpus-sdk → curriculum-sdk`) | barney / fred / wilma | Low | Add explicit import restriction to `graph-corpus-sdk` eslint config (hardening; pre-existing gap) | **Galactic? (touches packages/core/oak-eslint)** — propose Starless folds into commit 2 when adapter lands | commit 2 or hardening follow-up | Needs owner confirm |
| H | Build-order race: stale `graph-corpus-sdk` dist could break incremental build (mitigated by `development` tsconfig condition) | wilma | Low | `pnpm clean` graph-corpus-sdk + cold full build before opening PR; document | Starless | pre-PR verify | Open |
| I | `./mcp/*` export wildcard advertises the deleted `types.ts` path (no current consumer) | wilma | Low | Verify no internal ref after deletion; re-check when tool lands under `mcp/` | Starless | commit 1 verify · commit 4 | Open |
| J | Verify `EefStrand` skeleton `{id,name,slug}` stays a subtype of the `z.infer` output (no breaking type change at commit 3) | wilma / betty | Med | type-expert review of assignability at the skeleton→z.infer replacement | Galactic (in-cycle type-expert) | commit 3 review | Needs owner confirm |
| K | Plan-body staleness: `ExplainError` listed but doesn't exist; `types.ts:64-219` line range off-by-7 (13 types is correct) | code | Low | Correct plan body | Galactic (plan doc) | plan | Needs owner confirm |
| M | `freshness.ts` + `citation-shape.ts` mishoused under `mcp/` (corpus-governance/domain logic) | betty | Low | Assess relocating to `graph-corpus-sdk/eef-strands/` at loader commit, or flag as post-PR curation | Starless (assess) | commit 3 or follow-up | Open |
| N | Durable archive gap: canonical sidebar transcript missing turns 7–11; multi-compaction sidebars need re-persistence | watcher | Med | Re-persist sidebar to `.agent/state/collaboration/sidebars/` now (turns 7–11); propose per-compaction persistence trigger | Starless (re-persist) · owner/curation (trigger) | now + practice | Open |
| O | `comms` CLI run from a worktree resolves the stale worktree `.agent/state` snapshot | watcher | Med | Operational guardrail: run comms CLI only from shared primary checkout / `--repo-root`; consider CLI detect-and-warn fix | both (discipline now) · Galactic? (agent-tools CLI fix) | now + agent-tools follow-up | Needs owner confirm |

**Guardrails / non-issues (recorded, no remediation):**

- Telemetry types correctly STAY in `oak-curriculum-sdk` (betty/fred) — a constraint, not a fix.
- Direction `oak-curriculum-sdk → graph-corpus-sdk` is ADR-179-sanctioned; no circular dep; 13 types are all genuine substrate (verified) — relocation is sound.

**Graduation candidate (not a remediation item):**

- PDR-082 n=2 mode: today's 97.1% ceremony rate is strong evidence to advance Proposed→Adopted (watcher). Route to owner/curation.

## Status updates (2026-05-27)

- **A (plan doc) — DONE** by Galactic: Phase 1 §"What has LANDED" corrected (WS4.5 not landed), reshape banner now 4 commits.
- **K (plan doc) — DONE** by Galactic: ExplainError removed, line range fixed 64→226.
- **J — owner-confirmed Galactic** (in-cycle type-expert review at commit 3).
- **G — owner-confirmed Starless**, folds into commit 2 (graph-corpus-sdk eslint/depcruise direction rule).
- **O — owner-confirmed Galactic** (agent-tools comms-CLI detect-and-warn fix; separate follow-on, flagged to owner — NOT in the cure-PR).
- **B + E — IMPLEMENTED in commit 1** (verified green: type-check/lint/test on both packages); awaiting Galactic in-cycle fred/type review before the commit lands.
- **F — partial in commit 1**: `EefStrand` skeleton remains exported (it's referenced concretely by `ExplainOptions`, so full hiding isn't feasible); its own TSDoc documents the t2 z.infer replacement. Full resolution at commit 3 (replacement).
- **N — re-persist DONE** (sidebar turns 7–14 captured to starless-backup); per-compaction trigger still a practice item for owner/curation.
- **All register items now have a confirmed owner + remediation** — owner directive satisfied.

### New finding (worktree effectiveness — for observer record)

- Fresh worktree requires building workspace dep `dist/` BEFORE lint/test pass (eslint-plugin-standards → 74 `import-x/no-unresolved` from unbuilt sdk-codegen/result/type-helpers). `type-check` works without builds via the `development` tsconfig condition (→ `src/`). Worktree onboarding cost ≈ 3 build steps before gates are runnable. Owner: documented here + observer report; no code remediation (inherent to worktree model).

### Commit 1 landed (2026-05-27)

- **Commit `52972ad6`** `refactor(evidence-corpus): relocate EEF corpus types to graph-corpus-sdk` — full gate green (90 turbo tasks) + commit-msg gate green; both in-cycle reviewers APPROVED.
- **B — DONE** (narrowed re-export, no premature dep).
- **E — DONE** (docstrings: public/evidence-corpus + telemetry; eef-strands/index barrel doc).
- **F — partial DONE** (skeleton stays exported by necessity; t2 replacement at commit 3).
- **I — verified clean** at commit 1 (no internal ref to the deleted path; ./mcp/* wildcard re-check deferred to commit 4 when the tool lands).
- **Worktree commit-skill mapping gap (new finding):** the shared-tree commit_queue + git:index/head claim ceremony does not map onto worktree-isolated commits (own index/HEAD = no shared contention; CLI from worktree writes stale snapshot per item O). Auditability recorded via comms + register SHA instead. Flag for report/owner — worktree-model needs a defined commit-audit mechanism.
