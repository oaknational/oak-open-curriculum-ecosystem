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

These entries merged during the 2026-05-10 deep consolidation pass and
remain pending one subsequent-session validation cycle before graduation.

### Curation And Doctrine-Holding

- **Reading doctrine is weaker than holding its frame at output time.**
  Foundational-doc work must lead with each section's role question:
  does this still serve its role? Metrics may inform the diagnosis, but
  optimisation vocabulary must not frame the work.
- **Target-architecture wording needs consuming-runtime evidence.** A
  shared package exposing a target schema is not proof that an app has
  migrated. Verify at least one composition root before using present
  tense in ADRs, runbooks, or operator docs.
- **Lettered-section edits must re-read the intro count.** Adding a new
  `a/b/c/d` child without re-reading the parent sentence lets "three
  rules" drift into a four-rule section.
- **Growth-axis metadata is live doctrine.** When a graduation lands in
  a directive, audit the file's `split_strategy` against the actual
  growth axis just introduced.

### Coordination And Commit Discipline

- **Commit-helper state writes still need peer-claim audits.** After any
  commit-queue completion or claim close, re-read active claims before
  the final state commit; helper-mediated writes can otherwise lose a
  fresh peer claim under rapid same-file updates.
- **Parent directives need operational cures when the rule keeps being
  rediscovered.** Five foreign-stage absorptions despite the explicit
  pathspec rule showed that the parent collaboration directive also had
  to name both `git add -- <paths>` and `git commit -- <paths>`.
- **Whole-tree hooks can block pathspec-only commits by design.**
  Pathspec discipline controls commit contents, not quality-gate scope.
  Minor peer-owned hook failures are repaired or coordinated; gates are
  not narrowed to the staged bundle.
- **Shell loops over multiline command output are unsafe in deletion
  paths.** Prefer `while IFS= read -r` over `for x in $(...)`, then
  verify after the action.

### Tooling And Test Proofs

- **Exact focused tests should use the runner directly when script
  forwarding drifts.** For agent-tools Vitest proof, prefer
  `pnpm --dir agent-tools exec vitest run <file>` when the package
  script starts running broader suites than the proof requires.
- **Unit test taxonomy beats historical local precedent.** Existing IO
  debt in a unit test file is not permission to add more; factor pure
  option parsers or formatters and test those directly.
- **Generators require populated source data.** A structurally valid
  generator run over sparse source data can produce semantically empty
  outputs; verify the expected dataset-size signal before trusting it.

### Planning Arithmetic And Disposition

- **Count targets derived from current state must name their derivation.**
  Concurrent same-day flow can invalidate an acceptance count before
  execution; re-derive the target at execution time and let substance
  preservation outrank stale arithmetic.
- **"Apply all of X" needs a disposition ledger, not one cycle per item.**
  When most inputs are redundant with canonical doctrine, thoroughness is
  every item having a recorded decision; implementation may be one small
  tranche plus a batched pending-graduations entry.

---

## Recently Distilled — 2026-05-09 Napkin Rotation

These entries merged this session and have not yet survived a
subsequent session without correction; held here for cross-session
validation per the step-7b stability criterion before any graduation.

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

- **Generators are valid only when their source data is populated.**
  A code-only generator run in a sparse checkout can produce
  structurally valid but semantically empty output. For ground-truth
  generators, run the full download-then-codegen path when local bulk
  data is absent; verify the expected dataset size (e.g. `Total
  lessons: 12391`) before trusting output.
- **Check schema or CLI help before authoring claims from memory.**
  Natural-language plausibility (`--area-kind file`) is not a
  substitute for the schema vocabulary (`files`). Read
  `active-claims.schema.json` or `<cli> --help` first when authoring
  claims, areas, or any structured-vocabulary input from memory.
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
