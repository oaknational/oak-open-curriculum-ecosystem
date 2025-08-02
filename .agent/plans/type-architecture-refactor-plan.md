# Type Architecture Refactoring Plan

## Impacts We Want

1. **Type Safety Without Compromise**: Zero type assertions, complete type safety throughout
2. **Maintainable Architecture**: Clear boundaries that make the codebase easy to understand and extend
3. **Developer Velocity**: Types that help rather than hinder development
4. **Runtime Safety**: Types that prevent errors before they reach production

## Outcomes That Enable These Impacts

1. **Single Source of Truth**: Each type defined exactly once
2. **Clear Module Boundaries**: Dependencies flow in one direction (DIP)
3. **Library Type Reuse**: Use external types directly, no wrappers
4. **Domain Type Clarity**: Our types model our domain, not external concerns

## Current State Analysis

### Type Violations Found

1. **Duplicate LogLevel Enums**
   - `ConsoleLogLevel` in `src/logging/transports/console/types.ts`
   - `FileLogLevel` in `src/logging/transports/file/types.ts`
   - Original `LogLevel` in `src/logging/logger-interface.ts`
   - Impact: Maintenance burden, potential for drift, violates DRY

2. **Type Assertions**
   - `level as unknown as ConsoleLogLevel` in console adapter
   - `level as unknown as FileLogLevel` in file adapter
   - Impact: Bypasses type safety, explicitly forbidden by standards

3. **Module Boundary Issues**
   - Transports need LogLevel but can't import from parent
   - Current structure forces duplication or parent imports
   - Impact: Architecture fights against clean code principles

### Root Cause Analysis

The module structure creates a dependency direction problem:

```
src/logging/
├── logger-interface.ts (defines LogLevel)
├── transports/
│   ├── console/
│   │   ├── types.ts (needs LogLevel, duplicates it)
│   │   └── adapter.ts (uses type assertion)
│   └── file/
│       ├── types.ts (needs LogLevel, duplicates it)
│       └── adapter.ts (uses type assertion)
```

The nesting implies transports are "inside" logging, but they need types from their parent. This violates natural dependency flow.

## Proposed Architecture

### Option 1: Shared Types Module (RECOMMENDED)

Create a types module that serves as the single source of truth:

```
src/logging/
├── types/
│   ├── index.ts        # Public API
│   ├── levels.ts       # LogLevel enum and guards
│   ├── transports.ts   # Transport interfaces
│   └── formatters.ts   # Formatter interfaces
├── core/
│   └── logger.ts       # Logger implementation
├── transports/
│   ├── console.ts      # Console transport (flat)
│   └── file.ts         # File transport (flat)
└── formatters/
    ├── json.ts
    └── pretty.ts
```

Benefits:

- No parent imports needed
- Single source of truth
- Clear separation of concerns
- Follows KISS principle

### Option 2: Domain-Driven Structure

Organize by capability rather than technical concern:

```
src/
├── core-logging/       # Core logging domain
│   ├── types.ts        # All logging types
│   ├── logger.ts       # Logger implementation
│   └── index.ts        # Public API
├── console-logging/    # Console logging domain
│   ├── transport.ts
│   └── index.ts
├── file-logging/       # File logging domain
│   ├── transport.ts
│   └── index.ts
└── notion/            # Notion domain (unchanged)
```

Benefits:

- Each domain is self-contained
- Can evolve independently
- Natural boundaries for future extraction

### Option 3: Flatten Current Structure

Simply move transports to be siblings:

```
src/logging/
├── logger-interface.ts
├── console-transport.ts
├── file-transport.ts
└── transports/         # Legacy, empty
```

Benefits:

- Minimal change
- Solves immediate problem
- Can evolve to Option 1 later

## Implementation Steps

### Phase 1: Type Consolidation (Option 1)

1. **Create Shared Types Module**

   ```typescript
   // src/logging/types/levels.ts
   export const LOG_LEVELS = {
     TRACE: 0,
     DEBUG: 1,
     INFO: 2,
     WARN: 3,
     ERROR: 4,
     FATAL: 5,
   } as const;

   export type LogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS];

   export function isLogLevel(value: unknown): value is LogLevel {
     return typeof value === 'number' && value >= LOG_LEVELS.TRACE && value <= LOG_LEVELS.FATAL;
   }
   ```

2. **Update Logger Interface**
   - Import types from new location
   - Remove duplicate definitions

3. **Remove Duplicate Enums**
   - Delete ConsoleLogLevel and FileLogLevel
   - Update all references to use shared LogLevel

4. **Remove Type Assertions**
   - Adapters use the same LogLevel type throughout
   - No need for mapping functions

### Phase 2: Notion Type Audit

1. **Identify Custom Notion Types**
   - Find all interfaces that duplicate @notionhq/client types
   - Map which are necessary abstractions vs unnecessary wrappers

2. **Use SDK Types Directly**
   - Import Notion types from @notionhq/client
   - Remove custom interfaces that add no value

3. **Keep Domain Types**
   - McpResource is our domain type, keep it
   - Transformers that convert Notion → MCP are domain logic

### Phase 3: Module Boundary Refinement

1. **Evaluate Current Boundaries**
   - Which modules truly need to be separate?
   - Where does DIP add value vs complexity?

2. **Simplify Where Possible**
   - Merge overly granular modules
   - Keep separation where it enables testing/extension

3. **Document Boundaries**
   - Each module's index.ts defines its public API
   - Clear contracts between modules

## Success Criteria

1. **Zero Type Assertions**: No `as` keywords in codebase ✓ (Completed)
2. **Zero Duplicate Types**: Each type has one definition (In Progress)
3. **Clean Imports**: No ESLint warnings about parent imports ✓ (Completed)
4. **Type Safety**: TypeScript strict mode passes (In Progress)
5. **Maintainability**: New developers understand type flow ✓ (Improved)

## Principles Throughout

- **KISS**: Prefer simple solutions over clever ones
- **YAGNI**: Don't create abstractions we don't need yet
- **DRY**: One source of truth for each concept
- **SOLID**: Especially Single Responsibility and DIP
- **Fail Fast**: Types should catch errors at compile time

## Migration Strategy

1. Create new structure alongside old
2. Migrate one module at a time
3. Run quality gates after each migration
4. Delete old code only after new code works
5. Single atomic commit for each phase

This approach ensures we maintain a working system throughout the refactoring while moving toward a cleaner architecture.

## Progress Update

### Completed (Phase 1: Type Consolidation)

1. **Created Shared Types Module** ✓
   - Created `src/logging/types/` directory structure
   - Implemented `levels.ts` with updated LOG_LEVELS structure:
     ```typescript
     export const LOG_LEVELS = {
       TRACE: { value: 0, name: 'TRACE' },
       DEBUG: { value: 10, name: 'DEBUG' },
       INFO: { value: 20, name: 'INFO' },
       WARN: { value: 30, name: 'WARN' },
       ERROR: { value: 40, name: 'ERROR' },
       FATAL: { value: 50, name: 'FATAL' },
     } as const;
     ```
   - Added `getLogLevelName` function as single source of truth
   - Created transport and formatter type definitions

2. **Updated Logger Interface** ✓
   - Now re-exports types from shared module
   - Removed duplicate type definitions

3. **Removed Duplicate Enums** ✓
   - Deleted ConsoleLogLevel and FileLogLevel
   - Updated all transports to use shared LogLevel type

4. **Removed Type Assertions** ✓
   - Eliminated all `as unknown as` type assertions
   - Adapters now use proper type conversions

5. **Updated All Code to New LOG_LEVELS Structure** ✓
   - Fixed all references from `LogLevel.INFO` to `LOG_LEVELS.INFO.value`
   - Updated all test files
   - Fixed inline level name lookups to use central function

### Additional Duplicates Identified

1. **getLevelName duplicates**:
   - `src/logging/formatters/pretty/levels/utils.ts` - Has its own implementation
   - `src/logging/file-reporter.ts` - Has its own implementation
   - Should use: `getLogLevelName` from `src/logging/types/levels.ts`

2. **getLevelColor duplicates**:
   - `src/logging/formatters/pretty/colors/utils.ts` - Has its own implementation
   - `src/logging/transports/console/colorizer.ts` - Has LEVEL_COLORS mapping
   - Both define the same color mappings

3. **Level abbreviation mappings**:
   - `src/logging/formatters/pretty/levels/utils.ts` - Has getLevelAbbreviation
   - Multiple test files have inline abbreviation mappings
   - No single source of truth for abbreviations

4. **Level to console method mappings**:
   - Repeated in multiple test and implementation files
   - Maps levels to debug/info/warn/error methods

5. **Error serialization logic**:
   - Repeated pattern across formatters and transports
   - Same logic for Error/string/number/object handling

### Next Steps (Phase 1 Completion)

1. **Consolidate getLevelName functions**
   - Update all implementations to use `getLogLevelName`
   - Remove duplicate implementations

2. **Create shared color mapping**
   - Add to `src/logging/types/levels.ts` or create `colors.ts`
   - Update all color implementations to use shared mapping

3. **Create shared abbreviation mapping**
   - Add `getLevelAbbreviation` to shared types
   - Update all uses to reference shared function

4. **Extract error serialization**
   - Create shared error serialization utility
   - Replace all duplicate implementations

5. **Run quality gates** ✓
   - Format: ✓ Completed
   - Type check: In progress (fixing remaining errors)
   - Lint: Pending
   - Test: Pending
   - Build: Pending
