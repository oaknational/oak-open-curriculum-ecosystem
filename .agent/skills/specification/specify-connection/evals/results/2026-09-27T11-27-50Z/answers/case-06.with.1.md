# Connection analysis: classroom tool (B) relying on the search API (A) for first-paint lessons

**Verdict: the connection fails for the intended reliance.** Each contract makes sense on its own, but together they don't. B needs *every* search back within 50 ms. A promises no latency figure and says outright that requests may be queued under load. When B misses its deadline it shows an empty list, which looks exactly like "you have no lessons", so the failure gives teachers the wrong answer instead of an obvious error.

## 1. What each side promises and assumes

| | A (search API, producer) | B (classroom tool, consumer) |
|---|---|---|
| Latency | "Promptly". No number, percentile, load range or point of measurement. | Every search within 50 ms, before first paint. |
| Under load | Requests may be queued. No maximum wait, no timeout signal, no rejection behaviour stated. | Not addressed. It assumes load doesn't matter. |
| Failure behaviour | Not stated. | Shows an empty list. |
| Late results | Not stated. | Not stated. Does the list update when results arrive after paint? |

- **Relation:** B depends on A, with a latency budget.
- **Intended reliance:** teachers see their lessons on first paint, for every teacher, at every page load.
- **Revisions:** none were supplied, so any finding here needs rechecking against actual versions. Also, A can redefine "promptly" without breaking its own contract. That makes any change to A a reason to reopen this analysis.

The blank entries in the table are findings in their own right. They are missing obligations, not things to fill in by guessing.

## 2. Why the promises don't meet the assumptions

- **A's promise doesn't imply B's assumption.** "Promptly" can't be tested, so it can't satisfy a 50 ms requirement. A actually states the opposite condition: it may queue. Their shared operating context includes load, so B's assumption is contradicted.
- **B's assumption can't be met by any networked service.** "Every search within 50 ms" is a universal claim. No API reached over a network can guarantee that for all requests. Even if A promised a p99 figure, B would still fail at the tail. B has to plan for missing its budget.
- **The two sides add to the problem together:**
  - **Failures cluster at the worst time.** Load peaks when lessons start and many teachers open the tool at once. That is when A queues and when the reliance matters most.
  - **The 50 ms budget is shared.** Network round-trip, TLS and client-side rendering all count against it before A's own processing time. School networks often use most of the budget before A is even involved.
  - **Retries make queues longer.** If B retries, or teachers reload after seeing an empty list, more requests join A's queue and waits grow.
  - **Abandoned requests still cost capacity.** When B gives up on a request, A probably still processes it, because nothing in either contract cancels it.

## 3. Cases where both sides behave correctly and the pair still fails

1. **Start of lessons.** 30 classrooms load at 08:55. A queues requests and answers in 250 ms. Every teacher sees "no lessons". **Fails.**
2. **Slow classroom network.** A answers in 15 ms server-side, but the Wi-Fi round-trip is 70 ms. It fails even with no queue at all. **Fails.**
3. **Real zero vs timeout.** A new teacher genuinely has no lessons, and another teacher's search timed out. B shows the same thing for both. Some teachers may then recreate lessons they already have, causing duplicate data. **Fails, and gives a wrong answer.**
4. **Reload loop.** Teachers refresh when they see the empty list. A's queue gets longer and more requests time out. **Fails and gets worse over time.**
5. **Cold start.** After A is deployed, or its cache is cleared, the first requests are slow. **Fails.**
6. **A changes quietly.** A's operators decide "promptly" means under 1 s. That's still within A's contract, so nothing warns B. **Fails without notice.**

The connection doesn't survive any of these.

## 4. Evidence that's missing

| Claim | What would support it |
|---|---|
| A is fast enough at peak | A's latency distribution (p50/p95/p99) under realistic school-day peak load, measured at the client. |
| 50 ms is achievable end to end | Round-trip times measured from representative classroom networks and devices. |
| "First paint" is the right target | The product owner confirming that lessons must appear *on first paint*, rather than within N ms behind a loading indicator. |
| How often failures happen | B's telemetry on timeouts versus real empty results. At the moment the two can't be told apart. |

## 5. What each side needs to fix

These go back to the owner of each contract. I'm not rewriting either contract here.

**A (search API owner):**
- Replace "promptly" with a latency objective that can be measured: a percentile, a latency bound, the load range it applies to, and where it's measured.
- Specify queuing: the maximum time in the queue, an explicit timeout or overload signal (for example 429/503 with `Retry-After`), and the load-shedding policy.
- Say whether abandoned requests are cancelled.
- Commit to notifying consumers when latency behaviour changes.

**B (classroom tool owner):**
- Drop "every search within 50 ms". Choose a percentile target and specify what happens at the tail.
- Give loading, timeout/error and genuinely-empty their own distinct states. A timeout should never show as "no lessons".
- Render results that arrive after first paint.
- Retry with backoff and jitter, never an immediate loop.
- If first-paint visibility really is required, stop depending on a live search for it. Render the lesson list on the server, serve a cached or prefetched copy, and refresh it afterwards.

**The product owner** decides whether "on first paint" is a real requirement or whether "quickly, with a clear loading state" is enough. That decision determines which of B's fixes are needed.

## Status

The intended reliance is **blocked**. It could work under two conditions: A publishes a tested percentile bound, and B stops relying on the live search for first paint or handles misses honestly. Even then, "every teacher, every time, on first paint" can only be met if the lesson list doesn't depend on a live search at load time. After both sides revise their contracts, the next step is checking whether the fixed connection is ready to use.
