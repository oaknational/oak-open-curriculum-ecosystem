# parentIndex: specification

**Status:** Adopted. It describes existing behaviour and proposes nothing new.
**Source:** Written only from the task statement. I have not read the heap repository or its tests.

This subject is close to the size where no specification is needed, because the implementation and its tests already say what it does. Since you asked for one, here is the smallest record that captures what relies on it.

## Case
In a heap with 7 elements:
- `parentIndex(1) = 0` and `parentIndex(2) = 0`
- `parentIndex(5) = 2` and `parentIndex(6) = 2`

## Obligation
**P1.** For any integer `i` with `1 ≤ i < n`, where `n` is the heap's size, `parentIndex(i)` must return `⌊(i − 1) / 2⌋`.

Equivalently, it returns the unique `p` with `0 ≤ p < i` such that `i = 2p + 1` or `i = 2p + 2`. This is the inverse of the child-index functions `2p + 1` and `2p + 2`, and sift-up and sift-down depend on that relationship.

The function has no side effects and depends only on `i`.

## Deliberately unspecified (callers must not rely on these)
- **The result for `i = 0`.** The root has no parent, and the tests never call it with 0. Truncating division would return 0 there, while floor division would return −1. Callers must check for the root themselves.
- **The result for `i < 0`, non-integer `i`, or `i ≥ n`.** Whether it returns a value, raises an error, or behaves undefined is not specified.
- **How it is computed.** Shift or division is the implementation's choice.

## Evidence
- **What exists:** `heap.sift-up.test` and `heap.sift-down.test` call `parentIndex` on every non-root index and pass. That covers P1 for the heap sizes those tests use.
- **What that does not cover:** Heap sizes the tests don't use, and very large `i` where overflow could occur. I also can't tell whether the tests' expected values were worked out independently or taken from the implementation.
- **Treatment:** I've accepted these as residual gaps because the behaviour is settled. The overflow question reopens only if a heap could get close to the integer limit.

## Seams and handoffs
The sift-up and sift-down routines depend on this function, but only through the root check. One sentence covers that, so it doesn't need a separate connection specification, and nothing else needs to be handed on.
