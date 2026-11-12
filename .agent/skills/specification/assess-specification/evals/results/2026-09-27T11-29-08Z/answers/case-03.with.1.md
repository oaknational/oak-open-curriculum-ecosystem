**No, revision 4 is not ready for integration.** None of the evidence supplied tests revision 4's combined-science mapping rule, and that rule is the one thing that changed.

I couldn't see the specification itself; the working directory is empty. So this assessment covers only the evidence as you described it. It says nothing yet about whether revision 4's obligations are well written.

## What was assessed

- **Revision:** 4 of the subject-mapping contract between the curriculum API and the teacher-facing tool.
- **Use:** integration, meaning the teacher tool relies on the API's subject mappings being correct, including combined science.
- **What that use requires:** each mapping rule is clearly stated, labelled as a guarantee, backed by evidence produced against revision 4, and approved by someone with authority to accept it for integration.
- **Independence:** I'm reviewing only what was described, not auditing independently. I haven't read the record or run anything.

## The evidence, item by item

| Evidence | What it can show | Status for revision 4 |
|---|---|---|
| Passing fixture suite | That revision 3's behaviour, including the old combined-science rule, passed | **Stale.** It was run against revision 3, before the rule changed. It is not evidence about revision 4. |
| API schema tests | That the response has the right structure | **Doesn't cover the claim.** A schema test can't tell whether combined science maps to the right subjects, only that the output is well formed. |
| Author's note "the mapping is now correct" | That the author believes it | **Not evidence.** It names no test, conditions, result or reviewer, and the author isn't independent of the change. |

## Findings

1. **Stale evidence (blocks integration).** The only behavioural check tested the previous rule. Its green result says nothing about the new one.
2. **False assurance (blocks integration).** Together, a passing suite and "now correct" read like verification, but nothing checked revision 4's mapping. Presenting this as readiness overstates what is known.
3. **Wrong kind of evidence (conditions integration).** Schema tests are being offered where a mapping-correctness claim is at stake. They are valid for structure only.
4. **Readiness not approved by anyone with authority (blocks integration).** No one who owns the integration decision has accepted it. The author's note can't stand in for that.
5. **Open question (conditions integration).** Nobody has said what happens to consumers who relied on revision 3's combined-science mappings: existing teacher data, cached mappings, or reports built on the old rule. Whether this change breaks things for the teacher tool is unknown.

## What would clear it

- **Test revision 4 itself.** Update the fixtures to the new combined-science rule, including awkward cases: combined versus separate sciences, double and triple award, and any subjects that map ambiguously. Then run the suite against revision 4 and record the revision, date, result and reviewer. Ideally the expected answers come from the curriculum source or a subject specialist, not from the implementation being tested.
- **State the change's effect.** Say in the record what changed from revision 3 to 4, and whether the teacher tool's existing data needs migrating or can tolerate the change.
- **Get sign-off.** The owner of the teacher tool's integration, or whoever you've named for it, decides once the above is done. I've assumed that's a role on your side. Only they can accept any risk that remains.

**Next step:** run the fixture suite against revision 4 with fixtures written for the new rule, and send me the specification text so I can check the obligations themselves.

**Reassess** once there's a revision-4 test result, a revision 5, or a change in who approves integration.
