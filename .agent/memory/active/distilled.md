---
fitness_line_target: 200
fitness_line_limit: 275
fitness_char_limit: 16500
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs (ADRs, PDRs, governance, READMEs)"
---

# Distilled Learnings

Hard-won rules extracted from napkin sessions. Read this before
every session. Every entry earned its place by changing behaviour.

**Source**: Distilled from archived napkins
`napkin-2026-02-16.md` through `napkin-2026-05-10.md`
(sessions 2026-02-10 to 2026-05-10).

**Permanent documentation**: Entries graduate to permanent docs
when stable and a natural home exists. Always graduate useful
understanding — fitness management handles the consequences. What
remains here is repo/domain-specific context with no natural
permanent home, plus entries explicitly held pending validation.

**Recent graduations (2026-05-10 — Quiet Lurking Mask)**: QUAR-1
reformulation landed. *apply-don't-ask* → PDR-057 (empirical-
answerability pre-question gate; discharge action is reading, not
acting; destructive-operation guard problem structurally absent).
*stop-inventing-optionality* → PDR-058 (three-tier decomposition by
impact: decision optionality subsumed by PDR-057; design optionality
routes to closed-shape cure; outcome optionality routes to
falsifiability cure). Quarantine cleared at
`.agent/memory/operational/quarantine/apply-dont-ask-doctrine.md`;
pending-graduations entry flipped to graduated; PDR README index
updated; `read-before-asking` rule back-cites PDR-057 as its
doctrinal frame; `consolidate-at-third-consumer` cross-references
PDR-058 §Surface 2 boundary.

**Recent graduations (2026-05-09)** — focused consolidation pass on
`distilled.md` (Woodland Sheltering Glade): five planning-discipline
rules → PDR-018 amendment (lead-with-narrative, CLI-first
enumeration, locally-producible-evidence-first, split-client-
compatibility, dry-run-multi-step). Sequenced-Deferral Discipline
(three modes) → PDR-026 amendment. Per-Session Closure Owns the
Loop → PDR-026 amendment. Coordination Surface Discipline +
Inter-Agent Comms First-Class Primitive → `agent-collaboration.md`
directive amendments. Repo-Specific Codegen routing pointer →
`pending-graduations.md` entry tied to SDK codegen workspace
decomposition plan. 2026-05-07 Doctor Safe-Merge rotation entries
pruned (doctrine durable in PDR-049, PDR-050,
`memory-state-substrate-contracts.md`, archived doctor plan).

**Recent graduations (2026-05-06)**: Practice-Core portability,
directive-file <30% context budget, validators-must-recompute, and
re-apply-first-question-at-elaboration-boundaries graduated to new
files in `.agent/rules/`. Discoverable+actionable plans,
parent-reconciliation, narrative-section-drift-first, and
plan-following-vs-principle-following landed in
`docs/governance/development-practice.md` § Documentation Practice.
Apparently-orphaned-claim policy landed in
`.agent/memory/operational/collaboration-state-lifecycle.md`.
Citation-directionality is in
`.agent/rules/no-moving-targets-in-permanent-docs.md`.
TDD-compositionality and the multi-agent pointer/platform-
independence paragraphs were subsumed by existing directive content
(`testing-strategy.md`, `tdd-as-design.md`,
`agent-collaboration.md`) and deleted here.

**Verdict, not menu (2026-05-11 Flamebright Burning Lava)**: when
analysis is complete and a verdict exists in the agent's own
reasoning, the agent **presents the verdict** — not as a multiple-
choice quiz. Converting completed findings into `AskUserQuestion`
form is responsibility-passback; the diagnostic is *could the agent
rank these options by evidence already in context?* If yes, the quiz
is evasion. `AskUserQuestion` is reserved for: (a) genuine permission
gates, (b) decisions only the owner can make, (c) exploration when
the agent has no strong basis for verdict. Landed structurally:
`.agent/rules/present-verdicts-not-menus.md`, RULES_INDEX entry,
Claude + Cursor adapters, `jc-plan` skill §Before Writing item 1
amendment. Doctrinal anchors:
`feedback_no_responsibility_passback` (2026-05-09),
`feedback_answer_verification_questions_directly` (2026-04-24),
PDR-057 (apply-don't-ask), PDR-058 (stop-inventing-optionality).
Origin: the pattern recurred this session *despite* both feedback
memories being in context — evidence that user-memory alone is
insufficient and rule + skill structural surfacing is needed.

**Meta-observation (2026-05-09 historical-napkin-synthesis)**: the
fitness-as-trim impulse is doctrine-resistant under context
pressure. Three independent corrections in 2026-05-06 → 2026-05-09
on the same shape — agents reflexively trimming substance when
fitness signals fire. Two structural cures captured as
pending-graduations entries: lifecycle-aware fitness model and
active inline discipline-reminder text in fitness-validator output
at non-healthy zones. Source: §F1 of the synthesis report under
`research/agentic-engineering/continuity-memory-and-knowledge-flow/`.

---

## Recently Distilled — 2026-05-14 Verdant Swaying Glade conduct correction

### Agents have no gender unless they self-declare (default they/them)

- **Owner correction**: *"agents do not have gender unless they decide
  they do."* This is the second instance of the same correction; the
  first (2026-05-11, about Smouldering Crackling Pyre) is recorded in
  [`napkin-2026-05-12.md`](archive/napkin-2026-05-12.md) line 319 but
  was never graduated to active distilled, allowing recurrence.
- **Rule**: when referring to any other agent, default to **they/them**.
  Gendered pronouns require self-declaration from that agent (in their
  identity record, comms event, or thread-record entry). Agent names
  are evocative phrase-pairs with no inherent gender; do not infer
  gender from the name.
- **Scope**: applies everywhere the agent's voice persists — chat
  output, commit messages, comms event JSON bodies, napkin entries,
  active claims `intent` fields, thread-record narrative, ADR
  attribution, plan documents. *Including* working-tree edits that
  have not yet been committed.
- **Sweep on correction**: when corrected, sweep every persisted
  surface touched in the current session (active comms events,
  shared-comms-log, claim intents, thread records, napkin) and amend
  in place; regenerate any surfaces derived from those primaries
  (`shared-comms-log.md` is rendered from `comms/*.json`).
- **Graduation discipline for conduct rules**: corrections about
  personal conduct (style, register, phrasing, attribution) graduate
  to **active distilled.md in the same session**, not via the
  pending-graduations queue. Rationale: a session-scoped napkin entry
  archives the lesson but leaves the rule unenforced for new sessions
  during the rotation gap. The 2026-05-11 → 2026-05-14 recurrence is
  the worked example. Companion to the existing "Substance > Destination"
  discipline: substance-rules tolerate queueing; conduct-rules do not.

## Recently Distilled — 2026-05-14 Sylvan Budding Forest deep-dive consolidation

Behaviour-changing entries distilled from the 2026-05-14 napkin rotation
(archived at [`napkin-2026-05-14.md`](archive/napkin-2026-05-14.md)). The
rotation covers eight sessions across two threads — the multi-agent P8 team
(Pearly Drifting Jetty controller plus Nebulous, Arboreal, Torrid, Fronded,
Embered) and three Cursor / Codex closeouts (Luminous Glowing Moon plan
promotion; continuation-pointer clarification; agent onboarding flow patch).
The full session-by-session capture lives in the archived napkin; the
durable doctrine below is what changes behaviour next session, regardless
of who picks the work up.

### Coordination role discipline (multi-agent evidence)

- **Roles emerge from live pressure, not from a fixed menu.** The useful
  multi-agent topology in the P8 window (controller, marshal, reviewer,
  implementer, scout, standby) was selected from the scarce resource at
  the time — git/index/queue contention drove marshal value; bounded
  GO/BLOCK challenge drove reviewer value; an exact file bundle drove
  implementer ownership. Static role menus are useful as *prompts* for
  what shape might fit, but treating them as canonical topology risks
  premature structure and silent over-coordination. Naming a role
  costs nothing; naming the obligation plus the handoff proof is what
  actually pays off.
- **Every role description must carry its handoff proof.** "Marshal"
  worked because it meant *watching exact staged pathspecs and queue
  state*. "Reviewer" worked because it meant *GO/BLOCK on a bounded
  slice plus focused-test evidence*. "Controller" worked when it meant
  *allocator and sequencer*; it would become harmful if it slid into
  *central permission for every judgement*. When a role appears in a
  team plan, the next sentence should name what artefact proves the
  handoff.
- **Treat scout responses as input, not as permission.** Read-only
  scouts after a source commit are valuable when they preserve
  momentum into the next slice. They are *not* implicit licence to
  open a new implementation claim during closeout; the next slice
  needs fresh live grounding and an explicit route.
- **Pre-closeout sweep ritual is now a controller invariant.** Before
  hardening any "final status" sentence, sweep all six surfaces in
  this order: active claims, active commit queue, staged files,
  `git status --short`, shared comms, directed inbox (plus late
  scout/reviewer replies arriving after the last source commit).
  Discrepancies between these surfaces are status-worthy even when
  the session has no implementation assignment. "Empty claims and
  queue" is never the whole state during a closeout window.
- **Closeout comms can perturb the closeout bundle.** During a
  closeout commit window: one explicit marshal verification event is
  fine; further verification should be local-only unless a blocker
  appears. New comms events written after record-staged force the
  closeout bundle owner to re-enqueue or accept residue.

### Commit-window operational sharpening

- **`git:index/head` commit-queue claim pattern syntax**: when opening a
  commit-window claim, use `--area-kind git --area-pattern "index/head"`
  (bare, no `git:` prefix). The `git:` prefix is the symbolic name of
  the resource; the stored pattern is the bare path. The guard
  (`claimCoversGitIndexHead`) does exact-element match on the
  normalized list, so `["git:index/head"].includes("index/head")` is
  false. Mistake source: Luminous Glowing Moon 2026-05-14; behaviour
  change recorded so the next agent does not repeat it.
- **CLI flag-shape drift under coordination pressure**: the
  collaboration-state surface has moved. `comms inbox` takes
  `--agent-name`/`--comms-dir`, not `--agent`. `commit-queue` is a
  top-level `agent-tools` topic (`pnpm agent-tools:commit-queue --
  list --queue-status active`), not a `collaboration-state` topic.
  `comms send` is shared-log; directed routing belongs to
  `comms direct` with `--to-agent-name`, `--to-platform`,
  `--to-model`, `--to-session-prefix`. Check topic-specific help in
  every resumed or compacted session before relying on muscle memory.
- **Run formatting proof before the commit hook for new modules.** The
  Slice A landing burned a shared git/index window because Prettier
  fired inside the hook on a new module. The cheap cure is
  `pnpm agent-tools:repo-check -- prettier-staged` (or targeted
  Prettier) immediately before `git commit` when the bundle creates a
  new file. Re-record the queue fingerprint after the format, then
  retry the commit.

### Plan-author discipline reinforcement

- **DECISION-COMPLETE is the readiness gate, not paperwork after
  execution.** When the owner asks for an implementation plan, every
  execution-time vendor literal, output schema, interface signature,
  exit-code/sort-order/encoding decision, and help-text shape that
  *can* be settled at plan-author time *must* be settled there. The
  `plan-body-first-principles-check` vendor-literal clause permits a
  deferral only when the dep is added inside the same WS, and even
  then the plan must pin the call shape so the WS becomes
  drift-detection rather than decision-making. "Verify at execution
  time" is the failure mode this discipline forbids.
- **Verify vendor call shapes against installed-or-published docs at
  plan-author time.** "Well-known utility library" is not permission
  to pin a call shape from memory. Stable API across a v0.x line is
  necessary but insufficient evidence the call shape *I remember*
  matches the *current* shape (worked example: tinyglobby was
  documented as `glob({ patterns, ... })` from memory; actual current
  export is `glob(patterns, options)` positional). Cheap at
  plan-author time; expensive at WS execution.
- **Acceptance value-proxies must compare against independent
  ground-truth measures.** Reproducing a baseline value does not
  validate the CLI is correct if the baseline was itself produced by
  the same method (chars/4 reproducing chars/4 proves nothing).
  Compare against a method-independent measure (e.g. `wc -c` for
  chars, then chars/4 becomes mechanical). Acceptance proxies
  framed as "agrees with prior baseline ±N%" are tautological and
  fail under normal churn.

### Continuation surfaces

- **Skill text carries durable routing behaviour; continuation
  records carry volatile facts.** Branch, plan, next-step, commit ids,
  team expectation — every fact that changes between sessions belongs
  in the thread record, not in the skill body. The skill's job is to
  fire the routing on arrival; the record's job is to provide the
  current state for that routing to act on.
- **"Ready to land" is dangerous in continuation records after a
  commit window.** Use it only when the work is genuinely uncommitted
  and pending. Once the work lands, replace the phrase with commit
  evidence (`bfa26e01`, `498edcc2`, etc.). Stale "ready to land"
  wording in a continuation record is an actionable defect, not a
  wrapper.
- **When a collaboration skill changes session entry or exit
  behaviour, audit root README and platform onboarding adapters in
  the same closeout.** The specialised skill text is correct only
  half the story; a new agent can enter through README, a teammate
  prompt, or a Cursor/Codex rule and miss the new routing entirely.
  Routing surfaces are co-load-bearing with the skill body.

### Read-only support pattern (Torrid evidence)

- **For a read-only review or scout assignment, send two notes.**
  Send a *readiness note to the implementer* (naming likely risk
  surfaces, the minimum proof set, and the boundary that distinguishes
  this slice from adjacent work) *before* implementation. Send a
  *completion note to the controller* afterwards (with exact
  commands and evidence). Two notes give the controller a routable
  signal without requiring another claim.

---

## Recent graduations (2026-05-12 — Volcanic Charring Furnace)

Processed the substance distilled from
[`napkin-2026-05-12b.md`](archive/napkin-2026-05-12b.md) into durable homes
without using fitness numbers as brevity targets. The source archive remains
intact. Disposition:

- Mature commit/collaboration lessons landed in
  [`agent-collaboration.md`](../../directives/agent-collaboration.md),
  [`commit/SKILL-CANONICAL.md`](../../skills/commit/SKILL-CANONICAL.md),
  [`respect-active-agent-claims.md`](../../rules/respect-active-agent-claims.md),
  and
  [`collaboration-state-conventions.md`](../operational/collaboration-state-conventions.md).
- Learning-before-fitness details landed in
  [`substance-before-fitness.md`](patterns/substance-before-fitness.md):
  archive before compaction, and reconcile stale status without silent
  graduation.
- New pattern entry: static-analysis registration with scaffold
  ([pattern][static-analysis-scaffold]).
- Owner-visible or implementation-shaped follow-ups were routed to
  [`pending-graduations.md`](../operational/pending-graduations.md) as:
  commit-boundary peer-pair governance refinements; collaboration tooling
  operator UX backlog; detached monitor lifecycle contract; quality-gate
  profiling and built-surface proof backlog; skill and documentation surface
  audit follow-ups; graph-stack implementation and planning pattern candidates.
- Retained distilled state: the staged sequence still continues with
  `pending-graduations.md`, then `practice-bootstrap.md`; the hypothesis-layer
  multi-agent validation entry below remains held pending N≥3 validation.

---

## Held Pending Validation

### Hypothesis-Layer Routing for Multi-Agent Cures → `hypothesis.md` family

Multi-agent collaboration cures route through the hypothesis layer
before graduating to doctrine. Substance lives at
[`hypothesis.md`][n-agent-hypothesis] (per-primitive coordination
cures), [`falsification-criteria.md`][n-agent-falsify]
(per-primitive falsifiability), and [`experiments.md`][n-agent-experiments]
(empirical validation at N≥3). Capture → hypothesis → empirical
validation → graduate. Treated-as-hypothesis they get tested;
shipped-as-design they get defended. Substrate validated at N=2;
not yet at N≥3.

[n-agent-hypothesis]: ../../prompts/agentic-engineering/collaboration/hypothesis.md
[n-agent-falsify]: ../../prompts/agentic-engineering/collaboration/falsification-criteria.md
[n-agent-experiments]: ../../prompts/agentic-engineering/collaboration/experiments.md
[static-analysis-scaffold]: patterns/static-analysis-registration-with-scaffold.md

---

## Recently Distilled — 2026-05-12 Napkin Rotation

The nine entries previously held here have all graduated; routing is captured
in the 2026-05-12 Volcanic Charring Furnace graduation log above. Brief
disposition: pre-stage non-negotiability and advisory-decay → P3 commit-queue
guard at `c083a1ab`; agent-tools unified CLI → P-Foundation landed; peer
sidebars vs helpers → `inter-agent-sidebar-with-default-action` + agent-
collaboration.md; pathspec discipline + verify-actual-contents → PDR-054 +
peer-commit-absorption-third-direction pattern + agent-collaboration.md
§ Treat Commit as a Short-Lived Shared Transaction Surface; gendered-
pronoun default → user-memory + jc-* skill canonicals; tooling-discipline
items (glob quoting, markdownlint --fix safety) live operationally rather
than as distilled doctrine.

---

## Recently Distilled — 2026-05-13 Three-Napkin Synthesis

Substance routing for the three-rotation corpus
(`napkin-2026-05-12.md` + `napkin-2026-05-12b.md` + `napkin-2026-05-13.md`)
lives in the [historical synthesis report][synth-2026-05-13]. That report
carries ten numbered findings (F1-F10), evidence arcs, rejected
near-patterns, and routing decisions.

[synth-2026-05-13]: ../../research/agentic-engineering/continuity-memory-and-knowledge-flow/historical-napkin-synthesis-2026-05-13.md

- **F1 is the cross-cutting constraint** — passive-guidance loses to artefact
  gravity at the granularity of single decisions, with N=6 fresh corpus
  instances on top of the four already in the existing
  [`passive-guidance-loses-to-artefact-gravity`][f1-pattern] pattern and
  [PDR-029][f1-pdr]. The behaviour-shape for every NEW cure designed after
  2026-05-13: when choosing between a documented-but-not-enforced cure and
  a mechanical cure that fires at the surface where the misshape would
  otherwise land, prefer the mechanical cure. Passive guidance alone is a
  watchlist item; pair it with a tripwire or do not call it a cure.

[f1-pattern]: patterns/passive-guidance-loses-to-artefact-gravity.md
[f1-pdr]: ../../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md

- **F2–F10 are routed to candidate destinations** —
  [`pending-graduations.md`](../operational/pending-graduations.md)
  carries explicit candidates with trigger conditions. Highest-value
  next-touch items: PDR candidate `coordinator-role-as-allocator-not-
  gatekeeper` (Ferny + Wooded + Brazen evidence, two failure modes
  converging); rule candidate `boundary-design-strictness` for the
  owner four-part doctrine; `agent-collaboration.md § Treat Commit as
  a Short-Lived Shared Transaction Surface` amendment for mutual
  mechanical verification + hook authority; thread-record-routing-
  surfaces-drift amendment.

---

## Recently Distilled — 2026-05-10 Napkin Rotation

These entries merged during the 2026-05-10 deep consolidation pass.
Most graduated to permanent homes during the 2026-05-14 Verdant Swaying
Glade Route C-iv pass; the entries listed below remain held for
cross-session validation or for a destination decision in a future
consolidation.

### Curation And Doctrine-Holding

- (graduated 2026-05-14 — see Graduations Log entry under
  "Riverine Swimming Hull Batch C")

### Coordination And Commit Discipline

- (graduated 2026-05-14 — see Graduations Log entry under
  "Riverine Swimming Hull Batch C")

### Planning Arithmetic And Disposition

- (no remaining entries — both planning-arithmetic items graduated to
  the [`jc-plan` skill body § Disposition Ledger][plan-disposition])

[plan-disposition]: ../../skills/plan/SKILL-CANONICAL.md#disposition-ledger-for-apply-all-of-x-inputs

---

## Recently Distilled — 2026-05-09 Napkin Rotation

Most entries from the 2026-05-09 rotation graduated during the
2026-05-14 Verdant Swaying Glade Route C-iv pass. The entries listed
below remain held for a destination decision in a future consolidation.

### PR Closeout Discipline

- **PR closeout has two distinct evidence loops.** Gate state (checks,
  Sonar, CI) and reviewer-comment state are independent. A green PR can
  still need a comment-harvest pass — top-level comments, review
  summaries, and threads marked resolved/outdated may carry live
  feedback outside the check surface. Fetch and classify before the
  next edit.
- **PR title/body are an active review surface.** Branch scope drift
  makes stale metadata an actionable defect, not a wrapper. Rewrite
  title/body after `origin/main...HEAD` comparison before disposing
  any metadata-shaped review comment as `fixed`.
- **For planning PRs, report two verdicts separately.** PR technical
  readiness and plan decision-completeness are independent gates. A
  green PR must not collapse unresolved planning questions (topology
  findings, slice-plan findings, plan-internal contradictions) into
  implicit acceptance.
- **Remote metadata transitions are part of state handoff.** When a
  closeout moves from local/pending to pushed, refresh the live PR
  body and next-session records in the same handoff pass so the next
  session does not inherit stale blockers.

### Generator And Tooling Discipline

- **Self-lint surfaces deprecated helper drift.** Adding new candidate
  rules in the plugin self-lint lane catches maintenance drift early.
  When core ESLint helper types reject a locally-typed plugin, split
  the config at the type boundary rather than weakening the plugin
  type.

### Multi-Reviewer Dispatch Discipline

- **Each reviewer lens shrinks a different part of the audit-shape
  surface.** Parallel WS0 reviewers (test, fred, docs-adr) are not
  redundant; each catches BLOCKERs the others cannot see. Test caught
  literal-text assertions; fred caught a deferred boundary decision;
  docs-adr caught propagation-surface omissions. Plan WS0 dispatch
  expecting concrete cycle-shape correctives, not just nudges.

*"Decide at write time" deferrals are unmade load-bearing decisions*
graduated 2026-05-10 to the host pattern
[`deferred-at-write-time-is-unmade-load-bearing-decision`][def-at-write].

[def-at-write]: patterns/deferred-at-write-time-is-unmade-load-bearing-decision.md

---

## Graduations Log — 2026-05-14 Verdant Swaying Glade Route C-iv

Graduations landed during the 2026-05-14 Route C-iv pass. Entries below
moved from the 2026-05-09 / 2026-05-10 rotations to their named permanent
homes per canonical step 7b. Five distilled entries graduated as new
substance; four were verified as already-incorporated and pruned with
back-cites; two planning-arithmetic items consolidated into one
disposition-ledger section in the `jc-plan` skill body.

**Newly graduated (5 substance moves)**:

- *Target-architecture wording needs consuming-runtime evidence*
  → [`principles.md` § Code Quality (after "Misleading docs are blocking")][prin-target-arch]
- *Commit-helper state writes still need peer-claim audits*
  → [`agent-collaboration.md` § Treat Commit as a Short-Lived Shared Transaction Surface][ac-helper]
- *Generators require populated source data* (consolidating the
  2026-05-09 + 2026-05-10 mentions of the same insight)
  → [`docs/engineering/workflow.md` § 12 Workflow Gotchas][wf-generators]
- *Exact focused tests should use the runner directly when script forwarding drifts*
  → [`docs/engineering/workflow.md` § 12 Workflow Gotchas][wf-runner]
- *Unit test taxonomy beats historical local precedent*
  → [`docs/engineering/testing-tdd-recipes.md` § Adding To Existing IO Debt In A Unit Test File][tdd-iodebt]

**Consolidated graduation (2 entries → 1 section)**:

- *Count targets derived from current state must name their derivation*
  AND *"Apply all of X" needs a disposition ledger, not one cycle per item*
  → [`jc-plan` skill body § Disposition Ledger For "Apply All Of X" Inputs][plan-disposition]

**Already-incorporated prunes (4 back-cites, no new substance)**:

- *Reading doctrine is weaker than holding its frame at output time*
  was already covered structurally by `principles.md` § Architectural
  Excellence Over Expediency — three structural cues at output time
  (PDR-043 / ADR-172). The cure is operational; the distilled note
  was a refinement of an already-landed cure.
- *Parent directives need operational cures when the rule keeps being
  rediscovered* was already incorporated into `agent-collaboration.md`
  § c (Treat Commit as a Short-Lived Shared Transaction Surface), which
  now names both `git add -- <paths>` and `git commit -- <paths>` as
  the cured pair. Cure landed; observation distilled.
- *Whole-tree hooks can block pathspec-only commits by design* was
  already incorporated into `agent-collaboration.md` § c — the queue
  protects authorial-bundle integrity but does not narrow whole-tree
  hooks; minor peer-owned failures are repaired in place. Cure landed;
  observation distilled.
- *Check schema or CLI help before authoring claims from memory* was
  already covered structurally by [`read-before-asking.md`][rba] (and
  PDR-057, the empirical-answerability pre-question gate). The
  structural cure is read-before-asking; the distilled note was an
  instance.

[prin-target-arch]: ../../directives/principles.md#code-quality
[ac-helper]: ../../directives/agent-collaboration.md#c-treat-commit-as-a-short-lived-shared-transaction-surface
[wf-generators]: ../../../docs/engineering/workflow.md#generators-require-populated-source-data
[wf-runner]: ../../../docs/engineering/workflow.md#use-the-test-runner-directly-when-script-forwarding-drifts
[tdd-iodebt]: ../../../docs/engineering/testing-tdd-recipes.md#adding-to-existing-io-debt-in-a-unit-test-file
[rba]: ../../rules/read-before-asking.md

---

## Graduations Log — 2026-05-14 Riverine Swimming Hull Batch C

Three curation entries from the 2026-05-10 Sylvan Fruiting Glade rotation
graduated to permanent homes per the graduation-triage-disposition
2026-05-14 plan's Batch C. All three were stable since 2026-05-10 (4 days)
with no contradicting evidence; all are minor curation/hygiene cures
whose right home is the workflow gotchas section in the engineering
workflow document.

**Newly graduated (3 substance moves)**:

- *Lettered-section edits must re-read the parent count*
  → [`docs/engineering/workflow.md` § 12 Workflow Gotchas — Lettered-Section Edits Must Re-Read The Parent Count][wf-lettered]
- *Growth-axis metadata is live doctrine*
  → [`docs/engineering/workflow.md` § 12 Workflow Gotchas — Growth-Axis Metadata Is Live Doctrine][wf-growth]
- *Shell loops over multiline command output are unsafe in deletion paths*
  → [`docs/engineering/workflow.md` § 12 Workflow Gotchas — Shell Loops Over Multi-line Command Output Are Unsafe In Deletion Paths][wf-shell]

[wf-lettered]: ../../../docs/engineering/workflow.md#lettered-section-edits-must-re-read-the-parent-count
[wf-growth]: ../../../docs/engineering/workflow.md#growth-axis-metadata-is-live-doctrine
[wf-shell]: ../../../docs/engineering/workflow.md#shell-loops-over-multi-line-command-output-are-unsafe-in-deletion-paths
