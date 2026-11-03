# Seam analysis: classroom tool (B) depends on search API (A)

**Short answer:** As written, the connection doesn't work. Nothing A promises gives B the 50 ms it assumes. When the two disagree, B shows an empty list, which to a teacher looks like "you have no lessons". So the seam fails quietly and in a misleading way. Each contract is sound by itself. The problem only appears when they're joined.

## 1. Endpoints and relation

| | |
|---|---|
| **Relation** | B *depends on* A (a runtime call on the page's critical rendering path) |
| **Producer** | A, the search API. Revision: **not supplied** (finding) |
| **Consumer** | B, the classroom tool. Revision: **not supplied** (finding) |
| **Intended reliance** | Teachers see their lessons on first paint, every page load, including peak class-start times |
| **Entry question** | Do A's guarantees imply B's assumption in the shared operating context? |
| **Stopping condition** | The reliance is supported, blocked by a named finding, or bounded by a named unknown |

## 2. Obligations as each record states them

| | A supplies | B assumes / requires |
|---|---|---|
| Latency | "Promptly", with no figure, percentile, measurement point or load envelope | **Every** search returns in ≤ 50 ms, before first paint |
| Load behaviour | Requests **may be queued**, with no stated maximum wait or queue limit | None stated |
| Failure behaviour | None stated: no timeout, no fast-reject, no overload signal | If the result is late, show an empty list |
| Late results | Not stated | **Silent**: does the list fill in when the result arrives after 50 ms? |
| Cancellation | Not stated | **Silent**: is the request abandoned or left running? |

Each silence above is a finding in its own right. I haven't guessed what "promptly" means. Only A's owner can turn it into a number.

## 3. Composition test

- **Implication fails.** "Promptly" doesn't entail ≤ 50 ms. The queueing clause goes further: it explicitly allows waits with no upper limit. A can meet its own contract and still break B's assumption.
- **B's assumption can't be met.** "Every search within 50 ms" is a 100% requirement on a networked call. No real service guarantees that: packet loss, GC pauses and cold caches all produce tail latency. So B's correctness rests on its failure path, and that path is the harmful part (§4).
- **Reachability is doubtful.** The 50 ms has to cover DNS, TLS, the round trip from a school network and client-side rendering, not just A's server time. B doesn't say where the 50 ms is measured. The browser decides when first paint happens, not B, so "before first paint" may leave even less than 50 ms. I can't confirm this without measurements, but it's unlikely to hold on school Wi-Fi.
- **The composition creates new behaviour:**
  - **Correlated load.** Class-start times are synchronised, so many teachers open B in the same minute. That peak is exactly when A says it will queue. The failure clusters: many classrooms get empty lists at once.
  - **Retry amplification.** An empty list prompts teachers to refresh. Each refresh adds load, which lengthens the queue, which produces more empty lists.
  - **Wasted capacity.** If B doesn't cancel requests after 50 ms, abandoned requests still take up A's queue. Other consumers of A are affected too.
  - **Partial failure looks like success.** Nothing tells B, A or the teacher that a failure happened.

## 4. Meaning and failure

- **The main semantic hazard:** B's empty list means "not loaded in time" but reads as "you have no lessons". A delay becomes a false statement to the user. A teacher could reasonably conclude their lessons were deleted or never assigned, and act on that.
- **Recovery:** neither side defines any. If B never re-renders late results, the teacher's only recovery is a manual refresh, which feeds the retry loop above.
- **Triggers that reopen this seam:** a new revision of either endpoint; A adding a latency or queueing commitment; B changing its render strategy (server-side rendering, cache, prefetch); a change in the deployment network; a change to the reliance (e.g. "within 1 s" instead of "on first paint").

## 5. Counterexamples (both sides valid, the pair fails)

| # | Case | Outcome |
|---|---|---|
| 1 | 08:59, 400 teachers load B. A queues, responds in 300 ms, which is still "prompt" | Mass empty lists. **Fails** |
| 2 | No load, A responds in 20 ms, but a school's round trip is 60 ms | Empty list with A idle. **Fails** |
| 3 | Result arrives at 55 ms and B doesn't re-render | Teacher sees "no lessons" permanently. **Fails** |
| 4 | Teachers refresh after case 1 | Queue grows and the failure lasts longer. **Fails, and gets worse** |
| 5 | Warm cache, fast on-site network, low load | Works. This is the only case that survives, and neither contract guarantees it |

## 6. Findings to return

**Compatibility status: fails.** A's contract doesn't support the intended reliance, and B's "every search" assumption can't be satisfied by any networked provider. It could hold only under conditions neither record states (see the obligations below).

**Missing evidence and the claim each would support:**
- A's latency distribution (p50/p99/p99.9) under realistic load, including class-start peaks. This would support any numeric latency claim.
- A's maximum queue depth and wait time. This would support any upper bound at all.
- End-to-end timings from real school networks, and where B measures its 50 ms. This would show whether the budget can be reached.
- How often B shows an empty list today, split into "timed out" and "genuinely empty". This would show the real frequency of false "no lessons".

**Obligations returned to their owners** (for `specify`; I haven't rewritten either endpoint's authority):

- **To A's owner:**
  - Replace "promptly" with a figure: a percentile, a load envelope and a measurement point.
  - State a maximum queue wait, or choose to fail fast instead of queueing past a stated limit.
  - Define an overload signal that consumers can detect.
  - Alternatively, declare that A is unsuitable for render-blocking use.
- **To B's owner:**
  - Make "not yet loaded" and "failed" visibly different from "no lessons". This one is needed whatever A does.
  - Render results that arrive late.
  - Cancel abandoned requests.
  - Limit or back off refreshes.
  - Replace "every search within 50 ms" with a requirement that tolerates a latency distribution.
  - Rethink the first-paint dependency, e.g. server-side rendering, a cached last-known list, or prefetching.
- **To the product owner of the reliance:** decide whether "on first paint" is a hard requirement. If it is, it probably can't be met with a synchronous remote search, whatever A commits to.

**Next steps:** once the obligations above are written, judging whether the seam is ready for release belongs to `assess-specification`.
