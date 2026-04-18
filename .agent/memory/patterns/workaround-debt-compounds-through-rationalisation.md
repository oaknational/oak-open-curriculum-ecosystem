---
related_pdr: PDR-017
name: "Workaround Debt Compounds Through Rationalisation"
use_this_when: "A workaround exists in the codebase and someone is explaining why it's justified, necessary, or acceptable — especially when the explanation invokes 'different purposes' or 'separate concerns'"
category: architecture
proven_in: "packages/sdks/oak-curriculum-sdk — triple schema representation (JSON Schema + validation Zod + registration Zod) rationalised as 'different purposes' when all three described the same input contract"
proven_date: 2026-04-05
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Workarounds that acquire justification narratives become permanent architecture, compounding with each other"
  stable: true
---

# Workaround Debt Compounds Through Rationalisation

## Problem

A workaround is introduced for a legitimate reason (library limitation,
time pressure, incomplete understanding). Over time, the workaround
acquires a justification narrative: "it serves a different purpose",
"the two representations have different concerns", "it's intentional
divergence". The narrative transforms the workaround from temporary
debt into accepted architecture. New code is then built on top of the
workaround, creating compound debt.

## The Compounding Mechanism

1. **Workaround introduced**: "The SDK doesn't honour `.meta()`, so we
   override `tools/list`."
2. **Removal condition met but not checked**: The SDK upgrades and now
   honours `.meta()`. Nobody re-checks.
3. **New code builds on the workaround**: Registration uses
   `server.registerTool()` instead of `registerAppTool()` because the
   override already handles metadata.
4. **Rationalisation**: "We have separate schemas for different
   purposes — JSON Schema for the protocol, Zod for validation, Zod
   for registration."
5. **Compound failure**: The widget doesn't render because no single
   workaround is the root cause — it's the interaction of three
   rationalised workarounds.

## Pattern

When you find yourself explaining why parallel representations or
workarounds are justified:

1. **Ask "what is the single source of truth?"** If the answer is "both
   are sources of truth", one of them shouldn't exist.
2. **Re-check removal conditions.** The condition may already be met.
3. **Trace the dependency chain.** What other code exists only because
   this workaround exists?
4. **Treat divergence as a bug, not a feature.** "Different purposes"
   is often a rationalisation for "we haven't reconciled these yet."

## Anti-Pattern

"The JSON Schema and Zod schema serve different purposes — one is for
the protocol, one is for registration." This framing normalises having
two hand-maintained representations of the same contract. When they
diverge, the divergence is documented rather than fixed. When a third
representation is added, it feels natural rather than alarming.

## The Resolution

Delete the workaround. Make the canonical representation the single
source. Derive other formats from it. If derivation isn't possible
today, add a structural equivalence test and a deletion target date.
