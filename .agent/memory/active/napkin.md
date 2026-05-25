---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
---

# Napkin

## 2026-05-25 — Mistbound Passing Candle / claude / claude-opus-4-7 / `e77243`

### What Worked

- **Reviewer dispatch surfaced a doctrine-by-analogy error mid-process**.
  I treated plan-shape work like code-shape work (write → review). For code,
  axes are stable (does it work / is it tested / is it idiomatic). For
  plan-shape, the axes ARE the design choice; reviewers should challenge axes
  *at the inventory step*, not after the ranking is committed. The
  user-specified 4 axes (E/I/S/Philosophy) constrained the ranking framework
  but not the inventory expansion — Betty surfaced obligation-tier taxonomy,
  Fred surfaced P9-first, Wilma surfaced silent-API-failure cure, all of which
  should have entered the inventory before scoring. Cure: future plan-shape
  work dispatches reviewers at the inventory step too.
- **Verifying before applying reviewer findings paid off twice this session**:
  rejected Wilma's "decomposition default bypasses commit-queue" (verified P3
  serialises regardless); rejected Wilma's strict-sequencing claim (verified
  P9 triggers are mostly context-load shape, not coordination-state reads).
  The reviewer's authority does not substitute for verification at the moment
  of applying.

### Mistakes Made (retrospective metacognition surfaced these in real time)

- **Metacognition over-engineering at ~20%**. I ran four /oak-metacognition
  passes (#1, LTAE-as-metacognition, #2, #2.5) before plan authoring, plus a
  final pass. Pass #2 ("why does this matter") was the most compressible; the
  substance was useful but the framing produced one error (the
  "agents-hurt-above-threshold" model) that assumptions-expert later refuted.
  Cure: pre-commit explicit acceptance criteria for each metacognition pass;
  reject the pass if it only restates earlier insight.
- **Missed docs-adr-expert at the initial reviewer dispatch**. Only caught it
  via the final metacognition pass. The reviewer found 4 cross-reference
  defects (PDR-074 mislinked to graduation shard; n-agent-experiments path;
  hypothesis.md path; ADR-186 unlinked). All small, but the under-engineering
  pattern is: when a plan has many cross-references, docs-adr-expert is
  mandatory at first dispatch, not as a follow-up.
- **Linear-ranking-as-deliverable framing risk**. The user asked for "an
  ordered list of improvements." I initially started writing the plan
  structured around the ranked list as spine. Metacognition pass #2.5 caught
  this. The deliverable is the plan; the ranking is an input. Cure: at
  plan-authoring start, distinguish the user's request shape from the user's
  actual impact target; if they diverge, surface the choice rather than
  auto-resolve.

### Pattern Crystallising

- **The single biggest substantive insight of the session is structural, not
  n=2-specific**: the ~6× friction multiplier observed in the Fiery/Stormy
  PR-115 cycle is the most legible instance of a general scale-sensitivity gap
  in the coordination substrate. PDR-082's discrete-mode shape is the right
  first-step cure (Betty verified); the long-term shape is the obligation-tier
  taxonomy where each obligation carries scale-sensitivity as metadata. The
  plan's WS3γ seeds this; WS8 captures the verdict for non-re-derivation.
- **"Doctrine additions ARE coordination cost"** is a non-obvious framing that
  re-shapes the rest of the inventory. Every rule, SKILL amendment, PDR loads
  at session-open; the skill-load budget (~80 active-skill ceiling) and
  directive-file-context-budget (30%) are pressured budgets that compound
  across every future session. P9 (rule/skill topology refinement) is the only
  inventory item with **negative** cost-direction; it lowers load
  per-session-forever. Linear ranking by E+I+S buries this because the
  convolution is structurally blind to cost-direction sign.

## 2026-05-25 — Breezy Flowing Dock / codex / GPT-5 / `019e5f`

### Processing Disposition

- Rotated the outgoing active napkin to
  `archive/napkin-2026-05-25-breezy-critical-hard-curation.md`
  only after routing live queue substance. This is a napkin rotation, not a
  comms retention action; the owner direction preserving all comms files for
  research remains binding.
- Fresh Briny/Hushed planning, role-emission, template, and multi-agent
  auto-fix candidates now live in
  `pending-graduations/2026-05-25-planning-and-autofix-candidates.md`.
  The main pending-graduations register now carries a pointer to that active
  shard rather than duplicating the full bodies.
- Misty Director-session candidates were already routed to
  `pending-graduations/2026-05-25-misty-director-session-candidates.md`.
  The outgoing napkin archive remains the source-window evidence.
- The hardening-arc standing direction on comms-file retention is preserved in
  `repo-continuity.md`, the thread record, and the outgoing napkin archive:
  do not move or delete `.agent/state/collaboration/comms/` files while the
  comms research plan remains active.

### Mistakes Made

- I repeated the known zsh quoting hazard by putting backticks inside a
  double-quoted `rg` pattern; zsh attempted command substitution on
  `` `comms watch` `` before `rg` ran. Behaviour change: use single-quoted
  literal patterns whenever searching for text containing backticks.
- During handoff I attempted to append a comms event with a `lifecycle` tag.
  The live tool only accepts the ADR-183 tag namespace (`failure-mode`,
  `behaviour-note`, `heartbeat`). Behaviour change: omit tags for generic
  closeout broadcasts unless using one of those canonical values.

### What Worked

- The useful response to the current critical/hard fitness map was structural:
  preserve the source window in an archive, route live candidates into active
  shards, and leave comms retention untouched. No substance was trimmed to make
  the fitness output greener.

## 2026-05-25 — Fiery Kindling Brazier / claude / claude-opus-4-7 / `9f4026`

### Mistakes Made (retrospective metacognition on owner correction)

- Three PR-115 review comments (2 trivial Copilot fixes + 1 substantive
  Bugbot/ADR-184) sat unaddressed on origin for ~30 min. Owner asked why.
  Root cause: I bundled the trivial fixes with substantive coordinated work
  (Stormy ADR-184 amendment + Breezy curator-pass + Hearthlit retirement
  substrate) and held the trivial fixes hostage to the bundle timeline.
  Net: ~4 min of actual fix work + ~25 min of coordination ceremony +
  ~4 min compaction tax.
- Doctrine-by-analogy misfire: 4 prior marshal cycles in the session were
  bundle-shaped (Breezy + Thermal + Hushed + sweep substrate), so I applied
  the same shape without ratifying it from first principles against the
  action-to-impact bridge.
- Optimisation-axis mismatch: I chose "1 CI run" over "2 CI runs" without
  ratifying whether the owner cared. Owner had asked for SPEED (address +
  report ready); CI economy was the wrong axis to optimise unilaterally.
- Action-visibility test absent: commit-not-yet-pushed means the
  action-to-impact bridge is incomplete from GitHub's view. The owner saw
  zero progress on the comments for 30 min because the fixes had landed
  locally but not on origin.

### Behaviour Changes

- **Decomposition default**: verified + trivial + within standing
  authorization → ship immediately as its own commit + push. Coordinated /
  substantive work bundles in parallel. Bundling is NOT the default.
- **Action-visibility test before bundling**: before bundling, ask "is the
  bundle deferring an action's IMPACT artefact (commit visible on origin,
  comment marked addressed, CI-trigger)?". If yes, unbundle.
- **CI-economy is not my unilateral lever**: default to push-each-fix for
  speed; only optimise CI-run-count when the owner asks.
- **"Wait for peer's commit so we push together"** is a question-shaped
  trap; default answer is no. Push when I have something to push.

### What Worked

- The push itself landed both commits in one operation (Stormy's commit
  landed at the exact moment my push reached origin — accidental, not
  designed). All 3 comments addressed on origin HEAD `46d96c88`. Lucky
  timing does not redeem the slow path; the structural lesson stands.

## 2026-05-25 — Stormy Surfing Dock / claude / claude-opus-4-7 / `2a7b65`

### What Worked (verified-then-absorbed reviewer findings)

- Bugbot finding on PR 115 ("Owner sync conflicts ADR-184") looked
  potentially trivial. Owner reminder *"as ALWAYS with incoming opinions,
  assess them critically first"* landed at exact moment I was about to
  draft a fix. Re-read both ADR-184 (Decision §Axis 1) + plan-WS0-Path-A
  (line 229) + plan-WS3 (line 28) + plan-HC-A5 (line 586) directly.
  Bugbot was correct: a real composition contradiction
  (`author_kind: "owner"` + `participants: agent_id[]` +
  author-in-participants invariant). Cure shape α (amend ADR-184)
  preserves Path A integrity; alternatives (β drop HC-A5, γ ratify
  Path C) would have been workarounds. Owner ratified α, commit
  `46d96c88` landed clean across all 6 PR 115 gates.
- Worked instance for `peer-review + critical-analysis loop catches
  trust-without-reverification` candidate (pending-graduations entry
  2026-05-24, source: Lanternlit). This is a single-author + reviewer
  case rather than the dual-reviewer case Lanternlit captured, but the
  trust-without-reverification failure mode is identical and the cure
  shape (read source materials directly + verify reviewer claims before
  drafting fix) is the same.

### Mistakes Avoided (real-time owner intervention on protocol overhead)

- After verdict-standby for ~20 min, ran multiple `verdict-standby` /
  `amendment-review-standby` heartbeats consuming owner-visible task
  slots. Crossed 5-idle-loops threshold + surfaced standdown question;
  owner then directly asked *"is that overhead massive?"* — confirmed
  yes. Cure path: not "argue protocol necessity" but "name
  overhead honestly + propose structural variant." Result: heartbeat
  cron cancelled mid-session + PDR-082 n=2 collaboration mode authored
  as first-instance preservation surface. The owner's *one direct
  question* was the high-leverage intervention; the moment of
  metacognitive ratification fired exactly once and produced both the
  immediate behaviour change (cron off) and the durable substrate (PDR
  draft).

### Pattern Crystallising

- Two owner-intervention moments this session ("verify incoming
  opinions" + "comms overhead massive?"). Both fit the pattern Fiery
  captured in pending-graduations (`Owner action is not a cure`
  substance: owner intervention is evidence of a missing autonomy
  primitive). For (1), the autonomy primitive is the verify-before-
  absorb discipline I should apply by default. For (2), PDR-082 IS
  the autonomy primitive — once ratified, n=2 mode triggers
  automatically without owner intervention.

## 2026-05-25 — Riverine Navigating Rudder / cursor / Composer / `27d9af`

### What Worked

- Manual UAT against `oak-preview-1` (education-evidence preview): checklist
  sections A–H all pass; 29 MCP tool calls; thread `oakUrl: null` confirmed
  by-design; suggest empty `url` scoped to suggest leg only and routed to
  snagging plan WS5 after owner Q&A clarified bug vs quirk vs design.
