I checked the working directory and it's empty: no API code, schema tests, fixtures or mapping files. Everything below comes from what you told me. Where I call something "observed", I mean you reported it, not that I verified it. The first item on the plan is to verify those reports.

---

## 1. Value claim: what, for whom, and the evidence

| Claim | Who benefits | Status | Evidence |
|---|---|---|---|
| (a) "Teachers will find the right lessons faster" | Teachers using the partner's tool, and indirectly us and the partner through adoption | **Hypothesis** | It is **observed** that one teacher said this in a demo. That is one person's statement in a demo setting. It is not a measurement. There is no baseline time-to-find and no definition of "right lesson". |
| (b) Partner's mapping is "complete" | The partner, which asserts it | **Promise**, unverified | It is **observed** that no combined-science fixtures exist. Whether combined science is covered is **unknown**. What "complete" means (every slug? every level? 1:1?) is also **unknown**. |
| (c) Our API's schema tests pass | Us, as a check on our own output | **Observed**, as you reported it. I have not run them. | It shows that responses match the revision-5 *shape*. It says nothing about whether slugs map correctly on the partner's side. |
| API contract settled at revision 5 | Both parties | **Observed** (agreement exists) | Whether rev 5 covers taxonomy versioning or change notice is **unknown**. |

(a) is the reason for the whole integration, and it has the weakest evidence. (b) and (c) are necessary for (a) but not enough. Even a correct, complete mapping does not show that teachers find lessons faster.

## 2. Mapping contract (spec)

The mapping is a function from **our slug set at version V** to **the partner's taxonomy at version T**. The contract has to state:

1. **Domain:** the full, enumerated list of our subject slugs, versioned, published by us.
2. **Codomain:** the partner's taxonomy IDs, versioned, published by them.
3. **Cardinality per slug:** 1:1, 1:N or N:1 declared explicitly. Silent collapsing is not allowed.
4. **Totality:** every slug in the domain maps to something or is explicitly marked `unmapped`. "Complete" is then defined as "no slug left undeclared" and can be checked mechanically.
5. **Unknown-input behaviour:** what the tool does with a slug it has never seen: reject, show as unmapped, or log. It must never fall back silently to a nearby subject.
6. **Change protocol:** who notifies whom, how much notice, and how both version pins are bumped when either side changes.
7. **Fixtures as the contract's executable form:** one fixture per slug, including combined science, jointly owned and run in both CI pipelines.

Today only item 1 is plausibly in our control. Items 2–7 are **unknown**, because no mapping spec or fixtures have been shared.

## 3. The seam between the API and the tool

We emit slugs, and the partner maps and displays them. Our schema tests stop at our response boundary, and the partner's tests (if any) are unknown. Nobody currently tests the seam itself.

Ways it can fail at the seam, all **unknown** until tested:
- A slug exists in our API but not in their mapping, and the lesson disappears or is misfiled.
- A 1:N subject is collapsed to one target, so lessons are found under the wrong subject.
- Slug formats drift (case, deprecated aliases, level qualifiers).
- Taxonomy versions drift: either side changes and the other keeps running on a stale mapping.
- The partner caches our slug list and misses additions.

The control that's needed is **consumer-driven contract tests**: the fixtures from §2 run against our real API output in our CI and against their mapper in theirs. Passing schema tests is not evidence against any of the failures above.

## 4. Is the record ready for integration reliance?

**No.**

| Required for reliance | Current state |
|---|---|
| Our output conforms to rev 5 | Reported pass; needs re-running and a link to the result |
| Mapping is total over our slug set | Promise only; combined science known to be untested |
| Seam tested end to end | No tests exist |
| Change protocol agreed | Unknown |
| Value claim has a baseline | None |

We can rely on our own schema conformance, once it's re-verified. We cannot yet rely on the mapping, the seam, or the value claim.

## 5. Delivery plan

| Step | Work | Exit criterion |
|---|---|---|
| 0 | Re-run the schema tests and link the results. Export the full versioned slug list. | Status of (c) confirmed by an artefact |
| 1 | Get the partner's mapping table and taxonomy version. Diff it against our slug list. | Every slug is mapped or explicitly `unmapped`, so "complete" becomes checkable |
| 2 | Write jointly owned fixtures, starting with combined science and any 1:N or N:1 cases. | Fixtures pass in both CIs |
| 3 | Agree the change protocol (notice period, version pins, unknown-slug behaviour). Add it to the contract, which may mean rev 6. | Signed off |
| 4 | Measure baseline time-to-find and correctness for teachers using their current workflow. | Baseline recorded |
| 5 | Pilot with a small teacher cohort on the integrated tool. | Same metrics collected |
| 6 | Compare. (a) moves from hypothesis to observed (supported or not) only here. | Go/no-go on broader rollout |

Steps 0–3 gate technical reliance. Steps 4–6 gate any external claim that teachers find lessons faster.

---

## Revision: the partner splits "combined science" into three subjects, effective immediately

I don't know the names of the three new subjects or how the partner decides which lesson goes where. I'm not assuming biology, chemistry and physics.

**§1 Value**
- (a) stays a **hypothesis**, and it is weaker for combined-science teachers. The demo teacher's comment was made on the old taxonomy, so it can't simply carry over. Any measurement now has to report combined science as a separate segment.
- (b): for combined science, the "complete" claim was made against a taxonomy that no longer exists, so it no longer holds. Whether the partner has updated the mapping is **unknown**.
- (c) still passes, and should. The split doesn't touch our schema, which confirms that (c) never covered mapping correctness. Its status and its limits are both unchanged.
- The rev 5 contract is still settled, but whether it says anything about a partner taxonomy change is still **unknown**. If it doesn't, this change was allowed without notice.

**§2 Mapping contract**
- Our combined-science slug(s) now map one-to-three. The contract has to say which of these applies:
  - (i) map to all three: better recall, worse precision;
  - (ii) we add a field that splits the subject, which is a change to our schema and therefore probably rev 6;
  - (iii) mark it `unmapped` until the question is resolved.
- Whether our lesson data has enough information to assign each lesson to one of the three is **unknown**. That determines whether (ii) is even possible.
- Item 6 of §2 (change protocol) moves from "should have" to "shown to be needed": this change arrived with immediate effect and no protocol behind it.

**§3 Seam**
- A specific failure is now **likely**, not just possible: combined-science lessons are misfiled, duplicated or missing. Whether that is happening **in production right now** is **unknown**, and "immediate effect" means we should find out first.
- Schema tests still won't detect it.

**§4 Readiness**
- The combined-science part of the record is definitely **not ready**, since its mapping points at a taxonomy that no longer exists.
- Whether the partner's revision changed anything else is **unknown**. The full diff in step 1 needs redoing against the new taxonomy version.

**§5 Plan changes**
- **New step −1 (now):** ask the partner what the tool currently does with our combined-science slugs, and whether live teachers are affected. Ask for the new taxonomy version, the three subject IDs and their assignment rule.
- **Step 1:** redo the diff against the new taxonomy version.
- **Step 2:** combined-science fixtures become three-target fixtures, one per new subject plus the ambiguous case.
- **Step 3:** choose among (i), (ii) and (iii). If it's (ii), open rev 6 and add a data-audit task to check whether our lessons can be split. The change protocol is now blocking, not optional.
- **Steps 4–6:** segment combined science in both the baseline and the pilot. If it's still unresolved, leave it out of the pilot and say so, so it doesn't distort the result.

**Statuses after the revision:**
- **Observed:** the contract is at rev 5; schema tests pass (your report, still to be re-run); the demo comment; no combined-science fixtures; the partner announced the split.
- **Hypothesis:** (a).
- **Promise, not holding for combined science:** (b).
- **Unknown:** production impact now, whether our data can be split, the partner's updated mapping, whether rev 5 covers taxonomy changes.
