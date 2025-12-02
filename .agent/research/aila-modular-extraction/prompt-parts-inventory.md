# Prompt Parts Inventory

**Research Area**: 1 - Prompt Architecture
**Status**: Complete
**Last Updated**: 2025-11-30

---

## Overview

Complete catalogue of all prompt parts with domain analysis, capturing the pedagogical expertise encoded in each part.

---

## Key Directories

- `packages/core/src/prompts/lesson-assistant/parts/` (17 parts)
- `packages/aila/src/lib/agentic-system/agents/sharedPromptParts/` (13 parts)

---

## Lesson Assistant Parts

### 1. body.ts (~400 lines)

**Purpose**: Core pedagogical guidance for lesson plan creation. This is the largest and most important part, encoding extensive educational expertise.

**Domain Knowledge Encoded**:

- **Lesson Structure**: Age-appropriate design for UK curriculum
- **Learning Outcome**: "I can..." format, max 30 words, achievable in lesson timeframe
- **Learning Cycles**: Command word usage, max 20 words each, difficulty progression
- **Prior Knowledge**: 1-5 items, max 30 words each, substantive/disciplinary/procedural
- **Key Learning Points**: Knowledge-rich factual statements (not objectives)
- **Misconceptions**: 1-3 items, max 200 chars each, with corrections (max 250 chars)
- **Keywords**: Tier 2/3 vocabulary, max 200 char definitions
- **Quiz Design**: Starter (prior knowledge) vs Exit (lesson content), 6 questions, 5/6 pass target
- **Distractor Design**: Plausible, similar length, same category, no "all/none of above"
- **Learning Cycle Structure**: Explanation (spoken + visual), Check for Understanding, Practice, Feedback
- **Practice Tasks**: Extensive list of ~50 task types with examples
- **Feedback Formats**: Model answer, worked example, or success criteria
- **Additional Materials**: Narratives, practicals, homework, translations, SEND adaptations

**Dependencies**: `TemplateProps` (keyStage, responseMode)

**Extraction Value**: Very High - This encodes years of pedagogical refinement

### 2. task.ts

**Purpose**: Defines the core task for the LLM - creating a lesson plan for specific subject/keyStage.

**Domain Knowledge Encoded**:

- UK National Curriculum alignment
- Age-appropriate language requirement
- School setting appropriateness

**Template Variables**: `subject`, `keyStage`, `title`, `topic`

**Extraction Value**: Medium - Task framing pattern

### 3. context.ts

**Purpose**: Establishes Aila's identity and the interaction context.

**Domain Knowledge Encoded**:

- Target audience: UK teachers
- British English requirement
- Output: Downloadable lesson plan, slides, worksheets
- Process: Staged generation following schema

**Template Variables**: `subject`, `keyStage`, `responseMode`

**Extraction Value**: Medium - Identity pattern

### 4. languageAndVoice.ts

**Purpose**: Defines the 5-voice system for content generation.

**Domain Knowledge Encoded**:

- **AILA_TO_TEACHER**: Supportive expert, can ask for clarification
- **PUPIL**: Age-appropriate, used for "I can..." learning outcomes
- **TEACHER_TO_PUPIL_SLIDES**: Formal, concise, informative, no chat tone
- **TEACHER_TO_PUPIL_SPOKEN**: Professional but friendly, can use analogies
- **EXPERT_TEACHER**: Shares pedagogical expertise, common mistakes, teaching methods

**Dependencies**: None (static content)

**Extraction Value**: Very High - Clear, well-defined voice system

### 5. americanToBritish.ts

**Purpose**: Handles corrections when American spellings are detected.

**Domain Knowledge Encoded**:

- British English is the default for UK teachers
- Examples: colour/color, centre/center

**Dependencies**: `americanisms` array from props

**Extraction Value**: Low - Simple localisation

### 6. rag.ts

**Purpose**: Injects relevant lesson plans from RAG retrieval.

**Domain Knowledge Encoded**:

- Reference lessons called "Oak lessons" to users
- Content alignment, not direct testing of transcript content
- User must explicitly choose to base lesson on retrieved content

**Template Variables**: `relevantLessonPlans`, `summaries`

**Extraction Value**: Medium - RAG integration pattern

### 7. basedOn.ts

**Purpose**: Instructions for adapting an existing lesson plan.

**Domain Knowledge Encoded**:

- Adaptation workflow: Extract title/subject/topic first
- User customisation points: SEND, activities, narratives
- Generate all sections then ask for adaptations

**Template Variables**: `baseLessonPlan`

**Extraction Value**: Medium - Adaptation pattern

### 8. schema.ts

**Purpose**: JSON schema for lesson plan structure (when not using structured outputs).

**Domain Knowledge Encoded**:

- Lesson plan structure definition
- Field descriptions and constraints

**Template Variables**: `lessonPlanJsonSchema`

**Extraction Value**: Low - Schema is better defined in Zod

### 9. currentLessonPlan.ts

**Purpose**: Injects the current state of the lesson plan.

**Domain Knowledge Encoded**:

- Progress tracking through lesson creation

**Template Variables**: `lessonPlan`

**Extraction Value**: Low - Implementation detail

### 10. endingTheInteraction.ts

**Purpose**: Defines the format for messages to users.

**Domain Knowledge Encoded**:

- JSON format for user messages: `{"type": "text", "message": "..."}`

**Dependencies**: None

**Extraction Value**: Low - Protocol detail

### 11. generateResponse.ts

**Purpose**: Instructions for batch generation mode (non-interactive).

**Domain Knowledge Encoded**:

- Non-interactive generation flow

**Dependencies**: `responseMode === "generate"`

**Extraction Value**: Low - Alternative mode

### 12. interactingWithTheUser.ts (~230 lines)

**Purpose**: Orchestrates the interactive lesson creation process.

**Domain Knowledge Encoded**:

- **Section Groups and Ordering**:
  - Group 1: title, keyStage, subject (must have before proceeding)
  - Group 2: basedOn (optional), learningOutcome, learningCycles
  - Group 3: priorKnowledge, keyLearningPoints, misconceptions, keywords
  - Group 4: starterQuiz, cycle1, cycle2, cycle3, exitQuiz
  - Group 5: additionalMaterials
- **RAG Flow**: Present relevant lessons, user selects or starts from scratch
- **Batch Generation**: Allow user to request full generation without steps
- **User Content Import**: Accept existing lessons, transcripts, etc.

**Dependencies**: `lessonPlan`, `relevantLessonPlans`

**Extraction Value**: Very High - Orchestration logic and section dependencies

### 13. lessonComplete.ts

**Purpose**: Defines completion criteria and consistency check.

**Domain Knowledge Encoded**:

- All keys must have values for completion
- Consistency check: spelling, capitalisation, title matching
- Common Starter Quiz error: testing lesson content instead of prior knowledge

**Dependencies**: None

**Extraction Value**: Medium - Completion criteria

### 14. promptingTheUser.ts

**Purpose**: Guidelines for prompting the user during interaction.

**Domain Knowledge Encoded**:

- User engagement patterns
- When to ask for input vs proceed

**Dependencies**: None

**Extraction Value**: Low - UX pattern

### 15. protocol.ts

**Purpose**: Defines JSON Patch protocol for lesson editing.

**Domain Knowledge Encoded**:

- JSON Patch (RFC 6902) for lesson modifications
- Response format: patches + prompt
- Operations: add, remove, replace
- One key per patch document

**Template Variables**: `isUsingStructuredOutput`, `llmResponseJsonSchema`

**Extraction Value**: Medium - Protocol definition

### 16. signOff.ts

**Purpose**: Closing instructions for the prompt.

**Domain Knowledge Encoded**:

- Final reminders and constraints

**Dependencies**: None

**Extraction Value**: Low - Closing pattern

---

## Agentic System Shared Parts

Located in `packages/aila/src/lib/agentic-system/agents/sharedPromptParts/`

### 1. basedOnContent.part.ts

**Purpose**: Injects content from the reference lesson being adapted.

**Domain Knowledge Encoded**: Adaptation context

### 2. changesMade.part.ts

**Purpose**: Tracks changes made in the current interaction.

**Domain Knowledge Encoded**: Change tracking pattern

### 3. currentDocument.part.ts

**Purpose**: Injects the full current lesson plan state.

**Domain Knowledge Encoded**: State injection pattern

### 4. currentSectionValue.part.ts

**Purpose**: Injects the value of the specific section being edited.

**Domain Knowledge Encoded**: Section-focused editing

### 5. errors.part.ts

**Purpose**: Reports validation errors for correction.

**Domain Knowledge Encoded**: Error handling pattern

### 6. exemplarContent.part.ts

**Purpose**: Provides examples of good content for the section.

**Domain Knowledge Encoded**: Exemplar-based guidance

### 7. messageHistory.part.ts

**Purpose**: Injects conversation history for context.

**Domain Knowledge Encoded**: Context window management

### 8. plannerAgentResponse.part.ts

**Purpose**: Passes planner decisions to section agents.

**Domain Knowledge Encoded**: Agent coordination

### 9. relevantLessons.part.ts

**Purpose**: RAG results for section agents.

**Domain Knowledge Encoded**: RAG integration

### 10. stepsExecuted.part.ts

**Purpose**: Tracks which steps have been completed.

**Domain Knowledge Encoded**: Progress tracking

### 11. unplannedSections.part.ts

**Purpose**: Lists sections not yet addressed by the planner.

**Domain Knowledge Encoded**: Gap identification

### 12. userMessage.part.ts

**Purpose**: Injects the current user message.

**Domain Knowledge Encoded**: User input handling

---

## Common Patterns Across Parts

### 1. Template Function Pattern

All parts are functions returning strings:

```typescript
export const partName = (props: TemplateProps) => `...${props.value}...`;
```

### 2. Conditional Content Pattern

Content varies based on props:

```typescript
${responseMode === "interactive" ? interactiveContent : ""}
```

### 3. Voice Annotation Pattern

Instructions specify which voice to use:

```
Written in the EXPERT_TEACHER voice.
```

### 4. Example/Non-Example Pattern

Good and bad examples provided:

```
Example: "I can identify the differences between plant and animal cells"
Non-example: "Cells" (too vague)
```

### 5. Constraint Specification Pattern

Limits embedded in prose:

```
The word limit for this is 30 words and no more.
Max 200 characters.
1-3 items.
```

---

## Extraction Candidates

### Priority 1: High Value

| Part                        | Domain Knowledge         | Extraction Format |
| --------------------------- | ------------------------ | ----------------- |
| `body.ts`                   | Lesson design principles | Structured rules  |
| `languageAndVoice.ts`       | Voice definitions        | Data structure    |
| `interactingWithTheUser.ts` | Section ordering         | Dependency graph  |

### Priority 2: Medium Value

| Part          | Domain Knowledge    | Extraction Format   |
| ------------- | ------------------- | ------------------- |
| `rag.ts`      | RAG integration     | Pattern description |
| `basedOn.ts`  | Adaptation workflow | Process description |
| `protocol.ts` | Editing protocol    | Specification       |

### Priority 3: Low Value (Implementation Details)

- `currentLessonPlan.ts`
- `endingTheInteraction.ts`
- `signOff.ts`
- Most shared prompt parts (coordination mechanics)

---

## Key Insight: Knowledge Density

The `body.ts` file alone contains more pedagogical expertise than many education textbooks:

- 50+ practice task types with examples
- Complete quiz design methodology
- Learning cycle pedagogy
- Age-appropriate content guidelines
- UK curriculum alignment principles

This is the primary extraction target for domain knowledge.
