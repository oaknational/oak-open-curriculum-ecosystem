---
name: "Relayed Findings Carry the Inference, Not the Observation"
polarity: anti-pattern
use_this_when: "Recording a measurement for another seat, or acting on a finding you did not measure yourself — especially one that has already passed through two or more seats and reads as settled."
category: process
proven_in: "2026-08-19 director session — five instances in one working day (MCP-497, get_project.domains, MCP-618 option (a), ALLOWED_HOSTS/MCP-307, MCP-634's own cure)"
proven_date: 2026-08-19
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "A true observation packaged with a conclusion; the conclusion travels as if it were the measurement, survives every re-reading because the observation is true, and is acted on long after it stopped holding."
  stable: true
---

> **POLARITY: ANTI-PATTERN.** This names a failure shape to avoid. The cure is
> the recording discipline in §What to do instead.

# Relayed Findings Carry the Inference, Not the Observation

## The shape

A seat measures something true, draws a conclusion from it, and records **both in one
sentence**. Downstream seats read the sentence, check that the measurement sounds right —
it *is* right — and adopt the conclusion. The conclusion is never re-tested, because the
part that would trigger scepticism is the part that is sound.

The observation is durable. **The inference decays**, because it depends on conditions the
sentence does not carry.

This is distinct from [`verify-before-propagating`](verify-before-propagating.md), which
governs *unverified* claims. Here the claim is verified. It is the reasoning welded to it
that fails, and welding is what makes it survive review.

## The worked instance that cost the most

`MCP-307` recorded:

> `ALLOWED_HOSTS` is already plural and does not depend on `CANONICAL_HOST`, so the app can
> answer on the new host with no code change — this is what makes blue/green cheap.

Both stated properties are **true**. The conclusion is **false**: plural does not mean the
new host is *in* the list, and it was not. The sentence passed through three seats
unchallenged over two days, and shaped a migration plan, because every seat that checked it
found the facts correct.

It was caught only by probing the host, which returned the application's own
`403 Forbidden: host not allowed`.

## Four more, same day, different surfaces

| Finding as recorded | What was true | What was inferred and wrong |
| --- | --- | --- |
| "754 failures, 15 users, clients cannot connect at all" | the failure count | that anyone was blocked — the same users had thousands of successful calls |
| "`mcp.…` is absent from `get_project(...).domains`" | the absence | that the domain was unregistered — the field is not an inventory, and is unstable between identical calls |
| "read country from Clerk metadata" | the field exists | that it would satisfy the requirement — it leaves MCP-first users blank |
| "add the host to `ALLOWED_HOSTS`" (written from an error message) | the error text | the cure — setting the variable *replaces* a derived list and would 403 the working hosts |

The last was authored by the seat that had spent the day naming this generator in others.
**Recognising the shape does not confer immunity**; only the recording discipline does.

## What to do instead

**Record the observation. Stop. Put the inference in a separate sentence, marked as
yours.**

```text
BAD   ALLOWED_HOSTS is plural and independent of CANONICAL_HOST, so the app can
      answer on the new host with no code change.

GOOD  MEASURED: ALLOWED_HOSTS is plural and independent of CANONICAL_HOST.
      INFERRED (unverified): this may mean the new host is already accepted —
      probe the host before relying on it.
```

The split does the work, because a reader who sees `INFERRED` re-tests it, and a reader who
sees one fused sentence does not.

Three supporting moves:

- **When acting on a relayed finding, ask what would be observed if the conclusion were
  false**, then observe that. The cost is usually one request.
- **An absence is never evidence until a presence has been shown through the same
  instrument** — the control-probe discipline of
  [`prove-the-checker-with-a-negative-control`](prove-the-checker-with-a-negative-control.md),
  applied to findings rather than checkers.
- **A failure signal is not evidence of harm until the success side has been queried.**
  Both halves of a surface, or neither.

Its nearest sibling is [`referent-narrowing`](referent-narrowing.md), which governs reading
an instrument's signal for more than it reports. This entry governs the *transmission* step
that follows: what a seat writes down for the next seat, and which half of the sentence
survives the conditions it was written under.

## Its sibling: assertions must cover what should NOT have changed

The same session produced a paired defect in *checking*. Three separate cases confirmed the
intended change while being blind to the collateral: an uptime monitor pointed at the origin
behind the edge, quality gates that cannot see the signed-in flow, and an allow-list edit
whose obvious check would pass while production was down.

**A change to a shared allow-list, a routing rule, or a credential scope needs an assertion
covering the surfaces that were already working**, not only the one being added. See
[`verification-method-must-answer-the-question`](verification-method-must-answer-the-question.md)
for the general form.

## Why it recurs

Fusing observation and inference is *good writing*. It reads as insight rather than raw
data, and a bare measurement feels like withheld work. The estate's own records are full of
the fused form because the fused form is more useful — right up to the moment the conditions
move.

So the cure cannot be "be more careful". It is a **recording convention**, applied when the
finding is written, by the seat best placed to know which half is which.
