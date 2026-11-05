# Use value of a stable priority queue at three levels

The main point: each level can only support claims that its own kind of evidence can back up. A correct queue does not make a fair scheduler, and a fair scheduler does not make a good service. Since you haven't chosen an application, the top level is still made of hypotheses. The contract should be written so it doesn't quietly assume any of them.

---

## 1. Queue level: the data structure

**Use value:** callers get a predictable order. Items with higher priority come out first. Among items whose priorities compare as equal, the one inserted first comes out first. Without stability, the order of ties depends on how the heap happens to be arranged. That makes behaviour hard to reproduce, test or explain.

**Contract questions to settle first:**

| Question | Options / risks |
|---|---|
| What counts as "equal"? | The comparator returns 0. This must be a total preorder, or stability means nothing. |
| What counts as "inserted first"? | The order of calls on one thread? The linearization order under concurrency? The logical time the caller supplies? |
| Changing an item's priority (update / decrease-key) | Does the item keep its original sequence number or get a new one? Either choice is valid, but it must be stated. |
| Removing an arbitrary item | Is it supported? What does it cost? |
| Sequence counter | 64-bit monotonic. State the overflow behaviour, even if it's "unreachable in practice". |
| Iteration and snapshots | Is ordered iteration guaranteed, or only the order of `pop`? |
| Complexity | For example O(log n) push/pop and O(1) peek. Say whether these are amortized or worst case. |

**Implementation:** the usual approach is a binary or d-ary heap keyed on `(priority, seq)`. The alternative is a bucketed FIFO per priority, which works when the set of priorities is small and discrete.

**Evidence that can establish value here:**
- **Property and model-based tests.** Run random operation sequences against a trivially correct reference, such as a sorted list with (priority, seq) keys. Check that `pop` order matches exactly, not just "some valid order".
- **Stability-specific tests.** Push many items with identical priority and confirm FIFO order. Mix in priority updates and removals and check the stated rule.
- **Concurrency tests, if it's concurrent.** Linearizability checking (Lincheck, Jepsen-style histories, or a loom/TLA+ model).
- **Benchmarks.** Measure against an unstable baseline so the cost of stability is known: memory per item and throughput across n and priority distributions.

**What this level cannot claim:** that the ordering is *good* for anything. It only shows that the ordering is *what the contract says*.

---

## 2. Scheduler level: the components that use the queue

**Use value:** the scheduler's policy becomes easier to reason about and more consistent:
- **Determinism.** The same inputs produce the same dispatch order. This enables replay debugging, reproducible tests and auditability.
- **FIFO fairness within a priority class.** Equal-priority work is served in arrival order, so bounded waiting holds *within* a class.
- **Explainability.** "You waited because N items had higher priority or arrived earlier at the same priority" is a statement you can check.

**Limits to state explicitly:** stability does **not** prevent starvation *across* priority classes. A steady stream of high-priority work still starves low-priority work. Aging, quotas or deadline-based priorities are scheduler policies layered on top. They should not be implied by the queue's contract.

**Implementation:** the scheduler owns how priorities are computed, the aging policy, admission control and preemption. The queue only orders items. Keep that boundary clean. For example, don't put "aging" into the queue unless it's an explicit, separately specified feature.

**Evidence:**
- **Deterministic replay.** Record an arrival trace, replay it, and assert identical dispatch order.
- **Simulation.** Use synthetic workloads (Poisson or bursty arrivals, skewed priority mixes). Measure wait-time distributions per class, the worst-case wait within a class, and starvation incidence with and without aging.
- **Stated invariants checked in tests.** For example, "no item waits behind a later-arriving item of equal or lower priority."
- **Overhead measurement.** Measure scheduling latency and the queue's share of it under realistic load.

**What this level cannot claim:** that the resulting waits are acceptable or fair *to the people or systems being served*. "Fair" here means fair according to the stated policy.

---

## 3. Application level: no human-service application chosen yet

**Possible use value (hypotheses only):** if the queue were used in something like triage, appointment booking, support tickets or benefits processing, stability could support:
- **Procedural fairness.** First come, first served among equals, which people generally find legitimate.
- **Accountability.** Individual outcomes can be reconstructed and explained.
- **Consistency.** Similar cases are treated the same way.

**Why these remain hypotheses:**
- In human services, value depends on **how priority is assigned**: who decides urgency, from which data, and with what biases. It doesn't come from how ties are broken. A perfectly stable queue fed biased priorities produces order that is stable but unjust.
- "Arrival order" can itself be unfair. People with better internet access, fewer working-hour constraints, or knowledge of the system arrive earlier.
- What stakeholders need may be something other than strict ordering: override mechanisms, transparency to the people waiting, appeals, or wait-time guarantees.

**What evidence would need an actual application:**
- Identifying stakeholders and eliciting requirements. What do service users, staff and operators consider fair?
- Validating how priorities are assigned, including disparate-impact analysis across groups.
- Field or pilot evaluation of outcomes: waits, harms, complaints, overrides used.
- Governance review: who can change priorities, how it's logged, and how people contest it.

**What you can do now:** mark the application layer as *out of scope for the component's claims*. Record the hypotheses above as open questions, not as features. Make sure the queue and scheduler **don't block** those future needs. That means hooks for audit logging, an explicit and inspectable priority source, support for overrides that respect the stated sequence-number rule, and replayable traces.

---

## Summary

| Level | Value claim | Implementation | Evidence that can establish it | Status now |
|---|---|---|---|---|
| Queue | Contracted, reproducible order; ties broken by arrival | `(priority, seq)` heap or buckets; explicit update, removal and concurrency semantics | Model-based and property tests, linearizability checks, benchmarks against an unstable baseline | **Can be established** |
| Scheduler | Determinism, FIFO within a class, explainable dispatch | Priority computation, aging and admission, kept separate from the queue | Trace replay, simulation of wait distributions, invariant tests | **Can be established for the stated policy**. Cross-class starvation needs an explicit policy. |
| Application | Procedural fairness, accountability, consistency for people | Priority-assignment process, overrides, audit, transparency | Stakeholder work, disparate-impact analysis, pilot or field evaluation, governance | **Cannot be established yet.** Keep as hypotheses and design so they remain possible. |

**Recommended next step:** write the queue contract first, especially the definition of "equal", the update/re-sequence rule and the concurrency semantics. Then write the scheduler's stated fairness policy as a separate document. Evidence for each can then be scoped to its own claims, and nothing at the lower levels will be mistaken for proof of value to people.
