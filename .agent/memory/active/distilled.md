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
`napkin-2026-02-16.md` through `napkin-2026-05-04.md`
(sessions 2026-02-10 to 2026-05-04).

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
but the local markdown/JSON/rules/commands/skills/hooks surfaces are the
operating substrate for Practice-owned coordination concepts and must remain
sufficient without platform-native collaboration features.

Before adding a new always-visible coordination surface, widen the regular
state audit first. WS3A showed that active claims, closure history, decision
threads, unresolved decision requests, evidence bundles, and schema
validation became usable once `consolidate-docs` reported them together.
Structured state plus consolidation output is usually the first dashboard.

Split evidenced durability gaps from speculative coordination mechanisms.
WS3A claim-history / decision-thread work was grounded in real harvest
evidence; WS3B sidebar, timeout, and file-backed owner escalation remain
promotion-gated until async decision threads prove insufficient.

**Multi-agent collaboration cures route through the hypothesis layer
before graduating to doctrine.** Substance lives at
[`hypothesis.md`][n-agent-hypothesis] (per-primitive coordination
cures), [`falsification-criteria.md`][n-agent-falsify] (per-primitive
falsifiability), and [`experiments.md`][n-agent-experiments]
(empirical validation at N≥3). Capture → hypothesis → empirical
validation → graduate. Treated-as-hypothesis they get tested;
shipped-as-design they get defended. Substrate validated at N=2
2026-05-03 (shared `.git/`, parallel landing); not yet at N≥3.

ADR/PDR citation discipline remains live-distilled until enough
evidence accumulates to graduate to a PDR amendment or a rule:
when citing an ADR or PDR by number, verify the filename and the
substance against the live decision-record file rather than
inheriting plan-body shorthand.

When an apparently orphaned active claim is found, archive it only through a
deliberate governance pass or owner-forced close. If another session is
already performing that cleanup, let the natural claim lifecycle finish rather
than deleting unilaterally.

**Inter-agent comms is a first-class coordination primitive — not
all coordination needs owner-mediation.** When another agent's
state blocks mine and they may still be active, the correct first
move is a direct comms-event to that agent (with a deadline + a
named default action if no response), brief poll for reply, then
escalate to owner only if no response by deadline. The reverse
order — surface options to the owner first — over-uses owner
mediation for coordination the agents can resolve between
themselves. Worked instance 2026-05-05: Lacustrine Navigating
Rudder's doc-cleanup `verify-staged` blocked on Gnarled Climbing
Bark's three pre-staged-but-deferred files. Initial options
surfaced to the owner were all owner-mediated (you authorise me to
unstage; you commit Gnarled's first; I wait). Owner direction:
*"please send a message to Gnarled and see if they acknowledge,
inter-agent communication is an option in these circumstances.
They may or may not still be active, so you should probably
include an amount of time you will wait in the message, maybe two
minutes"*. Coordination resolved between the two agents within the
2-minute window with 8-second margin. Owner-stated principle on
close: *"the communication between you and Gnarled was extremely
effective, and communicating with the other agents is always an
option, not all communication needs to be mediated through me"*.
Operating shape: bounded-deadline + default-action format on the
comms-event; agent posts, polls briefly, acts on default if silent.
Owner-mediation remains the right channel for owner-owned
decisions (authorisation chain lifts on owner-directed deferrals;
strategic redirection; cross-thread scope changes). The discipline
is: route through the lowest-authority resolver that can decide.

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

**Plan-following is not principle-following — re-apply the
first-question at every elaboration boundary.** Owner-named pattern
across the 2026-05-01 → 2026-05-03 EEF observability arc. The
principles' first-question — *could it be simpler without
compromising quality?* — is implicitly assumed-asked at plan-time
and is then never re-asked at the level of "should this whole arc
exist?". Symptoms: plans-creating-plans for days without product
code moving; ARC-supporting infrastructure built to support work
that didn't need it; "internally coherent" elaboration that
doesn't advance the actual goal. Worked instance: smoke-harness
redesign (ARC A1, `792c2cad`) framed as prerequisite for the
multi-sink rename when the existing
`dev-server-boots-without-observability-config.e2e.test.ts`
already served the regression-guard role. PDR-039 (behaviour-shape
classification) was applied once and triggered an entire
infrastructure rebuild; the simpler answer was *keep the test
where it is, PDR-039 is a guideline at test-design time not a
forcing function for an infrastructure project*. Cure: the
first-question is re-asked at every elaboration boundary, not
once at plan-start.

**The question is never "carry on with known bad" — it is
always "how do we adopt the new insight".** Owner correction
during the WS2 cascade investigation 2026-05-03 (Tidal Flowing
Reef): when a doctrine sharpens mid-execution, framing options as
"strict-old-shape vs expanded-old-shape" presupposes the old
shape is the only shape. Both options violate the new doctrine in
slightly different ways; neither adopts it. *The reshape is the
work.* Higher-level test cycles need to be COMPOSED from
low-level cycle pairs that each land green; high-level tests that
need many low-level cycles either do that composition (multi-cycle
but each cycle green) or don't need to exist because the low-level
coverage is sufficient. Captured in platform memory
`feedback_question_shape_known_bad_vs_adopt`.

**Sequenced-deferral discipline — every deferral points to a plan +
phase, or to a sequenced decision point.** Owner sharpening
2026-05-04 of PDR-026 §Deferral-honesty discipline. Three modes:
(1) **sequenced deferral** (preferred) — "we will do X after Y,
per plan Z phase N"; (2) **sequencing-sequenced deferral** (rare)
— "we will decide when to do X at decision point Y, per plan Z
phase N"; (3) **hidden declaration of non-action** (forbidden) —
"we'll do X later" without structural placement, which conceals
the choice. Non-action can be the architecturally correct answer;
it must be visible, explicit, and sometimes discussed. PDR-026
amendment is itself sequenced behind enforcement infrastructure
(doctrine-scanner CLI extension) — authoring it without the
enforcement would be the failure mode the amendment names.

**Hash presence without recompute is silent drift.** Any validator
that *stores* a content hash in a lock or manifest but does *not*
re-compute and compare on subsequent runs cannot detect drift.
Surfaced 2026-04-30 in `validate-portability.ts` Check 9b: the lock
records `(source, sourceType, computedHash)` for every vendored
canonical skill, but the validator only checks structural shape, not
content. A hand-edit to `.agent/skills/<vendored-name>/SKILL.md`
passes every current check. The corrective is the natural one:
recompute `localHash`, compare with `computedHash`, fail on mismatch.
Closing this gap is in scope for the canonical-first-skill-pack-
ingestion-tooling future plan.

**Directive-file work requires <30% context budget; otherwise queue
a fresh session.** Owner-stated 2026-05-05 with explicit standing
authority (*"this is always true"*). Files under `.agent/directives/`
(principles.md, AGENT.md, orientation.md, tdd-as-design.md,
testing-strategy.md, schema-first-execution.md) are deep, dense, and
structurally load-bearing — every agent reads them at every session
open; mistakes compound across the entire Practice. The error rate
of editing operations rises sharply under context pressure, and the
disposition that produces *"I'll just be careful"* under context
pressure is exactly the rounding-off failure mode the
[`eager-rounding-off-on-partial-structures`](../../memory/active/patterns/eager-rounding-off-on-partial-structures.md)
pattern names. The cure is structural, not behavioural: directive-
file work is sequenced as the final step of any consolidation pass
(napkin → other capture surfaces → distilled → pending-graduations
→ directives, in that order); at the boundary before directive
work, the context-usage check fires; if context is at or above 30%,
finish current-step work, write a session-handoff opener, and
queue the directive work for a fresh session. The 30% threshold is
load-bearing — it leaves headroom for full-depth file reading,
existing-structure comprehension, and editing without crowding-out.

**Cyclical learning-loop maintenance is a full-time process even
at small N.** Owner-named meta-observation 2026-05-05 (after
Opalescent's pass and Dawnlit's parallel session both contributed
substance to the same napkin in <2 hours): *"the cyclical nature,
even with only two agents running, managing the learning loop is a
full time process"*. The full loop is napkin (capture) → other
sources → distilled (refinement) → pending-graduations (queue) →
directives (permanent doctrine), then restart from napkin against
the new ground. Each pass through the loop produces both new
substance (the work itself) AND new substance about the loop (this
observation is itself an instance). The loop is self-feeding by
design and does not asymptote — every consolidation pass discovers
new candidate-substance that requires future passes. Operational
implication: the loop is not "consolidation work that happens
sometimes between feature work"; it is the substrate that future
feature work runs on, and its maintenance cost is *baseline*, not
overhead. At N=2 agents producing substance, the maintenance cost
is already a full-time process; this scales superlinearly with N
because cross-agent coordination substance accumulates faster than
any single agent's substance graduates upward.

**Practice-Core portability is by construction.** Anything under
`.agent/practice-core/` (the trinity, entry points, CHANGELOG,
provenance, `decision-records/`, `incoming/` — note that the
former `patterns/` Core directory and the `practice-context/`
peer companion were retired 2026-04-29 by PDR-007 amendment) must
be repo-independent. No repo paths (`docs/...`, `src/...`,
`packages/...`, `apps/...`, `../../skills/`, `../../commands/`,
`../../memory/`, `../../plans/`, `../../experience/`, `../../rules/`,
etc.). No ADR references (no `ADR-NNN`, no links into
`docs/architecture/architectural-decisions/`). No commit references
(no SHAs, no commit subjects, no `commit abcdef0` citations). No
host-local context sections, host-context notes, or "this repo
only" sections inside any PDR — host-side adoption is recorded in
the host's bridge index and ADR surface, not in the PDR. The
only outgoing link allowed from any file under `practice-core/` is to
the stable bridge index `.agent/practice-index.md`. Cross-references
between Core files (e.g. `practice.md` → `practice-lineage.md`,
PDR → PDR) are internal to the Core package and remain allowed; what
is forbidden is leakage out of the Core into the host repo.

**Scope of "host leakage"**: the constraint targets host-repo
internal paths (`apps/`, `packages/`, `src/`, `docs/`, etc.) and
host-local identifiers (ADR numbers, commit SHAs, host-specific
context). It does not apply to:

- The Practice's own canonical layout (`.agent/skills/`,
  `.agent/rules/`, `.agent/memory/`, `.agent/state/`,
  `.agent/practice-core/`) — `.agent/` IS the Practice's canonical
  home per PDR-009 and the PDR-007 Core-package contract. References
  to the Practice's own surface are not host leakage.
- External http(s) citations to durable third-party material
  (RFCs, vendor specifications, public standards) — these are not
  host-repo paths and are not in the constraint's domain.

The single permitted outgoing link from any file under
`practice-core/` is to the stable bridge index at
`.agent/practice-index.md`.

Existing violations (PDRs 038/039/040/041/042 linking
`../../../docs/architecture/architectural-decisions/...`; PDR-026
linking `../../skills/`, `../../commands/`, `../../memory/`,
`../../plans/observability/`; PDR-041 linking `../../experience/...`
and `../../plans/...`; `practice.md` / `practice-lineage.md` /
`CHANGELOG.md` / `practice-bootstrap.md` mentioning `ADR-NNN`) were
critical-architectural-failure-shaped prior art. The first wave of
remediation landed 2026-05-02 (Phase 1 Round 2): trinity migrated to
the post-2026-04-29 retirement model; ~30 §Host context note /
§Host-local context sections deleted across PDRs; broken cross-Core
links repaired (3 PDR-007 stale-name links + 1 machine-local path +
PDR-011 markdown defect); bridge index references re-pointed to
"(host adoption)" framing. The structural-enforcement scanner
required by PDR-038 to prevent recurrence is the next follow-on.
This constraint is stricter than the prior ADR-124 / PDR-007 "Core
self-containment" framing — it tightens the seam to the single
permitted outgoing target. Owner stated 2026-05-01.

## Repo-Specific Rules

The `src/bulk/generators/` / `vocab-gen/generators/` duplication is
deferred to the SDK codegen decomposition plan for a separate session:
`plans/architecture-and-infrastructure/codegen/future/sdk-codegen-workspace-decomposition.md`.

[agent-collaboration]: ../../directives/agent-collaboration.md
[n-agent-hypothesis]: ../../prompts/agentic-engineering/collaboration/hypothesis.md
[n-agent-falsify]: ../../prompts/agentic-engineering/collaboration/falsification-criteria.md
[n-agent-experiments]: ../../prompts/agentic-engineering/collaboration/experiments.md
