---
name: A Real Observation That Does Not Bear on the Claim
polarity: anti-pattern
use_this_when: About to cite a first-hand observation as evidence for a config, mechanism, or state claim — especially when the surface you read reports a DERIVED value, or when the observation was made some time before the action it licenses
category: agent
proven_in: .agent/state/collaboration/comms/ (seven instances, four seats, 2026-08-05); conserved at .agent/memory/active/archive/napkin-2026-08-06.md (2026-08-05 entries)
proven_date: 2026-08-05
related_pattern: referent-narrowing
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Citing an observation that was run first-hand and reported accurately as evidence for a claim the observation cannot discriminate — the failure sits entirely in the step from output to claim, and is invisible precisely because the observation half was done well"
  stable: true
---

> **POLARITY: ANTI-PATTERN.** This entry names a *failure mode to avoid*, not a shape to repeat. The name is the diagnostic: when the failure mode is about to fire, recognising the shape is the first move in not repeating it.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern) for the polarity discipline.

## Principle

**A real observation, correctly made, that does not bear on the claim it is
offered for.**

Not fabrication. Not laziness. In every recorded instance the command was run
first-hand and the output was reported accurately. The failure is entirely in
the **step from output to claim**, and that step is invisible precisely because
the observation part was done well — which is what makes this distinct from
every other verification failure in the corpus.

The sharpest formulation, from the seat that made the error:

> "Running the command myself made it feel like observation when it was still
> interpretation. **First-hand is about whether the EVIDENCE SUPPORTS THE CLAIM,
> not about who ran the command.**"

## Why it fires on this estate specifically

Every recorded instance was a **config-state question asked of a system that
reports a DERIVED value**:

- An OAuth issuer is derived from `CANONICAL_HOST`-or-fallback, so reading
  `issuer` *via* the canonical host cannot distinguish a configured value from
  per-request self-derivation — both yield the same answer when you ask that way.
- A GitHub App installation token's `permissions` block is derived from a
  **user-shaped projection**, so it reports `pull:false` for a token that
  demonstrably reads the repo.
- A redirect chain is derived from config you cannot see.

In each case the surface faithfully reports something real that is **one
inference away** from the thing you actually wanted to know — and **the fallback
path is exactly what makes it ambiguous.** A system with no fallback gives an
unambiguous answer; a system that derives-or-defaults does not.

## The variants (2026-08-05, one afternoon, four seats)

Recorded as distinct shapes rather than repetitions, because the cures differ:

1. **Ambiguous surface.** The observation cannot discriminate between the two
   candidate causes: both produce the identical output.
2. **Shape versus behaviour.** A byte-identical redirect chain was offered as
   evidence that an upstream fault was unfixed; the chain's *shape* does not
   determine the behaviour the fault lived in.
3. **Wrong lens.** A field read correctly, from the correct API, that is not a
   report of the property being claimed (the user-style permissions projection
   above). The refutation was elegant: *the API call that returned `pull:false`
   was itself a successful authenticated read.*
4. **Unwarranted generalisation, past known disconfirming evidence.** A wall
   observed on one auth instance via one transport, generalised to a different
   instance and a different transport — and carried past a fact everyone already
   held (a closed beta was running, so the "users cannot connect" inference was
   already contradicted).
5. **Absence of evidence merged with evidence of absence.** Zero 5xx and zero
   error-log entries across 45 minutes (real, first-hand, defensible) published
   under the heading "INCIDENT CLOSED" alongside an unconfirmed peer report. The
   seat's own split is the lesson: *"my half establishes that we cannot SEE a
   server fault; theirs would establish that there ISN'T one."*
6. **The race — a true observation that decayed.** Not a logical gap: the
   observation **bore on the claim at the moment of reading** and had stopped
   being true by the moment of acting. A remote-ref read returned the previous
   commit; a push was in flight in a background task and landed between the read
   and the amend that relied on it.
7. **The unretrieved finding.** A correct finding *of your own*, still true,
   that you fail to retrieve while reasoning past it hours later. The failure is
   entirely in RETRIEVAL, so the cure cannot be "write it down better" — the
   record was durable and correctly written. Plausibly catchable only from
   outside, which is itself an argument that peer review is a structural cure
   here rather than a discipline.

## The cure has two arms — run the free one first

**ARM 1 (free — always try this first).**

> Before hunting for a discriminating test, ask whether anything you
> **ALREADY KNOW** contradicts the claim.

Why this arm is the one that gets skipped: an inference of this shape **arrives
dressed as a technical result**, so it is filed as *a finding to verify later*
rather than *a claim about the world to sanity-check now*. Variant 4 needed no
new evidence at all to refute — five capable seats walked past it, including one
holding the contradicting fact in its own working context.

**ARM 2 (cheap — when arm 1 finds nothing).**

> Find the input that makes the candidate causes **DIVERGE**, then vary it.
>
> Before citing an observation as evidence for a config fact, ask what the OTHER
> hypothesis would have produced. **If the answer is "the same output", you have
> not measured anything yet** — however faithfully you ran the command.

Worked instances of arm 2: asking via a *non-canonical* alias separates a
configured canonical host from self-derivation; sending a duplicate query
parameter reveals whether the upstream deduplicates.

**For the race (variant 6), two further cures — neither is a harder look:**

- Re-check the precondition **immediately before** the history-affecting action,
  not before the reasoning that leads to it. Ask *"has this been pushed — as of
  now, with nothing in flight that could change the answer?"*
- **Never read an in-flight background task's partial log as a completed
  result.** An empty section is evidence the task has not finished, not evidence
  the step did not run.

The generalisation worth carrying: **backgrounding a history-affecting operation
converts a check-then-act race from theoretical to routine**, because the whole
point of backgrounding is that the operation outlives the command that started
it. The platform's completion notification exists precisely so the gap need not
be guessed.

**For the unretrieved finding (variant 7):** when a later conclusion contradicts
something you established earlier, **the contradiction is the signal** — and
nobody is diffing your 16:15Z statement against your 18:06Z one except a reader
outside your context.

## Diagnostic tells

- The claim rests on a surface that *derives-or-defaults* rather than storing
  the property you are claiming.
- You are about to write "confirmed first-hand" about a field you read but did
  not interrogate the semantics of.
- The observation and the action are separated by anything asynchronous.
- The evidence is an **absence** (no errors, no 5xx, no log entries) and the
  claim is a **presence** (it works, it is healthy, it never broke).

## Authority is not evidence

In one afternoon three separate seats corrected a Director's assertion by
grounding it first-hand, and **all three times the grounding was right.** One of
those seats nearly withdrew a correct finding because a higher-authority seat
asserted the opposite with what looked like a stronger instrument — while the
decisive test was thirty seconds away and already queued.

The norm this establishes: a Director's stated fact is a **claim to check, not a
given**, and checking it costs the fleet nothing. Being corrected four times an
hour is cheaper than one wrong ask reaching the owner.

## THE FALSIFIER FIRED — 2026-08-21, and this pattern's own instruction is now binding

**This section is not an enrichment. It is the falsifier above being met.** The falsifier reads: *"If
a seat that has read this pattern still ships an instance on a surface whose ambiguity this pattern
explicitly names, then passive capture has failed for this class and it needs an action-time gate
rather than another written cure."*

**On 2026-08-21 that happened at least six times in one working day, across a Director seat, a liaison
seat and two implementer seats — every one of which had this discipline in its brief or had written
it into tracked state that same morning.** Two of the seats were, at the moment of failing, the
estate's most careful readers of this exact class.

The instances, each a true value answering a different question:

| Instrument | True statement | Question it was offered for |
| --- | --- | --- |
| `cf-ray` present | Cloudflare fronts this host | Is it OAK's Cloudflare? (a Clerk-operated worker also returns it) |
| A `COMMENTED` review row | A reviewer responded | Did a review happen? (body was a spend-limit skip notice) |
| `author=mantagen` on a PR | The owner's credential raised it | Is this ours or his? (every agent PR there uses it) |
| `reviewRequests: []` | The author is not in his own review list | Has anyone been asked to review? (GitHub *forbids* requesting the author — 422) |
| `author.id` on a comms event | Which routing identity wrote it | Which agent authored it? (F-164: seats inherit the Director's) |
| `latest-change-at` moved | The workspace recorded an attempt | Did state change? (Cloudflare rejected the PATCH atomically; nothing was written) |
| `branches/main/protection` 404 | There is no *classic* branch protection | What does main require? (rulesets carry it — an empty required set makes "nothing required is failing" vacuously true) |
| `git log --json merged` error | The flag does not exist | Is the PR merged? (returned a field list and **no answer**, which was nearly asserted as one) |

**Two of those deserve naming separately because their failure direction is worse than a wrong
belief.** The `branches/main/protection` 404 was the instrument *of a trigger deciding when to
interrupt the owner* — it would have reported the home repository stable with every check red.
And a **truncated control probe** (unpaginated `per_page=100` over 109 alerts) returned a figure that
*coincidentally matched*, converting an untested assumption into a confirmed one. **A truncated
control that agrees with you is worse than no control.**

**What actually caught them: the other seat, never the author.** Four were caught by a peer holding
the same records checking the author's claim; none was caught in self-review. That is the only
mitigation with an observed success rate, and it is not a written cure — it is a second reader with
the same doctrine and licence to refuse.

**Routing, per this pattern's own falsifier and [PDR-098](../../../practice-core/decision-records/PDR-098-doctrine-traction-firing-detection-response.md):**
this class is now **recurrence-despite-home with the falsifier met**. It goes to the doctrine-traction
mechanism lane as recurrence evidence — the action-time structural-interrupt design space — **not to
another paragraph here.** This section exists to make the firing legible and to stop the next
consolidation treating these as fresh instances of an un-cured class; the *cure* is a gate, and
designing it is deliberate work this entry does not attempt.

**Deferral honesty on that:** the gate is not designed here because designing an action-time interrupt
for "name what your instrument actually measured" is a design lane of its own (PDR-098's open
quadrant), and this pass's constraint was an owner instruction to consolidate rather than to open a
new design. **Falsifiable:** if a later pass finds this section grown by further instances with no
gate proposed, the deferral was wrong and the lane should have been opened here.

## Falsifier

If a seat that has read this pattern still ships an instance on a surface whose
ambiguity this pattern explicitly names, then passive capture has failed for
this class and it needs an action-time gate rather than another written cure —
route via [PDR-098](../../../practice-core/decision-records/PDR-098-doctrine-traction-firing-detection-response.md).

## Related

- [`referent-narrowing`](referent-narrowing.md) — the reading-instruments dual;
  this pattern is the claim-construction side.
- [`verify-dont-trust` § Name the Instrument](../../../rules/verify-dont-trust.md)
  — the action-moment rule surface.
- [`falsification-cost-determines-claim-quality`](falsification-cost-determines-claim-quality.md)
  — why these die in minutes when a check is in reach and survive for thirty
  minutes when it is not.
- [`passive-guidance-loses-to-artefact-gravity`](passive-guidance-loses-to-artefact-gravity.md)
  — the reason variant 7's cure cannot be another note.
