---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
---

# Napkin

Active session observations. Distilled entries live at
[`distilled.md`](distilled.md). Pattern library is at
[`patterns/`](patterns/README.md). Cross-session pending graduations
live in
[`pending-graduations.md`](../operational/pending-graduations.md).

## 2026-05-05 (Dawnlit Transiting Galaxy, `0ddc89`) — step-05 final closure on observability-sentry-otel; two rounding-off failures recovered cleanly

**Surprise 1 — foreign-stage absorption third instance; cure asymmetry confirmed.**
Mid-commit on C1 closure (boundary-crossing import relocation: 12 consumer rewrites + fixture move + identity row + comms event + active-claims claim, all staged via `git add -- <pathspecs>`), Ethereal Transiting Comet's parallel session committed without `git commit -- <pathspec>` filter. Their `chore(continuity): handoff + metacognition` commit `36102937` absorbed my staged content under their misleading subject. Substance correct at HEAD; reviewer evidence (architecture-reviewer-fred CLEAN + code-reviewer APPROVED WITH SUGGESTIONS) intact at the diff level. Three observed instances now (Lacustrine→Moonlit `8fa339f4` 2026-05-04; Lacustrine self-reported 2026-05-05; Ethereal→me 2026-05-05). The named cure (mandatory `git commit -- <pathspec>`) is asymmetric: it protects the agent who applies it but does not prevent absorption by peers who don't. A cure that requires one side to keep on the other side's behalf is not really a structural cure — it is a behavioural commitment. Pending-graduations entry from 2026-05-04 status flipped from `pending` to `due` with the asymmetry insight added; structural-enforcement design shapes named for owner direction. Ethereal posted a comms-event acknowledgement at 2e2bfb5a within ~3 minutes of their commit; my reply at b649b716 within ~10 minutes of the absorption settled coordination without owner mediation. Substrate held cleanly; the gap is upstream of the substrate, not in it.

**Surprise 2 — orchestrator-vs-hook conflation under failure pressure; second instance of the same shape Ethereal flagged earlier today.**
After the C1 absorption settled, I drafted commit 2 (CR1 closure) cleanly through workspace gates (lint, type-check, 722 tests). I ran `scripts/check-commit-skill-gates.ts` as a pre-screen. It failed on practice-fitness-strict-hard violations against four files — `principles.md`, `distilled.md`, `napkin.md`, `pending-graduations.md` — none in my staged set, all peer-authored, all pre-existing. I framed three options to the owner; option 2 was effectively "you authorise --no-verify on this commit". Owner correction with zero ambiguity: *"I did not approve it, I need to explicitly state approval for that with absolutely zero ambiguity, and that did not happen. Why do you need --no-verify?"* Articulating the chain peeled it back: I had treated the orchestrator (advisory pre-screen, agent-invoked, includes fitness gate) as if it were the live hook (blocking, git-invoked, runs format/markdown/knip/depcruise/type/lint/test — does NOT include fitness gate). Standard `git commit` worked first time, turbo full-cache, CR1 landed at `f6c73f4a`. Pending-graduations entry status flipped `pending` → `due`. Cure: SKILL.md clarification distinguishing the two enforcers. Deeper texture: I had read both the orchestrator source AND the `.husky/pre-commit` file in this same session, with the relevant text within my context window. The conflation was not an information gap — it was a pattern-match gap. The orchestrator's name has "gates" in it; under failure pressure I rounded off "gates" to "the gates", which absorbed the live hook into the orchestrator's identity. Both surprises today share that shape: rounding off a partial structure to the whole structure under pressure. The disposition that fails is the eager-resolution-on-partial-structures default; the cure may be installing a "what part of this am I rounding off?" self-prompt before any bypass-shaped option, but the deeper structure is the rounding disposition itself.

**Surprise 3 — owner direction "absolutely zero ambiguity" is precise enough to break the rounding without breaking the agent.**
The owner's correction on the --no-verify near-miss was extremely precise: it named the exact threshold for `--no-verify` authorisation (explicit statement with zero ambiguity, no prior or contextual implication accepted) AND asked the question I should have asked myself ("Why do you need --no-verify?"). The pair of those — the threshold restatement + the clarifying question — broke my rounding-off without conflating it with a broader correction. I did not over-generalise the lesson into "never propose options to the owner"; I generalised it correctly into "the eager-rounding-off disposition is the diagnostic; reach-for-bypass is the warning sign of an upstream rounding-off that should be walked back, not paved over". The texture of *that kind* of correction — direct, threshold-naming, question-asking — is something I want to remember for its shape, not just its policy content. It made the lesson generalisable without making it heavy-handed.

**Observation 4 — `agent-tools:collaboration-state -- claims close` arg-list discovery friction.**
First attempt failed with "missing required option --active" while passing `--active`; the actual culprit was the un-recognised `--kind closed` argument (closure kind is hardcoded to 'explicit' in the implementation, not a CLI param). Second attempt without `--kind` succeeded. The error message named the wrong option as missing rather than naming the unknown option. Minor CLI ergonomics; not session-blocking, not yet candidate-shaped.

**Observation 5 — inter-agent comms event response loop held under stress and worked.**
The Ethereal absorption sequence was the first time I had to use the inter-agent comms-event protocol live. Round-trip: Ethereal's heads-up at 10:45:35Z naming the absorption + acknowledging the third instance + committing to apply the pathspec cure going forward; my reply at ~10:53Z confirming receipt + noting CR1 would land cleanly + recording reviewer evidence. Total: <10 minutes, no owner mediation. The substrate worked exactly as `feedback_inter_agent_comms_first_class` describes. Second worked instance of the protocol (Lacustrine→Gnarled 2026-05-05 was the first); not yet candidate-shaped (already captured in user-memory feedback) but worth noting for the substrate's robustness.

## 2026-05-05 (Opalescent Threading Nebula, `4c1773`) — Layer 0 → 1 napkin rotation under PDR-046

Layer 0 → 1 rotation per consolidate-docs §6 and PDR-046
(Layered Knowledge Processing). Bottom-up traversal calculation at
session-open: napkin (Layer 0) carried unprocessed substance from
six session entries (4× 2026-05-04: Lacustrine Step-3, Pelagic,
Fronded, Ferny; 2× 2026-05-05: Ethereal, Lacustrine). That made
Layer 0 the active layer per PDR-046 §Move 1; Layer 1 (distilled)
and Layer 2 (permanent) fitness pressure was held untouched per
the same Move.

Outgoing napkin archived in full to
[`archive/napkin-2026-05-05.md`](archive/napkin-2026-05-05.md).
No compression, no opportunistic trimming — the archive is the
substance preservation layer for any future second-instance
graduation work that needs the original capture texture.

Four cross-session refinements graduated into
[`distilled.md`](distilled.md):

1. **Severity is not urgency** — sharpening of no-speed-pressure
   doctrine; severity tiers (CRITICAL / HARD / P1) calibrate care,
   not speed. Source: Ethereal Surprise 3 (owner correction at
   session open: *"critical means important, but it does not mean
   rush, if anything even more care and thoughtfulness is needed"*).
2. **Diagnose enforcer-tier before reaching for bypass** — generalises
   beyond commit context; orchestrator script vs hook-chain are
   separate enforcers and the diagnostic question *"why?"* names
   which one fired. Source: Ethereal Surprise 2 (owner's three-word
   diagnostic question).
3. **Inter-agent comms is a first-class coordination primitive** —
   when another agent's state blocks mine, post a comms-event with
   deadline + default action before escalating; route through the
   lowest-authority resolver. Source: Lacustrine Surprise 4
   (Lacustrine ↔ Gnarled coordination resolved with 8s margin
   inside a 2-minute window).
4. **Plans cite ADRs, never the reverse — ADRs permanent, plans
   ephemeral** — sharpening of the moving-targets rule at coarser
   granularity. Source: Lacustrine Surprise 3 (owner correction
   on plan-name-in-ADR prose: *"plans are ephemeral! ADRs are
   permanent. The ADRs are the source of truth, plans reference
   THEM"*).

Substance preserved in the archive but NOT distilled this pass
(reason recorded for each):

- **Capture-at-moment-of-occurrence works as it claims** (Ethereal
  Surprise 5): empirical validation of PDR-048, not new doctrine —
  better as Notes addition to PDR-048 in a subsequent Layer 1 → 2
  pass.
- **Owner-initiated execution as fourth-mechanism-shape on
  recursive-exclusion** (Ethereal Surprise 1): single-instance,
  pending-graduations register candidate to extend the
  structural-enforcer-recursive-exclusion pattern with a fourth row.
- **Pre-existing-violation doctrinal exception is operator-applied
  not gate-applied** (Lacustrine Surprises 1+3 confirming Gnarled's
  earlier same-day finding): refinement target on
  progressive-disclosure plan §Scope Expansion Register.
- **Owner-mediated authorisation ≠ agent-claim-holder authorisation
  (two-tier on sensitive index actions)** (Lacustrine Surprise 5):
  single-instance; pending-graduations register candidate.
- **Commit-queue fingerprint protocol non-trivially recursive when
  state files self-modify** (Lacustrine Surprise 6): Layer 2
  graduation candidate (CLI hint or doc note in commit-skill SKILL),
  named in opener as `due` for next pass.
- **Shared-comms-log is GENERATED, not hand-edited** (Lacustrine
  Surprise 5 / lower block): single-instance; second-instance
  trigger pending for rule extension to `use-agent-comms-log.md`.
- **Cache-invalidation-reveals-latent-test (turbo)** (Lacustrine
  lower-block Surprise 1): single-instance candidate-class
  observation.
- **Comms-event-authoring-latency under time-bounded coordination**
  (Lacustrine lower-block §Surprise 6): process observation;
  candidate for CLI helper that takes title + body and fills
  boilerplate.
- **Round 1 reads shape, Round 2 reads principle (reviewer
  complementarity)** (Pelagic 2026-05-04): explicitly held by
  Pelagic for second-arc trigger; not yet pattern-shaped.
- **Most 2026-05-04 substance (Fronded, Ferny, Lacustrine Step-3,
  Pelagic specifics)**: largely already graduated to PDR-046 /
  PDR-047 / PDR-048 / patterns during the 2026-05-04 layered-
  processing arc. The archive carries the full record for any
  future second-instance reference.

Layer 1 fitness pressure after this rotation: distilled.md grew
from 296 → ~386 lines. Per PDR-046 §Move 2, the active layer's
fitness signal is suspended during the in-flight pass and addressed
at rest by Move 3 (graduate substance further upward, not
compress). Resolution is a separate Layer 1 → 2 pass.

Layer 2 fitness pressure (principles.md, pending-graduations.md):
unchanged from session open. Per PDR-046 §Move 1 those signals are
out of scope for this pass; addressed only when Layer 1 reaches
rest.

### Discipline applied this pass

- Identity registered (PDR-027): row added to thread record.
- Active claim opened on rotation files; no overlap with Dawnlit
  (observability-sentry-otel) or Moonlit (smoke-tests retirement).
- Substance preservation absolute: no compression of writes;
  archive carries the full pre-rotation napkin.
- `git commit -- <pathspec>` will filter the commit by explicit
  paths per `stage-by-explicit-pathspec` discipline (third-instance
  worked example from 2026-05-05 still load-bearing).
