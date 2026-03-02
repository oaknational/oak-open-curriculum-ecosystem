# Prompt Patterns Worth Extracting

**Research Area**: 1 - Prompt Architecture
**Status**: Complete
**Last Updated**: 2025-11-30

---

## Overview

This document identifies prompt patterns from the Aila system that encode valuable domain knowledge and are worth rebuilding to our standards.

---

## Evaluation Criteria

For each pattern:

1. **Domain knowledge encoded** - What pedagogical expertise does this capture?
2. **Essential vs accidental** - Is this core domain logic or implementation detail?
3. **Simplification opportunity** - Could it be simpler when rebuilt?
4. **Integration potential** - How does this fit with our SDK/MCP architecture?

---

## High-Value Patterns

### Pattern 1: Voice System

**Domain Knowledge**:
Five distinct voices for educational content, each with defined speaker, audience, and tone. This encodes how teachers communicate differently when writing slides vs speaking vs sharing expertise.

**Current Implementation**:

```typescript
// In languageAndVoice.ts - prose description
VOICE: AILA_TO_TEACHER
Context: This is the voice you should use when addressing the teacher...
Speaker: Aila
Audience: The teacher using the application
Voice: Supportive expert, guiding and coaching...

// In voices/voices.ts - structured data
export const voices = {
  AILA_TO_TEACHER: {
    id: "AILA_TO_TEACHER",
    speaker: "Aila",
    audience: "User",
    description: "Supportive expert guiding the teacher..."
  },
  // ...
}
```

**Extraction Value**: Very High

- Clear, well-defined domain concepts
- Already partially structured in `voices.ts`
- Can be type-safe enum + data structure

**Simplification Opportunity**:
Convert prose descriptions to pure data. The newer `voices.ts` is already better structured than the legacy `languageAndVoice.ts`.

**Proposed Extraction**:

```typescript
const VOICE_DEFINITIONS = {
  AILA_TO_TEACHER: {
    speaker: 'Aila',
    audience: 'Teacher',
    tone: 'Supportive expert',
    canAskClarification: true,
  },
  PUPIL: {
    speaker: 'Pupil',
    audience: 'Class/Teacher',
    tone: 'Age-appropriate',
    usedFor: ['learningOutcome'],
  },
  // ...
} as const;
```

---

### Pattern 2: Section Group Ordering

**Domain Knowledge**:
Lessons are built in groups with pedagogical dependencies. You need identity (title/subject/keyStage) before outcomes, outcomes before content details, content details before quizzes/cycles.

**Current Implementation**:

```typescript
// In lessonPlanSectionGroups.ts
export const sectionGroups: SectionGroups = [
  ['basedOn', 'learningOutcome', 'learningCycles'],
  ['priorKnowledge', 'keyLearningPoints', 'misconceptions', 'keywords'],
  ['starterQuiz', 'cycle1', 'cycle2', 'cycle3', 'exitQuiz'],
  ['additionalMaterials'],
];

// In interactingWithTheUser.ts - prose + conditional logic
const lessonConstructionSteps = (lessonPlan, relevantLessonPlans) => {
  // Complex logic determining next step based on current state
};
```

**Extraction Value**: Very High

- Core pedagogical workflow
- Essential for any lesson planning tool

**Simplification Opportunity**:
Express as explicit dependency graph rather than ordered arrays with implicit dependencies.

**Proposed Extraction**:

```typescript
const SECTION_DEPENDENCIES = {
  title: [],
  keyStage: [],
  subject: [],
  learningOutcome: ['title', 'keyStage', 'subject'],
  learningCycles: ['learningOutcome'],
  priorKnowledge: ['learningCycles'],
  keyLearningPoints: ['learningCycles'],
  misconceptions: ['keyLearningPoints'],
  keywords: ['keyLearningPoints'],
  starterQuiz: ['priorKnowledge', 'misconceptions'],
  cycle1: ['learningCycles', 'keywords'],
  cycle2: ['cycle1'],
  cycle3: ['cycle2'],
  exitQuiz: ['keywords', 'misconceptions', 'cycle1'],
  additionalMaterials: ['exitQuiz'],
} as const;
```

---

### Pattern 3: Quiz Design Rules

**Domain Knowledge**:
Extensive rules for educational quiz design covering question structure, distractor quality, difficulty progression, and content scope.

**Current Implementation**:

```typescript
// In quizQuestionDesignInstructions.ts
export const quizQuestionDesignInstructions = `## Question Design
- Consider the level of detail the pupils will have been taught...
- Avoid negative phrasing e.g. "Which is not…"
- No true/false questions
- Incorporate common misconceptions if appropriate
- For key stage 4, these should start with exam command words...

## Answers
- Include 1 correct answer + 2 high-quality distractors.
- Mutually exclusive (i.e. only one answer is correct)
- Do not include 'all/none of the above'...
- The distractors should be:
  - Plausible
  - Similar in length to the correct answer
  - Fall into the same category...
  - Have similar grammatical structures...
- Write the answers in alphabetical order`;
```

**Extraction Value**: Very High

- Testable rules for quiz quality
- Can inform validation logic
- Valuable for any quiz generation

**Simplification Opportunity**:
Convert prose rules to structured validation criteria.

**Proposed Extraction**:

```typescript
const QUIZ_RULES = {
  questionRules: {
    avoidNegativePhrasing: true,
    noTrueFalse: true,
    incorporateMisconceptions: true,
    ks4CommandWords: ['state', 'identify', 'select'],
  },
  answerRules: {
    correctAnswerCount: 1,
    distractorCount: 2,
    noAllNoneAbove: true,
    noWordRepetitionFromQuestion: true,
    alphabeticalOrder: true,
  },
  distractorRules: {
    mustBePlausible: true,
    similarLength: true,
    sameCategory: true,
    grammaticallyConsistent: true,
  },
  structureRules: {
    questionCount: 6,
    targetPassRate: 5 / 6,
    difficultyProgression: 'increasing',
  },
} as const;
```

---

### Pattern 4: Learning Cycle Structure

**Domain Knowledge**:
The pedagogical structure of a learning cycle: Explanation → Check for Understanding → Practice → Feedback. Each component has specific requirements and formats.

**Current Implementation**:
In `body.ts` and `cycle.instructions.ts` - extensive prose descriptions of each component with examples.

**Extraction Value**: Very High

- Core pedagogical model
- Well-established educational practice
- Oak's refined interpretation

**Simplification Opportunity**:
Express as data structure with validation rules.

**Proposed Extraction**:

```typescript
const LEARNING_CYCLE_STRUCTURE = {
  title: {
    maxChars: 50,
    format: 'sentence-case',
    purpose: 'Short version of learning cycle outcome',
  },
  explanation: {
    spokenExplanation: {
      voice: 'AILA_TO_TEACHER',
      format: 'bullet-points',
      minPoints: 1,
      maxPoints: 5,
      includes: ['keyConcepts', 'models', 'analogies', 'examples', 'priorKnowledgeLinks'],
    },
    accompanyingSlideDetails: {
      purpose: 'Visual support for spoken explanation',
    },
    imageSearchSuggestion: {
      purpose: 'Search term for teacher to find image',
    },
    slideText: {
      voice: 'TEACHER_TO_PUPIL_WRITTEN',
      maxSentences: 2,
      noTeacherNarrative: true,
    },
  },
  checkForUnderstanding: {
    count: 2,
    type: 'multiple-choice',
    correctAnswers: 1,
    distractors: 2,
    noDuplicationWithQuizzes: true,
  },
  practice: {
    voice: 'TEACHER_TO_PUPIL_WRITTEN',
    durationMinutes: { min: 5, max: 7 },
    mustBeComplete: true, // Include all content needed
    difficultyProgression: true,
    activatesAllPupils: true,
  },
  feedback: {
    voice: 'PUPIL',
    formats: ['modelAnswer', 'workedExample', 'successCriteria'],
    mustBePupilFacing: true,
  },
} as const;
```

---

### Pattern 5: Timing Constraints

**Domain Knowledge**:
Lesson timing varies by key stage and components have expected durations.

**Current Implementation**:
Scattered prose across multiple files:

- "50 minutes for key stages 2, 3, and 4 and 40 minutes for key stage 1"
- "Learning Cycle should last between 10-20 minutes"
- "5 minutes on the starter and Exit Quiz"

**Extraction Value**: High

- Essential for realistic lesson planning
- Simple data structure

**Simplification Opportunity**:
Centralise in one data structure.

**Proposed Extraction**:

```typescript
const TIMING_CONSTRAINTS = {
  lessonDuration: {
    'key-stage-1': 40,
    'key-stage-2': 50,
    'key-stage-3': 50,
    'key-stage-4': 50,
    'key-stage-5': 50,
  },
  componentDuration: {
    starterQuiz: { min: 2, max: 3 },
    exitQuiz: { min: 2, max: 3 },
    learningCycle: { min: 10, max: 20 },
    learningCycleKS1: { min: 8, max: 12 },
  },
  cycleCount: {
    min: 1,
    max: 3,
  },
} as const;
```

---

## Medium-Value Patterns

### Pattern 6: Starter vs Exit Quiz Scope

**Domain Knowledge**:

- Starter Quiz: Tests PRIOR KNOWLEDGE only, never lesson content
- Exit Quiz: Tests LESSON CONTENT only, includes keyword and misconception coverage

**Extraction Value**: Medium

- Important distinction
- Simple rule set

**Proposed Extraction**:

```typescript
const QUIZ_SCOPE_RULES = {
  starterQuiz: {
    testsPriorKnowledge: true,
    testsLessonContent: false,
    purpose: 'Ensure readiness for lesson',
  },
  exitQuiz: {
    testsPriorKnowledge: false,
    testsLessonContent: true,
    mustCover: ['keyLearningPoints', 'misconception', 'keyword'],
    purpose: 'Assess lesson understanding',
  },
} as const;
```

### Pattern 7: Practice Task Types

**Domain Knowledge**:
~50 different practice task types categorised by cognitive demand.

**Extraction Value**: Medium

- Valuable reference
- Could inform task selection

### Pattern 8: JSON Patch Protocol

**Domain Knowledge**:
Using RFC 6902 JSON Patch for lesson editing with reasoning annotations.

**Extraction Value**: Medium

- Well-defined standard
- Could be simplified for our use

---

## Low-Value / Skip Patterns

### Skip: Prompt Assembly Mechanics

The `getPromptParts()` conditional assembly is implementation-specific. The domain knowledge is in the parts themselves, not the assembly logic.

### Skip: Hash Generation

MD5 hashing for prompt versioning is a caching optimisation, not domain knowledge.

### Skip: Structured Output Toggle

The `isUsingStructuredOutput` branching is OpenAI-specific implementation.

---

## Prioritised Extraction List

| Priority | Pattern                  | Domain Value | Complexity | Notes                        |
| -------- | ------------------------ | ------------ | ---------- | ---------------------------- |
| 1        | Voice System             | Very High    | Low        | Already partially structured |
| 2        | Quiz Design Rules        | Very High    | Medium     | Convert prose to rules       |
| 3        | Learning Cycle Structure | Very High    | Medium     | Complex but well-defined     |
| 4        | Section Dependencies     | Very High    | Low        | Express as graph             |
| 5        | Timing Constraints       | High         | Low        | Simple data structure        |
| 6        | Quiz Scope Rules         | Medium       | Low        | Simple distinction           |
| 7        | Practice Task Types      | Medium       | Medium     | Large catalogue              |

---

## Implementation Recommendations

### Phase 1: Data Structures

Extract voice system, timing constraints, and section dependencies as typed `as const` objects. These can be generated at sdk-codegen time if appropriate.

### Phase 2: Validation Rules

Convert quiz design rules to Zod schemas or validation functions. These can power both generation prompts and content validation.

### Phase 3: Pedagogical Models

Express learning cycle structure and practice task types as comprehensive schemas. These inform MCP tool metadata and prompt generation.

### Integration with Existing Plans

- **Plan 01 (Tool Metadata)**: Voice system and timing constraints inform tool descriptions
- **Plan 02 (Curriculum Ontology)**: Section dependencies inform resource structure
- **Plan 04 (Prompts)**: All patterns feed into prompt generation utilities

---

## Implementation Status

This section tracks which patterns have been implemented in the Quick Wins plan.

| Priority | Pattern                  | Quick Win     | Coverage   | Notes                                       |
| -------- | ------------------------ | ------------- | ---------- | ------------------------------------------- |
| 1        | Voice System             | Future        | ❌ Not yet | Requires content generation (not read-only) |
| 2        | Quiz Design Rules        | QW-02         | ✅ Full    | Scope + design principles now included      |
| 3        | Learning Cycle Structure | QW-03 + QW-04 | ✅ Full    | Structure in ontology, detail in docs       |
| 4        | Section Dependencies     | QW-03         | ✅ Full    | Now includes dependency graph               |
| 5        | Timing Constraints       | QW-01         | ✅ Full    | Includes component-level durations          |
| 6        | Quiz Scope Rules         | QW-02         | ✅ Full    | Starter vs exit distinction with mustCover  |
| 7        | Practice Task Types      | Future        | ❌ Not yet | Large catalogue, medium priority            |

### Coverage Summary

- **Fully Implemented**: 5 of 7 patterns (71%)
- **Deferred (Generation Required)**: Voice System, Practice Task Types
- **Related Plan**: [Plan 10: Quick Wins](../../plans/sdk-and-mcp-enhancements/10-quick-wins-from-aila-research.md)
