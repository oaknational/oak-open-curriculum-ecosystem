---
name: "Validation and TDD Doctrine Restructure (index)"
overview: "Single index for the multi-plan arc that splits testing-strategy.md into validation-strategy.md (umbrella), testing-strategy.md (slimmed), and tdd-as-design.md (foundational), and refreshes the test-reviewer to carry the deepened stance."
todos:
  - id: s1-index-plan
    content: "S1 (this session): land this index plan."
    status: pending
  - id: s2-test-reviewer-refresh
    content: "S2 (this session): refresh test-reviewer — stance, depth, suggestions, recipe/pattern read path wiring."
    status: pending
    depends_on: [s1-index-plan]
  - id: s3-tdd-as-design-directive
    content: "S3 (this session): create .agent/directives/tdd-as-design.md with the foundational reframing as the load-bearing definition."
    status: pending
    depends_on: [s1-index-plan]
  - id: s4-stryker-reframe
    content: "S4 (this session): move Stryker out of testing-strategy §Tooling; frame mutation testing as the constraint that makes coverage meaningful instead of perverse."
    status: pending
    depends_on: [s1-index-plan]
  - id: p1-validation-strategy-umbrella
    content: "P1 (future plan): draft .agent/directives/validation-strategy.md as the umbrella directive."
    status: pending
    depends_on: [s2-test-reviewer-refresh, s3-tdd-as-design-directive]
  - id: p2-tdd-playbook
    content: "P2 (future plan): grow tdd-as-design.md into the full TDD playbook (methodology, atomic landing, parallel scales, refactoring TDD)."
    status: pending
    depends_on: [s3-tdd-as-design-directive]
  - id: p3-testing-strategy-refactor
    content: "P3 (future plan): slim testing-strategy.md to test types and multi-level interaction; redistribute browser proof surfaces by concern; move recipe sections to docs/engineering/testing-{patterns,tdd-recipes}.md."
    status: pending
    depends_on: [p1-validation-strategy-umbrella, p2-tdd-playbook]
  - id: p4-adr-121-refresh
    content: "P4 (future plan): refresh ADR-121 (Quality Gate Surfaces) to reflect the validation-strategy directive."
    status: pending
    depends_on: [p1-validation-strategy-umbrella]
  - id: p5-reference-migration
    content: "P5 (future plan): mechanical sweep — every cross-reference to testing-strategy.md across rules, principles, subagents, ADRs, and skills updated to point at the right new directive."
    status: pending
    depends_on: [p1-validation-strategy-umbrella, p2-tdd-playbook, p3-testing-strategy-refactor]
  - id: p6-test-reviewer-round-2
    content: "P6 (future plan): test-reviewer Round 2 — alignment with the new directive topology after P1–P3 land."
    status: pending
    depends_on: [p3-testing-strategy-refactor]
---

# Validation and TDD Doctrine Restructure (index)

**Last Updated**: 2026-05-04
**Status**: 🟢 IN PROGRESS (S1 landing now; S2–S4 this session; P1–P6 sequenced)
**Scope**: Multi-plan arc that splits the current sprawling `testing-strategy.md` directive into three single-responsibility documents (validation-strategy umbrella, testing-strategy slim, tdd-as-design foundational) and uses the test-reviewer as the carrier of the deepened doctrine.

---

## The Foundational Reframing

**Load-bearing definition for the entire arc:**

> A test does not verify code. A test **describes a system state**, and product code is the path that **guides the system into that state**. Test and product code are two halves of one act of design. Writing them separately, in either order, is a category error.

Three corollaries:

1. TDD's primary output is good interfaces, not green tests. Quality validation is the by-product, not the goal.
2. The atomic landing rule is a TDD invariant, not a process rule. Test and product code are co-defined; landing them in separate commits treats one act as two outputs.
3. A unit test is never enough on its own to show that value is delivered. Scales (unit / integration / E2E / UI / a11y) are complementary and parallel; the higher-scale tests describe value flow that lower-scale tests cannot reach.

This reframe is the seed of `tdd-as-design.md` (S3) and the stance the refreshed test-reviewer (S2) carries.

---

## Context

### Issue 1: testing-strategy.md mixes incompatible concerns

The current directive `testing-strategy.md` (438 lines) conflates:

- Doctrine (what to test, how to think about tests)
- Definitions (test type taxonomy)
- TDD methodology (cycle, atomic landing, parallel scales)
- Recipe-level detail (vitest config gotchas, test data anchoring, test isolation)
- Cross-cutting validation surfaces (browser proof, a11y, visual regression)

Mixed-concern documents fail their own first principle (single responsibility) and make it hard to enforce "right tool for each job" — types are validated by the type system, not by tests, but the current document positions tests as the primary validation mechanism.

**Evidence**: ADR-121 (Quality Gate Surfaces) names quality gates across many tools, yet the directive that operationalises those gates does not exist; testing-strategy.md is asked to do work that is not its job.

**Root cause**: The "testing strategy" framing was correct for an earlier era of the repo when tests were the dominant validation mechanism. The repo has since grown lint, type-check, knip, depcruise, custom validation scripts, and a planned mutation-testing surface. The label has not caught up.

### Issue 2: TDD is the named immediate failure mode

The owner has explicitly named the operational failure: **TDD simply isn't happening**, and when tests do appear, they are written separately from the product code rather than as a symbiotic hand-in-hand design act.

**Evidence**: Multiple recent sessions have produced "RED-arc" placeholders (skipped tests pinning later workstreams), batch-committed failing tests ahead of product code, and post-hoc tests that ratify already-written code without genuine design value. These are recurring patterns, not isolated mistakes.

**Root cause**: The current doctrine treats TDD as a process rule ("write the test first") rather than as a foundational design discipline. Process rules are easy to perform mechanically without internalising the design intent.

### Issue 3: test-reviewer is not yet the carrier of this stance

The test-reviewer enforces structural test quality (no skipped, no global state, no complex mocks, no conditional execution) but does not yet ask the deeper question — *does this test describe an interface, or audit one?* — and does not load the recipe/pattern content that would make its suggestions concrete.

**Evidence**: Recipe and pattern files in `docs/engineering/testing-{patterns,tdd-recipes}.md` are referenced from authority documents but are not part of any reviewer's mandatory read path. There is no observed instance of a reviewer citing them.

**Root cause**: Lazy-load was the design intent, but no forcing function was wired up. The recipes drift from doctrine because no reviewer reads them.

---

## Solution Architecture

### Topology (target)

```text
.agent/directives/
├── validation-strategy.md          ← (P1) NEW umbrella; right-tool-for-each-job; gate inventory
├── testing-strategy.md             ← (P3) SLIMMED to test types, scopes, multi-level interaction
├── tdd-as-design.md                ← (S3 → P2) NEW foundational; grows into TDD playbook
└── (existing) principles.md, schema-first-execution.md, orientation.md, ...

docs/engineering/
├── testing-patterns.md             ← (P3) recipe-level: vitest gotchas, test data anchoring
└── testing-tdd-recipes.md          ← (P3) recipe-level: TDD cycle worked examples

.agent/sub-agents/
└── test-reviewer.md                ← (S2 → P6) carries the deepened stance + loads recipes
```

### Single-responsibility boundaries

- **validation-strategy.md (P1)** — umbrella; lists every validation surface (TypeScript, ESLint, markdownlint, Prettier, knip, depcruise, Stryker, sdk-codegen + Zod, doc-gen / TypeDoc, practice fitness, custom validation scripts) with the single-line answer to "what is the cheap, fast, deterministic mechanism that catches drift in this dimension at the earliest point?". Cites ADR-121 as authority.
- **testing-strategy.md (P3 slimmed)** — test type definitions (pure / integration / system; in-process unit/integration; out-of-process E2E/smoke); multi-level interaction; the `*.unit.test.ts` / `*.integration.test.ts` / `*.e2e.test.ts` naming contract. Cross-references validation-strategy and tdd-as-design.
- **tdd-as-design.md (S3 → P2)** — foundational reframing; methodology (RED → GREEN → REFACTOR in one landing); atomic landing as a TDD invariant; parallel cycles across scales; refactoring TDD. Replaces the current "TDD at All Levels" + "When Behaviour Changes" + "Refactoring TDD" sections of testing-strategy.md.

### Browser proof surfaces — distributed by concern, not collected by mechanism

Per owner direction §2: the browser is a *mechanism*, not a class of validation. The current §Browser Proof Surfaces section in testing-strategy.md collapses three different concerns under one access surface. Target distribution (lands in P3):

- **Whole-system browser testing** → testing-strategy §System (E2E)
- **UI element behaviour** → testing-strategy §Integration or §Unit (UI-level)
- **Accessibility (a11y)** → its own validation surface in validation-strategy (cross-cutting; cites WCAG and the accessibility-reviewer)
- **Visual regression** → its own validation surface in validation-strategy (regression-shape, not behaviour-shape)
- **Theme / mode correctness** → either testing-strategy §System or validation-strategy §Visual depending on whether the assertion is about behaviour (system) or appearance (regression)

### Mutation testing reframing (S4)

Per owner direction §3: coverage as a statistic is a *perverse incentive* without a quality constraint on the tests themselves. Mutation testing (Stryker) is the constraint that makes coverage meaningful — it asks not "was this code executed?" but "did the tests notice when this code changed?". In the new topology Stryker lives in validation-strategy (meta-quality surface that audits the test surface), not in testing-strategy §Tooling.

---

## Session Slate (S1–S4) — execute now

The four most-impactful low-effort deliverables, sequenced.

### S1. Land this index plan (current task)

**Acceptance**:

1. ✅ Plan file present at `.agent/plans/agentic-engineering-enhancements/current/validation-and-tdd-doctrine-restructure.plan.md`.
2. ✅ Frontmatter todos cover S1–S4 and P1–P6 with explicit `depends_on` edges.
3. ✅ Foundational reframing quoted verbatim in §The Foundational Reframing.
4. ✅ Plan referenced from this thread's next-session record.

**Validation**: file exists; `pnpm markdownlint:root` exit 0; `pnpm portability:check` exit 0.

### S2. Refresh test-reviewer — stance, depth, recipe wiring

**Acceptance**:

1. ✅ test-reviewer subagent definition leads with the foundational reframing as its operating stance.
2. ✅ Adds the *describe vs audit* test (does this test describe an interface, or could it be derived mechanically from product code?) as a first-class check.
3. ✅ Adds explicit checks for the immediate failure mode: ratified-not-described tests; split test+code commits; absence of a genuine RED phase.
4. ✅ Mandatory read path on every invocation now includes `docs/engineering/testing-tdd-recipes.md` and `docs/engineering/testing-patterns.md`.
5. ✅ Suggestion mode upgraded — reviewer proposes specific improvements, not only flags violations.
6. ✅ `pnpm subagents:check` exit 0; `pnpm portability:check` exit 0; `pnpm markdownlint:root` exit 0.

**Validation commands**:

```bash
pnpm subagents:check
pnpm portability:check
pnpm markdownlint:root
grep -c "describes a system state" .claude/agents/test-reviewer.md  # Expected: ≥1
grep -c "testing-tdd-recipes\|testing-patterns" .claude/agents/test-reviewer.md  # Expected: ≥2
```

### S3. Create `.agent/directives/tdd-as-design.md`

**Acceptance**:

1. ✅ New directive file present.
2. ✅ Foundational reframing is the opening definition; corollaries follow.
3. ✅ Atomic landing rule explicitly named as a TDD *invariant*, not a process step.
4. ✅ Section "Why scales are complementary" names that a unit test alone is never enough to prove value delivery.
5. ✅ Cross-references from `testing-strategy.md` §Rules and `principles.md` §Code Quality added.
6. ✅ Frontmatter fitness budget set; markdownlint clean.

**Note**: this is the *seed* of the future TDD playbook (P2), not the playbook itself. It establishes the load-bearing definition; methodology depth grows under P2.

### S4. Stryker / mutation testing reframe

**Acceptance**:

1. ✅ `testing-strategy.md` §Tooling no longer lists Stryker as a test runner.
2. ✅ A short note in `testing-strategy.md` (or principles.md) names mutation testing as the constraint that makes coverage meaningful and points forward to validation-strategy.md (P1) as its eventual home.
3. ✅ Existing `mutation-testing-implementation.plan.md` cross-referenced from the note.
4. ✅ Markdownlint clean.

---

## Plan Sequence (P1–P6) — sequenced for later

Each future plan gets its own file when it is promoted from this index to `current/` or `active/`. The index is the single source of truth for sequencing; per-plan detail lives in each plan file when it is drafted.

### P1. Validation strategy umbrella directive

**Scope**: New `.agent/directives/validation-strategy.md`. Lists every validation surface with one-line role. Cites ADR-121. Positions testing-strategy as one leaf. Promotes the Stryker reframe (S4) into a full "meta-quality" section.

**Acceptance signals**:

- Every gate in `pnpm check` and `pnpm make` is named in the directive with its role.
- Cross-references from `principles.md` §Code Quality added.
- Test-reviewer (P6) updated to read the new umbrella as part of its read path.

**Depends on**: S2, S3.

### P2. TDD playbook (grows tdd-as-design.md)

**Scope**: Promotes `tdd-as-design.md` from S3-seed to full playbook. Adds methodology depth: cycle at every level; atomic landing worked examples; parallel cycles when a higher-level test requires lower-level cycles first; refactoring TDD; type-derivation TDD. Names checkable invariants a reviewer can verify.

**Acceptance signals**:

- All "TDD" content removed from `testing-strategy.md` (which becomes purely about test types).
- Reviewer can verify TDD compliance from commit history alone.

**Depends on**: S3.

### P3. testing-strategy.md refactor

**Scope**: Slim to test types, scopes, multi-level interaction, naming contract. Redistribute browser proof surfaces per the topology above. Move recipe-level sections to `docs/engineering/testing-{patterns,tdd-recipes}.md`.

**Acceptance signals**:

- testing-strategy.md fits comfortably under the line budget without "soft warn".
- Recipe files are referenced from test-reviewer's mandatory read path (already wired in S2).
- Browser proof concerns each have a single home; no concern duplicated across documents.

**Depends on**: P1, P2.

### P4. ADR-121 refresh

**Scope**: Update the "Quality Gate Surfaces" ADR to reflect validation-strategy.md being its operational directive. Remove any drift from the new gate inventory.

**Depends on**: P1.

### P5. Reference migration sweep

**Scope**: Mechanical sweep of every cross-reference to `testing-strategy.md` across `.agent/rules/*.md`, `.agent/directives/principles.md`, `.agent/sub-agents/*.md`, ADRs, skills, and commands. Each reference updated to point at the right new directive (validation-strategy / testing-strategy / tdd-as-design).

**Risk**: low (mechanical); high reference count.

**Depends on**: P1, P2, P3.

### P6. test-reviewer Round 2

**Scope**: Align test-reviewer's read path and references with the post-refactor topology. The S2 refresh used today's surfaces; once P1–P3 land, the reviewer needs a second pass to point at the new homes.

**Depends on**: P3.

---

## Foundation Document Commitment

Before each session that picks up an item from this index:

1. **Re-read** `.agent/directives/principles.md` — Core principles
2. **Re-read** `.agent/directives/testing-strategy.md` — Current testing doctrine (until P3 supersedes)
3. **Re-read** `.agent/directives/tdd-as-design.md` once it exists (after S3)
4. **Re-read** `.agent/directives/validation-strategy.md` once it exists (after P1)
5. **Ask**: does this change describe new behaviour, or audit existing behaviour? If audit, it has zero design value.

---

## Lifecycle Trigger Commitment

Per `.agent/plans/templates/components/lifecycle-triggers.md`:

- **Session entry**: re-read this index plan and the next-session record before any non-planning edit.
- **Work-shape declaration**: each S-cycle is a bounded non-trivial change shipped as one commit; each P-plan is multi-session work warranting its own plan file when promoted.
- **Active-claim registration**: register `.agent/directives/`, `.agent/sub-agents/test-reviewer.md`, `.agent/rules/no-conditional-tests.md` (already landed) as touched areas during S-cycle execution.
- **Handoff closure**: this thread's next-session record updated when each S-cycle lands.
- **Consolidation**: run `/jc-consolidate-docs` when each S-cycle and each P-plan completes.

---

## Documentation Propagation Commitment

S-cycle level:

- S2: subagent definition change → no ADR/practice doc impact (operational artefact).
- S3: new directive file → cross-reference from principles.md §Code Quality and testing-strategy.md §Rules.
- S4: minor reframing → no propagation beyond testing-strategy.md.

P-plan level:

- P1: new directive → ADR-121 marked for refresh; cross-references from principles.md, AGENT.md, start-right-quick.md, start-right-thorough.md.
- P2: directive growth → cross-references from principles.md, test-reviewer.
- P3: directive refactor → reference migration sweep (P5) handles propagation.
- P4: ADR refresh → propagation to validation-strategy.md and to any directive citing ADR-121.

---

## Reviewer Scheduling

- **Pre-execution (S1)**: none — this is a doctrinal index, not code.
- **During (S2–S4)**: `code-reviewer` gateway on each commit; `docs-adr-reviewer` on the new directive (S3); `subagent-architect` if the test-reviewer refresh feels structurally novel (S2).
- **Post (each S-cycle)**: `architecture-reviewer-fred` for principles-first compliance; `assumptions-reviewer` if any S-cycle commits an assumption load-bearing for P1–P6.
- **Per-P-plan**: each future plan re-evaluates its reviewer slate when promoted.

Phase-misalignment risk: scheduling all reviewers at close. Mitigated by phase-aligned invocation as listed.

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| S2's refreshed test-reviewer drifts from S3's tdd-as-design.md | Medium | Medium | Land S3 *first* in the same session; S2 cites it. |
| Recipe files (testing-patterns.md, testing-tdd-recipes.md) do not yet exist or are sparse | High | Medium | S2 wires the read path even if files are stubs; P3 populates them. Stub files are acceptable as the forcing function. |
| Reference migration sweep (P5) is mechanically large and easy to get wrong | Medium | Low | Sequence P5 last, after the new topology is stable; rely on `pnpm portability:check` to catch broken references. |
| testing-strategy.md fitness budget tightens further during P3 refactor and pushes other directives over their limits | Low | Low | P3 explicitly moves content to engineering docs; doesn't relocate to other directives. |
| The "describe vs audit" test in test-reviewer is too subjective to enforce reliably | Medium | Medium | S2 ships concrete cues (test names that describe behaviour, substitute-implementation thought experiment, mechanical-derivation test) rather than a vibe check. |
| Owner direction shifts after S2–S4 land but before P1 starts | Low | Low | Index plan is the single source of truth; updates happen here, not in scattered docs. |

---

## Quality Gate Strategy

After each S-cycle commit:

```bash
pnpm portability:check       # Required after subagent / rule / directive changes
pnpm subagents:check         # After subagent definition changes
pnpm markdownlint:root       # All doctrine docs are markdown
pnpm format:root             # Style consistency
pnpm practice:fitness:informational  # Watch fitness budgets
```

After each P-plan landing (later sessions):

```bash
pnpm check                   # Full canonical aggregate
```

---

## Success Criteria

### Session-scope (this session)

- ✅ This index plan landed (S1).
- ✅ Test-reviewer carries the deepened stance and reads recipes/patterns on every invocation (S2).
- ✅ `tdd-as-design.md` directive exists and is referenced from principles.md (S3).
- ✅ Stryker reframe applied; mutation testing positioned as the coverage-meaningfulness constraint (S4).
- ✅ All quality gates green at every commit.

### Arc-scope (after P1–P6)

- ✅ Three single-responsibility directives replace the current sprawling testing-strategy.md.
- ✅ "Right tool for each job" is operationalised via validation-strategy.md, not buried as a principles bullet.
- ✅ TDD doctrine carries the design-discipline framing; the immediate failure mode (test/code separation) has named cures the test-reviewer enforces.
- ✅ Browser proof concerns are distributed by validation type, not collected by access surface.
- ✅ Recipes and patterns are load-bearing because the test-reviewer reads them.
- ✅ ADR-121 reflects the new gate inventory.
- ✅ No stale cross-references to the old testing-strategy.md remain anywhere in the doctrine surface.

---

## Dependencies

**Blocking**: none. S1 lands today; S2–S4 follow within this session.

**Related Plans**:

- `.agent/plans/agentic-engineering-enhancements/current/mutation-testing-implementation.plan.md` — mutation testing implementation; S4 cross-references it. P1 promotes mutation testing to a first-class section in validation-strategy.md.
- `.agent/plans/agentic-engineering-enhancements/current/architectural-enforcement-adoption.plan.md` — overlapping concern around enforcement; review for cross-impact at P1.

**Prerequisites**:

- ✅ `no-skipped-tests.md` rule (already landed)
- ✅ `no-conditional-tests.md` rule (landed earlier this session)
- ✅ `test-immediate-fails.md` rule extended for conditional execution (landed earlier this session)

---

## Notes

### Why this matters (system-level thinking)

**Immediate value**:

- The named TDD failure mode gets a named cure within one session.
- The test-reviewer becomes the carrier of the doctrine, not just an auditor of structural compliance.
- Recipes that have sat unread become load-bearing on every test-reviewer invocation.

**System-level impact**:

- Doctrine surface aligns with the actual validation landscape (multi-tool, layered, with non-interchangeable parts).
- Future tool additions (e.g., mutation testing rollout) have a clear home.
- Agents and humans onboarding to the practice see "what to use when" without parsing a sprawling document.
- The atomic-landing TDD invariant has a named home, removing the ambient temptation to commit failing tests separately from product code.

**Risk of not doing**:

- TDD compliance continues to drift; the named failure mode keeps recurring.
- Recipes drift further from doctrine because no reviewer reads them.
- "Right tool for each job" stays implicit; agents reach for tests where types or lint would be cheaper, faster, and more deterministic.
- Browser-proof concerns continue to live in a category that mixes mechanism with intent.

### Alignment with principles.md and testing-strategy.md

**From principles.md** (current):

> "Tests prove runtime behaviour. TypeScript proves types; ESLint and static analysis prove structural rules."

**From testing-strategy.md** (current §Rules, post-conditional-test landing earlier this session):

> "Conditional tests of any kind are a symptom of architectural failure: remove the conditional, fix the ambiguity in product code, and write deterministic behaviour-proving tests that do not constrain implementation."

**This plan**:

- ✅ Operationalises "right tool for each job" as a directive (validation-strategy), not a buried bullet.
- ✅ Names tests as *descriptions of system state* — the ambition that "do not constrain implementation" already gestures at.
- ✅ Treats the test-reviewer as the local enforcer of the doctrine, with a forcing function (mandatory recipe reads) that survives session pressure.
- ✅ Sequences architectural changes so each commit ends green at every level.

---

## Consolidation

After each S-cycle and after each P-plan lands, run `/jc-consolidate-docs` to graduate settled content, extract reusable patterns, rotate the napkin, manage fitness, and update the practice exchange.

---

## Future Enhancements (Out of Scope)

- Custom ESLint rule that flags test-file edits without paired product-code edits in the same commit (TDD invariant enforcer at lint level — future P-plan candidate).
- Coverage report integration that surfaces both line coverage and mutation kill rate side-by-side (validation-strategy §Meta-Quality candidate after P1 lands and Stryker is operational).
- Browser-proof reorganisation extended to UI-shipping workspaces' documentation (separate plan once P3 settles the directive topology).
