---
name: Zod Boundaries in Sandbox-Harness Modules
polarity: pattern
use_this_when: Authoring or reviewing a module whose files are esbuild-bundled into a sandboxed harness artefact (Workflow scripts, agent prompts), or whose zod refinements guard stage-boundary invariants
category: code
layer: family
proven_in: .agent/memory/active/archive/napkin-2026-07-20.md (2026-07-16, restatement-audit module build + review rounds)
proven_date: 2026-07-16
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "A sandbox bundle silently swallowing zod's whole source through a co-located import (blowing the harness char cap), and refine-carried invariants silently vanishing from derived JSON schemas so sub-floor data passes the boundary"
  stable: true
---

> **POLARITY: PATTERN.** Two zod boundary disciplines for harness-artefact
> modules, both invisible to unit tests.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern).

## Move 1 — Sandbox-bundled files must be zod-free AT THE FILE LEVEL

Any file value-imported into a sandbox-bundled entry must contain no zod at
the file level — not merely "its own top-level schema is substituted
elsewhere". esbuild bundles CO-LOCATED, unrelated schemas through any other
import path in the same file: a pure helper sharing a file with a zod schema
dragged zod's entire source into the bundle and blew the harness's script
char cap. Cure shape: split the type-only surface (sandbox-safe, imports
types with `import type`) from the schema file (Node-side zod, value-imported
only by non-bundled code).

**Verify by actually running the bundler** — a passing unit-test suite gives
zero signal on this class; the bundle build is the test.

## Move 2 — Refinements do not reach derived JSON schemas

`z.refine(...)` invariants vanish when a zod schema is converted to a
derived JSON schema (e.g. for structured-output enforcement): the agent-side
schema cannot reject sub-floor rows the refine would have caught. Any
refine-carried invariant needs a code-side recompute at the stage boundary
where the data re-enters trusted code. Strict validation at the boundary
means the boundary the data ACTUALLY crosses, not the schema definition it
started from.
