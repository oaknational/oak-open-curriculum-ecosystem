# Prompt Architecture and Composition

**Research Area**: 1 - Prompt Architecture
**Status**: Complete
**Last Updated**: 2025-11-30

---

## Overview

The Aila prompt system uses a compositional architecture where prompts are built from modular parts, assembled conditionally based on context, and versioned through variant generation. This allows for flexible prompt construction while maintaining consistency across different interaction modes.

---

## Key Files Analysed

- `packages/core/src/prompts/types.ts`
- `packages/core/src/prompts/lesson-assistant/index.ts`
- `packages/core/src/prompts/lesson-assistant/variants.ts`
- `packages/core/src/prompts/lesson-assistant/parts/*.ts`
- `packages/aila/src/lib/agentic-system/agents/plannerAgent/plannerAgent.instructions.ts`

---

## 1. Core Prompt Type System

### OakPromptDefinition Structure

```typescript
type OakPromptDefinition = {
  name: string; // Human-readable name
  slug: string; // URL-safe identifier
  appId: string; // Application identifier (e.g., "lesson-planner")
  variants: OakPromptVariant[]; // All possible prompt variants
  inputSchema: z.ZodTypeAny; // Zod schema for input validation
  outputSchema: z.ZodTypeAny; // Zod schema for output validation
};
```

**Domain Knowledge**: Prompts are treated as versioned artefacts with formal schemas, enabling validation and reproducibility.

### OakPromptVariant Structure

```typescript
type OakPromptVariant = {
  slug: string; // Variant identifier
  parts: OakPromptParts; // The actual prompt content
};
```

**Domain Knowledge**: Variants capture different configurations of the same prompt for different contexts.

### OakPromptParts Structure

```typescript
type OakPromptParts = {
  body: string; // Main content
  context: string; // Contextual information
  output: string; // Output format specification
  task: string; // Task description
};
```

**Domain Knowledge**: The four-part structure (body, context, output, task) reflects a pedagogical design pattern for instructional prompts.

---

## 2. Parts Composition Pattern

### How getPromptParts() Works

The `getPromptParts()` function in `lesson-assistant/index.ts` assembles prompts from modular parts based on `TemplateProps`:

```typescript
interface TemplateProps {
  relevantLessonPlans?: string; // RAG results
  lessonPlan: PartialLessonPlan; // Current lesson state
  summaries?: string; // Knowledge summaries
  responseMode?: 'interactive' | 'generate';
  baseLessonPlan?: string; // Reference lesson
  useRag?: boolean; // RAG enabled
  americanisms?: object[]; // British English corrections
  lessonPlanJsonSchema: string; // Schema for lesson
  llmResponseJsonSchema: string; // Schema for responses
  isUsingStructuredOutput: boolean;
}
```

### Conditional Part Inclusion

Parts are conditionally included based on context:

| Part                            | Condition                      | Purpose                                           |
| ------------------------------- | ------------------------------ | ------------------------------------------------- |
| `context`                       | Always                         | Identity and role definition                      |
| `task`                          | Always                         | Core task description                             |
| `interactingWithTheUser`        | responseMode === "interactive" | Conversation guidance                             |
| `lessonComplete`                | responseMode === "interactive" | Completion criteria                               |
| `endingTheInteraction`          | responseMode === "interactive" | Conversation ending format                        |
| `body`                          | Always                         | Pedagogical guidance (4000+ words)                |
| `currentLessonPlan`             | Always                         | Current state injection                           |
| `rag`                           | useRag === true                | RAG context injection                             |
| `basedOn`                       | baseLessonPlan defined         | Reference lesson pattern                          |
| `americanToBritish`             | americanisms.length > 0        | British English corrections                       |
| `languageAndVoice`              | Always                         | Voice system definitions                          |
| `schema`                        | !isUsingStructuredOutput       | Manual schema (when not using structured outputs) |
| `protocol` / `generateResponse` | Based on responseMode          | Output format specification                       |
| `promptingTheUser`              | responseMode === "interactive" | User prompt guidance                              |
| `signOff`                       | Always                         | Closing instructions                              |

**Domain Knowledge**: The conditional assembly reflects different interaction modes (interactive chat vs batch generation) and different contexts (with/without RAG, with/without reference lesson).

### Template Variable Injection

Each part is a function that receives `TemplateProps` and returns a string:

```typescript
type TemplatePart = (props: TemplateProps) => string;
```

Variables are injected via template literals:

```typescript
const task = ({ lessonPlan: { subject, keyStage, title, topic } }) =>
  `Create a lesson plan for ${keyStage} ${subject} within the following topic...`;
```

**Domain Knowledge**: This pattern allows dynamic content based on the current lesson state while maintaining static pedagogical guidance.

---

## 3. Multi-Agent Prompt Architecture

### Planner Agent Role

The planner agent (`plannerAgent.instructions.ts`) acts as an orchestrator:

**Responsibilities**:

- Determine which sections need generation
- Choose between "plan" (generate content) and "exit" (respond without generation)
- Manage section group ordering
- Handle out-of-scope and clarification requests

**Decision Types**:

```
"plan" decisions:
- Specific section request from user
- Section deletion request
- Complete lesson request
- Default progression (next incomplete sections)

"exit" decisions:
- out_of_scope: Unrelated to lesson planning
- capability_limitation: Technically impossible
- clarification_needed: Ambiguous request
- relevant_query: Information request about lesson
```

### Section Agent Pattern

Each section has a dedicated agent with:

1. **Instructions file** (`.instructions.ts`): Domain-specific guidance
2. **Schema file** (`.schema.ts`): Output structure
3. **Index file**: Exports and composition

Example structure for `starterQuizAgent`:

```
starterQuizAgent/
├── index.ts
├── starterQuiz.instructions.ts  # Quiz design rules for prior knowledge
└── starterQuiz.schema.ts        # Quiz output structure
```

**Domain Knowledge**: This pattern allows each section to have tailored pedagogical guidance while sharing common patterns (like quiz design) via imports.

### Message-to-User Agent

Handles communication back to the teacher:

- Formats responses
- Manages conversation flow
- Handles clarification requests

---

## 4. Prompt Variant System

### Variant Generation

Variants are generated from a matrix of configurations:

```typescript
const variantConfigs = [
  { responseMode: 'interactive', basedOn: true, useRag: true },
  { responseMode: 'interactive', basedOn: true, useRag: false },
  { responseMode: 'interactive', basedOn: false, useRag: true },
  { responseMode: 'interactive', basedOn: false, useRag: false },
  { responseMode: 'generate', basedOn: true, useRag: true },
  { responseMode: 'generate', basedOn: true, useRag: false },
  { responseMode: 'generate', basedOn: false, useRag: true },
  { responseMode: 'generate', basedOn: false, useRag: false },
];
```

**8 variants** cover all combinations of:

- Response mode (interactive vs generate)
- Based on existing lesson (yes/no)
- RAG enabled (yes/no)

### Variant Selection Logic

Slug generation: `${responseMode}-${basedOn ? "basedOn" : "notBasedOn"}-${useRag ? "rag" : "noRag"}`

Example slugs:

- `interactive-basedOn-rag`
- `generate-notBasedOn-noRag`

### Prompt Hash Generation

For versioning and caching:

```typescript
const hash = crypto.createHash('md5').update(partsString).digest('hex');
return `${responseMode}-${useRag ? 'rag' : 'noRag'}-${basedOn ? 'basedOn' : 'notBasedOn'}-${hash}`;
```

**Domain Knowledge**: Hash-based versioning allows detection of prompt changes and cache invalidation.

---

## 5. Domain Knowledge Encoded

### Pedagogical Principles

The prompt system encodes extensive pedagogical expertise:

1. **Lesson Structure**: 50 minutes total (40 for KS1), with specific time allocations
2. **Learning Cycles**: Explanation → Check for Understanding → Practice → Feedback
3. **Section Groups**: Ordered progression reflecting pedagogical dependencies
4. **Assessment Design**: Starter quiz (prior knowledge) vs Exit quiz (lesson content)
5. **Age Appropriateness**: UK National Curriculum alignment by key stage

### Educational Constraints

| Constraint                              | Source            | Purpose                       |
| --------------------------------------- | ----------------- | ----------------------------- |
| Max 30 words for learning outcome       | `body.ts`         | Clarity and achievability     |
| Max 20 words per learning cycle outcome | `body.ts`         | Concise objectives            |
| Max 5 prior knowledge items             | `body.ts`         | Focused prerequisites         |
| 6 questions per quiz                    | Quiz instructions | Balanced assessment           |
| 5/6 target pass rate                    | Quiz instructions | Appropriate difficulty        |
| Tier 2/3 vocabulary focus               | `body.ts`         | Academic language development |

### Voice System Integration

Schema descriptions use voice identifiers:

```typescript
spokenExplanation: 'The spoken teacher explanation in the EXPERT_TEACHER voice...';
slideText: 'Written in the TEACHER_TO_PUPIL_SLIDES voice...';
```

This ensures consistent tone across generated content.

---

## Key Insights

### Pattern 1: Conditional Composition

The system assembles prompts from parts based on context, rather than maintaining multiple complete prompts. This reduces duplication while allowing specialisation.

### Pattern 2: Domain Knowledge in Parts

Each part encodes specific pedagogical knowledge. The `body.ts` file alone contains ~400 lines of educational guidance covering lesson structure, quiz design, learning cycles, and more.

### Pattern 3: Section-Specific Agents

Rather than one monolithic prompt, the agentic system uses specialised agents for each lesson section, allowing tailored guidance per section type.

### Pattern 4: Variant Matrix

The variant system pre-generates all valid configurations, enabling efficient lookup rather than runtime assembly.

### Pattern 5: Schema-Driven Output

Both structured outputs and manual schema sections ensure type-safe generation aligned with the lesson plan schema.

---

## Extraction Recommendations

### High Value for Extraction

1. **Voice System**: Well-defined, could be simplified to pure data structure
2. **Section Group Ordering**: Domain knowledge about pedagogical dependencies
3. **Quiz Design Rules**: Clear, testable rules for question generation
4. **Time Constraints**: Lesson timing by key stage

### Medium Value

1. **Conditional Part Inclusion**: Pattern is useful but implementation-specific
2. **Variant Generation**: Concept valuable, implementation details not needed

### Simplification Opportunities

1. **Parts as Data**: Convert prompt parts from functions to data structures
2. **Voice as Enum**: Type the voice system more strictly
3. **Constraints as Schema**: Encode constraints in Zod schemas rather than prose
4. **Section Dependencies as Graph**: Make ordering explicit rather than implicit in arrays
