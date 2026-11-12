I checked the working directory first. It's empty: there's no API spec, test suite, mapping file or fixtures to look at. So everything below rests on your brief. Where I label something **observed**, it means "observed as you reported it". I haven't verified any of it myself.

**Status labels:** **Observed** = directly evidenced. **Hypothesis** = plausible but untested. **Promise** = someone has committed to or asserted it, with no evidence we can inspect. **Unknown** = no evidence either way.

---

## 1. The value claim: what, for whom, on what evidence

| # | Claim | Who benefits | Status | Evidence we actually have |
|---|---|---|---|---|
| a | "Teachers will find the right lessons faster" | Teachers using the partner's tool; indirectly us (reach) and the partner (product value) | **Hypothesis** | **Observed:** one teacher said so in a demo. That shows one person's impression, not a result. Demos use curated paths, and there's no baseline, measurement or sample. |
| b | Partner's mapping is "complete" | Partner (the claim); teachers depend on it | **Promise** | **Observed:** the partner used the word "complete". **Observed:** no combined science fixtures exist. So there's direct evidence of at least one untested area. Whether the mapping is actually complete is **unknown**. |
| c | Our API's schema tests pass | Us; the partner relies on it | **Observed** (limited scope) | This shows the responses have the right shape. It says nothing about whether slugs are correct, stable or mapped. |
| – | API contract settled at revision 5 | Both sides | **Observed** (as reported) | Whether rev 5 carries everything the mapping needs is **unknown** (see §3). |

**What the claim actually depends on:** (a) can only be true if (b) is true in practice and the seam in §3 doesn't lose lessons. (c) is necessary for that but nowhere near enough. None of the three items is evidence for (a).

**What would count as evidence for (a):** a baseline time-to-find and find-success rate for teachers in their current workflow, compared with the same measures in the integrated tool, across subjects including combined science. Until then, call (a) a hypothesis in every document, and not an outcome.

---

## 2. The mapping contract (to be written; none exists yet)

The mapping is its own contract, separate from API rev 5. The API promises what we emit. The mapping promises what the partner does with it. Proposed terms:

1. **Domain:** every subject slug our API can emit under rev 5, taken as an enumerated list from our side. Whether such a list already exists is **unknown**. If it doesn't, producing it is the first deliverable.
2. **Codomain:** the partner's taxonomy IDs, at a named taxonomy version.
3. **Totality:** every slug in the domain has an explicit entry. "Complete" means exactly this, and it's checked by a test, not asserted.
4. **Cardinality is stated per entry:** 1:1, N:1 (several of our slugs to one partner subject), 1:N (one slug to several subjects, which needs a stated rule for choosing), or `unmapped` (a deliberate exclusion, with a reason).
5. **Unknown-slug behaviour:** when the partner meets a slug that isn't in the table, it must fail visibly (logged and reported to us). It must not silently drop the lesson. This is the most important clause.
6. **Versioning:** the mapping table names both our API revision and the partner's taxonomy version. A change on either side creates a new mapping version.
7. **Change notice:** a minimum notice period in both directions for slug or taxonomy changes, plus an emergency path. Nothing like this is agreed today (**unknown / probably absent**).
8. **Ownership:** the partner owns the table. We own the domain list and the fixtures that exercise every entry.
9. **Acceptance:** shared contract tests. Our fixtures, covering every slug including combined science, go through the partner's mapping and are checked against expected targets that both sides sign off.

---

## 3. The seam between our API and the partner's tool

The API sends slugs out; the partner's mapping turns them into its taxonomy; the tool shows lessons to teachers. Each stage can fail in its own way:

| Failure mode | Where it happens | Would our schema tests catch it? | Would anyone notice? | Status |
|---|---|---|---|---|
| Slug not in the partner's table, lesson silently dropped | Mapping | No | No. Teachers just don't see the lessons. **This silently works against (a).** | **Unknown** whether it happens today; combined science is the obvious candidate |
| Slug mapped to the wrong subject | Mapping | No | Only if a teacher complains | **Unknown** |
| 1:N slug resolved arbitrarily | Mapping | No | Unlikely | **Unknown** |
| We add or rename a slug within rev 5 (is our slug list fixed by the contract or only by the data?) | API | No, if the schema allows any string | No | **Unknown**: need to check whether rev 5 enumerates slugs or just types them as strings |
| Partner caches an old mapping or taxonomy | Tool | No | No | **Unknown** |
| Format differences (case, whitespace, encoding) | Seam | Maybe | Only as unmapped lessons | **Unknown** |

**What stands out:** everything our side can currently show (the schema tests) sits upstream of where the value is won or lost. The risky part is the meaning of the mapping, and nobody owns a test for it today.

---

## 4. Is the record ready for the integration to rely on?

**No.** Here's the record as it stands:

- **Observed:** the contract is at rev 5; schema tests pass; the partner called the mapping "complete"; one teacher gave positive feedback in a demo; no combined science fixtures exist.
- **Missing:** an enumerated slug domain, a mapping table we can inspect, fixtures for combined science (and possibly other subjects; coverage is **unknown**), agreed unknown-slug behaviour, a change-notice agreement, a baseline for (a).

**Readiness gates. Each needs evidence, not an assertion:**
1. Slug domain list published and tied to rev 5.
2. Mapping table received, versioned, and covering the full domain, with combined science explicitly included.
3. Contract tests passing against fixtures for every slug.
4. Unknown-slug behaviour shown in a test, by sending a deliberately unmapped slug and seeing it reported.
5. Measurement plan for (a) agreed, with a baseline captured before launch.

---

## 5. Delivery plan

| Step | Output | Owner | Exit evidence |
|---|---|---|---|
| 1 | Enumerate every subject slug rev 5 can emit; confirm whether rev 5 fixes the list or only the type | Us | A slug list checked against production data |
| 2 | Write combined science fixtures, plus fixtures for any other slug without them | Us | Fixture set covering 100% of the domain |
| 3 | Get the partner's mapping table as data, at a named taxonomy version | Partner | A file we can diff, not the word "complete" |
| 4 | Run the fixtures through the mapping; list unmapped, 1:N and suspicious entries | Both | Coverage report |
| 5 | Agree the mapping contract terms from §2 | Both | A signed revision of the contract document |
| 6 | Shared contract tests in CI on both sides, including the unknown-slug test | Both | Green runs, plus an intentional failure that shows the alarm works |
| 7 | Capture a baseline for (a): time-to-find and success rate for a sample of teachers across subjects | Us + partner | A baseline dataset |
| 8 | Staged launch, then the same measurement repeated | Both | Before/after comparison. Only at this point can (a) move from hypothesis to observed (or be refuted). |
| 9 | Monitoring: count of unmapped slugs, zero-result searches per subject | Partner, reported to us | A dashboard or regular report |

Steps 1–2 and 3 can run in parallel. Step 4 gates everything after it.

---

## 6. The revision: the partner splits "combined science" into three subjects, with immediate effect

**Status of the revision itself:** **observed** that the partner announced it. What the three subjects are called and how they're defined is **unknown** to me. I'm not assuming, for example, that they are biology, chemistry and physics.

Tracing it through each section:

**§1 Value claim**
- (a) stays a **hypothesis**, but for teachers of combined science it's now more at risk. They are the ones most likely to see missing or mis-sorted lessons.
- (b) The "complete" promise applied to the old taxonomy. Against the new one it has **no standing** until it's reissued. The fact that combined science had no fixtures has become the exact spot where the change lands.
- (c) The schema tests still pass (**observed**, assuming nothing else changed). That's proof they can't detect this kind of change, and should be written up that way.

**§2 Mapping contract**
- Combined science changes from (presumably) 1:1 to **1:N**. Our old mapping entry is now either invalid or pointing at a subject that no longer exists (**unknown** which).
- A 1:N entry needs a rule for choosing. The subject slug alone can't decide which of the three a lesson belongs to. That needs information at lesson level: a discipline or component tag, or topic codes.
- The missing change-notice clause (§2 item 7) has now actually been triggered. "Immediate effect" is exactly the situation that clause exists to prevent.

**§3 Seam**
- The key open question: **does API rev 5 expose anything per lesson that separates the three new subjects?** This is **unknown**, and I can't check it without the spec.
  - If yes: the partner can update its mapping to use that field, and rev 5 stays settled.
  - If no: either the partner maps combined science lessons by hand or heuristically on their side (you'd need to judge that quality risk), or **rev 5 has to be reopened** to add the field. "Contract settled" would then no longer hold.
- Whether the tool is live: **unknown**. If it is, combined science lessons may be dropped or misfiled in production right now. That makes this an incident to triage, not just a planning change.

**§4 Readiness**
- Goes backwards. Gate 2 fails for combined science by definition, and gate 3 can't pass without fixtures that don't exist yet. The other subjects' readiness is unaffected, **if** the split was confined to combined science. That scope is a partner statement we haven't verified, so treat it as a **promise**.

**§5 Plan changes**
- **New step 0 (now):** ask the partner (i) whether the tool is live, and if so, what happens to combined science lessons today; (ii) the new subject IDs and definitions; (iii) confirmation that nothing else in the taxonomy changed.
- **Step 1, extended:** check whether rev 5 exposes a lesson-level field that can split combined science. Decide whether to keep rev 5 or open rev 6.
- **Step 2, sharpened:** combined science fixtures must include lessons that belong clearly to each of the three new subjects, plus ambiguous or cross-cutting ones.
- **Step 5, extended:** add a 1:N rule for combined science and put the change-notice clause at the top of the list.
- **Step 7:** measure combined science separately in the baseline, since the split affects that group of teachers first.
- **Decision for you:** you can launch without combined science (other subjects only, combined science explicitly `unmapped` and visible as such), or hold the whole launch. I'd launch without it, provided unknown-slug handling is proven first. Otherwise "excluded" slides back into "silently dropped".

---

**Bottom line:**
- The only things observed are the schema tests, the rev 5 contract, the partner's use of the word "complete", one teacher's comment, and the missing combined science fixtures.
- The faster-lesson-finding value is a hypothesis.
- Mapping completeness is a promise that the revision has now made void.
- Whether rev 5 can support the split is the main unknown that decides what happens next.
