# UX Improvements and Research Plan

**Created**: 2025-11-29  
**Updated**: 2025-11-30  
**Status**: 🟡 PHASE A ✅ COMPLETE, PHASE B ✅ COMPLETE (via Plan 07), PHASE C pending  
**Focus**: Quick wins, research discovery, and foundation for future prompt enhancements

---

## Overview

This plan captures immediate UX improvements and coordinates research activities that will inform future prompt and tool enhancements. The outputs will be integrated into the existing plan sequence (Plans 01-05) once discovery is complete.

### Goals

1. **Quick Wins**: Immediate terminology fixes and landing page improvements
2. **Research**: Deep exploration of Oak AI Lesson Assistant patterns and codebase review → **See [Plan 07](./07-oak-ai-domain-extraction-research-plan.md)**
3. **Foundation**: Prepare architectural patterns for `keyStageOrYear` and advanced prompts
4. **Integration**: Document findings for incorporation into Plans 04 and future work

### Foundational Commitment

Before beginning any task, re-read and recommit to:

- `.agent/directives/rules.md`
- `.agent/directives/testing-strategy.md`
- `.agent/directives/schema-first-execution.md`

---

## Phase A: Quick Wins (~3 hours) ✅ COMPLETE

### A.1: Rename `year` → `yearGroup` (~15 mins) ✅ DONE

**Files modified**:

- `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.unit.test.ts`
- Landing page and related apps

**Changes made**:

1. ✅ Renamed parameter from `year` to `yearGroup`
2. ✅ Updated description to clarify UK curriculum terminology
3. ✅ Removed the comment `// This should be key stage, not year group.`
4. ✅ Updated tests to use new parameter name

**Acceptance Criteria**:

- [x] Parameter named `yearGroup` in prompt definition
- [x] Description says "year group" consistently
- [x] All tests pass
- [x] Quality gates pass

---

### A.2: Enhance Landing Page (~2-3 hours) ✅ DONE

**File**: `apps/oak-curriculum-mcp-streamable-http/src/landing-page.ts`

**What was implemented**:

1. ✅ **Getting Started Section** - Explains the service with MCP config snippet
2. ✅ **Tools Section** (collapsible `<details>`) - Lists all 30 tools with names and descriptions
3. ✅ **Resources Section** (collapsible `<details>`) - Lists MCP resources
4. ✅ **Prompts Section** (collapsible `<details>`) - Lists available prompts
5. ✅ Reordered sections (Resources → Prompts → Tools) for better UX
6. ✅ Improved "Connect" heading to "Connecting as an MCP server"

**Implementation details**:

```typescript
// SDK imports for dynamic generation
import { MCP_TOOL_DESCRIPTORS } from '@oaknational/oak-curriculum-sdk';
import { MCP_PROMPTS } from '@oaknational/oak-curriculum-sdk';

// Helper functions generate HTML at render time
function renderToolsList(): string { ... }
function renderPromptsList(): string { ... }
function renderResourcesList(): string { ... }
```

**Acceptance Criteria**:

- [x] Getting started section explains the service
- [x] Tools listed in collapsible section
- [x] Prompts listed in collapsible section
- [x] Resources listed in collapsible section
- [x] Responsive, accessible HTML
- [x] Dark mode support maintained
- [x] Quality gates pass
- [x] Prominent hero explainer text at the top of the page, under the title
- [x] Minimal Playwright test for basic functionality, including a11y, strictly in line with .agent/directives/testing-strategy.md

---

## Phase B: Oak AI Domain Extraction Research

> **⚠️ DELEGATED TO PLAN 07**
>
> Phase B has been elevated to its own comprehensive research plan due to its strategic importance.
>
> **See: [07-oak-ai-domain-extraction-research-plan.md](./07-oak-ai-domain-extraction-research-plan.md)**

### Strategic Context

The Oak AI Lesson Assistant repository contains years of accumulated pedagogical expertise, prompt engineering refinement, and educational domain knowledge. This is not a simple code review - it is **knowledge archaeology**.

**The goal is not to copy or integrate with Oak AI's existing code.** The goal is to:

1. **Understand** the domain knowledge encoded in their implementation
2. **Extract** the pedagogical principles and educational patterns
3. **Rebuild** to our standards (schema-first, TDD, pure functions, type preservation)

This ensures the longevity of valuable domain expertise while meeting the highest standards of software engineering excellence.

### Plan 07 Research Areas

1. **Prompt Architecture and Composition** - How prompts are structured and composed
2. **Educational Domain Model** - Lessons, quizzes, learning cycles, key stages
3. **Quiz Generation Expertise** - Question design, distractor creation, pedagogical constraints
4. **Content Moderation and Safety** - Moderation categories, safety patterns
5. **Lesson Planning Workflow** - Complete workflow from request to lesson plan
6. **Language and Voice** - British English, age-appropriate language
7. **Teaching Materials Generation** - Beyond the core lesson plan

### Deliverables (from Plan 07)

**Output Directory**: `.agent/research/aila-modular-extraction/`

```text
.agent/research/aila-modular-extraction/
├── README.md                           ← Index and executive summary
├── prompt-architecture.md              ← Prompt composition patterns
├── prompt-parts-inventory.md           ← Complete parts catalogue
├── prompt-patterns-worth-extracting.md ← Extraction candidates
├── domain-model.md                     ← Educational domain model
├── quiz-design-principles.md           ← Quiz design knowledge
├── learning-cycle-pedagogy.md          ← Learning cycle foundation
├── quiz-generation-expertise.md        ← Quiz generation deep dive
├── distractor-design-rules.md          ← Distractor design as rules
├── content-moderation-system.md        ← Moderation documentation
├── safety-patterns.md                  ← Safety patterns
├── lesson-planning-workflow.md         ← Workflow documentation
├── section-generation-patterns.md      ← Section generation
├── language-and-voice.md               ← Language requirements
├── teaching-materials.md               ← Teaching materials
└── extraction-recommendations.md       ← What to extract and how
```

### Phase B Complete When

- [ ] Plan 07 research is complete
- [ ] `extraction-recommendations.md` provides clear guidance for Phase C
- [ ] Domain knowledge documented independently of original implementation

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

### Phase A Complete When: ✅ DONE

- [x] `yearGroup` parameter renamed across codebase
- [x] Landing page enhanced with tools/resources/prompts
- [x] All quality gates pass
- [x] Changes committed
- [x] Prominent hero explainer text at the top of the page
- [x] Minimal Playwright test for basic functionality (per testing-strategy.md)

### Phase B Complete When:

- [ ] Plan 07 research is complete
- [ ] All research documents created in `.agent/research/aila-modular-extraction/`
- [ ] `extraction-recommendations.md` provides clear extraction guidance
- [ ] Domain knowledge documented independently of implementation

### Phase C Complete When:

- [ ] `keyStageOrYear` pattern specified (informed by Plan 07 domain model research)
- [ ] `quiz-customisation` prompt designed (informed by Plan 07 quiz expertise research)
- [ ] `adapt-materials` concept documented (informed by Plan 07 teaching materials research)
- [ ] Ready for integration into Plans 04+

---

## Integration with Existing Plans

After this plan completes, findings will be integrated:

| Finding                  | Integrates Into            | Source            |
| ------------------------ | -------------------------- | ----------------- |
| `keyStageOrYear` pattern | Plan 04 (Prompts)          | Plan 07 → Phase C |
| Quiz prompt design       | Plan 04 (Prompts)          | Plan 07 → Phase C |
| Adapt-materials concept  | Plan 04 or New Plan        | Plan 07 → Phase C |
| Oak AI domain patterns   | Plans 02, 03, 04           | Plan 07 research  |
| Landing page             | Plan 01 (Metadata) Phase 6 | Phase A           |

---

## Estimated Timeline

| Phase                    | Duration    | Dependencies          |
| ------------------------ | ----------- | --------------------- |
| A.1: Rename yearGroup    | 15 mins     | None ✅ DONE          |
| A.2: Landing page        | 2-3 hours   | None ✅ DONE (mostly) |
| A.3: Landing page finish | 1-2 hours   | A.2 complete          |
| B: Plan 07 Research      | 16-24 hours | Phase A complete      |
| C.1-C.3: Foundation      | 4-6 hours   | Phase B complete      |

**Total for Plan 06**: ~6-8 hours (Phases A and C)  
**Total for Plan 07**: ~16-24 hours (detailed research)  
**Combined Total**: ~22-32 hours

---

## Notes

### Why Extract and Rebuild?

The Oak AI Lesson Assistant repository contains valuable domain knowledge - years of pedagogical refinement, prompt engineering expertise, and educational design patterns. However, that codebase was not built to the standards of this repository.

**We are not integrating with Oak AI.** We are:

1. **Extracting** the domain knowledge (pedagogical principles, educational patterns, quiz design expertise)
2. **Rebuilding** to our standards (schema-first, TDD, pure functions, type preservation)

This ensures:

- The valuable domain expertise is preserved
- Longevity through maintainability and testability
- Alignment with our architectural principles
- Proper modularity and encapsulation

### Research Delegated to Plan 07

Detailed research into the Oak AI codebase has been elevated to its own comprehensive plan:

**[07-oak-ai-domain-extraction-research-plan.md](./07-oak-ai-domain-extraction-research-plan.md)**

This plan provides:

- Systematic methodology for knowledge extraction
- 7 detailed research areas
- Clear deliverables for each area
- Success criteria and checkpoints
- Integration guidance for subsequent plans

---

## References

### Foundational Documents (Re-read before each session)

- `.agent/directives/rules.md` - Development rules
- `.agent/directives/testing-strategy.md` - TDD approach
- `.agent/directives/schema-first-execution.md` - Type generation mandate

### Related Plans

- `.agent/plans/sdk-and-mcp-enhancements/07-oak-ai-domain-extraction-research-plan.md` - Detailed research plan
- `.agent/plans/sdk-and-mcp-enhancements/improvements.md` - Source requirements

### Research Target

- `reference/oak-ai-lesson-assistant/` - Oak AI codebase for knowledge extraction
