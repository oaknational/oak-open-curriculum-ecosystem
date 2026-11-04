---
name: specify-connection
classification: active
description: >-
  Determine whether two specified things can be relied on together: parties,
  components, representations or claims joined by a dependency, a
  transformation, a delegation, a support link or a causal contribution. Use
  when endpoints are individually defined and the question is what travels
  across their connection (data, meaning, effects, authority, warrant), whether
  the provider's guarantees satisfy the consumer's assumptions in the shared
  context, and what new obligations the composition creates. Good: both sides'
  obligations stated, the seam's counterexamples found, a missing obligation
  returned to its authoritative endpoint. Bad: local correctness read as
  system correctness, schema validity read as preserved meaning, an endpoint's
  authority rewritten in passing, or every trivial edge modelled. Not for
  defining an endpoint's own obligations (specify), judging readiness for a
  use (assess-specification), an inference between scales (parallax-frame's
  bridge claims) or usefulness (user-value).
---

# Specify what a connection can carry

Two things each specified correctly can still fail together. This skill takes identified endpoints,
a proposed relation, the relevant contracts and versions and the intended reliance, and returns a
seam contract: both parties' obligations, a compatibility argument, the counterexamples that would
break it, the evidence missing, and the endpoints the finding affects. Its definitions are
[the connection method](references/connection-method.md) (relations and their contracts, the seam
record, the composition test) and the shared references owned with `specify`
([the specification record](../specify/references/specification-record.md),
[assurance](../specify/references/assurance.md)), read and never copied.

## Admission

Admit when the question is "can these individually defined things work together?" with the
endpoints identified. Route away when an endpoint's own obligations are the question (`specify`),
when existing evidence must be judged for a named use (`assess-specification`), when the inference
crosses scales or conceptual bases (the Parallax bridge and crosswalk claims), or when the edge is
trivial and uncontested (a sentence in the endpoint's record suffices; no requirement to model every
edge). A return to `specify` names a concrete missing obligation at the endpoint that owns it;
"needs more detail" never bounces.

## 1. Fix the endpoints and the relation

Name each endpoint by identity and exact revision and the authoritative source of its contract.
Name the relation from the table (depends on or composes with, transforms or represents,
authorises or delegates, supports or challenges, contributes to an outcome, motivates, refines,
allocates, supersedes or corrects) and the intended reliance: what the consumer will do on the
strength of this connection, at which scale, for which population and time. Record the entry
question and the stopping condition.

## 2. State both parties' obligations

Write what the producer supplies (its guarantees, under which conditions, with which failure
behaviour) and what the consumer assumes and requires. Draw both from the endpoints' own records;
where an endpoint's record is silent, the silence is a finding, not an inference. Never rewrite an
endpoint's authority here: a missing obligation is returned to the endpoint that owns it.

## 3. Run the composition test

Compare supplied guarantees with required assumptions in the shared operating context: implication,
satisfiability and reachability. A guarantee that holds only under impossible assumptions is vacuous;
a cyclic reliance needs a justified initial condition or a joint argument. Then inspect what the
composition introduces: retries and duplicate effects, shared capacity, latency budgets, concurrency
and ordering, partial failure, cancellation, inconsistent versions, permission propagation,
correlated failure, recovery. For a human service, make the concrete responsibility and delivery
argument: a receiving party, its capacity and a usable route.

## 4. Inspect meaning, effects, authority, failure and change

For a transformation, name what is preserved (meaning, identity, units), what loss is permitted, the
rejection conditions and the source and target versions; a schema-valid output is not a semantically
equivalent one. For a delegation, name the grantor's authority, the subject, action, purpose, scope,
expiry, revocation and enforcement point; a reference or an access right confers no other power.
For a support link, name the exact claim, the evidence, the inference rule, its independence and its
validity limits. For a causal contribution, name the mechanism, alternatives, exposure, conditions
and evaluation. For every relation, name failure and recovery on both sides and the change triggers
that reopen the seam.

## 5. Find the counterexamples

Write the concrete cases in which each side is individually valid and the pair fails: the retry that
duplicates an effect, the mapping that keeps the shape and loses the unit, the permission that
propagates one hop too far, the version pair that never met, the three-party cycle no pairwise check
sees. A seam without a counterexample it survives has not been tested.

## 6. Return

Return:

1. The seam contract in the consequential seam record's form: relation, endpoints and revisions,
   purpose, producer and consumer obligations, preservation or permitted effects, authority, failure
   and recovery, evidence, change triggers.
2. The compatibility argument and its status (holds, holds under named conditions, fails, or
   undecidable from the supplied material).
3. The counterexamples examined and their outcome.
4. The evidence missing, with the warrant each claim needs.
5. The affected endpoints and the concrete obligation returned to each.

Stop when the intended reliance is either supported by the argument, blocked by a named finding,
or bounded by a named unknown with its treatment. Hand the seam's readiness for a use to
`assess-specification`; hand a scale-crossing inference to `parallax-frame`; hand a repaired endpoint
obligation to `specify`.

## Boundaries and stop conditions

No silent rewrite of an endpoint's authority. No inference from local correctness to system
correctness, from schema validity to preserved meaning, from a completed interaction to a causal
effect, or from a reference to a power. No modelling of every trivial edge, and no new value model
or need register: the seam references the records that own its facts. The seam is reopened when
either endpoint's revision, the shared context, the authority or the intended reliance changes.
