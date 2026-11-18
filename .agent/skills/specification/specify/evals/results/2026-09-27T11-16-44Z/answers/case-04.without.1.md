There's no code in the working directory (`cwd` is empty), so I couldn't find the actual mapping or reproduce the bug. The contract below is written against the problem as you described it. Anything I'm assuming is marked **[confirm]**.

---

# Subject-Mapping Contract: Curriculum API ↔ Consuming Tool

## 1. Scope

This contract covers how the tool turns the API's subject slugs (the keys in the lessons response) into its own subjects. It doesn't change either side's schema. It pins down what the existing fields mean and adds one shared artifact: the mapping table (§5), which is data, not schema.

Key words: **MUST**, **MUST NOT**, **SHOULD** as in RFC 2119.

## 2. Likely causes of the combined-science bug

The contract is written to rule out each of these. Checking the tool's code should show which one is actually happening.

| # | Likely cause | Clause that rules it out |
|---|---|---|
| A | Fuzzy matching: a prefix, substring, or token match on `science` catches `combined-science` or the reverse | §3.2 |
| B | 1→1 mapping: `combined-science` is squeezed into one tool subject (e.g. Physics), or the last mapping written wins | §4.1 |
| C | Unknown or new slugs (e.g. exam-board variants) fall back to a default subject | §4.3 |
| D | The same lesson appears under both `combined-science` and `biology`, so teachers see duplicates or wrong counts | §3.4, §4.4 |
| E | The API added or renamed a slug and nobody told the tool | §6 |

## 3. What the API owes

**3.1 Slug registry.** The API MUST publish every subject slug it can return. Each entry gives the slug, a human-readable name, a one-sentence definition, and a status (`active` / `deprecated`). Combined-science slugs MUST say what they cover (e.g. "biology, chemistry and physics content for the double-award GCSE") **[confirm the actual slugs and whether exam-board variants exist]**.

**3.2 Slug identity.** Slugs are opaque, case-sensitive identifiers. Two slugs are the same subject only if they are byte-for-byte equal. The API makes no promise that slug text is meaningful: `combined-science` is not a kind of `science` because it contains the word.

**3.3 Stability.** An `active` slug MUST NOT be renamed or reused for a different meaning. Renaming means adding a new slug and deprecating the old one (§6).

**3.4 Multiple keys.** The API MUST state whether one lesson can appear under more than one subject key. If it can, the lesson ID MUST be identical under every key, so consumers can deduplicate. **[confirm current behaviour]**

**3.5 Completeness.** Every key in a response MUST be in the registry. A slug that isn't in the registry is a bug on the API side.

## 4. What the tool owes

**4.1 Mapping cardinality.** The tool MUST map each API slug to a *set* of tool subjects: zero, one, or many. It MUST NOT assume one slug maps to one subject. For combined science:
- If the tool has its own combined or general science subject, `combined-science` maps to that subject and only that subject.
- If it doesn't, `combined-science` maps to all of {Biology, Chemistry, Physics}. It MUST NOT be collapsed into any one of them.
- **[decision needed]** Should teachers browsing Physics see combined-science lessons? This is a product call. Record the answer in the mapping table (§5); don't hard-code it.

**4.2 Exact matching only.** The tool MUST look up slugs by exact equality against the mapping table. No prefix, substring, regex, stemming, or matching on display names.

**4.3 Unknown slugs.** If a slug isn't in the mapping table, the tool MUST NOT show its lessons under any subject. It MUST log or alert on it, and it MUST NOT fall back to a default or "closest" subject. Hiding lessons can be fixed quickly. Showing them under the wrong subject misleads teachers and is hard to spot.

**4.4 Deduplication.** When one lesson ID reaches the same tool subject through more than one slug, the tool MUST show it once.

**4.5 Deprecated slugs.** The tool MUST keep mapping a deprecated slug until its removal date (§6).

## 5. The shared mapping table

- One version-controlled data file, e.g. `subject-mapping.csv` with columns `api_slug, tool_subject_id, notes`. A slug that maps to several subjects gets several rows. A slug that deliberately maps to nothing gets one row with an empty `tool_subject_id`.
- **Owner:** the tool team, because the target taxonomy is theirs. **Required reviewer:** the API team, who confirm every registry slug is covered.
- Every `active` and `deprecated` registry slug MUST have at least one row. That can be an explicit "maps to nothing" row, so an omission can't be mistaken for a decision.

## 6. Change management

- The API MUST give **[N, e.g. 20 working days]** notice before adding, deprecating, or removing a slug, through **[channel]**.
- A new slug MUST NOT appear in production responses until the mapping table has a row for it. Until then the tool treats it under §4.3 (hidden and alerted, not guessed).
- Deprecated slugs stay valid for at least **[N]** days before removal.

## 7. Conformance checks

1. **Coverage (CI on both sides):** registry slugs minus mapping-table slugs must be empty.
2. **Golden fixture:** a fixed API response containing `combined-science`, `biology`, a lesson listed under two keys, and an unknown slug. The expected tool output is written into the fixture:
   - combined-science lessons land exactly where §4.1 says
   - no lesson appears twice
   - the unknown slug's lessons are hidden and an alert fires
3. **Negative test:** a slug named `science-fiction` or `combined-sciences` MUST NOT map to anything science-related. This catches fuzzy matching (cause A).

## 8. Open items to settle before signing off

1. The actual list of combined-science slugs, including any exam-board variants.
2. Whether the API currently lists one lesson under several keys (§3.4).
3. Whether the tool's taxonomy has a combined or general science subject, and the product decision in §4.1.
4. Notice period and communication channel (§6).

---

The quickest way to find the real cause is to look at the tool's slug-lookup code for fuzzy matching or a default fallback (causes A and C), and at whether its mapping is stored as a one-to-one dict (cause B). If you point me at either codebase, I can check it against §2 and save this as a file in the repo.
