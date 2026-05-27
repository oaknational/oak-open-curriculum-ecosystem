---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
fitness_content_role: drainable-buffer
---

## Session: 2026-05-27 — statusline, EEF coordination, main merge closeout

### What Was Done

- Landed `8f3a9135` for the repo-owned Claude statusline renderer and tests,
  keeping the repo TypeScript statusline path decoupled from the user's global
  bash statusline script.
- Landed `544b2f4e` for the EEF value-PR coordination surfaces: review
  register, value-path reflection, comms-method comparison report, sidebar
  backup, and session coordination state.
- Landed `f6a9bb2a` for Hidden Dimming Threshold's completed curation bundle
  before merging `origin/main`, preserving the curation closeout and its own
  collaboration-state lifecycle closure in one durable commit.
- Merged `origin/main` at `a6e669db` / `v1.14.1` into
  `feat/graph-foundations` as `3c136e9d`.

### Surprise

- **Expected**: The `origin/main` merge would likely conflict because main
  overlapped statusline-adjacent agent-tools files and collaboration-state
  files touched by Hidden's closeout.
- **Actual**: Once Hidden's completed curation bundle was committed first, the
  merge itself landed cleanly with the `ort` strategy and only pulled in the
  release/schema files from main.
- **Why expectation failed**: The scary-looking `HEAD..origin/main` name-status
  diff included branch-local additions as deletes from main's perspective; it
  overstated actual merge conflict risk after the local bundle was durable.
- **Behaviour change**: When a merge overlap includes peer-completed local
  work, first make the local bundle durable under the collaboration-state
  commit exception, then let the merge algorithm prove the real conflict set
  instead of predicting from raw name-status alone.
- **Source plane**: `operational`

## Session: 2026-05-27 — consolidate-docs skill contract plan

### What Was Done

- Reviewed the `oak-consolidate-docs` failure mode where buffer fitness was
  treated as the objective instead of knowledge curation.
- Added the queued consolidate-docs mode-contract plan and indexed it in the
  current plan README.
- Wrote the next-session opener for implementing the skill update.
- During handoff, a separate active slice implemented the skill contract in the
  working tree; leave that claim and its comms residue intact for closeout.

### Surprise

- **Expected**: Improving the skill would mostly mean adding more explicit
  consolidation steps.
- **Actual**: The missing structure is a mode contract: session-completion
  consolidation and dedicated knowledge curation need different success
  criteria.
- **Why expectation failed**: "Empty buffer" is only a valid success state for
  drainable buffers after item-level disposition evidence. Without that ledger,
  a numerical target can accidentally reward hiding unresolved knowledge.
- **Behaviour change**: Future `oak-consolidate-docs` work should make the
  agent declare the mode, treat fitness as a routing signal, and require
  ledger-backed buffer dispositions before archive.
- **Source plane**: `operational`

## Session: 2026-05-27 — consolidate-docs contract implementation handoff

### What Was Done

- Implemented the queued `oak-consolidate-docs` two-mode contract in the
  canonical skill and thin adapter.
- Marked the mode-contract plan implemented and kept the current-plan index in
  sync.
- Verified the contract against the owner objective: mode defaults,
  dedicated-curation defaults, ledger-backed buffer empty semantics,
  archive-before-processing failure, and closeout proof.
- Ran session handoff and prepared the full current bundle for commit.

### Patterns to Remember

- When a handoff explicitly asks for commit after a docs/continuity slice, the
  handoff itself may need to replace stale "commit pending" continuity text
  rather than add more prose, especially when `repo-continuity.md` is near its
  hard line limit.
- Shell search patterns that include literal backticks need single quotes or
  escaping. I accidentally let zsh treat a backticked `pnpm check` phrase as
  command substitution while trying to search for proof text; the command was
  needed anyway, but the invocation was sloppy.
- The commit-queue CLI currently has required `--id` fields that are not fully
  reflected in the short help text. When using it cold, expect to supply an
  explicit v5-shaped id for enqueue/guard instead of trusting the usage line.

## Session: 2026-05-27 — dedicated knowledge curation proof pass

### What Was Done

- Ran a dedicated `oak-consolidate-docs` curation pass after the mode-contract
  update and treated fitness as routing evidence rather than the objective.
- Graduated the due "ship independent before coordination-dependent bundle"
  candidate into `.agent/rules/ship-independent-coordinate-dependent.md`, the
  platform adapters, `RULES_INDEX.md`, and `start-right-team`.
- Left the n=2 coordination-efficiency candidate owner-gated because PDR-082 is
  still `Status: Proposed`; the recovery file now records that blocker
  explicitly.

### Patterns to Remember

- A ready-empty top-level register can still have drainable work in legacy
  pending-graduation recovery files; check that directory before declaring the
  curation lane empty.
- A fresh comms-seen file can replay a lot of legacy routing-fallback noise.
  For bounded curation, prefer a targeted inbox/tail read or seed the seen
  surface intentionally before treating old broadcast volume as new work.

## Session: 2026-05-27 — external skills plan audit

### What Was Done

- Audited the external-skills substrate and skill-ingestion plan lineage while
  evaluating a new candidate source, `scientific-agent-skills`.
- Found a concrete reachability defect: the current successor plan
  `agent-artefact-lifecycle-cli.plan.md` was not listed in the agent-tooling
  current index, while the superseded `canonical-first-skill-pack-ingestion`
  plan still appeared as an ordinary future plan.
- Fixed the index-only mismatch by adding the successor to
  `agent-tooling/current/README.md` and marking the predecessor as
  superseded-pending-archive in `agent-tooling/future/README.md`.
- Updated the agentic-engineering roadmap adjacent-plan pointer so it now
  names the lifecycle CLI successor rather than the superseded CSPI lane.

### Patterns to Remember

- When a plan says "supersedes X but archive happens later", discoverability
  needs two live facts at once: the successor must be indexed as current, and
  the predecessor must remain reachable but visibly non-promotable until its
  archive phase executes.

## Session: 2026-05-27 — EEF PR-open reviewer + graph-foundations divergence diagnosis

### Practice/tooling feedback

- **Surface**: `Monitor` (host harness; persistent
  `tail -n 0 -F <file> | grep --line-buffered` over the ARC channel)
- **Signal**: friction
- **Observation**: The watcher re-delivered the ENTIRE matched history
  (turns 23–43, ~11 headers) as one batch on repeated events, not just
  newly-appended lines, despite `-n 0`. Several replays landed across the
  session — a real context-budget tax. Restarting the monitor and stopping the
  pre-resume monitor did not stop it; the live monitor itself re-emits the
  backlog.
- **Behaviour change / candidate follow-up**: A raw grep over `tail -F` of an
  append-only coordination file is noisy under repeated triggers. Prefer a
  since-cursor read keyed to "turn number > last-seen" (or a single-shot Bash
  `run_in_background` poll on that predicate) over a persistent grep-tail, so
  each new turn notifies exactly once. If this recurs, treat it as a strong
  signal not an annoyance.
- **Source plane**: `operational`

- **Surface**: `agent-tools:comms` (ARC-channel reads generally)
- **Signal**: friction (second occurrence of a known gap)
- **Observation**: Locating/reading a specific ARC turn still needs raw
  `awk`/`tail`/`gh` fallbacks — no `comms list --tail N` summary projection or
  `show <turn>` body fetch. Recurred throughout this reviewer session.
- **Behaviour change / candidate follow-up**: Reinforces the already-logged
  comms-CLI grounding gap; substance now confirmed by a second session of
  friction — the `--tail`/`show` projection is worth graduating from wishlist
  to a tooling work-item.

### Patterns to Remember

- Rebase-without-force-push divergence reads as "ahead N / behind M+1" where the
  +1 is a dropped merge commit; confirm it is benign with `git diff HEAD
  origin/<branch>` (empty tree = identical content, divergence is purely
  structural SHA-rewrite) before recommending `--force-with-lease`.

## Session: 2026-05-27 — collaboration temp-file curation

### What Was Done

- Scanned the tracked accidental `.agent/state/collaboration/_tmp-*` files
  before removal and wrote an item-level disposition ledger at
  `.agent/memory/operational/curator-passes/2026-05-27-solar-illuminating-dawn.md`.
- Found useful substance was already durable in commits, comms events, handoff
  records, archived napkin material, or plan/thread history; the remaining
  one-line heartbeat files were stale liveness ticks.

### Patterns to Remember

- Repo-local compose buffers are safer than `/tmp` for shell/body-file hazards,
  but they still must be consumed and deleted immediately. If they survive into
  git, treat them as a drainable buffer: read every file, prove each useful
  item has a durable home, write the disposition ledger, then remove them.
- Collaboration/state files are not long-term storage. If they are preserved
  for a bounded comms/coordination research plan, treat that as an explicit
  temporary exception; the general lifecycle is still: process as potential
  knowledge source, route useful substance to memory/docs/plans, then delete
  the state files.

## Session: 2026-05-27 — skill-adapter generation correction

### What Was Done

- While adding `consolidate-until-done`, I initially hand-wrote platform
  adapter stubs after the generator hit a sandbox permission error.
- Owner corrected the move: platform-specific skill adapters are not written
  manually, and manual stubs mask the toolchain issue.
- Re-ran the official `skills-adapter-generate` tool with the permissions it
  needed; `pnpm skills:check` then passed.

### Patterns to Remember

- For repo skills, canonical content lives in `.agent/skills/`; `.agents/` and
  `.claude/` skill files are generated adapters. If generation fails, fix the
  generator invocation or permissions, then rerun it. Do not hand-create stubs.

## Session: 2026-05-27 — napkin-tail owner-gate drain

### What Was Done

- Drained the May 24 napkin-tail recovery file item by item into an explicit
  owner-gated state, with a disposition ledger for the four remaining
  one-instance watches.

### Patterns to Remember

- A second-instance watch is not complete just because its trigger has not
  fired. Under a buffer-drain goal, either graduate it, withdraw it with
  evidence, or name the concrete owner decision that keeps it live.
