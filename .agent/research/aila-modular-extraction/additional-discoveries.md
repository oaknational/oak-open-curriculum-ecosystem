# Additional Discoveries from Oak AI Lesson Assistant

**Status**: Complete
**Date**: 2025-11-30

---

## Overview

This document captures additional valuable knowledge discovered from deeper exploration of the `oak-ai-lesson-assistant` repository, beyond the initial research scope.

---

## 1. Quiz RAG Pipeline Architecture

A sophisticated multi-stage quiz generation system that could inform future quiz generation tools.

### Pipeline Components

**Source**: `packages/aila/src/core/quiz/`

```
Generator → Candidate Pool → Reranker → Selector → Final Quiz
```

### Generator Types

```typescript
export const QuizGeneratorTypeSchema = z.enum([
  'rag', // RAG-based retrieval from existing questions
  'ml', // ML-powered semantic search
  'ml-multi-term', // Multi-term semantic search
  'basedOnRag', // Based on reference lesson's quiz
]);
```

### Reranker Types

```typescript
export const QuizRerankerTypeSchema = z.enum([
  'ai-evaluator', // AI-powered quality evaluation
  'return-first', // Simple first-match selection
  'no-op', // Pass-through (no reranking)
]);
```

### Selector Types

```typescript
export const QuizSelectorTypeSchema = z.enum([
  'simple', // Basic selection algorithm
  'llm-quiz-composer', // LLM-powered composition
]);
```

### Key Insight

The quiz pipeline demonstrates a **multi-source candidate generation** pattern:

1. Generate candidates from multiple sources (RAG, ML search, basedOn)
2. Pool candidates together
3. Rerank for quality
4. Select final questions based on criteria (difficulty progression, coverage)

---

## 2. User Feedback Categories

**Source**: `packages/db/prisma/schema.prisma`

### Flag Types (Issue Reporting)

```typescript
enum AilaUserFlagType {
  INAPPROPRIATE; // Content inappropriate for audience
  INACCURATE; // Factually incorrect
  TOO_HARD; // Too difficult for key stage
  TOO_EASY; // Too simple for key stage
  OTHER; // Other concerns
}
```

### Modification Actions (Edit Requests)

```typescript
enum AilaUserModificationAction {
  MAKE_IT_HARDER; // Increase difficulty
  MAKE_IT_EASIER; // Decrease difficulty
  SHORTEN_CONTENT; // Reduce length
  ADD_MORE_DETAIL; // Expand content
  ADD_HOMEWORK_TASK; // Include homework
  ADD_NARRATIVE; // Add teacher narrative
  ADD_PRACTICE_QUESTIONS; // More practice opportunities
  TRANSLATE_KEYWORDS; // Add keyword translations
  ADD_PRACTICAL_INSTRUCTIONS; // Include hands-on activities
  OTHER; // Other modifications
}
```

### Value for MCP Tools

These categories could become:

- Standard feedback schemas for lesson-related tools
- Predefined action types for edit requests
- Validation categories for generated content

---

## 3. Agent Definition Architecture

**Source**: `packages/aila/src/lib/agents/agents.ts`

### Pattern: Dual Schema Validation

Each agent uses two schemas:

```typescript
type PromptAgentDefinition<SchemaForLLM extends z.ZodSchema, SchemaStrict extends z.ZodSchema> = {
  type: 'prompt';
  name: AgentName;
  prompt: string;
  schemaForLLM: SchemaForLLM; // Flexible for LLM output
  schemaStrict: SchemaStrict; // Strict for storage
  extractRagData: (exampleLessonPlan: CompletedLessonPlan) => string | null;
};
```

### Key Insight

- **schemaForLLM**: More permissive schema for LLM-generated content (e.g., `KeyLearningPointsSchema`)
- **schemaStrict**: Strict validation before storage (e.g., `KeyLearningPointsStrictMax5Schema`)

This pattern allows LLMs flexibility while maintaining data quality.

### Section-to-Agent Mapping

Subject-specific routing:

```typescript
starterQuiz: (ctx) => {
  if (ctx.lessonPlan.subject === 'maths') {
    return 'mathsStarterQuiz';
  }
  return 'starterQuiz';
};
```

Maths gets special quiz handling with RAG-based generation.

---

## 4. Categorisation System

**Source**: `packages/aila/src/features/categorisation/categorisers/AilaCategorisation.ts`

### Purpose

AI-powered extraction of curriculum metadata from free-text input.

### Input

User's natural language description of their lesson plan request.

### Output

```typescript
{
  reasoning: string,    // Why these values were chosen
  keyStage: string,     // Slug: key-stage-1, key-stage-2, etc.
  subject: string,      // Slug: maths, english, science, etc.
  title: string,        // Lesson title in sentence case
  topic: string         // Lesson topic
}
```

### Key Rules

1. **Handle aliases**: "KS3" → "key-stage-3", "Year 10" → "key-stage-4"
2. **Subject normalisation**: "Math" → "maths", "PE" → "physical-education"
3. **British English**: Convert American spellings ("Globalization" → "Globalisation")
4. **Educated guessing**: Infer key stage from topic ("Plate tectonics" → Geography, KS2)
5. **Sentence case titles**: Never include "Lesson about" prefix

### Value for MCP Tools

This categorisation logic could become a pre-processing tool that normalises user input before lesson generation.

---

## 5. Question Types and Structure

**Source**: `packages/aila/src/core/quiz/fixtures/quizQuestion.fixture.ts`

### Supported Question Types

1. **Multiple Choice**: One correct answer, 2+ distractors
2. **Short Answer**: Fill-in-the-blank with multiple accepted answers

### Question Structure

```typescript
interface RagQuizQuestion {
  question: {
    questionType: 'multiple-choice' | 'short-answer';
    question: string; // The question text (may include {{}} placeholders)
    answers: string[]; // Correct answer(s)
    distractors?: string[]; // For multiple choice
    hint: string; // Help text for students
  };
  sourceUid: string;
  source: HasuraQuizQuestion; // Full source data
  imageMetadata: ImageMetadata[];
}
```

### Fill-in-the-Blank Pattern

Questions use `{{ }}` to indicate blanks:

```
"Adjacent multiples of 8 can be found by increasing or decreasing a multiple by {{ }}."
```

---

## 6. Good vs Bad Question Examples

**Source**: `packages/aila/src/core/quiz/fixtures/quizQuestion.fixture.ts`

### Good Question Characteristics

```typescript
{
  question: "Two shapes are {{}} if the only difference between them is their size.",
  answers: ["similar"],
  hint: "Think about shapes that look the same but are different sizes.",
  feedback: "Correct! Similar shapes have the same shape but different sizes."
}
```

- Clear, grammatically correct
- Specific, focused question
- Helpful hint
- Educational feedback

### Bad Question Characteristics (from `cachedBadQuiz`)

```typescript
{
  question: "angles?????",
  answers: ["180"],
  hint: "just guess lol",
  feedback: "idk man just put 180"
}
```

- Vague or incomplete question
- Unhelpful hint
- Non-educational feedback
- Informal/inappropriate language

### Value for MCP Tools

These fixtures provide excellent test cases for quiz validation functions.

---

## 7. Model Configuration Defaults

**Source**: `packages/aila/src/constants.ts`

```typescript
export const DEFAULT_MODEL: OpenAI.Chat.ChatModel = 'gpt-4o-2024-08-06';
export const DEFAULT_MODERATION_MODEL: OpenAI.Chat.ChatModel = 'gpt-4o-2024-08-06';
export const DEFAULT_CATEGORISE_MODEL: OpenAI.Chat.ChatModel = 'gpt-4o-2024-08-06';
export const DEFAULT_TEMPERATURE = 0.7;
export const DEFAULT_MODERATION_TEMPERATURE = 0.7;
export const DEFAULT_NUMBER_OF_RECORDS_IN_RAG = 5;
export const DEFAULT_QUIZ_GENERATORS: QuizGeneratorType[] = ['ml', 'rag', 'basedOnRag'];
```

### Key Insight

- Same model (gpt-4o) used across generation, moderation, and categorisation
- Temperature 0.7 balances creativity and consistency
- RAG returns 5 records by default
- Quiz generation uses all three generator types

---

## 8. Lesson Plan Compression for RAG

**Source**: `packages/aila/src/utils/lessonPlan/compressedLessonPlanForRag.ts`

### Pattern

Quizzes are excluded when compressing lesson plans for RAG:

```typescript
export function compressedLessonPlanForRag(lessonPlan: PartialLessonPlan) {
  const { exitQuiz, starterQuiz, ...rest } = lessonPlan;
  return JSON.stringify(rest);
}
```

### Rationale

- Quizzes are large and reduce signal-to-noise in embeddings
- Core content (learning outcome, cycles, keywords) is more relevant for similarity
- Quizzes are generated separately through dedicated pipeline

---

## 9. Section Groups (Canonical Order)

**Source**: `packages/aila/src/lib/agents/lessonPlanSectionGroups.ts`

```typescript
export const sectionGroups: SectionGroups = [
  ['basedOn', 'learningOutcome', 'learningCycles'],
  ['priorKnowledge', 'keyLearningPoints', 'misconceptions', 'keywords'],
  ['starterQuiz', 'cycle1', 'cycle2', 'cycle3', 'exitQuiz'],
  ['additionalMaterials'],
];
```

### Key Insight

This defines the **generation order** and **dependency groups**:

1. **Foundation**: Learning outcome and cycle structure
2. **Context**: Background knowledge and key content
3. **Delivery**: Assessment and teaching content
4. **Extras**: Supplementary materials

---

## 10. Key Stage to Year Mapping (Implicit)

From the categorisation system:

| Key Stage | Year Groups | Typical Ages |
| --------- | ----------- | ------------ |
| KS1       | Years 1-2   | 5-7          |
| KS2       | Years 3-6   | 7-11         |
| KS3       | Years 7-9   | 11-14        |
| KS4       | Years 10-11 | 14-16        |
| KS5       | Years 12-13 | 16-18        |

---

## Recommendations for Integration

### Immediate Quick Wins

1. **User feedback enums** → Standard validation types
2. **Question type definitions** → Schema validation
3. **Good/bad question fixtures** → Test data for validators
4. **Categorisation output schema** → Pre-processing tool

### Medium-Term Enhancements

1. **Dual schema pattern** → MCP tool input/output validation
2. **Section groups** → Dependency management for tool orchestration
3. **Quiz RAG pipeline** → Advanced quiz generation architecture

### Long-Term Opportunities

1. **Agent definition architecture** → MCP tool composition pattern
2. **Categorisation system** → Natural language curriculum extraction
3. **Subject-specific routing** → Specialised tool selection logic

---

## References

- `packages/aila/src/core/quiz/` - Quiz generation system
- `packages/aila/src/lib/agents/` - Agent definitions and routing
- `packages/aila/src/features/categorisation/` - Input categorisation
- `packages/db/prisma/schema.prisma` - Database enums and models
