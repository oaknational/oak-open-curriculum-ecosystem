# Continuation — Geyser stirs Bronze forward lane (comms-corpus WS4+) — safe pause 2026-06-13

**Self-contained pickup record** (handoff-messages-self-contained). Lane = the non-write-up
forward tasks handed from Myrtle (PDR-063 record `2026-06-13-ws3-handoff-myrtle-to-geyser-stirs-bronze.md`).
**Status: SAFE PAUSE** (owner-directed). Identity: Geyser stirs Bronze / claude-code / Opus 4.8 /
session `3636b0` / id `b0237a81-...`. Branch `feat/comms-research` (fully pushed at pause).

## OWNER STEER (carried from Myrtle's handoff — read first)

Conserve insight; do **NOT** prematurely narrow conclusions; the findings are **provisional
research evidence, NOT ratified doctrine**. Every cure routes through the plan-body
first-principles check + a named consumer plan before it hardens.

## Done this session (all crash-safe: committed + pushed unless noted)

- **Spine re-derived FH, independently** (my own script `/tmp/geyser-stirs-bronze-sc1-verify.js`,
  schema's real field names, 5,150 events @ 08:42Z): narrative 4058 / directed 1092 / lifecycle 0;
  `in_response_to`/`in_reply_to`/`audience`/`addressed_to` = 0/0/0/0; 0 unparseable; citation
  115/1,842 resolve. SC1 + the citation correction are now **quadruple-attested** (Myrtle FH +
  Katydid FH + R1 verifier + me); Kayak's reassessment cross-attests the same numbers.
- **Three corrections validated by Myrtle + integrated into the committed taxonomy** (`bb80c1c7c`,
  pushed): **S9** watcher addressee-filter reclassified *cured-in-live-code* (`comms-relevant-events.ts`
  returns `observed` for cross-traffic; routing withdrawn → what-worked); **SC1 causal-root**
  upgraded inferred→evidenced; **M2** "~105-beat/~60×" quantifier softened to FH-pending (family
  stays FH-solid).
- **SC1 causal-root SHARPENED via live test** (running notes; **not yet folded into the taxonomy
  addendum** — next step): `comms reply --to-event-id` exists but writes neither the structured
  threading field nor a prose parent-citation (proven by my own reply event `2ff03ded`). Precise
  root: `in_response_to`=0 because no authoring path records linkage, *including the dedicated reply
  command*. Cleaner cure: make `comms reply` record the link.
- **PR task converged** (owner: develop + coordinate with Flame): NOT forking. Flame's
  `pr-merge-readiness-discipline.plan.md` (oak-pr; origin/main via #205; WS3 evidence integrated in
  open #207) is the **decision home**; my `pull-request-best-practice-and-rules.md` is the **evidence
  companion**. Owner-directed back-link added (committed `51e8e15ee`, pushed). Flame owns the T7
  commit-queue-wrapper tool-fix slice.
- **All findings conserved** in `2026-06-13-comms-corpus-research-notes.md` (committed + pushed this pause).

## Next steps (priority order) — resume here

1. **FH-verify the PENDING-FH anchors** before any hardens to doctrine. START with **T7** (`5ef5f1c0`,
   commit-queue-wrapper false-FAIL) + **CC4** (`031852ab`, whole-tree-gate × mid-authoring-peer) —
   they feed Flame's oak-pr new-gap clauses. Then S7/S8/SC5/SC8–SC10/T5/T6/T8/T9/CC5/CC6/C1/I1/X1/R1.
2. **Hand-dispose the ~37 REVIEW events** (ledger `2026-06-13-ws3-disposition-ledger.md`) into a
   companion `2026-06-13-ws4-review-disposition.md`. Myrtle relinquished the WS3 claim, so the ledger
   is editable, but a companion keeps provenance clean.
3. **Fold the SC1 live-test refinement** into the taxonomy's "First-hand corrections" addendum
   (conserve-don't-narrow).
4. **Review Flame's #207** Evidence base for faithful integration; reconcile via comms, never fork.
5. **Co-author WS5** (rotation strategy → put to owner; NO deletion in research) **+ WS6** (synthesis)
   with **Kayak herds Ballast** (Katydid's successor; owns the liveness/coordination/emergent WS4 half).

## Load-bearing open items (owner-relevant)

- **One-decision-home shape** (Flame's plan + my evidence doc) awaits owner confirmation — Flame and I
  both flagged it for ratification of which is canonical.
- **Branch divergence:** `feat/comms-research` is 23 commits behind origin/main; the oak-pr back-link
  target lives on origin/main (forward-correct, dangling-until-merge). Whoever reconciles should know.
- **189 untracked comms events** (Kayak's finding): the WS5/WS7 deletion precondition — "no untracked
  event lost" — is **NOT currently met**. Load-bearing for the rotation strategy.

## Pointers

- Plan: `.agent/plans/agent-tooling/active/comms-corpus-research-and-rotation-strategy.plan.md`
- Running notes (canonical capture): `2026-06-13-comms-corpus-research-notes.md`
- WS3 taxonomy + deep-dives (Myrtle): `2026-06-13-ws3-failure-mode-taxonomy.md`, `-deep-dives.md`
- PDR-063 handoff (Myrtle→Geyser): `2026-06-13-ws3-handoff-myrtle-to-geyser-stirs-bronze.md`
- Kayak reassessment: `2026-06-13-ws-critical-reassessment-kayak.md`
- ArcAngel channel: `.agent/collaboration/rapid-comms/2026-06-13-katydid-myrtle.md`
- Thread record: `.agent/memory/operational/threads/agent-collaboration-research.next-session.md` (Kayak's boundary)
