---
title: 'Strategy'
type: strategy
status: provisional-structure
last_updated: 2026-06-20
audience: 'Oak leadership (decide) and the delivery team (build)'
governed_by:
  - .agent/plans/product-development-governance/vision-strategy-and-plan-estate.plan.md
derives_from:
  - VISION.md
---

# Strategy

> **Provisional — structure first (PDR-018).** This corpus has its proper
> structure; much of its _substance_ is deliberately not yet written. Product
> strategy is the owner's to shape — this document brings the structure, the
> settled inputs already derivable, and the sharp questions, and marks everything
> still-to-decide as **DEFERRED**. Re-derive on owner input. Authored
> 2026-06-20 (Fennel tracks Chlorophyll); a baseline to refine, and to read new
> materials against.

## What this is

A cohesive, leadership-grade strategy that a reader can follow to understand and
back this work — and the foundation the plan estate later organises itself around.
It stands beneath [the vision](../../VISION.md) and above the plans: every plan
will trace to a strategic choice here, every choice to a vision element, every
vision element to one of Oak's goals.

The vision has two parts (serving Oak's mission; the agent-first transformation).
The **strategy's first organising principle is the three value streams** — the MCP
app, the engineering tools, and the agentic framework — held together at a
portfolio tier. The two-part vision and the three-stream strategy are the same
picture at two zooms: the app and the tools serve the mission; the framework is
both the engine that builds them and a value stream in its own right.

What's **settled and authored here**: how we align with Oak, the streams-as-system
map, the app's launch keystones (K1–K3), and the release-readiness hand-offs.
What's **DEFERRED to the owner**: the diagnosis, the per-stream choices, what we
won't do, the granularity of a "strategic choice", and the measures.

## 1. Diagnosis — the central challenge — DEFERRED (owner shapes)

The diagnosis names the core challenge this strategy answers. It's the owner's to
shape; the role here is to structure the options and ask sharp questions, fenced by
what's already settled.

**Already settled (do not re-open):** cost efficiency matters but is _not_ critical
and must not dominate architectural excellence; funding is out of scope. The
AI-host framing is _positive_, not defensive — teachers already use AI assistants;
we raise the quality of an existing behaviour, we don't introduce a new risk. So
the diagnosis must not centre cost, sustainability, or "AI is dangerous."

**Candidate framings of the challenge (provisional — for the owner to choose,
sharpen, or replace):**

- **The trust-and-provenance gap.** Oak's name now travels into hosts we don't
  control, which paraphrase on top of Oak's data. The challenge is keeping what
  reaches teachers — and through them, pupils — recognisably Oak: grounded,
  attributed, and rigorous.
- **The experiment-to-product gap.** We've proven the capability; becoming a
  product means clearing the value, safety, and statutory bars that a public body's
  live service must meet, and proving real-world impact, not just shipping.
- **The reach-and-delivery gap.** The curriculum is excellent but under-reached in
  the places teachers now work. The challenge is meeting them there — and doing it
  through channels (the AI vendors) we can't open unilaterally.

**Sharp questions for the owner:**

- Which of these is the _spine_ of the diagnosis, or is the real challenge a
  combination — and if so, what's the one-sentence framing?
- Is the diagnosis the same across all three streams, or does each stream face a
  distinct central challenge under one portfolio-level theme?

## 2. How we align with Oak (we align, we don't fulfil)

Oak owns its strategy; ours exists to **support** it, not to fulfil it. This is our
own derivation of the relationship — Oak's strategy is read first-hand and never
restated here.

**Stream → Oak goal:**

- **The MCP app → teachers.** Oak's goal of equipping every teacher to teach
  brilliant lessons, met where teachers already work.
- **The engineering tools → the ecosystem.** Oak's goal that anyone can create
  high-quality, innovative, safe tools from open content and data.
- **The agentic framework → the ecosystem (and, inward, our own delivery).** An
  open, adoptable framework is itself a tool others build with; inward, it's how we
  deliver the first two to standard, at pace.
- **Schools → deliberately not served by this repository.** An explicit,
  owner-confirmed non-goal, revisited only by a future explicit decision. We serve
  two of Oak's three goals; we hold the third open by choice, not by drift.

**The four pillars are constraints we honour** (our derivation of what each asks of
us, in our own words):

- **Independent** — we ground in Oak's evidence-informed, independently-created
  curriculum, and we're transparent about how the work is produced.
- **Optional** — we inform the teacher's choice and never lock them in; choosing
  something other than Oak is a first-class outcome our products respect.
- **Adaptable** — what we surface is built to be adapted to a teacher's context,
  not consumed as-is.
- **Free** — the code is openly licensed; the framework and tools are freely
  available; the curriculum stays under its upstream open licence.

## 3. The three value streams as a system (portfolio tier)

The streams aren't three separate tracks — they reinforce each other, and the
cross-stream cohesion is carried here at the portfolio tier:

- **The agentic framework is the engine.** It builds the app and the tools faster
  and more safely, and it's a value stream others adopt.
- **The engineering tools are the foundation.** The SDK, semantic search, the
  curriculum graph, and the evidence surfaces are what the app stands on.
- **The app proves the foundation.** It reaches teachers and demonstrates the whole
  system delivering real value.

A strategy that treated these as independent would miss the point: the framework's
quality shows up in the tools, the tools' quality shows up in the app, and the
app's reception is the proof the framework and tools are worth adopting.

## 4. Stream — the MCP app (teachers)

**Two co-equal, complementary channels.** Teachers reach Oak through the web and
through AI assistants; the channels reinforce rather than compete, and AI has a
place in both. This repository delivers the AI-assistant channel — Oak inside the
assistants teachers already choose, ChatGPT, Claude, Gemini and others — bringing
Oak's standards into the planning and preparation teachers already do there. Which
assistant is the teacher's choice, not ours; we don't play favourites.

### Choices / how we win — DEFERRED (owner: "we have the advantages")

A larger discussion the owner holds. Placeholder for the choices that decide how
this stream wins, once that conversation happens.

### What we won't do — DEFERRED (owner)

### The launch keystones (K1–K3, owner-ratified 2026-06-17)

These are settled and live in the
[launch-readiness framework](../../.agent/plans/curriculum-mcp-path-to-ga/launch-readiness-framework.md);
they sit inside this stream's strategy as its production-readiness keystones.

- **K1 — "Live" is an evidence state, not a deploy state.** GA means real teachers
  and curriculum leaders using the app and demonstrating positive impact. Value
  proof is a precondition of GA — articulated here, measured by Oak, not
  instrumented in-repo.
- **K2 — Primary audience: teachers and curriculum leaders** (for now). Nothing in
  the app is aimed at students. This is load-bearing for the ICO Children's Code
  question below and must be read with it.
- **K3 — Surface scope: the app in ChatGPT and Claude**, which means the app's real
  dependency set must be GA-ready. The release channel isn't unilateral — app-like
  packaging and promotion need the AI vendors' collaboration (they're aware and
  have agreed). Marketing is gated on sufficient mitigation of the TPC risk
  (the lesson-level data-availability area).

### Release-readiness — named hand-offs with accountability

Several go-live gates are owned outside this repository; the strategy's job is to
name them, with an accountable owner, so none is silently assumed done. "Owned
in-repo" = a live plan drives it; "external/tracked" = executed outside the repo
and tracked in the [compliance lane](../../.agent/plans/compliance/roadmap.md);
"discussion" = no owner yet.

| Requirement                     | What                                                                                                      | Ownership                                                                                  |
| ------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Privacy policy / T&Cs surfacing | Links in server metadata + discovery; the decide-and-publish step is legal                                | In-repo (`app-submission-standards` WS2 + compliance Phase 1); decide-and-publish external |
| Host UX                         | The teacher's experience inside the host product                                                          | In-repo (`mcp-app-extension-migration` WS3/WS4)                                            |
| ATRS                            | Algorithmic Transparency Recording Standard record, required of an arms-length public body before release | External/tracked — **production blocker**                                                  |
| Detailed DPIA                   | Full data-protection impact assessment across the live flows                                              | External (DPO/legal) — **production blocker**                                              |
| ICO Children's Code             | Applicability ruling + conformance, **cross-linked to the K2 target-audience decision**                   | External (legal) + product — discussion open                                               |
| Safeguarding & content-safety   | Assessed at the pupil boundary; the teacher is the safety layer                                           | External (safeguarding + editorial) — **production blocker**                               |
| Independent AI-output evals     | Stress-test outputs against Oak's quality and safety benchmarks                                           | External (Oak AI Platform) — **production blocker**                                        |
| Lesson-level data availability  | The missing materialised view the API needs                                                               | Discussion — no owner yet                                                                  |
| Go-to-market / school support   | Discoverability and enablement; teachers won't auto-discover or self-install                              | Discussion — no owner yet                                                                  |
| Release channel                 | App-like packaging + promotion in ChatGPT / Claude                                                        | External-collaboration dependency (vendors aware + agreed)                                 |

### Measures — DEFERRED (Oak input — analytics + research experts)

Critically important, and an Oak input by design — defined and measured with Oak's
analytics and research experts, never invented here. See §9 for the checkpoint
shape this stream will fill.

## 5. Stream — the engineering tools (ecosystem)

The typed SDK (TypeScript now, Python to follow), the semantic search service, the
curriculum graph tools, and the evidence surfaces — open tools for building with
open educational data, Oak's and beyond.

The evidence surfaces are where we **bring open resources together**: alongside
Oak's data we integrate openly licensed material from other organisations in the
sector — notably the **Education Endowment Foundation (EEF)**, an independent,
external education-evidence organisation whose
[Teaching and Learning Toolkit](https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit)
is openly available under attribution. Integrating an external partner's open
materials is a concrete instance of the ecosystem-convenor posture (vision Part 1,
and the "bringing open resources together" exemplar) — which is why each source
stays attributed to whoever created it.

- **Choices / how we win — DEFERRED (owner).**
- **What we won't do — DEFERRED (owner).**
- **Measures — DEFERRED (Oak input).** See §9.

> Open question for the owner: how much of the **search and graph tooling** is an
> _external_ ecosystem deliverable versus an _internal-reuse_ module (e.g. the
> semantic search engine re-pointed at a different data source)? They appeared in
> the strategy inputs mostly as internal-reuse; their outward role needs settling.
> (The EEF integration is settled: external open material we bring together — an
> ecosystem-facing exemplar, not an internal-reuse question.)

## 6. Stream — the agentic framework (ecosystem, and our own transformation)

The framework has two faces. **Outward:** an openly documented, freely available
framework for agent-first delivery that other teams adopt — a value stream serving
the ecosystem, and the exemplar/thought-leadership posture. **Inward:** how Oak
itself learns to build and curate digital products and services agent-first, across
the whole lifecycle.

**The amplifier ethic is load-bearing here.** Agent-first amplifies our people; it
doesn't replace them. The human expert leads — judgement, taste, accountability —
and agents carry toil and scale. It's the same human-expert principle the product
holds for teachers and pupils, applied to ourselves. The strictness this framework
demands isn't friction; it's the foundation that makes excellent work fast with
agents possible.

- **Choices / how we win — DEFERRED (owner).**
- **What we won't do — DEFERRED (owner).**
- **Measures — DEFERRED (Oak input).** See §9.

> Open question for the owner: the framework's external face serves Oak's ecosystem
> goal; its internal face serves Oak's _delivery capability_, which isn't one of
> Oak's three external goals. Does the internal transformation need its own stated
> alignment rationale (capability that amplifies delivery of the other goals), or
> does the ecosystem alignment carry it?

## 7. Strategic choices and their IDs (the traceability spine)

The strategy must expose an **enumerable, stable set of strategic choices, each
with an ID.** These IDs are the targets every surviving plan resolves to (a
`serves_strategic_choice` field), so they're a contract, not decoration:

- **Stable.** Once published, an ID isn't renumbered or reused.
- **Additive.** New choices get new IDs; the space grows without breaking existing
  references — the same discipline as versioning a public API.
- **Resolvable.** Every legitimate plan can trace to exactly one choice; a choice
  with no serving plan is a _discussion to schedule_ (build / hand-off / defer), not
  an orphan defect.

**Granularity — DEFERRED (owner; returning shortly).** This decision sets the
cardinality and shape of the ID space, so it's settled before the choices are
written. The options, framed as a schema decision:

- _Stream-level_ (≈3 IDs) — everything maps, but the mapping says little.
- _Per-stream choices_ — the likely sweet spot: precise enough to be useful, coarse
  enough to stay stable.
- _Finer than per-choice_ — maximally precise, but unstable and high-maintenance.

Recommendation (engineering-structure input, owner decides): per-stream choices.
The actual choice set is written once granularity and the per-stream "how we win"
are settled.

## 8. Measures (Oak-grounded)

Measures are an Oak input — defined and measured with Oak's analytics and research
experts — never invented here. So this section is a **well-formed checkpoint, not a
blank and not invented numbers**: each stream carries the shape below, and the
owner/Oak fill the signal.

| Stream            | Candidate signal (provisional)                                                    | Who grounds it           | Status               |
| ----------------- | --------------------------------------------------------------------------------- | ------------------------ | -------------------- |
| MCP app           | Real-use adoption + observed positive impact for teachers/curriculum leaders (K1) | Oak analytics + research | Owner/Oak checkpoint |
| Engineering tools | Ecosystem adoption of the SDK / search / graph                                    | Oak + owner              | Owner/Oak checkpoint |
| Agentic framework | Internal delivery uplift + external adoption of the framework                     | Oak + owner              | Owner/Oak checkpoint |

## 9. Open decisions (what's deferred, and to whom)

| Decision                                          | Owner                                          | Note                            |
| ------------------------------------------------- | ---------------------------------------------- | ------------------------------- |
| The diagnosis                                     | Owner                                          | §1 — candidate framings offered |
| Strategic-choice granularity                      | Owner (returning shortly)                      | §7 — gates the choice set       |
| How we win, per stream                            | Owner ("the advantages" — a larger discussion) | §4–6                            |
| What we won't do, per stream                      | Owner                                          | §4–6                            |
| Measures                                          | Owner + Oak analytics/research                 | §8                              |
| Search / graph / EEF — external vs internal-reuse | Owner                                          | §5                              |
| Internal-transformation alignment rationale       | Owner                                          | §6                              |

## Related

- [Vision](../../VISION.md) — the change and the two parts.
- [Controlling plan](../../.agent/plans/product-development-governance/vision-strategy-and-plan-estate.plan.md) —
  scope, sequencing, and acceptance for this corpus (Body 2).
- [Launch-readiness framework](../../.agent/plans/curriculum-mcp-path-to-ga/launch-readiness-framework.md)
  — the app's K1–K3 and Groups A–D readiness catalogue.
- [Compliance roadmap](../../.agent/plans/compliance/roadmap.md) — the
  production-blocking statutory set.
- [Editorial tone](../../.agent/directives/editorial-tone.md) — the voice this
  corpus is written in.
