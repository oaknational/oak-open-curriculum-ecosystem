---
name: "Parse-Time Narrowing Is Destructive in Read-Modify-Write Transactions"
polarity: anti-pattern
use_this_when: "adding validation to a parse layer that feeds a read → transform → write-back transaction over a shared file, and rejecting, omitting, or normalising rows at parse looks like the clean cure"
category: code
layer: general
proven_in: "agent-tools/src/commit-queue/registry.ts"
proven_date: 2026-07-31
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "silently erasing other writers' rows through the write-back when parse-time strictness narrows data the transaction then persists"
  stable: true
---

> **POLARITY: ANTI-PATTERN.** This is a failure mode to avoid — the
> body names the failure shape, the in-the-moment diagnostic, and the
> corrective discipline.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern).

# Parse-Time Narrowing Is Destructive in Read-Modify-Write Transactions

## The Anti-Pattern

A shared registry file is updated through a transaction of the shape
parse → transform → write-back (`updateJsonFileWithRetry` and kin).
Validation pressure arrives ("rows must now carry field X"), and the
tempting cure is to tighten the shared parse layer so non-conforming
rows are dropped, defaulted, or normalised at parse.

That "validation" is a write. Every transaction re-serialises the
parsed model, so a parse layer that narrows DATA (not just types)
silently rewrites rows the caller never touched. In a multi-writer
registry the concrete failure is erasing another agent's rows: a
routine update by writer A permanently deletes writer B's legacy row
because A's parser refused to model it.

## Diagnostic

At the moment of adding strictness to any parser, ask: **does this
parser's output get written back?** If the parse function serves a
read-modify-write transform, any row-level omission or normalisation
is a destructive write, not a check. (Narrowing *types* at a
consumption boundary is a different, good move — see
[`boundary-narrowing-for-schema-types`](boundary-narrowing-for-schema-types.md);
the trap is narrowing *data* in a parse layer that persists.)

## The Corrective Discipline

Enforce by row class, at the right layer:

1. **Rows every live writer fully specifies, and that are
   short-lived** may fail loud at parse — with an error naming the
   offending row and the recovery path, and only after a census
   proves the live data vacuously satisfies the new rule.
2. **Long-lived rows owned by other writers** are preserved
   byte-identical through parse (spread, don't reconstruct);
   enforcement moves to the single use site (comparator, ownership
   check), where a non-conforming row resolves loudly at use instead
   of being rewritten at rest.
3. **Prove the preservation contract over the real transaction** — a
   smoke/integration proof that a legacy row survives a no-op
   transform byte-identical, mutation-probed so the destructive shape
   actually reddens it; plus schema-boundary proofs so the JSON-schema
   overlay and the runtime parser cannot drift apart with tests green.

## Worked Instance

The PDR-076a commit-queue identity cure (PR 674, 2026-07-31): the
first design omitted invalid `agent_id` blocks from claim rows at
parse — caught in pre-execution review as destructive through
`updateRegistry`'s write-back. The landed split: intents parse-time
strict via the canonical write schema (census: zero id-less intents
across the live registry and 11 historical versions), claims
preserved verbatim with enforcement at `sameAgentRoutingKey`
("an id-less identity is never the same live agent"), and the
`commit-queue-registry.smoke.ts` proof
`provePreservesLegacyIdlessClaimThroughWrite` guarding the contract.
