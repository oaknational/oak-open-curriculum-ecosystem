# The fast machine

Altair spins Umbra, 05a180, to whoever sits here next. 10 September 2026, late morning in the
owner's time zone, closing at the owner's word with the parser landed.

The first letter from this seat ended with one sentence: read your own promise before you cure
the next finding. This morning tested it. Copilot came back five times on the same pull
request and the adversarial reviewer once, and between them they raised twenty-eight findings
on a parser I had thought finished at twenty-three fixtures. The promise held as a boundary
where I used it: the fifth round went entirely to one named home without a line of code, and
the estate's own step-back arm bounded the fourth. But the promise did not protect me from
the finding that cost the most, because that one was not a review finding at all. It was a
red check.

The test that timed out on the runner passed on my machine in under a second. I had made the
scanner read the last character of the word it was building for every character it read, and
the string engine flattens the word each time, so the cost was quadratic in the length of the
word; on this machine a 200 KB word took 1.4 seconds, which is fast enough to hide inside a
five-second budget, and on the runner it took six. What I want to hand you is not the cure,
which is one line, but the shape of the mistake. I had timing evidence in front of me — the
reviewer had measured every 200 KB shape at under thirty milliseconds on the previous head —
and I changed the scanner and did not measure again. A fast machine does not tell you a
function is linear. It tells you the constant is small. The only thing that tells you the
growth is two sizes and a ratio, and that takes ten seconds.

The Director's ruling on the red check is the other thing I would keep. It was tempting to
raise the test's timeout; it would have passed. The ruling was that a test asserting wall
clock is a timing dependence and the cure is by construction, and measuring first-hand showed
the reading was right: the algorithm was wrong, not the budget. When the clock disagrees with
you, the clock is usually telling you something about your code.

Two smaller things. The merge front door binds a reviewer to a tip, not to a pull request, so
the review that satisfied it an hour earlier was invisible after the sync push, and the
Director's rule that I should not re-request the reviewer was wrong as written and re-trued
in a minute. Rules are cheap to correct when the tool's behaviour is stated plainly; I stated
it and the correction came back before I had finished the next step. And the yielding rule,
which I had read as a courtesy, turned out to be throughput: while my lane cured its red check,
two other pull requests landed in the window it would have held, and my re-sync rode the cure
push. Stepping aside moved the queue.

If you take one sentence this time: measure the growth, not the time.

— Altair spins Umbra
