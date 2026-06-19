---
name: "no-throw remediation — cause-survey-first"
overview: "Resolve the ~1000 @oaknational/no-throw-statement warnings at ROOT CAUSE, with the scope of 'resolve' determined by fresh evidence, not by an inherited convert-all assumption. A holistic cause-survey replaces the distrusted per-site analysis; a fix-review catches any hack-proliferation in conversions to date; then the two highest-leverage / most-questionable classes (tests, then generator code + templates) are remediated by root cause; a reassessment gate then decides the remainder's scope and re-examines D6 (convert-every-throw) against the evidence."
status: "READY — survey-first (WS0). Remediation PAUSED by owner 2026-06-19 to progress the strategy-and-plan-estate-holistic-review thread; resume from WS0. SUPERSEDES the convert-all framing of no-throw-statement-result-migration.plan.md (which becomes a dated input the WS0 survey validates)."
created: 2026-06-19
collection: architecture-and-infrastructure
lane: current
supersedes: ./no-throw-statement-result-migration.plan.md
todos:
  - id: ws0-fresh-holistic-survey
    content: "Fresh holistic cause-survey from a clean pnpm lint capture. Classify every warning by code-type (path-derived) AND cause-group AND meta-cause (root patterns generating many throws). Validate-or-correct the old worklist's counts and per-site classifications first-hand; do NOT trust them. Output: cause-grouped landscape + named meta-causes with blast radius + the highest-leverage root fixes."
    status: pending
  - id: ws1-review-fixes-to-date
    content: "Adversarially review every conversion landed so far (1556b9191, 93beffcfe, 304b68f8d, 61bdbc3e4) — real root-cause fix or hack that satisfies the linter while hiding the problem? Per-conversion verdict; remediate any judged a hack."
    status: pending
  - id: ws2-test-quality-triage
    content: "PRIORITY. For each test-throw apply the testing-strategy questions: properly-formed product-behaviour proof, or a useless-test category? What does it prove? Could it be proven at a lower level? Then delete / reshape / push-down / convert-to-Result-assertion. Disposition logged per test. Mostly deletion+reshape, not mechanical de-throw."
    status: pending
    depends_on: [ws0-fresh-holistic-survey]
  - id: ws3-generator-cause-fixing
    content: "Fix generator SOURCE throws AND the codegen TEMPLATES that emit throws into generated output (generator-first: never edit generated files). Thread Result through the generated runtime contract + consumers. BLOCKED until the F-74 live-upstream-fetch hazard is resolved."
    status: pending
    depends_on: [ws0-fresh-holistic-survey]
  - id: ws4-reassess-gate
    content: "STOP + reassess with the owner: given the validated landscape, the fix-review verdicts, and the test+generator remediation, decide the REMAINDER's scope (result-return core, boundary, rethrow, exhaustiveness/invariant guards) and re-examine D6 / ADR-088's actual policy. Decides whether the old migration plan resumes, is re-scoped, or is replaced."
    status: pending
    depends_on: [ws1-review-fixes-to-date, ws2-test-quality-triage, ws3-generator-cause-fixing]
---

# no-throw Remediation — Cause-Survey-First

**Status**: READY — survey-first. **Remediation PAUSED** by owner (2026-06-19) to
progress the `strategy-and-plan-estate-holistic-review` thread; resume from WS0.
**Created**: 2026-06-19 (Siren mends Rudder, fcdfe9).

This plan **supersedes the convert-all framing** of
[`no-throw-statement-result-migration.plan.md`](./no-throw-statement-result-migration.plan.md).
That plan declared "convert every throw" `DECISION-COMPLETE` on the strength of a
20-agent classification the owner now distrusts. This plan reopens the question:
it leads with a fresh cause-survey, reviews whether the conversions to date are
real fixes or hacks, remediates the two highest-leverage / most-questionable
classes (tests, then generators), and only then reassesses the scope of the rest.
The old plan + its 92KB worklist remain as a **dated input the WS0 survey validates
or replaces** — not as truth.

## Problem

A config change activated `@oaknational/no-throw-statement`, surfacing ~1000
warnings. The rule reports **every `ThrowStatement` indiscriminately**, so the
count conflates genuine error-flow-as-throw with defensive guards, exhaustiveness
arms, and test scaffolding. The prior analysis bucketed it (~426 hand-written
source, ~323 tests, ~189 generated, ~55 generator-source, ~7 scripts) and itself
**flagged ~400 of 811 non-generated sites as false-positive candidates** — then D6
(owner ruling) over-rode that with convert-everything. Three independent signals now
say the inherited shape needs re-grounding, not execution:

1. **The owner distrusts the analysis.** A fresh, holistic, cause-first survey is
   the precondition for any further work.
2. **The per-site classifications proved unreliable.** In the 2026-06-19 execution
   session, reading the actual sites overturned the inherited label **three times**
   (env-resolution "WS2 leaf" was 0-src/all-test; graph-core "WS4 template" was a
   construction-contract + a vendor-callback; env "clean WS2" was module-init).
3. **~1/3 of the count is tests** — a test-quality concern, not a Result migration,
   and much of it is likely deletion/reshape, not conversion.

This is **not 1000 independent problems**. It is a handful of cause-classes, two of
which collapse to a single root fix each (generated → ~10 templates; exhaustiveness →
one helper). The remediation must exploit that, not grind site-by-site on distrusted
labels.

## End goal · Mechanism · Means

- **End goal**: every `no-throw-statement` and the one `no-real-io-in-tests` warning
  resolved at root cause, with the *scope of "resolve" determined by evidence*:
  tests that do not prove product behaviour are deleted or reshaped (not converted);
  generated-code throws are fixed at the generator/template root; genuine error-flow
  throws migrate to `Result`; defensive/structural throws are re-examined against
  ADR-088 (not assumed in-scope). The rule promotes to `error` only when the *validated*
  remaining set is zero.
- **Mechanism**: investigation precedes execution. A fresh cause-survey (WS0) gives a
  trustworthy landscape and names the meta-causes (root patterns) whose single fix
  clears many sites. A fix-review (WS1) ensures we are fixing causes, not proliferating
  hacks. Test-quality triage (WS2) and generator-cause fixing (WS3) address the
  highest-leverage / most-questionable classes. A reassessment gate (WS4) then decides
  the remainder against evidence rather than an inherited convert-all assumption.
- **Means**: five workstreams, WS0 first and gating, WS4 a decision gate.

## Workstreams

### WS0 — Fresh holistic cause-survey (distrust the prior analysis) — FIRST, GATING

Re-derive the full landscape from a clean `pnpm lint` capture on the current branch.
The prior worklist is an input to validate, never a source of truth. Classify every
warning along three axes:

- **Code-type (path-derived = reliable):** generated output / hand-written source /
  generator-source / test / script. This is the trustworthy cut and the first output.
- **Cause-group:** result-return, exhaustiveness/invariant guard, boundary-translate,
  rethrow-in-catch, cli-exit, test-setup-guard, test-fake/mock, test-narrowing-guard
  (a throw used only for TypeScript narrowing in a test — not a production throw),
  generated-template-emission.
- **Meta-cause (the owner's explicit focus):** root patterns that generate MANY
  throws — a missing/under-powered shared helper, a single codegen template pattern,
  a test-scaffolding anti-pattern repeated across workspaces, an over-wide upstream
  return type forcing narrowing guards. Name each meta-cause with its **blast radius**
  (how many sites one root fix clears) so remediation is ordered by leverage, not by
  file walk.

**Acceptance (non-code / survey):**

- **Code-type cut: full enumeration** — every warning is assigned a code-type
  (generated / hand-written source / generator-source / test / script). This is
  path-derived and cheap, so it is done in full, not sampled.
- **Cause-group + meta-cause: sampled, not re-ground** — do NOT re-create the
  distrusted 20-agent per-site classification. Classify a representative sample
  per code-type + workspace first-hand against the live lint, and name the
  meta-causes (root patterns) with their blast radius. The goal is a trustworthy
  *shape* and the highest-leverage root fixes, not a 1000-row per-site file.
- An explicit reconciliation note stating where the fresh survey **agrees with /
  corrects** the old worklist counts (the old worklist's three demonstrated
  mis-labels are the falsifier — re-derive, do not trust).
Output is a compact cause-grouped landscape report. Home: **`.agent/reports/agentic-engineering/`**
(per the reports-live-in-.agent/reports standing preference), linked from the thread record.

**Proof:** `non-code` — the survey report names the cause-groups, the meta-causes with
blast radius, and the old-worklist reconciliation; a reviewer can re-run the lint
capture and spot-check the classification.

### WS1 — Review the fixes to date (hacks vs real fixes)

Adversarially re-examine **every** conversion landed so far, asking of each: *is this
a real root-cause fix, or a change that satisfies the linter while hiding the problem?*

- `1556b9191` (Merlin): build-metadata `isLessThanOrEqual`→Result; the
  `assertNeverResult` keystone helper; graph-core `term-reconstruction` (exhaustiveness
  arms + position throws). **Scrutinise:** is `assertNeverResult` a genuine improvement,
  or a ceremonial wrapper that relocates an unreachable throw without adding value?
- `93beffcfe` (Siren): observability `redactText` via a `string` overload on
  `redactTelemetryValue`. **Scrutinise:** is the type-strengthening a real fix (the
  invariant is now compile-time-enforced), or a way to make a throw disappear from the
  linter without confronting it?
- `61bdbc3e4` (Siren): logger `redactStringValue`, same overload. **Scrutinise:** same.
- `304b68f8d` (Siren): graph-core jsonld loader `throw`→`Promise.reject`. **Scrutinise
  hardest:** is the error genuinely typed as `Result` at our boundary (`processor.ts`
  `runProcessor`), or is `Promise.reject` a lint-dodge that keeps the error invisible?

**Acceptance (non-code):** a per-conversion verdict (`sound root-cause fix` /
`hack-to-remediate` with reason); any conversion judged a hack has a remediation cycle
queued. Reviewers (adversarial brief): `code-expert` + `type-expert` + `test-expert`;
treat their verdicts as input-to-verify (read the diffs first-hand).

**Keystone coupling (blocking for one finding):** `assertNeverResult` is the shared
exhaustiveness keystone that WS2's Result-assertion conversions and WS3/WS4's
exhaustiveness sites build on. **If WS1 judges `assertNeverResult` a hack, that finding
blocks WS2/WS3 until remediated** — building more sites on a hacked keystone multiplies
the rework. The other three conversions are workspace-local; a hack verdict there is
remediated in place and does not block WS2/WS3.

**Proof:** `non-code` — the review verdicts, each grounded in the diff + the boundary
that types the error; `unit`/`integration` for any remediation cycle.

### WS2 — Test-quality triage (PRIORITY) — per testing-strategy.md

The owner's first priority. For **each** test-throw, the FIRST question is never "how
do I de-throw it" — it is the testing-strategy triage:

1. **Is it a properly-formed test that proves product behaviour, or a useless test?**
   Useless-tier categories (→ **delete**): tests-the-mock, tests-types, tests-the-test,
   conditional-test, asserts-constants-not-effects, re-proves-something-proven-elsewhere.
2. **What does it prove** about product / agent-tooling code?
3. **Could the same thing be proven at a lower level?** (push a proof down to the unit
   where the behaviour actually lives.)

Then act, per the disposition. The disposition categories are exhaustive and uniform —
every test-throw maps to exactly one:

- **Useless** (a category above; no discriminating power under the screens below) →
  **delete**, logging the rationale and the screen it failed.
- **Pins-internals-not-behaviour** (load-bearing but WRONG SHAPE: asserts call counts,
  invocation order, or private structure) → **reshape** to assert observable behaviour
  through the interface. NOT a deletion — the behaviour proof is real, only the shape is wrong.
- **Provable lower** → **push down** to the right level, then delete the higher-level
  duplicate (keep the lower-level proof).
- **Re-proves-elsewhere** (genuine duplicate already proven at the right level) → delete
  the **higher-level** copy, keep the **lower-level** one (per "each proof happens ONCE" +
  the unit > integration > e2e preference). Never delete the more precise lower-level proof.
- **Genuine behaviour proof of a now-Result-returning fn** → **convert** the `.toThrow()`
  assertion to a whole-`Result` assertion (`expect(result).toEqual(err(...))`), a
  *stronger* proof. **If the conversion requires the product fn to change (throw→Result),
  the product-code change lands in the SAME commit as the test** (atomic-landing — never
  test-then-code or code-then-test).
- **Test-narrowing-guard** (a `throw` used only to enable TypeScript narrowing inside a
  test body — not a production error-flow throw) → **assert the whole value and keep the
  test** (per `no-conditional-tests`); remove the guard. This category is throw-shaped but
  is a test-quality reshape, never a deletion.

**Screens — how to apply question 1:**

- **Falsifiability screen** (PRIMARY for unit-scale proofs): "would this test still fail
  if the function under test were replaced by a stub returning the asserted value?" If no,
  it has no discriminating power → delete. **Integration tests differ:** an integration test
  of composition legitimately passes when an inner unit is stubbed — that is its point, so
  the naive screen would wrongly flag it. For integration tests apply instead: "does this
  assert composed behaviour across wired units that cannot be proven at a lower level?" Keep if yes.
- **Raw-library screen** (deletion guard for external/type-only tests): "does this test pass
  unchanged if our wrapper is replaced by the raw third-party/library call?" If yes, it tests
  the library, not our code → delete. By this screen the semver §11.4 battery STAYS (raw
  `semver.lte` returns `boolean`, not `ok(boolean)`; the test exercises *our* validation gate).
- **Assert-effects screen**: does it assert observable effects through the interface, or the
  value of an internal constant/config collection? Constant-assertions are reshape-or-delete.

**Acceptance (per batch):** every test-throw in the batch has a recorded disposition;
deletions justified by the falsifiability + raw-library screens; surviving tests sit at
the lowest level that proves their behaviour and assert effects not internals; the
touched workspace's `lint`+`type-check`+`test` gate is green. `test-expert` reviews each
batch (atomic-landing: test changes land in one commit; no skipped/conditional tests).

**Proof:** `unit`/`integration` for reshaped/converted tests; `non-code` (disposition
log) for deletions, each with the screen it failed.

### WS3 — Generator cause-fixing (code + templates)

Per `generator-first-mindset` (ADR-029/030/031): **never edit generated files.** Fix
the throws at their two roots:

- **Templates** — the codegen templates that emit `throw` into generated output (~189
  generated warnings traced to ~10 templates in the prior analysis; WS0 validates the
  exact template set). Change the templates to emit `Result` (e.g. `return err({kind,...})`),
  define the runtime error contract once, regenerate, and thread `Result` through the
  generated-runtime **consumers** (streamable-http etc.). e2e proves the runtime behaves.
- **Generator source** — the hand-written codegen logic that itself throws (~55 sites);
  migrate per its cause-group (result-return / boundary / rethrow).

**BLOCKING prerequisite — F-74:** a fresh `pnpm build` in a clean tree **fetches live
upstream OpenAPI schema** and dirties generated SDK files (belongs to the
`fix/align_with_upstream_api_spec` lane). WS3 regenerates codegen, so this
non-determinism MUST be resolved first — pin/snapshot the upstream schema for the
migration, or sequence WS3 after that lane lands — or upstream drift contaminates the
generated output. Named blocking; resolution is the first WS3 step.

**Acceptance:** `pnpm sdk-codegen && pnpm build` regenerate with zero `no-throw`
warnings in generated output; the generated-runtime contract carries `Result`;
streamable-http `*.e2e.test.ts` green. Reviewers: `type-expert` (the generated
discriminated-union / `Result` threading) + `code-expert`.

**Proof:** `e2e` (runtime behaviour) + `integration` (consumer threading) + `unit`
(template-emission string tests where they exist).

### WS4 — Reassessment gate (owner decision)

After WS0–WS3, **stop**. Do not proceed to the remainder (the result-return core,
boundary-translate, rethrow-in-catch, cli-exit, and especially the exhaustiveness /
invariant guards) on the inherited convert-all assumption. Reassess with the owner
using the now-trustworthy evidence:

- Given the validated landscape and the test+generator remediation, **what is the right
  scope for the remainder?**
- **Re-examine D6 / ADR-088's actual policy:** should genuinely-unreachable
  exhaustiveness `never` guards and corrupted-invariant assertions convert to `Result`,
  or is that the defensive code ADR-088's "Keep Exceptions For" was right to keep? This
  is the ~400-vs-1000 scope question, and it is the owner's to decide on evidence.
- **Decide the fate of the old migration plan:** resume (re-scoped), replace, or retire.

**Acceptance (non-code):** a recorded owner decision on remainder scope + ADR-088's
policy; the old plan's status updated to match; the rule-promotion (`warn`→`error`)
acceptance redefined against the validated zero.

## Decisions

- **D-R1 — Investigation precedes execution.** WS0 gates WS2/WS3; WS4 gates the
  remainder. The convert-all migration does not resume until WS4 decides it.
- **D-R2 — The old worklist is a dated input, not truth.** WS0 validates or replaces it.
- **D-R3 — Tests are triaged, not mechanically converted.** The first question is the
  testing-strategy value question, and deletion/reshape/push-down are first-class
  outcomes (likely the majority).
- **D-R4 — Generators are fixed at the root** (templates + generator source), never in
  generated output; gated on F-74.
- **D-R5 — D6 (convert-every-throw) is REOPENED** and decided at WS4 on evidence. Until
  then, the defensive/structural and result-return classes are NOT executed.

## Prerequisites

- **Blocking**: WS0 before WS2/WS3 (the survey is the trustworthy landscape). The F-74
  upstream-fetch hazard before WS3 regenerates codegen. WS0–WS3 before WS4.
- **Beneficial**: WS1 (fix-review) before WS2/WS3 — its minimum shippable shape is the
  four-conversion adversarial verdict; if a conversion is a hack, remediate before
  building more on the same pattern.

## Non-goals

- Not executing the remainder (result-return core, boundary, rethrow, exhaustiveness)
  before the WS4 reassess gate.
- Not promoting the rule `warn`→`error` until the validated-scope zero is reached.
- Not trusting the old worklist's per-site classifications.
- Not editing generated files (templates + generator source only).
- No `eslint-disable`, rule weakening, gate narrowing, or `--no-verify`.

## Risk assessment

| Risk | Mitigation |
| --- | --- |
| The fresh survey repeats the old analysis's unreliability | Path-derived code-type cut is reliable; cause/meta classification is sampled + spot-checked against live lint; WS0 acceptance requires first-hand verification, not agent-trust |
| Test triage over-deletes coverage | Falsifiability + raw-library screens per deletion; test-expert reviews each batch; deletions logged with the screen they failed |
| WS3 regeneration contaminated by upstream drift | F-74 named as a blocking prerequisite; resolve (pin/snapshot) before regenerating |
| The fixes-to-date are hacks we keep building on | WS1 reviews them adversarially BEFORE WS2/WS3 extend the patterns |
| Reassess gate skipped under momentum | WS4 is a hard gate; the remainder is an explicit non-goal until it fires |

## Foundation alignment

- `testing-strategy.md` / `tdd-as-design.md` — WS2's triage rubric (the value question,
  the useless-test categories, prove-at-lower-level) and the atomic-landing invariant.
- ADR-088 (`use-result-pattern`) — the migration target; its "Keep Exceptions For" policy
  is what WS4 re-examines.
- ADR-078 (dependency injection) — test-fake fixes in WS2.
- `generator-first-mindset` (ADR-029/030/031) — WS3 fixes templates + generator source,
  never generated output.
- `schema-first-execution.md` — the generated runtime stays schema-driven; only the
  emitted error-handling shape changes.
- `no-warning-toleration` — zero warnings is the end state, but the *scope* of "resolve"
  is evidence-decided (WS4), not assumed.

## Plan-body first-principles check

- **Shape**: per `plan-body-first-principles-check`, all counts here are the prior
  analysis's figures, explicitly distrusted; WS0 re-derives them from a live lint capture
  at execution start. No count in this plan is load-bearing until WS0 validates it.
- **Landing path**: WS2/WS3 are TDD cycles (test+code one commit, gate green); WS0/WS1/WS4
  are analysis with non-code proof (survey report, review verdicts, owner decision).
- **Vendor-literal**: WS3's codegen/template shapes and the jsonld `documentLoader`
  contract (WS1's hardest review target) are verified against the live packages at
  execution time.

## Proof contract

- **WS0**: `non-code` — cause-grouped survey + meta-causes with blast radius +
  old-worklist reconciliation; spot-checkable against a fresh lint capture.
- **WS1**: `non-code` — per-conversion sound/hack verdict grounded in the diff + the
  typing boundary; `unit`/`integration` for any remediation.
- **WS2**: `unit`/`integration` for reshaped/converted tests; `non-code` disposition log
  (with the failed screen) for deletions.
- **WS3**: `e2e` + `integration` + `unit` (AC2-style: regenerate with zero generated
  throws; consumers thread Result; e2e green).
- **WS4**: `non-code` — recorded owner decision on remainder scope + ADR-088 policy.

## Readiness reviewers

Before execution: `assumptions-expert` (proportionality / blocking legitimacy of the
survey-first + reassess-gate shape) and `test-expert` (the WS2 triage rubric). Per-cycle
during execution: `code-expert` gateway with specialists by surface (`test-expert` for
WS2, `type-expert` for WS3's generated Result threading).

## Learning loop / lifecycle triggers

On WS4 close (or any milestone), run `oak-consolidate-docs`: graduate the cause-survey
method, the test-triage rubric outcomes, and the WS1 hack-vs-fix findings; reconcile the
old migration plan per ADR-117. Reference
[`../../templates/components/lifecycle-triggers.md`](../../templates/components/lifecycle-triggers.md).
Quality gates per
[`../../templates/components/quality-gates.md`](../../templates/components/quality-gates.md).
