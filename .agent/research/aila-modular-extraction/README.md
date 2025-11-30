# Aila Modular Extraction Research

**Status**: ✅ COMPLETE
**Plan**: [07-oak-ai-domain-extraction-research-plan.md](../../plans/sdk-and-mcp-enhancements/07-oak-ai-domain-extraction-research-plan.md)
**Completed**: 2025-11-30

---

## ⚠️ SCOPE: RESEARCH AND REPORT ONLY

This research effort was strictly focused on:

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

### Supporting Documents

| Document            | Purpose                                        | Status      |
| ------------------- | ---------------------------------------------- | ----------- |
| `file-inventory.md` | Complete file inventory for all research areas | ✅ Complete |

### Research Area Documentation

| Document                              | Research Area                       | Status      |
| ------------------------------------- | ----------------------------------- | ----------- |
| `prompt-architecture.md`              | Area 1: Prompt composition patterns | ✅ Complete |
| `prompt-parts-inventory.md`           | Area 1: Complete parts catalogue    | ✅ Complete |
| `prompt-patterns-worth-extracting.md` | Area 1: Extraction candidates       | ✅ Complete |
| `domain-model.md`                     | Area 2: Educational domain model    | ✅ Complete |
| `quiz-design-principles.md`           | Area 2: Quiz design knowledge       | ✅ Complete |
| `learning-cycle-pedagogy.md`          | Area 2: Learning cycle foundation   | ✅ Complete |
| `quiz-generation-expertise.md`        | Area 3: Quiz generation deep dive   | ✅ Complete |
| `distractor-design-rules.md`          | Area 3: Distractor design as rules  | ✅ Complete |
| `content-moderation-system.md`        | Area 4: Moderation documentation    | ✅ Complete |
| `safety-patterns.md`                  | Area 4: Safety patterns             | ✅ Complete |
| `lesson-planning-workflow.md`         | Area 5: Workflow documentation      | ✅ Complete |
| `section-generation-patterns.md`      | Area 5: Section generation          | ✅ Complete |
| `language-and-voice.md`               | Area 6: Language requirements       | ✅ Complete |
| `teaching-materials.md`               | Area 7: Teaching materials          | ✅ Complete |

### Synthesis Documents

| Document                               | Purpose                                           | Status      |
| -------------------------------------- | ------------------------------------------------- | ----------- |
| `extraction-recommendations.md`        | Final recommendations for what to extract and how | ✅ Complete |
| `openai-sdk-alignment-analysis.md`     | Comparison with OpenAI Apps SDK best practices    | ✅ Complete |
| `additional-discoveries.md`            | Additional valuable patterns discovered           | ✅ Complete |
| `gap-analysis-sdk-vs-aila-research.md` | Gap analysis of current SDK vs research findings  | ✅ Complete |
| `prompt-deep-dive-metacognition.md`    | Deep analysis of prompt patterns and their impact | ✅ Complete |

---

## Key Findings Summary

### High-Priority Extraction Targets

1. **Voice System**: 7 distinct voices with defined speaker, audience, and tone
2. **Section Dependencies**: Explicit dependency graph for lesson section ordering
3. **Quiz Design Rules**: Comprehensive rules for question/distractor design
4. **Learning Cycle Structure**: Explain-Check-Practice-Feedback model
5. **Timing Constraints**: Duration by key stage and component

### Key Patterns Identified

- **Conditional Composition**: Prompts assembled from parts based on context
- **Voice-Annotated Content**: Voice determines formality, vocabulary, structure
- **Scope-Based Quizzes**: Starter (prior knowledge) vs Exit (lesson content)
- **Key Stage Scaling**: Complexity scales with key stage throughout

### OpenAI Apps SDK Alignment

The extracted domain knowledge maps well to OpenAI Apps SDK best practices:

- **Annotations**: Quiz/browse tools get `readOnlyHint`, edit tools get `destructiveHint`
- **Status text**: Use AILA_TO_TEACHER voice for invoking/invoked messages
- **structuredContent**: Return QuizV3, CycleSchema with validation in `_meta`
- **Custom namespace**: Propose `oak/` prefix for educational metadata (voice, keyStage, quizScope)

See `openai-sdk-alignment-analysis.md` for detailed mapping.

### Implementation Roadmap

1. **Phase 1**: Data structures (voices, dependencies, timing)
2. **Phase 2**: Validation rules (quiz design, distractor criteria)
3. **Phase 3**: Prompt templates with extracted knowledge
4. **Phase 4**: MCP tool integration with SDK best practices

---

## Key Principles

### What We Extracted (as knowledge, not code)

- **Domain knowledge**: Pedagogical principles, educational design patterns
- **Business rules**: Quiz design constraints, age-appropriateness rules
- **Workflows**: Lesson planning sequences, section dependencies
- **Quality criteria**: What makes a good lesson plan, quiz, or teaching material

### What We Did NOT Do

- Copy code
- Create compatibility layers
- Preserve implementation details
- Import dependencies
- Write any implementation code

### Future Rebuilding (not part of this research)

Everything extracted will eventually be rebuilt to our standards:

- Schema-first: Generated from OpenAPI where applicable
- TDD: Tests written first at all levels
- Pure functions: No side effects, clear boundaries
- Type preservation: Never widen types

---

## Research Progress

### Phase 1: Survey and Foundation ✅ COMPLETE

- [x] File inventory complete (see `file-inventory.md`)
- [x] Documentation structure established (15 documents)
- [x] Foundational documents referenced

### Phase 2: Core Domain Research ✅ COMPLETE

- [x] Area 1: Prompt Architecture complete
- [x] Area 2: Domain Model complete
- [x] Area 3: Quiz Generation complete

### Phase 3: Supporting Research ✅ COMPLETE

- [x] Area 4: Moderation complete
- [x] Area 5: Workflow complete
- [x] Area 6: Language complete
- [x] Area 7: Materials complete

### Phase 4: Synthesis ✅ COMPLETE

- [x] Extraction recommendations complete
- [x] Integration points identified
- [x] Priority roadmap created

---

## Next Steps (Future Work)

1. Review research findings with team
2. Prioritise extraction targets based on SDK/MCP needs
3. Begin Phase 1 implementation (data structures)
4. Integrate with existing Plans 01-04

---

## References

- [Plan 07: Oak AI Domain Extraction Research](../../plans/sdk-and-mcp-enhancements/07-oak-ai-domain-extraction-research-plan.md)
- [Plan 01: Tool Metadata Enhancement](../../plans/sdk-and-mcp-enhancements/01-tool-metadata-enhancement.md)
- [Plan 04: Prompts and Agent Guidance](../../plans/sdk-and-mcp-enhancements/04-prompts-and-agent-guidance-resources.md)
- `reference/oak-ai-lesson-assistant/` - Source repository for analysis
