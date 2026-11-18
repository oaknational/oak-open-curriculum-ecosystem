**No, revision 4 isn't ready for integration.** None of the three pieces of evidence tests the combined-science mapping rule as it stands in revision 4, and that rule is the one change between revisions 3 and 4.

I also didn't have the text of revision 4 itself; the working directory is empty. So I haven't read its obligations, examples or failure behaviour. The answer rests on the evidence alone, and the evidence is enough to say no.

## What I assessed

- **Specification:** subject-mapping contract, revision 4. Its identity and where it's kept weren't given.
- **Intended use:** integration between the curriculum API and the teacher-facing tool.
- **What integration needs:**
  1. Every rule the teacher tool depends on, including the combined-science rule, has current evidence of its meaning (not just its data format), tied to revision 4.
  2. Adverse cases are covered: combined vs separate sciences, unmapped subjects, and any overlap.
  3. Someone who owns the integration decision has signed off.
- **Independence:** none claimed. This is a single reviewer working from the described evidence.

## The evidence

| Evidence | What it can show | Status for revision 4 |
|---|---|---|
| Fixture suite (passing) | That the mapping behaves as expected | **Stale.** It ran against revision 3, before the combined-science rule changed. A pass on revision 3 says nothing about revision 4. |
| API schema tests | Data shape: fields, types, required fields | **Wrong kind of check.** A mapping that is well-formed but wrong still passes. |
| Author's note: "the mapping is now correct" | Nothing checkable | **Unsupported claim.** It doesn't name a test method or conditions, has no result or reviewer, and doesn't say which revision it means. |

## Findings

1. **Stale evidence** (blocks integration). The only evidence about mapping behaviour comes from before the rule change. The changed rule has no current evidence.
2. **False assurance** (blocks integration). The note says the mapping is correct, but nothing backs it. The passing fixtures and schema tests are easy to misread as confirming it; they don't.
3. **Wrong kind of check** (blocks integration). The schema tests only check data format. Whether combined science maps correctly is a question of meaning, and they can't answer it.
4. **Unresolved questions** (blocks integration):
   - What exactly the combined-science rule now says, including its edge cases (e.g. how combined vs separate sciences are handled).
   - Whether the teacher tool's expectations were updated to match.
   - Whether any other rules in revision 4 changed.
5. **No sign-off** (blocks integration). No one with authority over the integration has accepted revision 4. The author's note doesn't count as that.

## Decision and conditions

**Not ready for integration.** Revision 4 could become ready once these are met:

1. **Fixtures updated and rerun against revision 4.** They need to include the new combined-science rule's success case and its adverse cases. The expected results must come from the rule as written in the specification, not from the API's current output; otherwise the test just checks the code against itself.
2. **The teacher-tool side confirmed** to expect the revised combined-science mapping. This is where the two systems meet, and ideally it's a test the teacher tool runs, not only the API.
3. **An evidence record for each result:** revision, test method, conditions, result, date and reviewer. This replaces the author's note as the warrant.
4. **Sign-off** by whoever owns the integration decision (probably the teacher-tool owner or the integration lead; you'd need to name them). Any leftover risk, such as untested subject combinations, is theirs to accept, not the author's or mine.

**Next step:** send it back to the author to rerun the fixtures against revision 4 with combined-science cases added. Then reassess with the specification text in hand.

**Reassess** if revision 5 appears, the mapping rules or fixtures change, the integration scope widens (new consumers or subject sets), or the person who signs off changes.
