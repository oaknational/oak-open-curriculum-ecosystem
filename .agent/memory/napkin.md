## Session 2026-03-14 — Agent system architecture and gap analysis

### What Was Done

- Added WS6 (review depth dimension) and WS7 (Practice Core integration) to
  the agent classification taxonomy plan. Depth tiers are vendor-neutral —
  canonical templates specify tier (deep/focused), platform adapters map to
  concrete models.
- Created Developer Experience specialist plan — four broad areas: code,
  repo, SDK, CLI ergonomics. Distinct from OOCE: OOCE owns contracts, DevX
  owns the experience of using them. AI agent DX is first-class.
- Created Reviewer Gateway Upgrade plan — broadens code-reviewer from "code
  quality reviewer that triages" to "Reviewer Gateway that also does baseline
  quality". Layered triage model, cluster delegation, coverage tracking.
- Ran full tech-stack gap analysis against the specialist roster. Routed all
  gaps: Zod patterns and codegen pipeline → OOCE (with explicit new sections),
  CI/CD → config-reviewer, Vercel → Express, secrets → security-reviewer.
  No new specialists needed.
- Added three-tier agent model to taxonomy plan: Gateway → Fast Agents
  (sentinel, scanner, validator, formatter) → Deep Specialists. Fast agent
  is a generic pattern, not just sentinels.
- Researched platform sub-agent invocation capabilities. Key finding:
  reviewer sub-agents are leaf nodes on ALL platforms (including Claude Code
  where only general-purpose type has Agent tool). Escalation must be via
  structured output recommendations, acted on by gateway.
- Created Manifest-Driven Adapter Generation plan — replace 100+ manual
  wrapper files with a single manifest + build script. Prerequisite for
  the taxonomy rename.
- Clarified cluster model: sweep clusters (quality — invoke all, sentinel
  tier, cheap) vs signal-routed clusters (architecture, domain, practice —
  gateway selects specific members based on change signals). No cluster
  coordinators — clusters are an organisational mental model, not a runtime
  indirection layer.

### Patterns to Remember

- Platform sub-agent capabilities differ fundamentally: Claude Code has
  Agent tool (but only for general-purpose type), Cursor has Task tool,
  Gemini has manual dispatch, Codex has passive skills. Design for the
  lowest common denominator: leaf-node agents with structured escalation.
- Sweep vs signal-routed clusters: if members are cheap (sentinel tier),
  invoke all — the cost of running all is less than reasoning about which
  to skip. If members are expensive (deep tier), route by signal.
- The "fast agent" generalization (beyond sentinel) enables scanners,
  validators, and formatters as first-class agent types with clear DoD,
  ACs, and reporting templates.
- Manifest-driven adapter generation should precede any large rename —
  it reduces WS3 from "manually rename 100 files" to "update manifest,
  regenerate".
- When doing gap analysis, map against actual package.json dependencies,
  not assumptions about what's used. Several expected gaps (Redis, Hono)
  turned out to be trivially small surfaces.

## Session 2026-03-13 — Domain specialist roster strategic planning

### What Was Done

- Designed the full specialist roster: 7 new ADR-129 triplets + 1 sub-specialist
  planned in `future/` with strategic plans, roadmap entries, and collection
  README updates.
- New specialists: Sentry, MCP+ (upgrade), Express, OOCE (repo avatar),
  Planning, TDD (with mutation testing sub-specialist).
- TDD specialist includes a terminology standardisation workstream with
  hard-gated sequencing: audit → remediation plan → execute remediation →
  propagate → THEN create triplet. Don't build on broken foundations.
- Mutation testing sub-specialist: surviving mutants → better architecture
  or better tests, NEVER mutation-specific test hacks. Four anti-patterns
  as hard rules.
- Updated roadmap with 9 adjacent entries (2 complete, 7 planned) and
  phase detail sections for each.

### Patterns to Remember

- When designing a specialist roster, map against the actual dependency stack
  first — don't guess what's needed, check package.json files.
- The "repo avatar" concept (OOCE) fills a real gap: architecture reviewers
  own boundaries, but nobody owned "are you using Result correctly?"
- TDD and test-reviewer have complementary timing: TDD guides approach at
  start, test-reviewer audits result after. Don't merge them.
- Mutation testing remediation must be architectural, not test-specific.
  If a test wouldn't exist without mutation testing, it's the wrong test.
- Terminology standardisation as a prerequisite (not a follow-up) prevents
  building specialists on inconsistent foundations.

## Session 2026-03-13 — Clerk specialist capability and operational tooling ADR

### What Was Done

- Created the full Clerk domain specialist triplet (ADR-129 pattern):
  reviewer template, skill, situational rule, plus platform adapters
  for Claude Code, Cursor, and Codex (12 files total).
- Defined scope boundaries: clerk-reviewer owns "using Clerk correctly",
  security-reviewer owns "exploitability", mcp-reviewer owns "MCP spec".
- Created ADR-137 (Specialist Operational Tooling Layer) — optional fourth
  layer for domain specialist triplets enabling agent-accessible CLI/MCP
  tools for live system interaction.
- Updated agent infrastructure plans: roadmap (CLK complete, OPS strategic),
  taxonomy plan (14 templates, clerk rename, ADR-137 non-goal), collection
  README (documents table, read order).
- Strengthened "No type shortcuts" rule in principles.md to explicitly ban
  overly broad user-defined type predicates (e.g. checking `typeof === 'object'`
  but claiming `value is SomeSpecificType`).
- Validated all quality gates: portability:check, subagents:check,
  markdownlint:root.

### Patterns to Remember

- Second instantiation of a pattern reveals what's reusable: the ES specialist
  was exploratory, the Clerk specialist was mechanical. The template structure
  is now proven.
- When a domain specialist has a live external system, document the operational
  tooling gap immediately (ADR-137) — don't wait for implementation.
- Skill adapters need platform coverage: `.cursor/skills/` and `.agents/skills/`
  adapters are required alongside `.agent/skills/` canonical files.
- The "or similar" clause in type rules is too vague for enforcement. Make
  banned patterns explicit with concrete examples.

## Session 2026-03-13 — Recovery plan implementation hardening

### What Was Done

- Implemented `semantic_recovery_next_steps` across canonical semantic-search
  execution surfaces without editing the generated plan artefact.
- Reconciled document authority and lane ownership across:
  - `semantic-search-recovery-and-guardrails.execution.plan.md`
  - `semantic-search-ingest-runbook.md`
  - `semantic-search.prompt.md`
  - `cli-robustness.plan.md` (explicitly superseded evidence-only lane)
- Hardened executable plan structure with missing acceptance criteria,
  deterministic validation blocks, task completion rules, and phase gates.
- Added explicit Phase 0 evidence-pack flow (`recovery-evidence/*`) including
  mapping snapshots, version inventory capture, target filtering
  (primary/sandbox), and staged-version selection constraints.
- Added deterministic salvage preconditions and triage sequencing:
  metadata/alias coherence before promote, mandatory readback before
  retry/rollback/unlock, and explicit alias partial-failure incident handling.
- Updated `docs/operations/elasticsearch-ingest-lifecycle.md` to align with
  runbook stop/go semantics, salvage preconditions, and closeout roster.
- Ran multiple read-only specialist reviewer rounds (`code-reviewer`,
  `docs-adr-reviewer`, `elasticsearch-reviewer`) and incorporated findings
  until no blocker/high findings remained.

### Patterns to Remember

- If a plan lane is superseded, update both frontmatter/todos and body headings;
  stale “in progress” headings create authority ambiguity even when status text
  is updated.
- For RED-phase closeout gates, document expected failure semantics explicitly;
  otherwise phase gates conflict with TDD intent.
- Evidence-pack procedures must be shell-safe end-to-end: if variables span
  multiple command blocks, enforce required variable checks (`:${VAR:?msg}`) to
  prevent silent miswrites.
- `_cat/indices` can seed candidate discovery, but promotion decisions need
  `_count` verification and target filtering to avoid primary/sandbox bleed.
- Post-mutation success criteria must include metadata coherence checks, not
  alias health alone, for this incident class.

## Session 2026-03-13 — Incremental refresh planning and multi-reviewer iteration

### What Was Done

- Researched Elasticsearch Serverless incremental update strategies using
  `elastic-docs` MCP and official documentation.
- Discovered critical Bulk API vs Update API distinction for `semantic_text`
  fields: Bulk API `update` preserves embeddings when `semantic_text` omitted;
  Update API re-runs inference on all `semantic_text` even when omitted.
- Created `semantic-search-scheduled-refresh.operations.plan.md` (supersedes
  `semantic-search-nightly-full-reingest.operations.plan.md`).
- Created ADR-136 (incremental refresh and Bulk API partial-update doctrine).
- Hardened `elasticsearch-reviewer.md` template with ADR-136 doctrine,
  data pipeline and update semantics checklist, index lifecycle checklist,
  success metrics section.
- Ran 3 full review rounds (docs-adr, all 4 architecture reviewers, ES expert)
  with iterative fixes per round.
- Consolidated `semantic-search.prompt.md` from 4 overlapping start sections
  to 1 authoritative sequence (266 → 177 lines).
- Added lock TTL/renewal forward-dependency to recovery plan Task 2.2.

### Patterns to Remember

- **Reindex API precision matters**: `_reindex` can target subsets (via
  `source.query`) AND can preserve embeddings. The correct rejection is
  "needs a destination index, not in-place" — took 3 review rounds to
  get precise.
- Multi-reviewer iteration converges: round 3 found far fewer issues than
  round 1. Diminishing returns suggest 2-3 rounds is the sweet spot.
- When 4 sections answer "where do I start?", consolidate to one
  authoritative sequence. Redundancy in entry points confuses fresh agents.
- Fred's plan/ADR boundary finding is a real pattern: plans duplicate ADR
  rationale for standalone readability, creating drift risk. Mitigation:
  reference the ADR, don't reproduce it; keep plan context minimal.
- Barney's benchmark gate (prove the saving before committing to dual-path
  complexity) is good discipline. Add stop/go gates before Phase 1 of any
  plan that introduces significant new complexity.
- When a downstream plan depends on a lock mechanism defined upstream,
  add a forward-dependency note in the upstream plan so the implementer
  designs the full contract (TTL, renewal) from the start.

## Session 2026-03-13 — Consolidate-docs recovery-lane alignment

### What Was Done

- Ran `/oak-mcp-ecosystem/jc-consolidate-docs` workflow across canonical
  semantic-search surfaces after promoting recovery as the primary lane.
- Updated cross-collection docs to remove lane-role drift and stale archive
  links:
  - `.agent/plans/semantic-search/roadmap.md`
  - `.agent/plans/semantic-search/README.md`
  - `.agent/plans/high-level-plan.md`
  - `.agent/milestones/m2-extension-surfaces.md`
  - `.agent/plans/semantic-search/archive/completed/search-cli-sdk-boundary-migration.execution.plan.md`
- Ran stale-link sweep for common failure classes (`active/` links that should
  be `archive/completed/`, and `.cursor/plans/*.plan.md` references in active
  planning surfaces).
- Checked platform-specific artefacts (`~/.claude/plans/*` and
  `~/.claude/projects/.../memory/*`) for recovery/nightly ingest doctrine not
  yet captured in repo docs; no new settled doctrine required extraction in
  this pass.
- Produced a fitness-ceiling line-count snapshot for key docs.

### Patterns to Remember

- When lane ownership changes (supporting -> primary), update all three
  planning strata together: collection README, roadmap, and high-level index.
- Archive-safe links matter even in historical context docs; completed plans
  should point to their archive location, not historical active paths.
- Platform-memory and platform-plan scans can validate "no missing doctrine"
  even when no extraction is needed; record the result explicitly.
- **Mistake logged**: started this run before re-reading `.agent/memory/napkin.md` / `.agent/memory/distilled.md`; fix
  was immediate re-grounding plus this explicit session note.

## Session 2026-03-12 — Semantic-search plan quality review

### What Was Done

- Ran a thorough review of the semantic-search session prompt plus two active
  executable plans for accuracy, completeness, and quality.
- Invoked specialist reviewers: `docs-adr-reviewer` and all four architecture
  reviewers (`barney`, `betty`, `fred`, `wilma`) in read-only mode.
- Consolidated findings into blocker/high/medium issues for next remediation pass.

### Patterns to Remember

- Markdown links in deep plan paths must use file-relative traversal (`../../..`)
  or code-formatted non-link paths; repo-root-like link targets such as
  `(.agent/...)` break when rendered from nested plan directories.
- Executable plan closure criteria must not allow "no new regressions" wording
  when baseline doctrine violations still exist; closeout should require explicit
  doctrine compliance where the lane claims boundary guardrails.
- If one plan declares no runtime dependency on platform-local artefacts, sibling
  plans in the same lane should avoid linking `.cursor/` paths as active
  dependencies.
- For architecture plans, acceptance criteria should avoid "remove or isolate"
  ambiguity where repository doctrine forbids compatibility layers.
- Consolidation pass found the recovery lane docs coherent; no additional doctrine extraction required from `.cursor/plans/` or `~/.claude/.../memory/` beyond what is already captured in active plans and ADRs.

## Session 2026-03-12 — Consolidation: plan extraction and fitness ceiling fixes

### What Was Done

- Slimmed `CONTRIBUTING.md` from 409 to 339 lines (ceiling 400) by replacing
  detailed code standards with links to governance docs
- Extracted boundary ownership matrix and fitness functions from completed
  boundary plan to ADR-134; archived plan to `archive/completed/`
- Archived completed ES specialist execution plan
- Created `docs/operations/elasticsearch-ingest-lifecycle.md` — permanent
  operational procedure for blue/green index lifecycle ingestion
- Graduated `.agent/memory/distilled.md` entries (ES doc count inflation, implementation-
  specific type guards) to permanent docs; brought from 190 to 185/200
- Fixed stale link in ES specialist current plan (archive path)
- Updated all cross-references after plan archive moves

### Patterns to Remember

- When archiving completed plans, update ALL references in: session prompts,
  active README tables, and sibling plans that link to the archived path.
- Operational procedures (validation sequences, failure classification,
  operator/agent contracts) belong in `docs/operations/`, not plans.
- Distilled.md entries that describe implementation details discoverable from
  code (`isPlainObject`, `extractStatusCode`) can be safely removed — they
  don't change agent behaviour.

## Session 2026-03-12 — Human-facing Practice engineering narrative

### What Was Done

- Created `docs/foundation/agentic-engineering-system.md` — a synthesis document
  explaining the Practice as an integrated engineering system for human readers.
- Added discoverable links from 5 entry points: root README, `.agent/HUMANS.md`,
  `.agent/README.md`, `docs/foundation/quick-start.md`, `docs/README.md`.
- Added Related links in ADR-119 and ADR-131.
- Fixed two pre-existing drift issues: README "five→six" portable files, and
  ADR-131 stale provenance claim (one round-trip → four repos, eight entries).
- Ran 6 specialist reviewer passes (2 rounds × 3 reviewers: onboarding, docs-adr,
  architecture-betty).

### Patterns to Remember

- Synthesis documents should link to authoritative sources, not re-explain. Use
  orienting paragraphs that frame the destination, not duplicate it.
- When adding a new human-facing document, update ALL discoverable entry points in
  the same commit — partial discoverability is a P1 onboarding friction.
- Hardcoded counts in documentation (e.g. "130+ ADRs", "16-agent roster") are
  drift risks. Use soft descriptors or link to the authoritative source.
- When multiple reviewers disagree on location (foundation/ vs engineering/ vs
  "don't create it"), resolve by audience alignment — who is the primary reader and
  what existing documents sit alongside?

## Session 2026-03-12 — Consolidate-docs stale-link and fitness sweep

### What Was Done

- Ran `/oak-mcp-ecosystem/jc-consolidate-docs` checks across plans, prompts,
  practice inbox, platform memory/plans, and fitness-ceiling documents.
- Confirmed practice inbox remains empty (`.agent/practice-core/incoming/`).
- Fixed stale cross-references after lifecycle moves (notably links that still
  pointed to root-level plan paths instead of `current/` or
  `archive/completed/`).
- Reviewed platform memory/plan artefacts (`~/.claude/projects/.../memory/*`,
  `~/.claude/plans/*`) and found no additional settled technical doctrine that
  required extraction into canonical repo docs in this pass.

### Patterns to Remember

- After plan relocation commits, run a focused stale-link sweep for old
  root-level plan paths; these are easy to miss in adjacent collections and
  research/icebox docs.
- Keep archive files immutable during stale-link cleanup unless explicitly
  asked; prioritise active/current/future and canonical guidance surfaces.
- Fitness ceilings are a reporting signal: record line-count status and
  over-ceiling files, but do not force structural splits in the same pass unless
  requested.

## Session 2026-03-12 — Commit format guardrails (commitlint)

### What Was Done

- Commit attempt failed because the commit message body exceeded the enforced
  line length (`body-max-line-length`).
- Rewrote the body into two concise lines under 100 characters and re-ran
  commit successfully.

### Patterns to Remember

- Treat commit messages as a validated interface: check header and body shape
  before running `git commit`, especially body line length and case rules.
- Prefer short, two-line body paragraphs for commitlint-safe messages unless
  extra detail is truly necessary.
- **Follow-up**: promote this into an explicit agent skill/checklist so commit
  format validation happens proactively before the first commit attempt.

## Session 2026-03-11 — Distillation and Consolidation Pass

### What Was Done

- Ran `/oak-mcp-ecosystem/jc-consolidate-docs` against current repo state after the
  pre-merge review execution.
- Archived the outgoing napkin to
  `.agent/memory/archive/napkin-2026-03-11.md` because the live napkin exceeded
  the distillation threshold.
- Confirmed practice inbox is empty (`.agent/practice-core/incoming/`).
- Checked stale-link classes; found `.cursor/plans` references only in historical
  archive artefacts and command docs, not in active planning surfaces.
- Ran fitness-ceiling checks and captured current over-ceiling documents for
  future split work.

### Patterns to Remember

- Consolidation sweeps should report stale `.cursor/plans/*` links in archived
  records as historical context, not mutate archive artefacts unless explicitly
  instructed.
- When a metric can represent both "real zero" and "missing resource", model the
  state explicitly or fail fast; do not silently coerce topology failures into
  numeric values.
- For CLI operational docs, keep command examples aligned with the actual
  execution substrate (`pnpm exec tsx` here) whenever pass-through runners change;
  stale `npx` guidance quickly becomes a support burden.
- Shared config precedence rules (`flag -> env -> fail`) should be extracted as a
  reusable pattern once proven in production commands, to prevent command-by-command
  drift.

## Session 2026-03-11 — Start-Right Quick Re-ground

### What Was Done

- Ran the `start-right-quick` workflow and re-read the required foundation
  directives (`AGENT.md`, `principles.md`, `testing-strategy.md`,
  `schema-first-execution.md`).
- Re-checked `.agent/practice-core/incoming/` and confirmed it is still empty.
- Re-loaded `.agent/memory/distilled.md` and `.agent/memory/napkin.md` before proceeding with any other work.

### Patterns to Remember

- When the user requests `/start-right-quick`, execute the full grounding flow
  immediately and explicitly confirm practice-core inbox status.

## Session 2026-03-11 — Consolidate Docs Sweep

### What Was Done

- Ran the `consolidate-docs` checklist sweep across plans, prompts, fitness
  ceilings, practice inbox, and platform plan/memory locations.
- Updated `.agent/prompts/semantic-search/semantic-search.prompt.md` to reflect
  the current live incident state (`versioned-ingest` metadata commit failure),
  replacing stale "code complete/dry-run first" guidance.
- Confirmed `admin ingest` removal and aligned prompt bootstrap command toward
  lifecycle validation (`admin validate-aliases`).

### Patterns to Remember

- Consolidation must refresh session-entry prompts whenever active plan status
  changes from "implementation complete" to "operational incident", otherwise
  next-session bootstrap guidance drifts immediately.

## Session 2026-03-11 — CLI Robustness Plan Refresh

### What Was Done

- Replaced `.agent/plans/semantic-search/active/cli-robustness.plan.md` with a
  concise executable refresh focused on remaining work only.
- Preserved completed Phases 0-3 as compact evidence and rewired active scope to
  Phase 5 (metadata contract remediation) plus Phase 4 closeout.
- Added deterministic validation commands for regeneration, lifecycle checks, and
  full gate execution.
- Ran a `docs-adr-reviewer` pass and incorporated findings (missing full-gate
  commands, explicit ADR target, deterministic refactor acceptance criteria, and
  specific key file paths).

### Patterns to Remember

- For "full quality gates" language, mirror the canonical `check` script or
  explicitly document exclusions; otherwise plans silently under-specify closure.
- Keep executable plans narrow once incident scope is known: historical detail is
  evidence, not active task prose.

## Session 2026-03-11 — Search CLI lint/type remediation

### What Was Done

- Investigated failure transcript from terminal `67.txt`; confirmed the key
  compound incident path was strict metadata mapping failure plus rollback/alias
  recovery failure.
- Fixed all active `@oaknational/search-cli` lint/type errors by:
  - replacing assertion-based bulk payload checks with dedicated type guards
  - splitting oversized functions in lifecycle command wiring
  - simplifying pass-through env typing and entry iteration
  - restructuring oversized verification test describe blocks
- Re-ran `@oaknational/search-cli` lint and type-check successfully.
- Ran targeted tests for ingestion verification helpers (`18/18` passing).
- Updated the refreshed robustness plan to explicitly cover rollback swap and
  alias-target failure branch validation.

### Patterns to Remember

- When a plan references one root failure (mapping drift), include coupled
  downstream failure branches (rollback build and alias target integrity) in
  acceptance criteria, or the incident closure is incomplete.

## Session 2026-03-11 — Plan handoff hardening

### What Was Done

- Updated `.agent/plans/semantic-search/active/cli-robustness.plan.md` to act
  as a standalone next-session entry point.
- Integrated deep review outcomes (code-reviewer plus targeted architecture
  reviewers) into the plan with two buckets: fixed findings and remaining
  obligations.
- Added explicit "Next Session Bootstrap" sequence with deterministic runtime
  validation commands and continuation criteria.

### Patterns to Remember

- For long-running incident lanes, plans must separate "fixed now" from
  "remaining closure gates" so the next session can resume without transcript
  archaeology.

## Session 2026-03-11 — Boundary doctrine hardening

### What Was Done

- Ran architecture-perspective reviews against both active plan documents with
  the explicit owner constraints:
  - semi-separate admin capability
  - read-only default consumers
  - future experiment support
- Updated `.cursor/plans/search_cli-sdk_boundary_diagnosis_833a74ec.plan.md`
  to encode capability tiers (`read` / `admin` / `experiments`) and add
  blocking fitness functions.
- Updated `.agent/plans/semantic-search/active/cli-robustness.plan.md` with
  explicit boundary guardrail tasking and done-criteria so incident closeout
  cannot ignore boundary safety.

### Patterns to Remember

- If user constraints are privilege- or capability-oriented, represent them as
  enforceable architecture contract rules and fitness functions, not prose
  aspirations.

## Session 2026-03-11 — Boundary implementation plan promotion

### What Was Done

- Implemented the diagnostic boundary plan by creating
  `.agent/plans/semantic-search/active/search-cli-sdk-boundary-migration.execution.plan.md`
  as the executable follow-on artefact.
- Completed all active todo items in order:
  as-is map, to-be contract, violation catalogue, excellence criteria, and
  ADR/documentation targets.
- Updated discoverability surfaces so the new plan is reachable from:
  - `.agent/plans/semantic-search/active/README.md`
  - `.agent/plans/semantic-search/roadmap.md`
  - `.agent/plans/semantic-search/README.md`
  - `.agent/prompts/semantic-search/semantic-search.prompt.md`
- Ran reviewer passes (`code-reviewer`, `docs-adr-reviewer`, `architecture-reviewer-fred`),
  fixed the flagged issues, and re-ran reviewers to no blocking findings.

### Patterns to Remember

- When a diagnostic plan is marked "do not edit", resolve pending doctrine
  dependencies in the new implementation plan explicitly rather than mutating
  the source diagnostic artefact.
- Boundary plans should name the lint enforcement mechanism precisely
  (shared rule factory vs app wiring) and include positive/negative proof
  fixtures for each boundary class.
- Keep plan discoverability in sync across all navigation layers
  (`active/README`, collection `README`, roadmap, and session prompt) to avoid
  stale entry points.

## Session 2026-03-11 — Prompt strict consolidation

### What Was Done

- Ran a strict consolidation pass for semantic-search session entry surfaces:
  - `.agent/prompts/semantic-search/semantic-search.prompt.md`
  - `.agent/plans/semantic-search/active/search-cli-sdk-boundary-migration.execution.plan.md`
- Reduced prompt size by removing long-term historical/reference duplication and
  keeping only short-term operational bootstrap, ordering, and lane links.
- Re-pointed doctrine authority from Cursor-local diagnostic artefact to
  canonical `ADR-134` in the execution plan to avoid platform-local dependency.
- Fixed operational clarity gap by replacing a non-existent section reference
  ("Re-entry Checkpoint") with explicit instruction to append a dated bullet under
  the existing `Next Session Bootstrap` section in `cli-robustness.plan.md`.

### Patterns to Remember

- Session prompts should not carry completed phase narratives; keep those in
  ADRs, roadmap, and archived plans, and link out.
- Canonical `.agent/` plans should not depend on `.cursor/` paths for active
  workflow continuity; treat platform-local artefacts as historical context only.
- Doc-consolidation gotcha: avoid mechanical command renames in prose checks;
  `admin count` is parent `_count` only, while Lucene inflation checks belong
  to `_cat/indices`.
