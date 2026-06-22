---
title: Vision
status: active
last_reviewed: 2026-06-20
---

# Vision

Oak's mission is to

> _"improve pupil outcomes and close the disadvantage gap by supporting
> teachers to teach, and enabling pupils to access, a high-quality curriculum."_

Oak has built a high-quality, open, fully sequenced, fully resourced curriculum.
This repository turns that curriculum into AI-native infrastructure — for the
teachers and the wider ecosystem who use it — and it's where we're learning to
build and curate everything we make, agent-first, so we can.

It comes down to one challenge: **deliver Oak's rigour at reach and at pace** — keep
what makes the curriculum trustworthy intact (rigour) while bringing it to where
teachers and the ecosystem now work (reach), fast enough to matter (pace). Those pull
apart unless we choose well.

Two things are changing here to meet that challenge, and they hold each other up. We're
bringing Oak's curriculum to where teachers and the ecosystem can use it through AI. And
to do that with the rigour it demands, at the pace it needs, we're transforming how we
build and curate digital products — working agent-first, with our people firmly in the
lead. The transformation is how we deliver the mission work; it's also worth sharing in
its own right.

## Part one — Oak's curriculum, AI-native

We enable access to and use of Oak's curriculum in two of the ways Oak serves its
mission: for teachers, and for the wider ecosystem. (Serving schools directly is
Oak's work elsewhere, not this repository's.) Oak owns the curriculum; we're a way
to reach it and build with it.

### For teachers — Oak inside the AI assistants they already use

The web and AI assistants are two co-equal, complementary ways teachers reach Oak.
They don't compete — they reinforce each other, and AI has a place in both. This
repository delivers [the AI-assistant side](docs/strategy/stream-mcp-app.md): a [Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro) (MCP) [app](https://modelcontextprotocol.io/extensions/apps/overview) that puts Oak inside the AI
assistants teachers already choose — ChatGPT, Claude, Gemini and others — bringing
Oak's standards into the tools they already use to plan lessons and prepare. Which
assistant is the teacher's choice, not ours.

What comes back is grounded in Oak's sequenced, evidence-informed curriculum, not
ungrounded invention. We inform the teacher's expert judgement; we never replace
it. That's how Oak works: the curriculum is optional and fully adaptable, and the
teacher decides what's right for their context — we're there to inform that choice,
not to push Oak as the only answer.

### For the wider ecosystem — open tools for open educational data

Anyone building with open educational data should be able to do it well. We provide
[a typed TypeScript SDK (with Python to follow), a semantic search service, and
curriculum graph tools](docs/strategy/stream-engineering-tools.md). And we bring open resources together: alongside Oak's own
data we draw in openly licensed evidence from other organisations in the sector —
such as the [Education Endowment Foundation's Teaching and Learning Toolkit](https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit) —
so what we surface is grounded in the wider evidence base, not Oak alone. The code is open;
each data source stays under its own upstream open licence, attributed to whoever
created it.

## Part two — agent-first product creation and curation

Building AI-native infrastructure to Oak's standard, at pace, takes a different way
of working. We build and curate our products agent-first, across the whole product
lifecycle and not just the code, with people leading throughout.

This amplifies our teams; it doesn't replace them. Agents take on the toil and the
scale; our people bring the judgement, expertise, taste, and accountability that
decide whether the work is any good. It's the same principle we hold for teachers,
turned on ourselves: the human expert leads, and what we build amplifies them. It
lets us be more ambitious, not smaller.

We share how we do this. Our [framework for agent-first delivery](docs/strategy/stream-agentic-framework.md) is openly
documented and freely available, so other teams — inside Oak and beyond — can adopt
it. We aim to be a useful exemplar: for agent-first delivery with excellence at its
centre, applied across all of digital product and service work, and for bringing
open educational data projects together to make a real difference.

### Building capabilities

We're building capabilities that outlast any single product. Representing knowledge
as graphs is one of them — we apply it across domains, from Oak's curriculum to
AI-enhanced development and the way we run our own work.

## How we achieve this

- **Our strategy** — the [strategy corpus](docs/strategy/README.md): the diagnosis,
  the choices we make per value stream, and how we'll know it's working.
- **What we build, and the order we build it in** — the
  [high-level plan](.agent/plans/high-level-plan.md) and the plans it indexes; the
  live inventory of products and components is in the [README](README.md).
- **How we build it safely and fast** —
  [How the Agentic Engineering System Works](docs/foundation/agentic-engineering-system.md)
  and
  [ADR-119](docs/architecture/architectural-decisions/119-agentic-engineering-practice.md):
  Oak's agentic engineering Practice.
- **Where the work has reached** — the [reports surface](.agent/reports/).
- **Openness and licensing** — the code is MIT; Oak's curriculum stays under its
  upstream open licence. See [LICENCE-DATA.md](LICENCE-DATA.md).

## The boundaries we hold

One principle runs through everything, at every level: the human expert leads, and
what we build amplifies them rather than deciding for them.

- **For teachers** — the teacher is the expert; we inform, we never decide. See
  [ADR-194](docs/architecture/architectural-decisions/194-teacher-as-expert-product-boundary.md).
- **For our own teams** — agent-first work amplifies our people; it doesn't replace
  them.
