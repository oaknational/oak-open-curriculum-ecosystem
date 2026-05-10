---
name: "Sub-agent rename to *-expert + skill integration"
overview: >
  Owner-directed rename of every canonical sub-agent template and its
  Claude/Cursor/Codex adapters from `<domain>-reviewer` to `<domain>-expert`,
  followed by integration of the eight standalone `<domain>-expert` skill
  bodies into the renamed templates and a repo-wide reference sweep.
  Phase 1A (mechanical rename) is already landed at `ce054100`. Phase 1B
  (substantive integration + skill deletion) and Phase 2 (cross-repo
  reference sweep) remain.
status: 🟡 PLANNING
todos:
  - id: phase-1b-integrate-and-delete
    content: "Phase 1B: integrate 8 paired `<domain>-expert` skill bodies into the renamed templates (active workflow + read-only review combined), update body H1 + frontmatter description per template, delete 8 standalone `.agent/skills/<domain>-expert/` skill directories, remove the 8 corresponding `Skill(<name>-expert)` permissions from `.claude/settings.json`, and decide where the `mcp-expert` companion `installation-and-integration.md` lives (move to `.agent/sub-agents/templates/mcp-expert/` as supporting file, or keep at `.agent/skills/mcp-expert/installation-and-integration.md` and update cross-link)."
    status: pending
  - id: phase-1b-reviewer-dispatch
    content: "Phase 1B reviewer dispatch: code-reviewer (gateway), docs-adr-reviewer (8 substantive content merges + role-broadening), config-reviewer (.claude/settings.json permission removals + skills-lock interaction), mcp-reviewer + clerk-reviewer + sentry-reviewer (each on their own paired domain), architecture-reviewer-fred (PDR-051 alignment of the unified expert role)."
    status: pending
    depends_on: [phase-1b-integrate-and-delete]
  - id: phase-2-cross-repo-sweep
    content: "Phase 2: sweep ~590 cross-repo references (`grep -rln` count from Phase 1A scoping, excluding archives + reference-local). Most consequential: `.agent/rules/invoke-code-reviewers.md` and `.agent/memory/executive/invoke-code-reviewers.md` (the canonical reviewer-routing rule); `AGENT.md`; ADRs that name reviewers; current/future plans; READMEs; `agent-tools/src/bin/codex-reviewer-resolve.ts` HELP_TEXT examples; `validate-portability-helpers.ts` + `validate-no-stale-script-invocations.ts` if they encode reviewer names."
    status: pending
    depends_on: [phase-1b-reviewer-dispatch]
  - id: phase-2-reviewer-dispatch
    content: "Phase 2 reviewer dispatch: code-reviewer (gateway), docs-adr-reviewer (rule + ADR + permanent-doc rewrites), config-reviewer (any settings/lint/codex-config touch), onboarding-expert (renamed onboarding-reviewer — ensure onboarding paths still point to current names), test-reviewer (any test fixture updates needed)."
    status: pending
    depends_on: [phase-2-cross-repo-sweep]
related:
  - docs/architecture/architectural-decisions/125-agent-artefact-portability.md
  - .agent/practice-core/decision-records/PDR-009-canonical-first-cross-platform-architecture.md
  - .agent/practice-core/decision-records/PDR-051-vendor-agnostic-skills-standardisation.md
  - .agent/sub-agents/README.md
  - .agent/rules/invoke-code-reviewers.md
anchored_commits:
  - 153e960b — third-party skill vendoring cleanup (precondition)
  - 261d50fe — reviewer feedback follow-up (mcp-reviewer WARN + fred latent BLOCKER note)
  - ce054100 — Phase 1A mechanical rename (templates + adapters + frontmatter + paths)
---

# Sub-agent rename to `*-expert` + skill integration

**Last updated**: 2026-05-10

**Branch**: `feat/mcp-graph-support-foundation`

## Owner direction (verbatim)

> "rename all of the sub-agent from `<domain>-reviewer` to `<domain>-expert`
> (canonical and adapters), and integrate the skill content into the existing
> templates"

## Why

The repo previously kept two parallel surfaces for domain expertise:

- An **active workflow skill** at `.agent/skills/<domain>-expert/SKILL-CANONICAL.md`,
  loaded into the main agent's context when matched. Examples: `clerk-expert`,
  `mcp-expert`, `sentry-expert`, etc. (8 skills total, all owner-authored).
- A **read-only reviewer sub-agent** at
  `.agent/sub-agents/templates/<domain>-reviewer.md`, spawned via the Agent
  tool for independent assessment. Examples: `clerk-reviewer`, `mcp-reviewer`,
  `sentry-reviewer`. (17 templates total, including the 8 paired with experts
  and 9 unpaired roles like `code-reviewer`, `security-reviewer`, etc.)

The two surfaces had overlapping live-doc references and converging substance
but split naming. The owner directed consolidation under a single `*-expert`
role that covers both active workflow and read-only review. The new role
spawns as a sub-agent (cost-effective for deep work) and is discoverable via
the existing template-and-adapter generator.

The mechanical rename (templates and adapters) is already complete at commit
`ce054100`. The remaining work is the substantive content merge, the deletion
of the now-redundant standalone skills, and the repo-wide reference sweep.

## Scope summary

| Phase | Files touched | Substantive vs mechanical |
|---|---|---|
| 1A (landed `ce054100`) | 17 canonicals + 60 adapters + `.codex/config.toml` + 1 test fixture | mechanical |
| 1B | 8 templates content-merged + 8 skill dirs deleted + `.claude/settings.json` permission lines + 1 mcp companion file | substantive |
| 2 | ~590 cross-repo reference sites | mechanical |

## Phase 1B — substantive integration

### 1B.1 — content merge per domain (8 domains)

For each domain in the paired set:

- accessibility
- assumptions
- clerk
- design-system
- elasticsearch
- mcp (with companion `installation-and-integration.md`)
- react-component
- sentry

Read both files:

- canonical (post-rename): `.agent/sub-agents/templates/<domain>-expert.md`
- standalone skill body: `.agent/skills/<domain>-expert/SKILL-CANONICAL.md`

Produce a **unified expert template** that:

1. Carries the union of both bodies' substantive content. The reviewer body
   tends to lead with assessment scope, doctrine hierarchy, mandatory reading,
   findings format. The skill body tends to lead with active-workflow
   triggers, when-to-use, capability routing, workflow steps, guardrails.
   Both perspectives belong in the merged template; the merge is not an
   append but a re-section under the existing template's structure.
2. Updates the body H1 from `# <Domain> Reviewer` to `# <Domain> Expert`.
3. Updates the frontmatter `description:` field to broaden the role
   (e.g. `Sentry and OpenTelemetry specialist reviewer for SDK init...` →
   `Sentry and OpenTelemetry specialist expert for SDK init... and active
   workflow planning`).
4. Removes any prose that says "this skill is distinct from the
   `<domain>-reviewer`" — that distinction is collapsed.
5. Preserves all live-doc URL tables verbatim. PDR-051's "live-spec-first"
   doctrine is load-bearing.

Each merged template should still compose cleanly from the existing
`.agent/sub-agents/components/` (principles, behaviours, personas) — the
template is the composition point.

### 1B.2 — delete standalone skills

Once each merge is verified, delete:

- `.agent/skills/<domain>-expert/` directory (canonical + any supporting
  files inside)
- `.claude/skills/jc-<domain>-expert/` adapter directory
- `.agents/skills/jc-<domain>-expert/` adapter directory

For all 8 domains. The skills-adapter-generate `--check` gate must pass after
deletion; the `Skill(<domain>-expert)` permissions in `.claude/settings.json`
must be removed for the same 8.

### 1B.3 — mcp companion file

`.agent/skills/mcp-expert/installation-and-integration.md` is the only
companion file. Two options:

a) Move to `.agent/sub-agents/templates/mcp-expert/installation-and-integration.md`
   alongside the merged template, treating the template as a directory rather
   than a single file (sub-agents do not currently use directory-shaped
   templates, so this would be a small structural extension).

b) Keep at `.agent/skills/mcp-expert/installation-and-integration.md` as an
   orphan reference doc and update its cross-links + the merged template's
   cross-link. Less invasive structurally but loses the standalone skill
   directory containing it.

c) Inline the entire installation-and-integration content into the merged
   `mcp-expert.md` template. Simplest; produces a longer template.

Option (c) is the recommended starting position; revisit if the merged
template grows unwieldy.

### 1B.4 — settings.json permission cleanup

Remove the 8 `Skill(<domain>-expert)` entries from `.claude/settings.json`
permissions.allow corresponding to the deleted standalone skills. The
`Skill(clerk-expert)` permission preserved earlier in commit `153e960b`
also goes away in this phase, since the standalone `clerk-expert` skill is
deleted.

### 1B.5 — gate verification

- `pnpm subagents:check` — must pass (compliance count drops to 19 templates)
- `pnpm skills:check` — must pass (8 fewer canonicals, generator drift clean)
- `pnpm portability:check` — must not regress beyond pre-existing failures
  documented in `agent-commands-retirement.plan.md`
- `pnpm test --filter @oaknational/agent-tools` — must pass; check for any
  tests that referenced the deleted skill ids
- `pnpm format:root` + `pnpm markdownlint:root`

## Phase 2 — cross-repo reference sweep

`grep -rln "<domain>-reviewer" .` (excluding archives + reference-local)
returned ~596 sites at Phase 1A scoping time. Each must update to
`<domain>-expert`.

### 2.1 — rules and executive memory

Highest-leverage targets:

- `.agent/rules/invoke-code-reviewers.md` (10 lines; canonical reviewer
  routing rule). The rule's filename references `code-reviewers` plurally —
  consider whether the rule itself should be renamed to
  `invoke-code-experts.md` (and the matching `.claude/rules/` adapter pointer).
- `.agent/memory/executive/invoke-code-reviewers.md` (219 lines; the rule's
  detailed roster, timing tiers, depth matrix, copy-paste examples).
- `.agent/directives/AGENT.md` "Reviewers And Tools" section — points at the
  rule.

### 2.2 — ADRs

Search ADRs under `docs/architecture/architectural-decisions/` for `*-reviewer`
references. ADRs are permanent docs; treat each rename as a content edit
rather than re-issuing the ADR.

### 2.3 — Plans and reports

`.agent/plans/**` will have many references. Most are operational — describe
"dispatch X-reviewer for Y". Mechanical replacement.

### 2.4 — READMEs and governance docs

`README.md`, `CONTRIBUTING.md`, `docs/governance/development-practice.md`,
etc. Search and replace.

### 2.5 — Sub-agent template bodies

The renamed `*-expert.md` templates may still contain prose that references
sibling templates by their old `*-reviewer` names. Sweep the merged
templates for cross-references.

### 2.6 — agent-tools CLI examples

`agent-tools/src/bin/codex-reviewer-resolve.ts` HELP_TEXT examples currently
say `code-reviewer` and `architecture-reviewer-fred`. Update to `code-expert`
and `architecture-expert-fred`. The CLI binary name itself
(`codex-reviewer-resolve`) is a tool name not a sub-agent name — owner
direction did not call for tool-name rename, so leave that alone unless
asked.

## Reviewer dispatch matrix

| Phase | Reviewers |
|---|---|
| 1B integration | code-reviewer (gateway), docs-adr-reviewer, config-reviewer, mcp-expert (own domain), clerk-expert, sentry-expert, architecture-reviewer-fred (PDR-051 alignment) |
| 2 sweep | code-reviewer (gateway), docs-adr-reviewer, config-reviewer, onboarding-expert, test-reviewer |

Note that the renamed templates already use `*-expert` names by the time
Phase 1B reviewers run; the dispatch invocations use the new names.

## Risks

1. **Concurrent agents**: this branch has 3+ agents committing during Phase 1A.
   Phase 1B will need a `commit-queue` claim or sidebar coordination if the
   agents touch sub-agent templates or the rule file in parallel.
2. **Test breakage**: live-state assertions in agent-tools tests caught one
   issue in Phase 1A; Phase 2 may surface more in scripts and validators.
3. **Description drift**: frontmatter `description:` strings are read by the
   Claude Code agent dispatcher; rewriting them changes invocation matching.
   Manual QA pass after Phase 1B is recommended.
4. **Architecture-reviewer-fred latent BLOCKER**: per `261d50fe`, the skills
   generator at `agent-tools/src/skills-adapter-generate/generator.ts:191-199`
   still applies `jc-` prefix unconditionally. Not blocking this plan but
   relevant if Phase 1B re-introduces any ingested-skill content under
   `.agent/skills/`.

## Pre-condition

Phase 1A is landed at `ce054100`. The renamed templates + adapters work
correctly; only their body H1 + descriptions still read "Reviewer" in
places. Tests are green; validators pass.

## Non-goals

- Renaming the `codex-reviewer-resolve` CLI binary (owner did not request).
- Renaming personality variants of `architecture-expert` further (barney,
  betty, fred, wilma stay as-is).
- Restructuring the sub-agent component composition (`components/`,
  `templates/` layout).
- Re-vendoring third-party skills cleaned up in `153e960b`.
