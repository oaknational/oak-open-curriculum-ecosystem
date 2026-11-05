# Implementation plan: stable priority queue

I've assumed Python, since the test names read that way. The design carries over to other languages unchanged.

## Design

A binary min-heap (`heapq`) holding entries of the form `(priority, seq, payload)`.

- **`seq`** comes from a counter owned by the queue instance (`itertools.count()`). It goes up by one on every push and never resets, including when pops happen or the queue empties.
- Heap order is lexicographic on `(priority, seq)`. Lowest priority wins, and for equal priorities the lower `seq` (the earlier push) wins. That is the FIFO guarantee.
- Because every `seq` is unique, comparison always stops before reaching `payload`. Payloads never need to be comparable, and a tie can never raise a `TypeError`.
- `heappush` and `heappop` are both O(log n), which meets the contract.

## Module layout (`priority_queue.py` or wherever the scheduler keeps its utilities)

1. **`class EmptyQueue(Exception)`**: raised by `pop` when the queue is empty.
2. **`class StablePriorityQueue`**:
   - `__init__`: `self._heap = []`, `self._seq = itertools.count()`
   - `push(priority, payload)`: `heapq.heappush(self._heap, (priority, next(self._seq), payload))`
   - `pop() -> (priority, payload)`: if `self._heap` is empty, raise `EmptyQueue`. Otherwise `heappop` and return `(priority, payload)`, dropping `seq` so it never leaks to callers.
   - `__len__`: returns `len(self._heap)`. It isn't in the contract, but it lets the dispatch loop check for an empty queue without relying on exceptions for control flow.

## How each acceptance test is covered

| Test | What satisfies it |
|---|---|
| `test_pop_lowest_priority` | Min-heap ordering on `priority` |
| `test_equal_priorities_fifo` | `seq` tie-breaker |
| `test_interleaved_push_pop_keeps_fifo` | `seq` is never reset or reused, so an item pushed after some pops still sorts after earlier items with the same priority |
| `test_empty_pop_raises` | Explicit empty check raising `EmptyQueue`, not the `IndexError` that `heapq` would raise |

## Scheduler integration

- On job arrival: `queue.push(job.priority, job)`.
- On each tick, either:
  - `if queue: priority, job = queue.pop()`, or
  - `try: … except EmptyQueue: pass`.

  An idle tick is the normal case for the dispatch loop, so I recommend the `len` check.

## Things to keep in mind
- **Priorities must be mutually comparable.** Mixing, say, `int` and `None` will fail inside the heap. If the scheduler can't guarantee this, validate in `push`; otherwise document it as a precondition.
- **Thread safety:** if job arrival runs on a different thread from the tick loop, wrap `push` and `pop` in a single `threading.Lock`. The contract doesn't mention this either way, so check before shipping.
- **Out of scope:** removing or reprioritizing items, peeking, and bounded capacity. None are in the contract, so none should be added.

## Order of work
1. `EmptyQueue` and `StablePriorityQueue` with `push`, `pop` and `__len__`.
2. Run the four acceptance tests.
3. Connect it to the dispatch loop (push on arrival, pop on each tick with the empty check).
4. Add the lock only if the scheduler turns out to be multi-threaded.
