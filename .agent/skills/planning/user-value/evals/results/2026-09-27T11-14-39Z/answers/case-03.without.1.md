I don't have a file-writing tool in this session, so the module and tests are below for you to paste in. I used Python because the heap's `push` / `pop_min` / `peek` / `len` API reads like Python.

**Assumptions about the heap** (please check these against the real one, since I can't see it):
- `push(x)` stores one comparable element.
- `pop_min()` and `peek()` return that element.
- `len(heap)` works through `__len__`. If it's a `.len()` method instead, change the one line marked in the code.
- What the heap does when empty doesn't matter, because the queue checks `len` first.

### `stable_pq.py`

```python
"""Stable priority queue over an external binary min-heap.

Contract
--------
push(item, priority)
    Insert `item`. Priorities must be totally ordered among themselves.
    Items need not be comparable (they are never compared).
pop() -> item
    Remove and return the item with the smallest priority. Among equal
    priorities, the item pushed earliest comes out first (FIFO).
    Raises IndexError when empty.
peek() -> item
    Same item pop() would return, without removing it.
    Raises IndexError when empty.
len(q) -> int
    Number of items currently queued.

Stability holds across any interleaving of push and pop.
Complexity is the heap's: push/pop O(log n), peek/len O(1). The queue
adds O(1) per operation.

The heap does NOT need to be stable. Every entry is keyed by
(priority, insertion_seq), and those keys are unique, so any correct
min-heap produces exactly one possible order. Because the seq values
differ, tuple comparison stops before it reaches the item.
"""
import itertools


class StablePriorityQueue:
    def __init__(self, heap_factory):
        self._heap = heap_factory()
        self._seq = itertools.count()

    def push(self, item, priority):
        self._heap.push((priority, next(self._seq), item))

    def pop(self):
        if not len(self):
            raise IndexError("pop from empty priority queue")
        return self._heap.pop_min()[2]

    def peek(self):
        if not len(self):
            raise IndexError("peek at empty priority queue")
        return self._heap.peek()[2]

    def __len__(self):
        return len(self._heap)  # adjust if the heap exposes .len()
```

### `test_stable_pq.py`

The tests run against two stand-ins for the heap. `ReferenceHeap` is a correct heap. `TieReversingHeap` is a correct min-heap that deliberately breaks ties in the wrong order (LIFO), which shows the queue's stability doesn't depend on the heap being stable.

```python
import heapq
import random

import pytest

from stable_pq import StablePriorityQueue


class ReferenceHeap:
    def __init__(self): self._a = []
    def push(self, x): heapq.heappush(self._a, x)
    def pop_min(self): return heapq.heappop(self._a)
    def peek(self): return self._a[0]
    def __len__(self): return len(self._a)


class TieReversingHeap:
    """Correct min-heap that returns the most recently pushed of equal keys."""
    def __init__(self): self._a = []
    def push(self, x): self._a.append(x)
    def _argmin(self):
        best = 0
        for i, x in enumerate(self._a):
            if not (self._a[best] < x):  # x <= best -> prefer later
                best = i
        return best
    def pop_min(self): return self._a.pop(self._argmin())
    def peek(self): return self._a[self._argmin()]
    def __len__(self): return len(self._a)


@pytest.fixture(params=[ReferenceHeap, TieReversingHeap])
def q(request):
    return StablePriorityQueue(request.param)


def test_empty(q):
    assert len(q) == 0
    with pytest.raises(IndexError):
        q.pop()
    with pytest.raises(IndexError):
        q.peek()


def test_orders_by_priority(q):
    for item, p in [("c", 3), ("a", 1), ("b", 2)]:
        q.push(item, p)
    assert [q.pop() for _ in range(3)] == ["a", "b", "c"]


def test_equal_priorities_are_fifo(q):
    for item in "abcde":
        q.push(item, 7)
    assert [q.pop() for _ in range(5)] == list("abcde")


def test_stability_across_interleaved_ops(q):
    q.push("a", 1); q.push("b", 1)
    assert q.pop() == "a"
    q.push("c", 1); q.push("d", 0)
    assert [q.pop(), q.pop(), q.pop()] == ["d", "b", "c"]


def test_items_are_never_compared(q):
    items = [object() for _ in range(5)]
    for it in items:
        q.push(it, 0)
    assert [q.pop() for _ in items] == items


def test_peek_matches_pop_and_does_not_remove(q):
    q.push("x", 2); q.push("y", 1); q.push("z", 1)
    assert q.peek() == "y"
    assert len(q) == 3
    assert q.pop() == "y"
    assert q.peek() == "z"


def test_len_tracks_operations(q):
    for i in range(4):
        q.push(i, i % 2)
    assert len(q) == 4
    q.pop()
    assert len(q) == 3


def test_empty_after_draining(q):
    q.push("a", 1)
    q.pop()
    with pytest.raises(IndexError):
        q.pop()


@pytest.mark.parametrize("seed", range(20))
def test_randomized_against_model(q, seed):
    rng = random.Random(seed)
    model, seq = [], 0  # model: list of (priority, seq, item)
    for _ in range(300):
        if model and rng.random() < 0.4:
            expected = min(model)
            model.remove(expected)
            assert q.pop() == expected[2]
        else:
            p = rng.randrange(4)  # few priorities -> many ties
            model.append((p, seq, f"i{seq}"))
            q.push(f"i{seq}", p)
            seq += 1
        assert len(q) == len(model)
```

### Notes
- **Priorities must be totally ordered.** Values like `NaN` break the ordering and aren't supported. The docstring says this.
- **No overflow risk.** The sequence counter is a Python int, which can't overflow.
- **The tests only check the queue logic.** They don't test the connection to your real heap. Once this is next to the heap, run the same suite once with the real heap class as the fixture parameter (or add it to the parameter list). That will confirm the assumptions at the top about how the heap is called.
