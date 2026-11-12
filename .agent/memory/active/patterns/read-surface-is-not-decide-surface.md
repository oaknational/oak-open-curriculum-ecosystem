---
name: The Surface You Read Is Not the Surface That Decides
polarity: anti-pattern
use_this_when: About to act on a proxy reading — a client tool's verdict, a parsed/derived view, a validation environment, a liveness signal, a downstream approval — in place of the surface that actually decides the outcome
category: process
layer: general
proven_in: >-
  Six first-hand faces, 2026-07-16..23: tsx/vitest-vs-node-dist (44 latent
  extensionless imports); mid-churn gate reads vs decision-moment reads;
  heartbeat emitters vs main loops (incl. the suspended-harness generator,
  3 instances 2026-07-20/21); awk column-parse vs per-check JSON verdicts
  (the #437-behind-red specimen); gh client-side merge refusal vs the REST
  authority layer (false-RED — #458/#460); ratification layers
  (constraint-ratified ≠ goal-formed ≠ authorised-to-build, MCP-63)
proven_date: 2026-07-23
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Acting on a proxy surface that has silently diverged from the deciding surface — shipping code validated under a different resolver, merging on a mangled parse, trusting an emitter for a dead loop, accepting a client refusal the authority layer would permit, or building on downstream greens that never covered the upstream grant"
  stable: true
---

> **POLARITY: ANTI-PATTERN.** The failure shape is proxy-for-authority
> substitution. The cures are the paired positive moves below.
> Instrument-grain sibling:
> [`verification-method-must-answer-the-question`](verification-method-must-answer-the-question.md)
> (there the INSTRUMENT answers the wrong question; here the SURFACE
> read is not the surface that decides — the awk-parse instance belongs
> to both).

## Failure shape

A proxy or adjacent surface is read in place of the authoritative one,
and the two diverge silently. The divergence is invisible until the
deciding surface is exercised — and it surprises in BOTH directions:

- **Validation ≠ execution**: 44 extensionless relative imports sat
  latent for months because every consumer (tsx, vitest) resolved
  bundler-style; the first node-dist consumer aborted module linking
  estate-wide. Corollary: "rebuild the dist" reproduces a defect that
  lives in the emitted specifiers — diagnose the emission before
  prescribing the rebuild.
- **Read-moment ≠ decide-moment**: a PR gate read mid-analysis-churn is
  a transient, not a verdict; the doctrine that binds the merge moment
  binds the alarm moment. (Same face: a merge slot granted on a
  momentary clean read, 21 seconds before a review wave landed.)
- **Emitter ≠ loop**: heartbeat loops run in the platform's
  background-task layer, independent of the reasoning loop — a
  suspended or stalled seat heartbeats indefinitely. Liveness reads
  from work-evidence and substantive response, never emitter presence.
- **Parsed view ≠ source verdict**: an `awk` column-parse of check
  output mangled a red verdict into a merge (the #437 specimen);
  per-check verdicts are read BY NAME from structured state at the
  decision moment.
- **Client policy ≠ authority layer (false-RED)**: `gh pr merge`
  refused CLIENT-SIDE (reading mergeStateStatus, suggesting flags)
  where the authoritative REST endpoint permitted the merge under the
  bot's bypass. The split surprised in the opposite direction and was
  the CURE — so the discriminating question must be asked on refusals
  too, before accepting them.
- **Downstream green ≠ upstream grant**: authorisation is layered —
  constraint-ratified ≠ ticket-defined ≠ goal-formed ≠ routed ≠
  authorised-to-build. A whole chain read the downstream greens as
  covering the goal-formation gap; the owner's planning word was the
  deciding surface and no instrument pointed at it. Rigour is not
  authorisation.

## Cures

- **Name the deciding surface before acting**: ask *"which surface
  actually decides this outcome, and which am I reading?"* If they
  differ, read the deciding surface, at the deciding moment, in its
  authoritative form (structured state by name, the real runtime, the
  API layer, the owner's word).
- **On a refusal, read the authority layer before accepting it** — a
  client tool's no is a proxy reading too.
- **For liveness, weight substantive response and work-evidence over
  any autonomous signal.**
- **For authority, cite the upstream grant explicitly** (the owner's
  planning word for a build lane) rather than inferring it from
  downstream greens.
