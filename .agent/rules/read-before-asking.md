---
classification: core
description: Read empirical artefacts (file, schema, data, plan) before posing a question to the owner. Render the read result in chat as information, not as authorisation to act. Replaces the quarantined apply-don't-ask doctrine.
---

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

**The owner-channel face — record first, ask last** (owner, 2026-07-26: "I
already ruled on this two days ago. You have been re-inventing the wheel
your whole session"): before ANY question reaches the owner, search the
RULING surfaces for an existing answer — the milestone or ticket's own
description, the decisions register, plan gate-rows, per-user memory. The
estate writes its rulings down; treating those records as needing owner
re-confirmation converts his past work into repeated interruptions. A
question is the residue of a verified record gap, and new evidence against
a settled decision is a statement plus default-continue
(`present-verdicts-not-menus` §Closed decisions), not a reopened card.

**Read the governing text before a ruling or a new home.** A status is
ruled from the template that governs that file's line, not from a schema's
general clause; a divergence is called after the file's open pull requests
are read, since one may already carry the convergence; and a new rule or
pattern file is authored after the candidate homes' headings are read, since
a phrase search misses the home that already answers (three instances,
2026-09-27 and 09-28).

**A card built on a premise the seat knows is unverified is void.** Naming
the verification as pending inside the recommendation is worse than
omitting it — it advertises that the question was put before the reading
was done (owner rejection 2026-08-31, verbatim: "Asking this question
before looking at the OWA code is a waste of time"; the premise was an
absence inferred from URL helpers, never from the product's code). Read
the source that the premise rests on first; a question is the residue of a
verified gap, never the substitute for reading.

**Owner-decision-class facts are read, then asked — never surveyed.** Repo
purpose, edit authority, audience and priority are the owner's facts; they
live in his word and his ratified records, never in the bytes. A survey or
instrument built to infer them ratifies its own model and returns zero
evidence — instrument ratification is not weak evidence, it is none
(2026-08-17: a landscape survey of about thirteen million tokens guessed at
what the owner wanted while an earlier plan of his already stated it;
recurrence 2026-09-01). Read the ratified record first; if it is silent,
ask him directly, in one card.

Read the text that owns a subject before amending it or proposing for it. An
amendment to wording that implements an owner ruling is preceded by a grep of
this estate's own doctrine for the sections the ruling touches (a signed
cross-estate gloss collided with the testing directive's §Stubs vs Fakes,
2026-09-24), and a mechanism proposed for an act class is preceded by reading
the rule that owns that class (a repository `author.*` setting was proposed
against the rule that keeps the author explicit, 2026-09-24; five instances
across three seats in four days).

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
quarantined on 2026-05-01 (OCE)
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
- [`undo-change` skill](../skills/change-custody/undo-change/SKILL-CANONICAL.md) — the same
  *render the diagnosis, then halt-ask* shape applied to undo
  operations.
- [Pending-graduations register](../memory/operational/pending-graduations.md)
  — graduation log + design/outcome optionality routing labels.
