---
title: TypeScript 6 Migration and Workspace-Script Architectural Rules
status: in-progress
branch: fix/build_issues
opened: 2026-04-29
last_updated: 2026-04-29
related_adrs: pending — Task #9 below (ADR-168, number to be re-verified before authoring)
related_napkin_sessions:
  - "2026-04-29 — TS6 migration myopia (Verdant Swaying Fern)"
  - "2026-04-29 — TS6 closeout (Verdant Regrowing Pollen)"
todos:
  - id: plan-promotion-and-discipline
    content: "Promote plan current/ → active/, add Execution Discipline section with structural anti-pattern guards, machine-readable YAML todos, update mutable cross-refs."
    status: in_progress
  - id: open-active-claim
    content: "Open active claim in collaboration state covering plan file, working-tree TS6 changes, ADR-168, and continuity-surface edits. Append session-open comms event."
    status: completed
  - id: pre-commit-auto-fix
    content: "Run pnpm format:root, pnpm lint:fix, pnpm markdownlint:root proactively to pre-empt hook firings. Re-verify type-check, build, test, knip green."
    status: pending
  - id: commit-1-deps
    content: "Commit 1: chore(deps): typescript ^5 → ^6 + lock refresh."
    status: pending
  - id: commit-2-ts6-compat
    content: "Commit 2: fix(build): TS6 rootDir + baseUrl + types compatibility."
    status: pending
  - id: commit-3-workspace-script-ban
    content: "Commit 3: refactor(arch): workspace-to-root-script ban + runtime-only-scripts directory."
    status: pending
  - id: commit-4-root-mjs-to-ts
    content: "Commit 4: chore(scripts): convert root .mjs scripts to TypeScript."
    status: pending
  - id: commit-5-tsconfig-audit
    content: "Commit 5: chore(config): tsconfig audit cleanups."
    status: pending
  - id: commit-6-knip-cleanup
    content: "Commit 6: chore(knip): clear unused exports + config cleanups."
    status: pending
  - id: adr-168-author
    content: "Verify ADR-168 number availability; author ADR-168 covering TS6 baseline + workspace-script-ban + all-TS-scripts with dedicated runtime-only-scripts directory exception. Invoke docs-adr-reviewer."
    status: pending
  - id: commit-7-adr-168
    content: "Commit 7: docs(adr): ADR-168 — TS6 + workspace-script architectural rules. Bundle plan-promotion + cross-ref updates if not already committed."
    status: pending
  - id: final-quality-gate-sweep
    content: "Run canonical QG sequence; sentinels TS5011/TS5101 must each return 0; invoke release-readiness-reviewer for explicit GO/GO-WITH-CONDITIONS/NO-GO."
    status: pending
---

# TypeScript 6 Migration and Workspace-Script Architectural Rules

## Execution Discipline (this session — Verdant Regrowing Pollen)

The previous session (Verdant Swaying Fern) accumulated five distinct
Surprises in a single arc, every one a different surface of the same
**myopia anti-pattern** (reviewer-as-prosthetic, confirmation-reading,
hook-as-obstacle, fitness-as-constraint, sed-bypass). The plan body
below already lists what to do; this section names the **structural
guards** that make the recurrence-failure expensive or impossible.

**Treat these as commitments, not warnings.** Reaching for a guarded
behaviour without naming it as a deliberate plan deviation is a
session-restart signal.

### Guard 1 — Pre-commit auto-fix pass before the first commit attempt

Run, in this order, **before** staging anything for Commit 1:

```bash
pnpm format:root
pnpm lint:fix
pnpm markdownlint:root
```

**Why**: hooks firing during commit are *information events* about
working-tree state. Pre-emptively running auto-fixers turns "hook fires,
agent fights it" into "hook reports clean, commit lands". Surprise 3
(hook-as-obstacle) was the prior session's third strike on a single
commit attempt; the three-hook-stop rule applies here.

### Guard 2 — Per-commit re-verification

After each of Commits 1–6, before staging the next group:

```bash
pnpm type-check
pnpm test
pnpm knip
```

**Why**: green-state should be a checkpoint, not a session-end discovery.
This catches regression at the smallest possible blast radius (one
commit's diff) instead of at the end-of-session sweep where attribution
is harder.

### Guard 3 — No `sed` for individual-file replacements

This session does not use `sed` as a fallback when `Edit` returns
"File has not been read yet." The only correct response is `Read` then
`Edit`. `sed` remains legitimate **only** for genuinely-bulk
content-addressed replacements (tens of files with the same exact
string) where Read-per-file would dominate the work.

**Why**: Surprise 5 named `sed`-as-Edit-bypass as the third instance
of the broader "tool-error → find-bypass" anti-pattern. Sed acts on
whatever the file contains *now*, blind. The Read-then-Edit contract
exists because parallel hooks/processes/agents may have changed the
file since the last view.

### Guard 4 — Verify ADR number availability before authoring

Before writing ADR-168:

```bash
ls docs/architecture/architectural-decisions/168*.md   # must not exist
ls docs/architecture/architectural-decisions/ | tail -5  # confirm latest
```

**Why**: the handoff says the next available number is 168 because
ADR-167 was authored in parallel (Ethereal Illuminating Comet, hook
visibility). Another parallel session could have moved the index again.
This is a 5-second check that prevents a guaranteed-conflict reroll.

### Guard 5 — Insight capture at each commit boundary

After each commit, append (not compress) any new observation into the
napkin file. Surprise 4 named "fitness-as-constraint" — the napkin
fitness signal asks for *consolidation*, not *insight compression*.
If a session-end observation runs to thirty lines and the napkin is
over its target, write the full observation and flag the file.

**Why**: capture is sacred. The whole purpose of the napkin → distilled
flow is durable cross-session learning; truncating in the moment
destroys exactly the artefact that enables future-session recovery
from the same anti-patterns.

### Guard 6 — Read for exploration before confirmation

When reviewing the staged diff prior to each commit: the **first pass**
is "what is this telling me?" — only the second pass should be "is
this what I expected?" Surprise 2 (confirmation-reading) saw the
prior session read past
`"build": "node ../../scripts/run-tsx-development.mjs ..."` as a
workspace-to-root-script architectural smell because it was scanning
for "is this the typescript bump?" and not for "what is this telling
me about the codebase?"

**Why**: each commit's diff is a free-of-charge architectural review
opportunity. Skipping the exploration pass means smells go unflagged.

---

## Context

The repository upgraded `typescript` from `^5` to `^6` in every
workspace. The first `pnpm build` failed with **TS5011** (implicit
`rootDir`). A grounded re-run of `pnpm build` and `pnpm type-check`
revealed the broader TS6 failure surface: **TS5011** (rootDir),
**TS5101** (`baseUrl` deprecation across 22 tsconfigs), **TS6's
empty `types: []` default** (every package needed
`"types": ["node"]` to resolve `URL`, `URLSearchParams`, `node:fs`,
`node:path`, `import.meta.url`), the widget's CSS side-effect import
needing a `vite/client` declaration, and `agent-tools`' `vitest.config.ts`
hitting **TS6059** because TS6 changed `rootDir` inference behaviour
when `outDir` is set with `noEmit: true`.

Reading the staged diff carefully also surfaced an architectural smell
the owner had already named separately: workspace `package.json` files
calling scripts from the repo root via `node ../../scripts/...`,
violating pnpm workspace boundaries.

The owner directed (2026-04-29):

1. **Fix all issues in this branch — nothing is deferred.** Foundational
   work; no follow-up branches.
2. **Workspaces must not call scripts from the repo root.**
3. **All workspace scripts must be TypeScript**, invoked via
   `pnpm exec tsx` (strongly preferred) or built. The only legitimate
   exception is no-compile-no-deps scripts (e.g. Vercel `ignoreCommand`
   running before `pnpm install`), which must live in a **dedicated
   per-workspace directory** named to make the special case visible.
4. **The vercel-ignore script cannot have a build step or external
   dependencies** — it stays as committed `.mjs` runtime-pure JS in
   the dedicated directory.
5. **Capture insights properly** so future sessions and the repo
   continuity learn from them. Fitness budgets are advisory, never a
   constraint on capture.
6. The root `scripts/` directory is under review for whether to ban
   root-level scripts entirely (decision pending).

## Status — Tasks #1–#8 complete, #9 and #10 pending

The session-local task tracker (TaskList) holds the current state.
Below mirrors that for cross-session continuity.

### Done (and verified by green build + type-check + tests + knip)

1. ✅ Removed `baseUrl` from `tsconfig.base.json` and 21 redundant
   per-workspace re-declarations.
2. ✅ Triaged post-baseUrl failures and added `"types": ["node"]`
   globally; created `widget/src/vite-env.d.ts`; removed the unused
   `outDir` from `agent-tools/tsconfig.json` and added `outDir: "dist"`
   to `agent-tools/tsconfig.build.json` (the build had been emitting
   `.js` artefacts into `src/` after my Task #2 edit; cleaned the
   leaked artefacts and verified emit returns to `dist/`).
3. ✅ Moved the vercel-ignore trio to
   `apps/oak-curriculum-mcp-streamable-http/runtime-only-scripts/`
   with a README documenting the no-compile-no-deps constraint.
   Updated `vercel.json`, the e2e test import, the canonical
   `semver.ts` TSDoc, the `semver-parity.test.ts` TSDoc, and active
   docs (operations runbook, ADR-163, app docs).
4. ✅ Eliminated workspace-to-root-script coupling: replaced
   `node ../../scripts/run-tsx-development.mjs` with
   `pnpm exec tsx` across MCP app (16 invocations), oak-search-cli
   (12+), and oak-design-tokens (1). Replaced
   `node ../../scripts/validate-root-application-version.mjs` with a
   new TypeScript script at
   `apps/oak-search-cli/scripts/validate-application-version.ts`
   that imports `isValidSemver` from `@oaknational/build-metadata`.
5. ✅ Audited root `scripts/`: deleted the now-unused
   `run-tsx-development.mjs` and `validate-root-application-version.mjs`;
   converted 11 remaining `.mjs` to `.ts`; updated all root
   `package.json` script invocations to `pnpm exec tsx`; updated
   `.claude/settings.json` hook commands; updated active ADR/doc
   references.
6. ✅ Converted MCP app's three workspace `.js` scripts
   (`server-harness`, `run-requests`, `embed-widget-html`) to TypeScript
   with proper types, error narrowing, and module declarations.
7. ✅ Resolved pre-existing tsconfig audit findings: deleted orphan
   `tsconfig.eslint-rules.json` and removed its include from root
   `tsconfig.json`; `oak-eslint`'s type-check standardised to
   `tsc -p tsconfig.lint.json --noEmit` and a new lint config created;
   `oak-eslint`'s build aligned with the repo pattern
   (`tsup && tsc --emitDeclarationOnly --project tsconfig.build.json`)
   with `dts: false` in the tsup config; added `test-cache` to
   `oak-sdk-codegen/tsconfig.build.json` exclude; added
   `emitDeclarationOnly: true` to `design-tokens-core/tsconfig.build.json`.
8. ✅ Resolved knip's 37 unused exported types: bulk-removed the
   `export` keyword from declarations and dropped unused barrel re-
   exports (`ApplicationVersionSource`/`GitShaSource`/`ConfigError`/
   `Phase`/`ExpectedRelevance`/`IndexOperationCounts`); resolved 12
   stale `.mjs` import references in test files (the `.mjs` → `.ts`
   rename broke them); updated `knip.config.ts` to drop now-empty
   patterns (`build-scripts/**/*.mjs`, `scripts/**/*.js`,
   `esbuild.config.ts`, `src/build.ts`, `tsx` ignored dep) and added
   `widget/src/vite-env.d.ts` to MCP app entry. Knip exit 0; only a
   single informational `.css` extension hint remains.

Reviewer rounds completed during the work:

- **Phase 0 type-reviewer**: PASS on baseUrl-removal safety under TS6
  - `moduleResolution: "bundler"`. Confirmed `customConditions`,
  `erasableSyntaxOnly`, declaration emit, and remaining compilerOptions
  all unaffected.
- **Phase 0 assumptions-reviewer**: PASS WITH REDUCTIONS. Reduced
  reviewer cadence from 7 → 4 (dropped post-Phase-1 code-reviewer
  re-pass and Phase 2 type-reviewer as theatre); decoupled Phase 1 from
  Phase 0 gates; flagged the original Phase 4's pre-existing
  inconsistency cleanups as opportunism (owner overruled — fix all in
  this branch).

### Pending

9. 🟡 **Author ADR for TS6 migration + workspace-script architectural
   rules.** **Number: ADR-168.** ADR-167 was authored in parallel by
   Ethereal Illuminating Comet (claude-code, 2026-04-29) on
   hook-execution-failure visibility — see
   `docs/architecture/architectural-decisions/167-hook-execution-failures-must-be-observable.md`.
   Verify ADR-168 is still next available before authoring (the index
   may have moved by the time the fresh session opens). Topics:

   - TS6 migration baseline (baseUrl removed; `rootDir: "./src"`
     convention reaffirmed for build configs; `types: ["node"]` in
     `tsconfig.base.json`; `erasableSyntaxOnly: true` retained).
   - Workspace boundary rule: workspaces must not call scripts from the
     repo root via `../../scripts/`.
   - All-TypeScript-scripts rule with the dedicated-directory exception
     for no-compile-no-deps cases.
   - Cite the canonical implementation paths
     (`apps/oak-curriculum-mcp-streamable-http/runtime-only-scripts/`,
     `apps/oak-search-cli/scripts/validate-application-version.ts`,
     etc.).

   Invoke `docs-adr-reviewer` for review.

10. 🟡 **Final quality-gate sweep + release-readiness review.** Run the
    full canonical sequence (`pnpm sdk-codegen`, `build`, `type-check`,
    `doc-gen`, `lint:fix`, `format:root`, `markdownlint:root`, `test`,
    `test:e2e`, `test:widget`, `subagents:check`, `portability:check`,
    `practice:fitness:strict-hard`, `practice:vocabulary`,
    `smoke:dev:stub`). Sentinels:
    `pnpm type-check 2>&1 | grep -cE "TS5011|TS5101"` must return 0.
    Then invoke `release-readiness-reviewer` for explicit
    GO / GO-WITH-CONDITIONS / NO-GO.

## Commit Shape — Strongly Recommended

The working tree currently holds ~170 changed files spanning many
logical units. The change set should land as **multiple commits with
clear scope boundaries**, not as one mega-commit. Suggested split:

1. `chore(deps): typescript ^5 → ^6 + incidental dep refresh`
   — root + workspace `package.json` typescript bumps + `pnpm-lock.yaml`
   regeneration; incidental Clerk/commitlint/stryker/pnpm patch updates
   that came along with the lock-file refresh.
2. `fix(build): TS6 rootDir + baseUrl + types compatibility`
   — four `tsconfig.build.json` rootDir additions; `baseUrl` removal
   from `tsconfig.base.json` + 21 redundant per-workspace re-
   declarations; `"types": ["node"]` in `tsconfig.base.json`;
   `widget/src/vite-env.d.ts`; `agent-tools/tsconfig.json` outDir fix
   - `tsconfig.build.json` outDir restoration; build-metadata test
   fix to use `ROOT_PACKAGE_VERSION` dynamically.
3. `refactor(arch): workspace-to-root-script ban + runtime-only-scripts directory`
   — vercel-ignore trio move to `runtime-only-scripts/` + README;
   `vercel.json`, e2e test, semver TSDoc, active ADR/doc reference
   updates; replacement of `node ../../scripts/run-tsx-development.mjs`
   with `pnpm exec tsx` across MCP/search-cli/design-tokens/sdk-codegen;
   new `apps/oak-search-cli/scripts/validate-application-version.ts`.
4. `chore(scripts): convert root .mjs scripts to TypeScript`
   — delete `run-tsx-development.mjs` and
   `validate-root-application-version.mjs`; rename 11 root `.mjs`
   to `.ts`; update root `package.json` invocations; update
   `.claude/settings.json` hook commands; convert MCP `.js` scripts
   (`server-harness`, `run-requests`, `embed-widget-html`) to typed
   TypeScript.
5. `chore(config): tsconfig audit cleanups`
   — delete orphan `tsconfig.eslint-rules.json` + remove root tsconfig
   include; oak-eslint type-check standardisation + new
   `tsconfig.lint.json` + build-script alignment + tsup `dts: false`;
   `oak-sdk-codegen` test-cache exclude;
   `design-tokens-core` `emitDeclarationOnly`.
6. `chore(knip): clear unused exports + config cleanups`
   — bulk un-export of 37 internal-only types; drop unused barrel re-
   exports; un-export `upstreamAuthServerMetadataSchema`; fix 12 stale
   `.mjs` test imports broken by Task #5's renames; `knip.config.ts`
   pattern cleanups + `vite-env.d.ts` entry.
7. `docs(adr): ADR-167 TypeScript 6 + workspace-script architectural rules`
   — Task #9.

Each commit is independently revertable. Commit 1 unblocks the build.
Commit 2 makes TS6 compile. Commits 3–6 are architectural cleanups.
Commit 7 records the decision.

## Continuation Guidance for the Fresh Session

The session was moved to a fresh context per the owner's direction
(mid-session mistake-pattern accumulation flagged by the owner — see
napkin Surprise 5 about sed-bypass of Read-then-Edit). The previous
session ran `/jc-session-handoff` cleanly; all continuity surfaces
were updated so the fresh session can pick up without re-deriving
context.

### Step 0 — Bootstrap commands the fresh session can paste

```bash
# Confirm working tree state matches handoff expectations
git status --short | wc -l                           # expect ~170
git log --oneline -3                                 # last commit should be 171a94fd "chore(release): 1.6.0 [skip ci]"
pnpm type-check 2>&1 | grep -cE "TS5011|TS5101"      # must return 0
pnpm build 2>&1 | tail -3                            # must show all green
pnpm test 2>&1 | tail -3                             # must show all green
pnpm knip 2>&1 | grep -E "^Unused|^Configuration"    # only "Configuration hints (1)" expected (.css hint, informational)
```

If any of those sentinels fail, **stop and re-read the napkin/plan
before attempting fixes** — the working tree state has drifted from
the documented handoff state.

### Step 1 — Read the captured context (in this exact order)

1. `.agent/memory/active/napkin.md` — find the
   **"2026-04-29 — TS6 migration myopia (Verdant Swaying Fern)"**
   section and **read all 5 Surprise sub-sections in full**, plus
   the Owner-directed architectural rules and the Session handoff
   sub-section. The five Surprises name distinct surfaces of the
   same myopia anti-pattern — internalising them is the precondition
   for not repeating them.
2. **This plan in full** — the "Done" list (verifying against
   Step 0 sentinels), the "Commit Shape" section (7 logical
   commits), the "Risks and Constraints Carried Forward" section,
   and the "File Inventory" so you know what is in the working tree.
3. `.agent/memory/operational/repo-continuity.md` — incremental
   refresh entry naming this session and the
   `Pending-Graduations Register` entry for ADR-168.
4. `.agent/state/collaboration/shared-comms-log.md` — the
   2026-04-29T07:17:15Z entry from Verdant Swaying Fern naming
   the handoff.

### Step 2 — Decide commit cadence before writing any new code

The standing direction is: **do not commit any of the existing
working-tree changes without first running the proactive
auto-fix passes** (`pnpm format:root`, `pnpm lint:fix`,
`pnpm markdownlint:root`). The pre-commit hook will surface
formatting issues the moment a commit is attempted — get ahead
of it.

The recommended landing shape is **7 logical commits** (see
"Commit Shape" section above). Each commit is independently
revertable; commit 1 unblocks the build; commits 2–6 are
architectural cleanups; commit 7 records the decision (ADR-168).

### Step 3 — Author ADR-168 (Task #9)

ADR-167 was authored in parallel by Ethereal Illuminating Comet
(hook-execution-failure visibility); the next available ADR
number is **168** unless another session has moved it again.
**Verify before writing**:

```bash
ls docs/architecture/architectural-decisions/168*.md   # should not exist
ls docs/architecture/architectural-decisions/ | tail -5  # confirm 167 is the latest
```

ADR-168 covers TS6 migration baseline + workspace-script
architectural rules — full topic list is named in the
`Pending` section of this plan (Task #9) and in
`repo-continuity.md § Pending-Graduations Register`. Use
`docs/architecture/architectural-decisions/167-...md` or
`165-agent-work-practice-phenotype-boundary.md` as a shape
reference (Status / Date / Related / Context / Decision /
Consequences). **Invoke `docs-adr-reviewer`** before considering
the ADR done.

### Step 4 — Run the final quality-gate sweep (Task #10)

Canonical sequence (one at a time, per repo convention):

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm doc-gen
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:widget
pnpm subagents:check
pnpm portability:check
pnpm practice:fitness:strict-hard
pnpm practice:vocabulary
pnpm smoke:dev:stub
```

**Sentinels** (both must return 0):

```bash
pnpm type-check 2>&1 | grep -c "TS5011"
pnpm type-check 2>&1 | grep -c "TS5101"
```

Then invoke `release-readiness-reviewer` for explicit
GO / GO-WITH-CONDITIONS / NO-GO before merge.

### Step 5 — Land the 7 commits

Use the commit skill — it enumerates commitlint constraints
inline at draft time, validates the message via
`scripts/check-commit-message.sh`, manages the advisory commit
queue and `git:index/head` claim. Commit boundaries are in the
"Commit Shape" section above. **Do not bundle** — separate
commits give clean revert points if any later step needs to be
unwound.

### Anti-patterns to actively avoid (from napkin Surprises 1–5)

- **Do not** dispatch reviewer agents to find out what is broken.
  Run the failing command yourself first, capture the full output,
  read it as exploration. Reviewers extend the picture; they do
  not establish it.
- **Do not** read the working-tree diff for confirmation only.
  The first pass is "what is this telling me?" — only the second
  pass should be "is this what I expected?"
- **Do not** treat pre-commit hook failures as obstacles. Each
  hook is a question about working-tree state. Three hooks failing
  in sequence is itself a stop signal — audit, do not engineer
  past.
- **Do not** trim insight to fit a fitness budget. The budget
  signals consolidation pressure, not capture pressure. Write the
  full insight; flag the file.
- **Do not** reach for `sed` when `Edit` returns "File has not
  been read yet." Read the file (refreshing your view) and retry
  Edit. `sed` is for truly bulk content-addressed replacements
  across many files, not a fallback for individual-file Edit
  failures.

## Risks and Constraints Carried Forward

- **Pre-commit hooks** will fire on every commit and check
  format/markdownlint/knip/depcruise/type-check/lint/test. The
  next session should run `pnpm format:root` and `pnpm lint:fix`
  proactively before the first commit attempt. Knip is exit 0 already.
- **Husky `commit-msg` hook** invokes
  `pnpm exec tsx scripts/prevent-accidental-major-version.ts` — that
  TS file already exists and is unaffected.
- **Vitest config coupling** (`workspace/vitest.config.ts` imports from
  `../vitest.config.base.ts`) is the same architectural smell as
  workspace-to-root-script coupling, but for test config. **Not yet
  addressed.** 19 workspaces are coupled to the root `vitest.config.base.ts`.
  Owner direction unclear on whether this falls under the same ban or
  is a separate question (configs vs scripts). Surface for owner
  decision in the fresh session before attempting any refactor.
- **Husky shell hooks** (`.husky/commit-msg`, `pre-commit`, `pre-push`,
  plus `scripts/check-commit-message.sh` and `scripts/log-commit-attempt.sh`)
  remain `.sh`. Husky requires shell hook entry points — these are a
  legitimate pre-existing exception. Worth recording in the ADR.
- **The 7-commit split** assumes the working tree state at session end.
  If anything else has changed in the working tree by the time the
  fresh session starts, the boundaries may need adjusting.

## File Inventory (uncommitted at session-end)

170 files changed in the working tree. High-level breakdown:

- 22 tsconfig files (baseUrl removal + types: node + rootDir + outDir).
- 1 tsconfig.eslint-rules.json deleted.
- 1 root tsconfig.json (eslint-rules include removal).
- ~20 root `package.json` workspace files (typescript bump + script
  invocation updates).
- 1 `pnpm-lock.yaml` (TS6 + dep refresh).
- 13 root scripts (2 deleted, 11 `.mjs` → `.ts`).
- 3 vercel-ignore trio files moved (`build-scripts/` → `runtime-only-scripts/`).
- 1 new `runtime-only-scripts/README.md`.
- 3 MCP app `.js` scripts converted to typed `.ts`.
- 1 new `apps/oak-search-cli/scripts/validate-application-version.ts`.
- 1 new `widget/src/vite-env.d.ts`.
- 1 new `packages/core/oak-eslint/tsconfig.lint.json`.
- 1 oak-eslint `tsup.config.ts` (`dts: true` removed).
- 1 oak-eslint `package.json` (script changes).
- 1 `knip.config.ts` (pattern cleanups).
- ~22 source files un-exported types.
- 1 build-metadata `runtime-metadata.unit.test.ts` (ROOT_PACKAGE_VERSION fix).
- ~6 active doc/ADR/runbook files updated for path changes.
- Several `.agent/memory/active/napkin.md` updates.
- 3 new `.agent/memory/active/patterns/` files (carried over from earlier).
- This plan file (new).

## Cross-References

- Napkin: `.agent/memory/active/napkin.md` — session 2026-04-29
  "TS6 migration myopia (Verdant Swaying Fern)" with five surprises
  (reviewer findings, confirmation reading, hook bypass, fitness
  budget, sed bypass).
- New patterns:
  - `.agent/memory/active/patterns/hook-as-question-not-obstacle.md`
  - `.agent/memory/active/patterns/ground-before-framing.md` (added
    2026-04-29 evidence entry).
- Skill correction:
  `.agent/skills/napkin/SKILL.md` — added "Never Hold Back Insight to
  Fit a Budget" section.
- Auto-memory feedback files (cross-session, agent-personal):
  - `feedback_ground_state_before_planning.md`
  - `feedback_no_workspace_to_root_scripts.md`
  - `feedback_hook_failures_are_questions.md`
- Original (now-stale) plan file:
  `/Users/jim/.claude/plans/create-a-plan-to-reflective-emerson.md` —
  this in-repo plan supersedes it.
