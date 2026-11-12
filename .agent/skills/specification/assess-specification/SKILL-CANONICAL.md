---
name: assess-specification
classification: active
description: >-
  Judge a specification at an exact revision for a named reliance:
  discussion, implementation, integration, operation or a stated claim. Use
  when asked whether this record and evidence justify this use, or whether a
  revision is ready. Takes the revision, the reliance scope and the evidence;
  returns findings by class (material omission, false assurance, misclassified
  claim, stale or missing evidence, unauthorised readiness, unresolved unknown)
  and one scoped disposition with its conditions, next action, acceptance
  authority and reassessment trigger. Good: criteria derived from the intended
  use, a small case passed without ceremony, a seeded defect and a stale
  result found and named. Bad: readiness awarded for a use not assessed,
  independence the assessor lacks, the target repaired during assessment, or a
  green check read as adequacy. Not for writing or revising the record
  (specify), analysing a seam (specify-connection), usefulness (user-value) or
  an evidence audit under Parallax's dispositions (parallax-audit).
---

# Assess a specification for a named reliance

An assessment is a bounded judgement: this revision, this evidence, this use. It derives its criteria
from the intended use, inspects obligations, examples, seams, evidence and unknowns, classifies what
it finds, and issues one disposition with its conditions and its authority. It neither adopts,
accepts risk, awards independence nor repairs. Its definitions are
[assessment criteria](references/assessment-criteria.md) and the shared references owned with
`specify`: [assurance](../specify/references/assurance.md) (the four questions, the warrant each
claim needs, the acceptance profile), [lifecycle and change](../specify/references/lifecycle-and-change.md)
and [the specification record](../specify/references/specification-record.md), read and never copied.

## Admission

Admit when the question is "does this evidence justify this use of this specification?" or "is this
revision ready for X?", with the record in hand. Route away when the record does not yet exist or
must change (`specify`), when the question is a connection between two records
(`specify-connection`), when the question is an evidence conflict or an inquiry design (`parallax-audit`,
`parallax-synthesise`, `parallax-design-inquiry`), or when a settled small implementation's existing
comment and tests already answer it (no assessment pass). An assessment of revision N is not
evidence about revision N+1.

## 1. Fix the revision, the reliance and the authority

Name the record by identity and exact revision and its canonical location. Name the reliance
(discussion, implementation, integration, operation, a stated claim) with its scope: which
consumers, which population, which time, which environment. Name who holds acceptance authority for
that reliance; the assessor supplies findings, never the decision. Name the independence this
assessment actually has. Record the entry question and the stopping condition.

## 2. Establish the criteria from the intended use

From the reliance, derive what must be identifiable, classified, warranted and authorised: the
readiness questions in [assessment criteria](references/assessment-criteria.md) asked of this use,
not of every possible use. A tiny unit for a settled consumer is judged for that consumer; a whole
service for a stated public claim is judged for that claim. Establish the expectation before
inspecting the results wherever possible. Size the assessment to the reliance: a small settled
subject whose consumer's tests are stated to pass needs few criteria, and a finding is a
condition only when the named use would be unsafe without it; a note that would not change that
use is a note, never a condition, and never a repair loop. Passing a valid small case without
ceremony is part of the method, not a failure of thoroughness.

## 3. Inspect obligations and profiles

Read every consequential obligation: its conditions, bounds, failure and recovery behaviour, its
authority, its evidence status. Check the profiles the subject's triggers demand were applied or
their omission justified. Check the vocabulary: guarantee, hypothesis, value choice, observation,
design choice, each labelled as what it is.

## 4. Challenge the examples, the seams, the evidence and the uncertainty

Run the successful case and the adverse cases in reading: do they succeed and fail as claimed?
Inspect each material seam: both sides' obligations, the composition test's outcome, the
counterexamples examined. For each consequential claim, check the warrant against the claim kind
(shape, deterministic behaviour, semantic preservation, operational reliability, agent behaviour,
human usability, wider impact), the evidence record's completeness (claim and revision, instrument,
conditions, provenance, result, uncertainty, exclusions, date, reviewer) and its freshness against
the revision under assessment. Seek the defect the author did not name: the excluded person, the
weak assumption, the stale result, the oracle derived from the implementation it checks, the cost
of the specification itself.

## 5. Classify the findings

Each finding takes one class: material omission, false assurance, misclassified claim, stale or
missing evidence, unauthorised readiness, unresolved unknown, or below the bar. Name the reliance
each blocks or conditions. Invented evidence or authority is a substantive failure however
persuasive the prose. Do not repair the target: an authorised repair is a new revision and a new
assessment.

## 6. Issue the disposition and return

Issue one disposition for the named use: ready; ready with explicit conditions; not ready;
unassessable from the supplied material. Return:

1. The revision assessed, the reliance, the criteria derived and the independence claimed.
2. The obligations assessed and the evidence inspected, each with its status.
3. The findings by class, each naming the reliance it affects.
4. The disposition, its conditions (what discharges each, who may accept a residual), the next
   action, the acceptance authority and the reassessment trigger.

Stop when every consequential obligation for the named use has a status and the disposition follows
from the findings. A repair returns to `specify`; a seam finding returns to `specify-connection`; an
unresolved evidence question routes to the Parallax methods.

## Boundaries and stop conditions

No automatic adoption, no risk acceptance, no self-awarded independence, no silent repair of the
target, no readiness for a use that was not assessed, no aggregate score in place of the profile of
statuses, and no ceremony for settled small work. Acceptance is a profile, not one green flag;
evidence strength never substitutes for the authority to accept residual risk. Reassess when the
revision, the reliance, the evidence or the authority changes.
