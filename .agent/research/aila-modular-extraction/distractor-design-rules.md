# Distractor Design Rules

**Research Area**: 3 - Quiz Generation
**Status**: Complete
**Last Updated**: 2025-11-30

---

## Overview

Documentation of distractor design principles extracted as rules that could be implemented as pure validation functions.

---

## Key Files Analysed

- `packages/aila/src/lib/agents/prompts/shared/quizQuestionDesignInstructions.ts`
- `packages/aila/src/lib/agentic-system/agents/sectionAgents/shared/quizQuestionDesign.instructions.ts`
- `packages/core/src/prompts/lesson-assistant/parts/body.ts`

---

## 1. Core Distractor Principles

### Principle 1: Plausibility

**Definition**: Distractors must be subtly different from the correct answer, making it difficult for uninformed pupils to guess.

**Rationale**: If distractors are obviously wrong, the question becomes too easy and fails to discriminate between understanding and guessing.

**Rule**:

```typescript
function isDistractorPlausible(
  distractor: string,
  correctAnswer: string,
  questionContext: string,
): boolean {
  // Distractor should:
  // - Address the same concept as the question
  // - Be factually incorrect but logically related
  // - Require knowledge to reject
  return true; // Implementation would need semantic analysis
}
```

### Principle 2: Length Matching

**Definition**: Distractors should be similar in length to the correct answer.

**Rationale**: Longer or shorter answers stand out visually, allowing test-wise pupils to identify the correct answer without content knowledge.

**Rule**:

```typescript
function isLengthMatched(
  correctAnswer: string,
  distractor: string,
  tolerancePercent: number = 30,
): boolean {
  const correctLength = correctAnswer.length;
  const distractorLength = distractor.length;
  const difference = Math.abs(correctLength - distractorLength);
  const threshold = correctLength * (tolerancePercent / 100);
  return difference <= threshold;
}
```

**Example**:

```
Correct: "a table that shows all known elements" (37 chars)
Good: "a table that lists all chemical compounds" (41 chars) ✓
Bad: "a table that lists periods" (26 chars) ✗
Bad: "a table that shows every known element that has been discovered" (64 chars) ✗
```

### Principle 3: Category Consistency

**Definition**: All answer options should fall into the same semantic category.

**Rationale**: Category mismatch allows elimination without content knowledge.

**Rule**:

```typescript
function isSameCategory(items: string[], questionContext: string): boolean {
  // All items should be:
  // - Same type of entity (all organelles, all dates, all processes)
  // - Appropriate to the question being asked
  return true; // Implementation would need classification
}
```

**Example**:
Question: "Identify the sub-cellular organelle responsible for photosynthesis"

```
Good options (all organelles):
- Chloroplast ✓ (correct)
- Mitochondria ✓ (distractor)
- Nucleus ✓ (distractor)

Bad options (mixed categories):
- Chloroplast (organelle)
- Photosynthesis (process) ✗
- Plant cell (cell type) ✗
```

### Principle 4: Grammatical Matching

**Definition**: Distractors should have the same grammatical structure as the correct answer.

**Rationale**: Grammatical inconsistency signals the incorrect answer.

**Rule**:

```typescript
function isGrammaticallyConsistent(correctAnswer: string, distractor: string): boolean {
  // Check:
  // - Same sentence structure
  // - Same article usage (a/an)
  // - Same tense
  // - Same voice (active/passive)
  return true; // Implementation would need parsing
}
```

**Example**:

```
Correct: "a table that shows all known elements"
Good: "a table that lists all chemical compounds" ✓ (same structure)
Bad: "showing all elements" ✗ (different structure)
Bad: "the table listing compounds" ✗ (different article/tense)
```

---

## 2. Anti-Patterns to Avoid

### Anti-Pattern 1: "All/None of the Above"

**Prohibition**: Never include "all of the above" or "none of the above" as options.

**Rationale**:

- Creates unequal probability (picking "all" = picking multiple answers)
- Often used as lazy placeholder when can't think of third distractor
- Reduces diagnostic value

### Anti-Pattern 2: Word Repetition from Question

**Prohibition**: Answers should not repeat distinctive words from the question stem.

**Rationale**: Repetition signals the correct answer through pattern matching rather than understanding.

**Example**:

```
Question: "What is the periodic table?"
Bad answer: "A table showing periodic elements" ✗ (repeats "periodic")
Good answer: "A table that shows all known elements" ✓
```

### Anti-Pattern 3: Obvious Length Differences

**Prohibition**: No answer should be dramatically longer or shorter than others.

**Rationale**: Test-wise pupils notice that correct answers are often more detailed/longer, or conversely that very short answers are often wrong.

### Anti-Pattern 4: Category Mismatch

**Prohibition**: All options must be from the same semantic category.

**Rationale**: "One of these things is not like the others" is trivially solvable without content knowledge.

**Example (Bad)**:

```
Question: "What is the periodic table?"
Options:
- a table that lists periods ✗ (furniture sense of "table")
- an old wooden table ✗ (literal table)
- a table that shows all known elements ✓
```

---

## 3. Example Analysis

### Good Example (from Aila)

**Question**: What is the periodic table?
**Options**:

- a table that lists all chemical compounds
- a table that shows all chemical reactions
- a table that shows all known elements ✓

**Analysis**:
| Criterion | Assessment |
|-----------|------------|
| Plausibility | ✓ All relate to chemistry concepts |
| Length | ✓ 41, 42, 37 characters (within 30%) |
| Category | ✓ All describe types of chemistry tables |
| Grammar | ✓ All use "a table that [verb]s all [noun]" |
| No all/none | ✓ |
| No word repetition | ✓ |

### Bad Example (from Aila)

**Question**: What is the periodic table?
**Options**:

- a table that lists periods
- an old wooden table
- a table that shows every known element that has been discovered ✓

**Analysis**:
| Criterion | Assessment |
|-----------|------------|
| Plausibility | ✗ "old wooden table" is absurd |
| Length | ✗ 26, 20, 64 characters (huge variance) |
| Category | ✗ Mixed: calendar concept, furniture, chemistry |
| Grammar | ✗ Correct answer much longer/complex |

**Why it fails**: "A pupil can easily guess the correct answer by eliminating the obviously wrong options and noticing the length difference."

---

## 4. Rules as Functions

### Rule: Plausibility Check

```typescript
interface PlausibilityResult {
  isPlausible: boolean;
  confidence: number;
  issues: string[];
}

function assessPlausibility(
  question: string,
  correctAnswer: string,
  distractor: string,
): PlausibilityResult {
  const issues: string[] = [];

  // Check for absurd/unrelated content
  // Check for semantic relevance to question
  // Check for factual incorrectness

  return {
    isPlausible: issues.length === 0,
    confidence: 1 - issues.length * 0.2,
    issues,
  };
}
```

### Rule: Length Matching

```typescript
interface LengthMatchResult {
  isMatched: boolean;
  correctLength: number;
  distractorLength: number;
  percentDifference: number;
}

function assessLengthMatch(
  correctAnswer: string,
  distractor: string,
  tolerance: number = 0.3,
): LengthMatchResult {
  const correctLength = correctAnswer.trim().length;
  const distractorLength = distractor.trim().length;
  const percentDifference = Math.abs(correctLength - distractorLength) / correctLength;

  return {
    isMatched: percentDifference <= tolerance,
    correctLength,
    distractorLength,
    percentDifference,
  };
}
```

### Rule: Category Consistency

```typescript
interface CategoryResult {
  allSameCategory: boolean;
  detectedCategories: Map<string, string[]>;
  outliers: string[];
}

function assessCategoryConsistency(options: string[], questionContext: string): CategoryResult {
  // Would require NLP/classification
  // For now, flag for human review
  return {
    allSameCategory: true,
    detectedCategories: new Map(),
    outliers: [],
  };
}
```

### Rule: Comprehensive Distractor Validation

```typescript
interface DistractorValidation {
  overall: 'pass' | 'warn' | 'fail';
  plausibility: PlausibilityResult;
  lengthMatch: LengthMatchResult;
  categoryConsistency: CategoryResult;
  antiPatterns: {
    hasAllNone: boolean;
    hasWordRepetition: boolean;
    hasCategoryMismatch: boolean;
  };
}

function validateDistractor(
  question: string,
  correctAnswer: string,
  distractor: string,
  otherOptions: string[],
): DistractorValidation {
  const plausibility = assessPlausibility(question, correctAnswer, distractor);
  const lengthMatch = assessLengthMatch(correctAnswer, distractor);
  const categoryConsistency = assessCategoryConsistency(
    [correctAnswer, distractor, ...otherOptions],
    question,
  );

  const antiPatterns = {
    hasAllNone: /all of the above|none of the above/i.test(distractor),
    hasWordRepetition: detectWordRepetition(question, distractor),
    hasCategoryMismatch: !categoryConsistency.allSameCategory,
  };

  const issues = [
    !plausibility.isPlausible,
    !lengthMatch.isMatched,
    Object.values(antiPatterns).some((v) => v),
  ].filter(Boolean).length;

  return {
    overall: issues === 0 ? 'pass' : issues === 1 ? 'warn' : 'fail',
    plausibility,
    lengthMatch,
    categoryConsistency,
    antiPatterns,
  };
}
```

---

## 5. Validation Criteria

### Minimum Requirements

For a distractor set to pass:

1. All distractors must be plausible
2. All lengths within 30% of correct answer
3. All options in same semantic category
4. No anti-patterns present

### Quality Scoring

```typescript
type DistractorQuality = 'excellent' | 'good' | 'acceptable' | 'poor';

function scoreDistractorQuality(validations: DistractorValidation[]): DistractorQuality {
  const passCount = validations.filter((v) => v.overall === 'pass').length;
  const total = validations.length;

  if (passCount === total) return 'excellent';
  if (passCount >= total * 0.8) return 'good';
  if (passCount >= total * 0.6) return 'acceptable';
  return 'poor';
}
```

---

## Key Insights

### Insight 1: Distractors Define Question Quality

A question with poor distractors is a poor question, regardless of how good the stem is. Distractor quality determines discrimination power.

### Insight 2: Test-Wiseness is the Enemy

Good distractors defeat "test-wise" strategies:

- Eliminate by length
- Eliminate by category
- Pick the most detailed answer

### Insight 3: Misconceptions Make Best Distractors

Distractors based on common misconceptions:

- Are inherently plausible
- Provide diagnostic value
- Help identify specific misunderstandings

### Insight 4: Rules Can Be Automated

Most rules are automatable:

- Length matching: String comparison
- Anti-patterns: Regex detection
- Category consistency: NLP classification (harder)

---

## Extraction Recommendations

### As Validation Functions

```typescript
// Export as validation utilities
export const distractorValidation = {
  assessLengthMatch,
  detectAntiPatterns,
  validateDistractor,
  scoreDistractorQuality,
};
```

### As Configuration

```typescript
export const DISTRACTOR_RULES = {
  lengthTolerance: 0.3,
  minDistractorCount: 2,
  antiPatterns: [/all of the above/i, /none of the above/i, /true or false/i],
  qualityThresholds: {
    excellent: 1.0,
    good: 0.8,
    acceptable: 0.6,
    poor: 0,
  },
} as const;
```

### Integration Points

- **Generation**: Use rules to constrain LLM output
- **Validation**: Score generated distractors
- **Feedback**: Explain why distractors fail quality checks
