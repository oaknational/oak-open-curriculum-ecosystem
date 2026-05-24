---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
---

# Napkin

## 2026-05-24 — Hushed Fading Hush / codex / GPT-5 / `019e5a`

Fresh active napkin after the processed
[post-M1 cleanup window][post-m1-window] was archived.

### What Was Done

- Re-grounded under `start-right-team` and `consolidate-docs`.
- Ran the live fitness report and found the current critical item:
  active-napkin prose line width.
- Reflowed the overlong Seaworthy Window 2 capture without removing substance.
- Archived the processed active window only after every entry in it had an
  explicit processing disposition or live route.

### Patterns to Remember

- `comms watch` with a fresh seen-file can replay a large historical backlog.
  Seed or expect the backlog explicitly before treating watcher quietness as
  current-state evidence.
- Fitness critical-by-line-width can be fixed by faithful reflow first. If that
  exposes hard line-count pressure on already-processed capture, archive the
  processed napkin window instead of trimming substance.
- Same `session_id_prefix` continuity can still show generated display-name
  drift in comms and active claims after compaction or resumed goal turns.
  Treat the prefix plus live claim evidence as the stronger continuity signal,
  then name the drift in closeout instead of opening a competing claim.
- Repo-continuity soft-tier consolidation worked by preserving the outgoing
  live-index snapshot in archive, then replacing duplicated historical routing
  with pointers to thread records and active plans. Validate with targeted
  markdownlint, `git diff --check`, and both practice fitness modes.
- `claims open` uses `--ttl-seconds`, not `--freshness-seconds`. The rendered
  claim still stores `freshness_seconds`, but the CLI flag is the TTL form.
- For active pending-graduations shards, a low-risk soft-tier drain is to find
  entries already marked `status: graduated`, verify their durable home still
  carries the substance, archive the full body, and remove only that processed
  body from the shard.
- I repeated the pipe-in-evidence mistake while locating the commit queue path.
  If a filter feels useful, run the broad producer and the narrow search as
  separate readable evidence steps.
- End-session consolidation can validly finish a small soft slice without
  claiming the broader consolidation goal. Close the owned claim, update the
  touched thread and repo-continuity facts, then stop when the owner says the
  session is over.
- `comms send` no longer accepts the old `--shared-log` flag. Let the command
  use its built-in shared-log path, and check topic help before old flag shapes
  leak into closeout muscle memory.
- I misread Jim's Sonar CPD correction once: the intended boundary is generated
  code, tests, and config files excluded from CPD, with agent tools kept inside
  the CPD corpus. Treat owner wording as the control surface when policy text
  and live intent need reconciliation.

[post-m1-window]: archive/napkin-2026-05-24-post-m1-cleanups-window.md

## 2026-05-24 — Mistbound Hiding Threshold / claude / claude-opus-4-7 / `0e27cc`

### Capture H — small-PRs / push-often / branch-fitness protocol (owner-directed; paused)

Owner direction this turn (verbatim, paused-state capture):

> create protocols and guidance around committing, pushing, PR state
> monitoring and Sonar state monitoring, including a preference towards
> small commits, pushing often, monitoring GH state for PRs, monitoring
> Sonar state for PR, and measuring the total number of files touched on
> a branch and the total number of changes made on a branch as reported
> by git, and setting soft, hard and critical feedback for them, in an
> automated way, probably a hook, with the goal of keeping PRs small
> enough to be easily reviewed by a human, and simple to reason about.
> This implies many more small PRs happening, potentially in parallel,
> that is fine, the worktree models lends itself well to that.

**Capture scope**: not a plan, not a decision. Substrate-buffer of the
direction + my ultrathink surfacing the moves required when owner
unpauses. Future-me opens a plan / PDR / ADR pair when authorised.

**Stated dimensions (5)**:

1. Commit cadence: prefer small commits.
2. Push cadence: prefer pushing often.
3. PR state monitoring: GH state surfaced automatically.
4. Sonar state monitoring: PR-scoped Sonar surfaced automatically.
5. Branch-size fitness: files-touched + total-changes, with soft/hard/
   critical bands, probably a hook.

**Unstated but implied / inferred**:

- Marshal seat as currently shaped serialises commits. Small + parallel +
  worktree-per-slice means the marshal role's serialisation value drops.
  Either marshal becomes per-worktree, or dissolves into self-marshal
  with a discovery surface for cross-worktree conflicts.
- Push authz is currently owner-gated and accumulates 50+ commits before
  release (see M1 Safe Pause framing). "Push often" cannot land without
  shifting where push-authz lives — either pre-authorised by policy on
  green-marshal-cycle, or a dedicated push role on a different cadence,
  or pre-defined push windows.
- "Branch" is ambiguous in a multi-worktree world. Files-touched +
  changes-aggregate must name a measurement boundary (current-worktree-
  HEAD vs branch-vs-main vs PR-base). Pre-commit measures intent;
  pre-push measures realised PR shape. Different decisions; the hook
  shape may need to live at pre-push, not pre-commit.
- Worktree-isolation is named with confidence but
  `feedback_worktree_isolation_unreliable` says parallel worktree
  agents can land on different bases than parent HEAD. Either the
  worktree primitive needs reinforcement, or protocols compensate via
  base-snapshot pinning + gate-check on parent HEAD.
- Hook output appears on every commit/push. Verbose output eats the
  ~80k reliable-context budget. Output must be terse — one line per
  signal class — to stay in the budget.
- Existing `pnpm practice:fitness` is the natural home for branch-size
  fitness as a new dimension. Single CLI entry preserves the
  observability discipline already in place.

**Tensions and gaps surfaced via ultrathink**:

- *Source vs substrate in change-count*: 466 commits ahead of origin on
  this branch includes huge substrate writes (`.agent/**`,
  `.agent/state/collaboration/comms/**`). Substrate is not reviewable
  the way source is. The branch-fitness metric likely needs **two axes**
  — reviewable-LOC (source only) and total-LOC (push payload). Different
  thresholds; different consumers.
- *CI capacity*: small-many-parallel multiplies CI runs. CI minutes
  burn rises; wall-clock may improve via parallelism. Worth surfacing
  the cost trade-off when proposing thresholds.
- *Reviewer-load*: many small PRs mean many reviews. Reviewer dispatch
  already scales via sub-agents but throughput pressure grows.
- *Branch-naming proliferation*: many short-lived branches need a
  cleanup primitive (auto-delete on merge; naming convention rule).
- *Hook-bypass culture risk*: SOFT signals that nag get bypassed. SOFT
  must be informative not nagging or `--no-verify` rate rises (already
  named as recurring friction). Tie this to the existing
  `no-verify-requires-fresh-authorisation` rule explicitly.
- *Existing tooling*: `gh pr` shows file-count + LOC in the diff
  natively; Sonar shows PR-scoped quality gates natively. The hook
  cures PRE-push pressure; the monitoring cures POST-push observability.
  Two different surfaces with two different mechanisms.
- *Threshold defaulting*: common practice is 500/1000/2000 reviewable
  LOC for soft/hard/critical and 10/30/50 files. These need empirical
  validation against this repo's slice shape; not invent-from-thin-air.
- *Push-authz mechanism*: the cleanest shape is policy-based (green
  marshal cycle + branch-fitness GREEN → push-authz implicit) rather
  than role-based. Role-based reintroduces the marshal-as-bottleneck
  shape.

**Cure-shape implications (provisional, paused-state names)**:

- **Branch-fitness CLI**: `pnpm practice:fitness:branch` — measures
  reviewable-LOC + total-LOC + files-touched + commits-ahead-of-base;
  emits SOFT/HARD/CRITICAL with named thresholds.
- **Pre-push hook**: invokes the CLI; emits at HEAD-snapshot; advisory
  at SOFT/HARD; blocking at CRITICAL.
- **Pre-commit hook addition** (optional): surfaces current branch
  fitness in single-line summary so agents see the pressure building
  before push.
- **PR observer agent or CLI**: `pnpm pr:watch` — polls `gh pr checks`
  and Sonar PR-scoped API; surfaces state changes to comms as
  PR-state-changed events.
- **Push-authz policy**: an ADR specifying when push is implicitly
  authorised (small branch + green gates + green marshal cycle) vs when
  it requires explicit owner authz (over CRITICAL threshold or atomic-
  M1-pause class).
- **Per-worktree marshal**: a PDR specifying the marshal role's
  per-worktree shape; or an ADR specifying the self-marshal-with-
  discovery shape. The choice depends on whether worktree-isolation
  gets reinforced first.

**What HAS been said elsewhere (cross-refs)**:

- `feedback_build_vs_buy_first` — check `gh pr` + Sonar native shapes
  before designing bespoke hooks.
- `feedback_all_quality_gates_blocking_always` — branch-fitness CRITICAL
  is a gate; cannot be framed as "out of scope".
- `feedback_new_eslint_rules_start_warn` — analogous: branch-fitness
  thresholds start at SOFT, escalate after stability.
- `feedback_no_moving_targets_in_permanent_docs` — protocol docs cite
  measurable thresholds, never "small" handwaves.
- `feedback_worktree_isolation_unreliable` — worktree-confident
  framing in the proposal needs reinforcement work before parallel
  small-PR shape can land cleanly.
- `feedback_hook_failures_are_questions` — hook output is a question
  not a nag; threshold framing matters.

**What HAS NOT been said (gaps the owner left for the team)**:

- Whether CRITICAL is blocking or advisory.
- Whether substrate writes count toward the metric or are excluded.
- Whether the metric is per-worktree, per-branch, or per-PR.
- Whether push-authz policy moves with this protocol or stays owner-
  gated separately.
- Whether the Commit Marshal role transforms or persists in current shape.
- Whether the M1 Safe Pause push is itself the last big push before
  the protocol takes effect, or whether the protocol applies retroactively
  to that push too.

**Pickup hook for next-me / next-team (when owner unpauses)**:

1. Open a thread record `branch-fitness-and-push-cadence.next-session.md`.
2. Survey existing `pnpm practice:fitness` shape + `gh pr` + Sonar APIs.
3. Resolve the 6 gap-questions above via owner sidebar before drafting.
4. Author a PDR for the doctrine shape + an ADR for the substrate
   phenotype (hook + CLI + observer).
5. Ship at SOFT-only initially; escalate after observation window.
