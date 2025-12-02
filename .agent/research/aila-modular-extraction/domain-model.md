# Educational Domain Model

**Research Area**: 2 - Educational Domain Model
**Status**: Complete
**Last Updated**: 2025-11-30

---

## Overview

The Aila system uses a comprehensive educational domain model centred on `CompletedLessonPlanSchema`. This model captures UK curriculum concepts, lesson structure, assessment design, and pedagogical relationships.

---

## Key Files Analysed

- `packages/aila/src/protocol/schema.ts` - Main lesson plan schema
- `packages/aila/src/lib/agents/lessonPlanSectionGroups.ts` - Section ordering
- `packages/aila/src/protocol/schemas/quiz/` - Quiz schema evolution
- `packages/db/schemas/lesson.ts` - Database model

---

## 1. CompletedLessonPlanSchema

### Field-by-Field Analysis

#### title

**Type**: `string`
**Constraints**: Max 80 characters, sentence case, no full stop, no & symbol
**Voice**: TEACHER_TO_PUPIL_SLIDES
**Educational Rationale**: Unique, succinct statement (not a question) that matches learning objectives. Title should narrow from broad topics (e.g., "World War 2") to specific, achievable focus.

#### keyStage

**Type**: `enum` (key-stage-1 through key-stage-5, EYFS, specialist, FE, HE)
**Format**: kebab-case slug
**Educational Rationale**: UK educational standards alignment. Determines age-appropriate language, complexity, timing, and curriculum expectations.

```typescript
KEY_STAGE_SLUGS = [
  'key-stage-1', // Ages 5-7 (Years 1-2)
  'key-stage-2', // Ages 7-11 (Years 3-6)
  'key-stage-3', // Ages 11-14 (Years 7-9)
  'key-stage-4', // Ages 14-16 (Years 10-11, GCSE)
  'key-stage-5', // Ages 16-18 (Years 12-13, A-Level)
  'early-years-foundation-stage', // Ages 0-5
  'specialist', // Special educational needs
  'further-education', // Post-16 vocational
  'higher-education', // University level
];
```

#### subject

**Type**: `string`
**Educational Rationale**: Curriculum subject (English, Maths, Science, Geography, etc.). Determines appropriate content, vocabulary, and assessment types.

#### topic

**Type**: `string` (nullable)
**Educational Rationale**: Broader theme within which the lesson sits (e.g., "World War 2", "Fractions"). A topic typically spans multiple lessons.

#### learningOutcome

**Type**: `string`
**Constraints**: Max 190 characters
**Voice**: PUPIL ("I can...")
**Educational Rationale**: What pupils will have learnt by end of lesson. Phrased from pupil's perspective, achievable within lesson timeframe (50 min KS2-4, 40 min KS1). Must be specific to the lesson, not the broader topic.

**Example**: "I can identify the differences between plant and animal cells"
**Non-example**: "Cells" (too vague)

#### learningCycles

**Type**: `array<string>`
**Constraints**: 1-3 items, max 20 words each
**Voice**: TEACHER_TO_PUPIL_SLIDES
**Educational Rationale**: Breaks learning outcome into manageable chunks. Each maps to a cycle (cycle1, cycle2, cycle3). Uses command words (Name, Identify, Describe, Explain, Analyse, Evaluate). Difficulty increases across cycles.

**Example**: "Recall the differences between animal and plant cells"

#### priorKnowledge

**Type**: `array<string>`
**Constraints**: 1-5 items, max 30 words each
**Voice**: EXPERT_TEACHER
**Educational Rationale**: What pupils should already know before the lesson. Knowledge statements (Substantive, Disciplinary, or Procedural). Must be age-appropriate and UK curriculum-aligned.

**Format**: Factual statements, not "Pupils know..."
**Example**: "The Earth is round."

#### keyLearningPoints

**Type**: `array<string>`
**Constraints**: 3-5 items
**Educational Rationale**: Most important facts pupils should learn. Knowledge-rich factual statements, not objectives.

**Correct**: "A plant cell differs from an animal cell because it has a cell wall, chloroplast and a large vacuole"
**Incorrect**: "The unique features of plant cells, including cell walls, chloroplasts, and large vacuoles" (describes what will be learned, not the fact itself)

#### misconceptions

**Type**: `array<{ misconception: string, description: string }>`
**Constraints**: 1-3 items, misconception max 200 chars, description max 250 chars
**Voice**: EXPERT_TEACHER
**Educational Rationale**: Common incorrect beliefs teachers should address. Enables targeted correction during explanation. Informs distractor design in quizzes.

**Example**:

- Misconception: "Multiplying two numbers always produces a bigger number"
- Description: "Multiplying by less than one or a negative can result in a smaller number, and multiplying by zero will result in an answer of zero."

#### keywords

**Type**: `array<{ keyword: string, definition: string }>`
**Constraints**: 1-5 items, keyword max 30 chars, definition max 200 chars
**Voice**: TEACHER_TO_PUPIL_SLIDES
**Educational Rationale**: Tier 2 and Tier 3 vocabulary essential for lesson access.

- **Tier 2**: Academic vocabulary, frequent in text but not subject-specific (e.g., "beneficial", "required")
- **Tier 3**: Subject-specific, less frequent (e.g., "amplitude", "hypotenuse")

Definition must not contain the keyword itself and must be age-appropriate.

#### basedOn

**Type**: `{ id: string, title: string }` (nullable)
**Educational Rationale**: Reference to existing Oak lesson being adapted. Only set when user explicitly chooses from a list of relevant lessons.

#### starterQuiz

**Type**: `QuizSchema` (6 questions)
**Voice**: TEACHER_TO_PUPIL_SLIDES
**Educational Rationale**: Tests **PRIOR KNOWLEDGE ONLY**. Ensures pupils have prerequisite understanding before new content. Never tests lesson content. 5/6 pass target for average pupil.

#### cycle1, cycle2, cycle3

**Type**: `CycleSchema` (cycle3 nullable)
**Educational Rationale**: Main body of lesson, 10-20 minutes each (8-12 for KS1). Each maps to a learningCycle outcome. Structure: Explanation → Check for Understanding → Practice → Feedback.

#### exitQuiz

**Type**: `QuizSchema` (6 questions)
**Voice**: TEACHER_TO_PUPIL_SLIDES
**Educational Rationale**: Tests **LESSON CONTENT ONLY**. Assesses key learning points, misconceptions, and keyword understanding. Never tests prior knowledge. 5/6 pass target.

#### additionalMaterials

**Type**: `string` (nullable, markdown)
**Educational Rationale**: Supplementary materials:

- Narratives/scripts for teachers
- Practical instructions (science experiments)
- SEND adaptations
- Extended texts for analysis
- Extra homework questions
- Keyword translations

---

## 2. Section Groups and Dependencies

### Group Structure

```typescript
sectionGroups = [
  ['basedOn', 'learningOutcome', 'learningCycles'], // Foundation
  ['priorKnowledge', 'keyLearningPoints', 'misconceptions', 'keywords'], // Knowledge
  ['starterQuiz', 'cycle1', 'cycle2', 'cycle3', 'exitQuiz'], // Content
  ['additionalMaterials'], // Supplementary
];
```

### Pre-requisite: Identity

- title, keyStage, subject (must exist before any section groups)

### Dependency Rationale

| Group         | Depends On | Rationale                                      |
| ------------- | ---------- | ---------------------------------------------- |
| Foundation    | Identity   | Need subject/keyStage for appropriate outcomes |
| Knowledge     | Foundation | Learning points derive from outcomes           |
| Content       | Knowledge  | Quizzes test knowledge; cycles teach it        |
| Supplementary | Content    | Additional materials support the lesson        |

### basedOn Exception

The `basedOn` field is an outlier. Once past Foundation group, shouldn't return to basedOn unless user explicitly requests it.

---

## 3. CycleSchema (Learning Cycle Structure)

### Components

```typescript
CycleSchema = {
  title: string,               // Max 50 chars, sentence case
  durationInMinutes: number,   // 10-20 (8-12 for KS1)
  explanation: {
    spokenExplanation: string | string[],  // AILA_TO_TEACHER voice
    accompanyingSlideDetails: string,      // Visual description
    imagePrompt: string,                   // Search term
    slideText: string,                     // TEACHER_TO_PUPIL_SLIDES voice
  },
  checkForUnderstanding: [     // 2+ questions
    {
      question: string,        // TEACHER_TO_PUPIL_SLIDES voice
      answers: string[],       // 1 correct answer
      distractors: string[],   // 2+ distractors
    }
  ],
  practice: string,            // TEACHER_TO_PUPIL_SLIDES voice
  feedback: string,            // TEACHER_TO_PUPIL_SLIDES voice
}
```

### Pedagogical Foundation

The learning cycle embodies the **Explain-Check-Practice-Feedback** model:

1. **Explanation**: Teacher communicates key points with visual support
2. **Check for Understanding**: Verify comprehension before practice
3. **Practice**: Active learning to apply/reinforce knowledge
4. **Feedback**: Model answers or success criteria for self-assessment

---

## 4. Curriculum Taxonomy

### Key Stage to Year Group Mapping

| Key Stage | Years     | Ages  | Lesson Duration |
| --------- | --------- | ----- | --------------- |
| EYFS      | Reception | 4-5   | -               |
| KS1       | 1-2       | 5-7   | 40 min          |
| KS2       | 3-6       | 7-11  | 50 min          |
| KS3       | 7-9       | 11-14 | 50 min          |
| KS4       | 10-11     | 14-16 | 50 min          |
| KS5       | 12-13     | 16-18 | 50 min          |

### Subject Categories

Subjects follow UK National Curriculum groupings:

- Core: English, Mathematics, Science
- Foundation: History, Geography, Art, Music, PE, Computing, Languages, RE, Citizenship
- Specialist: SEN-specific subjects

### Age-Appropriateness Encoding

The schema embeds age-appropriateness through:

1. **Key stage slug** in schema
2. **Voice descriptions** reference audience age
3. **Character limits** vary by expected reading level
4. **Command words** vary by key stage (simpler for KS1, exam-style for KS4)

---

## 5. Quiz Schema Evolution

### V1 → V2 → V3 Changes

| Aspect         | V1                   | V2                                       | V3                                |
| -------------- | -------------------- | ---------------------------------------- | --------------------------------- |
| Question types | Multiple-choice only | 4 types (MC, short-answer, match, order) | Same as V2                        |
| Structure      | Flat array           | Versioned container                      | Same as V2                        |
| Images         | None                 | `imageAttributions`                      | `imageMetadata` (with dimensions) |
| Hints          | None                 | Optional hint field                      | Same as V2                        |

### V2/V3 Question Types

1. **multiple-choice**: Question + answers + distractors
2. **short-answer**: Question + acceptable answers
3. **match**: Question + pairs (left/right)
4. **order**: Question + items (correct sequence)

### LLM Generation Constraint

LLM can only generate multiple-choice questions. Other types come from existing Oak content or manual entry.

```typescript
QuizV3MultipleChoiceOnlySchema; // Used for LLM generation
QuizV3Schema; // Full schema for storage/display
```

---

## 6. Database Model Relationship

The `ZLesson` schema from the database shows the broader curriculum context:

```
Lesson
├── Unit (collection of lessons)
│   ├── Programme (of study)
│   └── Topic
├── Year
│   └── KeyStage
├── Subject
├── Quizzes (intro/exit)
├── Video
└── Activities
```

This hierarchical structure connects individual lessons to broader curriculum organisation.

---

## Key Insights

### Insight 1: Voice as Schema Annotation

Voice identifiers in schema descriptions ensure consistent tone:

```typescript
spokenExplanation: '...in the EXPERT_TEACHER voice...';
slideText: '...in the TEACHER_TO_PUPIL_SLIDES voice...';
```

### Insight 2: Constraints as Prose

Many constraints are embedded in description strings rather than schema rules:

```typescript
description: `...${minMaxText({ min: 1, max: 3, entity: 'elements' })}`;
```

### Insight 3: Dual Schema Patterns

Schemas exist in two forms:

- `SchemaWithoutLength`: For structured outputs (OpenAI limitation)
- `Schema`: With length constraints for validation

### Insight 4: Section Ordering as Array

Dependencies are implicit in array ordering rather than explicit graph. The `interactingWithTheUser.ts` file contains the logic to determine next steps.

---

## Extraction Recommendations

### High Priority

1. **Voice-annotated schemas**: Keep voice metadata with field definitions
2. **Section dependencies**: Make explicit as dependency graph
3. **Timing constraints**: Centralise by key stage
4. **Quiz scope rules**: Starter (prior) vs Exit (lesson) distinction

### Medium Priority

1. **Character limits**: Extract as configuration
2. **Question type definitions**: Keep discriminated union pattern
3. **Tier vocabulary classification**: Tier 2 vs Tier 3 rules

### Simplification Opportunities

1. Express constraints in Zod schema rather than prose descriptions
2. Generate schema variations (WithLength, Optional) programmatically
3. Make voice annotations type-safe enums
4. Create explicit dependency graph for section ordering
