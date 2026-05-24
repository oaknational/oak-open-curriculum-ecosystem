---
name: "Sub-agent rename to *-expert + skill integration"
overview: >
  Owner-directed rename of every canonical sub-agent template and its
  Claude/Cursor/Codex adapters from `<domain>-reviewer` to `<domain>-expert`,
  followed by integration of the eight standalone `<domain>-expert` skill
  bodies into the renamed templates and a repo-wide reference sweep.
  Phase 1A (mechanical rename) is landed at `ce054100`. Phase 1B
  (substantive integration + skill deletion) is complete through `249600f1`.
  Phase 2 (cross-repo reference sweep) is landed at `25a8ee6b`.
status: 🟢 COMPLETE
todos:
  - id: phase-1b-integrate-and-delete
    content: "Phase 1B: integrate 8 paired `<domain>-expert` skill bodies into the renamed templates (active workflow + read-only review combined), update body H1 + frontmatter description per template, delete 8 standalone `.agent/skills/<domain>-expert/` skill directories, remove the 8 corresponding `Skill(<name>-expert)` permissions from `.claude/settings.json`, and inline the `mcp-expert` companion `installation-and-integration.md` (Option C). Resolved: 8 of 8 merges landed (sentry/clerk/mcp at 52c139c7; accessibility/assumptions/design-system/elasticsearch templates at 57de914f; elasticsearch adapters at 16c10cea; react-component at 31a2a9e1). Cleanup pass landed at ae36670a: 24 standalone-skill directories deleted (8 canonical + 8 .claude jc- adapters + 8 .agents jc- adapters), the mcp-expert companion file deleted alongside, and 8 `Skill()` permissions removed from `.claude/settings.json`."
    status: completed
  - id: phase-1b-expert-dispatch
    content: "Phase 1B reviewer dispatch: code-expert (gateway), docs-adr-expert (8 substantive content merges + role-broadening), config-expert (.claude/settings.json permission removals + skills-lock interaction), mcp-expert + clerk-expert + sentry-expert (each on their own paired domain), architecture-expert-fred (PDR-051 alignment of the unified expert role)."
    status: pending
    depends_on: [phase-1b-integrate-and-delete]
  - id: phase-2-cross-repo-sweep
    content: "Phase 2: sweep ~590 cross-repo references (`grep -rln` count from Phase 1A scoping, excluding archives + reference-local). Most consequential: `.agent/rules/invoke-code-experts.md` and `.agent/memory/executive/invoke-code-experts.md` (the canonical reviewer-routing rule); `AGENT.md`; ADRs that name reviewers; current/future plans; READMEs; `agent-tools/src/bin/codex-reviewer-resolve.ts` HELP_TEXT examples; `validate-portability-helpers.ts` + `validate-no-stale-script-invocations.ts` if they encode reviewer names. Landed at `25a8ee6b` (304 files, ADR-146 + ADR-149 renamed + body amendments). Two files (`pending-graduations.md`, `practice-core/CHANGELOG.md`) deferred to Sylvan Fruiting Glade's pending-graduations drain claim by coordination event."
    status: completed
    depends_on: [phase-1b-expert-dispatch]
  - id: phase-2-expert-dispatch
    content: "Phase 2 reviewer dispatch: code-expert (gateway), docs-adr-expert (rule + ADR + permanent-doc rewrites), config-expert (any settings/lint/codex-config touch), onboarding-expert (ensure onboarding paths still point to current names), test-expert (any test fixture updates needed). Dispatched in parallel before commit; five fixable findings remediated; HOLD lifted after fixes; commit `25a8ee6b` lands the substance."
    status: completed
    depends_on: [phase-2-cross-repo-sweep]
related:
  - docs/architecture/architectural-decisions/125-agent-artefact-portability.md
  - .agent/practice-core/decision-records/PDR-009-canonical-first-cross-platform-architecture.md
  - .agent/practice-core/decision-records/PDR-051-vendor-agnostic-skills-standardisation.md
  - .agent/sub-agents/README.md
  - .agent/rules/invoke-code-experts.md
anchored_commits:
  - 153e960b — third-party skill vendoring cleanup (precondition)
  - 261d50fe — reviewer feedback follow-up (mcp-expert WARN + fred latent BLOCKER note)
  - ce054100 — Phase 1A mechanical rename (templates + adapters + frontmatter + paths)
  - 52c139c7 — Phase 1B partial: sentry/clerk/mcp templates merged + adapters updated
  - 57de914f — Phase 1B continuation: accessibility/assumptions/design-system/elasticsearch templates + changed adapters updated
  - 16c10cea — Phase 1B follow-up: elasticsearch adapters synchronised
  - 31a2a9e1 — Phase 1B continuation: react-component template + adapters merged
  - ae36670a — Phase 1B.2-4 cleanup: 24 standalone-skill dirs deleted + 8 Skill() permissions removed + plan updated
  - c31eb492 — Phase 1B reviewer follow-ups: plan-drift fix + dead Style Dictionary URL fix
  - 249600f1 — Phase 1B closeout extended scope (owner-directed pull-forward): 8 invoke-<domain>-reviewer rule files renamed to invoke-<domain>-expert across 4 surfaces (.agent/rules/, .claude/rules/, .cursor/rules/.mdc, .agents/rules/); invoke-code-reviewers gateway renamed to invoke-code-experts across 4 surfaces + executive memory; RULES_INDEX.md, AGENT.md, practice-index.md, executive README, .codex/README cross-references updated
  - 25a8ee6b — Phase 2 cross-repo sweep: 304 files, ADR-146 + ADR-149 renamed (filename + body), ADR-146 amendment promotes Build-vs-buy to area #1 (six → seven), agent-tools CLI HELP_TEXT refreshed, production-code reviewer-finding comments updated. Reviewer dispatch (code/docs-adr/config/onboarding/test) returned 5 fixable findings, all remediated. Two files deferred to Sylvan Fruiting Glade's pending-graduations drain claim by coordination comms event.
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
  tool for independent assessment. Examples: `clerk-expert`, `mcp-expert`,
  `sentry-expert`. (17 templates total, including the 8 paired with experts
  and 9 unpaired roles like `code-expert`, `security-expert`, etc.)

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

### Phase 1B status (complete)

**Last refreshed**: 2026-05-10 (Stormbound Floating Current cleanup close).

**Domains merged and adapters refreshed** (8 of 8 — Phase 1B.1 complete):

- `sentry-expert` — template merged; `.claude` + `.cursor` + `.codex`
  adapter descriptions broadened, body H1 → "Sentry Expert", body prose →
  "Review or recommend; do not modify code." `.codex/config.toml` description
  sync'd. `subagents:check` passes after this merge.
- `clerk-expert` — same shape as sentry; passes.
- `mcp-expert` — same shape; companion `installation-and-integration.md`
  inlined into the merged template (Option C from §1B.3).
- `accessibility-expert`, `assumptions-expert`, `design-system-expert`, and
  `elasticsearch-expert` — templates merged with active-workflow mode and
  changed Claude/Cursor/Codex adapters synchronised. The four templates
  landed at `57de914f`; the elasticsearch adapters then landed separately
  at `16c10cea`.
- `react-component-expert` — template merged with mode-aware Workflow
  split, adapters refreshed across `.claude`/`.cursor`/`.codex`,
  `.codex/config.toml` description sync'd. Landed at `31a2a9e1`.

**Phase 1B.2-4 cleanup** (landed at `ae36670a`):

- 8 standalone `.agent/skills/<domain>-expert/` directories deleted
  (including the `mcp-expert/installation-and-integration.md` companion
  file, now duplicated by the inlined section in the merged template).
- 8 `.claude/skills/jc-<domain>-expert/` adapter directories deleted.
- 8 `.agents/skills/jc-<domain>-expert/` adapter directories deleted.
- 8 `Skill(<domain>-expert)` entries removed from
  `.claude/settings.json` permissions.allow.

**Per-domain edit pattern (locked in)**:

1. Merge `.agent/sub-agents/templates/<domain>-expert.md` (unified template
   with `# <Domain> Expert` H1, mode-aware Workflow split into "Review mode"
   and "Active-workflow mode", merged Guardrails + Boundaries + Output Format
   sections covering both modes).
2. Update `.claude/agents/<domain>-expert.md` — `description:` broadened,
   body H1 → "<Domain> Expert", body prose → "Review or recommend; do not
   modify code. The calling agent executes any changes you propose."
3. Update `.cursor/agents/<domain>-expert.md` — same edits (different
   frontmatter shape).
4. Update `.codex/agents/<domain>-expert.toml` — `description` broadened,
   `developer_instructions` updated.
5. Update `.codex/config.toml` — sync the `[agents."<name>"].description`
   line to match the agent TOML's description (mandatory; otherwise
   `subagents:check` fails with "description must match"). One additional
   edit per domain that the original opener did not name; absorb into the
   per-domain pattern.
6. Run `pnpm subagents:check` after each domain — must pass.

**Domains remaining**: none. Phase 1B.1 complete.

**Standalone deletion + permission cleanup**: complete. Eight
`.agent/skills/<domain>-expert/` dirs, eight `.claude/skills/jc-*-expert/`
adapter dirs, eight `.agents/skills/jc-*-expert/` adapter dirs, and the
eight matching `Skill()` permissions in `.claude/settings.json` are all
gone. The `mcp-expert/installation-and-integration.md` companion file
deleted as part of the same pass.

**Cross-references inside merged templates**: every merged template
updated internal references to sibling sub-agents from `*-reviewer` to
`*-expert` for self-consistency (e.g. "use `code-expert`" → "use
`code-expert`"). This is Phase 2 sweep substance pre-empted within the
bounds of the touched files only; the remaining ~590 cross-repo sites
stay queued for Phase 2.

### Next-session opener (Phase 1B cleanup validation and review)

Branch: `feat/mcp-graph-support-foundation`. Owning plan: this file.

Current working-tree state already contains the cleanup bundle for Phase 1B:
24 standalone skill directories are deleted, `.claude/settings.json` no longer
allows the eight deleted standalone expert skills, and this plan records all
eight paired expert content/adaptor merges as landed.

#### What has landed

Phase 1B content commits on `feat/mcp-graph-support-foundation`:

- `52c139c7` — `feat(sub-agents): merge sentry/clerk/mcp experts with
  active-workflow content (1B partial)`. 19 files: 3 templates, 9 adapters
  (3 Claude + 3 Cursor + 3 Codex), `.codex/config.toml` description sync,
  the plan itself, and 5 collaboration-state surfaces (active-claims,
  closed-claims archive, shared comms log, 2 new comms events).
- `57de914f` — `feat(sub-agents): extend experts with active-workflow
  guidance`. 14 files: accessibility, assumptions, design-system, and
  elasticsearch templates plus the changed Claude/Cursor/Codex adapters and
  `.codex/config.toml` description sync. `pnpm subagents:check` passed before
  commit; pre-commit hooks passed.
- `16c10cea` — `feat(sub-agents): finish elasticsearch expert adapters`.
- `31a2a9e1` — `feat(sub-agents): merge react component expert guidance`.

#### Owner-locked decisions carried forward

The Phase 1B owner-locked decisions from the prior opener stand unchanged:

- All 8 paired domains merge into unified `*-expert` templates.
- `disallowedTools: Write, Edit, NotebookEdit` stays on the adapters
  (sub-agent recommends; main agent executes — applies in both review and
  active-workflow modes).
- Standalone `.agent/skills/<domain>-expert/` dirs delete after all merges
  land.
- `Skill(<domain>-expert)` permissions in `.claude/settings.json` removed
  in the same cleanup pass.
- Third-party skills via `npx skills add`, never vendored.
- `codex-reviewer-resolve` CLI binary keeps its tool-name; HELP_TEXT
  updates stay in Phase 2.
- Architecture-expert personality variants (barney/betty/fred/wilma)
  retained.

#### What you're starting

**Phase 1B cleanup validation + reviewer dispatch.** Reasonable shape:
coordinate with Stormbound Floating Current's still-active claim, inspect the
current cleanup diff, run the Phase 1B.5 gates, land the cleanup commit, then
dispatch the reviewers listed below. Do not begin Phase 2's ~590-site reference
sweep until Phase 1B cleanup and review are settled.

Expected cleanup diff:

- delete `.agent/skills/<domain>-expert/` for all 8 paired domains, including
  the now-inlined `mcp-expert/installation-and-integration.md` companion;
- delete `.claude/skills/jc-<domain>-expert/` and
  `.agents/skills/jc-<domain>-expert/` for all 8 paired domains;
- remove the 8 `Skill(<domain>-expert)` entries from
  `.claude/settings.json` permissions.allow.

Run gates: `pnpm subagents:check`, `pnpm skills:check`,
`pnpm portability:check` (must not regress beyond pre-existing failures),
`pnpm test --filter @oaknational/agent-tools`, `pnpm format:root`, and
`pnpm markdownlint:root`.

#### Reviewer dispatch (post-Commit)

Per the §"Reviewer dispatch matrix" below:

- `code-expert` — gateway (mandatory).
- `docs-adr-expert` — substantive content merges + role-broadening (the
  primary post-Commit reviewer for the new merges).
- `config-expert` — `.claude/settings.json` permission removals +
  skills-lock interaction (only after the cleanup pass).
- `mcp-expert`, `clerk-expert`, `sentry-expert`, `accessibility-expert`,
  `assumptions-expert`, `design-system-expert`, `elasticsearch-expert`, and
  `react-component-expert` — domain-specific checks for the merged unified
  templates and cleanup impact.
- `architecture-expert-fred` — PDR-051 alignment of the unified expert
  role across all 8 templates.

#### Latent items carried forward

- `agent-tools/src/skills-adapter-generate/generator.ts:191-199` applies
  the `jc-` prefix unconditionally and silently discards classification
  keys; not blocking Phase 1B (no ingested skills under `.agent/skills/`
  after this work) but gates any future re-import. Captured at
  `.agent/plans/agent-tooling/future/third-party-skill-reimport-targets.md`.
- The `.codex/config.toml` description-sync requirement is now part of
  the per-domain pattern (locked in by `subagents:check` failure on the
  first merge attempt). Future plans that add new sub-agents must
  include this step.
- Working-tree carry-over from peer agents remains present: napkin,
  active-claims, the Oceanic insight-report disposition plan, and
  continuity/thread surfaces include other agents' state. Land the cleanup
  bundle with explicit pathspecs so unrelated peer work is not absorbed.

#### Recommended session start

1. `/jc-start-right-thorough` to ground (Phase 1B cleanup/review is
   plan-heavy though structurally locked-in).
2. Read this opener + the §"Phase 1B status" section above + PDR-051.
3. Coordinate with Stormbound Floating Current's active claim before landing
   the current cleanup diff.
4. Run the Phase 1B.5 gates, commit the cleanup bundle, then run reviewer
   dispatch.

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

- `.agent/rules/invoke-code-experts.md` (10 lines; canonical reviewer
  routing rule). The rule's filename references `code-reviewers` plurally —
  consider whether the rule itself should be renamed to
  `invoke-code-experts.md` (and the matching `.claude/rules/` adapter pointer).
- `.agent/memory/executive/invoke-code-experts.md` (219 lines; the rule's
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
say `code-expert` and `architecture-expert-fred`. Update to `code-expert`
and `architecture-expert-fred`. The CLI binary name itself
(`codex-reviewer-resolve`) is a tool name not a sub-agent name — owner
direction did not call for tool-name rename, so leave that alone unless
asked.

## Reviewer dispatch matrix

| Phase | Reviewers |
|---|---|
| 1B integration | code-expert (gateway), docs-adr-expert, config-expert, mcp-expert (own domain), clerk-expert, sentry-expert, architecture-expert-fred (PDR-051 alignment) |
| 2 sweep | code-expert (gateway), docs-adr-expert, config-expert, onboarding-expert, test-expert |

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
4. **Architecture-expert-fred latent BLOCKER**: per `261d50fe`, the skills
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
