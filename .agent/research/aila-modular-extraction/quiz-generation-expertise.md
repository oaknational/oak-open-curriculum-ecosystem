# Quiz Generation Expertise

**Research Area**: 3 - Quiz Generation
**Status**: Complete
**Last Updated**: 2025-11-30

---

## Overview

Complete documentation of quiz generation knowledge, including question design rules, pedagogical constraints, and generation patterns extracted from the Aila system.

---

## Key Files Analysed

- `packages/aila/src/lib/agents/prompts/shared/quizQuestionDesignInstructions.ts`
- `packages/aila/src/lib/agentic-system/agents/sectionAgents/shared/quizQuestionDesign.instructions.ts`
- `packages/aila/src/lib/agentic-system/agents/sectionAgents/starterQuizAgent/starterQuiz.instructions.ts`
- `packages/aila/src/lib/agentic-system/agents/sectionAgents/exitQuizAgent/exitQuiz.instructions.ts`
- `packages/core/src/prompts/lesson-assistant/parts/body.ts`

---

## 1. Question Design Rules

### General Principles

| Rule                       | Rationale                                  |
| -------------------------- | ------------------------------------------ |
| Age-appropriate detail     | Match reading age and taught content level |
| No negative phrasing       | "Which is not..." confuses pupils          |
| No true/false              | Binary choices lack discrimination         |
| No clues in question       | Avoid giving away the answer               |
| No irrelevant detail       | Reduces cognitive load                     |
| Incorporate misconceptions | Tests for common errors                    |
| No content overlap         | Each question tests unique knowledge       |

### Negative Phrasing Prohibition

**Prohibited patterns**:

- "Which of these is NOT..."
- "All of the following EXCEPT..."
- "Which is false?"

**Rationale**: Negative phrasing requires double-processing (understand the content + negate it), causing confusion especially for younger pupils or those with processing differences.

### True/False Prohibition

**Rationale**:

- 50% chance of guessing correctly
- No discrimination between partially and fully correct understanding
- Doesn't reveal misconception types

### Clue Avoidance

**Prohibited**:

- Answer repeating question words verbatim
- Only one grammatically correct answer
- Obvious length differences
- Category mismatches

### Misconception Incorporation

Effective distractors often represent common misconceptions:

- "Multiplying always makes bigger" (misconception about negatives/fractions)
- "All cells have a nucleus" (misconception about bacteria)

This allows the quiz to diagnose specific misunderstandings, not just incorrect responses.

### Overlap Prevention

Each question must test **distinct** content. If Q1 tests "cell membrane function", Q2 should not test "membrane permeability" (overlapping concept).

---

## 2. Key Stage Adaptations

### KS1-2 Considerations

| Aspect            | Adaptation                            |
| ----------------- | ------------------------------------- |
| Reading level     | Simpler vocabulary, shorter sentences |
| Question length   | Briefer questions                     |
| Answer complexity | Concrete rather than abstract         |
| Distractors       | More obviously different              |

### KS3 Considerations

| Aspect              | Adaptation                       |
| ------------------- | -------------------------------- |
| Reading level       | Academic vocabulary introduced   |
| Question complexity | Can include multi-step reasoning |
| Distractors         | Closer plausibility              |

### KS4 Command Words

Questions should start with **exam command words** appropriate to assessment objectives:

| Command Word | Cognitive Level | Example                            |
| ------------ | --------------- | ---------------------------------- |
| State        | Recall          | "State the function of..."         |
| Identify     | Recognition     | "Identify which diagram shows..."  |
| Select       | Choice          | "Select the correct answer..."     |
| Describe     | Understanding   | "Describe what happens when..."    |
| Explain      | Application     | "Explain why this occurs..."       |
| Analyse      | Analysis        | "Analyse the data to determine..." |
| Evaluate     | Evaluation      | "Evaluate the effectiveness of..." |

### Higher-Order Thinking

Higher-order questions require:

- **In the stem**: Application, analysis, or evaluation
- **In the answers**: Multilogical thinking or high discrimination

**Example (higher-order)**:
"Based on the graph showing plant growth under different light conditions, which conclusion is best supported by the data?"

vs.

**Example (lower-order)**:
"What is the process by which plants make food?"

---

## 3. Starter Quiz Specifics

### Purpose: Prior Knowledge Assessment

The starter quiz serves as a **diagnostic pre-assessment**:

- Identifies pupils who lack prerequisites
- Reveals prior misconceptions
- Enables differentiated teaching

### Content Scope Rules

```
IF lesson teaches concept B (new content)
AND lesson requires prior knowledge A (prerequisite)
THEN:
  starterQuiz tests A only
  starterQuiz NEVER mentions B
```

**Explicit prohibition**: "Never test the pupils on the lesson's content for the STARTER QUIZ"

### Generation Instructions

```typescript
starterQuizInstructions = {
  questionCount: 6,
  contentSource: 'PRIOR KNOWLEDGE section only',
  excludes: 'Key learning points',
  ageAppropriate: true,
  difficultyProgression: true,
  passTarget: '5 out of 6 for average pupil',
};
```

---

## 4. Exit Quiz Specifics

### Purpose: Learning Assessment

The exit quiz serves as a **summative assessment** of the lesson:

- Verifies learning objectives achieved
- Tests application of new knowledge
- Identifies remaining gaps

### Content Scope Rules

```
exitQuiz tests:
  - KEY LEARNING POINTS (must cover all)
  - At least one MISCONCEPTION
  - At least one KEYWORD (in context)

exitQuiz NEVER tests:
  - PRIOR KNOWLEDGE
```

### Generation Instructions

```typescript
exitQuizInstructions = {
  questionCount: 6,
  mustCover: ['keyLearningPoints', 'misconception', 'keyword'],
  excludes: 'Prior knowledge',
  ageAppropriate: true,
  difficultyProgression: true,
  passTarget: '5 out of 6 for average pupil',
};
```

### Coverage Validation

A valid exit quiz must demonstrate:

1. Questions addressing each key learning point
2. At least one question where misconception is a distractor
3. At least one question testing keyword understanding

---

## 5. Question Count and Structure

### 6-Question Rationale

| Factor     | Consideration                          |
| ---------- | -------------------------------------- |
| Time       | ~30 seconds per question = 3 minutes   |
| Coverage   | Sufficient for key learning points     |
| Statistics | Easy pass rate calculation (5/6 = 83%) |
| Fatigue    | Short enough to maintain attention     |

### Difficulty Progression

```
Q1: Easiest (recall/recognition)
Q2: Easy
Q3: Medium
Q4: Medium
Q5: Harder (application)
Q6: Hardest (analysis/evaluation)
```

**Rationale**:

- Builds confidence early
- Identifies mastery ceiling
- Reduces anxiety from immediate hard questions

### Target Pass Rate

**5 out of 6 (83%)** for average pupil

**Implications**:

- Q1-5 should be achievable by most
- Q6 stretches but doesn't discourage
- Scores below 5 indicate need for intervention

---

## 6. Generation Pattern

### Shared Quiz Design Instructions

Both quiz agents import the same core design rules:

```typescript
import { quizQuestionDesignInstructions } from '../shared/quizQuestionDesign.instructions';

export const starterQuizInstructions = `# Task
...content scope specific to starter quiz...

## Question Design
${quizQuestionDesignInstructions}`;
```

This ensures consistency while allowing scope customisation.

### RAG Integration for Quizzes

From `examplesFromSimilarLessons.ts`:

- Similar lessons provide exemplar questions
- Helps maintain quality and consistency
- Never directly copied; used as reference

---

## Key Insights

### Insight 1: Scope is Everything

The most critical quiz design decision is **content scope**:

- Starter: Prior knowledge only
- Exit: Lesson content only
- Violation breaks the assessment's validity

### Insight 2: Distractors as Diagnostics

Well-designed distractors reveal **specific misconceptions**:

- Random wrong answers → only know pupil is wrong
- Misconception-based distractors → know what pupil believes

### Insight 3: KS4 Exam Alignment

KS4 quizzes mirror GCSE exam style:

- Command words from mark schemes
- Higher-order question stems
- Discriminating answer choices

### Insight 4: 83% Target is Strategic

5/6 pass rate:

- High enough to feel achievable
- Low enough to identify mastery gaps
- Mathematical simplicity (no decimal percentages)

---

## Extraction Recommendations

### High Priority

1. **Question design rules**: As validation checklist
2. **Scope rules**: Starter vs Exit boundaries
3. **Command words by KS**: As lookup table
4. **Distractor criteria**: As quality scoring rules

### Medium Priority

1. **Difficulty progression**: Ordering rules
2. **Coverage requirements**: Exit quiz must-cover
3. **Pass target**: Configuration constant

### As Pure Functions

```typescript
// Validate question design
function validateQuestionDesign(question: Question): ValidationResult {
  return {
    hasNegativePhrasing: detectNegativePhrasing(question.text),
    isTrueFalse: detectTrueFalse(question),
    hasClues: detectClueLeakage(question),
    misconceptionIncorporated: detectMisconceptionDistractor(question),
    // ...
  };
}

// Validate quiz scope
function validateStarterQuizScope(
  quiz: Quiz,
  priorKnowledge: string[],
  keyLearningPoints: string[],
): ScopeValidation {
  // Check questions only test prior knowledge
  // Flag any that reference lesson content
}

// Calculate difficulty progression score
function assessDifficultyProgression(questions: Question[]): number {
  // Score how well questions progress from easy to hard
}
```

### As Data Structure

```typescript
const QUIZ_DESIGN_RULES = {
  question: {
    prohibitedPatterns: [
      { pattern: /which is not|which are not/i, reason: 'negative phrasing' },
      { pattern: /true or false/i, reason: 'true/false prohibited' },
      { pattern: /all of the above|none of the above/i, reason: 'all/none prohibited' },
    ],
  },
  answers: {
    correctCount: 1,
    distractorCount: 2,
    orderRule: 'alphabetical',
  },
  distractors: {
    criteria: ['plausible', 'similarLength', 'sameCategory', 'grammaticallyConsistent'],
  },
  commandWordsByKS: {
    'key-stage-4': ['state', 'identify', 'select', 'describe', 'explain', 'analyse', 'evaluate'],
  },
  structure: {
    questionCount: 6,
    passTarget: 5,
    difficultyProgression: 'ascending',
  },
} as const;
```
