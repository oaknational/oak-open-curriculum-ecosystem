---
id: remove-plan-schema-owner-gates
node_type: delivery
name: 'Remove owner gates from the plan schema'
overview: >-
  Take the owner_gates field, its expiry clock and its session-open alert out of the plan
  schema and its tooling, and turn each existing gate into a plain note in its plan.
status: archived
ratified_by: owner
ratified_date: 2026-11-19
ratified_where: "The owner's answer to a question prompt in the session of Sandpiper guards Wind (690653), 2026-11-19: 'Remove them'"
serves: planning-and-intent-estate
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
last_updated: 2026-11-20
---

Completed by oaknational#1035, merged 2026-11-20. Tooling and corpus changed in one pull
request, because the strict schema would have refused the corpus otherwise. ADR-200, ADR-216,
ADR-221 and ADR-227 still mention owner gates and were left for the owner.

# Remove owner gates from the plan schema

## Goal

A plan no longer declares that it waits on the owner through a schema field with an expiry date,
and no session opens with a list of expired gates.

## User groups and value

- **The owner** stops being named as a blocker by a mechanism he did not ask for. His word of
  2026-10-14 on first meeting it: "ceremony has been invented, and then declared a blocker".
- **Seats opening a session** stop reading expired-gate alerts that ask for no act of theirs.

## Why

PDR-100 (2026-06-16) abolished owner-gating. The plan schema's owner gates, with a mandatory
expiry and a session-open drift alert, arrived on 2026-07-22 and reintroduced it. The owner
decided on 2026-11-19 that they come out.

## Acceptance criteria

1. `plan-node-schema.md` has no owner-gates field or section, and the plan-corpus validator
   neither requires nor reads one. Proof: `repo-safe`, the validator's tests and `pnpm check`.
2. No plan's frontmatter carries `owner_gates`. Proof: `repo-safe`, a search of `.agent/plans`.
3. The session-open hook reports no expired gates, and its gate code is deleted. Proof:
   `repo-safe`, the hook's tests.
4. Each gate that named something still awaited is a sentence in its plan's body or its thread
   record. Proof: `repo-safe`, the pull request's diff, read by the reviewer.

## Todos

1. Read the schema, the validator, the session-open alert and every consumer of the field; list
   them in this node before changing any.
2. Write the failing tests: a plan without the field validates; the alert has no gate output.
3. Remove the field from the schema, the validator and the alert.
4. For each plan carrying a gate, move what it still awaits into the body, then drop the field.
   Tooling and corpus change in one pull request if the validator would otherwise refuse the
   corpus; if they can be separated, the corpus change follows as its own pull request.

## Out of scope

- Any other change to the plan schema.
- The plans' ratification fields, which record a decision already made and gate nothing.
