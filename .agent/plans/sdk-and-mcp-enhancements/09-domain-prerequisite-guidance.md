# Plan 09: Domain Prerequisite Guidance in Tool Descriptions

**Status**: ✅ COMPLETE (2025-11-30)

## Overview

Add "domain understanding prerequisite" guidance to all tool descriptions, encouraging AI agents to call `get-ontology` first before using other curriculum tools. This creates a "mini system prompt" embedded in every tool description.

## Problem Statement

AI agents using the Oak Curriculum MCP server often attempt to use tools like `search` or `fetch` without first understanding:

- The curriculum structure (key stages, subjects, units, lessons)
- Entity relationships and hierarchy
- ID formats required by the `fetch` tool
- Available workflows and best practices

This leads to:

- Incorrect tool usage
- Malformed queries
- Poor user experience
- Unnecessary errors

## Solution

Embed prerequisite guidance directly in tool descriptions that nudges the model to call `get-ontology` first. Since the model reads tool descriptions to decide when/how to use tools, this creates an effective "mini system prompt" pattern.

## Technical Approach

### Key Insight from OpenAI Apps SDK

From the metadata guide:

> "The model inspects these descriptors to decide when a tool fits the user's request, so treat names, descriptions, and schemas as part of your UX."

And:

> "Description – start with 'Use this when…' and call out disallowed cases"

Tool descriptions are the primary way to guide model behavior.

---

## Implementation Tasks

### Task 1: Create Shared Prerequisite Constant

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/tool-description.ts`

**Rationale**: Central location for description generation, applies to all generated tools.

**Implementation**:

```typescript
/**
 * Prerequisite guidance appended to generated tool descriptions.
 *
 * Encourages the model to understand the Oak Curriculum domain
 * before using specific API tools. References get-ontology as the
 * starting point for domain understanding.
 *
 * @remarks
 * This is intentionally brief to avoid bloating context windows.
 * The get-ontology tool provides comprehensive domain knowledge.
 */
export const DOMAIN_PREREQUISITE_GUIDANCE = `

PREREQUISITE: If unfamiliar with Oak Curriculum structure, call \`get-ontology\` first to understand key stages, subjects, entity hierarchy, and ID formats.`;
```

**TDD Steps**:

1. Write test: `toToolDescription` appends prerequisite to descriptions
2. Run test → FAIL
3. Implement constant and append logic
4. Run test → PASS

---

### Task 2: Update `toToolDescription` Function

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/tool-description.ts`

**Current Implementation**:

```typescript
export function toToolDescription(operation: OperationObject): string | undefined {
  const summary = typeof operation.summary === 'string' ? operation.summary.trim() : '';
  const rawDescription = typeof operation.description === 'string' ? operation.description : '';

  const description = rawDescription
    .replace(/\bThis endpoint\b/gi, (match) => (match[0] === 'T' ? 'This tool' : 'this tool'))
    .replace(/\s+/g, ' ')
    .trim();

  if (summary && description) {
    return `${summary}\n\n${description}`;
  }
  if (summary) {
    return summary;
  }
  if (description) {
    return description;
  }
  return undefined;
}
```

**New Implementation**:

```typescript
export function toToolDescription(operation: OperationObject): string | undefined {
  const summary = typeof operation.summary === 'string' ? operation.summary.trim() : '';
  const rawDescription = typeof operation.description === 'string' ? operation.description : '';

  const description = rawDescription
    .replace(/\bThis endpoint\b/gi, (match) => (match[0] === 'T' ? 'This tool' : 'this tool'))
    .replace(/\s+/g, ' ')
    .trim();

  let baseDescription: string | undefined;
  if (summary && description) {
    baseDescription = `${summary}\n\n${description}`;
  } else if (summary) {
    baseDescription = summary;
  } else if (description) {
    baseDescription = description;
  }

  if (!baseDescription) {
    return undefined;
  }

  // Append domain prerequisite guidance to all generated tool descriptions
  return `${baseDescription}${DOMAIN_PREREQUISITE_GUIDANCE}`;
}
```

**TDD Steps**:

1. Update existing tests to expect prerequisite in output
2. Add test: descriptions include prerequisite guidance
3. Run tests → FAIL (existing tests break)
4. Implement changes
5. Run tests → PASS

---

### Task 3: Regenerate Tools with `pnpm type-gen`

After updating the template:

```bash
pnpm --filter @oaknational/oak-curriculum-sdk type-gen
```

This regenerates all 23 tool descriptors with the new prerequisite guidance.

**Verification**:

- Check a generated tool file has the prerequisite in its description
- Run tests to ensure generated code is valid

---

### Task 4: Update Aggregated Tool Descriptions

#### 4.1: Search Tool

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/tool-definition.ts`

**Current**:

```typescript
description: `Search across lessons and transcripts for curriculum content.

Use this when you need to:
- Find lessons on a topic (e.g., "photosynthesis", "fractions")
- Discover what content exists for a key stage or subject
- Search transcript text for specific concepts

Do NOT use for:
- Getting detailed lesson content (use 'fetch' after finding the lesson)
- Understanding curriculum structure (use 'get-ontology' first)`,
```

**Updated**:

```typescript
description: `Search across lessons and transcripts for curriculum content.

PREREQUISITE: If you haven't loaded the curriculum domain model, call \`get-ontology\` first to understand key stages, subjects, and how content is organized.

Use this when you need to:
- Find lessons on a topic (e.g., "photosynthesis", "fractions")
- Discover what content exists for a key stage or subject
- Search transcript text for specific concepts

Do NOT use for:
- Getting detailed lesson content (use 'fetch' after finding the lesson)
- Understanding curriculum structure (use 'get-ontology' first)`,
```

#### 4.2: Fetch Tool

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch.ts`

**Updated**:

```typescript
description: `Fetch curriculum resource by canonical identifier.

PREREQUISITE: If unfamiliar with Oak ID formats, call \`get-ontology\` first to learn the "type:slug" pattern (e.g., "lesson:adding-fractions", "unit:algebra-basics").

Use this when you need to:
- Get lesson details (learning objectives, keywords, misconceptions)
- Get unit information (lessons list, subject context)
- Get subject or sequence overview
- Retrieve thread progression data

Do NOT use for:
- Finding content when you don't have the ID (use 'search')
- Understanding ID formats (use 'get-ontology' first)

Use format "type:slug" (e.g., "lesson:adding-fractions", "unit:algebra-basics").`,
```

#### 4.3: Get-Help Tool

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-help/definition.ts`

**Updated**:

```typescript
description: `Returns guidance on how to use the Oak Curriculum MCP server's tools effectively.

PREREQUISITE: For domain understanding (key stages, subjects, hierarchy), use \`get-ontology\` instead. This tool provides tool usage guidance, not curriculum structure.

Use this when you need to understand:
- How to use a specific tool
- What tools are available and when to use them
- Common workflows for finding and using curriculum content

Do NOT use for:
- Understanding curriculum structure (use 'get-ontology')
- Finding lessons or content (use 'search')`,
```

---

### Task 5: Enhance `get-ontology` as the Starting Point

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-ontology.ts`

The `get-ontology` tool should NOT have the prerequisite (it IS the prerequisite). Enhance its description to emphasize it should be called first:

**Updated**:

```typescript
description: `Returns the Oak Curriculum domain model including key stages, subjects, entity hierarchy, and tool usage guidance.

**RECOMMENDED FIRST STEP**: Call this tool before using other curriculum tools to understand the domain model.

Use this when you need to understand:
- How the curriculum is structured (key stages KS1-KS4, years, subjects)
- How entities relate (Subject → Unit → Lesson)
- Which tools to use for different workflows
- ID formats for the 'fetch' tool (e.g., "lesson:slug", "unit:slug")

This tool provides the foundation for effective use of all other curriculum tools.

Do NOT use for:
- Fetching actual curriculum content (use 'search' or 'fetch')
- Looking up specific lessons, units, or resources`,
```

---

## Testing Strategy

### Unit Tests

**File**: `type-gen/typegen/mcp-tools/parts/tool-description.unit.test.ts`

```typescript
describe('toToolDescription with prerequisite guidance', () => {
  it('appends prerequisite guidance to descriptions', () => {
    const operation = {
      summary: 'Get lessons',
      description: 'Returns lessons for a subject.',
    };

    const result = toToolDescription(operation);

    expect(result).toContain('PREREQUISITE');
    expect(result).toContain('get-ontology');
  });

  it('includes prerequisite even when only summary exists', () => {
    const operation = { summary: 'Get lessons' };

    const result = toToolDescription(operation);

    expect(result).toContain('PREREQUISITE');
  });
});
```

### Integration Tests

Verify generated tools have prerequisite in descriptions:

```typescript
describe('generated tool descriptions', () => {
  it('all generated tools include prerequisite guidance', () => {
    const tools = listUniversalTools();
    const generatedTools = tools.filter((t) => !AGGREGATED_NAMES.includes(t.name));

    for (const tool of generatedTools) {
      expect(tool.description).toContain('PREREQUISITE');
      expect(tool.description).toContain('get-ontology');
    }
  });
});
```

---

## Acceptance Criteria

1. **All 23 generated tools** have prerequisite guidance in their descriptions
2. **Aggregated tools** (search, fetch, get-help) have customized prerequisite guidance
3. **get-ontology** does NOT have prerequisite (it IS the starting point)
4. **get-ontology** has enhanced description emphasizing "call first"
5. All tests pass
6. Lint and type-check pass
7. `pnpm type-gen` successfully regenerates tools

---

## Verification Commands

```bash
# Run type-gen to regenerate tools
pnpm --filter @oaknational/oak-curriculum-sdk type-gen

# Verify tests pass
pnpm --filter @oaknational/oak-curriculum-sdk test -- --run

# Verify lint and type-check
pnpm --filter @oaknational/oak-curriculum-sdk lint
pnpm --filter @oaknational/oak-curriculum-sdk type-check

# Manual verification: check a generated tool file
cat packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/generated/data/tools/get-lessons-summary.ts | grep -A 5 "description"
```

---

## Future Considerations

1. **A/B Testing**: Could vary the prerequisite wording and measure tool call success rates
2. **Dynamic Guidance**: Could add more specific guidance based on tool category (discovery vs detail tools)
3. **Model Analytics**: Track how often `get-ontology` is called first vs other tools
4. **Localization**: Consider translating prerequisite guidance for `_meta["openai/locale"]`

---

## Dependencies

- OpenAI Apps SDK tool description handling
- Type-gen template system
- Schema-first execution directive compliance

---

## Estimated Effort

- Task 1-2 (type-gen changes): 30 minutes
- Task 3 (regenerate): 5 minutes
- Task 4-5 (aggregated tools): 30 minutes
- Testing and verification: 30 minutes

**Total**: ~1.5 hours

---

## Key Principle

This implements a "progressive disclosure" pattern in tool descriptions:

1. **First contact**: Model reads descriptions and sees "call get-ontology first"
2. **Domain loading**: Model calls `get-ontology`, receives comprehensive domain model
3. **Informed usage**: Model now understands key stages, subjects, ID formats
4. **Effective tool use**: Subsequent tool calls are well-informed

The prerequisite guidance is the nudge; `get-ontology` is the payload.
