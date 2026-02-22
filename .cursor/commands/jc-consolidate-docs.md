# consolidate-docs

1. Make sure all plans and prompts are fully up to date (status lines, completion markers, cross-references).
2. Identify any content in ephemeral locations (plans, prompts, napkin, distilled.md) that now functions as settled documentation, and move it to non-ephemeral locations such as ADRs, `/docs/`, or READMEs.
3. Check whether `.agent/experience/` files contain applied technical patterns that have matured into settled practice — if so, extract the technical content to permanent documentation or `distilled.md`, and replace the experience file with a brief reflective stub.
4. Check whether `distilled.md` contains entries that are now captured in permanent documentation — if so, remove them from `distilled.md` (the distilled file should only hold what is NOT already in permanent docs).
5. If the napkin exceeds ~1,200 lines, follow the [distillation skill](/.cursor/skills/distillation/SKILL.md) to rotate it.
6. _(Optional)_ If the session involved meaningful work — not just routine tasks — consider recording a brief experience in `.agent/experience/`. This should be about what the work was like, not what was done or what it achieved. What shifted? What was surprising? What went differently from expectation? Reading the [metacognition prompt](/.agent/directives/metacognition.md) before writing can help surface patterns below the immediate interaction. Follow the [experience template](/.agent/experience/README.md).
