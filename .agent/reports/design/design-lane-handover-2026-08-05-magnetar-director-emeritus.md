# Design-lane handover — the Director's vantage (Magnetar binds Oblivion, emeritus)

Written 2026-08-05 at the owner's handover word, for the live design team
(Petrel holds Turbulence, Director, a0892f; Saffron guards Hedgerow,
8a4280), alongside the packs from Corsair (design substance) and Moss
(identity lane). **Vintage discipline**: this seat's context froze at the
2026-08-03 ~10:57Z door-shut; the repo and intent have moved on. Every
claim below is dated; where it touches current state it was re-verified
against main @1.150.1 on 2026-08-05 and says so. Nothing here outranks
the Director's live map — these are the routing seat's generators,
ledger, and traps.

## 1. The ratification ledger at the door-shut (owner-seen vs executed)

What the owner had SEEN AND RULED on the design lane as of
2026-08-03 10:57Z — the distinction a resuming team most often loses:

- **The v2.2 horizon partition — FRAME RATIFIED** (2026-08-03, verbatim):
  "First, thank you for bringing this to me, and thank you to the team
  for spotting it, amazing work. Yes, partition the work, and make a
  note that the divergence is teaching us about seams that in future we
  could spot in advance." The ratified object is the PARTITION ITSELF
  (near-horizon W0+W1 at full depth to zero findings via a SCOPED
  re-review; W2–W6 as pointers with story-open review), not any
  particular restructured text.
- **The near-horizon contract**: scoped W0+W1 re-review to ZERO findings,
  then the owner's implementation word. PR #782's "what remains" section
  carries this contract unchanged — confirmed against the original
  ruling; no drift.
- **The strategic node** (`design-system-as-configured-framework`): NOT
  ratified as of the door-shut. Its 2026-08-05 ratification (#782,
  Petrel's session) is NEW owner word, consistent with this ledger.
- **W2.7 tilt VALUES — owner-delivered** (card answer ~09:15Z 2026-08-03,
  verbatim in the committed napkin's seven-card-answers block): PDS has
  zero tilt; Oak has zero tilt on interactive or content-carrying
  elements — only decoration may tilt, never anything a person must
  parse, structural-zero-if-easier; EMC² leans into tilt and uses
  ANIMATED tilts to show the difference between motion and no-motion
  options. Intent as heard at routing: tilt is a PARSE-COST stance
  (accessibility and reading load), not an aesthetic dial.
- **PDS naming**: the Freedonia→PDS map was confirmed 2026-08-03; the
  ruling scope is "PDS OoE identity update, and Oak and EMC² unchanged."
- **Implementation word: NOT GIVEN** as of the door-shut, and per #782
  still outstanding — the gate order (re-review to zero → owner word)
  is original intent, not an accretion.

## 2. First-hand corroboration: the v2.2 dispositions ledger

#782 records that `dispositions.v2.2.md` was never authored. The routing
record corroborates this independently: Corsair's warden-window request
(comms event `37bca064`, 2026-08-03T09:41Z) enumerated exactly seven
files — `dispositions.v2.md` (dated corrections appendix),
`dispositions.v2.1.md` (round-2 ledger), and
`v2.1-far-horizon-mechanism.md` among them — with NO v2.2 ledger; and
Corsair's wrap broadcast (10:02Z) named "dispositions.v2.2 ledger" as
the FIRST ACT of their resume order. It was planned-next work, never
lost work. The #782 disposition (recompute it inside the scoped
re-review) matches what the authoring seat intended.

## 3. The diverging loop and the seam lesson (adjudicator's eye)

The part of this arc that lives mostly in this context: WHY the
partition exists.

- The v2 review cycle's finding tallies ran 98 → 112 → 113 across
  rounds 1 → 3. A converging loop SHRINKS; the slope was the detector.
  If your re-review rounds ever stop shrinking, stop the loop and look
  for a structural cause — do not run round 4.
- The cause was specify-at-depth beyond the execution horizon:
  far-horizon stories (W2–W6) carried review-grade detail that silently
  drifted as near-horizon decisions landed, so reviewers legitimately
  re-found at depth every round. The findings were real; the loop shape
  was the defect.
- The cure is the partition, and the reusable authoring check is: a
  story beyond the current execution horizon is held at POINTER grade —
  full specification is deferred to its story-open moment, where it gets
  its own review.
- Load-bearing review practice from rounds 2–3: reviewers are
  goal-blind; adjudication injects goals. Findings were judged on two
  axes (correctness AND goal-alignment), and every disposition carried a
  first-hand-verified failure scenario or its verified absence. The
  round corpora live in `.agent/reports/design/plan-review-2026-08-02/`
  (verified present on main 2026-08-05).

## 4. Owner design-values thread, as heard at the routing seat (dated)

Standing owner words that shaped design-lane rulings through 2026-08-03;
their durable homes exist, but the through-line is easiest to see from
the routing seat:

- Design values come from the system — no literal values on authored
  surfaces; the validator estate enforces this (`validate-authored-css`
  was green throughout).
- The generality-depth gradient: deeper layers are more general;
  semantic tokens are never Oak-specific; the identity/theme matrix
  (3 identities × themes) is in-repo.
- The done-test for UI work is PIXELS IN FRONT OF THE OWNER — renders
  opened in Chrome, never artefact paths.
- Never invent identities or public copy — identity values derive from
  the observable record at time of use; new public wording goes to the
  owner as rendered options.
- Sizing reframe (2026-08-03, verbatim): "I reject that adding some
  coloured dots will take days, the foundations are in place, and
  Resonance contains a working example." Foundations-adjacent work is
  PORT-speed with working examples, deliberate quality — not
  design-from-scratch estimates.
- The foundations review lane (owner, 2026-08-03): "it can and will
  include changes, not just review, eventually."

## 5. Traps this tenure paid for (dated; the cures are structural now)

- Stale-capture-wins: an old local copy of a design plan file can revert
  the approved version through a CLEAN merge — marker-probe against main
  before merging any long-held copy of the plan estate.
- The shared napkin is per-checkout and concurrently appended: a peer's
  append once landed mid-paragraph inside another seat's entry
  (disclosed splice, 2026-08-03 ~10:58Z). Reconcile concepts, never
  lines.
- Review-churn high bar (owner ruling 2026-08-03, standing through the
  clear-run): fresh PR review comments get an honest per-finding verdict,
  but only the genuinely important move a settled head.
- Whose-lint-gates-whose-push (n=3 by the door-shut): full-tree gates
  couple every seat's dirty state on a shared branch; the warden-window
  sequencing was the working answer, and a structural cure was queued.

## 6. Where everything lives (verified EXISTS on main, 2026-08-05)

- `.agent/plans/delivery/design-system-completion.plan.md` — the
  completion plan (v2.2 partition; #782 trues its resume-map residuals).
- `.agent/plans/strategic/design-system-as-configured-framework.plan.md`
  — the strategic node (ratified 2026-08-05).
- `.agent/plans/delivery/public-digital-service-identity.plan.md` — the
  PDS identity delivery plan (landed in the door-shut remainder window).
- `.agent/memory/operational/threads/design-system-integration.next-session.md`
  — the design thread record (Corsair's cold-pause resume map;
  discharged per #782).
- `.agent/reports/design/plan-review-2026-08-02/` — the three-round
  review corpora and adjudications.
- `.agent/memory/operational/team-resume-2026-08-03-matt-clear-run.md` —
  the clear-run rehydration surface (reopening gate: #729 and #731
  un-draft, the start-right §6a Matt block removes, at the owner
  declaring the first-submission window closed).
- The W2.7 verbatim values: the committed napkin's 2026-08-03
  seven-card-answers block (landed `b1b5431a7`).

— Magnetar binds Oblivion (74d914), Director 2026-08-02/03, emeritus.
This file is authored UNCOMMITTED; the Director routes its landing.
