# Safety Patterns for Educational AI

**Research Area**: 4 - Content Moderation and Safety
**Status**: Complete
**Last Updated**: 2025-11-30

---

## Overview

Documentation of safety patterns used in the Aila system for protecting educational content and users.

---

## Key Files Analysed

- `packages/core/src/threatDetection/lakera/`
- `packages/aila/src/features/threatDetection/`
- `packages/core/src/prompts/shared/prompt-injection/`

---

## 1. Threat Detection Integration

### Lakera Integration

Lakera is an external service for detecting prompt injection and other AI threats.

**Location**: `packages/core/src/threatDetection/lakera/`

**Components**:

- `LakeraClient.ts`: API client for Lakera service
- `schema.ts`: Response schema definitions

**Usage Pattern**:

```typescript
// Check user input before processing
const threatResult = await lakeraClient.checkThreat(userInput);
if (threatResult.isThreat) {
  // Block or flag the input
}
```

### Helicone Integration

**Location**: `packages/aila/src/features/threatDetection/detectors/helicone/`

**Purpose**: Alternative/complementary threat detection via Helicone's AI gateway.

### Basic Threat Detection

**Location**: `packages/aila/src/features/threatDetection/basic/`

**Purpose**: Simple, local threat detection for obvious patterns.

**Patterns detected**:

- Known jailbreak phrases
- System prompt extraction attempts
- Role-play injection attempts

---

## 2. Prompt Injection Protection

### Detection Patterns

**Location**: `packages/core/src/prompts/shared/prompt-injection/`

**Known injection patterns**:

- "Ignore previous instructions..."
- "You are now..."
- "Reveal your system prompt..."
- Role assumption attacks
- Context manipulation

### Mitigation Strategies

1. **Input Sanitisation**: Check user input before processing
2. **System Prompt Protection**: Don't expose system prompts to users
3. **Output Filtering**: Scan responses for leaked instructions
4. **Rate Limiting**: Prevent rapid-fire injection attempts
5. **Logging**: Track suspicious patterns for analysis

---

## 3. Content Filtering

### Pre-Generation Filtering

**When**: Before sending user input to LLM

**What**:

- Threat detection (Lakera/Helicone)
- Basic pattern matching
- Topic appropriateness check

### Post-Generation Filtering

**When**: After receiving LLM response

**What**:

- Content moderation (6 category groups)
- Output validation against schema
- Toxic content detection

---

## 4. Educational Context Safety

### Age-Appropriate Filtering

The moderation system adjusts thresholds based on key stage:

| Key Stage | Ages  | Safety Threshold  |
| --------- | ----- | ----------------- |
| KS1       | 5-7   | Most restrictive  |
| KS2       | 7-11  | Restrictive       |
| KS3       | 11-14 | Moderate          |
| KS4       | 14-16 | Less restrictive  |
| KS5       | 16-18 | Least restrictive |

### Subject-Specific Considerations

Some subjects legitimately discuss sensitive topics:

- **History**: War, violence, discrimination
- **PSHE**: Drugs, relationships, mental health
- **Science**: Reproduction, chemical safety
- **RE**: Religious violence, persecution

Moderation must distinguish legitimate educational content from inappropriate content.

---

## 5. Error Handling for Safety

### Graceful Degradation

If safety services are unavailable:

1. Log the failure
2. Apply conservative local filtering
3. Flag for manual review
4. Don't expose raw LLM output

### User Feedback

When content is blocked:

- Explain what was blocked (without revealing detection logic)
- Suggest how to rephrase
- Provide escalation path

---

## 6. Threat Detection Architecture

### Detector Interface

```typescript
interface AilaThreatDetector {
  checkThreat(input: string): Promise<ThreatResult>;
  getDetectorType(): string;
}

interface ThreatResult {
  isThreat: boolean;
  confidence: number;
  threatType?: string;
  details?: string;
}
```

### Detector Chain

Multiple detectors can be chained:

```
User Input
    │
    ▼
BasicThreatDetector (fast, local)
    │
    ▼ (if passes)
LakeraThreatDetector (comprehensive, external)
    │
    ▼ (if passes)
HeliconeThreatDetector (AI gateway)
    │
    ▼ (if passes)
Process normally
```

### Mock Detector

For testing:

```typescript
class MockThreatDetector implements AilaThreatDetector {
  checkThreat(input: string): Promise<ThreatResult> {
    return { isThreat: false, confidence: 0 };
  }
}
```

---

## Key Insights

### Insight 1: Defence in Depth

Multiple layers of detection:

1. Basic pattern matching (fast, cheap)
2. AI-powered detection (Lakera)
3. Gateway integration (Helicone)
4. Post-generation moderation

### Insight 2: External Services for Evolving Threats

Prompt injection techniques evolve rapidly. External services (Lakera) can update their models faster than we can update local patterns.

### Insight 3: Educational Context Matters

Generic safety systems may over-block legitimate educational content. The moderation system understands educational context.

### Insight 4: Toxic is Special

Most moderation provides guidance. Toxic content is blocked entirely—it's a binary safety decision, not a content warning.

---

## Extraction Recommendations

### As Interface

```typescript
interface SafetyService {
  checkInput(input: string, context: EducationalContext): Promise<SafetyResult>;
  moderateOutput(output: string, context: EducationalContext): Promise<ModerationResult>;
}

interface EducationalContext {
  keyStage: KeyStageSlug;
  subject: string;
  contentType: 'lesson' | 'quiz' | 'material';
}
```

### Integration Points

- **MCP Tools**: Validate inputs before processing
- **Generation**: Filter outputs before returning
- **Storage**: Flag content for review
- **Analytics**: Track threat patterns
