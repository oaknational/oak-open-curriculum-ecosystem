# Seam analysis: curriculum API (A, rev 5) → teacher tool (B, rev 2)

**Status: the connection fails.** Teachers cannot rely on it to find the right double-award lessons. Two separate faults cause this. Updating B's mapping table fixes only one of them.

## 1. Seam contract

| Field | Content |
|---|---|
| Relation | B **transforms** A's subject slugs into B's subject taxonomy |
| Endpoints | A: curriculum API **rev 5**. B: teacher-facing tool **rev 2**, whose mapping table was **built against A rev 3** |
| Purpose / intended reliance | A teacher, including a double-award teacher, finds every lesson relevant to what they teach, filed under the right subject |
| Producer (A) supplies | Lessons keyed by one slug from {biology, chemistry, physics, combined-science}. A combined-science lesson covers content from all three sciences |
| Consumer (B) assumes | Every incoming slug has an exact-match entry in a table built for rev 3. Every lesson belongs to exactly one of {Biology, Chemistry, Physics} |
| What must be preserved | That the lesson reaches the teacher at all (identity), and its subject meaning. For combined-science, that meaning is "belongs to all three sciences, for the double-award course" |
| Permitted loss | None is stated. The silent drop is lossy behaviour that nobody declared |
| Failure behaviour | A: not stated. B: an unmapped slug is **dropped silently**, with no rejection, log or count |
| Evidence | Each side's schema validation and tests. Both are local checks. No test runs across the seam, and none compares a revision pair |
| Change triggers | Any change to A's slug set or revision, to B's taxonomy, to the mapping table, or to the intended users (e.g. adding double-award teachers) |

## 2. Why it fails

**Fault 1: B's taxonomy cannot represent the combined-science slug.** B's model is one lesson, one science. A combined-science lesson belongs to three sciences at once, and to a course B doesn't model. A correct, up-to-date exact-match table still leaves B only two options:
- **Map it to one science.** The lesson is filed under the wrong science for two-thirds of its content. That is the "filed under the wrong science" report.
- **Leave it unmapped.** The lesson is dropped silently. That is the "missing" report.

Either way the output still passes B's schema, but the meaning is gone. So this is not a stale-table bug. The two taxonomies don't match, and an exact-match table can't bridge them.

**Fault 2: the table was built for A rev 3, but A is now on rev 5, and nothing reconciles them.** B mapped against rev 3 and does not declare which A revision it supports. Whatever changed in revs 4–5 (new or renamed slugs, including possibly how combined-science is spelled or scoped) misses the exact match and is dropped without any signal. This pair of revisions has never been tested together.

**Why nobody caught it:** each side passes its own schema and tests. That shows each is correct locally, not that the composition works. Because the drop is silent, B's tests can pass while lessons go missing.

## 3. Counterexamples (each side valid on its own, the pair fails)

1. **Unmapped combined-science lesson.** A emits it correctly. B has no entry, drops it, and passes its tests. The double-award teacher sees nothing. → **fails**
2. **Combined-science mapped to one science** (say Biology). A double-award teacher looking under Chemistry misses it. A single-science Biology teacher gets double-award content mixed into their list. → **fails** (both groups of teachers are misled)
3. **A slug changed between rev 3 and rev 5.** For example, a rename such as `combined_science` → `combined-science`, or a new slug added. The exact match fails and the lessons vanish silently. → **fails**, and can't be detected from B's side
4. **A double-award teacher filters by course.** B has no double-award or combined category, so no route to the right lessons exists at all. → **fails**, because the intended users can't be reached
5. **Plain biology, chemistry or physics lesson whose slug is the same in rev 3 and rev 5.** → **holds**. This is why most teachers see nothing wrong.

## 4. Missing evidence

- **A's slug list at rev 3 compared with rev 5.** This tells us whether Fault 2 is contributing, and which slugs are affected.
- **B's actual entry for `combined-science`, if any.** This tells us which lessons are dropped and which are mis-filed. The reports suggest both are happening, which points to a partial or drifted mapping, but I can't settle that from the facts given.
- **How many lessons B drops, per slug.** B records none today, so how widespread the loss is can't be measured.
- **Whether A tags each combined-science lesson with the sciences it covers.** A's contract doesn't say. This decides whether B could route those lessons by content rather than by slug alone.

## 5. Obligations returned to each endpoint

**To B (it owns the reliance, because it serves the teachers):**
- Decide how combined-science is represented, and write the decision down. Either add a Combined Science / double-award subject, or map one lesson to many subjects so it appears under all three sciences with a double-award marker. One-to-one exact match is not allowed for this slug.
- Replace the silent drop with visible handling: reject and report, or quarantine, with a count and an alert on unmapped slugs.
- State which A revision(s) it supports, and rebuild the mapping against rev 5.
- Add a seam-level test that checks A's current slug list against the mapping table, and fails if any slug has no entry.

**To A:**
- Publish its slug set as a versioned list for each revision, and give notice of changes, so consumers can detect drift.
- State in its contract whether a combined-science lesson carries tags for the sciences it covers. If it doesn't, say so, so consumers know they can't split those lessons by science.

The seam must be re-checked once B's representation decision is in and the table is rebuilt against rev 5. After that it goes to `assess-specification` to judge whether it's ready for teachers to use.
