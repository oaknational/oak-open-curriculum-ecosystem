# Read Before Asking

When a question is **empirical** — its answer is a fact about repo
state, the schema, the data, or another readable artefact — read the
relevant artefact before posing the question to the owner. Empirical
questions belong to investigation, not to coordination.

## Trigger

The agent is about to ask the owner a question shaped like *what is
X*, *does X exist*, *what is the value of X*, *what does file Y
contain*, *what does the schema say*, *which records have field Z* —
anything where the answer is a fact discoverable from the repo, the
upstream schema, or already-loaded artefacts.

## Action

Read the artefact (file, generator output, OpenAPI schema, JSON
data, ADR, PDR, plan, conversation log, comms log) that contains the
answer. Render the result in chat. Then continue with whatever
decision the owner is involved in.

## Two Structural Guards

Both guards are non-negotiable. A version of this rule that lacks
either is unsafe and reverts to the quarantined doctrine's failure
mode.

### Scope guard

This rule applies only to questions whose answer is a fact about
repo state, schema, data, or already-loaded artefacts. It does
**not** apply to:

- preferences (*do you prefer A or B?*),
- approval (*should I do X?*),
- direction (*which path should we take?*),
- judgement calls (*is this trade-off acceptable?*),
- anything that involves an action the agent would then take on the
  basis of the answer.

These are coordination questions, not empirical ones, and must be
posed to the owner regardless of how confident the agent feels
about its own answer.

### Output guard

The product of the read is **information presented to the owner,
not authorisation to act**. Even when the read makes the next move
"obvious", this rule does not authorise the next move. Action
authorisation comes from the owner, separately, after the
information has been rendered.

The rule biases toward *investigation* (reading is reversible). It
does **not** bias toward *execution*. An agent that reads an
artefact and then takes a destructive or shared-state-modifying
action on the basis of the read has misapplied the rule.

## What This Rule Replaces

This rule is the operational expression of
[PDR-057 (empirical-answerability)](../practice-core/decision-records/PDR-057-empirical-answerability.md),
the doctrinal frame under which the rule's substance lives. PDR-057
supersedes the quarantined `apply-don't-ask` candidate; the original
doctrine was
[quarantined on 2026-05-01](../memory/operational/quarantine/apply-dont-ask-doctrine.md)
because it lacked a destructive-operation guard and contributed to
the action landscape that produced a destructive
`git checkout --` incident.

The two doctrines have opposite biases at the moment of action:

- The quarantined doctrine biased toward **execution** when "the
  path is named". This produced the failure.
- This rule biases toward **investigation** when "the answer is a
  fact". Investigation is reversible; execution may not be.

If the agent finds itself reaching for *the path is named, applying*
or *the principles have settled this, acting* — that vocabulary
belongs to the quarantined doctrine, not this rule. Surface to the
owner.

## Worked Example

A type-expert's bucket-(c) finding flagged "is
`school_context_schema.properties` genuinely open-ended, or does it
have a closed shape?". The answer was in `eef-toolkit.json` — a
closed JSON Schema document with nine named properties. Reading the
file took 60 seconds and resolved the empirical question without
owner intervention. **The result of the read was rendered in chat
and applied via owner-direction in a separate step**, not
unilaterally on the basis of the read. This is the rule operating
correctly: investigation produced information; the owner authorised
the action that information enabled.

## Related Surfaces

- [PDR-057 (empirical-answerability)](../practice-core/decision-records/PDR-057-empirical-answerability.md)
  — the doctrinal frame this rule implements.
- [`undo-change` skill](../skills/undo-change/SKILL.md) — the same
  *render the diagnosis, then halt-ask* shape applied to undo
  operations.
- [Quarantined apply-don't-ask doctrine](../memory/operational/quarantine/apply-dont-ask-doctrine.md)
  — the predecessor doctrine; preserved for review (quarantine
  cleared 2026-05-10 by PDR-057 + PDR-058).
- [Pending-graduations register](../memory/operational/pending-graduations.md)
  — graduation log + design/outcome optionality routing labels.
