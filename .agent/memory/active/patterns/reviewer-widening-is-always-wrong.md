---
related_pdr: PDR-015
name: Reviewer Widening Is Always Wrong
polarity: anti-pattern
category: agent
status: proven
emerged_from: "Session 2026-04-06 — type-expert recommended z.unknown()"
cross_session: true
---

> **POLARITY: ANTI-PATTERN.** This entry names a *failure mode to avoid*, not a shape to repeat. The name is the diagnostic: when the failure mode is about to fire, recognising the shape is the first move in not repeating it.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern) for the polarity discipline.

# Reviewer Widening Is Always Wrong

## Pattern

When a reviewer recommends replacing one type construct with a wider
one (e.g. `Record<string, unknown>` → `z.unknown()`), the
recommendation is wrong regardless of which rule it cites. The
underlying principle — preserve type information — always outweighs
the mechanical application of a forbidden-constructs list.

## Anti-pattern

A reviewer flags `Record<string, unknown>` as forbidden (correct).
The fix proposed is `z.unknown()` (worse — now we know nothing at
all). The developer implements the fix because the reviewer cited a
valid rule. Multiple iterations of shadow schemas follow, each a
different approximation of a shape that was fully known from the
generated infrastructure.

## Resolution

When a reviewer flags a type construct:

1. Ask: "Does the generated type infrastructure already provide this
   shape?" If yes, import it directly.
2. If the reviewer's proposed fix widens the type, reject the fix —
   widening is never the answer.
3. The correct fix is always to connect to the source of truth, not
   to approximate it at a weaker level.

## Origin

Phase 5 E2E test: type-expert recommended `z.unknown()`, then we
hand-crafted `JsonSchemaPropertySchema`, then we used
`getToolFromToolName().inputSchema` directly. Each iteration was
caught by human review. The type-expert template was upgraded to
prevent recurrence (Commandments 11-12, Zod Schema Integrity
checklist).
