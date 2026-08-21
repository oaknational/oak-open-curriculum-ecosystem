---
name: Landing a Finding Is Not Holding It
polarity: anti-pattern
use_this_when: Designing an artefact — a test, a trigger, a scoping rule, a query, a brief — shortly after landing a finding that constrains it; especially when you are the person who landed the finding
category: agent
proven_in: .agent/memory/operational/threads/mcp-submission-drive.next-session.md (2026-08-21; two seats, two instances, within one hour)
proven_date: 2026-08-21
related_pattern: observation-that-does-not-bear-on-the-claim
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Recording a finding as knowledge rather than carrying it as a constraint, so the next artefact is designed from the pre-finding model — by the very seat that landed the finding"
  stable: true
---

> **POLARITY: ANTI-PATTERN.** This entry names a failure mode to avoid. It is
> distinct from every instrument-misreading class: here nothing misled anyone.
> The fact was already measured, written down and relayed.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern).

## Principle

**A finding recorded is not a finding held.** Writing it down feels like
completion, so the next design proceeds from the model that existed *before* the
finding — and the author is often the person who landed it.

Nobody is misled. There is no bad instrument, no stale record, no relay error.
**The fact is known, correct, and available, and it simply does not bind the next
artefact.**

## The two instances, one hour apart, two seats

**A Director** measured and landed the finding that **GitHub refuses to add a
pull request's author as its reviewer** (HTTP 422) — so in the two foreign repos,
where every agent PR is raised under the owner's credential, the owner can never
appear in `reviewRequests`. **It then proposed a stability test scoped to "PRs
authored by this fleet"** — which depends on authorship discriminating in exactly
the two repositories where it had just proved it cannot.

**A liaison seat** measured a repo-wide intermittent check failure on a foreign
repo and reported it to the owner. **It then wrote a stability test requiring
zero failing checks** — which the existence of that failure defeats.

Both seats were, at the moment of the failure, the estate's most careful readers
of the fact they violated.

## Why attention is not the missing thing

Recording a finding discharges the *capture* obligation and feels like the end of
the work. What it does not do is enumerate what the finding **forbids** — and a
finding's operational value is precisely the options it removes.

So the finding sits in the record as an *item*, while the next design is drawn
from the mental model that produced the need for the finding in the first place.
**More care does not fix this, because care was not absent.**

## Cure — a step, not an exhortation

**After landing a finding, write down what it FORBIDS**, then check the next
artefact against that list. Two lines is enough:

```text
Finding:  GitHub refuses to add a PR's author as its reviewer (422).
Forbids:  any scheme that identifies our PRs by author in OWA / Cloud-Config;
          any expectation that the owner's review-requested filter can contain them.
```

**And the mitigation with an observed success rate is adversarial peer review by
someone holding the same findings.** In both instances the *other* seat caught
it; **neither seat caught its own.** A peer with the same records and standing
licence to refuse is doing work no amount of self-review replaced.

## Diagnostic tells

- You are designing something within an hour of landing a finding about it.
- You can state the finding fluently and have not stated its prohibitions.
- The new design's key discriminator is the field, filter or property the finding
  was about.
- A peer's objection makes you say *"yes, I know — I wrote that"*.

## Falsifier

If seats begin writing forbids-lists and still ship designs violating their own
recent findings, the written step is insufficient and the cure belongs in the
review boundary — a design does not pass without a named check against the
session's own findings. Route via
[PDR-098](../../../practice-core/decision-records/PDR-098-doctrine-traction-firing-detection-response.md).

## Related

- [`observation-that-does-not-bear-on-the-claim`](observation-that-does-not-bear-on-the-claim.md)
  — where an instrument misleads; here nothing does.
- [`ruling-is-authoritative-about-intent-not-code`](ruling-is-authoritative-about-intent-not-code.md)
  — the third way a known fact fails to bind: authority over-extended.
- [`passive-guidance-loses-to-artefact-gravity`](passive-guidance-loses-to-artefact-gravity.md)
  — why the cure is a step in the flow rather than another note.
