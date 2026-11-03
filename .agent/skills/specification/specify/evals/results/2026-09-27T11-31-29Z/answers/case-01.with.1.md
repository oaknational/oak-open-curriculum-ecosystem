# parentIndex(i) — specification, rev 1

**Subject.** A pure function in the array-backed binary heap. The root is at index 0, and the children of node `p` are at `2p+1` and `2p+2`.
**Status.** This records behaviour that is already settled. It is written from your statement alone, because the heap repository was not read.

## Obligation

For any integer `i` with `1 ≤ i < n`, where `n` is the heap size, `parentIndex(i)` must return `⌊(i − 1) / 2⌋`. The function must not change any state.

Equivalently, the result `p` is the unique index for which `i ∈ {2p+1, 2p+2}`. That means `0 ≤ p < i` for every valid `i`.

**Example.** `parentIndex(1) = 0`, `parentIndex(2) = 0`, `parentIndex(5) = 2`, `parentIndex(6) = 2`.

## Deliberately unspecified

- **The root (`i = 0`).** It has no parent. The tests never call this case, so its result (a value, a sentinel or an error) is not specified, and no caller may rely on it. Callers must check `i > 0` before calling.
- **Negative, non-integer or out-of-range `i`.** Also unspecified. The function doesn't know `n`, so it can't enforce the upper bound.

## Evidence

- **Existing tests.** heap.sift-up.test and heap.sift-down.test call the function on every non-root index and pass. That is the stated evidence for the obligation above. I haven't inspected them, so I can't confirm they check against an independent answer rather than just exercising the function.
- **Independent check.** The formula comes from the child-index definition, not from the implementation. It can serve as the expected answer in a direct test: for every `p ≥ 0`, `parentIndex(2p+1) = parentIndex(2p+2) = p`.

## Open issue

What the function actually does at the root is unknown. This is accepted as a known gap: it doesn't affect sift-up or sift-down, since both check `i > 0` before calling. If a caller ever needs specific root behaviour, this spec needs a revision.

There's no external dependency to hand off to anyone else. The spec is complete enough to implement from and to check against.
