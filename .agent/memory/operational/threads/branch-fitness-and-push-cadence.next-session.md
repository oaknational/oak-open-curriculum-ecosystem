# Next-Session Record - `branch-fitness-and-push-cadence` thread

## Status

**Cycle 1 substrate captured, pending marshal commit/validation closeout.**
This thread record was created 2026-05-24 by Pelagic Snorkelling Sextant
(`codex` / `GPT-5` / `019e5b`) while curating the active napkin under
`oak-start-right-team` and `oak-consolidate-docs`.

The executable plan is
[`branch-fitness-and-push-cadence.plan.md`](../../../plans/agentic-engineering-enhancements/current/branch-fitness-and-push-cadence.plan.md),
authored by Mistbound Hiding Threshold (`claude` / `claude-opus-4-7` /
`0e27cc`). Mistbound's directed comms on 2026-05-24T21:14Z confirmed that
napkin Capture H and the marshal-monitoring highlight are load-bearing source
substrate for that plan's Cycle 1.

The outgoing active napkin text is preserved verbatim at
[`napkin-2026-05-24-pelagic-hard-napkin-window.md`](../archive/napkin-2026-05-24-pelagic-hard-napkin-window.md).
That archive is evidence, not the knowledge home. The extracted routing home is
this thread record plus the executable plan.

## Owner Direction

Owner direction captured in the source napkin asked for protocols and guidance
around:

1. Committing in small units.
2. Pushing often.
3. Monitoring GitHub PR state.
4. Monitoring Sonar PR state.
5. Measuring branch size by files touched and git-reported change volume.
6. Emitting soft, hard, and critical feedback automatically, probably via a
   hook.
7. Keeping PRs small enough for human review and simple reasoning.
8. Enabling many small PRs, potentially in parallel, through the worktree
   model.

## Stated Dimensions

The napkin substrate named five explicit dimensions:

1. Commit cadence: prefer small commits.
2. Push cadence: prefer pushing often.
3. PR state monitoring: surface GitHub PR state automatically.
4. Sonar state monitoring: surface PR-scoped Sonar state automatically.
5. Branch-size fitness: measure files touched and total changes, with soft,
   hard, and critical bands, probably via a hook.

## Implied Consequences

The source analysis surfaced these consequences:

- The current Commit Marshal shape serialises commits. Many small PRs in
  parallel through worktrees reduces the value of singleton serialisation and
  increases the value of observation and signal routing.
- Push authorisation is currently owner-gated. "Push often" cannot work unless
  push authorisation moves into a policy, a dedicated push role, or predefined
  push windows.
- "Branch" is ambiguous in a multi-worktree environment. Measurement needs an
  explicit boundary: worktree HEAD, branch versus main, or branch versus PR
  base.
- Pre-commit and pre-push signals answer different questions. Pre-commit gives
  early warning while the branch is growing; pre-push measures the realised PR
  shape.
- Worktree confidence is not enough by itself because parallel worktrees can
  land on different bases than parent HEAD. The protocol needs base-snapshot
  pinning or gate checks against parent HEAD.
- Hook output must be terse. Verbose hook output consumes the reliable context
  budget and increases bypass pressure.
- Existing `pnpm practice:fitness` is the likely home for branch-size fitness,
  because it already carries the repo's fitness-observability discipline.

## Tensions And Gaps

The napkin analysis surfaced these design tensions:

- Source versus substrate: `.agent/**` and comms-event volume inflate total
  change counts but do not predict human source-review effort. The metric needs
  at least two axes: reviewable LOC and push payload.
- CI capacity: many small PRs can increase CI minutes even if wall-clock
  throughput improves.
- Reviewer load: more small PRs can mean more review events.
- Branch proliferation: many short-lived branches need naming and cleanup
  discipline.
- Hook-bypass culture: soft signals must be informative, not noisy, or agents
  will reach for `--no-verify`.
- Build-vs-buy: `gh pr` and Sonar already expose much of the monitoring data.
  The bespoke work should fill the pre-push pressure and comms-observability
  gaps, not replace native tools blindly.
- Threshold defaults need empirical calibration. Common bands such as
  500/1000/2000 reviewable LOC and 10/30/50 files are starting hypotheses, not
  doctrine.
- Policy-based push authorisation is probably cleaner than role-based push
  authorisation, because role-based authorisation can recreate the marshal
  bottleneck.

## Provisional Cure Shape

The source substrate pointed at this implementation shape:

- Add `pnpm practice:fitness:branch`.
- Measure reviewable LOC, push payload, files touched, and commits ahead of the
  chosen base.
- Emit soft, hard, and critical bands with named thresholds.
- Add a pre-push hook that invokes branch fitness at the publication boundary.
- Consider a pre-commit hook that emits a single-line branch-fitness summary as
  early warning.
- Add a PR observer CLI, provisionally `pnpm pr:watch`, that polls GitHub PR
  checks and Sonar PR-scoped state, emitting comms events when state changes.
- Author a push-authorisation ADR describing when push is implicit versus when
  explicit owner authorisation remains required.
- Author a marshal-role PDR describing whether the marshal becomes
  per-worktree, becomes self-marshal plus discovery, or keeps a monitoring role
  while serialisation dissolves.

## Marshal-Monitoring Extension

The owner separately asked the team to find and highlight the Commit Marshal
monitoring remarks. The extracted marshal-monitoring surface has four parts:

1. Branch-fitness signal: the marshal sees files touched, reviewable LOC, and
   push-payload pressure at cycle boundaries.
2. PR-state signal: GitHub PR check transitions are surfaced into comms as
   state-changed events.
3. Sonar-state signal: SonarCloud PR-scoped findings and quality-gate changes
   are surfaced into comms.
4. Role evolution: under small PRs and parallel worktrees, the marshal's value
   shifts from singular serialisation to observation and signal routing.

The source conclusion was that branch-fitness and marshal-monitoring are the
same artefact from two angles. The branch-fitness CLI produces the signal; the
marshal-monitoring surface makes the signal visible to peers without requiring
every agent to poll GitHub and Sonar separately.

## Owner-Gated Questions

The original six gap questions:

1. Is critical branch fitness blocking or advisory?
2. Does substrate count toward the metric or only toward a separate push-payload
   axis?
3. Is the metric per worktree, per branch, or per PR?
4. Does push authorisation move with this protocol or stay owner-gated
   separately?
5. Does the Commit Marshal role transform or persist in its current shape?
6. Does the protocol apply retroactively to the M1 Safe Pause push or only to
   later pushes?

Additional marshal-monitoring questions:

7. Does the Commit Marshal seat formally own PR-state and Sonar-state
   monitoring, or does that become a separate PR Observer role?
8. If marshal-owned, does the marshal seat hold through commit, push, PR merge,
   CI green, and Sonar green, or hand off after push?
9. How does the monitoring surface differ between the single-canonical-branch
   case and many small PRs in parallel?

## Cross-References

- Executable plan:
  `.agent/plans/agentic-engineering-enhancements/current/branch-fitness-and-push-cadence.plan.md`
- Source archive:
  `.agent/memory/active/archive/napkin-2026-05-24-pelagic-hard-napkin-window.md`
- Active napkin disposition index:
  `.agent/memory/active/napkin.md`
- Repository continuity index:
  `.agent/memory/operational/repo-continuity.md`
- Relevant rules and memory patterns named by the plan:
  `feedback_build_vs_buy_first`,
  `feedback_all_quality_gates_blocking_always`,
  `feedback_new_eslint_rules_start_warn`,
  `feedback_no_moving_targets_in_permanent_docs`,
  `feedback_worktree_isolation_unreliable`,
  `feedback_hook_failures_are_questions`,
  `feedback_no_cheap_cure_option`,
  `feedback_no_question_when_answer_is_forced`, and
  `feedback_long_term_architectural_excellence_is_always_the_answer`.

## Participating Agent Identities

| Agent Name | Platform | Model | session_id_prefix | first_session | last_session | role |
|---|---|---|---|---|---|---|
| Mistbound Hiding Threshold | claude | claude-opus-4-7 | 0e27cc | 2026-05-24 | 2026-05-25 | plan-author-and-commit-marshal (retired 2026-05-25T05:47Z) |
| Pelagic Snorkelling Sextant | codex | GPT-5 | 019e5b | 2026-05-24 | 2026-05-24 | cycle-1-substrate-curator |

## Resume Contract

Next agent must read this record, the executable plan, and the source archive
before changing branch-fitness protocol surfaces. Do not treat the archive as a
substitute for this extracted record. Do not mark Cycle 1 complete unless the
thread record, repo-continuity row, napkin pointer update, validation, and
marshal/commit disposition are all proven current.
