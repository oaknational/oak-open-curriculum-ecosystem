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
`napkin-2026-02-16.md` through `napkin-2026-05-09.md`
(sessions 2026-02-10 to 2026-05-09).

**Permanent documentation**: Entries graduate to permanent docs
when stable and a natural home exists. Always graduate useful
understanding — fitness management handles the consequences. What
remains here is repo/domain-specific context with no natural
permanent home, plus entries explicitly held pending validation.

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
- **"Decide at write time" deferrals are unmade load-bearing
  decisions.** When a plan defers a substantive decision to
  implementation time, that is not flexibility — it is a load-bearing
  decision the plan owner has declined to make, which the cycle
  author will then be forced to make under implementation pressure.
  Surface the deferral as a structural choice in WS0 before any code
  is written. (Pattern candidate registered in
  `pending-graduations.md`.)
