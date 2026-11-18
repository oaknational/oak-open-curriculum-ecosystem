**Ready.** Revision 1 of `parentIndex` can be used to implement the heap's sift-up as it stands, with no conditions.

**What sift-up needs from it:**
- the correct parent for every index i ≥ 1 it might pass;
- a clear rule about i = 0;
- no side effects or hidden costs.

**Obligations checked:**

| Obligation | Status |
|---|---|
| Returns floor((i−1)/2) for i ≥ 1 | Backed by evidence. Every i ≥ 1 is either 2p+1 or 2p+2 for exactly one p. So the property test checks every index from 1 to 20002. It uses the heap's own definition of parent and child as its expected answer, not the function's output, so it isn't circular. |
| i = 0 is not allowed and its result is unspecified | Clear, and sift-up follows it: its tests check i > 0 before every call, and they pass. |
| Pure, no allocation | Stated as a design choice. It's plausible for simple arithmetic, and nothing about sift-up depends on it more than that. |

**Findings:**
- **No blocking or conditional findings.**
- **Note:** the test stops at index 20002. The formula works the same way for any index, and (i−1)/2 can't overflow when i ≥ 1. So heaps larger than that don't make sift-up unsafe, and this isn't a condition.
- **Note:** for i ≥ 1, i−1 is never negative, so ordinary truncating integer division gives the same result as floor. There is no sign issue.
- **Limitation:** I judged the evidence as you described it. I didn't run or inspect the tests themselves; the repo here has no commits.

**Who decides:** I'm only giving findings. The person who owns the heap or the sift-up code decides whether to accept it.

**Look at this again if:**
- the spec gets a new revision;
- a new caller might pass i = 0;
- the layout changes to put the root at index 1;
- the evidence or its test results change.
