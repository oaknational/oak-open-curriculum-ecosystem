---
name: user-value
classification: active
description: >-
  Express, implement and assess the use value of a service, product, tool, API
  or component: who uses it, to accomplish what, under which conditions, with
  what evidence. Use when a backlog, user stories, journeys, acceptance
  criteria or user research leave the usefulness, or its contribution across
  levels, unclear. Good: connect a consumer's purpose to a bounded guarantee and
  appropriate evidence. Bad: rename features as needs, or treat local
  correctness as proven wider benefit. Not for implementing a settled contract
  (engineering methods), experiment design (parallax-design-experiment) or
  scheduling (plan).
---

# Express and implement use value

Use value is what a person or consuming system can use a provision (a service,
product, tool, API or component) to accomplish, under stated conditions, costs
and limits. Use value is the concept; the user-value model is the artefact this
skill produces. Use this for a new definition or an audit and repair of existing
material. Preserve useful work and stable identifiers. Do not produce a
mandatory stack of documents or force every kind of use into a human-service
journey. The three references are views of one method, not separate required
outputs: [the value model](references/value-model.md) (kinds, links, status
dimensions, a worked example), [journeys and stories](references/journeys-and-stories.md)
and [levels and implementation](references/levels-and-implementation.md); each
section below names the one it uses.

## 1. Establish purpose and authority

Name the intended person or consumer, situation, desired change, boundary,
owner direction and intended use of the output. Separate the whole service or
system from the part this team can change. Read governing sources before relying
on them; an index only points to a source, it is not one. Preserve existing
scope and contrary evidence.

Distinguish:

- the owner's purpose or required constraint;
- a need supported by research in a stated population and context;
- an assumed need or opportunity being explored;
- a proposed response and the value it might offer;
- observed delivery, experienced value and demonstrated impact.

Innovation can offer value people have not previously requested. Describe that
as a proposition to explore, with an honest claim boundary. Do not invent
research to legitimise it or reject it merely for lacking a pre-existing need.

## 2. Inspect before structuring

For existing work, identify each item's current role and source: need, journey,
story, capability, contract, implementation, enabling task, constraint, outcome
claim or evidence. Record whether it is retained, refined, split, merged or
retired, with correspondence from old IDs to new ones (the accounting form is in
[journeys and stories](references/journeys-and-stories.md), §Slicing and
migration). Do not discard substantive exceptions or reclassify uncertainty as
fact during a rewrite.

Ask whether the problem is missing structure, missing evidence, a contested
value, or an unsuitable response. A polished backlog cannot answer all
four. Use `concept-exploration` for an unformed concept, `parallax-frame` for
materially contested boundaries or perspectives, and `metacognition` at a
point where the inherited shape may be doing the thinking.

## 3. Define needs, offered value and commitments

Select the relevant views and levels first, from the tables in
[the value model](references/value-model.md) and
[levels and implementation](references/levels-and-implementation.md). Purpose,
experience, capability, contract and implementation are different questions, not
mandatory rungs in a single hierarchy. Work down from purpose to needed
provision, and back up from an existing capability to its actual consumers and
possible uses. At each material boundary name who uses what, to accomplish what,
under which conditions, and how that usefulness could be observed. Unknown
downstream use remains unknown.

For human use, identify people who use, provide, support or cannot access the
provision. Keep their needs distinct from organisational targets. Express each
material need
as the person's goal and reason in context, without prematurely selecting a
channel or implementation. Record source, scope, evidence status and what
would revise it. Never fabricate participant words, emotions or prevalence.

State the bounded value proposition: for whom, what useful difference,
under which conditions and limits, with what responsibility. Separate what the
provider or component controls from a longer-term outcome it aims to influence. Name
material costs, burdens, rights and adverse effects, including who bears them.
Keep value conflicts visible; a single aggregate metric cannot settle them.

## 4. Map experience across boundaries

Use a journey where a person's experience over time is consequential (the map's
minimum fields are in [journeys and stories](references/journeys-and-stories.md)).
For a technical consumer, use a usage scenario, interaction or composition view
with inputs, state, results, failures and caller obligations (see
[levels and implementation](references/levels-and-implementation.md),
§Composition and conflict). Preserve its relationship to human experience when
known; these views are not interchangeable.

For human journeys, map the person's trigger, before/during/after activity,
meaningful ending, channels, other people, waiting, decisions, help and
recovery. Mark the map as observed, proposed or mixed; on a mixed map label the
status at each material stage. Keep proposed improvements distinct from
reported experience.

Attach needs to the stages where they arise, including exclusion before entry,
unsuccessful endings and effects on support providers. Do not mistake a mode,
screen flow or technical call sequence for the whole journey.

## 5. Derive bounded delivery work

Choose changes that let a named actor or consumer accomplish something valuable
in the journey stage or usage scenario mapped in §4. Use stories, capability
slices or enabling tasks. State actor, change and purpose; the familiar "As a /
I need / so that" form is optional. Link each story to needs and journey stages,
or state the enabling or opportunity rationale when no direct user-need link
exists.

Slice by independently observable useful outcomes, preserving a coherent
experience. Do not slice merely by database, API and UI layers when delivering
a human experience. A reusable component can itself be a useful delivery unit
when it has a real consuming role, coherent guarantee and independent acceptance.
Record supporting technical/operational contracts as dependencies or enabling work,
with their own consumers and guarantees. A tiny algorithm does not require an
invented citizen persona or a direct causal promise about national outcomes.

For each candidate fill the story card in
[journeys and stories](references/journeys-and-stories.md), §Minimum useful
story card. Distinguish candidate, ready, implemented and accepted (the value
model's delivery dimension); a better-written story is not automatically ready
or accepted. Use the existing project's vocabulary where it already makes these
distinctions.

## 6. Connect delivery with outcomes without claiming the bridge

Link implementations to the contracts they realise, contracts to the
capabilities they enable, and capabilities to their uses. This correspondence
may be many-to-many, conditional or partly unknown. Check composition at the
boundary: correct parts can still leave the consuming workflow unusable.
Do not turn an expression, realisation or enablement link into a causal claim.

Explain why the proposed provision could produce useful outcomes, under which
assumptions and alternatives. A passing conformance test, a working service, a
usable interface, a person who got what they came for, a measured outcome and a
proven cause are six different claims; never let one stand in for the next. For
a consequential bridge, name its scope, mechanism, uncertainty, possible
defeater and suitable evidence.

Trace in both directions: from delivery work to its value rationale, and from
each important need or commitment to coverage or an explicit gap. Type every
link with the relationship table in [the value model](references/value-model.md);
a bare "supports" edge says nothing. Several needs can occur in one journey and
several stories can address one need. Traceability is neither a causal proof
nor permission to read or change a linked record.

Route unresolved evidence-method design to `parallax-design-inquiry`, controlled
experiments to their specialised skills, and reconciliation of conflicting
evidence to `parallax-synthesise`. Do not invent a sample size, success threshold
or statistical design just to complete a story card.

## 7. Review and return

Challenge the model from the person or consumer, provider and delivery
perspectives with the review questions in
[journeys and stories](references/journeys-and-stories.md), §Review questions
that can change the result. Use `parallax-audit` when consequential reliance
warrants a separate challenge; label same-context review honestly.

Stop when the requested scope has coherent definitions, material relationships,
explicit gaps and a usable next action. Do not force every uncertainty closed
or expand the task into implementation or research recruitment. Return:

1. The user-value model, selected levels and authority/evidence limits.
2. Relevant journeys, usage scenarios, capabilities, contracts or story candidates.
3. Traceability, migration decisions and uncovered needs.
4. Acceptance observations, outcome hypotheses and discriminating next research.
5. Review performed, limitations and reopening conditions.

Update the owning documents and affected navigation once. Hand selected ready
slices to `plan`; preserve unresolved research and authority questions. Reopen
the model when use evidence, a material dependency, the consumer context or
an outcome claim changes.
