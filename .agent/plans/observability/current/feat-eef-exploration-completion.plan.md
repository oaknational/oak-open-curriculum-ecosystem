---
name: "feat/eef_exploration completion: rule integration, reviewer backfill, no-real-io enforcement (capture-not-clean), MCP tools verified, merge"
overview: >
  Single linear plan to complete and merge feat/eef_exploration.
  Owner direction (2026-05-04): keep the plan strictly linear; do
  NOT audit and remediate every existing real-IO violation; DO
  install the no-real-io-in-tests ESLint rule so no NEW violations
  enter the codebase; capture the current real-IO inventory as a
  named record, not as a fix-list. Twelve steps after Round 2
  collapse. Steps 1–2 review and refine this plan body. Step 3
  integrates no-speed-pressure across the rule estate. Steps 4–5
  backfill scoped reviewer dispatch on the four already-landed
  plan-3 commits. Steps 6–8 author the no-real-io-in-tests ESLint
  rule (step 6), atomically capture existing violations to this
  plan body's §IO Inventory and freeze the rule's path-allowlist
  in the shared `recommended` config every workspace inherits
  (step 7), and verify the rule is active with the discipline note
  for future allowlist additions in place (step 8). Severity is
  `warn` through this branch's merge per the new-eslint-rules-start-warn
  principle; escalation to `error` is a separate post-merge decision.
  Steps 9–12 run gates green, exercise
  MCP tools live with ordered specialist dispatch, analyse
  divergence, and declare merge-ready.
status: current
isProject: true
todos:
  - id: 01-comprehensive-plan-review-round-1
    content: "DONE 2026-05-04 (Pelagic Diving Atoll). Architecture-led review pass dispatched in parallel: code-reviewer (gateway) + architecture-reviewer-{barney,betty,fred,wilma} + assumptions-reviewer. Six reviewers ran on plan body AND code surface (commits fd4eabaa..b226670d, no-speed-pressure rule, observability/env package areas). Findings captured in §Plan Review Findings (Round 1)."
    status: completed
  - id: 02-apply-round-1-findings-and-second-review
    content: "Apply Round 1 findings to refine this plan body. Then dispatch a second review round on the revised plan body (same six reviewers; owner-directed pre-execution gate). Apply any Round 2 findings. Commit the refined plan via full commit-skill protocol (single atomic commit with code-reviewer dispatch at close). After this step the plan body is the contract for the rest of execution. Findings explicitly rejected get written rationale per principles.md. CLOSED 2026-05-04 (Lacustrine Navigating Rudder, `dd239f`); commit 75dbcdb6."
    status: completed
    depends_on: [01-comprehensive-plan-review-round-1]
  - id: 03-integrate-no-speed-pressure-rule
    content: "Integrate the already-authored .agent/rules/no-speed-pressure.md across the rule estate in one commit: add to RULES_INDEX.md (canonical platform-independent enumeration); create thin adapters at .claude/rules/no-speed-pressure.md, .cursor/rules/no-speed-pressure.mdc, .agents/rules/no-speed-pressure.md; add one-line cross-reference from principles.md §Architectural Excellence Over Expediency; add one distilled.md entry; write a single user-memory feedback file feedback_no_speed_pressure.md with MEMORY.md index update. The other three speculative failure-mode feedback files originally proposed (performed-grounding-vs-practised, rule-conflict-is-signal, auto-mode-not-permission-slip) are NOT authored at this step — graduate them only when a second instance is observed in the field. Post-commit: verify all four adapter paths exist and resolve identically (`.agent/rules/no-speed-pressure.md`, `.claude/rules/no-speed-pressure.md`, `.cursor/rules/no-speed-pressure.mdc`, `.agents/rules/no-speed-pressure.md`). Land via full commit-skill protocol with code-reviewer dispatch. CLOSED 2026-05-04 (Lacustrine Navigating Rudder, `dd239f`); commit SHA recorded in §Sequence Summary post-commit."
    status: completed
    depends_on: [02-apply-round-1-findings-and-second-review]
  - id: 04-reviewer-backfill-scoped-by-commit-risk
    content: "Backfill reviewer dispatch on the four already-landed plan-3 commits (fd4eabaa..b226670d), scoped by per-commit risk surface (not blanket specialist coverage): (a) 8fa339f4 (cycle 1d, scripts retire + foreign-stage absorption incident): code-reviewer gateway, AND read the commit message + stage log to verify the commit-skill protocol shape (peer-stage absorption was a discipline failure, not a code miss; gateway code review alone does not validate that the commit-skill substrate ran); (b) 7620fefd (cycle 1b, vitest.smoke.config.ts retire): code-reviewer gateway only; (c) d4fb9a8f (cycle 1a, smoke-tests directory retire): code-reviewer gateway + docs-adr-reviewer for stranded references in TESTING.md / dev-server-management.md / vercel-environment-config.md / playwright.config.ts; (d) b226670d (cycle 1c, in-process invariant test): code-reviewer gateway + test-reviewer (conditional-branch test-immediate-fail at lines 57-59, 70-72 + 22-item checklist) + architecture-reviewer-fred (boundary-crossing import at line 7: src/ -> e2e-tests/helpers/). Capture findings under §Backfill Findings. CLOSED 2026-05-05 (Lacustrine Navigating Rudder, `dd239f`); full findings under §Backfill Findings."
    status: completed
    depends_on: [03-integrate-no-speed-pressure-rule]
  - id: 05-apply-backfill-findings
    content: "For each Round-2-confirmed Round-1 finding and each backfill finding from step 04: implement the fix as its own atomic commit via full commit-skill protocol OR record explicit written rejection rationale. The boundary-crossing import (apps/oak-curriculum-mcp-streamable-http/src/dev-boot-without-observability.integration.test.ts line 7) is a NAMED OUTSTANDING VIOLATION that MUST close at this step (not 'may close'); its closing commit MUST be reviewed by architecture-reviewer-fred (the specialist who identified it) — not the gateway alone. The conditional-branch pattern at lines 57-59, 70-72 is a NAMED test-immediate-fail that MUST close; its closing commit MUST be reviewed by test-reviewer (the specialist who identified it). Reviewer findings are action items by default per principles.md §Compiler Time Types and Runtime Validation. CLOSED 2026-05-05 (Lacustrine Navigating Rudder, `dd239f`; Dawnlit Transiting Galaxy, `0ddc89`); commit SHAs recorded in §Sequence Summary row 5 and §Backfill Findings entries."
    status: completed
    depends_on: [04-reviewer-backfill-scoped-by-commit-risk]
  - id: 06-author-no-real-io-in-tests-rule
    content: "Author packages/core/oak-eslint/src/rules/no-real-io-in-tests.ts as the structural guard against NEW real-IO in tests. **Severity: error** (not warn) — per no-warning-toleration; pnpm lint must exit non-zero on any new violation. Trigger surface: any *.test.ts | *.spec.ts file (matching ESLint's existing test glob), excluding allowlist below. **Denylist (comprehensive Node.js IO surface)**: (i) child_process: spawn, exec, fork, execFile, spawnSync, execSync, execFileSync; (ii) worker_threads: Worker constructor; (iii) fs: ALL named imports (readFile, writeFile, readFileSync, writeFileSync, mkdtemp, stat, etc.) AND default imports (`import fs from 'fs'` / `import fs from 'node:fs'`) AND fs/promises module (`import { readFile } from 'fs/promises'`) AND dynamic forms (`await import('fs')`, `await import('node:fs')`, `await import('fs/promises')`, `require('fs')`); (iv) process: read OR mutation of process.env (also `globalThis.process.env`), process.cwd(), process.chdir(); (v) network: fetch() / http.* / https.* / net.* / dgram.* to non-localhost. **Both** unprefixed (`fs`) AND `node:`-prefixed (`node:fs`) specifiers must be caught. **Allowlist (path-shape only, NOT 'designated' adjective)**: vitest.config.ts | vitest.*.config.ts | vitest.setup.ts at workspace roots; **/test-helpers/** | **/test-fakes/** structurally-marked directories. Pair with no-real-io-in-tests.unit.test.ts (RuleTester cases) — RuleTester MUST cover negative cases for every denylist sub-form above (one negative case per Sync variant; one per fs API entry point; one per node: prefix; one for default import; one for fs/promises; one for globalThis.process.env; one per child_process factory; one for Worker constructor) AND positive cases for every allowlist sub-glob. Plugin registration in plugin.ts. **Do NOT yet wire into root eslint.config.ts.** Land via full commit-skill protocol with config-reviewer dispatch (allowlist-shape correctness) + test-reviewer dispatch (RuleTester describe-vs-audit shape AND surface coverage exhaustiveness against Node.js IO API enumeration). Acceptance: pnpm test --filter @oaknational/eslint-plugin-standards exits 0; the rule is registered but inactive at root. CLOSED 2026-05-05 (Twilit Beaming Aurora, `7cf730`); closing commit SHA recorded in §Sequence Summary row 6."
    status: completed
    depends_on: [05-apply-backfill-findings]
  - id: 07-capture-inventory-and-freeze-allowlist
    content: "Run the rule in dry-run mode and freeze its allowlist atomically in one commit. (a) Invoke ESLint with the rule registered (one-off lint command per package) using `--format json` (or equivalent structured output). Pipe to a temporary capture file. (b) Count violations from the structured output. (c) Populate §IO Inventory in this plan body: one entry per violation with absolute path, violation kind (spawn / exec-sync / fs / fs-promises / dynamic-import-fs / process-env / process-cwd / fetch / worker), one-sentence rationale for current presence, follow-up disposition (in-scope-of-named-follow-up-plan / structural-ambiguity-to-investigate / accept-and-document). (d) Validate Inventory entry count matches the rule's output count; spot-check 5 random Inventory entries against the rule output for accuracy; if either check fails, re-run capture before proceeding. (e) Configure the rule's path-allowlist as an option block in `packages/core/oak-eslint/src/configs/recommended.ts` (the shared config every workspace inherits via `configs.strict` / `configs.recommended`), listing exactly the paths captured in (c). Per-file ESLint disable comments are FORBIDDEN (never-disable-checks). Owner direction (2026-05-05) supersedes the original R2-4 finding: rule wires at `warn` severity during its development phase per the new-eslint-rules-start-warn principle (recorded in user-memory `feedback_new_eslint_rules_start_warn.md`); escalation to `error` is a separate post-merge decision. (f) **If `apps/oak-curriculum-mcp-streamable-http/e2e-tests/helpers/test-config.ts` appears in the captured set, append a cross-reference into the paused plan's resumption preconditions (`.agent/plans/observability/future/replace-sentry-mode-with-observability-sinks.plan.damaged-paused-2026-05-04.md`) before committing** — the file sits at the intersection of this Inventory and that plan's WS4–WS5 file list (Round 1 finding C6). The §IO Inventory and the allowlist start identical; the **allowlist is the canonical live enforcement surface** going forward, the §IO Inventory is the **historical snapshot** at merge time and is NOT updated by post-merge migrations (follow-up plans remove paths only from the allowlist). Land via full commit-skill protocol with config-reviewer (allowlist shape) + docs-adr-reviewer (Inventory completeness + cross-reference discipline) dispatch. CLOSED 2026-05-05 (Silvered Hiding Silhouette, `924167`); architecture-reviewer-fred + architecture-reviewer-betty dispatched on the wiring-location design (Option A: shared `recommended.ts`) — both verdicts Option A, citing principles.md §Tooling, ADR-121 §Design Principles #5, and the established peer-rule precedent (`no-eslint-disable`, `no-dynamic-import`); 24 violations across 23 unique files; `e2e-tests/helpers/test-config.ts` NOT in captured set (no cross-reference needed); allowlist absorbs all violations; `pnpm lint` exits 0; closing commit SHA recorded in §Sequence Summary row 7 post-commit."
    status: completed
    depends_on: [06-author-no-real-io-in-tests-rule]
  - id: 08-verify-rule-active-and-discipline-recorded
    content: "Verify the no-real-io-in-tests rule is active with the discipline for future allowlist additions in place. Step 07 already wired the rule (in the shared `packages/core/oak-eslint/src/configs/recommended.ts`, which every workspace inherits via `configs.strict` / `configs.recommended`) and populated the §IO Inventory + allowlist atomically; step 08's narrower remit is verification + discipline declaration. Acceptance: (a) `pnpm lint` exits 0 across the entire monorepo (the allowlist absorbs the §IO Inventory; nothing else fires); (b) the comment block above the rule activation in `recommended.ts` names the allowlist-ADD discipline (any future PR adding a path must cite either a §IO Inventory entry or a named follow-up plan; PR review enforces this discipline; no structural lint gate); (c) reviewer findings from step 07 are absorbed (any P2 prose-drift on stale severity / location wording cleaned up). Severity remains `warn` through this branch's merge per the new-eslint-rules-start-warn principle; escalation to `error` is a separate post-merge decision once the rule is stable, NOT in scope of this branch. After this step the rule is live in advisory mode: a new test-IO not on the allowlist is a `warn` (visible in lint output and PR review), not a hard build failure. Land via full commit-skill protocol with config-reviewer dispatch."
    status: pending
    depends_on: [07-capture-inventory-and-freeze-allowlist]
  - id: 09-pnpm-check-green
    content: "From a clean tree on feat/eef_exploration HEAD, run `pnpm check` at the repo root. Capture the actual command's output and cross-check the gate set against docs/governance/development-practice.md §Gate Taxonomy (nine layers). All gates must exit 0. Document the result with HEAD SHA and the captured gate set in this plan body. Fix any failure at the source per never-disable-checks; if larger than mechanical, surface to owner with a named highest-priority recovery plan."
    status: pending
    depends_on: [08-verify-rule-active-and-discipline-recorded]
  - id: 10-mcp-server-live-exercise
    content: "Boot the dev server locally, exercise MCP tools through the protocol, then shut down cleanly. (a) From apps/oak-curriculum-mcp-streamable-http/, run `env -u VERCEL_ENV -u VERCEL_BRANCH_URL -u VERCEL_GIT_COMMIT_SHA -u VERCEL_GIT_COMMIT_REF -u SENTRY_RELEASE_OVERRIDE SENTRY_MODE=sentry pnpm dev` and capture output to /tmp/dev-boot.log. Expect 'Oak Curriculum MCP Server listening on port 3333' within ~10s; if not, SIGTERM and record boot failure as a named finding (Sentry-network unavailability is operational evidence, not strictly merge-blocking). Note: legacy SENTRY_MODE consumer path is the live contract per the paused rename plan. (b) Issue an MCP `tools/list` against http://localhost:3333/mcp; record the count and full list of tool names to /tmp/mcp-tool-exercise.log. (c) Issue an MCP `tools/call` against three representative tools — at least one curriculum-data tool (search or get-key-stages), one MCP-app/UI tool, one prompt or sequence tool. Each response is validated against the tool's registered schema in the tool catalogue (ADR-123) — not just HTTP 200. Capture exchanges to the same log. (d) If any tool's response surface includes UI/widget content per ADR-141, invoke accessibility-reviewer over the captured response payload. (e) SIGTERM the dev server; confirm port 3333 is free. **Reviewer dispatch ordering**: invoke mcp-reviewer (protocol probe sufficiency) FIRST; if it returns a P1 blocker, halt step and surface to owner before further dispatch. On clean mcp-reviewer return: invoke security-reviewer (auth path coverage), clerk-reviewer (Clerk middleware), sentry-reviewer (observability surface) in parallel; accessibility-reviewer conditional on (d) and runs LAST against captured payloads. Acceptance: 'listening' log line present (or named operational-evidence note); tools/list returns >0 tools; three tools/call exchanges return schema-valid responses; all dispatched reviewers return clean or with absorbed findings."
    status: pending
    depends_on: [09-pnpm-check-green]
  - id: 11-pre-merge-divergence-analysis
    content: "Per .agent/rules/pre-merge-divergence-analysis.md: `git fetch origin main`; `git log --oneline origin/main..HEAD`; `git log --oneline HEAD..origin/main`; `git diff --stat origin/main...HEAD`. Inspect any cross-cutting changes (root config files, lockfile, CI surfaces) for conflict potential. If 100+ files diverged or 10+ conflicts predicted, follow .agent/skills/complex-merge/SKILL.md. Surface findings to owner before merge proposal."
    status: pending
    depends_on: [10-mcp-server-live-exercise]
  - id: 12-merge-readiness-declaration
    content: "Owner-gated merge readiness declaration. Required evidence bundle: Round 1 + Round 2 review findings + applied amendments (steps 1–2), no-speed-pressure rule integration with four-adapter-path verification (step 3), reviewer-backfill findings + fixes (steps 4–5), no-real-io-in-tests rule + IO Inventory + frozen allowlist + wired (steps 6–8), pnpm check green at HEAD (step 9), MCP server live exercise log (step 10), divergence analysis (step 11). Invoke release-readiness-reviewer over the bundle to synthesise GO / GO-WITH-CONDITIONS / NO-GO recommendation. Owner reviews and authorises the merge action. Merge mechanics (PR open, squash-or-merge-commit, target branch) are owner-directed; this plan does not pre-decide them."
    status: pending
    depends_on: [11-pre-merge-divergence-analysis]
---

# `feat/eef_exploration` Completion

**Last Updated**: 2026-05-05 (Silvered Hiding Silhouette, step-07 close: §IO Inventory populated + allowlist frozen at `warn` severity in shared `recommended.ts`)
**HEAD at refresh**: `75dbcdb6`
**Status**: 🟢 CURRENT — owner-directed unified replacement of two parallel
plans, refined post-Round-1 architecture-led review.

## Intent

Single linear sequence to complete and merge `feat/eef_exploration`.
Replaces two separately-authored predecessor plans whose verification work
overlapped duplicatively and whose coordination introduced friction. The
work is the same; the seams are removed.

After this plan: the no-speed-pressure rule is integrated across the rule
estate, scoped reviewer dispatch is current on the four already-landed
plan-3 commits, the `no-real-io-in-tests` ESLint rule is active and blocks
new real-IO in tests, the existing real-IO surface is captured as a frozen
§IO Inventory rather than fixed in this branch, the dev server boots
locally with MCP tools verified live against the tool catalogue, divergence
vs `main` is analysed, and an owner-authorised merge can land.

This plan is **strictly linear** (owner direction 2026-05-04).
Parallelisation of cycles or steps is not in scope; the only genuinely
load-bearing sequencing edge is `06 → 07 → 08` (the rule must exist
before its dry-run can capture violations and freeze the allowlist;
the rule + allowlist must be in place before wire-up). Other steps run
sequentially because the plan is sequential, not because each edge is
technically required.

It supersedes:

- `archive/superseded/eef-branch-merge-readiness.plan.superseded-by-unified-2026-05-04.md`.
- `../../architecture-and-infrastructure/archive/superseded/smoke-test-retirement-recovery-and-completion.plan.superseded-by-unified-2026-05-04.md`.

## Context

Branch state at refresh (`feat/eef_exploration` HEAD `b539c7c5`):

- **Plan 1** (`fix-dev-boot-release-resolution`): ✅ landed at commit
  `2a2d1b05`. Archived to `observability/archive/completed/`.
- **Plan 2** (`replace-sentry-mode-with-observability-sinks`): 🛑
  damaged-paused-superseded; moved to
  `observability/future/replace-sentry-mode-with-observability-sinks.plan.damaged-paused-2026-05-04.md`.
  Owner direction: foundational tension unnamed; do not resume until
  named in PDR/ADR. Legacy `SENTRY_MODE` consumer path is the live
  contract through this branch's merge. ADR-171 cited inside that paused
  plan is a forward reference (no extant ADR yet); this unified plan
  does not depend on its eventual number or text.
- **Plan 3 (original)** (`retire-smoke-tests-all-vitest-no-real-io`):
  cycles 1a–1d landed in commits `8fa339f4`, `7620fefd`, `d4fb9a8f`,
  `b226670d`. Damaged execution (commit-skill protocol bypassed,
  reviewer dispatch not invoked). The cycles' substance landed
  cleanly; the discipline gap is what needs recovery.
- **`.agent/rules/no-speed-pressure.md`**: rule already authored
  2026-05-04. Integration pending (step 3 of this plan).

## Foundation Alignment

- **principles.md §First Question**: linear unified plan is simpler
  than two coordinated parallel plans. Coordination cost was real;
  removing it removes friction.
- **principles.md §Architectural Excellence Over Expediency**: every
  step uses the full commit-skill protocol; no skip-doctrine paths.
  The no-speed-pressure rule (integrated in step 3) is the codified
  guard against the failure mode that damaged plan-3 execution.
- **principles.md §Owner Direction Beats Plan**: owner directed both
  the unification and the capture-not-clean shape of steps 6–9.
- **principles.md §Replace, don't bridge**: legacy `SENTRY_MODE=sentry`
  through merge is NOT a bridge — there is no compatibility shim, the
  contract is single, the paused plan's `core/` types are inert
  scaffolding rather than active code paths.
- **never-disable-checks**: every gate is blocking; none weakened. The
  rule's path-allowlist (configured + activated at step 7 in the shared
  `recommended` config; verified active at step 8) is configuration,
  not check-disablement; per-file ESLint-disable comments are forbidden.
- **no-warning-toleration with bounded development-phase exception**:
  the standing principle is zero tolerated warnings, AND a general
  named exception applies during the development phase of any new
  ESLint rule (recorded in user-memory `feedback_new_eslint_rules_start_warn.md`):
  new rules wire at `warn` first to avoid blocking unrelated work
  while the rule is iterated and the existing-violation surface is
  captured. Escalation to `error` is a separate post-merge decision
  once the rule is stable. The `no-real-io-in-tests` rule is
  currently inside this exception; any other new warning surfaced
  by step 9 (`pnpm check`) is fixed at source in the same work-item.
- **TDD-as-pairs (atomic-landing invariant)**: each step that authors
  code (3, 5, 6, 7, 8) lands test + product code together in one
  commit. No skipped or failing tests across commits.

## Discipline (applies to every step)

- **Commit-skill protocol**: every commit goes through
  `.agent/skills/commit/SKILL.md` under
  `.agent/rules/no-speed-pressure.md`. The substrate is the deliverable;
  do not restate its mechanics here, the rule and skill are the
  authority.
- **Stage by explicit pathspec**: `git add <each path>` then
  `git commit -F <msg> -- <pathspec>` to filter peer-staged work
  out of the index. Hook policy blocks `git add -A`/`-all`/`.`. The
  predecessor plan-3 execution failed this discipline at commit
  `8fa339f4`; do not repeat. **Peer-index cure**: if `git status`
  shows peer-staged work in the index, the cure is
  `git commit -F <msg> -- <pathspec>` — never `git reset HEAD <peer-files>`
  (would disturb peer's view).
- **Reviewer dispatch**: invoke the reviewers named in each step's
  brief; reviewer findings are action items by default; explicit
  rejection requires written rationale. Reviewer-dispatch enforcement
  is owner-cadence, not lint-gated; no structural gate exists yet.
- **Plan-body freshness**: update todo status as each step closes;
  refresh `Last Updated`; record commit SHAs against completed
  steps in this plan body.
- **No invented urgency**: per `.agent/rules/no-speed-pressure.md`,
  any urge to skip ceremony is the diagnostic. Apply the ceremony.
- **Owner-attention discipline**: when a step requires owner
  judgement (step 12), pause and surface; do not proceed past a
  doctrine-flagged decision point on own analysis.

## Plan Review Findings (Round 1, 2026-05-04 Pelagic Diving Atoll)

Six reviewers ran in parallel: code-reviewer (gateway),
architecture-reviewer-{barney,betty,fred,wilma}, assumptions-reviewer.
Specialist nominations driven by findings, not pre-dispatched.

**Cross-reviewer consensus (≥2 reviewers):**

- **C1 (P1)** Boundary-crossing import:
  `apps/oak-curriculum-mcp-streamable-http/src/dev-boot-without-observability.integration.test.ts:7`
  imports from `../e2e-tests/helpers/upstream-metadata-fixture.js`. `src/`
  reaching into `e2e-tests/` is an architectural violation (ADR-041,
  Layer Role Topology). Six pre-existing consumers of the same import
  path. **Step 5 MUST close (not "may close").** Resolution shape:
  relocate `upstream-metadata-fixture.ts` to `src/test-helpers/`, update
  consumers. *(code-reviewer P1, betty P1, fred P1-2)*
- **C2 (P1)** §Discipline previously restated the no-speed-pressure
  substrate (`claim → queue → skill-gates → verify-staged → commit`),
  creating a second authority that drifts. **Applied in this revision**:
  §Discipline now references `commit/SKILL.md` and
  `no-speed-pressure.md` rather than restating their mechanics.
  *(barney P1, fred adjacent)*
- **C3 (P1)** Step 1's reviewer set originally front-loaded execution-step
  specialists (config / mcp / security / clerk / sentry / release-readiness).
  **Applied**: those specialists moved into the steps where they have
  work to review (config-reviewer at steps 6, 7, 8; mcp / security /
  clerk / sentry / accessibility at step 10; release-readiness at
  step 12; step numbers reflect post-Round-2 collapse). The plan-meta
  dispatch is the architecture-quartet + code +
  assumptions, with onboarding/docs-adr available for plan-readability
  if needed at Round 2. *(barney P1, assumptions critical-#2)*
- **C4 (P3)** Step 3's four user-memory feedback files were plan-time
  invention from one observed instance. Three are speculative
  failure-mode names. **Applied**: step 3 reduced to one feedback file
  (`feedback_no_speed_pressure.md`); the other three graduate when a
  second instance is observed. *(fred P3-1, assumptions critical-#4)*
- **C5 (P2)** Plan body HEAD SHA was stale (`b226670d`); actual is
  `b539c7c5`. **Applied**: refreshed in §Context and the front-matter
  `Last Updated`. *(code-reviewer P2)*
- **C6 (P2)** `e2e-tests/helpers/test-config.ts` sits at the intersection
  of cycle-2 real-IO surface AND the paused SENTRY_MODE rename's WS4–WS5
  file list. Under the new capture-not-clean shape this file's IO (if
  any) lands on the §IO Inventory; resumption of the paused rename will
  consume the Inventory entry. **Applied**: §Risk Register row added.
  *(betty Q3, wilma adjacent)*

**Single-reviewer high-priority:**

- **F1 (P1)** *fred*: Step 6's rule allowlist must be **path-shape only**
  ("designated DI fake helper" is unimplementable in ESLint).
  **Applied**: step 6 brief specifies path-glob allowlist
  (`vitest.config.ts | vitest.*.config.ts | vitest.setup.ts` + `**/test-helpers/**`
  - `**/test-fakes/**`); structurally-marked, lint-checkable.
- **F2 (P1)** *fred*: ADR-171 is a forward reference inside the paused
  plan, not an extant ADR. **Applied**: §Context names this explicitly;
  unified plan does not depend on it.
- **W1 (P1)** *wilma*: Step 11 must validate `tools/call` responses
  against the tool catalogue (ADR-123) schema, not just HTTP 200.
  **Applied**: step 10 brief updated (was step 11 pre-collapse).
- **W2 (P1)** *wilma*: Step 9 (rule wiring) must be preceded by step 7's
  capture pass (rule run in dry-run) so the allowlist already absorbs
  legitimate infra. **Applied**: this is the steps 7→8→9 ordering by
  construction; the dry-run IS step 7.
- **W3 (P1)** *wilma*: Audit grep was missing dynamic-import forms
  (`await import('fs')`, `require('fs')`). **Applied**: step 6 rule
  denylist explicitly includes dynamic-import forms; the rule itself
  catches what a grep would miss.
- **W4 (P2)** *wilma*: `packages/design/*` was missing from the
  per-workspace cycle 2 audit. **Applied**: under capture-not-clean
  the rule runs over the entire estate via ESLint glob — no
  per-workspace enumeration required; design/* covered by construction.
- **W5 (P2)** *wilma*: Cross-platform adapter asymmetry risk on rule
  integration (Cursor / Codex don't auto-load adapters). **Applied**:
  step 3 brief instructs verification of all four adapter paths
  post-commit; §Risk Register row added.
- **W6 (P3)** *wilma*: Step 13's evidence bundle does not include
  Clerk release-tag integrity. **Recorded** in §Risk Register and
  §Out-of-Scope Follow-ups for post-merge staging validation; not in
  scope of this branch.
- **CR1 (P1)** *code-reviewer*: Conditional-branch test-immediate-fail
  in `dev-boot-without-observability.integration.test.ts:57-59, 70-72`:
  `if (!result.ok) return;` early-returns silently. Item 16 of
  test-immediate-fails. **Applied**: step 5 closes this as a NAMED
  test-immediate-fail (test-reviewer dispatch in step 4(d)).
- **CR2 (P2)** *code-reviewer*: `apps/.../TESTING.md:134-135` references
  `pnpm qg` (no such script). **Applied**: step 4(c) docs-adr-reviewer
  brief + step 5 closure.
- **CR3 (P2)** *code-reviewer*: `apps/.../docs/vercel-environment-config.md:26`
  retains "smoke harness diagnostics" note. **Applied**: same as CR2.
- **A1** *assumptions-reviewer*: Reviewer-backfill regress lacks a stop
  rule. **Applied**: step 4 scopes specialist dispatch by per-commit
  risk surface (gateway-only on mechanical retirements; specialists on
  substantive commits).

**Owner direction folded in (2026-05-04 turn):**

- Plan must be strictly linear; no parallelism. *(applied throughout)*
- Do NOT audit all IO; install rule + capture inventory only.
  *(steps 6–9 rewritten)*
- Must not introduce new IO. *(rule denylist is the gate)*
- Note any IO found. *(§IO Inventory is the noting surface)*

## Plan Review Findings (Round 2, 2026-05-04 Pelagic Diving Atoll)

Six reviewers ran in parallel over the revised plan body and code surface:
code-reviewer (gateway), architecture-reviewer-{barney,betty,fred,wilma},
assumptions-reviewer.

**Verdicts:**

- **code-reviewer**: absorption-clean / absorption-defects-named (all 21
  Round 1 findings absorbed correctly; new defects named).
- **barney**: simpler-than-Round-1 (conditional on step 7+8 collapse).
- **betty**: cohesive (two P2 items; one closes before step 7).
- **fred**: COMPLIANT-WITH-CONDITIONS (single residual P2; path-allowlist
  survives §Strict-and-Complete + never-disable-checks scrutiny as a
  frozen-debt gate, not a fallback option).
- **wilma**: more-robust (Round 1 six absorbed; three new structural gaps
  named: denylist completeness, allowlist mutability, Inventory drift).
- **assumptions-reviewer**: PROPORTIONATE (one Round 2 pass sufficient;
  no Round 3).

**Findings absorbed into this revision:**

- **R2-1 (P1)** *wilma + assumptions*: Step 6 denylist must cover full
  Node.js IO surface — `*Sync` variants, `node:` prefix specifiers,
  default imports, `fs/promises`, `globalThis.process.env`,
  `worker_threads`. **Applied**: step 6 brief enumerates all sub-forms;
  RuleTester required to cover each negative case.
- **R2-2 (P1)** *barney*: Steps 7 + 8 are "the same data viewed two
  ways" — collapse into one atomic landing. **Applied**: collapsed into
  step 7 (capture inventory + freeze allowlist atomically); plan now
  has 12 steps, not 13.
- **R2-3 (P1)** *wilma + fred + code*: Step 5 NAMED VIOLATIONS closing
  commits need re-review by the specialist who identified the violation,
  not gateway alone. **Applied**: step 5 brief names fred for C1
  closure, test-reviewer for CR1 closure.
- **R2-4 (P1)** *code*: Step 6 must specify rule wired as `error`
  severity (not `warn`) per no-warning-toleration. **Applied**: step 6
  brief names "Severity: error" explicitly.
- **R2-5 (P1)** *wilma*: Allowlist mutability gate — without one, future
  PRs can drift the allowlist away from the §IO Inventory. **Applied**:
  step 7 places the allowlist in the shared
  `packages/core/oak-eslint/src/configs/recommended.ts` rule-options block
  (PR-reviewed; the location was upgraded from the originally-specified
  root `eslint.config.ts` after architecture-reviewer-fred and
  architecture-reviewer-betty both verdicted Option A on the wiring-location
  design — root-only would not have propagated to per-workspace lint runs);
  the comment-discipline above the rule activation block names the
  allowlist-ADD requirement ("any PR adding a path must cite an Inventory
  entry or named follow-up plan"); per-file `eslint-disable` comments
  stay forbidden.
- **R2-6 (P2)** *wilma + betty*: Inventory canonical vs allowlist
  canonical must be clarified — they start identical but diverge as
  migrations land. **Applied**: step 7 brief states allowlist is the
  canonical live enforcement surface; §IO Inventory is the historical
  snapshot at merge time, NOT updated by post-merge migrations.
- **R2-7 (P2)** *wilma*: Step 7 capture-process needs output-format
  spec + count validation + spot-check. **Applied**: step 7 brief
  specifies `--format json` capture, count cross-check, 5-entry
  spot-check; re-run if either fails.
- **R2-8 (P2)** *betty*: `e2e-tests/helpers/test-config.ts`
  cross-reference instruction missing from step 7 (Risk Register row
  C6 had the mitigation but step 7 had no instruction to act on it).
  **Applied**: step 7 brief adds explicit instruction to update the
  paused plan's resumption preconditions if `test-config.ts` is in
  the captured set.
- **R2-9 (P2)** *wilma*: Step 4(a) gateway-only review on `8fa339f4`
  may miss commit-skill discipline failure (peer-stage absorption
  was a discipline failure, not a code miss). **Applied**: step 4(a)
  brief adds "read commit message + stage log to verify commit-skill
  protocol shape" to the gateway dispatch.
- **R2-10 (P2)** *betty*: Step 11 (now step 10) reviewer-dispatch
  ordering ambiguity — five reviewers in one step. **Applied**: step 10
  brief specifies dispatch order (mcp-reviewer first; halt on P1;
  security/clerk/sentry parallel on clean; accessibility last on
  captured payloads).
- **R2-11 (P2)** *code + fred*: §Sub-agent Reviewers table did not
  include fred at step 5 for C1 closure. **Applied**: §Sub-agent
  Reviewers table updated; step 5 brief explicitly names
  fred + test-reviewer.
- **R2-12 (P2)** *code*: §Acceptance missing four-adapter-path
  verification criterion for step 3. **Applied**: §Acceptance updated.
- **R2-13 (P3)** *code*: §Sequence Summary said "3 adapters"; should
  read 4. **Applied**: corrected.
- **R2-14 (P3)** *code*: §Intent's `09→08→07→06` sequencing notation
  read reversed relative to execution order. **Applied**: notation now
  reads `06 → 07 → 08` in execution order.

**Findings recorded but not absorbed (deferred):**

- **R2-15 (P3)** *barney*: §Plan Review Findings (Round 1) is
  approaching artefact gravity (~110 lines); archive to a sibling file
  post-step-2 to compress the plan body. **Deferred** to post-merge
  consolidation (Learning Loop) — archiving now adds an extra artefact
  during active execution; the plan body's size remains workable.
- **R2-16 (P3)** *barney*: Step 2 is three concealed sub-steps; could
  split into 2a/2b for symmetry with step 1. **Deferred** — Round 2 is
  happening within step 2 as authored; splitting now is retroactive
  bookkeeping with no execution gain.

## IO Inventory (populated 2026-05-05 by Silvered Hiding Silhouette, step 07)

The §IO Inventory captures the frozen real-IO surface present in tests
at this branch's merge time. Format per entry:

```text
- path: <repo-relative path>
  kind: spawn | exec-sync | fs | fs-promises | dynamic-import-fs | process-env | process-cwd | fetch | worker
  rationale: <one sentence on why the IO is currently present>
  disposition: in-scope-of <plan slug> | structural-ambiguity-to-investigate | accept-and-document
```

The Inventory and the rule's allowlist (configured in
`packages/core/oak-eslint/src/configs/recommended.ts` rule-options block) start
identical; the **allowlist is the canonical live enforcement surface** going
forward, the **§IO Inventory is the historical snapshot** at merge time and is
NOT updated by post-merge migrations (follow-up plans remove paths only from the
allowlist).

**Capture method (2026-05-05):** rule wired in shared `recommended.ts` at
`warn` severity (per the new-eslint-rules-start-warn principle); ESLint
invoked per-workspace with `--format json` against the eight workspaces that
declare a `lint` script and contain test files; JSON output aggregated and
deduplicated to 24 violations across 23 unique files; full structured capture
in `/tmp/eslint-@oaknational_*.json` and human-readable summary in
`/tmp/no-real-io-lint-full.log`.

**`e2e-tests/helpers/test-config.ts` cross-reference check:** that file does
NOT appear in the captured violation set; no cross-reference into the paused
SENTRY_MODE rename plan's resumption preconditions is needed at this step.

**Sequencing note:** step 07's brief specified `error` severity at wire-up
(R2-4). Owner direction 2026-05-05 superseded that with the general
new-eslint-rules-start-warn principle (recorded in user-memory
`feedback_new_eslint_rules_start_warn.md`); escalation to `error` is a
separate, deliberate post-merge decision once the rule is stable.

### Inventory entries (24 violations across 23 unique files)

```text
- path: agent-tools/tests/codex-project-agents.integration.test.ts
  kind: fs
  rationale: Integration test reads real Codex project-agents JSON files to verify project-discovery behaviour
  disposition: in-scope-of agent-tools test-fakes migration plan (post-merge follow-up)

- path: agent-tools/tests/codex-reviewer-resolve.integration.test.ts
  kind: fs
  rationale: Integration test reads real Codex reviewer config files to verify reviewer-resolution behaviour
  disposition: in-scope-of agent-tools test-fakes migration plan (post-merge follow-up)

- path: agent-tools/tests/collaboration-state/collaboration-state.unit.test.ts
  kind: fs-promises
  rationale: Collaboration-state CLI test exercises real fs to validate end-to-end claim/comms file operations
  disposition: in-scope-of agent-tools test-fakes migration plan (post-merge follow-up)

- path: agent-tools/tests/runtime-agent-index.integration.test.ts
  kind: fs
  rationale: Integration test reads real runtime agent-index files to verify discovery
  disposition: in-scope-of agent-tools test-fakes migration plan (post-merge follow-up)

- path: apps/oak-curriculum-mcp-streamable-http/e2e-tests/vercel-ignore-runtime.e2e.test.ts
  kind: spawn
  rationale: E2E test spawns a child process to invoke the Vercel ignore-runtime script and assert exit codes
  disposition: in-scope-of HTTP-MCP e2e-fakes migration plan (post-merge follow-up)

- path: apps/oak-search-cli/src/lib/indexing/field-readback-audit-parse-ledger.integration.test.ts
  kind: fs-promises
  rationale: Integration test reads real field-readback audit ledger files to verify parser
  disposition: in-scope-of search-cli test-fakes migration plan (post-merge follow-up)

- path: apps/oak-search-cli/src/lib/indexing/task-0.0-gap-ledger.integration.test.ts
  kind: fs
  rationale: Integration test reads real gap-ledger files to verify task-0.0 indexing behaviour
  disposition: in-scope-of search-cli test-fakes migration plan (post-merge follow-up)

- path: packages/core/build-metadata/tests/git-sha.unit.test.ts
  kind: fs
  rationale: Unit test reads real .git directory metadata to verify SHA extraction
  disposition: structural-ambiguity-to-investigate (testing fs-coupled SHA-extraction is itself the design tension; migration plan needs to decide whether the SUT is reshaped to take a path-resolver or whether the test stays integration-shaped)

- path: packages/core/env/tests/root-package-version.unit.test.ts
  kind: fs
  rationale: Unit test reads real root package.json to verify version-extraction
  disposition: in-scope-of env package test-fakes migration plan (post-merge follow-up)

- path: packages/core/observability/src/no-node-only-imports.unit.test.ts
  kind: fs
  rationale: Unit test reads real bundle output files to assert no node-only imports leaked into browser bundles
  disposition: structural-ambiguity-to-investigate (the test is itself the lint-equivalent for bundle output; this is a meta-test verifying build artefacts and may legitimately need real-fs access — investigate whether to keep on allowlist permanently)

- path: packages/libs/env-resolution/tests/app-root.integration.test.ts
  kind: fs
  rationale: Integration test walks real fs upward to find app-root marker
  disposition: in-scope-of env-resolution test-fakes migration plan (post-merge follow-up)

- path: packages/libs/env-resolution/tests/repo-root.integration.test.ts
  kind: fs
  rationale: Integration test walks real fs upward to find repo-root marker
  disposition: in-scope-of env-resolution test-fakes migration plan (post-merge follow-up)

- path: packages/libs/env-resolution/tests/resolve-env.integration.test.ts
  kind: fs
  rationale: Integration test reads real .env files to verify env resolution chain
  disposition: in-scope-of env-resolution test-fakes migration plan (post-merge follow-up)

- path: packages/sdks/oak-sdk-codegen/code-generation/codegen-core-file-operations.integration.test.ts
  kind: fs
  rationale: Integration test exercises codegen file operations against real fs
  disposition: in-scope-of sdk-codegen test-fakes migration plan (post-merge follow-up)

- path: packages/sdks/oak-sdk-codegen/code-generation/copy-json-assets.integration.test.ts
  kind: fs
  rationale: Integration test verifies JSON asset copy operations on real fs
  disposition: in-scope-of sdk-codegen test-fakes migration plan (post-merge follow-up)

- path: packages/sdks/oak-sdk-codegen/code-generation/schema-cache.integration.test.ts
  kind: fs
  rationale: Integration test exercises schema cache reads against real fs
  disposition: in-scope-of sdk-codegen test-fakes migration plan (post-merge follow-up)

- path: packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/upstream-param-description-overrides.unit.test.ts
  kind: fs
  rationale: Unit test reads upstream override JSON files to verify override merging
  disposition: in-scope-of sdk-codegen test-fakes migration plan (post-merge follow-up)

- path: packages/sdks/oak-sdk-codegen/code-generation/typegen/routing/validate-canonical-urls.integration.test.ts
  kind: fs
  rationale: Integration test reads URL routing data files to verify canonical-URL validation
  disposition: in-scope-of sdk-codegen test-fakes migration plan (post-merge follow-up)

- path: packages/sdks/oak-sdk-codegen/e2e-tests/generators/write-json-graph-file.e2e.test.ts
  kind: spawn
  rationale: E2E test spawns child process to drive graph-file generator end-to-end
  disposition: in-scope-of sdk-codegen e2e-fakes migration plan (post-merge follow-up)

- path: packages/sdks/oak-sdk-codegen/e2e-tests/generators/write-json-graph-file.e2e.test.ts
  kind: fs-promises
  rationale: Same E2E reads/writes generated graph files to verify output shape
  disposition: in-scope-of sdk-codegen e2e-fakes migration plan (post-merge follow-up)

- path: packages/sdks/oak-sdk-codegen/e2e-tests/scripts/codegen-core.e2e.test.ts
  kind: fs
  rationale: E2E test reads codegen artefact files to verify the codegen-core script
  disposition: in-scope-of sdk-codegen e2e-fakes migration plan (post-merge follow-up)

- path: packages/sdks/oak-sdk-codegen/src/bulk/generators/synonym-miner.integration.test.ts
  kind: fs
  rationale: Integration test reads real bulk data files for synonym-mining behaviour
  disposition: in-scope-of sdk-codegen test-fakes migration plan (post-merge follow-up)

- path: packages/sdks/oak-sdk-codegen/src/bulk/generators/write-json-dataset.integration.test.ts
  kind: fs-promises
  rationale: Integration test writes JSON datasets to real fs and reads them back
  disposition: in-scope-of sdk-codegen test-fakes migration plan (post-merge follow-up)

- path: packages/sdks/oak-sdk-codegen/src/bulk/generators/write-json-graph-file.integration.test.ts
  kind: fs-promises
  rationale: Integration test writes JSON graph files to real fs and reads them back
  disposition: in-scope-of sdk-codegen e2e-fakes migration plan (post-merge follow-up)
```

**Validation (per step 07 brief):**

- Inventory entry count: 24 (matches `--format json` aggregate count from `/tmp/eslint-@oaknational_*.json`).
- Allowlist entry count: 23 unique path patterns (one fewer than Inventory because `write-json-graph-file.e2e.test.ts` has two distinct violations on different lines/imports — the allowlist exempts the file once; the Inventory records the two violations separately to keep the historical signal honest).
- Spot-check: 5 random Inventory entries verified line-by-line against `/tmp/no-real-io-lint-full.log` — all match (rule, file, kind).
- `pnpm lint` exits 0 with the allowlist absorbing every captured violation.

## Backfill Findings (step 04, 2026-05-05 Lacustrine Navigating Rudder)

Reviewers dispatched: code-reviewer (gateway, all four commits),
docs-adr-reviewer (d4fb9a8f), test-reviewer (b226670d),
architecture-reviewer-fred (b226670d). Four parallel agent runs.

### Commit `8fa339f4` — chore(scripts): retire smoke:* scripts and turbo tasks

**Discipline finding (not a code issue):** Commit was produced without
`git commit -- <pathspec>` filter. Peer-staged files from Fronded Climbing
Thicket (claim 07a19fd1, staging phase) were swept into this commit:
`.agent/plans/observability/README.md`, plan files, `active-claims.json`
diff, comms events `e28b0985`/`d3016d95`. Substance of both sets of work
landed correctly; misattribution is under Moonlit's commit subject. This is
the named foreign-stage absorption failure mode. Cure codified in §Discipline;
no code action needed on this finding.

**Code findings (code-reviewer):**

- **BF-1a (P1)**: `.husky/pre-push:73` — `turbo run ... smoke:dev:stub`
  still present. `smoke:dev:stub` task was deleted from `turbo.json`; this
  hook line causes every `git push` to fail with a turbo "unknown task" error.
  **Step 05 MUST close.**
- **BF-1b (P1)**: `.github/workflows/ci.yml:79` — `turbo run sdk-codegen
  build type-check lint test test:e2e test:ui smoke:dev:stub`. Same retired
  task. Every PR and push to `main` fails CI.
  **Step 05 MUST close.**
- **BF-2 (P2)**: `docs/architecture/architectural-decisions/121-quality-gate-surfaces.md`
  lines 64, 150, 155 — gate matrix row and prose still describe `smoke:dev:stub`
  as an active gate. ADR-147:65 also has a `test:a11y` sequencing note
  referencing the retired task. Must be updated.
- **BF-3 (P2)**: Root `README.md:139` — references removed
  `smoke:oauth-curl` script (`jq` prerequisite sentence). Must be removed.
- **BF-4 (P2)**: Multiple live ops/architecture docs still reference retired
  scripts: `docs/operations/troubleshooting.md:78,84,237` (`smoke:dev:stub`,
  `smoke:dev:live`); `docs/operations/elasticsearch-ingest-lifecycle.md:283`
  (`smoke:dev:stub`); `docs/operations/sentry-deployment-runbook.md:255`
  (`smoke:remote`); ADR-083:250, ADR-063:163,222,232 (`vitest run -c
  vitest.smoke.config.ts`); `agent-tools/docs/agent-support-tools-specification.md:567`
  (`smoke:dev:stub`). Must be updated.
- **BF-1c (clean)**: `lint:shell:syntax` change is safe — surviving
  `scripts/*.sh` glob covers remaining shell files; no shell file loses
  checking.
- **BF-1d (clean)**: `check` script chain is structurally sound after
  removing `smoke:dev:stub`.

### Commit `7620fefd` — chore(test-config): retire vitest.smoke.config.ts

**Code findings (code-reviewer):** Clean. Deletion is correct and complete:
file gone, corresponding ESLint process.env allowlist entry removed,
`vitest.config.ts` has no dependency on the deleted file. No stranded
references to `vitest.smoke.config.ts` remain in surviving workspace files.
The ESLint `no-restricted-syntax` block remains coherent.

### Commit `d4fb9a8f` — chore(test-infra): retire smoke-tests directory and all references

**Code findings (code-reviewer):** All four questions clean — remaining
workspace configs free of `smoke-tests/` paths; `commander`/`dotenv`
devDependencies correctly removed (no surviving imports); `playwright` correctly
retained (still consumed by `tests/` Playwright suites, smoke description in
commit message was imprecise); `eslint.config.ts` no-restricted-syntax block
coherent.

- **BF-5 (P1)**: `apps/oak-curriculum-mcp-streamable-http/README.md:317`
  — `See \`docs/clerk-oauth-trace-instructions.md\` for detailed OAuth flow
  documentation.` That file was deleted by this commit. Dead link.
  **Step 05 MUST close.**

**Docs findings (docs-adr-reviewer, combined with pre-confirmed items):**

- **BF-6 (P2)**: Three e2e test files contain stale `smoke-dev-auth`
  references in inline comments:
  `e2e-tests/auth-bypass.e2e.test.ts:21`,
  `e2e-tests/validation-failure.e2e.test.ts:11`,
  `e2e-tests/enum-validation-failure.e2e.test.ts:23`.
  Comments say "…and smoke-dev-auth" after `auth-enforcement.e2e.test.ts`.
  Non-blocking but misleads coverage reasoning. Must update.
- **BF-7 (P2, pre-confirmed as CR2)**: `TESTING.md:134-135` — `pnpm qg`
  references; no such script exists. Must be replaced with actual gate command.
- **BF-8 (P2, pre-confirmed)**: `docs/vercel-environment-config.md:26` —
  `LOG_LEVEL` description still reads "Useful for smoke harness diagnostics".
  Smoke harness is gone. Must update.
- **BF-9 (P3)**: `e2e-tests/vercel-ignore-runtime.e2e.test.ts:24` —
  `@remarks` says "E2E or smoke"; with smoke tier retired, "smoke" is stale
  vocabulary. Low severity.
- **BF-5-clean**: Archive docs (`docs/archive/`) contain historical smoke
  references intentionally; no cleanup required.

### Commit `b226670d` — test(http-mcp): replace retired dev-boot e2e with in-process invariant

**Architecture findings (architecture-reviewer-fred):**

- **C1 (P1, NAMED VIOLATION — CLOSED at commit `36102937`)**: Line 7:
  `import { TEST_UPSTREAM_METADATA } from '../e2e-tests/helpers/upstream-metadata-fixture.js'`
  — `src/` integration test reaching into `e2e-tests/helpers/`. Violates
  boundary per `testing-strategy.md` §"E2E tests live in the e2e-tests
  directory" + ADR-041 (Layer Role Topology) + principles.md §Layer Role Topology.
  Seven total `src/` consumers found (six pre-existing + this new file);
  six intra-tree `e2e-tests/` consumers are legitimate. Fixture is a trivial
  domain constant with one `import type` from `../../src/oauth-proxy/index.js`;
  no E2E machinery. **Resolution (fred-confirmed)**: relocate
  `e2e-tests/helpers/upstream-metadata-fixture.ts` →
  `src/test-helpers/upstream-metadata-fixture.ts`; update 12 consumer files
  (6 `src/` + 6 `e2e-tests/`; note two `src/rate-limiting/` files use
  `../../e2e-tests/` depth — both variants caught). Substance landed at
  commit `36102937` via foreign-stage absorption (peer commit subject
  reads `chore(continuity): handoff + metacognition` rather than the
  authored `refactor(http-mcp): relocate upstream-metadata-fixture to
  src/test-helpers`). Reviewer chain: architecture-reviewer-fred CLEAN
  on diff pre-landing — "C1 closes per Round 1 resolution shape"; also
  code-reviewer APPROVED WITH SUGGESTIONS (informational only). Boundary
  grep audit clean at HEAD: zero matches for the old `e2e-tests/helpers/upstream-metadata-fixture`
  path. Foreign-stage absorption pattern recurrence (second instance after
  Lacustrine→Moonlit `8fa339f4` on 2026-05-04) surfaced for owner direction.
- **BF-C1-ESLint (P2, new finding from fred)**: No ESLint guard exists
  preventing `src/**/*.ts` from importing relative paths into `../e2e-tests/`.
  The seven-consumer recurrence happened without structural enforcement. Add a
  guard in the `@oaknational/eslint-plugin-standards` rules (same fix-up plan
  or a named follow-up). Per `consolidate-at-third-consumer.md`, seven consumers
  is well past the threshold for structural enforcement. Fred recommends in-scope
  of the same step-05 pass. Recorded here; disposition decided at step-05 apply.

**Test findings (test-reviewer):**

- **CR1 (P2, downgraded from P1, NAMED VIOLATION — CLOSED at this commit)**:
  Lines 57-59 and 70-72: `if (!result.ok) { return; }` after
  `expect(result.ok).toBe(true)`. Test-reviewer confirmed Vitest throws on the
  `toBe(true)` assertion failure before the guard is reached, so this is **dead
  code, not a silent-pass**. However, it is a categorical immediate-fail per
  `test-immediate-fails.md` item 16 (runtime branching in test body) regardless
  of reachability. **Resolution applied** (this commit): substituted the canonical
  `unwrap` from `@oaknational/result` for both occurrences in
  `dev-boot-without-observability.integration.test.ts` and the matching pattern at
  `runtime-config.integration.test.ts:21-23`. Test-reviewer at closing review
  confirmed the substitution is "strictly better than the inline shape I
  originally named" — DRY, project-canonical, throws with stringified Err
  diagnostic, preserves TypeScript narrowing via `T` return, removes the
  conditional entirely. Reviewer chain: test-reviewer CLEAN, code-reviewer
  APPROVED. Conditional-pattern grep audit clean: zero matches for
  `if (!result.ok` or `if (!runtimeConfig.ok` in either file.
- **BF-T1 (P2)**: Test 2 asserts `result.value.useStubTools` and
  `result.value.version` — passthrough assertions already covered by
  `runtime-config.integration.test.ts:29`. Duplicated proof; per
  `testing-strategy.md §Rules` repeated proofs are fragile. Remove
  `useStubTools` and `version` assertions from test 2; retain
  `dangerouslyDisableAuth` (the auth-mode discriminant, primary factory logic).
- **BF-T2 (P3)**: Lines 48-49 — `toBeUndefined()` assertions on optional
  fields absent from input. Tautological under Zod's optional semantics;
  limited design value. Consider replacing with a positive assertion on a
  load-bearing field (`VERCEL_ENV` is `undefined` implies Vercel-runtime path
  not taken) or removing.
- **BF-T3 (P3, informational)**: Atomic-landing root cause — the product
  code (`createRuntimeConfigFromValidatedEnv`, `createApp`) pre-existed without
  paired integration tests. This commit is the legitimate repair under a
  plan-controlled backfill cycle, not a new violation. TDD compliance record
  notes the original breach at commits `05f994c0` et al.

### Step 04 Discipline Summary

Commit-skill protocol shape for `8fa339f4` (Moonlit Shimmering Comet, cycle 1d):

- Claim was open (`8ed6386d`) covering the correct files ✓
- Commit message describes cycle 1d content accurately ✓
- `git commit` was executed WITHOUT `-- <pathspec>` filter ✗ → peer-staged
  files from Fronded's `07a19fd1` staging-phase commit swept in
- Substance of both sets of work landed; no code regression
- Discipline gap is codified in §Discipline; recurrence prevented by the
  `stage-by-explicit-pathspec.md` rule and the no-speed-pressure rule

For remaining three commits (7620fefd, d4fb9a8f, b226670d): commit-skill
protocol shape unverifiable from commit content alone (no claim IDs recorded
in commit messages); substance is correct for each cycle.

### Named Violations Confirmed for Step 05 Mandatory Close

| ID | Finding | Closing commit | Specialist re-review |
|---|---|---|---|
| C1 | `src/dev-boot-without-observability.integration.test.ts:7` boundary-crossing import | `36102937` (peer-commit absorption; substance correct) | architecture-reviewer-fred CLEAN |
| CR1 | `src/dev-boot-without-observability.integration.test.ts:57-59,70-72` conditional-branch test-immediate-fail (also `runtime-config.integration.test.ts:21-23`) | this commit | test-reviewer CLEAN |
| BF-1a | `.husky/pre-push:73` retired turbo task | `ef593be9` | code-reviewer |
| BF-1b | `.github/workflows/ci.yml:79` retired turbo task | `ef593be9` | code-reviewer |
| BF-5 | `apps/oak-curriculum-mcp-streamable-http/README.md:317` dead link | `434cf6f6` | code-reviewer |

## Out of Scope

- The SENTRY_MODE → OBSERVABILITY_SINKS rename (paused; see
  `future/replace-sentry-mode-with-observability-sinks.plan.damaged-paused-2026-05-04.md`).
  ADR-171 cited inside that paused plan is a forward reference; this
  unified plan does not depend on it.
- Removing pre-existing real-IO from tests. The §IO Inventory documents
  the surface; migration of legacy violations is a follow-up plan, not
  this plan.
- Mutation testing meta-quality. Tracked separately per
  `mutation-testing-implementation.plan.md`.
- Clerk release-tag integrity validation under live Clerk credentials
  (recorded for post-merge staging validation; not exercised here).
- Graph-wiring work on `eef` thread (post-merge, separate branch).
- New observability or auth work — this plan is verification +
  completion only.

## Out-of-Scope Follow-ups

Reviewer findings that are valid but would fragment or complicate the
linear sequence are recorded here. Three-bucket discipline at apply
time (step 5): valid + scope-appropriate → applied; valid + out-of-scope
→ recorded here as named follow-up; rejected → written rationale.
Named follow-ups become candidate plans at the post-merge Learning Loop
consolidation pass.

- Migration of pre-existing real-IO test files captured in §IO Inventory.
  Per-workspace or per-violation-class follow-up plans, scoped to remove
  Inventory entries one batch at a time. Each migration removes paths
  from the rule's allowlist (the live canonical surface), not from the
  §IO Inventory in this plan body (the historical snapshot).
- **BF-C1-ESLint** structural guard preventing `src/**/*.ts` from importing
  relative paths into `../e2e-tests/`. Fred's Round-1 finding observed seven
  `src/` consumers crossing the boundary (six pre-existing + the dev-boot
  file at `b226670d`); recurrence happened without a structural fence. The
  C1 closure removed all current violations but did not author the guard.
  Add a `no-restricted-imports`-style rule in
  `@oaknational/eslint-plugin-standards` (companion to step 06's
  `no-real-io-in-tests`); wired at error severity per
  `no-warning-toleration`. Plan-time consensus: scope it as a separate
  post-merge follow-up rather than expanding step 05 — the immediate cure
  (relocate the fixture) is sufficient to close the named violation without
  the guard, and the guard itself merits its own atomic plan-cycle (rule
  authoring + RuleTester + path-allowlist freeze) modelled on step 06–08's
  shape.
- **Foreign-stage absorption recurring pattern** (procedural concern).
  Twice now (Lacustrine→Moonlit on `8fa339f4` 2026-05-04; Ethereal→Dawnlit
  on `36102937` 2026-05-05) parallel-session commits have absorbed peer
  staged content because the absorbing agent did not apply the mandatory
  `git commit -- <pathspec>` filter from §Discipline. Substance preserved
  in both cases; commit-message attribution distorted. Cure as currently
  written (prose §Discipline rule) is operator-applied, not gate-applied.
  Candidate follow-up: structural enforcement (pre-commit hook that
  refuses `git commit` without an explicit pathspec when peer-staged
  content is present in the index, or at the queue layer when
  `verify-staged` fingerprint diverges from the commit-time fingerprint).
  Recorded for owner direction.
- Clerk release-tag integrity exercise under real Clerk credentials in
  staging, post-merge.
- Reviewer-dispatch structural enforcement gate (currently owner-cadence;
  no lint or pre-commit hook enforces it).
- Allowlist-ADD structural enforcement (a lint or pre-commit gate that
  refuses any allowlist-path-ADD that does not cite an Inventory entry
  or a named follow-up plan). Currently PR-review enforces this
  discipline; structuralisation is a future Practice item.

## Sequence Summary

| # | Step | Output |
|---|------|--------|
| 1 | Round 1 architecture-led review | DONE — Round 1 findings under §Plan Review Findings (Round 1) |
| 2 | Apply Round 1 + Round 2 findings; commit refined plan | DONE — commit 75dbcdb6; Round 2 findings under §Plan Review Findings (Round 2) |
| 3 | Integrate no-speed-pressure rule across estate | DONE — commit `2b78aa93`; RULES_INDEX entry, **4 adapters** (`.agent/`, `.claude/`, `.cursor/`, `.agents/`), principles cross-ref, distilled entry, 1 memory feedback file; post-commit four-adapter-path verification clean |
| 4 | Reviewer backfill scoped per-commit on `fd4eabaa..b226670d` | DONE 2026-05-05 — full findings under §Backfill Findings; 5 MUST-CLOSE violations (C1, CR1, BF-1a, BF-1b, BF-5) + 8 P2 items + 4 P3 items |
| 5 | Apply backfill findings | DONE 2026-05-05 — BF-1a/b CI hook + workflow at commit `ef593be9` (Lacustrine Navigating Rudder, `dd239f`); BF-2 through BF-8 stale-smoke-reference doc cleanup at commit `434cf6f6` (Lacustrine, `dd239f`); C1 boundary-crossing import substance at commit `36102937` (Dawnlit Transiting Galaxy, `0ddc89` — substance landed at peer commit via foreign-stage absorption; architecture-reviewer-fred CLEAN + code-reviewer APPROVED WITH SUGGESTIONS pre-landing; substance correct under misleading peer-subject; documented foreign-stage absorption recurrence to surface to owner); CR1 conditional-branch test-immediate-fail × 2 integration tests at this commit (Dawnlit, `0ddc89` — test-reviewer CLEAN + code-reviewer APPROVED, used `unwrap` from `@oaknational/result` rather than inline throw per test-reviewer's confirmation that this shape is "strictly better"). Out-of-scope follow-ups (recorded in §Out-of-Scope Follow-ups, not closed in this branch): BF-T1 (duplicated assertions), P3 dispositions (BF-9, BF-T2, BF-T3), BF-C1-ESLint structural guard for `src/* → e2e-tests/*` boundary. |
| 6 | Author `no-real-io-in-tests` rule (error severity, comprehensive denylist) | DONE 2026-05-05 — rule + RuleTester (78 cases covering full Node.js IO surface incl. node:-prefixed network family, dynamic + require + bracket-notation forms, localhost lookalike hostnames, and `global.process` aliases) + plugin registration; not yet wired (Twilit Beaming Aurora, `7cf730`; Opalescent Eclipsing Asteroid, `0c263b` takeover hardening); closing commit SHA recorded post-commit; reviewer dispatch parallel (code-reviewer APPROVED WITH SUGGESTIONS + config-reviewer ISSUES FOUND no-P1 + test-reviewer ISSUES FOUND P1-gating); P1 + P2 findings closed in same commit (test gaps, bracket-notation hardening, plan-citation removal, defence-in-depth allowlist comment); P3 dispositions deferred (config-reviewer dual-enforcement with `testRules` is step-08 territory; schema `minItems: 1` is informational-only, not adopted) |
| 7 | Capture inventory + freeze allowlist atomically | DONE 2026-05-05 (Silvered Hiding Silhouette, `924167`) — closing commit `483a9e32`; §IO Inventory populated (24 violations across 23 files); allowlist option configured in shared `packages/core/oak-eslint/src/configs/recommended.ts` at `warn` severity (per owner-directed new-eslint-rules-start-warn principle, supersedes original R2-4 `error`-severity finding); architecture-reviewer-fred + architecture-reviewer-betty dispatched on wiring-location design — both Option A (shared `recommended.ts`); `test-config.ts` NOT captured (no cross-reference needed); `pnpm lint` exits 0 |
| 8 | Verify rule active + discipline recorded | Rule active at `warn` severity per step 07's supersession of R2-4 (escalation to `error` is a separate post-merge decision, NOT in scope of this branch); `pnpm lint` exits 0; allowlist-ADD discipline named in the comment block above the rule activation in `recommended.ts`; step 07 reviewer P2 findings absorbed |
| 9 | `pnpm check` green at HEAD | One-line note with SHA and gate-set cross-checked against §Gate Taxonomy |
| 10 | Dev boot + MCP tool exercise + schema validation + ordered reviewer dispatch + shutdown | `/tmp/dev-boot.log`, `/tmp/mcp-tool-exercise.log`, port 3333 free — **does not include** the Cursor oak-local precursor in § Step 10 precursor (that milestone is preparatory only) |
| 11 | Pre-merge divergence analysis vs `origin/main` | Commit-list diffs; conflict-potential findings |
| 12 | Owner-gated merge readiness declaration | Evidence bundle; release-readiness-reviewer call; owner authorisation |

### Step 10 precursor — Cursor `oak-local` MCP verified (2026-05-05)

This section records **preparatory evidence** only. It **does not** close step 10
above: merge-blocking acceptance still requires dev boot, HTTP MCP `tools/list`
and `tools/call` to `http://localhost:3333/mcp`, schema validation against the
tool catalogue, ordered specialist reviewer dispatch, and clean shutdown per the
step 10 todo body.

| Field | Record |
| --- | --- |
| When | 2026-05-05 |
| Agent | Deciduous Budding Stamen (`512682`, Cursor, GPT-5.5) |
| Transport | Cursor MCP server `project-0-oak-open-curriculum-ecosystem-oak-local` |
| Method | MCP tool calls only — no repository application-code reads |
| Tools exercised | `get-curriculum-model`; thread surface (`get-threads`, `get-threads-units`, `fetch` with thread ids, `get-thread-progressions`, `get-prior-knowledge-graph`); discovery (`search` for threads and lessons with `threadSlug`, `explore-topic`); App-oriented (`user-search`, `user-search-query`); resource `curriculum://thread-progressions` |
| Outcome | All calls succeeded; large graphs spilled to agent-tools temp files as expected. Minor catalogue-shape observations only (for example `unitCount` for `algebra` differed between `get-threads` and the thread-progressions resource) — upstream consistency, not a transport failure. |
| Immutable comms | Event id `512682-oak-local-mcp-landmark-2026-05-05` under `.agent/state/collaboration/comms-events/` |

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Round 2 reviewer findings collectively complicate the plan beyond simple-linear | Medium | Medium | Discipline: findings that fragment the sequence become §Out-of-Scope Follow-ups, not new steps |
| Step 7's rule run surfaces a violation pattern the rule was not designed to catch (false negative in denylist) | Medium | Medium | Step 6 RuleTester cases must include negative cases for dynamic imports; if step 7 finds an unanticipated form, return to step 6 to extend denylist |
| Step 8's wire-up surfaces a legitimate infra file the path-allowlist did not anticipate | Medium | Medium | Step 7 IS the dry-run AND the allowlist freeze (atomic); if step 8 fails despite step 7's allowlist, the gap is in path-glob shape; tighten allowlist (re-run step 7) before wiring; do not exempt via per-file disable comments |
| Step 10 surfaces a real test failure that did not show in iterative dev | Medium | Medium | Fix at source per never-disable-checks; if larger than mechanical, surface as named highest-priority recovery plan |
| Step 11's MCP tool exercise reveals a regression in a tool's response shape | Low | High | Schema-validation against tool catalogue catches this; regression is a merge blocker; route to owner; either fix in-branch or revert the responsible commit |
| Step 11 fails on Sentry-network unavailability (legacy SENTRY_MODE consumer hangs on DSN) | Low | Low | Boot-timeout guard at 10s; record as named operational-evidence note; not strictly merge-blocking |
| Step 12 reveals unmergeable conflicts vs `main` | Low | Medium | Per `.agent/skills/complex-merge/SKILL.md`, structured workflow if 100+ files diverged or 10+ conflicts |
| The shared-index foreign-stage-absorption that damaged commit `8fa339f4` recurs | Low | Medium | Mandatory `git commit -- <pathspec>` filter on every commit per §Discipline; peer-index cure named in §Discipline |
| Step 3 cross-platform adapter asymmetry (Claude/Cursor/Codex don't auto-load adapters) | Medium | Low | Post-commit verification of all four adapter paths (`.agent/`, `.claude/`, `.cursor/`, `.agents/`); §Discipline note that adapter loading is platform-cadence, not lint-gated |
| `e2e-tests/helpers/test-config.ts` sits at intersection of capture-not-clean §IO Inventory AND paused rename's WS4–WS5 file list | Low | Low | If file appears on §IO Inventory at step 7, resumption of paused rename will consume the Inventory entry; record in paused plan's resumption preconditions if observed |
| Step 5's NAMED VIOLATIONS (C1 boundary-crossing import + CR1 conditional-branch) are not actually closed under the apply discipline | Low | High | Acceptance gate: step 5 cannot mark complete until both NAMED violations have closing commits referenced in this plan body, AND each closing commit is specialist-reviewed by the originator of the finding (fred for C1, test-reviewer for CR1) |
| Step 5's closing commit for C1 introduces a NEW architectural violation while closing the named one | Low | Medium | Specialist re-review on closing commits (R2-3) catches this; fred reviews the relocate target's boundary shape, not just the absence of the original violation |
| Step 6 denylist misses a real-IO form (e.g. `execSync`, `node:fs` prefix) so step 7's dry-run is a false-negative | Medium | High | Step 6 brief enumerates the comprehensive Node.js IO surface; RuleTester required to cover each sub-form (R2-1); test-reviewer dispatch at step 6 validates exhaustiveness |
| Allowlist drifts post-merge — a developer adds a path without citing an Inventory entry or follow-up plan | Medium | Medium | Allowlist lives in shared `packages/core/oak-eslint/src/configs/recommended.ts` (PR-reviewed); the comment block above the rule activation names the allowlist-ADD discipline (step 7 landed it); per-file `eslint-disable` stays forbidden; structural lint-gate for ADDs is a future Practice item recorded in §Out-of-Scope Follow-ups |
| §IO Inventory and live allowlist drift apart over time as follow-up plans land migrations | High (over time) | Low | Documented separation: allowlist is canonical live enforcement; §IO Inventory is historical snapshot at merge time, not updated post-merge; migration plans touch only the allowlist |
| Step 7 capture process is lossy (rule output ambiguous; entries missed) | Low | Medium | Structured-output capture (`--format json`); count cross-check; 5-entry spot-check; re-run if either fails (R2-7) |

## Sub-agent Reviewers

The reviewer roster below names the lens for each invocation. Plan-meta
dispatch (steps 1, 2) is the architecture-quartet + code + assumptions;
specialists dispatch in the steps where they have work.

| Reviewer | Lens | Step(s) where invoked |
|---|---|---|
| `code-reviewer` | Gateway | Steps 1, 2, 3, 4, 5, every commit's pre-commit gate |
| `architecture-reviewer-barney` | Simplification-first | Steps 1, 2 (plan-meta, both rounds) |
| `architecture-reviewer-betty` | Cohesion + change-cost | Steps 1, 2 (plan-meta, both rounds) |
| `architecture-reviewer-fred` | ADR/principles compliance | Steps 1, 2 (plan-meta, both rounds), 4(d) (boundary-crossing import identification), 5 (C1 closing commit re-review) |
| `architecture-reviewer-wilma` | Adversarial / failure modes | Steps 1, 2 (plan-meta, both rounds) |
| `assumptions-reviewer` | Proportionality, blocking legitimacy | Steps 1, 2 (plan-meta, both rounds) |
| `test-reviewer` | Test discipline integrity | Steps 4(d) (b226670d conditional-branch identification), 5 (CR1 closing commit re-review), 6 (RuleTester describe-vs-audit + Node.js IO API surface coverage) |
| `config-reviewer` | Tooling-config correctness | Steps 6 (allowlist shape), 7 (allowlist config), 8 (wire-up) |
| `docs-adr-reviewer` | Doc alignment | Steps 4(c) (stranded references), 7 (Inventory completeness + cross-reference discipline) |
| `mcp-reviewer` | MCP protocol | Step 10 (first in dispatch order; halt on P1) |
| `security-reviewer` | Auth + trust-boundary | Step 10 (parallel with clerk + sentry on clean mcp return) |
| `clerk-reviewer` | Clerk middleware | Step 10 (parallel) |
| `sentry-reviewer` | Observability surface | Step 10 (parallel) |
| `accessibility-reviewer` | a11y over UI/widget responses | Step 10 (last; conditional on UI/widget content in captured payloads) |
| `onboarding-reviewer` | Plan readability | Step 2 if Round 2 surfaces readability concern (none did) |
| `release-readiness-reviewer` | GO/GO-WITH-CONDITIONS/NO-GO synthesis | Step 12 |

## Quality Gates

After steps that author code (3, 5, 6, 7, 8, 9), per
`.agent/plans/templates/components/quality-gates.md`:

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm test
```

Step 10 runs the full canonical chain:

```bash
pnpm check
```

This expands to the gate taxonomy per
`docs/governance/development-practice.md §Gate Taxonomy`. Step 10
captures the actual gate set and cross-checks against the taxonomy
documentation. All exit 0.

## Acceptance

- All twelve steps closed with commit SHAs (or explicit no-op
  notes) recorded in this plan body.
- `pnpm check` exits 0 at the repo root (step 9).
- Dev server boots locally with `SENTRY_MODE=sentry` and reaches
  `listening` (or records named operational-evidence note for
  Sentry-network unavailability) (step 10a).
- MCP tools exercise via protocol succeeds: `tools/list` returns >0
  tools; three `tools/call` exchanges return tool-catalogue-schema-valid
  responses (step 10b/c).
- If any tool response surfaces UI/widget content, accessibility-reviewer
  pass clean (step 10d).
- Pre-merge divergence analysis clean (step 11).
- `no-real-io-in-tests` ESLint rule wired into the shared
  `packages/core/oak-eslint/src/configs/recommended.ts` config at **`warn`
  severity** (per the new-eslint-rules-start-warn principle; escalation
  to `error` is a separate post-merge decision) and passing across all
  workspaces; rule's allowlist exactly matches §IO Inventory's path set
  at merge time (step 8 verifies; step 7 wired).
- §IO Inventory populated at step 7 with one entry per discovered
  violation; each entry has path, kind, rationale, disposition; entry
  count cross-checked against rule's structured output count.
- No-speed-pressure rule integrated across `RULES_INDEX.md`,
  Claude/Cursor/Codex/`.agents` adapters (4 paths total), `principles.md`
  cross-ref, `distilled.md`, and one user-memory feedback file (step 3);
  post-commit four-adapter-path verification clean.
- Reviewer-backfill findings on commits `fd4eabaa..b226670d` applied
  per-commit-scope or rejected with rationale (steps 4–5); NAMED
  VIOLATIONS C1 (boundary-crossing import) and CR1 (conditional-branch
  test-immediate-fail) closed with commit references in this plan body
  AND specialist re-review on the closing commits (fred for C1;
  test-reviewer for CR1).
- Owner authorises merge (step 12).

## Plan Exit

- All steps closed.
- Branch `feat/eef_exploration` ready for merge into `main`.
- Plan moved to `archive/completed/`.

## Lifecycle Triggers

Per `.agent/plans/templates/components/lifecycle-triggers.md`:

- **Plan promotion**: this plan is `current/` at refresh; promote to
  `active/` when step 2's commit lands.
- **ADR/PDR creation**: none required by this plan; the no-speed-pressure
  rule is already authored. If Round 2 surfaces a PDR-worthy pattern,
  record under §Out-of-Scope Follow-ups.
- **Memory graduation**: step 3 graduates one feedback observation to
  user-memory; one entry to `distilled.md`.
- **Pattern extraction**: post-merge consolidation may extract patterns
  from this plan's execution.
- **Plan archive**: post-merge, this plan moves to `archive/completed/`
  with closure note linking to the merge commit on `main`.

## Learning Loop

After plan close (post-merge), run `/jc-consolidate-docs` per the
session-handoff convention. Likely consolidation candidates:
the no-speed-pressure rule (graduate to PDR if a second instance
surfaces); the capture-not-clean shape for forward-only enforcement
(graduate to a PDR if a second arc adopts it); the foreign-stage
absorption pattern (capture if not already recorded); the
boundary-crossing-import-as-named-violation discipline (graduate if
recurrent).

## Related Plans

- `archive/completed/fix-dev-boot-release-resolution.plan.md` — plan 1,
  landed.
- `future/replace-sentry-mode-with-observability-sinks.plan.damaged-paused-2026-05-04.md`
  — plan 2, paused-superseded; this unified plan ships through merge
  with legacy `SENTRY_MODE` as the live contract.
