# Ecosystem enablement model

## Status

This is the target-facing synthesis for the deconstruction. The Oak Innovation Kit is the intended framework for enabling additional Oak products and consumers. Its internal capabilities and architecture remain hypotheses until premise-level investigation justifies them.

## Objective

Discover and encode the most conceptually coherent architecture that delivers the complete enduring functionality, educational impact, value and obligations demonstrated by OWA and Oak Components with uncompromising excellence. Every concept, authority and stateful boundary must be necessary, and implementation must use the strongest idiomatic design available.

Reduced maintenance and innovation effort should follow from that coherence. It is not an input constraint, target or trade-off against excellence.

## Relationship to the current systems

OWA and Oak Components are the primary functional and experiential references. They show:

- what Oak products currently make possible;
- accumulated curriculum, product, interaction and operational understanding;
- accessibility, safeguarding, rights, privacy, security and reliability obligations;
- difficult states and exceptions already encountered;
- mechanisms that may represent excellent solutions, historical choices, migrations or workarounds.

They do not prescribe the kit's routes, components, state, packages, providers or deployment topology. Each element must be traced from mechanism to purpose, then preserved, transformed, combined or eliminated according to evidence.

At the pinned [`bd878a3`](https://github.com/oaknational/oak-open-curriculum-ecosystem/tree/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa) revision, OCE already contains a generated curriculum SDK, search and graph capabilities, Result types, design tokens, observability, architectural rules, an MCP product and Curriculum Hub. The [strategy](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/strategy/README.md) names the Oak Innovation Kit as the capability for creating production-standard Oak products. These existing capabilities are candidate ingredients, not axioms; they must undergo the same premise challenge as OWA and Components.

The later [Database-Tools and oak-openapi authority-chain deconstruction](../current-state/database-tools/README.md) follows authored curriculum state through projections, the public API and OCE generation and consumption. Its [multi-lens synthesis](../current-state/database-tools/concept-lenses/synthesis.md) adds evidence about release completeness, relationship identity, transformation loss, policy decisions, command acknowledgement and delivery. Those are candidate refinements to the shared basis, not a requirement to reproduce the current database, Hasura, API, generator or deployment topology.

## Governing question

> What is the most conceptually coherent system that delivers the complete required outcomes with uncompromising demonstrable excellence, in which every concept, authority and stateful boundary is necessary?

The [meta-analysis](./meta-analysis.md) supplies the current combined basis for
testing whether a concept or boundary is necessary. It reconciles the original
53 OWA/Components lenses with the later 59 Database/API/OCE lenses and maps the
chain's candidate kernel to the global primitives with explicit reopening
conditions. It is a vocabulary for premise work, not a preselected architecture.

Conceptual economy is one property of excellence. It means removing unnecessary concepts, authorities and stateful boundaries; it never takes priority over educational effectiveness, human outcomes, design quality, validation or assurance.

## Premise before architecture

Before specifying or building any kit capability:

1. **Observe it fully.** Record literal behaviour, callers, dependencies, state, authority, lifecycle, excellent qualities, failures and known history.
2. **Climb to purpose.** Identify the human, educational or operational outcome, applicable obligations and genuine domain invariants.
3. **State the premise.** Explain why software is needed, why this system should own it, why state or a boundary must exist, and which surrounding assumptions are being held fixed.
4. **Classify the complexity.** Mark it as essential, chosen, accidental, compensating or unknown.
5. **Challenge the surrounding system.** Ask whether a change to policy, service, journey, content, data model, authority or platform could remove the need.
6. **Seek collapse.** Ask whether several routes, stores, services, providers, components or synchronization mechanisms compensate for the same underlying decision and could become one coherent system.
7. **Generate genuinely different alternatives.** Include no-build, remove, absorb, combine, invert, generate, platform-native and redesigned-service options alongside a faithful replacement.
8. **Evaluate excellence.** Compare complete behaviour, conceptual integrity, accessibility, security, privacy, safeguarding, rights, failure semantics, operability, evolvability and idiomatic platform use.
9. **Name invalidators.** State what would show that a premise is false, a collapse only moved complexity, or a simpler alternative lost an essential obligation.
10. **Build only after the decision is ready.** Implementation proves the selected system shape; it does not substitute for premise analysis.

## Capability atlas

OWA, Components and the Database/API/OCE authority chain currently provide evidence for at least these capability areas. The atlas is a research index, not a list of required kit modules:

| Area                                | What must be understood                                                                                          | Premises to challenge                                                                                                      |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Curriculum identity and discovery   | Sequence, variants, canonical identity, pedagogical context, publication and withdrawal                          | Whether browse, search, graph and route taxonomies require separate models or systems                                      |
| Teacher resource use                | Selection, restrictions, editable resources, delivery, recovery and continuation                                 | Whether download, archive generation, CRM gates and separate success routes are necessary at all                           |
| Pupil learning                      | Safe entry, activities, assessment, feedback, media alternatives, progress, review and sharing                   | Whether current routes, stores, projections and persistence boundaries reflect one simpler session model                   |
| Accounts and saved content          | Identity boundary, return, durable collections, reconciliation and retired content                               | Whether an account or replicated client/server state is required for each outcome                                          |
| Classroom and external integrations | Attachment, teacher/pupil context, progress, hand-in and learning evidence                                       | Whether provider identifiers, synchronization and per-question writes should shape the domain model                        |
| Editorial publication               | Authoring, preview, validation, publication, withdrawal and rollback                                             | Whether CMS, application release and content publication need their current coupling                                       |
| Generated artifacts                 | Curriculum plans, workbooks, ZIPs, rights and source versions                                                    | Whether artifacts should be generated, stored, streamed or represented differently                                         |
| Visual and interaction language     | Brand expression, semantic tokens, accessible controls, layout and product patterns                              | Whether a React component library, runtime theme, primitive API or shared recipe is needed                                 |
| Product trust                       | Accessibility, safeguarding, rights, privacy, consent, security, observability and recovery                      | Which obligations belong in universal framework capabilities and which are outcome-specific                                |
| Product creation and integration    | Developer tasks, product-team decisions, APIs, documentation, examples, diagnostics, extension and compatibility | Which responsibilities the kit must own so consumers can build excellent Oak products without reconstructing hidden policy |

Several rows may collapse into one underlying system. One row may require several independently authoritative responsibilities. The investigation must decide; the table must not.

## Framework principles

1. **The kit is deliberate.** It exists to enable additional consumers; consumer count is not a condition for designing framework capabilities.
2. **Reuse follows meaning.** Place responsibility where its semantics, authority, invariants and lifecycle are clearest. Shared and product-local ownership are competing designs, not rules.
3. **Outcomes outrank mechanisms.** Preserve what users, curriculum and operations require, not the incidental shape through which OWA currently provides it.
4. **Change the system when that removes the problem.** Prefer eliminating a cause over creating a cleaner abstraction around its workaround.
5. **Collapse compensating machinery.** Multiple caches, projections, provider trees, wrappers or component variants should survive only if they represent genuinely distinct responsibilities.
6. **One clear authority for each fact.** Derived representations are explicit and reproducible; synchronization is not treated as inevitable.
7. **Use idiomatic foundations.** Prefer the language, web platform, protocol and chosen framework's established strengths before inventing custom infrastructure.
8. **Generate from authority.** Derive schemas, types, fixtures, identifiers and projections where an authoritative source exists; do not manually maintain parallel truth.
9. **Separate external shape from enduring meaning.** Vendor and transport types stop at genuine boundaries when the product or curriculum semantics differ.
10. **Make state and effects explicit.** Identity, authority, transitions, acknowledgement, ordering, idempotency, recovery and terminal user states are part of the design.
11. **Make excellence intrinsic.** Educational effectiveness, product and service design, content and information design, interaction and visual craft, accessibility, trust, engineering quality and framework-consumer experience are built into the framework's concepts and evidence, not added by convention later.
12. **Assurance proves behaviour.** Tools and gates support claims; tool conformance never substitutes for accessible, secure, reliable and correct outcomes.

## Premise and acceptance record

Every investigated element should produce one record before implementation:

- subject and decision affected;
- current behaviour, state, authority, dependencies and history;
- excellence currently delivered;
- outcome, obligation and domain-invariant purpose chain;
- explicit premises, evidence and invalidators for each;
- essential, chosen, accidental, compensating and unknown complexity;
- no-build, remove, combine, absorb, generate, native-platform and redesign alternatives;
- competing whole-system designs and their new failure modes;
- excellence contract and required evidence;
- predictions, invalidators and decisive investigations;
- conclusion: retain, transform, combine, eliminate or remain unknown.

Only then should a retained capability receive its detailed state, interface, accessibility, failure and assurance contract.

## Investigation sequence

1. **Outcome and capability atlas:** complete the mechanism-neutral map of what OWA and Components enable and why it matters.
2. **Purpose and cause map:** connect each mechanism to outcome, obligation, domain invariant, system decision, external constraint and historical workaround.
3. **Cross-system collapse map:** identify mechanisms that share one cause, duplicate one authority or compensate for another system's weakness.
4. **Premise records:** challenge the highest-impact areas, including designs that remove or change the original need.
5. **Competing architectures:** compare whole-system models rather than only local replacements for each current element.
6. **Decisive evidence:** use domain experts, users, standards, incidents, history, runtime observation and controlled experiments to reject weak premises and designs.
7. **Framework implementation:** build the selected capabilities idiomatically inside the Innovation Kit with their excellence contracts intact.
8. **Teaching workspaces:** explain the purpose chain, rejected premises, chosen architecture and evidence that would reopen each decision.

## Decisions not yet earned

- which current capability areas remain distinct in the kit;
- whether curriculum API, browse, search, graph and publication should share one authoritative model or several;
- which user outcomes require identity or durable application state;
- whether web products need a common runtime shell or only explicit obligations;
- whether Oak's visual and interaction language is best expressed through generated CSS, native elements, shared behaviours, framework components or another composition;
- whether generated artifacts, downloads and resource delivery remain separate concepts;
- whether relation, placement, release and transformation contracts remain derived from the candidate basis or require another independently failing primitive;
- how the shared vocabulary should distinguish command intent, execution operation, technical transition result and realised human outcome;
- which existing OCE workspaces express enduring authority and which encode a challengeable system choice;
- which language, framework, storage and delivery mechanisms best fit the architecture after the premises are settled.
