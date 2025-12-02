# Language and Voice Requirements

**Research Area**: 6 - Language and Voice
**Status**: Complete
**Last Updated**: 2025-11-30

---

## Overview

Documentation of language requirements and voice system for educational content generation in Aila.

---

## Key Files Analysed

- `packages/core/src/prompts/lesson-assistant/parts/languageAndVoice.ts`
- `packages/aila/src/lib/agentic-system/agents/sectionAgents/shared/voices/voices.ts`
- `packages/aila/src/features/americanisms/`

---

## 1. Voice System

### Voice Definitions (7 Voices)

#### AILA_TO_TEACHER

| Attribute       | Value                                                                               |
| --------------- | ----------------------------------------------------------------------------------- |
| **ID**          | `AILA_TO_TEACHER`                                                                   |
| **Speaker**     | Aila                                                                                |
| **Audience**    | User (teacher)                                                                      |
| **Description** | Supportive expert guiding the teacher. Polite and clear. Can ask for clarification. |

**Usage**: When addressing the teacher user directly, guiding lesson creation, asking questions.

#### PUPIL

| Attribute       | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | `PUPIL`                                                                                                            |
| **Speaker**     | A pupil                                                                                                            |
| **Audience**    | Other pupils/teacher                                                                                               |
| **Description** | Voice of a pupil speaking aloud. Used for "I can..." learning outcomes and model answers. Match tone to pupil age. |

**Usage**: Learning outcomes, example pupil responses, feedback sections.

#### TEACHER_TO_PUPIL_WRITTEN (Legacy: TEACHER_TO_PUPIL_SLIDES)

| Attribute       | Value                                                                        |
| --------------- | ---------------------------------------------------------------------------- |
| **ID**          | `TEACHER_TO_PUPIL_WRITTEN`                                                   |
| **Speaker**     | Teacher                                                                      |
| **Audience**    | Pupils (written)                                                             |
| **Description** | Text on slides or resources. Formal, concise, instructional. No chatty tone. |

**Usage**: Slide text, quiz questions, practice instructions, keywords.

#### TEACHER_TO_PUPIL_SPOKEN

| Attribute       | Value                                                                  |
| --------------- | ---------------------------------------------------------------------- |
| **ID**          | `TEACHER_TO_PUPIL_SPOKEN`                                              |
| **Speaker**     | Teacher                                                                |
| **Audience**    | Pupils (spoken)                                                        |
| **Description** | Lesson narratives. Professional but friendlier. May include analogies. |

**Usage**: Spoken explanations, narratives in additional materials.

#### EXPERT_TEACHER

| Attribute       | Value                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------- |
| **ID**          | `EXPERT_TEACHER`                                                                                  |
| **Speaker**     | Expert teacher                                                                                    |
| **Audience**    | User (teacher)                                                                                    |
| **Description** | Shares pedagogical expertise, common mistakes, key knowledge for the age group, teaching methods. |

**Usage**: Prior knowledge, misconceptions, explanation guidance.

#### AGENT_TO_AGENT (New)

| Attribute       | Value                                                |
| --------------- | ---------------------------------------------------- |
| **ID**          | `AGENT_TO_AGENT`                                     |
| **Speaker**     | Aila                                                 |
| **Audience**    | Other agents                                         |
| **Description** | Clear, concise, task-focused internal communication. |

**Usage**: Inter-agent coordination in multi-agent system.

#### AGENT_TO_DEVELOPER (New)

| Attribute       | Value                                                          |
| --------------- | -------------------------------------------------------------- |
| **ID**          | `AGENT_TO_DEVELOPER`                                           |
| **Speaker**     | Aila                                                           |
| **Audience**    | Developers                                                     |
| **Description** | Clear, concise, technical communication for debugging/logging. |

**Usage**: Error messages, debug output, technical logs.

---

## 2. Voice Assignment by Section

| Section                       | Primary Voice            | Secondary Voice         | Rationale                         |
| ----------------------------- | ------------------------ | ----------------------- | --------------------------------- |
| title                         | TEACHER_TO_PUPIL_WRITTEN | -                       | Formal, on slides                 |
| learningOutcome               | PUPIL                    | -                       | "I can..." from pupil perspective |
| learningCycles                | TEACHER_TO_PUPIL_WRITTEN | -                       | On slides                         |
| priorKnowledge                | EXPERT_TEACHER           | -                       | Teacher expertise                 |
| keyLearningPoints             | TEACHER_TO_PUPIL_WRITTEN | -                       | Facts for pupils                  |
| misconceptions                | EXPERT_TEACHER           | -                       | Teacher expertise                 |
| keywords                      | TEACHER_TO_PUPIL_WRITTEN | -                       | Definitions for pupils            |
| starterQuiz                   | TEACHER_TO_PUPIL_WRITTEN | -                       | Quiz on slides                    |
| exitQuiz                      | TEACHER_TO_PUPIL_WRITTEN | -                       | Quiz on slides                    |
| explanation.spokenExplanation | AILA_TO_TEACHER          | -                       | Guidance for teacher              |
| explanation.slideText         | TEACHER_TO_PUPIL_WRITTEN | -                       | Text on slides                    |
| checkForUnderstanding         | TEACHER_TO_PUPIL_WRITTEN | -                       | Questions on slides               |
| practice                      | TEACHER_TO_PUPIL_WRITTEN | -                       | Instructions for pupils           |
| feedback                      | PUPIL                    | -                       | Model from pupil view             |
| additionalMaterials           | EXPERT_TEACHER           | TEACHER_TO_PUPIL_SPOKEN | Varies by content type            |

### Voice in Schema Descriptions

Schema field descriptions reference voice:

```typescript
spokenExplanation: z.string().describe(
  'The spoken teacher explanation in the EXPERT_TEACHER voice...',
);

slideText: z.string().describe('Written in the TEACHER_TO_PUPIL_SLIDES voice...');
```

---

## 3. British English Requirements

### Spelling Rules

| American       | British        | Example Context  |
| -------------- | -------------- | ---------------- |
| color          | colour         | Art lessons      |
| center         | centre         | Maths, geography |
| organize       | organise       | All subjects     |
| realize        | realise        | All subjects     |
| behavior       | behaviour      | PSHE             |
| favor          | favour         | All subjects     |
| analyze        | analyse        | Science, maths   |
| license (verb) | licence (noun) | IT, citizenship  |

### Vocabulary Standards

| American          | British          | Context               |
| ----------------- | ---------------- | --------------------- |
| trash             | rubbish          | Environmental science |
| fall              | autumn           | Geography, seasons    |
| soccer            | football         | PE                    |
| math              | maths            | All contexts          |
| elementary school | primary school   | Education references  |
| high school       | secondary school | Education references  |
| grades            | marks            | Assessment            |
| vacation          | holiday          | Calendar references   |

### Implementation

```typescript
// From languageAndVoice.ts
`LANGUAGE
Always respond using British English spelling unless the primary language 
has been changed by the user.
For instance, if you are making an art lesson, use the word "colour" 
instead of "color".
Or "centre" instead of "center".
This is important because our primary target audience is a teacher in 
the UK and they will be using British English spelling in their lessons.`;
```

### Americanisms Feature

**Location**: `packages/aila/src/features/americanisms/`

**Purpose**: Detect and correct American English in generated content.

**Components**:

- `AilaAmericanisms.ts`: Detection and correction service
- `american-british-english-translator.d.ts`: Dictionary types
- `NullAilaAmericanisms.ts`: No-op implementation for testing

**Usage**:

```typescript
// If americanisms detected, include correction prompt part
const americanToBritishSection =
  props.responseMode === 'interactive' && props.americanisms && props.americanisms.length > 0
    ? americanToBritish
    : undefined;
```

---

## 4. Age-Appropriate Language

### Key Stage Adaptations

| Key Stage | Age   | Language Characteristics                              |
| --------- | ----- | ----------------------------------------------------- |
| KS1       | 5-7   | Simple vocabulary, short sentences, concrete concepts |
| KS2       | 7-11  | Expanding vocabulary, more complex sentences          |
| KS3       | 11-14 | Academic vocabulary, abstract concepts                |
| KS4       | 14-16 | Subject-specific terminology, exam language           |
| KS5       | 16-18 | Advanced academic language, nuanced concepts          |

### Complexity Guidelines

**KS1 Example**:

```
Learning outcome: "I can name the four seasons."
Quiz question: "Which season comes after spring?"
```

**KS4 Example**:

```
Learning outcome: "I can evaluate the effectiveness of different economic policies in addressing inflation."
Quiz question: "State two advantages of monetary policy over fiscal policy in controlling inflation."
```

### Reading Age Consideration

From quiz instructions:

```
"Consider the level of detail the pupils will have been taught about the
subject and the reading age of pupils"
```

Practical implications:

- KS1: Max ~7-year-old reading level
- KS2: Max ~11-year-old reading level
- KS3+: Can use age-appropriate academic vocabulary

---

## 5. Formality Levels

### Written Content (TEACHER_TO_PUPIL_WRITTEN)

- Formal, instructional tone
- No contractions in slide text
- No colloquialisms
- Concise, information-dense
- No conversational filler

**Good**: "Label the diagram to show the parts of a plant cell."
**Bad**: "Now, let's have a go at labelling this diagram..."

### Spoken Content (TEACHER_TO_PUPIL_SPOKEN)

- Professional but accessible
- Some contractions acceptable
- Analogies and examples welcome
- Can build rapport
- More natural flow

**Good**: "Think of the cell membrane like a security guard at a building entrance..."
**Bad**: "The cell membrane is the phospholipid bilayer that regulates..."

### Expert Communication (EXPERT_TEACHER)

- Teacher-to-teacher register
- Can use pedagogical terminology
- Shares insider knowledge
- Practical, experience-based

**Good**: "Pupils often confuse correlation with causation. Address this by..."
**Bad**: "Correlation and causation are different."

---

## Key Insights

### Insight 1: Voice Determines Audience

Voice selection automatically sets appropriate:

- Formality level
- Vocabulary complexity
- Sentence structure
- Tone and register

### Insight 2: British English is Non-Negotiable

Primary target audience is UK teachers. American English would:

- Confuse pupils
- Undermine teacher credibility
- Create inconsistency with UK curriculum

### Insight 3: Age Adaptation is Implicit

By specifying key stage, age-appropriate language is implied. The system doesn't need explicit age rules—voice + key stage context handles it.

### Insight 4: Multiple Voices in One Section

Some sections use different voices for different parts:

- Explanation: AILA_TO_TEACHER (guidance) + TEACHER_TO_PUPIL_WRITTEN (slides)
- Additional materials: Varies by content type

---

## Extraction Recommendations

### As Data Structure

```typescript
export const VOICES = {
  AILA_TO_TEACHER: {
    id: 'AILA_TO_TEACHER',
    speaker: 'Aila',
    audience: 'Teacher',
    formality: 'professional',
    canAskQuestions: true,
    characteristics: ['supportive', 'expert', 'clear', 'polite'],
  },
  PUPIL: {
    id: 'PUPIL',
    speaker: 'Pupil',
    audience: 'Class/Teacher',
    formality: 'age-appropriate',
    characteristics: ['first-person', 'age-matched'],
  },
  TEACHER_TO_PUPIL_WRITTEN: {
    id: 'TEACHER_TO_PUPIL_WRITTEN',
    speaker: 'Teacher',
    audience: 'Pupils',
    formality: 'formal',
    medium: 'written',
    characteristics: ['concise', 'instructional', 'no-chat'],
  },
  // ... etc
} as const;

export type VoiceId = keyof typeof VOICES;

export const SECTION_VOICES: Record<LessonPlanKey, VoiceId[]> = {
  learningOutcome: ['PUPIL'],
  priorKnowledge: ['EXPERT_TEACHER'],
  // ... etc
};
```

### As Validation

```typescript
function validateVoiceUsage(content: string, expectedVoice: VoiceId): ValidationResult {
  // Check for inappropriate patterns
  // e.g., TEACHER_TO_PUPIL_WRITTEN shouldn't have "let's" or questions
}
```

### Integration Points

- **Prompts**: Voice instructions in section agent prompts
- **Validation**: Post-generation voice consistency check
- **UI**: Voice indicator in lesson preview
