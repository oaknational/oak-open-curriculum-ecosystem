---
provenance: provenance.yml
fitness_line_target: 550
fitness_line_limit: 725
fitness_char_limit: 32000
fitness_line_length: 100
---

# Practice Lineage

This is the canonical lineage document for this repo's Practice. It serves two purposes: (1) the
reference for how the plasmid exchange mechanism works, and (2) the source template for outbound
propagation.

When propagating the Practice to another repo, copy all seven Practice Core files: the trinity
(`practice.md`, this file, and `practice-bootstrap.md`), the entry points (`README.md` and
`index.md`), the changelog (`CHANGELOG.md`), and the provenance file (`provenance.yml`). If
`.agent/practice-context/outgoing/` exists, relevant files may be copied into the receiving repo's
`.agent/practice-context/incoming/` as optional support material, but they are not part of the Core.
See §Frontmatter and §Plasmid Exchange below.

## Frontmatter

The trinity files carry YAML frontmatter with `provenance` (pointer to
`provenance.yml`) and four fitness thresholds (ADR-144):
`fitness_line_target` (soft), `fitness_line_limit` (hard),
`fitness_char_limit` (hard), `fitness_line_length` (hard, always 100).
All measure content only — frontmatter excluded. See §Fitness Functions.

### Provenance (provenance.yml)

Per-file provenance chains live in `provenance.yml`, which travels with the Core package. Each file
has its own chain because the files may have evolved independently in early history. Each entry
records:

| Field     | Description                                                                            |
| --------- | -------------------------------------------------------------------------------------- |
| `index`   | Position in the chain. 0 is the origin.                                                |
| `repo`    | Repository name.                                                                       |
| `date`    | Date this iteration was created or last evolved.                                       |
| `purpose` | What the Practice is being used for — tells receiving repos what shaped this evolution. |

The chain tracks origin (index 0), evolution (last `repo` differs →
new learnings), and context (`purpose` describes what shaped the
evolution). Evolving repos append new entries to `provenance.yml`.

**Caveat**: a higher `index` does not imply superiority across all dimensions. Repos evolve
independently; always compare content, not indices, when integrating incoming material.

## The Practice Blueprint

The blueprint below encodes the condensed core of the Practice. It is sufficient to grow a new
Practice in an empty repo, or to transmit structural advantages to an existing one. Adapt everything
to local context; copy nothing blindly.

### Principles

The First Question: **could it be simpler without compromising quality?** Apply it every time. The
answer is often no, and that is fine.

The universal rules:

- **TDD always.** Write the test first. Red (prove it fails), Green (make it pass), Refactor
  (improve the implementation while behaviour remains proven). This is non-negotiable at all levels:
  unit, integration, end-to-end.
- **Pure functions first.** No side effects, no I/O. Design for testability.
- **Fail fast with helpful errors.** Never silently. Never ignored.
- **Result pattern.** `Result<T, E>` for error handling. Handle all cases explicitly. Do not throw.
- **No type shortcuts.** No `as` (except `as const`), no `any`, no `!`, no
  `Record<string, unknown>`. Preserve type information; never widen.
- **Strict and complete, everywhere, all the time.** Prefer explicit, total,
  fully checked systems over permissive, partial, or hand-wavy ones. Do not
  invent optionality, fallback options, or implied enforcement.
- **No dead code.** Unused code, skipped tests, commented-out code: delete it. Version with git, not
  with names.
- **Never disable checks.** No disabling lints, type checks, formatting, tests, or git hooks. Fix
  the root cause.
- **Validate at boundaries.** External data is unknown until parsed and validated.
- **Architectural excellence over expediency.** Always choose long-term architectural clarity over
  short-term convenience. If a shortcut creates duplication across architectural layers, it is not a
  shortcut — it is debt that compounds silently through drift.
- **Apps are thin; libraries own domain logic.** In a multi-package architecture, apps are user
  interfaces that compose library/SDK capabilities. Apps never reimplement domain logic that a
  library already provides. The test: "could another consumer need this?" If yes, it belongs in a
  shared package. Violations cause silent drift — the library gets tuned but the app's copy does
  not.

### Metacognition

Metacognition is the activation mechanism — the process that transforms rules into understanding.
Without genuine depth here, the Practice can be structurally complete yet inert (see §Practice
Maturity, §Learned Principles).

Before planning work, pause:

> Think hard -- those are your thoughts.
> Reflect deeply on those thoughts -- those are your reflections.
> Consider those reflections -- those are your insights.
>
> How do your insights change how you see what you have done, what you are
> doing, and what you will do? What has changed? Why? Would you do anything
> differently? What is the bridge from outcome to impact to value?

This process is universal. It costs nothing and prevents shallow execution.

### Testing Philosophy

- Test **behaviour**, never implementation.
- Test to **interfaces**, not internals.
- Each test must prove something useful about product code. Tests that test mocks, test code, or
  types are waste -- delete them.
- Use the **correct proof layer**. Strictness in testing means proving the full
  behaviour contract tests own, not stealing type, lint, formatting, import,
  or tracked-repo concerns from the tools that should prove those instead.
- **Unit test**: a single pure function in isolation. No mocks, no I/O. Naming convention varies by
  ecosystem (e.g. `*.unit.test.ts` in TypeScript, `test_*.py` in Python, `*_test.go` in Go).
- **Integration test**: units working together as code (not a running system). Simple mocks/fakes
  injected as parameters only. No global state manipulation. Naming convention varies by ecosystem.
- **Prohibited**: global state manipulation in tests -- environment variable mutation, global mock
  injection, module cache manipulation, or any mechanism that creates hidden coupling between tests.
  Pass configuration as function arguments.
- **Browser proof surfaces** (UI projects): accessibility audit (WCAG
  compliance), visual regression, responsive validation, theme/mode
  correctness. These are proof layers for rendered output — analogous
  to the unit/integration distinction for code — not replacements.

### Agent Pattern

The Practice can use specialist sub-agents for review. When a repo installs a reviewer layer, the
minimum viable roster is **code-reviewer** (gateway -- correctness, security, performance, test
coverage; triages to specialists), **test-reviewer** (classification, mock simplicity, TDD
compliance; recommends deletion for tests that test mocks or types), and **type-reviewer** (type
flow tracing, widening detection; "why solve at runtime what you can embed at compile time?"). Each
reads directives first, applies the First Question, and reports with severity levels and actionable
fixes. A repo may stage this layer after the Core itself is installed; until then, `AGENT.md` should
say explicitly that reviewer infrastructure is not yet installed.

For production, expand: security-reviewer, config-reviewer,
architecture-reviewer(s). For UI-heavy projects, consider
accessibility-reviewer and design-system-reviewer; the gateway
code-reviewer triages to them. Use layered composition at scale;
inline for short-lived projects.

### Workflow Commands

The Practice is driven by slash commands that initiate structured workflows:

- **start-right-quick** -- Default session entry point. Read directives (AGENT.md,
  principles, testing-strategy, metacognition), read memory files, ask guiding
  questions (right problem? right layer? simpler? assumptions?), check the
  Practice Box, apply session priority (bugs first, unfinished work second,
  new work last), discuss the first step with the user.
- **start-right-thorough** -- Deep session grounding. Run start-right-quick
  first, then read domain context (current/README.md, relevant plans), apply
  metacognition, review testing strategy, read Practice orientation, and draft
  an execution outline with key risks.
- **go** -- Mid-session re-grounding with structured execution. Read directives
  and memory, identify the current plan and declare intent, apply session
  priority, then structure the todo list with ACTION/REVIEW/GROUNDING cadence:
  every action followed by a review step, periodic grounding re-reads, and
  holistic reviews every fourth cycle.
- **gates** -- Run quality gates in order: `type-check -> lint -> build ->
  test`. All gates are blocking at all times.
- **review** -- Run gates, triage which specialists are needed, invoke them,
  consolidate findings into a single report with verdict.
- **commit** -- Conventional commit workflow with quality gates as pre-check.
- **consolidate-docs** -- Verify documentation is current (decisions should
  already be in ADRs/docs from when they were made), extract any remaining
  plan content to permanent locations, update status markers, check the
  Practice Box, audit cohesion (Practice Core internal consistency, Practice
  Index links, broader Practice alignment), consider Practice evolution
  (apply the bar from this lineage doc).
- **plan** -- Read directives. Create plan with explicit outcome, impact,
  value mechanism, acceptance criteria, risk assessment, and non-goals.
- **think** -- Structured thinking without acting.
- **step-back** -- Reflection on approach and assumptions.

### Always-Applied Rules

These are lightweight rules that fire on every agent interaction. The activation mechanism is
platform-specific — see `practice-bootstrap.md` §Rules for the canonical-first model and platform
adapter formats:

- Read AGENT.md at session start
- Read the Practice index at session start
- Read and write to the napkin continuously (ensures the learning loop's capture stage is always on)
- TDD at all levels
- No type shortcuts
- Fail fast with helpful errors
- Never disable checks
- No skipped tests
- Don't suppress warnings with naming conventions -- fix the root cause
- All quality gate issues are blocking
- Result pattern for errors
- No global state in tests
- Where the reviewer layer is installed, invoke code reviewers after non-trivial changes
- Apps are thin interfaces; never duplicate domain logic from libraries/SDKs
- Architectural excellence over expediency — no cross-layer shortcuts

### The Knowledge Flow

The knowledge flow is the Practice's central mechanism. See
[practice.md §The Knowledge Flow](practice.md#the-knowledge-flow) for the full treatment: the cycle
diagram, three-audience model, fitness functions at every stage, and feedback properties.

The condensed cycle: **Capture** (napkin, always on) → **Refine** (distilled, periodic) →
**Graduate** (permanent docs, on consolidation) → **Enforce** (rules & directives, always on) →
**Apply** (work) → repeat. Each stage serves a broader audience: the napkin serves the current
session, distilled serves future agents, permanent docs serve everyone. Each transition raises the
bar.

The flow has two critical properties: **self-replicating** (the
mechanism travels via plasmid exchange — receiving repos inherit the
learning loop, not just its outputs) and **self-applicable** (rules
are subject to the same evolution process; changes require the
three-part bar).

### Session-Entry Skills

**Session-entry skills** (`.agent/skills/start-right-quick/`, `.agent/skills/start-right-thorough/`,
`.agent/skills/go/`) are the canonical session workflows. The `start-right-quick` skill is the
default entry point: read directives, ask guiding questions, and align on the
next step. Session skills are not part of the learning loop — they are how the
Practice is applied at session start.

## Adaptation Levels

**POC (days to weeks)**: Inline agents. Simplified gates. No layered composition, no ADR
infrastructure, no full learning loop. Metacognition and napkin retained. 3 agents: code-reviewer,
test-reviewer, type-reviewer.

**Production (months to years)**: Layered agent architecture. Full specialist roster. Learning loop
(napkin -> distilled -> rules). ADR infrastructure. Full quality gate sequence.

## Practice Maturity

Adaptation levels describe *scope*; maturity levels describe *depth*. A Production-scope
installation can be at Level 1. Use these to diagnose Practice health.

| Level | Name                  | Signals                                                    | Failure mode                        |
| ----- | --------------------- | ---------------------------------------------------------- | ----------------------------------- |
| 1     | **Structural**        | Files present, references resolve                          | Looks right, nothing works          |
| 2     | **Operational**       | Directives have depth, sub-agents function                 | Works but doesn't self-correct      |
| 3     | **Self-Correcting**   | Metacognition genuine, consolidation catches drift          | Corrects but doesn't evolve         |
| 4     | **Evolving**          | Lineage captures principles, context processed             | Evolves without selection pressure   |

Target **Level 3** before declaring integration complete.

## How the Practice Evolves

Most session learnings go into the napkin. That is the default.

The Practice itself changes only when a learning is **structural**. The bar:

1. **Validated by real work?** Speculation doesn't clear the bar.
2. **Would its absence cause a recurring mistake?** If it's "nice to know," it stays in the napkin.
3. **Stable?** If you expect it to change again soon, it's not ready. The Practice is a ratchet, not
   a pendulum.

The `jc-consolidate-docs` command includes a step to consider Practice evolution. That is the
natural trigger point.

## Fitness Functions

The three-part bar governs what enters but not cumulative growth. Without
fitness limits, files bloat — compounded by plasmid exchange adding content
across repos.

### Thresholds (Two-Threshold Model — ADR-144)

Four fitness fields govern each tracked file. All measure content only
(frontmatter excluded). Width applies to prose only (code blocks, tables,
frontmatter excluded).

| Frontmatter key        | Threshold | What it guards                                  |
| ---------------------- | --------- | ----------------------------------------------- |
| `fitness_line_target`  | Soft      | Content lines — signal to refine; agents may extend modestly |
| `fitness_line_limit`   | Hard      | Content lines — cannot exceed without user approval          |
| `fitness_char_limit`   | Hard      | Content characters — honest volume (ungameable)              |
| `fitness_line_length`  | Hard      | Prose line width — readability and diff quality; always 100  |

Target exceedance warns; limit exceedance blocks. Only the user may raise
hard limits. The four fields form a constraint triangle — gaming one
dimension (fewer lines via reflowing) triggers another (characters or
width). All governed files carry all four fields. Only shallow entry
points (root README, quickstart, VISION) are exempt.

### Growth Governance

Two sections within the trinity have their own fitness governors:

- **Provenance** (`provenance.yml`) — unconstrained. The per-file evolution chains grow with each
  repo visit but live in a separate metadata file, outside the content-line budget.
- **Learned Principles** (this file, §Learned Principles) — governed by tiering. Mature principles
  (validated across 3+ repos) promote to **axiom** tier (one-line statement). Recent principles stay
  in **active** tier with full teaching narrative. Promotion happens during consolidation.

### Tightening Process

When a file exceeds its ceiling: merge overlapping principles, remove
spent examples, compress while preserving coverage. Present tightened
versions to the user before committing.

## Plasmid Exchange

The Practice is not hierarchical. Each repo carries its own Practice instance, adapted to its own
context. The portable part of it travels as the Practice Core: the plasmid trinity (`practice.md`,
`practice-lineage.md`, `practice-bootstrap.md`), entry points (`README.md`, `index.md`), changelog
(`CHANGELOG.md`), and provenance file (`provenance.yml`). Optional support material may also travel
from a sender's `.agent/practice-context/outgoing/` into a receiver's
`.agent/practice-context/incoming/`.

### The Practice Box

Every repo with a Practice has a canonical location for incoming material:
**`.agent/practice-core/incoming/`** (the Practice Box). This directory is normally empty (with a
`.gitkeep`). When Practice Core files arrive from another repo, they are placed here.

The Practice Box is checked at two points:

1. **Session start** (via `start-right-quick`) — alert the user if files are present.
2. **Consolidation** (via the `jc-consolidate-docs` command step 8) — perform the full integration
   flow.

### Integration Flow

When Practice Core files appear in the Practice Box:

1. **Check the provenance chain.** Read `provenance.yml`. If the last entry's `repo` for any file
   differs from the local repo name, the file has been evolved elsewhere and may carry new
   learnings. If the last entry matches the local repo, there is nothing new to integrate.
2. **Read it.** Read the changelog for a summary of what changed since the last provenance entry
   matching the local repo. Then read the full files — and `.agent/practice-context/README.md` plus
   `incoming/` if they exist — to understand what they learned and why. The `purpose` field in each
   provenance entry tells you what kind of work shaped the evolution — use this to assess relevance
   to the local context.
3. **Compare** with the local Practice and Lineage. Identify differences — not just in the lineage
   doc, but across the full Practice system (directives, rules, skills, commands). Ask:
   does the incoming version reveal principles that the local Practice implements implicitly but
   hasn't named? Does the compression reveal what's essential versus contextual?
4. **Apply the same bar.** Does the incoming learning meet the structural-change criteria for *this*
   repo? (Validated by real work? Prevents recurring mistakes? Stable?)
5. **Propose changes** to the user. Be specific: which files across the Practice would change and
   why.
6. **On approval, apply.** Update Practice, Lineage, rules, skills, commands, or directives as
   warranted.
7. **Record what was taken** in the napkin (for traceability, not attribution).
8. **Audit cohesion.** (a) Check that all Practice Core files (`practice.md`, `practice-lineage.md`,
   `practice-bootstrap.md`, `index.md`, `README.md`, `CHANGELOG.md`, `provenance.yml`) are
   internally consistent — no contradictions, no stale descriptions, no missing cross-references.
   (b) Check that `.agent/practice-index.md` links resolve. (c) Check that broader Practice files
   (directives, rules, skills, commands) are aligned with the updated Core.
9. **Clear transient exchange material.** Remove the incoming files. If
   `.agent/practice-context/incoming/` exists, clear its received files and working notes. Local
   `outgoing/` may remain. The integration is complete.

If nothing clears the bar, record that in the napkin too — the
incoming material was reviewed and found not applicable to this
context. That is a valid outcome.

**Two-way merge**: when the local Practice has also evolved since the
last common ancestor, start from the incoming files (they carry
cumulative evolution as a coherent whole) and merge local additions
back. Verify by diffing backup against result. Fitness checks are
mandatory — two-way merges frequently push files over their ceilings.

### Pattern Exchange

Proven patterns (`.agent/memory/patterns/`) may travel alongside the
Practice Core as optional Practice Context — exchange context, one
step beyond the outgoing notes.

- **Sender**: copy Practice-relevant, cross-repo-applicable patterns
  to `.agent/practice-context/outgoing/patterns/`. The consolidation
  command's pattern-extraction step is the natural trigger.
- **Receiver**: incoming patterns land in
  `.agent/practice-context/incoming/patterns/`. Apply the same
  three-part bar. Adopted patterns move to local
  `.agent/memory/patterns/`; rejected ones are recorded in the napkin.
- **Format**: self-contained `.md` with YAML frontmatter. See
  `practice-bootstrap.md` §Reusable Patterns for the template.

## Growing a Practice from This Blueprint

**Effort heuristic**: in the first real migration, roughly a third of Practice files were fully
portable (zero edits), a third needed selective editing (universal core with domain-specific
sections to remove), and a third needed complete rewrite or deletion. The mixed tier is the most
labour-intensive — it requires line-by-line judgement about what is universal and what is local.
Budget accordingly.

### Restructuring an Existing Practice

When the target repo has a mature Practice (platform-locked or otherwise), survey existing Practice
topology first (see `practice-bootstrap.md` §Ecosystem Survey): commands, skills, rules, agents,
memory pipeline — not just language and tooling. Determine the hydration path: cold start
(no Practice — follow steps below), augmentation (partial Practice — fill gaps), or restructuring
(mature but platform-locked — convert to canonical-first).

For restructuring: create canonical versions in `.agent/` first, convert platform files to thin
adapters second, update references third. Existing mechanisms that exceed the blueprint —
specialised reviewers, editorial systems, domain-specific sub-agents — are adaptations, not
deviations. Preserve and integrate them.

1. Create the directory structure: `.agent/directives/`, `.agent/practice-core/` (with
   `incoming/.gitkeep`), `.agent/plans/`, `.agent/skills/`, `.agent/memory/`, and platform adapter
   directories as needed (see `practice-bootstrap.md` §The Artefact Model for the full list — e.g.
   `.cursor/rules/`, `.claude/rules/`, `.agents/skills/`, `.codex/`). If the Practice Core files
   were received from another repo, they should already include `index.md`, `README.md`, and
   `CHANGELOG.md` alongside the trinity; if `.agent/practice-context/incoming/` exists, read it; if
   building from scratch, create the required files (see `practice-bootstrap.md` for templates).
2. Write `AGENT.md` in `.agent/directives/` as a stable structural index: project context,
   artefacts, rules pointer, sub-agent roster, development commands, repo structure. Link to
   `.agent/practice-core/index.md` for the full Practice. No mutable state.
3. Write `principles.md` encoding the Principles above, adapted to local tooling.
4. Write `testing-strategy.md` encoding the Testing Philosophy above, with local test targets.
5. Write `metacognition.md` from the condensed version in `practice-bootstrap.md` (it is universal).
6. Follow `practice-bootstrap.md` for the remaining artefacts: sub-agent definitions, workflow
   commands, rules, and skills (start-right, napkin). For each artefact type,
   create the canonical content in `.agent/` first, then add thin platform adapters. The bootstrap
   file provides annotated templates and format specifications for every artefact type.
7. **Practice Core files.** If building from scratch: write all seven files in
   `.agent/practice-core/` — the trinity (`practice.md`, this lineage doc, `practice-bootstrap.md`)
   each with YAML frontmatter (`provenance: provenance.yml`, `fitness_line_target`,
   `fitness_line_limit`, `fitness_char_limit`, `fitness_line_length`), plus `README.md`,
   `index.md`, `CHANGELOG.md`, and
   `provenance.yml` (with an index-0 entry per trinity file). If received from another repo: the
   seven files already exist — append a new entry to each file's chain in `provenance.yml`.
8. **Create `.agent/practice-index.md`** — the bridge file that carries navigable links from the
   Practice Core to the local repo's artefacts. The Practice Core references it via
   `../practice-index.md`. Use the template in `practice-bootstrap.md`, populating every section
   with the local repo's actual directives, ADRs, commands, skills, and directories. This file is
   NOT part of the travelling package — it stays in the repo.
9. **Validate**: every file reference in every directive, agent, command, and rule resolves. Every
   agent's first-action file exists. The repo builds. See the Bootstrap Checklist in
   `practice-bootstrap.md`.
10. **Audit cohesion.** Check that all Practice Core files are internally consistent,
    that `.agent/practice-index.md` links resolve, and that broader Practice files
    (directives, rules, skills, commands) are aligned with the Core. Contradictions
    and stale descriptions degrade silently.

## Validation

After growing or propagating the Practice, verify that nothing is **silently broken**. The most
dangerous failure mode is not missing files — it is files that look correct but whose internal
references don't resolve. Agents will proceed with no review methodology, directives will point to
non-existent docs, commands will invoke non-existent skills. Nothing errors; everything quietly
degrades.

1. **Reference check** — every file path in directives, agents, commands, and rules resolves.
2. **Practice Index check** — `.agent/practice-index.md` exists, all its links resolve, and its
   sections match the format in `practice-bootstrap.md`.
3. **Agent check** — each agent's first-action file reference exists.
4. **Build check** — `type-check`, `lint`, `build` all pass.
5. **Stable-index check** — `AGENT.md` and `AGENTS.md` contain no mutable session state.
6. **Cohesion check** — all Practice Core files are internally consistent, practice-index.md links
   resolve, and broader Practice files (directives, rules, commands, skills) are aligned with the
   Core content. No stale descriptions, no contradictions, no outdated wording.

### Validation scripts

Rough portable checks — adapt platform adapter paths (`.cursor/` etc.) to local platforms. A proper
implementation integrates these into the quality gate sequence.

```bash
# Reference check (does not handle relative paths, @-prefixed refs, or paths in code blocks)
rg -o '\./[^\s\)]+\.md' .agent/ .cursor/ --no-filename | sort -u | while read ref; do
  [ ! -f "${ref#./}" ] && echo "BROKEN: $ref"; done

# Self-containment check (no external links from Practice Core except ../practice-index.md)
for f in .agent/practice-core/*.md; do
  awk '/^```/{s=!s;next}!s{print}' "$f" | rg -n '\]\(\.\.\/' | rg -v 'practice-index\.md' \
    && echo "VIOLATION: $f"; done

# Agent dependency check
for a in .cursor/agents/*.md; do rg -o '`\.agent/[^`]+`' "$a" | tr -d '`' | while read r; do
  [ -n "$r" ] && [ ! -f "$r" ] && echo "BROKEN AGENT: $(basename $a) -> $r"; done; done
```

## Learned Principles

Principles discovered through Practice propagation and evolution. These have cleared the three-part
bar. Two tiers: **axioms** are deeply internalised across repos and need no elaboration; **active
principles** are recent or carry teaching narrative that receiving repos benefit from reading in
full. Promotion from active to axiom happens during consolidation when a principle has been
validated across 3+ repos.

### Axioms

- **Separate universal from domain-specific at the file level.**
- **Silent degradation is the worst failure mode.** References that don't resolve produce plausible
  but ungrounded output — worse than a hard error.
- **Intentional repetition aids discoverability but hinders portability.**
- **Stable indexes, mutable plans.** `AGENT.md` is a structural map; mutable state belongs in plans.
- **If a behaviour must be automatic, it needs a rule, not just a skill.**
- **Plasmids need a provenance chain, not just an origin.** See `provenance.yml`.
- **Documentation is concurrent, not retrospective.**
- **Plans need value traceability, not just activity.**
- **Understand local norms before hydrating.**
- **Fitness functions at every stage of knowledge flow.** Ceilings trigger splitting by
  responsibility, not compression.
- **Practice Core files must be self-contained.** No navigable links outside `practice-core/` except
  `../practice-index.md`. All other external paths as code-formatted text.
- **Paused is not future.**
- **Agent files are first-class infrastructure.** They are executable agent code in markdown —
  subject to DRY, SOLID, and production-code rigour.
- **Portable does not mean symmetrical.** Support only evidenced platform mappings.

### Active Principles

- **Metacognition is a technology, not a checklist.** The directive creates recursive
  self-reflection through named layers (thoughts → reflections → insights), an affective break, and
  a grounding anchor. Each layer's output is explicitly the next layer's input. Replacing this with
  a planning template destroys the mechanism entirely — the result is a different thing that
  prevents the depth it was meant to create.
- **Intent over mechanics.** Vague language in rules creates escape hatches that agents will walk
  through. Every directive must carry enough reasoning that an agent understands not just what to
  do, but why it matters and what failure looks like.
- **The recursive failure mode.** When the metacognition tool is broken, you cannot use
  metacognition to discover that it's broken. Detection requires external comparison.
- **Exchange context works best as an indexed support pack.** Index
  `.agent/practice-context/outgoing/` and separate by responsibility.
- **The `.agents/skills/` layer is a cross-platform discovery surface.** It should contain only thin
  wrappers — zero substantive duplication.
- **Repo-state enforcement needs its own proof layer.** Tests prove behaviour; repo-audit proves
  infrastructure state. Don't collapse them.
- **Four kinds of truth.** Portable Core doctrine, repo-local canon, executable enforcement, and
  exchange context. Conflating any two degrades the others.
- **Entry surfaces degrade by default.** All entry surfaces must move together when a tranche
  completes.
- **RED-first applies to repo-state enforcement.** Prove the failure first, then fix the
  infrastructure.
- **Session workflows must be state-free.** Session-entry skills must not carry
  per-session content (specific plan names, tranche status). They reference
  plan-discovery surfaces and let those own mutable state.
- **Architectural excellence over expediency.** Always choose long-term clarity
  over short-term convenience. Proven by CLI-SDK retriever drift in
  oak-mcp-ecosystem: duplicate builders carried stale config, producing
  different search results. ~500 lines deleted, Layer Role Topology codified.
- **Apps are thin; libraries own domain logic.** Apps compose library/SDK
  capabilities. They never reimplement domain logic a library provides. The
  test: "could another consumer need this?" Violations cause silent drift.
- **Provenance is storytelling, not credit.** The provenance chain records the
  knowledge journey, not ownership. Every repo that shaped the evolution appears
  because we are here to collaborate, not compete.
