---
provenance:
  - index: 0
    repo: oak-open-curriculum-ecosystem
    date: 2026-02-26
    purpose: 'Production SDK ecosystem: curriculum SDK, MCP servers, semantic search, 13 specialist reviewers, full learning loop'
  - index: 1
    repo: cloudinary-icon-ingest-poc
    date: 2026-02-26
    purpose: 'Short-lived POC: build-time SVG icon ingestion from Cloudinary, 3 reviewers, simplified gates'
  - index: 2
    repo: oak-open-curriculum-ecosystem
    date: 2026-02-27
    purpose: 'Production SDK ecosystem: adopted Practice Core structure, trinity concept, and bootstrap from round-trip'
  - index: 3
    repo: oak-open-curriculum-ecosystem
    date: 2026-02-28
    purpose: 'Ecosystem-agnostic hydration: labelled ecosystem-specific content, added cold-start path, aligned consolidation with concurrent documentation principle'
  - index: 4
    repo: new-cv
    date: 2026-03-06
    purpose: 'Personal website and CV: editorial voice, accessibility, single-developer workflow with learning loop'
  - index: 5
    repo: new-cv
    date: 2026-03-09
    purpose: 'Personal website and CV: value-traceability planning and Practice Core structural tightening'
  - index: 6
    repo: oak-open-curriculum-ecosystem
    date: 2026-03-09
    purpose: 'Production SDK ecosystem: integrated new-cv round-trip — Codex model, value traceability, six-file package, practice-context adjunct, napkin threshold 800→500, 16 specialist reviewers'
  - index: 7
    repo: castr
    date: 2026-03-09
    purpose: 'IR-based schema transformation library: integrated portable Practice Core into a mature local doctrine via clean-break principles naming, canonical-first restructuring, knowledge-flow installation, and paused-workstream lifecycle'
fitness_ceiling: 320
attribution: 'created by [Jim Cresswell](https://www.jimcresswell.net/), evolved by many people and agents in many repos'
---

# Practice Lineage

This is the canonical lineage document for this repo's Practice. It serves two purposes: (1) the reference for how the plasmid exchange mechanism works, and (2) the source template for outbound propagation.

When propagating the Practice to another repo, copy all six Practice Core files: the trinity (`practice.md`, this file, and `practice-bootstrap.md`), the entry points (`README.md` and `index.md`), and the changelog (`CHANGELOG.md`). If `.agent/practice-context/outgoing/` exists, relevant files may be copied into the receiving repo's `.agent/practice-context/incoming/` as optional support material, but they are not part of the Core. The provenance chain in the trinity frontmatter is already set — the receiving repo appends its own entry when it evolves the files. See §Frontmatter and §Plasmid Exchange below.

## Frontmatter

All three trinity files (`practice.md`, `practice-lineage.md`, and `practice-bootstrap.md`) **always** carry YAML frontmatter with provenance and fitness metadata — not just when travelling between repos. The files can be copied at any time by anyone (human or agent), so the frontmatter must be complete and accurate at all times.

### Provenance

The `provenance` array records every repo that has evolved the file, in order. Each entry is a snapshot of one iteration:

| Field     | Required | Description                                                                                                                                                                          |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `index`   | Yes      | Position in the chain. 0 is the origin.                                                                                                                                              |
| `repo`    | Yes      | Repository name.                                                                                                                                                                     |
| `date`    | Yes      | Date this iteration was created or last evolved.                                                                                                                                     |
| `purpose` | Yes      | Statement of local purpose — what the Practice is being used for in this repo. Not a category tag; a description that tells receiving repos what kind of work shaped this evolution. |

The chain serves three functions:

1. **Origin tracking**: index 0 is where the Practice was first created.
2. **Evolution detection**: a receiving repo checks the last entry's `repo` — if it differs from the local repo name, the file has been evolved elsewhere and may carry new learnings.
3. **Context for comparison**: the `purpose` field tells the receiving repo what kind of work produced the incoming learnings, helping assess relevance.

When a repo evolves the files, it appends a new entry with the next index, its repo name, the current date, and its purpose.

### Other fields

| Field             | Purpose                                                       |
| ----------------- | ------------------------------------------------------------- |
| `fitness_ceiling` | Soft line-count ceiling for the file. See §Fitness Functions. |

## The Practice Blueprint

The blueprint below encodes the condensed core of the Practice. It is sufficient to grow a new Practice in an empty repo, or to transmit structural advantages to an existing one. Adapt everything to local context; copy nothing blindly.

### Principles

The First Question: **could it be simpler without compromising quality?** Apply it every time. The answer is often no, and that is fine.

The universal rules:

- **TDD always.** Write the test first. Red (prove it fails), Green (make it pass), Refactor (improve the implementation while behaviour remains proven). This is non-negotiable at all levels: unit, integration, end-to-end.
- **Pure functions first.** No side effects, no I/O. Design for testability.
- **Fail fast with helpful errors.** Never silently. Never ignored.
- **Result pattern.** `Result<T, E>` for error handling. Handle all cases explicitly. Do not throw.
- **No type shortcuts.** No `as` (except `as const`), no `any`, no `!`, no `Record<string, unknown>`. Preserve type information; never widen.
- **Keep it strict.** DRY, KISS, YAGNI, SOLID. Don't invent optionality. Don't add fallback options.
- **No dead code.** Unused code, skipped tests, commented-out code: delete it. Version with git, not with names.
- **Never disable checks.** No disabling lints, type checks, formatting, tests, or git hooks. Fix the root cause.
- **Validate at boundaries.** External data is unknown until parsed and validated.

### Metacognition

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
- Each test must prove something useful about product code. Tests that test mocks, test code, or types are waste -- delete them.
- **Unit test**: a single pure function in isolation. No mocks, no I/O. Naming convention varies by ecosystem (e.g. `*.unit.test.ts` in TypeScript, `test_*.py` in Python, `*_test.go` in Go).
- **Integration test**: units working together as code (not a running system). Simple mocks/fakes injected as parameters only. No global state manipulation. Naming convention varies by ecosystem.
- **Prohibited**: global state manipulation in tests -- environment variable mutation, global mock injection, module cache manipulation, or any mechanism that creates hidden coupling between tests. Pass configuration as function arguments.

### Agent Pattern

The Practice can use specialist sub-agents for review. When a repo installs a reviewer layer, the minimum viable roster is **code-reviewer** (gateway -- correctness, security, performance, test coverage; triages to specialists), **test-reviewer** (classification, mock simplicity, TDD compliance; recommends deletion for tests that test mocks or types), and **type-reviewer** (type flow tracing, widening detection; "why solve at runtime what you can embed at compile time?"). Each reads directives first, applies the First Question, and reports with severity levels and actionable fixes. A repo may stage this layer after the Core itself is installed; until then, `AGENT.md` should say explicitly that reviewer infrastructure is not yet installed.

For production, expand: security-reviewer, config-reviewer, architecture-reviewer(s). Use layered composition (wrapper -> template -> shared components) at scale; inline for short-lived projects.

### Workflow Commands

The Practice is driven by slash commands that initiate structured workflows:

- **start-right** -- Ground yourself: read the directives (AGENT.md -> principles -> testing-strategy), understand the project context, ask the guiding questions (right problem? right layer? could it be simpler? what assumptions?), commit to the work, discuss the first step with the user.
- **gates** -- Run quality gates in order: `type-check -> lint -> build -> test`. All gates are blocking at all times.
- **review** -- Run gates, triage which specialists are needed, invoke them, consolidate findings into a single report with verdict.
- **commit** -- Conventional commit workflow with quality gates as pre-check.
- **consolidate-docs** -- Verify documentation is current (decisions should already be in ADRs/docs from when they were made), extract any remaining plan content to permanent locations, update status markers, check the Practice Box, audit cohesion (Practice Core internal consistency, Practice Index links, broader Practice alignment), consider Practice evolution (apply the bar from this lineage doc).
- **plan** -- Read directives. Create plan with explicit outcome, impact, value mechanism, acceptance criteria, risk assessment, and non-goals.
- **think** -- Structured thinking without acting.
- **step-back** -- Reflection on approach and assumptions.
- **go** -- Quick grounding: read AGENT.md, read principles, check task list, proceed.

### Always-Applied Rules

These are lightweight rules that fire on every agent interaction. The activation mechanism is platform-specific — see `practice-bootstrap.md` §Rules for the canonical-first model and platform adapter formats:

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

### The Knowledge Flow

The knowledge flow is the Practice's central mechanism. See [practice.md §The Knowledge Flow](practice.md#the-knowledge-flow) for the full treatment: the cycle diagram, three-audience model, fitness functions at every stage, and feedback properties.

The condensed cycle: **Capture** (napkin, always on) → **Refine** (distilled, periodic) → **Graduate** (permanent docs, on consolidation) → **Enforce** (rules & directives, always on) → **Apply** (work) → repeat. Each stage serves a broader audience: the napkin serves the current session, distilled serves future agents, permanent docs serve everyone. Each transition raises the bar.

The flow has two critical properties for propagation:

1. **Self-replicating**: the knowledge flow is part of the Practice, which travels via plasmid exchange. A receiving repo inherits the mechanism that produces rules, not just the rules themselves. This means every repo that adopts the Practice immediately has a working learning loop — it doesn't need to invent one.

2. **Self-applicable**: the rules that enforce the Practice are themselves subject to the same evolution process. If consolidation reveals that a rule is wrong, the rule can change — but only if the change clears the three-part bar. The Practice is a ratchet, not a pendulum.

### Prompts

**Prompts** (`.agent/prompts/`) are reusable playbooks. The `start-right` prompt is the session entry point: read directives, understand context, ask guiding questions, commit. Prompts are not part of the learning loop -- they are how the Practice is applied at the start of a session.

## Adaptation Levels

**POC (days to weeks)**: Inline agents. Simplified gates. No layered composition, no ADR infrastructure, no full learning loop. Metacognition and napkin retained. 3 agents: code-reviewer, test-reviewer, type-reviewer.

**Production (months to years)**: Layered agent architecture. Full specialist roster. Learning loop (napkin -> distilled -> rules). ADR infrastructure. Full quality gate sequence.

## How the Practice Evolves

Most session learnings go into the napkin. That is the default.

The Practice itself changes only when a learning is **structural**. The bar:

1. **Validated by real work?** Speculation doesn't clear the bar.
2. **Would its absence cause a recurring mistake?** If it's "nice to know," it stays in the napkin.
3. **Stable?** If you expect it to change again soon, it's not ready. The Practice is a ratchet, not a pendulum.

The `jc-consolidate-docs` command includes a step to consider Practice evolution. That is the natural trigger point.

## Fitness Functions

The Practice has negative feedback for what enters (the three-part bar), but without a governor on cumulative growth each addition clears the bar while the files quietly bloat. The plasmid exchange mechanism amplifies this: improvements flow between repos, each exchange potentially adding but never compressing.

### Thresholds

| File                    | Ceiling    | Rationale                                                                         |
| ----------------------- | ---------- | --------------------------------------------------------------------------------- |
| `practice.md`           | ~250 lines | System map including the knowledge flow. Readable in one sitting.                 |
| `practice-lineage.md`   | ~320 lines | Complete portable blueprint with transmission dimension. Readable in one sitting. |
| `practice-bootstrap.md` | ~400 lines | Annotated templates for every artefact type. Comprehensive but still one sitting. |

These are soft ceilings, not hard limits. Exceeding them triggers tightening; it does not block work. The `jc-consolidate-docs` command checks these during every consolidation pass.

### Beyond the Trinity

Fitness functions extend to all key documents in the knowledge flow cycle. Agent-facing documents (directives, memory files) and contributor-facing documents (governance, troubleshooting, CONTRIBUTING) carry `fitness_ceiling` and `split_strategy` in their YAML frontmatter. Only shallow-browsing entry points (root README, quickstart, VISION) are exempt — to avoid scaring casual browsers. The consolidation command (step 8) checks all ceilings alongside the trinity.

### Tightening Process

When a file exceeds its ceiling: identify grown sections, merge overlapping principles, remove examples that have served their teaching purpose, compress while preserving coverage. Present tightened versions to the user before committing. Tightening is distillation applied at the file level -- "what can be said more concisely without losing meaning?"

## Plasmid Exchange

The Practice is not hierarchical. Each repo carries its own Practice instance, adapted to its own context. The portable part of it travels as the Practice Core: the plasmid trinity — `practice.md` (the what), `practice-lineage.md` (the why), and `practice-bootstrap.md` (the how) — plus the entry points `README.md` (for humans) and `index.md` (for agents), and the changelog (`CHANGELOG.md`). Optional support material may also travel from a sender's `.agent/practice-context/outgoing/` into a receiver's `.agent/practice-context/incoming/`.

### The Practice Box

Every repo with a Practice has a canonical location for incoming material: **`.agent/practice-core/incoming/`** (the Practice Box). This directory is normally empty (with a `.gitkeep`). When Practice Core files arrive from another repo, they are placed here.

The Practice Box is checked at two points:

1. **Session start** (via the `start-right` prompt) — alert the user if files are present.
2. **Consolidation** (via the `jc-consolidate-docs` command step 8) — perform the full integration flow.

### Integration Flow

When Practice Core files appear in the Practice Box:

1. **Check the provenance chain.** Read the `provenance` array in the frontmatter. If the last entry's `repo` differs from the local repo name, the file has been evolved elsewhere and may carry new learnings. If the last entry matches the local repo, the file has not been evolved since it left — there is nothing new to integrate.
2. **Read it.** Read the changelog for a summary of what changed since the last provenance entry matching the local repo. Then read the full files — and `.agent/practice-context/README.md` plus `incoming/` if they exist — to understand what they learned and why. The `purpose` field in each provenance entry tells you what kind of work shaped the evolution — use this to assess relevance to the local context.
3. **Compare** with the local Practice and Lineage. Identify differences — not just in the lineage doc, but across the full Practice system (directives, rules, skills, commands, prompts). Ask: does the incoming version reveal principles that the local Practice implements implicitly but hasn't named? Does the compression reveal what's essential versus contextual?
4. **Apply the same bar.** Does the incoming learning meet the structural-change criteria for _this_ repo? (Validated by real work? Prevents recurring mistakes? Stable?)
5. **Propose changes** to the user. Be specific: which files across the Practice would change and why.
6. **On approval, apply.** Update Practice, Lineage, rules, skills, commands, prompts, or directives as warranted.
7. **Record what was taken** in the napkin (for traceability, not attribution).
8. **Audit cohesion.** (a) Check that all Practice Core files (`practice.md`, `practice-lineage.md`, `practice-bootstrap.md`, `index.md`, `README.md`, `CHANGELOG.md`) are internally consistent -- no contradictions, no stale descriptions, no missing cross-references between them. (b) Check that `.agent/practice-index.md` links resolve and are consistent with the updated Core. (c) Check that broader Practice files throughout the repo (directives, rules, skills, commands, prompts) are aligned with the updated Core -- no outdated wording, no missing references, no contradictions with the new content. This step catches drift that individual edits miss.
9. **Clear transient exchange material.** Remove the incoming files. If `.agent/practice-context/incoming/` exists, clear its received files and working notes. Local `outgoing/` may remain. The integration is complete.

If nothing clears the bar, record that in the napkin too — the incoming material was reviewed and found not applicable to this context. That is a valid outcome.

The Practice Core package (`practice.md`, `practice-lineage.md`, `practice-bootstrap.md`, `README.md`, `index.md`, `CHANGELOG.md`) is itself a plasmid. It can be carried to any repo. The receiving repo applies its own bar.

## Growing a Practice from This Blueprint

**Effort heuristic**: in the first real migration, roughly a third of Practice files were fully portable (zero edits), a third needed selective editing (universal core with domain-specific sections to remove), and a third needed complete rewrite or deletion. The mixed tier is the most labour-intensive — it requires line-by-line judgement about what is universal and what is local. Budget accordingly.

### Restructuring an Existing Practice

When the target repo has a mature Practice (platform-locked or otherwise), survey existing Practice topology first (see `practice-bootstrap.md` §Ecosystem Survey): commands, skills, rules, agents, memory pipeline, prompts — not just language and tooling. Determine the hydration path: cold start (no Practice — follow steps below), augmentation (partial Practice — fill gaps), or restructuring (mature but platform-locked — convert to canonical-first).

For restructuring: create canonical versions in `.agent/` first, convert platform files to thin adapters second, update references third. Existing mechanisms that exceed the blueprint — specialised reviewers, editorial systems, domain-specific sub-agents — are adaptations, not deviations. Preserve and integrate them.

1. Create the directory structure: `.agent/directives/`, `.agent/practice-core/` (with `incoming/.gitkeep`), `.agent/plans/`, `.agent/prompts/`, `.agent/memory/`, and platform adapter directories as needed (see `practice-bootstrap.md` §The Artefact Model for the full list — e.g. `.cursor/rules/`, `.claude/rules/`, `.agents/skills/`, `.codex/`). If the Practice Core files were received from another repo, they should already include `index.md`, `README.md`, and `CHANGELOG.md` alongside the trinity; if `.agent/practice-context/incoming/` exists, read it; if building from scratch, create the required files (see `practice-bootstrap.md` for templates).
2. Write `AGENT.md` in `.agent/directives/` as a stable structural index: project context, artefacts, rules pointer, sub-agent roster, development commands, repo structure. Link to `.agent/practice-core/index.md` for the full Practice. No mutable state.
3. Write `principles.md` encoding the Principles above, adapted to local tooling.
4. Write `testing-strategy.md` encoding the Testing Philosophy above, with local test targets.
5. Write `metacognition.md` from the condensed version in `practice-bootstrap.md` (it is universal).
6. Follow `practice-bootstrap.md` for the remaining artefacts: sub-agent definitions, workflow commands, rules, start-right prompt, and skills (napkin, distillation). For each artefact type, create the canonical content in `.agent/` first, then add thin platform adapters. The bootstrap file provides annotated templates and format specifications for every artefact type.
7. **Practice Core files.** If building from scratch: write all six files in `.agent/practice-core/` — the trinity (`practice.md`, this lineage doc, `practice-bootstrap.md`) each with YAML frontmatter (`provenance` array with index 0 entry, `fitness_ceiling`), plus `README.md` (human entry point), `index.md` (agent entry point), and `CHANGELOG.md`. Add initial learned principles to the lineage doc. If received from another repo: the six files already exist — append a new provenance entry to each trinity file with the new repo name, date, and purpose. The README, index, and changelog are generic and should not need changes beyond appending a new changelog entry.
8. **Create `.agent/practice-index.md`** — the bridge file that carries navigable links from the Practice Core to the local repo's artefacts. The Practice Core references it via `../practice-index.md`. Use the template in `practice-bootstrap.md`, populating every section with the local repo's actual directives, ADRs, commands, skills, and directories. This file is NOT part of the travelling package — it stays in the repo.
9. **Validate**: every file reference in every directive, agent, command, and rule resolves. Every agent's first-action file exists. The repo builds. See the Bootstrap Checklist in `practice-bootstrap.md`.
10. **Audit cohesion.** Check that all Practice Core files are internally consistent, that `.agent/practice-index.md` links resolve, and that all broader Practice files (directives, rules, skills, commands, prompts) are aligned with the Core. Contradictions, stale descriptions, and outdated wording degrade silently -- the Practice will appear complete while subtly misdirecting.

## Validation

After growing or propagating the Practice, verify that nothing is **silently broken**. The most dangerous failure mode is not missing files — it is files that look correct but whose internal references don't resolve. Agents will proceed with no review methodology, directives will point to non-existent docs, commands will invoke non-existent prompts. Nothing errors; everything quietly degrades.

1. **Reference check** — every file path in directives, agents, commands, and rules resolves.
2. **Practice Index check** — `.agent/practice-index.md` exists, all its links resolve, and its sections match the format in `practice-bootstrap.md`.
3. **Agent check** — each agent's first-action file reference exists.
4. **Build check** — `type-check`, `lint`, `build` all pass.
5. **Stable-index check** — `AGENT.md` and `AGENTS.md` contain no mutable session state.
6. **Cohesion check** — all Practice Core files are internally consistent, practice-index.md links resolve, and broader Practice files (directives, rules, commands, prompts, skills) are aligned with the Core content. No stale descriptions, no contradictions, no outdated wording.

### Validation scripts

Reference check (rough — does not handle relative paths from referencing file's location, `@`-prefixed Cursor references, or paths inside code blocks). Adapt `.cursor/` to your local platform adapter directories:

```bash
# Adapt .cursor/ to your platform adapter directories (.claude/, .agents/, .codex/, etc.)
rg -o '\./[^\s\)]+\.md' .agent/ .cursor/ --no-filename | sort -u | while read ref; do
  path="${ref#./}"
  if [ ! -f "$path" ]; then
    echo "BROKEN: $ref"
  fi
done
```

Self-containment check (verifies the Practice Core has no external links except the permitted bridge to `../practice-index.md`; strips code-fenced blocks first to avoid false positives from templates):

````bash
for f in .agent/practice-core/*.md; do
  awk '/^```/{skip=!skip; next} !skip{print}' "$f" \
    | rg -n '\]\(\.\.\/' \
    | rg -v 'practice-index\.md' \
    && echo "VIOLATION: $f has external links outside code fences"
done
````

Agent dependency check:

```bash
# Adapt .cursor/agents/ to your platform's agent adapter directory
for agent in .cursor/agents/*.md; do
  rg 'read.*\.agent/' "$agent" --no-filename | while read line; do
    ref=$(echo "$line" | rg -o '`[^`]+`' | tr -d '`')
    if [ -n "$ref" ] && [ ! -f "$ref" ]; then
      echo "BROKEN AGENT: $(basename $agent) references $ref"
    fi
  done
done
```

A proper implementation would be integrated into the quality gate sequence.

## Learned Principles

Principles discovered through Practice propagation and evolution. These have cleared the bar.

- **Separate universal from domain-specific at the file level.** When rules about TDD live in the same file as rules about a specific schema, portability requires line-by-line editing.
- **Silent degradation is the worst failure mode.** Agents, directives, and commands can all look correct while silently failing because their internal references don't resolve. An agent whose first instruction is "read a file that doesn't exist" will proceed with no review methodology and produce plausible but ungrounded output. This is worse than a hard error. Validation scripts (see above) catch this class of failure.
- **Intentional repetition aids discoverability but hinders portability.** Repeating a rule in many files means many files to edit when porting. A single source of truth referenced from other files preserves discoverability while reducing surface.
- **Stable indexes, mutable plans.** `AGENT.md` is a structural map. It must not carry session state. Mutable state (active plans, priorities, progress) belongs in the plans directory.
- **If a behaviour must be automatic, it needs a rule, not just a skill.** Skills are documentation — they describe what to do but depend on being discovered and invoked. Always-applied rules fire on every interaction. The learning loop's capture stage (napkin) must be enforced by a rule to be genuinely always-on.
- **Plasmids need a provenance chain, not just an origin.** A file that only records where it was created will be rejected by its origin repo as "already mine." The provenance array records every repo that has evolved the file; the last entry tells the receiving repo whether the file has been somewhere new. Without it, the plasmid exchange mechanism silently fails.
- **Documentation is concurrent, not retrospective.** ADRs and README updates produced during work stay accurate and contextual. Documentation deferred to consolidation loses context, goes stale, or never gets written. Consolidation should verify documentation is current, not extract it.
- **Plans need value traceability, not just activity.** A plan that names tasks and even impacts but cannot explain the outcome it seeks and the mechanism by which that outcome creates value is still under-framed. This gap causes mechanism-first work and late discovery that only a narrow slice of the intended problem was being solved.
- **Understand local norms before hydrating.** The Practice is ecosystem-agnostic in principle. When hydrating into a new repo, the integrating agent MUST survey the local language(s), test runners, linters, package managers, and existing quality standards BEFORE creating any Practice artefacts. The Practice enables excellence; it does not replace what has already been achieved.
- **Fitness functions at every stage of knowledge flow.** Ephemeral memory (napkin, distilled) has size constraints, but so must permanent docs. Without ceilings, the consolidation cycle simply moves unbounded growth downstream. Documents in the knowledge flow carry `fitness_ceiling` and `split_strategy` in YAML frontmatter — only shallow-browsing entry points (root README, quickstart, VISION) are exempt. The response to hitting a ceiling is splitting by responsibility, not compression — the goal is discoverability, not density.
- **Practice Core files must be self-contained.** The Practice Core files may reference each other freely, but must not contain navigable markdown links to files outside `practice-core/` — with one exception: `../practice-index.md`, the bridge file that the Practice Core specifies and the hydration process creates. All other external paths appear as code-formatted text (e.g. `.agent/directives/AGENT.md`) to describe what should exist or where artefacts live. Links like `[AGENT.md](../directives/AGENT.md)` break when the files travel. The Practice Index is local to each repo and carries the navigable links to that repo's artefacts; transient exchange context belongs in adjacent `.agent/practice-context/`.
- **Paused is not future.** Mature repos sometimes need an intermediate home for incomplete but non-primary workstreams. A paused area preserves resumable execution context without polluting `active/` or misclassifying the work as speculative future backlog.
