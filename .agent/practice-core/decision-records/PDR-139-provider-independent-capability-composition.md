---
pdr_kind: pattern
---

# PDR-139: Provider-Independent Capability Composition

**Status**: Proposed  
**Date**: 2026-08-13  
**Related**:
[PDR-035](PDR-035-agent-work-capabilities-belong-to-the-practice.md)
(portable capability and local implementation are distinct responsibilities);
[PDR-051](PDR-051-vendor-agnostic-skills-standardisation.md)
(vendor-independent authority with thin platform adapters in the skills
domain);
[PDR-058](PDR-058-three-tier-optionality-decomposition.md)
(three-tier optionality and the innovation-context screen);
[PDR-050](PDR-050-state-memory-substrate-contracts.md)
(portable contracts distinguish semantic authority from host substrate);
[PDR-079](PDR-079-pdr-vs-adr-portability-distinction.md)
(portable principle and host phenotype have separate records);
[PDR-108](PDR-108-generalise-where-generalisation-does-not-cost-utility.md)
(generalisation must preserve action-changing utility);
[PDR-135](PDR-135-cost-of-change-gradient.md)
(general mechanism below, specific value above).

## Context

A system often receives a durable capability through a hosted service,
platform API, runtime tool, local process, or open protocol. If consumers know
which provider supplies the capability, provider configuration and behaviour
spread through the system. Replacement then requires consumer changes, and a
host that omits the provider must imitate behaviour it does not possess.

Wrapping a provider SDK is not enough. An interface can retain the provider's
concepts, or flatten several distinct capabilities into one broad abstraction.
For stateful capabilities, method substitution can also leave identity and data
behind.

The portable problem is how to preserve semantic capability while allowing
local technology adapters, provider bindings, provider extensions, and
deliberately smaller compositions.

## Decision

**A provider-backed responsibility is composed as a provider-independent,
semantically specific capability contract plus an explicit host composition.
The provider is a phenotype — one local expression — of the capability, not
its semantic owner.**

The pattern has nine parts.

### 1. Name the capability before the provider

The contract states observable operations, guarantees, failure meaning,
authority, and availability meaning. It is generic across providers and
specific about the capability. A broad “service” or “database” interface that
hides materially different guarantees does not satisfy the pattern.

### 2. Bind once at composition

The host selects and injects a provider binding at one composition boundary.
Consumers do not inspect provider names, credentials, endpoints, SDK types, or
provider configuration.

### 3. Keep provider concerns in the phenotype

Provider-specific authentication, connection configuration, provider SDK
calls, provider identifiers, provider-specific error translation, quotas,
and service lifecycle stay inside the provider binding; shared
protocol-level connection handling and driver usage belong to the
technology adapter (part 4). Parsing of shared protocol-level errors and their translation into
capability failure meaning belong to the technology adapter (part 4), so
conforming providers share them rather than reimplementing them per binding;
the provider binding retains a narrow classification right for
provider-specific failures the shared protocol cannot distinguish, and that
classification lands in the same capability failure vocabulary. Canonical
domain identity and portable records do not encode them.

### 4. Reuse technology adapters

When several providers implement the same open protocol with conforming
behaviour, one technology adapter can serve them. Every selected provider
still receives its provider binding (part 3); a provider-specific technology
adapter is introduced only for genuine behavioural divergence from the
shared protocol, not for branding.

### 5. Split extensions into capabilities

A provider feature that is not part of the base contract becomes a separate
optional capability. This preserves access to useful local features without
making the base capability provider-shaped.

### 6. Make omission semantic

Each capability declares what absence means:

- a required capability makes the composition invalid when absent;
- an optional surface is not composed or advertised when absent;
- a declared reduced mode exposes reduced guarantees explicitly — a reduced
  mode may reduce richness or availability, never safety: no data loss and
  no false success; or
- a no-effect binding is valid only when producing no external effect fulfils
  the capability contract.

There is no universal null binding. Absence of authoritative state, required
delivery, or another obligation cannot report success.

### 7. Preserve behaviour and state separately

Behaviour portability means another binding can serve unchanged consumers.
State portability means canonical identifiers, schemas, data, provenance, and
recovery can move independently of the provider. An authoritative stateful
capability is substitutable only when both hold. A derived stateful
capability — a cache, an index, a projection — is substitutable when
behaviour portability holds and an exercised rebuild from its authority
exists; movement of provider state is not required.

### 8. Prove the seam without multiplying operations

Conformance evidence and an exercised independent or omitted composition prove
the boundary. Simultaneous operation of several providers is a separate
availability concern and is not required by this pattern.

### 9. Keep every named provider replaceable or omittable

For any named external provider, a supported system composition exists without
that provider. The independent composition can select a compatible provider,
select a local or self-hosted binding, or omit a capability that is
non-constitutive for that host. A capability is non-constitutive only when its
absence preserves the host's declared purpose and guarantees. This is a
per-provider test, not a claim that every capability is optional or that one
composition must omit every external service simultaneously.

## Established-pattern test

The seam satisfies this pattern when all applicable conditions hold:

1. the provider boundary is replaceable or omittable by design;
2. the capability can be named without the provider;
3. replacement preserves the capability's guarantees across a real
   independent or local composition, and omission preserves the host's
   declared purpose and guarantees;
4. provider policy can remain above or inside the binding;
5. the contract changes consumer action compared with direct provider use;
6. a supported composition without each named external provider is documented
   and exercised; and
7. a losing condition states when the abstraction should remain local or be
   removed.

A named near-term consumer can justify authoring a Proposed seam under the
innovation-context screen. It does not establish provider independence. The
seam satisfies this pattern only after omission, self-hosting, or another
provider supplies a documented and exercised independent composition. A
single-use wrapper with no independent composition remains local.

## Three-context portability test

The pattern changes action in unrelated contexts:

- **Durable storage**: a transactional or object capability can use a managed,
  self-hosted, or local binding; authoritative state requires an exercised exit
  path, and absence removes the stateful host or feature.
- **Telemetry**: an observation sink can use a hosted, local, or no-effect
  binding because absence of non-authoritative telemetry can satisfy an
  explicitly optional contract.
- **Agent tooling**: an invocable capability can use different platform
  adapters or be unadvertised when a host lacks the tool; the portable method
  remains the semantic authority.

The different absence and state rules show why the pattern is about semantic
capabilities rather than one generic provider interface.

## Rationale

Provider-independent contracts concentrate semantic authority at the most
general coherent layer while leaving operation and policy with the host that
can make those claims. Consumers remain stable, providers remain replaceable,
and smaller hosts remain truthful about what they can do.

Protocol reuse avoids adapters that differ only by product name. Separate
extension capabilities prevent valuable provider features from contaminating
the base contract. Explicit omission prevents false success paths.

Behaviour and state are separated because either can be portable without the
other. Naming both turns provider independence from an interface aesthetic into
an observable continuity property.

## Alternatives rejected

- **Direct provider dependency.** The provider becomes distributed semantic
  authority and replacement crosses every consumer.
- **Universal provider interface.** Distinct capabilities and guarantees are
  flattened into a lowest-common-denominator abstraction.
- **One technology adapter per brand.** Shared protocol behaviour is
  duplicated and brand identity is mistaken for a semantic boundary; every
  selected provider still receives its provider binding (part 3).
- **Universal null binding.** Invalid absence is hidden as successful
  behaviour.
- **Provider extensions on the base contract.** One phenotype defines the
  portable capability.
- **Concurrent providers as proof.** Operational plurality is mistaken for
  structural substitutability.

## Consequences

### Required

- Contracts name semantic capabilities and their guarantees.
- Composition exposes the actual capability set of the host.
- Every named provider has a documented and exercised supported independent
  composition.
- Provider-specific types and identity stop at the binding boundary.
- Each optional capability defines its own absence behaviour.
- Authoritative stateful capabilities define and exercise both behaviour
  and state portability; derived stateful capabilities exercise rebuild
  from their authority.
- Independent bindings are checked against the same conformance obligations.

### Forbidden

- Reading provider configuration throughout consumer code.
- Treating an absent authoritative capability as a successful no-effect
  implementation.
- Adding provider-only operations to a base contract without splitting the
  responsibility.
- Claiming provider independence from an interface while authoritative
  state remains immovable.

### Accepted costs

- Real provider seams require explicit contracts, composition, conformance
  evidence, and documentation.
- Rich provider features require separate capability identities and local
  bindings.
- Migration and recovery proof add work to stateful capabilities.

These costs purchase a system that can change providers, run locally, or run
with fewer capabilities without rewriting or misrepresenting its core
behaviour.

## Falsifiability and losing conditions

The pattern fails at a proposed boundary when the contract mirrors one provider
without semantic reduction, consumer branches still depend on provider
identity, a supported host selects a provider without an exercised independent
composition, another binding cannot preserve required guarantees, omission
changes the host's declared purpose or guarantees, or state movement cannot
reproduce behaviour.

Remove or narrow the abstraction when no independent or omitted composition
exists, adapters recreate the full consumer policy, providers change for
different semantic reasons, or maintaining the seam costs more than an
intentionally local capability whose replacement is not an intended property.

The wider pattern should be revised if it stops producing different correct
absence and portability decisions across storage, telemetry, tooling, and other
unrelated contexts.
