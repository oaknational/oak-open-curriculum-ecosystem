---
name: "CLI Flag Over Env Precedence"
use_this_when: "A CLI command accepts both explicit flags and environment defaults for the same setting, and hidden defaults previously caused ambiguous behaviour."
category: code
proven_in: "apps/oak-search-cli/src/cli/shared/resolve-bulk-dir.ts"
proven_date: 2026-03-11
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Hidden path defaults and command-specific precedence drift that produce surprising runtime behaviour."
  stable: true
---

When a command supports both a flag and an env default for the same value, resolve with one shared function and a fixed precedence:

1. explicit CLI flag
2. env variable
3. fail fast with a single actionable error

Do not duplicate precedence logic per command and do not keep hidden hardcoded defaults. Shared resolution avoids drift between command surfaces and makes tests straightforward.

Anti-pattern:

- each command decides precedence independently
- some commands use hardcoded defaults while others use env
- missing input silently falls back to repo-relative paths

Preferred shape:

- one pure resolver returning `Result<T, E>`
- command handlers call it before creating network clients
- tests assert flag-wins/env-fallback/missing-fails behaviour once
