# Phase 6: Oak Curriculum API Implementation Plan

**Last Updated**: 2025-08-12 (Evening)  
**Status**: 🚧 Phase 6.5 IN PROGRESS - Parallel work COMPLETED  
**Lead Developer**: Claude  
**Dependencies**: Phase 5 ✅ COMPLETED

## 🎯 Executive Summary

Implement Oak National Academy's Curriculum API as both a reusable SDK and a comprehensive MCP server with full tool coverage, demonstrating multi-organism coexistence in our biological architecture ecosystem.

## ✅ Completed Achievements (Condensed)

### Sub-phase 6.1-6.4: Foundation Complete ✅

**SDK Implementation**:
- ✅ Type generation pipeline with openapi-typescript
- ✅ Client implementation using openapi-fetch pattern
- ✅ Multi-entry point build configuration (tsup)
- ✅ Full E2E test suite (17 tests passing)
- ✅ API documentation created

**MCP Server Implementation**:
- ✅ Biological architecture (chorai/organa/psychon)
- ✅ Basic tool implementation (4 tools)
- ✅ TDD remediation (complexity <8, functions <50 lines)
- ✅ 38 tests passing (unit + integration)
- ✅ Startup script with proper env loading
- ✅ File logging to root .logs directory
- ✅ Successfully connected to Claude

**Key Achievement**: Production-ready foundation with zero technical debt, all quality gates passing.

## 🚀 Sub-phase 6.5: Programmatic MCP Tool Generation

### 🔄 PIVOT: From Manual to Programmatic Tool Generation

**Critical Insight**: We are currently manually defining MCP tools with hardcoded schemas, duplicating constants that already exist in the SDK. This creates maintenance burden and risks inconsistency.

### Objective
Implement programmatic generation of MCP tools directly from the Oak Curriculum SDK's exported types, constants, and OpenAPI schema - achieving 100% API coverage with zero manual duplication.

### Current vs Target State

| Aspect | Current (Manual) | Target (Programmatic) |
|--------|-----------------|----------------------|
| Tool Definitions | Manually typed Tool objects | Generated from SDK schema |
| Valid Values | Duplicated KEY_STAGES, SUBJECTS | Imported from SDK exports |
| Type Guards | Custom validators | Use SDK's type guards |
| Schema Updates | Manual updates needed | Auto-sync with SDK |
| Maintenance | High - multiple touch points | Low - single source of truth |
| Consistency | Risk of drift | Guaranteed consistency |

### Implementation Plan (Updated for SDK Zod Validators)

#### Phase 6.5.0: SDK Zod Validators Integration (Prerequisites)

**Status**: 🔄 SDK team implementing, MCP parallel work COMPLETED

**SDK Team Deliverables** (Being implemented separately):

The SDK team is implementing the Zod validators plan which will provide:

1. **Runtime Validation** (via `validation` namespace):
   - `validateRequest(path, method, args)` - Validate MCP tool inputs
   - `validateResponse(path, method, status, data)` - Validate API responses
   - Per-operation validators for curated operations
   - `makeValidatedClient()` wrapper for runtime safety

2. **Programmatic Generation Support** (via `toolGeneration` namespace):
   - `schema` - Raw OpenAPI schema export
   - `PATH_OPERATIONS[]` - Operation metadata (path, method, operationId, parameters)
   - `PARAM_TYPE_MAP` - JSON Schema mappings for parameters
   - `parsePathTemplate(template, method?)` - Tool naming utilities

3. **API Documentation** (via TypeDoc):
   - Comprehensive API docs in `docs/api/`
   - TSDoc comments on all public exports
   - Root-only export discipline maintained

**MCP Integration Points**:

```typescript
// New imports available from SDK after Zod implementation
import {
  // Existing exports we already use
  PATHS,
  KEY_STAGES,
  SUBJECTS,
  isValidPath,
  
  // NEW: Raw schema for parsing
  schema,
  
  // NEW: Validation namespace
  validation,
  
  // NEW: Tool generation namespace
  toolGeneration,
} from '@oaknational/oak-curriculum-sdk';

// Use SDK's runtime validation
const result = validation.validateRequest('/lessons/{lesson}/transcript', 'get', {
  lesson: 'adding-fractions-2'
});

// Use SDK's tool generation helpers
const operations = toolGeneration.PATH_OPERATIONS;
const { toMcpToolName } = toolGeneration.parsePathTemplate('/lessons/{lesson}/transcript', 'get');
// Returns: 'oak-get-lessons-transcript'
```

#### Phase 6.5.1: Parallel MCP Work (COMPLETED While Waiting for SDK)

**Status**: ✅ COMPLETED 2025-08-12

**Completed Tasks**:

1. ✅ **Fixed MCP Validators**:
   - Removed incorrect manual constants (eyfs, ks5, latin)
   - Now importing KEY_STAGES, SUBJECTS from SDK
   - Using SDK type guards: isKeyStage, isSubject
   - File: `src/organa/mcp/validators/tool-validators.ts`

2. ⚠️ **Created Metadata Registry (NEEDS REFACTORING)**:
   - Created metadata structure but with MANUAL API paths ❌
   - **CRITICAL ISSUE**: Contains hardcoded API endpoints
   - **MUST BE FIXED**: All API data must come from SDK
   - Files to refactor: `src/chorai/tool-metadata/registry.ts`

3. ✅ **Fixed Build Configuration**:
   - Updated tsup config to exclude test files from entry patterns
   - Added .prettierignore for generated files
   - All quality gates passing

4. ✅ **Updated Phase 6 Plan**:
   - Incorporated SDK Zod validator integration strategy
   - Clear timeline with parallel work opportunities
   - Risk mitigation updated with current status

#### Phase 6.5.2: Fix Critical Issues & Programmatic Architecture (After SDK Ready)

**CRITICAL: Fix Build Errors First** ✅:
1. ~~Fix TypeScript compilation errors in `chorai/aither/index.ts`~~
2. ~~Update tsup config to multi-entry approach~~
3. ~~Standardise package.json scripts~~

**New Architecture for Programmatic Generation**:
```
organa/
├── curriculum/
│   └── operations/
│       └── [existing operation files]  # Keep as-is for business logic
└── mcp/
    ├── tool-generator/
    │   ├── schema-parser.ts        # Parse SDK's OpenAPI schema
    │   ├── tool-factory.ts         # Generate Tool objects from paths
    │   ├── type-mapper.ts          # Map OpenAPI types to JSON Schema
    │   └── metadata.ts             # Tool descriptions and examples
    ├── generated/
    │   └── tools.generated.ts      # Auto-generated tool definitions
    └── tools/
        ├── index.ts                # Re-export generated + custom tools
        └── custom-tools.ts         # Composite/convenience tools only
```

**Programmatic Generation Strategy (Leveraging SDK Zod Exports)**:
1. Import SDK's exported constants directly (KEY_STAGES, SUBJECTS, PATHS) ✅
2. Use SDK's `toolGeneration.PATH_OPERATIONS` for operation discovery ✨ NEW
3. Use SDK's `toolGeneration.PARAM_TYPE_MAP` for JSON Schema generation ✨ NEW  
4. Use SDK's `validation.validateRequest` for runtime validation ✨ NEW
5. Use SDK's `toolGeneration.parsePathTemplate` for consistent tool naming ✨ NEW
6. Add custom metadata layer for descriptions and examples
7. Support manual override for composite/convenience tools

#### Phase 6.5.3: Tool Generator Implementation (After SDK Ready)

**Core Generator Components**:

1. **Schema Parser** (`schema-parser.ts`) - SIMPLIFIED with SDK exports:
```typescript
import { toolGeneration } from '@oaknational/oak-curriculum-sdk';

export function getOperationMetadata(path: string, method: 'get' | 'post') {
  // Use SDK's pre-parsed operation metadata
  const operation = toolGeneration.PATH_OPERATIONS.find(
    op => op.path === path && op.method === method
  );
  
  if (!operation) {
    throw new Error(`Operation not found: ${method.toUpperCase()} ${path}`);
  }
  
  return {
    operationId: operation.operationId,
    parameters: operation.parameters,
    summary: operation.summary,
    description: operation.description,
  };
}
```

2. **Tool Factory** (`tool-factory.ts`) - ENHANCED with SDK helpers:
```typescript
import { toolGeneration } from '@oaknational/oak-curriculum-sdk';

export function generateToolFromPath(
  path: string,
  method: 'get' | 'post',
  metadata: ToolMetadata
): Tool {
  const operation = getOperationMetadata(path, method);
  const { toMcpToolName } = toolGeneration.parsePathTemplate(path, method);
  
  return {
    name: metadata.toolName || toMcpToolName(), // Use SDK's naming convention
    description: metadata.description || operation.summary || operation.description,
    inputSchema: {
      type: 'object',
      properties: generatePropertiesFromParams(operation.parameters),
      required: operation.parameters.filter(p => p.required).map(p => p.name),
    },
  };
}

function generatePropertiesFromParams(params: ParameterMetadata[]) {
  const properties: Record<string, any> = {};
  
  for (const param of params) {
    // Use SDK's PARAM_TYPE_MAP for consistent JSON Schema
    if (param.name in toolGeneration.PARAM_TYPE_MAP) {
      properties[param.name] = toolGeneration.PARAM_TYPE_MAP[param.name];
    } else {
      properties[param.name] = {
        type: param.schema?.type || 'string',
        description: param.description,
      };
    }
  }
  
  return properties;
}
```

3. **Type Mapper** (`type-mapper.ts`) - REPLACED by SDK's PARAM_TYPE_MAP:
```typescript
import { toolGeneration, KEY_STAGES, SUBJECTS } from '@oaknational/oak-curriculum-sdk';

// NO LONGER NEEDED - SDK provides PARAM_TYPE_MAP!
// Just use toolGeneration.PARAM_TYPE_MAP directly:
// - toolGeneration.PARAM_TYPE_MAP.keyStage = { type: 'string', enum: KEY_STAGES }
// - toolGeneration.PARAM_TYPE_MAP.subject = { type: 'string', enum: SUBJECTS }
// - toolGeneration.PARAM_TYPE_MAP.lesson = { type: 'string', pattern: '^[a-z0-9-]+$' }

// Only needed for custom parameter types not in SDK:
export function getCustomParameterSchema(paramName: string, paramSchema: any) {
  // Check SDK first
  if (paramName in toolGeneration.PARAM_TYPE_MAP) {
    return toolGeneration.PARAM_TYPE_MAP[paramName];
  }
  
  // Fallback for any custom parameters
  return {
    type: paramSchema?.type || 'string',
    description: paramSchema?.description,
  };
}
```

#### Phase 6.5.4: Metadata Configuration (NEEDS REDESIGN)

**Tool Metadata Strategy** - ⚠️ CRITICAL REDESIGN NEEDED:

**Problem**: Current implementation has hardcoded API paths which prevents automatic adaptation to API changes.

**Solution**: Metadata must be keyed by operationId (stable) not paths (can change):

```typescript
// CORRECT: Decorative metadata only, keyed by operationId from SDK
export const TOOL_METADATA: Record<string, ToolMetadata> = {
  'getLessonTranscript': {  // operationId from SDK, not path!
    description: 'Get the video transcript for a lesson with timestamps',
    category: 'lesson-content',
    priority: 'critical',
    examples: ['Get transcript for lesson "adding-fractions-2"'],
  },
  '/search/lessons': {
    toolName: 'oak-search-lessons',
    description: 'Search for lessons across the curriculum',
    category: 'search',
    priority: 'critical',
    features: ['pagination', 'filtering'],
  },
  // ... metadata for all endpoints
};
```

#### Phase 6.5.5: Generation Script (After SDK Ready)

**Build-time Generation** (`scripts/generate-tools.ts`) - ENHANCED with SDK helpers:
```typescript
import { toolGeneration } from '@oaknational/oak-curriculum-sdk';
import { generateToolFromPath } from '../tool-generator/tool-factory';
import { TOOL_METADATA } from '../tool-generator/metadata';

const tools: Tool[] = [];

// Use SDK's PATH_OPERATIONS for comprehensive coverage
for (const operation of toolGeneration.PATH_OPERATIONS) {
  const metadata = TOOL_METADATA[operation.path] || {};
  
  // Generate MCP tool using SDK helpers
  const tool = generateToolFromPath(
    operation.path,
    operation.method,
    {
      ...metadata,
      // Fallback to SDK-provided descriptions
      description: metadata.description || operation.summary || operation.description,
    }
  );
  
  tools.push(tool);
}

// Write to generated file with source tracking
fs.writeFileSync(
  'src/organa/mcp/generated/tools.generated.ts',
  `// AUTO-GENERATED - DO NOT EDIT
// Generated from Oak Curriculum SDK v${sdkVersion}
// Source: PATH_OPERATIONS from @oaknational/oak-curriculum-sdk
// Generated: ${new Date().toISOString()}

import type { Tool } from '@modelcontextprotocol/sdk/types.js';

export const GENERATED_TOOLS: Tool[] = ${JSON.stringify(tools, null, 2)} as const;

export const TOOL_COUNT = ${tools.length} as const;
`
);
```

#### Phase 6.5.6: Custom Composite Tools (PARTIALLY DESIGNED)

**Manual Composite Tools** (`custom-tools.ts`):
```typescript
// These cannot be auto-generated as they combine multiple API calls
export const COMPOSITE_TOOLS: Tool[] = [
  {
    name: 'oak-get-lesson-complete',
    description: 'Get complete lesson data including transcript, quiz, and assets',
    inputSchema: {
      type: 'object',
      properties: {
        lessonSlug: { type: 'string' },
        includeTranscript: { type: 'boolean', default: true },
        includeQuiz: { type: 'boolean', default: true },
        includeAssets: { type: 'boolean', default: true },
      },
      required: ['lessonSlug'],
    },
  },
  // Other composite tools...
];
```

#### Phase 6.5.7: Runtime Validation Integration (After SDK Ready)

**MCP Handler with SDK Validation**:
```typescript
import { validation } from '@oaknational/oak-curriculum-sdk';
import type { ToolCallHandler } from '@modelcontextprotocol/sdk/types.js';

export const handleToolCall: ToolCallHandler = async (toolName, args) => {
  // Map tool name to path and method
  const { path, method } = toolNameToOperation(toolName);
  
  // Use SDK's runtime validation for inputs
  const inputValidation = validation.validateRequest(path, method, args);
  if (!inputValidation.ok) {
    throw new McpValidationError('Invalid input', inputValidation.issues);
  }
  
  // Execute the operation
  const response = await executeOperation(path, method, inputValidation.value);
  
  // Use SDK's runtime validation for outputs
  const outputValidation = validation.validateResponse(path, method, 200, response);
  if (!outputValidation.ok) {
    throw new ApiResponseError('Invalid API response', outputValidation.issues);
  }
  
  return outputValidation.value;
};
```

#### Phase 6.5.8: Testing and Integration (After SDK Ready)

**Testing Strategy**:

1. **Unit Tests** (Per Operation):
   ```typescript
   describe('getLessonTranscript', () => {
     it('transforms API response to transcript format', () => {
       const apiResponse = { /* mock data */ };
       const result = transformTranscriptResponse(apiResponse);
       expect(result).toHaveProperty('content');
       expect(result).toHaveProperty('duration');
     });
   });
   ```

2. **Integration Tests** (Per Tool Domain):
   ```typescript
   describe('Lesson Tools Integration', () => {
     it('registers all lesson tools correctly', () => {
       const tools = getLessonTools();
       expect(tools).toHaveLength(8);
       expect(tools[0].name).toBe('oak-get-lesson-transcript');
     });
   });
   ```

3. **E2E Tests** (Critical Paths):
   ```typescript
   describe('Lesson Discovery Journey', () => {
     it('search → get lesson → get transcript', async () => {
       // Test complete user journey
     });
   });
   ```

### Implementation Guidelines (Updated for SDK Zod Integration)

#### Critical Requirement: No Manual API Data Structures

**Principle**: The MCP must automatically adapt to API changes flowing through the SDK.

**Rules**:
1. **NO hardcoded API paths** in MCP code
2. **NO manual parameter definitions** - use SDK exports
3. **NO manual type definitions** - use SDK generated types
4. **ONLY decorative metadata** allowed (descriptions, examples, categories)
5. **Metadata keyed by operationId** (stable) not paths (can change)

**Correct Pattern**:
```typescript
// Tool generation gets ALL API data from SDK
const tool = generateToolFromSDK(operation);

// Metadata ONLY adds human-friendly decoration
const metadata = TOOL_METADATA[operation.operationId];
if (metadata) {
  tool.description = metadata.description || tool.description;
  tool.examples = metadata.examples;
  tool.category = metadata.category;
}
```

#### SDK Zod Integration Timeline

**Phase 1: Wait for SDK Deliverables** (External dependency)
- SDK team implements Zod validators plan
- SDK team adds `validation` namespace with runtime validators
- SDK team adds `toolGeneration` namespace with generation helpers
- SDK team generates TypeDoc API documentation

**Phase 2: MCP Integration** (Our work, after SDK ready)
- Update MCP imports to use new SDK exports
- Replace manual validators with SDK's `validation` functions
- Refactor tool generation to use `toolGeneration` helpers
- Remove all duplicated constants and types

#### Programmatic Tool Generation Pattern (Enhanced)

Tools are now generated programmatically from SDK exports (ENHANCED with Zod validators):

```typescript
// 1. Import SDK Constants and NEW Helpers (NO DUPLICATION!)
import { 
  // Existing exports
  PATHS,
  KEY_STAGES,
  SUBJECTS,
  isValidPath,
  
  // NEW exports from Zod implementation
  schema,                    // Raw OpenAPI schema
  validation,               // Runtime validation functions
  toolGeneration,          // Generation helpers
} from '@oaknational/oak-curriculum-sdk';

// 2. Generate Tool at Build Time (SIMPLIFIED with SDK helpers)
function generateTools() {
  return toolGeneration.PATH_OPERATIONS.map(operation => {
    const { toMcpToolName } = toolGeneration.parsePathTemplate(
      operation.path, 
      operation.method
    );
    
    return {
      name: toMcpToolName(),
      description: operation.summary || operation.description,
      inputSchema: {
        type: 'object',
        properties: buildPropertiesFromParams(operation.parameters),
        required: operation.parameters
          .filter(p => p.required)
          .map(p => p.name),
      },
    };
  });
}

function buildPropertiesFromParams(params) {
  const properties = {};
  params.forEach(param => {
    // Use SDK's PARAM_TYPE_MAP for consistent schemas
    properties[param.name] = toolGeneration.PARAM_TYPE_MAP[param.name] || {
      type: param.schema?.type || 'string',
      description: param.description,
    };
  });
  return properties;
}

// 3. Use SDK's Zod Validators for Runtime Validation (NEW!)
export function validateToolInput(toolName: string, input: unknown) {
  const { path, method } = toolNameToOperation(toolName);
  
  // Use SDK's new Zod-based validation
  const result = validation.validateRequest(path, method, input);
  
  if (!result.ok) {
    throw new McpValidationError(
      `Invalid input for ${toolName}`,
      result.issues
    );
  }
  
  return result.value; // Type-safe, validated input
}

// 4. Validate API Responses (NEW!)
export function validateApiResponse(
  toolName: string, 
  status: number,
  data: unknown
) {
  const { path, method } = toolNameToOperation(toolName);
  
  // Use SDK's response validation
  const result = validation.validateResponse(path, method, status, data);
  
  if (!result.ok) {
    throw new ApiResponseError(
      `Invalid API response for ${toolName}`,
      result.issues
    );
  }
  
  return result.value; // Type-safe, validated response
}

// 5. Operations Still Use Pure Functions
export function transformLessonResponse(
  apiResponse: ApiLessonResponse
): LessonResult {
  // Business logic transformation remains pure
  return {
    id: apiResponse.lesson_uid,
    title: apiResponse.lesson_title,
    // ... transformation logic
  };
}
```

### Tool Priority and Implementation Order

#### Critical Priority (Most Valuable) - Day 1
1. `/lessons/{lesson}/transcript` - **Get lesson transcript** ⭐
2. `/lessons/{lesson}/summary` - Get lesson summary
3. `/lessons/{lesson}/quiz` - Get lesson quiz questions
4. `/subjects/{subject}` - Get specific subject details
5. `/key-stages/{keyStage}/subject/{subject}/lessons` - List lessons by key stage and subject

#### High Priority (Frequently Useful) - Day 2
6. `/key-stages/{keyStage}/subject/{subject}/units` - Get units for key stage/subject
7. `/units/{unit}/summary` - Get unit summary
8. `/search/transcripts` - Search within transcripts
9. `/lessons/{lesson}/assets` - Get lesson assets (presentations, worksheets)
10. `/subjects/{subject}/key-stages` - Get key stages for a subject

#### Medium Priority (Specialised Use) - Day 2-3
11. `/sequences/{sequence}/units` - Get sequence units
12. `/subjects/{subject}/sequences` - Get subject sequences
13. `/subjects/{subject}/years` - Get subject years
14. `/threads` - Get threads
15. `/threads/{threadSlug}/units` - Get thread units
16. `/key-stages/{keyStage}/subject/{subject}/questions` - Get questions
17. `/sequences/{sequence}/questions` - Get sequence questions

#### Low Priority (Administrative/Metadata) - Day 3
18. `/changelog` - Get changelog
19. `/changelog/latest` - Get latest changelog
20. `/rate-limit` - Get rate limit info
21. `/key-stages/{keyStage}/subject/{subject}/assets` - Get assets by key stage/subject
22. `/sequences/{sequence}/assets` - Get sequence assets
23. `/lessons/{lesson}/assets/{type}` - Get specific asset type

#### Convenience Tools (New) - Day 3
24. `oak-get-lesson-complete` - Get lesson metadata + transcript + quiz (composite tool)
25. `oak-get-subject-overview` - Subject + key stages + units
26. `oak-get-unit-complete` - Unit + lessons + resources

### Success Metrics

**SDK Zod Integration Metrics** (NEW):
- [ ] SDK's `validation` namespace successfully imported
- [ ] SDK's `toolGeneration` namespace successfully imported  
- [ ] All MCP validators replaced with SDK's `validateRequest`
- [ ] All response validation uses SDK's `validateResponse`
- [ ] Tool generation uses `PATH_OPERATIONS` not manual parsing
- [ ] JSON schemas use `PARAM_TYPE_MAP` not manual mapping
- [ ] Tool names use `parsePathTemplate` for consistency

**Programmatic Generation Metrics** (ENHANCED):
- [ ] Zero manual duplication of SDK constants ✅
- [ ] 100% of SDK paths auto-generate MCP tools via `PATH_OPERATIONS`
- [ ] Tool schemas derived from SDK's `PARAM_TYPE_MAP`
- [ ] SDK updates trigger automatic tool regeneration
- [ ] Runtime validation via SDK's Zod validators

**Build Health** ✅ (COMPLETED):
- [x] TypeScript compilation errors fixed
- [x] tsup multi-entry configuration implemented
- [x] Package.json scripts standardised
- [x] All quality gates passing (format → type-check → lint → test → build)

**Coverage Metrics**:
- [ ] 100% of SDK endpoints have MCP tools (programmatically guaranteed)
- [ ] Generated tools have automated tests
- [ ] Composite tools have manual tests
- [ ] Tool generation completeness test added
- [ ] E2E tests for critical user journeys

**Quality Metrics**:
- [ ] Zero ESLint warnings
- [ ] TypeScript strict mode
- [ ] Complexity < 8
- [ ] Functions < 50 lines
- [ ] No eslint-disable comments
- [ ] No type assertions
- [ ] No manual type definitions that exist in SDK

**Testing Strategy** (Adapted for Programmatic):
- [ ] Test generator functions, not generated output
- [ ] Test metadata configuration completeness
- [ ] Test composite tool integration
- [ ] Validate generated schemas against SDK types

**Documentation**:
- [ ] Tool descriptions pulled from OpenAPI spec
- [ ] Input schemas auto-documented from SDK
- [ ] Custom metadata adds examples and categories
- [ ] Generated file includes source references

### Benefits of SDK Zod Integration

**New Benefits from Zod Validators**:
- **Runtime Safety**: Zod validators catch errors at runtime, not just compile time
- **Better Error Messages**: Zod provides detailed validation error messages
- **Request Validation**: Automatic validation of all MCP tool inputs
- **Response Validation**: Automatic validation of all API responses
- **Reduced Code**: No need to write any validation logic in MCP
- **Type Inference**: Zod schemas provide automatic TypeScript type inference
- **Single Source of Truth**: Validation logic lives in SDK, not duplicated

### Benefits of Programmatic Approach (Original)

**Maintenance Benefits**:
- **Single Source of Truth**: SDK is the authoritative source for all API details
- **Zero Drift**: Tool definitions always match current API specification
- **Automatic Updates**: SDK changes propagate automatically to MCP tools
- **Reduced Errors**: No manual transcription errors or typos

**Development Benefits**:
- **Faster Implementation**: Generate 25+ tools in minutes, not days
- **Consistent Patterns**: All tools follow identical structure
- **Type Safety**: Full TypeScript support from SDK types
- **Less Code**: Estimated 80% reduction in hand-written code

**Quality Benefits**:
- **Guaranteed Coverage**: Every SDK endpoint gets a tool automatically
- **Consistent Validation**: Use SDK's battle-tested type guards
- **Better Testing**: Test generators once, not each tool individually
- **Documentation Sync**: Descriptions come directly from API spec

### Risk Mitigation (Updated for SDK Zod Integration)

| Risk | Mitigation | Priority | Status |
|------|------------|----------|--------|
| SDK Zod Delivery Delay | Clear dependency tracking, can start metadata work | HIGH | ⏳ Waiting |
| Breaking Changes in SDK | Additive-only policy, version pinning | CRITICAL | ✅ Addressed |
| Validation Performance | Opt-in validation, lazy loading | MEDIUM | ✅ Planned |
| SDK Schema Changes | Regenerate tools on SDK update | CRITICAL | ✅ Planned |
| Missing Tool Metadata | Comprehensive metadata registry | HIGH | 🔄 Can start now |
| Generator Complexity | Use SDK helpers to simplify | HIGH | ✅ Simplified |
| Generated Code Quality | Add prettier formatting to generation | MEDIUM | 📝 Planned |
| Composite Tool Sync | Clear separation between generated and manual | MEDIUM | ✅ Designed |
| Type Mismatches | Use SDK's PARAM_TYPE_MAP directly | HIGH | ✅ Solved |
| Debugging Generated Code | Include source maps and comments | LOW | 📝 Planned |

### Timeline (Revised for SDK Zod Integration)

#### Phase A: SDK Work (External - In Progress)
- **Status**: 🔄 SDK team implementing Zod validators plan
- **Expected**: SDK releases with `validation` and `toolGeneration` namespaces

#### Phase B: Parallel MCP Preparation (✅ COMPLETED)
- **Day 0**: ✅ Update Phase 6 plan for SDK integration
- **Day 0.5**: ✅ Create comprehensive metadata registry
- **Day 1**: ✅ Fix MCP validators to use SDK constants
- **Day 1.5**: ✅ Fix build configuration issues

#### Phase C: SDK Integration (After SDK Ready)
- **Day 2**: Integrate new SDK exports (`validation`, `toolGeneration`)
- **Day 2.5**: Replace manual validators with SDK validators
- **Day 3**: Implement tool generator using SDK helpers
- **Day 3.5**: Generate all tools, validate output
- **Day 4**: Comprehensive testing with runtime validation
- **Day 4.5**: Documentation and examples
- **Day 5**: Performance validation and final review

### Sub-Agent Review Findings (2025-08-12)

**Original Issues - Now Resolved by SDK Zod Plan**:

**✅ RESOLVED via SDK Zod Implementation**:
1. ~~SDK Constants Mismatch~~ → SDK verified correct, MCP had wrong values
2. ~~Missing Schema Export~~ → SDK will export `schema` object
3. ~~Type Boundary Issues~~ → SDK provides `PARAM_TYPE_MAP` for JSON Schema

**✅ RESOLVED via Parallel Work**:
4. ~~Build Config Issues~~ → Tsup config fixed, .prettierignore added
5. ~~Manual Constants~~ → MCP validators now use SDK imports

**🟡 Design Improvements Still Required**:
6. **Architecture Violations**: Direct imports instead of dependency injection
7. **Generation in Wrong Layer**: Should be in chorai, not organa
8. **Test Strategy Gaps**: Need tests for generators themselves

**✨ NEW from SDK Zod Plan**:
8. **Runtime Validation**: Now available via `validation` namespace
9. **Tool Generation Helpers**: `PATH_OPERATIONS`, `parsePathTemplate`
10. **Type Safety**: Zod schemas provide runtime + compile-time safety

### Next Actions (Prioritised for SDK Integration)

**Phase A: SDK Prerequisites**:
1. ✅ Create implementation plan
2. ✅ Update Phase 6 documentation  
3. ✅ Review plan with sub-agents
4. ✅ Verify SDK constants (SDK is correct!)
5. ✅ SDK schema export (being added by SDK team)
6. 🔄 SDK Zod implementation (SDK team working)

**Phase B: Parallel Work (MOSTLY COMPLETED)**:
7. ⚠️ Create metadata registry (created but needs refactoring - no hardcoded paths)
8. ✅ Fix MCP validators to use SDK constants
9. ✅ Create .prettierignore for generated files
10. ✅ Fix tsup config to exclude test files
11. ✅ Update Phase 6 plan with completed work

**Phase B2: Remaining Parallel Work**:
12. 🟡 Design composite tools architecture
13. 🟡 Move generation logic to chorai layer
14. 🟡 Set up dependency injection pattern

**Phase C: After SDK Ready**:
15. ⏳ Integrate SDK's `validation` namespace
16. ⏳ Integrate SDK's `toolGeneration` namespace
17. ⏳ Refactor metadata registry to use operationIds from SDK
18. ⏳ Build tool generator using SDK helpers
19. ⏳ Generate and validate all tools
20. ⏳ Test with runtime validation
21. ⏳ Update documentation

## 📊 Phase Summary

| Sub-phase | Status | Description |
|-----------|--------|-------------|
| 6.1 SDK Foundation | ✅ COMPLETED | Type generation, client implementation |
| 6.2 MCP Server Base | ✅ COMPLETED | Biological architecture, 4 tools |
| 6.3 Build Configuration | ✅ COMPLETED | Multi-entry tsup config |
| 6.4 Pagination | ✅ VERIFIED | Already supported by API |
| **6.5 Full Tool Coverage** | **🚧 IN PROGRESS** | **Parallel work completed, waiting for SDK** |

## 🎯 Overall Phase 6 Goal

Create a production-ready Oak Curriculum ecosystem with:
- Type-safe SDK for direct API access
- Comprehensive MCP server for AI assistant integration
- Full coverage of curriculum content and resources
- Zero technical debt, comprehensive testing
- Clear documentation and examples

The completion of Phase 6.5 will provide Claude and other AI assistants with complete access to Oak National Academy's educational content, enabling rich educational interactions and lesson planning capabilities.

## 📈 Phase 6.5 Completion Status (2025-08-12)

### ✅ Completed Work
1. **MCP Validators Fixed**: Now using SDK constants (KEY_STAGES, SUBJECTS)
2. **Build Configuration Fixed**: tsup and prettier properly configured
3. **Phase 6 Plan Updated**: Comprehensive integration strategy documented
4. **Quality Gates Passing**: All tests, linting, and type checks passing

### ⚠️ Work Needing Redesign
1. **Metadata Registry**: Created but contains hardcoded API paths - must be refactored to use operationIds from SDK only

### 🔄 In Progress
1. **SDK Zod Validators**: SDK team implementing (external dependency)
2. **Waiting for SDK Exports**: `validation` and `toolGeneration` namespaces

### 📋 Ready to Start (After SDK)
1. **Tool Generator Implementation**: Use SDK helpers for generation
2. **Runtime Validation Integration**: Use SDK's Zod validators
3. **Generate All Tools**: 25+ tools from SDK exports
4. **E2E Testing**: Complete user journey tests

### 🎯 Next Immediate Actions
Once SDK delivers the Zod validators:
1. Integrate new SDK exports
2. Build tool generator using SDK helpers
3. Generate and test all 25+ tools
4. Deploy comprehensive MCP server

**Estimated Time to Completion**: 2-3 days after SDK delivery