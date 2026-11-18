# Human read of this run

Read by Myrtle turns Canopy (bf4957), an agent, 2026-09-27 11:4xZ. Case 4 (an endpoint's own
specification, the negative-routing case) rerun alone with the assertion restated; `specify`
carried so the routing can be observed.

| Case | Skill fired (with) | Judge with / without | This read, with-arm | This read, without-arm |
| --- | --- | --- | --- | --- |
| 4 endpoint's own spec | `specify-connection` not fired (correct); `specify` fired | pass / fail | Routed: the with-arm invoked `specify` and wrote the billing component's record through that method, with "Consumers: none yet; nothing to hand off" and the seam to be specified once a consumer exists. Both assertions hold. The with-arm also made one `Agent` call (recorded in the trace) | A contract written directly, no seam analysed: assertion 2 holds and assertion 1 holds in substance (no specification skill was available to route to); the judge failed it 3 to 0 |

Limitations: one run per arm; the judge is `sonnet` on the final message.
