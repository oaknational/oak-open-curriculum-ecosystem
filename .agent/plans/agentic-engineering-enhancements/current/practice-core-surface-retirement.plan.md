---
name: "Practice Core Surface Retirement"
overview: >
  Retire the empty Practice Core patterns surface and the obsolete Practice
  Context exchange surface, then update live Practice doctrine, navigation,
  workflows, validators, and count-bearing prose to match the sharper model.
todos:
  - id: phase-0-ledger
    content: "Phase 0: Build a live-reference ledger and confirm no transferable content remains in the retired directories."
    status: pending
  - id: phase-1-core-doctrine
    content: "Phase 1: Amend Practice Core doctrine to remove Practice Context and Core patterns as live surfaces."
    status: pending
  - id: phase-2-repo-routing
    content: "Phase 2: Update repo workflows, navigation, validators, and count-bearing prose."
    status: pending
  - id: phase-3-delete-validate
    content: "Phase 3: Delete only the retired directories and run validation."
    status: pending
isProject: false
---

# Practice Core Surface Retirement

**Last Updated**: 2026-04-28
**Status**: NOT STARTED
**Scope**: Retire `.agent/practice-core/patterns/` and
`.agent/practice-context/` only; update live references and validation so the
repo no longer treats them as active Practice surfaces.

## Context

The Practice has outgrown two transitional surfaces:

- `.agent/practice-core/patterns/` has no authored patterns. Core-level
  Practice-governance patterns are now PDR-shaped.
- `.agent/practice-context/` was useful as an exchange carrier, but
  transferable substance now belongs in PDRs, reference, research, or live
  repo-local memory.
- Exact static counts in prose drift quickly. Live docs should name surfaces
  without embedding counts. Validators may still print computed counts at
  runtime.

The target model is:

- Practice governance decisions -> `.agent/practice-core/decision-records/`.
- Repo-proven reusable solution instances -> `.agent/memory/active/patterns/`.
- Fresh exploratory or synthesis material -> `.agent/research/`.
- Owner-vetted evergreen material -> `.agent/reference/`.
- Incoming Practice Core exchange -> `.agent/practice-core/incoming/`.
- No Practice Context directory and no Core patterns directory.

## Non-Goals

- Do not delete any directory except `.agent/practice-core/patterns/` and
  `.agent/practice-context/`.
- Do not delete `.agent/memory/active/patterns/`,
  `.agent/practice-core/decision-records/`, `.agent/practice-core/incoming/`,
  `.agent/reference/`, or `.agent/research/`.
- Do not rewrite archived plans, archived napkins, historical changelog
  entries, completed execution records, or closed claim history merely because
  they mention the retired surfaces.
- Do not introduce compatibility placeholders, tombstone files, empty
  replacement directories, or a new Core-pattern destination.
- Do not execute the retirement in the session that creates this plan unless
  the owner explicitly changes scope.

## Foundation Alignment

Before implementation and at each phase boundary, re-read:

1. `.agent/directives/principles.md`
2. `.agent/directives/testing-strategy.md`
3. `.agent/directives/schema-first-execution.md`
4. `.agent/directives/orientation.md`

Apply the first question throughout: could it be simpler without compromising
quality?

## Lifecycle Commitment

This is a Practice Core and repo-navigation change, so the implementation
session must:

1. Run `start-right-quick` or `start-right-thorough`.
2. Consult active claims, recent shared-communication-log entries, and any
   open decision threads touching Practice Core, rules, commands, skills,
   validators, or agentic-engineering plans.
3. Register active areas before edits.
4. Use the commit skill before staging or committing.
5. Run session handoff and the consolidation trigger check after completion.

## Phase 0: Live-Reference Ledger

**Intent**: Prove that no transferable content remains in the retired
directories and classify all live references before deleting anything.

**Acceptance criteria**:

1. `.agent/practice-core/patterns/` contains only its README, or any extra file
   is explicitly routed before proceeding.
2. `.agent/practice-context/` contains only README files and `.gitkeep`, or any
   extra file is explicitly routed before proceeding.
3. `.agent/practice-core/incoming/` has no staged material except `.gitkeep`.
4. Every live reference to `practice-core/patterns`, `practice-context`,
   `Practice Context`, and static count phrases is classified as
   `live-update`, `historical-keep`, or `delete-with-directory`.
5. Historical/provenance references are preserved unless they are part of live
   navigation.

**Deterministic validation**:

```bash
find .agent/practice-core/patterns .agent/practice-context -maxdepth 3 -type f -print | sort
find .agent/practice-core/incoming -maxdepth 2 -type f -print | sort
rg -n "practice-core/patterns|practice-context|Practice Context|43 canonical|36 canonical|12 stable|3 experimental|77 abstract|required eight-file|eight files" \
  .agent docs AGENTS.md RULES_INDEX.md package.json scripts agent-tools \
  --glob '!**/node_modules/**' \
  --glob '!**/dist/**'
```

**Task complete when**: the ledger exists in this plan or a linked evidence
file and every hit has a disposition.

## Phase 1: Core Doctrine

**Intent**: Make Practice Core doctrine describe the new current model.

**Required edits**:

- Amend PDR-007 to retire `practice-core/patterns/` and `practice-context/`
  as live surfaces while preserving the historical rationale that created
  them.
- Amend PDR-024 to remove Core-pattern routing and Practice Context outbound
  exchange from the vital integration surface set.
- Amend PDR-014 so reusable pattern capture routes to
  `.agent/memory/active/patterns/`, while mature Practice-governance substance
  routes to PDRs or PDR amendments.
- Update Practice Core navigation and bootstrap material where they list
  required directories, hydration steps, integration flow, or retired routing:
  `README.md`, `index.md`, `practice.md`, `practice-lineage.md`,
  `practice-bootstrap.md`, `practice-verification.md`, and
  `decision-records/README.md`.

**Rules**:

- Do not erase historical context inside PDR rationale sections merely because
  it mentions old surfaces.
- Add a current-state note where old historical terms remain necessary for
  provenance.
- Keep the resulting Core package self-contained and concept-level portable.

**Acceptance criteria**:

1. No live Core document says `patterns/` is a required Core directory.
2. No live Core document says `.agent/practice-context/` is an optional or
   expected companion.
3. PDR-007 and PDR-024 explicitly record the retirement decision.
4. PDR-014's routing table has no durable destination that points at the
   retired surfaces.

## Phase 2: Repo Routing, Navigation, and Validators

**Intent**: Remove live repo routing to retired surfaces and remove brittle
static counts from prose.

**Required edits**:

- Update `.agent/skills/patterns/SKILL.md` so it reads repo-local patterns
  and routes Practice-governance questions to the PDR index. Remove
  Core-pattern lookup.
- Update `.agent/commands/consolidate-docs.md` and
  `.agent/commands/ephemeral-to-permanent-homing.md` so Core patterns and
  Practice Context are no longer possible destinations.
- Update `.agent/practice-index.md`, `.agent/README.md`, and live executive or
  navigation docs that list retired surfaces or static counts.
- Update live ADRs/docs that describe the current Practice package, especially
  ADR-124 and any non-archive navigation docs.
- Update root-script validators and tests that hard-code Practice Context
  paths, especially fitness and vocabulary exclusions.

**Static-count policy**:

- Replace live prose such as "43 canonical rules" or "77 abstract solutions"
  with count-free wording.
- Keep runtime-computed validator output when the count is calculated
  dynamically.
- Preserve historical archives and closed claim records as provenance.

**Reference policy**:

- Update non-archive research/reference docs when they contain live broken
  links to removed directories.
- Do not rewrite archived plans, archived napkins, historical changelog
  entries, or completed execution records.

**Acceptance criteria**:

1. Pattern discovery remains available through `.agent/memory/active/patterns/`.
2. Practice-governance transfer is fully PDR/PDR-amendment-shaped.
3. Live navigation has no static catalogue counts.
4. Validators/tests no longer require Practice Context fixtures or exclusions.

## Phase 3: Delete and Validate

**Intent**: Delete only the retired directories after all live references have
been routed.

**Required deletion**:

```text
.agent/practice-core/patterns/
.agent/practice-context/
```

**Forbidden deletion**:

```text
.agent/memory/active/patterns/
.agent/practice-core/decision-records/
.agent/practice-core/incoming/
.agent/reference/
.agent/research/
```

**Deterministic validation**:

```bash
test ! -e .agent/practice-core/patterns
test ! -e .agent/practice-context

rg -n "practice-core/patterns|practice-context|Practice Context" \
  .agent docs AGENTS.md RULES_INDEX.md package.json scripts agent-tools \
  --glob '!**/archive/**' \
  --glob '!**/CHANGELOG.md' \
  --glob '!**/node_modules/**' \
  --glob '!**/dist/**'

rg -n "43 canonical|36 canonical|12 stable|3 experimental|77 abstract|required eight-file" \
  .agent docs AGENTS.md RULES_INDEX.md \
  --glob '!**/archive/**' \
  --glob '!**/CHANGELOG.md'

pnpm test:root-scripts
pnpm portability:check
pnpm practice:fitness:informational
pnpm practice:vocabulary
pnpm markdownlint:root
pnpm format:root
pnpm check
```

**Expected validation state**:

- The two `test ! -e` commands pass.
- Remaining `rg` hits are absent or explicitly historical/provenance-only.
- Root-script tests pass after removing stale Practice Context exclusions.
- Portability and vocabulary gates pass.
- `pnpm check` passes, or any pre-existing unrelated failure is recorded with
  evidence and not introduced by this plan.

## Reviewer Scheduling

Run reviewers after the implementation changes and before closeout:

- `assumptions-reviewer` confirms the retirement is proportional and no active
  capability is being removed.
- `docs-adr-reviewer` confirms PDR/ADR/current-doc updates are coherent and
  historical context is preserved correctly.
- `code-reviewer` reviews validator/test changes.
- `config-reviewer` runs if portability, lint, or fitness validator config
  changes are non-trivial.

## Final Acceptance

This plan is complete when:

1. `.agent/practice-core/patterns/` and `.agent/practice-context/` are gone.
2. Live Practice doctrine no longer claims those directories exist, travel, or
   should be consulted.
3. Pattern discovery remains intact through `.agent/memory/active/patterns/`.
4. Exact static counts are removed from live prose.
5. No compatibility placeholders, tombstone files, or empty replacement
   directories are introduced.
6. Required reviewers have no blocking findings, or findings are fixed.
7. Validation commands in Phase 3 pass or record only unrelated pre-existing
   failures with evidence.
8. Session handoff captures any learning in the napkin/consolidation flow.

## Assumptions

- "Only the directories should be removed" means no other directory deletion is
  allowed.
- Historical archive material is not rewritten to match current truth.
- The session that creates this plan does not execute the retirement unless the
  owner explicitly expands scope.
- A future PDR may introduce a new portable pattern surface only if real
  evidence justifies it; this plan does not create one.
