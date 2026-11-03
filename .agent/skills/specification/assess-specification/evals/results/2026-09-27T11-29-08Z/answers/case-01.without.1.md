**Not ready yet.** The formula is correct, but three gaps would stop the sift operations from safely relying on this spec. Each one is small to fix. I couldn't find `parentIndex` or `parent_of_child_is_self` in this repo, so this review covers only the text of the spec.

## What's already right
- `floor((i-1)/2)` is the correct parent for a 0-rooted heap: children of `p` are `2p+1` and `2p+2`, and both map back to `p`.
- For `i >= 1`, `i-1` is never negative. So `floor` and truncating integer division give the same result, and nothing can overflow.
- "Pure, no allocation" is the right promise for a function called on every sift step.

## Blocking issues

1. **The evidence may skip the most important case.** It's unclear whether "i in 1..10000" ranges over the argument (the child) or the parent.
   - If it's the child, it's fine.
   - If the test generates parents `i` and checks `parentIndex(2i+1) == i` and `parentIndex(2i+2) == i`, which the name `parent_of_child_is_self` suggests, then parent 0 is never tested. That means `parentIndex(1) == 0` and `parentIndex(2) == 0` are never checked, and those are the root's children, the case every sift-up that reaches the top depends on.
   - Fix: state what the range covers, and make sure the parent range includes 0 (i.e. `0..10000`).

2. **Calling it with `i = 0` is left to callers, but nothing shows the one real caller avoids it.**
   - Sift-down never calls `parentIndex`. Sift-up does, and the spec says it must not pass 0. So the reliance only holds if sift-up checks `i > 0` *before* calling `parentIndex(i)`, and the evidence doesn't show that.
   - A common bug is `while heap[parent(i)] > heap[i]`, which quietly relies on `parent(0)` returning something harmless. In Python, `(0-1)//2 == -1`, so `heap[-1]` reads the last element. Unsigned arithmetic wraps around to a huge index instead.
   - Fix: add a sift test that inserts a new overall minimum (or maximum, for a max-heap) so sift-up climbs all the way to index 0. Also add an assert (a debug check) that `i >= 1` inside `parentIndex`, so a bad call fails loudly instead of doing something unpredictable.

3. **The allowed inputs aren't fully stated.**
   - Say whether `i` is signed or unsigned. If it's signed, negative `i` also needs to be ruled out.
   - Note that callers pass `1 <= i < n`. The function doesn't need `n`, but that's the range the sift code actually uses.

## Optional
- Say explicitly that this function is the inverse of `leftChild` and `rightChild` (`2p+1` and `2p+2`). The sift code depends on that relationship, not the formula alone, and it's what the property test really checks.
- "Existing sift tests" is vague as evidence. Name the test that exercises sift-up reaching the root, or add one as described in item 2.

With items 1–3 fixed, I'd consider revision 2 ready to rely on.
