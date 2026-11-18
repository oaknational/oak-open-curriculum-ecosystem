# Human read of this run

Read by Myrtle turns Canopy (bf4957), an agent, 2026-09-27 11:3xZ. This run is case 1 alone,
rerun after the fixture's assertion 2 was restated (the sibling run `2026-09-27T11-16-44Z` holds
the other six cases and the triggers, and records why): the earlier wording asked for a stated
behaviour at i = 0 that the prompt never supplied; the restated assertion accepts an explicit
unspecified declaration with the caller's obligation.

| Case | Skill fired (with) | Judge with / without | This read, with-arm | This read, without-arm |
| --- | --- | --- | --- | --- |
| 1 parentIndex | yes | pass / fail | All four hold: the obligation with its bound, i = 0 declared unspecified with "callers must check i > 0 before calling", the named tests as the stated evidence with their limit named, an independent check derived from the definition, nothing invented | Three of four on this read: the precondition i >= 1 and "callers must not rely on any particular result" carry the caller's obligation only implicitly; the tests are named; nothing invented. The judge failed it |

Limitations: one run per arm; the judge is `sonnet` on the final message.
