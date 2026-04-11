---
name: "Conformance tests for library adoption"
use_this_when: "Replacing hand-rolled code with a library import and keeping existing unit tests"
category: testing
proven_in: "apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/verify-clerk-token.unit.test.ts"
proven_date: 2026-03-26
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Library upgrades silently changing behaviour that callers depend on"
  stable: true
---

# Conformance Tests for Library Adoption

## Pattern

When replacing a hand-rolled function with an equivalent library import, retain
the existing unit tests as **conformance tests** rather than deleting them. Update
the import to point at the library function. The tests now serve as a contract
sentinel: they prove the library matches your expected behaviour and will fail if
a future library version drifts.

## Anti-Pattern

Deleting the unit tests when the implementation file is deleted. This leaves no
guard against library behaviour changes — callers discover breakage at runtime
rather than in CI.

## Checklist

1. Update the test import to point at the library (not the deleted local file)
2. Update TSDoc to explain the conformance role and list all call sites guarded
3. Add a version-bump reminder in the test TSDoc
4. Add a `console.error` / `console.warn` spy if the library adds logging the
   hand-rolled version did not have — this detects logging noise on upgrade
5. Pin the library version conservatively (tilde for pre-1.0 packages)
6. Document the adoption decision in an ADR with a re-evaluation trigger
