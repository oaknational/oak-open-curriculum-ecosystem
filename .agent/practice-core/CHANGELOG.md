# Practice Core Changelog

Changes to the Practice Core files, newest first. Each entry records the repo
that made the change and what was changed. This file travels with the
Practice Core package.

## [oak-open-curriculum-ecosystem] 2026-04-05 — Concept Exchange, ADR Bootstrap, Self-Containment

- Promoted "concepts are the unit of exchange" as a foundational
  principle in practice.md Philosophy section. The Practice learns,
  teaches, compares, and evolves at the concept level — not the file or
  name level. The knowledge flow extracts concepts from instances;
  Practice exchange compares concepts across repos.
- Promoted "substance before fitness" as a foundational principle.
  Concepts must be written at the weight they deserve first; fitness
  limits are a post-writing editorial concern.
- Added Architectural Decision Records section to practice-bootstrap.md:
  portable ADR template, lifecycle states, learning loop connection.
  ADRs are the graduation target of the knowledge flow.
- Strengthened self-containment: travelling content must carry the
  concept itself (what, how, why), not a pointer to where a host repo
  documents it. A descriptive name is better than an opaque number, but
  a name alone is still a pointer — the substance must travel.
- Removed all host-repo-specific ADR references from Practice Core
  files (6 occurrences of "ADR-144" across 3 files, replaced with
  concept descriptions).
- Reframed Integration Flow step 3 to operate at the concept level:
  "compare at the concept level, not file-by-file."
- Compressed redundant content across practice.md, practice-bootstrap.md,
  and practice-lineage.md to accommodate new material within fitness
  limits — holistically, after writing, not during.

## [oak-open-curriculum-ecosystem] 2026-04-03 — Operational Estate and Provenance UUID Migration

- Migrated `provenance.yml` from sequential `index` integers to UUID v4 `id`
  fields across all three chains (63 existing entries + 3 new entries).
  Eliminates implied hierarchy and merge-conflict risk during plasmid exchange.
  Updated field specification in practice-lineage.md.
- Added Minimum Operational Estate section to practice-bootstrap.md: defines
  6 mandatory surface categories (core+bridge, memory, continuity host,
  planning scaffold, platform truth, validators) that must exist beyond the
  Core 7 files for a self-sufficient hydration
- Added Claimed/Installed/Activated Audit section to practice-bootstrap.md:
  three-state verification model ensuring surfaces are not just claimed but
  actually installed and activated on a fresh checkout
- Added Fresh-Checkout Acceptance Criteria to practice-bootstrap.md: 6 things
  a fresh-checkout agent must do without consulting the source repo
- Extended Post-Installation Health Check with continuity-host existence,
  bridge truthfulness, and runtime smoke checks (three proof modes: presence,
  parity, runtime)
- Added Continuity Contract subsection to practice-bootstrap.md Skills: host
  surface as verification target, contract fields, surprise pipeline, split
  between session-handoff and consolidate-docs
- Added cross-platform integration order and policy-spine authority hierarchy
  to the Artefact Model section
- Extended Ecosystem Survey with deliberate-omission protocol: absent concepts
  must be recorded in live surfaces with rationale, not just changelogs
- Added forward reference to Fresh-Checkout Acceptance Criteria near the top
  of practice-bootstrap.md for hydration orientation
- Strengthened continuity-host wording in practice.md: the host is a
  verification target, not just a description; prompts are one valid option
- Added Minimum Operational Estate pointer and Claimed/Installed/Activated
  reference to practice.md
- Added 3 new Active Learned Principles to practice-lineage.md: hydration
  verifies operations not just structure, deliberate absences must live in
  operational surfaces, canonical source before activation always
- Extended practice-lineage.md Integration Flow step 8 with operational
  surface audit clause
- Extended practice-lineage.md hydration steps 8-9 with deliberate-omission
  and claimed/installed/activated requirements
- Added 3 operational validation checks (7-9) to practice-lineage.md with
  explicit static/operational distinction
- Integrated 8 incoming practice-context files from agent-collaboration
- Split practice-bootstrap.md: extracted verification material (bootstrap
  checklist, health check, minimum operational estate,
  claimed/installed/activated audit, fresh-checkout acceptance criteria) into
  new `practice-verification.md` — 8th Practice Core file. The split gives
  verification proper weight as a distinct lifecycle phase
- Deduplicated continuity host description in practice.md: reduced to
  summary with pointer to practice-bootstrap.md §Continuity Contract
- Promoted two Active Principles to axiom tier: "Architectural excellence
  over expediency" and "Apps are thin; libraries own domain logic" — both
  already stated in the universal principles blueprint
- Updated all "seven files" references to "eight files" across the Core

## [oak-open-curriculum-ecosystem] 2026-04-03 — Continuity Promotion and Platform-Config Doctrine

- Promoted the split-loop continuity model into the portable Core:
  `session-handoff` is now a required command, prompts explicitly carry live
  continuity contracts, and the lineage now records that ordinary continuity
  and deep convergence are separate loops
- Promoted the platform-configuration doctrine into the portable Core:
  tracked project settings define the agentic system contract, gitignored local
  settings are additive overrides, and portability checks must validate
  authorisation parity as well as wrapper presence
- Tightened reviewer guidance so UI-heavy repos may install a browser-facing
  reviewer cluster (for example accessibility, design-system, and
  component-architecture reviewers) rather than relying on one generic code
  reviewer for rendered output

## [oak-open-curriculum-ecosystem] 2026-04-01 — Consolidation Workflow Evolution

- Added full abstract Consolidation Workflow section to practice-bootstrap.md
  (the Knowledge Flow's central mechanism now travels with the Practice as an
  operational workflow, not just a conceptual description)
- Renamed "Code Patterns" to "Reusable Patterns" to reflect all learning types:
  process, architecture, structural, behavioural, agent operational,
  domain-specific
- Updated consolidation command summary in the Required Commands table to
  mention incoming practice box integration and outgoing practice context
  broadcast
- Compressed the Distillation subsection into a brief reference that points to
  the new Consolidation Workflow section

## [oak-open-curriculum-ecosystem] 2026-04-01 — Learning Loop Refinement

- Absorbed the distillation skill into the consolidation command as an
  inline step. Distillation had exactly one consumer (consolidation step 6)
  and did not warrant independent extraction as a skill
- Added explicit graduation criteria for distilled.md entries: stable,
  natural home exists, target doc has capacity
- Made fitness management active in the consolidation command: analyse,
  refine, split, or extend files at or approaching their ceiling
- Removed "not yet matured into settled practice" barrier language — agent-
  operational content is what the Practice is for
- Updated all Practice Core references from "the distillation skill" to
  "the consolidation command" or conceptual "distillation" process
- Deleted canonical distillation skill and all platform adapters

## [oak-open-curriculum-ecosystem] 2026-03-23 — Practice Convergence Remediation

- Clarified hook-runtime wording in the portable Core: hook enforcement uses a
  repo-local script surface (`scripts/` or `tools/` as appropriate), not a
  hard-coded directory name
- Clarified the portable fitness doctrine: the trinity files carry all three
  ceilings, while other docs declare only the dimensions their role needs and
  validators check only declared dimensions
- Clarified that advisory hook types can stay documented-only when equivalent
  grounding or quality-gate reminders already exist elsewhere in the local
  Practice
- Synced outgoing support notes to the live implementation state: promoted the
  cross-platform surface integration guide, added a Claude Code hook activation
  note, and refreshed the fitness artefacts so they match the live repo-wide
  validator

## [oak-open-curriculum-ecosystem] 2026-03-23 — Deep Integration of algo-experiments Round-Trip

- Integrated 8 evolution rounds from pine-scripts and algo-experiments
- Adopted provenance.yml extraction (7th Practice Core file)
- Adopted fitness key rename: `fitness_ceiling` → `fitness_line_count`,
  `fitness_ceiling_chars` → `fitness_char_count`,
  `fitness_max_prose_line` → `fitness_line_length`
- Adopted "strict and complete, everywhere, all the time" as explicit
  universal principle
- Adopted Learned Principles tiering (axioms vs active)
- Adopted session priority ordering, plan readiness levels, code-pattern
  exchange mechanism, and Code Pattern Exchange section
- Preserved local "architectural excellence over expediency" and "apps are
  thin; libraries own domain logic" as Active learned principles
- Re-added Practice Maturity diagnostic framework (4 levels)
- Added `.github/` to recognised platform adapter families
- Retained `.agent/prompts/` for handover prompts (valid local adaptation
  distinct from the prompts-to-skills migration for generic workflows)

## [algo-experiments] 2026-03-23 — Prompts-to-Skills Migration and Core Cohesion

- Removed "prompts" as a separate artefact category from the portable Core.
  Session-entry workflows (start-right-quick, start-right-thorough, go) now
  live as canonical skills in `.agent/skills/`, with thin command and platform
  skill wrappers. The workflow diagrams, artefact lists, integration flow
  steps, ecosystem survey, bootstrap checklist, and validation sections all
  updated to reflect this
- Added "Session workflows must be state-free" as a learned principle: session
  skills must not carry per-session content (specific plan names, tranche
  status, active/archive state). They reference plan-discovery surfaces and
  let those own the mutable state
- Added readme-as-index code pattern to the exchange pack: plan-directory
  READMEs are pure indexes, plan content lives in `.plan.md` files

## [algo-experiments] 2026-03-23 — Fitness Constraint Reflow and Rename

- Renamed fitness frontmatter keys for clarity: `fitness_ceiling` to
  `fitness_line_count`, `fitness_ceiling_chars` to `fitness_char_count`,
  `fitness_max_prose_line` to `fitness_line_length`
- Reflowed all prose in the trinity files and directive files to the
  100-character line length limit
- Recalibrated line count ceilings to accommodate reflowed prose:
  line counts increase with narrower lines but character counts
  (the honest volume constraint) are unchanged

## [algo-experiments] 2026-03-23 — Hooks and Fitness Universalisation

- Added hook guardrails to Practice Core: hooks row in artefact model table
  (`practice-bootstrap.md`), hooks description in Tooling section
  (`practice.md`). Hooks follow the canonical-first pattern: policy in
  `.agent/hooks/`, shared runtime in `tools/`, thin native activation.
- Extended three-dimension fitness constraint from trinity-only to all files
  carrying a fitness function. Updated doctrine in `practice-lineage.md` and
  `practice.md`.

## [algo-experiments] 2026-03-23 — Practice Core Structural Reform

- Extracted per-file provenance chains from trinity frontmatter into
  `provenance.yml` — a new seventh file in the Practice Core package.
  Trinity frontmatter now carries a pointer (`provenance: provenance.yml`)
  instead of the full array.
- Adopted three-dimension fitness constraints from oak-open-curriculum-ecosystem: line
  count (`fitness_ceiling`), character count (`fitness_ceiling_chars`), and
  prose line width (`fitness_max_prose_line`). All measure content only —
  frontmatter is excluded. The three dimensions form a constraint triangle
  that prevents gaming any single dimension.
- Introduced Learned Principles tiering: **axioms** (one-line, validated across
  3+ repos) and **active** principles (recent, with teaching narrative).
  Promotion happens during consolidation.
- Added Growth Governance section documenting provenance extraction and
  principles tiering as negative-feedback mechanisms.
- Deduplicated Meta-Principles from practice.md (replaced with cross-reference
  to the canonical list in practice-lineage.md §Learned Principles).
- Compressed validation scripts, sub-agent template, Practice Index template,
  and command adapter examples to structural specifications.
- Updated all "six files" references to "seven files" across the Core.

## [algo-experiments] 2026-03-23 — Practice Innovation Write-Back

- Added code-pattern exchange mechanism to the portable Core: template in
  `practice-bootstrap.md`, exchange guidance in `practice-lineage.md` and
  `practice.md`, consolidation step in the consolidation command
- Added four learned principles: repo-state enforcement needs its own proof
  layer; four kinds of truth; entry surfaces degrade by default; RED-first
  applies to repo-state enforcement
- Added session priority ordering (bugs → unfinished → new) to the portable
  bootstrap and the start-right command specification in lineage
- Added plan readiness levels (decision-complete vs session-entry-ready) to
  the bootstrap artefact model
- Added reference/research estate split guidance to the bootstrap
- Packaged 6 cross-repo-applicable code patterns into
  `.agent/practice-context/outgoing/patterns/`
- Added two new outgoing notes: multi-strand planning pattern and repo-audit
  as Practice enforcement

## [algo-experiments] 2026-03-23 — Strict Completeness and Exchange-Pack Guidance

- Promoted "strict and complete, everywhere, all the time" from local doctrine
  into the portable Practice Core blueprint and bootstrap guidance
- Clarified in the portable testing philosophy that complete proof belongs in
  the correct layer, not only in tests
- Added the learned pattern that Practice Context outgoing works best as an
  indexed support pack with note types separated by responsibility

## [algo-experiments] 2026-03-22 — Strict-and-Complete Tenet

- Added "strict and complete, everywhere, all the time" as explicit local canon
  rather than leaving strictness as an implied style preference
- Clarified that type precision is one of the clearest concrete expressions of
  this tenet
- Threaded the tenet into the testing doctrine so strictness means complete
  proof in the correct layer, not collapsing every proof type into tests

## [algo-experiments] 2026-03-22 — Test Boundary Clarification and Repo Audit Split

- Clarified that tests exist to prove behaviour and code-level engineering
  correctness, not to police tracked repo state or file layout
- Split static repo checks out of `pytest` into a dedicated repo-audit step so
  filesystem, text-estate, and wrapper-parity concerns use the correct tool
- Updated the local doctrine and quality-gate sequence to model repo audits as
  distinct from tests

## [algo-experiments] 2026-03-21 — Cross-Platform Surface Contract and Evidence Boundary

- Added a local cross-platform surface matrix as the operational contract for
  supported and unsupported platform mappings
- Clarified across the portable Core that `.agents/skills/` is a narrow
  portable skill and command-workflow layer, not evidence for blanket
  `.agents/` parity
- Added the portability-language refinement that portable does not mean
  symmetrical; unsupported states should be explicit rather than silent

## [algo-experiments] 2026-03-21 — Native Skill Surface Expansion

- Completed native skill-wrapper coverage for Cursor, Claude Code, Gemini CLI,
  and GitHub Copilot against the canonical `.agent/skills/` estate
- Normalised skill wrappers to a stricter thin-wrapper contract: frontmatter
  plus a single pointer body, with no wrapper-local headings or workflow logic
- Updated the artefact inventory, Practice bridge, and bootstrap guidance so
  native skill surfaces are modelled explicitly

## [algo-experiments] 2026-03-21 — Gemini Command Surface Integration

- Added Gemini `jc-*.toml` command wrappers for the full canonical command
  estate
- Clarified in the Core and local matrix that commands remain a distinct
  semantic surface repo-wide even when some platforms can converge them into
  skills
- Kept GitHub command wrappers explicitly unsupported rather than implied by
  omission

## [algo-experiments] 2026-03-21 — GitHub Reviewer-Agent Integration

- Added GitHub reviewer adapters matching the installed canonical reviewer
  roster exactly
- Documented GitHub Copilot reviewer wrappers as thin, read-only pointer
  surfaces rather than a second canonical source
- Updated the Practice bootstrap and local bridge to model GitHub reviewer
  adapters alongside Cursor, Claude, and Codex

## [algo-experiments] 2026-03-21 — Practice Surface Contract Tests and Parity Validation

- Added repository contract tests for the matrix, wrapper-family parity,
  explicit unsupported states, and thin wrapper shape
- Extended reviewer-platform parity checks so GitHub reviewer adapters are part
  of the executable contract
- Made surface discoverability itself testable from the Practice bridge, the
  active entry surface, and the research note

## [algo-experiments] 2026-03-21 — Practice Context Cross-Platform Write-Back

- Added an outgoing source pack, discoveries note, portable-versus-native
  surface note, and receiving-repo integration guide for the cross-platform
  tranche
- Kept the portable Core concise by routing source-heavy and contingent
  implementation lessons into `.agent/practice-context/outgoing/`
- Updated the outgoing Practice Context index so future receiving repos can
  find the new support material quickly

## [algo-experiments] 2026-03-19 — Repo Reframe and Source Absorption

- Reframed the repo around trading-input processing, Python research and
  validation, and multi-platform output adapters
- Added repo-wide context, market-data doctrine, research-methodology, and
  parity guidance as local canon
- Localised plan templates, experiment logging, and specialist-capability plans
- Removed dependency on the temporary imported source snapshot after
  translation into local artefacts

## [pine-scripts] 2026-03-18 — Practice Maturation & Ecosystem Write-Back

- Built full sub-agent component architecture: 6 components (subagent-identity, reading-discipline, review-discipline, dry-yagni, reviewer-team, default persona)
- Refactored all 5 reviewer templates to compose from components; removed duplicated universal content
- Created canonical plan structure with lifecycle directories (active/current/future/archive) grouped by domain
- Moved all existing plans to canonical locations with `.plan.md` naming
- Moved python-environment-setup from plans to `.agent/reference/` (not a plan)
- Wrote 4 documents back to the source practice ecosystem: field report, sub-agent component model proposal, practice maturity model, plan lifecycle refinement
- Extracted 2 code patterns: thin-adapter-pattern, component-composition-pattern
- Deep consolidation: verified DRY compliance (15/15 rules with consistent thin adapters), updated cross-references, cleaned stale identity.md stub
- Practice assessed at Level 3 (Self-Correcting) per the maturity model proposed back to the source practice ecosystem

## [pine-scripts] 2026-03-17 — Practice Infrastructure Hardening

- Applied DRY to principles.md: TDD stated once authoritatively, testing section references testing-strategy.md
- Fixed strategy-context-guardrails: moved inline content from `.cursor/rules/` to canonical `.agent/rules/`
- Created `.agents/skills/` cross-platform discovery layer (14 thin wrappers)
- Added `agent-files-are-infrastructure` rule and Cursor/Claude adapters
- Improved practice-bootstrap.md §Metacognition: added failure mode warnings (the "not even wrong" failure, the recursive failure, load-bearing affective break and grounding anchor)
- Added six new Learned Principles to practice-lineage.md (metacognition-as-technology, intent-over-mechanics, recursive-failure-mode, agent-files-are-infrastructure, .agents/-as-discovery-surface)
- Fixed practice.md parenthetical to be ecosystem-agnostic (no longer references "SDK, MCP servers, search system")
- Updated practice-index.md: added Rules section, GO.md prompt, `.agents/` directory
- Updated artefact-inventory.md with `.agents/` layer and corrected counts

## [pine-scripts] 2026-03-17 — Intent Transfer

- Rewrote ALL operational artefacts using the imported source substrate, preserving reasoning depth
- Replaced hollow metacognition directive with the real recursive metacognitive prompt
- Expanded principles.md, testing-strategy.md, invoke-code-reviewers.md, AGENT.md to carry full reasoning, anti-patterns, and escape-hatch closures
- Upgraded all 13 rules from 1-2 line stubs to compressed-but-complete arguments
- Upgraded all 9 commands from checklists to structured workflows
- Rewrote all 5 sub-agent templates to full review systems with delegation triggers, checklists, output formats, boundaries
- Created GO.md prompt with ACTION/REVIEW/GROUNDING cadence
- Key insight: integrating mechanics without intent produces correct-but-inert artefacts; the Practice works through reasoning embedded in every layer

## [pine-scripts] 2026-03-17 — Practice Core Integration

- Integrated full Practice Core into trading strategy research repo, replacing stub files
- Installed memory pipeline (napkin, distillation skills), universal skills (systematic-debugging, patterns, receiving-code-review), and prompts
- Added missing Cursor agent adapters and completed Claude command adapter coverage
- Upgraded practice-index to full table format
- Appended pine-scripts provenance entries to all three trinity files

## [castr] 2026-03-09

- Integrated portable Practice Core into a mature local repo Practice rather than a blank-slate hydration
- Confirmed `principles.md` as the authoritative doctrine name and aligned the local canonical-first structure around that distinction
- Added the structural learning that paused workstreams are distinct from `future/` backlog in mature repos
- Clarified that the portable agent architecture is installable in stages: the Core should distinguish canonical reviewer/domain-expert structure from a repo's current installation status
- Added provenance entries for Castr to the travelling trinity files

## [oak-open-curriculum-ecosystem] 2026-03-09

- Integrated new-cv round-trip: adopted Codex model, value traceability, six-file package, practice-context adjunct, napkin threshold 800→500
- Added `.codex/` to platform adapter lists throughout `practice.md` and `practice-bootstrap.md`
- Updated artefact map and review system to include Codex reviewer registration model
- Adopted value traceability as plan workflow point 5
- Replaced templates as required infrastructure with optional supporting artefacts
- Lowered napkin distillation threshold from ~800 to ~500 lines
- Removed repo-specific ADR references from portable files (routed via practice-index)
- Updated ADR directory path to generic "Repo's ADR directory" with practice-index reference
- Adopted expanded learned principles: documentation concurrent, value traceability, local norms, fitness everywhere, self-containment with practice-context
- Added Adaptation Levels, Restructuring path, and Validation scripts sections to `practice-lineage.md`
- Adopted `CHANGELOG.md` as the sixth Practice Core file
- Adopted practice-context adjunct pattern references

## [new-cv] 2026-03-09

- Added value traceability to the portable planning model: non-trivial work now has to state outcome, impact, and value mechanism
- Updated `practice-lineage.md` so the metacognition prompt and `plan` command both carry the outcome-to-value bridge explicitly
- Tightened `practice.md` to treat plan templates as optional supporting artefacts rather than a required `.agent/plans/templates/` layer
- Updated the bootstrap practice-index template so `.agent/plans/` no longer implies a mandatory templates subtree
- Added an optional `.agent/practice-context/` adjunct pattern with sender-maintained `outgoing/` support material and transient receiver-side `incoming/`; clear `incoming/` after integration and let agents consider supporting outgoing files when a changelog entry alone would be too thin

## [new-cv] 2026-03-08

- Clarified the portable Codex model: `.agents/skills/` is for skills and command-shaped workflows, while real Codex reviewer sub-agents live under `.codex/`
- Updated `practice.md` to include `.codex/` in the tooling layer, review-system description, and artefact map
- Updated `practice-bootstrap.md` so its adapter summary and reviewer-roster wording match the `.codex/` reviewer model
- Aligned the portable Practice wording with the repo's current Codex reviewer architecture

## [new-cv] 2026-03-06

- Added "Restructuring an Existing Practice" path to practice-lineage.md
- Expanded Ecosystem Survey to include practice maturity assessment
- Extended "Never overwrite" to cover domain-specific practice mechanisms
- Added routine cohesion audit to consolidation command specification
- Reframed underscore-prefix rule as ecosystem-agnostic principle
- Added this changelog
- Updated all "five files" references to "six files" across the Practice Core
- Removed vestigial ADR numbers (114, 117, 119, 124, 125) from practice.md and practice-bootstrap.md — concepts already described inline
- Fixed broken references: `schema-first-execution.md`, `invoke-code-reviewers`, `pnpm qg`
- Made non-canonical paths generic: ADR directory paths removed from the Practice Core (routed via `practice-index.md`)
- Aligned distillation threshold to ~500 lines across practice.md and practice-bootstrap.md
- Made portability check step ecosystem-agnostic in practice-bootstrap.md

## [new-cv] 2026-03-05

- First restructuring hydration: adopted the Practice Core into a repo with a mature platform-locked Practice
- Added provenance entries for new-cv to all three trinity files

## [oak-open-curriculum-ecosystem] 2026-02-28

- Ecosystem-agnostic hydration: labelled ecosystem-specific content
- Added cold-start path
- Aligned consolidation with concurrent documentation principle

## [oak-open-curriculum-ecosystem] 2026-02-27

- Adopted Practice Core structure, trinity concept, and bootstrap from round-trip

## [cloudinary-icon-ingest-poc] 2026-02-26

- Origin: initial Practice Core files created for short-lived POC

## [oak-open-curriculum-ecosystem] 2026-02-26

- Origin: initial Practice lineage created for production SDK ecosystem
