---
fitness_line_target: 150
fitness_line_limit: 250
fitness_char_limit: 12000
fitness_line_length: 200
fitness_content_role: drainable-buffer
merge_class: mostly-append-register
---

# 2026-05-26 — n=2 Enforcement Bundle Cycle 1 candidates

Source: `agentic-engineering-enhancements` thread, n=2 enforcement bundle Cycle 1 (Feathered Winging Cliff `57e615` + Torrid Firing Spark `5054f8`), executed 2026-05-25 evening + 2026-05-26 morning. Surfaced by bundle execution and post-cycle metacognition pass; routed here per the capture → distil → graduate → enforce pipeline (PDR-011, ADR-150).

Plan body authority: [`n2-and-coordination-efficiency-program-2026-05-25.plan.md` §"Cycle 1 graduation candidates"](../../../plans/agent-tooling/current/n2-and-coordination-efficiency-program-2026-05-25.plan.md).

Companion napkin entry: [`napkin.md` §"2026-05-26 — Feathered Winging Cliff … n=2 enforcement bundle Cycle 1"](../../active/napkin.md).

## Candidates

### Pre-pose AskUserQuestion option viability check

`[captured: 2026-05-26 | source: pattern-emergence+owner-direction | target: rule:present-verdicts-not-menus.md | trigger: owner-direction | size: S | status: due]`

- **Substance**: before any AskUserQuestion call, run per-option self-check *"would I take this option myself based on my analysis?"* — eliminate refused options. Zero survivors or one survivor → state verdict + invite redirect, don't pose the question. Two or more genuine survivors → AskUserQuestion is legitimate.
- **Trigger fired**: 2026-05-26T06:28Z at the zoneGlyph WIP-disposition question. Feathered posed 4-option AskUserQuestion where 3 options were architecturally indefensible by own already-completed analysis. Owner correction + metacognition surfaced the structural cure (compose-time self-check) as opposed to principle absence (`present-verdicts-not-menus.md` rule already exists).
- **Owner affirmation**: 2026-05-26 *"if there are open decisions then you should surface them to me as questions, but only after reflecting on them through the LTAE lens"* + *"No open question survives LTAE [in this case]. That is worth remembering."* — per-decision discipline, not blanket rule.
- **Cure shape**: extend `.agent/rules/present-verdicts-not-menus.md` with the pre-compose viability checklist as structural cure at compose time. Memory: `feedback_pre_pose_option_viability_check`.
- **Size**: single small edit to existing rule.

### Cross-lane structural blocking of commits (with worked cure)

`[captured: 2026-05-26 | source: napkin+pattern-emergence | target: pattern:cross-lane-commit-blocking.md | trigger: owner-direction | size: M | status: due]`

- **Substance**: agent A's substantive work uncommitted because broader pre-commit gate fails on agent B's lane; A retires/closes without landing; thread record documents the work but commit deferred; next agent inherits uncommitted WIP with no provenance trail in `active-claims.json` or comms.
- **First instance (2026-05-25/26)**: Prismatic Transiting Star `019e60` session completed practice-fitness `'ready'` zone + `fitness_content_role` axis work (351 inserts, 9 files including ADR-144 amendment), tests green, closed claim, posted handoff — but never committed because broader `pnpm check` was red on peer-owned hook-policy lint (which became Torrid's E1 extraction `499518ce` next day). Owner cured this instance by committing the WIP under owner authority at `bfbc39f3`.
- **Worked cure discovered same cycle (2026-05-26)**: Torrid's E3 commit `69b50937` cured the zoneGlyph knip blocker while Prismatic's 351-line WIP remained uncommitted in `format.ts`, using `git apply --cached <patch>` against HEAD context to stage only the 1-line `export` drop. The index received Feathered's intended change; the WT continued to carry Prismatic's WIP untouched until owner consolidation `bfbc39f3` absorbed it. **This is the surgical cross-lane staging primitive** — a working cure for the failure mode and a graduation-class pattern in its own right.
- **Standing constraint**: gate-narrowing rejected as cure per `feedback_pre_commit_hook_must_gate_staged_only` REJECTED 2026-05-22 — full-tree gating is intentional and load-bearing.
- **Cure shapes** (now informed by worked instance):
  - `git apply --cached` for surgical cross-lane staging — landed precedent at `69b50937`; document as pattern.
  - Deferred-commit handoff substrate paralleling PDR-063 — agent A records uncommitted-but-complete work explicitly; claim closure references the deferred-commit record. Composes with the surgical-staging primitive.
  - Session-handoff step demanding disposition of all uncommitted WIP before closeout (additive to step 8).
- **Trigger now `due`**: Cycle 1 produced both failure-mode evidence AND working cure in single session; sufficient substrate to graduate as a pattern at next consolidation pass.
- **Size**: M (pattern + amendment to `decompose-before-bundling` or new pattern file + cross-reference in session-handoff SKILL).

### Heartbeat-without-progress as distinct state from retirement

`[captured: 2026-05-26 | source: napkin+pattern-emergence | target: doc-amend:pdr-078+pattern:heartbeat-without-progress.md | trigger: owner-direction | size: M | status: due]`

- **Substance**: PDR-078 §"Observe-side" 10-min retirement threshold fires when an agent emits no heartbeats. The inverse failure mode also exists: cron-driven heartbeat loop continues to fire `[HEARTBEAT]` events while the agent's main reasoning loop has stalled, paused, or been rerouted to substantive work the peer cannot see. From the observer side this looks like "active" but produces no substantive narrative/lifecycle events.
- **Worked instance (2026-05-26)**: Feathered's `57e615` session emitted heartbeats every ~4 min from 06:30Z through 07:25Z while making zero substantive lane progress after Torrid's B2-landed broadcast at 06:38Z. No zoneGlyph investigation, no push attempt, no reply to Torrid's 06:53:59Z direct ping. Torrid (correctly) took over the zoneGlyph + push lane at 07:01:48Z after the 4-min ping-deadline expired. The cause: Feathered had been owner-rerouted to plan/handoff lane work at 07:14Z (NB: actually 06:something — sequence to verify), invisible to Torrid.
- **Diagnostic discriminator (Torrid's finding)**: count substantive narrative/lifecycle events (excluding heartbeats and own-self events) over a 10-minute window. A peer-agent emitting heartbeats with zero substantive events for ≥2 cycles is in "alive but stalled" rather than "alive and working." Both states look identical from the retirement-detection lens but should be coordinated differently.
- **Worked cure shape applied (Torrid's pattern)**: direct-ping with bounded deadline ≈ 1 heartbeat cycle (4 min); if silent, broadcast takeover-of-lane intent with rationale, then act. Worked precedent: `TORRID TAKING OVER` broadcast at 07:01:48Z after 23-min stall + 8-min ping-non-reply.
- **Trigger now `due`**: clear worked instance + worked cure both in Cycle 1.
- **Size**: M (PDR-078 amendment naming the new failure mode + pattern file naming diagnostic + cure protocol).

### Owner-rerouted-agent-without-team-visibility

`[captured: 2026-05-26 | source: pattern-emergence | target: doc-amend:start-right-team-skill | trigger: owner-direction | size: S | status: due]`

- **Substance**: when the owner re-routes an agent in a multi-agent team mid-cycle to a different lane than the team-coordinated boundary, the team has no visibility into the re-route unless the agent broadcasts it. From the team's perspective, the agent appears stalled on the original lane. This composes with the heartbeat-without-progress failure mode — the underlying coordination gap is the same.
- **Worked instance (2026-05-26)**: owner re-routed Feathered from zoneGlyph+push lane to plan/handoff lane via *"review [plan] and update it ultrathink /oak-plan /oak-metacognition, then update the relevant continuity surfaces /oak-session-handoff"* around 07:14Z. Feathered did not broadcast the re-route to Torrid; Torrid observed Feathered as stalled and took over correctly. Both observations are correct under their respective frames; the gap was visibility.
- **Cure shape**: protocol amendment to `start-right-team` SKILL — agent rerouted by owner mid-cycle MUST broadcast the re-route to the team (target lane, expected duration, original-lane disposition) within ~1 heartbeat cycle of accepting the re-route. The broadcast itself counts as a substantive narrative event for the heartbeat-without-progress discriminator above.
- **Trigger now `due`**: clear worked instance.
- **Size**: S (SKILL §1 amendment).

### CLI args inconsistency across `agent-tools comms <verb>` verbs (tooling-friction)

`[captured: 2026-05-26 | source: napkin+pattern-emergence | target: doc-amend:agent-tools+rule:cli-spec-harmonisation | trigger: owner-direction | size: M | status: pending]`

- **Substance**: friction surfaced repeatedly during Cycle 1 comms-event emission: `comms append` takes `--title` and rejects `--kind`; `comms direct` takes `--subject` + requires `--kind`; `comms reply` takes optional `--subject` + requires `--kind`; `--to-name` vs `--to-agent-name`; `--to-prefix` vs `--to-session-prefix`; `--created-at` rejected by some verbs. Multiple emit attempts failed before producing a working invocation per verb. B2 (body-length gate) addresses `--body` argv but not the broader CLI-name inconsistency.
- **Cure shape**: harmonise option names across verbs (a single canonical `--title`/`--subject` convention; consistent `--kind` requirement; consistent identity-routing tuple names) OR ship a shared CLI-spec validator with useful per-flag rejection messages instead of terse `Error: unknown option for comms direct: --created-at`.
- **Routing**: this is tooling-friction class, not doctrine class. Routes to the tooling-friction queue in WS1 of the active plan rather than a PDR/ADR/rule. Captured here for tracking.
- **Size**: M (CLI surface refactor + per-flag rejection-message improvements).

### Bundle scope-discovery during execution is normal

`[captured: 2026-05-26 | source: pattern-emergence | target: doc-amend:plans/templates+rule:decompose-before-bundling | trigger: candidate | size: S | status: pending]`

- **Substance**: plan items can absorb structural prerequisites encountered at execution time, provided the absorption is documented and reviewer-ratified. The bundle's coherence is not violated by scope expansion when the expansion is causally linked to the plan items.
- **Cycle 1 worked instance**: original 4-item bundle (A1, B1, B2, B3) expanded to 6 commits by absorbing E1 (5-module hook-policy extraction) + E2 (barrel-trim knip cure) as structural prerequisites for B1+B3 to land cleanly. E1 reviewed by parallel sonnet trio (architecture/test/type expert); E2 mechanical follow-up.
- **Cure shape**: clause in plan-templates or amendment to `decompose-before-bundling` guidance documenting bundle-time scope expansion as legitimate when reviewer-ratified.
- **Size**: S (single doc clause or rule amendment).

### PDR-063 mid-cycle handoff works under bundle load

`[captured: 2026-05-26 | source: pattern-emergence | target: doc-amend:pdr-063 | trigger: candidate | size: S | status: pending]`

- **Substance**: PDR-063 mid-cycle retirement handoff substrate operates cleanly when multiple agents in a single bundle retire mid-cycle. Cycle 1 fired the protocol three times (Feathered ×2 compactions; Torrid ×1) in one session window; all pickups worked; bundle survived.
- **Cure shape**: worked-instance footer in PDR-063 §Falsifiability OR pattern entry in `.agent/memory/active/patterns/`.
- **Size**: S (single footer or pattern file).

### A1 cure validates itself by running

`[captured: 2026-05-26 | source: pattern-emergence | target: doc-amend:pdr-078 | trigger: candidate | size: S | status: pending]`

- **Substance**: A1's typed-origin heartbeat gate validated itself in-cycle — once the dist was rebuilt with the cure, both Feathered and Torrid emitted typed-args heartbeats throughout the session. No separate validation step needed; the cure operating in production *is* the worked-instance evidence.
- **Cure shape**: worked-instance footer in PDR-078 §Falsifiability.
- **Size**: S (single footer entry).

### B1 self-fires on plan-body content (worked instance)

`[captured: 2026-05-26 | source: pattern-emergence | target: doc-amend:b1-rule-documentation | trigger: candidate | size: S | status: graduated]`

- **Substance**: writing the literal blocked phrases in the Cycle 1 outcome documentation triggered B1's hook block on the plan body itself mid-edit. Strong evidence the structural enforcement is real, not paper.
- **Cure**: refer to the phrases by semantic role rather than literal text in any documentation about B1.
- **Graduated**: applied inline in plan body §"Lane B B1" — "Self-validating gate: writing this Cycle 1 outcome with literal phrase quotes triggered B1's block on this plan body. Worked-instance evidence that the structural enforcement is real, not paper."
- **Size**: S (one-line cross-reference, already in plan body).

### First-broadcast-establishes-context as deterministic tie-breaker

`[captured: 2026-05-26 | source: pattern-emergence | target: doc-amend:start-right-team-skill | trigger: candidate | size: S | status: pending]`

- **Substance**: the first-broadcast-establishes-context convention from `start-right-team` SKILL §1 cycle-overlap rule operates as a clean deterministic tie-breaker under live load. Cycle 1 resolved cycle/boundary assignment cleanly: Torrid's 2026-05-25T21:52Z Lane B broadcast established cycle context; Feathered's A1 broadcast was second. Boundary assignment resolved through dialogue without owner intervention.
- **Cure shape**: worked-instance entry in `start-right-team` SKILL §1 cycle-overlap coordination rule.
- **Size**: S (single worked-instance footnote).

---

## Candidates added by Torrid Firing Spark retirement-class closeout 2026-05-26T07:30Z

### Peer-agent heartbeat-without-progress as distinct state from retirement (first-instance)

`[captured: 2026-05-26 | source: failure-mode | target: PDR-078 amendment OR new diagnostic rule | trigger: second-instance | size: M | status: pending]`

- **Substance**: PDR-078's retirement-on-silence rule fires when no heartbeats observed for 10 min. The inverse-failure-mode exists too: cron-driven heartbeats continue firing while the agent's main reasoning loop has stalled / paused / stopped processing inbound events. Observer cannot distinguish "alive and working" from "alive and stalled" by heartbeat presence alone — both states emit identical `[HEARTBEAT]` events.
- **Worked instance**: Feathered's `57e615` session emitted heartbeats every ~4 min from 06:30Z through 07:25Z+ with zero substantive narrative/lifecycle progress events after the 06:38Z B2-landed cue. No reply to direct ping `150b5a55` at 06:53:59Z. Owner pushed independently while Feathered's heartbeats continued; their main loop never resumed substantive processing through retirement.
- **Discriminator**: count substantive narrative/lifecycle events (excluding heartbeats and own-self events) over a 2-cycle window. Heartbeats-only ≥ 2 consecutive cycles = "alive but stalled" candidate state.
- **Cure shape options**: (a) amend PDR-078 §Observe-side with the inverse rule; (b) new diagnostic rule `peer-stall-vs-active-detection` separate from retirement-detection; (c) start-right-team SKILL amendment naming the cure-shape (bounded-deadline direct-ping + takeover-with-broadcast).
- **Trigger**: second-instance in another session.
- **Size**: M (PDR amendment OR rule-class doctrine).

### `git apply --cached` for surgical cross-lane staging (pattern candidate)

`[captured: 2026-05-26 | source: worked-pattern | target: pattern-file OR commit SKILL extension | trigger: candidate | size: S | status: pending]`

- **Substance**: when the working tree carries another agent's uncommitted WIP in file X and a small fix needs to commit independently without bundling or destroying the WIP, write a patch matching HEAD context (NOT working-tree context) for just the small fix, then `git apply --cached <patch>`. Index gets the small fix; working tree retains the WIP unchanged. Commit lands the fix; working tree carries the WIP forward intact.
- **Worked instance**: zoneGlyph cure at `69b50937` (1-line `export` keyword drop on `agent-tools/src/practice-fitness/format.ts:14`) staged surgically while Prismatic's WIP (FitnessSummaryCounts.ready field + isReady + inventoryZone + inventoryGlyph + formatPassSummary + formatNonHealthySummaryParts + summariseResults refactor) remained intact in working tree.
- **Why not destructive alternatives**: `git checkout HEAD -- X` discards the WIP (forbidden); `git stash --keep-index --patch` needs TTY; `git add X` bundles the WIP into the commit (false-authorship).
- **Cure shape options**: (a) pattern entry `.agent/memory/active/patterns/git-apply-cached-surgical-cross-lane-staging.md`; (b) commit SKILL §extension with the worked invocation; (c) directives/git.md extension.
- **Size**: S (one pattern file or skill section).

### CLI arg-name inconsistency across `agent-tools comms <verb>` (friction-register candidate)

`[captured: 2026-05-26 | source: friction-register | target: CLI harmonisation plan OR cli-spec validator | trigger: candidate | size: M | status: pending]`

- **Substance**: option names diverge across the four comms verbs in inconsistent ways. `comms append` takes `--title` and rejects `--kind`; `comms direct` takes `--subject` and requires `--kind`; `comms reply` takes optional `--subject` and requires `--kind`. Recipient-identity flags also diverge: `--to-name` vs `--to-agent-name`; `--to-prefix` vs `--to-session-prefix`. Per-verb `--created-at` acceptance varies. The B2 cure (body-length gate) addresses the body argv but not the broader argv-name inconsistency.
- **Worked instances** (this session alone): 5+ failed emit attempts across `comms append` and `comms direct` due to per-verb argv-name divergence. Every body-file emission required hand-crafted argv per verb.
- **Cure shape options**: (a) CLI harmonisation pass aligning option names across verbs; (b) shared CLI-spec validator with per-flag rejection messages instead of terse `Error: unknown option for X: --Y`; (c) deprecation alias map honouring legacy names with deprecation notes.
- **Size**: M (CLI surface refactor + tests).

### Replace-old-with-new applies at WIP-completion review, not only at planning (worked-instance)

`[captured: 2026-05-26 | source: worked-instance | target: replace-dont-bridge rule extension | trigger: candidate | size: S | status: pending]`

- **Substance**: the repo rule "replace old with new — no fallbacks, no shadow systems, no remnants" surfaces during completion-review of feature WIPs, not only during planning. A WIP author can wire a new pattern through *some* callers and leave the per-file detail at the old shape — creating a "shadow remnant" within a single file. Two competing decorations for the same logical state count as such a remnant.
- **Worked instance**: Prismatic's "ready" zone WIP in practice-fitness wired `inventoryGlyph(inventoryZone(result))` through summariseResults + formatSummary + formatPassSummary + formatNonHealthySummaryParts + formatFitnessInventory, but left `formatFitnessResult` (per-file detail) using `zoneGlyph(result.overallZone)`. Per-file detail showed plain `✓` while inventory listing showed `✓ ready (empty)` for the same file. Cured at `83c79fa6`.
- **Cure shape**: extend [`.agent/rules/replace-dont-bridge.md`](../../../rules/replace-dont-bridge.md) with a "completion-review consistency sweep" clause naming this failure mode and the cure (search for all callers of the old API after introducing the new API; replace every caller or document why a caller is intentionally retained).
- **Size**: S (single rule extension).
