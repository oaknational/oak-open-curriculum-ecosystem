# Plan 08b: OpenAI Apps SDK Feature Adoption - Part 2 (Deferred)

**Created**: 2025-11-30  
**Status**: ⏸️ DEFERRED  
**Duration**: ~8-12 hours (when resumed)  
**Focus**: Documentation, compliance, and advanced features

**Parent Plan**: [08-openai-apps-sdk-feature-adoption-plan.archived.md](../archive/08-openai-apps-sdk-feature-adoption-plan.archived.md)

---

## Overview

This is Part 2 of the OpenAI Apps SDK feature adoption, containing work deferred for later:

1. Golden prompt test suite and walkthrough documentation (Phase 0.4, 0.5)
2. Private tool support (Phase 4.1)
3. Follow-up messages (Phase 5.1)
4. Production readiness and compliance (Phase 6)

These items are deferred because:

- **Phase 0.4/0.5**: Documentation/validation work, not blocking functionality
- **Phase 4.1**: No concrete use case for private tools yet
- **Phase 5.1**: Follow-up messages are nice-to-have UX
- **Phase 6**: Required before public release, but not blocking development

---

## Deferred Task 1: Golden Prompt Test Suite (Phase 0.4)

**Priority**: MEDIUM (validation, not blocking)

### Intent

Systematic evaluation of tool discovery following OpenAI metadata optimization guidance.

### Deliverable

Create `docs/development/openai-app-golden-prompts.md`

### Content Structure

| Category        | Example Prompt                               | Expected Tool     | Success Criteria              |
| --------------- | -------------------------------------------- | ----------------- | ----------------------------- |
| **Direct**      | "Find KS3 science lessons on photosynthesis" | `search`          | Tool selected, params correct |
| **Indirect**    | "Help me teach photosynthesis to year 8"     | `search`          | Infers subject/key stage      |
| **Negative**    | "Create a new lesson plan from scratch"      | None              | Our tools NOT invoked         |
| **Composition** | "Show me a quiz for this lesson"             | `get-lesson-quiz` | Correct follow-up tool        |

### Acceptance Criteria

- File exists with ≥8 prompts
- ≥90% correct tool selection in manual testing

---

## Deferred Task 2: Walkthrough Documentation (Phase 0.5)

**Priority**: LOW (documentation)

### Intent

Shareable artifact proving viability.

### Deliverables (store under `docs/development/`)

- Connector creation screenshots
- Short video of successful chat interaction
- Sanitized server logs showing tool invocations

---

## Deferred Task 3: Private Tool Support (Phase 4.1)

**Priority**: DEFERRED until use case emerges

### Decision

Private tools capability is documented but NOT implemented until a concrete use case emerges. The type infrastructure (`openai/visibility`) was added in Phase 2, but no private tools are created.

### Use Case (future)

Internal diagnostic/admin tools hidden from model but callable from widget.

### Example Pattern (for future reference)

```typescript
// Example: Rate limit info tool (widget-only) - NOT IMPLEMENTED YET
const RATE_LIMIT_INFO_DEF = {
  name: 'get-rate-limit-info',
  description: 'Internal: Returns current rate limit status',
  inputSchema: { type: 'object', properties: {} },
  annotations: { readOnlyHint: true },
  _meta: {
    'openai/widgetAccessible': true,
    'openai/visibility': 'private', // Hidden from model
  },
};
```

### When to Implement

When we identify a tool that should be callable from widget but NOT shown to the model (e.g., diagnostics, admin functions, rate limit checks).

---

## Deferred Task 4: Follow-Up Messages (Phase 5.1)

**Priority**: LOW (nice-to-have UX)

### File

`apps/oak-curriculum-mcp-streamable-http/src/widget-script.ts`

### Implementation

```javascript
// Add "Ask about this" button for lessons
async function askAboutLesson(lesson) {
  await window.openai?.sendFollowUpMessage?.({
    prompt: `Tell me more about the lesson "${lesson.lessonTitle}" - what are the key learning objectives?`,
  });
}
```

### Acceptance Criteria

| Criterion                                   | Verification    |
| ------------------------------------------- | --------------- |
| "Ask about this" triggers follow-up message | Playwright test |
| Graceful fallback when API unavailable      | Playwright test |

---

## Deferred Task 5: Production Readiness & Compliance (Phase 6)

**Priority**: REQUIRED before public release

### 5.1: App Metadata Requirements

**Deliverables** (store in `docs/openai-app/`):

| Field           | Content                                                                                                                                                           |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**        | "Oak Curriculum Explorer"                                                                                                                                         |
| **Description** | "Access Oak National Academy's openly licensed curriculum - search lessons, units, quizzes, and teaching resources across UK key stages. Designed for educators." |
| **Categories**  | Education, Teaching Resources                                                                                                                                     |
| **Icon**        | Oak logo (verify licensing)                                                                                                                                       |

**Guidelines compliance**:

- ❌ No impersonation of other educational platforms
- ✅ Clear identification as Oak National Academy tool
- ✅ Accurate capability description

### 5.2: Privacy & Data Governance

**Audit checklist**:

| Check                            | Status | Notes                    |
| -------------------------------- | ------ | ------------------------ |
| No location fields requested     | ☐      | Verify all tool inputs   |
| No sensitive categories          | ☐      | No health/finance/etc.   |
| No chat history reconstruction   | ☐      | Tools are stateless      |
| Telemetry matches privacy policy | ☐      | Only resource IDs logged |
| No PII in tool outputs           | ☐      | Curriculum data only     |

**Deliverables**:

- Data flow diagram in `docs/architecture/data-flow.md`
- Privacy policy addendum if needed
- Support contact channel: `curriculum-support@thenational.academy`

### 5.3: Architectural Documentation

**Deliverables** (create in `docs/architecture/`):

1. **openai-app-architecture.md**: Diagram showing:

   ```
   OpenAPI Schema → type-gen → SDK → MCP Server → ChatGPT
   ```

2. **tool-composition-patterns.md**: Pedagogical workflows:
   - **Lesson discovery**: `search` → browse results
   - **Lesson deep-dive**: `get-lesson-summary` → `get-lesson-quiz` → `get-lesson-downloads`
   - **Curriculum exploration**: `get-ontology` → `get-subjects` → `get-units`

### 5.4: Operational Runbook

**File**: `docs/development/openai-app-runbook.md`

| Scenario              | Action                                               |
| --------------------- | ---------------------------------------------------- |
| Tool metadata changes | Refresh connector in ChatGPT Settings                |
| New tool added        | Run `pnpm type-gen`, redeploy, refresh connector     |
| Widget HTML changes   | Redeploy app, no connector refresh needed            |
| Breaking API change   | Version bump, update tool descriptions, notify users |
| Incident response     | Disable connector, investigate, redeploy             |

**Re-submission triggers**:

- New tools added
- Security scheme changes
- Major capability changes
- Privacy policy updates

### 5.5: Developer Verification

**Requirements** (when App Store opens):

| Requirement             | Status                                     |
| ----------------------- | ------------------------------------------ |
| Legal entity verified   | ☐ Oak National Academy                     |
| Support mailbox active  | ☐ `curriculum-support@thenational.academy` |
| Contact details current | ☐ Verify quarterly                         |

### Acceptance Criteria - Phase 6

| Criterion                     | Verification Method               |
| ----------------------------- | --------------------------------- |
| App metadata documented       | File exists in `docs/openai-app/` |
| Privacy audit complete        | Checklist signed off              |
| Architecture diagrams created | Files in `docs/architecture/`     |
| Runbook documented            | File exists with all scenarios    |
| No sensitive fields in tools  | Automated lint check              |

---

## When to Resume This Work

Resume this work when:

1. **Phase 0.4/0.5**: Before sharing with stakeholders or for demo purposes
2. **Phase 4.1**: When a concrete private tool use case emerges
3. **Phase 5.1**: When UX feedback requests follow-up capability
4. **Phase 6**: Before any public release or App Store submission

---

## References

- [Parent Plan (Archived)](../archive/08-openai-apps-sdk-feature-adoption-plan.archived.md)
- [Part 1 (Active)](./08a-openai-apps-sdk-part-1.md)
- [Part 1 Prompt](../../prompts/phase-8a-token-optimization-and-widget-features.prompt.md)
- [OpenAI App Developer Guidelines](https://developers.openai.com/apps-sdk/app-developer-guidelines)
