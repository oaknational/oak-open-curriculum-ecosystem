# Plan: stable priority queue for the scheduler

## Design

This is a binary min-heap. Each heap entry is a triple `(priority, seq, payload)`, where `seq` comes from a counter that only ever increases.

- **Lowest priority first:** the heap orders entries by `priority` first.
- **FIFO among equal priorities:** ties fall to `seq`, so the item pushed earliest comes out first. The counter lives on the queue instance and never resets, including when the queue empties. That keeps FIFO correct even when pushes and pops are interleaved.
- **Payloads are never compared:** every `seq` is unique, so tuple comparison never reaches the payload. Payloads can be any type, including ones that can't be ordered (dicts, job objects).
- **O(log n):** `heapq.heappush` and `heapq.heappop` are both O(log n).

## Implementation steps

1. **Define `EmptyQueue(Exception)`** in the queue module, so tests and the scheduler can import it from there.
2. **Write the `StablePriorityQueue` class:**
   ```python
   import heapq
   import itertools

   class EmptyQueue(Exception):
       """Raised when popping from an empty StablePriorityQueue."""

   class StablePriorityQueue:
       def __init__(self):
           self._heap = []
           self._seq = itertools.count()

       def push(self, priority, payload):
           heapq.heappush(self._heap, (priority, next(self._seq), payload))

       def pop(self):
           if not self._heap:
               raise EmptyQueue("pop from empty queue")
           priority, _, payload = heapq.heappop(self._heap)
           return priority, payload

       def __len__(self):
           return len(self._heap)
   ```
   `pop` returns the `(priority, payload)` pair from the contract, and the internal `seq` never leaves the class. `__len__` lets the dispatch loop check `if queue:` without catching the exception.
3. **Connect the dispatch loop:** call `push(priority, job)` when a job arrives. On each tick, either check `if queue:` before popping or catch `EmptyQueue` and treat it as an idle tick. Pick one and use it consistently. I recommend the `len` check, because an empty queue is a normal state for the scheduler, not an error.

## How each acceptance test is covered

| Test | What makes it pass |
|---|---|
| `test_pop_lowest_priority` | The min-heap orders by `priority` |
| `test_equal_priorities_fifo` | Ties are broken by the increasing `seq` |
| `test_interleaved_push_pop_keeps_fifo` | `seq` never resets, so later pushes always sort after earlier ones with the same priority |
| `test_empty_pop_raises` | `pop` checks for an empty heap and raises before calling `heappop` |

## Caveats

- **Priority type:** priorities must be mutually comparable, for example all ints. If they're mixed types, Python raises `TypeError` at push time. That's acceptable, but it should be documented.
- **Thread safety:** if job arrival and the tick loop run on different threads, wrap `push` and `pop` in a `threading.Lock`. If the loop is single-threaded or asyncio, nothing extra is needed.
- **Out of scope:** removing, reprioritising or peeking at items isn't part of the contract, so the plan leaves it out.
