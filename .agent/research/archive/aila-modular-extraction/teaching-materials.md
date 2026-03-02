# Teaching Materials Generation

**Research Area**: 7 - Teaching Materials
**Status**: Complete
**Last Updated**: 2025-11-30

---

## Overview

Documentation of teaching materials generation beyond the core lesson plan, including quiz exports, comprehension tasks, and glossaries.

---

## Key Files Analysed

- `packages/teaching-materials/src/documents/teachingMaterials/`
- `packages/teaching-materials/src/documents/documentConfig.ts`
- `packages/teaching-materials/src/documents/partialLessonPlan/`

---

## 1. Material Types

### Overview

| Material Type | Purpose                           | Source Data         |
| ------------- | --------------------------------- | ------------------- |
| Starter Quiz  | Prior knowledge assessment export | starterQuiz section |
| Exit Quiz     | Lesson assessment export          | exitQuiz section    |
| Comprehension | Reading comprehension task        | Lesson content      |
| Glossary      | Vocabulary reference              | keywords section    |

### Starter Quiz

**Purpose**: Export starter quiz as standalone document for printing/display.

**Generation Approach**:

1. Extract starterQuiz from lesson plan
2. Format questions with answer options
3. Include answer key (separate page)
4. Add lesson metadata header

**Quality Criteria**:

- Clear formatting
- Appropriate spacing for written answers
- Answer key for teacher
- Lesson context included

### Exit Quiz

**Purpose**: Export exit quiz as standalone document.

**Generation Approach**:

1. Extract exitQuiz from lesson plan
2. Same formatting as starter quiz
3. Include answer key
4. Reference to lesson learning outcome

**Quality Criteria**:

- Same as starter quiz
- Links to learning outcome visible

### Comprehension

**Purpose**: Generate reading comprehension task based on lesson content.

**Generation Approach**:

1. Build prompt from lesson content (`buildComprehensionPrompt.ts`)
2. Generate passage relevant to learning outcomes
3. Create comprehension questions
4. Include answer guidance

**Quality Criteria**:

- Passage length appropriate to key stage
- Questions test understanding, not recall
- Clear marking guidance
- Vocabulary appropriate to key stage

### Glossary

**Purpose**: Export keywords as printable vocabulary reference.

**Generation Approach**:

1. Extract keywords from lesson plan
2. Format as term-definition pairs
3. Optional: pronunciation guides
4. Optional: example sentences

**Quality Criteria**:

- Alphabetical ordering
- Clear, age-appropriate definitions
- Space for pupil notes (optional)

---

## 2. Generation Patterns

### Prompt Building

Each material type has a dedicated prompt builder:

```typescript
// Pattern for all material types
function buildXPrompt(lessonPlan: PartialLessonPlan, options: GenerationOptions): string {
  return `
    ${contextSection}
    ${contentSection}
    ${instructionsSection}
    ${outputFormatSection}
  `;
}
```

**Example: Comprehension Prompt**

```typescript
// buildComprehensionPrompt.ts
function buildComprehensionPrompt(lessonPlan, options) {
  return `
    You are creating a reading comprehension task for ${lessonPlan.keyStage} 
    ${lessonPlan.subject} based on the following lesson:

    Learning Outcome: ${lessonPlan.learningOutcome}
    Key Learning Points: ${lessonPlan.keyLearningPoints.join('\n')}
    Keywords: ${formatKeywords(lessonPlan.keywords)}

    Generate:
    1. A passage of approximately ${getWordCount(lessonPlan.keyStage)} words
    2. ${getQuestionCount(lessonPlan.keyStage)} comprehension questions
    3. Model answers for each question
  `;
}
```

### Helper Functions

**Location**: `packages/teaching-materials/src/documents/teachingMaterials/promptHelpers.ts`

**Functions**:

- `formatKeywords()`: Format keywords for prompts
- `formatLearningPoints()`: Format key learning points
- `getWordCount()`: Word count by key stage
- `getQuestionCount()`: Question count by key stage

### Shared Schema Elements

**Location**: `packages/teaching-materials/src/documents/teachingMaterials/sharedSchema.ts`

Common schema elements across material types:

- Lesson metadata
- Generation timestamps
- Quality indicators

---

## 3. Refinement Patterns

### Iterative Improvement

Materials can be refined through:

1. **User feedback**: "Make the comprehension passage simpler"
2. **Automatic checks**: Reading level validation
3. **Regeneration**: Generate alternative version

### Refinement Schema

```typescript
// refinement/schema.ts
interface RefinementRequest {
  materialType: MaterialType;
  currentContent: GeneratedContent;
  refinementType: 'simplify' | 'expand' | 'restructure' | 'rephrase';
  guidance?: string;
}
```

### Quality Assurance

Post-generation checks:

1. Length validation
2. Vocabulary check (reading level)
3. Content coverage (mentions key learning points)
4. Schema compliance

---

## 4. Export Formats

### Document Structure

All exports follow consistent structure:

```
┌─────────────────────────────────────────┐
│  HEADER                                 │
│  - Lesson title                         │
│  - Subject, Key Stage                   │
│  - Learning Outcome                     │
├─────────────────────────────────────────┤
│  CONTENT                                │
│  - Material-specific content            │
│  - Questions, passages, etc.            │
├─────────────────────────────────────────┤
│  FOOTER                                 │
│  - Answer key (if applicable)           │
│  - Generation metadata                  │
│  - Oak branding                         │
└─────────────────────────────────────────┘
```

### Slide Generation

For quiz exports intended for slides:

- One question per slide
- Answer options as bullet points
- Reveal answer on next slide
- Consistent styling

### Partial Lesson Plan Export

**Location**: `packages/teaching-materials/src/documents/partialLessonPlan/`

For exporting incomplete lesson plans:

- Include completed sections
- Mark incomplete sections
- Provide prompts for missing content

---

## 5. Additional Materials Content

From `body.ts`, additional materials can include:

| Type                   | Description                                  | Voice                    |
| ---------------------- | -------------------------------------------- | ------------------------ |
| Case study context     | Location, historical context, causes/effects | TEACHER_TO_PUPIL_WRITTEN |
| Homework questions     | 10+ additional practice questions            | TEACHER_TO_PUPIL_WRITTEN |
| Practical instructions | Equipment, method, safety, results table     | EXPERT_TEACHER           |
| SEND adaptations       | Differentiation suggestions                  | EXPERT_TEACHER           |
| Extended text          | Reading passage >30 words                    | TEACHER_TO_PUPIL_WRITTEN |
| Narrative/script       | Teacher delivery support                     | TEACHER_TO_PUPIL_SPOKEN  |
| Keyword translations   | Terms in other languages                     | TEACHER_TO_PUPIL_WRITTEN |

### Science Practical Structure

When generating practical instructions for science:

1. Purpose (EXPERT_TEACHER voice)
2. Teacher notes (EXPERT_TEACHER voice)
3. Equipment list (bullet points, specific quantities)
4. Method (step-by-step instructions)
5. Results table (with space for 3 repeats + mean)
6. Sample results
7. Health and safety guidance
8. Risk assessment notice

---

## Key Insights

### Insight 1: Materials Derive from Lesson Plan

All teaching materials are generated FROM the lesson plan, not independently. This ensures consistency and alignment.

### Insight 2: Key Stage Determines Complexity

Word counts, question counts, and vocabulary complexity all scale with key stage:

| Key Stage | Passage Length | Questions |
| --------- | -------------- | --------- |
| KS1       | 100-150 words  | 3-4       |
| KS2       | 200-300 words  | 5-6       |
| KS3       | 300-400 words  | 6-8       |
| KS4       | 400-500 words  | 8-10      |

### Insight 3: Export Formats Enable Flexibility

Same content can export to:

- Printable PDF
- Google Slides
- Interactive quiz platform
- Teacher planning document

### Insight 4: Moderation Applies to Materials

Teaching materials go through the same moderation system as lesson content. Additional materials especially need moderation given their free-form nature.

---

## Extraction Recommendations

### As Configuration

```typescript
const MATERIAL_TYPES = {
  starterQuiz: {
    sourceSection: 'starterQuiz',
    exportFormats: ['pdf', 'slides', 'interactive'],
    includesAnswerKey: true,
  },
  exitQuiz: {
    sourceSection: 'exitQuiz',
    exportFormats: ['pdf', 'slides', 'interactive'],
    includesAnswerKey: true,
  },
  comprehension: {
    generationType: 'llm',
    promptBuilder: 'buildComprehensionPrompt',
    outputSchema: ComprehensionSchema,
  },
  glossary: {
    sourceSection: 'keywords',
    exportFormats: ['pdf', 'flashcards'],
  },
} as const;

const KEY_STAGE_SCALING = {
  'key-stage-1': { passageWords: 150, questions: 4 },
  'key-stage-2': { passageWords: 250, questions: 6 },
  'key-stage-3': { passageWords: 350, questions: 7 },
  'key-stage-4': { passageWords: 450, questions: 9 },
} as const;
```

### Integration Points

- **Export API**: MCP tool for material generation
- **Validation**: Material-specific quality checks
- **Moderation**: Apply content moderation to generated materials
