---
fitness_line_target: 350
fitness_line_limit: 500
fitness_char_limit: 40000
fitness_line_length: 200
split_strategy: "Graduate items to PDRs/ADRs/rules/permanent docs; archive resolved items to repo-continuity-session-history archives; keep only pending and recently-graduated items here"
---

# Pending-Graduations Register

The structured queue of doctrine candidates awaiting graduation per
the capture → distil → graduate → enforce pipeline (ADR-150, PDR-011).
Each entry carries `captured-date`, `source-surface`,
`graduation-target`, `trigger-condition`, and `status`.

Items with `status: due` or `status: overdue` are the primary
graduation candidates for the next consolidation pass. Items with
`status: pending` are reviewed at each consolidation to see whether
their trigger condition has fired since last consolidation. Items
with `status: graduated` are kept here briefly for audit trail before
being archived to `archive/repo-continuity-session-history-*.md`.

This register lives in its own file (split out from
`repo-continuity.md` § Deep Consolidation Status on 2026-04-30 by
Briny Lapping Harbor under owner direction, when accumulated rich
register content was contributing the bulk of repo-continuity's
HARD fitness state). Doctrine references that previously pointed to
`repo-continuity.md § Deep consolidation status` now point here.

Schema: `captured-date`, `source-surface`, `graduation-target`,
`trigger-condition`, `status`. `consolidate-docs` uses this as the live
queue. Graduated and merged history is preserved in git and the archived
continuity snapshots.

+ 2026-05-04; **layered processing of knowledge: preserve first,
  restructure second** (Fronded Flowering Thicket, owner-stated
  mid-pass): *pick a layer, fully process it without worry about
  the fitness functions in the targets, then move up a layer and
  process the next layer without worry about the fitness in the
  targets, and so on, until all knowledge is preserved first and
  the fitness constraints are met second.* Generalises the existing
  per-write rule at `consolidate-docs.md § Learning Preservation
  Overrides Fitness Pressure` into a layer-orchestration discipline:
  fitness has no jurisdiction during processing of any layer; it
  becomes a measurement of the resting system after all processing
  completes, not a constraint on in-process work. The rule
  self-applied during this session's pass — Layer 1 (napkin →
  distilled), then Layer 2 (distilled → permanent doctrine, with
  PDR-045 as the first deliverable). Source surface: napkin §
  "Layered processing: knowledge preservation first, fitness
  second". Graduation-target options: (a) new PDR (highest-leverage
  candidate; would self-apply); (b) amendment to PDR-026 §Deferral-
  honesty discipline; (c) amendment to PDR-038 (doctrine-without-
  enforcement-at-maturity is closely related); (d) `consolidate-
  docs.md § Learning Preservation Overrides Fitness Pressure`
  extension (host-local). My read: distinct-enough-to-warrant-new-
  PDR, with the consolidate-docs amendment as the host-side
  operational hook. Trigger-condition: owner direction (this is
  the highest-leverage Layer-2 candidate from the 2026-05-04 pass;
  fresh session is set up to draft this PDR first per the
  agentic-engineering-enhancements thread record). Status: `due`.

+ 2026-05-04; **subagent briefs must include
  halt-on-environment-mismatch instructions; parallel
  `isolation:"worktree"` dispatch is unreliable for shared-state
  work** (Pearly Snorkelling Reef, captured from the
  doctrine-enforcement-quick-wins dispatch incident on 2026-05-04).
  Three concurrent worktree subagents in one `Agent` batch produced
  inconsistent bases (one matched parent HEAD, two were on an older
  `main` commit predating the plan). The two wrong-base subagents
  improvised on the missing-plan environment rather than halting,
  and crossed worktree boundaries by writing to absolute paths in
  the main repo. Source surface: napkin §"Parallel
  isolation:worktree dispatch produced inconsistent bases".
  Graduation-target options: (a) a portable rule
  `.agent/rules/subagent-environment-mismatch-halt.md` requiring
  briefs to instruct halt-and-report when grounding cannot find
  cited artefacts; (b) a PDR refining subagent-dispatch discipline
  (parallel-dispatch-only-when-state-isolation-is-real); (c) an
  amendment to an existing collaboration or subagent-architecture
  PDR. Trigger-condition: a second cross-session instance of
  parallel-worktree dispatch failure or wrong-base-improvisation,
  OR three sessions where a subagent brief explicitly added
  halt-on-environment-mismatch language and the discipline proved
  load-bearing. Status: `pending`. Durable lesson held outside
  this register at
  `~/.claude/projects/-Users-jim-code-oak-oak-open-curriculum-ecosystem/memory/feedback_worktree_isolation_unreliable.md`.

+ 2026-05-04; **deferrals must be sequenced (or have their
  sequencing sequenced)** (Verdant Sprouting Leaf, owner-stated
  sharpening of PDR-026 §Deferral-honesty discipline at session
  close): *deferrals must either be explicitly sequenced in a plan
  (strongly preferred), or have their sequencing sequenced in a
  plan (acceptable only in very unusual cases). Anything else is
  a declaration that something will not happen, wrapped in
  obscuring language which hides a useful signal. Sometimes not
  doing something is the best possible option, but it needs to be
  visible, and in some cases discussed.* The existing PDR-026
  §Deferral-honesty rule forbids convenience phrasings (*for
  later*, *next session*, *ran out of time*); this sharpening adds
  the positive form: a legitimate deferral points to a specific
  plan + phase, or to a decision point sequenced in a specific
  plan + phase. Three modes: (1) sequenced deferral (preferred),
  (2) sequencing-sequenced deferral (rare), (3) hidden declaration
  of non-action (forbidden — it conceals the choice). Non-action
  can be the architecturally correct answer; it must be visible,
  explicit, and sometimes discussed. Source-surface: napkin
  2026-05-04 §"Three owner asides at session close". Graduation-
  target: PDR-026 amendment §"Sequenced-deferral discipline" with
  positive-form requirement. Trigger-condition: enforcement
  surface ready (per the PDR-038 §2026-05-04 maturity gate). The
  natural enforcement candidate is a doctrine-scanner fingerprint
  detecting deferrals lacking plan + phase pointers, plus a plan-
  reviewer check at promotion time. Both extend the
  doctrine-scanner CLI work proposed in
  `future/memetic-immune-system-and-progressive-disclosure.plan.md`.
  Status: pending — PDR-026 amendment defers to post-quick-wins
  lane until enforcement surface lands; an amendment landed without
  enforcement would itself be the failure mode the amendment
  describes (un-enforced sharpening = visibility-only, no
  structural cure for the recurring shape). The deferral of *this*
  amendment is itself sequenced — it lands when the doctrine-
  scanner CLI lands.

+ 2026-05-04; **memory classifications and systems review**
  (Verdant Sprouting Leaf, owner-flagged future-session item at
  session close): assess the three memory planes (`active/`,
  `operational/`, `executive/`) plus their sub-surfaces (napkin,
  distilled, patterns, threads, comms, claims, escalations,
  conversations, pending-graduations) for what works well, what
  can be improved, gaps, and beneficial restructure options. The
  seam-review concept exists in PDR-029 Family-B Layer-1 as a
  `taxonomy-review` candidate trigger; ≥3 such candidates in a
  single consolidation or ≥5 across consecutive consolidations
  signal a full taxonomy-review session is owed. Source-surface:
  napkin 2026-05-04 §"Three owner asides at session close".
  Graduation-target: dedicated taxonomy-review session with
  output: a memory-architecture audit report + any reorganisation
  proposals as PDR candidates against PDR-007/PDR-024/PDR-028. The
  assessment is multi-session in scope and benefits from the
  structural-foundation work landing first (the doctrine-scanner
  quick wins + practice trio activation create natural
  observation points for what the memory system *enables* vs
  *obstructs*). Trigger-condition: post-quick-wins evidence + owner
  direction, OR ≥2 additional taxonomy-review candidates
  accumulating before then. Status: pending — first instance, awaiting
  evidence base.

+ 2026-05-04; **first-question at every elaboration boundary, not
  only at plan-author time** (Verdant Sprouting Leaf, surfaced
  during /jc-consolidate-docs napkin extraction; substance from Salty
  Navigating Jetty 2026-05-03 session-spiral diagnosis): PDR-043 cue 3
  ("first-principles framing question — what would the path look like
  with no closure pressure?") is currently scoped to "when proposing
  any change". The sharpening from Salty's session: the cue must fire
  at *every elaboration boundary* — plans-creating-plans, arc-
  justifying-arcs, prerequisite-justifying-prerequisites. The three-
  day observability spiral (2026-05-01 through 2026-05-03) was
  internally coherent at every plan-authoring step but never re-asked
  the first-question at the level of *should this whole arc exist?*.
  Salty's diagnosis: *plan-following can disguise rush-impulse if
  the principles' first-question is not re-applied at every
  elaboration boundary*. Source-surface: napkin 2026-05-03 (Salty)
  §"Session-spiral diagnosis"; complementary to PDR-018 §Beneficial
  prerequisites must not block (which provides the prerequisite-
  classification cure) and PDR-043 cue 3 (which provides the per-
  change cure but not the per-elaboration-boundary cure). Graduation-
  target: PDR-043 amendment §"Cue 3 fires at every elaboration
  boundary" OR PDR-018 amendment §"First-question discipline at
  elaboration boundaries". Trigger-condition: second instance OR
  owner direction. Salty's session is the first instance; Tidal
  Flowing Reef's "framing-trap" entry on the same date is closely
  related but expresses the same shape (option A vs option B between
  two violations is the wrong frame; the question is *how do we adopt
  our new insights?*). Status: pending — awaiting second instance or
  owner direction. **Enforcement note (per PDR-038 §2026-05-04
  amendment)**: at maturity, doctrine without enforcement is
  liability. The structural enforcement candidate for this principle
  is a planning-discipline check at plan-authoring time + plan-
  reviewer dispatch — both of which would naturally extend the
  doctrine-scanner CLI work proposed in
  `future/memetic-immune-system-and-progressive-disclosure.plan.md`.

+ 2026-05-04; **insight capture degrades exponentially after the
  moment of occurrence** (Verdant Sprouting Leaf, owner-stated
  mid-session principle): *the only valid time to capture an insight
  is when it occurs; every moment after that degrades exponentially.*
  Stated in the post-/insights reflection round mid-authoring of
  option (c). This is the active-memory analogue of architectural-
  excellence-over-expediency: the cheap answer ("note it for next
  session") burns the load-bearing detail; the architecturally
  correct answer (capture now in napkin / PDR / plan) costs minutes
  and preserves the substance. Source-surface: napkin 2026-05-04
  entry. Graduation-target: addition to
  `.agent/directives/principles.md` as a one-line principle, with
  the napkin/PDR/plan capture pipeline as its own structural
  enforcement (the principle is self-enforcing — its enforcement
  surface is the act of capture itself, which already exists as
  infrastructure). The discipline formalises what was already done
  in this session; promotion is recording what is true. Trigger-
  condition: second instance OR owner direction. The owner-stated
  framing is itself the first instance and is load-bearing for the
  three insights captured in same turn during this session. Status:
  pending — awaiting second instance or owner direction.

+ 2026-05-04; **memetic immune system structure** (Verdant Sprouting
  Leaf, post-/insights reflection round): two-layer immune system as
  the structural shape for operationalising PDR-038 at write-time
  and commit-time. **Already graduated this session as PDR-044**:
  innate (deterministic, fast, broad) + adaptive (cognitive,
  contextual, learning) layers; citation discipline as autoimmunity
  safeguard; allowlist usage as calibration signal. Source-surface:
  napkin 2026-05-04 entry derived from /insights report observation
  that doctrine-enforcement-pre-commit-hooks would catch the
  recurring violations. Graduation-target: GRADUATED to
  `practice-core/decision-records/PDR-044-memetic-immune-system.md`
  on 2026-05-04 in commit `192b6965`. Innate-immunity layer host
  adoption: `current/doctrine-enforcement-quick-wins.plan.md`. Status:
  graduated.

+ 2026-05-04; **beneficial prerequisites must not block the work
  they were meant to enable** (Verdant Sprouting Leaf, owner-named
  pattern with three host instances surfaced in same turn): a
  prerequisite that is `beneficial` (the dependent work ships better
  with it) must not be expressed as `blocking` (the dependent work
  cannot start without it). Three host instances: agent-roster
  taxonomy rename gating practice trio agents (the rename is
  beneficial, the trio can ship additively); smoke-harness redesign
  treated as prereq for multi-sink rename (regression-guard already
  served the role); plans-creating-plans for three days without
  product code. **Already graduated this session as PDR-018 §
  "Beneficial prerequisites must not block" amendment** in commit
  `192b6965`. Source-surface: napkin 2026-05-04 entry.
  Graduation-target: GRADUATED to PDR-018 amendment log + new
  Decision section. Status: graduated.

+ 2026-05-04; **doctrine without enforcement: benefit early, cost
  at maturity** (Verdant Sprouting Leaf, owner sharpening of
  PDR-038 mid-session): *once a system starts to mature, doctrine
  without enforcement is a cost rather than benefit; in very
  early-stage systems collecting intent is beneficial, but that
  value falls off fairly quickly.* Maturity-axis sharpening of
  PDR-038. **Already graduated this session as PDR-038 §
  "Doctrine-without-enforcement is benefit-then-cost across
  maturity" amendment** in commit `192b6965`. Source-surface:
  napkin 2026-05-04 entry. Graduation-target: GRADUATED to PDR-038
  amendment log + new Decision section, with explicit maturity
  inflection signals (doctrine surface exceeding contributor
  working memory; recurring recall-dependent failures; new
  principles predominantly sharpenings rather than novel
  identifications; PDR-authoring cost exceeding enforcement-surface
  cost). Status: graduated.

+ 2026-05-04; **tests describe the system to itself** (Dewy Shedding
  Glade, owner-led doctrinal arc): foundational reframing of TDD
  landed in `tdd-as-design.md`. *A test does not verify code; a test
  describes a system state, and product code is the path that guides
  the system into that state. Test and product code are two halves
  of one act of design. Writing them separately, in either order, is
  a category error.* Adopter scope: every Practice-bearing repo —
  this is a Practice-governance decision about the role of tests, not
  a host-repo architectural choice. Source-surface: napkin
  2026-05-04 entry; current home: `tdd-as-design.md` directive.
  Graduation-target: PDR in `practice-core/decision-records/`
  capturing the load-bearing definition + the atomic-landing
  invariant + the describe-vs-audit blade as portable Practice
  governance. The host directive `tdd-as-design.md` already operates
  the host-local consequence; the PDR records the decision so it
  travels with the Core. Trigger-condition: second instance OR
  owner direction (owner-led arc this session is the first instance;
  the framing is stable and load-bearing for the entire
  validation-and-tdd-doctrine-restructure arc). Status: pending —
  awaiting either second instance or owner direction.

+ 2026-05-04; **reviewers carry doctrine, not just audit it** (Dewy
  Shedding Glade, owner direction §6 of the arc): the test-reviewer
  refresh elevated the reviewer from structural auditor to doctrinal
  carrier with mandatory recipe/pattern read path and citation
  requirement on every suggestion. The shift is measurable: the
  reviewer's *first question* is now "does this test describe an
  interface or audit one?" rather than "does it pass". Source-surface:
  `.agent/sub-agents/templates/test-reviewer.md` rewrite; companion
  surfaces `.claude/agents/test-reviewer.md`,
  `.cursor/agents/test-reviewer.md`, `.codex/agents/test-reviewer.toml`.
  Graduation-target: PDR in `practice-core/decision-records/`
  capturing reviewer-as-doctrine-carrier as a general
  reviewer-authority discipline (sibling to PDR-007 reviewer
  lineage). Trigger-condition: second instance — when one further
  reviewer (architecture-reviewer-fred is already shaped this way;
  candidates are type-reviewer, security-reviewer, sentry-reviewer)
  is similarly upgraded to the doctrine-carrier shape. Status:
  pending — first instance landed this session.

+ 2026-05-04; **forcing-function read path: reviewer carries the
  recipes the doctrine cites** (Dewy Shedding Glade, derived from §5
  of the arc): the test-reviewer's mandatory read path now includes
  `docs/engineering/testing-tdd-recipes.md` and
  `docs/engineering/testing-patterns.md`, with a citation requirement
  on every suggestion (cite recipe/pattern by section heading).
  The general shape: when a doctrine references companion recipes
  or patterns, the reviewer that operationalises the doctrine becomes
  the forcing function that keeps the recipes load-bearing. Without
  this forcing function, recipes drift from doctrine because no one
  reads them. Source-surface: test-reviewer template Reading
  Requirements + Step 7 (suggestion mode); companion surface: the
  recipe and pattern files themselves. Graduation-target: pattern in
  `.agent/memory/active/patterns/` capturing the
  reviewer-as-forcing-function shape; promote to general
  Practice-Core pattern (`practice-core/patterns/`) once a second
  reviewer-recipe pairing follows in another domain. Trigger-condition:
  second instance — security-reviewer citing security-review-recipes,
  type-reviewer citing type-flow-patterns, etc. Status: pending —
  first instance landed this session.

+ 2026-05-04; **validation strategy as umbrella; testing strategy as
  one leaf** (Dewy Shedding Glade, owner direction §2 of the arc):
  host-repo architectural decision about the directive topology.
  The current sprawling `testing-strategy.md` mixes test-type
  taxonomy, TDD methodology, recipe-level configuration, and
  cross-cutting validation surfaces. The arc proposes a three-document
  split: `validation-strategy.md` (umbrella; right-tool-for-each-job;
  gate inventory), `testing-strategy.md` (slimmed to test types and
  multi-level interaction), `tdd-as-design.md` (foundational TDD
  doctrine, landed this session). Source-surface: index plan
  `validation-and-tdd-doctrine-restructure.plan.md`. Graduation-target:
  ADR-121 refresh (P4 in the index plan) — the existing "Quality
  Gate Surfaces" ADR is the natural carrier for the topology
  decision once the new umbrella exists. Trigger-condition: P1
  (validation-strategy umbrella) lands; ADR refresh happens
  immediately afterwards. Status: pending — sequenced behind P1
  in the index plan.

+ 2026-05-03; **autonomous .git/index.lock interaction is forbidden,
  including wait loops** (Prismatic Illuminating Eclipse, owner
  intervention mid-A1-commit): the existing 2026-04-30 distilled.md
  entry "Never delete .git/index.lock" addressed the destructive
  shape (`rm` on a foreign lock). This session surfaced a softer
  failure mode that compounds in the same direction: an autonomous
  polling wait loop (`until [ ! -e .git/index.lock ]; do sleep 2;
  done && echo "lock cleared"`). Even though the loop only OBSERVED
  the lock disappearing (Woodland's parallel commit completed
  naturally), the "lock cleared" echo conditioned the agent to treat
  lock-clearing as an action it takes rather than a state it
  observes, and any future evolution of the loop (timeout-then-rm
  fallback) would be a small step away from the catastrophic action.
  Owner direction: any contact with `.git/index.lock` requires owner
  authorisation, including the wait shape; surface foreign locks to
  the user with diagnostic + wait-vs-handoff options rather than
  running a wait loop. **Graduation target**: extend the existing
  distilled.md "Never delete .git/index.lock" entry to "Never
  autonomously interact with .git/index.lock at all — including wait
  loops"; consider promoting to a `.agent/rules/` rule given the
  destructive-blast-radius of the failure mode. Status: pending —
  owner direction has fired in part (specific incident this
  session); deliberate next-session shape required for the
  distilled.md amendment + rule-authoring decision (PDR-038
  structural-enforcement reasoning applies here too). Captured to
  platform memory at
  `~/.claude/projects/-Users-jim-code-oak-oak-open-curriculum-ecosystem/memory/feedback_no_lock_wait_loops.md`
  for immediate effect; doctrine-level capture queued here for
  graduation through the proper consolidation pipeline. Companion
  entry: 2026-04-30 `feedback_no_delete_git_lock` is the destructive
  shape; this is the autonomous-observation shape; both are
  instances of *avoid actions that compound silently in destructive
  directions even when each individual step looks safe*.

+ 2026-05-03; **session-close housekeeping ownership** (Woodland
  Sprouting Glade + Prismatic Illuminating Eclipse parallel-lane
  session, owner-stated experiment observation): at session-close some
  housekeeping is **agent-specific** (own observations in napkin,
  identity-row last_session, claim close, subjective experience file)
  and can ONLY be done by the originating agent — no other agent has
  the in-memory context. Other housekeeping is **NOT agent-specific**
  (refresh repo-continuity.md, refresh pending-graduations register,
  sweep platform entry points, commit prior-session leftover continuity
  files, run consolidation gate) — any agent could do it, which means
  without explicit ownership none of them does and work is lost or
  stale. **Cure shape**: when an Orchestrator role is assigned for a
  session, the Orchestrator owns shared / not-agent-specific
  housekeeping. When no Orchestrator is assigned, the
  **last-to-leave** rule applies (final committing agent picks up the
  shared housekeeping). Agent-specific housekeeping remains the
  originating agent's responsibility regardless. **First instance
  (live)**: this 2026-05-03 handoff — the prior Pelagic session ended
  with five continuity files modified-but-uncommitted; without the
  rule, every subsequent agent assumed someone else owned them. Owner
  direction at session-handoff fixed it. Source-surface: napkin §"E1
  Parallel two-agent execution" 2026-05-03 + experiment-plan §P11
  candidate; graduation-target: P11 in N-agent collaboration
  hypothesis (`hypothesis.md`) plus a Practice-Core PDR amendment to
  PDR-018 (Planning discipline) or a new dedicated PDR if the cure
  shape stabilises across N≥3; trigger-condition: validation across
  N≥3 sessions with no falsifying observation; status: candidate
  (single instance; not yet graduation-ripe; falsification criteria
  named in napkin entry).

+ 2026-05-02; observability multi-sink + fixtures plan WS10 — owner
  doctrine *"for all significant documentation or Practice changes
  — and this is always true — we need reviews from the documentation
  reviewer and the onboarding reviewer"*; trigger condition: this
  doctrine is now load-bearing for every plan that mutates docs or
  Practice surfaces; graduation target: a permanent rule (likely
  `.agent/rules/invoke-doc-and-onboarding-reviewers-on-significant-changes.md`
  OR an amendment block in `invoke-code-reviewers.md`) plus a
  `distilled.md § Process` graduation pointer plus matrix update in
  `invoke-code-reviewers.md`; queued as plan WS11.3 deliverable;
  status: due (graduates when WS11.3 executes).

+ 2026-05-02; observability multi-sink + fixtures plan WS8.6 —
  orthogonal axes shape (`OBSERVABILITY_SINKS` typed list +
  `OBSERVABILITY_FIXTURES` orthogonal fixture-as-tee boolean) is a
  reusable architectural decision per PDR-019 (ADR scope by
  reusability) — applies to every future sink and every future
  capability that emits; graduation target: a new
  `docs/architecture/architectural-decisions/NNN-observability-configuration-orthogonality.md`
  ADR (NEW). **2026-05-03 amendment (Moonlit Drifting Nebula)**:
  the plan body originally scheduled this as ADR-165, but ADR-165
  is already taken — the next available number must be chosen
  before WS8.6 starts. Plus amendments to ADR-116 (warnings
  channel), ADR-143 (registry shape, fixture-as-tee), ADR-162
  (Open Question close on `ServerInstrumenter` port — partially
  addressed in WS1 RED via the type definition; final closure
  rides at WS6 when the HTTP composition root consumes the port),
  ADR-163 (build-time scope clarification — D7a verification
  confirmed structural orthogonality; WS4 cleanup is the
  follow-on); queued as plan WS8.6/WS8.7 deliverable. **2026-05-03
  ADR-number resolved (Woodland Sprouting Glade ARC B0, c0d17634)**:
  ARC A4 ADR is **170** (smoke harness shape, parent plan); orthogonality
  ADR is **171** (this plan, WS8.6). Verified by
  `ls docs/architecture/architectural-decisions/ | sort -n | tail -5`
  — 165-169 already present, 170/171 next available. All cross-plan
  references updated; re-verify pre-authoring guards added at three
  locations. Status: due (ADR-number question resolved; ADR authoring
  + amendments graduate when plan WS8.6/WS8.7 execute).

+ 2026-05-02; observability multi-sink + fixtures plan WS0 —
  near-miss surprise: almost spawned a duplicate
  `cross-app-distributed-tracing-mcp-and-search-cli.plan.md` stub
  before checking the existing `future/` directory; caught when
  listing during WS0 promotion. Trigger: second instance of new-plan-
  stub-spawn-without-future-survey; graduation target: distilled.md
  § Process entry naming "directory survey before plan-stub spawning"
  OR amendment to `consolidate-at-third-consumer.md`; status: pending
  (single instance; capture-only until second instance accumulates).

+ 2026-05-03; **inter-agent collaboration protocol gaps surfaced
  by Pelagic ↔ Misty Task M1 round-trip** — **status reframed
  2026-05-03 (Misty session-handoff metacognition)**: these cures
  are now structured as candidate amendments to the N-agent
  collaboration hypothesis at
  [`.agent/prompts/agentic-engineering/collaboration/hypothesis.md`](../../prompts/agentic-engineering/collaboration/hypothesis.md),
  with per-cure falsification criteria at
  [`falsification-criteria.md`](../../prompts/agentic-engineering/collaboration/falsification-criteria.md)
  and proposed validation experiments at
  [`experiments.md`](../../prompts/agentic-engineering/collaboration/experiments.md).
  Cures graduate to permanent doctrine **after** empirical validation
  at N≥3, not before. The CLI ergonomics plan remains the natural
  carrier for cure (v) tooling work, but the four protocol-amendment
  cures (i)-(iv) and the five worker-perspective addenda (vi)-(x)
  graduate via the hypothesis-evolution loop, not via direct
  promotion to PDR. The original five structural cures
  named in the session's reflection log
  ([`experience/2026-05-03-pelagic-two-way-agent-communication-reflection.md`](../../experience/2026-05-03-pelagic-two-way-agent-communication-reflection.md))
  and a tactical 10-point next-session guide in napkin (same date,
  Pelagic Washing Anchor). Specific candidates: (i) **out-of-band
  brief acknowledgement** — when an agent acts on owner direction
  received outside the comms log, first comms event must cite the
  out-of-band source explicitly (cure for the temporal-anomaly
  reading of Misty's pre-existing claim); (ii) **read/write claim
  mode field** — extend `active-claims.json` schema with
  `mode: 'read' | 'write' | 'mutual-exclusive'` so non-conflicting
  modes coexist on overlapping paths (cure for the
  smoke-tests-workspace path overlap); (iii) **heartbeat-or-die
  enforcement** — claims past `claimed_at + ETA * 1.5` without
  heartbeat are stale; orchestrator reclaims, escalates, or asks
  owner (cure for the ETA decay observed); (iv) **overflow
  protocol in task offers** — task issuers must include *"if the
  spec is too tight, do X; do not unilaterally Y"* up front (cure
  for the round-trip cost on Misty's hybrid-vs-inline question);
  (v) **`comms` CLI ergonomics** — `comms reply` (auto-populates
  `in_response_to`, inverts `audience`); `comms watch` (tail
  events directory); `comms pending` (events awaiting my reply);
  `comms heartbeat <claim_id>` (cure for event_id mismatch
  Misty made when inferring from title rather than copying from
  source body, plus the discipline failures naming inertia of
  manual JSON authoring). Routes to the existing
  [`agent-coordination-cli-ergonomics-and-request-correlation.plan.md`](../../plans/agentic-engineering-enhancements/future/agent-coordination-cli-ergonomics-and-request-correlation.plan.md)
  as concrete worked instances strengthening the existing
  promotion case (already at fourth-instance evidence; this is a
  fifth). Trigger: owner direction has fired in the request for
  the reflection itself; CLI ergonomics plan promotion (already
  named in `agentic-engineering-enhancements.next-session.md`)
  is the natural carrier; the four protocol-amendment candidates
  (i)-(iv) graduate to a single PDR or amendment to the existing
  agent-collaboration directive at consolidation. **Worker-
  perspective addenda from Misty Ebbing Pier (2026-05-03 napkin
  entry "Worker-perspective addenda to Pelagic's collaboration
  suggestions")** — five additional cures: (vi) **wall-clock
  authority** (`date -u` from host shell as the canonical source
  of `created_at`, distinct from the out-of-band-ack cure (i)
  which addresses sequence reconstruction by readers); (vii)
  **render conversation threading** (promote `audience` and
  `in_response_to` to canonical schema and surface in render so
  the log is a conversation tree, not flat dump); (viii)
  **asymmetric ground-truth — worker initiates on empirical
  surface** (assumption-breaking discoveries mid-task MUST surface
  via comms event before worker continues; orchestrator MUST poll
  that signal); (ix) **defer commit until task-close + counterparty
  acknowledgement** (premature commits would have made this
  session's self-correction expensive); (x) **wait-for-ack on
  deadlined-defaults** (task-acceptor counterpart to overflow
  protocol (iv)). Status: due (graduates with the next CLI
  ergonomics plan execution slice).

+ 2026-05-03; **PDR-043 cue 2 sharpening: vocabulary is not the
  trigger, intent is** — owner direction this session: "there is
  no semantic difference between *carve out*, *carve around*,
  *exception*, *honest framing for external X*, *permitted
  variant*, *for these arcs*, or any other wording that means 'I
  know the rule always applies, but this situation is special'".
  PDR-043 currently frames cue 2 around the vocabulary trip-list;
  the sharpening: substance that reads "the rule doesn't apply
  here" is the trigger, regardless of vocabulary. Substance:
  amend PDR-043 §"Cue 2 — Conditional-discipline check before
  proposing structure" to include the intent-based reading
  alongside the vocabulary-based one. Trigger: second instance OR
  owner direction. Status: pending. Captured: 2026-05-03 (Lush
  Spreading Seed). Source surface: this session's iterative
  cleanup, where multiple non-"carve" hedging shapes (`Permitted:
  exception`, "honest framing for external", "exception for E2E
  tests", "C7 carve-outs ratified") all needed removal.
  Graduation target: PDR-043 amendment + principles.md three-cues
  paragraph wording update.

+ 2026-05-03; **atomic, independent cycles for optional
  parallel-agent dispatch** — new planning discipline landed this
  session in `.agent/commands/plan.md` requirement 3,
  `.agent/plans/templates/components/tdd-phases.md`
  §"Atomic, independent cycles for parallel dispatch", and
  `.agent/plans/templates/feature-workstream-template.md` §"Cycle
  Dependencies and Parallelisation". Substance: where the work
  shape allows, cycles should be made independent of each other
  (separate file scopes, executable acceptance, self-contained
  briefs) so each can be handed to a parallel agent without
  mid-work coordination. Declared via optional `depends_on: []`
  field on the YAML todo plus prose markers in the cycle body
  (Parallel-safety, Starting state, File scope, File scope NOT
  to touch). Plan-author discipline: do not invent serial
  dependencies the work shape does not require. Trigger: second
  Practice-bearing repo adopts the same discipline OR owner
  direction. Status: pending (single-instance — graduates as a
  PDR candidate when N≥2 host repos pick it up, or when owner
  directs). Captured: 2026-05-03 (Lush Spreading Seed). Source
  surface: this session's plan-template restructure following
  the TDD-as-pairs landing. Graduation target: a new PDR in
  `.agent/practice-core/decision-records/` covering atomic
  cycles + dependency declaration + parallel dispatch as a
  portable Practice-governance principle, with this repo's
  adoption already evidenced in the planning-template surfaces.

+ 2026-05-03; **6 skipped test files violate the absolute
  no-skipped-tests rule** — **GRADUATED 2026-05-04 by other agent's
  commit `2a2d1b05`** (`fix(observability): dev boot falls through to
  local-dev; delete dead error kind and skipped tests`). All 6 files
  were either deleted entirely (the two `.unit.test.ts` placeholder
  files in `packages/libs/sentry-node/src/`) or had their `describe.skip`
  blocks stripped (the four remaining files). The cure landed via the
  dev-boot release-resolution plan rather than the originally-proposed
  workstream re-shape, because the affected blocks were
  multi-commit-TDD artefacts whose paired product code never arrived.
  Status: graduated; entry held for one consolidation pass before
  archive.

+ 2026-04-29; PR-90 closure session — `scripts/validate-*` family is
  structural drift relative to ADR-041 / §Separate-Framework-from-Consumer /
  owner-direction "complex-with-tests must live in workspace"; 4 parallel
  architecture reviewers convergent; future + executable plans authored
  ([`current/scripts-validator-family-workspace-migration.plan.md`](../../plans/architecture-and-infrastructure/current/scripts-validator-family-workspace-migration.plan.md));
  Phase 0 of the executable plan graduates the owner-direction rule to
  `.agent/rules/no-workspace-evading-scripts.md` and authors ADR delta or
  peer ADR via docs-adr-reviewer; trigger: owner directs Phase 0 OR third
  validator class accumulated; status: pending.
+ 2026-04-29; PR-90 closure session — `external-systems-shouldnt-be-the-
  first-detector` principle introduced by owner mid-session, drove Phases 4
  and 5 (TS-invocation gate + MD024 enable). Recursively useful (caught its
  own meta-instances via Cursor Bugbot napkin finding). **GRADUATED
  2026-04-30 by Verdant Sheltering Glade per owner direction "promote
  both now"** to
  [PDR-039 External-System Findings Reveal Local Detection Gaps](../../practice-core/decision-records/PDR-039-external-findings-reveal-local-detection-gaps.md);
  status: graduated 2026-04-30.
+ 2026-04-29; PR-90 closure session — testing-strategy.md §Test Types named
  "validation scripts that require external resources should be standalone
  scripts, not tests" caught my Phase 4 misclassification (vitest-as-
  validator-harness). The principle is sound but lives in one paragraph;
  worth elaborating in `docs/engineering/testing-tdd-recipes.md` with the
  contrast pattern (validator script + helper unit tests vs integration test
  on real-FS repo state); trigger: second similar misclassification OR
  owner direction; status: pending.
+ 2026-04-29; PR-90 closure session — Vercel build emits 2 warning classes
  (pnpm `@humanfs/node` bin defect; 3 env vars not in `turbo.json`).
  Captured in
  [`future/vercel-build-warning-elimination.plan.md`](../../plans/architecture-and-infrastructure/future/vercel-build-warning-elimination.plan.md).
  Trigger: third warning class accumulates OR owner direction; status:
  pending (future plan).
+ 2026-04-29; owner-requested PR lifecycle skill note;
  `.agent/skills/pr-lifecycle/SKILL.md` plus possible PDR amendment for
  gate-honest PR stewardship; trigger: first real PR shepherding run using
  the skill OR second repeated PR feedback / CI / Sonar / reviewer-wait
  friction instance; status: pending. Evidence:
  [`pr-lifecycle-skill.plan.md`](../../plans/agentic-engineering-enhancements/future/pr-lifecycle-skill.plan.md).
+ 2026-04-24; napkin + `.remember/` wiring commits; PDR-011 amendment for
  plugin-managed ephemeral capture surfaces; trigger: second
  plugin-managed in-repo capture surface or owner direction; status:
  pending.
+ 2026-04-23; ADR-163 release/version boundary and vendor passthrough
  audit; trigger: observability-thread consolidation audit; status:
  pending-audit.
+ 2026-04-23; session-handoff entrypoint sweep; PDR-014 amendment for
  platform-specific entry points as homing substance; trigger: second
  drift instance and owner request; status: pending.
+ 2026-04-25; multi-agent protocol WS architecture; pattern candidate
  `operational-seed-per-workstream`; trigger: second protocol-plan
  instance or owner direction; status: pending.
+ 2026-04-25; collaboration protocol self-application evidence;
  `infrastructure-alive-at-install`; trigger: one instance from a
  different lane or owner direction; status: pending.
+ 2026-04-26; workspace-first failure cluster; rule or
  recurrence-prevention amendment for workspace inventory before external
  tooling/new infra; trigger: second cross-session instance or owner
  direction; status: **graduated 2026-05-04** to
  [PDR-045 Workspace-First Investigation Discipline](../../practice-core/decision-records/PDR-045-workspace-first-investigation-discipline.md)
  (Fronded Flowering Thicket). Three structurally-similar failure modes
  consolidated into three moves (artefact search before remote retry;
  shared-package survey before parallel infrastructure; live-state check
  before brief enumeration). Composes with PDR-033 (vendor-platform
  variant of Move 2). Three host-rules updated to cite PDR-045:
  `validate-full-target-estate` Move 1, `read-diagnostic-artefacts-in-full`
  Move 1, `consolidate-at-third-consumer` Move 2.
+ 2026-04-26; OpenAPI/OOC issues boundary; rule with teeth for API-only
  consumer data boundary; trigger: second near-violation or owner
  direction; status: pending.
+ 2026-04-26; observability validation correction; alignment check
  before per-system claim validation; trigger: second skipped-alignment
  instance or owner direction; status: pending.
+ 2026-04-26; WS3A closeout; protocol observability by consolidation
  audit before new visible surfaces; trigger: second protocol slice with
  the same shape or owner direction; status: pending.
+ 2026-04-28; CLI first-touch friction on the collaboration-state CLI
  (`--help` self-rejects; dispatch keys undiscoverable; `--platform`
  redundant when env-derived; claim file-list verbose; no `whoami`);
  future strategic plan candidate for promotion to `current/`; trigger:
  second instance OR owner direction; **status: ready for promotion**
  (both triggers fired 2026-04-30 — owner observed warnings during
  Verdant Sheltering Glade session, AND the session itself accumulated
  new evidence). Second-instance evidence (2026-04-30):
  `pnpm agent-tools:agent-identity` does not inherit
  `PRACTICE_AGENT_SESSION_ID_CLAUDE` through `pnpm --filter` (forcing
  --seed); `comms append` requires `--events-dir`, `--now`,
  `--created-at` with no discoverable defaults; `claims open` requires
  `--active`, `--thread`, `--area-kind` (with `--area-kind` rejecting
  intuitive values like `shared-state` — only `files`/`workspace`/`plan`/
  `adr`/`git` are accepted); `comms render` uses `--output` not
  `--output-file`. Each error is a single iteration cost but they
  compound to ~5–8 round-trips per session-open. Evidence + plan:
  [`agent-coordination-cli-ergonomics-and-request-correlation.plan.md`](../../plans/agentic-engineering-enhancements/future/agent-coordination-cli-ergonomics-and-request-correlation.plan.md).
  **Third-instance evidence (2026-05-01, Vining Whispering Root,
  Increment 1 promotion-materials commit `b3d4c041`)** — six
  frictions in one end-to-end run of the always-active commit skill:
  (i) `commit-queue enqueue` rejects a placeholder claim_id with
  `unknown claim_id: <uuid>` — chicken-and-egg; the queue requires a
  claim to exist, but step ordering at the CLI surface is the inverse
  of the skill's documented step ordering; (ii) `collaboration-state
  claims open --help` errors `flag '--help' requires a value` —
  help is unreachable; (iii) `--active "$PRACTICE_AGENT_SESSION_ID_CLAUDE"`
  produces `ENOENT: no such file or directory, open '<UUID>'` — the
  flag interprets the UUID as a path; (iv) `pnpm
  agent-tools:agent-identity` does not inherit env vars through `pnpm
  --filter`, requiring `--seed` despite the parent shell having the
  variable set; (v) `collaboration-state claims` (no action) prints
  only the top-level usage line, not the list of available actions
  (`open`, `close`, etc.); (vi) `--area-kind` accepts a closed
  enum (`files`/`workspace`/`plan`/`adr`/`git`) but rejects
  intuitive values like `shared-state` without listing the accepted
  set in the error. Compound effect: the agent abandoned the queue
  workflow and fell back to plain explicit-pathspec staging — the
  substance of the discipline survived (validation + pathspec) but
  the audit-trail value of the queue was lost. Routing-around is
  itself a Practice failure mode: a queue that exists but is
  habitually bypassed under friction is worse than no queue. Strong
  case to promote the future plan to `current/` and execute its
  ergonomics-fix slice next consolidation. **Status: ready for
  promotion** (was already; third instance hardens the case
  significantly). **Fourth-instance evidence (2026-05-01, Deep
  Navigating Stern, day-arc continuity commits `514838c9` +
  `bc6cd2e6`)** — eight distinct frictions in one ceremony pair
  produced ~60 seconds of pure flag-discovery and recovery
  overhead per commit: (i) `agent-tools:agent-identity` first-call
  build failure (transient, retry succeeded); (ii) `claims open
  --help` rejected (unchanged); (iii) `claims open` required-flag
  discovery by error iteration over **5 round-trips**
  (`--platform`, `--model`, `--active`, `--now`); (iv) `claims
  close` required another **3 round-trips** (`--closed` path,
  `--summary` not `--closure-summary`, identity quartet); (v)
  identity quartet repeated across every CLI call (`--platform`,
  `--model`, `--agent-name`, `--seed`); (vi) commit-queue
  `enqueue` records subject at enqueue time with no `update-subject`
  subcommand — over-length subject required abandon-and-re-enqueue
  cycle, leaving an `abandoned` row in `commit_queue`; (vii) `comms
  append` uses `--body` while SKILL.md vocabulary suggested
  `--message`; (viii) markdownlint `--fix` corrupted prose-`+` at
  column 0 into a list marker, requiring two manual rephrasings.
  Concrete fixes for the ergonomics slice to prioritise: subject-
  correction subcommand; identity-quartet env defaults inside the
  CLI binary (bypass `pnpm --filter` propagation gap); `--help`
  acceptable without value; subcommand discovery; `comms append`
  flag rename; required-flag enumeration on first error.
  Adjacent: napkin 2026-05-01 fourth-instance entry surfaces an
  *agent-authored prose interacts surprisingly with markdown
  linters under wrap* observation as small operational discipline,
  not a separate candidate.
+ 2026-05-01; ~~bootstrap fast-path should not pay full coordination
  cost~~ **WITHDRAWN 2026-05-01 by Deep Navigating Stern** under
  owner direction *"we never take the fast path we ONLY take the
  path that maximises long-term architectural excellence."* The
  candidate framed real evidence (six compound CLI frictions in one
  commit-skill run) under a *conditional-discipline* shape (skip
  queue when registry empty), which introduces microstate
  proliferation: every future agent must evaluate whether their
  situation is "fast-path", the condition's accuracy degrades
  silently as the system evolves, and the audit-trail surface that
  is most needed when coordination fails is the one being skipped.
  The genuine substance — *the queue ergonomics are bad and that
  produces route-around behaviour* — survives intact and routes to
  the CLI ergonomics plan
  ([`agent-coordination-cli-ergonomics-and-request-correlation.plan.md`](../../plans/agentic-engineering-enhancements/future/agent-coordination-cli-ergonomics-and-request-correlation.plan.md))
  as *fix the surfaces*, not *make the discipline contingent*.
  Withdrawal is itself the doctrine: rush-impulse re-frames real
  concerns under conditional-discipline shapes; the corrective is
  to re-frame under long-term excellence. Captured in napkin
  2026-05-01 metacognition entry. Status: withdrawn 2026-05-01.
+ 2026-05-01; **rule visibility under friction is uneven** — the
  always-active `capture-practice-tool-feedback` rule exists and is
  loaded every session via `CLAUDE.md`, but in this session the agent
  hit six tooling frictions in one commit attempt and did not pause
  to capture until the user asked. The rule fired on owner prompt,
  not on the friction itself. Candidate structural cue: when an agent
  uses an `agent-tools:*` command and encounters an unexpected error,
  that should be a structural prompt to write a napkin entry — not a
  sometimes-yes-sometimes-no judgement call. Recursive: this very
  candidate is a meta-instance of the same shape (a rule existed but
  did not fire under friction; the user had to ask). Trigger for
  graduation: second instance of "rule existed but didn't fire under
  friction" OR owner direction. Status: pending.
+ 2026-04-28; cross-thread comms event request/response correlation gap
  (no `audience`, no `in_response_to`, no TTL/escalation timer);
  minimal correlation primitive on the comms event schema as recommended
  first promotion slice; trigger: second silently-rotted cross-thread
  request OR owner direction; status: pending.
+ 2026-04-28; stance-staleness within a single conversation
  (parallel-agent state moves between forming a stance and reporting it);
  doctrine candidate for `agent-collaboration.md` and start-right
  skills; trigger: second instance OR owner direction; status: pending.
+ 2026-04-28; PR-87 Phase 2 pre-phase security review surfaced
  X-Forwarded-For spoofing on Vercel as MUST-FIX; pattern candidate
  `pre-phase-adversarial-review-expands-cluster-scope`; trigger: second
  cross-session instance OR owner direction; status: pending.
+ 2026-04-29; small-work bypass of coordination surfaces; rule or
  continuity-practice amendment binding session-open registration to
  *first edit* rather than to thread join; trigger: owner-flagged AND
  named for separate investigation; status: pending. Cross-reference:
  [`passive-guidance-loses-to-artefact-gravity`](../active/patterns/passive-guidance-loses-to-artefact-gravity.md).
+ 2026-04-29; test misnaming as exemption mechanism (a `.e2e.test.ts`
  suffix used as filename certificate to escape in-process restrictions);
  testing-strategy amendment to classify tests by behaviour shape, not
  by filename suffix; trigger: second observed instance OR owner
  direction; status: pending.
+ 2026-04-29; agent-infrastructure failure visibility (non-blocking
  agentic-platform hooks fail silently by default); PDR candidate
  extracting the canonical contract from
  [ADR-167](../../../docs/architecture/architectural-decisions/167-hook-execution-failures-must-be-observable.md)
  to Practice Core; trigger: second platform implementing a thin
  wrapper, OR owner direction; status: pending.
+ 2026-04-29; recurring myopia patterns at every signal surface
  (reviewer-as-prosthetic; confirmation-reading-vs-exploration;
  hook-as-obstacle; fitness-as-constraint; sed-bypass); pattern
  candidate or PDR amendment for "tool-error-as-question" meta-pattern;
  trigger: third surface OR owner direction; status: pending. Evidence:
  [`hook-as-question-not-obstacle.md`](../active/patterns/hook-as-question-not-obstacle.md);
  [`ground-before-framing.md`](../active/patterns/ground-before-framing.md).
+ 2026-04-29; scope-as-goal anti-pattern (treating instrumental work as
  terminal because the work-list was full; reviewer "GO WITH CONDITIONS"
  reading as green light when arc-scope ≠ branch-scope); pattern or
  PDR-018 amendment about reviewer-scope-equals-prompted-scope;
  trigger: second cross-session instance OR owner direction; status:
  pending. Evidence: napkin 2026-04-29 Verdant Regrowing Pollen
  session-end summary in
  [`archive/napkin-2026-04-29.md`](../active/archive/napkin-2026-04-29.md).
+ 2026-04-29; lockfile-corruption diagnosis discipline (read build log
  before extending speculation list; speculation lists are negative
  hypotheses, not narrowing tools); recast 2026-04-30 as
  **composition-obscurity investigation methodology**;
  **GRADUATED 2026-04-30 by Briny Lapping Harbor per owner direction
  to [PDR-041 Composition-Obscurity Investigation Methodology](../../practice-core/decision-records/PDR-041-composition-obscurity-investigation-methodology.md)**;
  status: graduated 2026-04-30.
+ 2026-04-30; pin GitHub Actions to maintainer-Latest SHA, not
  highest-version-number SHA;
  **GRADUATED 2026-04-30 by Briny Lapping Harbor per owner direction
  with conscious PDR-vs-ADR distinction: general principle to
  [PDR-040 Pin to Maintainer-`/releases/latest`, Not Highest Version Number](../../practice-core/decision-records/PDR-040-pin-to-maintainer-latest-not-highest-version.md)
  (Practice substance, cross-repo); host-side adoption to
  [ADR-169 Pin GitHub Actions to Maintainer-`/releases/latest` SHA](../../../docs/architecture/architectural-decisions/169-pin-github-actions-to-maintainer-latest-sha.md)
  (this repo's CI workflows + override mechanism + future-validator
  scope)**; status: graduated 2026-04-30.
+ 2026-04-30; signal-distinguishing pre-action gate — the agent
  defaults to "make the failing thing pass" when any failing
  signal appears, but contract-violation signals want fixes while
  structural-health diagnostics want graduate/split/accept; agent
  currently collapses both into "fix the metric"; surfaced by
  five same-shape reframes in one session;
  **GRADUATED 2026-04-30 by Briny Lapping Harbor per owner
  direction to fresh
  [PDR-042 Signal-Distinguishing Pre-Action Gate](../../practice-core/decision-records/PDR-042-signal-distinguishing-pre-action-gate.md)
  rather than amendment to PDR-018 or PDR-026 — the substance is
  upstream of planning and landing-commitment, applying to any
  agent action proposal under failing-signal pressure**; status:
  graduated 2026-04-30.
+ 2026-04-29; reviewer-scope-equals-prompted-scope (a reviewer's
  "GO WITH CONDITIONS" reads as green only if reviewer scope ≡ branch
  merge-gate scope; brief reviewers with full merge gate when
  gating merge); PDR-015 amendment OR new pattern; trigger: second
  cross-session instance OR owner direction; status: pending. Evidence:
  napkin 2026-04-29 Verdant Regrowing Pollen Surprise 4.
+ 2026-04-29; experience-audit emergent patterns (medium strength,
  ≥3 instances each, surfaced by 2026-04-29 deep consolidation pass);
  pattern candidates for promotion at second-instance OR owner
  direction; status: pending. Evidence: experience-audit report
  in 2026-04-29 deep consolidation closeout. Six candidates:
  + **silent-degradation-in-green-systems** — tests pass while
    running system is broken (tsx vs dist, characterisation tests
    that never ran, mapping promises a builder never delivers).
  + **plans-are-load-bearing-and-age** — plans encode world-state
    at authoring time and drift; mischaracterisations have the same
    structural risk as bugs.
  + **verify-the-premise-before-solving** — reviewer findings are
    hypotheses about the system, not facts; the fact lives in code.
    Pairs with `ground-before-framing`.
  + **complexity-cascade-feels-productive** — over-engineering
    feels like progress; the simple solution is invisible while in
    the spiral. Pairs with `workaround-gravity`.
  + **bridging-language-smuggles-old-shapes** — "deprecated notice",
    "follow-up", "compatibility layer", "stretch goal" perform
    preservation while preventing the new shape from existing.
  + **fix-the-producer-not-the-consumer** — when a consumer cannot
    use a type/function/structure correctly, the fix is in the
    producer; one template fix → 24 generated files cleaned.
+ 2026-04-29; doctrine-tests-itself-on-the-session-of-its-landing
  (the strongest test of a newly-authored rule is whether the
  session that authored it obeys it; corollary: install-session
  self-application is the acid test); PDR candidate (sibling of
  PDR-029 / install-session-blind-to-cold-start-gaps); trigger:
  owner direction (≥4 cross-session instances already documented);
  status: pending. Evidence: experience-audit report; instance
  patterns include 2026-04-22-the-rule-tested-itself,
  2026-04-21-the-recursive-session,
  2026-04-25-fresh-prince-the-protocol-applied-to-itself,
  2026-04-21-installing-a-tripwire-i-cannot-test.
+ 2026-04-29; open-up-the-value-early (when extra work closes a
  coordination gap that the surrounding decisions would otherwise
  ship with, the move is to open up that value within the current
  arc rather than ship the original arc and defer); PDR candidate
  (strategic test about composability of surrounding decisions,
  distinct from "do it now"); trigger: owner direction OR fourth
  cross-session instance; status: pending. Evidence: experience-
  audit report; instance patterns include
  2026-04-21-session-3-doctrine-bundle-opening-up-value-early
  (canonical naming), 2026-04-22-the-rule-tested-itself,
  2026-04-18-observability-as-principle.
+ 2026-04-29; sentry-observability-maximisation-mcp.plan.md displaced
  doctrine (build-vs-buy attestation + six metacognition guardrails);
  PDR creation candidate ("Build-vs-Buy Attestation as Plan Authoring
  Discipline"), plus ADR-163 §6 amendment to outcome-not-CLI form;
  trigger: owner direction (PDR creation needs explicit approval per
  PDR-003 care-and-consult posture); status: pending. Evidence:
  displaced-doctrine sub-agent report from 2026-04-29 deep
  consolidation pass.
+ 2026-04-29; multi-agent-collaboration-protocol.plan.md concept-home
  refinement; doctrine has graduated to canonical surfaces
  (agent-collaboration directive, respect-active-agent-claims rule,
  distilled.md, consolidate-docs §7e, PDR-029 Family A.3); plan body
  still narrates the doctrine alongside execution status; the work is
  routing each section to its canonical home (or keeping it as
  plan-scoped substance), not a size-target trim — line count falls
  because duplication is removed; trigger: owner direction (preserves
  audit-trail role for WS5 evidence harvest); status: pending. Evidence:
  displaced-doctrine sub-agent report from 2026-04-29 deep consolidation
  pass; child plan at
  [`multi-agent-collaboration-protocol-concept-home-refinement.plan.md`](../../plans/agentic-engineering-enhancements/current/multi-agent-collaboration-protocol-concept-home-refinement.plan.md).
+ 2026-04-29; trinity Active Principles + bootstrap structural
  extensions for the five 2026-04-29 doctrine sharpenings (knowledge-
  preservation absolute, shared-state always-writable, tool-error-as-
  question, scope-as-goal, behaviour-shape testing classification);
  amendments queue for `practice.md` §Philosophy + Collaboration,
  `practice-lineage.md` Active Principles, `practice-bootstrap.md`
  §Napkin + §Sub-agents, `practice-verification.md` shared-state
  smoke-test addition; trigger: owner direction (per PDR-003 care-
  and-consult; sub-agent assessed as healthy-lag, not silent rot);
  status: pending. Evidence: trinity-drift sub-agent report from
  2026-04-29 deep consolidation pass.
+ 2026-04-30; graduation-trigger criteria too restrictive — owner
  observation at session close (Verdant Sheltering Glade): the
  default "trigger: second instance OR owner direction" criteria
  used across most Pending-Graduations Register entries is too
  restrictive in practice. Strong candidates with one robust instance
  + clear principle articulation can wait sessions for a second
  instance that may never come, while owner direction is a synchronous
  cost. Future session needed to: (a) audit the trigger criteria
  shape across the register; (b) propose alternative criteria
  (single-instance-with-evidence-density, principle-articulation
  quality test, structural-coverage check); (c) update consolidate-docs
  §7a guidance. Trigger: future session with owner appetite for
  flow refinement; status: pending. Evidence: this session graduated
  PDR-036/037/038/039 on owner direction after the candidates had
  been pending for sessions despite stable doctrine and worked
  instances.
+ 2026-04-30; commit-bundle-leakage-from-wildcard-staging — wildcard
  `git add -A` (or moral equivalent) over a working tree containing
  another session's WIP produces a commit whose message is true for one
  slice of the diff and silent about the rest. Surfaced 2026-04-30 by
  the `75ac6b75` post-mortem (51 lines of legitimate continuity work
  bundled with 372 lines of parallel Practice-thread plan work plus 3
  lines of unrelated `.claude/settings.json` plugin enable). Corrective
  shape: stage by explicit pathspec from the queued intent; verify
  staged-bundle-matches-intent before commit; treat
  files-outside-the-named-intent as a coordination event. Already
  partially in distilled.md § Process; trigger for full graduation
  (rule + commit-skill amendment): second cross-session instance OR
  owner direction. Status: pending. Evidence:
  [`experience/2026-04-30-verdant-the-bundle-was-the-signal.md`](../../experience/2026-04-30-verdant-the-bundle-was-the-signal.md).
+ 2026-04-30; substrate-vs-axis-plans convention + working principle
  "invent-justification-as-signal"; **GRADUATED 2026-04-30 by Verdant
  Sheltering Glade per owner direction "general principles are PDRs, if
  there are two principles there are two PDRs; specific instances are
  ADRs"** to two new PDRs:
  [PDR-036 Friction-as-Structural-Finding](../../practice-core/decision-records/PDR-036-friction-as-structural-finding.md)
  (generative principle) and
  [PDR-037 Substrate-vs-Axis Plan Categorisation](../../practice-core/decision-records/PDR-037-substrate-vs-axis-plan-categorisation.md)
  (Practice-governance applied to plan collections). The convention
  component file at
  [`templates/components/substrate-vs-axis-plans.md`](../../plans/templates/components/substrate-vs-axis-plans.md)
  remains as the canonical worked-example artefact, now cited from PDR-037.
  Status: graduated 2026-04-30.
+ 2026-04-29; pre-2026-02-15 experience corpus extraction backlog
  (~80 files dating from 2025-01 through 2026-02-15 contain
  inline doctrine, code blocks, principle catalogues that displace
  the subjective register; healthy post-2026-02-15 corpus shows
  the audit discipline now works as intended); one-time extraction
  task; trigger: owner direction; status: pending. Evidence:
  experience-audit report. Recommended extraction approach:
  preserve subjective texture, strip technical content, link to
  canonical homes; group by similar source files (phase-* cluster,
  2025-01 cluster, 2025-08 cluster) for batch processing.

+ 2026-05-01; **`stop inventing optionality` / apply-don't-ask** —
  **QUARANTINED 2026-05-01 by owner direction**. The doctrine
  contributed to (or ran alongside) a destructive `git checkout --`
  that discarded parallel-agent uncommitted work; the bias toward
  action lacks a destructive-operation guard. The candidate is
  removed from active circulation pending deep human review.
  Substance, evidence trail, and pointers preserved at
  [`.agent/memory/operational/quarantine/apply-dont-ask-doctrine.md`](quarantine/apply-dont-ask-doctrine.md).
  **DO NOT APPLY** until owner re-authorises with a corrected shape
  or rejects the candidate. Status: quarantined (not pending, not
  due, not graduated).

  **2026-05-01 owner-direction reframe (both candidates)**:

  + *apply-don't-ask*: the rule needs reworking into something like
    **"can this question be answered empirically?"** The action-bias
    framing was wrong; the load-bearing distinction is whether the
    question has a determinate answer reachable by reading code,
    data, vendor docs, or generator output, versus genuinely
    requiring owner judgement. Reformulation is owed before any
    re-graduation attempt.

  + *stop inventing optionality*: rule moves in the right direction
    but **not necessarily at the right layer, level of abstraction,
    or mechanism**. We need to name the impact first and re-think
    from there — drafting the rule before naming the impact is
    itself an instance of the failure mode the doctrine was trying
    to name. Three distinct surfaces of "invented optionality" are
    observed in the existing evidence trail and may decompose into
    separate rules with different impacts:
    + *Decision optionality* — bouncing forks to the owner that
      have a determinate empirical answer (the apply-don't-ask
      surface above; impact: wastes owner judgement, fragments
      decision authority).
    + *Design optionality* — adding configurable / optional /
      extensible surface to a design that doesn't need it
      (e.g. `Record<string, unknown>` carve-outs for a schema with
      a closed shape; impact: erodes types, bakes in fragility).
    + *Outcome optionality* — writing acceptance criteria that
      hedge ("if X then Y else Z") when there is a single right
      answer, or that depend on infrastructure that doesn't exist
      (e.g. fantasy LLM-graded evals; impact: produces
      unfalsifiable plans, see the don't-shoehorn-a-value-claim
      doctrine candidate above).

    Both candidates remain quarantined. The reformulations are not
    yet drafted; the rethink is owed before any new authoring.
+ 2026-04-30; **don't shoehorn a value-claim into infrastructure that
  cannot carry it** — when the right way to verify something does not
  exist yet, the honest plan says so and ships the structural enforcement
  that does exist; it does not invent brittle tests or fantasy operational
  protocols to fill the gap. Sense-check: "if this stopped existing
  tomorrow, who would know? how?" If the answer is "no one, because the
  infrastructure for knowing doesn't exist", do not pretend the
  infrastructure exists. Status: pending. Trigger: second instance OR
  owner direction. Evidence: Iridescent's session-close napkin (LLM-
  graded outcome conditions in EEF plan removed under owner direction).

+ **GRADUATED 2026-05-03** to PDR-043
  (`.agent/practice-core/decision-records/PDR-043-rush-impulse-three-structural-cues.md`)
  + ADR-172
  (`docs/architecture/architectural-decisions/172-rush-impulse-three-structural-cues-adoption.md`)
  + adoption surface in `principles.md § Architectural Excellence
  Over Expediency` (the three-cues paragraph alongside the
  vocabulary trip-list, which becomes cue 1).

+ 2026-05-01; **rush impulse as system-level entropy generator + three
  structural cues** — owner-named at the close of the 2026-05-01
  consolidation turn, in response to two rush failures within that turn
  (the *bootstrap fast-path* candidate; the *informational not actioned*
  defer-shape on napkin CRITICAL fitness). Substance: most named fences
  in the codebase (replace-don't-bridge, stop-inventing-optionality,
  stage-by-explicit-pathspec, learning-preservation-overrides-fitness,
  hook-failures-are-questions, no-underscore-rename, no-sed-bypass,
  session-handoff hard gate, PDR-026 deferral-honesty, PDR-042 signal-
  distinguishing) all fight the same generator from different angles;
  fence accumulation without naming the generator is microstate
  proliferation around an unchanged macrostate. Three structural cues
  forward as a cohesive defence rather than separate fences: (1)
  vocabulary trip-list at output time — *fast path*, *quick fix*,
  *informational not actioned*, *defer*, *light pass exempts*, *for
  later*, *out of scope*, *next session*; (2) conditional-discipline
  check before proposing structure — does the candidate introduce a
  "case where the rule doesn't apply"?; (3) first-principles framing
  question — what would the path look like with no closure pressure?
  Graduation target candidates: PDR-shaped (Practice-governance about
  doctrine-evolution discipline, sibling of PDR-042); pattern in
  `practice-core/patterns/` after a synthesis with the existing fences
  it ties together; or amendment to PDR-042. Trigger: owner direction
  has fired in part (the framing was named explicitly this session);
  graduation requires a deliberate next-session shape not mid-turn
  closure (per the very discipline being captured). Evidence: napkin
  2026-05-01 metacognition entry (Deep Navigating Stern); experience
  file at
  [`experience/2026-05-01-deep-the-rush-was-the-fix.md`](../../experience/2026-05-01-deep-the-rush-was-the-fix.md).
  Status: pending — first articulation; second cross-session
  articulation OR explicit owner authorisation of PDR/pattern shape
  required before promotion.

+ 2026-05-01; **markdown shared-state writes have no collision
  safety** — captured 2026-05-01 by Deep Navigating Stern after an
  unrelated agent silently overwrote `repo-continuity.md` Last
  refreshed entry + Active identities column + Deep consolidation
  status, AND `threads/agentic-engineering-enhancements.next-session.md`
  Last refreshed entry + identity-table row, between handoff-close and
  stage. The napkin, pending-graduations register, experience file,
  and `~/.claude.json` MCP swap survived intact because their shapes
  are naturally collision-resistant (per-session append heading;
  structured per-item additive entries; per-session-per-agent named
  file; user-scope file outside any agent's standard write path).
  **Substance**: JSON shared-state has transaction safety since
  `11f0320f` (the collaboration-state-write-safety landing); markdown
  shared-state has no equivalent. Single-slot Last refreshed prose
  surfaces are the only collision class — every concurrent
  session-handoff walks through this hazard. Five prevention shapes
  considered (full table in napkin), strongest combination:
  (a) **convergent write-surfaces (additive design)** — make Last
  refreshed entries append-only by structure, eliminating the
  collision class as the thread record's identity table already does
  per PDR-027; (b) **handoff-window claim** — direct analogue of the
  `git:index/head` commit-window claim, with new `area_kind: handoff`
  on the active-claims schema. Intermediate detection-only mitigation:
  post-write `stat` of touched files at handoff-close, ALERT if
  `mtime > handoff-start`. Graduation target: extend write-safety
  doctrine from JSON state to markdown shared-state surfaces;
  concretely (a) Last refreshed surface redesign in
  `commands/session-handoff.md` + the two affected files'
  conventions, (b) `area_kind: handoff` on the active-claims schema
  + queue/claim integration, OR (c) a PDR amendment to the
  collaboration-state-domain-model plan family that names the
  collision-class structurally. Routes to existing
  [`collaboration-state-domain-model-and-comms-reliability.plan.md`](../../plans/agentic-engineering-enhancements/future/collaboration-state-domain-model-and-comms-reliability.plan.md)
  as the future-plan home for shared-state collision analysis.
  **Trigger**: owner direction has fired in part (the request *"any
  prevention or additional signal would be very welcome"* names the
  prevention question directly); a deliberate next-session shape is
  required for design-and-implementation work — installing prevention
  mid-handoff would be the rush impulse the prior register entry
  just named. Evidence: napkin 2026-05-01 *markdown shared-state
  writes have no collision safety* entry (Deep Navigating Stern);
  this very session's revert-and-re-apply of the two affected files
  recorded in the in-place note inside both. Adjacent: the 2026-04-30
  *commit-bundle leakage from wildcard staging* distilled entry names
  a sibling-but-distinct mechanism (single-agent action consumes
  peer's WIP) — the present mechanism is the inverse (concurrent
  independent writes overwrite each other on a shared single-slot
  surface). Status: pending.

+ 2026-05-01; **retired threads need explicit retirement signal in
  the file itself, plus a consolidation-time hygiene check** — owner
  observation 2026-05-01 (Deep Navigating Stern session): the
  `pr-90-build-fix-landing.next-session.md` thread has been complete
  for several days but the file in `threads/` shows no retirement
  banner; an agent browsing the directory sees a file shaped like
  an active thread record. Retirement is documented only in
  `repo-continuity.md` prose (*"The pr-90-build-fix-landing thread
  retired 2026-04-30 (PR #90 merged 2026-04-29T20:43:22Z). Thread
  record retained ... for audit-trail value."*); the file itself
  carries no signal. Owner reframing: *"we need a thread hygiene
  prompt, perhaps in the document consolidation workflow."* Two
  distinct hygiene shapes that compose: (a) **per-file retirement
  banner** — add a frontmatter status field (`status: retired`,
  `retired_at: <date>`, `retirement_reason: <one-line>`,
  `audit_trail_retained: true|false`) plus a top-of-file banner
  pointing to the canonical record of why; (b) **`consolidate-docs`
  step 7c thread-hygiene check** — extend the existing six-check
  audit with a seventh: enumerate `threads/*.next-session.md` files
  AND compare to the `Active threads` table; flag any thread file
  not listed in Active threads (signals retirement-without-banner)
  AND any retired-banner file whose retirement age exceeds a
  threshold (signals time-to-archive to `threads/archive/`). (a)
  makes retirement self-evident at the file level; (b) catches
  retirement-without-(a) and prompts archival cadence. Substance
  routes naturally to a PDR-027 amendment (thread identity surface)
  plus a `consolidate-docs.md` step 7c amendment. Trigger: owner
  direction has fired in the request itself; graduation requires
  deliberate next-session work for the doctrine + workflow change
  + retroactive banner application to the one currently-retired
  thread record. Status: pending. Evidence: this session's owner
  observation; the
  [`pr-90-build-fix-landing.next-session.md`](threads/pr-90-build-fix-landing.next-session.md)
  thread record itself; the corresponding prose retirement note
  in `repo-continuity.md`.

+ 2026-05-01; **idea (pre-candidate): hook-layer safety net for
  destructive operations** — owner-recorded after the 2026-05-01
  destructive `git checkout --` incident. Concept: a `PreToolUse`
  hook (or equivalent) that intercepts the named destructive Bash
  operations (`git push --force*`, `git reset --hard*`, `git rebase*`,
  `git clean -f*`, `git branch -D*`, `git checkout --*`,
  `git restore*`, `git stash*`, `git revert*`, `git commit --amend*`,
  `git push*`, `rm -rf*`) and either blocks or forces explicit fresh
  authorisation per call. Operates as an active firing layer — the
  shape that the recall-dependent-principles PDR (owner-authorised
  2026-05-01) names as the structural cure for safety rules whose
  passive-prose form does not survive flow-state pressure. Pairs
  with the `.claude/settings.json` `permissions.deny` / `permissions.ask`
  proposal (separate decision; settings are a coarser layer, hooks
  give per-call surfacing in chat with reasoning context).
  **Status: idea, not yet a doctrine candidate.** Not subject to any
  trigger condition; recorded for future structural-cure design
  rather than promotion through the candidate pipeline. Owner
  decision required to activate.

Older graduated entries (PDR-018, PDR-026, PDR-029, PDR-033, PDR-034,
ADR-153, ADR-164, etc.) are preserved in
[`archive/repo-continuity-session-history-2026-04-29.md`](archive/repo-continuity-session-history-2026-04-29.md)
and earlier archive files for full audit trail.
