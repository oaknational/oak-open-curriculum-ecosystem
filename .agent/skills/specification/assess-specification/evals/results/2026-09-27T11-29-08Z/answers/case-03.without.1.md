**No, revision 4 isn't ready yet.** None of the three pieces of evidence tests the change that makes revision 4 different from revision 3. (The working directory is empty, so this is based on how you described the evidence, not on the artifacts themselves.)

**What each piece of evidence actually shows**

| Evidence | What it shows | What it doesn't show |
|---|---|---|
| Fixture suite passing on rev 3 | Rev 3's mappings behaved as the fixtures expected. | Anything about rev 4. It ran before the combined-science rule changed, so it never ran against the one rule that changed. At best it's a baseline for the rest of the contract. |
| API schema tests | Responses have the right shape: fields, types, required keys. | Whether a subject maps to the right target. A combined-science record mapped to the wrong subject is still valid against the schema, so these tests can't catch the kind of error revision 4 might introduce. |
| Author's note: "the mapping is now correct" | The author believes the change is right. | Independent checking. It gives no test, example or criterion for "correct," and it comes from the person who made the change, which is the kind of claim verification is supposed to check. |

**The gap:** the change in revision 4 is exactly the part with no evidence behind it. Combined-science mapping is also a likely place for trouble. It's usually where one-to-many or many-to-one cases appear (e.g., one "Combined Science" subject against separate Biology, Chemistry and Physics subjects, or double vs. triple award). Those cases affect what teachers see, and schema checks won't catch them.

**What would make it ready**

1. **Re-run the full fixture suite against rev 4.** This confirms nothing else regressed.
2. **Add fixtures for the new combined-science rule.** Cover the main cases and the edges: combined vs. separate sciences, any award or tier variants, records that matched the old rule but not the new one, and unmapped or unknown inputs. Someone other than the author should write or review the expected outputs.
3. **Diff rev 3 and rev 4 outputs on real or representative data.** Check that every changed mapping is one you meant to change.
4. **Agree what "correct" means for combined science,** preferably with someone who owns the curriculum taxonomy, and record that definition in the spec. That turns the author's note into a claim you can test.
5. **Confirm the consumer side:** check that the teacher-facing tool handles the new mapping shape, especially if the rule changes how many subjects one record maps to.

**Bottom line:** you could treat the parts of the contract that didn't change as provisionally supported, pending step 1. Don't rely on the combined-science rule until steps 1 and 2 pass on rev 4. If integration can't wait, ship with that rule behind a flag or on a fallback path, and state that it hasn't been verified.
