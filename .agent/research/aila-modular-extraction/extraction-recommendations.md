# Extraction Recommendations

**Status**: Complete
**Last Updated**: 2025-11-30

---

## Executive Summary

This research has extracted substantial domain knowledge from the Oak AI Lesson Assistant codebase. The knowledge falls into three categories:

1. **Core Pedagogical Knowledge**: Educational principles, lesson structure, assessment design
2. **Operational Rules**: Quiz design, distractor creation, voice usage, content scope
3. **System Patterns**: Workflow orchestration, section dependencies, moderation

The primary recommendation is to extract this knowledge as **pure data structures** and **validation functions** that can be:

- Generated at sdk-codegen time where appropriate
- Used to inform MCP tool metadata
- Applied as post-generation validation
- Embedded in prompt templates

---

## 1. High-Priority Extraction Targets

### Target 1: Voice System

**Domain Knowledge**: 7 distinct voices for educational content generation, each with defined speaker, audience, tone, and usage context.

**Current State**: Partially structured in `voices.ts`, partially prose in `languageAndVoice.ts`

**Extraction Format**:

```typescript
export const VOICES = {
  AILA_TO_TEACHER: {
    speaker: 'Aila',
    audience: 'Teacher',
    tone: 'supportive expert',
    canAskQuestions: true,
  },
  PUPIL: {
    speaker: 'Pupil',
    audience: 'Class/Teacher',
    tone: 'age-appropriate',
    usedFor: ['learningOutcome', 'feedback'],
  },
  // ... etc
} as const;

export const SECTION_VOICES: Record<LessonPlanKey, VoiceId> = {
  learningOutcome: 'PUPIL',
  priorKnowledge: 'EXPERT_TEACHER',
  // ... etc
};
```

**Integration**:

- Plan 04 (Prompts): Voice instructions in generation prompts
- MCP Tools: Voice as tool parameter metadata

**Complexity**: Low
**Value**: Very High

---

### Target 2: Section Dependencies

**Domain Knowledge**: Pedagogical order in which lesson sections should be generated, with explicit dependencies.

**Current State**: Implicit in array ordering and prose instructions

**Extraction Format**:

```typescript
export const SECTION_DEPENDENCIES: Record<LessonPlanKey, LessonPlanKey[]> = {
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

export function canGenerate(section: LessonPlanKey, plan: PartialLessonPlan): boolean {
  return SECTION_DEPENDENCIES[section].every((dep) => plan[dep] !== undefined);
}
```

**Integration**:

- Plan 03 (Infrastructure): Workflow orchestration
- MCP Tools: Tool availability based on plan state

**Complexity**: Low
**Value**: Very High

---

### Target 3: Quiz Design Rules

**Domain Knowledge**: Comprehensive rules for educational quiz design including question structure, distractor quality, scope rules, and difficulty progression.

**Current State**: Prose in multiple instruction files

**Extraction Format**:

```typescript
export const QUIZ_RULES = {
  question: {
    prohibitedPatterns: [
      /which is not|which are not/i,
      /true or false/i,
      /all of the above|none of the above/i,
    ],
    requiresCommandWord: { 'key-stage-4': true },
    commandWords: ['state', 'identify', 'select', 'describe', 'explain'],
  },
  answers: {
    correctCount: 1,
    distractorCount: 2,
    orderRule: 'alphabetical',
  },
  distractors: {
    mustBePlausible: true,
    lengthTolerance: 0.3,
    mustBeSameCategory: true,
    mustBeGrammaticallyConsistent: true,
  },
  structure: {
    questionCount: 6,
    passTarget: 5,
    difficultyProgression: 'ascending',
  },
  scope: {
    starter: { tests: 'priorKnowledge', excludes: 'lessonContent' },
    exit: { tests: 'lessonContent', excludes: 'priorKnowledge' },
  },
} as const;
```

**Integration**:

- MCP Tools: Quiz generation tool with scope parameter
- Validation: Post-generation quiz quality check

**Complexity**: Medium
**Value**: Very High

---

### Target 4: Learning Cycle Structure

**Domain Knowledge**: The Explain-Check-Practice-Feedback pedagogical model with component-specific requirements.

**Current State**: Documented in schema and instructions

**Extraction Format**:

```typescript
export const CYCLE_STRUCTURE = {
  components: ['title', 'explanation', 'checkForUnderstanding', 'practice', 'feedback'],
  explanation: {
    subComponents: [
      'spokenExplanation',
      'accompanyingSlideDetails',
      'imageSearchSuggestion',
      'slideText',
    ],
    voices: {
      spokenExplanation: 'AILA_TO_TEACHER',
      slideText: 'TEACHER_TO_PUPIL_WRITTEN',
    },
  },
  checkForUnderstanding: {
    count: 2,
    type: 'multiple-choice',
    inheritRules: 'QUIZ_RULES',
  },
  practice: {
    voice: 'TEACHER_TO_PUPIL_WRITTEN',
    duration: { min: 5, max: 7 },
    mustBeComplete: true,
  },
  feedback: {
    voice: 'PUPIL',
    formats: ['modelAnswer', 'workedExample', 'successCriteria'],
  },
} as const;
```

**Integration**:

- Schema: Cycle schema validation
- Prompts: Cycle generation instructions

**Complexity**: Medium
**Value**: Very High

---

### Target 5: Timing Constraints

**Domain Knowledge**: Lesson duration by key stage, component timing, cycle duration ranges.

**Current State**: Scattered across multiple files as prose

**Extraction Format**:

```typescript
export const TIMING = {
  lessonDuration: {
    'key-stage-1': 40,
    'key-stage-2': 50,
    'key-stage-3': 50,
    'key-stage-4': 50,
    'key-stage-5': 50,
  },
  cycleDuration: {
    'key-stage-1': { min: 8, max: 12 },
    default: { min: 10, max: 20 },
  },
  quizTime: 5,
  cycleCount: { min: 1, max: 3 },
} as const;
```

**Integration**:

- Validation: Duration consistency checks
- Prompts: Time allocation guidance

**Complexity**: Low
**Value**: High

---

## 2. Medium-Priority Extraction Targets

### Target 6: Moderation Categories

**Domain Knowledge**: 6 category groups for content moderation with Likert scoring.

**Extraction Format**: Data structure mapping category codes to descriptions and criteria.

**Complexity**: Medium
**Value**: Medium

### Target 7: Practice Task Types

**Domain Knowledge**: ~50 practice task types categorised by cognitive demand.

**Extraction Format**: Categorised task type catalogue.

**Complexity**: Medium
**Value**: Medium

### Target 8: British English Rules

**Domain Knowledge**: American to British English mappings.

**Extraction Format**: Dictionary or lookup table.

**Complexity**: Low
**Value**: Medium

---

## 3. Low-Priority / Defer

### Defer: Prompt Assembly Mechanics

The `getPromptParts()` conditional assembly is implementation-specific. Extract the knowledge in the parts, not the assembly pattern.

### Defer: JSON Patch Protocol

Standard format (RFC 6902). No domain knowledge to extract.

### Defer: Hash Generation

Caching optimisation, not domain knowledge.

---

## 4. Patterns to Avoid

### Avoid: Over-Abstracting Prompts

The current prompt system has excessive abstraction. Simpler template strings with data injection would be clearer.

### Avoid: Implicit Dependencies

Section ordering is implicit in arrays. Make dependencies explicit in a graph structure.

### Avoid: Prose in Schemas

Constraints embedded in description strings should be in schema validators.

### Avoid: Dual Schema Maintenance

`SchemaWithoutLength` and `Schema` variants should be generated from one source.

---

## 5. Integration with Existing Plans

### Plan 01: Tool Metadata Enhancement

**Extracted Knowledge to Apply**:

- Voice system as tool parameter metadata
- Timing constraints as validation metadata
- Section dependencies as tool availability rules

### Plan 02: Curriculum Ontology Resource

**Extracted Knowledge to Apply**:

- Key stage definitions and mappings
- Subject-key stage relationships
- Curriculum taxonomy

### Plan 03: Infrastructure and Advanced Tools

**Extracted Knowledge to Apply**:

- Section dependencies for workflow orchestration
- Moderation categories for safety tooling
- Material generation patterns

### Plan 04: Prompts and Agent Guidance

**Extracted Knowledge to Apply**:

- Voice system for prompt generation
- Quiz design rules for quiz prompts
- Cycle structure for cycle prompts
- Practice task types for practice prompts

---

## 6. Implementation Roadmap

### Phase 1: Data Structures (1-2 days)

Create typed `as const` objects for:

1. Voice system
2. Section dependencies
3. Timing constraints
4. Key stage definitions

**Deliverable**: `packages/sdks/oak-curriculum-sdk/src/generated/educational-domain.ts`

### Phase 2: Validation Rules (2-3 days)

Convert prose rules to Zod schemas or validation functions:

1. Quiz design rules
2. Distractor criteria
3. Section field constraints

**Deliverable**: `packages/sdks/oak-curriculum-sdk/src/validation/`

### Phase 3: Prompt Templates (3-4 days)

Create prompt generation utilities using extracted data:

1. Section prompts with voice injection
2. Quiz prompts with scope rules
3. Cycle prompts with structure validation

**Deliverable**: Integration with Plan 04 prompt utilities

### Phase 4: MCP Integration (2-3 days)

Apply extracted knowledge to MCP tools:

1. Tool metadata enhancement
2. Tool availability logic
3. Response validation

**Deliverable**: Enhanced MCP tools with embedded domain knowledge

---

## 7. Success Criteria

- [ ] Voice system as typed constant, used in prompts
- [ ] Section dependencies as graph, enforced in workflow
- [ ] Quiz rules as validation functions
- [ ] Timing constraints as configuration
- [ ] All extracted knowledge traceable to source documentation
- [ ] No prose-in-code where data structures suffice

---

## Appendix: Cross-Cutting Patterns

### Pattern: Voice-Annotated Content

Content generation should always specify target voice. Voice determines:

- Formality
- Vocabulary complexity
- Sentence structure
- Audience assumptions

### Pattern: Key Stage Scaling

Many constraints scale with key stage:

- Content complexity
- Time allocations
- Assessment expectations
- Vocabulary level

Extract as lookup tables indexed by key stage.

### Pattern: Scope-Based Quiz Content

Quiz content scope is binary:

- Starter: Prior knowledge only
- Exit: Lesson content only

Never mix. This is the most critical quiz design rule.

### Pattern: Complete-Before-Display

Learning cycles must be complete before display:

- All subcomponents present
- Feedback format specified
- Practice task has all needed content

Partial cycles break the pedagogical flow.
