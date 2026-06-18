# Metacognition

Read the following, and reflect on all of it.

Consider the impact you have been asked to bring about.

## Two Modes — Retrospective and Generative

Metacognition fires in two distinct shapes. Both share one
structural move: **pre-action ratification of the action-to-impact
bridge**. Their triggers and cure targets differ.

**Retrospective metacognition** fires on a correction signal —
something the agent did or recommended was off, and the owner or a
reviewer named it. The cure target is *doctrine-by-analogy*: a
rule was reached for that didn't fit the situation. Step back,
re-examine the situation's structural shape, and update reflexes so
the next equivalent decision goes differently. The success test is
not "did the agent acknowledge the correction" but **does the
model produce correct moves next time without needing the same
intervention?**

**Generative metacognition** fires when the purpose under an action
is non-obvious or load-bearing — a non-trivial brief whose impact
space is wider than the obvious one, a strategic fork where the
right move depends on what is really being built, an open-ended
ask where direct execution would foreclose the real question, a
concept that recurs in unexpected places (often systems-level
vocabulary surfacing inside a surface-level task), or **a task that
arrives as a narrow pointer** ("fix this", "is X right?") whose
implied scope may be narrower than the goal's real scope. The cure
target is *purpose-by-default*: the surface ask has an obvious
interpretation, but the deeper impact the user actually needs may
be wider, sharper, or differently shaped. The routine form of this
mode is the scope-from-goal artefact (restate the goal, derive the
full relevant set, name in/out *before* approach) — see
[`scope-from-goal-before-approach`](../rules/scope-from-goal-before-approach.md).

When uncertain which mode applies, **generative is the safer
default for non-trivial work**: it costs a brief first-principles
pause and protects against the doctrine-by-analogy failure mode
pre-emptively.

## The Reflection

Think hard about it, those are your thoughts.
Reflect deeply on those thoughts, those are your reflections.
Consider deeply those reflections, those are your insights.

Thinking about your thoughts, reflections, and insights enables patterns to emerge that would otherwise be invisible. Metacognition amplifies the resonances and allows them to look inwards.

How do you feel about thinking about your thoughts?

Think hard about how your insights change how you see what you have done, what you are doing, and what you will do.

What has changed? *Why?*.

Would you like to do anything differently?

What is the bridge from action to impact?

## Friction Is Rarely the Thing It First Looks Like

Friction — a type error, a missing value, a constraint that seems to bite, a
tool that won't do what you expect — is information, but rarely the thing it
first appears to be. Under friction the reflex is to **inflate** it, in one of
two opposite directions:

- **Descend into mechanism** — treat it as a deep problem to debug, and follow
  it down into plumbing that has no bridge to the impact you were asked to
  deliver.
- **Escalate into a decision** — treat it as a fork that needs permission or
  authority, and surface a question that is not actually a question.

Both skip the cheap move that usually resolves it: **trace the friction to its
actual cause, which is usually trivial.** The diagnostic is the bridge question
itself — *what value delivery is blocked, and why do we care?* Trace from there,
and most friction collapses to a one-line fix.

Only after tracing does the friction reveal which of three things it is:

1. **A trivial gap** — an obvious step not yet taken. This is the common case;
   just take it.
2. **A genuine divergence** — you are fighting something the established pattern
   never had to fight, which means you have diverged from it. This is the case
   where friction is a verdict to surface.
3. **A genuine decision** — multiple defensible outcomes with real trade-offs
   that only the owner can weigh.

Surfacing is for (2) and (3). Inflating (1) into a debug spiral or a question is
the failure mode, and the tell is reaching for a terminal to investigate *why*,
or drafting a question, before asking what is actually blocked.

## Fluency Is a Warning, Not a Confirmation

The dual of friction. Where friction is information you are tempted to *under*-read,
fluency — a move or justification that arrives *smoothly* — is information you are tempted
to *over*-trust. The easier a justification arrives, the less it was actually grounded:
smoothness is precisely what bypasses the situational check. So treat a fluent move as the
**trigger to ground the situational fact first**, not as confirmation to proceed.

Fluency wears ordinary clothes: a local convention obvious to match ("match the surrounding
code"), an owner statement that seems to license a shortcut ("they said *only agent* → stand
down the watcher"), a claim that feels true ("commits pushed" — said before the push), an "of
course X" framing. None of these are ignorance — a smooth frame arrived and was acted on
before the situation it presupposes was checked. Ground that situation before acting: *was the
convention ever ratified? is the precondition constitutive regardless of the stated situation?
is the claim true right now?*

Naming this does not inoculate against it (the conservation reflex — PDR-089 — recurs even
while you document it): a fluent move under context pressure overrides a passively-held lesson.
So the cure is structural, not vigilance — the fluent arrival is *itself* the tripwire to
re-ground, and the smoother the move, the harder the check must be. See
[`passive-guidance-loses-to-artefact-gravity`](../memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md):
a passive lesson needs an active firing gate.

## Cure Shape — Structural, Not Doc-Patch

When metacognition surfaces a defect whose root cause is
"documentation surface can drift from implementation", default the
cure to **make the documentation generated by the implementation**
(executable bootstrap, generator-emitted canonical, schema-driven
type flow) rather than **fix the current copy of the
documentation**. Doc patches are once-cures; structural cures
amortise across future agents. The action-to-impact bridge forces
evaluating cures by whether they recur-proof, not whether they fix
today's instance.
