# ADR-194: Teacher-as-Expert Product Boundary

**Status**: Accepted
**Date**: 2026-06-09 (ratified by owner 2026-06-09)
**Related**:
[ADR-191](191-deterministic-data-surface-agent-reasons.md)
(deterministic data surface; the agent is the only reasoner — this ADR is the
**product principle** that ADR-191 is the **server-side engineering corollary**
of: ADR-191 settles where relevance/ranking reasoning happens, this settles what
the product is for and what it must never do to a teacher);
[ADR-107](107-deterministic-sdk-nl-in-mcp-boundary.md)
(deterministic SDK / NL-in-MCP boundary — where natural-language interpretation
happens);
[ADR-157](157-multi-source-open-education-integration.md)
(multi-source integration — already records that "relevance judgement, ranking,
and selection are the consuming agent's reasoning, not a server-side surface", and
that EEF surfaces present options and trade-offs, never recommendations);
[ADR-058](058-context-grounding-for-ai-agents.md)
(context grounding — the interpretation-resource scaffold that lets the agent
reason well over deterministic facts);
[Vision](../../../VISION.md)
(Non-Goals — the learner-facing and "not a replacement for Oak's teacher-facing
product" boundaries this principle sits alongside);
the EEF evidence integration strategy's **R7 — Professional Judgement Framing**
in `evidence-integration-strategy.md`
(the latent product-requirement statement this ADR promotes to a repo-wide
principle).

## Context

Oak's curriculum and evidence surfaces exist to help teachers. A question sits
under every surface we design: **how far should the product go in helping — does
it inform the teacher, or does it do the teacher's job?**

The answer is settled in practice but had no durable home. It lives scattered:

- as **R7 (Professional Judgement Framing)** in the EEF integration strategy —
  "evidence-informed teaching means teachers use evidence to inform decisions, not
  that algorithms make decisions for them";
- as a [VISION](../../../VISION.md) Non-Goal — the system is not a
  learner-facing surface and not a replacement for Oak's teacher-facing product;
- and, for the server only, as
  [ADR-191](191-deterministic-data-surface-agent-reasons.md) (the agent is the
  only reasoner; no server-side ranking, scoring, recommendation, or
  situation→item mapping).

ADR-191 itself records the cost of this missing home: the principle "had no
durable home — it lived only as a clause inside one plan, which is why a
two-month-old brief could sit in the read-order describing the opposite
architecture without contradiction." That is the same gap, one level up. ADR-191
is the **engineering** expression — it constrains the server. The **product
principle that generates it**, and that also binds the agent and the guidance
surfaces (the system must not make the teacher's pedagogical decisions, even
though ADR-191 only reaches the server), is unwritten.

This ADR writes it.

## Decision

**Oak's curriculum and evidence surfaces support teachers with information,
resources, and evidence, and may present evidenced options and trade-offs. They
never make the pedagogical decision that belongs to the teacher. The teacher is
the pedagogical expert and the authority on what should happen; the system and the
agent inform and offer options — they do not decide or instruct.**

Concretely:

1. **Surface information, resources, and evidence.** Every surface returns
   curriculum content, structured relationships, and evidence as facts the teacher
   reasons over.
2. **Present evidenced options, never the decision.** The system may surface and
   present evidenced pedagogical options and trade-offs — proactively or on
   request — with their impact, cost, evidence strength, caveats, and attribution.
   It never makes the choice for the teacher: no instruction ("do X"), no single
   course prescribed as the right one, no ranking collapsed into a verdict, no
   framing of an approach as what the teacher should do. Options and evidence are
   offered; the decision is the teacher's.
3. **The teacher holds decision authority, always.** Outputs are decision-support,
   not policy. The teacher is the pedagogical expert and the authority on what
   should happen; making the decision for them is the failure mode this boundary
   exists to prevent.

### The line: inform and offer, versus decide and instruct

This principle draws a precise line that downstream surfaces must hold. The line
is **decision authority**, not who initiates:

- **Inform and offer (allowed).** Name _what is present in the data_ ("this lesson
  carries these misconceptions", "this unit has these prerequisite units", "this
  strand has insufficient evidence"); present _evidenced options and trade-offs_
  for the teacher to weigh ("the evidence rates feedback +6 months, very-low cost,
  extensive; collaborative learning +5 months, limited evidence — with these
  caveats"); surface the methodology so the teacher can judge. Offering options,
  proactively or on request, is informing — not deciding.
- **Decide or instruct (forbidden).** Make the pedagogical choice that belongs to
  the teacher — "use this approach here", "this is the best strategy", "you
  should…" — or collapse the options into a single prescribed verdict. This is the
  teacher's call. Where the teacher delegates reasoning to the agent in
  conversation, the agent reasons transparently over the evidence and still leaves
  the decision with the teacher (per ADR-191); it is never encoded as data, a
  server-side mapping, or authoritative-looking guidance content that decides for
  the teacher.

ADR-191 enforces the server-side half (no server-side ranking, scoring, or
recommendation). This ADR extends the line to the whole product: surfaces inform
and offer options; none makes the teacher's decision or instructs them.

## Consequences

- **Positive.** New teacher-facing surfaces inherit a settled product stance
  instead of re-litigating "how helpful should this be?" per feature. The boundary
  is explicit, citable in review, and one level above ADR-191 so engineering and
  product decisions share one source.
- **Positive.** Trust and professional respect are protected: the product
  reinforces the teacher's expertise rather than displacing it, which is also the
  responsible stance for an AI-mediated education tool.
- **Review obligation (forward-looking).** Reviews reject product features that
  make the teacher's pedagogical decision, instruct the teacher, or collapse
  options into a single prescribed course — while welcoming features that present
  evidenced options and trade-offs for the teacher to weigh. Existing surfaces
  already comply — the EEF interpretation resource and the `adapt-lesson` prompt
  both state "the teacher decides" / "the decision is mine to make"; ADR-191
  governs the server. The cost is borne by future design, not migration.
- **Relationship to ADR-191.** ADR-191 is unchanged in substance; it is the
  server-side engineering corollary of this product principle and links back to it.

## Explicitly out of scope (not forbidden)

- **Presenting evidenced pedagogical options** — proactively or on request, as
  options with caveats and attribution for the teacher to weigh — is in scope and
  encouraged. This ADR forbids _making the decision_ and _instructing the teacher_,
  not _offering evidenced options_.
- **The consuming agent's own runtime reasoning** (ranking, weighing, composing
  options for the teacher in conversation) is governed by ADR-191 and is allowed —
  the agent reasons transparently over deterministic facts and the teacher decides.
- **The learner-facing safeguarding boundary** (VISION Non-Goals — the system is
  not a surface children interact with directly) is a separate, unchanged
  decision.
- **A durable, authored data crosswalk** (e.g. EEF-strand↔curriculum-content
  modelled as graph data) is _data_, not request-time instruction, and is not
  forbidden — exactly as ADR-191 scopes it out.
