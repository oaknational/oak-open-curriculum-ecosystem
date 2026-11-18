# Connecting A and B: a guarantee B needs that A never gives

## Summary

Each contract is fine on its own. Put together, they fail. B's correctness depends on a precondition (every search returns in 50 ms or less) that A doesn't promise and explicitly reserves the right to break (queuing under load). Nobody breaches anything when this goes wrong. The gap sits in the connection, not in either party.

## What each side offers and needs

| | Endpoint A (provider) | Endpoint B (consumer) |
|---|---|---|
| Latency | "Promptly": no number, can't be tested | Hard bound: ≤ 50 ms, *every* request |
| Under load | May queue, so the delay has no upper limit | Not considered |
| On a slow reply | Still correct (the reply is late, not wrong) | Shows an empty list |

1. **B's assumption is not something A agreed to.** "Promptly" can't be turned into 50 ms. The queuing clause says outright that there is no upper limit on delay. B has turned a vague word into a precise promise A never made.
2. **"Every" can't be met by any real service.** Even if A committed to a p99 of 50 ms, 1 request in 100 would miss. The network round trip, TLS, and cold caches can use up 50 ms before A even starts work. B's precondition is stricter than anything a networked dependency could honestly guarantee.

## Why this matters more than a typical latency mismatch

- **Failures cluster when reliance matters most.** Teachers open lessons at the same moments: the start of the school day, the start of each period. Those spikes are exactly the "under load" case where A queues. So misses aren't spread randomly. They land on many teachers at once, at the moment they need the list.
- **The failure is silent and looks like real data.** An empty list can't be told apart from "you have no lessons." A teacher may think their lessons were deleted, recreate them, or start class without them. A visible error would be better than a believable false empty.
- **Nobody is accountable.** A replied "promptly" and was allowed to queue. B behaved exactly as its contract says. The teacher's intended reliance fails, and there's no breach to point to. Checking each contract separately will never catch this.

## Can the intended reliance be met?

"Teachers see their lessons on first paint" can't be achieved through A as currently contracted. It can only be met by taking A off the first-paint path:

1. **Render lessons from something that doesn't depend on A**, such as server-side rendering, a local or edge cache of the last known lesson list, or prefetching before navigation. Then use A to refresh.
2. **Separate "not loaded yet" from "empty."** Show a loading skeleton, and a "couldn't load, retrying" state if it times out. Only show an empty list when A actually returned zero results.
3. **Late results should update the page, not be thrown away.** If A replies after 50 ms, fill in the list then.

Optional steps on A's side, which help but can't close the gap alone:
- Ask for a numeric latency target (e.g. p99 under X ms) and a bounded queue or fail-fast behaviour, so B at least knows when to give up and retry.
- A priority lane or capacity planning for the predictable class-start peaks.

## Contract-level fix

B's contract should list its latency requirement as an explicit dependency precondition, not an internal assumption. Connecting it to A should then require showing that A meets it. Here that check fails, which forces one of two outcomes: A strengthens its guarantee, or B changes its design so the precondition isn't needed. Given that "every request under 50 ms" can't be guaranteed over a network, the realistic answer is the second one. B should aim for lessons shown promptly and never shown falsely empty, not a hard 50 ms deadline on every search.
