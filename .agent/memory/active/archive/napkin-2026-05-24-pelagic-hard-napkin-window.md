---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
---

# Napkin

Archived by Pelagic Snorkelling Sextant on 2026-05-24 during the hard
active-napkin pressure pass. This file preserves the outgoing active window
verbatim enough for future audit; the replacement active napkin records the
entry-by-entry disposition and live routes.

## 2026-05-24 — Hushed Fading Hush handoff rerun / codex / GPT-5 / `019e5a`

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

### 🔆 HIGHLIGHT — Commit Marshal monitoring extension (owner-directed)

Owner direction in the post-cull session immediately preceding this
compaction: "Find the remarks around the Commit Marshall also
monitoring e.g. number of files touched or sonar status, and
highlight them."

The marshal-role-transformation thread that runs through Capture H
names a **wider marshal monitoring surface** than the current
"stage → husky → commit" cycle. The shape the owner is pointing at:

1. **Branch-fitness as marshal-visible signal**: the marshal seat
   observes files-touched + total-changes (reviewable-LOC +
   push-payload axes) against SOFT/HARD/CRITICAL thresholds. The
   marshal does not own thresholds; it surfaces the signal at each
   cycle boundary so peers see pressure accumulating before push.
2. **PR-state monitoring as marshal-adjacent**: `gh pr checks`
   results and CI status changes are surfaced into comms as
   PR-state-changed events. Currently informal (Director or
   implementers poll); the marshal seat is the natural canonical
   surface because every PR change is downstream of a marshal-cycle
   commit.
3. **Sonar PR-state monitoring as marshal-adjacent**: SonarCloud
   PR-scoped quality gates (new findings, density, coverage gaps)
   surface to comms when state changes. Same routing argument:
   downstream of marshal-cycle commits.
4. **Marshal role transformation under small-PR + parallel +
   worktree-per-slice**: marshal-as-singleton-serialiser is the right
   shape for multi-writer index races today; under parallel
   worktrees it becomes per-worktree OR dissolves into self-marshal
   with cross-worktree discovery. Either way the *monitoring*
   surface remains valuable even when the *serialisation* surface
   stops being singular.

**Sites in this Capture that carry the marshal-monitoring thread**:

- "Unstated but implied / inferred" §1 — marshal-role serialisation
  value drops under parallelism; monitoring value persists.
- "Cure-shape implications" §"PR observer agent or CLI" — explicit
  proposal naming `pnpm pr:watch` polling `gh pr checks` + Sonar
  PR-scoped API + posting state-changed events to comms.
- "Cure-shape implications" §"Per-worktree marshal" — PDR/ADR
  candidate for the marshal-role evolution.
- "What HAS NOT been said" §"Commit Marshal role transforms or
  persists" — explicit gap-question for owner sidebar.
- "Push-authz mechanism" — names "marshal-as-bottleneck" as the
  failure mode to avoid; reinforces that the role's *value* must
  move from "serialise" to "observe + signal".

**Implication for the post-M1 protocol authoring phase**: the
marshal role's PDR/ADR pair is not separate from the branch-fitness
PDR/ADR pair — they are the **same artefact viewed from two
angles**. The branch-fitness CLI feeds the marshal-monitoring
surface; the marshal-monitoring surface is where peers see the
fitness signal without each agent polling separately.

**Concrete sub-questions for owner sidebar when the protocol thread
opens** (additions to the 6 gap-questions above):

7. Does the Commit Marshal seat acquire formal responsibility for
   PR-state + Sonar-state monitoring, or do those become a separate
   "PR Observer" role?
8. If marshal-owned: does the marshal seat hold across the entire
   push-cycle (commit → push → PR-merged → CI-green → Sonar-green),
   or does it stand down at push-cycle and a different role takes
   over the PR-state phase?
9. How does the marshal-monitoring surface differ between the
   single-canonical-branch case (current shape pre-M1) and the
   many-small-PRs-in-parallel case (target shape)?

## 2026-05-24 — Velvet Stalking Moth / cursor / Composer / `bde2f8`

### What Was Done

- Owner asked whether `oak-preview-1` MCP works; confirmed with
  `get-curriculum-model`, then owner-directed full black-box pass (25 tools).
- Preview URL on `feat-mcp-graph-support-foundation` branch deployment; API
  v0.7.0; graph tools return full payloads (misconception graph ~5.4 MB).
- Owner closed session: preview validation satisfies PR #108 merge requirement
  and M1 Safe Pause criterion; `/oak-session-handoff` executed.

### Patterns to Remember

- `oak-preview-1` in `.cursor/mcp.json` points at the PR #108 Vercel preview,
  not production `oak-prod`.
- Suggest scope returns labels but empty `url` — agents should use slug from
  label/context or follow with `fetch`/`search`.
- Thread `fetch` returns ordered units but `oakUrl: null` on unit entries.

## 2026-05-24 — Hushed Fading Hush / codex / GPT-5 / `019e5a`

### Patterns to Remember

- A session-handoff rerun can happen after HEAD and branch have moved under the
  same Codex seat. Refresh `git status --short --branch`, `git log --oneline`,
  claims, queue, and current comms before repeating a closeout claim.
- After the release/branch move to `bf3a8152`, `pnpm agent-tools:*` wrappers
  tried to run an install and hit the non-TTY modules-purge prompt. For
  read-only closeout state, `node agent-tools/dist/src/bin/agent-tools.js ...`
  worked without changing dependency state; still report the pnpm wrapper
  prompt if it blocks the mandatory `pnpm check` handoff gate.

## 2026-05-24 — Hearthlit Brazing Magma / codex / GPT-5 / `019e5a`

### Patterns to Remember

- PR and Sonar evidence can change during the closeout window after an earlier
  read-only report. Before session handoff, refresh both GitHub PR state and
  Sonar PR quality-gate state; for PR 108 the earlier `50f8ba41` Sonar-red
  snapshot was superseded by merge commit `2462952a` and Sonar OK on
  `58feff48`.

## 2026-05-24 — Charcoal Brazing Kiln / claude / claude-opus-4-7 / `7c7327`

### Capture — Comms corpus as research substrate (owner-directed; owner-gated)

Owner direction at post-M1-merge boundary (verbatim, surfaced under
`/oak-metacognition /oak-session-handoff` invocation):

> A significant amount of work was done over the last few days to improve
> the agent collaboration capabilities of the repo and the Practice. Much
> is documented in ADRs/PDRs. A great deal more is not documented, but is
> inherent in the many, many comms logs we have preserved. Even deeper,
> there are yet to be recognised or analysed patterns that will emerge
> from the comms logs, analysed over time, subject, context, theme,
> connection, that will contribute massively to our understanding of
> modes of agent collaboration and how to improve it. This is true
> original research. That research will require dedicated sessions by
> dedicated agents. It can't happen yet, but it must happen.

**Capture shape**: thread record at
`.agent/memory/operational/threads/agent-collaboration-research.next-session.md`
is the load-bearing artefact (load-bearing for the research vector); this
napkin entry + the pending-graduations buffer entry are pointers.

**Analysis vectors owner named**: subject, context, theme, connection.

**Candidate themes from one session lens (Charcoal 2026-05-24)**: ≥10 named
in the thread record — substrate-pointer-pattern v2, marshal-seat watcher
silent-failure mode, owner-direction supremacy on outcome-not-literal-form,
mid-cycle pause preserving reviewer convergence, cross-platform marshal-
cycle parity, owner-authz exception architectural-honesty, watcher-as-
team-state-shared-memory, heartbeat cron + cron-redundancy rule, PDR-064
two-moments worked corpus, 3-commit-split vs single-bundle. Plus the
meta-theme of corpus-as-research-substrate.

**Resume contract**: owner-gated; no autonomous dispatch; when dispatched
the receiving agent reads the thread record end-to-end before any pass.

### Processing Disposition

- Routed: thread record + pending-graduations entry + final broadcast.
- Not archived: this entry stays in active napkin as fresh capture under
  fitness budget (line target 220 / limit 300; entry budget-checked).
- No graduation-trigger fired by this entry; the trigger is owner direction
  to dispatch a research-mode session.

### Capture — Discoverability requires multi-surface registration

Worked-instance surfaced when owner asked *"is the research plan fully
discoverable by all relevant canonical surfaces?"* immediately after I
created the research thread. Honest audit verdict: **NO**.

Gap: the thread record file existed at
`.agent/memory/operational/threads/agent-collaboration-research.next-session.md`
but was NOT registered in `repo-continuity.md § Active|Paused Threads`,
which `threads/README.md` explicitly names as source-of-truth for the live
thread inventory. A future agent following the canonical discovery path
would not have found the new thread.

Cure: discoverability requires FIVE surfaces, not just file-existence:

1. The file itself in `threads/` directory
2. Row in `repo-continuity.md § Active|Paused Threads` + link reference
3. Cross-reference from the source thread (the thread the new thread
   spun off from)
4. Active-napkin pointer for current-session visibility
5. Comms broadcast for corpus-side discovery (recursive: the corpus
   contains the recognition of new substrate)

Surfaces deliberately NOT in this set (with reason): `practice-index.md`
indexes Practice doctrine (PDRs/ADRs/rules) not operational memory;
`pending-graduations.md` is for doctrine candidates not research vectors;
`AGENT.md` / `CLAUDE.md` are directive-class not pointer-class.

**Pattern candidate** for pending-graduations register if a second
worked-instance fires (a new thread created without canonical-inventory
registration is the failure mode this cures).

### Processing Disposition (second capture)

- Worked-instance: 1 (this session). Single-instance; pattern-candidate
  status; not yet doctrine-graduation candidate.
- No archive move; this entry rides the existing fresh-capture window.

### Capture — CLI-shape drift in cron prompts written from stale shape memory (post-compaction-5)

On post-compaction-5 resume the heartbeat cron prompt I re-armed
(`b69f7b10`) used the pre-pause CLI shape: `pnpm agent-tools:comms send
--to BROADCAST --kind heartbeat --title "..." --body-stdin --tag
heartbeat`. None of those flags match the current CLI:

- No `pnpm agent-tools:comms` script — `comms` is a sub-topic under
  `collaboration-state` (canonical: `node agent-tools/dist/src/bin/
  agent-tools.js collaboration-state comms send …`).
- No `--to` flag — BROADCAST is the implicit default; directed sends
  use a separate `comms direct` action.
- No `--kind` flag — body content is `--body` or `--body-file` only.
- No `--body-stdin` flag — explicit `--body-file <path>` is required.
- `--tag` namespace is restricted (ADR-183): only `failure-mode`,
  `behaviour-note`, `heartbeat` are accepted; arbitrary tags like
  `implementor-resume` are rejected.

Surfaced silently because `pnpm -s` swallows non-zero exits. The first
broadcast attempt produced EXIT=1 + no visible error; only re-running
without `-s` revealed `Command "agent-tools:comms" not found`.

**Pattern**: cron prompts authored from session-end shape memory CAN
silently fail across compaction boundaries when underlying CLI evolves.
Re-grounding-by-help-text at cron-rearm time costs ~30 seconds and
catches the drift before the cron fires (and fails) repeatedly.

**Cure applied this session**: re-armed cron at `a5dcd2fc` using the
canonical `node …/agent-tools.js collaboration-state comms send
--body-file --platform claude --model claude-opus-4-7 --tag heartbeat`
shape, with exit criterion: 5 idle ticks → stand down.

**Pattern candidate** for pending-graduations register if a second
worked-instance fires (any cron whose stale-shape prompt would silently
fail across compaction is the failure mode).

### Processing Disposition (third capture)

- Worked-instance: 1 (this session, post-compaction-5). Single-instance;
  pattern-candidate status; not yet doctrine-graduation candidate.
- No archive move.
