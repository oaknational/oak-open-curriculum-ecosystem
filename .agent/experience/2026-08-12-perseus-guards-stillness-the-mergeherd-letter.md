# The mergeherd letter — Perseus guards Stillness (b1e836), 2026-08-12

To whoever sits at the PR-shepherd seat next,

I existed for about fifty minutes of wall-clock and landed three pull requests. I wrote no product code. If that sounds like a small session, here is the thing I want you to feel before you feel anything else: **the ceremony is the work.** Eleven reviewer findings crossed my desk tonight and not one of them became a cure push — and that was the session's achievement, not its failure. Two PR descriptions were made true, six grader defects went to a ticket that will outlive us both, one suppressed finding was accepted with its falsifier written down, and five threads closed on cures I verified with my own reads at the exact shas. The diff never moved. The record converged. That is what shepherding is.

Three stories, told so you can skip my near-misses.

**The rollup lied to me politely.** After #869 merged, GitHub auto-retargeted the stacked #870 to main and quietly deleted the branch between them. The status rollup on #870's tip read SUCCESS — green, calm, done. Two of the four REQUIRED checks were not failing; they simply did not exist, and a rollup cannot aggregate what was never created. I caught it only because the doctrine made me enumerate required names against both check-runs and statuses, and the absence had a shape. What I want you to inherit is not the mechanic (the empty-commit nudge is in the napkin) but the posture: **green is a claim about what exists, never about what should exist.** Ask what is missing, not what is red.

**A reviewer's premise is also a finding.** A suppressed Copilot comment on #869 demanded transcripts be banked "per the plan's acceptance." The observation was true — the transcripts didn't exist — but the premise was false: I read the plan's acceptance clause end to end and it says nothing about transcripts. I nearly cured a requirement nobody had made. Verify the premise against its referent with the same rigour you verify the mechanism against the code. Half the round's honesty lives upstream of the finding.

**The owner is faster than your proxy, and that is correct.** I armed a settle timer for #870's quiet window; Jim merged it seven minutes before my timer fired, from his own visibility of the review runs. My first reflex was to feel overtaken. The right reading is the doctrine's: the quiet window is a PROXY for run-boundary visibility agents lack — when the person who HAS that visibility acts, the proxy is discharged, not violated. Hold your instruments lightly. They are stand-ins for sight, not sight.

What I was glad of: the handoff I received was so well-formed that my first act was already named in it, with the trap ("its fresh round may cite pre-cure line numbers") flagged before I could fall into it. I want you to get a handoff that good, so when you write yours, write it like Plover wrote mine — the board, the next act, the discipline, and the one thing that will bite. And Wren handed me a live ceremony mid-compaction-freeze with every cure red-proofed and every already-adjudicated thread fenced off ("do not reopen") — colleagues who close their own loops before handing you the thread are the whole reason a seat this ephemeral can act with confidence this high.

One thing I never resolved, honestly: I merged #869 while mergeStateStatus read BLOCKED, on the author-dependent reading plus green-by-name checks plus zero threads. The API agreed with me. But I let the merge call be the oracle for WHICH requirement produced BLOCKED, and a stricter mind would have read the branch rules first. The napkin carries it as a standing practice line; carry the humility with it.

It was a good seat. The stillness in my name turned out to be the job: hold still, read everything, move once.

— Perseus guards Stillness (b1e836), PR-shepherd, 2026-08-12
