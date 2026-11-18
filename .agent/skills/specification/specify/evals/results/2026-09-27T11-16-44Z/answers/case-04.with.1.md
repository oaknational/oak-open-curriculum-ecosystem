I wrote the contract as a spec below. I couldn't check it against real data: the working directory is empty and I have no write access, so I haven't seen either schema, the actual slug list, the tool's subject list, or any of the teacher reports. Slugs like `combined-science` are examples only, and the missing facts are listed as open questions in §7 rather than guessed. The spec is returned here rather than saved to a file.

---

# SMC-1: Subject-mapping contract, curriculum API ↔ consuming tool

**Revision:** 0.1 · **Status:** Proposed. Neither side has agreed to it yet · **Subject kind:** A contract on meaning between two systems. It adds no fields to either schema.
**Where it should live (proposed):** One versioned document, plus a machine-readable mapping file and test cases that both teams own. It links to each side's schema and never copies it.

## 1. Purpose and parties

- **Purpose:** A teacher who picks a subject in the tool should see exactly the lessons that belong to that subject, even though the API and the tool group subjects differently.
- **Parties:** the API team (supplies lessons keyed by subject slug) and the tool team (turns our slugs into its own subjects).
- **Affected people:** teachers, who can't see the mapping and decide what to teach based on what they're shown.
- **Why this is the pain point:** Neither schema says what a slug *means*. Combined science is where the two subject lists stop lining up one-to-one: one combined course covers three separate sciences, and "science" can mean different things at different school stages.

## 2. Scope

- **Covers:** what each slug means, the set of slugs, how slugs map to the tool's subjects (including one slug mapping to several subjects), unmapped and changed slugs, duplicate lessons, and how changes are announced.
- **Excludes:** the shape of either schema, how lessons are fetched or paged, whether the lessons themselves are any good, and how the tool ranks them.

## 3. Example cases

Every rule in §4 has to decide each of these cases.

**Success case:** The API returns lesson L1 under `combined-science` (secondary, ages 14–16). The mapping file says `combined-science` → tool subject *Combined Science*. A teacher filters by *Combined Science* and sees L1 exactly once. A teacher filtering by *Physics* only sees L1 if the mapping says so explicitly.

**Failure cases:**

| # | Case | What exposes it |
|---|---|---|
| F1 | The tool files `combined-science` under a broad *Science* bucket, alongside science for younger pupils | The school stage is lost |
| F2 | The tool matches on text, so `computer-science` or `social-science` land in *Science* | Guessing from the name instead of an agreed list |
| F3 | A combined-science lesson on a physics topic is mapped to *Biology* because the whole slug is mapped to one science | One slug covering several subjects is collapsed wrongly |
| F4 | The API adds a new slug (e.g. a higher-tier variant) and the tool drops those lessons without saying so | An unmapped slug leads to missing results |
| F5 | L2 comes back under both `physics` and `combined-science`, both map to *Physics*, and the teacher sees it twice | No rule for duplicates |
| F6 | The API quietly narrows what `combined-science` covers | The meaning changes without a new version |
| F7 | The two sides disagree about whether L3 belongs in *Chemistry* | There's no named way to settle a dispute |

Which of these teachers are actually hitting is **unknown** (see U1).

## 4. Obligations

**API side**

- **A1: Definition for every slug.** For every slug it can return, the API team must publish a definition in the contract document: the subject, the school stages covered, and whether it is a combined subject (and if so, which separate sciences it covers). A combined slug must list its separate sciences. *How to check:* a domain reviewer confirms each definition against the curriculum.
- **A2: Complete slug list.** The API must never return a slug that isn't on the published list. *If it does:* the tool applies T3, and the API team treats it as a contract defect.
- **A3: Rule for lessons under several slugs.** The API team must state whether a lesson can appear under more than one slug. For combined science specifically, it must say whether combined-science lessons also appear under `biology`, `chemistry` or `physics`. *Currently unknown (U2).*
- **A4: Notice of changes.** Any new, removed or renamed slug, or a changed definition, must come with a new contract version. The tool team gets it at least **[N days — both sides to agree]** before the change reaches production. The old meaning is never reused under the same slug.

**Tool side**

- **T1: Map only by the agreed table.** The tool must map slugs using only the versioned mapping file. It must not guess from slug text, prefixes or name similarity (this rules out F2).
- **T2: One slug can feed several subjects.** The mapping may send one slug to several tool subjects, or several slugs to one. The tool must not collapse a combined slug into one separate science, or into a subject that spans other school stages, unless the table says so explicitly (this rules out F1 and F3).
- **T3: Unmapped slugs are reported, not dropped.** For a slug with no entry in the table, the tool must not assign a subject by guessing. It must keep those lessons out of subject-filtered results, log the slug and how many lessons it affected, and alert the tool team. Whether teachers also see an "Unmapped" section is the tool team's choice (see §5).
- **T4: No duplicates within a subject.** If one lesson reaches the same tool subject through several slugs, the tool shows it once. Lessons are matched by their API lesson ID (this rules out F5).
- **T5: Keep the API slug.** The tool must keep each lesson's original API slug alongside its mapped subject, so any wrong placement can be traced back to a specific row in the table.

**Shared**

- **S1: The mapping file is the only source.** Each row reads: slug → one or more tool subjects, plus stage limits if any. Changes to the file are versioned and need approval from both sides (see §6). Neither side keeps its own private copy.
- **S2: Agreed test cases.** Both sides keep a test set that covers F1–F6 and at least one real lesson per combined-science slug. The expected answer for each case comes from a science curriculum reviewer, never from running the tool's current mapping.

## 5. Left open deliberately (don't rely on these)

- How the tool orders lessons, and what it calls its subjects.
- Whether teachers can see an "Unmapped" section (T3 only requires that nothing is guessed or silently lost).
- What order the API returns slugs or lessons in.
- Whether the tool shows the API slug to teachers (T5 only requires that it's kept).

## 6. Who decides what

| Decision | Holder |
|---|---|
| What a slug means (A1–A4) | API team |
| The tool's subject list | Tool team |
| Mapping file rows (S1) | Both teams, with a named reviewer from each |
| Disagreements about where a lesson belongs (F7) | **Unknown (U4).** Proposed: a science curriculum lead |

## 7. Open questions and how each is handled

| # | Unknown | Treatment | Consequence |
|---|---|---|---|
| U1 | Which failure cases teachers are actually hitting | **Investigate first:** collect 3–5 teacher reports with lesson IDs, the tool subject shown, and the API slug. Limit: diagnosis only, no mapping changes | This shows which rules are breached now. Combined-science mapping fixes wait for the result |
| U2 | Whether combined-science lessons also appear under the separate-science slugs (A3) | **Blocks** T2/T4 rows for combined science until the API team answers | Without the answer, the duplicate rule and the mapping rows can't be finalised |
| U3 | The tool's subject list, and whether it separates combined from separate sciences and by school stage | **Blocks** S1 rows for science until the tool team publishes it | Without it, the rows can't be written |
| U4 | Who settles disputes | Must be named by someone who has authority over both teams. **Blocks** adoption, not discussion | Without a named person, F7 can't be resolved |
| U5 | The notice period in A4 | Both sides agree a number | Until then, any slug change is a risk both sides have to accept explicitly |

## 8. Evidence plan

| Claim | How it's checked | Limit |
|---|---|---|
| Every returned slug is on the published list (A2) | Automated check of API output against the list | Shows the slug is known, not that its definition is right |
| The mapping keeps meaning intact (T1–T2, S1) | The S2 test cases and a domain review of every science row | Only covers the cases written down, and a shared mistake can pass on both sides |
| Unmapped slugs are reported, not dropped or guessed (T3) | Inject a made-up slug and check that the log and alert fire and nothing is filed by guesswork | Assumes someone watches the alert |
| No duplicates within a subject (T4) | Test case F5 | — |
| Teachers get the right results | **Not covered by this contract.** Needs follow-up with teachers after the fix | Passing the contract's tests doesn't prove it's useful to teachers |

## 9. Changes and failures

- A new slug, a changed definition, or a new tool subject means a new contract version and an S2 test run before release.
- If a live mismatch is found, fix the mapping file row, not code on either side. T5 lets you find every lesson placed under the old row.
- Reopen this contract if the tool adds another data provider, the API changes how it groups lessons, or U1 turns up a failure that F1–F7 don't cover.

---

**Status:** Ready to discuss. It is **not** ready to implement until U2 and U3 are answered, and not ready to adopt until U4 is.

**Next steps:**
1. Run the U1 check on the teacher reports first. It's cheap and shows which of F1–F6 is actually happening.
2. Get both teams to answer U2 and U3.
3. Once the rows are settled, turning S2 and the A2 check into automated tests is ordinary implementation work.
