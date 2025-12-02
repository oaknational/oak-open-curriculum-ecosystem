# Section Generation Patterns

**Research Area**: 5 - Lesson Planning Workflow
**Status**: Complete
**Last Updated**: 2025-11-30

---

## Overview

Section-by-section documentation of generation patterns for each lesson plan component, based on the agentic system's section agents.

---

## Key Files Analysed

- All 14 section agent directories in `packages/aila/src/lib/agentic-system/agents/sectionAgents/`
- `packages/aila/src/lib/agentic-system/agents/sectionAgents/sectionAgentRegistry.ts`

---

## Section Agent Registry

### Available Agents

| Agent ID                     | Section(s)             | Purpose                    |
| ---------------------------- | ---------------------- | -------------------------- |
| `titleAgent`                 | title                  | Generate lesson title      |
| `keyStageAgent`              | keyStage               | Set key stage              |
| `subjectAgent`               | subject                | Set subject                |
| `basedOnAgent`               | basedOn                | Reference lesson selection |
| `learningOutcomeAgent`       | learningOutcome        | "I can..." outcome         |
| `learningCycleOutcomesAgent` | learningCycles         | Cycle outcomes             |
| `priorKnowledgeAgent`        | priorKnowledge         | Prior knowledge list       |
| `keyLearningPointsAgent`     | keyLearningPoints      | Key facts                  |
| `misconceptionsAgent`        | misconceptions         | Misconception + response   |
| `keywordsAgent`              | keywords               | Tier 2/3 vocabulary        |
| `starterQuizAgent`           | starterQuiz            | Prior knowledge quiz       |
| `cycleAgent`                 | cycle1, cycle2, cycle3 | Learning cycles            |
| `exitQuizAgent`              | exitQuiz               | Lesson content quiz        |
| `additionalMaterialsAgent`   | additionalMaterials    | Supplementary content      |

### Agent Selection Logic

```typescript
function getAgentForSection(section: LessonPlanKey): SectionAgent {
  return sectionAgentRegistry[section];
}

// Special case: cycles use same agent
function getAgentForCycle(cycleNumber: 1 | 2 | 3): SectionAgent {
  return cycleAgent; // Parameterised by cycle number
}
```

---

## Section Agents

### 1. titleAgent

**Purpose**: Generate a concise, unique lesson title

**Input Requirements**:

- User's initial request or topic
- Subject and key stage context

**Output Schema**:

```typescript
{
  title: string;
} // Max 80 chars, sentence case, no full stop
```

**Key Instructions**:

- Unique statement, not a question
- Matches learning outcome focus
- Narrow from broad topics

### 2. keyStageAgent

**Purpose**: Set the UK key stage for the lesson

**Input Requirements**:

- User specification or inference from context

**Output Schema**:

```typescript
{
  keyStage: KeyStageSlug;
}
```

**Key Instructions**:

- Use kebab-case slugs
- Validate against allowed values

### 3. subjectAgent

**Purpose**: Set the curriculum subject

**Input Requirements**:

- User specification or inference

**Output Schema**:

```typescript
{
  subject: string;
}
```

**Key Instructions**:

- Align with UK National Curriculum subjects
- Consider cross-curricular topics

**Data File**: `subjectsByKeyStage.ts` - Subject lists by key stage

### 4. basedOnAgent

**Purpose**: Handle reference lesson selection

**Input Requirements**:

- User's selection from numbered list
- Relevant lesson metadata

**Output Schema**:

```typescript
{ basedOn: { id: string, title: string } | null }
```

**Key Instructions**:

- Only set if user explicitly chooses
- Extract correct id and title from selection
- Skip if user says "Continue"

### 5. learningOutcomeAgent

**Purpose**: Generate "I can..." learning outcome

**Input Requirements**:

- Title, subject, keyStage
- BasedOn content (if applicable)

**Output Schema**:

```typescript
{
  learningOutcome: string;
} // Max 190 chars, starts with "I can..."
```

**Key Instructions**:

- Pupil voice
- Age-appropriate language
- Achievable in lesson timeframe
- Specific, not vague

### 6. learningCycleOutcomesAgent

**Purpose**: Break learning outcome into 1-3 cycle outcomes

**Input Requirements**:

- learningOutcome
- Subject, keyStage

**Output Schema**:

```typescript
{ learningCycles: string[] } // 1-3 items, max 20 words each
```

**Key Instructions**:

- Start with command words
- Increase in difficulty
- Map to lesson structure

### 7. priorKnowledgeAgent

**Purpose**: Identify prerequisite knowledge

**Input Requirements**:

- learningOutcome, learningCycles
- Subject, keyStage

**Output Schema**:

```typescript
{ priorKnowledge: string[] } // 1-5 items, max 30 words each
```

**Key Instructions**:

- Factual statements (not "Pupils know...")
- Age-appropriate for key stage
- UK curriculum aligned

### 8. keyLearningPointsAgent

**Purpose**: Extract key facts pupils will learn

**Input Requirements**:

- learningOutcome, learningCycles
- Subject, keyStage

**Output Schema**:

```typescript
{ keyLearningPoints: string[] } // 3-5 items
```

**Key Instructions**:

- Knowledge-rich statements
- Not objectives/descriptions
- Specific facts

### 9. misconceptionsAgent

**Purpose**: Identify common misconceptions with corrections

**Input Requirements**:

- keyLearningPoints
- Subject, keyStage context

**Output Schema**:

```typescript
{
  misconceptions: Array<{
    misconception: string; // Max 200 chars
    description: string; // Max 250 chars
  }>;
} // 1-3 items
```

**Key Instructions**:

- Common, not obscure
- Factual corrections only
- Informs quiz design

### 10. keywordsAgent

**Purpose**: Identify Tier 2/3 vocabulary

**Input Requirements**:

- keyLearningPoints
- Subject, keyStage

**Output Schema**:

```typescript
{
  keywords: Array<{
    keyword: string; // Max 30 chars
    definition: string; // Max 200 chars
  }>;
} // 1-5 items
```

**Key Instructions**:

- Tier 2 (academic) or Tier 3 (subject-specific)
- Definition doesn't contain keyword
- Age-appropriate definitions

### 11. starterQuizAgent

**Purpose**: Generate prior knowledge assessment quiz

**Input Requirements**:

- priorKnowledge (primary source)
- misconceptions (for distractors)

**Output Schema**:

```typescript
{
  starterQuiz: QuizV3Schema;
} // 6 multiple-choice questions
```

**Key Instructions**:

- Tests PRIOR KNOWLEDGE ONLY
- Never tests lesson content
- 5/6 pass target
- Difficulty progression
- Quiz design rules apply

### 12. cycleAgent

**Purpose**: Generate learning cycle content

**Input Requirements**:

- learningCycles[n] (specific outcome)
- keyLearningPoints, keywords
- All prior content for context

**Output Schema**:

```typescript
{ cycle1 | cycle2 | cycle3: CycleSchema }
```

**Key Instructions**:

- 10-20 minutes duration (8-12 for KS1)
- Complete structure: explanation, CFU, practice, feedback
- Practice linked to cycle outcome
- Feedback format appropriate to practice type

### 13. exitQuizAgent

**Purpose**: Generate lesson content assessment quiz

**Input Requirements**:

- keyLearningPoints (must cover)
- misconceptions (at least one)
- keywords (at least one)

**Output Schema**:

```typescript
{
  exitQuiz: QuizV3Schema;
} // 6 multiple-choice questions
```

**Key Instructions**:

- Tests LESSON CONTENT ONLY
- Never tests prior knowledge
- Must cover key learning points, misconception, keyword
- 5/6 pass target
- Difficulty progression

### 14. additionalMaterialsAgent

**Purpose**: Generate supplementary content

**Input Requirements**:

- Complete lesson plan
- User specification of what to generate

**Output Schema**:

```typescript
{
  additionalMaterials: string | null;
} // Markdown, max H2
```

**Key Instructions**:

- Narrative, practical, homework, translations, SEND
- Open-ended based on user request
- Append to existing (don't overwrite)

---

## Common Patterns Across Agents

### Shared Identity and Voice

All section agents inherit from `sectionAgentIdentity.ts`:

```typescript
export const sectionAgentIdentity = `# Identity

You are an agent as part of Aila, an AI-powered lesson planning assistant 
designed for use by UK teachers.

You are responsible for generating a section of the lesson plan.

## Markdown
Do not use markdown formatting unless specified for a specific section.

## Language
Use British English spelling and vocabulary.`;
```

### Voice Assignment

| Section                       | Voice                    |
| ----------------------------- | ------------------------ |
| learningOutcome               | PUPIL                    |
| explanation.spokenExplanation | AILA_TO_TEACHER          |
| explanation.slideText         | TEACHER_TO_PUPIL_WRITTEN |
| practice                      | TEACHER_TO_PUPIL_WRITTEN |
| feedback                      | PUPIL                    |
| priorKnowledge                | EXPERT_TEACHER           |
| misconceptions                | EXPERT_TEACHER           |
| keywords                      | TEACHER_TO_PUPIL_WRITTEN |
| quizzes                       | TEACHER_TO_PUPIL_WRITTEN |

### RAG Value Integration

Agents receive relevant exemplar content via `getReleventRAGValues.ts`:

```typescript
async function getRelevantRAGValues(
  section: LessonPlanKey,
  context: LessonContext,
): Promise<ExemplarContent> {
  // Retrieve similar content from vector store
  // Provide as examples in agent prompt
}
```

### Error Handling

Agents can return errors that bubble up to the planner:

```typescript
interface AgentResult {
  success: boolean;
  patches?: Patch[];
  error?: {
    code: string;
    message: string;
    recoverable: boolean;
  };
}
```

---

## Key Insights

### Insight 1: Single Responsibility

Each agent handles one section type. No agent generates multiple unrelated sections.

### Insight 2: Context Accumulation

Later agents receive all prior content. This enables:

- Coherence checking
- Reference to earlier decisions
- No repetition

### Insight 3: Schema-Driven Output

All agents output to predefined schemas. No free-form generation that could break the lesson structure.

### Insight 4: Quiz Agents are Special

Quiz agents import shared quiz design instructions but have different scope rules (starter vs exit).

---

## Extraction Recommendations

### As Agent Configuration

```typescript
const SECTION_AGENT_CONFIG: Record<LessonPlanKey, AgentConfig> = {
  title: {
    requiredInputs: ['topic', 'subject', 'keyStage'],
    outputSchema: TitleSchema,
    voice: 'TEACHER_TO_PUPIL_WRITTEN',
    maxRetries: 2,
  },
  learningOutcome: {
    requiredInputs: ['title', 'keyStage', 'subject'],
    outputSchema: LearningOutcomeSchema,
    voice: 'PUPIL',
    constraints: { maxChars: 190, startsWithICan: true },
  },
  // ... etc
};
```

### Integration Points

- **MCP Tools**: Each agent maps to a potential tool
- **Validation**: Schema-driven output enables validation
- **Prompts**: Instructions extracted for prompt generation
