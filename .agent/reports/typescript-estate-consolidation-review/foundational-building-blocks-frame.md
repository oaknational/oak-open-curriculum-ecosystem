# Foundational building-block promotion frame

**Status:** live owner framing, recorded before the first estate-wide run

**Scope:** decision frame for this review; not an architectural authority or a
production-change authorisation

**Continuity:** the seat remains live; this is not a handoff

## Why this frame exists

The enduring, portable pattern has its own identity in
[PDR-135](../../practice-core/decision-records/PDR-135-cost-of-change-gradient.md)
and a human-facing guide in
[`docs/foundation/cost-of-change-gradient.md`](../../../docs/foundation/cost-of-change-gradient.md).
Its software-architecture projection lives in
[`docs/architecture/foundations-first.md`](../../../docs/architecture/foundations-first.md).
This document is one evidence application; it does not own the concept.

The long-standing owner strategy is foundations first:

1. create low-level software building blocks of the highest quality and
   strictest validation;
2. compose those blocks into foundational systems designed for long-term
   architectural excellence;
3. build well-tested and well-validated libraries on those foundations; and
4. compose the libraries into digital products and services that deliver real
   value to real people.

The destination was deliberately not disclosed during the earliest sweep. That
kept the observation phase broad and reduced the risk of forcing every repeated
form into a predetermined `packages/core/` story. The strategy did not change.
What changed was this review's epistemic frame: it now knows the programme that
its evidence is intended to inform.

This review therefore has two related purposes. It must still distinguish
harmful duplicated responsibility from purposeful similarity, and it must now
identify which genuinely shared, low-context mechanisms could become excellent
core building blocks. It remains evidence-only: later package extraction and
delivery require their own ratified plans and TDD landings.

## Two steps back

### First metacognitive pass: from counts to responsibility

The fluent starting shape was a list of popular structures and algorithms,
followed by a duplication search. Generated code and the curriculum SDK exposed
the weakness of that shape. A repeated carrier can be caused by one generator;
an apparently local helper can be a symptom of a missing SDK capability; and a
frequent construct can have little architectural importance.

The useful unit of analysis is therefore not syntax alone. It is a
**responsibility and its change path**:

`authority -> implementation or generator -> package surface -> consumer -> shipped composition`

Frequency remains valuable because it finds amplification. Authority and
consumer evidence determine whether the amplification is accidental,
purposeful, or already centralised.

### Second metacognitive pass: from consolidation to innovation economics

From farther away, this is not primarily a code-tidiness exercise. It is the
construction of a cost-of-change gradient. Recurring, context-independent
mechanics and their assurance burden should be absorbed by the lowest coherent
layer. Higher layers should spend their complexity budget on domain capability,
product policy, experience, and human need.

The review is looking for places where innovation currently pays the same cost
more than once. If one responsibility is independently implemented in `n`
consumers, a change can require `n` rounds of discovery, implementation,
validation, documentation, review, and maintenance. An excellent shared block
changes that shape to one implementation and assurance cost plus thin,
consumer-specific composition.

The phrase **near-zero cost of innovation** is a directional claim about the
marginal cost of reusing already-understood software mechanics. It does not
erase the irreducible cost of understanding people, choosing product policy,
learning from the world, or integrating genuinely different contexts. It means
those higher-value costs are no longer multiplied by avoidable reinvention
underneath them. The later programme needs an explicit denominator: adoption,
change footprint, assurance burden, cognitive load, and total ownership cost
are distinct claims.

## Observations, inferences, and hypotheses

| Epistemic kind | Statement |
| --- | --- |
| Observed doctrine | `packages/core/` owns provider-neutral foundational primitives with minimal dependencies; dependencies flow upward through foundation libraries and SDKs to thin apps. |
| Observed doctrine | Single-consumer abstractions are not extracted; generated contract and API forms are cured at their semantic authority or generator. |
| Observed doctrine | Testing, evaluation, assurance, and real-world value signals prove different claims; one green path never proves another. |
| Observed estate fact | The frozen review covers every tracked TypeScript and TSX file, including generated carriers and the curriculum SDK, and preserves authored/generated and verification/non-verification partitions. |
| Inference | Duplicated responsibility is a direct source of change amplification and therefore a direct constraint on innovation. |
| Inference | Similar syntax without shared responsibility is not an extraction warrant; its consolidation can increase coupling and cost. |
| Inference | A core package pays off only when its public contract is more stable and cheaper to consume than the independent forms it replaces. |
| Hypothesis to test | The estate contains repeated production mechanisms whose context-free portion can be placed in `packages/core/` and consumed by at least two independent production owners. |
| Hypothesis to test | Some high-volume generated repetition will identify generator-level building blocks or cures rather than runtime packages. |
| Hypothesis to test | Change-history, consumer, and boundary evidence will rank some lower-frequency mechanisms above more frequent syntax in innovation-cost leverage. |

## The architectural value stack

This is the working placement model for interpreting candidates. It applies the
repository's existing context-specificity gradient; it does not create a new
topology. Context specificity is a second axis across all layers rather than a
synonym for a layer.

| Layer | Responsibility | Desired form | Placement test |
| --- | --- | --- | --- |
| Semantic authority and generation | Define canonical contracts and derive repeated carriers | One authoritative input and deterministic generators; simple consumers | Is the repetition a projection of schema or source data that should never be hand-authored? |
| Core building blocks | Context-independent types, pure mechanisms, boundary contracts, and provider-neutral primitives | Small coherent `packages/core/` packages; minimal external dependencies; no upward monorepo dependencies | Could two independent, non-Oak-specific consumers use the contract unchanged? |
| Foundational systems | Compose core blocks into reusable runtime capabilities, pipelines, and provider-neutral services | Foundation libraries with explicit ports, lifecycle, configuration, and injected adapters | Does the capability need orchestration or runtime dependencies that would make a core primitive incoherent? |
| SDKs and domain libraries | Own reusable domain behaviour, generated contracts, query and score logic, and domain-facing APIs | Domain-coherent packages whose complexity is hidden from apps | Could another app need this Oak-domain capability without reimplementing it? |
| Products and services | Combine capabilities into policy, operational workflows, presentation, and user experience | Thin composition roots and user interfaces | Is the remaining responsibility genuinely product-specific and closest to the person served? |

Provider-specific adapters remain separate from provider-neutral foundations.
When a candidate resists one row, the tension is evidence of conflated
responsibilities to decompose, not a reason to invent a `shared` dumping ground.

## Why duplication reduction is central

The relevant defect is **duplicated responsibility**: two or more production
owners independently encode the same rule, transformation, boundary guarantee,
or algorithmic mechanism. Its costs include:

- repeated discovery and design;
- multiple opportunities for behavioural drift;
- validation and mutation work repeated at each copy;
- documentation and agent-context repeated or omitted inconsistently;
- larger review and migration surfaces for every change; and
- product teams spending attention below the layer where user value is made.

Centralisation creates value when the shared package becomes the single place
where the responsibility is designed, proven, documented, observed, and
improved. Each consumer then inherits improvements through a narrow public
contract. This is stronger than source-level DRY: it is **one responsibility,
one authority, one assurance case**.

The counter-risk is false consolidation. Similar code can embody different
policy, lifecycle, performance, security, or domain constraints. A premature
package would couple independent change and make innovation more expensive.
That is why repetition opens an investigation and responsibility closes it.

## Promotion test for a core building block

A candidate is promotable to the core collection only when all of these gates
hold. The review records failure rather than averaging gates into a score.

| Gate | Evidence sought | Losing condition |
| --- | --- | --- |
| Multiple real consumers | At least two independent non-verification production consumers or owners | Exactly one consumer; inline it at that owner |
| One stable responsibility | Same behavioural rule or invariant, not merely a matching AST or vocabulary | Copies change for different reasons or encode different policy |
| Low context specificity | Contract is provider-neutral and usable unchanged outside the current Oak consumer | Oak-domain, product, or provider policy remains in the proposed API |
| Correct authority | One canonical form and intervention locus can be named | The form is generated, SDK-owned, or already authoritative elsewhere |
| Dependency fitness | Minimal external dependencies and no upward monorepo dependency | Runtime orchestration or provider coupling belongs in a foundation or adapter library |
| Compositional simplicity | Consumers become thinner and the public API is smaller than the combined local contracts | Adapters and configuration recreate the removed complexity at every consumer |
| Change leverage | Consolidation removes repeated implementation, proof, or maintenance work | The package adds coordination without removing a repeated burden |
| Strict total contract | Precise types, explicit `Result<T, E>` failures, cause preservation, validated boundaries, deterministic behaviour where applicable | Optionality, ambient state, exception-based control flow, or unmodelled cases remain |
| Assurable shipped form | Behaviour and package surface can be proven at the appropriate test and build/pack boundaries | Confidence depends only on source-loaded unit tests or coverage percentage |
| Discoverability and stewardship | Canonical name, TSDoc, README, examples, ownership, removal condition, and enforced boundaries are clear to people and agents | Consumers cannot reliably find or correctly apply it |

Candidates that fail core placement may still warrant `generate`, `reroute`,
`delete`, `inline`, `keep`, SDK ownership, or foundational-library placement.
Core promotion is one disposition, not the desired answer for every signal.

## Excellence contract for a future core package

This is the quality target that later delivery plans must make executable. The
current review assesses feasibility; it does not claim the target has been met.
Lower layers are not low-assurance layers: their fan-out increases the blast
radius of a defect, while the validation strategy makes the exact assurance
tier depend on harm.

### Contract and boundaries

- one precisely named responsibility and one public concept vocabulary;
- a small total API with no compatibility surface or speculative optionality;
- provider-neutral, machine-independent behaviour and minimal dependencies;
- dependency direction and public/private imports enforced structurally;
- pure functions first, explicit injected ports at actual I/O boundaries;
- `Result<T, E>` for expected failure, exhaustive handling, and preserved causes;
- deterministic serialisation, ordering, and identity where the contract needs them;
- no generated form hand-authored beside its authority; and
- an explicit losing or removal condition.

### Behavioural proof

- TDD at every affected test level, with tests and product code landing as one
  atomic design unit;
- pure, mock-free unit tests for each observable rule, invariant, edge case, and
  failure state;
- property or generative tests where the contract has algebraic laws or a large
  input space;
- integration tests only where units compose at a real boundary, using simple
  injected fakes;
- E2E tests only for a separately running system contract;
- a built or packed smoke proof for the form consumers actually execute or
  install; and
- a mutation check showing that the tests fail when meaningful behaviour is
  made wrong.

Mutation testing is mandatory for these packages; line coverage is not a
substitute. A later delivery plan must predeclare the mutation policy. Every
surviving mutant must be classified as an equivalent or unreachable expression
under the public contract, or treated as a missing proof or product defect. An
aggregate percentage must not conceal a meaningful survivor.

“Comprehensive” means complete over the public behavioural contract and its
failure modes, not tests coupled to every implementation line. Each proof should
occur once at the lowest level that faithfully proves its claim.

### Documentation and experience

- canonical TSDoc on every public and internal code construct required by the
  repository doctrine;
- a progressive README covering purpose, boundaries, API, examples,
  troubleshooting, error meaning, and the package's removal condition;
- an ADR when placement or dependency direction creates a durable architectural
  decision;
- examples that demonstrate the public contract without becoming a second
  implementation; and
- excellent developer and agent experience: one obvious import, semantic names,
  actionable failures, and no machine-local knowledge.

### Assurance and value

The validation instrument follows the claim. TypeScript proves types; ESLint
and graph checks prove boundaries; tests prove deterministic behaviour;
mutation testing audits the test surface; built/packed smoke proves the shipped
form; conformance proves an external protocol; evaluation grades
judgement-laden behaviour; assurance composes the complete trust case.

Core-package excellence is enabling infrastructure, not the human outcome. The
real-world loop closes only when products built on it are observed to help the
people they serve.

## Intended impact and value chain

The causal bridge is:

`excellent shared block`
`-> one implementation and assurance burden`
`-> thinner foundations, libraries, and products`
`-> cheaper, safer product change`
`-> more capacity for experiments and services that address real needs`
`-> observed value for real people`

Immediate beneficiaries are maintainers, contributors, and agents: fewer
competing forms, less search and cognitive load, clearer authority, and trusted
capabilities they can compose. Product teams benefit when they can spend more of
their effort on domain and experience questions. Teachers, pupils, and other
users benefit only when that released capacity produces useful, usable outcomes;
product telemetry, evaluation, and human feedback—not internal architecture
alone—must demonstrate that final step.

## Consequence for this estate review

The frozen extractor remains an unbiased observation instrument. Its four
contract files did not change in response to this newly disclosed destination.
The later R8 ordered-path-digest refreeze has an independent implementation
cause recorded in the calibration and knowledge-safety records. Raw syntax,
graph, authority, history, provenance, shipping, and consumer evidence remain
independently reproducible.

The still later R9 AST-transformation refreeze has the same separation: it
makes existing measurement rules executable and does not originate in, alter,
or automatically admit a foundations-first candidate.

The R10 clone-occurrence refreeze remains on that measurement side too. Exact
source offsets and a frozen output order prevent evidence collapse; they do not
create, strengthen, or disposition a reusable-building-block candidate.

The derived human review gains a **building-block promotion reading** for every
relevant production candidate. `report.md` and `proposals.md` must make these
questions explicit without pretending they are detector facts:

- what responsibility is duplicated;
- which independent production consumers carry it;
- what change, proof, documentation, or maintenance work is multiplied;
- where the semantic authority currently lives;
- the lowest coherent target layer and why;
- whether `packages/core/` placement passes every promotion gate;
- dependency and provider-neutrality constraints;
- the canonical public contract and its boundaries;
- the later assurance and documentation contract;
- supporting and opposing evidence;
- expected innovation-cost leverage; and
- the losing condition that would reject or later remove the abstraction.

The existing candidate dispositions remain valid. `share` is not synonymous
with “new core package”; the placement assessment determines whether the shared
owner is core, a foundation library, an SDK, or an existing package. Generated
repetition remains generator evidence. Verification-only similarity remains
outside production proposals under this review's frozen contract.

The closed `evidence.json` contract already supports the decision without a
fifth frozen projection. A proposed new foundation is represented as a
production-scoped `share` candidate with a proposal-eligible
`new-home-proposal` locus, placement conformance, owner ratification required,
supporting and opposing evidence, and a linked proposal carrying scope,
acceptance proof, losing condition, and sequencing. Reuse of an existing
foundation is `reroute`; generator ownership remains `generate`.

The promotion ledger belongs in `report.md`, with detailed future delivery
requirements in `proposals.md`. Each vertical record separates:

1. detector and proof observations;
2. human responsibility, generality, consumer, and opposing-evidence judgement;
3. disposition, placement, confidence, and beneficiary effect;
4. proposed API, dependency, test, mutation, documentation, and boundary proof;
5. proposal linkage, losing condition, sequencing, and evidence gaps; and
6. the explicit state `proposal only; unratified`.

No detector infers foundation suitability or architectural authority. If the
programme later needs machine-validated promotion lifecycle or maturity state,
that requires a separately authorised derived contract rather than a mutation
of the frozen four.

## Direct trial and value of information

The next direct trial is still the first complete estate run. It is the cheapest
move that can falsify the candidate hypotheses without biasing the detector.
After the held-out audit, the human review will apply the promotion test to the
admitted production candidates and preserve rejected readings.

A later, separately authorised delivery should choose one high-confidence,
bounded core candidate as the first extraction trial. It should measure concrete
structural outcomes rather than wall-clock promises: independent implementations
removed, consumer contracts simplified, proof and documentation surfaces
centralised, boundary violations made impossible, meaningful mutants killed,
and built/packed consumption proven. If the pilot increases adapters,
coordination, dependencies, or consumer-specific branches, the candidate or
boundary is wrong.

## Free-play harvest

These are associations, not findings:

- The core collection resembles a standards laboratory: the value of a gauge is
  not that it is used often, but that every downstream measurement can trust the
  same calibrated reference. This routes to explicit contracts and shipped-form
  proof.
- A well-designed instruction set makes higher-level languages cheaper to build.
  This routes to a small composable primitive surface rather than a large utility
  package.
- Duplication resembles an interest-bearing liability: each new change charges
  every copy again. This routes to change-amplification evidence, not raw line
  count.
- Mutation testing resembles a destructive assay of a material: the point is to
  learn whether the claimed strength is real, not to accumulate an attractive
  coverage number. This routes to survivor-level disposition.
- Generators resemble moulds rather than products: repeated outputs may show
  that the mould should improve, not that the cast pieces should import one
  another. This routes to generator-level intervention.

Visible discards:

- “Every repeated helper should become a core package” is discarded; matching
  form without one responsibility creates a coupling trap.
- “Near-zero innovation cost means no residual cost” is discarded; discovery,
  domain judgement, integration, and real-world learning remain.
- “Perfect tests prove product value” is discarded; they prove authored
  expectations, while real human value requires a world-facing signal.
- “Core is the home for anything reused” is discarded; runtime orchestration,
  provider coupling, and domain policy belong higher in the stack.

## Falsifiers and fixed point

The foundations hypothesis weakens or fails for a candidate when:

- fewer than two independent production consumers exist;
- similar implementations change for different reasons;
- the proposed API retains domain, provider, or product policy;
- composition recreates the removed complexity at each consumer;
- dependency direction or shipped-form requirements make core placement
  incoherent;
- opposing evidence shows an existing authority should be used instead; or
- the expected reduction in repeated proof and maintenance burden cannot be
  stated concretely.

The review should not add more detector semantics merely to make candidates fit
this frame. The frozen run, held-out audit, and human promotion ledger are the
next bounded instruments. That is the current fixed point: preserve unbiased
observation, interpret it against the now-explicit foundations programme, and
stop before production extraction. The seat then continues implementation.
