Since the contract, consumer, and tests are already fixed, this plan only covers how to build it and in what order.

## Plan: stable priority queue

**Approach:** Use a binary min-heap where each entry is `(priority, seq, payload)`. `seq` comes from a counter that only ever goes up, which gives earliest-pushed-first among equal priorities. The test names suggest Python, so `heapq` gives O(log n) push and pop directly.

### Steps

1. **Define `EmptyQueue`** as the queue module's own exception class, so the dispatch loop can catch it specifically.

2. **Define the queue's state:**
   - `_heap`: a list of `(priority, seq, payload)` tuples.
   - `_seq`: an integer counter that starts at 0.

3. **`push(priority, payload)`:** call `heapq.heappush(self._heap, (priority, self._seq, payload))`, then add 1 to `_seq`. This is O(log n).

4. **`pop()`:** if `_heap` is empty, raise `EmptyQueue`. Otherwise call `heappop` and return `(priority, payload)`, leaving out `seq`. This is O(log n).

5. **Wire it into the dispatch loop:** call `push` when a job arrives. On each tick, call `pop` and catch `EmptyQueue` as "nothing to dispatch this tick", so an idle tick doesn't crash the loop.

### Three rules that make the tests pass

- **Never reset `_seq` and never derive it from `len(_heap)`.** A length-based sequence number gets reused after a pop, and that breaks `test_interleaved_push_pop_keeps_fifo`. The counter must only ever go up.
- **`seq` must always settle ties.** Because every entry has a different `seq`, tuple comparison never reaches `payload`. Payloads therefore don't need to be comparable, and they can never influence the order.
- **Priorities must be mutually comparable.** The contract already implies this; there's nothing extra to enforce.

### How each test is covered

| Test | Covered by |
|---|---|
| `test_pop_lowest_priority` | heap order on the first tuple element (`priority`) |
| `test_equal_priorities_fifo` | `seq` breaks ties |
| `test_interleaved_push_pop_keeps_fifo` | `_seq` only ever increases, even across pops |
| `test_empty_pop_raises` | the empty check at the start of `pop` |

### Order of work
Build `EmptyQueue`, then the class with `push` and `pop`. Run the four acceptance tests. Then add the dispatch-loop integration, including the idle-tick handling.
