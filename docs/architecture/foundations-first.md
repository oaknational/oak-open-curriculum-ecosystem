---
boundary: B2-Architecture
doc_role: reference
authority: cost-of-change-gradient-software-projection
status: active
last_reviewed: 2026-08-02
---

# Foundations first: the software projection of the cost-of-change gradient

This document is the repository's software-architecture projection of the
[cost-of-change gradient](../foundation/cost-of-change-gradient.md). The
portable pattern has its own identity in
[PDR-135](../../.agent/practice-core/decision-records/PDR-135-cost-of-change-gradient.md);
neither this projection nor the TypeScript estate review owns the general idea.
It composes with
[ADR-154](./architectural-decisions/154-separate-framework-from-consumer.md),
which remains authoritative for the repository's narrower five-level
specificity gradient and framework/consumer workspace boundary.

The architecture is designed as a **cost-of-change gradient**:

> Core absorbs recurring, context-independent mechanics and their assurance
> burden; foundational systems compose them; SDKs and libraries own reusable
> domain capability; products and services primarily express policy,
> experience, and real human need.

This is the foundations-first route to lower-cost innovation. It is not a call
to maximise abstraction. It is a commitment to pay the design, implementation,
validation, mutation-testing, documentation, and maintenance cost of a
genuinely shared responsibility once, at the lowest coherent layer, so every
consumer inherits the result.

## The economic mechanism

Duplicated responsibility creates change amplification. When multiple
production owners independently encode the same rule, transformation,
boundary guarantee, or algorithm, each innovation must rediscover, implement,
test, document, review, and maintain the same responsibility again. Drift
becomes likely because improvements do not propagate automatically.

An excellent shared building block changes the shape:

`many implementations + many assurance burdens`
`-> one authority + one implementation + one assurance case`
`-> thin consumer composition`

The marginal cost of reusing an already-understood capability can therefore
approach zero. Discovery, product judgement, genuinely different integration,
operation, and learning from real people remain irreducible. The point is to
stop multiplying those higher-value costs by avoidable reinvention underneath
them.

## The value stack

| Layer                               | Owns                                                                                      | Architectural effect                                                                       |
| ----------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Semantic authorities and generators | Canonical contracts and deterministic projections                                         | Repeated carriers are derived, never hand-maintained                                       |
| Core building blocks                | Context-independent laws, types, pure mechanisms, and provider-neutral boundary contracts | The smallest reusable responsibilities and their proof live once                           |
| Foundational systems                | Reusable runtime capabilities composed from core blocks behind explicit ports             | Lifecycle, failure semantics, and orchestration are centralised without contaminating core |
| SDKs and domain libraries           | Reusable domain behaviour and generated domain-facing contracts                           | Applications consume domain capability rather than reimplement it                          |
| Products and services               | Composition, policy, operations, presentation, and experience                             | Engineering attention concentrates on useful outcomes for people                           |

Context specificity is a second axis across the stack. Capability moves down
only as far as it remains coherent, provider-neutral where required, and usable
unchanged by independent consumers. Authority and generation are also
orthogonal: generated repetition is normally cured at its input or generator,
not by making generated carriers depend on one another.

## When duplication should become a foundation

Repetition is important evidence because it reveals potential change
amplification. Extraction is warranted only when it is also evidence of one
shared responsibility.

A foundational building block requires:

- at least two independent production consumers at the proposed boundary;
- the same behavioural invariant or rule, not merely similar syntax;
- a smaller, more stable public contract than the implementations it replaces;
- placement at the lowest context-specific layer that preserves coherence;
- downward-only dependencies and provider or product policy injected above;
- a named semantic authority and intervention owner;
- concrete reduction in repeated implementation, proof, documentation, or
  maintenance work; and
- a losing condition that would reject or later remove the abstraction.

Single-consumer abstractions remain local. Different policies remain separate.
Existing authorities are consumed rather than wrapped. Generated forms are
fixed at the generator. A `shared` package is never a compromise home for code
whose responsibilities have not been decomposed.

## What “excellent” means

Foundation fan-out increases the blast radius of error. Reuse therefore raises,
not lowers, the required confidence before promotion.

Every foundational package is expected to have:

- one precise responsibility, strict total types, explicit `Result<T, E>`
  failures, preserved cause chains, and no speculative optionality;
- minimal dependencies, machine-independent behaviour, pure functions first,
  and structurally enforced public and dependency boundaries;
- TDD at every affected level, exhaustive public-behaviour and failure-state
  proof, property or generative tests where the contract has laws, and
  integration proof only at real composition boundaries;
- mutation testing that demonstrates the tests fail when meaningful behaviour
  is wrong, with every surviving mutant explicitly dispositioned rather than
  concealed by an aggregate score;
- a built or packed smoke proof for the form consumers actually execute or
  install;
- meticulous TSDoc, a progressive README, examples, troubleshooting, semantic
  naming, and an explicit removal condition; and
- an assurance case proportionate to harm, using the correct instrument for
  types, structure, deterministic behaviour, shipped form, conformance,
  judgement, security, and real-world value.

“Comprehensive” describes the public behavioural contract and its failure
modes. It does not mean coupling tests to every implementation line or proving
the same behaviour at every level.

## Intended impact

The causal bridge is:

`excellent shared foundations`
`-> one implementation and assurance burden`
`-> thinner libraries and products`
`-> cheaper, safer change and experimentation`
`-> more capacity to solve real problems`
`-> observed value for real people`

Architecture enables that outcome; it does not prove it. Tests and mutation
testing establish internal confidence. Product evaluation, observability,
usage, and human feedback close the loop against the world.

## Related architecture

- [The cost-of-change gradient](../foundation/cost-of-change-gradient.md) — the
  broader multi-scale pattern, including Parallax and Practice projections.
- [PDR-135](../../.agent/practice-core/decision-records/PDR-135-cost-of-change-gradient.md)
  — portable identity, admission test, and falsifiers.
- [ADR-154](./architectural-decisions/154-separate-framework-from-consumer.md)
  — accepted context-specificity levels, dependency direction, and the
  framework/consumer boundary for this repository.
- [Architecture overview](./README.md) — current package topology and dependency
  direction.
- [Principles](../../.agent/directives/principles.md) — context specificity,
  framework/consumer separation, strictness, and long-term excellence.
- [Testing and development strategy](../../.agent/directives/testing-strategy.md)
  — behavioural proof and shipped-form testing.
- [Validation strategy](../../.agent/directives/validation-strategy.md) — test,
  evaluate, assure, and the real-world loop.
- [TypeScript estate review promotion frame](../../.agent/reports/typescript-estate-consolidation-review/foundational-building-blocks-frame.md)
  — the evidence and losing conditions used to identify candidate foundations.
