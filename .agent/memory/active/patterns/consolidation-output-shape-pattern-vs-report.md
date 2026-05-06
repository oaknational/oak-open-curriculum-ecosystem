---
name: Consolidation Output Shape — Contract for One Pattern, Report for N Independents
polarity: pattern
use_this_when: A consolidation, audit, or deep-exploration pass has produced N findings and you are choosing the shape of the output artefact — a single contract, a per-finding remediation list, an ADR, a PDR, or a free-form report
category: process
proven_in: .agent/memory/executive/collaboration-state-placement-contract.md
proven_date: 2026-05-06
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Producing a per-finding remediation list when the findings are all instances of one structural shape — leaving the shape unnamed and letting the next pass repeat the substrate failure under different filenames"
  stable: true
---

> **POLARITY: PATTERN.** This is a shape to repeat: when N findings
> from a single audit converge on one repeating structural shape,
> name the shape as a contract. When the findings are independent,
> a report is the right shape. The mismatch — listing N independent
> findings under a unified contract, or fragmenting one shape into
> N report items — is the failure mode this pattern names.

## Principle

A consolidation pass produces N observations. The output-shape
question is whether those N observations point at:

- **One repeating structural shape** — every observation is an
  instance of the same load-bearing failure mode or the same
  load-bearing solution shape. The right output is a *contract*:
  a single artefact (placement contract, doctrine clause, ADR,
  PDR) that names the shape once and explains why it applies
  across the instances. A report listing N independent fixes
  leaves the shape unnamed; the next pass will repeat the
  substrate failure under different filenames.
- **N independent findings** — each observation is its own
  shape with its own substance and its own home. The right
  output is a *report* that routes each finding to its
  destination. Bundling them under a single contract
  manufactures false unity and dilutes the contract's authority.

The diagnostic at consolidation-output-time is therefore:

> *Are these findings instances of one shape, or are they N
> separate shapes that happened to surface in the same pass?*

## Pattern

When the diagnostic answers "one shape":

1. **Name the shape** in a single sentence. If the sentence will
   not form, the diagnostic answer is wrong — return to the
   findings and re-test.
2. **Author the contract** with the shape as the title and the
   findings as worked instances inside the body.
3. **Cite the contract** from the original surface (napkin,
   pending-graduations, plan body) and from each individual finding's
   destination if it has one.

When the diagnostic answers "N independents":

1. **List each finding** with its destination and the substance
   that should land there.
2. **Route each separately** — accept that the consolidation
   surface produces a fan-out, not a convergence.
3. **Resist the urge to bundle** under a unifying frame; false
   unity is more expensive than honest fan-out.

## Worked Instance

2026-05-06, Briny Plumbing Fjord session, deep-exploration read
on `collaboration-state-lifecycle.md`. Several entries had
accumulated by *adjacency to existing sections* rather than
*first-principles match to substance-kind*: apparently-orphaned
claim policy landed near §Archive Stale Claims (doctrine clauses
belong in the directive, not the lifecycle); §Schema-Field
Provenance was relocated from conventions.md but is field-level
metadata for the schema; §Claims preamble carried doctrine that
gates *all* shared-state mutation, not just claim opening.

The findings were all instances of one shape: *substance-placement
followed adjacency-of-prior-edit, not substance-kind*. The right
output was therefore the contract
[`collaboration-state-placement-contract.md`](../../executive/collaboration-state-placement-contract.md)
naming the shape once and citing the instances, not a per-finding
remediation report. The contract authored before the next
graduation also pre-fences future placement decisions, which a
post-hoc per-finding report cannot.

## Anti-pattern

Listing N findings as a remediation table when those findings
share one structural shape. The table format encodes "different
problems, different fixes" and silences the shape signal. The
next consolidation pass discovers the same shape under different
filenames because no contract was authored to fence it.

The mirror anti-pattern: bundling N independent findings under a
single contract because "they all touched the same file". File
adjacency is not shape. The contract is diluted; readers cannot
tell which finding's substance the contract is actually
protecting.

## Diagnostic at Consolidation-Output Time

Before drafting the consolidation output, the agent asks:

> *Can I write the shape these findings share in one sentence
> that names a load-bearing structural property?*

If yes — author the contract; the findings are worked instances.
If no — author the report; route each finding separately.

The "in one sentence" constraint is the test. Sentences that
require "and" twice, qualifying clauses, or multiple subjects
indicate the shape has not converged and the report shape is
correct.

## When to Apply

- After a deep-exploration / consolidation / audit pass that
  produced multiple findings
- When choosing between authoring an ADR/PDR/contract vs a
  remediation plan or report
- When a previous consolidation produced N items and the next
  one is producing N more under different filenames — strong
  signal the shape was missed and the report-shape was wrong
