# Gap Analysis: Current SDK vs Aila Research Findings

**Date**: 2025-11-30
**Status**: Complete

---

## Executive Summary

This analysis compares the current Oak Curriculum SDK MCP implementation with the domain knowledge extracted from the Aila research. The SDK currently focuses on **read-only curriculum browsing** from the Oak Curriculum API. The Aila research reveals extensive **content generation and authoring** capabilities that are not yet in scope.

---

## Current SDK Inventory

### Generated Tools (26 tools) - All READ-ONLY

| Category             | Tools                                                                                                                                 | Purpose                       |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| **Admin/Status**     | `get-changelog`, `get-changelog-latest`, `get-rate-limit`                                                                             | API health/changes            |
| **Browsing**         | `get-key-stages`, `get-subjects`, `get-subject-detail`, `get-subjects-key-stages`, `get-subjects-sequences`, `get-subjects-years`     | Navigate curriculum hierarchy |
| **Progression**      | `get-threads`, `get-threads-units`                                                                                                    | Track concept threads         |
| **Key Stage Scoped** | `get-key-stages-subject-assets`, `get-key-stages-subject-lessons`, `get-key-stages-subject-questions`, `get-key-stages-subject-units` | Browse by key stage + subject |
| **Lesson Content**   | `get-lessons-assets`, `get-lessons-assets-by-type`, `get-lessons-quiz`, `get-lessons-summary`, `get-lessons-transcript`               | Retrieve lesson data          |
| **Discovery**        | `get-search-lessons`, `get-search-transcripts`                                                                                        | Full-text search              |
| **Sequence Content** | `get-sequences-assets`, `get-sequences-questions`, `get-sequences-units`                                                              | Retrieve sequence data        |
| **Unit Content**     | `get-units-summary`                                                                                                                   | Retrieve unit data            |

### Aggregated Tools (4 tools) - All READ-ONLY

| Tool           | Purpose                                                  |
| -------------- | -------------------------------------------------------- |
| `search`       | Combined lesson + transcript search                      |
| `fetch`        | Fetch by canonical ID (`lesson:slug`, `unit:slug`, etc.) |
| `get-ontology` | Static curriculum domain model                           |
| `get-help`     | Usage guidance                                           |

### MCP Prompts (3 prompts)

| Prompt            | Purpose                       |
| ----------------- | ----------------------------- |
| `find-lessons`    | Topic search workflow         |
| `lesson-planning` | Gather materials for planning |
| `progression-map` | Track concept progression     |

### Documentation Resources (3 resources)

| Resource             | Purpose          |
| -------------------- | ---------------- |
| `getting-started.md` | Introduction     |
| `tools.md`           | Tool reference   |
| `workflows.md`       | Common workflows |

---

## What Already Applies from Research

### ✅ Already Implemented

| Research Finding            | SDK Implementation                                      | Status      |
| --------------------------- | ------------------------------------------------------- | ----------- |
| **Read-only annotations**   | All tools have `readOnlyHint: true`                     | ✅ Complete |
| **Tool status text**        | All tools have `openai/toolInvocation/invoking/invoked` | ✅ Complete |
| **Ontology/domain model**   | `get-ontology` tool returns curriculum structure        | ✅ Complete |
| **Help system**             | `get-help` tool provides usage guidance                 | ✅ Complete |
| **Workflow prompts**        | 3 MCP prompts for common workflows                      | ✅ Complete |
| **Documentation resources** | 3 markdown resources for getting started                | ✅ Complete |
| **Key stage browsing**      | Multiple tools for KS1-KS4 content                      | ✅ Complete |
| **Quiz retrieval**          | `get-lessons-quiz`, `get-sequences-questions`           | ✅ Complete |

### ✅ Partially Applicable (Quick Wins Can Enhance)

| Research Finding             | Current Status                   | Enhancement Opportunity                       |
| ---------------------------- | -------------------------------- | --------------------------------------------- |
| **Voice system**             | Status text uses generic voice   | Could use AILA_TO_TEACHER patterns from QW-01 |
| **Timing constraints**       | Not exposed                      | QW-02 could add timing metadata to ontology   |
| **Quiz structure rules**     | Data returned, rules not exposed | QW-03 could document rules in ontology        |
| **Distractor validation**    | Not applicable (read-only)       | QW-05/06 useful if generation added           |
| **Section groups**           | Not exposed                      | QW-09 could add to ontology                   |
| **User feedback categories** | Not applicable                   | QW-08 useful for future feedback tools        |

---

## What Does NOT Apply (Read-Only Scope)

The SDK is currently **read-only** - it retrieves Oak curriculum content. The Aila research covers **content generation and authoring**. These findings do not apply yet:

| Aila Capability                   | Why Not Applicable                                        |
| --------------------------------- | --------------------------------------------------------- |
| **Quiz generation**               | SDK retrieves existing quizzes, doesn't generate new ones |
| **Lesson plan generation**        | SDK retrieves existing lessons, doesn't generate plans    |
| **Learning cycle creation**       | SDK doesn't create content                                |
| **Distractor design**             | SDK returns existing distractors, doesn't create them     |
| **Content moderation**            | SDK doesn't generate content requiring moderation         |
| **Teaching materials generation** | SDK doesn't generate materials                            |
| **Section agent orchestration**   | SDK doesn't have generative agents                        |
| **Dual schema pattern**           | SDK validates API responses, not LLM-generated content    |
| **Subject-specific routing**      | SDK doesn't route to different generators                 |
| **Categorisation system**         | SDK doesn't extract metadata from free text               |

---

## Gap Analysis: What's Missing

### High Priority Gaps (Should Fill Soon)

| Gap                                         | Description                                          | Value                                | Suggested MCP Addition                                                                 |
| ------------------------------------------- | ---------------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------- |
| **Curriculum domain knowledge in ontology** | Ontology returns structure but not pedagogical rules | Helps AI understand context          | Enhance `get-ontology` with timing constraints, section dependencies, quiz scope rules |
| **Key stage timing visibility**             | No exposure of lesson duration by key stage          | Helps planning workflows             | Add to ontology or new `get-timing-constraints` tool                                   |
| **Quiz design rules visibility**            | No exposure of quiz structure rules                  | Helps AI interpret quiz data         | Add quiz rules to ontology documentation                                               |
| **British English guidance**                | No explicit guidance on language expectations        | Ensures consistent voice             | Add language/voice documentation to resources                                          |
| **Learning cycle documentation**            | No exposure of Explain-Check-Practice-Feedback model | Helps AI understand lesson structure | Add learning cycle info to ontology                                                    |

### Medium Priority Gaps (Future Enhancements)

| Gap                         | Description                                     | Value                                | Suggested MCP Addition                             |
| --------------------------- | ----------------------------------------------- | ------------------------------------ | -------------------------------------------------- |
| **Lesson plan template**    | No structured template for lesson plans         | Could guide AI in planning workflows | New resource: `docs://oak/lesson-plan-template.md` |
| **Quiz scope explanations** | No explanation of starter vs exit quiz purposes | Helps AI give better guidance        | Add to ontology or new documentation               |
| **Vocabulary tier system**  | Tier 2/3 vocabulary not exposed                 | Educational domain knowledge         | Add vocabulary guidance to documentation           |
| **Misconception patterns**  | Common misconceptions not documented            | Helps with educational context       | Could be new resource if data available            |

### Future Enhancements (If/When Scope Expands)

These would require new API capabilities or scope expansion:

| Future Capability           | Trigger                             | Required Infrastructure                                               |
| --------------------------- | ----------------------------------- | --------------------------------------------------------------------- |
| **Quiz generation tool**    | If Oak API adds generation endpoint | New tool with `readOnlyHint: false`, validation using extracted rules |
| **Lesson plan generation**  | If Oak API adds generation endpoint | New tool with section dependencies, voice system integration          |
| **Content validation tool** | If quality checking needed          | Validation functions (see Future-Ready Patterns below)                |
| **Categorisation tool**     | If free-text parsing needed         | AI-powered key stage/subject extraction                               |
| **Feedback collection**     | If user feedback needed             | Feedback categories (see Future-Ready Patterns below)                 |

---

## Future-Ready Patterns (Preserved from Research)

The following patterns were extracted from Aila research but are **not applicable to the current read-only scope**. They are preserved here for when the SDK scope expands to include generation or feedback capabilities.

### Voice System Data Structure

**Use When**: SDK needs to generate content with appropriate voice/tone.

```typescript
/**
 * Voice definitions for educational content generation.
 * @see .agent/research/aila-modular-extraction/language-and-voice.md
 */
export const VOICES = {
  AILA_TO_TEACHER: {
    id: 'AILA_TO_TEACHER',
    speaker: 'Aila',
    audience: 'Teacher',
    tone: 'supportive expert',
    canAskQuestions: true,
  },
  PUPIL: {
    id: 'PUPIL',
    speaker: 'Pupil',
    audience: 'Class/Teacher',
    tone: 'age-appropriate',
  },
  TEACHER_TO_PUPIL_WRITTEN: {
    id: 'TEACHER_TO_PUPIL_WRITTEN',
    speaker: 'Teacher',
    audience: 'Pupils',
    medium: 'written',
    tone: 'formal, concise, instructional',
  },
  TEACHER_TO_PUPIL_SPOKEN: {
    id: 'TEACHER_TO_PUPIL_SPOKEN',
    speaker: 'Teacher',
    audience: 'Pupils',
    medium: 'spoken',
    tone: 'professional, friendly',
  },
  EXPERT_TEACHER: {
    id: 'EXPERT_TEACHER',
    speaker: 'Expert teacher',
    audience: 'Teacher',
    tone: 'pedagogical expertise',
  },
} as const;
```

### Distractor Length Validation

**Use When**: SDK generates quiz questions and needs to validate distractor quality.

```typescript
/**
 * Validate that distractor length is within tolerance of correct answer.
 * @see .agent/research/aila-modular-extraction/distractor-design-rules.md
 */
export function isDistractorLengthValid(
  correctAnswer: string,
  distractor: string,
  tolerance: number = 0.3,
): boolean {
  const correctLength = correctAnswer.trim().length;
  const distractorLength = distractor.trim().length;
  const difference = Math.abs(correctLength - distractorLength);
  const threshold = correctLength * tolerance;
  return difference <= threshold;
}
```

### Quiz Scope Validation

**Use When**: SDK generates quizzes and needs to validate starter vs exit scope.

```typescript
/**
 * Validate that quiz questions respect scope rules.
 * @see .agent/research/aila-modular-extraction/quiz-generation-expertise.md
 */
export type QuizType = 'starter' | 'exit';

export interface QuizScopeValidationInput {
  quizType: QuizType;
  questions: readonly string[];
  priorKnowledge: readonly string[];
  lessonContent: readonly string[];
}

export function validateQuizScope(input: QuizScopeValidationInput): {
  valid: boolean;
  violations: Array<{ questionIndex: number; issue: string; detail: string }>;
} {
  // Implementation validates starter tests prior knowledge, exit tests lesson content
}
```

### User Feedback Categories

**Use When**: SDK collects user feedback on retrieved content.

```typescript
/**
 * User feedback categories for lesson content.
 * @see .agent/research/aila-modular-extraction/additional-discoveries.md
 */
export const USER_FLAG_TYPES = {
  INAPPROPRIATE: { id: 'INAPPROPRIATE', description: 'Content inappropriate for audience' },
  INACCURATE: { id: 'INACCURATE', description: 'Factually incorrect content' },
  TOO_HARD: { id: 'TOO_HARD', description: 'Too difficult for key stage' },
  TOO_EASY: { id: 'TOO_EASY', description: 'Too simple for key stage' },
  OTHER: { id: 'OTHER', description: 'Other concerns' },
} as const;

export const USER_MODIFICATION_ACTIONS = {
  MAKE_IT_HARDER: { id: 'MAKE_IT_HARDER', description: 'Increase difficulty' },
  MAKE_IT_EASIER: { id: 'MAKE_IT_EASIER', description: 'Decrease difficulty' },
  SHORTEN_CONTENT: { id: 'SHORTEN_CONTENT', description: 'Reduce length' },
  ADD_MORE_DETAIL: { id: 'ADD_MORE_DETAIL', description: 'Expand content' },
  ADD_HOMEWORK_TASK: { id: 'ADD_HOMEWORK_TASK', description: 'Include homework' },
  ADD_NARRATIVE: { id: 'ADD_NARRATIVE', description: 'Add teacher narrative' },
  ADD_PRACTICE_QUESTIONS: { id: 'ADD_PRACTICE_QUESTIONS', description: 'More practice' },
  TRANSLATE_KEYWORDS: { id: 'TRANSLATE_KEYWORDS', description: 'Add translations' },
  ADD_PRACTICAL_INSTRUCTIONS: {
    id: 'ADD_PRACTICAL_INSTRUCTIONS',
    description: 'Hands-on activities',
  },
  OTHER: { id: 'OTHER', description: 'Other modifications' },
} as const;
```

---

## Recommended Actions

### Immediate (Plan 10 Quick Wins)

1. **Enhance ontology data** (Plan 10: QW-01, QW-02, QW-03):
   - Timing constraints by key stage
   - Quiz scope rules (starter tests prior knowledge, exit tests lesson content)
   - Section groups and dependencies
   - Learning cycle structure (Explain-Check-Practice-Feedback)

2. **Add educational model documentation** (Plan 10: QW-04):
   - `docs://oak/educational-model.md` - Learning cycle, timing, quiz design

3. **Refine tool status text** (Plan 10: QW-05):
   - Current: "Fetching Get Lessons Quiz…"
   - Better: "Loading quiz questions…" (simpler, clearer)

### Medium-Term (New Prompts)

4. **Add educational context prompts**:
   - `quiz-analysis` - Analyse quiz quality against extracted rules
   - `lesson-review` - Review lesson structure against learning cycle model
   - `differentiation-guidance` - Suggest adaptations by key stage

### Long-Term (If Scope Expands)

5. **Prepare for generation capabilities** (see Future-Ready Patterns above):
   - Voice system available for generated content
   - Distractor validation functions ready to use
   - Quiz scope validation functions ready to use
   - Feedback categories defined for user input

---

## Summary Table

| Research Area            | Current Applicability | Plan 10 Action       | Future Enhancement  |
| ------------------------ | --------------------- | -------------------- | ------------------- |
| Timing Constraints       | Not exposed           | QW-01 (ontology)     | -                   |
| Quiz Scope Rules         | Not exposed           | QW-02 (ontology)     | -                   |
| Section Groups           | Not exposed           | QW-03 (ontology)     | -                   |
| Educational Model Doc    | Not exposed           | QW-04 (resource)     | -                   |
| Tool Status Text         | ✅ Complete           | QW-05 (refinement)   | -                   |
| Tool Annotations         | ✅ Complete           | -                    | -                   |
| Voice System             | Partial (status text) | Future-ready pattern | If generation added |
| Distractor Validation    | Not applicable        | Future-ready pattern | If generation added |
| Quiz Scope Validation    | Not applicable        | Future-ready pattern | If generation added |
| User Feedback            | Not applicable        | Future-ready pattern | If feedback added   |
| Prompt Architecture      | N/A                   | -                    | Future generation   |
| Lesson Planning Workflow | Partial (prompts)     | -                    | Enhanced prompts    |
| Content Moderation       | Not applicable        | -                    | Future generation   |
| Language/Voice           | Partial (docs)        | QW-04 (resource)     | -                   |
| Teaching Materials       | Partial (assets)      | -                    | Documentation       |
| Categorisation           | Not applicable        | -                    | Future NLP tool     |

---

## Conclusion

The current SDK is well-aligned with its read-only curriculum browsing scope. The Aila research provides valuable domain knowledge that can enhance the SDK in two ways:

1. **Immediate**: Enrich static documentation and ontology with pedagogical context (timing, quiz rules, learning cycles, section dependencies)

2. **Future-Ready**: The extracted validation rules, voice system, and feedback categories are ready to use if/when generation capabilities are added

The highest-value immediate action is enhancing the `get-ontology` output and documentation resources with the educational domain knowledge extracted from Aila.
