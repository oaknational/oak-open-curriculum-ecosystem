# Lesson-finder integration: from the value claim to a delivery plan, then the combined-science revision

**How I'm labelling claims.** Every claim is tagged **[observed]**, **[hypothesis]**, **[promise]** or **[unknown]**. When someone *said* something, the fact that they said it is [observed], but what they said keeps its own status. The working directory is empty, so your message is the only evidence I have. I haven't seen the API spec, the schema tests, the partner's mapping or their taxonomy.

---

## 1. The value claim

| Claim | For whom | Status | Evidence |
|---|---|---|---|
| (a) "Teachers will find the right lessons faster" | Teachers using the partner's tool | **[hypothesis]** | [observed]: one teacher said so in a demo. [unknown]: whether it's true for that teacher, or any other. |
| The partner can show our lessons under its own taxonomy | The partner's tool | **[promise]** we need to set out in a contract (§2) | None yet |
| Our API gives slugs and lessons in the agreed shape | The partner's system | **[observed]** for shape only (schema tests pass) | Schema tests. I don't know whether they ran against rev 5. |

Claim (a) depends on a chain of links. Each link is a separate claim, and one being true doesn't make the next true:

1. The API conforms to its contract. [observed, shape only]
2. The mapping keeps the meaning of each subject. [unknown]
3. The tool returns the right lessons for a subject. [unknown]
4. A teacher finds the lesson they wanted. [unknown]
5. They find it faster than they do today. [hypothesis]

Some terms are undefined, and the claim can't be tested until they are:
- **"Right lessons"**: right by whose judgement, and for which course or key stage?
- **"Faster"**: compared with what they do now? No baseline exists.

**Next step:** a task-based comparison of time to a correct lesson, measured against teachers' current route. The inquiry design belongs in a separate research track. I'm not inventing a sample size or a success threshold here.

**Rule for delivery:** (a) must not be an acceptance criterion or a launch statement until it has been measured.

---

## 2. The mapping contract

**Subject:** a mapping from our subject slugs (the set in API rev 5) to the partner's taxonomy terms.

**Ownership:**
- The slug vocabulary is ours.
- The taxonomy is the partner's.
- Who owns the mapping table is **[unknown]**. This blocks the contract until it's decided.

**Concrete case:** our slug `biology` maps to the partner's "Biology". A teacher who filters on Biology sees exactly our biology lessons.

**Cases that could go wrong:**
- The combined-science slug. The target cardinality is unknown and there are no fixtures.
- A slug we add after rev 5.
- A slug we retire.
- Several of our slugs collapsing into one partner term, losing distinctions.
- A partner term with no source slug.
- Case or encoding differences in slugs.

**Obligations** (every one is a [promise] still to be adopted; none has been accepted yet):

| ID | Obligation | Evidence plan |
|---|---|---|
| MC-1 Totality | For every rev-5 slug, the partner gives either at least one target term or an explicit "unmapped" status. Nothing is dropped silently. | Checked against fixtures |
| MC-2 Meaning | Each mapped term shows the lessons a teacher of that subject expects. | A curriculum specialist reviews the fixtures. The expected answers must not be derived from the partner's own mapping. |
| MC-3 Cardinality | Each slug declares whether it maps 1:1, 1:n or n:1, and says how duplicates are presented. | Fixtures |
| MC-4 Unknown slug | An unmapped or new slug is shown as unmapped and reported to us. The tool must not crash or file it under the wrong subject. | A test with a synthetic slug |
| MC-5 Versioning | The mapping is tied to a named API revision and a named taxonomy revision. Each side gives notice before changing its vocabulary. | Contract text. The notice period is **[unknown]** and is for the owners to set. |

**Unknowns and how each is handled:**
- Combined-science mapping: **blocks** integration for science.
- Mapping ownership: **blocks** adoption of the contract.
- Whether fixtures exist for the other subjects: a **bounded investigation**. Your note implies they might, but I haven't seen any.

---

## 3. The seam between the API and the tool

**Relation:** the tool transforms our slugs into its terms and depends on our API. The endpoints are API rev 5 and the partner taxonomy at its current, unnamed revision **[unknown]**.

**Composition test:** what the API guarantees is shape: valid slugs in a valid schema. What the tool needs is meaning and completeness: every slug mapped, and mapped correctly. **Shape does not imply meaning.** From the material I have, the compatibility of the two is **undecidable**.

**Counterexamples where both sides are valid on their own but the pair fails:**
1. Combined science maps only to "Physics". Everything is schema-valid, but a teacher filtering on Chemistry never sees those lessons.
2. Combined science fans out to three subjects, and teachers see the same lessons duplicated three times.
3. We add a slug in rev 6. The mapping drops it silently, and those lessons can't be found anywhere. No error fires on either side.
4. The partner caches an old mapping, so the tool runs against a different version from ours.

**Obligations handed back to each side:**
- **Our API spec:** publish the full slug set as an authoritative list, and commit to giving notice before it changes.
- **Partner:** MC-1, MC-3 and MC-4, plus notice before *their* taxonomy changes.

---

## 4. Is it ready for integration?

- **What I assessed:** the draft mapping contract from §2, against API rev 5.
- **For what use:** the partner's tool relying on the mapping for teachers' lesson search.
- **Independence:** none. I'm assessing my own draft in the same session.
- **Who can accept it:** **[unknown]**. The owner needs to be named, probably our product owner together with the partner's integration lead.

**Findings:**

| Class | Finding |
|---|---|
| False assurance | Passing schema tests are offered as evidence that the integration works. They show shape only. |
| Misclassified claim | The partner's "complete" is presented as fact. What we have is [observed] that they said it; whether the mapping really is complete is [unknown]. |
| Misclassified claim | (a) reads as a benefit. It is a [hypothesis]. |
| Stale or missing evidence | No combined-science fixtures. I also can't tell whether the schema tests ran against rev 5. |
| Material omission | No defined behaviour for unknown slugs, no mapping owner, and no notice obligation on either side. |
| Unresolved unknown | The cardinality of the combined-science mapping. |

**Disposition: not ready for integration reliance.** It is ready for discussion.

**What would change that:**
- The fixtures are reviewed by a curriculum specialist and pass.
- MC-1 to MC-5 are adopted by named owners.
- There is a test for unknown-slug handling.

**Reassess** when either side's vocabulary changes, when the evidence changes, or when the intended use changes.

---

## 5. Delivery plan

This is a sketch. It needs owner ratification before it governs any work. The plan-node schema and templates aren't in this workspace, so I haven't written or validated a plan file.

- **Goal:** teachers using the partner's tool can reach our lessons under the correct subject, and no lessons disappear silently.
  - The speed claim (a) is out of scope for go-live.
- **Mechanism:** agree the fixtures and contract tests at the seam, so that mapping errors show up before teachers meet them.

**Acceptance criteria, each with its proof type:**
1. The API returns exactly the published rev-5 slug set. *(repo-safe: a contract test)*
2. For every slug, the partner's mapping matches the fixture that the specialist reviewed. *(owner-held: a partner-run test result, recorded with a date)*
3. A synthetic slug comes out as "unmapped" and gets reported to us. *(owner-held, recorded the same way)*

**Slices, in order:**
1. Publish the slug set.
2. Specialist writes the fixtures, including combined science.
3. Partner runs the contract tests.
4. Test the unknown-slug behaviour.
5. Add notice obligations to both sides of the contract. The owners decide whether this counts as a new API revision.
6. Separate track, not part of go-live: the inquiry design for (a).

**Owner gates:**
- Name the mapping owner and the acceptance authority.
- Set the notice period.

Each gate needs a fixed expiry date. I'd propose 2026-10-11, but the owners set it.

**Out of scope:** any claim that teachers find lessons faster, and any change to the partner's own taxonomy.

---

## 6. The revision: the partner splits combined science into three subjects, with immediate effect

**Status of the revision itself:**
- [observed]: the partner has announced the split.
- [unknown]: what the three new subjects are, whether the old "combined science" term still exists, and whether the tool is already live and serving teachers.

I'm not assuming the three are biology, chemistry and physics.

**§1 Value**
- (a) is still a [hypothesis], and now weaker for science teachers.
- New possible harm [hypothesis]: teachers who teach combined science as one course may find nothing, or only scattered pieces, under the new subjects.

**§2 Contract**
- The partner's "complete" claim is now **stale**. It was about the old taxonomy, and nobody has assessed it against the new one. That doesn't make it false.
- For combined science, the contract must now say 1:3.
- Key question **[unknown]**: can our lesson data tell which discipline a combined-science lesson belongs to?
  - If it can't, the slug alone can't carry the meaning the new subjects need. That returns an obligation to *our* API, which would possibly need a new field and so a new revision (rev 6). That's a decision for the owners, not an assumption.
- The missing notice obligation (MC-5) is no longer a theoretical gap. The partner just made a change with immediate effect and no notice.

**§3 Seam**
- The seam is reopened.
- For combined science, the pair **fails** unless the partner already has a transitional mapping; whether it does is [unknown].
- New counterexample: API rev 5 hasn't changed and our schema tests still pass, yet combined-science lessons may already be unmapped or misfiled. This is the clearest demonstration that schema tests can't vouch for the seam.

**§4 Assessment**
- The earlier assessment isn't evidence about the new taxonomy revision.
- The disposition stays **not ready**, with a new finding: a counterparty changed its vocabulary without notice, which confirms the material omission.
- A reassessment trigger has fired.

**§5 Plan**
- The combined-science fixtures in slice 2 must be written against the new taxonomy.
- New bounded investigation: whether our lesson data can support a split by discipline.
- New owner gate: how to handle combined science. My recommendation is to take it out of the first go-live scope. Ship the other subjects once their fixtures pass, and make combined-science lessons show explicitly as unmapped so they don't vanish silently.
  - That's the only option that doesn't depend on unknowns. Fanning out to all three duplicates lessons. Classifying each lesson may need API rev 6.

**Immediate step for you (I haven't contacted anyone):** ask the partner three things:
1. Is the tool live?
2. What is it doing with combined-science slugs right now?
3. What are the three new subjects, and what is the taxonomy revision identifier?

Until they answer, whether teachers are affected today stays **[unknown]**.
