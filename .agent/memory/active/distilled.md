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
is the shared communication log at `.agent/state/collaboration/log.md`. The
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

## Tripwire rules need observable artefacts

A tripwire rule whose firing condition is "consult and decide X" is
unobservable post-hoc unless the decision is recorded as an artefact.
Compare against rules that are mechanically observable post-hoc (e.g.
build-breakage rule — the build is or is not green). When designing
a tripwire rule with a "decide" branch, require an artefact-leaving
step on every outcome (a logged decision, a `notes` field on a claim,
a shared-communication-log entry). Without it, the rule is satisfiable by
silent proceed and the audit trail at consolidation cannot tell consultation
from skip.

Three observed instances on this branch (WS0
`respect-active-agent-claims`; WS1 own-rule self-catch; WS1
absorption shape). PDR-029 amendment candidate awaiting owner
decision.

## Owner-directed pause is a load-bearing planning move

When an owner pauses a multi-workstream plan partway through to
accumulate evidence rather than forcing forward motion, the pause is
itself the correct execution. The reflexive "next workstream is
next" assumption can suppress the simpler answer: stop and let
evidence accumulate. Captures the practice's first question — *could
it be simpler without compromising quality?* — at the workstream-
sequencing level, not just within a single workstream.

When pausing: touch the source plan YAML todos + Status section, the
thread next-session record, repo-continuity Active Threads, the
roadmap Adjacent entry, and the current-plans README. Five-to-six
surfaces per pause is high enough to warrant a named ritual if
recurrent.

## Parallel reviewer dispatch is the right shape for substantive plans

For plans introducing new architectural surfaces (directories,
schemas, lifecycle mechanisms), dispatch reviewers in parallel rather
than sequentially. Different reviewer roles see different things:
adversarial structural reviewers (Wilma) catch boundary, threat-
model, and lifecycle gaps; pre-landing reviewers (`docs-adr-reviewer`,
`assumptions-reviewer`) catch substance-level errors that survive
structural review (broken paths inherited from imprecise plan-body
glosses; markdownlint violations; unobservable tripwires). Sequence:
structural review shapes the design; pre-landing review validates
the implementation faithfully embodies the design. Four parallel
lenses produced four orthogonal finding sets in WS1; sequential
dispatch would have been ~4× slower and produced the same set.

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

Specialist sub-agent review is standard and preferred evidence for
substantive work when the platform supports it. Review itself is not
automatically blocking; findings require explicit disposition. Blocking
findings, hard gate failures, and rule failures block closure. Non-blocking
findings still need implementation, rejection with rationale, or
owner-visible deferral evidence.

## ADR/PDR citation discipline

When citing an ADR or PDR by number, verify the filename and the
substance against the live decision-record file. Plan-body glosses are
shorthand, not authoritative — they can name an ADR/PDR by topic
without precisely matching the file's actual content. Inheriting a
plan body's gloss without verification produces broken links and
substantively misattributed citations.

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
- **Vendor-platform plans**: periodically scan the vendor's official docs
  for capabilities not yet represented in the plan. Internal review checks
  reasoning inside the plan's worldview; vendor-doc review finds the
  opportunity set the plan forgot to imagine. Record both newly adopted
  capabilities and informed declines so future agents do not rediscover
  the same surface.
- **Cross-system observability claims**: before investigating one system's
  behaviour, align all relevant artefacts first. For Vercel / Sentry /
  GitHub validation, compare local HEAD, origin, PR head, latest Vercel
  deployment SHA, and Sentry deploy/release metadata. If they disagree,
  establish which artefact is being tested before making runtime claims.

Captured in `feedback_workspace_first_for_diagnostics`,
`feedback_gh_pr_checks_over_brief`, and
`feedback_check_workspace_packages_before_proposing` (2026-04-26
session).

## Test fixtures must encode the production shape, not the code's expectation

If a test fixture and the production code agree on the wrong contract,
the tests pass and the bug ships. The `VERCEL_BRANCH_URL` bug
(2026-04-26) sat in plain sight for ~5 commits because the test
fixture was `https://feat-x-poc-oak.vercel.thenational.academy` and
the production code called `new URL(branchUrl).hostname` — both wrong
in the same direction. Real Vercel value is hostname only.

Anchor critical fixtures to **captured real production values** with
date-stamped citations to the source documentation. If the input
shape is documented, the fixture should match the docs literally;
if the input shape is captured from a real deployment, record the
deployment ID and date alongside the fixture. This is principles.md
§Test Data Anchoring made operational: *"Tests that agree with code
on the wrong contract are worse than no tests."*

## Constant-type-predicate pattern is half-applied without call-site uptake

ADR-153 (Constant-Type-Predicate Pattern) requires three components:
(1) `as const` runtime constant naming every value, (2) union type
derived structurally via `(typeof X)[keyof typeof X]`, (3) every call
site uses the constant rather than a magic-string literal. Adding (1)
and (2) without (3) leaves the pattern half-applied — the runtime
constant is dead code by knip's standards and `@typescript-eslint/no-unused-vars`
fires with "is assigned a value but only used as a type".

That lint rule isn't opposing the pattern, it's catching the
half-applied state. The fix is to complete the pattern, not to delete
the constant. A future custom rule (`no-bare-discriminator-union`, queued
in the recurrence-prevention plan) catches the symmetric failure mode (a
bare union exists with no backing constant) at the source-of-truth level.

## Config-load side effects must not require test-execution resources

Static analysis tools (knip, IDE indexing, depcruise) load config
files to discover entry points but do NOT run the tests those configs
describe. A vitest config that throws at module load when test-time
credentials are missing breaks the static-analysis tools too — even
when the tests it describes are correctly excluded from CI runs.

Defer credential / env validation to `setupFiles`, which only run
during actual test execution. The validation IS still required at
test time; just not at config-load time. Pattern: propagate the
validation error message via the config's `provide` block so the
setup file can re-check and throw with a clear message.

This applies symmetrically to ESLint configs, Prettier configs, and
any other tool config that does work at module-evaluation time. The
canonical instance: `apps/oak-search-cli/vitest.smoke.config.ts`
fixed in commit `f4bf2fa1`.

## Process

Planning-discipline entries in this section remain routed to the
`planning-specialist-capability.plan.md` plan until the Planning
expert triplet executes.

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
