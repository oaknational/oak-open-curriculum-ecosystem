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
attribution: "created by [Jim Cresswell](https://www.jimcresswell.net/), evolved by many people and agents in many repos"
---

# Practice Bootstrap

This file completes the plasmid trinity. `practice.md` describes the system (the **what**), `practice-lineage.md` encodes the principles and evolution rules (the **why**), and this file provides annotated templates for every artefact type (the **how**). Two entry points travel with the trinity: `README.md` (for humans) and `index.md` (for agents).

An agent reading all five practice-core files has enough information to build a working Practice system from scratch. Templates use `{placeholders}` for project-specific content. The Practice uses a **canonical-first artefact model**: all substantive content lives in `.agent/` (platform-agnostic), and thin platform adapters in `.cursor/`, `.claude/`, `.gemini/`, `.agents/` reference canonical content without duplicating it. Sections below use Cursor as the concrete platform example -- adapt adapter formats to local platforms. Ecosystem conventions use TypeScript/Node.js as examples -- substitute your ecosystem's equivalents.

## Before You Begin: Ecosystem Survey

The templates below use TypeScript/Node.js/Cursor conventions as concrete examples. Before creating any artefacts, the hydrating agent MUST:

1. **Survey the existing repo**: language(s), test framework(s), linter(s), formatter(s), package manager, build system, and existing quality standards.
2. **Assess alignment**: identify what the repo already has that meets or exceeds Practice principles. Existing standards that are at least as rigorous as the Practice MUST be preserved.
3. **Adapt templates**: substitute local tooling in every template. File extensions (`*.unit.test.ts` becomes `*_test.go`, `test_*.py`, etc.), tool names (`Vitest` becomes `pytest`, `go test`, etc.), configuration formats, and platform conventions all change.
4. **Never overwrite**: the Practice enables excellence; it does not replace what has already been achieved.

## The Artefact Model

Four artefact types follow the canonical-first model. Canonical content in `.agent/` is the single source of truth; thin platform adapters contain only activation metadata and a pointer to the canonical source.

| Type | Canonical | Platform adapters |
|---|---|---|
| **Skills** | `.agent/skills/*/SKILL.md` | `.cursor/skills/*/SKILL.md`, `.agents/skills/*/SKILL.md` |
| **Rules** | `.agent/rules/*.md` | `.cursor/rules/*.mdc`, `.claude/rules/*.md` (activation triggers only) |
| **Commands** (`jc-*` prefix) | `.agent/commands/*.md` | `.cursor/commands/jc-*.md`, `.claude/commands/jc-*.md`, `.gemini/commands/jc-*.toml`, `.agents/skills/jc-*/SKILL.md` |
| **Sub-agent templates** | `.agent/sub-agents/templates/*.md` | `.cursor/agents/`, `.claude/agents/`, `.gemini/commands/review-*.toml`, `.agents/skills/` |

Canonical rules are short operational reinforcements of policy. Each platform trigger wrapper points at either `.agent/rules/*.md` or `.agent/skills/*/SKILL.md` — never both, and never at a directive directly.

Two types need no adapters — consumed directly by all platforms:

- **Directives** (`.agent/directives/`) — policy documents (AGENT.md, rules.md, testing-strategy.md, metacognition.md). Platform-agnostic by nature. Canonical rules operationalise aspects of these policies; the directives are the authoritative source.
- **Plans** (`.agent/plans/`) — all platforms read plans from the same canonical location.

A thin wrapper MUST NOT contain substantive instructions or logic not in the canonical source. Add a portability validation script to the quality gates to enforce this (see ADR-125).

## Metacognition

Before planning work, pause.

Reflect on what you are about to do -- those are your thoughts. Think about those reflections -- those are your insights. Consider what those insights teach you about the original problem and your assumptions. How does that change the framing? Why?

This process costs nothing and prevents shallow execution. Apply it before every plan, every architectural decision, and every non-trivial implementation choice.

Create this as `.agent/directives/metacognition.md` (it is universal -- no project-specific content).

## The Practice Index (.agent/practice-index.md)

The practice-index is the bridge between the portable practice-core and the local repo. It is **not** part of the travelling package — it is created during hydration and stays in the repo. Practice-core files link to it via `../practice-index.md`; it carries the navigable links to the repo's actual artefacts.

### Required sections

| Section | Content |
|---|---|
| **Directives** | Table of directive files with paths and purposes |
| **Architectural Decisions** | Table of ADRs referenced by practice.md, with links |
| **Tools and Workflows** | Table of key commands, skills, and rules with links |
| **Artefact Directories** | Table of `.agent/` and `.cursor/` directories with links |

### Template

```markdown
# Practice Index

This file bridges the portable practice-core files and this repo's local
artefacts. It is **not** part of the travelling practice-core package — it is
created during hydration and stays in the repo. The format is specified by
`practice-core/practice-bootstrap.md`.

For the practice-core files and their roles, see
[practice-core/index.md](practice-core/index.md).

## Directives

| Directive | Purpose |
|---|---|
| [AGENT.md](directives/AGENT.md) | Operational entry point for agents |
| [rules.md](directives/rules.md) | Authoritative rules |
| [{additional directives}](directives/{filename}) | {purpose} |

## Architectural Decisions

| ADR | Subject |
|---|---|
| [ADR-{nnn}](../docs/architecture/architectural-decisions/{filename}) | {subject} |

## Tools and Workflows

| Tool | Purpose |
|---|---|
| [{command name}](../.cursor/commands/{filename}) | {purpose} |
| [{skill name}](../.cursor/skills/{dirname}/SKILL.md) | {purpose} |

## Artefact Directories

| Location | What lives there |
|---|---|
| [`.agent/directives/`](directives/) | Principles, rules, and operational directives |
| [`.agent/plans/`](plans/) | Work planning — active, archived, and templates |
| [`.agent/memory/`](memory/) | Institutional memory — napkin, distilled, code patterns |
| {additional directories as needed} |
```

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

## Rules: Canonical Rules and Platform Triggers

The rules system has three layers:

1. **Policy** — `.agent/directives/` (rules.md, testing-strategy.md, etc.). Authoritative, comprehensive.
2. **Canonical rules** — `.agent/rules/*.md`. Short operational reinforcements of policy. Each stands alone — enough to act on without reading the full directive.
3. **Platform triggers** — `.cursor/rules/*.mdc`, `.claude/rules/*.md`, etc. Thin wrappers that point at a canonical rule or skill.

A trigger MUST point at either `.agent/rules/*.md` or `.agent/skills/*/SKILL.md` — never at a directive directly, and never both. No double indirection.

### Canonical Rule Format

```text
# {Rule Title}

{2-8 lines of imperative instruction — enough to act on standalone}

See `{directive-or-ADR-path}` for the full policy.
```

### Trigger Wrapper Formats

**Cursor** (`.cursor/rules/*.mdc`):

```text
---
description: {one-line}
alwaysApply: true  # or globs: '**/*.test.ts'
---

Read and follow `.agent/rules/{name}.md`.
```

**Claude Code** (`.claude/rules/*.md`) — path-scoped only; `alwaysApply` rules are enforced via the entry-point chain:

```text
---
paths:
  - '**/*.test.ts'
---

Read and follow `.agent/rules/{name}.md`.
```

Platform-specific notes (e.g. "In Cursor, use `ReadLints`") may appear in the trigger — they are activation metadata, not policy.

## Sub-agents: Templates and Platform Adapters

Canonical sub-agent prompts live in `.agent/sub-agents/templates/*.md` (platform-agnostic). For a production app, use the three-layer composition system (ADR-114): shared components → canonical templates → thin platform adapters.

Platform adapters contain only activation metadata and a pointer to the canonical template: Cursor `.cursor/agents/*.md`, Claude Code `.claude/agents/*.md`, Gemini CLI `review-*.toml` commands, Codex instructional skills.

Cursor adapter format (`readonly: true` enforces read-only review at the platform level):

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

## Commands: Canonical and Platform Adapters

Canonical commands in `.agent/commands/*.md` contain the substantive workflow instructions. Platform adapters use the `jc-*` prefix consistently across all platforms and contain only a pointer to the canonical command.

### Canonical Format (.agent/commands/)

```markdown
# {Command Name}

{Workflow instructions — the substantive content.}

## Steps

1. {Step 1}
2. {Step 2}
```

### Platform Adapter Formats

Cursor (`.cursor/commands/jc-*.md`) — uses `@` file injection:

```markdown
# {Command Name}

Read and follow @.agent/commands/{command-name}.md
```

Claude Code (`.claude/commands/jc-*.md`) — YAML frontmatter with `description`, `allowed-tools`, `argument-hint`; body references canonical path with `$ARGUMENTS`. Gemini (`.gemini/commands/jc-*.toml`) — TOML with `description` and `prompt` fields; uses `{{args}}` for argument injection. Codex (`.agents/skills/jc-*/SKILL.md`) — YAML frontmatter with `name`, `description`; body reads canonical path.

### Required Commands

| Command | File | Core logic |
|---|---|---|
| start-right | `jc-start-right-quick.md` | Read and follow the start-right prompt. |
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

## Skills (.agent/skills/)

### SKILL.md Format

Canonical skills use YAML frontmatter. Platform adapters in `.cursor/skills/` and `.agents/skills/` are thin wrappers.

```yaml
---
name: {skill-name}
classification: active | passive
description: {When to invoke this skill — one sentence trigger condition}
---

# {Skill Title}

## Goal
{What the skill achieves}

## Workflow
1. {Step 1}
```

Cursor adapter (`.cursor/skills/{name}/SKILL.md`): `name`/`description` frontmatter + `Read and follow @.agent/skills/{name}/SKILL.md`. Codex adapter (`.agents/skills/{name}/SKILL.md`): `name`/`description` frontmatter + reads canonical path without `@`.

### Napkin (.agent/skills/napkin/SKILL.md)

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

### Distillation (.agent/skills/distillation/SKILL.md)

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

## Platform Configuration

Each platform requires configuration files (e.g. Cursor's `.cursor/environment.json` with `agentCanUpdateSnapshot: true`, and `.cursor/settings.json` for plugins). These are platform-specific -- consult each platform's documentation and ADR-125 for the full adapter location reference.

## Bootstrap Checklist

After creating all files, validate:

1. `.agent/practice-core/` contains all five practice-core files (`practice.md`, `practice-lineage.md`, `practice-bootstrap.md`, `README.md`, `index.md`) and `incoming/.gitkeep`.
2. `.agent/practice-index.md` exists, all its links resolve, and its sections match the format specified above.
3. `AGENT.md` links to `.agent/practice-core/index.md`.
4. Every file path referenced in AGENT.md, rules, commands, and agents resolves.
5. Every agent's reading requirements point to files that exist.
6. `AGENTS.md` links to `AGENT.md`, which links to `rules.md` and `testing-strategy.md`.
7. The `start-right` prompt references all foundation documents.
8. The napkin rule points to a napkin skill that exists.
9. Quality gates (`type-check`, `lint`, `build`, `test`) are wired in `package.json`.
10. The project builds.
11. **Artefact portability**: canonical skills and commands in `.agent/` contain no platform-specific syntax. All platform adapters are thin wrappers. Run `pnpm portability:check` or equivalent to validate adapter-to-canonical consistency (see ADR-125).
12. **Cohesion audit**: all practice-core files are internally consistent, practice-index.md links resolve, and all broader Practice files (directives, rules, commands, prompts, skills) are aligned with the core. No stale descriptions, no contradictions, no outdated wording.
