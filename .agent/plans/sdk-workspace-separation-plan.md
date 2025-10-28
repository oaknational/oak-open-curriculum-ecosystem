# SDK Workspace Separation Plan

## Core References

- [GO.md](../../GO.md)
- [AGENT.md](../directives-and-memory/AGENT.md)
- [rules.md](../directives-and-memory/rules.md)
- [Schema-First Execution Directive](../directives-and-memory/schema-first-execution.md) - **MANDATORY**
- [ADR-029: No Manual API Data](../../docs/architecture/architectural-decisions/029-no-manual-api-data.md)
- [ADR-030: SDK as Single Source of Truth](../../docs/architecture/architectural-decisions/030-sdk-single-source-truth.md)
- [ADR-031: Generation-Time Extraction](../../docs/architecture/architectural-decisions/031-generation-time-extraction.md)
- [ADR-038: Compilation-Time Revolution](../../docs/architecture/architectural-decisions/038-compilation-time-revolution.md)

## Intent

Separate the Oak Curriculum SDK into two distinct workspaces with clear separation of concerns:

1. **`@oaknational/oak-curriculum-sdk-generation`**: OpenAPI schema → TypeScript types, validators, constants
2. **`@oaknational/oak-curriculum-sdk-runtime`**: API client implementation using generated artifacts

This separation reduces complexity by establishing a clean architectural boundary: the generation workspace produces types as a build artifact, and the runtime workspace consumes these types through a well-defined public API. The top-level `pnpm build` command orchestrates both workspaces in sequence, eliminating the need for a separate `type-gen` step at the repository level.

## Core Principle: Move and Expose, Don't Modify

**This is a reorganization, not a refactor.** The implementation follows a strict principle:

1. **Generated code is moved as-is** - No modifications to generated files. They move from `sdk/src/types/generated/` to `sdk-generation/src/types/` unchanged.

2. **Type-gen code is moved as-is** - Generator scripts move from `sdk/type-gen/` to `sdk-generation/type-gen/` unchanged. Generation logic remains identical.

3. **Runtime code updates only imports** - Runtime files change import paths but not their logic. `import from './types/generated/X'` becomes `import from '@oaknational/oak-curriculum-sdk-generation'`.

4. **Only new code is the public API** - The sole new file is `sdk-generation/src/index.ts` (barrel export). This is pure re-export, no new logic.

5. **Build output remains identical** - After separation, `pnpm build` produces functionally identical artifacts. The only difference is package boundaries.

**What this is NOT:**

- ❌ Refactoring generated code structure
- ❌ Changing generation logic or templates
- ❌ Modifying runtime behavior
- ❌ Introducing new abstractions or wrappers
- ❌ Optimizing or improving existing code

**What this IS:**

- ✅ Moving files between workspaces
- ✅ Creating a public API barrel export
- ✅ Updating import paths
- ✅ Establishing workspace boundaries
- ✅ Enforcing encapsulation via ESLint

## Schema-First Execution Compliance

This plan **strictly adheres** to the [Schema-First Execution Directive](../directives-and-memory/schema-first-execution.md):

1. **Generated artifacts remain the single source of truth**: The generation workspace produces all tool descriptors, validators, and type definitions from the OpenAPI schema. The runtime workspace acts only as a thin facade.

2. **No runtime duplication**: Runtime code in `sdk-runtime` never duplicates validation logic, type inference, or schema processing. It imports and delegates to generated artifacts.

3. **Preserved execution flow**: The mandatory flow (Contract → Definitions → Aliases → Runtime → Facade) is maintained across workspace boundaries:
   - **Contract**: `ToolDescriptor<TName, TClient, TArgs, TResult>` in generation workspace
   - **Definitions**: `MCP_TOOL_DESCRIPTORS` map exported from generation public API
   - **Aliases**: `ToolArgsForName`, `ToolResultForName`, etc. exported from generation
   - **Runtime**: Generated helpers (`callTool`, `executeDescriptor`) in generation workspace
   - **Facade**: Thin wrappers in runtime workspace (`execute-tool-call.ts`)

4. **Public API includes all schema-first components**: The generation workspace public API exports:
   - Tool descriptors and registry
   - Generated executors and validators
   - Type aliases that preserve exact types from schema
   - No type widening or union collapsing

5. **Generator-first changes**: Any modifications to tool execution behavior must be made to generator templates in `sdk-generation/type-gen/typegen/mcp-tools/`, never in runtime code.

## Success Criteria

- **Clean workspace separation**: Generation and runtime code live in distinct workspaces
- **Public API enforcement**: Runtime imports only from generation package root, never from internal paths
- **Simplified build pipeline**: Single `pnpm build` command orchestrates type-gen → build for generation, then build for runtime
- **Preserved ADR-030 contract**: Schema changes → `pnpm build` → all consuming applications receive updated types
- **Zero consumer impact**: Applications using `@oaknational/oak-curriculum-sdk` require no code changes
- **Encapsulation**: Generation workspace can refactor internal structure without breaking runtime
- **Documentation completeness**: Clear API contracts, migration guide, architectural decision recorded

## Success Metrics

- **Build orchestration**: Turbo automatically sequences generation before runtime with zero manual intervention
- **Import compliance**: ESLint rule enforces no deep imports; 100% of runtime imports come from generation package root
- **Type safety**: Full TypeScript compilation passes for both workspaces and all consuming applications
- **Test coverage**: All existing tests pass without modification; no test suites require updates
- **Build time**: Total build time remains within ±10% of current duration
- **Package size**: Runtime package size reduced by >30% (no type-gen code in published artifact)
- **Consumer transparency**: Apps continue to import from `@oaknational/oak-curriculum-sdk` with identical API surface

## Milestones

| Milestone                     | Description                                                                        | Exit Criteria                                                                                         |
| ----------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **M1 – Architecture Design**  | Design public API surface, validate workspace structure, create ADR                | Public API documented in generation/src/index.ts; workspace dependency graph defined; ADR-0XX drafted |
| **M2 – Generation Workspace** | Create sdk-generation workspace with type-gen code and comprehensive barrel export | Package builds successfully; all generated types exported from root; documentation complete           |
| **M3 – Runtime Workspace**    | Update sdk-runtime to consume generation package through public API only           | All imports updated; ESLint rule enforces boundaries; runtime builds with generation as dependency    |
| **M4 – Monorepo Integration** | Update pnpm workspace, Turbo config, root scripts                                  | `pnpm build` orchestrates correctly; all consuming apps build successfully                            |
| **M5 – Testing & Validation** | Execute full test suite, validate consuming applications, document migration       | All tests pass; apps build and run; migration guide complete; ADR published                           |

## Phase 1: Architecture & Design

### 1.1 Document Current Architecture

**Objective**: Understand current coupling between generation and runtime systems.

**Tasks**:

- [x] Map all imports from `src/types/generated/` in runtime code
- [x] Identify all public exports currently provided by SDK
- [x] Document generator dependencies vs runtime dependencies
- [x] Analyze which generated artifacts are used where

**Deliverables**:

- Architecture analysis document (completed in analysis phase)
- Dependency graph showing generation → runtime flows

### 1.2 Design Public API Surface

**Objective**: Define comprehensive public API for generation workspace that fully supports runtime needs.

**Tasks**:

- [ ] Audit all current imports from `src/types/generated/` across:
  - `src/client/`
  - `src/validation/`
  - `src/mcp/`
  - `src/response-augmentation.ts`
  - `src/types/search-response-guards.ts`
- [ ] Group exports into logical categories:
  - OpenAPI core types (paths, components)
  - Path parameters & constants (KEY_STAGES, SUBJECTS)
  - Operations (PATH_OPERATIONS, OPERATIONS_BY_ID)
  - MCP tools (toolNames, getToolFromToolName, descriptors)
  - Zod schemas (curriculumSchemas, response validators)
  - Search types (request/response schemas, scopes, facets)
  - URL helpers (generateCanonicalUrl)
  - Observability types (zero-hit telemetry)
  - Admin types (stream fixtures)
- [ ] Create comprehensive `src/index.ts` barrel export with JSDoc
- [ ] Design package.json exports (root only, no subpaths)

**Critical requirement - Schema-First Execution Components**:

The public API MUST export all components required for schema-first execution:

```typescript
// Contract
export type { ToolDescriptor } from './types/api-schema/mcp-tools/contract/tool-descriptor.contract.js';

// Definitions
export {
  MCP_TOOL_DESCRIPTORS,
  getToolFromToolName,
} from './types/api-schema/mcp-tools/generated/data/definitions.js';

// Aliases
export type {
  ToolArgsForName,
  ToolClientForName,
  ToolResultForName,
  ToolArgs,
  ToolResult,
} from './types/api-schema/mcp-tools/generated/aliases/types.js';

// Runtime executors
export {
  callTool,
  executeDescriptor,
  listAllToolDescriptors,
} from './types/api-schema/mcp-tools/generated/runtime/execute.js';

// Registry and helpers
export {
  McpToolRegistry,
  createMcpToolRegistry,
  attachMcpHandlers,
} from './types/api-schema/mcp-tools/generated/runtime/lib.js';
```

**Deliverables**:

- `packages/sdks/oak-curriculum-sdk-generation/src/index.ts` (complete public API)
- Public API documentation in generation workspace README
- List of internal paths that will become private implementation details
- Schema-first execution component checklist verified

### 1.3 Define Workspace Structure

**Objective**: Plan directory structure and dependencies for both workspaces.

**Structure**:

```
packages/sdks/
├── oak-curriculum-sdk-generation/
│   ├── package.json
│   │   name: @oaknational/oak-curriculum-sdk-generation
│   │   dependencies: zod, openapi-fetch
│   │   devDependencies: openapi-typescript, openapi-zod-client, tsx
│   ├── type-gen/ (moved from current SDK)
│   ├── schema-cache/ (moved from current SDK)
│   ├── src/
│   │   ├── index.ts (PUBLIC API BARREL)
│   │   └── types/ (moved from current SDK src/types/generated/)
│   ├── tsconfig.json
│   ├── tsup.config.ts
│   └── README.md
│
└── oak-curriculum-sdk-runtime/
    ├── package.json
    │   name: @oaknational/oak-curriculum-sdk
    │   dependencies:
    │     @oaknational/oak-curriculum-sdk-generation: workspace:*
    │     @oaknational/mcp-logger: workspace:*
    │     openapi-fetch, zod
    ├── src/
    │   ├── client/
    │   ├── validation/
    │   ├── mcp/
    │   ├── response-augmentation.ts
    │   └── index.ts (re-exports from generation + runtime functionality)
    ├── tsconfig.json
    ├── tsup.config.ts
    └── README.md
```

**Tasks**:

- [ ] Document file movement plan (what moves where)
- [ ] Define package.json for each workspace
- [ ] Design build scripts for each workspace
- [ ] Plan tsconfig.json inheritance structure

**Deliverables**:

- Workspace structure specification document
- package.json drafts for both workspaces
- Migration checklist

### 1.4 Create ADR

**Objective**: Document architectural decision and rationale.

**Tasks**:

- [ ] Write ADR-0XX: SDK Workspace Separation
- [ ] Document benefits:
  - Separation of concerns
  - Reduced complexity
  - Clear build pipeline
  - Reusability of generated types
  - Independent evolution
- [ ] Document trade-offs:
  - Import path changes (one-time refactor)
  - Two workspaces to maintain
  - Coordinated publishing for external consumers
- [ ] Document alternatives considered and why rejected

**Deliverables**:

- `docs/architecture/architectural-decisions/0XX-sdk-workspace-separation.md`

## Phase 2: Generation Workspace Creation

### 2.1 Create Workspace Structure

**Objective**: Establish generation workspace with all type-gen code.

**Tasks**:

- [ ] Create `packages/sdks/oak-curriculum-sdk-generation/` directory
- [ ] Move `type-gen/` directory from current SDK
- [ ] Move `schema-cache/` directory from current SDK
- [ ] Create initial package.json with correct dependencies
- [ ] Create tsconfig.json (extends tsconfig.base.json)
- [ ] Create tsup.config.ts for building

**Commands**:

```bash
mkdir -p packages/sdks/oak-curriculum-sdk-generation

# Move type-gen system
mv packages/sdks/oak-curriculum-sdk/type-gen \
   packages/sdks/oak-curriculum-sdk-generation/

# Move schema cache
mv packages/sdks/oak-curriculum-sdk/schema-cache \
   packages/sdks/oak-curriculum-sdk-generation/
```

**Validation**:

- Directory structure matches specification
- All type-gen scripts preserved

### 2.2 Move Generated Types

**Objective**: Relocate generated types to generation workspace source.

**CRITICAL**: Generated files are **moved unchanged**. Do not modify any generated file content during the move. This is a pure file relocation operation.

**Tasks**:

- [ ] Move `src/types/generated/` directory as-is to generation workspace
- [ ] Update type-gen scripts to output to new location (paths only, not logic)
- [ ] Verify all generation paths are correct
- [ ] Verify generated file contents are byte-for-byte identical after move
- [ ] Commit generated files in new location

**Commands**:

```bash
mkdir -p packages/sdks/oak-curriculum-sdk-generation/src

# Move generated types (contents unchanged)
mv packages/sdks/oak-curriculum-sdk/src/types/generated \
   packages/sdks/oak-curriculum-sdk-generation/src/types
```

**Validation**:

- All generated files present in new location
- Generated file contents identical to original (use `git diff` to verify)
- type-gen scripts generate to correct paths
- No changes to generated code structure or logic

### 2.3 Create Public API Barrel Export

**Objective**: Implement comprehensive barrel export with all runtime needs.

**Tasks**:

- [ ] Create `src/index.ts` with complete export surface (see Phase 1.2)
- [ ] Group exports by category with clear comments
- [ ] Add JSDoc for each export category
- [ ] Ensure all exports are properly typed
- [ ] Validate no circular dependencies

**Key Sections**:

```typescript
// OpenAPI Core Types
export type { paths, components } from './types/api-schema/api-paths-types.js';

// Path Parameters & Constants
export {
  KEY_STAGES,
  SUBJECTS,
  ASSET_TYPES,
  isKeyStage,
  isSubject,
} from './types/api-schema/path-parameters.js';

// MCP Tools
export {
  toolNames,
  getToolFromToolName,
  type ToolDescriptor,
} from './types/api-schema/mcp-tools/index.js';

// Zod Schemas
export { curriculumSchemas } from './types/zod/curriculumZodSchemas.js';

// Search Types
export { SearchLessonsResponseSchema, type SearchScope } from './types/search/index.js';

// ... (see full public API in architecture section)
```

**Validation**:

- All exports resolve correctly
- TypeScript compilation succeeds
- No export conflicts or ambiguities

### 2.4 Configure Build System

**Objective**: Set up type-gen and build scripts for generation workspace.

**package.json scripts**:

```json
{
  "scripts": {
    "type-gen": "tsx type-gen/typegen.ts && tsx type-gen/zodgen.ts",
    "posttype-gen": "pnpm -w format:root",
    "build": "tsup && tsc --emitDeclarationOnly",
    "clean": "rm -rf dist .turbo src/types/generated"
  }
}
```

**tsup.config.ts**:

```typescript
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: false,
  bundle: false,
  platform: 'neutral',
  external: ['zod', 'openapi-fetch'],
  outDir: 'dist',
});
```

**Tasks**:

- [ ] Configure tsup to bundle from src/index.ts only
- [ ] Configure TypeScript to emit declarations
- [ ] Test type-gen script works in new location
- [ ] Test build produces correct output
- [ ] Verify dist/ contains only public API exports

**Validation**:

```bash
cd packages/sdks/oak-curriculum-sdk-generation
pnpm type-gen  # Generates types
pnpm build     # Builds package
ls dist/       # Should contain index.js, index.d.ts
```

### 2.5 Document Generation Workspace

**Objective**: Create comprehensive README for generation workspace.

**README.md sections**:

- Purpose: What this workspace does
- Public API: Overview of exports
- Usage: How to import types
- Development: How to regenerate types
- Internal Structure: What files are private
- Contributing: How to add new generated types

**Tasks**:

- [ ] Write README.md
- [ ] Document public API with examples
- [ ] Explain type-gen process
- [ ] Clarify what's public vs private
- [ ] Add troubleshooting section

**Validation**:

- README covers all key topics
- Examples are correct and testable

## Phase 3: Runtime Workspace Update

### 3.1 Rename Current SDK Workspace

**Objective**: Rename to oak-curriculum-sdk-runtime and update package.json.

**Tasks**:

- [ ] Rename directory
- [ ] Update package.json name (keep as `@oaknational/oak-curriculum-sdk`)
- [ ] Add dependency on generation workspace
- [ ] Remove type-gen related scripts
- [ ] Clean up devDependencies (remove openapi-typescript, etc.)

**Commands**:

```bash
mv packages/sdks/oak-curriculum-sdk \
   packages/sdks/oak-curriculum-sdk-runtime
```

**package.json changes**:

```json
{
  "name": "@oaknational/oak-curriculum-sdk",
  "dependencies": {
    "@oaknational/oak-curriculum-sdk-generation": "workspace:*",
    "@oaknational/mcp-logger": "workspace:*",
    "openapi-fetch": "^0.14.0",
    "zod": "^3"
  },
  "devDependencies": {
    // Remove: openapi-typescript, openapi-zod-client, openapi3-ts
  },
  "scripts": {
    "build": "tsup && tsc --emitDeclarationOnly",
    "clean": "rm -rf dist .turbo"
    // Remove: type-gen, generate:*, etc.
  }
}
```

**Validation**:

- Package renamed correctly
- Dependencies updated
- No unused devDependencies

### 3.2 Update All Runtime Imports

**Objective**: Change all imports to use generation package public API.

**CRITICAL**: This is an **import-only** change. Runtime file logic remains unchanged. Only the `import` statements at the top of files are modified. No changes to:

- Function implementations
- Class methods
- Variable assignments
- Control flow
- Type annotations (except import source)

**Import transformation pattern**:

```typescript
// BEFORE
import type { paths } from './types/generated/api-schema/api-paths-types.js';
import { KEY_STAGES, isKeyStage } from './types/generated/api-schema/path-parameters.js';
import { curriculumSchemas } from './types/generated/zod/curriculumZodSchemas.js';
import { getToolFromToolName } from './types/generated/api-schema/mcp-tools/index.js';

// AFTER - Only import source changes, symbols remain identical
import type { paths } from '@oaknational/oak-curriculum-sdk-generation';
import { KEY_STAGES, isKeyStage } from '@oaknational/oak-curriculum-sdk-generation';
import { curriculumSchemas } from '@oaknational/oak-curriculum-sdk-generation';
import { getToolFromToolName } from '@oaknational/oak-curriculum-sdk-generation';

// Rest of file unchanged - same logic, same implementations
```

**Files to update**:

- [ ] `src/client/oak-base-client.ts`
- [ ] `src/client/index.ts`
- [ ] `src/validation/types.ts`
- [ ] `src/validation/request-validators.ts`
- [ ] `src/validation/curriculum-response-validators.ts`
- [ ] `src/validation/search-response-validators.ts`
- [ ] `src/mcp/execute-tool-call.ts`
- [ ] `src/mcp/universal-tools.ts`
- [ ] `src/mcp/zod-input-schema.ts`
- [ ] `src/response-augmentation.ts`
- [ ] `src/types/search-response-guards.ts`
- [ ] `src/types/doc-bridges.ts`
- [ ] `src/types/public-types.ts`
- [ ] `src/index.ts`

**Process**:

```bash
# Find all imports from generated paths
cd packages/sdks/oak-curriculum-sdk-runtime
rg "from ['\"]\.\.?/types/generated/" src/

# For each file, update imports to use generation package
# Manual review required to ensure correct symbols are imported
```

**Validation**:

- TypeScript compilation succeeds
- No imports from `./types/generated/` remain
- All imports resolve from generation package
- **No runtime logic changes**: Use `git diff` to verify only import lines changed
  ```bash
  # Should show ONLY import statement changes, no logic changes
  git diff packages/sdks/oak-curriculum-sdk-runtime/src/
  ```

### 3.3 Update Runtime Barrel Export

**Objective**: Re-export commonly used types from generation, add runtime exports.

**src/index.ts structure**:

```typescript
/**
 * @oaknational/oak-curriculum-sdk
 * Runtime SDK for Oak Curriculum API
 */

// Re-export types from generation for convenience
export type {
  paths,
  components,
  Subject,
  KeyStage,
  ToolName,
  ToolDescriptor,
  SearchScope,
  SearchLessonsResponse,
  // ... other commonly used types
} from '@oaknational/oak-curriculum-sdk-generation';

// Re-export constants/guards from generation
export {
  KEY_STAGES,
  SUBJECTS,
  PATHS,
  isKeyStage,
  isSubject,
  toolNames,
  isToolName,
  curriculumSchemas,
  // ... other commonly used exports
} from '@oaknational/oak-curriculum-sdk-generation';

// Export runtime functionality
export { createOakClient, createOakPathBasedClient } from './client/index.js';
export type { OakApiClient, OakApiPathBasedClient } from './client/index.js';

export {
  validateRequest,
  validateCurriculumResponse,
  validateSearchResponse,
  isValidationSuccess,
  isValidationFailure,
} from './validation/index.js';

export { executeToolCall, McpToolError } from './mcp/execute-tool-call.js';
export { createMcpToolRegistry } from '@oaknational/oak-curriculum-sdk-generation';

// ... (all current exports)
```

**Tasks**:

- [ ] Update src/index.ts to re-export from generation
- [ ] Ensure all current public exports are preserved
- [ ] Add JSDoc for runtime-specific exports
- [ ] Verify no breaking changes to public API

**Validation**:

- All previous exports still available
- Consuming apps can import without changes
- TypeScript types resolve correctly

### 3.4 Add Import Enforcement

**Objective**: Prevent deep imports via ESLint rule.

**eslint.config.ts addition**:

```typescript
export default [
  {
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@oaknational/oak-curriculum-sdk-generation/*'],
              message:
                'Import from @oaknational/oak-curriculum-sdk-generation root only. Deep imports are not allowed - use the public API.',
            },
            {
              group: ['**/types/generated/**'],
              message:
                'Do not import from types/generated directly. Import from @oaknational/oak-curriculum-sdk-generation instead.',
            },
          ],
        },
      ],
    },
  },
];
```

**Tasks**:

- [ ] Add ESLint rule to runtime workspace config
- [ ] Test rule catches deep imports
- [ ] Document rule in README

**Validation**:

```bash
# Should fail
import { paths } from '@oaknational/oak-curriculum-sdk-generation/types/api-schema/api-paths-types';

# Should pass
import { paths } from '@oaknational/oak-curriculum-sdk-generation';
```

### 3.5 Document Runtime Workspace

**Objective**: Update README for runtime workspace.

**README.md sections**:

- Purpose: API client for Oak Curriculum
- Architecture: Two-workspace separation
- Installation: How to install
- Usage: Client examples
- Dependencies: Relationship with generation workspace
- Development: How to build

**Tasks**:

- [ ] Update README.md
- [ ] Document workspace separation
- [ ] Update usage examples
- [ ] Add migration notes
- [ ] Link to generation workspace docs

**Validation**:

- README reflects new architecture
- Examples are correct and testable

## Phase 4: Monorepo Integration

### 4.1 Update Workspace Configuration

**Objective**: Register both workspaces in pnpm-workspace.yaml.

**pnpm-workspace.yaml**:

```yaml
packages:
  - apps/oak-notion-mcp
  - apps/oak-curriculum-mcp-stdio
  - apps/oak-curriculum-mcp-streamable-http
  - apps/oak-open-curriculum-semantic-search
  - packages/libs/env
  - packages/libs/logger
  - packages/libs/storage
  - packages/libs/transport
  - packages/sdks/oak-curriculum-sdk-generation # NEW
  - packages/sdks/oak-curriculum-sdk-runtime # RENAMED
  - packages/providers/mcp-providers-node
```

**Tasks**:

- [ ] Update pnpm-workspace.yaml
- [ ] Run `pnpm install` to update lockfile
- [ ] Verify workspace links resolve correctly

**Validation**:

```bash
pnpm list --depth 0 --filter @oaknational/oak-curriculum-sdk-runtime
# Should show @oaknational/oak-curriculum-sdk-generation: link:../oak-curriculum-sdk-generation
```

### 4.2 Update Turbo Configuration

**Objective**: Configure build orchestration with proper dependencies.

**turbo.json updates**:

```json
{
  "tasks": {
    "type-gen": {
      "dependsOn": ["^type-gen"],
      "cache": true,
      "outputs": ["**/src/types/**"],
      "inputs": ["$TURBO_DEFAULT$", "**/type-gen/**/*.ts"],
      "env": ["OAK_API_KEY"],
      "passThroughEnv": ["OAK_API_KEY"]
    },
    "build": {
      "dependsOn": ["^build"],
      "cache": false,
      "outputs": ["dist/**"]
    }
  }
}
```

**Key points**:

- `^build` dependency ensures generation builds before runtime
- `type-gen` only runs for generation workspace
- Turbo orchestrates automatically

**Tasks**:

- [ ] Update turbo.json
- [ ] Test build order with clean workspace
- [ ] Verify caching behavior

**Validation**:

```bash
pnpm clean
pnpm build
# Should build sdk-generation first, then sdk-runtime, then apps
```

### 4.3 Update Root Scripts

**Objective**: Simplify top-level commands.

**package.json (root) updates**:

```json
{
  "scripts": {
    "type-gen": "turbo run type-gen --filter=@oaknational/oak-curriculum-sdk-generation",
    "build": "turbo run build",
    "make": "pnpm i && pnpm build && pnpm type-check && pnpm doc-gen && pnpm lint -- --fix && pnpm format:root",
    "re-build": "pnpm clean && pnpm install && pnpm build"
  }
}
```

**Changes**:

- `type-gen` scoped to generation workspace only
- `build` orchestrates everything via Turbo
- `make` uses `build` instead of separate `type-gen` + `build`

**Tasks**:

- [ ] Update root package.json scripts
- [ ] Test each script
- [ ] Update CI if necessary

**Validation**:

```bash
# These should work at repo root
pnpm type-gen  # Runs only for generation workspace
pnpm build     # Builds everything in order
pnpm make      # Full development cycle
```

### 4.4 Update Documentation

**Objective**: Update repository-level documentation to reflect new architecture.

**Files to update**:

- [ ] `README.md` (repo root) - Update architecture section
- [ ] `CONTRIBUTING.md` - Update build instructions
- [ ] `docs/quick-start.md` - Update getting started
- [ ] `docs/development/` - Update development guides
- [ ] `.agent/directives-and-memory/AGENT.md` - Update workspace info

**Key changes**:

- Two SDK workspaces explanation
- Build process clarification
- Type-gen scoped to generation workspace

**Tasks**:

- [ ] Audit all docs mentioning SDK
- [ ] Update architecture diagrams if any
- [ ] Update build/development instructions
- [ ] Add workspace separation rationale

**Validation**:

- Docs accurately reflect new structure
- Instructions work for new developers

## Phase 5: Testing & Validation

### 5.1 Build Validation

**Objective**: Verify complete build pipeline works.

**Test sequence**:

```bash
# 1. Clean everything
pnpm clean

# 2. Install dependencies
pnpm install

# 3. Build everything
pnpm build

# 4. Verify build order
# - sdk-generation should build first
# - sdk-runtime should build second
# - apps should build last

# 5. Check outputs
ls packages/sdks/oak-curriculum-sdk-generation/dist/
ls packages/sdks/oak-curriculum-sdk-runtime/dist/
```

**Validation criteria**:

- [ ] Build completes without errors
- [ ] Correct build order observed
- [ ] All dist/ directories populated
- [ ] No type errors
- [ ] Generation dist/ exports match public API
- [ ] Runtime dist/ exports match current SDK

### 5.2 Type Checking

**Objective**: Ensure TypeScript compilation succeeds everywhere.

**Commands**:

```bash
# Type check each workspace
pnpm --filter @oaknational/oak-curriculum-sdk-generation type-check
pnpm --filter @oaknational/oak-curriculum-sdk type-check

# Type check all consuming apps
pnpm --filter @oaknational/oak-curriculum-mcp-stdio type-check
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http type-check
pnpm --filter @oaknational/oak-open-curriculum-semantic-search type-check

# Type check everything
pnpm type-check
```

**Validation criteria**:

- [ ] All type checks pass
- [ ] No type assertion errors
- [ ] No import resolution errors
- [ ] No circular dependency warnings

### 5.3 Test Suite Execution

**Objective**: Verify all tests pass without modification.

**Commands**:

```bash
# Run tests for each workspace
pnpm --filter @oaknational/oak-curriculum-sdk-generation test
pnpm --filter @oaknational/oak-curriculum-sdk test

# Run tests for consuming apps
pnpm --filter @oaknational/oak-curriculum-mcp-stdio test
pnpm --filter @oaknational/oak-open-curriculum-semantic-search test

# Run all tests
pnpm test

# Run e2e tests
pnpm test:e2e
```

**Validation criteria**:

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All e2e tests pass
- [ ] No test modifications required
- [ ] Test coverage maintained

### 5.4 Consuming Application Validation

**Objective**: Verify apps build and run correctly with new SDK structure.

**For each app**:

```bash
# Build
pnpm --filter <app-name> build

# Type check
pnpm --filter <app-name> type-check

# Run tests
pnpm --filter <app-name> test

# Start (if applicable)
pnpm --filter <app-name> dev
```

**Apps to validate**:

- [ ] `@oaknational/oak-curriculum-mcp-stdio`
- [ ] `@oaknational/oak-curriculum-mcp-streamable-http`
- [ ] `@oaknational/oak-open-curriculum-semantic-search`
- [ ] `@oaknational/oak-notion-mcp`

**Validation criteria**:

- Apps build without changes
- Apps run without errors
- Imports resolve correctly
- No runtime errors

### 5.5 Import Compliance Audit

**Objective**: Verify no deep imports and all use public API.

**Audit script**:

```bash
# Check for any imports from internal generation paths
cd packages/sdks/oak-curriculum-sdk-runtime
rg "@oaknational/oak-curriculum-sdk-generation/[^'\"]" src/

# Should return no results (only root imports allowed)
```

**Manual checks**:

- [ ] No imports from `@oaknational/oak-curriculum-sdk-generation/*`
- [ ] No imports from `./types/generated/`
- [ ] All imports use public API only
- [ ] ESLint rule catches violations

**Validation criteria**:

- Zero deep imports found
- ESLint enforces boundaries
- Test attempt to add deep import fails lint

### 5.6 Schema-First Execution Compliance Validation

**Objective**: Verify that workspace separation maintains schema-first execution directive.

**Compliance checks**:

```bash
# 1. Verify runtime doesn't duplicate validation logic
cd packages/sdks/oak-curriculum-sdk-runtime
rg "safeParse|parse\(" src/mcp/ src/validation/

# Should only find thin wrappers that delegate to generated validators
# NOT: New validation logic created in runtime

# 2. Verify no type widening in runtime
rg "unknown|any|as\s" src/mcp/ src/validation/

# Should find minimal occurrences - only at boundaries
# NOT: Type assertions or widening to work around generator types

# 3. Verify tool execution delegates to generated helpers
cat src/mcp/execute-tool-call.ts
# Should import and call generated executors, not duplicate logic

# 4. Verify all MCP components come from generation
rg "from '@oaknational/oak-curriculum-sdk-generation'" src/mcp/
# Should import: descriptors, executors, validators, type aliases
```

**Manual audit**:

- [ ] Runtime `execute-tool-call.ts` is thin facade (< 150 lines)
- [ ] No runtime code duplicates generated validation
- [ ] Tool execution flow matches directive: Contract → Definitions → Aliases → Runtime → Facade
- [ ] All MCP tool descriptors imported from generation workspace
- [ ] Generated executors (`callTool`, `executeDescriptor`) used, not reimplemented
- [ ] Type aliases (`ToolArgsForName`, etc.) imported and preserve exact types
- [ ] No union collapsing or type widening in runtime code

**Validation criteria**:

- [ ] Schema-first execution flow preserved across workspaces
- [ ] Runtime remains thin facade over generated artifacts
- [ ] No prohibited practices detected (see directive)
- [ ] Generator templates remain single source of execution logic

### 5.7 Performance Testing

**Objective**: Ensure build time and runtime performance unchanged.

**Metrics to measure**:

```bash
# Measure build time
time pnpm build

# Measure type-gen time
time pnpm --filter @oaknational/oak-curriculum-sdk-generation type-gen

# Measure runtime build time
time pnpm --filter @oaknational/oak-curriculum-sdk build
```

**Baseline**: Record current timings before separation

**Acceptance criteria**:

- Total build time within ±10% of baseline
- Type-gen time unchanged (same code, different location)
- Runtime build time similar (imports changed but no logic change)

**Validation criteria**:

- [ ] Build times acceptable
- [ ] No significant performance regression
- [ ] Turbo caching effective

## Phase 6: Documentation & Completion

### 6.1 Create Migration Guide

**Objective**: Document migration for developers and future reference.

**Migration guide sections**:

1. Overview: Why we separated
2. What changed: High-level changes
3. For SDK consumers: Zero changes needed
4. For SDK contributors: New workspace structure
5. Build process: Updated commands
6. Troubleshooting: Common issues

**File location**: `packages/sdks/MIGRATION.md`

**Tasks**:

- [ ] Write migration guide
- [ ] Include before/after examples
- [ ] Document breaking changes (none expected)
- [ ] Add troubleshooting section

**Validation**:

- Guide is clear and comprehensive
- Examples are correct

### 6.2 Publish ADR

**Objective**: Finalize and publish architectural decision.

**ADR sections**:

- Status: Accepted
- Context: Why separation needed
- Decision: What we did
- Consequences: Benefits and trade-offs
- Related: Link to other ADRs

**Tasks**:

- [ ] Complete ADR draft from Phase 1
- [ ] Add implementation details
- [ ] Document outcomes
- [ ] Link from relevant ADRs (ADR-030, ADR-031)

**Validation**:

- ADR complete and reviewed
- Published in docs/architecture/architectural-decisions/

### 6.3 Update High-Level Plan

**Objective**: Mark this milestone complete in repository roadmap.

**high-level-plan.md update**:

```markdown
5. Separate the Curriculum SDK type generation from the Curriculum SDK runtime — Status: ✅ DONE
   - Plan: `.agent/plans/sdk-workspace-separation-plan.md`
   - Scope: Split SDK into generation and runtime workspaces with clean public API
   - Acceptance: Two workspaces building in sequence; runtime imports only from generation public API; all tests passing; zero consumer impact; ADR published
```

**Tasks**:

- [ ] Update status to DONE
- [ ] Add plan reference
- [ ] Document acceptance criteria met

### 6.4 README Updates

**Objective**: Update READMEs for both workspaces and consuming apps.

**Files to finalize**:

- [ ] `packages/sdks/oak-curriculum-sdk-generation/README.md`
- [ ] `packages/sdks/oak-curriculum-sdk-runtime/README.md`
- [ ] Repository root README.md
- [ ] App READMEs (if they mention SDK internals)

**Content**:

- Architecture overview
- Usage examples
- Build instructions
- Public API reference
- Development guide

**Validation**:

- All READMEs accurate
- Examples work
- Instructions complete

### 6.5 Final Validation Checklist

**Objective**: Confirm all success criteria met.

**Move-and-Expose Verification**:

```bash
# Verify no logic changes to generated files
cd packages/sdks/oak-curriculum-sdk-generation/src/types
# Files should be identical to their original location (git history will show move only)

# Verify no logic changes to runtime files (only imports changed)
cd packages/sdks/oak-curriculum-sdk-runtime/src
git log --all -p -- '*.ts' | grep -A5 -B5 '^[-+]' | grep -v '^[-+]import'
# Should show minimal/no changes besides imports

# Verify new code is only barrel export
git log --diff-filter=A --name-only packages/sdks/oak-curriculum-sdk-generation/src/
# Should show only: src/index.ts and package.json/config files
```

**Functional Equivalence**:

- [ ] Build output for consuming apps is identical (compare dist/ contents)
- [ ] Type definitions exported are identical
- [ ] Runtime behavior is identical
- [ ] Test results are identical
- [ ] Performance metrics are equivalent

**Separation Checklist**:

- [ ] ✅ Clean workspace separation achieved
- [ ] ✅ Public API enforced (no deep imports)
- [ ] ✅ Single `pnpm build` orchestrates everything
- [ ] ✅ ADR-030 contract preserved
- [ ] ✅ Zero consumer impact verified
- [ ] ✅ Generation can refactor internals freely
- [ ] ✅ Documentation complete
- [ ] ✅ All tests pass
- [ ] ✅ Build time acceptable
- [ ] ✅ Package sizes improved
- [ ] ✅ ESLint enforces boundaries
- [ ] ✅ Migration guide published
- [ ] ✅ ADR published
- [ ] ✅ High-level plan updated
- [ ] ✅ **Core Principle Verified**: Only moves and re-exports, no modifications

## Rollback Strategy

If critical issues discovered during implementation:

**Rollback steps**:

1. Revert all commits related to separation
2. Restore single SDK workspace structure
3. Re-run `pnpm install` to restore dependencies
4. Verify tests pass
5. Document issues for future attempt

**Rollback triggers**:

- Significant performance regression (>25% slower builds)
- Breaking changes to consuming apps
- Unresolvable circular dependencies
- Critical tests failing

## Risk Mitigation

| Risk                                     | Impact | Likelihood | Mitigation                                                |
| ---------------------------------------- | ------ | ---------- | --------------------------------------------------------- |
| Import path changes break tests          | High   | Low        | Comprehensive testing phase; gradual rollout              |
| Build time increases significantly       | Medium | Low        | Turbo caching; performance monitoring                     |
| Circular dependencies between workspaces | High   | Low        | Careful public API design; validation in Phase 1          |
| Consumer apps require changes            | High   | Low        | Re-export common types from runtime; extensive validation |
| Generated files ownership confusion      | Medium | Medium     | Clear documentation; committed in generation workspace    |
| ESLint rule too restrictive              | Low    | Low        | Test rule before broad application; allow escape hatch    |

## Success Indicators

**Week 1 (Architecture)**:

- Public API designed and reviewed
- Workspace structure defined
- ADR drafted

**Week 2 (Implementation)**:

- Generation workspace created and building
- Runtime workspace updated and building
- Imports migrated to public API

**Week 3 (Integration)**:

- Monorepo config updated
- All apps building
- Tests passing

**Week 4 (Validation)**:

- Performance validated
- Documentation complete
- Migration guide published

## Dependencies

**Blocked by**:

- None (can start immediately)

**Blocks**:

- Future SDK features requiring coordination between generation and runtime
- External package consumers (need coordinated release if they exist)

**Enables**:

- Generator code reuse for other APIs
- Potential Python/Rust/etc. SDKs using same generated types
- Cleaner separation for maintenance
- Independent versioning of generation vs runtime

## Notes

- **Schema-First Execution**: This separation MUST preserve the mandatory schema-first execution pattern. Runtime code remains a thin facade over generated artifacts. See [Schema-First Execution Directive](../directives-and-memory/schema-first-execution.md).
- Generated files remain committed in generation workspace for transparency and CI
- Runtime package name stays `@oaknational/oak-curriculum-sdk` for consumer compatibility
- Generation package published as `@oaknational/oak-curriculum-sdk-generation`
- Both packages follow semantic versioning
- For monorepo consumers, `workspace:*` links ensure always using local versions
- External consumers automatically get generation as transitive dependency
- All MCP tool execution components (Contract → Definitions → Aliases → Runtime → Facade) exported from generation public API
- Generator templates in `sdk-generation/type-gen/` remain the single source of truth for tool execution behavior

## Future: Framework Extraction Enablement

This workspace separation is **designed to enable** future framework extraction (see [OpenAPI-to-MCP Framework Extraction Plan](./openapi-to-mcp-framework-extraction-plan.md)).

By separating generation from runtime now, we:

1. **Identify exact extraction scope** - The `sdk-generation` workspace contains the type-gen logic that will be generalized into `@oaknational/openapi-mcp-framework`
2. **Validate decoupling** - Proves generation logic can operate independently of Oak-specific runtime code
3. **Create reference implementation** - The separated generation workspace becomes the working example for the framework
4. **Establish consumer pattern** - Oak SDK demonstrates how to consume the framework after extraction
5. **Enable parallel work** - Once separated, framework extraction can proceed without disrupting runtime workspace

### Post-Framework Extraction Architecture

After framework extraction completes, the architecture will be:

```
@oaknational/openapi-mcp-framework (extracted from sdk-generation/type-gen/)
  ├── Core generation logic (general-purpose)
  ├── Configuration schema
  └── CLI for any OpenAPI spec
           ↓ consumed by
@oaknational/oak-curriculum-sdk-generation
  ├── Oak-specific configuration
  ├── Oak-specific extensions (if any)
  └── Uses framework to generate types
           ↓ consumed by
@oaknational/oak-curriculum-sdk (runtime)
  ├── Oak API client
  ├── Oak-specific utilities
  └── Uses generated types
```

The workspace separation creates the middle layer in this architecture, making framework extraction straightforward.

## Related Plans

- [OpenAPI-to-MCP Framework Extraction Plan](./openapi-to-mcp-framework-extraction-plan.md) - **This plan is a prerequisite** for framework extraction
- [Contract Testing Plan](./contract-testing-schema-evolution-plan.md) - Will validate this separation maintains schema evolution contract
- [High-Level Plan](./high-level-plan.md) - Item #5 tracks this work

## References

- Current SDK: `packages/sdks/oak-curriculum-sdk/`
- ADRs: `docs/architecture/architectural-decisions/`
- Turbo docs: https://turbo.build/repo/docs
- pnpm workspaces: https://pnpm.io/workspaces
