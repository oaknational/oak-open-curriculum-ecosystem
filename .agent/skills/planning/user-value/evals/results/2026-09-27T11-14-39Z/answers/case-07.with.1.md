I checked the working directory and it's empty: there's no API spec, mapping code, backlog or research to look at. Everything below comes from your description alone. Each claim is marked as either **stated** (you told me) or a **hypothesis** (still needs evidence). I haven't named the subjects that break or the tool's mapping rule because I haven't seen them.

## 1. Purpose, boundary and what we know

- **Whole system:** a teacher finding resources through a consuming tool that reads the curriculum-data API.
- **Parts the API team can change:** unknown. It matters, because the most likely fix is in the tool, and that may belong to another team or organisation.
- **Stated:** the API passes its schema tests, and teachers can't find resources.
- **Hypothesis:** that the tool's subject mapping is *the* cause. It may be one cause among several: search design, teachers' own words for subjects, or gaps in content coverage.

The key distinction: a schema test shows the **shape** of the response is right. It shows nothing about whether the **meaning** of a subject survives the trip to the teacher. Passing those tests is the first of six separate claims (conformance, working service, usable interface, teacher gets what they came for, measured outcome, proven cause). It doesn't support any of the other five.

## 2. Use value at each level

| Level | Who uses what | To accomplish what | Conditions and limits | Evidence that fits this level |
|---|---|---|---|---|
| **Teacher task** (use and experience) | A teacher planning a lesson or unit | Find resources that fit the subject, key stage/year and topic they're teaching, in their own words, fast enough to be worth it | Teachers' terms vary: "RE" vs "Religious Education", "Science" vs "Biology", subjects split by exam or pathway. They need to tell "nothing exists" apart from "I searched wrongly". | Watching real search tasks, logs of zero-result and abandoned searches, support tickets. **None cited yet, so this row is a need hypothesis.** |
| **Consuming tool** (capability) | The tool, working on the teacher's behalf | Turn what the teacher selects or types into the API's subject identities and back, with nothing lost | The tool's taxonomy may be flatter or older than the API's. Its mapping is where meaning is currently lost (stated). | Integration checks against real subject cases. Compare what the tool shows with what the API holds for the same query. |
| **API contract** (contract and responsibility) | The tool team, as developers and a system | Rely on each subject having a stable identity and a published meaning: ID, preferred label, alternative labels, parent/child and key-stage scope, and what happens on deprecation or rename | Today the contract probably guarantees **shape** only. Whether it guarantees **meaning** is unknown, and that is the API's possible share of the problem. | Contract tests on meaning, not just shape: stable IDs across releases, a declared hierarchy, alternative labels present, rename/retire rules. Plus a boundary check that the tool actually uses these. |
| **Implementation** (realisation) | API code and data, and the tool's mapping code | Deliver the guarantees above | Local correctness in either part doesn't prove the two work together | Unit and contract tests, which only tell you each part matches its own declared scope |

## 3. Where the meaning is probably lost

Likely failure modes at the tool/API boundary. All are hypotheses, and each needs checking against real data:

1. **Label matching instead of ID matching:** a renamed subject silently stops matching.
2. **Flattening the hierarchy:** for example, Biology, Chemistry, Physics and Combined Science all collapsed into "Science", or the reverse, so a search misses the children.
3. **Ignoring key-stage scope:** the same subject name means different content sets at different stages.
4. **Many-to-one or unmapped values dropped silently:** no warning, and the teacher sees "no results".
5. **Teacher vocabulary never mapped at all:** synonyms exist in the API but the tool doesn't use them, or they don't exist anywhere.

To decide who owns each one, ask: **could a careful consumer have preserved the meaning using only what the API publishes?**
- **Yes:** the fix belongs in the tool. The API may still want to improve its guidance.
- **No** (IDs aren't stable, the hierarchy isn't exposed, or there's no rename policy): the API contract has a real gap. The schema tests can't show that gap, because the missing guarantee was never part of the schema.

It will probably be split. Treat it as a shared boundary, not a hand-off of blame.

## 4. Candidate work (none of it ready yet)

| ID | Level | Change | Link | Lifecycle |
|---|---|---|---|---|
| E1 | Teacher | Find out where teachers' searches fail, and why: gather zero-result and abandoned queries, and observe a small set of real planning tasks | Tests need N1 | Research, next |
| S1 | Tool | Map subjects by stable ID, keep the hierarchy and key-stage scope, and show "no match" visibly instead of dropping it | Addresses N1, relies on C1 | Candidate. Blocked on who owns the tool and on an agreed set of cases. |
| S2 | Tool | Map teacher terms (synonyms and older names) to API subject IDs | Addresses N1 | Candidate. Needs E1 to learn which terms matter. |
| C1 | API | Write meaning guarantees into the contract: ID stability, preferred and alternative labels, hierarchy, scope, deprecation and rename rules | Enables S1 and S2 | Candidate, **only if** the §3 ownership test shows a gap |
| T1 | Boundary | Shared set of subject cases drawn from real failures (renamed, nested, scope-split, synonym, unmapped), run end to end from API through tool to results | Evidence for S1, S2 and C1 | Candidate. This is the missing test. |

- **N1** (need hypothesis): a teacher needs to find resources matching what they teach, described in their own terms, so they can plan without repeating searches or giving up.

**Acceptance for S1/S2 (outcomes):** for every case in T1, the tool returns the resources the API holds for the matching subject IDs and scope. Unmapped values are surfaced, not dropped.

**Checking method:** run T1 end to end. That proves the boundary works. It does **not** prove teachers now find resources; that needs E1-style observation after release.

## 5. Traceability and gaps

- N1 → S1, S2 (these address the need) → C1 (enables them) → API and tool code (realise it).
- None of these links shows that teachers now succeed.
- **Uncovered:** the teacher who searches for something that doesn't exist needs an honest "nothing exists" result. That's separate from the mapping fix.
- **Unknown:** other consumers of the same API that may have the same mapping problem.
- **Outcome hypothesis:** keeping meaning intact through the mapping should reduce failed searches. Other explanations to rule out: search ranking, content coverage and interface design.
- **What would change this model:** evidence that failures come mainly from teacher vocabulary or content gaps, not from mapping.

## 6. Review and limits

I reviewed this myself in the same session; nobody independently challenged it.

**Where the story still passes while the teacher fails:**
- S1 can pass while the teacher's search still fails, if the real gap is vocabulary (S2) or content.
- A shared test set built only from API-side cases would miss the teacher's own terms.

**Burden to watch:** if C1 isn't done, the tool team carries the whole cost of working out subject meaning.

**Next actions:**
1. Name who owns and has authority over the tool.
2. Pull 20–50 real failed searches and trace each one from API through the tool to the results. That's the cheapest evidence that tells the §3 failure modes apart.
3. Apply the ownership test from §3 to decide whether C1 is needed.
4. Only then mark S1 and T1 ready.

If you can point me to the API spec, the tool's mapping code or search logs, I can check these hypotheses against the real material.
