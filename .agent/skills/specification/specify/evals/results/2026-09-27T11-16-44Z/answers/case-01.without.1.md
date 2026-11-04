## `parentIndex(i)`

**Purpose:** Returns the index of the parent of node `i` in a binary heap stored in an array, with the root at index 0.

**Signature:** `parentIndex(i: integer) → integer`

**Precondition:** `i` is an integer and `i ≥ 1`, meaning any node except the root.

**Returns:** `⌊(i − 1) / 2⌋`

**Postconditions:**
- `0 ≤ parentIndex(i) < i`
- `i` is one of the parent's two children: `i = 2·parentIndex(i) + 1` or `i = 2·parentIndex(i) + 2`

**Examples:**

| `i` | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| `parentIndex(i)` | 0 | 0 | 1 | 1 | 2 | 2 |

**Out of scope:** What happens when `i = 0` (the root) or `i` is negative isn't specified. `heap.sift-up.test` and `heap.sift-down.test` only call `parentIndex` on non-root indices, so nothing establishes that behaviour. Callers must not rely on it. This matters because a plain `(i − 1) / 2` with integer division gives 0 in some languages and −1 in others when `i = 0`.

**Verification:** `heap.sift-up.test` and `heap.sift-down.test`, which cover every non-root index they reach.
