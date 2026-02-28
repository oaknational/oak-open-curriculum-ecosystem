---
provenance:
  - index: 0
    repo: oak-open-curriculum-ecosystem
    date: 2026-02-26
    purpose: "Production SDK ecosystem: curriculum SDK, MCP servers, semantic search, 13 specialist reviewers, full learning loop"
  - index: 1
    repo: cloudinary-icon-ingest-poc
    date: 2026-02-26
    purpose: "Short-lived POC: build-time SVG icon ingestion from Cloudinary, 3 reviewers, simplified gates"
  - index: 2
    repo: oak-open-curriculum-ecosystem
    date: 2026-02-27
    purpose: "Production SDK ecosystem: adopted practice-core structure, trinity concept, and bootstrap from round-trip"
  - index: 3
    repo: oak-open-curriculum-ecosystem
    date: 2026-02-28
    purpose: "Ecosystem-agnostic hydration: labelled ecosystem-specific content, added cold-start path, aligned consolidation with concurrent documentation principle"
fitness_ceiling: 300
attribution: "created by [Jim Cresswell](https://www.jimcresswell.net/), evolved by many agents in many repos"
---

# Practice Lineage

This is the canonical lineage document for the oak-open-curriculum-ecosystem Practice. It serves two purposes: (1) the reference for how the plasmid exchange mechanism works, and (2) the source template for outbound propagation.

When propagating the Practice to another repo, copy the trinity: `practice.md`, this file, and `practice-bootstrap.md`. The provenance chain in the frontmatter is already set — the receiving repo appends its own entry when it evolves the files. See §Frontmatter and §Plasmid Exchange below.

## Frontmatter

All three trinity files (`practice.md`, `practice-lineage.md`, and `practice-bootstrap.md`) **always** carry YAML frontmatter with provenance and fitness metadata — not just when travelling between repos. The files can be copied at any time by anyone (human or agent), so the frontmatter must be complete and accurate at all times.

### Provenance

The `provenance` array records every repo that has evolved the file, in order. Each entry is a snapshot of one iteration:

| Field | Required | Description |
|---|---|---|
| `index` | Yes | Position in the chain. 0 is the origin. |
| `repo` | Yes | Repository name. |
| `date` | Yes | Date this iteration was created or last evolved. |
| `purpose` | Yes | Statement of local purpose — what the Practice is being used for in this repo. Not a category tag; a description that tells receiving repos what kind of work shaped this evolution. |

The chain serves three functions:

1. **Origin tracking**: index 0 is where the Practice was first created.
2. **Evolution detection**: a receiving repo checks the last entry's `repo` — if it differs from the local repo name, the file has been evolved elsewhere and may carry new learnings.
3. **Context for comparison**: the `purpose` field tells the receiving repo what kind of work produced the incoming learnings, helping assess relevance.

When a repo evolves the files, it appends a new entry with the next index, its repo name, the current date, and its purpose.

### Other fields

| Field | Purpose |
|---|---|
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
> How do your insights change how you see what you have done, what you are doing, and what you will do? What has changed? Why? Would you do anything differently? What is the bridge from action to impact?

This process is universal. It costs nothing and prevents shallow execution.

### Testing Philosophy

- Test **behaviour**, never implementation.
- Test to **interfaces**, not internals.
- Each test must prove something useful about product code. Tests that test mocks, test code, or types are waste -- delete them.
- **Unit test**: a single pure function in isolation. No mocks, no I/O. Naming convention varies by ecosystem (e.g. `*.unit.test.ts` in TypeScript, `test_*.py` in Python, `*_test.go` in Go).
- **Integration test**: units working together as code (not a running system). Simple mocks/fakes injected as parameters only. No global state manipulation. Naming convention varies by ecosystem.
- **Prohibited**: global state manipulation in tests -- environment variable mutation, global mock injection, module cache manipulation, or any mechanism that creates hidden coupling between tests. Pass configuration as function arguments.

### Agent Pattern

The Practice uses specialist sub-agents for review. The minimum viable roster is three:

**code-reviewer** (gateway) -- always invoked after non-trivial changes. Assesses correctness, edge cases, security, performance, readability, maintainability, and test coverage. Enforces TDD evidence. Triages to specialists. Output: verdict (approved / approved with suggestions / changes requested), critical issues, improvements, positive observations, specialist coverage check.

**test-reviewer** -- invoked when tests are added or modified. Classifies tests (unit vs integration), verifies naming conventions, checks mock simplicity (unit: no mocks; integration: simple injected mocks only), assesses test value (does it prove product behaviour?), checks TDD compliance. Recommends deletion for tests that only test mocks or types.

**type-reviewer** -- invoked when types, generics, or type flow change. Traces type flow from origin (data, validated input) through the system. Checks for type widening, assertions, `any`, non-null assertions. Core principle: "why solve at runtime what you can embed at compile time?"

Each agent: states its identity, reads the directives first (AGENT.md, rules, testing-strategy), applies the First Question, reports in a structured format with severity levels, provides specific actionable fixes.

For a production app, expand the roster: security-reviewer, config-reviewer, architecture-reviewer(s), docs-reviewer. The POC profile keeps only the three above.

A layered composition system (wrapper -> template -> shared components) is more maintainable at scale than inlined agents. For short-lived projects, inline. For long-lived projects, layer.

### Workflow Commands

The Practice is driven by slash commands that initiate structured workflows:

- **start-right** -- Ground yourself: read the directives (AGENT.md -> rules -> testing-strategy), understand the project context, ask the guiding questions (right problem? right layer? could it be simpler? what assumptions?), commit to the work, discuss the first step with the user.
- **gates** -- Run quality gates in order: `type-check -> lint -> build -> test`. All gates are blocking at all times.
- **review** -- Run gates, triage which specialists are needed, invoke them, consolidate findings into a single report with verdict.
- **commit** -- Conventional commit workflow with quality gates as pre-check.
- **consolidate-docs** -- Verify documentation is current (decisions should already be in ADRs/docs from when they were made), extract any remaining plan content to permanent locations, update status markers, check the practice box, consider Practice evolution (apply the bar from this lineage doc).
- **plan** -- Read directives. Create plan with YAML frontmatter, acceptance criteria, risk assessment, non-goals.
- **think** -- Structured thinking without acting.
- **step-back** -- Reflection on approach and assumptions.
- **go** -- Quick grounding: read AGENT.md, read rules, check task list, proceed.

### Always-Applied Rules

These are lightweight rules that fire on every agent interaction (in Cursor, `.mdc` files with `alwaysApply: true`):

- Read AGENT.md at session start
- Read the Practice index at session start
- Read and write to the napkin continuously (ensures the learning loop's capture stage is always on)
- TDD at all levels
- No type shortcuts
- Fail fast with helpful errors
- Never disable checks
- No skipped tests
- No unused-variable underscore prefixes
- All quality gate issues are blocking
- Result pattern for errors
- No global state in tests
- Invoke code reviewers after non-trivial changes

### The Learning Loop

The napkin, distillation, consolidation, and Practice evolution are not independent features. They are stages of a single feedback loop:

```text
Work -> Capture -> Refine -> Settle -> Enforce -> Apply -> Work
```

**Capture** (always on): The napkin (`.agent/memory/napkin.md`) records mistakes, corrections, surprises, and patterns continuously during every session. It is always active -- not triggered by a command. Read it at session start; write to it as you work. Everything that would change behaviour next session goes here.

**Refine** (periodic): When the napkin exceeds ~800 lines, the distillation skill extracts high-signal entries into `distilled.md` -- a curated rulebook of actionable patterns, under 200 lines. The outgoing napkin is archived and a fresh one starts. Entries in `distilled.md` that have matured into permanent documentation (rules, docs, practice) are pruned. This prevents unbounded growth: the intermediate buffer only holds what has not yet settled.

**Settle** (on consolidation): The `consolidate-docs` command verifies that documentation produced during work is current and complete, extracts anything remaining from plans to permanent locations (`docs/`, source TSDoc, READMEs), extracts reusable code patterns to `.agent/memory/code-patterns/` (abstract principles proven by implementation), and considers whether any learning warrants an update to the Practice or Lineage themselves. This is the graduation step -- where a pattern moves from "specialist refinement" to "settled practice." Code patterns occupy the middle ground: too concrete for rules, too abstract for source code.

**Enforce** (always on): Always-applied rules (`.cursor/rules/*.mdc`) fire on every agent interaction. They encode the Practice's current state: TDD, type safety, fail fast, invoke reviewers, read directives at session start. When the Practice evolves, the rules update. Next session, agents inherit the evolved state automatically.

**Apply**: Agents read the directives at session start (because the `read-agent-md` rule fires), apply the rules, use the workflow commands, and do work. That work produces new learnings, and the loop repeats.

The loop has two feedback properties:

- **Positive**: learnings that prove valuable propagate upward (napkin -> distilled -> docs/rules -> practice/lineage). Each stage amplifies what works.
- **Negative**: the three-part bar for Practice changes (validated? prevents recurring mistakes? stable?) acts as a governor. Speculation stays in the napkin. Only patterns that have survived real work and distillation graduate to the Practice. The pruning mechanism in distillation removes entries that have settled elsewhere, preventing duplication and drift.

The loop is self-applicable: the rules that enforce the Practice are themselves subject to the same evolution process. If consolidation reveals that a rule is wrong, the rule can change -- but only if the change clears the bar.

### Prompts

**Prompts** (`.agent/prompts/`) are reusable playbooks. The `start-right` prompt is the session entry point: read directives, understand context, ask guiding questions, commit. Prompts are not part of the learning loop -- they are how the Practice is applied at the start of a session.

## Adaptation Levels

The Practice scales to the project. The `purpose` field in each provenance entry describes the local context; these reference profiles indicate common adaptation levels:

**POC (days to weeks)**: Inline agents. Simplified gates. No layered agent composition, no ADR infrastructure, no full learning loop. Metacognition and napkin retained. 3 agents: code-reviewer, test-reviewer, type-reviewer.

**Production (months to years)**: Layered agent architecture. Full specialist roster. Learning loop (napkin -> distilled -> rules). ADR infrastructure. Full quality gate sequence. Practice.md in full depth.

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

| File | Ceiling | Rationale |
|---|---|---|
| `practice.md` | ~200 lines | System map. Readable in one sitting. |
| `practice-lineage.md` | ~300 lines | Complete portable blueprint. Readable in one sitting. |
| `practice-bootstrap.md` | ~400 lines | Annotated templates for every artefact type. Comprehensive but still one sitting. |

These are soft ceilings, not hard limits. Exceeding them triggers tightening; it does not block work. The `jc-consolidate-docs` command checks these during every consolidation pass.

### Tightening Process

When a file exceeds its ceiling:

1. Identify which sections have grown since the last check.
2. Look for: principles that overlap and can merge, examples that have served their teaching purpose and can be removed, sections that duplicate content in referenced files.
3. Compress while preserving coverage -- no principle should be lost, only expressed more concisely.
4. Present the tightened version to the user for review before committing.

This is the same intellectual discipline as distillation, applied at a different level. Distillation asks "what has settled elsewhere and can be pruned?" Tightening asks "what can be said more concisely without losing meaning?"

## Plasmid Exchange

The Practice is not hierarchical. Each repo carries its own Practice instance, adapted to its own context. The Practice travels as a trinity: `practice.md` (the what), `practice-lineage.md` (the why), and `practice-bootstrap.md` (the how). All three files travel together.

### The Practice Box

Every repo with a Practice has a canonical location for incoming material: **`.agent/practice-core/incoming/`** (the practice box). This directory is normally empty (with a `.gitkeep`). When the plasmid trinity arrives from another repo, it is placed here.

The practice box is checked at two points:

1. **Session start** (via the `start-right` prompt) — alert the user if files are present.
2. **Consolidation** (via the `jc-consolidate-docs` command step 8) — perform the full integration flow.

### Integration Flow

When plasmid trinity files appear in the practice box:

1. **Check the provenance chain.** Read the `provenance` array in the frontmatter. If the last entry's `repo` differs from the local repo name, the file has been evolved elsewhere and may carry new learnings. If the last entry matches the local repo, the file has not been evolved since it left — there is nothing new to integrate.
2. **Read it.** Understand what they learned and why. The `purpose` field in each provenance entry tells you what kind of work shaped the evolution — use this to assess relevance to the local context.
3. **Compare** with the local Practice and Lineage. Identify differences — not just in the lineage doc, but across the full Practice system (directives, rules, skills, commands, prompts). Ask: does the incoming version reveal principles that the local Practice implements implicitly but hasn't named? Does the compression reveal what's essential versus contextual?
4. **Apply the same bar.** Does the incoming learning meet the structural-change criteria for *this* repo? (Validated by real work? Prevents recurring mistakes? Stable?)
5. **Propose changes** to the user. Be specific: which files across the Practice would change and why.
6. **On approval, apply.** Update Practice, Lineage, rules, skills, commands, prompts, or directives as warranted.
7. **Record what was taken** in the napkin (for traceability, not attribution).
8. **Audit cohesion.** (a) Check that all practice-core files (`practice.md`, `practice-lineage.md`, `practice-bootstrap.md`, `index.md`, `README.md`) are internally consistent -- no contradictions, no stale descriptions, no missing cross-references between them. (b) Check that broader Practice files throughout the repo (directives, rules, skills, commands, prompts) are aligned with the updated core -- no outdated wording, no missing references, no contradictions with the new content. This step catches drift that individual edits miss.
9. **Clear the practice box.** Remove the incoming files. The integration is complete.

If nothing clears the bar, record that in the napkin too — the incoming material was reviewed and found not applicable to this context. That is a valid outcome.

The trinity (`practice.md`, `practice-lineage.md`, `practice-bootstrap.md`) is itself a plasmid. It can be carried to any repo. The receiving repo applies its own bar.

## Growing a Practice from This Blueprint

**Effort heuristic**: in the first real migration, roughly a third of Practice files were fully portable (zero edits), a third needed selective editing (universal core with domain-specific sections to remove), and a third needed complete rewrite or deletion. The mixed tier is the most labour-intensive — it requires line-by-line judgment about what is universal and what is local. Budget accordingly.

1. Create the directory structure: `.agent/directives/`, `.agent/practice-core/` (with `incoming/.gitkeep`), `.agent/plans/`, `.agent/prompts/`, `.agent/memory/`, `.cursor/rules/`, `.cursor/commands/`, `.cursor/agents/`. Create `index.md` in `practice-core/` as the local landing page.
2. Write `AGENT.md` in `.agent/directives/` as a stable structural index: project context, artefacts, rules pointer, sub-agent roster, development commands, repo structure. Link to `.agent/practice-core/index.md` for the full Practice. No mutable state.
3. Write `rules.md` encoding the Principles above, adapted to local tooling.
4. Write `testing-strategy.md` encoding the Testing Philosophy above, with local test targets.
5. Write `metacognition.md` from the condensed version in `practice-bootstrap.md` (it is universal).
6. Follow `practice-bootstrap.md` for the remaining artefacts: agent definitions, workflow commands, always-applied rules, start-right prompt, skills (napkin, distillation), and Cursor configuration. The bootstrap file provides annotated templates and format specifications for every artefact type.
7. Write `practice.md`, this lineage doc, and `practice-bootstrap.md` in `.agent/practice-core/` with YAML frontmatter: `provenance` array (index 0 entry with `repo`, `date`, and `purpose`), and `fitness_ceiling`. Add initial learned principles to the lineage doc.
8. **Validate**: every file reference in every directive, agent, command, and rule resolves. Every agent's first-action file exists. The repo builds. See the Bootstrap Checklist in `practice-bootstrap.md`.
9. **Audit cohesion.** Check that all practice-core files are internally consistent and that all broader Practice files (directives, rules, skills, commands, prompts) are aligned with the core. Contradictions, stale descriptions, and outdated wording degrade silently -- the Practice will appear complete while subtly misdirecting.

## Validation

After growing or propagating the Practice, verify that nothing is **silently broken**. The most dangerous failure mode is not missing files — it is files that look correct but whose internal references don't resolve. Agents will proceed with no review methodology, directives will point to non-existent docs, commands will invoke non-existent prompts. Nothing errors; everything quietly degrades.

1. **Reference check** — every file path in directives, agents, commands, and rules resolves.
2. **Agent check** — each agent's first-action file reference exists.
3. **Build check** — `type-check`, `lint`, `build` all pass.
4. **Stable-index check** — `AGENT.md` and `AGENTS.md` contain no mutable session state.
5. **Cohesion check** — all practice-core files are internally consistent, and broader Practice files (directives, rules, commands, prompts, skills) are aligned with the core content. No stale descriptions, no contradictions, no outdated wording.

### Validation scripts

Reference check (rough — does not handle relative paths from referencing file's location, `@`-prefixed Cursor references, or paths inside code blocks):

```bash
rg -o '\./[^\s\)]+\.md' .agent/ .cursor/ --no-filename | sort -u | while read ref; do
  path="${ref#./}"
  if [ ! -f "$path" ]; then
    echo "BROKEN: $ref"
  fi
done
```

Agent dependency check:

```bash
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
- **Understand local norms before hydrating.** The Practice is ecosystem-agnostic in principle. When hydrating into a new repo, the integrating agent MUST survey the local language(s), test runners, linters, package managers, and existing quality standards BEFORE creating any Practice artefacts. The Practice enables excellence; it does not replace what has already been achieved.
