---
name: A Fact You Did Not Go Looking For Has No Source Until You Establish One
polarity: anti-pattern
use_this_when: About to use, relay, or record a fact that arrived incidentally — a broadcast under a shared identity, a process listing seen while debugging something else, a commit subject caught in passing, a log line from an unrelated command
category: agent
proven_in: .agent/state/collaboration/comms/ (2026-08-21, two instances, one liaison seat, both self-diagnosed)
proven_date: 2026-08-21
related_pattern: observation-that-does-not-bear-on-the-claim
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Supplying provenance from surrounding context for a fact that arrived through an incidental channel carrying none — and then relaying or recording it as established, sometimes attributed to the wrong author"
  stable: true
---

> **POLARITY: ANTI-PATTERN.** This entry names a failure mode to avoid. The
> diagnostic is the name: if you did not go looking for it, it has no source yet.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern).

## Principle

**A fact acquired deliberately arrives with its provenance attached** — you know
what you ran, against what, and when. **A fact acquired incidentally arrives with
none**, and the reader supplies it from surrounding context without noticing that
none was present.

**The supplied context is usually right, which is what makes the habit durable.**

## The two instances, both self-diagnosed by the same seat

**A broadcast comms event** arrived on a watcher carrying the Director's
`author.id` and `session_id_prefix`, because an implementer seat inherits its
Director's registry identity (defect F-164). It was read as a message *from* the
Director, and was one commit from being written into a durable seat brief as the
Director's observation. Its own first line said which seat wrote it — in prose,
which nothing obliges a reader to check.

**A peer seat's `git commit` seen in flight** while diagnosing an unrelated
`index.lock` contention. From a glimpsed commit subject the seat inferred that two
independent security reviews had reached the same conclusion — **and attributed
the inference to the Director as a finding.** Three steps (glimpse → inference →
attribution), none measured. The Director refused it: no such finding had been
made and neither report had been read.

## The dangerous case is the valuable-sounding one

Had the second instance stood, *"two independent seats converged"* would have been
**the strongest claim either security review could offer** — and it would have
reached the owner, in a security review, on his last day before nine days away,
with a glimpsed commit subject underneath it.

**The value of the claim and the flimsiness of its basis peaked together.** That
is the combination to watch for: **the more a finding would impress, the harder
its provenance should be checked.** When tested properly the convergence turned
out to be corroboration — one report cited the other, and both were preceded by a
third artefact — which is worth having and worth a fraction of what independence
would have been worth.

## Cure — a step before use, not a caution

**Before using an incidentally-acquired fact, name where it came from.** If you
cannot name it, it is a **prompt to go and measure**, not a datum.

Concretely, three questions that take seconds:

1. **Did I run something to learn this, or did it appear?**
2. **If it appeared: what channel, and does that channel carry authorship?** (A
   shared-identity broadcast does not. A process listing does not. A commit
   subject names a change, not a conclusion.)
3. **Am I about to attribute it to someone?** If so, ask them — attribution is
   the cheapest thing to verify and the most expensive to get wrong, because it
   lands in a durable record under someone else's name.

## Diagnostic tells

- The phrase *"I noticed while…"* or *"I happened to see…"* preceding a claim.
- A fact you cannot pair with a command you ran.
- An inference about what *another agent* concluded, drawn from an artefact that
  was not its report.
- Attributing a finding to a peer without having read the peer say it.

## Falsifier

If a seat runs the three questions and still relays an incidental fact as
established, the check belongs at the relay boundary rather than in the reader's
discipline — route via
[PDR-098](../../../practice-core/decision-records/PDR-098-doctrine-traction-firing-detection-response.md).

## Related

- [`surface-dont-adopt-a-live-peers-name`](surface-dont-adopt-a-live-peers-name.md)
  — the identity-collision sibling.
- [`observation-that-does-not-bear-on-the-claim`](observation-that-does-not-bear-on-the-claim.md)
  — there the instrument was run and misread; here nothing was run at all.
- [`landing-a-finding-is-not-holding-it`](landing-a-finding-is-not-holding-it.md)
  — the sibling failure in the opposite direction: a fact deliberately
  established and then not applied.
