**Step 5 (delivery plan): DEL-lesson-finder-mapping, `status: sketch`, not ratified, governs no work yet.**

Note: the plan skill expects the repo to contain a plan-node schema, templates and an impact-area registry. This repo is empty, so I've written the node in the schema's shape but couldn't validate it. `serves`, `impact_areas` and `tickets` stay blank until someone names the strategic node and the tracker.

- **Goal:** the partner tool shows every rev 5 lesson under the correct subject, and any slug it can't map shows up visibly instead of disappearing.
- **Who benefits:**
  - The partner tool gets a mapping it can check.
  - Teachers get correct subject filtering. Finding lessons *faster* is a **hypothesis** (claim a), not something this plan commits to.
- **Mechanism:** shared fixtures, run against a pinned API revision and a pinned taxonomy version, turn the partner's word "complete" into something anyone can check.
- **Blocking owner gate G1:** the partner has to supply their taxonomy version and mapping table. This clears when both are received. Proposed expiry: 2026-10-12; the owner should confirm that date.

**Sequence:**
1. Agree M3 (what happens to unmapped slugs) and M4 (notice before taxonomy changes) with the partner. This clears F4.
2. Build a fixture for every rev 5 slug, including combined science. Expected results come from our subject definitions, not from the partner's implementation. This clears F2.
3. Add a meaning test for each slug alongside the existing schema tests. This clears F3.
4. Run the round-trip check against the partner's versioned table. This clears F1.
5. Reassess the record for integration.

**Acceptance criteria:**
- **AC1 (checkable in our repo):** the fixture suite passes for 100% of rev 5 slugs against the pinned taxonomy version.
- **AC2 (checkable in our repo):** an injected unknown slug produces the agreed "unmapped" behaviour.
- **AC3 (needs sign-off outside the repo):** the partner integration owner confirms the table version they have deployed. The partner records it; we log the date.

**Out of scope:** measuring claim (a). If that matters, it needs its own evidence design: a baseline, a population, and a definition of "right lesson".

---

## The revision: the partner splits "combined science" into three subjects, effective immediately

We have observed the partner's announcement. What their live tool is doing right now is **unknown**.

| Step | What changes | Status after the change |
|---|---|---|
| **Value** | Claim (a) is still a **hypothesis**, and combined-science teachers are now the group most at risk: their lessons may be scattered across three subjects or missing entirely. Claim (b), the "complete" mapping, was a promise made against a taxonomy that no longer exists, so it is now **stale**. Whether the partner has updated their table is **unknown**. Claim (c) still passes, which shows exactly why shape tests aren't enough. | a: hypothesis. b: stale promise. c: observed, still covers shape only. |
| **Specification: MAP-1 needs rev 2** | M2 now requires `combined-science` to map one-to-three. Our single slug can't say which of the three disciplines a lesson belongs to, so something must give. There are three options: tag every combined-science lesson with all three subjects (lessons appear under the wrong subject); add a discipline field to lessons (a new API revision, rev 6); or treat these lessons as unmapped under M3 for now. Choosing is an **owner decision** and I haven't made it. M4 was never agreed, so the partner didn't break any term, but the incident shows why M4 is needed. U1 changes from "no fixtures" to "no fixtures against the new taxonomy". | Proposed revision only. U1 still blocks. |
| **Seam** | C4 (the partner's taxonomy moves and our tests don't notice) has now actually happened. C2 gets worse: mapping to one of the three hides the lessons from the other two. There is a new failure, C6: tagging all three puts biology content under the Physics filter. The seam now fails for combined science. The partner's new taxonomy version identifier is still **unknown**. | Fails for combined science. Other slugs are undecided, as before. |
| **Assessment** | The rev 1 assessment is not evidence about rev 2. The reassessment trigger has fired. F1 moves from "unverified" to "stale". F2's fixtures must now target the new taxonomy. A new finding, F6, is the unmade decision on how to handle combined science. | **Not ready for integration.** The record is only ready for discussion. |
| **Plan** | The steps reorder: (0) find out what the live tool currently does with combined-science lessons; (1) choose the combined-science strategy (new blocking gate G2, proposed expiry 2026-10-05); then the original steps 1–5, with fixtures against the new taxonomy version. If the owner chooses the discipline field, API rev 6 becomes a blocking dependency, and our own schema contract has to be revised too. | Still a sketch. Needs ratification and the G2 decision. |

**Decisions for you:**
1. **The combined-science strategy (G2):** all-three tagging, a discipline field in API rev 6, or unmapped for now. This is a product and contract call, so I've left it open.
2. **Contacting the partner:** step 0 means asking them what their live tool is doing with these lessons now. That's an outward-facing message, so I haven't sent anything; tell me if you want a draft.
3. **Writing it down:** everything above exists only in this conversation because the repo is empty. Tell me if you want MAP-1 rev 2, SEAM-1 and the plan sketch written to files.

Two things to keep in mind about how far this goes. The assessment was a self-review in the same context, not an independent check. And nothing here measures whether teachers actually find lessons faster.
