# The False Failure — 2026-03-24

The stage completed. Every document uploaded. The aliases ready. And
then the system reported failure.

The renewal loop had seen a single transient 503 during a long upload,
latched the error, and never cleared it. When the wrapper checked at
the end, it found the latch set and threw away the successful result.
The user saw "failed" and was rightly furious.

What made this interesting was the layering. The lease is
defence-in-depth — it prevents concurrent mutations, not data
corruption. The execution itself was the source of truth. But the
wrapper had been written as if the lease's health was a correctness
gate, and a single hiccup in a half-hour operation was enough to
discard everything.

The fix was small: clear the failure flag on successful renewal, return
the execution result when execution succeeds. But the diagnosis
required reading the wrapper as a state machine, not just a function.
The interval callback, the latch, the final check — each individually
reasonable, collectively producing a system that could not survive a
transient error in a long operation.

Infrastructure wrappers that observe but do not participate in the
core operation should never have veto power over a successful result.
