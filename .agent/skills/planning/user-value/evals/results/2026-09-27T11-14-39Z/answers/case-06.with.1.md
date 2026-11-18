I used the use-value method from the `oak-user-value` skill. The working directory is empty, so this starts from scratch rather than revising an existing backlog. Nothing below is observed use. It is a structured proposal with its claims kept within what each kind of evidence can support.

## 1. Where things stand

| | Status |
|---|---|
| **Direct consumer** | A scheduling component. It's a role, not a person, and no specific scheduler has been named yet. |
| **Owner's purpose** | Offer a reusable stable priority queue. This is a proposal, not an adopted direction. |
| **Need evidence** | None yet. "Schedulers need stable ordering" is an assumption. |
| **Application** | Not chosen. Anything said about downstream value is a hypothesis. |
| **Contract** | Unsettled. See the open questions in §3. |

**Key point:** each level can only support claims at its own level. Passing queue tests say nothing about whether a scheduler behaves well. A scheduler that behaves well says nothing about whether people or systems downstream are better off.

## 2. Use value at each level

### Level A: the queue (component contract)

- **Consumer:** the scheduler code and the developers who build it.
- **Use value:** predictable selection. The scheduler gets the highest-priority item first, and equal-priority items come out in insertion order. It doesn't have to invent its own tie-breaking or reason about arbitrary reordering.
- **Why stability might matter (all hypotheses):**
  - The same inputs produce the same dispatch order, which helps debugging, replay and tests.
  - Equal-priority work is served first-come-first-served, as people usually expect.
  - It is required in some settings, such as deterministic discrete-event simulation.
- **Costs:** a sequence number stored per item; a sequence counter that must not overflow or be shared carelessly; merging queues while keeping stability requires a global sequence; some heap optimisations are ruled out.
- **Honest alternative:** a standard-library heap keyed on `(priority, sequence)` does the same job in a few lines. A reusable component is only worth building if it adds value beyond that: a documented contract, handling of edge cases like cancellation or reprioritisation, and being tested once and reused. That has to be shown, not assumed.

### Level B: the scheduler (where the queue is used)

- **Consumer:** the scheduler relies on the queue. The scheduler's own consumers (job submitters, operators, downstream services) rely on the scheduler.
- **Use value to the scheduler:** it can dispatch according to its declared policy, and its decisions can be reproduced and explained. "Job X ran before Y because it had higher priority, or equal priority and arrived first."
- **What the queue does *not* give the scheduler:** no starvation-freedom, deadlines, fairness across tenants, throughput or latency bounds. Strict priority with stable ties can still starve low-priority work indefinitely.
- **Pressure back on the queue's contract:** if the scheduler needs aging, cancellation or reprioritisation, the queue must support them (for example remove-by-handle or changing an item's priority). Then someone must decide what "stable" means when an item's priority changes: does it keep its original sequence number or get a new one? The scheduler's real needs should settle this, not guesswork.
- **Scheduler's obligations at the seam:** assign priorities correctly, never change a key in place, respect whatever thread-safety rule the queue sets, and handle an empty queue.

### Level C: possible applications (unchosen)

These are candidates only, each with a different reason stability might matter:

| Candidate | Why stability might matter | What would really decide the value |
|---|---|---|
| CI/build or background job runner | Reproducible order, FIFO among peers | Throughput, queue wait, operator trust |
| Discrete-event simulation | Determinism of events at the same timestamp | Reproducibility of results |
| Message or request processing | Ordering expectations within a priority class | Latency by class, starvation |
| Human-service queue (appointments, triage, casework) | Seen as "first come, first served" among equals | People's access, waiting and outcomes. Priority assignment and capacity dominate these. |

**Human services:** because none is chosen, I have not invented a persona or journey. If one is chosen, stable ordering turns into a policy question, since tie-breaking by arrival order is a fairness choice with rights implications. The hard questions move to who assigns priority, how, and who bears the waiting. Passing queue tests supply no evidence about those people's experience or outcomes.

## 3. Contract questions to settle from real scheduler needs

1. **Priority order:** min-first or max-first? What type of key, and must it be totally ordered? How are keys that can't be ordered (e.g. NaN) rejected?
2. **What stability means:** FIFO among equal keys, measured by insertion sequence. Does that hold across `remove` and reinsertion, and across priority changes?
3. **Operations:** push, pop, peek, len, and possibly remove-by-handle, change-priority, bulk load, and the order and snapshot behaviour of iteration.
4. **Empty queue:** raise an error, return an option type, or block?
5. **Resource bounds:** O(log n) push and pop? Memory per item? Capacity limits?
6. **Concurrency:** single-threaded only, externally locked, or thread-safe?
7. **Determinism scope:** within one process run, or across serialisation and restart too (which means persisting the sequence counter)?

## 4. What implementation and evidence can establish at each level

| Level | Candidate implementation | Evidence | What it **can** establish | What it **cannot** establish |
|---|---|---|---|---|
| A. Queue | Binary heap keyed on `(priority, seq)`. Monotonic counter. Handles for removal and reprioritisation if needed. | Unit tests for ties, empty queue and invalid keys; property-based tests against a reference model (a stable-sorted list); heap invariant checks; complexity benchmarks; optionally a formal proof of the ordering invariant | The implementation conforms to the contract under stated conditions | That any scheduler can use it correctly, or should |
| A→B seam | Adapter or direct use in a named scheduler | Integration tests at the seam; checks that the scheduler meets its obligations (no in-place key changes, locking) | The scheduler actually consumes the guarantee as intended | That the scheduler's policy is good |
| B. Scheduler | Priority policy, plus aging or quotas if needed | Determinism test (same inputs give the same dispatch trace); trace replay; simulated workloads measuring worst-case wait and starvation; load tests | The policy behaves as declared on the workloads tested | Value to the application, or performance on untested workloads |
| C. Application | Not chosen | Operational metrics, operator or user research, and, for any outcome claim, a proper evaluation design | Only once named: whether use of the system gives its consumers or affected people a useful difference | Anything, at present |

The chain of claims stays separate at every step: conformance, then usable by the scheduler, then the scheduler behaves as declared, then the application is useful, then there's a measured outcome, then that outcome is caused by the system.

## 5. Traceability (typed links)

- `Q-impl` **realises** `Q-contract` (conformance only).
- `Q-contract` **enables** `Sched-dispatch` (the scheduler relies on the guarantee). This is conditional on the scheduler meeting its obligations.
- `Sched-policy` **enables** `App-use`: unknown, since there is no named application.
- `App-use` **contributes to** an outcome: not proposed. Any such link would need its own mechanism, alternatives and evidence.
- **Uncovered:** a real scheduler's actual requirements, and whether anything is needed beyond the standard-library recipe.

## 6. Candidate delivery slices

1. **Enabling (research):** find one or two real or planned schedulers and record which of the §3 questions they actually need answered. This is ready now.
2. **Component slice:** the core stable queue (push, pop, peek, clear empty-queue behaviour, rejection of keys that can't be ordered). Acceptance: property tests match the stable-sort reference, and the documented complexity holds. Only ready once item 1 confirms the scope.
3. **Conditional slice:** remove and reprioritise with defined stability semantics, only if a scheduler's cancellation or aging needs require it.
4. **Seam slice:** integrate with the named scheduler, with a determinism test and starvation simulation. Report the starvation results as scheduler findings, not queue defects.

## 7. Review and limits

- **Consumer view:** a scheduler author may not want a new dependency if the recipe is enough. The component has to beat that on contract clarity or features.
- **Provider view:** reprioritisation and persistence could greatly widen the contract. Include them only when a consumer needs them.
- **Delivery view:** slice 2 is not ready until slice 1 names a consumer.
- **Limitations:** this model was produced and reviewed by me in a single pass, with no independent challenge. It contains no user or consumer research. Nothing is observed.
- **When to revisit:** when a real scheduler consumer is named, when an application (especially a human service) is chosen, when concurrency or persistence becomes a requirement, or when anyone claims a benefit at the application level.

**Suggested next step:** name a first consuming scheduler and answer the §3 questions from its needs. That turns the contract from speculative to grounded and makes slice 2 ready. I can write this up as a design doc in the repo if you'd like.
