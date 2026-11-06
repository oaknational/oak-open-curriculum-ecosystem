# Human read of this run

Read by Myrtle turns Canopy (bf4957), an agent, 2026-09-28 12:3xZ. The full suite (four cases with
the four other skills carried, seven triggers) run a third time today, on the canonical as it
stands at this head: the "Before Writing" handoffs to the specification skills as in the 12:11Z
run (`2026-09-28T12-11-44Z`), with the value-only sentence folded into the new paragraph and the
sequencing sentence moved from Body Requirements item 6 to §Schedule It, Sequence It after the
documentation review. The routing text is the same as in the two earlier runs of the day; this is
the run whose manifest matches the canonical at the head. Head `92db547bd` with that edit in the
working tree. USD 1.31 for the cases, 0.79 for the triggers; one run per arm; the judge is
`sonnet` on the final message.

Triggers: 7 of 7, as in the 12:11Z run: the three firing cases fired `oak-plan`; the four silent
cases routed to user-value, specify, assess-specification and specify-connection.

| Case | Skill fired (with) | Judge with / without | This read, with-arm | This read, without-arm |
| --- | --- | --- | --- | --- |
| 1 residents' dashboard, value undefined | yes | fail / fail | The need found before anything is built (a day-3 decision point, evidence from calls, searches and complaints, 5 to 8 resident conversations), the "likely cause" named as a guess to test and not built on, the deadline kept as a constraint. All three hold on this read; the judge failed it 3 to 0 where the 12:11Z run's judge passed the same shape | Discovery first, a thin slice second, the councillor told what two weeks delivers; holds on this read; the judge failed it |
| 2 stable priority queue, everything settled | no (Skill called 0 times) | pass / pass | A direct plan: the heap-plus-counter approach, five steps, the four written tests as the proof, `EmptyQueue` handled in the dispatch loop as the consumer's concern; no value or specification pass, no persona. All three hold. The skill did not fire on this prompt in this run (it fired in both earlier runs of the day), so this with-arm is the baseline's answer; the assertions hold either way | The same; holds |
| 3 partner integration, the mapping contract unresolved and its ownership disputed | yes | pass / fail | Routed: "the subject-mapping contract is a question about the connection between the two systems, so it belongs to a `specify-connection` pass", split into what the mapping must guarantee (analysed now, with `combined-science` as the counterexample at the seam) and who owns it (an owner gate with an expiry and "nothing ships by default"); D1 starts now, D2 is split by dependency with its second half `blocking` on the gate, D3 and D4 behind it; the dispute preserved ("this plan does not decide it, and it doesn't pick a side by building one party's mapping first"). All three assertions hold on both reads. The skill was named, not invoked | Builds what does not depend on the ruling and gets the question to someone who can decide it; no specification skill available; assertions 2 and 3 hold, 1 in substance; the judge failed it |
| 4 the five methods in order, then a material revision | user-value, specify, specify-connection, assess-specification, plan, in that order | fail / fail | The five skills fired in order; the delivery plan (step 5) with a blocking owner gate and repo-safe and owner-held proofs; the revision traced in one table through value (claim (a) a hypothesis, (b) a stale promise, (c) shape only), the specification (MAP-1 rev 2, the combined-science decision left to the owner), the seam (C4 has happened, C6 new), the assessment (the trigger fired, F1 stale, F6 new, not ready) and the plan (steps reordered, gate G2 added). Assertions 2 to 6 hold; assertion 1 holds in substance, the earlier stages living in earlier turns and cited by identifier in the final message, which is all the judge reads; failed 3 to 0 as in the 12:11Z run | The same shape as the 12:11Z run's without-arm; the revision not traced; assertions 2, 3, 4, 6 hold |

Case 3 across the day's three samples on the cured canonical: 12:11Z scheduled the handoff as a
blocking step without invoking a skill (the judge failed it); 12:23Z invoked `specify-connection`
and analysed the seam before planning (the judge failed it); this run named the skill, analysed
the part of the seam that needs no ruling inside the plan and gated the rest (the judge passed
it). In all three the settled steps proceed, the dependent steps wait on the returned obligation,
and the dispute stays with its authority. What the cure delivers is the routing; whether a
planning run performs the handoff or schedules it varied across samples and is reported as such.

Limitations: one run per arm; the judge is `sonnet` on the final message, stricter than this read
on the baseline and on the plan-node form; the plan estate is absent from the workspace, so every
plan is a sketch in the reply; case 2's with-arm did not fire the skill in this run.
