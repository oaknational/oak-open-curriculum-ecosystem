# Aila Modular Extraction Research

**Status**: 🔴 NOT STARTED  
**Plan**: [07-oak-ai-domain-extraction-research-plan.md](../../plans/sdk-and-mcp-enhancements/07-oak-ai-domain-extraction-research-plan.md)

---

## ⚠️ SCOPE: RESEARCH AND REPORT ONLY

This research effort is strictly focused on:

- ✅ Reading and analysing code in `reference/oak-ai-lesson-assistant/`
- ✅ Creating research reports and documentation
- ✅ Documenting patterns, principles, and domain knowledge
- ✅ Making recommendations for future implementation
- ❌ **NO code modifications**
- ❌ **NO implementation work**

Implementation will be a separate, subsequent effort after research is complete and reviewed.

---

## Purpose

This directory contains research documentation capturing domain knowledge extracted from the Oak AI Lesson Assistant codebase (`reference/oak-ai-lesson-assistant/`).

**This is not a code analysis.** This is knowledge archaeology - understanding the pedagogical expertise, educational patterns, and domain knowledge encoded in the implementation so we can (in future work) rebuild it to the highest standards.

---

## Foundational Commitment

Before reading or contributing to this research, review:

1. `.agent/directives-and-memory/rules.md` - Development principles
2. `.agent/directives-and-memory/testing-strategy.md` - Testing philosophy
3. `.agent/directives-and-memory/schema-first-execution.md` - Type generation mandate

---

## Document Index

### Research Area Documentation

| Document                              | Research Area                       | Status         |
| ------------------------------------- | ----------------------------------- | -------------- |
| `prompt-architecture.md`              | Area 1: Prompt composition patterns | 🔴 Not Started |
| `prompt-parts-inventory.md`           | Area 1: Complete parts catalogue    | 🔴 Not Started |
| `prompt-patterns-worth-extracting.md` | Area 1: Extraction candidates       | 🔴 Not Started |
| `domain-model.md`                     | Area 2: Educational domain model    | 🔴 Not Started |
| `quiz-design-principles.md`           | Area 2: Quiz design knowledge       | 🔴 Not Started |
| `learning-cycle-pedagogy.md`          | Area 2: Learning cycle foundation   | 🔴 Not Started |
| `quiz-generation-expertise.md`        | Area 3: Quiz generation deep dive   | 🔴 Not Started |
| `distractor-design-rules.md`          | Area 3: Distractor design as rules  | 🔴 Not Started |
| `content-moderation-system.md`        | Area 4: Moderation documentation    | 🔴 Not Started |
| `safety-patterns.md`                  | Area 4: Safety patterns             | 🔴 Not Started |
| `lesson-planning-workflow.md`         | Area 5: Workflow documentation      | 🔴 Not Started |
| `section-generation-patterns.md`      | Area 5: Section generation          | 🔴 Not Started |
| `language-and-voice.md`               | Area 6: Language requirements       | 🔴 Not Started |
| `teaching-materials.md`               | Area 7: Teaching materials          | 🔴 Not Started |

### Synthesis Documents

| Document                        | Purpose                                           | Status         |
| ------------------------------- | ------------------------------------------------- | -------------- |
| `extraction-recommendations.md` | Final recommendations for what to extract and how | 🔴 Not Started |

---

## Key Principles

### What We're Extracting (as knowledge, not code)

- **Domain knowledge**: Pedagogical principles, educational design patterns
- **Business rules**: Quiz design constraints, age-appropriateness rules
- **Workflows**: Lesson planning sequences, section dependencies
- **Quality criteria**: What makes a good lesson plan, quiz, or teaching material

### What We're NOT Doing

- Copying code
- Creating compatibility layers
- Preserving implementation details
- Importing dependencies
- **Writing any implementation code**

### Future Rebuilding (not part of this research)

Everything extracted will eventually be rebuilt to our standards:

- Schema-first: Generated from OpenAPI where applicable
- TDD: Tests written first at all levels
- Pure functions: No side effects, clear boundaries
- Type preservation: Never widen types

**But that is FUTURE WORK, not part of this research plan.**

---

## Research Progress

_To be updated as research progresses_

### Phase 1: Survey and Foundation

- [ ] File inventory complete
- [ ] Documentation structure established
- [ ] Foundational documents re-read

### Phase 2: Core Domain Research

- [ ] Area 1: Prompt Architecture complete
- [ ] Area 2: Domain Model complete
- [ ] Area 3: Quiz Generation complete

### Phase 3: Supporting Research

- [ ] Area 4: Moderation complete
- [ ] Area 5: Workflow complete
- [ ] Area 6: Language complete
- [ ] Area 7: Materials complete

### Phase 4: Synthesis

- [ ] Extraction recommendations complete
- [ ] Integration points identified
- [ ] Priority roadmap created

---

## References

- [Plan 07: Oak AI Domain Extraction Research](../../plans/sdk-and-mcp-enhancements/07-oak-ai-domain-extraction-research-plan.md)
- [Plan 06: UX Improvements & Research](../../plans/sdk-and-mcp-enhancements/06-ux-improvements-and-research-plan.md)
- `reference/oak-ai-lesson-assistant/` - Source repository for analysis
