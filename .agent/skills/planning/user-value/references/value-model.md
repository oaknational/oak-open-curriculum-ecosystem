# Value and relationship model

Use only distinctions that change a decision, test or responsibility. These
are authoring conventions, not a prescribed Government Digital Service (GDS)
data schema.

| Kind | Function | Common category error |
| --- | --- | --- |
| Vision | Desired future and direction | Treating aspiration as observed effect |
| Intended impact | Bounded change for a population and horizon | Treating activity counts as benefit |
| Purpose | Why a provision exists: the difference its owner or consumer intends it to make | Treating an intended purpose as an observed need |
| Use value | As the skill defines it: what a person or consuming system can use a provision to accomplish, under stated conditions, costs and limits | Equating conformance, price or provider efficiency with usefulness |
| Need | Person's goal and reason in context | Restating a requested feature as a need |
| Commitment | Bounded responsibility a provider takes | Promising an outcome beyond its control |
| Capability | What a system, person or part enables a consumer to do | Assuming availability establishes usefulness |
| Implementation | Concrete mechanism or practice realising provision | Treating completion as proof of value |
| Journey | Experience across time, channels and people | Reducing experience to screens or API calls |
| Story | Bounded change enabling a valuable outcome | Treating a broad need as sprint-ready work |
| Acceptance | Observable conditions for a delivery contract | Treating delivery acceptance as causal impact |
| Supporting contract | Local behaviour/meaning and obligations | Assuming locally correct parts compose correctly |
| Guarantee | The offered side of a contract: what a consumer may rely on, under stated conditions | Reading a guarantee as proof that the consumer can make use of it |
| Theory of change | Mechanism, assumptions and alternatives | Reading a causal diagram as evidence |
| Evidence | Observation and method bearing on a claim | Treating repeated citations as independent support |

## Relationships

This table is the one link vocabulary; type every link with it. The link kind
says what a link lets you claim:

- expression: a more specific account of a purpose or obligation;
- realisation: a change or implementation that brings about a declared part of
  a contract or an experience, within stated conditions;
- enablement: a consumer relying on a provision;
- contribution: a proposed causal bridge from use to an outcome;
- evidence: an observation bearing on a claim;
- authority: a specific permission.

Do not infer a contribution from an expression, realisation or enablement link:
traceability makes a claim inspectable, it does not prove it.

| Link | Link kind | Meaning | Required caution |
| --- | --- | --- | --- |
| Stage exposes need | expression | The need arises in this context | Proposed occurrence is not observed prevalence |
| Story addresses need | expression | Change aims to help meet the need | Coverage is not complete satisfaction |
| Story changes stage | realisation | Slice alters part of an experience | Whole-journey completion remains a separate claim |
| Contract enables story | enablement | Supporting guarantee is required | Local proof does not discharge system proof |
| Implementation realises contract | realisation | Mechanism conforms within stated conditions | Conformance does not prove consumer fit |
| Capability enables use | enablement | Provision makes an activity possible | Consumer obligations and composition may prevent actual use |
| Contract refines commitment | expression | More specific obligations express part of a responsibility | Preserve semantic differences and uncovered obligations |
| Commitment responds to need | expression | Service takes bounded responsibility | Identify control, dependency and limit |
| Observation checks acceptance | evidence | Result bears on a stated condition | Name the method and what it cannot establish |
| Outcome contributes to impact | contribution | A causal bridge is proposed | Retain mechanism, alternatives and uncertainty |
| Evidence qualifies claim | evidence | Source supports, challenges or limits it | Retain scope, provenance and dependence |
| Actor may amend/receive/interpret | authority | Specific authority permits an action | A link alone confers no permission |

For a consequential relation record source and target IDs/versions, meaning,
conditions, status, warrant and reopening event. One table may be sufficient.
Do not introduce a graph database or universal machine schema by default.
For non-service uses and cross-level interpretation, consult
[levels and implementation](levels-and-implementation.md). Human needs and
technical consumer requirements can be related without treating them as identical.

## Three independent status dimensions

**Knowledge:** assumption, research-supported finding, contested claim or
superseded claim, with provenance and scope. Use the actual project's terms.

**Delivery:** candidate, ready for a named scope, implemented, accepted or
retired. Acceptance records its method and observed result. A delivered feature
can still address an unvalidated need. A well-evidenced need can remain unmet.

Authority is a third distinction: proposed wording, adopted direction, policy
constraint and operational permission are not confidence levels. A strong
owner direction does not establish how many people experience a need.

## Worked example: rescheduling an appointment

Illustrative, with no participant research claimed:

- Need hypothesis N1: a person unable to attend needs to arrange a suitable
  alternative so they can receive the service.
- Commitment C1: offer an intelligible rescheduling route within the service's
  actual availability and support arrangements.
- Proposed journey J1: discover the conflict, find the route, inspect available
  options, request a change, receive confirmation, attend. Include no suitable
  option, interrupted requests, support and effects on staff scheduling.
- Story S1: as a person with an existing booking, review and confirm one
  available replacement so I know which appointment to attend.
- Acceptance: confirmation names the agreed replacement; an unsuccessful
  change does not silently cancel the original. Specify how the real booking
  boundary and user understanding will be observed before marking S1 ready.
- Enabling contract: reservation and confirmation preserve agreed booking
  semantics. This is not the person's need itself.
- Outcome hypothesis: a usable change route may reduce missed appointments.
  Alternative explanations include availability, reminders and transport.
  Passing S1's acceptance cannot establish that causal effect.

If the owner instead proposes an unfamiliar new form of appointment, record
the offered value and explore whether it helps. Do not manufacture a pre-existing
need, nor suppress the proposition because no request for it exists.

## Source and method boundaries

Primary guidance checked 26 September 2026:

- [Learning about users and their needs](https://www.gov.uk/service-manual/user-research/start-by-learning-user-needs)
  distinguishes research-grounded needs from more specific stories and calls
  for traceability between them.
- [Writing user stories](https://www.gov.uk/service-manual/agile-delivery/writing-user-stories)
  covers actor, activity, goal, acceptance outcomes and smaller work units.
- [Creating an experience map](https://www.gov.uk/service-manual/user-research/creating-an-experience-map)
  covers research-based experience over time and material variation.
- [Solve a whole problem for users](https://www.gov.uk/service-manual/service-standard/point-2-solve-a-whole-problem)
  addresses service boundaries and inter-organisational dependencies.

The relationship vocabulary, status dimensions and readiness convention above
are this skill's synthesis. Do not attribute them to a GDS-mandated ontology.
Applying the method is not a Service Standard assessment or certification.
