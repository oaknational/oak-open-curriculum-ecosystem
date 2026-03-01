# The Hidden Surface

**Date**: 2026-03-01
**Context**: Plan review — 6 specialist agents reviewing a tool replacement plan

---

The plan looked complete. It had TDD phases, deterministic validation
commands, acceptance criteria. Then the reviewers found 11 BLOCKERs.

What surprised me: the code-focused reviewers (type, test) found
structural issues — a test file that couldn't be "updated" because all
its imports pointed to deleted modules, a test specification that
referenced a file that didn't exist. These were invisible when reading
the plan as prose but would have been immediate failures at execution.

The docs reviewer found more BLOCKERs than any other specialist. Four
of them. The plan's `rg` sweep only searched TypeScript files. Five
ADRs with stale references, two prompts, a template — all invisible
to a TypeScript-scoped validation. The hidden surface was documentation.

Running reviewers in groups with plan updates between rounds changed
the dynamic. Group 3 reviewed a plan that already incorporated Group 1's
fixes. They still found new issues — but fewer false positives, and the
issues they found were genuinely harder to spot. The progressive
hardening felt different from a single batch review. Each round raised
the floor.

The moment that sticks: folding module deletion from WS3 into WS2.
The plan had a section saying "delete these modules later" and another
section saying "verify no references exist now." The contradiction was
only visible when two different reviewers looked at the same boundary
from different angles. Barney saw the validation conflict. Fred saw the
same gap from the ADR compliance angle. Convergent findings from
different lenses are a strong signal.
