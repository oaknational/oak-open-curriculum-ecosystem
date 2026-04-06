---
name: verify-before-propagating
category: process
status: active
discovered: 2026-04-06
proven_by: "MCP Apps SDK font embedding assumption corrected 3 times; single-callback-slot claim carried from napkin to distilled.md without source verification"
---

# Verify Claims Against Primary Sources Before Propagating

## Pattern

Before writing a technical claim into a plan, TSDoc, or governance
document, verify it against the primary source (API docs, installed
source, specification). Do not carry forward claims from session notes
or prior plans without re-checking.

## Anti-pattern

A technical claim is stated in a session (e.g. "the SDK has only one
callback slot"). It is recorded in the napkin. It is distilled into
`distilled.md`. It is cited in TSDoc. It is repeated in plans. At no
point does anyone read the actual source to check — and the claim is
wrong.

## Why it matters

Ephemeral notes are hypotheses. Permanent documentation is assertions.
The distillation pipeline (`napkin → distilled.md → permanent docs`)
amplifies confidence without adding evidence. Each step feels more
authoritative than the last, but none of them verified the original
observation.

## When to apply

- Before writing a claim about SDK/library behaviour into TSDoc or
  governance docs
- Before carrying a napkin observation into `distilled.md`
- When a plan cites a technical constraint — verify it still holds
- When a user corrects you — check the source immediately, do not
  rationalise
