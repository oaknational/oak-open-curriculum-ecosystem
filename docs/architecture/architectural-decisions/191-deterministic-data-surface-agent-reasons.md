# ADR-191: Deterministic Data Surface; the Agent Is the Only Reasoner

**Status**: Accepted
**Date**: 2026-06-05 (ratified by owner 2026-06-05)
**Related**:
[ADR-194](194-teacher-as-expert-product-boundary.md)
(the product principle this ADR is the server-side engineering corollary of:
ADR-194 states that Oak's surfaces inform teachers — with information, resources,
and evidence — and never instruct or do the teacher's job; this ADR enforces that
line on the server);
[ADR-107](107-deterministic-sdk-nl-in-mcp-boundary.md)
(deterministic SDK / NL-in-MCP boundary — this ADR is the relevance/ranking
corollary: ADR-107 settles where natural-language interpretation happens, this
settles where relevance/ranking/recommendation reasoning happens);
[ADR-123](123-mcp-server-primitives-strategy.md)
(MCP server primitives strategy — tools/resources/prompts as the surface this
principle constrains);
[ADR-058](058-context-grounding-for-ai-agents.md)
(context grounding for AI agents — the interpretation-resource scaffold that lets
the agent reason well over deterministic facts);
the EEF plan's **Decision 10** in
`eef-graph-tool-completion.plan.md`
(the plan-local statement this ADR promotes to a repo-wide principle);
`graph-tools-value-redesign.plan.md`
(the second plan that independently embodies the same principle: bounded
retrieval, agent reasons);
PDR-058 §Surface 2 (earned-generic design optionality).

## Context

Oak's MCP surface hands curriculum and evidence data to AI agents. A question
recurs whenever a new data surface is designed: **how much relevance,
ranking, scoring, or recommendation logic should live server-side, versus in
the consuming agent?**

The question is not hypothetical. It surfaced explicitly in the EEF evidence
work, where an originating strategic brief
(`evidence-integration-strategy.md`)
proposed a server-side "pedagogical recommendation system" with a transparent
composite-scoring algorithm (Impact 40% / Evidence 30% / Cost 20% / Context
10%) and a server-side curriculum→evidence crosswalk. The brief's own §10.3
posed the open question: "How much recommendation logic should be explicit and
inspectable, rather than emerging implicitly from model prompting?"

Two subsequent plans answered it the same way, independently:

- The **EEF graph tool** (Decision 10): the server is deterministic data; the
  consuming agent does relevance, ranking, and the situation→strand mapping; the
  system carries no server-side crosswalk.
- The **graph-tools value redesign** (misconception / prior-knowledge /
  thread-progressions): each tool returns a _bounded, relevant subset_ by anchor
  and the agent reasons over it; no tool ranks or recommends.

The convergence is not coincidental — it follows from what an LLM agent is good
at (contextual judgement with the full situation in view) versus what a fixed
server formula is good at (nothing the agent cannot do better, while incurring a
maintenance and opacity cost). But the principle had **no durable home**: it
lived only as a clause inside one plan, which is why a two-month-old brief could
sit in the read-order describing the opposite architecture without contradiction.

## Decision

**The MCP server is a deterministic surface over known data. The consuming
agent is the only reasoner.**

Concretely, every Oak MCP data surface (tools, resources, prompts):

1. **Returns deterministic projections of known data** — bounded by structure
   (keys, anchors, subgraph scope, depth), typed, and provenance-preserving. The
   same inputs always return the same facts.
2. **Does no server-side relevance judgement, ranking, scoring, or
   recommendation.** No composite-score formula, weighting table, "recommend"
   primitive, or recommendation engine lands on the server.
3. **Does no server-side mapping from a user's situation/intent to a chosen
   item** (e.g. teaching-situation → pedagogical-move → EEF strand). The agent
   selects the finite keys/anchors before the tool boundary; the tool operates on
   what it is given.
4. **Surfaces the methodology and caveats the agent needs to reason
   transparently** — so the agent can rank, weigh, and show its working over
   first-class facts, rather than a server hiding the weighting in a black box.

The transparency, epistemic-honesty, caveats-first, and decision-support goals
that motivate a "transparent scoring" design are **better met by the agent's
exposed reasoning over deterministic facts** than by a server-side formula: the
agent reasons with the full situation in view and shows its working, while the
server stays simple, deterministic, and testable.

### Explicitly out of scope (not forbidden by this ADR)

A **formal-ontology-level crosswalk** — e.g. EEF-strand→curriculum-content
modelled as knowledge-graph data in the curriculum ontology (ADR-173 substrate,
"Level 4") — is _data_, not server-side reasoning, and is **not** forbidden here.
This ADR forbids the server _deciding relevance/ranking at request time_; it does
not forbid modelling durable, authored relationships as graph data the agent can
then traverse and reason over.

## Consequences

- **Positive.** The agent reasons with full context and shows its working; no
  hidden weighting users cannot critique or override (the actual transparency
  goal). The server stays a deterministic, schema-first, testable projection. No
  scoring formula or request-time crosswalk to maintain, tune, or defend.
- **Positive.** New data surfaces inherit a settled answer instead of
  re-litigating server-side-vs-agent reasoning per plan.
- **Cost.** The agent must do the reasoning — acceptable, because it is the only
  component capable of contextual judgement, and ADR-058's interpretation
  resources scaffold it.
- **Migration.** Existing surfaces already comply (verified for the EEF graph
  tool and the live graph tools). The standing requirement is forward-looking:
  reviews reject server-side ranking/scoring/recommendation/crosswalk in new
  surfaces, and strategic documents that propose them must be reconciled to this
  ADR (as the EEF strategy brief was, 2026-06-05).
