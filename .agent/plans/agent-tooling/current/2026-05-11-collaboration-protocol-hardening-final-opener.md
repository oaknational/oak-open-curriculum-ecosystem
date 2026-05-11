---
name: "Collaboration Protocol and Tooling Hardening — FINAL Session Opener"
overview: "Final session in the collaboration-protocol hardening arc. Predecessor session (Deciduous Twining Dew, 2026-05-11) executed Phases 0-3 partial: ground-state + friction audit + remediation design + R6 §Coordinator Role doctrine landed (9b619a05). This session lands the queued remediations test-first, runs the four-probe validation matrix (Phase 4), and closes the arc (Phase 5). One owner-direction-needed item must be surfaced and resolved before any code lands: R1 schema-mix fix shape."
type: session-opener
status: current
thread: agentic-engineering-enhancements
parent_plan: ".agent/plans/agent-tooling/current/primary-agent-tooling-enhancements.plan.md"
predecessor_opener: ".agent/plans/agent-tooling/current/2026-05-11-collaboration-protocol-hardening-opener.md"
predecessor_session: "Deciduous Twining Dew / claude-code / claude-opus-4-7-1m / a12c90 / 2026-05-11; commits 9b619a05 (R6 doctrine), 70507d72 (session close), 4186d761 (handoff + consolidation)"
sibling_plans:
  - ".agent/plans/agent-tooling/current/multi-agent-collaboration-protocol.plan.md"
  - ".agent/plans/agent-tooling/current/multi-agent-collaboration-sidebar-and-escalation.plan.md"
  - ".agent/plans/agent-tooling/current/collaboration-state-write-safety.plan.md"
  - ".agent/plans/agent-tooling/current/multi-checkout-merge-handling-for-fitness-files.plan.md"
last_updated: 2026-05-11
isProject: false
specialist_reviewers:
  - assumptions-expert
  - architecture-expert-betty
  - architecture-expert-wilma
  - code-expert
  - test-expert
  - type-expert
  - docs-adr-expert
foundation_alignment:
  - .agent/directives/principles.md
  - .agent/directives/agent-collaboration.md
  - .agent/directives/testing-strategy.md
  - .agent/directives/schema-first-execution.md
todos:
  - id: phase-0-resume-ground-state
    content: "Read the predecessor opener, repo-continuity §Current Session Focus (the Deciduous Twining Dew block), and the ephemeral design artefacts at /tmp/phase-{0,1,2}-*.md (if still present on this host) OR reconstruct the substance from this opener's body alone (the opener is self-contained). Register session claim covering the agent-tools source paths, .git/hooks (or .husky/), agent-collaboration.md, and the parent plan."
    status: pending
  - id: phase-3a-r1-shape-decision
    content: "Surface the R1 schema-mix fix shape to the owner FIRST. Three architecturally-excellent options: (A) split directories — comms-events/ narrative, comms-messages/ for directed messages; (B) widen parser with discriminator field on each event; (C) deprecate directed-message schema in favour of narrative. No cheap-cure option. Block on owner decision; do not proceed to landing until resolved."
    status: pending
    depends_on: [phase-0-resume-ground-state]
  - id: phase-3b-cli-test-first-fixes
    content: "Land R1 (per owner direction from 3a), R2 (B-10 shell-mangling — investigate first), R3 (identity caching for wordlist drift) as separate atomic test-first commits. Each: failing test + product fix in one commit. Reviewer dispatch per commit: code-expert + test-expert + type-expert if generated types touched."
    status: pending
    depends_on: [phase-3a-r1-shape-decision]
  - id: phase-3c-commit-discipline-landings
    content: "Land R4b (commit-skill mandates pathspec — single atomic doc + any helper script change) and R4-new (native git pre-commit hook in .husky/pre-commit validating commit pathspec at git-object-write time — hook + tests atomic). NOT R4a; per ORD-2 R4a is dropped — Wilma's 6 critical bypasses on the PreToolUse Bash hook make it not structurally sound alone."
    status: pending
    depends_on: [phase-3a-r1-shape-decision]
  - id: phase-3d-r5-path-beta-migration
    content: "Land R5 Path β migration in five sub-steps as defined in the predecessor design: (5.0) retire evaluateSharedCommsLog evaluator, update SHARED_COMMS_LOG + DEFAULT_SHARED_LOG constants in live-types.ts:13 / cli-comms-commands.ts:14 / live-json.ts:102-117, update or remove the fitness-gate test for collaboration-shared-comms-log — test-first; (5.1) round-trip migration script for 299 timestamp-matched markdown entries → JSON with golden-output test; (5.2) reconcile the 6 B-01-damaged events using the fixed comms append; (5.3) git rm shared-comms-log.md + sweep references in .agent/directives/, .agent/rules/, .agent/skills/, .agent/memory/, plans, READMEs, top-level docs; (5.4) single atomic agent-collaboration.md doc-sweep commit post-R6 (R6 already landed)."
    status: pending
    depends_on: [phase-3b-cli-test-first-fixes]
  - id: phase-3e-tail-items
    content: "R7 (B9 fitness-gate staged-set-awareness follow-on plan stub authorship — queue plan in agent-tooling/current/, no fix this session); R8 (claim-overlap-revert-and-handoff pattern capture in .agent/memory/active/patterns/ with frontmatter per the pattern README)."
    status: pending
    depends_on: [phase-3d-r5-path-beta-migration]
  - id: phase-4-four-probe-matrix
    content: "Synthetic multi-agent validation across the four-probe matrix from the predecessor opener (Wilma seat earned): (a) file-scope-overlap; (b) commit-discipline violation (deliberate bare git commit against populated index — should now be blocked structurally by R4-new); (c) injected red-gate (peer file deliberately RED); (d) session-end-mid-flight. The 3-agent disjoint-scope dry-run is a smoke-test prelude. Dispatch architecture-expert-wilma adversarially across all four probes."
    status: pending
    depends_on: [phase-3e-tail-items]
  - id: phase-5-closeout
    content: "Update friction register; mark collaboration-protocol plan statuses; mine doctrine into permanent surfaces per the two pending-graduations entries surfaced by the predecessor session (cross-schema-directory-discriminator; owner-re-decision-on-evidence-refuted-premise) IF second instances landed during this session; refresh thread next-session record; full consolidation pass per /jc-consolidate-docs."
    status: pending
    depends_on: [phase-4-four-probe-matrix]
---

# Collaboration Protocol and Tooling Hardening — FINAL Session Opener

**Last updated**: 2026-05-11
**Status**: opener for the FINAL session in the collaboration-protocol hardening arc
**Thread**: `agentic-engineering-enhancements`

## Why this session exists

The predecessor session (Deciduous Twining Dew, `a12c90`, 2026-05-11)
executed Phases 0-3 partial: ground-state compiled (13 protocol
promises / 10 30-day frictions / 8 gaps); friction audit categorised
by remediation layer; remediation design crystallised across five
reviewer dispatches (assumptions-expert ×2,
architecture-expert-betty, architecture-expert-wilma,
docs-adr-expert); three owner-direction items resolved (OD-1 / OD-2 /
OD-3); two owner re-decisions taken (ORD-1 Path β on evidence
refutation; ORD-2 Shape B drops R4a Bash hook); R6 §Coordinator Role
doctrine landed at `9b619a05`. **This session lands the queued
execution work and closes the arc.**

The opener carries the load-bearing substance from the predecessor's
ephemeral design at `/tmp/phase-{0,1,2}-*.md`. If those /tmp files
still exist on this host, they are richer evidence; this opener is
intentionally self-contained so the substance is not lost when /tmp
clears. **The parent plan
[`primary-agent-tooling-enhancements.plan.md`](primary-agent-tooling-enhancements.plan.md)
§Bugs carries the corrected B-01 diagnosis (schema-mix root cause,
not the original `--now`-not-populating-`created_at` framing).**

## Open owner-direction item — surface FIRST

**R1 schema-mix fix shape.** B-01 was misdiagnosed in the predecessor
session; the real cause is the `comms-events/` directory carrying two
incompatible schemas without a discriminator. Two pre-existing events
(`3882213c-…`, `b0353884-…`) use a directed-message schema
(`timestamp / from / to / subject / kind / schema_version`) and trip
`parseCommsEvent` (which expects the narrative
`created_at / author / title / body`) during the `renderComms` step
of `sendComms`. The write path is sound.

Three architecturally-excellent fix shapes; owner picks:

- **Shape A — Split directories**: `comms-events/` for narrative
  events, new `comms-messages/` directory for directed messages.
  Single-schema-per-directory; readers know what they get without
  discriminator field. Migrate the 2 message-shape events into
  `comms-messages/`; update any code referencing them.
- **Shape B — Widen parser with discriminator field**: keep one
  directory; add explicit `event_type: "narrative" | "directed"`
  discriminator to every event JSON; `parseCommsEvent` dispatches on
  it. Schema-evolution major-version bump because the field is now
  required.
- **Shape C — Deprecate directed-message schema in favour of
  narrative**: rewrite the 2 directed-message events as narrative
  entries; remove the directed-message shape entirely from the
  protocol. Loses the explicit `to:` routing affordance unless the
  narrative schema is extended to carry it.

**Block on owner decision before any code lands.** Per principles, do
not surface a cheap-cure option (e.g. "just skip non-narrative events
in `renderComms`"); that is the symptom-hiding shape and it is
categorically excluded.

## Foundation reading

Before substantive work:

1. [`AGENT.md`](../../../directives/AGENT.md) — operational entry point.
2. [`principles.md`](../../../directives/principles.md) — architectural
   excellence over expediency; replace-don't-bridge; fail loud; TDD as
   design.
3. [`agent-collaboration.md`](../../../directives/agent-collaboration.md) —
   newly amended at HEAD with §Coordinator Role per OD-3.
4. [`testing-strategy.md`](../../../directives/testing-strategy.md) —
   test-and-product-code-land-together invariant applies to every
   landing in this session.
5. This opener's predecessor at
   [`2026-05-11-collaboration-protocol-hardening-opener.md`](2026-05-11-collaboration-protocol-hardening-opener.md)
   — the framing-amended version is on HEAD; read for the Phase 4
   four-probe matrix spec.
6. Parent plan
   [`primary-agent-tooling-enhancements.plan.md`](primary-agent-tooling-enhancements.plan.md)
   — corrected B-01 diagnosis at §Bugs.
7. Predecessor session's repo-continuity §Current Session Focus block
   for full session arc + reviewer findings.

## Queued landings (final session execution)

Pre-conditions: branch clean; claim covers each touched file.

### R1 — Schema-mix fix (owner-direction-needed first)

Per the owner-direction outcome above. Test-first: failing test that
reproduces the parse failure on the 2 pre-existing message-shape
events; product fix per chosen shape; atomic commit.

### R2 — B-10 shell-mangling investigation

Determine whether the comms event content corruption is shell
interpolation at invocation time (caller responsibility — document
only) vs CLI argv handling (CLI bug — fix). If CLI bug: test-first
fix.

### R3 — Identity caching for wordlist drift

PDR-027 identity is derived from `session_id` via wordlist. When the
wordlist file is refactored mid-session, re-derivation yields a
different `agent_name`. Cache the derived `(name, prefix)` pair in a
session-scoped env var (e.g. `PRACTICE_AGENT_NAME_CLAUDE`) at first
derivation; subsequent calls return cached value if env-var present
and `session_id_prefix` matches. Test-first: simulate wordlist
content change between two derivations of the same `session_id`;
assert second derivation returns cached first-derivation name.

### R4b — Commit-skill mandates pathspec

Single atomic doc + any helper script change. Update
[`.agent/skills/commit/SKILL-CANONICAL.md`](../../../skills/commit/SKILL-CANONICAL.md)
to require pathspec input and always issue `git commit -- <pathspec>`.
Refuse bare `git commit` invocations within the skill flow. Reviewer:
docs-adr-expert.

### R4-new — Native git pre-commit hook for pathspec enforcement

`.husky/pre-commit` (or `.git/hooks/pre-commit` if husky is not the
chosen path) validates the commit invocation's pathspec at
git-object-write time. Atomic with respect to the commit; escapes
shell-expansion + race problems that defeated R4a in Wilma's review.
Test plan: hook test with fixture index + fixture commit_queue;
failing case = bare commit with foreign-stage; passing case =
`git commit -- <files>` matching enqueued bundle. Reviewer:
code-expert + test-expert + architecture-expert-wilma (adversarial
probe of bypass surfaces: native hooks are tighter but not perfect).

### R5 Path β — Round-trip + delete migration

Five sub-steps; **R5.0 MUST land first**:

- **R5.0** (test-first): retire `evaluateSharedCommsLog` evaluator at
  `agent-tools/src/practice-substrate/live-json.ts:102-117`; update
  `SHARED_COMMS_LOG` constant at `live-types.ts:13` and
  `DEFAULT_SHARED_LOG` at `cli-comms-commands.ts:14` (or remove —
  fitness-gate test for `collaboration-shared-comms-log` updated or
  deleted atomically). Without R5.0, R5.1 immediately breaks the
  fitness gate and the `comms render` default path.
- **R5.1** (test-first): scripted round-trip of 299 markdown entries
  → JSON; golden-output test asserting `comms render` of the new
  JSON matches the original markdown for those 299 entries.
- **R5.2** (depends on R1): reconcile the 6 markdown-only entries
  (2026-05-10/11) by reconstructing JSON events with correct
  `created_at` via the post-R1 fixed `comms append`.
- **R5.3**: `git rm shared-comms-log.md`; sweep all references in
  `.agent/directives/`, `.agent/rules/`, `.agent/skills/`,
  `.agent/memory/`, plans, READMEs, top-level docs to point at
  `comms-events/` + ephemeral `comms render` view.
- **R5.4**: single atomic `agent-collaboration.md` doc-sweep commit
  covering all hunks (line 317 `[log]` reference + §Channels prose
  - any other hunks). R6 already on HEAD; no R6↔R5 interleaving
  risk.

Reviewer: architecture-expert-betty (cohesion of JSON-canonical
move), code-expert, test-expert.

### R7 — B9 plan stub authorship

Fitness-gate staged-set-awareness is non-trivial: whole-tree gates
produce reliability by design; making them staged-set-aware shifts
the contract. Cure may be "make blocking-on-peer-files a first-class
signal" or "fitness-tier promotion of informational gates" rather
than gate-shape change. Author a follow-on plan stub in
`agent-tooling/current/` naming the design questions; do NOT attempt
fix this session.

### R8 — Pattern capture

Append entry to `.agent/memory/active/patterns/` per the
[pattern README schema](../../../memory/active/patterns/README.md)
capturing the claim-overlap-revert-and-comms-handoff resolution
shape (Shaded Rustling Pollen vs Sylvan Fruiting Glade 2026-05-10).
Small commit, separate from anything else.

## Phase 4 — four-probe validation matrix

Per the predecessor opener's amended Phase 4 spec, four probes:

1. **File-scope-overlap probe**: two agents on overlapping workspace
   files; verify format-loop / commit-queue collisions are observed
   and handled per the §Coordinator Role doctrine; check that
   coordinator-role spontaneous claim works.
2. **Commit-discipline violation probe**: deliberate bare `git commit`
   against a populated index by a synthetic agent; expect R4-new
   native git pre-commit hook to block atomically.
3. **Injected red-gate probe**: peer file deliberately RED (failing
   test or lint violation introduced); two agents attempting commits
   to non-overlapping scopes; verify R7's B9 surface IS still a real
   seam (not cured by R4-new alone — the B9 plan should explicitly
   name this finding).
4. **Session-end-mid-flight probe**: one agent ends session leaving
   pre-staged files; next agent opens session; verify the
   register-active-areas-at-session-open rule + stage-by-explicit-
   pathspec rule + R4-new hook combine to prevent absorption.

Dispatch architecture-expert-wilma adversarially across all four
probes per the predecessor matrix.

## Phase 5 — closeout

- Update `.agent/memory/operational/pending-graduations.md` to mark
  either pending entry `graduated` (if a second instance landed
  during this session) or leave `pending`.
- Mark sibling plans (`multi-agent-collaboration-protocol.plan.md`,
  `multi-agent-collaboration-sidebar-and-escalation.plan.md`,
  `collaboration-state-write-safety.plan.md`,
  `multi-checkout-merge-handling-for-fitness-files.plan.md`) for
  status updates as the landings affect them.
- Refresh thread next-session record (
  `threads/agentic-engineering-enhancements.next-session.md`) — this
  session SHOULD close the collaboration-protocol hardening arc; the
  next-opener pointer at the top of the thread record retires.
- Run `/jc-consolidate-docs` full pass.
- **Arc closure announcement** in shared-comms-log + thread record:
  the hardening arc is complete; future collaboration friction routes
  via the standard friction register, not a new opener.

## Success criteria (final session)

1. R1 owner-direction resolved and the chosen fix shape landed
   test-first. Bug B-01 moved from `open` to `fixed` with commit SHA
   in `primary-agent-tooling-enhancements.plan.md` §Bugs.
2. R2 / R3 / R4b / R4-new / R5 (sub-steps 5.0-5.4) all landed (or
   explicitly partials with named follow-on plan if a sub-step
   uncovers a blocker — deferral-honesty per PDR-026).
3. R7 follow-on plan stub authored; R8 pattern captured.
4. Four-probe validation matrix passes — each probe completes
   without foreign-stage absorption, claim conflict, comms render
   breakage, identity drift, or fitness-gate-blocks-on-peer-files
   surprise (or, where surprise occurs, it is exactly the R7 surface
   and is documented in the R7 plan).
5. No regression in fitness gates.
6. Doctrine mining complete; pending-graduations entries either
   `graduated` or `pending` per second-instance trigger.
7. Arc closure announced; thread next-session record refreshed.

## Discipline carried into this session

- **Architectural excellence over expediency** — only ever choose
  long-term architectural excellence; cheap/fast/good-enough shapes
  are categorically excluded from consideration upstream of any
  option presentation. See
  [`principles.md` § Architectural Excellence Over Expediency](../../../directives/principles.md).
- **Test-first for every CLI / helper / hook fix.** Atomic test +
  product landing. No audit-shaped tests.
- **No `--no-verify`** per
  [`no-verify-requires-fresh-authorisation`](../../../rules/no-verify-requires-fresh-authorisation.md);
  fresh per-commit owner authorisation on completed understanding.
- **Stage by explicit pathspec; commit by explicit pathspec** per
  [`stage-by-explicit-pathspec`](../../../rules/stage-by-explicit-pathspec.md).
- **No speed pressure** per
  [`no-speed-pressure`](../../../rules/no-speed-pressure.md). This
  session is the final landing in a doctrine-shaped arc; the urge
  to skip the test-first substrate is the diagnostic.
- **No moving targets in permanent docs** — counts, SHAs,
  numerical heuristics belong in ephemeral state, never in
  directives or ADRs.

## Specialist reviewer dispatch

| Reviewer | When | Purpose |
|---|---|---|
| `assumptions-expert` | R1 shape design, Phase 4 probe design, Phase 5 closeout | Validate assumption premises against evidence; flag any premise refuted at execution time |
| `architecture-expert-betty` | R5 Path β migration (cohesion of JSON-canonical move) | Long-term change-cost of the directory reshape; cross-package coupling |
| `architecture-expert-wilma` | R4-new native git hook + Phase 4 all four probes | Adversarial probe of hook bypass surfaces + load-shape coverage |
| `code-expert` | Every implementation commit | Gateway; routes type-expert / security-expert as warranted |
| `test-expert` | Every implementation commit | TDD pair audit; no audit-shaped tests; no skipped tests |
| `type-expert` | R1 (if discriminator schema), R3 (identity cache types) | Schema/type flow; assertion pressure |
| `docs-adr-expert` | R4b skill amendment, R5.3-5.4 doc sweeps, Phase 5 closeout | Doctrine coherence; ADR/PDR amendments; reference integrity |

## Cross-references

- [`primary-agent-tooling-enhancements.plan.md`](primary-agent-tooling-enhancements.plan.md) §Bugs —
  corrected B-01 diagnosis; queued workstream coverage.
- [`2026-05-11-collaboration-protocol-hardening-opener.md`](2026-05-11-collaboration-protocol-hardening-opener.md) —
  predecessor opener with amended framing + four-probe matrix spec.
- [`../../../memory/operational/repo-continuity.md`](../../../memory/operational/repo-continuity.md) §Current
  Session Focus — predecessor session's full arc record (Deciduous
  Twining Dew block).
- [`../../../memory/operational/pending-graduations.md`](../../../memory/operational/pending-graduations.md) —
  two new entries surfaced by the predecessor session.
- [`../../../memory/active/napkin.md`](../../../memory/active/napkin.md) —
  five SURPRISE entries authored by the predecessor session;
  read for the live texture of the session arc.
- Predecessor commits: `9b619a05` (R6 doctrine), `70507d72` (session
  close), `4186d761` (handoff + consolidation).
