**Yes, it's ready for sift-up to rely on.** One caveat: there's no `parentIndex` or `parent_of_child_is_self` in this working directory, so I've assessed the spec and the evidence as you described them, not the code.

**Why it's enough for sift-up**

Sift-up needs three things from `parentIndex`, and the spec gives all of them:

1. **The right parent.** For every i ≥ 1, the spec pins the result to exactly floor((i−1)/2). That is the node whose children are i. So "swap with parent if the heap order is violated" does the right thing.
2. **Guaranteed progress.** For i ≥ 1, floor((i−1)/2) < i. Each step moves strictly toward the root, so the loop ends. This follows from the formula and doesn't need to be stated separately.
3. **A precondition the caller can meet.** The i = 0 exclusion is exactly where sift-up stops anyway (`while i > 0`). "Unspecified" is fine because the sift-up tests confirm it never calls with 0.

Being pure and not allocating means it's safe to call in a hot loop with no side effects to reason about.

**Why the evidence is enough**

- **The property test checks the whole formula over its range.** Every i ≥ 1 can be written as exactly one of 2p+1 or 2p+2. So p in 0..10000 checks the formula at every index from 1 to 20002, not just a sample. It also checks the inverse (child to parent), which is the relationship sift-up depends on.
- **The caller's tests confirm the precondition.** They show sift-up checks i > 0 before every call.

**Minor points (none block reliance)**

- **Indices above 20002 aren't tested.** For a one-line implementation like `(i - 1) / 2` or `(i - 1) >> 1`, that's fine, because i − 1 can't overflow when i ≥ 1. If the implementation is anything more complicated, extend the test to a few indices near the top of the index type's range.
- **Truncating division.** If the implementation uses truncating integer division, it equals floor only because i − 1 ≥ 0. That's another reason the i ≥ 1 precondition matters. It's worth a one-line comment in the code.
- **"Unspecified" vs. "may trap".** If i = 0 could abort the program (for example, unsigned wraparound with checked arithmetic), "unspecified result" slightly understates it. This doesn't matter to sift-up since it never passes 0, but other callers might care. Consider "must not be called with i = 0" with no promise about what happens.

**Verdict:** Ready. The formula is exact, the precondition matches how sift-up already guards its loop, and both sides are backed by tests. The points above are optional hardening.
