# The connection A → B: where it breaks and why

**Summary:** Both endpoints are correct by their own standards. The fault is in the mapping between them, and none of the existing checks covers that mapping. Teachers of the double-award course are losing lessons because a single-subject taxonomy cannot hold a lesson that belongs to three subjects, and because B drops unmapped slugs without saying so.

## Why the passing checks don't help

- A's schema and tests only show that A returns well-formed lessons under its own four slugs.
- B's schema and tests only show that B handles inputs its mapping table already knows about.
- Nothing tests "every slug A currently emits is represented correctly in B." That is the one property teachers depend on, and it has no owner.

## What is actually going wrong

**1. The mapping table is out of date.**
B's table was built against A's revision 3, and A is now on revision 5. The facts don't say what changed between those revisions. But exact-match lookup on a two-revision-old table is fragile: any slug that was added or renamed misses its entry.

**2. Unmatched slugs disappear silently.**
When a slug has no entry, B drops the lesson with no error, log or count. B's tests can't notice this, because from B's side a dropped lesson looks the same as a lesson that never existed. This explains the **missing** lessons: combined-science lessons with no table entry are discarded.

**3. B's taxonomy can't represent combined science (the root cause).**
A combined-science lesson covers biology, chemistry and physics. B's taxonomy is a single choice from {Biology, Chemistry, Physics}, and the table maps each slug to one subject. So a combined-science lesson has no correct place in B:
- With no entry, it is dropped (lessons go missing).
- With an entry, it goes to one science, and teachers looking under the other two won't find it (lessons filed under the wrong science).

Updating the table can't fix this, because any single value is wrong. The facts don't say which lessons fall into which case. One likely explanation: the rev-3 table has an entry for combined-science, or for an earlier slug, that points to one science, while other combined lessons arrive under a slug with no entry. That needs checking against the actual table, not assuming.

## Fixes, in priority order

1. **Stop failing silently.** For unmapped slugs, log them, count them and hold the lessons in a quarantine list rather than dropping them. On its own this would have exposed the problem.
2. **Change how B represents combined science.** Either:
   - let a lesson carry several subjects and map combined-science to all three, or
   - add a Combined Science subject to B's taxonomy, since double-award teachers think of it as its own course.

   Which to choose is a product decision about how those teachers browse. Mapping combined-science to one science is not an acceptable fix.
3. **Add a contract test on the connection.** Fetch A's current list of slugs and check that each one has an explicit mapping in B, including an explicit "multiple subjects" or "intentionally excluded" entry where that applies. Run it in CI against A's live revision so a new or renamed slug fails the build instead of reaching teachers.
4. **Track A's revision explicitly.** Record which A revision the table was checked against, and alert when A moves ahead of it. Then review A's rev 3→5 changes for other drift beyond combined-science.
5. **Recover the lost lessons.** Once mapping is fixed, re-run it over existing A content so the missing combined-science lessons are brought back.
