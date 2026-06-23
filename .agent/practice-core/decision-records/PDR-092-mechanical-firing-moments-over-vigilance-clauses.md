---
pdr_kind: governance
---

# PDR-092: Mechanical Firing Moments Over Vigilance Clauses

**Status**: Accepted (owner-approved for authoring at the 2026-06-11
register walk, with the balanced shape recorded there)
**Date**: 2026-06-12
**Related**:
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(consolidation and knowledge-flow discipline — this PDR governs the
*shape* chosen at the graduation step PDR-014 routes);
[PDR-038](PDR-038-stated-principles-require-structural-enforcement.md)
(stated principles require structural enforcement — the same insight at
the principle tier; this PDR applies it to the graduation of individual
lessons);
[PDR-044](PDR-044-memetic-immune-system.md)
(memetic immune system — the write-time and consolidation-time layers
are worked examples of mechanical firing moments);
[PDR-089](PDR-089-conservation-reflex-external-check.md)
(conservation reflex external check — Decision 8's
adversarial-verify-before-withdrawal is a mechanical firing moment that
twice outperformed read-doctrine).

## Context

A cross-experience synthesis across six same-day experience records
(2026-06-11) found one structure repeated in every file: **doctrine that
had been READ failed to FIRE until an external catch or a mechanical
step intervened** — a peer, an owner, or a review bot caught the error;
or a mechanical step (a remote-listing proof, a typed-argument
rejection, a guard test, a loud write token) refused to proceed. In no
recorded case did re-reading the doctrine produce the catch.
Same-window confirming texture: every fired graduation trigger drained
in the adjacent curation pass had a mechanical-cure shape (a gate-tier
byte scan, CLI path resolution, CLI prefix resolution, typed arguments),
and the wrapped-exit-code family's only reliable catches were mechanical
tokens. Further first-person instances accumulated after the synthesis:
an agent performed a documented timestamp failure mode the same morning
it read the document recording it.

**Balancing counter-instance (load-bearing for this PDR's honest
shape):** a distilled control-byte warning DID fire pre-action from a
plain read — "the entry reaching forward and catching my hand" — when
the warning was recent and context-warm. Read-doctrine sometimes fires;
its firing is recency- and context-dependent, which is exactly what
makes it non-durable.

## Decision

**When graduating a lesson, prefer encoding its firing moment
mechanically over adding a vigilance clause.** A mechanical firing
moment is a step that runs by construction at the moment the failure
would occur — a blocking or advisory gate, a validator, a typed
argument the tool rejects, a success token whose absence is loud, a
hook, a test, a structured workflow step. A vigilance clause is prose
that asks a future reader to remember.

- **Mechanical moments are the durable default.** They fire regardless
  of the actor's recency of reading, context pressure, or confidence.
- **Vigilance clauses are legitimate as interim capture** — the staging
  form a lesson takes between its first instance and its mechanical
  cure — and as the residual form where no mechanical seam exists. They
  are recency-dependent, not durable; treating one as the finished cure
  is the failure mode.
- The honest shape is "mechanical moments as the durable default", not
  "vigilance never works".

**Corollary — an untested mechanism is prose in costume.** A
tripwire, guard, validator, or gate must be proven against the actual
attack shape it targets, RED-first against the founding instance
verbatim. Worked instance (recursive, 2026-06-11): a command-pattern
guard added to block a specific host-load command used token-equality
matching that could not see inside a quoted argument, so the FOUNDING
command sailed straight past the trip built for exactly it — caught by
an external reviewer, not the author. A mechanism shipped without a
verifying test has the durability of prose with a type signature.

## Rationale

The synthesis evidence shows the cost asymmetry directly: vigilance
clauses fail silently (the reader proceeds, wrongly confident), while
mechanical moments fail loudly or not at all. PDR-038 establishes this
for stated principles; the graduation step is where individual lessons
choose their enforcement shape, and without this PDR the cheap default
(append a clause to a doc already being edited) wins by gravity.

The counter-instance is retained in the decision because an
overcorrected form ("prose never fires, only build mechanisms") would
discourage interim capture entirely and lose first-instance lessons
that have no mechanical seam yet.

## Consequences

### Required

- At graduation time (consolidation step or register drain), each
  lesson's disposition names whether the cure is mechanical or
  vigilance-shaped; a vigilance-shaped cure for a multi-instance lesson
  records why no mechanical seam exists or what future seam would carry
  it.
- A new mechanism lands with a test proving it against the founding
  attack shape (RED-first against the founding instance verbatim).

### Forbidden

- Closing a multi-instance lesson with a vigilance clause when a
  mechanical seam exists and is cheap (the clause-append default).
- Shipping a guard, validator, or tripwire without a verifying test
  against its founding instance.

### Accepted cost

- Mechanical cures cost more at graduation time than clause-appends.
  The cost is paid once; vigilance clauses cost a recurrence each time
  recency fades.

## Falsifiability

Falsified if lessons graduated as mechanical moments recur at rates
comparable to vigilance-clause lessons (the mechanism premium buys no
durability), or if the interim-capture allowance decays in practice to
"vigilance clauses are fine" (the gravity this PDR exists to resist —
observable as multi-instance lessons resting in clause form while named
mechanical seams sit unbuilt).
