---
provenance: provenance.yml
fitness_line_target: 680
fitness_line_limit: 830
fitness_char_limit: 40500
fitness_line_length: 100
---

# Practice Bootstrap

This file completes the plasmid trinity. `practice.md` is the **what**,
`practice-lineage.md` the **why**, and this file the **how**: annotated
templates for every artefact type. Four companion files travel with the
trinity: `README.md`, `index.md`, `CHANGELOG.md`, and `provenance.yml`.
Templates use `{placeholders}` for project-specific content. The Practice uses
a **canonical-first artefact model**: substantive content lives in `.agent/`,
and thin platform adapters point back to it. Sections below use Cursor and
TypeScript/Node.js as examples — adapt them to local platforms and ecosystems.

## Before You Begin: Ecosystem Survey

**The templates and checklists below all serve a single goal: passing the
Fresh-Checkout Acceptance Criteria in
[practice-verification.md](practice-verification.md).**

The templates below use TypeScript/Node.js/Cursor conventions as concrete
examples. Before creating any artefacts, the hydrating agent MUST:

1. **Survey the existing repo**: language(s), test/lint/build stack,
   package manager, quality standards, and existing Practice
   infrastructure. Determine whether this is a cold start,
   augmentation, or restructuring.
2. **Assess alignment**: identify what the repo already has that meets or
   exceeds Practice principles.
3. **Adapt templates**: substitute local tooling in every template. File
   extensions (`*.unit.test.ts` becomes `*_test.go`, `test_*.py`, etc.),
   tool names (`Vitest` becomes `pytest`, `go test`, etc.), configuration
   formats, and platform conventions all change.
4. **Never overwrite**: preserve anything that already meets or exceeds
   the blueprint. These are adaptations, not deviations.
5. **Record deliberate omissions**: when a concept is intentionally not
   installed, record the absence in live operational surfaces
   (`practice-index.md`, `AGENT.md`) with rationale and conditions for
   future adoption. A broken reference is not proof of required
   restoration — check the changelog and execution surfaces first.
   Hydration is incomplete until adaptation decisions are written down.

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
| **Hooks**                    | `.agent/hooks/` (policy + README)  | Thin native activation in tracked platform config (for example `.claude/settings.json`, with gitignored local overrides where supported). Runtime in a repo-local script surface (`scripts/` or `tools/` as appropriate). Unsupported platforms stay explicit in the local matrix |

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
- **Reference** (`.agent/reference/`) — curated library tier:
  owner-vetted, evergreen, deliberately-promoted read-to-learn
  material. Promotion-gated per
  [PDR-032](decision-records/PDR-032-reference-tier-as-curated-library.md)
  (substantiate / justify / owner-vet). The default disposition for
  fresh material is NOT `reference/` — material is promoted INTO
  the tier from `research/`, `analysis/`, `reports/`, or active
  memory. Content here should not age quickly; an aging gate
  reviews retained material at each holistic-fitness pass.
- **Research** (`.agent/research/`) — synthesis-heavy notes, surveys,
  rationale trails, and disposition ledgers. The default landing
  tier for fresh exploratory material. May contain a transient
  `notes/` holding bay for material in transit between tiers (see
  [`research/notes/README.md`](../research/notes/README.md) when
  the bay exists). The split criterion vs `reference/` is curation:
  research is exploratory synthesis; reference is owner-vetted
  evergreen library.

A thin wrapper MUST NOT contain substantive instructions or logic not in
the canonical source. Add a portability validation script to the quality
gates to enforce this.

Where a repo supports multiple agent platforms, keep a local surface matrix
(e.g. `.agent/memory/executive/cross-platform-agent-surface-matrix.md`) recording
supported and unsupported mappings explicitly.

**Cross-platform integration order** — never reverse this sequence:

1. Decide which platforms are first-class in the receiving repo.
2. Install canonical surfaces: local bridge, memory, continuity host,
   planning scaffold, hook policy (if supported).
3. Write the local surface matrix with explicit states.
4. Add thin adapters and tracked platform config.
5. Add parity checks and health checks.

Activation before canonical source is a structural bug. The four-layer
authority hierarchy: canonical policy → native activation → repo-local
runtime → explanatory mirrors. Lower layers activate or describe; they
do not redefine higher-authority intent.

## Metacognition

Before planning work, pause.

Reflect on what you are about to do — those are your thoughts. Think about
those reflections — those are your insights. Consider what those insights
teach you about the original problem and your assumptions. How does that
change the framing? Why?

This costs nothing and prevents shallow execution. Apply before every
plan, architectural decision, and non-trivial implementation. Create as
`.agent/directives/metacognition.md` (universal — no project-specific
content).

**Critical**: Metacognition is a **technology**, not a checklist. The
directive must create recursive self-reflection through explicitly named
layers (thoughts → reflections → insights), with each layer's output
becoming the next layer's input. Common failure modes:

- **The "not even wrong" failure**: replacing the recursive prompt with
  a planning template. The result is not weakened metacognition — it is
  a different thing that prevents the depth it was meant to create.
  Planning templates produce plans; the metacognitive prompt produces
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

The Practice Index bridges the portable Practice Core and the local repo.
It is **not** part of the travelling package — created during hydration
and stays in the repo. Core files link to it via `../practice-index.md`.

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

## Architectural Decision Records (ADRs)

ADRs are the **graduation target** of the learning loop. When captured
experience (napkin → distilled) settles into a permanent architectural
decision, it becomes an ADR. ADRs are the architectural source of truth:
they record _why_ the system is shaped as it is, not just what it does.
Rules and directives operationalise ADRs; code implements them; quality
gates enforce them. Without ADR infrastructure, the learning loop has no
permanent destination for architectural knowledge.

### Location and Index

ADRs conventionally live in a dedicated directory (e.g.
`docs/architecture/architectural-decisions/`). Each is a numbered
markdown file. The directory contains a `README.md` index — the entry
point for architectural orientation, with a **Start Here** section
listing foundational ADRs.

### ADR Template

```markdown
# ADR-{NNN}: {Title}

**Status**: Proposed | Accepted | Superseded by ADR-{NNN} | Deprecated
**Date**: {YYYY-MM-DD}
**Related**: [ADR-{NNN}]({filename}) — {relationship}

## Context

{What situation or problem prompted this decision? What constraints
apply? What prior decisions does this build on?}

## Decision

{What was decided and why. Be specific enough that an agent or
engineer can determine whether code complies.}

## Consequences

{What follows from this decision — positive, negative, and neutral.
Include migration impact if replacing a prior approach.}
```

### Lifecycle

- **Proposed**: under discussion, not yet binding.
- **Accepted**: binding. Code, rules, and quality gates must comply.
- **Superseded**: replaced by a newer ADR. Keep the file; update status
  and link to the successor.
- **Deprecated**: no longer applicable (e.g. workspace removed).

### Connection to the Learning Loop

ADRs are created when a decision is significant enough to shape future
work. The consolidation workflow checks whether completed work produced
decisions that should be recorded. Custom lint rules can encode
ADR constraints as automated enforcement — graduating knowledge into
quality gates.

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

`.agents/` note: this repo keeps portable rule adapters in `.agents/rules/`
alongside `.agents/skills/` wrappers. Codex still picks up always-on
behaviour through the entry-point chain (`AGENTS.md` →
`.agent/directives/AGENT.md` → canonical rules). Reviewer roles should be
configured through Codex project-agent support in `.codex/`, not modelled as
skills.

## Sub-agents: Templates and Platform Adapters

Canonical sub-agent prompts live in `.agent/sub-agents/templates/*.md`
(platform-agnostic). Production apps use three-layer composition: shared
components → canonical templates → thin platform adapters. If the agent
layer is not yet installed, make that status explicit in `AGENT.md` and
the Practice bridge.

Platform adapters contain only activation metadata and a pointer to the
canonical template (see Artefact Model table for paths). Unsupported
platforms stay explicit in the local matrix.

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

Default portable roster. Local practices may add editorial, domain-specific,
or browser-facing specialists.

| Agent           | Specialisation                   | Key assessment areas                                                                                                                                                  |
| --------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `code-reviewer` | Gateway reviewer, always invoked | Correctness, edge cases, security, performance, readability, maintainability, test coverage. Triages to specialists.                                                  |
| `test-reviewer` | Test quality and TDD compliance  | Test classification (unit/integration), naming conventions, mock simplicity, test value, TDD evidence. Recommends deletion for tests that test mocks or types.        |
| `type-reviewer` | TypeScript type safety           | Type flow tracing, type widening detection, assertion usage, external boundary validation. Core principle: "why solve at runtime what you can embed at compile time?" |

## Commands: Canonical and Platform Adapters

Canonical commands in `.agent/commands/*.md` contain the substantive
workflow. Platform adapters use the `jc-*` prefix consistently and are
thin wrappers: Cursor `@` injection, Claude Code YAML + `$ARGUMENTS`,
Gemini TOML + `{{args}}`, Codex `.agents/skills/jc-*/SKILL.md` with
`name`/`description` frontmatter. Unsupported states belong in the local
surface matrix.

### Required Commands

| Command          | File                     | Core logic                                                                                                                                                                                                                             |
| ---------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| start-right      | `jc-start-right.md`      | Read and follow the start-right-quick skill.                                                                                                                                                                                           |
| session-handoff  | `jc-session-handoff.md`  | Refresh the continuity contract, close own collaboration claims, update decision threads, capture surprises, and escalate into `jc-consolidate-docs` only when due.                          |
| gates            | `jc-gates.md`            | Run `type-check -> lint -> build -> test`. All blocking; restart after any fix.                                                                                                                            |
| commit           | `jc-commit.md`           | Check status, review diff, verify gates, stage selectively, and use a conventional commit. Never force push, amend pushed commits, or use `--no-verify`.                                                                     |
| consolidate-docs | `jc-consolidate-docs.md` | Verify docs current. Graduate settled content. Extract patterns. Rotate napkin. Manage fitness. Integrate incoming Practice Box. Broadcast outgoing context. See §Consolidation Workflow. |
| plan             | `jc-plan.md`             | Read directives. Create plan with outcome, impact, value mechanism, acceptance criteria, risks, and non-goals.                                                                                                      |

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
Claude/Gemini/GitHub skill adapters use the same thin shape. Codex adapter
(`.agents/skills/{name}/SKILL.md`): `name`/`description` frontmatter + reads
the canonical path without `@`.

### Session-Entry Skills

Session workflows live as canonical skills. Commands and platform adapters
are thin wrappers.

- **start-right-quick** — the default session entry point. Read directives,
  memory, collaboration state, guiding questions, practice box, then apply session priority:
  (1) bugs first, (2) unfinished planned work second, (3) new work last.
- **start-right-thorough** — extends quick with domain context reading,
  metacognition, testing-strategy review, practice orientation,
  collaboration-overlap checks, and an execution outline.
- **go** — mid-session re-grounding. Read directives, identify intent,
  structure the todo list with ACTION/REVIEW/GROUNDING cadence.

### Continuity Contract

Session-entry skills depend on a live continuity surface. The following
contract defines what that surface must provide.

One explicit canonical host surface must carry the live continuity
contract. Typical hosts include a dedicated state file (e.g.
`.agent/memory/operational/repo-continuity.md`) or a section of a continuation prompt
— the choice is host-local. Whatever the host is, `go`, `session-handoff`,
and start-right must all point to it. The key rule: **if any workflow
references a continuity surface, that surface must exist on a fresh
checkout.** Hydration is incomplete until the host surface exists and
the workflows that reference it resolve.

Hosts that split the contract across multiple surfaces — canonical
contract, per-thread next-session record, tactical track cards — remain compliant
provided the authority order between them is explicit, each surface has a
single documented writer, and the contract fields are covered in aggregate.

The contract stays operational-only. The minimum field set is: active
threads, branch-primary thread next-session record, repo-wide invariants /
non-goals, next safe step, and deep-consolidation status. Hosts may add
epistemic-continuity fields (recent surprises, open questions) either
on the canonical contract or on a per-thread next-session record.

Keep ordinary continuity and deep convergence separate:

- `session-handoff` refreshes the continuity contract, syncs next-action
  surfaces, and captures surprises. It is cheap and runs every session.
- `consolidate-docs` owns graduation, pattern extraction, fitness management,
  and practice exchange. It runs only when its trigger checklist fires.

Surprise follows an explicit pipeline: capture → distil → graduate → enforce.
Surprise becomes durable only when it changes future behaviour and clears the
usual graduation bar.

### Napkin (.agent/skills/napkin/SKILL.md)

The napkin is the capture stage of the learning loop. It is always active.

**Session start**: Read `.agent/memory/active/distilled.md` (if exists), then
`.agent/memory/active/napkin.md` (if exists; create if not).

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

### Reusable Patterns — Two Homes

Patterns live in one of two homes depending on their level of
abstraction:

**`.agent/memory/active/patterns/`** — **Specific instances**. Concrete,
ecosystem-grounded patterns proven in this repo (TypeScript, Zod,
Vitest, MCP, or whichever ecosystem applies locally). Instance files
may carry a `related_pdr: PDR-NNN` or `related_pattern: <name>`
frontmatter pointer linking them to their general form (if one has
been authored).

**`.agent/practice-core/patterns/`** — **General abstract patterns**
(portable; travels with Core). Ecosystem-agnostic abstractions
synthesised from multiple specific instances. Authored fresh when
instance accumulation makes the general form legible across
multiple contexts. Specific instances remain in
`memory/active/patterns/`; they are not moved or copied.

**Barrier to entry for either home**: a pattern belongs as a
persisted entry only when it is (a) broadly applicable or clearly
reusable, (b) proven by implementation, (c) protective against a
recurring mistake, and (d) stable enough to teach without immediate
churn.

**Additional criteria for `practice-core/patterns/`**:
(e) ecosystem-agnostic — stated without dependence on any specific
language, framework, or toolchain; (f) engineering-substance, not
Practice-governance (Practice-governance patterns take PDR shape in
`practice-core/decision-records/`); (g) synthesised from ≥2 specific
instances.

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

**Index**: maintain a `README.md` in `.agent/memory/active/patterns/` with a
short description for each pattern.

**Cross-repo exchange**: portable patterns travel as Core content.
General, ecosystem-agnostic abstractions that apply across the
network are authored in `.agent/practice-core/patterns/` via
synthesis and travel with the Core package. Specific instances
remain in `.agent/memory/active/patterns/` as proof; they do not travel.
Under PDR-007, the previous `outgoing/patterns/` transport route is
retired — there is no separate exchange surface for patterns.

### Design-Space Explorations (docs/explorations/ or host equivalent)

Explorations are durable option-weighing documents that sit between
session observations (napkin) and committed decisions (ADRs). They are
not refinement of napkin entries; they are research-shaped design-space
analyses that inform which ADR to write or which plan to promote. An
exploration may remain `active` indefinitely if the question is not yet
ripe — that is acceptable. An exploration that has reached a
conclusion but has not graduated to ADR or plan is not.

**Home**: host-repo convention is `docs/explorations/` at the top of
the documentation tree, with a README defining the shape. Alternative
locations are valid provided the tier is named explicitly in the host
repo's practice-index.

**Filename convention**: `YYYY-MM-DD-<kebab-slug>.md`. The date prefix
preserves chronological order without requiring metadata reads.

**Required frontmatter**:

```yaml
---
title: {Title}
date: YYYY-MM-DD
status: active                       # or informed-adr-<N> / informed-plan-<name> /
                                     # superseded-by-<ref> / undecided-pending-<trigger>
---
```

**Document shape**:

1. **Frontmatter** as above.
2. **Problem statement** — what's under exploration and why now.
3. **Options considered** — each with pros, cons, evidence, failure modes.
4. **Research questions still open** — what we don't yet know.
5. **Informs** — the ADR / plan / decision this feeds into if known.
6. **References** — external sources cited.

**Relationship to other tiers**: napkin captures observations;
explorations weigh options; ADRs commit decisions; plans execute. The
exploration survives as the evidence trail the ADR or plan cites; it
does not substitute for either. A single session may produce multiple
explorations as different research questions surface; each gets its
own timestamped file.

**When to create one**: whenever design-space work requires more
durability than a napkin entry but is not yet ready to commit to a
decision. Trigger examples: "should we dual-export to a second
telemetry backend?"; "what's the event schema shape data scientists
actually need?"; "how far does vendor X take us across these axes
before we hit a gap?"

**When NOT to create one**: routine implementation decisions with
obvious right answers; session-internal observations (use the napkin);
committed decisions (use an ADR); execution instructions (use a plan).

**Cross-repo exchange**: explorations are typically too host-specific
to travel verbatim, but the _shape_ of explorations is portable — an
outgoing broadcast describing the explorations tier (problem, home,
frontmatter, document shape, relationship to other tiers) is a
legitimate Practice Context contribution.

### Transplant Manifest (exploration variant)

Wholesale Practice transplantation (PDR-005) uses a specialised
exploration: the **transplant manifest**. It is authored in the
destination repo's `docs/explorations/` before any file is copied
from the source repo.

Filename: `YYYY-MM-DD-transplant-from-<source-repo>.md`.

Additional frontmatter field:

```yaml
status: transplant-in-progress
                            # or transplant-completed / transplant-aborted
```

Body sections:

1. **Problem statement** — which source repo; why transplant rather
   than cold-start; what the destination expects to inherit.
2. **Gradient classification** — a table with one row per source
   file or file-group:

   | Source path | Gradient | Destination path | Adaptation note |
   |---|---|---|---|
   | `.agent/directives/principles.md` | portable-with-adaptation | same | rewrite test-framework references; keep universal rules verbatim |
   | `.agent/practice-index.md` | local | create-from-scratch | bridge file is host-specific by design |
   | `.agent/memory/active/distilled.md` | hybrid | same | preserve universal entries; drop source-repo-domain entries |
   | `docs/architecture/ADR-XXX-*.md` | hybrid | rewrite | decision shape portable; decision substance host-specific |
   | ... | ... | ... | ... |

   Gradient values: **fully-portable** / **portable-with-adaptation**
   / **hybrid** / **local** / **rejected** (with rationale).
3. **Research questions** — ambiguous rows where classification
   requires owner input.
4. **Execution plan** — the order in which rows are processed;
   typically fully-portable first, then portable-with-adaptation,
   then hybrid, then local.
5. **Four-audit close** — a checklist recording that each audit has
   been performed and passed:
   - Foreign-antigen audit (grep for source-repo names, paths, ADR
     numbers; all hits resolved or documented).
   - Completeness audit (every source concept has a destination
     representative or is recorded as intentionally omitted).
   - Cohesion audit (no self-contradictions in the destination
     Practice).
   - Manifest-closure audit (every row reached a completed or
     explicitly-rejected state).
6. **Informs** — the destination's practice-index, the destination's
   `CHANGELOG.md` entry, any new PDRs the transplantation surfaced.

The manifest is retained permanently in the destination's
`docs/explorations/` — it is the reasoning trail for the
destination's initial Practice shape and the record future agents
use to understand why certain adaptations were made.

### Consolidation Workflow

The consolidation command drives the Knowledge Flow's graduation cycle —
converting captured experience into settled Practice. Every repo should
implement a consolidation command with this abstract workflow:

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
6. **Manage fitness thresholds** (three-zone model, ADR-144). Fitness
   is a post-writing health signal, never a learning constraint.
   Write, capture, distil, and graduate at the weight the signal deserves,
   then deal with zones here. Each metric lands in `healthy` → `soft` →
   `hard` → `critical`, where critical is `hard limit × 1.5`.
   - `soft`: refine, split, or extend target (modestly, with rationale).
     Never blocks.
   - `hard`: refine, split, graduate, or raise with owner approval.
     Treat the validator failure as a signal to route structural work;
     do not roll back or suppress preserved learning.
   - `critical`: loop failure. Preserve the learning, open a remediation
     lane, and run the three-question post-mortem from ADR-144 §Loop Health.
7. **Manage the practice exchange.** Two directions:
   - _Incoming_: integrate files from `.agent/practice-core/incoming/`
     following the provenance chain and three-part bar. Practice evolution
     is not linear — incoming can be behind in some areas and ahead in
     others. Compare bidirectionally. Clear the box only after user-
     approved integration, never unilaterally.
   - _Outgoing_: broadcast domain-specific observations and structural
     notes to `.agent/practice-context/outgoing/`. Content appropriate for
     Practice Core itself (Learned Principles, structural proposals,
     bootstrap improvements) goes as Core proposals with user approval.
     All outgoing content must carry the **concept itself** — not a
     pointer to where this repo documents it. No ADR numbers, no local
     paths. The substance must be understandable without the source repo.

## Platform Configuration

Treat platform config like source code: tracked project settings define the
shared agentic contract, gitignored local settings carry user-specific
overrides. Each platform has a tracked/local pair (e.g.
`.claude/settings.json` + `.claude/settings.local.json`), plus
`.codex/config.toml` and a local override only if documented.

Tracked settings carry required permissions, hook activation, plugin state,
and fresh-checkout affordances. Local settings carry paths, one-off
permissions, and machine-specific wiring. The most dangerous failure mode is
silent: wrappers exist but the platform refuses to run them because
permissions were never granted in tracked config. Portability checks must
verify authorisation parity, not just wrapper presence. Normal operation
must not depend on gitignored local settings.

## Verification

After building, verify. See
[practice-verification.md](practice-verification.md) for the full
verification sequence: structural checklist, intent-level health check,
minimum operational estate, claimed/installed/activated audit, and
fresh-checkout acceptance criteria.
