---
name: "PR 108 Quality-Gate Snagging"
overview: >
  Clear the two failing quality gates on PR #108 (CodeQL alert #90,
  SonarCloud Quality Gate failing on 40 new issues, 12 unreviewed
  hotspots, and 6.0% new-code duplication) by per-finding disposition
  aligned with the Sonar Disposition Policy and the
  never-disable-checks rule, plus targeted duplication consolidation.
type: quality-fix
status: planning
source_pr: 108
source_pr_head: f4ca84f645ee94d4c9479b4f1e82759efaa4e3b1
thread: connecting-oak-resources
plan_collection: connecting-oak-resources/knowledge-graph-integration
landing_target_per_pdr_026: >
  PR #108 reaches all-green CI on its next push: CodeQL aggregate "no
  new alerts" attributed to this PR, SonarCloud Quality Gate PASS on
  every condition (`new_violations = 0`,
  `new_security_hotspots_reviewed = 100%`,
  `new_duplicated_lines_density ≤ 3%`), and no quality-gate regression
  elsewhere.
primary_artefacts:
  - apps/oak-curriculum-mcp-streamable-http/src/app/bootstrap-helpers.ts
  - packages/core/graph-core/src/term/index.unit.test.ts
  - packages/core/graph-core/src/canon/canonicalize.unit.test.ts
  - agent-tools/src/bin/agent-tools-cli-topics.ts
  - agent-tools/src/context-cost/cli-options.ts
  - agent-tools/src/practice-fitness/markdown.ts
  - agent-tools/src/practice-fitness/paths.ts
  - agent-tools/src/collaboration-state/tui/operator-value.ts
  - agent-tools/src/collaboration-state/tui/config.ts
  - agent-tools/src/bin/skills-adapter-generate.ts
  - agent-tools/src/bin/agent-identity.ts
  - agent-tools/src/bin/agent-tools.ts
  - agent-tools/src/bin/branch-touched-files.ts
  - agent-tools/src/bin/codex-exec.ts
  - agent-tools/scripts/repo-check.ts
  - agent-tools/tests/repo-check.integration.test.ts
  - agent-tools/tests/skills-adapter-generate/generator.unit.test.ts
  - agent-tools/tests/collaboration-state/comms-event-schema.unit.test.ts
  - packages/core/oak-eslint/src/rules/boundary.ts
  - packages/core/graph-core/src/data-factory/index.ts
  - packages/core/graph-core/src/jsonld/processor.ts
  - packages/core/graph-core/src/jsonld/processor-types.ts
  - packages/core/graph-core/eslint.config.ts
  - packages/libs/graph-ingest/eslint.config.ts
  - packages/libs/graph-project/eslint.config.ts
  - packages/libs/graph-project/src/property-graph/index.ts
  - packages/libs/graph-ingest/src/custom-mapping/index.ts
  - packages/libs/graph-ingest/src/index.ts
  - packages/libs/graph-ingest/src/jsonld-compatible/index.ts
  - packages/libs/graph-ingest/src/node-edge-list/index.ts
  - packages/libs/graph-ingest/src/plain-json-tree/index.ts
  - docs/governance/sonar-disposition-policy.md
  - sonar-project.properties
out_of_scope:
  - Any change to the graph-stack Inc.1 cycle sequencing or scope.
  - Re-running superseded plan or specialist-review openers.
  - Inc.1b / Inc.1c work (Threads adapter, Thread→Unit query proof).
  - WS1.3 DataFactory implementation (referenced by S1135 TODO comment;
    that work belongs to its own cycle on the graph-stack plan).
  - Disabling, downgrading, or path-excluding any quality gate (per
    `.agent/rules/never-disable-checks.md`); any expansion of the
    mechanical `sonar.issue.ignore.multicriteria` encoding goes through
    the policy's Expansion Discipline, not this plan.
todos:
  - id: phase-0-reground
    content: >
      Phase 0: re-read sonar-disposition-policy + never-disable-checks +
      principles.md §Code Quality; classify each of the 53 findings (1
      CodeQL alert + 40 Sonar issues + 12 Sonar hotspots) against the
      documented classes; record the per-finding disposition ledger
      before any code change.
    status: pending
  - id: cycle-1-codeql-90-disposition
    content: >
      Cycle 1 (planning-only commit): extend the in-file TSDoc note in
      bootstrap-helpers.ts to cover CodeQL alert #90 (createRequestLogger
      misclassification) alongside the existing #69 (createCorrelationMiddleware)
      note; dismiss #90 in the GitHub CodeQL UI as FALSE_POSITIVE citing
      the extended note. One commit.
    status: pending
    depends_on: [phase-0-reground]
  - id: cycle-2-s5332-hotspots-disposition
    content: >
      Cycle 2 (no code change): dispose all 11 S5332 hotspots
      (10 in graph-core term tests, 1 in canon test) SAFE per
      Sonar Disposition Policy §S5332 — RDF/JS test URIs use the
      W3C-reserved `http://example.org/...` namespace as opaque RDF
      Term identifiers, not network endpoints. Each disposition posted
      via `change_security_hotspot_status` with site-specific rationale.
    status: pending
    depends_on: [phase-0-reground]
  - id: cycle-3-s4036-hotspot-disposition
    content: >
      Cycle 3: read agent-tools/src/bin/agent-tools-cli-topics.ts:96
      to verify it matches Sonar Disposition Policy §S4036 SAFE criteria
      (dev/CI tooling, standard toolchain binary). If yes: dispose SAFE
      with site-specific rationale. If no: code-fix and FIXED disposition.
    status: pending
    depends_on: [phase-0-reground]
  - id: cycle-4-mechanical-issue-fixes
    content: >
      Cycle 4 (one or more commits): apply mechanical fixes for
      auto-resolvable issue rules — S6653 Object.hasOwn (×2), S6594
      RegExp.exec (×1), S6582 optional chain (×1), S7755 Array.at
      (×1), S6564 redundant type alias (×3), S4323 union → type alias
      (×1), S7780 String.raw (×3), S7786 new TypeError (×1), S7763
      export ... from (×4). Each cycle one rule-cluster + one commit.
    status: pending
    depends_on: [phase-0-reground]
  - id: cycle-5-refactor-issue-fixes
    content: >
      Cycle 5 (one or more commits): refactor-shaped fixes — S3358
      nested ternary (×3), S4624 nested template literals (×2), S7721
      move function to outer scope (×1), S7735 unexpected negated
      condition (×1), S7737 object literal default param (×1). Each
      rule-cluster one cycle with paired-test discipline where tests
      exist for affected functions.
    status: pending
    depends_on: [phase-0-reground]
  - id: cycle-6-architectural-judgement-issues
    content: >
      Cycle 6: per-site architectural-judgement for S7785 top-level
      await (×5 across agent-tools CLI bins) and S7787 bare re-exports
      (×7 across graph-ingest registry surfaces). Each site is either
      FIXED (refactor to comply) or FALSE_POSITIVE (architectural
      reason at this site, posted with site-specific rationale). No
      blanket disposition.
    status: pending
    depends_on: [phase-0-reground]
  - id: cycle-7-s1135-todo-disposition
    content: >
      Cycle 7: dispose the S1135 TODO comment in
      packages/core/graph-core/src/data-factory/index.ts. The
      comment is the WS1.3 placeholder per the graph-stack plan. Either
      reshape the comment to a non-TODO form (e.g. `NEXT-CYCLE` marker)
      so the rule does not fire, OR FALSE_POSITIVE with site rationale.
      Code change minimal.
    status: pending
    depends_on: [phase-0-reground]
  - id: cycle-8-s5443-mechanical-encoding-check
    content: >
      Cycle 8: investigate why the existing S5443 mechanical encoding
      did not exempt `agent-tools/tests/repo-check.integration.test.ts`
      (the path matches `**/tests/**` so the glob should fire).
      Outcome: either confirm the gate run pre-dated the encoding push
      (zombie finding — push to re-analyse), or identify the actual
      Sonar resourceKey shape and propose a policy-encoding amendment
      via the Expansion Discipline. Per-site FALSE_POSITIVE disposition
      as a stop-gap if the policy amendment is owner-gated.
    status: pending
    depends_on: [phase-0-reground]
  - id: cycle-9-eslint-config-consolidation
    content: >
      Cycle 9: extract the shared graph-* `eslint.config.ts` shape
      into a single base config (likely under packages/core/oak-eslint/
      or a sibling shared workspace) and import-and-extend from it in
      graph-core, graph-ingest, graph-project, and oak-design-ink.
      Removes ~170 new duplicated lines (~11% of duplication budget).
      Validates via `pnpm lint` staying green across the four workspaces
      and the .agent/rules/consolidate-at-third-consumer principle being
      satisfied. One commit.
    status: pending
    depends_on: [phase-0-reground]
  - id: cycle-10-residual-duplication-disposition
    content: >
      Cycle 10: if after cycle 9 the new-code duplication density is
      still above 3%, profile the residual duplication. Three legitimate
      remediations: (a) consolidate further true source duplication
      (e.g. agent-tools CLI bootstrap stanza, comms-event test fixtures);
      (b) draft a Sonar Disposition Policy amendment proposing the
      class-level treatment of generated-code duplication via
      Expansion Discipline (policy amendment → owner authorisation →
      config); (c) accept that the gate stays red until cycle 9 +
      consolidation lands sufficient density. NO `sonar.cpd.exclusions`
      change without owner authorisation.
    status: pending
    depends_on: [cycle-9-eslint-config-consolidation]
  - id: phase-final-validation
    content: >
      Phase final: run `pnpm check` locally (clean tree); push to PR 108;
      observe gates on the resulting head; record green CI as the
      acceptance signal. If any gate is still failing, route back to the
      relevant cycle.
    status: pending
    depends_on:
      - cycle-1-codeql-90-disposition
      - cycle-2-s5332-hotspots-disposition
      - cycle-3-s4036-hotspot-disposition
      - cycle-4-mechanical-issue-fixes
      - cycle-5-refactor-issue-fixes
      - cycle-6-architectural-judgement-issues
      - cycle-7-s1135-todo-disposition
      - cycle-8-s5443-mechanical-encoding-check
      - cycle-9-eslint-config-consolidation
      - cycle-10-residual-duplication-disposition
---

# PR 108 Quality-Gate Snagging

**Last Updated**: 2026-05-21
**Status**: 🟡 PLANNING
**Scope**: Clear the two failing quality gates on PR #108
(`feat: graph Inc.1a foundation + cost-of-collab P0 + agent-tools comms`,
head `f4ca84f`) so the substrate landing is unblocked. CodeQL aggregate
fail (1 high-severity false-positive alert) + SonarCloud Quality Gate
fail (40 new issues, 12 unreviewed hotspots, 6.0% new-code duplication).

---

## Context

PR #108 is the long-lived graph-stack foundation branch. All functional
gates are green (`run-quality-gates`, CodeQL sub-jobs, Cursor Bugbot,
Vercel) and there are no human reviewer comments outstanding (both
Copilot reviews bailed on the 300-file limit; Bugbot returned clean).
Only two quality gates fail, and both fail on quality-of-code shape,
not on behavioural defects.

### Issue 1: CodeQL aggregate "fail" — 1 new high-severity alert

**Evidence**: CodeQL aggregate check reports
[`1 new alert including 1 high severity security vulnerability`](https://github.com/oaknational/oak-open-curriculum-ecosystem/runs/77272651925),
attributed to PR #108.

- Rule: `js/missing-rate-limiting` (security-severity HIGH, severity warning).
- Site: `apps/oak-curriculum-mcp-streamable-http/src/app/bootstrap-helpers.ts:151–154`
  — the debug-only request logger inside `setupBaseMiddleware`.
- Message: "This route handler performs authorization, but is not rate-limited."

**Root cause**: misclassification. `createRequestLogger(...)` is
cross-cutting middleware registered ahead of the entire route tree,
not an authorisation route handler. CodeQL's data-flow rule marks any
middleware that ends up on a path where authorisation is later
performed as "a route handler that performs authorisation." Rate
limiting is correctly applied at the auth routes themselves (see
`apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts` —
alert 81 is the genuine rate-limit boundary and was the recognised
remediation point).

**Existing precedent**: the same file already documents the identical
misclassification class for alert #69 (`createCorrelationMiddleware`)
in the TSDoc of `setupBaseMiddleware`:

```134:139:apps/oak-curriculum-mcp-streamable-http/src/app/bootstrap-helpers.ts
/**
 * Sets up base Express middleware: JSON, correlation, and debug request logging.
 * Error handlers register later for Sentry compatibility. Not a route handler:
 * CodeQL #69 (line 146, `app.use(createCorrelationMiddleware(...))`) is a
 * misclassification — correlation middleware is cross-cutting, not auth-bearing.
 */
```

Alert #90 fired because this file was refactored on the branch
(commit `688ccef2` — `createApp` shared-state defect cure). The
line numbers shifted and CodeQL re-scored the `createRequestLogger`
call as new.

### Issue 2: SonarCloud Quality Gate — three failing conditions

Live status from `https://sonarcloud.io/api/qualitygates/project_status`
(head `f4ca84f`):

| Condition | Threshold | Actual | Status |
| --- | --- | --- | --- |
| `reliability_rating` | ≤ 3 | — | OK |
| `security_rating` | = 1 | — | OK |
| `security_hotspots_reviewed` (overall) | ≥ 100 | — | OK |
| **`new_duplicated_lines_density`** | ≤ 3% | **6.003%** | ERROR |
| **`new_security_hotspots_reviewed`** | = 100% | **0%** | ERROR |
| **`new_violations`** | = 0 | **40** | ERROR |

#### 2a — 40 new issues (none high-severity)

18 distinct rules, all in TypeScript files introduced or modified by
PR #108. None are security-class. The two CRITICAL hits are S5443 on
`agent-tools/tests/repo-check.integration.test.ts` — `os.tmpdir()` test
scaffolding that should already be exempt under the existing
mechanical encoding (see Issue 4 below for the investigation surface).

Grouped by rule cluster:

| Cluster | Rules | Count | Shape |
| --- | --- | --- | --- |
| **Mechanical** (rule has a canonical 1-liner fix) | S6653, S6594, S6582, S7755, S6564, S4323, S7780, S7786, S7763 | 17 | Refactor to a more modern API at each site. |
| **Refactor** (rule needs a structural change) | S3358, S4624, S7721, S7735, S7737 | 8 | Restructure: extract nested ternary, hoist function, etc. |
| **Architectural judgement** (rule fires on conscious choice) | S7785, S7787 | 12 | Per-site decision: comply with rule, or FALSE_POSITIVE with site rationale. |
| **TODO placeholder** | S1135 | 1 | Comment is a WS1.3 placeholder; reshape or FALSE_POSITIVE. |
| **Already-encoded test path** | S5443 | 2 | Should be exempt via existing mechanical encoding — investigate. |

Full per-rule list is the per-finding disposition ledger captured in
**Phase 0**.

#### 2b — 12 unreviewed security hotspots

| Rule | Count | Where | Class |
| --- | --- | --- | --- |
| `typescript:S5332` (insecure `http://`) | 11 | 10 sites in `packages/core/graph-core/src/term/index.unit.test.ts` (lines 28, 29, 30, 42, 123, 124, 125, 179, 180, 181) + 1 site in `…/canon/canonicalize.unit.test.ts:80` | Documented SAFE class — see [`docs/governance/sonar-disposition-policy.md`](../../../../docs/governance/sonar-disposition-policy.md) §S5332. |
| `typescript:S4036` (PATH-resolved command) | 1 | `agent-tools/src/bin/agent-tools-cli-topics.ts:96` | Documented SAFE class — see policy §S4036, but site-shape inspection required (the policy's SAFE criteria for S4036 are not mechanically decidable). |

**All 12 hotspots are vulnerabilityProbability LOW.** The mechanical
`sonar.issue.ignore.multicriteria` encoding in
[`sonar-project.properties`](../../../../sonar-project.properties)
applies only to issues, not to hotspots — that's why these are still
TO_REVIEW. The per-site disposition is the policy-mandated path.

#### 2c — 6.0% new-code duplication

Math: 1,601 duplicated new lines / 26,669 total new lines = 6.003%
(limit ≤ 3%). 37 files contribute. The distribution:

| Surface | Dup lines | Notes |
| --- | --- | --- |
| Auto-generated SDK types and stubs | ~743 (~46%) | `api-schema-base.ts` (494), `path-parameters.ts` (117), `mcp-tools/stubs/tools/*.ts` (~129). All carry the `GENERATED FILE - DO NOT EDIT` banner. |
| Workspace ESLint config copy | ~173 (~11%) | graph-core / graph-ingest / graph-project / oak-design-ink each have ~47 dup lines of identical ESLint config shape. **Third-consumer trigger** per [`consolidate-at-third-consumer`](../../../../.agent/rules/consolidate-at-third-consumer.md). |
| Test fixtures and scaffolding | ~370 (~23%) | `check-blocked-content.integration.test.ts` (149), comms-render / comms-event-schema / state-parsers test fixtures (~115), `ci-turbo-report.integration.test.ts` (38), various other `*.unit.test.ts`. |
| CLI bootstrap stanzas | ~70 (~4%) | `agent-tools/src/bin/*.ts` shebang/initialisation pattern. |
| Residual | ~245 (~15%) | Mixed; tail end of the long-tail distribution. |

**Root cause**: the generated-code duplication is the bulk and is
structurally unavoidable in the source (codegen authors hundreds of
near-identical structures). The workspace ESLint copy duplication is
real-source duplication that consolidation can clear cleanly. The
remaining duplication is genuine engineering choice (test fixtures,
CLI bootstrap) and per-site judgement.

---

## Authority and Doctrine

This plan composes with — and is bounded by — the following durable
artefacts. Every cycle defers to them:

| Surface | Authority |
| --- | --- |
| [`docs/governance/sonar-disposition-policy.md`](../../../../docs/governance/sonar-disposition-policy.md) | Per-rule SAFE/FIXED/FALSE_POSITIVE decision criteria for documented classes; the policy is the source of class-level rationale. Two-Outcome Rule: every finding resolves to FIXED or (FALSE_POSITIVE for issues / SAFE for hotspots). ACCEPTED/ACKNOWLEDGED dispositions are owner-gated and not used in this plan. |
| [`.agent/rules/never-disable-checks.md`](../../../../.agent/rules/never-disable-checks.md) | No gate is disabled, downgraded, or path-excluded by this plan. Any expansion of the Sonar mechanical encoding (`sonar.issue.ignore.multicriteria`) goes through the policy's Expansion Discipline (policy amendment first, then owner authorisation, then config). |
| [`.agent/rules/sonarqube-mcp-instructions.md`](../../../../.agent/rules/sonarqube-mcp-instructions.md) | The Sonar MCP usage guidelines: per-issue dismissals are acceptable when each disposition is grounded in a specific architectural tension at the site, not a labelled category; rule-level disables are an anti-pattern. |
| [`.agent/rules/consolidate-at-third-consumer.md`](../../../../.agent/rules/consolidate-at-third-consumer.md) | The ESLint config duplication has now reached the third consumer (graph-core / graph-ingest / graph-project, plus oak-design-ink); cycle 9 makes the consolidation move. |
| [`principles.md` §Code Quality](../../../../.agent/directives/principles.md#code-quality) | "NEVER disable checks" — the durable principle that the policy and the rule operationalise. |

---

## Strategy

### Key insight

This is not new-feature work, not architectural work, and not a
behavioural fix. It is a per-finding disposition exercise with one
real consolidation move (the ESLint config base). The right shape is
**one disposition ledger + a small number of small commits**, not a
heavyweight refactor.

The disposition ledger is the proof that nothing was silently dropped.
Per [`/jc-plan` §Disposition Ledger for "Apply All Of X" Inputs](../../../../.agent/skills/plan/SKILL-CANONICAL.md):
every finding has a recorded decision; implementation work is sized to
the unique substance, not to the input count; the 11 S5332 hotspots
are one batched ledger entry with class-level rationale, not 11
cycles.

### Strategy at a glance

1. **Phase 0** records the disposition ledger up front so the plan
   does not lose findings to drift.
2. **Cycles 1–3** dispose findings with no production code change
   (CodeQL false positive; S5332 hotspots; S4036 hotspot).
3. **Cycles 4–7** address the 40 issues in clusters by rule shape;
   each cluster lands as one commit (or a small fan-out of commits
   if a rule-cluster genuinely needs per-site judgement).
4. **Cycle 9** is the only real consolidation work: extract the
   shared graph-* ESLint config base.
5. **Cycle 10** is contingent on cycle 9's outcome — only fires if
   the duplication density is still above the gate threshold after
   consolidation, and even then strictly defers any policy-encoding
   expansion to owner authorisation.

### Non-goals (YAGNI)

- ❌ Disable, downgrade, or path-exclude any Sonar rule.
- ❌ Add `sonar.cpd.exclusions` for generated paths without owner authorisation per Expansion Discipline.
- ❌ Refactor the generated SDK code (`packages/sdks/oak-sdk-codegen/src/types/generated/...`) — its shape is owned by the codegen pipeline.
- ❌ Implement WS1.3 DataFactory to "clear" the S1135 TODO. That work has its own cycle on the graph-stack plan.
- ❌ Quibble the CodeQL data-flow heuristic via code change in `bootstrap-helpers.ts` (e.g. moving the request logger into the per-route stack). The middleware is correctly cross-cutting; the alert is the false positive; the existing TSDoc precedent is the canonical fix shape.
- ✅ Apply the existing Sonar Disposition Policy at every site; consolidate the one real-source duplication that's at third-consumer pressure; surface any policy gap as a policy amendment proposal, not a quiet config change.

---

## Quality Gate Strategy

### After each cycle

```bash
# Per-cycle deterministic check: depends on the cycle's surface.
# See each cycle below.

pnpm type-check
pnpm lint
pnpm test
```

### Final aggregate gate (after all cycles land)

```bash
pnpm check
git push
# Then observe GitHub checks on the resulting head commit.
```

Final acceptance is the gate state on the PR's next pushed head:

- CodeQL aggregate: "no new alerts" attributed to PR 108.
- SonarCloud Quality Gate: `new_violations = 0`, `new_security_hotspots_reviewed = 100%`, `new_duplicated_lines_density ≤ 3%`.
- All other gates remain green.

The aggregate gate is the canonical [`components/quality-gates.md`](../../../templates/components/quality-gates.md)
sequence; root `package.json` is the executable source of truth.

---

## Plan-Body First-Principles Check

Per [`.agent/rules/plan-body-first-principles-check.md`](../../../../.agent/rules/plan-body-first-principles-check.md),
the following clauses must fire before execution:

1. **Shape clause**: this plan disposes findings against documented
   policy classes (Sonar Disposition Policy). Before each cycle the
   executor re-reads the relevant policy class to confirm the site
   shape matches the class's decision criteria.
2. **Landing-path clause**: each cycle commits one cohesive disposition
   step (e.g. one rule-cluster's mechanical fixes); the final push
   re-runs CI on the resulting head; the acceptance signal is gate
   green on the next CI run.
3. **Vendor-literal clause**: every Sonar MCP call (`change_sonar_issue_status`,
   `change_security_hotspot_status`) cites the policy class and the
   site path:line in the rationale comment, per
   [`.agent/rules/sonarqube-mcp-instructions.md`](../../../../.agent/rules/sonarqube-mcp-instructions.md).
4. **Re-grounding clause**: the Sonar live state changes only on push
   (the MCP guidelines say "the Sonar server will not reflect the
   change until the next scan completes"). Each cycle's verification
   is local (lint/type/test) plus the push at phase-final; not a
   per-cycle re-query of the live Sonar gate.

---

## Reviewer Scheduling (phase-aligned)

| Phase | Reviewer | Substance |
| --- | --- | --- |
| Pre-execution (this plan, before cycle 1) | `assumptions-expert` | Plan-readiness, proportionality; check that "apply all of 40+12+1" hasn't inflated to a 50-cycle plan. |
| Pre-execution (cycle 6) | `code-expert` (gateway) | Architectural-judgement issues need a second eye on the FIX vs FALSE_POSITIVE call per site. |
| Pre-execution (cycle 9) | `config-expert` | ESLint config base extraction — workspace boundary and import shape. |
| Pre-execution (cycle 10, if it fires) | `architecture-expert-fred` (principles-first) + `assumptions-expert` | Any policy-amendment proposal goes through principles-first review before reaching the owner. |
| During (cycles 4–6) | `type-expert` | The mechanical and refactor clusters touch type-shape sites (`S6564` redundant alias, `S4323` union → alias, `S6582` optional chain in test). |
| During (any test touch) | `test-expert` | Cycles that modify test files retain the test-as-system-state-describing invariant. |
| Post (final) | `docs-adr-expert` | If cycle 10 lands a policy amendment, the amendment is documentation-bearing. |
| Post (final) | `release-readiness-expert` | PR-ready gate confirmation. |

---

## Foundation Document Commitment

Before beginning work and at the start of each phase:

1. **Re-read** [`principles.md`](../../../../.agent/directives/principles.md) — §Code Quality (NEVER disable checks).
2. **Re-read** [`testing-strategy.md`](../../../../.agent/directives/testing-strategy.md) — test-as-system-state-describing invariant; any test touched in cycle 5 keeps describing a system state.
3. **Re-read** [`schema-first-execution.md`](../../../../.agent/directives/schema-first-execution.md) — relevant only for the generated-code duplication path; the codegen pipeline is the source of truth and is out of scope.
4. **Ask**: "Could it be simpler?" Answer: yes — the disposition ledger is the smallest shape that proves no finding was silently dropped. The implementation surface is sized to the unique substance, not to the input count.
5. **Verify**: no compatibility layers, no type shortcuts, no disabled checks.

---

## Lifecycle Trigger Commitment

Before the first non-planning edit:

1. Record the work shape: this is an **executable repo plan** in `current/` (queued, ready to start). Per [PDR-026 Per-Session Landing Commitment](../../../../.agent/practice-core/decision-records/PDR-026-per-session-landing-commitment.md), the per-session landing for the first execution session is "Phase 0 disposition ledger committed."
2. Run start-right; consult active claims, recent shared-comms-log, and the consolidation-lane Codex agents' boundaries before opening source claims.
3. Register a files-claim on the surfaces this plan owns before edits; close own claims at session-handoff.
4. Apply [`lifecycle-triggers.md`](../../../templates/components/lifecycle-triggers.md) at session entry, simple-plan declaration, claim registration, handoff closure, and consolidation touch points.

---

## Disposition Ledger (Phase 0 deliverable)

Phase 0 live re-query completed on 2026-05-22 by Midnight Veiling
Threshold. The ledger below is the source of cycles 1–10 and is
verified against the live SonarCloud and GitHub CodeQL surfaces named
in the Phase 0 deterministic validation block.

### Phase 0 Live-State Summary

| Surface | Live result | Ledger verdict |
| --- | --- | --- |
| Sonar Quality Gate | `new_violations = 40`, `new_security_hotspots_reviewed = 0.0`, `new_duplicated_lines_density = 6.0` | Matches plan gate failure shape. The opener query used `qualitygates/pro_status`, which returns `null`; the live Sonar endpoint is `qualitygates/project_status` and returned the conditions above. |
| Sonar issues | 40 open/confirmed new-code issues, 18 rules | Matches the 40-issue ledger below; no issue-count drift. |
| Sonar hotspots | 12 `TO_REVIEW` hotspots: 11× `typescript:S5332`, 1× `typescript:S4036` | Matches the 12-hotspot ledger below; no hotspot-count drift. |
| CodeQL | `gh pr checks 108` reports the CodeQL aggregate failing; CodeQL alert #90 is the only alert created on 2026-05-21 and is the PR-#108-new alert cited by the aggregate. The broader `ref=refs/pull/108/head&state=open` API query returns eight open alerts on the PR ref: #90 plus older #89, #81, #77, #76, #72, #71, #70. | Ledger scope remains CodeQL #90 for this snagging plan. The seven older open alerts are recorded as a validation-query scope caveat, not new Phase 0 work, because the failing aggregate text is "1 new alert" and #90 is the only live alert matching that recency and site. |

### Verified CodeQL Ledger

| Finding | Class | Site | Live evidence | Disposition | Cycle | Rationale anchor |
| --- | --- | --- | --- | --- | --- | --- |
| CodeQL #90 | `js/missing-rate-limiting` | `apps/oak-curriculum-mcp-streamable-http/src/app/bootstrap-helpers.ts:151-154` | Open; created 2026-05-21T21:29:45Z; `gh pr checks 108` CodeQL aggregate fails | FALSE_POSITIVE (per #69 precedent) | 1 | In-file TSDoc note, extended in cycle 1 |
| CodeQL query-scope caveat | Older open alerts on PR ref | #89, #81, #77, #76, #72, #71, #70 | Open on `refs/pull/108/head`, created 2026-04-21 to 2026-05-08 | No new snagging-cycle work | N/A | Not the "1 new alert" failing the aggregate; recorded so the broad API query is not mistaken for Phase 0 drift |

### Verified Sonar Hotspot Ledger

| Finding | Class | Sites | Live evidence | Disposition | Cycle | Rationale anchor |
| --- | --- | --- | --- | --- | --- | --- |
| Sonar S5332 hotspot ×11 | Documented class §S5332 | `packages/core/graph-core/src/term/index.unit.test.ts:28,29,30,42,123,124,125,179,180,181`; `packages/core/graph-core/src/canon/canonicalize.unit.test.ts:80` | 11 `TO_REVIEW`, vulnerabilityProbability `LOW` | SAFE | 2 | Policy §S5332 — W3C `example.org` namespace |
| Sonar S4036 hotspot ×1 | Documented class §S4036 | `agent-tools/src/bin/agent-tools-cli-topics.ts:96` | 1 `TO_REVIEW`, vulnerabilityProbability `LOW` | TBD (cycle 3) | 3 | Policy §S4036 — site-shape inspection |

### Verified Sonar Issue Ledger

| Finding | Class | Sites | Live evidence | Disposition | Cycle | Rationale anchor |
| --- | --- | --- | --- | --- | --- | --- |
| Sonar S1135 ×1 | Placeholder | `packages/core/graph-core/src/data-factory/index.ts:73` | 1 INFO issue | FALSE_POSITIVE or reshape comment | 7 | WS1.3 placeholder; not a real TODO |
| Sonar S3358 ×3 | Refactor | `agent-tools/src/collaboration-state/tui/operator-value.ts:119`; `packages/core/oak-eslint/src/rules/boundary.ts:323,343` | 3 MAJOR issues | FIXED (extract nested ternary) | 5 | Standard refactor |
| Sonar S4323 ×1 | Mechanical | `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/api-paths-types.ts:2963` | 1 MINOR issue | FALSE_POSITIVE (generated file) or FIXED via codegen update | 4 | Codegen output; tie disposition to schema-first |
| Sonar S4624 ×2 | Refactor | `agent-tools/src/bin/skills-adapter-generate.ts:44,47` | 2 MAJOR issues | FIXED (un-nest template literals) | 5 | Standard refactor |
| Sonar S5443 ×2 | Already-encoded class | `agent-tools/tests/repo-check.integration.test.ts:158,159` | 2 CRITICAL issues | Investigation (cycle 8) | 8 | Path should match `**/tests/**` exemption; gate may be stale |
| Sonar S6564 ×3 | Mechanical | `packages/core/graph-core/src/jsonld/processor-types.ts:38,40`; `packages/libs/graph-project/src/property-graph/index.ts:73` | 3 MAJOR issues | FIXED (remove redundant alias) | 4 | Standard refactor |
| Sonar S6582 ×1 | Mechanical | `packages/core/graph-core/src/canon/canonicalize.unit.test.ts:51` | 1 MAJOR issue | FIXED (optional chain) | 4 | Standard refactor |
| Sonar S6594 ×1 | Mechanical | `agent-tools/src/practice-fitness/markdown.ts:16` | 1 MINOR issue | FIXED (`RegExp.exec`) | 4 | Standard refactor |
| Sonar S6653 ×2 | Mechanical | `agent-tools/src/context-cost/cli-options.ts:132,136` | 2 MINOR issues | FIXED (`Object.hasOwn`) | 4 | Standard refactor |
| Sonar S7721 ×1 | Refactor | `agent-tools/tests/skills-adapter-generate/generator.unit.test.ts:104` | 1 MAJOR issue | FIXED (hoist function) | 5 | Standard refactor |
| Sonar S7735 ×1 | Refactor | `agent-tools/scripts/repo-check.ts:237` | 1 MINOR issue | FIXED (invert negated condition) | 5 | Standard refactor |
| Sonar S7737 ×1 | Refactor | `agent-tools/src/collaboration-state/tui/config.ts:25` | 1 MINOR issue | FIXED (avoid object literal default) | 5 | Standard refactor |
| Sonar S7755 ×1 | Mechanical | `agent-tools/src/practice-fitness/paths.ts:20` | 1 MINOR issue | FIXED (`Array.at`) | 4 | Standard refactor |
| Sonar S7763 ×4 | Mechanical | `packages/core/graph-core/src/jsonld/processor.ts:38`; `packages/core/graph-core/vitest.config.ts:3`; `packages/libs/graph-ingest/vitest.config.ts:3`; `packages/libs/graph-project/vitest.config.ts:3` | 4 MINOR issues | FIXED (`export ... from`) | 4 | Standard refactor |
| Sonar S7780 ×3 | Mechanical | `agent-tools/scripts/check-blocked-content.unit.test.ts:580,596`; `agent-tools/src/context-cost/tokenize-globs.unit.test.ts:92` | 3 MINOR issues | FIXED (`String.raw`) | 4 | Standard refactor |
| Sonar S7785 ×5 | Architectural judgement | `agent-tools/src/bin/agent-identity.ts:14`; `agent-tools/src/bin/agent-tools.ts:15`; `agent-tools/src/bin/branch-touched-files.ts:14`; `agent-tools/src/bin/codex-exec.ts:14`; `agent-tools/src/bin/skills-adapter-generate.ts:74` | 5 MAJOR issues | TBD per site (cycle 6) | 6 | Top-level await vs promise-chain bootstrap — site-specific design call |
| Sonar S7786 ×1 | Mechanical | `packages/core/graph-core/src/jsonld/processor.integration.test.ts:90` | 1 MINOR issue | FIXED (`new TypeError`) | 4 | Standard refactor |
| Sonar S7787 ×7 | Architectural judgement | `packages/libs/graph-ingest/src/custom-mapping/index.ts:7`; `packages/libs/graph-ingest/src/index.ts:8`; `packages/libs/graph-ingest/src/jsonld-compatible/index.ts:7`; `packages/libs/graph-ingest/src/node-edge-list/index.ts:7`; `packages/libs/graph-ingest/src/plain-json-tree/index.ts:7`; `packages/libs/graph-ingest/src/records/index.ts:7`; `packages/libs/graph-ingest/src/strict-jsonld/index.ts:7` | 7 MINOR issues | TBD per site (cycle 6) | 6 | Bare re-export pattern is the documented graph-ingest shape; per-site rationale required |
| Sonar duplication 6.0% | Density gate | Across PR | Quality gate condition `new_duplicated_lines_density = 6.0` | Consolidate (cycle 9) + contingency (cycle 10) | 9, 10 | ESLint config base extraction is third-consumer trigger |

No Sonar issue or hotspot drift was discovered. The only Phase 0
clarification is the CodeQL API scope caveat above: the broad PR-ref
query exposes older open alerts in addition to the new alert that the
CodeQL aggregate is currently failing on.

---

## Resolution Plan

### Phase 0: Foundation Re-Ground and Disposition-Ledger Verification

**Foundation check-in**: re-read sonar-disposition-policy, never-disable-checks, principles.md §Code Quality.

**Key principle**: every finding has a recorded decision; implementation work is sized to the unique substance, not to the input count.

**Task 0.1**: re-query the live Sonar state via SonarCloud API and compare against the disposition ledger above.

**Acceptance criteria**:

1. ✅ Live Sonar issue list for PR 108 matches the 40-issue ledger (any drift accounts for: zombie findings cleared by push, or new findings introduced by team work since head `f4ca84f`).
2. ✅ Live Sonar hotspot list matches the 12-hotspot ledger.
3. ✅ CodeQL alert state matches the 1-alert reading.
4. ✅ Any discovered drift is recorded in the ledger before cycle 1 fires.

**Deterministic validation**:

```bash
# Live Sonar state via public API
curl -sS "https://sonarcloud.io/api/qualitygates/project_status?projectKey=oaknational_oak-open-curriculum-ecosystem&pullRequest=108" | jq '.projectStatus.conditions'

curl -sS "https://sonarcloud.io/api/issues/search?componentKeys=oaknational_oak-open-curriculum-ecosystem&pullRequest=108&statuses=OPEN,CONFIRMED&sinceLeakPeriod=true&ps=500" | jq '{total, byRule: ([.issues[] | .rule] | group_by(.) | map({rule: .[0], count: length}))}'

curl -sS "https://sonarcloud.io/api/hotspots/search?projectKey=oaknational_oak-open-curriculum-ecosystem&pullRequest=108&sinceLeakPeriod=true&ps=500" | jq '{total: .paging.total, byRule: ([.hotspots[] | .ruleKey] | group_by(.) | map({rule: .[0], count: length}))}'

# Live CodeQL state via GitHub API
gh api 'repos/oaknational/oak-open-curriculum-ecosystem/code-scanning/alerts?ref=refs/pull/108/head&state=open&per_page=20' | jq '[.[] | {number, rule: .rule.id, severity: .rule.severity, security_severity: .rule.security_severity_level}]'
```

Expected: counts match the ledger (±N if zombie findings have cleared or new findings introduced). Any delta is captured in the ledger as a new row before cycle 1 fires.

**Task complete when**: ledger matches live state, every finding has a planned disposition + cycle assignment.

---

### Cycle 1: CodeQL #90 disposition — extend TSDoc + dismiss

**Parallel-safety**: parallel-safe (single file, planning-only edit).

**Starting state**: branch HEAD at dispatch.

**File scope**:

- `apps/oak-curriculum-mcp-streamable-http/src/app/bootstrap-helpers.ts` (TSDoc only)

**Current implementation** — the existing `setupBaseMiddleware` TSDoc covers alert #69:

```134:139:apps/oak-curriculum-mcp-streamable-http/src/app/bootstrap-helpers.ts
/**
 * Sets up base Express middleware: JSON, correlation, and debug request logging.
 * Error handlers register later for Sentry compatibility. Not a route handler:
 * CodeQL #69 (line 146, `app.use(createCorrelationMiddleware(...))`) is a
 * misclassification — correlation middleware is cross-cutting, not auth-bearing.
 */
```

**Target implementation**: extend the same TSDoc note to cover alert #90 inline, naming the line and the middleware. After the cycle, the note covers both alerts in one block.

**Failing check**: CodeQL aggregate still reports "1 new alert" until the GitHub UI dismissal posts.

**Product changes**:

- Edit the TSDoc note (1 sentence appended or restructured).
- Post a FALSE_POSITIVE dismissal on alert #90 in the GitHub CodeQL UI with rationale `"Misclassification — createRequestLogger is cross-cutting middleware, not an authorisation route handler. Rate limiting applies at auth-bearing routes (see auth-routes.ts). Same pattern as alert #69 documented in setupBaseMiddleware TSDoc."`

**Acceptance criteria**:

1. ✅ The `setupBaseMiddleware` TSDoc names both alert #69 AND alert #90 with the same misclassification rationale.
2. ✅ Alert #90 is dismissed in the GitHub CodeQL UI with the rationale above.
3. ✅ On the next CI run, the CodeQL aggregate check reports no new alerts attributed to PR 108 (alert #90 no longer appears in the "new alerts" view because of the dismissal).

**Deterministic validation**:

```bash
# Verify the TSDoc note is present and covers both alerts
rg -n 'CodeQL #69.*CodeQL #90|CodeQL #69 and #90|alerts #69 and #90' apps/oak-curriculum-mcp-streamable-http/src/app/bootstrap-helpers.ts
# Expected: at least one match

# Verify CodeQL alert state after dismissal lands and CI re-runs
gh api 'repos/oaknational/oak-open-curriculum-ecosystem/code-scanning/alerts/90' | jq '{state, dismissed_reason}'
# Expected: { "state": "dismissed", "dismissed_reason": "false positive" }

# Post-push CI check
gh pr checks 108 | rg '^CodeQL\s'
# Expected: pass
```

**Cycle complete when**: all 3 acceptance criteria pass and the cycle lands as one commit (TSDoc edit).

---

### Cycle 2: 11 × S5332 hotspots — SAFE per policy §S5332

**Parallel-safety**: parallel-safe (no code change; UI/MCP action only).

**Starting state**: branch HEAD at dispatch.

**File scope**: no file change. Disposition only.

**Failing check**: `new_security_hotspots_reviewed = 0%` (12 unreviewed including these 11).

**Product changes**: none in repo. For each of the 11 hotspot keys (see Issue 2b for the line numbers), post a SAFE disposition via `change_security_hotspot_status` with rationale:

```text
SAFE per Sonar Disposition Policy §S5332: <path>:<line> —
W3C-reserved http://example.org/ namespace used as RDF/JS Term
opaque identifier. Not a network endpoint; the RDF Term hierarchy
treats URI strings as opaque IRIs per RDF/JS Data Model spec. No
production runtime exposure.
```

**Acceptance criteria**:

1. ✅ All 11 S5332 hotspots move from TO_REVIEW to REVIEWED/SAFE.
2. ✅ Each disposition cites Sonar Disposition Policy §S5332 and names the file:line.
3. ✅ `new_security_hotspots_reviewed` advances by 11/12 toward 100%.

**Deterministic validation**:

```bash
# After dispositions post
curl -sS "https://sonarcloud.io/api/hotspots/search?projectKey=oaknational_oak-open-curriculum-ecosystem&pullRequest=108&sinceLeakPeriod=true&status=REVIEWED&ps=500" | jq '[.hotspots[] | select(.ruleKey == "typescript:S5332")] | length'
# Expected: 11

# Verify rationale shape on a sample
curl -sS "https://sonarcloud.io/api/hotspots/show?hotspot=<one-of-the-keys>" | jq '.changelog'
# Expected: latest entry quotes "SAFE per Sonar Disposition Policy §S5332"
```

**Cycle complete when**: all 3 acceptance criteria pass.

---

### Cycle 3: S4036 hotspot — read, then SAFE per policy §S4036 or FIXED

**Parallel-safety**: parallel-safe.

**Starting state**: branch HEAD at dispatch.

**File scope**:

- Read: `agent-tools/src/bin/agent-tools-cli-topics.ts` (line 96 and surrounding context).
- Conditional edit: same file, IF the SAFE class criteria fail.

**Failing check**: 1 of 12 hotspots unreviewed.

**Product changes**:

1. Read the cited site. Determine which command is being resolved via PATH (`pnpm`, `git`, `typedoc`, `tsx`, or other).
2. Apply Sonar Disposition Policy §S4036 SAFE criteria:
   - Site is in agent-tooling / build / CI / codegen / admin CLI (yes — `agent-tools/src/bin/` is agent-tooling).
   - Command is project-required toolchain (`pnpm`, `git`, `typedoc`, `tsx`).
   - Execution context owns PATH integrity (dev workstation, CI runner).
3. If all three hold: dispose SAFE with rationale `"SAFE per Sonar Disposition Policy §S4036: <command> is standard developer toolchain binary; host environment owns PATH integrity; not a production-server runtime."`
4. If any does NOT hold (e.g. the command is end-user-controlled, or this is a production server runtime path): code-fix by resolving the absolute path or restricting to the known-good binary.

**Acceptance criteria**:

1. ✅ The site shape is verified against §S4036 SAFE criteria.
2. ✅ Either: SAFE disposition posts with the policy-citation rationale, OR a code fix lands with FIXED disposition.
3. ✅ The hotspot moves from TO_REVIEW to REVIEWED.

**Deterministic validation**:

```bash
# If SAFE
curl -sS "https://sonarcloud.io/api/hotspots/show?hotspot=AZ4cLpsUaO7TzVKHKWC0" | jq '{status, resolution, changelog}'
# Expected: status REVIEWED, resolution SAFE

# If FIXED — local check
pnpm type-check
pnpm lint
pnpm test
# All exit 0
```

**Cycle complete when**: hotspot reviewed; if FIXED, the change lands as one commit.

---

### Cycle 4: Mechanical issue cluster — 17 sites across 9 rules

**Parallel-safety**: rule-by-rule cycles are parallel-safe between rules. Within a rule cluster, parallel-safety depends on file scope.

**Starting state**: branch HEAD at dispatch.

**File scope** (one sub-cycle per rule):

| Sub-cycle | Rule | Files | Sites | Disposition |
| --- | --- | --- | --- | --- |
| 4.1 | S6653 | `agent-tools/src/context-cost/cli-options.ts` | 2 | FIXED — `Object.hasOwn(x, k)` |
| 4.2 | S6594 | `agent-tools/src/practice-fitness/markdown.ts` | 1 | FIXED — `RegExp.exec(s)` |
| 4.3 | S6582 | `packages/core/graph-core/src/canon/canonicalize.unit.test.ts` | 1 | FIXED — optional chain |
| 4.4 | S7755 | `agent-tools/src/practice-fitness/paths.ts` | 1 | FIXED — `arr.at(-i)` |
| 4.5 | S6564 | `packages/core/graph-core/src/jsonld/processor-types.ts`, `packages/libs/graph-project/src/property-graph/index.ts` | 3 | FIXED — remove redundant alias |
| 4.6 | S4323 | `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/api-paths-types.ts` | 1 | FALSE_POSITIVE (generated file; the codegen authors the union shape; fix at codegen is a separate cycle on the SDK plan) |
| 4.7 | S7780 | `agent-tools/scripts/check-blocked-content.unit.test.ts`, `agent-tools/src/context-cost/tokenize-globs.unit.test.ts` | 3 | FIXED — `String.raw` |
| 4.8 | S7786 | `packages/core/graph-core/src/jsonld/processor.integration.test.ts` | 1 | FIXED — `new TypeError(...)` for type-check assertions |
| 4.9 | S7763 | `packages/core/graph-core/src/jsonld/processor.ts`, `packages/core/graph-core/vitest.config.ts`, `packages/libs/graph-ingest/vitest.config.ts`, `packages/libs/graph-project/vitest.config.ts` | 4 | FIXED — `export … from` |

**Failing check**: `new_violations` count includes these 17.

**Product changes**: per-rule mechanical refactor. No new tests; existing tests must continue to pass.

**Acceptance criteria** (per sub-cycle):

1. ✅ Rule fires 0 on the changed file(s) per local SonarLint / IDE state (if available).
2. ✅ `pnpm type-check && pnpm lint && pnpm test` passes.
3. ✅ The cycle lands as one commit (or one commit per sub-cycle if individual file scopes are parallel-dispatched).

**Deterministic validation** (per sub-cycle):

```bash
# Sub-cycle-specific search confirms the new shape is present
# e.g. for 4.1
rg -n 'Object\.hasOwn\(' agent-tools/src/context-cost/cli-options.ts
# Expected: 2 matches

rg -n 'Object\.prototype\.hasOwnProperty\.call\(' agent-tools/src/context-cost/cli-options.ts
# Expected: 0 matches

# Standard gates
pnpm type-check
pnpm lint
pnpm test
```

**Cycle complete when**: all 9 sub-cycles land, all standard gates pass, and the Sonar issue list (live, after push) shows these 17 sites cleared.

---

### Cycle 5: Refactor issue cluster — 8 sites across 5 rules

**Parallel-safety**: rule-by-rule cycles are parallel-safe between rules.

**Starting state**: branch HEAD at dispatch (or after cycle 4 if file scopes overlap).

**File scope** (one sub-cycle per rule):

| Sub-cycle | Rule | Files | Sites | Disposition |
| --- | --- | --- | --- | --- |
| 5.1 | S3358 | `agent-tools/src/collaboration-state/tui/operator-value.ts`, `packages/core/oak-eslint/src/rules/boundary.ts` | 3 | FIXED — extract nested ternary to named const or if-else |
| 5.2 | S4624 | `agent-tools/src/bin/skills-adapter-generate.ts` | 2 | FIXED — un-nest template literals via intermediate `const` |
| 5.3 | S7721 | `agent-tools/tests/skills-adapter-generate/generator.unit.test.ts` | 1 | FIXED — hoist `makeFs` to module scope or use a factory at top level |
| 5.4 | S7735 | `agent-tools/scripts/repo-check.ts` | 1 | FIXED — invert the negated condition |
| 5.5 | S7737 | `agent-tools/src/collaboration-state/tui/config.ts` | 1 | FIXED — replace object-literal default with `undefined` + internal default |

**Failing check**: `new_violations` count includes these 8.

**Product changes**: per-rule refactor. Each sub-cycle keeps the surrounding tests valid; if any test describes the implementation rather than a system state (e.g. a snapshot test of the nested ternary's shape), the test is updated to describe the same system state post-refactor.

**Acceptance criteria** (per sub-cycle): same shape as cycle 4 (rule cleared + standard gates green + one commit per sub-cycle).

**Deterministic validation**: per-rule grep checks + standard gates.

**Cycle complete when**: all 5 sub-cycles land, all standard gates pass, Sonar issue list (post-push) shows these 8 sites cleared.

---

### Cycle 6: Architectural-judgement issues — S7785 + S7787, 12 sites

**Parallel-safety**: each site is its own decision; the cycle is the *envelope* for site-by-site dispositions.

**Starting state**: branch HEAD at dispatch.

**File scope**:

| Rule | Files | Sites | Disposition logic |
| --- | --- | --- | --- |
| S7785 (prefer top-level await over promise chains) | `agent-tools/src/bin/agent-identity.ts`, `agent-tools/src/bin/agent-tools.ts`, `agent-tools/src/bin/branch-touched-files.ts`, `agent-tools/src/bin/codex-exec.ts`, `agent-tools/src/bin/skills-adapter-generate.ts` | 5 | The agent-tools CLI bin files use `main().catch(...)` pattern. Two paths: (a) FIXED by replacing `main().catch(handle)` with `try { await main(); } catch (e) { handle(e); }` at top level — semantically identical, satisfies the rule. (b) FALSE_POSITIVE if the bin pattern is intentional (e.g. the project's CLI convention sets `main()` up as a discoverable entrypoint). Default disposition: FIXED (the rule's preferred shape is the more modern idiom and has no behavioural cost). |
| S7787 (export statement without specifiers) | `packages/libs/graph-ingest/src/custom-mapping/index.ts`, `packages/libs/graph-ingest/src/index.ts`, `packages/libs/graph-ingest/src/jsonld-compatible/index.ts`, `packages/libs/graph-ingest/src/node-edge-list/index.ts`, `packages/libs/graph-ingest/src/plain-json-tree/index.ts` | 7 | Bare `export {}` re-export pattern. Two paths: (a) FIXED by replacing `export {}` with `export type {} from '…'` or named re-export specifiers if the file's role is type-only re-export; (b) FALSE_POSITIVE if `export {}` is the intentional "module marker" idiom (TS forces a file to be a module). Default disposition: per-site judgement — read each file's role before deciding. |

**Pre-execution reviewer**: `code-expert` (gateway) — second eye on FIX vs FALSE_POSITIVE call per site.

**Acceptance criteria**:

1. ✅ Every site has a disposition recorded (FIXED via commit, or FALSE_POSITIVE via `change_sonar_issue_status` with site rationale).
2. ✅ Where FALSE_POSITIVE is the disposition, the rationale names the architectural reason at the site (e.g. "module-marker pattern; TypeScript forces module shape; no executable re-export"). Generic "convention" rationales are not acceptable per the policy.
3. ✅ All cycles' standard gates pass.

**Deterministic validation**: per-site grep + Sonar issue status check.

**Cycle complete when**: 12/12 sites have a recorded disposition; standard gates pass.

---

### Cycle 7: S1135 TODO disposition

**Parallel-safety**: parallel-safe.

**Starting state**: branch HEAD at dispatch.

**File scope**: `packages/core/graph-core/src/data-factory/index.ts`.

**Failing check**: `new_violations` includes 1 INFO-severity S1135 ("Complete the task associated with this TODO comment").

**Product changes**: minimal. The TODO is the WS1.3 placeholder per the graph-stack plan. Two equivalent dispositions:

1. **Reshape the comment** so the S1135 rule does not fire: change `TODO:` to a non-TODO marker the rule does not match (e.g. `NEXT-CYCLE:` or `// WS1.3 placeholder — see graph-stack.plan.md`). FIXED disposition.
2. **FALSE_POSITIVE** with rationale `"WS1.3 placeholder per graph-stack.plan.md; this is a planned-work marker, not deferred technical debt the rule is designed to surface. Will be removed when WS1.3 lands as one of the next graph-stack cycles."`

Either path is acceptable. The plan defaults to (1) because it avoids an MCP round-trip and is grep-stable for future agents looking at the WS1.3 boundary.

**Acceptance criteria**: 1 issue cleared (FIXED or FALSE_POSITIVE).

**Deterministic validation**:

```bash
rg -n 'WS1\.3' packages/core/graph-core/src/data-factory/index.ts
# Expected: at least one match (the reshape preserves the WS1.3 anchor)

rg -n 'TODO' packages/core/graph-core/src/data-factory/index.ts
# Expected: 0 matches (if disposition (1))
```

**Cycle complete when**: 1 issue cleared and standard gates pass.

---

### Cycle 8: S5443 mechanical-encoding investigation

**Parallel-safety**: parallel-safe (investigation; no code change unless policy amendment).

**Starting state**: branch HEAD at dispatch.

**File scope**: read-only inspection plus possibly an `agent-tools/tests/repo-check.integration.test.ts` line annotation, and possibly a policy amendment proposal.

**Failing check**: `new_violations` includes 2 S5443 CRITICAL hits that the existing mechanical encoding *should* exempt under `**/tests/**` glob.

**Investigation steps**:

1. Read `sonar-project.properties` and the policy doc to confirm the encoded globs.
2. Read the Sonar component key for `agent-tools/tests/repo-check.integration.test.ts` via the SonarCloud API.
3. Identify the mismatch: is the glob format wrong for Sonar's pattern engine? Is the component key prefix interfering? Is the encoding push not yet reflected in the gate run?

**Possible dispositions**:

| Investigation outcome | Disposition |
| --- | --- |
| Glob format is correct; gate run pre-dated encoding push | Stale finding; the next push (after this plan's cycles land and trigger a re-scan) clears these. No action this cycle. |
| Glob is correct in policy doc but `sonar-project.properties` has a typo or path-prefix issue | Policy amendment + config edit per Expansion Discipline. Stop-gap: per-site FALSE_POSITIVE with rationale `"Policy §S5443 applies; mechanical encoding glob fix in progress per cycle 8."` |
| Sonar resourceKey format genuinely doesn't match `**/tests/**` for this path | Policy amendment proposal documenting the actual glob shape; owner authorisation required before `sonar-project.properties` edit. Stop-gap: per-site FALSE_POSITIVE per policy §S5443. |

**Acceptance criteria**:

1. ✅ The root cause is identified and recorded.
2. ✅ The disposition path matches the outcome (no action / amendment + config / amendment proposal + stop-gap).
3. ✅ Any config edit goes through owner authorisation per `never-disable-checks` §Expansion Discipline.

**Deterministic validation**:

```bash
# Confirm both issues exist on the live state
curl -sS "https://sonarcloud.io/api/issues/search?componentKeys=oaknational_oak-open-curriculum-ecosystem&pullRequest=108&rules=typescript:S5443&statuses=OPEN,CONFIRMED" | jq '[.issues[] | {component, line, message}]'
# Expected: 2 hits OR 0 hits (if cleared on this cycle's push)

# If policy amendment lands
rg -n 'agent-tools/tests' docs/governance/sonar-disposition-policy.md
# Expected: the amendment names the path glob and worked example
```

**Cycle complete when**: disposition recorded; if policy amendment proposed, the proposal is owner-pending or owner-authorised; if disposition is "stale finding", confirmed clear after the cycle 1–7 commits push and re-scan.

---

### Cycle 9: ESLint config consolidation (the one real duplication cycle)

**Parallel-safety**: parallel-safe with cycles 1–8 (different file scope).

**Starting state**: branch HEAD at dispatch.

**File scope**:

- New: a shared `eslint.config.base.ts` (location TBD — likely under `packages/core/oak-eslint/` or a sibling workspace; chosen during cycle 9 design).
- Modified: `packages/core/graph-core/eslint.config.ts`, `packages/libs/graph-ingest/eslint.config.ts`, `packages/libs/graph-project/eslint.config.ts`, `packages/design/oak-design-ink/eslint.config.ts` — each imports-and-extends the base.

**Failing check**: `new_duplicated_lines_density = 6.003%`. Removes ~173 dup lines (~11% of total dup budget).

**Pre-execution reviewer**: `config-expert` — workspace boundary, import shape, and confirm the consolidation doesn't accidentally lock graph-* workspaces into oak-design-ink's lint rules or vice versa.

**Product changes**:

1. Identify the 47-line shared shape across the three graph-* eslint configs.
2. Author the base config in the chosen location.
3. Replace the duplicated body in each consumer with the import + composition.
4. Confirm `pnpm lint` runs identically on each workspace (no rule activations or deactivations).

**Failing test / check**: not directly testable as a unit; the validation is the `pnpm lint` run staying green across the four workspaces and the duplication metric falling on the next push.

**Acceptance criteria**:

1. ✅ The base config lives in a single shared location, no duplicated body.
2. ✅ Each of the four workspaces imports + extends the base.
3. ✅ `pnpm lint` exits 0 across the four workspaces, with identical pre/post rule activations (verify via `pnpm lint --print-config` diff on a sample file in each workspace).
4. ✅ The new-code duplication density drops by ~10–11 percentage points (target: ≤ 4% if cycle 9 alone is enough; under 3% if combined with cycle-10 work).
5. ✅ [`.agent/rules/consolidate-at-third-consumer.md`](../../../../.agent/rules/consolidate-at-third-consumer.md) is satisfied — recorded in the commit message.

**Deterministic validation**:

```bash
# Verify the base config exists and is the source of truth
rg -n 'export default' <path-to-base-config>
# Expected: one default export

# Verify the four consumers import the base
rg -n 'from .*eslint\.config\.base' packages/core/graph-core/eslint.config.ts packages/libs/graph-ingest/eslint.config.ts packages/libs/graph-project/eslint.config.ts packages/design/oak-design-ink/eslint.config.ts
# Expected: 4 matches

# Verify lint stays green
pnpm --filter @oaknational/graph-core lint
pnpm --filter @oaknational/graph-ingest lint
pnpm --filter @oaknational/graph-project lint
pnpm --filter @oaknational/oak-design-ink lint
# Expected: all exit 0

# Verify dup metric reduced
curl -sS "https://sonarcloud.io/api/measures/component?component=oaknational_oak-open-curriculum-ecosystem&pullRequest=108&metricKeys=new_duplicated_lines_density" | jq '.component.measures[0].periods[0].value'
# Expected: substantially lower than 6.003 (after push and re-scan)
```

**Cycle complete when**: all 5 acceptance criteria pass; the cycle lands as one commit.

---

### Cycle 10: Residual duplication disposition (contingent)

**Parallel-safety**: sequenced after cycle 9.

**Starting state**: post-cycle-9 head; live Sonar duplication metric re-evaluated.

**File scope**: depends on outcome — either further real-source consolidation, or a policy amendment proposal in `docs/governance/sonar-disposition-policy.md`.

**Trigger condition**: only fires if the post-cycle-9 `new_duplicated_lines_density` is still above 3%.

**Three legitimate remediations**:

1. **Further real-source consolidation**. Likely targets: the agent-tools `src/bin/*.ts` shebang/bootstrap stanza (~70 dup lines); the comms-render / comms-event-schema / state-parsers test-fixture shape (~115 dup lines). One commit per target.
2. **Policy amendment proposal**. If the generated-code duplication (`api-schema-base.ts`, `path-parameters.ts`, `mcp-tools/stubs/`) remains the binding constraint, draft an amendment to `docs/governance/sonar-disposition-policy.md` proposing a new documented class for generated-code duplication, with worked example and decision criteria. The proposal lands as a PR comment / decision-thread / sidebar to the owner; the `sonar.cpd.exclusions` config change CANNOT be made until owner authorisation per Expansion Discipline.
3. **Accept the gate stays red**. If the bulk of the residual is at the long-tail and consolidation would invent abstractions just for the gate (the failure mode the policy is designed to prevent), the right move is to accept that PR 108 lands without the gate green and surface this as a follow-on plan. This requires explicit owner sign-off via PR review or decision thread.

**Pre-execution reviewer** (path 2): `architecture-expert-fred` (principles-first) + `assumptions-expert`.

**Acceptance criteria**:

1. ✅ The post-cycle-9 duplication metric is re-evaluated against the threshold.
2. ✅ The chosen path is recorded in this plan file with rationale.
3. ✅ Any policy amendment proposal is owner-pending or owner-authorised; no quiet config edits.
4. ✅ If path 3 is chosen, the owner sign-off is explicit and captured in the decision thread for the plan.

**Deterministic validation**: live Sonar duplication metric check post-cycle-9; policy doc diff if amendment proposed.

**Cycle complete when**: path chosen, evidence captured.

---

### Phase Final: Validation

**Foundation check-in**: re-read principles.md, testing-strategy.md, schema-first-execution.md.

**Task F.1**: Local aggregate gate.

```bash
pnpm check
# Expected: exit 0 across all workspaces
```

**Task F.2**: Push to PR 108 and observe CI.

```bash
git push origin feat/mcp-graph-support-foundation
gh pr checks 108 --watch
```

**Acceptance criteria**:

1. ✅ CodeQL aggregate: "no new alerts" attributed to PR 108.
2. ✅ SonarCloud Quality Gate: PASS (all three failing conditions cleared).
3. ✅ All other gates remain green (`run-quality-gates`, `Analyze (actions)`, `Analyze (javascript-typescript)` x2, `Cursor Bugbot`, `Vercel`).
4. ✅ No human reviewer comments outstanding (this plan's execution should not introduce review-able product changes; the architectural-judgement dispositions in cycle 6 may invite a review comment but should be FALSE_POSITIVE'd via the existing Sonar MCP flow, not deferred to PR comments).

**Task complete when**: all 4 acceptance criteria pass on the next CI run after push.

---

## Risks

| Risk | Mitigation |
| --- | --- |
| Cycle 6 FALSE_POSITIVE dispositions for S7785 / S7787 may invite reviewer pushback that the rules represent real preferred patterns. | Each FALSE_POSITIVE cites a specific architectural reason at the site, not a generic "convention" rationale; pre-execution reviewer is `code-expert`. If the reviewer rejects FALSE_POSITIVE on any site, that site moves to FIXED in the same cycle. |
| Cycle 10 may require owner authorisation that is not immediately available. | Cycle 9 is the cycle that delivers the bulk of the duplication-density move; cycle 10 is genuinely contingent. If owner authorisation is unavailable, path 3 (accept residual + sign-off) is the explicit alternative. |
| The Sonar gate refreshes on each push, but only one push lands at a time. Intermediate pushes during cycles 1–8 may show transient gate states that confuse observers. | Each cycle's commit message names the cycle and the disposition. The PR description gets a Phase 0 ledger update + a per-cycle progress note. |
| Cycle 4.6 (S4323 in generated `api-paths-types.ts`) defaults to FALSE_POSITIVE because the file is generated. If the codegen pipeline can emit a `type` alias instead of a `union`, that's the FIXED path. | Cycle 4.6's disposition is the schema-first-execution call: codegen output is owned by the generator. The right place to fix this is the codegen plan, not here. FALSE_POSITIVE here with a back-cite to the codegen plan is the principled disposition. |
| The CodeQL #90 dismissal needs GitHub UI access. If the executing agent does not have repo-admin or security-admin permissions on the repo, the dismissal must be routed to the owner. | Cycle 1's acceptance criterion #2 names the dismissal; if blocked, the cycle's status moves to `pending-owner` and the plan flags the gap. |

---

## Build-vs-Buy Attestation

Not applicable — this plan does no vendor integration. Sonar and CodeQL
are existing first-party gates; the dispositions go through their
existing APIs/UIs.

---

## Dependencies

**Blocking prerequisites**: none. Phase 0 can start immediately.

**Beneficial prerequisites**:

- Live Sonar state has stabilised after the 21:27 UTC PR 108 push (verified above).
- Inherited working-tree state on the team's consolidation lane does not touch this plan's surfaces (verified — Codex consolidation team owns `.agent/memory/operational/pending-graduations.md` + napkin + comms; this plan owns code in `apps/`, `agent-tools/`, `packages/`).

**Related plans**:

- [`graph-stack.plan.md`](../active/graph-stack.plan.md) — this snagging plan's commits land on the same branch and unblock the graph-stack foundation merge. WS1.3 placeholder cleared in cycle 7 is referenced from there.
- [`cost-of-collaboration.plan.md`](../../../agent-tooling/current/cost-of-collaboration.plan.md) — the pre-commit broken-code guard is the inherited shape that catches regressions on the cycles in this plan.

**Minimum shippable shape without beneficial prerequisites**: if the inherited working-tree state changes (e.g. the consolidation team commits to shared comms), Phase 0 re-verifies the live PR state and recomputes the ledger.

---

## Notes

### Why this matters

PR 108 is the **graph-stack foundation branch** — the substrate that
WS1.3 → WS3.3 attach to. The two failing gates are blocking a merge
that is otherwise functionally green. Every day the PR stays unmerged
is a day the substrate is not in `main` and the next 10 graph cycles
cannot land. The snagging plan exists so the disposition reasoning is
written once, applied to all 53 findings, and the substrate moves.

### System-level impact

- **Unblocking**: clears the substrate landing path.
- **Doctrine reinforcement**: every cycle composes with the documented Sonar Disposition Policy + never-disable-checks rule; nothing is invented for this PR.
- **Pattern surfacing**: cycles 6 (architectural-judgement dispositions for modern-TS rules), 8 (S5443 mechanical-encoding investigation), and 10 (residual duplication) may surface policy refinements that graduate to the policy doc, increasing the durable disposition coverage.

### Alignment with foundation documents

- **From `principles.md` §Code Quality**: "NEVER disable checks." Every cycle honours this.
- **From `testing-strategy.md`**: any test touched in cycle 5 keeps describing a system state, not auditing an implementation choice.
- **From `schema-first-execution.md`**: cycle 4.6 defers the generated `api-paths-types.ts` disposition to the codegen pipeline — the generator is the source of truth.

---

## Plan-Body First-Principles Check — Result

Run before dispatch:

1. ✅ **Shape clause** fires per-cycle (each cycle re-reads the policy class before disposition).
2. ✅ **Landing-path clause** is one commit per cycle (or per sub-cycle); final push triggers re-scan.
3. ✅ **Vendor-literal clause** fires on every Sonar MCP call (policy class + site path + line in rationale).
4. ✅ **Re-grounding clause** lives in Phase 0 and Phase Final (live Sonar API queries before and after).

---

## References

- PR: [#108](https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/108) (head `f4ca84f`)
- CodeQL alert #90: [code-scanning/alerts/90](https://github.com/oaknational/oak-open-curriculum-ecosystem/security/code-scanning/90)
- SonarCloud PR dashboard: [PR 108](https://sonarcloud.io/dashboard?id=oaknational_oak-open-curriculum-ecosystem&pullRequest=108)
- Policy: [`docs/governance/sonar-disposition-policy.md`](../../../../docs/governance/sonar-disposition-policy.md)
- Rule: [`.agent/rules/never-disable-checks.md`](../../../../.agent/rules/never-disable-checks.md)
- MCP guidelines: [`.agent/rules/sonarqube-mcp-instructions.md`](../../../../.agent/rules/sonarqube-mcp-instructions.md)
- Consolidate-at-third-consumer: [`.agent/rules/consolidate-at-third-consumer.md`](../../../../.agent/rules/consolidate-at-third-consumer.md)
- Disposition Ledger discipline: [`/jc-plan` SKILL §Disposition Ledger](../../../../.agent/skills/plan/SKILL-CANONICAL.md)
- Foundation: [`principles.md`](../../../../.agent/directives/principles.md), [`testing-strategy.md`](../../../../.agent/directives/testing-strategy.md), [`schema-first-execution.md`](../../../../.agent/directives/schema-first-execution.md)

---

## Consolidation

After all cycles complete and the PR merges, run `/jc-consolidate-docs`
to graduate any disposition patterns that recur (e.g. if cycle 6's
FALSE_POSITIVE rationales coalesce into a class-level pattern, the
class deserves a policy amendment). Cycle 10's path 2 (policy
amendment) is the primary candidate for pattern graduation.

---

## Author and Provenance

- **Plan author**: Feathered Circling Horizon / cursor / `9e1c24` (this session).
- **Created**: 2026-05-21T22:55Z.
- **Sources of truth**: the live SonarCloud API + GitHub CodeQL API, queried during the PR-108 gate-analysis pass in this session; the per-finding ledger above derives from those queries.
- **Live team awareness**: at plan authorship, the live team (Prismatic Scattering Supernova, Gilded Ascending Orbit, Silvered Prowling Mist — all Codex `019e4c`) was on the consolidation lane (`.agent/memory/operational/pending-graduations.md` + napkin + comms surfaces). Plan boundary is fully disjoint.
