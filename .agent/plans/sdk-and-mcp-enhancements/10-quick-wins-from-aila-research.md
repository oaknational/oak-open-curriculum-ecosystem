# Plan 10: Quick Wins from Aila Domain Extraction Research

**Status**: Ready for Implementation
**Priority**: High
**Estimated Effort**: 1 day
**Prerequisites**: Plans 01-04 awareness, research complete

---

## Overview

This plan captures quick wins from the Aila domain extraction research that can be implemented immediately to enhance the current **read-only curriculum browsing** SDK. All items are compatible with:

- **rules.md**: TDD, pure functions, schema-first, no type shortcuts
- **schema-first-execution.md**: Generated artefacts from OpenAPI schema
- **testing-strategy.md**: Unit tests first, behaviour over implementation

### Scope Clarification

The SDK currently supports **read-only** operations - retrieving existing Oak curriculum content. This plan focuses on:

- ✅ **Enhancing ontology** with pedagogical domain knowledge
- ✅ **Improving documentation** with educational context
- ✅ **Refining tool metadata** for better AI understanding
- ❌ **NOT** content generation (covered in `gap-analysis-sdk-vs-aila-research.md`)

---

## Critical Constraints

### Cardinal Rule Compliance

All quick wins MUST flow from the Open Curriculum OpenAPI schema via `pnpm type-gen`. Quick wins are categorised as:

1. **Static Data**: Pure `as const` structures that enhance domain knowledge exposure
2. **Documentation Enhancement**: Additions to ontology data and resources
3. **Type-Gen Enhancement**: Improvements to generated tool metadata

---

## Quick Wins

### QW-01: Timing Constraints for Ontology

**Category**: Static Data → Ontology Enhancement
**Effort**: 1 hour
**Purpose**: Expose key stage timing constraints in `get-ontology` output

**Implementation**:

```typescript
/**
 * Timing constraints in minutes by UK Key Stage.
 * Extracted from Oak AI Lesson Assistant research.
 *
 * Added to ontology-data.ts to expose via get-ontology tool.
 *
 * @see .agent/research/aila-modular-extraction/domain-model.md
 */
export const TIMING_CONSTRAINTS = {
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
  cycleCount: { min: 1, max: 3 },
} as const;

export type KeyStageTiming = keyof typeof TIMING_CONSTRAINTS.lessonDuration;
```

**Integration**: Add to `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`

**TDD Approach**:

```typescript
describe('ontologyData', () => {
  it('includes timing constraints by key stage', () => {
    expect(ontologyData.timingConstraints).toBeDefined();
    expect(ontologyData.timingConstraints.lessonDuration['key-stage-1']).toBe(40);
    expect(ontologyData.timingConstraints.lessonDuration['key-stage-2']).toBe(50);
  });

  it('includes component duration ranges', () => {
    expect(ontologyData.timingConstraints.componentDuration.starterQuiz).toEqual({
      min: 2,
      max: 3,
    });
    expect(ontologyData.timingConstraints.componentDuration.learningCycle).toEqual({
      min: 10,
      max: 20,
    });
    expect(ontologyData.timingConstraints.componentDuration.learningCycleKS1).toEqual({
      min: 8,
      max: 12,
    });
  });
});
```

---

### QW-02: Quiz Scope Rules for Ontology

**Category**: Static Data → Ontology Enhancement
**Effort**: 1 hour
**Purpose**: Document quiz scope rules (starter vs exit) in ontology

**Implementation**:

```typescript
/**
 * Quiz scope rules for educational assessment.
 * Helps AI understand the difference between starter and exit quizzes.
 *
 * @see .agent/research/aila-modular-extraction/quiz-generation-expertise.md
 */
export const QUIZ_SCOPE_RULES = {
  starter: {
    purpose: 'Assess prior knowledge before the lesson',
    tests: 'Prerequisites and foundational concepts from previous learning',
    excludes: 'Content taught in this lesson',
    targetScore: '5 out of 6 for average pupil',
  },
  exit: {
    purpose: 'Assess learning from the lesson',
    tests: 'Key learning points and objectives from this lesson',
    excludes: 'Prior knowledge not reinforced in this lesson',
    targetScore: '5 out of 6 for average pupil',
    mustCover: ['keyLearningPoint', 'misconception', 'keyword'],
  },
  common: {
    questionCount: 6,
    difficultyProgression: 'Questions progress from easier (Q1) to harder (Q6)',
    answerFormat: {
      correctAnswers: 1,
      distractors: 2,
      ordering: 'alphabetical',
    },
  },
  designPrinciples: {
    avoidPatterns: ['negative phrasing', 'true/false', 'all/none of above'],
    distractorRules: ['plausible', 'similar length', 'same category', 'grammatically consistent'],
    ks4CommandWords: ['state', 'identify', 'select'],
  },
} as const;

export type QuizScope = keyof typeof QUIZ_SCOPE_RULES;
```

**Integration**: Add to `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`

**Value**: When AI retrieves quiz data via `get-lessons-quiz`, it can consult ontology to understand why starter and exit quizzes have different content.

---

### QW-03: Section Groups for Ontology

**Category**: Static Data → Ontology Enhancement
**Effort**: 1 hour
**Purpose**: Document lesson plan section structure and dependencies

**Implementation**:

```typescript
/**
 * Lesson plan section groups defining structure and dependencies.
 * Helps AI understand how Oak lessons are organised.
 *
 * @see .agent/research/aila-modular-extraction/additional-discoveries.md
 */
export const LESSON_STRUCTURE = {
  sectionGroups: [
    {
      name: 'Identity',
      sections: ['title', 'keyStage', 'subject'],
      description: 'Basic lesson identification',
    },
    {
      name: 'Foundation',
      sections: ['learningOutcome', 'learningCycles'],
      description: 'Core learning objectives and cycle structure',
    },
    {
      name: 'Context',
      sections: ['priorKnowledge', 'keyLearningPoints', 'misconceptions', 'keywords'],
      description: 'Background knowledge and key content',
    },
    {
      name: 'Delivery',
      sections: ['starterQuiz', 'cycle1', 'cycle2', 'cycle3', 'exitQuiz'],
      description: 'Assessment and teaching content',
    },
    {
      name: 'Supplementary',
      sections: ['additionalMaterials'],
      description: 'Extra resources and materials',
    },
  ],
  sectionDependencies: {
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
  },
  learningCycleStructure: {
    components: ['explanation', 'checkForUnderstanding', 'practice', 'feedback'],
    description: 'Each learning cycle follows Explain → Check → Practice → Feedback',
  },
} as const;
```

**Integration**: Add to `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`

**Value**: When AI uses `lesson-planning` prompt or retrieves lesson summaries, it understands the pedagogical structure.

---

### QW-04: Educational Model Documentation Resource

**Category**: Documentation Enhancement
**Effort**: 2 hours
**Purpose**: New MCP resource explaining Oak's educational model

**Implementation**: Add new resource to `documentation-resources.ts`

```typescript
export const DOCUMENTATION_RESOURCES: readonly DocumentationResource[] = [
  // ... existing resources ...
  {
    name: 'educational-model',
    uri: 'docs://oak/educational-model.md',
    title: 'Oak Educational Model',
    description:
      'Understanding lesson structure, learning cycles, quiz design, and key stage timing.',
    mimeType: 'text/markdown',
  },
] as const;
```

**Content** (new function `getEducationalModelMarkdown()`):

```markdown
# Oak Educational Model

## Lesson Structure

Oak lessons follow a consistent pedagogical structure designed by education experts.

### Learning Cycles

Each lesson contains 1-3 learning cycles, each following the pattern:

1. **Explanation** - Teacher introduces the concept
2. **Check for Understanding** - Quick formative assessment
3. **Practice** - Pupils apply the concept
4. **Feedback** - Review and consolidation

#### Learning Cycle Components in Detail

**Explanation**

- Spoken explanation: 1-5 bullet points with key concepts, models, analogies, examples
- Accompanying slide details: Visual support for the spoken explanation
- Slide text: Maximum 2 sentences, no teacher narrative (pupil-facing only)
- Image search suggestion: Term for teacher to find supporting image

**Check for Understanding**

- 2 multiple-choice questions per cycle
- 1 correct answer, 2 distractors
- Must NOT duplicate questions from starter or exit quiz

**Practice** (5-7 minutes)

- Complete, self-contained task with all content needed
- Difficulty progression within the task
- Must activate all pupils (not just fastest finishers)

**Feedback**

- Provided in pupil voice ("I can see that...")
- Formats: model answer, worked example, or success criteria
- Must be pupil-facing, not teacher notes

### Quiz Design

**Starter Quiz** (before lesson):

- Tests prior knowledge and prerequisites
- Should NOT test content from this lesson
- Target: average pupil scores 5/6
- 6 questions, Q1 easiest to Q6 hardest

**Exit Quiz** (after lesson):

- Tests key learning points from THIS lesson
- Must cover: at least one key learning point, one misconception, one keyword
- Should NOT test only prior knowledge
- Target: average pupil scores 5/6
- 6 questions, Q1 easiest to Q6 hardest

**Question Design Principles**

- Avoid negative phrasing ("Which is NOT...")
- No true/false questions
- No "all of the above" or "none of the above"
- One correct answer, two plausible distractors
- Distractors: similar length, same category, grammatically consistent
- Answers in alphabetical order

### Section Dependencies

Lesson sections build on each other pedagogically:

1. **Identity** (title, keyStage, subject) - Must be established first
2. **Foundation** (learningOutcome, learningCycles) - Requires identity
3. **Context** (priorKnowledge, keyLearningPoints, misconceptions, keywords) - Requires foundation
4. **Delivery** (starterQuiz, cycles, exitQuiz) - Requires context
5. **Supplementary** (additionalMaterials) - Built last

### Key Stage Timing

| Key Stage | Lesson Duration | Cycle Duration |
| --------- | --------------- | -------------- |
| KS1       | 40 minutes      | 8-12 minutes   |
| KS2-KS4   | 50 minutes      | 10-20 minutes  |

Component timing:

- Starter Quiz: 2-3 minutes
- Exit Quiz: 2-3 minutes
- Learning Cycles: 1-3 per lesson

## British English

All Oak content uses British English spelling and terminology:

- "colour" not "color"
- "maths" not "math"
- "Year 4" not "4th grade"
- "centre" not "center"
```

---

### QW-05: Improved Tool Status Text (Type-Gen)

**Category**: Type-Gen Enhancement
**Effort**: 2 hours
**Purpose**: Refine generated tool status text to be clearer and more educational

**Current** (generated):

```
'openai/toolInvocation/invoking': "Fetching Get Lessons Quiz…"
'openai/toolInvocation/invoked': "Get Lessons Quiz loaded"
```

**Improved** (via type-gen template update):

```
'openai/toolInvocation/invoking': "Loading quiz questions…"
'openai/toolInvocation/invoked': "Quiz questions ready"
```

**Implementation**: Update `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-tool-file.ts` to:

1. Remove redundant "Get" prefix from status text
2. Use simpler, clearer language
3. Follow AILA_TO_TEACHER voice: supportive, clear, professional

**Mapping**:

| Tool                     | Current Invoking                   | Improved Invoking            |
| ------------------------ | ---------------------------------- | ---------------------------- |
| `get-lessons-quiz`       | "Fetching Get Lessons Quiz…"       | "Loading quiz questions…"    |
| `get-lessons-summary`    | "Fetching Get Lessons Summary…"    | "Loading lesson details…"    |
| `get-key-stages`         | "Fetching Get Key Stages…"         | "Loading key stages…"        |
| `get-subjects`           | "Fetching Get Subjects…"           | "Loading subjects…"          |
| `get-lessons-transcript` | "Fetching Get Lessons Transcript…" | "Loading lesson transcript…" |

---

## Implementation Order

| Order | Quick Win                     | Effort | Dependencies | Value  |
| ----- | ----------------------------- | ------ | ------------ | ------ |
| 1     | QW-01: Timing Constraints     | 1h     | None         | High   |
| 2     | QW-02: Quiz Scope Rules       | 1h     | None         | High   |
| 3     | QW-03: Section Groups         | 1h     | None         | High   |
| 4     | QW-04: Educational Model Doc  | 2h     | QW-01,02,03  | High   |
| 5     | QW-05: Status Text Refinement | 2h     | Type-gen     | Medium |

**Total Effort**: ~7 hours (1 day)

---

## TDD Workflow for Each Quick Win

1. **RED**: Write unit test specifying behaviour
2. **RUN**: Confirm test fails (data/function doesn't exist)
3. **GREEN**: Implement minimal code to pass test
4. **RUN**: Confirm test passes
5. **REFACTOR**: Improve implementation, tests stay green
6. **DOCUMENT**: Add TSDoc comments

---

## File Structure

```text
packages/sdks/oak-curriculum-sdk/src/
├── mcp/
│   ├── ontology-data.ts              # Add QW-01, QW-02, QW-03
│   ├── ontology-data.unit.test.ts    # Add tests for new data
│   ├── documentation-resources.ts     # Add QW-04 resource
│   └── documentation-resources.unit.test.ts  # Add test for new resource
└── type-gen/
    └── typegen/mcp-tools/parts/
        └── generate-tool-file.ts      # QW-05 status text improvements
```

---

## Success Criteria

- [ ] All quick wins implemented with TDD (tests first)
- [ ] Ontology data includes timing, quiz scope, and section structure
- [ ] New educational-model.md resource available via MCP
- [ ] Tool status text is clearer and follows educational voice
- [ ] All tests pass: `pnpm test`
- [ ] Type check passes: `pnpm type-check`
- [ ] Lint passes: `pnpm lint`
- [ ] Build succeeds: `pnpm build`

---

## Out of Scope (Future-Ready)

The following patterns from the Aila research are **not applicable** to the current read-only SDK but are documented in `gap-analysis-sdk-vs-aila-research.md` for future use:

| Pattern                             | Why Not Applicable                         | Future Trigger            |
| ----------------------------------- | ------------------------------------------ | ------------------------- |
| **Voice System Data Structure**     | SDK retrieves content, doesn't generate it | If generation tools added |
| **Distractor Validation Functions** | SDK returns existing distractors           | If quiz generation added  |
| **Quiz Scope Validation Functions** | SDK returns existing quizzes               | If quiz generation added  |
| **User Feedback Categories**        | SDK doesn't collect user feedback          | If feedback tools added   |
| **Tool Annotation Helpers**         | Already implemented in type-gen            | Complete                  |

These patterns are preserved in:

- `.agent/research/aila-modular-extraction/additional-discoveries.md` (full patterns)
- `.agent/research/aila-modular-extraction/gap-analysis-sdk-vs-aila-research.md` (applicability analysis)

---

## References

- [Aila Domain Extraction Research](../../research/aila-modular-extraction/README.md)
- [Gap Analysis: SDK vs Research](../../research/aila-modular-extraction/gap-analysis-sdk-vs-aila-research.md)
- [OpenAI SDK Alignment Analysis](../../research/aila-modular-extraction/openai-sdk-alignment-analysis.md)
- [Additional Discoveries](../../research/aila-modular-extraction/additional-discoveries.md)
