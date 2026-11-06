The contract is settled, so this doesn't need a separate specification step. The skill's estate files (schema, templates, impact-area registry) weren't available, so `serves` and `impact_areas` are left for you to fill.

---

```yaml
---
type: delivery
status: sketch
serves: <scheduler strategic node>
impact_areas: [<scheduler area from registry>]
depends_on: []
owner_gates: []
---
```

# Stable priority queue for the scheduler dispatch loop

## Goal
The dispatch loop always runs the most urgent job next. Among jobs with the same priority, the one that arrived first runs first, so no job gets overtaken by a later job of equal priority.

## Who it's for
- **Scheduler dispatch loop (the consumer):** it can call `push` whenever a job arrives and `pop` on every tick, and get a predictable order at O(log n) cost per call.
- **People running the scheduler:** jobs with equal priority run in the order they arrived, so dispatch order can be explained from arrival order alone.

## How it works
- **Storage:** a binary min-heap (in Python, `heapq`) holding entries `(priority, seq, payload)`.
- **Arrival counter:** `seq` comes from a counter owned by the queue. It goes up by one on every push and is never reset or reused, including when the queue empties.
- **Why a plain heap isn't enough:** a heap on its own doesn't keep equal items in arrival order.
- **Why the counter fixes it:** every entry gets a unique `(priority, seq)` key. The smallest key is therefore always the lowest priority, and within that priority the earliest push.
- **Why the counter must never reset:** the interleaved push/pop test depends on it. If `seq` were reset or derived from queue size, a job pushed after some pops could get a smaller number than an older job still waiting.
- **Payloads are never compared:** `seq` is unique, so comparing two entries never reaches the payload. Payloads don't need to support ordering.
- **Cost:** `heappush` and `heappop` are both O(log n), which meets the complexity requirement.
- **Empty queue:** `pop` checks for emptiness first and raises `EmptyQueue`, which is defined in the same module. This replaces the `IndexError` that `heapq` would otherwise raise.

## Interface
```python
class EmptyQueue(Exception): ...

class StablePriorityQueue:
    def push(self, priority, payload) -> None
    def pop(self) -> tuple[priority, payload]
```

## Acceptance criteria and proofs
| # | Criterion | Proof |
|---|---|---|
| 1 | `pop` returns the lowest-priority item | `repo-safe`: `test_pop_lowest_priority` |
| 2 | Equal priorities come out in push order | `repo-safe`: `test_equal_priorities_fifo` |
| 3 | Push order is kept when pushes and pops are interleaved | `repo-safe`: `test_interleaved_push_pop_keeps_fifo` |
| 4 | `pop` on an empty queue raises `EmptyQueue` | `repo-safe`: `test_empty_pop_raises` |
| 5 | `push` and `pop` are O(log n) | Code review: the only work per call is one `heappush` or `heappop`, with no scans or sorts. None of the four tests covers this, and I'm not adding a timing test because it would be flaky. |

## Out of scope
- `peek`, `len`, `is_empty`, iteration
- Removing a job or changing its priority
- Thread safety
- Validating priority types
- Any change to the dispatch loop. The loop already has to handle `EmptyQueue` on idle ticks; that's the consumer's code, and nothing is changed here.

## Todos (one slice, one PR)
1. Add `EmptyQueue` and `StablePriorityQueue` (heap plus arrival counter) in the scheduler package.
2. Run the four existing acceptance tests; all must pass unchanged.
3. In the PR description, show that criterion 5 holds: each call does one heap operation and nothing else.

## Review dispositions
Empty.

---

**Simplest version:** I kept it to a single slice. There's no custom heap (the standard library's `heapq` is enough) and no methods beyond what the contract asks for. The plan is `status: sketch` until you ratify it. To do that, give the word and say where it's recorded, so it can go in `ratified_where`.
