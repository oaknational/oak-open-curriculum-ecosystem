---
related_pdr: PDR-012
name: Pre-implementation plan review
category: process
status: proven
proven_by: "2026-04-10 (7 blocking findings), 2026-04-11 (12 findings resolved)"
---

# Pre-implementation plan review

Run specialist reviewers against **plan files** before writing any code.

## The principle

Complex implementation work benefits from review at the plan stage,
not just at the code stage. Specialist reviewers can assess plans for
architectural soundness, protocol compliance, type safety, and
boundary correctness — all before any code is written.

## The anti-pattern

Write the plan, then immediately implement, then discover fundamental
premise errors or design issues during code review. By then, rework
is expensive — the code exists and must be rewritten.

## When to apply

Before beginning implementation of any plan that:

- Introduces a new data source or integration
- Creates new MCP surfaces (tools, resources, prompts)
- Touches architectural boundaries (SDK, app, codegen layers)
- Has parameters, scoring, or algorithm design decisions

## Evidence

**Session 2026-04-10**: 4 specialist reviewers (betty, barney, mcp,
code) against 5 plan files caught 7 blocking findings and 9 design
changes before any code was written.

**Session 2026-04-11**: 12 pre-implementation findings on the EEF
plan were resolved with precise Zod schemas derived from actual JSON
structure — before a single line of implementation code was written.
Without this, the implementation would have used `Record<string, unknown>`
for 2 fields, missed 3 rare optional fields, and used the wrong URI
scheme.
