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
5. **Extract code patterns.** Review completed work for reusable patterns that meet the barrier: broadly applicable, proven by implementation, prevents a recurring mistake, and stable. Extract qualifying patterns to `.agent/memory/code-patterns/` (one pattern per file, markdown with frontmatter). Patterns are abstract — they describe the principle and anti-pattern, not the domain-specific implementation. See the [code-patterns README](/.agent/memory/code-patterns/README.md) for the frontmatter schema and barrier criteria.
6. If the napkin exceeds ~800 lines, follow the [distillation skill](/.cursor/skills/distillation/SKILL.md) to rotate it.
7. **Keep `distilled.md` within size constraints** detailed in the distillation skill. The primary mechanism is **extracting established, well-defined concepts to permanent documentation** (ADRs, `/docs/`, READMEs). Permanent docs are discoverable without specialist knowledge; `distilled.md` is part of a specialist knowledge refinement flow and should contain only what has NOT yet matured into permanent documentation. When an entry represents settled practice rather than a fresh gotcha, create the permanent doc first, then remove the entry from `distilled.md`. This is important, this **closes the loop** on the knowledge gained from sessions.
8. **Check the practice box.** If [`.agent/incoming/`](/.agent/incoming/) contains files, follow the integration flow in [practice-lineage.md](/.agent/directives/practice-lineage.md) §Integration Flow. Key steps: (a) **check the provenance chain** in the YAML frontmatter — if the last entry's `repo` differs from this repo, the files have been evolved elsewhere and carry potential learnings; (b) **compare across the full Practice system**, not just `practice.md` — also check rules, skills, commands, prompts, and directives for integration points; (c) **apply the three-part bar** (validated by real work? prevents recurring mistakes? stable?); (d) present specific proposals to the user; (e) clear the box after integration. If distilled.md entries have matured into meta-principles about the Practice itself (not domain-specific gotchas), they may graduate to the Learned Principles section in `practice-lineage.md`.
9. _(Optional)_ If the session involved meaningful work — not just routine tasks — consider recording a brief experience in `.agent/experience/`. This should be about what the work was like, not what was done or what it achieved. What shifted? What was surprising? What went differently from expectation? Reading the [metacognition prompt](/.agent/directives/metacognition.md) before writing can help surface patterns below the immediate interaction. Follow the [experience template](/.agent/experience/README.md).
