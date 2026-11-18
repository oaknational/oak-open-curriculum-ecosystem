# Plan: stable priority queue for the scheduler

The test names are snake_case, so I've assumed Python. The design works the same way in other languages.

## Design

A binary min-heap. Each entry is the tuple `(priority, seq, payload)`, where `seq` comes from a counter that only goes up and belongs to the queue.

- **Lowest priority first:** the heap is ordered by `priority`.
- **FIFO among equal priorities:** ties are broken by `seq`, which is the push order.
- **O(log n):** `heapq.heappush` and `heapq.heappop` are both O(log n).
- **The payload is never compared:** every entry has a different `seq`, so a tuple comparison never reaches the payload. Job objects don't need to be orderable, and equal priorities never raise a `TypeError`.

## Interface

```python
class EmptyQueue(Exception):
    """Raised by pop() on an empty queue."""

class StablePriorityQueue:
    def __init__(self):
        self._heap = []
        self._seq = itertools.count()

    def push(self, priority, payload) -> None:
        heapq.heappush(self._heap, (priority, next(self._seq), payload))

    def pop(self):
        if not self._heap:
            raise EmptyQueue
        priority, _, payload = heapq.heappop(self._heap)
        return priority, payload

    def __len__(self) -> int:
        return len(self._heap)
```

`pop` returns `(priority, payload)`, which matches the contract's definition of an item. The tuple's middle `seq` value is internal and never returned.

## Key decisions

1. **The counter is never reset or reused.** This is what makes `test_interleaved_push_pop_keeps_fifo` pass. An item pushed after some pops still gets a higher `seq` than anything already waiting, so it goes behind older items with the same priority. Do not use `len(heap)` as the tiebreaker, because it repeats values after pops and breaks FIFO.
2. **Check for empty explicitly and raise `EmptyQueue`.** Otherwise `heapq` raises its own `IndexError`, which the dispatch loop shouldn't have to know about.
3. **Nothing beyond the contract.** No peek, decrease-key, removal or thread safety. The loop only calls push on arrival and pop on each tick. `__len__` is included so the loop can check for an empty queue without catching an exception on every idle tick. If you want the API strictly minimal, drop it.
4. **Counter overflow isn't a concern** because Python integers have no size limit. In a language with fixed-size integers, use a 64-bit counter.

## Steps

1. Add `EmptyQueue` and `StablePriorityQueue` in the scheduler package, following the layout above.
2. Run the four acceptance tests:
   - `test_pop_lowest_priority`: covered by heap ordering.
   - `test_equal_priorities_fifo`: covered by the `seq` tiebreak.
   - `test_interleaved_push_pop_keeps_fifo`: covered by the counter never resetting (decision 1).
   - `test_empty_pop_raises`: covered by the explicit check (decision 2).
3. Connect the dispatch loop: call `push(priority, job)` when a job arrives. On each tick, call `pop()` when `len(q)` is nonzero, or catch `EmptyQueue`, whichever matches the loop's existing style.

## Risk

The only real bug risk is the tiebreaker. If it's missing or repeats values, FIFO breaks and non-orderable payloads raise `TypeError` when priorities are equal. The equal-priority and interleaved tests both catch that.
