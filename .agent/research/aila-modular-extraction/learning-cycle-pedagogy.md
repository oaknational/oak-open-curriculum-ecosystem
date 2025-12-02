# Learning Cycle Pedagogy

**Research Area**: 2 - Educational Domain Model
**Status**: Complete
**Last Updated**: 2025-11-30

---

## Overview

The learning cycle is Oak's pedagogical model for structuring the main body of a lesson. This document captures the educational theory and practical implementation embedded in the Aila system.

---

## Key Files Analysed

- `packages/aila/src/protocol/schema.ts` (CycleSchema)
- `packages/aila/src/lib/agentic-system/agents/sectionAgents/cycleAgent/cycle.instructions.ts`
- `packages/core/src/prompts/lesson-assistant/parts/body.ts`

---

## 1. Learning Cycle Structure

### Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                    LEARNING CYCLE                           │
├─────────────────────────────────────────────────────────────┤
│  1. TITLE                                                   │
│     Short, succinct version of learning cycle outcome       │
├─────────────────────────────────────────────────────────────┤
│  2. EXPLANATION                                             │
│     ├── Spoken Explanation (teacher guidance)               │
│     ├── Accompanying Slide Details (visual description)     │
│     ├── Image Search Suggestion (search term)               │
│     └── Slide Text (pupil-facing summary)                   │
├─────────────────────────────────────────────────────────────┤
│  3. CHECK FOR UNDERSTANDING                                 │
│     └── 2+ Multiple-choice questions                        │
├─────────────────────────────────────────────────────────────┤
│  4. PRACTICE                                                │
│     └── Pupil-facing task instructions                      │
├─────────────────────────────────────────────────────────────┤
│  5. FEEDBACK                                                │
│     └── Model answer / Worked example / Success criteria    │
└─────────────────────────────────────────────────────────────┘
```

### Component Details

#### Title

- **Purpose**: Identifies the cycle's focus
- **Format**: Max 50 characters, sentence case
- **Example**: "Animal adaptations in extreme environments"

#### Explanation (Teacher-facing)

**Spoken Explanation**:

- **Voice**: AILA_TO_TEACHER
- **Format**: 1-5 bullet points, each ideally one sentence
- **Content**:
  - Key concepts to explain
  - Models, analogies, examples, non-examples
  - Prior knowledge links
  - Common misconceptions to address
  - Procedures to model with steps
  - Equipment or artefacts to use

**Cognitive Load Principles**:

- Start concrete → move to abstract
- Break into small steps
- One concept per point
- No extraneous detail
- Maximise intrinsic load, minimise extraneous load

**Accompanying Slide Details**:

- **Purpose**: Describe what should be visible on slides
- **Example**: "A simple diagram showing two hydrogen atoms sharing electrons to form a covalent bond"

**Image Search Suggestion**:

- **Purpose**: Search term for teacher to find appropriate image
- **Example**: "Hydrogen molecule covalent bond diagram"

**Slide Text**:

- **Voice**: TEACHER_TO_PUPIL_WRITTEN
- **Purpose**: Summary visible to pupils during explanation
- **Example**: "Hydrogen atoms are bonded together with a covalent bond"
- **Non-example**: "Now we will look at how hydrogen atoms bond" (teacher narrative, not content)

#### Check for Understanding

- **Purpose**: Verify comprehension before practice
- **Format**: 2+ multiple-choice questions
- **Rules**:
  - Test key learning points from explanation
  - Test for misconceptions
  - No duplication with starter/exit quizzes
  - Standard quiz design rules apply

#### Practice

- **Voice**: TEACHER_TO_PUPIL_WRITTEN
- **Duration**: 5-7 minutes
- **Requirements**:
  - Complete instructions (include all content needed)
  - Reflect command word from cycle outcome
  - Activate all pupils (speaking, writing, doing)
  - Difficulty progression if multiple sub-tasks
  - Vary task types across cycles

#### Feedback

- **Voice**: PUPIL
- **Must be pupil-facing** (displayed on slides)
- **Formats** (indicate which at start):
  1. **Model Answer**: Example of good response
  2. **Worked Example**: Step-by-step calculation
  3. **Success Criteria**: Features of a good answer

---

## 2. Pedagogical Foundation

### Why This Structure?

The Explain-Check-Practice-Feedback model embodies established educational research:

1. **Direct Instruction**: Clear explanation before independent work
2. **Formative Assessment**: Check understanding before practice catches misconceptions early
3. **Deliberate Practice**: Focused practice on specific learning points
4. **Immediate Feedback**: Self-correction while content is fresh

### Cognitive Load Theory Application

| Principle             | Implementation                             |
| --------------------- | ------------------------------------------ |
| Worked examples       | Feedback as worked examples                |
| Split attention       | Spoken + visual elements combined          |
| Redundancy            | Slide text summarises, doesn't repeat      |
| Element interactivity | One concept per explanation point          |
| Goal-free             | Practice tasks have clear success criteria |

### The I Do → We Do → You Do Pattern

1. **I Do**: Explanation (teacher demonstrates)
2. **We Do**: Check for Understanding (whole class responds)
3. **You Do**: Practice (independent work)
4. **Check**: Feedback (self-assessment)

---

## 3. Number of Cycles

### 1-3 Cycle Rationale

| Cycles | Use Case                          | Total Cycle Time    |
| ------ | --------------------------------- | ------------------- |
| 1      | Simple, focused lesson            | 45 min              |
| 2      | Standard lesson                   | 2 × 20 min = 40 min |
| 3      | Complex topic needing scaffolding | 3 × 15 min = 45 min |

### Cycle Relationship to Learning Outcomes

Each cycle maps 1:1 to a learning cycle outcome:

```
Learning Cycle Outcomes (from Foundation section):
1. "Identify the key features of plant cells"     → cycle1
2. "Compare plant and animal cells"              → cycle2
3. "Explain why plant cells need chloroplasts"   → cycle3
```

### cycle3 is Optional

Third cycle only needed when:

- Topic requires three distinct sub-concepts
- Difficulty progression needs three stages
- Content cannot fit in two 20-minute cycles

---

## 4. Timing Constraints

### By Key Stage

| Key Stage | Lesson Duration | Cycle Duration | Quiz Time    |
| --------- | --------------- | -------------- | ------------ |
| KS1       | 40 min          | 8-12 min each  | ~5 min total |
| KS2-5     | 50 min          | 10-20 min each | ~5 min total |

### Within a Cycle (KS2-5, ~15 min typical)

| Component               | Time    |
| ----------------------- | ------- |
| Explanation             | 3-5 min |
| Check for Understanding | 2-3 min |
| Practice                | 5-7 min |
| Feedback                | 2-3 min |

### Realism Check

Instructions emphasise realistic expectations:

- "Creating a newspaper article and presenting to class is not possible in fifteen minutes!"
- Practice should be achievable in allocated time
- Base suggestions on observed Oak lessons

---

## 5. Practice Task Types

### Comprehensive Catalogue (50+ types)

Organised by cognitive demand:

**Knowledge/Recall**:

- Label diagrams with provided labels
- Match terms to definitions
- Fill in sentence gaps
- List items/steps
- Sequence/order items

**Comprehension**:

- Sort into categories (table, Venn diagram, quadrants)
- Explain incorrect classifications
- Complete definitions
- Describe processes/events

**Application**:

- Apply skill to task
- Complete calculations
- Draw and annotate diagrams
- Create instructions for problem-solving

**Analysis**:

- Analyse examples for techniques used
- Extract data and write conclusions
- Identify mistakes in methods
- Compare/contrast items

**Evaluation**:

- Decide between options with justification
- Comment on validity/reliability
- Reflect on work against criteria
- Identify strengths and improvements

**Synthesis**:

- Create routines/performances/art
- Plan debates
- Write speeches to explain concepts
- Design flow charts

### Subject-Specific Variations

| Subject      | Typical Practice                     |
| ------------ | ------------------------------------ |
| Maths        | Calculations (scaffolded difficulty) |
| Science      | Analysis, practical procedures       |
| PE/Art/Music | Skill practice, performance          |
| English      | Writing, analysis of texts           |
| Languages    | Speaking, translation tasks          |

---

## Key Insights

### Insight 1: Dual Coding in Explanation

The split between:

- Spoken explanation (auditory)
- Slide text + image (visual)

implements dual coding theory for better retention.

### Insight 2: Practice as Assessment Proxy

"If a pupil completes the PRACTICE TASK successfully, they should have achieved the LEARNING CYCLE OUTCOME"

Practice tasks are designed as valid assessments, not just activities.

### Insight 3: Voice Shifts Signal Audience

Within one cycle, voice shifts indicate purpose:

- AILA_TO_TEACHER (explanation guidance) → for teacher prep
- TEACHER_TO_PUPIL_WRITTEN (slide text, practice) → for pupils
- PUPIL (feedback) → from pupil perspective

### Insight 4: Feedback Format Matters

Different practice types need different feedback:

- **Calculations** → Worked example
- **Skills** → Success criteria
- **Explanations** → Model answer

---

## Extraction Recommendations

### High Priority

1. **Cycle structure definition**: As typed schema with voice annotations
2. **Timing constraints**: By key stage and component
3. **Practice task types**: Categorised catalogue

### Medium Priority

1. **Cognitive load principles**: Design checklist
2. **Voice-to-component mapping**: Clear assignment table
3. **Feedback format selection**: Rules for choosing format

### As Data Structures

```typescript
const CYCLE_STRUCTURE = {
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
  practice: {
    voice: 'TEACHER_TO_PUPIL_WRITTEN',
    durationMinutes: { ks1: [3, 5], default: [5, 7] },
  },
  feedback: {
    voice: 'PUPIL',
    formats: ['modelAnswer', 'workedExample', 'successCriteria'],
  },
} as const;

const TIMING_BY_KEY_STAGE = {
  'key-stage-1': { lesson: 40, cycle: [8, 12], quiz: 5 },
  'key-stage-2': { lesson: 50, cycle: [10, 20], quiz: 5 },
  // ... etc
} as const;
```
