# Plan: stable priority queue for the scheduler

I kept this plan short to match the task. The `oak-plan` skill expects a plan-node estate (schema, templates, impact-areas registry, validator), and none exists here. So this is a delivery-node-shaped plan written in this chat. It hasn't been checked against a schema, and it stays `sketch` until you approve it. You said the value is settled, so I skipped the user-value pass. There's also no design fork to ask you about: a heap with a tie-breaker is the standard answer.

**Assumption:** the test names suggest Python and pytest. If the scheduler uses another language, the approach stays the same and only the library calls change.

## Goal
The dispatch loop always gets the most urgent job next. Among jobs of equal urgency, it gets them in arrival order. Push and pop stay O(log n) as the backlog grows.

## Users and value
- **The scheduler's dispatch loop** (the only consumer). It gets a predictable order, so jobs of equal priority can't starve each other or jump ahead of each other.

## Mechanism
A binary min-heap (`heapq`) holding entries of `(priority, seq, payload)`:
- `seq` comes from a per-instance `itertools.count()` and goes up by one on every push.
- The heap sorts entries as tuples, comparing `priority` first. Ties go to the lower `seq`, which is the earlier push, so equal priorities come out first-in first-out.
- Every `seq` is unique, so the comparison never gets as far as `payload`. Payloads don't need to be comparable, and comparing two jobs can't raise `TypeError`.
- `heappush` and `heappop` are both O(log n).
- `seq` is never reset. Python ints don't overflow, and never resetting keeps order stable when pushes and pops are interleaved. That's what `test_interleaved_push_pop_keeps_fifo` checks.

Sketch:
```python
class EmptyQueue(Exception):
    """Raised by pop() on an empty queue."""

class StablePriorityQueue:
    def __init__(self):
        self._heap = []
        self._seq = itertools.count()

    def push(self, priority, payload):
        heapq.heappush(self._heap, (priority, next(self._seq), payload))

    def pop(self):
        if not self._heap:
            raise EmptyQueue
        priority, _, payload = heapq.heappop(self._heap)
        return priority, payload
```

## Acceptance criteria and proofs
All four can be proven in the repo, by the tests you already wrote:

| Criterion | Proof |
|---|---|
| `pop` returns the lowest priority | `test_pop_lowest_priority` |
| Equal priorities come out in push order | `test_equal_priorities_fifo` |
| Order holds when pushes and pops are interleaved | `test_interleaved_push_pop_keeps_fifo` |
| `pop` on an empty queue raises `EmptyQueue` | `test_empty_pop_raises` |

The heap operations give O(log n) by construction. None of the tests measure it, and I don't recommend adding a timing test because it would be flaky.

## Todos (one small PR)
1. **Read the imports in the existing test file first.** They fix the module path, the class name, the name and location of `EmptyQueue`, and whether `pop` returns `(priority, payload)` or only the payload. The code has to match the tests, not the sketch above. This is the only real unknown.
2. Write the queue and `EmptyQueue` at that path.
3. Run the four tests until they pass.
4. Connect the dispatch loop: call `push` when a job arrives, and on each tick call `pop` and catch `EmptyQueue` as "nothing to dispatch". Doing this in the same PR is fine because it's only a few lines.

## Out of scope
- `peek`, `__len__`, changing a job's priority, removing a job. Add them only when the scheduler needs them.
- Thread safety. I assumed the dispatch loop is single-threaded. If jobs arrive on another thread, wrap `push` and `pop` in a `threading.Lock`. That's the one change that would alter the plan.
- Priorities that can't be ordered, such as NaN or mixed types. They're the caller's responsibility.

If you approve it, the next step is Todo 1: reading the test imports.
