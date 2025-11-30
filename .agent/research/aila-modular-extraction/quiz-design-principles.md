# Quiz Design Principles

**Research Area**: 2 - Educational Domain Model
**Status**: Complete
**Last Updated**: 2025-11-30

---

## Overview

Documentation of quiz structure, constraints, and the educational principles embedded in the quiz schema evolution from V1 to V3.

---

## Key Files Analysed

- `packages/aila/src/protocol/schemas/quiz/quizV1.ts`
- `packages/aila/src/protocol/schemas/quiz/quizV2.ts`
- `packages/aila/src/protocol/schemas/quiz/quizV3.ts`
- `packages/aila/src/protocol/schema.ts`

---

## 1. Quiz Schema Evolution

### V1: Legacy Simple Structure

```typescript
QuizV1 = Array<{
  question: string;
  answers: string[]; // 1 correct answer
  distractors: string[]; // 2 distractors
}>;
```

**Limitations**:

- Multiple-choice only
- No versioning
- No image support
- No hints

### V2: Discriminated Union with Multiple Types

```typescript
QuizV2 = {
  version: "v2",
  questions: Array<QuestionType>,
  imageAttributions: Array<{
    imageUrl: string,
    attribution: string
  }>
}

QuestionType =
  | MultipleChoice
  | ShortAnswer
  | Match
  | Order
```

**Additions**:

- Version field for migration
- 4 question types
- Image attribution support
- Hint field on all questions
- Base schema for extension

### V3: Enhanced Image Metadata

```typescript
QuizV3 = {
  version: 'v3',
  questions: Array<QuestionType>, // Same as V2
  imageMetadata: Array<{
    imageUrl: string;
    attribution: string | null;
    width: number; // NEW: For Google Docs API
    height: number; // NEW: For Google Docs API
  }>,
};
```

**Change Rationale**:
V3 adds image dimensions for Google Docs export API which requires explicit width/height.

---

## 2. Question Types

### Multiple Choice

```typescript
{
  questionType: "multiple-choice",
  question: string,      // The question text (markdown)
  answers: string[],     // Correct answers (typically 1)
  distractors: string[], // Incorrect options (typically 2)
  hint: string | null    // Optional help
}
```

**Educational Purpose**: Standard assessment format. Tests recall, understanding, and application through forced choice between plausible options.

**Constraints**:

- 1 correct answer
- 2+ distractors (typically 2)
- Answers alphabetically ordered
- No negative phrasing
- No "all/none of the above"

### Short Answer

```typescript
{
  questionType: "short-answer",
  question: string,
  answers: string[],     // Multiple acceptable answers
  hint: string | null
}
```

**Educational Purpose**: Tests recall without recognition cues. Harder than multiple-choice. Multiple acceptable answers accommodate spelling variations or equivalent expressions.

### Match

```typescript
{
  questionType: "match",
  question: string,
  pairs: Array<{
    left: string,   // Item to match
    right: string   // Corresponding match
  }>,
  hint: string | null
}
```

**Educational Purpose**: Tests association/relationship understanding. Useful for vocabulary (term→definition), events (date→event), or concepts (cause→effect).

### Order

```typescript
{
  questionType: "order",
  question: string,
  items: string[],  // Items in correct order
  hint: string | null
}
```

**Educational Purpose**: Tests understanding of sequences, processes, or hierarchies. Items displayed shuffled; pupil arranges correctly.

---

## 3. Quiz Structure Constraints

### Question Count

- **Standard**: 6 questions per quiz
- **Rationale**: Balances assessment coverage with time constraints (~2-3 minutes)

### Difficulty Progression

- Questions increase in difficulty (1 easiest → 6 hardest)
- **Rationale**: Builds confidence early, identifies mastery levels

### Pass Target

- Average pupil should score **5 out of 6** correct
- **Rationale**: High but achievable bar; identifies pupils needing support

### LLM Generation Constraint

LLM can only generate **multiple-choice** questions:

- Other types come from existing Oak content
- Ensures quality control on complex question types

---

## 4. Starter Quiz vs Exit Quiz

### Starter Quiz

| Aspect            | Starter Quiz                            |
| ----------------- | --------------------------------------- |
| **Purpose**       | Assess prior knowledge readiness        |
| **Content Scope** | Prior knowledge ONLY                    |
| **Tests**         | What pupils should already know         |
| **Never Tests**   | Lesson content                          |
| **Use Case**      | Identify knowledge gaps before teaching |

**Example Logic**:

- If lesson teaches concept B (new)
- And requires prior knowledge A (existing)
- Starter Quiz tests A, never mentions B

### Exit Quiz

| Aspect            | Exit Quiz                                   |
| ----------------- | ------------------------------------------- |
| **Purpose**       | Assess lesson understanding                 |
| **Content Scope** | Lesson content ONLY                         |
| **Must Cover**    | Key learning points, misconception, keyword |
| **Never Tests**   | Prior knowledge                             |
| **Use Case**      | Verify learning objectives achieved         |

**Coverage Requirements**:

- At least one question per key learning point
- At least one question testing a misconception
- At least one question testing keyword understanding in context

### Common Error

Starter quizzes incorrectly testing lesson content instead of prior knowledge. The system includes a consistency check for this.

---

## 5. Schema Design Patterns

### Dual Schema Pattern

```typescript
// For OpenAI structured outputs (no length constraints)
QuizSchemaWithoutLength = z.object({...})

// For validation (with constraints)
QuizSchema = QuizSchemaWithoutLength.extend({
  questions: z.array(...).min(1).max(6)
})
```

**Rationale**: OpenAI structured outputs don't support array length constraints.

### LLM-Specific Schema

```typescript
// Full schema (all question types)
QuizV3Schema;

// LLM generation schema (multiple-choice only)
QuizV3MultipleChoiceOnlySchema;
```

**Rationale**: LLM quality is reliable only for multiple-choice. Other types require human curation or existing content.

### Version Field

```typescript
version: z.literal('v3');
```

**Rationale**: Enables schema migration while preserving existing data. Migration functions transform V1→V2→V3.

---

## Key Insights

### Insight 1: Content Scope is Critical

The distinction between starter (prior knowledge) and exit (lesson content) quizzes is fundamental. Mixing them undermines the assessment purpose.

### Insight 2: Distractor Quality Matters More Than Quantity

2 high-quality distractors beat 3 poor ones. Quality criteria:

- Plausible to uninformed pupil
- Similar length to correct answer
- Same category as correct answer
- Grammatically consistent

### Insight 3: Question Types Serve Different Purposes

| Type            | Tests                  | Difficulty |
| --------------- | ---------------------- | ---------- |
| Multiple-choice | Recognition            | Easier     |
| Short-answer    | Recall                 | Harder     |
| Match           | Association            | Medium     |
| Order           | Sequence understanding | Medium     |

### Insight 4: 6-Question Sweet Spot

6 questions provides:

- Enough coverage for validity
- Short enough for time constraints
- Easy arithmetic for pass rate (5/6 = 83%)

---

## Extraction Recommendations

### High Priority

1. **Question type definitions**: Discriminated union pattern
2. **Scope rules**: Starter vs Exit content boundaries
3. **Difficulty progression**: Question ordering rules

### Medium Priority

1. **Coverage requirements**: Exit quiz must-cover rules
2. **Pass rate target**: 5/6 threshold

### As Pure Functions

```typescript
// Quiz scope validation
function isValidStarterQuizQuestion(
  question: Question,
  priorKnowledge: string[],
  lessonContent: string[],
): boolean;

// Difficulty ordering validation
function isDifficultyProgressing(questions: Question[]): boolean;

// Coverage validation
function hasRequiredCoverage(
  quiz: Quiz,
  keyLearningPoints: string[],
  misconceptions: Misconception[],
  keywords: Keyword[],
): boolean;
```
