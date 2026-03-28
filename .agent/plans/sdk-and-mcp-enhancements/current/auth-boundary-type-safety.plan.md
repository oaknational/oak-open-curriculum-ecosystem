---
name: "Auth Boundary Type Safety"
overview: "Eliminate the req.auth type conflict between Clerk and MCP SDK, add Zod validation at the res.locals boundary, and close the Record<string, unknown> ESLint enforcement gap."
source_research:
  - "./mcp-runtime-boundary-simplification.plan.md"
specialist_reviewer: "type-reviewer"
todos:
  - id: task-1-remove-global-augmentation
    content: "Task 1: Remove the global Express.Request augmentation for req.auth and fix all consumers."
    status: done
  - id: task-1-remediation
    content: "Task 1 remediation: Make auth optional in global augmentation, add explicit type annotation to Object.assign (9-reviewer finding A, 2026-03-28)."
    status: pending
  - id: task-2-zod-validation-at-locals
    content: "Task 2: Add Zod validation at the res.locals.authInfo read site to replace the type assertion."
    status: done
  - id: task-2-remediation
    content: "Task 2 remediation: Replace .loose() with .strict(), use safeParse instead of parse, extract to shared module (9-reviewer findings B+D+E, 2026-03-28)."
    status: pending
  - id: task-3-eslint-record-unknown
    content: "Task 3: Add ESLint rule to ban Record<string, unknown> in eslint-plugin-standards."
    status: done
isProject: false
---

# Auth Boundary Type Safety

**Last Updated**: 2026-03-28
**Status**: Tasks 1-3 done; Task 1+2 remediations pending (Phase 7 findings A, B, D, E)
**Scope**: Eliminate type assertions and enforcement gaps identified during
Phase 6 of the MCP Runtime Boundary Simplification.

## Why This Plan Exists

Phase 6 reviewer passes identified three interconnected type safety issues:

1. `handlers.ts` uses `as unknown as` to bridge `req.auth` between Clerk
   (callable) and MCP SDK (object) — but both types are **declared by our
   code**, not by the libraries. The conflict is self-inflicted.
2. `handlers.ts` uses `as AuthInfo | undefined` to read `res.locals.authInfo`
   — trusting middleware wrote the right type, with no runtime validation.
3. `Record<string, unknown>` is banned by project rules but has no ESLint
   enforcement. A developer can use it and only a reviewer (human or agent)
   would catch it.

All three tasks are independent and can be done in any order.

---

## Task 1: Remove the Global Express.Request Augmentation

### Problem

`apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/types.ts` lines
43–54 declare:

```typescript
declare global {
  namespace Express {
    interface Request {
      auth?: ClerkRequestAuth;
    }
  }
}
```

This makes `req.auth` typed as `ClerkRequestAuth` (a callable) on every
Express Request in the app. But `handlers.ts` overwrites `req.auth` with
`AuthInfo` (an object) before passing to the MCP SDK. The two types are
incompatible, forcing a `as unknown as` double-cast.

The global augmentation exists because:
1. `test-fixtures/mock-clerk-middleware.ts:52` sets `req.auth = () => ({...})`
2. `test-fixtures/mock-clerk-middleware.ts:78` reads `req.auth?.()`
3. `auth-response-helpers.ts:184` has a stale comment referencing it

No production code reads `req.auth` as `ClerkRequestAuth`. Production code
uses `getAuth(req)` from `@clerk/express`, which handles typing internally.

### Fix

1. **Delete** the `declare global` block from `types.ts`
2. **Delete** `ClerkRequestAuth` type (zero production consumers)
3. **Fix** `mock-clerk-middleware.ts`: type `req` locally with the Clerk auth
   shape instead of relying on global augmentation. Options:
   - Use `(req as { auth?: () => AuthObject }).auth = ...` locally in the
     test fixture
   - Or better: refactor the mock to use `getAuth` injection (DI) rather
     than monkey-patching `req.auth`
4. **Remove** stale comment in `auth-response-helpers.ts:184`
5. **Simplify** the cast in `handlers.ts`: without the conflicting
   augmentation, `req` (Express.Request extending IncomingMessage) can be
   assigned `auth` without the `as unknown as` hop — the property simply
   doesn't exist on the declared type, so a single structural assertion
   suffices: `(req as IncomingMessage & { auth?: AuthInfo }).auth = authInfo`

### Acceptance Criteria

- Zero `as unknown as` in `handlers.ts`
- Zero `declare global` augmentations for `req.auth`
- `ClerkRequestAuth` type deleted
- `pnpm type-check && pnpm test && pnpm test:e2e` green

### Required Reviewers

- `type-reviewer` — assertion elimination
- `clerk-reviewer` — Clerk integration correctness
- `mcp-reviewer` — `req.auth` contract with MCP SDK

---

## Task 2: Zod Validation at the `res.locals.authInfo` Boundary

### Problem

`handlers.ts:160` reads `res.locals.authInfo as AuthInfo | undefined`. This
trusts the middleware wrote the correct type. If the middleware is ever changed
to write a different shape, the assertion silently accepts it and the wrong
value propagates into `extra.authInfo`.

### Fix

Replace the assertion with a Zod parse:

```typescript
import { z } from 'zod';

const authInfoSchema = z.object({
  token: z.string(),
  clientId: z.string(),
  scopes: z.array(z.string()),
  extra: z.record(z.unknown()),
}).optional();

// In createMcpHandler:
const authInfo = authInfoSchema.parse(res.locals.authInfo);
```

This converts the trust relationship into a checked boundary. Cost: one parse
per request against a 4-field struct (negligible).

### RED test first

Write a test that passes a malformed `res.locals.authInfo` (e.g.,
`{ token: 123 }`) and asserts the handler rejects it rather than silently
propagating the wrong type.

### Acceptance Criteria

- Zero `as AuthInfo | undefined` assertion in `handlers.ts`
- Zero `eslint-disable` for `consistent-type-assertions` at the `res.locals`
  read site
- Malformed auth data is caught at the handler, not silently propagated
- `pnpm type-check && pnpm test && pnpm test:e2e` green

### Required Reviewers

- `type-reviewer` — assertion elimination
- `security-reviewer` — auth boundary validation

---

## Task 3: ESLint Rule for `Record<string, unknown>`

### Problem

The `Record<string, unknown>` ban exists in three documents:
- `.agent/directives/principles.md`
- `docs/governance/typescript-practice.md`
- `.agent/rules/strict-validation-at-boundary.md`

But there is no ESLint rule enforcing it. A developer or agent can write
`Record<string, unknown>` and only a reviewer catch will prevent it.

### Fix

Add a rule to `packages/core/oak-eslint-plugin-standards/` that flags:
- `Record<string, unknown>`
- `{ [key: string]: unknown }`
- `{ [k: string]: unknown }`

With a permitted exception for `process.env` boundary access (documented in
`typescript-practice.md`).

### Implementation

Use `@typescript-eslint/no-restricted-types` or a custom rule in
`eslint-plugin-standards`. The existing plugin already encodes architectural
decisions as enforceable checks.

### Acceptance Criteria

- `Record<string, unknown>` triggers a lint error with a message referencing
  the principle
- `process.env` exception is documented and tested
- All existing code passes (no pre-existing violations, or violations are
  fixed)
- `pnpm lint && pnpm test` green

### Required Reviewers

- `config-reviewer` — ESLint configuration
- `type-reviewer` — rule correctness

---

## Remediation (2026-03-28)

9-reviewer comprehensive pass found that Tasks 1 and 2 need refinement:

### Task 1 Remediation (Finding A)

The original Task 1 replaced `auth?: ClerkRequestAuth` with
`auth: (options?: PendingSessionOptions) => AuthObject` (non-optional, using
Clerk's official types directly). However, `handlers.ts:195` overwrites
`req.auth` with `AuthInfo` via `Object.assign`. Making `auth` non-optional and
a callable type creates a type-system lie: downstream code thinks `req.auth` is
always a callable, but at runtime it's `AuthInfo | undefined` after mutation.

**Fix**: Make `auth` optional again. Add explicit `IncomingMessage & { auth?:
AuthInfo }` type annotation to the `Object.assign` result. This is tracked as
finding A in the simplification plan Phase 7.

### Task 2 Remediation (Findings B + D + E)

The original Task 2 added `authInfoSchema.parse()` with Zod validation.
Three refinements needed:

1. **B**: Replace `.loose()` with `.strict()` — fail fast on unknown fields
2. **D**: Use `safeParse` instead of `parse` — handle errors explicitly rather
   than throwing unstructured ZodError
3. **E**: Extract `authInfoSchema` to a shared `auth-info-schema.ts` module —
   currently split across `handlers.ts` and `check-mcp-client-auth.ts`

These are tracked as findings B, D, and E in the simplification plan Phase 7.

## Dependencies

- All three tasks are independent of each other
- Tasks 1 and 2 touch `handlers.ts` — if done in the same session, sequence
  Task 1 before Task 2 to avoid merge conflicts
- Task 3 touches `packages/core/` — independent of the app layer
- Task 1 and 2 remediations are part of Phase 7 of the simplification plan

## References

- Phase 6 type-reviewer findings (2026-03-27)
- `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/types.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/test-fixtures/mock-clerk-middleware.ts`
- `packages/core/oak-eslint-plugin-standards/`
- `.agent/rules/strict-validation-at-boundary.md`
