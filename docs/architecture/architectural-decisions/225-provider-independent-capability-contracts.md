# ADR-225: Adopt provider-independent capability composition for runtime services

**Status**: Proposed  
**Date**: 2026-08-13  
**Updated**: 2026-08-14 — owner rulings at review (establishment, forward
scope) and panel cures  
**Related**:
[ADR-024](024-dependency-injection-pattern.md) — injected I/O;
[ADR-041](041-workspace-structure-option-a.md) — workspace tiers; adapter
workspaces live in the `packages/libs` tier;
[ADR-042](042-runtime-adapters-folder.md) — runtime adapter boundary (its
dedicated folder was never realised; the boundary obligation carries in the
ADR-041 tiers);
[ADR-074](074-elastic-native-first-philosophy.md) — Elastic-native-first
search (Accepted standing prior; see the scope paragraph below);
[ADR-076](076-elser-only-embedding-strategy.md) — ELSER-only embedding
(Accepted standing prior);
[ADR-154](154-separate-framework-from-consumer.md) — framework and consumer
separation;
[ADR-155](155-decompose-at-the-tension.md) — responsibilities that change for
different reasons remain separate;
[ADR-162](162-observability-first.md) — observability-first five-axis
emission (Proposed; the telemetry floor named below);
[ADR-212](212-federated-visibility-authority-and-evidence-boundaries.md) —
authority and external projection boundaries;
[ADR-219](219-rate-limiting-is-an-edge-concern.md) — rate limiting at the
edge (Accepted standing prior);
[PDR-139](../../../.agent/practice-core/decision-records/PDR-139-provider-independent-capability-composition.md)
— portable semantic authority;
[research](../../../.agent/research/provider-independent-capability-architecture.md)
— storage and provider analysis.

## Context

The repository increasingly composes capabilities supplied by runtimes,
protocols, and managed services. PostgreSQL support, with Neon as one candidate
provider, makes the unresolved repository boundary visible: a managed provider
can offer valuable operation without becoming the semantic owner of persistence
or a requirement for every supported composition.

The repository already holds an owner-decided consumer for exactly this seam:
the school-data-search POC's gates G-2 (Next.js host, Neon-contingent
preview posture) and G-4 (PostgreSQL-only redacted snapshots behind a
storage-port seam), decided 2026-06-04. That consumer is motivating context,
not prior authority for this decision's constraint.

Dependency injection and the ADR-041 adapter workspaces provide the
implementation seams. They do not yet record how this repository adopts the portable
provider-independent capability pattern, how PostgreSQL and Neon divide across
those seams, or what evidence makes a provider-independent host profile real.

The required property is structural substitutability. It is distinct from
automatic failover, simultaneous multi-provider operation, and zero-downtime
migration.

## Decision

This decision establishes the repository constraint (owner-declared at
review, 2026-08-14): **no single named external provider may become a
condition for this system's existence: every supported composition survives
the loss of any one such provider — by a compatible provider, a local or
self-hosted binding, or omission of a non-constitutive capability — and
each surviving composition is exercised, not merely declared.** The
constraint is established here and is not a restatement of any earlier
record. Per the repository ADR lifecycle, its obligations — including every
MUST below — take force at this record's acceptance, which requires
PDR-139, also Proposed, to be accepted first or in the same change; the
scope paragraph below governs what they bind from that point forward.

This repository adopts PDR-139 as the semantic authority for every capability
that crosses a replaceable runtime or external-service boundary. This ADR
records the repository phenotype; it does not restate the portable contract.

### Repository placement

- Domain and application consumers receive semantically named capability
  contracts through the dependency-injection boundary established by ADR-024.
- Technology adapters and provider bindings belong in adapter workspaces in
  the ADR-041 `packages/libs` tier, carrying the boundary obligation ADR-042
  named (its dedicated folder was never realised). Provider-specific SDK types, identifiers,
  configuration, lifecycle, and error translation do not cross into consumers
  or canonical domain records. A capability contract shared by more than one
  adapter lives in `packages/core` or a foundation lib; adapter libs do not
  import one another (ADR-041).
- Each runnable host selects its capabilities and bindings at its composition
  root. Composition, the selected provider binding, and any provider-specific
  technology adapter justified under PDR-139 part 4 are the only layers that
  know provider identity or configuration.
- Each supported host profile records its required capabilities, optional
  capabilities, declared reduced modes, and independent composition for every
  named external provider it selects.

### PostgreSQL and Neon interpretation

PostgreSQL data access is a technology adapter for a semantically named
transactional capability. The adapter can target Neon, another compatible
managed provider, or a self-hosted PostgreSQL deployment without a provider
branch in consumers. Neon does not receive a brand-specific data adapter solely
because it is the selected service.

Neon project administration, database branching, and provider metrics are
control-plane concerns. If a concrete repository consumer adopts them, each is
represented by a separate optional management capability with a Neon provider
binding. Those capabilities do not expand the transactional contract.

Provider development tooling can create or inspect resources for operators. It
is not an application persistence dependency and is absent from runtime
composition.

This ADR does not select Neon, mandate PostgreSQL for every state shape, or
introduce a runtime implementation. A later implementation must choose a
semantically named transactional capability before choosing its driver,
connection method, schema, or provider configuration.

### Supported independent compositions

For every external provider selected by a supported host profile, the
repository MUST hold the documented and exercised independent composition
that PDR-139 parts 8–9 define. Those parts are the normative statement of
the floor and are not restated here. The repository sharpening: the host
profile's declared purpose and guarantees — the referent of PDR-139's
non-constitutive test — must be anchored in that profile's committed record,
never declared at evaluation time.

**Scope.** The owner's ruling (2026-08-14): this obligation binds new
provider selections and substantially refactored seams from this decision
forward; standing prior decisions — ADR-074 and ADR-076 (Accepted; the
Elastic-native and ELSER-only search posture), ADR-219 (Accepted; edge rate
limiting), and ADR-162 (Proposed; observability-first) — are not
retroactively bound and stand on their own terms. Bringing any of those
seams under this pattern is a decision taken at that seam's next
substantial refactor, not an obligation created here.

The following scope interpretations were derived at panel cure (2026-08-14)
by the reviewing seat, not ruled by the owner; they are reviewed with the
record at acceptance. The named priors are the ones this decision examined,
not an exhaustive set — peers of their class, ADR-212's federated evidence
assignments among them, stand equally on their own terms. Where a standing
decision procedure such as ADR-074's Elastic-native-first hierarchy ranks
options for a new capability, that hierarchy continues to rank; this
obligation applies to the selection it produces. A seam decided before this
date but not yet built is bound at build time — the obligation attaches
when a provider is selected in running code, not at the date of the
deciding record (the Context consumer's gates are of this class). A
provider-specific extension capability under PDR-139 part 5 does not breach
the constraint: the base contract remains provider-independent, and
omission of the extension is its supported independent composition — every
supported host composition remains valid without it.

For a Neon PostgreSQL integration, the minimum independent composition is the
same transactional capability served through PostgreSQL without Neon. It is
supported only when unchanged consumers pass the same capability-conformance
checks. When canonical state is involved, a repository-owned schema and
migration path plus an exercised export and restore against the independent
target are also required.

## Rationale

PDR-139 owns the general pattern; this ADR keeps only the repository-specific
placement and PostgreSQL/Neon interpretation. That direction prevents the two
decision records from becoming competing normative copies.

The research document's four-layer table is illustrative orientation;
PDR-139's nine parts are the normative statement of the pattern.

Using PostgreSQL as the data-plane seam avoids adapters that differ only by
provider name. Splitting the Neon control plane preserves access to useful
managed features without allowing them to define transactional storage.

A supported independent composition makes this decision's constraint
observable.
It proves more than interface shape: the host can serve its declared purpose
without the named provider, and state can move when state is authoritative.

## Alternatives rejected

### Repeat the portable capability rules in this ADR

This would create two normative copies. PDR-139 remains the portable authority;
this ADR records only this repository's adoption and phenotype.

### Make Neon the persistence contract

This would distribute Neon concepts through consumers and make project
administration or branching part of ordinary transactional state.

### Create a Neon data adapter beside a PostgreSQL data adapter

When both expose conforming PostgreSQL behaviour, the brand-specific adapter
duplicates the technology seam. Neon-only control-plane behaviour remains a
separate provider binding.

### Accept an interface without an independent composition

This would establish source-code indirection while leaving the running host or
its canonical state dependent on one provider.

### Use provider development tooling at runtime

Operator convenience would become application availability. Development tools
remain outside runtime composition.

## Consequences

- A PostgreSQL/Neon implementation starts from a domain capability and a shared
  PostgreSQL technology adapter, not from Neon SDK calls in consumers.
- Runtime composition and provider bindings contain provider knowledge;
  consumers remain provider-independent.
- Supported host profiles expose their actual capability set and identify an
  exercised independent composition for each selected provider.
- A no-effect telemetry binding satisfies only the external sink. ADR-162's
  observability-first emission obligations travel with the composed
  observability adapters and are not discharged by omitting a telemetry
  provider; only the provider sink is optional.
- Integrations holding canonical state carry repository-owned schema,
  migration, export, and restore obligations in addition to method
  conformance; derived state carries an exercised rebuild path from its
  authority.
- A provider seam can remain Proposed while its independent composition is not
  yet exercised. It cannot be described as supported provider independence.
- Storage technologies remain capability-specific. Files, PostgreSQL, SQLite,
  object storage, RDF stores, search indexes, analytical snapshots, caches, and
  event infrastructure do not become interchangeable — the repository
  application of PDR-139's rejection of a universal provider interface.

## Compliance questions

A provider-backed repository change complies when reviewers can answer yes to
each applicable question:

- Does it identify PDR-139 as the semantic authority rather than copy its
  portable rules?
- Do consumers depend on a capability contract while runtime adapters and
  composition contain provider knowledge?
- For PostgreSQL, does one technology adapter serve conforming providers, with
  Neon-only control-plane behaviour separated?
- Does the owning host profile state its actual required, optional, and reduced
  capabilities?
- For each named external provider selected by that profile, is a supported
  composition without it documented and exercised?
- If omission supplies that composition, does the host preserve its declared
  purpose and guarantees?
- For canonical state, are repository-owned schema, migration, export, and
  independent-target restore exercised?
