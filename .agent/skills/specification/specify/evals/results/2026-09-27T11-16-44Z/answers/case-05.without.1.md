Here's the implementation. It uses a binary heap from `heapq`, with a counter that goes up on every push to break ties between equal priorities.

```python
import heapq
import itertools


class EmptyQueue(Exception):
    """Raised when popping from an empty StablePriorityQueue."""


class StablePriorityQueue:
    """Min-priority queue that returns equal priorities in the order they were pushed.

    Items are (priority, payload). pop() returns the item with the lowest
    priority; among equal priorities, the earliest pushed item comes first.
    push and pop are O(log n).
    """

    def __init__(self):
        self._heap = []
        self._counter = itertools.count()

    def push(self, priority, payload):
        # Heap entries are (priority, seq, payload). seq is unique and only
        # goes up, so ties on priority resolve to the earliest push. The
        # comparison never reaches payload, so payloads need not be comparable.
        heapq.heappush(self._heap, (priority, next(self._counter), payload))

    def pop(self):
        if not self._heap:
            raise EmptyQueue("pop from an empty priority queue")
        priority, _, payload = heapq.heappop(self._heap)
        return (priority, payload)

    def __len__(self):
        return len(self._heap)

    def __bool__(self):
        return bool(self._heap)
```

**Why this meets the contract:**
- **Lowest priority first:** Python compares heap entries element by element, so priority is compared first.
- **FIFO among equal priorities:** The sequence number is only compared when priorities are equal. It is unique and always increasing, so the earlier push always wins. This holds when pushes and pops are interleaved, because the counter never resets or reuses a value. That's the case `test_interleaved_push_pop_keeps_fifo` checks.
- **O(log n):** `heappush` and `heappop` are both O(log n).
- **Empty pop:** Popping an empty queue raises `EmptyQueue`.
- **Payloads:** Because the unique sequence number always settles a tie before the payload is reached, payloads are never compared. They can be dicts, objects, or anything else.

**Assumptions to check against your tests:** You gave me the test names but not their contents, so I guessed at the interface:
- The class is `StablePriorityQueue`.
- `push(priority, payload)` takes two arguments rather than one tuple.
- `pop()` returns the `(priority, payload)` tuple.
- `EmptyQueue` is importable from the same module.

If the tests call `push((p, x))` with one tuple, expect `pop()` to return only the payload, or use different names, the fix is a one-line change. Also, `__len__` and `__bool__` aren't in the contract; I added them for convenience, and you can delete them.
