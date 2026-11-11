# Analysis: A → B subject mapping

Each endpoint is correct against its own schema and tests. The fault is in the connection between them, and nothing currently checks that connection.

## What breaks

**1. B's taxonomy has nowhere to put a combined-science lesson.**
A combined-science lesson covers biology, chemistry and physics together. B's taxonomy is Biology, Chemistry and Physics, and each lesson goes to exactly one of them. That leaves two outcomes, and neither is right:
- **No entry for `combined-science`:** the lesson is dropped silently. Teachers see it as **missing**.
- **An entry mapping it to one science:** the lesson lands under that science only. Teachers see it **filed under the wrong science**, or at best under a third of its content.

The two reported symptoms fit these two branches. The facts don't say which branch B takes. It may take both, if some lessons reach B under a slug that has an entry and others under one that doesn't.

**2. The mapping table is two revisions behind A.**
It was built against A's revision 3, and A is on revision 5. B matches slugs exactly, so any slug that was added, renamed or re-cased since revision 3 has no entry and is dropped. Nobody gets an error. `combined-science` may itself be new since revision 3. If so, the table was never designed with it in mind.

**3. B drops unknown slugs without saying so.**
Because B discards unmapped slugs silently, the first sign of a problem is a teacher saying their lessons are gone. B's schema validation passes because a dropped record never reaches the output it validates.

## Why passing tests don't help

- A's tests show that A's output matches A's schema.
- B's tests show that B handles the slugs in its table correctly.
- No test checks that every slug A revision 5 can return has a correct destination in B. That is the property teachers depend on, and nothing tests it.

## What would fix it

1. **Model combined-science properly in B.** Either tag the lesson with all three subjects, or add a Combined Science view for double-award teachers. Mapping it to one science can't be correct, however the table is edited.
2. **Rebuild the mapping table against A's revision 5,** and record which revision the table was built against.
3. **Make unmapped slugs fail loudly.** Log, count and alert on them, or fail the sync. Don't drop them silently.
4. **Add a contract test.** It should list every slug A's current revision can emit and assert that each one has an intended destination in B. It should run whenever A's revision changes.

## To confirm first

- Check whether B's table has an entry for `combined-science`, and if so, where it points. That tells you whether you're seeing the "missing" branch, the "wrong science" branch, or both.
- Compare A's slug list at revision 3 with revision 5 to find any other slugs that are being dropped.

Until B can file a combined-science lesson under all the sciences it covers, double-award teachers won't reliably find the right lessons, even though both endpoints pass their tests.
