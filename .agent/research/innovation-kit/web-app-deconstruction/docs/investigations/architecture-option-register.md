# Architecture option register

## Status and use

This register preserves architectural approaches raised during the deconstruction so they are not mistaken for either settled recommendations or forgotten conversation. Each entry is a falsifiable option for the Oak Innovation Kit. Options may be combined, narrowed or rejected after the relevant premise record establishes the outcome and obligations.

The register does not rank options by implementation effort, delivery time or package count. An option earns its place only by producing the required educational, product, design and operational outcomes at the highest demonstrable quality with a coherent model.

Framework convention is evidence about how an implementation may be expressed. It is not evidence that an Oak capability, stateful boundary or abstraction is needed.

## Comparison discipline

Compare complete systems, not pattern names. For every option:

1. identify the outcome, authority, invariants, lifecycle and failure contract it would own;
2. state which surrounding assumptions it holds fixed and which it changes;
3. show normal, restricted, stale, failed, resumed and recovery behaviour;
4. account for accessibility, safeguarding, privacy, consent, rights, security and observability;
5. distinguish authoritative state from deterministic projection and ephemeral view state;
6. test whether the option removes complexity or merely moves it behind an abstraction;
7. prefer no conclusion when decisive evidence is absent.

## System-shape options

### AO-001: Server-first modular monolith

**Option proposition:** A single deployable, organised as semantically cohesive capability modules, can express most Oak product behaviour while resolving data, policy and composition on the server and isolating only interactions that require a client runtime.

- **Applicable when:** capabilities need one operational boundary, share authoritative transactions or policy, and do not require independent scaling, isolation or release semantics.
- **Potential strengths:** direct control flow; one observable request path; server-resolved accessibility and metadata; fewer network and consistency boundaries; capability cohesion without distributed deployment.
- **New risks:** an undisciplined monolith can become implicit coupling; one deployment can widen failure impact; client interaction may be forced through awkward server boundaries; long-running work may still need durable execution elsewhere.
- **Invalidators:** capabilities require independently controlled data, failure isolation or lifecycle; the deployable cannot meet availability or regional obligations; server/client boundaries repeatedly obscure rather than clarify interaction state; module rules cannot prevent cycles or hidden shared state.
- **Decisive evidence:** representative teacher, pupil and editorial vertical slices; dependency graph; failure injection; deployment and recovery model; server/client payload and interaction evidence.

### AO-002: Capability modules

**Option proposition:** The primary internal boundaries should follow complete educational or operational capabilities, with each module owning its vocabulary, use cases, policy and tests.

- **Applicable when:** changes and invariants cluster around an outcome such as curriculum discovery, pupil learning or resource delivery.
- **Potential strengths:** decision locality; behaviour can be tested without route or vendor machinery; framework APIs can expose meaningful Oak operations.
- **New risks:** capability names can hide shared authorities; duplicated policy can emerge between audience-shaped modules; cross-capability journeys can become orchestration layers with no clear owner.
- **Invalidators:** change and invariant evidence consistently clusters around another boundary; modules require cycles; ostensibly local facts need multi-module transactions; domain experts cannot explain the split without repository terminology.
- **Decisive evidence:** change-history clustering, purpose chains, invariant ownership, dependency direction, and end-to-end journey traces.

### AO-003: Ports and adapters

**Option proposition:** Oak semantics can remain independent of transport, storage and provider types through explicit ports implemented at genuine external boundaries.

- **Applicable when:** external systems have different identifiers, failure semantics, freshness or lifecycle from Oak's enduring concepts, or when controlled substitutes improve behavioural proof.
- **Potential strengths:** vendor types stop at a boundary; effects and failure contracts become visible; domain behaviour can be deterministic; provider replacement does not rewrite policy.
- **New risks:** one-to-one wrappers add vocabulary without changing semantics; generic ports erase useful provider capabilities; mapping and exception handling can be duplicated.
- **Invalidators:** the external protocol is itself the enduring domain contract; adapters only forward calls and types; an abstraction prevents access to necessary guarantees; substitutions cannot reproduce relevant provider semantics.
- **Decisive evidence:** semantic difference analysis, provider failure matrix, contract tests against real and substitute implementations, and review of mapping ownership.

### AO-004: Direct framework composition

**Option proposition:** Products can compose request, route, layout, error and isolated interaction obligations directly using the chosen framework rather than consuming a universal runtime shell.

- **Applicable when:** obligations are explicit and independently composable; product profiles are materially different; the framework already owns the relevant lifecycle.
- **Potential strengths:** idiomatic framework behaviour remains visible; routes load only what they require; no shell API must mirror the framework.
- **New risks:** consumers may omit trust obligations; equivalent behaviour may drift; repeated composition can distribute policy and assurance.
- **Invalidators:** parity evidence shows a stable, inseparable application contract; omission remains likely despite generated checks and scaffolding; provider order or lifecycle is a cross-product invariant; direct composition creates multiple authorities.
- **Decisive evidence:** rendered parity suites, omission analysis, consumer composition studies, failure hierarchy tests and payload evidence.

### AO-005: Explicit shell contract with profiles

**Option proposition:** A framework-owned application-host contract, expressed through named profiles rather than one unconditional component tree, can guarantee common obligations while preserving product-specific composition.

- **Applicable when:** consent, identity, metadata, reporting, accessibility diagnostics or recovery form a stable application-level contract across products.
- **Potential strengths:** obligations are hard to omit; profile differences are named; assurance can target one contract; migrations can preserve behaviour across host technologies.
- **New risks:** profiles become a configuration language; a React shell can force client work or provider ordering; host abstractions can lag framework evolution; optional flags can conceal incoherence.
- **Invalidators:** common behaviour decomposes cleanly into request, route and interaction primitives; profiles mostly encode product differences; the shell adds client runtime or blocks framework capabilities; no stable host-independent contract can be stated.
- **Decisive evidence:** application-host premise record, equivalent product implementations with direct composition, and measured server/client and failure behaviour.

## Domain and state options

### AO-006: Deterministic core, imperative edge

**Option proposition:** Curriculum rules, eligibility, grading, transitions and projections can be deterministic functions over explicit inputs, while clocks, storage, networks, analytics and provider calls remain at an imperative edge.

- **Applicable when:** the important behaviour can be stated as invariants and transitions independent of I/O timing.
- **Potential strengths:** reproducibility; property and example testing; replayable evidence; explicit effect requests; provider failures cannot silently redefine policy.
- **New risks:** real temporal or distributed semantics may be oversimplified; effect coordination can migrate into an informal orchestrator; large input/output values can become difficult to evolve.
- **Invalidators:** correctness inherently depends on an external transaction or live ordering guarantee; the split produces duplicated state; deterministic replay cannot reproduce material outcomes; domain experts cannot identify stable inputs and invariants.
- **Decisive evidence:** pure vertical-slice models, property tests, replay of recorded journeys and failure injection at every requested effect.

### AO-007: Explicit reducers or statecharts

**Option proposition:** Workflows with meaningful states, guarded transitions, effects and recovery should use an explicit reducer or statechart rather than distributed booleans, hooks and callbacks.

- **Applicable when:** order, acknowledgement, cancellation, retry, read-only modes or recovery are part of correctness.
- **Potential strengths:** illegal transitions are visible; effects follow state decisions; adverse states can be enumerated; UI derives from one model.
- **New risks:** ceremonial machines for simple forms; parallel state can still exist outside the model; statechart notation may obscure domain language; persisted schema evolution becomes an obligation.
- **Invalidators:** the workflow is accurately expressible as a stateless request or ordinary form; the model adds states that have no user or operational meaning; effects still mutate authoritative state outside transitions; concurrency cannot be represented coherently.
- **Decisive evidence:** model current and redesigned pupil-result or download workflows, generate transition tests, then compare omitted and contradictory states.

### AO-008: Outcome events

**Option proposition:** Immutable events named for accepted domain outcomes can decouple secondary reactions such as telemetry, notifications, projections or external synchronization from the authoritative transition.

- **Applicable when:** one accepted transition has several independently failing consequences or requires an audit/replay trail.
- **Potential strengths:** the source transition is acknowledged once; consumers have explicit contracts; asynchronous consequences can retry; observability uses domain meaning.
- **New risks:** events can become an implicit integration API; ordering, delivery, schema evolution and idempotency become essential; event names can describe technical activity rather than real outcomes.
- **Invalidators:** all consequences must be atomic in one transaction; there is no durable fact worth publishing; synchronous direct calls are clearer and equally reliable; consumers require mutable snapshots rather than event history.
- **Decisive evidence:** identify the authoritative transition and transaction boundary, enumerate consumers and tolerable lag, then exercise duplicate, delayed, reordered and missing delivery.

### AO-009: Consent-aware telemetry as an effect

**Option proposition:** Product analytics, feedback and diagnostic telemetry can consume typed outcome evidence through a consent and policy decision boundary rather than being called throughout views and domain logic.

- **Applicable when:** the same outcome supports measurement or diagnostics, but collection depends on purpose, consent, minimisation, retention or audience.
- **Potential strengths:** product logic does not depend on vendors; consent denial has a defined no-effect result; event semantics can match outcomes; collection and diagnostic obligations can remain distinct.
- **New risks:** a central bus can collect too much; delayed consent may create unclear semantics; essential operational telemetry may be incorrectly treated as optional analytics; inferred outcome events may lose interaction context.
- **Invalidators:** measurement genuinely requires interaction-level timing unavailable at the boundary; legal/policy analysis requires distinct direct controls; abstraction hides data lineage; event typing cannot prevent prohibited payloads.
- **Decisive evidence:** data-purpose inventory, consent-state traces, deletion/retention proof, payload inspection and comparison with direct instrumentation.

## Curriculum and projection options

### AO-010: One curriculum authority with derived projections

**Option proposition:** Browse, exact retrieval, search documents and graph representations can be deterministic, versioned projections of one authoritative curriculum model.

- **Applicable when:** these surfaces describe the same curriculum identities and relationships and differ primarily by query or retrieval needs.
- **Potential strengths:** one meaning for identity and withdrawal; reproducible derived views; version lineage; less reconciliation between hand-maintained models.
- **New risks:** the authoritative model can become over-general; projection build and publication become critical infrastructure; search relevance or graph inference may require facts absent from the source; projection lag must be explicit.
- **Invalidators:** surfaces own genuinely distinct facts or editorial authority; one model cannot express required semantics without consumer-specific contamination; independent lifecycle or access rules are essential; deterministic rebuild cannot reproduce a served view.
- **Decisive evidence:** identity and fact provenance matrix, rebuild comparison, withdrawal/publication trace and search/graph quality evaluation.

### AO-011: Separate authoritative retrieval systems

**Option proposition:** Curriculum API, search and graph should remain separately authoritative where each system owns distinct semantics, optimisation and lifecycle rather than merely projecting a common source.

- **Applicable when:** human curation, learned relevance, graph assertions or operational independence creates facts that cannot be derived from one curriculum publication.
- **Potential strengths:** each system can express its domain honestly; failure isolation and specialised storage remain possible; relevance and inference can evolve independently.
- **New risks:** identity and withdrawal reconciliation; unclear fact provenance; synchronization and drift; consumers may receive contradictory answers.
- **Invalidators:** all independent facts can be represented as versioned annotations or projections; reconciliation dominates the design; no owner can state which system wins; the same policy is maintained repeatedly.
- **Decisive evidence:** classify every field as source fact, annotation, inference or index structure; test contradictory updates; establish authority and recovery for each shared identity.

## Web and UI options

### AO-012: App Router and React Server Components

**Option proposition:** Next.js App Router and React Server Components can provide the idiomatic host for request-time composition, data access, metadata, error boundaries and small client interaction islands.

- **Applicable when:** the selected products benefit from server rendering and streaming, and Next.js lifecycle semantics match deployment, cache and recovery obligations.
- **Potential strengths:** server data dependencies remain near routes; metadata and error boundaries are framework concepts; client code can be isolated; HTML can carry complete initial meaning.
- **New risks:** framework cache semantics can obscure freshness; server/client module constraints can contaminate libraries; route ownership can fragment capabilities; adopting Next.js may become an unexamined kit requirement.
- **Invalidators:** another host expresses the obligations more coherently; required interactions make most of the tree client-owned; framework caching conflicts with authority or publication semantics; kit capabilities cannot remain host-independent where they should.
- **Decisive evidence:** implement one representative server-first slice and the same obligations in an alternative host, inspect module graphs, caching, accessibility and failure recovery.

### AO-013: Generated visual foundations and native controls

**Option proposition:** Authoritative design decisions can generate static tokens and CSS, while semantic HTML and native controls provide interaction foundations, supplemented only by shared behaviour whose accessible contract cannot be obtained directly.

- **Applicable when:** visual values have a clear source; native semantics fit the interaction; shared code can remain narrow and framework-neutral.
- **Potential strengths:** low runtime coupling; platform accessibility and form semantics; multiple framework consumers; generated representations cannot drift independently.
- **New risks:** native controls vary by browser and may not meet all brand or interaction needs; complex widgets still need disciplined behaviour; generated CSS can become a weakly governed global API.
- **Invalidators:** required interactions cannot meet usability and accessibility with native composition; brand or content needs require a maintained semantic component; generated outputs lack stable versioning; consumers repeatedly rebuild the same difficult behaviour incorrectly.
- **Decisive evidence:** representative control and layout set across browsers, assistive technologies, themes and rendering hosts; source-to-output drift test; consumer composition study.

### AO-014: Framework component and recipe layer

**Option proposition:** The kit should provide maintained framework components or recipes where the complete visual, semantic, interaction and assurance contract is best owned once.

- **Applicable when:** a pattern has substantial state or accessibility behaviour, represents an Oak-specific product concept, or requires coordinated content and interaction policy.
- **Potential strengths:** hard-won behaviour is inherited; product language remains consistent; variants and assurance have one authority.
- **New risks:** component props become a parallel design language; server/client and styling dependencies spread through consumers; generic primitives can constrain ordinary HTML; private recipe coupling can undermine public boundaries.
- **Invalidators:** native or headless composition consistently meets the contract; product variation makes the shared API more complex than local composition; imports impose unrelated runtime code; accessibility proof depends on undocumented consumer behaviour.
- **Decisive evidence:** component-by-component purpose classification, bundle and RSC experiments, accessibility tests, and comparison with generated/native alternatives.

### AO-015: One-release subpath exports

**Option proposition:** If an existing single-root UI package is split, tokens, primitives, behaviours and recipes can be exposed as stable subpath exports in one release, with the root retained as a compatibility surface for that release.

- **Applicable when:** the package graph already contains coherent layers, consumers need lower-level surfaces, and a controlled migration is required.
- **Potential strengths:** consumers can adopt explicit layers without a flag day; one published version prevents cross-package skew; module graphs can become inspectable.
- **New risks:** root and subpaths become parallel public APIs; internal coupling may prevent real isolation; compatibility can freeze accidental concepts; a release tactic may be mistaken for the target architecture.
- **Invalidators:** subpaths retain the same transitive runtime graph; layers cannot be given independent contracts; no migration obligation exists in OCE; generated/native redesign removes the package premise entirely.
- **Decisive evidence:** package export prototype, declaration and module-graph inspection, representative consumer builds, and an explicit compatibility decision.

## Delivery and enablement options

### AO-016: Conditional synchronous or queued artifact delivery

**Option proposition:** Artifact production should use a synchronous response only when generation, validation and delivery can complete within the interaction's reliability contract; other cases should use a durable queued job with explicit status and retrieval.

- **Applicable when:** DOCX, XLSX, ZIP or other generated outputs vary materially in duration, size, dependency availability or retry needs.
- **Potential strengths:** simple cases remain direct; durable work has acknowledgement, idempotency and recovery; generation success is distinguishable from delivery success.
- **New risks:** two modes can produce inconsistent semantics; queues add persistence, authorization, expiry and notification obligations; thresholds can become arbitrary rather than outcome-based.
- **Invalidators:** the artifact premise is removed by direct resource representation; all valid work is reliably streamable in one request; all work requires durable execution; users cannot understand or benefit from mode differences.
- **Decisive evidence:** complete artifact contract, duration and failure distributions, browser/CDN behaviour, cancellation and retry tests, usability evaluation of delayed retrieval.

### AO-017: Scaffolding

**Option proposition:** A generator can create a correct initial product or capability shape from explicit kit contracts while leaving ordinary framework code visible to the consumer.

- **Applicable when:** required setup is deterministic, omissions are detectable and generated ownership can transfer cleanly to the product.
- **Potential strengths:** trust obligations and assurance start present; consumers learn the intended composition through normal code; regeneration need not be a runtime dependency.
- **New risks:** templates stale quickly; generated code diverges; options multiply; scaffolding can encode architecture before premises are settled.
- **Invalidators:** correct setup depends on contextual human decisions; generated files require ongoing synchronized regeneration; consumers cannot explain the output; a library, compiler check or framework primitive owns the obligation more reliably.
- **Decisive evidence:** create materially different consumers, evolve the kit, perform an upgrade, and audit generated code for unexplained or obsolete concepts.

### AO-018: Paved-road composition

**Option proposition:** The kit can provide supported reference compositions, checks, fixtures and deployment/assurance workflows without requiring one generated or inherited application skeleton.

- **Applicable when:** several implementations can satisfy one outcome contract and consumers need verified choices rather than a universal host.
- **Potential strengths:** product autonomy with explicit support boundaries; examples remain executable; framework-native composition is preserved; checks can prove obligations.
- **New risks:** guidance can become optional folklore; reference applications may drift; consumers still assemble incompatible choices; support boundaries can be vague.
- **Invalidators:** obligations cannot be reliably verified after composition; every correct consumer converges on one inseparable implementation; reference paths proliferate without semantic reason; teams must understand hidden framework internals to succeed.
- **Decisive evidence:** build and independently review multiple consumers, test upgrade and failure paths, and verify that deviations either remain correct or fail with actionable evidence.

## Relationships worth testing

These combinations are coherent possibilities, not bundles to adopt:

| Question             | Competing combinations                                                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Application host     | Server-first modular monolith + direct framework composition versus shell contract + profiles; either may use App Router/RSC if Next.js earns the host role.             |
| Domain behaviour     | Capability modules + deterministic core/imperative edge + selective ports/adapters versus framework-native end-to-end implementation.                                    |
| Stateful workflows   | Ordinary form/request handling versus reducer/statechart; outcome events only where an accepted transition has separable consequences.                                   |
| Curriculum discovery | One authority + deterministic projections versus distinct authorities with explicit reconciliation and provenance.                                                       |
| UI enablement        | Generated tokens/CSS + native controls + narrow behaviours versus maintained components/recipes; a hybrid must still give each responsibility one authority.             |
| Artifact delivery    | Remove the artifact workflow, direct synchronous delivery, durable queued production, or an evidence-based combination.                                                  |
| Kit adoption         | Libraries and contracts alone, scaffolding, paved-road compositions, or a shell; consumers may need different combinations only when their obligations genuinely differ. |

## Reopening rule

No pattern in this register becomes doctrine because it is idiomatic, familiar or already present in OCE. A selection must cite a completed premise record, the decisive evidence, its excellence contract, rejected alternatives and the evidence that would reopen it.
