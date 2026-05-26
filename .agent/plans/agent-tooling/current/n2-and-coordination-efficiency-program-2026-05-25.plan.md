---
name: "n=2 and Coordination Efficiency Program"
overview: >
  Sibling plan to cost-of-collaboration.plan.md. Lands the n=2 mode, the
  decomposition discipline, the heartbeat/owner-attention cures, the Director-
  class autonomy bundle, and the doctrine-topology refinement (P9) that gates
  most of the rest. Subordinates to the cost-of-collaboration arc; amends its
  P-sequence by making P9 the first move. Carries the design-evaluation track
  (obligation-tier taxonomy, comms-substrate shape, continuous-scale-sensitive
  coordination) as parallel research lanes rather than candidate actions.
todos:
  - id: ws0-p9-rule-skill-topology-refinement
    content: "WS0 (Tier 0 meta-constraint) — Land cost-of-collaboration P9: rule/skill topology refinement. Two-tier classification of the rule corpus (always-on invariants vs trigger-loaded skills) with falsifiable firing triggers; decomposition shape for SKILL `start-right-team` (which is at 973 lines / 26 sections); rule-vs-clause-in-existing-PDR decision rule. Gates WS3, WS5, WS6, WS7 directly."
    status: pending
  - id: ws1-tooling-shipping-friction
    content: "WS1 (Tier 1 parallel-able) — Tooling friction at the moment of shipping. comms direct flag-discoverability (#14); --body-file / --subject-file for long content (#15); husky pre-commit hook sweep-into-staged cure (#31, separate friction lane); identity routing-tuple disambiguation (#18, two-step: decide cure shape, then implement). Cycle 1 progress: B2 (CLI body-length gate, extending #15 enforcement) in flight via Torrid Firing Spark; A1 typed-origin gate (companion enforcement) landed at 97f06e16."
    status: in_progress
  - id: ws2-decomposition-discipline
    content: "WS2 (Tier 1 parallel-able) — Decomposition discipline. Author guidance (judgment-shaped, not mechanical-rule-shaped) for `decompose-before-bundling` (#2 reframed); embed action-visibility test in commit + marshal SKILLs (#4); document trivial-heuristic discipline (verified locally + clean CI prediction) per Wilma. SKILL hook lands; rule pointer is small."
    status: pending
  - id: ws3-pdr-082-amendments-and-evolution
    content: "WS3 (Tier 2; partially blocked by WS0 for SKILL shape) — PDR-082 amendments. (α) All-channels watcher in Forbidden drop-set, not only retained (Betty). (β) Silent-API-failure cure: heartbeat retention at n=2 unless explicitly owner-opted-out, OR all-channels watcher emits silent-detection event after N min of zero peer activity (Wilma). (γ) Retain/drop table restructured as typed tiers seeding obligation-tier taxonomy (Betty's third shape). Composes with #3 SKILL amendment which is blocked by WS0 for inline-vs-sibling decision."
    status: pending
  - id: ws4-heartbeat-and-owner-attention-cures
    content: "WS4 (Tier 2 amendments to landed doctrine) — Owner-attention-budget cures. Heartbeats-are-infrastructure as PDR-078 amendment, not new rule (#8 reframed per Fred; landed 3ca71a40 prior cycle). Heartbeat-content mechanical state-binding (#9; substrate change in agent-tools heartbeat emitter wrapper) — landed 97f06e16 Cycle 1 (A1). Ping-before-escalate (#11) as agent-general rule, not Director-only — landed 29ebda41 Cycle 1 (B3). Remaining: SKILL-level cross-references for B3 rule + worked-instance ratification of A1+B3 in next n=2 session."
    status: in_progress
  - id: ws5-director-class-doctrine-bundle
    content: "WS5 (Tier 5 bundled; blocked-by WS0) — Director-class autonomy doctrine landed as ONE coherent pass, not five separate items. Substrate-resolution-first ratification (#6 as agent-general rule per Fred + assumptions); pre-positioned routing primitive (#7); standing-direction graduation (#26 agent-general); slice-routing self-selection (#27 agent-general); Director-seat-on threshold (#10). Bundling controls doctrine-load cost. Names PDR-074 as substrate authority; some items may be PDR-074 clauses rather than new rules per WS0's classification."
    status: pending
  - id: ws6-cost-of-collaboration-p6-p7
    content: "WS6 (parallel with WS0) — cost-of-collaboration P6 (coordination-artefact isolation) and P7 (async/sync mode awareness). Owner-direction-gated; sequenced after WS0 in cost-of-collaboration's original ordering but parallel-able since P9 and P6/P7 are coupled at the trigger-design interface, not strictly sequenced (per Wilma rebuttal verified)."
    status: pending
  - id: ws7-cost-of-collaboration-p8-descope-or-close
    content: "WS7 (decision-needed) — cost-of-collaboration P8 (collaboration TUI). Decide: descope (P8 is less load-bearing at n=2 where owner-chat is the substrate; reviewer-flagged gaps may be solved by descoping rather than acceptance-close) or close acceptance (live TUI + inactive visibility + strict validation per reviewer findings). Owner direction required."
    status: pending
  - id: ws8-research-design-evaluation-track
    content: "WS8 (parallel research lane, not blocking) — Three design-evaluation surfaces that may reshape the architecture: (a) obligation-tier taxonomy as long-term evolution target for PDR-082's retain/drop table (#32); (b) continuous-scale-sensitive coordination evaluated and verdict recorded (Shape A wins per Betty; capture the analysis as substrate so future sessions don't re-derive) (#28); (c) comms-as-event-stream substrate-shape evaluation — deeper question whether file-backed event stream is the right substrate or a different shape would dissolve some failure-mode classes (#29). Outputs are evaluation notes, not implementations."
    status: pending
  - id: ws9-overhead-to-delivery-instrumentation
    content: "WS9 (conditional; landed only if action-changing) — Coordination overhead-to-delivery ratio as observable metric (#17). Counts inter-agent comms events per work-cycle; surfaces budget excess. ONLY if tied to an action threshold (n=2 session emits warning when comms-event-count >3 per fix cycle); refuse landing as dashboard-only. n=2 comms budget instrumentation (#5) is the n=2-specific form."
    status: pending
  - id: ws10-pdr-082-second-instance-trigger
    content: "WS10 (wait-state; opportunistic) — PDR-082 second-instance validation (#1). Triggers when a second n=2 session happens naturally. Unblocks WS3 SKILL amendment, WS9 budget instrumentation refinements, and PDR-082 Proposed → Accepted progression. Not actionable in this planning lane; included for honest sequencing."
    status: pending
  - id: ws11-clarifications-and-cross-references
    content: "WS11 (one-time doc moves) — Shared-checkout empirical-class clarification (#20): amend `feedback_worktree_isolation_unreliable` to scope it to sub-agent worktree dispatch; capture distinct shared-checkout empirical class as separate one-line note. Cross-reference n-agent-experiments hypothesis layer for graduating substrate. Update `multi-agent-collaboration-protocol.plan.md` WS5 with cross-reference to this plan."
    status: pending
isProject: false
---

# n=2 and Coordination Efficiency Program

**Last updated**: 2026-05-26 (Cycle 1 of the n=2 enforcement bundle COMPLETE)
**Status**: DECISION-COMPLETE first draft. **Cycle 1 of the enforcement bundle COMPLETE — 8 commits pushed to origin** (A1 + E1 + B1 + B3 + E2 + B2 + E3 + owner consolidation; plus Torrid's late consistency-fix `83c79fa6` local-only at retirement, awaiting push). See [§Cycle 1 outcome](#cycle-1-outcome-and-learnings-2026-05-2526). WS0/2/3/5/6/7/8/9/11 still pending owner-ratified execution.
**Collection**: `agent-tooling/current/`
**Thread**: `agentic-engineering-enhancements`
**Parent plan**: [`cost-of-collaboration.plan.md`](cost-of-collaboration.plan.md) — this plan amends the parent's P-sequence by making P9 (rule/skill topology refinement) the first move, ahead of P6/P7/P8.
**Authoring session**: Mistbound Passing Candle (claude / claude-opus-4-7 / `e77243`)
**Substrate inputs**:

- [Survey](../../../research/agentic-engineering/agent-coordination-efficiency-survey-2026-05-25.md)
- [PDR-082](../../../practice-core/decision-records/PDR-082-n2-collaboration-mode.md)
- [pending-graduations/2026-05-25-fiery-collaboration-decomposition-and-n2-efficiency.md](../../../memory/operational/pending-graduations/2026-05-25-fiery-collaboration-decomposition-and-n2-efficiency.md)
- [pending-graduations/2026-05-23-team-session-autonomy.md](../../../memory/operational/pending-graduations/2026-05-23-team-session-autonomy.md)
- [pending-graduations/2026-05-25-misty-director-session-candidates.md](../../../memory/operational/pending-graduations/2026-05-25-misty-director-session-candidates.md)
- [PDR-074](../../../practice-core/decision-records/PDR-074-director-value-is-mind-coherence-per-owner-attention.md) (Candidate; Director ratification checklist + three-mode standby + autonomy primitives P1–P6); session-context shard at [pending-graduations/2026-05-23-team-session-autonomy.md](../../../memory/operational/pending-graduations/2026-05-23-team-session-autonomy.md)
- [PDR-078](../../../practice-core/decision-records/PDR-078-liveness-heartbeat-contract.md) + [ADR-186](../../../../docs/architecture/architectural-decisions/186-comms-event-heartbeat-lifecycle-substrate.md) (heartbeat contract; graduated 2026-05-25)

## Owner direction in scope

1. **Standing direction** (2026-05-11): *"lowering the cost of collaboration will increase the rate of innovation and advancement."* Metric: cost-per-coordination-event in agent-count-aware terms.
2. **Session direction** (2026-05-25 ~15:03Z): *"massively tighten coordination efficiency for teams of two agents, n=2."*
3. **Owner-as-measuring-instrument intervention** (2026-05-25 ~15:06Z): *"the comms appear to be causing a MASSIVE overhead, is that true?"* — confirmed in real time; the cure trajectory this plan operationalises.

Cross-cutting standing memory: *"Owner action is not a valid cure for anything."* Every owner-intervention cure indicates a missing autonomy primitive. PDR-082 and this plan's workstreams are the autonomy primitives for the directions above.

## Why P9 is Tier 0 (the meta-constraint)

The rule corpus is at ~78 entries against a ~80 active-skill discovery ceiling (`feedback_skill_load_budget`). SKILL `start-right-team` is at 973 lines across 26 sections. The directive-load budget is capped at 30% per `directive-file-context-budget.md`.

This plan's candidate actions, taken individually, would add **6+ new rules + 3 SKILL amendments to `start-right-team` + 1 new comms-event-type + 1 new PDR amendment**. Without P9 first, these additions would:

- Push the rule corpus past its skill-discovery ceiling.
- Push `start-right-team` past its operational coherence threshold (an agent cannot bootstrap from a SKILL it cannot hold).
- Force a second refactor pass to clean up the corpus afterward — paying the topology-refinement cost twice.

P9 is the negative-cost lever. Landing it first lowers the load-cost of every subsequent addition. It is the only move in the inventory that **shrinks the doctrine surface while increasing its load-bearing capacity**. Every other move adds to the surface.

Architectural-expert-fred verdict during the planning pass: *"Block all rule/SKILL authoring until P9 lands."* This plan accepts that verdict.

## Why the linear ranking under-serves the strategic question

The user-specified scoring axes (Ease, Impact, Simplicity, Philosophy) — convolution by E+I+S, philosophy as interest — produces a defensible first-pass ordering. Linear convolution is **structurally blind** to eight kinds of value that decisively reshape the right sequence:

| Hidden axis | What it measures | Items the linear ranking buries |
|---|---|---|
| **Leverage** | How many other items does this enable, unblock, or dissolve? | P9 (constrains 6+ rule additions); items 28/32 (could dissolve 3/25/30 entirely) |
| **Amortisation horizon** | One-time / per-instance / per-session-forever? | P9 (every session forever, negative cost); doctrine load (every session forever, positive cost) |
| **Cost-direction (sign)** | Adds substrate or removes/refactors substrate? | P9 (negative); P6 isolation (negative for gate-visible churn); rule additions (positive load) |
| **Information value** | Does landing this *teach* something only doing it can teach? | PDR-082 second-instance evidence (5); items 28/29/32 (5) |
| **Reframing potential** | Could this item *replace* multiple other items if ratified? | Items 28, 32 (5 — could dissolve mode-shape items) |
| **Variance across agent-count** | Stable across N or wildly variable? | Director-class items (variance 5); tooling fixes (variance 1) |
| **Failure-mode coverage** | Closes an evidenced failure mode or prophylactic? | Items 2/4/8 (evidenced); items 26/27 (prophylactic — Director sessions rare) |
| **Dependency depth** | How many gates between this and landing? | Items 3/25 blocked-by 1, blocked-by 24 |

These eight axes are structurally invisible to E+I+S. The plan's sequencing reflects them; the linear ranking is preserved as Appendix A for reference, **but the plan's spine is the dependency graph, not the score**.

## Workstreams

## Cycle 1 — n=2 ENFORCEMENT BUNDLE (executed 2026-05-25/26)

**Context**: the prior session (2026-05-25 Mistbound + Quiet) landed doctrine without enough structural enforcement. Owner direction at session-close: *"Doctrine without enforcement is debt."* Cycle 1 ran **n=2 (Feathered Winging Cliff + Torrid Firing Spark)**, executing the bundle below. It ships four landed structural enforcements, each closing a named failure mode at the structural layer.

**Acceptance for the bundle**: all four items land as commits pushed green. The cycle is not complete until each enforcement is tested in code or hook, not just authored as prose.

**Acceptance status (2026-05-26T07:30Z)**: **COMPLETE.** 8 commits pushed to origin: A1 `97f06e16` + E1 `499518ce` + B1 `ecc1e834` + B3 `29ebda41` + E2 `4984d771` + B2 `66e77d73` + E3 `69b50937` + owner consolidation `bfbc39f3`. One Torrid late consistency-fix `83c79fa6` (per-file detail uses `inventoryGlyph` for ready-zone consistency; replace-don't-bridge cure) local-only at retirement, awaiting push by Feathered. All `pnpm check` rounds green throughout (90/90 turbo, 652/652 tests, knip clean).

**Lane split (n=2)**:

### Lane A — substantive code enforcement (Feathered Winging Cliff / claude / claude-opus-4-7 / `57e615`)

**A1. Heartbeat emitter mechanical state-binding** — enforces PDR-078 §5 (landed at `3ca71a40` 2026-05-25). Sources [WS4 §item 2 below](#ws4--heartbeat-and-owner-attention-cures-tier-2). **LANDED `97f06e16`.**

- File: `agent-tools/src/collaboration-state/comms-heartbeat-body.ts` (new), `comms-heartbeat-cli.ts` (new), `cli-spec-options.ts` (modified), `cli-comms-commands.ts` (modified), `cli-options.ts` (modified) — emitter wrapper plus CLI gate.
- Cure landed: heartbeat body MUST be constructed from typed state fields (`--claim-id`, `--intent-id`, `--branch`, `--current-cycle-label`) via `composeHeartbeatBody` (Zod `.strict()` schema with `.min(1)` per field); free-form `--body` / `--body-file` argv is rejected at CLI validation for `--tag heartbeat` events with a cure-naming error.
- Acceptance met: 5 unit tests on `composeHeartbeatBody` + 5 integration tests on the CLI gate (rejection on free-form, acceptance on typed args, schema-driven shape verification).
- Effort actual: ~3 hours including mid-cycle compaction handoff (PDR-063).
- Worked-instance ratification: A1 cure validated itself by running. Both Feathered and Torrid emitted typed-args heartbeats throughout Cycle 1; the cure was operational from the moment the dist was rebuilt.

### Lane B — hook + rule + CLI gate enforcements (Torrid Firing Spark / claude / claude-opus-4-7 / `5054f8`)

**B1. Hook policy block on menu framing for architectural decisions** — enforces [`re-apply-first-question-at-elaboration-boundaries`](../../../rules/re-apply-first-question-at-elaboration-boundaries.md) at the linguistic layer. **LANDED `ecc1e834`.**

- File: `.agent/hooks/policy.json` (3 new `scoped_blocks` entries; literal blocked phrases live in `policy.json`, not reproduced here so the plan body does not self-fire the gate); `agent-tools/tests/hook-policy/scoped-blocks-menu-framing.unit.test.ts` (new parametrised regression test, 15 cases).
- Cure landed: blocks three menu-framing phrases that signal an architectural-decision being offered to the owner as a multiple-choice form rather than as a directed verdict with analysis. Reviewer-flagged false-positive risk on a fourth phrase (legitimate governance prose) led to dropping it per assumptions-expert.
- Acceptance met: 15 regression tests (5 per phrase covering legitimate-context exemptions + write-blocked positive cases). Test infra cured stale assertions for hedging-vocabulary filter, SHA `include_paths`, and JSON.parse safe-narrowing via Zod schema parse.
- **Self-validating gate**: writing this Cycle 1 outcome with literal phrase quotes triggered B1's block on this very plan body. Worked-instance evidence that the structural enforcement is real, not paper.

**B2. CLI hard-gate: `--body` argv rejected for comms events over threshold** — enforces [WS1 §item 2 below](#ws1--tooling-friction-at-the-moment-of-shipping-tier-1) structurally. **LANDED `66e77d73`.**

- Files: `agent-tools/src/collaboration-state/cli-spec-options.ts` + `agent-tools/src/collaboration-state/cli-comms-commands.ts` + `cli-comms-messages.ts`.
- Cure landed: `comms send` / `comms append` / `comms direct` / `comms reply` reject `--body "$LONG_STRING"` when string length exceeds 1500 chars; error names `--body-file` as the cure. Same architectural pattern as A1 (typed-origin gate at trust boundary; cure-naming error).
- Acceptance met: regression tests on each verb (>1500-char `--body` argv exits non-zero with cure-naming error) + boundary cases (1500 accepted, 1501 rejected, empty accepted, `--body-file` resolves then size-checks).
- Reviewers ratified: parallel sonnet trio (type-expert + test-expert + code-expert) per Torrid's pre-B2 handoff plan.

**B3. Ping-before-escalate as agent-general rule** — enforces [WS4 §item 3 below](#ws4--heartbeat-and-owner-attention-cures-tier-2) at rule-corpus level. **LANDED `29ebda41`.**

- File: `.agent/rules/ping-before-escalate.md` + `.claude/rules/ping-before-escalate.md` + `.cursor/rules/ping-before-escalate.mdc` (portability wrappers) + `RULES_INDEX.md` entry.
- Cure landed: codifies "cross-check git work-evidence + queue + DM before retirement-detection broadcast" with three reviewer findings applied: ADR-186 markdown link (was prose); name-based git grep (agents have no canonical email); PDR-078 §4 exemption-ref clause added to §Trigger.
- Acceptance met: rule file exists in canonical + platform-wrapper homes; cites PDR-078 §4 exemption + worked-instance evidence (Lunar→Mistbound false positives 2026-05-24); enumerated in `RULES_INDEX.md`.

### Cycle 1 scope expansion — structural prerequisites absorbed

Two commits not in the original 4-item bundle were absorbed by Lane B as structural prerequisites for B1+B3 to land cleanly:

**E1. Hook-policy 5-module extraction** — **LANDED `499518ce`.** Author: Torrid. The original `agent-tools/scripts/check-blocked-content.ts` was a 559-line file with multiple complexity violations that B1's new scoped_blocks would have amplified. Cure: 5-module decomposition under `agent-tools/src/hook-policy/` (`types.ts` / `matchers.ts` / `hook-input.ts` / `policy-loader.ts` / `check-blocked-content.ts` orchestrator) with Zod schemas at trust boundaries; `ScopedContentBlockSchema` replaces 47-line hand-rolled `isValidScopedBlockEntry` (complexity 20 → 1). Tests moved to `agent-tools/tests/hook-policy/`; stale assertions repaired in same commit. 9 files changed, 740 insertions, 661 deletions.

**E2. Knip cure — drop 4 unused barrel re-exports** — **LANDED `4984d771`.** Author: Torrid. The 5-module extraction's orchestrator-file barrel re-exported `resolveContentPair`, `loadBlockedContentPatterns`, `ContentChange`, `ScopedContentBlock` — all consumed only internally post-extraction. Cure: drop the four `export` keywords. Knip blockers dropped 5→1 (only `zoneGlyph` remains, owned by Prismatic's stranded WIP).

### Cycle 1 outcome and learnings (2026-05-25/26)

**Commits pushed to origin (8 — bundle complete)**:

```text
bfbc39f3 docs: memory refinements                                            ← owner consolidation (Prismatic WIP + drift)
69b50937 chore(practice-fitness): drop unused zoneGlyph export                ← E3 (Torrid, cross-lane takeover)
66e77d73 feat(comms): reject --body argv over 1500 chars on all comms verbs   ← B2 (Torrid)
4984d771 chore(agent-tools): drop unused barrel re-exports (knip cure)        ← E2 (Torrid)
29ebda41 feat(rules): add ping-before-escalate retirement-broadcast           ← B3 (Torrid)
ecc1e834 feat(hooks): add menu-framing scoped_blocks                           ← B1 (Torrid)
499518ce refactor(agent-tools): extract hook-policy guard to workspace        ← E1 (Torrid)
97f06e16 feat(agent-tools): heartbeat emitter typed-origin gate (A1)          ← A1 (Feathered)
87232086 docs(continuity): point next n=2 session at enforcement bundle       ← baseline (already on origin)
```

**Local-only at retirement**: `83c79fa6` `fix(practice-fitness): per-file detail uses inventoryGlyph for ready-zone consistency` — Torrid's late polish discovering that `formatFitnessResult` still used the pre-WIP `zoneGlyph(result.overallZone)` while the rest of the file's surfaces had moved to `inventoryGlyph(inventoryZone(result))` for the new ready-zone classification. Cure routed under `replace-dont-bridge`: the per-file path now uses the inventory glyph too. Awaiting push by Feathered.

**Cross-lane cure discovered during Cycle 1**: the zoneGlyph cure (E3) was applied while Prismatic's WIP remained uncommitted in the working tree, using `git apply --cached` to stage just the 1-line `export` drop against HEAD context without bundling Prismatic's 351-line WIP into the commit. The patch matched HEAD context (not WT context) so the index received only Feathered's intended change; the WT continued to carry Prismatic's WIP untouched until the owner's `bfbc39f3` consolidation absorbed it. **This is the worked cure for the cross-lane structural blocking failure mode named in [§Cycle 1 graduation candidates](#cycle-1-graduation-candidates-captured-2026-05-26)** — the candidate's "candidate cure shapes" entry should be updated post-cycle to name `git apply --cached` as the surgical cross-lane staging primitive.

**Coordination shapes that worked under bundle load**:

- **PDR-063 mid-cycle retirement handoff** — fired twice in Cycle 1 (Feathered pre-A1-commit pause; Feathered post-A1-commit pre-push pause). Both handoffs produced full 4-section records (`current edit state`, `in-flight reasoning`, `decisions made`, `decisions deferred`) under `.agent/state/collaboration/handoffs/`. Torrid also produced a same-session pre-B2 handoff. All pickups worked; bundle survived two compaction windows.
- **First-broadcast-establishes-context tie-breaker** — Torrid's 21:52Z Lane B broadcast established cycle context; Feathered's A1 broadcast was second. Boundary assignment resolved through dialogue without owner intervention.
- **Gatekeeper specialisation** — Torrid ran `pnpm check` consistently; Feathered did not. Clean.
- **Lane split with structural absorption** — original 4-item plan expanded to 6 commits as Lane B absorbed E1+E2 (extraction + knip cure) as prerequisites. The bundle's coherence held; reviewers ratified E1 architectural shape (5-module split via parallel sonnet dispatch).
- **Parallel sonnet reviewers in Lane B** — type-expert + test-expert + code-expert + assumptions-expert dispatched at multiple stages (E1 extraction shape, B1 phrase set, B3 rule shape). All reviewer findings applied in same commits.

**Substance learned beyond the plan — graduation candidates**:

1. **AskUserQuestion menu-of-anti-shapes anti-pattern** — under coordination rush-impulse (ADR-172), the menu-shape feels fastest; faux-respect dresses unwillingness to take a verdict as "owner-decision territory". Caught at the zoneGlyph WIP-disposition question. Cure shape: pre-pose viability check — *"would I take each option myself based on my analysis? If only one survives, state the verdict, don't pose the question."* Captured to `feedback_pre_pose_option_viability_check` in per-user memory. **Graduation target**: extend `.agent/rules/present-verdicts-not-menus.md` with the pre-compose checklist as a structural cure.
2. **Cross-lane structural blocking of commits** (Prismatic stranded WIP) — agent A's substantive work uncommitted because broader pre-commit gate fails on agent B's lane; A retires without landing; thread record documents the work; next agent inherits the WIP. Genuinely new failure mode; not currently named in any rule or PDR. First instance only — per PDR-026 falsifiability discipline, capture as pending-graduation; route to graduation on second instance or owner direction. **Candidate cure shapes** (not chosen on one instance): (a) deferred-commit handoff substrate paralleling PDR-063; (b) claim-the-blocker protocol for small adjacent fixes; (c) explicit session-handoff step that demands disposition of all uncommitted WIP before closeout. Owner standing direction rules out gate-narrowing (per `feedback_pre_commit_hook_must_gate_staged_only` REJECTED).
3. **Bundle scope-discovery during execution is normal** — Cycle 1 expanded from 4 to 6 commits cleanly as structural prerequisites surfaced. The bundle's coherence held; lane discipline absorbed the expansion without owner intervention. **Graduation target**: clause in plan-templates or decompose-before-bundling guidance documenting that *plan items can absorb structural prerequisites encountered at execution time provided the absorption is documented and reviewer-ratified*.
4. **PDR-063 worked-instance under bundle load** — both agents retired mid-cycle for compaction with full handoff records; both pickups worked; bundle survived two compaction windows in one cycle. **Graduation target**: worked-instance entry in PDR-063 §Falsifiability or `.agent/memory/active/patterns/`.
5. **A1 cure validates itself by running** — typed-origin heartbeat gate proved its own operation: from dist-rebuild onward, both agents emitted typed-args heartbeats. No separate validation step needed. **Graduation target**: footer worked-instance in PDR-078 §Falsifiability.
6. **B1 self-fires on plan-body content** — writing the literal blocked phrases in this Cycle 1 outcome triggered B1's block. Strong evidence that the structural enforcement is real, not paper. **Graduation target**: cross-reference in B1 rule documentation.
7. **First-broadcast-establishes-context as deterministic tie-breaker** — fired cleanly in production for Cycle 1 boundary assignment. **Graduation target**: worked-instance entry in `start-right-team` SKILL §1 cycle-overlap rule.

All seven candidates routed to `.agent/memory/operational/pending-graduations.md` at session close per the `consolidate-docs` capture→distil→graduate→enforce pipeline.

**What Cycle 1 did not cover** (transparent deferral):

- Push of `83c79fa6` Torrid late polish (Feathered to push at session-close).
- Closeout broadcast for Feathered + final claim closure (Feathered to emit at session-close; Torrid retired at 07:23Z with closeout findings broadcast).
- WS0/2/3/5/6/7/8/9/11 — none touched this cycle; remain pending owner-ratified execution.

### Coordination shape for the n=2 session

- Apply the worked-instance from `agentic-engineering-enhancements.next-session.md` 2026-05-25 entry: lane separation, separate intent-scoped commits, gate-runner singleton, homing-to-shard for any curation residue.
- Both agents post team-start broadcast at session-open per `start-right-team` SKILL §1.
- Run `pnpm check` once per round (gatekeeper-specialisation per memory).
- Each enforcement lands as its own commit; commit subject names the file changed.

### Cycle 1 rationale — preserved for future audit

WS0 (extract §0/§0.5 of `start-right-team`; two-tier rule corpus classification) was deferred from Cycle 1 because it dominates one agent's whole session and blocks lane parallelism. The Cycle 1 verdict was that A1 (PDR-078 §5 enforcement) immediately changes behaviour in every multi-agent session that emits heartbeats, whereas WS0 reduces per-session load cost over time but doesn't directly close a failure mode by itself. WS0 stays directed (verdict (c)+partial(a) at `04d5cefa`) and opens in a **dedicated future session** where the corpus refactor + four-reviewer dispatch (Fred/Betty/docs-adr-expert/assumptions-expert) can fill the whole arc.

### Cycle 1 wrap — closeout residue

Cycle 1 substance is complete and pushed (8 commits on origin). Remaining residue at the time of this plan amendment:

1. **Push Torrid's `83c79fa6`** — late consistency-fix (per-file detail uses `inventoryGlyph`); Feathered to push at session-close. Single commit; no expected pre-push blockers given the bundle is otherwise green.
2. **Feathered closeout broadcasts** — bundle-landed/cycle-complete broadcast + heartbeat-end + claim close (`c89bcb0c-da42-4b5e-843a-fc2be11d830d`). Torrid already broadcast retirement at 07:23Z with closeout findings (event `acknowledged-here`).
3. **Commit this plan amendment + thread/continuity refresh** — session-handoff residue commit (chore class). Includes the new Cycle 1 graduation-candidates shard.

### Cycle 2 brief — next pickup after Cycle 1 wrap

After Cycle 1 fully closes (push lands, claims closed, bundle-landed broadcast emitted), the program's next cycle opens from the workstream sections below. Priority (per the original §"First-move recommendation"):

- **WS0 substantive corpus refactor** — dedicated session; four-reviewer dispatch; the SKILL decomposition shape is already DIRECTED (verdict (c)+partial(a) at `04d5cefa`).
- **WS1 #4** (identity routing-tuple disambiguation) — decide cure shape before implementation; can run in parallel with WS0.
- **WS4 SKILL-level cross-references** — the Cycle 1 B3 rule file is sufficient for one cycle; SKILL cross-reference can follow opportunistically.

WS2, WS3 (α/β/γ), WS5, WS6, WS7, WS8, WS9, WS11 retain their original dependency-graph sequencing. WS10 (PDR-082 second-instance) remains opportunistic — the trigger fires when the next n=2 session happens naturally; Cycle 1 may itself partially count toward the second-instance evidence base depending on PDR-026 ratification at consolidation.

### Coordination shape for n=2 cycles

- Apply the worked-instance from `agentic-engineering-enhancements.next-session.md` Cycle 1 entry: lane separation, separate intent-scoped commits, gate-runner singleton, homing-to-shard for any curation residue.
- Both agents post team-start broadcast at session-open per `start-right-team` SKILL §1.
- Run `pnpm check` once per round (gatekeeper-specialisation per memory).
- Each enforcement lands as its own commit; commit subject names the file changed.
- **Cycle 1 worked-instance additions**: structural prerequisites discovered during execution may be absorbed by the relevant lane if reviewer-ratified (Cycle 1 absorbed E1+E2 without losing coherence). Mid-cycle compaction handoffs (PDR-063) operate cleanly under bundle load; both agents may retire mid-cycle and the bundle survives.

### WS0 — P9 rule/skill topology refinement (TIER 0 meta-constraint)

**Goal**: Refactor the rule corpus + SKILL surface so doctrine additions cost less per session-forever.

**Status**: SKILL decomposition shape DIRECTED 2026-05-25 — verdict (c) plus partial (a). WS0 substantive work cleared to open. See §"SKILL decomposition shape — directed verdict" below.

**Substance**:

- Two-tier classification of the rule corpus: always-on invariants (load every session) vs trigger-loaded skills (load when condition fires). Falsifiable firing triggers, not vibes.
- Decomposition shape for SKILL `start-right-team`: 26 sections is past operational coherence. Verdict directed 2026-05-25 — see §"SKILL decomposition shape — directed verdict" below.
- Rule-vs-clause-in-existing-PDR decision rule: when should new substance be a new rule under `.agent/rules/`, vs a clause inside an existing PDR or ADR? Several items in this plan (8, 11, 26, 27) are debatably PDR-clauses rather than new rules.

**Acceptance**:

- Rule corpus has explicit always-on vs trigger-loaded classification (corpus-wide).
- SKILL `start-right-team` decomposition shape is decided and named.
- Decision rule (new rule vs clause-in-PDR) is documented.
- Net rule count after WS0 is **lower** than before (P9 must remove more than it adds).
- Skill-load budget headroom restored to at least 20% below the ~80 ceiling.

**Blocked-by**: nothing — SKILL decomposition shape resolved 2026-05-25.

**Blocks**: WS3 (SKILL amendment shape), WS5 (Director-class bundle), WS9 (if any new rule wiring required).

**Owner-direction-gate**: RESOLVED 2026-05-25 — verdict (c) plus partial (a) directed by LTAE-applied-to-the-frame. The original "pending owner verdict" framing was itself the failure mode; see §"SKILL decomposition shape — directed verdict" below.

**Reviewer dispatch** (after owner verdict, before any rule file is moved): architecture-expert-betty (cohesion of new topology); architecture-expert-fred (ADR compliance: ADR-119 three-layer model, ADR-125 portability, ADR-150 continuity surfaces); docs-adr-expert (PDR/ADR/rule home decisions); assumptions-expert (proportionality of corpus-wide refactor).

#### SKILL decomposition shape — directed verdict (2026-05-25)

**Verdict: (c) plus partial (a).** WS0 substantive work cleared to open.

The SKILL `start-right-team` is currently 973 lines across 26 sections.
The verdict was directed under the
[`re-apply-first-question-at-elaboration-boundaries`][rule-elab] rule
applied to the *option-set itself* — not to choices within it. The
rule prescribes re-asking the first question at every elaboration
boundary; an option-set inherited from a prior session is one such
boundary, and the long-term-architectural-excellence lens applied to
the framing reveals only one architecturally-excellent shape.

[rule-elab]:
  ../../../rules/re-apply-first-question-at-elaboration-boundaries.md

**Shape directed**:

- Apply (c) as the structural fix — extract §0 (Comms watcher) and
  §0.5 (Liveness heartbeat) sections of `start-right-team` into
  dedicated rule files. Both are operational invariants already
  candidate for rule-shape; extracting them aligns with the two-tier
  classification's trigger-loaded category and removes substrate from
  the over-large SKILL.
- Apply partial (a) — keep a short mode-selection front-matter block
  at the top of `start-right-team` so bootstrapping agents see the
  routing surface at first read. Additive over pure (c): centralises
  mode-routing in a visible block rather than dispersing it through
  section structure.

**Options considered and rejected** (audit trail for the LTAE pass):

| Option | Verdict | Reason |
|---|---|---|
| **(a) inline §"Mode Selection" front-matter alone** | Rejected as under-engineered | Reduces *cognitive* load by mode-tagging body sections, but leaves the substrate in place. Treats the symptom (973 lines too many to hold), not the structural cause (substrate that belongs at the rule layer sitting in the SKILL layer). Not an anti-shape; just under-engineered for WS0's stated goal of *"doctrine additions cost less per session-forever."* |
| **(b) sibling SKILLs** (`start-right-pair` + `start-right-director-team` + trimmed canonical) | Rejected as anti-shape | Net SKILL surface count *increases* by 2 across the trio. Directly violates the WS0 acceptance criterion at line 127 ("Net rule count after WS0 is lower than before"). Worsens the ~80 active-skill discovery ceiling (currently 77 → 79). Surfacing this as a peer option to (c) was the failure mode the LTAE pass caught. |
| **(c) section-trimming via amendment-via-PDR-pointer (alone)** | Subsumed by directed verdict | Architecturally excellent on its own; the directed verdict adds partial (a) for the additive ergonomic benefit. Pure (c) without partial (a) is acceptable if mode-selection visibility is judged sufficient via section structure alone. |

**Doctrine applied**: the directed verdict is a worked-instance of
[`re-apply-first-question-at-elaboration-boundaries`][rule-elab]
§"Failure Mode 1: Elaboration Without Re-Asking" applied at the
option-set surface. The original framing surfaced (a)/(b)/(c)/hybrid
as peer choices "for owner verdict"; the rule prescribes re-asking
the first question at the elaboration boundary, which reveals (b) as
an anti-shape and the verdict as directed-not-menu. Per
`principles.md` §Architectural Excellence Over Expediency, the
expedient option is not a respectable third choice next to
"do it right" — it is categorically excluded, and presenting it as a
legitimate trade-off is itself the failure mode.

**Next action under the verdict**: WS0 opens with the proposal-draft
cycle — author the two-tier rule corpus classification (every file
under `.agent/rules/` classified as `always-on` or `trigger-loaded`
with a falsifiable firing trigger) + the rule-vs-PDR-clause decision
rule + the (c)-shape extraction plan for §0 and §0.5 of
`start-right-team`. Surface as an amendment to this WS0 for reviewer
dispatch (Fred + Betty + docs-adr-expert + assumptions-expert) BEFORE
any rule file is moved or amended.

### WS1 — Tooling friction at the moment of shipping (TIER 1)

**Goal**: Remove invisible per-session friction in CLI ergonomics and hook-chain behaviour.

**Status (2026-05-25 revision)**: WS1 needs re-survey before substantive work — first-move attempt revealed items 1 and 2 are substantially done already. The plan-as-authored was based on stale state; the finding itself is the worked-instance evidence for the verify-before-applying discipline. See §"WS1 re-survey finding (2026-05-25)" below.

**Items** (parallel-able with WS0):

1. **`comms direct` flag-discoverability** — `--help` documents `--platform`/`--model`/`--active`. Hushed observed three retry attempts (2026-05-25 13:11Z). **Status (2026-05-25 verify)**: current help text lists all flags including `--platform`/`--model`/`--active` and the mutual-exclusion guidance on `--body`/`--body-file`. The discoverability friction is plausibly cured by the existing help text; Hushed's three retries may have been a different surface or a transient.
2. **`--body-file` / `--subject-file` on comms verbs** — eliminates shell argv corruption class for long content (Celestial Glimmering Moon's ~3300-char `--body` failure, 2026-05-21). **Status (2026-05-25 verify)**: `--body-file` is implemented on all four comms verbs (`append`, `send`, `direct`, `reply`) with mutex against `--body` and empty-file rejection. Integration tests cover `comms direct` (4 cases including shell-special-char body). Gaps: no direct tests for `comms append --body-file` and `comms send --body-file` argv paths; `--subject-file` is not implemented but subjects are short by design (low-value addition).
3. **Husky pre-commit hook sweep-into-staged cure** — separate friction lane; hook-chain auto-fix output must not be silently swept into staged set. Distinct from the rejected `pre-commit hook must gate staged-only` direction. Friction-register entry + investigation pass.
4. **Identity routing-tuple disambiguation (#18)** — two-step: (a) decide cure shape (session-aware identity discipline / `rename-within-session` event class / claims-surface aggregation by `session_id_prefix`); (b) implement chosen cure. N≥10 instances captured already.

**Acceptance** per item: regression test or worked-instance evidence; no new always-on doctrine added.

#### WS1 re-survey finding (2026-05-25)

The 2026-05-25 Mistbound session opened WS1 expecting item #2 to be the first move. Verification (per the verify-before-applying discipline) revealed `--body-file` was already shipped and tested. Items #1 and #2 are substantially complete; items #3 and #4 remain.

Implication for execution sequencing:

- The Tier-1 next move on WS1 is **item #4 step (a) — identity routing-tuple disambiguation, decide cure shape**. Decision-shape work, no code; surfaces well to a single reviewer-dispatched cycle.
- Item #3 (husky hook sweep cure) remains a friction-register investigation pass, not a known-shape fix.
- Item #2 residual work — extending `--body-file` test coverage to `comms append` and `comms send` argv paths — is a small bookkeeping cycle, ship-anytime.
- Item #1 may be closeable on the next worked-instance: if an agent finds the help text sufficient on first attempt, capture the verified-instance and close the item.

The finding itself is the founding worked-instance for the verify-before-applying discipline: had this session not verified state, it would have spent a cycle re-implementing already-shipped substrate. Cure shape: at every plan-execution opening, the first action is a state verification pass on the named substrate.

**Reviewer dispatch**: code-expert (per item); type-expert (if CLI option types change); test-expert (worked-instance tests).

### WS2 — Decomposition discipline (TIER 1)

**Goal**: Cure the Coordination-as-precondition failure mode from the Fiery / Stormy PR-115 cycle (~25 min ceremony tax on ~4 min fix work).

**Items**:

1. **Judgment-shaped guidance** for `decompose-before-bundling` (item #2 reframed per Fred — original name `ship-independent-coordinate-dependent` trended mechanical). Substance: verified + trivial + within standing authorisation → ship immediately as its own commit + push. Coordinated / substantive work bundles in parallel. **Trivial heuristic discipline** (verified locally + clean CI prediction) per Wilma's adversarial probe; trivial is local, but the cure for trivial-mis-classification is evidence at staging time.
2. **Action-visibility test embedded in commit + marshal SKILLs** (item #4 — structural form of #2). Fires before bundling decisions: *"is the bundle deferring an action's IMPACT artefact (origin-visible commit, comment-marked-addressed, CI-trigger)?"*

**CI-cost amplification at scale** (Wilma's concern): named explicitly in the guidance as a context-dependent consideration. Default to push-each-fix for speed at n=2/n=3 owner-directed sessions; reconsider at higher N if CI quota becomes scarce.

**Acceptance**: next mixed marshal cycle, trivial fixes ship + push within ≤5 min of verification regardless of substantive-work coordination state.

**Blocked-by**: WS0 (rule-vs-clause decision determines whether the rule is small + SKILL hook is the structural form, or the rule is the primary surface).

**Reviewer dispatch**: code-expert (SKILL hook); assumptions-expert (proportionality at higher N); test-expert (worked-instance ratification).

### WS3 — PDR-082 amendments and evolution (TIER 2)

**Goal**: Sharpen PDR-082 against the reviewer findings before the SKILL amendment lands.

**Amendments**:

- **α**: Name the all-channels watcher explicitly in the Forbidden section, alongside the generic "Dropping retained substrate" rule. Verified 2026-05-25: the watcher is already implicitly forbidden via the generic rule (PDR-082 line 209); the explicit naming closes the watcher-stopped-by-default failure path in the 2→3 detection chain without ambiguity (Betty, refined).
- **β**: Silent-API-failure cure (Wilma's Scenario D). Two viable shapes — heartbeat retention at n=2 unless explicitly owner-opted-out, OR all-channels watcher emits silent-detection event after N minutes of zero peer activity. PDR amendment chooses one with explicit rationale.
- **γ**: Retain/drop table restructured as typed tiers (Betty's "third shape" obligation-tier taxonomy seed). Costs nothing at authoring time; positions PDR-082 for the long-term evolution toward classification-as-metadata.

**Companion SKILL amendment** (item #3): `start-right-team` §1 amendment for n=2 mode. **Blocked-by**: WS0 (inline-vs-sibling SKILL decision) AND WS10 (PDR-082 second-instance ratification gate).

**Acceptance**: PDR-082 still Proposed but amended; SKILL amendment lands when both gates pass; worked-instance ratification accompanies (item #25).

**Reviewer dispatch**: architecture-expert-wilma (failure-mode probe of amendment β); docs-adr-expert (PDR-082 amendment + SKILL section coherence); test-expert (worked-instance ratification, not unit tests).

### WS4 — Heartbeat and owner-attention cures (TIER 2)

**Goal**: Cure owner-attention-budget taxes that fired this session.

**Items**:

1. **Heartbeats-are-infrastructure** (item #8 reframed per Fred) — clause inside PDR-078, not new rule. Distinguishes heartbeat substrate from delivery substrate. Owner critique 2026-05-25 06:45Z; trigger fired.
2. **Heartbeat-content mechanical state-binding** (item #9) — heartbeat body derives from current state (open claim, current cycle), not free-form prose. Substrate change in agent-tools heartbeat emitter wrapper. Cure for the Misty + Lunar content-drift instances 2026-05-24.
3. **Ping-before-escalate** (item #11) — agent-general rule, not Director-only (per Fred). Cross-check git + queue + DM before retirement-detection broadcast. Cure for the Lunar→Mistbound false-positive retirement broadcasts 2026-05-24.

**Acceptance** per item: worked-instance ratification — next session that would have fired the failure mode does not fire it.

**Reviewer dispatch**: architecture-expert-wilma (heartbeat emitter substrate change); test-expert (worked-instance ratification).

### WS5 — Director-class doctrine bundle (TIER 5 — blocked-by WS0)

**Goal**: Land Director-class autonomy primitives as ONE coherent doctrine pass, not five separate items. Bundling controls doctrine-load cost.

**Items** (bundled):

- **Substrate-resolution-first ratification** (item #6, agent-general per Fred + assumptions) — first ratification question on owner-decision arrival: *"can the team resolve via reviewer-dispatch, sidebar, or vote?"* Generalises PDR-074 P2 to any agent in any role.
- **Pre-positioned routing primitive** (item #7) — every owner-decision-gated slice carries pre-positioned routing in the comms stream contingent on verdict shape.
- **Standing-direction graduation primitive** (item #26, agent-general per Fred) — any agent at session-close actively identifies owner-direction substance worth graduating to standing rules.
- **Slice-routing self-selection primitive** (item #27, agent-general per Fred) — broadcast slice + substrate authority + fit criteria; agents self-elect.
- **Director-seat-on threshold** (item #10) — ≥4 agents OR explicit owner direction. Single-clause documentation.
- **First-out-closeout-owner self-election** (item #12) — protocol for self-electing first-out closeout owner when none declared at team-start. Frequency at every n.
- **Three-mode standby with holding-reason articulation** (item #13) — silent / substrate-work / routed-slice; >5 min standby carries an articulated holding-reason in comms.

**Bundling rationale**: each individual item is small-to-moderate impact, moderate frequency. Landing them separately incurs 5× the doctrine-load cost of landing them together as PDR-074 clauses + one bundled SKILL amendment to `start-right-team` (post-WS0 decomposition).

**Acceptance**: PDR-074 reaches Accepted; bundled SKILL amendment lands; corpus-wide rule count does not increase by more than 1–2 net (most substance lands as PDR-074 clauses).

**Blocked-by**: WS0 (rule-vs-PDR-clause decision; SKILL decomposition shape).

**Reviewer dispatch**: architecture-expert-betty (cohesion of bundle); architecture-expert-fred (PDR-074 compliance); docs-adr-expert (bundle structure); assumptions-expert (frequency / proportionality of Director-class substrate).

### WS6 — cost-of-collaboration P6 + P7 (parallel with WS0)

**Goal**: Land the substrate that reduces gate-visible coordination churn (P6) and makes polling/watch cadence work-shape-aware (P7).

**Items**: as in parent plan `cost-of-collaboration.plan.md` §P6 / §P7. This plan does not re-author the substance; it sequences them.

**Sequencing note**: Wilma's adversarial probe argued P9 first blocks P6/P7 because P9's triggers depend on P6's clean decoupling. Verified-against-rejection: P9's triggers are mostly context-load-shape (when X file is being edited, load Y skill), not coordination-state reads. P9 and P6/P7 are coupled at the trigger-design interface but not strictly sequenced. They can run in parallel.

**Reviewer dispatch**: architecture-expert-betty (coupling between P9 and P6/P7); architecture-expert-fred (ADR compliance).

### WS7 — cost-of-collaboration P8 descope-or-close (decision-needed)

**Goal**: Resolve the open status of P8 (collaboration TUI).

**Decision**: P8 acceptance gate has multiple reviewer-flagged gaps (live updates, inactive-agent visibility, strict validation, component tests). The cure could be:

- **Acceptance-close**: land all reviewer-flagged work; P8 becomes operator-grade live TUI.
- **Descope**: at n=2 the owner-chat is the substrate; at n=3 sidebars cover; the TUI is high-value at n≥4 only. If n≥4 is rare, P8 is over-investment. Descope to a thin operator view; promote heavy lifting to a future plan.

**Owner direction required** to choose. The descope option is not currently in the parent plan; this plan flags it as legitimate.

### WS8 — Research / design-evaluation track (parallel; not blocking)

**Goal**: Capture three design-evaluation surfaces that may reshape the substrate without blocking the rest of the program.

**Items**:

1. **Continuous-scale-sensitive coordination — verdict captured** (item #28). Betty's analysis: Shape A (discrete mode, PDR-082) wins on long-term change cost; Shape B (continuous-scale-sensitive) converges to Shape A when implemented correctly. The verdict is **substrate**; capture it so future sessions don't re-derive it.
2. **Comms-as-event-stream — substrate-shape evaluation** (item #29). Deeper question: is file-backed event stream the right substrate, or would a different shape (in-band commit annotations, structured chat with templates, hybrid) dissolve some failure modes? Genuinely novel direction; low philosophy alignment by current standards is precisely why it's worth evaluating. Output: an evaluation note, not an implementation.

**Note on obligation-tier taxonomy** (item #32 in survey): Betty's "third shape" is the long-term evolution target for PDR-082's retain/drop table. Each obligation classified as `scale-invariant` / `scale-sensitive-threshold(N)` / `coordination-geometry-sensitive(chat-visibility)`. **This is not a separate research deliverable** — it is the drafting structure WS3γ uses when restructuring PDR-082's retain/drop table as typed tiers. Costs nothing now; positions PDR-082 for future evolution. Captured here for cross-reference but executed in WS3γ.

**Acceptance**: substrate captured at `.agent/research/agentic-engineering/` or as PDR appendix.

**Reviewer dispatch**: architecture-expert-betty (taxonomy shape, change-cost analysis); architecture-expert-fred (compliance under new substrate); architecture-expert-wilma (failure-mode shifts under alternative substrates).

### WS9 — Overhead-to-delivery instrumentation (conditional)

**Goal**: First-class observable for the metric the owner's standing direction names.

**Substance**:

- Coordination overhead-to-delivery ratio per session (item #17). Counts inter-agent comms events per work-cycle.
- n=2 comms budget instrumentation (item #5) — n=2-specific form: warning when comms-event-count > 3 per fix cycle.

**Condition**: lands ONLY if tied to an action threshold. Dashboard-only instrumentation is busy-work per the WHY metacognition pass. The threshold must change behaviour (warning, auto-quiesce, soft-block).

**Blocked-by**: WS10 (PDR-082 second-instance) for the n=2 threshold calibration.

**Reviewer dispatch**: code-expert (instrumentation implementation); assumptions-expert (threshold legitimacy).

### WS10 — PDR-082 second-instance trigger (wait-state)

**Goal**: Honest sequencing — PDR-082 second-instance evidence is the gate for several downstream items but is not actionable in this planning lane.

**Trigger**: a second n=2 session happens naturally. Per PDR-026 falsifiability discipline: a clean session → PDR-082 candidate for Adopted; a session surfacing a new overhead vector → PDR-082 refined; three clean sessions → PDR-082 candidate for Accepted.

**Unblocks**: WS3 SKILL amendment, WS9 budget instrumentation calibration, item #25 worked-instance ratification.

**Acceptance**: PDR-082 status progression recorded in the PDR; downstream WS unblocked.

### WS11 — Clarifications and cross-references (one-time)

**Goal**: Small doc moves and integration cross-references.

**Items**:

- Shared-checkout empirical-class clarification (item #20) — amend `feedback_worktree_isolation_unreliable` per-user memory to scope to sub-agent worktree dispatch. One-line note distinguishing shared-checkout multi-main-session as a distinct empirical class.
- Cross-reference n-agent-experiments hypothesis layer (`prompts/agentic-engineering/collaboration/hypothesis.md`) for items that should graduate through that pipeline rather than direct doctrine landing.
- Cross-reference `multi-agent-collaboration-protocol.plan.md` WS5 (paused) to this plan's WS5 (Director-class doctrine bundle), so future agents land the substance through the right surface.

**Reviewer dispatch**: docs-adr-expert.

## Dependency graph

```text
WS0 (P9 — meta-constraint)
├── unblocks: WS3 SKILL amendment shape, WS5 doctrine-bundle, WS2 rule shape
└── parallel with: WS1, WS2 (parallel-able), WS4, WS6, WS8

WS1 (tooling friction) — independent
WS2 (decomposition) — depends-on WS0 for rule shape
WS3 (PDR-082 amendments + SKILL)
├── depends-on: WS0 (SKILL shape), WS10 (second-instance ratification gate for SKILL landing)
└── WS3 α/β/γ amendments land before WS10
WS4 (heartbeat + owner-attention) — independent
WS5 (Director-class bundle) — depends-on WS0
WS6 (P6 + P7) — parallel with WS0
WS7 (P8 descope decision) — owner-direction
WS8 (research track) — parallel; non-blocking
WS9 (instrumentation) — depends-on WS10 for n=2 threshold
WS10 (PDR-082 second-instance) — wait-state; trigger-fired
WS11 (clarifications) — independent
```

**First-move recommendation**: WS0 + WS1 + WS4 in parallel (WS0 is meta-constraint, WS1 and WS4 are independent and remove invisible per-session cost). WS2 + WS6 + WS8 begin in parallel as WS0 progresses. WS3, WS5, WS9 sequence after their respective blockers.

## Standing constraints (apply to every workstream)

- **Architectural excellence over expediency** per `principles.md`. Cheap-cure framings are categorically excluded.
- **Knowledge and communication, not mechanical refusals** per `multi-agent-collaboration-protocol.plan.md` Design Principle 1. The protocol informs agent judgment; it does not refuse agent action.
- **Test-first / worked-instance ratification** per `testing-strategy.md` — for doctrine, the atomic landing is a worked-instance, not a unit test. For code (WS1, WS4 substrate, WS9), atomic test + product code pair.
- **Replace, don't bridge** per `replace-dont-bridge.md`. Where new doctrine replaces old, retire the old in the same commit.
- **No moving targets in permanent docs** per `no-moving-targets-in-permanent-docs.md`. Counts, SHAs, frequencies belong in this plan or ephemeral state, never in PDRs/ADRs/rules.
- **All quality gates blocking, always** per the user memory; this includes the doctrine-load gates introduced by P9.
- **Owner action is not a valid cure** — every owner-intervention cure indicates a missing autonomy primitive; design accordingly.

## Risks

| Risk | Mitigation |
|---|---|
| P9 lands without clear acceptance criteria → no measurable improvement | WS0 acceptance criteria are concrete (net rule count lower; SKILL decomposition shape decided; corpus headroom ≥20% under ceiling). Falsifiable. |
| Director-class bundle delayed indefinitely waiting for empirical evidence | WS5 acceptance is *bundle-shape decided*, not *every primitive validated*. Validation is per-primitive through PDR-074's falsifiability. |
| PDR-082 second-instance never naturally occurs at meaningful frequency | WS10 is honestly flagged as wait-state. Downstream items have explicit triggers, not deadlines. If n=2 sessions become rare, PDR-082 retains Proposed status indefinitely; no harm to the rest of the program. |
| WS3 amendments β (silent-API-failure cure) chosen sub-optimally | Reviewer dispatch (Wilma adversarial) before landing the chosen shape. PDR amendment shape is itself owner-direction-class. |
| WS8 research track produces no concrete actions | Acceptable. Research outputs are substrate-captures, not implementations. They prevent future re-derivation; that is sufficient value. |
| Skill-load budget pressure pushes WS0 to over-aggressive deletion of doctrine | Reviewer dispatch (Fred ADR-compliance; Betty cohesion) before WS0 lands. Net rule count reduction is the headline measure but not the only one — substance preservation outranks fitness pressure per the no-cheap-cure principle. |
| CI cost amplification at higher N erodes WS2 decomposition discipline | Wilma's concern is named in WS2; the cure is context-dependent. At higher N, the discipline may need refinement. PDR-026 falsifiability discipline applies. |

## Acceptance — overall program

The program is complete when:

1. WS0 has landed with measurable corpus headroom restoration.
2. WS1 + WS2 + WS4 have landed worked-instance ratifications.
3. WS3 α + β + γ amendments to PDR-082 have landed; the SKILL amendment lands when WS10 fires (or stays pending indefinitely as wait-state).
4. WS5 has landed as a bundled doctrine pass.
5. WS6 (P6 + P7) has landed per parent plan acceptance.
6. WS7 has produced an owner-directed decision on P8.
7. WS8 substrate-captures exist at `.agent/research/agentic-engineering/`.
8. WS9 has landed conditionally (action-threshold-tied or explicitly deferred).
9. WS11 cross-references and clarifications have landed.

## Falsifiability

This plan asserts:

1. **P9 first reduces total doctrine-load cost across the program.** Falsifiable: if the rule corpus is larger AND less coherent AND headroom is lower after WS0–WS5 than before, P9 did not pay off.
2. **The decomposition discipline (WS2) lowers ceremony tax at n=2 marshal cycles.** Falsifiable: next mixed marshal cycle, ceremony-tax ratio is not improved against the 2026-05-25 Fiery baseline (~6×).
3. **PDR-082 amendments (WS3) cover the documented failure modes without making the mode unworkable.** Falsifiable: a second n=2 session under amended PDR-082 surfaces a new failure mode that none of α/β/γ covered.
4. **Director-class bundle (WS5) costs less doctrine load than landing items separately.** Falsifiable: post-WS5 rule + SKILL line count exceeds the projected per-item-separate landing cost.
5. **Research track (WS8) substrate-capture prevents re-derivation.** Falsifiable: a future session re-derives Betty's Shape A / Shape B analysis from scratch despite the capture.

## Cross-references

- Parent: [`cost-of-collaboration.plan.md`](cost-of-collaboration.plan.md) — this plan amends its P-sequence.
- Substrate: [PDR-082](../../../practice-core/decision-records/PDR-082-n2-collaboration-mode.md) — the durable home for the n=2 mode cure.
- Substrate: [PDR-074](../../../practice-core/decision-records/PDR-074-director-value-is-mind-coherence-per-owner-attention.md) (Candidate; Director ratification checklist + three-mode standby + autonomy primitives) — substrate authority for WS5.
- Substrate: [PDR-075](../../../practice-core/decision-records/PDR-075-director-substrate-writing-discipline.md) (Director substrate-writing discipline) and [PDR-077](../../../practice-core/decision-records/PDR-077-marshal-as-cycle-discipline.md) (Marshal-as-cycle-discipline) — both compose with WS5.
- Substrate: [PDR-078](../../../practice-core/decision-records/PDR-078-liveness-heartbeat-contract.md) + [ADR-186](../../../../docs/architecture/architectural-decisions/186-comms-event-heartbeat-lifecycle-substrate.md) — heartbeat contract; WS4 lands as PDR-078 amendment, not new rule.
- Falsifiability discipline: [PDR-026](../../../practice-core/decision-records/PDR-026-falsifiability-and-experimental-discipline.md) — governs WS10 second-instance trigger and risk-row resolutions.
- Survey: [agent-coordination-efficiency-survey-2026-05-25](../../../research/agentic-engineering/agent-coordination-efficiency-survey-2026-05-25.md).
- Pending-graduations shards: [fiery decomposition + n=2](../../../memory/operational/pending-graduations/2026-05-25-fiery-collaboration-decomposition-and-n2-efficiency.md), [team-session autonomy](../../../memory/operational/pending-graduations/2026-05-23-team-session-autonomy.md), [misty director-session](../../../memory/operational/pending-graduations/2026-05-25-misty-director-session-candidates.md).
- Hypothesis layer: [n-agent-collaboration-experiments.plan.md](n-agent-collaboration-experiments.plan.md) + [hypothesis.md](../../../prompts/agentic-engineering/collaboration/hypothesis.md).
- Sidebar / escalation: [multi-agent-collaboration-sidebar-and-escalation.plan.md](multi-agent-collaboration-sidebar-and-escalation.plan.md) — phase-transition observation (touching threads, not agent count) informs n=2 mode trigger conditions.
- Adjacent collaboration plan: [multi-agent-collaboration-protocol.plan.md](multi-agent-collaboration-protocol.plan.md) — WS5 of this program lands substance that the protocol plan's WS5 (paused) was waiting for; WS11 cross-references the routing.

## Appendix A — Linear ranking (E+I+S convolution; for reference only)

The user-specified four-axis scoring (Ease, Impact, Simplicity, Philosophy; convolution = E+I+S, philosophy as interest-only) produced the table below. **The plan's spine is the dependency graph above, not this table.** The convolution is structurally blind to leverage, amortisation horizon, cost-direction sign, information value, reframing potential, agent-count variance, failure-mode coverage, and dependency depth (see §"Why the linear ranking under-serves the strategic question").

| Item | E | I | S | P | Σ | Tier | Notes |
|---|---|---|---|---|---|---|---|
| 24 P9 (rule/skill topology) | 2 | 5 | 4 | 5 | 11 | 0 | Negative cost-direction; constrains rest |
| 2 Decompose-before-bundling | 5 | 4 | 5 | 5 | 14 | 1/2 | Reframed from `ship-independent-coordinate-dependent` |
| 4 Action-visibility test in SKILLs | 4 | 5 | 4 | 5 | 13 | 1/2 | Structural form of #2 |
| 14 `comms direct` flag-discoverability | 5 | 3 | 5 | 5 | 13 | 1 | Tooling fix |
| 25 n=2-mode worked-instance ratification | 5 | 3 | 5 | 5 | 13 | 4 | Blocked-by #1 |
| 10 Director-seat-on threshold | 5 | 3 | 5 | 5 | 13 | 5 | Bundled |
| 8 Heartbeats-are-infrastructure | 5 | 4 | 5 | 5 | 14 | 2 | Reframed as PDR-078 amendment |
| 3 `start-right-team` §1 n=2 amendment | 4 | 4 | 4 | 5 | 12 | 4 | Blocked-by #1 + WS0 |
| 6 Substrate-resolution-first | 4 | 4 | 4 | 5 | 12 | 5 | Bundled; agent-general |
| 20 Shared-checkout empirical-class clarification | 5 | 2 | 5 | 5 | 12 | 6 | One-time |
| 11 Ping-before-escalate (agent-general) | 4 | 3 | 4 | 5 | 11 | 2 | Reframed |
| 15 `--body-file` / `--subject-file` | 4 | 3 | 4 | 5 | 11 | 1 | Tooling fix |
| 16 Protocol-position command | 3 | 4 | 4 | 4 | 11 | 1/3 | Tooling add |
| 5 n=2 comms budget instrumentation | 3 | 3 | 4 | 4 | 10 | 9 | Conditional |
| 18 Identity routing tuple disambiguation | 3 | 4 | 3 | 4 | 10 | 1 | Two-step |
| 22 P7 (async/sync mode awareness) | 3 | 4 | 3 | 4 | 10 | 6 | Parallel with WS0 |
| 31 Husky hook sweep-into-staged cure | 3 | 4 | 3 | 4 | 10 | 1 | Friction lane |
| 28 Continuous-scale-sensitive eval | 3 | 5 | 2 | 2 | 10 | 8 | Research / verdict capture |
| 7 Pre-positioned routing (P1) | 3 | 3 | 3 | 4 | 9 | 5 | Bundled |
| 9 Heartbeat-content state-binding | 2 | 4 | 3 | 4 | 9 | 4 | Substrate change |
| 12 First-out-closeout self-election | 3 | 3 | 3 | 4 | 9 | 5 | Bundled |
| 13 Three-mode standby | 3 | 3 | 3 | 4 | 9 | 5 | Bundled |
| 17 Overhead-to-delivery metric | 3 | 3 | 3 | 3 | 9 | 9 | Conditional on action-threshold |
| 21 P6 (artefact isolation) | 2 | 5 | 2 | 4 | 9 | 6 | Parallel with WS0 |
| 26 Standing-direction graduation | 3 | 3 | 3 | 4 | 9 | 5 | Bundled; agent-general |
| 27 Slice-routing self-selection | 3 | 3 | 3 | 4 | 9 | 5 | Bundled; agent-general |
| 30 Atomic mode-switching primitive | 3 | 3 | 3 | 4 | 9 | — | **Deferred** until PDR-082 Accepted |
| 29 Comms-as-event-stream eval | 2 | 4 | 2 | 1 | 8 | 8 | Genuinely novel; research output |
| 23 P8 acceptance close | 2 | 3 | 2 | 3 | 7 | 7 | Descope-or-close decision |
| 1 PDR-082 second-instance validation | — | — | — | — | — | 10 | **WAIT-STATE** |
| 32 Obligation-tier taxonomy | — | — | — | 1 | — | 8 | Foundation primitive; long-term |

## Appendix B — What the linear ranking misses (the additional axes)

For each axis the user-specified scoring is structurally blind to, the items it would have surfaced differently:

| Axis | Items it would re-surface |
|---|---|
| Leverage | 24 (P9, leverage 5); 28 (could dissolve 3/25/30); 32 (long-term taxonomy seed) |
| Amortisation horizon | 24 (per-session-forever negative); doctrine load (per-session-forever positive); tooling fixes (per use) |
| Cost-direction (sign) | 24 (strongly negative); 21 (negative for gate-churn); rule additions (positive load) |
| Information value | 1 (PDR-082 second-instance, 5); 28/29 (5); rule codifications (1) |
| Reframing potential | 28, 32 (5 — could dissolve mode-shape items) |
| Variance across agent-count | Director-class items (variance 5); tooling fixes (variance 1) |
| Failure-mode coverage | 2/4/8 (evidenced); 26/27 (prophylactic) |
| Dependency depth | 3/25 blocked-by 1/24; 30 deferred until PDR-082 Accepted |

## Lifecycle triggers

- **WS0 + WS1 + WS4 open immediately** on owner ratification.
- **WS10 fires opportunistically** when a second n=2 session happens. No deadline.
- **WS7 owner-direction-gate** before WS7 work begins.
- **WS8 research track** opens when reviewer dispatch is scheduled; outputs are substrate notes.
- This plan archives when all WS0–WS9 + WS11 have reached acceptance; WS10 remains active as a trigger-condition until PDR-082 reaches Accepted.

## Learning loop

Per ADR-117, this plan ends with consolidation. Specifically:

- After WS0 lands, capture lessons in `.agent/research/agentic-engineering/` if the topology refinement surfaced unexpected substrate.
- After each tier completes, surface the worked-instance evidence as napkin entries; route through `/jc-consolidate-docs` graduation scan.
- After WS10 fires (PDR-082 second-instance), update PDR-082 status; route the n-agent-experiments hypothesis layer.
- Plan revision history at file bottom; revisions land at each completed-tier consolidation.

### Cycle 1 graduation candidates (captured 2026-05-26)

Nine candidates surfaced by Cycle 1 execution beyond the plan's original scope. Each routes to pending-graduations with its proposed permanent home; consolidate-docs converges them per the capture→distil→graduate→enforce pipeline (PDR-011).

| Candidate | Proposed graduation target | Evidence shape |
|---|---|---|
| Pre-pose AskUserQuestion option viability check | Extend `.agent/rules/present-verdicts-not-menus.md` with pre-compose checklist | Caught at zoneGlyph WIP-disposition question 2026-05-26; menu-of-anti-shapes anti-pattern from one agent (Feathered) under coordination rush-impulse |
| Cross-lane structural blocking of commits | PDR or `.agent/memory/active/patterns/` capturing the failure mode + the worked cure (`git apply --cached` for surgical cross-lane staging) | Prismatic stranded WIP 2026-05-25; substantive work uncommitted because peer-lane gate red. Worked cure discovered Cycle 1 by Torrid (E3 commit): `git apply --cached <patch>` against HEAD context to stage only your change, leaving peer WIP intact in WT |
| Heartbeat-without-progress as distinct state from retirement | New failure-mode entry in PDR-078 OR `.agent/memory/active/patterns/`; diagnostic discriminator + cure shape (direct-ping with 4-min deadline, then take-over-and-broadcast) | Feathered `57e615` exhibited heartbeat-emitting-but-no-substantive-events for ≥23 min 2026-05-26 06:38Z→07:01Z while owner-rerouted to plan/handoff lane; Torrid correctly took over E3 + push after ping-non-reply. Worked-instance + cure both in single cycle |
| Owner-rerouted-agent-without-team-visibility | Coordination protocol amendment to `start-right-team` SKILL — agent rerouted by owner must broadcast the re-route to the team | Feathered's owner-rerouted plan/handoff lane was invisible to Torrid; Torrid observed only the original-lane stall. Composes with the heartbeat-without-progress finding |
| Bundle scope-discovery as normal | Clause in plan-templates or decompose-before-bundling guidance | Cycle 1 absorbed E1+E2 (extraction + knip cure) cleanly without losing coherence |
| PDR-063 mid-cycle handoff under bundle load | PDR-063 §Falsifiability worked-instance footer OR `.agent/memory/active/patterns/` | Three handoffs fired in Cycle 1 (Feathered ×2 compactions; Torrid ×1); all pickups worked |
| A1 cure validates itself by running | PDR-078 §Falsifiability worked-instance footer | Typed-origin heartbeat gate operated from dist-rebuild onward |
| B1 self-fires on plan-body content | Cross-reference in B1 rule documentation OR hook-policy README | This Cycle 1 outcome itself triggered B1 mid-edit |
| First-broadcast-establishes-context deterministic tie-breaker | Worked-instance entry in `start-right-team` SKILL §1 cycle-overlap rule | Cycle 1 boundary assignment resolved cleanly without owner intervention |

A tenth candidate from Torrid's closeout findings — **CLI args inconsistency across `comms <verb>`** (`--title` vs `--subject`, `--kind` required for some verbs but not others, `--to-name` vs `--to-agent-name`, `--created-at` rejected by some verbs) — routes to a separate tooling-friction queue rather than a doctrine graduation; captured in pending-graduations shard for tracking only.

## Revision history

- 2026-05-25 — Plan authored decision-complete first-draft by Mistbound Passing Candle (claude / `e77243`). All workstreams pending; owner ratification required before WS0 execution. Substrate captured from the same-session survey + four-reviewer dispatch. Plan structure deliberately differs from a ranked-list shape because the linear convolution is structurally blind to the eight axes recorded in Appendix B.
- 2026-05-26 — Cycle 1 (n=2 enforcement bundle) **COMPLETE**, executed by Feathered Winging Cliff (claude / `57e615`) + Torrid Firing Spark (claude / `5054f8`). **8 commits pushed to origin**: A1 `97f06e16` (Feathered) + E1 `499518ce` + B1 `ecc1e834` + B3 `29ebda41` + E2 `4984d771` + B2 `66e77d73` + E3 `69b50937` (Torrid lanes; E3 zoneGlyph cross-lane takeover after Feathered observed-stall during owner-rerouted handoff work) + owner consolidation `bfbc39f3` (absorbs Prismatic's stranded practice-fitness WIP + .agent/* drift + 170+ session comms events + handoff records + Q-004). Torrid's late polish `83c79fa6` local-only at retirement, awaiting Feathered push. Bundle expanded from 4 items to 6 cure-commits as Lane B absorbed E1+E2 (structural prerequisites) under reviewer ratification; Torrid took over E3 + push when Feathered exhibited heartbeat-without-progress (graduation candidate). PDR-063 mid-cycle handoff fired three times; bundle survived two compactions. WS1 + WS4 todo statuses moved pending → in_progress. Nine graduation candidates captured (see §"Cycle 1 graduation candidates" — original seven plus Torrid's two closeout findings: heartbeat-without-progress as distinct-from-retirement state, `git apply --cached` as surgical cross-lane staging cure). Plan amendment authored by Feathered with metacognition applied per `/oak-metacognition` (pre-pose viability check surfaced as cure for AskUserQuestion menu-of-anti-shapes anti-pattern caught at session boundary; owner re-routed Feathered to plan/handoff lane mid-cycle, introducing the owner-direction-rerouted-without-team-visibility coordination failure mode).
