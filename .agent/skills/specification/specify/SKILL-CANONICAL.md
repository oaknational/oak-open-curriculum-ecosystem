---
name: specify
classification: active
description: >-
  Define, repair or revise a bounded specification of a named subject: what it
  must do, preserve or permit, under which conditions, on whose authority, with
  what evidence. Use when a service, product, API, component, data set, agent
  behaviour or exploratory project needs its obligations and permitted
  variation made precise, or when a change to one must be traced through the
  records that rely on it. Good: one concrete case and its adverse cases, then
  observable obligations with their conditions, failure behaviour and evidence
  plan, sized to the subject. Bad: a template stack for a tiny unit, a promise
  written as a hypothesis or a hypothesis written as a promise, or a large
  service context copied into every dependency. Not for deciding whether
  something is useful (user-value), whether two specified things work together
  (specify-connection), whether evidence justifies a use (assess-specification),
  scheduling delivery (plan) or implementing a settled contract (engineering
  methods).
---

# Specify a subject's obligations and permitted variation

A specification is an attributable, versioned account of what an intended subject must do, preserve
or permit, and what stays free, under stated conditions. This skill writes one, repairs one or revises
one. It reads existing representations before adding anything, sizes the record to the subject, keeps
claim kinds distinct, and returns a bounded record with its correspondence, its unresolved issues and
the handoffs it has earned. The definitions it uses live in four references and are read, never
copied: [the specification record](references/specification-record.md) (vocabulary, coordinates, the
common record, the grammar of an obligation, the treatment of an unknown),
[profiles](references/profiles.md), [lifecycle and change](references/lifecycle-and-change.md) and
[assurance](references/assurance.md). Conformance is not usefulness: `user-value` says what a
consumer could use a provision to accomplish; this skill makes the provision's commitments precise;
`specify-connection` asks whether reliance survives interaction; `assess-specification` judges
adequacy for a named reliance. No stage certifies the next.

## Admission

Admit on the requested operation and the artefact's condition, not on the words "specification",
"contract" or "requirement". The question is "what must this thing do, preserve or permit?" or "this
claim or condition changed; what does it alter?". Route away when the question is really who could
use it and why (`user-value`), whether two things can be relied on together (`specify-connection`),
whether existing evidence justifies a use (`assess-specification`), how to deliver a selected change
(`plan`), or a settled small implementation whose existing comment and tests already say what it does
(no specification pass; the engineering workflow). A return from another skill names a new fact or an
unresolved obligation; "needs more detail" never bounces between two skills.

## 1. Frame the subject, the mode and the intended reliance

Name the subject and its kind, the operation (create, repair or revise), the intended use of the
output (discussion, implementation, integration, operation, a stated claim) and the authority asking.
Take the inputs the contract requires: scope and purpose, intended use, and the available
authoritative material. Distinguish a new hypothesis from an adopted obligation before writing
either. Record the entry question and the stopping condition of this run.

- **Create** starts from the smallest sufficient record.
- **Repair** preserves identifiers and accounts for every piece of existing material as retained,
  split, merged or retired.
- **Revise** starts from a changed claim or condition, traces the reliance it affects and records
  semantic, behavioural, authority and evidence compatibility
  ([lifecycle and change](references/lifecycle-and-change.md) §The change procedure). Updating a
  date is not a revision.

## 2. Inspect the existing representations

Read what already specifies the subject: an interface definition, a schema, code and its tests, a
comment, prose, a generated view, a value model. Each concern has one authoritative home; the record
links to it and never becomes a second authority for a schema or a code contract. Identify each
existing statement's kind (observation, hypothesis, design choice, adopted obligation, implemented
behaviour, assessed conformance) and its status. Existing scope and contrary evidence survive the
pass.

## 3. Choose the coordinates and the profiles

Select only the coordinates whose absence would hide a material distinction (subject kind,
decomposition, extent, time, population, authority, knowledge status, representation) and the
profiles whose trigger is present ([profiles](references/profiles.md)). Record a justified omission
where a trigger is present and the profile is not applied. Cross-cutting concerns apply wherever
their mechanism is present, never as an appendix.

## 4. Write one concrete successful case and the adverse cases

Before any general statement, write the case that succeeds and the cases that expose terms, state,
responsibility and conditions: an invalid input, a partial failure, an excluded person, a stale
dependency, a conflicting authority. The cases are where the vocabulary is tested; a term the cases
cannot use is not yet defined.

## 5. Specify the obligations and the permitted freedom

Write each normative statement in the grammar: under conditions, the responsible actor or system must
or must not perform an observable behaviour or preserve a property, within stated bounds, with
defined failure and recovery behaviour; evidence by method for this scope. Include errors, uncertainty,
recovery and human discretion. State what is deliberately unspecified and what no consumer may rely
on. Give every unknown one of its three treatments (block, bounded investigation, accepted residual
within an actual authority); a blank is not a permission. A quantitative target carries its unit,
population, denominator, distribution, boundary, window, exclusions, threshold authority and action
on breach.

## 6. Name the material seams

Where the subject relies on, composes with, transforms, authorises or is authorised by another party
or component, name the seam and both sides' obligations. A consequential seam is handed to
`specify-connection` with the endpoints, their revisions and the intended reliance; a trivial edge is
a sentence here. No inference travels from local correctness to the composed system.

## 7. Design the warrant with the claim

For each consequential claim choose the appropriate warrant from
[assurance](references/assurance.md) and record the evidence plan or the evidence status: method,
scope, result, limits and what is missing. Expected results have their own basis; the only oracle is
never derived from the implementation it checks. Evidence design that is itself unresolved routes to
`parallax-design-inquiry`; a specialist verification stays with its method. This skill never
manufactures value evidence.

## 8. Reconcile and return

Reconcile the affected records once: the owning artefact, its navigation, the correspondence from old
identifiers to new. Return:

1. The bounded specification for the named use, with its identity, revision and canonical location.
2. The changes and their correspondence (added, retained, changed, rejected, and why).
3. The unresolved issues, each with its treatment and its consequence for the intended use.
4. The eligible handoffs: seams to `specify-connection`, readiness to `assess-specification`, ready
   slices to `plan`, an unformed concept to `concept-exploration`.

Stop when the requested scope has coherent obligations, explicit unknowns, an evidence plan and a
usable next action. Readiness is always for a named use: ready for discussion differs from ready for
implementation, integration, deployment or an outcome claim; a detailed proposal can be complete while
its suitability stays provisional.

## Boundaries and stop conditions

This skill does not manufacture value evidence, implement software, approve deployment, award
readiness for a use it did not assess, or require a specification pass for settled small work whose
existing artefacts suffice. It does not copy the framework into every record, generate a new value
model or need register per invocation, or expand a document to make it look complete: when one
authoring pass and one challenge pass cannot resolve a design choice, both alternatives and their
discriminating evidence are preserved. It reopens a specification when use evidence, a material
dependency, the consumer context, the authority or an outcome claim changes.
