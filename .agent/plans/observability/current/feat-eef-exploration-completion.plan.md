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
  in eslint.config.ts (step 7), and wire the rule into root config
  at error severity (step 8). Steps 9–12 run gates green, exercise
  MCP tools live with ordered specialist dispatch, analyse
  divergence, and declare merge-ready.
status: current
isProject: true
todos:
  - id: 01-comprehensive-plan-review-round-1
    content: "DONE 2026-05-04 (Pelagic Diving Atoll). Architecture-led review pass dispatched in parallel: code-reviewer (gateway) + architecture-reviewer-{barney,betty,fred,wilma} + assumptions-reviewer. Six reviewers ran on plan body AND code surface (commits fd4eabaa..b226670d, no-speed-pressure rule, observability/env package areas). Findings captured in §Plan Review Findings (Round 1)."
    status: completed
  - id: 02-apply-round-1-findings-and-second-review
    content: "Apply Round 1 findings to refine this plan body. Then dispatch a second review round on the revised plan body (same six reviewers; owner-directed pre-execution gate). Apply any Round 2 findings. Commit the refined plan via full commit-skill protocol (single atomic commit with code-reviewer dispatch at close). After this step the plan body is the contract for the rest of execution. Findings explicitly rejected get written rationale per principles.md."
    status: pending
    depends_on: [01-comprehensive-plan-review-round-1]
  - id: 03-integrate-no-speed-pressure-rule
    content: "Integrate the already-authored .agent/rules/no-speed-pressure.md across the rule estate in one commit: add to RULES_INDEX.md (canonical platform-independent enumeration); create thin adapters at .claude/rules/no-speed-pressure.md, .cursor/rules/no-speed-pressure.mdc, .agents/rules/no-speed-pressure.md; add one-line cross-reference from principles.md §Architectural Excellence Over Expediency; add one distilled.md entry; write a single user-memory feedback file feedback_no_speed_pressure.md with MEMORY.md index update. The other three speculative failure-mode feedback files originally proposed (performed-grounding-vs-practised, rule-conflict-is-signal, auto-mode-not-permission-slip) are NOT authored at this step — graduate them only when a second instance is observed in the field. Post-commit: verify all four adapter paths exist and resolve identically (`.agent/rules/no-speed-pressure.md`, `.claude/rules/no-speed-pressure.md`, `.cursor/rules/no-speed-pressure.mdc`, `.agents/rules/no-speed-pressure.md`). Land via full commit-skill protocol with code-reviewer dispatch. CLOSED 2026-05-04 (Lacustrine Navigating Rudder, `dd239f`); commit SHA recorded in §Sequence Summary post-commit."
    status: completed
    depends_on: [02-apply-round-1-findings-and-second-review]
  - id: 04-reviewer-backfill-scoped-by-commit-risk
    content: "Backfill reviewer dispatch on the four already-landed plan-3 commits (fd4eabaa..b226670d), scoped by per-commit risk surface (not blanket specialist coverage): (a) 8fa339f4 (cycle 1d, scripts retire + foreign-stage absorption incident): code-reviewer gateway, AND read the commit message + stage log to verify the commit-skill protocol shape (peer-stage absorption was a discipline failure, not a code miss; gateway code review alone does not validate that the commit-skill substrate ran); (b) 7620fefd (cycle 1b, vitest.smoke.config.ts retire): code-reviewer gateway only; (c) d4fb9a8f (cycle 1a, smoke-tests directory retire): code-reviewer gateway + docs-adr-reviewer for stranded references in TESTING.md / dev-server-management.md / vercel-environment-config.md / playwright.config.ts; (d) b226670d (cycle 1c, in-process invariant test): code-reviewer gateway + test-reviewer (conditional-branch test-immediate-fail at lines 57-59, 70-72 + 22-item checklist) + architecture-reviewer-fred (boundary-crossing import at line 7: src/ -> e2e-tests/helpers/). Capture findings under §Backfill Findings."
    status: pending
    depends_on: [03-integrate-no-speed-pressure-rule]
  - id: 05-apply-backfill-findings
    content: "For each Round-2-confirmed Round-1 finding and each backfill finding from step 04: implement the fix as its own atomic commit via full commit-skill protocol OR record explicit written rejection rationale. The boundary-crossing import (apps/oak-curriculum-mcp-streamable-http/src/dev-boot-without-observability.integration.test.ts line 7) is a NAMED OUTSTANDING VIOLATION that MUST close at this step (not 'may close'); its closing commit MUST be reviewed by architecture-reviewer-fred (the specialist who identified it) — not the gateway alone. The conditional-branch pattern at lines 57-59, 70-72 is a NAMED test-immediate-fail that MUST close; its closing commit MUST be reviewed by test-reviewer (the specialist who identified it). Reviewer findings are action items by default per principles.md §Compiler Time Types and Runtime Validation."
    status: pending
    depends_on: [04-reviewer-backfill-scoped-by-commit-risk]
  - id: 06-author-no-real-io-in-tests-rule
    content: "Author packages/core/oak-eslint/src/rules/no-real-io-in-tests.ts as the structural guard against NEW real-IO in tests. **Severity: error** (not warn) — per no-warning-toleration; pnpm lint must exit non-zero on any new violation. Trigger surface: any *.test.ts | *.spec.ts file (matching ESLint's existing test glob), excluding allowlist below. **Denylist (comprehensive Node.js IO surface)**: (i) child_process: spawn, exec, fork, execFile, spawnSync, execSync, execFileSync; (ii) worker_threads: Worker constructor; (iii) fs: ALL named imports (readFile, writeFile, readFileSync, writeFileSync, mkdtemp, stat, etc.) AND default imports (`import fs from 'fs'` / `import fs from 'node:fs'`) AND fs/promises module (`import { readFile } from 'fs/promises'`) AND dynamic forms (`await import('fs')`, `await import('node:fs')`, `await import('fs/promises')`, `require('fs')`); (iv) process: read OR mutation of process.env (also `globalThis.process.env`), process.cwd(), process.chdir(); (v) network: fetch() / http.* / https.* / net.* / dgram.* to non-localhost. **Both** unprefixed (`fs`) AND `node:`-prefixed (`node:fs`) specifiers must be caught. **Allowlist (path-shape only, NOT 'designated' adjective)**: vitest.config.ts | vitest.*.config.ts | vitest.setup.ts at workspace roots; **/test-helpers/** | **/test-fakes/** structurally-marked directories. Pair with no-real-io-in-tests.unit.test.ts (RuleTester cases) — RuleTester MUST cover negative cases for every denylist sub-form above (one negative case per Sync variant; one per fs API entry point; one per node: prefix; one for default import; one for fs/promises; one for globalThis.process.env; one per child_process factory; one for Worker constructor) AND positive cases for every allowlist sub-glob. Plugin registration in plugin.ts. **Do NOT yet wire into root eslint.config.ts.** Land via full commit-skill protocol with config-reviewer dispatch (allowlist-shape correctness) + test-reviewer dispatch (RuleTester describe-vs-audit shape AND surface coverage exhaustiveness against Node.js IO API enumeration). Acceptance: pnpm test --filter @oaknational/eslint-plugin-standards exits 0; the rule is registered but inactive at root."
    status: pending
    depends_on: [05-apply-backfill-findings]
  - id: 07-capture-inventory-and-freeze-allowlist
    content: "Run the rule in dry-run mode and freeze its allowlist atomically in one commit. (a) Invoke ESLint with the rule registered (one-off lint command per package) using `--format json` (or equivalent structured output). Pipe to a temporary capture file. (b) Count violations from the structured output. (c) Populate §IO Inventory in this plan body: one entry per violation with absolute path, violation kind (spawn / exec-sync / fs / fs-promises / dynamic-import-fs / process-env / process-cwd / fetch / worker), one-sentence rationale for current presence, follow-up disposition (in-scope-of-named-follow-up-plan / structural-ambiguity-to-investigate / accept-and-document). (d) Validate Inventory entry count matches the rule's output count; spot-check 5 random Inventory entries against the rule output for accuracy; if either check fails, re-run capture before proceeding. (e) Configure the rule's path-allowlist as an option block in eslint.config.ts at the repo root, listing exactly the paths captured in (c). Per-file ESLint disable comments are FORBIDDEN (never-disable-checks). (f) **If `apps/oak-curriculum-mcp-streamable-http/e2e-tests/helpers/test-config.ts` appears in the captured set, append a cross-reference into the paused plan's resumption preconditions (`.agent/plans/observability/future/replace-sentry-mode-with-observability-sinks.plan.damaged-paused-2026-05-04.md`) before committing** — the file sits at the intersection of this Inventory and that plan's WS4–WS5 file list (Round 1 finding C6). The §IO Inventory and the allowlist start identical; the **allowlist is the canonical live enforcement surface** going forward, the §IO Inventory is the **historical snapshot** at merge time and is NOT updated by post-merge migrations (follow-up plans remove paths only from the allowlist). Land via full commit-skill protocol with config-reviewer (allowlist shape) + docs-adr-reviewer (Inventory completeness + cross-reference discipline) dispatch."
    status: pending
    depends_on: [06-author-no-real-io-in-tests-rule]
  - id: 08-wire-rule-into-root-config
    content: "Wire no-real-io-in-tests into eslint.config.ts at the repo root (the rule's options block from step 07 is already in place). Acceptance: `pnpm lint` exits 0 across the entire monorepo (the allowlist absorbs the §IO Inventory; nothing else fires). Discipline note: any future PR that adds a path to the allowlist option must cite either a §IO Inventory entry (frozen at this branch's merge) or a named follow-up plan; PR review enforces this discipline (no structural lint gate). Land via full commit-skill protocol with config-reviewer dispatch. After this step the rule is active and any new test-IO not on the allowlist is a hard build failure."
    status: pending
    depends_on: [07-capture-inventory-and-freeze-allowlist]
  - id: 09-pnpm-check-green
    content: "From a clean tree on feat/eef_exploration HEAD, run `pnpm check` at the repo root. Capture the actual command's output and cross-check the gate set against docs/governance/development-practice.md §Gate Taxonomy (nine layers). All gates must exit 0. Document the result with HEAD SHA and the captured gate set in this plan body. Fix any failure at the source per never-disable-checks; if larger than mechanical, surface to owner with a named highest-priority recovery plan."
    status: pending
    depends_on: [08-wire-rule-into-root-config]
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

**Last Updated**: 2026-05-04 (Lacustrine Navigating Rudder, step-03 close)
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
  rule's path-allowlist (configured at step 7, wired at step 8) is
  configuration, not check-disablement; per-file ESLint-disable
  comments are forbidden.
- **no-warning-toleration**: rule wires at error severity (step 6); any
  new warning surfaced by step 9 (`pnpm check`) is fixed at source in
  the same work-item.
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
  step 7 places the allowlist in `eslint.config.ts` rule-options block
  (PR-reviewed); step 8 names the comment-discipline ("any future PR
  adding a path must cite an Inventory entry or named follow-up plan");
  per-file `eslint-disable` comments stay forbidden.
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

## IO Inventory (populated by step 7)

The §IO Inventory captures the frozen real-IO surface present in tests
at this branch's merge time. Format per entry:

```text
- path: <absolute path>
  kind: spawn | exec-sync | fs | fs-promises | dynamic-import-fs | process-env | process-cwd | fetch | worker
  rationale: <one sentence on why the IO is currently present>
  disposition: in-scope-of <plan slug> | structural-ambiguity-to-investigate | accept-and-document
```

Empty until step 7 runs. The Inventory and the rule's allowlist (also
landed in step 7) start identical; the **allowlist is the canonical live
enforcement surface** going forward, the **§IO Inventory is the
historical snapshot** at merge time and is NOT updated by post-merge
migrations (follow-up plans remove paths only from the allowlist).

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
| 2 | Apply Round 1 + Round 2 findings; commit refined plan | DONE for application; commit pending; Round 2 findings under §Plan Review Findings (Round 2) |
| 3 | Integrate no-speed-pressure rule across estate | DONE — RULES_INDEX entry, **4 adapters** (`.agent/`, `.claude/`, `.cursor/`, `.agents/`), principles cross-ref, distilled entry, 1 memory feedback file; commit SHA recorded post-landing; post-commit four-adapter-path verification |
| 4 | Reviewer backfill scoped per-commit on `fd4eabaa..b226670d` | Findings under §Backfill Findings; gateway+commit-skill discipline check on `8fa339f4`; specialists on substantive commits |
| 5 | Apply backfill findings | Per-finding atomic commits or written rejections; named violations C1 + CR1 closed with **specialist re-review on closing commits** |
| 6 | Author `no-real-io-in-tests` rule (error severity, comprehensive denylist) | Rule + RuleTester (full Node.js IO surface coverage) + plugin registration; not yet wired |
| 7 | Capture inventory + freeze allowlist atomically | §IO Inventory populated AND allowlist option configured in eslint.config.ts in one commit; structured-output capture; count + spot-check validation; `test-config.ts` cross-reference if present |
| 8 | Wire rule into root config | Rule active (error severity); `pnpm lint` exits 0; allowlist-discipline note for future PR additions |
| 9 | `pnpm check` green at HEAD | One-line note with SHA and gate-set cross-checked against §Gate Taxonomy |
| 10 | Dev boot + MCP tool exercise + schema validation + ordered reviewer dispatch + shutdown | `/tmp/dev-boot.log`, `/tmp/mcp-tool-exercise.log`, port 3333 free |
| 11 | Pre-merge divergence analysis vs `origin/main` | Commit-list diffs; conflict-potential findings |
| 12 | Owner-gated merge readiness declaration | Evidence bundle; release-readiness-reviewer call; owner authorisation |

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
| Allowlist drifts post-merge — a developer adds a path without citing an Inventory entry or follow-up plan | Medium | Medium | Allowlist lives in `eslint.config.ts` (PR-reviewed); step 8 names the comment-discipline; per-file `eslint-disable` stays forbidden; structural lint-gate for ADDs is a future Practice item recorded in §Out-of-Scope Follow-ups |
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
- `no-real-io-in-tests` ESLint rule wired into root config at **error
  severity** and passing across all workspaces; rule's allowlist
  exactly matches §IO Inventory's path set at merge time (step 8).
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
