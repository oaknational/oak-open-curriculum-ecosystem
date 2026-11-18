**Disposition: ready.** Revision 1 is fit for the heap's sift-up to rely on in its implementation. Nothing blocks it, and I'm not setting any conditions.

**Scope of this judgement.** I assessed only revision 1, and only for use by sift-up. I worked from the text you supplied. I didn't run the tests or look at the code, so the passing results are as you reported them. This is a single-reviewer reading, not an independent review. Whoever owns the heap decides whether to accept it; I only supply the findings.

**What sift-up needs, and whether it has it:**

| What sift-up needs | Status |
|---|---|
| The correct parent for every index it passes (i ≥ 1) | **Met.** The property test covers every child index from 1 to 20002 without gaps. Its expected values come from the child formula (2p+1, 2p+2), not from the function under test, so it isn't checking the code against itself. |
| i = 0 is safely excluded | **Met.** The spec forbids calling it with 0 and leaves the result there unspecified, and the sift-up tests confirm a check that i > 0 before every call. This matters: in languages that truncate division, (0−1)/2 gives 0, not −1. That would make the root its own parent and could send sift-up into an endless loop. The rule against calling with 0, and the caller's check, cover that case. |
| No overflow or sign trouble when i ≥ 1 | **Met.** i−1 is never negative, so rounding down and truncating give the same answer and nothing overflows. |
| Pure, no allocation | **Stated but not tested.** This only matters if sift-up promises something itself about allocation or side effects. It doesn't need this to be correct. |

**Minor points (none of them block this use):**
- The tests stop at i = 20002. The formula doesn't depend on how big i is, so going beyond that isn't needed for correctness.
- The claim of no allocation has no evidence behind it. That's fine for this use, but it would need some if sift-up ever promises not to allocate.
- The spec doesn't name who approves it. The heap's owner is the obvious choice.

**Next step:** the heap's owner accepts it; that's all.

**Reassess if:** the revision changes, another caller starts depending on it (especially one that might pass 0), the heap stops keeping its root at index 0, sift-up takes on a promise about allocation or timing, or the tests stop passing.
