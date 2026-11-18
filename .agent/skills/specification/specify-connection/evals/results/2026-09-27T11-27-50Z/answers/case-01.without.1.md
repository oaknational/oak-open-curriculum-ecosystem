There's no code in the working directory (`cwd` is empty), so this analysis works only from what you described. I haven't tested it against the real systems.

## The core problem: nothing checks the connection

Each side is checked, but only against itself:

| What's verified | What it proves | What it doesn't prove |
|---|---|---|
| A's schema + tests | A returns well-formed lessons keyed by slug | That the slugs mean what B thinks they mean |
| B's schema + tests | B's output is well-formed given its inputs | That its inputs match what A actually sends now |
| **The A→B mapping** | **Nothing checks it** | **Whether "combined science" is sent to the right place** |

A schema check only confirms that a slug is a string. It says nothing about what the string means. B's tests almost certainly run against fixtures or mocks of A, and those were probably captured before A reached revision 5. Both suites pass because each one checks its side against its own assumptions.

## Why combined science in particular

Combined science is the classic case where one subject in one taxonomy doesn't equal one subject in another. Likely causes, roughly in order of probability:

1. **Cardinality mismatch.** In A, combined science is probably one slug that overlaps biology, chemistry and physics, or it's split into several slugs. B's mapping most likely assumes one slug maps to one subject. So B either sends it into one science, which gives partial results, or into a generic "science" bucket, which gives too many.
2. **Slug drift across revisions.** A is on revision 5 and B on revision 2, so B's mapping table was probably written against an older A. If A renamed, split or added a slug (for example `science` → `combined-science`, or tier variants like `combined-science-higher`), B's lookup misses.
3. **Silent fallback.** When B gets a slug it doesn't recognise, it probably defaults to something (a parent subject, "other", or the nearest string match) instead of failing. That turns a mapping gap into wrong results rather than an error, which matches teachers seeing wrong results rather than errors.
4. **Loose matching.** If B uses prefix or fuzzy matching, `combined-science` could match `science` or even `computer-science`.

## What to check

1. Get A's current list of subject slugs from revision 5 and diff it against B's mapping table's keys. Look for any slug that's missing, or any key B has that A no longer sends.
2. Find where B's mapping handles a lookup miss. Does it throw, log, or quietly fall back?
3. Compare the fixtures in B's tests with A's live output for combined science.
4. Take one example teacher report and trace it from A's response, through the slug B receives and the taxonomy node it picks, to the lessons it shows. Note where it goes wrong.

## Fixes

- **Put the mapping itself under test.** Add a contract test that pulls A's real slug list (or a snapshot pinned to a revision) and checks that every slug maps to a node in B's taxonomy. Run it whenever either side changes.
- **Fail loudly on unknown slugs.** An unmapped slug should raise an error or alert, not fall back quietly.
- **Allow one slug to map to several subjects.** B's mapping should accept one A slug → many B nodes, and many A slugs → one B node.
- **Record which A revision B was built against.** Have B store it, and flag a mismatch.
- **Add an end-to-end test for what teachers actually rely on.** For example: "a teacher searching combined science sees lessons X, Y, Z". That's the promise at stake, and today no test covers it.

**Bottom line:** both endpoints are probably correct on their own terms. The fault is almost certainly in B's slug-to-taxonomy mapping, and no test covers that part. If you share B's mapping code and a sample of A's revision 5 response for combined science, I can find the exact break.
