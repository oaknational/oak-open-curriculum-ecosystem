---
title: Graph semantics
collection: parallax
version: "0.1.0"
status: evaluation-ready
empirical_validation: not-yet-validated
last_updated: "2026-08-02"
licensing: host-repository-governs
---

# Graph semantics

Parallax has no single “the graph.” Different projections answer different questions and preserve different invariants. Treating them as one DAG would conflate reusable capabilities, one execution, artifact ancestry, conceptual scale, and long-term learning.

## Graph family

| Graph | Shape | Nodes | Edges | Primary question |
|---|---|---|---|---|
| Catalogue | Flat registry with informative links | Skills and external capability classes | membership, specialisation | What can be discovered? |
| Invocation | Guarded typed multigraph | Skills | enables, complements, inhibits, audits, escalates, reopens | When and how may capabilities relate? |
| Capability–artifact | Directed bipartite graph | Skills and artifact types | consumes, produces, validates | How does work compose portably? |
| Inquiry-state | Guarded cyclic state machine | Inquiry states | transition, stop, reopen | What states and revisitations are legitimate? |
| Run | Bounded DAG | Skill invocations and joins for one revision | precedence and data dependency | What will execute now? |
| Provenance | Append-only DAG | Artifact revisions and events | derived-from, supersedes, responds-to | Why does this result exist? |
| Scale/decomposition | Typed potentially cyclic multigraph | scale regions, bases, constructs, bridge claims | aggregates, decomposes, causes, constrains, maps | Across what scales and conceptual bases do claims travel? |
| Learning | Feedback network realised as revision DAG | outcomes, learning signals, proposals, evaluations, skill versions | observes, proposes, tests, approves, updates | How does later evidence change future inquiry? |

Machine-readable definitions in `graphs/` share the core shape:

```json
{
  "graph_id": "example",
  "title": "Example graph",
  "description": "Purpose and interpretation.",
  "nodes": [
    { "id": "node-a", "label": "Node A", "type": "capability" }
  ],
  "edges": [
    {
      "from": "node-a",
      "to": "node-b",
      "type": "enables",
      "guard": "A relevant output exists"
    }
  ]
}
```

Graphs may add metadata, node attributes, edge attributes, or hyperedges using `sources` and `targets`. Simple edges always retain `from` and `to`.

## Catalogue graph

The catalogue graph is deliberately shallow. Agent Skills discovery sees independently installable skills rather than a hierarchy of runtime dependencies.

```mermaid
graph LR
    C[Parallax collection]
    C --- P[parallax]
    C --- F[parallax-frame]
    C --- Q[parallax-design-inquiry]
    C --- E[parallax-design-experiment]
    C --- X[parallax-product-experiment]
    C --- S[parallax-synthesise]
    C --- D[parallax-decide]
    C --- A[parallax-audit]
    C --- L[parallax-learn]
```

This projection communicates membership, not invocation precedence.

## Invocation graph

The invocation graph is enduring and cyclic. Guards are predicates over task signals, inquiry artifacts, permissions, resources, stakes, and current state.

```mermaid
graph TD
    P[parallax]
    F[frame]
    Q[design inquiry]
    E[design experiment]
    X[product experiment]
    S[synthesise]
    D[decide]
    A[audit]
    L[learn]

    P -->|routes| F
    P -->|routes| Q
    P -->|routes| E
    P -->|routes| X
    F -->|enables| Q
    Q -->|specialises| E
    E -->|specialises / overlays| X
    Q -->|evidence enables| S
    E -->|evidence enables| S
    X -->|evidence enables| S
    S -->|enables| D
    A -. audits .-> P
    A -. audits .-> S
    A -. audits .-> D
    S -->|reopens| F
    D -->|outcomes enable| L
    L -->|updates future policy| P
```

## Capability–artifact graph

This bipartite graph is the portable composition protocol. Capability-to-capability sequencing is derived through artifacts rather than hard-coded calls.

```mermaid
flowchart LR
    subgraph Skills
        F[Frame]
        Q[Design inquiry]
        E[Design experiment]
        PX[Product experiment]
        S[Synthesise]
        D[Decide]
        L[Learn]
    end
    subgraph Artifacts
        IC[(Inquiry Charter)]
        FS[(Frame Set + Scale Map)]
        ID[(Inquiry Design)]
        ED[(Experimental Design)]
        PO[(Product Experiment Overlay)]
        MR[(Method Reports + Evidence)]
        EP[(Epistemic Profile)]
        WR[(Decision + World-Return)]
        OE[(Outcome Events)]
        LS[(Learning Signal)]
    end

    IC --> F --> FS --> Q --> ID
    ID --> E --> ED --> PX --> PO --> MR
    ID --> MR
    MR --> S --> EP --> D --> WR --> OE --> L --> LS
```

The diagram omits validation and reopening edges for readability; the manifest retains them.

## Inquiry-state graph

The state graph is cyclic in semantics. A reopening creates a new inquiry revision; it does not erase or mutate prior history. Inquiry state and artifact `lifecycle_state` describe operational progression; both remain distinct from common epistemic `status`. A completed execution may yield an inconclusive artifact, and a ready-to-run protocol may remain provisional.

```mermaid
stateDiagram-v2
    [*] --> Screening
    Screening --> Declined
    Screening --> Active
    Active --> EvidenceReady
    EvidenceReady --> Synthesised
    Synthesised --> Decided
    Decided --> Monitoring
    Monitoring --> Closed
    Monitoring --> Reopened
    Reopened --> Active
    Synthesised --> Reopened
    Declined --> [*]
    Closed --> [*]
```

## Materialised run DAG

A run graph is generated for one revision from the enduring capability graph plus current state, depth, resources, profiles, permissions, and budget.

```mermaid
flowchart LR
    C[Charter r3]
    F1[Counterframe pass]
    M1[Repository evidence]
    M2[User research evidence]
    M3[Product experiment design]
    J{Protected synthesis join}
    S[Synthesis]
    A[Audit]
    D[Decision]

    C --> F1
    F1 --> M1
    F1 --> M2
    F1 --> M3
    M1 --> J
    M2 --> J
    M3 --> J
    J --> S --> A --> D
```

If audit reopens framing, revision r3 completes with a reopen event and a new r4 run DAG is materialised. A cycle never appears inside the immutable r3 provenance.

## Provenance DAG

```mermaid
flowchart TB
    C1[Charter r1]
    F1[Frame Set r1]
    E1[Evidence Plan r1]
    S1[Synthesis r1]
    R[Reopen Event]
    C2[Charter r2]
    F2[Frame Set r2]

    C1 -->|derived-from| F1
    F1 -->|derived-from| E1
    E1 -->|derived-from| S1
    S1 -->|triggered| R
    R -->|creates revision| C2
    C1 -->|superseded-by, not erased| C2
    C2 --> F2
```

`supersedes` is not deletion. Consumers must be able to distinguish latest-effective, historical, retracted, and contested artifacts.

## Scale and decomposition graph

Nodes may denote scale regions, frames, constructs, or claims. Bridge and crosswalk claims are first-class nodes when their own evidence and uncertainty matter.

```mermaid
graph LR
    U[Individual user/session]
    J[Journey over weeks]
    O[Organisation and service]
    P[Public/ecosystem impact]
    B1((Aggregation bridge))
    B2((Theory-of-change bridge))
    UX[Behavioural basis]
    DX[Accessibility/dignity basis]
    CX((Partial crosswalk))

    U --> B1 --> J
    J --> B2 --> O
    O --> P
    UX --> CX --> DX
```

Unsupported arrows are not innocuous visual shortcuts; they are ungrounded inferences.

## Learning graph

The learning graph contains conceptual feedback but is operationalised with immutable versions:

```mermaid
flowchart LR
    O[Outcome portfolio]
    LS[Learning signals]
    IP[Improvement proposal]
    EV[Baseline + regression evals]
    AR{Practice approval}
    SV[New canonical skill version]
    FR[Future runs]
    FO[Future outcomes]

    O --> LS --> IP --> EV --> AR
    AR -->|approve| SV --> FR --> FO --> O
    AR -->|reject/revise| LS
```

No node autonomously rewrites a skill. Governance is part of the graph, not an administrative afterthought.

## Graph validity invariants

- Node identifiers MUST be unique within a graph.
- Every simple edge endpoint MUST resolve to a node.
- Every hyperedge source and target MUST resolve to a node.
- Edge types MUST have declared semantics in this document or graph metadata.
- Guarded edges MUST use observable or explicitly assessable conditions.
- A run graph MUST be acyclic and bounded.
- Provenance edges MUST not create cycles.
- Reopening MUST create a new revision identity.
- A diagram MUST NOT imply a cross-scale or cross-basis bridge absent from the artifact set.
- Generated Mermaid views SHOULD be checked against manifests when tooling is available.
