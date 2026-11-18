**Yes, it's ready for sift-up to rely on.** Two small wording fixes are worth making, but neither blocks it.

**Why it holds up**

- **The contract covers what sift-up needs.** For every `i ≥ 1`, sift-up needs two things. First, `parentIndex(i)` must be the node whose child `i` is, meaning `i ∈ {2p+1, 2p+2}`. Second, the result must be `< i`, so the loop ends. `floor((i-1)/2)` gives both.
- **The precondition sits in the right place.** `i = 0` is the one input where languages disagree. Truncating division gives `0`, floor gives `-1`, and unsigned arithmetic wraps. Declaring the result unspecified there and forbidding the call is the right choice. The root has no parent, and sift-up already stops at `i = 0`, so it doesn't need a value there.
- **For `i ≥ 1` there's no rounding ambiguity.** `i-1 ≥ 0`, so truncation and floor agree. The spec is correct however it's implemented (`(i-1)/2` or `(i-1)>>1`).
- **The property test checks the actual contract, not a stand-in for it.** Checking `2p+1` and `2p+2` for every `p` in `0..10000` covers every `i` from 1 to 20002 with no gaps. It tests the parent–child relation itself, which is what sift-up uses.
- **"Pure, no allocation"** is all the non-functional guarantee a hot inner loop needs.

**Wording fixes (optional)**

1. **State the upper end of the domain.** Say `1 ≤ i ≤ max index` (or `i < heap size`) and name the integer type. The formula can't overflow for `i ≥ 1`, but the test only reaches 20002. Indices above that are covered by the closed-form argument, not by testing. One sentence saying so closes that gap.
2. **Fix the claim about the sift-up tests.** Tests can't "check i > 0 before every call." What guarantees the precondition is the loop guard in the sift-up code (e.g. `while i > 0`). Point to that guard as the evidence. The passing sift-up tests are supporting evidence, not the proof.
