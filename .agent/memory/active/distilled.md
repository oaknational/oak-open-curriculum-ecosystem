---
fitness_line_target: 200
fitness_line_limit: 275
fitness_char_limit: 16500
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs (ADRs, PDRs, governance, READMEs)"
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
is the shared communication log at `.agent/state/collaboration/shared-comms-log.md`. The
structured claims registry (WS1) lives at
`.agent/state/collaboration/active-claims.json`. Three foundational
behavioural rules are loaded as session-open tripwires:
[`dont-break-build-without-fix-plan`](../../rules/dont-break-build-without-fix-plan.md),
[`respect-active-agent-claims`](../../rules/respect-active-agent-claims.md),
and
[`register-active-areas-at-session-open`](../../rules/register-active-areas-at-session-open.md).
Knowledge and communication, not mechanical refusals — locks would be
routed around at the cost of architectural excellence.

The protocol is platform independent by design. Platform-specific
agent-team features may help build, inspect, or stress test the system,
but the repo-owned markdown/JSON/rules/commands/skills/hooks surfaces are
the operating substrate and must remain sufficient without platform-native
collaboration features.

Before adding a new always-visible coordination surface, widen the regular
state audit first. WS3A showed that active claims, closure history, decision
threads, unresolved decision requests, evidence bundles, and schema
validation became usable once `consolidate-docs` reported them together.
Structured state plus consolidation output is usually the first dashboard.

Split evidenced durability gaps from speculative coordination mechanisms.
WS3A claim-history / decision-thread work was grounded in real harvest
evidence; WS3B sidebar, timeout, and file-backed owner escalation remain
promotion-gated until async decision threads prove insufficient.

Tripwire-observable-artefacts entries graduated 2026-04-25 to
[PDR-029 v2 amendment][pdr-029].

Owner-directed pause as a load-bearing planning move graduated
2026-04-26 to [PDR-026 amendment][pdr-026].

Parallel reviewer dispatch and structural-then-pre-landing review
phasing graduated 2026-04-26 to [PDR-015 amendment][pdr-015].

ADR/PDR citation discipline remains live-distilled until enough
evidence accumulates to graduate to a PDR amendment or a rule:
when citing an ADR or PDR by number, verify the filename and the
substance against the live decision-record file rather than
inheriting plan-body shorthand.

## Workspace-first before external tooling or new infrastructure

Three failure modes share one shape and one fix. Before reaching for
external tools or proposing new code, exhaust workspace inventory:

- **Diagnostic failure investigation**: when remote tooling truncates
  (Vercel MCP, Sentry MCP, GitHub API), search the workspace for
  owner-provided artefacts (`vercel_logs/`, `test-results/`,
  `coverage/`) BEFORE retrying the same tool with bigger limits.
  The owner may have downloaded the complete artefact locally.
- **Brief enumeration of failing checks**: a brief listing failing PR
  checks is a snapshot from when the prior session closed. Run
  `gh pr checks <PR>` first; cross-check against the brief. Pre-existing
  red gates the brief omitted are still blocking — *all gate failures
  are blocking at all times, regardless of cause or location*
  (principles.md §Code Quality).
- **Infrastructure proposals**: before adding new Zod schemas /
  validation pipelines / helper modules, survey existing `core/` and
  `libs/` packages. `@oaknational/env` already has shared schema
  contracts; `@oaknational/env-resolution` already has the
  schema-validate-then-narrow flow; `@oaknational/build-metadata`
  already has the constant-type-predicate pattern in place. Extending
  existing infrastructure beats parallel implementations every time.
- **Vendor-platform plans**: see [PDR-033][pdr-033] and the pattern
  instance at [`patterns/vendor-doc-review-for-unknown-unknowns.md`][vendor-pattern].
  Vendor-doc review at plan time finds capability gaps;
  vendor-specialist reviewer dispatch at implementation time catches
  contract violations. Both review acts are routine, not exceptional.
- **Cross-system observability claims**: before investigating one system's
  behaviour, align all relevant artefacts first. For Vercel / Sentry /
  GitHub validation, compare local HEAD, origin, PR head, latest Vercel
  deployment SHA, and Sentry deploy/release metadata. If they disagree,
  establish which artefact is being tested before making runtime claims.

Captured in `feedback_workspace_first_for_diagnostics`,
`feedback_gh_pr_checks_over_brief`, and
`feedback_check_workspace_packages_before_proposing` (2026-04-26
session).

Test-fixtures-encode-production-shape doctrine graduated 2026-04-26
to [PDR-034][pdr-034].

Constant-type-predicate call-site uptake clause graduated 2026-04-26
to [ADR-153 amendment][adr-153] as Step 5 of the pattern.

Config-load-side-effects discipline graduated 2026-04-26 to
[ADR-164][adr-164].

## Process

Planning-discipline entries in this section remain routed to the
`planning-specialist-capability.plan.md` plan until the Planning
expert triplet executes.

### Drift recurs while authoring the enforcement of the principle it violates

Observing a drift pattern in a napkin is not immunity from it.
The accommodation gravity intensifies as session context grows;
the protective practice must intensify in step, not relax.
Documented across two same-day napkin entries (Vining Bending
Root morning, Pelagic Flowing Dock afternoon, both
[`napkin.md`](napkin.md) under 2026-04-27): the morning entry
named a "disposition-drift" pattern with four trigger words; the
afternoon entry IS the pattern, recurring three times in the
same session, this time while authoring the rule that bans it.

Trigger-word vocabulary expanded:

- Original four (stylistic, false-positive, out of scope, owner
  direction needed without analysis).
- New addition: **convention / language idiom / well-known name
  / canonical TS idiom** — common-pattern justifications are
  accommodations dressed as principles. The fix is to rename the
  variable or restructure the code, never to exempt the rule.

Operational additions:

- **Rule-writing is a high-vulnerability activity.** When
  authoring an enforcement rule, the friction the rule causes IS
  the rule's value. Resist softening. Inconvenient downstream
  work is the principle paying back; that's the contract.
- **Narrate the downstream cures aloud BEFORE writing the rule
  body.** Naming each inconvenient archetype-cure inoculates
  against silently softening the rule body.
- **Owner corrections are evidence of broader drift.** A catch on
  one line implies the surrounding work is drifting. After a
  correction, audit recent work for the same shape; don't just
  patch the named site.
- **Phase-boundary re-read of `principles.md` must be triggered,
  not remembered.** State aloud "phase boundary — re-reading
  principles.md," and DO it. Aspirational discipline failed today.
- **Parallel-agent dispatch under drift multiplies drift.** Agents
  inherit the dispatcher's framing. Hold work serially when own
  drift is active.

Pending graduation to a PDR amendment or new doctrine line at
next consolidation pass; this distilled entry is the live
description until then.

- **Learning before fitness**: capture, distil, graduate, and write the
  signal fully even when the destination file is near or over a fitness
  limit. Fitness limits are health signals. They route structural follow-up
  — refine, split, graduate, or adjust limits — but never justify starving
  the learning loop.
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
[adr-153]: ../../../docs/architecture/architectural-decisions/153-constant-type-predicate-pattern.md#amendment-log
[adr-164]: ../../../docs/architecture/architectural-decisions/164-config-load-side-effects.md
[pdr-015]: ../../practice-core/decision-records/PDR-015-reviewer-authority-and-dispatch.md#amendment-log
[pdr-026]: ../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md#amendment-log
[pdr-029]: ../../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md#amendment-log
[pdr-033]: ../../practice-core/decision-records/PDR-033-vendor-doc-review-for-unknown-unknowns.md
[pdr-034]: ../../practice-core/decision-records/PDR-034-test-fixtures-encode-production-shape.md
[vendor-pattern]: patterns/vendor-doc-review-for-unknown-unknowns.md
