# Research charter

## Mission

Enable [Oak Open Curriculum Ecosystem](https://github.com/oaknational/oak-open-curriculum-ecosystem), through the Oak Innovation Kit, to create new Oak products whose functionality, impact, value, software engineering and design meet or exceed the excellence demonstrated by OWA and Oak Components.

The work must preserve the intent, impact and hard-won product, curriculum, design, accessibility and operational understanding behind Oak while remaining free to reject accidental structure, historical constraints, compensating mechanisms and obsolete technology choices. Software engineering, product design, accessibility, security, privacy and operability are design inputs and enforced constraints, not later hardening phases.

This is not an OWA or Oak Components repair or migration programme. Those systems show what Oak has learned to make possible: outcomes, interactions, domain rules, difficult cases, quality obligations and operational behaviour. They are neither templates nor mere benchmarks. Every element must be understood, its premise challenged, and its enduring need preserved, transformed, combined or eliminated before an OCE equivalent is designed.

Reduced innovation and maintenance effort is an expected consequence of coherent, simple and excellent design. It is not a competing objective, constraint, deadline, budget or reason to compromise excellence.

## System roles

| System                        | Role in this research                                                                                                                                                       |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OWA                           | Primary functional and experiential reference: what Oak currently enables, why it matters, the difficult cases encountered and the mechanisms that accumulated around them. |
| Oak Components                | Primary reference for Oak visual language, accessible interaction, reusable UI semantics, product recipes and the consequences of its current boundaries.                   |
| Oak Open Curriculum Ecosystem | Greenfield substrate in which every existing SDK, search, graph, design and engineering capability remains open to premise-level challenge.                                 |
| Oak Innovation Kit            | The deliberate framework, tools and knowledge that will enable additional teams and products to build excellent Oak experiences.                                            |

## Working definition

An Oak product is not defined by a framework, repository layout, component package or similarity to OWA. The working definition is a system that delivers one or more Oak educational outcomes while meeting the relevant curriculum, accessibility, safeguarding, rights, identity, privacy, consent, security, operational and brand contracts.

The Innovation Kit is also a product for developers, product teams, partners and ecosystem integrators. Their ability to understand the framework, make correct decisions, build complete experiences and verify excellence without reconstructing hidden policy is a first-class outcome.

This definition is deliberately provisional. User research, service strategy or evidence from adjacent Oak products may invalidate it.

## Governing decisions

These are research policy, not architecture hypotheses:

1. **Excellence is the sole governing priority.** Educational, product, design, engineering and framework-consumer quality are not traded against an invented delivery or economic constraint.
2. **The kit is deliberate.** The Oak Innovation Kit is intentionally a framework for additional consumers; existing consumer count is not a prerequisite for framework ownership.
3. **Premise challenge precedes architecture.** Every proposed capability and boundary must be derived from evidenced outcomes and obligations after the surrounding system and no-build, removal and collapse alternatives have been examined.
4. **OWA and Oak Components are primary references.** Their accumulated excellence and understanding must be recovered, while their mechanisms remain open to rejection.
5. **Boundaries follow meaning.** Semantic authority, invariants, isolation, lifecycle and assurance determine placement; product-local, shared-package and extraction doctrines do not.

Hypotheses may test how effectively these decisions can be encoded, what architecture results, and where a proposed universal capability fails. They do not retest whether excellence or premise-first reasoning matter.

## Research questions

1. What does OWA or Oak Components make possible, for whom, and what evidence shows that it is needed?
2. Which outcomes, educational value, domain concepts and quality obligations make a product recognisably Oak?
3. Why does each current element exist, and is its premise still valid?
4. Is its complexity essential, chosen, accidental, compensating or still unknown?
5. Could a change to policy, content, interaction, data, authority or the surrounding system remove the need entirely?
6. Could several current systems or abstractions be replaced by one simpler and more coherent model?
7. Can a language, web-platform, protocol or framework idiom provide the capability without custom machinery?
8. Which responsibilities require distinct authority, isolation or lifecycle, and which current boundaries should disappear?
9. Which OCE capabilities already express the right idea, and which reproduce a premise that should be challenged?
10. How can the resulting framework make excellent product and engineering practice intrinsic, executable and teachable?

## Evidence language

Every material claim should use one of these labels.

| Label          | Meaning                                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------------------- |
| **Observed**   | Directly supported by pinned source, runtime output, measured data or a recorded stakeholder statement. |
| **Inferred**   | The best current explanation of observations, with the reasoning made explicit.                         |
| **Unknown**    | Important information that the available evidence cannot establish.                                     |
| **Hypothesis** | A falsifiable claim about cause, design or likely improvement.                                          |

Words such as legacy, simple, scalable, clean and better are not evidence. When used, they must name the comparison and measure.

Framework and language conventions are evidence about implementation technique, not proof that an Oak requirement, capability or boundary exists. Need must be established from educational, user, service, domain, trust or operational evidence before idiomatic implementation is selected.

## Source snapshot

The research is currently pinned to:

| Source                        | Revision or evidence state                                                                                                                               | Recorded                                 |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Oak Web Application           | [`510ac63a62fb37a70183b00ce0f5fb15be4491e5`](https://github.com/oaknational/Oak-Web-Application/tree/510ac63a62fb37a70183b00ce0f5fb15be4491e5)           | 2026-07-19                               |
| Oak Components                | [`8ff8264fa921e4e40fdaf9a99b02fd156c699cc8`](https://github.com/oaknational/oak-components/tree/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8)                | 2026-07-19                               |
| Oak Open Curriculum Ecosystem | [`bd878a3a550c8e5e5d21163a6d0962cebdaf43fa`](https://github.com/oaknational/oak-open-curriculum-ecosystem/tree/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa) | 2026-07-19                               |
| Database-Tools                | `3d1eff31a398189a839ae68bcf69990089c31bd2`                | 2026-07-19                               |
| oak-openapi                   | `2fb1383bfeaeb4986ec29cef97be133b69baeef5`                   | 2026-07-19                               |
| Live OWA                      | [www.thenational.academy](https://www.thenational.academy/), mutable and not archived                                                                    | Not used as pinned evidence in this pass |
| Live component catalogue      | [components.thenational.academy](https://components.thenational.academy/), mutable and not archived                                                      | Not used as pinned evidence in this pass |

Static source can establish structure and encoded behavior. It cannot establish production traffic, user value, team ownership, live feature-flag state, incident frequency or whether migration residue is still required. Any later live observation must record a timestamp and durable capture before it is used as reproducible evidence.

## Investigation loop

1. State the user or operational outcome under investigation.
2. Record the observable contract before describing its implementation.
3. Trace the current mechanism across route, UI, state, data and operations.
4. Climb from mechanism to purpose, identifying the outcome, obligations, domain invariants and excellence worth preserving.
5. State the premises that make software, state, ownership and each boundary appear necessary, including assumptions that hold the surrounding system fixed.
6. Classify the complexity as essential, chosen, accidental, compensating or unknown.
7. Challenge the surrounding policy, service, interaction, data model, authority and platform; ask which responsibilities can disappear or which systems can collapse.
8. Generate genuinely different whole-system alternatives, including preserve, remove, absorb, combine, invert, generate, platform-native and redesigned-service designs.
9. Separate observations from interpretations and form competing hypotheses.
10. Name evidence that would invalidate each premise, hypothesis and proposed collapse.
11. Run the most decisive investigation that can discriminate between them.
12. Record the result, including negative and ambiguous results.
13. Make a decision only when the evidence is sufficient for its blast radius.

## Hypothesis requirements

Every architecture hypothesis must include:

- a stable ID and lifecycle status;
- one precise claim;
- the observations that make it plausible;
- predictions that should be visible if it is true;
- invalidators or material weakening evidence;
- the most direct discriminating investigation;
- the decision that the result would affect;
- a dated evidence history.

Invalidators are not risks or implementation difficulties. They are observations that would make the claim false, less useful, or wrongly scoped.

## What this work will not do

- Use code volume, novelty or framework fashion as a proxy for quality.
- Fix, replatform, incrementally migrate or seek architectural consistency inside OWA or Oak Components.
- Treat OWA's routes, components, state, providers, packages or deployment topology as requirements for OCE.
- Treat an existing OWA, Components or OCE boundary as evidence that the same boundary should exist in the kit.
- Call a migration boundary an architectural defect without checking its history and destination.
- Reproduce OWA feature-for-feature before understanding which outcomes and impact matter.
- Move code into packages merely to make a diagram look layered.
- Apply a product-local, shared-package, second-consumer or extraction rule in place of reasoning about semantics, authority and lifecycle.
- Optimise for an invented delivery, cost, package-count or performance target.
- Preserve a workaround without first challenging the problem and surrounding decision that made it necessary.
- Discard accessibility, curriculum integrity, safeguarding, rights, privacy, analytics or operational behaviour as incidental.
- Use a demonstration as proof without comparing its outcomes, failure behaviour and quality with the current reference.

## Governing excellence model

Every retained capability and every Innovation Kit contract must address the applicable dimensions. Applicability must be evidenced; omission must be explained.

| Dimension                            | Required concern                                                                                                                                                                                          |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Educational effectiveness and impact | Demonstrated need, pedagogical intent, curriculum fidelity, intended learner or teacher outcome, harmful displacement and evidence that the outcome is achieved.                                          |
| Product and service design           | Complete user journeys, task success, understandable choices, continuity, inclusive service policy, adverse states, recovery and appropriate human judgement.                                             |
| Content and information design       | Comprehensible language, information architecture, provenance, attribution, rights, versioning and content integrity across channels and artifacts.                                                       |
| Interaction and visual design        | Semantic interaction, accessibility, responsive and assistive-technology behaviour, perceptual clarity, coherent Oak expression and high-quality visual craft.                                            |
| Trust and safety                     | Safeguarding, privacy, consent, identity, authorization, security, abuse resistance and explicit accountability.                                                                                          |
| Software engineering                 | Correctness, explicit state and effects, deterministic and reproducible behaviour where applicable, testability, diagnostic clarity, reliability, operability, evolvability and idiomatic implementation. |
| Framework-consumer experience        | Coherent APIs, accurate types and errors, documentation, examples, diagnostics, compatibility, migration paths and tooling that help teams build correctly without hidden knowledge.                      |
| Evidence quality                     | Direct outcome and impact evidence, automated and human evaluation, representative normal and adverse states, reproducible methods and clear limits.                                                      |

Conformance to a tool, pattern or internal framework rule is never sufficient evidence of excellence. The actual educational, human and system behaviour must be demonstrated.

## Success

The deconstruction succeeds when the Innovation Kit can demonstrate:

1. **Necessary capability:** the enduring functionality, educational impact, value and difficult cases evidenced by OWA and Oak Components are understood and can be delivered where they remain valid.
2. **Premise integrity:** every framework capability can explain why it is needed, which surrounding assumptions were challenged, which alternatives were rejected and what evidence would reopen the decision.
3. **Uncompromising excellence:** every applicable dimension in the governing excellence model is intrinsic and demonstrable for both product users and framework consumers.
4. **Architectural simplicity:** the system contains the fewest necessary concepts, authorities and stateful boundaries while expressing the complete contract. Simplicity never means omitting validation or difficult behaviour.
5. **Idiomatic implementation:** language, platform, protocol and framework capabilities are used according to their strongest established patterns, with custom machinery only where the domain genuinely requires it.

A team must be able to explain why every part and boundary exists and what evidence would cause it to be removed, combined or changed. Any reduction in innovation and maintenance effort follows from this excellence and is observed afterwards, not imposed beforehand.
