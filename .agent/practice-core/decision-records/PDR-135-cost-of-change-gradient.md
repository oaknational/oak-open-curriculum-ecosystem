---
pdr_kind: pattern
---

# PDR-135: The Cost-of-Change Gradient — General Mechanism Below, Specific Value Above

**Status**: Proposed
**Date**: 2026-08-02
**Related**:
[PDR-035](PDR-035-agent-work-capabilities-belong-to-the-practice.md)
(portable capability and local implementation are distinct responsibilities);
[PDR-079](PDR-079-pdr-vs-adr-portability-distinction.md)
(portable patterns have their own identity outside any host implementation);
[PDR-095](PDR-095-collaboration-is-multi-dimensional.md)
(one convenient axis must not be mistaken for the whole system);
[PDR-108](PDR-108-generalise-where-generalisation-does-not-cost-utility.md)
(generalise only as far as behaviour-changing utility survives);
[PDR-111](PDR-111-agent-experience-is-first-class.md)
(foundational substrates are products for their downstream users);
[PDR-134](PDR-134-knowledge-strata-carriers-and-the-concept-layer.md)
(generality, identity, and monotone composition are explicit system properties).

## Context

Useful systems repeatedly rediscover the same responsibility in more specific
contexts. Each consumer then pays again to understand, implement, validate,
document, review, operate, and improve it. The copies drift, and later changes
must be coordinated across every owner.

The obvious cure—move everything shared into one generic layer—also fails.
Similar forms may encode different policy, risk, lifecycle, or human need. A
maximally general abstraction can preserve syntax while destroying utility.
Equally, one shared semantic contract may legitimately have several local
implementations when hosts, technology stacks, or operating environments differ.

The recurring design problem is therefore not simply duplication. It is how to
place each responsibility at the most general level that preserves coherence,
concentrate semantic authority and every reusable part of its assurance there,
and let more specific layers add context without reimplementing inherited
mechanics or concealing the work that must remain local.

## Decision

**A cost-of-change gradient is a system shape in which stable, recurring
responsibilities have their semantic authority at the most general coherent
layer; reusable implementation and assurance are concentrated there where the
claim permits it; irreducible local implementation and proof remain with the
host that can make those claims; domain, vendor, consumer, and product
specificity are added without duplicating inherited responsibility; and useful
impact is tested where the system returns to the world.**

“Below” means more general in the declared ordering, not physically lower in a
directory and not less important. “Thin” means free of duplicated inherited
mechanics; a specific layer may still carry substantial local implementation,
proof, policy, judgement, experience, operational responsibility, and human
consequence.

The pattern has four coupled shapes.

### 1. A vertical generality ramp

Stable, context-independent mechanism is placed below more specific capability:

```text
general laws and semantic authorities
  -> reusable mechanisms and assured building blocks
    -> composable foundational capabilities
      -> domain capabilities and specialised overlays
        -> host, vendor, and consumer bindings
          -> situated products, services, policy, and experience
```

Dependencies point from the specific toward the general. A specific layer may
configure, compose, specialise, or locally realise a general contract; the
general layer must not need to know which consumer happens to use it. Generated
carriers derive from their semantic authority rather than becoming competing
authorities. Local implementations remain implementations of that authority,
not rival semantic owners.

The **lowest coherent owner** is the most general home at which the
responsibility remains independently useful, precisely nameable, and free of
policy belonging to a more specific consumer. Pushing it farther down would
cost utility; leaving it higher would multiply responsibility.

### 2. A recursive scale pattern

The same shape recurs at several grains. A function can centralise a law for a
module; a module for a package; a package for a system; a portable behavioural
contract for several hosts; a shared inquiry protocol for several domains.

No grain automatically outranks another. Each change belongs at the smallest
scale that contains the whole responsibility and the broadest scale at which
its contract remains coherent. Cross-scale claims need an explicit bridge;
component correctness does not silently prove system or human outcomes.

### 3. Orthogonal dimensions, preserved rather than flattened

Generality is only one coordinate. A system may also vary independently by:

- semantic authority, implementation, generated carrier, and runtime owner;
- evidence, assurance, harm, and shipped form;
- lifecycle, maturity, time, and revision;
- domain, method, basis, and operating scale;
- entitlement, portability, and context specificity; and
- human experience, agent experience, policy, and real-world effect.

These dimensions may form partial orders or networks rather than one ladder.
Each keeps its own contract and evidence. A stronger host does not strengthen
an epistemic claim; a generated file is not its semantic authority; structural
validity is not shipped correctness; internal excellence is not human value.

### 4. A world-return loop

The gradient concentrates reusable mechanism so that higher layers can spend
more attention on situated value. That causal bridge remains a hypothesis until
the system returns to the world: observed use, outcomes, harms, operational
signals, and human feedback revise the layers beneath it.

Assurance therefore grows in two directions. Greater fan-out raises the proof
required before a foundational change propagates. Greater proximity to people
raises the need for contextual evaluation, decision rights, and real-world
evidence. Neither direction substitutes for the other.

## The economic mechanism

Duplicated responsibility creates change amplification:

```text
many implementations + many assurance burdens + many maintenance paths
  -> every improvement is paid for repeatedly
```

A well-placed foundation can change the equation in two distinct ways.

Where implementation can be shared:

```text
one semantic owner + one reusable implementation + proportionate shared proof
  -> thin explicit compositions
  -> implementation improvements inherited by consumers
```

Where hosts must implement locally:

```text
one portable semantic owner + shared conformance obligations
  -> intentionally local implementations + proof at each host boundary
  -> discovery, specification, and assurance design reused across hosts
  -> implementation changes adopted and proved explicitly by each host
```

Foundational changes are not intrinsically cheap. Their fan-out can make each
change more expensive and demand stricter validation. The saving is systemic:
shared work is paid at its coherent owner instead of once per consumer, while
irreducibly local work remains visible and local. The first path amortises
semantic, implementation, and reusable proof costs. The second amortises
discovery, specification, shared assurance design, and governance, but not the
cost of implementing or proving the behaviour in each host.

The marginal cost of reusing an already-understood, already-assured mechanism
can consequently approach zero on the shared-implementation path. That claim
does not extend to an intentionally local implementation of a portable
contract. The pattern does not remove discovery, domain judgement, integration
that is genuinely different, operation, or learning from people. It prevents
those valuable costs from being multiplied where responsibility really can be
shared and makes the remaining local costs explicit.

## Admission and placement test

A responsibility moves toward a more general home only when all of these hold:

1. at least two independent production consumers need the same responsibility;
2. they share one behavioural invariant, not merely similar form;
3. the proposed contract is smaller and more stable than the local forms;
4. consumer, vendor, and product policy can remain above the boundary;
5. dependencies and authority point toward the proposed general owner;
6. implementation, proof, documentation, or maintenance work is measurably
   removed, or a named semantic and assurance-design burden is shared while
   irreducible host implementation and proof remain explicit;
7. the semantic contract can be assured at its general owner and every shared
   or local implementation can be assured at its natural host boundary; and
8. a losing condition states when the abstraction must remain local or be
   removed.

Single-consumer helpers stay local. Existing authorities are consumed rather
than wrapped. Generated repetition is cured at its input or generator. Forms
that change for different reasons remain separate.

When extracting the pattern itself, apply PDR-108's stronger portability test:
it must change action correctly in at least three unrelated contexts. This
record currently survives that test in:

- a software capability stack, where assured primitives support foundations,
  domain libraries, thin composition roots, and situated products;
- a plural inquiry system, where shared invariants and artifact protocols
  support stackable domain profiles, specialised overlays, host execution, and
  world-return; and
- an agentic Practice, where portable behavioural authority and assurance
  obligations support repo-specific structures, platform adapters, and
  situated human-agent work.

These are evidence that the pattern is portable, not proof that every system
should use the same layers or implementation.

## Human and agent experience

Foundations are products for downstream people and agents. Their value depends
on discoverability, semantic names, strict contracts, actionable failure,
deterministic behaviour where required, progressive documentation, and an
obvious path from need to capability.

For agents, this reduces repeated search, reconstruction, and unsafe local
invention. For people, it moves engineering attention away from recurring
mechanics and toward outcomes, policy, dignity, accessibility, trust, and the
experience of the service. Both remain active judges: a foundation supplies
reliable affordances; it never replaces situated judgement.

## Rationale and alternatives

The dedicated identity makes the pattern discoverable outside the contexts
that revealed it. It also lets each worked implementation link to one referent
without claiming to be the general idea.

Alternatives rejected:

- **Keep the insight inside its first architecture document.** Future domains
  would rediscover it, and the first instance would appear to own the concept.
- **Use “DRY” or a shared utility collection.** Source similarity is weaker
  than shared responsibility and says nothing about authority or assurance.
- **Require one implementation everywhere.** Portable semantic authority can
  legitimately have stack- or host-local implementations.
- **Treat the system as one hierarchy or score.** This destroys independent
  dimensions and hides where evidence does and does not transport.
- **Push every recurring form downward.** Generalisation that retains consumer
  policy increases coupling and makes change more expensive.

## Consequences

### Required

- Name the generality ordering and the independent dimensions relevant to a
  design; do not rely on an unexplained “layer” metaphor.
- Place a recurring responsibility at its lowest coherent semantic owner and
  keep specific bindings free of duplicated inherited mechanics; when a host
  must implement the contract locally, name and prove that boundary honestly.
- Raise assurance with fan-out and validate each claim at its natural scale.
- Treat product and service outcomes as a world-return question, not an
  inference from internal quality.
- Preserve an explicit losing condition for every promoted abstraction.

### Forbidden

- Using frequency, code similarity, or a scalar score as automatic authority to
  centralise.
- Calling a consumer thin when it merely hides duplicated complexity in
  configuration or adapters.
- Treating a more general layer as permission to erase domain, human, or
  operating differences.
- Claiming near-zero total innovation cost or beneficiary value from
  architecture alone.

### Accepted costs

- General foundations receive more design, testing, assurance, documentation,
  and stewardship than any one local copy might justify. Their fan-out makes
  that investment proportionate.
- Explicit boundaries and thin adaptations add visible seams. Those seams are
  cheaper than invisible duplicated ownership and make differing policy honest.

## Falsifiability and losing conditions

The pattern weakens or fails at a proposed boundary when the abstraction needs
consumer-specific branches, its adapters recreate the displaced complexity,
the consumers change for different reasons, no independent reuse exists, or
total coordination and assurance cost rises after adoption.

The broader pattern should be revised if it stops producing distinct,
action-changing guidance across unrelated contexts; if shared implementations
regularly fail to propagate improvements to their consumers; if portable
contracts fail to reduce semantic discovery, specification, or assurance-design
work despite honest local implementation; or if preserving several independent
dimensions consistently makes the model less predictive than a simpler
alternative.

Evidence of excellent foundations without cheaper safe change or useful
world-return narrows the claim to internal architecture. It does not establish
the intended human outcome.
