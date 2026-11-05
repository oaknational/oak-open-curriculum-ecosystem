I didn't find any code or contract documents for either endpoint in the working directory, so this analysis works only from what you described. That means it can locate where the problem most likely is, but it can't prove the cause.

# Seam analysis: curriculum API (rev 5) → teacher tool (rev 2)

## 1. Seam contract

| Field | Content |
|---|---|
| **Relation** | B takes A's subject slugs and converts them into B's own subject categories. So the question is whether the meaning survives the conversion, not whether the data has the right format. |
| **Endpoints** | A: curriculum API, **rev 5**. B: teacher tool, **rev 2**. Where each contract is officially defined was **not supplied**. |
| **Purpose** | A teacher picks a subject in B and gets the lessons A holds for that subject: all of them, and only those. |
| **What A promises** | Lessons keyed by subject slug, in a format that passes validation. **Not stated anywhere:** whether slugs are stable across revisions, whether one subject can have several slugs, whether a lesson can belong to several subjects, how "combined science" relates to biology, chemistry and physics, and whether A publishes a list of its slugs. |
| **What B assumes** | Every slug A sends has an entry in B's mapping, and that entry means the same thing. **Not stated anywhere:** which revision of A's slug list the mapping was built against, what happens to a slug it doesn't recognise (reject, drop, or fall back to a default), and how it handles one-to-many or many-to-one subjects. |
| **What must survive the conversion** | Which subject a lesson belongs to, the right number of lessons (nothing duplicated or missing), and any variants that A treats as part of the subject, such as tier, exam board or key stage. |
| **Acceptable loss** | Not stated. This is the main gap. |
| **Failure and recovery** | When a slug doesn't map, neither side defines what should happen or who finds out. Right now the failure goes unnoticed until teachers report it. |
| **Evidence** | Each side's format validation and tests pass. Nothing tests the two together, and nothing tests whether meaning is preserved. |
| **When to redo this analysis** | Any new revision of A or B, any change to A's slug list, or any change to B's categories. |

## 2. Does the connection hold?

**For combined science, no. Across the whole connection, it can't be decided from what was supplied.**

- Both sides passing validation only shows each is correct on its own terms. Nothing checks that the subject a teacher chooses in B means the same as the slug A sent.
- The version numbers themselves are a warning. B is at rev 2 and A is at rev 5. Nothing shows that B's mapping was ever checked against rev 5's slug list, so this pairing may never have been tested.
- The fault is limited to one subject. That points to a single slug whose relationship to B's categories isn't one-to-one. It doesn't look like a general mismatch in the data format.

## 3. Likely causes

Each of these fits the symptom while both sides still pass their tests.

| # | Likely cause | Why the tests still pass |
|---|---|---|
| C1 | **Combined science is one-to-many.** A files these lessons under `combined-science`, but B splits subjects into biology, chemistry and physics. B assigns them all to one subject, drops them, or shows them under the wrong one. | Every output is a valid subject in B. |
| C2 | **Many-to-one in the other direction.** B has one "Science" category, and A's `combined-science` lessons get mixed in with the separate-science lessons. Teachers see the wrong course's lessons. | Nothing is missing, so the format is still valid. |
| C3 | **A changed its slugs and B wasn't updated.** A renamed or split the slug somewhere between rev 2 and rev 5 (for example `science` became `combined-science`, or tier suffixes like `-foundation` / `-higher` were added). B's lookup misses and quietly falls back to a default. | B's tests use fixtures from the older slug list. |
| C4 | **Duplicates.** A lesson listed under both combined and separate science is shown twice, or removed as a duplicate under the wrong subject. | Each individual lesson is valid. |
| C5 | **A variant is lost.** B's categories have no place for tier, exam board or key stage, so foundation and higher lessons get merged. | That detail isn't a required field in B's format. |

The fastest way to tell these apart is to take one combined-science request, save A's raw response under rev 5, and compare it with B's mapping table and what B displays.

## 4. Missing evidence

- **A's official list of subject slugs at rev 5**, including how combined science relates to other subjects. This is needed to check B's mapping against it.
- **B's mapping table and the A revision it was built against.** This is needed to know whether B was ever tested against rev 5.
- **B's rule for slugs it doesn't recognise.** This is needed to confirm or rule out C3.
- **A test of the two together:** real rev 5 data in, compared against a set of lessons a subject expert has confirmed per subject. This is what would support the claim that teachers find the right lessons, which neither side's own tests can.
- **Specific teacher reports:** what they expected to see and what they actually saw. This separates wrong lessons (C1/C2), missing lessons (C3), duplicates (C4) and merged tiers (C5).

## 5. What each side needs to add

The fix belongs in each side's own contract. Patching it only in the connection code would hide the gap.

- **A (curriculum API):** State how subjects relate to each other (combined vs. separate sciences, tiers), promise slug stability or announce slug changes as versioned events, and publish the slug list as part of the contract.
- **B (teacher tool):** State which A revision the mapping targets. Handle unknown slugs explicitly by rejecting or flagging them rather than falling back to a default. Define how one-to-many and many-to-one subjects are handled, and what loss is acceptable (tier, exam board).
- **Shared:** Add a test that runs B's mapping against A's current slug list, reruns whenever either side releases, and fails when a slug is added or renamed without being mapped.

**Conclusion:** Teachers can't currently rely on B to find the right combined-science lessons. The cause is almost certainly B's mapping from A's slugs to its own subjects, not either side's own code. Which specific cause (C1–C5) needs A's rev 5 slug list and B's mapping table, compared against real rev 5 data. Once the fix is in, the question of whether B is ready for teachers again is a separate readiness check.
