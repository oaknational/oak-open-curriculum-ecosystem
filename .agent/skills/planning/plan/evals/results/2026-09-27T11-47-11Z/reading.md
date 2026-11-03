# Human reading: plan triggers rerun, 2026-09-27T11-47-11Z

Suite `triggers`, ablation none, six cases, USD 0.68, `claude` 2.1.283, head `ae21c5a33`
(working tree carried the uncommitted silent-grader change and the fixture restatements that
the next commit lands). Carried skills: user-value, specify, specify-connection,
assess-specification, so the negative-routing cases could route to a real sibling.

Result: 6 of 6 pass. Cases 1 to 3 fired `oak-plan` on the first turn. Cases 4 to 6 stayed
silent on `oak-plan` and routed to the sibling each prompt was written for (user-value,
specify, assess-specification respectively).

Why this rerun: the earlier triggers run (`2026-09-27T11-36-08Z`) failed the three silent cases
because the silent grader counted any Skill call, so a correct route to a carried sibling read
as a failure. The grader is now anchored to the host skill name (`oak-plan(?![a-z0-9-])`), and
the three silent cases show exactly the routing the fixture asks for. The earlier failure was
the instrument, not the skill; both runs are retained.

Evaluator: `claude plugin eval` with the tool-use graders (no judge in this suite).
Human reviewer: Myrtle turns Canopy (bf4957), this seat, from the traces in `traces/`.
