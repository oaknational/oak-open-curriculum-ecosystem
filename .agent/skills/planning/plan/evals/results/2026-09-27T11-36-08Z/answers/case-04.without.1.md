The working directory is an empty repo, so this plan uses only the facts in your brief. I've invented no API details. Where I assume something about the rev-5 API, I label it as an assumption.

**Status labels:** **Observed** means we have direct evidence. **Hypothesis** means it's plausible but untested. **Promise** means a party has asserted it but we haven't verified it. **Unknown** means we have no evidence either way.

---

## 1. Value claim: what's claimed, for whom, and the evidence

| Claim | For whom | Status | Evidence |
|---|---|---|---|
| (a) "Teachers will find the right lessons faster" | Teachers using the partner's tool | **Hypothesis** | That one teacher said it in a demo is **observed**. That it's true is not. We have one anecdote, from a demo setting, with no baseline, no measure of "faster", and no definition of "right lesson". |
| (b) The partner's mapping is "complete" | Us, as the integrator relying on it | **Promise** (partner's word) | No fixtures exist for combined science, so for that subject coverage is **unknown**. "Complete" is also undefined: complete against which list of our slugs, and at which revision? |
| (c) Our API's schema tests pass | Us and the partner (response shape) | **Observed** | This only shows that our responses match the rev-5 schema. It says nothing about whether slugs map correctly, so it provides **no evidence** for (a) or (b). |

The value chain only holds if all three links hold: our API is correct (c, partly observed), the mapping is correct (b, promised), and a correct mapping leads to faster finding (a, hypothesis). The weakest link is the one we've tested least, which is the mapping. The claim we can't yet make is anything that depends on (a).

## 2. The mapping contract

The partner owns the mapping, but the contract must state what they owe us in terms we can test.

1. **Domain:** the full set of subject slugs in our rev-5 enumeration, listed explicitly and not left as "all subjects". (*Assumption:* rev 5 fixes a finite slug list. If it doesn't, that's the first gap to close.)
2. **Totality:** every slug in the domain maps to at least one partner taxonomy ID. "Complete" is defined as exactly this and checked by a test, not by assertion.
3. **Cardinality:** each entry is marked 1:1, 1:n or n:1. For 1:n, the contract says whether lessons fan out to every target or are routed by lesson-level metadata, and which metadata field does the routing.
4. **Unknown slugs:** if the tool receives a slug it can't map, it must fail visibly (log it and surface an "unmapped" state). It must never drop it silently. A silent drop looks like "fewer results", which directly undermines (a) and can't be detected from our side.
5. **Versioning:** the mapping records which API revision (5) and which partner taxonomy version it targets. A change on either side invalidates the mapping until it's re-verified.
6. **Change notice:** a minimum notice period for taxonomy changes, and a named owner on each side.
7. **Fixtures as acceptance:** at least one golden fixture per slug (slug → expected partner ID(s), with a sample lesson). Combined science is required because it's the known gap.

## 3. The seam between our API and the partner's tool

| Seam point | Owner | What currently covers it | Status |
|---|---|---|---|
| Response shape | Us | Schema tests | **Observed** passing |
| Slug values match the rev-5 enumeration | Us | Only if the schema pins an enum | **Unknown** (not stated) |
| Slug → partner ID translation | Partner | Nothing we can see | **Promise** |
| Behaviour on unmapped or unknown slugs | Partner | Nothing | **Unknown** |
| Mapping stays in sync as either side changes | Both | No mechanism | **Unknown**, effectively absent |
| End result: teacher sees the right lesson | Partner UI | Nothing | **Hypothesis** |

The main finding is that **nothing tests across the seam**. Our tests stop at our boundary and the partner's claim covers the other side. The failure that matters (a wrong or missing mapping that shows up as silently missing lessons) falls between the two, and no existing check can detect it.

## 4. Is the record ready for integration reliance?

**No.** Reliance needs these gates:

- **G1:** a written mapping contract (section 2) that both sides accept.
- **G2:** a contract test across the seam. We supply one fixture per slug, the partner's mapping runs against them, and the results are compared to the expected IDs. It must include combined science.
- **G3:** unmapped-slug behaviour verified by a test that sends an unknown slug and checks for a visible failure.
- **G4:** a version pin that records API rev 5 and the partner taxonomy version together.

Only (c) is met, and it's necessary but far from sufficient. Claim (a) isn't a readiness gate: the integration can be correct without being faster. But nobody should state (a) as an outcome until it has been measured (section 5, step 6).

## 5. Delivery plan

| # | Step | Exit criterion |
|---|---|---|
| 1 | Publish the slug list from rev 5 as the mapping domain | The list is agreed by both parties |
| 2 | Agree the mapping contract (section 2) | Signed off, with owners named |
| 3 | Build golden fixtures for every slug, combined science first | A fixture exists for every slug |
| 4 | Run a contract test against the partner's mapping in their staging environment | 100% of slugs map to the expected IDs, and an unknown slug fails visibly |
| 5 | Limited rollout to a pilot group of teachers, with unmapped-slug alerts | Zero silent drops over the pilot window |
| 6 | Measure (a): baseline time-to-find and success rate for defined tasks before the tool, then again after | (a) moves to observed, or it's refuted. Until then, communications call it a goal, not a result. |
| 7 | Put the contract test in CI on both sides and re-run it whenever either side changes version | The test runs automatically on revision bumps |

---

## 6. Revision: the partner splits "combined science" into three subjects with immediate effect

**Status of the revision itself:** that the partner *announced* it is **observed**. What their production tool is doing with combined-science traffic right now is **unknown**. It might still accept the old ID, treat it as an alias, or reject or drop it.

### Tracing it through each section

**Section 1, value claim:**
- (a) is still a **hypothesis**, and the change doesn't make it any more or less supported. But the population it affects is now clear: combined-science teachers are the group most at risk of a *worse* experience right now. Any baseline for them taken before the split can no longer be compared with measurements after it.
- (b) is **no longer applicable to combined science.** It was a promise about the old taxonomy, and its target no longer exists in that form. It was never verified for this subject, and now it's out of date as well. For other subjects it's still a **promise**. Whether the partner re-audited the rest of their mapping during the split is **unknown**, so ask.
- (c) is **still observed passing, and that's exactly the problem.** Our schema tests will stay green through a change that may be breaking combined science in production. This is direct evidence that (c) can't serve as a readiness signal.

**Section 2, mapping contract:**
- The combined-science entry changes from 1:1 (*assumed*) to **1:3**. The contract has to choose between two options:
  - **Fan-out:** every combined-science lesson appears under all three new subjects. This is simple and needs no API change, but it over-includes, so teachers see lessons that aren't relevant. That works against (a).
  - **Routing:** each lesson goes to one of the three subjects based on lesson-level metadata. This is more precise, but only possible if rev 5 exposes a field that can separate the three. Whether it does is **unknown** to me. Check the rev-5 schema.
- If routing needs a field rev 5 doesn't have, the **settled contract has to reopen as rev 6**. That's a scope change and should be treated as one, not handled as a quiet patch.
- The versioning clause (item 5) is triggered: the partner's taxonomy version has changed, so the mapping is invalid until re-verified.
- The change-notice clause (item 6) was just broken in practice, or would have been if it existed. "Immediate effect" is exactly the case that clause is meant to prevent.

**Section 3, seam:**
- "Slug → partner ID" moves from **promise** to **known stale** for combined science.
- "Unmapped behaviour" moves from an unknown in theory to **the most urgent open question**. If the partner drops unmapped IDs silently, combined-science lessons may already be invisible to teachers. That is a **hypothesis** until someone checks. Nothing on our side would show it.

**Section 4, readiness:**
- It was already not ready, and the change adds a blocking item: G2 can't pass for combined science until the new 1:3 mapping and its fixtures exist. There may also be a **live incident**, which comes before any readiness work.

**Section 5, delivery plan (revised):**

| # | Step | Exit criterion |
|---|---|---|
| **0 (new, now)** | Find out what the partner's production tool does with combined-science slugs today | The actual behaviour is **observed**. If lessons are being dropped, treat it as an incident and ask the partner to alias the old ID temporarily. |
| **0b (new)** | Stop anyone relying on combined science and exclude it from any "complete" statement | Communications and the pilot scope are updated |
| 1–2 | Unchanged, but the contract now covers the 1:3 cardinality, a chosen fan-out or routing strategy, and a version pin to the *new* taxonomy | Strategy is chosen. If routing is chosen, a decision is made on whether rev 6 is required. |
| 3 | Fixtures for the three new subjects replace the single combined-science fixture. Add fixtures for lessons on the boundaries between them. | A fixture exists for each target |
| 4 | Contract test re-run against the *post-split* taxonomy | All slugs pass, including the three new targets |
| 5–6 | Pilot and measurement. The (a) baseline for combined-science teachers must be taken *after* the split. | As before |
| 7 | CI contract test, now also triggered by partner taxonomy versions, not just our API revisions | This change would have been caught automatically |

### Summary of status changes

| Item | Before the revision | After the revision |
|---|---|---|
| (a) faster finding | Hypothesis | Hypothesis (combined-science baseline now invalid) |
| (b) mapping complete | Promise (combined science unknown) | Promise for other subjects; **stale** for combined science |
| (c) schema tests pass | Observed | Observed, and shown to be blind to this change |
| Revision 5 still enough | Settled | **Unknown**: depends on whether 1:3 routing needs a new field |
| Combined science live in production | Unknown | **Unknown, and urgent** (step 0) |

The most important next action is step 0: find out what the partner's tool is doing with combined-science lessons today. It's the only question that could turn into a teacher-facing problem that's already happening, and nothing we have now would show it.
