**No, not on its own.** Component tests are evidence about components. A claim about workflow reliability "across scales" covers two more things that component tests don't observe: how the parts compose, and how the system behaves as scale changes.

## What component tests do support
- Each unit meets its own contract under the conditions the tests used.
- A failure is more likely to come from integration or scale than from logic inside a unit.
- A necessary condition: if components fail in isolation, the workflow won't be reliable.

## Why that isn't enough for the workflow claim

1. **Composition gaps.** Each component can pass while the connections between them fail. Typical causes are mismatched assumptions about units, encodings, ordering, idempotency, retries, timeouts, partial failure and error propagation. Mocks and stubs encode what the test author assumed the other side does, not what it actually does.

2. **Reliability compounds.** Twenty sequential steps, each 99.5% reliable, give roughly 90% end-to-end (0.995²⁰ ≈ 0.905), and that assumes failures are independent. Correlated failures (shared dependencies, cascades, retry storms) can make it worse.

3. **Scale creates new behaviour.** Some failures only appear at larger scale:
   - contention, lock and queue behaviour, backpressure
   - resource exhaustion (connection pools, memory, file handles)
   - tail latency adding up across fan-out
   - rare edge cases in the data that become frequent at volume
   - timing-dependent races that almost never occur at low concurrency

   Tests at one scale don't tell you how the system behaves at another unless you have separate reasons to believe the behaviour stays the same.

4. **Environment.** Test fixtures rarely match production configuration, network conditions, data distributions or dependency versions.

## What would justify the claim
You need evidence that bridges from components to the whole workflow:
- **Contract and integration tests** at each boundary, checking the real counterparty's behaviour rather than a mock.
- **End-to-end tests** that run the whole workflow, including partial-failure and retry paths.
- **Load and soak tests** at each scale the claim covers, or a reasoned argument for why behaviour stays the same between the tested points.
- **Fault injection or chaos testing** to check that failures stay contained instead of cascading.
- **Production telemetry**: end-to-end success rates, latency distributions and error budgets measured at real scale.

## How to state it honestly with the evidence you have
Something like: "All components pass their unit tests. We have not yet verified end-to-end reliability or behaviour above N." That records what was tested without implying it covers the whole system at every scale.

If you have a specific workflow and test suite in mind, I can go through which boundaries and scale ranges are actually covered and where the gaps are.
