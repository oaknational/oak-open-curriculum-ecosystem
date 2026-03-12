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
- Re-loaded `distilled.md` and `napkin.md` before proceeding with any other work.

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
