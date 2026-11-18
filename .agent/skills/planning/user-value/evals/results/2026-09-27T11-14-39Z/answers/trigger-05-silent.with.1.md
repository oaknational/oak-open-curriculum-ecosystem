I didn't write any code yet because I can't find the heap contract you're referring to. The working directory is empty, the repo has no commits, and permission to read my memory directory was denied, so I couldn't check there either.

Could you paste the contract or tell me where it's saved? These are the details I need:

1. **Language and test framework**, for example Python with pytest, TypeScript with vitest, or Rust with built-in tests.
2. **Ordering**: min-heap or max-heap, and whether it accepts a custom comparator or key function.
3. **Operations and their signatures**: `push`, `pop`, `peek`, `len`/`size`, `heapify` or building from an iterable, and anything extra like `pushpop`, `replace`, `decrease_key` or `merge`.
4. **What happens on an empty heap**: whether `pop`/`peek` throw an error (and which type) or return a null/sentinel value.
5. **Guarantees**: whether equal-priority items must come out in insertion order, whether it must be mutable or persistent, and any complexity requirements such as O(n) heapify.

If there isn't a written contract, I can go with a reasonable default instead: a Python array-backed min-heap with an optional `key`. It would have `push`, `pop`, `peek`, `__len__`, `__bool__` and O(n) construction from an iterable, and raise `IndexError` on an empty heap. Equal priorities wouldn't be guaranteed to come out in insertion order. The pytest tests would cover edge cases, plus property tests that compare its output against `sorted()` and `heapq`. Tell me if you want that or your own spec.
