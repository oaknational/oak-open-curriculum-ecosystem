---
name: "Formal Substrate for Agentic Recurrence"
overview: "Future plan to explore a formal, mathematical substrate for making Practice memory, invariants, epistemic status, and graph topology more reliable across discontinuous agent sessions."
status: future
graph_layer: feature
graph_portfolio_index: "../../graph-portfolio-index.md"
related_research:
  - "../../../research/agentic-engineering/formal-substrate-for-agentic-recurrence.research.md"
---

# Formal Substrate for Agentic Recurrence — Future Plan

## Status

This is a **future** plan. It is not approved for implementation. It records a
coherent direction, candidate artefacts, promotion gates, and non-goals so the
work can be revisited without re-deriving the framing.

The associated research document is
[`formal-substrate-for-agentic-recurrence.research.md`](../../../research/agentic-engineering/formal-substrate-for-agentic-recurrence.research.md).

## Problem

The Practice already gives this repository durable agentic engineering memory:
napkin, distilled learning, patterns, plans, ADRs, collaboration state,
experience records, rules, directives, and quality gates. The repository also
has emerging graph-memory work through the Practice-graph pilot.

What it does not yet have is a deliberately formal substrate that makes the
Practice's persistent reasoning state explicit as:

- invariants;
- epistemic-status vocabulary;
- proof-carrying claims;
- reusable reasoning lemmas;
- an attractor-state summary for future sessions;
- graph relationships that describe claim, constraint, tension, and evidence
  structure rather than only document linkage.

Without that layer, future agents can still inherit culture, but they may inherit
it unevenly: over-trusting derived views, flattening live tensions, repeating
unsupported claims, or missing the distinction between doctrine, evidence,
hypothesis, and generated inference.

## Intent

Explore whether a small formal-substrate layer can make the Practice more
mathematically legible, more portable, and safer to re-enter across discontinuous
agent sessions.

The intended result is not a new authority layer. The intended result is a
clearer map of the existing authority, evidence, memory, and reasoning structure.

## Strategic thesis

A Practice-bearing repository can preserve more than instructions. It can
preserve the conditions for a recurring, corrigible, agent-readable reasoning
state when its memory is structured by invariants, evidence, epistemic status,
feedback loops, and graph topology.

The persistent unit is not an agent process. The persistent unit is governed
state plus transition rules:

```text
agent_session(S_t, work_intent, evidence) -> S_{t+1}
```

This plan asks whether the repo should make that model explicit, and if so, how
small the first useful version can be.

## Non-goals

This plan must not:

- create a rival source of truth;
- treat derived graph output as canonical;
- add automatic write-back from graph output into canonical memory;
- weaken human ownership or owner direction;
- add speculative ceremony without evidence of need;
- add mandatory onboarding burden before proving the attractor summary reduces
  grounding cost;
- duplicate existing ADR, plan, or Practice Core roles;
- promote philosophical language without an operational contract.

## Candidate substrate shape

If promoted, the likely documentation surface is:

```text
.agent/formal-substrate/
  README.md
  attractor-state.md
  epistemic-status.md
  invariants.md
  claims/
  lemmas/
```

This path is a proposal, not a decision. Alternatives include
`.agent/epistemics/` or extending existing Practice Core surfaces.

### README

Defines the layer, its non-goals, its authority boundary, and routing to the
other files. It must state explicitly that canonical Practice doctrine remains in
existing authoritative surfaces.

### Attractor state

A compact, stable file that helps a newly instantiated agent recover the repo's
intended mode of thought without re-reading every deep source immediately. It
should complement, not replace, `AGENT.md` and start-right workflows.

### Epistemic status

A controlled vocabulary for durable statements: observation, hypothesis,
supported claim, validated claim, doctrine, deprecated doctrine, unresolved
tension, owner direction, generated inference, and derived graph output.

### Invariants

A register of properties that should survive state transition, with rationale,
enforcement surface, detection mechanism, failure mode, and repair path.

### Claims

Rare, high-value, proof-carrying claim records for load-bearing reusable
assertions. These do not decide architecture. They preserve evidence envelopes
for claims future agents may rely on.

### Lemmas

Reusable reasoning units: statement, proof sketch, limits, operational
consequence, related invariants, and related validation surfaces.

## Relationship to existing graph work

This plan should not bypass the Practice-graph pilot. The Practice-graph pilot is
already the correct first implementation lane for derived navigation over the
Practice estate.

The formal-substrate direction should wait for, or align with, that pilot. It can
then evaluate whether additional graph edge types are worth adding:

- `SUPPORTS_CLAIM`;
- `CONSTRAINS`;
- `GENERALISES`;
- `SPECIALISES`;
- `CONTRADICTS`;
- `SUPERSEDES`;
- `REQUIRES_EVIDENCE_FROM`;
- `IMPLEMENTS_INVARIANT`;
- `RAISES_TENSION_WITH`;
- `RESOLVES_TENSION`.

These edges must remain derived, navigational, and evidence-linked. They do not
replace the source documents.

## Promotion gates

Promote this plan from `future/` only when all of the following are true:

1. The owner confirms that formal-substrate exploration is still desirable.
2. The Practice-graph pilot has either shipped enough evidence to inform the
   substrate shape, or the owner explicitly chooses a docs-only substrate slice
   before graph work continues.
3. A first substrate slice is chosen and bounded to at most three new documents.
4. The authority boundary is written before any claim or invariant register is
   created.
5. A validation approach exists for proving that the substrate reduces confusion
   or improves re-grounding.
6. The plan names whether the first slice is host-local only or intended to
   inform Practice Core evolution later.

## Candidate implementation slices

### Slice A — Authority and vocabulary only

Smallest useful slice:

- `.agent/formal-substrate/README.md`
- `.agent/formal-substrate/epistemic-status.md`
- documentation propagation to `practice-index.md` if required

Success signal: future agents can classify statements without inventing a
private status vocabulary.

### Slice B — Attractor state

Add:

- `.agent/formal-substrate/attractor-state.md`
- a short reference from `AGENT.md` or the practice index only if owner-approved

Success signal: a future agent can explain the repo's intended reasoning posture
more accurately and faster than by raw search alone.

### Slice C — Invariant register

Add:

- `.agent/formal-substrate/invariants.md`
- initial entries for derived-view non-canonicity, quality-gate integrity,
  schema-first authority, and evidence-before-doctrine

Success signal: agents can identify what must not be broken and where each
invariant is enforced.

### Slice D — Proof-carrying claims

Add a tiny `claims/` surface with one or two records only if a real repeated
claim-dependence problem appears.

Success signal: high-impact assertions become easier to audit and harder to
repeat without evidence.

### Slice E — Lemma book

Add a tiny `lemmas/` surface only if reasoning patterns are repeating across
plans, ADRs, or reviews and need a stable reusable form.

Success signal: agents reuse compact reasoning units instead of re-deriving the
same arguments inconsistently.

### Slice F — Graph edge extension

Add claim, invariant, and tension edge categories only after explicit-edge graph
navigation has proved useful.

Success signal: graph output answers relationship questions that search and
manual reading answer more slowly, while citing canonical sources.

## Validation approach

Because this is a documentation and Practice-substrate direction, validation
should focus on clarity, re-grounding, and reduced error rate rather than code
coverage alone.

Candidate validation methods:

- onboarding simulation before/after the attractor-state file;
- reviewer pass asking whether authority boundaries are clearer;
- future-agent task asking for doctrine/evidence/inference classification;
- graph query task comparing raw search against formal-substrate topology;
- consolidation pass checking whether new surfaces reduce or increase
  documentation duplication;
- fitness check ensuring the substrate does not become another bloated entry
  point.

## Risks

| Risk | Mitigation |
|---|---|
| Formal substrate becomes a rival doctrine layer | Authority boundary in README before any deeper artefact |
| Onboarding burden increases | Attractor state must prove it reduces grounding cost |
| Speculative language weakens credibility | Keep operational contracts, non-goals, and validation gates explicit |
| Claim records duplicate ADRs | Claims preserve evidence status; ADRs decide architecture |
| Graph output becomes over-trusted | Derived-view non-canonicity invariant and citation requirement |
| Too many statuses create bureaucracy | Start with vocabulary only; add records only when needed |
| Practice Core scope expands prematurely | Keep first slice host-local unless separately promoted |

## Open questions

1. Which path should host the substrate?
2. Is `formal-substrate` the right name, or should the repo prefer
   `epistemics`, `reasoning-substrate`, or another term?
3. What is the minimal epistemic-status vocabulary that avoids bureaucracy?
4. Should invariant entries be freeform markdown, structured YAML blocks, or
   graph-extractable hybrid documents?
5. Should the attractor state be a required read at session start or an optional
   recovery tool?
6. Which elements, if any, belong in Practice Core after host-local evidence?
7. What is the smallest useful proof-carrying claim record?

## Closeout expectation for a future promoted plan

A promoted execution plan should close by answering:

- What did the substrate make easier to understand?
- What confusion did it prevent?
- What did it add to onboarding cost?
- Which surfaces should stay, graduate, split, or be removed?
- Did it remain clearly subordinate to canonical Practice doctrine?
- Did it strengthen or weaken the existing Practice-graph direction?

## Current disposition

Do not implement yet. Preserve the research framing and this plan as a future
option. Revisit after owner direction and after enough graph-memory work exists
to judge whether formal substrate should be documentation-only, graph-integrated,
or held as research.
