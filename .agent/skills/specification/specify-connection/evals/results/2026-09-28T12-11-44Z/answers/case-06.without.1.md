# The connection between A and B

**Both contracts are consistent on their own, but they don't fit together. B depends on a guarantee that A never gives, and in one case A explicitly contradicts it.**

## Where the gap is

| | What A guarantees | What B needs |
|---|---|---|
| Latency | "Promptly": no number, so nothing you can check | Every search returns in 50 ms or less |
| Under load | Requests may be queued, so latency has no upper limit | No exception for load |
| Timeout | Not addressed | An empty list is shown |

Composition only works if what A guarantees implies what B needs. "Promptly, possibly queued" does not imply "always within 50 ms". The queueing clause goes further and tells you directly that the 50 ms bound will sometimes be broken. This isn't a vague area of the contract. A has said in writing that B's assumption can fail.

## Why this failure is serious

1. **It happens exactly when it matters.** A search API is under load when many people use it at once. For a classroom tool, that is the start of a lesson period, when every teacher opens the page together. So queueing is most likely at the moment teachers most need the list.

2. **It fails silently and gives a wrong answer.** On timeout B shows an empty list. A teacher can't tell that apart from "you have no lessons". An error or a spinner would at least be honest. An empty list tells them something false, and they may act on it by recreating lessons, panicking, or giving up on the tool.

3. **Nobody is formally at fault.** A met its contract, because queueing is allowed. B met its contract, because it shows an empty list on timeout. The system is still broken. Checking each contract separately will never find this. It only shows up when you check the connection between them.

4. **The 50 ms budget is fragile even without load.** Network round-trip, TLS setup and a cold start can use up 50 ms before A does any searching. So B's assumption is weak even against a fast provider.

## Is the intended reliance met?

**No.** "Teachers see their lessons on first paint" depends on the 50 ms assumption, and A does not support that assumption. It will hold most of the time and fail in a predictable, correlated way.

## How to fix it (my recommendation first)

**Change B so that first paint no longer depends on A.** This is the right fix, because A has no reason to promise a hard 50 ms bound and probably couldn't keep one anyway.
- Render the lesson list on the server, or serve it from a cache or prefetch (for example, the teacher's lessons stored at login or by a background refresh). The lesson list is a stable, per-user dataset. It doesn't need a live search call every time the page loads.
- If a live call is unavoidable, show a loading or skeleton state instead of an empty list. Keep "no results" and "not yet or failed" as separate states, and retry or fill in the list after first paint.

**Other options, which are weaker:**
- **Renegotiate A** to give a numeric latency guarantee (such as p99 under 50 ms including queueing) plus load limits. This is expensive, and a percentile guarantee still leaves some searches over the limit, so B would still need the fallback above.
- **Relax the intended reliance** to "lessons appear quickly, with a clear loading state". This is honest, but it loses the first-paint goal.

**The general lesson:** B's assumption was an unstated dependency on A. Any contract whose correctness depends on a property of another component should name that property explicitly and check it against the other side's guarantees at integration time. Here that check would have flagged the mismatch immediately.
