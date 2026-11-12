# The connection between the curriculum API and the teacher tool fails for double-award teachers

The analysis below uses only the facts you gave. Both schemas validate and both test suites pass, but that says nothing about this connection. B's mapping was built against A's revision 3 and is running against revision 5. B's taxonomy also has no subject that can hold a lesson covering all three sciences. Teachers of the double-award course therefore can't rely on B to find their lessons.

## 1. The connection
| | |
|---|---|
| **Relation** | B turns A's subject slugs into its own subjects. |
| **Endpoints** | A is the curriculum API at revision 5, with slugs `biology`, `chemistry`, `physics` and `combined-science`. B is the teacher tool at revision 2, with subjects Biology, Chemistry and Physics, mapped by exact match on a table built against A's revision 3. |
| **Intended reliance** | Teachers, including those teaching the double-award course, find the right lessons in B. |
| **What must survive the mapping** | Each lesson's subject and the course it belongs to (double-award or single science). Nothing in the facts permits losing either. |
| **What A supplies** | Lessons keyed by one of four slugs. `combined-science` covers content from all three sciences. The facts say nothing about how A changes its slugs between revisions or whether the slug list can grow. |
| **What B assumes** | Every slug matches a table entry exactly, and each lesson belongs to exactly one of three subjects. A slug with no entry is dropped with no signal to anyone. |
| **Failure behaviour** | A drop or a wrong match looks the same as success on both sides. Nothing detects it, so there is nothing to recover from. |
| **Supporting evidence** | Only local: each side's schema checks and tests. Nothing tests A's revision 5 against B's revision 2. |
| **When to re-check** | Any change to A's revision or slug list, B's mapping table or taxonomy, or who the tool is meant to serve. |

## 2. Is the connection sound?
**It fails for double-award lessons. It holds for the three single-science slugs only if they haven't changed since revision 3, which nothing confirms.**

- **Revision gap:** B's table was written for revision 3 and nobody has checked it against revision 5. Anything A changed in between reaches B with no check.
- **Representation gap:** a `combined-science` lesson belongs to three sciences at once, and B can only file a lesson under one. So every exact-match table leaves the teacher with a loss:
  - **No entry:** the lesson is dropped silently, which explains "missing".
  - **An entry pointing to one science:** the lesson lands under a science it only partly covers, and the other two lose it. That explains "filed under the wrong science".
  - **Even a correct entry:** the lesson loses its link to the double-award course and sits among single-science lessons.

  No change to the table alone fixes this.
- **Silent dropping** means B's tests can't catch the problem. The first sign of trouble was teacher complaints.

## 3. Cases where each side works but the pair fails
1. **`combined-science` added after revision 3 (or renamed):** there's no table entry, so the lesson is dropped silently and reported as missing. Each side is valid on its own, the pair fails, and this matches the reports.
2. **A table entry sends `combined-science` to one science, say Biology:** the lesson's chemistry and physics content can't be found under Chemistry or Physics. This matches "wrong science".
3. **Revision 3 used different slugs from revision 5** (for example, per-science combined slugs): some still match by chance and some don't. That would explain why teachers report both missing and misfiled lessons. It can't be confirmed from the facts.
4. **A single-science slug was renamed or changed case between revisions 3 and 5:** that science's lessons would vanish for every teacher, not just double-award ones. It isn't reported, so it's probably not happening, but nothing checks for it.
5. **A adds or renames any slug in the future:** the same silent loss happens again, because nothing detects it.

Because teachers report both symptoms, cases 1 or 2 and 3 may be happening at the same time. Which ones actually apply can't be decided without the evidence below.

## 4. Missing evidence
- **A's slug list at revision 3 and its changes since:** needed to tell cases 1, 3 and 4 apart. A's release history is the authority.
- **B's actual mapping table:** shows whether `combined-science` has an entry and where it points (case 2). B's configuration is the authority.
- **Any count or log of slugs B has dropped:** shows how much is being lost. B currently doesn't record this.
- **Whether A tags each combined-science lesson with its component science:** decides whether splitting lessons across sciences is even possible. A's contract is the authority.
- **The specific lessons teachers reported:** needed to link each complaint to a case.

## 5. What each side is asked to do
- **B's owner:**
  - B's taxonomy needs a way to represent double-award lessons. The options are a combined-science subject, filing a lesson under more than one science, or keeping the course as a separate attribute.
  - Unmapped slugs should be rejected or flagged, not dropped silently.
  - B should declare which A revision it supports.
  - B needs a contract test against A's current revision.
- **A's owner:**
  - Publish the slug list for each revision, with changes and deprecations.
  - Say whether the slug list is fixed or can grow.
  - Say whether combined-science lessons carry their component sciences.
- **Curriculum or product owner** (this isn't for the connection itself to decide): define what "the right lesson" means for a double-award teacher. Is it the combined lesson as a whole, or its parts filed under each science? B's fix depends on this answer.

This analysis doesn't judge whether the connection is ready for use. Once these obligations are written into A's and B's own specifications, the next step is to rerun the checks in sections 2 and 3 against the repaired pair.
