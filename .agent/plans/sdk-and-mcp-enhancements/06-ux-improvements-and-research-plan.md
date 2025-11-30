# UX Improvements and Research Plan

**Created**: 2025-11-29  
**Status**: 🟢 READY TO START  
**Focus**: Quick wins, research discovery, and foundation for future prompt enhancements

---

## Overview

This plan captures immediate UX improvements and research activities that will inform future prompt and tool enhancements. The outputs will be integrated into the existing plan sequence (Plans 01-05) once discovery is complete.

### Goals

1. **Quick Wins**: Immediate terminology fixes and landing page improvements
2. **Research**: Deep exploration of Oak AI Lesson Assistant patterns and codebase review
3. **Foundation**: Prepare architectural patterns for `keyStageOrYear` and advanced prompts
4. **Integration**: Document findings for incorporation into Plans 04 and future work

---

## Phase A: Quick Wins (~3 hours)

### A.1: Rename `year` → `yearGroup` (~15 mins)

**Files to modify**:

- `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.unit.test.ts`
- Any apps that reference the `year` parameter

**Changes**:

1. Rename parameter from `year` to `yearGroup`
2. Update description to clarify UK curriculum terminology
3. Remove the comment `// This should be key stage, not year group.`
4. Update tests to use new parameter name

**Acceptance Criteria**:

- [ ] Parameter named `yearGroup` in prompt definition
- [ ] Description says "year group" consistently
- [ ] All tests pass
- [ ] Quality gates pass

---

### A.2: Enhance Landing Page (~2-3 hours)

**File**: `apps/oak-curriculum-mcp-streamable-http/src/landing-page.ts`

**Current State**: Minimal page with MCP config snippet and OAuth note.

**Target State**: User-friendly "getting started" experience with:

1. **Getting Started Section**
   - What is the Oak Curriculum MCP?
   - How to connect (existing snippet)
   - What you can do with it

2. **Tools Section** (collapsible `<details>`)
   - List all 26+ tools with names and descriptions
   - Pulled from SDK at render time (import from generated tools)
   - Grouped by category if possible

3. **Resources Section** (collapsible `<details>`)
   - List MCP resources (ontology, documentation)
   - Brief description of each

4. **Prompts Section** (collapsible `<details>`)
   - List the 3 prompts: find-lessons, lesson-planning, progression-map
   - Descriptions and example use cases

**Implementation Approach**:

```typescript
// Import tool/prompt metadata from SDK
import { MCP_TOOL_DESCRIPTORS } from '@oaknational/oak-curriculum-sdk';
import { MCP_PROMPTS } from '@oaknational/oak-curriculum-sdk';

// Generate HTML sections at render time
function renderToolsList(): string { ... }
function renderPromptsList(): string { ... }
function renderResourcesList(): string { ... }
```

**Acceptance Criteria**:

- [ ] Getting started section explains the service
- [ ] Tools listed in collapsible section
- [ ] Prompts listed in collapsible section
- [ ] Resources listed in collapsible section
- [ ] Responsive, accessible HTML
- [ ] Dark mode support maintained
- [ ] Quality gates pass

---

## Phase B: Research and Discovery (~8-12 hours)

### B.1: Deep Dive into Oak AI Lesson Assistant (~6-8 hours)

**Repository**: `reference/oak-ai-lesson-assistant/`

This is a comprehensive research task to understand patterns, structures, and approaches used in the main Oak AI product that can inform our MCP server design.

#### B.1.1: Prompt Architecture Analysis

**Target directories**:

```
packages/core/src/prompts/
  lesson-assistant/     ← Conversational patterns
  lesson-planner/       ← Structured workflows
    extend-lesson-plan-quiz/   ← Quiz generation
    generate-lesson-plan/      ← Core lesson planning
    regenerate-lesson-plan/    ← Iteration patterns
  shared/               ← Cross-cutting concerns
```

**Research Questions**:

1. How are prompts structured? What's the `parts/` pattern?
2. How do input schemas define parameters (keyStage, ageRange, subject)?
3. How do output schemas constrain AI responses?
4. What's the variant system for (`variants/main/`)?
5. How is quiz generation handled differently from lesson planning?
6. What error handling and prompt injection protection exists?

**Deliverable**: `docs/research/oak-ai-prompt-architecture.md`

---

#### B.1.2: Quiz Generation Patterns

**Target files**:

```
packages/core/src/prompts/lesson-planner/extend-lesson-plan-quiz/
  input.schema.ts    ← What parameters?
  output.schema.ts   ← What structure?
  variants/main/parts/
    task.ts          ← The actual prompt
    output.ts        ← Output formatting
```

**Research Questions**:

1. What's the difference between `starterQuiz` and `exitQuiz`?
2. How does quiz generation build on lesson context?
3. What's the expected quiz question structure?
4. How are distractors (wrong answers) generated?

**Deliverable**: Section in `docs/research/oak-ai-quiz-patterns.md`

---

#### B.1.3: Input/Output Schema Patterns

**Research Questions**:

1. What parameters are consistently required (keyStage, ageRange, subject)?
2. How do they handle year groups vs key stages?
3. What validation patterns are used?
4. How do output schemas guide AI responses?

**Deliverable**: Section in prompt architecture doc

---

#### B.1.4: Lesson Planning Workflows

**Target files**:

```
packages/aila/src/           ← Core AI assistant
packages/core/src/models/    ← Domain models
packages/teaching-materials/ ← Teaching material structures
```

**Research Questions**:

1. What's the lesson planning workflow (steps, dependencies)?
2. How are Oak curriculum resources integrated?
3. What's the feedback/iteration loop for lesson plans?
4. How are teaching materials structured?

**Deliverable**: `docs/research/oak-ai-lesson-workflow.md`

---

#### B.1.5: RAG and Curriculum Integration

**Target directories**:

```
packages/rag/           ← Retrieval-augmented generation
packages/ingest/        ← Curriculum ingestion
packages/db/schemas/    ← Data models
```

**Research Questions**:

1. How does Oak AI retrieve relevant curriculum content?
2. What's the lesson/unit/programme data model?
3. How is semantic search used?
4. How are curriculum resources cited in outputs?

**Deliverable**: `docs/research/oak-ai-curriculum-integration.md`

---

### B.2: Review Enhancement Plans (~2 hours)

**Files to review**:

```
.agent/plans/sdk-and-mcp-enhancements/
  00-ontology-poc-static-tool.md
  01-mcp-tool-metadata-enhancement-plan.md
  02-curriculum-ontology-resource-plan.md
  03-mcp-infrastructure-advanced-tools-plan.md
  04-mcp-prompts-and-agent-guidance-plan.md
  05-zod-v4-export-implementation-plan.md
  README.md

.agent/plans/openai-app/
  oak-openai-app-plan.md
```

**Research Questions**:

1. What's the current status of each plan?
2. What are the dependencies between plans?
3. Where do the new improvements fit?
4. Are there conflicts or overlaps?
5. What's the critical path?

**Deliverable**: Update to `README.md` with:

- Status updates
- Dependency diagram refinement
- Integration points for new work
- Priority recommendations

---

### B.3: Research Synthesis (~2 hours)

**Task**: Consolidate findings into actionable recommendations.

**Deliverables**:

1. `docs/research/README.md` - Research index and key findings
2. Updates to `improvements.md` with specific implementation guidance
3. Draft specifications for:
   - `keyStageOrYear` union parameter pattern
   - `quiz-customisation` prompt structure
   - `adapt-materials` prompt concept

---

## Phase C: Foundation Work (~4-6 hours)

_To be executed after Phase B research is complete_

### C.1: Design `keyStageOrYear` Union Parameter

**Based on research findings**, design a parameter that:

1. Accepts either key stage (`ks1`, `ks2`, `ks3`, `ks4`) OR year group (`Year 1` - `Year 11`)
2. Uses `ontology-data.ts` mapping for resolution
3. Always resolves to key stage internally
4. Provides helpful error messages for invalid input

**Deliverable**: Specification document for implementation

---

### C.2: Design `quiz-customisation` Prompt

**Based on Oak AI quiz patterns**, design a prompt that:

1. Separates quiz retrieval/generation from lesson planning
2. Supports starter vs exit quiz types
3. Takes lesson context as input
4. Follows Oak AI's question/answer/distractor structure

**Deliverable**: Specification document for implementation

---

### C.3: Research `adapt-materials` Possibilities

**Explore**:

1. Cross-subject search patterns
2. Context adaptation concepts (field trips, special needs, projects)
3. Location/real-world relevance integration
4. Feasibility assessment

**Deliverable**: Concept document with feasibility analysis

---

## Success Criteria

### Phase A Complete When:

- [ ] `yearGroup` parameter renamed across codebase
- [ ] Landing page enhanced with tools/resources/prompts
- [ ] All quality gates pass
- [ ] Changes committed

### Phase B Complete When:

- [ ] Research documents created in `docs/research/`
- [ ] Oak AI patterns documented and understood
- [ ] Enhancement plans reviewed and updated
- [ ] Integration points identified

### Phase C Complete When:

- [ ] `keyStageOrYear` pattern specified
- [ ] `quiz-customisation` prompt designed
- [ ] `adapt-materials` concept documented
- [ ] Ready for integration into Plans 04+

---

## Integration with Existing Plans

After this plan completes, findings will be integrated:

| Finding                  | Integrates Into            |
| ------------------------ | -------------------------- |
| `keyStageOrYear` pattern | Plan 04 (Prompts)          |
| Quiz prompt design       | Plan 04 (Prompts)          |
| Adapt-materials concept  | New Plan 07                |
| Oak AI patterns          | Plans 02, 03, 04           |
| Landing page             | Plan 01 (Metadata) Phase 6 |

---

## Estimated Timeline

| Phase                 | Duration  | Dependencies      |
| --------------------- | --------- | ----------------- |
| A.1: Rename yearGroup | 15 mins   | None              |
| A.2: Landing page     | 2-3 hours | None              |
| B.1: Oak AI deep dive | 6-8 hours | Phase A complete  |
| B.2: Plan review      | 2 hours   | Parallel with B.1 |
| B.3: Synthesis        | 2 hours   | B.1, B.2 complete |
| C.1-C.3: Foundation   | 4-6 hours | Phase B complete  |

**Total**: ~15-22 hours

---

## Notes

### Why Research First?

The Oak AI Lesson Assistant represents years of pedagogical and UX refinement. Understanding their patterns before implementing our own ensures:

1. We don't reinvent solved problems
2. We align with Oak's established design language
3. We benefit from their user feedback and iteration
4. We can identify gaps they haven't addressed

### Key Files to Study

```
# Must-read files in Oak AI repo
packages/core/src/prompts/lesson-planner/generate-lesson-plan/input.schema.ts
packages/core/src/prompts/lesson-planner/extend-lesson-plan-quiz/input.schema.ts
packages/core/src/prompts/lesson-assistant/parts/body.ts
packages/aila/src/core/chat/AilaChat.ts
packages/db/schemas/lesson.ts
packages/rag/lib/
```

### Research Output Structure

```
docs/research/
  README.md                           ← Index and key findings
  oak-ai-prompt-architecture.md       ← Prompt structure patterns
  oak-ai-quiz-patterns.md             ← Quiz generation specifics
  oak-ai-lesson-workflow.md           ← Lesson planning flows
  oak-ai-curriculum-integration.md    ← RAG and data integration
```

---

## References

- `.agent/plans/sdk-and-mcp-enhancements/improvements.md` - Source requirements
- `.agent/directives-and-memory/rules.md` - Development rules
- `.agent/directives-and-memory/testing-strategy.md` - TDD approach
- `reference/oak-ai-lesson-assistant/` - Research target
