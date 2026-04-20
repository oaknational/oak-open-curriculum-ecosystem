---
name: foundation overhaul timeless
overview: Overhaul `docs/foundation/` so each surviving document earns its place with a single timeless purpose. Remove `strategic-overview.md` and `quick-start.md` (both redundant), purge release-schedule and snapshot content from `VISION.md`, keep `agentic-engineering-system.md` largely intact, and rewrite the boundary `README.md`. Redirect every active in-repo link to the new structure.
todos:
  - id: rewrite-vision
    content: "Surgically rewrite VISION.md: keep timeless sections, extend Non-Goals with the learner-facing boundary, replace 'What We Deliver Today' with one timeless paragraph, delete the capability-status table, the 'What Changes At Public Alpha' section, and the 'Current baselines' snapshot table"
    status: completed
  - id: rewrite-foundation-readme
    content: Rewrite docs/foundation/README.md as a slim 30-line index for the new two-doc shape
    status: completed
  - id: delete-strategic-overview
    content: Delete docs/foundation/strategic-overview.md
    status: completed
  - id: delete-quick-start
    content: Delete docs/foundation/quick-start.md
    status: completed
  - id: bump-practice-doc
    content: Bump last_reviewed on docs/foundation/agentic-engineering-system.md
    status: completed
  - id: redirect-root-readme
    content: "Update root README.md: replace the two strategic-overview pointers and the quick-start 'Next steps' pointer"
    status: completed
  - id: redirect-contributing
    content: "Update CONTRIBUTING.md: drop or redirect both quick-start.md references"
    status: completed
  - id: redirect-docs-index
    content: Update docs/README.md foundation listing
    status: completed
  - id: redirect-active-surfaces
    content: Update remaining active surfaces (.agent/HUMANS.md, governance/architecture/engineering README boundary indexes, curriculum-guide.md, app READMEs, three operations/engineering/architecture docs, four active plans, onboarding-reviewer template) to remove or redirect strategic-overview/quick-start references
    status: completed
  - id: bump-adr-count-report
    content: Bump '130+ ADRs' to '160+' in the progress report
    status: completed
  - id: dispatch-reviewers
    content: Dispatch docs-adr-reviewer and architecture-reviewer-barney in parallel against the new structure
    status: completed
  - id: act-on-reviews
    content: Apply or summarise reviewer feedback
    status: completed
isProject: false
---

## Final shape of `docs/foundation/`

Three documents, each with one purpose. No statuses, no milestones, no baselines (those live in `.agent/plans/high-level-plan.md` and `.agent/reports/`).

- `README.md` — boundary index. Names the three docs, says who reads what, points outward.
- `VISION.md` — the **why**: mission, audiences, value, scope boundaries (including the no-learner-facing-surfaces-yet boundary), three-orders impact, positioning, licensing. Contains **no** roadmap, capability table, or current baselines.
- `agentic-engineering-system.md` — the **how**: an engineering-lens explanation of the Practice for human readers. Largely as-is.

Deleted:

- `strategic-overview.md` — its job (reading guide, milestone summary, Practice evidence, "beyond beta") is now split between VISION (timeless), the high-level plan (roadmap), the latest progress report (snapshot), and the Practice doc (engineering-lens explanation). No remaining purpose.
- `quick-start.md` — fully covered by [README.md](README.md) (Quick Start section, prerequisites, install/verify, key commands, architecture TL;DR, repo structure) and [CONTRIBUTING.md](CONTRIBUTING.md) (Contribution Levels with env-var detail, development process, quality gates, conventional commits, code standards, testing). The single piece not duplicated — the inline "Architecture TL;DR" text-diagram — is already in root README.

## VISION.md — surgery list

Authoritative reference: [docs/foundation/VISION.md](docs/foundation/VISION.md).

**Keep (timeless):**

- Intro and Oak framing (lines 1–26), minus the "Reading context" callout pointing at the to-be-deleted strategic-overview
- Two Audiences, One Vision (28–51)
- What This Repository Is For (53–67)
- Non-Goals (72–81) — **extend** with the deliberate-no-learner-facing-surfaces boundary we worked through in the progress report (one new bullet: "a surface that learners, including children, interact with directly — that work requires a separately governed safeguarding, moderation, and pedagogical-framing programme first")
- Strategic Integrations Ahead (138–151)
- Relationship With Aila (153–176)
- Investment Value For Oak (178–195)
- Impact Through Three Orders Of Effect (233–251)
- Positioning (253–257)
- Open Source And Licensing (259–269)
- Historical Positioning (271–279), trimmed

**Replace with one timeless paragraph:** "What We Deliver Today" (83–103) → keep the three-capability statement, drop "v1.0.0 released" and the agentic-engineering-system parenthetical detail (lives in the Practice doc).

**Delete outright (release-schedule / snapshot):**

- Capability Status (Current / Next / Later) table (105–123)
- What Changes At Public Alpha (M2) (125–136)
- How We Measure Impact's "Current baselines (March 2026)" table including the ADR count, MRR, gate-count snapshot (211–225). The leading/outcome indicator **framing** stays (vision-grade definition of success); only the dated values table goes.

**Update frontmatter:** `last_reviewed: 2026-04-20`. Title remains `Vision`.

## agentic-engineering-system.md — light pass

[docs/foundation/agentic-engineering-system.md](docs/foundation/agentic-engineering-system.md) stays. Single change: nothing in its body links to `strategic-overview.md` or `quick-start.md`, so no edits needed there. Bump `last_reviewed` to `2026-04-20`.

## README.md — rewrite

[docs/foundation/README.md](docs/foundation/README.md) becomes a 30-line index: lists VISION + Practice doc; signposts Practice Core / Practice Index / Agentic Engineering Hub; "Usage" block updated to drop quick-start and strategic-overview routes and instead route evaluators to VISION + latest report, contributors to root README + CONTRIBUTING, agents to `start-right-quick`.

## Link redirections (active surfaces only)

Archived material (`.agent/memory/archive/`, `.agent/plans/archive/`, `.cursor/plans/`) is left alone — it is historical record.

Files that need link updates:

- [README.md](README.md) lines 5, 22 — "Strategic Overview" pointers → replace with VISION pointer + high-level-plan pointer; line 125 — "full Quick Start Guide" link → replace with pointer to [CONTRIBUTING.md](CONTRIBUTING.md) and the section index
- [CONTRIBUTING.md](CONTRIBUTING.md) lines 53–54, 134–135 — `quick-start.md` references → drop or redirect to root README
- [docs/README.md](docs/README.md) — foundation section listing
- [.agent/HUMANS.md](.agent/HUMANS.md) — any references to the two deleted docs
- [docs/governance/README.md](docs/governance/README.md), [docs/architecture/README.md](docs/architecture/README.md), [docs/engineering/README.md](docs/engineering/README.md) — boundary indexes
- [docs/domain/curriculum-guide.md](docs/domain/curriculum-guide.md) — back-link to VISION
- [apps/oak-curriculum-mcp-streamable-http/README.md](apps/oak-curriculum-mcp-streamable-http/README.md), [apps/oak-search-cli/README.md](apps/oak-search-cli/README.md) — workspace READMEs
- [docs/operations/environment-variables.md](docs/operations/environment-variables.md), [docs/engineering/build-system.md](docs/engineering/build-system.md), [docs/architecture/openapi-pipeline.md](docs/architecture/openapi-pipeline.md) — three docs that link in
- Active plans (do not edit archive): [.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md](.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md), [.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md](.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md), [.agent/plans/architecture-and-infrastructure/current/doc-architecture-phase-a-immediate.plan.md](.agent/plans/architecture-and-infrastructure/current/doc-architecture-phase-a-immediate.plan.md), [.agent/plans/developer-experience/active/onboarding-simulations-public-alpha-readiness.md](.agent/plans/developer-experience/active/onboarding-simulations-public-alpha-readiness.md)
- [.agent/sub-agents/templates/onboarding-reviewer.md](.agent/sub-agents/templates/onboarding-reviewer.md) — sub-agent template

## ADR count touch-up

The progress report at [.agent/reference/work-to-date/oak-ecosystem-progress-and-direction-2026-04-20.md](.agent/reference/work-to-date/oak-ecosystem-progress-and-direction-2026-04-20.md) currently reads "130+ ADRs" (twice). Bump to "160+" in both places to match your VISION change.

## Reviewer pass

After edits, dispatch in parallel:

- `docs-adr-reviewer` — verify VISION is now genuinely timeless (no statuses, no roadmap), the README index is accurate, all redirected links resolve, and `.agent/reports/...` is the canonical landing for snapshot content.
- `architecture-reviewer-barney` (simplification-first) — sanity-check that we have actually reduced rather than displaced the work; verify the new boundary holds without immediately needing a fourth doc.

## Out of scope (not in this plan)

- Restructuring `docs/engineering/`, `docs/governance/`, or any other docs boundary
- Editing root `README.md` beyond the two link redirections and the Quick Start "Next steps" pointer
- Touching ADRs, the high-level plan, or any plan content
- Any content changes to `agentic-engineering-system.md` beyond the `last_reviewed` bump
