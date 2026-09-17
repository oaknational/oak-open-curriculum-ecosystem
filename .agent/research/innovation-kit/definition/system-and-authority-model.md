# System and authority model

- **Status:** proposed definition
- **Owns:** system vocabulary, correspondence model, authority boundaries, analytical axes and
  seam rule
- **Does not own:** the strategic purpose, current capability status, provider choice or one
  product's proposition

## The object being modelled

The Innovation Kit is part of a **product-creation system**, not a software layer above a set of
packages. The system includes people and institutions as well as product, code and infrastructure.
It begins when a consequential possibility or question is framed and ends only when evidence has
a legitimate disposition and the resulting experience and knowledge have been evolved, preserved
or retired.

The model asks whether a product promise remains truthful across several correspondences:

```text
principal and situated context
→ intended human, educational or public outcome
→ referents and authoritative claims
→ norms, rights and duties
→ permitted operations and effects
→ observations and representations
→ evidence and competent interpretation
→ authorised correction, disposition or preservation
```

A locally correct component, API response, migration, deployment or test can contribute to this
chain. None proves that the complete chain is correct.

## Candidate conceptual basis

These seven primitives are a reasoning vocabulary, not proposed classes or database entities.

| Primitive | Meaning in this model |
| --- | --- |
| **Principal** | A person, group, organisation, system or accountable role that acts, is affected, holds authority or bears a duty |
| **Outcome** | A realised or sought consequence for a principal or the public; a technical transition is not automatically a human outcome |
| **Referent** | The thing being identified, described, acted on, represented, released, corrected or preserved |
| **Claim** | Contestable content about a referent, outcome, state or relationship, with scope and status |
| **Norm** | A rule, right, permission, prohibition, duty, quality obligation or authorised constraint |
| **Operation** | An intent, decision, transformation, execution or effect with identity, preconditions and outcome semantics |
| **Observation** | A source-bound record of what was inspected or occurred; it becomes evidence only through a warranted interpretation against a claim |

The Kit uses derived constructs to make the primitives usable:

| Construct | Purpose |
| --- | --- |
| **Proposition** | Binds people, context, intended outcome, real capability, claim class, difficult states and requested decision |
| **Semantic capability** | A stable set of meaningful operations, guarantees, absence, failure, recovery and authority hand-offs |
| **Capability contract** | Makes that meaning, authority, lifecycle and evidence inspectable without selecting one mechanism |
| **Composition profile** | Declares the obligations and capabilities activated by one proposition in one real context, including justified omissions |
| **Adapter** | Realises a semantic capability through a technology or protocol while preserving its contract |
| **Binding** | Supplies a concrete provider, endpoint, credential, resource lifecycle and control-plane relationship |
| **Host** | Owns the application or channel boundary: routes, chrome, local state, product language and integration surface |
| **Experience** | The complete human and service interaction through which a proposition becomes tangible |
| **Projection** | A derived representation with source identity, transformation, declared loss, completeness, release and freshness |
| **Evidence record** | Relates observations, method and limits to a claim, comparator and falsifier |
| **Disposition** | The authorised decision to advance, confirm, narrow, reshape, stop, retire, defer or preserve as unresolved |
| **Kit-placement record** | Explains why recurring work belongs in the Kit, remains local, splits or is rejected, and who will steward it |

The [core record definitions](core-records-and-interfaces.md) turn these constructs into stable
documentation interfaces.

## Five correspondence planes

The planes describe kinds of responsibility. They are neither deployable layers nor a package
topology, and all may be present in one small experience.

| Plane | Governing question | Typical responsibilities |
| --- | --- | --- |
| **Purpose and authority** | Why may this product promise exist, for whom, about what, and under whose competence? | Principals, outcomes, affected people, referents, claims, norms, difficult cases and decision rights |
| **Composition and activation** | Which obligations and capabilities are applicable here, and where do responsibilities sit? | Profiles, legitimate omission, Kit/domain/product/host/provider allocation, configuration and budgets |
| **Realisation and experience** | How does the promise become a real, intelligible experience? | Operations, state transitions, projections, integrations, content, interaction, delivery and human support |
| **Evidence and correction** | How do we know what occurred, what it means and what should change? | Observation, assurance, evaluation, interpretation, incident response, remedy, disposition and re-observation |
| **Evolution and stewardship** | How does meaning survive change and eventually end? | Release, compatibility, migration, provider exit, correction propagation, deprecation, retirement, custody and reuse |

The fast-and-good thesis depends on preserving correspondence between the planes. Preparing a
managed database binding without a domain-state contract is incomplete. Defining a semantic API
without release, failure and correction paths is also incomplete. A beautiful interaction that
misstates authority or completion is not rescued by its design quality.

## Four independent model axes

The definition uses several classifications that must not be collapsed.

| Axis | What it describes | Example |
| --- | --- | --- |
| **Context specificity** | Where meaning and policy belong | general framework → Oak profile → curriculum/domain capability → proposition-specific product |
| **Mechanism binding** | How a capability becomes executable | semantic contract → adapter → provider binding → host/product use |
| **Obligation activation** | What the real context requires | audience, exposure, claims, state/effects, rights, reliance, channel and scale activate a profile |
| **Evidence state** | What is known about an implementation or claim | specified, implemented, integrated, deployed, activated, exercised, observed, effective, supported and replaceable |

A general framework can be only partially implemented. A proposition-specific mechanism can be
excellent. A deployed surface can be inactive. A reusable package can lack evidence of product
value. Keeping these axes independent prevents file placement, consumer count, deployment and
quality from becoming false synonyms.

## How the other classifications relate

- **Correspondence planes** describe where a product promise must remain coherent.
- **Capability families** are omission-finding views over what may be required.
- **Contract dimensions** state the questions every applicable capability must answer.
- **Profiles** bind a proposition and context to an activated obligation set.
- **Pipelines** describe changes and hand-offs through time.
- **Current-estate evidence states** report what this repository demonstrates at a dated pin.

They are complementary views, not competing taxonomies. None implies packages, services, teams or
priority. The [capability model](capability-and-contract-model.md) owns capability families and
dimensions; the [composition model](composition-profiles-and-elevation.md) owns profiles; the
[pipeline model](operating-pipelines.md) owns temporal closure; dated status lives in
[current-estate evidence](../evidence/current-estate-2026-08-30.md).

## Authority is plural and competence-specific

“Owner” is too imprecise for this system. At minimum, distinguish:

| Authority role | Legitimate scope |
| --- | --- |
| **Proposition owner** | Frames the opportunity, intended audience and decision sought |
| **Semantic or domain authority** | Defines the referents, meanings, invariants and authorised corrections in a domain |
| **Educational or professional authority** | Interprets pedagogy, assessment, professional practice and situated educational claims |
| **Design and accessibility authority** | Owns design-system meaning and competent accessibility standards and judgments |
| **Rights or policy duty-bearer** | Decides applicable permissions, duties, restrictions, challenge and remedy |
| **Method owner** | Owns the evaluation method, limitations and competent interpretation |
| **Disposition owner** | Has authority to advance, reshape, stop or otherwise act on evidence |
| **Product or service owner** | Owns the sustained product promise, support model and service objectives |
| **Runtime operator** | Operates, observes and repairs a named deployment within delegated authority |
| **Kit steward** | Owns Kit admission, compatibility, lifecycle and consumer experience without taking upstream semantics |
| **Affected person** | Retains applicable rights to understand, challenge, correct, refuse or obtain remedy |

One person may hold several roles. The roles remain distinct because their evidence, duties and
right to decide differ. An operator can restore service without acquiring curriculum authority; a
Kit steward can maintain an adapter without defining retention policy; usage analytics cannot
replace a method owner's interpretation.

## Responsibility boundary

| Kit-owned or Kit-governed | Remains with a consumer or competent authority |
| --- | --- |
| Product-creation grammar and record interfaces | Proposition, audience, situated problem and intended outcome |
| Obligation activation and valid-omission mechanism | Applicability decisions that require domain, legal, safeguarding, educational or service competence |
| Capability contract envelope and compatibility rules | Curriculum, pedagogy, assessment, policy and domain meaning |
| Composition, scenarios, diagnostics and evidence plumbing | Distinct interaction grammar, content strategy and product language |
| Reusable adapters and binding lifecycle patterns | Domain schema, invariants, queries, semantic migrations and retention meaning |
| Cross-cutting affordances for accessibility, trust, operation and evolution | Claim-specific thresholds, product SLOs, support and incident authority |
| Admission, upgrade, divergence, deprecation and exit machinery | Deliberately proposition-specific mechanisms and unproved generality |

The Kit may deliberately own a recurring responsibility before a second consumer exists when its
invariants, lifecycle, isolation or assurance justify that placement. Its **generality and reach**
remain hypotheses until unlike use or a meaningful counter-instance tests them.

## The seam rule

A seam is material when any of the following changes independently:

- intended value or affected people;
- referent identity or semantic meaning;
- competent authority, right or duty;
- state identity, clock, consistency or finality;
- projection invariant, completeness, freshness or accepted loss;
- evidence regime, interpretation or decision right; or
- stewardship, lifecycle, custody or failure consequence.

Material seams require an explicit contract or hand-off. File type, technology noun, provider,
repository, current package boundary and consumer count are evidence about implementation—not
proof that a semantic seam exists.

The inverse test is also important: several mechanisms should collapse when they protect no
different meaning, authority, lifecycle or assurance boundary. Simplicity means the fewest
concepts that preserve the complete promise, not the fewest visible boxes.

## Reopening conditions

This model should be narrowed or replaced if representative product work shows that the candidate
primitives cannot express material obligations ergonomically; the planes add ceremony without
improving truth, diagnosis or decisions; unlike products repeatedly succeed from a simpler model
without hidden-policy reconstruction; or competent authorities find that the boundaries obscure
rather than preserve their responsibility.
