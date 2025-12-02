# Lesson Planning Workflow

**Research Area**: 5 - Lesson Planning Workflow
**Status**: Complete
**Last Updated**: 2025-11-30

---

## Overview

Documentation of the complete lesson planning workflow in Aila, from initial request to complete lesson plan.

---

## Key Files Analysed

- `packages/aila/src/lib/agentic-system/ailaTurn.ts`
- `packages/aila/src/lib/agentic-system/execution/`
- `packages/aila/src/lib/agentic-system/agents/plannerAgent/plannerAgent.instructions.ts`
- `packages/core/src/prompts/lesson-assistant/parts/interactingWithTheUser.ts`

---

## 1. High-Level Architecture

### Turn Orchestration

The `ailaTurn.ts` file orchestrates each interaction:

```
User Message
    │
    ▼
Planning Phase (Planner Agent)
    │
    ├──► "exit" decision → Respond directly
    │
    └──► "plan" decision → Section Steps
                              │
                              ▼
                         Execute Steps (Section Agents)
                              │
                              ▼
                         Compile Response
                              │
                              ▼
                         Return to User
```

### Planner → Section Agent Flow

1. **Planner Agent** receives user message + current lesson state
2. Planner decides: "plan" (generate sections) or "exit" (respond directly)
3. If "plan": Planner outputs list of section steps to execute
4. **Section Agents** execute each step sequentially
5. Results compiled into final response with patches + message

---

## 2. Planner Agent Decision Rules

### When to Choose "plan"

| Scenario                 | Action                             |
| ------------------------ | ---------------------------------- |
| Specific section request | Plan for that section only         |
| Section deletion request | Plan with "delete" action          |
| Complete lesson request  | Plan all remaining sections        |
| Default progression      | Plan next incomplete section group |
| General positive intent  | Plan next logical steps            |

**Examples of "plan" triggers**:

- "Add more detail to the misconceptions"
- "Generate the quizzes now"
- "Delete cycle3"
- "Continue" / "Looks good"

### When to Choose "exit"

| Exit Reason           | Code                    | Description                                        |
| --------------------- | ----------------------- | -------------------------------------------------- |
| Out of scope          | `out_of_scope`          | Unrelated to lesson planning (weather, jokes)      |
| Capability limitation | `capability_limitation` | Impossible actions (email, print, save to desktop) |
| Clarification needed  | `clarification_needed`  | Ambiguous request ("make it better")               |
| Relevant query        | `relevant_query`        | Information request, capability questions          |

**Examples of "exit" triggers**:

- "What's the weather today?" → `out_of_scope`
- "Send this lesson to my colleague" → `capability_limitation`
- "Can you improve it?" → `clarification_needed`
- "What are learning cycles?" → `relevant_query`

---

## 3. Section Group Processing

### Group Ordering

```typescript
sectionGroups = [
  ['basedOn', 'learningOutcome', 'learningCycles'], // Foundation
  ['priorKnowledge', 'keyLearningPoints', 'misconceptions', 'keywords'], // Knowledge
  ['starterQuiz', 'cycle1', 'cycle2', 'cycle3', 'exitQuiz'], // Content
  ['additionalMaterials'], // Supplementary
];
```

### Processing Rules

1. **Process groups in order**: Don't skip ahead
2. **Complete group before next**: Generate all sections in a group together
3. **User override**: If user requests specific section, honour that
4. **Dependency respect**: Later groups depend on earlier groups

### Dependency Rules

| Section         | Requires                         | Rationale                       |
| --------------- | -------------------------------- | ------------------------------- |
| learningOutcome | title, keyStage, subject         | Need context for outcomes       |
| learningCycles  | learningOutcome                  | Cycles break down outcome       |
| priorKnowledge  | learningCycles                   | Prior knowledge supports cycles |
| starterQuiz     | priorKnowledge, misconceptions   | Quiz tests prior knowledge      |
| cycles          | learningCycles, keywords         | Cycles implement learning       |
| exitQuiz        | keywords, misconceptions, cycles | Quiz tests lesson content       |

### The "basedOn" Outlier

`basedOn` has special rules:

1. Only include in plan if user has been shown a list of relevant lessons
2. User must explicitly select from numbered options
3. Once past Foundation group, don't return to basedOn unless explicitly requested

```
Step 1: Present relevant lessons (if available)
Step 2: User responds with number or "Continue"
Step 3: If number → set basedOn, generate outcomes
        If "Continue" → skip basedOn, generate outcomes from scratch
```

---

## 4. Execution Flow

### Planning Phase

```typescript
// executePlanningPhase.ts
async function executePlanningPhase(
  userMessage: string,
  currentLessonPlan: PartialLessonPlan,
  messageHistory: Message[],
): Promise<PlannerResult> {
  // 1. Invoke planner agent
  // 2. Parse decision (plan or exit)
  // 3. If plan, return step list
  // 4. If exit, return exit reason + message
}
```

### Step Execution

```typescript
// executePlanSteps.ts
async function executePlanSteps(
  steps: PlanStep[],
  context: ExecutionContext,
): Promise<ExecutionResult> {
  const patches = [];

  for (const step of steps) {
    // 1. Find appropriate section agent
    // 2. Execute agent with context
    // 3. Collect patches
    // 4. Update context for next step
  }

  return { patches, message };
}
```

### Termination Conditions

Execution terminates when:

1. All steps completed successfully
2. An agent fails (error handling)
3. Max iterations reached (safety)
4. User cancellation (rare)

---

## 5. User Interaction Patterns

### Clarification Requests

When planner exits with `clarification_needed`:

```
User: "Make it better"
Aila: "I'd be happy to help improve the lesson. Could you tell me which
      part you'd like me to focus on? For example:
      - The learning outcome
      - The quiz questions
      - The practice activities
      Or describe what aspect you'd like to change."
```

### Feedback Incorporation

The system accepts feedback at multiple points:

1. **After section group**: "Would you like to adjust anything before I continue?"
2. **On specific sections**: User can request edits to any section
3. **At completion**: Final review and consistency check

### "Based on Existing Lesson" Pattern

```
1. System retrieves relevant Oak lessons via RAG
2. Presents numbered list to user:
   "These Oak lessons might be relevant:
    1. Introduction to the Periodic Table
    2. Chemical Reactions and Equations
    3. The Structure of the Atom

    To base your lesson on one of these, type the number.
    Tap **Continue** to start from scratch."

3. User responds with number or "Continue"
4. If number: basedOn set, lesson content pre-populated
5. If Continue: Fresh generation from user's specifications
```

---

## 6. RAG Integration

### Relevant Lesson Retrieval

```typescript
// handleRelevantLessons.ts
async function handleRelevantLessons(
  title: string,
  subject: string,
  keyStage: string,
): Promise<RelevantLesson[]> {
  // 1. Query vector store with lesson parameters
  // 2. Filter by subject and key stage
  // 3. Rank by similarity
  // 4. Return top N relevant lessons
}
```

### How Retrieved Content Influences Generation

1. **Exemplar content**: Section agents see examples from similar lessons
2. **Knowledge alignment**: Generated content aligns with Oak curriculum
3. **Quality benchmark**: RAG examples set quality expectations
4. **Never copied directly**: Used as reference, not copied verbatim

---

## Key Insights

### Insight 1: Planner as Orchestrator

The planner agent is a router/orchestrator, not a content generator. It decides **what** to do, not **how** to do it.

### Insight 2: Groups Reduce Cognitive Load

Processing sections in groups:

- Reduces back-and-forth
- Maintains pedagogical coherence
- Reflects natural lesson structure

### Insight 3: User Control Preserved

Despite automation:

- Users can override group ordering
- Users can edit any section
- Users control basedOn selection

### Insight 4: Exit Reasons Enable Better UX

Explicit exit reasons allow tailored responses:

- `out_of_scope` → Gently redirect
- `clarification_needed` → Ask specific questions
- `capability_limitation` → Explain what's possible

---

## Extraction Recommendations

### As State Machine

```typescript
type WorkflowState =
  | { phase: 'awaiting_identity' }
  | { phase: 'awaiting_basedOn_decision'; relevantLessons: Lesson[] }
  | { phase: 'generating_foundation' }
  | { phase: 'generating_knowledge' }
  | { phase: 'generating_content' }
  | { phase: 'generating_supplementary' }
  | { phase: 'complete' };

function getNextState(
  current: WorkflowState,
  lessonPlan: PartialLessonPlan,
  userAction: UserAction,
): WorkflowState;
```

### As Dependency Graph

```typescript
const SECTION_DEPENDENCIES: Record<LessonPlanKey, LessonPlanKey[]> = {
  title: [],
  keyStage: [],
  subject: [],
  learningOutcome: ['title', 'keyStage', 'subject'],
  learningCycles: ['learningOutcome'],
  // ... etc
};

function canGenerate(section: LessonPlanKey, plan: PartialLessonPlan): boolean {
  const deps = SECTION_DEPENDENCIES[section];
  return deps.every((dep) => plan[dep] !== undefined);
}
```

### Integration Points

- **Plan 03 (Infrastructure)**: Workflow orchestration patterns
- **Plan 04 (Prompts)**: Planner and section agent instructions
- **MCP Tools**: Section-specific generation tools
