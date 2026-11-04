# Journey and story authoring

Use this view when human experience or story slicing is relevant. For other
consumers use the [levels and implementation](levels-and-implementation.md)
reference; this reference is not a required gateway for all user-value work.

## Minimum useful journey view

Record the person/context, goal or trigger, start/end boundary and evidence
status. Show the stages that change what the person needs, does or receives.
At each material stage connect:

- action, decision, waiting or handoff;
- need and proposed or observed difficulty;
- channel and other people, including support and operational work;
- entry/exit condition, useful outcome and consequential recovery;
- evidence, uncertainty and questions requiring research.

Only record thoughts, feelings and quotations as observations when a source
supports them. On a proposed map use questions or clearly marked hypotheses.
Keep the existing experience distinct from a proposed future state, even when
one diagram shows both. The map records the person's experience, not the
team's build history.

Use a shared spine and variants when differences are local. Split maps when
stages, responsibilities or consequential experiences differ substantially.
Include the person unable to enter and the person who stops without success.
A design can give a useful, truthful blocked ending without satisfying the
original goal; do not describe that as successful completion.

## Minimum useful story card

```text
ID and lifecycle:
Actor and situation:
Bounded change and immediate purpose:
Relevant needs, journey stages or consumer purposes, and commitments:
Evidence basis and unknowns:
Acceptance outcomes and proposed observation methods:
Consequential failure/recovery:
Supporting contracts, dependencies and authority:
Readiness questions; next action:
```

Adapt the shape to the task. This is a prompt for useful distinctions, not a
fixed schema or requirement to repeat unchanged text in every card.

### Acceptance and readiness

Acceptance outcomes state what would be true. The proof method states how it
will be checked. Actual acceptance records what happened and its limits. Do
not collapse those three into a tick beside a proposed criterion.

Before claiming readiness, resolve the choices that determine the slice's
meaning: actor/context, scope, owner, required authority, receiving boundary,
material dependencies and observation method. A prototype may use a named
simulated receiver, but its proof ends at that simulated boundary.

LLM-mediated behaviour needs defined cases and a credible judgement method;
one favourable response is not reliable behaviour. Human understanding needs
appropriate user research; a schema assertion cannot establish it. Educational
learning, public benefit and causal contribution need their own suitable
evidence. Keep evaluation design proportionate; route specialist questions as
§6 of the skill directs.

### Slicing and migration

Split a broad item when parts can produce independently useful, assessable
outcomes. Keep the parent as the capability/epic, with child IDs and an explicit
coverage relation. Do not relabel the same broad item "small".

For a rewrite, account for every existing item once: retained, refined, split,
merged or retired, with rationale and successor links. Retain valid exceptions,
adverse cases and source limits. Recompute coverage from the actual items.

An API, migration or algorithm task may be enabling work with a developer or
system consumer. Preserve its own guarantee and link to the wider purpose if
known.

## Review questions that can change the result

1. Is this a need, a proposed response, a constraint or an outcome claim?
2. Can the same need be met through another channel or without software?
3. Does the map include people and work outside the team's boundary?
4. Is evidence missing, or is there a real disagreement about value/authority?
5. Would this story pass while the person's journey still fails?
6. What burden, exclusion or adverse effect can the aggregate success hide?
7. Which important need has no response, and which work has no value rationale?
8. What later observation would change the design or its claimed benefit?

Return a bounded verdict and concrete next action. Reformatting everything is
not success unless the structure improves a decision, test or handoff.
