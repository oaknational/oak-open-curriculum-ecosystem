---
name: "Retire .agent/commands/ surface"
overview: "Complete the doctrinal retirement of .agent/commands/ per PDR-051 + ADR-125 §2026-05-09; subsume command content into skill canonicals; refactor active validators and runtime probes; update permanent docs."
status: 🟡 PLANNING
todos:
  - id: commit-1-validator-and-probe
    content: "Commit 1: Refactor validate-portability.ts + health-probe-{shared,parity}.ts to be commands-agnostic; fix pre-existing SKILL.md→SKILL-CANONICAL.md drift; address skills-lock + .claude/settings.json failures; update validate-fitness-vocabulary fixture."
    status: pending
  - id: commit-2-inline-and-delete
    content: "Commit 2: Inline 6 substantive commands into Item 1 canonicals + chatgpt-report-normalisation; create ephemeral-to-permanent-homing skill; fix metacognition canonical; delete 12 .agent/commands/*.md + experiments/; delete 20 vendor command adapters; fix finishing-branch cross-refs."
    status: pending
  - id: commit-3-permanent-docs
    content: "Commit 3: Update 5 ADRs (historical-vs-normative discipline) + 15 live docs (orientation, practice-index, practice-bootstrap, practice.md, practice-core CHANGELOG, codex/state/prompts/templates READMEs, no-warning-toleration rule, foundation doc)."
    status: pending
  - id: reviewer-dispatch
    content: "Post-landing reviewer dispatch: code-reviewer + architecture-reviewer-fred + docs-adr-reviewer + test-reviewer + config-reviewer."
    status: pending
  - id: follow-ups-tracked
    content: "Tracked follow-ups from plan-time code-reviewer pass: (1) two-validator contract documentation, (2) live-plan + memory drift sweep (~50 references), (3) ADR-125 historical-vs-normative paragraph distinction, (4) verify exhaustiveness of grep before final commit."
    status: pending
---

# Retire .agent/commands/ surface

**Last Updated**: 2026-05-10
**Status**: 🟡 PLANNING
**Scope**: Complete doctrinal retirement of `.agent/commands/` per PDR-051 + ADR-125 §2026-05-09 amendment.

---

## Context

PDR-051 + ADR-125 §2026-05-09 amendment retire `.agent/commands/` ("custom command surfaces retired; canonical commands subsumed into skills as the unified user-and-model-invokable workflow surface"). Wave 2 Item 1 (commit `fae57312`, 2026-05-10) created six SKILL-CANONICAL.md files for the six adapter-only skills, but landed them as **thin pointers to `.agent/commands/<id>.md`** rather than inlining the substantive content. This perpetuates the very surface the doctrine retires.

The architecture-reviewer-fred plan-time observation (post-fae57312): "PDR-051/ADR-125 retire `.agent/commands/`, but `.agent/commands/` still exists with live content. Doctrine/state mismatch." Originally flagged as out-of-scope per the brief; owner has since reframed as in-scope.

Plan-time code-reviewer dispatch surfaced five critical issues that shape this plan; see Reviewer Findings below.

### Issue 1: Validator + runtime probe still treat `.agent/commands/` as canonical

`scripts/validate-portability.ts` enumerates `.agent/commands/*.md` as the canonical command set and validates `.cursor/commands/`, `.claude/commands/`, `.gemini/commands/`, `.agents/skills/` adapters against it. `agent-tools/src/core/health-probe-shared.ts` exports `listCanonicalCommandNames` + `CURSOR/CLAUDE/GEMINI_COMMANDS_DIR`; `health-probe-parity.ts` runs `evaluateCommandAdapterParity` as a live runtime check.

**Evidence**: `pnpm portability:check` currently fails on this branch with pre-existing issues unrelated to this plan (see Issue 2). The health probe `command-adapter-parity` check is wired into `evaluateAgentInfrastructureHealth` and reports parity failures whenever the canonical command set drifts.

**Root Cause**: Wave 1 retired `.cursor/skills + .agents/skills` as canonical surfaces and renamed `.agent/skills/<id>/SKILL.md` → `SKILL-CANONICAL.md`, but the validators were not updated to match. The validator was already drifted before this plan started; the retirement of `.agent/commands/` deepens the drift.

**Existing Capabilities**: `pnpm skills:check` (the new skills-adapter generator's `--check` mode) correctly validates skill canonicals against generated adapters. Two validators with diverging contracts.

### Issue 2: Pre-existing portability validator failures

`pnpm portability:check` already fails with two pre-existing issue families:

1. **`skills-lock.json` drift** — references locked skills (`create-mcp-app`, `migrate-oai-app`) missing under `.cursor/skills/`, `.agents/skills/`, `.claude/skills/`. Wave 1 retired some of those surfaces.
2. **`.claude/settings.json` permission drift** — ~30 `Skill(jc-*)` permission entries missing for adapters that already exist.
3. **Validator filename drift** — Lines 247, 264 of `validate-portability.ts` look for `SKILL.md` but Wave 1 renamed to `SKILL-CANONICAL.md`. Check 4 (classification frontmatter) silently passes for all 43 skills via the existence guard.

**Evidence**: Direct CLI output from `pnpm portability:check` on branch `feat/mcp-graph-support-foundation` at HEAD `fae57312`.

**Root Cause**: Same as Issue 1 — Wave 1 changes were not propagated to all dependent validators.

**Per code-reviewer plan-time review**: "no-warning-toleration" + "ground-state-before-planning" standing rules require fixing these pre-existing failures in the same commit as the validator refactor, not deferring.

### Issue 3: 12 `.agent/commands/*.md` files contain substantive content

| File | Lines | Disposition |
|---|---|---|
| consolidate-docs.md | 582 | Inline into `.agent/skills/consolidate-docs/SKILL-CANONICAL.md` |
| gates.md | 64 | Inline into `.agent/skills/gates/SKILL-CANONICAL.md` |
| plan.md | 154 | Inline into `.agent/skills/plan/SKILL-CANONICAL.md` |
| review.md | 96 | Inline into `.agent/skills/review/SKILL-CANONICAL.md` |
| session-handoff.md | 438 | Inline into `.agent/skills/session-handoff/SKILL-CANONICAL.md` |
| chatgpt-report-normalisation.md | 46 | **Inline** (NOT delete-only — code-reviewer caught misclassification; canonical lacks PUA character table + positional mapping rule + output contract) |
| metacognition.md | 3 | Fix `.agent/skills/metacognition/SKILL-CANONICAL.md` to point at `.agent/directives/metacognition.md` directly; delete commands file |
| ephemeral-to-permanent-homing.md | 130 | Create new `.agent/skills/ephemeral-to-permanent-homing/SKILL-CANONICAL.md` (classification: passive); update referrers |
| go.md | 3 | Already-thin pointer; canonical already authoritative; delete commands file |
| start-right-quick.md | 3 | Already-thin pointer; canonical already authoritative; delete commands file |
| start-right-thorough.md | 3 | Already-thin pointer; canonical already authoritative; delete commands file |
| experience.md | 5 | Marked superseded; delete |

Plus `.agent/commands/experiments/` (collaborate.md, step-back.md, think.md) — owner-decision: **delete as stale** (owner-confirmed in plan-time question).

### Issue 4: Vendor command adapters still live

`.cursor/commands/jc-{10}.md` and `.gemini/commands/jc-{10}.toml` are hand-mirrored adapters pointing at `.agent/commands/<id>.md`. Per ADR-125 §2026-05-09, these are retired surfaces. Owner-locked decision to delete (Wave 2 Item 1 brief).

### Issue 5: 5 ADRs + ~15 live docs reference `.agent/commands/`

Permanent docs: ADR-119, ADR-125, ADR-131, ADR-144, ADR-165, `docs/foundation/agentic-engineering-system.md`.
Live docs: `.agent/directives/orientation.md`, `.agent/practice-index.md`, `.agent/practice-core/{practice-bootstrap,practice,CHANGELOG}.md`, `.codex/README.md`, `.agent/state/README.md`, `.agent/prompts/README.md`, `.agent/plans/templates/README.md`, `.agent/plans/templates/collection-roadmap-template.md`, `.agent/rules/no-warning-toleration.md`, `.agent/skills/finishing-branch/SKILL-CANONICAL.md`.

ADR text requires careful **historical-vs-normative** discipline: do not rewrite paragraphs that record the decision's context; update only forward-looking guidance.

### Issue 6: ~50 references in active plans + memory

`.agent/plans/*/{current,active,future}/*.md` and `.agent/memory/{active,executive,operational}/*.md` contain references to `.agent/commands/<id>.md`. Most are descriptive prose, not load-bearing.

**Disposition**: Track as **documentation drift** rather than fix in this plan. Surface to `pending-graduations.md` as a follow-up workstream. Live plans and memory will still convey intent if read; the references just no longer click through. Updating them is high-cost / low-value.

### Issue 7: Two-validator contract not documented

`validate-portability.ts` and `pnpm skills:check` (skills-adapter generator's `--check`) have diverging contracts and overlapping responsibilities. Code-reviewer plan-time follow-up: document or consolidate.

**Disposition**: Track as follow-up; out of scope for this plan.

---

## Quality Gate Strategy

**Critical**: After each commit:

```bash
pnpm portability:check          # MUST pass; pre-existing failures fixed in Commit 1
pnpm skills:check               # MUST pass; verify no adapter regression
pnpm test --filter @oaknational/agent-tools  # health-probe + adapter generator tests
pnpm type-check                 # full monorepo
pnpm lint:fix                   # full monorepo
pnpm format:root
pnpm markdownlint:root
```

After Commit 1 specifically: `pnpm portability:check` must transition from currently-failing to passing.

---

## Phases

### Commit 1: Validator + runtime probe + pre-existing drift

**Order**: This commit lands FIRST so the gate is never red on a committed state (per code-reviewer plan-time review §4).

**Files**:

- `scripts/validate-portability.ts`
  - Remove Check 1 (Command adapter → canonical exists) — commands retired
  - Remove Check 2 (Cross-platform command count consistency) — commands retired
  - Fix Check 3b line 247: `SKILL.md` → `SKILL-CANONICAL.md`
  - Fix Check 4 line 264: `SKILL.md` → `SKILL-CANONICAL.md`
  - Update Check 6: drop canonical commands branch; keep canonical skills orphan detection
  - Fix Check 9b lines 421, 427: `SKILL.md` → `SKILL-CANONICAL.md`
  - Fix Check 9b: drop `.cursor/skills` from `skillAdapterPlatforms` (retired surface)
  - Fix Check 12 line 500: stop reading `.claude/commands` (retired); read `.claude/skills/jc-*` instead
  - Update `stats` line 521: drop canonical commands count
- `agent-tools/src/core/health-probe-shared.ts`
  - Remove `COMMANDS_DIR`, `CURSOR_COMMANDS_DIR`, `CLAUDE_COMMANDS_DIR`, `GEMINI_COMMANDS_DIR`
  - Remove `listCanonicalCommandNames`, `listCommandAdapterNames`, `listPortableCommandAdapterNames`
  - Remove `SUPERSEDED_COMMANDS`
- `agent-tools/src/core/health-probe-parity.ts`
  - Delete `evaluateCommandAdapterParity`, `collectCommandAdapterParityDetails`
  - Update `evaluateParityChecks` return list (drop command-adapter-parity)
- `agent-tools/src/core/health-probe-continuity-state.ts`, `health-probe-hook-state.ts`, `health-probe-state.ts`
  - Update imports if they referenced removed exports
- `scripts/validate-fitness-vocabulary.unit.test.ts` line 43
  - Update fixture path: `.agent/commands/consolidate-docs.md` → `.agent/skills/consolidate-docs/SKILL-CANONICAL.md`
- `.claude/settings.json`
  - Add 30 missing `Skill(jc-*)` + `Skill(jc-*:*)` permission entries
- `skills-lock.json`
  - No content change required (validator stops checking retired `.cursor/skills`)

**Acceptance**:

- `pnpm portability:check` exits 0
- `pnpm skills:check` still exits 0
- `pnpm test --filter @oaknational/agent-tools` passes (health-probe tests)
- `pnpm type-check` passes monorepo-wide
- No new lint/format issues

### Commit 2: Inline + delete

**Files** (new content):

- `.agent/skills/consolidate-docs/SKILL-CANONICAL.md` — inline 582 lines
- `.agent/skills/gates/SKILL-CANONICAL.md` — inline 64 lines
- `.agent/skills/plan/SKILL-CANONICAL.md` — inline 154 lines
- `.agent/skills/review/SKILL-CANONICAL.md` — inline 96 lines
- `.agent/skills/session-handoff/SKILL-CANONICAL.md` — inline 438 lines
- `.agent/skills/chatgpt-report-normalisation/SKILL-CANONICAL.md` — merge 46 substantive lines (PUA table, positional mapping, output contract) into existing canonical
- `.agent/skills/metacognition/SKILL-CANONICAL.md` — body points at `.agent/directives/metacognition.md` directly
- `.agent/skills/ephemeral-to-permanent-homing/SKILL-CANONICAL.md` — new (classification: passive); inline 130 lines
- `.agent/skills/finishing-branch/SKILL-CANONICAL.md` — fix two stale cross-refs (`.agent/commands/gates.md` + `.agent/skills/commit/SKILL.md`)
- `.agent/skills/{consolidate-docs,session-handoff}/SKILL-CANONICAL.md` — update body references to `.agent/skills/ephemeral-to-permanent-homing/SKILL-CANONICAL.md`

**Files** (deletions):

- `.agent/commands/{chatgpt-report-normalisation,consolidate-docs,ephemeral-to-permanent-homing,experience,gates,go,metacognition,plan,review,session-handoff,start-right-quick,start-right-thorough}.md` (12)
- `.agent/commands/experiments/{collaborate,step-back,think}.md` (3) — owner-confirmed delete
- `.cursor/commands/jc-{chatgpt-report-normalisation,consolidate-docs,gates,go,metacognition,plan,review,session-handoff,start-right-quick,start-right-thorough}.md` (10)
- `.gemini/commands/jc-{chatgpt-report-normalisation,consolidate-docs,gates,go,metacognition,plan,review,session-handoff,start-right-quick,start-right-thorough}.toml` (10) — keep `review-*.toml` (5 files, unrelated)
- Resulting empty `.agent/commands/` directory removed

**Acceptance**:

- `pnpm portability:check` exits 0
- `pnpm skills:check` exits 0
- `find .agent/commands -type f` returns nothing
- `find .cursor/commands .gemini/commands -name "jc-*"` returns nothing
- All tests pass

### Commit 3: Permanent docs + live docs

**ADRs (5)** — historical-vs-normative discipline:

- `docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
- `docs/architecture/architectural-decisions/125-agent-artefact-portability.md` — DO NOT rewrite the §2026-05-09 amendment paragraphs; only update forward-looking guidance prose
- `docs/architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md`
- `docs/architecture/architectural-decisions/144-two-threshold-fitness-model.md`
- `docs/architecture/architectural-decisions/165-agent-work-practice-phenotype-boundary.md`

**Live docs (~10)**:

- `.agent/directives/orientation.md`
- `.agent/practice-index.md`
- `.agent/practice-core/practice-bootstrap.md`
- `.agent/practice-core/practice.md`
- `.agent/practice-core/CHANGELOG.md`
- `.codex/README.md`
- `.agent/state/README.md`
- `.agent/prompts/README.md`
- `.agent/plans/templates/README.md`
- `.agent/plans/templates/collection-roadmap-template.md`
- `.agent/rules/no-warning-toleration.md`
- `docs/foundation/agentic-engineering-system.md`

**Acceptance**:

- `pnpm markdownlint:root` clean
- ADR text reads coherently — no orphan references, no broken historical context
- `grep -rn "\.agent/commands/" .agent/directives .agent/practice-core .agent/practice-index.md .codex .agent/state .agent/prompts .agent/plans/templates .agent/rules docs/` returns nothing or only intentional historical references (test fixtures, archived ADR amendment text)

---

## Reviewer Dispatch (post-landing)

Per code-reviewer plan-time review §"Specialist Coverage":

| Specialist | Required | Reason |
|---|---|---|
| `code-reviewer` | Yes — gateway | Standard post-change review |
| `architecture-reviewer-fred` | Yes — mandatory | Doctrine boundary cure (PDR-051 + ADR-125 amendment); his prior WARN cures here |
| `docs-adr-reviewer` | Yes — mandatory | 5 ADRs + ~10 live docs touched; permanent docs with historical-vs-normative distinction |
| `test-reviewer` | Yes — focused | `validate-fitness-vocabulary.unit.test.ts` fixture update; TDD evidence for any validator behaviour changes |
| `config-reviewer` | Yes — focused | `validate-portability.ts` is a quality gate; line 247/264 fixes change gate correctness semantics |

---

## Reviewer Findings (Plan-Time)

Code-reviewer dispatch on this plan returned APPROVED WITH SUGGESTIONS. Five critical findings:

1. **`chatgpt-report-normalisation.md` was misclassified** as already-thin pointer; actually contains 45 lines of substantive content (PUA character table, positional mapping rule, output contract). Reclassified to Group A (inline) above.
2. **Commit ordering reversed** — validator refactor lands FIRST so the gate is never red on a committed state.
3. **Pre-existing failures fixed in Commit 1** — no-warning-toleration + ground-state-before-planning rules require it.
4. **`experiments/` decision required** before Commit 2 — owner-confirmed delete.
5. **finishing-branch SKILL-CANONICAL.md cross-refs** assigned to Commit 2.

Plus four tracked follow-ups (see todo `follow-ups-tracked`).

---

## Tracked Follow-Ups

1. Two-validator contract documentation: `validate-portability.ts` vs `pnpm skills:check` have overlapping responsibilities. Either consolidate or document boundary.
2. Live-plan + memory drift sweep: ~50 references in `.agent/plans/*/{current,active,future}/*.md` and `.agent/memory/*` to `.agent/commands/<id>.md`. Tracked as documentation drift; not load-bearing.
3. ADR-125 §2026-05-09 amendment: protect historical paragraph distinction during Commit 3.
4. Wave 2 Items 3–6 still pending: lock.ts wiring, rendering.ts extraction, parseFlags strict, clearGeneratedAdapters tests. Independent of this plan; queue separately.

---

## Foundation Alignment

- `principles.md` — architectural correctness over short-term expediency
- `testing-strategy.md` — Commit 1 validator changes need TDD pairing where logic changes
- `schema-first-execution.md` — N/A (no schema changes)

---

## Non-goals

- Refactoring the two-validator contract (tracked follow-up)
- Updating ~50 references in live plans + memory (tracked follow-up — documentation drift)
- Wave 2 Items 3–6 (separate workstream)

---

## Risk Assessment

| Risk | Mitigation |
|---|---|
| Commit 1 health-probe changes break `pnpm health-probe` for other agents mid-flight | Run health probe before/after; verify no other parity check regresses |
| ADR text edits accidentally rewrite history (Commit 3) | docs-adr-reviewer specifically briefed on historical-vs-normative; show diff before commit |
| Inline of 582-line consolidate-docs into canonical hits markdown lint or generator-format expectations | Run `pnpm markdownlint:root` + `pnpm skills:check` after each inline; canonical body length is unbounded by generator |
| `.claude/settings.json` permission additions cause unintended permission grants | Only add `Skill()` and `Skill(:*)` for adapters that already exist; review diff carefully |

---

## Learning Loop

After Commit 3 lands and reviewers approve:

- Run `/jc-consolidate-docs` to extract any new patterns surfaced (e.g. "validator-runtime-probe-coupling-after-canonicalisation")
- Update `.agent/practice-index.md` if doctrine changed
- Move this plan to `archive/completed/` after final reviewer sign-off
