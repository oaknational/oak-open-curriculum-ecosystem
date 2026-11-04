## `parentIndex(i)`

**Purpose:** Return the index of the parent of node `i` in a binary heap stored in an array, with the root at index 0.

**Precondition:** `i` is an integer and `i ≥ 1`. In other words, `i` is any node except the root.

**Returns:** `⌊(i − 1) / 2⌋`

**Equivalently:** For every `p ≥ 0`, the children of `p` are `2p + 1` and `2p + 2`, and `parentIndex` of either child returns `p`.

**Examples:**

| i | parentIndex(i) |
|---|---|
| 1 | 0 |
| 2 | 0 |
| 3 | 1 |
| 4 | 1 |
| 5 | 2 |
| 6 | 2 |

**Properties:**
- `0 ≤ parentIndex(i) < i`
- It is a pure function: it has no side effects and doesn't depend on what is stored in the heap.

**Unspecified:** What happens for `i = 0`, a negative `i`, or a non-integer `i`. The existing tests (`heap.sift-up.test`, `heap.sift-down.test`) only call `parentIndex` on non-root indices. Callers must not rely on any particular result or error for these inputs.
