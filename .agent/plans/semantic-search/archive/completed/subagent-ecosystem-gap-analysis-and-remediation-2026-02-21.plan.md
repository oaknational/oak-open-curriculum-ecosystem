---
name: Sub-agent Ecosystem Gap Analysis and Remediation Plan (2026-02-21)
overview: >
  Full handoff report and remediation plan for the current sub-agent ecosystem,
  with emphasis on (1) what assembled sub-agents exist and (2) what
  instructions are handed to those assembled sub-agents through the
  component/template/wrapper stack.
todos:
  - id: fix-missing-ground-truth-plan-reference
    content: >
      Repair broken reference in ground-truth-designer template by pointing to
      an existing active or archived plan, or by replacing the reference with a
      stable canonical document.
    status: completed
  - id: fix-legacy-architecture-reviewer-reference
    content: >
      Replace legacy generic `architecture-reviewer` mention in
      subagent-architect template with the current named architecture reviewers.
    status: completed
  - id: improve-architecture-wrapper-descriptions
    content: >
      Differentiate architecture reviewer wrapper descriptions so delegation can
      route to Barney/Fred/Betty/Wilma more accurately.
    status: completed
  - id: align-foundation-reading-requirements
    content: >
      Decide and implement consistent foundation-reading requirements across
      templates, especially ground-truth-designer and subagent-architect.
    status: completed
  - id: refine-jc-review-summary-table
    content: >
      Update jc-review output table to represent four architecture reviewers
      explicitly (or document intentional wildcard usage).
    status: completed
  - id: front-load-testing-strategy-for-reviewers
    content: >
      Ensure code-reviewer and test-reviewer templates place
      `.agent/directives/testing-strategy.md` first in mandatory reading and
      require explicit TDD enforcement analysis for code review.
    status: completed
  - id: validate-and-close
    content: >
      Run structural and reference checks for wrappers/templates/components and
      record closure evidence for handoff completion.
    status: completed
isProject: false
---

## Context and Purpose

This document is a handoff-ready report and implementation plan for the
sub-agent prompt ecosystem.

Date of audit: **21 February 2026**

Audit goals:

1. Confirm what assembled sub-agents currently exist.
2. Confirm what instructions each assembled sub-agent receives.
3. Identify drift/gaps between intended architecture and actual prompt handoff.
4. Provide an executable remediation plan for a fresh session.

## Standalone Session Entry Point (Read in Order)

For a fresh session with no prior context, read these documents in this exact
order before editing anything:

1. This plan:
   - `.agent/plans/semantic-search/active/subagent-ecosystem-gap-analysis-and-remediation-2026-02-21.plan.md`
2. Core directives:
   - `.agent/directives/AGENT.md`
   - `.agent/directives/principles.md`
   - `.agent/directives/testing-strategy.md`
   - `.agent/directives/schema-first-execution.md`
3. Sub-agent composition architecture:
   - `.agent/sub-agents/README.md`
4. ADR references for this workstream:
   - `docs/architecture/architectural-decisions/README.md`
   - `docs/architecture/architectural-decisions/114-layered-sub-agent-prompt-composition-architecture.md`
5. Prompt and command entry points used during execution:
   - `.agent/prompts/start-right.prompt.md`
   - `.agent/prompts/start-right-thorough.prompt.md`
   - `.cursor/commands/jc-start-right-thorough.md`
   - `.cursor/commands/jc-review.md`
   - `.cursor/rules/invoke-code-reviewers.mdc`

## Relevant Working Set (Primary Files)

These are the files most likely to be edited in this plan:

1. Templates and components:
   - `.agent/sub-agents/templates/ground-truth-designer.md`
   - `.agent/sub-agents/templates/subagent-architect.md`
   - `.agent/sub-agents/templates/architecture-reviewer.md`
   - `.agent/sub-agents/templates/code-reviewer.md`
   - `.agent/sub-agents/templates/test-reviewer.md`
   - `.agent/sub-agents/components/architecture/reviewer-team.md`
2. Assembled wrappers:
   - `.cursor/agents/architecture-reviewer-barney.md`
   - `.cursor/agents/architecture-reviewer-fred.md`
   - `.cursor/agents/architecture-reviewer-betty.md`
   - `.cursor/agents/architecture-reviewer-wilma.md`
3. Coordination surfaces:
   - `.cursor/commands/jc-review.md`
   - `.agent/directives/AGENT.md`
   - `.agent/prompts/start-right.prompt.md`
   - `.agent/prompts/start-right-thorough.prompt.md`

## First 15 Minutes Runbook (Fresh Session)

1. Re-ground:
   - Read the documents in the order listed in `Standalone Session Entry Point`.
2. Validate current state quickly:
   - `rg --files .cursor/agents .agent/sub-agents/templates .agent/sub-agents/components | sort`
   - `rg -n "architecture-reviewer\\b" .cursor/commands .cursor/rules .agent/sub-agents/templates .agent/prompts .agent/directives --glob '!**/archive/**' | rg -v "architecture-reviewer-(barney|fred|betty|wilma)"`
3. Confirm the top blocking gap still exists:
   - Open `.agent/sub-agents/templates/ground-truth-designer.md` and verify the
     reference currently points to a non-existent active plan path.
4. Execute Phase 1 from this plan before any optional refactors.

## Locked Decisions for This Plan

1. Keep the composition tree simple:
   - components are leaf nodes,
   - templates compose components,
   - assembled sub-agent files consume templates (preferred).
2. Preserve existing information and intent while improving structure and
   consistency (DRY and YAGNI, no speculative expansion).
3. Keep changes focused on active prompt/agent/command surfaces unless archival
   cleanup is explicitly requested.

## Scope

In scope:

- `.cursor/agents/*.md` (assembled sub-agent wrappers)
- `.agent/sub-agents/templates/*.md` (canonical assembled workflows)
- `.agent/sub-agents/components/**/*.md` (leaf components)
- Coordination references used by active guidance:
  - `.agent/directives/AGENT.md`
  - `.agent/prompts/start-right.prompt.md`
  - `.agent/prompts/start-right-thorough.prompt.md`
  - `.cursor/commands/jc-review.md`
  - `.cursor/rules/invoke-code-reviewers.mdc`

Out of scope:

- Runtime product code and public API changes.
- Semantic-search feature implementation.
- Archival/historical documents except where they cause active reference drift.

## Current Assembled Sub-agent Inventory

As assembled in `.cursor/agents/`:

1. `architecture-reviewer-barney` (`gpt-5.3-codex-xhigh`, readonly)
2. `architecture-reviewer-fred` (`claude-4.6-opus-max-thinking`, readonly)
3. `architecture-reviewer-betty` (`gemini-3.1-pro`, readonly)
4. `architecture-reviewer-wilma` (`composer-1.5`, readonly)
5. `code-reviewer` (`auto`, readonly)
6. `config-reviewer` (`auto`, readonly)
7. `test-reviewer` (`auto`, readonly)
8. `type-reviewer` (`auto`, readonly)
9. `ground-truth-designer` (`claude-4.5-opus-high-thinking`, readonly)
10. `subagent-architect` (`auto`, write-enabled)

All wrappers are thin and instruct first-action template loading.

## Current Instruction Handoff Architecture

Canonical structure documented in:

- `.agent/sub-agents/README.md`

Expected tree:

1. `components/` are leaf nodes and do not depend on each other.
2. `templates/` compose components.
3. `.cursor/agents/*.md` wrappers consume templates.

Observed active components:

- `.agent/sub-agents/components/principles/dry-yagni.md`
- `.agent/sub-agents/components/architecture/reviewer-team.md`

Observed template usage:

- Architecture reviewers -> `.agent/sub-agents/templates/architecture-reviewer.md`
- Code reviewer -> `.agent/sub-agents/templates/code-reviewer.md`
- Config reviewer -> `.agent/sub-agents/templates/config-reviewer.md`
- Test reviewer -> `.agent/sub-agents/templates/test-reviewer.md`
- Type reviewer -> `.agent/sub-agents/templates/type-reviewer.md`
- Ground truth designer -> `.agent/sub-agents/templates/ground-truth-designer.md`
- Subagent architect -> `.agent/sub-agents/templates/subagent-architect.md`

## Findings (Severity Ordered)

### High

1. Broken plan reference in active template

- Evidence: `.agent/sub-agents/templates/ground-truth-designer.md:164`
- Current reference: `.agent/plans/semantic-search/active/ground-truth-redesign-plan.md`
- Reality: file does not exist in active directory.
- Impact: handoff path is broken; template instructs readers to a non-existent
  document.

### Medium

2. Legacy generic architecture reviewer name in subagent architect template

- Evidence: `.agent/sub-agents/templates/subagent-architect.md:281`
- Current guidance suggests `architecture-reviewer` (generic) instead of named
  reviewers.
- Impact: stale delegation guidance and reduced routing clarity.

3. Architecture reviewer wrapper descriptions are effectively identical

- Evidence:
  - `.cursor/agents/architecture-reviewer-barney.md:5`
  - `.cursor/agents/architecture-reviewer-fred.md:5`
  - `.cursor/agents/architecture-reviewer-betty.md:5`
  - `.cursor/agents/architecture-reviewer-wilma.md:5`
- Impact: delegation triggers may not reflect intended lens differentiation,
  despite distinct in-body lens text.

4. Foundation-reading requirements are inconsistent across templates

- Strong explicit baseline in code reviewer:
  - `.agent/sub-agents/templates/code-reviewer.md:13`
- No equivalent explicit core-directives section in:
  - `.agent/sub-agents/templates/ground-truth-designer.md:1`
  - `.agent/sub-agents/templates/subagent-architect.md:2`
- Impact: instruction handoff quality varies by template.

### Low

5. `jc-review` output summary table aggregates architecture reviewers via wildcard

- Evidence: `.cursor/commands/jc-review.md:94`
- Current row: `architecture-reviewer-*`
- Impact: coarse reporting; less accountability per architecture lens.

## Positive Findings

1. Layered architecture is now present and mostly coherent.

- Evidence: `.agent/sub-agents/README.md:1`

2. Four-way architecture team awareness is centralised and reused.

- Team component: `.agent/sub-agents/components/architecture/reviewer-team.md:1`
- Shared architecture template includes team component:
  `.agent/sub-agents/templates/architecture-reviewer.md:5`

3. Active global sub-agent tables are in sync with current agent names.

- `.agent/directives/AGENT.md:41`
- `.agent/prompts/start-right.prompt.md:11`
- `.agent/prompts/start-right-thorough.prompt.md:11`

4. Code reviewer consolidation to single `code-reviewer` is reflected in active
   rule guidance.

- `.cursor/rules/invoke-code-reviewers.mdc:8`

## Root-Cause Analysis

Primary causes of drift:

1. Migration residue from prior naming model (`architecture-reviewer` generic).
2. Plan reference moved to archive without template pointer update.
3. Persona differentiation applied in body text but not reflected in wrapper
   delegation descriptions.
4. Incremental template evolution without a formal consistency checklist for
   mandatory reading requirements.

## Remediation Plan (Fresh Session Execution)

### Phase 1: Correctness Fixes (Blocking)

Objective: remove broken references and stale delegation names.

Tasks:

1. Fix ground-truth plan link in template

- File: `.agent/sub-agents/templates/ground-truth-designer.md`
- Action: replace non-existent active plan reference with:
  - `.agent/plans/semantic-search/archive/completed/ground-truth-redesign-plan.md`
- Acceptance criteria:
  - All file references in the template resolve to existing paths.

2. Replace generic architecture reviewer mention in subagent architect template

- File: `.agent/sub-agents/templates/subagent-architect.md`
- Action: update delegation pattern snippet to named reviewers:
  - `architecture-reviewer-barney`
  - `architecture-reviewer-fred`
  - `architecture-reviewer-betty`
  - `architecture-reviewer-wilma`
- Acceptance criteria:
  - No active docs/templates refer to generic `architecture-reviewer` as the
    live subagent name.

### Phase 2: Delegation Precision Improvements

Objective: improve routing quality without increasing complexity.

Tasks:

1. Differentiate architecture wrapper descriptions

- Files:
  - `.cursor/agents/architecture-reviewer-barney.md`
  - `.cursor/agents/architecture-reviewer-fred.md`
  - `.cursor/agents/architecture-reviewer-betty.md`
  - `.cursor/agents/architecture-reviewer-wilma.md`
- Action: update frontmatter `description` so each clearly maps to its lens.
- Acceptance criteria:
  - Each description is unique and trigger-specific.
  - All remain concise and delegation-friendly.

2. Align `jc-review` reporting table

- File: `.cursor/commands/jc-review.md`
- Action: replace wildcard row with explicit rows for each architecture reviewer
  (or add explicit rationale if wildcard intentionally retained).
- Acceptance criteria:
  - Report format supports per-lens status capture.

### Phase 3: Handoff Consistency Hardening

Objective: ensure a consistent baseline of instruction quality across templates.

Tasks:

1. Decide standard for mandatory baseline references

- Candidate baseline:
  - `.agent/directives/AGENT.md`
  - `.agent/directives/principles.md`
  - domain-specific directive(s)
  - DRY/YAGNI component
- Files to align (minimum):
  - `.agent/sub-agents/templates/ground-truth-designer.md`
  - `.agent/sub-agents/templates/subagent-architect.md`
- Acceptance criteria:
  - Chosen policy documented and applied consistently where appropriate.

2. Add a lightweight template consistency checklist (optional but recommended)

- Candidate location:
  - `.agent/sub-agents/README.md`
  - or a new checklist document under `.agent/sub-agents/`
- Acceptance criteria:
  - Checklist includes references, delegation naming, and path-validity checks.

3. Front-load testing strategy requirements for reviewer templates

- Files:
  - `.agent/sub-agents/templates/code-reviewer.md`
  - `.agent/sub-agents/templates/test-reviewer.md`
- Action:
  - Ensure both templates include `## Reading Requirements (MANDATORY)`.
  - Ensure `.agent/directives/testing-strategy.md` appears before
    `.agent/directives/principles.md` and `.agent/directives/AGENT.md`.
  - Ensure code reviewer guidance includes explicit TDD enforcement and
    evidence-based analysis expectations.
- Acceptance criteria:
  - Both templates front-load testing strategy requirements.
  - Code reviewer explicitly demands TDD evidence checks.

### Phase 4: Validation and Closure

Objective: verify no regressions and complete handoff.

Tasks:

1. Structural checks

- Confirm wrappers still point to valid templates.
- Confirm components remain leaf-only.

2. Reference checks

- Run search for stale reviewer names and broken link targets.

3. Documentation checks

- Confirm AGENT/start-right tables still match actual `.cursor/agents` names.

Acceptance criteria:

- No broken file references in active sub-agent templates.
- No generic `architecture-reviewer` references in active invocation guidance.
- Four architecture wrappers have distinct, useful `description` triggers.
- Review command reporting aligns with four architecture reviewer names.
- `code-reviewer` and `test-reviewer` include `Reading Requirements (MANDATORY)`.
- In both reviewer templates, `testing-strategy.md` precedes rules and AGENT.
- `code-reviewer` includes explicit TDD enforcement and analysis language.

## Suggested Verification Commands

Run from repo root:

```bash
# Inventory wrappers and templates
rg --files .cursor/agents .agent/sub-agents/templates .agent/sub-agents/components | sort

# Stale generic architecture reviewer references (active surfaces)
rg -n "architecture-reviewer\b" .cursor/commands .cursor/rules .agent/sub-agents/templates .agent/prompts .agent/directives --glob '!**/archive/**' \
  | rg -v "architecture-reviewer-(barney|fred|betty|wilma)"

# Validate key sub-agent names appear in coordination docs
rg -n "architecture-reviewer-barney|architecture-reviewer-fred|architecture-reviewer-betty|architecture-reviewer-wilma|code-reviewer|test-reviewer|type-reviewer|config-reviewer|ground-truth-designer|subagent-architect" .agent/directives/AGENT.md .agent/prompts/start-right.prompt.md .agent/prompts/start-right-thorough.prompt.md

# Quick check for template/component references
rg -n "\.agent/sub-agents/templates/|\.agent/sub-agents/components/" .cursor/agents .agent/sub-agents/templates

# Reviewer template mandatory reading checks
rg -n "## Reading Requirements \(MANDATORY\)" \
  .agent/sub-agents/templates/code-reviewer.md \
  .agent/sub-agents/templates/test-reviewer.md

# Reviewer template reading-order checks
rg -n "\.agent/directives/testing-strategy\.md|\.agent/directives/rules\.md|\.agent/directives/AGENT\.md" \
  .agent/sub-agents/templates/code-reviewer.md \
  .agent/sub-agents/templates/test-reviewer.md

# Code reviewer explicit TDD enforcement checks
rg -n "TDD|Red.? ?->.? ?Green.? ?->.? ?Refactor|test-first|testing-strategy" \
  .agent/sub-agents/templates/code-reviewer.md
```

## Risks and Controls

1. Risk: over-correcting old references in archived documents.

- Control: keep search/replace limited to active surfaces unless archival
  cleanup is explicitly requested.

2. Risk: introducing inconsistency between wrapper descriptions and team lens
   component.

- Control: update descriptions using the locked lens definitions already in
  `.agent/sub-agents/components/architecture/reviewer-team.md`.

3. Risk: increasing complexity in pursuit of consistency.

- Control: keep changes DRY/YAGNI; avoid adding new layers unless duplication
  is concrete.

## Deliverables for Completion

1. Updated active files with all Phase 1-3 tasks complete.
2. Short closure note added to this file summarising:

- what changed,
- what was intentionally deferred,
- and verification command outcomes.

## Fresh Session Start Instructions

1. Read this plan first.
2. Execute Phase 1 fully before any optional refinements.
3. Keep edits limited to active prompt/command/directive files unless asked to
   clean archive history.
4. Run validation commands, capture outcomes, and append closure notes.

## Closure Notes (21 February 2026)

### What Changed

- Fixed broken ground-truth plan reference:
  - `.agent/sub-agents/templates/ground-truth-designer.md` now points to
    `.agent/plans/semantic-search/archive/completed/ground-truth-redesign-plan.md`.
- Replaced legacy generic architecture reviewer mention in delegation guidance:
  - `.agent/sub-agents/templates/subagent-architect.md` now references Barney,
    Fred, Betty, and Wilma explicitly.
- Differentiated architecture reviewer wrapper descriptions:
  - `.cursor/agents/architecture-reviewer-barney.md`
  - `.cursor/agents/architecture-reviewer-fred.md`
  - `.cursor/agents/architecture-reviewer-betty.md`
  - `.cursor/agents/architecture-reviewer-wilma.md`
- Updated review reporting table to explicit architecture reviewer rows:
  - `.cursor/commands/jc-review.md`
- Added and aligned mandatory reading requirements for:
  - `.agent/sub-agents/templates/ground-truth-designer.md`
  - `.agent/sub-agents/templates/subagent-architect.md`
  - `.agent/sub-agents/templates/code-reviewer.md`
  - `.agent/sub-agents/templates/test-reviewer.md`
- Added template consistency checklist:
  - `.agent/sub-agents/README.md`

### Intentionally Deferred

- None.

### Verification Outcomes

- Template and wrapper inventory checks completed.
- No generic `architecture-reviewer` references remain in active invocation
  guidance after filtering named reviewers.
- Ground-truth template reference resolves to existing archived plan path.
- Architecture wrapper descriptions are unique and lens-specific.
- `jc-review` output table now lists all four architecture reviewers explicitly.
- `code-reviewer` and `test-reviewer` both include
  `Reading Requirements (MANDATORY)` with `testing-strategy.md` first.
- `code-reviewer` includes explicit TDD enforcement and evidence-based analysis
  language.
