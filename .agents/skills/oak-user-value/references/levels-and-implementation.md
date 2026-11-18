# Use value across levels

Use value is defined once, in the skill: what a person or consuming system can
use a provision to accomplish, under stated conditions, costs and limits.
Identify the consumer, purpose, provision, conditions, burdens and evidence.
Price, exchange value, popularity, delivery effort and conformance can matter
without establishing usefulness.

## Select views that answer the actual question

| View | Question | Possible expression | Appropriate evidence |
| --- | --- | --- | --- |
| Purpose and impact | What worthwhile difference, for whom and over what horizon? | Vision, outcome hypothesis, value proposition | Affected-party accounts, outcome and distributional evidence; causal methods when claiming attribution |
| Use and experience | What can someone accomplish in their circumstances? | Need, journey, usage scenario, task | Research, observation, actual use and failure paths |
| Capability and provision | What does this system or part enable its consumers to do? | Capability statement, use case, offered guarantee | Consumer fit, integration observations, operational evidence |
| Contract and responsibility | What may each party rely on, under what conditions? | Behavioural, semantic or operational contract | Contract tests, formal reasoning where suitable, boundary checks |
| Implementation and change | What realises or changes that provision? | Algorithm, component, workflow, story, enabling task | Implementation verification and acceptance against the declared scope |

These are selectable views, not fixed levels of a universal hierarchy. A
capability can be implemented by people, software or both; one component may
serve several products, and one journey may cross organisations. Technical
granularity, organisational reach, time horizon and population scope are
different dimensions. A primitive is not simply a smaller public service.

## Work in both directions

From purpose downward, ask what provision could make the intended use possible,
which guarantees it requires, and what implements them. Keep alternative means
open. From an existing part upward, identify its actual or proposed consumers,
their use conditions, and the larger capability it may enable. Unknown
downstream use is an explicit limit, not a reason to invent a consumer. A
consuming system is a role, not a person; the people its use affects still
count.

Type each connection with the relationship table in
[the value model](value-model.md); its link-kind column says what the link lets
you claim.

## Worked example: a stable priority queue

Illustrative proposed use, not an observed deployment:

- A scheduling component needs to take pending work by priority while keeping
  insertion order among equally prioritised items. The scheduler is the direct
  consumer; no fictional resident or learner persona is needed.
- The queue's use value is predictable selection under those ordering rules.
  Its contract specifies ties, empty behaviour, invalid input and any required
  resource bounds. Requirements must come from actual intended use.
- A binary heap plus an insertion-order mechanism could realise that contract.
  Local tests can check ordering and invariants; an integration observation
  checks whether the scheduler's consumption matches the queue's guarantee.
- The scheduler might still starve low-priority work. Stable tie ordering does
  not establish workload fairness, timely completion or equitable access.
- A human-service journey is useful only if the larger application and affected
  people are known and relevant to the decision. Passing queue tests supplies
  no evidence about their experience or population outcomes.

## Composition and conflict

At each important seam, ask whether a consumer can actually use the guarantee,
whether its obligations are feasible, and whether another part invalidates it.
Observe the seam at its own scope instead of assuming proofs add up. Reliability,
maintainability, interoperability and optionality can have use value when tied
to a consumer's purpose and evidence; do not demand an immediate revenue metric.

Keep conflicts visible: a provider's reduced workload may impose more work on
users; a fast component may consume resources another part needs. No single
aggregate score resolves rights, authority or competing purposes.
