# DAMAGED PLAN — superseded 2026-05-03

**Status**: SUPERSEDED — DAMAGED. Not complete; we had to start again
with simpler approaches.

**Why damaged**: this plan sequenced the rename as WS2 (sentry-node) →
WS3 (env package) → WS4 (HTTP MCP) → WS5 (Search CLI) — producer-first
across multiple commits. Per Tidal Flowing Reef's cascade analysis
2026-05-03 (comms event `claude-f879e0-tidal-step-back-and-cascade-finding`):
once sentry-node ignores `SENTRY_MODE` at WS2 close, ~10–15 app tests
in HTTP MCP and Search CLI fail because their typed fixtures still
build `SENTRY_MODE: 'sentry'`-driven `RuntimeConfig`. Apps' test
suites are RED across WS2→WS5 commits. That is the multi-commit-TDD-
skip-register pattern owner deleted in commit `60b9ff4c`.

`replace-don't-bridge` (principles.md §Refactoring) forbids transitional
shims that would let WS2 land independently. The architecturally-
correct shape under TDD-as-pairs + replace-don't-bridge is one atomic
landing of producer + consumers + tests together.

**Replacement plan**:
`.agent/plans/observability/current/replace-sentry-mode-with-observability-sinks.plan.md`
(one cycle = atomic landing of ~30 files; cycles 2–3 are doc updates,
parallel-safe with cycle 1; ESLint rule and `ServerInstrumenter` port
moved to separate concerns out of scope).

**Lessons captured** (graduated to `.agent/memory/active/napkin.md`
2026-05-03 entries):

- Producer-first sequencing across packages with type-system-enforced
  contracts produces the cascade pattern even when each WS body looks
  internally coherent.
- Cycle-pair TDD discipline is not just per-cycle — it applies at the
  cross-package atomic-rename level too. A "WS = one cycle" framing
  fails when the WSes themselves form a cascade.
- The framing-trap: when grounding reveals two variants of a now-
  forbidden pattern (WS2 strict vs WS2 expanded), the answer is never
  one of the variants — it is reshape the work shape.

**Original content below kept verbatim for forensic reference. Do not
execute.**

---

---
name: "Observability Multi-Sink and Fixture Orthogonality"
overview: >
  Replace today's single `SENTRY_MODE = off | fixture | sentry` switch with two
  orthogonal axes — `OBSERVABILITY_SINKS` (typed list of external sink targets;
  stdout via `@oaknational/logger` is the always-implicit baseline) and
  `OBSERVABILITY_FIXTURES` (orthogonal fixture-as-tee boolean). The shape is the
  structural cure for the local-dev `pnpm dev` failure surface in
  `apps/oak-curriculum-mcp-streamable-http`, and the architectural seam
  ADR-162's three-sink topology, ADR-143's coherent fan-out, and ADR-160's
  redaction barrier all already presuppose. Atomic rename across six workspaces;
  no compatibility layer, no transitional alias, no cheap-fix path. Includes a
  new ADR-171 as the canonical decision record for the orthogonal-axes shape,
  amendments to ADR-116/143/162/163, and full documentation propagation across
  the root README, both app READMEs, governance and operations docs, and inline
  TSDoc. Executed under ARC B of `there-is-no-time-hashed-starfish.plan.md`
  (parent execution sequencer — that plan owns ARC A smoke-harness redesign and
  ARC C push/preview/merge alongside this plan's substance).
status: current
isProject: true
todos:
  - id: ws0-promote-and-archive
    content: "WS0 (PRELUDE): copy this plan into .agent/plans/observability/current/observability-multi-sink-and-fixtures-shape.plan.md; archive the wrong-shaped predecessor (local-dev-sentry-boundary-regression-investigation) and the superseded future-plan (observability-config-coherence) to archive/superseded/ with single-line linking notes; update active-plans index."
    status: done
  - id: ws1-red-types-and-regression-guard
    content: "WS1: ALREADY LANDED at commit a3a0222a — OBSERVABILITY_SINKS / OBSERVABILITY_FIXTURES Zod schema + SinkRegistry type + fixture-as-tee fan-out + cross-field superRefine in @oaknational/observability and @oaknational/env + outermost regression-guard E2E + per-layer tests. WS1 was committed under the now-deleted multi-commit-TDD shape and left 4 skipped tests in the tree (config-from-registry.unit.test.ts, runtime-fixture-tee-redaction.unit.test.ts, http-observability.unit.test.ts, cli-observability.unit.test.ts). Each of WS2/WS4/WS5 below is a CYCLE-PAIR commit that unskips the relevant test(s) AND adds the product code that greens them — together, in ONE landing."
    status: done
  - id: ws2-cycle-sentry-node-registry
    content: "WS2 cycle: @oaknational/sentry-node SinkRegistry consumption. ONE COMMIT — unskip config-from-registry.unit.test.ts AND runtime-fixture-tee-redaction.unit.test.ts AND add the product code that greens them: rewrite sentry-node internals to consume SinkRegistry; delete SentryMode type; rename FixtureSentryStore → FixtureCaptureStore (vendor-neutral); recompose ParsedSentryConfig discriminated union from cross-product of (sinks.includes('sentry'), fixtures). Tree green at end."
    status: pending
  - id: ws3-cycle-env-layer
    content: "WS3 cycle: @oaknational/env / @oaknational/env-resolution. ONE COMMIT (or several smaller cycles if the env-layer slice is too big to land at once) — write the env-layer tests + ship the product code that greens them: ObservabilityEnvSchema with sinks + fixtures + locality+DSN superRefine (file-sink-config-required-when-file-in-sinks names OBSERVABILITY_FILE_PATH explicitly); SinkRegistry placement at packages/core/observability/src/sink-registry.ts; @deprecated tag on SentryEnvSchema (NOT deleted yet — deletion lands in WS5 because both apps still consume it until WS4/WS5 migrate); warnings field added to resolveEnv Result; hard error on legacy SENTRY_MODE with rename-replacement message; MCP_LOGGER_FILE_* folded into the registry (file-sink as registry entry); old MCP_LOGGER_* env vars rejected. Tree green at end of every commit (split into smaller cycles if a single commit is too large)."
    status: pending
  - id: ws4-cycle-http-app-atomic-rename
    content: "WS4 cycle: HTTP MCP atomic rename. ONE COMMIT — unskip http-observability.unit.test.ts AND add the product code that greens it: atomic rename across env.ts, runtime-config.ts, observability/http-observability.ts (remove additionalSinks parallel mechanism), operations/development/http-dev-contract.ts (delete observe-noauth special case), build-scripts/sentry-build-environment.ts (drop SENTRY_MODE from inherited SentryConfigEnvironment shape), smoke-tests/modes/local-stub-env.ts, .env.example. WS4 does NOT touch app/core-endpoints.ts (WS6 owns composition-root vendor-import removal in full per replace-don't-bridge). Logger fan-out migration (sink-config.ts + unified-logger.ts) lands in this WS slice with completion gate. The smoke regression-guard pnpm smoke:dev:no-observability goes green at this commit. Tree green at end."
    status: pending
  - id: ws5-cycle-search-cli-atomic-rename
    content: "WS5 cycle: Search CLI atomic rename. ONE COMMIT — unskip cli-observability.unit.test.ts AND add the product code that greens it: atomic rename across observability/cli-observability.ts, bin/oaksearch.ts, src/lib/env.ts (+ tests), src/lib/logger.ts (registerAdditionalSink path), .env.example. FINAL acts of WS5 (in the same commit): delete packages/core/env/src/schemas/sentry.ts AND delete packages/core/env/tests/schemas/sentry.unit.test.ts (orphaned by the rename). After WS5 close grep -rn 'SentryEnvSchema|SentryMode' packages/ returns zero matches. Tree green at end."
    status: pending
  - id: ws6-cycle-server-instrumenter-port
    content: "WS6 cycle: ServerInstrumenter port + ESLint rule. ONE COMMIT — write the port test + the port implementation + the ESLint rule's RuleTester unit tests + the rule itself + plugin registration + root ESLint config wire-up. Substance: introduce ServerInstrumenter port in @oaknational/observability; sentry-node implements it; HTTP MCP composition root consumes injected port (removes wrapMcpServerWithSentry + setupExpressErrorHandler direct vendor imports across index.ts, server.ts, app/core-endpoints.ts, scripts/server-harness.ts); AUTHOR the no-vendor-observability-import ESLint rule at packages/core/oak-eslint/src/rules/no-vendor-observability-import.ts + RuleTester tests + plugin registration in packages/core/oak-eslint/src/plugin.ts + root ESLint config wire-up; allowlist contains exactly one entry: packages/libs/sentry-node/src/server-instrumenter.ts; ADR-162 §Open Question on direct vendor imports closed. If the slice is too large for one commit, split into smaller cycles (port-test+port; rule-test+rule; composition-root-test+composition-root) and land each green. Tree green at end of every commit."
    status: pending
  - id: ws7-conformance-plan-body-update
    content: "WS7: edit body of multi-sink-vendor-independence-conformance.plan.md to reference OBSERVABILITY_SINKS=[] in place of SENTRY_MODE=off; cite no-vendor-observability-import as LANDED (not planned) per WS6; update .agent/plans/observability/high-level-observability-plan.md substrate inventory."
    status: pending
  - id: ws8-refactor-docs-and-adrs
    content: "WS8 (REFACTOR — DOCS & ADRS): TSDoc on all new types and ports; packages/core/observability/README.md exports listing; READMEs (@oaknational/observability, @oaknational/sentry-node, @oaknational/logger, @oaknational/env, @oaknational/env-resolution) plus root README and both app READMEs (with cross-app distributed tracing forward-pointer in Search CLI README); docs/governance/logging-guidance.md update; docs/operations/sentry-deployment-runbook.md update; docs/operations/environment-variables.md propagation entry; new ADR-171 (Observability Configuration Orthogonality — number verified 2026-05-03); ADR-116, ADR-143, ADR-162, ADR-163 amendments."
    status: pending
  - id: ws9-quality-gates
    content: "WS9: full quality-gate chain (pnpm clean && sdk-codegen && build && type-check && doc-gen && format:root && markdownlint:root && lint:fix && subagents:check && portability:check && test:root-scripts && test && test:widget && test:e2e && test:ui && test:a11y && test:widget:ui && test:widget:a11y && smoke:dev:stub && smoke:dev:no-observability && practice:fitness:informational && practice:vocabulary). Exit 0."
    status: pending
  - id: ws9-5-pre-merge-divergence-analysis-cross-reference
    content: "WS9.5: cross-reference entry only. Pre-merge divergence analysis executes under there-is-no-time-hashed-starfish §ARC C1, AFTER this plan's WS10/WS11 close. No gate fires inside this plan; assumptions-reviewer flagged the parallel framing as sequencing-ambiguous and the parent plan owns the canonical slot."
    status: pending
  - id: ws10-adversarial-review
    content: "WS10: invoke specialist reviewers per matrix (assumptions-reviewer, sentry-reviewer, architecture-reviewer-fred + wilma + betty, type-reviewer, test-reviewer, config-reviewer, mcp-reviewer, security-reviewer, code-reviewer gateway, docs-adr-reviewer, onboarding-reviewer, release-readiness-reviewer). Implement findings unless rejected with rationale per principles.md."
    status: pending
  - id: ws11-doc-propagation-and-spawned-plans
    content: "WS11: cite existing future/cross-system-correlated-tracing.plan.md from the Search CLI README forward-pointer note (no new plan needed; existing plan covers MCP↔SDK↔upstream API↔ES correlation); spawn future/config-management-platform-evaluation.plan.md (carry-over from WS-E of the superseded future-plan); graduate the mandatory-always doc-and-onboarding reviewer doctrine to a permanent rule (per owner direction 2026-05-02); run /jc-consolidate-docs."
    status: pending
---

# Observability Multi-Sink and Fixture Orthogonality

**Last Updated**: 2026-05-03 (TDD shape restructured to cycle-pairs)
**Status**: 🟡 IN PROGRESS — WS0 (`e1840631`) and WS1 (`a3a0222a`)
landed; ARC B0 corrections from architecture-reviewer-betty findings
Q2-Q6 applied 2026-05-03; WS2 (sentry-node SinkRegistry consumption,
restructured as a cycle-pair commit that unskips and greens the 2
sentry-node tests in one landing) is the next-session landing target.

## TDD Shape — Cycles, not Phases (restructured 2026-05-03)

This plan was originally authored under the now-deleted multi-commit-
TDD shape (RED commit followed by separate GREEN commits, with skipped
tests left in the tree across multiple commits). That shape violates
`testing-strategy.md` § "TDD = test + product code as PAIRS" and
produced 4 of the 6 skipped tests now visible as no-skipped-tests
violations across the codebase (config-from-registry.unit.test.ts;
runtime-fixture-tee-redaction.unit.test.ts; http-observability.unit.test.ts;
cli-observability.unit.test.ts).

Going forward, every remaining workstream is a CYCLE-PAIR landing:
each commit unskips the relevant test(s) AND adds the product code
that makes them pass — together, in ONE landing. The tree is green
at the end of every commit. No commit ends with a skipped or failing
test. WS3 and WS6 may need to split into smaller sub-cycles if their
slice is too large for a single commit; the cycle-per-commit
discipline holds at every level.

References below to "WS1 RED phase", "GREEN" suffixes on later WSs,
"named-deferral discipline", "structural-enforcement scanner
workstream", "RED-arc skip register", or "SKIP-UNTIL-WSn markers" are
obsolete — they pointed at the deleted multi-commit-TDD-skip-register
infrastructure. Treat them as removed. Substance (file paths,
behaviour specifications, reviewer dispatches) is preserved; the
cycle-pair shape replaces the multi-commit shape.
**Lifecycle target**: `current/` → `active/` on WS2 commit (deferred from
WS1; the RED-only WS1 was committed in `current/` because the executable
work is now multi-session and the `active/` move is more meaningful when
the first GREEN code lands)
**Branch**: `feat/eef_exploration` (RED arc landed on the existing branch
to stay aligned with the broader 2026-05-02 owner roadmap; future
considerations of a dedicated `feat/observability-multi-sink` branch
remain open per WS9 quality-gate breadth)
**Thread**: `observability-sentry-otel`

---

## ARC B0 Corrections Applied (2026-05-03)

Per architecture-reviewer-betty findings Q2-Q6 surfaced during the
2026-05-03 plan-validation pass and folded into ARC B0 of
[`there-is-no-time-hashed-starfish.plan.md`](./there-is-no-time-hashed-starfish.plan.md):

| # | Finding | Correction in this plan |
|---|---|---|
| Q2 | `SentryEnvSchema` deletion at WS3 would break two app type-check targets | Deletion moved to WS5 close (FINAL act of the rename arc); `@deprecated` tag at WS3 |
| Q3 | WS4 task list contained `replace-don't-bridge`-violating "work bridges to WS6" language | WS4 does NOT touch `app/core-endpoints.ts`; WS6 owns composition-root vendor-import removal in full |
| Q4 | `no-vendor-observability-import` ESLint rule scheduled for "narrowing" but the rule does not exist in `packages/core/oak-eslint/src/plugin.ts` | WS6 AUTHORS the rule (file + RuleTester unit tests + plugin registration + root config wire-up); allowlist size = 1 |
| Q5 | 30-commit divergence vs `origin/main` had no named pre-merge analysis step | New §WS9.5 — Pre-merge divergence analysis (named identically in ARC C1 of there-is-no-time-hashed-starfish; single execution covers both) |
| Q6 | Logger `additionalSinks` migration appeared in critical-files list with no completion gate | Explicit slot in WS4 (`packages/libs/logger/src/sink-config.ts` + `unified-logger.ts`) with reviewer dispatch |

Two additional sequencing corrections from the same pass:

- WS3 `OBSERVABILITY_FILE_PATH` env-var name made explicit in
  cross-field `superRefine` rules (file-sink-config-required-when-file-in-sinks)
- WS3 `SinkRegistry` placement at
  `packages/core/observability/src/sink-registry.ts` ratified
  (deviation from the originally-planned `types.ts` location supports
  tree-shaking and a clean export surface)
- WS4 `sentry-build-environment.ts` type-signature update added
  (drops `SENTRY_MODE` from inherited `SentryConfigEnvironment` shape
  per D7a verification)
- WS5 `sentry.unit.test.ts` deletion added (orphaned by the rename;
  paired with the `sentry.ts` schema deletion at WS5 close)

**ADR number correction (also B0)**: D12 originally proposed ADR-165;
verification 2026-05-03 by Woodland Sprouting Glade
(`ls docs/architecture/architectural-decisions/ | sort -n | tail -5`)
showed 165, 166, 167, 168, 169 already present. ARC A4 of
there-is-no-time-hashed-starfish.plan.md consumes 170 (smoke harness
ADR), so the orthogonality ADR in this plan is **171**. All
references in this plan body updated; re-verify immediately
pre-authoring in case a parallel landing has consumed the slot.

**ADR boundary across the parent/child plans**: ADR-170 (canonical
smoke-test harness shape) is authored by the parent plan
[`there-is-no-time-hashed-starfish.plan.md`](./there-is-no-time-hashed-starfish.plan.md)
under ARC A4. ADR-171 (observability configuration orthogonality) is
authored by THIS plan under WS8.6. Cross-plan citation only — neither
plan owns the other's authoring.

## Plan-File Promotion (WS0 — PRELUDE)

This plan file lives at the harness-mandated location while plan mode is
active. The first executed step on plan exit is to copy it into the repo
plan tree:

```bash
# WS0 — promotion path
cp /Users/jim/.claude/plans/please-create-a-plan-compressed-newt.md \
   .agent/plans/observability/current/observability-multi-sink-and-fixtures-shape.plan.md
```

The repo path becomes the canonical location; the harness copy is then
disposable.

## User Value

Operators get an observability config surface that matches the mental
model — *"which external sinks am I emitting to, and am I capturing
fixtures for tests?"* — instead of a single overloaded mode switch
that silently couples destination and isolation. Local development
boots cleanly without Sentry env vars by construction, not by an
env-var workaround. Future warehouse and PostHog sinks add to the
list as data, not as new mode values. The fixture surface is
vendor-neutral by name and shape, so non-Sentry sink-coverage tests
do not have to fight a Sentry-named type.

## Context

`pnpm dev` from `apps/oak-curriculum-mcp-streamable-http` currently fails
with *"Git SHA is required for Sentry release resolution but
VERCEL_GIT_COMMIT_SHA is not set"*. Root cause:

1. Default `SENTRY_MODE` when unset is `'off'` and short-circuits in
   `packages/libs/sentry-node/src/config.ts:46` before any release
   resolution.
2. Local `.env.local` files commonly set `SENTRY_MODE=sentry`; the dev
   server scrubs Vercel signals
   (`apps/oak-curriculum-mcp-streamable-http/operations/development/http-dev-contract.ts:151–155`)
   but does NOT override `SENTRY_MODE`.
3. Runtime then falls past the `off` short-circuit into
   `resolveSentryRelease` → `resolveGitSha` → `missing_git_sha` error
   (verbatim text emitted from
   `packages/libs/sentry-node/src/runtime-error.ts:74`).
4. The `observe-noauth` mode hard-codes `SENTRY_MODE: 'off'` at
   `http-dev-contract.ts:162`; `dev` mode does not. The asymmetry is
   the proximate symptom; the deeper issue is that `SENTRY_MODE`
   conflates **sink target selection** with **fixture-vs-live capture**
   into one switch.

The cheap cure ("set `SENTRY_MODE=off` in `.env.local`" or "hard-code
`SENTRY_MODE=off` in `dev` mode") is categorically excluded by
[`principles.md § Architectural Excellence Over Expediency`](../../../.agent/directives/principles.md#architectural-excellence-over-expediency)
(graduated 2026-05-02 from the rush-impulse-as-entropy-generator
napkin entry). The structural cure — orthogonal axes — is the only
path on the table.

This plan supersedes
[`future/observability-config-coherence.plan.md`](../future/observability-config-coherence.plan.md)
(strategic brief) and replaces
[`current/local-dev-sentry-boundary-regression-investigation.plan.md`](./local-dev-sentry-boundary-regression-investigation.plan.md)
(wrong-framed predecessor — diagnosed the bug correctly but framed the
cure too narrowly).

## Design Decisions

The seven design questions surfaced during planning are decided
inside this plan. The decisions are summarised here; reasoning lives
in the dispatched-plan-agent transcript and is preserved by reference
in WS1's design-record commit body.

| # | Question | Decision |
|---|---|---|
| D1 | Fixtures: orthogonal switch vs sink kind? | **Orthogonal switch.** Fixtures are a tee that observes post-redaction events bound for the configured sinks; they are not themselves a destination. Coding fixtures as a sink would force "fixture vs sentry" mutual exclusion or duplicate-fan-out. ADR-160 boundary semantics confirm: fixtures live downstream of redaction, upstream of nothing. |
| D2 | Naming: `OBSERVABILITY_SINKS` vs `OBSERVABILITY_EXTERNAL_SINKS`; stdout in list vs implicit? | **`OBSERVABILITY_SINKS`, stdout implicit.** ADR-162's vendor-independence clause makes stdout always-on. Operators cannot disable it; exposing it in the list would create a false config surface. The list is *additional external sinks on top of the always-on baseline*. Documented in TSDoc and ADR-162 amendment. |
| D3 | Migration sequencing across workspaces? | **Atomic rename per call-graph slice.** RED tests + outermost regression guard land in WS1 across the whole stack; per-package GREEN slices land WS2-WS6. Each commit individually passes `pnpm type-check` per `dont-break-build-without-fix-plan`. No transitional flag (per `replace-don't-bridge`). |
| D4 | Include WS-D (`ServerInstrumenter` port) in this plan? | **Yes.** Resolves ADR-162 §Open Question. Bundles the `wrapMcpServerWithSentry` + `setupExpressErrorHandler` direct-import gap. Architectural excellence at all layers in one coherent change. |
| D5 | Touch the conformance test plan? | **Yes — body edit.** `multi-sink-vendor-independence-conformance.plan.md` references `SENTRY_MODE=off`; rename it to `OBSERVABILITY_SINKS=[]` in the plan body. The conformance test *implementation* lands when that plan executes; this plan's responsibility is to update the contract pointer. |
| D6 | Disposition of wrong-shaped predecessor? | **Archive to `archive/superseded/`** with single-line linking note (`Superseded 2026-05-02 by observability-multi-sink-and-fixtures-shape — the cure is structural, not local-dev-specific`). Per `version with git, not with names`. |
| D7a | Build-time `sentry-build-plugin.ts` orthogonality? | **Verify at WS1 by reading `sentry-build-environment.ts` end-to-end.** If the build-time path consults `SENTRY_MODE`, scope expands to include build-time rename in WS4. If purely Vercel-signal + auth-token gated, it stays orthogonal. Decision rule: don't assume; the test is the read. |
| D7b | `observability-events-workspace` dependency? | **No dependency.** Schemas are orthogonal to sink selection. Conformance test (D5) depends on events workspace, but that's a downstream concern handled by the conformance plan body update only. |

Additional decisions (Plan-agent identified blind spots):

| # | Question | Decision |
|---|---|---|
| D8 | File-sink (`MCP_LOGGER_FILE_PATH`) folding into registry? | **Yes — fold.** Otherwise WS-A only renames *half* of the dual mechanism. `OBSERVABILITY_SINKS=['sentry','file']` is valid; old `MCP_LOGGER_FILE_*` env vars rejected with rename-replacement message. |
| D9 | Locality enforcement strength (preview/production with empty sinks)? | **Warn in preview, fail-closed in production.** Production with `OBSERVABILITY_SINKS=[]` is a misconfiguration ADR-162 should refuse to boot through. Preview with empty sinks is a deliberate dev-mode shape. Encoded in `superRefine` cross-field with `VERCEL_ENV`. |
| D10 | Warnings channel shape on `resolveEnv`? | **Sibling `warnings` field on success Result.** Additive; non-warning consumers compile-clean. Extends existing `Result<T, E>` pattern without breaking it. |
| D11 | Helper placement (`composeWithSinkConfiguration`)? | **Shared `@oaknational/env`.** Generic over mode discriminator. Sentry uses it; warehouse/PostHog will reuse the shape. Satisfies Context Specificity Gradient. |
| D12 | New ADR vs amendments only? | **New ADR-171 (`Observability Configuration Orthogonality`)** (number verified 2026-05-03; original D12 said 165 but 165 is taken — `agent-work-practice-phenotype-boundary.md`) PLUS amendments to ADR-116/143/162/163. The orthogonal-axes shape is reusable across every future sink and capability per PDR-019; a single coherent decision record beats four scattered amendments. The amendments cite ADR-171 as canonical. |

## Disposition of Existing Plans

| Plan | Action | Path after WS0/WS11 |
|---|---|---|
| `future/observability-config-coherence.plan.md` | **Superseded** — its WS-A/B/C/D become this plan's WS-2…6 | `archive/superseded/observability-config-coherence.plan.pre-orthogonal-axes-2026-05-02.md` |
| `current/local-dev-sentry-boundary-regression-investigation.plan.md` | **Superseded** — wrong frame; replaced structurally | `archive/superseded/local-dev-sentry-boundary-regression-investigation.plan.pre-shape-fix-2026-05-02.md` |
| `current/multi-sink-vendor-independence-conformance.plan.md` | **Body update only** — `SENTRY_MODE=off` → `OBSERVABILITY_SINKS=[]` | unchanged path; status unchanged |
| `active/sentry-observability-maximisation-mcp.plan.md` | **No change** — consumes the registry but doesn't drive it | unchanged |
| `future/sentry-observability-maximisation.plan.md` | **No change** | unchanged |
| `high-level-observability-plan.md` | **Index update** — rename in substrate inventory | unchanged path |
| `future/cross-system-correlated-tracing.plan.md` | **CITED, NOT DUPLICATED** — existing plan already covers MCP↔SDK↔upstream API↔ES correlation; the Search CLI README forward-pointer references this plan | unchanged path |
| `future/config-management-platform-evaluation.plan.md` | **NEW STUB** — WS-E carry-over from superseded future-plan | new file, see WS11 |
| `there-is-no-time-hashed-starfish.plan.md` | **PARENT EXECUTION SEQUENCER** (authored 2026-05-03) — this plan is ARC B (corrected) within that three-arc sequencer; ARC A is the smoke-harness redesign that reclassifies the WS1 regression-guard from e2e to smoke; ARC C is push/preview/merge | unchanged path |

## Workstream Structure

### WS0 — PRELUDE: Plan-file promotion and predecessor archiving

**Outcome**: This plan is at its canonical repo path; superseded plans
are archived; active-plans index reflects the change.

**Tasks**:

- Copy the harness-located plan into
  `.agent/plans/observability/current/observability-multi-sink-and-fixtures-shape.plan.md`
- Archive the two superseded plans to
  `.agent/plans/observability/archive/superseded/` with single-line
  linking notes
- Update `.agent/plans/observability/current/README.md` and
  `.agent/plans/observability/future/README.md` indices
- Update `.agent/memory/operational/threads/observability-sentry-otel.next-session.md`
  landing target

**Acceptance**: `git ls-files .agent/plans/observability/current/` shows
the new plan; `archive/superseded/` shows both predecessor plans;
indices are accurate.

### WS1 — RED: Types, schemas, and outermost regression guard

**Status**: LANDED (`a3a0222a`). The task list below is the historical
record of what was authored.

**Post-WS1 reclassification under ARC A3**: the
`dev-server-boots-without-observability-config.e2e.test.ts` file named
in the WS1 task list was reclassified from e2e to smoke and moved to
`smoke-tests/local-no-observability/dev-server-operational.smoke.test.ts`
(see §"Outermost Regression-Guard Test" below). The behaviour
contract is unchanged; the harness shape and home are corrected.

**Post-WS1 placement ratification under ARC B0**: the WS1 task list
named `packages/core/observability/src/types.ts` as the home for
`SinkRegistry`. The actual landed placement is
`packages/core/observability/src/sink-registry.ts` for `SinkRegistry`
itself, with `types.ts` reserved for port shapes (e.g.
`ServerInstrumenter`). The deviation is sound and ratified in §"ARC B0
Corrections Applied" above.

**Outcome (as landed)**: Every test that should fail when the rename
has not landed is in place and failing for the right reason. The
schemas and types exist as production code (not test-only stubs);
consumers are stub'd to compile only.

**Tasks**:

- Read `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-build-environment.ts`
  end-to-end (verify D7a — build-time orthogonality assumption)
- Author `OBSERVABILITY_SINKS` Zod schema (array of literal `'sentry' | 'file'`,
  extensible for future `'warehouse' | 'posthog'`) in
  `packages/core/env/src/schemas/observability.ts`
- Author `OBSERVABILITY_FIXTURES` Zod schema (boolean) in same file
- Author `ObservabilityEnvSchema` composition with cross-field
  `superRefine`: enforces (i) DSN-required-when-sentry-in-sinks,
  (ii) production-without-remote-sink-is-error, (iii) preview-without-remote-sink-is-warning,
  (iv) legacy-`SENTRY_MODE`-or-`MCP_LOGGER_*`-set-is-rename-replacement-error,
  (v) file-sink-config-required-when-file-in-sinks
- Author `SinkRegistry` type and `ServerInstrumenter` port in
  `packages/core/observability/src/types.ts`
- Extend `resolveEnv` Result success path with `warnings: EnvWarning[]`
  in `packages/libs/env-resolution/src/resolve-env.ts`
- Author the outermost regression-guard E2E test
  `apps/oak-curriculum-mcp-streamable-http/e2e-tests/dev-server-boots-without-observability-config.e2e.test.ts`
  (asserts `pnpm dev` from a fresh-shell environment with no
  `OBSERVABILITY_*`, `SENTRY_*`, or `VERCEL_*` env vars boots cleanly
  within 30s and exits 0 on SIGTERM)
- Author per-layer RED unit tests:
  - `packages/core/env/src/schemas/observability.unit.test.ts` (env schema)
  - `packages/core/observability/src/sink-registry.unit.test.ts` (type shape)
  - `packages/libs/sentry-node/src/config.unit.test.ts` extensions
    (consume registry shape, not `SENTRY_MODE`)
  - `apps/oak-curriculum-mcp-streamable-http/src/observability/http-observability.unit.test.ts`
    (composition root)
  - `apps/oak-search-cli/src/observability/cli-observability.unit.test.ts`
    (composition root)
- Author redaction-barrier extension tests in
  `packages/libs/sentry-node/src/runtime-redaction-barrier.unit.test.ts`:
  fixture tee observes post-redaction events only

**TDD discipline**: Every test fails for the right reason (consumer
not yet wired, not "test syntax error" or "compile-only"). Run each
test; capture the failure message; commit the failures into the WS1
commit body for the design-record audit trail.

**Acceptance**:

- `pnpm test --filter @oaknational/env --filter @oaknational/observability`
  exits non-zero with expected failure messages
- `pnpm test:e2e --filter @oak-curriculum-mcp-streamable-http`
  exits non-zero with regression-guard failure
- `pnpm type-check` exits non-zero only on consumer-wiring gaps
  (canary signal — no other type breakage)

### WS2 — GREEN: `@oaknational/sentry-node` registry consumption

**Outcome**: sentry-node consumes `SinkRegistry`, no longer reads
`SENTRY_MODE`. Fixture types are vendor-neutral.

**Tasks**:

- Rewrite `packages/libs/sentry-node/src/config.ts` to derive its
  `ParsedSentryConfig` discriminated union from
  `(sinks.includes('sentry'), fixtures)` cross-product:
  - `sinks.includes('sentry') === false` → `kind: 'sentry-disabled'`
  - `sinks.includes('sentry') === true && fixtures === false` → `kind: 'sentry-live'`
  - `sinks.includes('sentry') === true && fixtures === true` → `kind: 'sentry-live-with-tee'`
  - `sinks.includes('sentry') === false && fixtures === true` → `kind: 'fixture-only'`
- Delete `SentryMode` type from `packages/libs/sentry-node/src/types.ts`
- Rename `FixtureSentryStore` → `FixtureCaptureStore` (vendor-neutral);
  `FixtureSentryCapture*` → `FixtureCaptureRecord*`; capture-record
  discriminated union becomes vendor-neutral with optional Sentry-shaped
  fields where the source vendor matters
- Rewrite `packages/libs/sentry-node/src/runtime.ts` mode dispatch to
  consume the new union
- Rewrite `packages/libs/sentry-node/src/runtime-sinks.ts` to wire the
  fixture tee separately from the live Sentry sink (both can fire
  for `kind: 'sentry-live-with-tee'`)
- Update all sentry-node unit + integration tests to use the new
  contract
- Run `pnpm test --filter @oaknational/sentry-node` exit 0

**Acceptance**: sentry-node test suite passes; type-check passes for
the package and its direct consumers; the package no longer references
`SENTRY_MODE` (`grep -r "SENTRY_MODE" packages/libs/sentry-node/`
returns zero matches).

### WS3 — GREEN: Env-resolution layer (corrected — deletion timing deferred)

**Outcome**: `@oaknational/env` ships `ObservabilityEnvSchema`;
`SentryEnvSchema` is `@deprecated` (NOT deleted at this WS — both apps
still consume it); warnings channel is in place; rename errors are
clear and actionable.

**Correction note (architecture-reviewer-betty Q2)**: Deleting
`SentryEnvSchema` here would break the build —
`apps/oak-curriculum-mcp-streamable-http/src/env.ts:7,31` and
`apps/oak-search-cli/src/env.ts:18,31` both consume it today. The
mechanism that satisfies
[`dont-break-build-without-fix-plan`](../../../.agent/rules/dont-break-build-without-fix-plan.md)
is the *deferral itself* — WS5 close is the FINAL act, after both
apps migrate. The `@deprecated` JSDoc tag added in this WS is a
*discovery signal* for human reviewers (it does not produce a
type-check or build error and therefore does not, by itself, satisfy
the rule). Per
[`replace-don't-bridge`](../../../.agent/rules/replace-dont-bridge.md)
no other transitional surface (re-export alias, type-flip, conditional
fallback) is allowed.

**Tasks**:

- Add `@deprecated` JSDoc tag on `packages/core/env/src/schemas/sentry.ts`
  with reason text `Replaced by ObservabilityEnvSchema. See ADR-171
  (orthogonal axes for sink configuration).` (Wording avoids embedding
  a workstream pointer because the workstream identifier becomes stale
  the moment the rename completes; the commit body carries the
  workstream pointer instead. The `@deprecated` tag is a discovery
  signal, not the structural mitigation — see the correction note
  above.)
- Author `packages/core/env/src/schemas/observability.ts` with the
  `OBSERVABILITY_SINKS` / `OBSERVABILITY_FIXTURES` schemas + `ObservabilityEnvSchema`
  composition
- Author `SinkRegistry` at the canonical placement
  `packages/core/observability/src/sink-registry.ts` (deviation from
  the originally-planned `types.ts` location is ratified — placement
  supports tree-shaking and a clean export surface; `types.ts` retains
  only port shapes such as `ServerInstrumenter`)
- Author cross-field `superRefine` validators in `ObservabilityEnvSchema`:
  - DSN required when `'sentry'` in sinks
  - `OBSERVABILITY_FILE_PATH` required when `'file'` in sinks
    (file-sink-config-required-when-file-in-sinks; the env var name is
    `OBSERVABILITY_FILE_PATH` — explicit per B0 correction)
  - Production env with empty external sinks → hard error
  - Preview env with empty external sinks → warning
  - Legacy `SENTRY_MODE` set → hard error with message:
    `'SENTRY_MODE has been replaced by orthogonal axes. Set OBSERVABILITY_SINKS=["sentry"] OBSERVABILITY_FIXTURES=false to keep current behaviour, or OBSERVABILITY_SINKS=[] to disable. See ADR-171.'`
  - Legacy `MCP_LOGGER_FILE_PATH` / `MCP_LOGGER_FILE_APPEND` /
    `MCP_LOGGER_STDOUT` set → hard error with literal message:
    `'MCP_LOGGER_* env vars have been replaced. Set OBSERVABILITY_SINKS=["file"] OBSERVABILITY_FILE_PATH=<path> to keep current file-sink behaviour, or omit "file" from OBSERVABILITY_SINKS to disable. See ADR-171.'`
- Add `warnings: EnvWarning[]` to `resolveEnv` Result success path in
  `packages/libs/env-resolution/src/resolve-env.ts`
- Author `composeWithSinkConfiguration` generic helper in
  `packages/core/env/src/`
- Run `pnpm test --filter @oaknational/env --filter @oaknational/env-resolution`
  exit 0; both apps still type-check (consumers unchanged at this WS)

**Acceptance**: env tests pass; `SentryEnvSchema` still exists with
`@deprecated` tag (`grep -r "SentryEnvSchema" packages/` returns at
least one match — the file itself); rename-replacement error message
is exercised by test; both apps still build (consumers unchanged).

### WS4 — GREEN: HTTP MCP app atomic rename (corrected — no bridge to WS6)

**Outcome**: `apps/oak-curriculum-mcp-streamable-http` boots cleanly
with no observability env vars; the `observe-noauth` carve-out is
deleted; the smoke regression-guard `pnpm smoke:dev:no-observability`
goes GREEN. WS4 does NOT touch `app/core-endpoints.ts`; WS6 owns
composition-root vendor-import removal in full.

**Correction note (architecture-reviewer-betty Q3)**: The original WS4
task list contained *"Update core-endpoints.ts to consume injected
`ServerInstrumenter` (work bridges to WS6)"* — exactly the language
[`replace-don't-bridge`](../../../.agent/rules/replace-dont-bridge.md)
forbids (injecting a port that doesn't exist yet AND keeping the
direct vendor import live is a dual-path bridge). Composition-root
vendor-import removal is therefore moved out of WS4 entirely and into
WS6 in full.

**Tasks** (single-commit slice; intermediate commits OK if each passes
type-check):

- Update `apps/oak-curriculum-mcp-streamable-http/src/env.ts` to import
  `ObservabilityEnvSchema`; delete all `SENTRY_MODE` references
- Update `apps/oak-curriculum-mcp-streamable-http/src/runtime-config.ts`
  to expose registry + fixtures-flag fields
- Rewrite `apps/oak-curriculum-mcp-streamable-http/src/observability/http-observability.ts`
  to consume `SinkRegistry`; remove `additionalSinks` parallel mechanism
- Migrate logger fan-out to consume the registry (explicit slot, not
  just a critical-files mention — architecture-reviewer-betty Q6):
  - Update `packages/libs/logger/src/sink-config.ts` to derive sink
    fan-out from `SinkRegistry`; remove `LoggerSinkConfig` parallel
    type
  - Update `packages/libs/logger/src/unified-logger.ts` to consume the
    registry-derived fan-out
  - Logger unit tests cover the registry-driven fan-out shape
  - **Package-edge note**: this introduces `@oaknational/observability`
    as a dependency of `@oaknational/logger` if it is not already
    present. Verify and amend `packages/libs/logger/package.json`
    accordingly. The new edge is `apply-architectural-principles`-compatible
    (logger consumes core observability primitives) but is a
    load-bearing structural detail that warrants explicit review
    rather than silent absorption.
- Delete `apps/oak-curriculum-mcp-streamable-http/operations/development/http-dev-contract.ts:162`
  carve-out (`observe-noauth` `SENTRY_MODE: 'off'` hard-code); both
  `dev` and `observe-noauth` modes share defaults
  (`OBSERVABILITY_SINKS=[]`, `OBSERVABILITY_FIXTURES=false`)
- Update `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-build-environment.ts`:
  drop `SENTRY_MODE` from inherited `SentryConfigEnvironment` shape
  (read at line 23 today as pass-through; verified D7a). The
  build-time release-resolution path is orthogonal to runtime sink
  selection and continues to consult Vercel signals + auth token only.
- Update `apps/oak-curriculum-mcp-streamable-http/smoke-tests/modes/local-stub-env.ts`
  to delete the single `SENTRY_MODE='off'` token at line 31 (per
  Misty's recon — only smoke-tree change required for the rename);
  update mode-environment unit tests to assert new shape
- Update `.env.example` with the new contract and inline operator guidance
- **NOT in scope (moved to WS6)**: `app/core-endpoints.ts`,
  `src/index.ts`, `src/server.ts`, `scripts/server-harness.ts`. WS6
  owns composition-root vendor-import removal in full.
- **NOT in scope (deleted under ARC A3 of there-is-no-time-hashed-starfish.plan.md)**:
  `e2e-tests/dev-server-boots-without-observability-config.e2e.test.ts`
  was reclassified from e2e to smoke under ARC A3; the regression
  contract moves to `smoke-tests/local-no-observability/dev-server-operational.smoke.test.ts`
  invoked via `pnpm smoke:dev:no-observability`.
- Run `pnpm test --filter @oak-curriculum-mcp-streamable-http` exit 0
- Run the smoke regression-guard `pnpm smoke:dev:no-observability` —
  goes GREEN at this commit

**Acceptance**: HTTP MCP app test suite passes; smoke regression-guard
exit 0; `grep -r "SENTRY_MODE" apps/oak-curriculum-mcp-streamable-http/`
returns zero matches; reviewer findings absorbed.

### WS5 — GREEN: Search CLI atomic rename + final SentryEnvSchema deletion

**Outcome**: Search CLI boots cleanly with the new contract; ready for
future Sentry emission expansion (WS11 forward-pointer plan). FINAL
deletion of `SentryEnvSchema` happens here, after the Search CLI's
`env.ts` migrates — closing the rename arc.

**Correction note (architecture-reviewer-betty Q2)**: deletion of
`packages/core/env/src/schemas/sentry.ts` and the orphaned test file
`packages/core/env/tests/schemas/sentry.unit.test.ts` is the FINAL act
of WS5, not the FIRST act of WS3. Per
[`dont-break-build-without-fix-plan`](../../../.agent/rules/dont-break-build-without-fix-plan.md)
schemas may not be deleted while consumers exist; deletion runs only
after both apps have migrated.

**Tasks**:

- Update `apps/oak-search-cli/src/observability/cli-observability.ts`
  to consume `SinkRegistry`
- Update `apps/oak-search-cli/bin/oaksearch.ts` composition wiring
- Update `apps/oak-search-cli/src/lib/env.ts` and tests (replace
  `SentryEnvSchema` import with `ObservabilityEnvSchema`)
- Update `apps/oak-search-cli/src/lib/logger.ts` (`registerAdditionalSink`
  path) to consume the registry's fan-out instead of registering
  separately
- Update `.env.example` with the new contract
- **FINAL ACTS of WS5** (after Search CLI consumers migrate):
  - DELETE `packages/core/env/src/schemas/sentry.ts`
  - DELETE `packages/core/env/tests/schemas/sentry.unit.test.ts` (orphaned
    by the rename)
  - Remove `SentryEnvSchema` re-export from `packages/core/env/src/index.ts`
- Run `pnpm test --filter @oak-search-cli` exit 0
- Run repo-wide type-check exit 0

**Acceptance**: Search CLI test suite passes; cross-app type-check
passes; `grep -rn "SentryEnvSchema|SentryMode" packages/` returns
zero matches across the entire monorepo.

### WS6 — GREEN: `ServerInstrumenter` port + `no-vendor-observability-import` rule (corrected — rule authored, not narrowed)

**Outcome**: ADR-162 §Open Question on direct vendor imports is closed;
`@sentry/node` direct imports outside the adapter library are removed;
the `no-vendor-observability-import` ESLint rule is real, registered,
and applied.

**Correction note (architecture-reviewer-betty Q4)**: The original WS6
task list included *"Narrow ESLint `no-vendor-observability-import`
allowlist: remove the three composition-root carve-out file entries"*.
Recon at `packages/core/oak-eslint/src/plugin.ts` shows the plugin
exports four rules — none of them is `no-vendor-observability-import`.
Narrowing a non-existent rule is a vacuous pass dressed as success;
WS6 therefore AUTHORS the rule.

**Tasks**:

- Author `ServerInstrumenter` port in
  `packages/core/observability/src/types.ts` (vendor-neutral interface
  covering `wrapMcpServerWithSentry` semantics and
  `setupExpressErrorHandler` semantics)
- Implement the port in
  `packages/libs/sentry-node/src/server-instrumenter.ts`
- Update HTTP MCP composition root to consume the injected port —
  full vendor-import removal across:
  - `apps/oak-curriculum-mcp-streamable-http/src/index.ts` (delete
    `setupExpressErrorHandler` direct import; wire port)
  - `apps/oak-curriculum-mcp-streamable-http/src/server.ts` (similar)
  - `apps/oak-curriculum-mcp-streamable-http/src/app/core-endpoints.ts`
    (delete `wrapMcpServerWithSentry` direct import; wire port)
  - `apps/oak-curriculum-mcp-streamable-http/scripts/server-harness.ts`
    (delete any direct vendor import; wire port)
- AUTHOR `no-vendor-observability-import` ESLint rule:
  - `packages/core/oak-eslint/src/rules/no-vendor-observability-import.ts`
    (NEW; fires on any direct `@sentry/node` or `@sentry/*` import
    outside the allowlist). Future observability vendors (PostHog,
    warehouse, etc.) are added to the rule's pattern list as their
    adapter packages land — the rule pattern is not Sentry-specific
    but covers the *set of observability-vendor packages*. TSDoc on
    the rule names this scope explicitly so future maintainers do not
    treat it as a Sentry-only enforcement.
  - `packages/core/oak-eslint/src/rules/no-vendor-observability-import.unit.test.ts`
    (NEW; RuleTester valid + invalid cases including the allowlisted
    adapter file passing and a representative consumer-file-import
    failing)
  - Register the rule in `packages/core/oak-eslint/src/plugin.ts`
  - Wire the rule into the root ESLint config so it fires repo-wide
- Allowlist contains exactly one entry: `packages/libs/sentry-node/src/server-instrumenter.ts`.
- Run `pnpm lint` exit 0 with the new rule active; integration tests
  assert port forwards correctly to vendor semantics

**Acceptance**: ADR-162 §Open Question closed (cited in ADR-171);
`pnpm lint` exits 0 with the new rule active; `grep -rn "from '@sentry/" apps/`
returns zero matches outside the allowlisted adapter; reviewer
findings absorbed.

### WS7 — Plan-body updates (downstream consumers)

**Outcome**: Plan estate references the new contract; no dangling
`SENTRY_MODE` pointers in plan bodies; conformance plan body cites
the landed `no-vendor-observability-import` rule.

**Tasks**:

- Edit `.agent/plans/observability/current/multi-sink-vendor-independence-conformance.plan.md`:
  replace `SENTRY_MODE=off` with `OBSERVABILITY_SINKS=[]`; add
  reference to ADR-171; cite `no-vendor-observability-import` as
  LANDED (not planned) per WS6 authoring; allowlist is exactly one
  entry (the sentry-node adapter implementation file)
- Edit `.agent/plans/observability/high-level-observability-plan.md`
  substrate inventory to reference the landed registry
- Verify no other plan body references `SENTRY_MODE` outside historical
  / archive notes (`grep -r "SENTRY_MODE" .agent/plans/` excluding
  `archive/`)

**Acceptance**: plan bodies reference the new contract; no live
references to the deleted env var; conformance plan body cites the
rule as LANDED.

### WS8 — REFACTOR: Documentation propagation and ADR work

**Outcome**: Every documentation surface that mentioned `SENTRY_MODE`
or sink configuration reflects the orthogonal-axes shape. New ADR-171
is the canonical decision record. Cross-app distributed tracing
forward-pointer is in place.

#### WS8.1 — TSDoc

- TSDoc on `SinkRegistry`, `ServerInstrumenter`, `ObservabilityEnvSchema`,
  `OBSERVABILITY_SINKS`, `OBSERVABILITY_FIXTURES`, `OBSERVABILITY_FILE_PATH`,
  `FixtureCaptureStore`, `FixtureCaptureRecord*` (the renamed capture-record
  discriminated union from WS2), `ParsedSentryConfig` (the recomposed
  discriminated union with four `kind` variants per WS2), `EnvWarning`,
  all derived types
- TSDoc on every renamed sentry-node export
- Run `pnpm doc-gen` exit 0

#### WS8.2 — Workspace READMEs

- `packages/core/observability/README.md` — usage of `SinkRegistry`,
  `ServerInstrumenter`, fixture-as-tee semantics; explicit
  **Exports** listing (`SinkRegistry`, `ServerInstrumenter`,
  `EnvWarning` types; `SinkRegistry` value/factory; placement note
  that `sink-registry.ts` houses the registry itself with `types.ts`
  reserved for port shapes)
- `packages/libs/sentry-node/README.md` — adapter shape; how to use it
  via the registry; `ServerInstrumenter` implementation contract
- `packages/libs/logger/README.md` — fan-out registry consumption;
  removal of `additionalSinks` parameter; file-sink as registry entry;
  migration note for downstream consumers
- `packages/core/env/README.md` — `ObservabilityEnvSchema`, warnings
  channel, rename-replacement error messages
- `packages/libs/env-resolution/README.md` — warnings channel addition

#### WS8.3 — Root and app-level READMEs (operator-facing)

- `README.md` (root) — Quick Start updated; observability env-var
  contract documented at the right progressive-disclosure depth
- `apps/oak-curriculum-mcp-streamable-http/README.md` —
  - Operator usage guide for `OBSERVABILITY_SINKS` and
    `OBSERVABILITY_FIXTURES`
  - Local dev section explicitly states *"no observability env vars
    needed; defaults to stdout-only"*
  - Production deployment section names the required Vercel env vars
    for `OBSERVABILITY_SINKS=["sentry"]`
  - Migration note for operators who had `SENTRY_MODE` set
  - **Line-anchored rewrite targets** (per onboarding-reviewer P1
    finding — current README still teaches three-mode `SENTRY_MODE`
    mental model; load-bearing for operator onboarding): lines 72,
    82, 136, 197 (`docs/observability.md` link), 205-250
    (`pnpm dev:observe` / `pnpm dev:observe:noauth` block), 432.
    Verify line numbers immediately before edit (file may have
    drifted).
- `apps/oak-search-cli/README.md` —
  - Operator usage guide
  - **Forward-pointer note** (per owner reminder 2026-05-02; updated
    per onboarding-reviewer P1 finding to calibrate present-day
    expectation): *"**Today**: Search CLI and the HTTP MCP server emit
    independent traces; cross-system stitching is not yet wired.
    Search CLI ships with the same observability surface as the HTTP
    MCP server, and distributed-trace continuity across Search CLI,
    the HTTP MCP server, the upstream curriculum API, and
    Elasticsearch is owned by [`cross-system-correlated-tracing.plan.md`](../../.agent/plans/observability/future/cross-system-correlated-tracing.plan.md)
    — strategic brief; promotes when an incident or a Search CLI
    emission expansion exposes the gap. Operators running Search CLI
    alongside the HTTP MCP server can expect single-trace stitching
    across both systems once that plan executes."*

#### WS8.4 — Governance and operations docs

- `docs/governance/logging-guidance.md` — replace SENTRY_MODE three-mode
  guidance with the orthogonal-axes shape; cross-link to ADR-171
- `docs/operations/sentry-deployment-runbook.md` — update env tables
  (lines 59, 88, 275 per Explore findings); update disable-Sentry
  instructions to use `OBSERVABILITY_SINKS=[]`
- `docs/architecture/README.md` — refresh observability section
  reference to point at ADR-171 as canonical
- `docs/agent-guidance/` — grep sweep
  (`grep -rn "SENTRY_MODE\|MCP_LOGGER_" docs/agent-guidance/`); update
  any agent-facing guidance that names the legacy contract
- `CONTRIBUTING.md` (repo root) — grep sweep for observability /
  local-dev / runbook references; update if it mentions any of the
  renamed env vars or the deployment runbook locations
- `.agent/directives/AGENT.md` — explicit decision recorded: does the
  rename warrant a directive-level signpost? Likely no (AGENT.md is
  layer-orientation, not env-var documentation), but the decision is
  recorded explicitly per onboarding-reviewer P2 finding so future
  agents do not chase a missing signpost
- Any other doc referencing `SENTRY_MODE` (full grep sweep):
  `grep -rn "SENTRY_MODE" docs/ .agent/`

#### WS8.5 — `.env.example` files + environment-variables documentation

- `apps/oak-curriculum-mcp-streamable-http/.env.example` —
  - Replace SENTRY_MODE block with `OBSERVABILITY_SINKS` +
    `OBSERVABILITY_FIXTURES` + `OBSERVABILITY_FILE_PATH` block
  - Inline guidance on each sink type, default values, and the
    fixture-tee semantics
- `apps/oak-search-cli/.env.example` — same
- (Add to root `.env.example` if any observability env vars belong
  there)
- **`docs/operations/environment-variables.md`** — add or update an
  entry that propagates the orthogonal-axes contract to operators:
  full enumeration of `OBSERVABILITY_SINKS`, `OBSERVABILITY_FIXTURES`,
  and `OBSERVABILITY_FILE_PATH` with defaults, validation rules,
  legacy-rename guidance, and cross-link to ADR-171

#### WS8.6 — ADR-171 (NEW): Observability Configuration Orthogonality

**ADR number verification (verified 2026-05-03 by Woodland Sprouting Glade)**:
`ls docs/architecture/architectural-decisions/ | sort -n | tail -5`
returned 165, 166, 167, 168, 169 as the last five — next available
is 170 (consumed by ARC A4 of there-is-no-time-hashed-starfish.plan.md
for the smoke-harness-shape ADR), so this orthogonality ADR is **171**.
Re-verify with the same command immediately before authoring in case
a parallel landing has consumed the slot.

Author `docs/architecture/architectural-decisions/171-observability-configuration-orthogonality.md`
covering:

- **Context** — the architectural pressure that made the single-switch
  shape break (cite ADR-162's three-sink topology, ADR-143's coherent
  fan-out, ADR-160's redaction barrier, ADR-116's resolveEnv pipeline)
- **Decision** — orthogonal axes: typed sink list (data) +
  orthogonal fixture-tee boolean
- **Sink-list semantics** — additional external sinks layered onto the
  always-on stdout baseline; per-sink config validated cross-field
- **Fixture-tee semantics** — tee observes post-redaction events; lives
  downstream of ADR-160 barrier, upstream of nothing; vendor-neutral
  capture record shape
- **Locality enforcement** — production with empty external sinks is
  fail-closed; preview is warn-only; encoded in env-resolution
  `superRefine`
- **Consequences** — closes ADR-162 §Open Question on direct vendor
  imports; supersedes the implicit `SENTRY_MODE` contract; provides
  the foundation for warehouse and PostHog adapter additions as data
  changes only
- **Related** — ADR-051 (OTel single-line JSON — emission baseline
  for the always-on stdout sink), ADR-078 (DI for testability —
  composition-root carve-out), ADR-116, ADR-143, ADR-154, ADR-160
  (non-bypassable redaction barrier — fixture tee placement governed
  by but not amending this ADR; see WS8.7 disposition note), ADR-161,
  ADR-162, ADR-163, ADR-164 (config load side-effects — neighbour of
  the env-resolution warnings channel), PDR-019
- Status: Accepted on plan landing

#### WS8.7 — ADR amendments

- **ADR-116** (`resolveEnv` pipeline) — add §Amendment for the
  warnings channel addition; cite ADR-171
- **ADR-143** (coherent fan-out) — add §Amendment for the registry
  shape and fixture-as-tee semantics; cite ADR-171
- **ADR-162** (observability-first) — close §Open Question on
  `wrapMcpServerWithSentry`; clarify "Sink #1" language so stdout is
  unambiguously the baseline (not Sink #1); cite ADR-171
- **ADR-163** (Sentry release identifier) — add §Amendment clarifying
  that release resolution is build-time-only and orthogonal to runtime
  sink selection; cite ADR-171
- **ADR-160** (non-bypassable redaction barrier) — explicit decision
  recorded (per docs-adr-reviewer): the fixture-tee semantics in this
  rename consume *post-redaction* events only, leaving ADR-160's
  barrier semantics unchanged. Decision: NO amendment required because
  the barrier model is unaffected; ADR-171's §Decision and §Consequences
  state the tee placement (downstream of redaction, upstream of
  nothing) and cross-link ADR-160 as the governing constraint. Record
  this no-amendment decision in ADR-171's §Related so future readers do
  not mistake ADR-160 silence for an oversight.

**Acceptance**: `pnpm doc-gen` exit 0; `pnpm markdownlint:root` exit 0;
no live references to `SENTRY_MODE` in docs (excluding archived plans
and historical ADR §History entries).

### WS9 — Quality gates

Run the full chain. One at a time per
[`start-right-thorough.md § Quality Gates`](../../../.agent/skills/start-right-thorough/shared/start-right-thorough.md):

```bash
pnpm clean
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm doc-gen
pnpm format:root
pnpm markdownlint:root
pnpm lint:fix
pnpm subagents:check
pnpm portability:check
pnpm test:root-scripts
pnpm test
pnpm test:widget
pnpm test:e2e
pnpm test:ui
pnpm test:a11y
pnpm test:widget:ui
pnpm test:widget:a11y
pnpm smoke:dev:stub
pnpm smoke:dev:no-observability
pnpm practice:fitness:informational
pnpm practice:vocabulary
```

All exit 0. The PR-check `check` script in the root `package.json`
must include `smoke:dev:no-observability` as a parallel lane to
`smoke:dev:stub` (per onboarding-reviewer P1 finding — without that
update the regression-guard does not run in PR-check despite this
plan's claim it does).

**Acceptance**: full quality-gate chain exit 0.

### WS9.5 — Pre-merge divergence analysis (cross-reference only — canonical execution slot is ARC C1 of the parent plan)

**Outcome (cross-reference)**: branch state vs `origin/main` is
mapped, conflicts are resolved in working tree, post-resolution
type-check is exit 0; release-readiness reviewer GO before merge.

**Canonical execution slot (per assumptions-reviewer finding —
sequencing ambiguity resolved 2026-05-03)**: pre-merge divergence
analysis executes under
[`there-is-no-time-hashed-starfish.plan.md`](./there-is-no-time-hashed-starfish.plan.md)
**§ARC C1**, after this plan's WS11 close (i.e. after ARC B10
graduations). This section exists for cross-reference only; do NOT
execute pre-merge analysis at the close of WS9 of this plan — WS10
adversarial review must absorb its findings first, and the parent
plan's ARC C is the correct sequencing surface for push/preview/merge
work.

**Correction note (architecture-reviewer-betty Q5)**: the original
plan body did not name a pre-merge divergence step despite a 30-commit
divergence on `feat/eef_exploration`. Per
[`pre-merge-divergence-analysis.md`](../../../.agent/rules/pre-merge-divergence-analysis.md),
divergence at this scale must be analysed before merge to catch
silent post-merge type breaks Git cannot detect. The execution lives
in the parent plan's ARC C1; this WS9.5 entry exists so a reader of
this plan does not assume the step is missing.

**Reference link**: see
[`there-is-no-time-hashed-starfish.plan.md` § ARC C1](./there-is-no-time-hashed-starfish.plan.md#c1-pre-merge-divergence-analysis)
for the executing tasks, acceptance criteria, and reviewer dispatch.

### WS10 — Adversarial review

Invoke specialist reviewers per the matrix below. Per
`principles.md`, *reviewer findings are action items by default*;
implement unless rejected with written rationale.

#### Mandatory-always reviewers for significant documentation or Practice changes

Per owner doctrine 2026-05-02 (*"for all significant documentation or
Practice changes — and this is always true — we need reviews from the
documentation reviewer and the onboarding reviewer"*), the following
reviewers fire automatically on EVERY plan that mutates documentation
or Practice surfaces. They are not optional; they are not gated on
plan size; they fire whether the change is one ADR amendment or a
full restructure.

| Reviewer | Trigger | What they challenge |
|---|---|---|
| `docs-adr-reviewer` | Any documentation or Practice mutation (always) | ADR/README/TSDoc accuracy and completeness; drift between behaviour and docs; ADR-amendment correctness; missing ADRs for significant decisions |
| `onboarding-reviewer` | Any documentation or Practice mutation (always) | Discoverability and first-success speed; both human and AI-agent onboarding paths; freshness (commands, scripts, env vars match reality) |

**Operationalisation**: WS11.4 graduates this doctrine to a permanent
rule (`.agent/rules/invoke-doc-and-onboarding-reviewers-on-significant-changes.md`
or amendment to `invoke-code-reviewers.md`) so future plans inherit
the trigger automatically. Until ratification, plans cite this
mandatory-always block by reference.

#### Plan-specific reviewer matrix

| Reviewer | Phase | What they challenge |
|---|---|---|
| `assumptions-reviewer` | **PRE-EXIT (plan phase)** | Proportionality, build-vs-buy attestation, blocking legitimacy of D1–D12 decisions |
| `architecture-reviewer-fred` | After WS3 GREEN | ADR compliance; layer separation; framework-vs-consumer placement of `SinkRegistry` |
| `architecture-reviewer-betty` | After WS6 GREEN | Long-term change-cost trade-offs; cohesion of the registry interface |
| `architecture-reviewer-wilma` | After WS6 GREEN | Adversarial: failure modes that bypass the registry (dynamic imports, re-exports, side-channel emissions) |
| `type-reviewer` | After each GREEN of WS2/WS3/WS6 | Type-shape correctness; absence of `as`/`!`/`any`/`unknown`; `superRefine` produces typed warnings |
| `test-reviewer` | After WS1 RED, after WS4/5 GREEN | RED-test discipline (each fails for the right reason); integration tests assert behaviour not implementation |
| `config-reviewer` | After WS3 GREEN | Env-var contract surface; rename-replacement error message clarity; `.env.example` docs |
| `mcp-reviewer` | After WS6 GREEN | `ServerInstrumenter` port composes correctly with MCP server lifecycle |
| `security-reviewer` | After WS3 + WS4 GREEN | Trust-boundary review; no new redaction-bypass paths; fixture-as-tee preserves ADR-160 barrier |
| `sentry-reviewer` | After WS6 GREEN | Vendor-port semantic equivalence with `wrapMcpServerWithSentry` |
| `code-reviewer` | Mid-cycle gateway | Routes to missing specialists; fires friction-ratchet if 3+ signals against registry shape accumulate |
| `docs-adr-reviewer` | **MANDATORY-ALWAYS** (see block above) — fires after WS8 close AND on each significant ADR amendment within WS8 | ADR-116/143/162/163 amendments + ADR-171 accurately reflect landed implementation |
| `onboarding-reviewer` | **MANDATORY-ALWAYS** (see block above) — fires after WS8 close | New contributor reading new `.env.example` + root README + both app READMEs understands orthogonal-axes model in <5 min; AI-agent onboarding path (AGENT.md links + ADR-171 discoverability) is fresh |
| `release-readiness-reviewer` | Close (WS9) | GO / GO-WITH-CONDITIONS / NO-GO across full quality-gate chain |

### WS11 — Documentation propagation, archives, spawned plans

#### WS11.1 — Spawn forward-pointing future-plans

**Existing**: [`future/cross-system-correlated-tracing.plan.md`](../future/cross-system-correlated-tracing.plan.md)
already covers MCP server ↔ curriculum SDK ↔ upstream API ↔
Elasticsearch trace correlation, including the Search CLI surface.
WS11 cites it from the Search CLI README forward-pointer note (per
WS8.3); no new plan stub is needed. Avoiding parallel-plan creation
follows `consolidate-at-third-consumer` and `replace-don't-bridge`
discipline.

**`future/config-management-platform-evaluation.plan.md`** (NEW)

WS-E carry-over from the superseded `observability-config-coherence.plan.md`.
Strategic brief: *"Evaluate Doppler / Infisical / 1Password Secrets /
Vercel Edge Config for managed env-var distribution. Trigger: operator
pressure for centralised secret rotation, OR a fourth distinct env-var
contract emerges."*

#### WS11.2 — Archives

- Move `future/observability-config-coherence.plan.md` →
  `archive/superseded/observability-config-coherence.plan.pre-orthogonal-axes-2026-05-02.md`
  with single-line linking note
- Move `current/local-dev-sentry-boundary-regression-investigation.plan.md` →
  `archive/superseded/local-dev-sentry-boundary-regression-investigation.plan.pre-shape-fix-2026-05-02.md`
  with single-line linking note

#### WS11.3 — Doctrine graduation: mandatory-always doc + onboarding review

Per owner direction 2026-05-02 (*"for all significant documentation
or Practice changes — and this is always true — we need reviews from
the documentation reviewer and the onboarding reviewer"*), graduate
the mandatory-always trigger to a permanent rule:

- Author or amend the canonical home — likely
  `.agent/rules/invoke-doc-and-onboarding-reviewers-on-significant-changes.md`
  (NEW) OR an amendment block in
  [`.agent/rules/invoke-code-reviewers.md`](../../../.agent/rules/invoke-code-reviewers.md)
  — that names the trigger ("any plan, change set, or commit that
  mutates documentation or Practice surfaces") and the two reviewers
  as mandatory-always
- Cite the source (this plan's WS10 mandatory-always block) and the
  owner direction date
- Update [`.agent/memory/active/distilled.md § Process`](../../../.agent/memory/active/distilled.md#process)
  with the graduation pointer (parallel to the
  rush-impulse-as-entropy-generator graduation entry from
  2026-05-02)
- Update [`.agent/memory/executive/invoke-code-reviewers.md`](../../../.agent/memory/executive/invoke-code-reviewers.md)
  matrix if the rule lives there

#### WS11.4 — Consolidation

- Run `/jc-consolidate-docs` per the standard close discipline
- Update `.agent/memory/operational/threads/observability-sentry-otel.next-session.md`
  with landing outcome
- Update active-plans index
- Update `.agent/memory/operational/repo-continuity.md` with the
  doctrine-graduation linkage (this plan is a worked instance of
  `principles.md § Architectural Excellence Over Expediency` graduated
  2026-05-02)

## Quality-Gate Checkpoints Between Workstreams

| After WS | Gate |
|---|---|
| WS0 | Plan file exists at canonical path; archives in place; indices updated |
| WS1 | All new tests fail for the right reason; `pnpm type-check` fails only on consumer-wiring gaps (canary signal) |
| WS2 | `pnpm test --filter @oaknational/sentry-node` exit 0; full-repo type-check still red on env layer |
| WS3 | `pnpm test --filter @oaknational/env --filter @oaknational/env-resolution` exit 0; rename-error tests exercised |
| WS4 | `pnpm test --filter @oak-curriculum-mcp-streamable-http` exit 0; smoke regression-guard `pnpm smoke:dev:no-observability` exit 0 (replaces the WS1-authored e2e test, reclassified to smoke under ARC A3 of there-is-no-time-hashed-starfish.plan.md) |
| WS5 | `pnpm test --filter @oak-search-cli` exit 0; full-repo type-check exit 0 |
| WS6 | ESLint `no-vendor-observability-import` rule authored, registered, applied; allowlist exactly one entry; `pnpm lint` exit 0; `grep -rn "from '@sentry/" apps/` returns zero matches outside the allowlisted adapter |
| WS7 | No live `SENTRY_MODE` references in active plan bodies; conformance plan body cites the rule as LANDED |
| WS8 | `pnpm doc-gen` exit 0; `pnpm markdownlint:root` exit 0; ADR-171 published |
| WS9 | Full quality-gate chain exit 0 |
| WS9.5 | Cross-reference only — pre-merge divergence analysis executes under there-is-no-time-hashed-starfish §ARC C1, AFTER this plan's WS10/WS11 close. No gate fires here. |
| WS10 | All reviewer findings implemented or rejected with written rationale |
| WS11 | Archives in place; spawned plans exist; consolidation complete |

## Foundation Alignment

**Mandatory directives**:

- [`principles.md § Architectural Excellence Over Expediency`](../../../.agent/directives/principles.md#architectural-excellence-over-expediency) — the generator for this plan
- [`principles.md § Strict and Complete`](../../../.agent/directives/principles.md#strict-and-complete)
- [`principles.md § Owner Direction Beats Plan`](../../../.agent/directives/principles.md#owner-direction-beats-plan)
- [`principles.md § Separate Framework from Consumer`](../../../.agent/directives/principles.md#separate-framework-from-consumer)
- [`principles.md § Context Specificity Gradient`](../../../.agent/directives/principles.md#context-specificity-gradient)
- [`principles.md § Cardinal Rule`](../../../.agent/directives/principles.md#cardinal-rule-of-this-repository)
- [`testing-strategy.md`](../../../.agent/directives/testing-strategy.md)
- [`schema-first-execution.md`](../../../.agent/directives/schema-first-execution.md)

**Always-applied rules**:

- [`replace-dont-bridge`](../../../.agent/rules/replace-dont-bridge.md) — atomic rename; no transitional alias
- [`tdd-for-refactoring`](../../../.agent/rules/tdd-for-refactoring.md) — RED tests for every behaviour-preserving slice
- [`no-type-shortcuts`](../../../.agent/rules/no-type-shortcuts.md) — no `as`, `!`, `any` in new types
- [`unknown-is-type-destruction`](../../../.agent/rules/unknown-is-type-destruction.md) — typed registry; no `unknown` blobs
- [`use-result-pattern`](../../../.agent/rules/use-result-pattern.md) — env resolution Result with warnings channel
- [`documentation-hygiene`](../../../.agent/rules/documentation-hygiene.md) — TSDoc + README + ADR amendments
- [`lint-after-edit`](../../../.agent/rules/lint-after-edit.md)
- [`generator-first-mindset`](../../../.agent/rules/generator-first-mindset.md) — Zod-first; types flow from schema
- [`dont-break-build-without-fix-plan`](../../../.agent/rules/dont-break-build-without-fix-plan.md) — every commit type-checks individually
- [`apply-architectural-principles`](../../../.agent/rules/apply-architectural-principles.md)
- [`never-disable-checks`](../../../.agent/rules/never-disable-checks.md)
- [`no-warning-toleration`](../../../.agent/rules/no-warning-toleration.md)

**ADRs**:

- ADR-051 (OTel single-line JSON — emission baseline)
- ADR-078 (DI for testability — composition-root carve-out)
- ADR-116 (`resolveEnv` pipeline — warnings channel amendment)
- ADR-143 (coherent structured fan-out — registry shape amendment)
- ADR-154 (separate framework from consumer — sink registry placement)
- ADR-160 (non-bypassable redaction barrier — fixture-as-tee semantics)
- ADR-161 (network-free PR-check boundary — regression-guard placement)
- ADR-162 (observability-first — Open Question resolved)
- ADR-163 (Sentry release identifier — build-time scope clarified)
- ADR-164 (config load side-effects)
- ADR-170 (canonical smoke-test harness shape — authored under ARC A4 of `there-is-no-time-hashed-starfish.plan.md`; authoring belongs to parent plan, not present in repo at the time of writing this body; cited here for cross-plan continuity)
- ADR-171 **NEW** (observability configuration orthogonality — canonical; authored by THIS plan under WS8.6)
- PDR-019 (ADR scope by reusability — justifies ADR-171)
- PDR-027 (threads, sessions, agent identity — session-discipline component)

## Critical Files To Modify

### Schema and type layer

- `packages/core/env/src/schemas/sentry.ts` — **DELETE at WS5 close** (NOT WS3; consumers exist until WS4/WS5 migrate)
- `packages/core/env/tests/schemas/sentry.unit.test.ts` — **DELETE at WS5 close** (orphaned by the rename)
- `packages/core/env/src/index.ts` — remove `SentryEnvSchema` re-export at WS5 close
- `packages/core/env/src/schemas/observability.ts` — **NEW** at WS3 (with `OBSERVABILITY_FILE_PATH` explicit in cross-field `superRefine`)
- `packages/core/observability/src/types.ts` — `ServerInstrumenter` port shape
- `packages/core/observability/src/sink-registry.ts` — **NEW** at WS3 (canonical placement; supports tree-shaking and clean export surface; deviation from originally-planned `types.ts` location ratified)
- `packages/core/observability/README.md` — exports listing at WS8.2
- `packages/libs/env-resolution/src/resolve-env.ts` — `warnings` field
- `packages/libs/env-resolution/src/types.ts` — `EnvWarning` type

### Sentry adapter

- `packages/libs/sentry-node/src/config.ts` — registry consumption
- `packages/libs/sentry-node/src/types.ts` — delete `SentryMode`; rename fixture types
- `packages/libs/sentry-node/src/runtime.ts` — new mode dispatch
- `packages/libs/sentry-node/src/runtime-sinks.ts` — fan-out separation
- `packages/libs/sentry-node/src/fixture.ts` — vendor-neutral rename
- `packages/libs/sentry-node/src/types-fixture.ts` — vendor-neutral capture-record union
- `packages/libs/sentry-node/src/server-instrumenter.ts` — **NEW** (port impl; WS6; the sole entry on the `no-vendor-observability-import` ESLint rule allowlist)

### Architectural enforcement (NEW at WS6 — architecture-reviewer-betty Q4)

- `packages/core/oak-eslint/src/rules/no-vendor-observability-import.ts` — **NEW** (rule fires on direct `@sentry/*` imports outside the allowlist)
- `packages/core/oak-eslint/src/rules/no-vendor-observability-import.unit.test.ts` — **NEW** (RuleTester valid + invalid cases)
- `packages/core/oak-eslint/src/plugin.ts` — register the new rule
- Root ESLint config — wire the rule into the repo-wide config so it fires across `apps/` and `packages/`

### Logger fan-out

- `packages/libs/logger/src/sink-config.ts` — replace `LoggerSinkConfig` with registry-driven shape
- `packages/libs/logger/src/unified-logger.ts` — consume registry

### HTTP MCP server

- `apps/oak-curriculum-mcp-streamable-http/src/index.ts` — port wiring (WS6; vendor-import removal in full)
- `apps/oak-curriculum-mcp-streamable-http/src/server.ts` — port wiring (WS6)
- `apps/oak-curriculum-mcp-streamable-http/scripts/server-harness.ts` — port wiring (WS6)
- `apps/oak-curriculum-mcp-streamable-http/src/env.ts` — schema swap (WS4)
- `apps/oak-curriculum-mcp-streamable-http/src/runtime-config.ts` — registry expose (WS4)
- `apps/oak-curriculum-mcp-streamable-http/src/observability/http-observability.ts` — registry consumption; remove `additionalSinks` parallel mechanism (WS4)
- `apps/oak-curriculum-mcp-streamable-http/src/app/core-endpoints.ts` — port consumption (WS6, NOT WS4 — `replace-don't-bridge`)
- `apps/oak-curriculum-mcp-streamable-http/operations/development/http-dev-contract.ts` — delete `observe-noauth` carve-out (WS4)
- `apps/oak-curriculum-mcp-streamable-http/build-scripts/sentry-build-environment.ts` — type-signature update at WS4 (drop `SENTRY_MODE` from inherited `SentryConfigEnvironment` shape per D7a verification)
- `apps/oak-curriculum-mcp-streamable-http/smoke-tests/modes/local-stub-env.ts` — delete single `SENTRY_MODE='off'` token at line 31 (WS4)
- `apps/oak-curriculum-mcp-streamable-http/e2e-tests/dev-server-boots-without-observability-config.e2e.test.ts` — **DELETED under ARC A3 of there-is-no-time-hashed-starfish.plan.md** (reclassified from e2e to smoke; new home is `smoke-tests/local-no-observability/dev-server-operational.smoke.test.ts`)
- `apps/oak-curriculum-mcp-streamable-http/.env.example` — full rewrite of observability block (WS8.5)
- `apps/oak-curriculum-mcp-streamable-http/README.md` — operator usage update (WS8.3)

### Search CLI

- `apps/oak-search-cli/bin/oaksearch.ts` — composition wiring
- `apps/oak-search-cli/src/observability/cli-observability.ts` — registry consumption
- `apps/oak-search-cli/src/lib/env.ts` — schema swap
- `apps/oak-search-cli/src/lib/logger.ts` — registry consumption
- `apps/oak-search-cli/.env.example` — observability block update
- `apps/oak-search-cli/README.md` — operator usage + cross-app-tracing forward-pointer

### Documentation

- `README.md` (root) — Quick Start observability mention
- `docs/governance/logging-guidance.md`
- `docs/operations/sentry-deployment-runbook.md`
- `docs/operations/environment-variables.md` — propagation entry for the orthogonal-axes env vars (WS8.5)
- `docs/architecture/architectural-decisions/116-...md` — amendment
- `docs/architecture/architectural-decisions/143-...md` — amendment
- `docs/architecture/architectural-decisions/162-observability-first.md` — Open Question close + amendment
- `docs/architecture/architectural-decisions/163-...md` — amendment
- `docs/architecture/architectural-decisions/171-observability-configuration-orthogonality.md` — **NEW** (number verified 2026-05-03; re-verify pre-authoring)
- All workspace READMEs cited above

### Plan estate

- `.agent/plans/observability/current/multi-sink-vendor-independence-conformance.plan.md` — body update; cite `no-vendor-observability-import` as LANDED per WS6
- `.agent/plans/observability/high-level-observability-plan.md` — substrate inventory update
- `.agent/plans/observability/future/config-management-platform-evaluation.plan.md` — **NEW** stub
- (No new `cross-app-distributed-tracing-mcp-and-search-cli.plan.md` — existing `future/cross-system-correlated-tracing.plan.md` already covers the surface; cited as forward-pointer in Search CLI README per WS8.3)

## Documentation Propagation Matrix (per owner reminder 2026-05-02)

| Surface | Update | Owner Workstream |
|---|---|---|
| Root `README.md` | Quick Start observability mention; pointer into ADR-171 | WS8.3 |
| `apps/oak-curriculum-mcp-streamable-http/README.md` | Operator usage; local-dev defaults; production env-var requirements; migration note | WS8.3 |
| `apps/oak-search-cli/README.md` | Operator usage; **cross-app distributed tracing forward-pointer note** | WS8.3 |
| Workspace READMEs (`@oaknational/observability` with **Exports** listing, `sentry-node`, `logger`, `env`, `env-resolution`) | API surface, registry consumption, warnings channel | WS8.2 |
| `docs/governance/logging-guidance.md` | Replace SENTRY_MODE three-mode guidance with orthogonal-axes shape | WS8.4 |
| `docs/operations/sentry-deployment-runbook.md` | Update env tables and disable-Sentry instructions | WS8.4 |
| `docs/operations/environment-variables.md` | Add propagation entry for `OBSERVABILITY_SINKS` / `OBSERVABILITY_FIXTURES` / `OBSERVABILITY_FILE_PATH` | WS8.5 |
| `docs/architecture/README.md` | Refresh observability section reference | WS8.4 |
| TSDoc (every new/renamed type) | Inline doc; `pnpm doc-gen` exit 0 | WS8.1 |
| `.env.example` (HTTP MCP + Search CLI + root if relevant) | Full rewrite of observability block | WS8.5 |
| ADR-171 (new — number verified 2026-05-03) | Canonical decision record for orthogonal-axes shape | WS8.6 |
| ADR-116 amendment | Warnings channel | WS8.7 |
| ADR-143 amendment | Registry shape, fixture-as-tee | WS8.7 |
| ADR-162 amendment | Open Question close; baseline-vs-numbered-sink language | WS8.7 |
| ADR-163 amendment | Build-time scope clarification | WS8.7 |
| `future/config-management-platform-evaluation.plan.md` | New strategic brief | WS11.1 |

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Atomic rename breaks the build halfway through, leaving the repo unreleasable for the duration of the multi-session plan | High | High | Smoke regression-guard `pnpm smoke:dev:no-observability` (replacing the WS1 e2e test under ARC A3 reclassification) pins the contract; until WS4 lands, the test stays RED. Use `worktrees` skill to isolate; do not merge to main until WS9 quality-gate exit 0. Per `dont-break-build-without-fix-plan`, every commit on the branch must individually pass `pnpm type-check`. |
| Fixture-as-tee semantics regress the redaction barrier (ADR-160 violation) | Medium | High (security-equivalent) | `security-reviewer` adversarial pass after WS3 GREEN. `runtime-redaction-barrier.unit.test.ts` extended in WS1 to assert tee'd fixtures observe post-redaction events only. |
| Build-time path (`sentry-build-plugin.ts`) was *not* orthogonal — D7a assumption falsified at WS1 | Mitigated | Medium | D7a verification ran during WS1 (`a3a0222a`); the build-time path consults Vercel signals + auth token only and is orthogonal to runtime sink selection. WS4 drops the inherited `SENTRY_MODE` field from `SentryConfigEnvironment` as cosmetic clean-up, not as a scope expansion. ADR-163 amendment in WS8.7 ratifies the orthogonality. |
| `ServerInstrumenter` port for `wrapMcpServerWithSentry` semantics drifts from the vendor's behaviour, breaking MCP error capture invisibly | Medium | High (silent observability loss) | `mcp-reviewer` + `sentry-reviewer` adversarial passes after WS6 GREEN. Integration test extended to assert port forwards through to vendor `wrapMcpServerWithSentry` semantics. |
| The cross-field `superRefine` warning-channel shape requires changes to every existing `resolveEnv` callsite, blowing scope | Low | Medium | Type-driven migration: warnings field defaults to `[]` on success; callers ignoring it remain compile-clean. Only callsites that *consume* warnings need updates; in this plan, only the two app composition roots do. |
| `multi-sink-vendor-independence-conformance.plan.md` body update creates implicit pressure to land its execution in this plan | Medium | Low | This plan's responsibility ends at the body edit; the conformance test *implementation* is owned by the conformance plan. Document the boundary explicitly in WS7. |
| File-sink folding (D8) collides with `MCP_LOGGER_*` operator habits | Medium | Low | Rename-replacement error message names the migration path. Operator runbook (WS8.4) documents the change. |
| Spawned `cross-app-distributed-tracing-mcp-and-search-cli.plan.md` is treated as in-scope by reviewers | Low | Low | Document explicitly that the spawned plan is forward-pointing; this plan does NOT implement distributed tracing. |

## Outermost Regression-Guard Test

**Reclassification under ARC A3 of `there-is-no-time-hashed-starfish.plan.md`**:
the regression contract authored under WS1 as
`apps/oak-curriculum-mcp-streamable-http/e2e-tests/dev-server-boots-without-observability-config.e2e.test.ts`
was reclassified from e2e to smoke (per PDR-039 — classify by
behaviour, not filename). The behaviour shape is smoke (it boots a
running server and asserts on operational signals), not e2e. The
regression contract now lives at
`apps/oak-curriculum-mcp-streamable-http/smoke-tests/local-no-observability/dev-server-operational.smoke.test.ts`,
invoked via the canonical smoke harness as
`pnpm smoke:dev:no-observability`.

**Behaviour preserved across the reclassification**:

- The harness composes a hermetic env that excludes ALL `OBSERVABILITY_*`,
  `SENTRY_*`, `VERCEL_*` keys (and injects only the non-observability
  dummies the dev path requires)
- The harness boots the server in-process via `createApp + listen`
  (uniform in-process — see Pelagic's design shift in
  `claude-f730bd-pelagic-task-1-acknowledgement-and-design-shift`)
- Boot success is the load-bearing assertion (the legacy
  `SENTRY_MODE=sentry` failure trips during `loadRuntimeConfig` /
  `createApp` and surfaces as a thrown error → harness reports the
  failure)
- The smoke test then makes a minimal vitest assertion against the
  running server (`GET /healthz` returns 200 with the canonical
  operational body)
- Stays RED through WS1–WS3 (RED arc landed `a3a0222a`)
- Goes GREEN at WS4 commit (the HTTP app rename slice)
- Stays GREEN through WS5–WS11

**Pipeline placement**: per ADR-161, this test is network-free (no
live network) and runs in PR-check via the `smoke:dev:no-observability`
lane (alongside `smoke:dev:stub`). The root `package.json` `check`
script must be updated to invoke `smoke:dev:no-observability` for the
PR-check lane to actually exercise the regression.

**Legacy RED message** (debugging hint for contributors landing in WS1
RED state): the boot-failure that trips during the harness's
in-process boot before WS4 lands is the literal text *"Git SHA is
required for Sentry release resolution but VERCEL_GIT_COMMIT_SHA is
not set"* (emitted from
`packages/libs/sentry-node/src/runtime-error.ts:74`). Contributors
debugging the regression should not chase a "no observability config"
error message — the symptom surface is `missing_git_sha`, the cure
surface is the orthogonal-axes rename.

## Acceptance Summary

1. `OBSERVABILITY_SINKS` and `OBSERVABILITY_FIXTURES` are the only
   env vars governing observability config; `SENTRY_MODE` does not
   exist anywhere in repo (`grep -rn "SENTRY_MODE" .` returns zero
   matches outside `archive/` and historical ADR `§History` entries).
2. From a fresh checkout with no `OBSERVABILITY_*` env vars: `pnpm
   dev` from `apps/oak-curriculum-mcp-streamable-http` boots cleanly
   within 30 seconds, no Sentry release-resolution error,
   stdout-only emission visible.
3. From a fresh checkout with `OBSERVABILITY_SINKS=["sentry"]` and
   missing `SENTRY_DSN`: `pnpm dev` fails at env-resolution with a
   single specific message naming the conditional rule (NOT at
   runtime startup).
4. From a fresh checkout with `OBSERVABILITY_SINKS=[]` and
   `OBSERVABILITY_FIXTURES=true`: tests run with full isolation,
   fixture captures present.
5. From production-shaped env (`VERCEL_ENV=production`,
   `VERCEL_GIT_COMMIT_REF=main`) with `OBSERVABILITY_SINKS=[]`: env
   resolution fails closed with a clear "production must include a
   remote sink" error.
6. `pnpm test --filter @oak-curriculum-mcp-streamable-http` and
   `pnpm test --filter @oak-search-cli` both exit 0.
7. ESLint `no-vendor-observability-import` rule authored at WS6,
   registered in the plugin, and wired into the root config; allowlist
   contains exactly one entry (the sentry-node adapter implementation
   file); `pnpm lint` exits 0.
8. `multi-sink-vendor-independence-conformance.plan.md` body
   references `OBSERVABILITY_SINKS=[]` in place of `SENTRY_MODE=off`.
9. ADR-171 published (number verified 2026-05-03); ADR-116/143/162/163 amendments landed; `no-vendor-observability-import` ESLint rule authored, registered, and applied with allowlist size = 1.
10. Both app READMEs and the root README reflect the new operator
    surface; Search CLI README contains the cross-app-tracing
    forward-pointer note.
11. Two superseded plans archived to `archive/superseded/` with
    single-line linking notes.
12. Two new future-plans spawned (cross-app-tracing forward-pointer;
    config-management-platform carry-over).
13. Full quality-gate chain exit 0.
14. Smoke regression-guard `pnpm smoke:dev:no-observability` exit 0 in PR-check pipeline (replacing the WS1 e2e test under ARC A3 reclassification).

## Plan Exit — What Closes

**Closes** (verifiable on landing):

- ADR-162 §Open Question on `wrapMcpServerWithSentry` direct vendor import
- The four design questions in the superseded `observability-config-coherence.plan.md`
  (D8–D11 above answer them)
- The local-dev `pnpm dev` regression (D7-cured by D1+D2)
- The implicit dual sink-configuration mechanism (file-sink folded into
  registry per D8)

**Worked instance**: This plan IS the worked instance of
`principles.md § Architectural Excellence Over Expediency` (graduated
2026-05-02). The plan body cites the principle in Context; on landing,
add a pointer back from `distilled.md § Process` graduation entry to
this plan as the worked-instance evidence.

## Verification (post-landing)

```bash
# 1. No live SENTRY_MODE references
grep -rn "SENTRY_MODE" . \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  --exclude-dir=archive \
  --exclude-dir=dist
# expected: zero matches

# 2. Fresh-checkout dev boot
cd apps/oak-curriculum-mcp-streamable-http
unset $(env | grep -E '^(OBSERVABILITY_|SENTRY_|VERCEL_)' | cut -d= -f1)
timeout 30 pnpm dev
# expected: server listening; no Sentry errors

# 3. Quality-gate chain
cd /Users/jim/code/oak/oak-open-curriculum-ecosystem
pnpm clean && pnpm sdk-codegen && pnpm build && pnpm type-check && \
  pnpm doc-gen && pnpm format:root && pnpm markdownlint:root && \
  pnpm lint:fix && pnpm subagents:check && pnpm portability:check && \
  pnpm test:root-scripts && pnpm test && pnpm test:widget && \
  pnpm test:e2e && pnpm test:ui && pnpm test:a11y && \
  pnpm test:widget:ui && pnpm test:widget:a11y && pnpm smoke:dev:stub
# expected: all exit 0

# 4. Smoke regression-guard (post ARC A3 reclassification)
pnpm smoke:dev:no-observability
# expected: exit 0
```

## Learning Loop

Per `.agent/commands/plan.md § Executable Plan Requirements`, this
plan ends with a consolidation pass:

- WS11.3 runs `/jc-consolidate-docs`
- Update `distilled.md § Process` graduation entry with worked-instance
  pointer
- If reviewer findings reveal a recurring pattern, capture as a
  `.agent/memory/active/patterns/<name>.md` candidate per ADR-150
- If owner direction during execution names a new doctrine, route to
  `.agent/memory/active/napkin.md` for cross-session graduation per
  the standard pending-graduations register flow
