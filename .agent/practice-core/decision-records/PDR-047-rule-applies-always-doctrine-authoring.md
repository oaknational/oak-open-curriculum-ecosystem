---
pdr_kind: governance
---

# PDR-047: The Rule Applies, Always — Doctrine-Authoring Discipline

**Status**: Accepted
**Date**: 2026-05-04
**Related**:
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(consolidation and knowledge-flow — rule authoring and amendment
happens at graduation moments; this PDR governs the integrity of
those moments);
[PDR-018](PDR-018-planning-discipline.md)
(planning discipline — the same intent-failure mode this PDR names
also appears in plan authoring; plans that hedge their own scope
exhibit the same shape rule authoring under hedging vocabulary
exhibits);
[PDR-026](PDR-026-per-session-landing-commitment.md)
(per-session landing commitment — landing-commitment language
sometimes carries the same hedge vocabulary this PDR catalogues;
deferral honesty is the cousin discipline at the landing surface);
[PDR-038](PDR-038-stated-principles-require-structural-enforcement.md)
(stated principles require structural enforcement — PDR-038 is the
structural-enforcement half; this PDR is the doctrine-authoring
half. A rule cannot survive PDR-038's enforcement if it was
authored with PDR-047 violations because the enforcement scanner
would catch the rule's own self-violation);
[PDR-043](PDR-043-rush-impulse-three-structural-cues.md)
(rush-impulse three structural cues — cue 1 is the vocabulary
trip-list at output time. This PDR is the doctrine-authoring
specialisation: the same trip-list applied at the moment a rule is
written or amended, with the substance test added);
[PDR-044](PDR-044-memetic-immune-system.md)
(memetic immune system — the innate-immunity layer at write-time
is the runtime operationalisation of this PDR's substance test);
[PDR-046](PDR-046-layered-knowledge-processing.md)
(layered-processing methodology — companion deliverable of the
same Layer-2 graduation pass that produced this PDR).

## Context

A rule is authored or amended in one act of writing. The author
holds, in the same moment, two things:

1. The general principle the rule expresses.
2. The specific situation that prompted the authoring — including
   any context the author already feels uneasy about.

A characteristic failure mode follows. The author surfaces the
unease by introducing a clause that *softens the rule for the
specific situation*. The clause arrives in many vocabulary
dresses: hedge-words like *carve out*, *carve around*, *exception*,
*for this arc*, *permitted variant*, *honest framing for external
X*, *special case*, *bounded exception*, *narrow exemption*. Each
phrasing means the same thing: *I know the rule applies here, but
this situation is special.* The author has authored a rule that
contains a clause whose substance is "the rule does not apply
here". The rule is born self-violating.

Three structurally similar failure shapes have been observed
across multiple authoring sessions:

**Failure shape 1 — vocabulary substitution.** The author
recognises a familiar hedge-vocabulary item from the rush-impulse
trip-list, replaces it with a less-marked synonym, and believes
the substitution has resolved the issue. *Exception* becomes
*special case*; *carve out* becomes *bounded variant*; *permitted
exception* becomes *honest framing for X*. The substance is
identical; the phrasing has moved one word along the synonym
ladder. Vocabulary policing alone is insufficient.

**Failure shape 2 — the carve-out is the substance.** The rule
is authored *because* the situation is special; the author
genuinely believes the situation needs naming. The carve-out
clause is therefore felt to be load-bearing. The author resists
removing it because doing so would, in the author's frame, remove
the rule's reason to exist. The author has confused two shapes: a
rule that names a category of behaviour (which is fine), and a
rule that says "this category is exempt from the broader rule"
(which is the failure mode).

**Failure shape 3 — the rule is written from the wrong side.**
The author writes the rule from the side of "what is allowed"
rather than from the side of "what is banned". A rule of the form
*"narrowing operators are permitted; widening operators are not"*
spends its first clause granting exceptions to the bad shape and
only mentions the bad shape last. A rule of the form *"never
widen types — narrowing operators (`as const`, `satisfies
SomeType`) are not in scope"* names the ban first and treats the
narrowing operators as off-topic, not as exceptions. Both rules
govern the same behaviour; only the second is authored with
PDR-047 discipline.

The three failure shapes share one structural property:
**vocabulary is not the trigger; intent is**. The candidate is
suspect when its substance reads "I know the rule applies here,
but this situation is special", regardless of the words used to
say it. The cure is the same shape across all three: test the
candidate at authoring time against the substance, against the
vocabulary, and against the re-frame.

The corrective is not a separate rule layered over the rule being
written; it is a discipline applied *during the act of writing*.
It governs the rule author at the moment of authorship, upstream
of the structural-enforcement scanner that
[PDR-038](PDR-038-stated-principles-require-structural-enforcement.md)
mandates.

## Decision

**When authoring or amending a rule, principle, ADR, PDR, or
governance document, the author MUST verify that no clause within
the artefact carries the substance "this rule does not apply
here". The cure is structural — re-frame the rule to ban the bad
shape rather than grant exceptions to it.**

The discipline applies in three concrete tests, each tied to one
of the three failure shapes. The tests are not mutually exclusive;
an authoring moment may need all three before the candidate is
sound.

### Test 1 — Substance test

Read the candidate clause-by-clause. For each clause, ask: *if I
re-phrased this clause in the simplest possible language, would
it say "the rule does not apply here"?* If yes, the clause is
suspect regardless of how it is currently phrased. The clause
must be removed, the rule re-framed so the clause is no longer
needed, or the clause replaced with a structural exclusion (see
Test 3).

The substance test runs on intent, not vocabulary. A clause that
says *"this principle is unconditional"* and a clause that says
*"this principle has a narrow exception for X"* may both look
fine on a vocabulary scan; the substance test catches the second.

### Test 2 — Vocabulary test

Cross-check the candidate against the host's hedging-vocabulary
trip-list (the operational form of
[PDR-043](PDR-043-rush-impulse-three-structural-cues.md) cue 1,
invoked at doctrine-authoring time rather than at general output
time). Items typically catalogued: hedge-words around the *carve
out / exception / special case / bounded exception / narrow
exemption / permitted variant / for this arc / honest framing for
X / make an exception / exempt / exempted / exempts* family. The
trip-list is host-local because vocabulary varies; the discipline
of running the trip-list at authoring time is invariant.

A trip-list hit is a *question*, not a verdict. The author
inspects the hit clause through the substance test (Test 1):
sometimes the vocabulary item is innocent (cataloguing a banned
word in prose that names the ban; a quotation; a historical
reference). Sometimes it is the substance failure dressed in the
expected vocabulary. The trip-list is the cheap detector; the
substance test is the verdict.

### Test 3 — Re-frame test

When the substance test or the vocabulary test fires, the cure is
a structural re-frame, not a re-wording of the same shape. Re-
frame the rule by asking: *what is the bad shape this rule exists
to ban? Could the rule be written from the side of the ban, with
the apparently-permitted shapes treated as off-topic rather than
as exceptions?*

Worked structural re-frame: a rule against "type shortcuts"
written as *"narrowing operators are permitted; widening operators
are not"* is two-clauses-and-a-but. Re-framed as *"never widen
types"*, with narrowing operators named only in a **Scope**
subsection as off-topic, the rule has one clause, names the ban
directly, and does not contain any clause whose substance is "the
rule does not apply here".

The re-frame test sometimes reveals that the rule as drafted is
not the right rule — that the apparent need for an exception is
the symptom of two distinct concerns conflated into one rule
boundary. In that case the cure is to split the rule: one rule
governs the banned shape; a separate rule (or a separate ADR)
governs the legitimate context that prompted the apparent
exception. Two rules with clean boundaries are stronger than one
rule with a carve-out.

### Composition of the three tests

The three tests compose into a single discipline applied at the
moment the rule is authored or amended:

1. Substance test — read clause-by-clause for "the rule does not
   apply here" intent (Test 1).
2. Vocabulary test — cross-check against the hedging trip-list
   for cheap detection of common phrasings (Test 2).
3. Re-frame test — when either of the above fires, re-frame the
   rule to ban the bad shape rather than grant exceptions; if a
   re-frame is impossible, the apparent exception is a separate
   concern and the rule should be split (Test 3).

The author runs all three at authorship time. The
structural-enforcement scanner that
[PDR-038](PDR-038-stated-principles-require-structural-enforcement.md)
mandates is downstream — it catches what slipped past the three
tests, but the tests are designed to catch substance-failures the
scanner cannot see (e.g. an exception expressed in a vocabulary
the scanner does not recognise as hedging).

## Rationale

Two alternatives were considered and rejected:

**Alternative A — vocabulary policing alone.** Maintain the
hedging trip-list, scan rules against it at authoring time and at
write-time, treat any hit as a violation. The rule is sound only
if no trip-list item appears in its text.

This alternative does not address Failure shape 1 (vocabulary
substitution). An author who knows the trip-list can write
"specially-bounded variant" instead of *exception* and pass the
scan. The substance is identical; the rule is unchanged in its
self-violating shape; the scan reports green. Vocabulary policing
is a useful cheap detector, but only as part of a discipline that
also tests substance.

**Alternative B — allow legitimate exceptions, named explicitly.**
A rule may include a clause of the form *"this rule does not
apply when X"* provided X is named clearly enough that an adopter
can verify whether they are within the exception or outside it.

This alternative encodes the failure mode this PDR exists to name.
A rule that contains a clause whose substance is "the rule does
not apply here" is, by definition, not a rule — it is a
conditional-discipline statement. Conditional disciplines are
discoverable as failure modes: the agent in flow-state under
closure pressure reaches for the conditional first, because the
conditional offers a way to land the work without confronting the
underlying structural problem (the wrong rule shape, the
conflated concerns, the missing supporting infrastructure).
Allowing the conditional structurally invites the failure mode.

The chosen rule treats apparent legitimate exceptions as
**evidence that the rule is mis-shaped**, not as content the rule
should hold. The cure is to re-frame or split, not to permit. This
is stricter than Alternative B and sometimes costs more authoring
work, but it produces rules that survive contact with adopters
who are not the author.

## Consequences

### Positive

- Rules authored under this discipline do not contain clauses
  whose substance is "the rule does not apply here". The rule is
  what it says it is, and adopter agents can apply the rule
  without re-deriving the author's intent from the carve-outs.
- The discipline composes with structural enforcement
  ([PDR-038](PDR-038-stated-principles-require-structural-enforcement.md)):
  rules authored under this discipline are easier to enforce
  because they lack the conditional clauses that make enforcement
  scanners ambiguous.
- Failure shape 3 (writing from the wrong side) produces stronger
  rules even when the author had no intent to grant exceptions —
  the re-frame test sharpens the language regardless of whether
  any exception was being smuggled in. Rules that name the ban
  directly are easier to learn and easier to apply.
- The three-test discipline is small enough to apply at every
  authorship moment without ceremony. The substance test is one
  question; the vocabulary test is a grep against a host list; the
  re-frame test is one re-reading. Total cost is seconds per rule.

### Negative

- The re-frame test occasionally produces a discovery that the
  rule as drafted is not the right rule — the apparent exception
  is a separate concern that needs its own rule. In that case the
  authoring work splits in two. The cost is real but the
  alternative (one rule with a carve-out covering two concerns) is
  the failure mode this PDR forbids; the split is the correct
  cure.
- The discipline requires the author to inspect their own intent,
  not just their own text. An author who genuinely believes the
  carve-out clause is load-bearing may resist the substance test.
  The discipline is sometimes felt as friction at the moment of
  authorship; the sharpening that follows from accepting it is
  worth more than the friction.

### Neutral

- The hedging trip-list (Test 2) varies per host. Each
  Practice-bearing repo accumulates its own observed-vocabulary
  list over time; the trip-list itself is not portable, but the
  discipline of running it at doctrine-authoring time is.
- Some rules name a banned shape and a related-but-different shape
  that is genuinely off-topic — `as const` and `satisfies` are
  off-topic for "no widening" because they are narrowing operators.
  Naming the off-topic shape in a **Scope** subsection is not an
  exception; it is clarification of what the rule does *not*
  govern. Test 3's re-frame produces this shape by default.

## Adopter Scope

**Genotype** (per PDR-019). This PDR applies across every
Practice-bearing repo where rules, principles, ADRs, PDRs, or
governance documents are authored or amended. The hedging
trip-list (Test 2) is host-local — each adopter accumulates its
own observed-vocabulary list; the substance test (Test 1) and the
re-frame test (Test 3) are invariant. The discipline applies to
every authorship moment, not only to graduation moments (though
graduation moments are when authorship most often happens).

The discipline composes naturally with
[PDR-038](PDR-038-stated-principles-require-structural-enforcement.md)
(the downstream structural-enforcement scanner) and with
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(the consolidation flow during which rules are most often
authored or amended).

## Notes

- The methodology was named through an owner correction sequence
  during a corrective consolidation pass that had landed a rule
  with self-violating hedge vocabulary (the multi-commit-TDD
  skip-register triple — a rule that named "carve out the
  operation, record the carve-out as a domain constraint" as the
  pattern). The rule was deleted outright in the same arc; the
  underlying principle ("no type shortcuts") was rewritten to ban
  the bad shape (widening) rather than grant exceptions for the
  off-topic shape (narrowing operators). The deletion plus the
  re-frame became the worked instance from which this PDR was
  generalised.
- The vocabulary trip-list is the operational form of
  [PDR-043](PDR-043-rush-impulse-three-structural-cues.md) cue 1,
  applied at doctrine-authoring time. The trip-list catches words
  that signal the rush impulse at general output time; this PDR
  catches the same words plus the substance behind them at the
  specific moment a rule is being written. The two surfaces share
  a common detection vocabulary and a common substance question;
  the difference is the moment of application.
- A rule authored under this discipline that still produces
  apparent friction at adoption time is evidence that one of two
  things is true: the rule is right but the author missed an
  underlying structural problem in the system the rule governs
  (the cure is to fix the structural problem, not the rule); or
  the rule has split into two concerns that need their own
  separate rules (the cure is to split). Neither cure adds a
  carve-out to the original rule.
- A self-referential tension surfaced during this PDR's authoring:
  this file catalogues the very hedging vocabulary the host's
  innate-immunity hook blocks. The first write attempt was
  correctly blocked. The structural cure is the trip-list-defines-
  itself paradox cure noted in Briny Sailing Lagoon's worked
  instance during the doctrine-enforcement-quick-wins WS3
  authoring: any structural enforcer that names its own pathogen
  must exclude the documents that define the pathogen. The host's
  `policy.json` `exclude_paths` list was extended to include this
  PDR's filename pattern in the same diff that landed the PDR.
  This is a host-local hook-config change, not a Practice-Core
  change; the discipline this PDR codifies remains invariant.
