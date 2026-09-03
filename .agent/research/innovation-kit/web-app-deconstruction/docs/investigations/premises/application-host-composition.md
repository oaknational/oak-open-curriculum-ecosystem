---
id: PR-001
subject: Application host composition
status: framing
decision_affected: How the Oak Innovation Kit enables products to compose server, route, document and client-interaction obligations
evidence_snapshot: OWA 510ac63; Oak Components 8ff8264; OCE bd878a3
last_updated: 2026-07-19
---

# Application host composition

## Decision boundary

This record asks which application-level responsibilities the Innovation Kit must make difficult to omit and how products should compose them. It does not assume that the answer is a shared React component, a provider tree, Next.js, or product-local code.

The current evidence is primarily static. The alternatives remain candidate hypotheses until runtime parity, product intent and consumer studies provide decisive evidence.

## Current observation

- **Literal behaviour:** OWA has active Pages Router and App Router roots. Both compose identity, consent-aware services, analytics, errors, styling and product chrome through similar but non-identical mechanisms. Pupil and Classroom surfaces add focused profiles.
- **Inputs and outputs:** route, request, preview, identity and consent state enter host composition; the result is a document, metadata, server-rendered content, client interaction roots, telemetry decisions and recoverable failure UI.
- **State and authority:** identity is provider-backed; consent and several navigation or notification concerns use client providers; metadata, request policy and server data are route or host owned; reporting spans server and browser.
- **Dependencies and lifecycle:** Next.js router lifecycles, React server/client boundaries, Clerk, consent, analytics, reporting, styles, fonts, assets and route-specific providers currently participate.
- **Excellence currently delivered:** server-rendered content, language and metadata, consent-gated services, reduced-motion rules, accessibility diagnostics, error reporting and recovery, stable styling, focused pupil presentation and route-specific Classroom context.
- **Difficult states and exceptions:** consent denied or unresolved, unauthenticated or unauthorized entry, preview, nested versus root errors, partial data failure, missing browser capability, read-only Classroom work and routes that need no broad client state.
- **Known failures or duplication:** the two roots differ in document language, theme, identity configuration, analytics initialization, assets, SEO mechanism, provider sets and error hierarchy. It is not yet known which differences are required.
- **Historical reason or constraint:** two active Next.js router generations and continuing journey migration explain some duplication, but current source does not establish the intended destination.

Primary local evidence: [runtime-shell parity](../../current-state/runtime-shell-parity.md), [system map](../../current-state/system-map.md), [repository anatomy](../../current-state/repository-anatomy.md), [production topology](../../current-state/production-topology.md), and [pupil lesson to results](../../current-state/journeys/pupil-lesson-to-results.md).

## Purpose chain

| Layer                          | Statement                                                                                                                                                                   | Evidence                                                                                 | Confidence                                |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------- |
| Human or educational outcome   | A teacher or pupil reaches the intended Oak experience with understandable navigation, correct identity and consent behaviour, accessible presentation and humane recovery. | Current journey traces and rendered responsibilities across both roots.                  | Medium                                    |
| Product or operational outcome | Every product consistently applies applicable trust, document, observability and recovery obligations without loading unrelated behaviour.                                  | Runtime-shell parity and production topology.                                            | Medium                                    |
| Applicable obligation          | Accessibility, privacy and consent, safeguarding, security, canonical metadata, error acknowledgement and operational diagnosis apply at appropriate boundaries.            | Current integrations and assurance map; exact policy ownership still needs confirmation. | Medium                                    |
| Domain invariant               | Product-specific capabilities retain their own state and policy; application-wide obligations must not be accidentally omitted or initialized contrary to consent.          | Inferred from current provider purposes and route differences.                           | Low                                       |
| Chosen system decision         | OWA currently uses root layouts, `_app`, nested layouts and React providers to coordinate the obligations.                                                                  | Source map.                                                                              | High                                      |
| External constraint            | The chosen web framework controls document, routing, streaming, error and server/client lifecycles; identity and telemetry providers impose protocols.                      | Current Next.js and provider integrations.                                               | High for OWA, unknown for future products |
| Current mechanism              | Two router shells plus profile-specific layout/provider composition and shared browser hooks.                                                                               | Runtime-shell parity.                                                                    | High                                      |

## Explicit premises and invalidators

| ID    | Premise                                                                                      | Why it is believed                                                                                                     | Premise invalidator                                                                                                                   | What changes if false                                                                               | Evidence needed                                                                    |
| ----- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| AH-P1 | There is a stable set of application-level outcomes shared by Oak web products.              | The two OWA roots repeat consent, identity, reporting, analytics, styles and recovery responsibilities.                | Equivalent outcomes prove route- or capability-specific, or future products require materially incompatible semantics.                | Do not create a universal host contract; provide smaller capability contracts or verification only. | Product intent, additional-consumer profiles and rendered parity results.          |
| AH-P2 | Common obligations need not share one React lifetime or provider tree.                       | Several concerns are naturally request, document, server, route or isolated interaction responsibilities.              | Correct behaviour depends on one ordered client context graph or shared mutable application state.                                    | A shell or explicit provider profile may be the coherent authority.                                 | Consumer graph, provider-order tests and effect/state ownership analysis.          |
| AH-P3 | Most initial application composition can be server resolved.                                 | Content, metadata, access policy and error boundaries already have server/framework mechanisms.                        | Required first interaction depends on browser-only state, or server resolution produces incorrect, inaccessible or stale experiences. | Increase explicit client ownership and specify hydration semantics.                                 | Server-first vertical slices across consent, identity, preview and failure states. |
| AH-P4 | Client runtime can be isolated to interactions that require it.                              | Many host concerns produce HTML, headers or server effects rather than continuous client state.                        | Interaction islands need pervasive shared state or create repeated hydration and coordination failures.                               | Consider a broader client host or a different interaction model.                                    | Module graphs, interaction traces and cross-island state analysis.                 |
| AH-P5 | Direct framework composition can make obligations as reliable as a framework-owned shell.    | Next.js exposes routes, layouts, metadata and error boundaries directly; generation and checks could prevent omission. | Multiple consumers omit or inconsistently order critical obligations despite the strongest available static and runtime evidence.     | A stronger kit-owned host abstraction or profile becomes warranted.                                 | Independently implemented consumers and omission/failure audits.                   |
| AH-P6 | A common host contract can be expressed independently of Next.js if it is enduring.          | Outcomes such as consent, language and recovery are not inherently router APIs.                                        | Every useful contract term is a thin restatement of Next.js lifecycle and has no meaning in another host.                             | Keep the kit host-specific and avoid a false portable abstraction.                                  | Express the contract in an alternative web host and compare semantic loss.         |
| AH-P7 | Current root differences contain migration or accidental complexity.                         | Both routers are active and recent history includes route migration.                                                   | Product and operational intent confirms each difference as required by its route profile.                                             | Preserve distinct profiles and test them as intentional variants.                                   | History, owners, runtime parity and route dependency inventory.                    |
| AH-P8 | Next.js App Router and React Server Components are candidates, not preconditions of the kit. | They can express server-first composition but OCE's purpose is broader than one current router mechanism.              | All intended products and kit guarantees are inseparable from Next.js deployment and RSC semantics.                                   | Make that dependency explicit and prove it as part of the framework contract.                       | Consumer strategy, alternative-host study and deployed requirements.               |

## Complexity classification

- **Essential domain complexity:** product identity, access policy, curriculum journey context, consent decisions, failure acknowledgement and which capabilities require persistent interaction state.
- **Trust or policy obligation:** document language, accessibility and motion preferences, privacy/consent, safeguarding, security boundaries, metadata correctness, reporting and data minimisation.
- **Chosen system complexity:** Next.js router generation, provider order, React context, styled-components registries, route-group layouts and root-level browser initialization.
- **Accidental or migration complexity:** duplicate router roots, legacy and current themes, differing metadata libraries, parallel analytics initialization and compatibility assets, subject to historical confirmation.
- **Compensating mechanism:** broad provider trees, common test wrappers and root hooks may compensate for responsibilities without a smaller explicit home.
- **Unknown:** intended product profiles, whether common client state is essential, exact cross-product identity/consent contract, host portability requirements and which current differences are deliberate.

## Challenge the system

- Could consent-sensitive services initialize at their effect boundary, removing a global client provider?
- Could identity and authorization be resolved by request and route policy, with client identity state only where interactive account UI needs it?
- Could metadata, language, fonts and recovery be generated or verified from product declarations?
- Could product chrome be capability composition rather than a host responsibility?
- Could notifications be outcome-specific live regions instead of one global store?
- Could isolated client roots communicate through server-authoritative state or explicit events rather than a shared provider graph?
- Would changing the selected web framework remove the need for a kit shell, or merely move the same obligations?
- Does a universal shell solve a real invariant or only hide differences between products?

## Competing system designs

The relevant register entries are [AO-001, AO-004, AO-005 and AO-012](../architecture-option-register.md). The candidates below are intentionally not ranked.

| Candidate                                | Concepts and authorities                                                                                                                             | Outcomes and excellence preserved                                               | New failure modes                                                                        | Candidate invalidators                                                                            |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Preserve two OWA-style roots             | Each router root owns document and provider composition; shared hooks and components provide overlap.                                                | Maximum current-mechanism fidelity during migration.                            | Continuing parity drift, duplicated policy and two recovery models.                      | The kit has no migration constraint requiring both roots, or parity cannot be assured.            |
| One unconditional framework shell        | One kit component/provider tree owns all common concerns.                                                                                            | Strong omission resistance and one integration point.                           | Unnecessary client work, provider-order coupling, profile flags and framework mirroring. | Representative routes require materially different lifecycles or the shell loads unrelated state. |
| Profiled host contract                   | Kit names common obligations and supported host profiles; each profile supplies only its necessary implementations.                                  | Common outcomes plus explicit pupil, public, account or Classroom variation.    | Configuration language growth and invalid profile combinations.                          | Profiles mostly restate products or cannot enforce one behavioural contract.                      |
| Direct server and route composition      | Product uses framework-native document, middleware, metadata, error and server data mechanisms; kit supplies capability APIs and conformance tests.  | Idiomatic host behaviour and minimal client roots.                              | Critical omission or cross-product drift.                                                | Independent consumers fail assurance or require repeated hidden ordering knowledge.               |
| Generated host composition               | A typed product declaration generates or scaffolds layouts, metadata, policy and checks, leaving narrow interaction roots.                           | Repeatable setup and explicit product choices.                                  | Generated/source drift, opaque output and option explosion.                              | Composition requires contextual decisions that cannot be generated honestly.                      |
| Request kernel plus interaction adapters | A framework-neutral request policy resolves obligations; host-specific adapters implement document/route behaviour; interactions initialize locally. | Portable semantic contract with explicit external boundary.                     | Lowest-common-denominator request model and adapter duplication.                         | Host semantics cannot be represented without leaking through the kernel.                          |
| No common host capability                | Kit provides curriculum, UI and trust primitives only; every product owns its host.                                                                  | Maximum product/framework autonomy.                                             | Repeated omissions and inconsistent Oak trust behaviour.                                 | Host evidence shows stable cross-product invariants best owned and assured once.                  |
| Alternative non-React or non-Next host   | Use another idiomatic web host and platform-native composition.                                                                                      | Tests whether Oak outcomes, rather than current framework, define the boundary. | Ecosystem mismatch or loss of required streaming/deployment features.                    | Cannot meet the complete excellence contract or intended consumer needs.                          |

Candidate transformations represented: preserve, remove the shell, absorb obligations into request/route capabilities, combine them in profiles, invert composition through declarations, generate host files, use framework-native mechanisms, and redesign product state so global providers disappear.

## Excellence contract

- **Correctness and semantic integrity:** every route declares or demonstrably inherits the applicable host obligations; there is one authority for each document, identity, consent and recovery decision.
- **Curriculum and content integrity:** host caching, preview and metadata cannot silently serve a curriculum identity or publication state inconsistent with the capability response.
- **Accessibility and inclusive interaction:** correct document language and landmarks; keyboard and focus continuity; reduced-motion support; accessible loading and error states; usable pre-hydration content where the interaction permits it.
- **Safeguarding, privacy, consent, rights and security:** consent purpose gates the correct effects; authorization occurs at the authoritative boundary; sensitive identity or pupil state is not placed in global client state without need.
- **Identity, state and effect semantics:** server, browser, route and interaction state have named authorities and lifetimes; effects do not run merely because a provider mounted.
- **Failure acknowledgement and recovery:** root, route, capability and interaction failures have intentional boundaries; reporting failure does not prevent humane UI; retries do not duplicate outcomes.
- **Reliability and operability:** release identity, structured context and trace correlation work across server and browser; degraded behaviour and provider absence are testable.
- **Evolvability and conceptual coherence:** consumers can explain the host contract without reading provider internals; adding a capability does not require editing an unrelated universal tree.
- **Idiomatic language, platform, protocol and framework use:** framework lifecycle is used directly unless an evidenced Oak invariant warrants abstraction; browser semantics remain available rather than recreated.
- **Developer and consumer experience:** obligations, supported profiles, composition points and failure messages are discoverable; invalid composition fails before production with an actionable explanation.
- **Automated and human evidence required:** rendered parity, accessibility and metadata checks; consent/network traces; failure injection; server/client module graph; human review of recovery, identity and product-profile behaviour.

## Decisive investigations

| Question                                                        | Evidence or experiment                                                                                                     | Result  | Effect on premises and candidates                                                    |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------ |
| Which root behaviours are actual product obligations?           | Obtain product, design, accessibility, privacy and operational intent; render equivalent routes under both roots.          | Pending | Confirms or rejects AH-P1 and AH-P7.                                                 |
| Is one client lifetime necessary?                               | Trace provider reads/writes and order; remove or localize each provider in a controlled slice.                             | Pending | Discriminates direct composition, profiles and universal shell.                      |
| Can server-first composition preserve the complete interaction? | Build teacher discovery and pupil entry slices with server-resolved data/policy and isolated client controls.              | Pending | Tests AH-P3, AH-P4 and AO-001/AO-012.                                                |
| Can critical obligations be made non-optional without a shell?  | Give independent consumers typed contracts, checks and a paved-road example; audit omissions and reasoning.                | Pending | Tests AH-P5 and scaffolding/paved-road alternatives.                                 |
| Is the semantic contract portable?                              | Express the same host obligations in a second idiomatic web host without simulating Next.js APIs.                          | Pending | Tests AH-P6 and whether a host-neutral layer is honest.                              |
| What is delivered to the browser?                               | Compare HTML, hydration, module graph, interactions and failures for direct, profiled and universal compositions.          | Pending | Rejects candidates that preserve surface parity by hiding runtime cost or fragility. |
| Do trust controls behave in adverse states?                     | Exercise consent unresolved/denied/changed, identity expiry, preview, nested failure, reporting outage and script failure. | Pending | Tests the complete excellence contract rather than structural conformance.           |

## Conclusion

- **Outcome and obligations retained:** accessible, secure, consent-aware, observable and recoverable Oak products with correct document and route behaviour.
- **Premises accepted:** none yet; current evidence establishes repeated responsibilities and divergence, not the correct future composition.
- **Premises rejected:** none yet.
- **Essential complexity:** named product profiles, applicable trust obligations, authority and lifecycle for server/browser state, and explicit recovery.
- **Mechanisms removed or combined:** no decision earned. Provider trees, shells and router roots remain challengeable mechanisms.
- **Selected system shape:** unresolved among direct composition, a profiled contract, generation/scaffolding, a request kernel, or another evidenced design.
- **Remaining unknowns:** product intent behind differences, additional consumer requirements, necessary shared client state and whether Next.js is an enduring host decision.
- **Evidence that would reopen the decision:** a new product profile, framework lifecycle change, trust obligation, accessibility finding, significant delivered-runtime evidence or a failure that the selected boundary cannot acknowledge correctly.
