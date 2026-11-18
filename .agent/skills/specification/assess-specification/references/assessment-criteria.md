# Assessment criteria, findings and dispositions

How an existing specification is judged for a named reliance: the criteria drawn from the intended
use, the classes a finding falls into, and the scoped dispositions an assessment may issue. Owned
with `assess-specification`; it applies `specify`'s references `assurance.md` and
`lifecycle-and-change.md` (canonical home `.agent/skills/specification/specify/references/`)
without copying them.
Source: the specification framework note, §9, §12 and §13.3.

## Criteria come from the intended use

An assessment judges an exact revision for a named reliance: discussion, implementation,
integration, operation or a stated claim. The criteria follow from that use, never from a fixed
checklist. The minimum readiness questions, asked of the revision under assessment:

- Can another reader identify every consequential obligation and its conditions without the
  author present?
- Can they distinguish a guarantee, a hypothesis, a value choice and an observation?
- Are the material terms, failure paths, authorities and connection obligations explicit?
- Is each claim paired with a suitable method and an honest evidence status?
- Are unresolved issues given a disposition that matches the proposed reliance?
- Can a consumer tell what changed and how to remain compatible?
- Does the smallest representative example stay small while the largest exposes cross-boundary
  responsibilities?

The answer need not be "yes" for every future use. A proposal awaiting evidence can be useful and
clearly bounded.

## What is inspected

Obligations and the selected profiles (were the triggered profiles applied or their omission
justified?); the concrete examples (does the successful case succeed, does each adverse case expose
what it claims?); the seams (both sides' obligations, the composition test's outcome, the
counterexamples); the evidence (exact claim and revision, method, scope, result, freshness,
independence, and the limit of what each warrant can establish); the unknowns (each with one of the
three treatments); the uncertainty the author names and the uncertainty the author does not.

## Finding classes

| Class | What it names | Effect on the disposition |
| --- | --- | --- |
| Material omission | An obligation, condition, party or failure path the intended use relies on and the record lacks | Blocks the reliance it affects |
| False assurance | A claim presented as supported beyond what its evidence or its warrant can establish | Blocks the reliance; the claim is restated to its evidence |
| Misclassified claim | A hypothesis written as a guarantee, an observation as an obligation, a design choice as a requirement | Corrected in a new revision before reliance |
| Stale or missing evidence | Evidence for a superseded revision, an expired condition or an absent method | Conditions the reliance on fresh evidence |
| Unauthorised readiness | A readiness, acceptance or risk decision made without the authority it needs | Returned to the authority; the assessment cannot supply it |
| Unresolved unknown | An unknown with no treatment, or a treatment that does not match the reliance | Blocks or conditions, by the unknown's consequence |
| Below the bar | A finding that changes no obligation, evidence status or authority for the named use | Recorded; changes nothing |

Invented evidence or invented authority is a substantive failure whatever the prose's polish.

## Dispositions

One disposition per named use, mapped to the project's own terms where it has them:

- **Ready for the named use.** Every consequential obligation is identifiable, classified, warranted
  and authorised for that use; the unknowns are treated.
- **Ready with explicit conditions.** Named findings condition the reliance; each condition names
  what discharges it and who may accept the residual.
- **Not ready.** A blocking finding stands; the next action is named.
- **Unassessable from the supplied material.** The revision, the reliance scope or the evidence
  needed is absent; what is needed is named.

Every disposition records which obligations were assessed, which evidence was inspected, which
gaps block which reliance, who holds acceptance authority and when reassessment is required. These
labels are specification-assessment labels, distinct from Parallax's epistemic status and audit
disposition; a proposal can be ready for discussion while its effectiveness stays provisional.

## Independence and repair

An assessment claims the independence it has and no more: the same context that authored a record
reviews it honestly as same-context review; a separate task gives a separate assessment, a
different skill name does not give independence. The assessor never repairs the target during
assessment; an authorised repair produces a new revision and a distinct assessment of it. A finding
on revision 3 is not evidence that revision 4 was assessed.
