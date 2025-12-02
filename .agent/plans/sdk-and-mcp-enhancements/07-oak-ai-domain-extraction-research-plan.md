# Oak AI Domain Extraction Research Plan

**Created**: 2025-11-30  
**Status**: ✅ COMPLETE  
**Completed**: 2025-11-30  
**Priority**: HIGH - Strategic foundation for SDK and MCP enhancement work  
**Actual Duration**: ~20 hours of focused research  
**Output Directory**: `.agent/research/aila-modular-extraction/`

---

## ⚠️ SCOPE: RESEARCH AND REPORT ONLY

**This plan is strictly research and documentation.**

- ✅ Read and analyse code in `reference/oak-ai-lesson-assistant/`
- ✅ Create research reports and documentation
- ✅ Document patterns, principles, and domain knowledge
- ✅ Make recommendations for future implementation
- ❌ **DO NOT** modify any code in this repository
- ❌ **DO NOT** create new code files (except research documentation)
- ❌ **DO NOT** begin implementation work

Implementation will be a separate, subsequent effort after research is complete and reviewed.

---

## Executive Summary

The Oak AI Lesson Assistant repository (`reference/oak-ai-lesson-assistant/`) contains years of accumulated pedagogical expertise, prompt engineering refinement, and educational domain knowledge. This research plan establishes a systematic, exhaustive approach to understanding that domain knowledge so it can be extracted and rebuilt to the highest standards of software engineering excellence.

**This is not a code migration exercise.** This is knowledge archaeology - understanding what was learned, what works, and what domain expertise is encoded in the implementation decisions - so that we can rebuild it properly.

---

## Foundational Commitment

Before beginning any research task, and at the start of each working session, re-read and recommit to:

1. `.agent/directives-and-memory/rules.md` - Our development principles
2. `.agent/directives-and-memory/testing-strategy.md` - Our testing philosophy
3. `.agent/directives-and-memory/schema-first-execution.md` - Our type generation mandate

**The First Question always applies**: Could it be simpler without compromising quality?

**The Meta Question for this research**: Are we extracting knowledge that will deliver value at the system level, or are we cataloguing implementation details?

---

## Research Objectives

### Primary Objectives

1. **Catalogue Domain Knowledge**: Identify and document the pedagogical expertise, educational design patterns, and curriculum domain knowledge encoded in the Oak AI codebase.

2. **Understand Prompt Architecture**: Deeply understand how prompts are structured, composed, and evolved - not to copy, but to understand the underlying principles.

3. **Extract Design Rationale**: Capture the "why" behind implementation decisions, especially where comments, naming, or structure reveal pedagogical reasoning.

4. **Identify Reusable Patterns**: Find patterns that can be rebuilt to our standards - pure functions, schema-driven, TDD-first.

5. **Map Data Models**: Understand the domain model for lessons, quizzes, learning cycles, and related educational concepts.

### Secondary Objectives

1. **Identify Complexity to Avoid**: Document areas where complexity exists without clear justification, so we can simplify.

2. **Understand Evolution**: Where possible, understand how patterns evolved and what lessons were learned.

3. **Capture Edge Cases**: Document edge cases and special handling that reveals deep domain understanding.

---

## Research Methodology

### Principles

1. **Read Code as Documentation**: The code is a record of decisions. Read it to understand the decisions, not just the mechanics.

2. **Follow the Data**: Trace how educational concepts (lesson, quiz, key stage, learning outcome) flow through the system.

3. **Question Everything**: For each pattern, ask: "What domain knowledge does this encode? Is this essential or accidental complexity?"

4. **Document as You Go**: Create research notes immediately. Do not rely on memory.

5. **Preserve Context**: When documenting, include enough context that the documentation is useful in isolation.

### Process

For each research area:

1. **Survey**: List all relevant files and their apparent purposes
2. **Deep Read**: Read each file thoroughly, making notes on domain knowledge
3. **Trace Flows**: Follow data and control flow to understand integration
4. **Synthesise**: Create summary documentation capturing the essential knowledge
5. **Evaluate**: Assess what is worth extracting and rebuilding

---

## Research Areas

### Area 1: Prompt Architecture and Composition

**Objective**: Understand how prompts are structured, what parts they contain, and the compositional patterns used.

**Target Directories**:

```
packages/core/src/prompts/
packages/aila/src/lib/agents/prompts/
packages/aila/src/lib/agentic-system/agents/
packages/teaching-materials/src/documents/
```

**Investigation Tasks**:

#### 1.1 Core Prompt Type System

- [ ] Document `OakPromptDefinition`, `OakPromptVariant`, `OakPromptParts` structure
- [ ] Understand the role of `inputSchema` and `outputSchema` in prompt definitions
- [ ] Trace how variants are generated and selected
- [ ] Document the prompt parts composition pattern (`getPromptParts()`)

#### 1.2 Prompt Parts Analysis

- [ ] Create exhaustive inventory of all prompt parts in `lesson-assistant/parts/`
- [ ] For each part, document:
  - Purpose and role in the overall prompt
  - Dependencies on other parts or context
  - Domain knowledge encoded (educational concepts, pedagogical principles)
  - Template variables and their sources
- [ ] Identify common patterns across parts
- [ ] Document the order and conditional inclusion logic

#### 1.3 Multi-Agent Prompt Architecture

- [ ] Document the planner → section agent architecture
- [ ] For each section agent, document:
  - Identity and role
  - Instructions structure
  - Schema definition
  - How it integrates with the planner
- [ ] Document shared prompt parts in agentic system
- [ ] Understand the `createPromptPartMessageFn` pattern

#### 1.4 Prompt Builder Patterns

- [ ] Document builder functions in teaching-materials (`buildStarterQuizPrompt`, etc.)
- [ ] Understand the helper function pattern (`getLessonDetails`, `getQuizStructure`, etc.)
- [ ] Document the refinement pattern for iterative improvement
- [ ] Trace how system messages differ from user prompts

**Deliverables**:

- `.agent/research/aila-modular-extraction/prompt-architecture.md` - Comprehensive prompt architecture documentation
- `.agent/research/aila-modular-extraction/prompt-parts-inventory.md` - Complete inventory of all prompt parts with domain analysis
- `.agent/research/aila-modular-extraction/prompt-patterns-worth-extracting.md` - Patterns identified for extraction

---

### Area 2: Educational Domain Model

**Objective**: Understand the data model for educational concepts - lessons, quizzes, learning cycles, key stages, subjects, and their relationships.

**Target Files**:

```
packages/aila/src/protocol/schema.ts
packages/db/schemas/*.ts
packages/core/src/models/*.ts
packages/teaching-materials/src/documents/schemas/
```

**Investigation Tasks**:

#### 2.1 Lesson Plan Schema

- [ ] Document the complete `PartialLessonPlan` schema
- [ ] For each field, document:
  - Purpose and usage
  - Validation rules
  - Relationships to other fields
  - Educational rationale for inclusion
- [ ] Understand optional vs required fields and why
- [ ] Document the JSON schema generation

#### 2.2 Quiz Model

- [ ] Document quiz question types (`multiple-choice`, `short-answer`, `match`, `order`)
- [ ] For each type, document:
  - Structure (question, answers, distractors, etc.)
  - Educational purpose
  - Constraints and validation
- [ ] Document the difference between starter quiz and exit quiz (pedagogical purpose)
- [ ] Understand distractor design principles encoded in the model

#### 2.3 Learning Cycles Model

- [ ] Document the learning cycle structure (explanation, check for understanding, practice, feedback)
- [ ] Understand the pedagogical foundation for this structure
- [ ] Document timing constraints and their rationale
- [ ] Understand cycle progression patterns

#### 2.4 Curriculum Taxonomy

- [ ] Document key stage definitions and relationships
- [ ] Document year group to key stage mappings
- [ ] Document subject categorisation
- [ ] Understand age-appropriateness encoding

#### 2.5 Database Schema Analysis

- [ ] Document the Prisma schema structure
- [ ] Understand lesson, programme, unit, question relationships
- [ ] Document any domain knowledge in schema constraints

**Deliverables**:

- `.agent/research/aila-modular-extraction/domain-model.md` - Complete educational domain model documentation
- `.agent/research/aila-modular-extraction/quiz-design-principles.md` - Quiz design knowledge extracted from code
- `.agent/research/aila-modular-extraction/learning-cycle-pedagogy.md` - Learning cycle educational foundation

---

### Area 3: Quiz Generation Expertise

**Objective**: Deeply understand the quiz generation logic, including question design, distractor creation, and pedagogical constraints.

**Target Files**:

```
packages/core/src/prompts/lesson-planner/extend-lesson-plan-quiz/
packages/core/src/prompts/lesson-assistant/parts/body.ts (quiz sections)
packages/teaching-materials/src/documents/teachingMaterials/starterQuiz/
packages/teaching-materials/src/documents/teachingMaterials/exitQuiz/
packages/aila/src/lib/agentic-system/agents/sectionAgents/starterQuizAgent/
packages/aila/src/lib/agentic-system/agents/sectionAgents/exitQuizAgent/
packages/aila/src/lib/agents/prompts/shared/quizQuestionDesignInstructions.ts
```

**Investigation Tasks**:

#### 3.1 Quiz Purpose and Design

- [ ] Document the pedagogical purpose of starter quizzes (prior knowledge assessment)
- [ ] Document the pedagogical purpose of exit quizzes (learning assessment)
- [ ] Understand the 6-question structure rationale
- [ ] Document difficulty progression requirements

#### 3.2 Question Design Principles

- [ ] Extract all question design rules from prompts
- [ ] Document negative phrasing prohibitions and rationale
- [ ] Document command word usage by key stage
- [ ] Understand higher-order thinking assessment encoding

#### 3.3 Distractor Design

- [ ] Document all distractor quality criteria
- [ ] Extract the "plausible but incorrect" encoding
- [ ] Document length and style matching requirements
- [ ] Understand misconception incorporation

#### 3.4 Quiz Constraints

- [ ] Document character limits and their rationale
- [ ] Document answer randomisation requirements
- [ ] Understand content scope constraints (prior knowledge vs lesson content)
- [ ] Document overlap prevention rules

**Deliverables**:

- `.agent/research/aila-modular-extraction/quiz-generation-expertise.md` - Complete quiz generation knowledge base
- `.agent/research/aila-modular-extraction/distractor-design-rules.md` - Distractor design principles as pure functions

---

### Area 4: Content Moderation and Safety

**Objective**: Understand the content moderation system, including categories, scoring, and safety constraints.

**Target Files**:

```
packages/teaching-materials/src/moderation/moderationPrompt.ts
packages/core/src/utils/ailaModeration/moderationPrompt.ts
packages/core/src/threatDetection/
packages/aila/src/lib/openai/
```

**Investigation Tasks**:

#### 4.1 Moderation Categories

- [ ] Document all moderation category groups
- [ ] For each category:
  - Document the educational context
  - Understand the 1-5 Likert scale criteria
  - Document age/key-stage considerations
- [ ] Understand the "Toxic" category distinction

#### 4.2 Safety Patterns

- [ ] Document threat detection integration (Lakera)
- [ ] Understand prompt injection protection
- [ ] Document content filtering approaches

#### 4.3 Age-Appropriateness

- [ ] Document how content is assessed for age groups
- [ ] Understand key stage specific moderation

**Deliverables**:

- `.agent/research/aila-modular-extraction/content-moderation-system.md` - Moderation system documentation
- `.agent/research/aila-modular-extraction/safety-patterns.md` - Safety patterns for educational AI

---

### Area 5: Lesson Planning Workflow

**Objective**: Understand the complete lesson planning workflow, from initial request to complete lesson plan.

**Target Directories**:

```
packages/aila/src/core/
packages/aila/src/features/
packages/aila/src/lib/agentic-system/
packages/core/src/prompts/lesson-planner/
```

**Investigation Tasks**:

#### 5.1 Workflow Stages

- [ ] Document the lesson planning state machine
- [ ] Understand section groups and their ordering
- [ ] Document dependency relationships between sections
- [ ] Trace the complete flow from empty to complete lesson

#### 5.2 Section Generation

- [ ] For each lesson section, document:
  - Generation approach
  - Required inputs
  - Validation criteria
  - Pedagogical constraints
- [ ] Understand section iteration and refinement

#### 5.3 User Interaction Patterns

- [ ] Document how user feedback is incorporated
- [ ] Understand clarification request patterns
- [ ] Document the "based on existing lesson" pattern

#### 5.4 RAG Integration

- [ ] Document how relevant lessons are retrieved
- [ ] Understand similarity search patterns
- [ ] Document how retrieved content influences generation

**Deliverables**:

- `.agent/research/aila-modular-extraction/lesson-planning-workflow.md` - Complete workflow documentation
- `.agent/research/aila-modular-extraction/section-generation-patterns.md` - Section-by-section generation knowledge

---

### Area 6: Language and Voice

**Objective**: Understand the language, tone, and voice requirements for educational content generation.

**Target Files**:

```
packages/core/src/prompts/lesson-assistant/parts/languageAndVoice.ts
packages/aila/src/lib/agentic-system/agents/sectionAgents/shared/voices/
packages/aila/src/lib/agentic-system/agents/sectionAgents/shared/identityAndVoice.ts
packages/teaching-materials/src/documents/teachingMaterials/promptHelpers.ts (language section)
```

**Investigation Tasks**:

#### 6.1 British English Requirements

- [ ] Document all British English encoding
- [ ] Understand terminology requirements
- [ ] Document spelling and vocabulary standards

#### 6.2 Voice and Tone

- [ ] Document the voice system if present
- [ ] Understand audience-appropriate language encoding
- [ ] Document formality levels by context

#### 6.3 Age-Appropriate Language

- [ ] Document how language is adjusted for key stages
- [ ] Understand complexity adaptation

**Deliverables**:

- `.agent/research/aila-modular-extraction/language-and-voice.md` - Language requirements documentation

---

### Area 7: Teaching Materials Generation

**Objective**: Understand the generation of teaching materials beyond the core lesson plan.

**Target Directory**:

```
packages/teaching-materials/src/
```

**Investigation Tasks**:

#### 7.1 Material Types

- [ ] Document all material types (glossary, comprehension, etc.)
- [ ] For each type, document:
  - Purpose and usage
  - Generation approach
  - Quality criteria

#### 7.2 Export Formats

- [ ] Document export capabilities
- [ ] Understand slide generation patterns
- [ ] Document document structure requirements

**Deliverables**:

- `.agent/research/aila-modular-extraction/teaching-materials.md` - Teaching materials generation documentation

---

## Research Output Structure

```
.agent/research/aila-modular-extraction/
├── README.md                           ← Index and executive summary
├── prompt-architecture.md              ← Area 1: Prompt composition patterns
├── prompt-parts-inventory.md           ← Area 1: Complete parts catalogue
├── prompt-patterns-worth-extracting.md ← Area 1: Extraction candidates
├── domain-model.md                     ← Area 2: Educational domain model
├── quiz-design-principles.md           ← Area 2: Quiz design knowledge
├── learning-cycle-pedagogy.md          ← Area 2: Learning cycle foundation
├── quiz-generation-expertise.md        ← Area 3: Quiz generation deep dive
├── distractor-design-rules.md          ← Area 3: Distractor design as rules
├── content-moderation-system.md        ← Area 4: Moderation documentation
├── safety-patterns.md                  ← Area 4: Safety patterns
├── lesson-planning-workflow.md         ← Area 5: Workflow documentation
├── section-generation-patterns.md      ← Area 5: Section generation
├── language-and-voice.md               ← Area 6: Language requirements
├── teaching-materials.md               ← Area 7: Teaching materials
└── extraction-recommendations.md       ← Final: What to extract and how
```

---

## Success Criteria

### Research Quality

- [ ] Every research area has comprehensive documentation
- [ ] Domain knowledge is captured in a form independent of the original implementation
- [ ] Educational rationale is documented separately from implementation mechanics
- [ ] Patterns identified for extraction are clearly justified

### Documentation Quality

- [ ] Documentation can be understood without access to the original codebase
- [ ] Each document has clear structure and navigation
- [ ] Examples are included where they aid understanding
- [ ] Cross-references connect related concepts

### Extraction Readiness

- [ ] Clear list of patterns worth extracting
- [ ] For each pattern, clear understanding of:
  - What domain knowledge it encodes
  - How it could be implemented to our standards (schema-first, TDD)
  - What simplification opportunities exist
- [ ] Prioritised extraction roadmap

---

## Timeline and Checkpoints

### Phase 1: Survey and Foundation (4-6 hours)

- Complete file inventory for all research areas
- Read foundational documents (rules.md, testing-strategy.md, schema-first-execution.md)
- Establish documentation structure
- **Checkpoint**: Research structure in place, all files identified

### Phase 2: Core Domain Research (6-8 hours)

- Complete Areas 1, 2, and 3 (Prompts, Domain Model, Quiz Generation)
- These are the highest-value areas for extraction
- **Checkpoint**: Core domain knowledge documented

### Phase 3: Supporting Research (4-6 hours)

- Complete Areas 4, 5, 6, and 7 (Moderation, Workflow, Language, Materials)
- **Checkpoint**: All areas documented

### Phase 4: Synthesis and Recommendations (2-4 hours)

- Create extraction recommendations document
- Prioritise extraction targets
- Identify integration points with existing SDK and MCP work
- **Checkpoint**: Research complete, ready for implementation planning

---

## Integration with Existing Plans

This research plan provides the foundation for:

| Existing Plan                               | Integration Point                            |
| ------------------------------------------- | -------------------------------------------- |
| Plan 04 (Prompts and Agent Guidance)        | Quiz prompt design, learning outcome prompts |
| Plan 01 (Tool Metadata Enhancement)         | Domain terminology, educational context      |
| Plan 02 (Curriculum Ontology Resource)      | Domain model, taxonomy knowledge             |
| Plan 03 (Infrastructure and Advanced Tools) | Generation patterns, workflow integration    |

The `extraction-recommendations.md` deliverable will provide specific guidance for incorporating extracted knowledge into each existing plan.

---

## Risk Mitigation

### Risk: Analysis Paralysis

**Mitigation**: Time-box each research area. Document what is known, note gaps, move on.

### Risk: Copying Instead of Understanding

**Mitigation**: Always ask "what domain knowledge does this encode?" before documenting code structure.

### Risk: Losing Context

**Mitigation**: Document immediately. Include enough context in each note for standalone understanding.

### Risk: Scope Creep

**Mitigation**: Stay focused on extractable domain knowledge. Implementation details are secondary.

---

## References

- `.agent/directives-and-memory/rules.md` - Development principles
- `.agent/directives-and-memory/testing-strategy.md` - Testing philosophy
- `.agent/directives-and-memory/schema-first-execution.md` - Type generation mandate
- `reference/oak-ai-lesson-assistant/` - Research target repository
- `.agent/plans/sdk-and-mcp-enhancements/06-ux-improvements-and-research-plan.md` - Parent plan

---

## Appendix: Key Files Quick Reference

### Highest Priority Files

```
# Prompt Architecture
packages/core/src/prompts/lesson-assistant/parts/body.ts
packages/core/src/prompts/lesson-assistant/index.ts
packages/core/src/prompts/types.ts

# Domain Model
packages/aila/src/protocol/schema.ts
packages/db/schemas/lesson.ts

# Quiz Expertise
packages/aila/src/lib/agents/prompts/shared/quizQuestionDesignInstructions.ts
packages/teaching-materials/src/documents/teachingMaterials/promptHelpers.ts

# Moderation
packages/teaching-materials/src/moderation/moderationPrompt.ts

# Agentic System
packages/aila/src/lib/agentic-system/agents/plannerAgent/plannerAgent.instructions.ts
packages/aila/src/lib/agentic-system/agents/sectionAgents/shared/sectionAgentIdentity.ts
```

---

_This research plan prioritises depth over speed. The goal is comprehensive understanding that enables excellent re-implementation, not rapid cataloguing._
