# The specification record

The common record every specification answers, the vocabulary its claims use, the coordinates that
locate it, the grammar of a normative statement and the treatment of an unknown. Owned with
`specify`; `specify-connection` and `assess-specification` read these definitions and keep no copies.
Source: the specification framework note (`.agent/research/comprehensive-specification-framework-2026-09-26.md`,
§3 to §5 and Appendix C).

## Vocabulary: the things that stay distinct

| Term | Meaning | Boundary |
| --- | --- | --- |
| Specification | An attributable, versioned account of an intended subject's relevant properties, constraints and permissible variation | May hold unresolved questions and hypotheses; not every statement is a promise |
| Contract | Obligations and permitted reliance at a boundary, under stated conditions | Not necessarily legal; the parties and the authority are named explicitly |
| Requirement | A normative condition imposed by an identified authority for a stated scope | Priority, strength and authority are different properties |
| Model | A selective representation used to explain, predict, design or analyse | Its abstractions and omissions are part of its meaning |
| Schema | Rules for admitted representations and some structural constraints | Validity alone establishes neither truth, permission nor complete behaviour |
| View | A representation selected for a reader or concern | It declares what it omits and which sources own its claims |
| Evidence | An observation, result or argument bearing on a specified claim | Availability, quality, relevance and independence are separate |
| Assurance claim | A bounded assertion that an obligation or outcome is sufficiently supported for a particular reliance | A passing test is narrower than proof; evidence goes stale |
| Decision | An attributable exercise of authority selecting a course or resolving a dispute | Evidence informs a decision; it does not confer authority |
| Hypothesis | A proposition requiring investigation | Precise expression does not make it a guarantee |

Label descriptive observations, hypotheses, design proposals, adopted requirements, implemented
behaviour and assessed conformance separately. A statement can be adopted but unimplemented,
implemented but unverified, or verified under conditions that no longer hold. "Capability" takes a
qualifier: a service capability lets people accomplish something; an engineering capability performs
a bounded computation or representation. People are affected participants with agency, never
components specified for compliance.

## Coordinates, not a hierarchy

Locate a specification by the coordinates that change its interpretation, and only those.

| Coordinate | Examples | What it prevents |
| --- | --- | --- |
| Subject kind | Institution, service, journey, interaction, domain model, interface, software component, algorithm | Treating unlike objects as interchangeable parts |
| Decomposition | Actors and responsibilities; experiences; states and events; data and relations; components; resources; incentives | One breakdown explaining every concern |
| System extent | One operation, a bounded service, an organisation, a multi-organisation ecosystem | Local evidence claimed for a larger system |
| Time | Call duration, session, repeated use, learning horizon, years of maintenance | Immediate completion confused with lasting effect |
| Population and distribution | One case, a subgroup, the intended population, excluded people | Population benefit inferred from selected successes |
| Authority | Definition, authorship, operation, access, amendment, dispute resolution, risk acceptance | An "owner" field read as universal authority |
| Knowledge status | Proposed, observed, inferred, normatively required, contradicted, unresolved | Uncertainty turned into commitment silently |
| Representation and formality | Narrative, structured record, schema, executable predicate, mathematical model | Machine-readable equated with complete or correct |

Altitude (public purpose, whole service, journey, interaction, domain or interface, engineering
detail) is navigation, not an authority order. For a consequential claim distinguish five scales:
where evidence was observed, where the mechanism operates, where an intervention acts, where its
consequences occur and where monitoring looks.

## The common record

Every specification gives a recoverable answer to each group. A short comment, an existing source
or a link can supply it; eight separate documents are never required, and a tiny pure function can
satisfy the whole record in a dozen lines. Inherited context is inherited by a named reference,
visibly, with conflicts resolvable; a large service context is never copied into every dependency.

| Field group | Minimum content |
| --- | --- |
| Identity and status | Stable identifier, revision, subject kind, proposal or adoption status, canonical location |
| Purpose and consumers | Useful local purpose; consumers and materially affected parties; the reason for this boundary |
| Scope and context | Included and excluded behaviour, environment, applicability, relevant time and population bounds |
| Claims and obligations | Meaning, required, permitted and prohibited behaviour, observables and allowed variation |
| Conditions and unknowns | Assumptions, preconditions, dependencies, limits, open questions and the consequences of being wrong |
| Authority | Who defines, implements, operates, changes and resolves disputes; further powers only where relevant |
| Evidence and acceptance | What supports each consequential claim: method, scope, result and missing evidence; the acceptance decision |
| Change and failure | Failure response, correction, compatibility, revision triggers and retirement responsibility |

## The grammar of a normative statement

> Under **conditions**, the **responsible actor or system** must or must not **perform an observable
> behaviour or preserve a property**, within **stated bounds**, with **defined failure and recovery
> behaviour**. Evidence is supplied by **method** for **this scope**.

Where a concern does not fit a deterministic predicate (accessibility, experience), specify the
intended activity, the relevant people and conditions, the method of investigation, the judgement
criteria and the treatment of disagreement. "The user is satisfied" is not an obligation because it
appears in a checklist.

## The three treatments of an unknown

An unknown has exactly one explicit treatment: it blocks the affected reliance; it permits a bounded
investigation with a safe boundary; or it is accepted as a named residual uncertainty within
someone's actual authority. A blank field is not a permission. Nor is every unknown a reason to block
unrelated work.

## A compact starter

A prompt, not a compulsory format. Replace inherited context with links to its authoritative home;
merge or omit a field that adds no distinction for the case; add a distinction that could change
permitted reliance even when the starter lacks it. A completed instance reads without the
conversation that produced it.

```text
ID / revision / subject / status:
Purpose, consumers and affected parties:
Boundary and relevant operating context:

Claims:
  - Kind: obligation | hypothesis | observation | design choice
    Statement, conditions and allowed variation:
    Authority and responsible party:
    Failure / uncertainty / recovery:
    Evidence method, current result and scope:

Applicable profiles and material additional detail:
Connections and obligations at their seams:
Unknowns and their consequence for this intended use:
Compatibility, correction and revision triggers:
Readiness for the named use, reviewer and limitations:
```
