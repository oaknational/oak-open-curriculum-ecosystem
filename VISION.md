---
title: Vision
status: active
last_reviewed: 2026-06-17
---

# Vision

Oak National Academy's mission is to

> _"improve pupil outcomes and close the disadvantage gap by supporting
> teachers to teach, and enabling pupils to access, a high-quality curriculum."_

Oak has created a high-quality, open, fully sequenced, fully resourced
curriculum. We are here to enable access and use. This repository supports that
in two ways:

1. By creating an MCP app that puts Oak inside the AI assistants (ChatGPT,
   Claude, Gemini and others) that teachers already use.
2. By providing a set of engineering tools to the wider ecosystem for working
   with Oak's curriculum data: a generated, type-safe TypeScript SDK, a semantic
   search service, graph tools generated from Oak data, and evidence surfaces
   grounded in the wider education sector.

## What We're Changing

Oak's curriculum is open, fully sequenced, and evidence-informed. Reaching it
well is still too hard: teachers meet AI assistants that invent answers instead
of drawing on a curriculum they can trust, and teams building tools for schools
rebuild the same curriculum plumbing from scratch.

We turn Oak's curriculum into AI-native infrastructure. That changes two things
at once — neither secondary, both running on one body of work built once:

- **Oak reaches teachers where they already work.** Inside the AI assistants
  teachers use, what comes back is grounded in Oak's sequenced,
  evidence-informed curriculum, not invented. The teacher stays the expert; we
  inform with evidence, and we never instruct.
- **The wider ecosystem builds on open foundations.** Anyone building for
  schools can build on typed, openly licensed, evidence-grounded components —
  SDK, semantic search, curriculum graph, MCP — instead of starting from
  scratch.

## Why It Matters

When what reaches teachers is grounded in a high-quality curriculum, the
integrity of what reaches pupils is protected, and the work of planning gets
lighter. That's Oak's mission, happening wherever teachers and their tools are —
not only on Oak's own site.

And it compounds. Because the infrastructure is built once and reused — across
Oak's products, the wider sector, and the AI assistants teachers already reach
for — a single public asset multiplies into impact at system scale.

## How We Achieve This

- **Our strategic goals** — defined by the strategy (in development; not yet
  linked here).
- **What we build, and the order we build it in** — the
  [high-level plan](.agent/plans/high-level-plan.md) and the strategy documents
  it indexes; the live inventory of products and reusable components is in the
  [README](README.md).
- **How we build it safely and fast** —
  [How the Agentic Engineering System Works](docs/foundation/agentic-engineering-system.md)
  and
  [ADR-119](docs/architecture/architectural-decisions/119-agentic-engineering-practice.md):
  Oak's agentic engineering Practice, the operating system for delivery.
- **Where the work has reached** — the [reports surface](.agent/reports/).
- **The boundaries we hold** —
  [ADR-194](docs/architecture/architectural-decisions/194-teacher-as-expert-product-boundary.md):
  the teacher is the expert, we inform and never decide, and this is not a
  surface that learners use directly.
- **Openness and licensing** — the code is MIT; Oak's curriculum stays under its
  upstream open licence. See [LICENCE-DATA.md](LICENCE-DATA.md).
