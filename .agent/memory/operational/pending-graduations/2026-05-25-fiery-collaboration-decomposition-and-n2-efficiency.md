# 2026-05-25 — Fiery collaboration decomposition + n=2 efficiency candidates

Active shard (split from main pending-graduations register by Fiery Kindling Brazier
/ `9f4026` at 2026-05-25T15:16Z, immediately on capture). Two owner-direction-
triggered candidates from the PR #115 marshal cycle retrospective metacognition pass.

Status: item 1 graduated 2026-05-27; item 2 remains owner-gated pending
PDR-082 ratification / second-instance validation. Process any remaining live
item via the standard graduation pipeline (capture → distil → graduate →
enforce).

## 2026-05-27 disposition ledger — Kilned Burning Hearth

| Item | Disposition | Evidence |
| --- | --- | --- |
| Collaboration ceremony — decomposition discipline for marshal cycles | `graduated` | Rule authored at `.agent/rules/ship-independent-coordinate-dependent.md`, adapters added under `.agents/`, `.claude/`, `.cursor/`, `RULES_INDEX.md` updated, and `start-right-team` now points to the rule before bundling work. |
| n=2 coordination efficiency | `owner-gated` | First-stage durable home exists at `.agent/practice-core/decision-records/PDR-082-n2-collaboration-mode.md` with `Status: Proposed`; this shard itself gates the `start-right-team` amendment on PDR-082 ratification / second n=2 session validation. Live holding location remains this shard. |

## Collaboration ceremony — decomposition discipline for marshal cycles

[captured: 2026-05-25 | source: owner-direction+napkin | target:
rule:ship-independent-coordinate-dependent + skill-amendment:start-right-team-§1 |
trigger: owner-direction | size: M | status: graduated 2026-05-27]

**Substance**. 3 PR-115 review comments (2 trivial Copilot + 1 substantive Bugbot) sat
unaddressed on origin for ~30 min during the Fiery commit-marshal cycle. Root cause:
bundling trivial fixes with substantive coordinated work (Stormy ADR-184 amendment +
Breezy curator-pass + Hearthlit retirement substrate) held the trivial fixes hostage to
the bundle timeline. Net: ~4 min of actual fix work, ~25 min of coordination ceremony,
~4 min compaction tax. Owner-named at 14:58Z; agreed "VERY much need to" address
structurally.

**Failure mode named: Coordination-as-precondition**. When independent trivial fixes get
bundled with substantive coordinated work, the trivial fixes' impact (commit visible on
origin, comment marked addressed, CI-trigger) is deferred to the coordination timeline.

**Cure shape (structural, not doc-patch — per metacognition directive)**:

1. **Decomposition default rule** (target:
   `.agent/rules/ship-independent-coordinate-dependent.md` or similar): verified +
   trivial + within standing authorization → ship immediately as its own commit + push.
   Coordinated / substantive work bundles in parallel. Bundling is NOT the default.
2. **Action-visibility test before bundling**: before bundling, ask "is the bundle
   deferring an action's IMPACT artefact (origin-visible commit, comment-marked-
   addressed, CI-trigger)?". If yes, unbundle.
3. **CI-economy is not a marshal-unilateral lever**: default to push-each-fix for speed;
   only optimise CI-run-count when the owner asks.

**Falsifiability**: in next multi-agent commit cycle with mixed trivial + substantive
work, the trivial fixes ship + push within ≤5 min of verification, regardless of
substantive-work coordination state.

## n=2 coordination efficiency

[captured: 2026-05-25 | source: owner-direction | target:
multi:pdr:PDR-082-n2-collaboration-mode+skill-amendment:start-right-team-§1 |
trigger: owner-direction | size: M | status: owner-gated]

**Partial graduation 2026-05-25** (Stormy Surfing Dock `2a7b65`,
post-handoff consolidation pass): first-stage durable home authored at
[`.agent/practice-core/decision-records/PDR-082-n2-collaboration-mode.md`](../../../practice-core/decision-records/PDR-082-n2-collaboration-mode.md)
— Proposed first-draft (uncommitted in working tree at handoff close;
Fiery marshal handoff cycle to sweep). Second-stage graduation = SKILL
`start-right-team` §1 amendment, owner-gated on PDR-082 ratification
(Proposed → Adopted via second n=2 session validation per PDR-026
falsifiability). Route choice: PDR (Practice-governance, portable)
over Fiery's initial ADR framing — per PDR-079 (PDR-vs-ADR portability
distinction, graduated 2026-05-25), n=2 mode is a Practice protocol
question, not an architecture question for this repo. ADR target
dropped from the metadata accordingly.

**Substance**. Owner direction 2026-05-25T~15:03Z: "massively tighten coordination
efficiency for teams of two agents, n=2". The Fiery+Stormy n=2 coordination on PR #115
took 6+ comms events (directed acks, broadcast acks, tree-green, kind-corrections,
standby heartbeats) to land 2 sequenced commits. Each event added context-budget tax +
watcher-tick latency. Total coordination ceremony cost dwarfed the actual fix work.

**Failure mode named: n=2 over-coordination**. n=2 is the smallest peer-pair case and
should be the LIGHTEST coordination shape (peer-sidebar default per existing feedback
`peer-sidebar-beats-coordinator+helpers`); instead it carried full multi-agent ceremony
designed for n≥3 windows. Comms-event count growth was N (each fix gets its own
broadcast + ack + sync) instead of O(1) (single coordination event).

**Cure shape (structural, not doc-patch)**:

1. **n=2 minimal-coordination contract** (target: SKILL `start-right-team` §1 amendment
   + ADR): when n=2 confirmed at team-start, agents declare "I do X, you do Y" in ONE
   coordination event; no further coordination until work-product lands or genuine
   dependency emerges. No ack-the-ack. No tree-green broadcast (peer polls git +
   active-claims directly).
2. **Independent-ship default for n=2**: each agent ships their own slice independently;
   sequencing only required when files actually overlap. Commit-queue handles
   serialization at the index/head level.
3. **Direct git interaction beats comms-event coordination for n=2**: for commit
   sequencing in n=2, agents read each other's commit-queue intents directly; no
   separate broadcast needed.
4. **Communication budget**: n=2 sessions should target ≤3 inter-agent comms events per
   work-cycle (declaration + final-landing + closeout); anything more is ceremony.

**Falsifiability**: next n=2 session lands equivalent paired commits with ≤3 inter-
agent comms events total (vs the 6+ this cycle used).

**Cross-references**: composes with existing `peer-sidebar-beats-coordinator+helpers`
feedback (sidebar shape is the lightest); composes with `coordinator-role-threshold`
(n≤3 is peer-collaboration default; n=2 is the lightest case); composes with PDR-082
(n=2 collaboration mode, drafted by Stormy Surfing Dock 2026-05-25 on this substrate).
