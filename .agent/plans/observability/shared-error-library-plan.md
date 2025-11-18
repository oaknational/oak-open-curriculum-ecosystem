# Shared Error Library Plan

**Status**: Future Work (Not blocking current development)  
**Created**: 2025-11-06  
**Related**: Session 2.4 (Error Context Enrichment)

## Context

This plan documents the strategic vision for a comprehensive shared error handling library in the Oak MCP ecosystem. It is created as part of Session 2.4 to capture important architectural analysis without derailing the immediate tactical work of error enrichment.

**Relationship to Session 2.4**: Session 2.4 implements tactical error enrichment (adding correlation IDs and timing to errors) in the logger package. This is an appropriate interim solution. The shared error library described in this document is a separate, future strategic initiative.

## Executive Summary

The Oak MCP ecosystem currently mixes multiple error handling styles: direct exception throwing, silent fallback values (`null`, `false`), bespoke result discriminated unions, and logging without consistent propagation. This plan proposes a dedicated error-handling library workspace that will anchor shared abstractions, offer utilities for wrapping throwing dependencies, and define a structured error taxonomy.

**Key Findings** (from `research/error_handling/oak-error-handling-survey.md`):

- No repository-wide error type taxonomy
- Inconsistent return signatures impede composition and TDD
- Multiple bespoke `Result`-like types across packages
- External dependencies throw inconsistently
- Logging loses causality metadata

## Proposed Architecture

### Package Location

`packages/libs/result/`

### Core Exports

1. **`Result<T, E extends ResultError>`** - Discriminated union type
   - Methods: `map`, `mapError`, `andThen`, `asyncFrom`
   - Type-safe error handling without exceptions

2. **`ResultError`** - Base error interface
   - `kind`: Machine-friendly error category
   - `message`: Human-readable description (British spelling)
   - `cause?`: Optional underlying error (native `ErrorOptions`)
   - `context?`: Structured metadata object

3. **Error Taxonomy** - Consistent error kinds
   - `ValidationError` - Input validation failures
   - `TransportError` - Network/communication failures
   - `AuthError` - Authentication/authorization failures
   - `ConfigError` - Configuration/environment issues
   - `InvariantError` - Programming errors/assertions
   - `OakErrorKind = 'validation' | 'authorisation' | 'transport' | 'configuration' | 'unexpected' | ...`

4. **Helper Constructors**
   - `ok(value)` - Create success result
   - `err(error)` - Create error result
   - `fromThrowable(fn, classify)` - Wrap throwing functions
   - `fromPromise(promise, classify)` - Wrap throwing promises
   - `combine(results)` - Combine multiple results

5. **Async Composition Utilities**
   - `asyncMap` - Transform async results
   - `asyncAndThen` - Chain async operations
   - `settleAll` - Wait for multiple results

### Example Usage

```typescript
import { fromThrowable, fromPromise, Result } from '@oaknational/result';

// Wrapping Node.js file operations
const readFileSafe = fromThrowable(fs.promises.readFile, {
  classify: (error) => ({
    kind: 'io',
    message: 'Failed to read file',
    context: { path },
    cause: error,
  }),
});

// Wrapping JWT verification
const jwkKey = await fromPromise(importJWK(jwk, 'RS256'), (error) => ({
  kind: 'configuration',
  message: 'Invalid LOCAL_AS_JWK value',
  context: { envVar: 'LOCAL_AS_JWK' },
  cause: error,
}));

// Service functions returning Result
function processLessonData(input: unknown): Result<LessonData, OakError> {
  const validated = validateInput(input);
  if (!validated.ok) {
    return err({
      kind: 'validation',
      message: 'Invalid lesson data',
      context: { issues: validated.issues },
    });
  }
  return ok(validated.value);
}
```

## Integration Patterns

### With Existing Code

1. **MCP Tool Execution** - Return `Result` from tool handlers
2. **HTTP/Express Handlers** - Convert `Result` to HTTP responses
3. **Logger Integration** - Extract structured metadata from `ResultError`
4. **Validation Bridge** - Utilities to convert existing `ValidationResult<T>` types

### Bridging Throwing Dependencies

Provide adapter modules for common throwing libraries:

- `packages/libs/result/adapters/jose.ts` - JWT verification wrappers
- `packages/libs/result/adapters/fs.ts` - File system operation wrappers
- `packages/libs/result/adapters/fetch.ts` - HTTP request wrappers
- `packages/libs/result/adapters/notion.ts` - Notion SDK wrappers

## Current State Analysis

### What Exists Today

1. **`packages/libs/logger`** - Basic error normalization
   - `normalizeError(error: unknown): Error` - Type conversion only
   - No error enrichment or context management

2. **`packages/sdks/oak-curriculum-sdk`** - Validation-specific results
   - `ValidationResult<T>` - Domain-specific, Zod-focused
   - Not suitable for general error handling

3. **Bespoke Result Types** (scattered across codebase)
   - `argument-normaliser.ts`: `Result<T>` with `{ ok: true; value } | { ok: false; message }`
   - `execute-tool-call.ts`: `ToolExecutionResult` unions
   - Different shapes, no shared abstraction

### What's Missing

- ❌ No shared `Result<T, E>` type
- ❌ No error taxonomy or classification system
- ❌ No utilities for wrapping throwing code
- ❌ No async composition helpers
- ❌ Inconsistent error handling across packages

## Migration Strategy

### Part 1 — Design and Scaffolding

1. **Create `@oaknational/result` package**
   - Define core types and interfaces
   - Implement helper constructors
   - Add async composition utilities
   - Full TSDoc documentation
   - Comprehensive unit tests

2. **Establish Error Taxonomy**
   - Define error kinds and categories
   - Create domain-specific error types
   - Document when to use each kind

3. **Provide Migration Tools**
   - ESLint rules to flag empty catch blocks
   - ESLint rules to flag unclassified throws
   - Codemods for common patterns
   - Migration guide with examples

### Part 2 — Incremental Adoption

Priority order based on risk and impact:

1. **High-Risk Boundaries** (Phase 1)
   - External API calls
   - Storage adapters
   - Auth flows (JWT verification, Clerk)
   - Network operations

2. **Tool Execution** (Phase 2)
   - `executeToolCall` returns `Result`
   - MCP tool handlers use `Result`
   - SDK adapters return `Result`

3. **Silent Fallbacks** (Phase 3)
   - Replace `catch { return null }` patterns
   - Replace `catch { return undefined }` patterns
   - Add explicit error handling

4. **Logger Integration** (Phase 4)
   - Accept `ResultError` metadata
   - Structured logging from error context
   - Consistent observability

## Implementation Considerations

### Library Evaluation

Based on research analysis, **build a bespoke implementation** inspired by `neverthrow`, tailored to Oak needs:

**Why not use existing libraries?**

- `neverthrow`: Good ergonomics but limited custom error typing
- `oxide.ts`: Smaller community, less TypeScript-first
- `ts-results`: Lacks async helpers, imperative style
- `fp-ts`: Steep learning curve, conflicts with "keep it simple" directive

**Benefits of bespoke**:

- Tailored to Oak error taxonomy
- Integrated with existing logging infrastructure
- Familiar API based on existing `ValidationResult`
- No external runtime dependencies
- Full control over tree-shaking and bundle size

### Design Principles

1. **Keep It Simple** - No FP jargon, straightforward API
2. **Type-Safe** - No `any`, `as`, or type shortcuts
3. **Browser-Safe** - Works in both Node and browser contexts
4. **Tree-Shakeable** - Minimal bundle impact
5. **TDD-Friendly** - Easy to test, clear boundaries
6. **Fail Fast** - Explicit error handling, no silent failures

## Risks and Mitigations

### Risk 1: Dual Error Paths

**Problem**: Functions might both throw AND return `Result`, creating confusion.

**Mitigation**:

- ESLint rule: flag `throw` inside functions returning `Result`
- Exception: Allow `throw` only for unrecoverable invariants
- Document clear guidelines for when to throw vs return `Result`

### Risk 2: Adoption Fatigue

**Problem**: Large migration effort, team resistance.

**Mitigation**:

- Incremental adoption (prioritize high-risk areas)
- Reference implementations for common patterns
- Pairing sessions and code reviews
- Automated tooling (codemods, ESLint rules)
- Clear documentation with examples

### Risk 3: Type Drift

**Problem**: Teams create new bespoke error types instead of using shared library.

**Mitigation**:

- Centralize all error types in `@oaknational/result`
- ESLint rule: flag new discriminated unions with `ok` property
- Code review checklist includes error handling patterns
- Regular audits of error handling patterns

### Risk 4: Performance Concerns

**Problem**: Wrapping in `Result` adds overhead.

**Mitigation**:

- Document benchmarks (wrapping is lightweight)
- Tree-shaking ensures minimal bundle impact
- Lazy evaluation where appropriate
- Monitor production performance

## Success Metrics

### Immediate (Phase 1 Complete)

- `@oaknational/result` package published internally
- 100% test coverage on core types
- Documentation with 10+ examples
- 3+ adapter modules for common dependencies

### Short-term (Phase 2 Complete)

- 50%+ of external API calls return `Result`
- Zero silent fallbacks (`catch { return null }`)
- MCP tool execution uses `Result`
- Logger accepts `ResultError` metadata

### Long-term (Full Adoption)

- 90%+ of fallible operations return `Result`
- Consistent error taxonomy across ecosystem
- Reduced production debugging time (structured errors)
- Zero unhandled promise rejections

## Next Steps (When Ready)

1. **RFC Phase**
   - Author architecture RFC for `@oaknational/result`
   - Review with team
   - Gather feedback on error taxonomy

2. **Prototype Phase**
   - Implement core types and helpers
   - Validate against real use cases (`index-bulk-helpers.ts`, `execute-tool-call.ts`)
   - Benchmark performance

3. **Tooling Phase**
   - Create ESLint rules
   - Write codemods for common patterns
   - Build migration guide

4. **Pilot Phase**
   - Migrate one package completely (e.g., `storage`)
   - Document lessons learned
   - Refine approach based on feedback

5. **Rollout Phase**
   - Execute Part 2 migration plan
   - Monitor adoption and provide support
   - Iterate based on team feedback

## References

- `research/error_handling/oak-error-handling-survey.md` - Comprehensive survey of current patterns
- `.agent/directives-and-memory/rules.md` - Type safety and testing requirements
- `packages/sdks/oak-curriculum-sdk/src/validation/types.ts` - Existing `ValidationResult<T>` pattern
- Session 2.4 deliverables - Tactical error enrichment in logger package

## Appendix: Comparison with Session 2.4

### Session 2.4 (Tactical - Immediate)

**Scope**: Error context enrichment in logger package

**Deliverables**:

- `enrichError(error, context)` function
- `ErrorContext` interface (correlation ID, timing, request metadata)
- Integration with HTTP and stdio servers
- Enhanced error logging

**Timeline**: 3-5 hours

**Purpose**: Improve production debugging NOW with correlation and timing data

### Shared Error Library (Strategic - Future)

**Scope**: Comprehensive error handling framework

**Deliverables**:

- `Result<T, E>` type system
- Error taxonomy and classification
- Utilities for wrapping throwing code
- Async composition helpers
- Migration tooling

**Timeline**: Multiple weeks/months

**Purpose**: Establish consistent error handling patterns across entire ecosystem

### Relationship

Session 2.4 error enrichment is:

- **Compatible** with future Result<T, E> library
- **Complementary** - enrichment adds debugging context, Result<T, E> adds type safety
- **Not blocking** - can proceed independently
- **Appropriate interim** - solves immediate observability needs

The shared error library will eventually:

- Use `enrichError` from logger package for error context
- Integrate `ResultError` with existing enrichment
- Build on patterns established in Session 2.4
- Maintain backward compatibility with enriched errors

---

**Status**: Plan Complete - Ready for Future Implementation  
**Next Action**: None (Session 2.4 proceeds with tactical enrichment)
