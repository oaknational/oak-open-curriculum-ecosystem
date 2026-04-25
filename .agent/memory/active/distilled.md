---
fitness_line_target: 200
fitness_line_limit: 275
fitness_char_limit: 16500
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs (ADRs, governance, READMEs); this is the specialist refinement layer"
---

# Distilled Learnings

Hard-won rules extracted from napkin sessions. Read this before every session.
Every entry earned its place by changing behaviour.

**Source**: Distilled from archived napkins
`napkin-2026-02-24.md` through `napkin-2026-04-25.md`
(sessions 2026-02-10 to 2026-04-25).

**Permanent documentation**: Entries graduate to permanent
docs when stable and a natural home exists. Always graduate
useful understanding — fitness management handles the
consequences. What remains here is repo/domain-specific
context with no natural permanent home.

---

## User Preferences

- Plans must be **discoverable** (linked from README, roadmap,
  AND session prompt) AND **actionable** (status tracking tables,
  completion checklists, resolved open questions).

Collaboration-specific entries formerly in this section graduated
to the [user-collaboration directive][user-collaboration] on 2026-04-24.
The merge-blocking simplification preference also lives there now.

## Multi-agent collaboration

The agent-to-agent working model lives in
[`agent-collaboration.md`][agent-collaboration]. The discovery surface
is the embryo log at `.agent/state/collaboration/log.md`. Two
foundational behavioural rules are loaded as session-open tripwires:
[`dont-break-build-without-fix-plan`](../../rules/dont-break-build-without-fix-plan.md)
and
[`respect-active-agent-claims`](../../rules/respect-active-agent-claims.md).
Knowledge and communication, not mechanical refusals — locks would be
routed around at the cost of architectural excellence.

## Reviewer phasing

Different reviewer roles see different things. Adversarial structural
reviewers (Wilma) catch boundary, threat-model, and lifecycle gaps but
are not designed to validate citation correctness. Pre-landing
reviewers (`docs-adr-reviewer`, `assumptions-reviewer`) catch the
substance-level errors that survive structural review (broken
ADR/PDR paths inherited from imprecise plan-body glosses; markdownlint
violations; unobservable tripwires). Sequence: structural review
shapes the design; pre-landing review validates the implementation
faithfully embodies the design.

## ADR/PDR citation discipline

When citing an ADR or PDR by number, verify the filename and the
substance against the live decision-record file. Plan-body glosses are
shorthand, not authoritative — they can name an ADR/PDR by topic
without precisely matching the file's actual content. Inheriting a
plan body's gloss without verification produces broken links and
substantively misattributed citations.

## Process

Planning-discipline entries in this section remain routed to the
`planning-specialist-capability.plan.md` plan until the Planning
expert triplet executes.

- **Lead with narrative, not infrastructure**: on a multi-workstream
  initiative, write the ADR and README first. WS-0 (narrative) →
  WS-1 (factory) → WS-2+ (consumers).
- **Narrative sections drift first**: when syncing plan state,
  inspect body status lines, decision tables, and current-state
  prose — not just frontmatter and todo checkboxes.
- **Reconcile parent when child changes runtime truth**: a child
  plan that evolves runtime architecture must reconcile the parent
  plan and closure proof in the same session.
- **CLI-first enumeration before owner questions**: research
  the generic REST surface (`sentry api`, `clerk api`, vendor-
  equivalent) before raising any owner question about observability
  or infrastructure state. "The specialist tool doesn't surface X"
  ≠ "X is unknowable from automation." **Extends to workstream
  sizing**: when owner direction names a repo-level mechanism
  (build cancellation, env-var policy, release resolution),
  search the repo for prior implementation before sizing a
  workstream. "Stated many times" or "should already be true"
  signals the substance may exist and the gap is
  documentation/linkage, not implementation.
- **Validation closures: produce locally-producible evidence
  first**. For deployment validation lanes, generate every
  locally-producible proof under a session-specific release tag
  before asking. Only ask for owner action when tooling cannot
  reach the artefact.
- **Split client-compatibility out of deployment-validation
  lanes**: a client-specific compat issue emerging in an active
  deployment-validation lane spins into its own follow-up plan.
  Shared preview infra ≠ shared plan ownership.
- **Dry-run multi-step workflows against accumulated state** before
  committing to the recipe; produces *proceed* or *stage differently*.

Non-planning process entries graduated on 2026-04-24 to:
`validate-full-target-estate`, `read-diagnostic-artefacts-in-full`,
`consolidate-at-third-consumer`, `generator-first-mindset`,
`documentation-hygiene`, reviewer doctrine, build-system doctrine,
practice verification, and the collaboration directive.

## Architecture (Agent Infrastructure)

<!-- "Implicit architectural intent is not enforced principle" graduated
2026-04-19 — codified as ADR-162 (Observability-First), now Accepted. -->

Agent-infrastructure portability entries graduated on 2026-04-24 to PDR-009
and ADR-125. Live counts are enforced by `pnpm portability:check`, not
repeated here.

## Repo-Specific Rules

The `src/bulk/generators/` / `vocab-gen/generators/` duplication is
deferred to the SDK codegen decomposition plan for a separate session:
`plans/architecture-and-infrastructure/codegen/future/sdk-codegen-workspace-decomposition.md`.

## Build System (Domain-Specific)

Build-system entries graduated on 2026-04-24 to
[`docs/engineering/build-system.md`][build-system].

[user-collaboration]: ../../directives/user-collaboration.md
[agent-collaboration]: ../../directives/agent-collaboration.md
[build-system]: ../../../docs/engineering/build-system.md
