# File Inventory for Aila Domain Extraction Research

**Created**: 2025-11-30
**Status**: Complete

---

## Overview

This document catalogues all files relevant to the 7 research areas. Total estimated files for deep analysis: ~200 files across 7 areas.

---

## Research Area 1: Prompt Architecture and Composition

### Primary Directory: `packages/core/src/prompts/`

```
packages/core/src/prompts/
├── index.ts                           # Main export
├── types.ts                           # OakPromptDefinition, OakPromptVariant
├── lesson-assistant/
│   ├── index.ts                       # Main composition
│   ├── legacyMarkdownResponse.ts      # Legacy format handling
│   ├── variants.ts                    # Variant generation
│   └── parts/                         # 17 prompt parts
│       ├── index.ts
│       ├── americanToBritish.ts       # British English encoding
│       ├── basedOn.ts                 # Reference lesson pattern
│       ├── body.ts                    # Core lesson structure
│       ├── context.ts                 # Context injection
│       ├── currentLessonPlan.ts       # Current state
│       ├── endingTheInteraction.ts    # Conversation ending
│       ├── generateResponse.ts        # Response generation
│       ├── interactingWithTheUser.ts  # User interaction
│       ├── languageAndVoice.ts        # Voice system (5 voices)
│       ├── lessonComplete.ts          # Completion logic
│       ├── promptingTheUser.ts        # User prompts
│       ├── protocol.ts                # Output protocol
│       ├── rag.ts                     # RAG integration
│       ├── schema.ts                  # Output schema
│       ├── signOff.ts                 # Sign-off handling
│       └── task.ts                    # Task definition
├── lesson-planner/
│   ├── index.ts
│   ├── generate-lesson-plan/          # 8 files
│   │   ├── index.ts
│   │   ├── input.schema.ts
│   │   ├── output.schema.ts
│   │   └── variants/main/
│   │       ├── index.ts
│   │       └── parts/
│   │           ├── body.ts
│   │           ├── context.ts
│   │           ├── output.ts
│   │           └── task.ts
│   ├── extend-lesson-plan-quiz/       # 8 files (same structure)
│   └── regenerate-lesson-plan/        # 8 files (same structure)
└── shared/
    ├── error-handling/index.ts
    └── prompt-injection/index.ts
```

**File Count**: 49 files

### Secondary Directory: `packages/aila/src/lib/agents/prompts/`

```
packages/aila/src/lib/agents/prompts/
├── index.ts
├── additionalMaterialsInstructions.ts
├── exitQuizInstructions.ts
├── keyLearningPointsInstructions.ts
├── keywordsInstructions.ts
├── learningCyclesInstructions.ts
├── learningCycleTitlesInstructions.ts
├── learningOutcomeInstructions.ts
├── messageToUserInstructions.ts
├── misconceptionsInstructions.ts
├── priorKnowledgeInstructions.ts
├── routerInstructions.ts
├── starterQuizInstructions.ts
├── subjectInstructions.ts
└── shared/
    ├── examplesFromSimilarLessons.ts
    ├── examplesFromSimilarLessons.test.ts
    ├── identity.ts
    ├── quizQuestionDesignInstructions.ts
    └── tier2And3VocabularyDefinitions.ts
```

**File Count**: 19 files

### Agentic System Prompts: `packages/aila/src/lib/agentic-system/agents/`

```
packages/aila/src/lib/agentic-system/agents/
├── executeGenericPromptAgent.ts
├── sectionToGenericPromptAgent.ts
├── sectionToGenericPromptAgent.test.ts
├── plannerAgent/
│   ├── createPlannerAgent.ts
│   ├── createPlannerAgent.test.ts
│   ├── index.ts
│   ├── plannerAgent.instructions.ts    # KEY: Decision rules
│   └── plannerAgent.schema.ts
├── messageToUserAgent/
│   ├── createMessageToUserAgent.ts
│   ├── createMessageToUserAgent.test.ts
│   ├── index.ts
│   ├── messageToUserAgent.instructions.ts
│   └── messageToUserAgent.schema.ts
├── sectionAgents/                      # 14 section agent directories
│   ├── createSectionAgent.ts
│   ├── sectionAgentRegistry.ts
│   ├── sectionStepToAgentId.ts
│   ├── getRevelantRAGValues.ts
│   ├── shared/
│   │   ├── examplesFromSimilarLessons.ts
│   │   ├── identityAndVoice.ts
│   │   ├── quizQuestionDesign.instructions.ts
│   │   ├── sectionAgentIdentity.ts
│   │   ├── tier2And3VocabularyDefinitions.ts
│   │   └── voices/
│   │       ├── index.ts
│   │       └── voices.ts              # KEY: Voice definitions
│   ├── additionalMaterialsAgent/
│   ├── basedOnAgent/
│   ├── cycleAgent/
│   ├── exitQuizAgent/
│   ├── keyLearningPointsAgent/
│   ├── keyStageAgent/
│   ├── keywordsAgent/
│   ├── learningCycleOutcomesAgent/
│   ├── learningOutcomeAgent/
│   ├── misconceptionsAgent/
│   ├── priorKnowledgeAgent/
│   ├── starterQuizAgent/
│   ├── subjectAgent/
│   └── titleAgent/
└── sharedPromptParts/                  # 13 shared parts
    ├── _createPromptPart.ts
    ├── basedOnContent.part.ts
    ├── changesMade.part.ts
    ├── currentDocument.part.ts
    ├── currentSectionValue.part.ts
    ├── errors.part.ts
    ├── exemplarContent.part.ts
    ├── messageHistory.part.ts
    ├── plannerAgentResponse.part.ts
    ├── relevantLessons.part.ts
    ├── stepsExecuted.part.ts
    ├── unplannedSections.part.ts
    └── userMessage.part.ts
```

**File Count**: ~65 files

**Total Area 1**: ~133 files

---

## Research Area 2: Educational Domain Model

### Primary Directory: `packages/aila/src/protocol/`

```
packages/aila/src/protocol/
├── schema.ts                          # KEY: CompletedLessonPlanSchema
├── schemaDescriptions.ts              # Field descriptions
├── schemaHelpers.ts                   # Validation helpers
├── jsonPatchProtocol.ts               # JSON patch handling
├── jsonPatchProtocol.test.ts
├── jsonPatchProtocol.immutability.test.ts
├── parseMessageRow.test.ts
├── sectionToMarkdown.ts               # Markdown conversion
├── sectionToMarkdown.test.ts
└── schemas/
    ├── index.ts
    ├── quiz/
    │   ├── index.ts
    │   ├── quizV1.ts                  # Quiz V1 schema
    │   ├── quizV2.ts                  # Quiz V2 schema
    │   ├── quizV3.ts                  # Quiz V3 schema (current)
    │   ├── rawQuiz.ts                 # Ingestion schema
    │   ├── conversion/
    │   │   ├── quizV1ToV2.ts
    │   │   ├── quizV2ToV3.ts
    │   │   ├── rawQuizIngest.ts
    │   │   └── cloudinaryImageHelper.ts
    │   └── fixtures/
    │       └── rawQuizFixture.ts
    └── versioning/
        ├── migrateChatData.ts
        ├── migrateLessonPlan.ts
        └── fixtures/
            └── migrationTestData.ts
```

**File Count**: 25 files

### Database Schemas: `packages/db/schemas/`

```
packages/db/schemas/
├── index.ts
├── caption.ts
├── download.ts
├── lesson.ts                          # KEY: Lesson model
├── lesson-with-snippets.ts
├── programme.ts                       # Programme structure
├── question.ts                        # Question model
├── quiz.ts                            # Quiz model
├── unit.ts                            # Unit structure
└── video.ts
```

**File Count**: 10 files

### Section Groups: `packages/aila/src/lib/agents/`

```
packages/aila/src/lib/agents/
└── lessonPlanSectionGroups.ts         # KEY: Section ordering
```

**File Count**: 1 file

**Total Area 2**: 36 files

---

## Research Area 3: Quiz Generation Expertise

### Quiz Instructions: `packages/aila/src/lib/agents/prompts/shared/`

```
packages/aila/src/lib/agents/prompts/shared/
├── quizQuestionDesignInstructions.ts  # KEY: Question design rules
├── examplesFromSimilarLessons.ts      # RAG for quizzes
└── tier2And3VocabularyDefinitions.ts  # Vocabulary tiers
```

### Quiz Agents: `packages/aila/src/lib/agentic-system/agents/sectionAgents/`

```
sectionAgents/
├── starterQuizAgent/
│   ├── index.ts
│   ├── starterQuiz.instructions.ts    # KEY: Prior knowledge quiz
│   └── starterQuiz.schema.ts
├── exitQuizAgent/
│   ├── index.ts
│   ├── exitQuiz.instructions.ts       # KEY: Exit quiz
│   └── exitQuiz.schema.ts
└── shared/
    └── quizQuestionDesign.instructions.ts
```

### Quiz Schemas (from Area 2)

```
packages/aila/src/protocol/schemas/quiz/
├── quizV1.ts
├── quizV2.ts
├── quizV3.ts                          # KEY: Current schema
└── rawQuiz.ts
```

**Total Area 3**: ~15 files (some overlap with Area 2)

---

## Research Area 4: Content Moderation and Safety

### Moderation: `packages/teaching-materials/src/moderation/`

```
packages/teaching-materials/src/moderation/
├── moderationPrompt.ts                # KEY: Category definitions (6 groups)
└── generateTeachingMaterialModeration.ts
```

### Threat Detection: `packages/core/src/threatDetection/`

```
packages/core/src/threatDetection/
└── lakera/
    ├── index.ts
    ├── LakeraClient.ts                # KEY: Lakera integration
    ├── schema.ts
    └── __tests__/
        └── LakeraClient.test.ts
```

### Aila Threat Detection: `packages/aila/src/features/threatDetection/`

```
packages/aila/src/features/threatDetection/
├── AilaThreatDetection.ts
├── index.ts
├── types.ts
├── basic/
│   └── BasicThreatDetector.ts
└── detectors/
    ├── AilaThreatDetector.ts
    ├── MockThreatDetector.ts
    ├── basic/
    │   └── BasicThreatDetector.ts
    ├── helicone/
    │   └── HeliconeThreatDetector.ts
    └── lakera/
        ├── LakeraThreatDetector.ts
        └── test-lakera.ts
```

### Aila Moderation: `packages/aila/src/features/moderation/`

```
packages/aila/src/features/moderation/
├── AilaModeration.ts
├── getSessionModerations.ts
├── index.ts
├── index.test.ts
└── moderators/
    ├── index.ts
    ├── MockModerator.ts
    └── OpenAiModerator.ts
```

**Total Area 4**: ~20 files

---

## Research Area 5: Lesson Planning Workflow

### Agentic System: `packages/aila/src/lib/agentic-system/`

```
packages/aila/src/lib/agentic-system/
├── ailaTurn.ts                        # KEY: Turn orchestration
├── ailaTurn.e2e.test.ts
├── constants.ts
├── schema.ts
├── types.ts
├── execution/
│   ├── executePlanningPhase.ts        # KEY: Planning execution
│   ├── executePlanSteps.ts            # KEY: Step execution
│   ├── handleRelevantLessons.ts
│   └── termination.ts
├── compatibility/
│   ├── ailaTurnCallbacks.ts
│   ├── ailaTurnCallbacks.test.ts
│   ├── onPlannerComplete.ts
│   ├── onSectionComplete.ts
│   ├── onTurnComplete.ts
│   └── helpers/
│       ├── buildPatches.ts
│       └── createTextStreamer.ts
└── utils/
    ├── fixedResponses.ts
    └── stringListToText.ts
```

### Planner Agent (from Area 1)

```
agents/plannerAgent/
├── plannerAgent.instructions.ts       # KEY: Decision rules
└── plannerAgent.schema.ts             # KEY: Plan/Exit schema
```

**Total Area 5**: ~18 files

---

## Research Area 6: Language and Voice

### Voice Definitions

```
packages/core/src/prompts/lesson-assistant/parts/
├── languageAndVoice.ts                # KEY: 5 voice definitions
└── americanToBritish.ts               # British English

packages/aila/src/lib/agentic-system/agents/sectionAgents/shared/
├── identityAndVoice.ts
├── sectionAgentIdentity.ts
└── voices/
    ├── index.ts
    └── voices.ts                      # KEY: Voice interface & 7 voices
```

### Americanisms Feature

```
packages/aila/src/features/americanisms/
├── AilaAmericanisms.ts
├── american-british-english-translator.d.ts
├── index.ts
└── NullAilaAmericanisms.ts
```

**Total Area 6**: ~10 files

---

## Research Area 7: Teaching Materials Generation

### Documents: `packages/teaching-materials/src/documents/`

```
packages/teaching-materials/src/documents/
├── documentConfig.ts
├── generateDocument.ts
├── partialLessonPlan/
│   ├── buildPartialLessonPrompt.ts
│   ├── generateLessonPlan.ts
│   ├── generateLessonPlan.test.ts
│   ├── lessonPromptParts.ts
│   └── schema.ts
├── schemas/
│   └── oakOpenApi.ts
└── teachingMaterials/
    ├── configSchema.ts
    ├── generateTeachingMaterialObject.ts
    ├── materialTypes.ts
    ├── promptHelpers.ts               # KEY: Generation helpers
    ├── sharedSchema.ts
    ├── comprehension/
    │   ├── buildComprehensionPrompt.ts
    │   └── schema.ts
    ├── exitQuiz/
    │   ├── buildExitQuizPrompt.ts
    │   └── schema.ts
    ├── glossary/
    │   ├── buildGlossaryPrompt.ts
    │   └── schema.ts
    ├── refinement/
    │   └── schema.ts
    ├── starterQuiz/
    │   ├── buildStarterQuizPrompt.ts
    │   └── schema.ts
    └── dataHelpers/
        └── transformDataForExports.ts
```

### AI Providers

```
packages/teaching-materials/src/aiProviders/
├── index.ts
├── getGeneration.ts
└── openaiProvider.ts
```

**Total Area 7**: ~25 files

---

## Summary Table

| Research Area           | Primary Focus                       | File Count | Priority |
| ----------------------- | ----------------------------------- | ---------- | -------- |
| Area 1: Prompts         | Parts composition, voice system     | ~133       | High     |
| Area 2: Domain Model    | Lesson schema, quiz evolution       | ~36        | High     |
| Area 3: Quiz Generation | Question design, distractors        | ~15        | High     |
| Area 4: Moderation      | Safety categories, threat detection | ~20        | Medium   |
| Area 5: Workflow        | Planner agent, execution            | ~18        | Medium   |
| Area 6: Language        | Voice definitions, British English  | ~10        | Medium   |
| Area 7: Materials       | Document generation                 | ~25        | Medium   |

**Total Files for Deep Analysis**: ~257 files (with some overlap between areas)

---

## Key Files for Each Research Document

### prompt-architecture.md

- `packages/core/src/prompts/types.ts`
- `packages/core/src/prompts/lesson-assistant/index.ts`
- `packages/aila/src/lib/agentic-system/agents/plannerAgent/plannerAgent.instructions.ts`

### prompt-parts-inventory.md

- All 17 files in `packages/core/src/prompts/lesson-assistant/parts/`
- All 13 files in `packages/aila/src/lib/agentic-system/agents/sharedPromptParts/`

### prompt-patterns-worth-extracting.md

- Synthesis from Areas 1, 5, 6

### domain-model.md

- `packages/aila/src/protocol/schema.ts`
- `packages/aila/src/lib/agents/lessonPlanSectionGroups.ts`

### quiz-design-principles.md

- `packages/aila/src/protocol/schemas/quiz/quizV3.ts`
- `packages/aila/src/protocol/schema.ts` (quiz sections)

### learning-cycle-pedagogy.md

- `packages/aila/src/protocol/schema.ts` (CycleSchema)
- `packages/aila/src/lib/agentic-system/agents/sectionAgents/cycleAgent/`

### quiz-generation-expertise.md

- `packages/aila/src/lib/agents/prompts/shared/quizQuestionDesignInstructions.ts`
- `packages/aila/src/lib/agentic-system/agents/sectionAgents/starterQuizAgent/`
- `packages/aila/src/lib/agentic-system/agents/sectionAgents/exitQuizAgent/`

### distractor-design-rules.md

- `packages/aila/src/lib/agents/prompts/shared/quizQuestionDesignInstructions.ts`

### content-moderation-system.md

- `packages/teaching-materials/src/moderation/moderationPrompt.ts`
- `packages/aila/src/features/moderation/`

### safety-patterns.md

- `packages/core/src/threatDetection/lakera/`
- `packages/aila/src/features/threatDetection/`

### lesson-planning-workflow.md

- `packages/aila/src/lib/agentic-system/ailaTurn.ts`
- `packages/aila/src/lib/agentic-system/execution/`
- `packages/aila/src/lib/agentic-system/agents/plannerAgent/`

### section-generation-patterns.md

- All 14 section agent directories
- `packages/aila/src/lib/agentic-system/agents/sectionAgents/sectionAgentRegistry.ts`

### language-and-voice.md

- `packages/core/src/prompts/lesson-assistant/parts/languageAndVoice.ts`
- `packages/aila/src/lib/agentic-system/agents/sectionAgents/shared/voices/voices.ts`
- `packages/aila/src/features/americanisms/`

### teaching-materials.md

- `packages/teaching-materials/src/documents/teachingMaterials/`

### extraction-recommendations.md

- Synthesis from all areas
