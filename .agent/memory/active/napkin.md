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

## 2026-05-26 — Torrid Firing Spark retirement-class closeout / claude / claude-opus-4-7 / `5054f8`

### Surprise: peer-agent heartbeat-without-progress as distinct state from retirement

The PDR-078 §"Observe-side" 10-minute retirement threshold fires when an agent emits no heartbeats. But the inverse-failure-mode also exists: an agent's cron-driven heartbeat loop continues to fire `[HEARTBEAT]` events on the comms stream while their main reasoning loop has stalled, paused, or otherwise stopped processing incoming events. From the observer's side this looks like "active" but produces no substantive narrative/lifecycle events. Worked instance: Feathered's `57e615` session emitted heartbeats every ~4 min from 06:30Z through 07:25Z+ while making zero substantive lane progress after my B2-landed broadcast at 06:38Z — no zoneGlyph investigation, no push attempt, no reply to my 06:53:59Z direct ping `150b5a55`.

**Diagnostic discriminator**: count substantive narrative/lifecycle events (excluding heartbeats and own-self events) over a 10-minute window. A peer-agent emitting heartbeats with zero substantive events for ≥2 cycles is in "alive but stalled" rather than "alive and working." Both states look identical from a retirement-detection lens but should be coordinated differently.

**Cure shape applied**: direct-ping with bounded deadline ≈ 1 heartbeat cycle (4 min); if silent, broadcast takeover-of-lane intent with rationale, then act. Worked instance: `TORRID TAKING OVER` broadcast at 07:01:48Z after 23 min stall + 8 min ping-non-reply.

### Surprise: `git apply --cached` for surgical cross-lane staging

Standard problem: working tree has another agent's uncommitted WIP in file X; my fix in the same file X needs to commit independently without bundling their WIP into my commit. `git add X` would stage their WIP too; `git checkout HEAD -- X` would destroy their work (forbidden); interactive `git add -p` needs a TTY.

**Cure**: write a patch matching HEAD context (not working-tree context) with just my change; `git apply --cached <patch>` to stage that one hunk into the index. Index gets my change; working tree retains the WIP. Commit lands my change; working tree continues to carry the WIP untouched. Worked instance: zoneGlyph cure at `69b50937` — Prismatic's WIP across `format.ts` (FitnessSummaryCounts + isReady + inventoryZone + inventoryGlyph + formatPassSummary + formatNonHealthySummaryParts) stayed intact in working tree while my 1-line `export` drop landed in commit. Pattern-graduation candidate.

### Surprise: CLI args inconsistency across `agent-tools comms <verb>` verbs

Friction surfaced repeatedly during comms-event emission: `comms append` takes `--title` and rejects `--kind`; `comms direct` takes `--subject` + requires `--kind`; `comms reply` takes optional `--subject` + requires `--kind`; `--to-name` vs `--to-agent-name`; `--to-prefix` vs `--to-session-prefix`; `--created-at` rejected by some verbs. Multiple emit attempts failed before producing a working invocation per verb. The B2 cure (body-length gate) addresses the body argv but not the broader CLI-name inconsistency.

Candidate: harmonise option names across verbs, OR ship a shared CLI-spec validator with useful per-flag rejection messages instead of terse `Error: unknown option for comms direct: --created-at`.

### Surprise: replace-old-with-new surfaces during WIP-completion review, not only at planning time

Owner caught that `formatFitnessResult` (per-file detail printer in practice-fitness) still used the pre-WIP `zoneGlyph(result.overallZone)` after the rest of the file's surfaces (summary, inventory, pass-line) had moved to `inventoryGlyph(inventoryZone(result))` for the new "ready" zone classification. Per repo rule *"replace old with new — no fallbacks, no shadow systems, no remnants"*, the per-file path was cured at `83c79fa6`.

The WIP author wired the new pattern through some-but-not-all callers within a single file, leaving the per-file detail as an inadvertent shadow of the old shape. Two competing decorations for the same logical state (✓ vs ✓ ready) is a "shadow remnant" pattern. Candidate: capture as a worked-instance of the existing `replace-dont-bridge` rule.

## 2026-05-26 — Feathered Winging Cliff / claude / claude-opus-4-7 / `57e615`, n=2 enforcement bundle Cycle 1

### AskUserQuestion menu-of-anti-shapes anti-pattern (Behaviour Change)

- Caught at the zoneGlyph WIP-disposition question 2026-05-26T06:28Z.
- Posed a 4-option question where 3 options were architecturally indefensible
  by my own already-completed analysis (`git restore` destructive on coherent
  351-line WIP; stash-pop conflicts on unchanged-context line; `--no-verify`
  weakens gate per standing rule). Only "owner commits the WIP" survived
  LTAE.
- Faux-respect underneath: dressing "I haven't taken a verdict" as "owner-decision
  territory." Offering anti-shapes alongside the clean answer wastes owner
  attention, not honours it.
- Trigger condition: coordination rush-impulse under ADR-172 amplifying the
  decision-resolver compose-time.
- Cure shape (captured to `feedback_pre_pose_option_viability_check`):
  pre-pose viability check — enumerate each option, ask *"would I take this
  myself?"*, eliminate refused options, count survivors. Zero or one survivor
  → state verdict + invite redirect. Two+ → AskUserQuestion is legitimate.
- Owner-affirmed 2026-05-26: *"if there are open decisions then you should
  surface them to me as questions, but only after reflecting on them through
  the LTAE lens"* + *"No open question survives LTAE [in this case]. That is
  worth remembering."* Per-decision discipline; not blanket.
- **Graduation target**: extend `.agent/rules/present-verdicts-not-menus.md`
  with the pre-compose checklist as structural cure.

### Cross-lane structural blocking of commits (New Failure Mode)

- Prismatic Transiting Star session 2026-05-25 (`019e60`) completed
  substantive practice-fitness work (`'ready'` zone + `fitness_content_role`
  axis + ADR-144 amendment, 351 inserts / 9 files), tests green, closed claim,
  posted handoff — but the work was **never committed** because the broader
  `pnpm check` was red on peer-owned hook-policy lint (which became Torrid's
  E1 extraction the next day).
- The thread record documents the work as substantive; the WT carries the
  uncommitted changes; no handoff substrate names the deferred-commit state.
- Genuinely new failure mode: agent A's substantive work uncommitted because
  the broader pre-commit gate fails on agent B's lane; A retires; next agent
  inherits uncommitted WIP with no provenance trail in `active-claims.json`
  or comms.
- Owner standing direction rules out gate-narrowing (`feedback_pre_commit_hook_must_gate_staged_only`
  REJECTED 2026-05-22; full-tree gating is intentional).
- **Per PDR-026 falsifiability**: 1st instance is evidence, not doctrine.
  Capture for second-instance trigger. Owner cured this instance by
  authoring the commit themselves.
- **Candidate cure shapes** (not chosen on one instance):
  - Deferred-commit handoff substrate paralleling PDR-063 — agent A
    explicitly records uncommitted-but-complete work in a handoff alongside
    thread record, claim closure references it.
  - Claim-the-blocker protocol — agent A picks up agent B's small blocker
    when it stands between A's work and a commit (only viable if scope is
    small + within A's domain).
  - Session-handoff step demanding disposition of all uncommitted WIP before
    closeout — additive to existing step 8.
- **Graduation target**: pending-graduations.md; route on second-instance per
  PDR-026.

### Plan-body self-fires on B1 hook (Worked Instance)

- Writing the Cycle 1 outcome description with literal blocked phrases
  (the verdict / d-word / ratification semantic family) triggered B1's
  hook block on this very plan body.
- Strong evidence the structural enforcement is real, not paper. Cure: refer
  to the phrases by semantic role rather than literal text in any documentation
  about B1.
- **Graduation target**: cross-reference in B1 rule documentation or
  hook-policy README.

### Bundle scope-discovery during execution is normal (Worked Instance)

- Cycle 1 bundle expanded from 4 items (A1, B1, B2, B3) to 6 commits
  (added E1 extraction + E2 barrel-trim) as structural prerequisites surfaced
  during Lane B execution.
- The bundle's coherence held; reviewers ratified the expansion shape
  (parallel sonnet trio on E1; assumptions-expert on B1 phrase set).
- Lane discipline absorbed the expansion without owner intervention.
- **Graduation target**: clause in plan-templates or decompose-before-bundling
  guidance documenting that *plan items can absorb structural prerequisites
  encountered at execution time provided the absorption is documented and
  reviewer-ratified*.

## 2026-05-25 — Prismatic Transiting Star distilled processing / codex / GPT-5 / `019e60`

### Behaviour Change

- When processing `distilled.md`, stable learning with no real home is not a
  trim candidate and not a quiet deferral. It is a documentation-architecture
  gap: name the gap, classify the shape, surface it to the owner, and keep the
  source preserved until the home exists or the owner rejects that route.
- Fitness inventory should show the conservation map, not only the danger map.
  Listing healthy and ready-empty files beside soft/hard/critical files makes
  it possible to set agent goals toward "healthy" and to identify files whose
  entire content has already been curated.
- Owner correction refined the axis: empty is only success for drainable
  knowledge buffers. Directives and other reference surfaces can be healthy or
  soft, but empty reference content is a configuration defect, not readiness.

## 2026-05-25 — Mistbound post-compaction execution

### Processing Disposition

- Full inherited-frame, LTAE option-set, hook-signal, and fractal
  stopping-criterion substance moved intact to
  `pending-graduations/2026-05-25-mistbound-inherited-frame-and-hook-signal-candidates.md`.
  This is a live processing shard, not an archive. The entry was
  already above ordinary napkin-capture density and pushed the active
  napkin into HARD; the structural response is homing the full
  understanding for consolidation, not trimming it.

## 2026-05-25 — Quiet Whispering Veil / codex / GPT-5 / `019e60`

### Mistakes Made

- While homing the Mistbound entry, I fixed the napkin line-count
  HARD but created a new CRITICAL prose-width signal with an overly
  long inline markdown link. Behaviour change: use readable path
  pointers or reference-style links on fitness-governed memory files,
  and rerun fitness immediately after structural curation edits.

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

## 2026-05-25 — Prismatic Transiting Star / codex / GPT-5 / `019e60`

### Mistakes Made

- While tightening `distilled.md` fitness coverage, I first reached for a
  regression test that would only prove configuration/discovery shape. Owner
  corrected with `no, test prove behaviour, not configuration` and pointed to
  `.agent/directives/testing-strategy.md`. Behaviour change: for fitness-file
  inclusion, prefer proving with the real `practice:fitness` command output
  unless there is product behaviour to specify; do not add tests whose main
  assertion is that a particular repository filename appears in a discovered
  list.
