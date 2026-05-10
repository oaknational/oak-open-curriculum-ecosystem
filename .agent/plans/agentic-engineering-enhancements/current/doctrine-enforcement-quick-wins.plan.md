---
name: "Doctrine Enforcement Quick Wins"
overview: "Six small structural enforcement additions that catch the highest-frequency doctrine-violation patterns named in the post-/insights reflection round."
todos:
  - id: ws1-eslint-disabled-tests
    content: "WS1: vitest/no-disabled-tests + vitest/no-focused-tests at error severity in shared eslint strict config."
    status: completed
  - id: ws2-eslint-ts-expect-error
    content: "WS2: @typescript-eslint/ban-ts-comment with allow-with-description at error severity."
    status: completed
  - id: ws3-hedging-vocabulary
    content: "WS3: hedging-vocabulary trip-list added to check-blocked-content.ts via policy.json."
    status: completed
  - id: ws4-sha-in-permanent-doc
    content: "WS4: SHA-in-permanent-doc regex added to check-blocked-content.ts via policy.json."
    status: completed
  - id: ws5-fitness-pre-commit
    content: "WS5: practice:fitness:strict-hard and practice:vocabulary promoted to commit-skill gates."
    status: completed
  - id: ws6-git-add-wildcard-block
    content: "WS6: git add -A and git add . added to policy.json blocked_patterns."
    status: completed
---

# Doctrine Enforcement Quick Wins

**Last Updated**: 2026-05-04
**Status**: 🟢 COMPLETE — WS1, WS2, WS3, WS4, WS5, WS6 all landed
**Scope**: Five structural enforcement additions that catch the highest-frequency doctrine-violation patterns at write-time and commit-time, using existing infrastructure (`@oaknational/eslint-plugin-standards`, `.agent/hooks/policy.json`, `scripts/check-blocked-content.ts`, `scripts/check-blocked-patterns.ts`, the commit skill).

---

## Context

The post-`/insights` reflection round (Verdant Sprouting Leaf,
2026-05-04) identified that doctrine in this Practice has been
growing faster than enforcement. PDR-038's 2026-05-04 amendment
formalises the cost model: at maturity, each new piece of
un-enforced doctrine is a net liability. PDR-044 names the shape of
the cure as a two-layer immune system; this plan lands the first
installment of innate immunity at the surfaces where the highest-
frequency violations have been observed.

The pathogens addressed are explicitly named in existing doctrine
and recur across recent sessions:

### Issue 1: Skipped tests reintroduced after binary deletion

`it.skip` / `describe.skip` / `it.todo` / `xit` / `xdescribe` were
deleted under the binary `no-skipped-tests` rule (2026-05-03). The
ESLint surface that would prevent reintroduction has not been
verified at error severity in the shared strict config.

**Evidence**: Six skipped test files were deleted in the 2026-05-03
consolidation. Without ESLint enforcement, equivalent files can be
introduced again on the next plan that follows the multi-commit-TDD
shape PDR-044 names as a pathogen.

**Root Cause**: Stated principle in `principles.md` and
`testing-strategy.md`; missing structural surface.

**Existing Capabilities**: `@vitest/eslint-plugin` exposes
`vitest/no-disabled-tests` and `vitest/no-focused-tests`; the shared
strict config in `@oaknational/eslint-plugin-standards` is the natural
home.

### Issue 2: `@ts-expect-error` without rationale

`@typescript-eslint/ban-ts-comment` with `'ts-expect-error':
'allow-with-description'` is the standard structural surface; the
strict config is the natural home.

**Evidence**: The `principles.md` § no-type-shortcuts rule names this
class; the structural surface has not been verified at error severity.

**Existing Capabilities**: `@typescript-eslint/ban-ts-comment` is the
named rule in the ecosystem.

### Issue 3: Hedging vocabulary in doctrine surfaces

The 2026-05-03 napkin entry "All hedging is the same failure"
identifies the failure mode: every wording that means *I know the
rule applies, but this situation is special* (carve out, exception,
for these arcs, honest framing for X, permitted variant, land it
then iterate, cheap cure, good enough) is the same shape in
different dressing. The principle is stated in `principles.md
§Architectural Excellence Over Expediency`; the structural surface
is a vocabulary trip-list at the write-time hook.

**Evidence**: Recurrence across multiple PDR-authoring sessions; the
named-deferrals PDR/ADR/pattern triple deletion (2026-05-03) was
itself the result of hedging vocabulary landing despite the stated
principle.

**Root Cause**: Stated principle without a write-time scanner.

**Existing Capabilities**: `.agent/hooks/policy.json`
`preToolUseContent.blocked_patterns` and
`scripts/check-blocked-content.ts` already implement the exact
mechanism; the trip-list is the only addition.

### Issue 4: Moving targets in permanent docs (SHAs)

The 2026-05-01 owner-stated rule names commit-SHA-in-permanent-doc
as documentation-drift-by-construction. The structural surface is a
regex match (`/[a-f0-9]{7,40}/` in `.md` files under permanent-doc
paths).

**Evidence**: `feedback_no_moving_targets_in_permanent_docs` memory
captures three-plus instances; existing prior-art violations are
remediation work.

**Root Cause**: Stated principle without a content scanner.

**Existing Capabilities**: Same write-time scanner infrastructure as
Issue 3.

### Issue 5: Fitness and vocabulary gates run informationally only

`pnpm practice:fitness:strict-hard` and `pnpm practice:vocabulary`
(ADR-144) are existing scripts. They run informationally; they do
not gate commits. Fitness violations and vocabulary inconsistencies
land regularly because the gate is post-hoc.

**Evidence**: Recurring fitness-after-the-fact friction across the
2026-04-28 → 2026-05-04 arc; multiple consolidation passes have
flagged accumulated drift.

**Root Cause**: Existing structural surface (the scripts) not wired
to the commit skill as gates.

**Existing Capabilities**: Both scripts exist and run; the commit
skill already validates commit messages; adding the two scripts to
its validation sequence is the work.

### Issue 6: `git add -A` / `git add .` bypass explicit-pathspec discipline

The 2026-04-30 napkin entry "Stage by explicit pathspec, not
wildcard" graduated to distilled. The structural surface is a Bash
hook block; `policy.json` already blocks several destructive git
operations and is the natural home.

**Evidence**: The `75ac6b75` post-mortem (2026-04-30) where a
continuity-deferral commit accidentally bundled 372 lines of
parallel Practice-thread plan work plus an unrelated plugin enable.

**Root Cause**: Wildcard staging is allowed by the Bash hook; the
commit skill prefers explicit pathspecs but does not enforce.

**Existing Capabilities**:
`.agent/hooks/policy.json` `preToolUse.blocked_patterns`.

---

## Quality Gate Strategy

**Critical**: Run all quality gates after each workstream to catch regressions immediately.

**Why Not `--filter`?** Several workstreams touch shared eslint config consumed by all workspaces; full-monorepo verification is the only way to confirm no workspace silently regresses.

### After Each Workstream

```bash
pnpm type-check
pnpm lint
pnpm test
pnpm practice:fitness:informational
pnpm practice:vocabulary
```

### After Phase Complete

```bash
pnpm build
pnpm type-check
pnpm lint
pnpm test
pnpm test:e2e
pnpm practice:fitness:strict-hard
pnpm practice:vocabulary
```

---

## Solution Architecture

### Principle (from `principles.md` and PDR-038 + PDR-044)

> "A principle stated as prose ... MUST be paired with a structural
> enforcement surface ... within the same arc of work"
> — PDR-038
>
> "At maturity, *each new piece of un-enforced doctrine is a net
> liability*"
> — PDR-038 §2026-05-04 amendment
>
> "A practice at maturity defends itself against pathogenic memes
> through a two-layer immune system: an innate layer of
> deterministic, fast, broad detection at write-time and commit-time
> ..."
> — PDR-044

### Key Insight

Every pathogen in this plan has an existing doctrinal anchor and an
existing detection mechanism. None of the work is new infrastructure;
all of it is operationalising stated principles at surfaces that
already exist. The first-question answer is YES — this is materially
simpler than designing a new tool.

### Strategy

Land each enforcement addition as one TDD cycle pair: a failing
test that asserts the structural surface catches the pathogen, then
the configuration / policy change that greens the test. Each
workstream is independent (separate file scopes, separate tools);
they may be dispatched in any order, including in parallel by
different agents per the atomic-independent-cycles discipline.

**Non-Goals** (YAGNI):

- ❌ Authoring a new doctrine-scanner CLI in this plan (deferred to
  the future plan that anchors PDR-044's adaptive-immunity layer).
- ❌ Triggered rule loading (deferred to the same future plan).
- ❌ Practice trio agent activation (deferred; tracked in the same
  future plan; unblocked by PDR-018 §"Beneficial prerequisites must
  not block").
- ❌ Migration of pre-existing prior-art violations (e.g. existing
  SHAs in permanent docs). Remediation does not have to happen in
  the session of discovery — see distilled.md §Moving targets.
- ✅ The five quick-win additions described in this plan.

---

## Build-vs-Buy Attestation

This plan extends existing first-party infrastructure
(`@vitest/eslint-plugin`, `@typescript-eslint/eslint-plugin`,
`@oaknational/eslint-plugin-standards`, `.agent/hooks/policy.json`,
the existing scanner scripts, the commit skill) and does not
introduce new vendor or bespoke tooling. No new dependency is added
beyond what is already declared in the relevant packages.

---

## Reviewer Scheduling (phase-aligned)

- **Pre-execution**: `assumptions-expert` reviews the plan body
  for proportionality and prerequisite classification (per
  PDR-018 §Beneficial prerequisites).
- **During**: `test-expert` after each cycle's test is written;
  `config-expert` for WS1, WS2, WS5, WS6; `code-expert` gateway
  after each cycle.
- **Post**: `docs-adr-expert` confirms PDR-038 / PDR-044
  citation consistency in the plan and any documentation updates.

---

## Foundation Document Commitment

Before beginning work and at the start of each workstream:

1. Re-read `.agent/directives/principles.md`
2. Re-read `.agent/directives/testing-strategy.md`
3. Re-read `.agent/directives/schema-first-execution.md`
4. Verify the prerequisite classification per PDR-018 §Beneficial
   prerequisites: each workstream is independent of the others
   (`beneficial` not `blocking`).

---

## Lifecycle Trigger Commitment

Before the first non-planning edit:

1. Record the work shape: each workstream is a bounded simple plan
   with a single TDD cycle pair.
2. Run start-right and consult active claims, recent collaboration
   log entries, and relevant decision threads.
3. Register the active area before edits and close the claim at
   workstream-handoff.
4. Apply
   [`lifecycle-triggers.md`](../templates/components/lifecycle-triggers.md)
   for any cross-workspace fix.

---

## Documentation Propagation Commitment

Before marking a workstream complete:

1. Update the host's rules index if a new structural surface is
   created.
2. Cross-reference PDR-038 and PDR-044 in any new rule / policy /
   config that lands.
3. Apply `/jc-consolidate-docs` after the final workstream lands.

---

## Resolution Plan

### Phase 1: Innate Immunity Quick Wins

Six independent workstreams. Each is one TDD cycle pair: failing
test that proves the structural surface catches the pathogen, then
the configuration change that greens the test. All workstreams have
`depends_on: []` — they may be dispatched concurrently.

#### WS1: Block disabled and focused tests at the lint surface

**Doctrinal anchor**: `principles.md §Code Quality` (no skipped tests);
`testing-strategy.md`; the binary `no-skipped-tests` rule.

**Failing test (Red)**: Add a fixture file under
`packages/core/oak-eslint/src/test-support/` (or the equivalent
location consumed by the strict config tests) containing
`it.skip(...)`, `describe.skip(...)`, `it.only(...)`,
`describe.only(...)`. Run the strict config against the fixture and
assert that ESLint reports errors for each.

**Product code (Green)**: Verify the strict config in
`@oaknational/eslint-plugin-standards` includes
`vitest/no-disabled-tests: 'error'` and
`vitest/no-focused-tests: 'error'`. Add or escalate severity if
missing. The fixture test now passes.

**Acceptance Criteria**:

1. ✅ The fixture test passes: `vitest/no-disabled-tests` and
   `vitest/no-focused-tests` are at `'error'` severity.
2. ✅ The full lint pass across all workspaces produces no new
   violations (existing skipped tests were already deleted).
3. ✅ A worked-example commit demonstrating the rule firing is
   referenced from the test fixture.

**Deterministic Validation**:

```bash
pnpm lint
# Expected: exit 0 across all workspaces.
pnpm test --filter @oaknational/eslint-plugin-standards
# Expected: exit 0; the fixture test passes.
```

**Task Complete When**: All criteria met AND validation commands pass.

---

#### WS2: Block `@ts-expect-error` without description

**Doctrinal anchor**: `principles.md §No Type Shortcuts`;
`feedback_no_underscore_rename_unused`.

**Failing test (Red)**: Fixture file containing bare
`@ts-expect-error` and `@ts-expect-error: short note`. Assert that
the strict config errors on the bare form and accepts the
description form.

**Product code (Green)**: Verify the strict config includes
`@typescript-eslint/ban-ts-comment` with `'ts-expect-error':
'allow-with-description'` and `minimumDescriptionLength: <reasonable
threshold>`. Add or adjust if missing.

**Acceptance Criteria**:

1. ✅ The fixture test passes.
2. ✅ Full lint pass exits 0; no existing legitimate
   `@ts-expect-error` is broken (those that were authored without
   description in the existing tree are remediated as part of the
   workstream, not deferred).
3. ✅ The minimum-description-length is documented in the strict
   config.

**Deterministic Validation**:

```bash
pnpm lint
# Expected: exit 0.
pnpm test --filter @oaknational/eslint-plugin-standards
# Expected: exit 0; the fixture test passes.
```

---

#### WS3: Hedging vocabulary trip-list at write-time

**Doctrinal anchor**: `principles.md §Architectural Excellence Over
Expediency`; the 2026-05-03 "all hedging is the same failure"
napkin entry; `feedback_no_cheap_cure_option`;
`feedback_question_shape_known_bad_vs_adopt`.

**Failing test (Red)**: A test under
`scripts/check-blocked-content.test.ts` (or the existing test surface
for the script) that simulates a Claude Edit payload introducing
hedging vocabulary into a path matching the doctrine-surface globs
(`.agent/`, `docs/architecture/`, `docs/governance/`,
`**/*.plan.md`). The test asserts the scanner returns a `deny` outcome
with a citation.

**Product code (Green)**: Extend
`.agent/hooks/policy.json` `preToolUseContent.blocked_patterns` (or
add a new path-scoped block) with the trip-list:

- "carve out", "carve-out", "carve around"
- "exception" (path-scoped to avoid technical-exception confusion)
- "for these arcs"
- "honest framing for"
- "permitted variant"
- "land it then iterate"
- "cheap cure", "good enough", "quick fix"

The policy entry must include `citation:
"PDR-044, principles.md §Architectural Excellence Over Expediency"`
in its description so the surfaced detection carries the doctrinal
anchor.

**Acceptance Criteria**:

1. ✅ The fixture test passes; each pattern is detected when
   introduced in a doctrine-surface path.
2. ✅ Each pattern is *not* detected when introduced in a
   non-doctrine path (e.g. a code comment in `src/`); path scoping is
   verified.
3. ✅ The citation is surfaced in the deny-outcome message.
4. ✅ A sweep of existing doctrine surfaces produces zero new
   detections (existing prior-art violations remediated within this
   workstream).

**Deterministic Validation**:

```bash
pnpm test --filter scripts
# Expected: exit 0; trip-list test passes.
echo "carve out the rule" | pnpm exec tsx scripts/check-blocked-content.ts
# Expected: deny outcome with citation.
```

---

#### WS4: SHA-in-permanent-doc regex at write-time

**Doctrinal anchor**: `feedback_no_moving_targets_in_permanent_docs`;
distilled.md §Moving targets do not belong in permanent docs.

**Failing test (Red)**: Fixture introducing
`abc1234` (7-char hex) and a longer 40-char SHA into a permanent-doc
path (`docs/architecture/architectural-decisions/`,
`.agent/practice-core/`, `principles.md`, `testing-strategy.md`).
Assert the scanner returns deny.

**Product code (Green)**: Extend the policy with a regex-scoped
block for SHA-shaped tokens (`/[a-f0-9]{7,40}/`) restricted to
permanent-doc globs. Inline-code blocks and explicit "(historical
reference)" markers are excluded via context.

**Acceptance Criteria**:

1. ✅ Fixture test passes for both 7-char and 40-char hex.
2. ✅ Detection is scoped — code blocks in markdown and explicit
   historical-reference markers are not detected.
3. ✅ Existing prior-art violations are *catalogued* (not
   necessarily remediated this workstream — per
   distilled.md §Moving targets, remediation does not have to happen
   in the session of discovery; the catalogue routes to a follow-on
   plan).

**Deterministic Validation**:

```bash
pnpm test --filter scripts
# Expected: exit 0; SHA regex test passes.
```

---

#### WS5: Promote fitness and vocabulary scripts to commit gates

**Doctrinal anchor**: PDR-038 §2026-05-04 amendment (un-enforced
doctrine at maturity is liability); ADR-144 (vocabulary
consistency); the existing `pnpm practice:fitness:strict-hard` and
`pnpm practice:vocabulary` scripts.

**Failing test (Red)**: A test under the commit skill's test
surface (or `scripts/check-commit-message.test.ts`) that asserts a
draft commit failing fitness or vocabulary fails the commit-skill
validation step.

**Product code (Green)**: Wire `practice:fitness:strict-hard` and
`practice:vocabulary` into the commit skill's pre-commit-message
validation sequence. The commit skill already validates the message;
this adds two pre-message gates.

**Acceptance Criteria**:

1. ✅ Test passes; a fixture commit attempt against a
   fitness-violating tree fails the commit-skill gate.
2. ✅ Same for a vocabulary-violating tree.
3. ✅ Passing trees commit successfully.
4. ✅ Existing fitness or vocabulary violations are catalogued as
   pre-existing and routed to the appropriate consolidation pass
   (not blocked at the gate retroactively).

**Deterministic Validation**:

```bash
pnpm test --filter scripts
# Expected: exit 0; commit-skill gate test passes.
pnpm practice:fitness:strict-hard
# Expected: exit 0 (or catalogue of pre-existing violations).
pnpm practice:vocabulary
# Expected: exit 0 (or catalogue of pre-existing violations).
```

---

#### WS6: Block `git add -A` and `git add .`

**Doctrinal anchor**: distilled.md §Stage by explicit pathspec;
`feedback_no_workspace_to_root_scripts` (sibling staging discipline);
the 2026-04-30 `75ac6b75` post-mortem.

**Failing test (Red)**: A test under the existing
`scripts/check-blocked-patterns.test.ts` (or equivalent) that
simulates a Bash payload running `git add -A`, `git add --all`,
`git add .`. Assert the scanner returns deny with a citation.

**Product code (Green)**: Extend
`.agent/hooks/policy.json` `preToolUse.blocked_patterns` with:

- `"git add -A"`
- `"git add --all"`
- `"git add ."`

Citation: `distilled.md §Stage by explicit pathspec`.

**Acceptance Criteria**:

1. ✅ Test passes; each wildcard pattern is detected.
2. ✅ Explicit pathspec staging (`git add path/to/file`) is *not*
   detected.
3. ✅ Citation is surfaced in the deny-outcome message.

**Deterministic Validation**:

```bash
pnpm test --filter scripts
# Expected: exit 0; wildcard-staging test passes.
```

---

## Phase 1 Complete Validation

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint
pnpm test
pnpm test:e2e
pnpm practice:fitness:strict-hard
pnpm practice:vocabulary
```

**Success Criteria**:

- All commands exit 0.
- All six workstreams green at their TDD cycle close.
- The host's rules index lists each new structural surface with its
  doctrinal anchor.
- PDR-044 is referenced from each new policy / config / rule that
  lands as the umbrella enforcement framing.

---

## Foundation Document Compliance Checklist

Before marking the plan complete:

- [ ] **principles.md — Architectural Excellence**: WS3's trip-list
      operationalises the principle.
- [ ] **principles.md — Code Quality**: WS1 enforces no-skipped-tests
      structurally.
- [ ] **principles.md — No Type Shortcuts**: WS2 enforces
      ban-ts-comment-with-description.
- [ ] **testing-strategy.md — TDD as design**: each workstream is one
      TDD cycle pair.
- [ ] **PDR-038 §2026-05-04 amendment**: each new doctrine reference
      lands with structural enforcement in the same arc.
- [ ] **PDR-044 §Innate immunity**: each addition is fast, broad,
      deterministic, and carries a citation.

---

## Success Criteria

- ✅ Six structural enforcement surfaces landed.
- ✅ Each pathogen named in PDR-044 §Worked Instances has a
      detection surface.
- ✅ The doctrine-without-enforcement liability for the named
      pathogens is closed.
- ✅ The pattern of "stated principle without surface" is reduced
      by the count of these six.

---

## Dependencies

**Blocking**: None. PDR-018 §Beneficial prerequisites is *beneficial*
not blocking — the workstreams may proceed without the PDR landing
first, though the citation discipline is cleaner with it.

**Beneficial (do not gate on these)**:

- PDR-018 amendment landed in this same arc (citations cleaner).
- PDR-044 landed in this same arc (umbrella framing for the
  citation `citation: "PDR-044, ..."`).
- PDR-038 §2026-05-04 amendment landed in this same arc (cost
  rationale clearer).

**Related Plans**:

- The companion `future/` strategic plan
  ([memetic-immune-system-and-progressive-disclosure.plan.md](../future/memetic-immune-system-and-progressive-disclosure.plan.md))
  carries the broader scanner CLI, adaptive-immunity surveillance
  agent, triggered rule loading, and practice-trio activation as a
  roadmap with promotion triggers. None of those are prerequisites
  for this plan; this plan is a prerequisite for some of them.

**Prerequisites**:

- ✅ `@oaknational/eslint-plugin-standards` exists.
- ✅ `.agent/hooks/policy.json` exists.
- ✅ `scripts/check-blocked-content.ts` and
      `scripts/check-blocked-patterns.ts` exist.
- ✅ Commit skill exists.
- ✅ `pnpm practice:fitness:strict-hard` and
      `pnpm practice:vocabulary` scripts exist.

---

## Notes

### Why This Matters (System-Level Thinking)

**Question**: Why these six, and why now?

**Immediate Value**:

- **Skipped-test reintroduction**: structurally impossible after WS1.
- **`@ts-expect-error` without rationale**: structurally impossible
  after WS2.
- **Hedging vocabulary in doctrine**: caught at write-time after WS3.
- **SHA in permanent doc**: caught at write-time after WS4.
- **Fitness and vocabulary drift**: caught at commit-time after WS5.
- **Wildcard staging**: caught at command-time after WS6.

**System-Level Impact**:

- **Doctrine maturity gate**: PDR-038 §2026-05-04 amendment requires
  doctrine to land with enforcement. This plan is the structural
  reciprocation for the doctrine landing in this arc — without it,
  the amendment is itself doctrine-without-enforcement.
- **Memetic immune system seed**: PDR-044's innate-immunity layer
  has its first six fingerprints, each with a doctrinal anchor.
- **Cumulative friction reduction**: every future session benefits;
  the cost of authoring is amortised across all subsequent commits.

**Risk of Not Doing**:

- Continued recurrence of the named pathogens at the rate observed
  in the 2026-04-28 → 2026-05-04 arc.
- Compounded cost as further doctrine lands without matching
  enforcement (PDR-038 §2026-05-04 amendment liability).

### Alignment with `principles.md` and `testing-strategy.md`

This plan exemplifies the first-question answer: each workstream is
the *simpler* shape — extending existing first-party infrastructure
rather than authoring new tooling.

---

## References

- `.agent/practice-core/decision-records/PDR-018-planning-discipline.md`
  (§Beneficial prerequisites must not block)
- `.agent/practice-core/decision-records/PDR-038-stated-principles-require-structural-enforcement.md`
  (§2026-05-04 amendment)
- `.agent/practice-core/decision-records/PDR-044-memetic-immune-system.md`
- `.agent/directives/principles.md`
- `.agent/directives/testing-strategy.md`
- `.agent/directives/schema-first-execution.md`
- `.agent/hooks/policy.json`
- `scripts/check-blocked-content.ts`
- `scripts/check-blocked-patterns.ts`
- `packages/core/oak-eslint/`

---

## Consolidation

After all workstreams complete and quality gates pass, run
`/jc-consolidate-docs` to graduate settled content, extract any new
patterns, rotate the napkin, manage fitness, and update the practice
exchange. Cross-reference each new structural surface in the host's
rules index.

---

## Future Enhancements (Out of Scope)

- A unified doctrine-scanner CLI consolidating the
  `check-blocked-*.ts` scripts into a single tool with structured
  JSON output and citation-based reporting (covered in the future
  plan).
- Adaptive-immunity surveillance agent operating at consolidation
  cadence (covered in the future plan).
- Triggered rule loading to reduce session-open context cost
  (covered in the future plan).
- Practice trio agent activation, additive shape (covered in the
  future plan).
