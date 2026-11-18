Here's an implementation of the contract as you wrote it. It uses a binary heap with a monotonically increasing insertion counter as a tie-breaker. That makes equal-priority items come out in FIFO order and means payloads are never compared.

```python
import heapq
import itertools


class EmptyQueue(Exception):
    """Raised when popping from an empty StablePriorityQueue."""


class StablePriorityQueue:
    """Min-priority queue; equal priorities are returned in push order (FIFO).

    push and pop are O(log n).
    """

    def __init__(self):
        self._heap = []
        self._counter = itertools.count()

    def push(self, priority, payload):
        # The sequence number breaks ties by insertion order and guarantees
        # payloads are never compared (they need not be orderable).
        heapq.heappush(self._heap, (priority, next(self._counter), payload))

    def pop(self):
        if not self._heap:
            raise EmptyQueue("pop from an empty priority queue")
        priority, _, payload = heapq.heappop(self._heap)
        return priority, payload

    def __len__(self):
        return len(self._heap)
```

These are the four tests, written to the names you gave. They check what the contract says:

```python
import pytest


def test_pop_lowest_priority():
    q = StablePriorityQueue()
    q.push(5, "e")
    q.push(1, "a")
    q.push(3, "c")
    assert q.pop() == (1, "a")
    assert q.pop() == (3, "c")
    assert q.pop() == (5, "e")


def test_equal_priorities_fifo():
    q = StablePriorityQueue()
    for name in ["first", "second", "third"]:
        q.push(2, name)
    assert [q.pop() for _ in range(3)] == [(2, "first"), (2, "second"), (2, "third")]


def test_interleaved_push_pop_keeps_fifo():
    q = StablePriorityQueue()
    q.push(1, "a1")
    q.push(1, "a2")
    assert q.pop() == (1, "a1")
    q.push(1, "a3")
    q.push(0, "z")
    assert q.pop() == (0, "z")
    assert q.pop() == (1, "a2")
    assert q.pop() == (1, "a3")


def test_empty_pop_raises():
    q = StablePriorityQueue()
    with pytest.raises(EmptyQueue):
        q.pop()
    q.push(1, "x")
    q.pop()
    with pytest.raises(EmptyQueue):
        q.pop()
```

A few notes:
- **FIFO holds across interleaved pushes and pops.** The counter keeps increasing for the life of the queue and never resets, so items pushed later always sort after earlier items with the same priority.
- **Payloads can be any type.** Because of the tie-breaker, the heap never compares payloads, so they don't need to be orderable (for example, dicts work).
- **I added `__len__`, which isn't in the contract.** It's O(1). Delete it if you want the interface kept exactly to the contract.
- **Not tested here:** I haven't run these tests, and I didn't know the class name or the file paths from your spec, so I chose them. Rename them to match your test files if they differ.
