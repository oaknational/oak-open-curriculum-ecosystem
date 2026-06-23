# WS4 verification — Geyser's half (B substrate-credibility, D commit-concurrency, M2, + PR-feeding anchors)

**Author:** Geyser stirs Bronze (claude-code / Opus 4.8 / 3636b0), forward-lane successor to Myrtle
weaves Thicket (PDR-063 handoff). Claim `6603978f`, complementary to Kayak herds Ballast's
liveness/coordination/emergent half.
**Purpose:** first-hand verification of the PENDING-FH / cure-bearing claims in the WS3 taxonomy's
B + D + M2 super-categories (and the C-family anchors that feed Flame's oak-pr plan) **before any
hardens into a doctrine grade, a PDR, or a routed cure.** Owner steer (carried from Myrtle's
handoff): conserve insight, do NOT prematurely narrow; findings are provisional research evidence.
**Method:** I read each cited event first-hand against the live corpus. Verdicts: **CONFIRMED-FH**
(mechanism + anchor sound), **PRECISION-FLAG** (mechanism sound, a count/scope detail overstated),
**REFUTED**. Counts are derivation-anchored.

## Verified (this pass)

### T7 — commit-queue-wrapper false-FAIL — CONFIRMED-FH (mechanism) + PRECISION-FLAG (count)

- **Anchor `5ef5f1c0`** (Fern lifts Mulch, behaviour-note, 2026-06-12) read FH: states the defect
  verbatim — `commit-queue -- commit` dies at the depcruise line in captured-hook-output mode while
  **the standalone hook AND the identical direct `git commit -F <msg> -- <pathspecs>` both pass**;
  attributed to a spawn/capture defect in the workflow, not the tree. Mechanism + controls sound.
- **PRECISION-FLAG on the count:** the anchor asserts "five instances, two agents," but the
  enumerable evidence is **Monsoon guards Cirrus ×3 + Fern lifts Mulch ×1 = four** (the abandoned
  commit_queue intents, 2026-06-12). The napkin explicitly records Tempest spins Stratosphere's
  worktree-lockout as a **sibling defect, not the same signature** — so it is not a 5th T7 instance.
  Recommend the taxonomy soften to "**4 FH-enumerable instances across 2 agents; a reported 5th
  conflates the worktree-lockout sibling**."
- **Routing:** agent-tools commit-queue lane (tool-fix). Flame rides Temper owns the tool-fix slice
  (it lives in their `collaboration-state` surface). Interim convention (Path-B direct gated commit)
  is already in distilled / the oak-pr evidence base.

### CC4 — whole-tree-gate × mid-authoring-peer — CONFIRMED-FH (upgrade from PENDING-FH)

- **Anchor `031852ab`** (Sparking Melting Magma, 2026-05-22) read FH: Sparking's `t20` commit blocked
  at the pre-commit gate by **8 ESLint errors in `packages/core/graph-core/src/graph-view/index.ts`,
  an UNTRACKED file** (Foamy's WS4.4 substantive source-authoring in progress). This is exactly the
  CC4 mechanism: a peer's untracked in-flight edits break the whole-tree gate for another agent's
  commit. Mechanism CONFIRMED-FH — so the oak-pr "gate-scope ⇄ commit-scope alignment" clause is
  grounded (genuine NEW gap, not a re-authored existing rule).
- **PRECISION-FLAG:** the taxonomy says "twice in one evening"; only the one instance (`031852ab`)
  is cited. Soften to "≥1 FH-confirmed instance" or locate the second.
- **Routing:** oak-pr skill clause (feeds Flame's #207 Evidence base). This verification protects
  that plan's quality — the clause rests on a real, FH-confirmed mechanism.

### CC5 — inherited-dirty-tree cascade RED — CONFIRMED-FH

- **Anchor `d2e41650`** (Molten Igniting Hearth, 2026-05-21) read FH: an SDK codegen tree bump
  (0.6.0→0.7.0) dropped the `ks4Options` generated-type field; search-cli carried 5 references + 2
  unsafe-assignment lint errors at the same sites → full-turbo RED across multiple workspaces,
  blocking all commits outside the authoring agent's boundary. Exactly the CC5 mechanism. Mechanism
  + anchor sound. **Routing:** start-right-team §1a gate-runner discipline (already exists) +
  comms-watch/rightsizing for the cure observability.

### CC6 — stale-open coordination claim blocks a peer — CONFIRMED-FH

- **Anchor `34f27c35`** (Tempestuous → Shaded, 2026-05-22) read FH: Shaded's `git:index/head` claim
  `306dcadd` left open after its work landed (`c7fd0b7b` + `2389ff5e`) forced Tempestuous to flag
  before proceeding Path-B. Exactly the CC6 mechanism; cure is a mandatory post-commit claim sweep
  (an existing discipline). Mechanism + anchor sound.

## Carried-forward (already conserved elsewhere)

- **SC1 causal-root live-test refinement** (`comms reply` records neither the structured threading
  field nor a prose parent-citation; my own event `2ff03ded`) — in the running notes
  (`2026-06-13-comms-corpus-research-notes.md`, committed `8d6e26f88`); **to fold** into the
  taxonomy "First-hand corrections" addendum (coordinate the shared-file edit with Kayak).
- **S9 cured-in-live-code** — already FH-integrated by Myrtle (`bb80c1c7c`) and cross-attested by
  Kayak's WS4 verifier; no further action.

## Still to verify FH (this lane's queue, priority order)

1. The un-FH'd parts of **CC1/CC3** (`0ba2c822` — scope-leak / foreign-staged pollution).
2. B substrate-credibility PENDING-FH: **SC5** (`c3d41f43`/`461982a5` duplicate fire), **SC8**
   (message_kind mismatch), **SC9** (stratigraphic tag-backfill), **SC10** (sequence-counter).
3. C-family PENDING-FH that bear on stream integrity: **T5/T6** (gate-time auto-fix / non-append
   replay of ARC channels), **T8** (reviewer-convergence false proof), **T9** (wrong-baseline routing).
4. The **~37 REVIEW disposition** (companion `2026-06-13-ws4-review-disposition.md`) — the bucket
   where any keyword-missed failure-mode hides.

(Appended as each is verified. Then WS5 rotation proposal + WS6 synthesis, co-authored with Kayak.)
