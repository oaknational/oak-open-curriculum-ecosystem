# consolidate-docs

## Cardinal Rule: Plans Are Not Documentation

**A completed plan MUST be safe to delete at any point.** Plans are execution instructions — they describe what to do and track progress. They are NOT permanent documentation.

Before marking a plan as complete or archiving it, extract ALL documentation content to permanent locations:

- **Architectural decisions** → ADRs in `docs/architecture/architectural-decisions/`
- **System behaviour documentation** → READMEs in the relevant workspace
- **Technical reference** (data shapes, APIs, edge cases) → TSDoc in source files or workspace READMEs
- **Patterns and gotchas** → `distilled.md` (if not already in permanent docs)

If documentation exists ONLY in a plan, it is at risk. Extract it first, then mark the plan complete.

## Steps

1. **Extract documentation from plans.** Scan all active and recently completed plans for content that describes how things work (not what to do next). Move it to the appropriate permanent location. Plans should contain only: status, next steps, execution instructions, and references to permanent docs.
2. Make sure all plans and prompts are fully up to date (status lines, completion markers, cross-references).
3. Identify any content in ephemeral locations (prompts, napkin, distilled.md) that now functions as settled documentation, and move it to non-ephemeral locations such as ADRs, `/docs/`, or READMEs.
4. Check whether `.agent/experience/` files contain applied technical patterns that have matured into settled practice — if so, extract the technical content to permanent documentation or `distilled.md`, and replace the experience file with a brief reflective stub.
5. Check whether `distilled.md` contains entries that are now captured in permanent documentation — if so, remove them from `distilled.md` (the distilled file should only hold what is NOT already in permanent docs).
6. If the napkin exceeds ~800 lines, follow the [distillation skill](/.cursor/skills/distillation/SKILL.md) to rotate it.
7. _(Optional)_ If the session involved meaningful work — not just routine tasks — consider recording a brief experience in `.agent/experience/`. This should be about what the work was like, not what was done or what it achieved. What shifted? What was surprising? What went differently from expectation? Reading the [metacognition prompt](/.agent/directives/metacognition.md) before writing can help surface patterns below the immediate interaction. Follow the [experience template](/.agent/experience/README.md).
