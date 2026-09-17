# Estate sources attention map (2026-08-06)

Owner-commissioned survey ("please look at all relevant sources, historic and
otherwise, that you feel deserve further attention"), run by the Director seat
(Petrel holds Turbulence, a0892f) with seven parallel read-only survey agents
plus direct reads. Instruments named per finding. This is the survey's
consolidation record; the disposition acts it drove are listed at the end.
Every status below is a dated observation (2026-08-06), not a moving target.

## Instruments

Seven read-only subagent sweeps (branch archaeology; frictions-register full
read; plans-backlog survey; three rescue-PR deep-reads; unlanded-docs
deep-reads; operational-memory census; research-corpus survey), a three-page
Linear census (~286 open tickets: 253 Backlog + 33 In Progress/In Review),
and Director direct reads (deferred-work-map branch, shaping-record
addendum lineage, effective main-branch rules API).

## Verdicts by source

### Live structural debt (highest attention)

- **F-98 — the agent-work-state binding — confirmed root-class by three
  independent instruments in one day**: the June deferred-work-map branch
  named it keystone; the frictions census ranks it #1 open with nine sibling
  entries as symptoms (F-10, F-44, F-69, F-95, F-99, F-105, F-118, F-140,
  F-142); this week's live frictions (handoff worktree-isolation workaround,
  dark-seat mtime misdiagnosis, closure invisible to the closed seat) are the
  same generator. A derived read-view landed; the unified-registry decision
  is still open and decision-gated.
- **Frictions register**: 152 entries, ~27 closed, ~125 open. Census top-5:
  F-98, F-44 (freshness≠liveness, SAFETY-tagged, gated on OQ5), F-133
  (commit-queue verifies against primary from worktree seats, 2-seat
  recurrence), F-125 (cwd drift breaks root gates, highest recurrence
  count), F-92 (claim-heartbeat refresh missing from canonical loop,
  ~15h stale Director read while heartbeating). Register self-defects: F-150
  ID used twice; F-81/F-108 cited but never given headers; the
  addressed-index lists 2 of 25+ inline-closed entries; the last six entries
  drop the status-field convention.
- **`director-handoff.md` is ~4.5× its own hard fitness limit** (1454 lines
  vs 320) — the estate's most load-bearing continuity file, top
  consolidation target (memory census).
- **`cross-worktree-work-state.md` abandoned** — last touched 2026-06-27,
  describes a dead world; needs archive-or-rewrite disposition.
- **`handoffs/` retention question** — 151 untracked machine-local files,
  by-design gitignored, no visible retention policy; growing unbounded.
- **Live dangling pointer (defect)**: `ticket-management` skill references
  rule `linear-mcp-team-and-project-hygiene`, which exists nowhere in the
  estate (PR #781 audit finding, re-verified first-hand by the sweep).

### Waiting by design (do not disturb; pull selectively)

- **`.agent/plans-backlog-2026-07/`** (650 files) is the lossless
  release-pivot conservation of the pre-pivot plan estate (2026-07-21, owner
  word "we lose nothing"), with a designed resumption trigger: after the
  first major release ships. Not neglect. Named early-pull candidates found
  by the survey: `collaboration-substrate-coordination-rightsizing` (M4 cull
  list never ran — highest-value single item), `cost-of-collaboration`
  (active/SSOT, largely unexecuted), `agent-artefact-lifecycle-cli`
  (decision-complete, unstarted — CONVERGES with the 2026-08-06 handoff-CLI
  commission; consume as prior art at build time), the watcher
  canonicalisation/storage pair, and the agentic-engineering `current/`
  strategic sources. `pr-merge-readiness-discipline` is superseded-in-flight
  by MCP-508's merge-bot. `.agent/plans-old-archive/` is a deliberate
  pre-pivot graveyard; no concern.
- **Research corpus (authority/forgetting/identity/boundaries)**: four core
  documents + one adjacent note, ~525KB, all 2026-08-01/02, two already on
  main via PR #717 as explicitly non-doctrine proposals. No index in
  `.agent/reports/cognitive-structure/`; no plan owns the application work.
  Proportionate shape: ONE seat reads the two practice-facing docs (~230KB)
  and produces a per-principle accept/revise/reject disposition record; the
  foundational doc is background; no fleet justified. The resonance guide
  (`.agent/reference/resonance-research-programme-design-guide.md`) is the
  proven METHOD for the owner's plan-corpus mining item (its Part VII is a
  worked translation for exactly that job).

### Superseded (dispositioned this hour or delete-safe)

- **PRs #776/#777/#778** — all author-labelled superseded, verified absorbed
  by later landed work; CLOSED with evidence comments (2026-08-06). Branch
  deletion is follow-on hygiene.
- **`chore/aip-131-primary-estate-snapshot`** — sole unique content (a Codex
  hook-experiment continuity note) already on main under `threads/paused/`;
  the AIP-131 snapshot itself landed via a different commit. Delete-safe.
- **`pr576`** — not a remote branch; a stray local remote-tracking ref to
  closed-unmerged PR #576's head (earlier PostHog-adapter attempt; MCP-63
  landed via a documented successor). Local ref cleanup only.
- **Branch "origin"** — does not exist anywhere; artifact of an earlier
  survey's parsing. Record corrected.
- **`docs/agent-operability-deferred-work-map`** — dead links, one spine
  superseded; conserve-then-delete verdict stands (separate record).

### Unlanded knowledge (routed)

- **PR #781 (vendor-memory graduation audit)**: 27 high-value unlanded
  learnings; spot-check of 10 found none landed as rules; merge armed this
  hour (Copilot leg requested). Follow-on: curator pass top-down, dangling
  pointer first; note the audit flags
  `comms-events-are-ephemeral-not-storage` as CONTRADICTING PDR-066 —
  reconcile, don't just land.
- **PR #767 (operational-system syntheses)**: four novel non-doctrine
  concept reports, zero term collisions with the decision-record corpus;
  merge armed this hour. The real follow-on is the doctrine-window review
  pass its PR body proposes.
- **PR #765 (jim-next return map)**: harvested below; closed against this
  record.
- **`pending-graduations.md`**: two fast-lane items blocked on
  directive-file context headroom (<30%); the older hits its dwell-soft
  threshold 2026-08-06. A fresh low-context session lands both in one
  sitting.
- **threads/ root**: eight files share one bulk-touch mtime (2026-07-26);
  liveness needs a cross-check against `repo-continuity.md` §Active Threads
  before any retirement.

## The jim-next harvest (from PR #765, frozen 2026-08-04)

Still-open items carried into current tracking (verified 2026-08-06):

- **Resume queue, open**: #755 gate-ledger lane (claim dd3f640f retained);
  #746 findings 3+4 (bootstrap-reporter proof; uptime build-vs-buy); #745
  perishable-claim freshness (MCP-476); #731 Parallax (three recorded
  blockers red-first); #737 Oak Components research re-review; #734 green-up
  (now bound by the zero-new-Sonar-issues bar); #764 land at convenience;
  Vanilla's ws-a-cycle-2 (usage gauges, MODEL row); housekeeping — archive
  the completed `upstream-update-lane-completion` node.
- **Owner-held, still open**: ADR-204 vs live ruleset (strict policy false
  vs ADR text; four required contexts, fourth undocumented) — deliberate or
  drift, owner call; pnpm distribution choice (corepack vs `~/Library/pnpm`
  cohabitation; 1.2G store deletable at owner word); MCP-495 sequencing
  (preview/dev Sentry values unverified); sketch ratifications (13 delivery
  sketches + design-system strategic — matches the current plan census).
- **Discharged since the freeze**: #729 merged; #758 closed; Director seat
  refilled; the two foreign dirty files resolved; reopening declaration
  overtaken by events.
- **Dates**: 2026-08-10 08:00 London — Linear embargo lifts; 2026-08-16 —
  codex-dialogues window closes; 2026-08-20 — MCP-508 slice-2 owner gate
  expires; 2026-08-23 — skills gate expiry.

## Cross-cutting findings

1. **Supersession discipline works; disposition execution lags.** Everything
   verified superseded said so itself, in its own frontmatter or commit
   message. What accumulates is not mislabelled content but unexecuted
   disposition acts (open PRs, open frictions, stale registers) — closing
   acts need a routed seat, and none owns them.
2. **F-98 is the deepest open debt** (triple-confirmed above); the
   handoff-CLI commission and the artefact-lifecycle-cli backlog plan are
   converging cures and should be built as one lineage.
3. **The graph programme keeps re-deriving itself**: the June deferred-work
   map, the pivot's intent-graph resumption clause, the backlog's
   practice-graph pilot plan, MCP-46, and this survey itself all reach for
   the same structure — queryable work-state. The strongest prioritisation
   argument on record is that this inventory took a seven-agent fleet to
   answer.

## Dispositions executed this hour (2026-08-06, owner-approved card)

- Closed #776, #777, #778 with evidence comments (bot identity).
- Undrafted #781 and #767; Copilot legs requested (owner-keyring standing
  grant); merge at settled with suppressed-body read, REST merge-commit,
  sha-pinned.
- #765 harvested into this record and closed against it.
