# ADR-230: Own-built algorithm and data-structure foundations

**Status**: Accepted (owner direction, 2026-09-08). Implementation and
qualification remain separate delivery work.

**Date**: 2026-09-08

**Numbering**: recorded as ADR-229 on 2026-09-08; renumbered to ADR-230 on
2026-09-10 at the upstream sync that brought the upstream line's ADR-229 (the
MCP protocol-revision era record), under the cross-lineage rule in
`docs/engineering/pre-merge-analysis.md` §4d: upstream's sequence is
authoritative and the colliding record renumbers with every citation.

**Related**:
[ADR-041](041-workspace-structure-option-a.md) — repository dependency tiers;
[ADR-154](154-separate-framework-from-consumer.md) — general mechanism and
consumer separation;
[ADR-155](155-decompose-at-the-tension.md) — meaningful responsibility boundaries;
[ADR-173](173-graph-stack-topology.md) — existing graph stack, refined here for
implementation origin within this decision's scope;
[ADR-179](179-transport-agnostic-graph-substrate.md) — transport-independent substrate;
[ADR-226](226-agent-research-surface-for-imported-records.md) — historical research custody.

## Context

The Reliable Atoms programme seeks small, explicit, comprehensively assured
foundations whose guarantees can be reused across the estate. Graph and
non-graph reference research reveals useful mechanisms, contracts and failure
cases, but it does not itself settle who owns the resulting implementations or
which evidence transfers into a new composition.

On 8 September 2026, the owner decided to build our own algorithms and data
structures through Reliable Atoms and layers of composition, using the best
openly licensed examples as inspiration, and requested a governing document
and the reconciliation of the relevant documents. The owner's word,
verbatim, given on 9 September 2026 when this record was reconciled: "The
general decision here is to select the best, permissively licenced libraries,
and use their code as inspiration to create Reliable Atoms and composition
layers tailored to our needs and created to our deliberately very high quality
standards." On licences, the same day: "We don't need to cite licences when we
just exploring options, it is useful to have the licence data recorded and
available." This record homes that decision in the repository. The companion [governing policy](../foundations/algorithms-and-data-structures-governance-2026-09-08.md)
owns its operational detail, including scope, reference investigations,
authorship, qualification and effort assessment.

## Decision

OCE authors and maintains its own graph and non-graph algorithms and data
structures as Capability Foundations: small completed Primitives and meaningful
Components and Subsystems.
Reference research informs the mechanisms, contracts, representations,
structures and compositions. Each authored implementation and composition
establishes its own applicable qualification evidence. The alternative the
estate keeps for every other capability — a finished industry contract or
mature library adopted behind a thin conformance boundary — is not taken for
this class: the accepted cost is owning the implementation, assurance and
maintenance, with the whole-life effort saving an empirical hypothesis
(§Consequences), in exchange for foundations tailored to the estate's needs
at its own quality bar.

The governing policy is the canonical development policy for this scope. The
[bundle index](../foundations/foundations-bundle-index-2026-09-08.md) locates
the general architecture, graph capability contracts, candidate designs,
worked examples and source review. Those documents own their specified
concerns; this ADR owns the repository's decision to follow that policy.

### Repository interpretation

- Scope follows the owned algorithm or data-structure responsibility, covering
  new capability and deliberate replacement or reconstruction. Language/runtime
  assumptions and separately governed protocol, storage, transport and platform
  services keep explicit contracts and dependency boundaries.
- Owner-directed offered capability establishes legitimate programme scope,
  including innovation before existing applications consume it. Qualification
  establishes the promised behaviour. Package promotion separately establishes
  cohesion, consumption, release responsibility and compliance with repository
  dependency and workspace rules.
- Atom and composition boundaries follow invariant ownership and change
  cohesion. Logical composition levels and distribution units have distinct
  purposes. ADR-041 and ADR-154 continue to govern repository placement and
  framework/consumer separation.
- ADR-173 continues to own the existing graph-stack topology, its selected RDF
  profile and corpus-source boundaries. Within this decision's scope, new or
  deliberately reconstructed algorithm and data-structure mechanisms follow
  this implementation-origin policy. Reusable graph foundations may support
  several models; their integration into an existing stack must preserve that
  stack's declared semantic and source-authority contracts.
- Workspaces that hold Capability Foundations form a declared class,
  `workspaceClass: capability-foundations` (owner direction, 2026-09-14; the
  Reliable Atoms programme is the work's historical name), whose internal
  shape is budgeted stricter than the rest of the
  estate: directory cardinality by a blocking repository validator, and the
  length, complexity and clarity budgets at the class's own lint tier,
  compiler profile and assurance thresholds. ADR-166 §Amendment 2026-09-14
  records the scale ownership and the class-scoped budget rule; the
  programme's delivery node carries the values. The class binds shape, never
  placement — ADR-041 and ADR-154 still govern where such workspaces sit —
  and a workspace that does not fit the class's parameters is outside the
  class, never a reason to loosen them.
- Exact reference material and its applicable licence, revision, assumptions
  and actual use remain recorded. Existing observations retain their evidence
  scope and execution date. A familiar mechanism and a reference's successful
  tests supply design evidence; our qualification binds our actual contract
  and implementation.

## Consequences

The estate owns the implementation, assurance, documentation and maintenance
of the foundations it authors. Reusing engineering knowledge can reduce design
uncertainty; whole-life effort savings remain an empirical hypothesis to assess
through delivered capabilities and later changes.

Delivery can proceed through small coherent increments while retaining the
complete capability requirements. Candidate designs and worked expectations
remain clearly distinguished from qualified implementations. This documentation
change supplies the governing decision and design baseline; it changes no
runtime code or dependency manifest.

## Amendments

### 25 September 2026 — completion and adoption

The owner directed small, independently useful completed capabilities on
15–16 September and rejected consumer-count gates on 20 September. The
25 September adoption review and request for this PR receive that direction:

- Primitive independence includes runtime, type-only and semantic dependencies.
  Canonical Result consumers are composed; copying Result does not establish
  independence. Component and Subsystem name architectural grades; Mechanism
  and Facility name roles, not extra grades.
- Consumer count does not gate admission, qualification, publication or retention.
  Cohesion, declared dependencies and release responsibility still govern packages.
- Completion applies to the whole selected supported scope. Upfront proof and
  assurance investment closes that scope; defects reopen affected guarantees and
  new requirements define new scopes.
- The [adoption profile](../foundations/capability-foundations-adoption.md) owns
  the first-build contracts, TypeScript/Node profile, automatic-boundary obligations
  and data/API adoption criteria. Specification-version updates are routine
  maintenance of affected mappings, preserving evidence for unchanged laws.

The acquisition policy and existing placement authorities remain binding. This
amendment receives owner direction; it does not claim implementation, qualification
or ratification of a delivery sketch.
