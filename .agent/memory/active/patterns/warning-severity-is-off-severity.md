---
name: "Warning Severity Is Off Severity"
use_this_when: "Setting or reviewing lint rule severity, especially when considering 'warn' as a transitional step toward 'error'"
category: process
proven_in: "packages/core/oak-eslint — testRules had consistent-type-assertions at warn, allowing 13 violations to accumulate across 4 workspaces unnoticed"
proven_date: 2026-04-14
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Rules at warn severity accumulate violations silently because warnings scroll past in CI output and are never blocking"
  stable: true
---

# Warning Severity Is Off Severity

## Problem

A lint rule is set to `'warn'` — typically as a transitional step
("we'll promote it to `'error'` once the existing violations are
fixed") or as a softer enforcement ("flag it but don't block").
Over time, warnings accumulate because they never block CI, they
scroll past in terminal output, and nobody triages non-blocking
output. The rule is effectively disabled.

## Pattern

If a rule matters, set it to `'error'`. If it doesn't matter,
remove it. There is no useful middle ground.

When a rule has existing violations that prevent immediate
promotion to `'error'`:

1. Fix the existing violations first, then enable at `'error'`.
2. If fixes are non-trivial, track them as explicit work items
   with a deadline — not as a `'warn'` rule that will be
   "promoted later."

## Anti-Pattern

"We'll set it to `'warn'` for now and promote it to `'error'`
once the existing issues are cleaned up." The cleanup never
happens because the rule never blocks. New violations
accumulate alongside the old ones.

## The Resolution

Audit all `'warn'` rules. For each: either fix violations and
promote to `'error'`, or delete the rule. A lint configuration
should contain only `'error'` and `'off'` — never `'warn'`.
