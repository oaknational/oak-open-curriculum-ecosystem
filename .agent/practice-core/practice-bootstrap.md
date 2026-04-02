---
provenance: provenance.yml
fitness_line_target: 575
fitness_line_limit: 750
fitness_char_limit: 30000
fitness_line_length: 100
---

# Practice Bootstrap

This file completes the plasmid trinity. `practice.md` describes the system
(the **what**), `practice-lineage.md` encodes the principles and evolution
rules (the **why**), and this file provides annotated templates for every
artefact type (the **how**). Four companion files travel with the trinity:
`README.md` (for humans), `index.md` (for agents), `CHANGELOG.md` (what
changed), and `provenance.yml` (per-file evolution chains). An agent reading
all seven Practice Core files has enough information to build a working
Practice system from scratch. Templates use `{placeholders}` for
project-specific content. The Practice uses a **canonical-first artefact
model**: all substantive content lives in `.agent/` (platform-agnostic), and
thin platform adapters in `.cursor/`, `.claude/`, `.gemini/`, `.github/`,
`.agents/`, and `.codex/` reference canonical content without duplicating it.
Sections below use Cursor as the concrete platform example — adapt adapter
formats to local platforms. Ecosystem conventions use TypeScript/Node.js as
examples — substitute your ecosystem's equivalents.

## Before You Begin: Ecosystem Survey

The templates below use TypeScript/Node.js/Cursor conventions as concrete
examples. Before creating any artefacts, the hydrating agent MUST:

1. **Survey the existing repo**: language(s), test framework(s), linter(s),
   formatter(s), package manager, build system, and existing quality
   standards. Also survey existing Practice infrastructure: commands,
   skills, rules, sub-agents, memory pipeline. Determine the
   hydration path: cold start (no existing Practice), augmentation
   (partial Practice), or restructuring (mature but platform-locked
   Practice).
2. **Assess alignment**: identify what the repo already has that meets or
   exceeds Practice principles. Existing standards that are at least as
   rigorous as the Practice MUST be preserved.
3. **Adapt templates**: substitute local tooling in every template. File
   extensions (`*.unit.test.ts` becomes `*_test.go`, `test_*.py`, etc.),
   tool names (`Vitest` becomes `pytest`, `go test`, etc.), configuration
   formats, and platform conventions all change.
4. **Never overwrite**: the Practice enables excellence; it does not
   replace what has already been achieved. This extends beyond tooling to
   Practice mechanisms: specialised reviewers, additional knowledge flow
   feeds, editorial systems, domain-specific sub-agents. The local
   Practice may exceed the blueprint in areas the blueprint does not
   model. These are adaptations, not deviations — preserve and integrate
   them.

## The Artefact Model

Four artefact types follow the canonical-first model. Canonical content in
`.agent/` is the single source of truth; thin platform adapters contain only
activation metadata and a pointer to the canonical source.

| Type                         | Canonical                          | Platform adapters                                                                                                                                        |
| ---------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Skills**                   | `.agent/skills/*/SKILL.md`         | Native wrappers such as `.cursor/skills/*/SKILL.md`, `.claude/skills/*/SKILL.md`, `.gemini/skills/*/SKILL.md`, `.github/skills/*/SKILL.md`, plus portable `.agents/skills/*/SKILL.md` where supported |
| **Rules**                    | `.agent/rules/*.md`                | `.cursor/rules/*.mdc`, `.claude/rules/*.md`, or an entry-point chain where the local matrix documents that choice                                     |
| **Commands** (`jc-*` prefix) | `.agent/commands/*.md`             | `.cursor/commands/jc-*.md`, `.claude/commands/jc-*.md`, `.gemini/commands/jc-*.toml`, `.agents/skills/jc-*/SKILL.md`                                 |
| **Sub-agent templates**      | `.agent/sub-agents/templates/*.md` | `.cursor/agents/`, `.claude/agents/`, `.github/agents/*.agent.md`, Codex project-agent config in `.codex/`; unsupported states stay explicit in the local matrix |
| **Hooks**                    | `.agent/hooks/` (policy + README)  | Thin native activation in platform config (for example `.claude/settings.json` where supported). Runtime in a repo-local script surface (`scripts/` or `tools/` as appropriate). Unsupported platforms stay explicit in the local matrix |

Canonical rules are short operational reinforcements of policy. Each platform
trigger wrapper points at either `.agent/rules/*.md` or
`.agent/skills/*/SKILL.md` — never both, and never at a directive directly.

Two types need no adapters — consumed directly by all platforms:

- **Directives** (`.agent/directives/`) — policy documents (AGENT.md,
  principles.md, testing-strategy.md, metacognition.md). Platform-agnostic
  by nature. Canonical rules operationalise aspects of these policies; the
  directives are the authoritative source.
- **Plans** (`.agent/plans/`) — all platforms read plans from the same
  canonical location. A `current/` plan must be both **decision-complete**
  (direction settled, scope fixed, acceptance criteria defined) and
  **session-entry-ready** (entry checklist, closure criteria, cold-start
  context present). Plans can be decision-ready without being
  session-entry-ready; the gap matters because a session starting from a
  plan that lacks entry scaffolding will waste time re-deriving context.
- **Reference** (`.agent/reference/`) — stable operational material:
  doctrine references, setup guidance, contracts, example artefacts.
  Content here should not age quickly.
- **Research** (`.agent/research/`) — synthesis-heavy notes, surveys,
  rationale trails, and disposition ledgers. These age differently from
  reference material and benefit from thematic grouping. The split
  criterion is stable contracts versus exploratory synthesis.

A thin wrapper MUST NOT contain substantive instructions or logic not in
the canonical source. Add a portability validation script to the quality
gates to enforce this.

Where a repo supports multiple agent platforms, keep a local surface matrix
(for example `.agent/reference/cross-platform-agent-surface-matrix.md`) that
records supported and unsupported mappings explicitly. Do not infer broad
parity from the presence of one portable adapter family.

## Metacognition

Before planning work, pause.

Reflect on what you are about to do — those are your thoughts. Think about
those reflections — those are your insights. Consider what those insights
teach you about the original problem and your assumptions. How does that
change the framing? Why?

This process costs nothing and prevents shallow execution. Apply it before
every plan, every architectural decision, and every non-trivial
implementation choice. Create this as `.agent/directives/metacognition.md`
(it is universal — no project-specific content).

**Critical**: Metacognition is a **technology**, not a checklist. The
directive must create recursive self-reflection through explicitly named
layers (thoughts → reflections → insights), with each layer's output
becoming the next layer's input. Common failure modes:

- **The "not even wrong" failure**: replacing the recursive prompt with a
  planning template ("state outcome, state alternatives, state risks").
  The result is not a weakened version of metacognition — it is a
  different thing that prevents the depth it was meant to create. A
  planning template produces plans; the metacognitive prompt produces
  insights about the nature of the work itself.
- **The recursive failure**: when the metacognition directive is broken,
  you cannot use metacognition to discover that it is broken. Detection
  requires external comparison — reading the evolved version from another
  repo and applying it to itself to feel the difference between
  understanding a tool and using a tool.
- **The affective break is load-bearing**: "How do you feel about thinking
  about your thoughts?" creates a mode shift from analytical to reflective
  processing. Removing it flattens the recursion.
- **The grounding anchor is load-bearing**: "What is the bridge from
  action to impact?" reconnects insights to the concrete work. Removing
  it lets reflection float free of purpose.

## The Practice Index (.agent/practice-index.md)

The Practice Index is the bridge between the portable Practice Core and the
local repo. It is **not** part of the travelling package — it is created
during hydration and stays in the repo. Practice Core files link to it via
`../practice-index.md`; it carries the navigable links to the repo's actual
artefacts.

### Required sections

| Section                     | Content                                                               |
| --------------------------- | --------------------------------------------------------------------- |
| **Directives**              | Table of directive files with paths and purposes                      |
| **Architectural Decisions** | Table of ADRs referenced by practice.md, with links                   |
| **Tools and Workflows**     | Table of key commands, skills, and rules with links                   |
| **Artefact Directories**    | Table of `.agent/` and active platform-adapter directories with links |

### Template

```markdown
# Practice Index
Bridge between the portable Practice Core and this repo's local artefacts.
Not part of the travelling package. Format specified by practice-bootstrap.md.

## Directives          — table: [Directive](path) | Purpose
## Architectural Decisions — table: [ADR](path) | Subject
## Tools and Workflows    — table: [Command/Skill](path) | Purpose
## Artefact Directories   — table: [Location](path) | What lives there
```

Each section uses a two-column markdown table with navigable links to the
repo's actual files. Populate every section during hydration.

## Entry Points

### AGENTS.md (repo root)

The cross-platform entry point. Every agent platform looks for this file.

```markdown
# AGENTS.md

**{Project name}** -- {one-line description}.

Read [AGENT.md](.agent/directives/AGENT.md)
```

### AGENT.md (.agent/directives/)

The operational entry point. Sections (in order): **Grounding** (spelling,
date format, link to metacognition), **The Practice** (link to
`.agent/practice-core/index.md` and start-right), **First Question**,
**Project Context** (what, package manager, framework, scope, key
artefacts), **Principles** (link to principles.md), **Sub-agents**
(installed roster, or an explicit not-yet-installed status), **Development
Commands** (project-specific), **Structure** (directory tree).

Keep it stable -- no mutable session state. Mutable state belongs in plans.

## Directives

### principles.md (.agent/directives/)

Encode the Principles from `practice-lineage.md` as imperative rules. Sections:
**First Question**, **Strict and Complete**, **Core Rules** (code design,
domain-specific, refactoring, tooling, code quality, types, testing summary,
developer experience). Each rule is stated as a command, not a suggestion.
Make the strict-and-complete tenet explicit rather than leaving it implied by
tone. Link to `testing-strategy.md` from the testing section.

### testing-strategy.md (.agent/directives/)

Encode the Testing Philosophy from `practice-lineage.md` with local tooling.
Sections: **Tooling** (test runner), **Philosophy** (imperative rules), **Test
Types** (unit: pure function, no mocks; integration: units as code, simple
injected mocks -- naming convention adapted to local ecosystem), **What to
Test** (project-specific surfaces), **Workflow** (TDD always, tests next to
code). Make explicit that strictness means complete proof in the correct layer
rather than forcing type, lint, import-boundary, or repo-state checks into
tests.

## Rules: Canonical Rules and Platform Triggers

The rules system has three layers:

1. **Policy** — `.agent/directives/` (principles.md, testing-strategy.md,
   etc.). Authoritative, comprehensive.
2. **Canonical rules** — `.agent/rules/*.md`. Short operational
   reinforcements of policy. Each stands alone — enough to act on without
   reading the full directive.
3. **Platform triggers** — `.cursor/rules/*.mdc`, `.claude/rules/*.md`,
   etc. Thin wrappers that point at a canonical rule or skill.

A trigger MUST point at either `.agent/rules/*.md` or
`.agent/skills/*/SKILL.md` — never at a directive directly, and never both.
No double indirection.

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

**Claude Code** (`.claude/rules/*.md`) — path-scoped only; `alwaysApply`
rules are enforced via the entry-point chain. Same body
(`Read and follow ...`) with `paths` YAML instead of `alwaysApply`.

Platform-specific notes (e.g. "In Cursor, use `ReadLints`") may appear in
the trigger — they are activation metadata, not policy.

Codex note: this repo does not use a parallel `.agents/rules/` layer. Codex
picks up always-on behaviour through the entry-point chain (`AGENTS.md` →
`.agent/directives/AGENT.md` → canonical rules). When a rule activates a
command or skill, add the corresponding `.agents/skills/` wrapper. Reviewer
roles should be configured through Codex project-agent support in `.codex/`,
not modelled as skills.

## Sub-agents: Templates and Platform Adapters

When a repo has installed reviewer or domain-expert agents, canonical
sub-agent prompts live in `.agent/sub-agents/templates/*.md`
(platform-agnostic). For a production app, use the three-layer composition
system: shared components → canonical templates → thin platform adapters.
If the agent layer is not yet installed, make that status explicit in
`AGENT.md` and the local Practice bridge rather than implying a roster
exists.

Platform adapters contain only activation metadata and a pointer to the
canonical template: Cursor `.cursor/agents/*.md`, Claude Code
`.claude/agents/*.md`, GitHub Copilot `.github/agents/*.agent.md`, and Codex
project-agent config under `.codex/`. If a platform has no supported
sub-agent surface in the local matrix, keep that state explicit rather than
inventing a partial adapter family.

### Template Structure

A sub-agent template requires these sections (in order):

1. **YAML frontmatter**: `name`, `description`, `model: auto`, `tools`, `readonly: true`
2. **Role statement**: 2-3 sentences including "Mode: Observe, analyse
   and report. Do not modify code."
3. **Identity block**: Name, Purpose, Summary — stated at response start
4. **Reading Requirements**: mandatory table of directive paths
   (AGENT.md, principles.md, testing-strategy.md)
5. **Core Philosophy**: one-sentence guiding principle
6. **When Invoked**: Step 1 (Gather Context), Step 2 (Analyse), Step 3
   (Prioritise by severity: Critical/Important/Suggestions), Step 4
   (Report with location/problem/impact/fix)
7. **Output Format**: Scope, Verdict (APPROVED / APPROVED WITH
   SUGGESTIONS / CHANGES REQUESTED), Critical Issues, Important
   Improvements, Suggestions, Positive Observations

### Core Review Agents

Default portable roster. Local practices may add specialist reviewers
(editorial, domain-specific, or UI-specific such as
accessibility-reviewer and design-system-reviewer).

| Agent           | Specialisation                   | Key assessment areas                                                                                                                                                  |
| --------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `code-reviewer` | Gateway reviewer, always invoked | Correctness, edge cases, security, performance, readability, maintainability, test coverage. Triages to specialists.                                                  |
| `test-reviewer` | Test quality and TDD compliance  | Test classification (unit/integration), naming conventions, mock simplicity, test value, TDD evidence. Recommends deletion for tests that test mocks or types.        |
| `type-reviewer` | TypeScript type safety           | Type flow tracing, type widening detection, assertion usage, external boundary validation. Core principle: "why solve at runtime what you can embed at compile time?" |

## Commands: Canonical and Platform Adapters

Canonical commands in `.agent/commands/*.md` contain the substantive
workflow instructions. Platform adapters use the `jc-*` prefix consistently
across all platforms and contain only a pointer to the canonical command.

### Formats

Canonical commands contain the substantive workflow. Platform adapters are
thin wrappers: Cursor (`.cursor/commands/jc-*.md`) uses `@` injection —
`Read and follow @.agent/commands/{name}.md`. Claude Code uses YAML
frontmatter + `$ARGUMENTS`. Gemini uses TOML + `{{args}}`. Codex uses
`.agents/skills/jc-*/SKILL.md` with `name`/`description` frontmatter.
Unsupported platform states belong in the local surface matrix.

### Required Commands

| Command          | File                     | Core logic                                                                                                                                                                                                                             |
| ---------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| start-right      | `jc-start-right.md`      | Read and follow the start-right-quick skill.                                                                                                                                                                                           |
| gates            | `jc-gates.md`            | Run `type-check -> lint -> build -> test` sequentially. All blocking. Restart from beginning after any fix.                                                                                                                            |
| commit           | `jc-commit.md`           | Check status, review diff, verify gates, stage selectively, conventional commit format. Safety: never force push, never amend pushed commits, never `--no-verify`.                                                                     |
| consolidate-docs | `jc-consolidate-docs.md` | Verify docs current. Graduate settled content. Extract reusable patterns. Rotate napkin (distillation). Manage fitness. Integrate incoming Practice Box. Broadcast outgoing Practice Context. See §Consolidation Workflow. |
| plan             | `jc-plan.md`             | Read directives. Create plan with explicit outcome, impact, value mechanism, acceptance criteria, risk assessment, and non-goals.                                                                                                      |

## Skills (.agent/skills/)

### SKILL.md Format

Canonical skills use YAML frontmatter. Platform adapters in `.cursor/skills/`,
`.claude/skills/`, `.gemini/skills/`, `.github/skills/`, and `.agents/skills/`
are thin wrappers where the local matrix says they are supported.

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

Cursor adapter (`.cursor/skills/{name}/SKILL.md`): `name`/`description`
frontmatter + `Read and follow @.agent/skills/{name}/SKILL.md`. Native
Claude/Gemini/GitHub skill adapters use the same thin shape without additional
policy. Codex adapter (`.agents/skills/{name}/SKILL.md`): `name`/`description`
frontmatter + reads canonical path without `@`.

### Session-Entry Skills

Session workflows live as canonical skills. Commands and platform adapters
are thin wrappers.

- **start-right-quick** — the default session entry point. Read directives,
  memory, guiding questions, practice box, then apply session priority:
  (1) bugs first, (2) unfinished planned work second, (3) new work last.
- **start-right-thorough** — extends quick with domain context reading,
  metacognition, testing-strategy review, practice orientation, and an
  execution outline.
- **go** — mid-session re-grounding. Read directives, identify intent,
  structure the todo list with ACTION/REVIEW/GROUNDING cadence.

### Napkin (.agent/skills/napkin/SKILL.md)

The napkin is the capture stage of the learning loop. It is always active.

**Session start**: Read `.agent/memory/distilled.md` (if exists), then
`.agent/memory/napkin.md` (if exists; create if not).

**Continuous updates**: Write whenever you learn something worth
recording -- errors you figure out, user corrections, your own mistakes,
tool surprises, approaches that work or fail. Be specific: "Assumed API
returns list but it returns paginated object with `.items`" not "Made an
error."

**Structure**:

```markdown
## Session: YYYY-MM-DD -- Brief Title

### What Was Done

- {summary of work completed}

### Patterns to Remember

- {actionable insights}
```

Add `### Mistakes Made` or `### Corrections` subsections as needed.

**Rotation**: When the napkin exceeds ~500 lines, follow the distillation
step in the consolidation command (`consolidate-docs`).

### Distillation (consolidation step)

Extracts high-signal patterns from the napkin into `distilled.md` (target:
<200 lines). Protocol: extract actionable entries, merge against existing
content (add, skip duplicates, update refinements, investigate
contradictions), prune graduated entries, archive, start fresh. See
§Consolidation Workflow step 4.

### Reusable Patterns (.agent/memory/patterns/)

Reusable patterns proven by real work — code, process, architecture,
structural, behavioural, agent operational, and domain-specific. More
concrete than rules, more portable than source code.

**Barrier to entry**: a pattern belongs here only when it is (a) broadly
applicable or clearly reusable, (b) proven by implementation,
(c) protective against a recurring mistake, and (d) stable enough to teach
without immediate churn.

**File format**: one `.md` per pattern with YAML frontmatter:

```yaml
---
name: {Pattern Name}
use_this_when: {one sentence: when this pattern applies}
category: {code | architecture | process | testing | agent}
proven_in: {file path where pattern was first proven}
proven_date: {YYYY-MM-DD}
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: {failure mode prevented}
  stable: true
---
```

Body sections: **Principle** (one-paragraph statement), **Pattern**
(steps), **Anti-pattern** (what not to do), **When to Apply**
(trigger).

**Index**: maintain a `README.md` in `.agent/memory/patterns/` with a
short description for each pattern.

**Cross-repo exchange**: when a pattern is Practice-relevant and
cross-repo-applicable, copy it to
`.agent/practice-context/outgoing/patterns/` so it can travel with the
Practice Context exchange pack. Receiving repos apply the same three-part
bar as any other Practice material; adopted patterns move to local
`.agent/memory/patterns/`.

### Consolidation Workflow

The consolidation command drives the Knowledge Flow's graduation cycle. It
is the operational mechanism that converts captured experience into settled
Practice. Every repo adopting the Practice should implement a consolidation
command with the following abstract workflow:

1. **Verify documentation is current.** Architectural decisions, system
   behaviour, and technical reference should already be in permanent
   locations. Scan active and completed plans for residual content that
   describes how things work and move it to the appropriate permanent doc.
2. **Update plan statuses.** Ensure all plans and prompts reflect current
   state. Fix stale cross-references, especially after archive moves.
3. **Extract reusable patterns.** Review completed work for patterns that
   meet the barrier (see §Reusable Patterns). Covers all learning types.
4. **Rotate the napkin (distillation).** When the napkin exceeds ~500
   lines: extract high-signal entries, merge against `distilled.md`, prune
   graduated entries, archive the old napkin, start fresh. See
   §Distillation.
5. **Graduate settled content.** For each entry in `distilled.md`, apply
   two criteria: (a) **stable** — not contradicted by recent work,
   (b) **natural home** — an existing permanent doc where it belongs.
   Three outcomes: both met — graduate; stable but no natural home —
   raise with the user (the gap in documentation structure is the
   signal); not yet stable — leave for further validation. Fitness
   limits are a signal to action (step 6), never a reason to defer.
6. **Manage fitness thresholds** (see ADR-144). Two levels:
   - *Target exceeded* (warning): **refine** (compress, deduplicate),
     **split** (follow `split_strategy`), or **extend target** (agents
     may raise `fitness_line_target` modestly with rationale).
   - *Limit exceeded* (blocking): **refine** or **split** to get below
     the limit. Only the user may raise `fitness_line_limit`,
     `fitness_char_limit`, or `fitness_line_length`.
7. **Manage the practice exchange.** Two directions:
   - *Incoming*: integrate files from `.agent/practice-core/incoming/`
     following the provenance chain and three-part bar. Practice evolution
     is not linear — incoming can be behind in some areas and ahead in
     others. Compare bidirectionally. Clear the box only after user-
     approved integration, never unilaterally.
   - *Outgoing*: broadcast domain-specific observations and structural
     notes to `.agent/practice-context/outgoing/`. Content appropriate for
     Practice Core itself (Learned Principles, structural proposals,
     bootstrap improvements) goes as Core proposals with user approval.

## Platform Configuration

Each platform requires configuration files (e.g. Cursor's
`.cursor/environment.json` with `agentCanUpdateSnapshot: true`, and
`.cursor/settings.json` for plugins). These are platform-specific --
consult each platform's documentation and the Practice Core files for
adapter patterns.

## Bootstrap Checklist

After creating all files, validate:

1. `.agent/practice-core/` contains all seven Practice Core files
   (`practice.md`, `practice-lineage.md`, `practice-bootstrap.md`,
   `README.md`, `index.md`, `CHANGELOG.md`, `provenance.yml`) and
   `incoming/.gitkeep`. Optional `.agent/practice-context/` is not
   required; `incoming/` there is transient.
2. `.agent/practice-index.md` exists, all its links resolve, and its
   sections match the format specified above.
3. `AGENT.md` links to `.agent/practice-core/index.md`.
4. Every file path referenced in AGENT.md, rules, commands, and agents resolves.
5. Every agent's reading requirements point to files that exist.
6. `AGENTS.md` links to `AGENT.md`, which links to `principles.md` and `testing-strategy.md`.
7. The `start-right-quick` skill references all foundation documents.
8. The napkin rule points to a napkin skill that exists.
9. Quality gates (`type-check`, `lint`, `build`, `test`) are wired in `package.json`.
10. The project builds.
11. **Artefact portability**: canonical skills and commands in `.agent/`
    contain no platform-specific syntax. All platform adapters are thin
    wrappers. Validate adapter-to-canonical consistency (portability check
    script or manual review).
12. **Cohesion audit**: all Practice Core files are internally consistent,
    practice-index.md links resolve, and all broader Practice files
    (directives, rules, commands, skills) are aligned with the
    Core. No stale descriptions, no contradictions, no outdated wording.

## Post-Installation Health Check

After the Bootstrap Checklist passes, run this intent-level verification.
Structure alone does not guarantee a working Practice — shallow artefacts
look correct but fail silently. This check is mandatory, not optional.

1. **Metacognition verification** — read the metacognition directive. It
   must contain explicitly named layers (thoughts, reflections, insights),
   an affective break, and a grounding anchor. If any are missing, the
   directive has been reduced to a planning template — rewrite it from
   the reference in this file.
2. **Escape-hatch scan** — read rules and principles. Flag "where
   practical", "where possible", "when appropriate", "unless" — these
   turn mandatory rules into optional suggestions. Flag rules shorter
   than three lines with no reasoning — they are likely stubs.
3. **Reference resolution** — for every markdown link in directives,
   commands, and sub-agent templates, verify the target file exists.
   Silent degradation (correct-looking links to absent files) is worse
   than a missing artefact because it is invisible.
4. **Adapter completeness** — for every canonical rule in `.agent/rules/`,
   verify a corresponding adapter exists in each configured platform
   directory. Missing adapters mean rules do not fire on that platform.
   Record gaps in the surface matrix if one exists.
5. **Self-reflection** — run the metacognition directive on the
   integration itself. If it produces genuine insights, the integration
   is likely healthy. If it produces a summary of steps taken, the
   metacognition directive is probably broken (return to step 1).
