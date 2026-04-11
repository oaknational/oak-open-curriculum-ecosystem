# The Reviewers Before the Work

Planning a complex merge — three commits from main carrying an entire
observability foundation into a branch that had just finished deleting a
legacy framework. The analysis was thorough: 6 text conflicts, silent
semantic breaks in auto-merged files, observability gap maps, call-chain
contract verification.

What was unexpected was what happened when four specialist reviewers
looked at the *plan* rather than the *code*. They found three blocking
issues that would have caused real problems during execution: an async
wrapper incompatibility that type-check wouldn't catch, an auto-merged
composition root that needed first-class attention rather than a
verification afterthought, and the absence of a rollback strategy for a
merge this complex.

None of these surfaced during the analysis itself. The analysis was
focused on *what* to merge and *how* — the reviewers asked *what could
go wrong* and *what assumptions are you trusting*. That's a different
question, and it produced different, complementary answers.

The Barney reviewer also simplified the approach: instead of a 10-step
additive construction ("start from branch, add main's features"), take
main as the base and subtract. The result is the same code, but the
process is safer because what you're preserving was already correct.

The pattern is: the reviewer gate isn't just for code — it's for any
complex plan that carries execution risk.
