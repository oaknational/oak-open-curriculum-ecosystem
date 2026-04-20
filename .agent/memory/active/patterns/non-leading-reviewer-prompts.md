---
related_pdr: PDR-012
name: "Non-Leading Reviewer Prompts"
category: agent
status: proven
discovered: 2026-04-17
proven_in: "Sentry maximisation pivot — two reviewer rounds on related questions produced qualitatively different finding surfaces: leading prompts narrowed findings; non-leading prompts widened them"
---

# Non-Leading Reviewer Prompts

Reviewer prompts that pre-suppose the answer narrow the finding
surface. To widen it, pose open questions, not suggestive ones, and
give enough context to ground the reviewer without pointing at the
conclusion.

## Pattern

A reviewer prompt has three jobs:

1. **Ground the reviewer** with enough self-contained context that
   they can read the artefact cold.
2. **Frame the review lens** for their specialism (assumptions,
   architecture, Sentry-specific accuracy, test discipline, etc.).
3. **Pose open questions** that let the reviewer tell us what they
   see, not agree with what we already believe.

The third job is the hard one. A prompt like "does the proposed
approach look sound?" invites the reviewer to validate or reject the
proposal on its own terms — which assumes the framing itself is
right. A prompt like "what do you see?" invites the reviewer to tell
us what the framing missed.

Additionally:

- **Word-cap the response** (400–600 words typical) to force
  concreteness.
- **Name the artefact location precisely** (file paths, line numbers)
  and instruct the reviewer to read before framing their answer.
- **Ask for cited findings**, not summaries.
- **Explicitly disclaim pre-commitment**: "No prescription, no
  recommendation, no prompt-suggested answer."

## Anti-Pattern

Prompts that embed the conclusion:

- "Is the proposed metrics surface sound?" — pre-supposes the
  proposal is roughly right; reviewer will confirm or tweak.
- "Review this for ADR-078 compliance." — pre-supposes ADR-078 is the
  relevant lens; reviewer won't catch ADR-154 violations.
- "Has the delegates extraction been specced correctly?" —
  pre-supposes extraction is the right shape; reviewer won't
  challenge whether extraction should happen.

Symptoms that the prompt was leading: reviewer returns "CONCERNS but
not blocking", finding count is low, all findings cluster on a narrow
dimension.

## Evidence

**Sentry pivot (2026-04-17)** — First reviewer round (four
specialists, intent-check on the initial EXP-A proposal) used
prompts that pre-supposed the metrics surface was the target.
Findings were tactical corrections to the proposed surface; no
reviewer questioned whether metrics was the right framing. Second
round (seven specialists, non-leading prompts after the plan and
prompt were written) produced ~25 distinct factual/structural
findings, 11 owner questions, and three precedent-incompatible calls
(ADR-143 amendment convention, delegates-seam divergence, L-7 script
partitioning). Same plan, same scope, dramatically different
finding surface.

## When to Apply

- Any specialist reviewer invocation where the framing itself might
  be wrong.
- Any reviewer round where the same reviewer has already reviewed
  adjacent work — the prompt must not cite the previous framing as
  authoritative.
- When pair-running leading and non-leading prompts to detect
  framing bias.

## Complementary Patterns

- `review-intentions-not-just-code.md` — what to review.
- `ground-before-framing.md` — the reviewer cannot catch framing
  errors if the prompter hasn't grounded first.
- `route-reviewers-by-abstraction-layer.md` — pairing reviewers to
  catch disjoint classes of finding.
