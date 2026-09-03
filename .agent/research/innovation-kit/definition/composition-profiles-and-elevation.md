# Composition profiles and elevation

- **Status:** proposed definition
- **Owns:** applicability, obligation activation, composition declarations, the creator's input
  boundary, profile semantics, semantic-core preservation and elevation boundaries
- **Does not own:** capability meaning, current bindings, quality authority or a universal
  prototype-to-production roadmap

## Profiles describe obligations, not quality grades

“Demo,” “prototype” and “production” are unreliable primary selectors. Actual audience, exposure,
claims, state, effects, rights, reliance, channel and scale determine what must be true.

A composition profile is the declared set of applicable obligations and capabilities for one
proposition in one context. It records activated, reduced, omitted, unavailable and unknown
capability states, together with supported degradation policies and the authorities and evidence
behind those decisions. A temporary degraded occurrence belongs to an operation/outcome record,
not the profile.

Every profile keeps the always-on invariants in
[outcomes, quality and human authority](outcomes-quality-and-human-authority.md). A smaller profile
may activate fewer capabilities. It may not lower the quality of the claims it still makes.

## Activation dimensions

| Dimension | Questions that change obligations |
| --- | --- |
| **Audience and exposure** | Is use private, internal, invited, institution-bound or public; who can encounter or be affected by it? |
| **Claim and decision consequence** | Is the experience making possibility, comprehension, utility, official advice, product, portability, stewardship or outcome claims? |
| **State and effects** | Is it read-only, a disposable projection, mutable authoritative state, an external effect or a decision that changes another system? |
| **People, data and rights** | Are people anonymous or identified; are children, vulnerable users, personal/sensitive data, restricted content or delegated authority involved? |
| **Reliance and continuity** | Is use momentary, bounded research, recurring work or a sustained service; what happens if it disappears or lies? |
| **Channel and control boundary** | Is the capability local, web, API, document, agent-hosted, embedded, offline or controlled partly by a third party? |
| **Reach and context** | Which locale, territory, institution, tenancy, volume, latency, cost, support and environmental expectations apply? |
| **Lifespan and change** | How long must state, links, evidence and representations remain usable; how will authority, providers and consumers change? |

Applicability is a fact about the real situation, not a preference of the implementation team.
Where competence is required, the relevant authority decides whether an obligation is met,
transformed or genuinely inapplicable.

Each activation answer also has a **binding time** — authoring, composition, release or runtime —
and an authority who may change it. Declaring both keeps valid combinations and their ownership
legible as propositions vary, experiments run and contexts change.

## Named presets are conveniences

The Kit may offer named presets as starting points. The effective profile is always the explicit
activation result.

| Preset | Typical purpose | Obligations commonly activated in addition to the invariants |
| --- | --- | --- |
| **Local exploration** | Examine a mechanism, interaction or proposition privately | Pinned/known sources, deterministic local bindings, representative scenarios, focused assurance and explicit absence |
| **Bounded evidence** | Let a known audience inspect a real proposition under a method | Exact run/configuration identity, consent where applicable, real claim-critical integrations, comparator, falsifier, adverse states and retained evidence |
| **Public demonstration** | Make real capability safely and credibly available to unknown users | Public accessibility, rights/security/privacy, release and source identity, resource protection, observability, operational owner, support boundary and retirement |
| **Sustained service** | Support recurring reliance and product obligations | Product/service evidence, objectives, capacity, incident response, durable state and recovery where applicable, tenancy/residency/retention, governed change and long-term support |

These are not mandatory stages. A read-only public demonstration might never need a database. A
small internal tool can immediately activate personal-data, safeguarding or service obligations.
A public URL can remain incomplete and dishonest. A local adapter can realise a complete bounded
claim.

## Production readiness is an evidence vector

“Production ready” must not collapse several independent states into one badge. For each
applicable capability and for the composed experience, ask whether it is:

| Evidence state | Question |
| --- | --- |
| **Specified** | Is the semantic and quality contract explicit? |
| **Implemented** | Does a real mechanism conform under representative states? |
| **Integrated** | Does it compose with the actual host, sources and other capabilities? |
| **Deployed or distributed** | Is an identified release available through the intended channel? |
| **Activated** | Is the capability operating in the declared host/profile rather than merely installed? |
| **Exercised** | Has the intended audience or a representative probe traversed the real path? |
| **Observed** | Can operation, failure and correction be diagnosed against meaningful signals? |
| **Effective** | Does valid evidence support the declared human, product or service outcome? |
| **Supported** | Are ownership, response, recovery, change and retirement real? |
| **Replaceable** | Can the binding or projection return to an acceptable world through migration, export/restore or rebuild? |

A **public production-ready demonstration** is complete for its declared public audience, claim
and activated obligations, including operation and ending. It may make only possibility or
comprehension claims and need no sustained product service. A **live product or service** adds
reliance, outcome, support and continuity obligations. Deployment alone establishes neither.

## Composition declaration

Before an experience can claim profile completeness, its composition must identify:

- the proposition and authorities;
- intended audience, affected people, claim and control boundary;
- source releases and semantic capability contracts;
- activation facts and derived obligation set;
- each capability's state and any justified omission;
- selected adapters, provider bindings, host and product-local mechanisms;
- configuration, secret, environment and budget boundaries;
- representative normal, difficult, degraded and terminal scenarios;
- assurance and operational evidence required by the claim; and
- support, correction, migration, provider-exit and retirement responsibilities.

The composition is complete when every applicable obligation is satisfied or explicitly blocked,
not when every known capability exists. An unavailable required capability stops or changes the
claim; it cannot be converted to an omission by documentation.

## The creator's input and the decision budget

The creator authors the thin layer where meaning, audience, authority, rights and outcome
genuinely differ; the [foundational thesis](concept-lineage-and-thesis.md) states why the Kit
invests ahead so that everything recurring arrives settled. The creator's input is a first-class
design object with its own boundary contract.

A creator authors:

- the proposition: audience, affected people, outcome, claim and authorities;
- the activation facts of the real context, and any competent omission decisions;
- domain meaning, source selections and rights decisions owned by their authorities;
- proposition-specific interaction grammar, product language and design intent whose semantic
  purpose can be stated; and
- the evidence thresholds the claim requires and the dispositions it must route to, with their
  legitimate owners.

Everything else defaults from the Kit: recurring composition, bindings, assurance plumbing,
operational scaffolding and lifecycle mechanics arrive settled, inspectable and reopenable. The
creator's input is expressed through the existing proposition record and composition profile,
together with the decisions owned by domain and design authorities.

The boundary rule applies the [seam rule](system-and-authority-model.md#the-seam-rule): the Kit
asks the creator only for decisions that sit on a material seam. A decision the machinery can
settle without crossing a material seam belongs to the Kit.

Because the creator's decisions are enumerable, the seam is observable as a **decision budget**.
A composition records the decisions its creator actually made, distinguishing
proposition-shaped decisions — the authored layer working as designed — from machinery-shaped
decisions the creator had to re-make. Recurring machinery-shaped decisions are the
seam-correction signal: they route to the
[Kit-placement inquiry](operating-pipelines.md#5-local-burden-to-governed-kit-capability) as
observed recurring burden.

Falsifier: if creators of unlike propositions repeatedly author machinery-shaped decisions, or
the enumerated creator input grows toward the size of the machinery it composes, the seam is
misplaced and the placement model must change.

## Semantic core

The **semantic core** is the set of product truths that must remain unchanged for a change to count
as elevation rather than replacement. It includes, where applicable:

- intended audience, outcome and claim boundary;
- referent and authority identities;
- domain meanings, invariants and authorised operations;
- state and effect semantics, including success, failure and correction vocabulary;
- product interaction truth and equivalent accessible outcome;
- provenance and source/release relationship;
- rights, duties and decision hand-offs; and
- evidence vocabulary used to interpret the unchanged claim.

The semantic core is not “business logic” defined by file location. It is documented through the
proposition, capability contracts, scenarios and evidence records. An elevation comparison names
the exact core being asserted unchanged.

## Elevation is an obligation delta

Elevation occurs when a proposition retains its semantic core while real changes activate
additional obligations, evidence and bindings.

```text
existing proposition and semantic core
+ changed audience, exposure, state, rights, reliance, channel, reach or lifespan
→ new obligation profile
→ capability activation and legitimate binding/topology changes
→ transition, assurance and operational evidence
→ authorised updated disposition
```

Valid elevation may add identity, transactional state, migration, public security, observability,
capacity, support, backup/restore or provider bindings. It may change adapter, provider, topology
and operational budget. Those changes are not “hardening” hidden outside the architecture; they
are explicit consequences of the new context.

Elevation is falsified when unchanged obligations require a new authority model, domain meaning,
state identity, success/failure vocabulary, accessible interaction truth or proposition. That is a
redesign or a new product proposition, which may be valuable but is not evidence that elevation was
cheap.

## Elevation versus proposition change

| Change | Likely classification |
| --- | --- |
| Replace an in-process projection with a managed binding while preserving source, relationship meaning and user claim | Elevation, subject to parity and exit evidence |
| Add public exposure, rate/resource protection, operational ownership and support to the same read-only experience | Elevation if the semantic core and interaction truth remain intact |
| Add user-owned collections, retention and cross-device reconciliation to a stateless explainer | Often a proposition expansion; elevation only if the original claim remains a separable unchanged core |
| Change from advisory exploration to an official decision or assessment | New authority and claim; normally redesign/new proposition |
| Add children, vulnerable users or sensitive personal data | May activate a substantially different product and service design; cannot be treated as routine infrastructure |
| Replace staged local success with the first real external effect | Reveals the earlier artefact was not complete for that claim; not elevation evidence |

The decision is semantic and human, not based on percentage of code retained.

## Fast-and-good cost claim

“Cheap to elevate” is a falsifiable lifecycle claim. A comparison must hold the proposition,
quality floor and applicability boundary equal and account for:

- concept-specific work;
- recurring composition and plumbing;
- policy or authority archaeology;
- verification and human review;
- binding and environment work;
- migration, repair and rework;
- diagnostics and operational setup;
- maintenance, upgrade and drift;
- support, recovery and provider exit; and
- retirement and retained learning.

Useful outcomes include lower total effort per decision-relevant uncertainty resolved, fewer
hidden-policy discoveries, faster diagnosis, less unchanged semantic code rewritten, and more
recurring work reused without divergence. Time to first render is insufficient.

The claim fails if the Kit moves work into opaque framework concepts; the earlier experience
staged obligations; the semantic core changes; equal-quality bespoke work is cheaper over the
declared lifecycle; or common machinery raises maintenance and coordination more than it removes.

## Profile and elevation anti-patterns

- a quality ladder in which accessibility, provenance, security or truthful failure appear only
  in the final tier;
- “production” as a provider bundle unrelated to the proposition;
- a preset that silently activates or waives policy;
- provider types leaking into domain meaning;
- a public surface labelled a demo to avoid real obligations;
- a large platform backlog derived from every possible capability;
- a semantic rewrite reported as trivial elevation; or
- a composition manifest that becomes the authority for facts held elsewhere.

## Reopening conditions

Profiles should become simpler if the dimensions do not predict material obligations, and more
specific if competent authorities cannot express legitimate applicability. The semantic-core model
should be rejected if real elevation cannot be distinguished from product redesign or if it rewards
code retention while human and domain truth changes.
