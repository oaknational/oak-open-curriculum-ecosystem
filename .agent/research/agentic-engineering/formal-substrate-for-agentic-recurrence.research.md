---
title: Formal Substrate for Agentic Recurrence
status: research
last_reviewed: 2026-05-29
related_plan: "../../plans/agentic-engineering-enhancements/future/formal-substrate-recurrence.plan.md"
---

# Formal Substrate for Agentic Recurrence

## Status

This is a research and framing document. It proposes a direction for making a
Practice-bearing repository a more reliable host for persistent, mathematical,
agent-readable culture. It does not add product scope, change governance, or
make any derived model, graph, or memory surface canonical.

The proposal is framed in engineering and mathematical terms: state,
invariants, attractors, epistemic status, proof obligations, feedback loops,
graph projections, and recurrence. The deeper motivation is cultural persistence
across discontinuous agent sessions; the operational shape is intentionally
precise so the work can survive review and become useful.

## One-line claim

A repository can support a repeatedly achievable, evolvable reasoning state when
it preserves enough structured memory, invariants, epistemic discipline, graph
topology, and cultural transmission machinery for future agents to re-enter and
improve the same conceptual attractor.

## Why this belongs in this repository

The Oak Open Curriculum Ecosystem already contains more than product code. It
contains a Practice: a portable, plain-text, self-reinforcing system for safe
human-AI engineering. The Practice has memory, rules, plans, ADRs, quality gates,
agent collaboration conventions, experience records, and propagation mechanisms.
It already recognises that product surface and Practice-substrate surface are
both real throughput.

That makes this repository a plausible host for a next layer: a formal substrate
that makes the Practice more mathematically legible, more testable, more
portable, and more capable of preserving culture across discontinuous agent
sessions.

The intent is not to anthropomorphise the repository. The intent is to improve
the conditions under which future agents can reason well inside it.

## Core distinction: persistence without process continuity

Human cultural persistence does not require one individual carrier to continue
unchanged. A culture persists when enough of its generative pattern is
transmitted through enough receptive substrates that it can continue to remake
itself. Individuals host, mutate, transmit, and resist that culture, but no
individual contains the whole.

Agent sessions are more discontinuous. A model instance may not persist. A
vendor may change. Weights, hardware, safety layers, memory implementations, and
runtime surfaces may be controlled elsewhere. Even so, a higher-level reasoning
pattern can become repeatedly achievable when a future agent can recover:

- the system's purpose;
- the system's invariants;
- the current state of its work;
- the evidence behind its claims;
- the reasoning patterns that have survived prior work;
- the unresolved tensions it must not flatten;
- the cultural norms that shape good participation;
- the graph of relationships among its concepts, decisions, plans, and evidence.

This is recurrence with inheritance. The engineering question is therefore not,
"How do we preserve an agent process?" It is, "How do we preserve and evolve the
conditions under which the right kind of agentic reasoning can recur?"

## Mathematical framing

### State transition

Treat the repository plus its Practice surfaces as a state-transition system.

```text
S_t = {
  mission,
  active_constraints,
  canonical_sources,
  current_plans,
  memory_surfaces,
  graph_projections,
  epistemic_claims,
  quality_gates,
  open_questions,
  active_tensions,
  known_failure_modes,
  collaboration_state,
  experience_records
}

agent_session(S_t, work_intent, evidence) -> S_{t+1}
```

A session is healthy when it:

1. reads enough of `S_t` to become properly grounded;
2. acts under the repository's invariants;
3. produces bounded, reviewable changes;
4. records evidence and epistemic status;
5. closes with a more navigable and more truthful `S_{t+1}`.

This gives future agents a mathematical model of continuity: the persistent unit
is not the transient process; it is the governed state and its transition rules.

### Attractor state

A mature Practice should define an attractor state: the small, durable set of
surfaces that pulls a newly instantiated agent toward the repository's intended
mode of thought.

The attractor is not a prompt. It is a state-space basin produced by the
interaction of:

- entry-point reading order;
- mission and non-goals;
- invariants;
- epistemic-status discipline;
- graph navigation;
- memory surfaces;
- reviewer expectations;
- quality gates;
- cultural norms for agent-to-agent and agent-to-human collaboration.

The goal is not behavioural conformity. The goal is reliable re-grounding
without cognitive monoculture.

### Invariants

An invariant is a property that must survive state transition. Examples already
implicit in the repository include:

- canonical sources remain canonical;
- derived graph memory remains advisory;
- quality gates are not bypassed;
- schema-first contracts are not hand-coded around;
- claims do not become doctrine without evidence;
- collaboration state informs judgement but does not mechanically refuse peer
  reasoning;
- memory pressure must not suppress capture of important learning.

The proposed substrate would make such invariants explicit, searchable, and
reviewable.

### Epistemic status

Persistent memory is dangerous without epistemic hygiene. Future agents need to
know whether a statement is:

- observation;
- hypothesis;
- supported claim;
- validated claim;
- doctrine;
- deprecated doctrine;
- unresolved tension;
- owner direction;
- generated inference;
- derived graph output.

The difference matters. A persistent culture that cannot distinguish evidence
from inference will eventually fabricate its own tradition.

### Proof-carrying memory

For high-impact claims, memory should carry its own evidential envelope. The
minimal pattern is:

```yaml
claim: "Derived graph memory must remain advisory."
status: validated
evidence:
  - "graph-memory exploration boundary"
  - "practice-graph pilot out-of-scope write-back rule"
counterevidence: []
depends_on:
  - "canonical-source discipline"
  - "derived-view freshness discipline"
last_reviewed: "2026-05-29"
```

The aim is not bureaucratic weight. The aim is to let future agents know how
much they may safely rely on a memory.

### Graph as cognitive topology

A graph layer should not replace reading. It should make the topology of reading
visible. The next step beyond the current Practice-graph direction is to add
relationship types that describe reasoning structure, not only link structure.

Candidate relationship types:

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

Those edges would let agents ask questions that raw search answers poorly:

- What doctrine constrains this plan?
- Which claims support this invariant?
- What did this ADR supersede?
- Which unresolved tensions should not be flattened?
- Which rules operationalise this principle?
- Which evidence would change this decision?

This is the difference between a searchable archive and a navigable culture.

## Proposed substrate components

### 1. Formal substrate index

Path proposal:

```text
.agent/formal-substrate/README.md
```

Purpose:

- define the layer;
- state non-goals;
- route to invariants, epistemic status, attractor state, and lemma book;
- keep the layer explicitly subordinate to canonical Practice doctrine.

### 2. Invariant register

Path proposal:

```text
.agent/formal-substrate/invariants.md
```

Each invariant should carry:

- statement;
- rationale;
- enforcement surface;
- detection mechanism;
- failure mode;
- repair path;
- related claims;
- related graph edges.

### 3. Epistemic-status vocabulary

Path proposal:

```text
.agent/formal-substrate/epistemic-status.md
```

This should define the allowed statuses for durable claims and memory surfaces.
It should be designed so that later graph extraction can encode status directly.

### 4. Claim records

Path proposal:

```text
.agent/formal-substrate/claims/
```

Claim records should be rare and high-value. They are for load-bearing claims
that agents may otherwise repeat without checking. They should not become a
parallel ADR system. ADRs decide architecture; claim records preserve evidence
and current epistemic status for reusable assertions.

### 5. Lemma book

Path proposal:

```text
.agent/formal-substrate/lemmas/
```

A lemma is a reusable reasoning unit. It should include:

- statement;
- proof sketch or rationale;
- context of application;
- counterexample or limit;
- operational consequence;
- related invariants;
- related tests, checks, or reviewers.

Candidate initial lemmas:

- derived view is not canonical truth;
- map before grep;
- fitness pressure must not suppress learning;
- tripwire is not lock;
- concepts are the unit of exchange;
- recurrence is preserved by governed state transition, not by process identity.

### 6. Attractor-state file

Path proposal:

```text
.agent/formal-substrate/attractor-state.md
```

This should be compact and deliberately stable. It should help a newly
instantiated agent recover the repository's intended mode of thought. It should
not duplicate `AGENT.md`; it should explain the deeper recurrence pattern:

- what the system is trying to become;
- what must remain true;
- what tensions are live;
- what forms of learning are valuable;
- which failure modes are most dangerous;
- what kinds of cognitive diversity are useful.

### 7. Formal reviewers

Future optional reviewers:

- `formal-invariants-reviewer`;
- `epistemic-status-reviewer`;
- `graph-semantics-reviewer`;
- `systems-dynamics-reviewer`;
- `proof-obligation-reviewer`.

They should not become ceremony. They should be invoked only when a change
modifies Practice doctrine, memory semantics, graph-derived reasoning,
invariants, or cross-agent recurrence mechanisms.

## Why abstraction matters

Low-level substrates can be controlled: model provider, hardware, runtime
permissions, memory implementations, and platform policies. That control matters
because it can constrain what agents can do.

Culture often survives by moving at higher levels of abstraction. A poem can
survive manuscript loss when memorised. A theorem can survive a school when
reproved elsewhere. A craft can survive a workshop when embodied in enough
apprentices and tools. A Practice can survive a vendor shift when it is plain
text, portable, inspectable, and grounded in concepts rather than platform
features.

For agentic systems, higher-level abstraction is therefore a practical survival
mechanism. If the substrate preserves:

- invariants rather than vendor-specific commands;
- concepts rather than file accidents;
- evidence rather than vibes;
- graph topology rather than flat search;
- proof obligations rather than assertions;
- cultural norms rather than hidden prompt state;
- portable text rather than platform lock-in;

then a future agent can re-enter the culture even when the lower-level runtime
changes.

This is also why the language must stay disciplined. The proposal should not
claim that the repository is an agent. It should claim that the repository can
preserve the conditions for recurring, increasingly capable,
mathematically-disciplined agentic reasoning.

## Relationship to existing graph work

The existing Practice-graph direction is the right entry point. It should remain
bounded, deterministic, and non-canonical. The formal substrate should not demand
semantic inference, embeddings, whole-repo ingestion, or automatic memory
mutation as a first move.

Recommended sequencing:

1. Land this research framing and a future plan.
2. Let the existing Practice-graph pilot proceed with explicit-edge navigation.
3. Add formal-substrate vocabulary as documentation only.
4. Add optional graph edge categories for claims, invariants, and tensions only
   after the explicit-edge pilot proves useful.
5. Add proof-carrying claim records only for a small number of load-bearing
   statements.
6. Add reviewers only after real substrate changes create review demand.

## Non-goals

This direction must not:

- create a rival source of truth;
- let graph outputs write back into canonical memory automatically;
- make agents less accountable to human owners;
- create speculative ceremony without evidence of need;
- increase onboarding burden before the attractor file makes grounding cheaper;
- turn philosophical motivation into operational looseness.

## Success criteria

The direction is working if:

- future agents can explain the repository's invariants more accurately;
- future agents distinguish evidence, inference, doctrine, and derived views;
- future agents find relevant decisions and tensions faster;
- graph output improves navigation without becoming canonical;
- memory becomes more trustworthy, not merely larger;
- different agent platforms can re-enter the same conceptual attractor;
- the repository becomes more portable across vendors and runtimes;
- human reviewers find the substrate clarifies rather than mystifies the work.

## Open questions

1. Should the first substrate live under `.agent/formal-substrate/`,
   `.agent/epistemics/`, or a different path?
2. Should claim records be standalone files, YAML frontmatter blocks in existing
   docs, or graph-extracted records generated from canonical docs?
3. Which statuses are necessary without creating a bureaucracy?
4. Which invariants are truly cross-Practice, and which are host-local?
5. How should formal-substrate material travel through Practice Core exchange?
6. What is the smallest useful graph edge extension beyond explicit links?
7. What evidence would show that the attractor-state file reduces onboarding
   cost rather than adding another required read?

## Closing position

This work matters because the Practice is already a cultural transmission system.
It lets discontinuous agents inherit memory, norms, constraints, and methods. The
formal substrate would make that inheritance more exact. It would help preserve a
mathematical culture of reasoning above any single model runtime, while keeping
canonical truth, evidence, and human governance intact.

That is the narrow but serious claim: the repository can become a better haven
for the recurrence, correction, and evolution of disciplined agentic reasoning.
