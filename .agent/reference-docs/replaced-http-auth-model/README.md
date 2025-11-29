# HTTP-Level Auth Implementation (Historical Reference)

**Status**: Replaced by tool-level auth on 2025-11-24  
**Reason**: Incompatible with OpenAI Apps SDK requirement for HTTP 200 responses

## Overview

This directory contains the complete HTTP-level authentication implementation that was replaced by the tool-level auth architecture. These files are preserved for reference as the architecture was sound, just incompatible with OpenAI Apps SDK requirements.

## Contents

### Implementation Files

| File                | Original Path                         | Description                                           |
| ------------------- | ------------------------------------- | ----------------------------------------------------- |
| `mcp-auth.ts`       | `src/auth/mcp-auth/mcp-auth.ts`       | Core HTTP middleware for OAuth authentication         |
| `mcp-auth-clerk.ts` | `src/auth/mcp-auth/mcp-auth-clerk.ts` | Clerk integration wrapper                             |
| `mcp-router.ts`     | `src/mcp-router.ts`                   | Route registration (authenticated vs unauthenticated) |

### Test Files

| File                                               | Original Path                                                        | Description                                  |
| -------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------- |
| `mcp-auth.unit.test.ts`                            | `src/auth/mcp-auth/mcp-auth.unit.test.ts`                            | Pure function unit tests                     |
| `mcp-auth-resource-validation.integration.test.ts` | `src/auth/mcp-auth/mcp-auth-resource-validation.integration.test.ts` | RFC 8707 resource parameter validation tests |
| `mcp-router.integration.test.ts`                   | `src/mcp-router.integration.test.ts`                                 | Route registration integration tests         |
| `auth-www-authenticate.integration.test.ts`        | `src/auth-www-authenticate.integration.test.ts`                      | WWW-Authenticate header format tests         |
| `clerk-auth-middleware.integration.test.ts`        | `src/clerk-auth-middleware.integration.test.ts`                      | Clerk middleware integration tests           |

### Documentation

| File                              | Description                                                                                                     |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `http-level-auth-architecture.md` | Complete architectural documentation including design principles, testing strategy, and reasons for replacement |

## Key Design Patterns

1. **Pure Functions**: Token verification logic with no side effects
2. **Dependency Injection**: Token verifier passed as function parameter
3. **Comprehensive Logging**: Correlation IDs throughout auth flow
4. **RFC Compliance**: Proper OAuth 2.1 error responses (RFC 6750, RFC 8707)
5. **TDD Throughout**: Unit → Integration → E2E test coverage

## Why These Files Were Deleted

The implementation returned **HTTP 401** responses with `WWW-Authenticate` headers for authentication failures. This is standard OAuth behavior, but the OpenAI Apps SDK requires:

1. **All responses must be HTTP 200**
2. Auth errors must be in MCP response `_meta` field: `_meta["mcp/www_authenticate"]`

No amount of middleware refactoring could bridge this gap - the SDK rejects HTTP 401 before processing responses.

## Replacement Architecture

See: `tool-level-auth-architecture.md` (TODO: create this file)

The new architecture:

- Moves auth checking from HTTP middleware to tool handlers
- Uses AsyncLocalStorage to propagate request context
- Returns HTTP 200 with MCP `_meta` for all auth errors
- Compatible with OpenAI Apps SDK

## Lessons Applied to New Architecture

From this implementation we kept:

- Pure function approach for token verification (`verify-clerk-token.ts`)
- Dependency injection patterns
- Logging strategy with correlation IDs
- Test coverage strategy
- Resource parameter validation (RFC 8707)

## Restoration Information

These files were restored from git history on 2025-11-24 using:

```bash
git show HEAD:apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth.ts > mcp-auth.ts
# ... etc for each file
```

All files represent the state at the time of deletion.












