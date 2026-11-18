**Verdict: ready with conditions.** The formula is right, but the evidence can't show it's right. Revision 1 is fine for the sift code to build on once three conditions are met.

**What I assessed:** revision 1 of `parentIndex(i)`, for use by the heap's sift operations. I checked it against three questions: is the formula right for a heap rooted at 0, is the i = 0 rule something callers can actually follow, and does the cited evidence show the formula is right? The assessor supplies findings, not the decision. Whoever owns the heap module decides whether the conditions are met. I wrote this spec's assessment myself, so it is not an independent review.

**Status of each claim**
- **Formula** `floor((i-1)/2)` for i ≥ 1: correct. Checked by hand: 1→0, 2→0, 3→1, 4→1, 5→2, 6→2.
- **Pure, no allocation:** believable for a single line of arithmetic. No evidence is needed at this size.
- **Rule for i = 0:** the rule is stated, but nothing shows the callers follow it (see 3).
- **Evidence:** claimed but not shown. Neither `parentIndex` nor `parent_of_child_is_self` appears anywhere in this repository. I saw no test results, no revision they ran against, and nothing naming which sift tests count.

**Findings**
1. **False assurance: the property test can't catch the most likely mistake.** `parent(child(i)) == i` also passes if both functions use root-at-1 formulas (`i/2`, `2i`, `2i+1`). Mixing up root-at-0 and root-at-1 is the classic bug here, and this test can't tell them apart. Also, if the range `1..10000` means parents, then children 1 and 2 are never checked, and those are the most important cases (their parent is the root). This blocks the evidence claim.
2. **Misclassified claim: "undefined behaviour" at i = 0.** What actually happens depends on the integer type. With signed integers that round toward zero, as in C and Java, `(0-1)/2` is `0`, which silently looks like "the root is its own parent". With unsigned integers, `0-1` wraps to a huge index. Neither result is undefined behaviour in the language's sense. The spec should say "precondition: i ≥ 1; result unspecified otherwise" and state the type of i. This conditions use by the implementation.
3. **Missing evidence where the callers use it:** the spec puts the burden on callers, but nothing shows that sift-up checks `i > 0` before calling. This is where a mistake would show up: a sift-up loop that calls `parentIndex(0)` either never ends or reads out of bounds. This conditions use by the implementation.
4. **Missing evidence: the evidence records are incomplete.** There is no result, date or revision for either test, and the "existing sift tests" aren't named. This is below the bar for something this small, but it has to be fixed before anyone can check condition 1.

**Conditions that clear it** (the heap module's owner confirms each one)
- Add fixed test cases that don't depend on the child functions: `parentIndex(1) == 0`, `parentIndex(2) == 0`, `parentIndex(5) == 2`, `parentIndex(6) == 2`. Also say whether 1..10000 ranges over parents or children.
- Replace "undefined behaviour" with a stated precondition, and give the type of i.
- Show that sift-up checks `i > 0` before calling, or add a debug assertion inside `parentIndex`.
- Run the tests against revision 1 and record the results.

**Next step:** these changes make a revision 2, and that goes back to `specify`. I haven't edited this spec. Revision 2 will need its own assessment, which should be quick once the fixed test cases exist. Reassess again if the index type changes, the root moves to 1, or a new caller of `parentIndex` appears besides sift.
