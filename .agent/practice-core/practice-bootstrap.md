---
provenance:
  - index: 0
    repo: cloudinary-icon-ingest-poc
    date: 2026-02-26
    purpose: "Short-lived POC: build-time SVG icon ingestion from Cloudinary, 3 reviewers, simplified gates"
  - index: 1
    repo: oak-open-curriculum-ecosystem
    date: 2026-02-27
    purpose: "Production SDK ecosystem: curriculum SDK, MCP servers, semantic search, 13 specialist reviewers, full learning loop"
  - index: 2
    repo: oak-open-curriculum-ecosystem
    date: 2026-02-28
    purpose: "Ecosystem-agnostic hydration: added ecosystem survey preamble for agents hydrating into non-TypeScript repos"
fitness_ceiling: 400
attribution: "created by [Jim Cresswell](https://www.jimcresswell.net/), evolved by many agents in many repos"
---

# Practice Bootstrap

This file completes the plasmid trinity. `practice.md` describes the system (the **what**), `practice-lineage.md` encodes the principles and evolution rules (the **why**), and this file provides annotated templates for every artefact type (the **how**).

An agent reading all three files has enough information to build a working Practice system from scratch. Templates use `{placeholders}` for project-specific content. Platform-specific conventions (Cursor) are labelled as such. Ecosystem-specific conventions (TypeScript/Node.js) are used as concrete examples throughout -- substitute your ecosystem's equivalents.

## Before You Begin: Ecosystem Survey

The templates below use TypeScript/Node.js/Cursor conventions as concrete examples. Before creating any artefacts, the hydrating agent MUST:

1. **Survey the existing repo**: language(s), test framework(s), linter(s), formatter(s), package manager, build system, and existing quality standards.
2. **Assess alignment**: identify what the repo already has that meets or exceeds Practice principles. Existing standards that are at least as rigorous as the Practice MUST be preserved.
3. **Adapt templates**: substitute local tooling in every template. File extensions (`*.unit.test.ts` becomes `*_test.go`, `test_*.py`, etc.), tool names (`Vitest` becomes `pytest`, `go test`, etc.), configuration formats, and platform conventions all change.
4. **Never overwrite**: the Practice enables excellence; it does not replace what has already been achieved.

## Metacognition

Before planning work, pause.

Reflect on what you are about to do -- those are your thoughts. Think about those reflections -- those are your insights. Consider what those insights teach you about the original problem and your assumptions. How does that change the framing? Why?

This process costs nothing and prevents shallow execution. Apply it before every plan, every architectural decision, and every non-trivial implementation choice.

Create this as `.agent/directives/metacognition.md` (it is universal -- no project-specific content).

## Entry Points

### AGENTS.md (repo root)

The cross-platform entry point. Every agent platform looks for this file.

```markdown
# AGENTS.md

**{Project name}** -- {one-line description}.

Read [AGENT.md](.agent/directives/AGENT.md)
```

### AGENT.md (.agent/directives/)

The operational entry point. Sections (in order): **Grounding** (spelling, date format, link to metacognition), **The Practice** (link to `.agent/practice-core/index.md` and start-right), **First Question**, **Project Context** (what, package manager, framework, scope, key artefacts), **RULES** (link to rules.md), **Sub-agents** (roster, Cursor config table), **Development Commands** (project-specific), **Structure** (directory tree).

Keep it stable -- no mutable session state. Mutable state belongs in plans.

## Directives

### rules.md (.agent/directives/)

Encode the Principles from `practice-lineage.md` as imperative rules. Sections: **First Question**, **Core Rules** (code design, domain-specific, refactoring, tooling, code quality, types, testing summary, developer experience). Each rule is stated as a command, not a suggestion. Link to `testing-strategy.md` from the testing section.

### testing-strategy.md (.agent/directives/)

Encode the Testing Philosophy from `practice-lineage.md` with local tooling. Sections: **Tooling** (test runner), **Philosophy** (imperative rules), **Test Types** (unit: pure function, no mocks; integration: units as code, simple injected mocks -- naming convention adapted to local ecosystem), **What to Test** (project-specific surfaces), **Workflow** (TDD always, tests next to code).

## Always-Applied Rules (Cursor .mdc files)

Cursor rules live in `.cursor/rules/*.mdc`. Two formats:

**Always-applied** (fires on every interaction):

```text
---
description: {one-line description}
alwaysApply: true
---

{Rule content -- can be a single sentence or a structured document}
```

**File-scoped** (fires when matching files are open):

```text
---
description: {one-line description}
globs: '**/*.test.ts'
---

{Rule content}
```

### Required Rules

Create one `.mdc` file for each. The `description` field is shown to the agent before the rule content, so make it count.

| Filename | alwaysApply | globs | Content |
|---|---|---|---|
| `read-agent-md.mdc` | true | -- | Read `.agent/directives/AGENT.md` and `.agent/directives/rules.md` at session start. |
| `napkin-always-active.mdc` | true | -- | Read `.agent/memory/distilled.md` then `.agent/memory/napkin.md` at session start. Write to napkin continuously. See napkin skill for full guidance. |
| `tdd-at-all-levels.mdc` | true | -- | TDD at all levels: unit, integration. Red-Green-Refactor is mandatory. Reference testing-strategy.md. |
| `no-type-shortcuts.mdc` | true | `**/*.{ts,tsx,mts}` | No `as` (except `as const`), `any`, `!`, `Record<string, unknown>`. Preserve type information. |
| `fail-fast-with-helpful-errors.mdc` | true | -- | Fail fast with helpful errors. Never silently. Never ignore errors. |
| `never-disable-checks.mdc` | true | -- | Never disable type checks, linting, formatting, tests, or git hooks. Fix the root cause. |
| `no-skipped-tests.mdc` | -- | `**/*.test.ts` | No `it.skip`, `describe.skip`, or any skipping mechanism. Fix or delete. |
| `never-prefix-unused-variables-with-underscore.mdc` | true | -- | Never prefix unused variables with underscore. Fix or delete. |
| `all-quality-gate-issues-are-always-blocking.mdc` | true | -- | All quality gate issues are blocking. No exceptions. |
| `use-result-pattern.mdc` | -- | `**/*.{ts,tsx,mts}` | Use `Result<T, E>` pattern. Never throw for expected failures. Handle all cases explicitly. |
| `no-global-state-in-tests.mdc` | -- | `**/*.test.ts` | No `process.env` mutation, `vi.stubGlobal`, `vi.doMock`. Pass config as parameters. |
| `invoke-code-reviewers.mdc` | true | -- | After non-trivial changes, invoke `code-reviewer` plus relevant specialists. Include triage checklist and invocation pattern. |
| `follow-the-practice.mdc` | true | -- | Read `.agent/practice-core/index.md` at session start. The Practice is the entire system, not a single file. |

Rules with both `alwaysApply: true` and `globs` will fire on every interaction but the description helps the agent understand the scope.

## Agent Definitions (Cursor .cursor/agents/)

Agent files use YAML frontmatter. The `readonly: true` field prevents agents from modifying code during review.

### Template

```text
---
name: {agent-name}
description: {One-line description for Cursor's agent picker}
model: auto
tools: Read, Glob, Grep, LS, Shell, ReadLints
readonly: true
---

# {Agent Title}: {Role Description}

{2-3 sentence role statement. Include "Mode: Observe, analyse and report. Do not modify code."}

## Identity

State your identity at the start of your first response:

    Name: {agent-name}
    Purpose: {purpose}
    Summary: {one-line summary}

## Reading Requirements (MANDATORY)

Before reviewing, read and internalise:

| Document | Purpose |
|----------|---------|
| `.agent/directives/AGENT.md` | Core directives |
| `.agent/directives/rules.md` | Authoritative rules |
| `.agent/directives/testing-strategy.md` | TDD expectations |

## Core Philosophy

{The agent's guiding principle in one sentence}

## When Invoked

### Step 1: Gather Context
{How to identify what to review}

### Step 2: Analyse
{What to assess -- specific to the agent's specialisation}

### Step 3: Prioritise
Categorise by severity: Critical (must fix), Important (should fix), Suggestions (could improve).

### Step 4: Report
{Actionable feedback with location, problem, impact, fix}

## Output Format

    ## {Report Title}
    **Scope**: [what was reviewed]
    **Verdict**: [APPROVED / APPROVED WITH SUGGESTIONS / CHANGES REQUESTED]
    ### Critical Issues
    ### Important Improvements
    ### Suggestions
    ### Positive Observations
```

### The Three Agents

| Agent | Specialisation | Key assessment areas |
|---|---|---|
| `code-reviewer` | Gateway reviewer, always invoked | Correctness, edge cases, security, performance, readability, maintainability, test coverage. Triages to specialists. |
| `test-reviewer` | Test quality and TDD compliance | Test classification (unit/integration), naming conventions, mock simplicity, test value, TDD evidence. Recommends deletion for tests that test mocks or types. |
| `type-reviewer` | TypeScript type safety | Type flow tracing, type widening detection, assertion usage, external boundary validation. Core principle: "why solve at runtime what you can embed at compile time?" |

## Commands (Cursor .cursor/commands/)

Command files are plain markdown. Cursor exposes them as slash commands. The `@` prefix creates a file reference that Cursor resolves.

### Template

```markdown
# {Command Name}

{What this command does in 1-2 sentences.}

## Process

1. {Step 1}
2. {Step 2}

@.agent/directives/rules.md
```

### Required Commands

| Command | File | Core logic |
|---|---|---|
| start-right | `jc-start-right.md` | Read and follow the start-right prompt. |
| gates | `jc-gates.md` | Run `type-check -> lint -> build -> test` sequentially. All blocking. Restart from beginning after any fix. |
| review | `jc-review.md` | Run gates, triage specialists, invoke them, consolidate into single report with verdict. |
| commit | `jc-commit.md` | Check status, review diff, verify gates, stage selectively, conventional commit format. Safety: never force push, never amend pushed commits, never `--no-verify`. |
| consolidate-docs | `jc-consolidate-docs.md` | Verify documentation is current. Extract any remaining plan content to permanent locations. Update plan/prompt statuses. Write to napkin. Check practice box. Check practice fitness. Consider practice evolution. |
| plan | `jc-plan.md` | Read directives. Create plan with YAML frontmatter, acceptance criteria, risk assessment, non-goals. |
| think | `jc-think.md` | Structured thinking: understand -> analyse -> reason -> synthesise -> conclude. |
| step-back | `jc-step-back.md` | Pause. Reflect on goals, approach, alignment with rules. Apply First Question. |
| go | `jc-go.md` | Quick grounding: read AGENT.md, read rules, check task list, proceed. |

## Prompts (.agent/prompts/)

All prompts carry YAML frontmatter for consistent status tracking and discoverability:

```yaml
---
prompt_id: {unique-id}
title: "{Human-readable title}"
type: workflow | handover
status: active | completed
last_updated: YYYY-MM-DD
parent_plan: {plan_id}  # handover prompts only
---
```

Completed prompts move to `archive/` within the prompts directory. The frontmatter `status` field and the archive location reinforce each other -- belt and braces.

### Prompt Types

**Workflow prompts** (e.g. `start-right`) are evergreen -- they describe a repeatable process, not a specific deliverable. They have no `parent_plan`.

**Handover prompts** describe the context for a specific implementation session. Each references its parent plan via `parent_plan`. When the work completes, the prompt is marked `status: completed` and archived. A new handover is written for the next slice.

### start-right.prompt.md

The session entry point. Sections: **Foundation Documents** (read AGENT.md, rules.md, testing-strategy.md), **Project Context** (brief description plus key doc links), **Guiding Questions** (right problem? right layer? simpler? assumptions?), **Practice Box** (check `.agent/practice-core/incoming/` for plasmids), **Process** (discuss first step with user), **Quality Gates** (list the gate commands).

## Skills (.cursor/skills/)

### Napkin (.cursor/skills/napkin/SKILL.md)

The napkin is the capture stage of the learning loop. It is always active.

**Session start**: Read `.agent/memory/distilled.md` (if exists), then `.agent/memory/napkin.md` (if exists; create if not).

**Continuous updates**: Write whenever you learn something worth recording -- errors you figure out, user corrections, your own mistakes, tool surprises, approaches that work or fail. Be specific: "Assumed API returns list but it returns paginated object with `.items`" not "Made an error."

**Structure**:

```markdown
## Session: YYYY-MM-DD -- Brief Title

### What Was Done
- {summary of work completed}

### Patterns to Remember
- {actionable insights}
```

Add `### Mistakes Made` or `### Corrections` subsections as needed.

**Rotation**: When the napkin exceeds ~800 lines, follow the distillation skill.

### Distillation (.cursor/skills/distillation/SKILL.md)

Distillation extracts high-signal patterns from the napkin into a curated `distilled.md` rulebook.

**Trigger**: Napkin exceeds ~800 lines, or user requests.

**Target**: `distilled.md` under 200 lines. Every entry earns its place by being actionable.

**Protocol**:

1. **Extract**: Collect all "Patterns to Remember", "Mistakes", and "Lessons" from the outgoing napkin.
2. **Merge**: Compare against existing `distilled.md`. New insights: add. Duplicates: skip. Refinements: update. Contradictions: investigate.
3. **Prune**: Entries that have matured into permanent documentation (rules, docs, practice) are removed from `distilled.md`. Create the permanent doc first, then remove the entry.
4. **Archive**: `cp napkin.md archive/napkin-YYYY-MM-DD.md`
5. **Fresh start**: Create new `napkin.md` with a session heading.

**Quality**: Entries must be specific, actionable, non-obvious, and terse (1-2 lines).

## Cursor Configuration

### .cursor/environment.json

```json
{
  "agentCanUpdateSnapshot": true
}
```

### .cursor/settings.json

```json
{
  "plugins": {}
}
```

Enable plugins as needed for the project (e.g. Vercel, Sentry).

## Bootstrap Checklist

After creating all files, validate:

1. `.agent/practice-core/` contains `index.md` (local), `practice.md`, `practice-lineage.md`, `practice-bootstrap.md`, and `incoming/.gitkeep`.
2. `AGENT.md` links to `.agent/practice-core/index.md`.
3. Every file path referenced in AGENT.md, rules, commands, and agents resolves.
4. Every agent's reading requirements point to files that exist.
5. `AGENTS.md` links to `AGENT.md`, which links to `rules.md` and `testing-strategy.md`.
6. The `start-right` prompt references all foundation documents.
7. The napkin rule points to a napkin skill that exists.
8. Quality gates (`type-check`, `lint`, `build`, `test`) are wired in `package.json`.
9. The project builds.
10. **Cohesion audit**: all practice-core files are internally consistent, and all broader Practice files (directives, rules, commands, prompts, skills) are aligned with the core. No stale descriptions, no contradictions, no outdated wording.
