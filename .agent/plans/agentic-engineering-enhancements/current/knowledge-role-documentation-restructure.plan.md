---
name: "Knowledge-Role Documentation Restructure"
overview: >
  Restructure the repo documentation family around the PDR-014
  knowledge artefact roles: doctrine, recipe books, troubleshooting,
  patterns, rules, gates, decision records, and operational state.
todos:
  - id: phase-0-baseline
    content: "Phase 0: Inventory target docs and assign current/target roles."
    status: pending
  - id: phase-1-local-contract
    content: "Phase 1: Capture the repo-local documentation role contract."
    status: pending
  - id: phase-2-testing-family
    content: "Phase 2: Restructure testing doctrine, recipes, and rules."
    status: pending
  - id: phase-3-typescript-family
    content: "Phase 3: Restructure TypeScript doctrine and recipe/gotcha material."
    status: pending
  - id: phase-4-development-family
    content: "Phase 4: Restructure development, workflow, build, and troubleshooting docs."
    status: pending
  - id: phase-5-navigation-validation
    content: "Phase 5: Update navigation, validate links/fitness, and consolidate."
    status: pending
isProject: false
---

# Knowledge-Role Documentation Restructure

**Last Updated**: 2026-04-24  
**Status**: QUEUED  
**Scope**: Repo documentation architecture for development, testing,
TypeScript, troubleshooting, and adjacent recipe surfaces.

---

## Context

PDR-014 now defines the learning-loop content roles:
`doctrine`, `recipe book`, `troubleshooting`, `pattern`, `rule`,
`command rubric`, `scanner or gate`, `decision record`, and
`operational state`.

The current repo docs predate that role model. Several files carry
multiple roles at once:

- `.agent/directives/testing-strategy.md` is authoritative doctrine
  but also holds many worked examples, gotchas, and recipes.
- `docs/engineering/testing-patterns.md` is now the governed testing
  recipe surface, but it is not yet carrying all example-heavy testing
  material.
- `docs/governance/development-practice.md` mixes development doctrine,
  quality gate command lists, workflow fragments, and documentation
  gotchas.
- `docs/governance/typescript-practice.md` mixes TypeScript doctrine,
  key examples, and detailed gotcha routing.
- `docs/governance/typescript-gotchas.md` behaves like a recipe/gotcha
  companion, but its filename and governance location make its role
  ambiguous.
- `docs/operations/troubleshooting.md` is symptom-first in intent, but
  also stores durable build, TypeScript, Vitest, TSDoc, refactoring,
  and agent-workflow recipes.

This plan turns the PDR-014 genotype into the Oak repo phenotype: a
local documentation architecture where each artefact has an explicit
primary role, examples live in recipe books, symptoms live in
troubleshooting, and empirical observations graduate through patterns
before becoming rules, gates, ADRs, or PDRs.

## Goal

Make the development/testing/TypeScript/troubleshooting documentation
family role-clear, navigable, and fitness-healthy without losing
substance.

Success means:

- doctrine files carry authoritative rules and a few canonical
  examples, not extended recipe shelves;
- recipe books carry worked examples, gotchas, migration moves, and
  "when you see X, do Y" guidance;
- troubleshooting remains symptom-first and links to durable recipes
  or runbooks instead of storing all fixes inline;
- patterns remain empirical proof surfaces, not replacement docs;
- local documentation architecture is recorded in an ADR or ADR
  amendment;
- fitness pressure on the targeted family is reduced without
  opportunistic trimming.

## Source Doctrine

- [PDR-014 knowledge-flow discipline](../../../practice-core/decision-records/PDR-014-consolidation-and-knowledge-flow-discipline.md)
  - §Bidirectional flow
  - §Knowledge artefact roles
  - §Graduation-target routing
- [ADR-127 documentation as foundational infrastructure](../../../../docs/architecture/architectural-decisions/127-documentation-as-foundational-infrastructure.md)
- [Principles](../../../directives/principles.md)
- [Testing strategy](../../../directives/testing-strategy.md)
- [Schema-first execution](../../../directives/schema-first-execution.md)

## Non-Goals

- Do not create compatibility stubs for moved docs. Update live links
  to the durable target instead.
- Do not rewrite product architecture or implementation code.
- Do not fix unrelated hard fitness pressure in `AGENT.md` or
  `principles.md` unless a directly related link or role statement
  must change.
- Do not archive or rewrite historical docs solely to align with the
  new role model.
- Do not create new recipe books for every small cluster. Create a
  new recipe surface only when there are enough durable entries to
  justify it; otherwise link from the nearest existing recipe book.

---

## Phase 0: Baseline Role Map

**Intent**: Establish the current and target role of every affected
surface before moving content.

### Task 0.1: Inventory the target family

Inspect and record current roles for:

- `.agent/directives/testing-strategy.md`
- `docs/engineering/testing-patterns.md`
- `docs/governance/development-practice.md`
- `docs/governance/typescript-practice.md`
- `docs/governance/typescript-gotchas.md`
- `docs/operations/troubleshooting.md`
- `docs/engineering/workflow.md`
- `docs/engineering/build-system.md`
- `.agent/rules/test-immediate-fails.md`
- `.agent/rules/no-global-state-in-tests.md`
- `.agent/rules/no-skipped-tests.md`
- `.agent/rules/tdd-for-refactoring.md`
- relevant ADRs: ADR-011, ADR-078, ADR-121, ADR-127, ADR-147,
  ADR-153, ADR-161

**Acceptance criteria**:

1. Each target surface has a current role and target role recorded in
   the execution notes.
2. Every proposed move has one source and one target home.
3. Every "delete" proposal names why the content is obsolete or
   duplicated.

**Validation**:

```bash
pnpm practice:fitness:informational
rg -n "testing-strategy|testing-patterns|typescript-practice|typescript-gotchas|development-practice|troubleshooting" \
  .agent docs CONTRIBUTING.md
```

### Task 0.2: Decide the repo-local ADR route

Default route: amend ADR-127 because the restructuring is a local
documentation-architecture phenotype of PDR-014. If the baseline shows
the decision is wider than ADR-127, create a new ADR instead and link
it from ADR-127.

**Acceptance criteria**:

1. ADR route is chosen before any broad file moves.
2. The chosen ADR route explicitly distinguishes PDR genotype from Oak
   repo phenotype.
3. If no ADR change is made, the no-change rationale is recorded.

---

## Phase 1: Local Documentation Role Contract

**Intent**: Make the role model discoverable from local repo docs, not
only from the Practice Core PDR.

### Task 1.1: Amend or create the phenotype ADR

Capture the Oak-local decision:

- documentation artefacts have primary content roles;
- over-exampled doctrine sheds examples into recipe books;
- troubleshooting is symptom-first and links to durable recipe/runbook
  homes;
- patterns are empirical proof surfaces and may later feed rules,
  gates, ADRs, PDRs, or recipes;
- fitness pressure is resolved by role routing and consolidation, not
  by trimming substance.

**Acceptance criteria**:

1. ADR references PDR-014 as the transferable model.
2. ADR names the local repo documentation family affected by this
   plan.
3. ADR consequences include link-update and fitness-management duties.

### Task 1.2: Update navigation surfaces

Update local documentation indexes only after the ADR role contract is
settled:

- `docs/governance/README.md`
- `docs/engineering/README.md`
- `docs/operations/README.md`
- `CONTRIBUTING.md` if links or reading path change
- `.agent/directives/AGENT.md` only if its links become stale

**Acceptance criteria**:

1. A contributor can find doctrine, recipe books, troubleshooting,
   and pattern surfaces from the appropriate index.
2. Navigation text describes role, not just topic.
3. No index duplicates settled doctrine from the target files.

---

## Phase 2: Testing Family Restructure

**Intent**: Make testing doctrine compact and authoritative while
moving extended examples and gotchas into recipe surfaces.

### Task 2.1: Split testing doctrine from testing recipes

Keep in `.agent/directives/testing-strategy.md`:

- testing philosophy and mandatory rules;
- definitions of unit, integration, E2E, smoke, and browser proof;
- a few canonical examples only where needed to disambiguate a rule;
- links to recipe and rule surfaces.

Move or rewrite into `docs/engineering/testing-patterns.md`, or split
into a second focused testing recipe file if fitness requires:

- extended TDD examples;
- common TDD violations and fixes;
- canonical Vitest configuration recipes;
- test configuration gotchas;
- test data anchoring;
- test isolation examples;
- MCP transport, composition, and browser proof examples.

**Acceptance criteria**:

1. `testing-strategy.md` is no longer hard in fitness.
2. Recipe material has a governed recipe home with fitness
   frontmatter.
3. No testing recipe contradicts `.agent/rules/test-immediate-fails.md`.
4. The testing directive's split strategy names the actual recipe
   target(s).

### Task 2.2: Align testing rules

Reconcile `.agent/rules/no-global-state-in-tests.md` with the stricter
immediate-fail rule:

- tests must not read or write `process.env`;
- in-process tests must not touch ambient `.env` files or cwd;
- subprocess smoke-test env passing remains a distinct allowed shape.

**Acceptance criteria**:

1. `no-global-state-in-tests.md` no longer states only mutation when
   the live rule forbids reads too.
2. `test-immediate-fails.md`, `testing-strategy.md`, and
   `testing-patterns.md` agree on `process.env`.
3. Related rules cite their source ADR/PDR/directive.

---

## Phase 3: TypeScript Family Restructure

**Intent**: Keep TypeScript doctrine in governance and move detailed
gotchas into a recipe/gotcha companion with an explicit engineering
role.

### Task 3.1: Establish the TypeScript recipe surface

Default route: replace `docs/governance/typescript-gotchas.md` with
`docs/engineering/typescript-recipes.md`, containing gotchas as a
section rather than as a governance peer. If execution finds that a
rename creates disproportionate churn, keep the existing file but
change its role, title, links, and frontmatter to make it a recipe
book.

Recipe candidates include:

- runtime value typing;
- lint interactions;
- union key extraction;
- generic constraints;
- ESLint plugin typing and pattern matching;
- collation and ordering;
- import merging;
- ESLint suppressions;
- type assertions in tests;
- test double typing;
- TSDoc syntax and configuration issues if no better TSDoc recipe
  home exists.

**Acceptance criteria**:

1. TypeScript gotcha material has an explicit recipe-book role.
2. `docs/governance/typescript-practice.md` keeps doctrine and links
   to the recipe book.
3. Live references to a deleted or renamed gotchas file are updated.
4. TypeScript practice is at least below hard limit and should target
   the soft threshold if the role split makes that simple.

### Task 3.2: Connect TypeScript recipes to patterns and rules

Cross-link the recipe book to empirical patterns and enforcement rules
where helpful:

- constant type predicate pattern / ADR-153;
- strict validation at boundary;
- unknown is type destruction;
- satisfies for mock completeness;
- interface segregation for test fakes;
- test claim/assertion parity.

**Acceptance criteria**:

1. Recipes do not duplicate full pattern bodies.
2. Patterns remain empirical proof surfaces.
3. Rules remain the enforcement entry points.

---

## Phase 4: Development, Workflow, Build, and Troubleshooting Family

**Intent**: Separate broad development doctrine, lifecycle workflow,
build/gate command truth, and symptom-first troubleshooting.

### Task 4.1: Slim development practice to doctrine and index role

Keep in `docs/governance/development-practice.md`:

- non-negotiable development principles;
- quality posture;
- high-level references to workflow, build system, TypeScript,
  testing, and troubleshooting.

Move or link out:

- detailed command lists to `docs/engineering/build-system.md`;
- lifecycle steps to `docs/engineering/workflow.md`;
- file move and refactoring recipes to an engineering recipe surface
  or the most relevant existing doc;
- documentation syntax gotchas to the relevant recipe book.

**Acceptance criteria**:

1. `development-practice.md` is at or below its soft target unless
   substance-first review justifies a remaining soft state.
2. It does not duplicate the authoritative `pnpm check` or quality
   gate command expansion.
3. It links to the source of truth for workflow and build commands.

### Task 4.2: Make troubleshooting symptom-first

Keep in `docs/operations/troubleshooting.md`:

- symptom;
- quickest safe diagnostic;
- link to durable fix, recipe, runbook, or ADR;
- short local caveat only when it is needed for diagnosis.

Move or link out:

- build-system mechanics to `docs/engineering/build-system.md`;
- Vitest filtering/config gotchas to testing recipes;
- TypeScript/TSDoc gotchas to TypeScript/TSDoc recipes;
- search reindex workflow to the search/ingest operations runbook;
- agent-workflow issues to agentic engineering docs or rules if
  they are not operational runtime symptoms.

**Acceptance criteria**:

1. `troubleshooting.md` remains usable as a quick symptom index.
2. Durable recipes are not stranded only in troubleshooting.
3. The file is at or below its soft target unless retained entries
   are explicitly justified as operational diagnosis.

### Task 4.3: Confirm build and workflow source of truth

Ensure `docs/engineering/workflow.md` and
`docs/engineering/build-system.md` are not competing:

- workflow owns lifecycle sequence;
- build-system owns command and task-graph truth;
- ADR-121 owns quality gate decision rationale;
- CONTRIBUTING points readers to the appropriate surface.

**Acceptance criteria**:

1. No two live docs give conflicting full-gate instructions.
2. Workflow links to build-system for command expansion.
3. Build-system links back to workflow for lifecycle position.

---

## Phase 5: Navigation, Validation, and Consolidation

**Intent**: Close the restructuring with verified links, fitness, and
learning-loop cleanup.

### Task 5.1: Link and path validation

Run path and reference sweeps for moved or deleted files.

**Validation**:

```bash
rg -n "typescript-gotchas|testing-practice|testing-patterns|development-practice|troubleshooting" \
  .agent docs CONTRIBUTING.md README.md
pnpm markdownlint:root
pnpm format:root
```

**Acceptance criteria**:

1. No live link points at a deleted file.
2. Navigation surfaces mention the correct role for each target doc.
3. Archive paths are not rewritten unless they actively participate in
   live navigation.

### Task 5.2: Fitness and vocabulary validation

Run the practice-specific checks.

**Validation**:

```bash
pnpm practice:vocabulary
pnpm practice:fitness:informational
```

**Acceptance criteria**:

1. `testing-strategy.md` is no longer hard.
2. `docs/engineering/testing-patterns.md` and any new recipe books are
   fitness-tracked and healthy or intentionally soft with rationale.
3. `development-practice.md`, `typescript-practice.md`, and
   `troubleshooting.md` are improved against their current soft
   pressure, with remaining pressure routed.
4. Any new hard pressure is remediated before closure.

### Task 5.3: Final quality and learning-loop closure

Run the broadest practical verification before completion.

**Preferred final validation**:

```bash
pnpm check
```

If the owner chooses a docs-only closure because `pnpm check` cost is
disproportionate, record the constraint, evidence already gathered,
and residual risk in the closeout notes per deferral-honesty
discipline.

**Learning loop**:

- Run `/jc-consolidate-docs` after the restructure.
- Graduate any new stable insight from the plan into PDR/ADR, recipe,
  pattern, rule, or troubleshooting homes.
- Archive the completed plan only after permanent documentation has
  absorbed all settled content.

---

## Risk Assessment

| Risk | Mitigation |
|---|---|
| Moving examples loses teaching value | Move substance first; fitness cleanup happens after the target home teaches properly |
| Recipe books become dumping grounds | Require each recipe to name the doctrine, pattern, rule, or symptom it serves |
| Renames break links | Use `rg`, markdownlint, and index sweeps before closure |
| Troubleshooting becomes too thin | Keep short diagnostics inline; link out only after a durable fix home exists |
| Doctrine remains overgrown | Treat every retained example as canonical and necessary; otherwise move it |
| ADR/PDR duplication | PDR-014 remains genotype; ADR-127 or a new ADR owns only the Oak-local phenotype |

## Foundation Alignment

- **First Question**: prefer role clarification and link routing over
  creating new documents when existing homes suffice.
- **Substance before fitness**: do not trim examples to satisfy a
  line count; move them to the right role surface.
- **Strict and complete**: every moved section must have one durable
  home and all live links must resolve.
- **TDD at all levels**: this docs plan uses check-driven RED/GREEN
  discipline. Capture current failing/soft fitness and stale-role
  evidence first, then move content, then prove the target state.
- **Schema-first execution**: no product schema or generated code is
  changed by this plan; if any implementation need appears, route it
  to the owning architecture plan instead of smuggling it into docs.

## Documentation Propagation

Expected documentation changes:

- ADR-127 amendment or new ADR for Oak-local documentation role
  architecture.
- PDR-014 references only if implementation reveals a gap in the
  portable model.
- Governance, engineering, and operations README updates.
- CONTRIBUTING link updates if the contributor reading path changes.
- Fitness frontmatter for any new recipe book.

Expected no-change surfaces unless links become stale:

- `.agent/directives/continuity-practice.md`
- `.agent/memory/operational/repo-continuity.md`
- product package READMEs outside the affected documentation family

## Completion Criteria

This plan is complete when:

1. The local documentation-role phenotype is captured in ADR form.
2. Testing, TypeScript, development, and troubleshooting docs have
   explicit primary roles.
3. Recipe/gotcha material has durable recipe homes.
4. Troubleshooting is symptom-first and links to durable fixes.
5. Navigation surfaces route contributors to the right role surface.
6. Targeted fitness pressure is reduced and no new hard pressure is
   introduced.
7. Markdown, vocabulary, fitness, and final agreed gates have passed.
8. `/jc-consolidate-docs` has been run for learning-loop closure.
