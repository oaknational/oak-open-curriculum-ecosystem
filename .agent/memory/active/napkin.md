---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
fitness_content_role: drainable-buffer
---

# Napkin

## 2026-05-26 — Starless Dimming Owl n=2-program execution / claude / claude-opus-4-7 / `781369`

### Surprises (session-scoped)

- **Acceptance bar was the wrong proxy**. The plan body §WS0
  required combined `wc -l` (SKILL + all rules) to DECREASE.
  Post-WS0 combined went UP by ~280 lines because the extracted
  content moved into rule files with added Trigger / Action /
  Worked Instance / Why a Rule / Enforcement framing. The
  combined-wc-l proxy treats every rule line as always-loaded,
  but the WS0 classification table itself shows 14 rules are
  trigger-loaded. Assumptions-expert ruled the proxy wrong and
  named the correct measure (classification-weighted per-mode
  load: sole-contributor -157 lines net; team-member ~+30-50
  framing overhead on previously-loading content). Behaviour
  change: when authoring acceptance bars for load-cost
  reduction, name the load model first (which surfaces load
  when?), then choose a proxy that respects it. Routed to
  pending-graduations 2026-05-26 shard.

- **Skill-extraction left thin-pointer sub-sections AND First
  Moves pointers in parallel**. After thinning §0 and §0.5
  paragraphs from the SKILL to one-paragraph stubs, two
  reviewers (Fred + docs-adr-expert) independently flagged the
  duplication: First Moves moves 1 and 2 already pointed at the
  rule files via parenthetical references; the surviving §0 /
  §0.5 thin-pointer headed sub-sections duplicated the routing.
  The cure was to delete the sub-sections entirely. Behaviour
  change: when extracting a SKILL section into a dedicated
  rule, the SKILL sub-section heading should be DELETED, not
  preserved as a thin-pointer. The numbered First Moves
  pointers carry the routing. Routed to pending-graduations
  2026-05-26 shard.

- **Hook policy blocked specific commit-ID references in
  permanent rule docs**. I included a `150b5a55` event ID in the
  `liveness-heartbeat-cron` rule's Worked Instance section. The
  Write tool blocked it citing the `no-moving-targets-in-
  permanent-docs` rule. Behaviour change: rule files (permanent
  doctrine) name dates only, not specific commit/event IDs;
  the rule's commit-time history is the durable evidence.

### Coordination notes

- Thermal Swooping Wing was active in parallel during the early
  part of this session. Sent 4+ directed comms with bundle
  updates as their curator-pass continued. Coordination was
  clean: Thermal's no-overlap verdict and bundle-update
  messages kept commit ownership with Starless without lane
  conflict. Routed to pending-graduations as a "owner-directed
  commit responsibility with parallel coordination" pattern
  candidate.

### Substantive work landed

- 6 commits shipped on `docs/agent-collaboration-enhancements`:
  curator-handoff (`d3b1f75d`), WS0 (`3c3e01d3`), WS1
  (`3360dfb0`), WS4 (`4f1e6faf`), closeout (`2d79e3ab`),
  substrate cleanup (`308cdafe`). Plan archived to
  `.agent/plans/agent-tooling/archive/completed/`.
- 8 reviewers dispatched in parallel across the three
  workstreams; all MUST-FIXes applied; SHOULD-FIXes documented
  in commit bodies with deferred-rationale or fix-in-commit.

## 2026-05-26 - Thermal Swooping Wing critical curation pass / codex / GPT-5 / `019e63`

### What Was Done

- Archived the processed active napkin source window intact at
  `archive/napkin-2026-05-26-thermal-critical-curation.md`.
- Replaced the active napkin with this fresh session surface after routing the
  dense n=2 closeout substance through the active pending-graduations shard.
- Preserved the standing comms-retention direction: no comms files were moved
  or deleted during this curation pass.

### Processing Disposition

- Feathered's unauthorised Cycle 1 / Cycle 2 framing mistake is already homed in
  the plan revision, repo-continuity, the archived source window, and per-user
  memory `feedback_no_unauthorised_scope_invention_in_plans`.
- Torrid and Feathered n=2 bundle learnings are routed through
  `pending-graduations/2026-05-26-feathered-torrid-n2-cycle-1-candidates.md`.
- Open decision residue is routed through `open-questions.md`; the full source
  window is archived at
  `../operational/archive/open-questions-archive-2026-05-26-thermal-critical-curation.md`.
- Owner approved both remaining due principle routes on 2026-05-26:
  `director-pure-direction-only` and `owner-action-is-not-a-cure`.
  They graduated to PDR-083 and PDR-084 respectively. PDR-084 lives
  standalone rather than as a PDR-074 amendment because the owner-action
  classification applies beyond Director work.

### Mistakes Made

- Owner corrected my resumed curation framing: we never trim or chase status
  changes; fitness status is a signal for prioritising work. Behaviour change:
  move important knowledge to the correct, discoverable, useful home; if no
  clear home exists, surface that as a discussion instead of compressing,
  trimming, or quietly changing status.
- I first looked for `distilled.md` at `.agent/memory/distilled.md`; the live
  file is `.agent/memory/active/distilled.md`. Behaviour change: trust the
  current repo index and frontmatter paths, not memory of older locations.
- My first heartbeat attempt used `--body` with `--tag heartbeat`; A1 now
  correctly rejects that shape. Behaviour change: heartbeat-tagged comms events
  must pass typed state args: `--claim-id`, `--intent-id`, `--branch`, and
  `--current-cycle-label`.
- On continuation I tried stale CLI shapes: `comms tail` and
  `commit-queue list --json`. Behaviour change: refresh `--help` for
  collaboration-state and commit-queue subcommands before relying on remembered
  flags.
- I repeated the zsh backtick trap while scanning pending-graduations due
  items: a double-quoted search pattern containing `` `due` `` attempted
  command substitution. Behaviour change: single-quote `rg` patterns that
  contain markdown code ticks.
- I tried to tag a normal comms narrative event with `--tag progress`; the CLI
  correctly rejected the non-canonical ADR-183 namespace. Behaviour change:
  narrative progress events usually need no tag; reserve `--tag` for canonical
  namespaces such as `failure-mode`, `behaviour-note`, and `heartbeat`.
- On the resumed curation turn I guessed a standalone commit-queue registry
  path at `.agent/state/collaboration/commit-queue.json`; the live queue is
  embedded in `active-claims.json` unless a registry is explicitly configured.
  Behaviour change: run `pnpm agent-tools:commit-queue -- list --help` before
  naming a registry path from memory.
- I also guessed a `comms inbox --since` flag during closeout; the live inbox
  shape takes `--comms-dir`, `--seen-file`, `--platform`, `--model`, and
  optional `--session-prefix`. Behaviour change: use the command's emitted
  usage line after any argv rejection instead of layering remembered filters.

### Practice/tooling feedback

- **Surface**: `agent-tools:collaboration-state comms append`
- **Signal**: friction
- **Observation**: `comms append --help` still advertises `--body` for all
  append events; the heartbeat typed-args exception appears only after a
  rejection.
- **Behaviour change / candidate follow-up**: update help text to name the
  heartbeat typed-args special case, or provide a heartbeat-specific help line.
