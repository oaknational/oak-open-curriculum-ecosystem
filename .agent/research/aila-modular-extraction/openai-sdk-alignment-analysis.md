# OpenAI Apps SDK Alignment Analysis

**Purpose**: Compare Aila extraction research findings to OpenAI Apps SDK best practices
**Date**: 2025-11-30

---

## Executive Summary

The OpenAI Apps SDK reference defines best practices for MCP tool descriptors, annotations, and results. This analysis maps our extracted domain knowledge to these patterns and identifies opportunities to enhance our MCP tools with educational domain metadata.

**Key Finding**: The extracted Aila domain knowledge can significantly enhance our MCP tools by providing:

- Rich tool descriptors with educational context
- Appropriate annotations (readOnly, destructive, openWorld hints)
- Status text leveraging voice system knowledge
- Structured output with educational validation

---

## 1. Tool Descriptor Enhancement

### SDK Best Practice

```typescript
{
  title: 'Tool Title',
  description: 'Tool description',
  inputSchema: { /* Zod/JSON Schema */ },
  _meta: {
    'openai/toolInvocation/invoking': 'Status while running...',
    'openai/toolInvocation/invoked': 'Status when complete',
  }
}
```

### Mapping Extracted Knowledge

| Extracted Domain Knowledge | SDK Field                        | Application                                     |
| -------------------------- | -------------------------------- | ----------------------------------------------- |
| **Voice System**           | `description`                    | Use AILA_TO_TEACHER voice for tool descriptions |
| **Section Names**          | `title`                          | Clear, consistent titles matching domain model  |
| **Timing Constraints**     | `_meta["oak/estimatedDuration"]` | Custom metadata for expected processing time    |
| **Section Dependencies**   | `_meta["oak/requires"]`          | Custom metadata for prerequisite sections       |

### Example: Generate Quiz Tool

**Current (Generic)**:

```typescript
{
  title: 'generateQuiz',
  description: 'Generate a quiz',
}
```

**Enhanced (With Extracted Knowledge)**:

```typescript
{
  title: 'Generate Starter Quiz',
  description: 'Generate a 6-question multiple-choice quiz assessing prior knowledge. Questions test prerequisites only—never lesson content. Target: average pupil scores 5/6.',
  inputSchema: {
    type: 'object',
    properties: {
      priorKnowledge: {
        type: 'array',
        description: 'Prior knowledge statements to assess (1-5 items)',
        minItems: 1,
        maxItems: 5,
      },
      misconceptions: {
        type: 'array',
        description: 'Common misconceptions to use as distractors',
      },
      keyStage: {
        type: 'string',
        enum: ['key-stage-1', 'key-stage-2', 'key-stage-3', 'key-stage-4', 'key-stage-5'],
        description: 'UK Key Stage for age-appropriate language',
      },
    },
    required: ['priorKnowledge', 'keyStage'],
  },
  _meta: {
    'openai/toolInvocation/invoking': 'Generating prior knowledge quiz…',
    'openai/toolInvocation/invoked': '6 questions ready for review',
    'oak/voice': 'TEACHER_TO_PUPIL_WRITTEN',
    'oak/quizScope': 'prior-knowledge',
    'oak/requires': ['priorKnowledge', 'misconceptions'],
  },
}
```

---

## 2. Annotations Alignment

### SDK Best Practice

```typescript
annotations: {
  readOnlyHint: boolean,    // Read-only operation
  destructiveHint: boolean, // May delete/overwrite data
  openWorldHint: boolean,   // Publishes externally
}
```

### Mapping to Aila Tools

| Tool Category           | readOnlyHint | destructiveHint | openWorldHint | Rationale                          |
| ----------------------- | ------------ | --------------- | ------------- | ---------------------------------- |
| **Curriculum browsing** | ✅ true      | false           | false         | Just reads Oak API                 |
| **Quiz generation**     | ✅ true      | false           | false         | Generates content, doesn't persist |
| **Lesson section edit** | false        | ✅ true         | false         | Replaces existing section          |
| **Export to Google**    | false        | false           | ✅ true       | Creates external document          |
| **Lesson validation**   | ✅ true      | false           | false         | Analysis only                      |

### Example: Section Agent Tool Annotations

```typescript
// Reading curriculum data
{
  name: 'browseUnits',
  annotations: { readOnlyHint: true },
}

// Generating lesson section (creates but doesn't overwrite)
{
  name: 'generateLearningOutcome',
  annotations: { readOnlyHint: true }, // Generates, doesn't persist
}

// Editing existing section
{
  name: 'editLearningOutcome',
  annotations: { destructiveHint: true }, // Replaces existing
}

// Exporting lesson
{
  name: 'exportToGoogleSlides',
  annotations: { openWorldHint: true }, // Creates external document
}
```

---

## 3. Tool Invocation Status Text

### SDK Best Practice

| Field                            | Limit     | Purpose              |
| -------------------------------- | --------- | -------------------- |
| `openai/toolInvocation/invoking` | ≤64 chars | Status while running |
| `openai/toolInvocation/invoked`  | ≤64 chars | Status when complete |

### Applying Voice System Knowledge

Status text should use **AILA_TO_TEACHER** voice: supportive, clear, professional.

| Tool                      | Invoking (≤64)                   | Invoked (≤64)               |
| ------------------------- | -------------------------------- | --------------------------- |
| `generateLearningOutcome` | "Writing learning outcome…"      | "Learning outcome ready"    |
| `generateLearningCycles`  | "Breaking down into cycles…"     | "2 learning cycles created" |
| `generateStarterQuiz`     | "Creating prior knowledge quiz…" | "6 questions ready"         |
| `generateExitQuiz`        | "Creating assessment quiz…"      | "6 questions ready"         |
| `generateCycle`           | "Building learning cycle 1…"     | "Cycle 1 complete"          |
| `validateLesson`          | "Checking lesson consistency…"   | "Validation complete"       |
| `moderateContent`         | "Checking content safety…"       | "Content reviewed"          |

### Educational Context in Status

Can reflect domain knowledge:

```typescript
// Good: Educational context
'openai/toolInvocation/invoking': 'Assessing prior knowledge gaps…'
'openai/toolInvocation/invoked': '5/6 pass target achieved'

// Bad: Generic
'openai/toolInvocation/invoking': 'Processing…'
'openai/toolInvocation/invoked': 'Done'
```

---

## 4. Structured Content & Output Schema

### SDK Best Practice

```typescript
return {
  structuredContent: {
    /* matches outputSchema */
  },
  content: [{ type: 'text', text: '...' }],
  _meta: {
    /* component-only data */
  },
};
```

### Applying Domain Model Knowledge

**structuredContent**: Use extracted schemas (QuizV3, CycleSchema, etc.)
**content**: Use appropriate voice for text summary
**\_meta**: Include validation results, not shown to model

### Example: Quiz Generation Result

```typescript
return {
  structuredContent: {
    version: 'v3',
    questions: [
      /* QuizV3Question[] */
    ],
    imageMetadata: [],
  },
  content: [
    {
      type: 'text',
      text: 'Created 6 multiple-choice questions testing prior knowledge. Questions progress from recall to application. Distractors include common misconceptions.',
    },
  ],
  _meta: {
    validation: {
      scopeCorrect: true, // Tests prior knowledge only
      difficultyProgression: 0.95,
      distractorQuality: 'good',
    },
    voiceUsed: 'TEACHER_TO_PUPIL_WRITTEN',
  },
};
```

---

## 5. Client-Provided Metadata Utilisation

### SDK Best Practice

```typescript
_meta['openai/locale']; // BCP 47 locale
_meta['openai/userLocation']; // Coarse location
```

### Mapping to Educational Context

| Client Meta           | Aila Application                                                                                                      |
| --------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `openai/locale`       | **Primary language selection**. Default: British English. Could trigger bilingual lesson mode for language teaching.  |
| `openai/userLocation` | **UK-specific**: Could confirm UK location for curriculum alignment. Non-UK: Could warn about curriculum differences. |

### Example: Locale-Aware Tool

```typescript
server.registerTool(
  'generateKeywords',
  {
    title: 'Generate Keywords',
    description: 'Generate Tier 2/3 vocabulary with definitions',
    inputSchema: {
      /* ... */
    },
  },
  async (args, { _meta }) => {
    const locale = _meta?.['openai/locale'] ?? 'en-GB';
    const useBritishEnglish = locale.startsWith('en-GB') || locale === 'en';

    const keywords = await generateKeywords({
      ...args,
      spellingVariant: useBritishEnglish ? 'british' : 'american',
    });

    return {
      structuredContent: { keywords },
      content: [
        {
          type: 'text',
          text: `Generated ${keywords.length} keywords in ${useBritishEnglish ? 'British' : 'American'} English.`,
        },
      ],
    };
  },
);
```

---

## 6. Gap Analysis

### What SDK Provides That We Should Use

| SDK Feature                 | Current Status | Action Required                          |
| --------------------------- | -------------- | ---------------------------------------- |
| `readOnlyHint`              | Not used       | Add to all read-only curriculum tools    |
| `destructiveHint`           | Not used       | Add to edit/replace tools                |
| `openWorldHint`             | Not used       | Add to export tools                      |
| `invoking`/`invoked` status | Not used       | Add educational status text              |
| `structuredContent`         | Partial        | Ensure all outputs use extracted schemas |
| `_meta` on results          | Not used       | Add validation metadata                  |

### What We Have That SDK Doesn't Cover

| Aila Domain Knowledge | SDK Gap     | Proposed Extension                      |
| --------------------- | ----------- | --------------------------------------- |
| Voice system          | No standard | Custom `oak/voice` metadata             |
| Section dependencies  | No standard | Custom `oak/requires` metadata          |
| Quiz scope rules      | No standard | Custom `oak/quizScope` metadata         |
| Key stage constraints | No standard | Custom `oak/keyStage` metadata          |
| Timing constraints    | No standard | Custom `oak/estimatedDuration` metadata |
| Moderation categories | No standard | Custom `oak/moderationFlags` metadata   |

### Proposed Custom Namespace: `oak/`

```typescript
_meta: {
  // Standard OpenAI fields
  'openai/toolInvocation/invoking': '...',
  'openai/toolInvocation/invoked': '...',

  // Oak-specific educational metadata
  'oak/voice': VoiceId,
  'oak/keyStage': KeyStageSlug,
  'oak/requires': LessonPlanKey[],
  'oak/quizScope': 'prior-knowledge' | 'lesson-content',
  'oak/estimatedDuration': number,  // seconds
  'oak/moderationRequired': boolean,
}
```

---

## 7. Recommendations

### Immediate Actions

1. **Add annotations to all tools**
   - `readOnlyHint: true` for browsing/generation tools
   - `destructiveHint: true` for edit tools
   - `openWorldHint: true` for export tools

2. **Add status text to all tools**
   - Use AILA_TO_TEACHER voice
   - Be educational-context-aware (e.g., "Assessing prior knowledge…")

3. **Use structuredContent consistently**
   - Output extracted schemas (QuizV3, CycleSchema)
   - Include text summary in content array

### Medium-Term Actions

4. **Define `oak/` namespace for custom metadata**
   - Document all custom fields
   - Use consistently across tools

5. **Implement locale handling**
   - Default to British English
   - Respect `openai/locale` when provided

6. **Add validation to `_meta` on results**
   - Include quality scores
   - Include scope validation results
   - Hide from model but useful for UI/debugging

### Integration with Existing Plans

| Plan                          | SDK Alignment Action                                  |
| ----------------------------- | ----------------------------------------------------- |
| Plan 01 (Tool Metadata)       | Add annotations, status text, custom `oak/` namespace |
| Plan 02 (Curriculum Ontology) | Use `structuredContent` with ontology schemas         |
| Plan 03 (Infrastructure)      | Implement `oak/requires` dependency checking          |
| Plan 04 (Prompts)             | Use voice metadata in prompt generation               |

---

## Appendix: Complete Tool Template

```typescript
server.registerTool(
  'generateStarterQuiz',
  {
    title: 'Generate Starter Quiz',
    description:
      'Generate a 6-question multiple-choice quiz assessing prior knowledge. Tests prerequisites only—never lesson content. Target: average pupil scores 5/6. Uses British English spelling.',
    inputSchema: {
      type: 'object',
      properties: {
        priorKnowledge: {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
          maxItems: 5,
          description: 'Prior knowledge statements to assess',
        },
        misconceptions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              misconception: { type: 'string' },
              description: { type: 'string' },
            },
          },
          description: 'Common misconceptions for distractor design',
        },
        keyStage: {
          type: 'string',
          enum: ['key-stage-1', 'key-stage-2', 'key-stage-3', 'key-stage-4', 'key-stage-5'],
          description: 'UK Key Stage for age-appropriate language',
        },
      },
      required: ['priorKnowledge', 'keyStage'],
    },
    outputSchema: {
      type: 'object',
      properties: {
        version: { const: 'v3' },
        questions: { type: 'array' },
        imageMetadata: { type: 'array' },
      },
    },
    annotations: {
      readOnlyHint: true, // Generates content, doesn't persist
    },
    _meta: {
      'openai/toolInvocation/invoking': 'Creating prior knowledge quiz…',
      'openai/toolInvocation/invoked': '6 questions ready',
      'oak/voice': 'TEACHER_TO_PUPIL_WRITTEN',
      'oak/quizScope': 'prior-knowledge',
      'oak/requires': ['priorKnowledge'],
      'oak/estimatedDuration': 15,
    },
  },
  async (args, { _meta }) => {
    const locale = _meta?.['openai/locale'] ?? 'en-GB';

    const quiz = await generateQuiz({
      ...args,
      scope: 'prior-knowledge',
      spellingVariant: 'british',
    });

    const validation = validateQuiz(quiz, 'starter');

    return {
      structuredContent: quiz,
      content: [
        {
          type: 'text',
          text: `Created 6 questions testing prior knowledge. Difficulty progresses from Q1 (easiest) to Q6 (hardest). Distractors incorporate ${args.misconceptions?.length ?? 0} common misconceptions.`,
        },
      ],
      _meta: {
        validation: {
          scopeCorrect: validation.scopeCorrect,
          difficultyProgression: validation.progressionScore,
          distractorQuality: validation.distractorScore,
        },
      },
    };
  },
);
```
