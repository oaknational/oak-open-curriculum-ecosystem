**No, not on its own.** Component tests show that each part behaves as specified under the conditions tested. A claim about workflow reliability across scales is a different claim. Getting from one to the other needs a bridging argument, and that argument needs its own evidence.

## Why the inference fails

1. **Composition isn't guaranteed.** Each component can pass its tests while the connections between them fail. Typical causes:
   - One side assumes something the other doesn't guarantee (ordering, idempotence, units, what null means).
   - Errors pass silently from one step to the next.
   - Retries interact badly, for example a retry storm, or duplicate side effects from actions that aren't idempotent.
   - Timeouts are set inconsistently along a call chain.

2. **Scale creates new behaviour.** Contention, queueing, backpressure, resource exhaustion, tail latency and partial failure often only show up at volume or under concurrency. A test at n=1 says little about n=10⁴.

3. **Reliability multiplies across steps.** Ten steps that are each 99% reliable give roughly 90% end to end, if failures are independent. Correlated failures, like a shared dependency or shared config, can make it worse. Component pass rates don't give you the joint distribution.

4. **The test conditions may not match production.** Mocks, fixtures and small datasets stand in for the real environment. The claim only holds where those stand-ins behave like production.

5. **"Across scales" is a claim about a range.** Evidence from one point, or a few, only covers other scales if you have a model of how behaviour changes with scale. That could be a known complexity bound, measured linearity, or no shared contended resources. Without such a model, you're extrapolating.

## What would justify the claim

- **Contracts at each connection:** each consumer's assumptions are checked against what its provider actually guarantees, including how failures behave.
- **End-to-end or integration tests** of the full workflow, including the failure paths.
- **Evidence at several scales:** load, soak and concurrency tests at the scales you're claiming, plus a stated reason for trusting interpolation between them.
- **Fault injection:** see how the workflow responds when a component degrades.
- **Production data**, if available: SLO data or error budgets from real traffic.

## What component evidence does support

Component tests are necessary, and they're a good foundation. They support a narrower, honest claim: "Each component meets its specification under the tested conditions." You can present that as a precondition for workflow reliability. It isn't evidence that the workflow is reliable.

If you have a specific claim and test suite in mind, share them. I can point out which parts of the claim the current evidence covers and where the gaps are.
